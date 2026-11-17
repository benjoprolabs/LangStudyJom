import { describe, expect, it } from 'vitest';
import { QhazeDatabase } from '@/db/database';
import { bootstrapDatabase } from '@/db/bootstrap';
import { CURRENT_SCHEMA_VERSION, tablesAtLatestVersion } from '@/db/schema';
import { createStudent, getPrimaryStudent } from '@/db/repositories/student';
import { updateSettings } from '@/db/repositories/settings';
import { freshDb } from '@/test/helpers';

describe('database foundation', () => {
  it('bootstraps with all tables, default settings and metadata', async () => {
    const db = await freshDb();
    expect(db.verno).toBe(CURRENT_SCHEMA_VERSION);
    expect(db.tables.map((t) => t.name).sort()).toEqual(tablesAtLatestVersion().sort());
    const settings = await db.settings.get('app');
    expect(settings).toMatchObject({ language: 'ms', theme: 'dark' });
    expect((await db.meta.get('schemaVersion'))?.value).toBe(CURRENT_SCHEMA_VERSION);
    expect(typeof (await db.meta.get('installedAt'))?.value).toBe('string');
  });

  it('is idempotent: bootstrapping twice keeps installedAt and settings', async () => {
    const db = await freshDb();
    await updateSettings(db, { language: 'en' });
    const installedAt = (await db.meta.get('installedAt'))?.value;
    db.close();
    const again = new QhazeDatabase(db.name);
    await bootstrapDatabase(again);
    expect((await again.meta.get('installedAt'))?.value).toBe(installedAt);
    expect((await again.settings.get('app'))?.language).toBe('en');
  });

  it('persists records across close and reopen (simulated restart)', async () => {
    const db = await freshDb();
    const student = await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' });
    await updateSettings(db, { language: 'en', theme: 'light' });
    db.close();

    const reopened = new QhazeDatabase(db.name);
    const result = await bootstrapDatabase(reopened);
    expect(result.status).toBe('ready');
    expect(await getPrimaryStudent(reopened)).toEqual(student);
    expect(await reopened.settings.get('app')).toMatchObject({ language: 'en', theme: 'light' });
  });

  it('refuses to open a database created by a newer app version without touching it', async () => {
    const db = await freshDb();
    await createStudent(db, { fullName: 'A', preferredName: 'A' });
    db.close();

    // Simulate a future app version (v99) having upgraded this DB.
    const future = new QhazeDatabase(db.name);
    future.version(99).stores({});
    await future.open();
    future.close();

    const current = new QhazeDatabase(db.name);
    const result = await bootstrapDatabase(current);
    expect(result).toMatchObject({ status: 'error', code: 'newer_database' });
  });
});
