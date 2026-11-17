import { describe, expect, it } from 'vitest';
import { checkIntegrity } from '@/db/integrity';
import { computeStreak } from '@/db/repositories/stats';

describe('integrity checker', () => {
  it('detects missing references, duplicates, missing ids and self prerequisites', () => {
    const report = checkIntegrity({
      faculties: [{ id: 'f1' }],
      academies: [{ id: 'a1', facultyId: 'f1' }, { id: 'a2', facultyId: 'nope' }, { id: 'a2', facultyId: 'f1' }],
      courses: [{ id: 'c1', programmeId: 'p', semesterId: 's' }],
      coursePrerequisites: [{ id: 'cp1', courseId: 'c1', prerequisiteCourseId: 'c1' }],
      notes: [{ title: 'no id' }],
    });
    const kinds = report.issues.map((i) => i.kind);
    expect(report.ok).toBe(false);
    expect(kinds).toContain('duplicate_id');
    expect(kinds).toContain('missing_id');
    expect(kinds).toContain('self_prerequisite');
    expect(report.issues.filter((i) => i.kind === 'missing_reference').map((i) => i.detail)).toEqual(
      expect.arrayContaining([expect.stringContaining('facultyId=nope'), expect.stringContaining('programmeId=p')]),
    );
  });

  it('accepts optional references when empty', () => {
    expect(checkIntegrity({ students: [{ id: 's' }], studySessions: [{ id: 'x', studentId: 's' }] }).ok).toBe(true);
  });
});

describe('learning streak', () => {
  const today = new Date(2026, 10, 17, 12);
  const day = (offset: number) => new Date(2026, 10, 17 + offset, 9).toISOString();

  it('counts consecutive days ending today', () => {
    expect(computeStreak([day(0), day(-1), day(-2), day(-4)], today)).toBe(3);
  });
  it('still counts a streak ending yesterday', () => {
    expect(computeStreak([day(-1), day(-2)], today)).toBe(2);
  });
  it('is zero with no recent activity', () => {
    expect(computeStreak([], today)).toBe(0);
    expect(computeStreak([day(-3)], today)).toBe(0);
  });
});
