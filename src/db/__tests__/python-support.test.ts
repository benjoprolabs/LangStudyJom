/** Python support (PY-0): pathway, validator separation rules, glossary scope and syntax highlighting. */
import { describe, expect, it } from 'vitest';
import { GLOSSARY } from '@/content/glossary';
import type { GlossaryTermDef } from '@/db/content/types';
import { pathwayOf } from '@/db/content/types';
import { validateGlossaryTerm, validateLectureSections } from '@/db/content/validate';
import type { CodeLanguage, CodeRuntime, ContentBlock, LectureSection } from '@/db/types';
import { highlight } from '@/lib/highlight';
import { commentPrefix, sourceExtension } from '@/features/learning/markdown';

/** One code example inside an otherwise empty lecture: we only look at the code-specific problems it causes. */
function codeProblems(courseCode: string, code: string, language: CodeLanguage, runtime: CodeRuntime, debug?: string): string[] {
  const block: ContentBlock = {
    type: 'code', id: 'ex', language, runtime, title: { ms: 'Contoh', en: 'Example' }, code, expectedOutput: '',
    ...(debug ? { debug: { code: debug, error: 'example.py:1: X: y', explanation: { ms: 'x', en: 'x' } } } : {}),
  };
  const sections: LectureSection[] = [{ kind: 'code_demonstration', blocks: [block] }];
  // The general rule "every example needs a line-by-line explanation" applies to all languages; it is not under test here.
  return validateLectureSections(sections, courseCode, new Set(), new Map()).filter((e) => e.includes('code ex') && !e.includes('line-by-line'));
}
function termProblems(courseCode: string, key: string, scope: string): string[] {
  const sections: LectureSection[] = [{ kind: 'introduction', blocks: [{ type: 'paragraph', text: { ms: `Lihat [[${key}]].`, en: `See [[${key}]].` } }] }];
  return validateLectureSections(sections, courseCode, new Set([key]), new Map([[key, scope]])).filter((e) => e.includes(`[[${key}]]`));
}

describe('Python pathway', () => {
  it('every PY course is the Python pathway; Lua and Luau are unchanged', () => {
    expect(['PY101', 'PY490'].map(pathwayOf)).toEqual(['python', 'python']);
    expect(['LUA101', 'LUAU101', 'LUAU203'].map(pathwayOf)).toEqual(['lua', 'luau', 'luau']);
  });
});

describe('Python lecture validation (separation rules)', () => {
  it('accepts plain Python code in a Python lecture', () => {
    expect(codeProblems('PY101', 'nama = "Aina"\nprint(f"Hai, {nama}")', 'python', 'python', 'print(f"Hai, {nama}")')).toEqual([]);
  });

  it('rejects Lua code, Lua syntax, Roblox APIs and the wrong runtime in a Python lecture', () => {
    expect(codeProblems('PY101', 'print(1)', 'lua', 'lua54').join()).toContain('Python lecture contains lua code');
    expect(codeProblems('PY101', 'local x = 1\nprint(x)', 'python', 'python').join()).toContain('Python code contains Lua syntax');
    expect(codeProblems('PY101', 'for i in range(3):\n    print(i)\nend', 'python', 'python').join()).toContain('Lua syntax');
    expect(codeProblems('PY101', 'part = workspace.Part\nprint(part)', 'python', 'python').join()).toContain('Roblox identifier');
    expect(codeProblems('PY101', 'print(1)', 'python', 'lua54').join()).toContain('Python code must use runtime python');
    expect(codeProblems('PY101', 'print(1)', 'python', 'python', '-- komen Lua\nprint(1)').join()).toContain('debug variant breaks the Python separation');
  });

  it('rejects Python code in Lua and Luau lectures', () => {
    expect(codeProblems('LUA101', 'print(1)', 'python', 'python').join()).toContain('Lua lecture contains python code');
    expect(codeProblems('LUAU101', 'print(1)', 'python', 'python').join()).toContain('Luau lecture contains python code');
  });

  it('Python comments (#) and Python keywords that look like Lua words are not mistaken for Lua', () => {
    expect(codeProblems('PY101', '# ulasan\nfor x in [1, 2]:\n    if x > 1:\n        print("end", x)', 'python', 'python')).toEqual([]);
  });
});

describe('glossary scope separation', () => {
  it('Python lectures may link general and Python terms only', () => {
    expect(termProblems('PY101', 'variable', 'general')).toEqual([]);
    expect(termProblems('PY101', 'list-comprehension', 'python')).toEqual([]);
    for (const scope of ['lua', 'luau', 'roblox']) expect(termProblems('PY101', 'k', scope).join()).toContain(`Python lecture links ${scope} concept`);
  });

  it('Lua and Luau lectures may not link Python terms', () => {
    expect(termProblems('LUA101', 'list-comprehension', 'python').join()).toContain('Lua lecture links python concept');
    expect(termProblems('LUAU101', 'list-comprehension', 'python').join()).toContain('Luau lecture links python concept');
  });

  it('a Python term needs a Python example; Lua, Luau and Roblox terms may not use one', () => {
    const base: GlossaryTermDef = {
      key: 'list-comprehension', term: 'List comprehension', translation: 'Pemahaman senarai', scope: 'python',
      definition: { ms: 'x', en: 'x' }, explanation: { ms: 'x', en: 'x' }, related: [], lectures: [], references: [],
      example: { language: 'python', runtime: 'python', code: 'print([n * n for n in range(3)])', expectedOutput: '[0, 1, 4]' },
    };
    expect(validateGlossaryTerm(base, new Set())).toEqual([]);
    expect(validateGlossaryTerm({ ...base, example: { language: 'lua', runtime: 'lua54', code: 'print(1)', expectedOutput: '1' } }, new Set()).join()).toContain('Python concept must use a Python example');
    expect(validateGlossaryTerm({ ...base, scope: 'lua' }, new Set()).join()).toContain('lua concept uses a Python example');
    expect(validateGlossaryTerm({ ...base, example: { ...base.example!, runtime: 'lua54' } }, new Set()).join()).toContain('Python example must use runtime python');
  });

  it('the existing glossary is untouched: no term is Python-scoped and every term still validates', () => {
    expect(GLOSSARY.filter((g) => g.scope === 'python')).toEqual([]);
    const keys = new Set(GLOSSARY.map((g) => g.key));
    for (const g of GLOSSARY) expect(validateGlossaryTerm(g, keys), g.key).toEqual([]);
  });
});

describe('Python syntax highlighting', () => {
  const kinds = (code: string) => highlight(code, 'python').filter((t) => t.kind !== 'plain').map((t) => `${t.kind}:${t.text}`);

  it('keywords, built-ins, comments, strings (prefixes and triple quotes) and numbers', () => {
    expect(kinds('def purata(nombor):  # kira purata\n    return sum(nombor) / len(nombor)')).toEqual([
      'keyword:def', 'comment:# kira purata', 'keyword:return', 'builtin:sum', 'builtin:len',
    ]);
    expect(kinds('nama = f"Hai {x}"\nlaluan = r\'C:\\data\'\nteks = """baris 1\nbaris 2"""')).toEqual([
      'string:f"Hai {x}"', "string:r'C:\\data'", 'string:"""baris 1\nbaris 2"""',
    ]);
    expect(kinds('x = 1_000_000 + 0xFF + 3.5e-2 + 2j\nTrue and None')).toEqual([
      'number:1_000_000', 'number:0xFF', 'number:3.5e-2', 'number:2j', 'keyword:True', 'keyword:and', 'keyword:None',
    ]);
  });

  it('keeps every character of the source (tokens join back to the code)', () => {
    const code = 'class Akaun:\n    """Akaun bank."""\n    def __init__(self, baki=0):\n        self.baki = baki  # baki awal\n';
    expect(highlight(code, 'python').map((t) => t.text).join('')).toBe(code);
  });

  it('Lua highlighting is unchanged and does not treat Python words as Lua keywords', () => {
    expect(highlight('local x = nil', 'lua').map((t) => t.kind)).toEqual(['keyword', 'plain', 'keyword']);
    expect(highlight('def', 'lua')[0]!.kind).toBe('plain');
    expect(highlight('end', 'python')[0]!.kind).toBe('plain');
  });

  it('source downloads use .py files with # comments for Python', () => {
    expect([sourceExtension('python'), commentPrefix('python')]).toEqual(['py', '#']);
    expect([sourceExtension('lua'), commentPrefix('lua'), sourceExtension('luau')]).toEqual(['lua', '--', 'luau']);
  });
});

describe('Python line-by-line coverage', () => {
  it('Python comment lines and bare else:/try:/finally: need no explanation; every other line does', () => {
    const code = '# kira bonus\ntry:\n    bonus = 100 / 4\nexcept ZeroDivisionError:\n    bonus = 0\nelse:\n    print(bonus)';
    const sections: LectureSection[] = [{ kind: 'code_demonstration', blocks: [
      { type: 'code', id: 'b', language: 'python', runtime: 'python', title: { ms: 'x', en: 'x' }, code, expectedOutput: '25.0' },
      { type: 'explain', codeId: 'b', items: [{ lines: '3–5', text: { ms: 'x', en: 'x' } }] },
    ] }];
    const missing = validateLectureSections(sections, 'PY101', new Set(), new Map()).filter((e) => e.includes('lines not explained'));
    expect(missing).toEqual(['PY101: b lines not explained: 7']);
  });
});

