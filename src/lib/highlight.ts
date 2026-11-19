/**
 * Minimal, dependency-free syntax highlighter for Lua, Luau and Python (screen + print).
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

/** Python 3.13 hard keywords (keyword.kwlist). Soft keywords (match, case, type, _) are context-dependent and left plain. */
const PY_KEYWORDS = new Set(['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']);
const PY_BUILTINS = new Set([
  'print', 'input', 'len', 'range', 'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'frozenset', 'bytes', 'bytearray',
  'open', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed', 'sum', 'min', 'max', 'abs', 'round', 'divmod', 'pow',
  'isinstance', 'issubclass', 'type', 'id', 'repr', 'format', 'super', 'object', 'iter', 'next', 'any', 'all', 'hash',
  'chr', 'ord', 'property', 'staticmethod', 'classmethod', 'getattr', 'setattr', 'hasattr', 'delattr', 'callable', 'vars', 'dir',
  'Exception', 'BaseException', 'ValueError', 'TypeError', 'KeyError', 'IndexError', 'ZeroDivisionError', 'NameError',
  'AttributeError', 'RuntimeError', 'StopIteration', 'FileNotFoundError', 'OSError', 'ImportError', 'AssertionError',
  'NotImplementedError', 'RecursionError', 'UnicodeDecodeError', 'self', 'cls',
]);
const PY_PREFIX = '(?:[rRuUbBfF]|[rR][bBfF]|[bBfF][rR])?';
const PY_RULES: [TokenKind, RegExp][] = [
  ['comment', /^#[^\n]*/],
  ['string', new RegExp(`^${PY_PREFIX}(?:"""[\\s\\S]*?(?:"""|$)|'''[\\s\\S]*?(?:'''|$))`)],
  ['string', new RegExp(`^${PY_PREFIX}"(?:\\\\.|[^"\\\\\\n])*"?`)],
  ['string', new RegExp(`^${PY_PREFIX}'(?:\\\\.|[^'\\\\\\n])*'?`)],
  ['number', /^0[xX][0-9a-fA-F_]+|^0[oO][0-7_]+|^0[bB][01_]+|^\d[\d_]*\.?[\d_]*(?:[eE][+-]?\d+)?[jJ]?|^\.\d[\d_]*(?:[eE][+-]?\d+)?[jJ]?/],
];

export type HighlightLanguage = 'lua' | 'luau' | 'python';

export function highlight(code: string, language: HighlightLanguage): CodeToken[] {
  const tokens: CodeToken[] = [];
  const rules = language === 'python' ? PY_RULES : RULES;
  let rest = code;
  const push = (kind: TokenKind, text: string) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind && kind === 'plain') last.text += text;
    else tokens.push({ kind, text });
  };
  outer: while (rest.length) {
    for (const [kind, re] of rules) {
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
      const kind =
        language === 'python'
          ? PY_KEYWORDS.has(w) ? 'keyword' : PY_BUILTINS.has(w) ? 'builtin' : 'plain'
          : KEYWORDS.has(w) || (language === 'luau' && LUAU_KEYWORDS.has(w)) ? 'keyword' : BUILTINS.has(w) ? 'builtin' : 'plain';
      push(kind, w);
      rest = rest.slice(w.length);
      continue;
    }
    push('plain', rest[0]!);
    rest = rest.slice(1);
  }
  return tokens;
}
