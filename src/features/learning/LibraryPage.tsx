import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpen, FileCode2, FileDown, PackageOpen, Printer, Search, TriangleAlert } from 'lucide-react';
import { db } from '@/db/client';
import { APP_VERSION } from '@/db/backup/backup';
import { useI18n } from '@/i18n/I18nProvider';
import { downloadBytes, downloadText } from '@/lib/download';
import { createZip } from '@/lib/zip';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input, Select } from '@/components/ui/Field';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlossaryProvider, RichText, useGlossary } from './ContentRenderer';
import { disciplineOfFaculty, evaluateModule, hasModuleContent, lectureCorpus, type Discipline } from '@/db/content/module';
import type { Lecture, Module } from '@/db/types';
import { loadCourseBundle } from './data';
import { MODULE_STATUS_TONE } from './ModulePage';
import { GlossaryScope, useExportLabels } from './glossary';
import { codeFiles, courseMarkdown } from './markdown';

export function LibraryPage() {
  const { t, l } = useI18n();
  const [params, setParams] = useSearchParams();
  const programmes = useLiveQuery(() => db.programmes.orderBy('code').toArray(), []);
  const programmeId = params.get('programme') ?? '';
  const programme = programmes?.find((p) => p.id === programmeId);

  // Which programmes have written lecture content, and whether any lecture content is installed at all.
  const contentStatus = useLiveQuery(async () => {
    const [courses, lectureCount, written] = await Promise.all([
      db.courses.toArray(),
      db.lectures.count(),
      db.lectures.filter((x) => x.sections.length > 0).toArray(),
    ]);
    const programmeOf = new Map(courses.map((c) => [c.id, c.programmeId]));
    return {
      lectureCount,
      writtenCount: written.length,
      programmesWithContent: new Set(written.map((x) => programmeOf.get(x.courseId)).filter(Boolean) as string[]),
    };
  }, []);

  useEffect(() => {
    if (!programmes?.length || programme || !contentStatus) return;
    setParams({ programme: defaultProgrammeId(programmes, contentStatus.programmesWithContent) }, { replace: true });
  }, [programmes, programme, contentStatus, setParams]);

  const discipline = disciplineOfFaculty(
    useLiveQuery(async () => {
      if (!programme) return undefined;
      const academy = await db.academies.get(programme.academyId);
      return academy ? (await db.faculties.get(academy.facultyId))?.code : undefined;
    }, [programme?.id]),
  );

  const contentMissing = Boolean(contentStatus && contentStatus.lectureCount > 0 && contentStatus.writtenCount === 0);

  const data = useLiveQuery(async () => {
    if (!programmeId) return null;
    const [semesters, courses, modules, lectures] = await Promise.all([
      db.semesters.where('programmeId').equals(programmeId).sortBy('number'),
      db.courses.where('programmeId').equals(programmeId).sortBy('code'),
      db.modules.toArray(),
      db.lectures.toArray(),
    ]);
    const ids = new Set(courses.map((c) => c.id));
    return {
      semesters,
      courses,
      modules: modules.filter((m) => ids.has(m.courseId)).sort((a, b) => a.order - b.order),
      lectures: lectures.filter((x) => ids.has(x.courseId)).sort((a, b) => a.order - b.order),
    };
  }, [programmeId]);

  return (
    <GlossaryScope>
      <PageHeader eyebrow={t('nav.groups.learning')} title={t('nav.library')} description={t('learning.library.subtitle')} />
      {programmes && programmes.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-6 w-6" />}>
          <p>{t('learning.library.noCurriculum')}</p>
          <Link to="/faculties" className="font-medium text-accent hover:underline">{t('learning.library.goFaculties')}</Link>
        </EmptyState>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            {contentMissing && (
              <div className="mb-4 rounded-lg border border-warning/50 bg-warning/10 p-4" role="alert" data-testid="content-missing">
                <p className="flex items-start gap-2 font-semibold text-warning">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {t('learning.library.contentMissingTitle')}
                </p>
                <p className="mt-1 text-sm text-muted">{t('learning.library.contentMissingBody')}</p>
                <Link
                  to="/faculties?packages=content"
                  className="mt-3 inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary/90 sm:w-auto"
                  data-testid="install-content-link"
                >
                  <PackageOpen className="h-4 w-4" aria-hidden />
                  {t('learning.library.installContent')}
                </Link>
              </div>
            )}
            <Select aria-label={t('learning.library.programme')} className="mb-4 w-full sm:w-[28rem]" value={programmeId} onChange={(e) => setParams({ programme: e.target.value })}>
              {(programmes ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.code} — {l(p.name)}</option>
              ))}
            </Select>
            {data && (
              <div className="space-y-6" data-testid="library">
                {data.semesters.map((s) => (
                  <section key={s.id} aria-labelledby={`lib-sem-${s.id}`}>
                    <h2 id={`lib-sem-${s.id}`} className="mb-2 border-l-4 border-note pl-3 font-semibold">
                      {t('entities.semester')} {s.number} — {l(s.title)}
                    </h2>
                    <div className="space-y-2">
                      {data.courses.filter((c) => c.semesterId === s.id).map((c) => {
                        const modules = data.modules.filter((m) => m.courseId === c.id);
                        const lectures = data.lectures.filter((x) => x.courseId === c.id);
                        const ready = lectures.filter((x) => x.sections.length > 0).length;
                        return (
                          <details key={c.id} className="group rounded-lg border border-border bg-surface/80" data-testid={`course-${c.code}`}>
                            <summary className="flex cursor-pointer flex-wrap items-center gap-2 px-4 py-3">
                              <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-accent">{c.code}</code>
                              <span className="font-medium">{l(c.title)}</span>
                              <span className="ml-auto text-xs text-muted">{t('learning.library.lecturesReady', { ready, total: lectures.length })}</span>
                            </summary>
                            <div className="border-t border-border px-4 py-3">
                              <CourseActions courseId={c.id} code={c.code} />
                              <ol className="mt-3 space-y-3">
                                {modules.map((m) => (
                                  <li key={m.id}>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Link to={`/module?module=${m.id}`} className="text-sm font-semibold text-fg hover:text-accent hover:underline" data-testid={`module-link-${c.code}-${m.order}`}>
                                        {t('learning.reader.module', { n: m.order })} · {l(m.title)}
                                      </Link>
                                      <LibraryModuleStatus module={m} courseLectures={lectures} courseModules={modules} discipline={discipline} />
                                      <CourseActions courseId={c.id} code={c.code} moduleId={m.id} moduleOrder={m.order} />
                                    </div>
                                    <ol className="mt-1 space-y-1">
                                      {lectures.filter((x) => x.moduleId === m.id).map((x) => (
                                        <li key={x.id} className="flex flex-wrap items-center gap-2 text-sm">
                                          <span className="w-8 font-mono text-xs text-muted">{m.order}.{x.order}</span>
                                          <Link to={`/lecture-room?lecture=${x.id}`} className="hover:text-accent hover:underline">{l(x.title)}</Link>
                                          {x.sections.length > 0 ? <Badge tone="success">{t('learning.library.contentReady')}</Badge> : <Badge tone="warning">{t('learning.library.structureOnly')}</Badge>}
                                          <span className="ml-auto text-xs text-muted">{t('learning.reader.minutes', { count: x.estimatedMinutes })}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </details>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
          <GlossaryList />
        </div>
      )}
    </GlossaryScope>
  );
}

/** Course- or module-level downloads: Markdown, print/PDF and (course only) source code. */
function CourseActions({ courseId, code, moduleId, moduleOrder }: { courseId: string; code: string; moduleId?: string; moduleOrder?: number }) {
  const { t, lang } = useI18n();
  const labels = useExportLabels();
  const { terms } = useGlossary();
  const meta = { app: APP_VERSION, date: new Date().toISOString().slice(0, 10) };
  const [busy, setBusy] = useState(false);
  const base = moduleOrder ? `${code}-M${moduleOrder}` : code;

  const md = async () => {
    setBusy(true);
    const bundle = await loadCourseBundle(db, courseId);
    if (bundle) downloadText(`${base}.md`, courseMarkdown(bundle, lang, terms, labels, meta, moduleId), 'text/markdown');
    setBusy(false);
  };
  const zip = async () => {
    const bundle = await loadCourseBundle(db, courseId);
    if (!bundle) return;
    const lectures = bundle.modules.flatMap((m) => m.lectures.map((lecture) => ({ prefix: `M${m.module.order}/${m.module.order}_${lecture.order}-`, lecture })));
    downloadBytes(`${base}-code.zip`, createZip(codeFiles(lectures, lang, labels)));
  };
  return (
    <div className={moduleId ? 'ml-auto flex gap-1' : 'flex flex-wrap gap-2'}>
      <Button size="sm" variant="ghost" onClick={md} loading={busy} icon={<FileDown className="h-4 w-4" />}>
        {moduleId ? t('learning.library.downloadModuleMd') : t('learning.library.downloadCourseMd')}
      </Button>
      <Link to={moduleId ? `/print?module=${moduleId}` : `/print?course=${courseId}`}>
        <Button size="sm" variant="ghost" icon={<Printer className="h-4 w-4" />}>{moduleId ? t('learning.library.printModule') : t('learning.library.printCourse')}</Button>
      </Link>
      {!moduleId && <Button size="sm" variant="ghost" onClick={zip} icon={<FileCode2 className="h-4 w-4" />}>{t('learning.library.courseCode')}</Button>}
    </div>
  );
}

function GlossaryList() {
  const { t, l } = useI18n();
  const { terms, open } = useGlossary();
  const [query, setQuery] = useState('');
  const list = [...terms.values()]
    .filter((g) => `${g.term} ${g.translation} ${l(g.definition)}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.term.localeCompare(b.term));
  return (
    <aside aria-labelledby="glossary-title">
      <Card className="xl:sticky xl:top-20">
        <h2 id="glossary-title" className="font-semibold">{t('learning.library.glossary')}</h2>
        <p className="mb-3 mt-1 text-xs text-muted">{t('learning.library.glossaryHint')}</p>
        {terms.size === 0 ? (
          <p className="text-sm text-muted">{t('learning.library.noGlossary')}</p>
        ) : (
          <>
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('learning.library.searchGlossary')} aria-label={t('learning.library.searchGlossary')} className="pl-9" />
            </div>
            <ul className="max-h-[60vh] space-y-1 overflow-y-auto" data-testid="glossary-list">
              {list.map((g) => (
                <li key={g.key}>
                  <button type="button" onClick={() => open?.(g.key)} className="w-full rounded px-2 py-1.5 text-left hover:bg-surface-2" data-term={g.key}>
                    <span className="font-medium text-note">{g.term}</span> <span className="text-xs text-muted">· {g.translation}</span>
                    {/* No nested buttons: terms inside the preview render as highlighted text. */}
                    <GlossaryProvider value={{ terms }}>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted"><RichText text={g.definition} /></span>
                    </GlossaryProvider>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </aside>
  );
}

/** The programme the Library opens on: LUA-PROG when it has written lectures, else the first programme with content, else the first. */
export function defaultProgrammeId(programmes: { id: string; code: string }[], withContent: Set<string>): string {
  const lua = programmes.find((p) => p.code === 'LUA-PROG');
  if (lua && withContent.has(lua.id)) return lua.id;
  return (programmes.find((p) => withContent.has(p.id)) ?? programmes[0]!).id;
}

/** The module's own content status (same rule as the module page, including the no-copying check). */
function LibraryModuleStatus({ module, courseLectures, courseModules, discipline }: { module: Module; courseLectures: Lecture[]; courseModules: Module[]; discipline: Discipline }) {
  const { t } = useI18n();
  const { terms } = useGlossary();
  const status = useMemo(() => {
    if (!hasModuleContent(module.sections)) return 'not_written' as const;
    const order = new Map(courseModules.map((m) => [m.id, m.order]));
    const corpus = lectureCorpus(courseLectures.map((x) => ({ order: x.order, module: order.get(x.moduleId), sections: x.sections })));
    return evaluateModule(module.sections, { discipline, glossaryKeys: terms.size ? new Set(terms.keys()) : undefined, corpus }).status;
  }, [module.sections, courseLectures, courseModules, discipline, terms]);
  return (
    <span data-testid="module-status-badge" data-status={status}>
      <Badge tone={MODULE_STATUS_TONE[status]}>{t('learning.module.statusLabel')}: {t(`learning.module.status.${status}` as 'learning.module.status.complete')}</Badge>
    </span>
  );
}
