import type { CodeRuntime, ContentBlock, LectureSection, LectureSectionKind, LocalizedText } from '../types';

/** Authoring helpers for course materials. Every text is [Bahasa Melayu, English]. */
type T = [ms: string, en: string];
const L = ([ms, en]: T): LocalizedText => ({ ms, en });

export const P = (ms: string, en: string): ContentBlock => ({ type: 'paragraph', text: { ms, en } });
export const UL = (...items: T[]): ContentBlock => ({ type: 'list', items: items.map(L) });
export const OL = (...items: T[]): ContentBlock => ({ type: 'list', ordered: true, items: items.map(L) });
export const KEY = (ms: string, en: string, title?: T): ContentBlock => ({ type: 'callout', tone: 'key', text: { ms, en }, title: title && L(title) });
export const INFO = (ms: string, en: string, title?: T): ContentBlock => ({ type: 'callout', tone: 'info', text: { ms, en }, title: title && L(title) });
export const WARN = (ms: string, en: string, title?: T): ContentBlock => ({ type: 'callout', tone: 'warning', text: { ms, en }, title: title && L(title) });
export const TERMS = (...keys: string[]): ContentBlock => ({ type: 'terms', keys });
export const LINKS = (...items: { title: string; url: string }[]): ContentBlock => ({ type: 'links', items });

export function CODE(
  id: string,
  language: 'lua' | 'luau',
  runtime: CodeRuntime,
  title: T,
  code: string,
  expectedOutput?: string,
): ContentBlock {
  return { type: 'code', id, language, runtime, title: L(title), code: code.replace(/^\n/, '').replace(/\s+$/, ''), expectedOutput };
}

export const EXPLAIN = (codeId: string, ...items: [lines: string, ms: string, en: string][]): ContentBlock => ({
  type: 'explain',
  codeId,
  items: items.map(([lines, ms, en]) => ({ lines, text: { ms, en } })),
});

export const S = (kind: LectureSectionKind, ...blocks: ContentBlock[]): LectureSection => ({ kind, blocks });
export const NA = (kind: LectureSectionKind, ms: string, en: string): LectureSection => ({ kind, blocks: [], notApplicable: { ms, en } });
