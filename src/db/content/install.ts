import { newId } from '@/lib/id';
import { nowIso } from '@/lib/time';
import { createSnapshot } from '../backup/backup';
import type { QhazeDatabase } from '../database';
import { guardedWrite, logActivity } from '../guards';
import type { Lecture } from '../types';
import type { ContentPackage, GlossaryTermDef } from './types';
import { validateContentPackage, validateLectureSections } from './validate';

/**
 * Course-material installer. Same safety procedure as curriculum packages:
 * validate → dry run → pre-seed recovery point → ONE guarded transaction → idempotent.
 * Lecture content is written only onto lectures that already exist (structure first).
 */

export const CONTENT_META_KEY = 'contentPackages';

export interface ContentPlan {
  errors: string[];
  /** Lectures addressed by the package that are not in the database (structure not installed). */
  missing: string[];
  lecturesToWrite: number;
  lecturesUpToDate: number;
  glossaryToWrite: number;
  glossaryUpToDate: number;
}

export class ContentInstallError extends Error {
  constructor(public readonly problems: string[]) {
    super(`content_install_blocked: ${problems.join('; ')}`);
    this.name = 'ContentInstallError';
  }
}

async function findLecture(db: QhazeDatabase, courseCode: string, module: number, lecture: number): Promise<Lecture | undefined> {
  const course = await db.courses.where('code').equals(courseCode).first();
  if (!course) return undefined;
  const mod = await db.modules.where('[courseId+order]').equals([course.id, module]).first();
  if (!mod) return undefined;
  return db.lectures.where('[moduleId+order]').equals([mod.id, lecture]).first();
}

/** Validated write of a lecture's authored sections (repository function). */
export async function setLectureContent(db: QhazeDatabase, lectureId: string, pkg: ContentPackage, def: ContentPackage['lectures'][number]) {
  const stored = await db.glossaryTerms.toArray();
  const keys = new Set([...pkg.glossary.map((g) => g.key), ...stored.map((g) => g.key)]);
  const scope = new Map([...stored.map((g) => [g.key, g.scope] as const), ...pkg.glossary.map((g) => [g.key, g.scope] as const)]);
  const problems = validateLectureSections(def.sections, `${def.courseCode} ${def.module}.${def.lecture}`, keys, scope);
  if (problems.length) throw new ContentInstallError(problems);
  return guardedWrite(db, async () => {
    await db.lectures.update(lectureId, { sections: def.sections, contentVersion: pkg.version, updatedAt: nowIso() });
  });
}

/** Validated create-or-update of a glossary term by key (repository function). */
export async function upsertGlossaryTerm(db: QhazeDatabase, def: GlossaryTermDef, version: string) {
  return guardedWrite(db, async () => {
    const existing = await db.glossaryTerms.where('key').equals(def.key).first();
    const now = nowIso();
    if (existing) await db.glossaryTerms.put({ ...existing, ...def, version, updatedAt: now });
    else await db.glossaryTerms.add({ ...def, id: newId(), version, createdAt: now, updatedAt: now });
  });
}

export async function planContentInstall(db: QhazeDatabase, pkg: ContentPackage): Promise<ContentPlan> {
  const plan: ContentPlan = { errors: validateContentPackage(pkg), missing: [], lecturesToWrite: 0, lecturesUpToDate: 0, glossaryToWrite: 0, glossaryUpToDate: 0 };
  for (const g of pkg.glossary) {
    const existing = await db.glossaryTerms.where('key').equals(g.key).first();
    if (existing?.version === pkg.version) plan.glossaryUpToDate++;
    else plan.glossaryToWrite++;
  }
  for (const l of pkg.lectures) {
    const lecture = await findLecture(db, l.courseCode, l.module, l.lecture);
    if (!lecture) plan.missing.push(`${l.courseCode} ${l.module}.${l.lecture}`);
    else if (lecture.contentVersion === pkg.version) plan.lecturesUpToDate++;
    else plan.lecturesToWrite++;
  }
  return plan;
}

export async function installContentPackage(db: QhazeDatabase, pkg: ContentPackage) {
  const plan = await planContentInstall(db, pkg);
  if (plan.errors.length || plan.missing.length) {
    throw new ContentInstallError([...plan.errors, ...plan.missing.map((m) => `lecture ${m} not found — install the curriculum package first`)]);
  }
  if (plan.lecturesToWrite + plan.glossaryToWrite === 0) return { written: 0, snapshotId: undefined };
  const snapshot = await createSnapshot(db, 'pre-seed');
  const written = await guardedWrite(db, async () => {
    let n = 0;
    for (const g of pkg.glossary) {
      const existing = await db.glossaryTerms.where('key').equals(g.key).first();
      if (existing?.version === pkg.version) continue;
      await upsertGlossaryTerm(db, g, pkg.version);
      n++;
    }
    for (const l of pkg.lectures) {
      const lecture = (await findLecture(db, l.courseCode, l.module, l.lecture))!;
      if (lecture.contentVersion === pkg.version) continue;
      await setLectureContent(db, lecture.id, pkg, l);
      n++;
    }
    const meta = ((await db.meta.get(CONTENT_META_KEY))?.value as Record<string, unknown> | undefined) ?? {};
    await db.meta.put({ key: CONTENT_META_KEY, value: { ...meta, [pkg.id]: { version: pkg.version, installedAt: nowIso() } } });
    await logActivity(db, 'curriculum.installed', { code: `${pkg.id}@${pkg.version}`, created: n });
    return n;
  });
  return { written, snapshotId: snapshot.id };
}
