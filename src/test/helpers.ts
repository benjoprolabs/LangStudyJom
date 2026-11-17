import { QhazeDatabase } from '@/db/database';
import { bootstrapDatabase } from '@/db/bootstrap';

let counter = 0;

/** A fresh, bootstrapped database with a unique name (isolated per test). */
export async function freshDb(): Promise<QhazeDatabase> {
  const db = new QhazeDatabase(`test-db-${Date.now()}-${counter++}`);
  const result = await bootstrapDatabase(db);
  if (result.status !== 'ready') throw new Error(`bootstrap failed: ${JSON.stringify(result)}`);
  return db;
}
