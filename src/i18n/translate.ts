import type { LanguageCode, LocalizedText } from '@/db/types';
import { en } from './locales/en';
import { ms, type Messages } from './locales/ms';

export const DEFAULT_LANGUAGE: LanguageCode = 'ms';

/** Register new languages here (and add the code to SUPPORTED_LANGUAGES). */
export const dictionaries: Record<LanguageCode, Messages> = { ms, en };

export const INTL_LOCALES: Record<LanguageCode, string> = { ms: 'ms-MY', en: 'en-GB' };

type Leaves<T, Wanted, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends Wanted
    ? `${P}${K}`
    : T[K] extends string | string[]
      ? never
      : Leaves<T[K], Wanted, `${P}${K}.`>;
}[keyof T & string];

/** Every valid dotted key that resolves to a string. */
export type MessageKey = Leaves<Messages, string>;
/** Every valid dotted key that resolves to a string list. */
export type ListKey = Leaves<Messages, string[]>;
export type Vars = Record<string, string | number>;

/** Resolve a dotted path; supports keys that themselves contain dots (e.g. "profile.created"). */
function resolve(node: unknown, parts: string[]): unknown {
  if (parts.length === 0) return node;
  if (typeof node !== 'object' || node === null) return undefined;
  const obj = node as Record<string, unknown>;
  for (let i = parts.length; i >= 1; i--) {
    const key = parts.slice(0, i).join('.');
    if (key in obj) {
      const found = resolve(obj[key], parts.slice(i));
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

export function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

export function translate(lang: LanguageCode, key: MessageKey, vars?: Vars): string {
  const parts = key.split('.');
  const value = resolve(dictionaries[lang], parts) ?? resolve(dictionaries[DEFAULT_LANGUAGE], parts);
  return typeof value === 'string' ? interpolate(value, vars) : key;
}

export function translateList(lang: LanguageCode, key: ListKey): string[] {
  const parts = key.split('.');
  const value = resolve(dictionaries[lang], parts) ?? resolve(dictionaries[DEFAULT_LANGUAGE], parts);
  return Array.isArray(value) ? (value as string[]) : [];
}

/** Pick the requested language of bilingual academic content, falling back to Malay. */
export function localize(text: LocalizedText | undefined, lang: LanguageCode): string {
  if (!text) return '';
  return (lang === 'en' ? text.en : undefined) || text.ms;
}
