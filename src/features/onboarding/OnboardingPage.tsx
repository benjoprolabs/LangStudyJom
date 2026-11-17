import { useState, type FormEvent } from 'react';
import { GraduationCap, Languages, Moon, Sun } from 'lucide-react';
import { db } from '@/db/client';
import { createStudent, validateStudentInput, type StudentInput } from '@/db/repositories/student';
import { updateSettings } from '@/db/repositories/settings';
import { useSettings } from '@/hooks/useSettings';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Segmented } from '@/components/ui/Segmented';
import { useToast } from '@/components/ui/Toast';
import { StudentFormFields } from '@/features/profile/StudentFormFields';
import { RestoreCard } from '@/features/backup/RestoreCard';

const EMPTY: StudentInput = { fullName: '', preferredName: '', email: '', bio: '', goals: '' };

/** First-run enrolment: shown when no student profile exists. */
export function OnboardingPage() {
  const { t, lang } = useI18n();
  const toast = useToast();
  const settings = useSettings();
  const [value, setValue] = useState<StudentInput>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const errors = validateStudentInput(value);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    setBusy(true);
    try {
      const student = await createStudent(db, value);
      toast.success(t('onboarding.created', { name: student.preferredName }));
    } catch {
      toast.error(t('common.saveFailed'));
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 inline-flex rounded-2xl bg-gradient-to-br from-primary to-accent p-3 text-white shadow-glow">
          <GraduationCap className="h-8 w-8" aria-hidden />
        </div>
        <p className="text-sm text-muted">{t('onboarding.welcome')}</p>
        <h1 className="text-gradient text-3xl font-extrabold tracking-tight sm:text-4xl">{t('app.name')}</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted">{t('onboarding.intro')}</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
        <Segmented
          label={t('language.label')}
          value={lang}
          onChange={(v) => void updateSettings(db, { language: v })}
          options={[
            { value: 'ms', label: t('language.ms'), icon: <Languages className="h-3.5 w-3.5" /> },
            { value: 'en', label: t('language.en') },
          ]}
        />
        <Segmented
          label={t('theme.label')}
          value={settings?.theme === 'light' ? 'light' : 'dark'}
          onChange={(v) => void updateSettings(db, { theme: v })}
          options={[
            { value: 'dark', label: t('theme.dark'), icon: <Moon className="h-3.5 w-3.5" /> },
            { value: 'light', label: t('theme.light'), icon: <Sun className="h-3.5 w-3.5" /> },
          ]}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">{t('onboarding.stepTitle')}</h2>
        <p className="mb-5 mt-1 text-sm text-muted">{t('onboarding.stepHint')}</p>
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <StudentFormFields value={value} onChange={setValue} errors={errors} showErrors={submitted} />
          <Button type="submit" size="lg" className="w-full justify-center" loading={busy}>
            {t('onboarding.submit')}
          </Button>
        </form>
      </Card>

      <div className="mt-6 text-center text-sm text-muted">
        {t('onboarding.restoreInstead')}{' '}
        <button type="button" className="font-medium text-accent hover:underline" onClick={() => setShowRestore((s) => !s)} aria-expanded={showRestore}>
          {t('onboarding.restoreLink')}
        </button>
      </div>
      {showRestore && (
        <div className="mt-4">
          <RestoreCard />
        </div>
      )}
    </div>
  );
}
