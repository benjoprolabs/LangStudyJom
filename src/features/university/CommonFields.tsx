import type { RecordStatus } from '@/db/types';
import type { FieldErrors } from '@/db/repositories/university';
import { useI18n } from '@/i18n/I18nProvider';
import type { MessageKey } from '@/i18n/translate';
import { Field, Input, Select } from '@/components/ui/Field';

export function useFieldMessage(errors: FieldErrors) {
  const { t } = useI18n();
  return (key: string) => (errors[key] ? t(`validation.${errors[key]}` as MessageKey) : undefined);
}

/** Code + order + status — shared by faculty, academy, programme and course forms. */
export function CodeOrderStatus({
  code,
  order,
  status,
  onChange,
  errors,
  showOrder = true,
}: {
  code: string;
  order?: number;
  status: RecordStatus;
  onChange: (patch: { code?: string; order?: number; status?: RecordStatus }) => void;
  errors: FieldErrors;
  showOrder?: boolean;
}) {
  const { t } = useI18n();
  const msg = useFieldMessage(errors);
  return (
    <div className={showOrder ? 'grid gap-4 sm:grid-cols-3' : 'grid gap-4 sm:grid-cols-2'}>
      <Field label={t('university.common.code')} hint={t('university.common.codeHint')} error={msg('code')}>
        {(p) => (
          <Input
            id={p.id}
            aria-describedby={p.describedBy}
            invalid={p.invalid}
            value={code}
            onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
            maxLength={20}
            autoCapitalize="characters"
            spellCheck={false}
            className="font-mono"
          />
        )}
      </Field>
      {showOrder && (
        <Field label={t('university.common.order')} hint={t('university.common.orderHint')} error={msg('order')}>
          {(p) => (
            <Input
              id={p.id}
              aria-describedby={p.describedBy}
              invalid={p.invalid}
              type="number"
              inputMode="numeric"
              min={0}
              max={9999}
              value={Number.isFinite(order) ? order : ''}
              onChange={(e) => onChange({ order: e.target.value === '' ? NaN : Number(e.target.value) })}
            />
          )}
        </Field>
      )}
      <Field label={t('university.common.status')} error={msg('status')}>
        {(p) => (
          <Select id={p.id} value={status} onChange={(e) => onChange({ status: e.target.value as RecordStatus })}>
            {(['active', 'draft', 'archived'] as const).map((s) => (
              <option key={s} value={s}>
                {t(`university.common.statuses.${s}`)}
              </option>
            ))}
          </Select>
        )}
      </Field>
    </div>
  );
}
