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

    // ── Settings validation ──────────────────────────────────────────────
    await page.getByRole('link', { name: 'Settings' }).click();
    const daily = page.getByLabel('Daily goal (minutes)');
    await daily.fill('-5');
    await daily.blur();
    await page.getByText('Please enter a number within the allowed range.').waitFor();
    await daily.fill('90');
    await daily.press('Enter');
    await page.getByText('Settings saved').first().waitFor();
    await page.reload();
    assert.equal(await page.getByLabel('Daily goal (minutes)').inputValue(), '90');
    log('Settings validate input and persist');

    // ── Planned module pages are honest ──────────────────────────────────
    await page.getByRole('link', { name: 'Course Library' }).click();
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

    // ── Phase 1.1: integrity checker detects broken curriculum references ─
    const idb = (op) =>
      page.evaluate(
        (op) =>
          new Promise((resolve, reject) => {
            const req = indexedDB.open('qhaze-tech-university');
            req.onerror = () => reject(req.error);
            req.onsuccess = () => {
              const db = req.result;
              const tx = db.transaction(['studySessions', 'students'], 'readwrite');
              const sessions = tx.objectStore('studySessions');
              if (op === 'inject') {
                tx.objectStore('students').getAll().onsuccess = (e) => {
                  const studentId = e.target.result[0].id;
                  sessions.put({ id: 'e2e-orphan', studentId, academyId: 'missing-academy', semesterId: 'missing-semester', startedAt: '2026-01-01T00:00:00.000Z', endedAt: '2026-01-01T00:30:00.000Z', durationMinutes: 30, activityType: 'other', completed: true, source: 'manual', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' });
                };
              } else {
                sessions.delete('e2e-orphan');
              }
              tx.oncomplete = () => {
                db.close();
                resolve();
              };
              tx.onerror = () => reject(tx.error);
            };
          }),
        op,
      );
    await idb('inject');
    await page.getByRole('button', { name: 'Run check' }).click();
    await page.getByText('2 issues found:').waitFor();
    assert.ok(await page.getByText('academyId=missing-academy not found in academies').isVisible());
    assert.ok(await page.getByText('semesterId=missing-semester not found in semesters').isVisible());
    await idb('remove');
    await page.getByRole('button', { name: 'Run check' }).click();
    await page.getByText(/No issues found in/).waitFor();
    log('Integrity check UI reports dangling study-session references (Phase 1.1)');

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
