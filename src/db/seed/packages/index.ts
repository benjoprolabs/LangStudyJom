import { L, type CurriculumPackage } from '../types';
import { FACULTIES, FACULTY_01_ACADEMIES } from './faculties';
import { LUA_PROGRAMME } from './lua-programme';
import { LUAU_PROGRAMME } from './luau-programme';
import { PYTHON_PROGRAMME } from './python-programme';

/**
 * Curriculum Seeding — Milestone 1 (approved scope):
 *  - the 7 faculty definitions (no academies or curricula for Faculties 02–07),
 *  - Faculty 01's 15 academies,
 *  - the 8-semester Python Programming programme.
 */
export const UNIVERSITY_CORE_M1: CurriculumPackage = {
  id: 'qhaze-university-core',
  version: '1.0.0',
  title: L('Teras Universiti — Milestone 1', 'University Core — Milestone 1'),
  description: L(
    '7 fakulti universiti, 15 akademi Fakulti 01 (Pengaturcaraan & Kejuruteraan Perisian) dan Program Pengaturcaraan Python 8 semester lengkap dengan kursus, modul dan struktur kuliah.',
    'The 7 university faculties, the 15 academies of Faculty 01 (Programming & Software Engineering) and the 8-semester Python Programming programme with courses, modules and lecture structure.',
  ),
  faculties: FACULTIES,
  academies: FACULTY_01_ACADEMIES,
  programmes: [PYTHON_PROGRAMME],
};

/**
 * Curriculum Seeding — Milestone 2: the Lua and Luau academies' programmes (two separate
 * pathways). Faculty 01 and both academy definitions are included so the package is
 * self-contained; when Milestone 1 is installed they are simply reused.
 */
export const LUA_LUAU_M2: CurriculumPackage = {
  id: 'qhaze-f01-lua-luau',
  version: '1.0.0',
  title: L('Lua & Luau — Milestone 2', 'Lua & Luau — Milestone 2'),
  description: L(
    'Dua laluan berasingan dalam Fakulti 01: Program Pengaturcaraan Lua (Lua standard, 6 semester) dan Program Luau & Pembangunan Roblox (7 semester), lengkap dengan kursus, modul, struktur kuliah dan 18 projek berperingkat.',
    'Two separate pathways in Faculty 01: the Lua Programming Programme (standard Lua, 6 semesters) and the Luau & Roblox Development Programme (7 semesters), with courses, modules, lecture structure and 18 progressive projects.',
  ),
  faculties: FACULTIES.filter((f) => f.code === 'F01'),
  academies: FACULTY_01_ACADEMIES.filter((a) => a.code === 'F01-LUA' || a.code === 'F01-LUAU'),
  programmes: [LUA_PROGRAMME, LUAU_PROGRAMME],
};

export const CURRICULUM_PACKAGES: CurriculumPackage[] = [UNIVERSITY_CORE_M1, LUA_LUAU_M2];
