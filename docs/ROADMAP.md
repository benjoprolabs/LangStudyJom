# Development Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Core foundation: app shell, navigation, design system, i18n, student profile, database, persistence, backup and restore | ✅ Complete |
| 1.1 | Data integrity patch: study session and project reference checks, chain consistency, write-time guard, assessment model | ✅ Complete |
| 1.2 | Integrity completion: items 4–10 (assessment–exercise, progress, notes and bookmarks, curriculum consistency, prerequisite cycles, semester range) | ✅ Complete |
| 2.0 | Step 0, safety: schema v2, delete protection, save-time validation, cycle prevention, boot-safety fix, bio input, toast label | ✅ Complete |
| 2 | University management: faculties, academies, programmes, semesters, courses, curriculum database, prerequisites (M1–M3) | ✅ Complete |
| 2-S1 | Curriculum seeding M1: 7 faculties, 15 Faculty 01 academies, 8-semester Python programme ([CURRICULUM.md](CURRICULUM.md)) | ✅ Complete |
| 2-S2 | Curriculum seeding M2: separate Lua (6 sem.) and Luau/Roblox (7 sem.) programmes, plus the Professional Programming Education Standard (template, content packages, glossary, executed code verification, Library, Lecture Room, print/Markdown/ZIP) | ✅ **Accepted** as a curriculum-structure and seeding milestone (not as completion of lecture content). See the acceptance record below |
| 2-S3 | Curriculum seeding M3 | In progress |
| 2-S4+ | Further seeding milestones | Not started (M4 awaits M3 approval) |
| 3 | Learning engine: Course Library, modules, Lecture Room, code explanations, progress, notes and bookmarks | **Partly delivered in 2-S2**: Library, Lecture Room, lecture progress, notes and bookmarks. Still to come: Notes & Bookmarks page, Python content, text highlighting |
| 4 | Download engine: PDF and Markdown export of lectures, modules and courses; source code downloads | **Delivered in 2-S2** (PDF via the browser print dialog) |
| 5 | Practice Center: exercises, coding challenges, quizzes, assignments, examinations, evaluation | Planned |
| 6 | Coding Laboratory: Python (Pyodide), Lua, Luau, editor, console, history | Planned |
| 7 | Student management: study timer, calendar, history, goals, streaks, reminders | Planned |
| 8 | Academic analytics: grading scales, GPA per academy, semester results, reports | Planned |
| 9 | Projects and portfolio | Planned |
| 10 | PWA, offline support, performance, accessibility audit, full testing, documentation | Planned |

## Milestone 2 acceptance record (0.4.0 → 0.4.1)

Accepted by the project owner **as a curriculum-structure and database-seeding milestone**. It is not a
completion of the 612 Lua/Luau lectures' content. Conditions, and how each is met:

| # | Condition | How it is met |
|---|---|---|
| 1 | Accepted as structure and seeding only | Recorded here and in the CHANGELOG. Nothing claims the lecture content is complete |
| 2 | Preserve reference lectures LUA102 1.1 and LUAU203 1.1 | Kept in `src/content/lectures/`. A test fails if either is missing, incomplete or below the standard |
| 3 | Verify both follow the standard | A per-lecture compliance test checks all 24 authored sections, detailed theory (≥80 words per language), ≥5 real code examples, line-by-line explanations covering every meaningful line, debugging, practical work, poor-vs-improved code and ≥4 references. The audit found and fixed **two defects**: off-by-one line ranges in LUAU203 `pure-signal`, and line 14 of LUA102 `scope-blocks` left unexplained. Content release 1.0.1 delivers the fix to installed devices. Full line coverage is now a permanent validator rule |
| 4 | Structure-only lectures labelled incomplete | Library and reader badge "Belum lengkap · struktur sahaja / Incomplete · structure only"; the reader shows an "incomplete learning material" notice; print and Markdown say the content is not written |
| 5 | Structure-only lectures never completed | `completeLecture` and `recordReading` refuse a lecture with no written content (`IncompleteLectureError`). The reader shows no "Mark complete" button and records no progress for them. Covered by unit and e2e tests |
| 6 | Outstanding requirements recorded | The register below |

## Outstanding requirements register (carried into Phase 3)

Status values are literal. "Done" means implemented **and** tested; nothing below is claimed beyond that.

**Phase 3: Lecture Engine and course materials**

| Requirement | Status |
|---|---|
| Full university-style Lecture Engine | **Partial.** The 28-section reader, Library and print view are done. The Notes & Bookmarks page and Python content are not |
| Complete lecture content | **Not done.** Lua/Luau: 2 of 612 lectures written. Python: 0 of 372. Remaining lectures ship in later content packages and stay labelled incomplete until then |
| Code-first teaching | Done for the 2 reference lectures; enforced for all future lectures by the validator (code sections must contain code) |
| Line-by-line code explanations | Done for the 2 reference lectures. The validator now enforces full coverage, and the reader shows line numbers |
| Click-to-Learn glossary | Done: 16 terms with panel, related concepts and lectures, bookmarking. Must grow with each content release |
| Internal and external reference links | **Partial.** External https references and glossary → lecture links are done. Lecture → lecture cross-reference links inside lecture text are not supported yet |
| Blue-accent academic reading design | Done (screen and print) |
| Text highlighting | **Not done** |
| Personal notes and bookmarks | Done in the reader (lecture notes with autosave and export; lecture and glossary bookmarks). A dedicated Notes & Bookmarks page is not done |
| One-click PDF downloads | **Not done.** The PDF is made through the browser print dialog ("Save as PDF") |
| A4 print support | Done |
| Markdown export | Done: lecture, module, course and notes |
| Source code downloads | Done: per example, and ZIP per lecture or course |
| Offline learning materials | **Partial.** Data is local (IndexedDB), downloaded files work offline, and an already-open app keeps working without a network. Starting the app offline (PWA / service worker) is not done; it is planned for Phase 10 |
| Reading progress tracking | Done (percent, position restore, resume last lecture, explicit completion) |
| Bilingual lecture content | Done for the reference lectures; enforced by the validator |
| Separate Practice Center navigation | **Partial.** The reader links to the Practice Center, which is still a planned Phase 5 page |

**Technical commitments (standing)**

- Database schema **version 3** and its migration history (v1 → v2 index-only → v3 `glossaryTerms`) are
  preserved. Future changes append versions only.
- All Python, Lua and Luau curriculum records are preserved. Packages are idempotent and never overwrite records.
- Lua and Luau stay technically separate: separate programmes and course-code prefixes, validator rules
  (no Roblox identifiers or Luau-only syntax in Lua), and tests.
- **Roblox execution limitation:** Roblox API examples are never executed. They are checked statically and labelled "not executed here".
- **No Luau type checking:** Luau examples are executed with the Luau VM, but `luau-analyze` is not run, so type annotations are not verified.

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
