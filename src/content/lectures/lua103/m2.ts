import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA103 · Module 2 — Loops (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 2.1 while loops ───────────────────────────────────────────────────────

export const LUA103_2_1: LectureContentDef = {
  courseCode: 'LUA103',
  module: 2,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis [[loop|gelung]] `while` yang menyemak syarat sebelum setiap pusingan.', 'Write `while` [[loop|loops]] that check the condition before every pass.'],
        ['Mengenal pasti tiga bahagian gelung: permulaan, syarat, kemas kini.', 'Identify the three parts of a loop: initialisation, condition, update.'],
        ['Mengesan dan membetulkan [[infinite-loop|gelung tak terhingga]].', 'Detect and fix [[infinite-loop|infinite loops]].'],
        ['Memilih `while` apabila bilangan pusingan tidak diketahui terlebih dahulu.', 'Choose `while` when the number of passes is not known in advance.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1: syarat dan `if`.', 'Module 1: conditions and `if`.'],
        ['LUA102 3.1: `//` dan `%`.', 'LUA102 3.1: `//` and `%`.'],
      )),
    S('introduction',
      P('Komputer hebat kerana ia boleh **mengulang** kerja tanpa jemu. Gelung `while` ialah bentuk pengulangan yang paling asas: "selagi syarat ini benar, ulang blok ini". Ia sesuai apabila anda tidak tahu berapa kali perlu mengulang — sehingga pengguna menaip "done", sehingga simpanan berganda, sehingga nombor menjadi sifar.',
        'Computers are powerful because they can **repeat** work without tiring. The `while` loop is the most basic form of repetition: "while this condition is true, repeat this block". It suits situations where you do not know how many times to repeat — until the user types "done", until savings double, until a number reaches zero.'),
      KEY('Setiap gelung `while` memerlukan sesuatu di dalam badannya yang **akhirnya** menjadikan syarat palsu.', 'Every `while` loop needs something in its body that **eventually** makes the condition false.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Permulaan:** beri nilai awal kepada pemboleh ubah gelung **sebelum** `while`.', '**Initialisation:** give the loop variable a starting value **before** the `while`.'],
        ['**Syarat:** disemak sebelum setiap pusingan, termasuk yang pertama; jika palsu dari awal, badan tidak pernah dijalankan.', '**Condition:** checked before every pass, including the first; if it is false from the start, the body never runs.'],
        ['**Kemas kini:** di dalam badan, ubah pemboleh ubah supaya syarat akhirnya palsu.', '**Update:** inside the body, change the variable so the condition eventually becomes false.'],
        ['**[[infinite-loop|Gelung tak terhingga]]:** jika kemas kini hilang atau salah arah, gelung tidak pernah tamat.', '**[[infinite-loop|Infinite loop]]:** if the update is missing or goes the wrong way, the loop never ends.'],
      )),
    S('detailed_theory',
      P('Gelung `while` dikompil kepada ujian di **atas** gelung dan lompatan balik di **bawah**: semak syarat; jika palsu, lompat keluar; jika tidak, jalankan badan dan lompat semula ke ujian. Kerana ujian berlaku sebelum badan, `while` boleh menjalankan badannya **sifar** kali — berbeza daripada `repeat … until` (kuliah 2.2). Pemboleh ubah yang mengawal gelung mesti wujud di luar gelung, kerana syarat dinilai di luar badan.',
        'A `while` loop compiles to a test at the **top** of the loop and a jump back at the **bottom**: check the condition; if it is false, jump out; otherwise run the body and jump back to the test. Because the test comes before the body, `while` can run its body **zero** times — unlike `repeat … until` (lecture 2.2). The variable that controls the loop must exist outside the loop, because the condition is evaluated outside the body.'),
      P('Cara yang baik untuk menaakul tentang gelung ialah **invarian gelung**: kenyataan yang benar sebelum dan selepas setiap pusingan. Dalam contoh hasil tambah digit, invariannya ialah "`sum` + hasil tambah digit `n` yang tinggal = hasil tambah digit nombor asal". Apabila `n` menjadi 0, invarian itu memberitahu bahawa `sum` ialah jawapannya. Memikirkan invarian membantu menulis gelung yang betul dan menemui pepijat sempadan (off-by-one).',
        'A good way to reason about loops is a **loop invariant**: a statement that is true before and after every pass. In the digit-sum example, the invariant is "`sum` + the digit sum of what is left in `n` = the digit sum of the original number". When `n` reaches 0, the invariant tells us `sum` is the answer. Thinking in invariants helps write correct loops and find boundary (off-by-one) bugs.')),
    S('technical_terminology', TERMS('loop', 'infinite-loop', 'control-flow', 'algorithm')),
    S('syntax_rules',
      UL(
        ['`while syarat do … end`', '`while condition do … end`'],
        ['`while true do … end` — gelung tanpa had yang mesti keluar dengan `break` atau `return`.', '`while true do … end` — an unbounded loop that must exit with `break` or `return`.'],
        ['Badan gelung ialah blok: `local` di dalamnya dicipta semula pada setiap pusingan.', 'The loop body is a block: a `local` inside it is created afresh on every pass.'],
      )),
    S('code_demonstration',
      CODE('countdown-while', 'lua', 'lua54', ['Kiraan detik dengan while', 'A countdown with while'], `
local n = 3
while n > 0 do
  print(n)
  n = n - 1
end
print("Lift off!")
`, '3\n2\n1\nLift off!'),
      EXPLAIN('countdown-while',
        ['1', '**Permulaan:** pemboleh ubah gelung bermula pada 3.', '**Initialisation:** the loop variable starts at 3.'],
        ['2', '**Syarat:** disemak sebelum setiap pusingan. Selepas `n` menjadi 0, ia palsu dan gelung tamat.', '**Condition:** checked before every pass. After `n` becomes 0, it is false and the loop ends.'],
        ['3–4', 'Badan: cetak, kemudian **kemas kini** — mengurangkan `n` membawa gelung ke arah tamat.', 'The body: print, then **update** — decreasing `n` moves the loop towards its end.'],
        ['6', 'Dijalankan sekali selepas gelung tamat.', 'Runs once after the loop finishes.'])),
    S('complete_examples',
      CODE('digit-sum', 'lua', 'lua54', ['Hasil tambah digit', 'Summing digits'], `
local n = 2026
local sum = 0
while n > 0 do
  sum = sum + n % 10
  n = n // 10
end
print(sum)
`, '10', {
        debug: BUG(`
local n = 2026
local sum
while n > 0 do
  sum = sum + n % 10
  n = n // 10
end
print(sum)
`, "example:4: attempt to perform arithmetic on a nil value (local 'sum')",
          '`local sum` tanpa nilai awal bermaksud `sum` ialah `nil`. Pada pusingan pertama, `sum + n % 10` cuba menambah kepada `nil`. Setiap pengumpul (accumulator) memerlukan **permulaan** yang betul: 0 untuk jumlah, 1 untuk hasil darab, `""` untuk teks.',
          '`local sum` with no initial value means `sum` is `nil`. On the first pass, `sum + n % 10` tries to add to `nil`. Every accumulator needs a proper **initialisation**: 0 for a sum, 1 for a product, `""` for text.'),
      }),
      EXPLAIN('digit-sum',
        ['1–2', 'Nombor yang diproses dan pengumpul yang bermula 0.', 'The number being processed and an accumulator starting at 0.'],
        ['3', 'Ulang selagi masih ada digit.', 'Repeat while digits remain.'],
        ['4', '`n % 10` ialah digit terakhir (6, 2, 0, 2); tambah ke jumlah.', '`n % 10` is the last digit (6, 2, 0, 2); add it to the sum.'],
        ['5', '`n // 10` membuang digit terakhir: 2026 → 202 → 20 → 2 → 0.', '`n // 10` drops the last digit: 2026 → 202 → 20 → 2 → 0.'],
        ['7', '2 + 0 + 2 + 6 = 10.', '2 + 0 + 2 + 6 = 10.']),
      CODE('savings-double', 'lua', 'lua54', ['Berapa tahun sehingga simpanan berganda?', 'How many years until savings double?'], `
local balance, rate, years = 1000, 0.06, 0
while balance < 2000 do
  balance = balance * (1 + rate)
  years = years + 1
end
print(years, string.format("%.2f", balance))
`, '12\t2012.20'),
      EXPLAIN('savings-double',
        ['1', 'Baki awal, kadar 6% dan kiraan tahun.', 'The starting balance, a 6% rate and a year counter.'],
        ['2–5', 'Kita tidak tahu berapa tahun diperlukan — itulah sebabnya `while` sesuai. Setiap pusingan menambah faedah satu tahun.', 'We do not know how many years are needed — that is why `while` fits. Each pass adds one year of interest.'],
        ['6', 'Selepas 12 tahun baki pertama kali melepasi 2000.', 'After 12 years the balance first exceeds 2000.'])),
    S('line_by_line',
      EXPLAIN('digit-sum',
        ['3', 'Invarian: `sum` + hasil tambah digit dalam `n` sentiasa 10. Apabila `n` ialah 0, `sum` sendiri ialah 10.', 'Invariant: `sum` + the digit sum of `n` is always 10. When `n` is 0, `sum` alone is 10.']),
      EXPLAIN('countdown-while',
        ['4', 'Tanpa baris ini, `n` kekal 3 dan syarat sentiasa benar — gelung tak terhingga.', 'Without this line, `n` stays 3 and the condition is always true — an infinite loop.'])),
    S('why_this_way',
      P('Mengapa menyemak syarat **sebelum** badan? Kerana kadang-kadang kerja tidak perlu dilakukan sama sekali: jika senarai kosong atau baki sudah mencukupi, badan tidak sepatutnya dijalankan. `while` mengendalikan kes "sifar kali" secara semula jadi.',
        'Why check the condition **before** the body? Because sometimes the work does not need doing at all: if a list is empty or a balance is already enough, the body should not run. `while` handles the "zero times" case naturally.'),
      P('Pilih `while` **apabila** gelung berhenti kerana keadaan berubah (input, pengiraan, peristiwa). Pilih `for` berangka (kuliah 2.3) **apabila** anda tahu julatnya terlebih dahulu.', 'Choose `while` **when** a loop stops because some state changes (input, a calculation, an event). Choose the numeric `for` (lecture 2.3) **when** you know the range in advance.')),
    S('execution_flow',
      OL(
        ['`countdown-while`: `n = 3`; syarat `3 > 0` benar → cetak 3, `n` = 2.', '`countdown-while`: `n = 3`; condition `3 > 0` is true → print 3, `n` = 2.'],
        ['Lompat balik ke syarat: `2 > 0` → cetak 2, `n` = 1.', 'Jump back to the condition: `2 > 0` → print 2, `n` = 1.'],
        ['`1 > 0` → cetak 1, `n` = 0.', '`1 > 0` → print 1, `n` = 0.'],
        ['`0 > 0` palsu → lompat keluar; cetak "Lift off!".', '`0 > 0` is false → jump out; print "Lift off!".'],
      )),
    S('memory_behaviour',
      P('Gelung itu sendiri tidak memperuntukkan memori. Pemboleh ubah gelung yang diisytiharkan di luar menggunakan satu slot sepanjang gelung. Local yang diisytiharkan **di dalam** badan menggunakan slot yang digunakan semula pada setiap pusingan. Gelung yang mencipta table atau string pada setiap pusingan menghasilkan sampah yang dikutip secara berkala — biasanya tidak menjadi masalah, tetapi elakkannya dalam gelung yang sangat kerap.',
        'The loop itself allocates no memory. A loop variable declared outside uses one slot for the whole loop. Locals declared **inside** the body use slots that are reused on every pass. A loop that creates tables or strings on every pass produces garbage that is collected periodically — usually fine, but avoid it in very hot loops.')),
    S('alternative_implementations',
      P('`while true do … end` dengan `break` ialah bentuk yang berguna apabila syarat keluar paling mudah disemak di **tengah** badan, contohnya selepas membaca input:', '`while true do … end` with `break` is a useful form when the exit condition is easiest to check in the **middle** of the body, for example after reading input:'),
      CODE('read-until-done', 'lua', 'lua54', ['Membaca sehingga "done"', 'Reading until "done"'], `
local items = {}
while true do
  local line = io.read("l")
  if line == nil or line == "done" then break end
  items[#items + 1] = line
end
print(#items .. " items: " .. table.concat(items, ", "))
`, '3 items: tea, rice, salt', { input: 'tea\nrice\nsalt\ndone\nignored\n' }),
      EXPLAIN('read-until-done',
        ['1', 'Senarai yang dikumpul.', 'The list being collected.'],
        ['2–6', 'Baca baris; keluar apabila input tamat **atau** pengguna menaip "done"; jika tidak, tambah item. Baris selepas "done" tidak dibaca.', 'Read a line; leave when input ends **or** the user types "done"; otherwise add the item. Lines after "done" are not read.'],
        ['7', 'Ringkasan.', 'A summary.'])),
    S('common_mistakes',
      UL(
        ['Terlupa kemas kini di dalam badan — gelung tak terhingga.', 'Forgetting the update inside the body — an infinite loop.'],
        ['Mengemas kini ke arah yang salah (`n = n + 1` dalam kiraan detik).', 'Updating in the wrong direction (`n = n + 1` in a countdown).'],
        ['Terlupa permulaan pengumpul (`local sum` tanpa `= 0`).', 'Forgetting to initialise an accumulator (`local sum` without `= 0`).'],
        ['Menulis `while n > 0` dan bukannya `while n >= 0` (atau sebaliknya) — ralat sempadan.', 'Writing `while n > 0` instead of `while n >= 0` (or the reverse) — a boundary error.'],
      )),
    S('debugging',
      P('Gelung tak terhingga tidak menghasilkan mesej ralat — program hanya "tergantung". Di terminal, tekan **Ctrl+C** untuk menghentikannya. Butang **Jalankan** dalam kuliah ini menghentikan contoh selepas 4 saat. Untuk mencari punca, tambah `print` di dalam badan untuk memaparkan pemboleh ubah gelung dan syarat pada setiap pusingan, atau tambah pengira keselamatan sementara (`if steps > 1000 then error("too many steps") end`). Ralat yang **kelihatan** dalam gelung biasanya datang daripada permulaan yang hilang, seperti contoh `digit-sum`, atau daripada syarat yang membandingkan `nil`:',
        'An infinite loop produces no error message — the program just "hangs". In a terminal, press **Ctrl+C** to stop it. The **Run** button in this lecture stops an example after 4 seconds. To find the cause, add a `print` inside the body that shows the loop variable and the condition on every pass, or add a temporary safety counter (`if steps > 1000 then error("too many steps") end`). **Visible** errors in loops usually come from a missing initialisation, as in the `digit-sum` example, or from a condition that compares `nil`:'),
      CODE('fill-tank', 'lua', 'lua54', ['Mengisi tangki sehingga penuh', 'Filling a tank until full'], `
local level, capacity = 0, 50
local minutes = 0
while level < capacity do
  level = level + 12
  minutes = minutes + 1
end
print(minutes .. " minutes, level " .. level)
`, '5 minutes, level 60', {
        debug: BUG(`
local level = 0
local minutes = 0
while level < capacity do
  level = level + 12
  minutes = minutes + 1
end
print(minutes .. " minutes, level " .. level)
`, "example:3: attempt to compare number with nil",
          '`capacity` tidak pernah diisytiharkan, jadi ia global `nil`. Syarat `level < capacity` dinilai sebelum pusingan pertama dan gagal serta-merta. Mesej menyebut jenis (`number with nil`) tetapi bukan nama — periksa setiap nama dalam syarat baris 3.',
          '`capacity` was never declared, so it is a `nil` global. The condition `level < capacity` is evaluated before the first pass and fails immediately. The message names the types (`number with nil`) but not the name — check every name in the condition on line 3.'),
      }),
      EXPLAIN('fill-tank',
        ['1–2', 'Paras, kapasiti dan masa.', 'The level, the capacity and the time.'],
        ['3–6', 'Tambah 12 liter seminit sehingga penuh. Pusingan terakhir melepasi kapasiti (60) — syarat hanya disemak di atas.', 'Add 12 litres a minute until full. The last pass overshoots the capacity (60) — the condition is only checked at the top.'],
        ['7', 'Lima minit, paras 60.', 'Five minutes, level 60.'])),
    S('performance',
      P('Kos gelung ialah bilangan pusingan × kos badan. Gelung yang bilangan pusingannya bergantung pada nilai input (contohnya hasil tambah digit) adalah pantas kerana ia hanya mengikut bilangan digit. Jika gelung `while` mengira sesuatu yang mempunyai formula terus (contohnya faedah kompaun), formula boleh menggantikan gelung — tetapi gelung selalunya lebih mudah difahami dan diubah.',
        'A loop’s cost is the number of passes × the cost of the body. Loops whose pass count depends on the input’s size (such as the digit sum) are fast because they only follow the number of digits. If a `while` loop computes something that has a direct formula (for example compound interest), the formula can replace the loop — but loops are often easier to understand and change.')),
    S('software_engineering',
      P('`while` dengan pengira manual ialah tanda bahawa gelung `for` lebih sesuai:', 'A `while` with a manual counter is a sign that a `for` loop fits better:'),
      CODE('poor-manual-counter', 'lua', 'lua54', ['Pelaksanaan lemah: pengira while manual', 'Poor implementation: a manual while counter'], `
local squares = {}
local i = 1
while i <= 4 do
  squares[#squares + 1] = i * i
  i = i + 1
end
print(table.concat(squares, " "))
`, '1 4 9 16'),
      EXPLAIN('poor-manual-counter',
        ['1–6', 'Tiga baris (permulaan, syarat, kemas kini) tersebar di tiga tempat; terlupa `i = i + 1` menghasilkan gelung tak terhingga.', 'Three lines (initialisation, condition, update) spread over three places; forgetting `i = i + 1` creates an infinite loop.'],
        ['7', 'Keputusan betul.', 'The result is correct.']),
      CODE('improved-for-counter', 'lua', 'lua54', ['Pelaksanaan lebih baik: for untuk julat yang diketahui', 'Improved implementation: for a known range'], `
local squares = {}
for i = 1, 4 do
  squares[#squares + 1] = i * i
end
print(table.concat(squares, " "))
`, '1 4 9 16'),
      EXPLAIN('improved-for-counter',
        ['1–4', 'Permulaan, had dan kemas kini dalam satu baris; tidak mungkin terlupa kemas kini, dan `i` hanya wujud di dalam gelung.', 'Initialisation, limit and update in one line; the update cannot be forgotten, and `i` only exists inside the loop.'],
        ['5', 'Keputusan sama.', 'The same result.'])),
    S('industry_use_cases',
      UL(
        ['Gelung permainan: `while running do update(); draw() end`.', 'Game loops: `while running do update(); draw() end`.'],
        ['Pelayan: `while true do local client = accept(); handle(client) end`.', 'Servers: `while true do local client = accept(); handle(client) end`.'],
        ['Algoritma berangka (GCD, kaedah Newton) yang berulang sehingga hasil stabil.', 'Numeric algorithms (GCD, Newton’s method) that repeat until a result settles.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `countdown-while` dari 10 dan sahkan output.', 'Run `countdown-while` from 10 and confirm the output.'],
        ['Tukar kadar dalam `savings-double` kepada 0.03 dan ramalkan bilangan tahun.', 'Change the rate in `savings-double` to 0.03 and predict the number of years.'],
        ['Buang baris kemas kini dalam salinan `countdown-while` dan jalankan dengan **Jalankan** — perhatikan had 4 saat menghentikannya.', 'Remove the update line in a copy of `countdown-while` and press **Run** — notice the 4-second limit stops it.'],
      )),
    S('mini_project',
      P('**Jujukan Collatz.** Bermula dengan n: jika genap, bahagi dua; jika ganjil, 3n + 1. Ulang sehingga 1, dan kira langkah.', '**The Collatz sequence.** Start with n: if even, halve it; if odd, 3n + 1. Repeat until 1, and count the steps.'),
      CODE('collatz', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local n, steps = 6, 0
local path = {n}
while n ~= 1 do
  if n % 2 == 0 then
    n = n // 2
  else
    n = 3 * n + 1
  end
  steps = steps + 1
  path[#path + 1] = n
end
print(steps .. " steps: " .. table.concat(path, " -> "))
`, '8 steps: 6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1'),
      EXPLAIN('collatz',
        ['1–2', 'Nombor permulaan, kiraan langkah, dan laluan yang direkodkan.', 'The starting number, a step count, and the recorded path.'],
        ['3', 'Bilangan langkah tidak diketahui terlebih dahulu — `while` ialah pilihan semula jadi.', 'The number of steps is not known in advance — `while` is the natural choice.'],
        ['4–8', 'Peraturan Collatz dengan `if/else`. `//` mengekalkan integer.', 'The Collatz rule with `if/else`. `//` keeps the value an integer.'],
        ['9–10', 'Kira langkah dan rekod nilai baharu.', 'Count the step and record the new value.'],
        ['12', 'Paparkan laluan dengan `table.concat`.', 'Display the path with `table.concat`.'])),
    S('summary',
      UL(
        ['`while syarat do … end` menyemak syarat sebelum setiap pusingan; badan boleh dijalankan sifar kali.', '`while condition do … end` checks the condition before each pass; the body may run zero times.'],
        ['Gelung memerlukan permulaan, syarat dan kemas kini.', 'A loop needs initialisation, a condition and an update.'],
        ['Kemas kini yang hilang atau salah arah menyebabkan gelung tak terhingga.', 'A missing or wrong-direction update causes an infinite loop.'],
        ['Gunakan `while` apabila bilangan pusingan tidak diketahui; `for` apabila julat diketahui.', 'Use `while` when the number of passes is unknown; `for` when the range is known.'],
      )),
    S('knowledge_check',
      OL(
        ['Berapa kali badan `while 0 > 1 do … end` dijalankan?', 'How many times does the body of `while 0 > 1 do … end` run?'],
        ['Apakah tiga bahagian gelung yang betul?', 'What are the three parts of a correct loop?'],
        ['Mengapakah `fill-tank` berakhir dengan paras 60 dan bukan 50?', 'Why does `fill-tank` end with a level of 60, not 50?'],
        ['Tulis gelung `while` yang mengira bilangan digit dalam 98765.', 'Write a `while` loop that counts the digits of 98765.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures (while)', url: `${MANUAL}#3.3.4` },
        { title: 'Programming in Lua (1st ed.) — 4.3.2 while', url: `${PIL}/4.3.2.html` },
        { title: 'Programming in Lua (1st ed.) — 4.4 break and return', url: `${PIL}/4.4.html` },
        { title: 'Lua 5.4 Reference Manual — io.read', url: `${MANUAL}#pdf-io.read` },
      )),
  ],
};

// ─── 2.2 repeat–until and the scope of its condition ───────────────────────

export const LUA103_2_2: LectureContentDef = {
  courseCode: 'LUA103',
  module: 2,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis gelung `repeat … until` yang menjalankan badannya sekurang-kurangnya sekali.', 'Write `repeat … until` loops that run their body at least once.'],
        ['Menerangkan bahawa syarat `until` boleh melihat local yang diisytiharkan dalam badan.', 'Explain that the `until` condition can see locals declared in the body.'],
        ['Membezakan `while` (semak dahulu) dan `repeat` (semak kemudian).', 'Distinguish `while` (check first) from `repeat` (check afterwards).'],
        ['Menggunakan `repeat` untuk pengesahan input dan menu.', 'Use `repeat` for input validation and menus.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1: gelung `while` dan gelung tak terhingga.', 'Lecture 2.1: `while` loops and infinite loops.'],
        ['LUA101 4.2: `io.read`.', 'LUA101 4.2: `io.read`.'],
      )),
    S('introduction',
      P('Sesetengah tugas mesti dilakukan **sekurang-kurangnya sekali** sebelum kita boleh memutuskan sama ada untuk mengulang: tanya soalan kemudian semak jawapan, gulung dadu kemudian semak hasilnya. `repeat … until` menyemak syarat di **hujung** badan, jadi badan sentiasa dijalankan sekali. Ia juga mempunyai ciri skop yang unik dalam Lua: syarat `until` boleh menggunakan pemboleh ubah yang diisytiharkan di dalam badan.',
        'Some tasks must be done **at least once** before we can decide whether to repeat: ask a question then check the answer, roll a die then check the result. `repeat … until` checks its condition at the **end** of the body, so the body always runs once. It also has a scoping feature unique to Lua: the `until` condition can use variables declared inside the body.'),
      KEY('`repeat` berhenti apabila syarat **benar** (bertentangan dengan `while`, yang berhenti apabila syarat palsu).', '`repeat` stops when its condition is **true** (the opposite of `while`, which stops when its condition is false).', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`repeat badan until syarat` — badan dijalankan, kemudian syarat disemak; jika palsu, ulang.', '`repeat body until condition` — the body runs, then the condition is checked; if it is false, repeat.'],
        ['Badan dijalankan **sekurang-kurangnya sekali**, walaupun syarat sudah benar dari awal.', 'The body runs **at least once**, even if the condition is already true from the start.'],
        ['`until` ialah "sehingga": gelung berterusan **sehingga** syarat benar.', '`until` means what it says: the loop continues **until** the condition is true.'],
        ['Skop: syarat `until` berada **di dalam** blok badan, jadi local badan kelihatan di situ.', 'Scope: the `until` condition is **inside** the body’s block, so the body’s locals are visible there.'],
      )),
    S('detailed_theory',
      P('Dalam kebanyakan bahasa, syarat gelung "lakukan-sementara" (do-while) tidak boleh melihat pemboleh ubah yang diisytiharkan di dalam badan, kerana badan sudah tamat sebelum syarat disemak. Lua memilih reka bentuk berbeza: blok `repeat` merangkumi syarat `until`. Ini bermakna anda boleh membaca input ke dalam `local` di dalam badan dan menyemaknya terus dalam `until`, tanpa mengisytiharkan pemboleh ubah di luar gelung. Selepas `until`, local itu hilang — ia tidak boleh digunakan selepas gelung.',
        'In most languages, a "do-while" loop’s condition cannot see variables declared inside the body, because the body has already ended before the condition is checked. Lua chose a different design: the `repeat` block includes the `until` condition. This means you can read input into a `local` inside the body and test it directly in `until`, without declaring the variable outside the loop. After `until`, that local is gone — it cannot be used after the loop.'),
      P('Ciri ini ada kehalusan: jika badan mengandungi `local x` dan juga terdapat `x` di luar, syarat `until` melihat `x` **dalaman**. Jika anda memerlukan nilai selepas gelung (contohnya input yang sah), isytiharkan pemboleh ubah sebelum `repeat` dan beri nilai di dalam badan tanpa `local`. Memilih antara dua corak ini ialah keputusan reka bentuk yang biasa dalam gelung pengesahan input.',
        'This feature has a subtlety: if the body contains `local x` and there is also an `x` outside, the `until` condition sees the **inner** `x`. If you need the value after the loop (for example a valid input), declare the variable before `repeat` and assign it inside the body without `local`. Choosing between these two patterns is a routine design decision in input-validation loops.')),
    S('technical_terminology', TERMS('loop', 'scope', 'standard-input', 'pseudocode')),
    S('syntax_rules',
      UL(
        ['`repeat … until syarat` — tiada `do` dan tiada `end`; `until` menutup blok.', '`repeat … until condition` — no `do` and no `end`; `until` closes the block.'],
        ['`local` dalam badan kelihatan dalam syarat `until`, tetapi tidak selepas gelung.', 'A `local` in the body is visible in the `until` condition, but not after the loop.'],
        ['`break` juga berfungsi dalam `repeat`.', '`break` also works inside `repeat`.'],
      )),
    S('code_demonstration',
      CODE('repeat-vs-while', 'lua', 'lua54', ['repeat menjalankan badan sekurang-kurangnya sekali', 'repeat runs its body at least once'], `
local n = 10

while n < 5 do
  print("while body", n)
end

repeat
  print("repeat body", n)
until n >= 5
`, 'repeat body\t10'),
      EXPLAIN('repeat-vs-while',
        ['1', 'Nilai yang sudah melepasi had.', 'A value that is already past the limit.'],
        ['3–5', '`while` menyemak dahulu: `10 < 5` palsu, jadi badan **tidak** dijalankan.', '`while` checks first: `10 < 5` is false, so the body does **not** run.'],
        ['7–9', '`repeat` menjalankan badan dahulu, kemudian `10 >= 5` benar, jadi ia berhenti — selepas satu pusingan.', '`repeat` runs the body first, then `10 >= 5` is true, so it stops — after one pass.'])),
    S('complete_examples',
      CODE('until-sees-local', 'lua', 'lua54', ['Syarat until melihat local badan', 'The until condition sees the body’s local'], `
local attempts = 0
repeat
  attempts = attempts + 1
  local roll = attempts * 7 % 6 + 1
  print("attempt " .. attempts .. ": rolled " .. roll)
until roll == 6
print("done after " .. attempts .. " attempts")
`, 'attempt 1: rolled 2\nattempt 2: rolled 3\nattempt 3: rolled 4\nattempt 4: rolled 5\nattempt 5: rolled 6\ndone after 5 attempts', {
        debug: BUG(`
local attempts = 0
repeat
  attempts = attempts + 1
  local roll = attempts * 7 % 6 + 1
until roll == 6
print("last roll was " .. roll)
`, "example:6: attempt to concatenate a nil value (global 'roll')",
          '`roll` ialah local **badan gelung**: ia kelihatan dalam `until` (baris 5), tetapi hilang selepas gelung. Pada baris 6, `roll` dicari sebagai global — yang tidak wujud. Jika nilai diperlukan selepas gelung, isytiharkan `local roll` **sebelum** `repeat` dan beri nilai tanpa `local` di dalam badan.',
          '`roll` is a local of the **loop body**: it is visible in `until` (line 5), but gone after the loop. On line 6, `roll` is looked up as a global — which does not exist. If the value is needed after the loop, declare `local roll` **before** `repeat` and assign it without `local` inside the body.'),
      }),
      EXPLAIN('until-sees-local',
        ['1', 'Pengira yang kekal selepas gelung (diisytiharkan di luar).', 'A counter that survives the loop (declared outside).'],
        ['2–5', 'Setiap pusingan: tambah kiraan, "gulung" nilai yang boleh diramal (simulasi dadu) ke dalam local `roll`, dan paparkan.', 'Each pass: increment the count, "roll" a predictable value (a simulated die) into the local `roll`, and display it.'],
        ['6', '`until` menggunakan `roll` — local badan — terus. Gelung berhenti apabila 6 muncul.', '`until` uses `roll` — the body’s local — directly. The loop stops when a 6 appears.'],
        ['7', '`attempts` masih wujud; `roll` tidak.', '`attempts` still exists; `roll` does not.']),
      CODE('validate-repeat', 'lua', 'lua54', ['Pengesahan input dengan repeat', 'Input validation with repeat'], `
local quantity
repeat
  io.write("Quantity (1-10)? ")
  local text = io.read("l")
  if text == nil then break end
  quantity = tonumber(text)
until quantity and quantity >= 1 and quantity <= 10
print()
print("quantity:", quantity)
`, 'Quantity (1-10)? Quantity (1-10)? Quantity (1-10)? \nquantity:\t4', { input: 'zero\n15\n4\n' }),
      EXPLAIN('validate-repeat',
        ['1', '`quantity` diisytiharkan di luar kerana nilainya diperlukan selepas gelung.', '`quantity` is declared outside because its value is needed after the loop.'],
        ['2–4', 'Soalan **sentiasa** ditanya sekurang-kurangnya sekali — sebab utama memilih `repeat`.', 'The question is **always** asked at least once — the main reason to choose `repeat`.'],
        ['5', 'Jika input tamat, keluar dengan `break` (jika tidak, gelung tidak akan tamat).', 'If input ends, leave with `break` (otherwise the loop would never end).'],
        ['6–7', 'Tukar, kemudian ulang sehingga nilai sah dan dalam julat. "zero" dan 15 ditolak; 4 diterima.', 'Convert, then repeat until the value is valid and in range. "zero" and 15 are rejected; 4 is accepted.'],
        ['8–9', '`print()` menamatkan baris gesaan; kemudian keputusan.', '`print()` ends the prompt line; then the result.'])),
    S('line_by_line',
      EXPLAIN('until-sees-local',
        ['4', 'Formula `attempts * 7 % 6 + 1` memberi 2, 3, 4, 5, 6 — nilai yang boleh diramal supaya output disahkan. Kuliah 4.2 menggunakan `math.random` sebenar.', 'The formula `attempts * 7 % 6 + 1` gives 2, 3, 4, 5, 6 — predictable values so the output can be verified. Lecture 4.2 uses a real `math.random`.']),
      EXPLAIN('validate-repeat',
        ['7', '`quantity and …` melindungi perbandingan: jika `tonumber` memulangkan `nil`, `quantity >= 1` tidak dinilai (litar pintas).', '`quantity and …` protects the comparison: if `tonumber` returned `nil`, `quantity >= 1` is not evaluated (short-circuit).'])),
    S('why_this_way',
      P('Mengapa Lua membenarkan `until` melihat local badan? Kerana dalam hampir setiap gelung `repeat`, syarat bergantung pada sesuatu yang **dikira dalam badan** pusingan itu. Membenarkannya mengelakkan pemboleh ubah di luar gelung yang hanya wujud untuk syarat itu, menjadikan skop sekecil mungkin.',
        'Why does Lua let `until` see the body’s locals? Because in almost every `repeat` loop the condition depends on something **computed in that pass’s body**. Allowing it avoids variables outside the loop that exist only for the condition, keeping scope as small as possible.'),
      P('Pilih `repeat` **apabila** tindakan mesti berlaku sekali sebelum keputusan (gesaan, percubaan, ukuran). Pilih `while` **apabila** tindakan mungkin tidak diperlukan sama sekali.', 'Choose `repeat` **when** an action must happen once before deciding (a prompt, an attempt, a measurement). Choose `while` **when** the action may not be needed at all.')),
    S('execution_flow',
      OL(
        ['`validate-repeat`: gesaan dicetak; baris "zero" dibaca; `tonumber` → `nil`.', '`validate-repeat`: the prompt is printed; the line "zero" is read; `tonumber` → `nil`.'],
        ['Syarat `until`: `nil and …` → `nil` (palsu) → ulang.', 'The `until` condition: `nil and …` → `nil` (falsy) → repeat.'],
        ['"15" → 15; `15 <= 10` palsu → ulang.', '"15" → 15; `15 <= 10` is false → repeat.'],
        ['"4" → 4; syarat benar → gelung tamat; keputusan dicetak.', '"4" → 4; the condition is true → the loop ends; the result is printed.'],
      )),
    S('memory_behaviour',
      P('Seperti `while`, `repeat` tidak memperuntukkan memori sendiri. Local badan (seperti `text`) menggunakan slot yang dibebaskan pada akhir setiap pusingan — selepas syarat `until` dinilai. String yang dibaca pada setiap pusingan menjadi sampah sebaik sahaja pusingan seterusnya bermula.',
        'Like `while`, `repeat` allocates no memory of its own. Body locals (such as `text`) use slots released at the end of every pass — after the `until` condition has been evaluated. The string read on each pass becomes garbage as soon as the next pass starts.')),
    S('alternative_implementations',
      P('Sebarang `repeat` boleh ditulis sebagai `while true` dengan `break` di hujung badan. Bandingkan dua versi gesaan ya/tidak:', 'Any `repeat` can be written as `while true` with a `break` at the end of the body. Compare two versions of a yes/no prompt:'),
      CODE('yes-no', 'lua', 'lua54', ['repeat berbanding while true', 'repeat versus while true'], `
local answer
while true do
  answer = io.read("l")
  if answer == nil or answer == "y" or answer == "n" then break end
  print("please type y or n")
end
print("answer:", answer)
`, 'please type y or n\nanswer:\ty', { input: 'maybe\ny\n' }),
      EXPLAIN('yes-no',
        ['1', 'Jawapan diperlukan selepas gelung.', 'The answer is needed after the loop.'],
        ['2–6', 'Bentuk `while true`: baca, keluar jika sah atau input tamat, jika tidak beri amaran. Bentuk ini membolehkan mesej amaran **selepas** semakan — lebih sukar dengan `repeat`.', 'The `while true` form: read, leave if valid or input ended, otherwise warn. This form allows the warning **after** the check — harder with `repeat`.'],
        ['7', 'Keputusan: "y".', 'The result: "y".'])),
    S('common_mistakes',
      UL(
        ['Menjangka `repeat … until` berhenti apabila syarat **palsu** (mengelirukannya dengan `while`).', 'Expecting `repeat … until` to stop when the condition is **false** (confusing it with `while`).'],
        ['Menulis `end` selepas `until` — `until` sudah menutup blok.', 'Writing `end` after `until` — `until` already closes the block.'],
        ['Menggunakan local badan selepas gelung.', 'Using a body local after the loop.'],
        ['Tidak mengendalikan input yang tamat, menyebabkan gelung tak terhingga.', 'Not handling exhausted input, causing an infinite loop.'],
      )),
    S('debugging',
      P('Untuk gelung `repeat`, semak dua perkara: adakah syarat `until` ditulis dalam bentuk **"bila berhenti"** (bukan "bila teruskan"), dan adakah setiap pemboleh ubah yang digunakan selepas gelung diisytiharkan di luarnya. Jika gelung tidak pernah berhenti, cetak nilai pemboleh ubah syarat pada setiap pusingan untuk melihat sama ada ia benar-benar bergerak ke arah syarat berhenti. Ralat sintaks yang biasa ialah terlupa `until`:',
        'For `repeat` loops, check two things: is the `until` condition written as **"when to stop"** (not "when to continue"), and is every variable used after the loop declared outside it. If the loop never stops, print the condition variable on every pass to see whether it really moves towards the stopping condition. A common syntax error is forgetting `until`:'),
      CODE('powers-of-two', 'lua', 'lua54', ['Kuasa dua sehingga melebihi 100', 'Powers of two until past 100'], `
local value = 1
repeat
  value = value * 2
until value > 100
print(value)
`, '128', {
        debug: BUG(`
local value = 1
repeat
  value = value * 2
end
print(value)
`, "example:4: 'until' expected (to close 'repeat' at line 2) near 'end'",
          'Blok `repeat` ditutup dengan `until syarat`, bukan `end`. Penghurai menemui `end` di tempat ia menjangkakan `until` dan memberitahu di mana `repeat` dibuka (baris 2). Gantikan `end` dengan `until value > 100`.',
          'A `repeat` block is closed with `until condition`, not `end`. The parser finds `end` where it expects `until` and tells you where the `repeat` was opened (line 2). Replace `end` with `until value > 100`.'),
      }),
      EXPLAIN('powers-of-two',
        ['1', 'Nilai permulaan.', 'The starting value.'],
        ['2–4', 'Gandakan sehingga melebihi 100: 2, 4, … 64, 128.', 'Double until it exceeds 100: 2, 4, … 64, 128.'],
        ['5', 'Kuasa dua pertama melebihi 100.', 'The first power of two above 100.'])),
    S('performance',
      P('`repeat` dan `while` mempunyai kos yang sama setiap pusingan (satu ujian dan satu lompatan). `repeat` menjimatkan satu ujian apabila badan memang mesti dijalankan sekali. Perbezaan prestasi tidak bermakna; pilih berdasarkan maksud.',
        '`repeat` and `while` cost the same per pass (one test and one jump). `repeat` saves one test when the body must run once anyway. The performance difference is not meaningful; choose by meaning.')),
    S('software_engineering',
      P('Kod gesaan dengan `while` sering mengulang bacaan sebelum dan di dalam gelung:', 'Prompt code written with `while` often repeats the read before and inside the loop:'),
      CODE('poor-duplicated-read', 'lua', 'lua54', ['Pelaksanaan lemah: bacaan berganda', 'Poor implementation: a duplicated read'], `
local pin = io.read("l")
while pin ~= "1234" and pin ~= nil do
  print("wrong PIN")
  pin = io.read("l")
end
print("PIN accepted:", pin ~= nil)
`, 'wrong PIN\nPIN accepted:\ttrue', { input: '0000\n1234\n' }),
      EXPLAIN('poor-duplicated-read',
        ['1–5', '`io.read` ditulis dua kali: sebelum gelung dan di hujung badan. Menukar cara membaca (contohnya menambah gesaan) mesti dilakukan di dua tempat.', '`io.read` is written twice: before the loop and at the end of the body. Changing how we read (for example adding a prompt) must be done in two places.'],
        ['6', 'Keputusan betul.', 'The result is correct.']),
      CODE('improved-single-read', 'lua', 'lua54', ['Pelaksanaan lebih baik: satu bacaan dalam repeat', 'Improved implementation: a single read inside repeat'], `
local pin, tries = nil, 0
repeat
  pin = io.read("l")
  tries = tries + 1
  if pin ~= nil and pin ~= "1234" then print("wrong PIN") end
until pin == nil or pin == "1234"
print("PIN accepted:", pin ~= nil, "tries:", tries)
`, 'wrong PIN\nPIN accepted:\ttrue\ttries:\t2', { input: '0000\n1234\n' }),
      EXPLAIN('improved-single-read',
        ['1', 'Keadaan yang diperlukan selepas gelung.', 'The state needed after the loop.'],
        ['2–6', 'Satu tempat untuk membaca, satu untuk mengira, satu syarat berhenti yang jelas.', 'One place to read, one to count, one clear stop condition.'],
        ['7', 'Keputusan dan bilangan percubaan.', 'The result and the number of tries.'])),
    S('industry_use_cases',
      UL(
        ['Gesaan baris arahan yang bertanya sehingga jawapan sah.', 'Command-line prompts that ask until the answer is valid.'],
        ['Protokol rangkaian: hantar, kemudian ulang jika tiada pengakuan diterima (retry).', 'Network protocols: send, then repeat if no acknowledgement arrives (retry).'],
        ['Simulasi: ambil sampel sehingga keputusan memenuhi syarat.', 'Simulations: sample until a result meets a condition.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `repeat-vs-while`, kemudian tukar `n` kepada 1 dan terangkan perbezaan output.', 'Run `repeat-vs-while`, then change `n` to 1 and explain the difference in output.'],
        ['Jalankan versi berpepijat `until-sees-local` dan betulkannya dengan memindahkan pengisytiharan.', 'Run the buggy `until-sees-local` and fix it by moving the declaration.'],
        ['Tukar input `validate-repeat` supaya semua jawapan tidak sah; apakah yang berlaku?', 'Change the `validate-repeat` input so every answer is invalid; what happens?'],
      )),
    S('mini_project',
      P('**Menu teks.** Paparkan menu, baca pilihan, laksanakan tindakan, dan ulang sehingga pengguna memilih `q`.', '**A text menu.** Display a menu, read a choice, perform the action, and repeat until the user chooses `q`.'),
      CODE('text-menu', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local balance = 100
local choice
repeat
  choice = io.read("l") or "q"
  if choice == "b" then
    print("balance: " .. balance)
  elseif choice == "d" then
    balance = balance + 50
    print("deposited 50")
  elseif choice ~= "q" then
    print("unknown option: " .. choice)
  end
until choice == "q"
print("goodbye")
`, 'balance: 100\ndeposited 50\nunknown option: x\nbalance: 150\ngoodbye', { input: 'b\nd\nx\nb\nq\n' }),
      EXPLAIN('text-menu',
        ['1–2', 'Keadaan akaun dan pilihan semasa (diperlukan dalam `until`).', 'The account state and the current choice (needed in `until`).'],
        ['3–4', 'Baca pilihan; jika input tamat, anggap "q" supaya gelung sentiasa berhenti.', 'Read a choice; if input ends, treat it as "q" so the loop always stops.'],
        ['5–12', '`elseif` memilih tindakan; pilihan yang tidak dikenali dilaporkan.', '`elseif` picks the action; unknown options are reported.'],
        ['13–14', 'Ulang sehingga "q", kemudian ucap selamat tinggal.', 'Repeat until "q", then say goodbye.'])),
    S('summary',
      UL(
        ['`repeat … until syarat` menjalankan badan sekurang-kurangnya sekali dan berhenti apabila syarat benar.', '`repeat … until condition` runs the body at least once and stops when the condition is true.'],
        ['Syarat `until` boleh melihat local badan; local itu hilang selepas gelung.', 'The `until` condition can see body locals; those locals vanish after the loop.'],
        ['Isytiharkan di luar gelung apa yang diperlukan selepasnya.', 'Declare outside the loop whatever is needed after it.'],
        ['Sesuai untuk gesaan, percubaan semula dan menu.', 'Well suited to prompts, retries and menus.'],
      )),
    S('knowledge_check',
      OL(
        ['Berapa kali badan `repeat print("x") until true` dijalankan?', 'How many times does the body of `repeat print("x") until true` run?'],
        ['Apakah perbezaan maksud syarat dalam `while` dan `until`?', 'What is the difference in meaning between the conditions of `while` and `until`?'],
        ['Mengapakah `until roll == 6` sah walaupun `roll` diisytiharkan di dalam badan?', 'Why is `until roll == 6` valid although `roll` is declared inside the body?'],
        ['Bagaimanakah anda memastikan gelung gesaan tamat apabila input habis?', 'How do you make sure a prompt loop ends when input runs out?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures (repeat)', url: `${MANUAL}#3.3.4` },
        { title: 'Lua 5.4 Reference Manual §3.5 — Visibility Rules', url: `${MANUAL}#3.5` },
        { title: 'Programming in Lua (1st ed.) — 4.3.3 repeat', url: `${PIL}/4.3.3.html` },
        { title: 'Programming in Lua (1st ed.) — 21.1 The Simple I/O Model', url: `${PIL}/21.1.html` },
      )),
  ],
};

// ─── 2.3 Numeric for: start, limit and step ────────────────────────────────

export const LUA103_2_3: LectureContentDef = {
  courseCode: 'LUA103',
  module: 2,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis gelung `for` berangka dengan mula, had dan langkah.', 'Write numeric `for` loops with a start, limit and step.'],
        ['Mengira ke bawah dan melangkau dengan langkah negatif atau lebih besar.', 'Count down and skip with negative or larger steps.'],
        ['Menerangkan bahawa pemboleh ubah gelung ialah local dan had dinilai sekali sahaja.', 'Explain that the loop variable is local and the limit is evaluated only once.'],
        ['Mengelak masalah langkah float dan pengubahsuaian table semasa berulang.', 'Avoid float-step problems and modifying a table while iterating.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1–2.2: `while` dan `repeat`.', 'Lectures 2.1–2.2: `while` and `repeat`.'],
        ['LUA102 2.2: integer dan float.', 'LUA102 2.2: integers and floats.'],
      )),
    S('introduction',
      P('Apabila anda tahu **julat** yang ingin diulang — 1 hingga 10, setiap tahun dari 2020 hingga 2030, setiap elemen senarai — gelung `for` berangka ialah alat yang paling jelas. Ia menghimpunkan permulaan, syarat dan kemas kini dalam satu baris, jadi pepijat seperti terlupa kemas kini mustahil berlaku.',
        'When you know the **range** to repeat over — 1 to 10, every year from 2020 to 2030, every element of a list — the numeric `for` loop is the clearest tool. It gathers initialisation, condition and update into one line, so bugs like forgetting the update cannot happen.'),
      KEY('`for i = mula, had, langkah do … end` — `i` bermula pada `mula`, ditambah `langkah` setiap pusingan, dan berhenti selepas melepasi `had`.', '`for i = start, limit, step do … end` — `i` starts at `start`, grows by `step` each pass, and stops once it passes `limit`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Langkah lalai ialah 1: `for i = 1, 5` memberi 1, 2, 3, 4, 5. Had **termasuk**.', 'The default step is 1: `for i = 1, 5` gives 1, 2, 3, 4, 5. The limit is **inclusive**.'],
        ['Langkah negatif mengira ke bawah: `for i = 10, 1, -3` memberi 10, 7, 4, 1.', 'A negative step counts down: `for i = 10, 1, -3` gives 10, 7, 4, 1.'],
        ['Jika mula sudah melepasi had, gelung dijalankan **sifar** kali.', 'If the start is already past the limit, the loop runs **zero** times.'],
        ['Pemboleh ubah gelung ialah **local** gelung: tidak kelihatan selepas `end`, dan menukarnya tidak mengubah lelaran.', 'The loop variable is **local** to the loop: invisible after `end`, and changing it does not alter the iteration.'],
        ['Mula, had dan langkah dinilai **sekali** sebelum gelung bermula.', 'Start, limit and step are evaluated **once** before the loop begins.'],
      )),
    S('detailed_theory',
      P('Dalam Lua 5.4, gelung `for` berangka menyediakan **pengira lelaran** sebelum pusingan pertama: daripada mula, had dan langkah, ia mengira berapa kali gelung akan dijalankan (jika semua integer). Kerana itu, mengubah pemboleh ubah had di dalam badan tidak memberi kesan, dan gelung integer tidak pernah melimpah walaupun had ialah `math.maxinteger`. Pemboleh ubah gelung yang anda lihat ialah **salinan** nilai lelaran: memberinya nilai lain di dalam badan hanya mengubah salinan itu untuk baki pusingan semasa.',
        'In Lua 5.4, the numeric `for` loop prepares an **iteration counter** before the first pass: from the start, limit and step, it computes how many times the loop will run (when all are integers). That is why changing the limit variable inside the body has no effect, and why integer loops never overflow even if the limit is `math.maxinteger`. The loop variable you see is a **copy** of the iteration value: assigning to it inside the body only changes that copy for the rest of the current pass.'),
      P('Jika mula dan langkah kedua-duanya integer, gelung menggunakan integer; jika salah satu float, semua nilai ialah float. Langkah float seperti 0.1 terdedah kepada ralat pembundaran: 0.1 tidak boleh diwakili tepat, jadi jumlah terkumpul mungkin sedikit melepasi had dan pusingan terakhir hilang. Untuk julat perpuluhan yang tepat, ulang dengan integer dan bahagi (`for i = 0, 10 do local x = i / 10 … end`). Langkah sifar ialah ralat, kerana gelung tidak akan pernah tamat.',
        'If both the start and the step are integers, the loop uses integers; if either is a float, every value is a float. Float steps such as 0.1 suffer from rounding errors: 0.1 cannot be represented exactly, so the accumulated value may slightly pass the limit and the last pass goes missing. For an exact decimal range, iterate with integers and divide (`for i = 0, 10 do local x = i / 10 … end`). A step of zero is an error, because the loop would never end.')),
    S('technical_terminology', TERMS('loop', 'number-subtype', 'scope', 'table')),
    S('syntax_rules',
      UL(
        ['`for i = mula, had do … end` — langkah 1.', '`for i = start, limit do … end` — step 1.'],
        ['`for i = mula, had, langkah do … end` — langkah eksplisit (positif atau negatif, bukan 0).', '`for i = start, limit, step do … end` — an explicit step (positive or negative, never 0).'],
        ['Mula, had dan langkah mesti nombor (string berangka seperti `"4"` ditukar secara automatik, tetapi jangan bergantung padanya).', 'The start, limit and step must be numbers (numeric strings such as `"4"` are converted automatically, but do not rely on it).'],
        ['`for i = #t, 1, -1` — berulang dari hujung senarai ke awal.', '`for i = #t, 1, -1` — iterates from the end of a list to the start.'],
      )),
    S('code_demonstration',
      CODE('for-ranges', 'lua', 'lua54', ['Julat, langkah dan arah', 'Ranges, steps and directions'], `
for i = 1, 5 do io.write(i, " ") end
print()
for i = 10, 1, -3 do io.write(i, " ") end
print()
for i = 0, 20, 5 do io.write(i, " ") end
print()
for i = 5, 1 do io.write("never ") end
print("(empty loop)")
`, '1 2 3 4 5 \n10 7 4 1 \n0 5 10 15 20 \n(empty loop)'),
      EXPLAIN('for-ranges',
        ['1–2', 'Langkah lalai 1; had 5 termasuk.', 'The default step 1; the limit 5 is included.'],
        ['3–4', 'Langkah −3 mengira ke bawah: 10, 7, 4, 1 (seterusnya −2 melepasi had 1).', 'A step of −3 counts down: 10, 7, 4, 1 (the next, −2, would pass the limit 1).'],
        ['5–6', 'Langkah 5: gandaan lima hingga 20.', 'A step of 5: multiples of five up to 20.'],
        ['7–8', 'Mula 5 sudah melepasi had 1 dengan langkah positif, jadi badan tidak dijalankan langsung.', 'The start 5 is already past the limit 1 with a positive step, so the body never runs.'])),
    S('complete_examples',
      CODE('loop-variable-local', 'lua', 'lua54', ['Pemboleh ubah gelung dan had yang dinilai sekali', 'The loop variable and a limit evaluated once'], `
local limit = 3
local passes = 0
for i = 1, limit do
  limit = limit + 1        -- does not extend the loop
  i = i * 10               -- only changes this pass's copy
  passes = passes + 1
end
print(passes, limit, i)
`, '3\t6\tnil', {
        debug: BUG(`
for i = 1, 5, 0 do
  print(i)
end
`, "example:1: 'for' step is zero",
          'Langkah sifar bermakna `i` tidak pernah berubah, jadi gelung tidak akan pernah tamat. Lua mengesannya sebelum pusingan pertama dan membaling ralat. Ini salah satu daripada sedikit kes di mana bahasa menghalang gelung tak terhingga untuk anda.',
          'A step of zero means `i` never changes, so the loop would never end. Lua detects this before the first pass and raises an error. This is one of the few cases where the language prevents an infinite loop for you.'),
      }),
      EXPLAIN('loop-variable-local',
        ['1–2', 'Pemboleh ubah had dan pengira pusingan.', 'A limit variable and a pass counter.'],
        ['3', 'Had dinilai **sekali**: gelung dijalankan tiga kali, apa sahaja yang berlaku pada `limit` kemudian.', 'The limit is evaluated **once**: the loop runs three times, whatever happens to `limit` later.'],
        ['4', '`limit` luar berubah (3 → 6), tetapi gelung sudah tahu bilangan pusingannya.', 'The outer `limit` changes (3 → 6), but the loop already knows its pass count.'],
        ['5', 'Memberi nilai kepada `i` hanya mengubah salinan pusingan ini; pusingan seterusnya tetap 2, kemudian 3.', 'Assigning to `i` only changes this pass’s copy; the next pass is still 2, then 3.'],
        ['6', 'Kira pusingan.', 'Count the passes.'],
        ['8', 'Tiga pusingan, `limit` = 6, dan `i` tidak wujud di luar gelung (`nil`).', 'Three passes, `limit` = 6, and `i` does not exist outside the loop (`nil`).']),
      CODE('float-step', 'lua', 'lua54', ['Langkah float dan alternatif integer', 'A float step and the integer alternative'], `
local count = 0
for x = 0, 0.3, 0.1 do count = count + 1 end
print("expected 4 passes, got", count)

for i = 0, 4 do io.write(i / 4, " ") end
print()
`, 'expected 4 passes, got\t3\n0 0.25 0.5 0.75 1 '),
      EXPLAIN('float-step',
        ['1–3', 'Secara matematik 0, 0.1, 0.2, 0.3 ialah empat nilai. Tetapi 0.1 + 0.1 + 0.1 dalam float ialah 0.30000000000000004 — sedikit **melepasi** had 0.3 — jadi pusingan terakhir hilang dan hanya 3 pusingan berlaku. (Dengan had lain, ralat boleh jatuh ke arah bertentangan; itulah sebabnya hasil langkah float sukar diramal.)', 'Mathematically 0, 0.1, 0.2, 0.3 are four values. But 0.1 + 0.1 + 0.1 in floating point is 0.30000000000000004 — slightly **past** the limit 0.3 — so the last pass is lost and only 3 passes happen. (With other limits the error can fall the other way; that is why float-step results are hard to predict.)'],
        ['5–6', 'Alternatif yang tepat: ulang dengan integer 0..4 dan bahagi — setiap nilai dikira terus, tiada ralat terkumpul. `io.write` memformat float dengan `%.14g`, jadi 0.0 dan 1.0 dipaparkan sebagai `0` dan `1` (LUA101 4.1).', 'The exact alternative: iterate with integers 0..4 and divide — each value is computed directly, with no accumulated error. `io.write` formats floats with `%.14g`, so 0.0 and 1.0 are shown as `0` and `1` (LUA101 4.1).'])),
    S('line_by_line',
      EXPLAIN('for-ranges',
        ['3', 'Lua mengira bilangan pusingan sebelum bermula: (10 − 1) // 3 + 1 = 4 pusingan. Itulah sebabnya gelung integer tidak pernah tersalah kira walaupun langkahnya besar.', 'Lua computes the pass count before starting: (10 − 1) // 3 + 1 = 4 passes. That is why integer loops never miscount even with large steps.']),
      EXPLAIN('loop-variable-local',
        ['5', 'Dalam kod sebenar, jangan sekali-kali memberi nilai kepada pemboleh ubah gelung — ia mengelirukan. Jika anda perlukan nilai berbeza, gunakan local baharu.', 'In real code, never assign to the loop variable — it is confusing. If you need a different value, use a new local.'])),
    S('why_this_way',
      P('Mengapa had dinilai sekali dan pemboleh ubah gelung ialah salinan? Supaya bilangan pusingan **boleh diramal** daripada baris `for` sahaja: pembaca tidak perlu meneliti badan untuk mengetahui sama ada gelung akan tamat. Ini menjadikan `for` lebih selamat daripada `while` untuk julat yang diketahui.',
        'Why is the limit evaluated once and the loop variable a copy? So the number of passes is **predictable** from the `for` line alone: readers need not study the body to know whether the loop ends. That makes `for` safer than `while` for known ranges.'),
      P('Gunakan `for` berangka **apabila** julat diketahui; gunakan `for … in ipairs` (LUA111) **apabila** melawati elemen senarai dan anda tidak memerlukan indeks secara matematik.', 'Use the numeric `for` **when** the range is known; use `for … in ipairs` (LUA111) **when** visiting a list’s elements and you do not need the index mathematically.')),
    S('execution_flow',
      OL(
        ['`for i = 10, 1, -3`: Lua menilai 10, 1 dan −3 sekali dan menyemak langkah bukan sifar.', '`for i = 10, 1, -3`: Lua evaluates 10, 1 and −3 once and checks that the step is not zero.'],
        ['Ia mengira bilangan lelaran: 4.', 'It computes the number of iterations: 4.'],
        ['Setiap pusingan: salin nilai semasa ke `i`, jalankan badan, tambah langkah.', 'Each pass: copy the current value into `i`, run the body, add the step.'],
        ['Selepas empat pusingan, gelung tamat dan `i` hilang.', 'After four passes, the loop ends and `i` disappears.'],
      )),
    S('memory_behaviour',
      P('Gelung `for` berangka menggunakan beberapa slot daftar dalaman (nilai semasa, kiraan, langkah) dan satu slot untuk pemboleh ubah yang kelihatan. Tiada heap digunakan. Ini menjadikannya bentuk gelung paling cekap dalam Lua untuk julat integer.',
        'A numeric `for` loop uses a few internal register slots (the current value, the count, the step) plus one slot for the visible variable. No heap is used. This makes it the most efficient loop form in Lua for integer ranges.')),
    S('alternative_implementations',
      P('Memadam elemen semasa berulang ke hadapan melangkau elemen, kerana elemen seterusnya beralih ke kedudukan semasa. Berulang **ke belakang** menyelesaikannya:', 'Removing elements while iterating forwards skips elements, because the next element shifts into the current position. Iterating **backwards** solves it:'),
      CODE('remove-backwards', 'lua', 'lua54', ['Memadam semasa berulang ke belakang', 'Removing while iterating backwards'], `
local scores = {40, 75, 30, 20, 90}
for i = #scores, 1, -1 do
  if scores[i] < 50 then
    table.remove(scores, i)
  end
end
print(table.concat(scores, " "))
`, '75 90'),
      EXPLAIN('remove-backwards',
        ['1', 'Senarai dengan tiga markah gagal, dua daripadanya bersebelahan.', 'A list with three failing scores, two of them adjacent.'],
        ['2', 'Bermula dari hujung: `#scores` dinilai sekali (5), langkah −1.', 'Start from the end: `#scores` is evaluated once (5), step −1.'],
        ['3–5', '`table.remove` mengalihkan elemen **selepas** `i` ke kiri — elemen yang sudah diproses — jadi tiada yang terlepas.', '`table.remove` shifts the elements **after** `i` to the left — elements already processed — so nothing is skipped.'],
        ['7', 'Hanya markah lulus kekal.', 'Only the passing scores remain.'])),
    S('common_mistakes',
      UL(
        ['Menjangka had tidak termasuk (seperti `range` dalam Python) — dalam Lua `for i = 1, 3` termasuk 3.', 'Expecting the limit to be exclusive (as with Python’s `range`) — in Lua `for i = 1, 3` includes 3.'],
        ['Terlupa langkah negatif apabila mengira ke bawah — `for i = 10, 1` tidak berjalan.', 'Forgetting the negative step when counting down — `for i = 10, 1` does not run.'],
        ['Menggunakan langkah float dan kehilangan pusingan terakhir.', 'Using a float step and losing the last pass.'],
        ['Memadam elemen semasa berulang ke hadapan.', 'Removing elements while iterating forwards.'],
        ['Menggunakan pemboleh ubah gelung selepas `end`.', 'Using the loop variable after `end`.'],
      )),
    S('debugging',
      P('Jika gelung `for` tidak berjalan sama sekali, semak arah: mula, had dan tanda langkah mesti konsisten. Jika ia berjalan satu kali kurang atau lebih, semak sama ada had termasuk dan sama ada langkah float terlibat. Had yang bukan nombor — biasanya input yang belum ditukar — menghasilkan ralat sebelum pusingan pertama:',
        'If a `for` loop does not run at all, check the direction: the start, the limit and the step’s sign must agree. If it runs one time too few or too many, check whether the limit is inclusive and whether a float step is involved. A limit that is not a number — usually unconverted input — produces an error before the first pass:'),
      CODE('times-table', 'lua', 'lua54', ['Sifir dengan had yang ditukar', 'A times table with a converted limit'], `
local upTo = tonumber("4")
for i = 1, upTo do
  io.write(7 * i, " ")
end
print()
`, '7 14 21 28 ', {
        debug: BUG(`
local upTo = "four"
for i = 1, upTo do
  io.write(7 * i, " ")
end
print()
`, "example:2: bad 'for' limit (number expected, got string)",
          'Had ialah teks `"four"` (contohnya daripada input pengguna). Lua 5.4 cuba menukar had kepada nombor — string berangka seperti `"4"` sebenarnya diterima — tetapi `"four"` tidak boleh ditukar, jadi gelung gagal sebelum pusingan pertama. Mesej menyebut jenis yang dijangka dan yang diterima. Jangan bergantung pada penukaran automatik: tukar input dengan `tonumber` dahulu dan semak hasilnya, seperti versi asal.',
          'The limit is the text `"four"` (for example from user input). Lua 5.4 tries to convert the limit to a number — a numeric string such as `"4"` is actually accepted — but `"four"` cannot be converted, so the loop fails before its first pass. The message states the expected and the received type. Do not rely on automatic conversion: convert input with `tonumber` first and check the result, as in the original version.'),
      }),
      EXPLAIN('times-table',
        ['1', 'Teks ditukar kepada nombor.', 'The text is converted to a number.'],
        ['2–4', 'Empat gandaan pertama 7.', 'The first four multiples of 7.'],
        ['5', 'Tamatkan baris.', 'End the line.'])),
    S('performance',
      P('`for` berangka dengan integer ialah gelung paling pantas dalam Lua: pengira disediakan sekali, dan setiap pusingan hanya menambah dan membandingkan. Jika badan memanggil `#t` setiap pusingan, simpan panjang dalam local sebelum gelung — atau letakkannya dalam had, yang dinilai sekali sahaja.',
        'An integer numeric `for` is the fastest loop in Lua: the counter is prepared once, and every pass only adds and compares. If the body calls `#t` on every pass, store the length in a local before the loop — or put it in the limit, which is evaluated only once.')),
    S('software_engineering',
      P('Memadam semasa berulang ke hadapan ialah pepijat klasik:', 'Removing while iterating forwards is a classic bug:'),
      CODE('poor-forward-remove', 'lua', 'lua54', ['Pelaksanaan lemah: memadam ke hadapan', 'Poor implementation: removing forwards'], `
local scores = {40, 75, 30, 20, 90}
local i = 1
while i <= #scores do
  if scores[i] < 50 then table.remove(scores, i) end
  i = i + 1
end
print(table.concat(scores, " "))
`, '75 20 90'),
      EXPLAIN('poor-forward-remove',
        ['1–6', 'Apabila 30 dibuang di kedudukan 3, 20 beralih ke kedudukan 3 — tetapi `i` sudah naik ke 4, jadi 20 **terlepas**.', 'When 30 is removed at position 3, 20 shifts into position 3 — but `i` has already moved to 4, so 20 is **skipped**.'],
        ['7', 'Markah 20 masih ada: pepijat senyap.', 'The score 20 is still there: a silent bug.']),
      CODE('improved-filter-new', 'lua', 'lua54', ['Pelaksanaan lebih baik: bina senarai baharu', 'Improved implementation: build a new list'], `
local scores = {40, 75, 30, 20, 90}
local passing = {}
for i = 1, #scores do
  if scores[i] >= 50 then
    passing[#passing + 1] = scores[i]
  end
end
print(table.concat(passing, " "))
`, '75 90'),
      EXPLAIN('improved-filter-new',
        ['1–2', 'Senarai asal dan senarai keputusan baharu.', 'The original list and a new result list.'],
        ['3–7', 'Senarai asal tidak diubah semasa berulang, jadi tiada elemen yang beralih atau terlepas.', 'The original is not modified while iterating, so no element shifts or is skipped.'],
        ['8', 'Keputusan betul; senarai asal juga kekal untuk kegunaan lain.', 'The correct result; the original list is also kept for other uses.']),
      P('Dua penyelesaian yang betul: berulang ke belakang (`remove-backwards`) apabila anda mesti mengubah senarai di tempatnya, atau membina senarai baharu apabila anda boleh — yang kedua lebih mudah dibaca dan tidak merosakkan data asal.', 'Two correct solutions: iterate backwards (`remove-backwards`) when you must modify the list in place, or build a new list when you can — the second is easier to read and keeps the original data intact.')),
    S('industry_use_cases',
      UL(
        ['Melukis grid dan peta jubin: `for row = 1, height do for col = 1, width do … end end`.', 'Drawing grids and tile maps: `for row = 1, height do for col = 1, width do … end end`.'],
        ['Laporan berkala: `for year = 2020, 2030 do … end`.', 'Periodic reports: `for year = 2020, 2030 do … end`.'],
        ['Animasi: `for frame = 1, totalFrames do … end`.', 'Animation: `for frame = 1, totalFrames do … end`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `for-ranges` dan tulis gelung yang memaparkan 100, 75, 50, 25, 0.', 'Run `for-ranges` and write a loop that displays 100, 75, 50, 25, 0.'],
        ['Jalankan versi berpepijat `loop-variable-local` dan `times-table`.', 'Run the buggy `loop-variable-local` and `times-table`.'],
        ['Ubah `poor-forward-remove` dengan input `{10, 20, 30}` dan ramalkan output.', 'Change `poor-forward-remove` to the input `{10, 20, 30}` and predict the output.'],
      )),
    S('mini_project',
      P('**Jadual sifir yang diformat.** Cetak jadual darab 1–5 dengan lajur yang sejajar menggunakan gelung bersarang dan `string.format`.', '**A formatted multiplication table.** Print a 1–5 multiplication table with aligned columns using nested loops and `string.format`.'),
      CODE('times-grid', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local N = 5
for row = 1, N do
  local cells = {}
  for col = 1, N do
    cells[col] = string.format("%3d", row * col)
  end
  print(table.concat(cells))
end
`, '  1  2  3  4  5\n  2  4  6  8 10\n  3  6  9 12 15\n  4  8 12 16 20\n  5 10 15 20 25'),
      EXPLAIN('times-grid',
        ['1', 'Saiz jadual.', 'The table size.'],
        ['2–3', 'Satu baris bagi setiap `row`; senarai sel baharu untuk setiap baris.', 'One line per `row`; a new cell list for each line.'],
        ['4–6', 'Gelung dalaman mengisi setiap sel; `%3d` menjajarkan nombor dalam lebar 3.', 'The inner loop fills each cell; `%3d` right-aligns numbers in a width of 3.'],
        ['7', 'Cantumkan sel tanpa pemisah (lebar sudah menyediakan ruang).', 'Join the cells with no separator (the width already provides spacing).'])),
    S('summary',
      UL(
        ['`for i = mula, had, langkah` — had termasuk; langkah lalai 1; langkah negatif mengira ke bawah.', '`for i = start, limit, step` — the limit is inclusive; the default step is 1; a negative step counts down.'],
        ['Mula, had dan langkah dinilai sekali; pemboleh ubah gelung ialah salinan local.', 'Start, limit and step are evaluated once; the loop variable is a local copy.'],
        ['Langkah sifar dan had bukan nombor ialah ralat; langkah float boleh kehilangan pusingan.', 'A zero step and a non-numeric limit are errors; float steps can lose passes.'],
        ['Jangan padam semasa berulang ke hadapan — berulang ke belakang atau bina senarai baharu.', 'Do not remove while iterating forwards — iterate backwards or build a new list.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah nilai yang dihasilkan oleh `for i = 2, 11, 3`?', 'Which values does `for i = 2, 11, 3` produce?'],
        ['Berapa kali `for i = 1, 0` dijalankan?', 'How many times does `for i = 1, 0` run?'],
        ['Mengapakah menukar `limit` di dalam badan tidak memanjangkan gelung?', 'Why does changing `limit` inside the body not extend the loop?'],
        ['Bagaimanakah anda berulang dari 0.0 hingga 1.0 dalam lima langkah yang tepat?', 'How do you iterate from 0.0 to 1.0 in five exact steps?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.3.5 — For Statement', url: `${MANUAL}#3.3.5` },
        { title: 'Programming in Lua (1st ed.) — 4.3.4 Numeric for', url: `${PIL}/4.3.4.html` },
        { title: 'Lua 5.4 Reference Manual — table.remove', url: `${MANUAL}#pdf-table.remove` },
        { title: 'What Every Programmer Should Know About Floating-Point Arithmetic', url: 'https://floating-point-gui.de/' },
      )),
  ],
};

export const LUA103_M2 = [LUA103_2_1, LUA103_2_2, LUA103_2_3];
