import type { LuaRunResult } from './harness';

export type { LuaRunResult };
export type RunOutcome = LuaRunResult & { timedOut?: boolean };

/** Lua runtime used for "Run Code" in the browser (lazy: the worker and WASM load on first run). */
export const BROWSER_LUA = 'Lua 5.4 (wasmoon 1.16.0, WebAssembly)';

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, (r: RunOutcome) => void>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./lua.worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e: MessageEvent<{ id: number; result: LuaRunResult }>) => {
    pending.get(e.data.id)?.(e.data.result);
    pending.delete(e.data.id);
  };
  return worker;
}

/** Run Lua 5.4 code in a worker. A run that exceeds `timeoutMs` is stopped (the worker is replaced). */
export function runLua(code: string, input = '', timeoutMs = 4000): Promise<RunOutcome> {
  const id = ++seq;
  const w = getWorker();
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      w.terminate();
      if (worker === w) worker = null;
      for (const [, settle] of pending) settle({ ok: false, output: '', error: 'stopped', timedOut: true });
      pending.clear();
      resolve({ ok: false, output: '', error: '', timedOut: true });
    }, timeoutMs);
    pending.set(id, (r) => {
      clearTimeout(timer);
      resolve(r);
    });
    w.postMessage({ id, code, input });
  });
}
