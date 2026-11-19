/** "Install all" order and safety: re-installing everything never touches student data or duplicates lectures. */
import { beforeAll, describe, expect, it } from 'vitest';
import { CONTENT_PACKAGES, LUA_LUAU_CONTENT } from '@/content';
import { installContentPackage, planContentInstall } from '@/db/content/install';
import type { QhazeDatabase } from '@/db/database';
import { completeLecture, saveLectureNote, toggleBookmark } from '@/db/repositories/learning';
import { createStudent } from '@/db/repositories/student';
import { installPackage, planInstall } from '@/db/seed/install';
import { CURRICULUM_PACKAGES, LUA_LUAU_M2, UNIVERSITY_CORE_M1 } from '@/db/seed/packages';
import { defaultProgrammeId } from '@/features/learning/LibraryPage';
import { freshDb } from '@/test/helpers';

describe('Library default programme', () => {
  const programmes = [
    { id: 'lua', code: 'LUA-PROG' },
    { id: 'luau', code: 'LUAU-PROG' },
    { id: 'py', code: 'PY-PROG' },
  ];
  it('opens on LUA-PROG when it has written lectures', () => {
    expect(defaultProgrammeId(programmes, new Set(['luau', 'lua']))).toBe('lua');
  });
  it('otherwise opens on the first programme that has content', () => {
    expect(defaultProgrammeId(programmes, new Set(['luau']))).toBe('luau');
  });
  it('falls back to the first programme when nothing has content', () => {
    expect(defaultProgrammeId([{ id: 'py', code: 'PY-PROG' }], new Set())).toBe('py');
  });
});

describe('install order and repeat installs', () => {
  let db: QhazeDatabase;
  beforeAll(async () => {
    db = await freshDb();
  });

  it('the structure packages come before the course materials, and content needs the structure first', async () => {
    expect(CURRICULUM_PACKAGES.map((p) => p.id)).toEqual([UNIVERSITY_CORE_M1.id, LUA_LUAU_M2.id]);
    expect(CONTENT_PACKAGES.map((p) => p.id)).toEqual([LUA_LUAU_CONTENT.id]);
    const before = await planContentInstall(db, LUA_LUAU_CONTENT);
    expect(before.missing.length).toBeGreaterThan(0); // Install all must not run content before structure
  });

  it('a second full install leaves progress, notes, bookmarks, the student and the lectures unchanged', async () => {
    const student = await createStudent(db, { fullName: 'Nur Aisyah', preferredName: 'Aisyah' });
    for (const pkg of CURRICULUM_PACKAGES) await installPackage(db, pkg);
    for (const pkg of CONTENT_PACKAGES) await installContentPackage(db, pkg);

    const course = (await db.courses.where('code').equals('LUA101').first())!;
    const module = (await db.modules.where('[courseId+order]').equals([course.id, 1]).first())!;
    const lecture = (await db.lectures.where('[moduleId+order]').equals([module.id, 1]).first())!;
    await completeLecture(db, student.id, lecture.id);
    await saveLectureNote(db, student.id, lecture.id, 'Nota', 'Lua bermula pada indeks 1.');
    await toggleBookmark(db, student.id, 'lecture', lecture.id);

    const snapshot = async () => ({
      students: await db.students.toArray(),
      progress: await db.progress.toArray(),
      notes: await db.notes.toArray(),
      bookmarks: await db.bookmarks.toArray(),
      lectureIds: (await db.lectures.toArray()).map((x) => x.id).sort(),
      written: (await db.lectures.filter((x) => x.sections.length > 0).toArray()).map((x) => [x.id, x.sections.length]),
    });
    const before = await snapshot();
    expect(before.lectureIds).toHaveLength(984);
    expect(before.written).toHaveLength(LUA_LUAU_CONTENT.lectures.length);

    // Everything reports "nothing to do", and running the installers again changes nothing.
    for (const pkg of CURRICULUM_PACKAGES) expect((await planInstall(db, pkg)).toCreate).toBe(0);
    for (const pkg of CONTENT_PACKAGES) {
      const plan = await planContentInstall(db, pkg);
      expect(plan.lecturesToWrite + plan.glossaryToWrite).toBe(0);
    }
    for (const pkg of CURRICULUM_PACKAGES) expect((await installPackage(db, pkg)).created).toBe(0);
    for (const pkg of CONTENT_PACKAGES) await installContentPackage(db, pkg);

    const after = await snapshot();
    expect(after).toEqual(before);
    const keys = (await db.lectures.toArray()).map((x) => `${x.moduleId}#${x.order}`);
    expect(new Set(keys).size).toBe(keys.length); // no duplicate lecture in any module slot
  }, 120_000);
});
