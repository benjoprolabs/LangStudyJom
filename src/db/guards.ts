import Dexie, { type Transaction } from 'dexie';
import { newId } from '@/lib/id';
import { nowIso } from '@/lib/time';
import type { QhazeDatabase } from './database';
import {
  ARRAY_RELATIONS,
  checkIntegrity,
  dumpTables,
  IntegrityError,
  POLYMORPHIC_RELATIONS,
  RELATIONS,
  type IntegrityIssue,
} from './integrity';
import { NON_EXPORTED_TABLES } from './schema';
import type { ActivityLogType } from './types';

/**
 * Write-safety guards (Phase 2 Step 0).
 *
 *  - `findReferencingRecords`: who points at this record? (uses the v2 reverse indexes)
 *  - `planDelete` / `deleteRecord`: deletion is BLOCKED while anything references the record.
 *    Records the parent OWNS (see `OWNED`) are deleted with it — but only if nothing else
 *    references them.
 *  - `guardedWrite`: runs a write in one transaction and compares the integrity report
 *    before/after; if the write introduces ANY new issue, the whole transaction is rolled back.
 */

export interface Reference {
  table: string;
  id: string;
  field: string;
}

/** Thrown when a delete would leave other records pointing at nothing. */
export class ReferencedRecordError extends Error {
  constructor(public readonly references: Reference[]) {
    super(`record_referenced: ${references.length} reference(s)`);
    this.name = 'ReferencedRecordError';
  }
}

/** Find every record that references `table/id`, via FK, array and polymorphic relations. */
export async function findReferencingRecords(db: QhazeDatabase, table: string, id: string): Promise<Reference[]> {
  const refs: Reference[] = [];
  for (const rel of RELATIONS) {
    if (rel.target !== table) continue;
    const keys = await db.table(rel.table).where(rel.field).equals(id).primaryKeys();
    for (const k of keys) refs.push({ table: rel.table, id: String(k), field: rel.field });
  }
  for (const rel of ARRAY_RELATIONS) {
    if (rel.target !== table) continue;
    const keys = await db.table(rel.table).where(rel.field).equals(id).primaryKeys();
    for (const k of keys) refs.push({ table: rel.table, id: String(k), field: rel.field });
  }
  for (const rel of POLYMORPHIC_RELATIONS) {
    for (const [type, target] of Object.entries(rel.targets)) {
      if (target !== table) continue;
      const keys = await db
        .table(rel.table)
        .where(`[${rel.typeField}+${rel.idField}]`)
        .equals([type, id])
        .primaryKeys();
      for (const k of keys) refs.push({ table: rel.table, id: String(k), field: rel.idField });
    }
  }
  return refs;
}

/** Children deleted together with their parent (only when nothing else references them). */
export const OWNED: { parent: string; child: string; field: string }[] = [
  { parent: 'programmes', child: 'semesters', field: 'programmeId' },
  { parent: 'courses', child: 'coursePrerequisites', field: 'courseId' },
  // A course's own structure (Phase 2 seeding). Student progress, notes or bookmarks on any
  // of these still block the delete, because those references are not owned.
  { parent: 'courses', child: 'modules', field: 'courseId' },
  { parent: 'modules', child: 'lectures', field: 'moduleId' },
  { parent: 'lectures', child: 'learningMaterials', field: 'lectureId' },
];

export interface DeletePlan {
  /** Records that would be deleted: the target first, then owned children. */
  toDelete: { table: string; id: string }[];
  /** References that block the delete. Empty → the delete is allowed. */
  blockers: Reference[];
}

export async function planDelete(db: QhazeDatabase, table: string, id: string): Promise<DeletePlan> {
  const toDelete: { table: string; id: string }[] = [];
  const marked = new Set<string>();
  const allRefs: Reference[] = [];
  const key = (t: string, i: string) => `${t}/${i}`;

  const visit = async (t: string, i: string) => {
    if (marked.has(key(t, i))) return;
    marked.add(key(t, i));
    toDelete.push({ table: t, id: i });
    for (const ref of await findReferencingRecords(db, t, i)) {
      const owned = OWNED.some((o) => o.parent === t && o.child === ref.table && o.field === ref.field);
      if (owned) await visit(ref.table, ref.id);
      else allRefs.push(ref);
    }
  };
  await visit(table, id);
  // A reference from a record that is itself being deleted does not block;
  // a record referencing via several fields is listed once.
  const seen = new Set<string>();
  const blockers = allRefs.filter((r) => {
    const k = key(r.table, r.id);
    if (marked.has(k) || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return { toDelete, blockers };
}

/** Tables a guarded write may touch (everything except recovery-point storage). */
function writableTables(db: QhazeDatabase) {
  return db.tables.filter((t) => !NON_EXPORTED_TABLES.has(t.name));
}

const GUARD_FLAG = '__qhazeGuardedWrite';

/** Is the current Dexie transaction (or one of its parents) a guarded write? */
function insideGuardedWrite(): boolean {
  for (let tx = Dexie.currentTransaction as (Transaction & { parent?: unknown }) | null; tx; tx = tx.parent as typeof tx) {
    if ((tx as unknown as Record<string, unknown>)[GUARD_FLAG]) return true;
  }
  return false;
}

function markGuarded() {
  const tx = Dexie.currentTransaction as unknown as Record<string, unknown> | null;
  if (tx) tx[GUARD_FLAG] = true;
}

const signature = (i: IntegrityIssue) => `${i.table}|${i.id}|${i.kind}|${i.detail}`;

/**
 * Run `fn` in a single read-write transaction. If the database has any integrity issue
 * after `fn` that it did not have before, throw `IntegrityError` → Dexie rolls back every
 * write made by `fn`. Pre-existing issues never block unrelated edits.
 */
export async function guardedWrite<T>(db: QhazeDatabase, fn: () => Promise<T>): Promise<T> {
  // Nested call (e.g. a repository function inside a curriculum install): the outer guard
  // already compares the whole database before/after, so run `fn` inside the outer transaction.
  if (insideGuardedWrite()) return fn();
  return db.transaction('rw', writableTables(db), async () => {
    markGuarded();
    const before = new Set(checkIntegrity(await dumpTables(db)).issues.map(signature));
    const result = await fn();
    const introduced = checkIntegrity(await dumpTables(db)).issues.filter((i) => !before.has(signature(i)));
    if (introduced.length) throw new IntegrityError(introduced);
    return result;
  });
}

export async function logActivity(
  db: QhazeDatabase,
  type: ActivityLogType,
  details?: Record<string, string | number | boolean>,
): Promise<void> {
  await db.activityLog.add({ id: newId(), timestamp: nowIso(), type, details });
}

/**
 * Delete a record (and the children it owns). Throws `ReferencedRecordError` — and deletes
 * nothing — while any other record still references it.
 */
export async function deleteRecord(
  db: QhazeDatabase,
  table: string,
  id: string,
  log?: { type: ActivityLogType; details: Record<string, string | number | boolean> },
): Promise<DeletePlan> {
  return guardedWrite(db, async () => {
    const plan = await planDelete(db, table, id);
    if (plan.blockers.length) throw new ReferencedRecordError(plan.blockers);
    // Children first, then the parent.
    for (const item of [...plan.toDelete].reverse()) await db.table(item.table).delete(item.id);
    if (log) await logActivity(db, log.type, { ...log.details, removed: plan.toDelete.length });
    return plan;
  });
}
