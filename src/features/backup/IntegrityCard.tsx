import { useState } from 'react';
import { CheckCircle2, ScanSearch, TriangleAlert } from 'lucide-react';
import { db } from '@/db/client';
import { checkDatabaseIntegrity, type IntegrityReport } from '@/db/integrity';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';

export function IntegrityCard() {
  const { t, formatNumber } = useI18n();
  const [report, setReport] = useState<IntegrityReport>();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      setReport(await checkDatabaseIntegrity(db));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader title={t('backup.integrity.title')} description={t('backup.integrity.description')} icon={<ScanSearch className="h-4 w-4" />} />
      <Button variant="secondary" onClick={run} loading={busy}>
        {t('backup.integrity.run')}
      </Button>
      {report && (
        <div className="mt-4 text-sm" role="status">
          {report.ok ? (
            <p className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              {t('backup.integrity.ok', { count: formatNumber(report.checkedRecords) })}
            </p>
          ) : (
            <>
              <p className="mb-2 flex items-center gap-2 text-warning">
                <TriangleAlert className="h-4 w-4" aria-hidden />
                {t('backup.integrity.issues', { count: report.issues.length })}
              </p>
              <ul className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border bg-bg/50 p-2 font-mono text-xs">
                {report.issues.slice(0, 100).map((i, idx) => (
                  <li key={idx}>
                    {i.table}/{i.id}: {i.detail}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
