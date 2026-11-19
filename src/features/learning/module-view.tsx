import { useMemo } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { moduleUnitStatus, verificationTool, VERIFICATION } from '@/content/verification';
import { disciplineOfFaculty, evaluateModule, lectureCorpus, moduleCodeUnits, moduleUnitKey, parseModuleBody, type Discipline, type ModuleBlock, type ModuleProblem } from '@/db/content/module';
import { MODULE_SECTIONS, type ModuleSection, type ModuleSectionKind } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import { cn } from '@/lib/cn';
import { HighlightedCode, RichText, useGlossary } from './ContentRenderer';
import type { CourseBundle } from './data';

/** Status and quality of a module's own materials, judged against its course's lectures (no copying). */
export function useModuleEvaluation(bundle: CourseBundle | undefined, sections: ModuleSection[] | undefined, facultyCode: string | undefined, moduleOrder?: number) {
  const { terms } = useGlossary();
  const discipline: Discipline = disciplineOfFaculty(facultyCode);
  const corpus = useMemo(
    () => lectureCorpus((bundle?.modules ?? []).flatMap((m) => m.lectures.map((l) => ({ order: l.order, module: m.module.order, sections: l.sections })))),
    [bundle],
  );
  const glossaryKeys = useMemo(() => (terms.size ? new Set(terms.keys()) : undefined), [terms]);
  const courseCode = bundle?.course.code;
  const evaluation = useMemo(() => {
    const units = courseCode && moduleOrder ? moduleCodeUnits(courseCode, moduleOrder, sections) : undefined;
    return evaluateModule(sections, { discipline, glossaryKeys, corpus, units, isVerified: (u) => moduleUnitStatus(u) === 'executed' });
  }, [sections, discipline, glossaryKeys, corpus, courseCode, moduleOrder]);
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
/** `codeKey(i)` gives the verification key of the i-th (1-based) code block, when it can be verified. */
export function ModuleBody({ text, codeKey }: { text: string; codeKey?: (index: number) => string }) {
  const { t, formatDate } = useI18n();
  let codeIndex = 0;
  return (
    <div className="space-y-3 leading-relaxed">
      {parseModuleBody(text).map((b, i) => {
        if (b.type === 'paragraph') return <p key={i}><RichText text={b.text} /></p>;
        if (b.type === 'list') {
          const items = b.items.map((item, j) => <li key={j}><RichText text={item} /></li>);
          return b.ordered ? <ol key={i} className="list-decimal space-y-1 pl-6">{items}</ol> : <ul key={i} className="list-disc space-y-1 pl-6">{items}</ul>;
        }
        const lang = b.language === 'lua' || b.language === 'luau' || b.language === 'python' ? b.language : undefined;
        codeIndex++;
        const status = codeKey && lang ? moduleCodeStatus(codeKey(codeIndex), b) : null;
        return (
          <figure key={i} className="avoid-break overflow-hidden rounded-lg border border-border" data-module-code data-status={status ?? 'unverified'}>
            <figcaption className={cn('flex flex-wrap items-center gap-2 border-b border-border bg-surface-2 px-3 py-1.5 text-[11px]', status === 'executed' ? 'text-success' : 'text-warning')}>
              {status === 'executed' ? <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> : <ShieldAlert className="h-3.5 w-3.5" aria-hidden />}
              {status === 'executed'
                ? t('learning.code.status.executed', { tool: verificationTool(RUNTIME[b.language]!), date: VERIFICATION.generatedAt ? formatDate(VERIFICATION.generatedAt) : '' })
                : t('learning.module.unverifiedCode')}
              {b.language !== 'text' && <span className="ml-auto font-mono text-muted">{b.language}</span>}
            </figcaption>
            <pre className="overflow-x-auto bg-bg/60 p-4 font-mono text-[13px] leading-relaxed">
              <code>{lang ? <HighlightedCode code={b.code} language={lang} /> : b.code}</code>
            </pre>
            {b.expectedOutput !== undefined && (
              <div className="border-t border-border bg-surface/60 px-4 py-2">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{t('learning.reader.expectedOutput')}</p>
                <pre className="overflow-x-auto font-mono text-[13px] text-fg">{b.expectedOutput}</pre>
              </div>
            )}
          </figure>
        );
      })}
    </div>
  );
}

/** The written sections of a module, in standard order. Renders nothing when no section is written. */
export function ModuleMaterials({ sections, level = 2, idPrefix = 'module', courseCode, moduleOrder }: { sections: ModuleSection[] | undefined; level?: 2 | 3; idPrefix?: string; courseCode?: string; moduleOrder?: number }) {
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
          <ModuleBody text={l(byKind.get(kind)!.body)} codeKey={courseCode && moduleOrder ? (n) => moduleUnitKey(courseCode, moduleOrder, kind, n) : undefined} />
        </section>
      ))}
    </div>
  );
}

export const sectionLabel = (t: ReturnType<typeof useI18n>['t'], kind: ModuleSectionKind) =>
  t(`learning.module.sections.${kind}` as 'learning.module.sections.module_overview');

const RUNTIME: Record<string, string> = { lua: 'lua54', luau: 'luau', python: 'python' };

/** Verification of one module code block (needs its expected output; only verified code is "executed"). */
function moduleCodeStatus(key: string, b: Extract<ModuleBlock, { type: 'code' }>) {
  const runtime = RUNTIME[b.language];
  return runtime ? moduleUnitStatus({ key, runtime, code: b.code, expectedOutput: b.expectedOutput }) : null;
}
