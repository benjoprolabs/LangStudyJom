/** Phase 2 Step 0 — schema v2 (reverse-reference indexes) and the v1 → v2 migration. */
import Dexie from 'dexie';
import { describe, expect, it } from 'vitest';
import { QhazeDatabase } from '@/db/database';
import { bootstrapDatabase } from '@/db/bootstrap';
import { ARRAY_RELATIONS, checkDatabaseIntegrity, dumpTables, POLYMORPHIC_RELATIONS, RELATIONS } from '@/db/integrity';
import { createBackup, restoreBackup, serializeBackup, validateBackup } from '@/db/backup/backup';
import { CURRENT_SCHEMA_VERSION, SCHEMA_VERSIONS } from '@/db/schema';
import { freshDb } from '@/test/helpers';

/** Exactly what a Phase 1.2 (0.1.2) installation has on disk. */
function v1Database(name: string): Dexie {
  const db = new Dexie(name);
  db.version(1).stores(SCHEMA_VERSIONS[0]!.stores as Record<string, string>);
  return db;
}

const T = '2026-01-01T00:00:00.000Z';
const L = (s: string) => ({ ms: s, en: s });

/** Realistic Phase 1.2 data, including student records that use the new indexes. */
async function populateV1(db: Pick<Dexie, 'table'>) {
  const put = (table: string, rows: Record<string, unknown>[]) => db.table(table).bulkAdd(rows.map((r) => ({ createdAt: T, updatedAt: T, ...r })));
  await put('students', [{ id: 'st', studentNumber: 'QTU-2026-ABCDEF', fullName: 'Nur Aisyah', preferredName: 'Aisyah', bio: 'Pelajar', timezone: 'Asia/Kuala_Lumpur', enrolledAt: T }]);
  await db.table('settings').put({ id: 'app', language: 'ms', theme: 'dark', dailyStudyGoalMinutes: 60, weeklyStudyGoalMinutes: 420, autoSnapshotRetention: 10, backupReminderDays: 7, updatedAt: T });
  await db.table('meta').bulkPut([{ key: 'installedAt', value: T }, { key: 'schemaVersion', value: 1 }, { key: 'lastBackupAt', value: T }]);
  await put('faculties', [{ id: 'f', code: 'F01', name: L('F'), description: L(''), order: 1, status: 'active' }]);
  await put('academies', [{ id: 'a', facultyId: 'f', code: 'F01-PY', name: L('Python'), description: L(''), order: 1, status: 'active' }]);
  await put('programmes', [{ id: 'p', academyId: 'a', code: 'PY-DIP', name: L('P'), description: L(''), totalSemesters: 2, entryLevel: 'beginner', exitLevel: 'advanced', completionRequirements: [], status: 'active' }]);
  await put('semesters', [{ id: 's1', programmeId: 'p', number: 1, title: L('S1'), description: L('') }, { id: 's2', programmeId: 'p', number: 2, title: L('S2'), description: L('') }]);
  await put('courses', [{ id: 'c', programmeId: 'p', semesterId: 's1', code: 'PY101', title: L('C'), description: L(''), creditHours: 3, difficulty: 'beginner', learningObjectives: [], references: [], status: 'active' }]);
  await put('modules', [{ id: 'm', courseId: 'c', order: 1, title: L('M'), description: L('') }]);
  await put('lectures', [{ id: 'l', moduleId: 'm', courseId: 'c', order: 1, title: L('L'), estimatedMinutes: 30, difficulty: 'beginner', sections: [] }]);
  await put('exercises', [{ id: 'e', code: 'EX1', academyId: 'a', courseId: 'c', type: 'coding_challenge', difficulty: 'beginner', title: L('E'), instructions: L(''), learningObjective: L(''), hints: [], assessmentCriteria: [], maxScore: 10 }]);
  await put('assessments', [{ id: 'q', courseId: 'c', type: 'quiz', title: L('Q'), weight: 10, exerciseIds: ['e'] }]);
  await put('exerciseAttempts', [{ id: 'at', exerciseId: 'e', studentId: 'st', assessmentId: 'q', submission: 'x', submittedAt: T, status: 'graded', score: 9, hintsUsed: 0 }]);
  await put('enrollments', [{ id: 'en', studentId: 'st', programmeId: 'p', status: 'active', startedAt: T, currentSemesterId: 's1' }]);
  await put('studySessions', [{ id: 'ss', studentId: 'st', startedAt: T, endedAt: T, durationMinutes: 45, activityType: 'lecture', academyId: 'a', programmeId: 'p', semesterId: 's1', courseId: 'c', lectureId: 'l', completed: true, source: 'manual' }]);
  await put('progress', [{ id: 'pg', studentId: 'st', entityType: 'lecture', entityId: 'l', status: 'completed', percent: 100 }]);
  await put('notes', [{ id: 'n', studentId: 'st', entityType: 'course', entityId: 'c', kind: 'note', title: 'Nota', body: 'isi', tags: ['python'] }]);
  await put('bookmarks', [{ id: 'b', studentId: 'st', entityType: 'lecture', entityId: 'l' }]);
}

describe('schema v2', () => {
  it('is followed only by additive versions (current: v3, glossary)', () => {
    expect(CURRENT_SCHEMA_VERSION).toBe(3);
    expect(Object.keys(SCHEMA_VERSIONS[2]!.stores)).toEqual(['glossaryTerms']);
  });

  it('every reference used by delete-protection has a reverse index', async () => {
    const db = await freshDb();
    const indexes = (t: string) => db.table(t).schema.indexes;
    const missing = [
      ...RELATIONS.filter((r) => !indexes(r.table).some((i) => i.name === r.field)).map((r) => `${r.table}.${r.field}`),
      ...ARRAY_RELATIONS.filter((r) => !indexes(r.table).some((i) => i.name === r.field && i.multi)).map((r) => `${r.table}.*${r.field}`),
      ...POLYMORPHIC_RELATIONS.filter((r) => !indexes(r.table).some((i) => i.name === `[${r.typeField}+${r.idField}]`)).map(
        (r) => `${r.table}.[${r.typeField}+${r.idField}]`,
      ),
    ];
    expect(missing).toEqual([]);
  });
});

describe('migration v1 (Phase 1.2) → v2', () => {
  it('upgrades in place: all data identical, recovery point created, new indexes usable, integrity clean', async () => {
    const name = `mig-v1-v2-${Date.now()}`;
    const v1 = v1Database(name);
    await v1.open();
    await populateV1(v1);
    const before = await dumpTables(v1);
    v1.close();

    const db = new QhazeDatabase(name);
    const result = await bootstrapDatabase(db);
    expect(result).toMatchObject({ status: 'ready', migratedFrom: 1 });
    expect(db.verno).toBe(CURRENT_SCHEMA_VERSION);

    // Every user table is byte-identical (only system tables gain entries).
    const after = await dumpTables(db);
    const changed = Object.keys(before).filter((t) => !['meta', 'activityLog'].includes(t) && JSON.stringify(before[t]) !== JSON.stringify(after[t]));
    expect(changed).toEqual([]);
    expect(await db.students.get('st')).toMatchObject({ fullName: 'Nur Aisyah', bio: 'Pelajar' });
    expect((await db.meta.get('lastBackupAt'))?.value).toBe(T);
    expect((await db.meta.get('schemaVersion'))?.value).toBe(CURRENT_SCHEMA_VERSION);

    // Pre-migration recovery point holds the complete v1 data.
    const snaps = await db.snapshots.where('reason').equals('pre-migration').toArray();
    expect(snaps).toHaveLength(1);
    const payload = JSON.parse((await db.snapshotPayloads.get(snaps[0]!.id))!.payload);
    expect(payload.schemaVersion).toBe(1);
    expect(payload.data.studySessions).toEqual(before.studySessions);
    expect(await db.activityLog.where('type').equals('database.migrated').count()).toBe(1);

    // The new reverse indexes work on migrated rows.
    expect(await db.studySessions.where('programmeId').equals('p').count()).toBe(1);
    expect(await db.studySessions.where('semesterId').equals('s1').count()).toBe(1);
    expect(await db.enrollments.where('currentSemesterId').equals('s1').count()).toBe(1);
    expect(await db.exerciseAttempts.where('assessmentId').equals('q').count()).toBe(1);
    expect(await db.assessments.where('exerciseIds').equals('e').count()).toBe(1);
    expect(await db.progress.where('[entityType+entityId]').equals(['lecture', 'l']).count()).toBe(1);
    expect(await db.notes.where('[entityType+entityId]').equals(['course', 'c']).count()).toBe(1);
    expect(await db.bookmarks.where('[entityType+entityId]').equals(['lecture', 'l']).count()).toBe(1);

    expect((await checkDatabaseIntegrity(db)).issues).toEqual([]);
  });

  it('the pre-migration recovery point can be restored after the upgrade', async () => {
    const name = `mig-restore-${Date.now()}`;
    const v1 = v1Database(name);
    await v1.open();
    await populateV1(v1);
    v1.close();
    const db = new QhazeDatabase(name);
    await bootstrapDatabase(db);
    await db.students.update('st', { fullName: 'Changed' });
    const snap = (await db.snapshots.where('reason').equals('pre-migration').first())!;
    const { restoreSnapshot } = await import('@/db/backup/backup');
    await restoreSnapshot(db, snap.id);
    expect((await db.students.get('st'))?.fullName).toBe('Nur Aisyah');
  });

  it('a backup file exported by v1 restores into v2', async () => {
    const name = `mig-backup-${Date.now()}`;
    const v1 = v1Database(name);
    await v1.open();
    await populateV1(v1);
    const v1File = serializeBackup(await createBackup(v1, 1));
    v1.close();

    const db = await freshDb();
    const result = await validateBackup(v1File);
    expect(result.ok).toBe(true);
    expect(result.warnings).toContain('migrated_from_older_schema');
    await restoreBackup(db, result.backup!, 'replace');
    expect(await db.studySessions.where('programmeId').equals('p').count()).toBe(1);
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);
  });
});

describe('migration v2 (0.3.x) → v3 (glossary)', () => {
  it('adds the glossary table without touching existing data, after a pre-migration recovery point', async () => {
    const name = `mig-v2-v3-${Date.now()}`;
    const v2 = new Dexie(name);
    v2.version(1).stores(SCHEMA_VERSIONS[0]!.stores as Record<string, string>);
    v2.version(2).stores(SCHEMA_VERSIONS[1]!.stores as Record<string, string>);
    await v2.open();
    await populateV1(v2);
    const before = await dumpTables(v2);
    v2.close();

    const db = new QhazeDatabase(name);
    expect(await bootstrapDatabase(db)).toMatchObject({ status: 'ready', migratedFrom: 2 });
    const after = await dumpTables(db);
    const changed = Object.keys(before).filter((t) => !['meta', 'activityLog'].includes(t) && JSON.stringify(before[t]) !== JSON.stringify(after[t]));
    expect(changed).toEqual([]);
    expect(after.glossaryTerms).toEqual([]);
    expect(await db.snapshots.where('reason').equals('pre-migration').count()).toBe(1);
    expect((await checkDatabaseIntegrity(db)).issues).toEqual([]);
  });
});
