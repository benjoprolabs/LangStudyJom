import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA103 · Module 1 — Conditional Statements (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 1.1 if, then and end ──────────────────────────────────────────────────

export const LUA103_1_1: LectureContentDef = {
  courseCode: 'LUA103',
  module: 1,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis pernyataan [[conditional|bersyarat]] `if … then … end` dan `if … else … end`.', 'Write [[conditional]] statements `if … then … end` and `if … else … end`.'],
        ['Menerangkan bagaimana syarat dinilai menggunakan [[truthiness]] Lua.', 'Explain how a condition is evaluated using Lua [[truthiness]].'],
        ['Mengenal pasti skop pemboleh ubah `local` di dalam blok `if`.', 'Identify the scope of `local` variables inside an `if` block.'],
        ['Memudahkan syarat boolean yang berlebihan.', 'Simplify redundant boolean conditions.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['LUA102 modul 2–3: boolean, truthiness, operator hubungan dan logik.', 'LUA102 modules 2–3: booleans, truthiness, relational and logical operators.'],
        ['LUA101 3.3: blok dan kata kunci `end`.', 'LUA101 3.3: blocks and the `end` keyword.'],
      )),
    S('introduction',
      P('Sehingga kini program kita berjalan dari atas ke bawah, setiap baris sekali. Program sebenar mesti **membuat keputusan**: memberi diskaun hanya kepada ahli, memaparkan amaran hanya apabila bateri lemah, menolak kata laluan yang salah. Pernyataan `if` ialah alat paling asas untuk [[control-flow|aliran kawalan]] — ia memilih sama ada sesuatu blok kod dijalankan atau dilangkau.',
        'Until now our programs have run from top to bottom, every line once. Real programs must **make decisions**: give a discount only to members, show a warning only when the battery is low, reject a wrong password. The `if` statement is the most basic tool of [[control-flow]] — it chooses whether a block of code runs or is skipped.'),
      KEY('`if syarat then … end` menjalankan blok **hanya** apabila syarat benar (bukan `nil` dan bukan `false`).', '`if condition then … end` runs the block **only** when the condition is truthy (neither `nil` nor `false`).', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Syarat:** sebarang ungkapan; hasilnya dinilai mengikut truthiness, bukan semestinya boolean.', '**Condition:** any expression; its result is judged by truthiness, not necessarily a boolean.'],
        ['**Blok `then`:** pernyataan antara `then` dan `end` (atau `else`).', '**`then` block:** the statements between `then` and `end` (or `else`).'],
        ['**Cabang `else`:** dijalankan apabila syarat palsu. Tepat satu daripada dua cabang dijalankan.', '**`else` branch:** runs when the condition is falsy. Exactly one of the two branches runs.'],
        ['**Skop:** `local` yang diisytiharkan dalam cabang hanya wujud dalam cabang itu.', '**Scope:** a `local` declared inside a branch exists only in that branch.'],
        ['**Bersarang:** blok `if` boleh mengandungi `if` lain.', '**Nesting:** an `if` block can contain another `if`.'],
      )),
    S('detailed_theory',
      P('Pengkompil menterjemah `if` kepada dua arahan asas mesin maya: **ujian** (`TEST` atau perbandingan seperti `LT`) dan **lompatan bersyarat** (`JMP`). Jika syarat palsu, mesin maya melompat ke atas blok `then` terus ke `else` atau ke selepas `end`. Tiada "nilai" yang dihasilkan oleh `if` itu sendiri — ia pernyataan, bukan ungkapan. Ini berbeza daripada operator `and/or` (LUA102 3.2), yang menghasilkan nilai. Memahami perbezaan ini penting untuk kuliah 1.3.',
        'The compiler translates `if` into two basic virtual-machine instructions: a **test** (`TEST` or a comparison such as `LT`) and a **conditional jump** (`JMP`). If the condition is falsy, the virtual machine jumps over the `then` block straight to `else` or past `end`. `if` itself produces no "value" — it is a statement, not an expression. That differs from the `and/or` operators (LUA102 3.2), which produce values. Understanding this difference matters for lecture 1.3.'),
      P('Setiap cabang ialah **blok** dengan skopnya sendiri. Pemboleh ubah yang diisytiharkan dengan `local` di dalam cabang hilang pada `end` cabang itu; jika anda memerlukan nilai selepas `if`, isytiharkan pemboleh ubah **sebelum** `if` dan beri nilai di dalam cabang. Lua juga tidak mempunyai pernyataan `switch`; keputusan berbilang ditulis dengan `elseif` (kuliah 1.2) atau table carian.',
        'Each branch is a **block** with its own scope. A variable declared with `local` inside a branch disappears at that branch’s `end`; if you need a value after the `if`, declare the variable **before** the `if` and assign it inside the branches. Lua also has no `switch` statement; multi-way decisions are written with `elseif` (lecture 1.2) or a lookup table.')),
    S('technical_terminology', TERMS('conditional', 'control-flow', 'truthiness', 'scope')),
    S('syntax_rules',
      UL(
        ['`if syarat then pernyataan end`', '`if condition then statements end`'],
        ['`if syarat then … else … end` — tepat satu cabang dijalankan.', '`if condition then … else … end` — exactly one branch runs.'],
        ['Kurungan di sekeliling syarat pilihan: `if (x > 0) then` sah, tetapi gaya Lua biasanya tanpa kurungan.', 'Parentheses around the condition are optional: `if (x > 0) then` is valid, but Lua style usually omits them.'],
        ['Gunakan `==` untuk perbandingan; `=` dalam syarat ialah ralat sintaks.', 'Use `==` for comparison; `=` in a condition is a syntax error.'],
      )),
    S('code_demonstration',
      CODE('temperature-advice', 'lua', 'lua54', ['Keputusan ringkas dengan if', 'A simple decision with if'], `
local temperature = 33

if temperature > 30 then
  print("Drink more water today.")
end

print("Have a nice day!")
`, 'Drink more water today.\nHave a nice day!'),
      EXPLAIN('temperature-advice',
        ['1', 'Suhu semasa dalam darjah Celsius.', 'The current temperature in degrees Celsius.'],
        ['3–5', 'Syarat `temperature > 30` benar (33 > 30), jadi blok dijalankan dan nasihat dicetak.', 'The condition `temperature > 30` is true (33 > 30), so the block runs and the advice is printed.'],
        ['7', 'Baris selepas `end` sentiasa dijalankan, tanpa mengira syarat.', 'The line after `end` always runs, whatever the condition.'])),
    S('complete_examples',
      CODE('parity-else', 'lua', 'lua54', ['if … else: tepat satu cabang', 'if … else: exactly one branch'], `
for _, n in ipairs({3, 8}) do
  if n % 2 == 0 then
    print(n .. " is even")
  else
    print(n .. " is odd")
  end
end
`, '3 is odd\n8 is even'),
      EXPLAIN('parity-else',
        ['1', 'Uji dua nombor.', 'Test two numbers.'],
        ['2–3', 'Baki 0 apabila dibahagi 2 bermakna genap.', 'A remainder of 0 when divided by 2 means even.'],
        ['4–6', '`else` menangkap semua kes lain — tepat satu mesej bagi setiap nombor.', '`else` catches every other case — exactly one message per number.']),
      CODE('branch-scope', 'lua', 'lua54', ['Skop local di dalam cabang', 'Scope of locals inside a branch'], `
local points = 120
local badge

if points >= 100 then
  local bonus = 10
  badge = "gold"
  points = points + bonus
end

print(badge, points, bonus)
`, 'gold\t130\tnil', {
        debug: BUG(`
local points = 120

if points >= 100 then
  local badge = "gold"
end

print("Your badge: " .. badge)
`, "example:7: attempt to concatenate a nil value (global 'badge')",
          '`badge` diisytiharkan dengan `local` **di dalam** blok `if`, jadi ia hilang pada `end` (baris 5). Pada baris 7, nama `badge` dicari sebagai global — yang tidak wujud. Isytiharkan `local badge` **sebelum** `if` dan beri nilai di dalam cabang, seperti versi asal.',
          '`badge` is declared with `local` **inside** the `if` block, so it disappears at `end` (line 5). On line 7, the name `badge` is looked up as a global — which does not exist. Declare `local badge` **before** the `if` and assign it inside the branch, as in the original version.'),
      }),
      EXPLAIN('branch-scope',
        ['1–2', '`badge` diisytiharkan di luar `if` (nilai awal `nil`) supaya ia kekal selepas `end`.', '`badge` is declared outside the `if` (initially `nil`) so it survives past `end`.'],
        ['4–8', 'Di dalam cabang: `bonus` ialah local sementara; `badge` dan `points` (luar) dikemas kini.', 'Inside the branch: `bonus` is a temporary local; `badge` and `points` (outer) are updated.'],
        ['10', '`badge` dan `points` membawa nilai baharu; `bonus` sudah hilang, jadi dibaca sebagai `nil`.', '`badge` and `points` carry the new values; `bonus` is gone, so it reads as `nil`.'])),
    S('line_by_line',
      EXPLAIN('temperature-advice',
        ['3', 'Ungkapan perbandingan menghasilkan `true` atau `false`; `if` hanya melihat truthiness hasil itu.', 'The comparison expression produces `true` or `false`; `if` only looks at that result’s truthiness.']),
      EXPLAIN('branch-scope',
        ['5', 'Local `bonus` ialah butiran pelaksanaan cabang ini sahaja — mengehadkannya ke dalam cabang menghalang kod lain daripada bergantung padanya.', 'The local `bonus` is an implementation detail of this branch only — keeping it inside the branch stops other code from depending on it.'])),
    S('why_this_way',
      P('Mengapa Lua memerlukan `then` dan `end` sedangkan bahasa lain menggunakan kurungan kerinting? Kata kunci yang jelas menjadikan sempadan blok mudah dibaca oleh manusia yang bukan pengaturcara dan menghapuskan kekaburan "dangling else" yang terkenal dalam C. Mengapa skop setiap cabang? Supaya nilai sementara sesuatu keputusan tidak bocor ke seluruh program.',
        'Why does Lua need `then` and `end` when other languages use curly braces? Clear keywords make block boundaries easy for non-programmers to read and remove the famous "dangling else" ambiguity of C. Why a scope per branch? So the temporary values of one decision do not leak into the rest of the program.'),
      P('Gunakan `if` **apabila** tingkah laku program bergantung pada data — input, keadaan permainan, konfigurasi. Jika anda mendapati diri menulis `if` yang sama di banyak tempat, itu tanda untuk memindahkan keputusan ke dalam fungsi.', 'Use `if` **when** the program’s behaviour depends on data — input, game state, configuration. If you find yourself writing the same `if` in many places, that is a sign to move the decision into a function.')),
    S('execution_flow',
      OL(
        ['`branch-scope` menetapkan `points = 120` dan `badge = nil`.', '`branch-scope` sets `points = 120` and `badge = nil`.'],
        ['Mesin maya membandingkan `points >= 100` → benar, jadi ia **tidak** melompat.', 'The virtual machine compares `points >= 100` → true, so it does **not** jump.'],
        ['Blok dijalankan: slot untuk `bonus` diperuntukkan, `badge` dan `points` dikemas kini.', 'The block runs: a slot for `bonus` is allocated, `badge` and `points` are updated.'],
        ['Pada `end`, slot `bonus` dibebaskan.', 'At `end`, the `bonus` slot is released.'],
        ['`print` membaca `badge`, `points` dan global `bonus` (tiada) → `gold 130 nil`.', '`print` reads `badge`, `points` and the global `bonus` (missing) → `gold 130 nil`.'],
      )),
    S('memory_behaviour',
      P('`if` tidak memperuntukkan memori; ia hanya lompatan. Local dalam cabang menggunakan slot daftar yang dibebaskan pada `end` dan boleh digunakan semula oleh local seterusnya. Jika local cabang memegang table besar, table itu boleh dikutip sebaik sahaja cabang tamat — satu lagi sebab untuk mengehadkan skop pemboleh ubah.',
        '`if` allocates no memory; it is only a jump. Locals inside a branch use register slots that are released at `end` and can be reused by later locals. If a branch’s local holds a large table, that table can be collected as soon as the branch ends — another reason to keep variable scope small.')),
    S('alternative_implementations',
      P('Apabila keputusan hanya memilih **nilai**, fungsi kecil dengan `return` awal lebih kemas daripada pemboleh ubah yang diberi nilai dalam setiap cabang:', 'When a decision only chooses a **value**, a small function with early `return`s is tidier than a variable assigned in every branch:'),
      CODE('return-choice', 'lua', 'lua54', ['Memilih nilai dengan return', 'Choosing a value with return'], `
local function batteryIcon(level)
  if level < 20 then
    return "[!  ]"
  end
  return "[###]"
end

print(batteryIcon(15), batteryIcon(80))
`, '[!  ]\t[###]'),
      EXPLAIN('return-choice',
        ['1–6', '`return` di dalam cabang terus menamatkan fungsi, jadi `else` tidak diperlukan — baris 5 hanya dicapai apabila syarat palsu.', '`return` inside the branch ends the function immediately, so no `else` is needed — line 5 is only reached when the condition is false.'],
        ['8', 'Dua panggilan, dua ikon.', 'Two calls, two icons.'])),
    S('common_mistakes',
      UL(
        ['Terlupa `then` atau `end`.', 'Forgetting `then` or `end`.'],
        ['Menulis `=` dan bukannya `==` dalam syarat.', 'Writing `=` instead of `==` in a condition.'],
        ['Mengisytiharkan `local` di dalam cabang tetapi menggunakannya selepas `end`.', 'Declaring a `local` inside a branch but using it after `end`.'],
        ['Menulis `if x == true then` — cukup `if x then` (jika `x` boolean).', 'Writing `if x == true then` — `if x then` is enough (when `x` is a boolean).'],
        ['Menganggap `if 0 then` palsu — 0 adalah benar dalam Lua.', 'Assuming `if 0 then` is false — 0 is truthy in Lua.'],
      )),
    S('debugging',
      P('Pepijat `if` jatuh kepada dua jenis: **ralat sintaks** (kata kunci hilang, `=` dan bukannya `==`) yang ditemui sebelum program berjalan, dan **ralat logik** di mana cabang yang salah dijalankan. Untuk ralat logik, cetak nilai syarat sejurus sebelum `if`: `print("debug:", temperature, temperature > 30)`. Contoh berikut menunjukkan ralat sintaks klasik daripada bahasa lain:',
        '`if` bugs fall into two kinds: **syntax errors** (a missing keyword, `=` instead of `==`) found before the program runs, and **logic errors** where the wrong branch runs. For logic errors, print the condition’s value just before the `if`: `print("debug:", temperature, temperature > 30)`. The following example shows a classic syntax error carried over from other languages:'),
      CODE('adult-check', 'lua', 'lua54', ['Perbandingan yang betul dalam syarat', 'A correct comparison in a condition'], `
local age = 18
if age == 18 then
  print("Welcome, new adult!")
end
`, 'Welcome, new adult!', {
        debug: BUG(`
local age = 18
if age = 18 then
  print("Welcome, new adult!")
end
`, "example:2: 'then' expected near '='",
          'Dalam Lua, `=` ialah **assignment** dan hanya boleh menjadi pernyataan, tidak boleh muncul dalam ungkapan. Penghurai membaca `if age`, kemudian menjangkakan `then` tetapi menemui `=`. Ini melindungi daripada pepijat C yang terkenal `if (x = 5)`. Gunakan `==` untuk perbandingan.',
          'In Lua, `=` is **assignment** and can only be a statement, never part of an expression. The parser reads `if age`, then expects `then` but finds `=`. This protects against the famous C bug `if (x = 5)`. Use `==` for comparison.'),
      }),
      EXPLAIN('adult-check',
        ['1', 'Umur pengguna.', 'The user’s age.'],
        ['2–4', '`==` membandingkan; blok dijalankan kerana 18 == 18.', '`==` compares; the block runs because 18 == 18.'])),
    S('performance',
      P('`if` ialah antara binaan paling murah: satu ujian dan satu lompatan. Dalam syarat yang kompleks, letakkan ujian yang paling murah atau paling kerap gagal dahulu (litar pintas, LUA102 3.2). Jangan risau tentang prestasi `if` dalam kod biasa — kebolehbacaan jauh lebih penting.',
        '`if` is among the cheapest constructs: one test and one jump. In complex conditions, put the cheapest or most often failing test first (short-circuiting, LUA102 3.2). Do not worry about `if` performance in ordinary code — readability matters far more.')),
    S('software_engineering',
      P('Syarat boolean yang berlebihan ialah tanda kod yang ditulis tergesa-gesa:', 'Redundant boolean conditions are a sign of rushed code:'),
      CODE('poor-redundant-if', 'lua', 'lua54', ['Pelaksanaan lemah: if untuk memulangkan boolean', 'Poor implementation: if to return a boolean'], `
local function isPassing(score)
  if score >= 50 == true then
    return true
  else
    return false
  end
end

print(isPassing(72), isPassing(31))
`, 'true\tfalse'),
      EXPLAIN('poor-redundant-if',
        ['1–7', '`score >= 50` sudah boolean; membandingkannya dengan `true` dan kemudian memulangkan `true`/`false` secara manual menambah enam baris tanpa makna tambahan.', '`score >= 50` is already a boolean; comparing it with `true` and then returning `true`/`false` by hand adds six lines with no extra meaning.'],
        ['9', 'Keputusan betul.', 'Correct results.']),
      CODE('improved-direct-boolean', 'lua', 'lua54', ['Pelaksanaan lebih baik: pulangkan perbandingan terus', 'Improved implementation: return the comparison directly'], `
local PASS_MARK = 50

local function isPassing(score)
  return score >= PASS_MARK
end

print(isPassing(72), isPassing(31))
`, 'true\tfalse'),
      EXPLAIN('improved-direct-boolean',
        ['1', 'Markah lulus diberi nama — tiada nombor ajaib.', 'The pass mark is named — no magic number.'],
        ['3–5', 'Perbandingan itu sendiri ialah jawapan. Satu baris, tiada cabang.', 'The comparison itself is the answer. One line, no branches.'],
        ['7', 'Keputusan sama.', 'The same results.'])),
    S('industry_use_cases',
      UL(
        ['Permainan: `if health <= 0 then gameOver() end`.', 'Games: `if health <= 0 then gameOver() end`.'],
        ['Pelayan web: `if not user then return 401 end` sebelum memproses permintaan.', 'Web servers: `if not user then return 401 end` before processing a request.'],
        ['Fail konfigurasi Neovim: `if vim.fn.has("mac") == 1 then … end` untuk tetapan khusus platform.', 'Neovim configuration: `if vim.fn.has("mac") == 1 then … end` for platform-specific settings.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `temperature-advice` dengan suhu 25 dan terangkan perubahan output.', 'Run `temperature-advice` with a temperature of 25 and explain the change in output.'],
        ['Dalam `parity-else`, tambah 0 dan −7 ke dalam senarai dan ramalkan output.', 'In `parity-else`, add 0 and −7 to the list and predict the output.'],
        ['Jalankan versi berpepijat `branch-scope` dan `adult-check`; kenal pasti yang mana ralat runtime dan yang mana ralat sintaks.', 'Run the buggy `branch-scope` and `adult-check`; identify which is a runtime error and which a syntax error.'],
      )),
    S('mini_project',
      P('**Kos penghantaran.** Kira kos penghantaran: percuma untuk pesanan RM100 ke atas, jika tidak RM8, tambah RM5 untuk penghantaran ekspres.', '**Shipping cost.** Compute a shipping cost: free for orders of RM100 or more, otherwise RM8, plus RM5 for express delivery.'),
      CODE('shipping-fee', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local FREE_FROM, STANDARD, EXPRESS_EXTRA = 100, 8, 5

local function shippingFee(orderTotal, express)
  local fee = 0
  if orderTotal < FREE_FROM then
    fee = STANDARD
  end
  if express then
    fee = fee + EXPRESS_EXTRA
  end
  return fee
end

print(shippingFee(60, false), shippingFee(60, true), shippingFee(150, true))
`, '8\t13\t5'),
      EXPLAIN('shipping-fee',
        ['1', 'Peraturan perniagaan sebagai pemalar bernama.', 'The business rules as named constants.'],
        ['3–4', 'Yuran bermula 0.', 'The fee starts at 0.'],
        ['5–7', '`if` pertama: yuran standard hanya untuk pesanan kecil.', 'The first `if`: the standard fee only for small orders.'],
        ['8–10', '`if` kedua yang **bebas**: tambahan ekspres boleh digabungkan dengan mana-mana kes di atas.', 'A second, **independent** `if`: the express extra combines with either case above.'],
        ['11', 'Pulangkan jumlah.', 'Return the total.'],
        ['14', '60 biasa → 8; 60 ekspres → 13; 150 ekspres → 5.', '60 standard → 8; 60 express → 13; 150 express → 5.'])),
    S('summary',
      UL(
        ['`if syarat then … end` menjalankan blok hanya apabila syarat benar.', '`if condition then … end` runs a block only when the condition is truthy.'],
        ['`else` memberi cabang alternatif; tepat satu cabang dijalankan.', '`else` gives an alternative branch; exactly one branch runs.'],
        ['Local dalam cabang hilang pada `end`; isytiharkan sebelum `if` jika perlu.', 'Locals in a branch vanish at `end`; declare them before the `if` if needed.'],
        ['Pulangkan perbandingan terus dan bukannya `if … return true else return false end`.', 'Return a comparison directly instead of `if … return true else return false end`.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah output `if "" then print("yes") end`?', 'What is the output of `if "" then print("yes") end`?'],
        ['Mengapakah `if x = 1 then` ditolak oleh Lua?', 'Why does Lua reject `if x = 1 then`?'],
        ['Di manakah anda patut mengisytiharkan pemboleh ubah yang diberi nilai dalam kedua-dua cabang `if/else`?', 'Where should you declare a variable that is assigned in both branches of an `if/else`?'],
        ['Tulis semula `if ok then return true else return false end` dalam satu baris.', 'Rewrite `if ok then return true else return false end` in one line.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures', url: `${MANUAL}#3.3.4` },
        { title: 'Programming in Lua (1st ed.) — 4.3.1 if then else', url: `${PIL}/4.3.1.html` },
        { title: 'Lua 5.4 Reference Manual §3.5 — Visibility Rules', url: `${MANUAL}#3.5` },
        { title: 'Programming in Lua (1st ed.) — 4.2 Local Variables and Blocks', url: `${PIL}/4.2.html` },
      )),
  ],
};

// ─── 1.2 elseif and multi-branch conditions ────────────────────────────────

export const LUA103_1_2: LectureContentDef = {
  courseCode: 'LUA103',
  module: 1,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis keputusan berbilang cabang dengan `if … elseif … else … end`.', 'Write multi-way decisions with `if … elseif … else … end`.'],
        ['Menerangkan mengapa **susunan** cabang `elseif` penting.', 'Explain why the **order** of `elseif` branches matters.'],
        ['Membezakan `elseif` dan `else if`.', 'Distinguish `elseif` from `else if`.'],
        ['Menggantikan rantai `elseif` yang panjang dengan table carian apabila sesuai.', 'Replace long `elseif` chains with a lookup table when appropriate.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1: `if`, `then`, `else`, `end`.', 'Lecture 1.1: `if`, `then`, `else`, `end`.'],
        ['LUA102 3.2: operator hubungan dan julat.', 'LUA102 3.2: relational operators and ranges.'],
      )),
    S('introduction',
      P('Banyak keputusan mempunyai lebih daripada dua kemungkinan: gred A hingga F, tahap amaran hijau-kuning-merah, kadar cukai mengikut julat pendapatan. Lua tiada pernyataan `switch`; sebaliknya ia menyediakan `elseif`, yang menyemak syarat satu demi satu dan menjalankan cabang **pertama** yang benar. Kuasa — dan perangkap — `elseif` terletak pada susunan itu.',
        'Many decisions have more than two outcomes: grades A to F, green-yellow-red warning levels, tax rates by income band. Lua has no `switch` statement; instead it provides `elseif`, which checks conditions one by one and runs the **first** branch that is true. The power — and the trap — of `elseif` lies in that order.'),
      KEY('Hanya **satu** cabang dijalankan: yang pertama yang syaratnya benar. Cabang seterusnya tidak disemak lagi.', 'Only **one** branch runs: the first whose condition is true. Later branches are not even checked.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`elseif` ialah satu perkataan; ia menambah syarat baharu pada `if` yang sama tanpa `end` tambahan.', '`elseif` is one word; it adds a new condition to the same `if` without an extra `end`.'],
        ['Syarat dinilai dari atas ke bawah; penilaian berhenti pada yang pertama benar.', 'Conditions are evaluated top to bottom; evaluation stops at the first true one.'],
        ['`else` di hujung menangkap semua kes yang tidak dipadankan (cabang lalai).', 'A final `else` catches every unmatched case (the default branch).'],
        ['Untuk julat, susun daripada yang paling ketat ke yang paling longgar (contohnya ≥ 80 sebelum ≥ 50).', 'For ranges, order from the strictest to the loosest (for example ≥ 80 before ≥ 50).'],
      )),
    S('detailed_theory',
      P('Rantai `if … elseif … elseif … else … end` dikompil kepada jujukan ujian dan lompatan: jika ujian pertama gagal, lompat ke ujian kedua; jika berjaya, jalankan blok dan lompat ke hujung keseluruhan rantai. Oleh itu kos rantai bergantung pada **berapa banyak syarat disemak sebelum padanan** — untuk rantai panjang, cabang yang paling kerap patut diletakkan dahulu. Lebih penting lagi, kerana hanya cabang pertama yang benar dijalankan, cabang yang lebih umum yang diletakkan terlalu awal akan "menelan" kes yang sepatutnya untuk cabang lebih khusus di bawahnya.',
        'An `if … elseif … elseif … else … end` chain compiles to a sequence of tests and jumps: if the first test fails, jump to the second test; if it succeeds, run the block and jump to the end of the whole chain. So the cost of a chain depends on **how many conditions are checked before a match** — for long chains, the most frequent branch should come first. More importantly, because only the first true branch runs, a more general branch placed too early will "swallow" cases meant for a more specific branch below it.'),
      P('Menulis `else if` (dua perkataan) bukan ralat sintaks dengan sendirinya — ia ialah `if` **baharu** yang bersarang di dalam `else`, dan oleh itu memerlukan `end` sendiri. Lupa `end` tambahan itu menghasilkan ralat "`end` expected" di hujung fail. Gunakan `elseif` untuk keputusan berbilang cabang; gunakan `else` diikuti `if` bersarang hanya apabila keputusan dalaman benar-benar berasingan.',
        'Writing `else if` (two words) is not a syntax error by itself — it is a **new** `if` nested inside the `else`, and therefore needs its own `end`. Forgetting that extra `end` produces an "`end` expected" error at the end of the file. Use `elseif` for multi-way decisions; use `else` followed by a nested `if` only when the inner decision is genuinely separate.')),
    S('technical_terminology', TERMS('conditional', 'control-flow', 'operator', 'table')),
    S('syntax_rules',
      UL(
        ['`if a then … elseif b then … elseif c then … else … end` — satu `end` sahaja.', '`if a then … elseif b then … elseif c then … else … end` — only one `end`.'],
        ['Setiap `elseif` memerlukan syarat dan `then` sendiri.', 'Every `elseif` needs its own condition and `then`.'],
        ['`else` pilihan, tetapi disyorkan untuk mengendalikan kes yang tidak dijangka.', '`else` is optional, but recommended for handling unexpected cases.'],
      )),
    S('code_demonstration',
      CODE('letter-grade', 'lua', 'lua54', ['Gred huruf dengan elseif', 'Letter grades with elseif'], `
local function grade(score)
  if score >= 80 then
    return "A"
  elseif score >= 65 then
    return "B"
  elseif score >= 50 then
    return "C"
  else
    return "F"
  end
end

print(grade(91), grade(80), grade(64), grade(50), grade(12))
`, 'A\tA\tC\tC\tF'),
      EXPLAIN('letter-grade',
        ['1–3', 'Syarat paling ketat dahulu: 80 ke atas ialah A.', 'The strictest condition first: 80 and above is A.'],
        ['4–5', 'Dicapai hanya jika markah < 80; jadi cabang ini bermaksud 65–79.', 'Reached only if the score is < 80; so this branch means 65–79.'],
        ['6–7', 'Dicapai hanya jika < 65; bermaksud 50–64.', 'Reached only if < 65; it means 50–64.'],
        ['8–10', 'Lalai: semua yang lain (di bawah 50).', 'The default: everything else (below 50).'],
        ['13', 'Sempadan diuji: 80 → A, 64 → C, 50 → C.', 'Boundaries tested: 80 → A, 64 → C, 50 → C.'])),
    S('complete_examples',
      CODE('order-matters', 'lua', 'lua54', ['Susunan yang salah menelan cabang', 'The wrong order swallows branches'], `
local function wrongGrade(score)
  if score >= 50 then
    return "C"
  elseif score >= 80 then
    return "A"
  end
  return "F"
end

print(wrongGrade(95), wrongGrade(60), wrongGrade(10))
`, 'C\tC\tF'),
      EXPLAIN('order-matters',
        ['1–3', 'Syarat umum diletakkan dahulu: setiap markah ≥ 50 berhenti di sini.', 'The general condition is placed first: every score ≥ 50 stops here.'],
        ['4–5', 'Cabang ini **tidak boleh dicapai** — sebarang markah ≥ 80 sudah ditangkap oleh baris 2. Tiada ralat dilaporkan.', 'This branch is **unreachable** — any score ≥ 80 was already caught by line 2. No error is reported.'],
        ['6–7', 'Lalai untuk markah rendah.', 'The default for low scores.'],
        ['10', '95 sepatutnya A tetapi mendapat C — pepijat logik yang senyap.', '95 should be an A but gets a C — a silent logic bug.']),
      CODE('traffic-light', 'lua', 'lua54', ['Cabang lalai untuk nilai yang tidak dijangka', 'A default branch for unexpected values'], `
local function action(light)
  if light == "green" then
    return "go"
  elseif light == "yellow" then
    return "slow down"
  elseif light == "red" then
    return "stop"
  else
    return "unknown signal: " .. tostring(light)
  end
end

print(action("yellow"), action("blue"), action(nil))
`, 'slow down\tunknown signal: blue\tunknown signal: nil', {
        debug: BUG(`
local function action(light)
  if light == "green" then
    return "go"
  else if light == "red" then
    return "stop"
  end
end

print(action("red"))
`, "example:9: 'end' expected (to close 'function' at line 1) near <eof>",
          '`else if` (dua perkataan) memulakan `if` **baharu** di dalam `else`. `end` pada baris 6 menutup `if` dalaman itu, `end` pada baris 7 menutup `if` luar, dan `function` daripada baris 1 tidak pernah ditutup. Lua menyedarinya hanya di hujung fail. Gunakan `elseif` (satu perkataan) — kemudian satu `end` sahaja diperlukan untuk seluruh rantai.',
          '`else if` (two words) starts a **new** `if` inside the `else`. The `end` on line 6 closes that inner `if`, the `end` on line 7 closes the outer `if`, and the `function` from line 1 is never closed. Lua only notices at the end of the file. Use `elseif` (one word) — then a single `end` closes the whole chain.'),
      }),
      EXPLAIN('traffic-light',
        ['1–7', 'Tiga nilai yang dijangka, setiap satu dengan cabangnya.', 'Three expected values, each with its branch.'],
        ['8–10', '`else` menangkap **apa sahaja** yang lain, termasuk `nil`. `tostring` memastikan mesej tidak gagal walaupun nilai bukan string.', '`else` catches **anything** else, including `nil`. `tostring` ensures the message never fails even if the value is not a string.'],
        ['13', 'Satu nilai sah dan dua yang tidak dijangka.', 'One valid value and two unexpected ones.'])),
    S('line_by_line',
      EXPLAIN('letter-grade',
        ['4', 'Kerana cabang dinilai mengikut tertib, `elseif score >= 65` tidak perlu menulis `score < 80 and` — maklumat itu sudah tersirat. Ini menjadikan rantai yang betul ringkas, tetapi bergantung sepenuhnya pada susunan.', 'Because branches are evaluated in order, `elseif score >= 65` does not need `score < 80 and` — that information is implied. This keeps a correct chain short, but makes it depend entirely on the order.']),
      EXPLAIN('traffic-light',
        ['9', 'Cabang lalai yang memaparkan nilai yang tidak dikenali menjadikan pepijat data kelihatan serta-merta, dan bukannya diam-diam memulangkan `nil`.', 'A default branch that shows the unrecognised value makes data bugs visible immediately, instead of silently returning `nil`.'])),
    S('why_this_way',
      P('Mengapa Lua tiada `switch`? Kerana `elseif` dan table carian sudah meliputi semua kegunaannya, dan `switch` gaya C membawa perangkap tersendiri (terlupa `break`). Falsafah Lua — sedikit mekanisme yang umum — lebih suka satu binaan yang fleksibel: `elseif` boleh menguji julat, jenis dan gabungan syarat, perkara yang tidak boleh dilakukan oleh `switch` tradisional.',
        'Why does Lua have no `switch`? Because `elseif` and lookup tables already cover all its uses, and the C-style `switch` brings its own traps (forgetting `break`). Lua’s philosophy — few, general mechanisms — prefers one flexible construct: `elseif` can test ranges, types and combined conditions, which a traditional `switch` cannot.'),
      P('Gunakan `elseif` **apabila** cabang bergantung pada julat atau syarat yang berbeza; gunakan table carian **apabila** anda memetakan nilai tepat kepada hasil tetap (kod ke nama, hari ke jadual).', 'Use `elseif` **when** branches depend on ranges or different conditions; use a lookup table **when** you map exact values to fixed results (codes to names, days to schedules).')),
    S('execution_flow',
      OL(
        ['`grade(64)`: `64 >= 80` palsu → lompat ke `elseif` pertama.', '`grade(64)`: `64 >= 80` is false → jump to the first `elseif`.'],
        ['`64 >= 65` palsu → lompat ke `elseif` kedua.', '`64 >= 65` is false → jump to the second `elseif`.'],
        ['`64 >= 50` benar → jalankan `return "C"`; tiada cabang lain disemak.', '`64 >= 50` is true → run `return "C"`; no other branch is checked.'],
      )),
    S('memory_behaviour',
      P('Rantai `elseif` tidak memperuntukkan memori — ia hanya ujian dan lompatan. Table carian (bahagian Alternatif) dicipta **sekali** dan kemudian setiap carian ialah akses hash tanpa peruntukan. Jika table carian dicipta di dalam fungsi yang kerap dipanggil, ia akan dicipta semula setiap kali — cipta di luar fungsi.',
        'An `elseif` chain allocates no memory — it is only tests and jumps. A lookup table (Alternatives section) is created **once**, and every lookup after that is a hash access with no allocation. If a lookup table were created inside a frequently called function, it would be rebuilt every time — create it outside the function.')),
    S('alternative_implementations',
      P('Untuk padanan nilai tepat, table carian menggantikan rantai `elseif` dan memisahkan data daripada logik:', 'For exact-value matching, a lookup table replaces an `elseif` chain and separates data from logic:'),
      CODE('opening-hours', 'lua', 'lua54', ['Table carian dan bukannya elseif', 'A lookup table instead of elseif'], `
local HOURS = {
  sat = "10:00-14:00",
  sun = "closed",
}

local function openingHours(day)
  return HOURS[day] or "09:00-18:00"
end

print(openingHours("mon"), openingHours("sat"), openingHours("sun"))
`, '09:00-18:00\t10:00-14:00\tclosed'),
      EXPLAIN('opening-hours',
        ['1–4', 'Hanya pengecualian disimpan sebagai data.', 'Only the exceptions are stored as data.'],
        ['6–8', 'Satu carian; `or` memberi waktu biasa untuk hari yang tidak disenaraikan.', 'One lookup; `or` gives the usual hours for unlisted days.'],
        ['10', 'Hari biasa, Sabtu dan Ahad.', 'A weekday, Saturday and Sunday.'])),
    S('common_mistakes',
      UL(
        ['Meletakkan syarat umum sebelum syarat khusus, menjadikan cabang tidak boleh dicapai.', 'Putting a general condition before a specific one, making branches unreachable.'],
        ['Menulis `else if` dan terlupa `end` tambahan.', 'Writing `else if` and forgetting the extra `end`.'],
        ['Tiada `else`, jadi nilai yang tidak dijangka diam-diam tidak menghasilkan apa-apa.', 'No `else`, so unexpected values silently produce nothing.'],
        ['Mengulang syarat yang sudah tersirat (`elseif x < 80 and x >= 65`) — betul tetapi bising.', 'Repeating conditions that are already implied (`elseif x < 80 and x >= 65`) — correct but noisy.'],
      )),
    S('debugging',
      P('Pepijat `elseif` biasanya **logik**: cabang yang salah dijalankan dan tiada ralat. Strategi terbaik ialah menguji setiap **sempadan**: untuk gred, uji 49, 50, 64, 65, 79, 80. Jika keputusan untuk sempadan salah, semak operator (`>` berbanding `>=`) dan susunan cabang. Ralat sintaks yang paling biasa ialah `else if`, seperti dalam contoh `traffic-light`. Satu lagi ialah terlupa syarat selepas `elseif`:',
        '`elseif` bugs are usually **logic** bugs: the wrong branch runs and there is no error. The best strategy is to test every **boundary**: for grades, test 49, 50, 64, 65, 79, 80. If a boundary result is wrong, check the operator (`>` versus `>=`) and the branch order. The most common syntax error is `else if`, as in the `traffic-light` example. Another is forgetting the condition after `elseif`:'),
      CODE('fan-speed', 'lua', 'lua54', ['Kelajuan kipas mengikut suhu', 'Fan speed by temperature'], `
local t = 28
if t >= 30 then
  print("high")
elseif t >= 25 then
  print("medium")
else
  print("off")
end
`, 'medium', {
        debug: BUG(`
local t = 28
if t >= 30 then
  print("high")
elseif then
  print("medium")
else
  print("off")
end
`, "example:4: unexpected symbol near 'then'",
          'Setiap `elseif` memerlukan syarat sendiri. Penghurai membaca `elseif` dan menjangkakan ungkapan, tetapi menemui `then` terus. Mesej "unexpected symbol near \'then\'" bermaksud sesuatu hilang **sebelum** `then` — di sini, syarat `t >= 25`.',
          'Every `elseif` needs its own condition. The parser reads `elseif` and expects an expression, but finds `then` straight away. The message "unexpected symbol near \'then\'" means something is missing **before** `then` — here, the condition `t >= 25`.'),
      }),
      EXPLAIN('fan-speed',
        ['1', 'Suhu semasa.', 'The current temperature.'],
        ['2–8', 'Tiga tahap: 30 ke atas, 25–29, dan di bawah 25. Untuk 28, cabang kedua dijalankan.', 'Three levels: 30 and above, 25–29, and below 25. For 28, the second branch runs.'])),
    S('performance',
      P('Dalam rantai `elseif` yang panjang (berpuluh cabang), setiap kes yang lewat disemak selepas semua cabang sebelumnya. Jika kes yang paling kerap berada di bawah, ia membazir masa. Untuk padanan tepat yang banyak, table carian sentiasa satu operasi tanpa mengira bilangan kes.',
        'In a long `elseif` chain (dozens of branches), each late case is checked after all earlier branches. If the most frequent case is at the bottom, time is wasted. For many exact matches, a lookup table is always one operation whatever the number of cases.')),
    S('software_engineering',
      P('Bandingkan rantai yang mencampurkan data dengan logik dengan versi yang dipacu data (data-driven):', 'Compare a chain that mixes data with logic against a data-driven version:'),
      CODE('poor-long-chain', 'lua', 'lua54', ['Pelaksanaan lemah: rantai panjang dengan nilai terkod', 'Poor implementation: a long chain with hard-coded values'], `
local function taxRate(income)
  if income > 100000 then return 0.24
  elseif income > 70000 then return 0.21
  elseif income > 50000 then return 0.14
  elseif income > 35000 then return 0.08
  else return 0 end
end

print(taxRate(80000), taxRate(20000))
`, '0.21\t0'),
      EXPLAIN('poor-long-chain',
        ['1–7', 'Jalur cukai dikodkan ke dalam logik. Mengemas kini kadar tahunan bermakna menyunting kod dan berisiko tersilap susunan.', 'The tax bands are coded into the logic. Updating the yearly rates means editing code and risking a wrong order.'],
        ['9', 'Keputusan betul untuk dua pendapatan.', 'Correct results for two incomes.']),
      CODE('improved-band-table', 'lua', 'lua54', ['Pelaksanaan lebih baik: jalur sebagai data', 'Improved implementation: bands as data'], `
local BANDS = {
  {above = 100000, rate = 0.24},
  {above = 70000, rate = 0.21},
  {above = 50000, rate = 0.14},
  {above = 35000, rate = 0.08},
}

local function taxRate(income)
  for _, band in ipairs(BANDS) do
    if income > band.above then return band.rate end
  end
  return 0
end

print(taxRate(80000), taxRate(20000))
`, '0.21\t0'),
      EXPLAIN('improved-band-table',
        ['1–6', 'Jalur disimpan sebagai senarai tersusun daripada tertinggi ke terendah. Kemas kini tahunan hanya menukar data.', 'The bands are stored as a list ordered from highest to lowest. A yearly update only changes the data.'],
        ['8–13', 'Satu gelung kecil dengan satu `if` menggantikan seluruh rantai; susunan ditentukan oleh data, bukan oleh kod.', 'One small loop with one `if` replaces the whole chain; the order is defined by the data, not the code.'],
        ['15', 'Keputusan sama.', 'The same results.'])),
    S('industry_use_cases',
      UL(
        ['Penapis log mengelaskan mesej mengikut tahap (`error`, `warn`, `info`, `debug`).', 'Log filters classify messages by level (`error`, `warn`, `info`, `debug`).'],
        ['Sistem kewangan menggunakan jadual jalur (bands) untuk cukai dan komisen.', 'Financial systems use band tables for taxes and commissions.'],
        ['AI musuh dalam permainan memilih tindakan dengan `elseif` mengikut jarak ke pemain.', 'Enemy AI in games chooses actions with `elseif` by distance to the player.'],
      )),
    S('practical_demonstration',
      OL(
        ['Uji `letter-grade` dengan 49, 50, 64, 65, 79 dan 80.', 'Test `letter-grade` with 49, 50, 64, 65, 79 and 80.'],
        ['Betulkan `order-matters` dengan menyusun semula cabangnya sahaja.', 'Fix `order-matters` by reordering its branches only.'],
        ['Tambah jalur cukai baharu dalam `improved-band-table` tanpa menyentuh fungsi.', 'Add a new tax band to `improved-band-table` without touching the function.'],
      )),
    S('mini_project',
      P('**Kategori BMI.** Kira BMI (berat ÷ tinggi²) dan kelaskan kepada kurang berat (< 18.5), normal (< 25), lebih berat (< 30) atau obes.', '**BMI categories.** Compute BMI (weight ÷ height²) and classify it as underweight (< 18.5), normal (< 25), overweight (< 30) or obese.'),
      CODE('bmi-category', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function bmiCategory(weightKg, heightM)
  local bmi = weightKg / heightM ^ 2
  local category
  if bmi < 18.5 then
    category = "underweight"
  elseif bmi < 25 then
    category = "normal"
  elseif bmi < 30 then
    category = "overweight"
  else
    category = "obese"
  end
  return string.format("%.1f %s", bmi, category)
end

print(bmiCategory(50, 1.70))
print(bmiCategory(68, 1.75))
print(bmiCategory(95, 1.80))
`, '17.3 underweight\n22.2 normal\n29.3 overweight'),
      EXPLAIN('bmi-category',
        ['1–2', '`^` lebih tinggi keutamaan daripada `/`, jadi ini berat ÷ (tinggi²).', '`^` binds tighter than `/`, so this is weight ÷ (height²).'],
        ['3–12', 'Rantai `elseif` dari paling rendah ke paling tinggi menggunakan `<` — susunan menaik juga betul selagi setiap cabang menggunakan had atas.', 'An `elseif` chain from lowest to highest using `<` — ascending order is also correct as long as every branch uses an upper bound.'],
        ['13', 'Satu tempat perpuluhan dan kategori.', 'One decimal place and the category.'],
        ['16–18', 'Tiga orang dalam tiga kategori berbeza.', 'Three people in three different categories.'])),
    S('summary',
      UL(
        ['`elseif` menambah cabang tanpa `end` tambahan; hanya cabang pertama yang benar dijalankan.', '`elseif` adds branches without extra `end`s; only the first true branch runs.'],
        ['Susun julat daripada paling ketat ke paling longgar (atau sebaliknya secara konsisten).', 'Order ranges from strictest to loosest (or consistently the other way).'],
        ['`else if` ialah `if` bersarang yang memerlukan `end` sendiri.', '`else if` is a nested `if` that needs its own `end`.'],
        ['Untuk padanan tepat atau jalur, pertimbangkan table data.', 'For exact matches or bands, consider a data table.'],
      )),
    S('knowledge_check',
      OL(
        ['Berapa cabang dijalankan dalam satu rantai `if/elseif/else`?', 'How many branches run in one `if/elseif/else` chain?'],
        ['Mengapakah `elseif score >= 80` di bawah `if score >= 50` tidak pernah dicapai?', 'Why is `elseif score >= 80` below `if score >= 50` never reached?'],
        ['Berapa `end` diperlukan untuk `if … else if … end`?', 'How many `end`s does `if … else if … end` need?'],
        ['Bilakah table carian lebih baik daripada `elseif`?', 'When is a lookup table better than `elseif`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures', url: `${MANUAL}#3.3.4` },
        { title: 'Programming in Lua (1st ed.) — 4.3.1 if then else', url: `${PIL}/4.3.1.html` },
        { title: 'Lua 5.4 Reference Manual §9 — The Complete Syntax of Lua', url: `${MANUAL}#9` },
        { title: 'Programming in Lua (1st ed.) — 4.3 Control Structures', url: `${PIL}/4.3.html` },
      )),
  ],
};

// ─── 1.3 The "a and b or c" idiom and its pitfall ──────────────────────────

export const LUA103_1_3: LectureContentDef = {
  courseCode: 'LUA103',
  module: 1,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan idiom `a and b or c` sebagai "ungkapan bersyarat" ringkas.', 'Use the `a and b or c` idiom as a short "conditional expression".'],
        ['Menerangkan dengan tepat mengapa idiom gagal apabila `b` ialah `false` atau `nil`.', 'Explain precisely why the idiom fails when `b` is `false` or `nil`.'],
        ['Memilih antara idiom dan `if/else` dengan selamat.', 'Choose safely between the idiom and `if/else`.'],
        ['Mengelak perangkap keutamaan apabila idiom digabungkan dengan `..`.', 'Avoid precedence traps when the idiom is combined with `..`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['LUA102 3.2: `and`/`or` memulangkan operan dan berlitar pintas.', 'LUA102 3.2: `and`/`or` return operands and short-circuit.'],
        ['Kuliah 1.1–1.2: `if`, `else`, `elseif`.', 'Lectures 1.1–1.2: `if`, `else`, `elseif`.'],
      )),
    S('introduction',
      P('Banyak bahasa mempunyai operator ternari `syarat ? a : b`. Lua tidak, tetapi pengaturcara Lua menggunakan idiom `syarat and a or b` untuk kesan yang hampir sama — anda telah melihatnya dalam LUA102. Kuliah ini menerangkan idiom itu dengan teliti, kerana ia mempunyai **satu perangkap** yang menyebabkan pepijat senyap dalam kod sebenar: apabila nilai "benar" itu sendiri ialah `false` atau `nil`.',
        'Many languages have a ternary operator `condition ? a : b`. Lua does not, but Lua programmers use the idiom `condition and a or b` for almost the same effect — you have seen it in LUA102. This lecture examines the idiom carefully, because it has **one trap** that causes silent bugs in real code: when the "true" value is itself `false` or `nil`.'),
      KEY('`c and a or b` hanya selamat apabila `a` **tidak mungkin** `false` atau `nil`.', '`c and a or b` is only safe when `a` **can never** be `false` or `nil`.', ['Peraturan utama', 'The key rule'])),
    S('fundamental_concepts',
      UL(
        ['`c and a or b` dihuraikan sebagai `(c and a) or b` kerana `and` lebih tinggi keutamaan daripada `or`.', '`c and a or b` parses as `(c and a) or b` because `and` binds tighter than `or`.'],
        ['Jika `c` benar dan `a` benar → hasilnya `a`. Jika `c` palsu → hasilnya `b`.', 'If `c` is truthy and `a` is truthy → the result is `a`. If `c` is falsy → the result is `b`.'],
        ['**Perangkap:** jika `c` benar tetapi `a` palsu (`false`/`nil`), `(c and a)` palsu, jadi hasilnya `b` — salah.', '**Trap:** if `c` is truthy but `a` is falsy (`false`/`nil`), `(c and a)` is falsy, so the result is `b` — wrong.'],
        ['Idiom ialah **ungkapan** (menghasilkan nilai); `if` ialah **pernyataan**.', 'The idiom is an **expression** (produces a value); `if` is a **statement**.'],
      )),
    S('detailed_theory',
      P('Mari jejaki idiom dengan jadual kebenaran. Kes 1: `c` benar, `a = "yes"` → `c and a` = `"yes"` (benar) → `"yes" or b` = `"yes"`. Betul. Kes 2: `c` palsu → `c and a` = `c` (palsu) → `c or b` = `b`. Betul. Kes 3: `c` benar, `a = false` → `c and a` = `false` → `false or b` = **`b`**. Salah! Kita mahu `false`, tetapi mendapat `b`. Masalahnya ialah `or` tidak dapat membezakan "syarat palsu" daripada "syarat benar tetapi nilai yang dipilih palsu" — kedua-duanya kelihatan sama kepadanya.',
        'Let us trace the idiom with a truth table. Case 1: `c` truthy, `a = "yes"` → `c and a` = `"yes"` (truthy) → `"yes" or b` = `"yes"`. Correct. Case 2: `c` falsy → `c and a` = `c` (falsy) → `c or b` = `b`. Correct. Case 3: `c` truthy, `a = false` → `c and a` = `false` → `false or b` = **`b`**. Wrong! We wanted `false` but got `b`. The problem is that `or` cannot tell "the condition was false" from "the condition was true but the chosen value is false" — both look the same to it.'),
      P('Perangkap ini paling kerap berlaku dengan tetapan boolean (`useSaved and savedValue or true`) dan dengan fungsi yang mungkin memulangkan `nil`. Penyelesaiannya mudah: apabila `a` mungkin palsu, gunakan `if/else` biasa. Satu lagi perangkap ialah keutamaan: `"Result: " .. ok and "pass" or "fail"` dihuraikan sebagai `("Result: " .. ok) and …` kerana `..` mengikat lebih kuat daripada `and`, jadi idiom mesti dibalut dengan kurungan apabila digabungkan dengan operator lain.',
        'This trap most often appears with boolean settings (`useSaved and savedValue or true`) and with functions that may return `nil`. The fix is simple: when `a` may be falsy, use an ordinary `if/else`. Another trap is precedence: `"Result: " .. ok and "pass" or "fail"` parses as `("Result: " .. ok) and …` because `..` binds tighter than `and`, so the idiom must be wrapped in parentheses when combined with other operators.')),
    S('technical_terminology', TERMS('short-circuit', 'truthiness', 'operator-precedence', 'conditional')),
    S('syntax_rules',
      UL(
        ['Bentuk: `syarat and nilaiBenar or nilaiPalsu`.', 'Form: `condition and valueIfTrue or valueIfFalse`.'],
        ['Balut dengan kurungan dalam ungkapan yang lebih besar: `"x: " .. (c and a or b)`.', 'Wrap in parentheses inside larger expressions: `"x: " .. (c and a or b)`.'],
        ['Jika `nilaiBenar` boleh `false`/`nil`, gunakan `if … then … else … end`.', 'If `valueIfTrue` can be `false`/`nil`, use `if … then … else … end`.'],
      )),
    S('code_demonstration',
      CODE('plural-label', 'lua', 'lua54', ['Idiom untuk teks bersyarat', 'The idiom for conditional text'], `
for _, count in ipairs({0, 1, 5}) do
  local word = count == 1 and "item" or "items"
  print(count .. " " .. word)
end
`, '0 items\n1 item\n5 items'),
      EXPLAIN('plural-label',
        ['1', 'Uji tiga kiraan.', 'Test three counts.'],
        ['2', '`"item"` dan `"items"` tidak pernah palsu, jadi idiom **selamat** di sini: tunggal untuk 1, jamak untuk yang lain.', '`"item"` and `"items"` are never falsy, so the idiom is **safe** here: singular for 1, plural otherwise.'],
        ['3', 'Gabungkan nombor dan perkataan.', 'Join the number and the word.'])),
    S('complete_examples',
      CODE('false-trap', 'lua', 'lua54', ['Perangkap: nilai benar ialah false', 'The trap: the true value is false'], `
local useSaved = true
local savedSound = false        -- the user turned sound OFF

local sound = useSaved and savedSound or true
print("idiom:", sound)

local soundFixed
if useSaved then soundFixed = savedSound else soundFixed = true end
print("if/else:", soundFixed)
`, 'idiom:\ttrue\nif/else:\tfalse'),
      EXPLAIN('false-trap',
        ['1–2', 'Tetapan disimpan: pengguna **mematikan** bunyi (`false`).', 'A saved setting: the user switched sound **off** (`false`).'],
        ['4–5', '`true and false` → `false`; `false or true` → `true`. Idiom mengabaikan pilihan pengguna — bunyi dihidupkan semula.', '`true and false` → `false`; `false or true` → `true`. The idiom ignores the user’s choice — sound comes back on.'],
        ['7–9', '`if/else` memilih cabang berdasarkan **syarat** sahaja, jadi `false` dihormati.', '`if/else` chooses the branch on the **condition** alone, so `false` is respected.']),
      CODE('table-select', 'lua', 'lua54', ['Pilihan selamat dengan fungsi choose', 'A safe choice with a choose function'], `
local function choose(condition, ifTrue, ifFalse)
  if condition then return ifTrue end
  return ifFalse
end

print(choose(true, false, "fallback"), choose(false, false, "fallback"))
print(choose(true, nil, "fallback"))
`, 'false\tfallback\nnil', {
        debug: BUG(`
local ok = true
print("Result: " .. ok and "pass" or "fail")
`, "example:2: attempt to concatenate a boolean value (local 'ok')",
          '`..` mempunyai keutamaan lebih tinggi daripada `and`, jadi Lua mengira `"Result: " .. ok` dahulu — menggabungkan string dengan boolean, yang tidak dibenarkan. Idiom mesti dibalut: `"Result: " .. (ok and "pass" or "fail")`. Ralat ini nasib baik jelas; dalam kes lain, keutamaan yang salah memberi jawapan yang salah secara senyap.',
          '`..` has higher precedence than `and`, so Lua computes `"Result: " .. ok` first — joining a string with a boolean, which is not allowed. The idiom must be wrapped: `"Result: " .. (ok and "pass" or "fail")`. This error is luckily obvious; in other cases, wrong precedence gives a silently wrong answer.'),
      }),
      EXPLAIN('table-select',
        ['1–4', 'Fungsi kecil yang berkelakuan seperti operator ternari sebenar: ia memutuskan berdasarkan **syarat**, tidak pernah berdasarkan nilai yang dipilih.', 'A small function that behaves like a real ternary operator: it decides on the **condition**, never on the chosen value.'],
        ['6', '`false` dipulangkan dengan betul apabila syarat benar.', '`false` is correctly returned when the condition is true.'],
        ['7', '`nil` juga dipulangkan dengan betul — idiom akan memberi "fallback".', '`nil` is correctly returned too — the idiom would give "fallback".'])),
    S('line_by_line',
      EXPLAIN('false-trap',
        ['4', 'Langkah demi langkah: `useSaved and savedSound` → `true and false` → `false`. Kemudian `false or true` → `true`. Syarat sebenarnya benar, tetapi `or` hanya melihat bahawa bahagian kirinya palsu.', 'Step by step: `useSaved and savedSound` → `true and false` → `false`. Then `false or true` → `true`. The condition was actually true, but `or` only sees that its left side is falsy.']),
      EXPLAIN('plural-label',
        ['2', 'Semak "selamat" dengan cepat: tanya, "bolehkah nilai di tengah menjadi `false` atau `nil`?" Di sini ia literal string, jadi tidak.', 'A quick "safe?" check: ask, "can the middle value ever be `false` or `nil`?" Here it is a string literal, so no.'])),
    S('why_this_way',
      P('Mengapa Lua tiada operator ternari? Kerana `and`/`or` yang memulangkan operan sudah memberi idiom yang mencukupi untuk kebanyakan kes, selaras dengan falsafah bahasa yang kecil. Kosnya ialah perangkap yang diterangkan di sini. (Luau, bahasa Roblox, menambah if-expression sebenar — `if c then a else b` — tepat untuk menyelesaikan masalah ini; ia diajar dalam program Luau.)',
        'Why does Lua have no ternary operator? Because `and`/`or` returning operands already give an idiom that covers most cases, in line with the language’s small size. The cost is the trap described here. (Luau, Roblox’s language, adds a real if-expression — `if c then a else b` — precisely to solve this problem; it is taught in the Luau programme.)'),
      P('Gunakan idiom **apabila** nilai benar ialah literal atau sesuatu yang pasti benar (string, nombor, table). Gunakan `if/else` **apabila** nilai mungkin `false`/`nil`, atau apabila pembaca mungkin keliru.', 'Use the idiom **when** the true value is a literal or something certainly truthy (a string, number, table). Use `if/else` **when** the value may be `false`/`nil`, or when readers might be confused.')),
    S('execution_flow',
      OL(
        ['`useSaved and savedSound`: `useSaved` benar, jadi `and` menilai dan memulangkan `savedSound` (`false`).', '`useSaved and savedSound`: `useSaved` is truthy, so `and` evaluates and returns `savedSound` (`false`).'],
        ['`false or true`: bahagian kiri palsu, jadi `or` menilai dan memulangkan `true`.', '`false or true`: the left side is falsy, so `or` evaluates and returns `true`.'],
        ['`sound` menjadi `true` — bertentangan dengan tetapan pengguna.', '`sound` becomes `true` — contradicting the user’s setting.'],
      )),
    S('memory_behaviour',
      P('Idiom dan `if/else` sama-sama tidak memperuntukkan memori. Pendekatan "table yang diindeks boolean" (`({[true] = a, [false] = b})[c]`) yang kadang-kadang dicadangkan dalam talian **mencipta table baharu** setiap kali — membazir dalam gelung. Fungsi `choose` dalam contoh di atas lebih baik: tiada peruntukan, dan semantik yang betul.',
        'The idiom and `if/else` both allocate nothing. The "boolean-indexed table" approach (`({[true] = a, [false] = b})[c]`) sometimes suggested online **creates a new table** every time — wasteful in a loop. The `choose` function above is better: no allocation, and correct semantics.')),
    S('alternative_implementations',
      P('Apabila hanya nilai lalai diperlukan (bukan syarat am), corak "semak nil" daripada LUA102 2.1 lebih jelas daripada idiom:', 'When only a default value is needed (not a general condition), the "nil check" pattern from LUA102 2.1 is clearer than the idiom:'),
      CODE('nil-default', 'lua', 'lua54', ['Lalai yang menghormati false', 'A default that respects false'], `
local options = {verbose = false}

local verbose = options.verbose
if verbose == nil then verbose = true end

local level = options.level
if level == nil then level = 3 end

print(verbose, level)
`, 'false\t3'),
      EXPLAIN('nil-default',
        ['1', 'Pengguna menetapkan `verbose` kepada `false` tetapi tidak menetapkan `level`.', 'The user set `verbose` to `false` but did not set `level`.'],
        ['3–4', 'Lalai digunakan **hanya** jika nilai tiada; `false` kekal.', 'The default is used **only** if the value is missing; `false` stays.'],
        ['6–7', '`level` tiada, jadi lalai 3 digunakan.', '`level` is missing, so the default 3 is used.'],
        ['9', 'Kedua-dua keputusan betul.', 'Both results are correct.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan idiom untuk memilih antara `false` dan sesuatu yang lain.', 'Using the idiom to choose between `false` and something else.'],
        ['Menggunakan idiom dengan panggilan fungsi yang mungkin memulangkan `nil` sebagai nilai tengah.', 'Using the idiom with a function call that may return `nil` as the middle value.'],
        ['Terlupa kurungan apabila menggabungkan idiom dengan `..` atau aritmetik.', 'Forgetting parentheses when combining the idiom with `..` or arithmetic.'],
        ['Menyarangkan idiom (`a and b or c and d or e`) — sukar dibaca; gunakan `elseif`.', 'Nesting the idiom (`a and b or c and d or e`) — hard to read; use `elseif`.'],
      )),
    S('debugging',
      P('Pepijat idiom hampir selalu **senyap**: tiada ralat, hanya nilai lalai muncul apabila ia tidak sepatutnya. Apabila anda mengesyaki idiom, tanya soalan tunggal: "bolehkah nilai di tengah menjadi `false` atau `nil`?" Jika ya, tulis semula dengan `if/else`. Ralat yang **kelihatan** biasanya datang daripada nilai tengah yang cuba mengindeks `nil`, kerana `and` tidak melindungi bahagian dalam ungkapan itu sendiri:',
        'Idiom bugs are almost always **silent**: no error, just the default value appearing when it should not. When you suspect the idiom, ask one question: "can the middle value be `false` or `nil`?" If yes, rewrite with `if/else`. **Visible** errors usually come from the middle value trying to index `nil`, because `and` does not protect the inside of that expression itself:'),
      CODE('greeting-name', 'lua', 'lua54', ['Nama paparan dengan semakan berlapis', 'A display name with layered checks'], `
local user = {}
local name = user and user.name and user.name:upper() or "GUEST"
print("Hello, " .. name)
`, 'Hello, GUEST', {
        debug: BUG(`
local user = {}
local name = user and user.name:upper() or "GUEST"
print("Hello, " .. name)
`, "example:2: attempt to index a nil value (field 'name')",
          '`user` wujud (table kosong), jadi `and` menilai `user.name:upper()`. Tetapi `user.name` ialah `nil`, dan memanggil method padanya gagal **sebelum** `or` sempat memberi nilai lalai. Litar pintas hanya melindungi apabila operan **kiri** palsu. Tambah semakan untuk setiap tahap: `user and user.name and user.name:upper() or "GUEST"`.',
          '`user` exists (an empty table), so `and` evaluates `user.name:upper()`. But `user.name` is `nil`, and calling a method on it fails **before** `or` can supply the default. Short-circuiting only protects when the **left** operand is falsy. Add a check for each level: `user and user.name and user.name:upper() or "GUEST"`.'),
      }),
      EXPLAIN('greeting-name',
        ['1', 'Pengguna tanpa nama.', 'A user with no name.'],
        ['2', 'Setiap `and` memastikan tahap sebelumnya wujud sebelum tahap seterusnya digunakan; jika mana-mana tiada, `or` memberi "GUEST".', 'Each `and` makes sure the previous level exists before the next is used; if any is missing, `or` supplies "GUEST".'],
        ['3', 'Gabungkan salam.', 'Build the greeting.'])),
    S('performance',
      P('Idiom dan `if/else` dikompil kepada ujian dan lompatan yang hampir sama; tiada perbezaan prestasi yang bermakna. Pilih berdasarkan **ketepatan** dan **kebolehbacaan** sahaja.', 'The idiom and `if/else` compile to nearly the same tests and jumps; there is no meaningful performance difference. Choose on **correctness** and **readability** alone.')),
    S('software_engineering',
      P('Bandingkan idiom bersarang yang padat dengan rantai `elseif` yang jelas:', 'Compare a dense nested idiom with a clear `elseif` chain:'),
      CODE('poor-nested-idiom', 'lua', 'lua54', ['Pelaksanaan lemah: idiom bersarang', 'Poor implementation: a nested idiom'], `
local function sizeLabel(n)
  return n < 10 and "small" or n < 100 and "medium" or "large"
end

print(sizeLabel(5), sizeLabel(50), sizeLabel(500))
`, 'small\tmedium\tlarge'),
      EXPLAIN('poor-nested-idiom',
        ['1–3', 'Berfungsi kerana setiap label ialah string, tetapi pembaca mesti menghuraikan keutamaan `and`/`or` secara mental untuk memahaminya.', 'It works because every label is a string, but readers must mentally parse `and`/`or` precedence to understand it.'],
        ['5', 'Keputusan betul.', 'Correct results.']),
      CODE('improved-elseif-label', 'lua', 'lua54', ['Pelaksanaan lebih baik: elseif yang jelas', 'Improved implementation: a clear elseif'], `
local function sizeLabel(n)
  if n < 10 then
    return "small"
  elseif n < 100 then
    return "medium"
  end
  return "large"
end

print(sizeLabel(5), sizeLabel(50), sizeLabel(500))
`, 'small\tmedium\tlarge'),
      EXPLAIN('improved-elseif-label',
        ['1–8', 'Setiap kes pada barisnya sendiri; menambah kategori keempat adalah jelas dan selamat.', 'Each case on its own line; adding a fourth category is obvious and safe.'],
        ['10', 'Keputusan sama.', 'The same results.']),
      P('Peraturan praktikal: satu idiom `and/or` dalam satu ungkapan — ya. Dua atau lebih — tulis `if/elseif`.', 'A practical rule: one `and/or` idiom in an expression — fine. Two or more — write `if/elseif`.')),
    S('industry_use_cases',
      UL(
        ['Teks antara muka: `count == 1 and "file" or "files"`.', 'Interface text: `count == 1 and "file" or "files"`.'],
        ['Konfigurasi dengan nilai lalai: `config.port or 8080` (selamat untuk nombor).', 'Configuration defaults: `config.port or 8080` (safe for numbers).'],
        ['Semakan kod dalam pasukan Lua sering menandakan idiom yang nilai tengahnya boleh `false`.', 'Code reviews in Lua teams often flag idioms whose middle value can be `false`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `false-trap` dan jejaki setiap langkah idiom dengan tangan.', 'Run `false-trap` and trace each step of the idiom by hand.'],
        ['Jalankan versi berpepijat `table-select` dan betulkannya dengan kurungan.', 'Run the buggy `table-select` and fix it with parentheses.'],
        ['Cari satu idiom `and/or` dalam LUA101/LUA102 dan nilaikan sama ada ia selamat.', 'Find one `and/or` idiom in LUA101/LUA102 and judge whether it is safe.'],
      )),
    S('mini_project',
      P('**Mesej status pesanan.** Untuk setiap pesanan, bina mesej yang menggunakan idiom di tempat yang selamat dan `if/else` untuk medan boolean `giftWrap` yang mungkin `false`.', '**Order status messages.** For each order, build a message that uses the idiom where safe and `if/else` for the boolean `giftWrap` field, which may be `false`.'),
      CODE('order-messages', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local orders = {
  {id = 1, items = 1, paid = true, giftWrap = false},
  {id = 2, items = 3, paid = false},
}

for _, o in ipairs(orders) do
  local itemWord = o.items == 1 and "item" or "items"
  local payment = o.paid and "paid" or "awaiting payment"
  local wrap
  if o.giftWrap == nil then wrap = "no preference" else wrap = tostring(o.giftWrap) end
  print(string.format("#%d: %d %s, %s, gift wrap: %s", o.id, o.items, itemWord, payment, wrap))
end
`, '#1: 1 item, paid, gift wrap: false\n#2: 3 items, awaiting payment, gift wrap: no preference'),
      EXPLAIN('order-messages',
        ['1–4', 'Dua pesanan; yang kedua tiada medan `giftWrap`.', 'Two orders; the second has no `giftWrap` field.'],
        ['6–8', 'Idiom selamat: kedua-dua nilai tengah ialah string literal.', 'Safe idioms: both middle values are string literals.'],
        ['9–10', '`giftWrap` boleh `false`, jadi `if/else` digunakan untuk membezakan `false` daripada `nil`.', '`giftWrap` can be `false`, so `if/else` is used to tell `false` from `nil`.'],
        ['11', 'Satu baris laporan bagi setiap pesanan.', 'One report line per order.'])),
    S('summary',
      UL(
        ['`c and a or b` dihuraikan sebagai `(c and a) or b`.', '`c and a or b` parses as `(c and a) or b`.'],
        ['Idiom gagal apabila `a` ialah `false` atau `nil` — ia memulangkan `b`.', 'The idiom fails when `a` is `false` or `nil` — it returns `b`.'],
        ['Balut idiom dengan kurungan dalam ungkapan yang lebih besar.', 'Wrap the idiom in parentheses inside larger expressions.'],
        ['Apabila ragu, gunakan `if/else`.', 'When in doubt, use `if/else`.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah hasil `true and nil or "x"`?', 'What is the result of `true and nil or "x"`?'],
        ['Adakah `n > 0 and n or 0` selamat? Mengapa?', 'Is `n > 0 and n or 0` safe? Why?'],
        ['Tulis semula `flag and false or true` supaya ia betul.', 'Rewrite `flag and false or true` so that it is correct.'],
        ['Mengapakah `"x" .. c and a or b` memerlukan kurungan?', 'Why does `"x" .. c and a or b` need parentheses?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.4.5 — Logical Operators', url: `${MANUAL}#3.4.5` },
        { title: 'Programming in Lua (1st ed.) — 3.3 Logical Operators', url: `${PIL}/3.3.html` },
        { title: 'Lua 5.4 Reference Manual §3.4.8 — Precedence', url: `${MANUAL}#3.4.8` },
        { title: 'Luau — syntax: if-then-else expressions (for comparison)', url: 'https://luau.org/syntax#if-then-else-expressions' },
      )),
  ],
};

export const LUA103_M1 = [LUA103_1_1, LUA103_1_2, LUA103_1_3];
