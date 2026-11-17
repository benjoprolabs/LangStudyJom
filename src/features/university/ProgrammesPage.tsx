import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowRight, Layers, Plus } from 'lucide-react';
import { db } from '@/db/client';
import { createProgramme, MAX_SEMESTERS, updateProgramme, type ProgrammeInput } from '@/db/repositories/university';
import { DIFFICULTY_LEVELS, type AcademicProgramme } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, Input, Select } from '@/components/ui/Field';
import { LocalizedField, LocalizedListField } from '@/components/ui/LocalizedField';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { CodeOrderStatus, useFieldMessage } from './CommonFields';
import { ArchivedToggle, CodeTag, DeleteDialog, RowActions, StatusBadge, useArchiveToggle, useFieldErrors, useRunner, type DeleteTarget } from './shared';

const toInput = (p: AcademicProgramme): ProgrammeInput => ({
  academyId: p.academyId,
  code: p.code,
  name: p.name,
  description: p.description,
  totalSemesters: p.totalSemesters,
  entryLevel: p.entryLevel,
  exitLevel: p.exitLevel,
  completionRequirements: p.completionRequirements,
  status: p.status,
});

export function ProgrammesPage() {
  const { t, l } = useI18n();
  const [params, setParams] = useSearchParams();
  const academyFilter = params.get('academy') ?? '';
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<{ id?: string; input: ProgrammeInput } | null>(null);
  const [deleting, setDeleting] = useState<DeleteTarget | null>(null);
  const toggleArchive = useArchiveToggle('programme');

  const academies = useLiveQuery(() => db.academies.orderBy('order').toArray(), []);
  const programmes = useLiveQuery(() => db.programmes.orderBy('code').toArray(), []);
  const stats = useLiveQuery(async () => {
    const semesters = new Map<string, number>();
    const courses = new Map<string, number>();
    for (const s of await db.semesters.toArray()) semesters.set(s.programmeId, (semesters.get(s.programmeId) ?? 0) + 1);
    for (const c of await db.courses.toArray()) courses.set(c.programmeId, (courses.get(c.programmeId) ?? 0) + 1);
    return { semesters, courses };
  }, []);

  if (!academies || !programmes) return <p className="text-sm text-muted">{t('common.loading')}</p>;

  const visible = programmes.filter((p) => (showArchived || p.status !== 'archived') && (!academyFilter || p.academyId === academyFilter));
  const groups = academies
    .filter((a) => !academyFilter || a.id === academyFilter)
    .map((a) => ({ academy: a, programmes: visible.filter((p) => p.academyId === a.id) }))
    .filter((g) => g.programmes.length > 0);

  const openNew = () =>
    setEditing({
      input: {
        academyId: academyFilter || academies.find((a) => a.status !== 'archived')?.id || '',
        code: '',
        name: { ms: '', en: '' },
        description: { ms: '', en: '' },
        totalSemesters: 6,
        entryLevel: 'absolute_beginner',
        exitLevel: 'professional',
        completionRequirements: [],
        status: 'active',
      },
    });

  return (
    <>
      <PageHeader
        eyebrow={t('nav.groups.university')}
        title={t('nav.programmes')}
        description={t('university.programmes.subtitle')}
        actions={
          academies.length > 0 && (
            <Button onClick={openNew} icon={<Plus className="h-4 w-4" />}>
              {t('university.programmes.add')}
            </Button>
          )
        }
      />

      {academies.length === 0 ? (
        <EmptyState icon={<Layers className="h-6 w-6" />}>
          <p>{t('university.programmes.needAcademy')}</p>
          <Link to="/academies" className="font-medium text-accent hover:underline">
            {t('university.programmes.goAcademies')}
          </Link>
        </EmptyState>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Select
              aria-label={t('university.programmes.academy')}
              className="w-full sm:w-80"
              value={academyFilter}
              onChange={(e) => setParams(e.target.value ? { academy: e.target.value } : {})}
            >
              <option value="">{t('university.programmes.allAcademies')}</option>
              {academies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} — {l(a.name)}
                </option>
              ))}
            </Select>
            <ArchivedToggle checked={showArchived} onChange={setShowArchived} />
          </div>

          {groups.length === 0 ? (
            <EmptyState icon={<Layers className="h-6 w-6" />}>{t('university.programmes.empty')}</EmptyState>
          ) : (
            <div className="space-y-6" data-testid="programme-list">
              {groups.map(({ academy, programmes: items }) => (
                <section key={academy.id} aria-labelledby={`aca-${academy.id}`}>
                  <h2 id={`aca-${academy.id}`} className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted">
                    <CodeTag>{academy.code}</CodeTag>
                    {l(academy.name)}
                  </h2>
                  <ul className="grid gap-3 lg:grid-cols-2">
                    {items.map((p) => (
                      <li key={p.id}>
                        <Card className={p.status === 'archived' ? 'p-4 opacity-70' : 'p-4'}>
                          <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <CodeTag>{p.code}</CodeTag>
                                <StatusBadge status={p.status} />
                              </div>
                              <h3 className="mt-1 font-semibold">{l(p.name)}</h3>
                              {l(p.description) && <p className="mt-1 line-clamp-2 text-sm text-muted">{l(p.description)}</p>}
                              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                                <Badge tone="primary">{t(`difficulty.${p.entryLevel}`)}</Badge>
                                <ArrowRight className="h-3 w-3 text-muted" aria-hidden />
                                <Badge tone="accent">{t(`difficulty.${p.exitLevel}`)}</Badge>
                              </div>
                              <p className="mt-2 text-xs text-muted">
                                {t('university.programmes.semestersCount', { count: stats?.semesters.get(p.id) ?? 0 })} ·{' '}
                                {t('university.programmes.coursesCount', { count: stats?.courses.get(p.id) ?? 0 })}
                              </p>
                              <Link to={`/semesters?programme=${p.id}`} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                                {t('university.programmes.openCurriculum')}
                                <ArrowRight className="h-3 w-3" aria-hidden />
                              </Link>
                            </div>
                            <RowActions
                              name={l(p.name)}
                              status={p.status}
                              onEdit={() => setEditing({ id: p.id, input: toInput(p) })}
                              onToggleArchive={() => void toggleArchive('programmes', p.id, p.status)}
                              onDelete={() => setDeleting({ table: 'programmes', id: p.id, name: l(p.name), entity: 'programme', status: p.status })}
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

      {editing && <ProgrammeForm id={editing.id} initial={editing.input} onClose={() => setEditing(null)} />}
      <DeleteDialog target={deleting} onClose={() => setDeleting(null)} />
    </>
  );
}

function ProgrammeForm({ id, initial, onClose }: { id?: string; initial: ProgrammeInput; onClose: () => void }) {
  const { t, l } = useI18n();
  const run = useRunner();
  const academies = useLiveQuery(() => db.academies.orderBy('order').toArray(), []);
  const [value, setValue] = useState<ProgrammeInput>(initial);
  const { errors, setErrors } = useFieldErrors();
  const msg = useFieldMessage(errors);
  const [busy, setBusy] = useState(false);
  const entity = t('entities.programme');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await run(() => (id ? updateProgramme(db, id, value) : createProgramme(db, value)), {
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
      title={t(id ? 'university.programmes.formEdit' : 'university.programmes.formNew')}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="programme-form" loading={busy}>
            {t(id ? 'university.common.save' : 'university.common.create')}
          </Button>
        </>
      }
    >
      <form id="programme-form" onSubmit={submit} noValidate className="space-y-5">
        <Field label={t('university.programmes.academy')} hint={id ? t('university.programmes.academyLocked') : undefined} error={msg('academyId')}>
          {(p) => (
            <Select id={p.id} aria-describedby={p.describedBy} value={value.academyId} disabled={Boolean(id)} onChange={(e) => setValue({ ...value, academyId: e.target.value })}>
              <option value="" disabled>
                —
              </option>
              {(academies ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} — {l(a.name)}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <CodeOrderStatus code={value.code} status={value.status ?? 'active'} showOrder={false} errors={errors} onChange={(p) => setValue({ ...value, ...p })} />
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
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label={t('university.programmes.totalSemesters')}
            hint={id ? t('university.programmes.totalSemestersEditHint') : t('university.programmes.totalSemestersHint')}
            error={msg('totalSemesters')}
          >
            {(p) => (
              <Input
                id={p.id}
                aria-describedby={p.describedBy}
                invalid={p.invalid}
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_SEMESTERS}
                value={Number.isFinite(value.totalSemesters) ? value.totalSemesters : ''}
                onChange={(e) => setValue({ ...value, totalSemesters: e.target.value === '' ? NaN : Number(e.target.value) })}
              />
            )}
          </Field>
          <Field label={t('university.programmes.entryLevel')} error={msg('entryLevel')}>
            {(p) => (
              <Select id={p.id} value={value.entryLevel} onChange={(e) => setValue({ ...value, entryLevel: e.target.value as ProgrammeInput['entryLevel'] })}>
                {DIFFICULTY_LEVELS.map((d) => (
                  <option key={d} value={d}>
                    {t(`difficulty.${d}`)}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label={t('university.programmes.exitLevel')} error={msg('exitLevel')}>
            {(p) => (
              <Select id={p.id} aria-describedby={p.describedBy} value={value.exitLevel} onChange={(e) => setValue({ ...value, exitLevel: e.target.value as ProgrammeInput['exitLevel'] })}>
                {DIFFICULTY_LEVELS.map((d) => (
                  <option key={d} value={d}>
                    {t(`difficulty.${d}`)}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
        <LocalizedListField
          label={t('university.programmes.completionRequirements')}
          hint={t('university.programmes.completionRequirementsHint')}
          field="completionRequirements"
          items={value.completionRequirements ?? []}
          errors={errors}
          onChange={(completionRequirements) => setValue({ ...value, completionRequirements })}
        />
      </form>
    </Modal>
  );
}
