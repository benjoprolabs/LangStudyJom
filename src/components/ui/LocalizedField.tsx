import { Plus, Trash2 } from 'lucide-react';
import type { LocalizedText } from '@/db/types';
import { useI18n } from '@/i18n/I18nProvider';
import type { MessageKey } from '@/i18n/translate';
import { Button } from './Button';
import { Input, Textarea } from './Field';
import { cn } from '@/lib/cn';

type Errors = Record<string, string>;

function useErr(errors: Errors) {
  const { t } = useI18n();
  return (key: string) => (errors[key] ? t(`validation.${errors[key]}` as MessageKey) : undefined);
}

/**
 * Bilingual text input: Bahasa Melayu (primary, may be required) + English (optional).
 * Error keys follow `${field}.ms` / `${field}.en` (see repositories/university.ts).
 */
export function LocalizedField({
  label,
  field,
  value,
  onChange,
  errors = {},
  required,
  multiline,
  maxLength = 120,
  hint,
}: {
  label: string;
  field: string;
  value: LocalizedText;
  onChange: (v: LocalizedText) => void;
  errors?: Errors;
  required?: boolean;
  multiline?: boolean;
  maxLength?: number;
  hint?: string;
}) {
  const { t } = useI18n();
  const err = useErr(errors);
  const Control = multiline ? Textarea : Input;
  const msErr = err(`${field}.ms`);
  const enErr = err(`${field}.en`);
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
      </legend>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-xs text-muted">{t('university.common.langMs')}</span>
          <Control
            value={value.ms}
            onChange={(e) => onChange({ ...value, ms: e.target.value })}
            invalid={Boolean(msErr)}
            aria-required={required || undefined}
            maxLength={maxLength}
            lang="ms"
            data-field={`${field}.ms`}
          />
          {msErr && <span className="block text-xs text-danger" role="alert">{msErr}</span>}
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-muted">
            {t('university.common.langEn')} <span className="opacity-70">({t('common.optional')})</span>
          </span>
          <Control
            value={value.en ?? ''}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            invalid={Boolean(enErr)}
            maxLength={maxLength}
            lang="en"
            data-field={`${field}.en`}
          />
          {enErr && <span className="block text-xs text-danger" role="alert">{enErr}</span>}
        </label>
      </div>
    </fieldset>
  );
}

/** An editable list of bilingual items (learning objectives, completion requirements…). */
export function LocalizedListField({
  label,
  field,
  items,
  onChange,
  errors = {},
  hint,
  max = 50,
}: {
  label: string;
  field: string;
  items: LocalizedText[];
  onChange: (v: LocalizedText[]) => void;
  errors?: Errors;
  hint?: string;
  max?: number;
}) {
  const { t } = useI18n();
  const err = useErr(errors);
  const set = (i: number, v: LocalizedText) => onChange(items.map((it, j) => (j === i ? v : it)));
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      <ol className="space-y-2">
        {items.map((item, i) => {
          const msErr = err(`${field}.${i}.ms`);
          return (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2.5 w-5 shrink-0 text-right text-xs text-muted">{i + 1}.</span>
              <div className={cn('grid flex-1 gap-2 sm:grid-cols-2')}>
                <div>
                  <Input
                    value={item.ms}
                    onChange={(e) => set(i, { ...item, ms: e.target.value })}
                    invalid={Boolean(msErr)}
                    aria-label={`${label} ${i + 1} — ${t('university.common.langMs')}`}
                    placeholder={t('university.common.langMs')}
                    maxLength={300}
                    lang="ms"
                  />
                  {msErr && <span className="mt-1 block text-xs text-danger" role="alert">{msErr}</span>}
                </div>
                <Input
                  value={item.en ?? ''}
                  onChange={(e) => set(i, { ...item, en: e.target.value })}
                  aria-label={`${label} ${i + 1} — ${t('university.common.langEn')}`}
                  placeholder={`${t('university.common.langEn')} (${t('common.optional')})`}
                  maxLength={300}
                  lang="en"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                aria-label={t('university.common.removeItem', { n: i + 1 })}
                title={t('university.common.removeItem', { n: i + 1 })}
                icon={<Trash2 className="h-4 w-4" />}
              />
            </li>
          );
        })}
      </ol>
      {items.length < max && (
        <Button variant="outline" size="sm" onClick={() => onChange([...items, { ms: '', en: '' }])} icon={<Plus className="h-4 w-4" />}>
          {t('university.common.addItem')}
        </Button>
      )}
    </fieldset>
  );
}
