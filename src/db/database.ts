import Dexie, { type Table } from 'dexie';
import { DB_NAME, SCHEMA_VERSIONS } from './schema';
import type {
  AcademicGrade,
  AcademicProgramme,
  Academy,
  Achievement,
  ActivityLogEntry,
  Assessment,
  Bookmark,
  Course,
  CoursePrerequisite,
  Enrollment,
  Exercise,
  ExerciseAttempt,
  Faculty,
  GradingScale,
  LearningMaterial,
  Lecture,
  MetaEntry,
  Module,
  Note,
  Project,
  ProjectTask,
  Semester,
  Snapshot,
  SnapshotPayload,
  Student,
  StudentProgress,
  StudySession,
  UserSettings,
} from './types';

export class QhazeDatabase extends Dexie {
  students!: Table<Student, string>;
  settings!: Table<UserSettings, string>;
  meta!: Table<MetaEntry, string>;
  activityLog!: Table<ActivityLogEntry, string>;
  snapshots!: Table<Snapshot, string>;
  snapshotPayloads!: Table<SnapshotPayload, string>;

  faculties!: Table<Faculty, string>;
  academies!: Table<Academy, string>;
  programmes!: Table<AcademicProgramme, string>;
  semesters!: Table<Semester, string>;
  courses!: Table<Course, string>;
  coursePrerequisites!: Table<CoursePrerequisite, string>;
  modules!: Table<Module, string>;
  lectures!: Table<Lecture, string>;
  learningMaterials!: Table<LearningMaterial, string>;
  enrollments!: Table<Enrollment, string>;

  exercises!: Table<Exercise, string>;
  exerciseAttempts!: Table<ExerciseAttempt, string>;
  assessments!: Table<Assessment, string>;
  gradingScales!: Table<GradingScale, string>;
  grades!: Table<AcademicGrade, string>;

  studySessions!: Table<StudySession, string>;
  progress!: Table<StudentProgress, string>;

  projects!: Table<Project, string>;
  projectTasks!: Table<ProjectTask, string>;
  notes!: Table<Note, string>;
  bookmarks!: Table<Bookmark, string>;
  achievements!: Table<Achievement, string>;

  constructor(name: string = DB_NAME) {
    super(name);
    for (const v of SCHEMA_VERSIONS) {
      const version = this.version(v.version).stores(v.stores);
      if (v.upgrade) version.upgrade(v.upgrade);
    }
  }
}
