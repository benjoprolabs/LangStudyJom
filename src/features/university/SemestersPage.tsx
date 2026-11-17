import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { CalendarClock, Link2, Pencil, Plus, Trash2 } from 'lucide-react';
import { db } from '@/db/client';
import { createSemester, MAX_SEMESTERS, nextFreeSemesterNumber, updateSemester, type CourseInput, type SemesterInput } from '@/db/repositories/university';
import type { Course, Semester } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, Input, Select } from '@/components/ui/Field';
import { LocalizedField } from '@/components/ui/LocalizedField';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { useFieldMessage } from './CommonFields';
import { CourseForm, courseToInput } from './CourseForm';
import { ArchivedToggle, CodeTag, DeleteDialog, RowActions, StatusBadge, useArchiveToggle, useFieldErrors, useRunner, type DeleteTarget } from './shared';

/** Semester & course management (the curriculum of one programme). */
export function SemestersPage() {
  const { t, l } = useI18n();
  const [params, setParams] = useSearchParams();
  const [showArchived, setShowArchived] = useState(false);
  const [semesterForm, setSemesterForm] = useState<{ id?: string; input: SemesterInput } | null>(null);
  const [courseForm, setCourseForm] = useState<{ id?: string; input: CourseInput } | null>(null);
  const [deleting, setDeleting] = useState<DeleteTarget | null>(null);
  const toggleArchive = useArchiveToggle('course');

  const programmes = useLiveQuery(() => db.programmes.orderBy('code').toArray(), []);
  const programmeId = params.get('programme') ?? '';
  const programme = programmes?.find((p) => p.id === programmeId);

  // Default to the first active programme.
  useEffect(() => {
    if (programmes && !programme && programmes.length > 0) {
      const first = programmes.find((p) => p.status !== 'archived') ?? programmes[0]!;
      setParams({ programme: first.id }, { replace: true });
    }
  }, [programmes, programme, setParams]);

  const data = useLiveQuery(async () => {
    if (!programmeId) return null;
    const [semesters, courses, links, nextNumber] = await Promise.all([
      db.semesters.where('programmeId').equals(programmeId).sortBy('number'),
      db.courses.where('programmeId').equals(programmeId).sortBy('code'),
      db.coursePrerequisites.toArray(),
      nextFreeSemesterNumber(db, programmeId),
    ]);
    const codes = new Map((await db.courses.toArray()).map((c) => [c.id, c.code]));
    const prereqs = new Map<string, string[]>();
    for (const link of links) prereqs.set(link.courseId, [...(prereqs.get(link.courseId) ?? []), codes.get(link.prerequisiteCourseId) ?? '?']);
    return { semesters, courses, prereqs, nextNumber };
  }, [programmeId]);

  if (!programmes) return <p className="text-sm text-muted">{t('common.loading')}</p>;

  const header = (
    <PageHeader eyebrow={t('nav.groups.university')} title={t('nav.semesters')} description={t('university.semesters.subtitle')} />
  );

  if (programmes.length === 0) {
    return (
      <>
        {header}
        <EmptyState icon={<CalendarClock className="h-6 w-6" />}>
          <p>{t('university.semesters.noProgrammes')}</p>
          <Link to="/programmes" className="font-medium text-accent hover:underline">
            {t('university.semesters.goProgrammes')}
          </Link>
        </EmptyState>
      </>
    );
  }

  const courses = (data?.courses ?? []).filter((c) => showArchived || c.status !== 'archived');
  const totalCredits = (data?.courses ?? []).filter((c) => c.status !== 'archived').reduce((n, c) => n + c.creditHours, 0);

  const newCourse = (semesterId: string) =>
    setCourseForm({
      input: { semesterId, code: '', title: { ms: '', en: '' }, description: { ms: '', en: '' }, creditHours: 3, difficulty: programme?.entryLevel ?? 'beginner', learningObjectives: [], references: [], status: 'active' },
    });

  return (
    <>
      {header}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select aria-label={t('university.semesters.programme')} className="w-full sm:w-96" value={programmeId} onChange={(e) => setParams({ programme: e.target.value })}>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.code} — {l(p.name)}
              {p.status === 'archived' ? ` (${t('university.common.statuses.archived')})` : ''}
            </option>
          ))}
        </Select>
        <ArchivedToggle checked={showArchived} onChange={setShowArchived} />
      </div>

      {programme && data && (
        <>
          <Card className="mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex flex-wrap items-center gap-2 font-semibold">
                <CodeTag>{programme.code}</CodeTag>
                {l(programme.name)}
              </p>
              <p className="mt-1 text-sm text-muted" data-testid="curriculum-summary">
                {t('university.semesters.summary', { semesters: data.semesters.length, courses: data.courses.length, credits: totalCredits })}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1 sm:items-end">
              <Button
                variant="secondary"
                disabled={data.nextNumber === undefined}
                onClick={() => setSemesterForm({ input: { programmeId, number: data.nextNumber!, title: { ms: `Semester ${data.nextNumber}`, en: `Semester ${data.nextNumber}` }, description: { ms: '', en: '' } } })}
                icon={<Plus className="h-4 w-4" />}
              >
                {t('university.semesters.add')}
              </Button>
              {data.nextNumber === undefined && <p className="max-w-xs text-xs text-muted">{t('university.semesters.full', { total: programme.totalSemesters })}</p>}
            </div>
          </Card>

          <div className="space-y-4" data-testid="semester-list">
            {data.semesters.map((s) => (
              <SemesterCard
                key={s.id}
                semester={s}
                courses={courses.filter((c) => c.semesterId === s.id)}
                prereqs={data.prereqs}
                onEdit={() => setSemesterForm({ id: s.id, input: { programmeId, number: s.number, title: s.title, description: s.description } })}
                onDelete={() => setDeleting({ table: 'semesters', id: s.id, name: `${t('entities.semester')} ${s.number} — ${l(s.title)}`, entity: 'semester' })}
                onAddCourse={() => newCourse(s.id)}
                onEditCourse={(c) => setCourseForm({ id: c.id, input: courseToInput(c) })}
                onArchiveCourse={(c) => void toggleArchive('courses', c.id, c.status)}
                onDeleteCourse={(c) => setDeleting({ table: 'courses', id: c.id, name: `${c.code} — ${l(c.title)}`, entity: 'course', status: c.status })}
              />
            ))}
          </div>
        </>
      )}

      {semesterForm && programme && (
        <SemesterForm id={semesterForm.id} total={programme.totalSemesters} initial={semesterForm.input} onClose={() => setSemesterForm(null)} />
      )}
      {courseForm && programmeId && <CourseForm id={courseForm.id} programmeId={programmeId} initial={courseForm.input} onClose={() => setCourseForm(null)} />}
      <DeleteDialog target={deleting} onClose={() => setDeleting(null)} />
    </>
  );
}

function SemesterCard({
  semester,
  courses,
  prereqs,
  onEdit,
  onDelete,
  onAddCourse,
  onEditCourse,
  onArchiveCourse,
  onDeleteCourse,
}: {
  semester: Semester;
  courses: Course[];
  prereqs: Map<string, string[]>;
  onEdit: () => void;
  onDelete: () => void;
  onAddCourse: () => void;
  onEditCourse: (c: Course) => void;
  onArchiveCourse: (c: Course) => void;
  onDeleteCourse: (c: Course) => void;
}) {
  const { t, l } = useI18n();
  const credits = courses.filter((c) => c.status !== 'archived').reduce((n, c) => n + c.creditHours, 0);
  const label = `${t('entities.semester')} ${semester.number} — ${l(semester.title)}`;
  return (
    <Card className="p-0" data-testid={`semester-${semester.number}`}>
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">{semester.number}</span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{l(semester.title)}</h2>
          <p className="text-xs text-muted">{t('university.semesters.credits', { count: credits })}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <Button size="sm" variant="secondary" onClick={onAddCourse} icon={<Plus className="h-4 w-4" />}>
            <span className="hidden sm:inline">{t('university.courses.add')}</span>
          </Button>
          <Button size="icon" variant="ghost" onClick={onEdit} aria-label={`${t('university.common.edit')}: ${label}`} title={t('university.common.edit')} icon={<Pencil className="h-4 w-4" />} />
          <Button size="icon" variant="ghost" onClick={onDelete} aria-label={`${t('university.common.delete')}: ${label}`} title={t('university.common.delete')} icon={<Trash2 className="h-4 w-4" />} />
        </div>
      </div>
      {courses.length === 0 ? (
        <p className="px-4 py-4 text-sm text-muted">{t('university.semesters.emptySemester')}</p>
      ) : (
        <ul className="divide-y divide-border">
          {courses.map((c) => {
            const pre = prereqs.get(c.id) ?? [];
            return (
              <li key={c.id} className={c.status === 'archived' ? 'flex items-start gap-3 px-4 py-3 opacity-70' : 'flex items-start gap-3 px-4 py-3'}>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CodeTag>{c.code}</CodeTag>
                    <span className="font-medium">{l(c.title)}</span>
                    {c.status !== 'active' && <StatusBadge status={c.status} />}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span>{t('university.semesters.credits', { count: c.creditHours })}</span>
                    <Badge>{t(`difficulty.${c.difficulty}`)}</Badge>
                    {pre.length > 0 && (
                      <span className="inline-flex items-center gap-1" data-testid={`prereqs-${c.code}`}>
                        <Link2 className="h-3 w-3" aria-hidden />
                        {t('university.courses.prerequisites')}: {pre.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <RowActions
                  name={`${c.code} ${l(c.title)}`}
                  status={c.status}
                  onEdit={() => onEditCourse(c)}
                  onToggleArchive={() => onArchiveCourse(c)}
                  onDelete={() => onDeleteCourse(c)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function SemesterForm({ id, total, initial, onClose }: { id?: string; total: number; initial: SemesterInput; onClose: () => void }) {
  const { t } = useI18n();
  const run = useRunner();
  const [value, setValue] = useState<SemesterInput>(initial);
  const { errors, setErrors } = useFieldErrors();
  const msg = useFieldMessage(errors);
  const [busy, setBusy] = useState(false);
  const entity = t('entities.semester');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await run(() => (id ? updateSemester(db, id, value) : createSemester(db, value)), {
      success: t(id ? 'university.common.updated' : 'university.common.created', { entity }),
      onFieldErrors: setErrors,
    });
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <Modal
      open
      title={t(id ? 'university.semesters.formEdit' : 'university.semesters.formNew')}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="semester-form" loading={busy}>
            {t(id ? 'university.common.save' : 'university.common.create')}
          </Button>
        </>
      }
    >
      <form id="semester-form" onSubmit={submit} noValidate className="space-y-5">
        <Field label={t('university.semesters.number')} hint={t('university.semesters.numberHint', { total })} error={msg('number')}>
          {(p) => (
            <Input
              id={p.id}
              aria-describedby={p.describedBy}
              invalid={p.invalid}
              type="number"
              inputMode="numeric"
              min={1}
              max={Math.min(total, MAX_SEMESTERS)}
              value={Number.isFinite(value.number) ? value.number : ''}
              onChange={(e) => setValue({ ...value, number: e.target.value === '' ? NaN : Number(e.target.value) })}
            />
          )}
        </Field>
        <LocalizedField label={t('university.common.title')} field="title" required value={value.title} errors={errors} onChange={(title) => setValue({ ...value, title })} />
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
