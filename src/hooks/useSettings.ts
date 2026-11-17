import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/client';
import { withDefaults } from '@/db/repositories/settings';
import type { UserSettings } from '@/db/types';

/** Live settings row; `undefined` while loading. */
export function useSettings(): UserSettings | undefined {
  return useLiveQuery(async () => {
    const row = await db.settings.get('app');
    return row ? withDefaults(row) : undefined;
  }, []);
}
