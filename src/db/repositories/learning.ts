import { newId } from '@/lib/id';
import { nowIso } from '@/lib/time';
import type { QhazeDatabase } from '../database';
import { assertValidReferences } from '../integrity';
import type { Bookmark, Note, StudentProgress } from '../types';

/**
 * Student learning records written while reading (progress, lecture notes, bookmarks).
 * Every write is reference-checked. They are not wrapped in a whole-database guarded
 * transaction because progress is saved continuously while scrolling.
 *
 * Rule (master spec, Part 12): opening or reading a lecture NEVER marks it complete —
 * only `completeLecture` does, on an explicit action.
 */

function progressRow(db: QhazeDatabase, studentId: string, lectureId: string) {
  return db.progress.where('[studentId+entityType+entityId]').equals([studentId, 'lecture', lectureId]).first();
}

/**
 * Progress writes are read-modify-write: they run in one rw transaction so a reading save that
 * lands just after "Mark complete" cannot overwrite the completion with a stale copy (lost update).
 */
// The scope callback must itself be `async`: Dexie only follows native awaits for async scopes.
const progressTx = <T>(db: QhazeDatabase, fn: () => Promise<T>) => db.transaction('rw', db.tables, async () => await fn());

export function recordReading(db: QhazeDatabase, studentId: string, lectureId: string, percent: number, position: number): Promise<StudentProgress> {
  return progressTx(db, () => recordReadingTx(db, studentId, lectureId, percent, position));
}

async function recordReadingTx(db: QhazeDatabase, studentId: string, lectureId: string, percent: number, position: number): Promise<StudentProgress> {
  const now = nowIso();
  const current = await progressRow(db, studentId, lectureId);
  const row: StudentProgress = current
    ? { ...current, percent: Math.max(current.percent, Math.round(percent)), position, lastAccessedAt: now, updatedAt: now }
    : { id: newId(), studentId, entityType: 'lecture', entityId: lectureId, status: 'in_progress', percent: Math.round(percent), position, lastAccessedAt: now, createdAt: now, updatedAt: now };
  await assertValidReferences(db, 'progress', row as never);
  await db.progress.put(row);
  return row;
}

export function completeLecture(db: QhazeDatabase, studentId: string, lectureId: string): Promise<void> {
  return progressTx(db, () => completeLectureTx(db, studentId, lectureId));
}

async function completeLectureTx(db: QhazeDatabase, studentId: string, lectureId: string): Promise<void> {
  const now = nowIso();
  const current = await progressRow(db, studentId, lectureId);
  const row: StudentProgress = {
    ...(current ?? { id: newId(), studentId, entityType: 'lecture', entityId: lectureId, createdAt: now }),
    status: 'completed',
    percent: 100,
    position: current?.position ?? 0,
    completedAt: now,
    lastAccessedAt: now,
    updatedAt: now,
  } as StudentProgress;
  await assertValidReferences(db, 'progress', row as never);
  await db.progress.put(row);
}

export async function getLectureNote(db: QhazeDatabase, studentId: string, lectureId: string): Promise<Note | undefined> {
  return db.notes
    .where('[entityType+entityId]')
    .equals(['lecture', lectureId])
    .filter((n) => n.studentId === studentId && n.kind === 'lecture_note')
    .first();
}

export async function saveLectureNote(db: QhazeDatabase, studentId: string, lectureId: string, title: string, body: string): Promise<void> {
  const now = nowIso();
  const current = await getLectureNote(db, studentId, lectureId);
  const row: Note = current
    ? { ...current, title, body, updatedAt: now }
    : { id: newId(), studentId, entityType: 'lecture', entityId: lectureId, kind: 'lecture_note', title, body, tags: [], createdAt: now, updatedAt: now };
  await assertValidReferences(db, 'notes', row as never);
  await db.notes.put(row);
}

export async function toggleBookmark(db: QhazeDatabase, studentId: string, entityType: Bookmark['entityType'], entityId: string, label?: string): Promise<boolean> {
  const existing = await db.bookmarks.where('[studentId+entityType+entityId]').equals([studentId, entityType, entityId]).first();
  if (existing) {
    await db.bookmarks.delete(existing.id);
    return false;
  }
  const now = nowIso();
  const row: Bookmark = { id: newId(), studentId, entityType, entityId, label, createdAt: now, updatedAt: now };
  await assertValidReferences(db, 'bookmarks', row as never);
  await db.bookmarks.add(row);
  return true;
}
