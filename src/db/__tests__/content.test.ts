/** Professional Programming Education Standard — course materials, glossary and their QA rules. */
import { describe, expect, it } from 'vitest';
import { CONTENT_PACKAGES, LUA_LUAU_CONTENT } from '@/content';
import { GLOSSARY } from '@/content/glossary';
import { VERIFICATION, verificationOf } from '@/content/verification';
import { LUA102_1_1 } from '@/content/lectures/lua102-1-1';
import { ContentInstallError, installContentPackage, planContentInstall } from '@/db/content/install';
import { flattenInline, inlineToPlain, parseInline } from '@/db/content/inline';
import type { ContentBlock } from '@/db/types';
import type { ContentPackage } from '@/db/content/types';
import { collectCodeExamples, validateContentPackage } from '@/db/content/validate';
import { checkDatabaseIntegrity, dumpTables } from '@/db/integrity';
import { createStudent } from '@/db/repositories/student';
import { installPackage } from '@/db/seed/install';
import { LUA_LUAU_M2, UNIVERSITY_CORE_M1 } from '@/db/seed/packages';
import { AUTHORED_SECTIONS, LECTURE_TEMPLATE } from '@/db/types';
import { freshDb } from '@/test/helpers';

const clone = (): ContentPackage => structuredClone(LUA_LUAU_CONTENT);
const lectureOf = (pkg: ContentPackage, code: string) => pkg.lectures.find((l) => l.courseCode === code)!;
const allCourses = [...UNIVERSITY_CORE_M1.programmes, ...LUA_LUAU_M2.programmes].flatMap((p) => p.semesters.flatMap((s) => s.courses));

describe('lecture template (Part A)', () => {
  it('has the 28 sections of the standard, the first four generated from metadata', () => {
    expect(LECTURE_TEMPLATE).toHaveLength(28);
    expect(LECTURE_TEMPLATE.slice(0, 4)).toEqual(['lecture_information', 'course_information', 'academic_level', 'estimated_duration']);
    expect(AUTHORED_SECTIONS).toHaveLength(24);
    expect(LECTURE_TEMPLATE.at(-1)).toBe('references');
  });
});

describe('content package', () => {
  it('passes every quality rule', () => {
    for (const pkg of CONTENT_PACKAGES) expect(validateContentPackage(pkg)).toEqual([]);
  });

  it('every example and debug variant has a current execution record (npm run verify:code)', () => {
    const units = CONTENT_PACKAGES.flatMap((p) => collectCodeExamples(p));
    const stale = units.filter((u) => !verificationOf(u.key, u)).map((u) => u.key);
    expect(stale, 'run `npm run verify:code` after editing course materials').toEqual([]);
    for (const u of units) {
      const status = verificationOf(u.key, u);
      if (u.runtime === 'roblox') expect(['compiled', 'error-matched'], u.key).toContain(status);
      else expect(status, u.key).toBe(u.expectedError !== undefined ? 'error-matched' : 'executed');
    }
    expect(VERIFICATION.tools.lua54).toMatch(/^Lua 5\.4\.\d+/);
    expect(VERIFICATION.tools.luau).toMatch(/^Luau 0\.\d+/);
  });

  it('pilot lectures address real lectures of the installed curriculum', () => {
    for (const l of LUA_LUAU_CONTENT.lectures) {
      const course = allCourses.find((c) => c.code === l.courseCode);
      expect(course?.modules[l.module - 1]?.lectures[l.lecture - 1], `${l.courseCode} ${l.module}.${l.lecture}`).toBeDefined();
    }
    expect(allCourses.find((c) => c.code === 'LUA102')!.modules[0]!.lectures[0]!.title.en).toBe('Global and local variables');
  });

  it('glossary: the 16 requested concepts, each with related lectures that exist and https references', () => {
    expect(GLOSSARY.map((g) => g.term).sort()).toEqual(
      ['Closure', 'Connection', 'Coroutine', 'DataStore', 'Event', 'Function', 'Instance', 'Iterator', 'Metatable', 'Module', 'RemoteEvent', 'Replication', 'Scope', 'Table', 'Type Annotation', 'Variable'].sort(),
    );
    for (const g of GLOSSARY) {
      expect(g.translation, g.key).toBeTruthy();
      for (const ref of g.lectures) {
        expect(allCourses.find((c) => c.code === ref.courseCode)?.modules[ref.module - 1]?.lectures[ref.lecture - 1], `${g.key} → ${ref.courseCode}`).toBeDefined();
      }
      expect(g.references.every((r) => r.url.startsWith('https://'))).toBe(true);
    }
  });

  it('keeps Lua and Roblox concepts apart: Roblox terms only have Roblox examples', () => {
    for (const g of GLOSSARY.filter((x) => x.scope === 'roblox')) expect(g.example?.runtime, g.key).toBe('roblox');
    for (const g of GLOSSARY.filter((x) => x.scope !== 'roblox')) expect(g.example?.runtime, g.key).not.toBe('roblox');
  });

  it('inline syntax: bold, code, glossary links and external links', () => {
    expect(parseInline('Use **local** and `print`, see [[scope|skop]] and [docs](https://www.lua.org/)').map((t) => t.kind)).toEqual([
      'text', 'bold', 'text', 'code', 'text', 'term', 'text', 'link',
    ]);
  });

  it('glossary lecture links point to written lectures, unless no written lecture teaches the term yet', () => {
    const written = CONTENT_PACKAGES.flatMap((p) => p.lectures);
    const writtenKeys = new Set(written.map((l) => `${l.courseCode} ${l.module}.${l.lecture}`));
    const texts = (b: ContentBlock): string[] =>
      (b.type === 'paragraph' ? [b.text.ms, b.text.en]
      : b.type === 'list' ? b.items.flatMap((i) => [i.ms, i.en])
      : b.type === 'callout' ? [b.text.ms, b.text.en]
      : b.type === 'explain' ? b.items.flatMap((i) => [i.text.ms, i.text.en])
      : []).map((t) => t ?? '');
    const taughtIn = (key: string) =>
      written.filter((l) => {
        const blocks = l.sections.flatMap((s) => s.blocks);
        return blocks.some((b) => b.type === 'terms' && b.keys.includes(key)) ||
          blocks.flatMap(texts).some((t) => flattenInline(parseInline(t)).some((k) => k.kind === 'term' && k.key === key));
      });
    const stale: string[] = [];
    for (const g of GLOSSARY) {
      const unwritten = g.lectures.filter((r) => !writtenKeys.has(`${r.courseCode} ${r.module}.${r.lecture}`));
      if (unwritten.length && taughtIn(g.key).length) stale.push(`${g.key} → ${unwritten.map((r) => `${r.courseCode} ${r.module}.${r.lecture}`).join(', ')}`);
    }
    expect(stale).toEqual([]);
  });

  it('inline syntax: glossary links, code and links inside bold text are parsed, not shown raw', () => {
    const [bold] = parseInline('**[[chunk|Chunk]]:** and');
    expect(bold).toMatchObject({ kind: 'bold', children: [{ kind: 'term', key: 'chunk', label: 'Chunk' }, { kind: 'text', text: ':' }] });
    const [code] = parseInline('**always use `local`**');
    expect(code).toMatchObject({ kind: 'bold', children: [{ kind: 'text', text: 'always use ' }, { kind: 'code', text: 'local' }] });
    expect(flattenInline(parseInline('**see [[scope]]**')).map((t) => t.kind)).toEqual(['bold', 'text', 'term']);
    expect(inlineToPlain('**[[chunk|Chunk]]:** unit', () => 'x')).toBe('Chunk: unit');
  });
});

describe('Professional Programming Education Standard — every written lecture', () => {
  const written = CONTENT_PACKAGES.flatMap((pkg) => pkg.lectures.map((l) => [`${l.courseCode} ${l.module}.${l.lecture}`, pkg, l] as const));

  it('no lecture is defined twice and every lecture maps to a real course/module/lecture number', () => {
    const ids = written.map(([name]) => name);
    expect(new Set(ids).size).toBe(ids.length);
    for (const [name, , l] of written) {
      expect(allCourses.find((c) => c.code === l.courseCode)?.modules[l.module - 1]?.lectures[l.lecture - 1], name).toBeDefined();
    }
  });

  it('no code example is repeated verbatim across the course materials (debug variants excluded)', () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const pkg of CONTENT_PACKAGES) {
      for (const unit of collectCodeExamples(pkg)) {
        if (unit.expectedError !== undefined) continue;
        const body = unit.code.replace(/\s+/g, ' ').trim();
        const first = seen.get(body);
        if (first) duplicates.push(`${unit.key} repeats ${first}`);
        else seen.set(body, unit.key);
      }
    }
    expect(duplicates).toEqual([]);
  });

  it('the reference lectures LUA102 1.1 and LUAU203 1.1 are preserved (M2 acceptance condition 2)', () => {
    expect(written.map(([name]) => name)).toEqual(expect.arrayContaining(['LUA102 1.1', 'LUAU203 1.1']));
  });

  /** Words of prose in a section's paragraphs, callouts and list items (one language). */
  const words = (blocks: ContentPackage['lectures'][number]['sections'][number]['blocks'], lang: 'ms' | 'en') => {
    const texts: string[] = [];
    for (const b of blocks) {
      if (b.type === 'paragraph' || b.type === 'callout') texts.push(b.text[lang] ?? '');
      if (b.type === 'list') texts.push(...b.items.map((i) => i[lang] ?? ''));
    }
    return texts.reduce((n, t) => n + inlineToPlain(t).split(/\s+/).filter(Boolean).length, 0);
  };

  it.each(written)('%s meets the standard', (_name, pkg, l) => {
    const section = (kind: string) => l.sections.find((s) => s.kind === kind)!;
    // All 24 authored sections, in order, none skipped (the two optional ones are written too).
    expect(l.sections.map((s) => s.kind)).toEqual(AUTHORED_SECTIONS);
    expect(l.sections.filter((s) => s.notApplicable)).toEqual([]);
    // Detailed theory: substantive prose in both languages.
    for (const lang of ['ms', 'en'] as const) expect(words(section('detailed_theory').blocks, lang)).toBeGreaterThanOrEqual(80);
    // Real code: several complete examples, each runnable one with expected output.
    const code_ = l.sections.flatMap((s) => s.blocks).filter((b) => b.type === 'code');
    expect(code_.length).toBeGreaterThanOrEqual(5);
    // Line-by-line: every explained example covers all of its meaningful lines (validator rule).
    expect(section('line_by_line').blocks.filter((b) => b.type === 'explain').length).toBeGreaterThanOrEqual(2);
    expect(validateContentPackage({ ...pkg, lectures: [l] })).toEqual([]);
    // Debugging, practical examples, poor-vs-improved, references.
    expect(words(section('debugging').blocks, 'en')).toBeGreaterThanOrEqual(40);
    expect(section('practical_demonstration').blocks.length + section('mini_project').blocks.length).toBeGreaterThanOrEqual(2);
    expect(section('software_engineering').blocks.some((b) => b.type === 'code')).toBe(true);
    const refs = section('references').blocks.flatMap((b) => (b.type === 'links' ? b.items : []));
    expect(refs.length).toBeGreaterThanOrEqual(4);
  });
});

describe('Lua/Roblox separation checks real code, not strings or comments', () => {
  const withCode = (code: string) => {
    const p = clone();
    (lectureOf(p, 'LUA102').sections.find((s) => s.kind === 'code_demonstration')!.blocks[0] as { code: string }).code = code;
    return validateContentPackage(p).filter((e) => e.includes('Roblox') || e.includes('Luau-only'));
  };

  it.each([
    ['a string that says "game over"', 'print("game over")'],
    ['a comment that mentions a script', '-- this script counts down\nprint(3)'],
    ['a long string with task.wait', 'local doc = [[task.wait and game:GetService are Roblox-only]]\nprint(#doc)'],
    ['an identifier merely named task or game', 'local task = "homework"\nlocal game = 1\nprint(task, game)'],
    ['a string with += inside', 'print("score += 1 is Luau syntax")'],
  ])('accepts %s', (_name, code) => {
    expect(withCode(code)).toEqual([]);
  });

  it.each([
    ['game:GetService', 'local Players = game:GetService("Players")'],
    ['task.wait', 'task.wait(1)'],
    ['workspace access', 'print(workspace.Gravity)'],
    ['+= compound assignment', 'local s = 0\ns += 1'],
    ['backtick interpolation', 'local n = 1\nprint(`n = {n}`)'],
  ])('rejects %s', (_name, code) => {
    expect(withCode(code).length).toBeGreaterThan(0);
  });
});

describe('quality rules reject defective materials (Part L)', () => {
  it.each<[string, (p: ContentPackage) => void, string]>([
    ['a missing section', (p) => lectureOf(p, 'LUA102').sections.splice(5, 1), 'missing sections: technical_terminology'],
    ['sections out of order', (p) => lectureOf(p, 'LUA102').sections.reverse(), 'not in template order'],
    ['missing English text', (p) => (lectureOf(p, 'LUA102').sections[2]!.blocks[0] as { text: { en: string } }).text.en = '', 'English text missing'],
    ['an unresolved glossary link', (p) => (lectureOf(p, 'LUA102').sections[2]!.blocks[0] as { text: { ms: string } }).text.ms += ' [[nonexistent]]', 'does not resolve'],
    ['a Roblox concept in a Lua lecture', (p) => (lectureOf(p, 'LUA102').sections[2]!.blocks[0] as { text: { ms: string } }).text.ms += ' [[datastore]]', 'Lua lecture links roblox concept'],
    ['Roblox API in Lua code', (p) => {
      const b = lectureOf(p, 'LUA102').sections.find((s) => s.kind === 'code_demonstration')!.blocks[0] as { code: string };
      b.code += '\nlocal Players = game:GetService("Players")';
    }, 'Lua code uses a Roblox identifier'],
    ['a Roblox API in a Lua debug variant', (p) => {
      const b = lectureOf(p, 'LUA102').sections.find((s) => s.kind === 'code_demonstration')!.blocks[0] as { debug: { code: string } };
      b.debug.code += '\ntask.wait(1)';
    }, 'debug variant breaks the Lua/Luau separation'],
    ['Instance.new in Lua code', (p) => {
      const b = lectureOf(p, 'LUA102').sections.find((s) => s.kind === 'code_demonstration')!.blocks[0] as { code: string };
      b.code += '\nlocal part = Instance.new("Part")';
    }, 'Lua code uses a Roblox identifier'],
    ['Luau-only syntax in Lua code', (p) => {
      const b = lectureOf(p, 'LUA102').sections.find((s) => s.kind === 'code_demonstration')!.blocks[0] as { code: string };
      b.code += '\nscore += 1';
    }, 'Lua code uses Luau-only syntax'],
    ['Roblox API in code marked as plain Luau', (p) => {
      const b = lectureOf(p, 'LUAU203').sections.find((s) => s.kind === 'complete_examples')!.blocks[1] as { code: string };
      b.code += '\nlocal Players = game:GetService("Players")';
    }, 'uses a Roblox API'],
    ['runnable code without expected output', (p) => {
      const b = lectureOf(p, 'LUA102').sections.find((s) => s.kind === 'code_demonstration')!.blocks[0] as { expectedOutput?: string };
      delete b.expectedOutput;
    }, 'needs expectedOutput'],
    ['an explanation range outside the code (off by one)', (p) => {
      const e = lectureOf(p, 'LUAU203').sections.find((s) => s.kind === 'line_by_line')!.blocks.find((b) => b.type === 'explain' && b.codeId === 'pure-signal') as { items: { lines: string }[] };
      e.items.at(-1)!.lines = '29–38';
    }, 'is outside pure-signal'],
    ['a code line left unexplained', (p) => {
      const e = lectureOf(p, 'LUA102').sections.find((s) => s.kind === 'line_by_line')!.blocks.find((b) => b.type === 'explain' && b.codeId === 'scope-blocks') as { items: unknown[] };
      e.items.splice(4, 1); // drop the explanation of line 14
    }, 'scope-blocks lines not explained: 14'],
    ['a non-https reference', (p) => (lectureOf(p, 'LUA102').sections.at(-1)!.blocks[0] as { items: { url: string }[] }).items[0]!.url = 'http://example.com', 'must use https'],
    ['a not-applicable mandatory section', (p) => (lectureOf(p, 'LUA102').sections[3]!.notApplicable = { ms: 'x', en: 'y' }), 'may be marked not applicable'],
  ])('rejects %s', (_name, mutate, expected) => {
    const pkg = clone();
    mutate(pkg);
    expect(validateContentPackage(pkg).join('\n')).toContain(expected);
  });
});

describe('content installation', () => {
  it('requires the curriculum structure first and writes nothing otherwise', async () => {
    const db = await freshDb();
    const plan = await planContentInstall(db, LUA_LUAU_CONTENT);
    expect(plan.missing).toEqual([
      ...LUA_LUAU_CONTENT.lectures.map((l) => `${l.courseCode} ${l.module}.${l.lecture}`),
      ...(LUA_LUAU_CONTENT.modules ?? []).map((m) => `${m.courseCode} M${m.module}`),
    ]);
    await expect(installContentPackage(db, LUA_LUAU_CONTENT)).rejects.toBeInstanceOf(ContentInstallError);
    expect(await db.glossaryTerms.count()).toBe(0);
  });

  it('installs onto the curriculum in one transaction, idempotently, without touching structure records', async () => {
    const db = await freshDb();
    const student = await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' });
    await installPackage(db, UNIVERSITY_CORE_M1);
    await installPackage(db, LUA_LUAU_M2);
    const before = await dumpTables(db);

    const result = await installContentPackage(db, LUA_LUAU_CONTENT);
    expect(result.written).toBe(LUA_LUAU_CONTENT.glossary.length + LUA_LUAU_CONTENT.lectures.length + (LUA_LUAU_CONTENT.modules?.length ?? 0));
    expect((await db.snapshots.get(result.snapshotId!))?.reason).toBe('pre-seed');

    const course = (await db.courses.where('code').equals('LUA102').first())!;
    const module = (await db.modules.where('[courseId+order]').equals([course.id, 1]).first())!;
    const lecture = (await db.lectures.where('[moduleId+order]').equals([module.id, 1]).first())!;
    expect(lecture.sections.map((s) => s.kind)).toEqual(AUTHORED_SECTIONS);
    expect(lecture.sections).toEqual(LUA102_1_1.sections);
    expect(lecture.contentVersion).toBe(LUA_LUAU_CONTENT.version);
    expect(await db.glossaryTerms.count()).toBe(LUA_LUAU_CONTENT.glossary.length);

    // Only lecture and module content changed: every other table (structure, student) is identical.
    const after = await dumpTables(db);
    for (const table of ['faculties', 'academies', 'programmes', 'semesters', 'courses', 'coursePrerequisites', 'students']) {
      expect(after[table], table).toEqual(before[table]);
    }
    // Module records keep every structure field; only the packaged modules (PY101 M1–M4) gain content fields.
    const contentFields = ['sections', 'contentSource', 'contentVersion', 'contentUpdatedAt', 'updatedAt'];
    const structureOf = (rows: unknown[]) => rows.map((r) => Object.fromEntries(Object.entries(r as object).filter(([k]) => !contentFields.includes(k))));
    expect(structureOf(after.modules!)).toEqual(structureOf(before.modules!));
    const withContent = (after.modules as { sections?: unknown; contentSource?: string; contentVersion?: string }[]).filter((m) => m.sections);
    expect(withContent).toHaveLength(LUA_LUAU_CONTENT.modules?.length ?? 0);
    expect(withContent.every((m) => m.contentSource === 'package' && m.contentVersion === LUA_LUAU_CONTENT.version)).toBe(true);
    expect(await db.students.get(student.id)).toEqual(student);

    // Glossary bookmarks are covered by the integrity rules.
    const term = (await db.glossaryTerms.where('key').equals('closure').first())!;
    await db.bookmarks.add({ id: 'b', studentId: student.id, entityType: 'glossary', entityId: term.id, createdAt: 'x', updatedAt: 'x' });
    expect((await checkDatabaseIntegrity(db)).issues).toEqual([]);

    expect(await installContentPackage(db, LUA_LUAU_CONTENT)).toMatchObject({ written: 0 });
    expect((await planContentInstall(db, LUA_LUAU_CONTENT)).lecturesUpToDate).toBe(LUA_LUAU_CONTENT.lectures.length);
  });

  it('a newer release updates lectures installed by an older one and keeps student data', async () => {
    const db = await freshDb();
    const student = await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' });
    await installPackage(db, UNIVERSITY_CORE_M1);
    await installPackage(db, LUA_LUAU_M2);
    const old = { ...clone(), version: '1.0.0' };
    await installContentPackage(db, old);
    const course = (await db.courses.where('code').equals('LUAU203').first())!;
    const module = (await db.modules.where('[courseId+order]').equals([course.id, 1]).first())!;
    const lecture = (await db.lectures.where('[moduleId+order]').equals([module.id, 1]).first())!;
    await db.notes.add({ id: 'n1', studentId: student.id, entityType: 'lecture', entityId: lecture.id, kind: 'lecture_note', title: 't', body: 'mine', tags: [], createdAt: 'x', updatedAt: 'x' });

    // The old release contained exactly the lectures/terms of `old`; all of them are rewritten.
    expect(await planContentInstall(db, LUA_LUAU_CONTENT)).toMatchObject({ lecturesToWrite: LUA_LUAU_CONTENT.lectures.length, glossaryToWrite: LUA_LUAU_CONTENT.glossary.length });
    expect((await installContentPackage(db, LUA_LUAU_CONTENT)).written).toBe(LUA_LUAU_CONTENT.lectures.length + LUA_LUAU_CONTENT.glossary.length + (LUA_LUAU_CONTENT.modules?.length ?? 0));
    const updated = (await db.lectures.get(lecture.id))!;
    expect(updated.contentVersion).toBe(LUA_LUAU_CONTENT.version);
    expect(JSON.stringify(updated.sections)).toContain('"29–37"');
    expect((await db.notes.get('n1'))?.body).toBe('mine');
    expect((await checkDatabaseIntegrity(db)).issues).toEqual([]);
  });
});
