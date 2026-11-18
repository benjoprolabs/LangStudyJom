import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU103 · Module 1 — Conditions (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 1.1 if, elseif and else ───────────────────────────────────────────────

export const LUAU103_1_1: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 1,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis pernyataan `if … then … elseif … else … end` dalam Luau.', 'Write `if … then … elseif … else … end` statements in Luau.'],
        ['Menyusun syarat `elseif` dari yang paling spesifik kepada yang paling umum.', 'Order `elseif` conditions from the most specific to the most general.'],
        ['Membezakan `elseif` (satu blok) daripada `else if` (blok bersarang).', 'Distinguish `elseif` (one block) from `else if` (a nested block).'],
        ['Memilih antara pernyataan `if`, if-expression dan table carian.', 'Choose between an `if` statement, an if-expression and a lookup table.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['LUAU102: operator perbandingan dan logik, if-expression.', 'LUAU102: comparison and logical operators, if-expressions.'],
      )),
    S('introduction',
      P('Permainan sentiasa membuat keputusan: jika pemain menyentuh lava, kurangkan kesihatan; jika skor melepasi rekod, simpan; jika tiada pemain, mulakan rehat antara pusingan. Pernyataan `if` ialah alat asas untuk keputusan ini. Dalam LUAU102 anda melihat if-expression yang memilih **nilai**; kuliah ini memberi tumpuan kepada pernyataan `if` yang menjalankan **tindakan** — beberapa baris kod — bergantung pada syarat, dan kepada cara menyusun banyak cabang dengan betul.',
        'Games make decisions constantly: if the player touches lava, reduce health; if the score passes the record, save it; if there are no players, start an intermission. The `if` statement is the basic tool for these decisions. In LUAU102 you saw the if-expression that chooses a **value**; this lecture focuses on the `if` statement that runs **actions** — several lines of code — depending on a condition, and on how to arrange many branches correctly.'),
      KEY('Luau menyemak cabang dari atas ke bawah dan menjalankan **yang pertama** yang benar sahaja.', 'Luau checks branches from top to bottom and runs **only the first** true one.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`if syarat then … end` — blok dijalankan jika syarat benar.', '`if condition then … end` — the block runs if the condition is truthy.'],
        ['`elseif` — cabang tambahan dalam **pernyataan yang sama**; hanya satu `end` di hujung.', '`elseif` — an extra branch in the **same statement**; only one `end` at the very end.'],
        ['`else` — dijalankan jika tiada syarat sebelumnya benar.', '`else` — runs if no earlier condition was true.'],
        ['`else if` (dua perkataan) mencipta `if` **baharu** di dalam `else`, yang memerlukan `end` sendiri.', '`else if` (two words) creates a **new** `if` inside the `else`, which needs its own `end`.'],
        ['Luau tiada `switch`; gunakan `elseif` atau table carian.', 'Luau has no `switch`; use `elseif` or a lookup table.'],
      )),
    S('detailed_theory',
      P('Pernyataan `if` dengan `elseif` dinilai seperti tangga: syarat pertama disemak; jika benar, bloknya dijalankan dan **seluruh** pernyataan tamat — cabang lain tidak disemak langsung. Jika palsu, syarat seterusnya disemak, dan seterusnya. Oleh itu susunan penting: untuk julat bertindih, letakkan syarat yang paling ketat dahulu. Jika `score >= 50` disemak sebelum `score >= 80`, skor 85 sentiasa padan dengan cabang pertama dan cabang "merit" tidak pernah dicapai — pepijat logik yang tidak menimbulkan ralat.',
        'An `if` statement with `elseif`s is evaluated like a ladder: the first condition is checked; if it is true, its block runs and the **whole** statement ends — the other branches are not checked at all. If it is false, the next condition is checked, and so on. So order matters: for overlapping ranges, put the strictest condition first. If `score >= 50` is checked before `score >= 80`, a score of 85 always matches the first branch and the "merit" branch is never reached — a logic bug that raises no error.'),
      P('Dua kesilapan sintaks biasa datang daripada bahasa lain. `else if` (dua perkataan) bukan `elseif`: ia membuka `if` baharu di dalam cabang `else`, jadi setiap `else if` memerlukan `end` tambahan, dan terlupa ia menghasilkan ralat `Expected \'end\' (to close \'else\' at line …)`. Dan `=` bukan perbandingan — `if x = 5` ialah ralat sintaks; gunakan `==`. Untuk memilih **nilai**, if-expression (LUAU102 4.2) lebih ringkas; untuk memetakan banyak nilai tetap kepada tindakan atau data, table carian lebih mudah dikembangkan daripada rantaian `elseif` yang panjang.',
        'Two common syntax mistakes come from other languages. `else if` (two words) is not `elseif`: it opens a new `if` inside the `else` branch, so every `else if` needs an extra `end`, and forgetting it gives `Expected \'end\' (to close \'else\' at line …)`. And `=` is not a comparison — `if x = 5` is a syntax error; use `==`. To choose a **value**, an if-expression (LUAU102 4.2) is shorter; to map many fixed values to actions or data, a lookup table is easier to extend than a long `elseif` chain.')),
    S('technical_terminology', TERMS('conditional', 'control-flow', 'if-expression', 'truthiness')),
    S('syntax_rules',
      UL(
        ['`if a then … elseif b then … else … end` — satu `end` untuk seluruh tangga.', '`if a then … elseif b then … else … end` — one `end` for the whole ladder.'],
        ['Perbandingan sama ialah `==`; tidak sama ialah `~=`.', 'Equality is `==`; inequality is `~=`.'],
        ['Tiada `elif`, `elsif` atau `switch` dalam Luau.', 'There is no `elif`, `elsif` or `switch` in Luau.'],
      )),
    S('code_demonstration',
      CODE('medal-ladder', 'luau', 'luau', ['Tangga elseif', 'An elseif ladder'], `
local function awardMedal(seconds: number)
  if seconds <= 0 then
    print("invalid time")
  elseif seconds < 60 then
    print("gold medal")
  elseif seconds < 90 then
    print("silver medal")
  elseif seconds < 120 then
    print("bronze medal")
  else
    print("finished")
  end
end

awardMedal(45)
awardMedal(75)
awardMedal(200)
awardMedal(-1)
`, 'gold medal\nsilver medal\nfinished\ninvalid time'),
      EXPLAIN('medal-ladder',
        ['1–3', 'Kes tidak sah disemak dahulu.', 'The invalid case is checked first.'],
        ['4–9', 'Julat masa, dari yang paling ketat (< 60) kepada yang paling longgar (< 120).', 'Time ranges, from the strictest (< 60) to the loosest (< 120).'],
        ['10–12', '`else` menangkap semua yang lain; satu `end` menutup seluruh tangga.', '`else` catches everything else; one `end` closes the whole ladder.'],
        ['15–18', 'Empat masa, empat cabang berbeza.', 'Four times, four different branches.'])),
    S('complete_examples',
      CODE('branch-order', 'luau', 'luau', ['Susunan cabang penting', 'Branch order matters'], `
local function rank(score: number): string
  if score >= 90 then
    return "distinction"
  elseif score >= 75 then
    return "merit"
  elseif score >= 50 then
    return "pass"
  end
  return "fail"
end

for _, s in {95, 85, 60, 20} do
  print(s, rank(s))
end
`, '95\tdistinction\n85\tmerit\n60\tpass\n20\tfail', {
        debug: BUG(`
local x = 5
if x > 10 then
  print("big")
else if x > 3 then
  print("medium")
end
`, "example:6: Expected 'end' (to close 'else' at line 4), got <eof>",
          '`else if` (dua perkataan) membuka `if` **baharu** di dalam cabang `else`. `end` pada baris 6 menutup `if` dalam itu, dan blok `else` yang dibuka pada baris 4 tidak pernah ditutup. Gunakan `elseif` (satu perkataan) — atau tambah `end` kedua jika anda benar-benar mahukan `if` bersarang.',
          '`else if` (two words) opens a **new** `if` inside the `else` branch. The `end` on line 6 closes that inner `if`, and the `else` block opened on line 4 is never closed. Use `elseif` (one word) — or add a second `end` if you really want a nested `if`.'),
      }),
      EXPLAIN('branch-order',
        ['1–9', 'Syarat disusun dari ambang tertinggi ke terendah; setiap cabang memulangkan terus.', 'Conditions are ordered from the highest threshold to the lowest; every branch returns directly.'],
        ['12–14', 'Empat skor menguji setiap cabang.', 'Four scores test every branch.']),
      CODE('lookup-actions', 'luau', 'luau', ['Table carian menggantikan switch', 'A lookup table instead of switch'], `
local KEY_ACTIONS = {
  W = "move forward",
  S = "move back",
  Space = "jump",
  E = "interact",
}

local function handleKey(key: string)
  local action = KEY_ACTIONS[key]
  if action then
    print(\`{key}: {action}\`)
  else
    print(\`{key}: unbound\`)
  end
end

for _, k in {"W", "Space", "Q"} do handleKey(k) end
`, 'W: move forward\nSpace: jump\nQ: unbound', {
        debug: BUG(`
local key = "E"
if key = "E" then
  print("interact")
end
`, "example:2: Expected 'then' when parsing if statement, got '='",
          '`=` ialah assignment, bukan perbandingan, dan assignment tidak boleh muncul dalam syarat. Penghurai menjangka `then` selepas `key` dan menemui `=`. Gunakan `==` untuk menyemak kesamaan.',
          '`=` is assignment, not comparison, and an assignment cannot appear in a condition. The parser expects `then` after `key` and finds `=`. Use `==` to test equality.'),
      }),
      EXPLAIN('lookup-actions',
        ['1–6', 'Pemetaan kekunci kepada tindakan sebagai data — menambah kekunci baharu ialah satu baris.', 'A key-to-action mapping as data — adding a new key is one line.'],
        ['8–15', 'Satu carian table menggantikan rantaian `elseif`; `if action` mengendalikan kekunci yang tidak dipetakan.', 'One table lookup replaces an `elseif` chain; `if action` handles unmapped keys.'],
        ['17', 'Tiga kekunci diuji, termasuk satu yang tidak terikat.', 'Three keys tested, including an unbound one.'])),
    S('line_by_line',
      EXPLAIN('branch-order',
        ['4', 'Skor 85 sampai ke sini hanya kerana `score >= 90` palsu. Jika susunan diterbalikkan, 85 akan padan dengan `>= 50` dahulu dan dilabel "pass".', 'A score of 85 reaches this line only because `score >= 90` was false. If the order were reversed, 85 would match `>= 50` first and be labelled "pass".']),
      EXPLAIN('medal-ladder',
        ['11', 'Dalam permainan sebenar, cabang `else` sering ialah tempat untuk mengendalikan kes yang tidak dijangka — jangan biarkannya kosong tanpa berfikir.', 'In a real game, the `else` branch is often the place to handle unexpected cases — do not leave it out without thinking.'])),
    S('why_this_way',
      P('Mengapa `elseif` dan bukan `if` bersarang? Kerana tangga rata lebih mudah dibaca, memerlukan satu `end`, dan menjamin hanya satu cabang berjalan. Mengapa table carian? Kerana apabila pilihan ialah **data** (kekunci, item, warna), menyimpannya sebagai data memisahkan "apa" daripada "bagaimana", dan pereka boleh menambah entri tanpa menyentuh logik.',
        'Why `elseif` and not nested `if`s? Because a flat ladder is easier to read, needs one `end`, and guarantees only one branch runs. Why a lookup table? Because when the choices are **data** (keys, items, colours), storing them as data separates "what" from "how", and designers can add entries without touching the logic.'),
      P('Gunakan tangga `elseif` **apabila** syarat ialah julat atau gabungan; gunakan table carian **apabila** memadankan nilai tetap; gunakan if-expression **apabila** hanya memilih satu nilai.', 'Use an `elseif` ladder **when** conditions are ranges or combinations; use a lookup table **when** matching fixed values; use an if-expression **when** only choosing one value.')),
    S('execution_flow',
      OL(
        ['`awardMedal(75)`: `75 <= 0` palsu → seterusnya.', '`awardMedal(75)`: `75 <= 0` is false → next.'],
        ['`75 < 60` palsu → seterusnya.', '`75 < 60` is false → next.'],
        ['`75 < 90` benar → cetak "silver medal"; cabang `< 120` dan `else` dilangkau; lompat ke selepas `end`.', '`75 < 90` is true → print "silver medal"; the `< 120` and `else` branches are skipped; jump past `end`.'],
      )),
    S('memory_behaviour',
      P('Pernyataan `if` tidak memperuntukkan memori; ia dikompil kepada perbandingan dan lompatan. Local yang diisytiharkan di dalam cabang hidup hanya sehingga `end` cabang itu (atau `elseif`/`else` seterusnya). Table carian diperuntukkan sekali dan dikongsi oleh setiap panggilan.',
        'An `if` statement allocates no memory; it compiles to comparisons and jumps. Locals declared inside a branch live only until that branch’s end (or the next `elseif`/`else`). A lookup table is allocated once and shared by every call.')),
    S('alternative_implementations',
      P('Apabila setiap cabang hanya memilih nilai, if-expression memadatkan tangga:', 'When every branch only chooses a value, an if-expression compresses the ladder:'),
      CODE('medal-expression', 'luau', 'luau', ['Tangga sebagai if-expression', 'The ladder as an if-expression'], `
local function medalFor(seconds: number): string
  return if seconds <= 0 then "invalid"
    elseif seconds < 60 then "gold"
    elseif seconds < 90 then "silver"
    elseif seconds < 120 then "bronze"
    else "none"
end

print(medalFor(30), medalFor(100), medalFor(500))
`, 'gold\tbronze\tnone'),
      EXPLAIN('medal-expression',
        ['1–7', 'Logik yang sama, tetapi memulangkan nilai dan bukannya mencetak — pemanggil memutuskan apa yang dilakukan dengannya.', 'The same logic, but returning a value instead of printing — the caller decides what to do with it.'],
        ['9', 'Tiga ujian.', 'Three tests.'])),
    S('common_mistakes',
      UL(
        ['Menulis `else if` dan bukannya `elseif`.', 'Writing `else if` instead of `elseif`.'],
        ['Menggunakan `=` dalam syarat.', 'Using `=` in a condition.'],
        ['Menyusun julat dari yang longgar ke yang ketat, sehingga cabang ketat tidak pernah dicapai.', 'Ordering ranges from loose to strict, so the strict branches are never reached.'],
        ['Rantaian `elseif` panjang untuk memadankan nilai tetap, dan bukannya table.', 'Long `elseif` chains to match fixed values instead of a table.'],
      )),
    S('debugging',
      P('Jika cabang yang dijangka tidak pernah berjalan, cetak nilai yang diuji **dan** keputusan setiap syarat dalam susunan: `print(score >= 90, score >= 75)`. Cabang awal yang terlalu luas akan kelihatan serta-merta. Untuk ralat sintaks `Expected \'end\'`, semak setiap `else if` — dalam Luau, ia hampir selalu sepatutnya `elseif`. Contoh berikut mengesan cabang yang tidak boleh dicapai secara automatik dengan menguji setiap ambang:',
        'If an expected branch never runs, print the tested value **and** the result of each condition in order: `print(score >= 90, score >= 75)`. An early branch that is too broad becomes obvious immediately. For an `Expected \'end\'` syntax error, check every `else if` — in Luau it should almost always be `elseif`. The following example detects unreachable branches automatically by testing each threshold:'),
      CODE('reach-test', 'luau', 'luau', ['Menguji setiap cabang dapat dicapai', 'Testing that every branch is reachable'], `
local function bandFor(level: number): string
  if level >= 50 then return "elite"
  elseif level >= 20 then return "veteran"
  elseif level >= 5 then return "regular" end
  return "newcomer"
end

local seen = {}
for _, lv in {60, 30, 10, 1} do
  seen[bandFor(lv)] = true
end
for _, band in {"elite", "veteran", "regular", "newcomer"} do
  print(band, seen[band] == true)
end
`, 'elite\ttrue\nveteran\ttrue\nregular\ttrue\nnewcomer\ttrue'),
      EXPLAIN('reach-test',
        ['1–6', 'Fungsi dengan empat cabang.', 'A function with four branches.'],
        ['8–11', 'Rekod setiap cabang yang dicapai oleh satu input bagi setiap jalur.', 'Record every branch reached by one input per band.'],
        ['12–14', 'Setiap cabang dicapai sekurang-kurangnya sekali — tiada cabang mati.', 'Every branch is reached at least once — no dead branches.'])),
    S('performance',
      P('Tangga `elseif` menyemak syarat satu demi satu, jadi kos purata bergantung pada kedudukan cabang yang biasa. Jika satu kes jauh lebih kerap, letakkannya dahulu (jika logik membenarkan). Untuk puluhan nilai tetap, table carian adalah O(1) — lebih pantas dan lebih kemas.',
        'An `elseif` ladder checks conditions one by one, so the average cost depends on where the common branch sits. If one case is far more frequent, put it first (if the logic allows). For dozens of fixed values, a lookup table is O(1) — faster and tidier.')),
    S('software_engineering',
      P('`if` bersarang yang dalam berbanding tangga rata:', 'Deeply nested `if`s versus a flat ladder:'),
      CODE('poor-nested-ifs', 'luau', 'luau', ['Pelaksanaan lemah: if bersarang', 'Poor implementation: nested ifs'], `
local function shippingCost(weight: number): number
  if weight > 0 then
    if weight <= 1 then
      return 5
    else
      if weight <= 5 then
        return 12
      else
        return 25
      end
    end
  else
    return 0
  end
end
print(shippingCost(0.5), shippingCost(3), shippingCost(9), shippingCost(0))
`, '5\t12\t25\t0'),
      EXPLAIN('poor-nested-ifs',
        ['1–15', 'Empat tahap inden dan lima `end`; kes "tiada berat" tersembunyi di bahagian bawah.', 'Four levels of indentation and five `end`s; the "no weight" case is hidden at the bottom.'],
        ['16', 'Hasil betul, tetapi sukar dibaca dan diubah.', 'Correct results, but hard to read and change.']),
      CODE('improved-flat-ladder', 'luau', 'luau', ['Pelaksanaan lebih baik: tangga rata', 'Improved implementation: a flat ladder'], `
local function shippingCost(weight: number): number
  if weight <= 0 then
    return 0
  elseif weight <= 1 then
    return 5
  elseif weight <= 5 then
    return 12
  end
  return 25
end
print(shippingCost(0.5), shippingCost(3), shippingCost(9), shippingCost(0))
`, '5\t12\t25\t0'),
      EXPLAIN('improved-flat-ladder',
        ['1–10', 'Satu tahap inden; kes tepi dahulu; setiap jalur berat satu baris.', 'One indentation level; the edge case first; each weight band one line.'],
        ['11', 'Hasil yang sama.', 'The same results.'])),
    S('industry_use_cases',
      UL(
        ['Sistem kerosakan memilih kesan berdasarkan jenis serangan dengan tangga `elseif`.', 'Damage systems choose effects based on attack type with `elseif` ladders.'],
        ['Pengikatan input (keybinds) disimpan dalam table carian supaya pemain boleh menukarnya.', 'Input bindings (keybinds) are stored in lookup tables so players can change them.'],
        ['Logik kedudukan dan ganjaran menggunakan ambang yang disusun dengan teliti.', 'Ranking and reward logic uses carefully ordered thresholds.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah pingat "platinum" untuk masa di bawah 30 saat dalam `medal-ladder`. Di manakah ia mesti diletakkan?', 'Add a "platinum" medal for times under 30 seconds in `medal-ladder`. Where must it go?'],
        ['Tambah kekunci "R" = "reload" pada `lookup-actions`.', 'Add the key "R" = "reload" to `lookup-actions`.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Cuaca dunia.** Berdasarkan suhu dan kelembapan, pilih kesan cuaca (salji, hujan, kabus, cerah) dan kelajuan pergerakan pemain, menggunakan tangga `elseif` yang disusun dengan betul.', '**World weather.** Based on temperature and humidity, choose a weather effect (snow, rain, fog, clear) and the player’s movement speed, using a correctly ordered `elseif` ladder.'),
      CODE('weather-system', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local BASE_SPEED = 16

local function weather(tempC: number, humidity: number): (string, number)
  if tempC <= 0 and humidity > 0.6 then
    return "snow", BASE_SPEED * 0.6
  elseif humidity > 0.8 then
    return "rain", BASE_SPEED * 0.85
  elseif humidity > 0.6 and tempC < 12 then
    return "fog", BASE_SPEED
  end
  return "clear", BASE_SPEED
end

for _, c in {{-5, 0.7}, {20, 0.9}, {8, 0.65}, {25, 0.3}} do
  print(weather(c[1], c[2]))
end
`, 'snow\t9.6\nrain\t13.6\nfog\t16\nclear\t16'),
      EXPLAIN('weather-system',
        ['1', 'Kelajuan asas.', 'The base speed.'],
        ['3–12', 'Syarat paling spesifik (salji: sejuk **dan** lembap) dahulu, kemudian hujan, kemudian kabus; dua nilai dipulangkan.', 'The most specific condition (snow: cold **and** humid) first, then rain, then fog; two values are returned.'],
        ['14–16', 'Empat keadaan ujian, satu bagi setiap cuaca.', 'Four test conditions, one per weather type.'])),
    S('summary',
      UL(
        ['`if … elseif … else … end` — cabang pertama yang benar sahaja dijalankan.', '`if … elseif … else … end` — only the first true branch runs.'],
        ['Susun julat dari yang paling ketat.', 'Order ranges from the strictest.'],
        ['`elseif` satu perkataan; `==` untuk perbandingan.', '`elseif` is one word; `==` for comparison.'],
        ['Table carian untuk nilai tetap; if-expression untuk memilih nilai.', 'Lookup tables for fixed values; if-expressions for choosing values.'],
      )),
    S('knowledge_check',
      OL(
        ['Berapa cabang boleh berjalan dalam satu pernyataan `if … elseif … else`?', 'How many branches can run in one `if … elseif … else` statement?'],
        ['Mengapakah `else if` memerlukan `end` tambahan?', 'Why does `else if` need an extra `end`?'],
        ['Bilakah table carian lebih baik daripada `elseif`?', 'When is a lookup table better than `elseif`?'],
        ['Apakah yang salah dengan menyemak `>= 50` sebelum `>= 90`?', 'What is wrong with checking `>= 50` before `>= 90`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Control structures', url: `${DOCS}/luau/control-structures` },
        { title: 'Luau — Syntax', url: `${LUAU}/syntax` },
        { title: 'Lua 5.1 Reference Manual §2.4.4 — Control Structures (inherited by Luau)', url: 'https://www.lua.org/manual/5.1/manual.html#2.4.4' },
        { title: 'Roblox Lua Style Guide', url: 'https://roblox.github.io/lua-style-guide/' },
      )),
  ],
};

// ─── 1.2 Truthiness: only nil and false are falsy ──────────────────────────

export const LUAU103_1_2: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 1,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerapkan [[truthiness]] dalam syarat: hanya `nil` dan `false` palsu.', 'Apply [[truthiness]] in conditions: only `nil` and `false` are falsy.'],
        ['Memilih antara `if x then`, `if x ~= nil then` dan `if x == true then`.', 'Choose between `if x then`, `if x ~= nil then` and `if x == true then`.'],
        ['Menyemak senarai kosong dan medan pilihan dengan betul.', 'Check for empty lists and optional fields correctly.'],
        ['Menukar sebarang nilai kepada boolean sebenar dengan `not not x` atau `x ~= nil`.', 'Convert any value to a real boolean with `not not x` or `x ~= nil`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1: pernyataan `if`.', 'Lecture 1.1: the `if` statement.'],
        ['LUAU102 2.1: jenis asas.', 'LUAU102 2.1: the basic types.'],
      )),
    S('introduction',
      P('Syarat `if` dalam Luau tidak memerlukan boolean: sebarang nilai boleh diuji. Peraturannya sangat ringkas — hanya `nil` dan `false` dikira palsu; segala-galanya lain benar, termasuk `0`, `""` dan table kosong. Peraturan ringkas ini membolehkan semakan seperti `if player then` (adakah pemain wujud?), tetapi juga menimbulkan pepijat apabila pembangun membawa tabiat daripada JavaScript atau Python, di mana `0` dan `""` palsu. Kuliah ini menunjukkan bila setiap gaya semakan sesuai.',
        'An `if` condition in Luau does not need a boolean: any value can be tested. The rule is very short — only `nil` and `false` count as false; everything else is true, including `0`, `""` and empty tables. This short rule enables checks such as `if player then` (does the player exist?), but it also causes bugs when developers bring habits from JavaScript or Python, where `0` and `""` are false. This lecture shows when each style of check is appropriate.'),
      KEY('`if x then` = "x wujud dan bukan false". Untuk "kosong", semak secara eksplisit: `#t == 0`, `s == ""`, `n == 0`.', '`if x then` = "x exists and is not false". For "empty", check explicitly: `#t == 0`, `s == ""`, `n == 0`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Palsu: `nil`, `false`. Benar: semua yang lain — `0`, `-1`, `""`, `"false"`, `{}`, fungsi.', 'Falsy: `nil`, `false`. Truthy: everything else — `0`, `-1`, `""`, `"false"`, `{}`, functions.'],
        ['`if x then` — sesuai untuk "adakah ia wujud?" apabila `false` bukan nilai yang mungkin.', '`if x then` — suits "does it exist?" when `false` is not a possible value.'],
        ['`if x ~= nil then` — "adakah ia wujud?" walaupun `false` ialah nilai sah.', '`if x ~= nil then` — "does it exist?" even when `false` is a valid value.'],
        ['`if x == true then` — hanya `true` sebenar, bukan sekadar benar.', '`if x == true then` — only a real `true`, not merely truthy.'],
        ['Kosong mesti disemak secara eksplisit: `#list == 0`, `next(dict) == nil`, `text == ""`.', 'Emptiness must be checked explicitly: `#list == 0`, `next(dict) == nil`, `text == ""`.'],
      )),
    S('detailed_theory',
      P('Luau menilai syarat dengan satu soalan: "adakah nilai ini `nil` atau `false`?" Ia tidak menukar nilai kepada nombor atau membandingkan dengan sifar. Ini menjadikan semakan kewujudan sangat semula jadi — dalam Roblox, `local humanoid = character:FindFirstChild("Humanoid"); if humanoid then …` ialah corak yang biasa kerana `FindFirstChild` memulangkan `nil` apabila tiada. Tetapi ia juga bermakna `if coins then` benar untuk 0 syiling, dan `if name then` benar untuk nama kosong. Untuk soalan "adakah ia kosong?" atau "adakah ia sifar?", anda mesti menulis perbandingan itu.',
        'Luau evaluates a condition with one question: "is this value `nil` or `false`?" It does not convert values to numbers or compare them with zero. This makes existence checks very natural — in Roblox, `local humanoid = character:FindFirstChild("Humanoid"); if humanoid then …` is a common pattern because `FindFirstChild` returns `nil` when nothing is found. But it also means `if coins then` is true for 0 coins, and `if name then` is true for an empty name. For "is it empty?" or "is it zero?", you must write that comparison.'),
      P('Kes yang paling halus ialah nilai boolean pilihan. Bayangkan tetapan `musicEnabled` yang boleh `true`, `false` atau belum ditetapkan (`nil`). `if settings.musicEnabled then` tidak membezakan "dimatikan" daripada "belum ditetapkan" — kedua-duanya palsu. Untuk tiga keadaan, gunakan `== nil`, `== true` dan `== false` secara eksplisit. Dan sebelum menggunakan operator yang memerlukan jenis tertentu — `#` pada senarai, aritmetik pada nombor — semak bahawa nilai itu wujud: `#nil` ialah ralat `attempt to get length of a nil value`, jadi `if list and #list > 0 then` menggabungkan semakan kewujudan dan kekosongan dengan selamat melalui litar pintas.',
        'The subtlest case is optional booleans. Imagine a setting `musicEnabled` that can be `true`, `false` or not yet set (`nil`). `if settings.musicEnabled then` does not distinguish "turned off" from "not set" — both are falsy. For three states, use `== nil`, `== true` and `== false` explicitly. And before using an operator that needs a particular type — `#` on a list, arithmetic on a number — check the value exists: `#nil` is the error `attempt to get length of a nil value`, so `if list and #list > 0 then` safely combines the existence and emptiness checks through short-circuiting.')),
    S('technical_terminology', TERMS('truthiness', 'nil', 'short-circuit', 'guard-clause')),
    S('syntax_rules',
      UL(
        ['Kewujudan: `if x then` atau `if x ~= nil then`.', 'Existence: `if x then` or `if x ~= nil then`.'],
        ['Kosong: `if #list == 0`, `if text == ""`, `if next(dict) == nil`.', 'Empty: `if #list == 0`, `if text == ""`, `if next(dict) == nil`.'],
        ['Boolean sebenar: `local hasItems = list ~= nil and #list > 0`.', 'A real boolean: `local hasItems = list ~= nil and #list > 0`.'],
      )),
    S('code_demonstration',
      CODE('truthy-table', 'luau', 'luau', ['Nilai benar dan palsu', 'Truthy and falsy values'], `
local samples = {
  {"nil", nil}, {"false", false}, {"0", 0}, {'""', ""},
  {'"false"', "false"}, {"{}", {}}, {"-1", -1},
}

for _, pair in samples do
  local label, value = pair[1], pair[2]
  print(label, if value then "truthy" else "falsy")
end
`, 'nil\tfalsy\nfalse\tfalsy\n0\ttruthy\n""\ttruthy\n"false"\ttruthy\n{}\ttruthy\n-1\ttruthy'),
      EXPLAIN('truthy-table',
        ['1–4', 'Setiap pasangan menyimpan label dan nilai; `{"nil", nil}` masih berfungsi kerana label pada indeks 1.', 'Each pair stores a label and a value; `{"nil", nil}` still works because the label is at index 1.'],
        ['6–9', 'Uji truthiness setiap nilai. Hanya `nil` dan `false` palsu — termasuk string "false", yang **benar**.', 'Test each value’s truthiness. Only `nil` and `false` are falsy — including the string "false", which is **truthy**.'])),
    S('complete_examples',
      CODE('three-state-setting', 'luau', 'luau', ['Tetapan dengan tiga keadaan', 'A setting with three states'], `
local function describeMusic(setting: boolean?): string
  if setting == nil then
    return "default (on)"
  elseif setting == true then
    return "on"
  else
    return "off"
  end
end

print(describeMusic(nil), describeMusic(true), describeMusic(false))
`, 'default (on)\ton\toff', {
        debug: BUG(`
local function rewardFor(coins: number)
  if coins then
    return \`you have {coins} coins\`
  end
  return "no coins yet"
end
local message = rewardFor(0)
assert(message == "no coins yet", \`expected "no coins yet", got "{message}"\`)
`, 'example:8: expected "no coins yet", got "you have 0 coins"',
          '`if coins then` benar untuk 0 — dalam Luau, 0 bukan palsu. Pengaturcara menjangka 0 dianggap "tiada", seperti dalam JavaScript. `assert` menukar keputusan yang salah kepada ralat supaya ia disahkan. Semak secara eksplisit: `if coins > 0 then`.',
          '`if coins then` is true for 0 — in Luau, 0 is not falsy. The programmer expected 0 to count as "none", as in JavaScript. The `assert` turns the wrong result into an error so it is verified. Check explicitly: `if coins > 0 then`.'),
      }),
      EXPLAIN('three-state-setting',
        ['1', '`boolean?` — boolean atau `nil` (anotasi untuk penganalisis).', '`boolean?` — a boolean or `nil` (an annotation for the analyser).'],
        ['2–8', 'Tiga perbandingan eksplisit membezakan tiga keadaan. `if setting then` sahaja akan mencampurkan `nil` dan `false`.', 'Three explicit comparisons distinguish the three states. `if setting then` alone would mix up `nil` and `false`.'],
        ['11', 'Ketiga-tiga keadaan diuji.', 'All three states tested.']),
      CODE('empty-checks', 'luau', 'luau', ['Menyemak kekosongan dengan betul', 'Checking emptiness correctly'], `
local function summary(items: {string}?, note: string?): string
  local itemPart = if items and #items > 0 then \`{#items} items\` else "no items"
  local notePart = if note and note ~= "" then note else "no note"
  return \`{itemPart}, {notePart}\`
end

print(summary({"a", "b"}, "gift"))
print(summary({}, ""))
print(summary(nil, nil))
`, '2 items, gift\nno items, no note\nno items, no note', {
        debug: BUG(`
local function countItems(items)
  if #items > 0 then
    return #items
  end
  return 0
end
print(countItems(nil))
`, 'example:2: attempt to get length of a nil value',
          '`#` tidak boleh digunakan pada `nil`. Fungsi menganggap senarai sentiasa wujud. Gabungkan semakan kewujudan dan kekosongan dengan litar pintas: `if items and #items > 0 then` — jika `items` ialah `nil`, `#items` tidak pernah dinilai.',
          '`#` cannot be applied to `nil`. The function assumes the list always exists. Combine the existence and emptiness checks with short-circuiting: `if items and #items > 0 then` — if `items` is `nil`, `#items` is never evaluated.'),
      }),
      EXPLAIN('empty-checks',
        ['1', 'Kedua-dua parameter pilihan (`?`).', 'Both parameters are optional (`?`).'],
        ['2', 'Senarai mesti wujud **dan** tidak kosong.', 'The list must exist **and** not be empty.'],
        ['3–4', 'Nota mesti wujud **dan** bukan string kosong — `""` benar, jadi ia mesti disemak secara eksplisit. Kedua-dua bahagian kemudian digabungkan.', 'The note must exist **and** not be the empty string — `""` is truthy, so it must be checked explicitly. The two parts are then combined.'],
        ['7–9', 'Data penuh, kosong, dan `nil` — semuanya selamat.', 'Full data, empty data and `nil` — all safe.'])),
    S('line_by_line',
      EXPLAIN('empty-checks',
        ['2', 'Litar pintas: jika `items` ialah `nil`, `and` berhenti sebelum `#items`, jadi tiada ralat.', 'Short-circuit: if `items` is `nil`, `and` stops before `#items`, so there is no error.']),
      EXPLAIN('truthy-table',
        ['9', 'If-expression di dalam `print` memilih label; `value` yang `nil` atau `false` memberi "falsy".', 'The if-expression inside `print` chooses the label; a `nil` or `false` `value` gives "falsy".'])),
    S('why_this_way',
      P('Mengapa hanya dua nilai palsu? Kerana ia menjadikan peraturan mudah diingati dan menghalang nilai sah seperti skor 0 daripada dianggap "tiada" secara tidak sengaja. Kosnya ialah anda mesti menulis semakan kekosongan secara eksplisit — yang sebenarnya menjadikan niat lebih jelas.',
        'Why only two falsy values? Because it makes the rule easy to remember and prevents valid values such as a score of 0 from accidentally being treated as "none". The cost is that you must write emptiness checks explicitly — which actually makes the intent clearer.'),
      P('Gunakan `if x then` **apabila** menyemak kewujudan objek atau table; `~= nil` **apabila** `false` mungkin; perbandingan eksplisit **apabila** menyemak sifar, kosong atau `true` sebenar.', 'Use `if x then` **when** checking whether an object or table exists; `~= nil` **when** `false` is possible; explicit comparisons **when** checking for zero, empty or a real `true`.')),
    S('execution_flow',
      OL(
        ['`summary(nil, nil)`: `items and #items > 0` → `items` ialah `nil` → `and` memulangkan `nil` tanpa menilai `#items`.', '`summary(nil, nil)`: `items and #items > 0` → `items` is `nil` → `and` returns `nil` without evaluating `#items`.'],
        ['If-expression memilih "no items".', 'The if-expression chooses "no items".'],
        ['Begitu juga untuk nota → "no note".', 'Likewise for the note → "no note".'],
      )),
    S('memory_behaviour',
      P('Ujian truthiness tidak memperuntukkan memori — ia satu perbandingan tag jenis dalam VM. `#items` pada senarai mengira panjang dengan carian sempadan; `next(dict) == nil` menyemak sama ada dictionary kosong tanpa melelar keseluruhannya.',
        'Truthiness tests allocate no memory — they are a single type-tag comparison in the VM. `#items` on a list computes the length with a border search; `next(dict) == nil` checks whether a dictionary is empty without iterating it all.')),
    S('alternative_implementations',
      P('Tukar kepada boolean sebenar apabila anda menyimpan atau menghantar keputusan:', 'Convert to a real boolean when you store or send a result:'),
      CODE('to-boolean', 'luau', 'luau', ['Menukar kepada boolean', 'Converting to boolean'], `
local inventory = {sword = 1}
local hasSword = inventory.sword ~= nil
local hasBow = inventory.bow ~= nil
print(hasSword, hasBow, typeof(hasSword))
print(not not inventory.sword, not not inventory.bow)
`, 'true\tfalse\tboolean\ntrue\tfalse'),
      EXPLAIN('to-boolean',
        ['1–4', '`x ~= nil` menghasilkan `true` atau `false` sebenar — jelas dan selamat untuk disimpan.', '`x ~= nil` produces a real `true` or `false` — clear and safe to store.'],
        ['5', '`not not x` juga menukar kepada boolean, tetapi kurang jelas dibaca.', '`not not x` also converts to a boolean, but reads less clearly.'])),
    S('common_mistakes',
      UL(
        ['Menganggap `0`, `""` atau `{}` palsu.', 'Assuming `0`, `""` or `{}` are falsy.'],
        ['Menggunakan `if flag then` untuk tetapan tiga keadaan.', 'Using `if flag then` for a three-state setting.'],
        ['Menggunakan `#` pada nilai yang mungkin `nil`.', 'Using `#` on a value that might be `nil`.'],
        ['Menyimpan "benar" sebagai string `"true"` — ia sentiasa benar, walaupun "false".', 'Storing "true" as the string `"true"` — it is always truthy, even "false".'],
      )),
    S('debugging',
      P('Apabila syarat berkelakuan berlawanan dengan jangkaan, cetak nilai dan jenisnya: `print(x, typeof(x))`. Nilai yang kelihatan seperti "false" atau "0" dalam output mungkin string atau nombor, yang **benar**. Data yang dimuatkan daripada teks (konfigurasi, input) adalah punca biasa — "false" sebagai string. Contoh berikut menukar teks tetapan kepada boolean sebenar dengan selamat:',
        'When a condition behaves the opposite of what you expect, print the value and its type: `print(x, typeof(x))`. A value that looks like "false" or "0" in output may be a string or a number, which is **truthy**. Data loaded from text (configuration, input) is a common cause — "false" as a string. The following example converts a setting’s text into a real boolean safely:'),
      CODE('parse-bool', 'luau', 'luau', ['Menghurai boolean daripada teks', 'Parsing a boolean from text'], `
local function parseBool(text: string?): boolean?
  if text == nil then return nil end
  local lowered = text:lower()
  if lowered == "true" or lowered == "yes" or lowered == "1" then return true end
  if lowered == "false" or lowered == "no" or lowered == "0" then return false end
  return nil
end

for _, t in {"true", "No", "0", "maybe"} do
  print(t, parseBool(t))
end
print(if "false" then "string false is truthy" else "never")
`, 'true\ttrue\nNo\tfalse\n0\tfalse\nmaybe\tnil\nstring false is truthy'),
      EXPLAIN('parse-bool',
        ['1–7', 'Teks yang dikenali menjadi `true`/`false` sebenar; selainnya `nil` (tidak diketahui).', 'Recognised text becomes a real `true`/`false`; anything else `nil` (unknown).'],
        ['9–11', 'Empat input diuji.', 'Four inputs tested.'],
        ['12', 'Bukti: string "false" ialah benar dalam syarat.', 'Proof: the string "false" is truthy in a condition.'])),
    S('performance',
      P('Ujian truthiness ialah operasi syarat yang terpantas. Perbandingan eksplisit (`~= nil`, `== 0`) hampir sama pantas. Tiada sebab prestasi untuk memilih bentuk yang kurang jelas.', 'Truthiness tests are the fastest conditional operation. Explicit comparisons (`~= nil`, `== 0`) are almost as fast. There is no performance reason to choose a less clear form.')),
    S('software_engineering',
      P('Semakan samar berbanding semakan yang menyatakan niat:', 'Vague checks versus checks that state their intent:'),
      CODE('poor-vague-truthy', 'luau', 'luau', ['Pelaksanaan lemah: truthiness untuk segala-galanya', 'Poor implementation: truthiness for everything'], `
local player = {name = "", lives = 0, shield = false}
local status = {}
if player.name then table.insert(status, "named") end
if player.lives then table.insert(status, "alive") end
if player.shield ~= nil then table.insert(status, "shield data") end
print(table.concat(status, ", "))
`, 'named, alive, shield data'),
      EXPLAIN('poor-vague-truthy',
        ['1–6', 'Nama kosong dianggap "bernama" dan 0 nyawa dianggap "hidup" — kedua-duanya salah kerana `""` dan 0 benar.', 'An empty name counts as "named" and 0 lives as "alive" — both wrong because `""` and 0 are truthy.']),
      CODE('improved-explicit-checks', 'luau', 'luau', ['Pelaksanaan lebih baik: semakan eksplisit', 'Improved implementation: explicit checks'], `
local player = {name = "", lives = 0, shield = false}
local status = {}
if player.name ~= "" then table.insert(status, "named") end
if player.lives > 0 then table.insert(status, "alive") end
if player.shield == true then table.insert(status, "shielded") end
print(if #status > 0 then table.concat(status, ", ") else "nothing")
`, 'nothing'),
      EXPLAIN('improved-explicit-checks',
        ['1–5', 'Setiap semakan menyatakan soalan sebenar: tidak kosong, lebih daripada sifar, benar-benar `true`.', 'Each check states the real question: not empty, more than zero, really `true`.'],
        ['6', 'Pemain ini tidak bernama, tidak hidup dan tidak berperisai — keputusan yang betul.', 'This player is unnamed, not alive and unshielded — the correct result.'])),
    S('industry_use_cases',
      UL(
        ['`if humanoid then` selepas `FindFirstChild` ialah corak keselamatan asas dalam skrip Roblox.', '`if humanoid then` after `FindFirstChild` is a basic safety pattern in Roblox scripts.'],
        ['Tetapan pemain disimpan sebagai `true`/`false`/`nil` dengan lalai untuk `nil`.', 'Player settings are stored as `true`/`false`/`nil` with a default for `nil`.'],
        ['Data konfigurasi teks ditukar kepada boolean sebenar semasa dimuatkan.', 'Text configuration data is converted to real booleans when loaded.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah `print` (fungsi) pada `truthy-table` dan ramalkan keputusannya.', 'Add `print` (a function) to `truthy-table` and predict its verdict.'],
        ['Tulis `isBlank(text)` yang benar untuk `nil`, `""` dan teks yang hanya ruang.', 'Write `isBlank(text)` that is true for `nil`, `""` and whitespace-only text.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Pemeriksa pintu.** Pintu dibuka jika pemain mempunyai kunci (medan pilihan), tahap > 0 dan tidak dibekukan (`frozen` boleh `nil`, `true` atau `false`). Laporkan sebab setiap penolakan.', '**A door checker.** A door opens if the player has a key (an optional field), level > 0 and is not frozen (`frozen` may be `nil`, `true` or `false`). Report the reason for each refusal.'),
      CODE('door-check', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function canOpen(p): (boolean, string)
  if p.keyId == nil then return false, "no key" end
  if p.level <= 0 then return false, "level too low" end
  if p.frozen == true then return false, "frozen" end
  return true, "door opens"
end

local players = {
  {keyId = "gold", level = 3},
  {keyId = "gold", level = 0},
  {level = 5},
  {keyId = "silver", level = 2, frozen = true},
  {keyId = "silver", level = 2, frozen = false},
}
for i, p in players do
  print(i, canOpen(p))
end
`, '1\ttrue\tdoor opens\n2\tfalse\tlevel too low\n3\tfalse\tno key\n4\tfalse\tfrozen\n5\ttrue\tdoor opens'),
      EXPLAIN('door-check',
        ['1–6', 'Setiap semakan eksplisit: kunci wujud (`~= nil`), tahap positif, dan beku hanya jika benar-benar `true` — `nil` dirawat sebagai tidak beku.', 'Each check is explicit: the key exists (`~= nil`), the level is positive, and frozen only if really `true` — `nil` is treated as not frozen.'],
        ['8–14', 'Lima pemain menguji setiap laluan, termasuk `frozen` yang `nil` dan `false`.', 'Five players test every path, including `frozen` as `nil` and `false`.'],
        ['15–17', 'Nombor, keputusan dan sebab.', 'The number, the verdict and the reason.'])),
    S('summary',
      UL(
        ['Hanya `nil` dan `false` palsu; `0`, `""`, `{}` dan `"false"` benar.', 'Only `nil` and `false` are falsy; `0`, `""`, `{}` and `"false"` are truthy.'],
        ['`if x then` untuk kewujudan; `~= nil` apabila `false` sah; perbandingan eksplisit untuk kosong atau sifar.', '`if x then` for existence; `~= nil` when `false` is valid; explicit comparisons for empty or zero.'],
        ['`x and #x > 0` menyemak kewujudan dan kekosongan dengan selamat.', '`x and #x > 0` checks existence and emptiness safely.'],
        ['Tukar teks kepada boolean sebenar semasa memuatkan data.', 'Convert text to real booleans when loading data.'],
      )),
    S('knowledge_check',
      OL(
        ['Adakah `if {} then print("yes") end` mencetak sesuatu?', 'Does `if {} then print("yes") end` print anything?'],
        ['Bagaimanakah anda membezakan `false` daripada `nil` dalam syarat?', 'How do you distinguish `false` from `nil` in a condition?'],
        ['Mengapakah `#items > 0` boleh gagal, dan bagaimana membetulkannya?', 'Why can `#items > 0` fail, and how do you fix it?'],
        ['Apakah nilai truthiness string `"false"`?', 'What is the truthiness of the string `"false"`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Booleans and conditional structures', url: `${DOCS}/luau/booleans` },
        { title: 'Luau — Syntax', url: `${LUAU}/syntax` },
        { title: 'Lua 5.1 Reference Manual §2.4.4 — Control Structures (false and nil)', url: 'https://www.lua.org/manual/5.1/manual.html#2.4.4' },
        { title: 'Roblox Engine API — Instance:FindFirstChild (returns nil)', url: `${DOCS}/reference/engine/classes/Instance#FindFirstChild` },
      )),
  ],
};

// ─── 1.3 Guard clauses and early returns ───────────────────────────────────

export const LUAU103_1_3: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 1,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis [[guard-clause|klausa pengawal]] yang keluar awal daripada fungsi.', 'Write [[guard-clause|guard clauses]] that leave a function early.'],
        ['Menukar `if` bersarang yang dalam kepada senarai pengawal yang rata.', 'Turn deeply nested `if`s into a flat list of guards.'],
        ['Memilih apa yang dipulangkan oleh pengawal: tiada nilai, `nil, mesej`, atau nilai lalai.', 'Choose what a guard returns: nothing, `nil, message`, or a default value.'],
        ['Menyusun pengawal supaya setiap semakan selamat bergantung pada yang sebelumnya.', 'Order guards so each check can safely rely on the previous ones.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1–1.2: `if` dan truthiness.', 'Lectures 1.1–1.2: `if` and truthiness.'],
      )),
    S('introduction',
      P('Pengendali event Roblox biasa kelihatan seperti ini: pastikan pemain wujud, pastikan wataknya wujud, pastikan dia masih hidup, pastikan dia mempunyai cukup syiling — dan barulah lakukan kerja sebenar. Ditulis dengan `if` bersarang, kerja sebenar berakhir empat tahap inden ke dalam, dikelilingi oleh `end`. **Klausa pengawal** membalikkan setiap syarat: jika sesuatu tidak betul, keluar serta-merta. Kod yang terhasil dibaca dari atas ke bawah seperti senarai semak, dan kerja utama berada di bahagian bawah, pada satu tahap inden.',
        'A typical Roblox event handler looks like this: make sure the player exists, make sure their character exists, make sure they are still alive, make sure they have enough coins — and only then do the real work. Written with nested `if`s, the real work ends up four indentation levels deep, surrounded by `end`s. A **guard clause** inverts each condition: if something is wrong, leave immediately. The resulting code reads top to bottom like a checklist, and the main work sits at the bottom, at one indentation level.'),
      KEY('Tolak kes buruk di atas dengan `return`; biarkan laluan yang baik mengalir ke bawah tanpa inden.', 'Reject bad cases at the top with `return`; let the good path flow downwards without indentation.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Pengawal:** `if keadaanBuruk then return … end` di permulaan fungsi.', '**Guard:** `if badCondition then return … end` at the start of a function.'],
        ['**Susunan:** semakan kewujudan dahulu, kemudian semakan yang bergantung padanya.', '**Order:** existence checks first, then checks that depend on them.'],
        ['**Pulangan:** `return` kosong untuk pengendali event; `nil, mesej` untuk fungsi yang hasilnya digunakan; nilai lalai apabila selamat.', '**Returns:** an empty `return` for event handlers; `nil, message` for functions whose result is used; a default when safe.'],
        ['**Laluan utama:** selepas semua pengawal, kod boleh menganggap input sah.', '**Main path:** after all guards, the code can assume the input is valid.'],
      )),
    S('detailed_theory',
      P('Klausa pengawal bergantung pada sifat `return`: ia menamatkan fungsi serta-merta, jadi baris selepasnya hanya dicapai jika syarat pengawal palsu. Setiap pengawal yang lulus **menambah satu fakta** yang boleh dipercayai oleh baris seterusnya: selepas `if player == nil then return end`, `player` pasti wujud; selepas `if player.health <= 0 then return end`, pemain pasti hidup. Inilah sebabnya susunan penting: semakan `player.health` sebelum semakan `player == nil` akan gagal dengan `attempt to index nil with \'health\'` tepat dalam kes yang cuba dikendalikan oleh pengawal.',
        'Guard clauses rely on a property of `return`: it ends the function immediately, so the lines after it are only reached if the guard’s condition was false. Each guard that passes **adds one fact** the following lines can trust: after `if player == nil then return end`, `player` certainly exists; after `if player.health <= 0 then return end`, the player is certainly alive. This is why order matters: checking `player.health` before checking `player == nil` would fail with `attempt to index nil with \'health\'` in exactly the case the guard tries to handle.'),
      P('Apa yang dipulangkan oleh pengawal bergantung pada pemanggil. Pengendali event Roblox (`Touched`, `PlayerAdded`) mengabaikan nilai pulangan, jadi `return` kosong sudah cukup. Fungsi yang hasilnya digunakan patut memulangkan `nil, mesej` supaya pemanggil tahu **mengapa** ia gagal — dan pemanggil mesti menyemak `nil` itu, atau ralat hanya berpindah ke tempat lain. Kadang-kadang nilai lalai lebih baik (contohnya `return 0` untuk kerosakan pada sasaran yang tidak sah). Peraturan praktikal: jika kegagalan ialah kes biasa yang dijangka, pulangkan sesuatu; jika ia menunjukkan pepijat pengaturcara, naikkan `error`.',
        'What a guard returns depends on the caller. Roblox event handlers (`Touched`, `PlayerAdded`) ignore return values, so an empty `return` is enough. Functions whose result is used should return `nil, message` so the caller knows **why** they failed — and the caller must check that `nil`, or the error just moves elsewhere. Sometimes a default is better (for example `return 0` for damage against an invalid target). A practical rule: if the failure is an ordinary expected case, return something; if it indicates a programmer bug, raise an `error`.')),
    S('technical_terminology', TERMS('guard-clause', 'function', 'nil', 'control-flow')),
    S('syntax_rules',
      UL(
        ['`if not x then return end` — pengawal satu baris.', '`if not x then return end` — a one-line guard.'],
        ['`if x == nil then return nil, "sebab" end` — pengawal dengan sebab.', '`if x == nil then return nil, "reason" end` — a guard with a reason.'],
        ['`return` mesti pernyataan terakhir dalam bloknya; dalam satu baris, `then return end` memenuhinya.', '`return` must be the last statement in its block; on one line, `then return end` satisfies that.'],
      )),
    S('code_demonstration',
      CODE('guarded-purchase', 'luau', 'luau', ['Pembelian dengan klausa pengawal', 'A purchase with guard clauses'], `
local PRICES = {sword = 300, potion = 40}

local function buy(player, item: string): (boolean, string)
  if player == nil then return false, "no player" end
  if player.health <= 0 then return false, "player is dead" end
  local price = PRICES[item]
  if price == nil then return false, \`unknown item {item}\` end
  if player.coins < price then return false, \`need {price - player.coins} more coins\` end

  player.coins -= price
  return true, \`bought {item}, {player.coins} coins left\`
end

local hero = {health = 50, coins = 320}
print(buy(hero, "sword"))
print(buy(hero, "sword"))
print(buy(hero, "bow"))
print(buy(nil, "potion"))
`, 'true\tbought sword, 20 coins left\nfalse\tneed 280 more coins\nfalse\tunknown item bow\nfalse\tno player'),
      EXPLAIN('guarded-purchase',
        ['1', 'Senarai harga.', 'The price list.'],
        ['3–8', 'Empat pengawal mengikut susunan: pemain wujud, hidup, item wujud, cukup syiling. Setiap satu menambah fakta yang boleh dipercayai oleh baris seterusnya.', 'Four guards in order: the player exists, is alive, the item exists, enough coins. Each one adds a fact the next lines can trust.'],
        ['10–11', 'Laluan utama pada satu tahap inden.', 'The main path at one indentation level.'],
        ['14–18', 'Empat panggilan menguji kejayaan dan tiga penolakan.', 'Four calls test success and three refusals.'])),
    S('complete_examples',
      CODE('guard-order', 'luau', 'luau', ['Susunan pengawal yang betul', 'The correct guard order'], `
local function shieldStrength(player): number
  if player == nil then return 0 end
  if player.equipment == nil then return 0 end
  local shield = player.equipment.shield
  if shield == nil then return 0 end
  return shield.strength
end

print(shieldStrength({equipment = {shield = {strength = 40}}}))
print(shieldStrength({equipment = {}}))
print(shieldStrength({}))
print(shieldStrength(nil))
`, '40\n0\n0\n0', {
        debug: BUG(`
local function shieldStrength(player): number
  if player.equipment == nil then return 0 end
  if player == nil then return 0 end
  return player.equipment.shield.strength
end
print(shieldStrength(nil))
`, "example:2: attempt to index nil with 'equipment'",
          'Pengawal dalam susunan yang salah: baris 2 membaca `player.equipment` **sebelum** baris 3 menyemak sama ada `player` wujud. Untuk `nil`, baris 2 gagal — tepat kes yang sepatutnya dikendalikan oleh pengawal baris 3. Susun pengawal dari luar ke dalam: objek dahulu, kemudian medannya.',
          'The guards are in the wrong order: line 2 reads `player.equipment` **before** line 3 checks whether `player` exists. For `nil`, line 2 fails — exactly the case the guard on line 3 was meant to handle. Order guards from the outside in: the object first, then its fields.'),
      }),
      EXPLAIN('guard-order',
        ['1–3', 'Semak pemain, kemudian peralatannya.', 'Check the player, then their equipment.'],
        ['4–6', 'Kemudian perisai; hanya selepas itu `strength` dibaca dengan selamat.', 'Then the shield; only after that is `strength` read safely.'],
        ['9–12', 'Setiap tahap data yang hilang memberi 0, tanpa ralat.', 'Every level of missing data gives 0, without errors.']),
      CODE('guard-caller-check', 'luau', 'luau', ['Pemanggil mesti menyemak hasil pengawal', 'The caller must check the guard’s result'], `
local function parseLevel(text: string): (number?, string?)
  local n = tonumber(text)
  if n == nil then return nil, \`"{text}" is not a number\` end
  if n < 1 or n > 100 then return nil, \`level {n} out of range\` end
  return n, nil
end

for _, input in {"42", "abc", "500"} do
  local level, problem = parseLevel(input)
  if level == nil then
    print("rejected:", problem)
    continue
  end
  print("next level:", level + 1)
end
`, 'next level:\t43\nrejected:\t"abc" is not a number\nrejected:\tlevel 500 out of range', {
        debug: BUG(`
local function parseLevel(text: string): number?
  local n = tonumber(text)
  if n == nil then return nil end
  return n
end
local level = parseLevel("abc")
print("next level:", level + 1)
`, 'example:7: attempt to perform arithmetic (add) on nil and number',
          'Pengawal dalam `parseLevel` berfungsi — ia memulangkan `nil` — tetapi pemanggil tidak menyemaknya, jadi ralat hanya berpindah ke baris 7. Pengawal menolak masalah kepada pemanggil; pemanggil mesti mengendalikannya, seperti versi asal dengan `if level == nil then … continue end`.',
          'The guard in `parseLevel` works — it returns `nil` — but the caller does not check it, so the error just moves to line 7. A guard pushes the problem to the caller; the caller must handle it, as the original does with `if level == nil then … continue end`.'),
      }),
      EXPLAIN('guard-caller-check',
        ['1–6', 'Dua pengawal dengan sebab; laluan utama memulangkan nombor.', 'Two guards with reasons; the main path returns the number.'],
        ['8–15', 'Pemanggil menyemak `nil` dan melangkau dengan `continue` (Luau); hanya nilai sah sampai ke aritmetik.', 'The caller checks for `nil` and skips with `continue` (Luau); only valid values reach the arithmetic.'])),
    S('line_by_line',
      EXPLAIN('guarded-purchase',
        ['6–7', 'Pengawal tidak perlu di bahagian atas sahaja — `price` dikira dahulu kerana pengawal seterusnya bergantung padanya.', 'Guards need not all be at the very top — `price` is computed first because the next guard depends on it.']),
      EXPLAIN('guard-order',
        ['4', 'Local perantaraan `shield` mengelakkan rantaian panjang `player.equipment.shield.strength` dan menjadikan pengawal seterusnya mudah dibaca.', 'The intermediate local `shield` avoids the long chain `player.equipment.shield.strength` and makes the next guard easy to read.'])),
    S('why_this_way',
      P('Mengapa pengawal dan bukan `if` bersarang? Kerana kod dibaca dari atas ke bawah: pengawal memberitahu pembaca "inilah semua kes yang ditolak" sebelum kerja utama, dan kerja utama tidak tenggelam dalam inden. Menambah syarat baharu ialah menambah satu baris, bukan membina semula struktur.',
        'Why guards and not nested `if`s? Because code is read top to bottom: guards tell the reader "here are all the rejected cases" before the main work, and the main work is not buried in indentation. Adding a new condition means adding one line, not rebuilding the structure.'),
      P('Gunakan pengawal **dalam setiap fungsi** yang menerima input yang mungkin tidak sah — terutamanya pengendali event Roblox, di mana objek boleh hilang pada bila-bila masa.', 'Use guards **in every function** that receives possibly invalid input — especially Roblox event handlers, where objects can disappear at any moment.')),
    S('execution_flow',
      OL(
        ['`buy(hero, "sword")` kali kedua: pengawal 1 dan 2 lulus (pemain wujud, hidup).', '`buy(hero, "sword")` the second time: guards 1 and 2 pass (the player exists and is alive).'],
        ['`price = 300`; pengawal 3 lulus.', '`price = 300`; guard 3 passes.'],
        ['Pengawal 4: 20 < 300 → `return false, "need 280 more coins"`; laluan utama tidak dijalankan.', 'Guard 4: 20 < 300 → `return false, "need 280 more coins"`; the main path does not run.'],
      )),
    S('memory_behaviour',
      P('Pengawal menjimatkan kerja: apabila input ditolak awal, tiada table perantaraan atau string dicipta untuk laluan utama. Mesej sebab (`"need … more coins"`) dicipta hanya apabila pengawal itu benar-benar dicetuskan.',
        'Guards save work: when input is rejected early, no intermediate tables or strings are created for the main path. Reason messages (`"need … more coins"`) are only created when that guard actually fires.')),
    S('alternative_implementations',
      P('Untuk banyak semakan yang serupa, senarai peraturan boleh menggantikan pengawal individu:', 'For many similar checks, a list of rules can replace individual guards:'),
      CODE('rule-list', 'luau', 'luau', ['Senarai peraturan', 'A list of rules'], `
local RULES = {
  {check = function(p) return p.level >= 10 end, reason = "level below 10"},
  {check = function(p) return p.wins >= 3 end, reason = "fewer than 3 wins"},
  {check = function(p) return not p.isBanned end, reason = "banned"},
}

local function qualifies(p): (boolean, string)
  for _, rule in RULES do
    if not rule.check(p) then return false, rule.reason end
  end
  return true, "qualified"
end

print(qualifies({level = 12, wins = 5, isBanned = false}))
print(qualifies({level = 12, wins = 1, isBanned = false}))
`, 'true\tqualified\nfalse\tfewer than 3 wins'),
      EXPLAIN('rule-list',
        ['1–5', 'Setiap peraturan ialah fungsi semakan dan sebab — data, bukan kod bersarang.', 'Each rule is a check function and a reason — data, not nested code.'],
        ['7–12', 'Satu gelung bertindak sebagai semua pengawal; peraturan pertama yang gagal memulangkan sebabnya.', 'One loop acts as all the guards; the first failing rule returns its reason.'],
        ['14–15', 'Satu pemain layak; satu ditolak dengan sebab yang tepat.', 'One player qualifies; one is refused with the exact reason.'])),
    S('common_mistakes',
      UL(
        ['Menyemak medan sebelum menyemak bahawa objek wujud.', 'Checking a field before checking the object exists.'],
        ['Pengawal yang memulangkan `nil` tetapi pemanggil tidak menyemaknya.', 'Guards that return `nil` but callers that do not check it.'],
        ['Mencampurkan pengawal dengan kerja utama sehingga pengawal tersembunyi di tengah.', 'Mixing guards with main work so guards are hidden in the middle.'],
        ['Pengawal yang terlalu longgar (`if not player.coins`) yang tidak menangkap 0.', 'Guards that are too loose (`if not player.coins`), which miss 0.'],
      )),
    S('debugging',
      P('Apabila fungsi berpengawal masih gagal, semak dua perkara: (1) adakah setiap semakan berlaku **sebelum** penggunaan pertama nilai itu? Mesej `attempt to index nil with \'X\'` pada baris pengawal sendiri menunjukkan susunan yang salah; (2) adakah pemanggil menyemak nilai yang dipulangkan oleh pengawal? Untuk mengesan pengawal mana yang dicetuskan, pulangkan sebab yang unik bagi setiap pengawal dan cetaknya. Contoh berikut menunjukkan pengendali event tiruan dengan pengawal yang dilog:',
        'When a guarded function still fails, check two things: (1) does every check happen **before** the value’s first use? A message `attempt to index nil with \'X\'` on a guard line itself shows the wrong order; (2) does the caller check the value the guard returns? To see which guard fired, return a unique reason per guard and print it. The following example shows a simulated event handler with logged guards:'),
      CODE('logged-guards', 'luau', 'luau', ['Pengawal yang dilog', 'Logged guards'], `
local function onTouched(hit)
  if hit == nil then return "no hit" end
  local character = hit.parent
  if character == nil then return "no character" end
  local humanoid = character.humanoid
  if humanoid == nil then return "not a humanoid" end
  humanoid.health -= 10
  return \`damaged, health {humanoid.health}\`
end

local victim = {humanoid = {health = 100}}
print(onTouched({parent = victim}))
print(onTouched({parent = {}}))
print(onTouched({}))
`, 'damaged, health 90\nnot a humanoid\nno character'),
      EXPLAIN('logged-guards',
        ['1–6', 'Meniru pengendali `Touched` Roblox dengan table: setiap pengawal memulangkan sebab yang unik.', 'Imitating a Roblox `Touched` handler with tables: each guard returns a unique reason.'],
        ['7–8', 'Laluan utama hanya untuk humanoid yang sah.', 'The main path only for a valid humanoid.'],
        ['11–14', 'Tiga sentuhan: humanoid, objek tanpa humanoid, dan bahagian tanpa induk. Sebab memberitahu pengawal mana yang dicetuskan.', 'Three touches: a humanoid, an object without a humanoid, and a part without a parent. The reasons tell which guard fired.'])),
    S('performance',
      P('Pengawal ialah pengoptimuman semula jadi: kes yang paling kerap ditolak (contohnya sentuhan oleh bukan pemain) sepatutnya disemak dahulu, supaya kebanyakan panggilan tamat selepas satu perbandingan. Dalam pengendali `Touched` yang dicetuskan beratus kali sesaat, ini membuat perbezaan yang nyata.', 'Guards are a natural optimisation: the most frequently rejected case (for example touches by non-players) should be checked first, so most calls end after one comparison. In a `Touched` handler fired hundreds of times a second, this makes a real difference.')),
    S('software_engineering',
      P('Struktur "anak panah" bersarang berbanding pengawal:', 'A nested "arrow" structure versus guards:'),
      CODE('poor-arrow-code', 'luau', 'luau', ['Pelaksanaan lemah: kod anak panah', 'Poor implementation: arrow code'], `
local function revive(player)
  if player then
    if player.isDead then
      if player.tokens > 0 then
        player.tokens -= 1
        player.isDead = false
        return "revived"
      else
        return "no tokens"
      end
    else
      return "not dead"
    end
  else
    return "no player"
  end
end
print(revive({isDead = true, tokens = 1}), revive({isDead = false}), revive(nil))
`, 'revived\tnot dead\tno player'),
      EXPLAIN('poor-arrow-code',
        ['1–17', 'Kerja sebenar empat tahap ke dalam; setiap `else` jauh dari syaratnya — sukar memadankan "no tokens" dengan semakannya.', 'The real work is four levels deep; each `else` is far from its condition — hard to match "no tokens" with its check.'],
        ['18', 'Hasil betul tetapi struktur rapuh.', 'Correct results but a fragile structure.']),
      CODE('improved-guarded-revive', 'luau', 'luau', ['Pelaksanaan lebih baik: pengawal', 'Improved implementation: guards'], `
local function revive(player)
  if not player then return "no player" end
  if not player.isDead then return "not dead" end
  if player.tokens <= 0 then return "no tokens" end

  player.tokens -= 1
  player.isDead = false
  return "revived"
end
print(revive({isDead = true, tokens = 1}), revive({isDead = false}), revive(nil))
`, 'revived\tnot dead\tno player'),
      EXPLAIN('improved-guarded-revive',
        ['1–4', 'Tiga pengawal, setiap satu dengan sebabnya di baris yang sama.', 'Three guards, each with its reason on the same line.'],
        ['6–8', 'Kerja utama pada satu tahap inden.', 'The main work at one indentation level.'],
        ['10', 'Hasil yang sama.', 'The same results.'])),
    S('industry_use_cases',
      UL(
        ['Pengendali `Touched`, `PlayerAdded` dan RemoteEvent dalam Roblox hampir selalu bermula dengan pengawal.', 'Roblox `Touched`, `PlayerAdded` and RemoteEvent handlers almost always start with guards.'],
        ['Pelayan mengesahkan setiap permintaan klien dengan pengawal sebelum mengubah data.', 'Servers validate every client request with guards before changing data.'],
        ['Panduan gaya kod di banyak syarikat menggalakkan "return early".', 'Code style guides at many companies encourage "return early".'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah pengawal "item already owned" pada `buy`.', 'Add an "item already owned" guard to `buy`.'],
        ['Tulis semula `poor-arrow-code` sendiri sebelum melihat versi yang dipertingkatkan.', 'Rewrite `poor-arrow-code` yourself before looking at the improved version.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Pengendali permintaan dagangan.** Klien meminta untuk menukar item dengan pemain lain. Sahkan dengan pengawal: kedua-dua pemain wujud, bukan pemain yang sama, kedua-duanya memiliki item yang ditawarkan, dan dagangan tidak dikunci. Kemudian tukar item.', '**A trade request handler.** A client asks to swap items with another player. Validate with guards: both players exist, they are not the same player, both own the offered items, and trading is not locked. Then swap the items.'),
      CODE('trade-handler', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local tradingLocked = false

local function trade(a, b, itemA: string, itemB: string): (boolean, string)
  if tradingLocked then return false, "trading is locked" end
  if a == nil or b == nil then return false, "missing player" end
  if a == b then return false, "cannot trade with yourself" end
  if not a.items[itemA] then return false, \`{a.name} does not own {itemA}\` end
  if not b.items[itemB] then return false, \`{b.name} does not own {itemB}\` end

  a.items[itemA], b.items[itemB] = nil, nil
  a.items[itemB], b.items[itemA] = true, true
  return true, \`{a.name} traded {itemA} for {itemB}\`
end

local aina = {name = "Aina", items = {sword = true}}
local ben = {name = "Ben", items = {bow = true}}
print(trade(aina, ben, "sword", "bow"))
print(trade(aina, ben, "sword", "bow"))
print(trade(aina, aina, "bow", "bow"))
print(aina.items.bow, ben.items.sword)
`, 'true\tAina traded sword for bow\nfalse\tAina does not own sword\nfalse\tcannot trade with yourself\ntrue\ttrue'),
      EXPLAIN('trade-handler',
        ['1', 'Kunci global untuk dagangan (contohnya semasa penyelenggaraan).', 'A global lock for trading (for example during maintenance).'],
        ['3–8', 'Lima pengawal mengikut susunan: kunci, kewujudan, identiti, pemilikan A, pemilikan B.', 'Five guards in order: the lock, existence, identity, A’s ownership, B’s ownership.'],
        ['10–12', 'Laluan utama: tukar item dengan assignment berbilang.', 'The main path: swap items with multiple assignment.'],
        ['15–20', 'Dagangan pertama berjaya; yang kedua gagal kerana Aina tidak lagi memiliki pedang; dagangan dengan diri sendiri ditolak.', 'The first trade succeeds; the second fails because Aina no longer owns the sword; trading with yourself is refused.'])),
    S('summary',
      UL(
        ['Klausa pengawal: `if buruk then return … end` di atas; laluan utama di bawah.', 'Guard clauses: `if bad then return … end` at the top; the main path below.'],
        ['Susun dari luar ke dalam: objek, kemudian medannya.', 'Order from the outside in: the object, then its fields.'],
        ['Pulangkan kosong, `nil, mesej` atau lalai — dan pemanggil mesti menyemak.', 'Return nothing, `nil, message` or a default — and callers must check.'],
        ['Kes yang paling kerap ditolak dahulu untuk prestasi.', 'The most frequently rejected case first for performance.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah `if player.health <= 0` mesti selepas `if player == nil`?', 'Why must `if player.health <= 0` come after `if player == nil`?'],
        ['Apakah yang patut dipulangkan oleh pengawal dalam pengendali `Touched`?', 'What should a guard in a `Touched` handler return?'],
        ['Bagaimanakah pengawal mengurangkan inden?', 'How do guards reduce indentation?'],
        ['Apakah risiko apabila pemanggil tidak menyemak `nil` daripada pengawal?', 'What is the risk when a caller does not check the `nil` from a guard?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Refactoring — Replace Nested Conditional with Guard Clauses', url: 'https://refactoring.com/catalog/replaceNestedConditionalWithGuardClauses.html' },
        { title: 'Roblox Creator Hub — Functions', url: `${DOCS}/luau/functions` },
        { title: 'Luau — Syntax', url: `${LUAU}/syntax` },
        { title: 'Roblox Engine API — BasePart.Touched', url: `${DOCS}/reference/engine/classes/BasePart#Touched` },
      )),
  ],
};

export const LUAU103_M1 = [LUAU103_1_1, LUAU103_1_2, LUAU103_1_3];
