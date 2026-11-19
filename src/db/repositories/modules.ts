import { newId } from '@/lib/id';
import { nowIso } from '@/lib/time';
import type { QhazeDatabase } from '../database';
import { guardedWrite } from '../guards';
import { assertValidReferences } from '../integrity';
import { DIFFICULTY_LEVELS, MODULE_SECTIONS, type DifficultyLevel, type Lecture, type LocalizedText, type Module, type ModuleSection } from '../types';
import { LIMITS, ValidationError, type FieldErrors } from './university';

/**
 * Course structure writes: modules and the lecture outline inside them (Phase 2 seeding).
 * Lecture CONTENT (the 20-section template) is authored in Phase 3; here a lecture is its
 * title, order, estimated duration and difficulty, with `sections: []`.
 *
 * Same guarantees as every curriculum write: field validation, unique order within the
 * parent, `assertValidReferences`, and `guardedWrite` (rollback on any new integrity issue).
 * A lecture's `courseId` is always derived from its module, so the two can never disagree.
 */

const clean = (t: LocalizedText | undefined): LocalizedText => {
  const ms = t?.ms?.trim() ?? '';
  const en = t?.en?.trim();
  return en ? { ms, en } : { ms };
};

function checkTitle(errors: FieldErrors, field: string, text: LocalizedText | undefined, max: number, required: boolean) {
  const ms = text?.ms?.trim() ?? '';
  if (required && !ms) errors[`${field}.ms`] = 'required';
  else if (ms.length > max) errors[`${field}.ms`] = 'too_long';
  if ((text?.en?.trim().length ?? 0) > max) errors[`${field}.en`] = 'too_long';
}

const isInt = (v: unknown, min: number, max: number) => typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;

// ─── Modules ───────────────────────────────────────────────────────────────

export interface ModuleInput {
  courseId: string;
  order: number;
  title: LocalizedText;
  description?: LocalizedText;
}

export function validateModule(input: ModuleInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.courseId) errors.courseId = 'required';
  if (!isInt(input.order, 1, 999)) errors.order = 'invalid_number';
  checkTitle(errors, 'title', input.title, LIMITS.name * 2, true);
  checkTitle(errors, 'description', input.description, LIMITS.description, false);
  return errors;
}

export async function createModule(db: QhazeDatabase, input: ModuleInput): Promise<Module> {
  const errors = validateModule(input);
  if (Object.keys(errors).length) throw new ValidationError(errors);
  return guardedWrite(db, async () => {
    const clash = await db.modules.where('[courseId+order]').equals([input.courseId, input.order]).first();
    if (clash) throw new ValidationError({ order: 'order_taken' });
    const now = nowIso();
    const row: Module = {
      id: newId(),
      courseId: input.courseId,
      order: input.order,
      title: clean(input.title),
      description: clean(input.description),
      createdAt: now,
      updatedAt: now,
    };
    await assertValidReferences(db, 'modules', row as never);
    await db.modules.add(row);
    return row;
  });
}

// ─── Module learning materials ─────────────────────────────────────────────

/** Longest accepted body per section and language (characters). */
export const MODULE_SECTION_MAX = 40_000;

/**
 * Save a module's own learning materials (MODULE_SECTIONS). Writes only `sections` and its timestamps on the
 * existing module record: title, description, order and every other record (lectures, progress, notes, bookmarks)
 * are untouched. Drafts are allowed — completeness is judged by `validateModuleContent`, not enforced on save.
 * Sections left empty in both languages are not stored.
 */
export async function saveModuleContent(db: QhazeDatabase, moduleId: string, sections: ModuleSection[]): Promise<Module> {
  const errors: FieldErrors = {};
  const seen = new Set<string>();
  const kept: ModuleSection[] = [];
  for (const s of sections) {
    if (!(MODULE_SECTIONS as readonly string[]).includes(s.kind)) errors[`sections.${s.kind}`] = 'invalid_choice';
    else if (seen.has(s.kind)) errors[`sections.${s.kind}`] = 'order_taken';
    seen.add(s.kind);
    const ms = typeof s.body?.ms === 'string' ? s.body.ms.trim() : '';
    const en = typeof s.body?.en === 'string' ? s.body.en.trim() : '';
    if (ms.length > MODULE_SECTION_MAX || en.length > MODULE_SECTION_MAX) errors[`sections.${s.kind}`] = 'too_long';
    if (ms || en) kept.push({ kind: s.kind, body: en ? { ms, en } : { ms } });
  }
  if (Object.keys(errors).length) throw new ValidationError(errors);
  kept.sort((a, b) => MODULE_SECTIONS.indexOf(a.kind) - MODULE_SECTIONS.indexOf(b.kind));
  return guardedWrite(db, async () => {
    const existing = await db.modules.get(moduleId);
    if (!existing) throw new ValidationError({ moduleId: 'not_found' });
    const now = nowIso();
    const row: Module = { ...existing, sections: kept, contentSource: 'local', contentUpdatedAt: now, updatedAt: now };
    await db.modules.put(row);
    return row;
  });
}

// ─── Lectures ──────────────────────────────────────────────────────────────

export interface LectureInput {
  moduleId: string;
  order: number;
  title: LocalizedText;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
}

export function validateLecture(input: LectureInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.moduleId) errors.moduleId = 'required';
  if (!isInt(input.order, 1, 999)) errors.order = 'invalid_number';
  checkTitle(errors, 'title', input.title, LIMITS.name * 2, true);
  if (!isInt(input.estimatedMinutes, 5, 600)) errors.estimatedMinutes = 'invalid_number';
  if (!DIFFICULTY_LEVELS.includes(input.difficulty)) errors.difficulty = 'invalid_choice';
  return errors;
}

export async function createLecture(db: QhazeDatabase, input: LectureInput): Promise<Lecture> {
  const errors = validateLecture(input);
  if (Object.keys(errors).length) throw new ValidationError(errors);
  return guardedWrite(db, async () => {
    const module = await db.modules.get(input.moduleId);
    if (!module) throw new ValidationError({ moduleId: 'not_found' });
    const clash = await db.lectures.where('[moduleId+order]').equals([input.moduleId, input.order]).first();
    if (clash) throw new ValidationError({ order: 'order_taken' });
    const now = nowIso();
    const row: Lecture = {
      id: newId(),
      moduleId: module.id,
      courseId: module.courseId, // derived — cannot disagree with the module (integrity rule 8)
      order: input.order,
      title: clean(input.title),
      estimatedMinutes: input.estimatedMinutes,
      difficulty: input.difficulty,
      sections: [],
      createdAt: now,
      updatedAt: now,
    };
    await assertValidReferences(db, 'lectures', row as never);
    await db.lectures.add(row);
    return row;
  });
}

