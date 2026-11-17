import { describe, expect, it } from 'vitest';
import { QhazeDatabase } from '@/db/database';
import { bootstrapDatabase } from '@/db/bootstrap';
import { checkDatabaseIntegrity, dumpTables } from '@/db/integrity';
import { migrateBackupData } from '@/db/backup/migrations';
import { createStudent } from '@/db/repositories/student';
import { CURRENT_SCHEMA_VERSION } from '@/db/schema';
import { freshDb } from '@/test/helpers';

const NEXT = CURRENT_SCHEMA_VERSION + 1;

/** A hypothetical next schema version, used to exercise the real upgrade path. */
class NextVersionDb extends QhazeDatabase {
  constructor(name: string) {
    super(name);
    this.version(NEXT)
      .stores({ notes: 'id, studentId, entityType, entityId, kind, updatedAt, *tags, [entityType+entityId], pinned' })
      .upgrade((tx) =>
        tx
          .table('notes')
          .toCollection()
          .modify((n: Record<string, unknown>) => {
            n.pinned = 0;
          }),
      );
  }
}

describe('schema migration', () => {
  it('snapshots data before upgrading and preserves integrity', async () => {
    const v1 = await freshDb();
    const student = await createStudent(v1, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' });
    await v1.notes.add({ id: 'n1', studentId: student.id, entityType: 'general', kind: 'note', title: 't', body: 'b', tags: ['py'], createdAt: 'x', updatedAt: 'x' });
    const before = await dumpTables(v1);
    expect((await checkDatabaseIntegrity(v1)).ok).toBe(true);
    v1.close();

    const v2 = new NextVersionDb(v1.name);
    const result = await bootstrapDatabase(v2);
    expect(result).toMatchObject({ status: 'ready', migratedFrom: CURRENT_SCHEMA_VERSION });
    expect(v2.verno).toBe(NEXT);

    // Data intact + upgrade applied.
    expect(await v2.students.get(student.id)).toEqual(before.students![0]);
    expect(await v2.notes.get('n1')).toMatchObject({ title: 't', pinned: 0 });
    expect((await checkDatabaseIntegrity(v2)).ok).toBe(true);

    // Pre-migration snapshot contains the original v1 data.
    const snaps = await v2.snapshots.where('reason').equals('pre-migration').toArray();
    expect(snaps).toHaveLength(1);
    const payload = JSON.parse((await v2.snapshotPayloads.get(snaps[0]!.id))!.payload);
    expect(payload.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(payload.data.notes).toEqual(before.notes);
    expect(await v2.activityLog.where('type').equals('database.migrated').count()).toBe(1);
    expect((await v2.meta.get('schemaVersion'))?.value).toBe(NEXT);
  });

  it('does not snapshot on a fresh install or when already current', async () => {
    const db = await freshDb();
    expect(await db.snapshots.count()).toBe(0);
    db.close();
    const again = new QhazeDatabase(db.name);
    const r = await bootstrapDatabase(again);
    expect(r).toMatchObject({ status: 'ready', migratedFrom: undefined });
    expect(await again.snapshots.count()).toBe(0);
  });

  it('backup data migration chain is a no-op when there are no steps', () => {
    const data = { notes: [{ id: 'a' }] };
    expect(migrateBackupData(data, 1, 1)).toBe(data);
  });
});
