/// <reference lib="webworker" />
import { LuaFactory } from 'wasmoon';
import wasmUrl from 'wasmoon/dist/glue.wasm?url';
import { runInEngine } from './harness';

/** Lua 5.4 (wasmoon) in a worker: a runaway example can be stopped by terminating the worker. */
const factory = new LuaFactory(wasmUrl);

self.onmessage = async (event: MessageEvent<{ id: number; code: string; input?: string }>) => {
  const { id, code, input } = event.data;
  const engine = await factory.createEngine({ injectObjects: false, enableProxy: false });
  try {
    const result = await runInEngine(engine, code, input);
    self.postMessage({ id, result });
  } catch (e) {
    self.postMessage({ id, result: { ok: false, output: '', error: e instanceof Error ? e.message.split('\n')[0] : String(e) } });
  } finally {
    engine.global.close();
  }
};
