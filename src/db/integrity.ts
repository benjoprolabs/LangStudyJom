import type Dexie from 'dexie';
import { NON_EXPORTED_TABLES, primaryKeyOf } from './schema';

/**
 * Referential integrity rules: `table.field` must reference an existing row in `target`.
 * Optional references are only checked when the field is set.
 */
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
  { table: 'assessments', field: 'courseId', target: 'courses' },
  { table: 'grades', field: 'studentId', target: 'students' },
  { table: 'grades', field: 'programmeId', target: 'programmes' },
  { table: 'grades', field: 'semesterId', target: 'semesters' },
  { table: 'grades', field: 'courseId', target: 'courses' },
  { table: 'grades', field: 'assessmentId', target: 'assessments', optional: true },
  { table: 'studySessions', field: 'studentId', target: 'students' },
  { table: 'studySessions', field: 'courseId', target: 'courses', optional: true },
  { table: 'studySessions', field: 'lectureId', target: 'lectures', optional: true },
  { table: 'progress', field: 'studentId', target: 'students' },
  { table: 'projects', field: 'studentId', target: 'students' },
  { table: 'projectTasks', field: 'projectId', target: 'projects' },
  { table: 'notes', field: 'studentId', target: 'students' },
  { table: 'bookmarks', field: 'studentId', target: 'students' },
  { table: 'achievements', field: 'studentId', target: 'students' },
];

export interface IntegrityIssue {
  table: string;
  id: string;
  kind: 'missing_reference' | 'duplicate_id' | 'missing_id' | 'self_prerequisite';
  detail: string;
}

export interface IntegrityReport {
  ok: boolean;
  checkedRecords: number;
  issues: IntegrityIssue[];
}

type Row = Record<string, unknown>;

/** Pure integrity check over a table → rows map (used for live DB and incoming backups). */
export function checkIntegrity(data: Record<string, Row[]>): IntegrityReport {
  const issues: IntegrityIssue[] = [];
  const idSets = new Map<string, Set<string>>();
  let checkedRecords = 0;

  for (const [table, rows] of Object.entries(data)) {
    const pk = primaryKeyOf(table);
    const ids = new Set<string>();
    for (const row of rows) {
      checkedRecords++;
      const id = row[pk];
      if (typeof id !== 'string' || id.length === 0) {
        issues.push({ table, id: String(id), kind: 'missing_id', detail: `Missing ${pk}` });
        continue;
      }
      if (ids.has(id)) issues.push({ table, id, kind: 'duplicate_id', detail: `Duplicate ${pk}` });
      ids.add(id);
    }
    idSets.set(table, ids);
  }

  for (const rel of RELATIONS) {
    const rows = data[rel.table];
    if (!rows) continue;
    const targetIds = idSets.get(rel.target) ?? new Set<string>();
    for (const row of rows) {
      const ref = row[rel.field];
      if (ref === undefined || ref === null || ref === '') {
        if (!rel.optional) {
          issues.push({
            table: rel.table,
            id: String(row.id),
            kind: 'missing_reference',
            detail: `${rel.field} is empty (required → ${rel.target})`,
          });
        }
        continue;
      }
      if (!targetIds.has(String(ref))) {
        issues.push({
          table: rel.table,
          id: String(row.id),
          kind: 'missing_reference',
          detail: `${rel.field}=${String(ref)} not found in ${rel.target}`,
        });
      }
    }
  }

  for (const row of data.coursePrerequisites ?? []) {
    if (row.courseId && row.courseId === row.prerequisiteCourseId) {
      issues.push({
        table: 'coursePrerequisites',
        id: String(row.id),
        kind: 'self_prerequisite',
        detail: 'A course cannot be its own prerequisite',
      });
    }
  }

  return { ok: issues.length === 0, checkedRecords, issues };
}

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
