import { describe, expect, it } from 'vitest';
import { en } from '@/i18n/locales/en';
import { ms } from '@/i18n/locales/ms';
import { interpolate, localize, translate, translateList } from '@/i18n/translate';
import { NAV_ITEMS } from '@/app/navigation';

function shape(obj: unknown, prefix = ''): string[] {
  if (typeof obj === 'string') return [`${prefix}:string`];
  if (Array.isArray(obj)) return [`${prefix}:list`];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => shape(v, prefix ? `${prefix}.${k}` : k));
}

function leaves(obj: unknown): string[] {
  if (typeof obj === 'string') return [obj];
  if (Array.isArray(obj)) return obj as string[];
  return Object.values(obj as Record<string, unknown>).flatMap(leaves);
}

describe('i18n dictionaries', () => {
  it('English has exactly the same keys and value kinds as Bahasa Melayu', () => {
    expect(shape(en).sort()).toEqual(shape(ms).sort());
  });

  it('has no empty translations', () => {
    expect(leaves(ms).filter((s) => !s.trim())).toEqual([]);
    expect(leaves(en).filter((s) => !s.trim())).toEqual([]);
  });

  it('uses the same {placeholders} in both languages', () => {
    const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
    const msMap = new Map(shape(ms).map((k) => [k, k]));
    for (const key of msMap.keys()) {
      if (!key.endsWith(':string')) continue;
      const path = key.slice(0, -':string'.length) as Parameters<typeof translate>[1];
      expect(ph(translate('en', path)), path).toBe(ph(translate('ms', path)));
    }
  });

  it('has a label for every navigation item', () => {
    for (const item of NAV_ITEMS) {
      expect(translate('ms', `nav.${item.key}`)).not.toBe(`nav.${item.key}`);
      expect(translate('en', `nav.${item.key}`)).not.toBe(`nav.${item.key}`);
    }
  });
});

describe('translate', () => {
  it('translates, interpolates and handles keys containing dots', () => {
    expect(translate('ms', 'nav.dashboard')).toBe('Papan Pemuka Universiti');
    expect(translate('en', 'nav.dashboard')).toBe('University Dashboard');
    expect(translate('en', 'dashboard.greeting', { name: 'Aisyah' })).toBe('Welcome back, Aisyah');
    expect(translate('ms', 'activity.profile.created')).toBe('Profil pelajar dicipta');
    expect(translateList('en', 'modules.lab.features').length).toBeGreaterThan(0);
  });

  it('leaves unknown placeholders intact', () => {
    expect(interpolate('{a} {b}', { a: 1 })).toBe('1 {b}');
  });

  it('localizes bilingual content with Malay fallback', () => {
    expect(localize({ ms: 'Pemboleh Ubah', en: 'Variable' }, 'en')).toBe('Variable');
    expect(localize({ ms: 'Pemboleh Ubah' }, 'en')).toBe('Pemboleh Ubah');
    expect(localize({ ms: 'Pemboleh Ubah', en: 'Variable' }, 'ms')).toBe('Pemboleh Ubah');
  });
});
