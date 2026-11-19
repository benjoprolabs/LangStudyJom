/**
 * End-to-end test for curriculum delivery (real Chromium, production build, clean profile, phone width):
 * structure-only labels, the Library's "course materials not installed" notice and its direct link,
 * "Install all" (confirmation, ordered progress, skip of an installed package, success message),
 * no duplicates, Library default programme, and student data unchanged.
 *   npm run build && node scripts/e2e-packages.mjs
 */
import assert from 'node:assert/strict';
import { createLogger, horizontalOverflow, launch, startServer, tempDir } from './e2e-lib.mjs';

const { log, count } = createLogger();
const consoleErrors = [];
const PHONE = { width: 390, height: 844 };

const readStore = (page, store) =>
  page.evaluate(
    (store) =>
      new Promise((resolve, reject) => {
        const q = indexedDB.open('qhaze-tech-university');
        q.onerror = () => reject(q.error);
        q.onsuccess = () => {
          const r = q.result.transaction(store).objectStore(store).getAll();
          r.onsuccess = () => {
            q.result.close();
            resolve(r.result);
          };
        };
      }),
    store,
  );

async function main() {
  const { base, stop } = await startServer(4191);
  const profile = tempDir('qhaze-e2e-pkg-');
  try {
    let { context, page } = await launch(profile, consoleErrors, PHONE);
    await page.goto(base);
    await page.getByLabel('Nama Penuh').fill('Siti Hajar binti Omar');
    await page.getByLabel('Nama Panggilan').fill('Hajar');
    await page.getByRole('button', { name: 'Daftar sebagai pelajar' }).click();
    await page.getByRole('heading', { name: 'Selamat kembali, Hajar' }).waitFor();
    const studentBefore = (await readStore(page, 'students'))[0];

    // ── Labels: Milestone 1 and 2 are structure only; course materials not yet installable ──
    await page.goto(`${base}#/faculties`);
    await page.getByRole('button', { name: 'Pakej kurikulum' }).click();
    const cards = page.getByTestId('package-card');
    await cards.first().waitFor();
    assert.equal(await cards.count(), 2);
    for (const i of [0, 1]) await cards.nth(i).getByText('Struktur sahaja — tiada kandungan kuliah').waitFor();
    const contentCard = page.getByTestId('content-package-card');
    await contentCard.getByText('Pasang pakej kurikulum yang berkaitan dahulu', { exact: false }).waitFor();
    assert.equal(await contentCard.getAttribute('data-next-step'), 'no');
    await page.getByTestId('install-all-button').waitFor();
    assert.ok((await horizontalOverflow(page)) <= 0, 'packages dialog fits 390px');
    log('Milestone 1 and 2 labelled "Struktur sahaja — tiada kandungan kuliah"; Install all offered; dialog fits a 390px phone');

    // Install Milestone 1 on its own first, so Install all must skip it.
    const m1 = cards.filter({ hasText: 'Teras Universiti — Milestone 1' });
    await m1.getByRole('button', { name: 'Pasang pakej' }).click();
    await page.getByRole('dialog', { name: 'Pasang pakej kurikulum?' }).getByRole('button', { name: 'Pasang pakej' }).click();
    await m1.getByText('Dipasang — semua rekod pakej ini sudah wujud.').waitFor({ timeout: 60_000 });
    await page.getByRole('dialog').getByRole('button', { name: 'Tutup' }).first().click();

    // ── Library: structure exists, no content → notice with a direct link to the content package ──
    await page.goto(`${base}#/library`);
    const notice = page.getByTestId('content-missing');
    await notice.getByText('Bahan kursus belum dipasang — pasang Bahan Kursus').waitFor();
    assert.ok((await horizontalOverflow(page)) <= 0, 'library with notice fits 390px');
    await page.getByTestId('install-content-link').click();
    await page.waitForURL(/#\/faculties$/);
    await contentCard.waitFor();
    assert.ok(await contentCard.isVisible(), 'the link opens the packages dialog at the course materials');
    log('Library shows "Bahan kursus belum dipasang — pasang Bahan Kursus"; its button opens the packages dialog at the course materials');

    // ── Install all: confirmation, ordered progress, skip, success ──
    await page.getByTestId('install-all-button').click();
    const confirm = page.getByRole('dialog', { name: 'Pasang semua pakej?' });
    await confirm.waitFor();
    const listed = await confirm.locator('ol li').allInnerTexts();
    assert.deepEqual(listed, ['Teras Universiti — Milestone 1', 'Lua & Luau — Milestone 2', 'Bahan Kursus Lua & Luau — Keluaran 9']);
    await confirm.getByRole('button', { name: 'Batal' }).click();
    assert.equal(await page.getByTestId('install-all-progress').count(), 0, 'cancel installs nothing');
    assert.equal((await readStore(page, 'programmes')).length, 1, 'still only the Python programme after cancel');
    await page.getByTestId('install-all-button').click();
    await confirm.getByRole('button', { name: 'Pasang semua' }).click();
    const outcome = page.getByTestId('install-all-outcome');
    await outcome.waitFor({ timeout: 180_000 });
    assert.equal(await outcome.getAttribute('data-ok'), 'yes', await outcome.innerText());
    await outcome.getByText('Semua pakej dipasang.', { exact: false }).waitFor();
    const steps = await page.getByTestId('install-all-progress').locator('li').evaluateAll((els) => els.map((e) => e.getAttribute('data-step-status')));
    assert.deepEqual(steps, ['skipped', 'done', 'done']);
    await page.getByTestId('install-all-status').getByText('Semua pakej sudah dipasang dan terkini.').waitFor();
    assert.equal(await page.getByTestId('install-all-button').count(), 0, 'no Install all once everything is installed');
    assert.equal(await page.getByRole('dialog').getByRole('button', { name: 'Pasang pakej' }).count(), 0, 'no card offers an install');
    await contentCard.getByText('Dipasang — semua kandungan sudah terkini.').waitFor();
    log('Install all: confirmation lists 3 packages in order; Cancel installs nothing; progress shows M1 skipped, M2 and course materials installed; success message; nothing left to install');

    // ── No duplicates; exactly the written content ──
    const [lectures, glossary, programmes] = await Promise.all(['lectures', 'glossaryTerms', 'programmes'].map((s) => readStore(page, s)));
    assert.equal(lectures.length, 984);
    assert.equal(new Set(lectures.map((x) => `${x.moduleId}#${x.order}`)).size, 984, 'no duplicate lecture slot');
    assert.equal(lectures.filter((x) => x.sections.length > 0).length, 97);
    assert.equal(glossary.length, 80);
    assert.equal(programmes.length, 3);
    log('Database: 984 lectures (no duplicates), 97 with full content, 80 glossary terms, 3 programmes');

    // ── Library opens on LUA-PROG; notice gone ──
    await outcome.getByRole('link', { name: 'Buka Perpustakaan Kursus' }).click();
    await page.getByTestId('course-LUA101').waitFor();
    const lua = programmes.find((p) => p.code === 'LUA-PROG');
    assert.equal(await page.getByRole('combobox', { name: 'Program' }).inputValue(), lua.id);
    assert.equal(await page.getByTestId('content-missing').count(), 0);
    for (const code of ['LUA101', 'LUA102', 'LUA103', 'LUA104']) {
      await page.getByTestId(`course-${code}`).getByText('12/12 kuliah berkandungan').waitFor();
    }
    assert.ok((await horizontalOverflow(page)) <= 0);
    log('Library opens on LUA-PROG with LUA101–LUA104 at 12/12; the notice is gone');

    // ── Student data: unchanged by installs; progress, note and bookmark survive re-checks and a restart ──
    assert.deepEqual((await readStore(page, 'students'))[0], studentBefore, 'student record unchanged by Install all');
    const course = (await readStore(page, 'courses')).find((c) => c.code === 'LUA101');
    const lid = lectures.find((x) => x.courseId === course.id && x.sections.length > 0 && x.order === 1)?.id;
    await page.goto(`${base}#/lecture-room?lecture=${lid}`);
    const article = page.getByTestId('lecture-article');
    await article.getByRole('button', { name: 'Tanda buku' }).click();
    await article.getByRole('button', { name: 'Ditanda' }).waitFor();
    await article.getByLabel(/Nota peribadi/).fill('Indeks Lua bermula pada 1.');
    await page.getByRole('button', { name: 'Tandakan selesai' }).click();
    await page.getByRole('button', { name: 'Selesai' }).waitFor();
    await page.waitForTimeout(1500);
    const snapshot = async () => ({
      students: await readStore(page, 'students'),
      progress: await readStore(page, 'progress'),
      notes: await readStore(page, 'notes'),
      bookmarks: await readStore(page, 'bookmarks'),
      lectures: (await readStore(page, 'lectures')).length,
    });
    const before = await snapshot();
    assert.ok(before.notes.some((n) => n.body === 'Indeks Lua bermula pada 1.'));
    assert.ok(before.progress.some((p) => p.entityId === lid && p.status === 'completed'));
    await page.goto(`${base}#/faculties`);
    await page.getByRole('button', { name: 'Pakej kurikulum' }).click();
    await page.getByTestId('install-all-status').getByText('Semua pakej sudah dipasang dan terkini.').waitFor();
    await page.getByRole('dialog').getByRole('button', { name: 'Tutup' }).first().click();
    await context.close();
    ({ context, page } = await launch(profile, consoleErrors, { width: 1360, height: 900 }));
    await page.goto(`${base}#/faculties`);
    await page.getByRole('button', { name: 'Pakej kurikulum' }).click();
    await page.getByTestId('install-all-status').waitFor();
    assert.ok((await horizontalOverflow(page)) <= 0, 'packages dialog fits desktop');
    assert.deepEqual(await snapshot(), before, 'progress, note, bookmark, student and lectures unchanged');
    log('Completion, note and bookmark unchanged after re-opening packages and a browser restart (desktop width)');

    assert.deepEqual(consoleErrors, []);
    log('No console errors');
    await context.close();
    console.log(`\nPackages E2E passed (${count()} checks).`);
  } finally {
    stop();
  }
}

main().catch((e) => {
  console.error('PACKAGES E2E FAILED:', e);
  process.exit(1);
});
