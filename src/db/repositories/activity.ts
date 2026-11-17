import type { QhazeDatabase } from '../database';
import type { ActivityLogEntry } from '../types';

export async function recentActivity(db: QhazeDatabase, limit = 8): Promise<ActivityLogEntry[]> {
  return db.activityLog.orderBy('timestamp').reverse().limit(limit).toArray();
}
