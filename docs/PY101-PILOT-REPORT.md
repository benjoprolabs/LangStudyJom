# PY101 pilot — academic quality report (PY-1 Phase A)

**Date:** 2026-11-19 · **App:** 0.8.0 · **Course materials:** 1.9.0 · **Verifier:** CPython 3.13.18
**Scope:** PY101 *Introduction to Programming and Python* (3 credits, Semester 1, absolute beginner, no prerequisites).
**Stop condition:** PY101 only. PY102, PY103 and PY104 were not started.

## 1. Audit of PY101 (exact structure, unchanged)

| Module | Title (EN / MS) | Lectures (60 min each) |
|---|---|---|
| PY101-M1 | Computers, Programs and Programming Languages / Komputer, Program dan Bahasa Pengaturcaraan | 1.1 What is a program? Input, process and output · 1.2 Programming languages: compiled versus interpreted · 1.3 Why Python? History and application areas |
| PY101-M2 | The Python Development Environment / Persekitaran Pembangunan Python | 2.1 Installing Python and checking the version · 2.2 The REPL (interactive shell) versus .py scripts · 2.3 Using a code editor and the terminal |
| PY101-M3 | First Programs: Output and Input / Program Pertama: Output dan Input | 3.1 print(), string literals and comments · 3.2 input() and user interaction · 3.3 Program structure: sequences of statements |
| PY101-M4 | Errors and Basic Debugging / Ralat dan Debugging Asas | 4.1 Syntax errors and reading tracebacks · 4.2 Common runtime errors · 4.3 Debugging strategies for beginners |

The course objectives (explain programs, interpreters and source code; install Python and use the REPL and an
editor; write programs with `print()` and `input()`; read tracebacks and fix syntax errors) map one-to-one onto
modules 1–4. No curriculum ID, title or structure was changed.

## 2. What was produced

| Layer | Delivered | Status (audit) |
|---|---|---|
| Lecture-level materials | 12 of 12 lectures, 24 of 24 sections each, Malay + English | **12 COMPLETE** |
| Module-level materials | 4 of 4 modules, 11 of 11 sections each, Malay + English | **4 COMPLETE** |
| Glossary | 18 new terms (11 Python-scoped, 7 general), each with a verified Python example | valid |
| Course | PY101 lecture materials 12/12, module materials 4/4 | **COMPLETE** |

### Per lecture

| Lecture | Sections | Working examples | Broken examples | Words (MS / EN) | Detailed theory (MS / EN) | References |
|---|---|---|---|---|---|---|
| 1.1 | 24 | 8 | 2 | 1,975 / 2,268 | 238 / 272 | 5 |
| 1.2 | 24 | 9 | 2 | 2,001 / 2,254 | 262 / 299 | 6 |
| 1.3 | 24 | 9 | 2 | 1,799 / 1,974 | 263 / 286 | 6 |
| 2.1 | 24 | 8 | 2 | 1,685 / 1,888 | 237 / 266 | 6 |
| 2.2 | 24 | 8 | 3 | 1,674 / 1,952 | 242 / 276 | 5 |
| 2.3 | 24 | 8 | 2 | 1,836 / 2,082 | 273 / 296 | 6 |
| 3.1 | 24 | 8 | 2 | 1,896 / 2,087 | 299 / 356 | 6 |
| 3.2 | 24 | 8 | 3 | 1,688 / 1,931 | 228 / 255 | 5 |
| 3.3 | 24 | 8 | 2 | 1,732 / 1,929 | 290 / 336 | 5 |
| 4.1 | 24 | 8 | 3 | 1,859 / 2,087 | 285 / 307 | 5 |
| 4.2 | 24 | 8 | 3 | 1,747 / 1,989 | 254 / 289 | 5 |
| 4.3 | 24 | 8 | 3 | 1,826 / 2,096 | 266 / 312 | 6 |
| **Total** | **288** | **98** | **29** | **21,718 / 24,537** | | **66** |

Words count prose only (paragraphs, lists, callouts, line-by-line and broken-example explanations), not code.
Requirement: ≥ 5 working and ≥ 2 broken examples per lecture — met by every lecture (minimum 8 and 2).

### Per module

| Module | Sections | Prose words (MS / EN) | Verified examples |
|---|---|---|---|
| M1 | 11 | 885 / 969 | 2 (abstraction ladder: source → bytecode count → execution; IPO duration converter) |
| M2 | 11 | 795 / 873 | 2 (environment report; edit–save–run cycle across two processes) |
| M3 | 11 | 848 / 911 | 2 (registration slip combining input, cleaning, conversion and formatting; aligned timetable) |
| M4 | 11 | 814 / 889 | 2 (failure-stage triage: compile vs run; logic bug caught by boundary checks) |

## 3. Standards compliance

| Requirement | How it is enforced | Result |
|---|---|---|
| 24-section lecture standard, in order, none "not applicable" | `content.test.ts` ("meets the standard") | 12/12 pass |
| 11-section module standard with minimum depth | `validatePackageModules` (strict package mode) | 4/4 pass |
| Complete Malay and English | validator: no empty language in any block; module word minimums per language | pass |
| Module content distinct from lecture content | strict mode rejects 8-word overlap ≥ 50% in any 12+ word piece, and code with ≥ 80% line overlap with any PY101 lecture | 0 findings |
| No code example repeated anywhere in the package | `content.test.ts` duplicate-code test (lectures, modules, glossary) | pass |
| Every meaningful code line explained | validator line-coverage rule (Python `#` comments and bare `else:`/`try:`/`finally:` exempt) | pass |
| Python-only code; no Lua syntax, no Roblox API; no links to Lua/Luau/Roblox terms | Python pathway rules in `validate.ts` | pass |
| Glossary links resolve | validator + e2e (no raw `[[…]]` in Lecture Room, PDF or Markdown) | pass |

## 4. Verification of every Python example (Python 3.13)

- Every example runs with **CPython 3.13.18** through `tools/code-verification/run-python.py` (`npm run verify:code`),
  in its own temporary directory, with fixed stdin where the example uses `input()`.
- **PY101 units: 135** — 98 lecture examples + 8 module examples executed with output matching exactly, and 29
  broken examples failing with exactly the documented first error line. **Glossary: 18** executed. Manifest total
  1,208 units; every earlier Lua/Luau result is unchanged.
- Outputs were never predicted into the manifest: three predictions were corrected by measurement during authoring
  (`NameError` suggestions appear only in the full traceback, not the exception message; a bytecode instruction
  count; a column offset), and the documented values are the measured ones.
- Broken examples cover the errors the course teaches: `SyntaxError` (missing comma, unclosed bracket, mismatched
  bracket, `=` for `==`, missing `:`, unterminated string, keyword as name, Python 2 `print`, Windows-path
  `\U` escape, pasted `>>>` prompt), `IndentationError`, `NameError` (misspelling, wrong case, use before
  assignment), `TypeError` (str + number, wrong operand types, string-vs-float comparison), `ValueError`
  (non-numeric and decimal-comma input), `ZeroDivisionError`, `IndexError`, `KeyError`, `AttributeError`,
  `ModuleNotFoundError`, `FileNotFoundError`, `UnicodeEncodeError`, `EOFError`, `AssertionError`.
- Examples avoid machine-specific output (paths, micro version, timing). Behaviour that differs by operating system
  (PATH separator, Windows `py` launcher) is explained in prose and the verified output states that it was verified
  on Linux.

## 5. Pedagogical design

- **Progression:** concepts → tools → first programs → errors. Each lecture names its prerequisites; later lectures
  reuse earlier ideas (the IPO model of 1.1 returns in 3.2, 3.3 and the M1–M3 module examples; the compile/run phases
  of 1.2 explain the error stages of module 4). Constructs taught later (loops, `if`, functions, lists,
  dictionaries, `try`) appear only where needed and are labelled with the course that teaches them (PY103, PY104,
  PY111, PY112, PY114).
- **Depth:** detailed theory sections average 261 (MS) / 296 (EN) words; every lecture has execution flow, memory
  behaviour, performance, a poor-versus-improved pair, a mini project and a knowledge check.
- **Context:** Malaysian examples (ringgit, SST, nasi lemak, teh tarik, Merdeka 1957, kantin, letak kereta), with
  English identifiers as in professional code.
- **Technical accuracy points:** CPython compiles to bytecode (not "not compiled"); the 3.13 interactive shell and
  experimental JIT; tuple-based version comparison; `input()` always returns `str`; f-string `{x=}`; `assert`
  removed by `-O`; EAFP versus LBYL; zero-cost exceptions since 3.11.
- **References:** 66 lecture references and 16 module references — Python 3.13 documentation, PEP 8/20/257,
  Think Python 3e, Automate the Boring Stuff 3e, python.org, the Python developer guide and VS Code documentation.

## 6. Glossary

18 new terms with `lectures` links to the PY101 lectures that teach them (each link checked to point to a lecture
that actually links the term). PY101 links 37 distinct terms: 11 Python-scoped, 26 general; none Lua, Luau or
Roblox-scoped.

**Limitation (needs a decision):** 19 *existing* general terms linked from PY101 — for example `variable`,
`interpreter`, `bytecode`, `repl`, `syntax-error`, `runtime-error`, `stack-traceback` — still show their original
Lua or Luau example in the glossary popover. They were not changed, because existing terms must not be replaced.
Options: (a) allow an optional second, Python example on general terms (a small format change, shown according to
the pathway of the lecture being read); or (b) add Python-specific sibling terms and re-point PY lectures to them.

## 7. Testing

| Check | Result |
|---|---|
| Unit tests (`npx vitest run`) | 914 passed (12 new lecture standard checks; installation tests count module materials) |
| Code verification (`npm run verify:code`) | 1,224 passed (1,208 units + 16 runner tests) |
| Content validation | `validateContentPackage(1.9.0)` → no errors |
| TypeScript / build | `tsc -b` clean; `npm run build` OK |
| Content audit (`npm run audit:content`) | 102 COMPLETE (90 Lua/Luau + 12 PY101), 7 NEEDS VERIFICATION (Roblox, unchanged), 875 STRUCTURE ONLY |
| E2E (`npm run test:e2e`) | smoke 22, university 24, curriculum 14, learning 25, packages 9, modules 14 — all passed |
| Package installation (e2e) | installs 109 lectures, 98 terms, 4 module materials ("211 item ditulis"), then reports up to date; student data unchanged |
| PY101 in the browser (e2e) | 12 lectures × 24 sections, 127 verified units shown, ≥ 2 broken per lecture, no raw glossary markup; Python glossary popovers |
| PDF / Markdown (e2e) | lecture PDF (24 sections, version 1.9.0); course PDF 188 A4 pages with 4 module materials + 12 lectures; course Markdown with 4 module materials, 135 Python blocks, nothing unverified |

## 8. Preservation

- No file under `src/content/lectures/lua*`, `src/content/lectures/luau*`, `src/content/glossary*.ts` (existing),
  or `src/db/seed` changed. All 1,055 earlier verification results are byte-identical.
- No database schema change. Installing 1.9.0 writes only lecture content, glossary terms and the four PY101 module
  records' content fields; the e2e and unit tests confirm students, progress, notes and bookmarks are unchanged and
  module content written on a device is never overwritten.
- The 7 Roblox lectures remain NEEDS VERIFICATION.

## 9. Honest limitations

- Content was authored and verified by automated means; it has not yet been reviewed by a human subject expert or a
  native Malay language editor. The Malay text keeps English technical terms where the programme convention does.
- Python has no in-browser Run; examples are verified by CPython 3.13 during content verification, and the
  interface says so.
- Some examples use the standard library beyond PY101 (`dis`, `tokenize`, `runpy`, `subprocess`, `traceback`) to
  make invisible mechanisms visible; they are explained line by line and are not required knowledge.

## 10. Decision needed

Approve the PY101 pilot (or request changes) before PY102–PY104 are started, and choose an option for the
general-term glossary examples in section 6.
