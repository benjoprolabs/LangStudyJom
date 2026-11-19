import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FileDown, Layers, PencilLine, Printer, Save, TriangleAlert } from 'lucide-react';
import { db } from '@/db/client';
import { APP_VERSION } from '@/db/backup/backup';
import type { ModuleContentStatus } from '@/db/content/module';
import { saveModuleContent } from '@/db/repositories/modules';
import { MODULE_SECTIONS, type ModuleSection, type ModuleSectionKind } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import { downloadText } from '@/lib/download';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Textarea } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { useGlossary } from './ContentRenderer';
import { loadModuleBundle, type ModuleBundle } from './data';
import { GlossaryScope, useExportLabels } from './glossary';
import { courseMarkdown } from './markdown';
import { ModuleMaterials, sectionLabel, useModuleEvaluation, useProblemText } from './module-view';

export const MODULE_STATUS_TONE: Record<ModuleContentStatus, 'neutral' | 'warning' | 'accent' | 'success'> = {
  not_written: 'neutral',
  partial: 'warning',
  needs_verification: 'accent',
  complete: 'success',
};

/** Module Learning Page: the module's own materials (module layer), then its lectures (lecture layer). */
export function ModulePage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const moduleId = params.get('module') ?? '';
  const bundle = useLiveQuery(async () => (moduleId ? ((await loadModuleBundle(db, moduleId)) ?? null) : null), [moduleId]);
  if (bundle === null) return <EmptyState icon={<Layers className="h-6 w-6" />}><p>{t('learning.module.notFound')}</p><Link to="/library" className="font-medium text-accent hover:underline">{t('learning.reader.goLibrary')}</Link></EmptyState>;
  if (!bundle) return <p className="text-sm text-muted">{t('common.loading')}</p>;
  return (
    <GlossaryScope>
      <ModuleView key={bundle.module.id} bundle={bundle} />
    </GlossaryScope>
  );
}

function ModuleView({ bundle }: { bundle: ModuleBundle }) {
  const { t, l, formatDate, lang } = useI18n();
  const { terms } = useGlossary();
  const labels = useExportLabels();
  const [editing, setEditing] = useState(false);
  const { module, lectures, course, programme } = bundle;
  const { status, problems, discipline } = useModuleEvaluation(bundle, module.sections, bundle.facultyCode);
  const problemText = useProblemText();
  const written = new Set((module.sections ?? []).filter((s) => s.body.ms?.trim() || s.body.en?.trim()).map((s) => s.kind));
  const missing = MODULE_SECTIONS.filter((k) => !written.has(k));
  const ready = lectures.filter((x) => x.sections.length > 0).length;

  const downloadMd = () => {
    const md = courseMarkdown(bundle, lang, terms, labels, { app: APP_VERSION, date: new Date().toISOString().slice(0, 10) }, module.id);
    downloadText(`${course.code}-M${module.order}.md`, md, 'text/markdown');
  };

  return (
    <div className="space-y-8" data-testid="module-page">
      <header>
        <nav className="mb-2 text-xs text-muted" aria-label="breadcrumb">
          <Link to={`/library?programme=${programme?.id ?? ''}`} className="hover:underline">{l(programme?.name)}</Link>
          {' › '}
          <span className="font-mono">{course.code}</span> {l(course.title)}
        </nav>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">{t('learning.module.eyebrow', { n: module.order, course: course.code })}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{l(module.title)}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span data-testid="module-status" data-status={status}>
            <Badge tone={MODULE_STATUS_TONE[status]}>{t('learning.module.statusLabel')}: {t(`learning.module.status.${status}` as 'learning.module.status.complete')}</Badge>
          </span>
          <Badge tone={ready === lectures.length && lectures.length ? 'success' : 'warning'}>{t('learning.module.lecturesReady', { ready, total: lectures.length })}</Badge>
          <Badge>{t(`learning.module.discipline.${discipline}` as 'learning.module.discipline.programming')}</Badge>
        </div>
        <p className="mt-2 text-sm text-muted">{t(`learning.module.statusHint.${status}` as 'learning.module.statusHint.complete')}</p>
        {module.contentUpdatedAt && <p className="mt-1 text-xs text-muted">{t('learning.module.updated', { date: formatDate(module.contentUpdatedAt, true) })}</p>}
        <div className="mt-4 flex flex-wrap gap-2" data-print-hide>
          {!editing && (
            <Button size="sm" variant={status === 'not_written' ? 'primary' : 'secondary'} onClick={() => setEditing(true)} icon={<PencilLine className="h-4 w-4" />} data-testid="module-edit">
              {status === 'not_written' ? t('learning.module.write') : t('learning.module.edit')}
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={downloadMd} icon={<FileDown className="h-4 w-4" />}>{t('learning.library.downloadModuleMd')}</Button>
          <Link to={`/print?module=${module.id}`}>
            <Button size="sm" variant="outline" icon={<Printer className="h-4 w-4" />}>{t('learning.library.printModule')}</Button>
          </Link>
        </div>
      </header>

      {/* ── Layer 1: the module's own learning materials ── */}
      <section className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4 sm:p-6" aria-labelledby="module-layer-title" data-testid="module-content">
        <h2 id="module-layer-title" className="flex items-center gap-2 text-xl font-bold">
          <Layers className="h-5 w-5 text-primary" aria-hidden />
          {t('learning.module.layerTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted">{t('learning.module.layerIntro')}</p>
        <div className="mt-5">
          {editing ? (
            <ModuleEditor bundle={bundle} onDone={() => setEditing(false)} />
          ) : status === 'not_written' ? (
            <div data-testid="module-empty">
              <EmptyState icon={<Layers className="h-6 w-6" />}>
                <p className="font-semibold text-fg">{t('learning.module.emptyTitle')}</p>
                <p className="max-w-xl">{t('learning.module.emptyBody')}</p>
              </EmptyState>
            </div>
          ) : (
            <>
              <ModuleMaterials sections={module.sections} />
              {missing.length > 0 && (
                <p className="mt-6 rounded-lg border border-dashed border-border p-3 text-sm text-muted" data-testid="module-missing">
                  {t('learning.module.missingSections', { list: missing.map((k) => sectionLabel(t, k)).join(' · ') })}
                </p>
              )}
              <QualityCheck problems={problems.map(problemText)} />
            </>
          )}
        </div>
      </section>

      {/* ── Layer 2: the lectures, each with its own content ── */}
      <section className="rounded-xl border border-note/40 bg-surface/70 p-4 sm:p-6" aria-labelledby="module-lectures-title" data-testid="module-lectures">
        <h2 id="module-lectures-title" className="flex items-center gap-2 text-xl font-bold">
          <BookOpen className="h-5 w-5 text-note" aria-hidden />
          {t('learning.module.lecturesTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted">{t('learning.module.lecturesIntro')}</p>
        <ol className="mt-4 divide-y divide-border">
          {lectures.map((x) => (
            <li key={x.id} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 py-3 sm:flex sm:items-center">
              <span className="font-mono text-sm text-note sm:w-10 sm:shrink-0">{module.order}.{x.order}</span>
              <Link to={`/lecture-room?lecture=${x.id}`} className="min-w-0 font-medium hover:text-accent hover:underline sm:flex-1" data-testid="module-lecture-link">
                {l(x.title)}
              </Link>
              <span className="col-start-2 flex flex-wrap items-center gap-2 text-xs text-muted sm:ml-auto">
                {t('learning.reader.minutes', { count: x.estimatedMinutes })}
                {x.sections.length > 0 ? <Badge tone="success">{t('learning.library.contentReady')}</Badge> : <Badge tone="warning">{t('learning.library.structureOnly')}</Badge>}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <nav className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-between" aria-label={t('learning.module.layerTitle')}>
        {bundle.prevModule ? (
          <Link to={`/module?module=${bundle.prevModule.id}`} className="inline-flex min-h-[2.75rem] items-center gap-2 text-sm text-accent hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {t('learning.module.prev')}: {l(bundle.prevModule.title)}
          </Link>
        ) : <span />}
        {bundle.nextModule && (
          <Link to={`/module?module=${bundle.nextModule.id}`} className="inline-flex min-h-[2.75rem] items-center gap-2 text-sm text-accent hover:underline sm:text-right">
            {t('learning.module.next')}: {l(bundle.nextModule.title)}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </nav>
    </div>
  );
}

function QualityCheck({ problems }: { problems: string[] }) {
  const { t } = useI18n();
  return (
    <details className="mt-6 rounded-lg border border-border bg-bg/40 p-3 text-sm" data-testid="module-quality" open={problems.length <= 6}>
      <summary className="flex cursor-pointer items-center gap-2 font-semibold">
        {problems.length ? <TriangleAlert className="h-4 w-4 text-warning" aria-hidden /> : <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />}
        {t('learning.module.quality', { count: problems.length })}
      </summary>
      {problems.length ? (
        <ul className="mt-2 list-disc space-y-1 pl-6 text-warning" data-testid="module-problems">
          {problems.map((p) => <li key={p}>{p}</li>)}
        </ul>
      ) : (
        <p className="mt-2 text-success">{t('learning.module.qualityOk')}</p>
      )}
    </details>
  );
}

type Draft = Record<ModuleSectionKind, { ms: string; en: string }>;

function ModuleEditor({ bundle, onDone }: { bundle: ModuleBundle; onDone: () => void }) {
  const { t } = useI18n();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => {
    const byKind = new Map((bundle.module.sections ?? []).map((s) => [s.kind, s]));
    return Object.fromEntries(MODULE_SECTIONS.map((k) => [k, { ms: byKind.get(k)?.body.ms ?? '', en: byKind.get(k)?.body.en ?? '' }])) as Draft;
  });
  const sections: ModuleSection[] = useMemo(() => MODULE_SECTIONS.map((kind) => ({ kind, body: draft[kind] })), [draft]);
  const { problems, discipline } = useModuleEvaluation(bundle, sections, bundle.facultyCode);
  const problemText = useProblemText();
  const set = (kind: ModuleSectionKind, lang: 'ms' | 'en', value: string) => setDraft((d) => ({ ...d, [kind]: { ...d[kind], [lang]: value } }));

  const save = async () => {
    setBusy(true);
    try {
      await saveModuleContent(db, bundle.module.id, sections);
      toast.success(t('learning.module.saved'));
      onDone();
    } catch {
      toast.error(t('learning.module.saveFailed'));
    } finally {
      setBusy(false);
    }
  };

  const hint = (kind: ModuleSectionKind) =>
    kind === 'examples'
      ? t(`learning.module.examplesHint.${discipline}` as 'learning.module.examplesHint.programming')
      : t(`learning.module.hints.${kind}` as 'learning.module.hints.module_overview');
  const big: ModuleSectionKind[] = ['core_theory', 'learning_notes', 'examples'];

  return (
    <div className="space-y-6" data-testid="module-editor">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold"><PencilLine className="h-4 w-4" aria-hidden />{t('learning.module.editorTitle')}</h3>
        <p className="mt-1 text-sm text-muted">{t('learning.module.editorIntro')}</p>
        <p className="mt-2 rounded-md bg-surface-2 p-2 font-mono text-xs text-muted"><span className="font-sans font-semibold">{t('learning.module.formatHelpTitle')}:</span> {t('learning.module.formatHelp')}</p>
      </div>
      {MODULE_SECTIONS.map((kind, i) => (
        <fieldset key={kind} className="rounded-lg border border-border bg-bg/40 p-3 sm:p-4" data-editor-section={kind}>
          <legend className="px-1 font-semibold"><span className="mr-1 font-mono text-sm text-muted">{i + 1}.</span>{sectionLabel(t, kind)}</legend>
          <p className="mb-3 text-xs text-muted">{hint(kind)}</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {(['ms', 'en'] as const).map((lang) => (
              <label key={lang} className="block space-y-1">
                <span className="text-xs font-medium">{lang === 'ms' ? t('learning.module.langMs') : t('learning.module.langEn')}</span>
                <Textarea
                  aria-label={`${sectionLabel(t, kind)} — ${lang === 'ms' ? t('learning.module.langMs') : t('learning.module.langEn')}`}
                  rows={big.includes(kind) ? 10 : 5}
                  className="py-2 font-mono text-[13px] leading-relaxed"
                  value={draft[kind][lang]}
                  onChange={(e) => set(kind, lang, e.target.value)}
                  spellCheck
                />
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <QualityCheck problems={problems.map(problemText)} />
      <div className="sticky bottom-0 -mx-4 flex flex-wrap justify-end gap-2 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <Button variant="ghost" onClick={onDone} disabled={busy}>{t('common.cancel')}</Button>
        <Button onClick={() => void save()} loading={busy} icon={<Save className="h-4 w-4" />} data-testid="module-save">{t('learning.module.save')}</Button>
      </div>
    </div>
  );
}
