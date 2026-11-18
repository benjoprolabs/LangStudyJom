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
 *     Array references (`ARRAY_RELATIONS`) and polymorphic references (`POLYMORPHIC_RELATIONS`,
 *     where `entityType` selects the target table) follow the same rule.
 *  2. Relationship consistency (`CHAIN_CONSISTENCY`): when a record carries several
 *     references along the curriculum chain (lecture → course → semester → programme →
 *     academy), they must describe the SAME path. E.g. a study session cannot point at a
 *     course in semester 1 while also pointing at semester 2.
 *  3. Record rules (`checkRecordRules`): curriculum structure (course ↔ semester ↔ programme,
 *     lecture ↔ module ↔ course, semester number range) and assessment membership of submissions.
 *  4. Graph rules: circular course prerequisites (`findPrerequisiteCycles`).
 *
 * Rule catalogue and history: docs/INTEGRITY.md.
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

/** A field holding a list of IDs; every ID must exist and appear only once. */
interface ArrayRelation {
  table: string;
  field: string;
  target: string;
}

export const ARRAY_RELATIONS: ArrayRelation[] = [
  // Item 4: an assessment (quiz, assignment, examination…) references exercises — never copies them.
  { table: 'assessments', field: 'exerciseIds', target: 'exercises' },
];

/**
 * `typeField` selects which table `idField` points to. A `null` target means the type
 * must NOT carry a reference (e.g. a general note).
 */
interface PolymorphicRelation {
  table: string;
  typeField: string;
  idField: string;
  targets: Record<string, string | null>;
}

export const POLYMORPHIC_RELATIONS: PolymorphicRelation[] = [
  // Item 5
  {
    table: 'progress',
    typeField: 'entityType',
    idField: 'entityId',
    targets: { programme: 'programmes', semester: 'semesters', course: 'courses', module: 'modules', lecture: 'lectures' },
  },
  // Item 6
  {
    table: 'notes',
    typeField: 'entityType',
    idField: 'entityId',
    targets: { academy: 'academies', course: 'courses', lecture: 'lectures', general: null },
  },
  {
    table: 'bookmarks',
    typeField: 'entityType',
    idField: 'entityId',
    targets: { lecture: 'lectures', course: 'courses', material: 'learningMaterials', exercise: 'exercises', glossary: 'glossaryTerms' },
  },
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
  | 'duplicate_reference'
  | 'invalid_reference_type'
  | 'out_of_range'
  | 'duplicate_id'
  | 'missing_id'
  | 'self_prerequisite'
  | 'circular_prerequisite';

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

  for (const rel of ARRAY_RELATIONS) {
    if (rel.table !== table) continue;
    const refs = row[rel.field];
    if (refs === undefined || refs === null) continue;
    if (!Array.isArray(refs)) {
      issues.push({ table, id, kind: 'missing_reference', detail: `${rel.field} must be a list of ${rel.target} IDs` });
      continue;
    }
    const seen = new Set<string>();
    for (const ref of refs) {
      const refId = String(ref);
      if (seen.has(refId)) {
        issues.push({ table, id, kind: 'duplicate_reference', detail: `${rel.field} lists ${refId} more than once` });
        continue;
      }
      seen.add(refId);
      if (!lookup(rel.target, refId)) {
        issues.push({ table, id, kind: 'missing_reference', detail: `${rel.field} contains ${refId}, not found in ${rel.target}` });
      }
    }
  }

  for (const rel of POLYMORPHIC_RELATIONS) {
    if (rel.table !== table) continue;
    const type = row[rel.typeField];
    const ref = row[rel.idField];
    if (typeof type !== 'string' || !(type in rel.targets)) {
      issues.push({
        table,
        id,
        kind: 'invalid_reference_type',
        detail: `${rel.typeField}=${String(type)} is not one of ${Object.keys(rel.targets).join(', ')}`,
      });
      continue;
    }
    const target = rel.targets[type] as string | null; // `type in targets` checked above
    if (target === null) {
      if (isSet(ref)) {
        issues.push({ table, id, kind: 'inconsistent_reference', detail: `${rel.idField} must be empty when ${rel.typeField}=${type}` });
      }
      continue;
    }
    if (!isSet(ref)) {
      issues.push({ table, id, kind: 'missing_reference', detail: `${rel.idField} is empty (required → ${target} for ${rel.typeField}=${type})` });
    } else if (!lookup(target, String(ref))) {
      issues.push({ table, id, kind: 'missing_reference', detail: `${rel.idField}=${String(ref)} not found in ${target} (${rel.typeField}=${type})` });
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

  issues.push(...checkRecordRules(table, id, row, lookup));
  return issues;
}

/** Structural rules that compare a record with the records it references. */
function checkRecordRules(table: string, id: string, row: Row, lookup: Lookup): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const push = (kind: IntegrityIssueKind, detail: string) => issues.push({ table, id, kind, detail });

  switch (table) {
    case 'coursePrerequisites':
      if (isSet(row.courseId) && row.courseId === row.prerequisiteCourseId) {
        push('self_prerequisite', 'A course cannot be its own prerequisite');
      }
      break;

    // Item 7: a course's semester must belong to the course's programme.
    case 'courses': {
      const semester = isSet(row.semesterId) ? lookup('semesters', String(row.semesterId)) : undefined;
      if (semester && isSet(row.programmeId) && semester.programmeId !== row.programmeId) {
        push(
          'inconsistent_reference',
          `semesterId=${String(row.semesterId)} belongs to programmeId=${String(semester.programmeId)}, not the course's programmeId=${String(row.programmeId)}`,
        );
      }
      break;
    }

    // Item 8: a lecture's module must belong to the lecture's course.
    case 'lectures': {
      const module = isSet(row.moduleId) ? lookup('modules', String(row.moduleId)) : undefined;
      if (module && isSet(row.courseId) && module.courseId !== row.courseId) {
        push(
          'inconsistent_reference',
          `moduleId=${String(row.moduleId)} belongs to courseId=${String(module.courseId)}, not the lecture's courseId=${String(row.courseId)}`,
        );
      }
      break;
    }

    // Item 10: semester number must be a whole number within the programme's semester count.
    case 'semesters': {
      const n = row.number;
      if (typeof n !== 'number' || !Number.isInteger(n) || n < 1) {
        push('out_of_range', `number=${String(n)} must be a whole number ≥ 1`);
        break;
      }
      const programme = isSet(row.programmeId) ? lookup('programmes', String(row.programmeId)) : undefined;
      const total = programme?.totalSemesters;
      if (typeof total === 'number' && n > total) {
        push('out_of_range', `number=${n} exceeds programme ${String(row.programmeId)} totalSemesters=${total}`);
      }
      break;
    }

    // Item 4 (submissions): an attempt made inside an assessment must be for one of its exercises.
    case 'exerciseAttempts': {
      const assessment = isSet(row.assessmentId) ? lookup('assessments', String(row.assessmentId)) : undefined;
      const members = assessment?.exerciseIds;
      if (assessment && Array.isArray(members) && isSet(row.exerciseId) && !members.map(String).includes(String(row.exerciseId))) {
        push(
          'inconsistent_reference',
          `exerciseId=${String(row.exerciseId)} is not part of assessmentId=${String(row.assessmentId)}`,
        );
      }
      break;
    }
  }
  return issues;
}

/**
 * Item 9: find circular prerequisite chains (A → B → … → A). Self-loops are reported
 * separately as `self_prerequisite`. Each distinct cycle is reported once, on one of its edges.
 */
export function findPrerequisiteCycles(edges: Row[]): IntegrityIssue[] {
  const graph = new Map<string, { to: string; edgeId: string }[]>();
  for (const e of edges) {
    if (!isSet(e.courseId) || !isSet(e.prerequisiteCourseId) || e.courseId === e.prerequisiteCourseId) continue;
    const from = String(e.courseId);
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from)!.push({ to: String(e.prerequisiteCourseId), edgeId: String(e.id) });
  }

  const issues: IntegrityIssue[] = [];
  const reported = new Set<string>();
  const state = new Map<string, 'visiting' | 'done'>();
  const path: string[] = [];

  const visit = (node: string) => {
    state.set(node, 'visiting');
    path.push(node);
    for (const { to, edgeId } of graph.get(node) ?? []) {
      if (state.get(to) === 'visiting') {
        const cycle = [...path.slice(path.indexOf(to)), to];
        const signature = [...new Set(cycle)].sort().join('|');
        if (!reported.has(signature)) {
          reported.add(signature);
          issues.push({
            table: 'coursePrerequisites',
            id: edgeId,
            kind: 'circular_prerequisite',
            detail: `Circular prerequisites: ${cycle.join(' → ')}`,
          });
        }
      } else if (!state.has(to)) {
        visit(to);
      }
    }
    path.pop();
    state.set(node, 'done');
  };

  for (const node of [...graph.keys()].sort()) if (!state.has(node)) visit(node);
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
  issues.push(...findPrerequisiteCycles(data.coursePrerequisites ?? []));

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
    const refs: [string, unknown][] = (PARENT_FIELDS[t] ?? []).map(([field, target]) => [target, r[field]]);
    for (const rel of ARRAY_RELATIONS) {
      if (rel.table === t && Array.isArray(r[rel.field])) for (const v of r[rel.field] as unknown[]) refs.push([rel.target, v]);
    }
    for (const rel of POLYMORPHIC_RELATIONS) {
      const target = rel.table === t ? rel.targets[String(r[rel.typeField])] : undefined;
      if (target) refs.push([target, r[rel.idField]]);
    }
    for (const [target, ref] of refs) {
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
  const issues = checkRowReferences(table, row, await prefetchReferences(db, table, row));
  if (table === 'coursePrerequisites') {
    // Would this edge close a cycle? Check the whole graph with the edge added (or replaced).
    const edges = ((await db.table('coursePrerequisites').toArray()) as Row[]).filter((e) => e.id !== row.id);
    const cycles = findPrerequisiteCycles([...edges, row]);
    // Only cycles that run through this edge are caused by this write.
    const from = String(row.courseId);
    const to = String(row.prerequisiteCourseId);
    issues.push(...cycles.filter((c) => c.detail.includes(`${from} → ${to}`)).map((c) => ({ ...c, id: String(row.id) })));
  }
  return issues;
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
