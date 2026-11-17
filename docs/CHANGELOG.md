# Changelog

## 0.1.3: Phase 2 Step 0, database and application safety

- **Schema v2** (index-only migration): reverse-reference indexes for delete protection.
  Tested v1 → v2 with a pre-migration recovery point, both in unit tests and in a real browser
  against the actual 0.1.2 build.
- **Delete protection**: referenced records cannot be deleted. Owned children (empty semesters, a
  course's own prerequisite links) are removed with their parent.
- **Save-time validation** for every university-management write: field validation, unique codes,
  reference, consistency and cycle checks, plus a transaction guard that rolls back any write
  introducing a new integrity issue. Parent links are immutable where dependants rely on them.
- **Prerequisite cycles** are rejected before saving.
- **Bug fix (data safety)**: the splash screen's settings query could auto-open the database
  before bootstrap, so the migration ran *without* its pre-migration recovery point. The database
  now has `autoOpen: false`, and pre-boot screens never query it. Covered by unit and e2e regression
  tests; the e2e test was shown to fail without the fix.
- Student Profile: **bio** input added.
- i18n: the pop-up close button is labelled via `common.close` (was a hard-coded "×").

## 0.1.2: Phase 1.2 integrity completion

- Integrity items 4–10 closed (see `docs/INTEGRITY.md`):
  - Assessment → exercise array references: missing IDs, duplicate IDs in a list, and
    submissions for an exercise that is not part of their assessment.
  - Polymorphic references for `progress`, `notes` (general notes must not link) and `bookmarks`,
    with an unknown `entityType` reported.
  - Course ↔ semester ↔ programme consistency, and lecture ↔ module ↔ course consistency.
  - Circular prerequisite detection, with each distinct cycle reported once with its path.
    At write time, only cycles created by the new edge are reported.
  - Semester number must be a whole number in `1..programme.totalSemesters`.
- New issue kinds: `duplicate_reference`, `invalid_reference_type`, `out_of_range`, `circular_prerequisite`.
- No schema change and no migration. Data from 0.1.0 and 0.1.1 opens unchanged.
- Tests: 33 new unit and integration tests (96 in total). End-to-end tests now seed a valid
  25-record curriculum into real browser IndexedDB, confirm there are no false positives, then
  inject and detect one violation per rule.
- Docs: table inventory and an explanation of the "30 vs 28 tables" figure, in `docs/ARCHITECTURE.md`.

> Correction: the Phase 1 summary reported "30 tables". The schema has always had **28** tables
> (git history confirms it). Nothing was removed or migrated.

## 0.1.1: Phase 1.1 data integrity patch

- Integrity: foreign-key checks for `studySessions.academyId`, `.programmeId` and `.semesterId`,
  `projects.academyId` and `.courseId`, and `exerciseAttempts.assessmentId`.
- Integrity: relationship-consistency checks along the curriculum chain for study sessions and
  projects, with no cascading false reports.
- Integrity: write-time guard `validateReferences` / `assertValidReferences` / `IntegrityError` for repositories.
- Assessment model: quiz, assignment and examination are assessment types. Exercises are referenced,
  never duplicated. Submissions (`exerciseAttempts`) can carry `assessmentId`. These are type-only
  changes; no schema change or migration.
- Remaining integrity items 4–10 are documented in `docs/INTEGRITY.md` as a gate before Phase 2 seeding.
- Tests: 27 new unit and integration tests and 1 new end-to-end check.

## 0.1.0: Phase 1 core foundation

- App shell, navigation, design system, bilingual i18n, student profile, settings, dashboard.
- Versioned IndexedDB schema (28 tables), safe bootstrap, backup and restore, recovery points, integrity checker.
