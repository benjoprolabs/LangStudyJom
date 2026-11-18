import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA104 · Module 1 — Function Basics (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 1.1 function, parameters and return ───────────────────────────────────

export const LUA104_1_1: LectureContentDef = {
  courseCode: 'LUA104',
  module: 1,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Mentakrif fungsi dengan `local function nama(parameter) … end`.', 'Define functions with `local function name(parameters) … end`.'],
        ['Membezakan [[parameter|parameter dan argumen]].', 'Distinguish [[parameter|parameters and arguments]].'],
        ['Menggunakan `return` untuk memulangkan nilai dan untuk keluar awal.', 'Use `return` to give back a value and to leave early.'],
        ['Memecahkan kod berulang kepada fungsi kecil yang boleh digunakan semula.', 'Break repeated code into small reusable functions.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['LUA101–LUA103: pemboleh ubah `local`, operator, syarat dan gelung.', 'LUA101–LUA103: `local` variables, operators, conditions and loops.'],
        ['Anda telah **memanggil** fungsi seperti `print` dan `math.floor`; kini anda akan **menulis** fungsi sendiri.', 'You have **called** functions such as `print` and `math.floor`; now you will **write** your own.'],
      )),
    S('introduction',
      P('Fungsi ialah unit utama penyusunan program Lua. Ia memberi nama kepada sekumpulan langkah, supaya langkah itu boleh digunakan berulang kali dengan input berbeza tanpa menyalin kod. Program besar — permainan, pelayan web, plugin editor — terdiri daripada ratusan fungsi kecil, setiap satu melakukan satu kerja dengan baik. Kursus LUA104 bermula dengan bentuk paling asas: definisi, parameter dan `return`.',
        'Functions are the main unit of Lua program organisation. A function gives a name to a group of steps, so those steps can be used repeatedly with different inputs without copying code. Large programs — games, web servers, editor plugins — consist of hundreds of small functions, each doing one job well. LUA104 begins with the most basic form: definition, parameters and `return`.'),
      KEY('Fungsi = nama + parameter + badan + nilai pulangan. Takrif sekali, panggil berkali-kali.', 'Function = name + parameters + body + return value. Define once, call many times.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Definisi:** `local function area(w, h) … end` mencipta fungsi dan menyimpannya dalam local `area`.', '**Definition:** `local function area(w, h) … end` creates a function and stores it in the local `area`.'],
        ['**Parameter:** `w` dan `h` — local di dalam fungsi, diberi nilai daripada argumen.', '**Parameters:** `w` and `h` — locals inside the function, assigned from the arguments.'],
        ['**Panggilan:** `area(3, 4)` — argumen 3 dan 4 disalin ke parameter, badan dijalankan.', '**Call:** `area(3, 4)` — the arguments 3 and 4 are copied into the parameters, the body runs.'],
        ['**return:** menamatkan fungsi dan menghantar nilai kembali kepada pemanggil.', '**return:** ends the function and sends a value back to the caller.'],
        ['Fungsi tanpa `return` memulangkan **tiada nilai**.', 'A function without `return` returns **no values**.'],
      )),
    S('detailed_theory',
      P('Apabila fungsi dipanggil, Lua mencipta **bingkai** baharu pada timbunan panggilan (call stack). Bingkai itu menyimpan parameter dan pemboleh ubah local fungsi. Argumen dinilai dahulu, dari kiri ke kanan, kemudian nilainya disalin ke dalam parameter. Badan dijalankan sehingga `return` atau `end`; kemudian bingkai dibuang, dan pelaksanaan diteruskan di tempat panggilan dengan nilai yang dipulangkan. Kerana setiap panggilan mempunyai bingkai sendiri, local dalam satu panggilan tidak pernah mengganggu panggilan lain.',
        'When a function is called, Lua creates a new **frame** on the call stack. The frame holds the function’s parameters and local variables. The arguments are evaluated first, left to right, then their values are copied into the parameters. The body runs until a `return` or the `end`; then the frame is discarded, and execution continues at the call site with the returned values. Because every call has its own frame, the locals of one call never interfere with another call.'),
      P('Dalam Lua, definisi fungsi ialah **pernyataan yang dijalankan**, bukan pengisytiharan yang diproses lebih awal seperti dalam sesetengah bahasa. Fungsi hanya wujud selepas baris definisinya dilaksanakan; memanggilnya lebih awal memberi ralat `attempt to call a nil value`. `return` mesti menjadi pernyataan terakhir dalam bloknya — Lua menolak kod selepas `return` dalam blok yang sama kerana kod itu tidak akan pernah dijalankan. Gunakan `local function` secara lalai, supaya fungsi tidak mencemari ruang nama global.',
        'In Lua, a function definition is an **executed statement**, not a declaration processed in advance as in some languages. A function only exists after its definition line has run; calling it earlier gives `attempt to call a nil value`. `return` must be the last statement in its block — Lua rejects code after `return` in the same block because that code could never run. Use `local function` by default, so functions do not pollute the global namespace.')),
    S('technical_terminology', TERMS('function', 'parameter', 'call-stack', 'scope')),
    S('syntax_rules',
      UL(
        ['`local function nama(p1, p2) badan end`', '`local function name(p1, p2) body end`'],
        ['`return ungkapan` — mesti pernyataan terakhir dalam bloknya.', '`return expression` — must be the last statement in its block.'],
        ['Panggilan: `nama(arg1, arg2)`; kurungan wajib walaupun tiada argumen: `nama()`.', 'Call: `name(arg1, arg2)`; parentheses are required even with no arguments: `name()`.'],
        ['Untuk keluar awal di tengah blok, gunakan `if syarat then return end`.', 'To leave early in the middle of a block, use `if condition then return end`.'],
      )),
    S('code_demonstration',
      CODE('rect-area', 'lua', 'lua54', ['Fungsi pertama dengan dua parameter', 'A first function with two parameters'], `
local function area(width, height)
  local result = width * height
  return result
end

print(area(3, 4))
print(area(2.5, 2))
local total = area(10, 5) + area(1, 1)
print(total)
`, '12\n5.0\n51', {
        debug: BUG(`
local function area(width, height)
  return width * height
end

print(aera(3, 4))
`, "example:5: attempt to call a nil value (global 'aera')",
          'Nama fungsi tersalah eja: `aera` dan bukan `area`. Lua mencari pemboleh ubah global `aera`, yang tidak wujud (`nil`), dan memanggil `nil` ialah ralat. Perkataan `global` dalam mesej ialah petunjuk: anda menjangka local `area`, tetapi Lua melihat nama lain. Pembetulan: eja nama dengan tepat.',
          'The function name is misspelled: `aera` instead of `area`. Lua looks up a global variable `aera`, which does not exist (`nil`), and calling `nil` is an error. The word `global` in the message is the clue: you expected the local `area`, but Lua saw a different name. Fix: spell the name exactly.'),
      }),
      EXPLAIN('rect-area',
        ['1', 'Takrif fungsi local `area` dengan dua parameter.', 'Define the local function `area` with two parameters.'],
        ['2', '`result` ialah local fungsi — ia hilang apabila fungsi tamat.', '`result` is a local of the function — it disappears when the function ends.'],
        ['3', 'Hantar hasil kembali kepada pemanggil.', 'Send the result back to the caller.'],
        ['6', 'Panggilan: 3 masuk ke `width`, 4 ke `height`.', 'A call: 3 goes into `width`, 4 into `height`.'],
        ['7', '2.5 × 2 ialah float, jadi hasilnya dicetak sebagai `5.0` (LUA102 2.2).', '2.5 × 2 is a float, so the result prints as `5.0` (LUA102 2.2).'],
        ['8–9', 'Panggilan ialah ungkapan: hasilnya boleh digunakan dalam aritmetik — 50 + 1.', 'A call is an expression: its result can be used in arithmetic — 50 + 1.'])),
    S('complete_examples',
      CODE('early-return', 'lua', 'lua54', ['return awal untuk input tidak sah', 'An early return for invalid input'], `
local function grade(score)
  if score < 0 or score > 100 then
    return "invalid"
  end
  if score >= 50 then
    return "pass"
  end
  return "fail"
end

print(grade(75), grade(30), grade(120))
`, 'pass\tfail\tinvalid', {
        debug: BUG(`
local function grade(score)
  local result = "fail"
  if score >= 50 then
    result = "pass"
  return result
end
`, "example:6: 'end' expected (to close 'function' at line 1) near <eof>",
          '`end` untuk `if` tertinggal. Lua menganggap `return result` sebahagian daripada blok `if`, dan `end` pada baris 6 menutup `if` — bukan fungsi. Fungsi tidak pernah ditutup, jadi Lua sampai ke hujung fail (`<eof>`) dan melaporkan blok yang masih terbuka: `function at line 1`. Kira pasangan `if`/`end` dari atas; inden yang betul menjadikan kesilapan ini jelas.',
          'The `end` for the `if` is missing. Lua treats `return result` as part of the `if` block, and the `end` on line 6 closes the `if` — not the function. The function is never closed, so Lua reaches the end of the file (`<eof>`) and reports the block still open: `function at line 1`. Count `if`/`end` pairs from the top; correct indentation makes this mistake obvious.'),
      }),
      EXPLAIN('early-return',
        ['1', 'Fungsi dengan satu parameter.', 'A function with one parameter.'],
        ['2–4', 'Klausa pengawal: input di luar julat ditolak serta-merta, dan baki fungsi tidak dijalankan.', 'A guard clause: out-of-range input is rejected immediately, and the rest of the function does not run.'],
        ['5–7', 'Jika lulus, pulang "pass".', 'If passing, return "pass".'],
        ['8', 'Hanya dicapai apabila tiada `return` sebelumnya dijalankan.', 'Only reached when no earlier `return` ran.'],
        ['11', 'Tiga panggilan dalam satu `print`, satu bagi setiap cabang.', 'Three calls in one `print`, one for each branch.']),
      CODE('no-return', 'lua', 'lua54', ['Fungsi tanpa return', 'A function without return'], `
local function announce(name)
  print("Welcome, " .. name)
end

local value = announce("Aisyah")
print(value)
print(type(value))
`, 'Welcome, Aisyah\nnil\nnil'),
      EXPLAIN('no-return',
        ['1–3', 'Fungsi ini melakukan kesan sampingan (mencetak) tetapi tidak memulangkan apa-apa.', 'This function performs a side effect (printing) but returns nothing.'],
        ['5', 'Memberi "tiada nilai" kepada pemboleh ubah menjadikannya `nil`.', 'Assigning "no value" to a variable makes it `nil`.'],
        ['6–7', '`value` ialah `nil`, jenisnya "nil".', '`value` is `nil`, its type is "nil".'])),
    S('line_by_line',
      EXPLAIN('rect-area',
        ['2–3', 'Dua baris ini boleh diringkaskan kepada `return width * height`. Local perantaraan berguna semasa belajar dan menyahpepijat, kerana anda boleh mencetak `result` sebelum memulangkannya.', 'These two lines could be shortened to `return width * height`. An intermediate local is useful while learning and debugging, because you can print `result` before returning it.']),
      EXPLAIN('early-return',
        ['3', 'Selepas `return`, tiada baris lain dalam fungsi ini dijalankan untuk panggilan tersebut — walaupun terdapat banyak lagi kod di bawah.', 'After `return`, no other line in this function runs for that call — even though more code follows below.'])),
    S('why_this_way',
      P('Mengapa fungsi? Tiga sebab: **penggunaan semula** (tulis sekali, guna di mana-mana), **penamaan** (`grade(score)` lebih mudah difahami daripada lima baris `if`), dan **pengasingan** (pepijat dalam fungsi dibaiki di satu tempat). Mengapa `local function`? Kerana global boleh ditimpa secara tidak sengaja oleh mana-mana bahagian program, dan akses local lebih pantas.',
        'Why functions? Three reasons: **reuse** (write once, use anywhere), **naming** (`grade(score)` is easier to understand than five lines of `if`), and **isolation** (a bug in a function is fixed in one place). Why `local function`? Because a global can be accidentally overwritten by any part of the program, and local access is faster.'),
      P('Tulis fungsi **apabila** anda menyalin kod buat kali kedua, **apabila** sekumpulan baris mempunyai satu tujuan yang boleh dinamakan, atau **apabila** anda mahu menguji logik secara berasingan (LUA103 4.3).', 'Write a function **when** you copy code for the second time, **when** a group of lines has one nameable purpose, or **when** you want to test logic separately (LUA103 4.3).')),
    S('execution_flow',
      OL(
        ['Baris 1–4 `rect-area`: definisi dijalankan — fungsi dicipta dan disimpan dalam `area`. Badan **belum** dijalankan.', '`rect-area` lines 1–4: the definition runs — a function is created and stored in `area`. The body has **not** run yet.'],
        ['Baris 6: `area(3, 4)` → bingkai baharu; `width = 3`, `height = 4`.', 'Line 6: `area(3, 4)` → a new frame; `width = 3`, `height = 4`.'],
        ['Baris 2–3 dijalankan; `return 12` membuang bingkai dan menghantar 12 kepada `print`.', 'Lines 2–3 run; `return 12` discards the frame and hands 12 to `print`.'],
        ['Baris 8: dua panggilan berasingan, setiap satu dengan bingkai sendiri; hasilnya ditambah.', 'Line 8: two separate calls, each with its own frame; their results are added.'],
      )),
    S('memory_behaviour',
      P('Setiap panggilan memperuntukkan bingkai pada timbunan Lua untuk parameter dan local; bingkai dibebaskan apabila fungsi pulang, jadi panggilan biasa tidak meninggalkan sisa memori. Objek fungsi itu sendiri dicipta **sekali** apabila definisi dijalankan, dan kekal selagi pemboleh ubah `area` merujuknya.',
        'Every call allocates a frame on the Lua stack for its parameters and locals; the frame is released when the function returns, so ordinary calls leave no memory behind. The function object itself is created **once** when the definition runs, and lives as long as the variable `area` refers to it.')),
    S('alternative_implementations',
      P('Fungsi yang sama boleh ditulis sebagai ungkapan fungsi tanpa nama yang diberikan kepada local — bentuk ini menunjukkan apa yang sebenarnya berlaku (kuliah 1.2):', 'The same function can be written as an anonymous function expression assigned to a local — this form shows what really happens (lecture 1.2):'),
      CODE('area-expression', 'lua', 'lua54', ['Definisi sebagai assignment', 'A definition as an assignment'], `
local square = function(side)
  return side * side
end

print(square(7), square(1.5))
`, '49\t2.25'),
      EXPLAIN('area-expression',
        ['1–3', '`function(side) … end` ialah **ungkapan** yang menghasilkan nilai fungsi; ia diberikan kepada local `square`.', '`function(side) … end` is an **expression** that produces a function value; it is assigned to the local `square`.'],
        ['5', 'Dipanggil sama seperti fungsi bernama.', 'Called just like a named function.'])),
    S('common_mistakes',
      UL(
        ['Memanggil fungsi sebelum baris definisinya dijalankan.', 'Calling a function before its definition line has run.'],
        ['Terlupa `return`, lalu menerima `nil` dan bukannya hasil.', 'Forgetting `return`, then receiving `nil` instead of the result.'],
        ['Menulis kod selepas `return` dalam blok yang sama.', 'Writing code after `return` in the same block.'],
        ['Tidak menulis `local`, lalu mencipta fungsi global yang boleh ditimpa.', 'Omitting `local`, creating a global function that can be overwritten.'],
      )),
    S('debugging',
      P('Dua ralat fungsi yang paling biasa ialah memanggil nama yang tidak wujud (salah eja, atau fungsi belum ditakrif) dan blok yang tidak ditutup. Untuk yang pertama, baca nama dalam mesej dan perkataan `global` atau `local`. Untuk yang kedua, mesej `\'end\' expected (to close \'function\' at line N)` memberitahu blok mana yang terbuka. Ralat ketiga ialah kod selepas `return`, yang Lua tolak semasa kompil:',
        'The two most common function errors are calling a name that does not exist (a typo, or a function not yet defined) and an unclosed block. For the first, read the name in the message and the word `global` or `local`. For the second, the message `\'end\' expected (to close \'function\' at line N)` tells you which block is open. A third error is code after `return`, which Lua rejects at compile time:'),
      CODE('double-it', 'lua', 'lua54', ['return sebagai pernyataan terakhir', 'return as the last statement'], `
local function double(x)
  local doubled = x * 2
  print("doubling " .. x)
  return doubled
end

print(double(21))
`, 'doubling 21\n42', {
        debug: BUG(`
local function double(x)
  return x * 2
  print("doubled " .. x)
end
`, "example:3: 'end' expected (to close 'function' at line 1) near 'print'",
          '`return` mesti menjadi pernyataan terakhir dalam blok. Selepas `return x * 2`, Lua menjangka `end` (penutup fungsi), tetapi menemui `print` pada baris 3. Kod selepas `return` tidak akan pernah dijalankan, jadi Lua menganggapnya kesilapan. Alihkan `print` sebelum `return`, seperti versi asal.',
          '`return` must be the last statement in a block. After `return x * 2`, Lua expects `end` (closing the function), but finds `print` on line 3. Code after `return` could never run, so Lua treats it as a mistake. Move the `print` before the `return`, as in the original version.'),
      }),
      EXPLAIN('double-it',
        ['1–2', 'Kira hasil dahulu.', 'Compute the result first.'],
        ['3', 'Kesan sampingan (mesej) **sebelum** `return`.', 'The side effect (a message) **before** the `return`.'],
        ['4', '`return` ialah pernyataan terakhir badan fungsi.', '`return` is the last statement of the function body.'],
        ['7', 'Mesej dicetak dahulu, kemudian hasilnya.', 'The message prints first, then the result.'])),
    S('performance',
      P('Panggilan fungsi dalam Lua murah — kira-kira puluhan nanosaat — jadi jangan mengelak fungsi kerana prestasi. Dalam gelung yang sangat ketat (jutaan pusingan), panggilan boleh menjadi kos yang ketara; ukur dahulu sebelum mengoptimumkan. Fungsi `local` lebih pantas dipanggil daripada fungsi global kerana tiada carian table global.',
        'Function calls in Lua are cheap — on the order of tens of nanoseconds — so do not avoid functions for performance. In very tight loops (millions of passes), calls can become a noticeable cost; measure before optimising. `local` functions are faster to call than global ones because there is no global-table lookup.')),
    S('software_engineering',
      P('Kod yang disalin ialah tanda fungsi yang belum ditulis:', 'Copied code is the sign of a function not yet written:'),
      CODE('poor-copy-paste', 'lua', 'lua54', ['Pelaksanaan lemah: formula disalin tiga kali', 'Poor implementation: a formula copied three times'], `
local c1, c2, c3 = 0, 37, 100
print(c1 .. "C = " .. c1 * 9 / 5 + 32 .. "F")
print(c2 .. "C = " .. c2 * 9 / 5 + 32 .. "F")
print(c3 .. "C = " .. c3 * 9 / 5 + 32 .. "F")
`, '0C = 32.0F\n37C = 98.6F\n100C = 212.0F'),
      EXPLAIN('poor-copy-paste',
        ['1', 'Tiga suhu.', 'Three temperatures.'],
        ['2–4', 'Formula dan format disalin tiga kali. Jika formula salah, ia salah di tiga tempat; jika format berubah, tiga baris mesti disunting.', 'The formula and format are copied three times. If the formula is wrong, it is wrong in three places; if the format changes, three lines must be edited.']),
      CODE('improved-converter', 'lua', 'lua54', ['Pelaksanaan lebih baik: satu fungsi, satu gelung', 'Improved implementation: one function, one loop'], `
local function toFahrenheit(celsius)
  return celsius * 9 / 5 + 32
end

for _, c in ipairs({0, 37, 100}) do
  print(c .. "C = " .. toFahrenheit(c) .. "F")
end
`, '0C = 32.0F\n37C = 98.6F\n100C = 212.0F'),
      EXPLAIN('improved-converter',
        ['1–3', 'Formula di satu tempat, dengan nama yang menerangkan tujuannya.', 'The formula in one place, with a name that explains its purpose.'],
        ['5–7', 'Gelung menggantikan baris yang disalin; menambah suhu baharu hanya menambah satu nilai.', 'A loop replaces the copied lines; adding a new temperature only adds one value.'])),
    S('industry_use_cases',
      UL(
        ['Setiap plugin Neovim terdiri daripada fungsi Lua kecil yang dipanggil oleh editor.', 'Every Neovim plugin consists of small Lua functions called by the editor.'],
        ['Skrip konfigurasi pelayan (OpenResty, HAProxy) mendaftarkan fungsi Lua sebagai pengendali permintaan.', 'Server configuration scripts (OpenResty, HAProxy) register Lua functions as request handlers.'],
        ['Enjin permainan memanggil fungsi seperti `update(dt)` dan `draw()` pada setiap bingkai.', 'Game engines call functions such as `update(dt)` and `draw()` on every frame.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis `perimeter(width, height)` dan gunakannya bersama `area`.', 'Write `perimeter(width, height)` and use it together with `area`.'],
        ['Tambah cabang "excellent" untuk markah ≥ 80 dalam `early-return`. Di manakah ia mesti diletakkan?', 'Add an "excellent" branch for scores ≥ 80 in `early-return`. Where must it go?'],
        ['Jalankan ketiga-tiga versi berpepijat dan baca setiap mesej.', 'Run all three buggy versions and read each message.'],
      )),
    S('mini_project',
      P('**Kalkulator BMI dengan fungsi.** Pecahkan pengiraan kepada fungsi kecil: kira BMI, klasifikasikan, dan format laporan.', '**A BMI calculator with functions.** Break the calculation into small functions: compute the BMI, classify it, and format a report.'),
      CODE('bmi-functions', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function bmi(weightKg, heightM)
  return weightKg / (heightM * heightM)
end

local function category(value)
  if value < 18.5 then return "underweight" end
  if value < 25 then return "normal" end
  return "overweight"
end

local function report(name, weightKg, heightM)
  local value = bmi(weightKg, heightM)
  return string.format("%s: %.1f (%s)", name, value, category(value))
end

print(report("Ali", 70, 1.75))
print(report("Mei", 50, 1.68))
`, 'Ali: 22.9 (normal)\nMei: 17.7 (underweight)'),
      EXPLAIN('bmi-functions',
        ['1–3', 'Satu formula, satu fungsi.', 'One formula, one function.'],
        ['5–9', 'Klasifikasi dengan `return` awal — susunan syarat dari kecil ke besar.', 'Classification with early `return`s — conditions ordered from small to large.'],
        ['11–14', 'Fungsi peringkat atas menggabungkan dua fungsi lain; `%.1f` membundarkan kepada satu tempat perpuluhan.', 'A top-level function combining the other two; `%.1f` rounds to one decimal place.'],
        ['16–17', 'Dua laporan, setiap satu satu baris.', 'Two reports, one line each.'])),
    S('summary',
      UL(
        ['`local function nama(p) … end` mentakrif fungsi; definisi ialah pernyataan yang dijalankan.', '`local function name(p) … end` defines a function; a definition is an executed statement.'],
        ['Argumen disalin ke parameter; parameter ialah local.', 'Arguments are copied into parameters; parameters are locals.'],
        ['`return` menghantar nilai kembali dan menamatkan fungsi; ia mesti terakhir dalam bloknya.', '`return` sends a value back and ends the function; it must be last in its block.'],
        ['Kod berulang → fungsi.', 'Repeated code → a function.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah perbezaan antara parameter dan argumen?', 'What is the difference between a parameter and an argument?'],
        ['Apakah yang dipulangkan oleh fungsi tanpa `return`?', 'What does a function without `return` give back?'],
        ['Mengapakah memanggil fungsi sebelum definisinya gagal dalam Lua?', 'Why does calling a function before its definition fail in Lua?'],
        ['Bagaimanakah anda keluar awal daripada fungsi di tengah badannya?', 'How do you leave a function early in the middle of its body?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.4.11 — Function Definitions', url: `${MANUAL}#3.4.11` },
        { title: 'Lua 5.4 Reference Manual §3.4.10 — Function Calls', url: `${MANUAL}#3.4.10` },
        { title: 'Programming in Lua (1st ed.) — 5 Functions', url: `${PIL}/5.html` },
        { title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures (return)', url: `${MANUAL}#3.3.4` },
      )),
  ],
};

// ─── 1.2 Functions as first-class values ───────────────────────────────────

export const LUA104_1_2: LectureContentDef = {
  courseCode: 'LUA104',
  module: 1,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan bahawa fungsi Lua ialah [[first-class-function|nilai kelas pertama]].', 'Explain that Lua functions are [[first-class-function|first-class values]].'],
        ['Menyimpan fungsi dalam pemboleh ubah dan table, dan menghantarnya sebagai argumen.', 'Store functions in variables and tables, and pass them as arguments.'],
        ['Menulis [[higher-order-function|fungsi peringkat tinggi]] dan menggunakan `table.sort` dengan pembanding.', 'Write [[higher-order-function|higher-order functions]] and use `table.sort` with a comparator.'],
        ['Membezakan `f` (nilai fungsi) daripada `f()` (hasil panggilan).', 'Distinguish `f` (the function value) from `f()` (the result of a call).'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1: definisi, parameter dan `return`.', 'Lecture 1.1: definitions, parameters and `return`.'],
        ['LUA102 2.3: lapan jenis Lua, termasuk `function`.', 'LUA102 2.3: Lua’s eight types, including `function`.'],
      )),
    S('introduction',
      P('Dalam Lua, fungsi ialah **nilai** — sama seperti nombor atau string. Anda boleh menyimpannya dalam pemboleh ubah, meletakkannya dalam table, menghantarnya kepada fungsi lain, dan memulangkannya. Idea ini, yang datang daripada pengaturcaraan fungsian, ialah salah satu sebab Lua begitu fleksibel walaupun bahasanya kecil: banyak ciri yang memerlukan sintaks khas dalam bahasa lain hanyalah fungsi yang dihantar ke sana ke mari dalam Lua.',
        'In Lua, a function is a **value** — just like a number or a string. You can store it in a variable, put it in a table, pass it to another function, and return it. This idea, which comes from functional programming, is one reason Lua is so flexible despite being a small language: many features that need special syntax in other languages are just functions passed around in Lua.'),
      KEY('`f` ialah fungsi itu sendiri; `f()` menjalankannya dan memberi hasilnya.', '`f` is the function itself; `f()` runs it and gives its result.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`function nama() end` ialah gula sintaks untuk `nama = function() end`.', '`function name() end` is syntactic sugar for `name = function() end`.'],
        ['`type(f)` ialah "function"; fungsi dibandingkan mengikut rujukan.', '`type(f)` is "function"; functions compare by reference.'],
        ['Fungsi dalam table: `ops.add = function(a, b) … end` — asas modul dan objek.', 'Functions in tables: `ops.add = function(a, b) … end` — the basis of modules and objects.'],
        ['Fungsi peringkat tinggi menerima atau memulangkan fungsi.', 'Higher-order functions take or return functions.'],
        ['Fungsi tanpa nama (anonymous) ditulis terus di tempat ia diperlukan.', 'Anonymous functions are written directly where they are needed.'],
      )),
    S('detailed_theory',
      P('Secara dalaman, semua fungsi Lua tidak bernama. Apabila anda menulis `local function greet() … end`, Lua mencipta objek fungsi dan memberikannya kepada local `greet` — nama hanyalah pemboleh ubah yang memegang rujukan. Oleh itu, dua pemboleh ubah boleh merujuk fungsi yang sama, dan `==` antara fungsi membandingkan identiti objek, bukan kodnya. Fungsi yang sama sekali dengan kod yang serupa tetapi dicipta dua kali ialah dua objek berbeza.',
        'Internally, all Lua functions are anonymous. When you write `local function greet() … end`, Lua creates a function object and assigns it to the local `greet` — the name is just a variable holding a reference. So two variables can refer to the same function, and `==` between functions compares object identity, not code. Two functions with identical code created twice are two different objects.'),
      P('Kerana fungsi ialah nilai, tingkah laku boleh dijadikan **parameter**. `table.sort(list, cmp)` tidak tahu cara membandingkan rekod pelajar anda; anda memberinya fungsi `cmp(a, b)` yang memulangkan `true` jika `a` patut datang sebelum `b`. Corak ini — mengasingkan "apa yang dilakukan" daripada "bagaimana keputusan dibuat" — muncul di mana-mana: panggilan balik (callback) acara, penapis, pemeta, dan table penghantaran (dispatch table) yang menggantikan rantaian `elseif` yang panjang.',
        'Because functions are values, behaviour can become a **parameter**. `table.sort(list, cmp)` does not know how to compare your student records; you give it a function `cmp(a, b)` that returns `true` if `a` should come before `b`. This pattern — separating "what is done" from "how decisions are made" — appears everywhere: event callbacks, filters, mappers, and dispatch tables that replace long `elseif` chains.')),
    S('technical_terminology', TERMS('first-class-function', 'higher-order-function', 'function', 'table')),
    S('syntax_rules',
      UL(
        ['Ungkapan fungsi: `function(p) … end` — boleh muncul di mana-mana ungkapan dibenarkan.', 'Function expression: `function(p) … end` — may appear anywhere an expression is allowed.'],
        ['Hantar fungsi tanpa kurungan: `apply(double, 3)`, **bukan** `apply(double(), 3)`.', 'Pass a function without parentheses: `apply(double, 3)`, **not** `apply(double(), 3)`.'],
        ['Pembanding `table.sort`: `function(a, b) return a < b end` — mesti "kurang daripada" yang ketat.', '`table.sort` comparator: `function(a, b) return a < b end` — must be a strict "less than".'],
      )),
    S('code_demonstration',
      CODE('function-values', 'lua', 'lua54', ['Fungsi dalam pemboleh ubah dan table', 'Functions in variables and tables'], `
local function shout(text)
  return text:upper() .. "!"
end

local alias = shout
print(alias("hello"))
print(type(shout), alias == shout)

local actions = {loud = shout, quiet = string.lower}
print(actions.loud("go"), actions.quiet("STOP"))
`, 'HELLO!\nfunction\ttrue\nGO!\tstop'),
      EXPLAIN('function-values',
        ['1–3', 'Fungsi biasa.', 'An ordinary function.'],
        ['5–6', '`alias` menerima **rujukan** kepada fungsi yang sama — tiada salinan kod.', '`alias` receives a **reference** to the same function — no copy of the code.'],
        ['7', 'Jenisnya "function"; kedua-dua nama merujuk objek yang sama.', 'Its type is "function"; both names refer to the same object.'],
        ['9–10', 'Fungsi sebagai nilai dalam table, termasuk fungsi pustaka `string.lower`.', 'Functions as table values, including the library function `string.lower`.'])),
    S('complete_examples',
      CODE('apply-twice', 'lua', 'lua54', ['Fungsi peringkat tinggi', 'A higher-order function'], `
local function applyToAll(list, fn)
  local out = {}
  for i, v in ipairs(list) do
    out[i] = fn(v)
  end
  return out
end

local function double(n) return n * 2 end
print(table.concat(applyToAll({1, 2, 3}, double), " "))
print(table.concat(applyToAll({"a", "b"}, string.upper), " "))
`, '2 4 6\nA B', {
        debug: BUG(`
local function applyToAll(list, fn)
  local out = {}
  for i, v in ipairs(list) do out[i] = fn(v) end
  return out
end
local function double(n) return n * 2 end
print(applyToAll({1, 2, 3}, double(4)))
`, "example:3: attempt to call a number value (local 'fn')",
          '`double(4)` **memanggil** fungsi dan menghantar hasilnya, 8, sebagai `fn`. Di dalam `applyToAll`, `fn(v)` cuba memanggil nombor 8. Ralat dilaporkan pada baris 3 (tempat panggilan gagal), walaupun kesilapan dibuat pada baris 7. Hantar fungsi itu sendiri: `applyToAll({1, 2, 3}, double)`.',
          '`double(4)` **calls** the function and passes its result, 8, as `fn`. Inside `applyToAll`, `fn(v)` tries to call the number 8. The error is reported on line 3 (where the call fails), even though the mistake was made on line 7. Pass the function itself: `applyToAll({1, 2, 3}, double)`.'),
      }),
      EXPLAIN('apply-twice',
        ['1–2', '`applyToAll` menerima senarai dan **fungsi**; ia mencipta senarai hasil baharu.', '`applyToAll` receives a list and a **function**; it creates a new result list.'],
        ['3–5', 'Panggil `fn` untuk setiap elemen — `applyToAll` tidak tahu atau peduli apa yang dilakukan `fn`.', 'Call `fn` for every element — `applyToAll` neither knows nor cares what `fn` does.'],
        ['6', 'Pulangkan senarai baharu; senarai asal tidak berubah.', 'Return the new list; the original list is unchanged.'],
        ['9–11', 'Fungsi yang sama digunakan dengan dua fungsi berbeza: `double` dan `string.upper`.', 'The same function used with two different functions: `double` and `string.upper`.']),
      CODE('sort-comparator', 'lua', 'lua54', ['table.sort dengan fungsi pembanding', 'table.sort with a comparison function'], `
local students = {
  {name = "Hana", score = 72},
  {name = "Ravi", score = 88},
  {name = "Lim", score = 65},
}

table.sort(students, function(a, b)
  return a.score > b.score
end)

for rank, s in ipairs(students) do
  print(rank, s.name, s.score)
end
`, '1\tRavi\t88\n2\tHana\t72\n3\tLim\t65', {
        debug: BUG(`
local scores = {72, 88, 65}
table.sort(scores, function(a, b)
  return a.score > b.score
end)
`, "example:3: attempt to index a number value (local 'a')",
          'Pembanding ditulis untuk rekod (`a.score`), tetapi senarai mengandungi **nombor**. `table.sort` menghantar dua elemen kepada pembanding, dan mengindeks nombor 72 dengan `.score` gagal. Pembanding mesti sepadan dengan jenis elemen: untuk nombor, `return a > b`.',
          'The comparator was written for records (`a.score`), but the list holds **numbers**. `table.sort` passes two elements to the comparator, and indexing the number 72 with `.score` fails. The comparator must match the element type: for numbers, `return a > b`.'),
      }),
      EXPLAIN('sort-comparator',
        ['1–5', 'Senarai rekod pelajar.', 'A list of student records.'],
        ['7–9', 'Fungsi tanpa nama dihantar terus ke `table.sort`: "a sebelum b jika markah a lebih tinggi" — susunan menurun.', 'An anonymous function passed straight to `table.sort`: "a before b if a’s score is higher" — descending order.'],
        ['11–13', 'Kedudukan selepas pengisihan.', 'The ranking after sorting.'])),
    S('line_by_line',
      EXPLAIN('function-values',
        ['5', 'Tiada kurungan selepas `shout`: kita mengambil **nilai** fungsi, bukan memanggilnya.', 'No parentheses after `shout`: we take the function **value**, we do not call it.']),
      EXPLAIN('sort-comparator',
        ['8', 'Gunakan `>` atau `<` yang ketat. Pembanding yang memulangkan `true` untuk elemen sama (`>=`) melanggar syarat `table.sort` dan boleh menyebabkan ralat "invalid order function for sorting" dengan data tertentu.', 'Use a strict `>` or `<`. A comparator returning `true` for equal elements (`>=`) breaks `table.sort`’s contract and can cause an "invalid order function for sorting" error with some data.'])),
    S('why_this_way',
      P('Mengapa merawat fungsi sebagai nilai? Kerana ia membolehkan satu algoritma umum (isih, tapis, peta, ulang) digunakan semula untuk mana-mana jenis data dan mana-mana peraturan. Tanpa ini, anda perlu menulis `sortByScore`, `sortByName`, `sortByAge` — dengan algoritma isihan yang sama disalin setiap kali.',
        'Why treat functions as values? Because it lets one general algorithm (sort, filter, map, repeat) be reused for any data type and any rule. Without it, you would write `sortByScore`, `sortByName`, `sortByAge` — with the same sorting algorithm copied every time.'),
      P('Hantar fungsi sebagai argumen **apabila** bahagian algoritma berubah-ubah mengikut situasi; simpan fungsi dalam table **apabila** anda memilih tindakan berdasarkan nama atau kunci.', 'Pass a function as an argument **when** part of an algorithm varies by situation; store functions in a table **when** you choose an action by a name or key.')),
    S('execution_flow',
      OL(
        ['`apply-twice` baris 10: `applyToAll({1, 2, 3}, double)` — `fn` kini merujuk `double`.', '`apply-twice` line 10: `applyToAll({1, 2, 3}, double)` — `fn` now refers to `double`.'],
        ['Pusingan 1: `fn(1)` → `double(1)` → 2; disimpan dalam `out[1]`.', 'Pass 1: `fn(1)` → `double(1)` → 2; stored in `out[1]`.'],
        ['Pusingan 2 dan 3 memberi 4 dan 6; `out` dipulangkan dan dicantumkan.', 'Passes 2 and 3 give 4 and 6; `out` is returned and joined.'],
        ['Baris 11 mengulang proses dengan `fn = string.upper`.', 'Line 11 repeats the process with `fn = string.upper`.'],
      )),
    S('memory_behaviour',
      P('Menghantar atau menyimpan fungsi hanya menyalin **rujukan** — beberapa bait — bukan kod. Tetapi ungkapan `function … end` mencipta objek fungsi baharu setiap kali ia dijalankan: menulis pembanding tanpa nama di dalam gelung yang dijalankan sejuta kali mencipta sejuta objek. Jika fungsi yang sama digunakan berulang kali, takrifkannya sekali di luar gelung.',
        'Passing or storing a function copies only a **reference** — a few bytes — not the code. But a `function … end` expression creates a new function object every time it runs: writing an anonymous comparator inside a loop that runs a million times creates a million objects. If the same function is used repeatedly, define it once outside the loop.')),
    S('alternative_implementations',
      P('Table penghantaran (dispatch table) menggantikan rantaian `elseif` panjang yang memilih tindakan berdasarkan nama:', 'A dispatch table replaces a long `elseif` chain that chooses an action by name:'),
      CODE('dispatch-table', 'lua', 'lua54', ['Arahan sebagai table fungsi', 'Commands as a table of functions'], `
local commands = {
  add = function(a, b) return a + b end,
  sub = function(a, b) return a - b end,
  max = math.max,
}

local function run(name, a, b)
  local fn = commands[name]
  if fn == nil then return "unknown command: " .. name end
  return fn(a, b)
end

print(run("add", 7, 3), run("max", 7, 3), run("mul", 7, 3))
`, '10\t7\tunknown command: mul'),
      EXPLAIN('dispatch-table',
        ['1–5', 'Setiap kunci memetakan nama arahan kepada fungsi; `math.max` daripada pustaka standard digunakan terus.', 'Each key maps a command name to a function; `math.max` from the standard library is used directly.'],
        ['7–9', 'Cari fungsi mengikut nama; tangani nama yang tidak diketahui sebelum memanggil.', 'Look up the function by name; handle an unknown name before calling.'],
        ['10', 'Panggil fungsi yang dijumpai.', 'Call the function that was found.'],
        ['13', 'Menambah arahan baharu = menambah satu baris pada table, tanpa menyentuh `run`.', 'Adding a new command = adding one line to the table, without touching `run`.'])),
    S('common_mistakes',
      UL(
        ['Menulis `f()` apabila anda maksudkan `f` — menghantar hasil dan bukannya fungsi.', 'Writing `f()` when you mean `f` — passing the result instead of the function.'],
        ['Pembanding `table.sort` yang menggunakan `<=` atau `>=`.', 'A `table.sort` comparator that uses `<=` or `>=`.'],
        ['Menjangka dua fungsi dengan kod serupa adalah `==`.', 'Expecting two functions with identical code to be `==`.'],
        ['Mencipta fungsi tanpa nama yang sama di dalam gelung panas.', 'Creating the same anonymous function inside a hot loop.'],
      )),
    S('debugging',
      P('Ralat `attempt to call a X value` bermaksud sesuatu yang bukan fungsi dipanggil. Baca jenis (`nil`, `number`, `table`) dan nama: `local \'fn\'` menunjukkan parameter, `field \'run\'` menunjukkan kunci table. Kemudian jejak dari mana nilai itu datang — selalunya kurungan tambahan di tempat panggilan, atau kunci yang tersalah eja dalam table penghantaran. Contoh berikut menunjukkan kes medan table:',
        'The error `attempt to call a X value` means something that is not a function was called. Read the type (`nil`, `number`, `table`) and the name: `local \'fn\'` points to a parameter, `field \'run\'` to a table key. Then trace where the value came from — often extra parentheses at a call site, or a misspelled key in a dispatch table. The following example shows the table-field case:'),
      CODE('menu-actions', 'lua', 'lua54', ['Menu dengan tindakan', 'A menu with actions'], `
local menu = {
  start = function() return "starting" end,
  stop = function() return "stopping" end,
}
print(menu.start())
print(menu.stop())
`, 'starting\nstopping', {
        debug: BUG(`
local menu = {
  start = function() return "starting" end,
}
print(menu.run())
`, "example:4: attempt to call a nil value (field 'run')",
          'Table `menu` tiada kunci `run`, jadi `menu.run` ialah `nil`. Mesej menyebut `field \'run\'`: nama kunci yang dicari. Semak kunci yang wujud (`start`), atau semak `if menu.run then … end` sebelum memanggil apabila kunci datang daripada input pengguna.',
          'The `menu` table has no `run` key, so `menu.run` is `nil`. The message says `field \'run\'`: the name of the key that was looked up. Check which keys exist (`start`), or check `if menu.run then … end` before calling when the key comes from user input.'),
      }),
      EXPLAIN('menu-actions',
        ['1–4', 'Table dengan dua fungsi tanpa nama sebagai nilai.', 'A table with two anonymous functions as values.'],
        ['5–6', 'Cari medan, kemudian panggil — dua langkah dalam satu ungkapan.', 'Look up the field, then call it — two steps in one expression.'])),
    S('performance',
      P('Memanggil fungsi melalui pemboleh ubah, medan table atau parameter mempunyai kos yang hampir sama dengan panggilan terus. Carian medan table menambah sedikit kos; dalam gelung yang sangat ketat, simpan fungsi dalam local dahulu (`local fn = commands[name]`). `table.sort` dengan pembanding Lua lebih perlahan daripada tanpa pembanding, kerana setiap perbandingan ialah panggilan fungsi.',
        'Calling a function through a variable, a table field or a parameter costs almost the same as a direct call. A table-field lookup adds a little; in very tight loops, store the function in a local first (`local fn = commands[name]`). `table.sort` with a Lua comparator is slower than without one, because each comparison is a function call.')),
    S('software_engineering',
      P('Bandingkan rantaian syarat yang berkembang dengan table fungsi:', 'Compare a growing chain of conditions with a table of functions:'),
      CODE('poor-elseif-ops', 'lua', 'lua54', ['Pelaksanaan lemah: elseif bagi setiap operasi', 'Poor implementation: an elseif per operation'], `
local function calculate(op, a, b)
  if op == "+" then
    return a + b
  elseif op == "-" then
    return a - b
  elseif op == "*" then
    return a * b
  else
    return nil
  end
end
print(calculate("*", 6, 7), calculate("%", 6, 7))
`, '42\tnil'),
      EXPLAIN('poor-elseif-ops',
        ['1–11', 'Setiap operasi baharu menambah dua baris di tengah fungsi; senarai operasi yang disokong tersembunyi dalam logik.', 'Every new operation adds two lines in the middle of the function; the list of supported operations is hidden inside the logic.'],
        ['12', 'Operasi yang tidak disokong memberi `nil` tanpa penjelasan.', 'An unsupported operation gives `nil` without explanation.']),
      CODE('improved-op-table', 'lua', 'lua54', ['Pelaksanaan lebih baik: operasi sebagai data', 'Improved implementation: operations as data'], `
local OPS = {
  ["+"] = function(a, b) return a + b end,
  ["-"] = function(a, b) return a - b end,
  ["*"] = function(a, b) return a * b end,
}

local function calculate(op, a, b)
  local fn = OPS[op]
  if not fn then return nil, "unsupported operator " .. op end
  return fn(a, b)
end
print(calculate("*", 6, 7))
print(calculate("%", 6, 7))
`, '42\nnil\tunsupported operator %'),
      EXPLAIN('improved-op-table',
        ['1–5', 'Operasi yang disokong ialah data yang boleh dibaca sekali pandang; kunci simbol memerlukan `["+"]`.', 'The supported operations are data readable at a glance; symbol keys need `["+"]`.'],
        ['7–11', '`calculate` tidak berubah apabila operasi ditambah, dan memulangkan mesej yang jelas untuk operator tidak dikenali.', '`calculate` never changes when operations are added, and returns a clear message for an unknown operator.'],
        ['12–13', 'Kedua-dua kes.', 'Both cases.'])),
    S('industry_use_cases',
      UL(
        ['Panggilan balik (callback) acara dalam Neovim: `vim.api.nvim_create_autocmd("BufWritePost", {callback = fn})`.', 'Event callbacks in Neovim: `vim.api.nvim_create_autocmd("BufWritePost", {callback = fn})`.'],
        ['Penghala web (OpenResty, Lapis) memetakan laluan URL kepada fungsi pengendali dalam table.', 'Web routers (OpenResty, Lapis) map URL paths to handler functions in a table.'],
        ['Enjin permainan menyimpan pengendali input dalam table mengikut nama kekunci.', 'Game engines store input handlers in tables keyed by key name.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tukar `sort-comparator` supaya pelajar diisih mengikut nama (A–Z).', 'Change `sort-comparator` so students are sorted by name (A–Z).'],
        ['Tambah arahan "div" pada `dispatch-table` yang menolak pembahagian dengan sifar.', 'Add a "div" command to `dispatch-table` that rejects division by zero.'],
        ['Jalankan setiap versi berpepijat dan kenal pasti baris di mana kesilapan **dibuat** berbanding di mana ia **dilaporkan**.', 'Run each buggy version and identify the line where the mistake was **made** versus where it was **reported**.'],
      )),
    S('mini_project',
      P('**Penapis dan pemeta.** Tulis `filter(list, keep)` dan gunakannya bersama `applyToAll` untuk memproses senarai harga.', '**Filter and map.** Write `filter(list, keep)` and use it together with a map function to process a price list.'),
      CODE('filter-map', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function filter(list, keep)
  local out = {}
  for _, v in ipairs(list) do
    if keep(v) then out[#out + 1] = v end
  end
  return out
end

local function map(list, fn)
  local out = {}
  for i, v in ipairs(list) do out[i] = fn(v) end
  return out
end

local prices = {12.5, 80, 3, 45, 150}
local affordable = filter(prices, function(p) return p <= 50 end)
local withTax = map(affordable, function(p) return string.format("%.2f", p * 1.06) end)
print(table.concat(withTax, ", "))
`, '13.25, 3.18, 47.70'),
      EXPLAIN('filter-map',
        ['1–7', '`filter` menyimpan elemen yang mana `keep(v)` benar.', '`filter` keeps the elements for which `keep(v)` is true.'],
        ['9–13', '`map` menukar setiap elemen dengan `fn`.', '`map` transforms every element with `fn`.'],
        ['15–16', 'Pilih harga ≤ 50 dengan fungsi tanpa nama.', 'Select prices ≤ 50 with an anonymous function.'],
        ['17–18', 'Tambah cukai 6% dan format kepada dua tempat perpuluhan, kemudian cantum.', 'Add 6% tax and format to two decimal places, then join.'])),
    S('summary',
      UL(
        ['Fungsi ialah nilai: simpan, hantar, pulangkan.', 'Functions are values: store, pass, return.'],
        ['`function f() end` = `f = function() end`.', '`function f() end` = `f = function() end`.'],
        ['`f` ialah fungsi; `f()` ialah hasilnya — jangan keliru semasa menghantar.', '`f` is the function; `f()` is its result — do not confuse them when passing.'],
        ['Fungsi peringkat tinggi dan table penghantaran menggantikan kod berulang dan rantaian `elseif`.', 'Higher-order functions and dispatch tables replace repeated code and `elseif` chains.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah perbezaan antara `apply(f, 2)` dan `apply(f(), 2)`?', 'What is the difference between `apply(f, 2)` and `apply(f(), 2)`?'],
        ['Mengapakah pembanding `table.sort` mesti menggunakan `<` dan bukan `<=`?', 'Why must a `table.sort` comparator use `<` and not `<=`?'],
        ['Apakah yang dicetak oleh `print(function() end == function() end)`?', 'What does `print(function() end == function() end)` print?'],
        ['Bilakah table penghantaran lebih baik daripada `elseif`?', 'When is a dispatch table better than `elseif`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Programming in Lua (1st ed.) — 6 More about Functions', url: `${PIL}/6.html` },
        { title: 'Lua 5.4 Reference Manual — table.sort', url: `${MANUAL}#pdf-table.sort` },
        { title: 'Lua 5.4 Reference Manual §3.4.11 — Function Definitions', url: `${MANUAL}#3.4.11` },
        { title: 'Lua 5.4 Reference Manual §2.1 — Values and Types', url: `${MANUAL}#2.1` },
      )),
  ],
};

// ─── 1.3 More or fewer arguments than parameters ───────────────────────────

export const LUA104_1_3: LectureContentDef = {
  courseCode: 'LUA104',
  module: 1,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Meramal nilai parameter apabila argumen kurang atau lebih daripada parameter.', 'Predict parameter values when there are fewer or more arguments than parameters.'],
        ['Memberi nilai lalai dengan `x = x or lalai`, dan mengenal pasti perangkap `false`.', 'Give default values with `x = x or default`, and recognise the `false` trap.'],
        ['Mengesahkan argumen dengan `type` dan `error(mesej, 2)`.', 'Validate arguments with `type` and `error(message, 2)`.'],
        ['Menggunakan table pilihan (argumen bernama) untuk fungsi dengan banyak pilihan.', 'Use an options table (named arguments) for functions with many options.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1–1.2: definisi fungsi dan fungsi sebagai nilai.', 'Lectures 1.1–1.2: function definitions and functions as values.'],
        ['LUA102 2.1 dan LUA103 1.3: truthiness dan idiom `a and b or c`.', 'LUA102 2.1 and LUA103 1.3: truthiness and the `a and b or c` idiom.'],
      )),
    S('introduction',
      P('Banyak bahasa menolak panggilan yang bilangan argumennya tidak sepadan dengan parameter. Lua tidak: ia **melaraskan** secara senyap. Parameter tanpa argumen menjadi `nil`; argumen tambahan dibuang. Kelonggaran ini memudahkan parameter pilihan dan nilai lalai, tetapi juga bermakna kesilapan seperti terlupa argumen tidak dikesan pada panggilan — ia muncul kemudian sebagai ralat `nil` di dalam fungsi. Kuliah ini mengajar cara memanfaatkan kelonggaran itu dengan selamat.',
        'Many languages reject a call whose argument count does not match the parameters. Lua does not: it **adjusts** silently. Parameters without an argument become `nil`; extra arguments are discarded. This flexibility makes optional parameters and default values easy, but it also means mistakes such as a forgotten argument are not caught at the call — they appear later as a `nil` error inside the function. This lecture teaches how to use that flexibility safely.'),
      KEY('Argumen kurang → parameter `nil`. Argumen lebih → dibuang. Tiada amaran.', 'Fewer arguments → `nil` parameters. More arguments → discarded. No warning.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Parameter diberi nilai dari kiri ke kanan; yang tidak menerima argumen menjadi `nil`.', 'Parameters are assigned left to right; those without an argument become `nil`.'],
        ['Argumen tambahan dinilai, kemudian dibuang.', 'Extra arguments are evaluated, then discarded.'],
        ['Nilai lalai: `size = size or 10` — selamat hanya jika `false` bukan nilai yang sah.', 'Default value: `size = size or 10` — safe only if `false` is not a valid value.'],
        ['Untuk boolean, gunakan `if flag == nil then flag = true end`.', 'For booleans, use `if flag == nil then flag = true end`.'],
        ['`error(mesej, 2)` melaporkan ralat pada baris **pemanggil**.', '`error(message, 2)` reports the error at the **caller’s** line.'],
      )),
    S('detailed_theory',
      P('Pelarasan argumen mengikut peraturan yang sama seperti assignment berbilang (LUA102 1.2): senarai nilai di sebelah kanan dipadankan dengan senarai nama di sebelah kiri. Ini berlaku untuk **semua** fungsi Lua, jadi fungsi pustaka C (seperti `string.rep`) mesti menyemak argumennya sendiri — sebab itu mereka melaporkan `bad argument #2 to \'rep\' (number expected, got no value)`. Fungsi Lua anda tidak mendapat semakan ini secara automatik; tanpa pengesahan, argumen yang hilang menjadi `nil` dan ralat muncul jauh dari punca sebenar.',
        'Argument adjustment follows the same rule as multiple assignment (LUA102 1.2): the list of values on the right is matched against the list of names on the left. This applies to **all** Lua functions, so C library functions (such as `string.rep`) must check their own arguments — which is why they report `bad argument #2 to \'rep\' (number expected, got no value)`. Your Lua functions get no such checking automatically; without validation, a missing argument becomes `nil` and the error appears far from its real cause.'),
      P('Untuk fungsi awam yang digunakan oleh orang lain, sahkan argumen di permulaan fungsi. `error(mesej, 2)` menaikkan ralat dengan kedudukan **tahap 2** — baris yang memanggil fungsi anda — supaya pengguna melihat kesilapan dalam kod mereka sendiri, bukan di dalam fungsi anda. Apabila fungsi mempunyai lebih daripada tiga atau empat parameter pilihan, gantikannya dengan satu **table pilihan**: `connect{host = "x", port = 80}` lebih jelas daripada `connect("x", 80, nil, nil, true)`, dan susunan tidak lagi penting.',
        'For public functions used by others, validate the arguments at the start of the function. `error(message, 2)` raises an error with a **level 2** position — the line that called your function — so users see the mistake in their own code, not inside your function. When a function has more than three or four optional parameters, replace them with one **options table**: `connect{host = "x", port = 80}` is clearer than `connect("x", 80, nil, nil, true)`, and order no longer matters.')),
    S('technical_terminology', TERMS('parameter', 'nil', 'truthiness', 'stack-traceback')),
    S('syntax_rules',
      UL(
        ['Lalai: `param = param or nilai` di baris pertama badan.', 'Default: `param = param or value` on the first line of the body.'],
        ['Pengesahan: `if type(x) ~= "number" then error("…", 2) end`.', 'Validation: `if type(x) ~= "number" then error("…", 2) end`.'],
        ['Table pilihan: `f{a = 1}` ialah gula untuk `f({a = 1})` — kurungan boleh ditinggalkan untuk satu argumen table.', 'Options table: `f{a = 1}` is sugar for `f({a = 1})` — parentheses may be dropped for a single table argument.'],
      )),
    S('code_demonstration',
      CODE('arg-adjust', 'lua', 'lua54', ['Argumen kurang dan lebih', 'Fewer and more arguments'], `
local function show(a, b, c)
  print(a, b, c)
end

show(1, 2, 3)
show(1)
show(1, 2, 3, 4, 5)
`, '1\t2\t3\n1\tnil\tnil\n1\t2\t3'),
      EXPLAIN('arg-adjust',
        ['1–3', 'Tiga parameter, dipaparkan seperti diterima.', 'Three parameters, displayed as received.'],
        ['5', 'Padanan tepat.', 'An exact match.'],
        ['6', 'Hanya `a` menerima nilai; `b` dan `c` menjadi `nil`.', 'Only `a` receives a value; `b` and `c` become `nil`.'],
        ['7', '4 dan 5 dibuang secara senyap.', '4 and 5 are silently discarded.'])),
    S('complete_examples',
      CODE('defaults-or', 'lua', 'lua54', ['Nilai lalai dengan or', 'Default values with or'], `
local function makeBox(width, height, label)
  width = width or 10
  height = height or width
  label = label or "box"
  return string.format("%s %dx%d", label, width, height)
end

print(makeBox())
print(makeBox(4))
print(makeBox(4, 2, "door"))
`, 'box 10x10\nbox 4x4\ndoor 4x2', {
        debug: BUG(`
local function add(a, b)
  return a + b
end
print(add(5))
`, "example:2: attempt to perform arithmetic on a nil value (local 'b')",
          'Panggilan pada baris 4 hanya memberi satu argumen, jadi `b` ialah `nil`. Lua tidak mengadu pada panggilan; ralat muncul di **dalam** fungsi (baris 2), apabila `nil` digunakan. Perhatikan jurang antara punca (baris 4) dan simptom (baris 2). Berikan kedua-dua argumen, atau tetapkan lalai `b = b or 0`.',
          'The call on line 4 gives only one argument, so `b` is `nil`. Lua does not complain at the call; the error appears **inside** the function (line 2), when `nil` is used. Note the gap between the cause (line 4) and the symptom (line 2). Pass both arguments, or set a default `b = b or 0`.'),
      }),
      EXPLAIN('defaults-or',
        ['1–2', 'Jika `width` ialah `nil`, gunakan 10.', 'If `width` is `nil`, use 10.'],
        ['3', 'Lalai boleh bergantung pada parameter lain: kotak segi empat sama secara lalai.', 'A default can depend on another parameter: a square box by default.'],
        ['4', 'Label lalai.', 'A default label.'],
        ['5', '`%d` memerlukan nilai integer; semua nilai di sini integer.', '`%d` needs an integer value; all values here are integers.'],
        ['8–10', 'Tiada argumen, satu argumen, dan semua argumen.', 'No arguments, one argument, and all arguments.']),
      CODE('validate-args', 'lua', 'lua54', ['Pengesahan argumen dengan error tahap 2', 'Argument validation with a level-2 error'], `
local function repeatText(text, times)
  if type(text) ~= "string" then
    error("repeatText: text must be a string, got " .. type(text), 2)
  end
  times = times or 1
  return string.rep(text, times, " ")
end

print(repeatText("ha", 3))
print(pcall(repeatText, 42))
`, 'ha ha ha\nfalse\trepeatText: text must be a string, got number', {
        debug: BUG(`
local function check(n)
  if type(n) ~= "number" then error("number expected, got " .. type(n), 2) end
  return n
end
check("x")
`, 'example:5: number expected, got string',
          'Versi ini sengaja dibiarkan gagal untuk menunjukkan **tahap 2**: ralat dilaporkan pada baris 5 — panggilan `check("x")` — dan bukan pada baris 2 tempat `error` dipanggil. Pengguna fungsi melihat baris dalam kod mereka sendiri yang perlu dibaiki. Dengan tahap 1 (lalai), mesej akan menunjuk ke baris 2.',
          'This version is left failing on purpose to show **level 2**: the error is reported on line 5 — the call `check("x")` — not on line 2 where `error` is called. The function’s user sees the line in their own code that needs fixing. With level 1 (the default), the message would point to line 2.'),
      }),
      EXPLAIN('validate-args',
        ['1–4', 'Semak jenis argumen pertama; tolak dengan mesej yang menyebut nama fungsi dan jenis sebenar.', 'Check the first argument’s type; reject it with a message naming the function and the actual type.'],
        ['5–6', 'Lalai untuk argumen kedua; argumen ketiga `string.rep` ialah pemisah.', 'A default for the second argument; `string.rep`’s third argument is a separator.'],
        ['9', 'Panggilan sah.', 'A valid call.'],
        ['10', '`pcall` menangkap ralat supaya contoh terus berjalan (LUA213 membincangkannya). Apabila ralat ditangkap oleh `pcall`, tiada awalan kedudukan kerana tahap 2 menunjuk ke `pcall` itu sendiri, iaitu fungsi C.', '`pcall` catches the error so the example keeps running (LUA213 covers it). When `pcall` catches it, there is no position prefix, because level 2 points at `pcall` itself, a C function.'])),
    S('line_by_line',
      EXPLAIN('defaults-or',
        ['2', 'Idiom `x = x or lalai` berfungsi kerana `nil or 10` ialah 10. Tetapi `false or 10` juga 10 — jadi jangan gunakannya untuk parameter boolean.', 'The `x = x or default` idiom works because `nil or 10` is 10. But `false or 10` is also 10 — so do not use it for boolean parameters.']),
      EXPLAIN('arg-adjust',
        ['7', 'Argumen tambahan masih **dinilai** sebelum dibuang: jika ia panggilan fungsi, fungsi itu tetap dijalankan.', 'Extra arguments are still **evaluated** before being discarded: if one is a function call, that function still runs.'])),
    S('why_this_way',
      P('Mengapa Lua membenarkan argumen yang tidak sepadan? Kerana ia menjadikan parameter pilihan percuma — tiada sintaks khas untuk nilai lalai atau beban lampau (overloading). Kosnya ialah tanggungjawab: penulis fungsi mesti memutuskan apa yang berlaku apabila argumen hilang, sama ada dengan lalai atau dengan ralat yang jelas.',
        'Why does Lua allow mismatched arguments? Because it makes optional parameters free — no special syntax for defaults or overloading. The cost is responsibility: the function’s author must decide what happens when an argument is missing, either with a default or with a clear error.'),
      P('Gunakan lalai `or` **apabila** parameter benar-benar pilihan dan tidak boleh `false`; gunakan pengesahan dengan `error(…, 2)` **apabila** argumen wajib dan fungsi digunakan oleh kod lain; gunakan table pilihan **apabila** terdapat banyak pilihan.', 'Use an `or` default **when** a parameter is truly optional and cannot be `false`; use validation with `error(…, 2)` **when** an argument is required and the function is used by other code; use an options table **when** there are many options.')),
    S('execution_flow',
      OL(
        ['`makeBox(4)`: `width = 4`, `height = nil`, `label = nil`.', '`makeBox(4)`: `width = 4`, `height = nil`, `label = nil`.'],
        ['Baris 2: `4 or 10` → 4.', 'Line 2: `4 or 10` → 4.'],
        ['Baris 3: `nil or width` → 4.', 'Line 3: `nil or width` → 4.'],
        ['Baris 4: `nil or "box"` → "box"; hasil "box 4x4".', 'Line 4: `nil or "box"` → "box"; the result is "box 4x4".'],
      )),
    S('memory_behaviour',
      P('Parameter yang tidak menerima argumen masih mempunyai slot dalam bingkai fungsi, diisi dengan `nil`. Argumen tambahan diletakkan pada timbunan sementara dan dibuang apabila panggilan bermula. Table pilihan mencipta table baharu pada setiap panggilan — tidak menjadi masalah untuk fungsi konfigurasi, tetapi elakkan dalam gelung yang sangat panas.',
        'Parameters without an argument still have a slot in the function’s frame, filled with `nil`. Extra arguments are placed on the stack temporarily and discarded when the call starts. An options table creates a new table on every call — no problem for configuration functions, but avoid it in very hot loops.')),
    S('alternative_implementations',
      P('Untuk banyak pilihan, gunakan table pilihan (argumen bernama):', 'For many options, use an options table (named arguments):'),
      CODE('options-table', 'lua', 'lua54', ['Argumen bernama dengan table', 'Named arguments with a table'], `
local function formatPrice(opts)
  local amount = opts.amount or 0
  local currency = opts.currency or "RM"
  local decimals = opts.decimals or 2
  return string.format("%s %." .. decimals .. "f", currency, amount)
end

print(formatPrice{amount = 12.5})
print(formatPrice{amount = 99, currency = "USD", decimals = 0})
`, 'RM 12.50\nUSD 99'),
      EXPLAIN('options-table',
        ['1–4', 'Satu parameter table; setiap pilihan dibaca dengan nama dan lalainya sendiri.', 'One table parameter; each option is read by name with its own default.'],
        ['5', 'Format dibina secara dinamik: `"%s %.2f"` atau `"%s %.0f"`.', 'The format is built dynamically: `"%s %.2f"` or `"%s %.0f"`.'],
        ['8–9', 'Gula `f{…}`: pemanggil menamakan hanya pilihan yang diperlukan, dalam sebarang susunan.', 'The `f{…}` sugar: the caller names only the options needed, in any order.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan `flag = flag or true` — `false` yang dihantar dengan sengaja menjadi `true`.', 'Using `flag = flag or true` — a deliberately passed `false` becomes `true`.'],
        ['Menganggap Lua akan mengadu apabila argumen hilang.', 'Assuming Lua will complain when an argument is missing.'],
        ['Menggunakan `error(mesej)` tahap 1 untuk kesilapan pemanggil, lalu menunjuk ke baris yang salah.', 'Using level-1 `error(message)` for a caller’s mistake, pointing at the wrong line.'],
        ['Fungsi dengan lima parameter kedudukan yang kebanyakannya `nil`.', 'Functions with five positional parameters, most of them `nil`.'],
      )),
    S('debugging',
      P('Apabila ralat `nil` muncul di dalam fungsi, tanya: "adakah pemanggil memberi argumen ini?" Cetak semua parameter pada baris pertama fungsi untuk melihat apa yang sebenarnya diterima. Untuk fungsi pustaka, mesej `bad argument #N to \'nama\'` memberitahu kedudukan argumen yang salah — kira argumen dari 1. Perangkap boolean `or` tidak menghasilkan ralat sama sekali, jadi ia hanya dikesan dengan ujian:',
        'When a `nil` error appears inside a function, ask: "did the caller pass this argument?" Print all the parameters on the function’s first line to see what was actually received. For library functions, the message `bad argument #N to \'name\'` tells you the position of the wrong argument — count arguments from 1. The boolean `or` trap produces no error at all, so it is only caught by testing:'),
      CODE('boolean-default', 'lua', 'lua54', ['Lalai yang selamat untuk boolean', 'A safe default for a boolean'], `
local function connect(host, secure)
  if secure == nil then secure = true end
  return host .. (secure and " (https)" or " (http)")
end

print(connect("example.org"))
print(connect("example.org", false))
print(string.rep("-", 3))
`, 'example.org (https)\nexample.org (http)\n---', {
        debug: BUG(`
print(string.rep("ab"))
`, "example:1: bad argument #2 to 'rep' (number expected, got no value)",
          '`string.rep` memerlukan dua argumen: teks dan bilangan ulangan. Hanya satu diberi, jadi fungsi C itu melaporkan argumen **#2** dengan `got no value` — bermaksud tiada argumen langsung, berbeza daripada `got nil` apabila `nil` dihantar secara eksplisit. Tambah bilangan: `string.rep("ab", 3)`.',
          '`string.rep` needs two arguments: the text and the repeat count. Only one was given, so the C function reports argument **#2** with `got no value` — meaning no argument at all, different from `got nil` when `nil` is passed explicitly. Add the count: `string.rep("ab", 3)`.'),
      }),
      EXPLAIN('boolean-default',
        ['1–2', 'Semak `nil` secara eksplisit, supaya `false` yang dihantar dihormati.', 'Check for `nil` explicitly, so a passed `false` is respected.'],
        ['3', '`secure and … or …` selamat di sini kerana " (https)" tidak pernah palsu.', '`secure and … or …` is safe here because " (https)" is never falsy.'],
        ['6–7', 'Lalai (`true`) dan `false` yang eksplisit memberi hasil yang betul.', 'The default (`true`) and an explicit `false` give the right results.'],
        ['8', 'Panggilan `string.rep` yang betul untuk perbandingan dengan versi berpepijat.', 'A correct `string.rep` call to compare with the buggy version.'])),
    S('performance',
      P('Semakan `type` pada permulaan fungsi sangat murah berbanding kerja kebanyakan fungsi. Untuk fungsi dalaman yang dipanggil berjuta kali dengan argumen yang sudah disahkan, anda boleh melangkau pengesahan; untuk fungsi awam, kejelasan ralat lebih penting.',
        'A `type` check at the start of a function is very cheap compared with most functions’ work. For internal functions called millions of times with already-validated arguments, you may skip validation; for public functions, clear errors matter more.')),
    S('software_engineering',
      P('Perangkap lalai boolean yang biasa, dan pembetulannya:', 'The common boolean-default trap, and its fix:'),
      CODE('poor-or-default', 'lua', 'lua54', ['Pelaksanaan lemah: or untuk boolean', 'Poor implementation: or for a boolean'], `
local function saveFile(name, overwrite)
  overwrite = overwrite or true
  return name .. ": overwrite=" .. tostring(overwrite)
end

print(saveFile("notes.txt"))
print(saveFile("notes.txt", false))
`, 'notes.txt: overwrite=true\nnotes.txt: overwrite=true'),
      EXPLAIN('poor-or-default',
        ['1–3', '`false or true` ialah `true`: pemanggil tidak boleh mematikan `overwrite` langsung.', '`false or true` is `true`: the caller can never turn `overwrite` off.'],
        ['6–7', 'Kedua-dua panggilan memberi `true` — pepijat senyap yang boleh menimpa fail.', 'Both calls give `true` — a silent bug that can overwrite files.']),
      CODE('improved-nil-default', 'lua', 'lua54', ['Pelaksanaan lebih baik: semak nil', 'Improved implementation: check for nil'], `
local function saveFile(name, overwrite)
  if overwrite == nil then overwrite = true end
  return name .. ": overwrite=" .. tostring(overwrite)
end

print(saveFile("notes.txt"))
print(saveFile("notes.txt", false))
`, 'notes.txt: overwrite=true\nnotes.txt: overwrite=false'),
      EXPLAIN('improved-nil-default',
        ['1–3', 'Hanya `nil` (argumen tidak diberi) menerima lalai.', 'Only `nil` (an argument not given) receives the default.'],
        ['6–7', '`false` kini dihormati.', '`false` is now respected.'])),
    S('industry_use_cases',
      UL(
        ['API Neovim menggunakan table pilihan secara meluas: `vim.keymap.set(mode, lhs, rhs, {silent = true})`.', 'The Neovim API uses options tables widely: `vim.keymap.set(mode, lhs, rhs, {silent = true})`.'],
        ['Pustaka Lua yang matang mengesahkan argumen awam dan melaporkan ralat pada tahap 2.', 'Mature Lua libraries validate public arguments and report errors at level 2.'],
        ['Fungsi konfigurasi menerima table dengan lalai untuk setiap tetapan.', 'Configuration functions accept a table with a default for every setting.'],
      )),
    S('practical_demonstration',
      OL(
        ['Panggil `show` dengan `show(nil, 2)` dan ramalkan output.', 'Call `show` with `show(nil, 2)` and predict the output.'],
        ['Tambah pengesahan `times` dalam `validate-args` (mesti integer positif).', 'Add validation of `times` in `validate-args` (it must be a positive integer).'],
        ['Tulis semula `makeBox` dengan table pilihan.', 'Rewrite `makeBox` with an options table.'],
      )),
    S('mini_project',
      P('**Pembina mesej log.** Tulis `logMessage(text, opts)` dengan pilihan `level` (lalai "INFO"), `tag` (pilihan) dan `upper` (boolean, lalai `false`); sahkan bahawa `text` ialah string.', '**A log message builder.** Write `logMessage(text, opts)` with options `level` (default "INFO"), `tag` (optional) and `upper` (a boolean, default `false`); validate that `text` is a string.'),
      CODE('log-builder', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function logMessage(text, opts)
  if type(text) ~= "string" then
    error("logMessage: text must be a string", 2)
  end
  opts = opts or {}
  local level = opts.level or "INFO"
  local upper = opts.upper == true
  local body = upper and text:upper() or text
  local tag = opts.tag and ("[" .. opts.tag .. "] ") or ""
  return level .. " " .. tag .. body
end

print(logMessage("server started"))
print(logMessage("disk almost full", {level = "WARN", tag = "disk"}))
print(logMessage("shutting down", {upper = true}))
`, 'INFO server started\nWARN [disk] disk almost full\nINFO SHUTTING DOWN'),
      EXPLAIN('log-builder',
        ['1–4', 'Argumen wajib disahkan dengan ralat tahap 2.', 'The required argument is validated with a level-2 error.'],
        ['5', 'Table pilihan itu sendiri pilihan: `nil` menjadi table kosong.', 'The options table is itself optional: `nil` becomes an empty table.'],
        ['6–7', 'Lalai untuk tahap; `upper` hanya benar jika `true` diberi secara eksplisit.', 'A default for the level; `upper` is only true when `true` is given explicitly.'],
        ['8–10', 'Bina bahagian mesej; teg dibalut kurungan siku hanya jika diberi.', 'Build the message parts; the tag is wrapped in brackets only when given.'],
        ['13–15', 'Tiga panggilan dengan pilihan berbeza.', 'Three calls with different options.'])),
    S('summary',
      UL(
        ['Argumen kurang → `nil`; argumen lebih → dibuang; tiada amaran.', 'Fewer arguments → `nil`; extra arguments → discarded; no warning.'],
        ['`x = x or lalai` untuk nilai bukan boolean; `if x == nil` untuk boolean.', '`x = x or default` for non-boolean values; `if x == nil` for booleans.'],
        ['`error(mesej, 2)` menunjuk ke baris pemanggil.', '`error(message, 2)` points at the caller’s line.'],
        ['Table pilihan untuk fungsi dengan banyak pilihan.', 'Options tables for functions with many options.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah nilai `c` dalam `show(1, 2)`?', 'What is `c` in `show(1, 2)`?'],
        ['Mengapakah `flag = flag or true` salah?', 'Why is `flag = flag or true` wrong?'],
        ['Apakah perbezaan antara `got no value` dan `got nil`?', 'What is the difference between `got no value` and `got nil`?'],
        ['Bilakah anda menggunakan `error(mesej, 2)` dan bukannya `error(mesej)`?', 'When do you use `error(message, 2)` instead of `error(message)`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.'),
      WARN('Jangan bergantung pada argumen tambahan yang dibuang secara senyap sebagai "ciri" — ia biasanya tanda panggilan yang salah.', 'Do not rely on silently discarded extra arguments as a "feature" — they usually signal a wrong call.', ['Amaran', 'Warning'])),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.4.11 — Function Definitions (parameter adjustment)', url: `${MANUAL}#3.4.11` },
        { title: 'Lua 5.4 Reference Manual — error', url: `${MANUAL}#pdf-error` },
        { title: 'Programming in Lua (1st ed.) — 5.3 Named Arguments', url: `${PIL}/5.3.html` },
        { title: 'Lua 5.4 Reference Manual — string.rep', url: `${MANUAL}#pdf-string.rep` },
      )),
  ],
};

export const LUA104_M1 = [LUA104_1_1, LUA104_1_2, LUA104_1_3];
