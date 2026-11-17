import { useRef, useState, type ChangeEvent } from 'react';
import { AlertTriangle, FileUp, ShieldCheck, Upload, XCircle } from 'lucide-react';
import { db } from '@/db/client';
import { restoreBackup, validateBackup, type RestoreMode, type ValidationResult } from '@/db/backup/backup';
import type { MessageKey } from '@/i18n/translate';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

export function RestoreCard() {
  const { t, formatDate, formatNumber } = useI18n();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>();
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult>();
  const [mode, setMode] = useState<RestoreMode>('replace');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setResult(undefined);
    setFileName(undefined);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setValidating(true);
    try {
      setResult(await validateBackup(await file.text()));
    } finally {
      setValidating(false);
    }
  };

  const onRestore = async () => {
    if (!result?.backup) return;
    setBusy(true);
    try {
      const r = await restoreBackup(db, result.backup, mode);
      toast.success(t('backup.restore.done', { written: r.written, skipped: r.skipped }));
      setConfirmOpen(false);
      reset();
    } catch {
      toast.error(t('backup.restore.failed'));
    } finally {
      setBusy(false);
    }
  };

  const warningText = (w: string) => {
    if (w.startsWith('unknown_table:')) return t('backup.warnings.unknown_table', { table: w.slice('unknown_table:'.length) });
    if (w === 'integrity_issues') return t('backup.warnings.integrity_issues', { count: result?.integrity?.issues.length ?? 0 });
    return t(`backup.warnings.${w}` as MessageKey);
  };

  const backup = result?.backup;
  const total = backup ? Object.values(backup.data).reduce((n, rows) => n + rows.length, 0) : 0;
  const studentName = backup?.data.students?.[0]?.fullName;

  return (
    <Card>
      <CardHeader title={t('backup.restore.title')} description={t('backup.restore.description')} icon={<Upload className="h-4 w-4" />} />

      <input ref={inputRef} type="file" accept="application/json,.json" className="sr-only" onChange={onFile} data-testid="restore-file-input" tabIndex={-1} />
      {!result && (
        <Button variant="secondary" onClick={() => inputRef.current?.click()} loading={validating} icon={<FileUp className="h-4 w-4" />}>
          {validating ? t('backup.restore.validating') : t('backup.restore.choose')}
        </Button>
      )}

      {result && (
        <div className="space-y-4">
          {result.errors.length > 0 && (
            <div role="alert" className="space-y-1 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm">
              {result.errors.map((err) => (
                <p key={err} className="flex items-start gap-2 text-danger">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {t(`backup.errors.${err}` as MessageKey)}
                </p>
              ))}
            </div>
          )}

          {backup && result.ok && (
            <>
              <div className="rounded-lg border border-border bg-bg/50 p-3 text-sm">
                <p className="mb-2 font-medium">
                  {t('backup.restore.summary')} <span className="font-normal text-muted">— {fileName}</span>
                </p>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                  <Row label={t('backup.restore.exportedAt')} value={formatDate(backup.exportedAt, true)} />
                  <Row label={t('backup.restore.totalRecords')} value={formatNumber(total)} />
                  <Row label={t('backup.restore.appVersion')} value={backup.appVersion} />
                  <Row label={t('backup.restore.schemaVersion')} value={String(backup.schemaVersion)} />
                  {typeof studentName === 'string' && <Row label={t('backup.restore.student')} value={studentName} />}
                </dl>
              </div>

              {result.warnings.length > 0 && (
                <div className="space-y-1 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
                  {result.warnings.map((w) => (
                    <p key={w} className="flex items-start gap-2 text-warning">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      {warningText(w)}
                    </p>
                  ))}
                </div>
              )}

              <fieldset className="space-y-2">
                <legend className="mb-1 text-sm font-medium">{t('backup.restore.modeLabel')}</legend>
                {(['replace', 'merge'] as const).map((m) => (
                  <label
                    key={m}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors',
                      mode === m ? 'border-primary bg-primary/10' : 'border-border hover:bg-surface-2',
                    )}
                  >
                    <input type="radio" name="restore-mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="mt-0.5 accent-[rgb(var(--primary))]" />
                    <span>
                      <span className="font-medium">{t(m === 'replace' ? 'backup.restore.modeReplace' : 'backup.restore.modeMerge')}</span>
                      <span className="block text-muted">{t(m === 'replace' ? 'backup.restore.modeReplaceHint' : 'backup.restore.modeMergeHint')}</span>
                    </span>
                  </label>
                ))}
              </fieldset>

              <p className="flex items-start gap-2 text-xs text-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                {t('backup.restore.safetyNote')}
              </p>
            </>
          )}

          <div className="flex flex-wrap gap-2">
            {result.ok && (
              <Button variant={mode === 'replace' ? 'danger' : 'primary'} onClick={() => setConfirmOpen(true)}>
                {t('backup.restore.button')}
              </Button>
            )}
            <Button variant="ghost" onClick={reset}>
              {t('backup.restore.reset')}
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={t('backup.restore.confirmTitle')}
        confirmLabel={t('backup.restore.button')}
        tone={mode === 'replace' ? 'danger' : 'primary'}
        requireWord={mode === 'replace' ? t('backup.restore.confirmWord') : undefined}
        busy={busy}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onRestore}
      >
        {mode === 'replace'
          ? t('backup.restore.confirmReplace', { word: t('backup.restore.confirmWord') })
          : t('backup.restore.confirmMerge')}
      </ConfirmDialog>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 sm:block">
      <dt className="text-muted">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  );
}
