import { newId } from '@/lib/id';
import { nowIso } from '@/lib/time';
import type { QhazeDatabase } from '../database';
import { deleteRecord, guardedWrite, logActivity, planDelete, type DeletePlan } from '../guards';
import { assertValidReferences } from '../integrity';
import {
  DIFFICULTY_LEVELS,
  type AcademicProgramme,
  type Academy,
  type Course,
  type CoursePrerequisite,
  type DifficultyLevel,
  type Faculty,
  type LocalizedText,
  type RecordStatus,
  type Reference as BookReference,
  type Semester,
} from '../types';

/**
 * University management write operations (Phase 2).
 *
 * Every write:
 *  1. validates fields (→ `ValidationError` with per-field codes for the form),
 *  2. checks code uniqueness (friendly error instead of a raw ConstraintError),
 *  3. runs `assertValidReferences` (FK, consistency, prerequisite cycles) for the record,
 *  4. runs inside `guardedWrite`, which rolls back if ANY new integrity issue appears.
 *
 * Parent links that other records depend on are immutable after creation:
 * programme.academyId, semester.programmeId, and the programme of a course.
 * (academy.facultyId may change; a course may move between semesters of its programme.)
 */

export type FieldErrorCode =
  | 'required'
  | 'too_long'
  | 'invalid_code'
  | 'code_taken'
  | 'invalid_number'
  | 'number_taken'
  | 'below_existing'
  | 'level_order'
  | 'invalid_choice'
  | 'immutable'
  | 'order_taken'
  | 'not_found';

export type FieldErrors = Record<string, FieldErrorCode>;

export class ValidationError extends Error {
  constructor(public readonly fields: FieldErrors) {
    super(`validation_failed: ${Object.entries(fields).map(([k, v]) => `${k}=${v}`).join(', ')}`);
    this.name = 'ValidationError';
  }
}

// ─── Field validation helpers ──────────────────────────────────────────────

const CODE_RE = /^[A-Z0-9][A-Z0-9-]{0,19}$/;
export const normaliseCode = (code: string) => code.trim().toUpperCase();

export const LIMITS = { name: 120, description: 2000, listItem: 300, listLength: 50 } as const;

function checkLocalized(errors: FieldErrors, field: string, text: LocalizedText | undefined, max: number, required: boolean) {
  const ms = text?.ms?.trim() ?? '';
  const en = text?.en?.trim() ?? '';
  if (required && !ms) errors[`${field}.ms`] = 'required';
  else if (ms.length > max) errors[`${field}.ms`] = 'too_long';
  if (en.length > max) errors[`${field}.en`] = 'too_long';
}

function checkInt(errors: FieldErrors, field: string, value: unknown, min: number, max: number) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) errors[field] = 'invalid_number';
}

function checkCode(errors: FieldErrors, code: string) {
  if (!code) errors.code = 'required';
  else if (!CODE_RE.test(code)) errors.code = 'invalid_code';
}

function checkList(errors: FieldErrors, field: string, items: LocalizedText[] | undefined) {
  if (!items) return;
  if (items.length > LIMITS.listLength) errors[field] = 'too_long';
  items.forEach((item, i) => checkLocalized(errors, `${field}.${i}`, item, LIMITS.listItem, true));
}

const cleanText = (t: LocalizedText | undefined): LocalizedText => {
  const ms = t?.ms?.trim() ?? '';
  const en = t?.en?.trim();
  return en ? { ms, en } : { ms };
};
const cleanList = (items: LocalizedText[] | undefined) => (items ?? []).map(cleanText).filter((i) => i.ms);

const STATUSES: RecordStatus[] = ['draft', 'active', 'archived'];

async function assertCodeFree(db: QhazeDatabase, table: 'faculties' | 'academies' | 'programmes' | 'courses', code: string, selfId?: string) {
  const existing = await db.table(table).where('code').equals(code).first();
  if (existing && existing.id !== selfId) throw new ValidationError({ code: 'code_taken' });
}

function throwIf(errors: FieldErrors) {
  if (Object.keys(errors).length) throw new ValidationError(errors);
}

// ─── Faculties ─────────────────────────────────────────────────────────────

export interface FacultyInput {
  code: string;
  name: LocalizedText;
  description?: LocalizedText;
  order: number;
  status?: RecordStatus;
  icon?: string;
}

export function validateFaculty(input: FacultyInput): FieldErrors {
  const errors: FieldErrors = {};
  checkCode(errors, normaliseCode(input.code));
  checkLocalized(errors, 'name', input.name, LIMITS.name, true);
  checkLocalized(errors, 'description', input.description, LIMITS.description, false);
  checkInt(errors, 'order', input.order, 0, 9999);
  if (input.status && !STATUSES.includes(input.status)) errors.status = 'invalid_choice';
  return errors;
}

export async function createFaculty(db: QhazeDatabase, input: FacultyInput): Promise<Faculty> {
  throwIf(validateFaculty(input));
  return guardedWrite(db, async () => {
    const code = normaliseCode(input.code);
    await assertCodeFree(db, 'faculties', code);
    const now = nowIso();
    const row: Faculty = {
      id: newId(),
      code,
      name: cleanText(input.name),
      description: cleanText(input.description),
      order: input.order,
      status: input.status ?? 'active',
      icon: input.icon,
      createdAt: now,
      updatedAt: now,
    };
    await assertValidReferences(db, 'faculties', row as never);
    await db.faculties.add(row);
    await logActivity(db, 'curriculum.created', { entity: 'faculty', code });
    return row;
  });
}

export async function updateFaculty(db: QhazeDatabase, id: string, input: FacultyInput): Promise<Faculty> {
  throwIf(validateFaculty(input));
  return guardedWrite(db, async () => {
    const current = await db.faculties.get(id);
    if (!current) throw new ValidationError({ id: 'not_found' });
    const code = normaliseCode(input.code);
    await assertCodeFree(db, 'faculties', code, id);
    const row: Faculty = {
      ...current,
      code,
      name: cleanText(input.name),
      description: cleanText(input.description),
      order: input.order,
      status: input.status ?? current.status,
      icon: input.icon ?? current.icon,
      updatedAt: nowIso(),
    };
    await db.faculties.put(row);
    await logActivity(db, 'curriculum.updated', { entity: 'faculty', code });
    return row;
  });
}

// ─── Academies ─────────────────────────────────────────────────────────────

export interface AcademyInput {
  facultyId: string;
  code: string;
  name: LocalizedText;
  description?: LocalizedText;
  order: number;
  status?: RecordStatus;
  icon?: string;
}

export function validateAcademy(input: AcademyInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.facultyId) errors.facultyId = 'required';
  checkCode(errors, normaliseCode(input.code));
  checkLocalized(errors, 'name', input.name, LIMITS.name, true);
  checkLocalized(errors, 'description', input.description, LIMITS.description, false);
  checkInt(errors, 'order', input.order, 0, 9999);
  if (input.status && !STATUSES.includes(input.status)) errors.status = 'invalid_choice';
  return errors;
}

export async function createAcademy(db: QhazeDatabase, input: AcademyInput): Promise<Academy> {
  throwIf(validateAcademy(input));
  return guardedWrite(db, async () => {
    const code = normaliseCode(input.code);
    await assertCodeFree(db, 'academies', code);
    const now = nowIso();
    const row: Academy = {
      id: newId(),
      facultyId: input.facultyId,
      code,
      name: cleanText(input.name),
      description: cleanText(input.description),
      order: input.order,
      status: input.status ?? 'active',
      icon: input.icon,
      createdAt: now,
      updatedAt: now,
    };
    await assertValidReferences(db, 'academies', row as never);
    await db.academies.add(row);
    await logActivity(db, 'curriculum.created', { entity: 'academy', code });
    return row;
  });
}

/** An academy may move to another faculty (no consistency rule depends on faculty). */
export async function updateAcademy(db: QhazeDatabase, id: string, input: AcademyInput): Promise<Academy> {
  throwIf(validateAcademy(input));
  return guardedWrite(db, async () => {
    const current = await db.academies.get(id);
    if (!current) throw new ValidationError({ id: 'not_found' });
    const code = normaliseCode(input.code);
    await assertCodeFree(db, 'academies', code, id);
    const row: Academy = {
      ...current,
      facultyId: input.facultyId,
      code,
      name: cleanText(input.name),
      description: cleanText(input.description),
      order: input.order,
      status: input.status ?? current.status,
      icon: input.icon ?? current.icon,
      updatedAt: nowIso(),
    };
    await assertValidReferences(db, 'academies', row as never);
    await db.academies.put(row);
    await logActivity(db, 'curriculum.updated', { entity: 'academy', code });
    return row;
  });
}

// ─── Programmes ────────────────────────────────────────────────────────────

export interface ProgrammeInput {
  academyId: string;
  code: string;
  name: LocalizedText;
  description?: LocalizedText;
  totalSemesters: number;
  entryLevel: DifficultyLevel;
  exitLevel: DifficultyLevel;
  completionRequirements?: LocalizedText[];
  status?: RecordStatus;
}

export const MAX_SEMESTERS = 20;

export function validateProgramme(input: ProgrammeInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.academyId) errors.academyId = 'required';
  checkCode(errors, normaliseCode(input.code));
  checkLocalized(errors, 'name', input.name, LIMITS.name, true);
  checkLocalized(errors, 'description', input.description, LIMITS.description, false);
  checkInt(errors, 'totalSemesters', input.totalSemesters, 1, MAX_SEMESTERS);
  if (!DIFFICULTY_LEVELS.includes(input.entryLevel)) errors.entryLevel = 'invalid_choice';
  if (!DIFFICULTY_LEVELS.includes(input.exitLevel)) errors.exitLevel = 'invalid_choice';
  if (!errors.entryLevel && !errors.exitLevel && DIFFICULTY_LEVELS.indexOf(input.exitLevel) < DIFFICULTY_LEVELS.indexOf(input.entryLevel)) {
    errors.exitLevel = 'level_order';
  }
  checkList(errors, 'completionRequirements', input.completionRequirements);
  if (input.status && !STATUSES.includes(input.status)) errors.status = 'invalid_choice';
  return errors;
}

/**
 * Create a programme. By default its semesters 1..totalSemesters are created with it,
 * so the structure is immediately usable (titles can be edited afterwards).
 */
export async function createProgramme(
  db: QhazeDatabase,
  input: ProgrammeInput,
  options: { createSemesters?: boolean } = {},
): Promise<AcademicProgramme> {
  throwIf(validateProgramme(input));
  return guardedWrite(db, async () => {
    const code = normaliseCode(input.code);
    await assertCodeFree(db, 'programmes', code);
    const now = nowIso();
    const row: AcademicProgramme = {
      id: newId(),
      academyId: input.academyId,
      code,
      name: cleanText(input.name),
      description: cleanText(input.description),
      totalSemesters: input.totalSemesters,
      entryLevel: input.entryLevel,
      exitLevel: input.exitLevel,
      completionRequirements: cleanList(input.completionRequirements),
      status: input.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    };
    await assertValidReferences(db, 'programmes', row as never);
    await db.programmes.add(row);
    if (options.createSemesters ?? true) {
      for (let n = 1; n <= row.totalSemesters; n++) {
        await db.semesters.add({
          id: newId(),
          programmeId: row.id,
          number: n,
          title: { ms: `Semester ${n}`, en: `Semester ${n}` },
          description: { ms: '' },
          createdAt: now,
          updatedAt: now,
        });
      }
    }
    await logActivity(db, 'curriculum.created', { entity: 'programme', code });
    return row;
  });
}

/** `academyId` is immutable; `totalSemesters` cannot drop below an existing semester number. */
export async function updateProgramme(db: QhazeDatabase, id: string, input: ProgrammeInput): Promise<AcademicProgramme> {
  throwIf(validateProgramme(input));
  return guardedWrite(db, async () => {
    const current = await db.programmes.get(id);
    if (!current) throw new ValidationError({ id: 'not_found' });
    if (input.academyId !== current.academyId) throw new ValidationError({ academyId: 'immutable' });
    const code = normaliseCode(input.code);
    await assertCodeFree(db, 'programmes', code, id);
    const highest = (await db.semesters.where('programmeId').equals(id).toArray()).reduce((m, s) => Math.max(m, s.number), 0);
    if (input.totalSemesters < highest) throw new ValidationError({ totalSemesters: 'below_existing' });
    const row: AcademicProgramme = {
      ...current,
      code,
      name: cleanText(input.name),
      description: cleanText(input.description),
      totalSemesters: input.totalSemesters,
      entryLevel: input.entryLevel,
      exitLevel: input.exitLevel,
      completionRequirements: cleanList(input.completionRequirements),
      status: input.status ?? current.status,
      updatedAt: nowIso(),
    };
    await db.programmes.put(row);
    await logActivity(db, 'curriculum.updated', { entity: 'programme', code });
    return row;
  });
}

// ─── Semesters ─────────────────────────────────────────────────────────────

export interface SemesterInput {
  programmeId: string;
  number: number;
  title: LocalizedText;
  description?: LocalizedText;
}

export function validateSemester(input: SemesterInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.programmeId) errors.programmeId = 'required';
  checkInt(errors, 'number', input.number, 1, MAX_SEMESTERS);
  checkLocalized(errors, 'title', input.title, LIMITS.name, true);
  checkLocalized(errors, 'description', input.description, LIMITS.description, false);
  return errors;
}

async function assertSemesterSlot(db: QhazeDatabase, input: SemesterInput, selfId?: string) {
  const programme = await db.programmes.get(input.programmeId);
  if (!programme) throw new ValidationError({ programmeId: 'not_found' });
  if (input.number > programme.totalSemesters) throw new ValidationError({ number: 'invalid_number' });
  const clash = await db.semesters.where('[programmeId+number]').equals([input.programmeId, input.number]).first();
  if (clash && clash.id !== selfId) throw new ValidationError({ number: 'number_taken' });
}

export async function createSemester(db: QhazeDatabase, input: SemesterInput): Promise<Semester> {
  throwIf(validateSemester(input));
  return guardedWrite(db, async () => {
    await assertSemesterSlot(db, input);
    const now = nowIso();
    const row: Semester = {
      id: newId(),
      programmeId: input.programmeId,
      number: input.number,
      title: cleanText(input.title),
      description: cleanText(input.description),
      createdAt: now,
      updatedAt: now,
    };
    await assertValidReferences(db, 'semesters', row as never);
    await db.semesters.add(row);
    await logActivity(db, 'curriculum.created', { entity: 'semester', code: `#${row.number}` });
    return row;
  });
}

/** `programmeId` is immutable. The number may change if the slot is free. */
export async function updateSemester(db: QhazeDatabase, id: string, input: SemesterInput): Promise<Semester> {
  throwIf(validateSemester(input));
  return guardedWrite(db, async () => {
    const current = await db.semesters.get(id);
    if (!current) throw new ValidationError({ id: 'not_found' });
    if (input.programmeId !== current.programmeId) throw new ValidationError({ programmeId: 'immutable' });
    await assertSemesterSlot(db, input, id);
    const row: Semester = {
      ...current,
      number: input.number,
      title: cleanText(input.title),
      description: cleanText(input.description),
      updatedAt: nowIso(),
    };
    await assertValidReferences(db, 'semesters', row as never);
    await db.semesters.put(row);
    await logActivity(db, 'curriculum.updated', { entity: 'semester', code: `#${row.number}` });
    return row;
  });
}

/** Lowest semester number of a programme that is not yet used (or undefined if full). */
export async function nextFreeSemesterNumber(db: QhazeDatabase, programmeId: string): Promise<number | undefined> {
  const programme = await db.programmes.get(programmeId);
  if (!programme) return undefined;
  const used = new Set((await db.semesters.where('programmeId').equals(programmeId).toArray()).map((s) => s.number));
  for (let n = 1; n <= programme.totalSemesters; n++) if (!used.has(n)) return n;
  return undefined;
}

// ─── Courses ───────────────────────────────────────────────────────────────

export interface CourseInput {
  /** The programme is derived from the semester. */
  semesterId: string;
  code: string;
  title: LocalizedText;
  description?: LocalizedText;
  creditHours: number;
  difficulty: DifficultyLevel;
  learningObjectives?: LocalizedText[];
  learningOutcomes?: LocalizedText[];
  references?: BookReference[];
  status?: RecordStatus;
}

export function validateCourse(input: CourseInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.semesterId) errors.semesterId = 'required';
  checkCode(errors, normaliseCode(input.code));
  checkLocalized(errors, 'title', input.title, LIMITS.name, true);
  checkLocalized(errors, 'description', input.description, LIMITS.description, false);
  checkInt(errors, 'creditHours', input.creditHours, 0, 30);
  if (!DIFFICULTY_LEVELS.includes(input.difficulty)) errors.difficulty = 'invalid_choice';
  checkList(errors, 'learningObjectives', input.learningObjectives);
  checkList(errors, 'learningOutcomes', input.learningOutcomes);
  if (input.references && input.references.length > LIMITS.listLength) errors.references = 'too_long';
  input.references?.forEach((r, i) => {
    if (!r.title?.trim()) errors[`references.${i}`] = 'required';
  });
  if (input.status && !STATUSES.includes(input.status)) errors.status = 'invalid_choice';
  return errors;
}

export async function createCourse(db: QhazeDatabase, input: CourseInput): Promise<Course> {
  throwIf(validateCourse(input));
  return guardedWrite(db, async () => {
    const semester = await db.semesters.get(input.semesterId);
    if (!semester) throw new ValidationError({ semesterId: 'not_found' });
    const code = normaliseCode(input.code);
    await assertCodeFree(db, 'courses', code);
    const now = nowIso();
    const row: Course = {
      id: newId(),
      programmeId: semester.programmeId,
      semesterId: semester.id,
      code,
      title: cleanText(input.title),
      description: cleanText(input.description),
      creditHours: input.creditHours,
      difficulty: input.difficulty,
      learningObjectives: cleanList(input.learningObjectives),
      learningOutcomes: cleanList(input.learningOutcomes),
      references: (input.references ?? []).map((r) => ({ ...r, title: r.title.trim() })),
      status: input.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    };
    await assertValidReferences(db, 'courses', row as never);
    await db.courses.add(row);
    await logActivity(db, 'curriculum.created', { entity: 'course', code });
    return row;
  });
}

/** A course may move to another semester of the SAME programme only. */
export async function updateCourse(db: QhazeDatabase, id: string, input: CourseInput): Promise<Course> {
  throwIf(validateCourse(input));
  return guardedWrite(db, async () => {
    const current = await db.courses.get(id);
    if (!current) throw new ValidationError({ id: 'not_found' });
    const semester = await db.semesters.get(input.semesterId);
    if (!semester) throw new ValidationError({ semesterId: 'not_found' });
    if (semester.programmeId !== current.programmeId) throw new ValidationError({ semesterId: 'immutable' });
    const code = normaliseCode(input.code);
    await assertCodeFree(db, 'courses', code, id);
    const row: Course = {
      ...current,
      semesterId: semester.id,
      code,
      title: cleanText(input.title),
      description: cleanText(input.description),
      creditHours: input.creditHours,
      difficulty: input.difficulty,
      learningObjectives: cleanList(input.learningObjectives),
      learningOutcomes: cleanList(input.learningOutcomes),
      references: (input.references ?? []).map((r) => ({ ...r, title: r.title.trim() })),
      status: input.status ?? current.status,
      updatedAt: nowIso(),
    };
    await assertValidReferences(db, 'courses', row as never);
    await db.courses.put(row);
    await logActivity(db, 'curriculum.updated', { entity: 'course', code });
    return row;
  });
}

// ─── Prerequisites ─────────────────────────────────────────────────────────

/**
 * Add "course requires prerequisiteCourse". Rejected (nothing written) if either course is
 * missing, the link already exists, it is a self-prerequisite, or it would create a cycle.
 */
export async function addPrerequisite(
  db: QhazeDatabase,
  courseId: string,
  prerequisiteCourseId: string,
  kind: 'required' | 'recommended' = 'required',
): Promise<CoursePrerequisite> {
  return guardedWrite(db, async () => {
    const exists = await db.coursePrerequisites.where('[courseId+prerequisiteCourseId]').equals([courseId, prerequisiteCourseId]).first();
    if (exists) throw new ValidationError({ prerequisiteCourseId: 'code_taken' });
    const now = nowIso();
    const row: CoursePrerequisite = { id: newId(), courseId, prerequisiteCourseId, kind, createdAt: now, updatedAt: now };
    await assertValidReferences(db, 'coursePrerequisites', row as never); // includes cycle detection
    await db.coursePrerequisites.add(row);
    const [c, p] = await Promise.all([db.courses.get(courseId), db.courses.get(prerequisiteCourseId)]);
    await logActivity(db, 'curriculum.updated', { entity: 'prerequisite', code: `${c?.code} ← ${p?.code}` });
    return row;
  });
}

export async function removePrerequisite(db: QhazeDatabase, id: string): Promise<void> {
  await deleteRecord(db, 'coursePrerequisites', id, { type: 'curriculum.updated', details: { entity: 'prerequisite', code: '−' } });
}

// ─── Archive / delete (all entity types) ───────────────────────────────────

export type CurriculumTable = 'faculties' | 'academies' | 'programmes' | 'semesters' | 'courses';

const ENTITY_NAME: Record<CurriculumTable, string> = {
  faculties: 'faculty',
  academies: 'academy',
  programmes: 'programme',
  semesters: 'semester',
  courses: 'course',
};

/** Archive (soft-hide) or restore a record. Archived records keep all their links. */
export async function setStatus(db: QhazeDatabase, table: Exclude<CurriculumTable, 'semesters'>, id: string, status: RecordStatus): Promise<void> {
  if (!STATUSES.includes(status)) throw new ValidationError({ status: 'invalid_choice' });
  await guardedWrite(db, async () => {
    const current = (await db.table(table).get(id)) as { code: string } | undefined;
    if (!current) throw new ValidationError({ id: 'not_found' });
    await db.table(table).update(id, { status, updatedAt: nowIso() });
    await logActivity(db, status === 'archived' ? 'curriculum.archived' : 'curriculum.restored', { entity: ENTITY_NAME[table], code: current.code });
  });
}

/** What deleting this record would do (for the confirmation dialog). */
export function previewDelete(db: QhazeDatabase, table: CurriculumTable, id: string): Promise<DeletePlan> {
  return planDelete(db, table, id);
}

/**
 * Permanently delete a curriculum record. Throws `ReferencedRecordError` (nothing deleted)
 * while anything else references it; owned children (a programme's empty semesters, a
 * course's own prerequisite links) are removed with it.
 */
export async function deleteCurriculumRecord(db: QhazeDatabase, table: CurriculumTable, id: string): Promise<DeletePlan> {
  const current = (await db.table(table).get(id)) as { code?: string; number?: number } | undefined;
  if (!current) throw new ValidationError({ id: 'not_found' });
  return deleteRecord(db, table, id, {
    type: 'curriculum.deleted',
    details: { entity: ENTITY_NAME[table], code: current.code ?? `#${current.number}` },
  });
}
