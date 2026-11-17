import type Dexie from 'dexie';
import { NON_EXPORTED_TABLES, primaryKeyOf } from './schema';

/**
 * Data integrity rules.
 *
 * Two kinds of rule are enforced by ONE engine (`checkRowReferences`), used both for
 * whole-dataset checks (live database, incoming backups) and for write-time validation
 * of a single record (`validateReferences` / `assertValidReferences`):
 *
 *  1. Foreign keys (`RELATIONS`): `table.field` must reference an existing row in `target`.
 *     Optional references are only checked when set.
 *  2. Relationship consistency (`CHAIN_CONSISTENCY`): when a record carries several
 *     references along the curriculum chain (lecture → course → semester → programme →
 *     academy), they must describe the SAME path. E.g. a study session cannot point at a
 *     course in semester 1 while also pointing at semester 2.
 *
 * Known gaps still to close before Phase 2 seeds curriculum data: see docs/INTEGRITY.md.
 */

type Row = Record<string, unknown>;

interface Relation {
  table: string;
  field: string;
  target: string;
  optional?: boolean;
}

export const RELATIONS: Relation[] = [
  { table: 'academies', field: 'facultyId', target: 'faculties' },
  { table: 'programmes', field: 'academyId', target: 'academies' },
  { table: 'semesters', field: 'programmeId', target: 'programmes' },
  { table: 'courses', field: 'programmeId', target: 'programmes' },
  { table: 'courses', field: 'semesterId', target: 'semesters' },
  { table: 'coursePrerequisites', field: 'courseId', target: 'courses' },
  { table: 'coursePrerequisites', field: 'prerequisiteCourseId', target: 'courses' },
  { table: 'modules', field: 'courseId', target: 'courses' },
  { table: 'lectures', field: 'moduleId', target: 'modules' },
  { table: 'lectures', field: 'courseId', target: 'courses' },
  { table: 'learningMaterials', field: 'lectureId', target: 'lectures' },
  { table: 'enrollments', field: 'studentId', target: 'students' },
  { table: 'enrollments', field: 'programmeId', target: 'programmes' },
  { table: 'enrollments', field: 'currentSemesterId', target: 'semesters', optional: true },
  { table: 'exercises', field: 'academyId', target: 'academies' },
  { table: 'exercises', field: 'courseId', target: 'courses', optional: true },
  { table: 'exercises', field: 'lectureId', target: 'lectures', optional: true },
  { table: 'exerciseAttempts', field: 'exerciseId', target: 'exercises' },
  { table: 'exerciseAttempts', field: 'studentId', target: 'students' },
  { table: 'exerciseAttempts', field: 'assessmentId', target: 'assessments', optional: true },
  { table: 'assessments', field: 'courseId', target: 'courses' },
  { table: 'grades', field: 'studentId', target: 'students' },
  { table: 'grades', field: 'programmeId', target: 'programmes' },
  { table: 'grades', field: 'semesterId', target: 'semesters' },
  { table: 'grades', field: 'courseId', target: 'courses' },
  { table: 'grades', field: 'assessmentId', target: 'assessments', optional: true },
  { table: 'studySessions', field: 'studentId', target: 'students' },
  // Phase 1.1: study session curriculum references (broken-data categories 1–2).
  { table: 'studySessions', field: 'academyId', target: 'academies', optional: true },
  { table: 'studySessions', field: 'programmeId', target: 'programmes', optional: true },
  { table: 'studySessions', field: 'semesterId', target: 'semesters', optional: true },
  { table: 'studySessions', field: 'courseId', target: 'courses', optional: true },
  { table: 'studySessions', field: 'lectureId', target: 'lectures', optional: true },
  { table: 'progress', field: 'studentId', target: 'students' },
  { table: 'projects', field: 'studentId', target: 'students' },
  // Phase 1.1: project curriculum references (broken-data category 3).
  { table: 'projects', field: 'academyId', target: 'academies', optional: true },
  { table: 'projects', field: 'courseId', target: 'courses', optional: true },
  { table: 'projectTasks', field: 'projectId', target: 'projects' },
  { table: 'notes', field: 'studentId', target: 'students' },
  { table: 'bookmarks', field: 'studentId', target: 'students' },
  { table: 'achievements', field: 'studentId', target: 'students' },
];

/** Curriculum chain fields, most specific first. */
const CHAIN = ['lectureId', 'courseId', 'semesterId', 'programmeId', 'academyId'] as const;
type ChainField = (typeof CHAIN)[number];

/** How each chain level points to its parents. */
const CHAIN_PARENTS: Record<ChainField, { table: string; parents: ChainField[] }> = {
  lectureId: { table: 'lectures', parents: ['courseId'] },
  courseId: { table: 'courses', parents: ['semesterId', 'programmeId'] },
  semesterId: { table: 'semesters', parents: ['programmeId'] },
  programmeId: { table: 'programmes', parents: ['academyId'] },
  academyId: { table: 'academies', parents: [] },
};

/** Tables whose records carry several curriculum-chain references that must agree. */
export const CHAIN_CONSISTENCY: Record<string, ChainField[]> = {
  studySessions: ['lectureId', 'courseId', 'semesterId', 'programmeId', 'academyId'],
  projects: ['courseId', 'academyId'],
};

export type IntegrityIssueKind =
  | 'missing_reference'
  | 'inconsistent_reference'
  | 'duplicate_id'
  | 'missing_id'
  | 'self_prerequisite';

export interface IntegrityIssue {
  table: string;
  id: string;
  kind: IntegrityIssueKind;
  detail: string;
}

export interface IntegrityReport {
  ok: boolean;
  checkedRecords: number;
  issues: IntegrityIssue[];
}

/** Find a row by table + primary key. */
export type Lookup = (table: string, id: string) => Row | undefined;

const isSet = (v: unknown): v is string | number => v !== undefined && v !== null && v !== '';

/**
 * Walk up the curriculum chain from one reference and return every ancestor it implies,
 * e.g. courseId=c1 → { semesterId: s1, programmeId: p1, academyId: a1 }.
 * The record's own direct field wins over a value derived further up (no overriding).
 */
function impliedAncestors(start: ChainField, id: string, lookup: Lookup): Partial<Record<ChainField, string>> {
  const implied: Partial<Record<ChainField, string>> = {};
  const queue: [ChainField, string][] = [[start, id]];
  while (queue.length) {
    const [field, value] = queue.shift()!;
    const { table, parents } = CHAIN_PARENTS[field];
    const row = lookup(table, value);
    if (!row) continue; // missing rows are reported by the FK rule
    for (const parent of parents) {
      const parentId = row[parent];
      if (!isSet(parentId) || implied[parent] !== undefined) continue;
      implied[parent] = String(parentId);
      queue.push([parent, String(parentId)]);
    }
  }
  return implied;
}

/** All FK and consistency issues for ONE record. */
export function checkRowReferences(table: string, row: Row, lookup: Lookup): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const id = String(row[primaryKeyOf(table)]);

  for (const rel of RELATIONS) {
    if (rel.table !== table) continue;
    const ref = row[rel.field];
    if (!isSet(ref)) {
      if (!rel.optional) {
        issues.push({ table, id, kind: 'missing_reference', detail: `${rel.field} is empty (required → ${rel.target})` });
      }
      continue;
    }
    if (!lookup(rel.target, String(ref))) {
      issues.push({ table, id, kind: 'missing_reference', detail: `${rel.field}=${String(ref)} not found in ${rel.target}` });
    }
  }

  const chainFields = CHAIN_CONSISTENCY[table];
  if (chainFields) {
    const reported = new Set<ChainField>();
    // Most specific reference first, so a mismatch is attributed to the closest source.
    for (const from of CHAIN) {
      // A field already shown to be wrong is not trusted as a source (avoids cascading noise).
      if (!chainFields.includes(from) || !isSet(row[from]) || reported.has(from)) continue;
      const implied = impliedAncestors(from, String(row[from]), lookup);
      for (const [ancestor, expected] of Object.entries(implied) as [ChainField, string][]) {
        if (!chainFields.includes(ancestor) || reported.has(ancestor) || !isSet(row[ancestor])) continue;
        if (String(row[ancestor]) !== expected) {
          reported.add(ancestor);
          issues.push({
            table,
            id,
            kind: 'inconsistent_reference',
            detail: `${ancestor}=${String(row[ancestor])} contradicts ${from}=${String(row[from])} (which belongs to ${ancestor}=${expected})`,
          });
        }
      }
    }
  }

  if (table === 'coursePrerequisites' && isSet(row.courseId) && row.courseId === row.prerequisiteCourseId) {
    issues.push({ table, id, kind: 'self_prerequisite', detail: 'A course cannot be its own prerequisite' });
  }

  return issues;
}

/** Pure integrity check over a table → rows map (used for live DB and incoming backups). */
export function checkIntegrity(data: Record<string, Row[]>): IntegrityReport {
  const issues: IntegrityIssue[] = [];
  const index = new Map<string, Map<string, Row>>();
  let checkedRecords = 0;

  for (const [table, rows] of Object.entries(data)) {
    const pk = primaryKeyOf(table);
    const byId = new Map<string, Row>();
    for (const row of rows) {
      checkedRecords++;
      const id = row[pk];
      if (typeof id !== 'string' || id.length === 0) {
        issues.push({ table, id: String(id), kind: 'missing_id', detail: `Missing ${pk}` });
        continue;
      }
      if (byId.has(id)) issues.push({ table, id, kind: 'duplicate_id', detail: `Duplicate ${pk}` });
      byId.set(id, row);
    }
    index.set(table, byId);
  }

  const lookup: Lookup = (table, id) => index.get(table)?.get(id);
  for (const [table, rows] of Object.entries(data)) {
    for (const row of rows) issues.push(...checkRowReferences(table, row, lookup));
  }

  return { ok: issues.length === 0, checkedRecords, issues };
}

// ─── Write-time validation (single record against the live database) ───────

/** Thrown by `assertValidReferences`; carries the issues for display or logging. */
export class IntegrityError extends Error {
  constructor(public readonly issues: IntegrityIssue[]) {
    super(`integrity_violation: ${issues.map((i) => `${i.table}.${i.detail}`).join('; ')}`);
    this.name = 'IntegrityError';
  }
}

/** Fields that lead from a row to its parents, per table (used to prefetch the chain). */
const PARENT_FIELDS: Record<string, [string, string][]> = Object.fromEntries(
  [...new Set(RELATIONS.map((r) => r.table))].map((t) => [t, RELATIONS.filter((r) => r.table === t).map((r) => [r.field, r.target])]),
);

/**
 * Load every row the record references, plus their ancestors, so the synchronous rule
 * engine can run against a small in-memory cache.
 */
async function prefetchReferences(db: Dexie, table: string, row: Row): Promise<Lookup> {
  const cache = new Map<string, Row | undefined>();
  const key = (t: string, id: string) => `${t}\u0000${id}`;
  const pending: [string, Row][] = [[table, row]];
  for (let guard = 0; pending.length && guard < 64; guard++) {
    const [t, r] = pending.shift()!;
    for (const [field, target] of PARENT_FIELDS[t] ?? []) {
      const ref = r[field];
      if (!isSet(ref) || cache.has(key(target, String(ref)))) continue;
      const found = (await db.table(target).get(String(ref))) as Row | undefined;
      cache.set(key(target, String(ref)), found);
      if (found) pending.push([target, found]);
    }
  }
  return (t, id) => cache.get(key(t, id));
}

/** Validate one record's references against the database without writing anything. */
export async function validateReferences(db: Dexie, table: string, row: Row): Promise<IntegrityIssue[]> {
  return checkRowReferences(table, row, await prefetchReferences(db, table, row));
}

/**
 * Guard for repositories: call before `add`/`put` of any record with references.
 * Throws `IntegrityError` and writes nothing if a reference is missing or inconsistent.
 */
export async function assertValidReferences(db: Dexie, table: string, row: Row): Promise<void> {
  const issues = await validateReferences(db, table, row);
  if (issues.length) throw new IntegrityError(issues);
}

// ─── Whole-database helpers ────────────────────────────────────────────────

/** Read every exportable table from a Dexie instance. */
export async function dumpTables(db: Dexie): Promise<Record<string, Row[]>> {
  const tables = db.tables.filter((t) => !NON_EXPORTED_TABLES.has(t.name));
  const out: Record<string, Row[]> = {};
  await db.transaction('r', tables, async () => {
    for (const t of tables) out[t.name] = (await t.toArray()) as Row[];
  });
  return out;
}

export async function checkDatabaseIntegrity(db: Dexie): Promise<IntegrityReport> {
  return checkIntegrity(await dumpTables(db));
}
