import { useState, type FormEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link2, Plus, Trash2 } from 'lucide-react';
import { db } from '@/db/client';
import { addPrerequisite, createCourse, removePrerequisite, updateCourse, type CourseInput } from '@/db/repositories/university';
import { DIFFICULTY_LEVELS, type Course, type Reference } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { LocalizedField, LocalizedListField } from '@/components/ui/LocalizedField';
import { Modal } from '@/components/ui/Modal';
import { CodeOrderStatus, useFieldMessage } from './CommonFields';
import { CodeTag, useFieldErrors, useRunner } from './shared';

export const courseToInput = (c: Course): CourseInput => ({
  semesterId: c.semesterId,
  code: c.code,
  title: c.title,
  description: c.description,
  creditHours: c.creditHours,
  difficulty: c.difficulty,
  learningObjectives: c.learningObjectives,
  references: c.references,
  status: c.status,
});

export function CourseForm({
  id,
  programmeId,
  initial,
  onClose,
}: {
  id?: string;
  programmeId: string;
  initial: CourseInput;
  onClose: () => void;
}) {
  const { t, l } = useI18n();
  const run = useRunner();
  const semesters = useLiveQuery(() => db.semesters.where('programmeId').equals(programmeId).sortBy('number'), [programmeId]);
  const [value, setValue] = useState<CourseInput>(initial);
  const { errors, setErrors } = useFieldErrors();
  const msg = useFieldMessage(errors);
  const [busy, setBusy] = useState(false);
  const entity = t('entities.course');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await run(() => (id ? updateCourse(db, id, value) : createCourse(db, value)), {
      success: t(id ? 'university.common.updated' : 'university.common.created', { entity }),
      onFieldErrors: setErrors,
    });
    setBusy(false);
    if (ok) onClose();
  };

  const refs = value.references ?? [];
  const setRef = (i: number, patch: Partial<Reference>) => setValue({ ...value, references: refs.map((r, j) => (j === i ? { ...r, ...patch } : r)) });

  return (
    <Modal
      open
      size="lg"
      title={t(id ? 'university.courses.formEdit' : 'university.courses.formNew')}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="course-form" loading={busy}>
            {t(id ? 'university.common.save' : 'university.common.create')}
          </Button>
        </>
      }
    >
      <form id="course-form" onSubmit={submit} noValidate className="space-y-5">
        <Field label={t('university.courses.semester')} hint={t('university.courses.semesterHint')} error={msg('semesterId')}>
          {(p) => (
            <Select id={p.id} aria-describedby={p.describedBy} value={value.semesterId} onChange={(e) => setValue({ ...value, semesterId: e.target.value })}>
              {(semesters ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {t('entities.semester')} {s.number} — {l(s.title)}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <CodeOrderStatus code={value.code} status={value.status ?? 'active'} showOrder={false} errors={errors} onChange={(p) => setValue({ ...value, ...p })} />
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('university.courses.creditHours')} error={msg('creditHours')}>
            {(p) => (
              <Input
                id={p.id}
                aria-describedby={p.describedBy}
                invalid={p.invalid}
                type="number"
                inputMode="numeric"
                min={0}
                max={30}
                value={Number.isFinite(value.creditHours) ? value.creditHours : ''}
                onChange={(e) => setValue({ ...value, creditHours: e.target.value === '' ? NaN : Number(e.target.value) })}
              />
            )}
          </Field>
          <Field label={t('university.courses.difficulty')} error={msg('difficulty')}>
            {(p) => (
              <Select id={p.id} value={value.difficulty} onChange={(e) => setValue({ ...value, difficulty: e.target.value as CourseInput['difficulty'] })}>
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
          label={t('university.courses.learningObjectives')}
          hint={t('university.courses.learningObjectivesHint')}
          field="learningObjectives"
          items={value.learningObjectives ?? []}
          errors={errors}
          onChange={(learningObjectives) => setValue({ ...value, learningObjectives })}
        />

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">{t('university.courses.references')}</legend>
          <ol className="space-y-2">
            {refs.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2.5 w-5 shrink-0 text-right text-xs text-muted">{i + 1}.</span>
                <div className="grid flex-1 gap-2 sm:grid-cols-3">
                  <div>
                    <Input
                      value={r.title}
                      onChange={(e) => setRef(i, { title: e.target.value })}
                      invalid={Boolean(errors[`references.${i}`])}
                      aria-label={`${t('university.courses.referenceTitle')} ${i + 1}`}
                      placeholder={t('university.courses.referenceTitle')}
                    />
                    {msg(`references.${i}`) && <span className="mt-1 block text-xs text-danger">{msg(`references.${i}`)}</span>}
                  </div>
                  <Input value={r.author ?? ''} onChange={(e) => setRef(i, { author: e.target.value || undefined })} aria-label={`${t('university.courses.referenceAuthor')} ${i + 1}`} placeholder={t('university.courses.referenceAuthor')} />
                  <Input value={r.url ?? ''} type="url" onChange={(e) => setRef(i, { url: e.target.value || undefined })} aria-label={`${t('university.courses.referenceUrl')} ${i + 1}`} placeholder="https://" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setValue({ ...value, references: refs.filter((_, j) => j !== i) })}
                  aria-label={t('university.common.removeItem', { n: i + 1 })}
                  icon={<Trash2 className="h-4 w-4" />}
                />
              </li>
            ))}
          </ol>
          <Button variant="outline" size="sm" onClick={() => setValue({ ...value, references: [...refs, { title: '' }] })} icon={<Plus className="h-4 w-4" />}>
            {t('university.common.addItem')}
          </Button>
        </fieldset>
      </form>

      <div className="mt-6 border-t border-border pt-5">{id ? <PrerequisiteManager courseId={id} /> : <p className="text-sm text-muted">{t('university.courses.saveFirst')}</p>}</div>
    </Modal>
  );
}

/** Prerequisite links are saved immediately (each one is validated, including cycle detection). */
function PrerequisiteManager({ courseId }: { courseId: string }) {
  const { t, l } = useI18n();
  const run = useRunner();
  const [selected, setSelected] = useState('');
  const [kind, setKind] = useState<'required' | 'recommended'>('required');
  const data = useLiveQuery(async () => {
    const [links, requiredBy, courses, programmes] = await Promise.all([
      db.coursePrerequisites.where('courseId').equals(courseId).toArray(),
      db.coursePrerequisites.where('prerequisiteCourseId').equals(courseId).toArray(),
      db.courses.orderBy('code').toArray(),
      db.programmes.toArray(),
    ]);
    return { links, requiredBy, courses, programmes };
  }, [courseId]);
  if (!data) return null;

  const byId = new Map(data.courses.map((c) => [c.id, c]));
  const linked = new Set(data.links.map((p) => p.prerequisiteCourseId));
  const candidates = data.courses.filter((c) => c.id !== courseId && !linked.has(c.id));
  const groups = data.programmes
    .map((p) => ({ programme: p, courses: candidates.filter((c) => c.programmeId === p.id) }))
    .filter((g) => g.courses.length > 0);

  const add = async () => {
    if (!selected) return;
    const ok = await run(() => addPrerequisite(db, courseId, selected, kind), { success: t('university.courses.prerequisiteAdded') });
    if (ok) setSelected('');
  };

  return (
    <section aria-labelledby="prereq-title" className="space-y-3" data-testid="prerequisites">
      <div>
        <h3 id="prereq-title" className="flex items-center gap-2 text-sm font-semibold">
          <Link2 className="h-4 w-4 text-accent" aria-hidden />
          {t('university.courses.prerequisites')}
        </h3>
        <p className="mt-1 text-xs text-muted">{t('university.courses.prerequisitesHint')}</p>
      </div>
      {data.links.length === 0 ? (
        <p className="text-sm text-muted">{t('university.courses.noPrerequisites')}</p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {data.links.map((link) => {
            const c = byId.get(link.prerequisiteCourseId);
            return (
              <li key={link.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                <CodeTag>{c?.code ?? '?'}</CodeTag>
                <span className="min-w-0 flex-1 truncate">{c ? l(c.title) : ''}</span>
                <Badge tone={link.kind === 'required' ? 'primary' : 'neutral'}>
                  {t(link.kind === 'required' ? 'university.courses.kindRequired' : 'university.courses.kindRecommended')}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    void run(
                      async () => {
                        await removePrerequisite(db, link.id);
                        return true;
                      },
                      { success: t('university.courses.prerequisiteRemoved') },
                    )
                  }
                  aria-label={`${t('university.common.delete')}: ${c?.code ?? ''}`}
                  icon={<Trash2 className="h-4 w-4" />}
                />
              </li>
            );
          })}
        </ul>
      )}
      {data.requiredBy.length > 0 && (
        <p className="text-xs text-muted">
          {t('university.courses.requiredBy', { list: data.requiredBy.map((r) => byId.get(r.courseId)?.code ?? '?').join(', ') })}
        </p>
      )}
      {candidates.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select aria-label={t('university.courses.selectCourse')} value={selected} onChange={(e) => setSelected(e.target.value)} className="sm:flex-1">
            <option value="">{t('university.courses.selectCourse')}</option>
            {groups.map(({ programme, courses }) => (
              <optgroup key={programme.id} label={`${programme.code} — ${l(programme.name)}`}>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {l(c.title)}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
          <Select aria-label={t('university.courses.prerequisites')} value={kind} onChange={(e) => setKind(e.target.value as 'required' | 'recommended')} className="sm:w-40">
            <option value="required">{t('university.courses.kindRequired')}</option>
            <option value="recommended">{t('university.courses.kindRecommended')}</option>
          </Select>
          <Button variant="secondary" onClick={add} disabled={!selected} icon={<Plus className="h-4 w-4" />}>
            {t('university.courses.addPrerequisite')}
          </Button>
        </div>
      )}
    </section>
  );
}
