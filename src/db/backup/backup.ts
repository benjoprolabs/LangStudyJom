import type Dexie from 'dexie';
import { z } from 'zod';
import { sha256Hex } from '@/lib/checksum';
import { newId } from '@/lib/id';
import { nowIso } from '@/lib/time';
import type { QhazeDatabase } from '../database';
import { checkIntegrity, dumpTables, type IntegrityReport } from '../integrity';
import { CURRENT_SCHEMA_VERSION, NON_EXPORTED_TABLES, primaryKeyOf, tablesAtLatestVersion } from '../schema';
import type { Snapshot, SnapshotReason } from '../types';
import { migrateBackupData } from './migrations';

export const BACKUP_FORMAT = 'qhaze-tech-university-backup';
export const BACKUP_FORMAT_VERSION = 1;
export const APP_VERSION: string = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.0.0';

type Row = Record<string, unknown>;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  formatVersion: number;
  appVersion: string;
  schemaVersion: number;
  exportedAt: string;
  recordCounts: Record<string, number>;
  /** SHA-256 of JSON.stringify(data). */
  checksum: string;
  data: Record<string, Row[]>;
}

const envelopeSchema = z.object({
  format: z.literal(BACKUP_FORMAT),
  formatVersion: z.number().int().positive(),
  appVersion: z.string(),
  schemaVersion: z.number().int().positive(),
  exportedAt: z.string(),
  recordCounts: z.record(z.string(), z.number().int().nonnegative()),
  checksum: z.string().regex(/^[0-9a-f]{64}$/),
  data: z.record(z.string(), z.array(z.record(z.string(), z.unknown()))),
});

// ─── Export ────────────────────────────────────────────────────────────────

export async function createBackup(db: Dexie, schemaVersion: number = db.verno): Promise<BackupFile> {
  const data = await dumpTables(db);
  const recordCounts = Object.fromEntries(Object.entries(data).map(([k, rows]) => [k, rows.length]));
  return {
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_FORMAT_VERSION,
    appVersion: APP_VERSION,
    schemaVersion,
    exportedAt: nowIso(),
    recordCounts,
    checksum: await sha256Hex(JSON.stringify(data)),
    data,
  };
}

export function serializeBackup(backup: BackupFile): string {
  return JSON.stringify(backup);
}

export function backupFileName(date: Date = new Date()): string {
  const stamp = date.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `qhaze-backup-${stamp}.json`;
}

/** Export a backup and record the export time (for backup reminders). */
export async function exportBackup(db: QhazeDatabase): Promise<{ fileName: string; content: string; backup: BackupFile }> {
  const backup = await createBackup(db);
  const content = serializeBackup(backup);
  const totalRecords = Object.values(backup.recordCounts).reduce((a, b) => a + b, 0);
  await db.transaction('rw', db.meta, db.activityLog, async () => {
    await db.meta.put({ key: 'lastBackupAt', value: backup.exportedAt });
    await db.activityLog.add({
      id: newId(),
      timestamp: backup.exportedAt,
      type: 'backup.exported',
      details: { records: totalRecords },
    });
  });
  return { fileName: backupFileName(new Date(backup.exportedAt)), content, backup };
}

// ─── Validation ────────────────────────────────────────────────────────────

export interface ValidationResult {
  ok: boolean;
  backup?: BackupFile;
  errors: string[];
  warnings: string[];
  integrity?: IntegrityReport;
}

/**
 * Parse and fully validate a backup file before anything touches the database:
 * JSON syntax → envelope shape → format → schema version → checksum →
 * data migrations (older backups) → per-row primary keys → referential integrity.
 */
export async function validateBackup(text: string): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, errors: ['invalid_json'], warnings };
  }

  const envelope = envelopeSchema.safeParse(parsed);
  if (!envelope.success) {
    const isOtherFormat = typeof parsed === 'object' && parsed !== null && (parsed as Row).format !== BACKUP_FORMAT;
    return { ok: false, errors: [isOtherFormat ? 'wrong_format' : 'invalid_structure'], warnings };
  }
  const file = envelope.data;

  if (file.formatVersion > BACKUP_FORMAT_VERSION) errors.push('format_too_new');
  if (file.schemaVersion > CURRENT_SCHEMA_VERSION) errors.push('schema_too_new');
  if (errors.length) return { ok: false, errors, warnings };

  const actualChecksum = await sha256Hex(JSON.stringify(file.data));
  if (actualChecksum !== file.checksum) return { ok: false, errors: ['checksum_mismatch'], warnings };

  let data = file.data as Record<string, Row[]>;
  if (file.schemaVersion < CURRENT_SCHEMA_VERSION) {
    data = migrateBackupData(data, file.schemaVersion, CURRENT_SCHEMA_VERSION);
    warnings.push('migrated_from_older_schema');
  }

  const known = new Set(tablesAtLatestVersion());
  const cleaned: Record<string, Row[]> = {};
  for (const [table, rows] of Object.entries(data)) {
    if (!known.has(table) || NON_EXPORTED_TABLES.has(table)) {
      warnings.push(`unknown_table:${table}`);
      continue;
    }
    cleaned[table] = rows;
  }

  const integrity = checkIntegrity(cleaned);
  const fatal = integrity.issues.filter((i) => i.kind === 'missing_id' || i.kind === 'duplicate_id');
  if (fatal.length) errors.push('invalid_records');
  else if (!integrity.ok) warnings.push('integrity_issues');

  if ((cleaned.students?.length ?? 0) === 0) warnings.push('no_student_profile');

  return {
    ok: errors.length === 0,
    backup: { ...file, format: BACKUP_FORMAT, schemaVersion: CURRENT_SCHEMA_VERSION, data: cleaned },
    errors,
    warnings,
    integrity,
  };
}

// ─── Snapshots (internal recovery points) ──────────────────────────────────

export async function createSnapshot(
  db: QhazeDatabase,
  reason: SnapshotReason,
  existingBackup?: BackupFile,
): Promise<Snapshot> {
  const backup = existingBackup ?? (await createBackup(db));
  const payload = serializeBackup(backup);
  const snapshot: Snapshot = {
    id: newId(),
    createdAt: nowIso(),
    reason,
    schemaVersion: backup.schemaVersion,
    appVersion: backup.appVersion,
    sizeBytes: new Blob([payload]).size,
    recordCount: Object.values(backup.recordCounts).reduce((a, b) => a + b, 0),
  };
  await db.transaction('rw', db.snapshots, db.snapshotPayloads, db.activityLog, async () => {
    await db.snapshots.add(snapshot);
    await db.snapshotPayloads.add({ id: snapshot.id, payload });
    await db.activityLog.add({
      id: newId(),
      timestamp: snapshot.createdAt,
      type: 'snapshot.created',
      details: { reason },
    });
  });
  await pruneAutomaticSnapshots(db);
  return snapshot;
}

/**
 * Keep only the newest N automatic snapshots (N = settings.autoSnapshotRetention).
 * Manual snapshots are never pruned automatically.
 */
export async function pruneAutomaticSnapshots(db: QhazeDatabase): Promise<number> {
  const settings = await db.settings.get('app');
  const keep = Math.max(1, settings?.autoSnapshotRetention ?? 10);
  const automatic = (await db.snapshots.orderBy('createdAt').reverse().toArray()).filter((s) => s.reason !== 'manual');
  const excess = automatic.slice(keep).map((s) => s.id);
  if (excess.length) {
    await db.transaction('rw', db.snapshots, db.snapshotPayloads, async () => {
      await db.snapshots.bulkDelete(excess);
      await db.snapshotPayloads.bulkDelete(excess);
    });
  }
  return excess.length;
}

export async function deleteSnapshot(db: QhazeDatabase, id: string): Promise<void> {
  await db.transaction('rw', db.snapshots, db.snapshotPayloads, db.activityLog, async () => {
    await db.snapshots.delete(id);
    await db.snapshotPayloads.delete(id);
    await db.activityLog.add({ id: newId(), timestamp: nowIso(), type: 'snapshot.deleted' });
  });
}

// ─── Restore ───────────────────────────────────────────────────────────────

export type RestoreMode = 'replace' | 'merge';

export interface RestoreResult {
  mode: RestoreMode;
  safetySnapshotId: string;
  written: number;
  skipped: number;
}

/**
 * Restore a validated backup.
 *  - `replace`: clear every exportable table, then write the backup's records.
 *  - `merge`:   upsert records; an existing record is only overwritten when the
 *               incoming one has a newer-or-equal `updatedAt`. Nothing is removed.
 *
 * A `pre-restore` snapshot is ALWAYS created first, and the whole write happens in a
 * single transaction, so a failure leaves the database untouched.
 */
export async function restoreBackup(db: QhazeDatabase, backup: BackupFile, mode: RestoreMode): Promise<RestoreResult> {
  const safety = await createSnapshot(db, 'pre-restore');
  const tables = db.tables.filter((t) => !NON_EXPORTED_TABLES.has(t.name));
  let written = 0;
  let skipped = 0;

  await db.transaction('rw', tables, async () => {
    for (const table of tables) {
      const rows = backup.data[table.name] ?? [];
      if (mode === 'replace') {
        await table.clear();
        if (rows.length) await table.bulkPut(rows);
        written += rows.length;
        continue;
      }
      const pk = primaryKeyOf(table.name);
      const existing = await table.bulkGet(rows.map((r) => r[pk] as string));
      const toWrite: Row[] = [];
      rows.forEach((row, i) => {
        const current = existing[i] as Row | undefined;
        const incomingNewer =
          !current ||
          (typeof row.updatedAt === 'string' &&
            typeof current.updatedAt === 'string' &&
            row.updatedAt >= current.updatedAt);
        if (incomingNewer) toWrite.push(row);
        else skipped++;
      });
      if (toWrite.length) await table.bulkPut(toWrite);
      written += toWrite.length;
    }
  });

  await db.activityLog.add({
    id: newId(),
    timestamp: nowIso(),
    type: 'backup.restored',
    details: { mode, written, skipped },
  });

  return { mode, safetySnapshotId: safety.id, written, skipped };
}

export async function restoreSnapshot(db: QhazeDatabase, snapshotId: string): Promise<RestoreResult> {
  const payload = await getSnapshotPayload(db, snapshotId);
  const result = await validateBackup(payload);
  if (!result.ok || !result.backup) throw new Error(`snapshot_invalid:${result.errors.join(',')}`);
  return restoreBackup(db, result.backup, 'replace');
}

export async function getSnapshotPayload(db: QhazeDatabase, snapshotId: string): Promise<string> {
  const row = await db.snapshotPayloads.get(snapshotId);
  if (!row) throw new Error('snapshot_not_found');
  return row.payload;
}
