# Changelog

## 0.6.0: Module content system — M-1 (course materials 1.8.1, unchanged)

Modules could only show a title and a lecture list: no format, storage, page or export existed for module-level
materials (see MODULE-CONTENT-AUDIT.md). This release builds the feature; it writes no module content.

- **Module content standard:** 11 bilingual sections (overview, learning objectives, prerequisites, detailed core
  theory, complete learning notes, key concepts and principles, terminology, subject-specific examples, practical
  applications, summary, references) with minimum depth per section and discipline-aware examples
  (programming: code; mathematics: worked solutions; design: workflows), derived from the course's faculty.
- **Separate layers, no copying:** the validator flags module paragraphs or list items whose 8-word sequences mostly
  occur in the course's lecture text, and module code that is a lecture example (naming the lecture).
- **Storage:** `Module.sections` and `contentUpdatedAt` on the existing module record — not indexed, so no IndexedDB
  schema change or migration; title and description are kept; backups and restore carry it; course-materials
  updates never touch it.
- **Module Learning Page** (`/module`): the module layer ("Kandungan Modul", or a clear "belum ditulis" empty state)
  and the lecture layer ("Kuliah dalam Modul Ini", each lecture with its status) shown separately; status (Belum
  ditulis / Separa / Perlu pengesahan / Lengkap) with a quality check; previous/next module; responsive; Malay by
  default, English supported.
- **Editor:** the 11 sections in Malay and English, live quality check, drafts allowed, save and reload. Module code
  is labelled "not yet verified by execution" and keeps a module at "Perlu pengesahan", never "Lengkap".
- **Navigation:** Library module titles (with a module-status badge), the Lecture Room breadcrumb and a "Kandungan
  modul" button, and the course outline link to the module page.
- **Exports:** Module PDF and Module .md start with the module materials, then the lectures; course PDF and course
  .md include every module's materials (or "belum ditulis") before its lectures.
- Tests: `module-content.test.ts` (format, validation, duplication, status, saving changes nothing else, backup and
  restore, content updates, Markdown) and `scripts/e2e-modules.mjs` (clean profile with test content only: empty
  state, navigation, copy detection, save/reload/edit, glossary, PDF and Markdown, student data and all 984 lectures
  unchanged, phone and desktop), now part of `npm run test:e2e`.

## 0.5.9: P0 fixes from the content audit (course materials 1.8.1)

- **Bold text with glossary links or inline code now renders correctly** in the Lecture Room, the PDF/print view and
  the Markdown downloads. The shared inline parser treated `**…**` as plain text, so `**[[chunk|Chunk]]:**` was shown
  literally in 12 written lectures (LUA101 2.3, 3.1, 3.2, 3.3, 4.3; LUA102 2.1, 2.3, 3.2; LUA103 2.1, 4.1; LUAU101
  2.2, 4.2), and bold inline code showed literal backticks. Bold text is now parsed for code, glossary links and
  links; terms inside bold are clickable; the Markdown export writes them as bold labels; and the validator now
  checks glossary links inside bold text (all 32 resolve and respect the Lua/Luau separation). No lecture text
  changed.
- **Glossary lecture links:** 11 links in 9 terms (closure, table, metatable, iterator, coroutine, module,
  type-annotation, instance, connection) pointed to lectures not written yet; they now point to the written lectures
  that teach the term. The 3 Roblox terms not taught in any written lecture yet (remote-event, datastore,
  replication) keep their planned lecture, which the glossary panel now shows as "belum ditulis / not written yet"
  instead of a link to an empty page — for any term, automatically. No glossary term removed.
- Course materials 1.8.1 (glossary change). Installing it rewrites the 97 lectures with identical text; student
  progress, notes and bookmarks are stored separately and are not touched.
- The 7 Roblox lectures stay **NEEDS VERIFICATION** (compiled only, not run in Roblox Studio).
- Tests: parser test for nested inline syntax; all 97 lectures × 2 languages export without raw glossary syntax; a
  rule that a glossary term taught in written lectures may not link to an unwritten one (it fails on the old data);
  e2e opens the 12 affected lectures in the Lecture Room and the PDF view and checks the glossary panel. The content
  audit now separates stale links from planned references.

## 0.5.8: Curriculum delivery — clearer package installation (course materials 1.8.0, unchanged)

Found while testing the phone preview: Milestone 1 and 2 install structure only, the lecture content comes from the
separate course-materials package, and the Library opened on the Python programme (no written lectures), so a learner
who installed only the first two packages saw "0/12 lectures with content" everywhere.

- **Library** opens on `LUA-PROG` when it has written lectures (otherwise the first programme with content). When
  courses exist but no lecture content is installed, it shows "Bahan kursus belum dipasang — pasang Bahan Kursus" with a
  button that opens the packages dialog at the course-materials card.
- **Packages dialog:** Milestone 1 and 2 are labelled "Struktur sahaja — tiada kandungan kuliah"; the course-materials
  card is highlighted as the next step once the structure exists.
- **Install all:** one confirmation, then the three packages in dependency order with per-step progress (waiting,
  installing, installed, already installed — skipped, failed) and a success or failure message. Each step re-plans and
  skips packages with nothing to write, uses the same validated transactional installers, and the cards' own install
  buttons are disabled while it runs. No duplicate records or lectures; student records, progress, notes and
  bookmarks are not touched. No schema change.
- **Fix:** every confirm dialog used the same `confirm-title` element id, so with two dialogs on one page a dialog
  could be announced with the other's title. Each dialog now has its own id.
- Tests: `install-all.test.ts` (default programme rule; a second full install leaves students, progress, notes,
  bookmarks and lectures identical, with no duplicate lecture slot) and `scripts/e2e-packages.mjs` (clean profile at
  390px: labels, notice and link, Install all with Cancel, skip and success, 984 lectures / 97 written / 80 terms,
  Library on LUA-PROG, data unchanged after a restart at desktop width), now part of `npm run test:e2e`.

## 0.5.7: Milestone 3 — LUAU104 complete; Luau Semester 1 complete (course materials 1.8.0)

- **Luau Semester 1 checkpoint** ([LUAU-SEMESTER-1-CHECKPOINT.md](LUAU-SEMESTER-1-CHECKPOINT.md)): LUAU101–LUAU104 are
  48/48 with 483 verified code units and no failures. All 48 Lua Semester 1 lectures are unchanged since the Lua
  checkpoint (empty `git diff 57b6135`), and student progress and notes survive the update (e2e integrity check).
  CURRICULUM.md, ROADMAP.md (97 of 612 Lua/Luau lectures written) and README.md updated. Milestone 3 lecture
  content is complete; Milestone 4 has not been started.

- **LUAU104 1.1–4.3 written (12 lectures):** 1-based arrays, `#` and holes, `table.create`; `table.insert`,
  `table.remove`, `table.find` and `table.clear`, removing while iterating (backwards), swap-and-pop and head-index
  queues; `table.sort` (in place, no return value, not stable) with tie-breakers; dictionaries, key identity, sets;
  iteration order and sorted keys; nested tables and safe paths; reference semantics; `table.clone` and deep copies
  with cycle handling; `table.freeze`/`table.isfrozen` and deep freezing; player statistics, validated layered
  configuration, and a 90-minute inventory mini project with stacking, atomic removal, defensive copies and
  `assert` tests. Luau language only; every example is executed with the Luau 0.663 VM.
- Behaviour taught from measurement: `table.insert` past the end and `table.remove(t, nil)` fail silently,
  errors raised inside C library functions (`table.sort`, `table.insert` on a frozen table) carry no line number,
  a clone of a frozen table is not frozen, and freezing twice is an error.
- 6 new Click-to-Learn terms (array, dictionary, reference semantics, shallow copy, deep copy, frozen table) — 80
  in total.
- Verification corrected my predictions: I mis-traced the potion stacking and trade examples in 4.3, and two
  `print(f(), …)` lines dropped the second return value (value adjustment); the outputs and explanations now follow
  the measured results.

## 0.5.6: Milestone 3 — LUAU103 complete (course materials 1.7.0)

- **LUAU103 1.1–4.3 written (12 lectures):** `if`/`elseif` chains, truthiness and guard clauses; numeric `for`,
  `while`, `repeat`, generalized iteration (`for k, v in t`), `break` and Luau's `continue`; function definitions,
  typed parameters and returns, multiple returns, varargs and `select`; closures and upvalues (factories, shared
  versus separate upvalues, loop capture), callbacks, strict `table.sort` comparators, and a pure-Luau signal with
  connect, fire, disconnect and `pcall` isolation. Mini project: a score counter with combos, milestones, input
  validation, capped history and `assert` requirement tests. Every example is executed with the Luau 0.663 VM.
- 5 new Click-to-Learn terms (generalized iteration, continue, guard clause, callback, function type) — 74 in total.
- Verification corrected my predictions: passing `print("…")` as a callback to `table.insert(list, fn)` stores
  nothing and raises no error, so that broken example now stores the `nil` in a record field, where calling it
  fails; and one count in a callback example was wrong (3 even scores, not 2).

## 0.5.5: Milestone 3 — LUAU102 complete (course materials 1.6.0)

- **LUAU102 1.1–4.3 written (12 lectures):** local and global (per-script environments and `_G` in Roblox),
  multiple assignment, Roblox naming conventions, the basic types and Luau number printing, `type()` versus
  `typeof()`, `vector` and `buffer`, arithmetic and `//` (division by zero gives `inf`, not an error),
  comparison and logical operators, compound assignment, backtick interpolation, if-expressions, and
  `string.format` and type conversion. Luau language only: every example is executed with the Luau 0.663 VM.
- Luau-specific behaviour taught from measurement: `%s` rejects `nil`/booleans while `%*` formats anything,
  `%d` truncates fractions, `{{` and empty `{}` in interpolation are syntax errors with Luau's own hints, `t[f()] += 1`
  evaluates `f` once, and `not a > b` compares a boolean.
- 7 new Click-to-Learn terms (compound assignment, string interpolation, if-expression, typeof, vector, buffer,
  naming convention) — 69 in total.
- Verification corrected my predictions: a multi-return call that is not last in `print` is truncated
  (`toRowCol` example), and a fixed-seed shuffle example was changed to a seed that visibly shuffles.

## 0.5.4: Milestone 3 — LUAU101 complete (course materials 1.5.0)

- **LUAU101 1.1–4.3 written (12 lectures):** Lua 5.1 → Luau; what Luau adds and removes (sandbox); the Luau language
  versus the Roblox engine API; the luau CLI; a tour of Roblox Studio; Script, LocalScript and ModuleScript; `print`
  and the Output window; comments, blocks and names; Script Analysis; syntax versus runtime errors; reading stack
  tracebacks; debugging strategies. All 24 sections in Malay and English.
- Every lecture distinguishes three statuses honestly: `luau` examples are **executed** with the official Luau VM
  (0.663) and their output verified; `roblox` examples are **compiled only**; nothing is claimed as tested in Roblox
  Studio. Lint warnings and type errors are described from the Luau documentation, not produced by the verifier.
- 8 new Click-to-Learn terms (luau CLI, Roblox Studio, Output window, script types, Script Analysis, syntax error,
  runtime error, engine API) — 62 in total.
- Verification corrected my predictions: two `return`s in one block is itself a Luau syntax error; Luau adds a
  hint (`did you forget to close 'then' at line 5?`) to unclosed-block messages; an `xpcall` traceback contains the
  calling function's frame, not extra `[C]` frames.
- E2E opens every LUAU101 lecture (24 sections, ≥2 error-matched broken examples each, every compiled-only unit
  labelled, no browser Run for Luau) and completes LUAU101 4.3 with all earlier progress and notes unchanged.

## 0.5.3: Milestone 3 — LUA104 complete; Lua Semester 1 checkpoint (course materials 1.4.0)

- **LUA104 1.1–4.3 written (12 lectures; LUA104 is now 12/12):** function definitions, parameters and `return`;
  functions as first-class values (higher-order functions, `table.sort` comparators, dispatch tables); more or
  fewer arguments than parameters (defaults, the boolean `or` trap, `error(msg, 2)`, options tables); multiple
  return values; the value-adjustment rule (including the `tonumber(s:match(…))` base bug); `table.unpack` and the
  `nil, message` pattern; varargs with `select`; `table.pack` and `n`; designing function APIs (overloading by
  `type`, factories); block scope and `do … end`; `local function` and recursion (tail calls, memoisation, Tower of
  Hanoi); upvalues and closures. All 24 sections in Malay and English; 8 executed examples and 2–3 debug variants
  per lecture (124 code units), each verified by execution with Lua 5.4.8 and reproduced by the browser runner.
- 8 new Click-to-Learn terms (parameter, first-class function, value adjustment, vararg, block, recursion,
  upvalue, higher-order function) — 54 in total.
- **Lua Semester 1 checkpoint:** LUA101–LUA104 = 48/48 lectures, 485 code units (382 executed, 103 debug variants
  error-matched), 0 failures. See [LUA-SEMESTER-1-CHECKPOINT.md](LUA-SEMESTER-1-CHECKPOINT.md).
- E2E now opens every lecture of LUA101–LUA104 in the browser (all 24 sections, all unit statuses verified), runs a
  LUA104 closure example in the browser and completes LUA104 4.3 with earlier progress and notes unchanged.
- **E2E timing fix:** the "progress unchanged" snapshot for the previously completed lecture is now taken after the
  reader has finished recording its last-access time (the strict comparison is unchanged; only `lastAccessedAt` /
  `updatedAt` had been written ~0.8 s after the snapshot).
- Verification corrected my predictions before release: `math.max()` with no arguments reports `(value expected)`;
  a "silent" adjustment bug cannot be a debug variant (it raises no error), so the `tonumber` example uses a base
  that is out of range; one expected output had a tab where two `print` calls produce a newline.
- Tests that assumed LUA104 was unwritten now use LUA111 1.1. LUA101–LUA103, Luau, the schema and student-data code
  are unchanged.

## 0.5.2: Milestone 3 — LUA103 complete (course materials 1.3.0)

- **LUA103 1.1–4.3 written (12 lectures; LUA103 is now 12/12):** `if`/`then`/`end`, `elseif`, the
  `a and b or c` idiom and its `false` trap, `while`, `repeat`–`until` and the scope of its condition, numeric
  `for` (start, limit, step, float steps), `break`, `goto` and labels (the continue pattern, Lua 5.2+), nested
  loops and algorithmic thinking (big-O, set tables), and Project 2 — a number guessing game (requirements and
  pseudocode; `math.random`/`math.randomseed` and input validation; the assembled game with table-driven tests and
  a scripted input reader). All 24 sections in Malay and English; 8–9 executed examples and 2–3 debug variants per
  lecture (122 code units), every one verified by execution with Lua 5.4.8 and reproduced by the browser runner.
- 8 new Click-to-Learn terms (control flow, conditional, loop, infinite loop, goto/label, algorithm, pseudocode,
  pseudo-random) — 46 in total.
- Randomness is taught with fixed seeds (`math.randomseed(7)` etc.), so every random example has a verifiable
  output; the browser (wasmoon, Lua 5.4.6) and reference (Lua 5.4.8) produce identical sequences, confirmed by the
  browser-equivalence test.
- Verification corrected my predictions before release: a numeric string such as `"4"` is accepted as a `for`
  limit (the debug example now uses `"four"`); `for i = 0, 0.3, 0.1` runs 3 times, not 4; unresolved `break`/`goto`
  errors carry the chunk's last line as their position prefix; `tonumber(nil)` returns `nil` rather than raising an
  error. Lectures document the real behaviour.
- The content checker flags the word `continue` as Luau-only syntax, so the Lua lectures name the continue label
  `::next_item::` and explain why.
- Tests that assumed LUA103 was unwritten now use LUA104 1.1. LUA101, LUA102, LUA104, Luau, the schema and
  student-data code are unchanged.

## 0.5.1: Milestone 3 — LUA102 complete (course materials 1.2.0)

- **LUA102 1.2–4.3 written (11 lectures; LUA102 is now 12/12):** multiple assignment, naming and reserved
  words, nil/boolean/truthiness, integer and float subtypes, the other five types, arithmetic, relational and
  logical operators, concatenation/length/precedence, conversion and coercion, and Project 1 (calculator design,
  then the built and tested calculator). All 24 sections in Malay and English; 7–9 executed examples and 2–3
  debug variants per lecture, every one verified by execution with Lua 5.4.8.
- 10 new Click-to-Learn terms (multiple assignment, reserved word, nil, truthiness, number subtypes, userdata,
  operator, operator precedence, short-circuit evaluation, coercion) — 38 in total.
- **Browser runner fix:** `io.stdout` stayed a table inside the in-browser harness, so `type(io.stdout)` would
  have printed `table` instead of `userdata`; output is now captured by wrapping the real file’s methods.
- Found by the browser-equivalence test: wasmoon (Lua 5.4.6) reports integer division-by-zero errors on line 1;
  the two affected debug variants place that error on line 1 so the browser shows the documented result.
- Verification corrected **four** of my predicted results before release (Lua 5.4 says `attempt to divide by
  zero`, `math.modf` returns an integer part, `a >= b` is reported as `number with string`, and a call that is
  last in an argument list keeps all its return values). Lectures document the real behaviour.
- New permanent checks: no lecture defined twice; no code example repeated verbatim anywhere in the materials.
- Tests that assumed LUA102 1.2 was unwritten now use LUA103 1.1. LUA101, the reference lectures, schema,
  curriculum and student-data code are unchanged.

## 0.5.0: Milestone 3 (in progress) — code-example infrastructure and LUA101

**Code examples (Milestone 3, Part A)**
- Every example shows line numbers, its **execution status** and, where the environment supports it, a
  **Run** button: Lua 5.4 compiled to WebAssembly (wasmoon 1.16.0) in a Web Worker, bundled for offline use,
  with a 4-second limit and an output cap. Run compares the actual output with the expected output.
- **Explain this code** opens the example’s line-by-line explanation inline.
- **Error & debugging**: a broken variant of the example, the exact error it produces, how to read and fix it,
  and (for Lua) a button to run the broken version.
- Execution status comes from `src/content/verification.json`, written by `npm run verify:code` and tied to a
  hash of the exact code; an edited example shows "not verified" until it is re-verified, and a test forbids
  shipping stale records. Roblox code is compiled with the Luau compiler (`luau-runner --check`) and labelled
  "NOT run in Roblox Studio". Luau has no browser runner (verified with the official Luau VM only).
- Validator: every example needs a line-by-line explanation; ≥2 verified debug variants per lecture; the Lua
  /Roblox separation check now ignores strings and comments and detects APIs in use.

**Content (Milestone 3, Part B) — course materials 1.1.0**
- **LUA101 complete: 12 lectures** (history and design, embedding, versions, installation, REPL, editors,
  chunks and bytecode, the VM and call stack, syntax, output and escapes, `io.read`, errors and tracebacks).
  Each has all 24 authored sections in Malay and English, 9–11 verified code units, and ≥2 debug variants
  whose errors are reproduced by execution.
- 12 new Click-to-Learn terms (interpreter, embedding, chunk, bytecode, virtual machine, call stack, REPL,
  language server, comment, escape sequence, standard input, stack traceback) — 28 in total.
- The reference lectures LUA102 1.1 and LUAU203 1.1 gain an explanation for every example and debug variants;
  their existing text is unchanged.
- Verification found and corrected **seven** of my own predicted outputs/errors before release (for example,
  Lua 5.4 reports string arithmetic as `attempt to add a 'number' with a 'string'`, `assert` adds the caller’s
  position, and `10 *` followed by a newline is valid syntax). Each lecture now documents the real behaviour.

**Tests**: 388 unit/integration tests, 166 verified code units (`verify:code`), learning e2e 20 checks (new:
LUA101 library status and an `io.read` example run in the browser with its input).

## 0.4.1: Milestone 2 acceptance conditions

- **Reference lectures audited** (LUA102 1.1, LUAU203 1.1). Fixed off-by-one line ranges in the
  `pure-signal` explanation and an unexplained line (`print(describe())`) in `scope-blocks`.
  Course materials **1.0.1** carries the fix; installing it updates devices that have 1.0.0 without
  touching student notes or progress.
- New validator rule: line-by-line explanations must stay inside the code and cover every meaningful line.
- The reader shows **line numbers** in code blocks (not selectable, so they are never copied).
- **Structure-only lectures are explicitly incomplete:**
  - labelled "Belum lengkap · struktur sahaja" (Incomplete · structure only);
  - they cannot be marked complete, and reading them records no progress
    (`IncompleteLectureError`, enforced in the repository as well as the UI).
- ROADMAP: M2 acceptance record and the outstanding-requirements register for Phase 3.
- Tests: 207 unit and integration tests; e2e learning suite still at 19 checks, now asserting the incomplete-lecture rules and line numbers.

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
