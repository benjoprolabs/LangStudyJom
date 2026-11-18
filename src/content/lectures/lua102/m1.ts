import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUA102 · Module 1 — Variables and Basic Scope, lectures 1.2 and 1.3 (1.1 is the reference lecture in
 * ../lua102-1-1.ts and is not changed here). Standard Lua 5.4; verified by `npm run verify:code`.
 */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 1.2 Multiple assignment and swapping values ───────────────────────────

export const LUA102_1_2: LectureContentDef = {
  courseCode: 'LUA102',
  module: 1,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan peraturan [[multiple-assignment|assignment berbilang]]: semua nilai dinilai dahulu, kemudian diberikan.', 'Explain the [[multiple-assignment]] rule: all values are evaluated first, then assigned.'],
        ['Meramal hasil apabila bilangan nama dan nilai tidak sama.', 'Predict the result when the numbers of names and values differ.'],
        ['Menukar, memutar dan mengemas kini beberapa nilai sekaligus tanpa pemboleh ubah sementara.', 'Swap, rotate and update several values at once without temporary variables.'],
        ['Menerima beberapa nilai pulangan daripada fungsi pustaka seperti `string.find`.', 'Receive several return values from library functions such as `string.find`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['LUA102 1.1: `local`, global dan contoh `multi-assign` asas.', 'LUA102 1.1: `local`, globals and the basic `multi-assign` example.'],
        ['LUA101: table dan indeks yang bermula dari 1.', 'LUA101: tables and indexes that start at 1.'],
      )),
    S('introduction',
      P('Kuliah 1.1 menunjukkan bahawa `a, b = b, a` menukar dua nilai. Kuliah ini menerangkan **mengapa** ia berfungsi, dan bagaimana peraturan yang sama membolehkan anda memutar tiga nilai, mengemas kini jujukan Fibonacci dalam satu baris, dan menerima beberapa keputusan daripada satu panggilan fungsi. Kita juga melihat kes yang mengejutkan: indeks table dalam assignment berbilang.',
        'Lecture 1.1 showed that `a, b = b, a` swaps two values. This lecture explains **why** it works, and how the same rule lets you rotate three values, update a Fibonacci sequence in one line, and receive several results from one function call. We also look at a surprising case: table indexes inside a multiple assignment.'),
      KEY('Lua menilai **semua ungkapan di sebelah kanan** dahulu, kemudian barulah membuat assignment.', 'Lua evaluates **every expression on the right-hand side** first, and only then performs the assignments.', ['Peraturan utama', 'The key rule'])),
    S('fundamental_concepts',
      UL(
        ['**Senarai pemboleh ubah** di kiri dan **senarai ungkapan** di kanan, dipisahkan oleh koma.', 'A **variable list** on the left and an **expression list** on the right, separated by commas.'],
        ['Nilai kurang: nama tambahan menerima `nil`. Nilai lebih: nilai tambahan **dibuang** (tetapi tetap dinilai).', 'Too few values: extra names receive `nil`. Too many values: extra values are **discarded** (but still evaluated).'],
        ['Panggilan fungsi **terakhir** dalam senarai boleh menyumbang semua nilai pulangannya; panggilan di tempat lain menyumbang tepat satu.', 'The **last** function call in the list can contribute all its return values; a call anywhere else contributes exactly one.'],
        ['Indeks seperti `t[i]` di sebelah kiri dinilai **sebelum** sebarang assignment berlaku.', 'Indexes such as `t[i]` on the left are evaluated **before** any assignment happens.'],
      )),
    S('detailed_theory',
      P('Manual rujukan Lua menyatakan: dalam assignment berbilang, Lua menilai semua nilai dahulu dan hanya kemudian melaksanakan assignment. Pelaksanaannya menyimpan setiap nilai dalam **daftar sementara** sebelum menulis mana-mana pemboleh ubah. Itulah sebabnya `a, b = b, a` tidak memerlukan pemboleh ubah `temp`: nilai lama `b` dan `a` sudah selamat dalam daftar sementara sebelum `a` ditimpa. Tanpa peraturan ini, baris yang sama akan memberi `a` dan `b` nilai yang sama.',
        'The Lua reference manual states: in a multiple assignment, Lua first evaluates all values and only then executes the assignments. The implementation keeps every value in a **temporary register** before writing any variable. That is why `a, b = b, a` needs no `temp` variable: the old values of `b` and `a` are already safe in temporary registers before `a` is overwritten. Without this rule, the same line would give `a` and `b` the same value.'),
      P('Peraturan ini juga meliputi ungkapan **indeks** di sebelah kiri. Manual memberi contoh `i, a[i] = i+1, 20`: jika `i` ialah 3 sebelum baris itu, maka `a[3]` (bukan `a[4]`) menerima 20, kerana `i` dalam `a[i]` dinilai sebelum `i` diberi nilai 4. Namun manual juga menyatakan **tertib** assignment itu sendiri tidak ditentukan — jadi jangan tulis kod yang bergantung pada sama ada `x` atau `y` ditulis dahulu dalam `x, y = …`.',
        'This rule also covers **index** expressions on the left. The manual gives the example `i, a[i] = i+1, 20`: if `i` is 3 before that line, then `a[3]` (not `a[4]`) receives 20, because the `i` in `a[i]` is evaluated before `i` is assigned 4. However, the manual also says the **order** of the assignments themselves is undefined — so never write code that depends on whether `x` or `y` is written first in `x, y = …`.')),
    S('technical_terminology', TERMS('multiple-assignment', 'variable', 'table', 'function')),
    S('syntax_rules',
      UL(
        ['`local a, b, c = e1, e2, e3` — pengisytiharan berbilang.', '`local a, b, c = e1, e2, e3` — a multiple declaration.'],
        ['`a, b = b, a` — tukar dua pemboleh ubah sedia ada.', '`a, b = b, a` — swap two existing variables.'],
        ['`t[1], t[2] = t[2], t[1]` — sasaran boleh berupa medan atau elemen table.', '`t[1], t[2] = t[2], t[1]` — targets can be table fields or elements.'],
        ['`local s, e = string.find(teks, corak)` — terima beberapa nilai pulangan.', '`local s, e = string.find(text, pattern)` — receive several return values.'],
        ['Kurungan `(f())` memotong hasil fungsi kepada **satu** nilai.', 'Parentheses `(f())` truncate a function’s results to **one** value.'],
      )),
    S('code_demonstration',
      CODE('fibonacci-step', 'lua', 'lua54', ['Fibonacci dengan assignment serentak', 'Fibonacci with simultaneous assignment'], `
local a, b = 0, 1
for _ = 1, 8 do
  io.write(a, " ")
  a, b = b, a + b
end
print()
`, '0 1 1 2 3 5 8 13 '),
      EXPLAIN('fibonacci-step',
        ['1', 'Dua nombor Fibonacci pertama.', 'The first two Fibonacci numbers.'],
        ['2–3', 'Lapan langkah; setiap langkah menulis nombor semasa tanpa baris baharu.', 'Eight steps; each step writes the current number without a newline.'],
        ['4', 'Sebelah kanan dikira dahulu menggunakan nilai **lama**: `b` dan `a + b`. Hanya kemudian `a` dan `b` dikemas kini. Satu baris menggantikan tiga baris dengan pemboleh ubah sementara.', 'The right-hand side is computed first using the **old** values: `b` and `a + b`. Only then are `a` and `b` updated. One line replaces three lines with a temporary variable.'],
        ['6', '`print()` menamatkan baris output.', '`print()` ends the output line.'])),
    S('complete_examples',
      CODE('rotate-three', 'lua', 'lua54', ['Memutar tiga nilai dan menukar elemen table', 'Rotating three values and swapping table elements'], `
local first, second, third = "red", "green", "blue"
first, second, third = second, third, first
print(first, second, third)

local podium = {"Ali", "Mei", "Raj"}
podium[1], podium[3] = podium[3], podium[1]
print(table.concat(podium, ", "))
`, 'green\tblue\tred\nRaj, Mei, Ali', {
        debug: BUG(`
local first, second, third = "red", "green", "blue"
first, second, third = second, third
print(first .. ", " .. second .. ", " .. third)
`, "example:3: attempt to concatenate a nil value (local 'third')",
          'Putaran ditulis dengan **dua** nilai untuk tiga nama, jadi `third` menerima `nil` secara senyap — assignment berbilang tidak pernah mengadu tentang nilai yang kurang. Ralat hanya muncul pada baris 3 apabila `nil` digabungkan. Apabila nama di kiri dan nilai di kanan tidak sama banyak, semak semula baris itu: setiap nama memerlukan nilainya sendiri (`second, third, first`).',
          'The rotation is written with **two** values for three names, so `third` silently receives `nil` — a multiple assignment never complains about missing values. The error only appears on line 3 when the `nil` is concatenated. Whenever the names on the left and the values on the right differ in number, re-check that line: every name needs its own value (`second, third, first`).'),
      }),
      EXPLAIN('rotate-three',
        ['1', 'Tiga nilai dalam tiga local.', 'Three values in three locals.'],
        ['2', 'Putaran ke kiri: setiap pemboleh ubah menerima nilai jirannya. Kerana semua nilai dibaca dahulu, `first` yang lama ("red") masih tersedia untuk `third`.', 'A left rotation: each variable receives its neighbour’s value. Because all values are read first, the old `first` ("red") is still available for `third`.'],
        ['3', 'Keputusan: green, blue, red.', 'Result: green, blue, red.'],
        ['5–6', 'Sasaran boleh berupa elemen table: tempat pertama dan ketiga ditukar.', 'Targets can be table elements: first and third places are swapped.'],
        ['7', '`table.concat` mencantum elemen dengan pemisah.', '`table.concat` joins the elements with a separator.']),
      CODE('evaluate-first', 'lua', 'lua54', ['Indeks dinilai sebelum assignment', 'Indexes are evaluated before assignment'], `
local slots = {"a", "b", "c", "d"}
local i = 3
i, slots[i] = i + 1, "X"
print(i, table.concat(slots))
`, '4\tabXd'),
      EXPLAIN('evaluate-first',
        ['1–2', 'Empat slot dan indeks `i = 3`.', 'Four slots and the index `i = 3`.'],
        ['3', 'Contoh daripada manual Lua. `i + 1` (4) dan `"X"` dinilai; **indeks** dalam `slots[i]` juga dinilai sekarang — sebagai 3. Kemudian `i` menjadi 4 dan `slots[3]` menjadi "X".', 'The example from the Lua manual. `i + 1` (4) and `"X"` are evaluated; the **index** in `slots[i]` is also evaluated now — as 3. Then `i` becomes 4 and `slots[3]` becomes "X".'],
        ['4', '`slots[3]` diubah, bukan `slots[4]`: output `abXd`.', '`slots[3]` changed, not `slots[4]`: the output is `abXd`.'])),
    S('line_by_line',
      EXPLAIN('fibonacci-step',
        ['4', 'Bandingkan dengan dua baris berasingan `a = b` diikuti `b = a + b`: baris kedua akan menggunakan `a` yang **baharu**, dan jujukan menjadi 0, 1, 2, 4, 8 … — gandaan, bukan Fibonacci.', 'Compare with two separate lines `a = b` then `b = a + b`: the second line would use the **new** `a`, and the sequence becomes 0, 1, 2, 4, 8 … — doubling, not Fibonacci.']),
      EXPLAIN('evaluate-first',
        ['3', 'Peraturan "nilai dahulu, assignment kemudian" menjadikan baris ini boleh diramal. Namun kod yang bergantung pada kehalusan seperti ini sukar dibaca; dalam kod sebenar, tulis dua baris yang jelas.', 'The "values first, assignments later" rule makes this line predictable. Still, code that depends on such subtleties is hard to read; in real code, write two clear lines.'])),
    S('why_this_way',
      P('Mengapa Lua menilai semua nilai dahulu? Kerana ia menjadikan assignment berbilang **atomik dari sudut pembaca**: semua nilai di kanan merujuk kepada keadaan **sebelum** baris itu. Ini menghapuskan keperluan pemboleh ubah sementara untuk tukaran dan putaran, dan menjadikan kemas kini berpasangan seperti Fibonacci atau koordinat `x, y = y, -x` (putaran 90°) ringkas dan betul.',
        'Why does Lua evaluate all values first? Because it makes a multiple assignment **atomic from the reader’s point of view**: every value on the right refers to the state **before** the line. This removes the need for temporary variables in swaps and rotations, and makes paired updates such as Fibonacci or the coordinate rotation `x, y = y, -x` (90°) short and correct.'),
      P('Gunakan assignment berbilang **apabila** nilai-nilai berkaitan dan dikemas kini bersama (koordinat, pasangan min/maks, tukaran). Elakkannya apabila nilai tidak berkaitan — satu pernyataan setiap baris lebih mudah dibaca.', 'Use multiple assignment **when** the values are related and updated together (coordinates, min/max pairs, swaps). Avoid it when the values are unrelated — one statement per line is easier to read.')),
    S('execution_flow',
      OL(
        ['Dalam `rotate-three` baris 2, Lua membaca `second` ("green"), `third` ("blue") dan `first` ("red") ke daftar sementara.', 'In `rotate-three` line 2, Lua reads `second` ("green"), `third` ("blue") and `first` ("red") into temporary registers.'],
        ['Kemudian ia menulis daftar sementara ke `first`, `second` dan `third`.', 'Then it writes the temporaries into `first`, `second` and `third`.'],
        ['Pada baris 6, Lua menilai `podium[3]` dan `podium[1]` ("Raj", "Ali") dan indeks sasaran 1 dan 3.', 'On line 6, Lua evaluates `podium[3]` and `podium[1]` ("Raj", "Ali") and the target indexes 1 and 3.'],
        ['Ia menyimpan "Raj" di indeks 1 dan "Ali" di indeks 3.', 'It stores "Raj" at index 1 and "Ali" at index 3.'],
      )),
    S('memory_behaviour',
      P('Nilai sementara disimpan dalam daftar mesin maya, bukan dalam heap, jadi tukaran dan putaran tidak mencipta sampah. Menukar dua elemen table hanya menukar **nilai** dalam slot table; jika elemen itu ialah table atau string, hanya rujukan yang disalin — objek itu sendiri tidak disalin.',
        'Temporary values live in virtual-machine registers, not on the heap, so swaps and rotations create no garbage. Swapping two table elements only exchanges the **values** in the table’s slots; if those elements are tables or strings, only references are copied — the objects themselves are not copied.')),
    S('alternative_implementations',
      P('Tanpa assignment berbilang, tukaran memerlukan pemboleh ubah sementara — gaya yang biasa dalam C atau Java:', 'Without multiple assignment, a swap needs a temporary variable — the usual style in C or Java:'),
      CODE('temp-swap', 'lua', 'lua54', ['Tukaran dengan pemboleh ubah sementara', 'A swap with a temporary variable'], `
local left, right = 5, 9
local temp = left
left = right
right = temp
print(left, right)
`, '9\t5'),
      EXPLAIN('temp-swap',
        ['1', 'Dua nilai untuk ditukar.', 'Two values to swap.'],
        ['2–4', 'Simpan nilai kiri, timpa kiri dengan kanan, kemudian pulihkan kanan daripada salinan.', 'Save the left value, overwrite left with right, then restore right from the copy.'],
        ['5', 'Keputusan sama seperti `left, right = right, left`, tetapi dengan tiga baris dan satu nama tambahan.', 'The same result as `left, right = right, left`, but with three lines and an extra name.']),
      P('Kedua-duanya betul. Gaya Lua yang idiomatik ialah `a, b = b, a`; versi sementara berguna jika kod perlu diterjemahkan ke bahasa lain.', 'Both are correct. The idiomatic Lua style is `a, b = b, a`; the temporary version is useful when code may be translated to another language.')),
    S('common_mistakes',
      UL(
        ['Menulis `a = b` kemudian `b = a` untuk menukar — kedua-duanya berakhir dengan nilai `b`.', 'Writing `a = b` then `b = a` to swap — both end with `b`’s value.'],
        ['Menjangka nilai tambahan disimpan di suatu tempat — ia dibuang.', 'Expecting extra values to be stored somewhere — they are discarded.'],
        ['Terlupa bahawa panggilan fungsi yang **bukan terakhir** hanya memberi satu nilai: `local a, b, c = f(), 0` memberi `c = nil` walaupun `f` memulangkan dua nilai.', 'Forgetting that a function call that is **not last** gives only one value: `local a, b, c = f(), 0` leaves `c = nil` even if `f` returns two values.'],
        ['Bergantung pada tertib assignment dalam `x, y = …`, yang tidak ditentukan oleh bahasa.', 'Relying on the order of assignments in `x, y = …`, which the language leaves undefined.'],
      )),
    S('debugging',
      P('Pepijat assignment berbilang biasanya senyap: tiada ralat, hanya `nil` yang tidak dijangka. Ralat muncul kemudian, apabila `nil` itu digunakan. Apabila anda melihat `attempt to … a nil value (local \'x\')` dan `x` diberi nilai dalam assignment berbilang, semak **bilangan** nilai yang sebenarnya dipulangkan. `print(select("#", f()))` memberitahu berapa banyak nilai yang dipulangkan oleh `f`. Contoh berikut menunjukkan fungsi pustaka yang memulangkan `nil` apabila carian gagal:',
        'Multiple-assignment bugs are usually silent: no error, just an unexpected `nil`. The error appears later, when that `nil` is used. When you see `attempt to … a nil value (local \'x\')` and `x` was assigned in a multiple assignment, check how many values were really returned. `print(select("#", f()))` tells you how many values `f` returned. The following example shows a library function that returns `nil` when a search fails:'),
      CODE('find-range', 'lua', 'lua54', ['string.find memulangkan dua kedudukan', 'string.find returns two positions'], `
local text = "learning lua"
local first, last = string.find(text, "lua")
print(first, last, last - first + 1)
`, '10\t12\t3', {
        debug: BUG(`
local text = "learning lua"
local first, last = string.find(text, "luau")
print(first, last, last - first + 1)
`, "example:3: attempt to perform arithmetic on a nil value (local 'last')",
          '"luau" tidak wujud dalam teks, jadi `string.find` memulangkan **satu** nilai: `nil`. Assignment berbilang memberikan `nil` kepada `first` dan juga `last`. Ralat hanya muncul pada baris 3 apabila `last - first` dikira. Semak hasil carian (`if first then … end`) sebelum menggunakannya.',
          '"luau" does not occur in the text, so `string.find` returns **one** value: `nil`. The multiple assignment gives `nil` to `first` and to `last`. The error only appears on line 3 when `last - first` is computed. Check the search result (`if first then … end`) before using it.'),
      }),
      EXPLAIN('find-range',
        ['1', 'Teks yang dicari.', 'The text being searched.'],
        ['2', '`string.find` memulangkan kedudukan mula **dan** tamat padanan; dua local menerimanya.', '`string.find` returns the start **and** end positions of the match; two locals receive them.'],
        ['3', '"lua" bermula di 10 dan berakhir di 12; panjangnya 3.', '"lua" starts at 10 and ends at 12; its length is 3.'])),
    S('performance',
      P('Assignment berbilang dikompil kepada arahan `MOVE` antara daftar — sama pantas atau lebih pantas daripada versi dengan pemboleh ubah sementara. Menerima beberapa nilai pulangan juga tidak mencipta table, tidak seperti memulangkan `{a, b}`. Untuk fungsi yang sangat kerap, memulangkan beberapa nilai lebih cekap daripada membina table kecil.',
        'A multiple assignment compiles to `MOVE` instructions between registers — as fast as, or faster than, the version with a temporary variable. Receiving several return values creates no table, unlike returning `{a, b}`. For very frequent functions, returning several values is more efficient than building a small table.')),
    S('software_engineering',
      P('Bandingkan dua fungsi yang mencari markah terendah dan tertinggi:', 'Compare two functions that find the lowest and highest scores:'),
      CODE('poor-two-passes', 'lua', 'lua54', ['Pelaksanaan lemah: dua fungsi, dua laluan', 'Poor implementation: two functions, two passes'], `
local scores = {72, 95, 58, 81}

local function lowest(list)
  local m = list[1]
  for _, v in ipairs(list) do if v < m then m = v end end
  return m
end

local function highest(list)
  local m = list[1]
  for _, v in ipairs(list) do if v > m then m = v end end
  return m
end

print(lowest(scores), highest(scores))
`, '58\t95'),
      EXPLAIN('poor-two-passes',
        ['1', 'Senarai markah.', 'The list of scores.'],
        ['3–7', 'Fungsi pertama melawati senarai untuk minimum.', 'The first function walks the list for the minimum.'],
        ['9–13', 'Fungsi kedua mengulang kod yang hampir sama untuk maksimum — duplikasi dan laluan kedua atas data.', 'The second function repeats almost the same code for the maximum — duplication and a second pass over the data.'],
        ['15', 'Dua panggilan, dua laluan.', 'Two calls, two passes.']),
      CODE('improved-min-max', 'lua', 'lua54', ['Pelaksanaan lebih baik: satu laluan, dua nilai pulangan', 'Improved implementation: one pass, two return values'], `
local scores = {72, 95, 58, 81}

local function range(list)
  local low, high = list[1], list[1]
  for _, v in ipairs(list) do
    if v < low then low = v end
    if v > high then high = v end
  end
  return low, high
end

local low, high = range(scores)
print(low, high, high - low)
`, '58\t95\t37'),
      EXPLAIN('improved-min-max',
        ['1', 'Senarai yang sama.', 'The same list.'],
        ['3–10', 'Satu laluan mengemas kini kedua-dua nilai; `return low, high` memulangkan pasangan tanpa table.', 'One pass updates both values; `return low, high` returns the pair without a table.'],
        ['12–13', 'Assignment berbilang menerima kedua-dua nilai; julat ialah 37.', 'A multiple assignment receives both values; the range is 37.']),
      P('Versi kedua menghapuskan duplikasi, melawati data sekali, dan menunjukkan dengan jelas bahawa minimum dan maksimum ialah **satu konsep** — julat. Nilai pulangan berbilang ialah cara Lua untuk memulangkan hasil berkaitan tanpa kos table.', 'The second version removes duplication, visits the data once, and shows clearly that minimum and maximum are **one concept** — a range. Multiple return values are Lua’s way to return related results without the cost of a table.')),
    S('industry_use_cases',
      UL(
        ['Enjin permainan mengemas kini kedudukan dan halaju bersama: `x, y = x + vx * dt, y + vy * dt`.', 'Game engines update position and velocity together: `x, y = x + vx * dt, y + vy * dt`.'],
        ['Algoritma isihan (bubble sort, quicksort) menukar elemen dengan `t[i], t[j] = t[j], t[i]`.', 'Sorting algorithms (bubble sort, quicksort) swap elements with `t[i], t[j] = t[j], t[i]`.'],
        ['Penghurai teks menggunakan `local s, e, capture = string.find(…)` untuk mendapatkan kedudukan dan tangkapan sekaligus.', 'Text parsers use `local s, e, capture = string.find(…)` to get positions and captures at once.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `fibonacci-step`, kemudian tukar baris 4 kepada dua baris berasingan dan bandingkan output.', 'Run `fibonacci-step`, then change line 4 into two separate lines and compare the output.'],
        ['Dalam `rotate-three`, tulis putaran ke **kanan** dan sahkan keputusannya.', 'In `rotate-three`, write a **right** rotation and confirm the result.'],
        ['Jalankan versi berpepijat `find-range` dan betulkannya dengan semakan `if`.', 'Run the buggy version of `find-range` and fix it with an `if` check.'],
      )),
    S('mini_project',
      P('**Putaran grid 90°.** Putar empat titik segi empat sama 90° mengikut arah jam menggunakan `x, y = y, -x`, dan paparkan setiap titik sebelum dan selepas.', '**A 90° grid rotation.** Rotate the four corners of a square 90° clockwise using `x, y = y, -x`, and display each point before and after.'),
      CODE('rotate-points', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local corners = {{1, 0}, {1, 1}, {0, 1}, {0, 0}}

for _, p in ipairs(corners) do
  local x, y = p[1], p[2]
  local before = "(" .. x .. "," .. y .. ")"
  x, y = y, -x
  print(before .. " -> (" .. x .. "," .. y .. ")")
end
`, '(1,0) -> (0,-1)\n(1,1) -> (1,-1)\n(0,1) -> (1,0)\n(0,0) -> (0,0)'),
      EXPLAIN('rotate-points',
        ['1', 'Empat titik sebagai pasangan `{x, y}`.', 'Four points as `{x, y}` pairs.'],
        ['3–4', 'Untuk setiap titik, salin koordinat ke dua local dengan assignment berbilang.', 'For each point, copy the coordinates into two locals with a multiple assignment.'],
        ['5', 'Simpan teks "sebelum" sebelum koordinat berubah.', 'Save the "before" text before the coordinates change.'],
        ['6', 'Putaran 90° ikut arah jam: `y` baharu ialah `-x` **lama**. Peraturan "nilai dahulu" menjamin `-x` menggunakan `x` asal. Perhatikan `-0` dalam Lua integer ialah `0`.', 'A 90° clockwise rotation: the new `y` is the **old** `-x`. The "values first" rule guarantees `-x` uses the original `x`. Note that integer `-0` in Lua is `0`.'],
        ['7', 'Paparkan transformasi.', 'Display the transformation.'])),
    S('summary',
      UL(
        ['Lua menilai semua nilai di kanan dahulu, kemudian membuat assignment.', 'Lua evaluates all right-hand values first, then performs the assignments.'],
        ['Nilai kurang menjadi `nil`; nilai lebih dibuang.', 'Missing values become `nil`; extra values are discarded.'],
        ['Hanya panggilan fungsi terakhir menyumbang semua nilai pulangannya.', 'Only the last function call contributes all its return values.'],
        ['Tukaran, putaran dan kemas kini berpasangan tidak memerlukan pemboleh ubah sementara.', 'Swaps, rotations and paired updates need no temporary variables.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah nilai `a`, `b`, `c` selepas `local a, b, c = 1, 2, 3, 4`?', 'What are `a`, `b`, `c` after `local a, b, c = 1, 2, 3, 4`?'],
        ['Mengapakah `a = b; b = a` tidak menukar dua nilai?', 'Why does `a = b; b = a` not swap two values?'],
        ['Jika `i = 1`, elemen mana yang berubah dalam `i, t[i] = 2, "X"`?', 'If `i = 1`, which element changes in `i, t[i] = 2, "X"`?'],
        ['Berapa nilai yang diterima oleh `local p, q = (string.find("abc", "b"))`?', 'How many values does `local p, q = (string.find("abc", "b"))` receive?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.3.3 — Assignment', url: `${MANUAL}#3.3.3` },
        { title: 'Lua 5.4 Reference Manual §3.4.12 — Lists of expressions, multiple results and adjustment', url: `${MANUAL}#3.4.12` },
        { title: 'Lua 5.4 Reference Manual — string.find', url: `${MANUAL}#pdf-string.find` },
        { title: 'Programming in Lua (1st ed.) — 4.1 Assignment', url: `${PIL}/4.1.html` },
      )),
  ],
};

// ─── 1.3 Naming conventions and reserved words ─────────────────────────────

export const LUA102_1_3: LectureContentDef = {
  courseCode: 'LUA102',
  module: 1,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis nama (identifier) yang sah mengikut peraturan leksikal Lua.', 'Write valid names (identifiers) according to Lua’s lexical rules.'],
        ['Mengenal pasti 22 [[reserved-word|nama terpelihara]] dan menggunakan kunci table yang sama dengannya dengan selamat.', 'Recognise the 22 [[reserved-word|reserved words]] and safely use table keys that match them.'],
        ['Mengikut konvensyen penamaan biasa Lua: local, pemalar, nama tidak digunakan `_` dan nama dalaman `_UPPER`.', 'Follow common Lua naming conventions: locals, constants, the unused name `_` and internal `_UPPER` names.'],
        ['Mengelak membayangi (shadowing) fungsi pustaka standard.', 'Avoid shadowing standard library functions.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['LUA102 1.1–1.2: pemboleh ubah dan assignment.', 'LUA102 1.1–1.2: variables and assignment.'],
        ['LUA101 3.3: senarai kata kunci dan blok.', 'LUA101 3.3: the keyword list and blocks.'],
      )),
    S('introduction',
      P('Nama ialah antara muka pertama antara kod anda dan pembaca seterusnya — selalunya diri anda sendiri enam bulan kemudian. Lua mempunyai peraturan **tegas** tentang nama yang sah (pengkompil menolak yang lain) dan **konvensyen** yang diikuti oleh komuniti (pengkompil tidak peduli, tetapi pasukan peduli). Kuliah ini membezakan kedua-duanya.',
        'Names are the first interface between your code and its next reader — often yourself six months later. Lua has **strict rules** about which names are valid (the compiler rejects others) and **conventions** that the community follows (the compiler does not care, but teams do). This lecture separates the two.'),
      KEY('Peraturan menentukan sama ada kod **dikompil**; konvensyen menentukan sama ada kod **difahami**.', 'Rules decide whether code **compiles**; conventions decide whether code is **understood**.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Peraturan:** nama terdiri daripada huruf, digit dan `_`, tidak bermula dengan digit, dan bukan [[reserved-word|nama terpelihara]].', '**Rule:** a name consists of letters, digits and `_`, does not start with a digit, and is not a [[reserved-word]].'],
        ['**Peka huruf:** `total`, `Total` dan `TOTAL` ialah tiga nama berbeza.', '**Case-sensitive:** `total`, `Total` and `TOTAL` are three different names.'],
        ['**Huruf:** hanya huruf ASCII dijamin; huruf beraksen seperti `é` bergantung pada locale dan tidak mudah alih.', '**Letters:** only ASCII letters are guaranteed; accented letters such as `é` depend on the locale and are not portable.'],
        ['**Konvensyen:** `snake_case` atau `camelCase` untuk local (pilih satu per projek), `UPPER_CASE` untuk pemalar, `PascalCase` untuk table modul/kelas.', '**Conventions:** `snake_case` or `camelCase` for locals (pick one per project), `UPPER_CASE` for constants, `PascalCase` for module/class tables.'],
        ['**`_`** untuk nilai yang sengaja diabaikan; nama `_UPPER` (seperti `_G`, `_VERSION`) dikhaskan untuk Lua sendiri.', '**`_`** for values deliberately ignored; `_UPPER` names (like `_G`, `_VERSION`) are reserved for Lua itself.'],
      )),
    S('detailed_theory',
      P('Pengimbas leksikal (lexer) Lua membaca nama sebagai jujukan huruf, digit dan garis bawah, kemudian menyemak sama ada jujukan itu sama dengan salah satu daripada 22 kata kunci. Jika ya, ia menjadi token kata kunci dan tidak boleh digunakan sebagai nama pemboleh ubah. Namun kata kunci **boleh** menjadi kunci string dalam table: `t["end"]` sah kerana `"end"` ialah string, bukan nama. Hanya bentuk singkatan `t.end` yang ditolak, kerana selepas titik penghurai menjangkakan nama.',
        'Lua’s lexer reads a name as a run of letters, digits and underscores, then checks whether that run equals one of the 22 keywords. If it does, it becomes a keyword token and cannot be used as a variable name. A keyword **can**, however, be a string key in a table: `t["end"]` is valid because `"end"` is a string, not a name. Only the shorthand `t.end` is rejected, because after the dot the parser expects a name.'),
      P('Nama fungsi pustaka standard seperti `print`, `type`, `string` dan `table` **bukan** kata kunci — ia hanyalah global biasa. Ini bermakna anda boleh menimpanya secara tidak sengaja: `local type = "admin"` menyembunyikan fungsi `type` dalam skop itu. Kod selepasnya yang memanggil `type(x)` akan cuba memanggil string. Konvensyen penamaan yang baik (contohnya `userType`) dan linter mengelakkan pembayangan seperti ini.',
        'Standard library names such as `print`, `type`, `string` and `table` are **not** keywords — they are ordinary globals. That means you can overwrite them by accident: `local type = "admin"` hides the `type` function in that scope. Later code that calls `type(x)` will try to call a string. Good naming conventions (for example `userType`) and a linter prevent this kind of shadowing.')),
    S('technical_terminology', TERMS('reserved-word', 'variable', 'scope', 'language-server')),
    S('syntax_rules',
      UL(
        ['Sah: `score`, `player_2`, `_count`, `MAX_LIVES`, `isReady`. Tidak sah: `2nd`, `my-name`, `end`, `local`.', 'Valid: `score`, `player_2`, `_count`, `MAX_LIVES`, `isReady`. Invalid: `2nd`, `my-name`, `end`, `local`.'],
        ['Kata kunci sebagai kunci table: `t["end"]` atau `{["for"] = 1}` — bukan `t.end`.', 'Keywords as table keys: `t["end"]` or `{["for"] = 1}` — not `t.end`.'],
        ['`for _, value in ipairs(list)` — `_` menandakan indeks tidak digunakan.', '`for _, value in ipairs(list)` — `_` marks the unused index.'],
        ['Nama boolean dibaca seperti soalan: `isEmpty`, `hasKey`, `canJump`.', 'Boolean names read like questions: `isEmpty`, `hasKey`, `canJump`.'],
      )),
    S('code_demonstration',
      CODE('valid-names', 'lua', 'lua54', ['Nama yang sah dan peka huruf', 'Valid names and case sensitivity'], `
local score, Score, SCORE = 1, 2, 3
local player_2, _hidden, isReady = "Mei", true, false

print(score, Score, SCORE)
print(player_2, _hidden, isReady)
`, '1\t2\t3\nMei\ttrue\tfalse'),
      EXPLAIN('valid-names',
        ['1', 'Tiga pemboleh ubah **berbeza** kerana Lua peka huruf. Sah, tetapi mengelirukan — jangan buat ini dalam kod sebenar.', 'Three **different** variables because Lua is case-sensitive. Valid, but confusing — do not do this in real code.'],
        ['2', 'Digit dibenarkan selepas huruf pertama; garis bawah boleh di mana-mana; `isReady` ialah nama boolean yang baik.', 'Digits are allowed after the first character; underscores anywhere; `isReady` is a good boolean name.'],
        ['4–5', 'Setiap nama memegang nilainya sendiri.', 'Each name holds its own value.'])),
    S('complete_examples',
      CODE('keyword-keys', 'lua', 'lua54', ['Kata kunci sebagai kunci table', 'Keywords as table keys'], `
local schedule = {["for"] = "Aisyah", ["end"] = "17:00"}
schedule["while"] = "lunch"

print(schedule["for"], schedule["end"], schedule["while"])
`, 'Aisyah\t17:00\tlunch', {
        debug: BUG(`
local schedule = {["for"] = "Aisyah", ["end"] = "17:00"}
print(schedule.end)
`, "example:2: <name> expected near 'end'",
          'Selepas titik, penghurai menjangkakan **nama**, tetapi `end` ialah kata kunci, jadi kod gagal dikompil. Mesej `<name> expected near \'end\'` bermaksud "saya perlukan nama, tetapi menemui `end`". Gunakan bentuk kurungan `schedule["end"]`, atau pilih kunci lain seperti `endTime`.',
          'After the dot the parser expects a **name**, but `end` is a keyword, so the code fails to compile. The message `<name> expected near \'end\'` means "I needed a name but found `end`". Use the bracket form `schedule["end"]`, or choose another key such as `endTime`.'),
      }),
      EXPLAIN('keyword-keys',
        ['1', 'Dalam pembina table, kunci kata kunci mesti ditulis dalam kurungan sebagai string: `["for"]`.', 'In a table constructor, keyword keys must be written in brackets as strings: `["for"]`.'],
        ['2', 'Bentuk kurungan juga berfungsi untuk assignment.', 'The bracket form also works for assignment.'],
        ['4', 'Bacaan melalui kurungan berfungsi untuk mana-mana string.', 'Reading through brackets works for any string.']),
      CODE('reserved-check', 'lua', 'lua54', ['Menguji nama terpelihara dengan pengkompil', 'Testing reserved words with the compiler'], `
local candidates = {"goto", "until", "continue", "class", "nil", "self", "print"}

for _, word in ipairs(candidates) do
  local ok = load("local " .. word .. " = 1") ~= nil
  print(word, ok and "usable name" or "reserved")
end
`, 'goto\treserved\nuntil\treserved\ncontinue\tusable name\nclass\tusable name\nnil\treserved\nself\tusable name\nprint\tusable name'),
      EXPLAIN('reserved-check',
        ['1', 'Perkataan yang sering disangka kata kunci, bercampur dengan kata kunci sebenar.', 'Words often mistaken for keywords, mixed with real keywords.'],
        ['3–4', 'Untuk setiap perkataan, cuba kompil `local <perkataan> = 1`. `load` memulangkan fungsi jika nama sah, atau `nil` jika ia kata kunci.', 'For each word, try to compile `local <word> = 1`. `load` returns a function if the name is valid, or `nil` if it is a keyword.'],
        ['5', '`goto`, `until` dan `nil` ialah kata kunci. `continue` dan `class` **bukan** kata kunci dalam Lua (`continue` ialah kata kunci Luau, bukan Lua). `self` dan `print` juga nama biasa.', '`goto`, `until` and `nil` are keywords. `continue` and `class` are **not** keywords in Lua (`continue` is a Luau keyword, not a Lua one). `self` and `print` are ordinary names too.'])),
    S('line_by_line',
      EXPLAIN('reserved-check',
        ['4', 'Teknik "tanya pengkompil": daripada menghafal, kita menguji peraturan bahasa dengan bahasa itu sendiri. `~= nil` menukar hasil `load` kepada boolean.', 'The "ask the compiler" technique: instead of memorising, we test the language’s rules with the language itself. `~= nil` turns `load`’s result into a boolean.']),
      EXPLAIN('valid-names',
        ['1', 'Konvensyen pasukan biasanya melarang nama yang hanya berbeza pada huruf besar/kecil, kerana ia mudah tertukar.', 'Team conventions usually forbid names that differ only in letter case, because they are easily confused.'])),
    S('why_this_way',
      P('Mengapa kata kunci dikhaskan? Supaya penghurai boleh membaca struktur program tanpa kekaburan: jika `end` boleh menjadi nama pemboleh ubah, `x = end` tidak boleh dihuraikan. Mengapa konvensyen? Kerana nama ialah dokumentasi yang sentiasa ada: `local seconds_remaining = 30` menerangkan dirinya, `local t = 30` tidak. Konvensyen yang konsisten membolehkan pembaca meneka jenis nilai daripada rupa namanya (`MAX_SPEED` ialah pemalar, `Player` ialah kelas, `isOpen` ialah boolean).',
        'Why are keywords reserved? So the parser can read a program’s structure without ambiguity: if `end` could be a variable name, `x = end` could not be parsed. Why conventions? Because names are documentation that is always present: `local seconds_remaining = 30` explains itself, `local t = 30` does not. Consistent conventions let readers guess what kind of value something is from its shape (`MAX_SPEED` is a constant, `Player` a class, `isOpen` a boolean).'),
      P('Ikut konvensyen projek yang sedia ada **apabila** menyertai kod orang lain — konsistensi lebih penting daripada pilihan peribadi. Untuk projek baharu, tetapkan konvensyen dalam panduan gaya dan kuatkuasakan dengan linter.', 'Follow the existing project convention **when** joining someone else’s code — consistency matters more than personal preference. For new projects, set the convention in a style guide and enforce it with a linter.')),
    S('execution_flow',
      OL(
        ['Untuk `reserved-check`, setiap lelaran membina string seperti `local goto = 1`.', 'For `reserved-check`, each iteration builds a string such as `local goto = 1`.'],
        ['Lexer memecahkannya kepada token; `goto` dikenali sebagai kata kunci.', 'The lexer splits it into tokens; `goto` is recognised as a keyword.'],
        ['Penghurai menjangkakan nama selepas `local`, menemui kata kunci, dan `load` memulangkan `nil` serta mesej.', 'The parser expects a name after `local`, finds a keyword, and `load` returns `nil` plus a message.'],
        ['Untuk `continue`, lexer menghasilkan token nama biasa, kompilasi berjaya, dan `load` memulangkan fungsi.', 'For `continue`, the lexer produces an ordinary name token, compilation succeeds, and `load` returns a function.'],
      )),
    S('memory_behaviour',
      P('Nama local tidak wujud semasa runtime kecuali dalam maklumat debug — pemboleh ubah local menjadi nombor daftar, jadi nama panjang yang deskriptif **tiada kos** prestasi atau memori. Nama global pula ialah kunci string dalam table `_ENV`, disimpan sekali sebagai string yang di-intern. Kunci table seperti `"end"` juga di-intern. Tiada sebab prestasi untuk memendekkan nama.',
        'Local names do not exist at run time except in debug information — local variables become register numbers, so long descriptive names have **no** performance or memory cost. Global names are string keys in the `_ENV` table, stored once as interned strings. Table keys such as `"end"` are interned too. There is no performance reason to shorten names.')),
    S('alternative_implementations',
      P('Daripada kunci kata kunci seperti `["end"]`, reka bentuk yang lebih bersih memilih nama yang **tidak** bertembung dengan kata kunci, supaya sintaks titik boleh digunakan:', 'Instead of keyword keys such as `["end"]`, a cleaner design picks names that do **not** clash with keywords, so dot syntax can be used:'),
      CODE('clean-keys', 'lua', 'lua54', ['Kunci yang tidak bertembung dengan kata kunci', 'Keys that avoid keyword clashes'], `
local schedule = {owner = "Aisyah", endTime = "17:00", breakActivity = "lunch"}
print(schedule.owner, schedule.endTime, schedule.breakActivity)
`, 'Aisyah\t17:00\tlunch'),
      EXPLAIN('clean-keys',
        ['1', '`endTime` dan `breakActivity` lebih deskriptif daripada `end` dan `while`, dan sah sebagai nama.', '`endTime` and `breakActivity` are more descriptive than `end` and `while`, and valid as names.'],
        ['2', 'Sintaks titik berfungsi untuk semua kunci.', 'Dot syntax works for every key.']),
      P('Kunci kata kunci masih diperlukan apabila data datang dari luar (contohnya JSON dengan medan `"end"`) — dalam kes itu gunakan bentuk kurungan.', 'Keyword keys are still needed when data comes from outside (for example JSON with an `"end"` field) — in that case use the bracket form.')),
    S('common_mistakes',
      UL(
        ['Menggunakan sengkang dalam nama (`player-name`) — Lua membacanya sebagai `player - name`.', 'Using a hyphen in a name (`player-name`) — Lua reads it as `player - name`.'],
        ['Memulakan nama dengan digit (`2player`) — ralat "malformed number".', 'Starting a name with a digit (`2player`) — a "malformed number" error.'],
        ['Membayangi fungsi pustaka: `local string = "abc"` kemudian memanggil `string.upper`.', 'Shadowing a library function: `local string = "abc"` and then calling `string.upper`.'],
        ['Mencampur `snake_case` dan `camelCase` dalam satu projek.', 'Mixing `snake_case` and `camelCase` in one project.'],
        ['Mencipta nama `_UPPER` sendiri, yang dikhaskan untuk Lua.', 'Inventing your own `_UPPER` names, which are reserved for Lua.'],
      )),
    S('debugging',
      P('Ralat nama terbahagi kepada dua jenis. **Ralat kompil** berlaku apabila nama melanggar peraturan leksikal — kata kunci di tempat nama, atau nama bermula dengan digit — dan mesej menyebut token berhampiran. **Ralat runtime** berlaku apabila nama yang sah membayangi sesuatu yang penting, seperti fungsi pustaka. Mesej runtime menyebut **jenis** nilai yang anda cuba panggil — petunjuk kuat bahawa sesuatu telah ditimpa:',
        'Naming errors come in two kinds. **Compile errors** happen when a name breaks the lexical rules — a keyword where a name is expected, or a name starting with a digit — and the message mentions the nearby token. **Runtime errors** happen when a valid name shadows something important, such as a library function. The runtime message names the **type** of the value you tried to call — a strong hint that something was overwritten:'),
      CODE('shadowed-type', 'lua', 'lua54', ['Nama yang tidak membayangi fungsi pustaka', 'A name that does not shadow a library function'], `
local userType = "admin"
print(userType, type(userType))
`, 'admin\tstring', {
        debug: BUG(`
local type = "admin"
print(type, type(type))
`, "example:2: attempt to call a string value (local 'type')",
          'Baris 1 mencipta local bernama `type` yang membayangi fungsi pustaka `type`. Pada baris 2, `type(type)` cuba memanggil string `"admin"`. Mesej menyebut `call a string value (local \'type\')` — memanggil string ialah tanda pasti bahawa nama fungsi telah ditimpa. Namakan semula pemboleh ubah (`userType`).',
          'Line 1 creates a local named `type` that shadows the library function `type`. On line 2, `type(type)` tries to call the string `"admin"`. The message says `call a string value (local \'type\')` — calling a string is a sure sign that a function name was overwritten. Rename the variable (`userType`).'),
      }),
      EXPLAIN('shadowed-type',
        ['1', 'Nama deskriptif yang tidak bertembung dengan pustaka standard.', 'A descriptive name that does not clash with the standard library.'],
        ['2', '`type` masih fungsi pustaka, jadi `type(userType)` memulangkan `"string"`.', '`type` is still the library function, so `type(userType)` returns `"string"`.'])),
    S('performance',
      P('Nama tidak menjejaskan kelajuan program: panjang nama local hilang selepas kompilasi, dan nama global ialah string yang di-intern. Satu-satunya pertimbangan prestasi ialah **global berbanding local** (LUA102 1.1), bukan panjang atau gaya nama. Pilih nama untuk manusia.',
        'Names do not affect program speed: the length of a local name disappears after compilation, and global names are interned strings. The only performance consideration is **global versus local** (LUA102 1.1), not the length or style of a name. Choose names for humans.')),
    S('software_engineering',
      P('Bandingkan dua versi kod yang sama dari segi logik:', 'Compare two versions of logically identical code:'),
      CODE('poor-names', 'lua', 'lua54', ['Pelaksanaan lemah: nama samar', 'Poor implementation: vague names'], `
local d = {120, 95, 140}
local t = 0
for _, x in ipairs(d) do t = t + x end
local f = t > 300
print(t, f)
`, '355\ttrue'),
      EXPLAIN('poor-names',
        ['1–2', '`d` dan `t` tidak memberitahu apa-apa. Data apa? Jumlah apa?', '`d` and `t` say nothing. What data? Total of what?'],
        ['3', 'Gelung yang betul, tetapi `x` ialah nama yang paling tidak bermakna.', 'A correct loop, but `x` is the least meaningful name.'],
        ['4–5', '`f` ialah boolean yang maknanya tersembunyi.', '`f` is a boolean whose meaning is hidden.']),
      CODE('improved-names', 'lua', 'lua54', ['Pelaksanaan lebih baik: nama yang menerangkan diri', 'Improved implementation: self-explaining names'], `
local FREE_SHIPPING_THRESHOLD = 300
local itemPrices = {120, 95, 140}

local orderTotal = 0
for _, price in ipairs(itemPrices) do
  orderTotal = orderTotal + price
end

local qualifiesForFreeShipping = orderTotal > FREE_SHIPPING_THRESHOLD
print(orderTotal, qualifiesForFreeShipping)
`, '355\ttrue'),
      EXPLAIN('improved-names',
        ['1', 'Pemalar `UPPER_CASE` memberi nama kepada "nombor ajaib" 300.', 'An `UPPER_CASE` constant gives a name to the "magic number" 300.'],
        ['2', 'Nama jamak untuk senarai: `itemPrices`.', 'A plural name for a list: `itemPrices`.'],
        ['4–7', '`orderTotal` dan `price` menerangkan apa yang dijumlahkan.', '`orderTotal` and `price` explain what is being summed.'],
        ['9–10', 'Nama boolean dibaca seperti soalan ya/tidak.', 'The boolean name reads like a yes/no question.']),
      P('Output sama; hanya nama yang berubah. Namun versi kedua boleh dibaca tanpa komen, dan menukar ambang penghantaran percuma kini satu perubahan di satu tempat yang jelas.', 'The output is identical; only the names changed. Yet the second version reads without comments, and changing the free-shipping threshold is now one change in one obvious place.')),
    S('industry_use_cases',
      UL(
        ['Panduan gaya Lua (contohnya Olivine Labs) mengesyorkan `snake_case` untuk pemboleh ubah dan `UPPER_CASE` untuk pemalar.', 'Lua style guides (for example Olivine Labs) recommend `snake_case` for variables and `UPPER_CASE` for constants.'],
        ['API Neovim menggunakan `snake_case` (`vim.api.nvim_buf_get_lines`), manakala ramai pembangun permainan menggunakan `camelCase`.', 'The Neovim API uses `snake_case` (`vim.api.nvim_buf_get_lines`), while many game developers use `camelCase`.'],
        ['luacheck memberi amaran apabila local membayangi global standard (amaran 421/431).', 'luacheck warns when a local shadows a standard global (warnings 421/431).'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `reserved-check` dan tambah lima perkataan anda sendiri ke dalam senarai.', 'Run `reserved-check` and add five words of your own to the list.'],
        ['Jalankan versi berpepijat `keyword-keys` dan `shadowed-type`; kenal pasti mana ralat kompil dan mana ralat runtime.', 'Run the buggy versions of `keyword-keys` and `shadowed-type`; identify which is a compile error and which a runtime error.'],
        ['Namakan semula semua pemboleh ubah dalam `poor-names` tanpa melihat `improved-names`, kemudian bandingkan.', 'Rename every variable in `poor-names` without looking at `improved-names`, then compare.'],
      )),
    S('mini_project',
      P('**Penyemak nama.** Tulis fungsi yang mengelaskan calon nama sebagai "valid", "keyword" atau "invalid", dan memberi amaran jika nama membayangi global standard.', '**A name checker.** Write a function that classifies candidate names as "valid", "keyword" or "invalid", and warns if a name shadows a standard global.'),
      CODE('name-checker', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function classify(name)
  if not name:match("^[%a_][%w_]*$") then
    return "invalid"
  elseif not load("local " .. name .. " = 1") then
    return "keyword"
  elseif _G[name] ~= nil then
    return "valid (shadows a standard global!)"
  end
  return "valid"
end

for _, name in ipairs({"maxSpeed", "2fast", "repeat", "table", "my-name"}) do
  print(string.format("%-9s %s", name, classify(name)))
end
`, 'maxSpeed  valid\n2fast     invalid\nrepeat    keyword\ntable     valid (shadows a standard global!)\nmy-name   invalid'),
      EXPLAIN('name-checker',
        ['1–3', 'Corak `^[%a_][%w_]*$`: huruf atau garis bawah, diikuti huruf, digit atau garis bawah, hingga hujung. `%a` ialah huruf, `%w` huruf atau digit.', 'The pattern `^[%a_][%w_]*$`: a letter or underscore, followed by letters, digits or underscores, to the end. `%a` is a letter, `%w` a letter or digit.'],
        ['4–5', 'Bentuk yang betul tetapi kompilasi gagal bermakna ia kata kunci.', 'A well-formed name that fails to compile must be a keyword.'],
        ['6–7', 'Jika nama sudah wujud dalam `_G` (contohnya `table`), menggunakannya sebagai local akan membayangi global itu.', 'If the name already exists in `_G` (for example `table`), using it as a local would shadow that global.'],
        ['9', 'Selain itu, nama selamat digunakan.', 'Otherwise the name is safe to use.'],
        ['12–14', 'Uji lima calon; `%-9s` menjajarkan lajur.', 'Test five candidates; `%-9s` aligns the column.'])),
    S('summary',
      UL(
        ['Nama sah: huruf/`_` pertama, kemudian huruf, digit, `_`; bukan kata kunci; peka huruf.', 'Valid names: a letter/`_` first, then letters, digits, `_`; not a keyword; case-sensitive.'],
        ['22 kata kunci tidak boleh menjadi nama, tetapi boleh menjadi kunci string `t["end"]`.', 'The 22 keywords cannot be names, but can be string keys `t["end"]`.'],
        ['Konvensyen: nama deskriptif, `UPPER_CASE` untuk pemalar, `_` untuk nilai diabaikan, jangan cipta `_UPPER`.', 'Conventions: descriptive names, `UPPER_CASE` for constants, `_` for ignored values, never invent `_UPPER`.'],
        ['Jangan bayangi fungsi pustaka seperti `type`, `string`, `table`.', 'Do not shadow library functions such as `type`, `string`, `table`.'],
      )),
    S('knowledge_check',
      OL(
        ['Antara berikut, yang manakah nama sah: `_x1`, `1x`, `x-1`, `goto`, `Goto`?', 'Which of these are valid names: `_x1`, `1x`, `x-1`, `goto`, `Goto`?'],
        ['Mengapakah `t.end` ditolak tetapi `t["end"]` diterima?', 'Why is `t.end` rejected but `t["end"]` accepted?'],
        ['Adakah `continue` kata kunci dalam Lua 5.4?', 'Is `continue` a keyword in Lua 5.4?'],
        ['Apakah masalah dengan `local table = {}`?', 'What is the problem with `local table = {}`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.1 — Lexical Conventions (names and reserved words)', url: `${MANUAL}#3.1` },
        { title: 'Programming in Lua (1st ed.) — 1.3 Some Lexical Conventions', url: `${PIL}/1.3.html` },
        { title: 'Olivine Labs — Lua Style Guide (naming)', url: 'https://github.com/Olivine-Labs/lua-style-guide#naming-conventions' },
        { title: 'luacheck — list of warnings (shadowing)', url: 'https://luacheck.readthedocs.io/en/stable/warnings.html' },
      )),
  ],
};

export const LUA102_M1 = [LUA102_1_2, LUA102_1_3];
