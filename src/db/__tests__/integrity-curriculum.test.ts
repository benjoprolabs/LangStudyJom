/**
 * Integrity items 4–10 (closed before Phase 2 curriculum seeding).
 *   4  assessment → exercise references (+ submissions belong to their assessment)
 *   5  progress polymorphic references
 *   6  notes / bookmarks polymorphic references
 *   7  programme ↔ semester ↔ course consistency
 *   8  lecture ↔ module ↔ course consistency
 *   9  circular course prerequisites
 *  10  semester number within programme.totalSemesters
 */
import { describe, expect, it } from 'vitest';
import { checkIntegrity, findPrerequisiteCycles, validateReferences, type IntegrityReport } from '@/db/integrity';
import { createBackup, restoreBackup, serializeBackup, validateBackup } from '@/db/backup/backup';
import { createStudent } from '@/db/repositories/student';
import type { QhazeDatabase } from '@/db/database';
import { freshDb } from '@/test/helpers';

type Row = Record<string, unknown>;

/** A complete, VALID mini-university touching every rule. Used to prove there are no false positives. */
const VALID: Record<string, Row[]> = {
  students: [{ id: 'st' }],
  faculties: [{ id: 'f1' }],
  academies: [{ id: 'a1', facultyId: 'f1' }, { id: 'a2', facultyId: 'f1' }],
  programmes: [
    { id: 'p1', academyId: 'a1', totalSemesters: 2 },
    { id: 'p2', academyId: 'a2', totalSemesters: 1 },
  ],
  semesters: [
    { id: 's1', programmeId: 'p1', number: 1 },
    { id: 's2', programmeId: 'p1', number: 2 },
    { id: 's3', programmeId: 'p2', number: 1 },
  ],
  courses: [
    { id: 'c1', programmeId: 'p1', semesterId: 's1' },
    { id: 'c2', programmeId: 'p1', semesterId: 's2' },
    { id: 'c3', programmeId: 'p1', semesterId: 's2' },
    { id: 'c4', programmeId: 'p2', semesterId: 's3' },
  ],
  // Diamond: c3 needs c2 and c1; c2 needs c1. Not a cycle.
  coursePrerequisites: [
    { id: 'q1', courseId: 'c2', prerequisiteCourseId: 'c1' },
    { id: 'q2', courseId: 'c3', prerequisiteCourseId: 'c2' },
    { id: 'q3', courseId: 'c3', prerequisiteCourseId: 'c1' },
  ],
  modules: [{ id: 'm1', courseId: 'c1' }, { id: 'm2', courseId: 'c2' }],
  lectures: [{ id: 'l1', moduleId: 'm1', courseId: 'c1' }, { id: 'l2', moduleId: 'm2', courseId: 'c2' }],
  learningMaterials: [{ id: 'mat1', lectureId: 'l1' }],
  exercises: [
    { id: 'e1', academyId: 'a1', courseId: 'c1' },
    { id: 'e2', academyId: 'a1', courseId: 'c1' },
  ],
  assessments: [
    { id: 'quiz', courseId: 'c1', type: 'quiz', exerciseIds: ['e1', 'e2'] },
    { id: 'asg', courseId: 'c1', type: 'assignment', exerciseIds: ['e2'] },
    { id: 'empty', courseId: 'c1', type: 'examination', exerciseIds: [] },
  ],
  exerciseAttempts: [
    { id: 'att1', exerciseId: 'e1', studentId: 'st', assessmentId: 'quiz' },
    { id: 'att2', exerciseId: 'e1', studentId: 'st' },
  ],
  progress: [
    { id: 'pg1', studentId: 'st', entityType: 'programme', entityId: 'p1' },
    { id: 'pg2', studentId: 'st', entityType: 'semester', entityId: 's1' },
    { id: 'pg3', studentId: 'st', entityType: 'course', entityId: 'c1' },
    { id: 'pg4', studentId: 'st', entityType: 'module', entityId: 'm1' },
    { id: 'pg5', studentId: 'st', entityType: 'lecture', entityId: 'l1' },
  ],
  notes: [
    { id: 'n1', studentId: 'st', entityType: 'academy', entityId: 'a1' },
    { id: 'n2', studentId: 'st', entityType: 'course', entityId: 'c1' },
    { id: 'n3', studentId: 'st', entityType: 'lecture', entityId: 'l1' },
    { id: 'n4', studentId: 'st', entityType: 'general' },
  ],
  bookmarks: [
    { id: 'b1', studentId: 'st', entityType: 'lecture', entityId: 'l1' },
    { id: 'b2', studentId: 'st', entityType: 'course', entityId: 'c1' },
    { id: 'b3', studentId: 'st', entityType: 'material', entityId: 'mat1' },
    { id: 'b4', studentId: 'st', entityType: 'exercise', entityId: 'e1' },
  ],
};

/** Replace one table's rows (by id) or append new rows. */
function withRows(table: string, ...rows: Row[]): Record<string, Row[]> {
  const existing = VALID[table] ?? [];
  const ids = new Set(rows.map((r) => r.id));
  return { ...VALID, [table]: [...existing.filter((r) => !ids.has(r.id)), ...rows] };
}
const issues = (r: IntegrityReport) => r.issues.map((i) => `${i.kind}: ${i.detail}`);

describe('no false positives', () => {
  it('a complete, valid curriculum passes every rule', () => {
    const report = checkIntegrity(VALID);
    expect(issues(report)).toEqual([]);
    expect(report.ok).toBe(true);
  });
});

describe('item 4 — assessment → exercise references', () => {
  it('detects a missing exercise in an assessment', () => {
    const r = checkIntegrity(withRows('assessments', { id: 'quiz', courseId: 'c1', exerciseIds: ['e1', 'GONE'] }));
    expect(issues(r)).toEqual(['missing_reference: exerciseIds contains GONE, not found in exercises']);
  });

  it('detects the same exercise listed twice (no duplicates)', () => {
    const r = checkIntegrity(withRows('assessments', { id: 'quiz', courseId: 'c1', exerciseIds: ['e1', 'e1'] }));
    expect(issues(r)).toEqual(['duplicate_reference: exerciseIds lists e1 more than once']);
  });

  it('rejects a non-list exerciseIds', () => {
    const r = checkIntegrity(withRows('assessments', { id: 'quiz', courseId: 'c1', exerciseIds: 'e1' }));
    expect(issues(r)).toEqual(['missing_reference: exerciseIds must be a list of exercises IDs']);
  });

  it('detects a submission inside an assessment for an exercise that is not part of it', () => {
    const r = checkIntegrity(withRows('exerciseAttempts', { id: 'att1', exerciseId: 'e1', studentId: 'st', assessmentId: 'asg' }));
    expect(issues(r)).toEqual(['inconsistent_reference: exerciseId=e1 is not part of assessmentId=asg']);
  });

  it('deleting an exercise used by an assessment is detected', () => {
    const data = { ...VALID, exercises: VALID.exercises!.filter((e) => e.id !== 'e2') };
    expect(issues(checkIntegrity(data))).toEqual([
      'missing_reference: exerciseIds contains e2, not found in exercises',
      'missing_reference: exerciseIds contains e2, not found in exercises',
    ]);
  });
});

describe('item 5 — progress references', () => {
  it.each([
    ['programme', 'programmes'],
    ['semester', 'semesters'],
    ['course', 'courses'],
    ['module', 'modules'],
    ['lecture', 'lectures'],
  ])('detects a dangling %s progress record', (entityType, table) => {
    const r = checkIntegrity(withRows('progress', { id: 'pg', studentId: 'st', entityType, entityId: 'GONE' }));
    expect(issues(r)).toEqual([`missing_reference: entityId=GONE not found in ${table} (entityType=${entityType})`]);
  });

  it('detects an unknown entityType and a missing entityId', () => {
    const r = checkIntegrity(
      withRows('progress', { id: 'bad', studentId: 'st', entityType: 'faculty', entityId: 'f1' }, { id: 'empty', studentId: 'st', entityType: 'course' }),
    );
    expect(issues(r)).toEqual([
      'invalid_reference_type: entityType=faculty is not one of programme, semester, course, module, lecture',
      'missing_reference: entityId is empty (required → courses for entityType=course)',
    ]);
  });

  it('a progress id that exists but in the WRONG table is detected', () => {
    // 'c1' is a course, not a lecture.
    const r = checkIntegrity(withRows('progress', { id: 'pg', studentId: 'st', entityType: 'lecture', entityId: 'c1' }));
    expect(issues(r)).toEqual(['missing_reference: entityId=c1 not found in lectures (entityType=lecture)']);
  });
});

describe('item 6 — notes and bookmarks references', () => {
  it('detects a note linked to a missing lecture', () => {
    const r = checkIntegrity(withRows('notes', { id: 'n', studentId: 'st', entityType: 'lecture', entityId: 'GONE' }));
    expect(issues(r)).toEqual(['missing_reference: entityId=GONE not found in lectures (entityType=lecture)']);
  });

  it('a general note must not carry a link', () => {
    const r = checkIntegrity(withRows('notes', { id: 'n', studentId: 'st', entityType: 'general', entityId: 'c1' }));
    expect(issues(r)).toEqual(['inconsistent_reference: entityId must be empty when entityType=general']);
  });

  it('detects dangling bookmarks for materials and exercises, and unknown types', () => {
    const r = checkIntegrity(
      withRows(
        'bookmarks',
        { id: 'b3', studentId: 'st', entityType: 'material', entityId: 'GONE' },
        { id: 'b4', studentId: 'st', entityType: 'exercise', entityId: 'GONE' },
        { id: 'b5', studentId: 'st', entityType: 'video', entityId: 'x' },
      ),
    );
    expect(issues(r)).toEqual([
      'missing_reference: entityId=GONE not found in learningMaterials (entityType=material)',
      'missing_reference: entityId=GONE not found in exercises (entityType=exercise)',
      'invalid_reference_type: entityType=video is not one of lecture, course, material, exercise, glossary',
    ]);
  });
});

describe('item 7 — programme ↔ semester ↔ course consistency', () => {
  it('detects a course placed in a semester of another programme', () => {
    const r = checkIntegrity(withRows('courses', { id: 'c4', programmeId: 'p2', semesterId: 's1' }));
    expect(issues(r)).toEqual(['inconsistent_reference: semesterId=s1 belongs to programmeId=p1, not the course\'s programmeId=p2']);
  });
});

describe('item 8 — lecture ↔ module ↔ course consistency', () => {
  it("detects a lecture whose course differs from its module's course", () => {
    const r = checkIntegrity(withRows('lectures', { id: 'l2', moduleId: 'm2', courseId: 'c1' }));
    expect(issues(r)).toEqual(["inconsistent_reference: moduleId=m2 belongs to courseId=c2, not the lecture's courseId=c1"]);
  });
});

describe('item 9 — circular course prerequisites', () => {
  it('detects a 2-course cycle once, with its path', () => {
    const r = checkIntegrity(withRows('coursePrerequisites', { id: 'q4', courseId: 'c1', prerequisiteCourseId: 'c2' }));
    expect(issues(r)).toEqual(['circular_prerequisite: Circular prerequisites: c1 → c2 → c1']);
  });

  it('detects a longer cycle (c1 → c3 → c2 → c1)', () => {
    const cycles = findPrerequisiteCycles([
      { id: 'a', courseId: 'c1', prerequisiteCourseId: 'c3' },
      { id: 'b', courseId: 'c3', prerequisiteCourseId: 'c2' },
      { id: 'c', courseId: 'c2', prerequisiteCourseId: 'c1' },
    ]);
    expect(cycles.map((c) => c.detail)).toEqual(['Circular prerequisites: c1 → c3 → c2 → c1']);
  });

  it('reports separate cycles separately', () => {
    const cycles = findPrerequisiteCycles([
      { id: 'a', courseId: 'x1', prerequisiteCourseId: 'x2' },
      { id: 'b', courseId: 'x2', prerequisiteCourseId: 'x1' },
      { id: 'c', courseId: 'y1', prerequisiteCourseId: 'y2' },
      { id: 'd', courseId: 'y2', prerequisiteCourseId: 'y1' },
    ]);
    expect(cycles).toHaveLength(2);
  });

  it('self-prerequisite is reported as self_prerequisite, not as a cycle', () => {
    const r = checkIntegrity(withRows('coursePrerequisites', { id: 'q4', courseId: 'c1', prerequisiteCourseId: 'c1' }));
    expect(r.issues.map((i) => i.kind)).toEqual(['self_prerequisite']);
  });

  it('a diamond-shaped (shared) prerequisite graph is not a cycle', () => {
    expect(findPrerequisiteCycles(VALID.coursePrerequisites!)).toEqual([]);
  });
});

describe('item 10 — semester number range', () => {
  it.each<[unknown, string]>([
    [0, 'number=0 must be a whole number ≥ 1'],
    [1.5, 'number=1.5 must be a whole number ≥ 1'],
    [undefined, 'number=undefined must be a whole number ≥ 1'],
    [3, 'number=3 exceeds programme p1 totalSemesters=2'],
  ])('rejects number=%s', (number, detail) => {
    const r = checkIntegrity(withRows('semesters', { id: 's2', programmeId: 'p1', number }));
    expect(issues(r)).toEqual([`out_of_range: ${detail}`]);
  });

  it('accepts the last semester (number === totalSemesters)', () => {
    expect(checkIntegrity(withRows('semesters', { id: 's2', programmeId: 'p1', number: 2 })).ok).toBe(true);
  });
});

// ─── Write-time validation on a real (fake-indexeddb) database ─────────────

async function seed(): Promise<QhazeDatabase> {
  const db = await freshDb();
  const student = await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' });
  for (const [table, rows] of Object.entries(VALID)) {
    if (table === 'students') continue;
    // Point every student reference at the real student.
    await db.table(table).bulkAdd(rows.map((r) => ('studentId' in r ? { ...r, studentId: student.id } : r)));
  }
  return db;
}

describe('write-time validation for items 4–10', () => {
  it('the seeded valid curriculum passes the live database check', async () => {
    const db = await seed();
    const { checkDatabaseIntegrity } = await import('@/db/integrity');
    expect((await checkDatabaseIntegrity(db)).issues).toEqual([]);
  });

  it('rejects a new prerequisite edge that would close a cycle, accepts one that would not', async () => {
    const db = await seed();
    const closing = await validateReferences(db, 'coursePrerequisites', { id: 'new', courseId: 'c1', prerequisiteCourseId: 'c3' });
    // c3 needs c1 directly AND via c2, so the new edge c1 → c3 closes two distinct cycles.
    expect(closing.map((i) => i.detail).sort()).toEqual([
      'Circular prerequisites: c1 → c3 → c1',
      'Circular prerequisites: c1 → c3 → c2 → c1',
    ]);
    expect(closing.every((i) => i.kind === 'circular_prerequisite' && i.id === 'new')).toBe(true);
    expect(await validateReferences(db, 'coursePrerequisites', { id: 'new', courseId: 'c4', prerequisiteCourseId: 'c1' })).toEqual([]);
  });

  it('re-validating an existing edge does not count it twice', async () => {
    const db = await seed();
    const existing = (await db.coursePrerequisites.get('q2')) as unknown as Row;
    expect(await validateReferences(db, 'coursePrerequisites', existing)).toEqual([]);
  });

  it('validates polymorphic, array and structural rules for single records', async () => {
    const db = await seed();
    const studentId = (await db.students.toCollection().first())!.id;
    const kinds = async (table: string, row: Row) => (await validateReferences(db, table, row)).map((i) => i.kind);

    expect(await kinds('progress', { id: 'x', studentId, entityType: 'lecture', entityId: 'l1' })).toEqual([]);
    expect(await kinds('progress', { id: 'x', studentId, entityType: 'lecture', entityId: 'GONE' })).toEqual(['missing_reference']);
    expect(await kinds('notes', { id: 'x', studentId, entityType: 'course', entityId: 'c2' })).toEqual([]);
    expect(await kinds('bookmarks', { id: 'x', studentId, entityType: 'material', entityId: 'mat1' })).toEqual([]);
    expect(await kinds('assessments', { id: 'x', courseId: 'c1', exerciseIds: ['e1', 'GONE'] })).toEqual(['missing_reference']);
    expect(await kinds('exerciseAttempts', { id: 'x', exerciseId: 'e1', studentId, assessmentId: 'asg' })).toEqual(['inconsistent_reference']);
    expect(await kinds('courses', { id: 'x', programmeId: 'p2', semesterId: 's1' })).toEqual(['inconsistent_reference']);
    expect(await kinds('lectures', { id: 'x', moduleId: 'm1', courseId: 'c2' })).toEqual(['inconsistent_reference']);
    expect(await kinds('semesters', { id: 'x', programmeId: 'p2', number: 2 })).toEqual(['out_of_range']);
  });
});

describe('backups with items 4–10 violations', () => {
  it('validate with a warning, restore completely and keep every record', async () => {
    const db = await seed();
    await db.coursePrerequisites.add({ id: 'cycle', courseId: 'c1', prerequisiteCourseId: 'c3', kind: 'required', createdAt: 'x', updatedAt: 'x' });
    const result = await validateBackup(serializeBackup(await createBackup(db)));
    expect(result.ok).toBe(true);
    expect(result.warnings).toContain('integrity_issues');
    expect(result.integrity?.issues.map((i) => i.kind)).toEqual(['circular_prerequisite', 'circular_prerequisite']);
    const before = await db.coursePrerequisites.count();
    await restoreBackup(db, result.backup!, 'replace');
    expect(await db.coursePrerequisites.count()).toBe(before);
  });
});
