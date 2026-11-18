import type { DifficultyLevel, LocalizedText, Reference } from '../types';

/**
 * Curriculum package format. Records reference each other by CODE (natural keys), never by
 * database id, so a package is portable and idempotent: installing it twice creates nothing new.
 *
 * Lecture CONTENT is not part of a structure package — a lecture here is its title, order
 * and estimated duration. Content follows the 20-section template in Phase 3.
 */

export const L = (ms: string, en: string): LocalizedText => ({ ms, en });

export interface LectureDef {
  title: LocalizedText;
  minutes: number;
}

export interface ModuleDef {
  title: LocalizedText;
  lectures: LectureDef[];
}

export interface PrerequisiteDef {
  code: string;
  /** `required` blocks progression; `recommended` only advises the order. */
  kind: 'required' | 'recommended';
}

export interface CourseDef {
  code: string;
  title: LocalizedText;
  description: LocalizedText;
  creditHours: number;
  difficulty: DifficultyLevel;
  objectives: LocalizedText[];
  outcomes: LocalizedText[];
  prerequisites: PrerequisiteDef[];
  references: Reference[];
  modules: ModuleDef[];
}

export interface SemesterDef {
  number: number;
  title: LocalizedText;
  description: LocalizedText;
  /** Studied in this order (block mode): a same-semester prerequisite must come earlier. */
  courses: CourseDef[];
}

export interface ProgrammeDef {
  academyCode: string;
  code: string;
  name: LocalizedText;
  description: LocalizedText;
  entryLevel: DifficultyLevel;
  exitLevel: DifficultyLevel;
  completionRequirements: LocalizedText[];
  semesters: SemesterDef[];
}

export interface FacultyDef {
  code: string;
  order: number;
  name: LocalizedText;
  description: LocalizedText;
}

export interface AcademyDef {
  facultyCode: string;
  code: string;
  order: number;
  name: LocalizedText;
  description: LocalizedText;
}

export interface CurriculumPackage {
  id: string;
  version: string;
  title: LocalizedText;
  description: LocalizedText;
  faculties: FacultyDef[];
  academies: AcademyDef[];
  programmes: ProgrammeDef[];
}

// ─── Compact authoring helpers ─────────────────────────────────────────────

type Pair = [ms: string, en: string];

/** A module with its lectures: mod(['Tajuk', 'Title'], ['Kuliah 1', 'Lecture 1'], …). */
export function mod(title: Pair, ...lectures: (Pair | [ms: string, en: string, minutes: number])[]): ModuleDef {
  return {
    title: L(title[0], title[1]),
    lectures: lectures.map(([ms, en, minutes]) => ({ title: L(ms, en), minutes: minutes ?? 60 })),
  };
}

export const req = (code: string): PrerequisiteDef => ({ code, kind: 'required' });
export const rec = (code: string): PrerequisiteDef => ({ code, kind: 'recommended' });
export const list = (...pairs: Pair[]): LocalizedText[] => pairs.map(([ms, en]) => L(ms, en));
