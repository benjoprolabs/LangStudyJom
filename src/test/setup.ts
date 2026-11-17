import 'fake-indexeddb/auto';
import { webcrypto } from 'node:crypto';

// jsdom may not expose SubtleCrypto; use Node's WebCrypto implementation.
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
}
