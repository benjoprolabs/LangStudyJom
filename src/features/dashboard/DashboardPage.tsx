import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Activity,
  Award,
  BookCheck,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock,
  Database,
  Flame,
  GraduationCap,
  Landmark,
  TriangleAlert,
} from 'lucide-react';
import { db } from '@/db/client';
import { recentActivity } from '@/db/repositories/activity';
import { countAllRecords, getUniversityStats } from '@/db/repositories/stats';
import { CURRENT_SCHEMA_VERSION } from '@/db/schema';
import { useSettings } from '@/hooks/useSettings';
import { useStudent } from '@/hooks/useStudent';
import type { ActivityLogEntry } from '@/db/types';
import { ms as msDict } from '@/i18n/locales/ms';

const ENTITY_KEYS = msDict.entities;
type EntityKey = keyof typeof ENTITY_KEYS;
import { useI18n } from '@/i18n/I18nProvider';
import { daysSince } from '@/lib/time';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatCard } from '@/components/ui/StatCard';
import { useStorageStatus } from '@/features/backup/useStorageStatus';

export function DashboardPage() {
  const { t, formatDate, formatNumber } = useI18n();
  const student = useStudent();
  const settings = useSettings();
  const stats = useLiveQuery(() => getUniversityStats(db), []);
  const activity = useLiveQuery(() => recentActivity(db, 8), []);
  const totalRecords = useLiveQuery(() => countAllRecords(db), []);
  const lastBackup = useLiveQuery(async () => (await db.meta.get('lastBackupAt'))?.value as string | undefined, []);
  const languageChosen = useLiveQuery(
    async () =>
      (await db.activityLog
        .where('type')
        .equals('settings.updated')
        .filter((e) => String(e.details?.fields ?? '').split(',').includes('language'))
        .count()) > 0,
    [],
  );
  const { status: storage } = useStorageStatus();

  const hours = (min: number) => formatNumber(min / 60, 1);
  const activityLabel = (a: ActivityLogEntry) => {
    const d = a.details ?? {};
    const entity = typeof d.entity === 'string' && d.entity in ENTITY_KEYS ? t(`entities.${d.entity as EntityKey}`) : '';
    return t(`activity.${a.type}`, { code: String(d.code ?? ''), entity });
  };
  const weeklyGoal = settings?.weeklyStudyGoalMinutes ?? 0;

  const checklist = [
    { done: Boolean(student), label: t('dashboard.gettingStarted.profile'), to: '/profile' },
    { done: Boolean(languageChosen), label: t('dashboard.gettingStarted.language'), to: '/settings' },
    { done: storage.persisted === true, label: t('dashboard.gettingStarted.persist'), to: '/backup' },
    { done: Boolean(lastBackup), label: t('dashboard.gettingStarted.backup'), to: '/backup' },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  const reminderDays = settings?.backupReminderDays ?? 0;
  const backupAge = lastBackup ? daysSince(lastBackup) : null;
  const backupDue = reminderDays > 0 && (backupAge === null || backupAge >= reminderDays);

  return (
    <>
      <PageHeader
        eyebrow={student?.studentNumber}
        title={student ? t('dashboard.greeting', { name: student.preferredName }) : t('nav.dashboard')}
        description={t('dashboard.subtitle')}
      />

      {backupDue && (
        <div role="status" className="mb-6 flex flex-col gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm sm:flex-row sm:items-center">
          <TriangleAlert className="h-5 w-5 shrink-0 text-warning" aria-hidden />
          <p className="flex-1">
            {backupAge === null ? t('dashboard.system.backupNever') : t('dashboard.system.backupDue', { days: backupAge })}
          </p>
          <Link to="/backup">
            <Button size="sm" variant="secondary">
              {t('dashboard.system.backupNow')}
            </Button>
          </Link>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label={t('nav.dashboard')}>
        <StatCard icon={<GraduationCap className="h-5 w-5" />} label={t('dashboard.stats.activeProgrammes')} value={stats ? formatNumber(stats.activeEnrollments) : '–'} />
        <StatCard icon={<BookCheck className="h-5 w-5" />} label={t('dashboard.stats.completedLectures')} value={stats ? formatNumber(stats.completedLectures) : '–'} />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label={t('dashboard.stats.weekStudy')}
          value={stats ? t('common.hours', { count: hours(stats.weekStudyMinutes) }) : '–'}
          hint={
            <>
              {t('dashboard.stats.totalStudy')}: {stats ? t('common.hours', { count: hours(stats.totalStudyMinutes) }) : '–'}
              {weeklyGoal > 0 && stats && (
                <ProgressBar className="mt-2" value={(stats.weekStudyMinutes / weeklyGoal) * 100} label={t('dashboard.stats.weeklyGoal', { goal: weeklyGoal })} />
              )}
            </>
          }
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label={t('dashboard.stats.streak')}
          value={stats ? t('common.days', { count: stats.streakDays }) : '–'}
          hint={`${t('dashboard.stats.gpa')}: ${t('dashboard.stats.gpaNone')}`}
        />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:items-start">
        <Card className="lg:col-span-2">
          <CardHeader title={t('dashboard.university.title')} icon={<Landmark className="h-4 w-4" />} />
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {(
              [
                ['faculties', stats?.faculties],
                ['academies', stats?.academies],
                ['programmes', stats?.programmes],
                ['courses', stats?.courses],
                ['lectures', stats?.lectures],
              ] as const
            ).map(([key, n]) => (
              <div key={key} className="rounded-lg border border-border bg-bg/40 p-3">
                <dt className="text-xs text-muted">{t(`dashboard.university.${key}`)}</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums">{n === undefined ? '–' : formatNumber(n)}</dd>
              </div>
            ))}
          </dl>
          {stats && stats.faculties === 0 && <p className="mt-4 text-sm text-muted">{t('dashboard.university.empty')}</p>}
        </Card>

        <Card>
          <CardHeader
            title={t('dashboard.gettingStarted.title')}
            description={t('dashboard.gettingStarted.done', { done: doneCount, total: checklist.length })}
            icon={<Award className="h-4 w-4" />}
          />
          <ProgressBar value={(doneCount / checklist.length) * 100} label={t('dashboard.gettingStarted.title')} className="mb-4" />
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                {item.done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden /> : <Circle className="h-4 w-4 shrink-0 text-muted" aria-hidden />}
                <span className={item.done ? 'text-muted line-through' : ''}>{item.label}</span>
                {!item.done && (
                  <Link to={item.to} className="ml-auto text-xs font-medium text-accent hover:underline">
                    {t('dashboard.gettingStarted.go')}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title={t('dashboard.activity.title')} icon={<Activity className="h-4 w-4" />} />
          {!activity || activity.length === 0 ? (
            <EmptyState>{t('dashboard.activity.empty')}</EmptyState>
          ) : (
            <ol className="space-y-3" data-testid="activity-list">
              {activity.map((a) => (
                <li key={a.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span className="flex-1">{activityLabel(a)}</span>
                  <time className="shrink-0 text-xs text-muted" dateTime={a.timestamp}>
                    {formatDate(a.timestamp, true)}
                  </time>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title={t('dashboard.upcoming.title')} icon={<CalendarClock className="h-4 w-4" />} />
            <EmptyState>{t('dashboard.upcoming.empty')}</EmptyState>
          </Card>
          <Card>
            <CardHeader title={t('dashboard.system.title')} icon={<Database className="h-4 w-4" />} />
            <dl className="space-y-2 text-sm">
              <StatusRow label={t('dashboard.system.schema')} value={`v${CURRENT_SCHEMA_VERSION}`} />
              <StatusRow label={t('dashboard.system.records')} value={totalRecords === undefined ? '–' : formatNumber(totalRecords)} />
              <StatusRow
                label={t('dashboard.system.storage')}
                value={
                  storage.persisted === null
                    ? t('dashboard.system.unsupported')
                    : storage.persisted
                      ? t('dashboard.system.persisted')
                      : t('dashboard.system.notPersisted')
                }
              />
              <StatusRow label={t('dashboard.system.lastBackup')} value={lastBackup ? formatDate(lastBackup, true) : t('common.never')} />
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
