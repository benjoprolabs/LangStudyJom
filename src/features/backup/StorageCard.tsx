import { useState } from 'react';
import { CheckCircle2, HardDrive } from 'lucide-react';
import { formatBytes } from '@/lib/download';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useToast } from '@/components/ui/Toast';
import { useStorageStatus } from './useStorageStatus';

export function StorageCard() {
  const { t } = useI18n();
  const toast = useToast();
  const { status, request } = useStorageStatus();
  const [busy, setBusy] = useState(false);

  const onRequest = async () => {
    setBusy(true);
    const granted = await request();
    setBusy(false);
    if (granted) toast.success(t('backup.storage.granted'));
    else toast.info(t('backup.storage.denied'));
  };

  return (
    <Card>
      <CardHeader title={t('backup.storage.title')} description={t('backup.storage.description')} icon={<HardDrive className="h-4 w-4" />} />
      {status.usage !== undefined && status.quota ? (
        <div className="mb-4 space-y-1.5">
          <ProgressBar value={(status.usage / status.quota) * 100} label={t('backup.storage.title')} />
          <p className="text-xs text-muted">{t('backup.storage.usage', { used: formatBytes(status.usage), quota: formatBytes(status.quota) })}</p>
        </div>
      ) : null}
      {status.persisted === true ? (
        <p className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          {t('backup.storage.granted')}
        </p>
      ) : status.persisted === null ? (
        <p className="text-sm text-muted">{t('dashboard.system.unsupported')}</p>
      ) : (
        <Button variant="secondary" onClick={onRequest} loading={busy}>
          {t('backup.storage.request')}
        </Button>
      )}
    </Card>
  );
}
