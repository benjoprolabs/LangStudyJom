/**
 * End-to-end smoke test against the production build in a real Chromium.
 *
 *   npm run build && npm run test:e2e
 *
 * Uses a persistent browser profile so "restart" means closing and relaunching
 * the browser — the same thing a student does when they come back tomorrow.
 * Optional env: E2E_SCREENSHOTS=<dir> to save screenshots.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const PORT = 4179;
const BASE = `http://127.0.0.1:${PORT}/`;
const shotsDir = process.env.E2E_SCREENSHOTS;
if (shotsDir) mkdirSync(shotsDir, { recursive: true });

const profileDir = mkdtempSync(join(tmpdir(), 'qhaze-e2e-'));
const downloadsDir = mkdtempSync(join(tmpdir(), 'qhaze-e2e-dl-'));
const consoleErrors = [];
let step = 0;
const log = (msg) => console.log(`  ✓ ${++step}. ${msg}`);

/** Schema v1 store definitions, read from src/db/schema.ts (the first `stores` block). */
function v1Stores() {
  const src = readFileSync(new URL('../src/db/schema.ts', import.meta.url), 'utf-8');
  const v1 = src.slice(src.indexOf('version: 1,'), src.indexOf('version: 2,'));
  const block = v1.slice(v1.indexOf('stores: {'));
  return Object.fromEntries([...block.matchAll(/^\s+(\w+): '([^']+)',/gm)].map((m) => [m[1], m[2]]));
}

/** Runs in the page: create the exact on-disk layout of a Phase 1.2 install, with a student. */
function createV1Database({ stores, now }) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('qhaze-tech-university', 10); // Dexie version 1 = IndexedDB version 10
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const [name, spec] of Object.entries(stores)) {
        const [pk, ...indexes] = spec.split(',').map((x) => x.trim());
        const store = db.createObjectStore(name, { keyPath: pk });
        for (const raw of indexes) {
          const unique = raw.startsWith('&');
          const multiEntry = raw.startsWith('*');
          const name = raw.replace(/^[&*]/, '');
          const keyPath = name.startsWith('[') ? name.slice(1, -1).split('+') : name;
          store.createIndex(name, keyPath, { unique, multiEntry });
        }
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction(['students', 'settings', 'meta'], 'readwrite');
      tx.objectStore('students').put({ id: 'v1-student', studentNumber: 'QTU-2026-0000V1', fullName: 'Pelajar Lama', preferredName: 'Lama', bio: 'Rekod Fasa 1', timezone: 'UTC', enrolledAt: now, createdAt: now, updatedAt: now });
      tx.objectStore('settings').put({ id: 'app', language: 'ms', theme: 'dark', dailyStudyGoalMinutes: 60, weeklyStudyGoalMinutes: 420, autoSnapshotRetention: 10, backupReminderDays: 0, updatedAt: now });
      tx.objectStore('meta').put({ key: 'schemaVersion', value: 1 });
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    };
    req.onerror = () => reject(req.error);
  });
}

async function startServer() {
  // Run vite directly (not via npx) in its own process group so it can be killed reliably.
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    stdio: 'ignore',
    detached: true,
  });
  server.stop = () => {
    try {
      process.kill(-server.pid, 'SIGTERM');
    } catch {
      /* already gone */
    }
  };
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return server;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  server.stop();
  throw new Error('preview server did not start');
}

async function launch() {
  const context = await chromium.launchPersistentContext(profileDir, {
    acceptDownloads: true,
    viewport: { width: 1360, height: 900 },
    downloadsPath: downloadsDir,
  });
  const page = context.pages()[0] ?? (await context.newPage());
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  return { context, page };
}

async function shot(page, name) {
  if (shotsDir) await page.screenshot({ path: join(shotsDir, `${name}.png`), fullPage: true });
}

async function main() {
  const server = await startServer();
  try {
    // ── First visit: onboarding in Bahasa Melayu ─────────────────────────
    let { context, page } = await launch();
    await page.goto(BASE);
    await page.getByRole('heading', { name: 'Cipta profil pelajar anda' }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.lang), 'ms');
    assert.ok(await page.evaluate(() => document.documentElement.classList.contains('dark')));
    log('Onboarding shown in Bahasa Melayu with dark theme by default');
    await shot(page, '01-onboarding');

    await page.getByRole('button', { name: 'Daftar sebagai pelajar' }).click();
    assert.equal(await page.getByText('Medan ini wajib diisi.').count(), 2);
    log('Empty submission blocked with validation messages');

    await page.getByLabel('Nama Penuh').fill('Nur Aisyah binti Ahmad');
    await page.getByLabel('Nama Panggilan').fill('Aisyah');
    await page.getByRole('button', { name: 'Daftar sebagai pelajar' }).click();
    await page.getByRole('heading', { name: 'Selamat kembali, Aisyah' }).waitFor();
    log('Student profile created → dashboard greets student');
    await shot(page, '02-dashboard-ms');

    // ── Full browser restart: data must persist ──────────────────────────
    await context.close();
    ({ context, page } = await launch());
    await page.goto(BASE);
    await page.getByRole('heading', { name: 'Selamat kembali, Aisyah' }).waitFor();
    log('Profile persists after closing and relaunching the browser');

    // ── Language & theme persist ─────────────────────────────────────────
    await page.getByRole('button', { name: 'Tukar bahasa' }).click();
    await page.getByRole('heading', { name: 'Welcome back, Aisyah' }).waitFor();
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.waitForFunction(() => !document.documentElement.classList.contains('dark'));
    await page.reload();
    await page.getByRole('heading', { name: 'Welcome back, Aisyah' }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.lang), 'en');
    assert.ok(!(await page.evaluate(() => document.documentElement.classList.contains('dark'))));
    assert.ok(await page.getByRole('link', { name: 'Course Library' }).isVisible());
    log('English + light theme persist after reload; navigation translated');
    await shot(page, '03-dashboard-en-light');

    // ── Profile autosave ─────────────────────────────────────────────────
    await page.getByRole('link', { name: 'Student Profile' }).click();
    const goals = page.getByLabel(/Learning Goals/);
    await goals.fill('Become an AI Engineer');
    await page.getByRole('status').filter({ hasText: 'Saved' }).waitFor();
    const studentNumber = await page.getByTestId('student-number').textContent();
    assert.match(studentNumber, /^QTU-\d{4}-[0-9A-F]{6}$/);
    await page.reload();
    assert.equal(await page.getByLabel(/Learning Goals/).inputValue(), 'Become an AI Engineer');
    log(`Profile autosaves and persists (student number ${studentNumber})`);

    // Leaving the page right after typing must not lose the edit (flush on unmount).
    await page.getByLabel(/Learning Goals/).fill('Quick edit');
    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('link', { name: 'Student Profile' }).click();
    assert.equal(await page.getByLabel(/Learning Goals/).inputValue(), 'Quick edit');
    log('Pending autosave flushed when navigating away');

    await page.getByLabel(/^Bio/).fill('Pelajar sepenuh masa yang meminati AI.');
    await page.getByRole('status').filter({ hasText: 'Saved' }).waitFor();
    await page.reload();
    assert.equal(await page.getByLabel(/^Bio/).inputValue(), 'Pelajar sepenuh masa yang meminati AI.');
    log('Student Profile bio input saves and persists');

    // ── Settings validation ──────────────────────────────────────────────
    await page.getByRole('link', { name: 'Settings' }).click();
    const daily = page.getByLabel('Daily goal (minutes)');
    await daily.fill('-5');
    await daily.blur();
    await page.getByText('Please enter a number within the allowed range.').waitFor();
    await daily.fill('90');
    await daily.press('Enter');
    await page.getByText('Settings saved').first().waitFor();
    // Pop-up close button is labelled through i18n (was a hard-coded "×").
    assert.ok(await page.getByRole('button', { name: 'Close', exact: true }).first().isVisible());
    await page.reload();
    assert.equal(await page.getByLabel('Daily goal (minutes)').inputValue(), '90');
    log('Settings validate input and persist');

    // ── Planned module pages are honest ──────────────────────────────────
    await page.getByRole('link', { name: 'Notes & Bookmarks' }).click();
    await page.getByRole('heading', { name: 'This module is built in Phase 3' }).waitFor();
    log('Future modules show their delivery phase and prepared tables (no fake controls)');

    // ── Backup export ────────────────────────────────────────────────────
    await page.getByRole('link', { name: 'Backup & Restore' }).click();
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export JSON file' }).click()]);
    const backupPath = join(downloadsDir, download.suggestedFilename());
    await download.saveAs(backupPath);
    const backup = JSON.parse(readFileSync(backupPath, 'utf-8'));
    assert.equal(backup.format, 'qhaze-tech-university-backup');
    assert.equal(backup.data.students[0].preferredName, 'Aisyah');
    assert.equal(backup.data.students[0].goals, 'Quick edit');
    assert.equal(backup.data.snapshots, undefined);
    log(`Backup exported (${download.suggestedFilename()}) with valid structure`);

    // ── Change data, then restore (replace) ──────────────────────────────
    await page.getByRole('link', { name: 'Student Profile' }).click();
    await page.getByLabel('Preferred Name').fill('Changed');
    await page.getByRole('status').filter({ hasText: 'Saved' }).waitFor();
    await page.getByRole('link', { name: 'Backup & Restore' }).click();
    await page.getByTestId('restore-file-input').setInputFiles(backupPath);
    await page.getByText('File Summary').waitFor();
    await page.getByRole('button', { name: 'Restore data' }).click();
    const dialog = page.getByRole('dialog');
    const confirmBtn = dialog.getByRole('button', { name: 'Restore data' });
    assert.ok(await confirmBtn.isDisabled(), 'confirm must be disabled until the word is typed');
    await dialog.getByRole('textbox').fill('RESTORE');
    await confirmBtn.click();
    await page.getByText(/Restore complete/).waitFor();
    assert.ok(await page.getByTestId('snapshot-list').getByText('Before restore').first().isVisible());
    await page.reload();
    await page.getByRole('link', { name: 'Student Profile' }).click();
    assert.equal(await page.getByLabel('Preferred Name').inputValue(), 'Aisyah');
    log('Replace-restore requires typed confirmation, reverts data and keeps a pre-restore snapshot');

    // ── Tampered file is rejected ────────────────────────────────────────
    await page.getByRole('link', { name: 'Backup & Restore' }).click();
    const tampered = { ...backup, data: { ...backup.data, students: [{ ...backup.data.students[0], fullName: 'Hacker' }] } };
    await page.getByTestId('restore-file-input').setInputFiles({
      name: 'tampered.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(tampered)),
    });
    await page.getByText(/Checksum mismatch/).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Restore data' }).count(), 0);
    log('Tampered backup rejected by checksum; no restore button offered');
    await page.getByRole('button', { name: 'Choose another file' }).click();

    // ── Manual snapshot + integrity check ────────────────────────────────
    await page.getByRole('button', { name: 'Create recovery point' }).click();
    await page.getByText('Recovery point created').first().waitFor();
    assert.ok(await page.getByTestId('snapshot-list').getByText('Manual').first().isVisible());
    await page.getByRole('button', { name: 'Run check' }).click();
    await page.getByText(/No issues found in/).waitFor();
    log('Manual recovery point created; integrity check passes');
    await shot(page, '04-backup');

    // ── Integrity rules against REAL browser IndexedDB records ───────────
    /** Apply put/delete operations directly to the app's IndexedDB. "__STUDENT__" is replaced by the student id. */
    const idb = (ops) =>
      page.evaluate(
        (ops) =>
          new Promise((resolve, reject) => {
            const req = indexedDB.open('qhaze-tech-university');
            req.onerror = () => reject(req.error);
            req.onsuccess = () => {
              const db = req.result;
              const stores = [...new Set([...ops.map((o) => o.store), 'students'])];
              const tx = db.transaction(stores, 'readwrite');
              tx.objectStore('students').getAll().onsuccess = (e) => {
                const sid = e.target.result[0].id;
                for (const o of ops) {
                  const st = tx.objectStore(o.store);
                  if (o.del) st.delete(o.del);
                  else st.put(JSON.parse(JSON.stringify(o.put).replaceAll('__STUDENT__', sid)));
                }
              };
              tx.oncomplete = () => {
                db.close();
                resolve();
              };
              tx.onerror = () => reject(tx.error);
            };
          }),
        ops,
      );
    const runCheck = async () => {
      await page.getByRole('button', { name: 'Run check' }).click();
      await page.waitForTimeout(150);
    };
    const T = '2026-01-01T00:00:00.000Z';
    const r = (store, put) => ({ store, put: { createdAt: T, updatedAt: T, ...put } });
    const L = (s) => ({ ms: s, en: s });

    // Phase 1.1: dangling study-session references.
    await idb([r('studySessions', { id: 'e2e-orphan', studentId: '__STUDENT__', academyId: 'missing-academy', semesterId: 'missing-semester', startedAt: T, endedAt: T, durationMinutes: 30, activityType: 'other', completed: true, source: 'manual' })]);
    await runCheck();
    await page.getByText('2 issues found:').waitFor();
    assert.ok(await page.getByText('academyId=missing-academy not found in academies').isVisible());
    assert.ok(await page.getByText('semesterId=missing-semester not found in semesters').isVisible());
    await idb([{ store: 'studySessions', del: 'e2e-orphan' }]);
    await runCheck();
    await page.getByText(/No issues found in/).waitFor();
    log('Integrity check UI reports dangling study-session references (Phase 1.1)');

    // Integrity items 4–10: a complete VALID curriculum first (no false positives)…
    const curriculum = [
      r('faculties', { id: 'e2e-f1', code: 'E2E-F1', name: L('Fakulti'), description: L(''), order: 1, status: 'active' }),
      r('academies', { id: 'e2e-a1', facultyId: 'e2e-f1', code: 'E2E-A1', name: L('Akademi'), description: L(''), order: 1, status: 'active' }),
      r('programmes', { id: 'e2e-p1', academyId: 'e2e-a1', code: 'E2E-P1', name: L('P1'), description: L(''), totalSemesters: 2, entryLevel: 'beginner', exitLevel: 'advanced', completionRequirements: [], status: 'active' }),
      r('programmes', { id: 'e2e-p2', academyId: 'e2e-a1', code: 'E2E-P2', name: L('P2'), description: L(''), totalSemesters: 1, entryLevel: 'beginner', exitLevel: 'advanced', completionRequirements: [], status: 'active' }),
      r('semesters', { id: 'e2e-s1', programmeId: 'e2e-p1', number: 1, title: L('S1'), description: L('') }),
      r('semesters', { id: 'e2e-s2', programmeId: 'e2e-p1', number: 2, title: L('S2'), description: L('') }),
      r('semesters', { id: 'e2e-s3', programmeId: 'e2e-p2', number: 1, title: L('S3'), description: L('') }),
      ...['1', '2', '3'].map((n) => r('courses', { id: `e2e-c${n}`, programmeId: 'e2e-p1', semesterId: n === '1' ? 'e2e-s1' : 'e2e-s2', code: `E2E-C${n}`, title: L(`C${n}`), description: L(''), creditHours: 3, difficulty: 'beginner', learningObjectives: [], references: [], status: 'active' })),
      r('coursePrerequisites', { id: 'e2e-q1', courseId: 'e2e-c2', prerequisiteCourseId: 'e2e-c1', kind: 'required' }),
      r('coursePrerequisites', { id: 'e2e-q2', courseId: 'e2e-c3', prerequisiteCourseId: 'e2e-c2', kind: 'required' }),
      r('modules', { id: 'e2e-m1', courseId: 'e2e-c1', order: 1, title: L('M1'), description: L('') }),
      r('modules', { id: 'e2e-m2', courseId: 'e2e-c2', order: 1, title: L('M2'), description: L('') }),
      r('lectures', { id: 'e2e-l1', moduleId: 'e2e-m1', courseId: 'e2e-c1', order: 1, title: L('L1'), estimatedMinutes: 30, difficulty: 'beginner', sections: [] }),
      r('lectures', { id: 'e2e-l2', moduleId: 'e2e-m2', courseId: 'e2e-c2', order: 1, title: L('L2'), estimatedMinutes: 30, difficulty: 'beginner', sections: [] }),
      r('learningMaterials', { id: 'e2e-mat1', lectureId: 'e2e-l1', kind: 'markdown', title: L('Nota'), content: '# x' }),
      r('exercises', { id: 'e2e-e1', code: 'E2E-E1', academyId: 'e2e-a1', courseId: 'e2e-c1', type: 'coding_challenge', difficulty: 'beginner', title: L('E1'), instructions: L(''), learningObjective: L(''), hints: [], assessmentCriteria: [], maxScore: 10 }),
      r('exercises', { id: 'e2e-e2', code: 'E2E-E2', academyId: 'e2e-a1', courseId: 'e2e-c1', type: 'multiple_choice', difficulty: 'beginner', title: L('E2'), instructions: L(''), learningObjective: L(''), hints: [], assessmentCriteria: [], maxScore: 10 }),
      r('assessments', { id: 'e2e-quiz', courseId: 'e2e-c1', type: 'quiz', title: L('Kuiz'), weight: 10, exerciseIds: ['e2e-e1', 'e2e-e2'] }),
      r('assessments', { id: 'e2e-asg', courseId: 'e2e-c1', type: 'assignment', title: L('Tugasan'), weight: 20, exerciseIds: ['e2e-e2'] }),
      r('exerciseAttempts', { id: 'e2e-att1', exerciseId: 'e2e-e1', studentId: '__STUDENT__', assessmentId: 'e2e-quiz', submission: 'print(1)', submittedAt: T, status: 'submitted', hintsUsed: 0 }),
      r('progress', { id: 'e2e-pg1', studentId: '__STUDENT__', entityType: 'lecture', entityId: 'e2e-l1', status: 'in_progress', percent: 50 }),
      r('notes', { id: 'e2e-n1', studentId: '__STUDENT__', entityType: 'lecture', entityId: 'e2e-l1', kind: 'lecture_note', title: 'Nota', body: 'x', tags: [] }),
      r('bookmarks', { id: 'e2e-b1', studentId: '__STUDENT__', entityType: 'material', entityId: 'e2e-mat1' }),
    ];
    await idb(curriculum);
    await runCheck();
    await page.getByText(/No issues found in/).waitFor();
    log(`Valid curriculum (${curriculum.length} real IndexedDB records) passes all integrity rules — no false positives`);

    // …then one violation per rule 4–10.
    const violations = [
      [r('assessments', { id: 'e2e-bad-asm', courseId: 'e2e-c1', type: 'quiz', title: L('x'), weight: 0, exerciseIds: ['e2e-e1', 'e2e-missing-ex'] }), 'exerciseIds contains e2e-missing-ex, not found in exercises'],
      [r('exerciseAttempts', { id: 'e2e-bad-att', exerciseId: 'e2e-e1', studentId: '__STUDENT__', assessmentId: 'e2e-asg', submission: '', submittedAt: T, status: 'submitted', hintsUsed: 0 }), 'exerciseId=e2e-e1 is not part of assessmentId=e2e-asg'],
      [r('progress', { id: 'e2e-bad-pg', studentId: '__STUDENT__', entityType: 'module', entityId: 'e2e-missing-mod', status: 'in_progress', percent: 0 }), 'entityId=e2e-missing-mod not found in modules (entityType=module)'],
      [r('notes', { id: 'e2e-bad-note', studentId: '__STUDENT__', entityType: 'course', entityId: 'e2e-missing-course', kind: 'note', title: 'x', body: '', tags: [] }), 'entityId=e2e-missing-course not found in courses (entityType=course)'],
      [r('bookmarks', { id: 'e2e-bad-bm', studentId: '__STUDENT__', entityType: 'material', entityId: 'e2e-missing-mat' }), 'entityId=e2e-missing-mat not found in learningMaterials (entityType=material)'],
      [r('courses', { id: 'e2e-bad-course', programmeId: 'e2e-p2', semesterId: 'e2e-s1', code: 'E2E-BAD', title: L('x'), description: L(''), creditHours: 1, difficulty: 'beginner', learningObjectives: [], references: [], status: 'active' }), "semesterId=e2e-s1 belongs to programmeId=e2e-p1, not the course's programmeId=e2e-p2"],
      [r('lectures', { id: 'e2e-bad-lec', moduleId: 'e2e-m1', courseId: 'e2e-c2', order: 9, title: L('x'), estimatedMinutes: 1, difficulty: 'beginner', sections: [] }), "moduleId=e2e-m1 belongs to courseId=e2e-c1, not the lecture's courseId=e2e-c2"],
      [r('coursePrerequisites', { id: 'e2e-bad-q', courseId: 'e2e-c1', prerequisiteCourseId: 'e2e-c3', kind: 'required' }), 'Circular prerequisites: e2e-c1 → e2e-c3 → e2e-c2 → e2e-c1'],
      [r('semesters', { id: 'e2e-bad-sem', programmeId: 'e2e-p2', number: 3, title: L('x'), description: L('') }), 'number=3 exceeds programme e2e-p2 totalSemesters=1'],
    ];
    await idb(violations.map(([op]) => op));
    await runCheck();
    await page.getByText(`${violations.length} issues found:`).waitFor();
    for (const [, detail] of violations) {
      assert.ok(await page.getByText(detail, { exact: false }).isVisible(), `missing in UI: ${detail}`);
    }
    log(`Integrity check UI reports all ${violations.length} injected violations of rules 4–10`);

    // Clean up: remove violations, then the curriculum; student data must be untouched.
    await idb(violations.map(([op]) => ({ store: op.store, del: op.put.id })));
    await runCheck();
    await page.getByText(/No issues found in/).waitFor();
    await idb(curriculum.map((op) => ({ store: op.store, del: op.put.id })));
    await runCheck();
    await page.getByText(/No issues found in/).waitFor();
    await page.getByRole('link', { name: 'Student Profile' }).click();
    assert.equal(await page.getByLabel('Preferred Name').inputValue(), 'Aisyah');
    await page.getByRole('link', { name: 'Backup & Restore' }).click();
    log('Removing violations restores a clean check; student profile untouched');

    // ── Mobile layout ────────────────────────────────────────────────────
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('link', { name: 'Practice Center' }).click();
    await page.getByRole('heading', { name: 'This module is built in Phase 5' }).waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `horizontal overflow ${overflow}px`);
    for (const path of ['', 'backup', 'profile', 'settings']) {
      await page.goto(`${BASE}#/${path}`);
      await page.waitForTimeout(150);
      const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert.ok(o <= 0, `horizontal overflow ${o}px on /${path}`);
    }
    log('Mobile drawer navigation works; no horizontal overflow at 390px');
    await page.goto(BASE);
    await shot(page, '05-mobile');
    await context.close();

    // ── Brand-new device: restore from backup during onboarding ──────────
    rmSync(profileDir, { recursive: true, force: true });
    ({ context, page } = await launch());
    await page.goto(BASE);
    await page.getByRole('button', { name: 'Pulihkan daripada sandaran' }).click();
    await page.getByTestId('restore-file-input').setInputFiles(backupPath);
    await page.getByText('Ringkasan Fail').waitFor();
    await page.getByRole('button', { name: 'Pulihkan data' }).click();
    await page.getByRole('dialog').getByRole('textbox').fill('PULIHKAN');
    await page.getByRole('dialog').getByRole('button', { name: 'Pulihkan data' }).click();
    // Restored settings are English, so the dashboard appears in English.
    await page.getByRole('heading', { name: 'Welcome back, Aisyah' }).waitFor();
    log('Fresh device: restoring a backup from onboarding recovers the whole university');
    await context.close();

    // ── Schema migration: a schema-v1 (Phase 1.2) database is upgraded safely ─
    rmSync(profileDir, { recursive: true, force: true });
    ({ context, page } = await launch());
    await page.goto(`${BASE}favicon.svg`); // same origin, app not loaded yet
    await page.evaluate(createV1Database, { stores: v1Stores(), now: new Date().toISOString() });
    await page.goto(BASE);
    await page.getByRole('heading', { name: 'Selamat kembali, Lama' }).waitFor();
    await page.getByRole('link', { name: 'Sandaran & Pemulihan' }).click();
    await page.getByTestId('snapshot-list').getByText('Sebelum naik taraf').waitFor();
    const migrated = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const q = indexedDB.open('qhaze-tech-university');
          q.onsuccess = () => {
            const db = q.result;
            const r = db.transaction('students').objectStore('students').getAll();
            r.onsuccess = () => {
              resolve({ version: db.version, student: r.result[0], hasNewIndex: db.transaction('studySessions').objectStore('studySessions').indexNames.contains('programmeId') });
              db.close();
            };
          };
        }),
    );
    assert.equal(migrated.version, 30);
    assert.equal(migrated.student.bio, 'Rekod Fasa 1');
    assert.ok(migrated.hasNewIndex);
    await page.getByRole('button', { name: 'Jalankan semakan' }).click();
    await page.getByText(/Tiada isu ditemui/).waitFor();
    log('Schema v1 database migrates to the current schema (v3) with a pre-migration recovery point; student data intact');
    await context.close();

    const relevantErrors = consoleErrors.filter((e) => !/favicon/i.test(e));
    assert.deepEqual(relevantErrors, [], `console errors:\n${relevantErrors.join('\n')}`);
    log('No console errors');
    console.log(`\nE2E smoke test passed (${step} checks).`);
  } finally {
    server.stop();
    rmSync(profileDir, { recursive: true, force: true });
    rmSync(downloadsDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error('\nE2E FAILED:', err);
  process.exit(1);
});
