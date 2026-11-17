import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** A padding class passed in `className` (p-0, p-4…) replaces the default p-5 instead of fighting it. */
const HAS_PADDING = /(^|\s)p-\d/;

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const padding = className && HAS_PADDING.test(className) ? '' : 'p-5';
  return <div className={cn('rounded-xl border border-border bg-surface/80 backdrop-blur-sm', padding, className)} {...rest} />;
}

export function CardHeader({
  title,
  description,
  icon,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {icon && <div className="mt-0.5 shrink-0 rounded-lg bg-primary/15 p-2 text-primary">{icon}</div>}
        <div className="min-w-0">
          <h2 className="font-semibold leading-tight">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
