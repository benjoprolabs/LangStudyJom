/**
 * Minimal, dependency-free syntax highlighter for Lua and Luau (screen + print).
 * Produces tokens; rendering is done by the caller (React spans or plain text).
 */
export type TokenKind = 'comment' | 'string' | 'number' | 'keyword' | 'builtin' | 'plain';
export interface CodeToken {
  kind: TokenKind;
  text: string;
}

const KEYWORDS = new Set(['and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function', 'goto', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 'return', 'then', 'true', 'until', 'while']);
const LUAU_KEYWORDS = new Set(['continue', 'type', 'export']);
const BUILTINS = new Set(['print', 'pairs', 'ipairs', 'next', 'require', 'setmetatable', 'getmetatable', 'rawget', 'rawset', 'pcall', 'xpcall', 'error', 'assert', 'tostring', 'tonumber', 'type', 'typeof', 'select', 'table', 'string', 'math', 'coroutine', 'io', 'os', 'utf8', 'package', 'debug', 'game', 'workspace', 'script', 'task', 'Instance', 'Vector3', 'CFrame', 'Enum', 'BrickColor']);

const RULES: [TokenKind, RegExp][] = [
  ['comment', /^--\[(=*)\[[\s\S]*?\]\1\]/],
  ['comment', /^--[^\n]*/],
  ['string', /^\[(=*)\[[\s\S]*?\]\1\]/],
  ['string', /^"(?:\\.|[^"\\\n])*"?/],
  ['string', /^'(?:\\.|[^'\\\n])*'?/],
  ['string', /^`(?:\\.|[^`\\])*`?/],
  ['number', /^0[xX][0-9a-fA-F]+|^\d+\.?\d*(?:[eE][+-]?\d+)?/],
];

export function highlight(code: string, language: 'lua' | 'luau'): CodeToken[] {
  const tokens: CodeToken[] = [];
  let rest = code;
  const push = (kind: TokenKind, text: string) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind && kind === 'plain') last.text += text;
    else tokens.push({ kind, text });
  };
  outer: while (rest.length) {
    for (const [kind, re] of RULES) {
      const m = re.exec(rest);
      if (m && m[0]) {
        push(kind, m[0]);
        rest = rest.slice(m[0].length);
        continue outer;
      }
    }
    const word = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest);
    if (word) {
      const w = word[0];
      const kind = KEYWORDS.has(w) || (language === 'luau' && LUAU_KEYWORDS.has(w)) ? 'keyword' : BUILTINS.has(w) ? 'builtin' : 'plain';
      push(kind, w);
      rest = rest.slice(w.length);
      continue;
    }
    push('plain', rest[0]!);
    rest = rest.slice(1);
  }
  return tokens;
}
