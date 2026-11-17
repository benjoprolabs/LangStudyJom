import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { BackupPage } from '@/features/backup/BackupPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { PlannedModulePage } from '@/features/planned/PlannedModulePage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { NAV_ITEMS, type NavItem, type NavKey, type PlannedModuleKey } from './navigation';
import { NotFound } from './NotFound';

/** Implemented pages. Any nav item not listed here renders its "planned" page. */
const IMPLEMENTED: Partial<Record<NavKey, ComponentType>> = {
  dashboard: DashboardPage,
  profile: ProfilePage,
  settings: SettingsPage,
  backup: BackupPage,
};

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      ...NAV_ITEMS.map((item): RouteObject => {
        const Page = IMPLEMENTED[item.key];
        return {
          path: item.path,
          element: Page ? <Page /> : <PlannedModulePage item={item as NavItem & { key: PlannedModuleKey }} />,
        };
      }),
      { path: '*', element: <NotFound /> },
    ],
  },
];
