import Dexie from 'dexie';
import { newId } from '@/lib/id';
import { nowIso } from '@/lib/time';
import { createBackup, createSnapshot, serializeBackup, type BackupFile } from './backup/backup';
import type { QhazeDatabase } from './database';
import { ensureSettings } from './repositories/settings';
import { CURRENT_SCHEMA_VERSION } from './schema';

export type BootstrapResult =
  | { status: 'ready'; migratedFrom?: number; persisted: boolean | null }
  | { status: 'error'; code: 'newer_database' | 'blocked' | 'unavailable' | 'migration_failed'; message: string; rescueBackup?: string };

/**
 * Read the on-disk schema version without triggering an upgrade.
 * Returns 0 when the database does not exist yet.
 */
async function readExistingVersion(name: string): Promise<number> {
  if (!(await Dexie.exists(name))) return 0;
  const probe = new Dexie(name);
  try {
    await probe.open(); // dynamic mode: opens whatever version is on disk
    return probe.verno;
  } finally {
    probe.close();
  }
}

/** Dump an older-version database (using its own on-disk schema) to a backup object. */
async function dumpExisting(name: string, version: number): Promise<BackupFile> {
  const probe = new Dexie(name);
  try {
    await probe.open();
    return await createBackup(probe, version);
  } finally {
    probe.close();
  }
}

export async function getPersistenceStatus(): Promise<boolean | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persisted) return null;
  try {
    return await navigator.storage.persisted();
  } catch {
    return null;
  }
}

/** Ask the browser not to evict our storage under pressure (call from a user action). */
export async function requestPersistentStorage(): Promise<boolean | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return null;
  try {
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return null;
  }
}

/**
 * Open the database safely:
 *  1. Detect the on-disk version.
 *  2. If an upgrade is needed, dump the old data in memory first.
 *  3. Open (runs Dexie migrations atomically — on failure the old DB is untouched).
 *  4. Store the dump as a `pre-migration` snapshot.
 *  5. Ensure the settings row and metadata exist.
 */
export async function bootstrapDatabase(db: QhazeDatabase): Promise<BootstrapResult> {
  if (typeof indexedDB === 'undefined') {
    return { status: 'error', code: 'unavailable', message: 'IndexedDB is not available in this browser.' };
  }

  // Highest version declared in code (equals CURRENT_SCHEMA_VERSION in production).
  const targetVersion = db.verno || CURRENT_SCHEMA_VERSION;
  let previousVersion = 0;
  let preMigration: BackupFile | undefined;
  try {
    previousVersion = await readExistingVersion(db.name);
    if (previousVersion > targetVersion) {
      return {
        status: 'error',
        code: 'newer_database',
        message: `Database version ${previousVersion} is newer than this app supports (${targetVersion}).`,
      };
    }
    if (previousVersion > 0 && previousVersion < targetVersion) {
      preMigration = await dumpExisting(db.name, previousVersion);
    }
  } catch (err) {
    return { status: 'error', code: 'unavailable', message: String(err) };
  }

  try {
    await db.open();
  } catch (err) {
    const name = (err as { name?: string }).name;
    return {
      status: 'error',
      code: name === 'VersionError' ? 'newer_database' : preMigration ? 'migration_failed' : 'blocked',
      message: String(err),
      rescueBackup: preMigration ? serializeBackup(preMigration) : undefined,
    };
  }

  await ensureSettings(db);
  const now = nowIso();
  if (!(await db.meta.get('installedAt'))) await db.meta.put({ key: 'installedAt', value: now });
  await db.meta.put({ key: 'schemaVersion', value: targetVersion });

  if (preMigration) {
    await createSnapshot(db, 'pre-migration', preMigration);
    await db.activityLog.add({
      id: newId(),
      timestamp: now,
      type: 'database.migrated',
      details: { from: previousVersion, to: targetVersion },
    });
  }

  const persisted = await getPersistenceStatus();
  return { status: 'ready', migratedFrom: preMigration ? previousVersion : undefined, persisted };
}
