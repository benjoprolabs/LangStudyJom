import { describe, expect, it } from 'vitest';
import {
  createBackup,
  createSnapshot,
  deleteSnapshot,
  exportBackup,
  restoreBackup,
  restoreSnapshot,
  serializeBackup,
  validateBackup,
} from '@/db/backup/backup';
import { sha256Hex } from '@/lib/checksum';
import { checkDatabaseIntegrity, dumpTables } from '@/db/integrity';
import { createStudent, updateStudent } from '@/db/repositories/student';
import { updateSettings } from '@/db/repositories/settings';
import type { QhazeDatabase } from '@/db/database';
import { freshDb } from '@/test/helpers';

const ts = '2026-01-01T00:00:00.000Z';

/** Seed a small but fully linked academic hierarchy. */
async function seedHierarchy(db: QhazeDatabase) {
  const student = await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' });
  const ms = (s: string) => ({ ms: s, en: s });
  await db.faculties.add({ id: 'f1', code: 'F01', name: ms('Programming'), description: ms(''), order: 1, status: 'active', createdAt: ts, updatedAt: ts });
  await db.academies.add({ id: 'a1', facultyId: 'f1', code: 'F01-PY', name: ms('Python'), description: ms(''), order: 1, status: 'active', createdAt: ts, updatedAt: ts });
  await db.programmes.add({ id: 'p1', academyId: 'a1', code: 'PY-DIP', name: ms('Diploma'), description: ms(''), totalSemesters: 6, entryLevel: 'absolute_beginner', exitLevel: 'professional', completionRequirements: [], status: 'active', createdAt: ts, updatedAt: ts });
  await db.semesters.add({ id: 's1', programmeId: 'p1', number: 1, title: ms('Semester 1'), description: ms(''), createdAt: ts, updatedAt: ts });
  await db.courses.add({ id: 'c1', programmeId: 'p1', semesterId: 's1', code: 'PY101', title: ms('Python Introduction'), description: ms(''), creditHours: 3, difficulty: 'beginner', learningObjectives: [], references: [], status: 'active', createdAt: ts, updatedAt: ts });
  await db.studySessions.add({ id: 'ss1', studentId: student.id, startedAt: ts, endedAt: ts, durationMinutes: 45, activityType: 'lecture', courseId: 'c1', completed: true, source: 'manual', createdAt: ts, updatedAt: ts });
  return student;
}

describe('backup export & validation', () => {
  it('round-trips: export → validate → identical data', async () => {
    const db = await freshDb();
    await seedHierarchy(db);
    const { content, backup, fileName } = await exportBackup(db);
    expect(fileName).toMatch(/^qhaze-backup-.*\.json$/);
    expect(backup.data.snapshots).toBeUndefined();
    expect(backup.data.snapshotPayloads).toBeUndefined();

    const result = await validateBackup(content);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.integrity?.ok).toBe(true);
    expect(result.backup?.data.courses).toEqual(backup.data.courses);
    expect(typeof (await db.meta.get('lastBackupAt'))?.value).toBe('string');
  });

  it('rejects invalid JSON, foreign files and tampered files', async () => {
    const db = await freshDb();
    await seedHierarchy(db);
    const backup = await createBackup(db);

    expect((await validateBackup('{not json')).errors).toEqual(['invalid_json']);
    expect((await validateBackup(JSON.stringify({ hello: 'world' }))).errors).toEqual(['wrong_format']);
    expect((await validateBackup(JSON.stringify({ ...backup, data: 'oops' }))).errors).toEqual(['invalid_structure']);

    const tampered = structuredClone(backup);
    tampered.data.students![0]!.fullName = 'Hacker';
    expect((await validateBackup(serializeBackup(tampered))).errors).toEqual(['checksum_mismatch']);
  });

  it('rejects backups from a newer schema', async () => {
    const db = await freshDb();
    const backup = await createBackup(db);
    const result = await validateBackup(serializeBackup({ ...backup, schemaVersion: 999 }));
    expect(result.errors).toContain('schema_too_new');
  });

  it('rejects duplicate IDs and warns about broken references / unknown tables', async () => {
    const db = await freshDb();
    await seedHierarchy(db);
    const backup = await createBackup(db);

    const dup = structuredClone(backup);
    dup.data.courses!.push({ ...dup.data.courses![0]! });
    dup.checksum = await sha256Hex(JSON.stringify(dup.data));
    expect((await validateBackup(serializeBackup(dup))).errors).toEqual(['invalid_records']);

    const broken = structuredClone(backup);
    broken.data.courses![0]!.semesterId = 'missing';
    broken.data.mysteryTable = [{ id: 'x' }];
    broken.checksum = await sha256Hex(JSON.stringify(broken.data));
    const r = await validateBackup(serializeBackup(broken));
    expect(r.ok).toBe(true);
    expect(r.warnings).toEqual(expect.arrayContaining(['integrity_issues', 'unknown_table:mysteryTable']));
    expect(r.backup?.data.mysteryTable).toBeUndefined();
  });
});

describe('restore', () => {
  it('replace: restores exact data, creates a pre-restore snapshot, integrity holds', async () => {
    const db = await freshDb();
    const student = await seedHierarchy(db);
    await updateSettings(db, { language: 'en' });
    const before = await dumpTables(db);
    const { content } = await exportBackup(db);

    // Change and add data after the backup.
    await updateStudent(db, student.id, { fullName: 'Changed', preferredName: 'Changed' });
    await db.courses.delete('c1');
    await db.notes.add({ id: 'n1', studentId: student.id, entityType: 'general', kind: 'note', title: 'x', body: 'y', tags: [], createdAt: ts, updatedAt: ts });

    const validated = await validateBackup(content);
    const result = await restoreBackup(db, validated.backup!, 'replace');

    expect(await db.students.get(student.id)).toEqual(before.students![0]);
    expect(await db.courses.get('c1')).toEqual(before.courses![0]);
    expect(await db.notes.count()).toBe(0);
    expect((await db.settings.get('app'))?.language).toBe('en');
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);

    const safety = await db.snapshots.get(result.safetySnapshotId);
    expect(safety?.reason).toBe('pre-restore');
    // The safety snapshot contains the pre-restore state (with the note) so it can be rolled back.
    const payload = await db.snapshotPayloads.get(result.safetySnapshotId);
    expect(JSON.parse(payload!.payload).data.notes).toHaveLength(1);
  });

  it('merge: adds missing records, keeps newer local edits, deletes nothing', async () => {
    const db = await freshDb();
    const student = await seedHierarchy(db);
    const { content } = await exportBackup(db);

    await new Promise((r) => setTimeout(r, 5));
    await updateStudent(db, student.id, { fullName: 'Newer Local Name', preferredName: 'Local' });
    await db.courses.delete('c1');
    await db.notes.add({ id: 'n1', studentId: student.id, entityType: 'general', kind: 'note', title: 'x', body: 'y', tags: [], createdAt: ts, updatedAt: ts });

    const validated = await validateBackup(content);
    const result = await restoreBackup(db, validated.backup!, 'merge');

    expect((await db.students.get(student.id))?.fullName).toBe('Newer Local Name');
    expect(await db.courses.get('c1')).toBeDefined();
    expect(await db.notes.get('n1')).toBeDefined();
    expect(result.skipped).toBeGreaterThan(0);
  });

  it('a failed restore leaves the database untouched', async () => {
    const db = await freshDb();
    await seedHierarchy(db);
    const before = await dumpTables(db);
    const backup = await createBackup(db);
    // Unique index violation (two faculties with the same code) aborts the transaction.
    backup.data.faculties!.push({ ...backup.data.faculties![0]!, id: 'f2' });
    await expect(restoreBackup(db, backup, 'replace')).rejects.toThrow();
    const after = await dumpTables(db);
    // Only the safety snapshot's activity entry differs.
    expect(after.courses).toEqual(before.courses);
    expect(after.students).toEqual(before.students);
    expect(after.faculties).toEqual(before.faculties);
  });
});

describe('snapshots', () => {
  it('creates, restores and deletes recovery points', async () => {
    const db = await freshDb();
    const student = await seedHierarchy(db);
    const snap = await createSnapshot(db, 'manual');
    expect(snap.recordCount).toBeGreaterThan(0);
    expect(snap.sizeBytes).toBeGreaterThan(0);

    await updateStudent(db, student.id, { fullName: 'Changed', preferredName: 'C' });
    await restoreSnapshot(db, snap.id);
    expect((await db.students.get(student.id))?.fullName).toBe('Nur Aisyah');

    await deleteSnapshot(db, snap.id);
    expect(await db.snapshots.get(snap.id)).toBeUndefined();
    expect(await db.snapshotPayloads.get(snap.id)).toBeUndefined();
  });

  it('prunes old automatic snapshots but never manual ones', async () => {
    const db = await freshDb();
    await updateSettings(db, { autoSnapshotRetention: 2 });
    const manual = await createSnapshot(db, 'manual');
    for (let i = 0; i < 4; i++) {
      await createSnapshot(db, 'pre-restore');
      await new Promise((r) => setTimeout(r, 2));
    }
    const all = await db.snapshots.toArray();
    expect(all.filter((s) => s.reason === 'pre-restore')).toHaveLength(2);
    expect(all.find((s) => s.id === manual.id)).toBeDefined();
    expect(await db.snapshotPayloads.count()).toBe(all.length);
  });
});
