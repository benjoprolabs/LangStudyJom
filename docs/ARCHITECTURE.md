# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 + TypeScript (strict) | Typed, component-based, large ecosystem |
| Build | Vite 8 | Fast dev server; static output with relative paths |
| Styling | Tailwind CSS 3 with CSS-variable design tokens | One token set drives both dark and light themes |
| Icons | lucide-react | Open source, tree-shakeable |
| Routing | React Router (hash router) | Works on any static host and offline. No server rewrites needed |
| Storage | IndexedDB via Dexie 4 + dexie-react-hooks | Local-first, large quota, transactions, versioned schema, live queries |
| Validation | Zod 4 | Validates the structure of backup files |
| Tests | Vitest + fake-indexeddb, Playwright (e2e) | Real IndexedDB semantics in tests, plus a real browser run |

## Folder structure

```
src/
  app/            App root, bootstrap gate, router, navigation config, theme provider
  components/
    layout/       AppShell (header + responsive sidebar), Sidebar
    ui/           Design system: Button, Card, Badge, Field/Input/Select/Textarea,
                  Segmented, ProgressBar, StatCard, PageHeader, EmptyState,
                  ConfirmDialog, Toast
  db/
    types.ts      Domain model (all entities)
    schema.ts     Versioned schema (single source of truth for indexes)
    database.ts   Typed Dexie database class
    client.ts     App-wide database instance
    bootstrap.ts  Safe open: version detection → pre-migration snapshot → upgrade
    integrity.ts  Referential-integrity checker
    backup/       Export, validation, restore, snapshots, backup data migrations
    repositories/ Student, settings, activity log, statistics, university, modules,
                  learning (reading progress, lecture notes, bookmarks)
    seed/         Curriculum (structure) packages: format, validator, planner, installer
    content/      Course-material packages: format, inline syntax, validator, installer
  content/        Course-material data: glossary + fully written lectures (lazy chunk)
  features/       One folder per feature (dashboard, onboarding, profile, settings,
                  backup, university, learning, planned)
  hooks/          useSettings, useStudent, useAutosave
  i18n/           Dictionaries (ms = source, en), translator, provider
  lib/            ids, time, checksum, download, zip (STORE), syntax highlighter
scripts/          End-to-end suites (smoke, university, curriculum, learning)
tools/
  code-verification/  Executes every runnable course example (npm run verify:code)
  luau-runner/        Luau VM runner built from source via mlua (binary not committed)
  curriculum-docs/    Regenerates the tables in docs/CURRICULUM.md (npm run docs:curriculum)
```

Navigation is driven by `src/app/navigation.ts`. Each nav item declares its path, icon, group,
**delivery phase** and the database tables it uses. The router renders the real page for implemented
modules. Every other module gets an honest "built in Phase N" page with no placeholder controls.

## Academic hierarchy

```
Faculty → Academy → AcademicProgramme → Semester → Course → Module → Lecture → LearningMaterial
```

- Each entity has a stable UUID `id` plus `createdAt` and `updatedAt` (ISO 8601).
- Foreign keys are indexed (for example `academies.facultyId` and `courses.semesterId`).
- Each programme sets its own `totalSemesters`. Academies do not share one semester structure.
- Academic text uses `LocalizedText = { ms: string; en?: string }`. Display falls back to Malay.
- Records use `status: draft | active | archived`, so they are archived rather than silently deleted.
- `Lecture.sections` follows the 20-section university lecture template (Part 6 of the brief).
- `StudentProgress` holds explicit completion. Opening a lecture never marks it complete.

Schema v1 already declares every table in the brief: student, settings, faculties, academies,
programmes, semesters, courses, prerequisites, modules, lectures, materials, enrolments, exercises,
attempts, assessments, grading scales, grades, study sessions, progress, projects, tasks, notes,
bookmarks, achievements, plus the system tables `meta`, `activityLog`, `snapshots` and
`snapshotPayloads`. Later phases add data and features, and the existing structure stays as it is.

## University management (Phase 2)

| Layer | Location | Notes |
|---|---|---|
| Write API | `src/db/repositories/university.ts` | `create/update` for faculties, academies, programmes, semesters and courses; `addPrerequisite` / `removePrerequisite`; `setStatus` (archive and restore); `previewDelete` / `deleteCurriculumRecord`. Every write is validated and guarded (see Data safety) |
| Pages | `src/features/university/` | Faculties, Academies (filter `?faculty=`), Programmes (filter `?academy=`), Semester Management (`?programme=`, which also manages courses and prerequisites) |
| Shared UI | `components/ui/Modal`, `LocalizedField`, `LocalizedListField`; `features/university/shared.tsx` | `useRunner` turns `ValidationError` into field messages, `IntegrityError` into a toast, and `ReferencedRecordError` into the delete dialog's blocker list |

Codes are upper-case (`A–Z`, `0–9`, `-`, at most 20 characters) and unique per table. Malay text is
required and English is optional. The UI falls back to Malay when English is missing.

## Curriculum packages (seeding)

| Part | Location |
|---|---|
| Format (codes, not IDs) and authoring helpers | `src/db/seed/types.ts` |
| Data | `src/db/seed/packages/` (`faculties.ts`, `python-programme.ts`, `index.ts`) |
| Validator and counts | `src/db/seed/validate.ts` |
| Dry run, install and idempotency | `src/db/seed/install.ts` |
| Module and lecture writes | `src/db/repositories/modules.ts` |
| UI | `features/university/CurriculumPackages.tsx`. Package data is loaded with dynamic `import()` |

Installed packages are recorded in `meta.curriculumPackages`. See [CURRICULUM.md](CURRICULUM.md) for
the rules, the safety procedure and the generated curriculum tables.

## Course materials and the learning interface (Curriculum Seeding M2)

**Structure and content are separate.** Curriculum packages create lectures with a title, order and duration. Content
packages (`src/db/content`) write `lecture.sections` and `contentVersion` onto *existing* lectures, plus the
`glossaryTerms`. A content package is addressed by course code and module/lecture order, never by ID. It is
validated (`validateContentPackage`), planned (`planContentInstall`: lectures that do not exist yet block
the install) and installed in one `guardedWrite` after a `pre-seed` recovery point. Its record is kept in
`meta.contentPackages`.

| Part | Location |
|---|---|
| 28-section template, block types | `LECTURE_TEMPLATE`, `ContentBlock` in `src/db/types.ts` |
| Inline syntax: `**bold**`, `` `code` ``, `[[term\|label]]`, `[label](https://…)` | `src/db/content/inline.ts` |
| Authoring helpers (P, UL, CODE, EXPLAIN, S, NA …) | `src/db/content/authoring.ts` |
| Data: glossary, pilot lectures | `src/content/` (dynamic import) |
| Reader records | `src/db/repositories/learning.ts`. Progress writes are atomic read-modify-write; reading never completes a lecture |
| Library, Lecture Room, Print | `src/features/learning/` (`LibraryPage`, `LectureRoomPage`, `PrintPage`) |
| Rendering | `ContentRenderer.tsx`: blocks, highlighted code, glossary links (`GlossaryProvider`) |
| Exports | `markdown.ts` (lecture/module/course Markdown, code files) + `lib/zip.ts` |

**Print/PDF.** `/print?lecture=|module=|course=` renders outside the app shell. `@page` sets A4, margins,
page counters and branding; `@media print` forces the light tokens and hides `[data-print-hide]` (toolbars,
navigation, toasts). The PDF comes from the browser's "Save as PDF", with no PDF library and no network.

## Assessment model (approved in Phase 1.1)

| Record | Table | Role |
|---|---|---|
| Exercise | `exercises` | One practical learning activity or question, stored **once** |
| Assessment | `assessments` | A graded container: `quiz`, `assignment`, `examination`, `practical_test` or `project`. It references exercises through `exerciseIds` and never copies them |
| Submission | `exerciseAttempts` | One student attempt at one exercise. `assessmentId` is set when the attempt was made inside an assessment, and absent for free practice |
| Grade | `grades` | The graded result per assessment and/or course |

Quiz, assignment and examination are assessment types, not exercise types. A quiz can hold many
questions (exercises), and an assignment many tasks. The same exercise can appear in practice and in
several assessments without duplication.

## Table inventory (29 tables: 28 from v1, plus `glossaryTerms` in v3)

The brief's 24 suggested entities map onto **22 tables**, because Quiz and Assignment are
`assessments.type` values (an approved design decision). There are **6 supporting tables**:

| Group | Tables |
|---|---|
| Brief entities (22) | students, settings, faculties, academies, programmes, semesters, courses, coursePrerequisites, modules, lectures, learningMaterials, exercises, exerciseAttempts, assessments, studySessions, progress, grades, projects, projectTasks, notes, bookmarks, achievements |
| Course materials (1, v3) | `glossaryTerms` (Click-to-Learn glossary; key-unique, scoped general / lua / luau / roblox) |
| Supporting (6) | `enrollments` (student ↔ programme), `gradingScales` (configurable grading), `meta` (install date, schema version, last backup), `activityLog` (recent activity), `snapshots` + `snapshotPayloads` (recovery points: metadata and body, kept separate so listing stays cheap; never exported) |

**About the "30 tables" figure.** The Phase 1 chat summary said 30 tables. That was a miscount in
the summary, not a change to the database. Git history shows `src/db/schema.ts` was committed once
(Phase 1, `bd25980`) with 28 tables, and every commit since has had the same 28. Schema version 1
has never changed and no table has been removed, renamed or merged. So no migration has happened
and no data was put at risk. The only consolidation, Quiz and Assignment as assessment types, was
in the design from the first commit and was approved in Phase 1.1.

## Database versioning and migrations

`src/db/schema.ts` holds an append-only list of schema versions. To change the schema:

1. Append `{ version: N+1, stores: { <only changed tables> }, upgrade? }`. Never edit a version that has shipped.
2. If rows need transforming, add the same transform to `BACKUP_MIGRATIONS` in `db/backup/migrations.ts`,
   so older backup files can still be restored.
3. Add a test in `src/db/__tests__/migrations.test.ts`.

### Version history

| Version | Release | Change |
|---|---|---|
| 1 | 0.1.0 | Initial 28 tables |
| 2 | 0.1.3 | Index-only, no row transformed. Adds reverse-reference indexes so delete protection can find a record's dependants: `enrollments.currentSemesterId`, `exerciseAttempts.assessmentId`, `assessments.*exerciseIds`, `studySessions.programmeId` / `.semesterId`, and `[entityType+entityId]` on `progress`, `notes` and `bookmarks`. A test enforces that every reference used by delete protection is indexed |
| 3 | 0.4.0 | Adds the `glossaryTerms` table (`id, &key, scope`). No existing row is transformed; a pre-migration recovery point is taken as for every upgrade. Bookmarks gain the `glossary` entity type (integrity rule added) |

### Boot safety: the database never opens itself

`db/client.ts` creates the database with `autoOpen: false`. **Only** `bootstrapDatabase()` may open it,
because opening runs migrations and bootstrap must first take the pre-migration recovery point. Screens
shown before the database is ready (splash, startup errors) use `PreBootI18nProvider`, which reads the
cached language and never queries IndexedDB. Before 0.1.3, the splash screen's settings query could
auto-open and upgrade the database before bootstrap ran. That skipped the recovery point. It was found
in Phase 2 Step 0 browser testing and is now covered by a unit test and an end-to-end test.

At startup, `bootstrapDatabase()` runs these steps:

1. Reads the on-disk version without upgrading it.
2. If the on-disk version is **newer** than the app supports, it stops and shows an error. Data is not touched.
3. If an upgrade is needed, it first dumps the old database into memory.
4. Opens the database. Dexie runs the upgrade in a single version-change transaction, so a failure
   leaves the old database intact. The UI then offers the in-memory dump as an "emergency copy" download.
5. Saves the dump as a `pre-migration` recovery point and logs `database.migrated`.

## Data safety

| Mechanism | Where |
|---|---|
| Automatic saving | Profile uses debounced autosave that also flushes on navigation. Settings save on change |
| JSON export | `exportBackup()`: every table except snapshots, with a SHA-256 checksum, record counts and schema version |
| Import validation | `validateBackup()`: JSON → structure (Zod) → format → version → checksum → migrations → IDs → referential integrity |
| Restore | `replace` (needs the typed word RESTORE / PULIHKAN) or `merge` (newer `updatedAt` wins, nothing deleted). Runs as one transaction |
| Recovery points | Created automatically before every restore and upgrade, or manually. Automatic ones are pruned to the configured retention. Manual ones are never pruned |
| Delete protection | `guards.ts`: `planDelete` / `deleteRecord` block deletion while any record references the target, through foreign-key, array or polymorphic references. Owned children are removed with their parent only if nothing else references them: a programme's empty semesters, and a course's own prerequisite links |
| Guarded writes | `guardedWrite`: every university-management write runs in one transaction that compares the integrity report before and after. Any newly introduced issue rolls back the whole write |
| Integrity check | One rule engine checks foreign keys, array and polymorphic references, curriculum-chain and structural consistency, semester ranges and circular prerequisites. It runs on the live database, on backups, and on single records at write time (`assertValidReferences`). See [INTEGRITY.md](INTEGRITY.md) |
| Persistent storage | `navigator.storage.persist()` is requested from a user action on the Backup page |
| Confirmation | Every destructive action (replace-restore, restoring a recovery point, deleting a recovery point) opens a confirmation dialog |

### Backup file format (v1)

```jsonc
{
  "format": "qhaze-tech-university-backup",
  "formatVersion": 1,
  "appVersion": "0.1.0",
  "schemaVersion": 1,
  "exportedAt": "2026-11-17T10:00:00.000Z",
  "recordCounts": { "students": 1, "...": 0 },
  "checksum": "<sha256 of JSON.stringify(data)>",
  "data": { "<table>": [ { ...row } ] }
}
```

## Internationalisation (i18n)

- `src/i18n/locales/ms.ts` is the source dictionary. `en.ts` is typed as `Messages`, so a missing or
  extra key fails type-checking. `i18n.test.ts` also checks key parity, non-empty strings and matching `{placeholders}`.
- Components never hardcode text. They call `t('dotted.key', vars)`, and keys are type-checked.
  `tList()` returns string lists, and `l(localizedText)` returns bilingual content.
- The language is stored in the IndexedDB `settings` row, which is the source of truth, and mirrored to
  `localStorage` so the first paint already uses the right language.
- To add a language: add a dictionary typed as `Messages`, then register it in `dictionaries`,
  `INTL_LOCALES` and `SUPPORTED_LANGUAGES`.

## Design system

The tokens live in `src/styles/index.css` as RGB triplets, so Tailwind can apply opacity
(`bg-primary/15`). The base tokens give the light theme, and `.dark` switches to the purple (#8B5CF6) and
cyan (#22D3EE) dark theme. The theme is stored in settings (dark, light or system), and an inline
script applies the cached theme before React loads to avoid a flash. The layout is responsive: a fixed
sidebar from 1024px wide, and a drawer below that. It is checked for no horizontal overflow at 390px.

## Known limitations

Curriculum Seeding M2:

- **Content coverage.** Only 2 of 612 Lua/Luau lectures have full 28-section content. The other 610 are
  structure-only and labelled so; no Python lecture has content yet.
- **Text highlighting** in the reader (Part I) is not implemented. Bookmarks, notes and the glossary are.
- **Roblox examples** are checked statically, never executed. **Luau** examples are executed but not
  type-checked (`luau-analyze` is not run).
- **PDF** is produced by the browser's print dialog ("Save as PDF"). There is no one-click PDF file download.
- The Lecture Room's practice link opens the Practice Center, which is still the Phase 5 planned page.

Phase 1:

- Data lives in one browser profile. Cloud sync is intentionally out of scope and can be added later as an option.
- Recovery points are stored in the same IndexedDB. They protect against bad restores and upgrades, but
  not against the browser clearing site data. Exported files are the real off-device backup.
- `npm audit` reports one dev-only advisory (picomatch, via Vitest). It does not reach the shipped app.
  The production dependencies have 0 known vulnerabilities.
