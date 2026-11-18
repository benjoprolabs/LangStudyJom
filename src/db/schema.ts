import type { Transaction } from 'dexie';

/**
 * Versioned IndexedDB schema.
 *
 * RULES FOR CHANGING THE SCHEMA
 *  1. Never edit an existing entry in SCHEMA_VERSIONS once it has shipped.
 *  2. Append a new entry with `version: N + 1` containing ONLY the tables whose
 *     indexes change (Dexie carries the rest forward). Use `null` to drop a table.
 *  3. If existing rows need transforming, add an `upgrade` function, and add the
 *     same transform to `BACKUP_MIGRATIONS` in `backup/migrations.ts` so older
 *     backup files can still be restored.
 *  4. Add a migration test in `src/db/__tests__/migrations.test.ts`.
 *
 * Index syntax: first entry is the primary key; `&` = unique, `*` = multi-entry,
 * `[a+b]` = compound index. Only indexed fields are listed — other fields are stored as-is.
 */
export interface SchemaVersion {
  version: number;
  description: string;
  stores: Record<string, string | null>;
  upgrade?: (tx: Transaction) => Promise<void> | void;
}

export const DB_NAME = 'qhaze-tech-university';

export const SCHEMA_VERSIONS: SchemaVersion[] = [
  {
    version: 1,
    description: 'Initial foundation: student, settings, full academic hierarchy, learning records, system tables.',
    stores: {
      // Student & system
      students: 'id, &studentNumber, createdAt',
      settings: 'id',
      meta: 'key',
      activityLog: 'id, timestamp, type',
      snapshots: 'id, createdAt, reason',
      snapshotPayloads: 'id',

      // University hierarchy
      faculties: 'id, &code, order, status',
      academies: 'id, &code, facultyId, order, status',
      programmes: 'id, &code, academyId, status',
      semesters: 'id, programmeId, &[programmeId+number]',
      courses: 'id, &code, programmeId, semesterId, difficulty, status',
      coursePrerequisites: 'id, courseId, prerequisiteCourseId, &[courseId+prerequisiteCourseId]',
      modules: 'id, courseId, [courseId+order]',
      lectures: 'id, moduleId, courseId, [moduleId+order]',
      learningMaterials: 'id, lectureId, kind',
      enrollments: 'id, studentId, programmeId, status, &[studentId+programmeId]',

      // Practice & assessment
      exercises: 'id, &code, academyId, courseId, lectureId, type, difficulty',
      exerciseAttempts: 'id, exerciseId, studentId, submittedAt, status',
      assessments: 'id, courseId, type, dueAt',
      gradingScales: 'id, name',
      grades: 'id, studentId, programmeId, semesterId, courseId, assessmentId',

      // Learning activity
      studySessions: 'id, studentId, startedAt, activityType, academyId, courseId, lectureId',
      progress: 'id, studentId, &[studentId+entityType+entityId], entityType, status',

      // Projects, notes, achievements
      projects: 'id, studentId, academyId, courseId, status',
      projectTasks: 'id, projectId, status',
      notes: 'id, studentId, entityType, entityId, kind, updatedAt, *tags',
      bookmarks: 'id, studentId, &[studentId+entityType+entityId]',
      achievements: 'id, studentId, &[studentId+code], earnedAt',
    },
  },
  {
    version: 2,
    description:
      'Reverse-reference indexes so a record can be checked for dependants before deletion (Phase 2 Step 0). ' +
      'Index-only change: no row is transformed.',
    stores: {
      enrollments: 'id, studentId, programmeId, status, &[studentId+programmeId], currentSemesterId',
      exerciseAttempts: 'id, exerciseId, studentId, submittedAt, status, assessmentId',
      assessments: 'id, courseId, type, dueAt, *exerciseIds',
      studySessions: 'id, studentId, startedAt, activityType, academyId, programmeId, semesterId, courseId, lectureId',
      progress: 'id, studentId, &[studentId+entityType+entityId], entityType, status, [entityType+entityId]',
      notes: 'id, studentId, entityType, entityId, kind, updatedAt, *tags, [entityType+entityId]',
      bookmarks: 'id, studentId, &[studentId+entityType+entityId], [entityType+entityId]',
    },
  },
  {
    version: 3,
    description: 'Click-to-Learn glossary (Professional Programming Education Standard, Part F). New table only.',
    stores: {
      glossaryTerms: 'id, &key, scope',
    },
  },
];

export const CURRENT_SCHEMA_VERSION = SCHEMA_VERSIONS[SCHEMA_VERSIONS.length - 1]!.version;

/** Tables that are never included in exported backups. */
export const NON_EXPORTED_TABLES = new Set(['snapshots', 'snapshotPayloads']);

/** Primary key field per table (all `id` except `meta`). */
export function primaryKeyOf(table: string): string {
  return table === 'meta' ? 'key' : 'id';
}

/** Resolve the full set of tables that exist at the latest schema version. */
export function tablesAtLatestVersion(): string[] {
  const tables = new Map<string, boolean>();
  for (const v of SCHEMA_VERSIONS) {
    for (const [name, def] of Object.entries(v.stores)) tables.set(name, def !== null);
  }
  return [...tables.entries()].filter(([, exists]) => exists).map(([name]) => name);
}
