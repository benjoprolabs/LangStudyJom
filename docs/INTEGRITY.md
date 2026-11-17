# Data Integrity

All referential rules live in `src/db/integrity.ts` and run through **one engine**
(`checkRowReferences`, plus `findPrerequisiteCycles` for the graph rule). The same engine is used for:

| Use | Function | When |
|---|---|---|
| Whole live database | `checkDatabaseIntegrity(db)` | Backup page → "Run check" |
| Incoming backup file | `checkIntegrity(data)` via `validateBackup()` | Before any restore |
| Single record, before writing | `validateReferences(db, table, row)` / `assertValidReferences(...)` | Inside repositories |

## Rule catalogue

| Rule type | Definition | Coverage |
|---|---|---|
| Foreign key | `RELATIONS`: `table.field` must exist in `target`. Optional references are checked only when set | 40 relations |
| Array reference | `ARRAY_RELATIONS`: every ID in a list must exist, and appear only once | `assessments.exerciseIds → exercises` |
| Polymorphic reference | `POLYMORPHIC_RELATIONS`: `entityType` selects the target table for `entityId` | `progress`, `notes`, `bookmarks` |
| Chain consistency | `CHAIN_CONSISTENCY`: references along lecture → course → semester → programme → academy must describe one path | `studySessions`, `projects` |
| Record rules | `checkRecordRules` | Course ↔ semester ↔ programme; lecture ↔ module ↔ course; semester number range; a submission belongs to its assessment; self-prerequisite |
| Graph rule | `findPrerequisiteCycles`: depth-first search over `coursePrerequisites` that reports each distinct cycle once, with its path | `coursePrerequisites` |
| Structural | Missing or duplicate primary key | All tables |

Polymorphic targets:

| Table | `entityType` → table |
|---|---|
| `progress` | programme → programmes, semester → semesters, course → courses, module → modules, lecture → lectures |
| `notes` | academy → academies, course → courses, lecture → lectures, general → *(no link allowed)* |
| `bookmarks` | lecture → lectures, course → courses, material → learningMaterials, exercise → exercises |

An ID that exists in a *different* table is still a broken reference. For example, a progress
record with `entityType: 'lecture'` that points at a course ID is reported.

### Issue kinds

| Kind | Meaning |
|---|---|
| `missing_reference` | The referenced record does not exist, or a required reference is empty |
| `inconsistent_reference` | References contradict each other, or a link is present where none is allowed |
| `duplicate_reference` | The same ID appears twice in a reference list |
| `invalid_reference_type` | `entityType` is not a known type for that table |
| `out_of_range` | A value is outside its allowed range (semester number) |
| `circular_prerequisite` | Courses require each other in a loop (A → B → … → A) |
| `self_prerequisite` | A course requires itself |
| `missing_id` / `duplicate_id` | The primary key is missing or repeated |

A field already found contradictory is not trusted to judge other fields, which avoids cascading
false reports. For a cycle check at write time, `validateReferences` loads the whole prerequisite
graph and reports only the cycles that the new or changed edge would create. Re-validating an
existing edge does not count it twice.

### Repository rule (mandatory from Phase 2)

Every repository function that creates or updates a record with references **must** call
`assertValidReferences(db, table, row)` before `add`/`put`. It throws `IntegrityError` (with
`issues`) and nothing is written. Dexie hooks cannot do asynchronous lookups, so this guard
lives in the repository layer.

### Backups with broken references

Reference and consistency problems in a backup file produce a **warning**, not an error. The file
can still be restored and no record is dropped, following the rule "never silently delete student
records". Missing or duplicate primary keys are fatal errors.

## Status of the broken-data categories (Phase 1 review)

| # | Category | Status |
|---|---|---|
| 1 | `studySessions.academyId` dangling (and sibling `programmeId`) | ✅ 0.1.1 |
| 2 | `studySessions.semesterId` dangling | ✅ 0.1.1 |
| 3 | `projects.courseId` dangling (and sibling `academyId`) | ✅ 0.1.1 |
| 4 | `assessments.exerciseIds[]` → missing exercises; duplicates in the list; a submission for an exercise outside its assessment | ✅ 0.1.2 |
| 5 | `progress.entityId` (polymorphic) | ✅ 0.1.2 |
| 6 | `notes.entityId` / `bookmarks.entityId` (polymorphic) | ✅ 0.1.2 |
| 7 | Course in a semester of a different programme | ✅ 0.1.2 |
| 8 | Lecture whose `courseId` differs from its module's course | ✅ 0.1.2 |
| 9 | Circular prerequisites (A → B → A, and longer cycles) | ✅ 0.1.2 |
| 10 | Semester `number` outside `1..programme.totalSemesters` | ✅ 0.1.2 |

**The Phase 2 seeding gate is satisfied.** All 10 categories are detected by the live-database
check, by backup validation and by the write-time guard. They are covered by automated tests,
including a run against real IndexedDB records in Chromium (see `scripts/e2e-smoke.mjs`).

## Still to do in Phase 2 (not integrity gaps in existing data)

- **Delete and archive guards.** Before a faculty, academy, programme, semester, course, module,
  lecture or exercise is deleted, find the records that reference it, and block the delete or
  require archiving instead. Today, deleting a referenced record is *detected afterwards* by the
  integrity check. Phase 2 will *prevent* it.
- **Reverse indexes** for those lookups, for example `studySessions.programmeId`,
  `studySessions.semesterId` and `enrollments.currentSemesterId`. This is schema v2 with a tested
  migration and a pre-migration recovery point.
- **Wire `assertValidReferences`** into every new Phase 2 repository.
