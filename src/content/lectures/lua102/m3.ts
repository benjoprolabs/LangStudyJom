import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA102 · Module 3 — Operators (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 3.1 Arithmetic operators ──────────────────────────────────────────────

export const LUA102_3_1: LectureContentDef = {
  courseCode: 'LUA102',
  module: 3,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan tujuh [[operator]] aritmetik Lua: `+ - * / // % ^` dan negasi unari `-`.', 'Use Lua’s seven arithmetic [[operator|operators]]: `+ - * / // % ^` and unary negation `-`.'],
        ['Meramal hasil `//` dan `%` dengan nombor negatif (pembundaran lantai).', 'Predict the results of `//` and `%` with negative numbers (floor rounding).'],
        ['Mengendalikan pembahagian dengan sifar bagi integer dan float.', 'Handle division by zero for integers and floats.'],
        ['Menggunakan `//` dan `%` untuk menukar unit (saat → jam:minit:saat).', 'Use `//` and `%` to convert units (seconds → hours:minutes:seconds).'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.2: subjenis integer dan float, dan subjenis hasil setiap operator.', 'Lecture 2.2: integer and float subtypes, and each operator’s result subtype.'],
        ['Aritmetik sekolah: baki, kuasa, nombor negatif.', 'School arithmetic: remainders, powers, negative numbers.'],
      )),
    S('introduction',
      P('Aritmetik kelihatan mudah, tetapi dua operator Lua — `//` (pembahagian lantai) dan `%` (modulo) — mempunyai peraturan yang tepat untuk nombor negatif yang berbeza daripada sesetengah bahasa lain. Kedua-duanya sangat berguna: menukar saat kepada minit, menyemak nombor genap, membungkus indeks dalam bulatan. Kuliah ini menguasai ketujuh-tujuh operator dan kes tepi mereka.',
        'Arithmetic looks simple, but two Lua operators — `//` (floor division) and `%` (modulo) — have precise rules for negative numbers that differ from some other languages. Both are extremely useful: converting seconds to minutes, checking even numbers, wrapping an index around a circle. This lecture masters all seven operators and their edge cases.'),
      KEY('Dalam Lua, `a % b == a - (a // b) * b`, dan `//` sentiasa membundar ke **bawah** (ke arah −∞).', 'In Lua, `a % b == a - (a // b) * b`, and `//` always rounds **down** (towards −∞).', ['Peraturan utama', 'The key rule'])),
    S('fundamental_concepts',
      UL(
        ['`+` tambah, `-` tolak, `*` darab: integer kekal integer.', '`+` add, `-` subtract, `*` multiply: integers stay integers.'],
        ['`/` pembahagian biasa — sentiasa float: `7 / 2` = 3.5.', '`/` ordinary division — always a float: `7 / 2` = 3.5.'],
        ['`//` pembahagian lantai — hasil dibundar ke bawah: `7 // 2` = 3, `-7 // 2` = −4.', '`//` floor division — the result is rounded down: `7 // 2` = 3, `-7 // 2` = −4.'],
        ['`%` modulo — baki yang tandanya mengikut **pembahagi**: `-7 % 3` = 2.', '`%` modulo — a remainder whose sign follows the **divisor**: `-7 % 3` = 2.'],
        ['`^` kuasa — sentiasa float: `2 ^ 10` = 1024.0. Negasi unari `-x` menukar tanda.', '`^` exponentiation — always a float: `2 ^ 10` = 1024.0. Unary `-x` flips the sign.'],
      )),
    S('detailed_theory',
      P('Lua mentakrifkan `a // b` sebagai `floor(a / b)` dan `a % b` sebagai `a - (a // b) * b`. Akibatnya, hasil `%` sentiasa mempunyai tanda yang sama dengan **pembahagi** `b`, dan untuk `b` positif, hasilnya sentiasa dalam julat `0` hingga `b − 1`. Ini berbeza daripada C dan Java, di mana pembahagian integer membundar ke arah sifar dan `-7 % 3` ialah −1. Takrifan Lua lebih berguna secara matematik: `(i - 1) % n` sentiasa memberi indeks yang sah walaupun `i` menjadi negatif — sesuai untuk membungkus kedudukan dalam bulatan atau jam.',
        'Lua defines `a // b` as `floor(a / b)` and `a % b` as `a - (a // b) * b`. As a result, `%` always has the same sign as the **divisor** `b`, and for positive `b` the result is always in the range `0` to `b − 1`. This differs from C and Java, where integer division rounds towards zero and `-7 % 3` is −1. Lua’s definition is more useful mathematically: `(i - 1) % n` always gives a valid index even when `i` becomes negative — ideal for wrapping a position around a circle or a clock.'),
      P('Pembahagian dengan sifar bergantung pada subjenis. Untuk float, IEEE 754 mentakrifkan hasilnya: `1 / 0` ialah infiniti (`inf`), `-1 / 0` ialah `-inf`. Integer tidak mempunyai nilai infiniti, jadi `1 // 0` dan `1 % 0` dengan dua integer membaling **ralat**. Perhatikan `/` sentiasa float, jadi `1 / 0` tidak pernah ralat — ia memberi `inf`, yang boleh merebak secara senyap ke dalam pengiraan seterusnya. Program yang baik menyemak pembahagi sebelum membahagi.',
        'Division by zero depends on the subtype. For floats, IEEE 754 defines the result: `1 / 0` is infinity (`inf`), `-1 / 0` is `-inf`. Integers have no infinity value, so `1 // 0` and `1 % 0` with two integers raise an **error**. Note that `/` is always float, so `1 / 0` never errors — it gives `inf`, which can silently spread into later calculations. Good programs check the divisor before dividing.')),
    S('technical_terminology', TERMS('operator', 'number-subtype', 'operator-precedence', 'variable')),
    S('syntax_rules',
      UL(
        ['Operator binari ditulis di antara operan: `a + b`. Ruang di sekelilingnya pilihan tetapi disyorkan.', 'Binary operators go between operands: `a + b`. Spaces around them are optional but recommended.'],
        ['`-x` (negasi) ialah unari; `- -x` sah tetapi `--x` ialah **komen**!', '`-x` (negation) is unary; `- -x` is valid but `--x` is a **comment**!'],
        ['`^` bersekutu kanan: `2 ^ 3 ^ 2` = `2 ^ 9` = 512.0.', '`^` is right-associative: `2 ^ 3 ^ 2` = `2 ^ 9` = 512.0.'],
        ['`math.huge` ialah `inf`; `x ~= x` hanya benar untuk NaN ("not a number").', '`math.huge` is `inf`; `x ~= x` is true only for NaN ("not a number").'],
      )),
    S('code_demonstration',
      CODE('arith-basics', 'lua', 'lua54', ['Tujuh operator aritmetik', 'The seven arithmetic operators'], `
local a, b = 17, 5
print(a + b, a - b, a * b, a / b)
print(a // b, a % b, 2 ^ 10, -a)
`, '22\t12\t85\t3.4\n3\t2\t1024.0\t-17'),
      EXPLAIN('arith-basics',
        ['1', 'Dua operan integer.', 'Two integer operands.'],
        ['2', 'Tambah, tolak dan darab memberi integer; `/` memberi float 3.4.', 'Addition, subtraction and multiplication give integers; `/` gives the float 3.4.'],
        ['3', '`17 // 5` = 3 (3.4 dibundar ke bawah); `17 % 5` = 2 (17 − 15); `2 ^ 10` = 1024.0 (float); `-a` = −17.', '`17 // 5` = 3 (3.4 rounded down); `17 % 5` = 2 (17 − 15); `2 ^ 10` = 1024.0 (a float); `-a` = −17.'])),
    S('complete_examples',
      CODE('negative-floor', 'lua', 'lua54', ['// dan % dengan nombor negatif', '// and % with negative numbers'], `
print(-17 // 5, -17 % 5, 17 % -5)

local a, b = -17, 5
print((a // b) * b + a % b == a)

local hour = 2
print((hour - 5) % 24)
`, '-4\t3\t-3\ntrue\n21'),
      EXPLAIN('negative-floor',
        ['1', '−17 / 5 = −3.4, dibundar **ke bawah** kepada −4. Baki: −17 − (−4 × 5) = 3. Dengan pembahagi negatif, baki mengikut tandanya: −3.', '−17 / 5 = −3.4, rounded **down** to −4. Remainder: −17 − (−4 × 5) = 3. With a negative divisor, the remainder follows its sign: −3.'],
        ['3–4', 'Identiti asas Lua sentiasa benar: hasil bahagi × pembahagi + baki = asal.', 'Lua’s basic identity always holds: quotient × divisor + remainder = original.'],
        ['6–7', 'Jam 2 pagi tolak 5 jam: (2 − 5) % 24 = 21 — jam 9 malam semalam. `%` membungkus nilai negatif dengan betul.', '2 a.m. minus 5 hours: (2 − 5) % 24 = 21 — 9 p.m. the previous day. `%` wraps negative values correctly.']),
      CODE('divide-by-zero', 'lua', 'lua54', ['Pembahagian dengan sifar', 'Division by zero'], `
print(1 / 0, -1 / 0, 1.0 // 0)
print(1 / 0 == math.huge)

local function safeDivide(a, b)
  if b == 0 then return nil, "division by zero" end
  return a // b
end
print(safeDivide(10, 3))
print(safeDivide(10, 0))
`, 'inf\t-inf\tinf\ntrue\n3\nnil\tdivision by zero', {
        debug: BUG(`
local perBox = 10 // 0
print("items per box:", perBox)
`, "example:1: attempt to divide by zero",
          'Dengan **dua integer**, `//` tidak boleh memberi infiniti, jadi Lua membaling ralat `attempt to divide by zero` pada baris 1 (dan `%` dengan sifar memberi `attempt to perform \'n%%0\'`). Bandingkan dengan versi asal: `1 / 0` dan `1.0 // 0` ialah operasi **float** yang memberi `inf` tanpa ralat. Semak pembahagi sebelum membahagi, seperti `safeDivide`.',
          'With **two integers**, `//` cannot produce infinity, so Lua raises the error `attempt to divide by zero` on line 1 (and `%` by zero gives `attempt to perform \'n%%0\'`). Compare with the original version: `1 / 0` and `1.0 // 0` are **float** operations that give `inf` without an error. Check the divisor before dividing, as `safeDivide` does.'),
      }),
      EXPLAIN('divide-by-zero',
        ['1', 'Operasi float dengan sifar memberi infiniti positif atau negatif — tiada ralat.', 'Float operations with zero give positive or negative infinity — no error.'],
        ['2', '`math.huge` ialah nilai infiniti yang sama.', '`math.huge` is the same infinity value.'],
        ['4–7', 'Fungsi selamat memulangkan `nil` dan mesej apabila pembahagi sifar (corak `(nil, mesej)`).', 'A safe function returns `nil` and a message when the divisor is zero (the `(nil, message)` pattern).'],
        ['8–9', 'Keputusan normal (3) dan kegagalan terkawal.', 'A normal result (3) and a controlled failure.'])),
    S('line_by_line',
      EXPLAIN('negative-floor',
        ['7', 'Dalam C, `(2 - 5) % 24` memberi −3, dan anda perlu menambah 24 sendiri. Takrifan lantai Lua menjadikan aritmetik modular — jam, hari dalam minggu, indeks bulatan — betul tanpa kes khas.', 'In C, `(2 - 5) % 24` gives −3, and you must add 24 yourself. Lua’s floor definition makes modular arithmetic — clocks, days of the week, circular indexes — correct without special cases.']),
      EXPLAIN('arith-basics',
        ['3', 'Perhatikan perbezaan `/` (3.4) dan `//` (3): pilih berdasarkan sama ada anda mahu pecahan atau bilangan bulat yang lengkap.', 'Notice the difference between `/` (3.4) and `//` (3): choose by whether you want the fraction or the number of whole units.'])),
    S('why_this_way',
      P('Mengapa pembahagian lantai dan bukannya pemotongan ke arah sifar? Kerana ia memastikan `%` dengan pembahagi positif tidak pernah negatif, yang menjadikan banyak algoritma (penjadualan, grafik, kalendar) lebih ringkas dan betul. Python menggunakan peraturan yang sama atas sebab yang sama. Mengapa `//` integer membaling ralat dengan sifar? Kerana tiada nilai integer yang betul untuk dipulangkan — senyap memulangkan sesuatu akan menyembunyikan pepijat.',
        'Why floor division instead of truncation towards zero? Because it guarantees that `%` with a positive divisor is never negative, which makes many algorithms (scheduling, graphics, calendars) simpler and correct. Python uses the same rule for the same reason. Why does integer `//` raise an error on zero? Because there is no correct integer to return — silently returning something would hide a bug.'),
      P('Gunakan `//` dan `%` **apabila** anda bekerja dengan unit bulat (saat, sen, indeks); gunakan `/` **apabila** anda memerlukan nilai pecahan (purata, peratusan).', 'Use `//` and `%` **when** you work with whole units (seconds, cents, indexes); use `/` **when** you need a fractional value (averages, percentages).')),
    S('execution_flow',
      OL(
        ['`-17 // 5`: mesin maya membahagikan dan membundar ke bawah → −4.', '`-17 // 5`: the virtual machine divides and rounds down → −4.'],
        ['`-17 % 5`: dikira sebagai −17 − (−4 × 5) = 3.', '`-17 % 5`: computed as −17 − (−4 × 5) = 3.'],
        ['`(hour - 5) % 24`: −3 % 24 = −3 − (−1 × 24) = 21.', '`(hour - 5) % 24`: −3 % 24 = −3 − (−1 × 24) = 21.'],
        ['Dalam versi berpepijat `divide-by-zero`, arahan `IDIV` menyemak pembahagi integer sifar dan membaling ralat `attempt to divide by zero` sebelum membahagi.', 'In the buggy `divide-by-zero`, the `IDIV` instruction checks for an integer zero divisor and raises `attempt to divide by zero` before dividing.'],
      )),
    S('memory_behaviour',
      P('Operasi aritmetik tidak memperuntukkan memori: operan dan hasil berada dalam daftar mesin maya. Pemalar seperti `24` atau `3600` disimpan sekali dalam senarai pemalar fungsi. Pengiraan berat dalam gelung tidak menghasilkan sampah — kecuali anda menukar hasilnya kepada string, yang mencipta objek string.',
        'Arithmetic operations allocate no memory: operands and results live in virtual-machine registers. Constants such as `24` or `3600` are stored once in the function’s constant list. Heavy calculation in a loop produces no garbage — unless you convert results to strings, which creates string objects.')),
    S('alternative_implementations',
      P('`math.fmod` memberi baki yang tandanya mengikut **pembahagi-yang-dibahagi** (seperti C), dan `math.modf` memisahkan bahagian bulat dan pecahan:', '`math.fmod` gives a remainder whose sign follows the **dividend** (like C), and `math.modf` splits the whole and fractional parts:'),
      CODE('fmod-modf', 'lua', 'lua54', ['math.fmod dan math.modf', 'math.fmod and math.modf'], `
print(-7 % 3, math.fmod(-7, 3))
print(math.modf(3.75))
print(math.modf(-3.75))
`, '2\t-1\n3\t0.75\n-3\t-0.75'),
      EXPLAIN('fmod-modf',
        ['1', '`%` Lua: 2 (mengikut pembahagi). `math.fmod`: −1 (mengikut nombor yang dibahagi, gaya C).', 'Lua `%`: 2 (follows the divisor). `math.fmod`: −1 (follows the dividend, C style).'],
        ['2–3', '`math.modf` memulangkan bahagian bulat (dipotong ke arah sifar) — sebagai integer apabila muat — dan pecahan, yang sentiasa float.', '`math.modf` returns the whole part (truncated towards zero) — as an integer when it fits — and the fraction, which is always a float.']),
      P('Gunakan `%` untuk aritmetik modular (jam, bulatan); `math.fmod` apabila menterjemah formula daripada C; `math.modf` apabila anda memerlukan kedua-dua bahagian nombor.', 'Use `%` for modular arithmetic (clocks, circles); `math.fmod` when translating formulas from C; `math.modf` when you need both parts of a number.')),
    S('common_mistakes',
      UL(
        ['Menggunakan `/` dan menjangka integer — `10 / 2` ialah 5.0.', 'Using `/` and expecting an integer — `10 / 2` is 5.0.'],
        ['Menjangka `-7 // 2` = −3 (seperti C) — dalam Lua ia −4.', 'Expecting `-7 // 2` = −3 (as in C) — in Lua it is −4.'],
        ['Menulis `x--` atau `x++` — Lua tiada operator ini; `--` memulakan komen.', 'Writing `x--` or `x++` — Lua has no such operators; `--` starts a comment.'],
        ['Tidak menyemak pembahagi sifar, lalu `inf` merebak ke dalam keputusan.', 'Not checking for a zero divisor, so `inf` spreads into the results.'],
        ['Menggunakan `^` untuk integer besar dan terkejut mendapat float (`2 ^ 63` bukan integer).', 'Using `^` for large integers and being surprised by a float (`2 ^ 63` is not an integer).'],
      )),
    S('debugging',
      P('Pepijat aritmetik terbahagi kepada tiga: **ralat** (pembahagian integer dengan sifar, aritmetik dengan `nil`), **nilai khas** (`inf`, `nan`) yang merebak secara senyap, dan **jawapan salah** akibat peraturan pembundaran. Untuk nilai khas, uji `x == math.huge`, `x == -math.huge` dan `x ~= x` (benar hanya untuk NaN). Untuk jawapan salah, cetak setiap langkah perantaraan. Contoh berikut menunjukkan aritmetik dengan `nil` dalam penukaran masa:',
        'Arithmetic bugs come in three kinds: **errors** (integer division by zero, arithmetic with `nil`), **special values** (`inf`, `nan`) that spread silently, and **wrong answers** from rounding rules. For special values, test `x == math.huge`, `x == -math.huge` and `x ~= x` (true only for NaN). For wrong answers, print every intermediate step. The following example shows arithmetic with `nil` in a time conversion:'),
      CODE('time-convert', 'lua', 'lua54', ['Saat kepada jam:minit:saat', 'Seconds to hours:minutes:seconds'], `
local total = 3725
local hours = total // 3600
local minutes = total % 3600 // 60
local seconds = total % 60
print(string.format("%02d:%02d:%02d", hours, minutes, seconds))
`, '01:02:05', {
        debug: BUG(`
local total = 3725
local hours = total // 3600
local minutes = total % 3600 // 60
local seconds = totl % 60
print(string.format("%02d:%02d:%02d", hours, minutes, seconds))
`, "example:4: attempt to perform arithmetic on a nil value (global 'totl')",
          'Salah ejaan `totl` dibaca sebagai global `nil`. Mesej menyebut **baris 4**, operasi aritmetik dan nama `global \'totl\'`. Perkataan "global" ialah petunjuk: anda tidak pernah mengisytiharkan nama itu. Betulkan ejaan kepada `total`.',
          'The misspelling `totl` is read as a `nil` global. The message names **line 4**, the arithmetic operation and the name `global \'totl\'`. The word "global" is the hint: you never declared that name. Fix the spelling to `total`.'),
      }),
      EXPLAIN('time-convert',
        ['1', 'Jumlah saat.', 'The total number of seconds.'],
        ['2', '3725 // 3600 = 1 jam.', '3725 // 3600 = 1 hour.'],
        ['3', '`%` dan `//` mempunyai keutamaan yang sama dan dinilai dari kiri: (3725 % 3600) // 60 = 125 // 60 = 2 minit.', '`%` and `//` have the same precedence and evaluate left to right: (3725 % 3600) // 60 = 125 // 60 = 2 minutes.'],
        ['4', '3725 % 60 = 5 saat.', '3725 % 60 = 5 seconds.'],
        ['5', '`%02d` mengisi setiap bahagian dengan sifar hingga dua digit.', '`%02d` pads each part with zeros to two digits.'])),
    S('performance',
      P('Operasi integer dan float sama pantas. `x * x` lebih pantas daripada `x ^ 2` kerana `^` memanggil fungsi kuasa am dan menghasilkan float. Untuk menyemak genap/ganjil, `n % 2 == 0` sudah pantas; operator bit `n & 1 == 0` hanya berguna dalam kod yang sangat kritikal.',
        'Integer and float operations are equally fast. `x * x` is faster than `x ^ 2` because `^` calls the general power function and produces a float. To test even/odd, `n % 2 == 0` is already fast; the bitwise `n & 1 == 0` only matters in extremely critical code.')),
    S('software_engineering',
      P('Bandingkan kod penukaran masa yang penuh dengan "nombor ajaib" dengan versi yang memberi nama kepada setiap unit:', 'Compare time-conversion code full of "magic numbers" with a version that names every unit:'),
      CODE('poor-magic-numbers', 'lua', 'lua54', ['Pelaksanaan lemah: nombor ajaib', 'Poor implementation: magic numbers'], `
local t = 200000
print(t // 86400, t % 86400 // 3600, t % 3600 // 60, t % 60)
`, '2\t7\t33\t20'),
      EXPLAIN('poor-magic-numbers',
        ['1–2', 'Berfungsi, tetapi pembaca mesti tahu bahawa 86400 ialah saat sehari dan 3600 saat sejam. Satu digit tersalah taip tidak dapat dikesan dengan mudah.', 'It works, but the reader must know that 86400 is seconds per day and 3600 seconds per hour. A single mistyped digit would be hard to spot.']),
      CODE('improved-named-units', 'lua', 'lua54', ['Pelaksanaan lebih baik: unit bernama dan fungsi', 'Improved implementation: named units and a function'], `
local MINUTE = 60
local HOUR = 60 * MINUTE
local DAY = 24 * HOUR

local function breakDown(seconds)
  return seconds // DAY, seconds % DAY // HOUR, seconds % HOUR // MINUTE, seconds % MINUTE
end

print(breakDown(200000))
`, '2\t7\t33\t20'),
      EXPLAIN('improved-named-units',
        ['1–3', 'Setiap unit ditakrifkan daripada unit yang lebih kecil — tiada nombor ajaib, dan nilainya disemak sendiri oleh pembaca.', 'Each unit is defined from the smaller one — no magic numbers, and readers can verify the values themselves.'],
        ['5–7', 'Fungsi dengan nama yang jelas memulangkan empat bahagian sebagai nilai berbilang.', 'A clearly named function returns the four parts as multiple values.'],
        ['9', 'Keputusan sama: 2 hari, 7 jam, 33 minit, 20 saat.', 'The same result: 2 days, 7 hours, 33 minutes, 20 seconds.'])),
    S('industry_use_cases',
      UL(
        ['Pemasa permainan menukar milisaat kepada minit:saat dengan `//` dan `%`.', 'Game timers convert milliseconds to minutes:seconds with `//` and `%`.'],
        ['Penyusun grid (tilemap) menukar indeks 1D kepada baris dan lajur: `row = (i - 1) // width`, `col = (i - 1) % width`.', 'Tilemaps convert a 1D index to row and column: `row = (i - 1) // width`, `col = (i - 1) % width`.'],
        ['Sistem kewangan mengira faedah kompaun dengan `^`.', 'Financial systems compute compound interest with `^`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `negative-floor`, kemudian kira `-17 // 5` dan `-17 % 5` dengan tangan untuk mengesahkan.', 'Run `negative-floor`, then compute `-17 // 5` and `-17 % 5` by hand to confirm.'],
        ['Dalam `time-convert`, cuba `total = 86399` dan ramalkan output.', 'In `time-convert`, try `total = 86399` and predict the output.'],
        ['Jalankan versi berpepijat `divide-by-zero` dan bandingkan baris 1 (tiada ralat) dengan baris 5 (ralat).', 'Run the buggy `divide-by-zero` and compare line 1 (no error) with line 5 (an error).'],
      )),
    S('mini_project',
      P('**Kalkulator simpanan.** Kira nilai simpanan RM1000 pada kadar faedah kompaun 4% setahun selama 3 tahun, dan papar nilai setiap tahun.', '**A savings calculator.** Compute the value of RM1000 saved at 4% compound interest per year for 3 years, and display the value each year.'),
      CODE('compound-interest', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local principal, rate = 1000, 0.04

for year = 1, 3 do
  local value = principal * (1 + rate) ^ year
  print(string.format("year %d: RM%.2f", year, value))
end
`, 'year 1: RM1040.00\nyear 2: RM1081.60\nyear 3: RM1124.86'),
      EXPLAIN('compound-interest',
        ['1', 'Modal dan kadar faedah tahunan (4% sebagai pecahan).', 'The principal and the annual interest rate (4% as a fraction).'],
        ['3–6', 'Formula faedah kompaun: modal × (1 + kadar)^tahun. `^` memberi float; `%.2f` memaparkan dua tempat perpuluhan untuk wang.', 'The compound-interest formula: principal × (1 + rate)^years. `^` gives a float; `%.2f` shows two decimal places for money.'])),
    S('summary',
      UL(
        ['Tujuh operator: `+ - * / // % ^` dan negasi unari.', 'Seven operators: `+ - * / // % ^` and unary negation.'],
        ['`//` membundar ke bawah; `%` mengikut tanda pembahagi; `a % b == a - (a // b) * b`.', '`//` rounds down; `%` follows the divisor’s sign; `a % b == a - (a // b) * b`.'],
        ['Float dengan sifar → `inf`; integer `//` atau `%` dengan sifar → ralat.', 'Float by zero → `inf`; integer `//` or `%` by zero → an error.'],
        ['Beri nama kepada unit dan pemalar; jangan gunakan nombor ajaib.', 'Name units and constants; avoid magic numbers.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah hasil `-9 // 4` dan `-9 % 4`?', 'What are `-9 // 4` and `-9 % 4`?'],
        ['Mengapakah `1 / 0` tidak menghasilkan ralat tetapi `1 // 0` ya?', 'Why does `1 / 0` not produce an error while `1 // 0` does?'],
        ['Bagaimanakah anda menukar 500 minit kepada jam dan minit?', 'How would you convert 500 minutes to hours and minutes?'],
        ['Apakah subjenis `3 ^ 2`?', 'What is the subtype of `3 ^ 2`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.4.1 — Arithmetic Operators', url: `${MANUAL}#3.4.1` },
        { title: 'Lua 5.4 Reference Manual — math.fmod, math.modf, math.huge', url: `${MANUAL}#pdf-math.fmod` },
        { title: 'Programming in Lua (1st ed.) — 3.1 Arithmetic Operators', url: `${PIL}/3.1.html` },
        { title: 'Lua 5.4 Reference Manual §3.4.8 — Precedence', url: `${MANUAL}#3.4.8` },
      )),
  ],
};

// ─── 3.2 Relational (==, ~=) and logical (and, or, not) operators ──────────

export const LUA102_3_2: LectureContentDef = {
  courseCode: 'LUA102',
  module: 3,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan operator hubungan `== ~= < > <= >=` dengan nombor dan string.', 'Use the relational operators `== ~= < > <= >=` with numbers and strings.'],
        ['Menerangkan bahawa `==` tidak pernah ralat, tetapi `<` antara jenis berbeza ialah ralat.', 'Explain that `==` never errors, but `<` between different types is an error.'],
        ['Menggunakan `and`, `or` dan `not`, termasuk [[short-circuit|penilaian litar pintas]].', 'Use `and`, `or` and `not`, including [[short-circuit|short-circuit evaluation]].'],
        ['Menulis semakan julat yang betul (`x >= a and x <= b`).', 'Write correct range checks (`x >= a and x <= b`).'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1: truthiness — hanya `nil` dan `false` palsu.', 'Lecture 2.1: truthiness — only `nil` and `false` are falsy.'],
        ['Kuliah 3.1: operator aritmetik.', 'Lecture 3.1: arithmetic operators.'],
      )),
    S('introduction',
      P('Setiap keputusan dalam program — "adakah pemain masih hidup?", "adakah kata laluan betul?", "adakah stok mencukupi?" — bergantung pada **perbandingan** dan **logik**. Lua mempunyai enam operator hubungan dan tiga operator logik. Dua butiran membezakan Lua: tanda tidak sama ialah `~=` (bukan `!=`), dan `and`/`or` memulangkan salah satu **operan**, bukan sekadar `true` atau `false`.',
        'Every decision in a program — "is the player still alive?", "is the password right?", "is there enough stock?" — depends on **comparison** and **logic**. Lua has six relational operators and three logical ones. Two details set Lua apart: the not-equal sign is `~=` (not `!=`), and `and`/`or` return one of their **operands**, not just `true` or `false`.'),
      KEY('`a and b`: jika `a` palsu → `a`, jika tidak → `b`. `a or b`: jika `a` benar → `a`, jika tidak → `b`.', '`a and b`: if `a` is falsy → `a`, otherwise → `b`. `a or b`: if `a` is truthy → `a`, otherwise → `b`.', ['Peraturan utama', 'The key rule'])),
    S('fundamental_concepts',
      UL(
        ['`==` dan `~=` membandingkan sebarang dua nilai; nilai jenis berbeza sentiasa tidak sama (`1 == "1"` palsu).', '`==` and `~=` compare any two values; values of different types are always unequal (`1 == "1"` is false).'],
        ['`< > <= >=` hanya untuk dua nombor atau dua string; jenis lain menghasilkan ralat.', '`< > <= >=` only work on two numbers or two strings; other types give an error.'],
        ['String dibandingkan secara **leksikografi** mengikut kod aksara: `"Z" < "a"` dan `"10" < "9"` adalah benar.', 'Strings compare **lexicographically** by character code: `"Z" < "a"` and `"10" < "9"` are true.'],
        ['Table, fungsi dan userdata dibandingkan mengikut **identiti** (objek yang sama).', 'Tables, functions and userdata compare by **identity** (the same object).'],
        ['`not x` sentiasa memulangkan boolean; `and`/`or` memulangkan operan.', '`not x` always returns a boolean; `and`/`or` return an operand.'],
      )),
    S('detailed_theory',
      P('Operator `and` dan `or` menggunakan **[[short-circuit|penilaian litar pintas]]**: operan kedua hanya dinilai jika perlu. Dalam `a and b`, jika `a` palsu, hasilnya sudah pasti palsu, jadi `b` tidak pernah dinilai. Ini bukan sekadar pengoptimuman — ia ialah alat keselamatan: `player and player.health > 0` tidak akan cuba mengindeks `player` jika ia `nil`. Kerana `and`/`or` memulangkan operan, ia juga membentuk idiom seperti `name or "guest"` untuk nilai lalai.',
        'The `and` and `or` operators use **[[short-circuit]] evaluation**: the second operand is evaluated only when needed. In `a and b`, if `a` is falsy the result is already known to be falsy, so `b` is never evaluated. This is not just an optimisation — it is a safety tool: `player and player.health > 0` never tries to index `player` if it is `nil`. Because `and`/`or` return operands, they also form idioms such as `name or "guest"` for defaults.'),
      P('Perbandingan string menggunakan susunan aksara mengikut locale semasa (dalam praktik, kod bait ASCII/UTF-8). Huruf besar datang sebelum huruf kecil (`"Zebra" < "apple"`), dan nombor dalam string dibandingkan **aksara demi aksara**, bukan mengikut nilai: `"10" < "9"` kerana `"1"` < `"9"`. Lua juga tidak mempunyai perbandingan berantai seperti matematik: `1 <= x <= 10` dibaca sebagai `(1 <= x) <= 10`, yang membandingkan boolean dengan nombor — ralat.',
        'String comparison uses the character order of the current locale (in practice, ASCII/UTF-8 byte codes). Upper-case letters come before lower-case (`"Zebra" < "apple"`), and numbers inside strings compare **character by character**, not by value: `"10" < "9"` because `"1"` < `"9"`. Lua also has no chained comparison as in mathematics: `1 <= x <= 10` is read as `(1 <= x) <= 10`, which compares a boolean with a number — an error.')),
    S('technical_terminology', TERMS('short-circuit', 'truthiness', 'operator', 'nil')),
    S('syntax_rules',
      UL(
        ['Sama: `==`. Tidak sama: `~=` (bukan `!=`).', 'Equal: `==`. Not equal: `~=` (not `!=`).'],
        ['Logik: `and`, `or`, `not` — perkataan, bukan `&&`, `||`, `!`.', 'Logic: `and`, `or`, `not` — words, not `&&`, `||`, `!`.'],
        ['Julat: `x >= low and x <= high`.', 'Range: `x >= low and x <= high`.'],
        ['Keutamaan: `not` > perbandingan > `and` > `or`. `a or b and c` bermaksud `a or (b and c)`.', 'Precedence: `not` > comparisons > `and` > `or`. `a or b and c` means `a or (b and c)`.'],
      )),
    S('code_demonstration',
      CODE('compare', 'lua', 'lua54', ['Perbandingan nombor dan string', 'Comparing numbers and strings'], `
print(3 == 3.0, 1 ~= 2, 2 < 10)
print("abc" < "abd", "Z" < "a", "10" < "9")
print(1 == "1", nil == false, {} ~= {})
`, 'true\ttrue\ttrue\ntrue\ttrue\ttrue\nfalse\tfalse\ttrue'),
      EXPLAIN('compare',
        ['1', 'Nombor dibandingkan mengikut nilai, merentas subjenis.', 'Numbers compare by value, across subtypes.'],
        ['2', 'String dibandingkan aksara demi aksara: "c" < "d"; "Z" (90) < "a" (97); "1" < "9" jadi `"10" < "9"` benar walaupun 10 > 9.', 'Strings compare character by character: "c" < "d"; "Z" (90) < "a" (97); "1" < "9" so `"10" < "9"` is true although 10 > 9.'],
        ['3', 'Jenis berbeza tidak pernah sama (`1 == "1"`, `nil == false` palsu). Dua table berbeza tidak sama.', 'Different types are never equal (`1 == "1"`, `nil == false` are false). Two different tables are not equal.'])),
    S('complete_examples',
      CODE('logic-returns', 'lua', 'lua54', ['and dan or memulangkan operan', 'and and or return operands'], `
print(nil and 1, false or "x", 1 and 2)
print(nil or false, not nil, not 0)

local username = nil
print("Hello, " .. (username or "guest"))
`, 'nil\tx\t2\nfalse\ttrue\tfalse\nHello, guest'),
      EXPLAIN('logic-returns',
        ['1', '`nil and 1` → `nil` (operan pertama palsu); `false or "x"` → `"x"`; `1 and 2` → `2` (yang pertama benar, jadi yang kedua dipulangkan).', '`nil and 1` → `nil` (the first operand is falsy); `false or "x"` → `"x"`; `1 and 2` → `2` (the first is truthy, so the second is returned).'],
        ['2', '`nil or false` → `false`; `not nil` → `true`; `not 0` → `false` kerana 0 benar.', '`nil or false` → `false`; `not nil` → `true`; `not 0` → `false` because 0 is truthy.'],
        ['4–5', 'Idiom nilai lalai: `username or "guest"`.', 'The default-value idiom: `username or "guest"`.']),
      CODE('range-check', 'lua', 'lua54', ['Semakan julat yang betul', 'A correct range check'], `
local function isValidLevel(level)
  return level >= 1 and level <= 10
end

print(isValidLevel(0), isValidLevel(5), isValidLevel(10), isValidLevel(11))
`, 'false\ttrue\ttrue\tfalse', {
        debug: BUG(`
local function isValidLevel(level)
  return 1 <= level <= 10
end

print(isValidLevel(0), isValidLevel(5), isValidLevel(10), isValidLevel(11))
`, "example:2: attempt to compare boolean with number",
          'Dalam matematik `1 ≤ x ≤ 10` ialah satu syarat, tetapi Lua membacanya dari kiri: `(1 <= level) <= 10`. Bahagian pertama memberi boolean, kemudian boolean dibandingkan dengan 10 — ralat. Tulis dua perbandingan yang digabungkan dengan `and`.',
          'In mathematics `1 ≤ x ≤ 10` is one condition, but Lua reads it from the left: `(1 <= level) <= 10`. The first part gives a boolean, then a boolean is compared with 10 — an error. Write two comparisons joined with `and`.'),
      }),
      EXPLAIN('range-check',
        ['1–3', 'Dua perbandingan digabungkan dengan `and`: kedua-duanya mesti benar.', 'Two comparisons joined with `and`: both must be true.'],
        ['5', 'Uji sempadan: 0 dan 11 di luar julat; 5 dan 10 di dalam (`<=` termasuk 10).', 'Test the boundaries: 0 and 11 are outside; 5 and 10 inside (`<=` includes 10).'])),
    S('line_by_line',
      EXPLAIN('logic-returns',
        ['5', 'Kurungan diperlukan: tanpanya, `..` (keutamaan lebih tinggi) akan dinilai dahulu — `("Hello, " .. username) or "guest"` — dan gagal kerana `username` ialah `nil`.', 'The parentheses are needed: without them, `..` (higher precedence) is evaluated first — `("Hello, " .. username) or "guest"` — and fails because `username` is `nil`.']),
      EXPLAIN('compare',
        ['2', 'Untuk membandingkan nombor yang disimpan sebagai string, tukar dahulu: `tonumber("10") < tonumber("9")` palsu.', 'To compare numbers stored as strings, convert first: `tonumber("10") < tonumber("9")` is false.'])),
    S('why_this_way',
      P('Mengapa `~=` dan bukannya `!=`? Lua dipengaruhi oleh notasi matematik dan bahasa seperti Modula; `~` melambangkan "bukan". Mengapa `and`/`or` memulangkan operan? Kerana ia menjadikan idiom berguna mungkin tanpa sintaks tambahan — nilai lalai (`x or y`), akses selamat (`t and t.field`) — selaras dengan falsafah Lua untuk menyediakan mekanisme yang kecil tetapi umum.',
        'Why `~=` and not `!=`? Lua was influenced by mathematical notation and languages like Modula; `~` stands for "not". Why do `and`/`or` return operands? Because it makes useful idioms possible without extra syntax — defaults (`x or y`), safe access (`t and t.field`) — in line with Lua’s philosophy of providing small but general mechanisms.'),
      P('Gunakan litar pintas **apabila** operan kedua hanya selamat dinilai jika yang pertama lulus (indeks selepas semakan `nil`, pembahagian selepas semakan sifar). Tulis perbandingan eksplisit **apabila** anda memerlukan boolean tulen.', 'Use short-circuiting **when** the second operand is only safe to evaluate if the first passes (indexing after a `nil` check, dividing after a zero check). Write explicit comparisons **when** you need a genuine boolean.')),
    S('execution_flow',
      OL(
        ['`isValidLevel(0)`: `level >= 1` dinilai → `false`.', '`isValidLevel(0)`: `level >= 1` is evaluated → `false`.'],
        ['Kerana operan kiri `and` palsu, `level <= 10` **tidak** dinilai; hasilnya `false`.', 'Because the left operand of `and` is falsy, `level <= 10` is **not** evaluated; the result is `false`.'],
        ['`isValidLevel(5)`: `5 >= 1` benar, jadi `5 <= 10` dinilai → `true`, dan itulah hasilnya.', '`isValidLevel(5)`: `5 >= 1` is true, so `5 <= 10` is evaluated → `true`, which is the result.'],
      )),
    S('memory_behaviour',
      P('Perbandingan dan operator logik tidak memperuntukkan memori. Membandingkan string pendek dengan `==` hanya membandingkan penunjuk kerana ia di-intern; `<` antara string membandingkan bait. Membandingkan table dengan `==` membandingkan alamat objek — murah, tetapi ingat ia tidak melihat kandungan.',
        'Comparisons and logical operators allocate no memory. Comparing short strings with `==` only compares pointers because they are interned; `<` between strings compares bytes. Comparing tables with `==` compares object addresses — cheap, but remember it does not look at contents.')),
    S('alternative_implementations',
      P('Untuk memeriksa sama ada nilai tergolong dalam sekumpulan pilihan, table "set" lebih kemas dan lebih pantas daripada rantai `or`:', 'To check whether a value belongs to a group of options, a "set" table is tidier and faster than a chain of `or`s:'),
      CODE('set-membership', 'lua', 'lua54', ['Rantai or berbanding table set', 'An or-chain versus a set table'], `
local day = "sat"
local isWeekend1 = day == "sat" or day == "sun"

local WEEKEND = {sat = true, sun = true}
local isWeekend2 = WEEKEND[day] == true

print(isWeekend1, isWeekend2, WEEKEND.mon == true)
`, 'true\ttrue\tfalse'),
      EXPLAIN('set-membership',
        ['1–2', 'Rantai `or` — baik untuk dua pilihan, tetapi menjadi panjang untuk banyak pilihan.', 'An `or` chain — fine for two options, but long for many.'],
        ['4–5', 'Table set: kunci ialah pilihan yang sah. Satu carian table menggantikan seluruh rantai.', 'A set table: the keys are the valid options. One table lookup replaces the whole chain.'],
        ['7', '`WEEKEND.mon` ialah `nil`, jadi `== true` memberi `false`.', '`WEEKEND.mon` is `nil`, so `== true` gives `false`.'])),
    S('common_mistakes',
      UL(
        ['Menulis `!=`, `&&`, `||` atau `!` daripada bahasa lain.', 'Writing `!=`, `&&`, `||` or `!` from other languages.'],
        ['Menggunakan `=` (assignment) dalam syarat: `if x = 5 then` ialah ralat sintaks.', 'Using `=` (assignment) in a condition: `if x = 5 then` is a syntax error.'],
        ['Membandingkan nombor yang dibaca sebagai string dengan nombor (`"5" < 10` ralat; `"5" == 5` palsu).', 'Comparing numbers read as strings with numbers (`"5" < 10` errors; `"5" == 5` is false).'],
        ['Menulis perbandingan berantai `a < x < b`.', 'Writing chained comparisons `a < x < b`.'],
        ['Menjangka `"10" < "9"` palsu kerana 10 > 9.', 'Expecting `"10" < "9"` to be false because 10 > 9.'],
      )),
    S('debugging',
      P('Ralat perbandingan menyebut **dua jenis** yang bertembung: `attempt to compare string with number`, `attempt to compare nil with number`, `attempt to compare boolean with number`. Ini hampir selalu bermakna salah satu nilai bukan seperti yang anda sangka — input yang belum ditukar, nilai yang tiada, atau perbandingan berantai. Contoh berikut membandingkan input string dengan nombor:',
        'Comparison errors name the **two types** that collided: `attempt to compare string with number`, `attempt to compare nil with number`, `attempt to compare boolean with number`. That almost always means one value is not what you assumed — unconverted input, a missing value, or a chained comparison. The following example compares a string input with a number:'),
      CODE('age-check', 'lua', 'lua54', ['Menukar input sebelum membandingkan', 'Converting input before comparing'], `
local input = "17"
local age = tonumber(input)
print(age >= 18 and "adult" or "minor")
`, 'minor', {
        debug: BUG(`
local input = "17"
print(input >= 18 and "adult" or "minor")
`, "example:2: attempt to compare number with string",
          'Input daripada pengguna atau fail ialah **string**. Lua menukar string kepada nombor untuk aritmetik, tetapi **tidak** untuk perbandingan, jadi `"17" >= 18` ialah ralat. (Susunan "number with string" kerana Lua menilai `a >= b` sebagai `b <= a`.) Tukar dengan `tonumber` dahulu, dan semak bahawa hasilnya bukan `nil`.',
          'Input from a user or file is a **string**. Lua converts strings to numbers for arithmetic, but **not** for comparison, so `"17" >= 18` is an error. (The order "number with string" is because Lua evaluates `a >= b` as `b <= a`.) Convert with `tonumber` first, and check that the result is not `nil`.'),
      }),
      EXPLAIN('age-check',
        ['1–2', 'Input string ditukar kepada nombor.', 'The string input is converted to a number.'],
        ['3', 'Perbandingan berangka, kemudian idiom `and/or` memilih label.', 'A numeric comparison, then the `and/or` idiom picks a label.'])),
    S('performance',
      P('Litar pintas juga menjimatkan kerja: letakkan semakan yang **murah** atau yang paling **kerap gagal** dahulu dalam rantai `and`. Untuk menyemak keahlian dalam banyak pilihan, table set (carian hash) lebih pantas daripada rantai `or` yang panjang.',
        'Short-circuiting also saves work: put the **cheapest** check, or the one that **fails most often**, first in an `and` chain. For membership in many options, a set table (a hash lookup) is faster than a long `or` chain.')),
    S('software_engineering',
      P('Bandingkan syarat bersarang dengan syarat yang digabungkan:', 'Compare nested conditions with a combined condition:'),
      CODE('poor-nested-if', 'lua', 'lua54', ['Pelaksanaan lemah: if bersarang', 'Poor implementation: nested ifs'], `
local function canEnter(age, hasTicket, isBanned)
  if age >= 18 then
    if hasTicket then
      if not isBanned then
        return true
      end
    end
  end
  return false
end

print(canEnter(20, true, false), canEnter(20, true, true))
`, 'true\tfalse'),
      EXPLAIN('poor-nested-if',
        ['1–10', 'Tiga tahap inden untuk satu keputusan. Mudah tersilap meletakkan `end` dan sukar melihat syarat penuh sekali pandang.', 'Three levels of indentation for one decision. It is easy to misplace an `end` and hard to see the whole condition at a glance.'],
        ['12', 'Keputusan betul, tetapi strukturnya berat.', 'Correct results, but a heavy structure.']),
      CODE('improved-combined', 'lua', 'lua54', ['Pelaksanaan lebih baik: satu ungkapan logik', 'Improved implementation: one logical expression'], `
local function canEnter(age, hasTicket, isBanned)
  return age >= 18 and hasTicket and not isBanned
end

print(canEnter(20, true, false), canEnter(20, true, true))
`, 'true\tfalse'),
      EXPLAIN('improved-combined',
        ['1–3', 'Syarat dibaca seperti ayat: "umur 18 ke atas **dan** ada tiket **dan** tidak disekat".', 'The condition reads like a sentence: "age 18 or over **and** has a ticket **and** not banned".'],
        ['5', 'Keputusan sama.', 'The same results.']),
      P('Nota: versi kedua memulangkan nilai operan (contohnya `false` daripada `not isBanned`) dan bukannya sentiasa boolean tulen — dalam contoh ini semua operan sudah boolean, jadi hasilnya sama.', 'Note: the second version returns an operand’s value (for example `false` from `not isBanned`) rather than always a genuine boolean — here every operand is already a boolean, so the results match.')),
    S('industry_use_cases',
      UL(
        ['Semakan kebenaran: `user and user.role == "admin"`.', 'Permission checks: `user and user.role == "admin"`.'],
        ['Konfigurasi: `settings.port or 8080` untuk nilai lalai.', 'Configuration: `settings.port or 8080` for defaults.'],
        ['Isihan: fungsi perbandingan `a.score > b.score` dalam `table.sort` (LUA111).', 'Sorting: comparison functions `a.score > b.score` in `table.sort` (LUA111).'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `compare` dan terangkan setiap nilai dalam baris kedua.', 'Run `compare` and explain every value on the second line.'],
        ['Jalankan versi berpepijat `range-check` dan `age-check`; bandingkan jenis dalam kedua-dua mesej.', 'Run the buggy `range-check` and `age-check`; compare the types named in both messages.'],
        ['Tambah syarat keempat (`hasPaid`) pada `improved-combined`.', 'Add a fourth condition (`hasPaid`) to `improved-combined`.'],
      )),
    S('mini_project',
      P('**Harga tiket wayang.** Kanak-kanak (di bawah 12) RM8, warga emas (60 ke atas) RM9, pelajar dengan kad RM10, lain-lain RM15. Hari Rabu semua tiket RM7.', '**Cinema ticket prices.** Children (under 12) RM8, seniors (60 and over) RM9, students with a card RM10, everyone else RM15. On Wednesdays every ticket is RM7.'),
      CODE('ticket-price', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function ticketPrice(age, isStudent, day)
  if day == "wed" then return 7 end
  if age < 12 then return 8 end
  if age >= 60 then return 9 end
  if isStudent then return 10 end
  return 15
end

print(ticketPrice(10, false, "mon"), ticketPrice(65, false, "fri"))
print(ticketPrice(20, true, "sat"), ticketPrice(30, false, "sun"), ticketPrice(30, false, "wed"))
`, '8\t9\n10\t15\t7'),
      EXPLAIN('ticket-price',
        ['1–2', 'Peraturan paling am (Rabu) disemak dahulu supaya ia mengatasi yang lain.', 'The most general rule (Wednesday) is checked first so it overrides the others.'],
        ['3–4', 'Semakan umur dengan `<` dan `>=`.', 'Age checks with `<` and `>=`.'],
        ['5', 'Boolean digunakan terus sebagai syarat.', 'A boolean used directly as a condition.'],
        ['6', 'Harga biasa jika tiada peraturan lain terpakai.', 'The standard price if no other rule applies.'],
        ['9–10', 'Satu ujian untuk setiap peraturan.', 'One test for each rule.'])),
    S('summary',
      UL(
        ['Operator hubungan: `== ~= < > <= >=`; tidak sama ialah `~=`.', 'Relational operators: `== ~= < > <= >=`; not-equal is `~=`.'],
        ['`==` tidak pernah ralat; `<` hanya untuk dua nombor atau dua string.', '`==` never errors; `<` only works on two numbers or two strings.'],
        ['`and`/`or` memulangkan operan dan berlitar pintas; `not` memulangkan boolean.', '`and`/`or` return operands and short-circuit; `not` returns a boolean.'],
        ['Tiada perbandingan berantai: tulis `x >= a and x <= b`.', 'No chained comparisons: write `x >= a and x <= b`.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah output `print(false or nil)` dan `print(nil or false)`?', 'What is the output of `print(false or nil)` and `print(nil or false)`?'],
        ['Mengapakah `"apple" < "Banana"` palsu?', 'Why is `"apple" < "Banana"` false?'],
        ['Tulis ungkapan yang benar apabila `n` ialah nombor genap antara 1 dan 100.', 'Write an expression that is true when `n` is an even number between 1 and 100.'],
        ['Apakah yang berlaku dalam `t and t.x` jika `t` ialah `nil`?', 'What happens in `t and t.x` if `t` is `nil`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.4.4 — Relational Operators', url: `${MANUAL}#3.4.4` },
        { title: 'Lua 5.4 Reference Manual §3.4.5 — Logical Operators', url: `${MANUAL}#3.4.5` },
        { title: 'Programming in Lua (1st ed.) — 3.2 Relational Operators', url: `${PIL}/3.2.html` },
        { title: 'Programming in Lua (1st ed.) — 3.3 Logical Operators', url: `${PIL}/3.3.html` },
      )),
  ],
};

// ─── 3.3 Concatenation (..), length (#) and operator precedence ─────────────

export const LUA102_3_3: LectureContentDef = {
  courseCode: 'LUA102',
  module: 3,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan `..` untuk menggabungkan string dan nombor.', 'Use `..` to concatenate strings and numbers.'],
        ['Menggunakan `#` untuk panjang string dan jujukan (sequence), dan mengetahui hadnya.', 'Use `#` for the length of strings and sequences, and know its limits.'],
        ['Meramal susunan penilaian menggunakan jadual [[operator-precedence|keutamaan operator]].', 'Predict evaluation order using the [[operator-precedence]] table.'],
        ['Menggunakan kurungan untuk menjadikan niat jelas.', 'Use parentheses to make intent clear.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1 dan 3.2: operator aritmetik, hubungan dan logik.', 'Lectures 3.1 and 3.2: arithmetic, relational and logical operators.'],
        ['LUA101 4.1: string, `print` dan `string.format`.', 'LUA101 4.1: strings, `print` and `string.format`.'],
      )),
    S('introduction',
      P('Dua operator terakhir Lua ialah `..` (penggabungan) dan `#` (panjang). Kedua-duanya kelihatan remeh, tetapi masing-masing ada perangkap: `1..2` ialah ralat sintaks, dan `#` hanya boleh dipercayai untuk jujukan tanpa lubang. Kuliah ini juga menghimpunkan semua operator dalam satu jadual **keutamaan**, supaya anda boleh membaca mana-mana ungkapan Lua — dan tahu bila kurungan diperlukan.',
        'Lua’s last two operators are `..` (concatenation) and `#` (length). Both look trivial, but each has a trap: `1..2` is a syntax error, and `#` is only reliable for sequences without holes. This lecture also gathers every operator into one **precedence** table, so you can read any Lua expression — and know when parentheses are needed.'),
      KEY('Apabila ragu tentang keutamaan, **gunakan kurungan**. Ia percuma dan memberitahu pembaca apa yang anda maksudkan.', 'When in doubt about precedence, **use parentheses**. They are free and tell the reader what you mean.', ['Panduan', 'Rule of thumb'])),
    S('fundamental_concepts',
      UL(
        ['`a .. b` menggabungkan dua string; nombor ditukar kepada string secara automatik (`"x" .. 1` → `"x1"`).', '`a .. b` joins two strings; numbers are converted to strings automatically (`"x" .. 1` → `"x1"`).'],
        ['`..` bersekutu **kanan**: `a .. b .. c` = `a .. (b .. c)`.', '`..` is **right**-associative: `a .. b .. c` = `a .. (b .. c)`.'],
        ['`#s` = bilangan **bait** dalam string; `#t` = panjang **jujukan** (kunci 1..n tanpa lubang).', '`#s` = the number of **bytes** in a string; `#t` = the length of a **sequence** (keys 1..n with no holes).'],
        ['[[operator-precedence|Keutamaan]] (rendah → tinggi): `or` · `and` · perbandingan · `|` · `~` · `&` · `<< >>` · `..` · `+ -` · `* / // %` · unari (`not # - ~`) · `^`.', '[[operator-precedence|Precedence]] (low → high): `or` · `and` · comparisons · `|` · `~` · `&` · `<< >>` · `..` · `+ -` · `* / // %` · unary (`not # - ~`) · `^`.'],
        ['`^` dan `..` bersekutu kanan; semua operator binari lain bersekutu kiri.', '`^` and `..` are right-associative; every other binary operator is left-associative.'],
      )),
    S('detailed_theory',
      P('Operator `#` untuk table ditakrifkan hanya untuk **jujukan**: table yang kunci integer positifnya tepat 1, 2, …, n. Jika table mempunyai lubang (`{1, nil, 3}`), `#` boleh memulangkan mana-mana "sempadan" yang sah — 1 atau 3 — dan manual sengaja tidak menentukan yang mana. Kunci bukan integer (`{name = "x"}`) tidak dikira langsung. Untuk string, `#` mengira bait, jadi teks UTF-8 bukan ASCII memberi nombor lebih besar daripada bilangan aksara yang kelihatan — gunakan `utf8.len` untuk aksara.',
        'The `#` operator on tables is defined only for **sequences**: tables whose positive integer keys are exactly 1, 2, …, n. If a table has holes (`{1, nil, 3}`), `#` may return any valid "border" — 1 or 3 — and the manual deliberately does not say which. Non-integer keys (`{name = "x"}`) are not counted at all. For strings, `#` counts bytes, so non-ASCII UTF-8 text gives a larger number than the visible characters — use `utf8.len` for characters.'),
      P('Keutamaan menerangkan beberapa keputusan yang mengejutkan. `-2 ^ 2` ialah −4.0 kerana `^` lebih tinggi daripada negasi unari: ia dibaca `-(2 ^ 2)`. `"Total: " .. 1 + 2` memberi `"Total: 3"` kerana `+` lebih tinggi daripada `..`. `not a == b` dibaca `(not a) == b`, bukan `not (a == b)`. Dan `(a + b) / 2` berbeza daripada `a + b / 2` — punca biasa pepijat purata. Pengaturcara berpengalaman tidak menghafal setiap tahap; mereka menulis kurungan apabila ungkapan mencampurkan kumpulan operator.',
        'Precedence explains several surprising results. `-2 ^ 2` is −4.0 because `^` binds tighter than unary negation: it reads `-(2 ^ 2)`. `"Total: " .. 1 + 2` gives `"Total: 3"` because `+` binds tighter than `..`. `not a == b` reads `(not a) == b`, not `not (a == b)`. And `(a + b) / 2` differs from `a + b / 2` — a common source of averaging bugs. Experienced programmers do not memorise every level; they write parentheses whenever an expression mixes operator groups.')),
    S('technical_terminology', TERMS('operator-precedence', 'operator', 'coercion', 'table')),
    S('syntax_rules',
      UL(
        ['Letakkan ruang di sekeliling `..` apabila operan nombor: `1 .. 2` → `"12"`; `1..2` ialah ralat sintaks.', 'Put spaces around `..` when an operand is a number: `1 .. 2` → `"12"`; `1..2` is a syntax error.'],
        ['`#"teks"`, `#senarai`; `utf8.len(teks)` untuk aksara Unicode.', '`#"text"`, `#list`; `utf8.len(text)` for Unicode characters.'],
        ['`t[#t + 1] = v` menambah ke hujung jujukan.', '`t[#t + 1] = v` appends to the end of a sequence.'],
        ['Kurungan `( )` mengatasi semua peraturan keutamaan.', 'Parentheses `( )` override every precedence rule.'],
      )),
    S('code_demonstration',
      CODE('concat-length', 'lua', 'lua54', ['Penggabungan dan panjang', 'Concatenation and length'], `
local lang, version = "Lua", 5.4
print(lang .. " " .. version, 10 .. 20)
print(#"Malaysia", #{10, 20, 30}, #"")

local word = "café"
print(#word, utf8.len(word))
`, 'Lua 5.4\t1020\n8\t3\t0\n5\t4'),
      EXPLAIN('concat-length',
        ['1–2', '`..` menukar nombor 5.4 kepada teks. `10 .. 20` (dengan ruang) memberi string `"1020"`, bukan nombor 30.', '`..` converts the number 5.4 to text. `10 .. 20` (with spaces) gives the string `"1020"`, not the number 30.'],
        ['3', '`#` pada string (8 bait), jujukan (3 elemen) dan string kosong (0).', '`#` on a string (8 bytes), a sequence (3 elements) and the empty string (0).'],
        ['5–6', '"é" menggunakan dua bait dalam UTF-8, jadi `#word` ialah 5 tetapi `utf8.len` mengira 4 aksara.', '"é" uses two bytes in UTF-8, so `#word` is 5 while `utf8.len` counts 4 characters.'])),
    S('complete_examples',
      CODE('precedence', 'lua', 'lua54', ['Keutamaan dalam tindakan', 'Precedence in action'], `
print(2 + 3 * 4, (2 + 3) * 4)
print(-2 ^ 2, (-2) ^ 2, 2 ^ 3 ^ 2)
print("Total: " .. 1 + 2, not 1 == 2, not (1 == 2))
`, '14\t20\n-4.0\t4.0\t512.0\nTotal: 3\tfalse\ttrue'),
      EXPLAIN('precedence',
        ['1', '`*` sebelum `+`: 2 + 12 = 14. Kurungan mengubahnya: 5 × 4 = 20.', '`*` before `+`: 2 + 12 = 14. Parentheses change it: 5 × 4 = 20.'],
        ['2', '`^` lebih tinggi daripada negasi: `-(2^2)` = −4.0. `(-2)^2` = 4.0. `^` bersekutu kanan: 2^(3^2) = 2^9 = 512.0.', '`^` binds tighter than negation: `-(2^2)` = −4.0. `(-2)^2` = 4.0. `^` is right-associative: 2^(3^2) = 2^9 = 512.0.'],
        ['3', '`+` sebelum `..`: "Total: " .. 3. `not 1 == 2` ialah `(not 1) == 2` → `false == 2` → false. Dengan kurungan: `not (1 == 2)` → true.', '`+` before `..`: "Total: " .. 3. `not 1 == 2` is `(not 1) == 2` → `false == 2` → false. With parentheses: `not (1 == 2)` → true.']),
      CODE('build-list', 'lua', 'lua54', ['Menambah ke jujukan dengan #', 'Appending to a sequence with #'], `
local queue = {}
queue[#queue + 1] = "Ali"
queue[#queue + 1] = "Mei"
queue[#queue + 1] = "Raj"
print(#queue, queue[#queue], table.concat(queue, " > "))
`, '3\tRaj\tAli > Mei > Raj', {
        debug: BUG(`
local queue = {}
queue[#queue + 1] = "Ali"
print("Next: " .. queue[#queue + 1])
`, "example:3: attempt to concatenate a nil value (field '?')",
          '`queue[#queue + 1]` ialah slot **selepas** elemen terakhir — ia kosong (`nil`). Ini ungkapan yang betul untuk **menambah**, tetapi salah untuk **membaca**; elemen terakhir ialah `queue[#queue]`. Mesej menyebut `field \'?\'` kerana kunci dikira semasa runtime, jadi Lua tidak tahu namanya.',
          '`queue[#queue + 1]` is the slot **after** the last element — it is empty (`nil`). That expression is right for **appending** but wrong for **reading**; the last element is `queue[#queue]`. The message says `field \'?\'` because the key is computed at run time, so Lua has no name for it.'),
      }),
      EXPLAIN('build-list',
        ['1–4', 'Setiap baris menambah ke kedudukan selepas elemen terakhir: 1, 2, 3.', 'Each line appends at the position after the last element: 1, 2, 3.'],
        ['5', '`#queue` = 3; `queue[#queue]` ialah elemen terakhir; `table.concat` mencantum dengan pemisah.', '`#queue` = 3; `queue[#queue]` is the last element; `table.concat` joins with a separator.'])),
    S('line_by_line',
      EXPLAIN('precedence',
        ['3', 'Baris ini menunjukkan mengapa kurungan penting: `not 1 == 2` dan `not (1 == 2)` kelihatan serupa tetapi memberi jawapan yang bertentangan.', 'This line shows why parentheses matter: `not 1 == 2` and `not (1 == 2)` look similar but give opposite answers.']),
      EXPLAIN('concat-length',
        ['2', 'Hasil `..` sentiasa **string**, walaupun kedua-dua operan nombor. `math.type(10 .. 20)` ialah `nil` kerana ia bukan nombor.', 'The result of `..` is always a **string**, even when both operands are numbers. `math.type(10 .. 20)` is `nil` because it is not a number.'])),
    S('why_this_way',
      P('Mengapa Lua menggunakan `..` dan bukannya `+` untuk string? Kerana Lua menukar string kepada nombor untuk aritmetik: jika `+` juga menggabungkan, `"10" + 5` akan menjadi kabur (15 atau "105"?). Dua operator berbeza menghapuskan kekaburan itu. Mengapa `#` tidak ditakrifkan untuk table berlubang? Kerana mengira panjang tepat memerlukan imbasan penuh; takrifan "sempadan" membolehkan `#` berjalan dalam masa logaritma.',
        'Why does Lua use `..` instead of `+` for strings? Because Lua converts strings to numbers for arithmetic: if `+` also concatenated, `"10" + 5` would be ambiguous (15 or "105"?). Two different operators remove that ambiguity. Why is `#` undefined for tables with holes? Because computing an exact length would require a full scan; the "border" definition lets `#` run in logarithmic time.'),
      P('Gunakan `..` **apabila** menggabungkan beberapa kepingan; gunakan `string.format` **apabila** format penting; gunakan `#` **hanya** pada jujukan yang anda bina sendiri tanpa lubang.', 'Use `..` **when** joining a few pieces; use `string.format` **when** formatting matters; use `#` **only** on sequences you built yourself without holes.')),
    S('execution_flow',
      OL(
        ['Untuk `"Total: " .. 1 + 2`, penghurai melihat `+` mempunyai keutamaan lebih tinggi daripada `..`.', 'For `"Total: " .. 1 + 2`, the parser sees that `+` has higher precedence than `..`.'],
        ['Ia menjana kod yang mengira `1 + 2` dahulu → 3.', 'It generates code that computes `1 + 2` first → 3.'],
        ['Kemudian `..` menukar 3 kepada `"3"` dan menggabungkan → `"Total: 3"`.', 'Then `..` converts 3 to `"3"` and joins → `"Total: 3"`.'],
      )),
    S('memory_behaviour',
      P('Setiap `..` mencipta string baharu. `a .. b .. c` dalam satu ungkapan dikompil kepada **satu** arahan `CONCAT` yang mencipta satu string sahaja — cekap. Tetapi `s = s .. x` dalam gelung mencipta string baharu pada setiap pusingan dan menyalin semua teks sebelumnya (LUA101 4.1). `#` pada string dan jujukan tidak memperuntukkan memori.',
        'Every `..` creates a new string. `a .. b .. c` in one expression compiles to **one** `CONCAT` instruction that creates a single string — efficient. But `s = s .. x` in a loop creates a new string every pass and copies all previous text (LUA101 4.1). `#` on strings and sequences allocates no memory.')),
    S('alternative_implementations',
      P('Untuk mengira medan dalam table yang **bukan** jujukan, `#` tidak berguna. Kira dengan `pairs`:', 'To count the fields of a table that is **not** a sequence, `#` is useless. Count with `pairs`:'),
      CODE('count-fields', 'lua', 'lua54', ['# berbanding mengira dengan pairs', '# versus counting with pairs'], `
local player = {name = "Mei", level = 7, guild = "Red"}

local count = 0
for _ in pairs(player) do count = count + 1 end
print(#player, count)
`, '0\t3'),
      EXPLAIN('count-fields',
        ['1', 'Table rekod dengan kunci string sahaja.', 'A record table with string keys only.'],
        ['3–4', '`pairs` melawati setiap kunci, apa-apa jenis.', '`pairs` visits every key, of any type.'],
        ['5', '`#player` ialah 0 kerana tiada kunci integer 1; `pairs` mengira 3 medan.', '`#player` is 0 because there is no integer key 1; `pairs` counts 3 fields.'])),
    S('common_mistakes',
      UL(
        ['Menulis `1..2` tanpa ruang — "malformed number".', 'Writing `1..2` without spaces — "malformed number".'],
        ['Menggunakan `+` untuk menggabungkan string.', 'Using `+` to join strings.'],
        ['Menggunakan `#` pada table berlubang atau dictionary.', 'Using `#` on tables with holes or on dictionaries.'],
        ['Menjangka `#` mengira aksara UTF-8.', 'Expecting `#` to count UTF-8 characters.'],
        ['Menulis `a + b / 2` untuk purata.', 'Writing `a + b / 2` for an average.'],
      )),
    S('debugging',
      P('Dua ralat biasa dengan operator ini. Pertama, **ralat sintaks** apabila nombor bersentuhan dengan `..`: penghurai membaca `1..2` sebagai cubaan nombor perpuluhan yang rosak. Kedua, **ralat runtime** apabila `..` atau `#` menerima `nil` atau table. Mesej menyebut operasinya (`concatenate`, `get length of`) dan jenisnya. Contoh berikut menunjukkan ralat sintaks:',
        'Two errors are common with these operators. First, a **syntax error** when a number touches `..`: the parser reads `1..2` as a broken attempt at a decimal number. Second, a **runtime error** when `..` or `#` receives `nil` or a table. The message names the operation (`concatenate`, `get length of`) and the type. The following example shows the syntax error:'),
      CODE('version-label', 'lua', 'lua54', ['Label versi', 'A version label'], `
local major, minor = 5, 4
print("Lua " .. major .. "." .. minor)
`, 'Lua 5.4', {
        debug: BUG(`
local major, minor = 5, 4
print("Lua " .. 5..4)
`, "example:2: malformed number near '5..4'",
          'Tanpa ruang, lexer membaca `5..4` sebagai **satu** token nombor (digit dan titik) dan menolaknya kerana nombor tidak boleh mempunyai dua titik. Mesej `malformed number` sentiasa bermaksud masalah dalam **literal** nombor. Letakkan ruang: `5 .. 4`, atau lebih baik gunakan pemboleh ubah seperti versi asal.',
          'Without spaces, the lexer reads `5..4` as **one** number token (digits and dots) and rejects it because a number cannot have two dots. The message `malformed number` always means a problem in a numeric **literal**. Add spaces: `5 .. 4`, or better, use variables as in the original version.'),
      }),
      EXPLAIN('version-label',
        ['1', 'Nombor versi sebagai integer.', 'The version numbers as integers.'],
        ['2', 'Empat kepingan digabungkan dalam satu ungkapan (satu arahan `CONCAT`).', 'Four pieces joined in one expression (one `CONCAT` instruction).'])),
    S('performance',
      P('`#` pada jujukan adalah pantas (masa logaritma, biasanya hampir tetap). Menggabungkan beberapa kepingan dalam satu ungkapan adalah cekap; menggabungkan dalam gelung tidak. Kurungan tidak mempunyai kos runtime — ia hanya mempengaruhi cara penghurai membina kod.',
        '`#` on a sequence is fast (logarithmic time, usually nearly constant). Concatenating several pieces in one expression is efficient; concatenating in a loop is not. Parentheses have no runtime cost — they only affect how the parser builds the code.')),
    S('software_engineering',
      P('Pepijat purata klasik — kod yang bergantung pada keutamaan yang diingati dengan salah:', 'The classic averaging bug — code that relies on misremembered precedence:'),
      CODE('poor-average', 'lua', 'lua54', ['Pelaksanaan lemah: purata tanpa kurungan', 'Poor implementation: an average without parentheses'], `
local test1, test2 = 70, 90
local average = test1 + test2 / 2
print(average)
`, '115.0'),
      EXPLAIN('poor-average',
        ['1', 'Dua markah ujian.', 'Two test scores.'],
        ['2', '`/` lebih tinggi daripada `+`, jadi ini ialah 70 + 45 = 115 — purata yang lebih tinggi daripada kedua-dua markah! Tiada ralat dilaporkan.', '`/` binds tighter than `+`, so this is 70 + 45 = 115 — an "average" higher than both scores! No error is reported.'],
        ['3', 'Jawapan salah yang senyap.', 'A silently wrong answer.']),
      CODE('improved-average', 'lua', 'lua54', ['Pelaksanaan lebih baik: kurungan dan fungsi', 'Improved implementation: parentheses and a function'], `
local function average(...)
  local values = {...}
  local sum = 0
  for _, v in ipairs(values) do sum = sum + v end
  return sum / #values
end

print(average(70, 90), (70 + 90) / 2)
`, '80.0\t80.0'),
      EXPLAIN('improved-average',
        ['1–6', 'Fungsi umum: jumlahkan dahulu, **kemudian** bahagi dengan bilangan. `{...}` mengumpul semua argumen ke dalam jujukan.', 'A general function: sum first, **then** divide by the count. `{...}` collects every argument into a sequence.'],
        ['8', 'Kedua-dua bentuk yang betul memberi 80.0.', 'Both correct forms give 80.0.']),
      P('Pengajaran: apabila ungkapan mencampurkan `+` dan `/`, tulis kurungan walaupun anda pasti tentang keutamaannya — dan apabila formula digunakan semula, letakkannya dalam fungsi bernama yang boleh diuji.', 'The lesson: when an expression mixes `+` and `/`, write parentheses even if you are sure of the precedence — and when a formula is reused, put it in a named, testable function.')),
    S('industry_use_cases',
      UL(
        ['Penjanaan teks (log, mesej, HTML) menggunakan `..` untuk gabungan ringkas.', 'Text generation (logs, messages, HTML) uses `..` for short joins.'],
        ['Barisan (queue) dan tindanan (stack) ringkas dibina dengan `t[#t + 1] = v` dan `t[#t] = nil`.', 'Simple queues and stacks are built with `t[#t + 1] = v` and `t[#t] = nil`.'],
        ['Semakan kod dalam pasukan sering meminta kurungan tambahan dalam formula kewangan untuk kejelasan.', 'Code reviews in teams often ask for extra parentheses in financial formulas for clarity.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `precedence` dan tulis semula setiap ungkapan dengan kurungan penuh.', 'Run `precedence` and rewrite every expression with full parentheses.'],
        ['Dalam `concat-length`, cuba `#"ringgit"` dan `#"ریال"`; terangkan perbezaannya.', 'In `concat-length`, try `#"ringgit"` and `#"ریال"`; explain the difference.'],
        ['Betulkan `poor-average` dengan menambah kurungan sahaja.', 'Fix `poor-average` by adding parentheses only.'],
      )),
    S('mini_project',
      P('**Bar kemajuan teks.** Lukis bar kemajuan 20 aksara untuk beberapa peratusan, menggunakan `string.rep`, `..` dan `//`.', '**A text progress bar.** Draw a 20-character progress bar for several percentages, using `string.rep`, `..` and `//`.'),
      CODE('progress-bar', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local WIDTH = 20

local function bar(percent)
  local filled = percent * WIDTH // 100
  return "[" .. string.rep("#", filled) .. string.rep("-", WIDTH - filled) .. "] " .. percent .. "%"
end

for _, p in ipairs({0, 35, 100}) do
  print(bar(p))
end
`, '[--------------------] 0%\n[#######-------------] 35%\n[####################] 100%'),
      EXPLAIN('progress-bar',
        ['1', 'Lebar bar dalam aksara.', 'The bar width in characters.'],
        ['3–4', '`*` dan `//` sama keutamaan dan bersekutu kiri: (35 × 20) // 100 = 7 aksara terisi.', '`*` and `//` share a precedence level and associate left: (35 × 20) // 100 = 7 filled characters.'],
        ['5', 'Gabungkan kurungan, bahagian terisi, bahagian kosong dan label peratusan dalam satu ungkapan.', 'Join the brackets, the filled part, the empty part and the percentage label in one expression.'],
        ['8–10', 'Uji tiga nilai, termasuk sempadan 0 dan 100.', 'Test three values, including the boundaries 0 and 100.'])),
    S('summary',
      UL(
        ['`..` menggabungkan dan menukar nombor kepada string; letakkan ruang di sekelilingnya.', '`..` concatenates and converts numbers to strings; put spaces around it.'],
        ['`#` mengira bait string dan panjang jujukan; tidak boleh dipercayai untuk table berlubang atau dictionary.', '`#` counts string bytes and sequence length; unreliable for tables with holes or dictionaries.'],
        ['`^` dan unari mengikat paling kuat; `or` paling lemah; `..` dan `^` bersekutu kanan.', '`^` and unary operators bind tightest; `or` weakest; `..` and `^` are right-associative.'],
        ['Gunakan kurungan apabila mencampurkan kumpulan operator.', 'Use parentheses when mixing operator groups.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah hasil `"a" .. 2 * 3`?', 'What is the result of `"a" .. 2 * 3`?'],
        ['Mengapakah `#{name = "x"}` ialah 0?', 'Why is `#{name = "x"}` equal to 0?'],
        ['Apakah nilai `-3 ^ 2` dan mengapa?', 'What is the value of `-3 ^ 2` and why?'],
        ['Bagaimanakah anda menambah elemen ke hujung senarai `t`?', 'How do you append an element to the end of a list `t`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.4.6 — Concatenation', url: `${MANUAL}#3.4.6` },
        { title: 'Lua 5.4 Reference Manual §3.4.7 — The Length Operator', url: `${MANUAL}#3.4.7` },
        { title: 'Lua 5.4 Reference Manual §3.4.8 — Precedence', url: `${MANUAL}#3.4.8` },
        { title: 'Programming in Lua (1st ed.) — 3.5 Precedence', url: `${PIL}/3.5.html` },
      )),
  ],
};

export const LUA102_M3 = [LUA102_3_1, LUA102_3_2, LUA102_3_3];
