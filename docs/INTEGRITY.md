# Data Integrity

All referential rules live in `src/db/integrity.ts` and run through **one engine**
(`checkRowReferences`). The same engine is used for:

| Use | Function | When |
|---|---|---|
| Whole live database | `checkDatabaseIntegrity(db)` | Backup page → "Run check" |
| Incoming backup file | `checkIntegrity(data)` via `validateBackup()` | Before any restore |
| Single record, before writing | `validateReferences(db, table, row)` / `assertValidReferences(...)` | Inside repositories |

## Rule types

1. **Foreign keys** (`RELATIONS`): `table.field` must point at an existing row. Optional
   references are only checked when set. 40 relations are covered (34 in Phase 1, plus 6 in Phase 1.1).
2. **Chain consistency** (`CHAIN_CONSISTENCY`): when a record has several references along
   `lecture → course → semester → programme → academy`, they must describe the same path.
   The most specific reference is trusted first. A field already found contradictory is not
   used to judge others, which avoids cascading false reports.
   - `studySessions`: lectureId, courseId, semesterId, programmeId, academyId
   - `projects`: courseId, academyId
3. **Structural**: missing or duplicate IDs, and self-prerequisites.

Issue kinds: `missing_reference`, `inconsistent_reference`, `missing_id`, `duplicate_id`, `self_prerequisite`.

### Repository rule (mandatory from Phase 2)

Every repository function that creates or updates a record with references **must** call
`assertValidReferences(db, table, row)` before `add`/`put`. It throws `IntegrityError` (with
`issues`) and nothing is written. Dexie hooks cannot do asynchronous lookups, so this guard
lives in the repository layer.

### Backups with broken references

Missing references in a backup file produce a **warning**, not an error. The file can still
be restored and no record is dropped. This follows the rule "never silently delete student
records". Missing or duplicate IDs are fatal errors.

## Status of the broken-data categories (Phase 1 review)

| # | Category | Status |
|---|---|---|
| 1 | `studySessions.academyId` dangling (and sibling `programmeId`) | ✅ Fixed in 1.1, FK + chain consistency |
| 2 | `studySessions.semesterId` dangling | ✅ Fixed in 1.1, FK + chain consistency |
| 3 | `projects.courseId` dangling (and sibling `academyId`) | ✅ Fixed in 1.1, FK + chain consistency |
| 4 | `assessments.exerciseIds[]` → missing exercises | ⛔ **Open: Phase 2 gate** |
| 5 | `progress.entityId` (polymorphic: programme, semester, course, module or lecture) | ⛔ **Open: Phase 2 gate** |
| 6 | `notes.entityId` / `bookmarks.entityId` (polymorphic) | ⛔ **Open: Phase 2 gate** |
| 7 | Course placed in a semester of a different programme (`course.semesterId` ↔ `course.programmeId`) | ⛔ **Open: Phase 2 gate** |
| 8 | Lecture whose `courseId` differs from its module's course | ⛔ **Open: Phase 2 gate** |
| 9 | Prerequisite cycles (A → B → A) | ⛔ **Open: Phase 2 gate** |
| 10 | Semester `number` outside `1..programme.totalSemesters` (found by the review probe; was not in the original list) | ⛔ **Open: Phase 2 gate** |

**Gate:** items 4–10 must be implemented, tested, and passing in the integrity check
**before any curriculum data is seeded in Phase 2**. Planned approach:

- **4:** an array-reference rule type (`field: 'exerciseIds', many: true`). Also reject duplicate IDs within one assessment.
- **5 and 6:** polymorphic rules that map `entityType` to its target table
  (`lecture → lectures`, `course → courses`, …). For notes, `entityType: 'general'` has no target.
- **7:** a curriculum consistency rule: `semesters[course.semesterId].programmeId === course.programmeId`.
- **8:** `modules[lecture.moduleId].courseId === lecture.courseId`.
- **9:** cycle detection over `coursePrerequisites` with a depth-first search that reports the cycle path.
- **10:** a range rule: `1 <= semester.number <= programmes[semester.programmeId].totalSemesters`.
- **Also in Phase 2:** guards for deleting and archiving. Before a faculty, academy, programme,
  semester, course, module or lecture is deleted, find its referencing records. This needs reverse
  indexes such as `studySessions.programmeId` and `studySessions.semesterId`, which are not indexed
  yet and will be added in schema v2 with a tested migration.
