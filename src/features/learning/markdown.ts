import { parseInline, type InlineToken } from '@/db/content/inline';
import { moduleUnitKey, parseModuleBody } from '@/db/content/module';
import { moduleUnitStatus } from '@/content/verification';

const MODULE_RUNTIME: Record<string, string> = { lua: 'lua54', luau: 'luau', python: 'python' };
import { GENERATED_SECTIONS, MODULE_SECTIONS, type ContentBlock, type GlossaryTerm, type LanguageCode, type Lecture, type LocalizedText, type Module, type Note } from '@/db/types';
import type { CourseBundle, LectureBundle } from './data';
import { verificationOf, type VerificationStatus } from '@/content/verification';

/**
 * Markdown export of COURSE MATERIALS only (Part H). Practice Center exercises, quiz questions
 * and assessment answers are never part of lecture content, so they can never leak into exports.
 */
export interface ExportLabels {
  section: (kind: string) => string;
  difficulty: (level: string) => string;
  runtime: (runtime: string) => string;
  expectedOutput: string;
  lines: string;
  notApplicable: string;
  noContent: string;
  minutes: (n: number) => string;
  credits: (n: number) => string;
  contents: string;
  generated: string;
  externalLink: string;
  notes: string;
  /** Verification status line for an example (from the manifest; null = not verified in this form). */
  status: (runtime: string, status: VerificationStatus | null) => string;
  input: string;
  debugTitle: string;
  brokenCode: string;
  errorMessage: string;
  fix: string;
  /** Module-level materials (optional so older label sets keep working; English defaults). */
  moduleContent?: string;
  moduleSection?: (kind: string) => string;
  moduleNotWritten?: string;
  moduleUnverifiedCode?: string;
}

const pick = (t: LocalizedText | undefined, lang: LanguageCode) => (t ? (lang === 'en' ? t.en || t.ms : t.ms) : '');

function inline(text: string, glossary: Map<string, GlossaryTerm>): string {
  const md = (tokens: InlineToken[], inBold: boolean): string =>
    tokens
      .map((tok) => {
        switch (tok.kind) {
          case 'bold':
            return `**${md(tok.children, true)}**`;
          case 'code':
            return `\`${tok.text}\``;
          case 'term': {
            // A glossary term is written in bold; inside bold text it is already bold.
            const label = tok.label ?? glossary.get(tok.key)?.term ?? tok.key;
            return inBold ? label : `**${label}**`;
          }
          case 'link':
            return `[${tok.label}](${tok.url})`;
          default:
            return tok.text;
        }
      })
      .join('');
  return md(parseInline(text), false);
}

function block(b: ContentBlock, lang: LanguageCode, glossary: Map<string, GlossaryTerm>, labels: ExportLabels, scope: string): string {
  const txt = (t: LocalizedText) => inline(pick(t, lang), glossary);
  switch (b.type) {
    case 'paragraph':
      return txt(b.text);
    case 'list':
      return b.items.map((item, i) => `${b.ordered ? `${i + 1}.` : '-'} ${txt(item)}`).join('\n');
    case 'callout':
      return `> ${b.tone === 'warning' ? '⚠️ ' : b.tone === 'key' ? '🔑 ' : 'ℹ️ '}${b.title ? `**${txt(b.title)}** — ` : ''}${txt(b.text)}`;
    case 'code': {
      const key = `${scope}#${b.id}`;
      const out = [
        `**${txt(b.title)}** · _${labels.runtime(b.runtime)}_`,
        '',
        `_${labels.status(b.runtime, verificationOf(key, b))}_`,
        '',
        `\`\`\`${b.language}`,
        b.code,
        '```',
        ...(b.input !== undefined ? ['', `${labels.input}:`, '', '```text', b.input, '```'] : []),
        ...(b.expectedOutput !== undefined ? ['', `${labels.expectedOutput}:`, '', '```text', b.expectedOutput, '```'] : []),
      ];
      if (b.debug) {
        const d = b.debug;
        out.push(
          '', `**${labels.debugTitle}** — _${labels.status(b.runtime, verificationOf(`${key}:debug`, { runtime: b.runtime, code: d.code, input: b.input, expectedError: d.error }))}_`,
          '', `${labels.brokenCode}:`, '', `\`\`\`${b.language}`, d.code, '```',
          '', `${labels.errorMessage}:`, '', '```text', d.error, '```',
          '', `${labels.fix}: ${txt(d.explanation)}`,
        );
      }
      return out.join('\n');
    }
    case 'explain':
      return [`\`${b.codeId}\``, ...b.items.map((i) => `- **${labels.lines} ${i.lines}:** ${txt(i.text)}`)].join('\n');
    case 'terms':
      return b.keys
        .map((k) => glossary.get(k))
        .filter((g): g is GlossaryTerm => Boolean(g))
        .map((g) => `- **${g.term}** (${g.translation}): ${inline(pick(g.definition, lang), glossary)}`)
        .join('\n');
    case 'links':
      return b.items.map((l) => `- [${l.title}](${l.url})`).join('\n');
  }
}

/** The four generated sections (1–4) rendered from curriculum metadata. */
function metadataTable(b: LectureBundle, lang: LanguageCode, labels: ExportLabels): string {
  return [
    `| ${labels.section('lecture_information')} | ${b.course.code} · ${b.number} — ${pick(b.lecture.title, lang)} |`,
    '|---|---|',
    `| ${labels.section('course_information')} | ${b.course.code} — ${pick(b.course.title, lang)} (${labels.credits(b.course.creditHours)}) |`,
    `| ${labels.section('academic_level')} | ${labels.difficulty(b.lecture.difficulty)} |`,
    `| ${labels.section('estimated_duration')} | ${labels.minutes(b.lecture.estimatedMinutes)} |`,
  ].join('\n');
}

export function lectureBody(lecture: Lecture, lang: LanguageCode, glossary: Map<string, GlossaryTerm>, labels: ExportLabels, scope: string, headingLevel = 2): string {
  if (lecture.sections.length === 0) return `_${labels.noContent}_`;
  const h = '#'.repeat(headingLevel);
  return lecture.sections
    .filter((s) => !GENERATED_SECTIONS.includes(s.kind))
    .map((s) => {
      const body = s.notApplicable ? `_${labels.notApplicable}: ${inline(pick(s.notApplicable, lang), glossary)}_` : s.blocks.map((x) => block(x, lang, glossary, labels, scope)).join('\n\n');
      return `${h} ${labels.section(s.kind)}\n\n${body}`;
    })
    .join('\n\n');
}

export function lectureMarkdown(b: LectureBundle, lang: LanguageCode, glossary: Map<string, GlossaryTerm>, labels: ExportLabels, meta: { app: string; date: string }): string {
  return [
    `# ${b.course.code} · ${labels.section('lecture_information')} ${b.number}: ${pick(b.lecture.title, lang)}`,
    '',
    `_QHAZE TECH UNIVERSITY · ${pick(b.programme?.name, lang)} · ${labels.generated} ${meta.date} · v${b.lecture.contentVersion ?? '—'} / app ${meta.app}_`,
    '',
    metadataTable(b, lang, labels),
    '',
    lectureBody(b.lecture, lang, glossary, labels, `${b.course.code} ${b.module.order}.${b.lecture.order}`),
    '',
  ].join('\n');
}

export function courseMarkdown(b: CourseBundle, lang: LanguageCode, glossary: Map<string, GlossaryTerm>, labels: ExportLabels, meta: { app: string; date: string }, onlyModuleId?: string): string {
  const modules = b.modules.filter((m) => !onlyModuleId || m.module.id === onlyModuleId);
  const toc = modules.flatMap((m) => [
    `- ${pick(m.module.title, lang)}`,
    ...m.lectures.map((l) => `  - ${m.module.order}.${l.order} ${pick(l.title, lang)}`),
  ]);
  const body = modules.flatMap((m) => [
    `## ${m.module.order}. ${pick(m.module.title, lang)}`,
    '',
    moduleMarkdown(m.module, lang, glossary, labels, 3, b.course.code),
    '',
    ...m.lectures.flatMap((l) => [
      `### ${m.module.order}.${l.order} ${pick(l.title, lang)}`,
      '',
      `_${labels.difficulty(l.difficulty)} · ${labels.minutes(l.estimatedMinutes)}_`,
      '',
      lectureBody(l, lang, glossary, labels, `${b.course.code} ${m.module.order}.${l.order}`, 4),
      '',
    ]),
  ]);
  return [
    `# ${b.course.code}: ${pick(b.course.title, lang)}`,
    '',
    `_QHAZE TECH UNIVERSITY · ${pick(b.programme?.name, lang)} · ${labels.credits(b.course.creditHours)} · ${labels.generated} ${meta.date} · app ${meta.app}_`,
    '',
    pick(b.course.description, lang),
    '',
    `## ${labels.contents}`,
    '',
    ...toc,
    '',
    ...body,
  ].join('\n');
}

export function notesMarkdown(title: string, notes: Note[], labels: ExportLabels): string {
  return [`# ${labels.notes}: ${title}`, '', ...notes.flatMap((n) => [`## ${n.title}`, '', n.body, ''])].join('\n');
}

/** Source files for a ZIP download: one file per code example, with a header comment. */
/** File extension and line-comment syntax of each code language (source downloads). */
export const sourceExtension = (language: string) => (language === 'python' ? 'py' : language === 'lua' ? 'lua' : 'luau');
export const commentPrefix = (language: string) => (language === 'python' ? '#' : '--');

export function codeFiles(lectures: { prefix: string; lecture: Lecture }[], lang: LanguageCode, labels: ExportLabels) {
  const files: { name: string; content: string }[] = [];
  for (const { prefix, lecture } of lectures) {
    let n = 0;
    for (const s of lecture.sections) for (const b of s.blocks) {
      if (b.type !== 'code') continue;
      n++;
      const ext = sourceExtension(b.language);
      const c = commentPrefix(b.language);
      const header = [`${c} ${pick(b.title, lang)}`, `${c} ${labels.runtime(b.runtime)}`];
      if (b.expectedOutput !== undefined) header.push(`${c} ${labels.expectedOutput}:`, ...b.expectedOutput.split('\n').map((line) => `${c}   ${line}`));
      const base = `${prefix}${String(n).padStart(2, '0')}-${b.id}`;
      files.push({ name: `${base}.${ext}`, content: `${header.join('\n')}\n\n${b.code}\n` });
      if (b.input !== undefined) files.push({ name: `${base}.input.txt`, content: `${b.input}\n` });
      if (b.debug) {
        const h = [`${c} ${pick(b.title, lang)} — ${labels.brokenCode}`, `${c} ${labels.errorMessage}: ${b.debug.error}`];
        files.push({ name: `${base}.buggy.${ext}`, content: `${h.join('\n')}\n\n${b.debug.code}\n` });
      }
    }
  }
  return files;
}

/**
 * A module's own learning materials (module layer), written before its lectures in module and course documents.
 * Sections follow MODULE_SECTIONS; an unwritten module says so explicitly rather than being silently empty.
 */
export function moduleMarkdown(module: Module, lang: LanguageCode, glossary: Map<string, GlossaryTerm>, labels: ExportLabels, headingLevel = 3, courseCode?: string): string {
  const h = '#'.repeat(headingLevel);
  const title = labels.moduleContent ?? 'Module content';
  const byKind = new Map((module.sections ?? []).map((s) => [s.kind, s]));
  const present = MODULE_SECTIONS.filter((k) => pick(byKind.get(k)?.body, lang).trim());
  if (!present.length) return [`${h} ${title}`, '', `_${labels.moduleNotWritten ?? 'Module-level content has not been written yet.'}_`].join('\n');
  const out: string[] = [`${h} ${title}`, ''];
  present.forEach((kind, i) => {
    out.push(`${h}# ${i + 1}. ${labels.moduleSection ? labels.moduleSection(kind) : kind}`, '');
    let codeIndex = 0;
    for (const b of parseModuleBody(pick(byKind.get(kind)!.body, lang))) {
      if (b.type === 'paragraph') out.push(inline(b.text, glossary), '');
      else if (b.type === 'list') out.push(...b.items.map((item, j) => `${b.ordered ? `${j + 1}.` : '-'} ${inline(item, glossary)}`), '');
      else {
        codeIndex++;
        const runtime = MODULE_RUNTIME[b.language];
        const status = courseCode && runtime ? moduleUnitStatus({ key: moduleUnitKey(courseCode, module.order, kind, codeIndex), runtime, code: b.code, expectedOutput: b.expectedOutput }) : null;
        const label = status === 'executed' && runtime ? labels.status(runtime, status) : (labels.moduleUnverifiedCode ?? 'Module code example · not yet verified by execution');
        out.push(`_${label}_`, '', `\`\`\`${b.language === 'text' ? '' : b.language}`, b.code, '```', '');
        if (b.expectedOutput !== undefined) out.push(`${labels.expectedOutput}:`, '', '```', b.expectedOutput, '```', '');
      }
    }
  });
  return out.join('\n').trimEnd();
}
