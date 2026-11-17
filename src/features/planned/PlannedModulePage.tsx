import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle2, Construction, Database } from 'lucide-react';
import type { NavItem, PlannedModuleKey } from '@/app/navigation';
import { db } from '@/db/client';
import { useI18n } from '@/i18n/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

/**
 * Honest placeholder for modules scheduled in later phases: states which phase
 * delivers it and which database tables are already prepared. No fake controls.
 */
export function PlannedModulePage({ item }: { item: NavItem & { key: PlannedModuleKey } }) {
  const { t, tList, formatNumber } = useI18n();
  const Icon = item.icon;
  const counts = useLiveQuery(async () => {
    const out: [string, number][] = [];
    for (const name of item.tables) out.push([name, await db.table(name).count()]);
    return out;
  }, [item.key]);

  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="accent">{t('planned.phaseLabel', { phase: item.phase })}</Badge>}
        title={
          <span className="inline-flex items-center gap-3">
            <Icon className="h-7 w-7 text-accent" aria-hidden />
            {t(`nav.${item.key}`)}
          </span>
        }
        description={t(`modules.${item.key}.description`)}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={t('planned.title', { phase: item.phase })} description={t('planned.body')} icon={<Construction className="h-4 w-4" />} />
          <h3 className="mb-2 text-sm font-medium">{t('planned.features')}</h3>
          <ul className="space-y-2">
            {tList(`modules.${item.key}.features`).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </Card>
        {item.tables.length > 0 && (
          <Card>
            <CardHeader title={t('planned.dataReady')} icon={<Database className="h-4 w-4" />} />
            <ul className="space-y-2 text-sm">
              {(counts ?? item.tables.map((n) => [n, undefined] as const)).map(([name, n]) => (
                <li key={name} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />
                  <code className="flex-1 font-mono text-xs">{name}</code>
                  <span className="text-xs text-muted">{n === undefined ? '–' : t('common.records', { count: formatNumber(n) })}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </>
  );
}
