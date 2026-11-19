import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from './Button';
import { Input } from './Field';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  tone?: 'danger' | 'primary';
  /** When set, the user must type this word exactly to enable the confirm button. */
  requireWord?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Modal confirmation for destructive operations, built on the native <dialog> element. */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  tone = 'danger',
  requireWord,
  busy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const [typed, setTyped] = useState('');
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setTyped('');
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  }, [open]);

  const canConfirm = !requireWord || typed.trim() === requireWord;

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      aria-labelledby={titleId}
      className="w-[min(92vw,30rem)] rounded-xl border border-border bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <form
        method="dialog"
        className="space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (canConfirm && !busy) onConfirm();
        }}
      >
        <div className="flex items-start gap-3">
          <div className={tone === 'danger' ? 'rounded-lg bg-danger/15 p-2 text-danger' : 'rounded-lg bg-primary/15 p-2 text-primary'}>
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 space-y-2">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            <div className="text-sm text-muted">{children}</div>
          </div>
        </div>
        {requireWord && (
          <Input
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={requireWord}
            aria-label={requireWord}
            autoComplete="off"
            spellCheck={false}
          />
        )}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant={tone === 'danger' ? 'danger' : 'primary'} disabled={!canConfirm} loading={busy}>
            {confirmLabel}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
