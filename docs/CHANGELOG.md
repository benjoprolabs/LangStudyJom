# Changelog

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
