/** Phase 2 Step 0 — delete protection, guarded writes and save-time validation for university management. */
import { describe, expect, it } from 'vitest';
import { findReferencingRecords, guardedWrite, planDelete, ReferencedRecordError } from '@/db/guards';
import { checkDatabaseIntegrity, IntegrityError } from '@/db/integrity';
import { createStudent } from '@/db/repositories/student';
import {
  addPrerequisite,
  createAcademy,
  createCourse,
  createFaculty,
  createProgramme,
  createSemester,
  deleteCurriculumRecord,
  nextFreeSemesterNumber,
  removePrerequisite,
  setStatus,
  updateAcademy,
  updateCourse,
  updateFaculty,
  updateProgramme,
  updateSemester,
  ValidationError,
  type CourseInput,
} from '@/db/repositories/university';
import type { QhazeDatabase } from '@/db/database';
import { freshDb } from '@/test/helpers';

const L = (ms: string, en?: string) => (en ? { ms, en } : { ms });
const T = '2026-01-01T00:00:00.000Z';

async function fieldErrors(p: Promise<unknown>) {
  const err = await p.catch((e: unknown) => e);
  expect(err).toBeInstanceOf(ValidationError);
  return (err as ValidationError).fields;
}

/** Faculty → academy → programme (3 semesters, auto-created) → 2 courses. */
async function build(db: QhazeDatabase) {
  const faculty = await createFaculty(db, { code: 'f01', name: L('Pengaturcaraan', 'Programming'), order: 1 });
  const academy = await createAcademy(db, { facultyId: faculty.id, code: 'f01-py', name: L('Akademi Python', 'Python Academy'), order: 1 });
  const programme = await createProgramme(db, {
    academyId: academy.id,
    code: 'py-dip',
    name: L('Diploma Python'),
    totalSemesters: 3,
    entryLevel: 'absolute_beginner',
    exitLevel: 'professional',
  });
  const semesters = await db.semesters.where('programmeId').equals(programme.id).sortBy('number');
  const courseInput = (semesterId: string, code: string): CourseInput => ({
    semesterId,
    code,
    title: L(`Kursus ${code}`),
    creditHours: 3,
    difficulty: 'beginner',
    learningObjectives: [L('Memahami variable', 'Understand variables')],
  });
  const c1 = await createCourse(db, courseInput(semesters[0]!.id, 'py101'));
  const c2 = await createCourse(db, courseInput(semesters[1]!.id, 'py201'));
  return { faculty, academy, programme, semesters, c1, c2, courseInput };
}

describe('create & validate', () => {
  it('creates the hierarchy with normalised codes, bilingual names and auto-created semesters', async () => {
    const db = await freshDb();
    const { faculty, academy, programme, semesters, c1 } = await build(db);
    expect(faculty.code).toBe('F01');
    expect(academy.name).toEqual({ ms: 'Akademi Python', en: 'Python Academy' });
    expect(semesters.map((s) => s.number)).toEqual([1, 2, 3]);
    expect(c1).toMatchObject({ code: 'PY101', programmeId: programme.id, semesterId: semesters[0]!.id });
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);
    expect(await db.activityLog.where('type').equals('curriculum.created').count()).toBe(5);
  });

  it('returns per-field errors and writes nothing', async () => {
    const db = await freshDb();
    expect(await fieldErrors(createFaculty(db, { code: 'bad code!', name: L(''), order: -1 }))).toEqual({
      code: 'invalid_code',
      'name.ms': 'required',
      order: 'invalid_number',
    });
    expect(await db.faculties.count()).toBe(0);
  });

  it('rejects duplicate codes (case-insensitive)', async () => {
    const db = await freshDb();
    await createFaculty(db, { code: 'F01', name: L('A'), order: 1 });
    expect(await fieldErrors(createFaculty(db, { code: 'f01', name: L('B'), order: 2 }))).toEqual({ code: 'code_taken' });
  });

  it('rejects an academy whose faculty does not exist (save-time FK validation)', async () => {
    const db = await freshDb();
    const err = await createAcademy(db, { facultyId: 'missing', code: 'X', name: L('X'), order: 1 }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(IntegrityError);
    expect(await db.academies.count()).toBe(0);
  });

  it('programme: exit level cannot be below entry level', async () => {
    const db = await freshDb();
    const { academy } = await build(db);
    expect(
      await fieldErrors(createProgramme(db, { academyId: academy.id, code: 'X', name: L('X'), totalSemesters: 2, entryLevel: 'advanced', exitLevel: 'beginner' })),
    ).toEqual({ exitLevel: 'level_order' });
  });
});

describe('update rules', () => {
  it('programme academy is immutable; totalSemesters cannot drop below existing semesters', async () => {
    const db = await freshDb();
    const { programme, faculty } = await build(db);
    const other = await createAcademy(db, { facultyId: faculty.id, code: 'OTHER', name: L('Lain'), order: 2 });
    const base = { ...programme, completionRequirements: [] };
    expect(await fieldErrors(updateProgramme(db, programme.id, { ...base, academyId: other.id }))).toEqual({ academyId: 'immutable' });
    expect(await fieldErrors(updateProgramme(db, programme.id, { ...base, totalSemesters: 2 }))).toEqual({ totalSemesters: 'below_existing' });
    const grown = await updateProgramme(db, programme.id, { ...base, totalSemesters: 4 });
    expect(grown.totalSemesters).toBe(4);
    expect(await nextFreeSemesterNumber(db, programme.id)).toBe(4);
  });

  it('semester: programme immutable, number must be free and within range', async () => {
    const db = await freshDb();
    const { programme, semesters } = await build(db);
    const s1 = semesters[0]!;
    expect(await fieldErrors(createSemester(db, { programmeId: programme.id, number: 2, title: L('Dua') }))).toEqual({ number: 'number_taken' });
    expect(await fieldErrors(createSemester(db, { programmeId: programme.id, number: 4, title: L('Empat') }))).toEqual({ number: 'invalid_number' });
    expect(await fieldErrors(updateSemester(db, s1.id, { programmeId: 'other', number: 1, title: L('X') }))).toEqual({ programmeId: 'immutable' });
    const renamed = await updateSemester(db, s1.id, { programmeId: programme.id, number: 1, title: L('Asas', 'Foundations') });
    expect(renamed.title.en).toBe('Foundations');
  });

  it('course: may move within its programme, never across programmes', async () => {
    const db = await freshDb();
    const { academy, semesters, c1, courseInput } = await build(db);
    const moved = await updateCourse(db, c1.id, courseInput(semesters[2]!.id, 'PY101'));
    expect(moved.semesterId).toBe(semesters[2]!.id);
    const other = await createProgramme(db, { academyId: academy.id, code: 'OTHER', name: L('Lain'), totalSemesters: 1, entryLevel: 'beginner', exitLevel: 'beginner' });
    const otherSem = (await db.semesters.where('programmeId').equals(other.id).first())!;
    expect(await fieldErrors(updateCourse(db, c1.id, courseInput(otherSem.id, 'PY101')))).toEqual({ semesterId: 'immutable' });
  });

  it('a move that would contradict a student study session is rolled back (multi-record impact)', async () => {
    const db = await freshDb();
    const { programme, semesters, c1, courseInput } = await build(db);
    const student = await createStudent(db, { fullName: 'A', preferredName: 'A' });
    await db.studySessions.add({
      id: 'ss', studentId: student.id, startedAt: T, endedAt: T, durationMinutes: 30, activityType: 'lecture',
      programmeId: programme.id, semesterId: semesters[0]!.id, courseId: c1.id, completed: true, source: 'manual', createdAt: T, updatedAt: T,
    });
    const err = await updateCourse(db, c1.id, courseInput(semesters[1]!.id, 'PY101')).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(IntegrityError);
    expect((err as IntegrityError).issues[0]?.kind).toBe('inconsistent_reference');
    expect((await db.courses.get(c1.id))?.semesterId).toBe(semesters[0]!.id); // unchanged
  });

  it('academy may move to another faculty; faculty update keeps its id', async () => {
    const db = await freshDb();
    const { faculty, academy } = await build(db);
    const f2 = await createFaculty(db, { code: 'F02', name: L('AI'), order: 2 });
    const moved = await updateAcademy(db, academy.id, { ...academy, facultyId: f2.id });
    expect(moved.facultyId).toBe(f2.id);
    const f = await updateFaculty(db, faculty.id, { ...faculty, name: L('Kejuruteraan Perisian', 'Software Engineering') });
    expect(f.id).toBe(faculty.id);
  });
});

describe('prerequisites (cycle detection before saving)', () => {
  it('adds, refuses duplicates/self/cycles, and removes', async () => {
    const db = await freshDb();
    const { semesters, c1, c2, courseInput } = await build(db);
    const c3 = await createCourse(db, courseInput(semesters[2]!.id, 'PY301'));

    const link = await addPrerequisite(db, c2.id, c1.id);
    await addPrerequisite(db, c3.id, c2.id, 'recommended');
    expect(await fieldErrors(addPrerequisite(db, c2.id, c1.id))).toEqual({ prerequisiteCourseId: 'code_taken' });

    const self = await addPrerequisite(db, c1.id, c1.id).catch((e: unknown) => e);
    expect((self as IntegrityError).issues.map((i) => i.kind)).toEqual(['self_prerequisite']);

    const cycle = await addPrerequisite(db, c1.id, c3.id).catch((e: unknown) => e);
    expect(cycle).toBeInstanceOf(IntegrityError);
    expect((cycle as IntegrityError).issues[0]?.detail).toContain('Circular prerequisites');
    expect(await db.coursePrerequisites.count()).toBe(2); // nothing written

    await removePrerequisite(db, link.id);
    expect(await db.coursePrerequisites.count()).toBe(1);
    // With c2 → c1 gone, c1 → c3 no longer closes a cycle.
    await addPrerequisite(db, c1.id, c3.id);
  });

  it('allows prerequisites across programmes (e.g. Python before Machine Learning)', async () => {
    const db = await freshDb();
    const { academy, c1, courseInput } = await build(db);
    const ml = await createProgramme(db, { academyId: academy.id, code: 'ML', name: L('ML'), totalSemesters: 1, entryLevel: 'intermediate', exitLevel: 'advanced' });
    const mlSem = (await db.semesters.where('programmeId').equals(ml.id).first())!;
    const mlCourse = await createCourse(db, courseInput(mlSem.id, 'ML101'));
    await addPrerequisite(db, mlCourse.id, c1.id);
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);
  });
});

describe('delete protection', () => {
  it('blocks deleting a faculty that still has academies, and deletes nothing', async () => {
    const db = await freshDb();
    const { faculty, academy } = await build(db);
    const err = await deleteCurriculumRecord(db, 'faculties', faculty.id).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ReferencedRecordError);
    expect((err as ReferencedRecordError).references).toEqual([{ table: 'academies', id: academy.id, field: 'facultyId' }]);
    expect(await db.faculties.count()).toBe(1);
  });

  it('deletes an unreferenced faculty and logs it', async () => {
    const db = await freshDb();
    const f = await createFaculty(db, { code: 'EMPTY', name: L('Kosong'), order: 9 });
    await deleteCurriculumRecord(db, 'faculties', f.id);
    expect(await db.faculties.get(f.id)).toBeUndefined();
    expect(await db.activityLog.where('type').equals('curriculum.deleted').count()).toBe(1);
  });

  it('a programme takes its EMPTY semesters with it, but is blocked while a semester has courses', async () => {
    const db = await freshDb();
    const { academy, programme } = await build(db);
    const plan = await planDelete(db, 'programmes', programme.id);
    expect(plan.blockers.map((b) => b.table).sort()).toEqual(['courses', 'courses']);

    const empty = await createProgramme(db, { academyId: academy.id, code: 'EMPTY', name: L('Kosong'), totalSemesters: 2, entryLevel: 'beginner', exitLevel: 'beginner' });
    const result = await deleteCurriculumRecord(db, 'programmes', empty.id);
    expect(result.toDelete.map((d) => d.table)).toEqual(['programmes', 'semesters', 'semesters']);
    expect(await db.semesters.where('programmeId').equals(empty.id).count()).toBe(0);
  });

  it("a course takes its own prerequisite links with it, but is blocked while another course requires it", async () => {
    const db = await freshDb();
    const { c1, c2 } = await build(db);
    await addPrerequisite(db, c2.id, c1.id);
    await expect(deleteCurriculumRecord(db, 'courses', c1.id)).rejects.toBeInstanceOf(ReferencedRecordError);
    await deleteCurriculumRecord(db, 'courses', c2.id); // owns the c2 → c1 link
    expect(await db.coursePrerequisites.count()).toBe(0);
    await deleteCurriculumRecord(db, 'courses', c1.id); // now free
    expect(await db.courses.count()).toBe(0);
  });

  it('protects student records: a course with progress, notes or study sessions cannot be deleted', async () => {
    const db = await freshDb();
    const { c1 } = await build(db);
    const student = await createStudent(db, { fullName: 'A', preferredName: 'A' });
    await db.progress.add({ id: 'pg', studentId: student.id, entityType: 'course', entityId: c1.id, status: 'in_progress', percent: 10, createdAt: T, updatedAt: T });
    await db.notes.add({ id: 'n', studentId: student.id, entityType: 'course', entityId: c1.id, kind: 'note', title: 'x', body: 'y', tags: [], createdAt: T, updatedAt: T });
    const refs = await findReferencingRecords(db, 'courses', c1.id);
    expect(refs.map((r) => r.table).sort()).toEqual(['notes', 'progress']);
    await expect(deleteCurriculumRecord(db, 'courses', c1.id)).rejects.toBeInstanceOf(ReferencedRecordError);
    expect(await db.progress.count()).toBe(1);
    expect(await db.notes.count()).toBe(1);
  });

  it('finds array references (assessment → exercise)', async () => {
    const db = await freshDb();
    const { academy, c1 } = await build(db);
    await db.exercises.add({ id: 'e', code: 'E1', academyId: academy.id, courseId: c1.id, type: 'debugging', difficulty: 'beginner', title: L('E'), instructions: L(''), learningObjective: L(''), hints: [], assessmentCriteria: [], maxScore: 5, createdAt: T, updatedAt: T });
    await db.assessments.add({ id: 'q', courseId: c1.id, type: 'quiz', title: L('Q'), weight: 5, exerciseIds: ['e'], createdAt: T, updatedAt: T });
    expect(await findReferencingRecords(db, 'exercises', 'e')).toEqual([{ table: 'assessments', id: 'q', field: 'exerciseIds' }]);
  });
});

describe('guardedWrite', () => {
  it('rolls back every write in the block when a new integrity issue appears', async () => {
    const db = await freshDb();
    const { faculty } = await build(db);
    const err = await guardedWrite(db, async () => {
      await db.faculties.update(faculty.id, { order: 42 });
      await db.academies.add({ id: 'orphan', facultyId: 'nowhere', code: 'ORPHAN', name: L('x'), description: L(''), order: 1, status: 'active', createdAt: T, updatedAt: T });
    }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(IntegrityError);
    expect(await db.academies.get('orphan')).toBeUndefined();
    expect((await db.faculties.get(faculty.id))?.order).toBe(1);
  });

  it('pre-existing issues do not block unrelated edits', async () => {
    const db = await freshDb();
    const { faculty } = await build(db);
    await db.academies.add({ id: 'legacy', facultyId: 'nowhere', code: 'LEGACY', name: L('x'), description: L(''), order: 1, status: 'active', createdAt: T, updatedAt: T });
    await updateFaculty(db, faculty.id, { ...faculty, order: 5 });
    expect((await db.faculties.get(faculty.id))?.order).toBe(5);
  });
});

describe('archive', () => {
  it('archives and restores without touching links', async () => {
    const db = await freshDb();
    const { academy } = await build(db);
    await setStatus(db, 'academies', academy.id, 'archived');
    expect((await db.academies.get(academy.id))?.status).toBe('archived');
    await setStatus(db, 'academies', academy.id, 'active');
    expect((await db.academies.get(academy.id))?.status).toBe('active');
    expect(await db.activityLog.where('type').anyOf('curriculum.archived', 'curriculum.restored').count()).toBe(2);
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);
  });
});
