import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, PackageOpen, ShieldCheck, TriangleAlert, XCircle } from 'lucide-react';
import { db } from '@/db/client';
import { installPackage, planInstall, type InstallPlan } from '@/db/seed/install';
import type { CurriculumPackage } from '@/db/seed/types';
import { installContentPackage, planContentInstall, type ContentPlan } from '@/db/content/install';
import type { ContentPackage } from '@/db/content/types';
import { countPackage } from '@/db/seed/validate';
import { useI18n } from '@/i18n/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

/** "Curriculum packages" button + dialog (Faculties page). */
export function CurriculumPackagesButton() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
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
            {!packages ? (
              <p className="text-sm text-muted">{t('common.loading')}</p>
            ) : (
              packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} generation={generation} onInstalled={bump} />)
            )}
            {content?.map((pkg) => <ContentPackageCard key={pkg.id} pkg={pkg} generation={generation} />)}
          </div>
        </Modal>
      )}
    </>
  );
}

function PackageCard({ pkg, generation, onInstalled }: { pkg: CurriculumPackage; generation: number; onInstalled: () => void }) {
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
      </div>
      <p className="mt-1 text-sm text-muted">{l(pkg.description)}</p>
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
            <Button onClick={() => setConfirming(true)} disabled={Boolean(blocked)} icon={<PackageOpen className="h-4 w-4" />}>
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
function ContentPackageCard({ pkg, generation }: { pkg: ContentPackage; generation: number }) {
  const { t, l } = useI18n();
  const toast = useToast();
  const [plan, setPlan] = useState<ContentPlan | null>(null);
  const [busy, setBusy] = useState(false);

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
    }
  };

  return (
    <section className="rounded-lg border border-border bg-bg/40 p-4" data-testid="content-package-card" aria-labelledby={`pkg-${pkg.id}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 id={`pkg-${pkg.id}`} className="font-semibold">{l(pkg.title)}</h3>
        <Badge tone="accent">{t('packages.version', { version: pkg.version })}</Badge>
        <Badge>{t('learning.packages.content')}</Badge>
      </div>
      <p className="mt-2 text-xs text-muted">{t('learning.packages.contentCounts', { lectures: pkg.lectures.length, terms: pkg.glossary.length })}</p>
      <div className="mt-3 text-sm" data-testid="content-package-status" role="status">
        {!plan ? (
          <p className="text-muted">{t('packages.checking')}</p>
        ) : plan.errors.length > 0 ? (
          <Problems icon={<XCircle className="h-4 w-4" />} title={t('packages.invalid')} items={plan.errors} tone="text-danger" />
        ) : plan.missing.length > 0 ? (
          <Problems icon={<TriangleAlert className="h-4 w-4" />} title={t('learning.packages.contentMissing')} items={plan.missing} tone="text-warning" />
        ) : plan.lecturesToWrite + plan.glossaryToWrite === 0 ? (
          <p className="flex items-center gap-2 text-success"><CheckCircle2 className="h-4 w-4" aria-hidden />{t('learning.packages.contentComplete')}</p>
        ) : (
          <div className="space-y-3">
            <p>{t('learning.packages.contentWillWrite', { lectures: plan.lecturesToWrite, terms: plan.glossaryToWrite })}</p>
            <p className="flex items-start gap-2 text-xs text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
              {t('packages.safety')}
            </p>
            <Button onClick={install} loading={busy} icon={<PackageOpen className="h-4 w-4" />}>{t('packages.install')}</Button>
          </div>
        )}
      </div>
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
