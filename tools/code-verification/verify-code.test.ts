/**
 * Executes every code example in the course-material packages (Professional Programming Education
 * Standard, Part L) and records the result:
 *
 *   npm run verify:code
 *
 * - runtime 'lua54'  → official Lua 5.4 C interpreter via `lupa` (pip install lupa);
 *                       runner tools/code-verification/run-lua54.py. `input` is fed to stdin.
 * - runtime 'luau'   → official Luau VM via tools/luau-runner (cargo build; see its README);
 *                       override the binary with LUAU_RUNNER=/path/to/luau-runner
 * - runtime 'roblox' → COMPILED ONLY with the Luau compiler (`luau-runner --check`): proves the
 *                       syntax, never executes. Roblox APIs exist only in Roblox Studio.
 * - debug variants   → must FAIL with exactly the documented first error line (lua54 / luau);
 *                       Roblox variants are compiled only.
 *
 * Outputs: docs/CODE-VERIFICATION.md (human report) and src/content/verification.json (manifest the
 * reader uses for "Actual Execution Status"; each entry is tied to a hash of the exact code).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_PACKAGES } from '@/content';
import { exampleHash, type VerificationManifest, type VerificationStatus } from '@/content/verification';
import { collectCodeExamples, type CodeExample } from '@/db/content/validate';

const ROOT = resolve(__dirname, '../..');
const LUAU_RUNNER = process.env.LUAU_RUNNER ?? join(ROOT, 'tools/luau-runner/target/release/luau-runner');
const LUA_RUNNER = join(ROOT, 'tools/code-verification/run-lua54.py');

type Outcome = VerificationStatus | 'tool-missing';
type Result = { e: CodeExample; outcome: Outcome; detail?: string };

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

/** First line of an interpreter error, without the runner's "runtime error: " / "syntax error: " prefix. */
export function firstErrorLine(stderr: string): string {
  return (stderr.trim().split('\n')[0] ?? '').replace(/^(runtime|syntax) error: /, '').trim();
}

function run(e: CodeExample, checkOnly = false) {
  const dir = mkdtempSync(join(tmpdir(), 'qhaze-code-'));
  const file = join(dir, e.language === 'lua' ? 'example.lua' : 'example.luau');
  writeFileSync(file, e.code);
  const r = e.runtime === 'lua54'
    ? spawnSync('python3', [LUA_RUNNER, file], { input: e.input ?? '', encoding: 'utf-8', timeout: 20_000 })
    : spawnSync(LUAU_RUNNER, checkOnly ? ['--check', file] : [file], { encoding: 'utf-8', timeout: 20_000 });
  return { stdout: (r.stdout ?? '').replace(/\r\n/g, '\n').replace(/\n$/, ''), stderr: r.stderr ?? '', status: r.status };
}

const examples = CONTENT_PACKAGES.flatMap((pkg) => collectCodeExamples(pkg));
const tools = { lua54: lupaVersion(), luau: luauVersion() };
const results: Result[] = [];

function verify(e: CodeExample): Result {
  const tool = e.runtime === 'lua54' ? tools.lua54 : tools.luau;
  if (!tool) return { e, outcome: 'tool-missing' };
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

const LABEL: Record<Outcome, string> = {
  executed: '✅ executed, output matched',
  'error-matched': '✅ executed, failed with the documented error',
  compiled: '🔷 compiled only (Roblox Studio required to run)',
  failed: '❌ failed',
  'tool-missing': '⚠️ tool missing (not verified)',
};

describe('course-material code examples', () => {
  it.each(examples.map((e) => [`${e.key} (${e.runtime})`, e] as const))('%s', (_name, e) => {
    const r = verify(e);
    results.push(r);
    expect(r.detail ?? '', e.key).toBe('');
  });

  it('writes docs/CODE-VERIFICATION.md and src/content/verification.json', () => {
    const count = (o: Outcome) => results.filter((r) => r.outcome === o).length;
    const date = new Date().toISOString().slice(0, 10);
    const manifest: VerificationManifest = {
      generatedAt: date,
      tools: { lua54: tools.lua54 ?? 'missing', luau: tools.luau ?? 'missing' },
      results: Object.fromEntries(
        results.filter((r) => r.outcome !== 'tool-missing').map((r) => [r.e.key, { hash: exampleHash(r.e), status: r.outcome as VerificationStatus }]),
      ),
    };
    writeFileSync(join(ROOT, 'src/content/verification.json'), `${JSON.stringify(manifest, null, 1)}\n`);
    const lines = [
      '# Code example verification',
      '',
      `Generated by \`npm run verify:code\` on ${date} with ${tools.lua54 ?? 'Lua 5.4: MISSING'} and ${tools.luau ?? 'Luau: MISSING'}.`,
      '',
      '| Runtime | How it is verified |',
      '|---|---|',
      '| `lua54` | Executed with the official Lua 5.4 C interpreter (via `lupa`), with the example\'s `input` on stdin; stdout must match exactly |',
      '| `luau` | Executed with the official Luau VM (`tools/luau-runner`); stdout must match exactly. **The type checker (luau-analyze) is not run** |',
      '| `roblox` | **Not executed.** Compiled with the Luau compiler (`luau-runner --check`) to prove the syntax; behaviour in Roblox Studio is described, not verified |',
      '| debug variants | Executed and must fail with exactly the documented first error line (Roblox variants: compiled only) |',
      '',
      `**Summary:** ${results.length} units · ${count('executed')} executed · ${count('error-matched')} debug variants failed as documented · ${count('compiled')} Roblox units compiled only · ${count('failed')} failed · ${count('tool-missing')} not verified (tool missing)`,
      '',
      '| Example | Runtime | Result |',
      '|---|---|---|',
      ...results.map((r) => `| \`${r.e.key}\` | ${r.e.runtime} | ${LABEL[r.outcome]}${r.detail ? `: ${r.detail}` : ''} |`),
      '',
    ];
    writeFileSync(join(ROOT, 'docs/CODE-VERIFICATION.md'), lines.join('\n'));
    expect(count('failed')).toBe(0);
  });
});
