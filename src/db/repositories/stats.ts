import { NON_EXPORTED_TABLES } from '../schema';
import type { QhazeDatabase } from '../database';

export interface UniversityStats {
  faculties: number;
  academies: number;
  programmes: number;
  courses: number;
  lectures: number;
  activeEnrollments: number;
  completedLectures: number;
  totalStudyMinutes: number;
  weekStudyMinutes: number;
  streakDays: number;
  projects: number;
  notes: number;
}

/** Local calendar date key (YYYY-MM-DD). */
function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Consecutive days (ending today, or yesterday if nothing logged yet today)
 * with at least one study session.
 */
export function computeStreak(sessionStarts: string[], today: Date = new Date()): number {
  const days = new Set(sessionStarts.map((s) => dayKey(new Date(s))));
  const cursor = new Date(today);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function startOfWeek(d: Date): Date {
  // Week starts Monday.
  const s = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7));
  return s;
}

export async function getUniversityStats(db: QhazeDatabase): Promise<UniversityStats> {
  const sessions = await db.studySessions.toArray();
  const weekStart = startOfWeek(new Date()).toISOString();
  return {
    faculties: await db.faculties.where('status').equals('active').count(),
    academies: await db.academies.where('status').equals('active').count(),
    programmes: await db.programmes.count(),
    courses: await db.courses.count(),
    lectures: await db.lectures.count(),
    activeEnrollments: await db.enrollments.where('status').equals('active').count(),
    completedLectures: await db.progress
      .where('entityType')
      .equals('lecture')
      .filter((p) => p.status === 'completed')
      .count(),
    totalStudyMinutes: sessions.reduce((sum, s) => sum + s.durationMinutes, 0),
    weekStudyMinutes: sessions.filter((s) => s.startedAt >= weekStart).reduce((sum, s) => sum + s.durationMinutes, 0),
    streakDays: computeStreak(sessions.map((s) => s.startedAt)),
    projects: await db.projects.count(),
    notes: await db.notes.count(),
  };
}

export async function countAllRecords(db: QhazeDatabase): Promise<number> {
  let total = 0;
  for (const t of db.tables) if (!NON_EXPORTED_TABLES.has(t.name)) total += await t.count();
  return total;
}
