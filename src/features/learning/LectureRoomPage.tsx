import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, CheckCircle2, Download, Dumbbell, FileCode2, FileDown, NotebookPen, Printer } from 'lucide-react';
import { db } from '@/db/client';
import { completeLecture, getLectureNote, recordReading, saveLectureNote, toggleBookmark } from '@/db/repositories/learning';
import { APP_VERSION } from '@/db/backup/backup';
import { LECTURE_TEMPLATE, type LectureSectionKind } from '@/db/types';
import { useAutosave } from '@/hooks/useAutosave';
import { useStudent } from '@/hooks/useStudent';
import { useI18n } from '@/i18n/I18nProvider';
import { downloadBytes, downloadText } from '@/lib/download';
import { createZip } from '@/lib/zip';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Textarea } from '@/components/ui/Field';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useToast } from '@/components/ui/Toast';
import { SaveIndicator } from '@/features/profile/ProfilePage';
import { Blocks, RichText, SectionHeading } from './ContentRenderer';
import { loadLectureBundle, type LectureBundle } from './data';
import { GlossaryScope, useExportLabels, useGlossaryTerms } from './glossary';
import { codeFiles, lectureMarkdown, notesMarkdown } from './markdown';

const anchor = (kind: LectureSectionKind) => `sec-${kind}`;
const scrollTo = (kind: LectureSectionKind) => document.getElementById(anchor(kind))?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export function LectureRoomPage() {
  const { t } = useI18n();
  const student = useStudent();
  const [params] = useSearchParams();
  const requested = params.get('lecture');
  // Without ?lecture=, resume the most recently read lecture.
  const lastRead = useLiveQuery(async () => {
    if (requested || !student) return null;
    const rows = await db.progress.where('studentId').equals(student.id).filter((p) => p.entityType === 'lecture').toArray();
    return rows.sort((a, b) => (b.lastAccessedAt ?? '').localeCompare(a.lastAccessedAt ?? ''))[0]?.entityId ?? null;
  }, [requested, student?.id]);
  const lectureId = requested ?? lastRead ?? null;
  const bundle = useLiveQuery(async () => (lectureId ? ((await loadLectureBundle(db, lectureId)) ?? null) : null), [lectureId]);

  if (!lectureId || bundle === null) {
    return (
      <EmptyState>
        <p>{lectureId ? t('learning.reader.notFound') : t('learning.reader.chooseLecture')}</p>
        <Link to="/library" className="font-medium text-accent hover:underline">{t('learning.reader.goLibrary')}</Link>
      </EmptyState>
    );
  }
  if (!bundle || !student) return <p className="text-sm text-muted">{t('common.loading')}</p>;
  return (
    <GlossaryScope>
      <Reader key={bundle.lecture.id} bundle={bundle} studentId={student.id} />
    </GlossaryScope>
  );
}

function Reader({ bundle, studentId }: { bundle: LectureBundle; studentId: string }) {
  const { t, l, lang } = useI18n();
  const toast = useToast();
  const labels = useExportLabels();
  const glossary = useGlossaryTerms();
  const { lecture, course, programme, module } = bundle;
  const hasContent = lecture.sections.length > 0;
  const lectureId = lecture.id;

  // null = loaded and no record yet; undefined = still loading.
  const progress = useLiveQuery(async () => (await db.progress.where('[studentId+entityType+entityId]').equals([studentId, 'lecture', lectureId]).first()) ?? null, [lectureId]);
  const bookmarked = useLiveQuery(async () => Boolean(await db.bookmarks.where('[studentId+entityType+entityId]').equals([studentId, 'lecture', lectureId]).first()), [lectureId]);

  // ── Reading progress: restore position, then record while scrolling ──
  const [percent, setPercent] = useState(0);
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current || progress === undefined) return;
    restored.current = true;
    if (progress?.position) {
      requestAnimationFrame(() => window.scrollTo({ top: progress.position! * (document.documentElement.scrollHeight - window.innerHeight) }));
    }
  }, [progress]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const position = max > 0 ? Math.min(1, window.scrollY / max) : 1;
      setPercent(Math.round(position * 100));
      // Never record before the saved position has been restored (it would overwrite it with the top).
      // Structure-only lectures record no progress: there is nothing to read yet.
      if (!restored.current || !hasContent) return;
      clearTimeout(timer);
      timer = setTimeout(() => void recordReading(db, studentId, lectureId, position * 100, position), 800);
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      window.removeEventListener('scroll', measure);
      clearTimeout(timer);
    };
  }, [studentId, lectureId, hasContent]);

  const completed = progress?.status === 'completed';
  const sections = useMemo(() => new Map(lecture.sections.map((s) => [s.kind, s])), [lecture.sections]);
  const tocKinds = hasContent ? LECTURE_TEMPLATE : LECTURE_TEMPLATE.slice(0, 4);
  const meta = { app: APP_VERSION, date: new Date().toISOString().slice(0, 10) };
  const fileBase = `${course.code}-${bundle.number}`.replace(/\./g, '_');

  const downloadMd = () => downloadText(`${fileBase}.md`, lectureMarkdown(bundle, lang, glossary, labels, meta), 'text/markdown');
  const downloadCode = () => {
    const files = codeFiles([{ prefix: '', lecture }], lang, labels);
    downloadBytes(`${fileBase}-code.zip`, createZip(files));
  };

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-8">
      <div className="fixed inset-x-0 top-14 z-20 lg:left-64" data-print-hide>
        <ProgressBar value={percent} label={t('learning.reader.progress', { percent })} className="h-1 rounded-none" />
      </div>

      <article className="min-w-0" data-testid="lecture-article">
        <nav className="mb-2 text-xs text-muted" aria-label="breadcrumb">
          <Link to={`/library?programme=${programme?.id ?? ''}`} className="hover:underline">{l(programme?.name)}</Link>
          {' › '}
          <span className="font-mono">{course.code}</span> › {t('learning.reader.module', { n: module.order })}
        </nav>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="mr-2 font-mono text-note">{bundle.number}</span>
          {l(lecture.title)}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2" data-print-hide>
          {hasContent ? (
            <Button
              size="sm"
              variant={completed ? 'secondary' : 'primary'}
              disabled={completed}
              onClick={async () => {
                await completeLecture(db, studentId, lectureId);
                toast.success(t('learning.reader.markedComplete'));
              }}
              icon={<CheckCircle2 className="h-4 w-4" />}
            >
              {completed ? t('learning.reader.completed') : t('learning.reader.markComplete')}
            </Button>
          ) : (
            <span data-testid="incomplete-badge"><Badge tone="warning">{t('learning.library.structureOnly')}</Badge></span>
          )}
          <Button size="sm" variant="outline" aria-pressed={Boolean(bookmarked)} onClick={() => void toggleBookmark(db, studentId, 'lecture', lectureId, `${course.code} ${bundle.number}`)} icon={bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}>
            {bookmarked ? t('learning.reader.bookmarked') : t('learning.reader.bookmark')}
          </Button>
          <Button size="sm" variant="outline" onClick={downloadMd} icon={<FileDown className="h-4 w-4" />}>{t('learning.reader.downloadMd')}</Button>
          {hasContent && <Button size="sm" variant="outline" onClick={downloadCode} icon={<FileCode2 className="h-4 w-4" />}>{t('learning.reader.downloadCode')}</Button>}
          <Link to={`/print?lecture=${lectureId}`}>
            <Button size="sm" variant="outline" icon={<Printer className="h-4 w-4" />}>{t('learning.reader.print')}</Button>
          </Link>
        </div>

        {/* Sections 1–4: generated from curriculum metadata */}
        <dl className="mt-6 grid gap-3 sm:grid-cols-2" data-testid="lecture-meta">
          <MetaItem kind="lecture_information" value={`${t('learning.reader.lecture', { n: bundle.number })} · ${l(module.title)}`} />
          <MetaItem kind="course_information" value={`${course.code} — ${l(course.title)} · ${t('learning.reader.credits', { count: course.creditHours })}`} />
          <MetaItem kind="academic_level" value={<Badge tone="primary">{t(`difficulty.${lecture.difficulty}`)}</Badge>} />
          <MetaItem kind="estimated_duration" value={t('learning.reader.minutes', { count: lecture.estimatedMinutes })} />
        </dl>

        {!hasContent ? (
          <Card className="mt-6 border-note/40">
            <h2 className="font-semibold">{t('learning.reader.noContentTitle')}</h2>
            <p className="mt-1 text-sm text-muted">{t('learning.reader.noContentBody')}</p>
          </Card>
        ) : (
          <div className="mt-8 space-y-10">
            {LECTURE_TEMPLATE.slice(4).map((kind) => {
              const section = sections.get(kind)!;
              return (
                <section key={kind} aria-labelledby={anchor(kind)} data-section={kind}>
                  <SectionHeading id={anchor(kind)}>{t(`learning.sections.${kind}`)}</SectionHeading>
                  <div className="mt-3">
                    {section.notApplicable ? (
                      <p className="text-sm italic text-muted">{t('learning.reader.notApplicable')}: <RichText text={section.notApplicable} /></p>
                    ) : (
                      <Blocks blocks={section.blocks} />
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <Card className="mt-10 border-accent/40" data-print-hide>
          <h2 className="flex items-center gap-2 font-semibold"><Dumbbell className="h-4 w-4 text-accent" aria-hidden />{t('learning.reader.practiceTitle')}</h2>
          <p className="mt-1 text-sm text-muted">{t('learning.reader.practiceBody')}</p>
          <Link to="/practice" className="mt-2 inline-block text-sm font-medium text-accent hover:underline">{t('learning.reader.practiceLink')}</Link>
        </Card>

        <LectureNotes studentId={studentId} lectureId={lectureId} title={`${course.code} ${bundle.number} — ${l(lecture.title)}`} />

        <nav className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between" data-print-hide aria-label={`${t('learning.reader.prev')} / ${t('learning.reader.next')}`}>
          {bundle.prev ? (
            <Link to={`/lecture-room?lecture=${bundle.prev.id}`} className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden /> {t('learning.reader.prev')}: {l(bundle.prev.title)}
            </Link>
          ) : <span />}
          {bundle.next && (
            <Link to={`/lecture-room?lecture=${bundle.next.id}`} className="inline-flex items-center gap-2 text-sm text-accent hover:underline sm:text-right">
              {t('learning.reader.next')}: {l(bundle.next.title)} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </nav>
      </article>

      {/* Table of contents */}
      <aside className="hidden lg:block" data-print-hide>
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto">
          <Toc kinds={tocKinds} percent={percent} />
        </div>
      </aside>
      <details className="mt-6 rounded-lg border border-border p-3 lg:hidden" data-print-hide>
        <summary className="cursor-pointer text-sm font-semibold">{t('learning.reader.contents')}</summary>
        <Toc kinds={tocKinds} percent={percent} />
      </details>
    </div>
  );
}

function MetaItem({ kind, value }: { kind: LectureSectionKind; value: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div id={anchor(kind)} className="scroll-mt-24 rounded-lg border-l-4 border-note bg-surface/80 px-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-note">{t(`learning.sections.${kind}`)}</dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
  );
}

function Toc({ kinds, percent }: { kinds: readonly LectureSectionKind[]; percent: number }) {
  const { t } = useI18n();
  return (
    <nav aria-label={t('learning.reader.contents')} data-testid="toc">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{t('learning.reader.contents')}</p>
      <p className="mb-3 text-xs text-muted" data-testid="reading-progress">{t('learning.reader.progress', { percent })}</p>
      <ol className="space-y-1 text-sm">
        {kinds.map((kind, i) => (
          <li key={kind}>
            <button type="button" onClick={() => scrollTo(kind)} className="w-full rounded px-2 py-1 text-left text-muted hover:bg-surface-2 hover:text-fg">
              <span className="mr-1 font-mono text-xs text-note">{i + 1}.</span>
              {t(`learning.sections.${kind}`)}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function LectureNotes({ studentId, lectureId, title }: { studentId: string; lectureId: string; title: string }) {
  const { t } = useI18n();
  const labels = useExportLabels();
  const existing = useLiveQuery(async () => (await getLectureNote(db, studentId, lectureId)) ?? null, [lectureId]);
  if (existing === undefined) return null;
  return <NotesEditor key={lectureId} initial={existing?.body ?? ''} onSave={(body) => saveLectureNote(db, studentId, lectureId, title, body)} onExport={(body) => downloadText(`notes-${title.slice(0, 20).replace(/\W+/g, '-')}.md`, notesMarkdown(title, [{ title, body } as never], labels), 'text/markdown')} label={t('learning.reader.notes')} />;
}

function NotesEditor({ initial, onSave, onExport, label }: { initial: string; onSave: (body: string) => Promise<void>; onExport: (body: string) => void; label: string }) {
  const { t } = useI18n();
  const [body, setBody] = useState(initial);
  const status = useAutosave(body, onSave, { enabled: true });
  return (
    <Card className="mt-6" data-print-hide>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h2 className="flex items-center gap-2 font-semibold"><NotebookPen className="h-4 w-4 text-note" aria-hidden />{label}</h2>
        <SaveIndicator status={status} />
        <Button size="sm" variant="ghost" className="ml-auto" disabled={!body.trim()} onClick={() => onExport(body)} icon={<Download className="h-4 w-4" />}>{t('learning.reader.exportNotes')}</Button>
      </div>
      <p className="mb-2 text-xs text-muted">{t('learning.reader.notesHint')}</p>
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={t('learning.reader.notesPlaceholder')} aria-label={label} className="min-h-[120px]" />
    </Card>
  );
}
