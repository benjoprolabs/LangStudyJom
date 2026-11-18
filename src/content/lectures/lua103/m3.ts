import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA103 · Module 3 — Controlling Flow (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 3.1 break to leave a loop ─────────────────────────────────────────────

export const LUA103_3_1: LectureContentDef = {
  courseCode: 'LUA103',
  module: 3,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan `break` untuk keluar awal daripada gelung `while`, `repeat` dan `for`.', 'Use `break` to leave `while`, `repeat` and `for` loops early.'],
        ['Menerangkan bahawa `break` hanya keluar daripada gelung **terdalam**.', 'Explain that `break` only leaves the **innermost** loop.'],
        ['Membezakan "dijumpai" dan "tidak dijumpai" selepas gelung carian.', 'Distinguish "found" from "not found" after a search loop.'],
        ['Menggantikan bendera (flag) dengan `return` awal dalam fungsi.', 'Replace flags with an early `return` inside a function.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 2: `while`, `repeat`, `for` berangka.', 'Module 2: `while`, `repeat`, numeric `for`.'],
        ['Kuliah 2.1: gelung `while true` dengan syarat keluar di tengah.', 'Lecture 2.1: `while true` loops with an exit condition in the middle.'],
      )),
    S('introduction',
      P('Kadang-kadang anda mencari sesuatu dan tidak perlu meneruskan sebaik sahaja ia dijumpai: nombor negatif pertama, pengguna pertama yang sepadan, jawapan pertama yang betul. `break` menghentikan gelung serta-merta dan meneruskan pelaksanaan selepas `end` gelung itu. Ia menjimatkan kerja, dan selalunya menjadikan niat lebih jelas daripada syarat gelung yang rumit.',
        'Sometimes you are searching for something and need not continue once it is found: the first negative number, the first matching user, the first correct answer. `break` stops the loop immediately and continues execution after that loop’s `end`. It saves work, and often makes the intent clearer than a complicated loop condition.'),
      KEY('`break` keluar daripada **satu** gelung — yang paling dalam yang mengandunginya.', '`break` leaves **one** loop — the innermost one containing it.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`break` boleh digunakan dalam `while`, `repeat`, `for` berangka dan `for … in`.', '`break` works in `while`, `repeat`, numeric `for` and `for … in`.'],
        ['Selepas `break`, pelaksanaan diteruskan pada baris pertama selepas `end` (atau `until`) gelung itu.', 'After `break`, execution continues at the first line after that loop’s `end` (or `until`).'],
        ['`break` di luar gelung ialah **ralat kompil**.', '`break` outside a loop is a **compile error**.'],
        ['Untuk keluar daripada beberapa gelung bersarang sekali gus: gunakan `return` dalam fungsi, atau `goto` (kuliah 3.2).', 'To leave several nested loops at once: use `return` inside a function, or `goto` (lecture 3.2).'],
      )),
    S('detailed_theory',
      P('Sejak Lua 5.2, `break` dilaksanakan sebagai `goto` tersirat ke label tersembunyi selepas gelung. Akibatnya, ia tidak lagi perlu menjadi pernyataan terakhir dalam blok seperti dalam Lua 5.1 — pengkompil hanya memastikan terdapat gelung yang mengelilinginya. Apabila `break` dilaksanakan, semua local yang diisytiharkan di dalam badan gelung hilang, sama seperti keluar biasa.',
        'Since Lua 5.2, `break` is implemented as an implicit `goto` to a hidden label after the loop. As a result, it no longer has to be the last statement in a block as in Lua 5.1 — the compiler only checks that an enclosing loop exists. When `break` runs, every local declared inside the loop body disappears, just as with a normal exit.'),
      P('Gelung carian dengan `break` mempunyai dua cara untuk tamat: **dijumpai** (melalui `break`) atau **tidak dijumpai** (gelung habis). Kod selepas gelung mesti membezakan kedua-duanya, biasanya dengan pemboleh ubah hasil yang bermula `nil` dan hanya diberi nilai apabila padanan ditemui. Melupakan kes "tidak dijumpai" ialah sumber pepijat yang biasa: hasil `nil` digunakan seolah-olah ia sentiasa wujud.',
        'A search loop with `break` has two ways to finish: **found** (through `break`) or **not found** (the loop runs out). The code after the loop must tell the two apart, usually with a result variable that starts as `nil` and is assigned only when a match is found. Forgetting the "not found" case is a common source of bugs: the `nil` result is used as if it always existed.')),
    S('technical_terminology', TERMS('loop', 'infinite-loop', 'control-flow', 'nil')),
    S('syntax_rules',
      UL(
        ['`break` — tiada argumen dan tiada nilai pulangan.', '`break` — no arguments and no return value.'],
        ['Corak carian: `local found` sebelum gelung; `found = x; break` di dalam; semak `if found then … else … end` selepas.', 'Search pattern: `local found` before the loop; `found = x; break` inside; check `if found then … else … end` after.'],
        ['`return` dalam fungsi keluar daripada **semua** gelung fungsi itu.', '`return` inside a function leaves **all** of that function’s loops.'],
      )),
    S('code_demonstration',
      CODE('first-negative', 'lua', 'lua54', ['Carian dengan break', 'A search with break'], `
local readings = {12, 7, -3, 9, -8}
local position

for i = 1, #readings do
  if readings[i] < 0 then
    position = i
    break
  end
end

print("first negative at", position)
`, 'first negative at\t3'),
      EXPLAIN('first-negative',
        ['1–2', 'Data dan pemboleh ubah hasil, bermula `nil` ("belum dijumpai").', 'The data and a result variable, starting as `nil` ("not found yet").'],
        ['4–9', 'Pada kedudukan 3, −3 ditemui: rekod kedudukan, kemudian `break`. Elemen 4 dan 5 tidak diperiksa langsung.', 'At position 3, −3 is found: record the position, then `break`. Elements 4 and 5 are never examined.'],
        ['11', 'Keputusan carian.', 'The search result.'])),
    S('complete_examples',
      CODE('innermost-only', 'lua', 'lua54', ['break hanya keluar daripada gelung terdalam', 'break only leaves the innermost loop'], `
for row = 1, 3 do
  for col = 1, 3 do
    if col > row then break end
    io.write(row, ",", col, " ")
  end
  print("| row " .. row .. " done")
end
`, '1,1 | row 1 done\n2,1 2,2 | row 2 done\n3,1 3,2 3,3 | row 3 done'),
      EXPLAIN('innermost-only',
        ['1–2', 'Gelung luar untuk baris, gelung dalam untuk lajur.', 'An outer loop for rows, an inner loop for columns.'],
        ['3', '`break` keluar daripada gelung **lajur** sahaja apabila `col` melepasi `row`.', '`break` leaves only the **column** loop once `col` passes `row`.'],
        ['4', 'Paparkan pasangan yang lulus.', 'Display the pairs that pass.'],
        ['6', 'Baris ini masih dijalankan untuk setiap baris — gelung luar tidak terjejas oleh `break`.', 'This line still runs for every row — the outer loop is unaffected by `break`.']),
      CODE('found-or-not', 'lua', 'lua54', ['Mengendalikan "tidak dijumpai"', 'Handling "not found"'], `
local function findUser(users, name)
  for i, user in ipairs(users) do
    if user == name then
      return i
    end
  end
  return nil, name .. " not found"
end

local users = {"ali", "mei", "raj"}
print(findUser(users, "mei"))
print(findUser(users, "tan"))
`, '2\nnil\ttan not found', {
        debug: BUG(`
local users = {"ali", "mei", "raj"}
local index
for i, user in ipairs(users) do
  if user == "tan" then index = i break end
end
print("user number " .. index)
`, "example:6: attempt to concatenate a nil value (local 'index')",
          'Gelung tamat tanpa `break` kerana "tan" tiada, jadi `index` kekal `nil`. Kod selepas gelung menganggap carian sentiasa berjaya. Setiap gelung carian ada dua hasil: semak `if index then … else … end`, atau gunakan fungsi yang memulangkan `(nil, mesej)` seperti versi asal.',
          'The loop finishes without `break` because "tan" is absent, so `index` stays `nil`. The code after the loop assumes the search always succeeds. Every search loop has two outcomes: check `if index then … else … end`, or use a function that returns `(nil, message)` as in the original version.'),
      }),
      EXPLAIN('found-or-not',
        ['1–8', 'Dalam fungsi, `return` menggantikan `break` + pemboleh ubah hasil: ia keluar daripada gelung **dan** fungsi serta-merta. Jika gelung habis, fungsi memulangkan `(nil, mesej)`.', 'Inside a function, `return` replaces `break` + a result variable: it leaves the loop **and** the function immediately. If the loop runs out, the function returns `(nil, message)`.'],
        ['10–12', 'Satu carian berjaya (kedudukan 2) dan satu gagal dengan mesej.', 'One successful search (position 2) and one failure with a message.'])),
    S('line_by_line',
      EXPLAIN('first-negative',
        ['7', '`break` di sini selepas pernyataan lain dalam blok yang sama. Dalam Lua 5.4, `break` boleh muncul di mana-mana dalam badan gelung.', '`break` here follows another statement in the same block. In Lua 5.4, `break` may appear anywhere inside a loop body.']),
      EXPLAIN('found-or-not',
        ['4', '`return i` menamatkan fungsi — tiada keperluan untuk bendera atau `break`.', '`return i` ends the function — no need for a flag or a `break`.'])),
    S('why_this_way',
      P('Mengapa `break` dan bukannya menambah syarat ke dalam gelung? Kerana syarat "teruskan selagi belum dijumpai dan masih ada elemen" menggabungkan dua idea ke dalam satu ungkapan. Dengan `break`, gelung menyatakan "lawati setiap elemen" dan badan menyatakan "berhenti apabila dijumpai" — setiap idea di tempatnya sendiri.',
        'Why `break` rather than adding to the loop condition? Because "continue while not found and elements remain" merges two ideas into one expression. With `break`, the loop says "visit every element" and the body says "stop when found" — each idea in its own place.'),
      P('Gunakan `break` **apabila** gelung mencari atau menunggu sesuatu; gunakan `return` **apabila** gelung berada dalam fungsi yang tujuannya ialah hasil carian itu.', 'Use `break` **when** a loop searches or waits for something; use `return` **when** the loop sits in a function whose purpose is that search result.')),
    S('execution_flow',
      OL(
        ['`innermost-only`, `row = 2`: gelung dalam bermula dengan `col = 1`; 1 > 2 palsu → tulis "2,1".', '`innermost-only`, `row = 2`: the inner loop starts with `col = 1`; 1 > 2 is false → write "2,1".'],
        ['`col = 2`: 2 > 2 palsu → tulis "2,2".', '`col = 2`: 2 > 2 is false → write "2,2".'],
        ['`col = 3`: 3 > 2 benar → `break` melompat ke selepas `end` gelung dalam.', '`col = 3`: 3 > 2 is true → `break` jumps past the inner loop’s `end`.'],
        ['Baris "row 2 done" dicetak; gelung luar meneruskan dengan `row = 3`.', 'The "row 2 done" line prints; the outer loop continues with `row = 3`.'],
      )),
    S('memory_behaviour',
      P('`break` tidak memperuntukkan memori; ia lompatan. Local badan gelung dibebaskan seperti biasa. Dalam gelung `for … in` dengan iterator yang memegang sumber (contohnya fail), keluar awal dengan `break` meninggalkan sumber itu kepada pengutip sampah — atau kepada pemboleh ubah `<close>` dalam Lua 5.4 (LUA213).',
        '`break` allocates no memory; it is a jump. The loop body’s locals are released as usual. In a `for … in` loop whose iterator holds a resource (for example a file), leaving early with `break` leaves that resource to the garbage collector — or to a `<close>` variable in Lua 5.4 (LUA213).')),
    S('alternative_implementations',
      P('Untuk keluar daripada dua gelung sekali gus, letakkan gelung dalam fungsi dan gunakan `return`:', 'To leave two loops at once, put the loops in a function and use `return`:'),
      CODE('exit-both', 'lua', 'lua54', ['Keluar daripada gelung bersarang dengan return', 'Leaving nested loops with return'], `
local function findInGrid(grid, target)
  for r = 1, #grid do
    for c = 1, #grid[r] do
      if grid[r][c] == target then return r, c end
    end
  end
  return nil
end

local grid = {{4, 8}, {15, 16}, {23, 42}}
print(findInGrid(grid, 16))
print(findInGrid(grid, 99))
`, '2\t2\nnil'),
      EXPLAIN('exit-both',
        ['1–8', '`return r, c` keluar daripada **kedua-dua** gelung dan fungsi dengan dua nilai. Jika tiada padanan, gelung habis dan `return nil` dijalankan secara eksplisit.', '`return r, c` leaves **both** loops and the function with two values. With no match, the loops run out and the explicit `return nil` runs.'],
        ['10–12', '16 berada di baris 2, lajur 2; 99 tiada, jadi `nil` dipaparkan. (Tanpa `return nil`, fungsi memulangkan **tiada nilai** dan `print` akan memaparkan baris kosong.)', '16 is at row 2, column 2; 99 is absent, so `nil` is displayed. (Without `return nil`, the function would return **no values** and `print` would display an empty line.)'])),
    S('common_mistakes',
      UL(
        ['Menjangka `break` keluar daripada semua gelung bersarang.', 'Expecting `break` to leave all nested loops.'],
        ['Menggunakan hasil carian tanpa menyemak kes "tidak dijumpai".', 'Using a search result without checking the "not found" case.'],
        ['Meletakkan `break` di luar gelung (contohnya dalam `if` di peringkat atas).', 'Placing `break` outside a loop (for example in a top-level `if`).'],
        ['Menggunakan bendera boolean dan `break` sedangkan `return` dalam fungsi lebih jelas.', 'Using a boolean flag plus `break` when a `return` inside a function is clearer.'],
      )),
    S('debugging',
      P('`break` di tempat yang salah ialah ralat kompil yang menyebut baris `break` itu. Ralat runtime yang berkaitan biasanya datang daripada kes "tidak dijumpai", seperti versi berpepijat `found-or-not`. Apabila gelung carian tidak berkelakuan seperti dijangka, cetak indeks dan nilai setiap pusingan untuk melihat sama ada `break` dicapai. Contoh berikut menunjukkan `break` yang tertinggal selepas gelung dibuang semasa menyunting:',
        'A misplaced `break` is a compile error that names the `break` line. Related runtime errors usually come from the "not found" case, as in the buggy `found-or-not`. When a search loop does not behave as expected, print the index and value on every pass to see whether `break` is reached. The following example shows a `break` left behind after its loop was removed during editing:'),
      CODE('stop-at-limit', 'lua', 'lua54', ['Menjumlahkan sehingga had', 'Summing up to a limit'], `
local total = 0
for _, v in ipairs({40, 30, 50, 20}) do
  if total + v > 100 then break end
  total = total + v
end
print(total)
`, '70', {
        debug: BUG(`
local total = 0
if total > 100 then
  break
end
print(total)
`, "example:5: break outside loop at line 3",
          'Gelung telah dibuang tetapi `break` tertinggal di dalam `if`. `if` bukan gelung, jadi tiada tempat untuk "keluar". Pengkompil menyemak setiap `break` mempunyai gelung yang mengelilinginya; ralat dilaporkan apabila chunk ditutup, pada baris terakhir (baris 5), tetapi mesej menyebut baris `break` itu sendiri (`line 3`). Gunakan `return` untuk keluar daripada fungsi, atau buang `break`.',
          'The loop was removed but the `break` was left inside an `if`. `if` is not a loop, so there is nothing to "leave". The compiler checks that every `break` has an enclosing loop; the error is reported when the chunk is closed, on its last line (line 5), but the message names the `break` line itself (`line 3`). Use `return` to leave a function, or remove the `break`.'),
      }),
      EXPLAIN('stop-at-limit',
        ['1', 'Jumlah bermula 0.', 'The total starts at 0.'],
        ['2–5', 'Tambah nilai selagi jumlah tidak melebihi 100. Apabila 50 akan menjadikan jumlah 120, `break`.', 'Add values while the total stays at or below 100. When 50 would make it 120, `break`.'],
        ['6', '40 + 30 = 70.', '40 + 30 = 70.'])),
    S('performance',
      P('`break` menjimatkan kerja: carian yang berhenti pada padanan pertama melawati purata separuh elemen dan bukannya semuanya. Untuk carian yang kerap dalam senarai besar, struktur data yang lebih baik (table set atau indeks) lebih pantas daripada sebarang gelung — LUA111 dan LUA212 membincangkannya.',
        '`break` saves work: a search that stops at the first match visits on average half of the elements instead of all of them. For frequent searches in large lists, a better data structure (a set table or an index) beats any loop — LUA111 and LUA212 cover this.')),
    S('software_engineering',
      P('Bendera boolean menjadikan gelung lebih panjang dan lebih mudah salah:', 'A boolean flag makes a loop longer and easier to get wrong:'),
      CODE('poor-flag-loop', 'lua', 'lua54', ['Pelaksanaan lemah: bendera dan gelung yang berterusan', 'Poor implementation: a flag and a loop that keeps going'], `
local words = {"apple", "kiwi", "banana", "fig"}
local found = false
local result = nil
for _, w in ipairs(words) do
  if not found and #w > 5 then
    found = true
    result = w
  end
end
print(result)
`, 'banana'),
      EXPLAIN('poor-flag-loop',
        ['1–3', 'Dua pemboleh ubah keadaan untuk satu idea.', 'Two state variables for one idea.'],
        ['4–9', 'Gelung terus melawati "fig" walaupun hasil sudah dijumpai, dan setiap syarat mesti menyemak `not found`.', 'The loop keeps visiting "fig" although the result is already found, and every condition must check `not found`.'],
        ['10', 'Keputusan betul.', 'The correct result.']),
      CODE('improved-early-return', 'lua', 'lua54', ['Pelaksanaan lebih baik: fungsi dengan return awal', 'Improved implementation: a function with an early return'], `
local function firstLongWord(words, minLength)
  for _, w in ipairs(words) do
    if #w > minLength then return w end
  end
  return nil
end

print(firstLongWord({"apple", "kiwi", "banana", "fig"}, 5))
`, 'banana'),
      EXPLAIN('improved-early-return',
        ['1–6', 'Satu syarat, satu `return`; tiada bendera. Panjang minimum menjadi parameter, jadi fungsi boleh digunakan semula.', 'One condition, one `return`; no flag. The minimum length becomes a parameter, so the function is reusable.'],
        ['8', 'Keputusan sama.', 'The same result.'])),
    S('industry_use_cases',
      UL(
        ['Pengendali acara (event loop) yang keluar apabila menerima mesej "quit".', 'Event loops that exit when they receive a "quit" message.'],
        ['Carian dalam senarai inventori atau pengguna, berhenti pada padanan pertama.', 'Searches in inventory or user lists, stopping at the first match.'],
        ['Penghurai fail yang berhenti membaca apabila menemui penanda akhir data.', 'File parsers that stop reading when they meet an end-of-data marker.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tukar `first-negative` supaya ia mencari nombor negatif **terakhir** (petunjuk: berulang ke belakang).', 'Change `first-negative` to find the **last** negative number (hint: iterate backwards).'],
        ['Jalankan versi berpepijat `found-or-not` dan tambah semakan `if index then`.', 'Run the buggy `found-or-not` and add an `if index then` check.'],
        ['Dalam `innermost-only`, gantikan `break` dengan `return` di dalam fungsi dan perhatikan perbezaannya.', 'In `innermost-only`, replace `break` with `return` inside a function and observe the difference.'],
      )),
    S('mini_project',
      P('**Log masuk dengan had percubaan.** Benarkan sehingga 3 percubaan kata laluan; keluar awal apabila betul; laporkan sama ada akaun dikunci.', '**Login with an attempt limit.** Allow up to 3 password attempts; leave early when correct; report whether the account is locked.'),
      CODE('login-attempts', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local PASSWORD, MAX_TRIES = "lua54", 3
local granted = false

for attempt = 1, MAX_TRIES do
  local typed = io.read("l")
  if typed == nil then break end
  if typed == PASSWORD then
    granted = true
    print("welcome (attempt " .. attempt .. ")")
    break
  end
  print("wrong password, " .. MAX_TRIES - attempt .. " left")
end

if not granted then print("account locked") end
`, 'wrong password, 2 left\nwelcome (attempt 2)', { input: 'lua51\nlua54\nlua53\n' }),
      EXPLAIN('login-attempts',
        ['1–2', 'Kata laluan, had percubaan dan keputusan.', 'The password, the attempt limit and the outcome.'],
        ['4–6', 'Gelung `for` mengehadkan percubaan; `break` jika input tamat.', 'A `for` loop limits the attempts; `break` if input ends.'],
        ['7–11', 'Kata laluan betul: rekod, sambut, dan `break` — percubaan ketiga tidak pernah dibaca.', 'Correct password: record it, welcome the user, and `break` — the third attempt is never read.'],
        ['12', 'Kata laluan salah: beritahu baki percubaan.', 'Wrong password: report the remaining attempts.'],
        ['15', 'Selepas gelung, bezakan kejayaan daripada kegagalan.', 'After the loop, tell success from failure.'])),
    S('summary',
      UL(
        ['`break` keluar daripada gelung terdalam dengan serta-merta.', '`break` leaves the innermost loop immediately.'],
        ['Gelung carian mempunyai dua hasil: dijumpai dan tidak dijumpai — kendalikan kedua-duanya.', 'A search loop has two outcomes: found and not found — handle both.'],
        ['`return` dalam fungsi keluar daripada semua gelung dan sering lebih jelas daripada bendera.', '`return` inside a function leaves all loops and is often clearer than a flag.'],
        ['`break` di luar gelung ialah ralat kompil.', '`break` outside a loop is a compile error.'],
      )),
    S('knowledge_check',
      OL(
        ['Dalam dua gelung bersarang, gelung mana yang ditinggalkan oleh `break`?', 'In two nested loops, which loop does `break` leave?'],
        ['Apakah nilai `position` dalam `first-negative` jika tiada nombor negatif?', 'What is `position` in `first-negative` if there is no negative number?'],
        ['Bagaimanakah anda keluar daripada tiga gelung bersarang sekali gus?', 'How do you leave three nested loops at once?'],
        ['Mengapakah `if x then break end` di peringkat atas fail ialah ralat?', 'Why is `if x then break end` at the top level of a file an error?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures (break)', url: `${MANUAL}#3.3.4` },
        { title: 'Programming in Lua (1st ed.) — 4.4 break and return', url: `${PIL}/4.4.html` },
        { title: 'Lua 5.4 Reference Manual §8 — Incompatibilities (break and goto, 5.2)', url: `${MANUAL}#8` },
        { title: 'Lua 5.4 Reference Manual — ipairs', url: `${MANUAL}#pdf-ipairs` },
      )),
  ],
};

// ─── 3.2 goto and labels: the continue pattern (5.2+) ──────────────────────

export const LUA103_3_2: LectureContentDef = {
  courseCode: 'LUA103',
  module: 3,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan [[goto-label|`goto` dan label]] `::nama::` (Lua 5.2+).', 'Use [[goto-label|`goto` and labels]] `::name::` (Lua 5.2+).'],
        ['Melaksanakan corak "continue" untuk melangkau baki badan gelung.', 'Implement the "continue" pattern to skip the rest of a loop body.'],
        ['Menerangkan peraturan keterlihatan label dan larangan melompat ke dalam skop local.', 'Explain label visibility rules and the ban on jumping into a local’s scope.'],
        ['Menilai bila `goto` membantu kebolehbacaan dan bila ia merosakkannya.', 'Judge when `goto` helps readability and when it harms it.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1: `break` dan `return` awal.', 'Lecture 3.1: `break` and early `return`.'],
        ['LUA101 1.3: perbezaan versi Lua (goto ialah 5.2+).', 'LUA101 1.3: Lua version differences (goto is 5.2+).'],
      )),
    S('introduction',
      P('Banyak bahasa mempunyai `continue`, yang melangkau baki pusingan semasa dan terus ke pusingan seterusnya. Lua tidak mempunyai `continue`. Sebaliknya, sejak 5.2 Lua menyediakan `goto` yang lebih umum: lompat ke **label** bernama. Dengan meletakkan label `::next_item::` di hujung badan gelung, `goto next_item` berkelakuan tepat seperti `continue`. Kuliah ini mengajar corak itu — dan peraturan yang menjadikan `goto` Lua selamat.',
        'Many languages have `continue`, which skips the rest of the current pass and moves to the next one. Lua has no `continue`. Instead, since 5.2 Lua provides the more general `goto`: jump to a named **label**. By placing a `::next_item::` label at the end of a loop body, `goto next_item` behaves exactly like `continue`. This lecture teaches that pattern — and the rules that keep Lua’s `goto` safe.'),
      KEY('Corak continue: `if langkau then goto next_item end` … `::next_item::` sebagai pernyataan terakhir badan gelung.', 'The continue pattern: `if skip then goto next_item end` … `::next_item::` as the last statement of the loop body.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Label:** `::nama::` menandakan kedudukan dalam kod; ia bukan pernyataan yang melakukan apa-apa.', '**Label:** `::name::` marks a position in the code; it is not a statement that does anything.'],
        ['**goto:** `goto nama` meneruskan pelaksanaan pada label itu.', '**goto:** `goto name` continues execution at that label.'],
        ['**Keterlihatan:** label kelihatan dalam blok di mana ia ditakrifkan dan blok bersarangnya — tidak di luar fungsi.', '**Visibility:** a label is visible in the block where it is defined and its nested blocks — never outside its function.'],
        ['**Larangan:** `goto` tidak boleh melompat **ke dalam** skop pemboleh ubah local.', '**Restriction:** `goto` cannot jump **into** the scope of a local variable.'],
        ['**Versi:** `goto` wujud dalam Lua 5.2–5.4 dan LuaJIT, tetapi **tidak** dalam Lua 5.1 atau Luau.', '**Versions:** `goto` exists in Lua 5.2–5.4 and LuaJIT, but **not** in Lua 5.1 or Luau.'],
      )),
    S('detailed_theory',
      P('`goto` mempunyai reputasi buruk kerana dalam bahasa lama ia membenarkan lompatan ke mana-mana, menghasilkan "kod spageti". Lua mengehadkannya dengan ketat: label mesti berada dalam fungsi yang sama dan dalam blok yang kelihatan, dan lompatan tidak boleh masuk ke tengah skop local (kerana local itu akan wujud tanpa nilai awal). Pengecualian: lompatan ke label di **hujung** blok dibenarkan walaupun selepas pengisytiharan local, kerana selepas label itu tiada kod yang boleh menggunakan local tersebut — sebab itu corak continue berfungsi walaupun badan gelung mempunyai local.',
        '`goto` has a bad reputation because in old languages it allowed jumps anywhere, producing "spaghetti code". Lua restricts it tightly: a label must be in the same function and in a visible block, and a jump cannot enter the middle of a local’s scope (because that local would exist without its initial value). The exception: a jump to a label at the **end** of a block is allowed even past local declarations, because no code after that label can use those locals — which is why the continue pattern works even when the loop body has locals.'),
      P('Pengkompil menyemak peraturan ini semasa kompil, jadi `goto` yang tidak sah tidak pernah dijalankan. Mesej ralatnya tepat: label yang tidak kelihatan (`no visible label`) dan lompatan ke dalam skop (`jumps into the scope of local`). Dalam amalan, `goto` Lua digunakan untuk dua perkara: corak continue, dan keluar daripada gelung bersarang dalam satu fungsi besar di mana memisahkan fungsi tidak praktikal.',
        'The compiler checks these rules at compile time, so an invalid `goto` never runs. Its error messages are precise: an invisible label (`no visible label`) and a jump into a scope (`jumps into the scope of local`). In practice, Lua’s `goto` is used for two things: the continue pattern, and leaving nested loops inside one large function where splitting the function is impractical.')),
    S('technical_terminology', TERMS('goto-label', 'loop', 'scope', 'control-flow')),
    S('syntax_rules',
      UL(
        ['Label: `::nama::` (dua titik bertindih di kedua-dua sisi).', 'Label: `::name::` (double colons on both sides).'],
        ['Lompatan: `goto nama`.', 'Jump: `goto name`.'],
        ['Corak continue: `::next_item::` diletakkan sebagai pernyataan terakhir dalam badan gelung.', 'Continue pattern: `::next_item::` placed as the last statement of the loop body.'],
        ['`continue` bukan kata kunci Lua. Banyak projek menamakan label ini `continue`; kursus ini menggunakan `next_item` supaya ia tidak dikelirukan dengan kata kunci `continue` dalam Luau.', '`continue` is not a Lua keyword. Many projects name this label `continue`; this course uses `next_item` so it is not confused with Luau’s `continue` keyword.'],
      )),
    S('code_demonstration',
      CODE('continue-pattern', 'lua', 'lua54', ['Corak continue dengan goto', 'The continue pattern with goto'], `
local lines = {"apple", "", "# a comment", "banana", "  "}

for _, line in ipairs(lines) do
  local trimmed = line:match("^%s*(.-)%s*$")
  if trimmed == "" or trimmed:sub(1, 1) == "#" then
    goto next_item
  end
  print("item: " .. trimmed)
  ::next_item::
end
`, 'item: apple\nitem: banana'),
      EXPLAIN('continue-pattern',
        ['1', 'Data dengan baris kosong, komen dan ruang.', 'Data with empty lines, a comment and whitespace.'],
        ['3–4', 'Untuk setiap baris, buang ruang di hujung dengan corak; `(.-)` ialah tangkapan paling pendek.', 'For each line, trim the surrounding whitespace with a pattern; `(.-)` is the shortest capture.'],
        ['5–7', 'Baris kosong atau komen: lompat terus ke `::next_item::`, melangkau `print`.', 'Empty or comment lines: jump straight to `::next_item::`, skipping the `print`.'],
        ['8', 'Hanya baris yang sah sampai ke sini.', 'Only valid lines reach this point.'],
        ['9', 'Label di **hujung** badan — lompatan ke sini dibenarkan walaupun `trimmed` ialah local.', 'The label at the **end** of the body — jumping here is allowed even though `trimmed` is a local.'])),
    S('complete_examples',
      CODE('skip-odd', 'lua', 'lua54', ['Melangkau nilai ganjil', 'Skipping odd values'], `
local sumEven = 0
for i = 1, 10 do
  if i % 2 == 1 then goto next end
  sumEven = sumEven + i
  ::next::
end
print(sumEven)
`, '30', {
        debug: BUG(`
local sumEven = 0
for i = 1, 10 do
  if i % 2 == 1 then goto next_itme end
  sumEven = sumEven + i
  ::next_item::
end
print(sumEven)
`, "example:7: no visible label 'next_itme' for <goto> at line 3",
          'Nama label tersalah eja: `goto next_itme` tetapi labelnya `::next_item::`. Pengkompil mencari label yang kelihatan dengan nama itu, gagal, dan melaporkan baris `goto` dalam mesej (`line 3`); awalan `example:7` ialah baris terakhir chunk, tempat pencarian label berakhir. Ralat ini dikesan sebelum program berjalan. Nama label bebas — `next` dalam versi asal juga sah — tetapi mesti sama tepat pada kedua-dua tempat.',
          'The label name is misspelled: `goto next_itme` but the label is `::next_item::`. The compiler looks for a visible label with that name, fails, and names the `goto` line in the message (`line 3`); the `example:7` prefix is the last line of the chunk, where the search for the label ends. This is caught before the program runs. Label names are free — `next` in the original is valid too — but must match exactly in both places.'),
      }),
      EXPLAIN('skip-odd',
        ['1', 'Pengumpul untuk nombor genap.', 'An accumulator for even numbers.'],
        ['2–3', 'Nombor ganjil melompat ke label `next`.', 'Odd numbers jump to the `next` label.'],
        ['4', 'Hanya nombor genap ditambah: 2 + 4 + 6 + 8 + 10.', 'Only even numbers are added: 2 + 4 + 6 + 8 + 10.'],
        ['5', 'Label di hujung badan gelung.', 'The label at the end of the loop body.'],
        ['7', 'Jumlah: 30.', 'The total: 30.']),
      CODE('goto-done', 'lua', 'lua54', ['Keluar daripada gelung bersarang dengan goto', 'Leaving nested loops with goto'], `
local seats = {{"A1", "A2"}, {"B1", "taken"}, {"C1", "C2"}}
local firstTaken

for r = 1, #seats do
  for c = 1, #seats[r] do
    if seats[r][c] == "taken" then
      firstTaken = r .. "," .. c
      goto done
    end
  end
end
::done::
print("first taken seat at", firstTaken)
`, 'first taken seat at\t2,2'),
      EXPLAIN('goto-done',
        ['1–2', 'Grid tempat duduk dan hasil.', 'A seat grid and the result.'],
        ['4–11', 'Apabila tempat diambil ditemui, rekod kedudukan dan lompat **keluar daripada kedua-dua gelung** — sesuatu yang `break` tidak boleh lakukan.', 'When a taken seat is found, record its position and jump **out of both loops** — something `break` cannot do.'],
        ['12–13', 'Label selepas gelung; pelaksanaan diteruskan di sini.', 'The label after the loops; execution continues here.'])),
    S('line_by_line',
      EXPLAIN('continue-pattern',
        ['6', 'Bandingkan dengan membalut baki badan dalam `if trimmed ~= "" and … then … end`: untuk satu syarat, kedua-duanya jelas; untuk beberapa syarat langkau, `goto next_item` mengelakkan inden yang dalam.', 'Compare with wrapping the rest of the body in `if trimmed ~= "" and … then … end`: for one condition both are clear; for several skip conditions, `goto next_item` avoids deep indentation.']),
      EXPLAIN('goto-done',
        ['8', 'Ini setara dengan `return` dalam fungsi berasingan (kuliah 3.1). Pilih fungsi apabila boleh; gunakan `goto` apabila logik mesti kekal dalam fungsi yang sama.', 'This is equivalent to a `return` in a separate function (lecture 3.1). Prefer the function when you can; use `goto` when the logic must stay in the same function.'])),
    S('why_this_way',
      P('Mengapa Lua menambah `goto` umum dan bukannya `continue`? Kerana satu mekanisme menyelesaikan beberapa masalah — continue, keluar bersarang, mesin keadaan — selaras dengan falsafah "mekanisme, bukan polisi". Peraturan skop yang ketat menghalang penyalahgunaan yang memberi `goto` nama buruk dalam bahasa lama.',
        'Why did Lua add a general `goto` instead of `continue`? Because one mechanism solves several problems — continue, nested exits, state machines — in line with the "mechanisms, not policies" philosophy. Strict scope rules prevent the abuse that gave `goto` its bad name in old languages.'),
      P('Gunakan `goto next_item` **apabila** gelung mempunyai beberapa syarat langkau di awal badan. Elakkan `goto` **apabila** `if/else`, `break` atau `return` menyatakan maksud dengan sama jelas. Ingat ia tidak tersedia dalam Lua 5.1 dan Luau.', 'Use `goto next_item` **when** a loop has several skip conditions at the start of its body. Avoid `goto` **when** `if/else`, `break` or `return` say the same thing as clearly. Remember it is unavailable in Lua 5.1 and Luau.')),
    S('execution_flow',
      OL(
        ['`skip-odd`, `i = 1`: `1 % 2 == 1` benar → `goto next` melompat ke label di hujung badan.', '`skip-odd`, `i = 1`: `1 % 2 == 1` is true → `goto next` jumps to the label at the end of the body.'],
        ['Badan tamat; gelung `for` meneruskan dengan `i = 2`.', 'The body ends; the `for` loop continues with `i = 2`.'],
        ['`i = 2`: syarat palsu → `sumEven = 2`, kemudian label (tiada tindakan).', '`i = 2`: the condition is false → `sumEven = 2`, then the label (no action).'],
        ['Corak berulang hingga `i = 10`; jumlah 30.', 'The pattern repeats up to `i = 10`; the total is 30.'],
      )),
    S('memory_behaviour',
      P('`goto` dan label tidak menggunakan memori runtime — label hilang selepas kompilasi, dan `goto` menjadi arahan `JMP`. Apabila `goto` meninggalkan blok, local blok itu ditutup seperti keluar biasa (termasuk pemboleh ubah `<close>`).',
        '`goto` and labels use no runtime memory — labels disappear after compilation, and `goto` becomes a `JMP` instruction. When a `goto` leaves a block, that block’s locals are closed as on a normal exit (including `<close>` variables).')),
    S('alternative_implementations',
      P('Tanpa `goto`, corak continue boleh ditulis dengan membalikkan syarat dan membalut kerja dalam `if`. Ini berfungsi dalam semua versi, termasuk Lua 5.1:', 'Without `goto`, the continue pattern can be written by inverting the condition and wrapping the work in an `if`. This works in every version, including Lua 5.1:'),
      CODE('if-instead-of-goto', 'lua', 'lua54', ['Langkau tanpa goto', 'Skipping without goto'], `
local total = 0
for _, price in ipairs({12, -1, 30, 0, 8}) do
  if price > 0 then
    total = total + price
  end
end
print(total)
`, '50'),
      EXPLAIN('if-instead-of-goto',
        ['1', 'Jumlah harga yang sah.', 'The total of valid prices.'],
        ['2–6', 'Syarat **positif** ("proses jika sah") menggantikan "langkau jika tidak sah". Untuk satu syarat, ini lebih jelas daripada `goto`.', 'A **positive** condition ("process if valid") replaces "skip if invalid". For a single condition, this is clearer than `goto`.'],
        ['7', '12 + 30 + 8 = 50.', '12 + 30 + 8 = 50.'])),
    S('common_mistakes',
      UL(
        ['Menulis `continue` (seperti bahasa lain) — dalam Lua ia nama biasa, jadi `continue` sahaja ialah ralat sintaks.', 'Writing `continue` (as in other languages) — in Lua it is an ordinary name, so `continue` alone is a syntax error.'],
        ['Meletakkan `::next_item::` bukan di hujung badan, lalu melompat ke dalam skop local.', 'Placing `::next_item::` somewhere other than the end of the body, then jumping into a local’s scope.'],
        ['Tersalah eja nama label.', 'Misspelling the label name.'],
        ['Menggunakan `goto` dalam kod yang mesti berjalan dalam Lua 5.1, LuaJIT lama atau Luau.', 'Using `goto` in code that must run on Lua 5.1, old LuaJIT or Luau.'],
      )),
    S('debugging',
      P('Semua ralat `goto` ialah ralat kompil, jadi ia dikesan sebelum program berjalan. Dua mesej yang perlu dikenali: `no visible label \'x\' for <goto>` (label tiada, tersalah eja, atau dalam blok lain) dan `<goto x> at line N jumps into the scope of local \'y\'` (lompatan ke hadapan melepasi pengisytiharan local yang masih digunakan selepas label). Contoh berikut menunjukkan yang kedua:',
        'Every `goto` error is a compile error, so it is caught before the program runs. Two messages to recognise: `no visible label \'x\' for <goto>` (the label is missing, misspelled, or in another block) and `<goto x> at line N jumps into the scope of local \'y\'` (a forward jump past a local declaration that is still used after the label). The following example shows the second:'),
      CODE('setup-skip', 'lua', 'lua54', ['Melangkau persediaan dengan if', 'Skipping setup with an if'], `
local fastMode = true
local total = 0
if not fastMode then
  total = 5
end
print(total)
`, '0', {
        debug: BUG(`
goto skip
local total = 5
::skip::
print(total)
`, "example:4: <goto skip> at line 1 jumps into the scope of local 'total'",
          '`goto skip` melompat melepasi `local total = 5` ke label yang masih diikuti oleh kod yang menggunakan `total`. Jika ini dibenarkan, `total` akan wujud tanpa pernah diberi nilai. Lua menolaknya semasa kompil. Penyelesaian: isytiharkan `total` sebelum `goto`, atau gunakan `if` seperti versi asal.',
          '`goto skip` jumps past `local total = 5` to a label that is still followed by code using `total`. If this were allowed, `total` would exist without ever being assigned. Lua rejects it at compile time. Fix: declare `total` before the `goto`, or use an `if` as in the original version.'),
      }),
      EXPLAIN('setup-skip',
        ['1–2', 'Bendera mod dan pemboleh ubah yang diisytiharkan **sebelum** sebarang lompatan.', 'A mode flag and a variable declared **before** any jump.'],
        ['3–5', 'Langkah persediaan dilangkau dengan `if` — tiada `goto` diperlukan.', 'The setup step is skipped with an `if` — no `goto` needed.'],
        ['6', 'Nilai lalai 0 kekal.', 'The default 0 remains.'])),
    S('performance',
      P('`goto` dikompil kepada satu lompatan — sama pantas dengan `break` atau `if`. Corak continue dengan `goto` dan corak `if` yang setara menghasilkan bytecode yang hampir sama. Pilih berdasarkan kejelasan dan keserasian versi.',
        '`goto` compiles to a single jump — as fast as `break` or `if`. The continue pattern with `goto` and the equivalent `if` pattern produce nearly identical bytecode. Choose by clarity and version compatibility.')),
    S('software_engineering',
      P('Bandingkan syarat bersarang yang dalam dengan klausa pengawal (guard clauses) menggunakan corak continue:', 'Compare deeply nested conditions with guard clauses using the continue pattern:'),
      CODE('poor-deep-nesting', 'lua', 'lua54', ['Pelaksanaan lemah: inden bersarang yang dalam', 'Poor implementation: deeply nested indentation'], `
local orders = {{qty = 2, paid = true}, {qty = 0, paid = true}, {qty = 1, paid = false}}
local shipped = 0
for _, o in ipairs(orders) do
  if o.qty > 0 then
    if o.paid then
      shipped = shipped + 1
    end
  end
end
print(shipped)
`, '1'),
      EXPLAIN('poor-deep-nesting',
        ['1–2', 'Tiga pesanan dan kiraan yang dihantar.', 'Three orders and a shipped count.'],
        ['3–9', 'Setiap syarat baharu menambah satu tahap inden; kerja sebenar tersembunyi di tengah.', 'Every new condition adds a level of indentation; the real work is buried in the middle.'],
        ['10', 'Satu pesanan sah.', 'One valid order.']),
      CODE('improved-guard-continue', 'lua', 'lua54', ['Pelaksanaan lebih baik: klausa pengawal', 'Improved implementation: guard clauses'], `
local orders = {{qty = 2, paid = true}, {qty = 0, paid = true}, {qty = 1, paid = false}}
local shipped = 0
for _, o in ipairs(orders) do
  if o.qty <= 0 then goto next_item end
  if not o.paid then goto next_item end
  shipped = shipped + 1
  ::next_item::
end
print(shipped)
`, '1'),
      EXPLAIN('improved-guard-continue',
        ['1–2', 'Data yang sama.', 'The same data.'],
        ['3–8', 'Setiap sebab untuk melangkau ialah satu baris di atas; kerja sebenar berada pada tahap inden yang sama. Menambah syarat baharu = menambah satu baris.', 'Each reason to skip is one line at the top; the real work sits at a single indentation level. Adding a new condition = adding one line.'],
        ['9', 'Keputusan sama.', 'The same result.'])),
    S('industry_use_cases',
      UL(
        ['Penghurai fail konfigurasi melangkau baris komen dan kosong dengan corak continue.', 'Configuration-file parsers skip comment and blank lines with the continue pattern.'],
        ['Mesin keadaan yang ditulis dengan label untuk setiap keadaan dalam kod berprestasi tinggi.', 'State machines written with a label per state in performance-critical code.'],
        ['Kod yang mesti menyokong Lua 5.1 (contohnya plugin Neovim) mengelak `goto` dan menggunakan `if`.', 'Code that must support Lua 5.1 (for example Neovim plugins) avoids `goto` and uses `if`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah syarat ketiga pada `continue-pattern` yang melangkau baris lebih panjang daripada 10 aksara.', 'Add a third condition to `continue-pattern` that skips lines longer than 10 characters.'],
        ['Jalankan kedua-dua versi berpepijat dan bandingkan mesej ralatnya.', 'Run both buggy versions and compare their error messages.'],
        ['Tulis semula `goto-done` sebagai fungsi dengan `return`.', 'Rewrite `goto-done` as a function with `return`.'],
      )),
    S('mini_project',
      P('**Pembersih senarai beli-belah.** Proses senarai teks: langkau baris kosong dan komen, langkau item berulang, dan cetak senarai bersih bernombor.', '**A shopping-list cleaner.** Process a list of text lines: skip blank lines and comments, skip repeated items, and print a clean numbered list.'),
      CODE('shopping-cleaner', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local raw = {"Rice", "", "# for Friday", "milk", "rice", "  eggs  ", "Milk"}
local seen, clean = {}, {}

for _, line in ipairs(raw) do
  local item = line:match("^%s*(.-)%s*$"):lower()
  if item == "" or item:sub(1, 1) == "#" then goto next_item end
  if seen[item] then goto next_item end
  seen[item] = true
  clean[#clean + 1] = item
  ::next_item::
end

for i, item in ipairs(clean) do print(i .. ". " .. item) end
`, '1. rice\n2. milk\n3. eggs'),
      EXPLAIN('shopping-cleaner',
        ['1–2', 'Teks mentah; set item yang sudah dilihat; senarai bersih.', 'The raw text; a set of items already seen; the clean list.'],
        ['4–5', 'Untuk setiap baris: buang ruang dan tukar kepada huruf kecil supaya "Rice" dan "rice" sama.', 'For each line: trim and lower-case it so "Rice" and "rice" match.'],
        ['6–7', 'Dua klausa pengawal: kosong/komen, dan item berulang.', 'Two guard clauses: blank/comment, and a repeated item.'],
        ['8–10', 'Item baharu yang sah direkodkan; label di hujung badan.', 'A valid new item is recorded; the label at the end of the body.'],
        ['13', 'Senarai bernombor.', 'The numbered list.'])),
    S('summary',
      UL(
        ['`goto nama` melompat ke `::nama::` dalam fungsi yang sama (Lua 5.2+).', '`goto name` jumps to `::name::` in the same function (Lua 5.2+).'],
        ['Corak continue: `goto next_item` dengan label di hujung badan gelung.', 'The continue pattern: `goto next_item` with a label at the end of the loop body.'],
        ['Lompatan ke dalam skop local dan label yang tidak kelihatan ialah ralat kompil.', 'Jumps into a local’s scope and invisible labels are compile errors.'],
        ['Utamakan `if`, `break` dan `return`; gunakan `goto` apabila ia benar-benar lebih jelas.', 'Prefer `if`, `break` and `return`; use `goto` when it is genuinely clearer.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah `::next_item::` mesti menjadi pernyataan terakhir dalam badan gelung?', 'Why must `::next_item::` be the last statement of the loop body?'],
        ['Adakah `continue` kata kunci dalam Lua 5.4?', 'Is `continue` a keyword in Lua 5.4?'],
        ['Apakah maksud ralat "jumps into the scope of local"?', 'What does the error "jumps into the scope of local" mean?'],
        ['Tulis semula `skip-odd` tanpa `goto`.', 'Rewrite `skip-odd` without `goto`.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures (goto and labels)', url: `${MANUAL}#3.3.4` },
        { title: 'Lua 5.4 Reference Manual §3.5 — Visibility Rules', url: `${MANUAL}#3.5` },
        { title: 'Lua 5.2 Reference Manual §8 — Incompatibilities (introduction of goto)', url: 'https://www.lua.org/manual/5.2/manual.html#8' },
        { title: 'E. W. Dijkstra — Go To Statement Considered Harmful (1968)', url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf' },
      )),
  ],
};

// ─── 3.3 Nested loops and algorithmic thinking ─────────────────────────────

export const LUA103_3_3: LectureContentDef = {
  courseCode: 'LUA103',
  module: 3,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis gelung bersarang untuk grid, pasangan dan corak.', 'Write nested loops for grids, pairs and patterns.'],
        ['Mengira bilangan operasi gelung bersarang dan menerangkan pertumbuhan kuadratik.', 'Count the operations of nested loops and explain quadratic growth.'],
        ['Memecahkan masalah kepada langkah [[algorithm|algoritma]] sebelum mengekod.', 'Break a problem into [[algorithm]] steps before coding.'],
        ['Menggantikan gelung bersarang dengan table set apabila sesuai.', 'Replace nested loops with a set table where appropriate.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 2 dan kuliah 3.1–3.2: gelung, `break`, `goto`.', 'Module 2 and lectures 3.1–3.2: loops, `break`, `goto`.'],
        ['LUA102 1.2: assignment berbilang untuk menukar nilai.', 'LUA102 1.2: multiple assignment for swaps.'],
      )),
    S('introduction',
      P('Gelung di dalam gelung membolehkan kita bekerja dengan data dua dimensi (grid, jadual) dan dengan **pasangan** (setiap item dibandingkan dengan setiap item lain). Gelung bersarang juga ialah tempat pertama di mana **kecekapan** menjadi penting: dua gelung bersarang atas 1 000 elemen bermakna sejuta operasi. Kuliah ini memperkenalkan pemikiran algoritma: menulis langkah dengan jelas, mengira kerja, dan mencari cara yang lebih baik.',
        'A loop inside a loop lets us work with two-dimensional data (grids, tables) and with **pairs** (every item compared with every other item). Nested loops are also the first place where **efficiency** matters: two nested loops over 1,000 elements mean a million operations. This lecture introduces algorithmic thinking: write the steps clearly, count the work, and look for a better way.'),
      KEY('Gelung bersarang atas n elemen ≈ n × n operasi. Gandakan n, empat kali ganda kerja.', 'Nested loops over n elements ≈ n × n operations. Double n, quadruple the work.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Gelung dalam dijalankan **sepenuhnya** untuk setiap pusingan gelung luar.', 'The inner loop runs **completely** for every pass of the outer loop.'],
        ['Jumlah operasi = pusingan luar × pusingan dalam.', 'Total operations = outer passes × inner passes.'],
        ['Pasangan unik `i < j` memerlukan n(n−1)/2 perbandingan.', 'Unique pairs `i < j` need n(n−1)/2 comparisons.'],
        ['**Algoritma:** langkah yang jelas; **pseudocode:** langkah itu dalam bahasa separa formal.', '**Algorithm:** clear steps; **pseudocode:** those steps in semi-formal language.'],
        ['Sering, table (set atau indeks) boleh menggantikan gelung dalam dengan satu carian.', 'Often, a table (a set or index) can replace the inner loop with a single lookup.'],
      )),
    S('detailed_theory',
      P('Ahli sains komputer menerangkan pertumbuhan kerja dengan notasi **O besar**. Gelung tunggal atas n elemen ialah O(n): kerja bertambah secara linear. Dua gelung bersarang atas n elemen ialah O(n²): 10 elemen → 100 operasi, 1 000 elemen → 1 000 000. Untuk data kecil, perbezaan ini tidak penting; untuk data besar, ia menentukan sama ada program selesai dalam sesaat atau sejam. Pemikiran algoritma bermaksud bertanya: "berapa kali setiap baris dijalankan apabila input membesar?"',
        'Computer scientists describe how work grows with **big-O** notation. A single loop over n elements is O(n): work grows linearly. Two nested loops over n elements are O(n²): 10 elements → 100 operations, 1,000 elements → 1,000,000. For small data the difference does not matter; for large data it decides whether a program finishes in a second or an hour. Algorithmic thinking means asking: "how many times does each line run as the input grows?"'),
      P('Banyak masalah "bandingkan setiap pasangan" mempunyai penyelesaian O(n) dengan table: untuk mencari pendua, simpan setiap nilai yang dilihat dalam table set, dan semak ahli dalam satu langkah dan bukannya melawati semua nilai sebelumnya. Ini menukar masa dengan memori — table set menggunakan memori tambahan — pertukaran yang hampir selalu berbaloi. Proses menulis langkah dalam [[pseudocode]] dahulu menjadikan peluang seperti ini lebih mudah dilihat.',
        'Many "compare every pair" problems have an O(n) solution with a table: to find duplicates, store every seen value in a set table, and check membership in one step instead of visiting all earlier values. This trades time for memory — the set uses extra memory — a trade that is almost always worth it. Writing the steps in [[pseudocode]] first makes opportunities like this easier to see.')),
    S('technical_terminology', TERMS('algorithm', 'pseudocode', 'loop', 'table')),
    S('syntax_rules',
      UL(
        ['Grid: `for r = 1, rows do for c = 1, cols do … end end`.', 'Grid: `for r = 1, rows do for c = 1, cols do … end end`.'],
        ['Pasangan unik: `for i = 1, n - 1 do for j = i + 1, n do … end end`.', 'Unique pairs: `for i = 1, n - 1 do for j = i + 1, n do … end end`.'],
        ['Gunakan nama pemboleh ubah gelung yang berbeza untuk setiap tahap (`r`/`c`, `i`/`j`).', 'Use a different loop variable name for each level (`r`/`c`, `i`/`j`).'],
      )),
    S('code_demonstration',
      CODE('triangle', 'lua', 'lua54', ['Corak segi tiga dengan gelung bersarang', 'A triangle pattern with nested loops'], `
local HEIGHT = 4
for row = 1, HEIGHT do
  local line = ""
  for _ = 1, row do
    line = line .. "*"
  end
  print(line)
end
`, '*\n**\n***\n****'),
      EXPLAIN('triangle',
        ['1', 'Ketinggian corak.', 'The pattern’s height.'],
        ['2–3', 'Gelung luar: satu baris output bagi setiap `row`; mulakan teks baris kosong.', 'Outer loop: one output line per `row`; start with an empty line of text.'],
        ['4–6', 'Gelung dalam dijalankan `row` kali — 1, 2, 3, 4 — menambah satu bintang setiap kali.', 'The inner loop runs `row` times — 1, 2, 3, 4 — adding one star each time.'],
        ['7', 'Cetak baris yang lengkap.', 'Print the completed line.'])),
    S('complete_examples',
      CODE('pair-sums', 'lua', 'lua54', ['Pasangan yang jumlahnya sama dengan sasaran', 'Pairs that add up to a target'], `
local prices = {12, 30, 18, 25, 5}
local budget = 30
local comparisons = 0

for i = 1, #prices - 1 do
  for j = i + 1, #prices do
    comparisons = comparisons + 1
    if prices[i] + prices[j] == budget then
      print(prices[i] .. " + " .. prices[j])
    end
  end
end
print("comparisons:", comparisons)
`, '12 + 18\n25 + 5\ncomparisons:\t10', {
        debug: BUG(`
local grid = {{1, 2}, {3, 4}}
for r = 1, 3 do
  for c = 1, 2 do
    io.write(grid[r][c], " ")
  end
end
`, "example:4: attempt to index a nil value (field '?')",
          'Gelung luar pergi hingga 3, tetapi grid hanya mempunyai 2 baris. `grid[3]` ialah `nil`, dan mengindeksnya dengan `[c]` gagal. (Perhatikan nilai 1 hingga 4 sudah ditulis sebelum ralat.) Gunakan `#grid` dan `#grid[r]` sebagai had supaya gelung sentiasa sepadan dengan data. Mesej menyebut `field \'?\'` kerana indeks dikira semasa runtime.',
          'The outer loop goes up to 3, but the grid has only 2 rows. `grid[3]` is `nil`, and indexing it with `[c]` fails. (Notice the values 1 to 4 were already written before the error.) Use `#grid` and `#grid[r]` as limits so the loops always match the data. The message says `field \'?\'` because the index is computed at run time.'),
      }),
      EXPLAIN('pair-sums',
        ['1–3', 'Harga, bajet dan pengira perbandingan.', 'The prices, the budget and a comparison counter.'],
        ['5–6', '`j` bermula pada `i + 1`, jadi setiap pasangan diperiksa **sekali** dan tiada item dipasangkan dengan dirinya.', '`j` starts at `i + 1`, so every pair is checked **once** and no item is paired with itself.'],
        ['7–10', 'Kira perbandingan dan cetak pasangan yang tepat dengan bajet.', 'Count the comparison and print pairs that exactly match the budget.'],
        ['13', 'Untuk 5 harga: 5 × 4 / 2 = 10 perbandingan.', 'For 5 prices: 5 × 4 / 2 = 10 comparisons.']),
      CODE('primes-trial', 'lua', 'lua54', ['Nombor perdana dengan pembahagian cuba', 'Primes by trial division'], `
local primes = {}
for n = 2, 30 do
  local isPrime = true
  for d = 2, n - 1 do
    if d * d > n then break end
    if n % d == 0 then
      isPrime = false
      break
    end
  end
  if isPrime then primes[#primes + 1] = n end
end
print(table.concat(primes, " "))
`, '2 3 5 7 11 13 17 19 23 29'),
      EXPLAIN('primes-trial',
        ['1–3', 'Untuk setiap calon `n`, anggap ia perdana sehingga terbukti sebaliknya.', 'For each candidate `n`, assume it is prime until proven otherwise.'],
        ['4–5', 'Cuba pembahagi `d`. Jika `d²` melebihi `n`, tiada pembahagi yang lebih besar perlu diperiksa — pengoptimuman algoritma yang penting.', 'Try divisors `d`. Once `d²` exceeds `n`, no larger divisor needs checking — an important algorithmic optimisation.'],
        ['6–9', 'Pembahagi ditemui: bukan perdana; `break` daripada gelung **dalam** sahaja.', 'A divisor is found: not prime; `break` from the **inner** loop only.'],
        ['11', 'Rekod nombor perdana.', 'Record the primes.'],
        ['13', 'Sepuluh nombor perdana di bawah 30.', 'The ten primes below 30.'])),
    S('line_by_line',
      EXPLAIN('primes-trial',
        ['5', 'Tanpa baris ini, nombor 29 memerlukan 27 bahagian; dengan baris ini, hanya 4 (d = 2, 3, 4, 5, kemudian 6² = 36 > 29). Pemikiran algoritma mencari kerja yang tidak perlu.', 'Without this line, 29 would need 27 divisions; with it, only 4 (d = 2, 3, 4, 5, then 6² = 36 > 29). Algorithmic thinking looks for unnecessary work.']),
      EXPLAIN('pair-sums',
        ['6', 'Jika `j` bermula pada 1, setiap pasangan diperiksa dua kali (12+18 dan 18+12) dan setiap item dipasangkan dengan dirinya — 25 perbandingan dan bukannya 10.', 'If `j` started at 1, every pair would be checked twice (12+18 and 18+12) and every item paired with itself — 25 comparisons instead of 10.'])),
    S('why_this_way',
      P('Mengapa mempelajari pemikiran algoritma seawal ini? Kerana tabiat menulis gelung bersarang tanpa berfikir menghasilkan program yang berfungsi dengan data ujian kecil tetapi menjadi sangat perlahan dengan data sebenar. Mengira operasi — walaupun secara kasar — membolehkan anda meramal masalah sebelum ia berlaku.',
        'Why learn algorithmic thinking this early? Because the habit of writing nested loops without thinking produces programs that work on small test data but become very slow on real data. Counting operations — even roughly — lets you predict problems before they happen.'),
      P('Gunakan gelung bersarang **apabila** data benar-benar dua dimensi atau anda memang perlu setiap pasangan. Cari alternatif dengan table **apabila** gelung dalam hanya mencari sesuatu.', 'Use nested loops **when** the data is genuinely two-dimensional or you truly need every pair. Look for a table-based alternative **when** the inner loop is only searching for something.')),
    S('execution_flow',
      OL(
        ['`triangle`, `row = 1`: gelung dalam dijalankan sekali → "*".', '`triangle`, `row = 1`: the inner loop runs once → "*".'],
        ['`row = 2`: gelung dalam bermula semula dari 1 dan dijalankan dua kali → "**".', '`row = 2`: the inner loop starts again from 1 and runs twice → "**".'],
        ['Corak berterusan; jumlah pusingan dalam = 1 + 2 + 3 + 4 = 10.', 'The pattern continues; total inner passes = 1 + 2 + 3 + 4 = 10.'],
      )),
    S('memory_behaviour',
      P('Gelung bersarang itu sendiri tidak menggunakan memori tambahan. Tetapi `line = line .. "*"` dalam `triangle` mencipta string baharu setiap pusingan dalam — untuk corak kecil ini tiada masalah. Penyelesaian table set (bahagian Kejuruteraan Perisian) menggunakan memori untuk setiap nilai unik; itulah harga kelajuan O(n).',
        'Nested loops themselves use no extra memory. But `line = line .. "*"` in `triangle` creates a new string on every inner pass — harmless for this small pattern. The set-table solution (Software Engineering section) uses memory for every unique value; that is the price of O(n) speed.')),
    S('alternative_implementations',
      P('Gelung dalam `triangle` boleh digantikan dengan fungsi pustaka — mengurangkan satu tahap bersarang:', 'The inner loop of `triangle` can be replaced by a library function — removing one level of nesting:'),
      CODE('triangle-rep', 'lua', 'lua54', ['Corak dengan string.rep', 'The pattern with string.rep'], `
for row = 1, 4 do
  print(string.rep(" ", 4 - row) .. string.rep("*", row))
end
`, '   *\n  **\n ***\n****'),
      EXPLAIN('triangle-rep',
        ['1–3', '`string.rep(s, n)` mengulang string `n` kali. Ruang di hadapan menjajarkan segi tiga ke kanan. Kerja dalaman masih wujud (di dalam `string.rep`), tetapi kod lebih ringkas dan lebih pantas.', '`string.rep(s, n)` repeats a string `n` times. Leading spaces right-align the triangle. The inner work still exists (inside `string.rep`), but the code is shorter and faster.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan nama pemboleh ubah gelung yang sama dalam gelung luar dan dalam.', 'Using the same loop variable name in the outer and inner loops.'],
        ['Had gelung yang tidak sepadan dengan data (`for r = 1, 3` untuk grid 2 baris).', 'Loop limits that do not match the data (`for r = 1, 3` for a 2-row grid).'],
        ['Membandingkan setiap pasangan dua kali, atau item dengan dirinya sendiri.', 'Comparing every pair twice, or an item with itself.'],
        ['Menjangka `break` dalam gelung dalam menghentikan gelung luar.', 'Expecting `break` in the inner loop to stop the outer one.'],
      )),
    S('debugging',
      P('Untuk menyahpepijat gelung bersarang, cetak **kedua-dua** pemboleh ubah gelung pada setiap pusingan dalam: `print(i, j)`. Ini menunjukkan dengan tepat berapa kali gelung berjalan dan dalam susunan apa. Ralat yang paling biasa ialah had yang tidak sepadan dengan saiz data, seperti dalam versi berpepijat `pair-sums`; gunakan `#` pada data itu sendiri dan bukannya nombor tetap. Satu lagi pepijat biasa ialah pengumpul yang tidak diset semula untuk setiap pusingan luar:',
        'To debug nested loops, print **both** loop variables on every inner pass: `print(i, j)`. This shows exactly how many times the loops run and in what order. The most common error is a limit that does not match the data’s size, as in the buggy `pair-sums`; use `#` on the data itself instead of a fixed number. Another common bug is an accumulator that is not reset for each outer pass:'),
      CODE('row-totals', 'lua', 'lua54', ['Jumlah setiap baris', 'Each row’s total'], `
local sales = {{3, 4}, {10, 2}, {5, 5}}
for r = 1, #sales do
  local rowTotal = 0
  for c = 1, #sales[r] do
    rowTotal = rowTotal + sales[r][c]
  end
  print("row " .. r .. ": " .. rowTotal)
end
`, 'row 1: 7\nrow 2: 12\nrow 3: 10', {
        debug: BUG(`
local sales = {{3, 4}, {10, 2}, {5, 5}}
local rowTotal
for r = 1, #sales do
  for c = 1, #sales[r] do
    rowTotal = rowTotal + sales[r][c]
  end
  print("row " .. r .. ": " .. rowTotal)
end
`, "example:5: attempt to perform arithmetic on a nil value (local 'rowTotal')",
          'Pengumpul diisytiharkan di luar kedua-dua gelung **tanpa** nilai awal, jadi penambahan pertama gagal. Walaupun anda memberinya `= 0`, ia masih salah: jumlah akan terkumpul merentas baris (7, 19, 29). Pengumpul untuk setiap baris mesti diisytiharkan dan diset kepada 0 **di dalam** gelung luar, seperti versi asal.',
          'The accumulator is declared outside both loops **without** an initial value, so the first addition fails. Even if you gave it `= 0`, it would still be wrong: totals would accumulate across rows (7, 19, 29). A per-row accumulator must be declared and set to 0 **inside** the outer loop, as in the original version.'),
      }),
      EXPLAIN('row-totals',
        ['1', 'Jualan dua produk untuk tiga hari.', 'Sales of two products over three days.'],
        ['2–3', 'Pengumpul baharu bernilai 0 untuk **setiap** baris.', 'A fresh accumulator set to 0 for **each** row.'],
        ['4–6', 'Jumlahkan lajur baris itu.', 'Sum that row’s columns.'],
        ['7', 'Paparkan jumlah baris.', 'Display the row total.'])),
    S('performance',
      P('Untuk n = 1 000, gelung bersarang O(n²) melakukan sejuta operasi — beberapa milisaat dalam Lua. Untuk n = 100 000, ia sepuluh bilion — beberapa minit. Penyelesaian O(n) dengan table melakukan 100 000 operasi untuk saiz yang sama. Apabila program anda perlahan dengan data besar, cari gelung bersarang dahulu.',
        'For n = 1,000, an O(n²) nested loop does a million operations — a few milliseconds in Lua. For n = 100,000 it is ten billion — several minutes. An O(n) table-based solution does 100,000 operations for the same size. When your program is slow on large data, look for nested loops first.')),
    S('software_engineering',
      P('Mencari pendua dalam senarai — dua algoritma, keputusan yang sama, kos yang sangat berbeza:', 'Finding duplicates in a list — two algorithms, the same result, very different costs:'),
      CODE('poor-quadratic-dupes', 'lua', 'lua54', ['Pelaksanaan lemah: O(n²) dengan gelung bersarang', 'Poor implementation: O(n²) with nested loops'], `
local ids = {101, 205, 330, 205, 101, 470}
local checks, dupes = 0, {}
for i = 1, #ids do
  for j = i + 1, #ids do
    checks = checks + 1
    if ids[i] == ids[j] then dupes[#dupes + 1] = ids[i] end
  end
end
print(table.concat(dupes, " "), "checks:", checks)
`, '101 205\tchecks:\t15'),
      EXPLAIN('poor-quadratic-dupes',
        ['1–2', 'ID dengan dua pendua; pengira kerja.', 'IDs with two duplicates; a work counter.'],
        ['3–8', 'Setiap ID dibandingkan dengan setiap ID selepasnya: 6 × 5 / 2 = 15 perbandingan.', 'Every ID is compared with every later ID: 6 × 5 / 2 = 15 comparisons.'],
        ['9', 'Pendua ditemui, dengan kos kuadratik.', 'The duplicates are found, at quadratic cost.']),
      CODE('improved-set-dupes', 'lua', 'lua54', ['Pelaksanaan lebih baik: O(n) dengan table set', 'Improved implementation: O(n) with a set table'], `
local ids = {101, 205, 330, 205, 101, 470}
local seen, checks, dupes = {}, 0, {}
for _, id in ipairs(ids) do
  checks = checks + 1
  if seen[id] then dupes[#dupes + 1] = id end
  seen[id] = true
end
print(table.concat(dupes, " "), "checks:", checks)
`, '205 101\tchecks:\t6'),
      EXPLAIN('improved-set-dupes',
        ['1–2', 'Data yang sama; set `seen` mengingati ID yang sudah dilihat.', 'The same data; the `seen` set remembers IDs already seen.'],
        ['3–7', 'Satu laluan: carian table `seen[id]` menggantikan seluruh gelung dalam.', 'One pass: the table lookup `seen[id]` replaces the whole inner loop.'],
        ['8', 'Pendua yang sama (dalam susunan ditemui) dengan 6 semakan dan bukannya 15. Untuk 10 000 ID: 10 000 berbanding hampir 50 juta.', 'The same duplicates (in the order found) with 6 checks instead of 15. For 10,000 IDs: 10,000 versus almost 50 million.'])),
    S('industry_use_cases',
      UL(
        ['Pemprosesan imej berulang atas setiap piksel (baris × lajur).', 'Image processing iterates over every pixel (rows × columns).'],
        ['Pengesanan perlanggaran dalam permainan mengelak semakan setiap pasangan dengan grid ruang.', 'Collision detection in games avoids checking every pair by using a spatial grid.'],
        ['Pangkalan data menggunakan indeks (seperti table set) untuk mengelak imbasan bersarang.', 'Databases use indexes (like set tables) to avoid nested scans.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tukar `triangle` untuk melukis segi tiga terbalik.', 'Change `triangle` to draw an upside-down triangle.'],
        ['Kira perbandingan dalam `pair-sums` untuk 10 harga tanpa menjalankannya, kemudian sahkan.', 'Compute the comparisons in `pair-sums` for 10 prices without running it, then confirm.'],
        ['Jalankan versi berpepijat `pair-sums` dan `row-totals`.', 'Run the buggy `pair-sums` and `row-totals`.'],
      )),
    S('mini_project',
      P('**Isihan buih (bubble sort).** Isih senarai markah dengan menukar pasangan bersebelahan, dan berhenti awal apabila satu laluan tidak membuat tukaran.', '**Bubble sort.** Sort a list of scores by swapping adjacent pairs, and stop early when a pass makes no swaps.'),
      CODE('bubble-sort', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local scores = {64, 25, 12, 22, 11}
local passes = 0

for last = #scores - 1, 1, -1 do
  local swapped = false
  for i = 1, last do
    if scores[i] > scores[i + 1] then
      scores[i], scores[i + 1] = scores[i + 1], scores[i]
      swapped = true
    end
  end
  passes = passes + 1
  if not swapped then break end
end
print(table.concat(scores, " "), "passes:", passes)
`, '11 12 22 25 64\tpasses:\t4'),
      EXPLAIN('bubble-sort',
        ['1–2', 'Senarai untuk diisih dan pengira laluan.', 'The list to sort and a pass counter.'],
        ['4–5', 'Selepas setiap laluan, elemen terbesar yang tinggal berada di hujung, jadi had laluan seterusnya berkurang.', 'After each pass the largest remaining element is at the end, so the next pass’s limit shrinks.'],
        ['6–11', 'Bandingkan pasangan bersebelahan dan tukar dengan assignment berbilang (LUA102 1.2).', 'Compare adjacent pairs and swap with multiple assignment (LUA102 1.2).'],
        ['12–13', 'Kira laluan; jika tiada tukaran, senarai sudah tersusun — `break` awal.', 'Count the pass; if nothing was swapped, the list is sorted — `break` early.'],
        ['15', 'Senarai tersusun selepas 4 laluan.', 'The sorted list after 4 passes.'])),
    S('summary',
      UL(
        ['Gelung dalam dijalankan sepenuhnya untuk setiap pusingan gelung luar.', 'The inner loop runs completely for every pass of the outer loop.'],
        ['Gelung bersarang atas n elemen ialah O(n²); pasangan unik ialah n(n−1)/2.', 'Nested loops over n elements are O(n²); unique pairs are n(n−1)/2.'],
        ['Padankan had dengan data (`#t`) dan set semula pengumpul di tempat yang betul.', 'Match limits to the data (`#t`) and reset accumulators in the right place.'],
        ['Table set sering menggantikan gelung dalam carian dengan satu carian O(1).', 'A set table often replaces an inner search loop with one O(1) lookup.'],
      )),
    S('knowledge_check',
      OL(
        ['Berapa kali badan dalaman dijalankan untuk `for i = 1, 5 do for j = 1, 4 do … end end`?', 'How many times does the inner body run for `for i = 1, 5 do for j = 1, 4 do … end end`?'],
        ['Mengapakah `j` bermula pada `i + 1` dalam masalah pasangan?', 'Why does `j` start at `i + 1` in pair problems?'],
        ['Jika n menjadi 10 kali lebih besar, berapa kali lebih banyak kerja dilakukan oleh algoritma O(n²)?', 'If n becomes 10 times larger, how much more work does an O(n²) algorithm do?'],
        ['Bagaimanakah table set mempercepat carian pendua?', 'How does a set table speed up duplicate search?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.3.5 — For Statement', url: `${MANUAL}#3.3.5` },
        { title: 'Programming in Lua (1st ed.) — 11.1 Arrays and 11.2 Matrices', url: `${PIL}/11.2.html` },
        { title: 'Khan Academy — Asymptotic notation (big-O)', url: 'https://www.khanacademy.org/computing/computer-science/algorithms/asymptotic-notation/a/big-o-notation' },
        { title: 'Lua 5.4 Reference Manual — string.rep', url: `${MANUAL}#pdf-string.rep` },
      )),
  ],
};

export const LUA103_M3 = [LUA103_3_1, LUA103_3_2, LUA103_3_3];
