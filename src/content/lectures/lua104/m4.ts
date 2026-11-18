import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA104 · Module 4 — Scope and Recursion (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 4.1 Block scope and do … end ──────────────────────────────────────────

export const LUA104_4_1: LectureContentDef = {
  courseCode: 'LUA104',
  module: 4,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan skop leksikal: local kelihatan dari pengisytiharannya hingga akhir [[block|blok]].', 'Explain lexical scope: a local is visible from its declaration to the end of its [[block]].'],
        ['Menggunakan `do … end` untuk mengehadkan hayat pemboleh ubah sementara.', 'Use `do … end` to limit the lifetime of temporary variables.'],
        ['Mengenal pasti bayangan (shadowing) dan kesannya.', 'Recognise shadowing and its effects.'],
        ['Menerangkan mengapa `local x = x + 1` merujuk `x` yang **lain**.', 'Explain why `local x = x + 1` refers to a **different** `x`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['LUA102 1.1: `local` berbanding global.', 'LUA102 1.1: `local` versus global.'],
        ['Modul 1–3: fungsi, parameter dan gelung.', 'Modules 1–3: functions, parameters and loops.'],
      )),
    S('introduction',
      P('Setiap pemboleh ubah `local` mempunyai **skop**: kawasan kod di mana namanya bermakna. Di luar skop itu, nama yang sama merujuk sesuatu yang lain — biasanya pemboleh ubah global yang `nil`. Lua menggunakan **skop leksikal**: skop ditentukan oleh struktur teks program (blok), bukan oleh susunan panggilan semasa runtime. Memahami skop dengan tepat menghalang dua kelas pepijat: menggunakan pemboleh ubah selepas ia hilang, dan menukar pemboleh ubah yang salah kerana nama yang sama dibayangi.',
        'Every `local` variable has a **scope**: the region of code where its name is meaningful. Outside that scope, the same name refers to something else — usually a global variable that is `nil`. Lua uses **lexical scope**: scope is determined by the program’s text structure (blocks), not by the order of calls at run time. Understanding scope precisely prevents two classes of bugs: using a variable after it is gone, and changing the wrong variable because the same name is shadowed.'),
      KEY('Local hidup dari baris **selepas** pengisytiharannya hingga `end` blok yang mengandunginya.', 'A local lives from the statement **after** its declaration to the `end` of the block containing it.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Blok:** badan fungsi, gelung, cabang `if`, chunk, dan `do … end`.', '**Block:** a function body, a loop body, an `if` branch, a chunk, and `do … end`.'],
        ['**Skop:** dari selepas pengisytiharan hingga akhir blok.', '**Scope:** from after the declaration to the end of the block.'],
        ['**Bayangan:** local dalaman dengan nama yang sama menyembunyikan yang luar di dalam bloknya.', '**Shadowing:** an inner local with the same name hides the outer one within its block.'],
        ['**Pembolehubah gelung** ialah local baharu bagi setiap pusingan.', '**Loop variables** are fresh locals on every pass.'],
        ['Nama di luar semua skop local → global (`_ENV.nama`).', 'A name outside every local scope → a global (`_ENV.name`).'],
      )),
    S('detailed_theory',
      P('Skop local bermula pada pernyataan **selepas** pengisytiharannya. Itulah sebabnya dalam `local x = x + 1`, `x` di sebelah kanan bukan local baharu — ia `x` yang kelihatan sebelum baris ini (local luar, atau global). Corak ini kadang-kadang disengajakan (`local print = print` menyalin fungsi global ke local untuk akses yang lebih pantas), tetapi jika tiada `x` luar, ia membaca global `nil` dan aritmetik gagal. Begitu juga, local yang diisytiharkan di dalam `do … end`, `if` atau gelung tidak wujud selepas `end` blok itu; nama yang sama di luar blok merujuk global.',
        'A local’s scope begins at the statement **after** its declaration. That is why in `local x = x + 1`, the `x` on the right is not the new local — it is whatever `x` was visible before this line (an outer local, or a global). This pattern is sometimes intentional (`local print = print` copies a global function into a local for faster access), but if there is no outer `x`, it reads a `nil` global and the arithmetic fails. Likewise, a local declared inside `do … end`, an `if` or a loop does not exist after that block’s `end`; the same name outside the block refers to a global.'),
      P('Bayangan berlaku apabila blok dalaman mengisytiharkan local dengan nama yang sudah wujud di luar. Di dalam blok, nama itu merujuk local baharu; pemboleh ubah luar tidak berubah dan muncul semula selepas `end`. Bayangan sah dan kadang-kadang berguna, tetapi selalunya ia kesilapan: pengaturcara menulis `local total = …` di dalam gelung dengan niat mengemas kini `total` luar, dan perubahan hilang di hujung setiap pusingan. `do … end` ialah blok tanpa tujuan lain selain skop — gunakannya untuk menyimpan pemboleh ubah sementara supaya ia tidak mencemari baki fail dan boleh dikutip lebih awal.',
        'Shadowing happens when an inner block declares a local with a name that already exists outside. Inside the block, the name refers to the new local; the outer variable is unchanged and reappears after the `end`. Shadowing is legal and sometimes useful, but often it is a mistake: a programmer writes `local total = …` inside a loop intending to update the outer `total`, and the change is lost at the end of every pass. `do … end` is a block with no purpose other than scope — use it to keep temporary variables from polluting the rest of the file and to let them be collected earlier.')),
    S('technical_terminology', TERMS('block', 'scope', 'variable', 'chunk')),
    S('syntax_rules',
      UL(
        ['`do … end` — blok eksplisit.', '`do … end` — an explicit block.'],
        ['`local a = ungkapan` — `a` belum kelihatan di dalam `ungkapan`.', '`local a = expression` — `a` is not yet visible inside `expression`.'],
        ['Kemas kini pemboleh ubah luar tanpa `local`: `total = total + v`.', 'Update an outer variable without `local`: `total = total + v`.'],
      )),
    S('code_demonstration',
      CODE('scope-layers', 'lua', 'lua54', ['Lapisan skop dan bayangan', 'Scope layers and shadowing'], `
local level = "outer"
print(1, level)

do
  local level = "inner"
  print(2, level)
end

print(3, level)
if true then
  level = "changed"
end
print(4, level)
`, '1\touter\n2\tinner\n3\touter\n4\tchanged'),
      EXPLAIN('scope-layers',
        ['1–2', 'Local pada peringkat chunk.', 'A local at chunk level.'],
        ['4–7', '`local level` baharu di dalam `do` **membayangi** yang luar; ia hilang di `end`.', 'A new `local level` inside `do` **shadows** the outer one; it disappears at `end`.'],
        ['9', 'Yang luar tidak pernah berubah.', 'The outer one never changed.'],
        ['10–12', 'Tanpa `local`, assignment di dalam `if` menukar pemboleh ubah **luar**.', 'Without `local`, the assignment inside `if` changes the **outer** variable.'],
        ['13', 'Perubahan kekal.', 'The change persists.'])),
    S('complete_examples',
      CODE('do-block-temp', 'lua', 'lua54', ['do … end untuk pemboleh ubah sementara', 'do … end for temporary variables'], `
local invoiceTotal
do
  local subtotal = 40 + 25
  local tax = subtotal * 0.06
  invoiceTotal = subtotal + tax
end
print(invoiceTotal)
print(subtotal, tax)
`, '68.9\nnil\tnil', {
        debug: BUG(`
do
  local subtotal = 40
end
print("total: " .. subtotal)
`, "example:4: attempt to concatenate a nil value (global 'subtotal')",
          '`subtotal` ialah local blok `do` dan berhenti wujud pada `end` baris 3. Pada baris 4, nama `subtotal` merujuk **global** yang tidak wujud. Perkataan `global` dalam mesej ialah petunjuk utama: nama yang anda jangka local sebenarnya di luar skop. Isytiharkan pemboleh ubah di luar blok (seperti `invoiceTotal`) dan beri nilai di dalam.',
          '`subtotal` is a local of the `do` block and stops existing at the `end` on line 3. On line 4, the name `subtotal` refers to a **global** that does not exist. The word `global` in the message is the key clue: a name you expected to be local is actually out of scope. Declare the variable outside the block (like `invoiceTotal`) and assign it inside.'),
      }),
      EXPLAIN('do-block-temp',
        ['1', 'Hasil diisytiharkan **di luar** blok, supaya ia kekal selepas blok.', 'The result is declared **outside** the block, so it survives the block.'],
        ['2–6', 'Pengiraan perantaraan di dalam `do`; `subtotal` dan `tax` hanya wujud di sini.', 'Intermediate calculation inside `do`; `subtotal` and `tax` exist only here.'],
        ['7', '65 + 3.9 = 68.9.', '65 + 3.9 = 68.9.'],
        ['8', 'Di luar blok, kedua-dua nama ialah global `nil`.', 'Outside the block, both names are `nil` globals.']),
      CODE('fresh-loop-locals', 'lua', 'lua54', ['Local baharu pada setiap pusingan', 'Fresh locals on every pass'], `
local count = 0
for i = 1, 3 do
  local square = i * i
  count = count + square
end
print(count, i, square)

local total = 10
local doubled = total * 2
print(total, doubled)
`, '14\tnil\tnil\n10\t20', {
        debug: BUG(`
local function bump()
  local count = count + 1
  return count
end
print(bump())
`, "example:2: attempt to perform arithmetic on a nil value (global 'count')",
          'Dalam `local count = count + 1`, local `count` yang baharu belum wujud di sebelah kanan — skopnya bermula selepas pernyataan ini. Jadi `count` di sebelah kanan ialah global, yang `nil`. Pengaturcara mungkin mahu kaunter yang kekal antara panggilan; itu memerlukan pemboleh ubah **di luar** fungsi (kuliah 4.3), bukan local baharu di dalamnya.',
          'In `local count = count + 1`, the new local `count` does not exist yet on the right side — its scope starts after this statement. So the `count` on the right is a global, which is `nil`. The programmer probably wanted a counter that persists between calls; that needs a variable **outside** the function (lecture 4.3), not a new local inside it.'),
      }),
      EXPLAIN('fresh-loop-locals',
        ['1', 'Pengumpul di luar gelung.', 'An accumulator outside the loop.'],
        ['2–5', '`i` dan `square` ialah local baharu pada setiap pusingan; `count` dikemas kini tanpa `local`.', '`i` and `square` are fresh locals on every pass; `count` is updated without `local`.'],
        ['6', '1 + 4 + 9 = 14; `i` dan `square` tidak wujud selepas gelung.', '1 + 4 + 9 = 14; `i` and `square` do not exist after the loop.'],
        ['8–10', 'Local yang diisytiharkan pada baris sebelumnya kelihatan pada baris seterusnya — susunan penting.', 'A local declared on the previous line is visible on the next — order matters.'])),
    S('line_by_line',
      EXPLAIN('scope-layers',
        ['5', '`local` di sini mencipta pemboleh ubah **kedua** bernama `level`. Tanpa `local`, baris ini akan menukar yang luar — perbezaan satu perkataan.', '`local` here creates a **second** variable named `level`. Without `local`, this line would change the outer one — a one-word difference.']),
      EXPLAIN('do-block-temp',
        ['5', '`invoiceTotal` kelihatan di dalam blok kerana ia diisytiharkan dalam blok luar — blok dalaman melihat local blok luar.', '`invoiceTotal` is visible inside the block because it was declared in an outer block — inner blocks see outer blocks’ locals.'])),
    S('why_this_way',
      P('Mengapa skop leksikal? Kerana anda boleh menentukan pemboleh ubah mana yang dirujuk oleh nama hanya dengan membaca kod, tanpa menjejak panggilan. Mengapa skop kecil? Kerana setiap pemboleh ubah yang kelihatan ialah sesuatu yang boleh diubah secara tidak sengaja; skop yang kecil mengurangkan kemungkinan itu dan membolehkan memori dibebaskan lebih awal.',
        'Why lexical scope? Because you can decide which variable a name refers to just by reading the code, without tracing calls. Why small scopes? Because every visible variable is something that can be changed by accident; small scopes reduce that risk and let memory be freed earlier.'),
      P('Isytiharkan local **sedekat mungkin** dengan tempat ia digunakan; gunakan `do … end` **apabila** pengiraan sementara di peringkat chunk tidak sesuai menjadi fungsi; elakkan bayangan **kecuali** ia disengajakan dan jelas.', 'Declare locals **as close as possible** to where they are used; use `do … end` **when** a temporary chunk-level calculation does not deserve its own function; avoid shadowing **unless** it is intentional and obvious.')),
    S('execution_flow',
      OL(
        ['`scope-layers` baris 1: local luar `level = "outer"`.', '`scope-layers` line 1: the outer local `level = "outer"`.'],
        ['Baris 5: local **baharu** `level` dicipta di dalam blok `do`.', 'Line 5: a **new** local `level` is created inside the `do` block.'],
        ['Baris 7: `end` — local dalaman dibuang; nama `level` merujuk yang luar semula.', 'Line 7: `end` — the inner local is discarded; the name `level` refers to the outer one again.'],
        ['Baris 11: assignment tanpa `local` menukar local luar.', 'Line 11: an assignment without `local` changes the outer local.'],
      )),
    S('memory_behaviour',
      P('Local disimpan dalam daftar (register) fungsi; apabila blok tamat, daftarnya boleh digunakan semula oleh local seterusnya. Jika local merujuk table besar, table itu boleh dikutip sebaik sahaja tiada rujukan lain — jadi mengehadkan local kepada blok `do` membolehkan memori dibebaskan lebih awal dalam skrip panjang. Satu fungsi Lua boleh mempunyai paling banyak 200 local aktif serentak.',
        'Locals are stored in the function’s registers; when a block ends, its registers can be reused by the next locals. If a local refers to a large table, that table can be collected as soon as no other reference exists — so limiting a local to a `do` block lets memory be freed earlier in long scripts. A Lua function can have at most 200 active locals at once.')),
    S('alternative_implementations',
      P('Fungsi tanpa nama yang dipanggil serta-merta memberi kesan yang sama seperti `do … end`, sambil memulangkan nilai:', 'An immediately invoked anonymous function has the same effect as `do … end`, while returning a value:'),
      CODE('iife-scope', 'lua', 'lua54', ['Fungsi yang dipanggil serta-merta', 'An immediately invoked function'], `
local discount = (function()
  local base = 100
  local rate = 0.15
  return base * rate
end)()

print(discount, base)
`, '15.0\tnil'),
      EXPLAIN('iife-scope',
        ['1–5', 'Fungsi dicipta dan dipanggil dalam satu ungkapan; `base` dan `rate` local kepadanya.', 'The function is created and called in one expression; `base` and `rate` are local to it.'],
        ['7', 'Hanya hasil yang tinggal; `base` tidak wujud di luar.', 'Only the result remains; `base` does not exist outside.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan local selepas `end` bloknya.', 'Using a local after its block’s `end`.'],
        ['Menulis `local` di dalam gelung apabila berniat mengemas kini pemboleh ubah luar.', 'Writing `local` inside a loop when intending to update an outer variable.'],
        ['`local x = x + 1` tanpa `x` luar.', '`local x = x + 1` without an outer `x`.'],
        ['Menggunakan nama yang sama untuk pemboleh ubah gelung bersarang.', 'Reusing the same name for nested loop variables.'],
      )),
    S('debugging',
      P('Apabila mesej ralat menyebut `global \'nama\'` untuk nama yang anda fikir local, nama itu di luar skop: semak di mana ia diisytiharkan dan di mana blok itu berakhir. Pepijat bayangan lebih senyap — tiada ralat, hanya nilai yang tidak berubah. Cetak nilai pemboleh ubah luar selepas blok untuk memastikan ia dikemas kini. Contoh berikut menunjukkan pembetulan bayangan yang tidak disengajakan:',
        'When an error message says `global \'name\'` for a name you believe is local, the name is out of scope: check where it was declared and where that block ends. Shadowing bugs are quieter — no error, just a value that does not change. Print the outer variable after the block to make sure it was updated. The following example shows the fix for accidental shadowing:'),
      CODE('no-shadow', 'lua', 'lua54', ['Mengemas kini pemboleh ubah luar', 'Updating the outer variable'], `
local best = 0
for _, score in ipairs({45, 92, 67}) do
  if score > best then
    best = score
  end
end
print("best score:", best)
`, 'best score:\t92'),
      EXPLAIN('no-shadow',
        ['1', 'Pemboleh ubah luar.', 'The outer variable.'],
        ['2–6', '`best = score` **tanpa** `local`: pemboleh ubah luar dikemas kini. Dengan `local best = score`, setiap kemas kini akan hilang di `end` dan hasilnya 0.', '`best = score` **without** `local`: the outer variable is updated. With `local best = score`, every update would vanish at the `end` and the result would be 0.'],
        ['7', 'Nilai yang betul.', 'The correct value.'])),
    S('performance',
      P('Akses local ialah salah satu operasi terpantas dalam Lua — satu daftar. Akses global memerlukan carian table `_ENV`. Itulah sebabnya kod yang kritikal prestasi sering menyalin fungsi pustaka ke local di bahagian atas fail: `local floor = math.floor`. Skop kecil tidak mempunyai kos prestasi.',
        'Local access is one of the fastest operations in Lua — a single register. Global access requires a lookup in the `_ENV` table. That is why performance-critical code often copies library functions into locals at the top of the file: `local floor = math.floor`. Small scopes have no performance cost.')),
    S('software_engineering',
      P('Pemboleh ubah sementara global berbanding local blok:', 'Temporary global variables versus block locals:'),
      CODE('poor-global-temps', 'lua', 'lua54', ['Pelaksanaan lemah: pemboleh ubah sementara global', 'Poor implementation: temporary globals'], `
temp = 25 * 4
result = temp + 7
print(result)
print(rawget(_G, "temp"), rawget(_G, "result"))
`, '107\n100\t107'),
      EXPLAIN('poor-global-temps',
        ['1–3', 'Tanpa `local`, `temp` dan `result` menjadi global.', 'Without `local`, `temp` and `result` become globals.'],
        ['4', '`rawget(_G, …)` membuktikan kedua-duanya kekal dalam table global — boleh dibaca dan ditimpa oleh mana-mana kod lain.', '`rawget(_G, …)` proves both remain in the global table — readable and overwritable by any other code.']),
      CODE('improved-block-locals', 'lua', 'lua54', ['Pelaksanaan lebih baik: local dalam blok', 'Improved implementation: locals in a block'], `
local result
do
  local temp = 25 * 4
  result = temp + 7
end
print(result)
print(rawget(_G, "temp"), rawget(_G, "result"))
`, '107\nnil\tnil'),
      EXPLAIN('improved-block-locals',
        ['1–5', '`result` local fail; `temp` local blok sahaja.', '`result` is a file local; `temp` is a block local only.'],
        ['6–7', 'Tiada global dicipta.', 'No globals were created.'])),
    S('industry_use_cases',
      UL(
        ['Fail konfigurasi Neovim menggunakan `do … end` untuk mengasingkan tetapan sementara.', 'Neovim configuration files use `do … end` to isolate temporary settings.'],
        ['Pustaka Lua menyalin fungsi global ke local di bahagian atas (`local type, pairs = type, pairs`) untuk kelajuan dan keselamatan.', 'Lua libraries copy globals into locals at the top (`local type, pairs = type, pairs`) for speed and safety.'],
        ['Linter seperti luacheck memberi amaran tentang bayangan dan global yang tidak disengajakan.', 'Linters such as luacheck warn about shadowing and accidental globals.'],
      )),
    S('practical_demonstration',
      OL(
        ['Dalam `no-shadow`, tukar `best = score` kepada `local best = score` dan sahkan hasil 0.', 'In `no-shadow`, change `best = score` to `local best = score` and confirm the result 0.'],
        ['Tambah `print(level)` di dalam blok `do` `scope-layers` **sebelum** `local level` dan ramalkan output.', 'Add `print(level)` inside the `do` block of `scope-layers` **before** `local level` and predict the output.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Laporan dengan skop kemas.** Kira tiga statistik daripada senarai jualan, setiap satu dalam blok `do` sendiri, dan cetak laporan. Tiada global boleh dicipta.', '**A report with tidy scopes.** Compute three statistics from a sales list, each in its own `do` block, and print a report. No globals may be created.'),
      CODE('scoped-report', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local sales = {120, 340, 90, 410, 220}
local total, average, topDay

do
  local sum = 0
  for _, v in ipairs(sales) do sum = sum + v end
  total = sum
end

do
  average = total / #sales
end

do
  local bestValue = -math.huge
  for day, v in ipairs(sales) do
    if v > bestValue then bestValue, topDay = v, day end
  end
end

print(string.format("total %d, average %.1f, best day %d", total, average, topDay))
print(rawget(_G, "sum"), rawget(_G, "bestValue"))
`, 'total 1180, average 236.0, best day 4\nnil\tnil'),
      EXPLAIN('scoped-report',
        ['1–2', 'Data dan tiga hasil, diisytiharkan di peringkat chunk.', 'The data and three results, declared at chunk level.'],
        ['4–8', 'Blok 1: `sum` sementara.', 'Block 1: a temporary `sum`.'],
        ['10–12', 'Blok 2: purata daripada jumlah.', 'Block 2: the average from the total.'],
        ['14–19', 'Blok 3: hari terbaik; assignment berbilang mengemas kini dua pemboleh ubah sekali gus.', 'Block 3: the best day; multiple assignment updates two variables at once.'],
        ['21–22', 'Laporan, dan bukti bahawa tiada pemboleh ubah sementara bocor ke global.', 'The report, and proof that no temporary variable leaked into globals.'])),
    S('summary',
      UL(
        ['Skop local: dari selepas pengisytiharan hingga akhir blok.', 'Local scope: from after the declaration to the end of the block.'],
        ['`do … end` mencipta blok untuk pemboleh ubah sementara.', '`do … end` creates a block for temporary variables.'],
        ['Bayangan menyembunyikan pemboleh ubah luar; kemas kini luar tanpa `local`.', 'Shadowing hides the outer variable; update the outer one without `local`.'],
        ['`global \'nama\'` dalam ralat = nama di luar skop local.', '`global \'name\'` in an error = a name outside any local scope.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dicetak oleh `local x = 1 do local x = 2 end print(x)`?', 'What does `local x = 1 do local x = 2 end print(x)` print?'],
        ['Mengapakah `local n = n + 1` gagal jika tiada `n` luar?', 'Why does `local n = n + 1` fail if there is no outer `n`?'],
        ['Apakah kelebihan `do … end` berbanding pemboleh ubah global sementara?', 'What is the advantage of `do … end` over temporary globals?'],
        ['Adakah pemboleh ubah gelung `for` kelihatan selepas gelung?', 'Is a `for` loop variable visible after the loop?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.5 — Visibility Rules', url: `${MANUAL}#3.5` },
        { title: 'Lua 5.4 Reference Manual §3.3.1 — Blocks', url: `${MANUAL}#3.3.1` },
        { title: 'Programming in Lua (1st ed.) — 4.2 Local Variables and Blocks', url: `${PIL}/4.2.html` },
        { title: 'Lua 5.4 Reference Manual — rawget', url: `${MANUAL}#pdf-rawget` },
      )),
  ],
};

// ─── 4.2 local function and recursion ──────────────────────────────────────

export const LUA104_4_2: LectureContentDef = {
  courseCode: 'LUA104',
  module: 4,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis fungsi [[recursion|rekursif]] dengan kes asas dan kes rekursif.', 'Write [[recursion|recursive]] functions with a base case and a recursive case.'],
        ['Menerangkan mengapa `local function f` diperlukan untuk rekursi, dan bukan `local f = function`.', 'Explain why `local function f` is needed for recursion, not `local f = function`.'],
        ['Mengenal pasti limpahan timbunan dan panggilan ekor yang betul.', 'Recognise stack overflow and proper tail calls.'],
        ['Mengoptimumkan rekursi berulang dengan memoisasi.', 'Optimise repeated recursion with memoisation.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1: skop local bermula selepas pengisytiharan.', 'Lecture 4.1: local scope starts after the declaration.'],
        ['LUA101 1.2: [[call-stack|timbunan panggilan]].', 'LUA101 1.2: the [[call-stack|call stack]].'],
      )),
    S('introduction',
      P('Fungsi rekursif memanggil dirinya sendiri. Ini kedengaran seperti gelung tanpa penghujung, tetapi setiap panggilan menyelesaikan versi masalah yang **lebih kecil**, sehingga mencapai kes yang cukup mudah untuk diselesaikan terus — **kes asas**. Rekursi ialah cara semula jadi untuk memproses struktur yang bersarang (folder dalam folder, table dalam table, cawangan pokok) dan untuk algoritma "bahagi dan takluk". Dalam Lua, ia mempunyai satu perangkap khusus berkaitan skop yang kita akan lihat.',
        'A recursive function calls itself. That sounds like an endless loop, but each call solves a **smaller** version of the problem, until it reaches a case simple enough to solve directly — the **base case**. Recursion is the natural way to process nested structures (folders inside folders, tables inside tables, tree branches) and "divide and conquer" algorithms. In Lua, it has one scope-related trap we will look at.'),
      KEY('Setiap fungsi rekursif: (1) kes asas yang tidak memanggil diri sendiri; (2) kes rekursif yang bergerak ke arah kes asas.', 'Every recursive function: (1) a base case that does not call itself; (2) a recursive case that moves towards the base case.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Kes asas:** input terkecil, dijawab terus (`n <= 1 → 1`).', '**Base case:** the smallest input, answered directly (`n <= 1 → 1`).'],
        ['**Kes rekursif:** jawapan dibina daripada panggilan pada input yang lebih kecil (`n * fact(n - 1)`).', '**Recursive case:** the answer built from a call on a smaller input (`n * fact(n - 1)`).'],
        ['`local function f` = `local f; f = function … end` — nama kelihatan di dalam badan.', '`local function f` = `local f; f = function … end` — the name is visible inside the body.'],
        ['Setiap panggilan menambah bingkai; terlalu banyak → `stack overflow`.', 'Every call adds a frame; too many → `stack overflow`.'],
        ['`return f(x)` ialah panggilan ekor: tiada bingkai tambahan.', '`return f(x)` is a tail call: no extra frame.'],
      )),
    S('detailed_theory',
      P('Mengapa `local f = function(n) … f(n - 1) … end` gagal? Ingat kuliah 4.1: skop local bermula **selepas** pernyataan pengisytiharan. Semasa ungkapan fungsi dikompil, local `f` belum wujud, jadi `f` di dalam badan merujuk **global** `f` — yang `nil`. Panggilan rekursif pertama gagal dengan `attempt to call a nil value (global \'f\')`. Gula sintaks `local function f` mengisytiharkan local **dahulu** dan kemudian memberikan fungsi, jadi nama itu kelihatan di dalam badan. Untuk rekursi bersama (dua fungsi yang saling memanggil), isytiharkan kedua-dua nama dahulu: `local isEven, isOdd`.',
        'Why does `local f = function(n) … f(n - 1) … end` fail? Recall lecture 4.1: a local’s scope starts **after** its declaration statement. While the function expression is compiled, the local `f` does not exist yet, so the `f` inside the body refers to the **global** `f` — which is `nil`. The first recursive call fails with `attempt to call a nil value (global \'f\')`. The sugar `local function f` declares the local **first** and then assigns the function, so the name is visible inside the body. For mutual recursion (two functions calling each other), declare both names first: `local isEven, isOdd`.'),
      P('Setiap panggilan rekursif yang belum selesai memegang bingkai pada timbunan. Lua 5.4 mengehadkan saiz timbunan (`LUAI_MAXSTACK` = 1 000 000 slot), dan rekursi tanpa kes asas — atau dengan kes asas yang tidak pernah dicapai — berakhir dengan ralat `stack overflow`. Pengecualian penting: **panggilan ekor yang betul**. Apabila `return f(x)` ialah tindakan terakhir fungsi, Lua menggantikan bingkai semasa dan bukannya menambah yang baharu, jadi rekursi ekor boleh berjalan jutaan kali. `return 1 + f(x)` **bukan** panggilan ekor, kerana penambahan masih perlu dilakukan selepas panggilan pulang.',
        'Every unfinished recursive call holds a frame on the stack. Lua 5.4 limits the stack (`LUAI_MAXSTACK` = 1,000,000 slots), and recursion without a base case — or with a base case that is never reached — ends with a `stack overflow` error. An important exception: **proper tail calls**. When `return f(x)` is a function’s final action, Lua replaces the current frame instead of adding a new one, so tail recursion can run millions of times. `return 1 + f(x)` is **not** a tail call, because the addition still has to happen after the call returns.')),
    S('technical_terminology', TERMS('recursion', 'call-stack', 'scope', 'function')),
    S('syntax_rules',
      UL(
        ['`local function nama(p) … nama(p2) … end` — bentuk yang betul untuk rekursi.', '`local function name(p) … name(p2) … end` — the correct form for recursion.'],
        ['Rekursi bersama: `local a, b` dahulu; kemudian `function a() … end` dan `function b() … end` (tanpa `local`).', 'Mutual recursion: `local a, b` first; then `function a() … end` and `function b() … end` (without `local`).'],
        ['Panggilan ekor: `return f(args)` sahaja — tiada operasi selepasnya.', 'Tail call: just `return f(args)` — no operation after it.'],
      )),
    S('code_demonstration',
      CODE('factorial', 'lua', 'lua54', ['Faktorial rekursif', 'A recursive factorial'], `
local function factorial(n)
  if n <= 1 then
    return 1
  end
  return n * factorial(n - 1)
end

print(factorial(5))
print(factorial(1), factorial(0))
print(factorial(20))
`, '120\n1\t1\n2432902008176640000'),
      EXPLAIN('factorial',
        ['1', '`local function`: nama `factorial` kelihatan di dalam badannya sendiri.', '`local function`: the name `factorial` is visible inside its own body.'],
        ['2–4', 'Kes asas: 0! dan 1! ialah 1.', 'Base case: 0! and 1! are 1.'],
        ['5', 'Kes rekursif: n! = n × (n − 1)!, setiap panggilan dengan n yang lebih kecil.', 'Recursive case: n! = n × (n − 1)!, each call with a smaller n.'],
        ['8–10', '20! masih muat dalam integer 64-bit; 21! akan melimpah (LUA102 2.2).', '20! still fits in a 64-bit integer; 21! would overflow (LUA102 2.2).'])),
    S('complete_examples',
      CODE('sum-digits', 'lua', 'lua54', ['Jumlah digit secara rekursif', 'Recursive digit sum'], `
local function sumDigits(n)
  if n < 10 then
    return n
  end
  return n % 10 + sumDigits(n // 10)
end

print(sumDigits(9045))
print(sumDigits(7))
`, '18\n7', {
        debug: BUG(`
local sumDigits = function(n)
  if n < 10 then return n end
  return n % 10 + sumDigits(n // 10)
end
print(sumDigits(9045))
`, "example:3: attempt to call a nil value (global 'sumDigits')",
          'Dengan `local sumDigits = function …`, local `sumDigits` belum wujud semasa badan fungsi dikompil, jadi panggilan pada baris 3 merujuk **global** `sumDigits`, yang `nil`. Panggilan pertama dari baris 5 berjaya (local sudah wujud ketika itu), tetapi panggilan rekursif di dalam gagal. Gunakan `local function sumDigits(n)`.',
          'With `local sumDigits = function …`, the local `sumDigits` does not exist yet while the function body is compiled, so the call on line 3 refers to the **global** `sumDigits`, which is `nil`. The first call from line 5 succeeds (the local exists by then), but the recursive call inside fails. Use `local function sumDigits(n)`.'),
      }),
      EXPLAIN('sum-digits',
        ['1–4', 'Kes asas: nombor satu digit ialah jumlah digitnya sendiri.', 'Base case: a one-digit number is its own digit sum.'],
        ['5', 'Digit terakhir (`% 10`) + jumlah digit nombor tanpa digit terakhir (`// 10`).', 'The last digit (`% 10`) + the digit sum of the number without its last digit (`// 10`).'],
        ['8–9', '9 + 0 + 4 + 5 = 18.', '9 + 0 + 4 + 5 = 18.']),
      CODE('nested-count', 'lua', 'lua54', ['Rekursi atas table bersarang', 'Recursion over nested tables'], `
local function countItems(node)
  if type(node) ~= "table" then
    return 1
  end
  local total = 0
  for _, child in ipairs(node) do
    total = total + countItems(child)
  end
  return total
end

local folders = {"a.txt", {"b.txt", "c.txt", {"d.txt"}}, {}, "e.txt"}
print(countItems(folders))
`, '5', {
        debug: BUG(`
local function depth(n)
  return 1 + depth(n - 1)
end
print(depth(3))
`, 'example:2: stack overflow',
          'Tiada kes asas: `depth` sentiasa memanggil dirinya, dan `n` menjadi 2, 1, 0, −1, … tanpa had. Setiap panggilan menambah bingkai kerana `1 + depth(…)` mesti menunggu hasil (bukan panggilan ekor). Apabila had timbunan dicapai, Lua menghentikan program dengan `stack overflow`. Tambah kes asas: `if n <= 0 then return 0 end`.',
          'There is no base case: `depth` always calls itself, and `n` becomes 2, 1, 0, −1, … without limit. Every call adds a frame because `1 + depth(…)` must wait for the result (it is not a tail call). When the stack limit is reached, Lua stops the program with `stack overflow`. Add a base case: `if n <= 0 then return 0 end`.'),
      }),
      EXPLAIN('nested-count',
        ['1–4', 'Kes asas: bukan table → satu fail.', 'Base case: not a table → one file.'],
        ['5–9', 'Kes rekursif: jumlahkan kiraan setiap anak, yang boleh jadi fail atau folder lain.', 'Recursive case: add up the count of every child, which may be a file or another folder.'],
        ['12–13', 'Kedalaman bersarang tidak diketahui terlebih dahulu — rekursi mengendalikannya secara semula jadi. Folder kosong menyumbang 0.', 'The nesting depth is not known in advance — recursion handles it naturally. The empty folder contributes 0.'])),
    S('line_by_line',
      EXPLAIN('factorial',
        ['5', '`n * factorial(n - 1)` bukan panggilan ekor: pendaraban menunggu hasil. Untuk `factorial(5)`, lima bingkai wujud serentak pada titik terdalam.', '`n * factorial(n - 1)` is not a tail call: the multiplication waits for the result. For `factorial(5)`, five frames exist at once at the deepest point.']),
      EXPLAIN('nested-count',
        ['7', 'Panggilan rekursif di dalam gelung: setiap anak table membuka "cabang" panggilan baharu, seperti melawat folder.', 'A recursive call inside a loop: every table child opens a new "branch" of calls, like visiting a folder.'])),
    S('why_this_way',
      P('Mengapa rekursi dan bukan gelung? Untuk struktur bersarang yang kedalamannya tidak diketahui, gelung memerlukan timbunan buatan sendiri; rekursi menggunakan timbunan panggilan Lua secara automatik, dan kodnya mengikut bentuk data. Untuk pengiraan linear (faktorial, jumlah), gelung biasanya lebih mudah dan tidak berisiko limpahan.',
        'Why recursion rather than a loop? For nested structures of unknown depth, a loop needs a hand-made stack; recursion uses Lua’s call stack automatically, and the code follows the shape of the data. For linear computations (factorial, sums), a loop is usually simpler and carries no overflow risk.'),
      P('Gunakan rekursi **apabila** data atau masalah itu sendiri rekursif (pokok, table bersarang, bahagi dan takluk); gunakan gelung **apabila** masalah ialah urutan langkah yang rata.', 'Use recursion **when** the data or the problem is itself recursive (trees, nested tables, divide and conquer); use a loop **when** the problem is a flat sequence of steps.')),
    S('execution_flow',
      OL(
        ['`factorial(3)` → 3 > 1 → perlu `factorial(2)`; bingkai 1 menunggu.', '`factorial(3)` → 3 > 1 → needs `factorial(2)`; frame 1 waits.'],
        ['`factorial(2)` → perlu `factorial(1)`; bingkai 2 menunggu.', '`factorial(2)` → needs `factorial(1)`; frame 2 waits.'],
        ['`factorial(1)` → kes asas → pulang 1.', '`factorial(1)` → base case → returns 1.'],
        ['Bingkai 2: 2 × 1 = 2 → pulang. Bingkai 1: 3 × 2 = 6 → pulang.', 'Frame 2: 2 × 1 = 2 → returns. Frame 1: 3 × 2 = 6 → returns.'],
      )),
    S('memory_behaviour',
      P('Rekursi biasa menggunakan memori timbunan sebanding dengan kedalaman maksimum: `factorial(20)` memerlukan 20 bingkai serentak. Rekursi atas table bersarang memerlukan bingkai sebanyak kedalaman bersarang, bukan bilangan item. Panggilan ekor menggunakan satu bingkai sahaja tanpa mengira kedalaman.',
        'Ordinary recursion uses stack memory proportional to the maximum depth: `factorial(20)` needs 20 frames at once. Recursion over nested tables needs as many frames as the nesting depth, not the number of items. Tail calls use a single frame regardless of depth.')),
    S('alternative_implementations',
      P('Rekursi ekor dengan pengumpul tidak menambah bingkai, jadi ia selamat untuk kedalaman yang sangat besar:', 'Tail recursion with an accumulator adds no frames, so it is safe for very large depths:'),
      CODE('tail-count', 'lua', 'lua54', ['Panggilan ekor yang betul', 'Proper tail calls'], `
local function countDown(n, steps)
  if n == 0 then return steps end
  return countDown(n - 1, steps + 1)
end

print(countDown(10, 0))
print(countDown(500000, 0))
`, '10\n500000'),
      EXPLAIN('tail-count',
        ['1–2', 'Pengumpul `steps` membawa hasil separa ke bawah; kes asas memulangkannya.', 'The accumulator `steps` carries the partial result downwards; the base case returns it.'],
        ['3', '`return countDown(…)` ialah tindakan terakhir — panggilan ekor; bingkai semasa digunakan semula.', '`return countDown(…)` is the final action — a tail call; the current frame is reused.'],
        ['6–7', 'Setengah juta "rekursi" tanpa limpahan timbunan.', 'Half a million "recursions" without a stack overflow.'])),
    S('common_mistakes',
      UL(
        ['`local f = function … f() … end` — rekursi merujuk global `nil`.', '`local f = function … f() … end` — the recursion refers to a `nil` global.'],
        ['Kes asas yang hilang atau yang tidak dapat dicapai (contohnya `n == 0` dengan `n` negatif).', 'A missing base case, or one that cannot be reached (for example `n == 0` with a negative `n`).'],
        ['Menganggap `return 1 + f(x)` ialah panggilan ekor.', 'Assuming `return 1 + f(x)` is a tail call.'],
        ['Rekursi berganda tanpa memoisasi (Fibonacci naif) untuk input besar.', 'Double recursion without memoisation (naive Fibonacci) for large inputs.'],
      )),
    S('debugging',
      P('Untuk menyahpepijat rekursi, cetak argumen pada permulaan setiap panggilan bersama inden yang sepadan dengan kedalaman — anda akan melihat "pokok" panggilan. Jika anda melihat `stack overflow`, semak sama ada setiap laluan bergerak ke arah kes asas. Rekursi bersama memerlukan pengisytiharan awal; contoh berikut menunjukkan corak yang betul:',
        'To debug recursion, print the arguments at the start of every call with indentation matching the depth — you will see the "tree" of calls. If you see `stack overflow`, check that every path moves towards the base case. Mutual recursion needs a forward declaration; the following example shows the correct pattern:'),
      CODE('mutual-recursion', 'lua', 'lua54', ['Rekursi bersama dengan pengisytiharan awal', 'Mutual recursion with a forward declaration'], `
local isEven, isOdd

function isEven(n)
  if n == 0 then return true end
  return isOdd(n - 1)
end

function isOdd(n)
  if n == 0 then return false end
  return isEven(n - 1)
end

print(isEven(10), isOdd(7), isEven(3))
`, 'true\ttrue\tfalse'),
      EXPLAIN('mutual-recursion',
        ['1', 'Isytiharkan kedua-dua local **sebelum** mana-mana fungsi ditakrif.', 'Declare both locals **before** either function is defined.'],
        ['3–6', '`function isEven` (tanpa `local`) memberi nilai kepada local yang sudah wujud; ia boleh merujuk `isOdd` kerana nama itu sudah dalam skop.', '`function isEven` (without `local`) assigns to the existing local; it can refer to `isOdd` because that name is already in scope.'],
        ['8–11', 'Simetri: setiap fungsi mengurangkan `n` dan menyerahkan kepada yang lain; kedua-duanya panggilan ekor.', 'Symmetric: each function decreases `n` and hands over to the other; both are tail calls.'],
        ['13', 'Tiga ujian.', 'Three tests.'])),
    S('performance',
      P('Rekursi mempunyai kos panggilan fungsi bagi setiap langkah — sedikit lebih perlahan daripada gelung yang setara. Kos sebenar datang daripada rekursi **berganda**: Fibonacci naif memanggil dirinya dua kali setiap langkah, jadi bilangan panggilan bertumbuh secara eksponen. Memoisasi — menyimpan hasil yang sudah dikira dalam table — menukarnya kepada linear.',
        'Recursion costs a function call per step — slightly slower than an equivalent loop. The real cost comes from **double** recursion: naive Fibonacci calls itself twice per step, so the number of calls grows exponentially. Memoisation — storing already computed results in a table — makes it linear.')),
    S('software_engineering',
      P('Fibonacci naif berbanding dengan memoisasi — hasil yang sama, kerja yang sangat berbeza:', 'Naive Fibonacci versus memoised — the same results, very different work:'),
      CODE('poor-naive-fib', 'lua', 'lua54', ['Pelaksanaan lemah: rekursi berganda naif', 'Poor implementation: naive double recursion'], `
local calls = 0
local function fib(n)
  calls = calls + 1
  if n < 2 then return n end
  return fib(n - 1) + fib(n - 2)
end

print(fib(20), "calls:", calls)
`, '6765\tcalls:\t21891'),
      EXPLAIN('poor-naive-fib',
        ['1–6', 'Setiap panggilan membuat dua lagi; nilai yang sama dikira beribu-ribu kali.', 'Every call makes two more; the same values are computed thousands of times.'],
        ['8', 'Hampir 22 000 panggilan untuk `fib(20)`; `fib(40)` memerlukan lebih daripada 300 juta.', 'Almost 22,000 calls for `fib(20)`; `fib(40)` would need over 300 million.']),
      CODE('improved-memo-fib', 'lua', 'lua54', ['Pelaksanaan lebih baik: memoisasi', 'Improved implementation: memoisation'], `
local calls = 0
local memo = {}
local function fib(n)
  calls = calls + 1
  if n < 2 then return n end
  if memo[n] then return memo[n] end
  local value = fib(n - 1) + fib(n - 2)
  memo[n] = value
  return value
end

print(fib(20), "calls:", calls)
print(fib(80))
`, '6765\tcalls:\t39\n23416728348467685'),
      EXPLAIN('improved-memo-fib',
        ['1–2', 'Kaunter dan table memo, di luar fungsi supaya ia kekal antara panggilan.', 'A counter and a memo table, outside the function so they persist between calls.'],
        ['3–6', 'Kes asas, kemudian semak sama ada hasil sudah dikira.', 'The base case, then check whether the result is already known.'],
        ['7–9', 'Kira sekali, simpan, pulangkan.', 'Compute once, store, return.'],
        ['12–13', '39 panggilan dan bukannya 21 891; `fib(80)` serta-merta.', '39 calls instead of 21,891; `fib(80)` is instant.'])),
    S('industry_use_cases',
      UL(
        ['Penghurai JSON dan XML menggunakan rekursi untuk objek dan tatasusunan bersarang.', 'JSON and XML parsers use recursion for nested objects and arrays.'],
        ['Fungsi `deepcopy` dan `vim.inspect` melawat table bersarang secara rekursif.', '`deepcopy` functions and `vim.inspect` visit nested tables recursively.'],
        ['Kecerdasan buatan permainan (minimax) dan pencarian laluan meneroka pokok keputusan secara rekursif.', 'Game AI (minimax) and pathfinding explore decision trees recursively.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis `power(base, exp)` secara rekursif (kes asas `exp == 0`).', 'Write `power(base, exp)` recursively (base case `exp == 0`).'],
        ['Tambah cetakan berinden dalam `countItems` untuk melihat pokok panggilan.', 'Add indented printing to `countItems` to see the call tree.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      ),
      WARN('Jangan uji rekursi tanpa kes asas dengan `print` di dalamnya — ia akan mencetak sejumlah besar baris sebelum limpahan timbunan.', 'Do not test base-case-free recursion with a `print` inside — it will print an enormous number of lines before the stack overflows.', ['Amaran', 'Warning'])),
    S('mini_project',
      P('**Menara Hanoi.** Pindahkan n cakera dari tiang A ke C menggunakan B, satu demi satu, tanpa meletakkan cakera besar di atas yang kecil. Cetak setiap langkah dan jumlah langkah.', '**The Tower of Hanoi.** Move n discs from peg A to C using B, one at a time, never placing a larger disc on a smaller one. Print every move and the total number of moves.'),
      CODE('hanoi', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local moves = 0

local function hanoi(n, from, to, via)
  if n == 0 then return end
  hanoi(n - 1, from, via, to)
  moves = moves + 1
  print(moves .. ": disc " .. n .. " " .. from .. " -> " .. to)
  hanoi(n - 1, via, to, from)
end

hanoi(3, "A", "C", "B")
print("total moves: " .. moves)
`, '1: disc 1 A -> C\n2: disc 2 A -> B\n3: disc 1 C -> B\n4: disc 3 A -> C\n5: disc 1 B -> A\n6: disc 2 B -> C\n7: disc 1 A -> C\ntotal moves: 7'),
      EXPLAIN('hanoi',
        ['1', 'Kaunter langkah di luar fungsi.', 'A move counter outside the function.'],
        ['3–4', 'Kes asas: tiada cakera, tiada kerja.', 'Base case: no discs, no work.'],
        ['5', 'Alihkan n − 1 cakera ke tiang perantara.', 'Move n − 1 discs out of the way to the spare peg.'],
        ['6–7', 'Alihkan cakera terbesar ke destinasi.', 'Move the largest disc to its destination.'],
        ['8', 'Alihkan n − 1 cakera dari perantara ke atas cakera terbesar.', 'Move the n − 1 discs from the spare peg onto the largest disc.'],
        ['11–12', 'Tiga cakera memerlukan 2³ − 1 = 7 langkah.', 'Three discs need 2³ − 1 = 7 moves.'])),
    S('summary',
      UL(
        ['Rekursi = kes asas + kes rekursif yang mengecilkan masalah.', 'Recursion = a base case + a recursive case that shrinks the problem.'],
        ['Gunakan `local function f` (bukan `local f = function`) untuk rekursi.', 'Use `local function f` (not `local f = function`) for recursion.'],
        ['Tiada kes asas → `stack overflow`; `return f(x)` ialah panggilan ekor tanpa bingkai tambahan.', 'No base case → `stack overflow`; `return f(x)` is a tail call with no extra frame.'],
        ['Memoisasi menghapuskan kerja berulang dalam rekursi berganda.', 'Memoisation eliminates repeated work in double recursion.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah kes asas dalam `sumDigits`?', 'What is the base case in `sumDigits`?'],
        ['Mengapakah `local f = function(n) return f(n - 1) end` gagal?', 'Why does `local f = function(n) return f(n - 1) end` fail?'],
        ['Adakah `return n * f(n - 1)` panggilan ekor? Mengapa?', 'Is `return n * f(n - 1)` a tail call? Why?'],
        ['Berapa langkah diperlukan untuk Menara Hanoi dengan 5 cakera?', 'How many moves does the Tower of Hanoi need with 5 discs?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Programming in Lua (1st ed.) — 6.2 Non-Global Functions (local function and recursion)', url: `${PIL}/6.2.html` },
        { title: 'Programming in Lua (1st ed.) — 6.3 Proper Tail Calls', url: `${PIL}/6.3.html` },
        { title: 'Lua 5.4 Reference Manual §3.4.10 — Function Calls (tail calls)', url: `${MANUAL}#3.4.10` },
        { title: 'Lua 5.4 Reference Manual §3.4.11 — Function Definitions (local function)', url: `${MANUAL}#3.4.11` },
      )),
  ],
};

// ─── 4.3 An introduction to upvalues ───────────────────────────────────────

export const LUA104_4_3: LectureContentDef = {
  courseCode: 'LUA104',
  module: 4,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan [[upvalue]] dan [[closure]].', 'Explain [[upvalue|upvalues]] and [[closure|closures]].'],
        ['Menulis kilang fungsi yang menyimpan keadaan peribadi.', 'Write function factories that hold private state.'],
        ['Meramal sama ada dua closure berkongsi atau mempunyai upvalue berasingan.', 'Predict whether two closures share or have separate upvalues.'],
        ['Menerangkan mengapa setiap pusingan gelung `for` mencipta pemboleh ubah baharu untuk closure.', 'Explain why every pass of a `for` loop creates a new variable for closures.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1–4.2: skop leksikal dan `local function`.', 'Lectures 4.1–4.2: lexical scope and `local function`.'],
        ['Kuliah 1.2 dan 3.3: fungsi sebagai nilai dan kilang fungsi.', 'Lectures 1.2 and 3.3: functions as values and function factories.'],
      )),
    S('introduction',
      P('Dalam kuliah 3.3, pemformat yang dipulangkan oleh `makeFormatter` "mengingati" mata wang walaupun `makeFormatter` sudah tamat. Bagaimana? Fungsi dalaman merujuk local fungsi luar, dan Lua memastikan local itu **terus hidup** selagi fungsi dalaman wujud. Local sebegini dipanggil **upvalue**, dan fungsi bersama upvaluenya dipanggil **closure**. Ini ialah salah satu ciri paling berkuasa dalam Lua: ia membolehkan keadaan peribadi tanpa kelas, objek, atau pemboleh ubah global.',
        'In lecture 3.3, the formatter returned by `makeFormatter` "remembered" its currency even though `makeFormatter` had already returned. How? The inner function refers to a local of the outer function, and Lua keeps that local **alive** as long as the inner function exists. Such a local is called an **upvalue**, and a function together with its upvalues is called a **closure**. This is one of Lua’s most powerful features: it allows private state without classes, objects, or global variables.'),
      KEY('Fungsi dalaman + local luar yang digunakannya = closure. Local itu kekal hidup bersama closure.', 'Inner function + the outer locals it uses = a closure. Those locals stay alive with the closure.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Upvalue:** local fungsi luar yang dirujuk oleh fungsi dalaman.', '**Upvalue:** a local of an outer function referred to by an inner function.'],
        ['**Closure:** nilai fungsi + upvaluenya; setiap ungkapan `function` yang dijalankan mencipta closure baharu.', '**Closure:** a function value + its upvalues; every `function` expression that runs creates a new closure.'],
        ['Setiap **panggilan** kilang mencipta upvalue baharu → keadaan berasingan.', 'Every **call** of a factory creates new upvalues → separate state.'],
        ['Closure yang dicipta dalam **panggilan yang sama** berkongsi upvalue.', 'Closures created in the **same call** share upvalues.'],
        ['Upvalue ialah pemboleh ubah, bukan salinan nilai: perubahan dilihat oleh semua yang berkongsi.', 'An upvalue is a variable, not a copy of a value: changes are seen by everyone sharing it.'],
      )),
    S('detailed_theory',
      P('Semasa fungsi luar berjalan, local-nya hidup dalam daftar timbunan. Apabila fungsi dalaman dicipta dan merujuk salah satu local itu, Lua merekodkan rujukan kepada **pemboleh ubah** tersebut (upvalue "terbuka"). Apabila fungsi luar pulang dan bingkainya dibuang, Lua memindahkan nilai pemboleh ubah itu ke dalam objek upvalue di heap ("menutup" upvalue) — dari sinilah nama *closure*. Sejak itu, closure membaca dan menulis objek tersebut. Kerana ia pemboleh ubah dan bukan salinan, dua closure yang dicipta dalam panggilan yang sama berkongsi satu upvalue: satu menambah, yang lain melihat perubahan.',
        'While the outer function runs, its locals live in stack registers. When an inner function is created and refers to one of those locals, Lua records a reference to that **variable** (an "open" upvalue). When the outer function returns and its frame is discarded, Lua moves the variable’s value into an upvalue object on the heap ("closing" the upvalue) — hence the name *closure*. From then on, the closure reads and writes that object. Because it is a variable rather than a copy, two closures created in the same call share one upvalue: one increments, the other sees the change.'),
      P('Gelung `for` Lua mencipta pemboleh ubah gelung **baharu** pada setiap pusingan, jadi closure yang dicipta di dalam gelung menangkap nilai yang berbeza — `fns[1]()` memberi 1 dan `fns[3]()` memberi 3. Ini berbeza daripada sesetengah bahasa di mana semua closure berkongsi satu pemboleh ubah gelung. Sebaliknya, jika closure menangkap pemboleh ubah yang diisytiharkan **di luar** gelung `while`, semuanya berkongsi pemboleh ubah itu dan melihat nilai akhirnya. Closure ialah asas modul, iterator (LUA112), pengendali acara dan corak objek dalam kursus akan datang.',
        'Lua’s `for` loop creates a **new** loop variable on every pass, so closures created inside the loop capture different values — `fns[1]()` gives 1 and `fns[3]()` gives 3. This differs from some languages in which all closures share one loop variable. Conversely, if closures capture a variable declared **outside** a `while` loop, they all share that variable and see its final value. Closures are the basis of modules, iterators (LUA112), event handlers and the object patterns of later courses.')),
    S('technical_terminology', TERMS('upvalue', 'closure', 'scope', 'first-class-function')),
    S('syntax_rules',
      UL(
        ['Kilang: `local function make() local state = … return function() … state … end end`.', 'Factory: `local function make() local state = … return function() … state … end end`.'],
        ['Beberapa closure berkongsi: pulangkan table `{inc = function() … end, get = function() … end}`.', 'Several sharing closures: return a table `{inc = function() … end, get = function() … end}`.'],
        ['Panggil kilang dengan `()`: `local c = make()`, bukan `local c = make`.', 'Call the factory with `()`: `local c = make()`, not `local c = make`.'],
      )),
    S('code_demonstration',
      CODE('make-counter', 'lua', 'lua54', ['Kaunter dengan keadaan peribadi', 'A counter with private state'], `
local function makeCounter()
  local count = 0
  return function()
    count = count + 1
    return count
  end
end

local a = makeCounter()
local b = makeCounter()
print(a(), a(), a())
print(b())
print(count)
`, '1\t2\t3\n1\nnil'),
      EXPLAIN('make-counter',
        ['1–2', '`count` ialah local `makeCounter`.', '`count` is a local of `makeCounter`.'],
        ['3–6', 'Fungsi dalaman merujuk `count` — ia menjadi upvalue. `makeCounter` pulang, tetapi `count` terus hidup.', 'The inner function refers to `count` — it becomes an upvalue. `makeCounter` returns, but `count` lives on.'],
        ['9–10', 'Dua panggilan kilang → dua `count` berasingan.', 'Two factory calls → two separate `count`s.'],
        ['11–12', '`a` mengira hingga 3; `b` bermula semula dari 1.', '`a` counts to 3; `b` starts again from 1.'],
        ['13', '`count` tidak boleh diakses dari luar — ia peribadi kepada closure.', '`count` cannot be reached from outside — it is private to the closures.'])),
    S('complete_examples',
      CODE('shared-upvalue', 'lua', 'lua54', ['Dua closure berkongsi satu upvalue', 'Two closures sharing one upvalue'], `
local function makeScore()
  local points = 0
  local function add(n) points = points + n end
  local function get() return points end
  return add, get
end

local add, get = makeScore()
add(10)
add(5)
print(get())
local add2, get2 = makeScore()
add2(1)
print(get(), get2())
`, '15\n15\t1', {
        debug: BUG(`
local function makeCounter()
  local n = 0
  return function() n = n + 1; return n end
end
local counter = makeCounter
print(counter() + 1)
`, 'example:6: attempt to perform arithmetic on a function value',
          '`makeCounter` diberikan **tanpa** dipanggil, jadi `counter` ialah kilang itu sendiri. `counter()` kemudian memulangkan fungsi kaunter (bukan nombor), dan `fungsi + 1` gagal. Mesej `function value` ialah petunjuk: anda mempunyai fungsi di tempat yang menjangkakan nilai. Panggil kilang: `local counter = makeCounter()`.',
          '`makeCounter` was assigned **without** being called, so `counter` is the factory itself. `counter()` then returns the counter function (not a number), and `function + 1` fails. The message `function value` is the clue: you have a function where a value was expected. Call the factory: `local counter = makeCounter()`.'),
      }),
      EXPLAIN('shared-upvalue',
        ['1–2', 'Satu upvalue `points`.', 'One upvalue `points`.'],
        ['3–4', 'Dua closure yang dicipta dalam panggilan yang **sama** — kedua-duanya merujuk `points` yang sama.', 'Two closures created in the **same** call — both refer to the same `points`.'],
        ['5', 'Pulangkan kedua-duanya sebagai nilai berbilang.', 'Return both as multiple values.'],
        ['8–11', '`add` mengubah; `get` melihat perubahan: 15.', '`add` changes it; `get` sees the change: 15.'],
        ['12–14', 'Panggilan kilang kedua → `points` baharu yang berasingan.', 'A second factory call → a new, separate `points`.']),
      CODE('loop-closures', 'lua', 'lua54', ['Closure dalam gelung', 'Closures in loops'], `
local fromFor = {}
for i = 1, 3 do
  fromFor[i] = function() return i end
end
print(fromFor[1](), fromFor[2](), fromFor[3]())

local fromWhile = {}
local j = 0
while j < 3 do
  j = j + 1
  fromWhile[j] = function() return j end
end
print(fromWhile[1](), fromWhile[2](), fromWhile[3]())
`, '1\t2\t3\n3\t3\t3', {
        debug: BUG(`
local function addToTotal(x)
  total = total + x
end
local total = 0
addToTotal(5)
`, "example:2: attempt to perform arithmetic on a nil value (global 'total')",
          '`local total` diisytiharkan **selepas** fungsi. Semasa `addToTotal` dikompil, tiada local `total` dalam skop, jadi nama itu merujuk global — bukan upvalue. Local yang diisytiharkan kemudian tidak membantu: skop leksikal ditentukan oleh kedudukan dalam teks. Isytiharkan `local total = 0` **sebelum** fungsi yang menggunakannya.',
          '`local total` is declared **after** the function. When `addToTotal` is compiled there is no local `total` in scope, so the name refers to a global — not an upvalue. A local declared later does not help: lexical scope is decided by position in the text. Declare `local total = 0` **before** the function that uses it.'),
      }),
      EXPLAIN('loop-closures',
        ['1–5', 'Gelung `for` mencipta `i` baharu setiap pusingan: setiap closure menangkap `i` sendiri.', 'The `for` loop creates a new `i` every pass: each closure captures its own `i`.'],
        ['7–12', '`j` diisytiharkan **sekali** di luar gelung: ketiga-tiga closure berkongsi pemboleh ubah yang sama.', '`j` is declared **once** outside the loop: all three closures share the same variable.'],
        ['13', 'Semuanya melihat nilai akhir `j`, iaitu 3.', 'They all see `j`’s final value, 3.'])),
    S('line_by_line',
      EXPLAIN('make-counter',
        ['4', 'Assignment kepada upvalue: ia menukar pemboleh ubah yang dikongsi, bukan salinan. Itulah sebabnya kiraan bertambah merentas panggilan `a()`.', 'An assignment to an upvalue: it changes the shared variable, not a copy. That is why the count grows across `a()` calls.']),
      EXPLAIN('loop-closures',
        ['3', 'Setiap ungkapan `function` yang dijalankan mencipta closure **baharu** — tiga closure berbeza, setiap satu dengan upvalue `i` sendiri.', 'Every `function` expression that runs creates a **new** closure — three different closures, each with its own `i` upvalue.'])),
    S('why_this_way',
      P('Mengapa closure? Kerana ia memberi keadaan **peribadi** yang tidak boleh diubah dari luar kecuali melalui fungsi yang anda sediakan — pengkapsulan tanpa sintaks kelas. Ia juga membolehkan fungsi dikonfigurasi sekali dan digunakan berkali-kali (kuliah 3.3), dan menjadi asas iterator dan pengendali acara.',
        'Why closures? Because they give **private** state that cannot be changed from outside except through the functions you provide — encapsulation without class syntax. They also let functions be configured once and used many times (lecture 3.3), and they are the foundation of iterators and event handlers.'),
      P('Gunakan closure **apabila** sekeping keadaan kecil hanya perlu diakses oleh beberapa fungsi; gunakan table **apabila** keadaan perlu diperiksa, disimpan atau disirikan dari luar.', 'Use closures **when** a small piece of state should be accessible only to a few functions; use a table **when** the state must be inspected, saved or serialised from outside.')),
    S('execution_flow',
      OL(
        ['`local a = makeCounter()`: `count = 0` dicipta; closure dipulangkan; `makeCounter` tamat — `count` ditutup ke heap.', '`local a = makeCounter()`: `count = 0` is created; a closure is returned; `makeCounter` ends — `count` is closed onto the heap.'],
        ['`a()` → `count` menjadi 1 → pulang 1. `a()` lagi → 2, kemudian 3.', '`a()` → `count` becomes 1 → returns 1. `a()` again → 2, then 3.'],
        ['`local b = makeCounter()` → `count` **baharu** = 0; `b()` → 1.', '`local b = makeCounter()` → a **new** `count` = 0; `b()` → 1.'],
      )),
    S('memory_behaviour',
      P('Setiap closure ialah objek heap kecil yang memegang rujukan kepada upvalue-nya. Upvalue kekal selagi sekurang-kurangnya satu closure yang merujuknya wujud; apabila semua closure tidak lagi dirujuk, upvalue dan nilainya boleh dikutip. Ini juga punca kebocoran memori yang halus: closure yang disimpan dalam table global (contohnya pengendali acara yang tidak pernah dibuang) memastikan semua upvalue-nya — termasuk table besar — kekal hidup.',
        'Every closure is a small heap object holding references to its upvalues. An upvalue lives as long as at least one closure referring to it exists; once no closure is referenced any more, the upvalue and its value can be collected. This is also a subtle source of memory leaks: a closure stored in a global table (for example an event handler that is never removed) keeps all its upvalues — including large tables — alive.')),
    S('alternative_implementations',
      P('Keadaan yang sama dalam table — boleh dilihat dari luar, berguna untuk penyahpepijatan dan penyimpanan:', 'The same state in a table — visible from outside, useful for debugging and saving:'),
      CODE('table-counter', 'lua', 'lua54', ['Kaunter sebagai table', 'A counter as a table'], `
local function newCounter()
  local counter = {value = 0}
  counter.increment = function()
    counter.value = counter.value + 1
    return counter.value
  end
  return counter
end

local c = newCounter()
c.increment()
c.increment()
print(c.value)
c.value = 100
print(c.increment())
`, '2\n101'),
      EXPLAIN('table-counter',
        ['1–8', 'Keadaan disimpan dalam medan `value`; fungsi `increment` ialah closure atas `counter`.', 'The state lives in the `value` field; `increment` is a closure over `counter`.'],
        ['10–13', 'Nilai boleh dibaca terus.', 'The value can be read directly.'],
        ['14–15', '…dan juga ditukar terus dari luar — fleksibel, tetapi tiada perlindungan.', '…and also changed directly from outside — flexible, but unprotected.'])),
    S('common_mistakes',
      UL(
        ['Lupa memanggil kilang (`make` dan bukan `make()`).', 'Forgetting to call the factory (`make` instead of `make()`).'],
        ['Mengisytiharkan local selepas fungsi yang menggunakannya.', 'Declaring a local after the function that uses it.'],
        ['Menjangka closure menyalin nilai — sebenarnya ia berkongsi pemboleh ubah.', 'Expecting a closure to copy a value — it actually shares the variable.'],
        ['Menyimpan closure dalam senarai global yang tidak pernah dikosongkan.', 'Storing closures in a global list that is never cleared.'],
      )),
    S('debugging',
      P('Apabila closure melihat nilai yang tidak dijangka, tanya: "pemboleh ubah mana yang ditangkap, dan siapa lagi yang menangkapnya?" Jika beberapa closure berkelakuan seperti satu, ia berkongsi upvalue (dicipta dalam panggilan yang sama, atau pemboleh ubah luar gelung). Jika closure melihat `nil` global, pemboleh ubah diisytiharkan selepas fungsi. Contoh berikut menunjukkan cara memberi setiap closure salinan nilainya sendiri, walaupun dalam gelung `while`:',
        'When a closure sees an unexpected value, ask: "which variable was captured, and who else captured it?" If several closures behave as one, they share an upvalue (created in the same call, or a variable outside a loop). If a closure sees a `nil` global, the variable was declared after the function. The following example shows how to give every closure its own copy of a value, even in a `while` loop:'),
      CODE('fresh-copy', 'lua', 'lua54', ['Salinan local baharu bagi setiap closure', 'A fresh local copy per closure'], `
local handlers = {}
local k = 0
while k < 3 do
  k = k + 1
  local id = k
  handlers[k] = function() return "handler " .. id end
end
print(handlers[1](), handlers[3]())
`, 'handler 1\thandler 3'),
      EXPLAIN('fresh-copy',
        ['1–2', 'Senarai pengendali dan kaunter luar yang dikongsi.', 'A handler list and a shared outer counter.'],
        ['3–7', '`local id = k` mencipta local **baharu** dalam setiap pusingan; setiap closure menangkap `id` sendiri dan bukan `k` yang dikongsi.', '`local id = k` creates a **new** local in every pass; each closure captures its own `id` rather than the shared `k`.'],
        ['8', 'Setiap pengendali mengingati nombornya sendiri.', 'Each handler remembers its own number.'])),
    S('performance',
      P('Mengakses upvalue hampir sepantas mengakses local. Mencipta closure memperuntukkan objek kecil, jadi elakkan mencipta closure baharu dalam gelung yang sangat panas jika fungsi yang sama boleh dicipta sekali. Untuk keadaan kecil, closure biasanya lebih pantas daripada table kerana tiada carian medan.',
        'Accessing an upvalue is almost as fast as accessing a local. Creating a closure allocates a small object, so avoid creating new closures in very hot loops if the same function could be created once. For small state, closures are usually faster than tables because there is no field lookup.')),
    S('software_engineering',
      P('Keadaan global yang dikongsi berbanding keadaan peribadi dalam closure:', 'Shared global state versus private state in a closure:'),
      CODE('poor-global-counter', 'lua', 'lua54', ['Pelaksanaan lemah: kaunter global', 'Poor implementation: a global counter'], `
nextId = 0
local function newId()
  nextId = nextId + 1
  return "user-" .. nextId
end

print(newId(), newId())
nextId = 0
print(newId())
`, 'user-1\tuser-2\nuser-1'),
      EXPLAIN('poor-global-counter',
        ['1–5', 'Kaunter ialah global — mana-mana kod boleh menukarnya.', 'The counter is a global — any code can change it.'],
        ['7–9', 'Kod lain menetapkan semula `nextId`, dan ID pendua "user-1" dikeluarkan.', 'Other code resets `nextId`, and a duplicate ID "user-1" is issued.']),
      CODE('improved-private-ids', 'lua', 'lua54', ['Pelaksanaan lebih baik: kaunter peribadi', 'Improved implementation: a private counter'], `
local function makeIdGenerator(prefix)
  local nextId = 0
  return function()
    nextId = nextId + 1
    return prefix .. "-" .. nextId
  end
end

local newUserId = makeIdGenerator("user")
local newOrderId = makeIdGenerator("order")
print(newUserId(), newUserId(), newOrderId())
`, 'user-1\tuser-2\torder-1'),
      EXPLAIN('improved-private-ids',
        ['1–7', '`nextId` ialah upvalue — hanya closure yang dipulangkan boleh mengubahnya.', '`nextId` is an upvalue — only the returned closure can change it.'],
        ['9–11', 'Dua penjana bebas, setiap satu dengan awalan dan kaunter sendiri; tiada kod lain boleh menetapkan semula kaunter.', 'Two independent generators, each with its own prefix and counter; no other code can reset a counter.'])),
    S('industry_use_cases',
      UL(
        ['Modul Lua menyimpan keadaan peribadi sebagai local fail yang ditangkap oleh fungsi awam.', 'Lua modules keep private state as file locals captured by public functions.'],
        ['Pengendali acara (`autocmd` Neovim, butang UI) menangkap konteks mereka sebagai upvalue.', 'Event handlers (Neovim `autocmd`s, UI buttons) capture their context as upvalues.'],
        ['Fungsi "debounce", "once" dan "memoize" dalam pustaka utiliti dibina dengan closure.', '"Debounce", "once" and "memoize" functions in utility libraries are built with closures.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah fungsi `reset` pada `makeScore` yang berkongsi `points`.', 'Add a `reset` function to `makeScore` that shares `points`.'],
        ['Dalam `loop-closures`, tambah `local copy = j` di dalam gelung `while` dan gunakan `copy`. Apakah outputnya sekarang?', 'In `loop-closures`, add `local copy = j` inside the `while` loop and use `copy`. What is the output now?'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Akaun bank dengan closure.** Tulis `openAccount(initial)` yang memulangkan table dengan `deposit`, `withdraw` dan `balance`. Baki ialah upvalue peribadi; pengeluaran melebihi baki memulangkan `nil, mesej`.', '**A bank account with closures.** Write `openAccount(initial)` returning a table with `deposit`, `withdraw` and `balance`. The balance is a private upvalue; a withdrawal larger than the balance returns `nil, message`.'),
      CODE('bank-account', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function openAccount(initial)
  local balance = initial or 0
  local account = {}
  function account.deposit(amount)
    balance = balance + amount
    return balance
  end
  function account.withdraw(amount)
    if amount > balance then
      return nil, "insufficient funds: balance is " .. balance
    end
    balance = balance - amount
    return balance
  end
  function account.balance() return balance end
  return account
end

local acc = openAccount(100)
acc.deposit(50)
print(acc.withdraw(30))
print(acc.withdraw(500))
print(acc.balance(), acc.amount)
`, '120\nnil\tinsufficient funds: balance is 120\n120\tnil'),
      EXPLAIN('bank-account',
        ['1–3', 'Baki ialah upvalue; `account` ialah table fungsi awam.', 'The balance is an upvalue; `account` is a table of public functions.'],
        ['4–7', '`function account.deposit` = `account.deposit = function …` — closure atas `balance`.', '`function account.deposit` = `account.deposit = function …` — a closure over `balance`.'],
        ['8–14', 'Pengeluaran disahkan dengan corak `nil, mesej` (kuliah 2.3).', 'Withdrawals are validated with the `nil, message` pattern (lecture 2.3).'],
        ['15–16', 'Pembaca baki dan table dipulangkan.', 'A balance reader, and the table is returned.'],
        ['19–23', '100 + 50 − 30 = 120; pengeluaran berlebihan ditolak; baki tidak boleh dicapai sebagai medan.', '100 + 50 − 30 = 120; the overdraft is rejected; the balance cannot be reached as a field.'])),
    S('summary',
      UL(
        ['Upvalue = local fungsi luar yang digunakan oleh fungsi dalaman; closure = fungsi + upvalue-nya.', 'Upvalue = an outer function’s local used by an inner function; closure = a function + its upvalues.'],
        ['Setiap panggilan kilang → upvalue baharu; closure dalam panggilan yang sama → berkongsi.', 'Every factory call → new upvalues; closures from the same call → shared.'],
        ['`for` mencipta pemboleh ubah baharu setiap pusingan; pemboleh ubah luar gelung dikongsi.', '`for` creates a new variable every pass; a variable outside the loop is shared.'],
        ['Closure memberi keadaan peribadi tanpa global.', 'Closures give private state without globals.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dicetak oleh `a(); a(); print(b())` jika `a` dan `b` daripada dua panggilan `makeCounter()`?', 'What does `a(); a(); print(b())` print if `a` and `b` come from two `makeCounter()` calls?'],
        ['Mengapakah `fromWhile[1]()` memberi 3?', 'Why does `fromWhile[1]()` give 3?'],
        ['Apakah perbezaan antara `local c = make` dan `local c = make()`?', 'What is the difference between `local c = make` and `local c = make()`?'],
        ['Bagaimanakah closure boleh menyebabkan kebocoran memori?', 'How can a closure cause a memory leak?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Programming in Lua (1st ed.) — 6.1 Closures', url: `${PIL}/6.1.html` },
        { title: 'Lua 5.4 Reference Manual §3.5 — Visibility Rules (upvalues)', url: `${MANUAL}#3.5` },
        { title: 'Lua 5.4 Reference Manual §3.3.5 — For Statement (fresh loop variables)', url: `${MANUAL}#3.3.5` },
        { title: 'R. Ierusalimschy, L. H. de Figueiredo, W. Celes — The Implementation of Lua 5.0 (closures, §5)', url: 'https://www.lua.org/doc/jucs05.pdf' },
      )),
  ],
};

export const LUA104_M4 = [LUA104_4_1, LUA104_4_2, LUA104_4_3];
