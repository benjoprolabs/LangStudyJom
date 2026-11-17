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

/** The 20 sections of the university lecture template (Part 6). */
export type LectureSectionKind =
  | 'lecture_information'
  | 'course_information'
  | 'learning_objectives'
  | 'prerequisite_knowledge'
  | 'introduction'
  | 'fundamental_concepts'
  | 'detailed_theory'
  | 'technical_terminology'
  | 'syntax_explanation'
  | 'code_demonstration'
  | 'line_by_line_breakdown'
  | 'why_written_this_way'
  | 'why_necessary'
  | 'alternative_approaches'
  | 'common_mistakes'
  | 'debugging_explanation'
  | 'real_world_applications'
  | 'industry_examples'
  | 'summary'
  | 'references';

export interface LectureSection {
  kind: LectureSectionKind;
  /** Markdown body per language. */
  body: LocalizedText;
}

export interface Lecture extends BaseEntity {
  moduleId: ID;
  courseId: ID;
  order: number;
  title: LocalizedText;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  sections: LectureSection[];
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
  entityType: 'lecture' | 'course' | 'material' | 'exercise';
  entityId: ID;
  label?: string;
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
  | 'curriculum.deleted';

export interface ActivityLogEntry {
  id: ID;
  timestamp: ISODateString;
  type: ActivityLogType;
  details?: Record<string, string | number | boolean>;
}

export type SnapshotReason = 'manual' | 'pre-restore' | 'pre-migration';

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
