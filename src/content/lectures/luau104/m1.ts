import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU104 · Module 1 — Arrays (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 1.1 1-based arrays and the # operator ─────────────────────────────────

export const LUAU104_1_1: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 1,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Mencipta [[array]] Luau dan mengakses elemen dengan indeks bermula 1.', 'Create Luau [[array|arrays]] and access elements with indices starting at 1.'],
        ['Menggunakan `#` untuk panjang dan `t[#t + 1]` untuk menambah di hujung.', 'Use `#` for the length and `t[#t + 1]` to append at the end.'],
        ['Menerangkan mengapa lubang (`nil`) menjadikan `#` tidak boleh dipercayai.', 'Explain why holes (`nil`) make `#` unreliable.'],
        ['Melelar array dengan `for i = 1, #t` dan dengan iterasi umum.', 'Iterate arrays with `for i = 1, #t` and with generalized iteration.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['LUAU103: gelung, fungsi dan closure.', 'LUAU103: loops, functions and closures.'],
        ['LUAU102: jenis asas, `nil` dan interpolasi string.', 'LUAU102: basic types, `nil` and string interpolation.'],
      )),
    S('introduction',
      P('Table ialah satu-satunya struktur data dalam Luau — dan dalam permainan Roblox, hampir semua data ialah table: senarai pemain dalam pusingan, gelombang musuh, slot inventori, mata laluan laluan NPC. Kursus ini bermula dengan bentuk table yang paling ringkas: **array**, senarai tersusun yang diindeks dengan integer. Pengaturcara dari JavaScript, Python atau C# sering tersilap kerana Luau bermula pada indeks **1**, bukan 0, dan kerana operator panjang `#` mempunyai peraturan yang mengejutkan apabila terdapat `nil` di tengah senarai. Kuliah ini mengukur tingkah laku itu dengan VM Luau sebenar.',
        'The table is the only data structure in Luau — and in a Roblox game almost all data is tables: the players in a round, waves of enemies, inventory slots, the waypoints of an NPC path. This course begins with the simplest table shape: the **array**, an ordered list indexed by integers. Programmers from JavaScript, Python or C# often slip because Luau starts at index **1**, not 0, and because the length operator `#` has surprising rules when there is a `nil` in the middle of the list. This lecture measures that behaviour with the real Luau VM.'),
      KEY('Indeks pertama ialah 1; `#t` ialah indeks terakhir dalam array tanpa lubang; `t[0]` hanyalah `nil`.', 'The first index is 1; `#t` is the last index of an array without holes; `t[0]` is just `nil`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Constructor:** `{"a", "b", "c"}` memberi kunci 1, 2, 3 secara automatik.', '**Constructor:** `{"a", "b", "c"}` assigns keys 1, 2, 3 automatically.'],
        ['**Akses:** `t[i]`; indeks di luar julat memberi `nil`, bukan ralat.', '**Access:** `t[i]`; an out-of-range index gives `nil`, not an error.'],
        ['**Panjang:** `#t` — sempadan (border): indeks `n` dengan `t[n] ~= nil` dan `t[n + 1] == nil`.', '**Length:** `#t` — a border: an index `n` with `t[n] ~= nil` and `t[n + 1] == nil`.'],
        ['**Menambah:** `t[#t + 1] = v` atau `table.insert(t, v)`.', '**Appending:** `t[#t + 1] = v` or `table.insert(t, v)`.'],
        ['**Lubang:** `nil` di tengah — array dengan lubang mempunyai lebih daripada satu sempadan yang sah.', '**Hole:** a `nil` in the middle — an array with holes has more than one valid border.'],
      )),
    S('detailed_theory',
      P('Secara dalaman, table Luau mempunyai dua bahagian: **bahagian array** untuk kunci integer 1..n yang padat, dan **bahagian hash** untuk kunci lain. Apabila anda menulis `{"a", "b", "c"}`, ketiga-tiga nilai masuk ke bahagian array, jadi akses `t[2]` sangat pantas. Indeks 0, negatif atau melebihi panjang bukan ralat: ia hanyalah kunci yang tidak mempunyai nilai, jadi bacaannya memberi `nil`. Ini berbeza daripada bahasa yang menimbulkan "index out of range" — dalam Luau, pepijat indeks muncul kemudian sebagai `attempt to index nil` atau `attempt to perform arithmetic on nil` di tempat lain.',
        'Internally, a Luau table has two parts: an **array part** for dense integer keys 1..n, and a **hash part** for other keys. When you write `{"a", "b", "c"}`, all three values go into the array part, so accessing `t[2]` is very fast. Index 0, negative indices or indices beyond the length are not errors: they are simply keys with no value, so reading them gives `nil`. This differs from languages that raise "index out of range" — in Luau, index bugs appear later as `attempt to index nil` or `attempt to perform arithmetic on nil` somewhere else.'),
      P('Operator `#` memulangkan **sempadan**: sebarang `n` dengan `t[n]` bukan `nil` dan `t[n + 1]` ialah `nil` (atau 0 jika `t[1]` ialah `nil`). Untuk array tanpa lubang, hanya ada satu sempadan — panjang yang dijangka. Dengan lubang, ada beberapa sempadan dan Luau boleh memulangkan mana-mana satu. Ukuran kami dengan Luau 0.663: `#{1, nil, 3}` memberi 3, dan table yang diisi `x[1], x[2], x[4]` memberi 4 — tetapi hasil ini bergantung pada pelaksanaan dan cara table dibina, jadi jangan sesekali bergantung padanya. Peraturannya mudah: jangan simpan `nil` dalam array; gunakan nilai penanda seperti `false` atau buang elemen dengan `table.remove`.',
        'The `#` operator returns a **border**: any `n` with `t[n]` not `nil` and `t[n + 1]` `nil` (or 0 if `t[1]` is `nil`). For an array without holes there is only one border — the expected length. With holes there are several borders and Luau may return any of them. Our measurement with Luau 0.663: `#{1, nil, 3}` gives 3, and a table filled as `x[1], x[2], x[4]` gives 4 — but these results depend on the implementation and on how the table was built, so never rely on them. The rule is simple: do not store `nil` in arrays; use a marker value such as `false`, or remove elements with `table.remove`.')),
    S('technical_terminology', TERMS('array', 'table', 'nil', 'generalized-iteration')),
    S('syntax_rules',
      UL(
        ['Cipta: `local waves = {"slime", "goblin", "dragon"}`; table kosong: `{}`.', 'Create: `local waves = {"slime", "goblin", "dragon"}`; an empty table: `{}`.'],
        ['Baca/tulis: `waves[2]`, `waves[2] = "orc"`.', 'Read/write: `waves[2]`, `waves[2] = "orc"`.'],
        ['Lelar: `for i = 1, #t do … end` atau `for i, v in t do … end`.', 'Iterate: `for i = 1, #t do … end` or `for i, v in t do … end`.'],
        ['Jenis: `local names: {string} = {}` — array string.', 'Type: `local names: {string} = {}` — an array of strings.'],
      )),
    S('code_demonstration',
      CODE('wave-array', 'luau', 'luau', ['Array gelombang musuh', 'An array of enemy waves'], `
local waves: {string} = {"slime", "goblin", "dragon"}
print(waves[1], waves[3], #waves)
print(waves[0], waves[4])

waves[#waves + 1] = "lich"
print(#waves, waves[#waves])

for i, enemy in waves do
  print(\`wave {i}: {enemy}\`)
end
`, 'slime\tdragon\t3\nnil\tnil\n4\tlich\nwave 1: slime\nwave 2: goblin\nwave 3: dragon\nwave 4: lich'),
      EXPLAIN('wave-array',
        ['1', 'Constructor memberi kunci 1, 2, 3; anotasi `{string}` bermaksud "array string".', 'The constructor gives keys 1, 2, 3; the `{string}` annotation means "array of strings".'],
        ['2–3', 'Indeks bermula 1. Indeks 0 dan 4 tidak wujud — `nil`, tiada ralat.', 'Indices start at 1. Indices 0 and 4 do not exist — `nil`, no error.'],
        ['5–6', '`#waves + 1` ialah slot kosong pertama; `waves[#waves]` ialah elemen terakhir.', '`#waves + 1` is the first empty slot; `waves[#waves]` is the last element.'],
        ['8–10', 'Iterasi umum melawat array mengikut susunan indeks.', 'Generalized iteration visits the array in index order.'])),
    S('complete_examples',
      CODE('index-math', 'luau', 'luau', ['Aritmetik indeks: pertama, terakhir, tengah', 'Index arithmetic: first, last, middle'], `
local lap: {number} = {31.2, 29.8, 30.5, 28.9, 30.1}
local n = #lap
print("first:", lap[1], "last:", lap[n])
print("middle:", lap[(n + 1) // 2])

local best = lap[1]
for i = 2, n do
  if lap[i] < best then best = lap[i] end
end
print("best lap:", best)

for i = n, 1, -1 do
  if i <= n - 3 then break end
  print("recent", i, lap[i])
end
`, 'first:\t31.2\tlast:\t30.1\nmiddle:\t30.5\nbest lap:\t28.9\nrecent\t5\t30.1\nrecent\t4\t28.9\nrecent\t3\t30.5', {
        debug: BUG(`
local lap: {number} = {31.2, 29.8, 30.5}
local total = 0
for i = 0, #lap - 1 do
  total += lap[i]
end
print(total / #lap)
`, 'example:4: attempt to perform arithmetic (add) on number and nil',
          'Gelung ditulis gaya indeks-0 (`0` hingga `#lap - 1`). `lap[0]` ialah `nil` dalam Luau, jadi `total += nil` gagal pada pusingan pertama. Perhatikan juga elemen terakhir (`lap[3]`) tidak akan pernah dibaca. Gunakan `for i = 1, #lap`.',
          'The loop is written in 0-based style (`0` to `#lap - 1`). `lap[0]` is `nil` in Luau, so `total += nil` fails on the first pass. Notice also that the last element (`lap[3]`) would never be read. Use `for i = 1, #lap`.'),
      }),
      EXPLAIN('index-math',
        ['1–3', '`n = #lap` disimpan sekali; elemen pertama `lap[1]`, terakhir `lap[n]`.', '`n = #lap` is stored once; the first element is `lap[1]`, the last `lap[n]`.'],
        ['4', '`(n + 1) // 2` = 3 untuk n = 5 — indeks tengah dalam sistem bermula 1.', '`(n + 1) // 2` = 3 for n = 5 — the middle index in a 1-based system.'],
        ['6–10', 'Cari minimum: mulakan dengan elemen pertama, bandingkan dari indeks 2.', 'Find the minimum: start with the first element, compare from index 2.'],
        ['12–15', 'Gelung ke belakang dengan langkah −1; `break` selepas tiga elemen terakhir.', 'A backwards loop with step −1; `break` after the last three elements.']),
      CODE('holes', 'luau', 'luau', ['Lubang dan nilai penanda', 'Holes and marker values'], `
local slots = {"sword", "shield", "bow"}
slots[2] = false
print(#slots, slots[2])

local filled = 0
for _, item in slots do
  if item then filled += 1 end
end
print("filled slots:", filled)

local packed = {}
for _, item in slots do
  if item then packed[#packed + 1] = item end
end
print(#packed, table.concat(packed, ","))
`, '3\tfalse\nfilled slots:\t2\n2\tsword,bow', {
        debug: BUG(`
local slots = {"sword", "shield", "bow"}
slots[2] = nil
local labels = {}
for i = 1, #slots do
  labels[i] = slots[i]:upper()
end
print(table.concat(labels, ","))
`, 'example:5: attempt to index nil with \'upper\'',
          'Menetapkan `slots[2] = nil` mencipta lubang. `#slots` masih 3 di sini (sempadan yang mungkin), jadi gelung membaca `slots[2]`, iaitu `nil`, dan `nil:upper()` gagal. Dengan pelaksanaan lain, `#slots` boleh menjadi 1 dan "bow" hilang tanpa ralat. Jangan simpan `nil` dalam array: gunakan `false` atau `table.remove`.',
          'Setting `slots[2] = nil` creates a hole. `#slots` is still 3 here (one possible border), so the loop reads `slots[2]`, which is `nil`, and `nil:upper()` fails. With another implementation `#slots` could be 1 and "bow" would vanish without an error. Do not store `nil` in arrays: use `false` or `table.remove`.'),
      }),
      EXPLAIN('holes',
        ['1–3', '`false` mengosongkan slot tanpa lubang: panjang kekal 3.', '`false` empties a slot without a hole: the length stays 3.'],
        ['5–9', 'Kira slot terisi dengan menguji kebenaran.', 'Count filled slots by testing truthiness.'],
        ['11–15', 'Bina array padat baharu tanpa slot kosong.', 'Build a new dense array without the empty slots.'])),
    S('line_by_line',
      EXPLAIN('wave-array',
        ['5', '`waves[#waves + 1] = "lich"` — `#waves` ialah 3, jadi ini menulis `waves[4]`. Panjang menjadi 4.', '`waves[#waves + 1] = "lich"` — `#waves` is 3, so this writes `waves[4]`. The length becomes 4.']),
      EXPLAIN('holes',
        ['2', 'Menggunakan `false` dan bukan `nil` mengekalkan array padat; `false` masih nilai sebenar.', 'Using `false` rather than `nil` keeps the array dense; `false` is still a real value.'])),
    S('why_this_way',
      P('Mengapa bermula pada 1? Lua direka untuk pengguna bukan pengaturcara, dan "elemen pertama ialah 1" sepadan dengan cara manusia mengira. Luau mewarisinya, dan pustaka Roblox (contohnya array yang dipulangkan oleh `GetChildren`) mengikut peraturan yang sama. Mengapa `#` tidak mengira semua kunci? Kerana mengira kunci memerlukan O(n); sempadan boleh dicari dengan carian binari yang pantas.',
        'Why start at 1? Lua was designed for non-programmers, and "the first element is 1" matches how people count. Luau inherits it, and Roblox libraries (for example the arrays returned by `GetChildren`) follow the same rule. Why does `#` not count all keys? Because counting keys costs O(n); a border can be found with a fast binary search.'),
      P('Gunakan array **apabila** susunan penting dan elemen dicapai mengikut kedudukan; gunakan `false` **apabila** slot perlu kekal tetapi kosong; bina semula array **apabila** anda perlu membuang banyak elemen.', 'Use an array **when** order matters and elements are reached by position; use `false` **when** a slot must remain but be empty; rebuild the array **when** you need to drop many elements.')),
    S('execution_flow',
      OL(
        ['Constructor mencipta table dengan `waves[1..3]` dalam bahagian array.', 'The constructor creates a table with `waves[1..3]` in the array part.'],
        ['`waves[0]`, `waves[4]`: kunci tiada → `nil`.', '`waves[0]`, `waves[4]`: missing keys → `nil`.'],
        ['`#waves + 1` dinilai (4), kemudian `waves[4] = "lich"`.', '`#waves + 1` is evaluated (4), then `waves[4] = "lich"`.'],
        ['Gelung melawat indeks 1..4 mengikut susunan.', 'The loop visits indices 1..4 in order.'],
      )),
    S('memory_behaviour',
      P('Bahagian array menyimpan nilai bersebelahan dalam memori tanpa menyimpan kunci, jadi array padat lebih kecil dan lebih pantas daripada dictionary dengan bilangan elemen yang sama. Apabila array penuh, Luau memperuntukkan bahagian yang lebih besar (lebih kurang dua kali ganda) dan menyalin nilai; menambah elemen satu demi satu masih purata O(1). `table.create(n, v)` memperuntukkan saiz yang betul dari awal.', 'The array part stores values next to each other in memory without storing keys, so a dense array is smaller and faster than a dictionary with the same number of elements. When the array is full, Luau allocates a larger part (roughly double) and copies the values; appending one by one is still O(1) on average. `table.create(n, v)` allocates the right size from the start.')),
    S('alternative_implementations',
      P('Mencipta array dengan saiz yang diketahui menggunakan `table.create`, tambahan Luau:', 'Creating an array of known size with `table.create`, a Luau addition:'),
      CODE('table-create', 'luau', 'luau', ['Pra-peruntukan dengan table.create', 'Preallocation with table.create'], `
local grid = table.create(5, 0)
grid[3] = 7
print(#grid, table.concat(grid, " "))

local names = table.create(3)
print(#names)
`, '5\t0 0 7 0 0\n0'),
      EXPLAIN('table-create',
        ['1–3', '`table.create(5, 0)` memberi lima 0; array padat dan sedia ditulis.', '`table.create(5, 0)` gives five 0s; the array is dense and ready to write.'],
        ['5–6', 'Tanpa nilai, ruang diperuntukkan tetapi kosong — panjang 0.', 'Without a value, space is allocated but empty — the length is 0.'])),
    S('common_mistakes',
      UL(
        ['Gelung `0..#t - 1` gaya bahasa lain.', 'A `0..#t - 1` loop in the style of other languages.'],
        ['Menetapkan elemen kepada `nil` untuk "membuangnya", mencipta lubang.', 'Setting an element to `nil` to "remove" it, creating a hole.'],
        ['Menjangka ralat apabila indeks di luar julat — Luau memberi `nil`.', 'Expecting an error for an out-of-range index — Luau gives `nil`.'],
        ['Memanggil `#t` berulang kali dalam gelung yang mengubah `t`.', 'Calling `#t` repeatedly in a loop that changes `t`.'],
      )),
    S('debugging',
      P('Pepijat indeks dalam Luau jarang menimbulkan ralat di tempatnya. Apabila anda melihat `attempt to … nil`, cetak indeks dan `#t` sejurus sebelum baris itu, dan semak sama ada gelung bermula pada 1 dan berakhir pada `#t`. Jika `#t` memberi nombor yang tidak dijangka, cari lubang: lelar dengan `pairs` dan cetak setiap kunci. Fungsi pemeriksa ringkas:',
        'Index bugs in Luau rarely raise an error where they happen. When you see `attempt to … nil`, print the index and `#t` just before that line, and check whether the loop starts at 1 and ends at `#t`. If `#t` gives an unexpected number, look for holes: iterate with `pairs` and print every key. A small checker:'),
      CODE('hole-check', 'luau', 'luau', ['Mengesan lubang', 'Detecting holes'], `
local function isDense(t: {any}): boolean
  local count = 0
  for _ in pairs(t) do count += 1 end
  for i = 1, count do
    if t[i] == nil then return false end
  end
  return true
end

print(isDense({"a", "b", "c"}))
print(isDense({"a", nil, "c"}))
print(isDense({}))
`, 'true\nfalse\ntrue'),
      EXPLAIN('hole-check',
        ['1–8', 'Kira semua kunci, kemudian pastikan setiap indeks 1..count wujud.', 'Count every key, then make sure every index 1..count exists.'],
        ['10–12', 'Array padat → `true`; lubang → `false`; table kosong padat.', 'A dense array → `true`; a hole → `false`; an empty table is dense.'])),
    S('performance',
      P('Akses `t[i]` dalam bahagian array ialah O(1) dan sangat pantas. `#t` ialah O(log n) dalam kes terburuk tetapi biasanya hampir segera; dalam gelung panas, simpan `#t` dalam local. Iterasi umum dan `for i = 1, n` mempunyai kelajuan yang serupa dalam Luau; pilih yang lebih jelas.', 'Accessing `t[i]` in the array part is O(1) and very fast. `#t` is O(log n) in the worst case but usually nearly instant; in hot loops, store `#t` in a local. Generalized iteration and `for i = 1, n` have similar speed in Luau; pick whichever is clearer.')),
    S('software_engineering',
      P('Pemboleh ubah bernombor berbanding array:', 'Numbered variables versus an array:'),
      CODE('poor-numbered-vars', 'luau', 'luau', ['Pelaksanaan lemah: pemboleh ubah bernombor', 'Poor implementation: numbered variables'], `
local spawn1 = "north gate"
local spawn2 = "river bank"
local spawn3 = "old mill"
local pick = 2
local chosen
if pick == 1 then chosen = spawn1
elseif pick == 2 then chosen = spawn2
elseif pick == 3 then chosen = spawn3 end
print(chosen)
`, 'river bank'),
      EXPLAIN('poor-numbered-vars',
        ['1–3', 'Setiap titik ialah pemboleh ubah berasingan.', 'Every point is a separate variable.'],
        ['4–9', 'Memilih memerlukan rantai `if`; titik keempat memerlukan cabang baharu.', 'Choosing needs an `if` chain; a fourth point needs a new branch.']),
      CODE('improved-spawn-array', 'luau', 'luau', ['Pelaksanaan lebih baik: array', 'Improved implementation: an array'], `
local spawnPoints: {string} = {"north gate", "river bank", "old mill"}
local function spawnAt(index: number): string?
  return spawnPoints[index]
end
print(spawnAt(2), spawnAt(9))
table.insert(spawnPoints, "harbour")
print(#spawnPoints, spawnAt(4))
`, 'river bank\tnil\n4\tharbour'),
      EXPLAIN('improved-spawn-array',
        ['1–4', 'Satu array; indeks terus memilih titik. Jenis `string?` kerana indeks boleh tiada.', 'One array; the index selects the point directly. The type is `string?` because the index may be missing.'],
        ['5–7', 'Indeks tidak sah memberi `nil`; titik baharu hanya satu baris.', 'An invalid index gives `nil`; a new point is a single line.'])),
    S('industry_use_cases',
      UL(
        ['Senarai titik laluan (waypoint) untuk NPC disimpan sebagai array dan dilawati mengikut indeks.', 'Lists of NPC waypoints are stored as arrays and visited by index.'],
        ['API Roblox seperti `GetChildren` dan `GetPlayers` memulangkan array bermula 1.', 'Roblox APIs such as `GetChildren` and `GetPlayers` return 1-based arrays.'],
        ['Gelombang musuh dan giliran pemain dimodelkan sebagai array tersusun.', 'Enemy waves and player turns are modelled as ordered arrays.'],
      )),
    S('practical_demonstration',
      OL(
        ['Dalam `index-math`, cetak dua masa pusingan terbaik tanpa mengisih.', 'In `index-math`, print the two best lap times without sorting.'],
        ['Tukar `slots[2] = false` dalam `holes` kepada `nil` dan perhatikan `#slots`.', 'Change `slots[2] = false` in `holes` to `nil` and watch `#slots`.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Penimbal bulat masa pusingan.** Simpan hanya N masa terakhir dalam array bersaiz tetap, menulis ganti yang paling lama apabila penuh, dan kira purata.', '**A ring buffer of lap times.** Keep only the last N times in a fixed-size array, overwriting the oldest when full, and compute the average.'),
      CODE('ring-buffer', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local capacity = 3
local buffer: {number} = table.create(capacity, 0)
local nextSlot, count = 1, 0

local function record(t: number)
  buffer[nextSlot] = t
  nextSlot = nextSlot % capacity + 1
  count = math.min(count + 1, capacity)
end

for _, t in {30, 32, 28, 26} do
  record(t)
end
local sum = 0
for i = 1, count do sum += buffer[i] end
print(table.concat(buffer, " "), sum / count)
`, '26 32 28\t28.666666666666668'),
      EXPLAIN('ring-buffer',
        ['1–3', 'Array bersaiz tetap diisi 0; `nextSlot` ialah slot seterusnya untuk ditulis.', 'A fixed-size array filled with 0; `nextSlot` is the next slot to write.'],
        ['5–9', '`nextSlot % capacity + 1` berputar 1 → 2 → 3 → 1 — aritmetik modulo untuk indeks bermula 1.', '`nextSlot % capacity + 1` cycles 1 → 2 → 3 → 1 — modulo arithmetic for 1-based indices.'],
        ['11–16', 'Empat masa: 26 menulis ganti 30. Purata (26 + 32 + 28) / 3.', 'Four times: 26 overwrites 30. The average is (26 + 32 + 28) / 3.'])),
    S('summary',
      UL(
        ['Array Luau bermula pada indeks 1; indeks yang tiada memberi `nil`.', 'Luau arrays start at index 1; missing indices give `nil`.'],
        ['`#t` ialah panjang hanya untuk array tanpa lubang.', '`#t` is the length only for arrays without holes.'],
        ['Tambah dengan `t[#t + 1] = v`; kosongkan slot dengan `false`, bukan `nil`.', 'Append with `t[#t + 1] = v`; empty a slot with `false`, not `nil`.'],
        ['`table.create(n, v)` memperuntukkan array bersaiz tetap.', '`table.create(n, v)` preallocates a fixed-size array.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dicetak oleh `print(({"x"})[0])`?', 'What does `print(({"x"})[0])` print?'],
        ['Mengapakah `#t` tidak boleh dipercayai jika `t` mempunyai lubang?', 'Why is `#t` unreliable if `t` has holes?'],
        ['Tulis ungkapan indeks tengah bagi array dengan `n` elemen.', 'Write the middle-index expression for an array with `n` elements.'],
        ['Bilakah `table.create` berguna?', 'When is `table.create` useful?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Arrays', url: `${DOCS}/luau/arrays` },
        { title: 'Luau — Library: table.create', url: `${LUAU}/library#table-library` },
        { title: 'Lua 5.1 Reference Manual §2.5.5 — The Length Operator', url: 'https://www.lua.org/manual/5.1/manual.html#2.5.5' },
        { title: 'Roblox Creator Hub — Tables', url: `${DOCS}/luau/tables` },
      )),
  ],
};

// ─── 1.2 table.insert, table.remove and table.find ─────────────────────────

export const LUAU104_1_2: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 1,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menambah elemen dengan `table.insert` di hujung atau pada kedudukan.', 'Add elements with `table.insert` at the end or at a position.'],
        ['Membuang elemen dengan `table.remove` dan menggunakan nilai yang dipulangkan.', 'Remove elements with `table.remove` and use the returned value.'],
        ['Mencari elemen dengan `table.find` (tambahan Luau) dan `table.clear`.', 'Find elements with `table.find` (a Luau addition) and `table.clear`.'],
        ['Membuang elemen semasa melelar tanpa melangkau elemen.', 'Remove elements while iterating without skipping any.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1: array bermula 1 dan `#`.', 'Lecture 1.1: 1-based arrays and `#`.'],
      )),
    S('introduction',
      P('Senarai dalam permainan sentiasa berubah: pemain menyertai dan meninggalkan pusingan, musuh muncul dan dikalahkan, item masuk dan keluar inventori. Pustaka `table` Luau menyediakan operasi untuk mengubah [[array]] sambil mengekalkannya padat: `table.insert` mengalihkan elemen untuk memberi ruang, `table.remove` mengalihkan elemen untuk menutup jurang. Luau menambah `table.find` untuk mencari indeks nilai dan `table.clear` untuk mengosongkan table — kedua-duanya tiada dalam Lua 5.1. Kuliah ini juga menerangkan pepijat klasik: membuang elemen dalam gelung `for` ke hadapan.',
        'Lists in games change constantly: players join and leave a round, enemies spawn and are defeated, items enter and leave the inventory. Luau’s `table` library provides operations that change an [[array]] while keeping it dense: `table.insert` shifts elements to make room, `table.remove` shifts elements to close the gap. Luau adds `table.find` to look up a value’s index and `table.clear` to empty a table — neither exists in Lua 5.1. This lecture also explains a classic bug: removing elements in a forward `for` loop.'),
      KEY('insert/remove mengalihkan elemen dan mengekalkan array padat; buang ke belakang semasa melelar.', 'insert/remove shift elements and keep the array dense; remove backwards while iterating.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`table.insert(t, v)` — tambah di hujung; `table.insert(t, i, v)` — sisip pada `i`, alihkan yang lain ke kanan.', '`table.insert(t, v)` — append; `table.insert(t, i, v)` — insert at `i`, shifting the rest right.'],
        ['`table.remove(t)` — buang dan pulangkan yang terakhir; `table.remove(t, i)` — buang pada `i`, alihkan ke kiri.', '`table.remove(t)` — remove and return the last; `table.remove(t, i)` — remove at `i`, shifting left.'],
        ['`table.find(t, v, init?)` — indeks pertama `v` (bermula dari `init`), atau `nil`.', '`table.find(t, v, init?)` — the first index of `v` (starting at `init`), or `nil`.'],
        ['`table.clear(t)` — buang semua kunci tetapi kekalkan table (dan rujukan kepadanya).', '`table.clear(t)` — removes every key but keeps the table (and references to it).'],
      )),
    S('detailed_theory',
      P('`table.insert(t, i, v)` mengalihkan `t[i..n]` satu tempat ke kanan dan kemudian menulis `v` pada `i`; `table.remove(t, i)` memulangkan `t[i]`, mengalihkan `t[i+1..n]` ke kiri, dan memadamkan `t[n]`. Kedua-duanya mengekalkan array padat, jadi `#t` kekal betul — tidak seperti menulis `nil`. Kos: mengalihkan bermakna kerja O(n) untuk sisipan atau pembuangan di hadapan, tetapi O(1) di hujung. Ukuran dengan Luau 0.663 menunjukkan dua tingkah laku senyap yang patut diketahui: `table.insert(t, 5, v)` pada array dua elemen tidak menimbulkan ralat — ia menulis `t[5]` dan mencipta lubang — dan `table.remove` pada indeks yang tiada hanya memulangkan `nil`.',
        '`table.insert(t, i, v)` shifts `t[i..n]` one place to the right and then writes `v` at `i`; `table.remove(t, i)` returns `t[i]`, shifts `t[i+1..n]` left, and clears `t[n]`. Both keep the array dense, so `#t` stays correct — unlike writing `nil`. The cost: shifting means O(n) work for inserting or removing at the front, but O(1) at the end. Measurements with Luau 0.663 show two silent behaviours worth knowing: `table.insert(t, 5, v)` on a two-element array raises no error — it writes `t[5]` and creates a hole — and `table.remove` at a missing index simply returns `nil`.'),
      P('Membuang elemen semasa melelar ke hadapan ialah pepijat yang sangat biasa. Jika anda membuang `t[i]`, elemen seterusnya beralih ke `i`, tetapi gelung bergerak ke `i + 1` — jadi elemen itu dilangkau. Lebih teruk, `for i = 1, #t` menilai `#t` sekali sahaja, jadi gelung akhirnya membaca indeks yang sudah kosong. Penyelesaian standard ialah melelar **ke belakang** (`for i = #t, 1, -1`): pembuangan hanya mengalihkan elemen yang sudah diproses. Untuk pembuangan yang banyak, membina array baharu (penapis) lebih pantas dan lebih jelas. `table.find` membuat carian linear O(n) dengan `==`, jadi ia mencari table mengikut identiti, bukan kandungan.',
        'Removing elements while iterating forwards is a very common bug. If you remove `t[i]`, the next element shifts into `i`, but the loop moves on to `i + 1` — so that element is skipped. Worse, `for i = 1, #t` evaluates `#t` only once, so the loop eventually reads indices that are already empty. The standard fix is to iterate **backwards** (`for i = #t, 1, -1`): a removal only shifts elements that have already been processed. For many removals, building a new array (a filter) is faster and clearer. `table.find` does a linear O(n) search with `==`, so it finds tables by identity, not by contents.')),
    S('technical_terminology', TERMS('array', 'table', 'algorithm', 'loop')),
    S('syntax_rules',
      UL(
        ['`table.insert(queue, "Ben")`, `table.insert(queue, 1, "VIP")`.', '`table.insert(queue, "Ben")`, `table.insert(queue, 1, "VIP")`.'],
        ['`local last = table.remove(queue)`, `local first = table.remove(queue, 1)`.', '`local last = table.remove(queue)`, `local first = table.remove(queue, 1)`.'],
        ['`local i = table.find(queue, "Ben")` — semak `if i then … end`.', '`local i = table.find(queue, "Ben")` — check `if i then … end`.'],
      )),
    S('code_demonstration',
      CODE('queue-ops', 'luau', 'luau', ['Barisan pemain dengan insert, remove dan find', 'A player queue with insert, remove and find'], `
local queue: {string} = {"Aina", "Ben"}
table.insert(queue, "Chen")
table.insert(queue, 1, "VIP-Dewi")
print(table.concat(queue, ", "))

local served = table.remove(queue, 1)
print("served:", served, "left:", #queue)

local pos = table.find(queue, "Chen")
print("Chen is at", pos, "| Zara:", table.find(queue, "Zara"))
if pos then table.remove(queue, pos) end
print(table.concat(queue, ", "))
`, 'VIP-Dewi, Aina, Ben, Chen\nserved:\tVIP-Dewi\tleft:\t3\nChen is at\t3\t| Zara:\tnil\nAina, Ben'),
      EXPLAIN('queue-ops',
        ['1–4', 'Tambah di hujung, kemudian sisip pada indeks 1 — yang lain beralih ke kanan.', 'Append at the end, then insert at index 1 — the others shift right.'],
        ['6–7', '`table.remove(queue, 1)` memulangkan elemen yang dibuang; baki beralih ke kiri.', '`table.remove(queue, 1)` returns the removed element; the rest shift left.'],
        ['9–12', '`table.find` memberi indeks atau `nil`; semak sebelum membuang.', '`table.find` gives an index or `nil`; check before removing.'])),
    S('complete_examples',
      CODE('remove-backwards', 'luau', 'luau', ['Membuang semasa melelar: ke belakang', 'Removing while iterating: backwards'], `
local enemies = {
  {name = "slime", hp = 0}, {name = "goblin", hp = 0},
  {name = "orc", hp = 12}, {name = "bat", hp = 0},
}

for i = #enemies, 1, -1 do
  if enemies[i].hp <= 0 then
    local dead = table.remove(enemies, i)
    print("removed", dead.name)
  end
end
print("alive:", #enemies, enemies[1].name)
`, 'removed\tbat\nremoved\tgoblin\nremoved\tslime\nalive:\t1\torc', {
        debug: BUG(`
local enemies = {
  {name = "slime", hp = 0}, {name = "goblin", hp = 0}, {name = "orc", hp = 12},
}
for i = 1, #enemies do
  if enemies[i].hp <= 0 then
    table.remove(enemies, i)
  end
end
print(#enemies)
`, 'example:5: attempt to index nil with \'hp\'',
          'Gelung ke hadapan: membuang "slime" (i = 1) mengalihkan "goblin" ke indeks 1, tetapi gelung bergerak ke i = 2 ("orc") — "goblin" dilangkau. `#enemies` dinilai sekali (3), jadi pada i = 3 tiada elemen lagi dan `nil.hp` gagal. Lelar ke belakang atau bina array baharu.',
          'A forward loop: removing "slime" (i = 1) shifts "goblin" to index 1, but the loop moves on to i = 2 ("orc") — "goblin" is skipped. `#enemies` was evaluated once (3), so at i = 3 there is no element left and `nil.hp` fails. Iterate backwards or build a new array.'),
      }),
      EXPLAIN('remove-backwards',
        ['1–4', 'Empat musuh; tiga mempunyai hp 0.', 'Four enemies; three have hp 0.'],
        ['6–11', 'Dari hujung ke awal: pembuangan hanya mengalihkan elemen yang sudah disemak.', 'From the end to the start: a removal only shifts elements already checked.'],
        ['12', 'Hanya "orc" tinggal.', 'Only "orc" remains.']),
      CODE('find-and-clear', 'luau', 'luau', ['table.find dengan init, dan table.clear', 'table.find with init, and table.clear'], `
local rolls = {6, 2, 6, 3, 6}
local hits = {}
local i = table.find(rolls, 6)
while i do
  table.insert(hits, i)
  i = table.find(rolls, 6, i + 1)
end
print("sixes at", table.concat(hits, ","))

local alias = rolls
table.clear(rolls)
print(#rolls, #alias, alias == rolls)
`, 'sixes at\t1,3,5\n0\t0\ttrue', {
        debug: BUG(`
local banned = {"cheater1", "spammer"}
local name = "spammer"
local index = table.find(banned, name)
table.remove(banned, index)
local again = table.find(banned, name)
table.remove(banned, again)
print(#banned, banned[1]:upper())
`, 'example:7: attempt to index nil with \'upper\'',
          'Panggilan pertama membuang "spammer". Panggilan kedua `table.find` memberi `nil`, dan `table.remove(banned, nil)` bertindak seperti `table.remove(banned)` — ia membuang elemen **terakhir** ("cheater1") secara senyap. Array kini kosong, dan `banned[1]:upper()` gagal. Sentiasa semak `if index then` sebelum membuang.',
          'The first call removes "spammer". The second `table.find` gives `nil`, and `table.remove(banned, nil)` acts like `table.remove(banned)` — it silently removes the **last** element ("cheater1"). The array is now empty, and `banned[1]:upper()` fails. Always check `if index then` before removing.'),
      }),
      EXPLAIN('find-and-clear',
        ['1–8', 'Argumen ketiga `init` meneruskan carian selepas padanan sebelumnya — cari setiap kejadian.', 'The third argument `init` continues the search after the previous match — finding every occurrence.'],
        ['10–12', '`table.clear` mengosongkan table yang **sama**; `alias` melihat perubahan kerana ia merujuk objek yang sama.', '`table.clear` empties the **same** table; `alias` sees the change because it refers to the same object.'])),
    S('line_by_line',
      EXPLAIN('remove-backwards',
        ['6', '`for i = #enemies, 1, -1` — bermula pada 4 dan menurun; indeks yang belum disemak tidak pernah berubah.', '`for i = #enemies, 1, -1` — starts at 4 and counts down; indices not yet checked never change.']),
      EXPLAIN('queue-ops',
        ['11', 'Klausa pengawal `if pos` menghalang `table.remove(queue, nil)`, yang akan membuang elemen terakhir.', 'The `if pos` guard prevents `table.remove(queue, nil)`, which would remove the last element.'])),
    S('why_this_way',
      P('Mengapa fungsi pustaka dan bukannya menulis `t[i] = nil`? Kerana ia mengekalkan array padat, jadi `#`, iterasi dan `table.sort` terus berfungsi. Mengapa Luau menambah `table.find`? Kerana carian "adakah nilai ini dalam senarai?" sangat biasa dalam kod permainan, dan versi C lebih pantas daripada gelung Luau.',
        'Why library functions instead of writing `t[i] = nil`? Because they keep the array dense, so `#`, iteration and `table.sort` keep working. Why did Luau add `table.find`? Because the lookup "is this value in the list?" is very common in game code, and the C version is faster than a Luau loop.'),
      P('Gunakan `table.remove(t, i)` **apabila** susunan mesti dikekalkan; gunakan pertukaran dengan elemen terakhir **apabila** susunan tidak penting dan prestasi penting; gunakan dictionary **apabila** anda kerap bertanya "adakah X wujud?".', 'Use `table.remove(t, i)` **when** order must be preserved; swap with the last element **when** order does not matter and performance does; use a dictionary **when** you often ask "does X exist?".')),
    S('execution_flow',
      OL(
        ['`table.insert(queue, 1, "VIP-Dewi")`: Aina, Ben, Chen beralih ke 2, 3, 4; Dewi ditulis pada 1.', '`table.insert(queue, 1, "VIP-Dewi")`: Aina, Ben, Chen shift to 2, 3, 4; Dewi is written at 1.'],
        ['`table.remove(queue, 1)`: pulangkan Dewi; yang lain beralih kembali ke 1, 2, 3.', '`table.remove(queue, 1)`: returns Dewi; the others shift back to 1, 2, 3.'],
        ['`table.find(queue, "Chen")` → 3; `table.remove(queue, 3)` → Aina, Ben.', '`table.find(queue, "Chen")` → 3; `table.remove(queue, 3)` → Aina, Ben.'],
      )),
    S('memory_behaviour',
      P('`table.remove` dan `table.clear` tidak mengecilkan memori yang diperuntukkan untuk bahagian array; ruang itu digunakan semula apabila elemen ditambah semula. Inilah sebabnya `table.clear` berguna untuk penimbal yang digunakan semula setiap bingkai: ia mengelakkan peruntukan table baharu. Sebaliknya, `t = {}` mencipta table baharu dan meninggalkan yang lama untuk pengutip sampah — dan rujukan lain masih melihat table lama.', '`table.remove` and `table.clear` do not shrink the memory allocated for the array part; the space is reused when elements are added again. This is why `table.clear` is useful for buffers reused every frame: it avoids allocating new tables. By contrast, `t = {}` creates a new table and leaves the old one to the garbage collector — and other references still see the old table.')),
    S('alternative_implementations',
      P('Apabila susunan tidak penting, "tukar dan buang" ialah O(1):', 'When order does not matter, "swap and pop" is O(1):'),
      CODE('swap-remove', 'luau', 'luau', ['Tukar dan buang', 'Swap and pop'], `
local function swapRemove(t: {any}, i: number)
  local n = #t
  t[i] = t[n]
  t[n] = nil
end

local projectiles = {"p1", "p2", "p3", "p4"}
swapRemove(projectiles, 2)
print(table.concat(projectiles, " "))
`, 'p1 p4 p3'),
      EXPLAIN('swap-remove',
        ['1–5', 'Salin elemen terakhir ke `i`, kemudian padam yang terakhir — tiada peralihan, dan tiada lubang kerana `t[n]` ialah elemen terakhir.', 'Copy the last element into `i`, then clear the last — no shifting, and no hole because `t[n]` is the last element.'],
        ['7–9', 'Susunan berubah ("p4" kini kedua) — boleh diterima untuk peluru, tidak untuk barisan.', 'The order changes ("p4" is now second) — fine for projectiles, not for a queue.'])),
    S('common_mistakes',
      UL(
        ['Membuang dalam gelung `for` ke hadapan.', 'Removing in a forward `for` loop.'],
        ['Menghantar hasil `table.find` yang `nil` kepada `table.remove`.', 'Passing a `nil` result of `table.find` to `table.remove`.'],
        ['Menyisip pada indeks melebihi `#t + 1`, mencipta lubang secara senyap.', 'Inserting at an index beyond `#t + 1`, silently creating a hole.'],
        ['Menjangka `table.find` membandingkan kandungan table.', 'Expecting `table.find` to compare table contents.'],
      )),
    S('debugging',
      P('Apabila elemen "hilang" atau "tidak dibuang", cetak array sebelum dan selepas setiap operasi dengan `table.concat`. Jika elemen dilangkau dalam gelung pembuangan, ia hampir pasti gelung ke hadapan. Jika elemen yang salah dibuang, semak sama ada indeks boleh menjadi `nil`. Pembalut yang selamat membuat semakan itu sekali:',
        'When elements "go missing" or "are not removed", print the array before and after each operation with `table.concat`. If elements are skipped in a removal loop, it is almost certainly a forward loop. If the wrong element is removed, check whether the index can be `nil`. A safe wrapper does that check once:'),
      CODE('remove-value', 'luau', 'luau', ['Pembuangan mengikut nilai yang selamat', 'Safe removal by value'], `
local function removeValue(t: {any}, value: any): boolean
  local index = table.find(t, value)
  if index == nil then
    return false
  end
  table.remove(t, index)
  return true
end

local party = {"Aina", "Ben", "Chen"}
print(removeValue(party, "Ben"), removeValue(party, "Ben"))
print(table.concat(party, ","))
`, 'true\tfalse\nAina,Chen'),
      EXPLAIN('remove-value',
        ['1–8', 'Klausa pengawal pada `nil`; memulangkan sama ada pembuangan berlaku.', 'A guard clause on `nil`; returns whether a removal happened.'],
        ['10–12', 'Panggilan kedua tidak menemui "Ben" dan tidak membuang apa-apa.', 'The second call does not find "Ben" and removes nothing.'])),
    S('performance',
      P('Operasi di hujung (`table.insert(t, v)`, `table.remove(t)`) ialah O(1). Operasi di hadapan atau tengah ialah O(n) kerana peralihan; barisan yang besar yang sentiasa membuang dari hadapan patut menggunakan indeks kepala dan bukannya `table.remove(t, 1)`. `table.find` ialah O(n); untuk carian berulang dalam set besar, dictionary `{[nilai] = true}` memberi O(1).', 'Operations at the end (`table.insert(t, v)`, `table.remove(t)`) are O(1). Operations at the front or middle are O(n) because of shifting; a large queue that always removes from the front should use a head index instead of `table.remove(t, 1)`. `table.find` is O(n); for repeated lookups in a large set, a dictionary `{[value] = true}` gives O(1).')),
    S('software_engineering',
      P('Pembuangan manual dengan lubang berbanding fungsi pustaka:', 'Manual removal with holes versus the library function:'),
      CODE('poor-nil-removal', 'luau', 'luau', ['Pelaksanaan lemah: membuang dengan nil', 'Poor implementation: removing with nil'], `
local players = {"Aina", "Ben", "Chen", "Dewi"}
players[2] = nil
local shown = {}
for i, p in players do shown[#shown + 1] = \`{i}:{p}\` end
print(table.concat(shown, " "))
`, '1:Aina 3:Chen 4:Dewi'),
      EXPLAIN('poor-nil-removal',
        ['1–2', 'Menulis `nil` meninggalkan lubang di indeks 2.', 'Writing `nil` leaves a hole at index 2.'],
        ['3–5', 'Iterasi umum melangkau lubang, tetapi indeks kini 1, 3, 4 — "pemain ke-2" tiada, dan `#players` tidak boleh dipercayai.', 'Generalized iteration skips the hole, but the indices are now 1, 3, 4 — "player 2" is missing, and `#players` is unreliable.']),
      CODE('improved-library-removal', 'luau', 'luau', ['Pelaksanaan lebih baik: table.remove', 'Improved implementation: table.remove'], `
local players = {"Aina", "Ben", "Chen", "Dewi"}
table.remove(players, 2)
local shown = {}
for i, p in players do shown[#shown + 1] = \`{i}:{p}\` end
print(table.concat(shown, " "), #players)
`, '1:Aina 2:Chen 3:Dewi\t3'),
      EXPLAIN('improved-library-removal',
        ['1–2', '`table.remove` mengalihkan elemen dan mengekalkan array padat.', '`table.remove` shifts elements and keeps the array dense.'],
        ['3–5', 'Indeks berturutan 1..3 dan `#players` tepat.', 'Indices are consecutive 1..3 and `#players` is exact.'])),
    S('industry_use_cases',
      UL(
        ['Barisan matchmaking menambah pemain di hujung dan mengambil dari hadapan.', 'Matchmaking queues add players at the end and take them from the front.'],
        ['Sistem peluru menggunakan "tukar dan buang" untuk membuang ratusan objek setiap bingkai.', 'Projectile systems use "swap and pop" to remove hundreds of objects per frame.'],
        ['`table.find` digunakan untuk menyemak senarai larangan kecil atau senarai putih.', '`table.find` is used to check small ban lists or allow lists.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis `removeAll(t, value)` yang membuang setiap kejadian dengan gelung ke belakang.', 'Write `removeAll(t, value)` that removes every occurrence with a backwards loop.'],
        ['Dalam `queue-ops`, sisip "Zara" pada indeks 2 dan ramalkan output.', 'In `queue-ops`, insert "Zara" at index 2 and predict the output.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Barisan pusingan dengan indeks kepala.** Laksanakan barisan yang `push` di hujung dan `pop` dari hadapan dalam O(1), tanpa `table.remove(t, 1)`.', '**A round queue with a head index.** Implement a queue that `push`es at the end and `pop`s from the front in O(1), without `table.remove(t, 1)`.'),
      CODE('head-queue', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function createQueue()
  local items: {string} = {}
  local head, tail = 1, 0
  local q = {}
  function q.push(v: string) tail += 1; items[tail] = v end
  function q.pop(): string?
    if head > tail then return nil end
    local v = items[head]
    items[head] = nil
    head += 1
    return v
  end
  function q.size(): number return tail - head + 1 end
  return q
end

local q = createQueue()
q.push("Aina"); q.push("Ben"); q.push("Chen")
print(q.pop(), q.pop(), q.size())
q.push("Dewi")
print(q.pop(), q.pop(), q.pop(), q.size())
`, 'Aina\tBen\t1\nChen\tDewi\tnil\t0'),
      EXPLAIN('head-queue',
        ['1–4', 'Keadaan peribadi: elemen, indeks kepala dan ekor (closure, LUAU103).', 'Private state: the items, a head and a tail index (closures, LUAU103).'],
        ['5–12', '`push` menulis di ekor; `pop` membaca di kepala dan memajukannya — tiada peralihan. Lubang di hadapan disengajakan: barisan tidak pernah menggunakan `#`.', '`push` writes at the tail; `pop` reads at the head and advances it — no shifting. The holes at the front are intentional: the queue never uses `#`.'],
        ['13–15', 'Saiz dikira daripada indeks.', 'The size is computed from the indices.'],
        ['17–21', 'FIFO: Aina, Ben keluar dahulu; barisan kosong memberi `nil`.', 'FIFO: Aina, Ben leave first; an empty queue gives `nil`.'])),
    S('summary',
      UL(
        ['`table.insert`/`table.remove` mengalihkan elemen dan mengekalkan array padat.', '`table.insert`/`table.remove` shift elements and keep arrays dense.'],
        ['`table.find(t, v, init)` memberi indeks atau `nil` — semak sebelum digunakan.', '`table.find(t, v, init)` gives an index or `nil` — check before use.'],
        ['Buang semasa melelar dengan gelung ke belakang.', 'Remove while iterating with a backwards loop.'],
        ['`table.clear` mengosongkan table yang sama; rujukan lain melihatnya.', '`table.clear` empties the same table; other references see it.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dipulangkan oleh `table.remove({}, 1)`?', 'What does `table.remove({}, 1)` return?'],
        ['Mengapakah gelung ke hadapan melangkau elemen semasa membuang?', 'Why does a forward loop skip elements while removing?'],
        ['Apakah yang berlaku jika `table.remove(t, nil)` dipanggil?', 'What happens if `table.remove(t, nil)` is called?'],
        ['Bilakah "tukar dan buang" sesuai?', 'When is "swap and pop" appropriate?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library: table', url: `${LUAU}/library#table-library` },
        { title: 'Roblox Engine API — table library', url: `${DOCS}/reference/engine/libraries/table` },
        { title: 'Roblox Creator Hub — Arrays: removing items', url: `${DOCS}/luau/arrays` },
        { title: 'Programming in Lua (1st ed.) — 19.2 Insert and Remove', url: 'https://www.lua.org/pil/19.2.html' },
      )),
  ],
};

// ─── 1.3 table.sort and comparison functions ───────────────────────────────

export const LUAU104_1_3: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 1,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Mengisih array nombor dan string dengan `table.sort`.', 'Sort arrays of numbers and strings with `table.sort`.'],
        ['Mengisih array table dengan fungsi perbandingan dan pemutus seri.', 'Sort arrays of tables with comparison functions and tie-breakers.'],
        ['Menerangkan bahawa `table.sort` mengubah array di tempat dan tidak stabil.', 'Explain that `table.sort` sorts in place and is not stable.'],
        ['Mengisih tanpa mengubah array asal.', 'Sort without changing the original array.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1–1.2: array dan pustaka table.', 'Lectures 1.1–1.2: arrays and the table library.'],
        ['LUAU103 4.2: callback dan pembanding ketat.', 'LUAU103 4.2: callbacks and strict comparators.'],
      )),
    S('introduction',
      P('Papan pendahulu, senarai kedai mengikut harga, musuh terdekat dahulu — banyak ciri permainan bergantung pada pengisihan. LUAU103 memperkenalkan pembanding sebagai contoh callback; kuliah ini memberi tumpuan kepada `table.sort` itu sendiri: apa yang boleh diisih tanpa pembanding, apa yang gagal (nombor bercampur string, table tanpa pembanding), mengapa ia mengubah array asal, dan mengapa elemen yang sama boleh bertukar tempat. Kita akan membina fungsi isih yang boleh digunakan semula untuk pelbagai kunci.',
        'Leaderboards, shop lists by price, nearest enemies first — many game features depend on sorting. LUAU103 introduced comparators as an example of callbacks; this lecture focuses on `table.sort` itself: what can be sorted without a comparator, what fails (numbers mixed with strings, tables without a comparator), why it changes the original array, and why equal elements may swap places. We will build a reusable sort helper for several keys.'),
      KEY('`table.sort` mengisih di tempat, memulangkan tiada apa-apa, dan tidak stabil — tambah pemutus seri.', '`table.sort` sorts in place, returns nothing, and is not stable — add a tie-breaker.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Tanpa pembanding, `table.sort` menggunakan `<` — sah untuk array nombor sahaja atau string sahaja.', 'Without a comparator, `table.sort` uses `<` — valid for all-number or all-string arrays.'],
        ['String diisih mengikut kod bait: huruf besar sebelum huruf kecil ("Z" < "a").', 'Strings sort by byte code: uppercase before lowercase ("Z" < "a").'],
        ['Dengan pembanding: `cmp(a, b)` benar jika `a` mesti sebelum `b`.', 'With a comparator: `cmp(a, b)` is true if `a` must come before `b`.'],
        ['**Tidak stabil:** elemen yang dianggap sama boleh muncul dalam sebarang susunan.', '**Not stable:** elements considered equal may appear in any order.'],
        ['`table.sort` memulangkan tiada nilai; ia mengubah table yang diberi.', '`table.sort` returns no value; it changes the table it is given.'],
      )),
    S('detailed_theory',
      P('`table.sort(t, cmp)` menyusun semula elemen `t[1..#t]` di tempat — tiada array baharu dicipta dan tiada nilai dipulangkan. Tanpa pembanding, ia membandingkan dengan `<`, jadi semua elemen mesti jenis yang boleh dibandingkan bersama: array nombor dan string bercampur gagal dengan `attempt to compare string < number`, dan array table gagal dengan `attempt to compare table < table`. Perhatikan bahawa ralat ini datang dari dalam fungsi C pengisih, jadi mesej yang diukur tidak mempunyai nombor baris `example:N` — anda perlu mengenal pasti panggilan `table.sort` sendiri.',
        '`table.sort(t, cmp)` rearranges the elements `t[1..#t]` in place — no new array is created and no value is returned. Without a comparator it compares with `<`, so all elements must be of types that compare with each other: an array mixing numbers and strings fails with `attempt to compare string < number`, and an array of tables fails with `attempt to compare table < table`. Notice that these errors come from inside the C sort function, so the measured message has no `example:N` line number — you have to identify the `table.sort` call yourself.'),
      P('Algoritma isihan Luau tidak **stabil**: dua elemen yang pembanding anggap sama (tiada yang "sebelum" yang lain) tidak semestinya mengekalkan susunan asal. Dalam papan pendahulu, ini bermakna dua pemain dengan skor sama boleh bertukar tempat antara kemas kini — kelihatan seperti pepijat kepada pemain. Penyelesaiannya ialah **pemutus seri**: apabila kunci utama sama, bandingkan kunci kedua yang unik (nama, ID atau masa ketibaan). Pembanding juga mesti ketat dan konsisten (LUAU103 4.2); pembanding `<=` boleh menimbulkan `invalid order function for sorting`. Untuk mengisih tanpa mengubah asal, isih `table.clone(t)`.',
        'Luau’s sort algorithm is not **stable**: two elements the comparator considers equal (neither "before" the other) do not necessarily keep their original order. In a leaderboard this means two players with the same score may swap places between updates — which looks like a bug to players. The fix is a **tie-breaker**: when the primary key is equal, compare a unique secondary key (name, ID or arrival time). The comparator must also be strict and consistent (LUAU103 4.2); a `<=` comparator can raise `invalid order function for sorting`. To sort without changing the original, sort `table.clone(t)`.')),
    S('technical_terminology', TERMS('array', 'callback', 'higher-order-function', 'algorithm')),
    S('syntax_rules',
      UL(
        ['`table.sort(scores)` — menaik; `table.sort(scores, function(a, b) return a > b end)` — menurun.', '`table.sort(scores)` — ascending; `table.sort(scores, function(a, b) return a > b end)` — descending.'],
        ['Jangan tulis `local sorted = table.sort(t)` — hasilnya tiada nilai.', 'Do not write `local sorted = table.sort(t)` — the result is no value.'],
        ['Salinan diisih: `local sorted = table.clone(t); table.sort(sorted)`.', 'A sorted copy: `local sorted = table.clone(t); table.sort(sorted)`.'],
      )),
    S('code_demonstration',
      CODE('sort-basics', 'luau', 'luau', ['Isihan asas: nombor, string, menurun', 'Basic sorting: numbers, strings, descending'], `
local prices = {120, 15, 75, 300, 15}
table.sort(prices)
print(table.concat(prices, " "))

local names = {"ben", "Aina", "chen", "Zara"}
table.sort(names)
print(table.concat(names, " "))

table.sort(names, function(a, b) return a:lower() < b:lower() end)
print(table.concat(names, " "))

table.sort(prices, function(a, b) return a > b end)
print(table.concat(prices, " "))
`, '15 15 75 120 300\nAina Zara ben chen\nAina ben chen Zara\n300 120 75 15 15'),
      EXPLAIN('sort-basics',
        ['1–3', 'Nombor diisih menaik dengan `<`.', 'Numbers sort ascending with `<`.'],
        ['5–7', 'String mengikut kod bait: huruf besar (A, Z) sebelum huruf kecil.', 'Strings by byte code: uppercase (A, Z) before lowercase.'],
        ['9–10', 'Pembanding tidak peka huruf: bandingkan versi huruf kecil.', 'A case-insensitive comparator: compare lowercase versions.'],
        ['12–13', '`a > b` — menurun.', '`a > b` — descending.'])),
    S('complete_examples',
      CODE('shop-sort', 'luau', 'luau', ['Mengisih item kedai dengan pemutus seri', 'Sorting shop items with a tie-breaker'], `
local shop = {
  {name = "Potion", price = 50, id = 3},
  {name = "Sword", price = 200, id = 1},
  {name = "Elixir", price = 50, id = 2},
  {name = "Shield", price = 150, id = 4},
}

table.sort(shop, function(a, b)
  if a.price ~= b.price then
    return a.price < b.price
  end
  return a.id < b.id
end)

for _, item in shop do
  print(\`{item.name} ({item.price})\`)
end
`, 'Elixir (50)\nPotion (50)\nShield (150)\nSword (200)', {
        debug: BUG(`
local shop = {{name = "Potion", price = 50}, {name = "Sword", price = 200}}
table.sort(shop)
print(shop[1].name)
`, 'attempt to compare table < table',
          'Tanpa pembanding, `table.sort` menggunakan `<` pada elemen — tetapi table tidak boleh dibandingkan dengan `<`. Mesej tidak mempunyai nombor baris kerana ralat berlaku di dalam fungsi C pengisih; cari panggilan `table.sort`. Berikan pembanding yang membandingkan medan: `function(a, b) return a.price < b.price end`.',
          'Without a comparator, `table.sort` uses `<` on the elements — but tables cannot be compared with `<`. The message has no line number because the error happens inside the C sort function; look for the `table.sort` call. Provide a comparator that compares a field: `function(a, b) return a.price < b.price end`.'),
      }),
      EXPLAIN('shop-sort',
        ['1–6', 'Dua item dengan harga sama (50); setiap item mempunyai `id` unik.', 'Two items with the same price (50); every item has a unique `id`.'],
        ['8–13', 'Harga menaik; jika sama, `id` memutuskan — susunan sentiasa sama.', 'Price ascending; if equal, `id` decides — the order is always the same.'],
        ['15–17', 'Elixir (id 2) sebelum Potion (id 3).', 'Elixir (id 2) comes before Potion (id 3).']),
      CODE('sorted-copy', 'luau', 'luau', ['Mengisih salinan, bukan asal', 'Sorting a copy, not the original'], `
local joinOrder = {"Chen", "Aina", "Ben"}

local function sortedCopy(list: {string}): {string}
  local copy = table.clone(list)
  table.sort(copy)
  return copy
end

local alphabetical = sortedCopy(joinOrder)
print("alphabetical:", table.concat(alphabetical, " "))
print("join order:  ", table.concat(joinOrder, " "))
`, 'alphabetical:\tAina Ben Chen\njoin order:  \tChen Aina Ben', {
        debug: BUG(`
local scores = {40, 90, 75}
local sorted = table.sort(scores)
print("top score:", sorted[1])
`, 'example:3: attempt to index nil with number',
          '`table.sort` mengisih `scores` di tempat dan memulangkan **tiada nilai**, jadi `sorted` ialah `nil` dan `sorted[1]` gagal. Gunakan array itu sendiri selepas mengisih (`scores[1]`), atau `table.clone` dahulu jika asal mesti kekal.',
          '`table.sort` sorts `scores` in place and returns **no value**, so `sorted` is `nil` and `sorted[1]` fails. Use the array itself after sorting (`scores[1]`), or `table.clone` first if the original must stay unchanged.'),
      }),
      EXPLAIN('sorted-copy',
        ['1–7', '`table.clone` memberi array baharu; hanya salinan diisih.', '`table.clone` gives a new array; only the copy is sorted.'],
        ['9–11', 'Susunan menyertai asal kekal untuk kegunaan lain.', 'The original join order stays available for other uses.'])),
    S('line_by_line',
      EXPLAIN('shop-sort',
        ['9', '`if a.price ~= b.price` — kunci utama berbeza menentukan susunan; hanya seri jatuh ke pemutus seri.', '`if a.price ~= b.price` — a differing primary key decides the order; only ties fall through to the tie-breaker.']),
      EXPLAIN('sort-basics',
        ['9', '`a:lower() < b:lower()` dinilai bagi setiap perbandingan — mudah, tetapi mencipta string baharu setiap kali.', '`a:lower() < b:lower()` is evaluated for every comparison — simple, but it creates new strings each time.'])),
    S('why_this_way',
      P('Mengapa isih di tempat? Kerana ia tidak memperuntukkan array baharu — penting apabila mengisih kerap dalam permainan. Mengapa tidak stabil? Kerana algoritma isihan tidak stabil yang pantas (seperti introsort) tidak memerlukan memori tambahan. Kosnya ialah anda mesti menyediakan pemutus seri jika susunan elemen sama penting.',
        'Why sort in place? Because it allocates no new array — important when sorting often in a game. Why not stable? Because fast unstable algorithms (such as introsort) need no extra memory. The cost is that you must provide a tie-breaker if the order of equal elements matters.'),
      P('Isih asal **apabila** tiada kod lain bergantung pada susunannya; isih salinan **apabila** susunan asal bermakna (susunan menyertai, susunan ketibaan); tambah pemutus seri **apabila** output dipaparkan kepada pemain.', 'Sort the original **when** no other code depends on its order; sort a copy **when** the original order is meaningful (join order, arrival order); add a tie-breaker **when** the output is shown to players.')),
    S('execution_flow',
      OL(
        ['`table.sort(shop, cmp)` memanggil `cmp` berulang kali pada pasangan elemen.', '`table.sort(shop, cmp)` calls `cmp` repeatedly on pairs of elements.'],
        ['Setiap panggilan membandingkan harga; untuk Potion dan Elixir (50, 50), `id` memutuskan.', 'Each call compares prices; for Potion and Elixir (50, 50), `id` decides.'],
        ['Elemen dalam `shop` disusun semula di tempat; gelung mencetak susunan baharu.', 'The elements of `shop` are rearranged in place; the loop prints the new order.'],
      )),
    S('memory_behaviour',
      P('`table.sort` hanya menukar rujukan dalam bahagian array; table item itu sendiri tidak disalin. Mengisih salinan dengan `table.clone` memperuntukkan satu array baharu (rujukan sahaja — item dikongsi). Pembanding yang mencipta string (`a:lower()`) memperuntukkan memori pada setiap perbandingan; untuk senarai besar, kira kunci sekali.', '`table.sort` only swaps references in the array part; the item tables themselves are not copied. Sorting a copy with `table.clone` allocates one new array (references only — the items are shared). A comparator that creates strings (`a:lower()`) allocates memory on every comparison; for large lists, compute the keys once.')),
    S('alternative_implementations',
      P('Kira kunci sekali (corak "hiasi–isih"), supaya pembanding hanya membandingkan nombor:', 'Compute keys once (the "decorate–sort" pattern), so the comparator only compares numbers:'),
      CODE('decorate-sort', 'luau', 'luau', ['Kunci dikira sekali', 'Keys computed once'], `
local enemies = {
  {name = "orc", x = 9, y = 2}, {name = "bat", x = 1, y = 1}, {name = "imp", x = 3, y = 4},
}
local px, py = 0, 0
local distance: {[any]: number} = {}
for _, e in enemies do
  distance[e] = math.sqrt((e.x - px) ^ 2 + (e.y - py) ^ 2)
end

table.sort(enemies, function(a, b) return distance[a] < distance[b] end)
for _, e in enemies do
  print(e.name, string.format("%.2f", distance[e]))
end
`, 'bat\t1.41\nimp\t5.00\norc\t9.22'),
      EXPLAIN('decorate-sort',
        ['1–4', 'Musuh dengan kedudukan; pemain di (0, 0).', 'Enemies with positions; the player is at (0, 0).'],
        ['5–8', 'Jarak dikira **sekali** bagi setiap musuh dan disimpan dalam table dikunci oleh table musuh.', 'The distance is computed **once** per enemy and stored in a table keyed by the enemy table.'],
        ['10–13', 'Pembanding hanya mencari nombor — terdekat dahulu.', 'The comparator only looks up numbers — nearest first.'])),
    S('common_mistakes',
      UL(
        ['Mengisih array bercampur jenis tanpa pembanding.', 'Sorting a mixed-type array without a comparator.'],
        ['Menggunakan nilai pulangan `table.sort`.', 'Using the return value of `table.sort`.'],
        ['Tiada pemutus seri, jadi elemen yang sama bertukar tempat.', 'No tie-breaker, so equal elements swap places.'],
        ['Mengisih array asal apabila kod lain bergantung pada susunannya.', 'Sorting the original array when other code depends on its order.'],
      )),
    S('debugging',
      P('Ralat dari `table.sort` sering tanpa nombor baris (ia datang dari C), jadi cari panggilan `table.sort` dan periksa jenis elemen. `attempt to compare X < Y` → jenis bercampur atau table tanpa pembanding. `invalid order function for sorting` → pembanding tidak ketat. Hasil yang salah tetapi tiada ralat → logik pembanding terbalik atau tiada pemutus seri. Fungsi semakan jenis membantu:',
        'Errors from `table.sort` often have no line number (they come from C), so find the `table.sort` call and inspect the element types. `attempt to compare X < Y` → mixed types or tables without a comparator. `invalid order function for sorting` → the comparator is not strict. Wrong results with no error → the comparator logic is reversed or there is no tie-breaker. A type-check helper helps:'),
      CODE('sort-check', 'luau', 'luau', ['Menyemak jenis sebelum mengisih', 'Checking types before sorting'], `
local function sortableType(list: {any}): string?
  local kind = nil
  for i, v in list do
    local t = typeof(v)
    if t ~= "number" and t ~= "string" then
      return \`element {i} is a {t}; pass a comparator\`
    end
    kind = kind or t
    if t ~= kind then
      return \`element {i} is a {t}, expected {kind}\`
    end
  end
  return nil
end

print(sortableType({3, 1, 2}))
print(sortableType({3, "a", 1}))
print(sortableType({{}, {}}))
`, 'nil\nelement 2 is a string, expected number\nelement 1 is a table; pass a comparator'),
      EXPLAIN('sort-check',
        ['1–14', 'Pastikan setiap elemen nombor atau string, dan semuanya jenis yang sama.', 'Make sure every element is a number or string, and all of the same type.'],
        ['16–18', 'Array nombor → `nil` (tiada masalah); jenis bercampur dan table dilaporkan dengan indeks.', 'An array of numbers → `nil` (no problem); mixed types and tables are reported with an index.'])),
    S('performance',
      P('`table.sort` ialah O(n log n) perbandingan. Pembanding Luau menambah kos panggilan fungsi bagi setiap perbandingan, jadi untuk array nombor menaik, `table.sort(t)` tanpa pembanding lebih pantas. Jika senarai berubah sedikit setiap bingkai (contohnya papan pendahulu), mengisih semula setiap bingkai membazir — isih hanya apabila skor berubah.', '`table.sort` makes O(n log n) comparisons. A Luau comparator adds a function call per comparison, so for ascending numeric arrays, `table.sort(t)` without a comparator is faster. If a list changes slightly every frame (for example a leaderboard), re-sorting every frame is wasteful — sort only when scores change.')),
    S('software_engineering',
      P('Pembanding disalin di setiap tempat berbanding pembina pembanding:', 'Comparators copied everywhere versus a comparator builder:'),
      CODE('poor-copied-comparators', 'luau', 'luau', ['Pelaksanaan lemah: pembanding disalin', 'Poor implementation: copied comparators'], `
local units = {{name = "B", hp = 5}, {name = "A", hp = 5}, {name = "C", hp = 9}}
table.sort(units, function(a, b) return a.hp > b.hp end)
print(units[1].name)
table.sort(units, function(a, b) return a.name < b.name end)
print(units[1].name)
`, 'C\nA'),
      EXPLAIN('poor-copied-comparators',
        ['1–3', 'Pembanding hp tanpa pemutus seri — A dan B (hp 5) boleh dalam sebarang susunan.', 'An hp comparator without a tie-breaker — A and B (hp 5) may be in either order.'],
        ['4–5', 'Pembanding lain ditulis semula dari awal di tempat lain.', 'Another comparator written from scratch elsewhere.']),
      CODE('improved-comparator-builder', 'luau', 'luau', ['Pelaksanaan lebih baik: pembina pembanding', 'Improved implementation: a comparator builder'], `
local function byField(field: string, descending: boolean?)
  return function(a, b): boolean
    if a[field] ~= b[field] then
      if descending then return a[field] > b[field] end
      return a[field] < b[field]
    end
    return a.name < b.name
  end
end

local units = {{name = "B", hp = 5}, {name = "A", hp = 5}, {name = "C", hp = 9}}
table.sort(units, byField("hp", true))
print(units[1].name, units[2].name, units[3].name)
`, 'C\tA\tB'),
      EXPLAIN('improved-comparator-builder',
        ['1–9', 'Kilang (closure) yang memulangkan pembanding untuk sebarang medan, sentiasa dengan nama sebagai pemutus seri.', 'A factory (closure) returning a comparator for any field, always with the name as a tie-breaker.'],
        ['11–13', 'hp menurun; A sebelum B kerana pemutus seri.', 'hp descending; A before B because of the tie-breaker.'])),
    S('industry_use_cases',
      UL(
        ['Papan pendahulu mengisih mengikut skor dengan masa pencapaian sebagai pemutus seri.', 'Leaderboards sort by score with achievement time as a tie-breaker.'],
        ['Sistem sasaran AI mengisih musuh mengikut jarak (dengan jarak dikira sekali).', 'AI targeting systems sort enemies by distance (with distances computed once).'],
        ['UI kedai menyediakan beberapa susunan (harga, nama, kelangkaan) melalui pembina pembanding.', 'Shop UIs offer several orders (price, name, rarity) through comparator builders.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah medan `rarity` pada `shop-sort` dan isih mengikut kelangkaan, kemudian harga.', 'Add a `rarity` field to `shop-sort` and sort by rarity, then price.'],
        ['Gunakan `byField("name")` dalam `improved-comparator-builder`.', 'Use `byField("name")` in `improved-comparator-builder`.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Papan pendahulu dengan kedudukan seri.** Isih pemain mengikut skor (menurun, nama sebagai pemutus seri) dan beri kedudukan yang sama kepada skor yang sama ("1, 2, 2, 4").', '**A leaderboard with tied ranks.** Sort players by score (descending, name as tie-breaker) and give equal scores the same rank ("1, 2, 2, 4").'),
      CODE('ranked-board', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local players = {
  {name = "Chen", score = 80}, {name = "Aina", score = 95},
  {name = "Ben", score = 80}, {name = "Dewi", score = 60},
}
table.sort(players, function(a, b)
  if a.score ~= b.score then return a.score > b.score end
  return a.name < b.name
end)

local rank = 0
for i, p in players do
  if i == 1 or p.score ~= players[i - 1].score then
    rank = i
  end
  print(rank, p.name, p.score)
end
`, '1\tAina\t95\n2\tBen\t80\n2\tChen\t80\n4\tDewi\t60'),
      EXPLAIN('ranked-board',
        ['1–8', 'Skor menurun dengan nama sebagai pemutus seri.', 'Score descending with the name as a tie-breaker.'],
        ['10–16', 'Kedudukan hanya berubah apabila skor berbeza daripada pemain sebelumnya; ia melompat ke `i` ("kedudukan standard pertandingan").', 'The rank only changes when the score differs from the previous player; it jumps to `i` ("standard competition ranking").'])),
    S('summary',
      UL(
        ['`table.sort` mengisih di tempat dan memulangkan tiada nilai.', '`table.sort` sorts in place and returns no value.'],
        ['Tanpa pembanding: nombor sahaja atau string sahaja (kod bait).', 'Without a comparator: all numbers or all strings (byte order).'],
        ['Tidak stabil — tambah pemutus seri unik.', 'Not stable — add a unique tie-breaker.'],
        ['Isih `table.clone(t)` untuk mengekalkan susunan asal.', 'Sort `table.clone(t)` to keep the original order.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah `"Zara"` diisih sebelum `"ben"`?', 'Why does `"Zara"` sort before `"ben"`?'],
        ['Apakah yang dipulangkan oleh `table.sort`?', 'What does `table.sort` return?'],
        ['Mengapakah pemutus seri diperlukan dalam papan pendahulu?', 'Why is a tie-breaker needed in a leaderboard?'],
        ['Mengapakah ralat `attempt to compare table < table` tidak mempunyai nombor baris?', 'Why does the `attempt to compare table < table` error have no line number?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library: table.sort', url: `${LUAU}/library#table-library` },
        { title: 'Roblox Engine API — table.sort', url: `${DOCS}/reference/engine/libraries/table#sort` },
        { title: 'Programming in Lua (1st ed.) — 19.3 Sort', url: 'https://www.lua.org/pil/19.3.html' },
        { title: 'Wikipedia — Sorting algorithm: stability', url: 'https://en.wikipedia.org/wiki/Sorting_algorithm#Stability' },
      )),
  ],
};

export const LUAU104_M1 = [LUAU104_1_1, LUAU104_1_2, LUAU104_1_3];
