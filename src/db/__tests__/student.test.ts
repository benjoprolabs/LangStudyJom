import { describe, expect, it } from 'vitest';
import { createStudent, updateStudent, validateStudentInput } from '@/db/repositories/student';
import { freshDb } from '@/test/helpers';

describe('student profile', () => {
  it('validates required fields, lengths and email', () => {
    expect(validateStudentInput({ fullName: ' ', preferredName: '' })).toEqual({ fullName: 'required', preferredName: 'required' });
    expect(validateStudentInput({ fullName: 'x'.repeat(121), preferredName: 'ok' }).fullName).toBe('too_long');
    expect(validateStudentInput({ fullName: 'A', preferredName: 'B', email: 'not-an-email' }).email).toBe('invalid_email');
    expect(validateStudentInput({ fullName: 'A', preferredName: 'B', email: 'a@b.co' })).toEqual({});
  });

  it('creates a profile with a student number, trimmed fields and an activity entry', async () => {
    const db = await freshDb();
    const s = await createStudent(db, { fullName: '  Nur Aisyah  ', preferredName: 'Aisyah', email: '', goals: '  AI Engineer ' });
    expect(s.studentNumber).toMatch(/^QTU-\d{4}-[0-9A-F]{6}$/);
    expect(s.fullName).toBe('Nur Aisyah');
    expect(s.email).toBeUndefined();
    expect(s.goals).toBe('AI Engineer');
    expect(await db.activityLog.where('type').equals('profile.created').count()).toBe(1);
  });

  it('rejects invalid input and a second profile', async () => {
    const db = await freshDb();
    await expect(createStudent(db, { fullName: '', preferredName: '' })).rejects.toThrow('invalid_student');
    await createStudent(db, { fullName: 'A', preferredName: 'A' });
    await expect(createStudent(db, { fullName: 'B', preferredName: 'B' })).rejects.toThrow('student_exists');
    expect(await db.students.count()).toBe(1);
  });

  it('updates editable fields but never the identity fields', async () => {
    const db = await freshDb();
    const s = await createStudent(db, { fullName: 'A', preferredName: 'A' });
    await new Promise((r) => setTimeout(r, 5));
    const u = await updateStudent(db, s.id, { fullName: 'Alya Binti Ahmad', preferredName: 'Alya', bio: 'Hi' });
    expect(u).toMatchObject({ id: s.id, studentNumber: s.studentNumber, createdAt: s.createdAt, enrolledAt: s.enrolledAt, fullName: 'Alya Binti Ahmad', bio: 'Hi' });
    expect(u.updatedAt > s.updatedAt).toBe(true);
    await expect(updateStudent(db, 'missing', { fullName: 'A', preferredName: 'A' })).rejects.toThrow('student_not_found');
  });
});
