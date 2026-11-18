import { AUTHORED_SECTIONS, OPTIONAL_SECTIONS, type ContentBlock, type LectureSection, type LocalizedText } from '../types';
import { parseInline } from './inline';
import { pathwayOf, type ContentPackage, type GlossaryTermDef } from './types';

/**
 * Quality assurance for course materials (Professional Programming Education Standard, Part L).
 * Pure function: no database access. Returns human-readable problems; [] means valid.
 */

const KEY_RE = /^[a-z0-9-]+$/;
/** Sections that must contain at least one code / explanation block. */
const CODE_SECTIONS = ['code_demonstration', 'complete_examples'] as const;

/** Roblox engine identifiers that must never appear in standard-Lua code. */
const ROBLOX_IDENTIFIERS = /\b(game|workspace|script|Instance|Players|Enum|task|Vector3|CFrame|RemoteEvent|DataStoreService)\b/;
/** Luau-only syntax that standard Lua does not accept. */
const LUAU_ONLY_SYNTAX = /(\+=|-=|\*=|\/=|\.\.=|`[^`]*\{[^}]*\}[^`]*`|\bcontinue\b|:\s*(number|string|boolean)\b|\btype\s+\w+\s*=)/;

export function validateLectureSections(sections: LectureSection[], courseCode: string, glossaryKeys: Set<string>, glossaryScope: Map<string, string>): string[] {
  const errors: string[] = [];
  const where = (s: string) => `${courseCode}: ${s}`;
  const pathway = pathwayOf(courseCode);

  const kinds = sections.map((s) => s.kind);
  if (kinds.join(',') !== AUTHORED_SECTIONS.join(',')) {
    const missing = AUTHORED_SECTIONS.filter((k) => !kinds.includes(k));
    errors.push(where(missing.length ? `missing sections: ${missing.join(', ')}` : 'sections are not in template order'));
  }

  const text = (w: string, t: LocalizedText | undefined) => {
    if (!t?.ms?.trim()) errors.push(where(`${w}: Malay text missing`));
    if (!t?.en?.trim()) errors.push(where(`${w}: English text missing`));
    for (const lang of ['ms', 'en'] as const) {
      for (const token of parseInline(t?.[lang] ?? '')) {
        if (token.kind === 'term') checkTerm(w, token.key);
        if (token.kind === 'link' && !token.url.startsWith('https://')) errors.push(where(`${w}: external link must use https (${token.url})`));
      }
    }
  };
  const checkTerm = (w: string, key: string) => {
    if (!glossaryKeys.has(key)) errors.push(where(`${w}: glossary link [[${key}]] does not resolve`));
    const scope = glossaryScope.get(key);
    if (pathway === 'lua' && (scope === 'roblox' || scope === 'luau')) errors.push(where(`${w}: Lua lecture links ${scope} concept [[${key}]]`));
  };

  const codeIds = new Set<string>();
  const codeById = new Map<string, string>();
  const allBlocks = sections.flatMap((s) => s.blocks.map((b) => ({ section: s.kind, block: b })));
  for (const { block } of allBlocks) if (block.type === 'code') {
    if (codeIds.has(block.id)) errors.push(where(`duplicate code id ${block.id}`));
    codeIds.add(block.id);
    codeById.set(block.id, block.code);
  }

  for (const section of sections) {
    const w = section.kind;
    if (section.notApplicable) {
      if (!OPTIONAL_SECTIONS.includes(section.kind)) errors.push(where(`${w}: only ${OPTIONAL_SECTIONS.join(' / ')} may be marked not applicable`));
      text(`${w} (not applicable)`, section.notApplicable);
      continue;
    }
    if (section.blocks.length === 0) errors.push(where(`${w}: has no content`));
    for (const block of section.blocks) checkBlock(w, block);
  }

  function checkBlock(w: string, block: ContentBlock) {
    switch (block.type) {
      case 'paragraph':
        return text(w, block.text);
      case 'list':
        if (!block.items.length) errors.push(where(`${w}: empty list`));
        return block.items.forEach((item, i) => text(`${w} item ${i + 1}`, item));
      case 'callout':
        if (block.title) text(`${w} callout title`, block.title);
        return text(`${w} callout`, block.text);
      case 'code': {
        const cw = `${w} code ${block.id}`;
        text(`${cw} title`, block.title);
        if (!block.code.trim()) errors.push(where(`${cw}: empty code`));
        if (block.language === 'lua' && block.runtime !== 'lua54') errors.push(where(`${cw}: Lua code must use runtime lua54`));
        if (block.language === 'luau' && block.runtime === 'lua54') errors.push(where(`${cw}: Luau code cannot use runtime lua54`));
        if (block.runtime !== 'roblox' && block.expectedOutput === undefined) errors.push(where(`${cw}: runnable code needs expectedOutput`));
        if (pathway === 'lua') {
          if (block.language !== 'lua') errors.push(where(`${cw}: Lua lecture contains ${block.language} code`));
          if (ROBLOX_IDENTIFIERS.test(block.code)) errors.push(where(`${cw}: Lua code uses a Roblox identifier`));
          if (LUAU_ONLY_SYNTAX.test(block.code)) errors.push(where(`${cw}: Lua code uses Luau-only syntax`));
        }
        if (block.runtime === 'luau' && ROBLOX_IDENTIFIERS.test(block.code)) errors.push(where(`${cw}: code marked "luau" (runs outside Roblox) uses a Roblox API`));
        return;
      }
      case 'explain':
        if (!codeIds.has(block.codeId)) errors.push(where(`${w}: explains unknown code ${block.codeId}`));
        if (!block.items.length) errors.push(where(`${w}: empty explanation`));
        block.items.forEach((item, i) => text(`${w} explanation ${i + 1}`, item.text));
        return checkExplainCoverage(w, block);
      case 'terms':
        return block.keys.forEach((k) => checkTerm(w, k));
      case 'links':
        return block.items.forEach((l) => {
          if (!l.url.startsWith('https://')) errors.push(where(`${w}: reference must use https (${l.url})`));
          if (!l.title.trim()) errors.push(where(`${w}: reference without title`));
        });
    }
  }

  /**
   * Line-by-line rule: ranges ("3", "3–6") must lie inside the code, and every line that is not blank,
   * not a comment and not a lone closing keyword must be explained. Catches gaps and off-by-one ranges.
   */
  function checkExplainCoverage(w: string, block: Extract<ContentBlock, { type: 'explain' }>) {
    const code = codeById.get(block.codeId);
    if (code === undefined) return;
    const lines = codeLines(code);
    const covered = new Set<number>();
    for (const item of block.items) {
      const range = parseLineRange(item.lines);
      if (!range || range[0] < 1 || range[1] > lines.length || range[0] > range[1]) {
        errors.push(where(`${w}: explanation range "${item.lines}" is outside ${block.codeId} (1–${lines.length})`));
        continue;
      }
      for (let n = range[0]; n <= range[1]; n++) covered.add(n);
      if (range[0] === range[1] && !lines[range[0] - 1]!.trim()) errors.push(where(`${w}: explanation "${item.lines}" points at a blank line of ${block.codeId}`));
    }
    const missing = lines.map((l, i) => [l.trim(), i + 1] as const).filter(([l, n]) => l && !l.startsWith('--') && !TRIVIAL_LINE.test(l) && !covered.has(n));
    if (missing.length) errors.push(where(`${w}: ${block.codeId} lines not explained: ${missing.map(([, n]) => n).join(', ')}`));
  }

  // Section-specific requirements of the standard.
  const blocksOf = (kind: string) => sections.find((s) => s.kind === kind)?.blocks ?? [];
  for (const kind of CODE_SECTIONS) if (!blocksOf(kind).some((b) => b.type === 'code')) errors.push(where(`${kind}: must contain code`));
  if (!blocksOf('line_by_line').some((b) => b.type === 'explain')) errors.push(where('line_by_line: must explain code line by line'));
  if (!blocksOf('technical_terminology').some((b) => b.type === 'terms')) errors.push(where('technical_terminology: must list glossary terms'));
  if (!blocksOf('knowledge_check').some((b) => b.type === 'list')) errors.push(where('knowledge_check: must contain questions'));
  if (!blocksOf('references').some((b) => b.type === 'links')) errors.push(where('references: must contain links'));
  return errors;
}

/** A lone closing token needs no explanation of its own ("end", "end)", "},", "until x" does). */
const TRIVIAL_LINE = /^(end[,)]*|[}\])]+[,)]*;?|else)$/;

/** Code lines as displayed and numbered in the reader (the leading newline of a template literal is dropped). */
export function codeLines(code: string): string[] {
  return code.replace(/^\n/, '').replace(/\n$/, '').split('\n');
}

/** "7" → [7, 7]; "3–6" or "3-6" → [3, 6]. */
export function parseLineRange(spec: string): [number, number] | null {
  const m = /^(\d+)(?:\s*[-–]\s*(\d+))?$/.exec(spec.trim());
  return m ? [Number(m[1]), Number(m[2] ?? m[1])] : null;
}

export function validateGlossaryTerm(t: GlossaryTermDef, keys: Set<string>): string[] {
  const e: string[] = [];
  const w = `glossary ${t.key}`;
  if (!KEY_RE.test(t.key)) e.push(`${w}: invalid key`);
  if (!t.term.trim() || !t.translation.trim()) e.push(`${w}: term and translation are required`);
  for (const [name, v] of [['definition', t.definition], ['explanation', t.explanation]] as const) {
    if (!v.ms?.trim() || !v.en?.trim()) e.push(`${w}: ${name} must be bilingual`);
  }
  for (const r of t.related) if (!keys.has(r)) e.push(`${w}: related term ${r} does not exist`);
  for (const r of t.references) if (!r.url.startsWith('https://')) e.push(`${w}: reference must use https`);
  if (t.example) {
    if (t.example.runtime !== 'roblox' && t.example.expectedOutput === undefined) e.push(`${w}: runnable example needs expectedOutput`);
    if (t.scope === 'roblox' && t.example.runtime !== 'roblox') e.push(`${w}: Roblox concept must use a Roblox example`);
    if (t.scope !== 'roblox' && t.example.runtime === 'roblox') e.push(`${w}: non-Roblox concept uses a Roblox-only example`);
    if (t.example.language === 'lua' && t.example.runtime !== 'lua54') e.push(`${w}: Lua example must use lua54`);
  }
  return e;
}

export function validateContentPackage(pkg: ContentPackage): string[] {
  const errors: string[] = [];
  const keys = new Set<string>();
  for (const t of pkg.glossary) {
    if (keys.has(t.key)) errors.push(`glossary ${t.key}: duplicate key`);
    keys.add(t.key);
  }
  const scope = new Map(pkg.glossary.map((t) => [t.key, t.scope]));
  for (const t of pkg.glossary) errors.push(...validateGlossaryTerm(t, keys));
  const seen = new Set<string>();
  for (const l of pkg.lectures) {
    const id = `${l.courseCode} ${l.module}.${l.lecture}`;
    if (seen.has(id)) errors.push(`${id}: listed twice`);
    seen.add(id);
    errors.push(...validateLectureSections(l.sections, id, keys, scope));
  }
  return errors;
}

/** Every code example in a package (lectures and glossary), for execution verification. */
export function collectCodeExamples(pkg: ContentPackage) {
  const out: { where: string; id: string; language: 'lua' | 'luau'; runtime: string; code: string; expectedOutput?: string }[] = [];
  for (const l of pkg.lectures) {
    for (const s of l.sections) for (const b of s.blocks) {
      if (b.type === 'code') out.push({ where: `${l.courseCode} ${l.module}.${l.lecture}`, id: b.id, language: b.language, runtime: b.runtime, code: b.code, expectedOutput: b.expectedOutput });
    }
  }
  for (const t of pkg.glossary) {
    if (t.example) out.push({ where: `glossary`, id: t.key, language: t.example.language, runtime: t.example.runtime, code: t.example.code, expectedOutput: t.example.expectedOutput });
  }
  return out;
}
