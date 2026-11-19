/** Module-level learning materials: text format, validation, duplication detection, status, saving and safety. */
import { beforeAll, describe, expect, it } from 'vitest';
import { LUA_LUAU_CONTENT } from '@/content';
import { exportBackup, restoreBackup, validateBackup } from '@/db/backup/backup';
import { installContentPackage } from '@/db/content/install';
import {
  findDuplication,
  lectureCorpus,
  moduleContentStatus,
  parseModuleBody,
  validateModuleContent,
  type ModuleProblem,
} from '@/db/content/module';
import type { QhazeDatabase } from '@/db/database';
import { checkDatabaseIntegrity } from '@/db/integrity';
import { completeLecture, saveLectureNote, toggleBookmark } from '@/db/repositories/learning';
import { saveModuleContent } from '@/db/repositories/modules';
import { createStudent } from '@/db/repositories/student';
import { ValidationError } from '@/db/repositories/university';
import { installPackage } from '@/db/seed/install';
import { CURRICULUM_PACKAGES } from '@/db/seed/packages';
import { MODULE_SECTIONS, type ModuleSection, type ModuleSectionKind } from '@/db/types';
import { loadCourseBundle, loadGlossary } from '@/features/learning/data';
import { courseMarkdown, moduleMarkdown, type ExportLabels } from '@/features/learning/markdown';
import { freshDb } from '@/test/helpers';

/** Test content only: neutral sentences that meet every rule (never shipped as course material). */
const sentences = (prefix: string, n: number) =>
  Array.from({ length: n }, (_, i) => `${prefix} sentence ${i + 1} describes a general idea for this test module.`).join(' ');
const list = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `- ${prefix} point ${i + 1} for the test module`).join('\n');
const BODY: Record<ModuleSectionKind, string> = {
  module_overview: sentences('Overview', 8),
  learning_objectives: list('Objective', 3),
  prerequisites: sentences('Prerequisite', 2),
  core_theory: sentences('Theory', 18),
  learning_notes: sentences('Note', 12),
  key_concepts: list('Concept', 3),
  terminology: '- [[variable]]: a named value in the test.\n- [[scope]]: where a name is visible in the test.\n- [[table]]: the test data structure.',
  examples: `${sentences('Example', 4)}\n\n\`\`\`lua\nlocal testValue = 41 + 1\nprint("module test", testValue)\n\`\`\``,
  applications: sentences('Application', 5),
  module_summary: sentences('Summary', 5),
  references: '- [Lua manual](https://www.lua.org/manual/5.4/)\n- [Programming in Lua](https://www.lua.org/pil/)\n- [Lua users wiki](https://lua-users.org/wiki/)',
};
const full = (patch: Partial<Record<ModuleSectionKind, string>> = {}): ModuleSection[] =>
  MODULE_SECTIONS.map((kind) => {
    const text = patch[kind] ?? BODY[kind];
    return { kind, body: { ms: text, en: text } };
  });
const codes = (p: ModuleProblem[]) => p.map((x) => `${x.code}:${x.section}${x.lang ? `:${x.lang}` : ''}`);
const keys = new Set(['variable', 'scope', 'table']);

describe('module text format', () => {
  it('reads paragraphs, both list styles, continuation lines and fenced code', () => {
    const blocks = parseModuleBody('First line\nsame paragraph.\n\n- one\n- two\n  continued\n\n1. first\n2) second\n\n```lua\nprint(1)\n\nprint(2)\n```\nAfter.');
    expect(blocks).toEqual([
      { type: 'paragraph', text: 'First line same paragraph.' },
      { type: 'list', ordered: false, items: ['one', 'two continued'] },
      { type: 'list', ordered: true, items: ['first', 'second'] },
      { type: 'code', language: 'lua', code: 'print(1)\n\nprint(2)' },
      { type: 'paragraph', text: 'After.' },
    ]);
  });
});

describe('module validation (discipline-aware)', () => {
  it('an empty module reports every one of the 11 sections as missing and is not written', () => {
    const problems = validateModuleContent([], { discipline: 'programming' });
    expect(problems.map((p) => p.section)).toEqual([...MODULE_SECTIONS]);
    expect(moduleContentStatus([], problems)).toBe('not_written');
  });

  it('a full programming module passes; its unverified code makes it NEEDS VERIFICATION, never COMPLETE', () => {
    const sections = full();
    const problems = validateModuleContent(sections, { discipline: 'programming', glossaryKeys: keys });
    expect(problems).toEqual([]);
    expect(moduleContentStatus(sections, problems)).toBe('needs_verification');
  });

  it('adapts examples to the discipline: programming needs code, mathematics a worked example', () => {
    const noCode = full({ examples: sentences('Worked example', 4) });
    expect(codes(validateModuleContent(noCode, { discipline: 'programming', glossaryKeys: keys }))).toEqual(['needs_code_example:examples:ms', 'needs_code_example:examples:en']);
    const maths = validateModuleContent(noCode, { discipline: 'mathematics', glossaryKeys: keys });
    expect(maths).toEqual([]);
    expect(moduleContentStatus(noCode, maths)).toBe('complete');
  });

  it('reports thin sections, missing languages, few items, few or insecure references and unknown glossary terms', () => {
    const sections = full({ core_theory: 'Too short.', key_concepts: '- only one', references: '- [one](https://a.example/)\n- [two](http://b.example/)' });
    sections.find((s) => s.kind === 'module_summary')!.body = { ms: BODY.module_summary };
    sections.find((s) => s.kind === 'terminology')!.body.en = '- [[nonexistent-term]] x\n- y\n- z';
    const problems = codes(validateModuleContent(sections, { discipline: 'programming', glossaryKeys: keys }));
    expect(problems).toEqual(expect.arrayContaining([
      'too_short:core_theory:ms', 'too_few_items:key_concepts:en', 'insecure_link:references:ms', 'too_few_references:references:en',
      'missing_language:module_summary:en', 'unknown_term:terminology:en',
    ]));
    expect(moduleContentStatus(sections, validateModuleContent(sections, { discipline: 'programming' }))).toBe('partial');
  });
});

describe('module content must not copy its lectures', () => {
  const lua101 = LUA_LUAU_CONTENT.lectures.filter((l) => l.courseCode === 'LUA101').map((l) => ({ order: l.lecture, module: l.module, sections: l.sections }));
  const corpus = lectureCorpus(lua101);
  const lecture11 = LUA_LUAU_CONTENT.lectures.find((l) => l.courseCode === 'LUA101' && l.module === 1 && l.lecture === 1)!;
  const theory = lecture11.sections.find((s) => s.kind === 'detailed_theory')!.blocks.find((b) => b.type === 'paragraph')!;
  const code = lecture11.sections.flatMap((s) => s.blocks).find((b) => b.type === 'code' && b.code.split('\n').filter(Boolean).length >= 3)!;

  it('flags a lecture paragraph pasted into the module, naming the lecture', () => {
    if (theory.type !== 'paragraph') throw new Error('fixture');
    const problems = findDuplication(full({ core_theory: `${BODY.core_theory}\n\n${theory.text.en}` }), corpus);
    expect(problems).toContainEqual({ code: 'copied_text', section: 'core_theory', lang: 'ms', detail: '1.1' });
  });

  it('flags a lecture code example reused as a module example', () => {
    if (code.type !== 'code') throw new Error('fixture');
    const problems = findDuplication(full({ examples: `${BODY.examples}\n\n\`\`\`lua\n${code.code}\n\`\`\`` }), corpus);
    expect(problems.map((p) => `${p.code}:${p.detail}`)).toContain('copied_code:1.1');
  });

  it('accepts original module text that merely mentions the same concepts', () => {
    const own = full({ core_theory: `${BODY.core_theory} Lua is an embeddable language, and this module connects its lectures on history, design and versions.` });
    expect(findDuplication(own, corpus)).toEqual([]);
  });
});

describe('saving module content', () => {
  let db: QhazeDatabase;
  let studentId: string;
  beforeAll(async () => {
    db = await freshDb();
    studentId = (await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' })).id;
    for (const pkg of CURRICULUM_PACKAGES) await installPackage(db, pkg);
    await installContentPackage(db, LUA_LUAU_CONTENT);
  }, 120_000);

  const moduleOf = async (code: string, order: number) => {
    const course = (await db.courses.where('code').equals(code).first())!;
    return (await db.modules.where('[courseId+order]').equals([course.id, order]).first())!;
  };

  it('writes only the module materials; title, description, other modules, lectures and student data are untouched', async () => {
    const target = await moduleOf('LUA101', 1);
    const lecture = (await db.lectures.where('moduleId').equals(target.id).first())!;
    await completeLecture(db, studentId, lecture.id);
    await saveLectureNote(db, studentId, lecture.id, 'Nota', 'Kekal.');
    await toggleBookmark(db, studentId, 'lecture', lecture.id);
    const before = {
      modules: (await db.modules.toArray()).filter((m) => m.id !== target.id),
      lectures: await db.lectures.toArray(),
      progress: await db.progress.toArray(),
      notes: await db.notes.toArray(),
      bookmarks: await db.bookmarks.toArray(),
      students: await db.students.toArray(),
    };

    const saved = await saveModuleContent(db, target.id, [
      { kind: 'references', body: { ms: '  - [a](https://a.example/)  ', en: '' } },
      { kind: 'module_overview', body: { ms: 'Gambaran ujian.', en: 'Test overview.' } },
      { kind: 'core_theory', body: { ms: '   ', en: '' } }, // empty → not stored
    ]);
    expect(saved.sections).toEqual([
      { kind: 'module_overview', body: { ms: 'Gambaran ujian.', en: 'Test overview.' } },
      { kind: 'references', body: { ms: '- [a](https://a.example/)' } },
    ]);
    const reloaded = (await db.modules.get(target.id))!;
    expect(reloaded.title).toEqual(target.title);
    expect(reloaded.description).toEqual(target.description);
    expect(reloaded.order).toBe(target.order);
    expect(reloaded.createdAt).toBe(target.createdAt);
    expect(reloaded.sections).toEqual(saved.sections);
    expect(reloaded.contentUpdatedAt).toBeTruthy();

    expect({
      modules: (await db.modules.toArray()).filter((m) => m.id !== target.id),
      lectures: await db.lectures.toArray(),
      progress: await db.progress.toArray(),
      notes: await db.notes.toArray(),
      bookmarks: await db.bookmarks.toArray(),
      students: await db.students.toArray(),
    }).toEqual(before);
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);
  });

  it('editing replaces the module materials; saving nothing clears them', async () => {
    const target = await moduleOf('LUA101', 2);
    await saveModuleContent(db, target.id, full());
    expect((await db.modules.get(target.id))!.sections).toHaveLength(11);
    await saveModuleContent(db, target.id, full({ module_overview: 'Edited overview.' }).slice(0, 1));
    expect((await db.modules.get(target.id))!.sections).toEqual([{ kind: 'module_overview', body: { ms: 'Edited overview.', en: 'Edited overview.' } }]);
    await saveModuleContent(db, target.id, []);
    expect((await db.modules.get(target.id))!.sections).toEqual([]);
  });

  it('rejects unknown or repeated sections, oversized text and unknown modules', async () => {
    const target = await moduleOf('LUA101', 3);
    await expect(saveModuleContent(db, target.id, [{ kind: 'nope' as ModuleSectionKind, body: { ms: 'x' } }])).rejects.toBeInstanceOf(ValidationError);
    await expect(saveModuleContent(db, target.id, [{ kind: 'prerequisites', body: { ms: 'a' } }, { kind: 'prerequisites', body: { ms: 'b' } }])).rejects.toBeInstanceOf(ValidationError);
    await expect(saveModuleContent(db, target.id, [{ kind: 'prerequisites', body: { ms: 'x'.repeat(40_001) } }])).rejects.toBeInstanceOf(ValidationError);
    await expect(saveModuleContent(db, 'missing-id', [])).rejects.toBeInstanceOf(ValidationError);
    expect((await db.modules.get(target.id))!.sections).toBeUndefined();
  });

  it('installing a course-materials update rewrites lectures but never touches module materials', async () => {
    const target = await moduleOf('LUAU101', 1);
    await saveModuleContent(db, target.id, full());
    const before = (await db.modules.get(target.id))!;
    const plan = await installContentPackage(db, { ...LUA_LUAU_CONTENT, version: '9.9.9-test' });
    expect(plan.written).toBeGreaterThan(0);
    expect(await db.modules.get(target.id)).toEqual(before);
  }, 120_000);

  it('module materials survive a backup and a full restore; no module or lecture is duplicated', async () => {
    const target = await moduleOf('LUA101', 4);
    await saveModuleContent(db, target.id, full());
    const counts = { modules: await db.modules.count(), lectures: await db.lectures.count() };
    const { content } = await exportBackup(db);
    await saveModuleContent(db, target.id, []);
    const validated = await validateBackup(content);
    expect(validated.backup).toBeTruthy();
    await restoreBackup(db, validated.backup!, 'replace');
    expect((await db.modules.get(target.id))!.sections).toEqual(full());
    expect({ modules: await db.modules.count(), lectures: await db.lectures.count() }).toEqual(counts);
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);
  }, 60_000);
});

describe('module content in Markdown exports', () => {
  const labels = {
    section: (k: string) => `S:${k}`, difficulty: (d: string) => d, runtime: (r: string) => r, expectedOutput: 'EO', lines: 'L', notApplicable: 'NA',
    noContent: 'NO CONTENT', minutes: (n: number) => `${n} min`, credits: (n: number) => `${n} cr`, contents: 'Contents', generated: 'Generated',
    externalLink: '(x)', notes: 'Notes', status: () => 'STATUS', input: 'I', debugTitle: 'D', brokenCode: 'B', errorMessage: 'E', fix: 'F',
    moduleContent: 'MODULE CONTENT', moduleSection: (k: string) => `MS:${k}`, moduleNotWritten: 'MODULE NOT WRITTEN', moduleUnverifiedCode: 'UNVERIFIED CODE',
  } as ExportLabels;
  let db: QhazeDatabase;
  beforeAll(async () => {
    db = await freshDb();
    for (const pkg of CURRICULUM_PACKAGES) await installPackage(db, pkg);
    await installContentPackage(db, LUA_LUAU_CONTENT);
  }, 120_000);

  it('module and course documents put the module materials after the module heading and before its lectures', async () => {
    const course = (await db.courses.where('code').equals('LUA101').first())!;
    const m1 = (await db.modules.where('[courseId+order]').equals([course.id, 1]).first())!;
    await saveModuleContent(db, m1.id, full());
    const bundle = (await loadCourseBundle(db, course.id))!;
    const glossary = await loadGlossary(db);
    const meta = { app: 'x', date: '2026-11-19' };

    const moduleDoc = courseMarkdown(bundle, 'en', glossary, labels, meta, m1.id);
    const at = (needle: string) => moduleDoc.indexOf(needle);
    expect(at('### MODULE CONTENT')).toBeGreaterThan(at('## 1. '));
    expect(at('#### 1. MS:module_overview')).toBeGreaterThan(at('### MODULE CONTENT'));
    expect(at('#### 11. MS:references')).toBeLessThan(at('### 1.1 '));
    expect(moduleDoc).toContain('- **Variable**: a named value in the test.'); // glossary link resolved
    expect(moduleDoc).toContain('_UNVERIFIED CODE_\n\n```lua\nlocal testValue = 41 + 1');
    expect(moduleDoc.slice(at('### MODULE CONTENT'), at('### 1.1 '))).not.toMatch(/\[\[/); // the module part (lectures may show Lua [[long strings]] in code)
    expect(moduleDoc).not.toMatch(/^## 2\. /m); // only this module (its own sections are #### headings)

    const courseDoc = courseMarkdown(bundle, 'ms', glossary, labels, meta);
    expect(courseDoc.split('### MODULE CONTENT').length - 1).toBe(4); // every module has a module-content part
    expect(courseDoc.split('_MODULE NOT WRITTEN_').length - 1).toBe(3); // modules 2–4 say so explicitly
    expect(moduleMarkdown(bundle.modules[1]!.module, 'ms', glossary, labels)).toBe('### MODULE CONTENT\n\n_MODULE NOT WRITTEN_');
  });
});

