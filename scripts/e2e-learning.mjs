/**
 * End-to-end test for Curriculum Seeding — Milestone 2 (Lua & Luau) and the
 * Professional Programming Education Standard reader (real Chromium, production build).
 *   npm run build && node scripts/e2e-learning.mjs
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createLogger, horizontalOverflow, launch, startServer, tempDir } from './e2e-lib.mjs';

const { log, count } = createLogger();
const consoleErrors = [];

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

async function save(page, downloadsDir, click) {
  const [download] = await Promise.all([page.waitForEvent('download'), click()]);
  const path = join(downloadsDir, download.suggestedFilename());
  await download.saveAs(path);
  return { name: download.suggestedFilename(), path };
}

async function installPackage(page, title, expectToast) {
  const card = page.getByTestId('package-card').filter({ hasText: title });
  await card.getByRole('button', { name: 'Pasang pakej' }).click();
  await page.getByRole('dialog', { name: 'Pasang pakej kurikulum?' }).getByRole('button', { name: 'Pasang pakej' }).click();
  await page.getByText(expectToast).first().waitFor({ timeout: 60_000 });
  await card.getByText('Dipasang — semua rekod pakej ini sudah wujud.', { exact: false }).waitFor();
}

async function lectureId(page, courseCode, moduleOrder, lectureOrder) {
  const [courses, modules, lectures] = await Promise.all(['courses', 'modules', 'lectures'].map((s) => readStore(page, s)));
  const course = courses.find((c) => c.code === courseCode);
  const module = modules.find((m) => m.courseId === course.id && m.order === moduleOrder);
  return lectures.find((l) => l.moduleId === module.id && l.order === lectureOrder).id;
}

async function main() {
  const { base, stop } = await startServer(4188);
  const profile = tempDir('qhaze-e2e-learn-');
  const downloadsDir = tempDir('qhaze-e2e-learn-dl-');
  try {
    let { context, page } = await launch(profile, consoleErrors);
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
    await page.goto(base);
    await page.getByLabel('Nama Penuh').fill('Nur Aisyah binti Ahmad');
    await page.getByLabel('Nama Panggilan').fill('Aisyah');
    await page.getByRole('button', { name: 'Daftar sebagai pelajar' }).click();
    await page.getByRole('heading', { name: 'Selamat kembali, Aisyah' }).waitFor();
    const studentBefore = (await readStore(page, 'students'))[0];

    // ── Packages: course materials are blocked until the structure exists ──
    await page.getByRole('link', { name: 'Fakulti Saya' }).click();
    await page.getByRole('button', { name: 'Pakej kurikulum' }).click();
    const contentCard = page.getByTestId('content-package-card');
    await contentCard.getByText('Pasang pakej kurikulum yang berkaitan dahulu', { exact: false }).waitFor();
    assert.equal(await contentCard.getByRole('button', { name: 'Pasang pakej' }).count(), 0, 'no install offered without structure');
    await contentCard.getByText('LUA102 1.1').waitFor();
    log('Course materials package refuses to install before the Lua/Luau structure exists');

    await installPackage(page, 'Teras Universiti — Milestone 1', 'Pakej dipasang: 602 rekod dicipta.');
    const m2 = page.getByTestId('package-card').filter({ hasText: 'Lua & Luau — Milestone 2' });
    await m2.getByText('Akan dicipta: 957 rekod. Sedia ada dan digunakan semula: 3.').waitFor();
    await installPackage(page, 'Lua & Luau — Milestone 2', /Pakej dipasang: \d+ rekod dicipta\./);
    log('M1 then M2 installed through the UI; the M2 plan refreshes and reuses Faculty 01 + both academies (957 new, 3 reused)');

    await contentCard.getByText('Akan ditulis: 14 kuliah dan 28 istilah glosari.').waitFor();
    await contentCard.getByRole('button', { name: 'Pasang pakej' }).click();
    await page.getByText('Bahan kursus dipasang: 42 item ditulis.').waitFor();
    await contentCard.getByText('Dipasang — semua kandungan sudah terkini.').waitFor();
    log('Course materials 1.1.0 installed (14 lectures: LUA101 ×12 + 2 reference lectures; 28 glossary terms); package then reports up to date');
    await page.getByRole('dialog').getByRole('button', { name: 'Tutup' }).first().click();

    const programmes = await readStore(page, 'programmes');
    const [courses, semesters] = await Promise.all([readStore(page, 'courses'), readStore(page, 'semesters')]);
    const lua = programmes.find((p) => p.code === 'LUA-PROG');
    const luau = programmes.find((p) => p.code === 'LUAU-PROG');
    assert.ok(lua && luau && lua.id !== luau.id, 'two separate programmes');
    const luaCourses = courses.filter((c) => c.programmeId === lua.id);
    const luauCourses = courses.filter((c) => c.programmeId === luau.id);
    assert.equal(luaCourses.length, 24);
    assert.equal(luauCourses.length, 27);
    assert.ok(luaCourses.every((c) => /^LUA\d/.test(c.code)) && luauCourses.every((c) => c.code.startsWith('LUAU')));
    assert.equal(semesters.filter((s) => s.programmeId === lua.id).length, 6);
    assert.equal(semesters.filter((s) => s.programmeId === luau.id).length, 7);
    assert.equal(courses.filter((c) => c.code.startsWith('PY')).length, 31, 'Python curriculum untouched');
    log('Database: Lua (6 semesters, 24 LUA courses) and Luau (7 semesters, 27 LUAU courses) are separate; Python intact');

    // ── Library ───────────────────────────────────────────────────────────
    await page.getByRole('link', { name: 'Perpustakaan Kursus' }).click();
    await page.getByLabel('Program').selectOption(lua.id);
    const lib = page.getByTestId('library');
    await lib.getByTestId('course-LUA101').waitFor();
    assert.equal(await lib.locator('[data-testid^="course-LUAU"]').count(), 0, 'no Luau courses in the Lua programme');
    const lua102 = lib.getByTestId('course-LUA102');
    await lua102.locator('summary').click();
    await lua102.getByText('1/12 kuliah berkandungan').waitFor();
    const lua101 = lib.getByTestId('course-LUA101');
    await lua101.locator('summary').click();
    await lua101.getByText('12/12 kuliah berkandungan').waitFor();
    assert.equal(await lua101.getByText('Belum lengkap · struktur sahaja').count(), 0, 'every LUA101 lecture is written');
    await lua102.getByText('Kandungan lengkap').waitFor();
    assert.equal(await lua102.getByText('Belum lengkap · struktur sahaja').count(), 11);
    await page.getByLabel('Program').selectOption(luau.id);
    await lib.getByTestId('course-LUAU203').waitFor();
    assert.equal(await lib.locator('[data-testid^="course-LUA1"], [data-testid^="course-LUA2"], [data-testid^="course-LUA3"]').count(), 0);
    await page.getByTestId('glossary-list').locator('[data-term="datastore"]').waitFor();
    await page.getByLabel('Cari istilah').fill('metatab');
    assert.equal(await page.getByTestId('glossary-list').locator('li').count(), 1);
    log('Library: programme selector keeps Lua and Luau apart; LUA101 12/12 written, LUA102 1/12; glossary search');

    // ── Reader: 28-section lecture ───────────────────────────────────────
    const luaLecture = await lectureId(page, 'LUA102', 1, 1);
    await page.goto(`${base}#/lecture-room?lecture=${luaLecture}`);
    const article = page.getByTestId('lecture-article');
    await article.getByRole('heading', { name: 'Pemboleh ubah global dan local' }).waitFor();
    assert.equal(await page.getByTestId('lecture-meta').locator('dt').count(), 4);
    assert.equal(await article.locator('section[data-section]').count(), 24);
    assert.equal(await page.locator('aside').getByTestId('toc').locator('li').count(), 28, 'table of contents lists all 28 sections');
    await page.locator('aside').getByTestId('toc').getByRole('button', { name: 'Rujukan' }).click();
    await page.waitForFunction(() => document.getElementById('sec-references').getBoundingClientRect().top < 400);
    log('Lecture LUA102 1.1: 4 generated + 24 authored sections, 28-entry table of contents navigates');

    // Code blocks: runtime badge, expected output, copy, download.
    const demo = article.locator('figure, div').filter({ has: page.getByTestId('output-demo-basic') }).first();
    assert.equal(await page.getByTestId('output-demo-basic').textContent(), 'Aisyah\t10\nNew score:\t15');
    assert.equal(await page.getByTestId('status-LUA102 1.1#demo-basic').getAttribute('data-status'), 'executed');
    assert.match(await page.getByTestId('status-LUA102 1.1#demo-basic').innerText(), /Dilaksanakan · output disahkan \(Lua 5\.4\.\d+ \(lupa/);
    // Run Code: Lua 5.4 compiled to WebAssembly in a Web Worker, compared with the expected output.
    const demoFig = page.locator('figure[data-code-id="demo-basic"]');
    await demoFig.getByRole('button', { name: 'Jalankan', exact: true }).click();
    await demoFig.getByTestId('run-verdict').waitFor({ timeout: 20_000 });
    assert.equal(await demoFig.getByTestId('run-verdict').getAttribute('data-matches'), 'yes');
    assert.equal(await demoFig.getByTestId('run-output').innerText(), 'Aisyah\t10\nNew score:\t15');
    // Explain This Code: the lecture's line-by-line notes for this example, inline.
    await demoFig.getByRole('button', { name: 'Terangkan kod ini: Global berbanding local' }).click();
    assert.ok(await demoFig.getByTestId('explain-demo-basic').getByText('Baris 1–2').isVisible());
    // Error & debugging: the buggy variant, its verified error, and running it reproduces that error.
    await demoFig.getByTestId('debug-demo-basic').locator('summary').click();
    assert.equal(await demoFig.getByTestId('debug-error-demo-basic').innerText(), "example:8: attempt to perform arithmetic on a nil value (global 'scroe')");
    assert.equal(await demoFig.getByTestId('status-LUA102 1.1#demo-basic:debug').getAttribute('data-status'), 'error-matched');
    await demoFig.getByRole('button', { name: 'Jalankan versi berpepijat' }).click();
    await demoFig.getByTestId('debug-demo-basic').getByTestId('run-verdict').waitFor({ timeout: 20_000 });
    assert.equal(await demoFig.getByTestId('debug-demo-basic').getByTestId('run-error').innerText(), "example:8: attempt to perform arithmetic on a nil value (global 'scroe')");
    assert.equal(await demoFig.getByTestId('debug-demo-basic').getByTestId('run-verdict').getAttribute('data-matches'), 'yes');
    const statuses = await page.locator('[data-status]').evaluateAll((els) => els.map((e) => e.getAttribute('data-status')));
    assert.ok(statuses.length >= 11 && statuses.every((x) => x === 'executed' || x === 'error-matched'), statuses.join());
    await article.getByRole('button', { name: 'Salin: Global berbanding local' }).click();
    // Line numbers match the line-by-line explanation ("Baris 14" → print(describe())) and are not copied.
    const scopeBlock = article.locator('figure').filter({ has: page.getByTestId('output-scope-blocks') });
    assert.equal((await scopeBlock.locator('[data-line="14"]').innerText()).replace(/^14/, '').trim(), 'print(describe())');
    assert.ok(await article.getByText('Baris 14', { exact: true }).isVisible());
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    assert.ok(clip.includes('local playerName = "Aisyah"') && !/^\s*\d+\s/m.test(clip.split('\n')[0]), 'copied code without line numbers');
    const file = await save(page, downloadsDir, () => article.getByRole('button', { name: 'Muat turun fail: demo-basic.lua' }).click());
    assert.ok(readFileSync(file.path, 'utf-8').startsWith('-- Global: no'));
    // The downloaded file really runs on Lua 5.4 and prints the documented output.
    const ran = execFileSync('python3', ['tools/code-verification/run-lua54.py'], { input: readFileSync(file.path), encoding: 'utf-8' });
    assert.equal(ran.trimEnd(), 'Aisyah\t10\nNew score:\t15');
    log('Code example: execution status from the manifest, Run in the browser (Lua 5.4 WASM) matches, Explain, debug variant reproduces its error, copy, .lua download runs on Lua 5.4');

    // Glossary popover + bookmark.
    await article.locator('[data-term="variable"]').first().click();
    const panel = page.getByTestId('glossary-panel');
    await panel.waitFor();
    await page.getByRole('dialog', { name: /Variable/ }).waitFor();
    await panel.getByRole('button', { name: 'Tanda konsep ini' }).click();
    await panel.getByRole('button', { name: 'Konsep ditanda' }).waitFor();
    await panel.locator('[data-term="scope"]').click();
    await page.getByRole('dialog', { name: /Scope/ }).waitFor();
    assert.ok(await panel.locator('a[target="_blank"]').first().isVisible(), 'external reference');
    assert.ok((await panel.getByText('(membuka laman web luar)').count()) > 0, 'external link indicator');
    await page.keyboard.press('Escape');
    const bookmarks = await readStore(page, 'bookmarks');
    assert.equal(bookmarks.filter((b) => b.entityType === 'glossary').length, 1);
    log('Click-to-Learn: term opens its panel, related concept navigation, external-link indicator, concept bookmarked');

    // Lecture actions: bookmark, Markdown, ZIP.
    await article.getByRole('button', { name: 'Tanda buku' }).click();
    await article.getByRole('button', { name: 'Ditanda' }).waitFor();
    const md = await save(page, downloadsDir, () => article.getByRole('button', { name: 'Kuliah (.md)' }).click());
    const mdText = readFileSync(md.path, 'utf-8');
    assert.match(md.name, /^LUA102-1_1\.md$/);
    assert.ok(mdText.includes('```lua') && mdText.includes('## Demonstrasi Kod') && mdText.includes('QHAZE TECH UNIVERSITY'));
    assert.ok(!mdText.includes('Buka Pusat Latihan') && !/^\W*(Jawapan|Answer)\s*:/im.test(mdText), 'no practice card or answers in course material');
    const zip = await save(page, downloadsDir, () => article.getByRole('button', { name: 'Kod sumber (.zip)' }).click());
    const listing = execFileSync('unzip', ['-l', zip.path], { encoding: 'utf-8' });
    execFileSync('unzip', ['-tq', zip.path]);
    assert.ok(listing.includes('01-demo-basic.lua'), listing);
    log(`Lecture bookmarked; ${md.name} (no practice/answers) and ${zip.name} (CRC-valid, ${listing.match(/(\d+) files/)[1]} files) downloaded`);

    // Notes autosave.
    await article.getByLabel(/Nota peribadi/).fill('Guna local secara lalai.');
    await page.getByText('Disimpan').first().waitFor();

    // Reading progress persists.
    await page.evaluate(() => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * 0.6));
    await page.waitForTimeout(1500);
    let progress = (await readStore(page, 'progress')).find((p) => p.entityId === luaLecture);
    assert.equal(progress.status, 'in_progress');
    assert.ok(progress.percent >= 55 && progress.percent <= 65, `percent ${progress.percent}`);
    await context.close();
    ({ context, page } = await launch(profile, consoleErrors));
    await page.goto(`${base}#/lecture-room`);
    await page.getByRole('heading', { name: 'Pemboleh ubah global dan local' }).waitFor();
    await page.waitForFunction(() => window.scrollY > 0.5 * (document.documentElement.scrollHeight - innerHeight));
    assert.equal(await page.getByLabel(/Nota peribadi/).inputValue(), 'Guna local secara lalai.');
    await page.locator('aside').getByTestId('reading-progress').getByText(/Kemajuan bacaan: (5\d|6\d)%/).waitFor();
    const reopened = (await readStore(page, 'progress')).find((p) => p.entityId === luaLecture);
    assert.ok(Math.abs(reopened.position - progress.position) < 0.05, 'reopening does not overwrite the saved position');
    log(`Reading progress (${Math.round(progress.percent)}%), scroll position and notes restored after a browser restart; Lecture Room resumes the last lecture`);

    await page.getByRole('button', { name: 'Tandakan selesai' }).click();
    await page.getByRole('button', { name: 'Selesai' }).waitFor();
    progress = (await readStore(page, 'progress')).find((p) => p.entityId === luaLecture);
    assert.equal(progress.status, 'completed');
    assert.equal(progress.percent, 100);
    log('Completion is an explicit action (opening/scrolling never completes a lecture)');

    // Previous / next + structure-only lecture is honest.
    await page.getByRole('link', { name: /Kuliah seterusnya/ }).click();
    await page.getByText('Kandungan kuliah ini belum ditulis — bahan pembelajaran belum lengkap').waitFor();
    await page.getByTestId('incomplete-badge').waitFor();
    assert.equal(await page.getByRole('button', { name: 'Tandakan selesai' }).count(), 0, 'structure-only lecture cannot be completed');
    await page.waitForTimeout(1200);
    const structureOnlyId = new URL(page.url().replace('#/', '')).searchParams.get('lecture');
    assert.equal((await readStore(page, 'progress')).filter((p) => p.entityId === structureOnlyId).length, 0, 'no progress recorded for an incomplete lecture');
    assert.equal(await page.getByRole('button', { name: 'Kod sumber (.zip)' }).count(), 0);
    await page.getByRole('link', { name: /Kuliah sebelumnya/ }).waitFor();
    log('Next/previous navigation; a structure-only lecture is labelled incomplete, offers no completion and records no progress');

    // ── Luau lecture: Roblox examples marked and never claimed as executed ──
    // ── LUA101 4.2: io.read examples run in the browser with their documented input ──
    const ioLecture = await lectureId(page, 'LUA101', 4, 2);
    await page.goto(`${base}#/lecture-room?lecture=${ioLecture}`);
    const validate = page.locator('figure[data-code-id="read-validate"]');
    await validate.waitFor();
    assert.equal(await validate.getByTestId('input-read-validate').innerText(), 'seventeen\n999\n17\n');
    await validate.getByRole('button', { name: 'Jalankan', exact: true }).click();
    await validate.getByTestId('run-verdict').waitFor({ timeout: 20_000 });
    assert.equal(await validate.getByTestId('run-verdict').getAttribute('data-matches'), 'yes');
    assert.equal(await validate.getByTestId('run-output').innerText(), 'Please enter an age between 0 and 150, not: seventeen\nPlease enter an age between 0 and 150, not: 999\nage:\t17');
    const ioStatuses = await page.locator('[data-status]').evaluateAll((els) => els.map((e) => e.getAttribute('data-status')));
    assert.ok(ioStatuses.length >= 10 && ioStatuses.every((x) => x === 'executed' || x === 'error-matched'), ioStatuses.join());
    assert.equal(await page.getByTestId('incomplete-badge').count(), 0);
    await page.getByRole('button', { name: 'Tandakan selesai' }).waitFor();
    log(`LUA101 4.2: stdin input shown and fed to Run (validation loop reproduced in the browser); ${ioStatuses.length} units verified; lecture can be completed`);

    const luauLecture = await lectureId(page, 'LUAU203', 1, 1);
    await page.goto(`${base}#/lecture-room?lecture=${luauLecture}`);
    // Wait for this lecture specifically (the previous lecture also has sections).
    await page.getByTestId('status-LUAU203 1.1#pure-signal').waitFor();
    const luauStatuses = await page.locator('[data-status]').evaluateAll((els) => els.map((e) => e.getAttribute('data-status')));
    assert.equal(luauStatuses.filter((x) => x === 'compiled').length, 4 + 1, 'Roblox examples (+ Roblox debug variant) are compiled only');
    assert.equal(await page.getByTestId('status-LUAU203 1.1#pure-signal').getAttribute('data-status'), 'executed');
    assert.equal(await page.getByText('Sintaks disahkan oleh pengkompil Luau · TIDAK dijalankan dalam Roblox Studio').count(), 4 + 1, 'four Roblox examples + the Roblox debug variant');
    assert.equal(await page.getByRole('button', { name: 'Jalankan', exact: true }).count(), 0, 'no browser Run for Luau/Roblox');
    assert.equal(await page.getByText('Kod ini menggunakan API Roblox dan hanya boleh berjalan dalam Roblox Studio.').count(), 4);
    assert.ok(await page.getByTestId('output-pure-signal').isVisible());
    log('LUAU203 1.1: Roblox examples compiled only and labelled "NOT run in Roblox Studio"; pure-Luau example executed; no fake Run button');

    // ── Print / PDF ───────────────────────────────────────────────────────
    await page.goto(`${base}#/lecture-room?lecture=${luaLecture}`);
    await page.getByRole('link', { name: 'PDF / Cetak' }).click();
    const doc = page.getByTestId('print-doc');
    await doc.getByText('QHAZE TECH UNIVERSITY').waitFor();
    assert.equal(await doc.locator('section h3').count(), 24);
    await doc.getByText(/Versi kandungan 1\.1\.0/).waitFor();
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.getByRole('button', { name: 'Cetak / Simpan sebagai PDF' }).isVisible(), false, 'toolbar hidden in print');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    assert.equal(bg, 'rgb(255, 255, 255)', 'prints on white even in dark theme');
    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    if (process.env.E2E_PDF_OUT) writeFileSync(process.env.E2E_PDF_OUT, pdf); // optional: keep for visual review
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    assert.ok(pdf.subarray(0, 5).toString() === '%PDF-' && pages >= 4, `pages ${pages}`);
    await page.emulateMedia({ media: 'screen' });
    log(`Lecture PDF: A4, ${pages} pages, light print palette, toolbar hidden, version line`);

    const courseId = courses.find((c) => c.code === 'LUA102').id;
    await page.goto(`${base}#/print?course=${courseId}`);
    await doc.getByText('Kandungan', { exact: true }).waitFor();
    assert.equal(await page.getByTestId('print-lecture').count(), 12);
    log('Course print document: contents list and all 12 lectures (structure-only ones marked)');

    // ── Integrity, student data, mobile, offline ─────────────────────────
    await page.goto(`${base}#/backup`);
    await page.getByRole('button', { name: 'Jalankan semakan' }).click();
    await page.getByText(/Tiada isu ditemui/).waitFor();
    const studentAfter = (await readStore(page, 'students'))[0];
    assert.deepEqual(studentAfter, studentBefore, 'student record unchanged');
    log('Integrity check clean (progress, notes, glossary bookmarks all valid); student record unchanged');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}#/lecture-room?lecture=${luaLecture}`);
    await page.getByTestId('lecture-article').locator('section[data-section]').first().waitFor();
    assert.ok((await horizontalOverflow(page)) <= 0, 'reader fits 390px');
    await page.locator('details > summary', { hasText: 'Kandungan' }).click();
    assert.equal(await page.locator('details').getByTestId('toc').locator('li').count(), 28, 'mobile contents');
    assert.equal(await page.locator('aside').getByTestId('toc').isVisible(), false, 'desktop TOC hidden on phones');
    await page.goto(`${base}#/library?programme=${lua.id}`);
    await page.getByTestId('course-LUA101').waitFor();
    assert.ok((await horizontalOverflow(page)) <= 0, 'library fits 390px');
    log('Reader (collapsible 28-entry contents, code scrolls inside its block) and library fit a 390px phone');

    await context.setOffline(true);
    await page.goto(`${base}#/lecture-room?lecture=${luauLecture}`).catch(() => {});
    await page.getByTestId('lecture-article').getByRole('link', { name: /Kuliah seterusnya/ }).click();
    await page.getByTestId('lecture-meta').waitFor();
    await context.setOffline(false);
    log('Offline: lectures already on the device keep working with the network disabled');

    assert.deepEqual(consoleErrors, []);
    log('No console errors');
    await context.close();
    console.log(`\nLearning E2E passed (${count()} checks).`);
  } finally {
    stop();
  }
}

main().catch((e) => {
  console.error('LEARNING E2E FAILED:', e);
  process.exit(1);
});
