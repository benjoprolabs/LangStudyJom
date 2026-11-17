import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { GraduationCap, Plus } from 'lucide-react';
import { db } from '@/db/client';
import { createAcademy, updateAcademy, type AcademyInput } from '@/db/repositories/university';
import type { Academy } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, Select } from '@/components/ui/Field';
import { LocalizedField } from '@/components/ui/LocalizedField';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { CodeOrderStatus, useFieldMessage } from './CommonFields';
import { ArchivedToggle, CodeTag, DeleteDialog, RowActions, StatusBadge, useArchiveToggle, useFieldErrors, useRunner, type DeleteTarget } from './shared';

export function AcademiesPage() {
  const { t, l } = useI18n();
  const [params, setParams] = useSearchParams();
  const facultyFilter = params.get('faculty') ?? '';
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<{ id?: string; input: AcademyInput } | null>(null);
  const [deleting, setDeleting] = useState<DeleteTarget | null>(null);
  const toggleArchive = useArchiveToggle('academy');

  const faculties = useLiveQuery(() => db.faculties.orderBy('order').toArray(), []);
  const academies = useLiveQuery(() => db.academies.orderBy('order').toArray(), []);
  const programmeCounts = useLiveQuery(async () => {
    const counts = new Map<string, number>();
    for (const p of await db.programmes.toArray()) counts.set(p.academyId, (counts.get(p.academyId) ?? 0) + 1);
    return counts;
  }, []);

  if (!faculties || !academies) return <p className="text-sm text-muted">{t('common.loading')}</p>;

  const visible = academies.filter((a) => (showArchived || a.status !== 'archived') && (!facultyFilter || a.facultyId === facultyFilter));
  const groups = faculties
    .filter((f) => !facultyFilter || f.id === facultyFilter)
    .map((f) => ({ faculty: f, academies: visible.filter((a) => a.facultyId === f.id) }))
    .filter((g) => g.academies.length > 0);

  const openNew = () => {
    const facultyId = facultyFilter || faculties.find((f) => f.status !== 'archived')?.id || '';
    const order = academies.filter((a) => a.facultyId === facultyId).reduce((m, a) => Math.max(m, a.order), 0) + 1;
    setEditing({ input: { facultyId, code: '', name: { ms: '', en: '' }, description: { ms: '', en: '' }, order, status: 'active' } });
  };
  const edit = (a: Academy) =>
    setEditing({ id: a.id, input: { facultyId: a.facultyId, code: a.code, name: a.name, description: a.description, order: a.order, status: a.status } });

  return (
    <>
      <PageHeader
        eyebrow={t('nav.groups.university')}
        title={t('nav.academies')}
        description={t('university.academies.subtitle')}
        actions={
          faculties.length > 0 && (
            <Button onClick={openNew} icon={<Plus className="h-4 w-4" />}>
              {t('university.academies.add')}
            </Button>
          )
        }
      />

      {faculties.length === 0 ? (
        <EmptyState icon={<GraduationCap className="h-6 w-6" />}>
          <p>{t('university.academies.needFaculty')}</p>
          <Link to="/faculties" className="font-medium text-accent hover:underline">
            {t('university.academies.goFaculties')}
          </Link>
        </EmptyState>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Select
              aria-label={t('university.academies.faculty')}
              className="w-full sm:w-72"
              value={facultyFilter}
              onChange={(e) => setParams(e.target.value ? { faculty: e.target.value } : {})}
            >
              <option value="">{t('university.academies.allFaculties')}</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code} — {l(f.name)}
                </option>
              ))}
            </Select>
            <ArchivedToggle checked={showArchived} onChange={setShowArchived} />
          </div>

          {groups.length === 0 ? (
            <EmptyState icon={<GraduationCap className="h-6 w-6" />}>{t('university.academies.empty')}</EmptyState>
          ) : (
            <div className="space-y-6" data-testid="academy-list">
              {groups.map(({ faculty, academies: items }) => (
                <section key={faculty.id} aria-labelledby={`fac-${faculty.id}`}>
                  <h2 id={`fac-${faculty.id}`} className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted">
                    <CodeTag>{faculty.code}</CodeTag>
                    {l(faculty.name)}
                  </h2>
                  <ul className="grid gap-3 md:grid-cols-2">
                    {items.map((a) => (
                      <li key={a.id}>
                        <Card className={a.status === 'archived' ? 'p-4 opacity-70' : 'p-4'}>
                          <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <CodeTag>{a.code}</CodeTag>
                                <StatusBadge status={a.status} />
                              </div>
                              <h3 className="mt-1 font-semibold">{l(a.name)}</h3>
                              {l(a.description) && <p className="mt-1 line-clamp-2 text-sm text-muted">{l(a.description)}</p>}
                              <Link to={`/programmes?academy=${a.id}`} className="mt-2 inline-block text-xs font-medium text-accent hover:underline">
                                {t('university.academies.programmesCount', { count: programmeCounts?.get(a.id) ?? 0 })}
                              </Link>
                            </div>
                            <RowActions
                              name={l(a.name)}
                              status={a.status}
                              onEdit={() => edit(a)}
                              onToggleArchive={() => void toggleArchive('academies', a.id, a.status)}
                              onDelete={() => setDeleting({ table: 'academies', id: a.id, name: l(a.name), entity: 'academy', status: a.status })}
                            />
                          </div>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </>
      )}

      {editing && <AcademyForm id={editing.id} initial={editing.input} onClose={() => setEditing(null)} />}
      <DeleteDialog target={deleting} onClose={() => setDeleting(null)} />
    </>
  );
}

function AcademyForm({ id, initial, onClose }: { id?: string; initial: AcademyInput; onClose: () => void }) {
  const { t, l } = useI18n();
  const run = useRunner();
  const faculties = useLiveQuery(() => db.faculties.orderBy('order').toArray(), []);
  const [value, setValue] = useState<AcademyInput>(initial);
  const { errors, setErrors } = useFieldErrors();
  const msg = useFieldMessage(errors);
  const [busy, setBusy] = useState(false);
  const entity = t('entities.academy');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await run(() => (id ? updateAcademy(db, id, value) : createAcademy(db, value)), {
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
      title={t(id ? 'university.academies.formEdit' : 'university.academies.formNew')}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="academy-form" loading={busy}>
            {t(id ? 'university.common.save' : 'university.common.create')}
          </Button>
        </>
      }
    >
      <form id="academy-form" onSubmit={submit} noValidate className="space-y-5">
        <Field label={t('university.academies.faculty')} error={msg('facultyId')}>
          {(p) => (
            <Select id={p.id} value={value.facultyId} onChange={(e) => setValue({ ...value, facultyId: e.target.value })}>
              <option value="" disabled>
                —
              </option>
              {(faculties ?? []).map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code} — {l(f.name)}
                </option>
              ))}
            </Select>
          )}
        </Field>
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
