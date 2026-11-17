/**
 * End-to-end tests for Phase 2 University Management (real Chromium, production build).
 *   npm run build && node scripts/e2e-university.mjs
 */
import assert from 'node:assert/strict';
import { createLogger, horizontalOverflow, launch, startServer, tempDir } from './e2e-lib.mjs';

const { log, count } = createLogger();
const consoleErrors = [];

async function main() {
  const { base, stop } = await startServer(4180);
  const profile = tempDir('qhaze-e2e-uni-');
  try {
    let { context, page } = await launch(profile, consoleErrors);
    await page.goto(base);
    await page.getByLabel('Nama Penuh').fill('Nur Aisyah');
    await page.getByLabel('Nama Panggilan').fill('Aisyah');
    await page.getByRole('button', { name: 'Daftar sebagai pelajar' }).click();
    await page.getByRole('heading', { name: 'Selamat kembali, Aisyah' }).waitFor();
    await page.getByText('Belum ada fakulti. Mulakan struktur universiti di Fakulti Saya.').waitFor();

    // ── M1: Faculty management ───────────────────────────────────────────
    await page.getByRole('link', { name: 'Fakulti Saya' }).click();
    await page.getByRole('heading', { name: 'Fakulti Saya' }).waitFor();
    assert.equal(await page.getByRole('link', { name: 'Fakulti Saya' }).getByText('F2').count(), 0, 'implemented page must not show a phase badge');
    await page.getByText('Belum ada fakulti.', { exact: false }).waitFor();

    await page.getByRole('button', { name: 'Fakulti baharu' }).first().click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Cipta' }).click();
    await dialog.getByText('Medan ini wajib diisi.').first().waitFor();
    assert.equal(await dialog.getByText('Medan ini wajib diisi.').count(), 2); // code + name.ms
    log('Faculty form: required code and Malay name are enforced (nothing saved)');

    await dialog.getByLabel('Kod').fill('f01');
    assert.equal(await dialog.getByLabel('Kod').inputValue(), 'F01', 'codes are upper-cased while typing');
    const nameSet = dialog.locator('fieldset').filter({ hasText: 'Nama' }).first();
    await nameSet.locator('[data-field="name.ms"]').fill('Pengaturcaraan & Kejuruteraan Perisian');
    await nameSet.locator('[data-field="name.en"]').fill('Programming & Software Engineering');
    await dialog.locator('[data-field="description.ms"]').fill('Asas sains komputer dan pembangunan perisian.');
    await dialog.getByRole('button', { name: 'Cipta' }).click();
    await page.getByText('Fakulti dicipta').first().waitFor();
    const list = page.getByTestId('faculty-list');
    await list.getByText('Pengaturcaraan & Kejuruteraan Perisian').waitFor();
    assert.ok(await list.getByText('F01', { exact: true }).isVisible());
    log('Faculty created with bilingual name; Malay shown by default');

    await page.getByRole('button', { name: 'Fakulti baharu' }).first().click();
    await dialog.getByLabel('Kod').fill('F01');
    await dialog.locator('[data-field="name.ms"]').fill('Pendua');
    await dialog.getByRole('button', { name: 'Cipta' }).click();
    await dialog.getByText('Kod ini sudah digunakan.').waitFor();
    await dialog.getByLabel('Kod').fill('F 1!');
    await dialog.getByRole('button', { name: 'Cipta' }).click();
    await dialog.getByText('Gunakan huruf besar, nombor dan tanda sempang sahaja', { exact: false }).waitFor();
    await dialog.getByRole('button', { name: 'Batal' }).click();
    assert.equal(await list.locator('li').count(), 1);
    log('Duplicate and malformed faculty codes are rejected');

    // ── M1: Academy management ───────────────────────────────────────────
    await page.getByRole('link', { name: 'Akademi Saya' }).click();
    await page.getByRole('button', { name: 'Akademi baharu' }).click();
    await dialog.getByLabel('Kod').fill('F01-PY');
    await dialog.locator('[data-field="name.ms"]').fill('Akademi Pengaturcaraan Python');
    await dialog.locator('[data-field="name.en"]').fill('Python Programming Academy');
    await dialog.getByRole('button', { name: 'Cipta' }).click();
    await page.getByText('Akademi dicipta').first().waitFor();
    await page.getByTestId('academy-list').getByText('Akademi Pengaturcaraan Python').waitFor();
    log('Academy created under its faculty');

    // Language switch shows English content.
    await page.getByRole('button', { name: 'Tukar bahasa' }).click();
    await page.getByTestId('academy-list').getByText('Python Programming Academy').waitFor();
    await page.getByRole('link', { name: 'My Faculties' }).click();
    await page.getByTestId('faculty-list').getByText('Programming & Software Engineering').waitFor();
    await page.getByRole('link', { name: '1 academies' }).click();
    await page.getByTestId('academy-list').getByText('Python Programming Academy').waitFor();
    log('English interface shows the English names; faculty → academies link filters correctly');

    // ── Delete protection in the UI ──────────────────────────────────────
    await page.getByRole('link', { name: 'My Faculties' }).click();
    await page.getByRole('button', { name: 'Delete: Programming & Software Engineering' }).click();
    await page.getByTestId('delete-blocked').waitFor();
    assert.ok(await page.getByText('1 × Academies').isVisible());
    assert.equal(await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).count(), 0, 'no delete button while blocked');
    await page.getByRole('button', { name: 'Archive instead' }).click();
    await page.getByText('Faculty archived').first().waitFor();
    await page.getByText('No faculties yet.', { exact: false }).waitFor();
    await page.getByLabel('Show archived').check();
    await page.getByTestId('faculty-list').getByText('Archived').waitFor();
    await page.getByRole('button', { name: 'Restore: Programming & Software Engineering' }).click();
    await page.getByText('Faculty restored').first().waitFor();
    log('Deleting a faculty with academies is blocked; "archive instead" and restore work');

    await page.getByRole('button', { name: 'New faculty' }).first().click();
    await dialog.getByLabel('Code').fill('F99');
    await dialog.locator('[data-field="name.ms"]').fill('Fakulti Sementara');
    await dialog.getByRole('button', { name: 'Create' }).click();
    await page.getByText('Faculty created').first().waitFor();
    await page.getByRole('button', { name: 'Delete: Fakulti Sementara' }).click();
    await page.getByText('Fakulti Sementara will be permanently deleted.').waitFor();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await page.getByText('Faculty deleted').first().waitFor();
    assert.equal(await page.getByText('Fakulti Sementara').count(), 0);
    log('An unreferenced faculty is deleted after confirmation (English falls back to Malay name)');

    // Edit + persistence across a browser restart.
    await page.getByRole('button', { name: 'Edit: Programming & Software Engineering' }).click();
    await dialog.getByLabel('Order').fill('5');
    await dialog.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Faculty updated').first().waitFor();
    await context.close();
    ({ context, page } = await launch(profile, consoleErrors));
    await page.goto(`${base}#/academies`);
    await page.getByTestId('academy-list').getByText('Python Programming Academy').waitFor();
    await page.goto(`${base}#/`);
    await page.getByText('Faculty deleted: F99').waitFor();
    await page.getByText('Academy created: F01-PY').waitFor();
    log('Faculties and academies persist after a browser restart; actions appear in Recent Activity');

    // ── M2: Academic programme management ────────────────────────────────
    await page.goto(`${base}#/programmes`);
    await page.getByRole('heading', { name: 'Academic Programmes' }).waitFor();
    const newProgramme = async ({ code, name, semesters, entry, exit }) => {
      await page.getByRole('button', { name: 'New programme' }).click();
      const d = page.getByRole('dialog');
      await d.getByLabel('Code').fill(code);
      await d.locator('[data-field="name.ms"]').fill(name);
      await d.getByLabel('Number of semesters').fill(String(semesters));
      if (entry) await d.getByLabel('Entry level').selectOption({ label: entry });
      if (exit) await d.getByLabel('Exit level').selectOption({ label: exit });
      await d.getByRole('button', { name: 'Create' }).click();
      return d;
    };
    let d = await newProgramme({ code: 'PY-DIP', name: 'Diploma Python', semesters: 0 });
    await d.getByText('Please enter a number within the allowed range.').waitFor();
    await d.getByLabel('Number of semesters').fill('4');
    await d.getByLabel('Entry level').selectOption({ label: 'Advanced' });
    await d.getByLabel('Exit level').selectOption({ label: 'Beginner' });
    await d.getByRole('button', { name: 'Create' }).click();
    await d.getByText('The exit level cannot be lower than the entry level.').waitFor();
    log('Programme form validates semester count and level order');

    await d.getByLabel('Entry level').selectOption({ label: 'Absolute Beginner' });
    await d.getByLabel('Exit level').selectOption({ label: 'Professional' });
    await d.locator('[data-field="name.en"]').fill('Python Diploma');
    await d.getByRole('button', { name: 'Add' }).click();
    await d.getByLabel('Completion requirements 1 — Bahasa Melayu').fill('Lulus semua kursus teras');
    await d.getByLabel('Completion requirements 1 — English').fill('Pass all core courses');
    await d.getByRole('button', { name: 'Create' }).click();
    await page.getByText('Programme created').first().waitFor();
    const plist = page.getByTestId('programme-list');
    await plist.getByText('Python Diploma').waitFor();
    assert.ok(await plist.getByText('4 semesters · 0 courses').isVisible());
    assert.ok(await plist.getByText('Absolute Beginner').isVisible());
    log('Programme created with its own semester count; semesters 1–4 created automatically');

    await page.getByRole('button', { name: 'Edit: Python Diploma' }).click();
    d = page.getByRole('dialog');
    assert.ok(await d.getByLabel('Academy').isDisabled(), 'academy is locked after creation');
    assert.equal(await d.getByLabel('Completion requirements 1 — English').inputValue(), 'Pass all core courses');
    await d.getByLabel('Number of semesters').fill('2');
    await d.getByRole('button', { name: 'Save' }).click();
    await d.getByText('Cannot be lower than semesters that already exist.').waitFor();
    await d.getByLabel('Number of semesters').fill('6');
    await d.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Programme updated').first().waitFor();
    assert.ok(await plist.getByText('4 semesters · 0 courses').isVisible(), 'raising the total does not invent semesters');
    log('Programme edit: academy locked, cannot shrink below existing semesters, can grow');

    d = await newProgramme({ code: 'TMP', name: 'Program Sementara', semesters: 3 });
    await page.getByText('Programme created').first().waitFor();
    await page.getByRole('button', { name: 'Delete: Program Sementara' }).click();
    await page.getByText('These owned records will also be deleted:').waitFor();
    assert.ok(await page.getByText('3 × Semesters').isVisible());
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await page.getByText('Programme deleted').first().waitFor();
    assert.equal(await plist.getByText('Program Sementara').count(), 0);
    log('Deleting a programme with only empty semesters removes them with it (shown before confirming)');

    await page.goto(`${base}#/academies`);
    await page.getByRole('button', { name: 'Delete: Python Programming Academy' }).click();
    await page.getByTestId('delete-blocked').getByText('1 × Programmes').waitFor();
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('link', { name: '1 programmes' }).click();
    await page.getByTestId('programme-list').getByText('Python Diploma').waitFor();
    log('Deleting an academy with a programme is blocked; academy → programmes link filters');

    // Integrity + mobile.
    await page.goto(`${base}#/backup`);
    await page.getByRole('button', { name: 'Run check' }).click();
    await page.getByText(/No issues found in/).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ['faculties', 'academies', 'programmes']) {
      await page.goto(`${base}#/${path}`);
      await page.waitForTimeout(200);
      assert.ok((await horizontalOverflow(page)) <= 0, `overflow on /${path}`);
    }
    await page.goto(`${base}#/academies`);
    await page.getByRole('button', { name: 'New academy' }).click();
    assert.ok(await page.getByRole('dialog').getByLabel('Code').isVisible());
    assert.ok((await horizontalOverflow(page)) <= 0, 'overflow with dialog open');
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
    log('Integrity check clean; faculty/academy/programme pages and form fit a 390px phone');

    await context.close();
    assert.deepEqual(consoleErrors, [], `console errors:\n${consoleErrors.join('\n')}`);
    log('No console errors');
    console.log(`\nUniversity E2E passed (${count()} checks).`);
  } finally {
    stop();
  }
}

main().catch((err) => {
  console.error('\nUNIVERSITY E2E FAILED:', err);
  process.exit(1);
});
