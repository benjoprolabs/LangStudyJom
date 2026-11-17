/**
 * Regression (found in Phase 2 Step 0 browser testing): a query issued while bootstrap was
 * still running auto-opened — and silently upgraded — the database, so no pre-migration
 * recovery point was taken. The app database must never open itself.
 */
import Dexie from 'dexie';
import { describe, expect, it } from 'vitest';
import { db } from '@/db/client';
import { DB_NAME } from '@/db/schema';

describe('boot safety', () => {
  it('the app database does not auto-open: premature queries fail and do not create/upgrade it', async () => {
    expect(db.isOpen()).toBe(false);
    await expect(db.settings.get('app')).rejects.toMatchObject({ name: 'DatabaseClosedError' });
    expect(await Dexie.exists(DB_NAME)).toBe(false);
  });
});
