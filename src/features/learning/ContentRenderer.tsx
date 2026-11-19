import { createContext, useContext, useState, type ReactNode } from 'react';
import { BookOpenText, Bug, Check, Copy, Download, ExternalLink, Info, KeyRound, Play, ShieldAlert, ShieldCheck, TriangleAlert, X } from 'lucide-react';
import { VERIFICATION, verificationOf } from '@/content/verification';
import type { RunOutcome } from '@/lib/lua-runtime';
import { parseInline, type InlineToken } from '@/db/content/inline';
import type { ContentBlock, GlossaryTerm, LocalizedText } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import { downloadText } from '@/lib/download';
import { highlight } from '@/lib/highlight';
import { cn } from '@/lib/cn';

/** Glossary lookup + "open term" action, provided by the reader / library / print pages. */
export interface GlossaryApi {
  terms: Map<string, GlossaryTerm>;
  open?: (key: string) => void;
}
const GlossaryContext = createContext<GlossaryApi>({ terms: new Map() });
export const GlossaryProvider = GlossaryContext.Provider;
export const useGlossary = () => useContext(GlossaryContext);

/** Inline text: **bold**, `code`, [[term]] (Click-to-Learn) and external links. Bold text may contain the others. */
export function RichText({ text }: { text: LocalizedText | string }) {
  const { l, t } = useI18n();
  const { terms, open } = useGlossary();
  const raw = typeof text === 'string' ? text : l(text);
  const render = (tokens: InlineToken[]): ReactNode[] =>
    tokens.map((tok, i) => {
      switch (tok.kind) {
        case 'bold':
          return <strong key={i} className="font-semibold text-fg">{render(tok.children)}</strong>;
        case 'code':
          return <code key={i} className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.9em] text-fg">{tok.text}</code>;
        case 'term': {
          const term = terms.get(tok.key);
          const label = tok.label ?? term?.term ?? tok.key;
          if (!open) return <strong key={i} className="font-semibold text-note">{label}</strong>;
          return (
            <button
              key={i}
              type="button"
              onClick={() => open(tok.key)}
              className="rounded font-semibold text-note underline decoration-note/50 decoration-dotted underline-offset-4 hover:decoration-solid"
              data-term={tok.key}
            >
              {label}
            </button>
          );
        }
        case 'link':
          return (
            <a key={i} href={tok.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-0.5 text-note underline underline-offset-2">
              {tok.label}
              <ExternalLink className="h-3 w-3 self-center" aria-hidden />
              <span className="sr-only"> {t('learning.reader.externalLink')}</span>
            </a>
          );
        default:
          return <span key={i}>{tok.text}</span>;
      }
    });
  return <>{render(parseInline(raw))}</>;
}

/**
 * Highlighted code, one row per line with a line-number gutter, so "Lines 3–6" in a line-by-line
 * explanation can be found at a glance. Numbers are not selectable: selecting and copying the code
 * (or the Copy button) gives the code only. Wrapped lines (print) stay indented under their number.
 */
export function HighlightedCode({ code, language }: { code: string; language: 'lua' | 'luau' }) {
  const lines: { kind: string; text: string }[][] = [[]];
  for (const tok of highlight(code, language)) {
    tok.text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1]!.push({ kind: tok.kind, text: part });
    });
  }
  const width = String(lines.length).length;
  return (
    <>
      {lines.map((parts, n) => (
        <span key={n} className="relative block" style={{ paddingLeft: `${width + 2}ch`, minHeight: '1lh' }} data-line={n + 1}>
          <span aria-hidden className="code-ln absolute left-0 select-none text-right text-muted/70" style={{ width: `${width}ch` }}>{n + 1}</span>
          {parts.map((p, i) => (p.kind === 'plain' ? <span key={i}>{p.text}</span> : <span key={i} className={`tok-${p.kind}`}>{p.text}</span>))}
        </span>
      ))}
    </>
  );
}

/**
 * Per-lecture context for code blocks: the verification-key scope ("LUA102 1.1" or "glossary") and
 * the lecture's line-by-line explanations by code id (for "Explain this code").
 */
export interface CodeScope {
  scope: string;
  explains: Map<string, Extract<ContentBlock, { type: 'explain' }>['items']>;
}
const CodeScopeContext = createContext<CodeScope>({ scope: 'glossary', explains: new Map() });
export const CodeScopeProvider = CodeScopeContext.Provider;

export function explainsOf(blocks: ContentBlock[]): CodeScope['explains'] {
  const map: CodeScope['explains'] = new Map();
  for (const b of blocks) if (b.type === 'explain') map.set(b.codeId, [...(map.get(b.codeId) ?? []), ...b.items]);
  return map;
}

const btn = 'inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted hover:bg-surface hover:text-fg disabled:opacity-50';

/** Verification status from the manifest, tied to the exact code (see src/content/verification.ts). */
function VerificationBadge({ unit, runtime }: { unit: Parameters<typeof verificationOf>[1] & { key: string }; runtime: string }) {
  const { t, formatDate } = useI18n();
  const status = verificationOf(unit.key, unit);
  const tool = runtime === 'lua54' ? VERIFICATION.tools.lua54 : VERIFICATION.tools.luau;
  const date = VERIFICATION.generatedAt ? formatDate(VERIFICATION.generatedAt) : '';
  const [label, cls, Icon] =
    status === 'executed' ? [t('learning.code.status.executed', { tool, date }), 'text-success', ShieldCheck]
    : status === 'error-matched' ? [t('learning.code.status.errorMatched', { tool, date }), 'text-success', ShieldCheck]
    : status === 'compiled' ? [t('learning.code.status.compiled'), 'text-warning', ShieldAlert]
    : [t('learning.code.status.unverified'), 'text-danger', ShieldAlert];
  return (
    <p className={cn('flex items-start gap-1.5 text-[11px]', cls)} data-testid={`status-${unit.key}`} data-status={status ?? 'unverified'}>
      <Icon className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
      {label}
    </p>
  );
}

/** "Run Code" for lua54 examples: runs in a Web Worker (Lua 5.4 / wasmoon) and compares with the expected result. */
function RunPanel({ code, input, expectedOutput, expectedError, label }: { code: string; input?: string; expectedOutput?: string; expectedError?: string; label: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<{ running: boolean; result?: RunOutcome }>({ running: false });
  const run = async () => {
    setState({ running: true });
    const { runLua } = await import('@/lib/lua-runtime');
    setState({ running: false, result: await runLua(code, input) });
  };
  const r = state.result;
  const matches = r && (expectedError !== undefined ? !r.ok && r.error === expectedError : r.ok && r.output === expectedOutput);
  return (
    <div className="border-t border-border px-4 py-2" data-print-hide>
      <button type="button" onClick={run} disabled={state.running} className={cn(btn, 'border border-success/40 text-success')} aria-label={`${label}`}>
        <Play className="h-3.5 w-3.5" aria-hidden />
        {state.running ? t('learning.code.running') : label}
      </button>
      {r && (
        <div className="mt-2 space-y-1 text-xs" role="status" data-testid="run-result">
          {r.timedOut ? (
            <p className="text-danger">{t('learning.code.timeout', { seconds: 4 })}</p>
          ) : (
            <>
              <p className="text-muted">{t('learning.code.ranIn', { runtime: BROWSER_LUA_LABEL })}</p>
              {r.output && (
                <>
                  <p className="font-semibold uppercase tracking-wide text-muted">{t('learning.code.actualOutput')}</p>
                  <pre className="overflow-x-auto rounded bg-bg/60 p-2 font-mono text-[12px] text-fg" data-testid="run-output">{r.output}</pre>
                </>
              )}
              {!r.ok && <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-danger/10 p-2 font-mono text-[12px] text-danger" data-testid="run-error">{r.error}</pre>}
              <p className={cn('flex items-center gap-1 font-medium', matches ? 'text-success' : 'text-danger')} data-testid="run-verdict" data-matches={matches ? 'yes' : 'no'}>
                {matches ? <Check className="h-3.5 w-3.5" aria-hidden /> : <X className="h-3.5 w-3.5" aria-hidden />}
                {matches ? t('learning.code.matches') : t('learning.code.differs')}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const BROWSER_LUA_LABEL = 'Lua 5.4 (wasmoon 1.16.0, WebAssembly)';

function ExplainList({ items }: { items: Extract<ContentBlock, { type: 'explain' }>['items'] }) {
  const { t } = useI18n();
  return (
    <dl className="space-y-2">
      {items.map((item, j) => (
        <div key={j} className="grid grid-cols-[4.5rem_1fr] gap-3 text-sm">
          <dt className="font-mono text-xs font-semibold text-note">{t('learning.reader.lines')} {item.lines}</dt>
          <dd className="leading-relaxed"><RichText text={item.text} /></dd>
        </div>
      ))}
    </dl>
  );
}

export function CodeBlock({ block, interactive = true }: { block: Extract<ContentBlock, { type: 'code' }>; interactive?: boolean }) {
  const { t, l } = useI18n();
  const { scope, explains } = useContext(CodeScopeContext);
  const [copied, setCopied] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const key = `${scope}#${block.id}`;
  const explanation = explains.get(block.id);
  const ext = block.language;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  const tone = block.runtime === 'roblox' ? 'text-warning border-warning/40 bg-warning/10' : 'text-note border-note/40 bg-note/10';
  return (
    <figure className="avoid-break my-4 overflow-hidden rounded-lg border border-border" data-code-id={block.id}>
      <figcaption className="border-b border-border bg-surface-2 px-3 py-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{l(block.title)}</span>
          <span className={cn('rounded border px-1.5 py-0.5 text-[11px] font-medium', tone)}>{t(`learning.runtime.${block.runtime}`)}</span>
          {interactive && (
            <span className="ml-auto flex flex-wrap gap-1" data-print-hide>
              {explanation && (
                <button type="button" onClick={() => setExplaining((v) => !v)} className={btn} aria-expanded={explaining} aria-label={`${explaining ? t('learning.code.hideExplain') : t('learning.code.explain')}: ${l(block.title)}`}>
                  <BookOpenText className="h-3.5 w-3.5" aria-hidden />
                  {explaining ? t('learning.code.hideExplain') : t('learning.code.explain')}
                </button>
              )}
              <button type="button" onClick={copy} className={btn} aria-label={`${t('learning.reader.copy')}: ${l(block.title)}`}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t('learning.reader.copied') : t('learning.reader.copy')}
              </button>
              <button type="button" onClick={() => downloadText(`${block.id}.${ext}`, `${block.code}\n`, 'text/plain')} className={btn} aria-label={`${t('learning.reader.downloadFile')}: ${block.id}.${ext}`}>
                <Download className="h-3.5 w-3.5" />.{ext}
              </button>
            </span>
          )}
        </div>
        <div className="mt-1">
          <VerificationBadge unit={{ key, ...block }} runtime={block.runtime} />
        </div>
      </figcaption>
      <pre className="overflow-x-auto bg-bg/60 p-4 font-mono text-[13px] leading-relaxed">
        <code><HighlightedCode code={block.code} language={block.language} /></code>
      </pre>
      {block.input !== undefined && (
        <div className="border-t border-border bg-surface/60 px-4 py-2">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{t('learning.code.input')}</p>
          <pre className="overflow-x-auto font-mono text-[13px] text-fg" data-testid={`input-${block.id}`}>{block.input}</pre>
        </div>
      )}
      {block.expectedOutput !== undefined && (
        <div className="border-t border-border bg-surface/60 px-4 py-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{t('learning.reader.expectedOutput')}</p>
          <pre className="overflow-x-auto font-mono text-[13px] text-fg" data-testid={`output-${block.id}`}>{block.expectedOutput}</pre>
        </div>
      )}
      {interactive && (block.runtime === 'lua54' ? (
        <RunPanel code={block.code} input={block.input} expectedOutput={block.expectedOutput} label={t('learning.code.run')} />
      ) : (
        <p className="border-t border-border px-4 py-2 text-xs text-muted" data-print-hide>
          {block.runtime === 'luau' ? t('learning.code.runUnavailableLuau') : t('learning.code.runUnavailableRoblox')}
        </p>
      ))}
      {interactive && explaining && explanation && (
        <div className="border-t border-note/40 bg-note/5 px-4 py-3" data-testid={`explain-${block.id}`}>
          <ExplainList items={explanation} />
        </div>
      )}
      {block.debug && <DebugPanel block={block} debugKey={`${key}:debug`} interactive={interactive} />}
    </figure>
  );
}

/** "Error and debugging explanation": the buggy variant, its exact (verified) error, and the fix. */
function DebugPanel({ block, debugKey, interactive }: { block: Extract<ContentBlock, { type: 'code' }>; debugKey: string; interactive: boolean }) {
  const { t } = useI18n();
  const d = block.debug!;
  const body = (
    <div className="space-y-3 px-4 pb-3 pt-1 text-sm">
      <VerificationBadge unit={{ key: debugKey, runtime: block.runtime, code: d.code, input: block.input, expectedError: d.error }} runtime={block.runtime} />
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{t('learning.code.brokenCode')}</p>
        <pre className="overflow-x-auto rounded border border-border bg-bg/60 p-3 font-mono text-[13px] leading-relaxed"><code><HighlightedCode code={d.code} language={block.language} /></code></pre>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{t('learning.code.errorMessage')}</p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-danger/10 p-2 font-mono text-[12px] text-danger" data-testid={`debug-error-${block.id}`}>{d.error}</pre>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{t('learning.code.fix')}</p>
        <p className="leading-relaxed"><RichText text={d.explanation} /></p>
      </div>
      {interactive && block.runtime === 'lua54' && <RunPanel code={d.code} input={block.input} expectedError={d.error} label={t('learning.code.runBroken')} />}
    </div>
  );
  if (!interactive) {
    return (
      <div className="border-t border-warning/40 bg-warning/5">
        <p className="px-4 pt-2 text-sm font-semibold text-warning">{t('learning.code.debugTitle')}</p>
        {body}
      </div>
    );
  }
  return (
    <details className="border-t border-warning/40 bg-warning/5" data-testid={`debug-${block.id}`}>
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-warning">
        <Bug className="h-4 w-4" aria-hidden />
        {t('learning.code.debugTitle')}
      </summary>
      {body}
    </details>
  );
}

function Callout({ block }: { block: Extract<ContentBlock, { type: 'callout' }> }) {
  const styles = {
    key: { cls: 'border-note bg-note/10', icon: <KeyRound className="h-4 w-4 text-note" aria-hidden /> },
    info: { cls: 'border-note/50 bg-note/5', icon: <Info className="h-4 w-4 text-note" aria-hidden /> },
    warning: { cls: 'border-warning bg-warning/10', icon: <TriangleAlert className="h-4 w-4 text-warning" aria-hidden /> },
  }[block.tone];
  return (
    <aside className={cn('avoid-break my-4 rounded-r-lg border-l-4 px-4 py-3 text-sm', styles.cls)} role={block.tone === 'warning' ? 'note' : undefined}>
      {block.title && (
        <p className="mb-1 flex items-center gap-2 font-semibold">
          {styles.icon}
          <RichText text={block.title} />
        </p>
      )}
      <p className="leading-relaxed">
        <RichText text={block.text} />
      </p>
    </aside>
  );
}

export function Blocks({ blocks, interactive = true }: { blocks: ContentBlock[]; interactive?: boolean }) {
  const { t, l } = useI18n();
  const { terms, open } = useGlossary();
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'paragraph':
            return <p key={i} className="my-3 leading-relaxed"><RichText text={b.text} /></p>;
          case 'list': {
            const Tag = b.ordered ? 'ol' : 'ul';
            return (
              <Tag key={i} className={cn('my-3 space-y-1.5 pl-6 leading-relaxed', b.ordered ? 'list-decimal' : 'list-disc marker:text-note')}>
                {b.items.map((item, j) => <li key={j}><RichText text={item} /></li>)}
              </Tag>
            );
          }
          case 'callout':
            return <Callout key={i} block={b} />;
          case 'code':
            return <CodeBlock key={i} block={b} interactive={interactive} />;
          case 'explain':
            return (
              <div key={i} className="avoid-break my-4">
                <p className="mb-2 text-sm text-muted"><code className="font-mono text-note">{b.codeId}</code></p>
                <ExplainList items={b.items} />
              </div>
            );
          case 'terms':
            return (
              <dl key={i} className="my-3 grid gap-3 sm:grid-cols-2">
                {b.keys.map((key) => {
                  const term = terms.get(key);
                  return (
                    <div key={key} className="avoid-break rounded-lg border-l-4 border-note bg-note/5 px-3 py-2">
                      <dt className="font-semibold">
                        {open ? (
                          <button type="button" onClick={() => open(key)} className="text-note underline decoration-dotted underline-offset-4" data-term={key}>
                            {term?.term ?? key}
                          </button>
                        ) : (
                          <span className="text-note">{term?.term ?? key}</span>
                        )}
                        {term && <span className="ml-1 font-normal text-muted">({term.translation})</span>}
                      </dt>
                      <dd className="mt-1 text-sm">{term ? <RichText text={term.definition} /> : t('learning.glossary.notInstalled')}</dd>
                    </div>
                  );
                })}
              </dl>
            );
          case 'links':
            return (
              <ul key={i} className="my-3 space-y-1.5 text-sm">
                {b.items.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-note underline underline-offset-2">
                      {link.title}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only"> {t('learning.reader.externalLink')}</span>
                    </a>
                    {link.note && <span className="text-muted"> — {l(link.note)}</span>}
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </>
  );
}

/** Section heading with the blue accent line used in academic notes. */
export function SectionHeading({ id, children, level = 2 }: { id: string; children: ReactNode; level?: 2 | 3 }) {
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <Tag id={id} className="scroll-mt-24 border-l-4 border-note pl-3 text-lg font-bold tracking-tight text-fg">
      {children}
    </Tag>
  );
}
