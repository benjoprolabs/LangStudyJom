import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/client';
import { getPrimaryStudent } from '@/db/repositories/student';
import type { Student } from '@/db/types';

/** `undefined` = loading, `null` = no profile yet. */
export function useStudent(): Student | null | undefined {
  return useLiveQuery(async () => (await getPrimaryStudent(db)) ?? null, []);
}
