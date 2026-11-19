import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

/** Separate config: the university-wide content audit (docs/content-audit/*). Read-only over the sources. */
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
  define: { __APP_VERSION__: JSON.stringify('audit') },
  test: { include: ['tools/content-audit/**/*.test.ts'], environment: 'node', testTimeout: 120_000 },
});
