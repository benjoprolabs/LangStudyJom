import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CircleDashed, Layers, Loader2, PackageOpen, ShieldCheck, SkipForward, TriangleAlert, XCircle } from 'lucide-react';
import { db } from '@/db/client';
import { installPackage, planInstall, type InstallPlan } from '@/db/seed/install';
import type { CurriculumPackage } from '@/db/seed/types';
import { contentToWrite, installContentPackage, planContentInstall, type ContentPlan } from '@/db/content/install';
import type { ContentPackage } from '@/db/content/types';
import { countPackage } from '@/db/seed/validate';
import { useI18n } from '@/i18n/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

/** "Curriculum packages" button + dialog (Faculties page). */
export function CurriculumPackagesButton() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  // `?packages=content` (from the Library's "course materials not installed" notice) opens the dialog at the content card.
  const focusContent = params.get('packages') === 'content';
  const [open, setOpen] = useState(focusContent);
  useEffect(() => {
    if (!focusContent) return;
    setOpen(true);
    const next = new URLSearchParams(params);
    next.delete('packages');
    setParams(next, { replace: true });
  }, [focusContent, params, setParams]);
  // While "Install all" runs, every card's own install button is disabled (no parallel or duplicate installs).
  const [locked, setLocked] = useState(false);
  const [highlightContent, setHighlightContent] = useState(focusContent);
  // The curriculum data is large: load it only when the dialog is opened (separate chunk).
  const [packages, setPackages] = useState<CurriculumPackage[] | null>(null);
  const [content, setContent] = useState<ContentPackage[] | null>(null);
  // Bumped after any install so every card re-plans (packages share parents; content needs structure).
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    if (open && !packages) void import('@/db/seed/packages').then((m) => setPackages(m.CURRICULUM_PACKAGES));
    if (open && !content) void import('@/content').then((m) => setContent(m.CONTENT_PACKAGES));
  }, [open, packages, content]);
  const bump = useCallback(() => setGeneration((g) => g + 1), []);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} icon={<PackageOpen className="h-4 w-4" />}>
        {t('packages.button')}
      </Button>
      {open && (
        <Modal open size="lg" title={t('packages.title')} onClose={() => setOpen(false)}>
          <p className="mb-4 text-sm text-muted">{t('packages.intro')}</p>
          <div className="space-y-4">
            {packages && content && (
              <InstallAll packages={packages} content={content} generation={generation} onChanged={bump} onRunning={setLocked} />
            )}
            {!packages ? (
              <p className="text-sm text-muted">{t('common.loading')}</p>
            ) : (
              packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} generation={generation} onInstalled={bump} locked={locked} />)
            )}
            {content?.map((pkg) => (
              <ContentPackageCard
                key={pkg.id}
                pkg={pkg}
                generation={generation}
                onInstalled={bump}
                locked={locked}
                scrollIntoView={highlightContent}
                onScrolled={() => setHighlightContent(false)}
              />
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}

function PackageCard({ pkg, generation, onInstalled, locked }: { pkg: CurriculumPackage; generation: number; onInstalled: () => void; locked: boolean }) {
  const { t, l, formatDate } = useI18n();
  const toast = useToast();
  const [plan, setPlan] = useState<InstallPlan | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const counts = countPackage(pkg);

  const refresh = useCallback(() => {
    setPlan(null);
    void planInstall(db, pkg).then(setPlan);
  }, [pkg]);
  // Re-plan after any package install: what another package created changes this plan.
  useEffect(refresh, [refresh, generation]);

  const install = async () => {
    setBusy(true);
    try {
      const result = await installPackage(db, pkg);
      toast.success(t('packages.installed', { count: result.created }));
    } catch {
      toast.error(t('packages.failed'));
    } finally {
      setBusy(false);
      setConfirming(false);
      refresh();
      onInstalled();
    }
  };

  const blocked = plan && (plan.errors.length > 0 || plan.conflicts.length > 0);

  return (
    <section className="rounded-lg border border-border bg-bg/40 p-4" data-testid="package-card" aria-labelledby={`pkg-${pkg.id}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 id={`pkg-${pkg.id}`} className="font-semibold">
          {l(pkg.title)}
        </h3>
        <Badge tone="accent">{t('packages.version', { version: pkg.version })}</Badge>
        <Badge tone="warning">{t('packages.structureOnly')}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted">{l(pkg.description)}</p>
      <p className="mt-1 text-xs text-warning">{t('packages.structureOnlyHint')}</p>
      <p className="mt-2 text-xs text-muted">{t('packages.counts', { ...counts })}</p>

      <div className="mt-3 text-sm" data-testid="package-status" role="status">
        {!plan ? (
          <p className="text-muted">{t('packages.checking')}</p>
        ) : plan.errors.length > 0 ? (
          <Problems icon={<XCircle className="h-4 w-4" />} title={t('packages.invalid')} items={plan.errors} tone="text-danger" />
        ) : plan.conflicts.length > 0 ? (
          <Problems icon={<TriangleAlert className="h-4 w-4" />} title={t('packages.conflicts')} items={plan.conflicts} tone="text-warning" />
        ) : plan.toCreate === 0 ? (
          <p className="flex items-center gap-2 text-success">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {t('packages.complete')}
            {plan.installed && <span className="text-muted">· {t('packages.installedOn', { date: formatDate(plan.installed.installedAt, true) })}</span>}
          </p>
        ) : (
          <div className="space-y-3">
            <p>{t('packages.willCreate', { count: plan.toCreate, reused: plan.reused })}</p>
            <p className="flex items-start gap-2 text-xs text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
              {t('packages.safety')}
            </p>
            <Button onClick={() => setConfirming(true)} disabled={Boolean(blocked) || locked || busy} icon={<PackageOpen className="h-4 w-4" />}>
              {t('packages.install')}
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirming}
        tone="primary"
        title={t('packages.confirmTitle')}
        confirmLabel={t('packages.install')}
        busy={busy}
        onCancel={() => setConfirming(false)}
        onConfirm={install}
      >
        {t('packages.confirmBody', { count: plan?.toCreate ?? 0 })}
      </ConfirmDialog>
    </section>
  );
}

/** Course materials (lecture content + glossary) — written onto lectures that already exist. */
function ContentPackageCard({
  pkg,
  generation,
  onInstalled,
  locked,
  scrollIntoView,
  onScrolled,
}: {
  pkg: ContentPackage;
  generation: number;
  onInstalled: () => void;
  locked: boolean;
  scrollIntoView: boolean;
  onScrolled: () => void;
}) {
  const { t, l } = useI18n();
  const toast = useToast();
  const [plan, setPlan] = useState<ContentPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const refresh = useCallback(() => {
    setPlan(null);
    void planContentInstall(db, pkg).then(setPlan);
  }, [pkg]);
  useEffect(refresh, [refresh, generation]);

  const install = async () => {
    setBusy(true);
    try {
      const result = await installContentPackage(db, pkg);
      toast.success(t('learning.packages.contentInstalled', { count: result.written }));
    } catch {
      toast.error(t('packages.failed'));
    } finally {
      setBusy(false);
      refresh();
      onInstalled();
    }
  };

  // Ready to install (structure present, content not yet written): this is the learner's next step.
  const isNext = Boolean(plan && !plan.errors.length && !plan.missing.length && contentToWrite(plan) > 0);
  useEffect(() => {
    if (scrollIntoView && plan) {
      ref.current?.scrollIntoView({ block: 'center' });
      onScrolled();
    }
  }, [scrollIntoView, plan, onScrolled]);

  return (
    <section
      ref={ref}
      className={cn('rounded-lg border bg-bg/40 p-4', isNext ? 'border-success ring-2 ring-success/40' : 'border-border')}
      data-testid="content-package-card"
      data-next-step={isNext ? 'yes' : 'no'}
      aria-labelledby={`pkg-${pkg.id}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 id={`pkg-${pkg.id}`} className="font-semibold">{l(pkg.title)}</h3>
        <Badge tone="accent">{t('packages.version', { version: pkg.version })}</Badge>
        <Badge tone="success">{t('learning.packages.content')}</Badge>
        {isNext && <Badge tone="success">{t('packages.nextStep')}</Badge>}
      </div>
      <p className="mt-2 text-xs text-muted">
        {t('learning.packages.contentCounts', { lectures: pkg.lectures.length, terms: pkg.glossary.length })}
        {pkg.modules?.length ? ` · ${t('learning.packages.contentModules', { count: pkg.modules.length })}` : ''}
      </p>
      <div className="mt-3 text-sm" data-testid="content-package-status" role="status">
        {!plan ? (
          <p className="text-muted">{t('packages.checking')}</p>
        ) : plan.errors.length > 0 ? (
          <Problems icon={<XCircle className="h-4 w-4" />} title={t('packages.invalid')} items={plan.errors} tone="text-danger" />
        ) : plan.missing.length > 0 ? (
          <Problems icon={<TriangleAlert className="h-4 w-4" />} title={t('learning.packages.contentMissing')} items={plan.missing} tone="text-warning" />
        ) : contentToWrite(plan) === 0 ? (
          <p className="flex items-center gap-2 text-success"><CheckCircle2 className="h-4 w-4" aria-hidden />{t('learning.packages.contentComplete')}</p>
        ) : (
          <div className="space-y-3">
            <p>{t('learning.packages.contentWillWrite', { lectures: plan.lecturesToWrite, terms: plan.glossaryToWrite })}</p>
            {(plan.modulesToWrite > 0 || plan.modulesKeptLocal > 0) && (
              <p data-testid="content-modules-plan">{t('learning.packages.contentModulesPlan', { write: plan.modulesToWrite, kept: plan.modulesKeptLocal })}</p>
            )}
            <p className="flex items-start gap-2 text-xs text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
              {t('packages.safety')}
            </p>
            <Button onClick={install} loading={busy} disabled={locked || busy} icon={<PackageOpen className="h-4 w-4" />}>{t('packages.install')}</Button>
          </div>
        )}
      </div>
    </section>
  );
}

type StepStatus = 'pending' | 'running' | 'done' | 'skipped' | 'failed';
interface Step {
  id: string;
  name: string;
  kind: 'structure' | 'content';
  status: StepStatus;
}

/**
 * "Install all": the structure packages, then the course materials, in dependency order, after one confirmation.
 * Each step re-plans first and is skipped when there is nothing to write, so nothing is ever installed twice;
 * every step uses the same validated, transactional installer as its own card.
 */
function InstallAll({
  packages,
  content,
  generation,
  onChanged,
  onRunning,
}: {
  packages: CurriculumPackage[];
  content: ContentPackage[];
  generation: number;
  onChanged: () => void;
  onRunning: (running: boolean) => void;
}) {
  const { t, l } = useI18n();
  const toast = useToast();
  const [pending, setPending] = useState<boolean | null>(null); // is anything left to install?
  const [confirming, setConfirming] = useState(false);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [outcome, setOutcome] = useState<{ ok: true } | { ok: false; name: string } | null>(null);

  const order = useCallback(
    (): Step[] => [
      ...packages.map((p) => ({ id: p.id, name: l(p.title), kind: 'structure' as const, status: 'pending' as const })),
      ...content.map((p) => ({ id: p.id, name: l(p.title), kind: 'content' as const, status: 'pending' as const })),
    ],
    [packages, content, l],
  );

  useEffect(() => {
    let cancelled = false;
    setPending(null);
    void (async () => {
      for (const p of packages) {
        const plan = await planInstall(db, p);
        if (plan.toCreate > 0) return !cancelled && setPending(true);
      }
      for (const p of content) {
        const plan = await planContentInstall(db, p);
        if (plan.missing.length || contentToWrite(plan) > 0) return !cancelled && setPending(true);
      }
      if (!cancelled) setPending(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [packages, content, generation]);

  const run = async () => {
    setConfirming(false);
    setRunning(true);
    onRunning(true);
    setOutcome(null);
    const list = order();
    setSteps(list);
    const mark = (i: number, status: StepStatus) => setSteps((prev) => prev && prev.map((s, j) => (j === i ? { ...s, status } : s)));
    let failedAt: string | null = null;
    for (let i = 0; i < list.length; i++) {
      const step = list[i]!;
      mark(i, 'running');
      try {
        if (step.kind === 'structure') {
          const pkg = packages.find((p) => p.id === step.id)!;
          const plan = await planInstall(db, pkg);
          if (plan.errors.length || plan.conflicts.length) throw new Error('blocked');
          if (plan.toCreate === 0) mark(i, 'skipped');
          else {
            await installPackage(db, pkg);
            mark(i, 'done');
          }
        } else {
          const pkg = content.find((p) => p.id === step.id)!;
          const plan = await planContentInstall(db, pkg);
          if (plan.errors.length || plan.missing.length) throw new Error('blocked');
          if (contentToWrite(plan) === 0) mark(i, 'skipped');
          else {
            await installContentPackage(db, pkg);
            mark(i, 'done');
          }
        }
      } catch {
        mark(i, 'failed');
        failedAt = step.name;
        break;
      } finally {
        onChanged();
      }
    }
    if (failedAt) {
      setOutcome({ ok: false, name: failedAt });
      toast.error(t('packages.installAllFailed', { name: failedAt }));
    } else {
      setOutcome({ ok: true });
      toast.success(t('packages.installAllSuccess'));
    }
    setRunning(false);
    onRunning(false);
  };

  const icon = (status: StepStatus) =>
    status === 'running' ? <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
    : status === 'done' ? <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />
    : status === 'skipped' ? <SkipForward className="h-4 w-4 text-muted" aria-hidden />
    : status === 'failed' ? <XCircle className="h-4 w-4 text-danger" aria-hidden />
    : <CircleDashed className="h-4 w-4 text-muted" aria-hidden />;
  const label = (status: StepStatus) =>
    t(`packages.step${status.charAt(0).toUpperCase()}${status.slice(1)}` as 'packages.stepDone');

  return (
    <section className="rounded-lg border border-primary/40 bg-primary/5 p-4" data-testid="install-all" aria-labelledby="install-all-title">
      <div className="flex flex-wrap items-center gap-3">
        <h3 id="install-all-title" className="flex items-center gap-2 font-semibold">
          <Layers className="h-4 w-4 text-primary" aria-hidden />
          {t('packages.installAll')}
        </h3>
        {pending && !running && (
          <Button className="ml-auto w-full sm:w-auto" onClick={() => setConfirming(true)} icon={<PackageOpen className="h-4 w-4" />} data-testid="install-all-button">
            {t('packages.installAll')}
          </Button>
        )}
      </div>
      {pending === false && !running ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-success" data-testid="install-all-status">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          {t('packages.allInstalled')}
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted">{t('packages.installAllHint')}</p>
      )}

      {steps && (
        <div className="mt-3" role="status" aria-live="polite" data-testid="install-all-progress">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{t('packages.progress')}</p>
          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={s.id} className="flex items-start gap-2 text-sm" data-step-status={s.status}>
                <span className="mt-0.5 shrink-0">{icon(s.status)}</span>
                <span className="min-w-0 flex-1">
                  <span className="font-mono text-xs text-muted">{i + 1}.</span> {s.name}
                </span>
                <span className={cn('shrink-0 text-xs', s.status === 'failed' ? 'text-danger' : s.status === 'done' ? 'text-success' : 'text-muted')}>{label(s.status)}</span>
              </li>
            ))}
          </ol>
          {outcome && (
            <div className={cn('mt-3 rounded-md border p-3 text-sm', outcome.ok ? 'border-success/40 bg-success/10 text-success' : 'border-danger/40 bg-danger/10 text-danger')} data-testid="install-all-outcome" data-ok={outcome.ok ? 'yes' : 'no'}>
              <p>{outcome.ok ? t('packages.installAllSuccess') : t('packages.installAllFailed', { name: outcome.name })}</p>
              {outcome.ok && (
                <Link to="/library" className="mt-2 inline-flex min-h-[2.5rem] items-center font-medium text-accent underline underline-offset-2">
                  {t('packages.openLibrary')}
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirming}
        tone="primary"
        title={t('packages.installAllTitle')}
        confirmLabel={t('packages.installAll')}
        busy={running}
        onCancel={() => setConfirming(false)}
        onConfirm={() => void run()}
      >
        <p>{t('packages.installAllBody')}</p>
        <ol className="mt-2 list-inside list-decimal space-y-1">
          {order().map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ol>
      </ConfirmDialog>
    </section>
  );
}

function Problems({ icon, title, items, tone }: { icon: React.ReactNode; title: string; items: string[]; tone: string }) {
  return (
    <div className={tone}>
      <p className="flex items-center gap-2 font-medium">
        {icon}
        {title}
      </p>
      <ul className="mt-1 max-h-40 list-inside list-disc overflow-y-auto font-mono text-xs">
        {items.slice(0, 50).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
