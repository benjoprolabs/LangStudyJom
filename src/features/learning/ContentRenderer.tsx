import { createContext, useContext, useState, type ReactNode } from 'react';
import { Check, Copy, Download, ExternalLink, Info, KeyRound, TriangleAlert } from 'lucide-react';
import { parseInline } from '@/db/content/inline';
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

/** Inline text: **bold**, `code`, [[term]] (Click-to-Learn) and external links. */
export function RichText({ text }: { text: LocalizedText | string }) {
  const { l, t } = useI18n();
  const { terms, open } = useGlossary();
  const raw = typeof text === 'string' ? text : l(text);
  return (
    <>
      {parseInline(raw).map((tok, i) => {
        switch (tok.kind) {
          case 'bold':
            return <strong key={i} className="font-semibold text-fg">{tok.text}</strong>;
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
      })}
    </>
  );
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

export function CodeBlock({ block, interactive = true }: { block: Extract<ContentBlock, { type: 'code' }>; interactive?: boolean }) {
  const { t, l } = useI18n();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  const tone = block.runtime === 'roblox' ? 'text-warning border-warning/40 bg-warning/10' : 'text-success border-success/40 bg-success/10';
  return (
    <figure className="avoid-break my-4 overflow-hidden rounded-lg border border-border" data-code-id={block.id}>
      <figcaption className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-2 px-3 py-2 text-sm">
        <span className="font-medium">{l(block.title)}</span>
        <span className={cn('rounded border px-1.5 py-0.5 text-[11px] font-medium', tone)}>{t(`learning.runtime.${block.runtime}`)}</span>
        {interactive && (
          <span className="ml-auto flex gap-1" data-print-hide>
            <button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted hover:bg-surface hover:text-fg" aria-label={`${t('learning.reader.copy')}: ${l(block.title)}`}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t('learning.reader.copied') : t('learning.reader.copy')}
            </button>
            <button
              type="button"
              onClick={() => downloadText(`${block.id}.${block.language}`, `${block.code}\n`, 'text/plain')}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted hover:bg-surface hover:text-fg"
              aria-label={`${t('learning.reader.downloadFile')}: ${block.id}.${block.language}`}
            >
              <Download className="h-3.5 w-3.5" />
              .{block.language}
            </button>
          </span>
        )}
      </figcaption>
      <pre className="overflow-x-auto bg-bg/60 p-4 font-mono text-[13px] leading-relaxed">
        <code><HighlightedCode code={block.code} language={block.language} /></code>
      </pre>
      {block.expectedOutput !== undefined && (
        <div className="border-t border-border bg-surface/60 px-4 py-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{t('learning.reader.expectedOutput')}</p>
          <pre className="overflow-x-auto font-mono text-[13px] text-fg" data-testid={`output-${block.id}`}>{block.expectedOutput}</pre>
        </div>
      )}
    </figure>
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
                <dl className="space-y-2">
                  {b.items.map((item, j) => (
                    <div key={j} className="grid grid-cols-[4.5rem_1fr] gap-3 text-sm">
                      <dt className="font-mono text-xs font-semibold text-note">{t('learning.reader.lines')} {item.lines}</dt>
                      <dd className="leading-relaxed"><RichText text={item.text} /></dd>
                    </div>
                  ))}
                </dl>
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
