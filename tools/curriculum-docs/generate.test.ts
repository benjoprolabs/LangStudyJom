/**
 * Regenerates the generated blocks of docs/CURRICULUM.md from the package data:
 *   npm run docs:curriculum
 * Text between `<!-- generated:NAME -->` and `<!-- /generated:NAME -->` is replaced; the rest of
 * the document is hand-written and left untouched.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { CONTENT_PACKAGES } from '@/content';
import { collectCodeExamples } from '@/db/content/validate';
import { CURRICULUM_PACKAGES } from '@/db/seed/packages';
import type { ProgrammeDef } from '@/db/seed/types';
import { en } from '@/i18n/locales/en';

const DOC = 'docs/CURRICULUM.md';
const level = (d: string) => (en.difficulty as Record<string, string>)[d] ?? d;

function programmeSection(p: ProgrammeDef): string {
  const courses = p.semesters.flatMap((s) => s.courses);
  const modules = courses.flatMap((c) => c.modules);
  const lectures = modules.flatMap((m) => m.lectures).length;
  const credits = courses.reduce((n, c) => n + c.creditHours, 0);
  const prereqs = courses.reduce((n, c) => n + c.prerequisites.length, 0);
  const out = [
    `**${p.name.en}** (${p.name.ms}), ${level(p.entryLevel)} to ${level(p.exitLevel)}: ${p.semesters.length} semesters, ${courses.length} courses, ${modules.length} modules, ${lectures} lectures, ${credits} credit hours, ${prereqs} prerequisite links.`,
  ];
  for (const s of p.semesters) {
    const cr = s.courses.reduce((n, c) => n + c.creditHours, 0);
    out.push('', `### Semester ${s.number}: ${s.title.en} (${s.title.ms}), ${cr} credits`, '', '| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |', '|---|---|---|---|---|---|');
    for (const c of s.courses) {
      const pre = c.prerequisites.length ? c.prerequisites.map((x) => (x.kind === 'recommended' ? `${x.code} (recommended)` : x.code)).join(', ') : 'None';
      out.push(`| ${c.code} | ${c.title.en}<br>*${c.title.ms}* | ${c.creditHours} | ${level(c.difficulty)} | ${pre} | ${c.modules.map((m) => m.title.en).join('; ')} |`);
    }
  }
  return out.join('\n');
}

function contentStatus(): string {
  const out = ['| Course | Lecture | Title (EN) | Sections | Verified code units: executed (examples + debug variants) / Roblox, compiled only |', '|---|---|---|---|---|'];
  const programmes = CURRICULUM_PACKAGES.flatMap((p) => p.programmes);
  for (const pkg of CONTENT_PACKAGES) {
    for (const l of pkg.lectures) {
      const course = programmes.flatMap((p) => p.semesters.flatMap((s) => s.courses)).find((c) => c.code === l.courseCode)!;
      const examples = collectCodeExamples({ ...pkg, lectures: [l], glossary: [] });
      const roblox = examples.filter((b) => b.runtime === 'roblox').length;
      out.push(`| ${l.courseCode} | ${l.module}.${l.lecture} | ${course.modules[l.module - 1]!.lectures[l.lecture - 1]!.title.en} | 4 generated + ${l.sections.length} authored | ${examples.length - roblox} / ${roblox} |`);
    }
  }
  out.push('');
  out.push('| Programme | Lectures | With full content | Structure only |', '|---|---|---|---|');
  for (const p of programmes) {
    const codes = new Set(p.semesters.flatMap((s) => s.courses.map((c) => c.code)));
    const total = p.semesters.flatMap((s) => s.courses.flatMap((c) => c.modules.flatMap((m) => m.lectures))).length;
    const ready = CONTENT_PACKAGES.flatMap((c) => c.lectures).filter((l) => codes.has(l.courseCode)).length;
    out.push(`| ${p.code} | ${total} | ${ready} | ${total - ready} |`);
  }
  return out.join('\n');
}

function replaceBlock(doc: string, name: string, body: string): string {
  const re = new RegExp(`(<!-- generated:${name} -->)[\\s\\S]*?(<!-- /generated:${name} -->)`);
  expect(doc, `marker ${name}`).toMatch(re);
  return doc.replace(re, (_m, a: string, b: string) => `${a}\n${body}\n${b}`);
}

it('regenerates docs/CURRICULUM.md', () => {
  let doc = readFileSync(DOC, 'utf-8');
  for (const pkg of CURRICULUM_PACKAGES) for (const p of pkg.programmes) doc = replaceBlock(doc, p.code, programmeSection(p));
  doc = replaceBlock(doc, 'content-status', contentStatus());
  writeFileSync(DOC, doc);
});
