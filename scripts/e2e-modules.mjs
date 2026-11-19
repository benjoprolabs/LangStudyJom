/**
 * End-to-end test for the Module Learning Page (real Chromium, production build, clean profile).
 * Uses TEST CONTENT ONLY, typed into a throwaway profile — no course material is written or shipped.
 *   npm run build && node scripts/e2e-modules.mjs        (SHOTS=dir to save screenshots)
 */
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createLogger, horizontalOverflow, launch, startServer, tempDir } from './e2e-lib.mjs';

const { log, count } = createLogger();
const consoleErrors = [];
const PHONE = { width: 390, height: 844 };
const SHOTS = process.env.SHOTS;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

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

const SECTIONS = [
  ['module_overview', 'Gambaran Keseluruhan Modul'],
  ['learning_objectives', 'Objektif Pembelajaran'],
  ['prerequisites', 'Prasyarat'],
  ['core_theory', 'Teori Teras Terperinci'],
  ['learning_notes', 'Nota Pembelajaran Lengkap'],
  ['key_concepts', 'Konsep dan Prinsip Utama'],
  ['terminology', 'Istilah dan Definisi'],
  ['examples', 'Contoh Khusus Subjek'],
  ['applications', 'Aplikasi Praktikal'],
  ['module_summary', 'Ringkasan Modul'],
  ['references', 'Rujukan dan Sumber Pembelajaran'],
];
/** Clearly marked TEST CONTENT that meets the module rules (word counts, lists, code, links, glossary). */
function testContent(lang) {
  const tag = lang === 'ms' ? '[KANDUNGAN UJIAN]' : '[TEST CONTENT]';
  const s = (p, n) => Array.from({ length: n }, (_, i) => `${tag} ${p} ${i + 1} ${lang === 'ms' ? 'ialah ayat ujian untuk memeriksa paparan modul.' : 'is a test sentence for checking the module page.'}`).join(' ');
  const l = (p, n) => Array.from({ length: n }, (_, i) => `- ${tag} ${p} ${i + 1}`).join('\n');
  return {
    module_overview: s('overview', 8),
    learning_objectives: l('objective', 3),
    prerequisites: s('prerequisite', 2),
    core_theory: `${s('theory', 9)}\n\n${s('theory part two', 9)}`,
    learning_notes: s('note', 12),
    key_concepts: l('concept', 3),
    terminology: `- [[variable]]: ${tag} definition one.\n- [[scope]]: ${tag} definition two.\n- [[table]]: ${tag} definition three.`,
    examples: `${s('example', 4)}\n\n\`\`\`lua\nlocal moduleTest = 6 * 7\nprint("${tag}", moduleTest)\n\`\`\``,
    applications: s('application', 5),
    module_summary: s('summary', 5),
    references: '- [Lua 5.4 manual](https://www.lua.org/manual/5.4/)\n- [Programming in Lua](https://www.lua.org/pil/)\n- [Lua users wiki](https://lua-users.org/wiki/)',
  };
}

async function save(page, dir, click) {
  const [download] = await Promise.all([page.waitForEvent('download'), click()]);
  const path = join(dir, download.suggestedFilename());
  await download.saveAs(path);
  return { name: download.suggestedFilename(), text: readFileSync(path, 'utf-8') };
}

async function main() {
  const { base, stop } = await startServer(4192);
  const profile = tempDir('qhaze-e2e-mod-');
  const downloads = tempDir('qhaze-e2e-mod-dl-');
  try {
    let { context, page } = await launch(profile, consoleErrors, PHONE);
    await page.goto(base);
    await page.getByLabel('Nama Penuh').fill('Siti Hajar binti Omar');
    await page.getByLabel('Nama Panggilan').fill('Hajar');
    await page.getByRole('button', { name: 'Daftar sebagai pelajar' }).click();
    await page.getByRole('heading', { name: 'Selamat kembali, Hajar' }).waitFor();
    await page.goto(`${base}#/faculties`);
    await page.getByRole('button', { name: 'Pakej kurikulum' }).click();
    await page.getByTestId('install-all-button').click();
    await page.getByRole('dialog', { name: 'Pasang semua pakej?' }).getByRole('button', { name: 'Pasang semua' }).click();
    await page.getByTestId('install-all-outcome').waitFor({ timeout: 180_000 });
    await page.getByRole('dialog').getByRole('button', { name: 'Tutup' }).first().click();

    // Existing student data: a completed lecture, a note and a bookmark, made before any module content exists.
    const [courses, modules, lectures] = await Promise.all(['courses', 'modules', 'lectures'].map((s) => readStore(page, s)));
    const lua101 = courses.find((c) => c.code === 'LUA101');
    const m1 = modules.find((m) => m.courseId === lua101.id && m.order === 1);
    const l11 = lectures.find((x) => x.moduleId === m1.id && x.order === 1);
    await page.goto(`${base}#/lecture-room?lecture=${l11.id}`);
    const article = page.getByTestId('lecture-article');
    await article.getByRole('button', { name: 'Tanda buku' }).click();
    await article.getByLabel(/Nota peribadi/).fill('Nota sedia ada pelajar.');
    await page.getByRole('button', { name: 'Tandakan selesai' }).click();
    await page.getByRole('button', { name: 'Selesai' }).waitFor();
    await page.waitForTimeout(2500);
    const snapshot = async () => ({
      students: await readStore(page, 'students'),
      progress: (await readStore(page, 'progress')).map(({ lastAccessedAt, position, updatedAt, ...kept }) => kept),
      notes: await readStore(page, 'notes'),
      bookmarks: await readStore(page, 'bookmarks'),
      lectures: (await readStore(page, 'lectures')).map((x) => JSON.stringify([x.id, x.title, x.sections, x.contentVersion])).sort(),
      glossary: (await readStore(page, 'glossaryTerms')).length,
      moduleCount: (await readStore(page, 'modules')).length,
    });
    const before = await snapshot();
    assert.equal(before.moduleCount, 328);
    assert.equal(before.lectures.length, 984);
    log('Clean profile: student registered, packages installed, LUA101 1.1 completed, noted and bookmarked');

    // ── Library → module page (empty state) ──
    await page.goto(`${base}#/library`);
    const link = page.getByTestId('module-link-LUA101-1');
    await page.getByTestId('course-LUA101').locator('summary').click();
    await link.waitFor();
    assert.equal(await page.getByTestId('course-LUA101').getByTestId('module-status-badge').first().getAttribute('data-status'), 'not_written');
    await link.click();
    const content = page.getByTestId('module-content');
    await page.getByTestId('module-empty').getByText('Kandungan peringkat modul belum ditulis').waitFor();
    assert.equal(await page.getByTestId('module-status').getAttribute('data-status'), 'not_written');
    assert.equal(await page.getByTestId('module-lectures').getByTestId('module-lecture-link').count(), 3);
    await page.getByRole('heading', { name: 'Kandungan Modul' }).waitFor();
    await page.getByRole('heading', { name: 'Kuliah dalam Modul Ini' }).waitFor();
    assert.ok((await horizontalOverflow(page)) <= 0, 'module page fits 390px');
    if (SHOTS) await page.screenshot({ path: join(SHOTS, '1-module-empty-phone.png'), fullPage: true });
    log('Library module title opens the Module page: "Kandungan peringkat modul belum ditulis", module layer and lecture layer shown separately, 3 lectures, fits 390px');

    // ── Module ↔ lecture navigation ──
    await page.getByTestId('module-lecture-link').first().click();
    await page.getByTestId('lecture-article').locator('section[data-section]').nth(23).waitFor();
    await page.getByTestId('lecture-module-link').click();
    await page.getByTestId('module-page').waitFor();
    await page.getByTestId('lecture-module-crumb').count();
    log('Module → lecture (Lecture Room) → back to the module through "Kandungan modul"');

    // ── Editor: copied lecture text is detected; test content saves ──
    await page.getByTestId('module-edit').click();
    const editor = page.getByTestId('module-editor');
    await editor.waitFor();
    const ms = testContent('ms');
    const en = testContent('en');
    for (const [kind, label] of SECTIONS) {
      await editor.getByLabel(`${label} — Bahasa Melayu`).fill(ms[kind]);
      await editor.getByLabel(`${label} — English`).fill(en[kind]);
    }
    const lectureParagraph = l11.sections.find((s) => s.kind === 'detailed_theory').blocks.find((b) => b.type === 'paragraph').text.en;
    await editor.getByLabel('Teori Teras Terperinci — English').fill(`${en.core_theory}\n\n${lectureParagraph}`);
    await editor.getByTestId('module-problems').getByText('Teori Teras Terperinci (EN): teks banyak disalin daripada kuliah 1.1').waitFor();
    if (SHOTS) {
      await editor.getByTestId('module-quality').scrollIntoViewIfNeeded();
      await page.screenshot({ path: join(SHOTS, '2b-copied-text-warning-phone.png') });
    }
    log('Editor flags lecture text pasted into the module ("teks banyak disalin daripada kuliah 1.1")');
    await editor.getByLabel('Teori Teras Terperinci — English').fill(en.core_theory);
    await editor.getByText('Semua peraturan standard modul dipenuhi.').waitFor();
    if (SHOTS) await page.screenshot({ path: join(SHOTS, '2-module-editor-phone.png') });
    await page.getByTestId('module-save').click();
    await page.getByText('Kandungan modul disimpan.').first().waitFor();
    await content.getByTestId('module-materials').waitFor();
    assert.equal(await content.locator('[data-module-section]').count(), 11);
    assert.equal(await page.getByTestId('module-status').getAttribute('data-status'), 'needs_verification', 'module code is not verified by execution');
    await content.getByText('Contoh kod modul · belum disahkan dengan pelaksanaan').waitFor();
    log('All 11 sections saved (test content); status "Perlu pengesahan" because module code is not verified by execution');

    // ── Reload, glossary, edit again ──
    await page.reload();
    await content.locator('[data-module-section]').nth(10).waitFor();
    assert.equal(await content.locator('[data-module-section]').count(), 11);
    await content.locator('[data-module-section="module_overview"]').getByText('[KANDUNGAN UJIAN] overview 1').waitFor();
    await content.locator('button[data-term="variable"]').click();
    await page.getByTestId('glossary-panel').waitFor();
    await page.keyboard.press('Escape');
    if (SHOTS) await page.screenshot({ path: join(SHOTS, '3-module-content-phone.png'), fullPage: true });
    await page.getByTestId('module-edit').click();
    await page.getByLabel('Gambaran Keseluruhan Modul — Bahasa Melayu').fill(`${ms.module_overview} [DISUNTING]`);
    await page.getByTestId('module-save').click();
    await content.locator('[data-module-section="module_overview"]').getByText('[DISUNTING]', { exact: false }).waitFor();
    assert.ok((await horizontalOverflow(page)) <= 0, 'module page with content fits 390px');
    log('Content survives a reload; glossary term in module text opens the glossary; a second edit saves; still fits 390px');

    // ── Exports ──
    const md = await save(page, downloads, () => page.getByRole('button', { name: 'Modul (.md)' }).click());
    assert.equal(md.name, 'LUA101-M1.md');
    if (SHOTS) writeFileSync(join(SHOTS, 'LUA101-M1-TEST-CONTENT.md'), md.text);
    const i = (s) => md.text.indexOf(s);
    assert.ok(i('### Kandungan Modul') > 0 && i('#### 1. Gambaran Keseluruhan Modul') > i('### Kandungan Modul') && i('#### 11. Rujukan') < i('### 1.1 '), 'module materials before lectures');
    assert.ok(md.text.includes('_Contoh kod modul · belum disahkan dengan pelaksanaan_'));
    assert.ok(!/^## 2\. /m.test(md.text), 'only this module');
    await page.goto(`${base}#/print?module=${m1.id}`);
    const doc = page.getByTestId('print-doc');
    await doc.getByTestId('print-module').locator('[data-module-section]').nth(10).waitFor();
    assert.equal(await doc.getByTestId('print-module').count(), 1);
    assert.equal(await doc.getByTestId('print-lecture').count(), 3);
    if (SHOTS) await page.screenshot({ path: join(SHOTS, '5-module-pdf-phone.png') });
    assert.ok(await doc.evaluate((el) => el.querySelector('[data-testid="print-module"]').compareDocumentPosition(el.querySelector('[data-testid="print-lecture"]')) & Node.DOCUMENT_POSITION_FOLLOWING));
    await page.goto(`${base}#/print?course=${lua101.id}`);
    await doc.getByTestId('print-lecture').nth(11).waitFor();
    assert.equal(await doc.getByTestId('print-module').count(), 4);
    assert.equal(await doc.getByTestId('print-module-empty').count(), 3);
    await page.goto(`${base}#/library?programme=${lua101.programmeId}`);
    await page.getByTestId('course-LUA101').locator('summary').click();
    const courseMd = await save(page, downloads, () => page.getByTestId('course-LUA101').getByRole('button', { name: 'Kursus (.md)' }).click());
    assert.equal(courseMd.text.split('### Kandungan Modul').length - 1, 4);
    assert.equal(courseMd.text.split('_Kandungan peringkat modul belum ditulis_').length - 1, 3);
    assert.equal(await page.getByTestId('course-LUA101').getByTestId('module-status-badge').first().getAttribute('data-status'), 'needs_verification');
    log('Module .md and Module PDF start with the module materials, then 3 lectures; course PDF and course .md include all 4 modules (1 written, 3 "belum ditulis"); Library badge updated');

    // ── Data integrity: nothing but the module's own materials changed ──
    const after = await snapshot();
    assert.deepEqual(after, before, 'students, progress, notes, bookmarks, lecture content, glossary and record counts unchanged');
    const modulesAfter = await readStore(page, 'modules');
    const m1After = modulesAfter.find((m) => m.id === m1.id);
    assert.deepEqual([m1After.title, m1After.description, m1After.order, m1After.createdAt], [m1.title, m1.description, m1.order, m1.createdAt]);
    const withMaterials = modulesAfter.filter((m) => m.sections?.length);
    assert.deepEqual(withMaterials.filter((m) => m.contentSource !== 'package').map((m) => m.id), [m1.id], 'only the edited module has locally written materials');
    assert.equal(withMaterials.filter((m) => m.contentSource === 'package' && m.contentVersion === '1.9.0').length, 4, 'the 4 packaged PY101 module materials (1.9.0)');
    log('Student record, progress, note and bookmark, all 984 lectures, glossary and record counts unchanged; module title/description kept; only the edited module has locally written materials (plus the 4 packaged PY101 modules)');

    // ── Desktop ──
    await context.close();
    ({ context, page } = await launch(profile, consoleErrors, { width: 1360, height: 900 }));
    await page.goto(`${base}#/module?module=${m1.id}`);
    await page.getByTestId('module-content').locator('[data-module-section]').nth(10).waitFor();
    assert.ok((await horizontalOverflow(page)) <= 0, 'module page fits desktop');
    if (SHOTS) await page.screenshot({ path: join(SHOTS, '4-module-content-desktop.png') });
    await page.getByRole('link', { name: /Modul seterusnya/ }).click();
    await page.getByTestId('module-empty').waitFor();
    log('Desktop: content kept after a browser restart; "Modul seterusnya" opens Module 2 (empty state)');

    // ── PY101 packaged module materials (1.9.0): all 11 sections, Python code verified by execution ──
    const py101 = courses.find((c) => c.code === 'PY101');
    const py101m1 = modules.find((m) => m.courseId === py101.id && m.order === 1);
    await page.goto(`${base}#/module?module=${py101m1.id}`);
    await page.getByTestId('module-content').locator('[data-module-section]').nth(10).waitFor();
    assert.equal(await page.getByTestId('module-status').getAttribute('data-status'), 'complete');
    const packagedCode = page.getByTestId('module-content').locator('[data-module-code]');
    assert.equal(await packagedCode.count(), 2);
    assert.deepEqual(await packagedCode.evaluateAll((els) => els.map((e) => e.getAttribute('data-status'))), ['executed', 'executed']);
    await packagedCode.first().getByText('Result when executed:', { exact: false }).first().waitFor();
    assert.equal(await page.getByTestId('module-lecture-link').count(), 3);
    if (SHOTS) await page.screenshot({ path: join(SHOTS, '5-py101-module-desktop.png') });
    log('PY101 Module 1 (packaged): status complete, 11 sections, 2 Python examples marked executed with their output, 3 written lectures listed');

    // ── PY101 lectures: all 12 open in the Lecture Room with 24 sections and only verified Python units ──
    const py101Lectures = (await readStore(page, 'lectures')).filter((l) => modules.some((m) => m.id === l.moduleId && m.courseId === py101.id));
    let pyUnits = 0;
    for (let m = 1; m <= 4; m++) {
      for (let l = 1; l <= 3; l++) {
        const moduleRecord = modules.find((x) => x.courseId === py101.id && x.order === m);
        const lectureRecord = py101Lectures.find((x) => x.moduleId === moduleRecord.id && x.order === l);
        await page.goto(`${base}#/lecture-room?lecture=${lectureRecord.id}`);
        await page.locator(`[data-testid^="status-PY101 ${m}.${l}#"]`).first().waitFor();
        assert.equal(await page.getByTestId('lecture-article').locator('section[data-section]').count(), 24, `PY101 ${m}.${l} sections`);
        const statuses = await page.locator(`[data-testid^="status-PY101 ${m}.${l}#"]`).evaluateAll((els) => els.map((e) => e.getAttribute('data-status')));
        assert.ok(statuses.length >= 7 && statuses.every((x) => x === 'executed' || x === 'error-matched'), `PY101 ${m}.${l}: ${statuses.join()}`);
        assert.ok(statuses.filter((x) => x === 'error-matched').length >= 2, `PY101 ${m}.${l}: at least 2 verified broken examples`);
        assert.equal(await page.getByTestId('incomplete-badge').count(), 0, `PY101 ${m}.${l} is not labelled incomplete`);
        assert.equal(await page.getByTestId('lecture-article').getByText('[[', { exact: false }).count(), 0, `PY101 ${m}.${l}: no raw glossary markup`);
        pyUnits += statuses.length;
      }
    }
    await page.getByTestId('lecture-article').getByText('Run untuk Python belum tersedia dalam pelayar', { exact: false }).first().waitFor();
    // The last lecture opened is PY101 4.3: its Python-scoped glossary term opens with a Python example.
    await page.getByTestId('lecture-article').locator('[data-term="debugging"]').first().click();
    const pyPanel = page.getByTestId('glossary-panel');
    await page.getByRole('dialog', { name: /Debugging/ }).waitFor();
    await pyPanel.getByText('DEBUG price', { exact: false }).first().waitFor();
    await pyPanel.locator('[data-term="traceback"]').click();
    await page.getByRole('dialog', { name: /Traceback/ }).waitFor();
    await page.keyboard.press('Escape');
    log(`PY101 1.1–4.3: all 12 lectures open with 24 sections and ${pyUnits} verified Python units (each lecture ≥ 2 verified broken examples); Python Run labelled unavailable, verified with CPython 3.13; Python glossary terms (debugging → traceback) open with Python examples`);

    // ── PY101 exports: lecture PDF, course PDF and course Markdown contain the complete pilot ──
    const py101first = py101Lectures.find((l) => l.moduleId === py101m1.id && l.order === 1);
    await page.goto(`${base}#/print?lecture=${py101first.id}`);
    const pdoc = page.getByTestId('print-doc');
    await pdoc.getByText(/Versi kandungan 1\.9\.0/).waitFor();
    assert.equal(await pdoc.locator('section h3').count(), 24);
    await page.goto(`${base}#/print?course=${py101.id}`);
    await pdoc.getByTestId('print-lecture').nth(11).waitFor();
    assert.equal(await pdoc.getByTestId('print-module').count(), 4);
    assert.equal(await pdoc.getByTestId('print-module-empty').count(), 0);
    assert.equal(await pdoc.getByText('[[', { exact: false }).count(), 0, 'no raw glossary markup in the PY101 PDF');
    await page.emulateMedia({ media: 'print' });
    const coursePdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: 'screen' });
    const coursePages = (coursePdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    assert.ok(coursePdf.subarray(0, 5).toString() === '%PDF-' && coursePages >= 60, `PY101 course PDF pages ${coursePages}`);
    if (process.env.E2E_PY101_OUT) writeFileSync(join(process.env.E2E_PY101_OUT, 'PY101-course.pdf'), coursePdf);
    await page.goto(`${base}#/library?programme=${py101.programmeId}`);
    await page.getByTestId('course-PY101').locator('summary').click();
    const pyMd = await save(page, downloads, () => page.getByTestId('course-PY101').getByRole('button', { name: 'Kursus (.md)' }).click());
    assert.equal(pyMd.text.split('### Kandungan Modul').length - 1, 4);
    assert.equal(pyMd.text.split('_Kandungan peringkat modul belum ditulis_').length - 1, 0);
    assert.ok(!pyMd.text.includes('belum disahkan'), 'every PY101 code example is verified');
    assert.ok(!pyMd.text.includes('[['), 'no raw glossary markup in the PY101 Markdown');
    const pythonFences = pyMd.text.split('```python').length - 1;
    assert.ok(pythonFences >= 12 * 7 + 8, `python code blocks in PY101 Markdown: ${pythonFences}`);
    assert.equal(await page.getByTestId('course-PY101').getByTestId('module-status-badge').evaluateAll((els) => els.map((e) => e.getAttribute('data-status')).join()), 'complete,complete,complete,complete');
    if (process.env.E2E_PY101_OUT) writeFileSync(join(process.env.E2E_PY101_OUT, pyMd.name), pyMd.text);
    log(`PY101 exports: lecture PDF (24 sections, version 1.9.0); course PDF ${coursePages} A4 pages with 4 module materials and 12 lectures; course .md with 4 module materials, ${pythonFences} Python blocks, nothing unverified or unwritten; 4 module badges "complete"`);

    // ── Python modules (PY-0): code typed in the editor is highlighted, shown with its output, never "verified" (test content) ──
    const py102 = courses.find((c) => c.code === 'PY102');
    const pyModule = modules.find((m) => m.courseId === py102.id && m.order === 1);
    await page.goto(`${base}#/module?module=${pyModule.id}`);
    await page.getByTestId('module-empty').waitFor();
    await page.getByTestId('module-edit').click();
    const pyExample = '[KANDUNGAN UJIAN] Contoh Python.\n\n```python\ndef purata(nombor):  # ujian\n    return sum(nombor) / len(nombor)\nprint(purata([2, 4]))\n```\n\n```output\n3.0\n```';
    await page.getByLabel('Contoh Khusus Subjek — Bahasa Melayu').fill(pyExample);
    await page.getByTestId('module-save').click();
    const pyFigure = page.getByTestId('module-content').locator('[data-module-code]').first();
    await pyFigure.waitFor();
    const tokenKinds = await pyFigure.locator('pre [class^="tok-"]').evaluateAll((els) => [...new Set(els.map((e) => e.className))].sort());
    assert.deepEqual(tokenKinds, ['tok-builtin', 'tok-comment', 'tok-keyword', 'tok-number']);
    assert.equal(await pyFigure.getAttribute('data-status'), 'unverified', 'code typed in the editor is never shown as verified');
    await pyFigure.getByText('3.0', { exact: true }).waitFor();
    if (SHOTS) await page.screenshot({ path: join(SHOTS, '6-python-module-desktop.png') });
    log('PY102 Module 1 (editor test content): Python code highlighted (keyword, builtin, comment, number), expected output shown, labelled not verified');

    assert.deepEqual(consoleErrors, []);
    log('No console errors');
    await context.close();
    console.log(`\nModules E2E passed (${count()} checks).`);
  } finally {
    stop();
  }
}

main().catch((e) => {
  console.error('MODULES E2E FAILED:', e);
  process.exit(1);
});
