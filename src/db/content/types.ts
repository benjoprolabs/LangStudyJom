import type { GlossaryTerm, LectureSection, LocalizedText } from '../types';

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

export interface ContentPackage {
  id: string;
  version: string;
  title: LocalizedText;
  glossary: GlossaryTermDef[];
  lectures: LectureContentDef[];
}

/** Which pathway a course belongs to, for the Lua/Luau separation rule. */
export function pathwayOf(courseCode: string): 'lua' | 'luau' | 'other' {
  if (courseCode.startsWith('LUAU')) return 'luau';
  if (courseCode.startsWith('LUA')) return 'lua';
  return 'other';
}
