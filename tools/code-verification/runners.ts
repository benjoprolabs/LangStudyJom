/**
 * Reference interpreters for course-material code (shared by verify-code.test.ts and the runner tests).
 *
 * - lua54  → official Lua 5.4 C interpreter via `lupa` (tools/code-verification/run-lua54.py), input on stdin
 * - luau   → official Luau VM (tools/luau-runner); override with LUAU_RUNNER=/path/to/luau-runner
 * - roblox → COMPILED ONLY with the Luau compiler (`luau-runner --check`); never executed
 * - python → CPython 3.13 (tools/code-verification/run-python.py), input on stdin, run in the example's own
 *            temporary directory with PYTHONHASHSEED=0 (deterministic set/dict-of-str ordering) and a minimal
 *            environment; override the interpreter with PYTHON313=/path/to/python3.13
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import type { VerificationStatus } from '@/content/verification';
import type { CodeExample } from '@/db/content/validate';

export const ROOT = resolve(__dirname, '../..');
const LUAU_RUNNER = process.env.LUAU_RUNNER ?? join(ROOT, 'tools/luau-runner/target/release/luau-runner');
const LUA_RUNNER = join(ROOT, 'tools/code-verification/run-lua54.py');
export const PYTHON_RUNNER = join(ROOT, 'tools/code-verification/run-python.py');
export const PYTHON = process.env.PYTHON313 ?? 'python3';

export type Outcome = VerificationStatus | 'tool-missing';
export type Result = { e: CodeExample; outcome: Outcome; detail?: string };
export interface Tools {
  lua54: string | null;
  luau: string | null;
  python: string | null;
}

function lupaVersion(): string | null {
  const r = spawnSync('python3', ['-c', 'import lupa, lupa.lua54 as m, os, re; so=[f for f in os.listdir(os.path.dirname(m.__file__)) if f.startswith("lua54")][0]; d=open(os.path.join(os.path.dirname(m.__file__), so),"rb").read(); v=re.search(rb"Lua 5\\.4\\.\\d+", d); print((v.group().decode() if v else "Lua 5.4") + " (lupa " + lupa.__version__ + ")")'], { encoding: 'utf-8' });
  return r.status === 0 ? r.stdout.trim() : null;
}

function luauVersion(): string | null {
  if (!existsSync(LUAU_RUNNER)) return null;
  const lock = readFileSync(join(ROOT, 'tools/luau-runner/Cargo.lock'), 'utf-8');
  const v = /name = "luau0-src"\nversion = "[^"+]*\+luau(\d+)"/.exec(lock)?.[1];
  return `Luau 0.${v ?? '?'} (luau-runner, mlua)`;
}

/** "Python 3.13.x (CPython)", or null when the interpreter is missing or is not Python 3.13. */
export function pythonVersion(): string | null {
  const r = spawnSync(PYTHON, ['-c', 'import sys, platform; print(platform.python_implementation(), sys.version.split()[0])'], { encoding: 'utf-8' });
  if (r.status !== 0) return null;
  const [impl, version] = r.stdout.trim().split(' ');
  return version?.startsWith('3.13.') ? `Python ${version} (${impl})` : null;
}

export const toolVersions = (): Tools => ({ lua54: lupaVersion(), luau: luauVersion(), python: pythonVersion() });

/** First line of an interpreter error, without the Luau runner's "runtime error: " / "syntax error: " prefix. */
export function firstErrorLine(stderr: string): string {
  return (stderr.trim().split('\n')[0] ?? '').replace(/^(runtime|syntax) error: /, '').trim();
}

export function run(e: Pick<CodeExample, 'language' | 'runtime' | 'code' | 'input'>, checkOnly = false) {
  const dir = mkdtempSync(join(tmpdir(), 'qhaze-code-'));
  const file = join(dir, e.language === 'python' ? 'example.py' : e.language === 'lua' ? 'example.lua' : 'example.luau');
  writeFileSync(file, e.code);
  const r =
    e.runtime === 'lua54'
      ? spawnSync('python3', [LUA_RUNNER, file], { input: e.input ?? '', encoding: 'utf-8', timeout: 20_000 })
      : e.runtime === 'python'
        ? spawnSync(PYTHON, ['-B', '-P', '-s', PYTHON_RUNNER, file], {
            input: e.input ?? '',
            encoding: 'utf-8',
            timeout: 20_000,
            cwd: dir,
            env: { PATH: process.env.PATH ?? '', PYTHONHASHSEED: '0', PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', HOME: dir },
          })
        : spawnSync(LUAU_RUNNER, checkOnly ? ['--check', file] : [file], { encoding: 'utf-8', timeout: 20_000 });
  return { stdout: (r.stdout ?? '').replace(/\r\n/g, '\n').replace(/\n$/, ''), stderr: r.stderr ?? '', status: r.status };
}

const toolFor = (runtime: string, tools: Tools) => (runtime === 'lua54' ? tools.lua54 : runtime === 'python' ? tools.python : tools.luau);

/** Execute (or, for Roblox, compile) one unit and compare it with its documented output or error. */
export function verifyExample(e: CodeExample, tools: Tools): Result {
  if (!toolFor(e.runtime, tools)) return { e, outcome: 'tool-missing' };
  if (e.runtime === 'roblox') {
    const r = run(e, true);
    if (e.expectedError !== undefined) {
      // A Roblox debug variant either compiles (its error happens in Studio) or is a syntax error we can check.
      if (r.status === 0) return { e, outcome: 'compiled' };
      return firstErrorLine(r.stderr) === e.expectedError ? { e, outcome: 'error-matched' } : { e, outcome: 'failed', detail: `compile error ${JSON.stringify(firstErrorLine(r.stderr))}` };
    }
    return r.status === 0 ? { e, outcome: 'compiled' } : { e, outcome: 'failed', detail: `does not compile: ${firstErrorLine(r.stderr)}` };
  }
  const r = run(e);
  if (e.expectedError !== undefined) {
    const got = firstErrorLine(r.stderr);
    return r.status !== 0 && got === e.expectedError ? { e, outcome: 'error-matched' } : { e, outcome: 'failed', detail: `exit ${r.status}; error ${JSON.stringify(got)}` };
  }
  return r.status === 0 && r.stdout === (e.expectedOutput ?? '')
    ? { e, outcome: 'executed' }
    : { e, outcome: 'failed', detail: `exit ${r.status}; stdout ${JSON.stringify(r.stdout)}; stderr ${JSON.stringify(firstErrorLine(r.stderr))}` };
}
