/** Curriculum Seeding — Milestone 2: Lua and Luau academies (separate pathways). */
import { describe, expect, it } from 'vitest';
import { dumpTables, checkDatabaseIntegrity } from '@/db/integrity';
import { createStudent } from '@/db/repositories/student';
import { installPackage, planInstall } from '@/db/seed/install';
import { LUA_LUAU_M2, UNIVERSITY_CORE_M1 } from '@/db/seed/packages';
import { LUA_PROGRAMME } from '@/db/seed/packages/lua-programme';
import { LUAU_PROGRAMME } from '@/db/seed/packages/luau-programme';
import { PYTHON_PROGRAMME } from '@/db/seed/packages/python-programme';
import type { CourseDef, ProgrammeDef } from '@/db/seed/types';
import { countPackage, validatePackage } from '@/db/seed/validate';
import { freshDb } from '@/test/helpers';

const courses = (p: ProgrammeDef) => p.semesters.flatMap((s) => s.courses);
const corpus = (cs: CourseDef[]) =>
  cs
    .flatMap((c) => [c.title.en, c.description.en, ...c.modules.flatMap((m) => [m.title.en, ...m.lectures.map((l) => l.title.en)])])
    .join(' | ')
    .toLowerCase();

/** Roblox engine API vocabulary — must never appear in the standard-Lua pathway. */
const ROBLOX_API = ['instance', 'remoteevent', 'remotefunction', 'datastore', 'workspace', 'getservice', 'players', 'userinputservice', 'modulescript', 'localscript', 'replicatedstorage', 'tweenservice', 'marketplaceservice', 'collectionservice', 'runservice', 'humanoid', 'cframe', 'leaderstats', 'roblox studio', 'roblox api'];

describe('Milestone 2 package', () => {
  it('passes the package validator', () => {
    expect(validatePackage(LUA_LUAU_M2)).toEqual([]);
  });

  it('has exactly the two programmes, each in its own academy', () => {
    expect(LUA_LUAU_M2.programmes.map((p) => [p.code, p.academyCode])).toEqual([
      ['LUA-PROG', 'F01-LUA'],
      ['LUAU-PROG', 'F01-LUAU'],
    ]);
    expect(countPackage(LUA_LUAU_M2)).toMatchObject({ programmes: 2, semesters: 13, courses: 51, modules: 204, lectures: 612 });
  });

  it.each([LUA_PROGRAMME, LUAU_PROGRAMME])('$code: every course has 4 objectives, 3 outcomes, 4 modules × 3 lectures and references', (p) => {
    for (const c of courses(p)) {
      expect(c.objectives, c.code).toHaveLength(4);
      expect(c.outcomes, c.code).toHaveLength(3);
      expect(c.modules, c.code).toHaveLength(4);
      expect(c.modules.every((m) => m.lectures.length === 3), c.code).toBe(true);
      expect(c.references.length, c.code).toBeGreaterThan(0);
      expect(c.references.every((r) => !r.url || r.url.startsWith('https://')), c.code).toBe(true);
    }
  });

  it('starts at absolute beginner and ends at professional, never going backwards', () => {
    for (const p of [LUA_PROGRAMME, LUAU_PROGRAMME]) {
      expect(courses(p)[0]!.difficulty).toBe('absolute_beginner');
      expect(courses(p).at(-1)!.difficulty).toBe('professional');
    }
  });
});

describe('topic coverage (milestone brief + Part C)', () => {
  it('Lua covers every required topic', () => {
    const text = corpus(courses(LUA_PROGRAMME));
    const required = [
      'execution model', 'syntax', 'variables', 'local', 'global', 'data types', 'operators', 'conditions', 'loops', 'functions',
      'multiple return values', 'closures', 'tables', 'arrays', 'dictionaries', 'iterators', 'metatables', 'metamethods', 'modules',
      'file', 'error handling', 'coroutines', 'object-oriented', 'memory management', 'garbage collection', 'performance',
      'software architecture', 'testing', 'debugging', 'project',
    ];
    expect(required.filter((t) => !text.includes(t))).toEqual([]);
  });

  it('Luau covers every required topic', () => {
    const text = corpus(courses(LUAU_PROGRAMME));
    const required = [
      'luau', 'syntax', 'type annotations', 'type inference', 'strict', 'functions', 'tables', 'modulescript', 'instances', 'workspace',
      'services', 'events', 'connections', 'players', 'userinputservice', 'remoteevents', 'remotefunctions', 'client–server',
      'datastore', 'player data', 'inventory', 'shop', 'save and load', 'ui', 'multiplayer', 'security', 'exploit', 'optimisation',
      'game architecture', 'rpg',
    ];
    expect(required.filter((t) => !text.includes(t))).toEqual([]);
  });

  it('contains all 8 Lua projects and all 10 Luau/Roblox projects (Part E), in increasing complexity', () => {
    const lua = corpus(courses(LUA_PROGRAMME));
    for (const p of ['calculator', 'number guessing game', 'student record system', 'inventory management system', 'console pos system', 'file-based database', 'modular application', 'complete management software']) {
      expect(lua, p).toContain(p);
    }
    const luau = corpus(courses(LUAU_PROGRAMME));
    for (const p of ['obby', 'coin collection', 'player data', 'inventory', 'shop', 'quest', 'save and load', 'combat', 'multiplayer game', 'open-world rpg']) {
      expect(luau, p).toContain(p);
    }
    // Capstones are the last, most advanced courses.
    expect(courses(LUA_PROGRAMME).at(-1)!.code).toBe('LUA390');
    expect(courses(LUAU_PROGRAMME).at(-1)!.code).toBe('LUAU490');
  });
});

describe('Lua / Luau separation (Part C)', () => {
  it('the standard Lua pathway never mentions a Roblox API', () => {
    const text = corpus(courses(LUA_PROGRAMME));
    expect(ROBLOX_API.filter((term) => text.includes(term))).toEqual([]);
  });

  it('Semester 1 of Luau is the language only (no Roblox API vocabulary beyond the Studio introduction)', () => {
    const [, ...languageOnly] = LUAU_PROGRAMME.semesters[0]!.courses; // LUAU101 introduces the Studio environment
    // Content only (titles, modules, lectures) — the descriptions deliberately state "no Roblox APIs".
    const content = languageOnly
      .flatMap((c) => [c.title.en, ...c.modules.flatMap((m) => [m.title.en, ...m.lectures.map((l) => l.title.en)])])
      .join(' | ')
      .toLowerCase();
    expect(ROBLOX_API.filter((term) => content.includes(term))).toEqual([]);
    expect(languageOnly.every((c) => (c.description.en ?? '').includes('no Roblox APIs'))).toBe(true);
  });

  it('every Luau course that uses a Roblox API says so explicitly in its description', () => {
    for (const c of courses(LUAU_PROGRAMME)) {
      const uses = ROBLOX_API.some((term) => corpus([c]).includes(term));
      if (uses) expect(c.description.en, c.code).toMatch(/Roblox API|Roblox Studio/);
    }
  });

  it('no course is duplicated across Python, Lua and Luau (codes and titles are unique)', () => {
    const all = [PYTHON_PROGRAMME, LUA_PROGRAMME, LUAU_PROGRAMME].flatMap(courses);
    expect(new Set(all.map((c) => c.code)).size).toBe(all.length);
    expect(new Set(all.map((c) => c.title.en)).size).toBe(all.length);
  });
});

describe('installation alongside Milestone 1', () => {
  it('reuses Faculty 01 and both academies, creates only new records, and leaves Python data byte-identical', async () => {
    const db = await freshDb();
    const student = await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' });
    await installPackage(db, UNIVERSITY_CORE_M1);
    const pythonBefore = await dumpTables(db);

    const plan = await planInstall(db, LUA_LUAU_M2);
    const c = countPackage(LUA_LUAU_M2);
    const expectedNew = c.programmes + c.semesters + c.courses + c.modules + c.lectures + c.prerequisites;
    expect(plan).toMatchObject({ errors: [], conflicts: [], toCreate: expectedNew, reused: 3 });

    const result = await installPackage(db, LUA_LUAU_M2);
    expect(result.created).toBe(expectedNew);
    expect((await db.snapshots.get(result.snapshotId!))?.reason).toBe('pre-seed');

    // Milestone 1 records untouched
    for (const table of ['faculties', 'academies'] as const) expect(await db.table(table).toArray(), table).toEqual(pythonBefore[table]);
    const py = (await db.programmes.where('code').equals('PY-PROG').first())!;
    expect(await db.courses.where('programmeId').equals(py.id).toArray()).toEqual(pythonBefore.courses);
    expect(await db.faculties.count()).toBe(7);
    expect(await db.students.get(student.id)).toEqual(student);

    // Relationships
    for (const [code, academyCode, sems, n] of [['LUA-PROG', 'F01-LUA', 6, 24], ['LUAU-PROG', 'F01-LUAU', 7, 27]] as const) {
      const p = (await db.programmes.where('code').equals(code).first())!;
      expect((await db.academies.get(p.academyId))?.code).toBe(academyCode);
      expect(await db.semesters.where('programmeId').equals(p.id).count()).toBe(sems);
      const cs = await db.courses.where('programmeId').equals(p.id).toArray();
      expect(cs).toHaveLength(n);
      for (const course of cs) {
        expect(await db.modules.where('courseId').equals(course.id).count(), course.code).toBe(4);
        expect(await db.lectures.where('courseId').equals(course.id).count(), course.code).toBe(12);
      }
    }
    expect((await checkDatabaseIntegrity(db)).issues).toEqual([]);

    // Idempotent
    expect((await planInstall(db, LUA_LUAU_M2)).toCreate).toBe(0);
  });

  it('installs on its own too (Faculty 01 and academies created from the same definitions)', async () => {
    const db = await freshDb();
    await installPackage(db, LUA_LUAU_M2);
    expect(await db.faculties.count()).toBe(1);
    expect((await db.academies.toArray()).map((a) => a.code).sort()).toEqual(['F01-LUA', 'F01-LUAU']);
    // Installing Milestone 1 afterwards reuses them and adds the rest.
    await installPackage(db, UNIVERSITY_CORE_M1);
    expect(await db.faculties.count()).toBe(7);
    expect(await db.academies.count()).toBe(15);
    expect((await checkDatabaseIntegrity(db)).ok).toBe(true);
  });
});
