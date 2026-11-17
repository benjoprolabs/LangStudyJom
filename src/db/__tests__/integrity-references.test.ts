/**
 * Phase 1.1 — data integrity patch.
 * Broken-data categories fixed:
 *   1. studySessions.academyId   (and sibling studySessions.programmeId)
 *   2. studySessions.semesterId
 *   3. projects.courseId         (and sibling projects.academyId)
 * plus relationship-consistency checks along the curriculum chain and write-time validation.
 */
import { describe, expect, it } from 'vitest';
import { assertValidReferences, checkIntegrity, IntegrityError, validateReferences } from '@/db/integrity';
import { createBackup, restoreBackup, serializeBackup, validateBackup } from '@/db/backup/backup';
import { createStudent } from '@/db/repositories/student';
import type { QhazeDatabase } from '@/db/database';
import { freshDb } from '@/test/helpers';

type Row = Record<string, unknown>;

/** Two independent curriculum chains: a1/p1/s1/c1/m1/l1 and a2/p2/s2/c2/m2/l2. */
const CURRICULUM: Record<string, Row[]> = {
  students: [{ id: 'st' }],
  faculties: [{ id: 'f1' }],
  academies: [{ id: 'a1', facultyId: 'f1' }, { id: 'a2', facultyId: 'f1' }],
  programmes: [{ id: 'p1', academyId: 'a1' }, { id: 'p2', academyId: 'a2' }],
  semesters: [{ id: 's1', programmeId: 'p1', number: 1 }, { id: 's2', programmeId: 'p2', number: 1 }],
  courses: [{ id: 'c1', programmeId: 'p1', semesterId: 's1' }, { id: 'c2', programmeId: 'p2', semesterId: 's2' }],
  modules: [{ id: 'm1', courseId: 'c1' }, { id: 'm2', courseId: 'c2' }],
  lectures: [{ id: 'l1', moduleId: 'm1', courseId: 'c1' }, { id: 'l2', moduleId: 'm2', courseId: 'c2' }],
};

const VALID_SESSION = { id: 'ss', studentId: 'st', academyId: 'a1', programmeId: 'p1', semesterId: 's1', courseId: 'c1', lectureId: 'l1' };

function check(extra: Record<string, Row[]>) {
  return checkIntegrity({ ...CURRICULUM, ...extra });
}
const details = (r: ReturnType<typeof check>, kind: string) => r.issues.filter((i) => i.kind === kind).map((i) => i.detail);

describe('baseline', () => {
  it('the test curriculum itself is valid', () => {
    expect(checkIntegrity(CURRICULUM)).toMatchObject({ ok: true });
  });
});

describe('category 1 & 2 — study session curriculum references (FK)', () => {
  it('accepts a fully consistent session and a session with no curriculum references', () => {
    expect(check({ studySessions: [VALID_SESSION, { id: 'free', studentId: 'st' }] }).ok).toBe(true);
  });

  it.each([
    ['academyId', 'academies'],
    ['programmeId', 'programmes'],
    ['semesterId', 'semesters'],
    ['courseId', 'courses'],
    ['lectureId', 'lectures'],
  ])('detects a dangling studySessions.%s', (field, target) => {
    const r = check({ studySessions: [{ id: 'x', studentId: 'st', [field]: 'GONE' }] });
    expect(details(r, 'missing_reference')).toEqual([`${field}=GONE not found in ${target}`]);
  });

  it('still requires studentId', () => {
    const r = check({ studySessions: [{ id: 'x', academyId: 'a1' }] });
    expect(details(r, 'missing_reference')).toEqual(['studentId is empty (required → students)']);
  });
});

describe('category 3 — project curriculum references (FK)', () => {
  it('accepts projects with valid or absent references', () => {
    expect(check({ projects: [{ id: 'pr1', studentId: 'st', academyId: 'a1', courseId: 'c1' }, { id: 'pr2', studentId: 'st' }] }).ok).toBe(true);
  });

  it.each([
    ['courseId', 'courses'],
    ['academyId', 'academies'],
  ])('detects a dangling projects.%s', (field, target) => {
    const r = check({ projects: [{ id: 'pr', studentId: 'st', [field]: 'GONE' }] });
    expect(details(r, 'missing_reference')).toEqual([`${field}=GONE not found in ${target}`]);
  });

  it('project tasks of a missing project are still detected (regression)', () => {
    expect(details(check({ projectTasks: [{ id: 't', projectId: 'GONE' }] }), 'missing_reference')).toHaveLength(1);
  });
});

describe('relationship consistency along the curriculum chain', () => {
  it.each<[string, Row, string]>([
    ['semester from another programme', { ...VALID_SESSION, semesterId: 's2' }, 'semesterId=s2 contradicts lectureId=l1'],
    ['programme from another academy chain', { ...VALID_SESSION, programmeId: 'p2' }, 'programmeId=p2 contradicts lectureId=l1'],
    ['academy that does not own the course', { ...VALID_SESSION, academyId: 'a2' }, 'academyId=a2 contradicts lectureId=l1'],
    ['lecture of a different course', { ...VALID_SESSION, lectureId: 'l2' }, 'courseId=c1 contradicts lectureId=l2'],
  ])('study session: detects %s', (_name, session, expected) => {
    const found = details(check({ studySessions: [session] }), 'inconsistent_reference');
    expect(found.some((d) => d.startsWith(expected))).toBe(true);
  });

  it('checks partial chains (semester + programme only)', () => {
    const r = check({ studySessions: [{ id: 'x', studentId: 'st', semesterId: 's1', programmeId: 'p2' }] });
    expect(details(r, 'inconsistent_reference')).toEqual(['programmeId=p2 contradicts semesterId=s1 (which belongs to programmeId=p1)']);
  });

  it('reports each contradicted field once, from the most specific reference', () => {
    const r = check({ studySessions: [{ ...VALID_SESSION, semesterId: 's2' }] });
    expect(details(r, 'inconsistent_reference')).toEqual(['semesterId=s2 contradicts lectureId=l1 (which belongs to semesterId=s1)']);
  });

  it('project: academy must own the course', () => {
    expect(check({ projects: [{ id: 'pr', studentId: 'st', courseId: 'c1', academyId: 'a1' }] }).ok).toBe(true);
    const r = check({ projects: [{ id: 'pr', studentId: 'st', courseId: 'c1', academyId: 'a2' }] });
    expect(details(r, 'inconsistent_reference')).toEqual(['academyId=a2 contradicts courseId=c1 (which belongs to academyId=a1)']);
  });

  it('a dangling reference is reported as missing, not as inconsistent', () => {
    const r = check({ studySessions: [{ ...VALID_SESSION, courseId: 'GONE', lectureId: undefined }] });
    expect(r.issues.map((i) => i.kind)).toEqual(['missing_reference']);
  });
});

describe('assessment model (approved): exercises referenced, never duplicated', () => {
  it('one exercise shared by practice and two assessments, submissions linked to their assessment', () => {
    const data = {
      ...CURRICULUM,
      exercises: [{ id: 'e1', academyId: 'a1', courseId: 'c1', lectureId: 'l1' }],
      assessments: [
        { id: 'quiz', courseId: 'c1', type: 'quiz', exerciseIds: ['e1'] },
        { id: 'exam', courseId: 'c1', type: 'examination', exerciseIds: ['e1'] },
      ],
      exerciseAttempts: [
        { id: 'practice', exerciseId: 'e1', studentId: 'st' },
        { id: 'inQuiz', exerciseId: 'e1', studentId: 'st', assessmentId: 'quiz' },
      ],
      grades: [{ id: 'g', studentId: 'st', programmeId: 'p1', semesterId: 's1', courseId: 'c1', assessmentId: 'quiz' }],
    };
    expect(checkIntegrity(data).ok).toBe(true);
    expect(data.exercises).toHaveLength(1);
  });

  it('detects a submission pointing at a missing assessment', () => {
    const r = check({
      exercises: [{ id: 'e1', academyId: 'a1' }],
      exerciseAttempts: [{ id: 'x', exerciseId: 'e1', studentId: 'st', assessmentId: 'GONE' }],
    });
    expect(details(r, 'missing_reference')).toEqual(['assessmentId=GONE not found in assessments']);
  });
});

// ─── Write-time validation against a real (fake-indexeddb) database ───────

async function seedDb(): Promise<{ db: QhazeDatabase; studentId: string }> {
  const db = await freshDb();
  const student = await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' });
  for (const [table, rows] of Object.entries(CURRICULUM)) {
    if (table === 'students') continue;
    await db.table(table).bulkAdd(rows);
  }
  return { db, studentId: student.id };
}

describe('write-time reference validation', () => {
  it('accepts a valid record and returns no issues', async () => {
    const { db, studentId } = await seedDb();
    expect(await validateReferences(db, 'studySessions', { ...VALID_SESSION, studentId })).toEqual([]);
    expect(await validateReferences(db, 'projects', { id: 'p', studentId, courseId: 'c2', academyId: 'a2' })).toEqual([]);
  });

  it('reports dangling and inconsistent references for a single record', async () => {
    const { db, studentId } = await seedDb();
    const dangling = await validateReferences(db, 'studySessions', { id: 'x', studentId, semesterId: 'GONE' });
    expect(dangling.map((i) => i.kind)).toEqual(['missing_reference']);
    const inconsistent = await validateReferences(db, 'studySessions', { ...VALID_SESSION, studentId, academyId: 'a2' });
    expect(inconsistent.map((i) => i.kind)).toEqual(['inconsistent_reference']);
    const missingStudent = await validateReferences(db, 'projects', { id: 'p', studentId: 'nobody' });
    expect(missingStudent[0]?.detail).toBe('studentId=nobody not found in students');
  });

  it('assertValidReferences throws IntegrityError and the guarded write never happens', async () => {
    const { db, studentId } = await seedDb();
    const bad = { id: 'bad', studentId, title: 'x', courseId: 'c1', academyId: 'a2' };
    const guardedAdd = async (row: Row) => {
      await assertValidReferences(db, 'projects', row);
      await db.table('projects').add(row);
    };
    const err = await guardedAdd(bad).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(IntegrityError);
    expect((err as IntegrityError).issues[0]?.kind).toBe('inconsistent_reference');
    expect(await db.projects.count()).toBe(0);

    await guardedAdd({ ...bad, academyId: 'a1' });
    expect(await db.projects.count()).toBe(1);
  });

  it('validates against live data: deleting the referenced course makes the record dangling', async () => {
    const { db, studentId } = await seedDb();
    const project = { id: 'p', studentId, courseId: 'c1' };
    expect(await validateReferences(db, 'projects', project)).toEqual([]);
    await db.courses.delete('c1');
    expect((await validateReferences(db, 'projects', project)).map((i) => i.detail)).toEqual(['courseId=c1 not found in courses']);
  });
});

describe('backups containing broken references', () => {
  it('are restorable with an integrity warning and lose no records (never silently deleted)', async () => {
    const { db, studentId } = await seedDb();
    await db.studySessions.add({
      id: 'orphan',
      studentId,
      academyId: 'GONE',
      startedAt: 'x',
      endedAt: 'x',
      durationMinutes: 30,
      activityType: 'lecture',
      completed: true,
      source: 'manual',
      createdAt: 'x',
      updatedAt: 'x',
    });
    const result = await validateBackup(serializeBackup(await createBackup(db)));
    expect(result.ok).toBe(true);
    expect(result.warnings).toContain('integrity_issues');
    expect(result.integrity?.issues.map((i) => i.detail)).toEqual(['academyId=GONE not found in academies']);

    await db.studySessions.clear();
    await restoreBackup(db, result.backup!, 'replace');
    expect(await db.studySessions.get('orphan')).toBeDefined();
  });
});
