# Lua Semester 1 — completion checkpoint

**Status:** complete · **Course materials:** 1.4.0 · **App:** 0.5.3 · **Date:** 2026-11-18

This checkpoint records that Semester 1 of the Lua Programming Programme (`LUA-PROG`) is fully written and
verified. It is a checkpoint *within* Milestone 3: the Luau Semester 1 courses (LUAU101–LUAU104) are not started
and wait for approval, as does Milestone 4.

## Scope

| Course | Title | Lectures | Code units | Executed | Debug variants (error matched) | Failures |
|---|---|---|---|---|---|---|
| LUA101 | Introduction to Lua and Its Execution Model | 12/12 | 119 | 93 | 26 | 0 |
| LUA102 | Variables, Data Types and Operators in Lua | 12/12 | 120 | 96 | 24 | 0 |
| LUA103 | Control Flow in Lua: Conditions and Loops | 12/12 | 122 | 97 | 25 | 0 |
| LUA104 | Functions and Scope | 12/12 | 124 | 96 | 28 | 0 |
| **Total** | | **48/48** | **485** | **382** | **103** | **0** |

Glossary: 54 Click-to-Learn terms in total (8 added by LUA104); every Lua term's example is executed too.

## What "verified" means here

Every lecture meets the Professional Programming Education Standard, checked by `src/db/__tests__/content.test.ts`
for each lecture:

- all 24 authored sections, in order, none marked not applicable, in Malay and English;
- detailed theory of at least 80 words per language; debugging prose of at least 40 words;
- at least 5 code blocks, at least 2 debug variants, at least 2 line-by-line explanations, and every meaningful
  line of every example covered by an explanation;
- a poor-versus-improved comparison with code, a practical demonstration and a mini project, at least 4 references;
- no code example repeated verbatim anywhere in the materials; no lecture defined twice; no Luau syntax, Roblox APIs
  or Luau/Roblox glossary links in Lua lectures.

Every code unit is checked by execution, not by inspection:

- **Reference runtime:** `npm run verify:code` runs every example with Lua 5.4.8 (lupa 2.8). An example must
  print exactly its documented output; a debug variant must fail with exactly its documented first error line.
  Results are tied to a hash of the code in `src/content/verification.json`; a unit test fails if any record is
  stale. Report: [CODE-VERIFICATION.md](CODE-VERIFICATION.md).
- **Browser runtime:** `src/lib/lua-runtime/harness.test.ts` runs every example and debug variant with the
  browser runner (wasmoon, Lua 5.4.6) and requires the same result as the reference runtime.
- **Real browser:** `scripts/e2e-learning.mjs` (Playwright, Chromium) opens all 48 lectures, checks 24 rendered
  sections and a verified status on every one of the 485 units, runs input-driven and closure examples with the
  Run button, and completes lectures while checking that earlier progress and notes are unchanged.

## Test results at this checkpoint

| Check | Result |
|---|---|
| `npx tsc -b` | passes |
| `npx vitest run` | 806/806 tests pass (18 files) |
| `npm run verify:code` | 546 records: 431 executed, 104 error matched, 11 compiled (Luau/Roblox, not run); 0 failed |
| `npm run build` | succeeds |
| `npm run test:e2e` | smoke 22, university 24, curriculum 14, learning 24 — 84/84 checks pass |
| `npm run docs:curriculum` | regenerated; content status LUA-PROG 48 with content / 240 structure only |

## Known limitations

- The browser runner is Lua 5.4.6; the reference is 5.4.8. Examples are written so both agree (for example,
  wasmoon reports integer division by zero on line 1, so no debug variant relies on that line number).
- Random examples use fixed seeds so their output can be verified; real programs should not.
- Answers to knowledge checks and graded exercises belong to the Practice Center and are not part of the lecture
  materials.
- The content checker treats the word `continue` as Luau-only syntax, so the Lua continue-pattern label is named
  `::next_item::` (explained in LUA103 3.2).

## Data safety

Writing Semester 1 changed only course-material files, tests and documentation. Student records, learner progress,
notes, the database schema, the curriculum structure and the Luau materials were not modified; the e2e integrity
check confirms the student record is unchanged after installing materials 1.4.0.

## Next (requires approval)

- LUAU101–LUAU104 (48 lectures) to complete Milestone 3.
- Milestone 4.
