import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Languages, Menu, Moon, Sun } from 'lucide-react';
import { db } from '@/db/client';
import { updateSettings } from '@/db/repositories/settings';
import { useSettings } from '@/hooks/useSettings';
import { useStudent } from '@/hooks/useStudent';
import { useI18n } from '@/i18n/I18nProvider';
import { useToast } from '@/components/ui/Toast';
import { Sidebar } from './Sidebar';

export function AppShell() {
  const { t, lang } = useI18n();
  const toast = useToast();
  const settings = useSettings();
  const student = useStudent();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the mobile drawer on navigation and move focus to the main content.
  useEffect(() => {
    setDrawerOpen(false);
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const theme = settings?.theme ?? 'dark';
  const isDark = theme === 'dark' || (theme === 'system' && (window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true));

  const patch = (p: Parameters<typeof updateSettings>[1]) =>
    updateSettings(db, p).catch(() => toast.error(t('common.saveFailed')));

  return (
    <div className="min-h-dvh lg:pl-64">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2">
        {t('common.skipToContent')}
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-surface/70 backdrop-blur lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-border bg-surface">
            <Sidebar onNavigate={() => setDrawerOpen(false)} onClose={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-bg/80 px-4 backdrop-blur sm:px-6">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-fg lg:hidden"
          aria-label={t('common.openMenu')}
          aria-expanded={drawerOpen}
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="truncate text-sm font-semibold lg:hidden">{t('app.shortName')}</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => patch({ language: lang === 'ms' ? 'en' : 'ms' })}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm text-muted hover:bg-surface-2 hover:text-fg"
            aria-label={t('language.toggle')}
            title={t('language.toggle')}
          >
            <Languages className="h-4 w-4" aria-hidden />
            <span className="font-medium uppercase">{lang}</span>
          </button>
          <button
            type="button"
            onClick={() => patch({ theme: isDark ? 'light' : 'dark' })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
            aria-label={t('theme.toggle')}
            title={t('theme.toggle')}
            disabled={!settings}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {student && (
            <Link
              to="/profile"
              className="ml-1 inline-flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm hover:bg-surface-2"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                {student.preferredName.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden max-w-[10rem] truncate sm:inline">{student.preferredName}</span>
            </Link>
          )}
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-6 outline-none sm:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
