import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { BackupPage } from '@/features/backup/BackupPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { PlannedModulePage } from '@/features/planned/PlannedModulePage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { IMPLEMENTED_PAGES, NAV_ITEMS, type NavItem, type NavKey, type PlannedModuleKey } from './navigation';
import { AcademiesPage } from '@/features/university/AcademiesPage';
import { FacultiesPage } from '@/features/university/FacultiesPage';
import { ProgrammesPage } from '@/features/university/ProgrammesPage';
import { SemestersPage } from '@/features/university/SemestersPage';
import { LectureRoomPage } from '@/features/learning/LectureRoomPage';
import { LibraryPage } from '@/features/learning/LibraryPage';
import { ModulePage } from '@/features/learning/ModulePage';
import { PrintPage } from '@/features/learning/PrintPage';
import { NotFound } from './NotFound';

/** Components for the pages listed in IMPLEMENTED_PAGES. Others render their "planned" page. */
const IMPLEMENTED: Partial<Record<NavKey, ComponentType>> = {
  dashboard: DashboardPage,
  faculties: FacultiesPage,
  academies: AcademiesPage,
  programmes: ProgrammesPage,
  semesters: SemestersPage,
  library: LibraryPage,
  lectureRoom: LectureRoomPage,
  profile: ProfilePage,
  settings: SettingsPage,
  backup: BackupPage,
};

export const routes: RouteObject[] = [
  // Print / PDF documents render without the app shell.
  { path: '/print', element: <PrintPage /> },
  {
    element: <AppShell />,
    children: [
      ...NAV_ITEMS.map((item): RouteObject => {
        const Page = IMPLEMENTED_PAGES.has(item.key) ? IMPLEMENTED[item.key] : undefined;
        return {
          path: item.path,
          element: Page ? <Page /> : <PlannedModulePage item={item as NavItem & { key: PlannedModuleKey }} />,
        };
      }),
      // Module Learning Page (reached from the Library, the Lecture Room and the course outline; not a menu item).
      { path: '/module', element: <ModulePage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

// Fail fast in development if the two lists drift apart.
for (const key of IMPLEMENTED_PAGES) {
  if (!IMPLEMENTED[key]) throw new Error(`routes: no component for implemented page "${key}"`);
}
