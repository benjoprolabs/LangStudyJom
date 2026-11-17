import { NavLink } from 'react-router-dom';
import { GraduationCap, X } from 'lucide-react';
import { CURRENT_PHASE, NAV_GROUPS, NAV_ITEMS } from '@/app/navigation';
import { useI18n } from '@/i18n/I18nProvider';
import { cn } from '@/lib/cn';
import { APP_VERSION } from '@/db/backup/backup';

export function Sidebar({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  const { t } = useI18n();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 pb-4 pt-5">
        <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-2 text-white shadow-glow">
          <GraduationCap className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold leading-tight tracking-wide">{t('app.name')}</p>
          <p className="truncate text-xs text-muted">{t('app.tagline')}</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-fg lg:hidden" aria-label={t('common.closeMenu')}>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4" aria-label={t('app.name')}>
        {NAV_GROUPS.map((group) => (
          <div key={group}>
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted/80">{t(`nav.groups.${group}`)}</p>
            <ul className="space-y-0.5">
              {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                const Icon = item.icon;
                const planned = item.phase > CURRENT_PHASE;
                return (
                  <li key={item.key}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors',
                          isActive ? 'bg-primary/15 font-medium text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-accent' : 'text-muted group-hover:text-fg')} aria-hidden />
                          <span className={cn('flex-1 truncate', planned && !isActive && 'opacity-70')}>{t(`nav.${item.key}`)}</span>
                          {planned && (
                            <span
                              title={t('nav.phaseBadgeTitle', { phase: item.phase })}
                              className="rounded border border-border px-1 text-[10px] font-medium text-muted"
                            >
                              {t('nav.phaseBadge', { phase: item.phase })}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <p className="border-t border-border px-4 py-3 text-xs text-muted">{t('app.version', { version: APP_VERSION })}</p>
    </div>
  );
}
