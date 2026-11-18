# QHAZE TECH UNIVERSITY

A personal, local-first digital university and learning management system: one university, multiple
faculties and academies, structured academic programmes, separate course materials and practice,
a coding laboratory, study tracking, GPA and a project portfolio.

Bahasa Melayu is the primary language and English the secondary one. Programming terms stay in English.

> **Status: Curriculum Seeding Milestone 2 is built and awaiting approval.** It adds the separate Lua and Luau/Roblox
> programmes, the 28-section course-material standard, the Course Library, the Lecture Room and Markdown, PDF and ZIP downloads.
> 2 pilot lectures are fully written; the remaining lectures are structure-only for now.
> Phase 2 University Management and Seeding Milestone 1 (7 faculties, Faculty 01 academies, the Python programme) are complete.
> See [docs/ROADMAP.md](docs/ROADMAP.md).

## Run it

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev          # development server → http://localhost:5173
npm run build        # type-check and production build → dist/
npm run preview      # serve the production build
```

The built `dist/` folder is a static site with relative paths and hash routing, so you can host it on
any static web server.

## Tests

```bash
npm test             # unit and integration tests (Vitest + fake-indexeddb)
npm run typecheck    # TypeScript strict mode
npm run build && npm run test:e2e   # end-to-end test in real Chromium (needs Playwright installed)
```

### Course-material code verification

```bash
pip install lupa               # Lua 5.4 reference interpreter for Python
cargo build --release --manifest-path tools/luau-runner/Cargo.toml   # Luau VM (Rust toolchain; builds Luau from source)
npm run verify:code            # executes every runnable example → docs/CODE-VERIFICATION.md
npm run docs:curriculum        # regenerates the curriculum tables in docs/CURRICULUM.md
```

If a runtime is missing, its examples are reported as *skipped*, never as passed. Roblox examples are never
executed (they need Roblox Studio). `scripts/e2e-learning.mjs` also needs `lupa`, because it runs a downloaded
example file.

The end-to-end tests open the real production build. It restarts the browser to confirm data
survives, and it exercises backup, restore and recovery points.

## Your data

- Everything is stored on **your device** in IndexedDB. There is no account, no server and no paid API.
- **Backup & Restore** exports all records to a JSON file. Each file carries a checksum and is fully
  validated before a restore.
- A **recovery point** is created automatically before every restore and every database upgrade.
- Clearing site data in your browser deletes your records, so export backups regularly. The dashboard
  reminds you when a backup is overdue.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): technical architecture, database, i18n and data safety
- [docs/ROADMAP.md](docs/ROADMAP.md): development phases and their status
- [docs/INTEGRITY.md](docs/INTEGRITY.md): data integrity rules and open items
- [docs/CURRICULUM.md](docs/CURRICULUM.md): curriculum packages and the generated curriculum tables
- [docs/CHANGELOG.md](docs/CHANGELOG.md): release history
