import { hash53 } from '@/lib/hash';
import type { CodeExample } from '@/db/content/validate';
import manifest from './verification.json';

/**
 * Execution status of course-material code, produced by `npm run verify:code` and committed with the
 * content. A status is shown ONLY when the stored hash equals the hash of the code as it is now —
 * if anyone edits an example without re-running the verifier, the reader says "not verified".
 *
 * - executed       ran with the reference interpreter; stdout matched expectedOutput exactly
 * - error-matched  a debug variant ran and failed with exactly the documented error
 * - compiled       Roblox code: compiled with the Luau compiler (syntax OK) — NOT executed
 * - failed         the last verification run failed (never shipped: a test forbids it)
 */
export type VerificationStatus = 'executed' | 'error-matched' | 'compiled' | 'failed';

export interface VerificationManifest {
  generatedAt: string;
  /** `python` is absent in manifests written before Python support (backward compatible). */
  tools: { lua54: string; luau: string; python?: string };
  results: Record<string, { hash: string; status: VerificationStatus }>;
}

export const VERIFICATION = manifest as VerificationManifest;

/** Status of a module code example (key from moduleUnitKey), tied to its exact code and expected output. */
export function moduleUnitStatus(unit: { key: string; runtime: string; code: string; expectedOutput?: string }): VerificationStatus | null {
  return verificationOf(unit.key, { runtime: unit.runtime as CodeExample['runtime'], code: unit.code, expectedOutput: unit.expectedOutput });
}

/** The reference tool that verified a runtime's examples, as recorded in the manifest. */
export function verificationTool(runtime: string): string {
  if (runtime === 'lua54') return VERIFICATION.tools.lua54;
  if (runtime === 'python') return VERIFICATION.tools.python ?? 'Python 3.13';
  return VERIFICATION.tools.luau;
}

/** Hash of everything that determines a verification result. */
export function exampleHash(e: Pick<CodeExample, 'runtime' | 'code' | 'expectedOutput' | 'input' | 'expectedError'>): string {
  return hash53(JSON.stringify([e.runtime, e.code, e.expectedOutput ?? null, e.input ?? null, e.expectedError ?? null]));
}

/** Status for an example as it is now, or null when it has not been verified in its current form. */
export function verificationOf(key: string, e: Parameters<typeof exampleHash>[0]): VerificationStatus | null {
  const r = VERIFICATION.results[key];
  if (!r || r.hash !== exampleHash(e) || r.status === 'failed') return null;
  return r.status;
}
