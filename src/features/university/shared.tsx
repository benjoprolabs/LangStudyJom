import { useEffect, useState, type ReactNode } from 'react';
import { Archive, ArchiveRestore, Pencil, ShieldAlert, Trash2 } from 'lucide-react';
import { db } from '@/db/client';
import { ReferencedRecordError, type DeletePlan } from '@/db/guards';
import { IntegrityError } from '@/db/integrity';
import {
  deleteCurriculumRecord,
  previewDelete,
  setStatus,
  ValidationError,
  type CurriculumTable,
  type FieldErrors,
} from '@/db/repositories/university';
import type { RecordStatus } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import type { MessageKey } from '@/i18n/translate';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

export type EntityKey = 'faculty' | 'academy' | 'programme' | 'semester' | 'course';

/**
 * Run a repository call and turn its typed errors into UI feedback:
 * ValidationError → per-field messages, IntegrityError → toast, anything else → generic toast.
 * Returns the result, or `undefined` if it failed — so `fn` must return a value
 * (e.g. `true`) when the caller needs to know it succeeded.
 */
export function useRunner() {
  const { t } = useI18n();
  const toast = useToast();
  return async function run<T>(
    fn: () => Promise<T>,
    opts: { success?: string; onFieldErrors?: (e: FieldErrors) => void } = {},
  ): Promise<T | undefined> {
    try {
      const result = await fn();
      if (opts.success) toast.success(opts.success);
      return result;
    } catch (err) {
      if (err instanceof ValidationError && opts.onFieldErrors) {
        opts.onFieldErrors(err.fields);
      } else if (err instanceof ValidationError) {
        const [, code] = Object.entries(err.fields)[0] ?? [];
        toast.error(code ? t(`validation.${code}` as MessageKey) : t('common.saveFailed'));
      } else if (err instanceof IntegrityError) {
        const issue = err.issues[0];
        if (issue?.kind === 'circular_prerequisite') toast.error(t('university.courses.prerequisiteCycle'));
        else if (issue?.kind === 'self_prerequisite') toast.error(t('university.courses.prerequisiteSelf'));
        else toast.error(t('university.common.integrityFailed', { detail: issue?.detail ?? '' }));
      } else {
        toast.error(t('common.saveFailed'));
      }
      return undefined;
    }
  };
}

/** Keep the first error per field visible after a failed save; clear when the user edits. */
export function useFieldErrors() {
  const [errors, setErrors] = useState<FieldErrors>({});
  return { errors, setErrors, clear: () => setErrors({}) };
}

export function StatusBadge({ status }: { status: RecordStatus }) {
  const { t } = useI18n();
  const tone = status === 'active' ? 'success' : status === 'archived' ? 'neutral' : 'warning';
  return <Badge tone={tone}>{t(`university.common.statuses.${status}`)}</Badge>;
}

/** Edit / archive-restore / delete buttons for one record. */
export function RowActions({
  name,
  status,
  onEdit,
  onToggleArchive,
  onDelete,
}: {
  name: string;
  status?: RecordStatus;
  onEdit: () => void;
  onToggleArchive?: () => void;
  onDelete: () => void;
}) {
  const { t } = useI18n();
  const archived = status === 'archived';
  return (
    <div className="flex shrink-0 items-center gap-0.5" role="group" aria-label={t('university.common.actions', { name })}>
      <Button size="icon" variant="ghost" onClick={onEdit} aria-label={`${t('university.common.edit')}: ${name}`} title={t('university.common.edit')} icon={<Pencil className="h-4 w-4" />} />
      {onToggleArchive && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleArchive}
          aria-label={`${t(archived ? 'university.common.restore' : 'university.common.archive')}: ${name}`}
          title={t(archived ? 'university.common.restore' : 'university.common.archive')}
          icon={archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
        />
      )}
      <Button size="icon" variant="ghost" onClick={onDelete} aria-label={`${t('university.common.delete')}: ${name}`} title={t('university.common.delete')} icon={<Trash2 className="h-4 w-4" />} />
    </div>
  );
}

export function useArchiveToggle(entity: EntityKey) {
  const { t } = useI18n();
  const run = useRunner();
  return (table: Exclude<CurriculumTable, 'semesters'>, id: string, status: RecordStatus) => {
    const next: RecordStatus = status === 'archived' ? 'active' : 'archived';
    return run(() => setStatus(db, table, id, next), {
      success: t(next === 'archived' ? 'university.common.archived' : 'university.common.restored', { entity: t(`entities.${entity}`) }),
    });
  };
}

export interface DeleteTarget {
  table: CurriculumTable;
  id: string;
  name: string;
  entity: EntityKey;
  status?: RecordStatus;
}

/**
 * Delete with a dry run first: shows what would be removed (owned children) or which
 * records block the delete. Offers "archive instead" when blocked.
 */
export function DeleteDialog({ target, onClose }: { target: DeleteTarget | null; onClose: () => void }) {
  const { t } = useI18n();
  const run = useRunner();
  const [plan, setPlan] = useState<DeletePlan | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPlan(null);
    if (target) void previewDelete(db, target.table, target.id).then(setPlan);
  }, [target]);

  if (!target) return null;
  const entity = t(`entities.${target.entity}`);
  const blocked = (plan?.blockers.length ?? 0) > 0;
  const grouped = (items: { table: string }[]) =>
    Object.entries(items.reduce<Record<string, number>>((acc, i) => ({ ...acc, [i.table]: (acc[i.table] ?? 0) + 1 }), {}));
  const tableName = (table: string) => t(`tables.${table}` as MessageKey);

  const doDelete = async () => {
    setBusy(true);
    const ok = await run(
      async () => {
        try {
          return await deleteCurriculumRecord(db, target.table, target.id);
        } catch (e) {
          // Someone added a reference between preview and confirm: refresh the preview.
          if (e instanceof ReferencedRecordError) setPlan(await previewDelete(db, target.table, target.id));
          throw e;
        }
      },
      { success: t('university.common.deleted', { entity }) },
    );
    setBusy(false);
    if (ok) onClose();
  };

  const archiveInstead = async () => {
    if (target.table === 'semesters') return;
    setBusy(true);
    // The runner signals failure with `undefined`, so return an explicit success value.
    const ok = await run(
      async () => {
        await setStatus(db, target.table as Exclude<CurriculumTable, 'semesters'>, target.id, 'archived');
        return true;
      },
      { success: t('university.common.archived', { entity }) },
    );
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <Modal
      open
      title={t('university.common.deleteTitle', { entity })}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {t('common.cancel')}
          </Button>
          {plan && blocked && target.table !== 'semesters' && target.status !== 'archived' && (
            <Button variant="secondary" onClick={archiveInstead} loading={busy} icon={<Archive className="h-4 w-4" />}>
              {t('university.common.archiveInstead')}
            </Button>
          )}
          {plan && !blocked && (
            <Button variant="danger" onClick={doDelete} loading={busy} icon={<Trash2 className="h-4 w-4" />}>
              {t('university.common.delete')}
            </Button>
          )}
        </>
      }
    >
      {!plan ? (
        <p className="text-sm text-muted" role="status">
          {t('university.common.deleteChecking')}
        </p>
      ) : blocked ? (
        <div className="space-y-3 text-sm" data-testid="delete-blocked">
          <p className="flex items-start gap-2 text-warning">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {t('university.common.deleteBlocked')}
          </p>
          <ul className="list-inside list-disc space-y-1 pl-1">
            {grouped(plan.blockers).map(([table, count]) => (
              <li key={table}>{t('university.common.countOf', { count, table: tableName(table) })}</li>
            ))}
          </ul>
          {target.table !== 'semesters' && <p className="text-muted">{t('university.common.deleteBlockedHint')}</p>}
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <p>{t('university.common.deleteBody', { name: target.name })}</p>
          {plan.toDelete.length > 1 && (
            <>
              <p className="text-muted">{t('university.common.deleteCascade')}</p>
              <ul className="list-inside list-disc pl-1">
                {grouped(plan.toDelete.slice(1)).map(([table, count]) => (
                  <li key={table}>{t('university.common.countOf', { count, table: tableName(table) })}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

/** Small "Show archived" toggle used on every list. */
export function ArchivedToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const { t } = useI18n();
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--primary))]" />
      {t('university.common.showArchived')}
    </label>
  );
}

export function CodeTag({ children }: { children: ReactNode }) {
  return <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-accent">{children}</code>;
}
