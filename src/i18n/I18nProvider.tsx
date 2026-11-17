import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import type { LanguageCode, LocalizedText } from '@/db/types';
import { useSettings } from '@/hooks/useSettings';
import {
  DEFAULT_LANGUAGE,
  INTL_LOCALES,
  localize,
  translate,
  translateList,
  type ListKey,
  type MessageKey,
  type Vars,
} from './translate';

const CACHE_KEY = 'qhaze.language';

export interface I18nValue {
  lang: LanguageCode;
  t: (key: MessageKey, vars?: Vars) => string;
  tList: (key: ListKey) => string[];
  l: (text: LocalizedText | undefined) => string;
  formatDate: (iso: string, withTime?: boolean) => string;
  formatNumber: (n: number, digits?: number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function cachedLanguage(): LanguageCode {
  try {
    const v = localStorage.getItem(CACHE_KEY);
    return v === 'en' || v === 'ms' ? v : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

/**
 * Language comes from the persisted settings row in IndexedDB (source of truth).
 * A localStorage copy is used only to render the right language before the DB loads.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const settings = useSettings();
  return <LanguageProvider lang={settings?.language ?? cachedLanguage()}>{children}</LanguageProvider>;
}

/**
 * For screens shown BEFORE the database is open (splash, startup errors).
 * Never queries IndexedDB — a premature query would open (and upgrade) the database
 * before `bootstrapDatabase()` could take its pre-migration recovery point.
 */
export function PreBootI18nProvider({ children }: { children: ReactNode }) {
  return <LanguageProvider lang={cachedLanguage()}>{children}</LanguageProvider>;
}

function LanguageProvider({ children, lang }: { children: ReactNode; lang: LanguageCode }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(CACHE_KEY, lang);
    } catch {
      /* storage unavailable — DB remains the source of truth */
    }
  }, [lang]);

  const t = useCallback((key: MessageKey, vars?: Vars) => translate(lang, key, vars), [lang]);
  const value = useMemo<I18nValue>(() => {
    const locale = INTL_LOCALES[lang];
    return {
      lang,
      t,
      tList: (key) => translateList(lang, key),
      l: (text) => localize(text, lang),
      formatDate: (iso, withTime = false) => {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'medium',
          ...(withTime ? { timeStyle: 'short' } : {}),
        }).format(d);
      },
      formatNumber: (n, digits = 0) =>
        new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(n),
    };
  }, [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
