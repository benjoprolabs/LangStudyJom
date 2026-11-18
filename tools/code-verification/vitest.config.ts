import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

/** Separate config: executes course-material code examples with real interpreters. */
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
  define: { __APP_VERSION__: JSON.stringify('verify') },
  test: { include: ['tools/code-verification/**/*.test.ts'], environment: 'node', testTimeout: 120_000 },
});
