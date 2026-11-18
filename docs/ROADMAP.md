# Development Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Core foundation: app shell, navigation, design system, i18n, student profile, database, persistence, backup and restore | ✅ Complete |
| 1.1 | Data integrity patch: study session and project reference checks, chain consistency, write-time guard, assessment model | ✅ Complete |
| 1.2 | Integrity completion: items 4–10 (assessment–exercise, progress, notes and bookmarks, curriculum consistency, prerequisite cycles, semester range) | ✅ Complete |
| 2.0 | Step 0, safety: schema v2, delete protection, save-time validation, cycle prevention, boot-safety fix, bio input, toast label | ✅ Complete |
| 2 | University management: faculties, academies, programmes, semesters, courses, curriculum database, prerequisites (M1–M3) | ✅ Complete |
| 2-S1 | Curriculum seeding M1: 7 faculties, 15 Faculty 01 academies, 8-semester Python programme ([CURRICULUM.md](CURRICULUM.md)) | ✅ Complete |
| 2-S2 | Curriculum seeding M2: separate Lua (6 sem.) and Luau/Roblox (7 sem.) programmes, plus the Professional Programming Education Standard: 28-section template, content packages, glossary, executed code verification, Library, Lecture Room, print/PDF/Markdown/ZIP | ✅ Built. **Awaiting approval**. Content: 2 of 612 Lua/Luau lectures fully written |
| 2-S3+ | Further milestones (other academies), plus content releases for the remaining lectures | Not started (awaits M2 approval) |
| 3 | Learning engine: Course Library, modules, Lecture Room, code explanations, progress, notes and bookmarks | **Partly delivered in 2-S2**: Library, Lecture Room, lecture progress, notes and bookmarks. Still to come: Notes & Bookmarks page, Python content, text highlighting |
| 4 | Download engine: PDF and Markdown export of lectures, modules and courses; source code downloads | **Delivered in 2-S2** (PDF via the browser print dialog) |
| 5 | Practice Center: exercises, coding challenges, quizzes, assignments, examinations, evaluation | Planned |
| 6 | Coding Laboratory: Python (Pyodide), Lua, Luau, editor, console, history | Planned |
| 7 | Student management: study timer, calendar, history, goals, streaks, reminders | Planned |
| 8 | Academic analytics: grading scales, GPA per academy, semester results, reports | Planned |
| 9 | Projects and portfolio | Planned |
| 10 | PWA, offline support, performance, accessibility audit, full testing, documentation | Planned |

When a page becomes functional, add its key to `IMPLEMENTED_PAGES` in `src/app/navigation.ts` and its
component to `IMPLEMENTED` in `src/app/routes.tsx`. A startup check fails if the two disagree.

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

## Phase 1.2 test record

- 96 unit and integration tests (63 before, plus 33 new). The new tests cover every rule in items
  4–10 with valid and invalid cases, a complete valid curriculum with zero false positives,
  write-time validation (including cycle checks for new versus existing edges), and restoring a
  backup containing violations without losing any records.
- End-to-end test with 20 checks. It seeds 25 real IndexedDB records forming a complete valid
  curriculum in Chromium (no issues reported), injects 9 violations covering rules 4–10 (all
  shown in the Integrity Check UI), and removes them (clean again, student profile untouched).
- Upgrade check: data created with the 0.1.1 build was byte-identical after opening with 0.1.2.

## Curriculum Seeding M2 test record

- 201 unit and integration tests. They cover the M2 structure and separation rules, content quality
  rules (each defect class has a rejection test), content install (atomic, idempotent, structure
  untouched), reading progress (never auto-complete; the race regression), notes, bookmarks, Markdown
  exports with no Practice data, ZIP CRC and structure, and the highlighter.
- `npm run verify:code`: 20 examples executed and matched (Lua 5.4 and Luau VM), and 10 Roblox examples
  labelled as not executed.
- `scripts/e2e-learning.mjs`, 19 checks in real Chromium:
  - installing M1, M2 and course materials through the UI;
  - Lua/Luau separation in the database and the Library;
  - the 28-section reader with its TOC; code copy and download (the downloaded file is executed with Lua 5.4);
  - the glossary panel and bookmark; Markdown and ZIP downloads;
  - progress, scroll position and notes persisting across a browser restart; explicit completion;
  - a structure-only lecture; Roblox labelling; a 10-page A4 PDF and the course print document;
  - a clean integrity check; a 390px phone layout; offline navigation; zero console errors.

## Phase 2 test record

- Step 0: schema v2 migration, tested in unit tests, against the real 0.1.2 build in Chromium,
  and in a permanent e2e scenario. Delete protection, guarded writes, cycle prevention, and a
  boot-safety regression test that was shown to fail without its fix.
- M1–M3: `scripts/e2e-university.mjs`, 24 checks in real Chromium. Validation messages,
  bilingual display, blocked, cascading and archive-instead deletes, immutable parents, the
  semester range, credit totals, prerequisites with cycle rejection, persistence after a browser
  restart and reload, a clean integrity check, a 390px phone layout, and zero console errors.
