import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA102 · Module 2 — Lua Data Types (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 2.1 nil, boolean and truthiness ───────────────────────────────────────

export const LUA102_2_1: LectureContentDef = {
  courseCode: 'LUA102',
  module: 2,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan maksud [[nil]] sebagai "tiada nilai" dan cara ia membuang medan table.', 'Explain [[nil]] as "no value" and how it removes table fields.'],
        ['Menggunakan nilai boolean `true` dan `false` dalam syarat.', 'Use the boolean values `true` and `false` in conditions.'],
        ['Menerangkan [[truthiness]] Lua: hanya `nil` dan `false` adalah palsu.', 'Explain Lua [[truthiness]]: only `nil` and `false` are falsy.'],
        ['Membezakan "tidak ditetapkan" (`nil`) dan "ditetapkan kepada palsu" (`false`).', 'Distinguish "not set" (`nil`) from "set to false" (`false`).'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1: pemboleh ubah, assignment dan nama.', 'Module 1: variables, assignment and names.'],
        ['Blok `if` asas (LUA101 3.3).', 'Basic `if` blocks (LUA101 3.3).'],
      )),
    S('introduction',
      P('Setiap bahasa mesti menjawab dua soalan asas: bagaimana mewakili "tiada nilai", dan nilai apa yang dikira "benar" dalam syarat. Jawapan Lua sangat ringkas — dan berbeza daripada kebanyakan bahasa lain. Dalam Lua, `0` dan string kosong adalah **benar**. Memahami perbezaan ini menghalang kelas pepijat yang sering menjerat pengaturcara yang datang dari C, JavaScript atau Python.',
        'Every language must answer two basic questions: how to represent "no value", and which values count as "true" in a condition. Lua’s answer is very simple — and different from most other languages. In Lua, `0` and the empty string are **true**. Understanding this prevents a class of bugs that often catches programmers coming from C, JavaScript or Python.'),
      KEY('Hanya **dua** nilai yang palsu: `nil` dan `false`. Semua yang lain — termasuk `0`, `""` dan `{}` — adalah benar.', 'Only **two** values are falsy: `nil` and `false`. Everything else — including `0`, `""` and `{}` — is truthy.', ['Peraturan utama', 'The key rule'])),
    S('fundamental_concepts',
      UL(
        ['**[[nil]]:** jenis dengan satu nilai sahaja. Ia bermaksud ketiadaan: pemboleh ubah yang tidak diberi nilai, medan yang tidak wujud, argumen yang tidak dihantar.', '**[[nil]]:** a type with exactly one value. It means absence: an unassigned variable, a missing field, an argument that was not passed.'],
        ['**boolean:** jenis dengan dua nilai, `true` dan `false`, hasil perbandingan seperti `3 > 2`.', '**boolean:** a type with two values, `true` and `false`, produced by comparisons such as `3 > 2`.'],
        ['**[[truthiness|Truthiness]]:** dalam `if`, `while` dan `and/or`, `nil` dan `false` dikira palsu; nilai lain dikira benar.', '**[[truthiness|Truthiness]]:** in `if`, `while` and `and/or`, `nil` and `false` count as false; every other value counts as true.'],
        ['**Membuang medan:** `t.key = nil` memadam kunci itu daripada table.', '**Removing a field:** `t.key = nil` deletes that key from the table.'],
        ['`not x` memberi `true` hanya jika `x` ialah `nil` atau `false`.', '`not x` gives `true` only if `x` is `nil` or `false`.'],
      )),
    S('detailed_theory',
      P('Dalam pelaksanaan Lua, setiap nilai membawa **tag jenis**. Semakan syarat (`if x then`) hanya perlu melihat tag: jika tag ialah nil, atau tag boolean dengan nilai palsu, maka syarat palsu; selain itu benar. Lua tidak perlu menyemak sama ada nombor ialah sifar atau string kosong. Peraturan ini konsisten dan pantas, dan bermakna `0` boleh menjadi nilai biasa yang sah — contohnya markah 0 atau baki RM0 — tanpa disalah anggap sebagai "tiada".',
        'In Lua’s implementation, every value carries a **type tag**. A condition check (`if x then`) only needs to look at the tag: if the tag is nil, or the boolean tag with a false value, the condition is false; otherwise it is true. Lua does not need to check whether a number is zero or a string is empty. This rule is consistent and fast, and means `0` can be an ordinary valid value — a score of 0 or a balance of RM0 — without being mistaken for "nothing".'),
      P('`nil` mempunyai peranan khas dalam table: table **tidak boleh menyimpan** `nil` sebagai nilai. Memberi `nil` kepada medan membuang medan itu, dan membaca medan yang tidak wujud memulangkan `nil`. Akibatnya, `nil` tidak boleh membezakan "medan tiada" daripada "medan ditetapkan kepada tiada". Apabila perbezaan itu penting — contohnya tetapan "dimatikan" berbanding "tidak dikonfigurasi" — gunakan `false` untuk "dimatikan" dan `nil` untuk "tidak ditetapkan".',
        '`nil` has a special role in tables: a table **cannot store** `nil` as a value. Assigning `nil` to a field removes the field, and reading a field that does not exist returns `nil`. As a result, `nil` cannot distinguish "the field is missing" from "the field is set to nothing". When that difference matters — for example a setting that is "off" versus "not configured" — use `false` for "off" and `nil` for "not set".')),
    S('technical_terminology', TERMS('nil', 'truthiness', 'short-circuit', 'table')),
    S('syntax_rules',
      UL(
        ['Literal: `nil`, `true`, `false` (huruf kecil; `True` dan `NIL` ialah nama biasa).', 'Literals: `nil`, `true`, `false` (lower case; `True` and `NIL` are ordinary names).'],
        ['`x == nil` menguji tepat-tepat `nil`; `not x` menguji `nil` **atau** `false`.', '`x == nil` tests for exactly `nil`; `not x` tests for `nil` **or** `false`.'],
        ['`t.k = nil` membuang medan; `t.k == nil` menyemak sama ada ia tiada.', '`t.k = nil` removes a field; `t.k == nil` checks whether it is missing.'],
        ['`type(x) == "boolean"` menyemak jenis secara eksplisit.', '`type(x) == "boolean"` checks the type explicitly.'],
      )),
    S('code_demonstration',
      CODE('falsy-values', 'lua', 'lua54', ['Nilai mana yang benar?', 'Which values are truthy?'], `
local samples = {false, 0, "", "false", {}}
local labels = {"false", "0", '""', '"false"', "{}"}

for i, value in ipairs(samples) do
  print(labels[i], value and "truthy" or "falsy")
end
print("nil", nil and "truthy" or "falsy")
`, 'false\tfalsy\n0\ttruthy\n""\ttruthy\n"false"\ttruthy\n{}\ttruthy\nnil\tfalsy'),
      EXPLAIN('falsy-values',
        ['1–2', 'Lima nilai yang sering disangka palsu, dan label yang boleh dicetak untuk setiap satu.', 'Five values often mistaken for falsy, and a printable label for each.'],
        ['4–6', '`value and "truthy" or "falsy"` memberi "truthy" bagi setiap nilai yang benar. Hanya `false` yang palsu.', '`value and "truthy" or "falsy"` gives "truthy" for every truthy value. Only `false` is falsy.'],
        ['7', '`nil` tidak boleh disimpan dalam table (ia akan menamatkan senarai `ipairs`), jadi ia diuji secara berasingan.', '`nil` cannot be stored in the list (it would end the `ipairs` sequence), so it is tested separately.'])),
    S('complete_examples',
      CODE('nil-vs-false', 'lua', 'lua54', ['"Tidak ditetapkan" berbanding "dimatikan"', '"Not set" versus "switched off"'], `
local function describe(setting)
  if setting == nil then
    return "not set"
  elseif setting == false then
    return "explicitly off"
  end
  return "on"
end

print(describe(nil), describe(false), describe(true))
`, 'not set\texplicitly off\ton'),
      EXPLAIN('nil-vs-false',
        ['1–3', '`setting == nil` hanya benar untuk `nil` — tetapan yang tiada.', '`setting == nil` is true only for `nil` — a missing setting.'],
        ['4–5', '`setting == false` hanya benar untuk `false` — tetapan yang sengaja dimatikan.', '`setting == false` is true only for `false` — a setting deliberately switched off.'],
        ['7', 'Selain itu tetapan aktif.', 'Otherwise the setting is on.'],
        ['10', 'Tiga keadaan yang `not setting` sahaja tidak dapat bezakan.', 'Three states that `not setting` alone could not tell apart.']),
      CODE('remove-field', 'lua', 'lua54', ['nil membuang medan table', 'nil removes a table field'], `
local inventory = {sword = 1, shield = 1, potion = 3}
inventory.shield = nil

local kinds = 0
for _ in pairs(inventory) do kinds = kinds + 1 end
print(kinds, inventory.shield, inventory.potion)
`, '2\tnil\t3', {
        debug: BUG(`
local inventory = {sword = 1, shield = 1, potion = 3}
inventory.shield = nil
inventory.shield = inventory.shield - 1
print(inventory.shield)
`, "example:3: attempt to perform arithmetic on a nil value (field 'shield')",
          'Selepas baris 2, medan `shield` sudah **tiada**, jadi membacanya memberi `nil`. Menolak 1 daripada `nil` gagal pada baris 3; mesej menyebut `field \'shield\'`. Untuk mengurangkan kiraan item yang mungkin tiada, gunakan nilai lalai: `(inventory.shield or 0) - 1`, atau semak kewujudannya dahulu.',
          'After line 2 the `shield` field is **gone**, so reading it gives `nil`. Subtracting 1 from `nil` fails on line 3; the message names `field \'shield\'`. To decrease the count of an item that may be missing, use a default: `(inventory.shield or 0) - 1`, or check that it exists first.'),
      }),
      EXPLAIN('remove-field',
        ['1', 'Inventori dengan tiga jenis item.', 'An inventory with three kinds of item.'],
        ['2', 'Memberi `nil` **memadam** kunci `shield` sepenuhnya.', 'Assigning `nil` **deletes** the `shield` key entirely.'],
        ['4–5', '`pairs` melawati setiap kunci yang masih wujud; hanya dua.', '`pairs` visits every key that still exists; only two.'],
        ['6', 'Medan yang dipadam dibaca sebagai `nil`.', 'The deleted field reads as `nil`.'])),
    S('line_by_line',
      EXPLAIN('falsy-values',
        ['5', 'Idiom `x and a or b` berfungsi di sini kerana "truthy" sendiri ialah nilai benar. LUA103 1.3 menunjukkan bila idiom ini gagal.', 'The `x and a or b` idiom works here because "truthy" is itself a truthy value. LUA103 1.3 shows when this idiom fails.']),
      EXPLAIN('nil-vs-false',
        ['2', 'Menggunakan `==` dan bukannya `not setting` ialah keputusan reka bentuk: kita mahu membezakan dua nilai palsu.', 'Using `==` instead of `not setting` is a design decision: we want to tell the two falsy values apart.'])),
    S('why_this_way',
      P('Mengapa Lua menjadikan `0` benar? Kerana dalam Lua, nombor sentiasa nilai yang bermakna, dan "tiada nilai" mempunyai jenisnya sendiri (`nil`). Dalam C, `0` sering bermaksud "tiada" kerana C tidak mempunyai nilai kosong khas. Lua memisahkan dua idea ini, jadi `if count then` bermaksud "jika kiraan wujud", bukan "jika kiraan bukan sifar". Untuk menyemak sifar, tulis `if count > 0 then` secara eksplisit.',
        'Why does Lua make `0` truthy? Because in Lua a number is always a meaningful value, and "no value" has its own type (`nil`). In C, `0` often means "nothing" because C has no special empty value. Lua separates the two ideas, so `if count then` means "if a count exists", not "if the count is non-zero". To test for zero, write `if count > 0 then` explicitly.'),
      P('Gunakan `if x then` **apabila** soalannya ialah "adakah nilai ini wujud?"; gunakan perbandingan eksplisit (`== 0`, `== ""`, `== false`) **apabila** soalannya tentang kandungan nilai.', 'Use `if x then` **when** the question is "does this value exist?"; use an explicit comparison (`== 0`, `== ""`, `== false`) **when** the question is about the value’s content.')),
    S('execution_flow',
      OL(
        ['`describe(false)` dipanggil; `setting` ialah `false`.', '`describe(false)` is called; `setting` is `false`.'],
        ['`setting == nil` dinilai: `false == nil` ialah palsu (jenis berbeza tidak pernah sama).', '`setting == nil` is evaluated: `false == nil` is false (different types are never equal).'],
        ['`setting == false` benar, jadi fungsi memulangkan "explicitly off".', '`setting == false` is true, so the function returns "explicitly off".'],
        ['`print` menerima tiga keputusan dan memaparkannya dengan tab.', '`print` receives the three results and displays them with tabs.'],
      )),
    S('memory_behaviour',
      P('`nil` dan boolean disimpan terus dalam nilai Lua — tiada peruntukan heap. Memadam medan dengan `nil` membebaskan **nilainya** untuk pengutip sampah (jika tiada rujukan lain), tetapi slot dalam bahagian hash table mungkin kekal sehingga table diubah saiz. Untuk table yang sangat besar yang dikosongkan, mencipta table baharu kadang-kadang membebaskan lebih banyak memori daripada memadam setiap kunci.',
        '`nil` and booleans are stored directly inside a Lua value — no heap allocation. Deleting a field with `nil` frees its **value** for the garbage collector (if nothing else refers to it), but the slot in the table’s hash part may remain until the table is resized. For a very large table being emptied, creating a new table sometimes frees more memory than deleting every key.')),
    S('alternative_implementations',
      P('Daripada membandingkan dengan `nil` di merata tempat, fungsi kecil boleh memberi nilai lalai secara eksplisit — dengan selamat untuk `false`:', 'Instead of comparing with `nil` everywhere, a small function can supply defaults explicitly — safely for `false`:'),
      CODE('default-helper', 'lua', 'lua54', ['Pembantu nilai lalai yang menghormati false', 'A default helper that respects false'], `
local function default(value, fallback)
  if value == nil then return fallback end
  return value
end

print(default(nil, 10), default(false, true), default(0, 99))
`, '10\tfalse\t0'),
      EXPLAIN('default-helper',
        ['1–4', 'Fallback hanya digunakan apabila nilai **benar-benar** tiada.', 'The fallback is used only when the value is **really** missing.'],
        ['6', '`nil` → 10; `false` kekal `false`; `0` kekal `0`. Bandingkan dengan `value or fallback`, yang akan menukar `false` kepada `true`.', '`nil` → 10; `false` stays `false`; `0` stays `0`. Compare with `value or fallback`, which would turn `false` into `true`.'])),
    S('common_mistakes',
      UL(
        ['Menulis `if count then` untuk menyemak "bukan sifar" — `0` adalah benar.', 'Writing `if count then` to check "non-zero" — `0` is truthy.'],
        ['Menulis `if name then` untuk menyemak "bukan kosong" — `""` adalah benar.', 'Writing `if name then` to check "not empty" — `""` is truthy.'],
        ['Menggunakan `x or default` untuk boolean — `false or true` ialah `true`.', 'Using `x or default` for booleans — `false or true` is `true`.'],
        ['Menyimpan `nil` dalam senarai dan menjangka `#` atau `ipairs` melepasinya.', 'Storing `nil` in a list and expecting `#` or `ipairs` to step over it.'],
        ['Menulis `True` atau `NULL` (daripada bahasa lain) — ia nama biasa yang bernilai `nil`.', 'Writing `True` or `NULL` (from other languages) — they are ordinary names holding `nil`.'],
      )),
    S('debugging',
      P('Hampir setiap ralat pemula dalam Lua mengandungi perkataan **nil**: `attempt to index a nil value`, `attempt to call a nil value`, `attempt to perform arithmetic on a nil value`. Mesej itu memberitahu bahawa sesuatu yang anda sangka wujud sebenarnya tiada. Tanya: dari mana nilai ini sepatutnya datang? Medan tersalah eja, fungsi yang tidak memulangkan apa-apa, input yang habis — semuanya menghasilkan `nil`. Perbandingan dengan `nil` juga gagal, seperti contoh berikut:',
        'Almost every beginner error in Lua contains the word **nil**: `attempt to index a nil value`, `attempt to call a nil value`, `attempt to perform arithmetic on a nil value`. The message tells you that something you assumed existed is actually missing. Ask: where should this value have come from? A misspelled field, a function that returns nothing, exhausted input — all produce `nil`. Comparisons with `nil` fail too, as in the following example:'),
      CODE('best-score', 'lua', 'lua54', ['Mencari markah terbaik dengan nilai awal', 'Finding the best score with a starting value'], `
local best = nil
for _, score in ipairs({42, 77, 63}) do
  if best == nil or score > best then
    best = score
  end
end
print("best:", best)
`, 'best:\t77', {
        debug: BUG(`
local best = nil
for _, score in ipairs({42, 77, 63}) do
  if score > best then
    best = score
  end
end
print("best:", best)
`, "example:3: attempt to compare nil with number",
          'Pada pusingan pertama `best` masih `nil`, dan `score > best` cuba membandingkan nombor dengan `nil`. Operator `<` dan `>` tidak menerima `nil` (tidak seperti `==`). Perhatikan susunan "nil with number": Lua menilai `a > b` sebagai `b < a`. Betulkan dengan mengendalikan kes pertama: `best == nil or score > best`, seperti versi asal.',
          'On the first pass `best` is still `nil`, and `score > best` tries to compare a number with `nil`. The `<` and `>` operators do not accept `nil` (unlike `==`). Notice the order "nil with number": Lua evaluates `a > b` as `b < a`. Fix it by handling the first case: `best == nil or score > best`, as in the original version.'),
      }),
      EXPLAIN('best-score',
        ['1', '`best` bermula sebagai "belum ada markah".', '`best` starts as "no score yet".'],
        ['2–6', '`best == nil or …` memintas perbandingan pada pusingan pertama; selepas itu markah lebih tinggi menggantikan `best`.', '`best == nil or …` short-circuits the comparison on the first pass; afterwards a higher score replaces `best`.'],
        ['7', 'Markah terbaik ialah 77.', 'The best score is 77.'])),
    S('performance',
      P('Ujian truthiness ialah antara operasi paling murah dalam Lua — satu semakan tag. `x == nil` sama murah. Tiada sebab prestasi untuk memilih satu bentuk berbanding yang lain; pilih yang menyatakan niat dengan tepat.',
        'A truthiness test is among the cheapest operations in Lua — one tag check. `x == nil` is just as cheap. There is no performance reason to prefer one form over the other; choose the one that states your intent precisely.')),
    S('software_engineering',
      P('Pepijat nilai lalai yang terkenal: pilihan boolean yang lalainya `true`.', 'A famous default-value bug: a boolean option whose default is `true`.'),
      CODE('poor-or-default', 'lua', 'lua54', ['Pelaksanaan lemah: or untuk lalai boolean', 'Poor implementation: or for a boolean default'], `
local function startServer(options)
  local logging = options.logging or true
  return "logging=" .. tostring(logging)
end

print(startServer({}), startServer({logging = false}))
`, 'logging=true\tlogging=true'),
      EXPLAIN('poor-or-default',
        ['1–4', '`options.logging or true`: jika pengguna menghantar `false`, `false or true` memberi `true`. Pengguna **tidak boleh** mematikan logging.', '`options.logging or true`: if the user passes `false`, `false or true` gives `true`. The user **cannot** turn logging off.'],
        ['6', 'Kedua-dua panggilan memberi `logging=true` — pepijat senyap.', 'Both calls give `logging=true` — a silent bug.']),
      CODE('improved-nil-check', 'lua', 'lua54', ['Pelaksanaan lebih baik: semak nil secara eksplisit', 'Improved implementation: an explicit nil check'], `
local function startServer(options)
  local logging = options.logging
  if logging == nil then
    logging = true
  end
  return "logging=" .. tostring(logging)
end

print(startServer({}), startServer({logging = false}))
`, 'logging=true\tlogging=false'),
      EXPLAIN('improved-nil-check',
        ['1–2', 'Baca pilihan seperti yang diberi.', 'Read the option as given.'],
        ['3–5', 'Gunakan lalai **hanya** apabila pilihan tidak ditetapkan.', 'Apply the default **only** when the option is not set.'],
        ['6–9', 'Kini `false` dihormati.', 'Now `false` is respected.']),
      P('Peraturan praktikal: `x or default` selamat untuk nombor, string dan table, tetapi **tidak** untuk boolean. Untuk boolean, sentiasa semak `== nil`.', 'A practical rule: `x or default` is safe for numbers, strings and tables, but **not** for booleans. For booleans, always check `== nil`.')),
    S('industry_use_cases',
      UL(
        ['Fail konfigurasi Neovim membezakan pilihan yang tidak ditetapkan (`nil`, guna lalai) dan pilihan yang dimatikan (`false`).', 'Neovim configuration distinguishes options that are not set (`nil`, use the default) from options that are switched off (`false`).'],
        ['Pustaka JSON Lua menggunakan nilai khas (contohnya `json.null`) kerana `nil` tidak boleh disimpan dalam table.', 'Lua JSON libraries use a special value (for example `json.null`) because `nil` cannot be stored in a table.'],
        ['Sistem simpanan permainan memadam medan dengan `nil` untuk mengecilkan data yang disimpan.', 'Game save systems delete fields with `nil` to shrink the saved data.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `falsy-values` dan ramalkan output sebelum melihatnya.', 'Run `falsy-values` and predict the output before looking.'],
        ['Tukar `startServer` lemah supaya menerima `false` dengan betul, tanpa melihat versi lebih baik.', 'Fix the poor `startServer` so it accepts `false` correctly, without looking at the improved version.'],
        ['Jalankan versi berpepijat `best-score` dan terangkan susunan "nil with number".', 'Run the buggy version of `best-score` and explain the order "nil with number".'],
      )),
    S('mini_project',
      P('**Pengesah profil.** Untuk setiap profil pengguna, laporkan medan yang tiada (`nil`), medan yang dimatikan (`false`) dan medan yang kosong (`""`) — tiga keadaan yang berbeza.', '**A profile validator.** For each user profile, report fields that are missing (`nil`), switched off (`false`) and empty (`""`) — three different states.'),
      CODE('profile-check', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local fields = {"name", "email", "newsletter"}
local profile = {name = "Mei", email = "", newsletter = false}

for _, field in ipairs(fields) do
  local value = profile[field]
  local state
  if value == nil then state = "missing"
  elseif value == false then state = "off"
  elseif value == "" then state = "empty"
  else state = "ok: " .. tostring(value) end
  print(field, state)
end
`, 'name\tok: Mei\nemail\tempty\nnewsletter\toff'),
      EXPLAIN('profile-check',
        ['1–2', 'Senarai medan yang dijangka dan satu profil.', 'The list of expected fields and one profile.'],
        ['4–6', 'Untuk setiap medan, baca nilainya dan sediakan pemboleh ubah keadaan.', 'For each field, read its value and prepare a state variable.'],
        ['7–10', 'Empat cabang membezakan `nil`, `false`, string kosong dan nilai biasa — sesuatu yang `if value then` tidak dapat lakukan.', 'Four branches tell `nil`, `false`, the empty string and an ordinary value apart — something `if value then` cannot do.'],
        ['11', 'Paparkan keputusan.', 'Display the result.'])),
    S('summary',
      UL(
        ['`nil` bermaksud tiada nilai; memberinya kepada medan memadam medan itu.', '`nil` means no value; assigning it to a field deletes the field.'],
        ['Hanya `nil` dan `false` adalah palsu; `0` dan `""` adalah benar.', 'Only `nil` and `false` are falsy; `0` and `""` are truthy.'],
        ['`x == nil` dan `not x` berbeza apabila `x` ialah `false`.', '`x == nil` and `not x` differ when `x` is `false`.'],
        ['Jangan gunakan `x or default` untuk boolean.', 'Do not use `x or default` for booleans.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah output `print(0 and "yes" or "no")`?', 'What is the output of `print(0 and "yes" or "no")`?'],
        ['Bagaimanakah anda memadam medan `level` daripada table `player`?', 'How do you delete the `level` field from the `player` table?'],
        ['Mengapakah `nil < 5` ialah ralat tetapi `nil == 5` tidak?', 'Why is `nil < 5` an error but `nil == 5` is not?'],
        ['Apakah yang salah dengan `local sound = cfg.sound or true`?', 'What is wrong with `local sound = cfg.sound or true`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §2.1 — Values and Types', url: `${MANUAL}#2.1` },
        { title: 'Lua 5.4 Reference Manual §3.4.5 — Logical Operators', url: `${MANUAL}#3.4.5` },
        { title: 'Programming in Lua (1st ed.) — 2.1 Nil and 2.2 Booleans', url: `${PIL}/2.2.html` },
        { title: 'Lua 5.4 Reference Manual §3.4.4 — Relational Operators', url: `${MANUAL}#3.4.4` },
      )),
  ],
};

// ─── 2.2 number: the integer and float subtypes (5.3+) ──────────────────────

export const LUA102_2_2: LectureContentDef = {
  courseCode: 'LUA102',
  module: 2,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Membezakan [[number-subtype|subjenis integer dan float]] dengan `math.type`.', 'Distinguish the [[number-subtype|integer and float subtypes]] with `math.type`.'],
        ['Meramal subjenis hasil setiap operator aritmetik.', 'Predict the subtype of each arithmetic operator’s result.'],
        ['Menerangkan mengapa `0.1 + 0.2 ~= 0.3` dan cara membandingkan float dengan selamat.', 'Explain why `0.1 + 0.2 ~= 0.3` and how to compare floats safely.'],
        ['Menukar antara float dan integer dengan `math.tointeger`, `math.floor` dan `//`.', 'Convert between floats and integers with `math.tointeger`, `math.floor` and `//`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['LUA101 1.3: Lua 5.3 memperkenalkan integer.', 'LUA101 1.3: Lua 5.3 introduced integers.'],
        ['LUA101 2.1: `math.maxinteger` dan limpahan.', 'LUA101 2.1: `math.maxinteger` and overflow.'],
        ['Pecahan dan perpuluhan asas.', 'Basic fractions and decimals.'],
      )),
    S('introduction',
      P('Lua mempunyai satu jenis nombor, `number`, tetapi sejak 5.3 jenis itu mempunyai dua **subjenis**: integer (nombor bulat yang tepat) dan float (nombor nyata yang dianggarkan). Kebanyakan masa anda tidak perlu memikirkannya — `3 == 3.0` adalah benar. Tetapi subjenis kelihatan dalam output (`3` berbanding `3.0`), menentukan ketepatan, dan penting untuk wang, indeks dan pengiraan saintifik.',
        'Lua has one number type, `number`, but since 5.3 that type has two **subtypes**: integers (exact whole numbers) and floats (approximate real numbers). Most of the time you need not think about it — `3 == 3.0` is true. But the subtype shows in output (`3` versus `3.0`), decides precision, and matters for money, indexes and scientific calculations.'),
      KEY('Integer: **tepat** tetapi bulat. Float: **pecahan** tetapi dianggarkan.', 'Integers: **exact** but whole. Floats: **fractional** but approximate.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Integer:** 64-bit bertanda, dari `math.mininteger` hingga `math.maxinteger`. Literal tanpa titik: `42`, `0xFF`.', '**Integer:** signed 64-bit, from `math.mininteger` to `math.maxinteger`. Literals without a dot: `42`, `0xFF`.'],
        ['**Float:** IEEE 754 dwi ketepatan, kira-kira 15–16 digit bererti. Literal dengan titik atau eksponen: `3.0`, `1e3`.', '**Float:** IEEE 754 double precision, about 15–16 significant digits. Literals with a dot or exponent: `3.0`, `1e3`.'],
        ['`+ - * // %` dengan dua integer → integer; jika salah satu float → float.', '`+ - * // %` with two integers → integer; if either is a float → float.'],
        ['`/` dan `^` **sentiasa** memberi float.', '`/` and `^` **always** give a float.'],
        ['Perbandingan merentas subjenis berfungsi mengikut nilai: `1 == 1.0`, `2 < 2.5`.', 'Comparisons across subtypes work by value: `1 == 1.0`, `2 < 2.5`.'],
      )),
    S('detailed_theory',
      P('Float disimpan dalam **binari**, dan kebanyakan pecahan perpuluhan tidak mempunyai perwakilan binari yang tepat — sama seperti 1/3 tidak boleh ditulis tepat dalam perpuluhan. `0.1` sebenarnya disimpan sebagai 0.1000000000000000055511…, jadi `0.1 + 0.2` menjadi 0.30000000000000004. `print` menyembunyikan butiran ini kerana `tostring` menggunakan format `%.14g` (14 digit bererti), yang membundarkannya kepada `0.3`. Namun perbandingan `==` melihat nilai sebenar, jadi `0.1 + 0.2 == 0.3` adalah palsu.',
        'Floats are stored in **binary**, and most decimal fractions have no exact binary representation — just as 1/3 cannot be written exactly in decimal. `0.1` is actually stored as 0.1000000000000000055511…, so `0.1 + 0.2` becomes 0.30000000000000004. `print` hides this detail because `tostring` uses the `%.14g` format (14 significant digits), which rounds it to `0.3`. But `==` compares the real values, so `0.1 + 0.2 == 0.3` is false.'),
      P('Integer tidak mempunyai masalah ini: ia tepat dalam julatnya. Itulah sebabnya aplikasi kewangan menyimpan wang sebagai **sen integer** (RM12.50 = 1250 sen). Float pula mampu mewakili nombor sangat besar dan sangat kecil (sehingga kira-kira 10³⁰⁸), tetapi hanya mewakili integer dengan tepat hingga 2⁵³. Penukaran float ke integer hanya berjaya jika float itu tiada bahagian pecahan: `math.tointeger(3.0)` memberi `3`, tetapi `math.tointeger(3.5)` memberi `nil`.',
        'Integers have no such problem: they are exact within their range. That is why financial applications store money as **integer cents** (RM12.50 = 1250 cents). Floats can represent very large and very small numbers (up to about 10³⁰⁸), but only represent integers exactly up to 2⁵³. Converting a float to an integer only succeeds if the float has no fractional part: `math.tointeger(3.0)` gives `3`, but `math.tointeger(3.5)` gives `nil`.')),
    S('technical_terminology', TERMS('number-subtype', 'operator', 'coercion', 'variable')),
    S('syntax_rules',
      UL(
        ['`math.type(x)` → `"integer"`, `"float"`, atau `nil` jika bukan nombor.', '`math.type(x)` → `"integer"`, `"float"`, or `nil` if not a number.'],
        ['`math.tointeger(x)` → integer, atau `nil` jika `x` mempunyai pecahan.', '`math.tointeger(x)` → an integer, or `nil` if `x` has a fraction.'],
        ['`math.floor(x)` / `math.ceil(x)` → bundar ke bawah/atas, memulangkan integer jika muat.', '`math.floor(x)` / `math.ceil(x)` → round down/up, returning an integer if it fits.'],
        ['`string.format("%d", x)` memerlukan nilai tanpa pecahan; `"%.2f"` untuk dua tempat perpuluhan.', '`string.format("%d", x)` needs a value with no fraction; `"%.2f"` for two decimal places.'],
      )),
    S('code_demonstration',
      CODE('result-types', 'lua', 'lua54', ['Subjenis hasil setiap operator', 'The result subtype of each operator'], `
print(7 + 2, 7 + 2.0, 7 * 3)
print(7 / 7, 7 // 2, 7.0 // 2)
print(2 ^ 2, 7 % 3, 7.5 % 2)
print(math.type(7 // 2), math.type(7 / 7))
`, '9\t9.0\t21\n1.0\t3\t3.0\n4.0\t1\t1.5\ninteger\tfloat'),
      EXPLAIN('result-types',
        ['1', 'Dua integer → integer (9, 21); satu float → float (9.0).', 'Two integers → integer (9, 21); one float → float (9.0).'],
        ['2', '`/` sentiasa float: 7 / 7 = 1.0. `//` dengan integer kekal integer (3); dengan float menjadi float (3.0).', '`/` is always float: 7 / 7 = 1.0. `//` with integers stays integer (3); with a float it becomes float (3.0).'],
        ['3', '`^` sentiasa float (4.0). `%` mengikut peraturan yang sama seperti `//`: 1 (integer), 1.5 (float).', '`^` is always float (4.0). `%` follows the same rule as `//`: 1 (integer), 1.5 (float).'],
        ['4', 'Pengesahan subjenis dengan `math.type`.', 'Confirming the subtypes with `math.type`.'])),
    S('complete_examples',
      CODE('float-precision', 'lua', 'lua54', ['Ketepatan float', 'Float precision'], `
local sum = 0.1 + 0.2
print(sum, sum == 0.3)
print(string.format("%.17g", sum))
print(math.abs(sum - 0.3) < 1e-9)
`, '0.3\tfalse\n0.30000000000000004\ntrue'),
      EXPLAIN('float-precision',
        ['1', '0.1 dan 0.2 tidak boleh diwakili tepat dalam binari; jumlahnya hampir, tetapi bukan tepat, 0.3.', '0.1 and 0.2 cannot be represented exactly in binary; their sum is close to, but not exactly, 0.3.'],
        ['2', '`print` membundarkan kepada 14 digit dan memaparkan `0.3`, tetapi `==` mengatakan `false`.', '`print` rounds to 14 digits and shows `0.3`, but `==` says `false`.'],
        ['3', '`%.17g` memaparkan cukup digit untuk melihat nilai sebenar.', '`%.17g` shows enough digits to see the real value.'],
        ['4', 'Cara selamat membandingkan float: periksa sama ada perbezaannya lebih kecil daripada toleransi (epsilon).', 'The safe way to compare floats: check whether their difference is smaller than a tolerance (epsilon).']),
      CODE('conversions', 'lua', 'lua54', ['Menukar antara float dan integer', 'Converting between floats and integers'], `
print(math.tointeger(3.0), math.tointeger(3.5))
print(math.floor(3.7), math.ceil(3.2), math.floor(-3.7))
print(0xFF, 1e3, 2^53)
print(string.format("%d items, %.2f each", 3.0, 2.5))
`, '3\tnil\n3\t4\t-4\n255\t1000.0\t9.007199254741e+15\n3 items, 2.50 each', {
        debug: BUG(`
print(math.tointeger(3.0), math.tointeger(3.5))
print(math.floor(3.7), math.ceil(3.2), math.floor(-3.7))
print(0xFF, 1e3, 2^53)
print(string.format("%d items, %.2f each", 3.5, 2.5))
`, "example:4: bad argument #2 to 'format' (number has no integer representation)",
          '`%d` memerlukan nombor tanpa bahagian pecahan. `3.0` diterima (ia boleh ditukar tepat kepada integer 3), tetapi `3.5` tidak. Mesej menyebut **argumen #2** — `%d` ialah penanda pertama, jadi ia sepadan dengan argumen kedua `format`. Gunakan `math.floor` untuk membundarkan secara sengaja, atau `%g`/`%.1f` untuk memaparkan pecahan.',
          '`%d` needs a number with no fractional part. `3.0` is accepted (it converts exactly to the integer 3), but `3.5` is not. The message names **argument #2** — `%d` is the first placeholder, so it matches `format`’s second argument. Use `math.floor` to round deliberately, or `%g`/`%.1f` to show the fraction.'),
      }),
      EXPLAIN('conversions',
        ['1', '`math.tointeger` hanya berjaya untuk float tanpa pecahan; jika tidak `nil`.', '`math.tointeger` only succeeds for floats without a fraction; otherwise `nil`.'],
        ['2', '`floor` membundar ke **bawah** (−3.7 → −4, bukan −3); `ceil` membundar ke atas. Kedua-duanya memulangkan integer.', '`floor` rounds **down** (−3.7 → −4, not −3); `ceil` rounds up. Both return integers.'],
        ['3', 'Literal heksadesimal ialah integer; notasi saintifik `1e3` ialah float; `2^53` ialah float besar yang dipaparkan dalam notasi saintifik oleh `%.14g`.', 'A hexadecimal literal is an integer; scientific notation `1e3` is a float; `2^53` is a large float shown in scientific notation by `%.14g`.'],
        ['4', '`%d` menerima float 3.0 kerana ia mempunyai perwakilan integer; `%.2f` memformat 2.5 sebagai 2.50.', '`%d` accepts the float 3.0 because it has an integer representation; `%.2f` formats 2.5 as 2.50.'])),
    S('line_by_line',
      EXPLAIN('result-types',
        ['2', 'Peraturan mudah: hanya `/` dan `^` "memaksa" float. Operator lain mengekalkan integer apabila kedua-dua operan integer.', 'A simple rule: only `/` and `^` "force" floats. The other operators keep integers when both operands are integers.']),
      EXPLAIN('float-precision',
        ['4', 'Pilih epsilon mengikut skala data: 1e-9 sesuai untuk nilai sekitar 1; untuk nilai berjuta, gunakan toleransi relatif.', 'Choose the epsilon to suit the data’s scale: 1e-9 suits values around 1; for values in the millions, use a relative tolerance.'])),
    S('why_this_way',
      P('Mengapa dua subjenis dan bukannya satu? Sebelum 5.3, semua nombor Lua ialah float, jadi integer besar (ID pangkalan data, cap masa dalam nanosaat, operasi bit) kehilangan ketepatan selepas 2⁵³. Menambah integer 64-bit menyelesaikan masalah itu tanpa memecahkan kod yang menggunakan pecahan. Mengapa `/` sentiasa float? Supaya `7 / 2` sentiasa 3.5 — pembahagian tidak "diam-diam" membuang pecahan seperti dalam C.',
        'Why two subtypes instead of one? Before 5.3, all Lua numbers were floats, so large integers (database IDs, nanosecond timestamps, bit operations) lost precision beyond 2⁵³. Adding 64-bit integers solved that without breaking code that uses fractions. Why is `/` always float? So `7 / 2` is always 3.5 — division never "silently" drops the fraction as in C.'),
      P('Gunakan integer **apabila** nilai mesti tepat dan bulat (kiraan, indeks, wang dalam sen, ID); gunakan float **apabila** nilai secara semula jadi berpecahan (ukuran, purata, fizik).', 'Use integers **when** values must be exact and whole (counts, indexes, money in cents, IDs); use floats **when** values are naturally fractional (measurements, averages, physics).')),
    S('execution_flow',
      OL(
        ['Penghurai membaca literal `0.1` dan `0.2`, menukar setiap satu kepada float binari terdekat.', 'The parser reads the literals `0.1` and `0.2`, converting each to the nearest binary float.'],
        ['Semasa runtime, `ADD` menjumlahkan dua float dan membundarkan ke float terdekat: 0.30000000000000004.', 'At run time, `ADD` sums the two floats and rounds to the nearest float: 0.30000000000000004.'],
        ['`sum == 0.3` membandingkan dua float berbeza → `false`.', '`sum == 0.3` compares two different floats → `false`.'],
        ['`print` memanggil `tostring`, yang memformat dengan `%.14g` → "0.3".', '`print` calls `tostring`, which formats with `%.14g` → "0.3".'],
      )),
    S('memory_behaviour',
      P('Kedua-dua subjenis menggunakan 8 bait dalam nilai Lua dan tidak memerlukan heap, jadi aritmetik tidak menghasilkan sampah. Tag nilai merekodkan subjenis, itulah cara `math.type` mengetahuinya. Table yang menyimpan berjuta nombor menggunakan memori yang sama sama ada nombor itu integer atau float.',
        'Both subtypes use 8 bytes inside a Lua value and need no heap, so arithmetic produces no garbage. The value’s tag records the subtype, which is how `math.type` knows it. A table holding millions of numbers uses the same memory whether they are integers or floats.')),
    S('alternative_implementations',
      P('Untuk membundarkan kepada integer terdekat (bukan ke bawah), tambah 0.5 dan gunakan `floor` — atau gunakan `string.format` untuk paparan sahaja:', 'To round to the nearest integer (not down), add 0.5 and use `floor` — or use `string.format` for display only:'),
      CODE('rounding', 'lua', 'lua54', ['Membundarkan ke integer terdekat', 'Rounding to the nearest integer'], `
local function round(x)
  return math.floor(x + 0.5)
end

print(round(2.4), round(2.5), round(-2.5))
print(string.format("%.0f", 2.4), string.format("%.1f", 3.14159))
`, '2\t3\t-2\n2\t3.1'),
      EXPLAIN('rounding',
        ['1–3', 'Menambah 0.5 kemudian membundar ke bawah memberi bundaran "separuh ke atas".', 'Adding 0.5 then rounding down gives "round half up".'],
        ['5', '2.4 → 2, 2.5 → 3, −2.5 → −2 (kerana −2.0 dibundar ke bawah ialah −2). Bundaran nombor negatif memerlukan perhatian.', '2.4 → 2, 2.5 → 3, −2.5 → −2 (because −2.0 rounded down is −2). Rounding negative numbers needs care.'],
        ['6', '`%.0f` dan `%.1f` membundarkan untuk **paparan** sahaja dan memulangkan string, bukan nombor.', '`%.0f` and `%.1f` round for **display** only and return strings, not numbers.'])),
    S('common_mistakes',
      UL(
        ['Membandingkan hasil float dengan `==` (`0.1 * 3 == 0.3` adalah palsu).', 'Comparing float results with `==` (`0.1 * 3 == 0.3` is false).'],
        ['Menyimpan wang sebagai float dan mendapat ralat pembundaran dalam jumlah.', 'Storing money as floats and getting rounding errors in totals.'],
        ['Menjangka `7 / 2` memberi 3 — gunakan `7 // 2`.', 'Expecting `7 / 2` to give 3 — use `7 // 2`.'],
        ['Menggunakan float sebagai indeks table: `t[1.5]` ialah kunci berbeza daripada `t[1]`, tetapi `t[1.0]` sama dengan `t[1]`.', 'Using floats as table indexes: `t[1.5]` is a different key from `t[1]`, but `t[1.0]` is the same as `t[1]`.'],
        ['Menghantar float berpecahan kepada `%d`.', 'Passing a fractional float to `%d`.'],
      )),
    S('debugging',
      P('Pepijat nombor jarang menghasilkan ralat — ia menghasilkan **jawapan yang sedikit salah**. Apabila jumlah tidak sepadan atau perbandingan gagal secara misteri, cetak nilai dengan `string.format("%.17g", x)` untuk melihat digit sebenar, dan `math.type(x)` untuk melihat subjenis. Ralat sebenar biasanya datang daripada fungsi yang memerlukan integer, seperti `%d` dalam contoh `conversions`, atau daripada `math.tointeger` yang memulangkan `nil`:',
        'Number bugs rarely produce errors — they produce **slightly wrong answers**. When totals do not match or comparisons mysteriously fail, print the value with `string.format("%.17g", x)` to see the real digits, and `math.type(x)` to see the subtype. Real errors usually come from functions that require integers, such as `%d` in the `conversions` example, or from `math.tointeger` returning `nil`:'),
      CODE('pages-needed', 'lua', 'lua54', ['Bilangan halaman yang diperlukan', 'The number of pages needed'], `
local items, perPage = 23, 10
local pages = math.ceil(items / perPage)
print(pages, math.type(pages))
`, '3\tinteger', {
        debug: BUG(`
local items, perPage = 23, 10
local pages = math.tointeger(items / perPage)
print(pages + 1)
`, "example:3: attempt to perform arithmetic on a nil value (local 'pages')",
          '`23 / 10` ialah float 2.3. `math.tointeger(2.3)` memulangkan `nil` kerana 2.3 mempunyai pecahan — ia **tidak** membundarkan. Ralat muncul pada baris 3 apabila `nil` digunakan. Untuk "bilangan halaman", anda perlu membundar ke atas: `math.ceil(items / perPage)`.',
          '`23 / 10` is the float 2.3. `math.tointeger(2.3)` returns `nil` because 2.3 has a fraction — it does **not** round. The error appears on line 3 when the `nil` is used. For "the number of pages", you need to round up: `math.ceil(items / perPage)`.'),
      }),
      EXPLAIN('pages-needed',
        ['1', '23 item, 10 setiap halaman.', '23 items, 10 per page.'],
        ['2', '23 / 10 = 2.3; `math.ceil` membundar ke atas kepada integer 3.', '23 / 10 = 2.3; `math.ceil` rounds up to the integer 3.'],
        ['3', 'Tiga halaman, subjenis integer.', 'Three pages, integer subtype.'])),
    S('performance',
      P('Aritmetik integer dan float sama-sama pantas pada CPU moden. Penukaran berulang antara subjenis dalam gelung yang sangat kerap mempunyai kos kecil. Lebih penting daripada kelajuan ialah **ketepatan**: integer untuk nilai tepat, float untuk nilai berpecahan.',
        'Integer and float arithmetic are equally fast on modern CPUs. Repeated conversion between subtypes in very hot loops has a small cost. More important than speed is **correctness**: integers for exact values, floats for fractional ones.')),
    S('software_engineering',
      P('Bandingkan dua cara menjumlahkan harga dalam troli beli-belah:', 'Compare two ways of totalling prices in a shopping cart:'),
      CODE('poor-float-money', 'lua', 'lua54', ['Pelaksanaan lemah: wang sebagai float', 'Poor implementation: money as floats'], `
local prices = {0.10, 0.10, 0.10}
local total = 0
for _, p in ipairs(prices) do total = total + p end
print(total == 0.30, string.format("%.17g", total))
`, 'false\t0.30000000000000004'),
      EXPLAIN('poor-float-money',
        ['1–3', 'Tiga barangan 10 sen dijumlahkan sebagai float.', 'Three 10-cent items summed as floats.'],
        ['4', 'Jumlahnya bukan tepat 0.30 — perbandingan gagal, dan selepas ribuan transaksi ralat terkumpul.', 'The total is not exactly 0.30 — the comparison fails, and over thousands of transactions the error accumulates.']),
      CODE('improved-cents', 'lua', 'lua54', ['Pelaksanaan lebih baik: wang sebagai sen integer', 'Improved implementation: money as integer cents'], `
local pricesInCents = {10, 10, 10}
local totalCents = 0
for _, c in ipairs(pricesInCents) do totalCents = totalCents + c end
print(totalCents == 30, string.format("RM%d.%02d", totalCents // 100, totalCents % 100))
`, 'true\tRM0.30'),
      EXPLAIN('improved-cents',
        ['1–3', 'Harga disimpan sebagai integer sen; penjumlahan integer adalah tepat.', 'Prices are stored as integer cents; integer addition is exact.'],
        ['4', 'Perbandingan tepat berjaya. `//` dan `%` memisahkan ringgit dan sen untuk paparan; `%02d` menambah sifar di hadapan.', 'The exact comparison succeeds. `//` and `%` split ringgit and cents for display; `%02d` adds a leading zero.']),
      P('Ini ialah amalan standard industri: sistem pembayaran, bank dan kedai dalam talian menyimpan amaun dalam unit terkecil sebagai integer. Tukar kepada paparan perpuluhan hanya di tepi sistem (antara muka pengguna, laporan).', 'This is standard industry practice: payment systems, banks and online shops store amounts in the smallest unit as integers. Convert to a decimal display only at the edges of the system (user interface, reports).')),
    S('industry_use_cases',
      UL(
        ['Sistem pembayaran menyimpan amaun dalam sen integer untuk mengelak ralat pembundaran.', 'Payment systems store amounts in integer cents to avoid rounding errors.'],
        ['Enjin permainan menggunakan float untuk kedudukan dan halaju, dengan perbandingan toleransi.', 'Game engines use floats for positions and velocities, with tolerance comparisons.'],
        ['Pangkalan data dan API memulangkan ID 64-bit yang memerlukan subjenis integer Lua 5.3+ untuk kekal tepat.', 'Databases and APIs return 64-bit IDs that need Lua 5.3+’s integer subtype to stay exact.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `result-types` dan tulis peraturan subjenis untuk setiap operator dengan perkataan anda sendiri.', 'Run `result-types` and write the subtype rule for each operator in your own words.'],
        ['Dalam `float-precision`, cuba `0.5 + 0.25 == 0.75` — mengapa ia benar? (Petunjuk: pecahan dengan penyebut kuasa dua.)', 'In `float-precision`, try `0.5 + 0.25 == 0.75` — why is it true? (Hint: fractions with power-of-two denominators.)'],
        ['Jalankan versi berpepijat `conversions` dan `pages-needed`.', 'Run the buggy versions of `conversions` and `pages-needed`.'],
      )),
    S('mini_project',
      P('**Kalkulator bil restoran.** Jumlahkan item dalam sen integer, tambah cukai perkhidmatan 6% yang dibundarkan ke sen terdekat, dan bahagikan sama rata antara rakan dengan baki dikendalikan dengan betul.', '**A restaurant bill calculator.** Total items in integer cents, add a 6% service tax rounded to the nearest cent, and split the bill evenly between friends with the remainder handled correctly.'),
      CODE('bill-split', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local itemsCents = {1250, 890, 1575}
local people = 3

local subtotal = 0
for _, c in ipairs(itemsCents) do subtotal = subtotal + c end
local tax = math.floor(subtotal * 0.06 + 0.5)
local total = subtotal + tax

local share, leftover = total // people, total % people
print(string.format("total RM%.2f", total / 100))
print(string.format("each RM%.2f, plus %d cent(s) for one person", share / 100, leftover))
`, 'total RM39.38\neach RM13.12, plus 2 cent(s) for one person'),
      EXPLAIN('bill-split',
        ['1–2', 'Harga dalam sen dan bilangan orang.', 'Prices in cents and the number of people.'],
        ['4–5', 'Jumlah kecil integer: 3715 sen.', 'The integer subtotal: 3715 cents.'],
        ['6', 'Cukai 6% = 222.9 sen; `floor(x + 0.5)` membundar ke 223 sen — sekarang integer semula.', 'The 6% tax = 222.9 cents; `floor(x + 0.5)` rounds to 223 cents — an integer again.'],
        ['7', 'Jumlah: 3938 sen.', 'The total: 3938 cents.'],
        ['9', '`//` dan `%` memberi bahagian sama rata (1312) dan baki (2) — tiada sen hilang.', '`//` and `%` give the equal share (1312) and the remainder (2) — no cent is lost.'],
        ['10–11', 'Tukar kepada ringgit hanya untuk paparan.', 'Convert to ringgit only for display.'])),
    S('summary',
      UL(
        ['`number` mempunyai subjenis integer (tepat) dan float (dianggarkan).', '`number` has an integer subtype (exact) and a float subtype (approximate).'],
        ['`/` dan `^` sentiasa memberi float; operator lain mengekalkan integer jika kedua-dua operan integer.', '`/` and `^` always give floats; other operators keep integers when both operands are integers.'],
        ['Jangan bandingkan float dengan `==`; gunakan toleransi.', 'Do not compare floats with `==`; use a tolerance.'],
        ['Simpan wang dalam integer sen; tukar hanya untuk paparan.', 'Store money in integer cents; convert only for display.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah subjenis `10 // 3` dan `10 / 2`?', 'What are the subtypes of `10 // 3` and `10 / 2`?'],
        ['Mengapakah `print(0.1 + 0.2)` memaparkan `0.3` walaupun nilainya bukan tepat 0.3?', 'Why does `print(0.1 + 0.2)` display `0.3` although the value is not exactly 0.3?'],
        ['Apakah yang dipulangkan oleh `math.tointeger(4.0)` dan `math.tointeger(4.2)`?', 'What do `math.tointeger(4.0)` and `math.tointeger(4.2)` return?'],
        ['Bagaimanakah anda menyimpan RM19.99 tanpa ralat pembundaran?', 'How would you store RM19.99 without rounding errors?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §2.1 — Values and Types (integer and float)', url: `${MANUAL}#2.1` },
        { title: 'Lua 5.4 Reference Manual §3.4.1 — Arithmetic Operators', url: `${MANUAL}#3.4.1` },
        { title: 'Lua 5.4 Reference Manual — math.tointeger and math.type', url: `${MANUAL}#pdf-math.tointeger` },
        { title: 'What Every Programmer Should Know About Floating-Point Arithmetic', url: 'https://floating-point-gui.de/' },
      )),
  ],
};

// ─── 2.3 string, table, function, userdata and thread: an overview ─────────

export const LUA102_2_3: LectureContentDef = {
  courseCode: 'LUA102',
  module: 2,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menamakan lapan jenis Lua dan mengenal pasti setiap satu dengan `type`.', 'Name Lua’s eight types and identify each with `type`.'],
        ['Membezakan jenis **nilai** (string, number, boolean) dan jenis **rujukan** (table, function, userdata, thread).', 'Distinguish **value-like** types (string, number, boolean) from **reference** types (table, function, userdata, thread).'],
        ['Menerangkan peranan [[userdata]] dan thread secara ringkas.', 'Briefly explain the roles of [[userdata]] and threads.'],
        ['Menulis semakan jenis yang betul menggunakan `type`.', 'Write correct type checks using `type`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1 dan 2.2: nil, boolean dan number.', 'Lectures 2.1 and 2.2: nil, boolean and number.'],
        ['LUA101: table dan fungsi sebagai nilai.', 'LUA101: tables and functions as values.'],
      )),
    S('introduction',
      P('Lua mempunyai tepat **lapan** jenis: `nil`, `boolean`, `number`, `string`, `table`, `function`, `userdata` dan `thread`. Tiga yang pertama sudah dikaji. Kuliah ini memberi gambaran lima yang lain — cukup untuk mengenali dan menggunakannya dengan selamat. Setiap satu dikaji dengan mendalam dalam kursus kemudian: string dalam LUA113, table dalam LUA111–112, fungsi dalam LUA104, thread (coroutine) dalam LUA221.',
        'Lua has exactly **eight** types: `nil`, `boolean`, `number`, `string`, `table`, `function`, `userdata` and `thread`. The first three have been covered. This lecture gives an overview of the other five — enough to recognise and use them safely. Each is studied in depth in later courses: strings in LUA113, tables in LUA111–112, functions in LUA104, threads (coroutines) in LUA221.'),
      KEY('Pemboleh ubah tidak mempunyai jenis; **nilai** mempunyai jenis. `type(x)` memberitahu jenis nilai semasa `x`.', 'Variables have no type; **values** do. `type(x)` tells the type of the value currently in `x`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**string:** jujukan bait yang tidak boleh diubah. Operasi seperti `upper` mencipta string baharu.', '**string:** an immutable sequence of bytes. Operations such as `upper` create a new string.'],
        ['**[[table]]:** satu-satunya struktur data — array, dictionary, objek. Pemboleh ubah memegang **rujukan** kepadanya.', '**[[table]]:** the only data structure — array, dictionary, object. Variables hold a **reference** to it.'],
        ['**[[function]]:** nilai kelas pertama; boleh disimpan, dihantar dan dipulangkan.', '**[[function]]:** a first-class value; it can be stored, passed and returned.'],
        ['**[[userdata]]:** data milik C (contohnya fail daripada `io`); Lua hanya boleh menggunakannya melalui operasi yang disediakan.', '**[[userdata]]:** data owned by C (for example files from `io`); Lua can only use it through the operations provided.'],
        ['**thread:** [[coroutine]] — aliran pelaksanaan yang boleh dijeda (`yield`) dan disambung semula (`resume`).', '**thread:** a [[coroutine]] — a line of execution that can be paused (`yield`) and resumed (`resume`).'],
      )),
    S('detailed_theory',
      P('Perbezaan paling penting antara jenis ialah **semantik nilai** berbanding **semantik rujukan**. Apabila anda menyalin pemboleh ubah yang memegang nombor, boolean atau string, anda mendapat nilai yang tidak boleh terjejas oleh pemboleh ubah asal — string pun selamat kerana ia tidak boleh diubah. Tetapi table, function, userdata dan thread ialah **objek** dalam heap: menyalin pemboleh ubah hanya menyalin rujukan, jadi kedua-dua pemboleh ubah menunjuk ke objek yang **sama**. Mengubah table melalui satu pemboleh ubah kelihatan melalui yang lain.',
        'The most important difference between types is **value semantics** versus **reference semantics**. When you copy a variable holding a number, boolean or string, you get a value the original variable can never affect — strings are safe too because they are immutable. But tables, functions, userdata and threads are **objects** on the heap: copying a variable only copies the reference, so both variables point to the **same** object. Changing a table through one variable is visible through the other.'),
      P('Kesamaan juga mengikuti perbezaan ini. Dua string dengan kandungan sama adalah `==` (Lua meng-intern atau membandingkan kandungannya). Tetapi dua table adalah `==` hanya jika ia **objek yang sama** — `{} == {}` adalah palsu walaupun kedua-duanya kosong. Untuk membandingkan kandungan table, anda mesti membandingkan medannya sendiri (atau mentakrifkan metamethod `__eq`, LUA211).',
        'Equality follows the same divide. Two strings with the same content are `==` (Lua interns or compares their contents). But two tables are `==` only if they are the **same object** — `{} == {}` is false even though both are empty. To compare tables by content you must compare their fields yourself (or define an `__eq` metamethod, LUA211).')),
    S('technical_terminology', TERMS('table', 'function', 'userdata', 'coroutine')),
    S('syntax_rules',
      UL(
        ['`type(x)` memulangkan nama jenis sebagai string: `"nil"`, `"boolean"`, `"number"`, `"string"`, `"table"`, `"function"`, `"userdata"`, `"thread"`.', '`type(x)` returns the type name as a string: `"nil"`, `"boolean"`, `"number"`, `"string"`, `"table"`, `"function"`, `"userdata"`, `"thread"`.'],
        ['`io.type(x)` memulangkan `"file"`, `"closed file"` atau `nil` — semakan khusus untuk userdata fail.', '`io.type(x)` returns `"file"`, `"closed file"` or `nil` — a specific check for file userdata.'],
        ['`coroutine.create(f)` mencipta thread; `coroutine.resume(co)` menjalankannya hingga `coroutine.yield`.', '`coroutine.create(f)` creates a thread; `coroutine.resume(co)` runs it until `coroutine.yield`.'],
      )),
    S('code_demonstration',
      CODE('eight-types', 'lua', 'lua54', ['Lapan jenis Lua', 'Lua’s eight types'], `
local samples = {
  nil, true, 42, "hi", {}, print, io.stdout, coroutine.create(function() end),
}
for i = 1, 8 do
  io.write(type(samples[i]), i < 8 and " " or "\\n")
end
`, 'nil boolean number string table function userdata thread'),
      EXPLAIN('eight-types',
        ['1–3', 'Satu nilai bagi setiap jenis. `nil` pertama dalam pembina table tidak disimpan, jadi kita mengindeks dengan nombor 1–8 dan bukannya `ipairs`.', 'One value of each type. The leading `nil` in the constructor is not stored, so we index with the numbers 1–8 instead of `ipairs`.'],
        ['4–6', '`type` memulangkan nama jenis; ruang dipisahkan, dan baris baharu selepas yang terakhir.', '`type` returns the type name; they are separated by spaces, with a newline after the last one.'])),
    S('complete_examples',
      CODE('reference-vs-value', 'lua', 'lua54', ['Semantik nilai berbanding rujukan', 'Value versus reference semantics'], `
local name = "lua"
local copy = name
copy = copy:upper()
print(name, copy)

local player = {score = 10}
local alias = player
alias.score = 99
print(player.score, player == alias, {} == {})
`, 'lua\tLUA\n99\ttrue\tfalse'),
      EXPLAIN('reference-vs-value',
        ['1–4', '`copy:upper()` mencipta string **baharu**; string asal tidak berubah — string tidak boleh diubah.', '`copy:upper()` creates a **new** string; the original is unchanged — strings are immutable.'],
        ['6–8', '`alias` dan `player` merujuk kepada table yang **sama**; perubahan melalui satu kelihatan melalui yang lain.', '`alias` and `player` refer to the **same** table; a change through one is visible through the other.'],
        ['9', '`player == alias` benar (objek sama). `{} == {}` palsu: dua table berbeza, walaupun kandungannya sama.', '`player == alias` is true (same object). `{} == {}` is false: two different tables, even with identical contents.']),
      CODE('functions-threads', 'lua', 'lua54', ['Fungsi sebagai nilai dan thread (coroutine)', 'Functions as values and threads (coroutines)'], `
local operations = {double = function(n) return n * 2 end, square = function(n) return n * n end}
print(operations.double(5), operations.square(5))

local counter = coroutine.create(function()
  for i = 1, 3 do coroutine.yield(i) end
end)
local _, a = coroutine.resume(counter)
local _, b = coroutine.resume(counter)
print(a, b, coroutine.status(counter))
`, '10\t25\n1\t2\tsuspended', {
        debug: BUG(`
local greet = "hello"
print(greet("Aisyah"))
`, "example:2: attempt to call a string value (local 'greet')",
          '`greet` memegang string, bukan fungsi. Dalam Lua, panggilan `x(...)` hanya sah jika `x` ialah fungsi (atau nilai dengan metamethod `__call`). Mesej menyebut **jenis** yang sebenarnya dipanggil — `string value` — dan nama pemboleh ubah. Semak `type(greet)` apabila sesuatu yang anda sangka fungsi gagal dipanggil.',
          '`greet` holds a string, not a function. In Lua, a call `x(...)` is only valid if `x` is a function (or a value with a `__call` metamethod). The message names the **type** that was actually called — `string value` — and the variable. Check `type(greet)` whenever something you expected to be a function cannot be called.'),
      }),
      EXPLAIN('functions-threads',
        ['1–2', 'Fungsi disimpan sebagai nilai dalam table dan dipanggil melalui medannya.', 'Functions stored as values in a table and called through its fields.'],
        ['4–6', '`coroutine.create` membungkus fungsi sebagai **thread**. Ia belum berjalan.', '`coroutine.create` wraps a function as a **thread**. It has not run yet.'],
        ['7–8', 'Setiap `resume` menjalankan thread sehingga `yield` seterusnya dan menerima nilai yang di-yield (1, kemudian 2).', 'Each `resume` runs the thread until the next `yield` and receives the yielded value (1, then 2).'],
        ['9', 'Thread kini "suspended" — menunggu `resume` seterusnya, dengan keadaan gelungnya terpelihara.', 'The thread is now "suspended" — waiting for the next `resume`, with its loop state preserved.'])),
    S('line_by_line',
      EXPLAIN('reference-vs-value',
        ['7', 'Tiada table baharu dicipta di sini — hanya rujukan kedua kepada table yang sedia ada. Untuk salinan sebenar, anda mesti membina table baharu dan menyalin medan (LUA111).', 'No new table is created here — only a second reference to the existing table. For a real copy you must build a new table and copy the fields (LUA111).']),
      EXPLAIN('eight-types',
        ['2', '`io.stdout` ialah [[userdata]]: objek fail milik pustaka C `io`. `coroutine.create(...)` memulangkan thread.', '`io.stdout` is [[userdata]]: a file object owned by the C `io` library. `coroutine.create(...)` returns a thread.'])),
    S('why_this_way',
      P('Mengapa table menggunakan rujukan? Kerana menyalin struktur data yang besar setiap kali ia dihantar ke fungsi akan sangat perlahan. Rujukan membolehkan fungsi mengubah table yang diterimanya — corak yang sangat biasa — dengan kos tetap. Mengapa string tidak boleh diubah? Supaya string boleh dikongsi dengan selamat antara banyak pemboleh ubah tanpa salinan, dan digunakan sebagai kunci table yang stabil.',
        'Why do tables use references? Because copying a large data structure every time it is passed to a function would be very slow. References let a function modify the table it receives — a very common pattern — at constant cost. Why are strings immutable? So a string can be shared safely between many variables without copying, and used as a stable table key.'),
      P('Fikirkan tentang semantik rujukan **apabila** menghantar table ke fungsi (adakah fungsi itu boleh mengubahnya?) dan apabila menyimpan table dalam beberapa tempat (adakah mereka sepatutnya berkongsi perubahan?).', 'Think about reference semantics **when** passing tables to functions (may the function modify it?) and when storing a table in several places (should they share changes?).')),
    S('execution_flow',
      OL(
        ['`local player = {score = 10}` mencipta objek table dalam heap; `player` memegang rujukan.', '`local player = {score = 10}` creates a table object on the heap; `player` holds a reference.'],
        ['`local alias = player` menyalin rujukan — kini dua pemboleh ubah, satu objek.', '`local alias = player` copies the reference — now two variables, one object.'],
        ['`alias.score = 99` menulis ke medan objek itu.', '`alias.score = 99` writes to that object’s field.'],
        ['`player.score` membaca medan yang sama → 99.', '`player.score` reads the same field → 99.'],
      )),
    S('memory_behaviour',
      P('String, table, function, userdata dan thread semuanya diperuntukkan dalam heap dan diurus oleh pengutip sampah. Objek dikutip apabila tiada lagi rujukan kepadanya — dalam `reference-vs-value`, table `{score = 99}` kekal hidup selagi `player` **atau** `alias` merujuknya. Thread menyimpan stack sendiri, jadi coroutine yang digantung memegang semua local di dalamnya sehingga ia tamat atau dikutip.',
        'Strings, tables, functions, userdata and threads are all allocated on the heap and managed by the garbage collector. An object is collected when no reference to it remains — in `reference-vs-value`, the table `{score = 99}` stays alive as long as `player` **or** `alias` refers to it. A thread keeps its own stack, so a suspended coroutine holds all its locals until it finishes or is collected.')),
    S('alternative_implementations',
      P('Untuk menyemak "adakah ini boleh dipanggil?" secara umum, `type(x) == "function"` sudah memadai bagi kebanyakan kod. Untuk menyemak beberapa jenis yang diterima, table carian lebih kemas daripada rantai `or`:', 'To check "can this be called?" in general, `type(x) == "function"` is enough for most code. To check against several accepted types, a lookup table is tidier than a chain of `or`s:'),
      CODE('accepted-types', 'lua', 'lua54', ['Semakan jenis dengan table carian', 'Type checks with a lookup table'], `
local SCALAR = {number = true, string = true, boolean = true}

for _, v in ipairs({7, "x", {}, true, print}) do
  print(type(v), SCALAR[type(v)] and "scalar" or "object")
end
`, 'number\tscalar\nstring\tscalar\ntable\tobject\nboolean\tscalar\nfunction\tobject'),
      EXPLAIN('accepted-types',
        ['1', 'Set jenis yang dianggap nilai skalar, sebagai kunci table.', 'The set of types considered scalar values, as table keys.'],
        ['3–5', 'Satu carian table menggantikan `t == "number" or t == "string" or …`.', 'One table lookup replaces `t == "number" or t == "string" or …`.'])),
    S('common_mistakes',
      UL(
        ['Menjangka `local b = a` menyalin table — ia hanya menyalin rujukan.', 'Expecting `local b = a` to copy a table — it only copies the reference.'],
        ['Membandingkan table dengan `==` untuk menyemak kandungan yang sama.', 'Comparing tables with `==` to check for identical contents.'],
        ['Menyemak jenis dengan `tostring(x):find("table")` dan bukannya `type(x) == "table"`.', 'Checking types with `tostring(x):find("table")` instead of `type(x) == "table"`.'],
        ['Cuba mengubah aksara dalam string (`s[1] = "X"`) — string tidak boleh diubah; bina string baharu.', 'Trying to change a character in a string (`s[1] = "X"`) — strings are immutable; build a new string.'],
      )),
    S('debugging',
      P('Ralat jenis menyebut jenis sebenar nilai: `attempt to index a number value`, `attempt to call a string value`, `attempt to concatenate a table value`. Ini memberitahu dengan tepat apa yang **ada** dalam pemboleh ubah itu, berbanding apa yang anda sangka. Langkah pertama: cetak `type(x)`. Contoh berikut mengindeks nombor seolah-olah ia table:',
        'Type errors name the actual type of the value: `attempt to index a number value`, `attempt to call a string value`, `attempt to concatenate a table value`. That tells you exactly what **is** in the variable, as opposed to what you assumed. First step: print `type(x)`. The following example indexes a number as if it were a table:'),
      CODE('player-stats', 'lua', 'lua54', ['Membaca statistik pemain', 'Reading player statistics'], `
local stats = {health = 100, level = 4}
print(stats.health, stats.level)
`, '100\t4', {
        debug: BUG(`
local stats = 100
print(stats.health, stats.level)
`, "example:2: attempt to index a number value (local 'stats')",
          '`stats` memegang **nombor**, bukan table, jadi `stats.health` tidak bermakna. Mesej menyebut jenis sebenar (`number value`) dan nama pemboleh ubah. Pepijat seperti ini sering berlaku apabila fungsi kadang-kadang memulangkan nombor dan kadang-kadang table — pastikan setiap fungsi memulangkan jenis yang konsisten.',
          '`stats` holds a **number**, not a table, so `stats.health` is meaningless. The message names the real type (`number value`) and the variable. Bugs like this often happen when a function sometimes returns a number and sometimes a table — make sure each function returns a consistent type.'),
      }),
      EXPLAIN('player-stats',
        ['1', 'Statistik sebagai table dengan dua medan.', 'Statistics as a table with two fields.'],
        ['2', 'Mengindeks table berfungsi.', 'Indexing the table works.'])),
    S('performance',
      P('Menghantar table ke fungsi adalah murah tanpa mengira saiznya, kerana hanya rujukan dihantar. Membandingkan string dengan `==` juga pantas kerana string pendek di-intern. Mencipta table, closure dan coroutine pula memerlukan peruntukan heap — dalam gelung yang sangat kerap, gunakan semula objek apabila boleh.',
        'Passing a table to a function is cheap regardless of its size, because only a reference is passed. Comparing strings with `==` is fast too because short strings are interned. Creating tables, closures and coroutines, however, needs heap allocation — in very hot loops, reuse objects when possible.')),
    S('software_engineering',
      P('Bandingkan dua cara fungsi menerima data jenis yang berbeza:', 'Compare two ways for a function to accept data of different types:'),
      CODE('poor-tostring-check', 'lua', 'lua54', ['Pelaksanaan lemah: meneka jenis daripada teks', 'Poor implementation: guessing the type from text'], `
local function describe(v)
  if tostring(v):find("table") then return "a table" end
  return "a value: " .. tostring(v)
end

print(describe({}), describe("my table"))
`, 'a table\ta table'),
      EXPLAIN('poor-tostring-check',
        ['1–4', 'Menukar nilai kepada teks dan mencari perkataan "table". Ini gagal untuk string yang kebetulan mengandungi perkataan itu.', 'Converting the value to text and searching for the word "table". This fails for any string that happens to contain that word.'],
        ['6', 'String `"my table"` disalah kelaskan sebagai table — pepijat.', 'The string `"my table"` is misclassified as a table — a bug.']),
      CODE('improved-type-check', 'lua', 'lua54', ['Pelaksanaan lebih baik: semakan dengan type', 'Improved implementation: checking with type'], `
local function describe(v)
  if type(v) == "table" then return "a table" end
  return "a value: " .. tostring(v)
end

print(describe({}), describe("my table"))
`, 'a table\ta value: my table'),
      EXPLAIN('improved-type-check',
        ['1–4', '`type(v)` melihat tag jenis sebenar, bukan teks paparan.', '`type(v)` looks at the real type tag, not the printed text.'],
        ['6', 'Kedua-dua kes dikelaskan dengan betul.', 'Both cases are classified correctly.'])),
    S('industry_use_cases',
      UL(
        ['Pustaka pensirian (serialisation) seperti penulis JSON bercabang pada `type(v)` untuk menukar setiap jenis.', 'Serialisation libraries such as JSON writers branch on `type(v)` to convert each type.'],
        ['Hos (enjin permainan, pelayan) mendedahkan objek C kepada skrip sebagai userdata.', 'Hosts (game engines, servers) expose C objects to scripts as userdata.'],
        ['Kerangka kerja web (contohnya OpenResty) menggunakan coroutine supaya setiap permintaan boleh menunggu I/O tanpa menyekat yang lain.', 'Web frameworks (for example OpenResty) use coroutines so each request can wait for I/O without blocking the others.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `eight-types`, kemudian tambah jenis yang sama sekali lagi dan sahkan output.', 'Run `eight-types`, then add each type once more and confirm the output.'],
        ['Dalam `reference-vs-value`, buat salinan sebenar table `player` dengan membina table baharu.', 'In `reference-vs-value`, make a real copy of the `player` table by building a new table.'],
        ['Tambah `resume` ketiga dan keempat dalam `functions-threads` dan perhatikan `coroutine.status`.', 'Add a third and fourth `resume` in `functions-threads` and watch `coroutine.status`.'],
      )),
    S('mini_project',
      P('**Pemeriksa nilai.** Tulis fungsi `inspect(v)` yang memulangkan penerangan ringkas bergantung pada jenis: panjang untuk string, bilangan medan untuk table, subjenis untuk nombor, dan "callable" untuk fungsi.', '**A value inspector.** Write a function `inspect(v)` that returns a short description depending on the type: the length for strings, the number of fields for tables, the subtype for numbers, and "callable" for functions.'),
      CODE('inspect-values', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function inspect(v)
  local t = type(v)
  if t == "string" then
    return "string of " .. #v .. " bytes"
  elseif t == "table" then
    local n = 0
    for _ in pairs(v) do n = n + 1 end
    return "table with " .. n .. " field(s)"
  elseif t == "number" then
    return math.type(v) .. " " .. v
  elseif t == "function" then
    return "callable function"
  end
  return t
end

for _, v in ipairs({"hello", {x = 1, y = 2}, 3.5, print, true}) do
  print(inspect(v))
end
`, 'string of 5 bytes\ntable with 2 field(s)\nfloat 3.5\ncallable function\nboolean'),
      EXPLAIN('inspect-values',
        ['1–2', 'Ambil jenis sekali dan simpan dalam local.', 'Get the type once and keep it in a local.'],
        ['3–4', 'String: `#v` ialah panjang dalam bait.', 'String: `#v` is the length in bytes.'],
        ['5–8', 'Table: kira medan dengan `pairs` (berfungsi untuk dictionary, tidak seperti `#`).', 'Table: count fields with `pairs` (works for dictionaries, unlike `#`).'],
        ['9–10', 'Nombor: gabungkan subjenis dan nilai.', 'Number: combine the subtype and the value.'],
        ['11–12', 'Fungsi: boleh dipanggil.', 'Function: callable.'],
        ['14', 'Jenis lain: nama jenisnya sahaja.', 'Other types: just the type name.'],
        ['17–19', 'Uji lima nilai berlainan jenis.', 'Test five values of different types.'])),
    S('summary',
      UL(
        ['Lapan jenis: nil, boolean, number, string, table, function, userdata, thread.', 'Eight types: nil, boolean, number, string, table, function, userdata, thread.'],
        ['String tidak boleh diubah; table, function, userdata dan thread dikongsi melalui rujukan.', 'Strings are immutable; tables, functions, userdata and threads are shared by reference.'],
        ['Table `==` membandingkan identiti, bukan kandungan.', 'Table `==` compares identity, not contents.'],
        ['Gunakan `type(x)` (dan `math.type`, `io.type`) untuk semakan jenis.', 'Use `type(x)` (and `math.type`, `io.type`) for type checks.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah output `print(type(type))`?', 'What is the output of `print(type(type))`?'],
        ['Selepas `local a = {1}; local b = a; b[1] = 5`, apakah nilai `a[1]`?', 'After `local a = {1}; local b = a; b[1] = 5`, what is `a[1]`?'],
        ['Mengapakah `{} == {}` palsu?', 'Why is `{} == {}` false?'],
        ['Apakah jenis nilai yang dipulangkan oleh `io.open` apabila berjaya?', 'What type of value does `io.open` return on success?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §2.1 — Values and Types', url: `${MANUAL}#2.1` },
        { title: 'Lua 5.4 Reference Manual — type', url: `${MANUAL}#pdf-type` },
        { title: 'Lua 5.4 Reference Manual §2.6 — Coroutines', url: `${MANUAL}#2.6` },
        { title: 'Programming in Lua (1st ed.) — 2 Types and Values', url: `${PIL}/2.html` },
      )),
  ],
};

export const LUA102_M2 = [LUA102_2_1, LUA102_2_2, LUA102_2_3];
