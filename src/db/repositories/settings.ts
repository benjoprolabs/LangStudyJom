import { newId } from '@/lib/id';
import { nowIso } from '@/lib/time';
import type { QhazeDatabase } from '../database';
import type { UserSettings } from '../types';

export const DEFAULT_SETTINGS: Omit<UserSettings, 'updatedAt'> = {
  id: 'app',
  language: 'ms',
  theme: 'dark',
  dailyStudyGoalMinutes: 60,
  weeklyStudyGoalMinutes: 420,
  autoSnapshotRetention: 10,
  backupReminderDays: 7,
};

/** Fill in any fields missing from older rows so callers always get a complete object. */
export function withDefaults(row: Partial<UserSettings> | undefined): UserSettings {
  return { ...DEFAULT_SETTINGS, updatedAt: nowIso(), ...row, id: 'app' };
}

export async function ensureSettings(db: QhazeDatabase): Promise<UserSettings> {
  const existing = await db.settings.get('app');
  if (existing) return withDefaults(existing);
  const created = withDefaults(undefined);
  await db.settings.put(created);
  return created;
}

export type SettingsPatch = Partial<Omit<UserSettings, 'id' | 'updatedAt'>>;

export function validateSettingsPatch(patch: SettingsPatch): string[] {
  const errors: string[] = [];
  const intRange = (key: keyof SettingsPatch, min: number, max: number) => {
    const v = patch[key];
    if (v === undefined) return;
    if (typeof v !== 'number' || !Number.isInteger(v) || v < min || v > max) errors.push(key);
  };
  if (patch.language !== undefined && !['ms', 'en'].includes(patch.language)) errors.push('language');
  if (patch.theme !== undefined && !['dark', 'light', 'system'].includes(patch.theme)) errors.push('theme');
  intRange('dailyStudyGoalMinutes', 0, 1440);
  intRange('weeklyStudyGoalMinutes', 0, 10080);
  intRange('autoSnapshotRetention', 1, 100);
  intRange('backupReminderDays', 0, 365);
  return errors;
}

export async function updateSettings(db: QhazeDatabase, patch: SettingsPatch): Promise<UserSettings> {
  const errors = validateSettingsPatch(patch);
  if (errors.length) throw new Error(`invalid_settings:${errors.join(',')}`);
  return db.transaction('rw', db.settings, db.activityLog, async () => {
    const current = withDefaults(await db.settings.get('app'));
    const next: UserSettings = { ...current, ...patch, id: 'app', updatedAt: nowIso() };
    await db.settings.put(next);
    await db.activityLog.add({
      id: newId(),
      timestamp: next.updatedAt,
      type: 'settings.updated',
      details: { fields: Object.keys(patch).join(',') },
    });
    return next;
  });
}
