import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Download, History, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { db } from '@/db/client';
import { createSnapshot, deleteSnapshot, getSnapshotPayload, restoreSnapshot } from '@/db/backup/backup';
import type { Snapshot } from '@/db/types';
import { downloadText, formatBytes } from '@/lib/download';
import { useI18n } from '@/i18n/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

type PendingAction = { kind: 'restore' | 'delete'; snapshot: Snapshot } | null;

export function SnapshotsCard() {
  const { t, formatDate, formatNumber } = useI18n();
  const toast = useToast();
  const snapshots = useLiveQuery(() => db.snapshots.orderBy('createdAt').reverse().toArray(), []);
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState<PendingAction>(null);
  const [busy, setBusy] = useState(false);

  const onCreate = async () => {
    setCreating(true);
    try {
      await createSnapshot(db, 'manual');
      toast.success(t('backup.snapshots.created'));
    } catch {
      toast.error(t('common.saveFailed'));
    } finally {
      setCreating(false);
    }
  };

  const onDownload = async (s: Snapshot) => {
    try {
      const payload = await getSnapshotPayload(db, s.id);
      downloadText(`qhaze-snapshot-${s.createdAt.replace(/[:.]/g, '-').slice(0, 19)}.json`, payload);
    } catch {
      toast.error(t('common.saveFailed'));
    }
  };

  const onConfirm = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      if (pending.kind === 'restore') {
        await restoreSnapshot(db, pending.snapshot.id);
        toast.success(t('backup.snapshots.restored'));
      } else {
        await deleteSnapshot(db, pending.snapshot.id);
        toast.success(t('backup.snapshots.deleted'));
      }
      setPending(null);
    } catch {
      toast.error(t('backup.restore.failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title={t('backup.snapshots.title')}
        description={t('backup.snapshots.description')}
        icon={<History className="h-4 w-4" />}
        action={
          <Button size="sm" variant="secondary" onClick={onCreate} loading={creating} icon={<Plus className="h-4 w-4" />}>
            <span className="hidden sm:inline">{t('backup.snapshots.create')}</span>
          </Button>
        }
      />
      {!snapshots ? (
        <p className="text-sm text-muted">{t('common.loading')}</p>
      ) : snapshots.length === 0 ? (
        <EmptyState icon={<History className="h-6 w-6" />}>{t('backup.snapshots.empty')}</EmptyState>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border" data-testid="snapshot-list">
          {snapshots.map((s) => (
            <li key={s.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{formatDate(s.createdAt, true)}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <Badge tone={s.reason === 'manual' ? 'primary' : 'accent'}>{t(`backup.snapshots.reason.${s.reason}`)}</Badge>
                  <span>{t('common.records', { count: formatNumber(s.recordCount) })}</span>
                  <span>{formatBytes(s.sizeBytes)}</span>
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setPending({ kind: 'restore', snapshot: s })} icon={<RotateCcw className="h-4 w-4" />}>
                  {t('backup.snapshots.restore')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => void onDownload(s)} icon={<Download className="h-4 w-4" />} aria-label={t('backup.snapshots.download')} title={t('backup.snapshots.download')} />
                <Button size="sm" variant="ghost" onClick={() => setPending({ kind: 'delete', snapshot: s })} icon={<Trash2 className="h-4 w-4" />} aria-label={t('common.delete')} title={t('common.delete')} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={pending?.kind === 'delete' ? t('backup.snapshots.confirmDeleteTitle') : t('backup.snapshots.confirmRestoreTitle')}
        confirmLabel={pending?.kind === 'delete' ? t('common.delete') : t('backup.snapshots.restore')}
        busy={busy}
        onCancel={() => setPending(null)}
        onConfirm={onConfirm}
      >
        {pending &&
          (pending.kind === 'delete'
            ? t('backup.snapshots.confirmDelete', { date: formatDate(pending.snapshot.createdAt, true) })
            : t('backup.snapshots.confirmRestore', { date: formatDate(pending.snapshot.createdAt, true) }))}
      </ConfirmDialog>
    </Card>
  );
}
