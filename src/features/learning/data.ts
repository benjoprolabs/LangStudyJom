import type { QhazeDatabase } from '@/db/database';
import type { AcademicProgramme, Academy, Course, GlossaryTerm, Lecture, Module, Semester } from '@/db/types';

export interface ModuleWithLectures {
  module: Module;
  lectures: Lecture[];
}

export interface CourseBundle {
  course: Course;
  semester?: Semester;
  programme?: AcademicProgramme;
  academy?: Academy;
  modules: ModuleWithLectures[];
}

export interface LectureBundle extends CourseBundle {
  lecture: Lecture;
  module: Module;
  /** "module.lecture", e.g. "1.1" */
  number: string;
  prev?: Lecture;
  next?: Lecture;
}

export async function loadCourseBundle(db: QhazeDatabase, courseId: string): Promise<CourseBundle | undefined> {
  const course = await db.courses.get(courseId);
  if (!course) return undefined;
  const [semester, programme, modules, lectures] = await Promise.all([
    db.semesters.get(course.semesterId),
    db.programmes.get(course.programmeId),
    db.modules.where('courseId').equals(courseId).sortBy('order'),
    db.lectures.where('courseId').equals(courseId).toArray(),
  ]);
  const academy = programme ? await db.academies.get(programme.academyId) : undefined;
  return {
    course,
    semester,
    programme,
    academy,
    modules: modules.map((module) => ({ module, lectures: lectures.filter((l) => l.moduleId === module.id).sort((a, b) => a.order - b.order) })),
  };
}

export async function loadLectureBundle(db: QhazeDatabase, lectureId: string): Promise<LectureBundle | undefined> {
  const lecture = await db.lectures.get(lectureId);
  if (!lecture) return undefined;
  const bundle = await loadCourseBundle(db, lecture.courseId);
  if (!bundle) return undefined;
  const ordered = bundle.modules.flatMap((m) => m.lectures);
  const index = ordered.findIndex((l) => l.id === lectureId);
  const module = bundle.modules.find((m) => m.module.id === lecture.moduleId)!.module;
  return { ...bundle, lecture, module, number: `${module.order}.${lecture.order}`, prev: ordered[index - 1], next: ordered[index + 1] };
}

export async function loadGlossary(db: QhazeDatabase): Promise<Map<string, GlossaryTerm>> {
  return new Map((await db.glossaryTerms.toArray()).map((g) => [g.key, g]));
}
