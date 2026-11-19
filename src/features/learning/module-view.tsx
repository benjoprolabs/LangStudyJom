import { useMemo } from 'react';
import { ShieldAlert } from 'lucide-react';
import { disciplineOfFaculty, evaluateModule, lectureCorpus, parseModuleBody, type Discipline, type ModuleProblem } from '@/db/content/module';
import { MODULE_SECTIONS, type ModuleSection, type ModuleSectionKind } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import { cn } from '@/lib/cn';
import { HighlightedCode, RichText, useGlossary } from './ContentRenderer';
import type { CourseBundle } from './data';

/** Status and quality of a module's own materials, judged against its course's lectures (no copying). */
export function useModuleEvaluation(bundle: CourseBundle | undefined, sections: ModuleSection[] | undefined, facultyCode: string | undefined) {
  const { terms } = useGlossary();
  const discipline: Discipline = disciplineOfFaculty(facultyCode);
  const corpus = useMemo(
    () => lectureCorpus((bundle?.modules ?? []).flatMap((m) => m.lectures.map((l) => ({ order: l.order, module: m.module.order, sections: l.sections })))),
    [bundle],
  );
  const glossaryKeys = useMemo(() => (terms.size ? new Set(terms.keys()) : undefined), [terms]);
  const evaluation = useMemo(() => evaluateModule(sections, { discipline, glossaryKeys, corpus }), [sections, discipline, glossaryKeys, corpus]);
  return { ...evaluation, discipline };
}

/** Human-readable message for a validation problem. */
export function useProblemText() {
  const { t } = useI18n();
  return (p: ModuleProblem) =>
    t(`learning.module.problems.${p.code}` as 'learning.module.problems.missing_section', {
      section: t(`learning.module.sections.${p.section}` as 'learning.module.sections.module_overview'),
      lang: p.lang === 'en' ? 'EN' : 'BM',
      detail: p.detail ?? '',
    });
}

/** One section body in the module text format (paragraphs, lists, code, inline syntax). */
export function ModuleBody({ text }: { text: string }) {
  const { t } = useI18n();
  return (
    <div className="space-y-3 leading-relaxed">
      {parseModuleBody(text).map((b, i) => {
        if (b.type === 'paragraph') return <p key={i}><RichText text={b.text} /></p>;
        if (b.type === 'list') {
          const items = b.items.map((item, j) => <li key={j}><RichText text={item} /></li>);
          return b.ordered ? <ol key={i} className="list-decimal space-y-1 pl-6">{items}</ol> : <ul key={i} className="list-disc space-y-1 pl-6">{items}</ul>;
        }
        const lang = b.language === 'lua' || b.language === 'luau' ? b.language : undefined;
        return (
          <figure key={i} className="avoid-break overflow-hidden rounded-lg border border-border" data-module-code>
            <figcaption className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-2 px-3 py-1.5 text-[11px] text-warning">
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
              {t('learning.module.unverifiedCode')}
              {b.language !== 'text' && <span className="ml-auto font-mono text-muted">{b.language}</span>}
            </figcaption>
            <pre className="overflow-x-auto bg-bg/60 p-4 font-mono text-[13px] leading-relaxed">
              <code>{lang ? <HighlightedCode code={b.code} language={lang} /> : b.code}</code>
            </pre>
          </figure>
        );
      })}
    </div>
  );
}

/** The written sections of a module, in standard order. Renders nothing when no section is written. */
export function ModuleMaterials({ sections, level = 2, idPrefix = 'module' }: { sections: ModuleSection[] | undefined; level?: 2 | 3; idPrefix?: string }) {
  const { t, l } = useI18n();
  const byKind = new Map((sections ?? []).map((s) => [s.kind, s]));
  const present = MODULE_SECTIONS.filter((k) => byKind.get(k) && (byKind.get(k)!.body.ms?.trim() || byKind.get(k)!.body.en?.trim()));
  if (!present.length) return null;
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <div className="space-y-8" data-testid="module-materials">
      {present.map((kind, i) => (
        <section key={kind} id={`${idPrefix}-${kind}`} data-module-section={kind} aria-labelledby={`${idPrefix}-${kind}-h`} className="scroll-mt-20">
          <Heading id={`${idPrefix}-${kind}-h`} className={cn('mb-3 border-l-4 border-primary pl-3 font-bold', level === 2 ? 'text-lg' : 'text-base')}>
            <span className="mr-2 font-mono text-sm text-muted">{i + 1}.</span>
            {t(`learning.module.sections.${kind}` as 'learning.module.sections.module_overview')}
          </Heading>
          <ModuleBody text={l(byKind.get(kind)!.body)} />
        </section>
      ))}
    </div>
  );
}

export const sectionLabel = (t: ReturnType<typeof useI18n>['t'], kind: ModuleSectionKind) =>
  t(`learning.module.sections.${kind}` as 'learning.module.sections.module_overview');
