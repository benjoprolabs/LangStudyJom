import { useI18n } from '@/i18n/I18nProvider';
import { PageHeader } from '@/components/ui/PageHeader';
import { ExportCard } from './ExportCard';
import { IntegrityCard } from './IntegrityCard';
import { RestoreCard } from './RestoreCard';
import { SnapshotsCard } from './SnapshotsCard';
import { StorageCard } from './StorageCard';

export function BackupPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader eyebrow={t('nav.groups.system')} title={t('backup.title')} description={t('backup.subtitle')} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ExportCard />
        <RestoreCard />
        <div className="lg:col-span-2">
          <SnapshotsCard />
        </div>
        <StorageCard />
        <IntegrityCard />
      </div>
    </>
  );
}
