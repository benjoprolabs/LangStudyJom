import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { db } from '@/db/client';
import type { GlossaryTerm } from '@/db/types';
import { toggleBookmark } from '@/db/repositories/learning';
import { useStudent } from '@/hooks/useStudent';
import { useI18n } from '@/i18n/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { VERIFICATION, verificationTool } from '@/content/verification';
import { CodeBlock, CodeScopeProvider, GlossaryProvider, RichText } from './ContentRenderer';
import { loadGlossary } from './data';
import type { ExportLabels } from './markdown';

export function useGlossaryTerms() {
  return useLiveQuery(() => loadGlossary(db), []) ?? new Map<string, GlossaryTerm>();
}

/** Provides glossary lookup + Click-to-Learn panel to everything inside it. */
export function GlossaryScope({ children }: { children: ReactNode }) {
  const terms = useGlossaryTerms();
  const [openKey, setOpenKey] = useState<string | null>(null);
  return (
    <GlossaryProvider value={{ terms, open: setOpenKey }}>
      {children}
      {openKey && <GlossaryPanel termKey={openKey} terms={terms} onNavigate={setOpenKey} onClose={() => setOpenKey(null)} />}
    </GlossaryProvider>
  );
}

function GlossaryPanel({ termKey, terms, onNavigate, onClose }: { termKey: string; terms: Map<string, GlossaryTerm>; onNavigate: (k: string) => void; onClose: () => void }) {
  const { t } = useI18n();
  const student = useStudent();
  const term = terms.get(termKey);
  const lectureLinks = useLiveQuery(async () => {
    if (!term) return [];
    const out: { id: string; label: string; written: boolean }[] = [];
    for (const ref of term.lectures) {
      const course = await db.courses.where('code').equals(ref.courseCode).first();
      const mod = course && (await db.modules.where('[courseId+order]').equals([course.id, ref.module]).first());
      const lecture = mod && (await db.lectures.where('[moduleId+order]').equals([mod.id, ref.lecture]).first());
      if (lecture) out.push({ id: lecture.id, label: `${ref.courseCode} ${ref.module}.${ref.lecture}`, written: lecture.sections.length > 0 });
    }
    return out;
  }, [term?.id]);
  const bookmark = useLiveQuery(
    async () => (student && term ? db.bookmarks.where('[studentId+entityType+entityId]').equals([student.id, 'glossary', term.id]).first() : undefined),
    [student?.id, term?.id],
  );

  const toggle = async () => {
    if (student && term) await toggleBookmark(db, student.id, 'glossary', term.id, term.term);
  };

  return (
    <Modal open size="lg" title={term ? `${term.term} · ${term.translation}` : t('learning.glossary.title')} onClose={onClose}>
      {!term ? (
        <p className="text-sm text-muted">{t('learning.glossary.notInstalled')}</p>
      ) : (
        <GlossaryProvider value={{ terms, open: onNavigate }}>
          <div className="space-y-5 text-sm" data-testid="glossary-panel">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={term.scope === 'roblox' ? 'warning' : 'accent'}>{t(`learning.glossary.scope.${term.scope}`)}</Badge>
              <Button size="sm" variant={bookmark ? 'secondary' : 'outline'} onClick={toggle} icon={bookmark ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />} aria-pressed={Boolean(bookmark)}>
                {bookmark ? t('learning.glossary.bookmarked') : t('learning.glossary.bookmark')}
              </Button>
            </div>
            <section className="rounded-r-lg border-l-4 border-note bg-note/10 px-4 py-3">
              <h3 className="mb-1 font-semibold text-note">{t('learning.glossary.definition')}</h3>
              <p><RichText text={term.definition} /></p>
            </section>
            <section>
              <h3 className="mb-1 font-semibold">{t('learning.glossary.explanation')}</h3>
              <p className="leading-relaxed"><RichText text={term.explanation} /></p>
            </section>
            {term.example && (
              <section>
                <h3 className="font-semibold">{t('learning.glossary.example')}</h3>
                <CodeScopeProvider value={{ scope: 'glossary', explains: new Map() }}>
                  <CodeBlock block={{ type: 'code', id: term.key, language: term.example.language, runtime: term.example.runtime, title: { ms: term.term, en: term.term }, code: term.example.code, expectedOutput: term.example.expectedOutput }} />
                </CodeScopeProvider>
              </section>
            )}
            {term.related.length > 0 && (
              <section>
                <h3 className="mb-2 font-semibold">{t('learning.glossary.related')}</h3>
                <div className="flex flex-wrap gap-2">
                  {term.related.map((k) => (
                    <button key={k} type="button" onClick={() => onNavigate(k)} className="rounded-full border border-note/40 px-3 py-1 text-note hover:bg-note/10" data-term={k}>
                      {terms.get(k)?.term ?? k}
                    </button>
                  ))}
                </div>
              </section>
            )}
            {lectureLinks && lectureLinks.length > 0 && (
              <section>
                <h3 className="mb-2 font-semibold">{t('learning.glossary.lectures')}</h3>
                <ul className="flex flex-wrap gap-2">
                  {lectureLinks.map((link) => (
                    <li key={link.id}>
                      {link.written ? (
                        <Link to={`/lecture-room?lecture=${link.id}`} onClick={onClose} className="inline-flex min-h-[2rem] items-center rounded border border-border px-2 py-1 font-mono text-xs hover:bg-surface-2" data-glossary-lecture="written">
                          {link.label}
                        </Link>
                      ) : (
                        // Planned lecture that has no content yet: shown for information, never as a link to an empty page.
                        <span className="inline-flex min-h-[2rem] items-center gap-1.5 rounded border border-dashed border-border px-2 py-1 text-xs text-muted" data-glossary-lecture="planned">
                          <span className="font-mono">{link.label}</span>
                          <span>· {t('learning.glossary.notWritten')}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section>
              <h3 className="mb-2 font-semibold">{t('learning.glossary.references')}</h3>
              <ul className="space-y-1">
                {term.references.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-note underline underline-offset-2">
                      {r.title}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only"> {t('learning.reader.externalLink')}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </GlossaryProvider>
      )}
    </Modal>
  );
}

/** Translated labels for the Markdown / source-code exporters. */
export function useExportLabels(): ExportLabels {
  const { t } = useI18n();
  return {
    section: (kind) => t(`learning.sections.${kind}` as never),
    difficulty: (level) => t(`difficulty.${level}` as never),
    runtime: (runtime) => t(`learning.runtime.${runtime}` as never),
    expectedOutput: t('learning.reader.expectedOutput'),
    lines: t('learning.reader.lines'),
    notApplicable: t('learning.reader.notApplicable'),
    noContent: t('learning.reader.noContentTitle'),
    minutes: (n) => t('learning.reader.minutes', { count: n }),
    credits: (n) => t('learning.reader.credits', { count: n }),
    contents: t('learning.print.contents'),
    generated: t('learning.reader.generated'),
    externalLink: t('learning.reader.externalLink'),
    notes: t('learning.reader.notes'),
    status: (runtime, status) => {
      const tool = verificationTool(runtime);
      const date = VERIFICATION.generatedAt;
      if (status === 'executed') return t('learning.code.status.executed', { tool, date });
      if (status === 'error-matched') return t('learning.code.status.errorMatched', { tool, date });
      if (status === 'compiled') return t('learning.code.status.compiled');
      return t('learning.code.status.unverified');
    },
    input: t('learning.code.input'),
    debugTitle: t('learning.code.debugTitle'),
    brokenCode: t('learning.code.brokenCode'),
    errorMessage: t('learning.code.errorMessage'),
    fix: t('learning.code.fix'),
    moduleContent: t('learning.module.layerTitle'),
    moduleSection: (kind) => t(`learning.module.sections.${kind}` as never),
    moduleNotWritten: t('learning.module.emptyTitle'),
    moduleUnverifiedCode: t('learning.module.unverifiedCode'),
  };
}
