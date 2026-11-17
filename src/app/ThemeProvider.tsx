import { useEffect, type ReactNode } from 'react';
import type { ThemeMode } from '@/db/types';
import { useSettings } from '@/hooks/useSettings';

const CACHE_KEY = 'qhaze.theme';

function cachedTheme(): ThemeMode {
  try {
    const v = localStorage.getItem(CACHE_KEY);
    return v === 'light' || v === 'system' || v === 'dark' ? v : 'dark';
  } catch {
    return 'dark';
  }
}

/** Applies the persisted theme to <html>. `system` follows the OS preference live. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const settings = useSettings();
  const mode: ThemeMode = settings?.theme ?? cachedTheme();

  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, mode);
    } catch {
      /* ignore */
    }
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = mode === 'dark' || (mode === 'system' && (media?.matches ?? true));
      document.documentElement.classList.toggle('dark', dark);
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b0816' : '#f7f6fc');
    };
    apply();
    if (mode === 'system' && media) {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
  }, [mode]);

  return <>{children}</>;
}
