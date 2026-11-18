/** Reader records (progress, notes, bookmarks) and course-material exports (Markdown, ZIP, highlighting). */
import { beforeAll, describe, expect, it } from 'vitest';
import { LUA_LUAU_CONTENT } from '@/content';
import { installContentPackage } from '@/db/content/install';
import type { QhazeDatabase } from '@/db/database';
import { checkDatabaseIntegrity, IntegrityError } from '@/db/integrity';
import { completeLecture, getLectureNote, IncompleteLectureError, recordReading, saveLectureNote, toggleBookmark } from '@/db/repositories/learning';
import { createStudent } from '@/db/repositories/student';
import { installPackage } from '@/db/seed/install';
import { LUA_LUAU_M2, UNIVERSITY_CORE_M1 } from '@/db/seed/packages';
import type { Lecture } from '@/db/types';
import { loadCourseBundle, loadGlossary, loadLectureBundle } from '@/features/learning/data';
import { codeFiles, courseMarkdown, lectureMarkdown, type ExportLabels } from '@/features/learning/markdown';
import { highlight } from '@/lib/highlight';
import { crc32, createZip } from '@/lib/zip';
import { freshDb } from '@/test/helpers';

const labels: ExportLabels = {
  section: (k) => `S:${k}`,
  difficulty: (d) => d,
  runtime: (r) => `R:${r}`,
  expectedOutput: 'Expected output',
  lines: 'Lines',
  notApplicable: 'N/A',
  noContent: 'NO CONTENT',
  minutes: (n) => `${n} min`,
  credits: (n) => `${n} cr`,
  contents: 'Contents',
  generated: 'Generated',
  externalLink: '(external)',
  notes: 'Notes',
  status: (r, st) => `STATUS:${r}:${st ?? 'unverified'}`,
  input: 'Input',
  debugTitle: 'Debugging',
  brokenCode: 'Buggy',
  errorMessage: 'Error',
  fix: 'Fix',
};
const meta = { app: '0.4.0', date: '2026-11-18' };

let db: QhazeDatabase;
let studentId: string;
let lua102: Lecture; // LUA102 1.1 — full content
let structureOnly: Lecture; // LUA103 1.1 — not written yet (structure only)
let luau203: Lecture; // LUAU203 1.1 — full content

async function lectureAt(code: string, m: number, l: number) {
  const course = (await db.courses.where('code').equals(code).first())!;
  const module = (await db.modules.where('[courseId+order]').equals([course.id, m]).first())!;
  return (await db.lectures.where('[moduleId+order]').equals([module.id, l]).first())!;
}

beforeAll(async () => {
  db = await freshDb();
  studentId = (await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' })).id;
  await installPackage(db, UNIVERSITY_CORE_M1);
  await installPackage(db, LUA_LUAU_M2);
  await installContentPackage(db, LUA_LUAU_CONTENT);
  lua102 = await lectureAt('LUA102', 1, 1);
  structureOnly = await lectureAt('LUA103', 1, 1);
  luau203 = await lectureAt('LUAU203', 1, 1);
}, 60_000);

const progressOf = (lectureId: string) => db.progress.where('[studentId+entityType+entityId]').equals([studentId, 'lecture', lectureId]).first();

describe('reading progress', () => {
  it('reading never completes a lecture; percent only grows, position follows the reader', async () => {
    await recordReading(db, studentId, lua102.id, 40, 0.4);
    await recordReading(db, studentId, lua102.id, 100, 1);
    await recordReading(db, studentId, lua102.id, 20, 0.2);
    const p = (await progressOf(lua102.id))!;
    expect(p).toMatchObject({ status: 'in_progress', percent: 100, position: 0.2 });
    expect(p.completedAt).toBeUndefined();
  });

  it('completion is explicit and survives a reading save racing with it (no lost update)', async () => {
    await Promise.all([recordReading(db, studentId, luau203.id, 30, 0.3), completeLecture(db, studentId, luau203.id), recordReading(db, studentId, luau203.id, 35, 0.35)]);
    const p = (await progressOf(luau203.id))!;
    expect(p.status).toBe('completed');
    expect(p.percent).toBe(100);
    expect((await db.progress.toArray()).filter((x) => x.entityId === luau203.id)).toHaveLength(1);
  });

  it('a structure-only lecture can never be completed and records no reading progress', async () => {
    expect(structureOnly.sections).toEqual([]);
    await expect(completeLecture(db, studentId, structureOnly.id)).rejects.toBeInstanceOf(IncompleteLectureError);
    await expect(recordReading(db, studentId, structureOnly.id, 100, 1)).rejects.toBeInstanceOf(IncompleteLectureError);
    expect(await progressOf(structureOnly.id)).toBeUndefined();
    // Across the whole installed curriculum, completed progress only exists for written lectures.
    const lectures = new Map((await db.lectures.toArray()).map((l) => [l.id, l]));
    for (const p of await db.progress.toArray()) if (p.status === 'completed') expect(lectures.get(p.entityId)!.sections.length).toBeGreaterThan(0);
  });

  it('rejects progress for a lecture or student that does not exist', async () => {
    await expect(recordReading(db, studentId, 'no-such-lecture', 10, 0.1)).rejects.toBeInstanceOf(IntegrityError);
    await expect(completeLecture(db, 'no-such-student', lua102.id)).rejects.toBeInstanceOf(IntegrityError);
  });
});

describe('notes and bookmarks', () => {
  it('one lecture note per student and lecture, updated in place', async () => {
    await saveLectureNote(db, studentId, lua102.id, 'LUA102 1.1', 'first');
    await saveLectureNote(db, studentId, lua102.id, 'LUA102 1.1', 'second');
    expect((await getLectureNote(db, studentId, lua102.id))?.body).toBe('second');
    expect(await db.notes.where('[entityType+entityId]').equals(['lecture', lua102.id]).count()).toBe(1);
  });

  it('bookmarks toggle for lectures and glossary terms; dangling targets are rejected', async () => {
    const term = (await db.glossaryTerms.where('key').equals('closure').first())!;
    expect(await toggleBookmark(db, studentId, 'lecture', lua102.id)).toBe(true);
    expect(await toggleBookmark(db, studentId, 'glossary', term.id)).toBe(true);
    expect(await toggleBookmark(db, studentId, 'lecture', lua102.id)).toBe(false);
    expect(await db.bookmarks.count()).toBe(1);
    await expect(toggleBookmark(db, studentId, 'glossary', 'missing')).rejects.toBeInstanceOf(IntegrityError);
    expect((await checkDatabaseIntegrity(db)).issues).toEqual([]);
  });
});

describe('course-material exports (Part H)', () => {
  it('lecture Markdown: header, metadata, every authored section in order, fenced code with expected output', async () => {
    const bundle = (await loadLectureBundle(db, lua102.id))!;
    const md = lectureMarkdown(bundle, 'ms', await loadGlossary(db), labels, meta);
    expect(md.startsWith('# LUA102 · S:lecture_information 1.1: ')).toBe(true);
    const headings = [...md.matchAll(/^## (S:\w+)/gm)].map((m) => m[1]);
    expect(headings).toEqual(lua102.sections.map((s) => `S:${s.kind}`));
    expect(md).toContain('```lua\n-- Global: no');
    expect(md).toContain('Aisyah\t10');
    expect(md).not.toMatch(/\[\[|\]\]/); // glossary syntax resolved
    // Verification status comes from the manifest and is tied to the exact code.
    expect(md).toContain('_STATUS:lua54:executed_');
    expect(md).not.toContain('unverified');
    expect(md).toContain("**Debugging** — _STATUS:lua54:error-matched_");
    expect(md).toContain("example:8: attempt to perform arithmetic on a nil value (global 'scroe')");
  });

  it('Markdown never contains Practice Center data (exercises, assessments) even when it exists', async () => {
    const course = (await db.courses.where('code').equals('LUA102').first())!;
    await db.exercises.add({ id: 'ex-secret', courseId: course.id, lectureId: lua102.id, title: { ms: 'RAHSIA-LATIHAN', en: 'SECRET-EXERCISE' }, type: 'coding', difficulty: 'beginner', instructions: { ms: 'JAWAPAN-RAHSIA', en: 'SECRET-ANSWER' }, createdAt: 'x', updatedAt: 'x' } as never);
    const md = courseMarkdown((await loadCourseBundle(db, course.id))!, 'en', await loadGlossary(db), labels, meta);
    expect(md).not.toMatch(/SECRET|RAHSIA/);
    await db.exercises.delete('ex-secret');
  });

  it('course and module Markdown include structure-only lectures honestly', async () => {
    // LUA102 is fully written; LUA103 is not written yet (structure only).
    const written = (await loadCourseBundle(db, (await db.courses.where('code').equals('LUA102').first())!.id))!;
    const writtenMd = courseMarkdown(written, 'en', await loadGlossary(db), labels, meta);
    expect(writtenMd.match(/^### \d\.\d /gm)).toHaveLength(12);
    expect(writtenMd).not.toContain('_NO CONTENT_');
    const course = (await db.courses.where('code').equals('LUA103').first())!;
    const bundle = (await loadCourseBundle(db, course.id))!;
    const md = courseMarkdown(bundle, 'en', await loadGlossary(db), labels, meta);
    expect(md.match(/^### \d\.\d /gm)).toHaveLength(12);
    expect(md.match(/_NO CONTENT_/g)).toHaveLength(12);
    const one = courseMarkdown(bundle, 'en', await loadGlossary(db), labels, meta, bundle.modules[1]!.module.id);
    expect(one.match(/^### \d\.\d /gm)).toHaveLength(3);
  });

  it('source files: one per example with runtime and expected output in a header comment', () => {
    const files = codeFiles([{ prefix: 'M1/', lecture: lua102 }], 'en', labels);
    expect(files).toHaveLength(9 + 2); // 9 examples + 2 buggy variants
    expect(files[0]!.name).toBe('M1/01-demo-basic.lua');
    expect(files[1]!.name).toBe('M1/01-demo-basic.buggy.lua');
    expect(files[1]!.content).toContain("-- Error: example:8: attempt to perform arithmetic on a nil value (global 'scroe')");
    expect(files[0]!.content).toMatch(/^-- Global versus local\n-- R:lua54\n-- Expected output:\n--   Aisyah\t10\n/);
  });
});

describe('ZIP writer', () => {
  it('crc32 matches the reference value', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
  });

  it('writes valid local headers, central directory and end record', () => {
    const zip = createZip([{ name: 'a.lua', content: 'print(1)\n' }, { name: 'dir/ü.luau', content: 'local x: number = 1' }]);
    const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
    expect(view.getUint32(0, true)).toBe(0x04034b50);
    const end = zip.length - 22;
    expect(view.getUint32(end, true)).toBe(0x06054b50);
    expect(view.getUint16(end + 10, true)).toBe(2); // total entries
    const cdOffset = view.getUint32(end + 16, true);
    expect(view.getUint32(cdOffset, true)).toBe(0x02014b50);
    expect(view.getUint32(14, true)).toBe(crc32(new TextEncoder().encode('print(1)\n')));
    expect(new TextDecoder().decode(zip.subarray(30, 35))).toBe('a.lua');
  });
});

describe('syntax highlighter', () => {
  it('tokenises Lua comments, strings, numbers, keywords and builtins without losing text', () => {
    const code = 'local s = "hi" -- greet\nprint(s, 0x1F, 3.5) --[[ block ]]';
    const tokens = highlight(code, 'lua');
    expect(tokens.map((t) => t.text).join('')).toBe(code);
    const kinds = (kind: string) => tokens.filter((t) => t.kind === kind).map((t) => t.text);
    expect(kinds('keyword')).toEqual(['local']);
    expect(kinds('string')).toEqual(['"hi"']);
    expect(kinds('comment')).toEqual(['-- greet', '--[[ block ]]']);
    expect(kinds('number')).toEqual(['0x1F', '3.5']);
    expect(kinds('builtin')).toContain('print');
  });

  it('Luau keywords are only highlighted in Luau code', () => {
    expect(highlight('continue', 'luau')[0]!.kind).toBe('keyword');
    expect(highlight('continue', 'lua')[0]!.kind).not.toBe('keyword');
  });
});
