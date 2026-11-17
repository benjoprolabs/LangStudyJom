import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Download } from 'lucide-react';
import { db } from '@/db/client';
import { exportBackup } from '@/db/backup/backup';
import { downloadText } from '@/lib/download';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

export function ExportCard() {
  const { t, formatDate } = useI18n();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const lastBackup = useLiveQuery(() => db.meta.get('lastBackupAt'), []);

  const onExport = async () => {
    setBusy(true);
    try {
      const { fileName, content } = await exportBackup(db);
      downloadText(fileName, content);
      toast.success(t('backup.export.done', { file: fileName }));
    } catch {
      toast.error(t('common.saveFailed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader title={t('backup.export.title')} description={t('backup.export.description')} icon={<Download className="h-4 w-4" />} />
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onExport} loading={busy} icon={<Download className="h-4 w-4" />}>
          {t('backup.export.button')}
        </Button>
        <span className="text-xs text-muted">
          {t('backup.export.lastBackup', {
            when: typeof lastBackup?.value === 'string' ? formatDate(lastBackup.value, true) : t('common.never'),
          })}
        </span>
      </div>
    </Card>
  );
}
