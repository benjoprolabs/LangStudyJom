import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Printer } from 'lucide-react';
import { db } from '@/db/client';
import { APP_VERSION } from '@/db/backup/backup';
import { LECTURE_TEMPLATE, type Lecture, type Module } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';
import { Blocks, CodeScopeProvider, explainsOf, GlossaryProvider, RichText } from './ContentRenderer';
import { loadCourseBundle, loadLectureBundle, type CourseBundle } from './data';
import { useGlossaryTerms } from './glossary';
import { hasModuleContent } from '@/db/content/module';
import { ModuleMaterials } from './module-view';

/**
 * Print / PDF document (Part H): /print?lecture=ID | ?module=ID | ?course=ID.
 * Rendered outside the app shell (no navigation). "Save as PDF" in the browser's print dialog
 * produces the PDF — fully offline, no server or PDF library involved.
 */
export function PrintPage() {
  const { t, l } = useI18n();
  const [params] = useSearchParams();
  const terms = useGlossaryTerms();
  const lectureId = params.get('lecture');
  const moduleId = params.get('module');
  const courseId = params.get('course');

  const doc = useLiveQuery(async () => {
    if (lectureId) {
      const b = await loadLectureBundle(db, lectureId);
      return b ? { course: b as CourseBundle, items: [{ module: b.module, lecture: b.lecture }], scope: 'lecture' as const } : null;
    }
    const cid = courseId ?? (moduleId ? (await db.modules.get(moduleId))?.courseId : undefined);
    const b = cid ? await loadCourseBundle(db, cid) : undefined;
    if (!b) return null;
    const items = b.modules.filter((m) => !moduleId || m.module.id === moduleId).flatMap((m) => m.lectures.map((lecture) => ({ module: m.module, lecture })));
    return { course: b, items, scope: moduleId ? ('module' as const) : ('course' as const) };
  }, [lectureId, moduleId, courseId]);

  useEffect(() => {
    if (doc) document.title = `${doc.course.course.code} — QHAZE TECH UNIVERSITY`;
  }, [doc]);

  if (doc === null) return <p className="p-8 text-sm">{t('learning.reader.notFound')}</p>;
  if (!doc) return <p className="p-8 text-sm text-muted">{t('common.loading')}</p>;
  const { course, programme } = doc.course;
  const date = new Date().toISOString().slice(0, 10);
  const contentVersion = doc.items.map((i) => i.lecture.contentVersion).find(Boolean) ?? '—';

  return (
    <GlossaryProvider value={{ terms }}>
      <div className="min-h-dvh bg-bg">
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-border bg-surface px-4 py-3" data-print-hide>
          <Link to={doc.scope === 'lecture' ? `/lecture-room?lecture=${lectureId}` : `/library?programme=${programme?.id ?? ''}`}>
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>{t('learning.print.back')}</Button>
          </Link>
          <p className="flex-1 text-sm text-muted">{t('learning.print.toolbar')}</p>
          <Button onClick={() => window.print()} icon={<Printer className="h-4 w-4" />}>{t('learning.print.button')}</Button>
        </div>

        <main className="print-doc mx-auto max-w-3xl px-6 py-8 text-fg" data-testid="print-doc">
          <header className="border-b-4 border-note pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-note">QHAZE TECH UNIVERSITY</p>
            <p className="mt-1 text-sm text-muted">{l(programme?.name)}</p>
            <h1 className="mt-3 text-2xl font-bold">
              <span className="font-mono text-note">{course.code}</span> · {l(course.title)}
            </h1>
            {doc.scope !== 'course' && (
              <p className="mt-1 text-lg">
                {doc.scope === 'lecture'
                  ? `${t('learning.reader.lecture', { n: `${doc.items[0]!.module.order}.${doc.items[0]!.lecture.order}` })}: ${l(doc.items[0]!.lecture.title)}`
                  : `${t('learning.reader.module', { n: doc.items[0]?.module.order ?? '' })}: ${l(doc.items[0]?.module.title)}`}
              </p>
            )}
            <p className="mt-2 text-xs text-muted">{t('learning.print.version', { content: contentVersion, app: APP_VERSION, date })}</p>
          </header>

          {doc.items.length > 1 && (
            <nav className="avoid-break mt-6">
              <h2 className="border-l-4 border-note pl-3 font-bold">{t('learning.print.contents')}</h2>
              <ol className="mt-2 space-y-0.5 text-sm">
                {doc.items.map(({ module, lecture }) => (
                  <li key={lecture.id}><span className="font-mono text-note">{module.order}.{lecture.order}</span> {l(lecture.title)}</li>
                ))}
              </ol>
            </nav>
          )}

          {doc.items.map(({ module, lecture }, i) => {
            // Module and course documents: each module's own materials come before its lectures.
            const firstOfModule = doc.scope !== 'lecture' && (i === 0 || doc.items[i - 1]!.module.id !== module.id);
            return (
              <div key={lecture.id}>
                {firstOfModule && <PrintedModule module={module} courseCode={course.code} breakBefore={i > 0} />}
                <PrintedLecture module={module} lecture={lecture} breakBefore={firstOfModule || i > 0 || doc.items.length > 1} courseCode={course.code} />
              </div>
            );
          })}
        </main>
      </div>
    </GlossaryProvider>
  );
}

function PrintedModule({ module, courseCode, breakBefore }: { module: Module; courseCode: string; breakBefore: boolean }) {
  const { t, l } = useI18n();
  return (
    <section className={breakBefore ? 'page-break mt-10' : 'mt-8'} data-testid="print-module" aria-labelledby={`pm-${module.id}`}>
      <h2 id={`pm-${module.id}`} className="text-xl font-bold">
        <span className="font-mono text-note">{courseCode} · {t('learning.reader.module', { n: module.order })}</span> {l(module.title)}
      </h2>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">{t('learning.module.layerTitle')}</p>
      <div className="mt-4">
        {hasModuleContent(module.sections) ? (
          <ModuleMaterials sections={module.sections} level={3} idPrefix={`pm-${module.order}`} courseCode={courseCode} moduleOrder={module.order} />
        ) : (
          <p className="text-sm italic text-muted" data-testid="print-module-empty">{t('learning.module.emptyTitle')}</p>
        )}
      </div>
    </section>
  );
}

function PrintedLecture({ module, lecture, breakBefore, courseCode }: { module: Module; lecture: Lecture; breakBefore: boolean; courseCode: string }) {
  const { t, l } = useI18n();
  const sections = new Map(lecture.sections.map((s) => [s.kind, s]));
  const codeScope = { scope: `${courseCode} ${module.order}.${lecture.order}`, explains: explainsOf(lecture.sections.flatMap((s) => s.blocks)) };
  return (
    <CodeScopeProvider value={codeScope}>
    <article className={breakBefore ? 'page-break mt-10' : 'mt-8'} data-testid="print-lecture">
      <h2 className="text-xl font-bold">
        <span className="font-mono text-note">{courseCode} {module.order}.{lecture.order}</span> {l(lecture.title)}
      </h2>
      <table className="avoid-break mt-3 w-full text-left text-sm">
        <tbody>
          {[
            ['lecture_information', `${t('learning.reader.lecture', { n: `${module.order}.${lecture.order}` })} · ${l(module.title)}`],
            ['course_information', courseCode],
            ['academic_level', t(`difficulty.${lecture.difficulty}`)],
            ['estimated_duration', t('learning.reader.minutes', { count: lecture.estimatedMinutes })],
          ].map(([kind, value]) => (
            <tr key={kind} className="border-b border-border">
              <th className="w-1/3 py-1 pr-3 font-semibold text-note">{t(`learning.sections.${kind}` as never)}</th>
              <td className="py-1">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {lecture.sections.length === 0 ? (
        <p className="mt-4 text-sm italic text-muted">{t('learning.reader.noContentTitle')}</p>
      ) : (
        LECTURE_TEMPLATE.slice(4).map((kind) => {
          const s = sections.get(kind);
          if (!s) return null;
          return (
            <section key={kind} className="mt-6">
              <h3 className="border-l-4 border-note pl-3 text-base font-bold">{t(`learning.sections.${kind}`)}</h3>
              <div className="mt-2 text-sm">
                {s.notApplicable ? <p className="italic text-muted">{t('learning.reader.notApplicable')}: <RichText text={s.notApplicable} /></p> : <Blocks blocks={s.blocks} interactive={false} />}
              </div>
            </section>
          );
        })
      )}
    </article>
    </CodeScopeProvider>
  );
}
