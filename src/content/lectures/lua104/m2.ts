import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA104 · Module 2 — Multiple Return Values (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 2.1 return a, b and multiple assignment ───────────────────────────────

export const LUA104_2_1: LectureContentDef = {
  courseCode: 'LUA104',
  module: 2,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Memulangkan beberapa nilai dengan `return a, b, c`.', 'Return several values with `return a, b, c`.'],
        ['Menerima nilai pulangan dengan [[multiple-assignment|assignment berbilang]], dan melangkau nilai dengan `_`.', 'Receive return values with [[multiple-assignment]], and skip values with `_`.'],
        ['Membandingkan nilai pulangan berbilang dengan memulangkan table.', 'Compare multiple return values with returning a table.'],
        ['Mengira beberapa hasil dalam satu laluan data.', 'Compute several results in a single pass over the data.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1: definisi fungsi, parameter dan `return`.', 'Module 1: function definitions, parameters and `return`.'],
        ['LUA102 1.2: assignment berbilang dan pertukaran nilai.', 'LUA102 1.2: multiple assignment and value swaps.'],
      )),
    S('introduction',
      P('Kebanyakan bahasa membenarkan fungsi memulangkan satu nilai sahaja; untuk lebih, anda perlu membina objek atau array. Lua membenarkan `return` dengan senarai nilai: `return smallest, largest`. Pemanggil menerimanya dengan assignment berbilang: `local lo, hi = minMax(list)`. Pustaka standard menggunakan ciri ini di mana-mana — `string.find` memulangkan kedudukan mula dan tamat, `math.modf` memulangkan bahagian integer dan pecahan, `pcall` memulangkan status dan hasil.',
        'Most languages let a function return only one value; for more, you must build an object or an array. Lua allows `return` with a list of values: `return smallest, largest`. The caller receives them with multiple assignment: `local lo, hi = minMax(list)`. The standard library uses this everywhere — `string.find` returns the start and end positions, `math.modf` returns the integer and fractional parts, `pcall` returns a status and results.'),
      KEY('`return a, b` + `local x, y = f()` — tiada table, tiada peruntukan tambahan.', '`return a, b` + `local x, y = f()` — no table, no extra allocation.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`return a, b, c` memulangkan tiga nilai berasingan, bukan satu table.', '`return a, b, c` returns three separate values, not one table.'],
        ['Penerimaan mengikut kedudukan: nilai pertama ke nama pertama, dan seterusnya.', 'Receiving is positional: the first value to the first name, and so on.'],
        ['Nama tambahan menjadi `nil`; nilai tambahan dibuang.', 'Extra names become `nil`; extra values are discarded.'],
        ['`_` ialah konvensyen untuk nilai yang tidak diperlukan: `local _, hi = minMax(t)`.', '`_` is the convention for unwanted values: `local _, hi = minMax(t)`.'],
      )),
    S('detailed_theory',
      P('Nilai pulangan berbilang dilaksanakan pada timbunan Lua: fungsi meletakkan nilai-nilainya pada timbunan, dan arahan panggilan menyalinnya ke dalam pemboleh ubah sasaran. Tiada table dicipta, jadi memulangkan dua atau tiga nilai lebih murah daripada membina `{min = …, max = …}`. Penerimaan mengikut peraturan yang sama seperti assignment berbilang: senarai nilai dilaraskan kepada bilangan nama — dipotong jika terlalu banyak, ditambah `nil` jika terlalu sedikit.',
        'Multiple return values are implemented on the Lua stack: the function places its values on the stack, and the call instruction copies them into the target variables. No table is created, so returning two or three values is cheaper than building `{min = …, max = …}`. Receiving follows the same rule as multiple assignment: the list of values is adjusted to the number of names — truncated if there are too many, padded with `nil` if there are too few.'),
      P('Bila menggunakan nilai berbilang dan bila table? Nilai berbilang sesuai apabila bilangannya kecil (dua atau tiga), tetap, dan susunannya jelas daripada nama fungsi — `minMax`, `divmod`, `find`. Table lebih baik apabila terdapat banyak hasil, apabila sesetengahnya pilihan, atau apabila hasil perlu disimpan dan dihantar sebagai satu unit. Satu kelebihan penting nilai berbilang ialah pemanggil boleh mengabaikan nilai yang tidak diperlukan: `local q = divmod(17, 5)` hanya mengambil hasil bahagi.',
        'When to use multiple values and when a table? Multiple values suit a small (two or three), fixed number of results whose order is obvious from the function’s name — `minMax`, `divmod`, `find`. A table is better when there are many results, when some are optional, or when the results must be stored and passed around as one unit. An important advantage of multiple values is that the caller can ignore the ones it does not need: `local q = divmod(17, 5)` takes only the quotient.')),
    S('technical_terminology', TERMS('multiple-assignment', 'value-adjustment', 'function', 'number-subtype')),
    S('syntax_rules',
      UL(
        ['`return e1, e2, …` — senarai ungkapan dipisahkan koma.', '`return e1, e2, …` — a comma-separated list of expressions.'],
        ['`local a, b = f()` — terima dua nilai pertama.', '`local a, b = f()` — receive the first two values.'],
        ['`local _, b = f()` — langkau nilai pertama.', '`local _, b = f()` — skip the first value.'],
      )),
    S('code_demonstration',
      CODE('min-max', 'lua', 'lua54', ['Dua hasil daripada satu laluan', 'Two results from one pass'], `
local function minMax(list)
  local lo, hi = list[1], list[1]
  for i = 2, #list do
    if list[i] < lo then lo = list[i] end
    if list[i] > hi then hi = list[i] end
  end
  return lo, hi
end

local smallest, largest = minMax({42, 7, 19, 88, 3})
print(smallest, largest)
print(minMax({5}))
`, '3\t88\n5\t5'),
      EXPLAIN('min-max',
        ['1–2', 'Mulakan kedua-dua hasil dengan elemen pertama.', 'Start both results with the first element.'],
        ['3–6', 'Satu gelung mengemas kini kedua-dua hasil.', 'One loop updates both results.'],
        ['7', 'Dua nilai dipulangkan bersama.', 'Two values returned together.'],
        ['10–11', 'Assignment berbilang menerima kedua-duanya mengikut kedudukan.', 'Multiple assignment receives both by position.'],
        ['12', '`print` menerima kedua-dua nilai sebagai dua argumen.', '`print` receives both values as two arguments.'])),
    S('complete_examples',
      CODE('div-mod', 'lua', 'lua54', ['Hasil bahagi dan baki', 'Quotient and remainder'], `
local function divmod(a, b)
  return a // b, a % b
end

local q, r = divmod(17, 5)
print(q, r)
print(divmod(-7, 2))
local quotientOnly = divmod(100, 7)
print(quotientOnly)
`, '3\t2\n-4\t1\n14', {
        debug: BUG(`
local function divmod(a, b)
  return a // b, a % b
end
local q, r = divmod(17)
`, "example:2: attempt to perform arithmetic on a nil value (local 'b')",
          'Pembahagi terlupa: `b` menjadi `nil` (kuliah 1.3), dan `17 // nil` gagal **di dalam** fungsi, pada baris 2. Nilai pulangan berbilang tidak berkaitan dengan ralat ini, tetapi ia biasa berlaku apabila memanggil fungsi seperti `divmod` dengan tergesa-gesa. Berikan kedua-dua argumen.',
          'The divisor is forgotten: `b` becomes `nil` (lecture 1.3), and `17 // nil` fails **inside** the function, on line 2. Multiple returns are not the cause here, but this is common when calling functions like `divmod` in a hurry. Pass both arguments.'),
      }),
      EXPLAIN('div-mod',
        ['1–3', 'Dua operator, dua nilai pulangan.', 'Two operators, two return values.'],
        ['5–6', '17 = 3 × 5 + 2.', '17 = 3 × 5 + 2.'],
        ['7', '`//` dan `%` Lua membundarkan ke arah −∞: −7 = −4 × 2 + 1 (LUA102 3.1).', 'Lua’s `//` and `%` round towards −∞: −7 = −4 × 2 + 1 (LUA102 3.1).'],
        ['8–9', 'Satu nama sahaja: baki dibuang secara senyap.', 'Only one name: the remainder is silently discarded.']),
      CODE('skip-values', 'lua', 'lua54', ['Melangkau nilai dengan _', 'Skipping values with _'], `
local function stats(list)
  local sum = 0
  for _, v in ipairs(list) do sum = sum + v end
  return #list, sum, sum / #list
end

local count, total, mean = stats({4, 8, 6})
print(count, total, mean)
local _, onlyTotal = stats({10, 20})
print(onlyTotal)
`, '3\t18\t6.0\n30', {
        debug: BUG(`
local function bounds() return 1, 100 end
local low = bounds()
local high
print(high - low)
`, "example:4: attempt to perform arithmetic on a nil value (local 'high')",
          '`local low = bounds()` hanya menerima nilai pertama; 100 dibuang. Pengaturcara kemudian mengisytiharkan `high` secara berasingan dan lupa memberinya nilai. Terima kedua-dua nilai dalam satu pernyataan: `local low, high = bounds()`.',
          '`local low = bounds()` receives only the first value; 100 is discarded. The programmer then declares `high` separately and forgets to assign it. Receive both values in one statement: `local low, high = bounds()`.'),
      }),
      EXPLAIN('skip-values',
        ['1–5', 'Tiga hasil: bilangan, jumlah dan purata.', 'Three results: the count, the sum and the mean.'],
        ['7–8', 'Terima ketiga-tiganya; `/` sentiasa memberi float, jadi purata dicetak `6.0`.', 'Receive all three; `/` always gives a float, so the mean prints as `6.0`.'],
        ['9–10', '`_` mengambil bilangan yang tidak diperlukan; purata dibuang kerana tiada nama ketiga.', '`_` takes the unwanted count; the mean is discarded because there is no third name.'])),
    S('line_by_line',
      EXPLAIN('min-max',
        ['2', 'Assignment berbilang dalam pengisytiharan: dua local diberi nilai dalam satu baris. Untuk senarai kosong, kedua-duanya `nil` — pemanggil mesti mengendalikan kes itu.', 'Multiple assignment in a declaration: two locals assigned in one line. For an empty list both are `nil` — the caller must handle that case.']),
      EXPLAIN('skip-values',
        ['9', '`_` ialah nama pemboleh ubah biasa; menggunakannya hanya memberitahu pembaca "nilai ini sengaja diabaikan".', '`_` is an ordinary variable name; using it only tells the reader "this value is ignored on purpose".'])),
    S('why_this_way',
      P('Mengapa Lua menyokong nilai pulangan berbilang? Kerana ia mengelakkan peruntukan table untuk kes yang sangat biasa — dua atau tiga hasil yang berkaitan — dan kerana pemanggil boleh mengambil hanya apa yang diperlukan. Ia juga menjadikan corak `nil, mesej` (kuliah 2.3) semula jadi.',
        'Why does Lua support multiple return values? Because it avoids allocating a table for a very common case — two or three related results — and because the caller can take only what it needs. It also makes the `nil, message` pattern (lecture 2.3) natural.'),
      P('Pulangkan nilai berbilang **apabila** hasilnya sedikit dan susunannya jelas; pulangkan table **apabila** hasilnya banyak, bernama atau pilihan.', 'Return multiple values **when** the results are few and their order is obvious; return a table **when** the results are many, named or optional.')),
    S('execution_flow',
      OL(
        ['`min-max` baris 10: panggilan `minMax` dengan lima nombor.', '`min-max` line 10: `minMax` is called with five numbers.'],
        ['Gelung mengemas kini `lo` kepada 7 dan kemudian 3, dan `hi` kepada 88.', 'The loop updates `lo` to 7 and then 3, and `hi` to 88.'],
        ['`return lo, hi` meletakkan 3 dan 88 pada timbunan.', '`return lo, hi` places 3 and 88 on the stack.'],
        ['Assignment menyalin 3 ke `smallest` dan 88 ke `largest`.', 'The assignment copies 3 into `smallest` and 88 into `largest`.'],
      )),
    S('memory_behaviour',
      P('Nilai pulangan berbilang tidak memperuntukkan memori heap: ia hanya slot timbunan sementara. Memulangkan table `{lo, hi}` pula mencipta objek baharu pada setiap panggilan yang mesti dikutip kemudian. Dalam kod yang dipanggil berjuta kali (contohnya pengesanan perlanggaran dalam permainan), perbezaan ini boleh diukur.',
        'Multiple return values allocate no heap memory: they are just temporary stack slots. Returning a table `{lo, hi}`, by contrast, creates a new object on every call that must be collected later. In code called millions of times (for example collision detection in a game), the difference is measurable.')),
    S('alternative_implementations',
      P('Versi table bernama — lebih panjang, tetapi berguna apabila hasil perlu disimpan bersama:', 'A named-table version — longer, but useful when the results must be kept together:'),
      CODE('range-table', 'lua', 'lua54', ['Memulangkan table bernama', 'Returning a named table'], `
local function range(list)
  local r = {low = math.huge, high = -math.huge}
  for _, v in ipairs(list) do
    r.low = math.min(r.low, v)
    r.high = math.max(r.high, v)
  end
  return r
end

local r = range({12, 4, 30})
print(r.low, r.high, r.high - r.low)
`, '4\t30\t26'),
      EXPLAIN('range-table',
        ['1–2', 'Mulakan dengan ±infiniti supaya sebarang nombor menggantikannya.', 'Start with ±infinity so any number replaces it.'],
        ['3–6', '`math.min`/`math.max` mengemas kini medan.', '`math.min`/`math.max` update the fields.'],
        ['7', 'Satu table dipulangkan — hasil mempunyai nama, bukan kedudukan.', 'One table is returned — the results have names, not positions.'],
        ['10–11', 'Akses mengikut nama medan.', 'Access by field name.'])),
    S('common_mistakes',
      UL(
        ['Menerima ke dalam terlalu sedikit nama dan kehilangan nilai secara senyap.', 'Receiving into too few names and silently losing values.'],
        ['Menganggap `return a, b` memulangkan table.', 'Assuming `return a, b` returns a table.'],
        ['Menukar susunan nama penerima (`local hi, lo = minMax(t)`).', 'Swapping the receiving names (`local hi, lo = minMax(t)`).'],
        ['Memulangkan lima atau lebih nilai kedudukan yang sukar diingati.', 'Returning five or more positional values that are hard to remember.'],
      )),
    S('debugging',
      P('Apabila nilai kedua atau ketiga ialah `nil` secara tidak dijangka, semak dua perkara: adakah fungsi benar-benar memulangkannya pada setiap laluan (setiap `return`), dan adakah pemanggil menyediakan cukup nama? Cetak semua hasil terus dengan `print(f(...))` — `print` menerima setiap nilai sebagai argumen berasingan, jadi anda melihat dengan tepat apa yang dipulangkan. Contoh berikut menunjukkan fungsi yang memulangkan bilangan nilai berbeza pada laluan berbeza:',
        'When a second or third value is unexpectedly `nil`, check two things: does the function really return it on every path (every `return`), and does the caller provide enough names? Print all the results directly with `print(f(...))` — `print` receives every value as a separate argument, so you see exactly what was returned. The following example shows a function that returns a different number of values on different paths:'),
      CODE('split-name', 'lua', 'lua54', ['Laluan pulangan yang konsisten', 'Consistent return paths'], `
local function splitName(full)
  local first, rest = full:match("^(%S+)%s+(.+)$")
  if first == nil then
    return full, ""
  end
  return first, rest
end

print(splitName("Nur Aina Hassan"))
print(splitName("Cher"))
`, 'Nur\tAina Hassan\nCher\t'),
      EXPLAIN('split-name',
        ['1–2', 'Corak dengan dua tangkapan memulangkan dua nilai — atau `nil` jika tiada ruang.', 'A pattern with two captures returns two values — or `nil` if there is no space.'],
        ['3–5', 'Nama tunggal: pulangkan **dua** nilai juga, supaya pemanggil sentiasa menerima string.', 'A single name: return **two** values too, so the caller always receives strings.'],
        ['6', 'Laluan biasa.', 'The normal path.'],
        ['9–10', 'Kedua-dua laluan memberi dua nilai; yang kedua kosong untuk "Cher".', 'Both paths give two values; the second is empty for "Cher".'])),
    S('performance',
      P('Memulangkan dua nilai hampir sama pantas dengan memulangkan satu. Memulangkan table memerlukan peruntukan dan pengutipan sampah, kira-kira beberapa kali lebih perlahan untuk fungsi kecil. Satu laluan yang mengira beberapa hasil juga lebih pantas daripada beberapa laluan berasingan, seperti ditunjukkan di bawah.',
        'Returning two values is almost as fast as returning one. Returning a table needs an allocation and garbage collection, several times slower for small functions. One pass computing several results is also faster than several separate passes, as shown below.')),
    S('software_engineering',
      P('Dua fungsi yang setiap satunya melawati data berbanding satu fungsi yang memulangkan kedua-dua hasil:', 'Two functions that each walk the data versus one function returning both results:'),
      CODE('poor-two-passes', 'lua', 'lua54', ['Pelaksanaan lemah: dua laluan', 'Poor implementation: two passes'], `
local function countPassed(scores)
  local n = 0
  for _, s in ipairs(scores) do if s >= 50 then n = n + 1 end end
  return n
end
local function countFailed(scores)
  local n = 0
  for _, s in ipairs(scores) do if s < 50 then n = n + 1 end end
  return n
end
local scores = {70, 45, 88, 30, 52}
print(countPassed(scores), countFailed(scores))
`, '3\t2'),
      EXPLAIN('poor-two-passes',
        ['1–10', 'Dua fungsi hampir sama, dan data dilawati dua kali.', 'Two nearly identical functions, and the data is visited twice.'],
        ['11–12', 'Dua panggilan untuk dua jawapan berkaitan.', 'Two calls for two related answers.']),
      CODE('improved-one-pass', 'lua', 'lua54', ['Pelaksanaan lebih baik: satu laluan, dua hasil', 'Improved implementation: one pass, two results'], `
local function passFail(scores, mark)
  mark = mark or 50
  local passed, failed = 0, 0
  for _, s in ipairs(scores) do
    if s >= mark then passed = passed + 1 else failed = failed + 1 end
  end
  return passed, failed
end
print(passFail({70, 45, 88, 30, 52}))
print(passFail({70, 45, 88, 30, 52}, 60))
`, '3\t2\n2\t3'),
      EXPLAIN('improved-one-pass',
        ['1–2', 'Markah lulus menjadi parameter pilihan.', 'The pass mark becomes an optional parameter.'],
        ['3–7', 'Satu gelung mengira kedua-dua kiraan; `return` memulangkan kedua-duanya.', 'One loop computes both counts; `return` gives back both.'],
        ['9–10', 'Satu panggilan bagi setiap soalan, dengan markah lulus yang boleh diubah.', 'One call per question, with an adjustable pass mark.'])),
    S('industry_use_cases',
      UL(
        ['`string.find`, `string.match`, `math.modf`, `pcall`, `next` — semuanya memulangkan nilai berbilang.', '`string.find`, `string.match`, `math.modf`, `pcall`, `next` — all return multiple values.'],
        ['Fungsi geometri dalam permainan memulangkan `x, y` tanpa mencipta table vektor.', 'Geometry functions in games return `x, y` without creating vector tables.'],
        ['API Neovim seperti `vim.api.nvim_win_get_cursor` memulangkan kedudukan baris dan lajur.', 'Neovim APIs such as `vim.api.nvim_win_get_cursor` return row and column positions.'],
      )),
    S('practical_demonstration',
      OL(
        ['Ubah `minMax` supaya ia juga memulangkan **kedudukan** nilai terkecil.', 'Change `minMax` so it also returns the **position** of the smallest value.'],
        ['Panggil `stats({})` dan terangkan hasilnya (petunjuk: 0 / 0).', 'Call `stats({})` and explain the result (hint: 0 / 0).'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Laporan markah.** Tulis `summarise(scores)` yang memulangkan markah tertinggi, terendah dan purata (dua tempat perpuluhan), kemudian cetak laporan.', '**A score report.** Write `summarise(scores)` returning the highest score, the lowest score and the average (two decimal places), then print a report.'),
      CODE('score-summary', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function summarise(scores)
  local best, worst, sum = scores[1], scores[1], 0
  for _, s in ipairs(scores) do
    best = math.max(best, s)
    worst = math.min(worst, s)
    sum = sum + s
  end
  return best, worst, sum / #scores
end

local best, worst, average = summarise({67, 92, 74, 58})
print(string.format("best %d, worst %d, average %.2f", best, worst, average))
`, 'best 92, worst 58, average 72.75'),
      EXPLAIN('score-summary',
        ['1–2', 'Tiga pengumpul dimulakan dalam satu assignment berbilang.', 'Three accumulators initialised in one multiple assignment.'],
        ['3–7', 'Satu laluan mengemas kini ketiga-tiganya.', 'One pass updates all three.'],
        ['8', 'Tiga nilai dipulangkan.', 'Three values returned.'],
        ['11–12', 'Terima dan format; `%d` sesuai kerana markah ialah integer.', 'Receive and format; `%d` fits because the scores are integers.'])),
    S('summary',
      UL(
        ['`return a, b` memulangkan nilai berasingan, bukan table.', '`return a, b` returns separate values, not a table.'],
        ['Penerima dilaraskan: nama tambahan `nil`, nilai tambahan dibuang.', 'Receivers are adjusted: extra names `nil`, extra values discarded.'],
        ['`_` menandakan nilai yang sengaja diabaikan.', '`_` marks a value ignored on purpose.'],
        ['Nilai berbilang untuk hasil kecil dan tetap; table untuk hasil banyak atau bernama.', 'Multiple values for small, fixed results; tables for many or named results.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah nilai `c` dalam `local a, b, c = divmod(9, 4)`?', 'What is `c` in `local a, b, c = divmod(9, 4)`?'],
        ['Bagaimanakah anda mendapat hanya baki daripada `divmod`?', 'How do you get only the remainder from `divmod`?'],
        ['Bilakah table lebih baik daripada nilai pulangan berbilang?', 'When is a table better than multiple return values?'],
        ['Mengapakah `splitName` memulangkan `full, ""` dan bukannya `full` sahaja?', 'Why does `splitName` return `full, ""` instead of just `full`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Programming in Lua (1st ed.) — 5.1 Multiple Results', url: `${PIL}/5.1.html` },
        { title: 'Lua 5.4 Reference Manual §3.3.3 — Assignment', url: `${MANUAL}#3.3.3` },
        { title: 'Lua 5.4 Reference Manual §3.4.12 — Multiple Results and Adjustment', url: `${MANUAL}#3.4.12` },
        { title: 'Lua 5.4 Reference Manual — string.match', url: `${MANUAL}#pdf-string.match` },
      )),
  ],
};

// ─── 2.2 Value adjustment rules in expressions ─────────────────────────────

export const LUA104_2_2: LectureContentDef = {
  courseCode: 'LUA104',
  module: 2,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Meramal berapa nilai yang diterima daripada panggilan dalam setiap konteks.', 'Predict how many values a call yields in each context.'],
        ['Menerangkan peraturan [[value-adjustment|pelarasan nilai]]: "terakhir dalam senarai mengembang, selainnya satu".', 'Explain the [[value-adjustment]] rule: "last in a list expands, anything else is one".'],
        ['Menggunakan kurungan `(f())` untuk memaksa satu nilai.', 'Use parentheses `(f())` to force a single value.'],
        ['Mengenal pasti pepijat yang disebabkan oleh nilai tambahan yang tidak dijangka.', 'Recognise bugs caused by unexpected extra values.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1: `return a, b` dan assignment berbilang.', 'Lecture 2.1: `return a, b` and multiple assignment.'],
        ['LUA102 4.1: `tonumber(s, base)`.', 'LUA102 4.1: `tonumber(s, base)`.'],
      )),
    S('introduction',
      P('Kuliah 2.1 menunjukkan bahawa fungsi boleh memulangkan beberapa nilai. Tetapi berapa banyak yang sebenarnya **digunakan** bergantung pada di mana panggilan itu ditulis. `print(f())` mencetak semua nilai; `print(f(), "x")` mencetak hanya yang pertama dan "x"; `f() + 1` menggunakan hanya yang pertama. Peraturan ini ringkas tetapi mempunyai akibat yang mengejutkan — termasuk pepijat klasik `tonumber(s:match(…))` yang kita akan lihat dalam kuliah ini.',
        'Lecture 2.1 showed that a function can return several values. But how many are actually **used** depends on where the call is written. `print(f())` prints all the values; `print(f(), "x")` prints only the first and "x"; `f() + 1` uses only the first. The rule is short but has surprising consequences — including the classic `tonumber(s:match(…))` bug we will see in this lecture.'),
      KEY('Panggilan yang **terakhir** dalam senarai mengembang kepada semua nilainya. Di tempat lain — atau dalam kurungan — ia menjadi tepat satu nilai.', 'A call that is **last** in a list expands to all its values. Anywhere else — or in parentheses — it becomes exactly one value.', ['Peraturan', 'The rule'])),
    S('fundamental_concepts',
      UL(
        ['Senarai yang dimaksudkan: argumen panggilan, sebelah kanan assignment, constructor table `{…}`, dan `return`.', 'The lists meant: call arguments, the right side of an assignment, a table constructor `{…}`, and `return`.'],
        ['Terakhir dalam senarai → **semua** nilai (termasuk sifar nilai).', 'Last in a list → **all** values (including zero values).'],
        ['Bukan terakhir → **satu** nilai (`nil` jika tiada).', 'Not last → **one** value (`nil` if none).'],
        ['Dalam ungkapan (`f() + 1`, `f() .. "x"`) → satu nilai.', 'Inside an expression (`f() + 1`, `f() .. "x"`) → one value.'],
        ['Kurungan `(f())` → tepat satu nilai.', 'Parentheses `(f())` → exactly one value.'],
      )),
    S('detailed_theory',
      P('Pengkompil Lua memutuskan bilangan hasil setiap panggilan semasa kompil, berdasarkan kedudukannya. Untuk panggilan terakhir dalam senarai, ia menjana arahan "ambil semua hasil" (`MULTRET`), dan senarai menjadi sepanjang mana hasil sebenar. Untuk mana-mana kedudukan lain, ia meminta tepat satu hasil: jika fungsi memulangkan lebih, selebihnya dibuang; jika ia memulangkan tiada nilai, `nil` digunakan. Kurungan di sekeliling panggilan menukarnya daripada "panggilan" kepada "ungkapan biasa", jadi ia sentiasa satu nilai.',
        'The Lua compiler decides how many results each call yields at compile time, based on its position. For a call that is last in a list, it generates a "take all results" instruction (`MULTRET`), and the list becomes as long as the actual results. For any other position it asks for exactly one result: if the function returns more, the rest are discarded; if it returns no values, `nil` is used. Parentheses around a call turn it from a "call" into an "ordinary expression", so it is always one value.'),
      P('Peraturan ini berinteraksi dengan argumen pilihan fungsi pustaka. `tonumber(s, base)` mengambil asas kedua yang pilihan; `string.match` dengan dua tangkapan memulangkan dua string. Jadi `tonumber(s:match("(%d+) (%d+)"))` menghantar tangkapan kedua sebagai **asas** — sama ada menghasilkan nombor yang salah secara senyap atau ralat `base out of range`. Begitu juga `table.insert(t, f())` gagal jika `f` memulangkan dua nilai, kerana `table.insert` dengan tiga argumen menganggap yang kedua ialah kedudukan. Apabila anda mahukan satu nilai, gunakan kurungan.',
        'This rule interacts with library functions’ optional arguments. `tonumber(s, base)` takes an optional second base; `string.match` with two captures returns two strings. So `tonumber(s:match("(%d+) (%d+)"))` passes the second capture as the **base** — either silently producing a wrong number or raising `base out of range`. Similarly `table.insert(t, f())` misbehaves if `f` returns two values, because `table.insert` with three arguments treats the second as a position. When you want one value, use parentheses.')),
    S('technical_terminology', TERMS('value-adjustment', 'multiple-assignment', 'function', 'table')),
    S('syntax_rules',
      UL(
        ['`print(f())` → semua; `print(f(), 0)` → satu + 0; `print(0, f())` → 0 + semua.', '`print(f())` → all; `print(f(), 0)` → one + 0; `print(0, f())` → 0 + all.'],
        ['`{f(), f()}` → satu + semua.', '`{f(), f()}` → one + all.'],
        ['`return f()` → semua (panggilan ekor); `return (f())` → satu.', '`return f()` → all (a tail call); `return (f())` → one.'],
        ['`select("#", …)` mengira bilangan nilai, termasuk `nil`.', '`select("#", …)` counts values, including `nil`s.'],
      )),
    S('code_demonstration',
      CODE('adjust-rules', 'lua', 'lua54', ['Peraturan pelarasan dalam tindakan', 'The adjustment rule in action'], `
local function three() return 1, 2, 3 end

print(three())
print(three(), "end")
print("start", three())
print((three()))
local t = {three(), three()}
print(#t, t[1], t[2], t[4])
print(three() + 10)
`, '1\t2\t3\n1\tend\nstart\t1\t2\t3\n1\n4\t1\t1\t3\n11'),
      EXPLAIN('adjust-rules',
        ['1', 'Fungsi yang memulangkan tiga nilai.', 'A function returning three values.'],
        ['3', 'Terakhir (dan satu-satunya) dalam senarai argumen → ketiga-tiganya.', 'Last (and only) in the argument list → all three.'],
        ['4', 'Bukan terakhir → satu nilai.', 'Not last → one value.'],
        ['5', 'Terakhir selepas "start" → ketiga-tiganya.', 'Last after "start" → all three.'],
        ['6', 'Kurungan → tepat satu.', 'Parentheses → exactly one.'],
        ['7–8', 'Constructor: panggilan pertama memberi 1, yang kedua memberi 1, 2, 3 → `{1, 1, 2, 3}`.', 'Constructor: the first call gives 1, the second gives 1, 2, 3 → `{1, 1, 2, 3}`.'],
        ['9', 'Dalam ungkapan aritmetik → satu nilai.', 'Inside an arithmetic expression → one value.'])),
    S('complete_examples',
      CODE('find-results', 'lua', 'lua54', ['string.find dan pelarasan', 'string.find and adjustment'], `
local text = "order #4521 shipped"

print(string.find(text, "#(%d+)"))
local start = string.find(text, "#")
print(start)
if text:find("shipped") then print("status: shipped") end
local id = (text:match("#(%d+)"))
print(id, type(id))
`, '7\t11\t4521\n7\nstatus: shipped\n4521\tstring', {
        debug: BUG(`
local line = "10 99"
local first = tonumber(line:match("(%d+) (%d+)"))
print(first)
`, "example:2: bad argument #2 to 'tonumber' (base out of range)",
          '`match` memulangkan "10" **dan** "99". Kerana panggilan itu terakhir dalam senarai argumen `tonumber`, kedua-duanya dihantar: `tonumber("10", "99")` — asas 99 tidak sah (asas mesti 2–36), jadi ralat dilaporkan untuk argumen **#2**, walaupun anda hanya menulis satu argumen. Lebih teruk, dengan "10 20" tiada ralat langsung: "10" dalam asas 20 ialah 20 — jawapan yang salah secara senyap. Pembetulan: `tonumber((line:match(...)))`, atau terima kedua-dua tangkapan ke dalam local dahulu.',
          '`match` returns "10" **and** "99". Because the call is last in `tonumber`’s argument list, both are passed: `tonumber("10", "99")` — base 99 is invalid (bases must be 2–36), so the error names argument **#2**, although you wrote only one argument. Worse, with "10 20" there is no error at all: "10" in base 20 is 20 — a silently wrong answer. Fix: `tonumber((line:match(...)))`, or receive both captures into locals first.'),
      }),
      EXPLAIN('find-results',
        ['1', 'Teks dengan nombor pesanan.', 'Text containing an order number.'],
        ['3', '`find` dengan tangkapan memulangkan mula, tamat **dan** tangkapan — tiga nilai.', '`find` with a capture returns the start, the end **and** the capture — three values.'],
        ['4–5', 'Satu nama → hanya kedudukan mula.', 'One name → only the start position.'],
        ['6', 'Dalam `if`, hanya nilai pertama dinilai untuk truthiness.', 'In an `if`, only the first value is tested for truthiness.'],
        ['7–8', 'Kurungan menjamin satu nilai walaupun corak kemudian diubah untuk mempunyai lebih banyak tangkapan.', 'Parentheses guarantee one value even if the pattern is later changed to have more captures.']),
      CODE('forwarding', 'lua', 'lua54', ['Memajukan nilai pulangan', 'Forwarding return values'], `
local function pair() return "a", "b" end

local function forwardAll() return pair() end
local function forwardOne() return (pair()) end
local function addLabel() return "label", pair() end

print(forwardAll())
print(forwardOne())
print(addLabel())
print(select("#", forwardAll()), select("#", forwardOne()))
`, 'a\tb\na\nlabel\ta\tb\n2\t1', {
        debug: BUG(`
local function nothing() end
print(math.max(nothing()))
`, "example:2: bad argument #1 to 'max' (value expected)",
          '`nothing()` memulangkan **sifar** nilai. Sebagai item terakhir dalam senarai argumen, ia mengembang kepada… tiada apa-apa, jadi `math.max` dipanggil tanpa argumen langsung. Mesej `value expected` bermaksud tiada argumen langsung — bukan `nil`. Pastikan fungsi sentiasa memulangkan nilai, atau semak hasilnya sebelum menghantarnya.',
          '`nothing()` returns **zero** values. As the last item in the argument list it expands to… nothing, so `math.max` is called with no arguments at all. The message `value expected` means there is no argument at all — not even `nil`. Make sure the function always returns a value, or check the result before passing it on.'),
      }),
      EXPLAIN('forwarding',
        ['1', 'Dua nilai.', 'Two values.'],
        ['3', '`return pair()` memajukan **semua** hasil.', '`return pair()` forwards **all** results.'],
        ['4', 'Kurungan memotong kepada satu.', 'Parentheses truncate to one.'],
        ['5', 'Panggilan terakhir dalam senarai `return` mengembang selepas "label".', 'The last call in the `return` list expands after "label".'],
        ['7–9', 'Bilangan nilai: 2, 1 dan 3.', 'Value counts: 2, 1 and 3.'],
        ['10', '`select("#", …)` mengira hasil secara tepat.', '`select("#", …)` counts the results exactly.'])),
    S('line_by_line',
      EXPLAIN('adjust-rules',
        ['8', '`#t` ialah 4 kerana table tiada lubang. `t[2]` ialah 1 — daripada panggilan **kedua**, kerana panggilan pertama hanya menyumbang satu nilai.', '`#t` is 4 because the table has no holes. `t[2]` is 1 — from the **second** call, because the first call contributed only one value.']),
      EXPLAIN('find-results',
        ['7', 'Kurungan tambahan kelihatan tidak perlu, tetapi ia menyatakan niat "saya mahu satu nilai" dan melindungi daripada perubahan corak pada masa hadapan.', 'The extra parentheses look unnecessary, but they state the intent "I want one value" and protect against future pattern changes.'])),
    S('why_this_way',
      P('Mengapa peraturan ini? Kerana ia membolehkan pembalut (wrapper) memajukan semua hasil tanpa mengetahui bilangannya — `return f(...)` — sambil memastikan ungkapan biasa seperti `f() + 1` sentiasa jelas. Kosnya ialah kes tepi seperti `tonumber(s:match(…))`, yang mesti diingati.',
        'Why this rule? Because it lets wrappers forward all results without knowing how many there are — `return f(...)` — while keeping ordinary expressions such as `f() + 1` unambiguous. The cost is edge cases like `tonumber(s:match(…))`, which you must remember.'),
      P('Balut panggilan dengan kurungan **apabila** anda menghantarnya sebagai argumen terakhir kepada fungsi yang mempunyai parameter pilihan (`tonumber`, `table.insert`, `string.format`).', 'Wrap a call in parentheses **when** you pass it as the last argument to a function that has optional parameters (`tonumber`, `table.insert`, `string.format`).')),
    S('execution_flow',
      OL(
        ['`adjust-rules` baris 7: constructor dinilai dari kiri.', '`adjust-rules` line 7: the constructor is evaluated from the left.'],
        ['`three()` pertama bukan terakhir → menyumbang 1 ke `t[1]`.', 'The first `three()` is not last → contributes 1 to `t[1]`.'],
        ['`three()` kedua terakhir → menyumbang 1, 2, 3 ke `t[2]`, `t[3]`, `t[4]`.', 'The second `three()` is last → contributes 1, 2, 3 to `t[2]`, `t[3]`, `t[4]`.'],
        ['Hasil: `{1, 1, 2, 3}`.', 'Result: `{1, 1, 2, 3}`.'],
      )),
    S('memory_behaviour',
      P('Nilai yang dibuang oleh pelarasan tidak pernah disalin ke mana-mana — ia hanya ditinggalkan pada timbunan dan ditimpa. Constructor `{f()}` dengan panggilan terakhir mengembangkan table untuk memuatkan semua hasil; ini cara biasa untuk mengumpul hasil yang bilangannya tidak diketahui (tetapi lihat `table.pack` dalam kuliah 3.2 untuk hasil yang mungkin mengandungi `nil`).',
        'Values discarded by adjustment are never copied anywhere — they are simply left on the stack and overwritten. A constructor `{f()}` with a last call grows the table to hold every result; this is the usual way to collect an unknown number of results (but see `table.pack` in lecture 3.2 for results that may contain `nil`).')),
    S('alternative_implementations',
      P('Daripada bergantung pada kurungan, terima tangkapan ke dalam local bernama — lebih panjang, tetapi tiada kekaburan:', 'Instead of relying on parentheses, receive the captures into named locals — longer, but unambiguous:'),
      CODE('named-captures', 'lua', 'lua54', ['Tangkapan ke dalam local', 'Captures into locals'], `
local line = "10 20"
local a, b = line:match("(%d+) (%d+)")
local first, second = tonumber(a), tonumber(b)
print(first + second, math.type(first))
`, '30\tinteger'),
      EXPLAIN('named-captures',
        ['1–2', 'Kedua-dua tangkapan diterima secara eksplisit.', 'Both captures are received explicitly.'],
        ['3', 'Setiap `tonumber` menerima tepat satu argumen.', 'Each `tonumber` receives exactly one argument.'],
        ['4', '10 + 20 = 30; nombor ialah integer.', '10 + 20 = 30; the numbers are integers.'])),
    S('common_mistakes',
      UL(
        ['`tonumber(s:match(…))` dengan lebih daripada satu tangkapan.', '`tonumber(s:match(…))` with more than one capture.'],
        ['`table.insert(t, s:gsub(…))` — `gsub` memulangkan dua nilai (teks dan bilangan penggantian).', '`table.insert(t, s:gsub(…))` — `gsub` returns two values (the text and the replacement count).'],
        ['Menjangka `{f(), g()}` mengandungi semua hasil `f`.', 'Expecting `{f(), g()}` to contain all of `f`’s results.'],
        ['Menghantar panggilan yang mungkin memulangkan sifar nilai ke fungsi pustaka.', 'Passing a call that may return zero values to a library function.'],
      )),
    S('debugging',
      P('Pepijat pelarasan sering tidak menghasilkan ralat — hanya nilai yang salah. Apabila argumen fungsi pustaka kelihatan "pelik", cetak bilangan nilai yang dihantar: `print(select("#", f()))`. Jika lebih daripada yang dijangka, balut panggilan dengan kurungan. Contoh berikut menunjukkan `gsub`, yang memulangkan dua nilai dan sering mengejutkan pemula:',
        'Adjustment bugs often produce no error — just wrong values. When a library function’s arguments look "strange", print the number of values passed: `print(select("#", f()))`. If there are more than expected, wrap the call in parentheses. The following example shows `gsub`, which returns two values and often surprises beginners:'),
      CODE('gsub-two-values', 'lua', 'lua54', ['gsub memulangkan dua nilai', 'gsub returns two values'], `
local raw = "a-b-c"
print(raw:gsub("-", "+"))
print((raw:gsub("-", "+")))
local parts = {}
table.insert(parts, (raw:gsub("-", "")))
print(parts[1], #parts)
`, 'a+b+c\t2\na+b+c\nabc\t1'),
      EXPLAIN('gsub-two-values',
        ['1–2', '`gsub` memulangkan teks baharu **dan** bilangan penggantian (2).', '`gsub` returns the new text **and** the number of replacements (2).'],
        ['3', 'Kurungan → hanya teks.', 'Parentheses → only the text.'],
        ['4–6', 'Tanpa kurungan, `table.insert(parts, "abc", 2)` akan cuba memasukkan pada **kedudukan** "abc" — ralat. Dengan kurungan, satu elemen dimasukkan.', 'Without parentheses, `table.insert(parts, "abc", 2)` would try to insert at **position** "abc" — an error. With parentheses, one element is inserted.'])),
    S('performance',
      P('Pelarasan diputuskan semasa kompil, jadi ia tidak mempunyai kos runtime. Kurungan tambahan juga percuma. Satu-satunya kos ialah kerja fungsi yang menghasilkan nilai yang kemudiannya dibuang — contohnya `string.find` yang mengira tangkapan yang tidak digunakan.',
        'Adjustment is decided at compile time, so it has no runtime cost. Extra parentheses are free too. The only cost is the work of a function producing values that are then discarded — for example `string.find` computing captures that are never used.')),
    S('software_engineering',
      P('Memanggil fungsi dua kali untuk mendapatkan nilai kedua berbanding menerimanya terus:', 'Calling a function twice to get its second value versus receiving it directly:'),
      CODE('poor-double-call', 'lua', 'lua54', ['Pelaksanaan lemah: dua panggilan untuk dua nilai', 'Poor implementation: two calls for two values'], `
local function parseTime(text)
  local h, m = text:match("^(%d+):(%d+)$")
  return tonumber(h), tonumber(m)
end

local hours = (parseTime("14:35"))
local minutes = select(2, parseTime("14:35"))
print(hours * 60 + minutes)
`, '875'),
      EXPLAIN('poor-double-call',
        ['1–4', 'Penghurai masa yang memulangkan jam dan minit.', 'A time parser returning hours and minutes.'],
        ['6–7', 'Rentetan yang sama dihurai **dua kali**; jika teks berubah, kedua-dua baris mesti dikemas kini.', 'The same string is parsed **twice**; if the text changes, both lines must be updated.'],
        ['8', '14 × 60 + 35.', '14 × 60 + 35.']),
      CODE('improved-single-call', 'lua', 'lua54', ['Pelaksanaan lebih baik: satu panggilan, dua nama', 'Improved implementation: one call, two names'], `
local function parseTime(text)
  local h, m = text:match("^(%d+):(%d+)$")
  return tonumber(h), tonumber(m)
end

local hours, minutes = parseTime("09:05")
print(hours * 60 + minutes, hours, minutes)
`, '545\t9\t5'),
      EXPLAIN('improved-single-call',
        ['1–4', 'Penghurai yang sama.', 'The same parser.'],
        ['6–7', 'Satu panggilan, dua nama; `tonumber("09")` memberi 9.', 'One call, two names; `tonumber("09")` gives 9.'])),
    S('industry_use_cases',
      UL(
        ['Pembalut log dan profil memajukan semua hasil dengan `return f(...)`.', 'Logging and profiling wrappers forward every result with `return f(...)`.'],
        ['Linter Lua (luacheck, Selene) memberi amaran tentang beberapa corak pelarasan yang berisiko.', 'Lua linters (luacheck, Selene) warn about some risky adjustment patterns.'],
        ['Kod penghuraian teks menggunakan kurungan di sekeliling `gsub` dan `match` sebagai amalan standard.', 'Text-parsing code uses parentheses around `gsub` and `match` as standard practice.'],
      )),
    S('practical_demonstration',
      OL(
        ['Ramalkan output `print(three(), three(), three())`, kemudian sahkan.', 'Predict the output of `print(three(), three(), three())`, then confirm.'],
        ['Tukar `"10 99"` dalam versi berpepijat `find-results` kepada `"10 20"`: mengapa tiada ralat, dan mengapa hasilnya 20?', 'Change `"10 99"` in the buggy `find-results` to `"10 20"`: why is there no error, and why is the result 20?'],
        ['Buang kurungan pada baris 5 `gsub-two-values` dan perhatikan apa yang berlaku.', 'Remove the parentheses on line 5 of `gsub-two-values` and observe what happens.'],
      )),
    S('mini_project',
      P('**Pengumpul hasil.** Tulis `collect(...)` yang memanggil setiap fungsi yang diberi dan mengumpul **semua** hasilnya ke dalam satu senarai, dalam susunan.', '**A result collector.** Write `collect(...)` that calls every given function and gathers **all** of their results into one list, in order.'),
      CODE('collect-results', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function collect(fns)
  local all = {}
  for _, fn in ipairs(fns) do
    for _, v in ipairs({fn()}) do
      all[#all + 1] = v
    end
  end
  return all
end

local result = collect({
  function() return 1, 2 end,
  function() return 3 end,
  function() return 4, 5, 6 end,
})
print(table.concat(result, " "), #result)
`, '1 2 3 4 5 6\t6'),
      EXPLAIN('collect-results',
        ['1–2', 'Senarai hasil gabungan.', 'The combined result list.'],
        ['3–8', '`{fn()}` — panggilan ialah satu-satunya (terakhir) item constructor, jadi **semua** hasil masuk ke table sementara; kemudian setiap satu disalin, dan senarai gabungan dipulangkan.', '`{fn()}` — the call is the only (last) item of the constructor, so **all** results go into the temporary table; then each is copied, and the combined list is returned.'],
        ['11–16', 'Tiga fungsi tanpa nama dengan 2, 1 dan 3 hasil → 6 nilai.', 'Three anonymous functions with 2, 1 and 3 results → 6 values.'])),
    S('summary',
      UL(
        ['Terakhir dalam senarai → semua nilai; di tempat lain → satu.', 'Last in a list → all values; elsewhere → one.'],
        ['Kurungan `(f())` memaksa satu nilai.', 'Parentheses `(f())` force one value.'],
        ['Berhati-hati dengan fungsi yang mempunyai parameter pilihan: `tonumber`, `table.insert`.', 'Beware of functions with optional parameters: `tonumber`, `table.insert`.'],
        ['`select("#", …)` mengira hasil dengan tepat.', '`select("#", …)` counts results exactly.'],
      )),
    S('knowledge_check',
      OL(
        ['Berapa nilai yang dicetak oleh `print(three(), three())`?', 'How many values does `print(three(), three())` print?'],
        ['Mengapakah `tonumber(("7 8"):match("(%d) (%d)"))` tidak memberi 7?', 'Why does `tonumber(("7 8"):match("(%d) (%d)"))` not give 7?'],
        ['Apakah perbezaan antara `return f()` dan `return (f())`?', 'What is the difference between `return f()` and `return (f())`?'],
        ['Apakah `#{three(), three()}`?', 'What is `#{three(), three()}`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.4.12 — Lists of Expressions, Multiple Results, and Adjustment', url: `${MANUAL}#3.4.12` },
        { title: 'Programming in Lua (1st ed.) — 5.1 Multiple Results', url: `${PIL}/5.1.html` },
        { title: 'Lua 5.4 Reference Manual — tonumber', url: `${MANUAL}#pdf-tonumber` },
        { title: 'Lua 5.4 Reference Manual — string.gsub', url: `${MANUAL}#pdf-string.gsub` },
      )),
  ],
};

// ─── 2.3 table.unpack and the (nil, message) error pattern ─────────────────

export const LUA104_2_3: LectureContentDef = {
  courseCode: 'LUA104',
  module: 2,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan `table.unpack(t, i, j)` untuk menukar senarai kepada nilai berasingan.', 'Use `table.unpack(t, i, j)` to turn a list into separate values.'],
        ['Menulis fungsi yang memulangkan `nil, mesej` apabila gagal.', 'Write functions that return `nil, message` on failure.'],
        ['Mengendalikan kegagalan dengan `if not v then` atau `assert`.', 'Handle failures with `if not v then` or `assert`.'],
        ['Memilih antara `nil, mesej` dan `error` untuk kegagalan berbeza.', 'Choose between `nil, message` and `error` for different failures.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1–2.2: nilai pulangan berbilang dan pelarasan.', 'Lectures 2.1–2.2: multiple return values and adjustment.'],
        ['Kuliah 1.3: `error(mesej, 2)`.', 'Lecture 1.3: `error(message, 2)`.'],
      )),
    S('introduction',
      P('Kuliah ini menggabungkan dua kegunaan penting nilai berbilang. Pertama, `table.unpack` melakukan sebaliknya daripada constructor `{…}`: ia mengambil elemen senarai dan memulangkannya sebagai nilai berasingan, supaya senarai boleh dihantar sebagai argumen. Kedua, corak **`nil, mesej`** — cara konvensional Lua untuk melaporkan kegagalan yang dijangka, seperti input tidak sah atau fail yang tiada. `io.open`, `tonumber` dan banyak pustaka menggunakannya.',
        'This lecture combines two important uses of multiple values. First, `table.unpack` does the opposite of the `{…}` constructor: it takes a list’s elements and returns them as separate values, so a list can be passed as arguments. Second, the **`nil, message`** pattern — Lua’s conventional way to report expected failures, such as invalid input or a missing file. `io.open`, `tonumber` and many libraries use it.'),
      KEY('Kejayaan → `nilai`. Kegagalan yang dijangka → `nil, "sebab"`. Pemanggil memutuskan.', 'Success → `value`. Expected failure → `nil, "reason"`. The caller decides.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`table.unpack(t)` → `t[1], t[2], …, t[#t]`.', '`table.unpack(t)` → `t[1], t[2], …, t[#t]`.'],
        ['`table.unpack(t, i, j)` → `t[i]` hingga `t[j]` — julat eksplisit.', '`table.unpack(t, i, j)` → `t[i]` to `t[j]` — an explicit range.'],
        ['Corak `nil, mesej`: nilai pertama `nil` menandakan kegagalan; yang kedua menerangkan sebabnya.', 'The `nil, message` pattern: a `nil` first value signals failure; the second explains why.'],
        ['`assert(v, mesej)` menukar `nil, mesej` kepada ralat — sesuai apabila kegagalan tidak sepatutnya berlaku.', '`assert(v, message)` turns `nil, message` into an error — suitable when failure should not happen.'],
      )),
    S('detailed_theory',
      P('Lua mempunyai dua mekanisme kegagalan. **Ralat** (`error`) menghentikan pelaksanaan dan naik ke atas timbunan panggilan sehingga ditangkap oleh `pcall`, atau program tamat. Ia sesuai untuk **kesilapan pengaturcara** — argumen jenis salah, keadaan yang mustahil. **Pulangan `nil, mesej`** ialah nilai biasa: tiada apa-apa berhenti, dan pemanggil mesti menyemaknya. Ia sesuai untuk **kegagalan yang dijangka** semasa operasi biasa — input pengguna yang salah, fail yang tiada, rangkaian yang terputus. Pemanggil yang menjangka kegagalan boleh mengendalikannya; pemanggil yang tidak boleh menukarnya kepada ralat dengan satu perkataan: `assert`.',
        'Lua has two failure mechanisms. An **error** (`error`) stops execution and climbs the call stack until caught by `pcall`, or the program ends. It suits **programmer mistakes** — an argument of the wrong type, an impossible state. A **`nil, message` return** is an ordinary value: nothing stops, and the caller must check it. It suits **expected failures** during normal operation — wrong user input, a missing file, a dropped network connection. A caller that expects failure can handle it; a caller that cannot can turn it into an error with one word: `assert`.'),
      P('`table.unpack` berguna apabila argumen disimpan dalam table — contohnya senarai nombor untuk `math.max`, atau argumen yang direkodkan untuk dipanggil semula kemudian. Tanpa julat eksplisit, ia menggunakan `#t`, yang tidak boleh dipercayai jika senarai mengandungi lubang (`nil`). Dengan `table.unpack(t, 1, n)`, anda menetapkan bilangan tepat, dan `nil` di tengah dipulangkan dengan betul. Kuliah 3.2 menggabungkan ini dengan `table.pack` dan medan `n`.',
        '`table.unpack` is useful when arguments are stored in a table — for example a list of numbers for `math.max`, or arguments recorded to be replayed later. Without an explicit range it uses `#t`, which is unreliable if the list contains holes (`nil`). With `table.unpack(t, 1, n)` you fix the exact count, and `nil`s in the middle are returned correctly. Lecture 3.2 combines this with `table.pack` and its `n` field.')),
    S('technical_terminology', TERMS('nil', 'multiple-assignment', 'stack-traceback', 'function')),
    S('syntax_rules',
      UL(
        ['`table.unpack(list [, i [, j]])` — lalai `i = 1`, `j = #list`.', '`table.unpack(list [, i [, j]])` — defaults `i = 1`, `j = #list`.'],
        ['Kegagalan: `return nil, "sebab"`; kejayaan: `return nilai`.', 'Failure: `return nil, "reason"`; success: `return value`.'],
        ['Semak: `local v, err = f(); if not v then … end`.', 'Check: `local v, err = f(); if not v then … end`.'],
        ['Tegaskan: `local v = assert(f())`.', 'Assert: `local v = assert(f())`.'],
      )),
    S('code_demonstration',
      CODE('unpack-basics', 'lua', 'lua54', ['table.unpack dengan dan tanpa julat', 'table.unpack with and without a range'], `
local scores = {72, 95, 61, 88}

print(table.unpack(scores))
print(math.max(table.unpack(scores)))
print(table.unpack(scores, 2, 3))
local first, second = table.unpack(scores)
print(first, second)
`, '72\t95\t61\t88\n95\n95\t61\n72\t95'),
      EXPLAIN('unpack-basics',
        ['1', 'Senarai empat markah.', 'A list of four scores.'],
        ['3', 'Semua elemen sebagai nilai berasingan.', 'All elements as separate values.'],
        ['4', '`math.max` menerima argumen berasingan, bukan table — `unpack` menjembatani jurang.', '`math.max` takes separate arguments, not a table — `unpack` bridges the gap.'],
        ['5', 'Julat 2 hingga 3.', 'The range 2 to 3.'],
        ['6–7', 'Pelarasan biasa: dua nama menerima dua nilai pertama.', 'Ordinary adjustment: two names receive the first two values.'])),
    S('complete_examples',
      CODE('parse-port', 'lua', 'lua54', ['Fungsi dengan corak nil, mesej', 'A function with the nil, message pattern'], `
local function parsePort(text)
  local n = tonumber(text)
  if n == nil then
    return nil, "not a number: " .. text
  end
  if math.type(n) ~= "integer" or n < 1 or n > 65535 then
    return nil, "port out of range: " .. text
  end
  return n
end

for _, input in ipairs({"8080", "http", "70000"}) do
  local port, err = parsePort(input)
  if port then
    print("ok", port)
  else
    print("error", err)
  end
end
`, 'ok\t8080\nerror\tnot a number: http\nerror\tport out of range: 70000', {
        debug: BUG(`
local function parsePort(text)
  local n = tonumber(text)
  if n == nil then return nil, "not a number: " .. text end
  return n
end
local port = parsePort("http")
print("connecting to port " .. port + 1)
`, "example:7: attempt to perform arithmetic on a nil value (local 'port')",
          'Pemanggil mengabaikan kemungkinan kegagalan: hanya nilai pertama diterima, dan ia `nil`. Mesej "not a number: http" — yang menerangkan masalah sebenar — dibuang. Sentiasa terima kedua-dua nilai dan semak: `local port, err = parsePort(x); if not port then … end`.',
          'The caller ignores the possibility of failure: only the first value is received, and it is `nil`. The message "not a number: http" — which explains the real problem — is discarded. Always receive both values and check: `local port, err = parsePort(x); if not port then … end`.'),
      }),
      EXPLAIN('parse-port',
        ['1–5', 'Semakan pertama: bukan nombor → `nil` dengan sebab.', 'First check: not a number → `nil` with a reason.'],
        ['6–8', 'Semakan kedua: integer dalam julat port TCP.', 'Second check: an integer in the TCP port range.'],
        ['9', 'Kejayaan: satu nilai.', 'Success: one value.'],
        ['12–19', 'Pemanggil menerima kedua-dua nilai dan memilih cabang berdasarkan yang pertama.', 'The caller receives both values and chooses a branch based on the first.']),
      CODE('assert-success', 'lua', 'lua54', ['assert pada laluan yang dijangka berjaya', 'assert on a path expected to succeed'], `
local function parseRatio(text)
  local a, b = text:match("^(%d+):(%d+)$")
  if not a then return nil, "invalid ratio: " .. text end
  return tonumber(a) / tonumber(b)
end

local widescreen = assert(parseRatio("16:9"))
print(string.format("%.3f", widescreen))
print(parseRatio("16x9"))
`, '1.778\nnil\tinvalid ratio: 16x9', {
        debug: BUG(`
local function parseRatio(text)
  local a, b = text:match("^(%d+):(%d+)$")
  if not a then return nil, "invalid ratio: " .. text end
  return tonumber(a) / tonumber(b)
end
local ratio = assert(parseRatio("16x9"))
`, 'example:6: invalid ratio: 16x9',
          '`assert` menerima `nil, "invalid ratio: 16x9"`. Kerana nilai pertama palsu, ia menaikkan ralat menggunakan nilai kedua sebagai mesej, dengan kedudukan baris panggilan (6). Ini tingkah laku yang diingini apabila kegagalan bermakna pepijat (contohnya pemalar yang ditulis dalam kod); untuk input pengguna, gunakan semakan `if` seperti `parse-port`.',
          '`assert` receives `nil, "invalid ratio: 16x9"`. Because the first value is falsy, it raises an error using the second value as the message, with the calling line’s position (6). This is the desired behaviour when failure means a bug (for example a constant written in the code); for user input, use an `if` check as in `parse-port`.'),
      }),
      EXPLAIN('assert-success',
        ['1–5', 'Penghurai nisbah dengan corak `nil, mesej`.', 'A ratio parser with the `nil, message` pattern.'],
        ['7', '`assert(v, mesej)` memulangkan `v` apabila ia benar — jadi nisbah diterima terus.', '`assert(v, message)` returns `v` when it is truthy — so the ratio is received directly.'],
        ['8', '16 / 9 dengan tiga tempat perpuluhan.', '16 / 9 to three decimal places.'],
        ['9', 'Kegagalan dipaparkan sebagai dua nilai.', 'A failure displayed as two values.'])),
    S('line_by_line',
      EXPLAIN('parse-port',
        ['13', 'Nama kedua `err` hanya diberi nilai pada kegagalan; pada kejayaan ia `nil` kerana fungsi memulangkan satu nilai sahaja.', 'The second name `err` is only assigned on failure; on success it is `nil` because the function returns just one value.']),
      EXPLAIN('unpack-basics',
        ['4', 'Panggilan `table.unpack` ialah argumen terakhir, jadi ia mengembang ke semua elemen (kuliah 2.2).', 'The `table.unpack` call is the last argument, so it expands to every element (lecture 2.2).'])),
    S('why_this_way',
      P('Mengapa `nil, mesej` dan bukannya pengecualian (exception) seperti dalam Java atau Python? Kerana kegagalan input adalah normal, bukan luar biasa, dan memaksa pemanggil melihatnya pada titik panggilan menjadikan pengendalian ralat jelas. Mengapa masih ada `error`? Kerana untuk pepijat pengaturcara, meneruskan dengan `nil` hanya memindahkan ralat ke tempat lain.',
        'Why `nil, message` instead of exceptions as in Java or Python? Because input failures are normal, not exceptional, and making the caller see them at the call site keeps error handling explicit. Why does `error` still exist? Because for programmer bugs, continuing with `nil` only moves the error elsewhere.'),
      P('Pulangkan `nil, mesej` **apabila** kegagalan boleh berlaku dalam penggunaan biasa; naikkan `error` **apabila** kegagalan bermakna kod itu sendiri salah; gunakan `assert` **apabila** anda memanggil fungsi `nil, mesej` dan kegagalan tidak sepatutnya berlaku.', 'Return `nil, message` **when** failure can happen in normal use; raise `error` **when** failure means the code itself is wrong; use `assert` **when** you call a `nil, message` function and failure should not happen.')),
    S('execution_flow',
      OL(
        ['`parse-port` dengan "http": `tonumber("http")` → `nil`.', '`parse-port` with "http": `tonumber("http")` → `nil`.'],
        ['Baris 4: `return nil, "not a number: http"`.', 'Line 4: `return nil, "not a number: http"`.'],
        ['Baris 13: `port = nil`, `err = "not a number: http"`.', 'Line 13: `port = nil`, `err = "not a number: http"`.'],
        ['Baris 14: `if port` palsu → cabang `else` mencetak sebabnya.', 'Line 14: `if port` is false → the `else` branch prints the reason.'],
      )),
    S('memory_behaviour',
      P('`table.unpack` menyalin elemen ke timbunan; untuk senarai yang sangat besar (puluhan ribu elemen) ia boleh gagal dengan `too many results to unpack`, kerana timbunan Lua terhad. Untuk senarai besar, gunakan gelung. Mesej ralat dalam corak `nil, mesej` ialah string baharu setiap kali — kosnya kecil dan hanya dibayar pada kegagalan.',
        '`table.unpack` copies the elements onto the stack; for very large lists (tens of thousands of elements) it can fail with `too many results to unpack`, because the Lua stack is limited. For large lists, use a loop. The error message in the `nil, message` pattern is a new string each time — a small cost paid only on failure.')),
    S('alternative_implementations',
      P('Gaya alternatif: naikkan ralat dan tangkap dengan `pcall`. Ia berfungsi, tetapi lebih berat untuk kegagalan yang biasa:', 'An alternative style: raise an error and catch it with `pcall`. It works, but is heavier for common failures:'),
      CODE('error-and-pcall', 'lua', 'lua54', ['error dan pcall sebagai alternatif', 'error and pcall as an alternative'], `
local function parseAge(text)
  local n = tonumber(text)
  if not n then error("not a number: " .. text, 0) end
  return n
end

print(pcall(parseAge, "42"))
print(pcall(parseAge, "forty"))
`, 'true\t42\nfalse\tnot a number: forty'),
      EXPLAIN('error-and-pcall',
        ['1–5', '`error(mesej, 0)` — tahap 0 bermaksud tiada awalan kedudukan.', '`error(message, 0)` — level 0 means no position prefix.'],
        ['7–8', '`pcall` memulangkan `true` + hasil, atau `false` + mesej — corak yang hampir sama dengan `nil, mesej`, tetapi setiap pemanggil mesti ingat menggunakan `pcall`.', '`pcall` returns `true` + results, or `false` + the message — almost the same shape as `nil, message`, but every caller must remember to use `pcall`.'])),
    S('common_mistakes',
      UL(
        ['Menerima hanya nilai pertama dan kehilangan mesej ralat.', 'Receiving only the first value and losing the error message.'],
        ['Menggunakan `assert` untuk input pengguna — program tamat apabila pengguna menaip salah.', 'Using `assert` for user input — the program ends when the user mistypes.'],
        ['Memulangkan `-1` atau `""` untuk kegagalan, yang boleh dikelirukan dengan nilai sah.', 'Returning `-1` or `""` for failure, which can be confused with valid values.'],
        ['`table.unpack` pada senarai dengan lubang tanpa julat eksplisit.', '`table.unpack` on a list with holes without an explicit range.'],
      )),
    S('debugging',
      P('Apabila ralat `nil` muncul selepas memanggil fungsi yang boleh gagal, cetak **kedua-dua** nilai pulangannya: `print(f(x))`. Mesej kedua biasanya menerangkan masalah sebenar. Dalam kod anda sendiri, pastikan setiap laluan kegagalan memulangkan mesej yang menyebut nilai input — "not a number: http" jauh lebih berguna daripada "invalid". Contoh berikut menunjukkan pemeriksaan setiap langkah dalam rantaian:',
        'When a `nil` error appears after calling a function that can fail, print **both** of its return values: `print(f(x))`. The second message usually explains the real problem. In your own code, make sure every failure path returns a message that names the input value — "not a number: http" is far more useful than "invalid". The following example shows checking every step in a chain:'),
      CODE('chain-checks', 'lua', 'lua54', ['Rantaian langkah yang boleh gagal', 'A chain of steps that can fail'], `
local function readSetting(line)
  local key, value = line:match("^(%w+)=(.*)$")
  if not key then return nil, "bad line: " .. line end
  if value == "" then return nil, "empty value for " .. key end
  return key, value
end

for _, line in ipairs({"volume=7", "theme=", "nonsense"}) do
  print(readSetting(line))
end
`, 'volume\t7\nnil\tempty value for theme\nnil\tbad line: nonsense'),
      EXPLAIN('chain-checks',
        ['1–2', 'Hurai `kunci=nilai`.', 'Parse `key=value`.'],
        ['3–4', 'Dua sebab kegagalan berbeza, setiap satu dengan mesej yang menyebut input.', 'Two different failure reasons, each with a message naming the input.'],
        ['5', 'Kejayaan memulangkan **dua** nilai: kunci dan nilai.', 'Success returns **two** values: the key and the value.'],
        ['8–10', 'Mencetak semua hasil menunjukkan dengan jelas laluan mana yang diambil.', 'Printing all results shows clearly which path was taken.'])),
    S('performance',
      P('Corak `nil, mesej` hampir percuma pada laluan kejayaan — satu semakan `if`. `pcall` dan `error` lebih mahal: ia menyimpan keadaan timbunan dan membina mesej. Untuk penghurai yang memproses ribuan baris dengan banyak baris tidak sah, `nil, mesej` lebih pantas daripada `error` + `pcall`.',
        'The `nil, message` pattern is almost free on the success path — one `if` check. `pcall` and `error` are costlier: they save stack state and build a message. For a parser processing thousands of lines with many invalid ones, `nil, message` is faster than `error` + `pcall`.')),
    S('software_engineering',
      P('Nilai penanda (sentinel) berbanding `nil, mesej`:', 'A sentinel value versus `nil, message`:'),
      CODE('poor-sentinel', 'lua', 'lua54', ['Pelaksanaan lemah: -1 sebagai tanda kegagalan', 'Poor implementation: -1 as a failure marker'], `
local function findIndex(list, wanted)
  for i, v in ipairs(list) do
    if v == wanted then return i end
  end
  return -1
end

local fruits = {"apple", "kiwi"}
local i = findIndex(fruits, "mango")
print(i, fruits[i])
`, '-1\tnil'),
      EXPLAIN('poor-sentinel',
        ['1–6', '`-1` bermaksud "tidak dijumpai" — tetapi hanya jika pemanggil ingat konvensyen itu.', '`-1` means "not found" — but only if the caller remembers that convention.'],
        ['8–10', '`fruits[-1]` ialah indeks yang sah dalam Lua dan senyap-senyap memberi `nil`; tiada sebab diberikan.', '`fruits[-1]` is a valid index in Lua and silently gives `nil`; no reason is given.']),
      CODE('improved-nil-message', 'lua', 'lua54', ['Pelaksanaan lebih baik: nil dengan sebab', 'Improved implementation: nil with a reason'], `
local function findIndex(list, wanted)
  for i, v in ipairs(list) do
    if v == wanted then return i end
  end
  return nil, wanted .. " is not in the list"
end

local fruits = {"apple", "kiwi"}
print(findIndex(fruits, "kiwi"))
print(findIndex(fruits, "mango"))
`, '2\nnil\tmango is not in the list'),
      EXPLAIN('improved-nil-message',
        ['1–6', '`nil` tidak boleh dikelirukan dengan indeks sah, dan mesej menerangkan sebabnya.', '`nil` cannot be confused with a valid index, and the message explains why.'],
        ['8–10', 'Kejayaan dan kegagalan dibezakan dengan jelas.', 'Success and failure are clearly distinguished.'])),
    S('industry_use_cases',
      UL(
        ['`io.open(path)` memulangkan `nil, mesej, kod` apabila fail tidak boleh dibuka.', '`io.open(path)` returns `nil, message, code` when a file cannot be opened.'],
        ['Pustaka rangkaian OpenResty (`ngx.socket`) memulangkan `nil, err` untuk ralat sambungan.', 'OpenResty’s networking library (`ngx.socket`) returns `nil, err` for connection errors.'],
        ['`table.unpack` digunakan untuk menghantar argumen yang direkodkan kepada panggilan balik.', '`table.unpack` is used to pass recorded arguments to callbacks.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah semakan dalam `parsePort` yang menolak port di bawah 1024 dengan mesej "reserved port".', 'Add a check in `parsePort` that rejects ports below 1024 with the message "reserved port".'],
        ['Gunakan `table.unpack` untuk memanggil `string.format("%s-%s-%s", …)` dengan senarai `{"2026", "11", "18"}`.', 'Use `table.unpack` to call `string.format("%s-%s-%s", …)` with the list `{"2026", "11", "18"}`.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Pemuat konfigurasi.** Hurai beberapa baris `kunci=nilai`, kumpul tetapan yang sah ke dalam table, dan senaraikan ralat secara berasingan — tanpa menghentikan program.', '**A configuration loader.** Parse several `key=value` lines, collect valid settings into a table, and list errors separately — without stopping the program.'),
      CODE('config-loader', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function parseLine(line)
  local key, value = line:match("^%s*(%w+)%s*=%s*(.-)%s*$")
  if not key then return nil, "cannot parse '" .. line .. "'" end
  return key, value
end

local lines = {"width = 800", "height=600", "oops", "title = My App"}
local config, problems = {}, {}
for n, line in ipairs(lines) do
  local key, valueOrErr = parseLine(line)
  if key then
    config[key] = valueOrErr
  else
    problems[#problems + 1] = "line " .. n .. ": " .. valueOrErr
  end
end

print(config.width, config.height, config.title)
print(table.unpack(problems))
`, "800\t600\tMy App\nline 3: cannot parse 'oops'"),
      EXPLAIN('config-loader',
        ['1–5', 'Corak membenarkan ruang di sekeliling `=`; kegagalan memulangkan `nil, mesej`.', 'The pattern allows spaces around `=`; failure returns `nil, message`.'],
        ['7–8', 'Input, tetapan yang sah dan senarai masalah.', 'The input, the valid settings and a problem list.'],
        ['9–16', 'Nilai kedua bermaksud "nilai" pada kejayaan dan "ralat" pada kegagalan — namanya `valueOrErr` menyatakan kedua-duanya.', 'The second value means "value" on success and "error" on failure — its name `valueOrErr` says both.'],
        ['18–19', 'Tetapan dipaparkan; masalah dibuka dengan `table.unpack`.', 'The settings are displayed; the problems are unpacked with `table.unpack`.'])),
    S('summary',
      UL(
        ['`table.unpack(t, i, j)` menukar elemen senarai kepada nilai berasingan.', '`table.unpack(t, i, j)` turns list elements into separate values.'],
        ['Kegagalan yang dijangka: `return nil, mesej`.', 'Expected failure: `return nil, message`.'],
        ['Pemanggil: terima kedua-dua nilai dan semak yang pertama.', 'Caller: receive both values and check the first.'],
        ['`assert(f())` apabila kegagalan bermakna pepijat; `error` untuk kesilapan pengaturcara.', '`assert(f())` when failure means a bug; `error` for programmer mistakes.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dipulangkan oleh `table.unpack({5, 6, 7}, 2)`?', 'What does `table.unpack({5, 6, 7}, 2)` return?'],
        ['Mengapakah `-1` ialah penanda kegagalan yang lemah dalam Lua?', 'Why is `-1` a weak failure marker in Lua?'],
        ['Bilakah `assert(parsePort(x))` sesuai, dan bilakah tidak?', 'When is `assert(parsePort(x))` appropriate, and when is it not?'],
        ['Apakah perbezaan antara `nil, mesej` dan `error`?', 'What is the difference between `nil, message` and `error`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual — table.unpack', url: `${MANUAL}#pdf-table.unpack` },
        { title: 'Lua 5.4 Reference Manual — assert', url: `${MANUAL}#pdf-assert` },
        { title: 'Programming in Lua (1st ed.) — 8.3 Errors', url: `${PIL}/8.3.html` },
        { title: 'Lua 5.4 Reference Manual — io.open', url: `${MANUAL}#pdf-io.open` },
      )),
  ],
};

export const LUA104_M2 = [LUA104_2_1, LUA104_2_2, LUA104_2_3];
