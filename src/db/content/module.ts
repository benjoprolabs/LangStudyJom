/**
 * Module-level learning materials: text format, discipline-aware validation, duplication detection against the
 * module's lectures, and completion status. Pure functions — no database access.
 *
 * A module teaches the overall topic and connects its lectures; lectures teach subtopics in depth. Module content
 * must therefore not copy lecture text, explanations or examples: `findDuplication` detects substantial overlap.
 */
import { MODULE_SECTIONS, type ContentBlock, type Lecture, type LocalizedText, type ModuleSection, type ModuleSectionKind } from '../types';
import { flattenInline, parseInline } from './inline';

// ─── Text format ───────────────────────────────────────────────────────────

export type ModuleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  /** `expectedOutput` comes from an ```output fence placed right after the code fence (needed to verify it). */
  | { type: 'code'; language: string; code: string; expectedOutput?: string };

const LIST_ITEM = /^\s*(?:([-*])|(\d+)[.)])\s+(.*)$/;

/** Paragraphs (separated by blank lines), "- " or "1. " lists, and ``` fenced code. */
export function parseModuleBody(text: string): ModuleBlock[] {
  const blocks: ModuleBlock[] = [];
  const lines = (text ?? '').replace(/\r\n?/g, '\n').split('\n');
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() });
    if (list) blocks.push({ type: 'list', ...list });
    paragraph = [];
    list = null;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const fence = line.match(/^\s*```\s*([\w+-]*)\s*$/);
    if (fence) {
      flush();
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i]!)) code.push(lines[i++]!);
      const language = fence[1] || 'text';
      const last = blocks[blocks.length - 1];
      if (language === 'output' && last?.type === 'code' && last.expectedOutput === undefined) last.expectedOutput = code.join('\n');
      else blocks.push({ type: 'code', language, code: code.join('\n') });
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    const item = line.match(LIST_ITEM);
    if (item) {
      const ordered = Boolean(item[2]);
      if (paragraph.length || (list && list.ordered !== ordered)) flush();
      list ??= { ordered, items: [] };
      list.items.push(item[3]!.trim());
    } else if (list && /^\s{2,}\S/.test(line)) {
      list.items[list.items.length - 1] += ` ${line.trim()}`; // continuation of a list item
    } else {
      if (list) flush();
      paragraph.push(line.trim());
    }
  }
  flush();
  return blocks;
}

/** Text of a block for word counts and duplication checks (inline markup removed). */
export function plainOf(text: string): string {
  const plain = (s: string): string =>
    flattenInline(parseInline(s))
      .filter((t) => t.kind !== 'bold')
      .map((t) => (t.kind === 'term' ? (t.label ?? t.key) : t.kind === 'link' ? t.label : t.text))
      .join('');
  return plain(text);
}

const words = (text: string) => plainOf(text).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

// ─── Disciplines ───────────────────────────────────────────────────────────

/** How module requirements are adapted to the subject (examples and rules differ by discipline). */
export type Discipline = 'programming' | 'mathematics' | 'design' | 'general';

export function disciplineOfFaculty(facultyCode: string | undefined): Discipline {
  switch (facultyCode) {
    case 'F01': // Programming & Software Engineering
    case 'F02': // Artificial Intelligence
    case 'F03': // Game Development
    case 'F05': // Data Science & Engineering
      return 'programming';
    case 'F04': // Mathematics & Computer Science
      return 'mathematics';
    case 'F06': // 3D Design & Digital Production
    case 'F07': // Music Technology & Production
      return 'design';
    default:
      return 'general';
  }
}

// ─── Validation ────────────────────────────────────────────────────────────

export type ModuleProblemCode =
  | 'code_language'
  | 'missing_output'
  | 'code_differs'
  | 'term_scope'
  | 'missing_section'
  | 'missing_language'
  | 'too_short'
  | 'too_few_items'
  | 'needs_code_example'
  | 'needs_worked_example'
  | 'too_few_references'
  | 'insecure_link'
  | 'unknown_term'
  | 'copied_text'
  | 'copied_code';

export interface ModuleProblem {
  code: ModuleProblemCode;
  section: ModuleSectionKind;
  lang?: 'ms' | 'en';
  /** Numbers or keys for the message (minimum, found, glossary key, lecture number…). */
  detail?: string;
}

/** Minimum words per language, and minimum list items, for each section. */
export const MODULE_RULES: Record<ModuleSectionKind, { minWords?: number; minItems?: number }> = {
  module_overview: { minWords: 60 },
  learning_objectives: { minItems: 3 },
  prerequisites: { minWords: 10 },
  core_theory: { minWords: 150 },
  learning_notes: { minWords: 100 },
  key_concepts: { minItems: 3 },
  terminology: { minItems: 3 },
  examples: { minWords: 30 },
  applications: { minWords: 40 },
  module_summary: { minWords: 40 },
  references: {},
};
const MIN_REFERENCES = 3;

export interface LectureCorpus {
  /** Prose of each lecture (paragraphs, list items, callouts, explanations), labelled with its number. */
  texts: { lecture: string; text: string }[];
  code: { lecture: string; code: string }[];
}

/** Everything a module must not copy: the prose and code of its course's lectures. */
export function lectureCorpus(lectures: (Pick<Lecture, 'order' | 'sections'> & { module?: number })[]): LectureCorpus {
  const texts: LectureCorpus['texts'] = [];
  const code: LectureCorpus['code'] = [];
  for (const l of lectures) {
    const label = l.module ? `${l.module}.${l.order}` : String(l.order);
    const add = (t?: LocalizedText) => {
      if (t?.ms) texts.push({ lecture: label, text: t.ms });
      if (t?.en) texts.push({ lecture: label, text: t.en });
    };
    for (const b of l.sections.flatMap((s) => s.blocks) as ContentBlock[]) {
      if (b.type === 'paragraph') add(b.text);
      else if (b.type === 'list') b.items.forEach(add);
      else if (b.type === 'callout') add(b.text);
      else if (b.type === 'explain') b.items.forEach((i) => add(i.text));
      else if (b.type === 'code') {
        code.push({ lecture: label, code: b.code });
        if (b.debug) {
          code.push({ lecture: label, code: b.debug.code });
          add(b.debug.explanation);
        }
      }
    }
  }
  return { texts, code };
}

const SHINGLE = 8;
const shingles = (ws: string[]) => {
  const out: string[] = [];
  for (let i = 0; i + SHINGLE <= ws.length; i++) out.push(ws.slice(i, i + SHINGLE).join(' '));
  return out;
};
const codeLines = (code: string) =>
  code
    .split('\n')
    .map((l) => l.trim().replace(/\s+/g, ' '))
    .filter((l) => l.length > 0);

/**
 * Substantial duplication of lecture material: a module paragraph or list item of 12+ words whose 8-word sequences
 * mostly (≥50 %) occur in lecture prose, or a code example of 3+ lines that is (≥80 % of its lines) a lecture example.
 */
export function findDuplication(sections: ModuleSection[], corpus: LectureCorpus): ModuleProblem[] {
  const problems: ModuleProblem[] = [];
  const lectureShingles = new Map<string, string>();
  for (const t of corpus.texts) for (const s of shingles(words(t.text))) if (!lectureShingles.has(s)) lectureShingles.set(s, t.lecture);
  const lectureCode = corpus.code.map((c) => ({ lecture: c.lecture, lines: new Set(codeLines(c.code)) }));
  for (const section of sections) {
    for (const lang of ['ms', 'en'] as const) {
      const body = section.body[lang];
      if (!body) continue;
      const reported = new Set<string>();
      for (const block of parseModuleBody(body)) {
        const pieces = block.type === 'paragraph' ? [block.text] : block.type === 'list' ? block.items : [];
        for (const piece of pieces) {
          const ws = words(piece);
          if (ws.length < 12) continue;
          const sh = shingles(ws);
          const hits = sh.filter((s) => lectureShingles.has(s));
          if (hits.length / sh.length >= 0.5) {
            const where = lectureShingles.get(hits[0]!)!;
            if (!reported.has(`t${where}`)) problems.push({ code: 'copied_text', section: section.kind, lang, detail: where });
            reported.add(`t${where}`);
          }
        }
        if (block.type === 'code') {
          const lines = codeLines(block.code);
          if (lines.length < 3) continue;
          for (const c of lectureCode) {
            const shared = lines.filter((l) => c.lines.has(l)).length;
            if (shared / lines.length >= 0.8) {
              if (!reported.has(`c${c.lecture}`)) problems.push({ code: 'copied_code', section: section.kind, lang, detail: c.lecture });
              reported.add(`c${c.lecture}`);
              break;
            }
          }
        }
      }
    }
  }
  return problems;
}

export interface ModuleValidationContext {
  discipline: Discipline;
  /** Known glossary keys; omitted = glossary links are not checked. */
  glossaryKeys?: Set<string>;
  corpus?: LectureCorpus;
  /**
   * Course-materials package mode (strict): code fences must be the pathway's language and carry an ```output
   * fence, the Malay and English versions must contain the same code, and glossary links must respect the
   * Lua / Luau / Python separation (`glossaryScope`).
   */
  pathway?: 'lua' | 'luau' | 'python' | 'other';
  glossaryScope?: Map<string, string>;
  /** Whether a module code unit has been verified by execution (from the verification manifest). */
  isVerified?: (unit: ModuleCodeUnit) => boolean;
}

/** The only code language each pathway's modules may contain (package mode). */
const PATHWAY_LANGUAGE: Record<string, string> = { lua: 'lua', luau: 'luau', python: 'python' };
const FORBIDDEN_SCOPES: Record<string, string[]> = { lua: ['luau', 'roblox', 'python'], luau: ['python'], python: ['lua', 'luau', 'roblox'] };
const RUNTIME_OF: Record<string, 'lua54' | 'luau' | 'python'> = { lua: 'lua54', luau: 'luau', python: 'python' };

/** A runnable module code example, keyed for the verification manifest: "LUA101 M1#examples-1". */
export interface ModuleCodeUnit {
  key: string;
  section: ModuleSectionKind;
  index: number;
  language: 'lua' | 'luau' | 'python';
  runtime: 'lua54' | 'luau' | 'python';
  code: string;
  expectedOutput?: string;
}

export const moduleUnitKey = (courseCode: string, moduleOrder: number, section: ModuleSectionKind, index: number) => `${courseCode} M${moduleOrder}#${section}-${index}`;

/** Runnable code of a module (from the Malay text; package mode requires the English code to be identical). */
export function moduleCodeUnits(courseCode: string, moduleOrder: number, sections: ModuleSection[] | undefined): ModuleCodeUnit[] {
  const units: ModuleCodeUnit[] = [];
  for (const s of sections ?? []) {
    let index = 0;
    for (const b of parseModuleBody(s.body.ms ?? '')) {
      if (b.type !== 'code') continue;
      index++;
      const runtime = RUNTIME_OF[b.language];
      if (runtime) units.push({ key: moduleUnitKey(courseCode, moduleOrder, s.kind, index), section: s.kind, index, language: b.language as ModuleCodeUnit['language'], runtime, code: b.code, expectedOutput: b.expectedOutput });
    }
  }
  return units;
}

export function validateModuleContent(sections: ModuleSection[] | undefined, ctx: ModuleValidationContext): ModuleProblem[] {
  const problems: ModuleProblem[] = [];
  const byKind = new Map((sections ?? []).map((s) => [s.kind, s]));
  for (const kind of MODULE_SECTIONS) {
    const section = byKind.get(kind);
    if (!section || (!section.body.ms?.trim() && !section.body.en?.trim())) {
      problems.push({ code: 'missing_section', section: kind });
      continue;
    }
    const rule = MODULE_RULES[kind];
    for (const lang of ['ms', 'en'] as const) {
      const body = section.body[lang]?.trim() ?? '';
      if (!body) {
        problems.push({ code: 'missing_language', section: kind, lang });
        continue;
      }
      const blocks = parseModuleBody(body);
      const prose = blocks.flatMap((b) => (b.type === 'paragraph' ? [b.text] : b.type === 'list' ? b.items : []));
      const count = prose.reduce((n, t) => n + words(t).length, 0);
      if (rule.minWords && count < rule.minWords) problems.push({ code: 'too_short', section: kind, lang, detail: `${count}/${rule.minWords}` });
      const items = blocks.reduce((n, b) => n + (b.type === 'list' ? b.items.length : 0), 0);
      if (rule.minItems && items < rule.minItems) problems.push({ code: 'too_few_items', section: kind, lang, detail: `${items}/${rule.minItems}` });
      if (kind === 'examples') {
        if (ctx.discipline === 'programming' && !blocks.some((b) => b.type === 'code' && b.code.trim())) problems.push({ code: 'needs_code_example', section: kind, lang });
        if (ctx.discipline !== 'programming' && count < 30) problems.push({ code: 'needs_worked_example', section: kind, lang });
      }
      const tokens = prose.flatMap((t) => flattenInline(parseInline(t)));
      const links = tokens.filter((t): t is Extract<typeof t, { kind: 'link' }> => t.kind === 'link');
      for (const link of links) if (!link.url.startsWith('https://')) problems.push({ code: 'insecure_link', section: kind, lang, detail: link.url });
      if (kind === 'references' && links.filter((x) => x.url.startsWith('https://')).length < MIN_REFERENCES)
        problems.push({ code: 'too_few_references', section: kind, lang, detail: `${links.length}/${MIN_REFERENCES}` });
      if (ctx.glossaryKeys)
        for (const t of tokens) if (t.kind === 'term' && !ctx.glossaryKeys.has(t.key)) problems.push({ code: 'unknown_term', section: kind, lang, detail: t.key });
      if (ctx.pathway && ctx.glossaryScope)
        for (const t of tokens)
          if (t.kind === 'term' && FORBIDDEN_SCOPES[ctx.pathway]?.includes(ctx.glossaryScope.get(t.key) ?? '')) problems.push({ code: 'term_scope', section: kind, lang, detail: t.key });
      if (ctx.pathway) {
        const expected = PATHWAY_LANGUAGE[ctx.pathway];
        for (const b of blocks) {
          if (b.type !== 'code') continue;
          if (expected && b.language !== expected) problems.push({ code: 'code_language', section: kind, lang, detail: b.language });
          if (b.expectedOutput === undefined) problems.push({ code: 'missing_output', section: kind, lang });
        }
      }
    }
  }
  if (ctx.pathway)
    for (const s of sections ?? []) {
      const codes = (lang: 'ms' | 'en') => parseModuleBody(s.body[lang] ?? '').flatMap((b) => (b.type === 'code' ? [`${b.language}\n${b.code}\n${b.expectedOutput ?? ''}`] : []));
      if (JSON.stringify(codes('ms')) !== JSON.stringify(codes('en'))) problems.push({ code: 'code_differs', section: s.kind });
    }
  if (ctx.corpus) problems.push(...findDuplication(sections ?? [], ctx.corpus));
  return problems;
}

// ─── Status ────────────────────────────────────────────────────────────────

/**
 * - not_written: no module materials at all.
 * - partial: some materials, but a section is missing, too thin, invalid or copied from a lecture.
 * - needs_verification: every rule passes, but it contains code that has not been verified by execution
 *   (module code from the editor is not run by the verifier).
 * - complete: every rule passes and there is nothing left to verify.
 */
export type ModuleContentStatus = 'not_written' | 'partial' | 'needs_verification' | 'complete';

export function hasModuleContent(sections: ModuleSection[] | undefined): boolean {
  return Boolean(sections?.some((s) => s.body.ms?.trim() || s.body.en?.trim()));
}

export function moduleContentStatus(
  sections: ModuleSection[] | undefined,
  problems: ModuleProblem[],
  verification?: { units: ModuleCodeUnit[]; isVerified: (unit: ModuleCodeUnit) => boolean },
): ModuleContentStatus {
  if (!hasModuleContent(sections)) return 'not_written';
  if (problems.length) return 'partial';
  const codeBlocks = (sections ?? []).reduce((n, s) => n + parseModuleBody(s.body.ms ?? '').filter((b) => b.type === 'code').length, 0);
  const hasCode = codeBlocks > 0 || (sections ?? []).some((s) => parseModuleBody(s.body.en ?? '').some((b) => b.type === 'code'));
  if (!hasCode) return 'complete';
  // COMPLETE only when every code block is a runnable unit that the verifier executed with this exact code.
  const verified = verification && verification.units.length === codeBlocks && verification.units.every(verification.isVerified);
  return verified ? 'complete' : 'needs_verification';
}

/** Validation and status together — the single rule used by the module page, the Library and the exports. */
export function evaluateModule(
  sections: ModuleSection[] | undefined,
  ctx: ModuleValidationContext & { units?: ModuleCodeUnit[] },
): { problems: ModuleProblem[]; status: ModuleContentStatus } {
  if (!hasModuleContent(sections)) return { problems: validateModuleContent(sections, { discipline: ctx.discipline }), status: 'not_written' };
  const problems = validateModuleContent(sections, ctx);
  const verification = ctx.units && ctx.isVerified ? { units: ctx.units, isVerified: ctx.isVerified } : undefined;
  return { problems, status: moduleContentStatus(sections, problems, verification) };
}
