/**
 * Seeding failure in the MIDDLE of an install (after hundreds of records were written inside
 * the transaction) must roll back everything. The 200th lecture write is forced to fail.
 */
import { describe, expect, it, vi } from 'vitest';

const failure = vi.hoisted(() => ({ failAt: Infinity, calls: 0 }));

vi.mock('@/db/repositories/modules', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/db/repositories/modules')>();
  return {
    ...real,
    createLecture: async (...args: Parameters<typeof real.createLecture>) => {
      failure.calls++;
      if (failure.calls >= failure.failAt) throw new Error('simulated storage failure');
      return real.createLecture(...args);
    },
  };
});

const { installPackage, planInstall } = await import('@/db/seed/install');
const { UNIVERSITY_CORE_M1 } = await import('@/db/seed/packages');
const { checkDatabaseIntegrity } = await import('@/db/integrity');
const { createStudent } = await import('@/db/repositories/student');
const { freshDb } = await import('@/test/helpers');

describe('seeding rollback', () => {
  it('a failure mid-install rolls back every record; the student and the recovery point remain', async () => {
    const db = await freshDb();
    const student = await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' });
    failure.calls = 0;
    failure.failAt = 200;

    await expect(installPackage(db, UNIVERSITY_CORE_M1)).rejects.toThrow('simulated storage failure');
    expect(failure.calls).toBe(200); // the failure really happened deep inside the install

    for (const table of ['faculties', 'academies', 'programmes', 'semesters', 'courses', 'modules', 'lectures', 'coursePrerequisites']) {
      expect(await db.table(table).count(), table).toBe(0);
    }
    expect(await db.activityLog.where('type').anyOf('curriculum.created', 'curriculum.installed').count()).toBe(0);
    expect(await db.meta.get('curriculumPackages')).toBeUndefined();
    expect(await db.students.get(student.id)).toEqual(student);
    expect(await db.snapshots.where('reason').equals('pre-seed').count()).toBe(1);
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);

    // After the problem is fixed, the same install succeeds cleanly.
    failure.failAt = Infinity;
    const result = await installPackage(db, UNIVERSITY_CORE_M1);
    expect(result.created).toBe((await planInstall(db, UNIVERSITY_CORE_M1)).reused);
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);
  });
});
