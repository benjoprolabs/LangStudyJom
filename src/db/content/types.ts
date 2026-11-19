import type { GlossaryTerm, LectureSection, LocalizedText, ModuleSection } from '../types';

/**
 * Content package: course MATERIALS for lectures (the 28-section teaching format) and the
 * Click-to-Learn glossary. Lectures are addressed by curriculum position (course code, module
 * order, lecture order), so content installs onto an already-installed curriculum structure.
 * Course materials never contain Practice Center exercises or assessment answers.
 */
export type GlossaryTermDef = Omit<GlossaryTerm, 'id' | 'createdAt' | 'updatedAt' | 'version'>;

export interface LectureContentDef {
  courseCode: string;
  module: number;
  lecture: number;
  sections: LectureSection[];
}

/** A module's own learning materials, addressed by curriculum position like lectures. */
export interface ModuleContentDef {
  courseCode: string;
  module: number;
  sections: ModuleSection[];
}

export interface ContentPackage {
  id: string;
  version: string;
  title: LocalizedText;
  glossary: GlossaryTermDef[];
  lectures: LectureContentDef[];
  /** Module-level materials. Optional: packages without it (all before PY-0) stay valid and unchanged. */
  modules?: ModuleContentDef[];
}

/** Which pathway a course belongs to, for the Lua/Luau separation rule. */
export type Pathway = 'lua' | 'luau' | 'python' | 'other';

export function pathwayOf(courseCode: string): Pathway {
  if (courseCode.startsWith('LUAU')) return 'luau';
  if (courseCode.startsWith('LUA')) return 'lua';
  if (courseCode.startsWith('PY')) return 'python';
  return 'other';
}
