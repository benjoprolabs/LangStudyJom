/**
 * Module materials delivered by course-materials packages (PY-0): strict validation, installation that never
 * overwrites locally written module content, verification units, status and export. Fixtures are TEST content.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { LUA_LUAU_CONTENT } from '@/content';
import { contentToWrite, installContentPackage, planContentInstall } from '@/db/content/install';
import { moduleCodeUnits, moduleContentStatus, parseModuleBody, validateModuleContent } from '@/db/content/module';
import type { ContentPackage, ModuleContentDef } from '@/db/content/types';
import { collectCodeExamples, validateContentPackage } from '@/db/content/validate';
import type { QhazeDatabase } from '@/db/database';
import { completeLecture, saveLectureNote, toggleBookmark } from '@/db/repositories/learning';
import { saveModuleContent } from '@/db/repositories/modules';
import { createStudent } from '@/db/repositories/student';
import { installPackage } from '@/db/seed/install';
import { CURRICULUM_PACKAGES } from '@/db/seed/packages';
import { MODULE_SECTIONS, type ModuleSection, type ModuleSectionKind } from '@/db/types';
import { loadCourseBundle, loadGlossary } from '@/features/learning/data';
import { courseMarkdown, type ExportLabels } from '@/features/learning/markdown';
import { freshDb } from '@/test/helpers';

const sentences = (p: string, n: number) => Array.from({ length: n }, (_, i) => `${p} sentence ${i + 1} explains a general idea for this packaged test module.`).join(' ');
const list = (p: string, n: number) => Array.from({ length: n }, (_, i) => `- ${p} point ${i + 1} for the packaged test module`).join('\n');
/** Strict-valid TEST module text for a pathway (`lua` or `python`). */
function body(language: 'lua' | 'python', patch: Partial<Record<ModuleSectionKind, string>> = {}): ModuleSection[] {
  const code = language === 'lua' ? 'local packagedTest = 5 * 9\nprint("packaged", packagedTest)' : 'packaged_test = 5 * 9\nprint("packaged", packaged_test)';
  const text: Record<ModuleSectionKind, string> = {
    module_overview: sentences('Overview', 8),
    learning_objectives: list('Objective', 3),
    prerequisites: sentences('Prerequisite', 2),
    core_theory: sentences('Theory', 18),
    learning_notes: sentences('Note', 12),
    key_concepts: list('Concept', 3),
    terminology: '- [[variable]]: a named value in the test.\n- [[scope]]: where a name is visible.\n- [[algorithm]]: steps in the test.',
    examples: `${sentences('Example', 4)}\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n\`\`\`output\npackaged 45\n\`\`\``,
    applications: sentences('Application', 5),
    module_summary: sentences('Summary', 5),
    references: '- [Reference one](https://www.lua.org/manual/5.4/)\n- [Reference two](https://docs.python.org/3.13/)\n- [Reference three](https://www.lua.org/pil/)',
    ...patch,
  };
  return MODULE_SECTIONS.map((kind) => ({ kind, body: { ms: text[kind], en: text[kind] } }));
}
const withModules = (modules: ModuleContentDef[], version = '9.9.9-test'): ContentPackage => ({ ...LUA_LUAU_CONTENT, version, modules });
const problemsOf = (pkg: ContentPackage) => validateContentPackage(pkg).filter((e) => / M\d+: /.test(e));

describe('package format and validation', () => {
  it('packages without modules (every package before PY-0) remain valid and unchanged', () => {
    expect(LUA_LUAU_CONTENT.modules).toBeUndefined();
    expect(validateContentPackage(LUA_LUAU_CONTENT)).toEqual([]);
  });

  it('accepts strict-valid module materials for Lua and Python courses', () => {
    expect(problemsOf(withModules([{ courseCode: 'LUA101', module: 1, sections: body('lua') }, { courseCode: 'PY101', module: 1, sections: body('python') }]))).toEqual([]);
  });

  it('rejects the wrong code language, missing expected output, different code per language and wrong-pathway glossary terms', () => {
    expect(problemsOf(withModules([{ courseCode: 'LUA101', module: 1, sections: body('python') }])).join()).toContain('code_language in examples (ms): python');
    expect(problemsOf(withModules([{ courseCode: 'PY101', module: 1, sections: body('python', { examples: `${sentences('Example', 4)}\n\n\`\`\`python\nprint(1)\n\`\`\`` }) }])).join()).toContain('missing_output in examples');
    const differs = body('python');
    differs.find((s) => s.kind === 'examples')!.body.en = body('python', { examples: `${sentences('Example', 4)}\n\n\`\`\`python\nprint(2)\n\`\`\`\n\n\`\`\`output\n2\n\`\`\`` }).find((s) => s.kind === 'examples')!.body.en;
    expect(problemsOf(withModules([{ courseCode: 'PY101', module: 1, sections: differs }])).join()).toContain('code_differs in examples');
    const luaTerm = body('python', { terminology: '- [[chunk]]: a Lua term.\n- [[scope]]: x.\n- [[variable]]: y.' });
    expect(problemsOf(withModules([{ courseCode: 'PY101', module: 1, sections: luaTerm }])).join()).toContain('term_scope in terminology (ms): chunk');
  });

  it('rejects module text copied from that course\'s lectures, duplicates and bad addresses', () => {
    const lecture = LUA_LUAU_CONTENT.lectures.find((l) => l.courseCode === 'LUA101' && l.module === 1 && l.lecture === 2)!;
    const paragraph = lecture.sections.find((s) => s.kind === 'detailed_theory')!.blocks.find((b) => b.type === 'paragraph')!;
    if (paragraph.type !== 'paragraph') throw new Error('fixture');
    const copied = body('lua', { core_theory: `${sentences('Theory', 18)}\n\n${paragraph.text.en}` });
    expect(problemsOf(withModules([{ courseCode: 'LUA101', module: 1, sections: copied }])).join()).toContain('copied_text in core_theory');
    const twice = problemsOf(withModules([{ courseCode: 'LUA101', module: 1, sections: body('lua') }, { courseCode: 'LUA101', module: 1, sections: body('lua') }]));
    expect(twice.join()).toContain('LUA101 M1: listed twice');
    expect(problemsOf(withModules([{ courseCode: 'lua101', module: 0, sections: body('lua') }])).join()).toContain('invalid module address');
  });

  it('module code becomes verification units (with the Python runtime for Python courses)', () => {
    const pkg = withModules([{ courseCode: 'PY101', module: 2, sections: body('python') }]);
    const units = collectCodeExamples(pkg).filter((u) => u.where === 'PY101 M2');
    expect(units).toEqual([{ key: 'PY101 M2#examples-1', where: 'PY101 M2', id: 'examples-1', language: 'python', runtime: 'python', code: 'packaged_test = 5 * 9\nprint("packaged", packaged_test)', expectedOutput: 'packaged 45' }]);
  });

  it('a module with code is COMPLETE only when every code block is verified by execution', () => {
    const sections = body('python');
    const problems = validateModuleContent(sections, { discipline: 'programming' });
    const units = moduleCodeUnits('PY101', 1, sections);
    expect(moduleContentStatus(sections, problems)).toBe('needs_verification');
    expect(moduleContentStatus(sections, problems, { units, isVerified: () => false })).toBe('needs_verification');
    expect(moduleContentStatus(sections, problems, { units, isVerified: () => true })).toBe('complete');
    expect(parseModuleBody('```python\nprint(1)\n```\n\n```output\n1\n```')).toEqual([{ type: 'code', language: 'python', code: 'print(1)', expectedOutput: '1' }]);
  });
});

describe('installing module materials from a package', () => {
  let db: QhazeDatabase;
  let studentId: string;
  const moduleAt = async (code: string, order: number) => {
    const course = (await db.courses.where('code').equals(code).first())!;
    return (await db.modules.where('[courseId+order]').equals([course.id, order]).first())!;
  };
  beforeAll(async () => {
    db = await freshDb();
    studentId = (await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' })).id;
    for (const pkg of CURRICULUM_PACKAGES) await installPackage(db, pkg);
    await installContentPackage(db, LUA_LUAU_CONTENT);
  }, 120_000);

  it('writes only module materials (source "package", version), leaving lectures and student data untouched', async () => {
    const lecture = (await db.lectures.where('moduleId').equals((await moduleAt('LUA101', 1)).id).first())!;
    await completeLecture(db, studentId, lecture.id);
    await saveLectureNote(db, studentId, lecture.id, 'Nota', 'Kekal.');
    await toggleBookmark(db, studentId, 'lecture', lecture.id);
    const snapshot = async () => ({
      lectures: await db.lectures.toArray(), progress: await db.progress.toArray(), notes: await db.notes.toArray(),
      bookmarks: await db.bookmarks.toArray(), students: await db.students.toArray(), modules: await db.modules.count(),
    });
    const before = await snapshot();
    const v1 = withModules([{ courseCode: 'LUA101', module: 1, sections: body('lua') }, { courseCode: 'PY101', module: 1, sections: body('python') }], '9.0.0-test');
    const plan = await planContentInstall(db, v1);
    expect([plan.modulesToWrite, plan.modulesUpToDate, plan.modulesKeptLocal, plan.missing]).toEqual([2, 0, 0, []]);
    await installContentPackage(db, v1);

    const lua = await moduleAt('LUA101', 1);
    expect([lua.contentSource, lua.contentVersion, lua.sections]).toEqual(['package', '9.0.0-test', body('lua')]);
    expect((await moduleAt('PY101', 1)).sections).toEqual(body('python'));
    const after = await snapshot();
    expect({ ...after, lectures: after.lectures.map((l) => ({ ...l, contentVersion: undefined, updatedAt: undefined })) })
      .toEqual({ ...before, lectures: before.lectures.map((l) => ({ ...l, contentVersion: undefined, updatedAt: undefined })) });
    expect(after.lectures.map((l) => JSON.stringify(l.sections))).toEqual(before.lectures.map((l) => JSON.stringify(l.sections)));

    const again = await planContentInstall(db, v1);
    expect([again.modulesToWrite, again.modulesUpToDate, contentToWrite(again)]).toEqual([0, 2, 0]);
  }, 120_000);

  it('never overwrites module materials written on this device', async () => {
    const target = await moduleAt('LUA101', 2);
    await saveModuleContent(db, target.id, [{ kind: 'module_overview', body: { ms: 'Ditulis oleh pelajar.', en: 'Written by the student.' } }]);
    const v2 = withModules([{ courseCode: 'LUA101', module: 2, sections: body('lua') }], '9.1.0-test');
    const plan = await planContentInstall(db, v2);
    expect([plan.modulesToWrite, plan.modulesKeptLocal]).toEqual([0, 1]);
    await installContentPackage(db, v2);
    const kept = await db.modules.get(target.id);
    expect(kept!.contentSource).toBe('local');
    expect(kept!.sections).toEqual([{ kind: 'module_overview', body: { ms: 'Ditulis oleh pelajar.', en: 'Written by the student.' } }]);
  }, 120_000);

  it('a module that does not exist yet blocks the install (structure first), like a missing lecture', async () => {
    const plan = await planContentInstall(db, withModules([{ courseCode: 'LUA101', module: 9, sections: body('lua') }]));
    expect(plan.missing).toEqual(['LUA101 M9']);
    await expect(installContentPackage(db, withModules([{ courseCode: 'LUA101', module: 9, sections: body('lua') }]))).rejects.toThrow('module LUA101 M9 not found');
  });

  it('packaged module materials appear in the module and course Markdown with their expected output', async () => {
    const course = (await db.courses.where('code').equals('PY101').first())!;
    const bundle = (await loadCourseBundle(db, course.id))!;
    const labels = {
      section: (k: string) => k, difficulty: (d: string) => d, runtime: (r: string) => r, expectedOutput: 'EXPECTED', lines: 'L', notApplicable: 'NA', noContent: 'NO CONTENT',
      minutes: (n: number) => `${n}`, credits: (n: number) => `${n}`, contents: 'C', generated: 'G', externalLink: '(x)', notes: 'N',
      status: (r: string, s: string | null) => `STATUS:${r}:${s}`, input: 'I', debugTitle: 'D', brokenCode: 'B', errorMessage: 'E', fix: 'F',
      moduleContent: 'MODULE CONTENT', moduleSection: (k: string) => k, moduleNotWritten: 'NOT WRITTEN', moduleUnverifiedCode: 'UNVERIFIED',
    } as ExportLabels;
    const md = courseMarkdown(bundle, 'en', await loadGlossary(db), labels, { app: 'x', date: 'x' }, bundle.modules[0]!.module.id);
    expect(md).toContain('### MODULE CONTENT');
    expect(md).toContain('```python\npacked_test'.replace('packed', 'packaged'));
    expect(md).toContain('EXPECTED:\n\n```\npackaged 45\n```');
    expect(md).toContain('_UNVERIFIED_'); // test units are not in the verification manifest
  });
});
