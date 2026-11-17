import {
  Archive,
  BarChart3,
  BookMarked,
  BookOpen,
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  Code2,
  DatabaseBackup,
  Dumbbell,
  FileCheck2,
  FolderKanban,
  GraduationCap,
  Landmark,
  Layers,
  LayoutDashboard,
  Presentation,
  Settings,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

export type NavGroup = 'overview' | 'university' | 'learning' | 'assessment' | 'work' | 'student' | 'system';

/** Keys of modules that have a "planned" description in the i18n dictionaries. */
export type PlannedModuleKey =
  | 'faculties'
  | 'academies'
  | 'programmes'
  | 'semesters'
  | 'library'
  | 'lectureRoom'
  | 'practice'
  | 'lab'
  | 'assignments'
  | 'examinations'
  | 'projects'
  | 'portfolio'
  | 'planner'
  | 'analytics'
  | 'notes';

export type NavKey = PlannedModuleKey | 'dashboard' | 'profile' | 'settings' | 'backup';

export interface NavItem {
  key: NavKey;
  path: string;
  icon: LucideIcon;
  group: NavGroup;
  /** Development phase in which this module becomes functional. */
  phase: number;
  /** Database tables already prepared for this module. */
  tables: string[];
}

/** Single source of truth for the sidebar and the router. */
export const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', path: '/', icon: LayoutDashboard, group: 'overview', phase: 1, tables: [] },
  { key: 'faculties', path: '/faculties', icon: Landmark, group: 'university', phase: 2, tables: ['faculties', 'academies'] },
  { key: 'academies', path: '/academies', icon: GraduationCap, group: 'university', phase: 2, tables: ['academies', 'enrollments'] },
  { key: 'programmes', path: '/programmes', icon: Layers, group: 'university', phase: 2, tables: ['programmes', 'enrollments'] },
  { key: 'semesters', path: '/semesters', icon: CalendarClock, group: 'university', phase: 2, tables: ['semesters', 'courses', 'coursePrerequisites'] },
  { key: 'library', path: '/library', icon: BookOpen, group: 'learning', phase: 3, tables: ['courses', 'modules', 'lectures', 'learningMaterials'] },
  { key: 'lectureRoom', path: '/lecture-room', icon: Presentation, group: 'learning', phase: 3, tables: ['lectures', 'progress'] },
  { key: 'practice', path: '/practice', icon: Dumbbell, group: 'learning', phase: 5, tables: ['exercises', 'exerciseAttempts'] },
  { key: 'lab', path: '/lab', icon: Code2, group: 'learning', phase: 6, tables: [] },
  { key: 'assignments', path: '/assignments', icon: ClipboardCheck, group: 'assessment', phase: 5, tables: ['assessments', 'exerciseAttempts'] },
  { key: 'examinations', path: '/examinations', icon: FileCheck2, group: 'assessment', phase: 5, tables: ['assessments', 'grades'] },
  { key: 'projects', path: '/projects', icon: FolderKanban, group: 'work', phase: 9, tables: ['projects', 'projectTasks'] },
  { key: 'portfolio', path: '/portfolio', icon: Briefcase, group: 'work', phase: 9, tables: ['projects'] },
  { key: 'planner', path: '/planner', icon: Archive, group: 'student', phase: 7, tables: ['studySessions'] },
  { key: 'analytics', path: '/analytics', icon: BarChart3, group: 'student', phase: 8, tables: ['grades', 'gradingScales', 'progress'] },
  { key: 'notes', path: '/notes', icon: BookMarked, group: 'student', phase: 3, tables: ['notes', 'bookmarks'] },
  { key: 'profile', path: '/profile', icon: UserRound, group: 'student', phase: 1, tables: [] },
  { key: 'settings', path: '/settings', icon: Settings, group: 'system', phase: 1, tables: [] },
  { key: 'backup', path: '/backup', icon: DatabaseBackup, group: 'system', phase: 1, tables: [] },
];

export const NAV_GROUPS: NavGroup[] = ['overview', 'university', 'learning', 'assessment', 'work', 'student', 'system'];

/** The phase currently being delivered. */
export const CURRENT_PHASE = 2;

/**
 * Pages that are functional. Everything else shows its honest "planned for Phase N" page
 * and a phase badge in the sidebar. `routes.tsx` must provide a component for each key.
 */
export const IMPLEMENTED_PAGES: ReadonlySet<NavKey> = new Set<NavKey>(['dashboard', 'faculties', 'academies', 'programmes', 'profile', 'settings', 'backup']);
