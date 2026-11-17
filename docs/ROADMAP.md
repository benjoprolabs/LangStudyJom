# Development Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Core foundation: app shell, navigation, design system, i18n, student profile, database, persistence, backup and restore | ✅ Complete |
| 2 | University management: faculties, academies, programmes, semesters, courses, curriculum, prerequisites | ⏳ Awaiting approval |
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
