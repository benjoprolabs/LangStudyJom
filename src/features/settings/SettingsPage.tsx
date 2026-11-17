import { useEffect, useState } from 'react';
import { Languages, Monitor, Moon, Palette, ShieldCheck, Sun, Target } from 'lucide-react';
import { db } from '@/db/client';
import { updateSettings, validateSettingsPatch, type SettingsPatch } from '@/db/repositories/settings';
import type { UserSettings } from '@/db/types';
import { useSettings } from '@/hooks/useSettings';
import { useI18n } from '@/i18n/I18nProvider';
import { Card, CardHeader } from '@/components/ui/Card';
import { Field, Input } from '@/components/ui/Field';
import { PageHeader } from '@/components/ui/PageHeader';
import { Segmented } from '@/components/ui/Segmented';
import { useToast } from '@/components/ui/Toast';

type NumericKey = 'dailyStudyGoalMinutes' | 'weeklyStudyGoalMinutes' | 'autoSnapshotRetention' | 'backupReminderDays';

export function SettingsPage() {
  const { t } = useI18n();
  const settings = useSettings();
  const toast = useToast();
  if (!settings) return <p className="text-sm text-muted">{t('common.loading')}</p>;

  const save = async (patch: SettingsPatch) => {
    try {
      await updateSettings(db, patch);
      toast.success(t('settings.updated'));
    } catch {
      toast.error(t('common.saveFailed'));
    }
  };

  return (
    <>
      <PageHeader eyebrow={t('nav.groups.system')} title={t('settings.title')} description={t('settings.subtitle')} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t('language.label')} description={t('settings.languageHint')} icon={<Languages className="h-4 w-4" />} />
          <Segmented
            label={t('language.label')}
            value={settings.language}
            onChange={(v) => void save({ language: v })}
            options={[
              { value: 'ms', label: t('language.ms') },
              { value: 'en', label: t('language.en') },
            ]}
          />
        </Card>

        <Card>
          <CardHeader title={t('settings.appearance')} description={t('settings.appearanceHint')} icon={<Palette className="h-4 w-4" />} />
          <Segmented
            label={t('theme.label')}
            value={settings.theme}
            onChange={(v) => void save({ theme: v })}
            options={[
              { value: 'dark', label: t('theme.dark'), icon: <Moon className="h-3.5 w-3.5" /> },
              { value: 'light', label: t('theme.light'), icon: <Sun className="h-3.5 w-3.5" /> },
              { value: 'system', label: t('theme.system'), icon: <Monitor className="h-3.5 w-3.5" /> },
            ]}
          />
        </Card>

        <Card>
          <CardHeader title={t('settings.study')} icon={<Target className="h-4 w-4" />} />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberSetting settings={settings} field="dailyStudyGoalMinutes" label={t('settings.dailyGoal')} min={0} max={1440} onSave={save} />
            <NumberSetting settings={settings} field="weeklyStudyGoalMinutes" label={t('settings.weeklyGoal')} min={0} max={10080} onSave={save} />
          </div>
        </Card>

        <Card>
          <CardHeader title={t('settings.dataSafety')} icon={<ShieldCheck className="h-4 w-4" />} />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberSetting
              settings={settings}
              field="autoSnapshotRetention"
              label={t('settings.retention')}
              hint={t('settings.retentionHint')}
              min={1}
              max={100}
              onSave={save}
            />
            <NumberSetting
              settings={settings}
              field="backupReminderDays"
              label={t('settings.reminder')}
              hint={t('settings.reminderHint')}
              min={0}
              max={365}
              onSave={save}
            />
          </div>
        </Card>
      </div>
    </>
  );
}

/** Numeric input that validates locally and saves on blur / Enter. */
function NumberSetting({
  settings,
  field,
  label,
  hint,
  min,
  max,
  onSave,
}: {
  settings: UserSettings;
  field: NumericKey;
  label: string;
  hint?: string;
  min: number;
  max: number;
  onSave: (p: SettingsPatch) => Promise<void>;
}) {
  const { t } = useI18n();
  const stored = settings[field];
  const [draft, setDraft] = useState(String(stored));
  useEffect(() => setDraft(String(stored)), [stored]);

  const parsed = Number(draft);
  const invalid = draft.trim() === '' || validateSettingsPatch({ [field]: parsed }).length > 0;

  const commit = () => {
    if (invalid || parsed === stored) return;
    void onSave({ [field]: parsed });
  };

  return (
    <Field label={label} hint={hint} error={invalid ? t('validation.invalid_number') : undefined}>
      {(p) => (
        <Input
          id={p.id}
          aria-describedby={p.describedBy}
          invalid={p.invalid}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && commit()}
        />
      )}
    </Field>
  );
}
