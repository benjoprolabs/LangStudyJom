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
    repositories/ Student, settings, activity log, statistics
  features/       One folder per feature (dashboard, onboarding, profile, settings,
                  backup, planned)
  hooks/          useSettings, useStudent, useAutosave
  i18n/           Dictionaries (ms = source, en), translator, provider
  lib/            ids, time, checksum, download helpers
scripts/e2e-smoke.mjs   End-to-end test
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

## Database versioning and migrations

`src/db/schema.ts` holds an append-only list of schema versions. To change the schema:

1. Append `{ version: N+1, stores: { <only changed tables> }, upgrade? }`. Never edit a version that has shipped.
2. If rows need transforming, add the same transform to `BACKUP_MIGRATIONS` in `db/backup/migrations.ts`,
   so older backup files can still be restored.
3. Add a test in `src/db/__tests__/migrations.test.ts`.

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
| Integrity check | `checkIntegrity()` checks every foreign-key relation, duplicate IDs and self-prerequisites |
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

## Known limitations (Phase 1)

- Data lives in one browser profile. Cloud sync is intentionally out of scope and can be added later as an option.
- Recovery points are stored in the same IndexedDB. They protect against bad restores and upgrades, but
  not against the browser clearing site data. Exported files are the real off-device backup.
- `npm audit` reports one dev-only advisory (picomatch, via Vitest). It does not reach the shipped app.
  The production dependencies have 0 known vulnerabilities.
