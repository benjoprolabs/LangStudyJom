import { nowIso } from '@/lib/time';
import { createSnapshot } from '../backup/backup';
import type { QhazeDatabase } from '../database';
import { guardedWrite, logActivity } from '../guards';
import { createLecture, createModule } from '../repositories/modules';
import { addPrerequisite, createAcademy, createCourse, createFaculty, createProgramme, createSemester } from '../repositories/university';
import type { CurriculumPackage } from './types';
import { validatePackage } from './validate';

/**
 * Curriculum package installer.
 *
 * SAFETY PROCEDURE (requirement E):
 *  1. `validatePackage` — structural and quality checks, no database access.
 *  2. `planInstall` (dry run) — compares the package with the database: what will be created,
 *     what already exists and is reused, and any CONFLICT (e.g. course code PY101 already used
 *     by another programme). Conflicts or validation errors stop the install.
 *  3. A `pre-seed` recovery point is created.
 *  4. Every record is written through the validated repository functions inside ONE
 *     `guardedWrite` transaction. Any failure — validation, integrity, or a thrown error —
 *     rolls back the entire install: either everything is written, or nothing is.
 *  5. Installing again is idempotent: existing records (matched by code / order) are reused,
 *     never overwritten, so a re-run creates nothing.
 *
 * Recovery: restore the "Before curriculum install" recovery point on the Backup page.
 */

export const PACKAGES_META_KEY = 'curriculumPackages';

export interface InstalledPackageInfo {
  version: string;
  installedAt: string;
  created: number;
}

export interface InstallPlan {
  errors: string[];
  conflicts: string[];
  toCreate: number;
  reused: number;
  installed?: InstalledPackageInfo;
}

export interface InstallResult {
  created: number;
  reused: number;
  snapshotId?: string;
}

export class PackageInstallError extends Error {
  constructor(public readonly problems: string[]) {
    super(`package_install_blocked: ${problems.join('; ')}`);
    this.name = 'PackageInstallError';
  }
}

interface Tally {
  created: number;
  reused: number;
  conflicts: string[];
}

/**
 * Walk the package against the database. With `apply = false` nothing is written (dry run);
 * with `apply = true` missing records are created via the validated repositories.
 * When a parent does not exist yet (dry run), all its children count as "to create".
 */
async function walk(db: QhazeDatabase, pkg: CurriculumPackage, apply: boolean): Promise<Tally> {
  const tally: Tally = { created: 0, reused: 0, conflicts: [] };
  const made = () => tally.created++;

  const facultyIds = new Map<string, string | undefined>();
  for (const f of pkg.faculties) {
    const existing = await db.faculties.where('code').equals(f.code).first();
    if (existing) {
      tally.reused++;
      facultyIds.set(f.code, existing.id);
      continue;
    }
    made();
    facultyIds.set(
      f.code,
      apply ? (await createFaculty(db, { code: f.code, name: f.name, description: f.description, order: f.order, status: 'active' })).id : undefined,
    );
  }

  const academyIds = new Map<string, string | undefined>();
  for (const a of pkg.academies) {
    const facultyId = facultyIds.get(a.facultyCode);
    const existing = await db.academies.where('code').equals(a.code).first();
    if (existing) {
      // If the faculty is about to be created, an existing academy with this code must belong elsewhere.
      if (!facultyId || existing.facultyId !== facultyId) {
        tally.conflicts.push(`academy ${a.code} exists in a different faculty`);
      }
      tally.reused++;
      academyIds.set(a.code, existing.id);
      continue;
    }
    made();
    academyIds.set(
      a.code,
      apply && facultyId
        ? (await createAcademy(db, { facultyId, code: a.code, name: a.name, description: a.description, order: a.order, status: 'active' })).id
        : undefined,
    );
  }

  const courseIds = new Map<string, string | undefined>();
  for (const p of pkg.programmes) {
    const academyId = academyIds.get(p.academyCode);
    let programmeId: string | undefined;
    const existingProgramme = await db.programmes.where('code').equals(p.code).first();
    if (existingProgramme) {
      if (!academyId || existingProgramme.academyId !== academyId) tally.conflicts.push(`programme ${p.code} exists in a different academy`);
      if (existingProgramme.totalSemesters < p.semesters.length) tally.conflicts.push(`programme ${p.code} has fewer semesters than the package`);
      tally.reused++;
      programmeId = existingProgramme.id;
    } else {
      made();
      if (apply && academyId) {
        programmeId = (
          await createProgramme(
            db,
            {
              academyId,
              code: p.code,
              name: p.name,
              description: p.description,
              totalSemesters: p.semesters.length,
              entryLevel: p.entryLevel,
              exitLevel: p.exitLevel,
              completionRequirements: p.completionRequirements,
              status: 'active',
            },
            { createSemesters: false },
          )
        ).id;
      }
    }

    for (const s of p.semesters) {
      let semesterId: string | undefined;
      const existingSemester = programmeId
        ? await db.semesters.where('[programmeId+number]').equals([programmeId, s.number]).first()
        : undefined;
      if (existingSemester) {
        tally.reused++;
        semesterId = existingSemester.id;
      } else {
        made();
        if (apply && programmeId) {
          semesterId = (await createSemester(db, { programmeId, number: s.number, title: s.title, description: s.description })).id;
        }
      }

      for (const c of s.courses) {
        let courseId: string | undefined;
        const existingCourse = await db.courses.where('code').equals(c.code).first();
        if (existingCourse) {
          if (!programmeId || existingCourse.programmeId !== programmeId) tally.conflicts.push(`course code ${c.code} is already used by another programme`);
          else if (!semesterId || existingCourse.semesterId !== semesterId) tally.conflicts.push(`course ${c.code} exists in a different semester`);
          tally.reused++;
          courseId = existingCourse.id;
        } else {
          made();
          if (apply && semesterId) {
            courseId = (
              await createCourse(db, {
                semesterId,
                code: c.code,
                title: c.title,
                description: c.description,
                creditHours: c.creditHours,
                difficulty: c.difficulty,
                learningObjectives: c.objectives,
                learningOutcomes: c.outcomes,
                references: c.references,
                status: 'active',
              })
            ).id;
          }
        }
        courseIds.set(c.code, courseId);

        for (const [mi, m] of c.modules.entries()) {
          let moduleId: string | undefined;
          const existingModule = courseId ? await db.modules.where('[courseId+order]').equals([courseId, mi + 1]).first() : undefined;
          if (existingModule) {
            tally.reused++;
            moduleId = existingModule.id;
          } else {
            made();
            if (apply && courseId) moduleId = (await createModule(db, { courseId, order: mi + 1, title: m.title })).id;
          }
          for (const [li, l] of m.lectures.entries()) {
            const existingLecture = moduleId ? await db.lectures.where('[moduleId+order]').equals([moduleId, li + 1]).first() : undefined;
            if (existingLecture) {
              tally.reused++;
              continue;
            }
            made();
            if (apply && moduleId) {
              await createLecture(db, { moduleId, order: li + 1, title: l.title, estimatedMinutes: l.minutes, difficulty: c.difficulty });
            }
          }
        }
      }
    }

    // Prerequisites last, once every course exists (each link is cycle-checked on write).
    for (const s of p.semesters) {
      for (const c of s.courses) {
        for (const pre of c.prerequisites) {
          const from = courseIds.get(c.code);
          const to = courseIds.get(pre.code);
          const existing = from && to ? await db.coursePrerequisites.where('[courseId+prerequisiteCourseId]').equals([from, to]).first() : undefined;
          if (existing) {
            tally.reused++;
            continue;
          }
          made();
          if (apply && from && to) await addPrerequisite(db, from, to, pre.kind);
        }
      }
    }
  }
  return tally;
}

/** Dry run: what would installing this package do? Never writes. */
export async function planInstall(db: QhazeDatabase, pkg: CurriculumPackage): Promise<InstallPlan> {
  const errors = validatePackage(pkg);
  const meta = (await db.meta.get(PACKAGES_META_KEY))?.value as Record<string, InstalledPackageInfo> | undefined;
  const installed = meta?.[pkg.id];
  if (errors.length) return { errors, conflicts: [], toCreate: 0, reused: 0, installed };
  const tally = await walk(db, pkg, false);
  return { errors, conflicts: tally.conflicts, toCreate: tally.created, reused: tally.reused, installed };
}

/**
 * Install a package atomically. Throws `PackageInstallError` (nothing written, no recovery
 * point) when the package is invalid or conflicts with existing data; any error during the
 * write itself rolls back the whole transaction, leaving only the pre-seed recovery point.
 */
export async function installPackage(db: QhazeDatabase, pkg: CurriculumPackage): Promise<InstallResult> {
  const plan = await planInstall(db, pkg);
  if (plan.errors.length || plan.conflicts.length) throw new PackageInstallError([...plan.errors, ...plan.conflicts]);
  if (plan.toCreate === 0) return { created: 0, reused: plan.reused };

  const snapshot = await createSnapshot(db, 'pre-seed');
  const tally = await guardedWrite(db, async () => {
    const result = await walk(db, pkg, true);
    if (result.conflicts.length) throw new PackageInstallError(result.conflicts);
    const meta = ((await db.meta.get(PACKAGES_META_KEY))?.value as Record<string, InstalledPackageInfo> | undefined) ?? {};
    await db.meta.put({
      key: PACKAGES_META_KEY,
      value: { ...meta, [pkg.id]: { version: pkg.version, installedAt: nowIso(), created: result.created } },
    });
    await logActivity(db, 'curriculum.installed', { code: `${pkg.id}@${pkg.version}`, created: result.created });
    return result;
  });
  return { created: tally.created, reused: tally.reused, snapshotId: snapshot.id };
}
