import type { CodeDebug, CodeLanguage, CodeRuntime, ContentBlock, LectureSection, LectureSectionKind, LocalizedText } from '../types';

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

const trimCode = (code: string) => code.replace(/^\n/, '').replace(/\s+$/, '');

/**
 * A code example. `extra.input` is stdin for io.read(); `extra.debug` is a broken variant built with BUG().
 */
export function CODE(
  id: string,
  language: CodeLanguage,
  runtime: CodeRuntime,
  title: T,
  code: string,
  expectedOutput?: string,
  extra: { input?: string; debug?: CodeDebug } = {},
): ContentBlock {
  return { type: 'code', id, language, runtime, title: L(title), code: trimCode(code), expectedOutput, ...(extra.input !== undefined && { input: extra.input }), ...(extra.debug && { debug: extra.debug }) };
}

/** Broken variant of an example: the code, the exact first line of the error, and how to fix it [ms, en]. */
export const BUG = (code: string, error: string, ms: string, en: string): CodeDebug => ({ code: trimCode(code), error, explanation: { ms, en } });

export const EXPLAIN = (codeId: string, ...items: [lines: string, ms: string, en: string][]): ContentBlock => ({
  type: 'explain',
  codeId,
  items: items.map(([lines, ms, en]) => ({ lines, text: { ms, en } })),
});

export const S = (kind: LectureSectionKind, ...blocks: ContentBlock[]): LectureSection => ({ kind, blocks });
export const NA = (kind: LectureSectionKind, ms: string, en: string): LectureSection => ({ kind, blocks: [], notApplicable: { ms, en } });
