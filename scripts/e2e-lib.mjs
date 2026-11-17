/** Shared helpers for the end-to-end suites (real Chromium against the production build). */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
export const { chromium } = require('playwright');

export async function startServer(port) {
  const base = `http://127.0.0.1:${port}/`;
  if (await fetch(base).catch(() => null)) throw new Error(`port ${port} is already in use (stale server?)`);
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    stdio: 'ignore',
    detached: true,
  });
  const stop = () => {
    try {
      process.kill(-server.pid, 'SIGTERM');
    } catch {
      /* already gone */
    }
  };
  process.on('exit', stop);
  for (let i = 0; i < 50; i++) {
    if (await fetch(base).catch(() => null)) return { base, stop };
    await new Promise((r) => setTimeout(r, 200));
  }
  stop();
  throw new Error('preview server did not start');
}

export function tempDir(prefix) {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  process.on('exit', () => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

export function createLogger() {
  let step = 0;
  return { log: (msg) => console.log(`  ✓ ${++step}. ${msg}`), count: () => step };
}

/** Launch a persistent browser profile and collect console errors. */
export async function launch(profileDir, consoleErrors, viewport = { width: 1360, height: 900 }) {
  const context = await chromium.launchPersistentContext(profileDir, { viewport, acceptDownloads: true });
  const page = context.pages()[0] ?? (await context.newPage());
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  return { context, page };
}

export async function horizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}
