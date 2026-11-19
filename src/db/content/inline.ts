/**
 * Inline text syntax shared by the validator, the lecture reader and the exporters:
 *   **bold**   `code`   [[glossary-key]]   [[glossary-key|label]]   [label](https://…)
 */
export type InlineToken =
  | { kind: 'text'; text: string }
  /** `text` is the raw inner text; `children` is that text parsed (it may hold code, glossary links and links). */
  | { kind: 'bold'; text: string; children: InlineToken[] }
  | { kind: 'code'; text: string }
  | { kind: 'term'; key: string; label?: string }
  | { kind: 'link'; label: string; url: string };

const PATTERN = /\*\*(.+?)\*\*|`([^`]+)`|\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
/** Inside bold: everything except bold itself (bold does not nest). */
const INNER = /()`([^`]+)`|\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

function parse(text: string, pattern: RegExp): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index! > last) tokens.push({ kind: 'text', text: text.slice(last, m.index) });
    if (m[1]) tokens.push({ kind: 'bold', text: m[1], children: parse(m[1], INNER) });
    else if (m[2] !== undefined) tokens.push({ kind: 'code', text: m[2] });
    else if (m[3] !== undefined) tokens.push({ kind: 'term', key: m[3], label: m[4] });
    else tokens.push({ kind: 'link', label: m[5]!, url: m[6]! });
    last = m.index! + m[0].length;
  }
  if (last < text.length) tokens.push({ kind: 'text', text: text.slice(last) });
  return tokens;
}

export function parseInline(text: string): InlineToken[] {
  return parse(text, PATTERN);
}

/** Every token, with the contents of bold text included (for validation). */
export function flattenInline(tokens: InlineToken[]): InlineToken[] {
  return tokens.flatMap((t) => (t.kind === 'bold' ? [t, ...flattenInline(t.children)] : [t]));
}

/** Plain-text rendering (used for search and accessibility). */
export function inlineToPlain(text: string, termLabel: (key: string) => string = (k) => k): string {
  const plain = (tokens: InlineToken[]): string =>
    tokens.map((t) => (t.kind === 'bold' ? plain(t.children) : t.kind === 'term' ? (t.label ?? termLabel(t.key)) : t.kind === 'link' ? t.label : t.text)).join('');
  return plain(parseInline(text));
}
