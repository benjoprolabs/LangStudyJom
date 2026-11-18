/**
 * Domain model for QHAZE TECH UNIVERSITY.
 *
 * All entities use stable string UUIDs (`id`) and ISO-8601 timestamps.
 * Academic content uses `LocalizedText` so every title/description can carry
 * a Bahasa Melayu (primary) and optional English version.
 *
 * The hierarchy is:
 *   Faculty → Academy → AcademicProgramme → Semester → Course → Module → Lecture → LearningMaterial
 *
 * Tables for later phases are declared from schema v1 so future features add
 * data, not restructure the database. Fields that are not indexed can evolve
 * freely; index changes go through a new schema version in `schema.ts`.
 */

export type ID = string;
export type ISODateString = string;

export type LanguageCode = 'ms' | 'en';
export const SUPPORTED_LANGUAGES: readonly LanguageCode[] = ['ms', 'en'] as const;

/** Bilingual text. `ms` is required (primary teaching language); `en` optional. */
export interface LocalizedText {
  ms: string;
  en?: string;
}

export interface BaseEntity {
  id: ID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type DifficultyLevel =
  | 'absolute_beginner'
  | 'beginner'
  | 'intermediate'
  | 'upper_intermediate'
  | 'advanced'
  | 'professional'
  | 'specialist';

export const DIFFICULTY_LEVELS: readonly DifficultyLevel[] = [
  'absolute_beginner',
  'beginner',
  'intermediate',
  'upper_intermediate',
  'advanced',
  'professional',
  'specialist',
] as const;

/** Records are archived, never hard-deleted silently. */
export type RecordStatus = 'draft' | 'active' | 'archived';

// ─── Student & settings ────────────────────────────────────────────────────

export interface Student extends BaseEntity {
  /** e.g. QTU-2026-4F9A2C — generated once, never changes. */
  studentNumber: string;
  fullName: string;
  preferredName: string;
  email?: string;
  bio?: string;
  /** Free-text learning goals. */
  goals?: string;
  timezone: string;
  enrolledAt: ISODateString;
}

export type ThemeMode = 'dark' | 'light' | 'system';

export interface UserSettings {
  /** Singleton row, always `'app'`. */
  id: 'app';
  language: LanguageCode;
  theme: ThemeMode;
  dailyStudyGoalMinutes: number;
  weeklyStudyGoalMinutes: number;
  /** How many automatic recovery snapshots to keep (manual ones are never pruned). */
  autoSnapshotRetention: number;
  /** Remind to export a backup after this many days. 0 disables. */
  backupReminderDays: number;
  updatedAt: ISODateString;
}

export interface MetaEntry {
  key: string;
  value: unknown;
}

// ─── University hierarchy ──────────────────────────────────────────────────

export interface Faculty extends BaseEntity {
  code: string; // e.g. "F01"
  name: LocalizedText;
  description: LocalizedText;
  order: number;
  status: RecordStatus;
  /** Lucide icon name. */
  icon?: string;
}

export interface Academy extends BaseEntity {
  facultyId: ID;
  code: string; // e.g. "F01-PY"
  name: LocalizedText;
  description: LocalizedText;
  order: number;
  status: RecordStatus;
  icon?: string;
}

export interface AcademicProgramme extends BaseEntity {
  academyId: ID;
  code: string;
  name: LocalizedText;
  description: LocalizedText;
  /** Each programme defines its own semester count — not forced to be uniform. */
  totalSemesters: number;
  entryLevel: DifficultyLevel;
  exitLevel: DifficultyLevel;
  completionRequirements: LocalizedText[];
  status: RecordStatus;
}

export interface Semester extends BaseEntity {
  programmeId: ID;
  number: number;
  title: LocalizedText;
  description: LocalizedText;
}

export interface Course extends BaseEntity {
  programmeId: ID;
  semesterId: ID;
  code: string; // e.g. "PY101"
  title: LocalizedText;
  description: LocalizedText;
  creditHours: number;
  difficulty: DifficultyLevel;
  learningObjectives: LocalizedText[];
  /** What the student can demonstrably do after the course (added in 0.3.0; absent on older rows). */
  learningOutcomes?: LocalizedText[];
  references: Reference[];
  status: RecordStatus;
}

export interface Reference {
  title: string;
  author?: string;
  url?: string;
  note?: LocalizedText;
}

export interface CoursePrerequisite extends BaseEntity {
  courseId: ID;
  prerequisiteCourseId: ID;
  kind: 'required' | 'recommended';
}

export interface Module extends BaseEntity {
  courseId: ID;
  order: number;
  title: LocalizedText;
  description: LocalizedText;
}

/**
 * The 28-section university lecture template (Professional Programming Education Standard,
 * Part A). Sections 1–4 are GENERATED from curriculum metadata by the reader (so they can never
 * disagree with the database); sections 5–28 are authored content, stored in `Lecture.sections`
 * in exactly this order.
 */
export const LECTURE_TEMPLATE = [
  'lecture_information',
  'course_information',
  'academic_level',
  'estimated_duration',
  'learning_objectives',
  'prerequisite_knowledge',
  'introduction',
  'fundamental_concepts',
  'detailed_theory',
  'technical_terminology',
  'syntax_rules',
  'code_demonstration',
  'complete_examples',
  'line_by_line',
  'why_this_way',
  'execution_flow',
  'memory_behaviour',
  'alternative_implementations',
  'common_mistakes',
  'debugging',
  'performance',
  'software_engineering',
  'industry_use_cases',
  'practical_demonstration',
  'mini_project',
  'summary',
  'knowledge_check',
  'references',
] as const;
export type LectureSectionKind = (typeof LECTURE_TEMPLATE)[number];
export const GENERATED_SECTIONS: readonly LectureSectionKind[] = ['lecture_information', 'course_information', 'academic_level', 'estimated_duration'];
export const AUTHORED_SECTIONS = LECTURE_TEMPLATE.filter((k) => !GENERATED_SECTIONS.includes(k));
/** Sections the standard requires only "where relevant / where appropriate". */
export const OPTIONAL_SECTIONS: readonly LectureSectionKind[] = ['memory_behaviour', 'mini_project'];

/**
 * Where a code example can run:
 *  - `lua54`  — standard Lua 5.4 (verified with the reference interpreter),
 *  - `luau`   — the Luau language VM outside Roblox (verified with the Luau VM),
 *  - `roblox` — uses Roblox engine APIs; runs only in Roblox Studio and is NEVER claimed as executed.
 */
export type CodeRuntime = 'lua54' | 'luau' | 'roblox';

/**
 * Inline text syntax inside LocalizedText: **bold**, `code`, [[glossary-key]] or
 * [[glossary-key|label]] (Click-to-Learn), and [label](https://…) for external links.
 */
export interface CodeDebug {
  code: string;
  error: string;
  explanation: LocalizedText;
}

export type ContentBlock =
  | { type: 'paragraph'; text: LocalizedText }
  | { type: 'list'; ordered?: boolean; items: LocalizedText[] }
  | { type: 'callout'; tone: 'key' | 'info' | 'warning'; title?: LocalizedText; text: LocalizedText }
  | {
      type: 'code';
      /** Unique within the lecture; referenced by `explain` blocks and source downloads. */
      id: string;
      language: 'lua' | 'luau';
      runtime: CodeRuntime;
      title: LocalizedText;
      /** Never translated: keywords, APIs and identifiers stay as written. */
      code: string;
      /** Exact expected stdout (required for lua54 / luau; describes Studio Output for roblox). */
      expectedOutput?: string;
      /** Standard input the example reads with io.read() (lua54 only). Fed by the verifier and the browser runner. */
      input?: string;
      /**
       * "Error and debugging explanation": a broken variant of this example, the exact error message
       * it produces (first line, as the interpreter prints it) and how to read and fix it. For lua54/luau
       * the verifier runs the variant and requires exactly this error; Roblox variants are only compiled.
       */
      debug?: CodeDebug;
    }
  | { type: 'explain'; codeId: string; items: { lines: string; text: LocalizedText }[] }
  | { type: 'terms'; keys: string[] }
  | { type: 'links'; items: { title: string; url: string; note?: LocalizedText }[] };

export interface LectureSection {
  kind: LectureSectionKind;
  blocks: ContentBlock[];
  /** Only for OPTIONAL_SECTIONS: why the section does not apply to this lecture. */
  notApplicable?: LocalizedText;
}

export interface Lecture extends BaseEntity {
  moduleId: ID;
  courseId: ID;
  order: number;
  title: LocalizedText;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  /** Authored sections 5–28 of LECTURE_TEMPLATE; empty until content is installed. */
  sections: LectureSection[];
  /** Version of the content package that wrote `sections`. */
  contentVersion?: string;
}

export type MaterialKind = 'markdown' | 'code' | 'diagram' | 'table' | 'link' | 'file';

export interface LearningMaterial extends BaseEntity {
  lectureId: ID;
  kind: MaterialKind;
  title: LocalizedText;
  /** Markdown, source code, Mermaid/SVG diagram, or URL depending on `kind`. */
  content: string;
  /** Programming language for `code` materials (never translated). */
  codeLanguage?: string;
  fileName?: string;
}

export interface Enrollment extends BaseEntity {
  studentId: ID;
  programmeId: ID;
  status: 'active' | 'paused' | 'completed' | 'withdrawn';
  startedAt: ISODateString;
  currentSemesterId?: ID;
  completedAt?: ISODateString;
}

// ─── Practice & assessment (Phase 5+) ──────────────────────────────────────
//
// Approved model (Phase 1.1) — four logically separate record types:
//
//   Exercise         one practical learning activity / question. Stored ONCE.
//   Assessment       a graded container: quiz | assignment | examination | practical_test | project.
//                    It REFERENCES exercises via `exerciseIds` (never copies them), so one
//                    exercise can appear in practice and in several assessments without duplication.
//   ExerciseAttempt  the student's SUBMISSION for one exercise; `assessmentId` is set when the
//                    attempt was made inside an assessment, absent for free practice.
//   AcademicGrade    the graded result for an assessment and/or course.
//
// Quiz, assignment and examination are assessment types — not exercise types.

/** Kinds of individual practical activity. (Quiz/assignment/examination are AssessmentTypes.) */
export type ExerciseType =
  | 'basic'
  | 'intermediate'
  | 'advanced'
  | 'coding_challenge'
  | 'code_completion'
  | 'debugging'
  | 'problem_solving'
  | 'multiple_choice'
  | 'mini_project'
  | 'final_project';

export interface Exercise extends BaseEntity {
  code: string;
  academyId: ID;
  courseId?: ID;
  lectureId?: ID;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  title: LocalizedText;
  instructions: LocalizedText;
  learningObjective: LocalizedText;
  starterCode?: string;
  codeLanguage?: string;
  expectedOutput?: string;
  hints: LocalizedText[];
  assessmentCriteria: LocalizedText[];
  maxScore: number;
  /** Hidden until after the student submits. */
  solutionExplanation?: LocalizedText;
}

/** A submission: one student attempt at one exercise. */
export interface ExerciseAttempt extends BaseEntity {
  exerciseId: ID;
  studentId: ID;
  /** Set when submitted as part of an assessment (quiz, assignment, examination…). */
  assessmentId?: ID;
  submission: string;
  submittedAt: ISODateString;
  status: 'in_progress' | 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  hintsUsed: number;
}

export type AssessmentType = 'quiz' | 'assignment' | 'examination' | 'practical_test' | 'project';

export interface Assessment extends BaseEntity {
  courseId: ID;
  type: AssessmentType;
  title: LocalizedText;
  /** Weight in the course grade, 0–100. */
  weight: number;
  dueAt?: ISODateString;
  /** Ordered references to existing exercises (questions / tasks). Never duplicated copies. */
  exerciseIds: ID[];
}

export interface GradeBand {
  letter: string;
  minPercent: number;
  gradePoint: number;
}

export interface GradingScale extends BaseEntity {
  name: string;
  bands: GradeBand[];
}

export interface AcademicGrade extends BaseEntity {
  studentId: ID;
  programmeId: ID;
  semesterId: ID;
  courseId: ID;
  assessmentId?: ID;
  percent: number;
  letter?: string;
  gradePoint?: number;
  finalisedAt?: ISODateString;
}

// ─── Learning activity (Phase 3, 7) ────────────────────────────────────────

export type ActivityType = 'lecture' | 'practice' | 'coding_lab' | 'assessment' | 'project' | 'revision' | 'other';

export interface StudySession extends BaseEntity {
  studentId: ID;
  startedAt: ISODateString;
  endedAt: ISODateString;
  durationMinutes: number;
  activityType: ActivityType;
  academyId?: ID;
  programmeId?: ID;
  semesterId?: ID;
  courseId?: ID;
  lectureId?: ID;
  completed: boolean;
  notes?: string;
  source: 'timer' | 'manual';
}

export type ProgressEntityType = 'programme' | 'semester' | 'course' | 'module' | 'lecture';

export interface StudentProgress extends BaseEntity {
  studentId: ID;
  entityType: ProgressEntityType;
  entityId: ID;
  /** Opening a lecture does NOT complete it — completion is an explicit action. */
  status: 'not_started' | 'in_progress' | 'completed';
  percent: number;
  /** Last reading position (0–1 of the page) so the reader can resume where the student stopped. */
  position?: number;
  lastAccessedAt?: ISODateString;
  completedAt?: ISODateString;
}

// ─── Projects, notes, achievements (Phase 3, 9) ────────────────────────────

export interface Project extends BaseEntity {
  studentId: ID;
  title: string;
  description: string;
  academyId?: ID;
  courseId?: ID;
  objectives: string[];
  technologies: string[];
  milestones: { id: ID; title: string; dueAt?: ISODateString; done: boolean }[];
  sourceLinks: string[];
  documentation?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'archived';
  inPortfolio: boolean;
  evaluation?: string;
}

export interface ProjectTask extends BaseEntity {
  projectId: ID;
  milestoneId?: ID;
  title: string;
  status: 'todo' | 'doing' | 'done';
  order: number;
}

export type NoteTarget = 'academy' | 'course' | 'lecture' | 'general';

export interface Note extends BaseEntity {
  studentId: ID;
  entityType: NoteTarget;
  entityId?: ID;
  kind: 'note' | 'lecture_note' | 'snippet' | 'concept' | 'revision';
  title: string;
  body: string;
  tags: string[];
}

export interface Bookmark extends BaseEntity {
  studentId: ID;
  entityType: 'lecture' | 'course' | 'material' | 'exercise' | 'glossary';
  entityId: ID;
  label?: string;
}

/** Which pathway a glossary concept belongs to (keeps Lua and Roblox concepts apart). */
export type GlossaryScope = 'general' | 'lua' | 'luau' | 'roblox';

/** Click-to-Learn glossary entry (Part F). */
export interface GlossaryTerm extends BaseEntity {
  /** Stable key used in content links: [[closure]]. */
  key: string;
  /** English technical term — never translated. */
  term: string;
  /** Bahasa Melayu rendering of the term. */
  translation: string;
  scope: GlossaryScope;
  definition: LocalizedText;
  explanation: LocalizedText;
  example?: { language: 'lua' | 'luau'; runtime: CodeRuntime; code: string; expectedOutput?: string };
  /** Keys of related glossary terms. */
  related: string[];
  /** Related lectures, by curriculum position (resolved at display time). */
  lectures: { courseCode: string; module: number; lecture: number }[];
  references: { title: string; url: string }[];
  version: string;
}

export interface Achievement extends BaseEntity {
  studentId: ID;
  code: string;
  earnedAt: ISODateString;
}

// ─── System ────────────────────────────────────────────────────────────────

export type ActivityLogType =
  | 'profile.created'
  | 'profile.updated'
  | 'settings.updated'
  | 'backup.exported'
  | 'backup.restored'
  | 'snapshot.created'
  | 'snapshot.deleted'
  | 'database.migrated'
  | 'curriculum.created'
  | 'curriculum.updated'
  | 'curriculum.archived'
  | 'curriculum.restored'
  | 'curriculum.deleted'
  | 'curriculum.installed';

export interface ActivityLogEntry {
  id: ID;
  timestamp: ISODateString;
  type: ActivityLogType;
  details?: Record<string, string | number | boolean>;
}

export type SnapshotReason = 'manual' | 'pre-restore' | 'pre-migration' | 'pre-seed';

/** Internal recovery snapshot stored inside IndexedDB (not included in exports). */
export interface Snapshot {
  id: ID;
  createdAt: ISODateString;
  reason: SnapshotReason;
  schemaVersion: number;
  appVersion: string;
  sizeBytes: number;
  recordCount: number;
}

/** Snapshot body, stored separately so listing snapshots stays cheap. Same `id` as its Snapshot. */
export interface SnapshotPayload {
  id: ID;
  /** Serialised BackupFile JSON. */
  payload: string;
}
