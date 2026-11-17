import { useEffect, useMemo, useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { DatabaseZap, Download, GraduationCap, RefreshCw } from 'lucide-react';
import { bootstrapDatabase, type BootstrapResult } from '@/db/bootstrap';
import { db } from '@/db/client';
import { useStudent } from '@/hooks/useStudent';
import { I18nProvider, PreBootI18nProvider, useI18n } from '@/i18n/I18nProvider';
import { downloadText } from '@/lib/download';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ToastProvider } from '@/components/ui/Toast';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { routes } from './routes';
import { ThemeProvider } from './ThemeProvider';

/** Root: open the database first, then render the university (or first-run enrolment). */
export function App() {
  const [boot, setBoot] = useState<BootstrapResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    void bootstrapDatabase(db).then((r) => !cancelled && setBoot(r));
    return () => {
      cancelled = true;
    };
  }, []);

  // Before the database is open, nothing may query it (see db/client.ts).
  if (!boot) {
    return (
      <PreBootI18nProvider>
        <Splash />
      </PreBootI18nProvider>
    );
  }
  if (boot.status === 'error') {
    return (
      <PreBootI18nProvider>
        <BootError result={boot} />
      </PreBootI18nProvider>
    );
  }
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <University />
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

function University() {
  const student = useStudent();
  const router = useMemo(() => createHashRouter(routes), []);
  if (student === undefined) return <Splash />;
  if (student === null) return <OnboardingPage />;
  return <RouterProvider router={router} />;
}

function Splash() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4" role="status">
      <div className="animate-pulse rounded-2xl bg-gradient-to-br from-primary to-accent p-3 text-white shadow-glow">
        <GraduationCap className="h-8 w-8" aria-hidden />
      </div>
      <p className="text-sm text-muted">{t('bootstrap.loading')}</p>
    </div>
  );
}

function BootError({ result }: { result: Extract<BootstrapResult, { status: 'error' }> }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl items-center px-4">
      <Card className="w-full space-y-4 p-6" role="alert">
        <div className="flex items-center gap-3">
          <DatabaseZap className="h-6 w-6 text-danger" aria-hidden />
          <h1 className="text-lg font-semibold">{t('bootstrap.errorTitle')}</h1>
        </div>
        <p className="text-sm text-muted">{t(`bootstrap.${result.code}`)}</p>
        <div className="flex flex-wrap gap-2">
          {result.rescueBackup && (
            <Button icon={<Download className="h-4 w-4" />} onClick={() => downloadText('qhaze-emergency-backup.json', result.rescueBackup!)}>
              {t('bootstrap.downloadRescue')}
            </Button>
          )}
          <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={() => window.location.reload()}>
            {t('bootstrap.reload')}
          </Button>
        </div>
        <details className="text-xs text-muted">
          <summary className="cursor-pointer">{t('bootstrap.technical')}</summary>
          <pre className="mt-2 whitespace-pre-wrap break-all font-mono">{result.message}</pre>
        </details>
      </Card>
    </div>
  );
}
