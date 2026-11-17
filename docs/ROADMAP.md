# Development Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Core foundation: app shell, navigation, design system, i18n, student profile, database, persistence, backup and restore | ✅ Complete |
| 1.1 | Data integrity patch: study session and project reference checks, chain consistency, write-time guard, assessment model | ✅ Complete |
| 2 | University management: faculties, academies, programmes, semesters, courses, curriculum, prerequisites. **Gate:** close integrity items 4–10 in [INTEGRITY.md](INTEGRITY.md) before seeding curriculum data | ⏳ Awaiting approval |
| 3 | Learning engine: Course Library, modules, Lecture Room, code explanations, progress, notes and bookmarks | Planned |
| 4 | Download engine: PDF and Markdown export of lectures, modules and courses; source code downloads | Planned |
| 5 | Practice Center: exercises, coding challenges, quizzes, assignments, examinations, evaluation | Planned |
| 6 | Coding Laboratory: Python (Pyodide), Lua, Luau, editor, console, history | Planned |
| 7 | Student management: study timer, calendar, history, goals, streaks, reminders | Planned |
| 8 | Academic analytics: grading scales, GPA per academy, semester results, reports | Planned |
| 9 | Projects and portfolio | Planned |
| 10 | PWA, offline support, performance, accessibility audit, full testing, documentation | Planned |

When a phase is delivered, raise `CURRENT_PHASE` in `src/app/navigation.ts` and register the new pages
in `IMPLEMENTED` in `src/app/routes.tsx`.

## Phase 1 test record

- 36 unit and integration tests (Vitest + fake-indexeddb). They cover the schema, bootstrap,
  persistence across reopen, refusing a newer database, student validation and immutability, settings
  validation, backup round-trip, rejection of tampered, foreign, newer or duplicate files, replace and
  merge restore, atomic failure, recovery points and pruning, a real v1→v2 migration with a
  pre-migration snapshot, the integrity checker, streaks, and i18n parity and placeholders.
- End-to-end test in real Chromium with 16 checks. It covers onboarding in Malay, validation,
  persistence across a full browser restart, language and theme persistence, autosave (including
  flush on navigation), settings validation, planned-module pages, export, typed-confirmation
  restore, checksum rejection, recovery points, the integrity check, the mobile drawer with no
  overflow at 390px, restoring from onboarding on a fresh device, and zero console errors.

## Phase 1.1 test record

- 63 unit and integration tests: the 36 from Phase 1 plus 27 new ones. The new tests cover a dangling
  reference for each study-session and project curriculum field, chain-consistency mismatches
  (semester, programme, academy and lecture), partial chains, de-duplicated reporting,
  write-time validation and the `IntegrityError` guard (no write on failure), live-data
  re-validation after a delete, the assessment model without duplicated exercises, and
  restoring a backup with broken references without losing records.
- End-to-end test with 17 checks. The new check injects an orphaned study session in real Chromium
  and confirms the Integrity Check UI reports both broken references, then passes again once the
  session is removed.
- Upgrade check: data created by the Phase 1 build (0.1.0) and opened with the 0.1.1 build was
  byte-identical in every table. No schema migration was needed, the recovery points were kept,
  and a 0.1.0 backup file still validates.
