/**
 * The Python 3.13 verification runner. Fixtures here are TEST code, not course material: they prove that
 * correct Python examples are executed and matched, and that broken examples fail with exactly the documented
 * first error line — the same contract as the Lua 5.4 and Luau runners.
 */
import { describe, expect, it } from 'vitest';
import type { ContentPackage } from '@/db/content/types';
import { collectCodeExamples, type CodeExample } from '@/db/content/validate';
import { firstErrorLine, pythonVersion, run, toolVersions, verifyExample } from './runners';

const tools = toolVersions();
const py = (code: string, extra: Partial<CodeExample> = {}): CodeExample => ({
  key: 'test', where: 'test', id: 'test', language: 'python', runtime: 'python', code, ...extra,
});

describe('Python 3.13 runner', () => {
  it('uses CPython 3.13', () => {
    expect(pythonVersion()).toMatch(/^Python 3\.13\.\d+ \(CPython\)$/);
    expect(tools.python).toBe(pythonVersion());
  });

  it('executes a valid example and matches its output exactly, with input() on stdin', () => {
    const e = py('name = input()\nprint(f"Hai, {name}!", 6 * 7)', { expectedOutput: 'Hai, Aina! 42', input: 'Aina' });
    expect(verifyExample(e, tools)).toEqual({ e, outcome: 'executed' });
  });

  it('reports a different output as a failure, never as executed', () => {
    const r = verifyExample(py('print(1 + 1)', { expectedOutput: '3' }), tools);
    expect(r.outcome).toBe('failed');
    expect(r.detail).toContain('stdout "2"');
  });

  it.each([
    ['runtime error', 'x = 10\ny = 0\nprint(x / y)', 'example.py:3: ZeroDivisionError: division by zero'],
    ['undefined name in a function', 'def total():\n    return price * 2\n\nprint(total())', "example.py:2: NameError: name 'price' is not defined"],
    ['syntax error', 'if True\n    print(1)', "example.py:1: SyntaxError: expected ':'"],
    ['indentation error', 'def f():\nprint(1)', 'example.py:2: IndentationError: expected an indented block after function definition on line 1'],
    ['type error', 'print("Umur: " + 17)', 'example.py:1: TypeError: can only concatenate str (not "int") to str'],
    ['key error', 'stok = {"pen": 3}\nprint(stok["pensel"])', "example.py:2: KeyError: 'pensel'"],
  ])('matches a broken example (%s) with its exact first error line', (_name, code, error) => {
    const e = py(code, { expectedError: error });
    expect(verifyExample(e, tools)).toEqual({ e, outcome: 'error-matched' });
  });

  it('rejects a broken example whose documented error is wrong, and one that does not fail', () => {
    expect(verifyExample(py('print(1 / 0)', { expectedError: 'example.py:1: ValueError: nope' }), tools).outcome).toBe('failed');
    expect(verifyExample(py('print("fine")', { expectedError: 'example.py:1: ValueError: nope' }), tools).outcome).toBe('failed');
  });

  it('prints output produced before an error, then reports the error', () => {
    const r = run(py('print("before")\nraise ValueError("after")'));
    expect(r.stdout).toBe('before');
    expect(firstErrorLine(r.stderr)).toBe('example.py:2: ValueError: after');
    expect(r.status).toBe(1);
  });

  it('is deterministic (set order with a fixed hash seed) and isolated (files stay in its own directory)', () => {
    const code = 'print({"kucing", "arnab", "ikan", "burung"})\nopen("nota.txt", "w").write("ok")\nprint(open("nota.txt").read())';
    const a = run(py(code));
    const b = run(py(code));
    expect(a.status).toBe(0);
    expect(a.stdout).toBe(b.stdout);
    expect(a.stdout.split('\n')[1]).toBe('ok');
  });

  it('treats sys.exit(0) as success and a non-zero exit as an error', () => {
    expect(run(py('import sys\nprint("done")\nsys.exit(0)')).status).toBe(0);
    expect(firstErrorLine(run(py('import sys\nsys.exit(3)')).stderr)).toBe('example.py:2: SystemExit: 3');
  });

  it('collects Python examples and broken variants from a course-materials package and verifies both', () => {
    const pkg: ContentPackage = {
      id: 'test-python', version: '0.0.0', title: { ms: 'Ujian', en: 'Test' }, glossary: [],
      lectures: [{
        courseCode: 'PY999', module: 1, lecture: 1,
        sections: [{ kind: 'code_demonstration', blocks: [{
          type: 'code', id: 'sum', language: 'python', runtime: 'python', title: { ms: 'Jumlah', en: 'Sum' },
          code: 'markah = [70, 85, 90]\nprint(sum(markah) / len(markah))', expectedOutput: '81.66666666666667',
          debug: { code: 'markah = [70, 85, "90"]\nprint(sum(markah) / len(markah))', error: "example.py:2: TypeError: unsupported operand type(s) for +: 'int' and 'str'", explanation: { ms: 'x', en: 'x' } },
        }] }],
      }],
    };
    const units = collectCodeExamples(pkg);
    expect(units.map((u) => [u.key, u.runtime])).toEqual([['PY999 1.1#sum', 'python'], ['PY999 1.1#sum:debug', 'python']]);
    expect(units.map((u) => verifyExample(u, tools).outcome)).toEqual(['executed', 'error-matched']);
  });

  it('verifies Python code inside packaged module materials (module unit → CPython 3.13 → executed)', () => {
    const examples = 'Worked example for the test module.\n\n```python\nsenarai = [3, 1, 2]\nprint(sorted(senarai))\n```\n\n```output\n[1, 2, 3]\n```';
    const pkg: ContentPackage = {
      id: 'test-modules', version: '0.0.0', title: { ms: 'Ujian', en: 'Test' }, glossary: [], lectures: [],
      modules: [{ courseCode: 'PY999', module: 1, sections: [{ kind: 'examples', body: { ms: examples, en: examples } }] }],
    };
    const [unit] = collectCodeExamples(pkg);
    expect(unit).toMatchObject({ key: 'PY999 M1#examples-1', runtime: 'python', expectedOutput: '[1, 2, 3]' });
    expect(verifyExample(unit!, tools).outcome).toBe('executed');
    expect(verifyExample({ ...unit!, expectedOutput: '[3, 1, 2]' }, tools).outcome).toBe('failed');
  });
});
