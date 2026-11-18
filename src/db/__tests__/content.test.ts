/** Professional Programming Education Standard — course materials, glossary and their QA rules. */
import { describe, expect, it } from 'vitest';
import { CONTENT_PACKAGES, LUA_LUAU_CONTENT } from '@/content';
import { GLOSSARY } from '@/content/glossary';
import { LUA102_1_1 } from '@/content/lectures/lua102-1-1';
import { ContentInstallError, installContentPackage, planContentInstall } from '@/db/content/install';
import { parseInline } from '@/db/content/inline';
import type { ContentPackage } from '@/db/content/types';
import { validateContentPackage } from '@/db/content/validate';
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
    expect(plan.missing).toEqual(['LUA102 1.1', 'LUAU203 1.1']);
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
    expect(result.written).toBe(16 + 2);
    expect((await db.snapshots.get(result.snapshotId!))?.reason).toBe('pre-seed');

    const course = (await db.courses.where('code').equals('LUA102').first())!;
    const module = (await db.modules.where('[courseId+order]').equals([course.id, 1]).first())!;
    const lecture = (await db.lectures.where('[moduleId+order]').equals([module.id, 1]).first())!;
    expect(lecture.sections.map((s) => s.kind)).toEqual(AUTHORED_SECTIONS);
    expect(lecture.sections).toEqual(LUA102_1_1.sections);
    expect(lecture.contentVersion).toBe('1.0.0');
    expect(await db.glossaryTerms.count()).toBe(16);

    // Only lecture content changed: every other table (structure, student) is identical.
    const after = await dumpTables(db);
    for (const table of ['faculties', 'academies', 'programmes', 'semesters', 'courses', 'modules', 'coursePrerequisites', 'students']) {
      expect(after[table], table).toEqual(before[table]);
    }
    expect(await db.students.get(student.id)).toEqual(student);

    // Glossary bookmarks are covered by the integrity rules.
    const term = (await db.glossaryTerms.where('key').equals('closure').first())!;
    await db.bookmarks.add({ id: 'b', studentId: student.id, entityType: 'glossary', entityId: term.id, createdAt: 'x', updatedAt: 'x' });
    expect((await checkDatabaseIntegrity(db)).issues).toEqual([]);

    expect(await installContentPackage(db, LUA_LUAU_CONTENT)).toMatchObject({ written: 0 });
    expect((await planContentInstall(db, LUA_LUAU_CONTENT)).lecturesUpToDate).toBe(2);
  });
});
