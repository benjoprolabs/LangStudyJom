import { L, type CurriculumPackage } from '../types';
import { FACULTIES, FACULTY_01_ACADEMIES } from './faculties';
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

export const CURRICULUM_PACKAGES: CurriculumPackage[] = [UNIVERSITY_CORE_M1];
