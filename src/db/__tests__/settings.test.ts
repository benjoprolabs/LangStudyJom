import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, updateSettings, validateSettingsPatch, withDefaults } from '@/db/repositories/settings';
import { freshDb } from '@/test/helpers';

describe('settings', () => {
  it('defaults to Bahasa Melayu and dark theme', () => {
    expect(DEFAULT_SETTINGS.language).toBe('ms');
    expect(DEFAULT_SETTINGS.theme).toBe('dark');
  });

  it('fills missing fields from defaults for older rows', () => {
    const s = withDefaults({ language: 'en' } as never);
    expect(s.language).toBe('en');
    expect(s.autoSnapshotRetention).toBe(DEFAULT_SETTINGS.autoSnapshotRetention);
  });

  it('validates patches', () => {
    expect(validateSettingsPatch({ language: 'fr' as never })).toEqual(['language']);
    expect(validateSettingsPatch({ dailyStudyGoalMinutes: -1, autoSnapshotRetention: 0, backupReminderDays: 1.5 })).toEqual([
      'dailyStudyGoalMinutes',
      'autoSnapshotRetention',
      'backupReminderDays',
    ]);
    expect(validateSettingsPatch({ theme: 'system', weeklyStudyGoalMinutes: 300 })).toEqual([]);
  });

  it('saves valid patches and rejects invalid ones without writing', async () => {
    const db = await freshDb();
    await updateSettings(db, { language: 'en', dailyStudyGoalMinutes: 90 });
    expect(await db.settings.get('app')).toMatchObject({ language: 'en', dailyStudyGoalMinutes: 90 });
    await expect(updateSettings(db, { dailyStudyGoalMinutes: 99999 })).rejects.toThrow('invalid_settings');
    expect((await db.settings.get('app'))?.dailyStudyGoalMinutes).toBe(90);
  });
});
