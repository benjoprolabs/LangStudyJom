/**
 * Data transforms applied to backup files exported by an OLDER schema version,
 * so they can be restored into the current database.
 *
 * Every schema version that has an `upgrade` function in `schema.ts` must have a
 * matching entry here keyed by the TARGET version. Version 1 is the baseline.
 */
type Row = Record<string, unknown>;
type Data = Record<string, Row[]>;

export const BACKUP_MIGRATIONS: Record<number, (data: Data) => Data> = {
  // Example for a future version:
  // 2: (data) => ({ ...data, notes: (data.notes ?? []).map((n) => ({ pinned: false, ...n })) }),
};

export function migrateBackupData(data: Data, fromVersion: number, toVersion: number): Data {
  let current = data;
  for (let v = fromVersion + 1; v <= toVersion; v++) {
    const step = BACKUP_MIGRATIONS[v];
    if (step) current = step(current);
  }
  return current;
}
