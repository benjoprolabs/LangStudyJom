import { findPrerequisiteCycles } from '../integrity';
import { LIMITS, MAX_SEMESTERS } from '../repositories/university';
import { DIFFICULTY_LEVELS, type LocalizedText } from '../types';
import type { CurriculumPackage } from './types';

const CODE_RE = /^[A-Z0-9][A-Z0-9-]{0,19}$/;

/** Minimum depth for every course (prevents shallow curricula). */
export const QUALITY_RULES = {
  minObjectives: 3,
  minOutcomes: 3,
  minModules: 3,
  minLecturesPerModule: 2,
} as const;

const level = (d: string) => DIFFICULTY_LEVELS.indexOf(d as (typeof DIFFICULTY_LEVELS)[number]);

/**
 * Validate a curriculum package WITHOUT touching the database. Returns a list of
 * human-readable problems; an empty list means the package is structurally sound.
 */
export function validatePackage(pkg: CurriculumPackage): string[] {
  const errors: string[] = [];
  const text = (where: string, t: LocalizedText | undefined, max: number) => {
    if (!t?.ms?.trim()) errors.push(`${where}: Malay text is missing`);
    if (!t?.en?.trim()) errors.push(`${where}: English text is missing`);
    if ((t?.ms?.length ?? 0) > max || (t?.en?.length ?? 0) > max) errors.push(`${where}: text longer than ${max} characters`);
  };
  const code = (where: string, c: string, seen: Set<string>) => {
    if (!CODE_RE.test(c)) errors.push(`${where}: invalid code "${c}"`);
    if (seen.has(c)) errors.push(`${where}: duplicate code "${c}"`);
    seen.add(c);
  };

  const facultyCodes = new Set<string>();
  for (const f of pkg.faculties) {
    code(`faculty ${f.code}`, f.code, facultyCodes);
    text(`faculty ${f.code} name`, f.name, LIMITS.name);
    text(`faculty ${f.code} description`, f.description, LIMITS.description);
  }

  const academyCodes = new Set<string>();
  for (const a of pkg.academies) {
    code(`academy ${a.code}`, a.code, academyCodes);
    if (!facultyCodes.has(a.facultyCode)) errors.push(`academy ${a.code}: unknown faculty ${a.facultyCode}`);
    text(`academy ${a.code} name`, a.name, LIMITS.name);
    text(`academy ${a.code} description`, a.description, LIMITS.description);
  }

  const programmeCodes = new Set<string>();
  const courseCodes = new Set<string>();
  for (const p of pkg.programmes) {
    const where = `programme ${p.code}`;
    code(where, p.code, programmeCodes);
    if (!academyCodes.has(p.academyCode)) errors.push(`${where}: unknown academy ${p.academyCode}`);
    text(`${where} name`, p.name, LIMITS.name);
    text(`${where} description`, p.description, LIMITS.description);
    p.completionRequirements.forEach((r, i) => text(`${where} requirement ${i + 1}`, r, LIMITS.listItem));
    if (level(p.entryLevel) < 0 || level(p.exitLevel) < 0 || level(p.exitLevel) < level(p.entryLevel)) {
      errors.push(`${where}: invalid entry/exit level`);
    }
    if (p.semesters.length < 1 || p.semesters.length > MAX_SEMESTERS) errors.push(`${where}: 1–${MAX_SEMESTERS} semesters required`);

    // Course position: semester number and index within the semester (study order).
    const position = new Map<string, { semester: number; index: number }>();
    let previousMax = -1;
    p.semesters.forEach((s, si) => {
      const sw = `${where} semester ${s.number}`;
      if (s.number !== si + 1) errors.push(`${sw}: semesters must be numbered 1..N in order`);
      text(`${sw} title`, s.title, LIMITS.name);
      text(`${sw} description`, s.description, LIMITS.description);
      if (s.courses.length === 0) errors.push(`${sw}: has no courses`);
      const levels = s.courses.map((c) => level(c.difficulty));
      if (levels.length && Math.min(...levels) < previousMax) errors.push(`${sw}: difficulty decreases compared with the previous semester`);
      if (levels.length) previousMax = Math.max(previousMax, ...levels);

      s.courses.forEach((c, ci) => {
        const cw = `course ${c.code}`;
        code(cw, c.code, courseCodes);
        position.set(c.code, { semester: s.number, index: ci });
        text(`${cw} title`, c.title, LIMITS.name);
        text(`${cw} description`, c.description, LIMITS.description);
        if (!Number.isInteger(c.creditHours) || c.creditHours < 1 || c.creditHours > 30) errors.push(`${cw}: credit hours must be 1–30`);
        if (level(c.difficulty) < level(p.entryLevel) || level(c.difficulty) > level(p.exitLevel)) {
          errors.push(`${cw}: difficulty outside the programme's entry–exit range`);
        }
        if (c.objectives.length < QUALITY_RULES.minObjectives) errors.push(`${cw}: needs at least ${QUALITY_RULES.minObjectives} learning objectives`);
        if (c.outcomes.length < QUALITY_RULES.minOutcomes) errors.push(`${cw}: needs at least ${QUALITY_RULES.minOutcomes} learning outcomes`);
        c.objectives.forEach((o, i) => text(`${cw} objective ${i + 1}`, o, LIMITS.listItem));
        c.outcomes.forEach((o, i) => text(`${cw} outcome ${i + 1}`, o, LIMITS.listItem));
        if (c.references.length === 0) errors.push(`${cw}: needs at least one reference`);
        if (c.modules.length < QUALITY_RULES.minModules) errors.push(`${cw}: needs at least ${QUALITY_RULES.minModules} modules`);
        c.modules.forEach((m, mi) => {
          text(`${cw} module ${mi + 1}`, m.title, LIMITS.name * 2);
          if (m.lectures.length < QUALITY_RULES.minLecturesPerModule) errors.push(`${cw} module ${mi + 1}: needs at least ${QUALITY_RULES.minLecturesPerModule} lectures`);
          m.lectures.forEach((l, li) => {
            text(`${cw} module ${mi + 1} lecture ${li + 1}`, l.title, LIMITS.name * 2);
            if (!Number.isInteger(l.minutes) || l.minutes < 5 || l.minutes > 600) errors.push(`${cw} module ${mi + 1} lecture ${li + 1}: minutes must be 5–600`);
          });
        });
      });
    });

    // Prerequisites: known, not self, not duplicated, never "forward" in study order, no cycles.
    const edges: Record<string, unknown>[] = [];
    for (const s of p.semesters) {
      for (const c of s.courses) {
        const seen = new Set<string>();
        for (const pre of c.prerequisites) {
          const pw = `course ${c.code} prerequisite ${pre.code}`;
          if (seen.has(pre.code)) errors.push(`${pw}: listed twice`);
          seen.add(pre.code);
          if (pre.code === c.code) errors.push(`${pw}: a course cannot require itself`);
          const target = position.get(pre.code);
          const self = position.get(c.code)!;
          if (!target) {
            errors.push(`${pw}: not a course of this programme`);
            continue;
          }
          const forward = target.semester > self.semester || (target.semester === self.semester && target.index >= self.index);
          if (forward && pre.code !== c.code) errors.push(`${pw}: must come earlier in the study order`);
          edges.push({ id: `${c.code}<-${pre.code}`, courseId: c.code, prerequisiteCourseId: pre.code });
        }
      }
    }
    for (const cycle of findPrerequisiteCycles(edges)) errors.push(`${where}: ${cycle.detail}`);
  }
  return errors;
}

export interface PackageCounts {
  faculties: number;
  academies: number;
  programmes: number;
  semesters: number;
  courses: number;
  modules: number;
  lectures: number;
  prerequisites: number;
  creditHours: number;
}

export function countPackage(pkg: CurriculumPackage): PackageCounts {
  const semesters = pkg.programmes.flatMap((p) => p.semesters);
  const courses = semesters.flatMap((s) => s.courses);
  const modules = courses.flatMap((c) => c.modules);
  return {
    faculties: pkg.faculties.length,
    academies: pkg.academies.length,
    programmes: pkg.programmes.length,
    semesters: semesters.length,
    courses: courses.length,
    modules: modules.length,
    lectures: modules.reduce((n, m) => n + m.lectures.length, 0),
    prerequisites: courses.reduce((n, c) => n + c.prerequisites.length, 0),
    creditHours: courses.reduce((n, c) => n + c.creditHours, 0),
  };
}
