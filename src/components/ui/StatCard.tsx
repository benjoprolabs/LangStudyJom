import type { ReactNode } from 'react';
import { Card } from './Card';

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon: ReactNode }) {
  return (
    <Card className="flex items-start gap-4 p-4">
      <div className="rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-2.5 text-accent">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      </div>
    </Card>
  );
}
