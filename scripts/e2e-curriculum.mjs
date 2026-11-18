/**
 * End-to-end test for Curriculum Seeding — Milestone 1 (real Chromium, production build).
 *   npm run build && node scripts/e2e-curriculum.mjs
 *
 * Expected figures are computed independently from the approved scope:
 *   7 faculties, 15 academies, 1 programme, 8 semesters, 31 courses, 124 modules,
 *   372 lectures, 44 prerequisite links = 602 records; 107 credit hours.
 */
import assert from 'node:assert/strict';
import { createLogger, horizontalOverflow, launch, startServer, tempDir } from './e2e-lib.mjs';

const { log, count } = createLogger();
const consoleErrors = [];
const EXPECTED_COUNTS = '7 fakulti · 15 akademi · 1 program · 8 semester · 31 kursus · 124 modul · 372 kuliah · 44 pautan prasyarat';

const readStore = (page, store) =>
  page.evaluate(
    (store) =>
      new Promise((resolve, reject) => {
        const q = indexedDB.open('qhaze-tech-university');
        q.onerror = () => reject(q.error);
        q.onsuccess = () => {
          const db = q.result;
          const r = db.transaction(store).objectStore(store).getAll();
          r.onsuccess = () => {
            db.close();
            resolve(r.result);
          };
        };
      }),
    store,
  );

async function main() {
  const { base, stop } = await startServer(4187);
  const profile = tempDir('qhaze-e2e-cur-');
  try {
    let { context, page } = await launch(profile, consoleErrors);
    await page.goto(base);
    await page.getByLabel('Nama Penuh').fill('Nur Aisyah binti Ahmad');
    await page.getByLabel('Nama Panggilan').fill('Aisyah');
    await page.getByLabel(/^Bio/).fill('Pelajar sepenuh masa.');
    await page.getByRole('button', { name: 'Daftar sebagai pelajar' }).click();
    await page.getByRole('heading', { name: 'Selamat kembali, Aisyah' }).waitFor();
    const studentBefore = (await readStore(page, 'students'))[0];

    // ── Dry run in the UI ────────────────────────────────────────────────
    await page.getByRole('link', { name: 'Fakulti Saya' }).click();
    await page.getByRole('button', { name: 'Pakej kurikulum' }).click();
    const card = page.getByTestId('package-card').filter({ hasText: 'Teras Universiti — Milestone 1' });
    await card.getByText('Teras Universiti — Milestone 1').waitFor();
    assert.ok(await card.getByText(EXPECTED_COUNTS).isVisible(), 'package counts');
    await card.getByText('Akan dicipta: 602 rekod. Sedia ada dan digunakan semula: 0.').waitFor();
    assert.ok(await card.getByText('Sebelum pemasangan kurikulum', { exact: false }).isVisible(), 'safety note');
    log('Package dry run: 602 records to create (7 faculties … 44 prerequisite links), safety note shown');

    // ── Install ──────────────────────────────────────────────────────────
    const started = Date.now();
    await card.getByRole('button', { name: 'Pasang pakej' }).click();
    await page.getByRole('dialog', { name: 'Pasang pakej kurikulum?' }).getByRole('button', { name: 'Pasang pakej' }).click();
    await page.getByText('Pakej dipasang: 602 rekod dicipta.').waitFor({ timeout: 60_000 });
    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    await card.getByText('Dipasang — semua rekod pakej ini sudah wujud.', { exact: false }).waitFor();
    assert.equal(await card.getByRole('button', { name: 'Pasang pakej' }).count(), 0, 'nothing left to install');
    log(`Installed through the UI in ${seconds}s; package now reports "installed", no second install offered`);
    await page.getByRole('dialog').getByRole('button', { name: 'Tutup' }).first().click();

    // ── Verify the 7 faculties and Faculty 01 ────────────────────────────
    const faculties = page.getByTestId('faculty-list');
    for (const name of [
      'Pengaturcaraan & Kejuruteraan Perisian',
      'Kecerdasan Buatan',
      'Pembangunan Permainan',
      'Matematik & Sains Komputer',
      'Sains & Kejuruteraan Data',
      'Reka Bentuk 3D & Produksi Digital',
      'Teknologi & Produksi Muzik',
    ]) {
      await faculties.getByRole('heading', { name, exact: true }).waitFor();
    }
    assert.equal(await faculties.locator('li').count(), 7);
    assert.equal(await faculties.getByText('15 akademi').count(), 1);
    assert.equal(await faculties.getByText('0 akademi').count(), 6);
    log('Exactly 7 faculties; only Faculty 01 has academies (15)');

    await faculties.getByText('15 akademi').click();
    const academies = page.getByTestId('academy-list');
    await academies.getByText('Akademi Pengaturcaraan Python').waitFor();
    assert.equal(await academies.locator('li').count(), 15);
    assert.ok(await academies.getByText('Akademi Pengaturcaraan Lua', { exact: true }).isVisible());
    assert.ok(await academies.getByText('Akademi Pengaturcaraan Luau', { exact: true }).isVisible());
    log('Faculty 01 shows its 15 academies; Lua and Luau are separate academies');

    // ── Programme, semesters, courses, modules, prerequisites ────────────
    await academies.getByRole('link', { name: '1 program' }).click();
    const programmes = page.getByTestId('programme-list');
    await programmes.getByText('Program Pengaturcaraan Python: Asas hingga Profesional').waitFor();
    assert.ok(await programmes.getByText('8 semester · 31 kursus').isVisible());
    await programmes.getByRole('link', { name: 'Kurikulum' }).click();
    await page.getByTestId('curriculum-summary').getByText('8 semester · 31 kursus · 107 jam kredit').waitFor();
    for (let n = 1; n <= 8; n++) await page.getByTestId(`semester-${n}`).waitFor();
    await page.getByTestId('semester-1').getByRole('heading', { name: 'Asas Pengaturcaraan Python' }).waitFor();
    await page.getByTestId('semester-8').getByRole('heading', { name: 'Kejuruteraan AI dan Projek Akhir' }).waitFor();
    assert.ok(await page.getByTestId('structure-PY101').getByText('4 modul · 12 kuliah').isVisible());
    assert.ok(await page.getByTestId('prereqs-PY201').getByText('Prasyarat: PY114').isVisible());
    assert.ok(await page.getByTestId('prereqs-PY490').getByText('PY313, PY314, PY403, PY411').isVisible());
    log('Programme: 8 semesters, 31 courses, 107 credit hours; course rows show modules, lectures and prerequisites');

    await page.getByRole('button', { name: 'Sunting: PY312 Membina REST API dengan FastAPI' }).click();
    const form = page.getByRole('dialog');
    const structure = form.getByTestId('course-structure');
    await structure.getByText('4 modul · 12 kuliah').waitFor();
    assert.ok(await structure.getByText('Model Pydantic: request dan response').isVisible());
    assert.equal(await structure.locator('ol > li > ol > li').count(), 12);
    const prereqs = form.getByTestId('prerequisites');
    assert.ok(await prereqs.getByText('PY311', { exact: true }).isVisible());
    assert.ok(await prereqs.getByText('PY302', { exact: true }).isVisible());
    assert.ok(await prereqs.getByText('Diperlukan oleh: PY411').isVisible());
    assert.equal(await form.getByLabel('Hasil pembelajaran dijangka 1 — English').inputValue(), 'Build and document a production-ready API with FastAPI.');
    await form.getByRole('button', { name: 'Batal' }).click();
    log('Course PY312: 4 modules with 12 lectures, prerequisites PY311 + PY302, required by PY411, bilingual outcomes');

    // Cycle protection still applies to seeded data.
    await page.getByRole('button', { name: 'Sunting: PY101 Pengenalan Pengaturcaraan dan Python' }).click();
    await form.getByTestId('prerequisites').getByLabel('Pilih kursus').selectOption({ label: 'PY490 — Projek Akhir (Capstone)' });
    await form.getByTestId('prerequisites').getByRole('button', { name: 'Tambah prasyarat' }).click();
    await page.getByText('Ditolak: prasyarat ini akan membentuk kitaran.').waitFor();
    await form.getByRole('button', { name: 'Batal' }).click();
    log('Adding PY101 ← PY490 to the seeded curriculum is rejected as a cycle');

    // English interface
    await page.getByRole('button', { name: 'Tukar bahasa' }).click();
    await page.getByTestId('semester-1').getByRole('heading', { name: 'Python Programming Foundations' }).waitFor();
    assert.ok(await page.getByText('Introduction to Programming and Python').isVisible());
    log('English interface shows the English curriculum');

    // ── Integrity + student data ─────────────────────────────────────────
    await page.goto(`${base}#/backup`);
    await page.getByRole('button', { name: 'Run check' }).click();
    await page.getByText(/No issues found in/).waitFor();
    const studentAfter = (await readStore(page, 'students'))[0];
    assert.deepEqual(studentAfter, studentBefore, 'student record unchanged');
    log('Integrity check: no issues; student record byte-identical');

    // ── Persistence across a browser restart ─────────────────────────────
    await context.close();
    ({ context, page } = await launch(profile, consoleErrors));
    await page.goto(`${base}#/semesters`);
    await page.getByTestId('curriculum-summary').getByText('8 semesters · 31 courses · 107 credit hours').waitFor();
    assert.equal((await readStore(page, 'lectures')).length, 372);
    assert.equal((await readStore(page, 'coursePrerequisites')).length, 44);
    log('Curriculum persists after a browser restart (372 lectures, 44 prerequisite links)');

    // Mobile layout with a full curriculum
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    assert.ok((await horizontalOverflow(page)) <= 0, 'no horizontal overflow on a phone');
    await page.setViewportSize({ width: 1360, height: 900 });
    log('Full curriculum fits a 390px phone');

    // ── Recovery: restore the pre-seed recovery point ────────────────────
    await page.goto(`${base}#/backup`);
    const point = page.getByTestId('snapshot-list').locator('li').filter({ hasText: 'Before curriculum install' });
    await point.waitFor();
    await point.getByRole('button', { name: 'Restore' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Restore' }).click();
    await page.getByText('Data restored from recovery point').first().waitFor();
    assert.equal((await readStore(page, 'faculties')).length, 0);
    assert.equal((await readStore(page, 'courses')).length, 0);
    // Recovery points are JSON: optional fields stored as `undefined` come back absent — same data.
    const asJson = (v) => JSON.parse(JSON.stringify(v));
    assert.deepEqual(asJson((await readStore(page, 'students'))[0]), asJson(studentBefore));
    log('Restoring "Before curriculum install" removes the curriculum and keeps the student intact');

    // The recovery point predates the switch to English, so the interface is Malay again.
    await page.getByRole('heading', { name: 'Sandaran & Pemulihan' }).waitFor();

    // Re-install after recovery works (the procedure is repeatable).
    await page.goto(`${base}#/faculties`);
    await page.getByRole('button', { name: 'Pakej kurikulum' }).click();
    await page.getByTestId('package-card').filter({ hasText: 'Teras Universiti — Milestone 1' }).getByText('Akan dicipta: 602 rekod.', { exact: false }).waitFor();
    await page.getByTestId('package-card').filter({ hasText: 'Teras Universiti — Milestone 1' }).getByRole('button', { name: 'Pasang pakej' }).click();
    await page.getByRole('dialog', { name: 'Pasang pakej kurikulum?' }).getByRole('button', { name: 'Pasang pakej' }).click();
    await page.getByText('Pakej dipasang: 602 rekod dicipta.').waitFor({ timeout: 60_000 });
    log('After recovery the package can be installed again cleanly');

    await context.close();
    assert.deepEqual(consoleErrors, [], `console errors:\n${consoleErrors.join('\n')}`);
    log('No console errors');
    console.log(`\nCurriculum E2E passed (${count()} checks).`);
  } finally {
    stop();
  }
}

main().catch((err) => {
  console.error('\nCURRICULUM E2E FAILED:', err);
  process.exit(1);
});
