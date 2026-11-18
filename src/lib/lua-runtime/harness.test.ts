// @vitest-environment node
/**
 * The browser "Run Code" runner must behave exactly like the reference Lua 5.4 interpreter used by
 * `npm run verify:code`: every lua54 example prints its verified output, every debug variant fails
 * with its verified error.
 */
import { LuaFactory } from 'wasmoon';
import { describe, expect, it } from 'vitest';
import { CONTENT_PACKAGES } from '@/content';
import { collectCodeExamples } from '@/db/content/validate';
import { runInEngine } from './harness';

const factory = new LuaFactory();
const examples = CONTENT_PACKAGES.flatMap((p) => collectCodeExamples(p)).filter((e) => e.runtime === 'lua54');

async function run(code: string, input?: string) {
  const engine = await factory.createEngine({ injectObjects: false, enableProxy: false });
  try {
    return await runInEngine(engine, code, input);
  } finally {
    engine.global.close();
  }
}

describe('browser Lua runner (wasmoon) matches the reference interpreter', () => {
  it('reports Lua 5.4', async () => {
    expect(await run('print(_VERSION, math.type(1), math.type(1.0), 7 // 2)')).toEqual({ ok: true, output: 'Lua 5.4\tinteger\tfloat\t3', error: '' });
  });

  it.each(examples.map((e) => [e.key, e] as const))('%s', async (_k, e) => {
    const r = await run(e.code, e.input);
    if (e.expectedError !== undefined) {
      expect(r.ok).toBe(false);
      expect(r.error).toBe(e.expectedError);
    } else {
      expect(r).toEqual({ ok: true, output: e.expectedOutput, error: '' });
    }
  });

  it('io.read formats, io.write float formatting and io.stdout:write', async () => {
    const r = await run('local n = io.read("n"); local rest = io.read("l"); local line = io.read("L"); io.write(n * 1.5, "|", rest, "|", line); io.stdout:write("x"):write("y\\n"); print(io.read("a") == "", io.read("l"))', '4 apples\nsecond\n');
    expect(r).toEqual({ ok: true, output: '6| apples|second\nxy\ntrue\tnil', error: '' });
  });

  it('reports compile errors and runtime errors like Lua, and isolates each run', async () => {
    expect((await run('print("a"')).error).toBe("example:1: ')' expected near <eof>");
    expect((await run('local t = nil\nreturn t.x')).error).toBe("example:2: attempt to index a nil value (local 't')");
    await run('leaked = 1');
    expect((await run('print(leaked)')).output).toBe('nil');
  });

  it('caps runaway output', async () => {
    expect((await run('while true do io.write(string.rep("x", 1000)) end')).error).toBe('output limit exceeded (200 kB)');
  });
});
