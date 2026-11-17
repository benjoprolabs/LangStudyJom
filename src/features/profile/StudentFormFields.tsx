import type { StudentFieldError, StudentInput } from '@/db/repositories/student';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { useI18n } from '@/i18n/I18nProvider';

type Errors = Partial<Record<keyof StudentInput, StudentFieldError>>;

/** Reusable profile fields used by onboarding and the profile page. */
export function StudentFormFields({
  value,
  onChange,
  errors,
  showErrors,
}: {
  value: StudentInput;
  onChange: (next: StudentInput) => void;
  errors: Errors;
  showErrors: boolean;
}) {
  const { t } = useI18n();
  const set = (key: keyof StudentInput) => (e: { target: { value: string } }) => onChange({ ...value, [key]: e.target.value });
  const err = (key: keyof StudentInput) => (showErrors && errors[key] ? t(`validation.${errors[key]!}`) : undefined);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={t('profile.fullName')} error={err('fullName')}>
        {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={value.fullName} onChange={set('fullName')} autoComplete="name" maxLength={120} />}
      </Field>
      <Field label={t('profile.preferredName')} hint={t('profile.preferredNameHint')} error={err('preferredName')}>
        {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={value.preferredName} onChange={set('preferredName')} autoComplete="nickname" maxLength={60} />}
      </Field>
      <div className="sm:col-span-2">
        <Field label={t('profile.email')} optionalLabel={t('common.optional')} hint={t('profile.emailHint')} error={err('email')}>
          {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} type="email" value={value.email ?? ''} onChange={set('email')} autoComplete="email" />}
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label={t('profile.goals')} optionalLabel={t('common.optional')} error={err('goals')}>
          {(p) => <Textarea id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={value.goals ?? ''} onChange={set('goals')} placeholder={t('profile.goalsPlaceholder')} maxLength={2000} />}
        </Field>
      </div>
    </div>
  );
}
