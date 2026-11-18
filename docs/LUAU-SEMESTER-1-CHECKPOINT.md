# Luau Semester 1 — completion checkpoint

**Status:** complete · **Course materials:** 1.8.0 · **App:** 0.5.7 · **Date:** 2026-11-18

This checkpoint records that Semester 1 of the Luau & Roblox Development Programme (`LUAU-PROG`) is fully written
and verified. With the [Lua Semester 1 checkpoint](LUA-SEMESTER-1-CHECKPOINT.md), the lecture content of
Milestone 3 (Lua and Luau Semester 1, 96 lectures) is complete. Milestone 4 has not been started and waits for
approval.

## Scope

| Course | Title | Lectures | Code units | Executed | Debug variants (error matched) | Roblox, compiled only | Failures |
|---|---|---|---|---|---|---|---|
| LUAU101 | Introduction to Luau and the Development Environment | 12/12 | 123 | 84 | 25 | 14 | 0 |
| LUAU102 | Luau Syntax: Variables, Types and Operators | 12/12 | 120 | 96 | 24 | 0 | 0 |
| LUAU103 | Control Flow and Functions in Luau | 12/12 | 120 | 96 | 24 | 0 | 0 |
| LUAU104 | Tables in Luau | 12/12 | 120 | 96 | 24 | 0 | 0 |
| **Total** | | **48/48** | **483** | **372** | **97** | **14** | **0** |

Glossary: 80 Click-to-Learn terms in total; Luau Semester 1 added 26 (LUAU101 8, LUAU102 7, LUAU103 5,
LUAU104 6). Every glossary example is verified the same way as lecture code.

LUAU101 is the only course with Roblox code, because it introduces Roblox Studio, script types and the Output
window. LUAU102–LUAU104 teach the Luau language only, as the curriculum specifies, so every example in them is
executed.

## Three statuses, never mixed

Every code unit shows exactly one of these statuses in the Code Demonstration interface:

| Status | Meaning | How it is produced |
|---|---|---|
| **Executed** | The example was run with the official Luau VM and printed exactly its documented output | `npm run verify:code` runs it with Luau 0.663 (`tools/luau-runner`, mlua) |
| **Error matched** | A deliberately broken example failed with exactly its documented first error line | The same runner; the first line of the error must match |
| **Compiled only** | Roblox code was accepted by the Luau compiler. It was **not run**, and not tested in Roblox Studio | The runner's `--check` mode. The reader labels each unit "Sintaks disahkan oleh pengkompil Luau · TIDAK dijalankan dalam Roblox Studio" |

No example is described as tested in Roblox Studio, because none was. There is no browser Run button for Luau:
the browser runtime is Lua 5.4, and running Luau there would be a different language.

## What "verified" means here

Every lecture meets the Professional Programming Education Standard, checked for each lecture by
`src/db/__tests__/content.test.ts` and the package validator:

- all 24 authored sections, in order, in Bahasa Melayu and English;
- detailed theory of at least 80 words per language; debugging prose of at least 40 words;
- at least 5 code blocks, at least 2 debug variants (broken examples) whose errors are verified, and at least 2
  line-by-line explanations;
- every meaningful line of every example covered by an explanation (validator rule);
- a poor-versus-improved comparison with code, a practical demonstration, a mini project and at least 4 references;
- no code example repeated verbatim anywhere in the materials;
- no Roblox API in any unit marked as executed Luau, and Roblox glossary terms only with Roblox examples.

Real-browser check: `scripts/e2e-learning.mjs` (Playwright, Chromium) opens all 48 Luau lectures. It checks 24
rendered sections and a valid status on each of the 483 units, at least 2 error-matched units per lecture, a
compiled-only label on every compiled unit, and no Run button. It then completes LUAU104 4.3, checks that all
earlier progress and notes are unchanged. The Library check confirms that each of LUAU101–LUAU104 shows
"12/12 kuliah berkandungan" with no lecture labelled structure only.

## Measured, not predicted

Error messages and outputs in the lectures were measured with the runner before they were written down. Where my
first prediction was wrong, the lecture follows the measurement, and the CHANGELOG lists the corrections. Examples:

- Two `return`s in one block is a Luau syntax error.
- `1 // 0` is `inf`, not an error.
- `%s` in `string.format` rejects `nil`, while `%*` formats anything.
- `table.insert(t, nil)` silently stores nothing.
- Errors raised inside C library functions (`table.sort`, `table.insert` on a frozen table) have no line number.
- A clone of a frozen table is not frozen.
- A multi-value call that is not the last argument to `print` keeps only its first value.

## Test results at this checkpoint

| Check | Result |
|---|---|
| `npx tsc -b` | passes |
| `npx vitest run` | 854/854 tests pass (18 files) |
| `npm run verify:code` | 1,055 records: 824 executed, 201 error matched, 30 compiled (Roblox, not run); 0 failed |
| `npm run build` | succeeds |
| `npm run test:e2e` | smoke 22, university 24, curriculum 14, learning 25 — 85/85 checks pass |
| `npm run docs:curriculum` | regenerated; the content status lists all 97 written lectures |

## Lua Semester 1 is unchanged

`git diff 57b6135 HEAD` (the Lua Semester 1 checkpoint commit) is empty for the following paths:

- `src/content/lectures/lua101` to `lua104` and `lua102-1-1.ts`;
- `src/content/glossary-lua10*.ts`;
- `src/db/schema.ts`, `src/db/database.ts`, `src/db/repositories` and `src/features`.

The Lua records in `verification.json` are identical: no line was removed in any of the four Luau commits.

## Data safety

Writing Luau Semester 1 changed only course-material files, the e2e expectations, version numbers and
documentation. Student records, learner progress, notes, the database schema and the curriculum structure were
not modified.

The e2e suite installs materials 1.8.0 over existing data. It then checks that:

- the integrity check is clean (progress, notes and glossary bookmarks are all valid);
- the student record is unchanged;
- progress and notes made earlier in the run survive completing new lectures.

## Known limitations

- **No Luau type checking.** `luau-analyze` is not run. Type annotations in the examples are executed by the VM
  (which ignores them) but are not type-checked. Statements about what Studio's Script Analysis would report are
  described from the Luau documentation, not produced by the verifier.
- **Roblox code is compiled only.** The 14 Roblox units in LUAU101 (and the Roblox glossary examples) are
  syntax-checked, not executed, and nothing was tested in Roblox Studio.
- **Output formatting.** The runner's `print` separates values with tabs; Roblox's Output window uses spaces. The
  lectures say this; the documented outputs follow the runner.
- **Iteration order.** Dictionary output in examples always goes through sorted keys, because Luau does not
  specify iteration order. Lectures teach this explicitly (LUAU104 2.2).
- Answers to knowledge checks and graded exercises belong to the Practice Center, not to the lecture materials.

## Next (requires approval)

- Milestone 4.
- Semester 2 of either programme (LUA111 onwards, LUAU111 onwards) is still structure only.
