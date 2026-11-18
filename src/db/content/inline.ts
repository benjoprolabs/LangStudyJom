/**
 * Inline text syntax shared by the validator, the lecture reader and the exporters:
 *   **bold**   `code`   [[glossary-key]]   [[glossary-key|label]]   [label](https://…)
 */
export type InlineToken =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'term'; key: string; label?: string }
  | { kind: 'link'; label: string; url: string };

const PATTERN = /\*\*(.+?)\*\*|`([^`]+)`|\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    if (m.index! > last) tokens.push({ kind: 'text', text: text.slice(last, m.index) });
    if (m[1] !== undefined) tokens.push({ kind: 'bold', text: m[1] });
    else if (m[2] !== undefined) tokens.push({ kind: 'code', text: m[2] });
    else if (m[3] !== undefined) tokens.push({ kind: 'term', key: m[3], label: m[4] });
    else tokens.push({ kind: 'link', label: m[5]!, url: m[6]! });
    last = m.index! + m[0].length;
  }
  if (last < text.length) tokens.push({ kind: 'text', text: text.slice(last) });
  return tokens;
}

/** Plain-text rendering (used for search and accessibility). */
export function inlineToPlain(text: string, termLabel: (key: string) => string = (k) => k): string {
  return parseInline(text)
    .map((t) => (t.kind === 'term' ? (t.label ?? termLabel(t.key)) : t.kind === 'link' ? t.label : t.text))
    .join('');
}
