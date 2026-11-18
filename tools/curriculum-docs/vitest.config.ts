import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

/** Separate config: regenerates the data-driven tables in docs/CURRICULUM.md. */
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
  define: { __APP_VERSION__: JSON.stringify('docs') },
  test: { include: ['tools/curriculum-docs/**/*.test.ts'], environment: 'node' },
});
