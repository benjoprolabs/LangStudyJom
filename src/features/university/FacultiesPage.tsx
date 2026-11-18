import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Landmark, Plus } from 'lucide-react';
import { db } from '@/db/client';
import { createFaculty, updateFaculty, type FacultyInput } from '@/db/repositories/university';
import type { Faculty } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LocalizedField } from '@/components/ui/LocalizedField';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { CodeOrderStatus } from './CommonFields';
import { CurriculumPackagesButton } from './CurriculumPackages';
import { ArchivedToggle, CodeTag, DeleteDialog, RowActions, StatusBadge, useArchiveToggle, useFieldErrors, useRunner, type DeleteTarget } from './shared';

const blank = (order: number): FacultyInput => ({ code: '', name: { ms: '', en: '' }, description: { ms: '', en: '' }, order, status: 'active' });

export function FacultiesPage() {
  const { t, l } = useI18n();
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<{ id?: string; input: FacultyInput } | null>(null);
  const [deleting, setDeleting] = useState<DeleteTarget | null>(null);
  const toggleArchive = useArchiveToggle('faculty');

  const faculties = useLiveQuery(() => db.faculties.orderBy('order').toArray(), []);
  const academyCounts = useLiveQuery(async () => {
    const counts = new Map<string, number>();
    for (const a of await db.academies.toArray()) counts.set(a.facultyId, (counts.get(a.facultyId) ?? 0) + 1);
    return counts;
  }, []);

  const visible = (faculties ?? []).filter((f) => showArchived || f.status !== 'archived');
  const nextOrder = (faculties ?? []).reduce((m, f) => Math.max(m, f.order), 0) + 1;
  const edit = (f: Faculty) => setEditing({ id: f.id, input: { code: f.code, name: f.name, description: f.description, order: f.order, status: f.status } });

  return (
    <>
      <PageHeader
        eyebrow={t('nav.groups.university')}
        title={t('nav.faculties')}
        description={t('university.faculties.subtitle')}
        actions={
          <>
            <CurriculumPackagesButton />
            <Button onClick={() => setEditing({ input: blank(nextOrder) })} icon={<Plus className="h-4 w-4" />}>
              {t('university.faculties.add')}
            </Button>
          </>
        }
      />
      <div className="mb-4 flex justify-end">
        <ArchivedToggle checked={showArchived} onChange={setShowArchived} />
      </div>

      {faculties && visible.length === 0 ? (
        <EmptyState icon={<Landmark className="h-6 w-6" />}>{t('university.faculties.empty')}</EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2" data-testid="faculty-list">
          {visible.map((f) => (
            <li key={f.id}>
              <Card className={f.status === 'archived' ? 'opacity-70' : undefined}>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/15 p-2 text-primary">
                    <Landmark className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CodeTag>{f.code}</CodeTag>
                      <StatusBadge status={f.status} />
                    </div>
                    <h2 className="mt-1 font-semibold">{l(f.name)}</h2>
                    {l(f.description) && <p className="mt-1 line-clamp-2 text-sm text-muted">{l(f.description)}</p>}
                    <Link to={`/academies?faculty=${f.id}`} className="mt-2 inline-block text-xs font-medium text-accent hover:underline">
                      {t('university.faculties.academiesCount', { count: academyCounts?.get(f.id) ?? 0 })}
                    </Link>
                  </div>
                  <RowActions
                    name={l(f.name)}
                    status={f.status}
                    onEdit={() => edit(f)}
                    onToggleArchive={() => void toggleArchive('faculties', f.id, f.status)}
                    onDelete={() => setDeleting({ table: 'faculties', id: f.id, name: l(f.name), entity: 'faculty', status: f.status })}
                  />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {editing && <FacultyForm id={editing.id} initial={editing.input} onClose={() => setEditing(null)} />}
      <DeleteDialog target={deleting} onClose={() => setDeleting(null)} />
    </>
  );
}

function FacultyForm({ id, initial, onClose }: { id?: string; initial: FacultyInput; onClose: () => void }) {
  const { t } = useI18n();
  const run = useRunner();
  const [value, setValue] = useState<FacultyInput>(initial);
  const { errors, setErrors } = useFieldErrors();
  const [busy, setBusy] = useState(false);
  const entity = t('entities.faculty');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await run(() => (id ? updateFaculty(db, id, value) : createFaculty(db, value)), {
      success: t(id ? 'university.common.updated' : 'university.common.created', { entity }),
      onFieldErrors: setErrors,
    });
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <Modal
      open
      size="lg"
      title={t(id ? 'university.faculties.formEdit' : 'university.faculties.formNew')}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="faculty-form" loading={busy}>
            {t(id ? 'university.common.save' : 'university.common.create')}
          </Button>
        </>
      }
    >
      <form id="faculty-form" onSubmit={submit} noValidate className="space-y-5">
        <CodeOrderStatus code={value.code} order={value.order} status={value.status ?? 'active'} errors={errors} onChange={(p) => setValue({ ...value, ...p })} />
        <LocalizedField label={t('university.common.name')} field="name" required value={value.name} errors={errors} onChange={(name) => setValue({ ...value, name })} />
        <LocalizedField
          label={t('university.common.description')}
          field="description"
          multiline
          maxLength={2000}
          value={value.description ?? { ms: '' }}
          errors={errors}
          onChange={(description) => setValue({ ...value, description })}
        />
      </form>
    </Modal>
  );
}
