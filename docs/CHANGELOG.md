# Changelog

## 0.4.0: Curriculum Seeding, Milestone 2 (Lua & Luau) and the Professional Programming Education Standard

**Curriculum (package `qhaze-f01-lua-luau` v1.0.0)**
- Two separate programmes in Faculty 01:
  - **LUA-PROG**: standard Lua 5.4, 6 semesters, 24 courses, 82 credits.
  - **LUAU-PROG**: Luau & Roblox, 7 semesters, 27 courses, 93 credits.
  - Together: 204 modules, 612 lectures, 75 prerequisite links, and 8 + 10 progressive projects (Part E).
- Faculty 01 and both academies are reused when Milestone 1 is installed: 957 new records and 3 reused.
  No Python record is changed.
- Separation is enforced by tests:
  - no Roblox API anywhere in the Lua programme;
  - Luau Semester 1 is language-only;
  - every Roblox-API course carries an explicit marker.

**Course materials (new content-package system, `src/db/content`, `src/content`)**
- A 28-section lecture template. Sections 1–4 are generated from curriculum metadata; sections 5–28 are authored.
- Content packages are validated (completeness, order, bilingual text, glossary links, Lua/Luau/Roblox
  separation, expected output, https references), dry-run planned, and installed atomically with a recovery point.
- **Schema v3**: a `glossaryTerms` table (index-only migration with a pre-migration recovery point).
  Glossary bookmarks are covered by the integrity rules.
- Release 1 (`qhaze-f01-lua-luau-content` v1.0.0) contains **2 fully written pilot lectures** (LUA102 1.1, LUAU203 1.1)
  and **16 Click-to-Learn glossary terms**. The other 610 Lua/Luau lectures are structure-only, and the UI says so.
- `npm run verify:code` **executes** every runnable example: Lua 5.4 via `lupa`, Luau via `tools/luau-runner`.
  Output must match exactly; results are in `docs/CODE-VERIFICATION.md`. Roblox examples are labelled and never executed.

**Learning interface (Course Library and Lecture Room are now implemented)**
- **Course Library**:
  - programme selector, semester → course → module → lecture tree;
  - "full content" / "structure only" badges;
  - searchable glossary;
  - per course and per module: Markdown, PDF/print, and source-code ZIP downloads.
- **Lecture Room**:
  - reading progress bar and a 28-entry table of contents (collapsible on phones);
  - code blocks with syntax highlighting, runtime badge, copy, file download and expected output;
  - glossary panel with related concepts and lectures, external-link indicator and bookmarking;
  - lecture bookmark and an explicit "Mark complete" (reading never completes a lecture);
  - autosaved personal notes with Markdown export;
  - previous/next navigation and a separate link to the Practice Center.
  - Reading position is restored after a restart, and the Lecture Room resumes the last-read lecture.
- **Print / PDF** (`/print?lecture|module|course=`):
  - A4 page size, page numbers, branding and a version line;
  - always printed with the light palette; navigation and toasts hidden; long code lines wrap.
  - The PDF is produced with the browser's "Save as PDF", fully offline.
- Markdown exports contain course materials only. Practice Center data cannot appear in them, and a test proves it.

**Fixes found while testing**
- Package dialog: a package's dry run was stale after another package was installed (it showed 0 reused). Every card now re-plans after any install.
- Progress writes are atomic read-modify-write transactions. Before, a reading save that landed just after
  "Mark complete" could overwrite the completion (lost update). The regression test fails without the fix.
- Reading position: opening a lecture recorded the top of the page before the saved position was restored,
  overwriting it. Also, "no progress yet" was confused with "still loading".

**Tests**: 201 unit and integration tests (13 new for the reader and exports, plus the content tests),
31 code-verification tests, and a new e2e suite `scripts/e2e-learning.mjs` with 19 checks. Existing e2e
suites were updated for schema v3 and the now-implemented Library.

## 0.3.0: Curriculum Seeding, Milestone 1

- **Curriculum package system** (`src/db/seed/`): a code-referenced package format, a quality and
  structure validator, a dry-run planner with conflict detection, and an atomic, idempotent installer
  with a "Before curriculum install" recovery point. There is a **Curriculum packages** dialog on
  My Faculties.
- **Package `qhaze-university-core` v1.0.0**:
  - the 7 faculties of the specification
  - the 15 Faculty 01 academies (Lua and Luau separate)
  - the 8-semester Python Programming programme: 31 courses, 124 modules, 372 lectures, 107 credit
    hours and 44 prerequisite links, all bilingual. See `docs/CURRICULUM.md`.
- Validated module and lecture writes (`repositories/modules.ts`). A lecture's course is always
  derived from its module.
- Courses gain **expected learning outcomes**, separate from objectives (optional field, no migration).
- A course's own modules, lectures and materials are owned children for delete planning. Student
  progress, notes and bookmarks still block a delete.
- `guardedWrite` is nesting-aware: one integrity comparison for a whole bulk install.
- UI: the course form shows the module and lecture structure; course rows show module and lecture
  counts; prerequisite codes are sorted (they were in random ID order).
- Fix (installer dry run): conflicts were not reported when the parent record was new.
- Curriculum data loads on demand as a separate chunk, not in the main bundle.
- Tests: 31 new unit and integration tests (154 in total); new e2e suite with 14 checks.

> Correction: an earlier report referred to "9 faculties". The master specification defines
> **exactly 7** faculties, and the package and its tests follow the specification.

## 0.2.0: Phase 2 University Management (structure; no curriculum seeded)

- **M1 Faculties and Academies**: live lists, bilingual create and edit forms (Malay required,
  English optional), archive and restore, filter by faculty, and delete with a dry run that shows
  blocking records and offers "archive instead".
- **M2 Academic Programmes**: each programme sets its own semester count (semesters 1..N are
  created automatically), entry and exit levels, and bilingual completion requirements. The
  academy is locked after creation. The semester count can grow but cannot drop below existing
  semesters.
- **M3 Semesters, Courses and Prerequisites** (`/semesters`): the curriculum of one programme.
  Semesters (next free number suggested, range and uniqueness enforced), courses inside semesters
  (code, bilingual title and description, credit hours, difficulty, bilingual learning
  objectives, references), credit totals, moving a course within its programme, and a
  prerequisite manager (also across programmes) that rejects cycles before saving.
- The curriculum database is the existing versioned IndexedDB tables, written only through the
  validated repositories in `src/db/repositories/university.ts`. No curriculum data is seeded.
- UI fixes: "archive instead" dialog did not close; `Card` ignored padding overrides; at most 3
  toasts visible.
- Tests: 123 unit and integration tests; end-to-end suites with 22 + 24 checks.

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
