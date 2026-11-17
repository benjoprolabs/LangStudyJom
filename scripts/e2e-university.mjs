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

    // ── M3: Semester, course and prerequisite management ─────────────────
    await page.getByRole('link', { name: 'Curriculum' }).first().click();
    await page.getByRole('heading', { name: 'Semester Management' }).waitFor();
    const summary = page.getByTestId('curriculum-summary');
    await summary.getByText('4 semesters · 0 courses · 0 credit hours').waitFor();
    await page.getByRole('button', { name: 'Add semester' }).click();
    d = page.getByRole('dialog');
    assert.equal(await d.getByLabel('Semester number').inputValue(), '5', 'next free number is suggested');
    await d.getByLabel('Semester number').fill('4');
    await d.getByRole('button', { name: 'Create' }).click();
    await d.getByText('This semester number already exists in the programme.').waitFor();
    await d.getByLabel('Semester number').fill('7');
    await d.getByRole('button', { name: 'Create' }).click();
    await d.getByText('Please enter a number within the allowed range.').waitFor();
    await d.getByLabel('Semester number').fill('5');
    await d.getByRole('button', { name: 'Create' }).click();
    await summary.getByText('5 semesters · 0 courses · 0 credit hours').waitFor();
    log('Semesters: next free number suggested; duplicates and numbers beyond the programme total rejected');

    await page.getByRole('button', { name: 'Edit: Semester 1 — Semester 1' }).click();
    d = page.getByRole('dialog');
    await d.locator('[data-field="title.ms"]').fill('Asas Python');
    await d.locator('[data-field="title.en"]').fill('Python Foundations');
    await d.getByRole('button', { name: 'Save' }).click();
    await page.getByTestId('semester-1').getByRole('heading', { name: 'Python Foundations' }).waitFor();
    log('Semester titles are bilingual and editable');

    const addCourse = async (semester, code, ms, en, credits = '3') => {
      await page.getByTestId(`semester-${semester}`).getByRole('button', { name: 'Add course' }).click();
      const f = page.getByRole('dialog');
      await f.getByLabel('Code').fill(code);
      await f.locator('[data-field="title.ms"]').fill(ms);
      if (en) await f.locator('[data-field="title.en"]').fill(en);
      await f.getByLabel('Credit hours').fill(credits);
      await f.getByRole('button', { name: 'Create' }).click();
      return f;
    };
    let f = await addCourse(1, 'PY101', 'Pengenalan Python', 'Introduction to Python');
    await page.getByText('Course created').first().waitFor();
    await addCourse(1, 'PY102', 'Pemboleh Ubah dan Jenis Data', 'Variables and Data Types', '4');
    await page.getByText('Course created').first().waitFor();
    await addCourse(2, 'PY201', 'Struktur Data Python', 'Python Data Structures');
    await page.getByText('Course created').first().waitFor();
    await summary.getByText('5 semesters · 3 courses · 10 credit hours').waitFor();
    f = await addCourse(2, 'py101', 'Pendua', '');
    await f.getByText('This code is already in use.').waitFor();
    await f.getByRole('button', { name: 'Cancel' }).click();
    log('Courses created inside semesters; credit totals update; duplicate course code rejected');

    await page.getByRole('button', { name: 'Edit: PY201 Python Data Structures' }).click();
    f = page.getByRole('dialog');
    const prereq = f.getByTestId('prerequisites');
    assert.equal(await prereq.getByRole('option', { name: /PY201/ }).count(), 0, 'a course is never offered as its own prerequisite');
    await prereq.getByLabel('Select a course').selectOption({ label: 'PY101 — Introduction to Python' });
    await prereq.getByRole('button', { name: 'Add prerequisite' }).click();
    await page.getByText('Prerequisite added').first().waitFor();
    await prereq.getByText('Introduction to Python').waitFor();
    await f.getByRole('button', { name: 'Cancel' }).click();
    await page.getByTestId('prereqs-PY201').getByText('Prerequisites: PY101').waitFor();
    log('Prerequisite PY201 ← PY101 added and shown on the course row');

    await page.getByRole('button', { name: 'Edit: PY101 Introduction to Python' }).click();
    f = page.getByRole('dialog');
    await f.getByTestId('prerequisites').getByText('Required by: PY201').waitFor();
    await f.getByTestId('prerequisites').getByLabel('Select a course').selectOption({ label: 'PY201 — Python Data Structures' });
    await f.getByTestId('prerequisites').getByRole('button', { name: 'Add prerequisite' }).click();
    await page.getByText('Rejected: this prerequisite would create a cycle.').waitFor();
    assert.ok(await f.getByTestId('prerequisites').getByText('No prerequisites.').isVisible(), 'nothing was saved');
    await f.getByRole('button', { name: 'Cancel' }).click();
    log('Circular prerequisite PY101 ← PY201 rejected before saving');

    await page.getByRole('button', { name: 'Edit: PY102 Variables and Data Types' }).click();
    f = page.getByRole('dialog');
    await f.getByLabel('Semester', { exact: true }).selectOption({ index: 2 });
    await f.getByRole('button', { name: 'Save' }).click();
    await page.getByTestId('semester-3').getByText('Variables and Data Types').waitFor();
    log('A course moves to another semester of the same programme');

    await page.getByRole('button', { name: 'Delete: PY101 Introduction to Python' }).click();
    await page.getByTestId('delete-blocked').getByText('1 × Prerequisite links').waitFor();
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Delete: Semester 2 — Semester 2' }).click();
    await page.getByTestId('delete-blocked').getByText('1 × Courses').waitFor();
    assert.equal(await page.getByRole('dialog').getByRole('button', { name: 'Archive instead' }).count(), 0, 'semesters have no archive state');
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Delete: Semester 5 — Semester 5' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await page.getByText('Semester deleted').first().waitFor();
    await summary.getByText('4 semesters · 3 courses · 10 credit hours').waitFor();
    log('Course required by another and semester with courses cannot be deleted; empty semester can');

    await page.getByRole('button', { name: 'Delete: PY201 Python Data Structures' }).click();
    await page.getByText('These owned records will also be deleted:').waitFor();
    await page.getByRole('dialog').getByText('1 × Prerequisite links').waitFor();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await page.getByText('Course deleted').first().waitFor();
    await summary.getByText('4 semesters · 2 courses · 7 credit hours').waitFor();
    log('Deleting a course removes its own prerequisite links with it');

    await page.reload();
    await page.getByTestId('semester-1').getByRole('heading', { name: 'Python Foundations' }).waitFor();
    await page.getByTestId('semester-3').getByText('Variables and Data Types').waitFor();
    log('Curriculum persists after reload');

    // Integrity + mobile.
    await page.goto(`${base}#/backup`);
    await page.getByRole('button', { name: 'Run check' }).click();
    await page.getByText(/No issues found in/).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ['faculties', 'academies', 'programmes', 'semesters']) {
      await page.goto(`${base}#/${path}`);
      await page.waitForTimeout(200);
      assert.ok((await horizontalOverflow(page)) <= 0, `overflow on /${path}`);
    }
    await page.goto(`${base}#/academies`);
    await page.getByRole('button', { name: 'New academy' }).click();
    assert.ok(await page.getByRole('dialog').getByLabel('Code').isVisible());
    assert.ok((await horizontalOverflow(page)) <= 0, 'overflow with dialog open');
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
    log('Integrity check clean; all university pages and forms fit a 390px phone');

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
