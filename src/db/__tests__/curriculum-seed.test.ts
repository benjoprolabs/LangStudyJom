/** Curriculum Seeding — Milestone 1: specification fidelity, curriculum quality and safe installation. */
import { describe, expect, it } from 'vitest';
import { restoreSnapshot } from '@/db/backup/backup';
import { planDelete } from '@/db/guards';
import { checkDatabaseIntegrity } from '@/db/integrity';
import { createStudent } from '@/db/repositories/student';
import { updateSettings } from '@/db/repositories/settings';
import { createAcademy, createCourse, createFaculty, createProgramme } from '@/db/repositories/university';
import { installPackage, PackageInstallError, planInstall, PACKAGES_META_KEY } from '@/db/seed/install';
import { UNIVERSITY_CORE_M1 } from '@/db/seed/packages';
import { FACULTIES, FACULTY_01_ACADEMIES } from '@/db/seed/packages/faculties';
import { PYTHON_PROGRAMME } from '@/db/seed/packages/python-programme';
import { countPackage, validatePackage } from '@/db/seed/validate';
import type { CurriculumPackage } from '@/db/seed/types';
import { DIFFICULTY_LEVELS } from '@/db/types';
import { freshDb } from '@/test/helpers';

/** Master specification, Part 3 — verbatim. */
const SPEC_FACULTIES = [
  'Programming & Software Engineering',
  'Artificial Intelligence',
  'Game Development',
  'Mathematics & Computer Science',
  'Data Science & Engineering',
  '3D Design & Digital Production',
  'Music Technology & Production',
];
const SPEC_F01_ACADEMIES = [
  'Computer Science Academy',
  'Python Programming Academy',
  'Lua Programming Academy',
  'Luau Programming Academy',
  'JavaScript Academy',
  'TypeScript Academy',
  'C Programming Academy',
  'C++ Programming Academy',
  'Java Programming Academy',
  'Web Development Academy',
  'Full-Stack Development Academy',
  'Software Engineering Academy',
  'Data Structures & Algorithms Academy',
  'API Development Academy',
  'Database Programming Academy',
];
/** Master specification, Part 4 — Python semesters 1–3 topic lists. */
const SPEC_PYTHON_TOPICS: Record<number, string[]> = {
  1: ['Introduction', 'Variables', 'Data Types', 'Operators', 'Conditions', 'Loops', 'Functions'],
  2: ['Lists', 'Tuples', 'Dictionaries', 'Sets', 'String', 'File Handling', 'Exception Handling'],
  3: ['Object-Oriented Programming', 'Modules', 'Packages', 'Advanced Functions', 'Iterators', 'Generators', 'Decorators'],
};

const courses = PYTHON_PROGRAMME.semesters.flatMap((s) => s.courses);
const clone = (): CurriculumPackage => structuredClone(UNIVERSITY_CORE_M1);
const lvl = (d: string) => DIFFICULTY_LEVELS.indexOf(d as never);

describe('specification fidelity', () => {
  it('defines exactly the 7 faculties of the specification, in order, with codes F01–F07', () => {
    expect(FACULTIES.map((f) => f.name.en)).toEqual(SPEC_FACULTIES);
    expect(FACULTIES.map((f) => f.code)).toEqual(['F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07']);
    expect(FACULTIES.every((f) => f.name.ms && f.name.ms !== f.name.en && f.description.ms && f.description.en)).toBe(true);
  });

  it("defines exactly Faculty 01's 15 academies, verbatim and in specification order", () => {
    expect(FACULTY_01_ACADEMIES.map((a) => a.name.en)).toEqual(SPEC_F01_ACADEMIES);
    expect(FACULTY_01_ACADEMIES.every((a) => a.facultyCode === 'F01')).toBe(true);
    expect(new Set(FACULTY_01_ACADEMIES.map((a) => a.code)).size).toBe(15);
  });

  it('keeps Lua and Luau as separate academies and states the difference', () => {
    const lua = FACULTY_01_ACADEMIES.find((a) => a.code === 'F01-LUA')!;
    const luau = FACULTY_01_ACADEMIES.find((a) => a.code === 'F01-LUAU')!;
    expect(lua.description.en).toContain('Excludes Roblox APIs');
    expect(luau.description.en).toContain('Differences from standard Lua');
  });

  it('milestone scope: academies only for Faculty 01, one programme (Python) only', () => {
    expect(new Set(UNIVERSITY_CORE_M1.academies.map((a) => a.facultyCode))).toEqual(new Set(['F01']));
    expect(UNIVERSITY_CORE_M1.programmes.map((p) => p.academyCode)).toEqual(['F01-PY']);
  });
});

describe('Python programme — curriculum quality', () => {
  it('passes the package validator with no problems', () => {
    expect(validatePackage(UNIVERSITY_CORE_M1)).toEqual([]);
  });

  it('has 8 semesters, each with at least 3 courses', () => {
    expect(PYTHON_PROGRAMME.semesters.map((s) => s.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(PYTHON_PROGRAMME.semesters.every((s) => s.courses.length >= 3)).toBe(true);
  });

  it.each([1, 2, 3])('semester %i covers every topic of the specification (Part 4)', (n) => {
    const semester = PYTHON_PROGRAMME.semesters[n - 1]!;
    const corpus = semester.courses
      .flatMap((c) => [c.title.en, ...c.modules.flatMap((m) => [m.title.en, ...m.lectures.map((l) => l.title.en)])])
      .join(' | ')
      .toLowerCase();
    const missing = SPEC_PYTHON_TOPICS[n]!.filter((topic) => !corpus.includes(topic.toLowerCase()));
    expect(missing).toEqual([]);
  });

  it('progresses from absolute beginner to professional without ever going backwards', () => {
    expect(courses[0]!.difficulty).toBe('absolute_beginner');
    expect(courses.at(-1)!.difficulty).toBe('professional');
    let previousMax = -1;
    for (const s of PYTHON_PROGRAMME.semesters) {
      const levels = s.courses.map((c) => lvl(c.difficulty));
      expect(Math.min(...levels)).toBeGreaterThanOrEqual(previousMax);
      previousMax = Math.max(...levels);
    }
  });

  it('every course is complete: description, objectives, outcomes, references, ≥4 modules of ≥3 lectures', () => {
    for (const c of courses) {
      expect(c.description.ms.length, c.code).toBeGreaterThan(80);
      expect(c.description.en?.length, c.code).toBeGreaterThan(80);
      expect(c.objectives.length, c.code).toBeGreaterThanOrEqual(4);
      expect(c.outcomes.length, c.code).toBeGreaterThanOrEqual(3);
      expect(c.references.length, c.code).toBeGreaterThanOrEqual(1);
      expect(c.modules.length, c.code).toBeGreaterThanOrEqual(4);
      expect(c.modules.every((m) => m.lectures.length >= 3), c.code).toBe(true);
    }
  });

  it('is genuinely bilingual: Malay and English differ except for preserved technical terms', () => {
    for (const c of courses) {
      expect(c.title.ms, c.code).not.toBe(c.title.en);
      expect(c.description.ms, c.code).not.toBe(c.description.en);
    }
    // The teaching standard preserves English technical terminology; a title may be identical in
    // both languages ONLY when it is such a term (listed explicitly here).
    const PRESERVED_TERMS = ['NumPy', 'Matplotlib', 'Flask', 'asyncio', 'Observability', 'Web Scraping', 'Deployment', 'Test-Driven Development', 'Refactoring', 'Operator overloading'];
    const titles = courses.flatMap((c) => c.modules.flatMap((m) => [m.title, ...m.lectures.map((l) => l.title)]));
    const identical = titles.filter((t) => t.ms === t.en).map((t) => t.en ?? '');
    expect(identical.filter((t) => !PRESERVED_TERMS.includes(t))).toEqual([]);
  });

  it('uses no duplicate course codes or titles', () => {
    expect(new Set(courses.map((c) => c.code)).size).toBe(courses.length);
    expect(new Set(courses.map((c) => c.title.en)).size).toBe(courses.length);
  });

  it('prerequisites: every course after PY101 builds on an earlier one; none point forward; no cycles', () => {
    expect(courses.filter((c) => c.prerequisites.length === 0).map((c) => c.code)).toEqual(['PY101']);
    // validatePackage enforces "never forward" and "no cycles"; spot-check key dependencies too.
    const pre = (code: string) => courses.find((c) => c.code === code)!.prerequisites.map((p) => p.code);
    expect(pre('PY201')).toEqual(['PY114']); // OOP after files & exceptions
    expect(pre('PY312')).toEqual(['PY311', 'PY302']); // APIs need web + async
    expect(pre('PY411')).toEqual(['PY403', 'PY312']); // AI engineering needs ML + APIs
    expect(courses.find((c) => c.code === 'PY490')!.prerequisites).toContainEqual({ code: 'PY411', kind: 'recommended' });
  });

  it('completion requirements match the actual course count and credit total', () => {
    const counts = countPackage(UNIVERSITY_CORE_M1);
    expect(counts.courses).toBe(31);
    const text = PYTHON_PROGRAMME.completionRequirements.map((r) => r.en).join(' ');
    expect(text).toContain(`Pass all ${counts.courses} courses`);
    expect(text).toContain(`Earn at least ${counts.creditHours} credit hours`);
  });
});

describe('package validator catches bad curricula', () => {
  const firstCourse = (p: CurriculumPackage) => p.programmes[0]!.semesters[0]!.courses[0]!;
  it.each<[string, (p: CurriculumPackage) => void, string]>([
    ['a prerequisite cycle', (p) => firstCourse(p).prerequisites.push({ code: 'PY104', kind: 'required' }), 'Circular prerequisites'],
    ['a forward prerequisite', (p) => firstCourse(p).prerequisites.push({ code: 'PY211', kind: 'required' }), 'must come earlier'],
    ['missing English text', (p) => (firstCourse(p).title.en = ''), 'English text is missing'],
    ['a shallow course', (p) => (firstCourse(p).modules = firstCourse(p).modules.slice(0, 2)), 'at least 3 modules'],
    ['a duplicate course code', (p) => (p.programmes[0]!.semesters[1]!.courses[0]!.code = 'PY101'), 'duplicate code "PY101"'],
    ['decreasing difficulty', (p) => (p.programmes[0]!.semesters[4]!.courses[0]!.difficulty = 'beginner'), 'difficulty decreases'],
    ['an academy of an unknown faculty', (p) => (p.academies[0]!.facultyCode = 'F99'), 'unknown faculty F99'],
    ['an unknown prerequisite', (p) => firstCourse(p).prerequisites.push({ code: 'XX999', kind: 'required' }), 'not a course of this programme'],
  ])('rejects %s', (_name, mutate, expected) => {
    const pkg = clone();
    mutate(pkg);
    expect(validatePackage(pkg).join('\n')).toContain(expected);
  });
});

// ─── Installation ──────────────────────────────────────────────────────────

async function dbWithStudent() {
  const db = await freshDb();
  const student = await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah', goals: 'AI Engineer' });
  await updateSettings(db, { language: 'en', dailyStudyGoalMinutes: 90 });
  return { db, student, settings: await db.settings.get('app') };
}

describe('installation', () => {
  it('installs the whole package in one transaction with correct counts, relationships and integrity', async () => {
    const { db, student, settings } = await dbWithStudent();
    const counts = countPackage(UNIVERSITY_CORE_M1);
    const total = counts.faculties + counts.academies + counts.programmes + counts.semesters + counts.courses + counts.modules + counts.lectures + counts.prerequisites;

    const plan = await planInstall(db, UNIVERSITY_CORE_M1);
    expect(plan).toMatchObject({ errors: [], conflicts: [], toCreate: total, reused: 0 });

    const result = await installPackage(db, UNIVERSITY_CORE_M1);
    expect(result.created).toBe(total);

    // Counts
    expect(await db.faculties.count()).toBe(7);
    expect(await db.academies.count()).toBe(15);
    expect(await db.programmes.count()).toBe(1);
    expect(await db.semesters.count()).toBe(8);
    expect(await db.courses.count()).toBe(counts.courses);
    expect(await db.modules.count()).toBe(counts.modules);
    expect(await db.lectures.count()).toBe(counts.lectures);
    expect(await db.coursePrerequisites.count()).toBe(counts.prerequisites);

    // Relationships
    const f01 = (await db.faculties.where('code').equals('F01').first())!;
    expect(await db.academies.where('facultyId').equals(f01.id).count()).toBe(15);
    for (const code of ['F02', 'F03', 'F04', 'F05', 'F06', 'F07']) {
      const f = (await db.faculties.where('code').equals(code).first())!;
      expect(await db.academies.where('facultyId').equals(f.id).count(), code).toBe(0);
    }
    const programme = (await db.programmes.where('code').equals('PY-PROG').first())!;
    expect(programme.totalSemesters).toBe(8);
    expect((await db.academies.get(programme.academyId))?.code).toBe('F01-PY');
    const semesters = await db.semesters.where('programmeId').equals(programme.id).sortBy('number');
    expect(semesters.map((s) => s.title.en)).toEqual(PYTHON_PROGRAMME.semesters.map((s) => s.title.en));
    for (const def of PYTHON_PROGRAMME.semesters) {
      const semester = semesters[def.number - 1]!;
      const stored = await db.courses.where('semesterId').equals(semester.id).sortBy('code');
      expect(stored.map((c) => c.code)).toEqual(def.courses.map((c) => c.code));
      for (const c of stored) {
        expect(c.programmeId).toBe(programme.id);
        const cdef = def.courses.find((d) => d.code === c.code)!;
        expect(c.learningObjectives).toEqual(cdef.objectives);
        expect(c.learningOutcomes).toEqual(cdef.outcomes);
        const modules = await db.modules.where('courseId').equals(c.id).sortBy('order');
        expect(modules.map((m) => m.title.en)).toEqual(cdef.modules.map((m) => m.title.en));
        for (const [mi, m] of modules.entries()) {
          const lectures = await db.lectures.where('moduleId').equals(m.id).sortBy('order');
          expect(lectures.map((l) => l.title.en)).toEqual(cdef.modules[mi]!.lectures.map((l) => l.title.en));
          expect(lectures.every((l) => l.courseId === c.id && l.difficulty === c.difficulty && l.sections.length === 0)).toBe(true);
        }
      }
    }
    const byCode = new Map((await db.courses.toArray()).map((c) => [c.id, c.code]));
    const links = (await db.coursePrerequisites.toArray()).map((l) => `${byCode.get(l.courseId)}<-${byCode.get(l.prerequisiteCourseId)}:${l.kind}`);
    expect(links).toContain('PY490<-PY411:recommended');
    expect(links).toContain('PY201<-PY114:required');

    // Integrity, safety, student data
    expect((await checkDatabaseIntegrity(db)).issues).toEqual([]);
    expect(await db.students.get(student.id)).toEqual(student);
    expect(await db.settings.get('app')).toEqual(settings);
    expect((await db.snapshots.get(result.snapshotId!))?.reason).toBe('pre-seed');
    expect(((await db.meta.get(PACKAGES_META_KEY))?.value as Record<string, unknown>)[UNIVERSITY_CORE_M1.id]).toMatchObject({ version: '1.0.0', created: total });
    expect(await db.activityLog.where('type').equals('curriculum.installed').count()).toBe(1);
  });

  it('is idempotent: installing again creates nothing', async () => {
    const { db } = await dbWithStudent();
    await installPackage(db, UNIVERSITY_CORE_M1);
    const before = await db.lectures.count();
    const plan = await planInstall(db, UNIVERSITY_CORE_M1);
    expect(plan.toCreate).toBe(0);
    expect(plan.installed?.version).toBe('1.0.0');
    expect(await installPackage(db, UNIVERSITY_CORE_M1)).toMatchObject({ created: 0 });
    expect(await db.lectures.count()).toBe(before);
    expect(await db.snapshots.where('reason').equals('pre-seed').count()).toBe(1);
  });

  it('reuses records the student already created (by code) without overwriting them', async () => {
    const { db } = await dbWithStudent();
    await createFaculty(db, { code: 'F01', name: { ms: 'Fakulti Saya Sendiri' }, order: 1 });
    await installPackage(db, UNIVERSITY_CORE_M1);
    const f01 = (await db.faculties.where('code').equals('F01').first())!;
    expect(f01.name.ms).toBe('Fakulti Saya Sendiri');
    expect(await db.faculties.count()).toBe(7);
    expect(await db.academies.where('facultyId').equals(f01.id).count()).toBe(15);
  });

  it('refuses to install on a conflict and writes nothing (no recovery point needed)', async () => {
    const { db } = await dbWithStudent();
    const f = await createFaculty(db, { code: 'X01', name: { ms: 'Lain' }, order: 9 });
    const a = await createAcademy(db, { facultyId: f.id, code: 'X01-A', name: { ms: 'Lain' }, order: 1 });
    const p = await createProgramme(db, { academyId: a.id, code: 'OTHER', name: { ms: 'Lain' }, totalSemesters: 1, entryLevel: 'beginner', exitLevel: 'beginner' });
    const s = (await db.semesters.where('programmeId').equals(p.id).first())!;
    await createCourse(db, { semesterId: s.id, code: 'PY101', title: { ms: 'Kursus lain' }, creditHours: 3, difficulty: 'beginner' });

    const plan = await planInstall(db, UNIVERSITY_CORE_M1);
    expect(plan.conflicts).toEqual(['course code PY101 is already used by another programme']);
    const err = await installPackage(db, UNIVERSITY_CORE_M1).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(PackageInstallError);
    expect(await db.faculties.count()).toBe(1);
    expect(await db.snapshots.where('reason').equals('pre-seed').count()).toBe(0);
  });

  it('refuses an invalid package before touching the database', async () => {
    const { db } = await dbWithStudent();
    const bad = clone();
    bad.programmes[0]!.semesters[0]!.courses[0]!.prerequisites.push({ code: 'PY104', kind: 'required' });
    await expect(installPackage(db, bad)).rejects.toBeInstanceOf(PackageInstallError);
    expect(await db.faculties.count()).toBe(0);
  });

  it('recovery: restoring the pre-seed recovery point removes the curriculum and keeps the student', async () => {
    const { db, student } = await dbWithStudent();
    const { snapshotId } = await installPackage(db, UNIVERSITY_CORE_M1);
    await restoreSnapshot(db, snapshotId!);
    expect(await db.courses.count()).toBe(0);
    expect(await db.faculties.count()).toBe(0);
    expect(await db.students.get(student.id)).toEqual(student);
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);
  });

  it('seeded curriculum is protected: required courses and populated academies cannot be deleted', async () => {
    const { db } = await dbWithStudent();
    await installPackage(db, UNIVERSITY_CORE_M1);
    const py101 = (await db.courses.where('code').equals('PY101').first())!;
    const plan = await planDelete(db, 'courses', py101.id);
    expect(plan.blockers.map((b) => b.table)).toEqual(['coursePrerequisites']); // PY102 requires it
    const academy = (await db.academies.where('code').equals('F01-PY').first())!;
    expect((await planDelete(db, 'academies', academy.id)).blockers.map((b) => b.table)).toEqual(['programmes']);
    // An unrequired course takes its own modules and lectures with it.
    const py490 = (await db.courses.where('code').equals('PY490').first())!;
    const capstone = await planDelete(db, 'courses', py490.id);
    expect(capstone.blockers).toEqual([]);
    expect(capstone.toDelete.filter((d) => d.table === 'lectures')).toHaveLength(12);
  });
});
