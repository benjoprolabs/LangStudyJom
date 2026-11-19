/**
 * University-wide content audit. Reads the curriculum packages (structure), the content packages (lecture
 * materials), the glossary and the code-verification manifest, classifies every lecture, and writes:
 *   docs/content-audit/lectures.csv   one row per lecture (status, missing sections, code units, problems)
 *   docs/content-audit/modules.csv    one row per module
 *   docs/content-audit/courses.csv    one row per course
 *   docs/content-audit/SUMMARY.md     generated tables (levels, percentages, integrity findings)
 * It never writes to the database or to any content file.  Run: npm run audit:content
 */
import { it } from 'vitest';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { CONTENT_PACKAGES } from '@/content';
import { validateContentPackage } from '@/db/content/validate';
import type { LectureContentDef } from '@/db/content/types';
import { CURRICULUM_PACKAGES } from '@/db/seed/packages';
import type { AcademyDef, CourseDef, FacultyDef, ProgrammeDef } from '@/db/seed/types';
import { AUTHORED_SECTIONS, type ContentBlock, type LocalizedText } from '@/db/types';

type Status = 'COMPLETE' | 'NEEDS VERIFICATION' | 'PARTIAL' | 'STRUCTURE ONLY';
const STATUSES: Status[] = ['COMPLETE', 'NEEDS VERIFICATION', 'PARTIAL', 'STRUCTURE ONLY'];
const OUT = 'docs/content-audit';
const verification = JSON.parse(readFileSync('src/content/verification.json', 'utf-8')).results as Record<string, { status: string }>;

// ─── Structure (merged across packages, as the installer does: matched by code) ──
const faculties = new Map<string, FacultyDef>();
const academies = new Map<string, AcademyDef>();
const programmes = new Map<string, ProgrammeDef>();
for (const pkg of CURRICULUM_PACKAGES) {
  for (const f of pkg.faculties) if (!faculties.has(f.code)) faculties.set(f.code, f);
  for (const a of pkg.academies) if (!academies.has(a.code)) academies.set(a.code, a);
  for (const p of pkg.programmes) if (!programmes.has(p.code)) programmes.set(p.code, p);
}
const content = new Map<string, LectureContentDef>();
const contentDuplicates: string[] = [];
for (const pkg of CONTENT_PACKAGES)
  for (const l of pkg.lectures) {
    const key = `${l.courseCode} ${l.module}.${l.lecture}`;
    if (content.has(key)) contentDuplicates.push(key);
    content.set(key, l);
  }
const glossary = CONTENT_PACKAGES.flatMap((p) => p.glossary);
const glossaryKeys = new Set(glossary.map((g) => g.key));

const en = (t: LocalizedText) => t.en;
const csv = (rows: (string | number)[][]) => rows.map((r) => r.map((v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))).join(',')).join('\n') + '\n';
const pct = (n: number, d: number) => (d === 0 ? '—' : `${((100 * n) / d).toFixed(1)}%`);

// ─── Lecture classification ─────────────────────────────────────────────────
interface LectureRow {
  programme: string; semester: number; course: string; module: number; lecture: number; title: string; minutes: number;
  status: Status; sections: number; missing: string[]; codeBlocks: number; units: number; executed: number; errorMatched: number;
  compiledOnly: number; unverified: number; words: number; problems: string[];
}
const textsOf = (blocks: ContentBlock[]): string[] =>
  blocks.flatMap((b) => {
    if (b.type === 'paragraph') return [b.text.ms, b.text.en];
    if (b.type === 'list') return b.items.flatMap((i) => [i.ms, i.en]);
    if (b.type === 'callout') return [b.text.ms, b.text.en, ...(b.title ? [b.title.ms, b.title.en] : [])];
    if (b.type === 'explain') return b.items.flatMap((i) => [i.text.ms, i.text.en]);
    if (b.type === 'code') return [b.title.ms, b.title.en, ...(b.debug ? [b.debug.explanation.ms, b.debug.explanation.en] : [])];
    return [];
  });
const termRefs = (blocks: ContentBlock[]): string[] => [
  ...blocks.flatMap((b) => (b.type === 'terms' ? b.keys : [])),
  ...textsOf(blocks).flatMap((t) => [...t.matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]*)?\]\]/g)].map((m) => m[1]!)),
];

function classify(course: CourseDef, m: number, l: number, def: LectureContentDef | undefined): Omit<LectureRow, 'programme' | 'semester' | 'course' | 'module' | 'lecture' | 'title' | 'minutes'> {
  if (!def)
    return { status: 'STRUCTURE ONLY', sections: 0, missing: ['ALL 24 authored sections (only title and duration exist)'], codeBlocks: 0, units: 0, executed: 0, errorMatched: 0, compiledOnly: 0, unverified: 0, words: 0, problems: [] };
  const problems: string[] = [];
  const present = new Set(def.sections.filter((s) => s.blocks.length > 0 || s.notApplicable).map((s) => s.kind));
  const missing = AUTHORED_SECTIONS.filter((k) => !present.has(k));
  const pkg = CONTENT_PACKAGES.find((p) => p.lectures.includes(def))!;
  problems.push(...validateContentPackage({ ...pkg, glossary: [], lectures: [def] }).filter((e) => !/glossary|term '/.test(e)));
  const blocks = def.sections.flatMap((s) => s.blocks);
  const codes = blocks.filter((b): b is Extract<ContentBlock, { type: 'code' }> => b.type === 'code');
  let executed = 0, errorMatched = 0, compiledOnly = 0, unverified = 0;
  const key = `${course.code} ${m}.${l}`;
  for (const c of codes)
    for (const unit of [`${key}#${c.id}`, ...(c.debug ? [`${key}#${c.id}:debug`] : [])]) {
      const s = verification[unit]?.status;
      if (s === 'executed') executed++;
      else if (s === 'error-matched') errorMatched++;
      else if (s === 'compiled') compiledOnly++;
      else unverified++;
    }
  for (const ref of termRefs(blocks)) if (!glossaryKeys.has(ref)) problems.push(`glossary link to unknown term '${ref}'`);
  const words = textsOf(blocks).join(' ').split(/\s+/).filter(Boolean).length;
  let status: Status = 'COMPLETE';
  if (missing.length || problems.length) status = 'PARTIAL';
  else if (compiledOnly || unverified) status = 'NEEDS VERIFICATION';
  return { status, sections: present.size, missing, codeBlocks: codes.length, units: executed + errorMatched + compiledOnly + unverified, executed, errorMatched, compiledOnly, unverified, words, problems };
}

it('audits the whole university', () => {
  mkdirSync(OUT, { recursive: true });
  const lectures: LectureRow[] = [];
  const courseCodes = new Map<string, number>();
  const prereqProblems: string[] = [];
  const allCourses: { programme: string; semester: number; course: CourseDef }[] = [];
  for (const p of programmes.values())
    for (const s of p.semesters)
      for (const c of s.courses) {
        courseCodes.set(c.code, (courseCodes.get(c.code) ?? 0) + 1);
        allCourses.push({ programme: p.code, semester: s.number, course: c });
        c.modules.forEach((mod, mi) =>
          mod.lectures.forEach((lec, li) => {
            const def = content.get(`${c.code} ${mi + 1}.${li + 1}`);
            lectures.push({ programme: p.code, semester: s.number, course: c.code, module: mi + 1, lecture: li + 1, title: en(lec.title), minutes: lec.minutes, ...classify(c, mi + 1, li + 1, def) });
          }),
        );
      }
  for (const { course } of allCourses) for (const r of course.prerequisites) if (!courseCodes.has(r.code)) prereqProblems.push(`${course.code} → ${r.code}`);

  // ─── Integrity findings ───
  const lectureKeys = new Set(lectures.map((l) => `${l.course} ${l.module}.${l.lecture}`));
  const orphanContent = [...content.keys()].filter((k) => !lectureKeys.has(k));
  const duplicateCourseCodes = [...courseCodes].filter(([, n]) => n > 1).map(([c]) => c);
  const dupTitlesInCourse: string[] = [];
  for (const { course } of allCourses) {
    const seen = new Map<string, number>();
    for (const m of course.modules) for (const l of m.lectures) seen.set(en(l.title).toLowerCase(), (seen.get(en(l.title).toLowerCase()) ?? 0) + 1);
    for (const [t, n] of seen) if (n > 1) dupTitlesInCourse.push(`${course.code}: "${t}" ×${n}`);
  }
  const glossaryProblems: string[] = [];
  const glossaryPlanned: string[] = [];
  for (const g of glossary) {
    for (const r of g.related) if (!glossaryKeys.has(r)) glossaryProblems.push(`${g.key}: related term '${r}' does not exist`);
    for (const ref of g.lectures) {
      const k = `${ref.courseCode} ${ref.module}.${ref.lecture}`;
      if (!lectureKeys.has(k)) glossaryProblems.push(`${g.key}: points to missing lecture ${k}`);
      else if (!content.has(k)) {
        const taught = [...content.values()].some((l) => termRefs(l.sections.flatMap((x) => x.blocks)).includes(g.key));
        if (taught) glossaryProblems.push(`${g.key}: points to structure-only lecture ${k} although written lectures teach it`);
        else glossaryPlanned.push(`${g.key} → ${k}`);
      }
    }
  }
  const glossaryDupes = glossary.map((g) => g.key).filter((k, i, a) => a.indexOf(k) !== i);
  const unitsWithoutLecture = Object.keys(verification).filter((k) => !k.startsWith('glossary#') && !content.has(k.split('#')[0]!));
  const lectureProblems = lectures.flatMap((l) => l.problems.map((p) => `${l.course} ${l.module}.${l.lecture}: ${p}`));

  // ─── Roll-ups ───
  type Tally = Record<Status, number> & { total: number; minutes: number; minutesDone: number };
  const tally = (rows: LectureRow[]): Tally => {
    const t = { COMPLETE: 0, 'NEEDS VERIFICATION': 0, PARTIAL: 0, 'STRUCTURE ONLY': 0, total: rows.length, minutes: 0, minutesDone: 0 } as Tally;
    for (const r of rows) {
      t[r.status]++;
      t.minutes += r.minutes;
      if (r.status === 'COMPLETE' || r.status === 'NEEDS VERIFICATION') t.minutesDone += r.minutes;
    }
    return t;
  };
  const rollStatus = (t: Tally): Status =>
    t.total > 0 && t.COMPLETE === t.total ? 'COMPLETE'
    : t.total > 0 && t.COMPLETE + t['NEEDS VERIFICATION'] === t.total ? 'NEEDS VERIFICATION'
    : t['STRUCTURE ONLY'] === t.total ? 'STRUCTURE ONLY'
    : 'PARTIAL';
  const written = (t: Tally) => t.COMPLETE + t['NEEDS VERIFICATION'];
  const row = (label: string, t: Tally) => `| ${label} | ${rollStatus(t)} | ${t.total} | ${t.COMPLETE} | ${t['NEEDS VERIFICATION']} | ${t.PARTIAL} | ${t['STRUCTURE ONLY']} | ${pct(written(t), t.total)} |`;
  const head = '| Unit | Status | Lectures | Complete | Needs verification | Partial | Structure only | Written |\n|---|---|---|---|---|---|---|---|';

  // CSVs
  writeFileSync(`${OUT}/lectures.csv`, csv([
    ['programme', 'semester', 'course', 'lecture', 'title_en', 'minutes', 'status', 'authored_sections_present', 'missing_sections', 'code_blocks', 'code_units', 'executed', 'error_matched', 'compiled_only_roblox', 'unverified', 'words_ms_en', 'problems'],
    ...lectures.map((l) => [l.programme, l.semester, l.course, `${l.module}.${l.lecture}`, l.title, l.minutes, l.status, `${l.sections}/24`, l.missing.join('; '), l.codeBlocks, l.units, l.executed, l.errorMatched, l.compiledOnly, l.unverified, l.words, l.problems.join('; ')]),
  ]));
  const moduleRows: (string | number)[][] = [];
  const courseRows: (string | number)[][] = [];
  for (const { programme, semester, course } of allCourses) {
    const rows = lectures.filter((l) => l.course === course.code);
    course.modules.forEach((m, mi) => {
      const t = tally(rows.filter((l) => l.module === mi + 1));
      moduleRows.push([programme, semester, course.code, mi + 1, en(m.title), rollStatus(t), t.total, t.COMPLETE, t['NEEDS VERIFICATION'], t.PARTIAL, t['STRUCTURE ONLY']]);
    });
    const t = tally(rows);
    courseRows.push([programme, semester, course.code, en(course.title), course.modules.length, rollStatus(t), t.total, t.COMPLETE, t['NEEDS VERIFICATION'], t.PARTIAL, t['STRUCTURE ONLY'], pct(written(t), t.total), course.description.en ? 'yes' : 'no', course.objectives.length, course.outcomes.length, course.references.length, course.prerequisites.length, 'none (Practice Center not built)']);
  }
  writeFileSync(`${OUT}/modules.csv`, csv([['programme', 'semester', 'course', 'module', 'title_en', 'status', 'lectures', 'complete', 'needs_verification', 'partial', 'structure_only'], ...moduleRows]));

  // ─── Module-level content (separate from lecture content) ───
  // The curriculum format (ModuleDef) carries only a title and lectures; the installer writes an empty module
  // description; content packages address lectures only. So no module has, or can yet hold, its own materials.
  const MODULE_SECTIONS = ['overview and introduction', 'learning objectives', 'detailed theory', 'learning notes', 'key concepts and principles',
    'terminology', 'rules, syntax or formulas', 'examples and demonstrations', 'real-world applications', 'module summary', 'references'];
  const moduleContentSupported = CONTENT_PACKAGES.some((p) => 'modules' in p);
  const moduleContent: (string | number)[][] = [];
  for (const { programme, course } of allCourses) {
    const prog = programmes.get(programme)!;
    const academy = academies.get(prog.academyCode)!;
    const faculty = faculties.get(academy.facultyCode)!;
    course.modules.forEach((m, mi) => {
      const t = tally(lectures.filter((l) => l.course === course.code && l.module === mi + 1));
      moduleContent.push([`${faculty.code} ${en(faculty.name)}`, `${academy.code} ${en(academy.name)}`, programme, course.code, `${course.code}-M${mi + 1}`, en(m.title),
        'STRUCTURE ONLY', rollStatus(t), `ALL ${MODULE_SECTIONS.length}: ${MODULE_SECTIONS.join('; ')}`, `${written(t)}/${t.total}`]);
    });
  }
  writeFileSync(`${OUT}/module-content.csv`, csv([['faculty', 'academy', 'programme', 'course', 'module_id', 'module_title_en', 'module_content_status', 'lecture_content_status', 'missing_module_sections', 'lectures_written'], ...moduleContent]));
  writeFileSync(`${OUT}/courses.csv`, csv([['programme', 'semester', 'course', 'title_en', 'modules', 'lecture_material_status', 'lectures', 'complete', 'needs_verification', 'partial', 'structure_only', 'lectures_written', 'course_description', 'course_objectives', 'course_outcomes', 'course_references', 'prerequisites', 'exercises_and_assessments'], ...courseRows]));

  // SUMMARY.md
  const md: string[] = [];
  const all = tally(lectures);
  const moduleCount = allCourses.reduce((n, c) => n + c.course.modules.length, 0);
  const semesterCount = [...programmes.values()].reduce((n, p) => n + p.semesters.length, 0);
  md.push('# Content audit — generated tables', '', 'Generated by `npm run audit:content` from the curriculum packages, content packages, glossary and `src/content/verification.json`. Do not edit by hand.', '');
  md.push('## Totals', '', '| Faculties | Academies | Programmes | Semesters | Courses | Modules | Lectures | Glossary terms |', '|---|---|---|---|---|---|---|---|',
    `| ${faculties.size} | ${academies.size} | ${programmes.size} | ${semesterCount} | ${allCourses.length} | ${moduleCount} | ${lectures.length} | ${glossary.length} |`, '');
  md.push('## Lectures by status', '', '| Status | Lectures | Share |', '|---|---|---|', ...STATUSES.map((s) => `| ${s} | ${all[s]} | ${pct(all[s], all.total)} |`), `| **Total** | **${all.total}** | |`, '');
  md.push('## University', '', head, row('QHAZE TECH UNIVERSITY', all), '');
  md.push('## Faculties', '', head);
  for (const f of [...faculties.values()].sort((a, b) => a.order - b.order)) {
    const progs = [...programmes.values()].filter((p) => academies.get(p.academyCode)?.facultyCode === f.code).map((p) => p.code);
    const t = tally(lectures.filter((l) => progs.includes(l.programme)));
    md.push(t.total ? row(`${f.code} ${en(f.name)}`, t) : `| ${f.code} ${en(f.name)} | NO CURRICULUM | 0 | — | — | — | — | — |`);
  }
  md.push('', '## Academies', '', head);
  for (const a of [...academies.values()].sort((x, y) => x.facultyCode.localeCompare(y.facultyCode) || x.order - y.order)) {
    const progs = [...programmes.values()].filter((p) => p.academyCode === a.code).map((p) => p.code);
    const t = tally(lectures.filter((l) => progs.includes(l.programme)));
    md.push(t.total ? row(`${a.code} ${en(a.name)}`, t) : `| ${a.code} ${en(a.name)} | NO PROGRAMME | 0 | — | — | — | — | — |`);
  }
  md.push('', '## Programmes', '', head, ...[...programmes.values()].map((p) => row(`${p.code} ${en(p.name)}`, tally(lectures.filter((l) => l.programme === p.code)))), '');
  md.push('## Semesters', '', head);
  for (const p of programmes.values()) for (const s of p.semesters) md.push(row(`${p.code} S${s.number} ${en(s.title)}`, tally(lectures.filter((l) => l.programme === p.code && l.semester === s.number))));
  md.push('', '## Courses (lecture materials)', '', head);
  for (const { programme, semester, course } of allCourses) md.push(row(`${programme} S${semester} ${course.code} ${en(course.title)}`, tally(lectures.filter((l) => l.course === course.code))));
  md.push('', '## Modules', '', '| Module | Status | Lectures | Complete | Needs verification | Partial | Structure only |', '|---|---|---|---|---|---|---|');
  for (const r of moduleRows) md.push(`| ${r[2]} M${r[3]} ${r[4]} | ${r[5]} | ${r[6]} | ${r[7]} | ${r[8]} | ${r[9]} | ${r[10]} |`);
  md.push('', '## Module-level content', '',
    `Module-content feature: **present in the app** (0.6.0: Module Learning Page, editor, \`Module.sections\`, module and course PDF/Markdown). Module materials delivered by content packages: ${moduleContentSupported ? 'yes' : '**none yet** (writing them is phase M-2)'}. Module materials typed into a device with the editor live only in that device and are not audited here.`, '',
    '| Module content status | Modules |', '|---|---|',
    ...STATUSES.map((st) => `| ${st} | ${moduleContent.filter((r) => r[6] === st).length} |`), '',
    'Per module (Faculty, Academy, Programme, Course, Module ID, title, module content status, lecture content status, missing sections): `module-content.csv`.');
  md.push('', '## Written lectures in detail', '', '| Lecture | Status | Sections | Code units (executed / error matched / compiled only / unverified) | Words (ms+en) |', '|---|---|---|---|---|');
  for (const l of lectures.filter((x) => x.status !== 'STRUCTURE ONLY'))
    md.push(`| ${l.course} ${l.module}.${l.lecture} ${l.title} | ${l.status} | ${l.sections}/24 | ${l.executed} / ${l.errorMatched} / ${l.compiledOnly} / ${l.unverified} | ${l.words} |`);
  md.push('', '## Integrity findings', '',
    `- Content entries without a matching lecture record (orphans): ${orphanContent.length ? orphanContent.join(', ') : 'none'}`,
    `- Lecture content defined twice: ${contentDuplicates.length ? contentDuplicates.join(', ') : 'none'}`,
    `- Duplicate course codes: ${duplicateCourseCodes.length ? duplicateCourseCodes.join(', ') : 'none'}`,
    `- Repeated lecture titles inside one course: ${dupTitlesInCourse.length ? dupTitlesInCourse.join('; ') : 'none'}`,
    `- Prerequisites pointing to a missing course: ${prereqProblems.length ? prereqProblems.join(', ') : 'none'}`,
    `- Glossary keys defined twice: ${glossaryDupes.length ? glossaryDupes.join(', ') : 'none'}`,
    `- Glossary references (related terms, lectures): ${glossaryProblems.length ? glossaryProblems.join('; ') : 'all resolve to existing terms; every lecture link of a term taught in written lectures points to a written lecture'}`,
    `- Glossary references to planned lectures (term not taught in any written lecture yet; shown as "not written yet", never as a link): ${glossaryPlanned.length ? glossaryPlanned.join(', ') : 'none'}`,
    `- Problems inside written lectures (validator, glossary links): ${lectureProblems.length ? lectureProblems.join('; ') : 'none'}`,
    `- Verification records without a written lecture: ${unitsWithoutLecture.length ? unitsWithoutLecture.join(', ') : 'none'}`,
    `- Code units without a verification record: ${lectures.reduce((n, l) => n + l.unverified, 0)}`,
    '');
  writeFileSync(`${OUT}/SUMMARY.md`, md.join('\n'));
  console.log(`audited ${lectures.length} lectures: ${STATUSES.map((s) => `${s} ${all[s]}`).join(', ')}`);
});
