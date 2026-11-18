import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU102 · Module 3 — Operators (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 3.1 Arithmetic operators and floor division (//) ──────────────────────

export const LUAU102_3_1: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 3,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan [[operator|operator]] aritmetik Luau: `+ - * / // % ^` dan negatif unari.', 'Use Luau’s arithmetic [[operator|operators]]: `+ - * / // % ^` and unary minus.'],
        ['Menerangkan `//` dan `%` dengan nombor negatif (pembundaran ke bawah).', 'Explain `//` and `%` with negative numbers (rounding down).'],
        ['Meramal susunan penilaian menggunakan [[operator-precedence|keutamaan operator]].', 'Predict evaluation order using [[operator-precedence|operator precedence]].'],
        ['Menerangkan pembahagian dengan sifar dalam Luau (tiada ralat).', 'Explain division by zero in Luau (no error).'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 2: nombor sebagai float 64-bit.', 'Module 2: numbers as 64-bit floats.'],
      )),
    S('introduction',
      P('Hampir setiap sistem permainan memerlukan aritmetik: mengira kerosakan, menambah skor, menukar saat kepada minit, mencari baris dan lajur dalam grid, atau mengitar senarai animasi. Luau menyediakan operator Lua yang biasa ditambah `//` (pembahagian lantai), dipinjam daripada Lua 5.3. Kerana semua nombor ialah float, beberapa tingkah laku berbeza daripada Lua 5.4: `//` memberi float, dan pembahagian dengan sifar — walaupun `//` atau `%` — tidak pernah menimbulkan ralat.',
        'Almost every game system needs arithmetic: computing damage, adding scores, converting seconds to minutes, finding a row and column in a grid, or cycling through a list of animations. Luau provides the usual Lua operators plus `//` (floor division), borrowed from Lua 5.3. Because every number is a float, some behaviour differs from Lua 5.4: `//` gives a float, and division by zero — even with `//` or `%` — never raises an error.'),
      KEY('`//` dan `%` membundarkan **ke bawah** (ke arah −∞), jadi `-7 // 2` ialah −4 dan `-7 % 2` ialah 1.', '`//` and `%` round **down** (towards −∞), so `-7 // 2` is −4 and `-7 % 2` is 1.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`+ - *` — biasa; `/` — sentiasa pembahagian penuh (`7 / 2` ialah 3.5).', '`+ - *` — the usual; `/` — always full division (`7 / 2` is 3.5).'],
        ['`//` — pembahagian lantai: `math.floor(a / b)`.', '`//` — floor division: `math.floor(a / b)`.'],
        ['`%` — baki dengan tanda pembahagi: `a - (a // b) * b`.', '`%` — the remainder with the divisor’s sign: `a - (a // b) * b`.'],
        ['`^` — kuasa, bersekutu kanan: `2 ^ 3 ^ 2` ialah `2 ^ 9`.', '`^` — power, right-associative: `2 ^ 3 ^ 2` is `2 ^ 9`.'],
        ['Keutamaan (tinggi → rendah): `^`, unari `- not #`, `* / // %`, `+ -`, `..`, perbandingan, `and`, `or`.', 'Precedence (high → low): `^`, unary `- not #`, `* / // %`, `+ -`, `..`, comparisons, `and`, `or`.'],
      )),
    S('detailed_theory',
      P('`//` dan `%` ditakrifkan bersama supaya `a == (a // b) * b + a % b` sentiasa benar. Kerana `//` membundarkan ke arah infiniti negatif (bukan ke arah sifar seperti dalam C atau JavaScript), `%` sentiasa mempunyai tanda yang sama dengan pembahagi. Ini sangat berguna dalam permainan: `index % n` sentiasa dalam julat 0 hingga n − 1 walaupun `index` negatif, jadi mengitar senarai ke belakang berfungsi tanpa kes khas. Kedua-dua operator berfungsi dengan pecahan juga: `5.5 % 2` ialah 1.5, dan `x % 1` memberi bahagian pecahan nombor positif.',
        '`//` and `%` are defined together so that `a == (a // b) * b + a % b` always holds. Because `//` rounds towards negative infinity (not towards zero as in C or JavaScript), `%` always has the same sign as the divisor. This is very useful in games: `index % n` is always in the range 0 to n − 1 even when `index` is negative, so cycling backwards through a list works without special cases. Both operators work with fractions too: `5.5 % 2` is 1.5, and `x % 1` gives the fractional part of a positive number.'),
      P('Keutamaan operator menentukan susunan penilaian tanpa kurungan. Dua kes sering mengejutkan: `-2 ^ 2` ialah −4 (kuasa dahulu, kemudian negatif) dan `2 ^ 3 ^ 2` ialah 512 (kuasa dinilai dari kanan). Kerana nombor Luau ialah float, pembahagian dengan sifar mengikut IEEE 754: `1 / 0` ialah `inf`, `1 // 0` juga `inf`, dan `5 % 0` ialah `nan` — tiada ralat seperti `attempt to perform \'n//0\'` dalam Lua 5.4. Ini bermakna pepijat pembahagian dengan sifar dalam Luau sering **senyap**: `inf` atau `nan` merebak ke pengiraan lain. Akhir sekali, string yang kelihatan seperti nombor ditukar secara automatik dalam aritmetik (`"10" + 1` ialah 11), tetapi bergantung pada ini menyembunyikan pepijat — tukar secara eksplisit.',
        'Operator precedence decides evaluation order without parentheses. Two cases often surprise: `-2 ^ 2` is −4 (power first, then negation) and `2 ^ 3 ^ 2` is 512 (powers evaluate from the right). Because Luau numbers are floats, division by zero follows IEEE 754: `1 / 0` is `inf`, `1 // 0` is also `inf`, and `5 % 0` is `nan` — no error like Lua 5.4’s `attempt to perform \'n//0\'`. This means division-by-zero bugs in Luau are often **silent**: `inf` or `nan` spreads into other calculations. Finally, strings that look like numbers are converted automatically in arithmetic (`"10" + 1` is 11), but relying on this hides bugs — convert explicitly.')),
    S('technical_terminology', TERMS('operator', 'operator-precedence', 'coercion', 'number-subtype')),
    S('syntax_rules',
      UL(
        ['`a // b` · `a % b` · `a ^ b` · `-a`.', '`a // b` · `a % b` · `a ^ b` · `-a`.'],
        ['Gunakan kurungan apabila ragu-ragu: `(a + b) * c`, `(-2) ^ 2`.', 'Use parentheses when in doubt: `(a + b) * c`, `(-2) ^ 2`.'],
        ['Fungsi berkaitan: `math.floor`, `math.ceil`, `math.round`, `math.abs`, `math.fmod`, `math.sqrt`.', 'Related functions: `math.floor`, `math.ceil`, `math.round`, `math.abs`, `math.fmod`, `math.sqrt`.'],
      )),
    S('code_demonstration',
      CODE('arith-ops', 'luau', 'luau', ['Operator aritmetik', 'Arithmetic operators'], `
local totalSeconds = 135
local minutes = totalSeconds // 60
local seconds = totalSeconds % 60
print(\`{minutes}:{string.format("%02d", seconds)}\`)

print(7 / 2, 7 // 2, 7 % 2)
print(-7 // 2, -7 % 2)
print(2 ^ 10, 2 ^ 3 ^ 2, -2 ^ 2, (-2) ^ 2)
`, '2:15\n3.5\t3\t1\n-4\t1\n1024\t512\t-4\t4'),
      EXPLAIN('arith-ops',
        ['1–4', 'Tukar saat kepada minit:saat — `//` untuk minit penuh, `%` untuk baki saat, `%02d` untuk dua digit.', 'Convert seconds to minutes:seconds — `//` for whole minutes, `%` for the remaining seconds, `%02d` for two digits.'],
        ['6', '`/` penuh, `//` lantai, `%` baki.', '`/` full, `//` floor, `%` remainder.'],
        ['7', '`-7 // 2` = lantai(−3.5) = −4; `-7 % 2` = −7 − (−4 × 2) = 1.', '`-7 // 2` = floor(−3.5) = −4; `-7 % 2` = −7 − (−4 × 2) = 1.'],
        ['8', 'Kuasa: `2 ^ 3 ^ 2` = 2⁹ = 512; `-2 ^ 2` = −(2²) = −4.', 'Powers: `2 ^ 3 ^ 2` = 2⁹ = 512; `-2 ^ 2` = −(2²) = −4.'])),
    S('complete_examples',
      CODE('wrap-index', 'luau', 'luau', ['Mengitar senarai dengan %', 'Cycling a list with %'], `
local weapons = {"sword", "bow", "staff"}
local current = 1

local function cycle(step: number): string
  current = (current - 1 + step) % #weapons + 1
  return weapons[current]
end

print(cycle(1), cycle(1), cycle(1))
print(cycle(-1), cycle(-1))
`, 'bow\tstaff\tsword\nstaff\tbow', {
        debug: BUG(`
local weapons = {"sword", "bow", "staff"}
local current = 1
local function cycle(step: number)
  current = (current + step) % #weapons
  return weapons[current]:upper()
end
print(cycle(1), cycle(1))
`, "example:5: attempt to index nil with 'upper'",
          'Formula lupa menukar antara indeks 1-berasaskan Luau dan baki 0-berasaskan `%`. Panggilan pertama memberi `current = 2` ("bow"), tetapi yang kedua memberi `(2 + 1) % 3 = 0` — dan `weapons[0]` ialah `nil`. Formula yang betul: tolak 1, gunakan `%`, tambah 1.',
          'The formula forgets to convert between Luau’s 1-based indices and the 0-based remainder of `%`. The first call gives `current = 2` ("bow"), but the second gives `(2 + 1) % 3 = 0` — and `weapons[0]` is `nil`. The correct formula: subtract 1, apply `%`, add 1.'),
      }),
      EXPLAIN('wrap-index',
        ['1–2', 'Senarai senjata dan kedudukan semasa.', 'A weapon list and the current position.'],
        ['4–7', '`(current - 1 + step) % n + 1` — tukar kepada 0-berasaskan, kitar, tukar kembali. Berfungsi untuk langkah positif **dan** negatif kerana `%` membundarkan ke bawah.', '`(current - 1 + step) % n + 1` — convert to 0-based, wrap, convert back. Works for positive **and** negative steps because `%` rounds down.'],
        ['9–10', 'Ke hadapan tiga kali (kembali ke "sword"), kemudian ke belakang dua kali.', 'Forward three times (back to "sword"), then backward twice.']),
      CODE('divide-by-zero', 'luau', 'luau', ['Pembahagian dengan sifar dalam Luau', 'Division by zero in Luau'], `
local function averagePerPlayer(total: number, players: number): number?
  if players == 0 then
    return nil
  end
  return total / players
end

print(10 / 0, 10 // 0, -10 / 0)
print(averagePerPlayer(300, 4), averagePerPlayer(300, 0))
`, 'inf\tinf\t-inf\n75\tnil', {
        debug: BUG(`
local playersOnline = 0
local share = 1000 // playersOnline
local rounded = math.floor(share)
print(rounded + true)
`, 'example:4: attempt to perform arithmetic (add) on number and boolean',
          'Baris 2 tidak gagal — `1000 // 0` ialah `inf`, dan nilai itu merebak secara senyap ke baris 3. Ralat pertama yang kelihatan datang dari pepijat lain (menambah `true` pada baris 4). Dalam permainan sebenar, `inf` mungkin muncul sebagai ganjaran "inf" kepada pemain. Semak pembahagi sebelum membahagi, seperti `averagePerPlayer`.',
          'Line 2 does not fail — `1000 // 0` is `inf`, and that value silently spreads to line 3. The first visible error comes from a different bug (adding `true` on line 4). In a real game, `inf` might show up as a reward of "inf" to the player. Check the divisor before dividing, as `averagePerPlayer` does.'),
      }),
      EXPLAIN('divide-by-zero',
        ['1–6', 'Fungsi yang menyemak pembahagi dan memulangkan `nil` untuk "tiada pemain"; `number?` bermaksud nombor atau `nil`.', 'A function that checks the divisor and returns `nil` for "no players"; `number?` means a number or `nil`.'],
        ['8', 'Luau tidak menimbulkan ralat: `inf` dan `-inf`.', 'Luau raises no error: `inf` and `-inf`.'],
        ['9', 'Dengan semakan, kes sifar dikendalikan dengan jelas.', 'With the check, the zero case is handled clearly.'])),
    S('line_by_line',
      EXPLAIN('wrap-index',
        ['5', 'Dengan `step = -1` dan `current = 1`: (1 − 1 − 1) % 3 = −1 % 3 = 2, tambah 1 = 3 → "staff". Dalam bahasa dengan `%` yang membundarkan ke sifar, hasilnya −1 dan indeks menjadi 0.', 'With `step = -1` and `current = 1`: (1 − 1 − 1) % 3 = −1 % 3 = 2, plus 1 = 3 → "staff". In languages whose `%` rounds towards zero, the result would be −1 and the index 0.']),
      EXPLAIN('arith-ops',
        ['4', '`string.format("%02d", 15)` memberi "15"; untuk 5 ia memberi "05".', '`string.format("%02d", 15)` gives "15"; for 5 it gives "05".'])),
    S('why_this_way',
      P('Mengapa `//` dan `%` membundarkan ke bawah? Kerana ia memberi sifat matematik yang konsisten (`%` sentiasa dalam julat pembahagi) yang menjadikan kod kitaran, grid dan masa lebih ringkas. Mengapa tiada ralat pada pembahagian dengan sifar? Kerana Luau hanya mempunyai float, dan IEEE 754 mentakrifkan hasilnya — tetapi itu bermakna anda mesti menyemak sendiri.',
        'Why do `//` and `%` round down? Because it gives a consistent mathematical property (`%` is always within the divisor’s range) that makes cycling, grid and time code simpler. Why no error on division by zero? Because Luau only has floats, and IEEE 754 defines the result — but that means you must check yourself.'),
      P('Gunakan `//` **apabila** anda perlukan bilangan penuh (minit, baris); `%` **apabila** anda perlukan baki atau kitaran; semak pembahagi **apabila** ia boleh menjadi sifar (bilangan pemain, saiz senarai).', 'Use `//` **when** you need a whole count (minutes, rows); `%` **when** you need a remainder or a cycle; check the divisor **when** it can be zero (player counts, list sizes).')),
    S('execution_flow',
      OL(
        ['`cycle(-1)` dengan `current = 1`: kira `1 - 1 + (-1)` = −1.', '`cycle(-1)` with `current = 1`: compute `1 - 1 + (-1)` = −1.'],
        ['`-1 % 3` = −1 − (lantai(−1/3) × 3) = −1 − (−1 × 3) = 2.', '`-1 % 3` = −1 − (floor(−1/3) × 3) = −1 − (−1 × 3) = 2.'],
        ['2 + 1 = 3 → `weapons[3]` = "staff".', '2 + 1 = 3 → `weapons[3]` = "staff".'],
      )),
    S('memory_behaviour',
      P('Aritmetik pada nombor tidak memperuntukkan memori — hasil disimpan terus dalam daftar. Penukaran automatik string kepada nombor (`"10" + 1`) pula perlu menghurai string setiap kali; dalam gelung, tukar sekali dengan `tonumber` dan simpan nombornya.',
        'Arithmetic on numbers allocates no memory — results are stored directly in registers. Automatic string-to-number conversion (`"10" + 1`), by contrast, has to parse the string every time; in a loop, convert once with `tonumber` and keep the number.')),
    S('alternative_implementations',
      P('`math.fmod` membundarkan ke arah sifar (seperti `%` dalam C) — gunakannya hanya apabila anda benar-benar mahukan tingkah laku itu:', '`math.fmod` rounds towards zero (like `%` in C) — use it only when you really want that behaviour:'),
      CODE('fmod-vs-mod', 'luau', 'luau', ['% berbanding math.fmod', '% versus math.fmod'], `
for _, n in {7, -7} do
  print(n, n % 3, math.fmod(n, 3))
end
print(math.floor(-2.5), math.ceil(-2.5), math.round(-2.5))
`, '7\t1\t1\n-7\t2\t-1\n-3\t-2\t-3'),
      EXPLAIN('fmod-vs-mod',
        ['1–3', 'Untuk nombor positif kedua-duanya sama; untuk −7, `%` memberi 2 (lantai) dan `fmod` memberi −1 (ke arah sifar).', 'For positive numbers both agree; for −7, `%` gives 2 (floor) and `fmod` gives −1 (towards zero).'],
        ['4', 'Pembundaran: lantai, siling, dan `math.round` (Luau) yang membundarkan .5 menjauhi sifar.', 'Rounding: floor, ceiling, and `math.round` (Luau), which rounds .5 away from zero.'])),
    S('common_mistakes',
      UL(
        ['Menjangka `-7 // 2` ialah −3 (seperti dalam C).', 'Expecting `-7 // 2` to be −3 (as in C).'],
        ['Lupa bahawa `%` memberi 0-berasaskan apabila mengindeks table 1-berasaskan.', 'Forgetting that `%` is 0-based when indexing 1-based tables.'],
        ['Menulis `-x ^ 2` dan menjangka `(-x) ^ 2`.', 'Writing `-x ^ 2` and expecting `(-x) ^ 2`.'],
        ['Tidak menyemak pembahagi sifar kerana Luau tidak menimbulkan ralat.', 'Not checking for a zero divisor because Luau raises no error.'],
      )),
    S('debugging',
      P('Apabila hasil pengiraan ialah `inf`, `-inf` atau `nan`, carilah pembahagian dengan sifar atau operasi tidak sah sebelumnya — Luau tidak menghentikan program, jadi nilai itu boleh merebak jauh. Uji `x ~= x` untuk mengesan `nan` (satu-satunya nilai yang tidak sama dengan dirinya) dan `x == math.huge` untuk infiniti. Apabila mesej menyebut `attempt to perform arithmetic (…) on X and Y`, salah satu operand bukan nombor — lihat jenis yang disebut:',
        'When a calculation’s result is `inf`, `-inf` or `nan`, look for a division by zero or an invalid operation earlier — Luau does not stop the program, so the value can spread far. Test `x ~= x` to detect `nan` (the only value not equal to itself) and `x == math.huge` for infinity. When a message says `attempt to perform arithmetic (…) on X and Y`, one operand is not a number — look at the types named:'),
      CODE('detect-bad-numbers', 'luau', 'luau', ['Mengesan inf dan nan', 'Detecting inf and nan'], `
local function isFiniteNumber(x): boolean
  return typeof(x) == "number" and x == x and x ~= math.huge and x ~= -math.huge
end

local results = {12.5, 1 / 0, 0 / 0, "7"}
for i, r in results do
  print(i, isFiniteNumber(r))
end
`, '1\ttrue\n2\tfalse\n3\tfalse\n4\tfalse'),
      EXPLAIN('detect-bad-numbers',
        ['1–3', 'Nombor terhingga: jenis nombor, bukan `nan` (`x == x`), dan bukan ±infiniti.', 'A finite number: a number type, not `nan` (`x == x`), and not ±infinity.'],
        ['5–8', 'Empat hasil: biasa, infiniti, `nan` dan string.', 'Four results: ordinary, infinity, `nan` and a string.'])),
    S('performance',
      P('Operator aritmetik ialah antara arahan terpantas dalam VM Luau. `x ^ 2` dioptimumkan kepada `x * x` oleh pengkompil, dan `x // 1` lebih pantas daripada `math.floor(x)` kerana ia tidak memanggil fungsi. Penukaran string automatik adalah perlahan — elakkan dalam gelung.',
        'Arithmetic operators are among the fastest instructions in the Luau VM. `x ^ 2` is optimised to `x * x` by the compiler, and `x // 1` is faster than `math.floor(x)` because it calls no function. Automatic string conversion is slow — avoid it in loops.')),
    S('software_engineering',
      P('Nombor ajaib dalam formula berbanding pemalar bernama:', 'Magic numbers in a formula versus named constants:'),
      CODE('poor-magic-formula', 'luau', 'luau', ['Pelaksanaan lemah: nombor ajaib', 'Poor implementation: magic numbers'], `
local function damageAfterArmor(raw: number, armor: number): number
  return raw * (100 / (100 + armor)) // 1
end

print(damageAfterArmor(50, 25), damageAfterArmor(50, 100))
`, '40\t25'),
      EXPLAIN('poor-magic-formula',
        ['1–3', 'Apakah 100? Mengapa `// 1`? Formula betul tetapi pembaca mesti meneka maksudnya.', 'What is 100? Why `// 1`? The formula is correct but the reader must guess its meaning.'],
        ['5', '50 × 100/125 = 40; 50 × 100/200 = 25.', '50 × 100/125 = 40; 50 × 100/200 = 25.']),
      CODE('improved-named-formula', 'luau', 'luau', ['Pelaksanaan lebih baik: pemalar bernama', 'Improved implementation: named constants'], `
local ARMOR_SCALE = 100 -- armour equal to this value halves damage

local function damageAfterArmor(raw: number, armor: number): number
  local reduction = ARMOR_SCALE / (ARMOR_SCALE + armor)
  return math.floor(raw * reduction)
end

print(damageAfterArmor(50, 25), damageAfterArmor(50, 100))
`, '40\t25'),
      EXPLAIN('improved-named-formula',
        ['1', 'Pemalar bernama dengan komen yang menerangkan maksudnya.', 'A named constant with a comment explaining its meaning.'],
        ['3–6', 'Langkah perantaraan bernama `reduction`; `math.floor` menyatakan niat "bundarkan ke bawah" dengan jelas.', 'A named intermediate step `reduction`; `math.floor` states the "round down" intent clearly.'],
        ['8', 'Hasil yang sama.', 'The same results.'])),
    S('industry_use_cases',
      UL(
        ['Pemasa pusingan menukar saat kepada mm:ss dengan `//` dan `%`.', 'Round timers convert seconds to mm:ss with `//` and `%`.'],
        ['Sistem inventori dan kamera mengitar pilihan dengan `%`.', 'Inventory and camera systems cycle selections with `%`.'],
        ['Formula kerosakan dan ekonomi menggunakan pemalar bernama yang ditala oleh pereka.', 'Damage and economy formulas use named constants tuned by designers.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tukar 3725 saat kepada jam:minit:saat dengan `//` dan `%`.', 'Convert 3725 seconds to hours:minutes:seconds with `//` and `%`.'],
        ['Panggil `cycle(-5)` dan ramalkan senjata sebelum menjalankan.', 'Call `cycle(-5)` and predict the weapon before running.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Grid peta jubin.** Tukar antara indeks jubin (1-berasaskan) dan koordinat baris/lajur dalam grid 8 lebar, dan cari jiran kanan dengan pembungkusan di tepi.', '**A tile-map grid.** Convert between a tile index (1-based) and row/column coordinates in an 8-wide grid, and find the right neighbour with wrapping at the edge.'),
      CODE('tile-grid', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local WIDTH = 8

local function toRowCol(index: number): (number, number)
  return (index - 1) // WIDTH + 1, (index - 1) % WIDTH + 1
end

local function toIndex(row: number, col: number): number
  return (row - 1) * WIDTH + col
end

local function rightNeighbour(index: number): number
  local row, col = toRowCol(index)
  return toIndex(row, col % WIDTH + 1)
end

print(toRowCol(1), toRowCol(8), toRowCol(9))
print(toIndex(3, 5), rightNeighbour(12), rightNeighbour(16))
`, '1\t1\t2\t1\n21\t13\t9'),
      EXPLAIN('tile-grid',
        ['1', 'Lebar grid sebagai pemalar.', 'The grid width as a constant.'],
        ['3–5', 'Indeks → baris dan lajur: tolak 1, `//` dan `%`, tambah 1. Perhatikan `print` hanya menerima nilai pertama daripada panggilan yang bukan terakhir.', 'Index → row and column: subtract 1, `//` and `%`, add 1. Note that `print` receives only the first value from calls that are not last.'],
        ['7–9', 'Baris dan lajur → indeks.', 'Row and column → index.'],
        ['11–14', 'Jiran kanan dalam baris yang sama, membungkus ke lajur 1 di hujung.', 'The right neighbour in the same row, wrapping to column 1 at the end.'],
        ['16–17', 'Baris 16: hanya panggilan terakhir memberi kedua-dua nilai (baris 2, lajur 1); dua yang pertama dipotong kepada baris sahaja. Baris 17: indeks 16 (hujung baris 2) membungkus ke 9 (permulaan baris 2).', 'Line 16: only the last call gives both values (row 2, column 1); the first two are truncated to the row only. Line 17: index 16 (the end of row 2) wraps to 9 (the start of row 2).'])),
    S('summary',
      UL(
        ['`/` penuh; `//` lantai; `%` baki dengan tanda pembahagi; `^` bersekutu kanan.', '`/` full; `//` floor; `%` remainder with the divisor’s sign; `^` right-associative.'],
        ['`-2 ^ 2` = −4; gunakan kurungan apabila ragu-ragu.', '`-2 ^ 2` = −4; use parentheses when in doubt.'],
        ['Pembahagian dengan sifar memberi `inf`/`nan` — tiada ralat; semak sendiri.', 'Division by zero gives `inf`/`nan` — no error; check yourself.'],
        ['`(i - 1 + n) % size + 1` mengitar indeks 1-berasaskan.', '`(i - 1 + n) % size + 1` cycles a 1-based index.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah `-9 // 4` dan `-9 % 4`?', 'What are `-9 // 4` and `-9 % 4`?'],
        ['Mengapakah `2 ^ 3 ^ 2` ialah 512 dan bukan 64?', 'Why is `2 ^ 3 ^ 2` 512 and not 64?'],
        ['Apakah `10 // 0` dalam Luau? Bagaimana ia berbeza daripada Lua 5.4?', 'What is `10 // 0` in Luau? How does it differ from Lua 5.4?'],
        ['Bagaimanakah anda mengesan `nan`?', 'How do you detect `nan`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax: floor division', url: `${LUAU}/syntax#floor-division-` },
        { title: 'Roblox Creator Hub — Operators', url: `${DOCS}/luau/operators` },
        { title: 'Luau — Library (math)', url: `${LUAU}/library#math-library` },
        { title: 'IEEE 754 (Wikipedia) — infinities and NaN', url: 'https://en.wikipedia.org/wiki/IEEE_754' },
      )),
  ],
};

// ─── 3.2 Comparison and logical operators ──────────────────────────────────

export const LUAU102_3_2: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 3,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan operator perbandingan `== ~= < > <= >=` dan meramal hasilnya untuk pelbagai jenis.', 'Use the comparison operators `== ~= < > <= >=` and predict their results for various types.'],
        ['Menggunakan operator logik `and`, `or`, `not` dan [[short-circuit|penilaian litar pintas]].', 'Use the logical operators `and`, `or`, `not` and [[short-circuit|short-circuit evaluation]].'],
        ['Menerangkan bahawa `and`/`or` memulangkan salah satu operand, bukan semestinya boolean.', 'Explain that `and`/`or` return one of their operands, not necessarily a boolean.'],
        ['Mengelak perangkap keutamaan `not a > b`.', 'Avoid the `not a > b` precedence trap.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1: aritmetik dan keutamaan.', 'Lecture 3.1: arithmetic and precedence.'],
        ['Kuliah 2.1: truthiness.', 'Lecture 2.1: truthiness.'],
      )),
    S('introduction',
      P('Setiap keputusan dalam permainan — adakah pemain cukup syiling, adakah musuh dalam jarak, adakah pusingan tamat — dibina daripada perbandingan dan operator logik. Luau mempunyai enam operator perbandingan dan tiga operator logik. Perbandingan mudah, tetapi mempunyai peraturan jenis yang ketat: anda tidak boleh membandingkan nombor dengan string menggunakan `<`. Operator logik lebih halus: `and` dan `or` tidak memulangkan `true`/`false` tetapi salah satu operandnya, dan ia berhenti menilai sebaik sahaja jawapan diketahui — sifat yang digunakan untuk nilai lalai dan semakan selamat.',
        'Every decision in a game — does the player have enough coins, is the enemy in range, is the round over — is built from comparisons and logical operators. Luau has six comparison operators and three logical operators. Comparisons are simple but have strict type rules: you cannot compare a number with a string using `<`. Logical operators are subtler: `and` and `or` do not return `true`/`false` but one of their operands, and they stop evaluating as soon as the answer is known — a property used for default values and safe checks.'),
      KEY('`a and b` → `a` jika `a` palsu, jika tidak `b`. `a or b` → `a` jika `a` benar, jika tidak `b`.', '`a and b` → `a` if `a` is falsy, otherwise `b`. `a or b` → `a` if `a` is truthy, otherwise `b`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`==` / `~=` berfungsi untuk mana-mana jenis; jenis berbeza sentiasa tidak sama (`1 == "1"` palsu).', '`==` / `~=` work for any types; different types are never equal (`1 == "1"` is false).'],
        ['`< > <= >=` hanya untuk nombor dengan nombor, atau string dengan string; selainnya ralat.', '`< > <= >=` only for number with number, or string with string; otherwise an error.'],
        ['Table, fungsi dan buffer dibandingkan mengikut **identiti**: `{} == {}` palsu.', 'Tables, functions and buffers compare by **identity**: `{} == {}` is false.'],
        ['`not` sentiasa memulangkan boolean; `and`/`or` memulangkan operand.', '`not` always returns a boolean; `and`/`or` return an operand.'],
        ['Litar pintas: `a and b` tidak menilai `b` jika `a` palsu; `a or b` tidak menilai `b` jika `a` benar.', 'Short-circuit: `a and b` does not evaluate `b` if `a` is falsy; `a or b` does not evaluate `b` if `a` is truthy.'],
      )),
    S('detailed_theory',
      P('Perbandingan string menggunakan susunan bait (kod aksara), bukan susunan kamus: semua huruf besar datang sebelum huruf kecil (`"Z" < "a"` benar), dan nombor dalam string dibandingkan aksara demi aksara (`"10" < "9"` benar, kerana "1" < "9"). Untuk menyusun nama dengan betul, tukar kepada huruf kecil dahulu; untuk menyusun nombor, simpan sebagai nombor. Luau menolak perbandingan tertib antara jenis berbeza dengan ralat seperti `attempt to compare number < string` — perlindungan berguna kerana perbandingan sedemikian hampir selalu pepijat.',
        'String comparison uses byte (character code) order, not dictionary order: all capital letters come before lower-case ones (`"Z" < "a"` is true), and numbers inside strings are compared character by character (`"10" < "9"` is true, because "1" < "9"). To sort names properly, convert to lower case first; to sort numbers, keep them as numbers. Luau rejects ordering comparisons between different types with an error such as `attempt to compare number < string` — a useful protection, because such comparisons are almost always bugs.'),
      P('Operator logik menilai dari kiri ke kanan dan berhenti awal. Ini membolehkan semakan selamat seperti `player and player.Health > 0`: jika `player` ialah `nil`, `and` berhenti dan `player.Health` tidak pernah diakses. Begitu juga, `config.volume or 0.5` memberi lalai apabila medan tiada. Kerana `and`/`or` memulangkan operand, hasil `x or y` boleh menjadi string, nombor atau table — bukan hanya boolean. Akhir sekali, keutamaan: `not` mengikat lebih kuat daripada perbandingan, jadi `not score > 10` bermaksud `(not score) > 10` — membandingkan boolean dengan nombor, yang gagal. Tulis `not (score > 10)` atau, lebih baik, `score <= 10`.',
        'Logical operators evaluate left to right and stop early. This enables safe checks such as `player and player.Health > 0`: if `player` is `nil`, `and` stops and `player.Health` is never accessed. Likewise, `config.volume or 0.5` gives a default when the field is missing. Because `and`/`or` return an operand, the result of `x or y` may be a string, a number or a table — not just a boolean. Finally, precedence: `not` binds tighter than comparisons, so `not score > 10` means `(not score) > 10` — comparing a boolean with a number, which fails. Write `not (score > 10)` or, better, `score <= 10`.')),
    S('technical_terminology', TERMS('short-circuit', 'truthiness', 'operator-precedence', 'if-expression')),
    S('syntax_rules',
      UL(
        ['Tidak sama: `~=` (bukan `!=`).', 'Not equal: `~=` (not `!=`).'],
        ['Logik: kata kunci `and`, `or`, `not` (bukan `&&`, `||`, `!`).', 'Logic: the keywords `and`, `or`, `not` (not `&&`, `||`, `!`).'],
        ['Lalai: `x = x or nilaiLalai` — hanya apabila `false` bukan nilai yang sah.', 'Default: `x = x or defaultValue` — only when `false` is not a valid value.'],
      )),
    S('code_demonstration',
      CODE('compare-values', 'luau', 'luau', ['Perbandingan merentas jenis', 'Comparisons across types'], `
print(10 > 9, "10" > "9", "apple" < "banana", "Zebra" < "apple")
print(1 == 1.0, 1 == "1", nil == false)
local a, b = {}, {}
local c = a
print(a == b, a == c)
print(5 ~= 6, "x" ~= "x")
`, 'true\tfalse\ttrue\ttrue\ntrue\tfalse\tfalse\nfalse\ttrue\ntrue\tfalse'),
      EXPLAIN('compare-values',
        ['1', 'Nombor dibandingkan mengikut nilai; string mengikut kod aksara — "10" < "9" dan huruf besar sebelum huruf kecil.', 'Numbers compare by value; strings by character code — "10" < "9" and capitals before lower case.'],
        ['2', 'Jenis berbeza tidak pernah sama, walaupun "kelihatan" sama.', 'Different types are never equal, even when they "look" the same.'],
        ['3–5', 'Dua table kosong ialah objek berbeza; `c` merujuk objek yang sama dengan `a`.', 'Two empty tables are different objects; `c` refers to the same object as `a`.'],
        ['6', '`~=` ialah "tidak sama".', '`~=` is "not equal".'])),
    S('complete_examples',
      CODE('short-circuit-safe', 'luau', 'luau', ['Litar pintas untuk semakan selamat', 'Short-circuit for safe checks'], `
local function isAlive(player): boolean
  return player ~= nil and player.health > 0
end

print(isAlive({health = 40}), isAlive({health = 0}), isAlive(nil))

local settings = {volume = 0}
local volume = settings.volume or 0.5
local brightness = settings.brightness or 1
print(volume, brightness)
print(nil or "guest", 0 or 99, false and error("never evaluated"))
`, 'true\tfalse\tfalse\n0\t1\nguest\t0\tfalse', {
        debug: BUG(`
local score = 5
if not score > 10 then
  print("low score")
end
`, 'example:2: attempt to compare number < boolean',
          '`not` mengikat lebih kuat daripada `>`, jadi baris 2 bermaksud `(not score) > 10`. `not 5` ialah `false`, dan Luau menilai `false > 10` sebagai `10 < false` — perbandingan nombor dengan boolean, yang gagal. Tulis `if score <= 10 then` (paling jelas) atau `if not (score > 10) then`.',
          '`not` binds tighter than `>`, so line 2 means `(not score) > 10`. `not 5` is `false`, and Luau evaluates `false > 10` as `10 < false` — a comparison of a number with a boolean, which fails. Write `if score <= 10 then` (clearest) or `if not (score > 10) then`.'),
      }),
      EXPLAIN('short-circuit-safe',
        ['1–3', 'Jika `player` ialah `nil`, `and` berhenti dan `player.health` tidak pernah dibaca.', 'If `player` is `nil`, `and` stops and `player.health` is never read.'],
        ['5', 'Tiga kes termasuk `nil`, tanpa ralat.', 'Three cases including `nil`, without errors.'],
        ['7–10', '`or` untuk lalai: `0` ialah benar, jadi ia **dikekalkan**; `brightness` tiada, jadi 1 digunakan.', '`or` for defaults: `0` is truthy, so it is **kept**; `brightness` is missing, so 1 is used.'],
        ['11', '`and`/`or` memulangkan operand; `error` tidak pernah dipanggil kerana `false and …` berhenti.', '`and`/`or` return operands; `error` is never called because `false and …` stops.']),
      CODE('mixed-type-compare', 'luau', 'luau', ['Membandingkan nilai daripada teks', 'Comparing values from text'], `
local requiredLevel = 10
local savedLevel = "12"

local level = tonumber(savedLevel)
if level and level >= requiredLevel then
  print("access granted at level", level)
end
`, 'access granted at level\t12', {
        debug: BUG(`
local requiredLevel = 10
local savedLevel = "12"
if savedLevel >= requiredLevel then
  print("access granted")
end
`, 'example:3: attempt to compare number <= string',
          'String "12" dibandingkan dengan nombor 10. Luau menukar string kepada nombor dalam **aritmetik**, tetapi tidak dalam **perbandingan** — ia menimbulkan ralat. Perhatikan mesej menyebut `<=` dan susunan operand terbalik: `a >= b` dinilai sebagai `b <= a`. Tukar dengan `tonumber` dahulu.',
          'The string "12" is compared with the number 10. Luau converts strings to numbers in **arithmetic**, but not in **comparisons** — it raises an error. Note that the message says `<=` with the operands swapped: `a >= b` is evaluated as `b <= a`. Convert with `tonumber` first.'),
      }),
      EXPLAIN('mixed-type-compare',
        ['1–2', 'Nombor dan string yang kelihatan seperti nombor (contohnya daripada data yang disimpan).', 'A number and a string that looks like a number (for example from saved data).'],
        ['4–7', 'Tukar, kemudian semak `level` tidak `nil` (litar pintas) sebelum membandingkan.', 'Convert, then check that `level` is not `nil` (short-circuit) before comparing.'])),
    S('line_by_line',
      EXPLAIN('short-circuit-safe',
        ['8', '`0 or 0.5` memberi 0 kerana 0 benar dalam Luau. Dalam JavaScript, `0 || 0.5` akan memberi 0.5 — perbezaan yang penting.', '`0 or 0.5` gives 0 because 0 is truthy in Luau. In JavaScript, `0 || 0.5` would give 0.5 — an important difference.']),
      EXPLAIN('compare-values',
        ['1', '`"Zebra" < "apple"` benar kerana kod aksara "Z" (90) kurang daripada "a" (97).', '`"Zebra" < "apple"` is true because the character code of "Z" (90) is less than "a" (97).'])),
    S('why_this_way',
      P('Mengapa perbandingan jenis bercampur ialah ralat? Kerana tiada jawapan yang bermakna untuk "adakah 10 lebih besar daripada \'abc\'?", dan membenarkannya akan menyembunyikan pepijat data. Mengapa `and`/`or` memulangkan operand? Kerana ia membolehkan idiom ringkas untuk lalai dan semakan selamat tanpa sintaks tambahan.',
        'Why are mixed-type comparisons errors? Because there is no meaningful answer to "is 10 greater than \'abc\'?", and allowing it would hide data bugs. Why do `and`/`or` return operands? Because it enables short idioms for defaults and safe checks without extra syntax.'),
      P('Gunakan `x or lalai` **apabila** `false` bukan nilai sah; gunakan `a and a.b` **apabila** `a` mungkin `nil`; gunakan if-expression (kuliah 4.2) **apabila** memilih antara dua nilai di mana satu mungkin palsu.', 'Use `x or default` **when** `false` is not a valid value; use `a and a.b` **when** `a` might be `nil`; use an if-expression (lecture 4.2) **when** choosing between two values where one might be falsy.')),
    S('execution_flow',
      OL(
        ['`isAlive(nil)`: `nil ~= nil` → `false`.', '`isAlive(nil)`: `nil ~= nil` → `false`.'],
        ['`false and …` → `and` memulangkan `false` tanpa menilai sebelah kanan.', '`false and …` → `and` returns `false` without evaluating the right side.'],
        ['`player.health` tidak pernah diakses, jadi tiada ralat indeks `nil`.', '`player.health` is never accessed, so there is no `nil` index error.'],
      )),
    S('memory_behaviour',
      P('Perbandingan dan operator logik tidak memperuntukkan memori. Perbandingan string pantas kerana string di-intern: `==` hanya membandingkan rujukan. Perbandingan tertib (`<`) antara string membandingkan bait satu demi satu, jadi kosnya bergantung pada panjang awalan yang sama.',
        'Comparisons and logical operators allocate no memory. String equality is fast because strings are interned: `==` only compares references. Ordering comparisons (`<`) between strings compare bytes one by one, so their cost depends on the length of the common prefix.')),
    S('alternative_implementations',
      P('Untuk mengisih nama tanpa mengira huruf besar/kecil, bandingkan versi huruf kecil:', 'To sort names regardless of case, compare their lower-case versions:'),
      CODE('case-insensitive-sort', 'luau', 'luau', ['Isihan tanpa kepekaan huruf', 'A case-insensitive sort'], `
local names = {"zara", "Ben", "aina", "Chen"}
table.sort(names)
print(table.concat(names, " "))
table.sort(names, function(a, b)
  return a:lower() < b:lower()
end)
print(table.concat(names, " "))
`, 'Ben Chen aina zara\naina Ben Chen zara'),
      EXPLAIN('case-insensitive-sort',
        ['1–3', 'Isihan lalai menggunakan kod aksara: semua huruf besar dahulu.', 'The default sort uses character codes: all capitals first.'],
        ['4–7', 'Fungsi perbandingan membandingkan versi huruf kecil — susunan abjad yang dijangka oleh pemain.', 'The comparison function compares lower-case versions — the alphabetical order players expect.'])),
    S('common_mistakes',
      UL(
        ['Menulis `!=`, `&&`, `||` atau `!` daripada bahasa lain.', 'Writing `!=`, `&&`, `||` or `!` from other languages.'],
        ['`not a > b` dan bukannya `not (a > b)`.', '`not a > b` instead of `not (a > b)`.'],
        ['Membandingkan string nombor ("10" < "9").', 'Comparing numeric strings ("10" < "9").'],
        ['Menggunakan `x or lalai` apabila `false` ialah nilai yang sah.', 'Using `x or default` when `false` is a valid value.'],
      )),
    S('debugging',
      P('Ralat `attempt to compare X < Y` sentiasa bermaksud jenis bercampur. Perhatikan bahawa Luau melaporkan `>` dan `>=` sebagai `<` dan `<=` dengan operand ditukar, jadi baca kedua-dua jenis dan bukannya hanya operator. Untuk keadaan logik yang rumit yang memberi keputusan pelik, pecahkannya kepada local bernama dan cetak setiap satu:',
        'The error `attempt to compare X < Y` always means mixed types. Note that Luau reports `>` and `>=` as `<` and `<=` with the operands swapped, so read both types rather than just the operator. For complex logical conditions that give odd results, break them into named locals and print each one:'),
      CODE('named-conditions', 'luau', 'luau', ['Syarat bernama untuk penyahpepijatan', 'Named conditions for debugging'], `
local player = {coins = 150, level = 4, isBanned = false}
local item = {price = 120, minLevel = 5}

local canAfford = player.coins >= item.price
local levelOk = player.level >= item.minLevel
local allowed = not player.isBanned
print(canAfford, levelOk, allowed)
print("can buy:", canAfford and levelOk and allowed)
`, 'true\tfalse\ttrue\ncan buy:\tfalse'),
      EXPLAIN('named-conditions',
        ['1–2', 'Data pemain dan item.', 'Player and item data.'],
        ['4–7', 'Setiap syarat diberi nama dan dicetak: masalahnya jelas — tahap tidak mencukupi.', 'Each condition is named and printed: the problem is obvious — the level is too low.'],
        ['8', 'Gabungan akhir.', 'The final combination.'])),
    S('performance',
      P('Litar pintas juga pengoptimuman: letakkan syarat yang murah atau yang paling kerap palsu **dahulu** dalam `and`, supaya syarat yang mahal (contohnya carian dalam senarai panjang) jarang dinilai.', 'Short-circuiting is also an optimisation: put cheap conditions, or those most often false, **first** in an `and`, so expensive conditions (for example a search in a long list) are rarely evaluated.')),
    S('software_engineering',
      P('Perangkap `and/or` dengan nilai palsu berbanding semakan eksplisit:', 'The `and/or` trap with falsy values versus explicit checks:'),
      CODE('poor-or-default-bool', 'luau', 'luau', ['Pelaksanaan lemah: or untuk tetapan boolean', 'Poor implementation: or for a boolean setting'], `
local userSettings = {showHints = false}
local showHints = userSettings.showHints or true
print(showHints)
`, 'true'),
      EXPLAIN('poor-or-default-bool',
        ['1–3', 'Pemain mematikan petunjuk (`false`), tetapi `false or true` memberi `true` — tetapan diabaikan.', 'The player turned hints off (`false`), but `false or true` gives `true` — the setting is ignored.']),
      CODE('improved-nil-check-bool', 'luau', 'luau', ['Pelaksanaan lebih baik: semak nil', 'Improved implementation: check for nil'], `
local userSettings = {showHints = false}
local showHints = if userSettings.showHints == nil then true else userSettings.showHints
print(showHints)
`, 'false'),
      EXPLAIN('improved-nil-check-bool',
        ['1–3', 'Hanya `nil` (tetapan belum wujud) menerima lalai; `false` dihormati.', 'Only `nil` (a setting that does not exist yet) receives the default; `false` is respected.'])),
    S('industry_use_cases',
      UL(
        ['Semakan selamat `character and character:FindFirstChild("Humanoid")` sangat biasa dalam skrip Roblox.', 'The safe check `character and character:FindFirstChild("Humanoid")` is very common in Roblox scripts.'],
        ['Tetapan pemain menggunakan semakan `nil` supaya `false` yang disimpan dihormati.', 'Player settings use `nil` checks so a saved `false` is respected.'],
        ['Papan pendahulu mengisih nama dengan perbandingan huruf kecil.', 'Leaderboards sort names with lower-case comparisons.'],
      )),
    S('practical_demonstration',
      OL(
        ['Ramalkan `"abc" < "abd"` dan `"abc" < "ab"`, kemudian sahkan.', 'Predict `"abc" < "abd"` and `"abc" < "ab"`, then confirm.'],
        ['Tulis semula `isAlive` tanpa `and` (dengan `if`) dan bandingkan kejelasannya.', 'Rewrite `isAlive` without `and` (using `if`) and compare its clarity.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Pemeriksa kelayakan pertandingan.** Pemain layak jika: tidak diharamkan, tahap ≥ 5, dan (mempunyai tiket ATAU VIP). Laporkan sebab setiap penolakan.', '**A tournament eligibility checker.** A player is eligible if: not banned, level ≥ 5, and (has a ticket OR is VIP). Report the reason for each rejection.'),
      CODE('eligibility', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function eligibility(p): (boolean, string)
  if p.isBanned then return false, "banned" end
  if p.level < 5 then return false, \`level {p.level} is below 5\` end
  if not (p.hasTicket or p.isVip) then return false, "needs a ticket or VIP" end
  return true, "eligible"
end

local players = {
  {name = "Aina", level = 8, hasTicket = true},
  {name = "Ben", level = 3, isVip = true},
  {name = "Chen", level = 9},
  {name = "Dewi", level = 12, isVip = true, isBanned = true},
}
for _, p in players do
  print(p.name, eligibility(p))
end
`, 'Aina\ttrue\teligible\nBen\tfalse\tlevel 3 is below 5\nChen\tfalse\tneeds a ticket or VIP\nDewi\tfalse\tbanned'),
      EXPLAIN('eligibility',
        ['1–6', 'Klausa pengawal mengikut susunan; `not (a or b)` dengan kurungan yang jelas. Medan yang tiada (`nil`) dikira palsu.', 'Guard clauses in order; `not (a or b)` with clear parentheses. Missing fields (`nil`) count as false.'],
        ['8–13', 'Empat pemain menguji setiap laluan.', 'Four players test every path.'],
        ['14–16', 'Nama, keputusan dan sebab.', 'The name, the verdict and the reason.'])),
    S('summary',
      UL(
        ['`== ~=` untuk semua jenis; `< > <= >=` hanya nombor–nombor atau string–string.', '`== ~=` for all types; `< > <= >=` only number–number or string–string.'],
        ['String dibandingkan mengikut kod aksara; table mengikut identiti.', 'Strings compare by character code; tables by identity.'],
        ['`and`/`or` memulangkan operand dan berhenti awal; `not` sentiasa boolean.', '`and`/`or` return operands and stop early; `not` always gives a boolean.'],
        ['`not a > b` = `(not a) > b` — gunakan kurungan atau operator bertentangan.', '`not a > b` = `(not a) > b` — use parentheses or the opposite operator.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah hasil `nil or false`? Dan `false or nil`?', 'What is the result of `nil or false`? And `false or nil`?'],
        ['Mengapakah `"10" < "9"` benar?', 'Why is `"10" < "9"` true?'],
        ['Apakah yang dipulangkan oleh `5 and "five"`?', 'What does `5 and "five"` return?'],
        ['Tulis semula `not hp > 0` dengan betul.', 'Rewrite `not hp > 0` correctly.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Operators (relational and logical)', url: `${DOCS}/luau/operators` },
        { title: 'Luau — Syntax', url: `${LUAU}/syntax` },
        { title: 'Lua 5.1 Reference Manual §2.5.2–2.5.3 — Relational and Logical Operators', url: 'https://www.lua.org/manual/5.1/manual.html#2.5.2' },
        { title: 'Luau — Library (table.sort)', url: `${LUAU}/library#table-library` },
      )),
  ],
};

// ─── 3.3 Compound assignment: +=, -=, *= and ..= ───────────────────────────

export const LUAU102_3_3: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 3,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan [[compound-assignment|assignment majmuk]]: `+= -= *= /= //= %= ^= ..=`.', 'Use [[compound-assignment|compound assignment]]: `+= -= *= /= //= %= ^= ..=`.'],
        ['Menerangkan bahawa sasaran dinilai sekali (`t[f()] += 1`).', 'Explain that the target is evaluated once (`t[f()] += 1`).'],
        ['Mengenal pasti had: pernyataan sahaja, tiada `++`, tiada `local x += 1`.', 'Recognise the limits: statements only, no `++`, no `local x += 1`.'],
        ['Menggunakan `..=` untuk membina teks dengan betul.', 'Use `..=` to build text correctly.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1–3.2: operator aritmetik dan perbandingan.', 'Lectures 3.1–3.2: arithmetic and comparison operators.'],
      )),
    S('introduction',
      P('Kod permainan penuh dengan kemas kini: `coins = coins + 10`, `health = health - damage`, `log = log .. "\\n" .. line`. Setiap satu menyebut nama pemboleh ubah dua kali, yang panjang dan berisiko salah eja. Luau menambah **assignment majmuk**: `coins += 10`. Ia bukan sekadar kependekan — apabila sasaran ialah ungkapan seperti `inventory[slotFor(item)]`, ia dinilai **sekali** sahaja, jadi fungsi tidak dipanggil dua kali. Assignment majmuk ialah pernyataan, bukan ungkapan, dan tiada `++` — keputusan reka bentuk yang disengajakan.',
        'Game code is full of updates: `coins = coins + 10`, `health = health - damage`, `log = log .. "\\n" .. line`. Each one names the variable twice, which is long and risks typos. Luau adds **compound assignment**: `coins += 10`. It is not just shorthand — when the target is an expression such as `inventory[slotFor(item)]`, it is evaluated **once**, so the function is not called twice. Compound assignment is a statement, not an expression, and there is no `++` — a deliberate design decision.'),
      KEY('`x op= y` bermaksud `x = x op y`, dengan `x` dinilai sekali. Ia pernyataan — bukan ungkapan.', '`x op= y` means `x = x op y`, with `x` evaluated once. It is a statement — not an expression.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Lapan operator: `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `^=`, `..=`.', 'Eight operators: `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `^=`, `..=`.'],
        ['Sasaran boleh menjadi local, global, medan (`t.x`) atau indeks (`t[k]`).', 'The target can be a local, a global, a field (`t.x`) or an index (`t[k]`).'],
        ['Sasaran mesti sudah mempunyai nilai yang sesuai: `nil += 1` gagal.', 'The target must already hold a suitable value: `nil += 1` fails.'],
        ['Tidak dibenarkan: `local x += 1`, `print(x += 1)`, `x++`, `f() += 1`.', 'Not allowed: `local x += 1`, `print(x += 1)`, `x++`, `f() += 1`.'],
      )),
    S('detailed_theory',
      P('Pengkompil Luau menukar `t[k] += v` kepada urutan yang menilai `t` dan `k` sekali, membaca `t[k]`, mengira hasil, dan menulisnya kembali ke tempat yang sama. Inilah perbezaan penting daripada menulis `t[k] = t[k] + v` dengan tangan apabila `k` ialah panggilan fungsi: versi tangan memanggil fungsi dua kali, yang membazir dan salah jika fungsi mempunyai kesan sampingan (contohnya memilih slot rawak). Operator mengikut semantik operator asas: `+=` menggunakan penukaran string automatik seperti `+` (`a += "2"` berfungsi jika `a` nombor), dan `..=` menukar nombor kepada string seperti `..`.',
        'The Luau compiler turns `t[k] += v` into a sequence that evaluates `t` and `k` once, reads `t[k]`, computes the result, and writes it back to the same place. This is the important difference from writing `t[k] = t[k] + v` by hand when `k` is a function call: the hand-written version calls the function twice, which is wasteful and wrong if the function has side effects (for example choosing a random slot). The operators follow the semantics of the underlying operator: `+=` uses automatic string conversion like `+` (`a += "2"` works if `a` is a number), and `..=` converts numbers to strings like `..`.'),
      P('Mengapa tiada `x++` atau assignment sebagai ungkapan? Dalam C dan JavaScript, `if (x = 5)` dan `a[i++] = b[i++]` ialah sumber pepijat yang terkenal. Luau sengaja menjadikan assignment majmuk satu **pernyataan** sahaja: ia tidak boleh muncul di dalam ungkapan, jadi kesan sampingan tersembunyi seperti itu mustahil. Ini juga sebab `local x += 1` tidak sah — anda tidak boleh mengemas kini pemboleh ubah yang belum wujud. Pengecualian yang perlu diingat: assignment majmuk pada sasaran yang `nil` gagal dengan ralat aritmetik biasa, jadi mulakan setiap kaunter dengan nilai.',
        'Why no `x++` or assignment as an expression? In C and JavaScript, `if (x = 5)` and `a[i++] = b[i++]` are famous sources of bugs. Luau deliberately makes compound assignment a **statement** only: it cannot appear inside an expression, so such hidden side effects are impossible. That is also why `local x += 1` is invalid — you cannot update a variable that does not exist yet. One exception to remember: compound assignment on a `nil` target fails with an ordinary arithmetic error, so initialise every counter with a value.')),
    S('technical_terminology', TERMS('compound-assignment', 'operator', 'variable', 'coercion')),
    S('syntax_rules',
      UL(
        ['`x += 1` · `t.count -= 1` · `t[key] *= 2` · `s ..= "!"`.', '`x += 1` · `t.count -= 1` · `t[key] *= 2` · `s ..= "!"`.'],
        ['Mulakan dahulu: `local total = 0` kemudian `total += n`.', 'Initialise first: `local total = 0` then `total += n`.'],
        ['Ruang di sekeliling operator adalah pilihan tetapi disyorkan untuk kebolehbacaan.', 'Spaces around the operator are optional but recommended for readability.'],
      )),
    S('code_demonstration',
      CODE('compound-all', 'luau', 'luau', ['Lapan operator majmuk', 'The eight compound operators'], `
local x = 10
x += 5; print(x)
x -= 3; print(x)
x *= 2; print(x)
x /= 8; print(x)
x //= 1; print(x)
x %= 2; print(x)
x ^= 3; print(x)

local log = "start"
log ..= " -> step " .. x
print(log)
`, '15\n12\n24\n3\n3\n1\n1\nstart -> step 1'),
      EXPLAIN('compound-all',
        ['1–4', '10 + 5 = 15, − 3 = 12, × 2 = 24.', '10 + 5 = 15, − 3 = 12, × 2 = 24.'],
        ['5–6', '24 / 8 = 3; `//= 1` membundarkan ke bawah (sudah bulat).', '24 / 8 = 3; `//= 1` rounds down (already whole).'],
        ['7–8', '3 % 2 = 1; 1³ = 1.', '3 % 2 = 1; 1³ = 1.'],
        ['10–12', '`..=` menambah teks; sebelah kanan dinilai dahulu (penggabungan dengan nombor).', '`..=` appends text; the right side is evaluated first (concatenation with a number).'])),
    S('complete_examples',
      CODE('evaluate-once', 'luau', 'luau', ['Sasaran dinilai sekali', 'The target is evaluated once'], `
local slots = {sword = 1, potion = 3}
local lookups = 0

local function slotFor(item: string): string
  lookups += 1
  return item
end

slots[slotFor("potion")] += 2
print(slots.potion, lookups)

slots[slotFor("sword")] = slots[slotFor("sword")] + 1
print(slots.sword, lookups)
`, '5\t1\n2\t3', {
        debug: BUG(`
local kills = {}
kills["Aina"] += 1
`, 'example:2: attempt to perform arithmetic (add) on nil and number',
          '`kills["Aina"]` belum wujud, jadi ia `nil`, dan `nil + 1` gagal. Assignment majmuk tidak mencipta nilai awal secara automatik. Mulakan dahulu: `kills["Aina"] = (kills["Aina"] or 0) + 1`, atau isi table dengan 0 untuk setiap pemain semasa mereka menyertai.',
          '`kills["Aina"]` does not exist yet, so it is `nil`, and `nil + 1` fails. Compound assignment does not create an initial value automatically. Initialise first: `kills["Aina"] = (kills["Aina"] or 0) + 1`, or fill the table with 0 for each player when they join.'),
      }),
      EXPLAIN('evaluate-once',
        ['1–7', 'Table slot dan fungsi yang mengira berapa kali ia dipanggil.', 'A slot table and a function that counts how often it is called.'],
        ['9–10', '`+=` memanggil `slotFor` **sekali**: 3 + 2 = 5, satu carian.', '`+=` calls `slotFor` **once**: 3 + 2 = 5, one lookup.'],
        ['12–13', 'Versi tangan memanggilnya **dua kali** — tiga carian kesemuanya.', 'The hand-written version calls it **twice** — three lookups in total.']),
      CODE('build-text', 'luau', 'luau', ['Membina teks dengan ..=', 'Building text with ..='], `
local rewards = {{"coins", 50}, {"gems", 2}, {"xp", 120}}
local summary = "Rewards:"

for i, r in rewards do
  summary ..= \` {r[1]} x{r[2]}\`
  if i < #rewards then
    summary ..= ","
  end
end
print(summary)
`, 'Rewards: coins x50, gems x2, xp x120', {
        debug: BUG(`
local x = 1
x++
`, 'example:2: Incomplete statement: expected assignment or a function call',
          'Luau tidak mempunyai operator `++`. Penghurai membaca `x` dan kemudian `+`, dan pernyataan yang terhasil bukan assignment atau panggilan fungsi. Gunakan `x += 1`.',
          'Luau has no `++` operator. The parser reads `x` and then `+`, and the resulting statement is neither an assignment nor a function call. Use `x += 1`.'),
      }),
      EXPLAIN('build-text',
        ['1–2', 'Data ganjaran dan permulaan ringkasan.', 'Reward data and the start of the summary.'],
        ['4–9', 'Tambah setiap ganjaran dengan interpolasi; tambah koma kecuali selepas yang terakhir.', 'Append each reward with interpolation; add a comma except after the last one.'],
        ['10', 'Ringkasan lengkap.', 'The complete summary.'])),
    S('line_by_line',
      EXPLAIN('evaluate-once',
        ['9', '`slots[slotFor("potion")] += 2` — indeks dinilai sekali, kemudian nilai dibaca, ditambah dan ditulis ke slot yang **sama**.', '`slots[slotFor("potion")] += 2` — the index is evaluated once, then the value is read, increased and written to the **same** slot.']),
      EXPLAIN('build-text',
        ['5', 'Untuk beberapa bahagian, `..=` jelas. Untuk ratusan bahagian, kumpul dalam table dan gunakan `table.concat` (bahagian Prestasi).', 'For a few parts, `..=` is clear. For hundreds of parts, collect them in a table and use `table.concat` (Performance section).'])),
    S('why_this_way',
      P('Mengapa assignment majmuk? Kurang menaip, kurang salah eja (nama ditulis sekali), dan sasaran yang kompleks dinilai sekali. Mengapa ia pernyataan sahaja? Untuk mengelak kelas pepijat C/JavaScript di mana assignment tersembunyi di dalam ungkapan.',
        'Why compound assignment? Less typing, fewer typos (the name is written once), and complex targets are evaluated once. Why is it a statement only? To avoid the class of C/JavaScript bugs in which assignments hide inside expressions.'),
      P('Gunakan `op=` **setiap kali** anda mengemas kini pemboleh ubah berdasarkan nilainya sendiri; gunakan assignment biasa **apabila** nilai baharu tidak bergantung pada yang lama.', 'Use `op=` **every time** you update a variable based on its own value; use ordinary assignment **when** the new value does not depend on the old one.')),
    S('execution_flow',
      OL(
        ['`slots[slotFor("potion")] += 2`: nilai `slots` dan `slotFor("potion")` → "potion" (satu panggilan).', '`slots[slotFor("potion")] += 2`: evaluate `slots` and `slotFor("potion")` → "potion" (one call).'],
        ['Baca `slots["potion"]` → 3.', 'Read `slots["potion"]` → 3.'],
        ['Kira 3 + 2 = 5 dan tulis ke `slots["potion"]`.', 'Compute 3 + 2 = 5 and write it to `slots["potion"]`.'],
      )),
    S('memory_behaviour',
      P('`+=` pada nombor tidak memperuntukkan memori. `..=` pada string mencipta string baharu setiap kali (string tidak boleh diubah), jadi membina string panjang dengan `..=` dalam gelung besar mencipta banyak string perantaraan — kerja tambahan untuk pengutip sampah.',
        '`+=` on numbers allocates no memory. `..=` on strings creates a new string every time (strings are immutable), so building a long string with `..=` in a big loop creates many intermediate strings — extra work for the garbage collector.')),
    S('alternative_implementations',
      P('Untuk banyak bahagian, kumpul dalam table dan cantum sekali:', 'For many parts, collect them in a table and join once:'),
      CODE('concat-table', 'luau', 'luau', ['table.concat untuk banyak bahagian', 'table.concat for many parts'], `
local parts = {}
for level = 1, 5 do
  table.insert(parts, \`L{level}\`)
end
print(table.concat(parts, " > "))
`, 'L1 > L2 > L3 > L4 > L5'),
      EXPLAIN('concat-table',
        ['1–4', 'Setiap bahagian dimasukkan ke dalam table — tiada string perantaraan yang besar.', 'Each part is inserted into a table — no large intermediate strings.'],
        ['5', '`table.concat` membina string akhir sekali sahaja.', '`table.concat` builds the final string only once.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan `+=` pada medan yang belum dimulakan (`nil`).', 'Using `+=` on a field that has not been initialised (`nil`).'],
        ['Menulis `x++`, `++x` atau `x--` (`--` memulakan komen!).', 'Writing `x++`, `++x` or `x--` (`--` starts a comment!).'],
        ['`local total += n` — pemboleh ubah mesti wujud dahulu.', '`local total += n` — the variable must exist first.'],
        ['Menggunakan `..=` dalam gelung dengan ribuan pusingan dan bukannya `table.concat`.', 'Using `..=` in loops with thousands of passes instead of `table.concat`.'],
      )),
    S('debugging',
      P('Ralat `attempt to perform arithmetic (add) on nil and number` pada baris `+=` hampir selalu bermaksud sasaran belum dimulakan. Cetak nilai sasaran sebelum baris itu. Kesilapan halus lain: `x--` tidak menimbulkan ralat — `--` memulakan komen, jadi baris itu hanya `x`, yang mungkin ralat sintaks atau, lebih teruk, diabaikan dengan senyap jika diikuti sesuatu yang sah. Contoh berikut menunjukkan pola kaunter yang selamat untuk kunci baharu:',
        'The error `attempt to perform arithmetic (add) on nil and number` on a `+=` line almost always means the target was not initialised. Print the target’s value before that line. Another subtle mistake: `x--` raises no error by itself — `--` starts a comment, so the line is just `x`, which is either a syntax error or, worse, silently ignored if followed by something valid. The following example shows a safe counter pattern for new keys:'),
      CODE('safe-counter', 'luau', 'luau', ['Kaunter yang selamat untuk kunci baharu', 'A safe counter for new keys'], `
local hits = {}

local function recordHit(name: string)
  hits[name] = (hits[name] or 0) + 1
end

for _, who in {"Aina", "Ben", "Aina", "Aina"} do
  recordHit(who)
end
print(hits.Aina, hits.Ben, hits.Chen)
`, '3\t1\tnil'),
      EXPLAIN('safe-counter',
        ['1', 'Table kosong — tiada kunci lagi.', 'An empty table — no keys yet.'],
        ['3–5', '`(hits[name] or 0) + 1` memberi 1 untuk kunci baharu; `+=` tidak boleh digunakan kerana sasaran mungkin `nil`.', '`(hits[name] or 0) + 1` gives 1 for a new key; `+=` cannot be used because the target may be `nil`.'],
        ['7–10', 'Aina dipukul tiga kali, Ben sekali, Chen tidak pernah.', 'Aina was hit three times, Ben once, Chen never.'])),
    S('performance',
      P('`x += 1` dikompil kepada bytecode yang sama dengan `x = x + 1` untuk local, jadi tiada perbezaan kelajuan. Untuk sasaran indeks yang kompleks, `+=` lebih pantas kerana indeks dinilai sekali. Untuk string, `table.concat` jauh lebih pantas daripada `..=` berulang dalam gelung besar.',
        '`x += 1` compiles to the same bytecode as `x = x + 1` for locals, so there is no speed difference. For complex indexed targets, `+=` is faster because the index is evaluated once. For strings, `table.concat` is much faster than repeated `..=` in large loops.')),
    S('software_engineering',
      P('Kemas kini panjang yang mengulang nama berbanding assignment majmuk:', 'Long updates that repeat names versus compound assignment:'),
      CODE('poor-long-updates', 'luau', 'luau', ['Pelaksanaan lemah: nama berulang', 'Poor implementation: repeated names'], `
local playerStats = {experiencePoints = 900, goldCoins = 40}
playerStats.experiencePoints = playerStats.experiencePoints + 150
playerStats.goldCoins = playerStats.goldCoins + 25
print(playerStats.experiencePoints, playerStats.goldCoins)
`, '1050\t65'),
      EXPLAIN('poor-long-updates',
        ['1–4', 'Setiap kemas kini menulis laluan medan dua kali — panjang, dan salah eja dalam salah satunya mencipta medan baharu secara senyap.', 'Each update writes the field path twice — long, and a typo in either one silently creates a new field.']),
      CODE('improved-compound-updates', 'luau', 'luau', ['Pelaksanaan lebih baik: assignment majmuk', 'Improved implementation: compound assignment'], `
local playerStats = {experiencePoints = 900, goldCoins = 40}
playerStats.experiencePoints += 150
playerStats.goldCoins += 25
print(playerStats.experiencePoints, playerStats.goldCoins)
`, '1050\t65'),
      EXPLAIN('improved-compound-updates',
        ['1–4', 'Setiap laluan ditulis sekali; niat "tambah" jelas.', 'Each path is written once; the "add" intent is clear.'])),
    S('industry_use_cases',
      UL(
        ['Sistem statistik pemain mengemas kini kiraan dengan `+=` pada setiap peristiwa.', 'Player statistics systems update counts with `+=` on every event.'],
        ['Pemasa mengurangkan masa yang tinggal dengan `timeLeft -= dt` setiap bingkai.', 'Timers reduce the remaining time with `timeLeft -= dt` every frame.'],
        ['Log dan mesej chat dibina dengan `..=` untuk beberapa bahagian, `table.concat` untuk banyak.', 'Logs and chat messages are built with `..=` for a few parts, `table.concat` for many.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis semula `x = x * 2 + 1` menggunakan dua assignment majmuk.', 'Rewrite `x = x * 2 + 1` using two compound assignments.'],
        ['Dalam `evaluate-once`, tukar baris 12 kepada `+=` dan ramalkan bilangan carian.', 'In `evaluate-once`, change line 12 to `+=` and predict the number of lookups.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Pemasa pusingan.** Simulasikan 10 "bingkai" sebanyak 0.25 saat setiap satu, mengurangkan masa yang tinggal, mengumpul skor, dan membina log peristiwa — menggunakan assignment majmuk.', '**A round timer.** Simulate 10 "frames" of 0.25 seconds each, reducing the remaining time, accumulating a score, and building an event log — using compound assignment.'),
      CODE('round-timer', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local timeLeft = 2
local score = 0
local events = "events:"
local DT = 0.25

for frame = 1, 10 do
  if timeLeft <= 0 then
    events ..= \` end@{frame}\`
    break
  end
  timeLeft -= DT
  score += if frame % 3 == 0 then 10 else 1
  if frame % 3 == 0 then events ..= \` bonus@{frame}\` end
end
print(timeLeft, score, events)
`, '0\t26\tevents: bonus@3 bonus@6 end@9'),
      EXPLAIN('round-timer',
        ['1–4', 'Keadaan pemasa, skor, log dan langkah masa.', 'Timer state, score, log and the time step.'],
        ['6–10', 'Hentikan apabila masa habis, dan rekod bingkai tamat.', 'Stop when time runs out, and record the end frame.'],
        ['11–13', 'Kurangkan masa, tambah skor (10 pada setiap bingkai ketiga), dan log bonus.', 'Reduce the time, add to the score (10 every third frame), and log bonuses.'],
        ['15', 'Lapan bingkai × 0.25 = 2 saat; skor 6 × 1 + 2 × 10 = 26.', 'Eight frames × 0.25 = 2 seconds; score 6 × 1 + 2 × 10 = 26.'])),
    S('summary',
      UL(
        ['`x op= y` = `x = x op y` dengan sasaran dinilai sekali.', '`x op= y` = `x = x op y` with the target evaluated once.'],
        ['Lapan operator, termasuk `..=` untuk string.', 'Eight operators, including `..=` for strings.'],
        ['Pernyataan sahaja: tiada `++`, tiada `local x += 1`, tiada dalam ungkapan.', 'Statements only: no `++`, no `local x += 1`, not inside expressions.'],
        ['Mulakan sasaran sebelum menggunakan `op=`.', 'Initialise the target before using `op=`.'],
      )),
    S('knowledge_check',
      OL(
        ['Berapa kali `f()` dipanggil dalam `t[f()] += 1`?', 'How many times is `f()` called in `t[f()] += 1`?'],
        ['Mengapakah `x--` tidak mengurangkan `x`?', 'Why does `x--` not decrease `x`?'],
        ['Apakah yang berlaku dengan `t.count += 1` jika `t.count` belum wujud?', 'What happens with `t.count += 1` if `t.count` does not exist yet?'],
        ['Bilakah `table.concat` lebih baik daripada `..=`?', 'When is `table.concat` better than `..=`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax: compound assignments', url: `${LUAU}/syntax#compound-assignments` },
        { title: 'Luau RFC — Compound assignment operators', url: 'https://github.com/luau-lang/rfcs/blob/master/docs/syntax-compound-assignment.md' },
        { title: 'Roblox Creator Hub — Operators (compound assignment)', url: `${DOCS}/luau/operators#compound-assignment` },
        { title: 'Luau — Library (table.concat)', url: `${LUAU}/library#table-library` },
      )),
  ],
};

export const LUAU102_M3 = [LUAU102_3_1, LUAU102_3_2, LUAU102_3_3];
