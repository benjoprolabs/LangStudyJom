import { newId, newStudentNumber } from '@/lib/id';
import { localTimezone, nowIso } from '@/lib/time';
import type { QhazeDatabase } from '../database';
import type { Student } from '../types';

export interface StudentInput {
  fullName: string;
  preferredName: string;
  email?: string;
  bio?: string;
  goals?: string;
  timezone?: string;
}

export type StudentFieldError = 'required' | 'too_long' | 'invalid_email';

const LIMITS = { fullName: 120, preferredName: 60, email: 254, bio: 2000, goals: 2000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStudentInput(input: StudentInput): Partial<Record<keyof StudentInput, StudentFieldError>> {
  const errors: Partial<Record<keyof StudentInput, StudentFieldError>> = {};
  const fullName = input.fullName.trim();
  const preferredName = input.preferredName.trim();
  if (!fullName) errors.fullName = 'required';
  else if (fullName.length > LIMITS.fullName) errors.fullName = 'too_long';
  if (!preferredName) errors.preferredName = 'required';
  else if (preferredName.length > LIMITS.preferredName) errors.preferredName = 'too_long';
  const email = input.email?.trim();
  if (email) {
    if (email.length > LIMITS.email) errors.email = 'too_long';
    else if (!EMAIL_RE.test(email)) errors.email = 'invalid_email';
  }
  if ((input.bio?.length ?? 0) > LIMITS.bio) errors.bio = 'too_long';
  if ((input.goals?.length ?? 0) > LIMITS.goals) errors.goals = 'too_long';
  return errors;
}

function normalise(input: StudentInput) {
  const clean = (s?: string) => (s && s.trim() ? s.trim() : undefined);
  return {
    fullName: input.fullName.trim(),
    preferredName: input.preferredName.trim(),
    email: clean(input.email),
    bio: clean(input.bio),
    goals: clean(input.goals),
  };
}

/** Phase 1 is a single-student university; this returns the primary (oldest) profile. */
export async function getPrimaryStudent(db: QhazeDatabase): Promise<Student | undefined> {
  return db.students.orderBy('createdAt').first();
}

export async function createStudent(db: QhazeDatabase, input: StudentInput): Promise<Student> {
  const errors = validateStudentInput(input);
  if (Object.keys(errors).length) throw new Error('invalid_student');
  return db.transaction('rw', db.students, db.activityLog, async () => {
    if ((await db.students.count()) > 0) throw new Error('student_exists');
    const now = nowIso();
    const student: Student = {
      id: newId(),
      studentNumber: newStudentNumber(),
      ...normalise(input),
      timezone: input.timezone ?? localTimezone(),
      enrolledAt: now,
      createdAt: now,
      updatedAt: now,
    };
    await db.students.add(student);
    await db.activityLog.add({ id: newId(), timestamp: now, type: 'profile.created' });
    return student;
  });
}

/** Update profile fields. `id`, `studentNumber`, `enrolledAt` and `createdAt` are immutable. */
export async function updateStudent(db: QhazeDatabase, id: string, input: StudentInput): Promise<Student> {
  const errors = validateStudentInput(input);
  if (Object.keys(errors).length) throw new Error('invalid_student');
  return db.transaction('rw', db.students, db.activityLog, async () => {
    const current = await db.students.get(id);
    if (!current) throw new Error('student_not_found');
    const next: Student = {
      ...current,
      ...normalise(input),
      timezone: input.timezone ?? current.timezone,
      updatedAt: nowIso(),
    };
    await db.students.put(next);
    await db.activityLog.add({ id: newId(), timestamp: next.updatedAt, type: 'profile.updated' });
    return next;
  });
}
