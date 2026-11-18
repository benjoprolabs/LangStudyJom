import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU104 · Module 2 — Dictionaries (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 2.1 Keys and values ───────────────────────────────────────────────────

export const LUAU104_2_1: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 2,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Mencipta [[dictionary]] dan membaca, menulis serta memadam kunci.', 'Create [[dictionary|dictionaries]] and read, write and delete keys.'],
        ['Membezakan `t.key`, `t["key"]` dan `t[key]`.', 'Distinguish `t.key`, `t["key"]` and `t[key]`.'],
        ['Menggunakan kunci bukan string dan mengetahui kunci yang dilarang (`nil`, NaN).', 'Use non-string keys and know the forbidden keys (`nil`, NaN).'],
        ['Menggunakan dictionary sebagai set untuk carian O(1).', 'Use a dictionary as a set for O(1) lookups.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1: array dan pustaka table.', 'Module 1: arrays and the table library.'],
      )),
    S('introduction',
      P('Array menjawab soalan "apakah elemen ke-n?"; dictionary menjawab "apakah nilai untuk nama ini?". Dalam permainan Roblox, data pemain (`coins`, `level`, `xp`), harga kedai mengikut nama item, dan tetapan permainan semuanya dictionary. Sintaksnya ringkas, tetapi terdapat tiga perangkap yang sering mengelirukan pemula: perbezaan antara `t.key` dan `t[key]`, membaca kunci yang tiada (yang memberi `nil` secara senyap), dan peraturan bahawa `#` tidak mengira kunci dictionary. Kuliah ini menerangkan setiap satu dengan contoh yang dijalankan.',
        'An array answers "what is element n?"; a dictionary answers "what is the value for this name?". In a Roblox game, player data (`coins`, `level`, `xp`), shop prices by item name, and game settings are all dictionaries. The syntax is simple, but three traps often confuse beginners: the difference between `t.key` and `t[key]`, reading a missing key (which silently gives `nil`), and the rule that `#` does not count dictionary keys. This lecture explains each with executed examples.'),
      KEY('`t.name` ialah singkatan untuk `t["name"]` — bukan `t[name]`. Kunci yang tiada memberi `nil`.', '`t.name` is shorthand for `t["name"]` — not `t[name]`. A missing key gives `nil`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Constructor: `{coins = 50}` ialah `{["coins"] = 50}`; `{[expr] = v}` untuk kunci yang dikira.', 'Constructor: `{coins = 50}` is `{["coins"] = 50}`; `{[expr] = v}` for computed keys.'],
        ['`t.coins` → `t["coins"]`; `t[k]` menggunakan **nilai** pemboleh ubah `k`.', '`t.coins` → `t["coins"]`; `t[k]` uses the **value** of the variable `k`.'],
        ['Padam kunci: `t.coins = nil`.', 'Delete a key: `t.coins = nil`.'],
        ['Kunci boleh menjadi sebarang nilai kecuali `nil` dan NaN; `1` dan `"1"` ialah kunci berbeza.', 'Keys can be any value except `nil` and NaN; `1` and `"1"` are different keys.'],
        ['`#d` ialah 0 untuk dictionary tulen; kira kunci dengan gelung.', '`#d` is 0 for a pure dictionary; count keys with a loop.'],
      )),
    S('detailed_theory',
      P('Dictionary menyimpan pasangan kunci–nilai dalam bahagian hash table. Mencari kunci ialah purata O(1): Luau mengira hash kunci dan pergi terus ke slotnya. Kunci dibandingkan dengan identiti mentah: string yang sama ialah kunci yang sama (string Luau dinternkan), nombor dibandingkan mengikut nilai (`1` dan `1.0` ialah kunci yang sama), tetapi `1` dan `"1"` berbeza, dan dua table berasingan sentiasa kunci berbeza walaupun kandungannya sama. Kunci `nil` ditolak dengan `table index is nil` dan NaN dengan `table index is NaN`, kerana kedua-duanya tidak boleh dicari semula.',
        'A dictionary stores key–value pairs in the hash part of a table. Looking up a key is O(1) on average: Luau hashes the key and goes straight to its slot. Keys are compared by raw identity: equal strings are the same key (Luau strings are interned), numbers compare by value (`1` and `1.0` are the same key), but `1` and `"1"` differ, and two separate tables are always different keys even with equal contents. A `nil` key is rejected with `table index is nil` and NaN with `table index is NaN`, because neither could ever be looked up again.'),
      P('Membaca kunci yang tiada **bukan ralat** — ia memberi `nil`. Ini memudahkan semakan ("adakah pemain ini mempunyai lencana?"), tetapi menyembunyikan salah ejaan: `stats.Kills` (huruf besar) apabila kuncinya `kills` memberi `nil`, dan ralat hanya muncul kemudian sebagai `attempt to perform arithmetic (add) on nil and number`. Corak "kira kejadian" (`counts[w] = counts[w] + 1`) gagal dengan mesej yang sama pada kali pertama kerana kunci belum wujud; gunakan `(counts[w] or 0) + 1`. Akhir sekali, ingat bahawa memadam kunci ialah menulis `nil`, dan dictionary tidak mempunyai susunan — kuliah 2.2 membincangkan lelaran.',
        'Reading a missing key is **not an error** — it gives `nil`. This makes checks easy ("does this player have the badge?"), but hides typos: `stats.Kills` (capital K) when the key is `kills` gives `nil`, and the error only appears later as `attempt to perform arithmetic (add) on nil and number`. The "count occurrences" pattern (`counts[w] = counts[w] + 1`) fails with the same message the first time because the key does not exist yet; use `(counts[w] or 0) + 1`. Finally, remember that deleting a key means writing `nil`, and dictionaries have no order — lecture 2.2 covers iteration.')),
    S('technical_terminology', TERMS('dictionary', 'table', 'nil', 'truthiness')),
    S('syntax_rules',
      UL(
        ['`local stats = {coins = 50, ["max hp"] = 100}` — kunci dengan ruang memerlukan kurungan.', '`local stats = {coins = 50, ["max hp"] = 100}` — keys with spaces need brackets.'],
        ['`stats.coins += 10`, `stats["max hp"]`, `stats[keyVariable]`.', '`stats.coins += 10`, `stats["max hp"]`, `stats[keyVariable]`.'],
        ['Jenis: `{[string]: number}` — dictionary string kepada nombor.', 'Type: `{[string]: number}` — a dictionary from strings to numbers.'],
      )),
    S('code_demonstration',
      CODE('player-stats', 'luau', 'luau', ['Statistik pemain sebagai dictionary', 'Player statistics as a dictionary'], `
local stats: {[string]: number} = {coins = 50, level = 3}
stats.coins += 25
stats["xp"] = 120
print(stats.coins, stats.level, stats.xp, stats.gems)

local field = "level"
print(stats[field], stats.field)

stats.level = nil
print(stats.level, #stats)
`, '75\t3\t120\tnil\n3\tnil\nnil\t0'),
      EXPLAIN('player-stats',
        ['1–4', 'Tulis dengan titik atau kurungan; `gems` tiada → `nil`.', 'Write with a dot or brackets; `gems` is missing → `nil`.'],
        ['6–7', '`stats[field]` menggunakan nilai `field` ("level"); `stats.field` mencari kunci literal "field".', '`stats[field]` uses the value of `field` ("level"); `stats.field` looks up the literal key "field".'],
        ['9–10', 'Menulis `nil` memadam kunci; `#` dictionary ialah 0.', 'Writing `nil` deletes the key; `#` of a dictionary is 0.'])),
    S('complete_examples',
      CODE('word-count', 'luau', 'luau', ['Mengira kejadian dengan nilai lalai', 'Counting occurrences with a default'], `
local chat = {"gg", "lol", "gg", "nice", "gg", "lol"}
local counts: {[string]: number} = {}
for _, word in chat do
  counts[word] = (counts[word] or 0) + 1
end
print(counts.gg, counts.lol, counts.nice, counts.wow)
`, '3\t2\t1\tnil', {
        debug: BUG(`
local chat = {"gg", "lol", "gg"}
local counts = {}
for _, word in chat do
  counts[word] = counts[word] + 1
end
`, 'example:4: attempt to perform arithmetic (add) on nil and number',
          'Kali pertama perkataan muncul, `counts[word]` belum wujud dan memberi `nil`; `nil + 1` gagal. Mesej menyebut "nil and number" — tanda bahawa kunci tiada. Berikan nilai lalai: `(counts[word] or 0) + 1`.',
          'The first time a word appears, `counts[word]` does not exist yet and gives `nil`; `nil + 1` fails. The message says "nil and number" — a sign that the key is missing. Provide a default: `(counts[word] or 0) + 1`.'),
      }),
      EXPLAIN('word-count',
        ['1–2', 'Array perkataan dan dictionary kiraan kosong.', 'An array of words and an empty count dictionary.'],
        ['3–5', '`counts[word] or 0` memberi 0 untuk perkataan baharu, kemudian tambah 1.', '`counts[word] or 0` gives 0 for a new word, then adds 1.'],
        ['6', 'Perkataan yang tidak pernah muncul ("wow") memberi `nil`.', 'A word that never appeared ("wow") gives `nil`.']),
      CODE('key-types', 'luau', 'luau', ['Kunci bukan string', 'Non-string keys'], `
local grid = {}
grid[1] = "number one"
grid["1"] = "string one"
grid[1.0] = "replaced"
print(grid[1], grid["1"])

local owner = {}
local swordA, swordB = {power = 5}, {power = 5}
owner[swordA] = "Aina"
owner[swordB] = "Ben"
print(owner[swordA], owner[swordB], swordA == swordB)

local unlocked = {[true] = "yes", [false] = "no"}
print(unlocked[2 > 1])
`, 'replaced\tstring one\nAina\tBen\tfalse\nyes', {
        debug: BUG(`
local prices = {sword = 100, bow = 80}
local selected = nil
prices[selected] = 50
`, 'example:3: table index is nil',
          'Membaca `prices[nil]` hanya memberi `nil`, tetapi **menulis** dengan kunci `nil` ialah ralat: kunci itu tidak boleh dicari semula. Ini biasanya bermakna pemboleh ubah kunci belum diisi — contohnya pemain belum memilih item. Semak `if selected then` sebelum menulis.',
          'Reading `prices[nil]` just gives `nil`, but **writing** with a `nil` key is an error: that key could never be looked up again. This usually means the key variable was never filled — for example the player has not selected an item yet. Check `if selected then` before writing.'),
      }),
      EXPLAIN('key-types',
        ['1–5', '`1` dan `1.0` ialah kunci yang sama (ditulis ganti); `"1"` ialah kunci berasingan.', '`1` and `1.0` are the same key (overwritten); `"1"` is a separate key.'],
        ['7–11', 'Table sebagai kunci: dua table dengan kandungan sama ialah dua kunci berbeza (identiti).', 'Tables as keys: two tables with equal contents are two different keys (identity).'],
        ['13–14', 'Boolean juga boleh menjadi kunci.', 'Booleans can be keys too.'])),
    S('line_by_line',
      EXPLAIN('player-stats',
        ['7', 'Perangkap klasik: `stats.field` ialah `stats["field"]` — titik sentiasa bermaksud nama literal.', 'The classic trap: `stats.field` is `stats["field"]` — a dot always means a literal name.']),
      EXPLAIN('word-count',
        ['4', '`(counts[word] or 0)` — kurungan penting supaya `or` dinilai sebelum `+`.', '`(counts[word] or 0)` — the parentheses matter so that `or` is evaluated before `+`.'])),
    S('why_this_way',
      P('Mengapa kunci yang tiada memberi `nil` dan bukan ralat? Kerana ia menjadikan semakan kewujudan murah dan ringkas (`if badges.firstWin then`). Kosnya ialah salah ejaan tidak ditangkap oleh VM — penganalisis jenis Luau, dengan jenis table yang tepat, boleh menangkapnya dalam Studio (diterangkan, tidak dijalankan di sini).',
        'Why does a missing key give `nil` rather than an error? Because it makes existence checks cheap and short (`if badges.firstWin then`). The cost is that typos are not caught by the VM — the Luau type analyser, with precise table types, can catch them in Studio (described, not run here).'),
      P('Gunakan dictionary **apabila** data dicapai dengan nama atau ID; gunakan array **apabila** susunan penting; gunakan `{[v] = true}` (set) **apabila** anda hanya perlu tahu sama ada sesuatu wujud.', 'Use a dictionary **when** data is reached by name or ID; use an array **when** order matters; use `{[v] = true}` (a set) **when** you only need to know whether something exists.')),
    S('execution_flow',
      OL(
        ['Constructor mencipta kunci "coins" dan "level" dalam bahagian hash.', 'The constructor creates the keys "coins" and "level" in the hash part.'],
        ['`stats.coins += 25` membaca 50, menambah, menulis 75.', '`stats.coins += 25` reads 50, adds, writes 75.'],
        ['`stats[field]` menilai `field` → "level" → 3.', '`stats[field]` evaluates `field` → "level" → 3.'],
        ['`stats.level = nil` membuang kunci; bacaan seterusnya memberi `nil`.', '`stats.level = nil` removes the key; the next read gives `nil`.'],
      )),
    S('memory_behaviour',
      P('Setiap entri hash menyimpan kunci dan nilai, jadi dictionary menggunakan lebih banyak memori bagi setiap elemen berbanding array. Kunci string tidak disalin: semua string yang sama berkongsi satu objek yang diinternkan. Table yang digunakan sebagai kunci kekal hidup selagi entri itu wujud — memadam entri (`owner[sword] = nil`) membenarkan table itu dikutip jika tiada rujukan lain.', 'Every hash entry stores both a key and a value, so a dictionary uses more memory per element than an array. String keys are not copied: all equal strings share one interned object. A table used as a key stays alive as long as that entry exists — deleting the entry (`owner[sword] = nil`) lets that table be collected if nothing else refers to it.')),
    S('alternative_implementations',
      P('Dictionary sebagai **set**: senarai larangan dengan carian O(1), berbanding `table.find` O(n):', 'A dictionary as a **set**: a ban list with O(1) lookup, compared with `table.find` O(n):'),
      CODE('ban-set', 'luau', 'luau', ['Set dengan nilai true', 'A set with true values'], `
local bannedList = {"cheater1", "spammer", "griefer"}
local banned: {[string]: boolean} = {}
for _, name in bannedList do
  banned[name] = true
end

for _, name in {"Aina", "spammer"} do
  print(name, if banned[name] then "blocked" else "allowed")
end
banned.spammer = nil
print("spammer", banned.spammer == true)
`, 'Aina\tallowed\nspammer\tblocked\nspammer\tfalse'),
      EXPLAIN('ban-set',
        ['1–5', 'Tukar array kepada set sekali: setiap nama menjadi kunci dengan nilai `true`.', 'Convert the array to a set once: every name becomes a key with the value `true`.'],
        ['7–9', 'Semakan ahli ialah satu carian hash; kunci yang tiada memberi `nil` (palsu).', 'Membership is one hash lookup; a missing key gives `nil` (falsy).'],
        ['10–11', 'Memadam ahli: tulis `nil`.', 'Removing a member: write `nil`.'])),
    S('common_mistakes',
      UL(
        ['Menulis `t.key` apabila maksudnya `t[key]` (atau sebaliknya).', 'Writing `t.key` when `t[key]` was meant (or the reverse).'],
        ['`counts[k] + 1` tanpa nilai lalai.', '`counts[k] + 1` without a default.'],
        ['Salah ejaan atau huruf besar/kecil dalam nama kunci.', 'Typos or wrong letter case in key names.'],
        ['Menggunakan `#` untuk mengira entri dictionary.', 'Using `#` to count dictionary entries.'],
      )),
    S('debugging',
      P('Apabila nilai dictionary ialah `nil` secara tidak dijangka, cetak semua kunci yang wujud — salah ejaan menjadi jelas apabila anda melihat `kills` di sebelah `Kills`. Jika anda mendapat `table index is nil`, kunci yang anda tulis datang daripada pemboleh ubah kosong. Fungsi pembantu berikut menyenaraikan kunci dalam susunan tetap:',
        'When a dictionary value is unexpectedly `nil`, print every key that exists — a typo becomes obvious when you see `kills` next to `Kills`. If you get `table index is nil`, the key you wrote came from an empty variable. The following helper lists the keys in a fixed order:'),
      CODE('list-keys', 'luau', 'luau', ['Menyenaraikan kunci untuk penyahpepijatan', 'Listing keys for debugging'], `
local function keysOf(d: {[any]: any}): string
  local keys = {}
  for k in d do
    table.insert(keys, tostring(k))
  end
  table.sort(keys)
  return table.concat(keys, ", ")
end

local stats = {kills = 3, deaths = 1, Assists = 2}
print(stats.assists)
print("keys:", keysOf(stats))
`, 'nil\nkeys:\tAssists, deaths, kills'),
      EXPLAIN('list-keys',
        ['1–8', 'Kumpul kunci sebagai string, isih untuk output yang stabil, gabungkan.', 'Collect the keys as strings, sort for stable output, join.'],
        ['10–12', '`stats.assists` ialah `nil`; senarai kunci menunjukkan sebabnya: "Assists" dengan huruf besar.', '`stats.assists` is `nil`; the key list shows why: "Assists" with a capital A.'])),
    S('performance',
      P('Carian, sisipan dan pemadaman dictionary ialah purata O(1). Kunci string yang pendek dan berulang sangat pantas kerana dinternkan. `table.find` pada array ialah O(n), jadi untuk semakan ahli berulang dalam senarai besar, bina set sekali. Mengira entri memerlukan lelaran O(n) — jika anda memerlukannya kerap, simpan kiraan secara berasingan.', 'Dictionary lookup, insertion and deletion are O(1) on average. Short, repeated string keys are very fast because they are interned. `table.find` on an array is O(n), so for repeated membership checks in large lists, build a set once. Counting entries needs an O(n) iteration — if you need it often, keep a separate count.')),
    S('software_engineering',
      P('Array selari berbanding dictionary:', 'Parallel arrays versus a dictionary:'),
      CODE('poor-parallel-arrays', 'luau', 'luau', ['Pelaksanaan lemah: array selari', 'Poor implementation: parallel arrays'], `
local itemNames = {"sword", "bow", "potion"}
local itemPrices = {100, 80, 15}
local function priceOf(name: string): number?
  local i = table.find(itemNames, name)
  return if i then itemPrices[i] else nil
end
table.remove(itemNames, 1)
print(priceOf("bow"))
`, '100'),
      EXPLAIN('poor-parallel-arrays',
        ['1–6', 'Nama dan harga dalam dua array; indeks mesti sepadan.', 'Names and prices in two arrays; the indices must match.'],
        ['7–8', 'Membuang dari satu array sahaja menyebabkan "bow" kini mendapat harga sword (100) — data rosak tanpa ralat.', 'Removing from only one array makes "bow" now get the sword’s price (100) — corrupted data with no error.']),
      CODE('improved-price-dict', 'luau', 'luau', ['Pelaksanaan lebih baik: dictionary', 'Improved implementation: a dictionary'], `
local prices: {[string]: number} = {sword = 100, bow = 80, potion = 15}
local function priceOf(name: string): number?
  return prices[name]
end
prices.sword = nil
print(priceOf("bow"), priceOf("sword"))
`, '80\tnil'),
      EXPLAIN('improved-price-dict',
        ['1–4', 'Setiap harga disimpan bersama namanya; carian O(1).', 'Each price is stored with its name; O(1) lookup.'],
        ['5–6', 'Membuang satu item tidak menjejaskan yang lain.', 'Removing one item does not affect the others.'])),
    S('industry_use_cases',
      UL(
        ['`leaderstats` dan data simpanan pemain dimodelkan sebagai dictionary nama → nilai.', '`leaderstats` and saved player data are modelled as name → value dictionaries.'],
        ['Cache mengikut `UserId` menyimpan data setiap pemain dalam dictionary.', 'Caches keyed by `UserId` store each player’s data in a dictionary.'],
        ['Set digunakan untuk senarai larangan, pencapaian yang dibuka dan zon yang dilawati.', 'Sets are used for ban lists, unlocked achievements and visited zones.'],
      )),
    S('practical_demonstration',
      OL(
        ['Dalam `word-count`, kira perkataan tanpa mengira huruf besar/kecil.', 'In `word-count`, count words case-insensitively.'],
        ['Tambah kunci `[2]` dan `["2"]` pada `key-types` dan ramalkan output.', 'Add the keys `[2]` and `["2"]` to `key-types` and predict the output.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Indeks pemain.** Diberi array rekod pemain, bina dictionary `id → rekod` untuk carian pantas, dan laporkan ID pendua.', '**A player index.** Given an array of player records, build an `id → record` dictionary for fast lookup, and report duplicate IDs.'),
      CODE('player-index', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local records = {
  {id = 101, name = "Aina"}, {id = 202, name = "Ben"},
  {id = 101, name = "Aina (alt)"}, {id = 303, name = "Chen"},
}

local byId: {[number]: {id: number, name: string}} = {}
local duplicates = {}
for _, r in records do
  if byId[r.id] then
    table.insert(duplicates, r.id)
  else
    byId[r.id] = r
  end
end

print(byId[202].name, byId[101].name, byId[999])
print("duplicates:", table.concat(duplicates, ","))
`, 'Ben\tAina\tnil\nduplicates:\t101'),
      EXPLAIN('player-index',
        ['1–4', 'Array rekod dengan satu ID pendua (101).', 'An array of records with one duplicate ID (101).'],
        ['6–14', 'Kunci nombor; jika ID sudah wujud, rekod pendua, jika tidak simpan.', 'Number keys; if the ID already exists, record a duplicate, otherwise store.'],
        ['16–17', 'Carian langsung mengikut ID; rekod pertama untuk 101 dikekalkan.', 'Direct lookup by ID; the first record for 101 is kept.'])),
    S('summary',
      UL(
        ['`t.name` = `t["name"]`; `t[k]` menggunakan nilai `k`.', '`t.name` = `t["name"]`; `t[k]` uses the value of `k`.'],
        ['Kunci yang tiada memberi `nil`; gunakan `or` untuk nilai lalai.', 'Missing keys give `nil`; use `or` for defaults.'],
        ['Kunci `nil`/NaN dilarang; `1` dan `"1"` berbeza; table sebagai kunci mengikut identiti.', '`nil`/NaN keys are forbidden; `1` and `"1"` differ; tables as keys by identity.'],
        ['Set `{[v] = true}` memberi semakan ahli O(1).', 'A set `{[v] = true}` gives O(1) membership checks.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah perbezaan antara `stats.field` dan `stats[field]`?', 'What is the difference between `stats.field` and `stats[field]`?'],
        ['Mengapakah `#{a = 1, b = 2}` ialah 0?', 'Why is `#{a = 1, b = 2}` equal to 0?'],
        ['Apakah yang berlaku apabila anda menulis `t[nil] = 1`?', 'What happens when you write `t[nil] = 1`?'],
        ['Bilakah set lebih baik daripada `table.find`?', 'When is a set better than `table.find`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Dictionaries', url: `${DOCS}/luau/dictionaries` },
        { title: 'Luau — Type checking: table types', url: `${LUAU}/typecheck#table-types` },
        { title: 'Programming in Lua (1st ed.) — 11.5 Sets and Bags', url: 'https://www.lua.org/pil/11.5.html' },
        { title: 'Lua 5.1 Reference Manual §2.5.7 — Table Constructors', url: 'https://www.lua.org/manual/5.1/manual.html#2.5.7' },
      )),
  ],
};

// ─── 2.2 Iterating dictionaries ────────────────────────────────────────────

export const LUAU104_2_2: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 2,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Melelar dictionary dengan [[generalized-iteration|iterasi umum]] dan `pairs`.', 'Iterate dictionaries with [[generalized-iteration|generalized iteration]] and `pairs`.'],
        ['Menerangkan bahawa susunan lelaran tidak ditentukan dan mengisih kunci apabila susunan penting.', 'Explain that iteration order is unspecified and sort keys when order matters.'],
        ['Mengubah suai dictionary semasa melelar dengan selamat.', 'Modify a dictionary safely while iterating.'],
        ['Membezakan `ipairs` (berhenti pada lubang) daripada iterasi umum.', 'Distinguish `ipairs` (stops at holes) from generalized iteration.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1: kunci dan nilai.', 'Lecture 2.1: keys and values.'],
        ['LUAU103 2.2: iterasi umum.', 'LUAU103 2.2: generalized iteration.'],
      )),
    S('introduction',
      P('Mengira jumlah nilai inventori, mencari pemain dengan skor tertinggi, menyimpan semua tetapan — semuanya memerlukan lawatan ke setiap kunci dictionary. Luau menyediakan iterasi umum (`for k, v in t`), yang berfungsi untuk array dan dictionary, serta `pairs` dan `ipairs` untuk keserasian dengan kod Lua. Peraturan paling penting dalam kuliah ini: **susunan lelaran dictionary tidak ditentukan**. Kod yang mencetak atau menyimpan data dalam susunan lelaran mungkin berkelakuan berbeza selepas kemas kini Luau atau apabila table dibina dengan cara lain — jadi kita akan mengisih kunci setiap kali susunan penting.',
        'Totalling an inventory’s value, finding the player with the top score, saving every setting — all need a visit to every key of a dictionary. Luau provides generalized iteration (`for k, v in t`), which works for arrays and dictionaries, plus `pairs` and `ipairs` for compatibility with Lua code. The most important rule in this lecture: **dictionary iteration order is unspecified**. Code that prints or saves data in iteration order may behave differently after a Luau update or when the table is built differently — so we will sort keys whenever order matters.'),
      KEY('Lelaran dictionary tiada susunan yang dijamin. Jika susunan penting: kumpul kunci → isih → lelar.', 'Dictionary iteration has no guaranteed order. If order matters: collect keys → sort → iterate.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`for k, v in t do` — setiap pasangan; `for k in t do` — kunci sahaja.', '`for k, v in t do` — every pair; `for k in t do` — keys only.'],
        ['`pairs(t)` setara untuk table biasa; `ipairs(t)` melawat 1, 2, 3… dan berhenti pada `nil` pertama.', '`pairs(t)` is equivalent for plain tables; `ipairs(t)` visits 1, 2, 3… and stops at the first `nil`.'],
        ['Semasa lelaran: menukar atau memadam kunci **sedia ada** dibenarkan; menambah kunci baharu tidak ditentukan.', 'During iteration: changing or deleting **existing** keys is allowed; adding new keys is undefined.'],
        ['Melelar `nil` gagal: `attempt to iterate over a nil value`.', 'Iterating `nil` fails: `attempt to iterate over a nil value`.'],
      )),
    S('detailed_theory',
      P('Iterasi umum melawat bahagian array dahulu (indeks 1, 2, … mengikut susunan), kemudian bahagian hash dalam susunan slot dalaman. Susunan slot bergantung pada nilai hash kunci, saiz table dan sejarah sisipan, jadi ia boleh berubah apabila table membesar atau antara versi Luau. Hasilnya, jumlah, kiraan, maksimum dan sebarang pengiraan yang tidak bergantung pada susunan adalah selamat; tetapi mencetak senarai, menyimpan ke rentetan, atau "memilih yang pertama" dalam susunan lelaran ialah pepijat tersembunyi. Penyelesaian standard ialah mengumpul kunci ke dalam array, mengisihnya, dan melelar array tersebut.',
        'Generalized iteration visits the array part first (indices 1, 2, … in order), then the hash part in internal slot order. Slot order depends on the keys’ hash values, the table size and the insertion history, so it can change when the table grows or between Luau versions. As a result, totals, counts, maximums and any order-independent computation are safe; but printing a list, saving to a string, or "picking the first one" in iteration order are hidden bugs. The standard fix is to collect the keys into an array, sort it, and iterate that array.'),
      P('Peraturan pengubahsuaian semasa lelaran datang daripada `next`, fungsi yang mendasari lelaran: menetapkan medan sedia ada kepada nilai baharu atau `nil` adalah selamat, tetapi menambah kunci baharu boleh menyebabkan table disusun semula dan kunci dilangkau atau dilawati dua kali — tingkah laku tidak ditentukan, walaupun ia "nampak berfungsi" dalam ujian kecil. Jika anda perlu menambah kunci, kumpulkan dahulu, kemudian tambah selepas gelung. Akhir sekali, `ipairs` berguna apabila anda sengaja mahu berhenti pada lubang pertama, tetapi untuk dictionary ia tidak melawat apa-apa kecuali kunci 1, 2, ….',
        'The rules for modifying during iteration come from `next`, the function underlying iteration: setting an existing field to a new value or to `nil` is safe, but adding new keys can cause the table to be rehashed and keys to be skipped or visited twice — undefined behaviour, even if it "seems to work" in small tests. If you need to add keys, collect them first and add them after the loop. Finally, `ipairs` is useful when you deliberately want to stop at the first hole, but for dictionaries it visits nothing except keys 1, 2, ….')),
    S('technical_terminology', TERMS('generalized-iteration', 'dictionary', 'iterator', 'algorithm')),
    S('syntax_rules',
      UL(
        ['`for name, score in scores do … end`.', '`for name, score in scores do … end`.'],
        ['Kunci diisih: `local keys = {} for k in t do table.insert(keys, k) end table.sort(keys)`.', 'Sorted keys: `local keys = {} for k in t do table.insert(keys, k) end table.sort(keys)`.'],
        ['`for i, v in ipairs(list) do … end` — berhenti pada `nil` pertama.', '`for i, v in ipairs(list) do … end` — stops at the first `nil`.'],
      )),
    S('code_demonstration',
      CODE('inventory-total', 'luau', 'luau', ['Lelaran yang tidak bergantung pada susunan', 'Order-independent iteration'], `
local inventory: {[string]: number} = {potion = 5, arrow = 40, gem = 2}
local value: {[string]: number} = {potion = 15, arrow = 1, gem = 250}

local totalItems, totalValue = 0, 0
local priciest, priciestValue = nil, -1
for item, count in inventory do
  totalItems += count
  local worth = count * value[item]
  totalValue += worth
  if worth > priciestValue then
    priciest, priciestValue = item, worth
  end
end
print(totalItems, totalValue, priciest)
`, '47\t615\tgem'),
      EXPLAIN('inventory-total',
        ['1–2', 'Dua dictionary dengan kunci yang sama: kiraan dan nilai seunit.', 'Two dictionaries with the same keys: counts and unit values.'],
        ['4–13', 'Jumlah dan maksimum tidak bergantung pada susunan lawatan, jadi selamat.', 'Totals and the maximum do not depend on visit order, so they are safe.'],
        ['14', '5 + 40 + 2 = 47; 75 + 40 + 500 = 615; gem paling bernilai.', '5 + 40 + 2 = 47; 75 + 40 + 500 = 615; gem is the most valuable.'])),
    S('complete_examples',
      CODE('sorted-report', 'luau', 'luau', ['Laporan dalam susunan tetap', 'A report in a fixed order'], `
local scores: {[string]: number} = {Chen = 70, Aina = 95, Ben = 70, Dewi = 40}

local names: {string} = {}
for name in scores do
  table.insert(names, name)
end
table.sort(names, function(a, b)
  if scores[a] ~= scores[b] then return scores[a] > scores[b] end
  return a < b
end)

for rank, name in names do
  print(rank, name, scores[name])
end
`, '1\tAina\t95\n2\tBen\t70\n3\tChen\t70\n4\tDewi\t40', {
        debug: BUG(`
local profile = {name = "Aina", settings = nil}
local count = 0
for key, value in profile.settings do
  count += 1
end
print(count)
`, 'example:3: attempt to iterate over a nil value',
          '`profile.settings` ialah `nil` (medan tidak pernah diisi), dan Luau tidak boleh melelar `nil`. Mesej tidak menyebut nama medan, jadi semak setiap ungkapan selepas `in` pada baris itu. Berikan nilai lalai: `for key, value in profile.settings or {} do`.',
          '`profile.settings` is `nil` (the field was never filled), and Luau cannot iterate `nil`. The message does not name the field, so check every expression after `in` on that line. Provide a default: `for key, value in profile.settings or {} do`.'),
      }),
      EXPLAIN('sorted-report',
        ['1', 'Skor dalam dictionary — tiada susunan.', 'Scores in a dictionary — no order.'],
        ['3–10', 'Kumpul kunci ke dalam array, kemudian isih: skor menurun, nama sebagai pemutus seri.', 'Collect the keys into an array, then sort: score descending, name as a tie-breaker.'],
        ['12–14', 'Lelar array yang diisih — output sama setiap kali.', 'Iterate the sorted array — the same output every time.']),
      CODE('safe-modify', 'luau', 'luau', ['Mengubah suai semasa melelar dengan selamat', 'Modifying safely while iterating'], `
local buffs: {[string]: number} = {speed = 2, shield = 0, rage = 5, stealth = 0}

for name, seconds in buffs do
  if seconds <= 0 then
    buffs[name] = nil
  else
    buffs[name] = seconds - 1
  end
end

local toAdd = {}
for name in buffs do
  table.insert(toAdd, name .. "_echo")
end
for _, name in toAdd do
  buffs[name] = 1
end

local keys = {}
for k, v in buffs do table.insert(keys, \`{k}={v}\`) end
table.sort(keys)
print(table.concat(keys, " "))
`, 'rage=4 rage_echo=1 speed=1 speed_echo=1', {
        debug: BUG(`
local stats = {Kills = 3, deaths = 1}
local kda = (stats.kills + 0) / stats.deaths
print(kda)
`, 'example:2: attempt to perform arithmetic (add) on nil and number',
          'Kunci ditulis "Kills" (huruf besar) tetapi dibaca sebagai `stats.kills`. Kunci peka huruf besar/kecil, jadi bacaan memberi `nil` dan aritmetik gagal. Mesej tidak menyebut nama kunci; cetak kunci yang wujud (lihat kuliah 2.1) untuk mencari salah ejaan.',
          'The key was written as "Kills" (capital K) but read as `stats.kills`. Keys are case-sensitive, so the read gives `nil` and the arithmetic fails. The message does not name the key; print the existing keys (see lecture 2.1) to find the typo.'),
      }),
      EXPLAIN('safe-modify',
        ['1–9', 'Menukar nilai dan memadam kunci **sedia ada** semasa lelaran adalah selamat.', 'Changing values and deleting **existing** keys during iteration is safe.'],
        ['11–17', 'Kunci baharu dikumpul dahulu dan ditambah selepas gelung — tiada kunci baharu semasa lelaran.', 'New keys are collected first and added after the loop — no new keys during iteration.'],
        ['19–22', 'Laporan diisih untuk output yang stabil.', 'The report is sorted for stable output.'])),
    S('line_by_line',
      EXPLAIN('sorted-report',
        ['4–6', '`for name in scores` — satu pemboleh ubah sahaja memberi kunci; nilai diabaikan di sini.', '`for name in scores` — a single variable gives just the key; the value is ignored here.']),
      EXPLAIN('safe-modify',
        ['5', '`buffs[name] = nil` memadam kunci semasa ia dilawati — dibenarkan oleh peraturan `next`.', '`buffs[name] = nil` deletes the key while it is being visited — allowed by the rules of `next`.'])),
    S('why_this_way',
      P('Mengapa tiada susunan? Kerana table hash yang menyimpan susunan sisipan memerlukan memori dan kerja tambahan pada setiap sisipan. Luau memilih kelajuan; anda membayar kos pengisihan hanya apabila anda memerlukannya. Mengapa iterasi umum dan bukan `pairs`? Ia lebih ringkas, berfungsi untuk array dan dictionary, dan menghormati `__iter` (LUAU114).',
        'Why no order? Because a hash table that preserves insertion order needs extra memory and work on every insert. Luau chooses speed; you pay for sorting only when you need it. Why generalized iteration rather than `pairs`? It is shorter, works for arrays and dictionaries, and respects `__iter` (LUAU114).'),
      P('Lelar terus **apabila** hasil tidak bergantung pada susunan; isih kunci **apabila** output dipaparkan, disimpan atau dibandingkan; kumpul perubahan **apabila** anda perlu menambah kunci semasa lelaran.', 'Iterate directly **when** the result does not depend on order; sort keys **when** output is displayed, saved or compared; collect changes **when** you need to add keys during iteration.')),
    S('execution_flow',
      OL(
        ['Gelung pertama melawat empat kunci dalam susunan dalaman; skor dibaca, tiada susunan diandaikan.', 'The first loop visits four keys in internal order; scores are read, no order is assumed.'],
        ['`table.sort` menyusun nama: Aina (95), Ben dan Chen (70, nama memutuskan), Dewi (40).', '`table.sort` orders the names: Aina (95), Ben and Chen (70, the name decides), Dewi (40).'],
        ['Gelung kedua melelar array yang diisih — susunan ditentukan.', 'The second loop iterates the sorted array — the order is determined.'],
      )),
    S('memory_behaviour',
      P('Iterasi umum tidak memperuntukkan memori. Mengumpul kunci untuk pengisihan memperuntukkan satu array bersaiz bilangan kunci; untuk laporan sekali-sekala ini tidak penting, tetapi elakkan melakukannya setiap bingkai untuk dictionary besar. Memadam kunci tidak mengecilkan bahagian hash serta-merta; ruang dibebaskan apabila table disusun semula.', 'Generalized iteration allocates no memory. Collecting keys for sorting allocates one array sized to the number of keys; for occasional reports this does not matter, but avoid doing it every frame for large dictionaries. Deleting keys does not shrink the hash part immediately; space is reclaimed when the table is rehashed.')),
    S('alternative_implementations',
      P('`ipairs` berbanding iterasi umum pada array dengan lubang:', '`ipairs` versus generalized iteration on an array with a hole:'),
      CODE('ipairs-vs-generalized', 'luau', 'luau', ['ipairs berhenti pada lubang', 'ipairs stops at a hole'], `
local checkpoints = {"start", "bridge", nil, "castle"}

local visited = {}
for i, cp in ipairs(checkpoints) do
  table.insert(visited, \`{i}:{cp}\`)
end
print("ipairs:", table.concat(visited, " "))

local all = {}
for i, cp in checkpoints do
  table.insert(all, \`{i}:{cp}\`)
end
print("generalized:", table.concat(all, " "))
`, 'ipairs:\t1:start 2:bridge\ngeneralized:\t1:start 2:bridge 4:castle'),
      EXPLAIN('ipairs-vs-generalized',
        ['1', 'Array dengan lubang di indeks 3.', 'An array with a hole at index 3.'],
        ['3–7', '`ipairs` berhenti pada `nil` pertama — "castle" tidak dilawati.', '`ipairs` stops at the first `nil` — "castle" is not visited.'],
        ['9–13', 'Iterasi umum melangkau lubang dan melawat setiap kunci yang wujud.', 'Generalized iteration skips the hole and visits every key that exists.'])),
    S('common_mistakes',
      UL(
        ['Mencetak atau menyimpan data dalam susunan lelaran dictionary.', 'Printing or saving data in dictionary iteration order.'],
        ['Menambah kunci baharu semasa melelar table yang sama.', 'Adding new keys while iterating the same table.'],
        ['Menggunakan `ipairs` pada dictionary dan tidak mendapat apa-apa.', 'Using `ipairs` on a dictionary and getting nothing.'],
        ['Melelar medan yang mungkin `nil` tanpa nilai lalai.', 'Iterating a field that may be `nil` without a default.'],
      )),
    S('debugging',
      P('Jika output berubah antara larian atau selepas menambah data, syak susunan lelaran: cari gelung yang mencetak, menyimpan atau memilih "yang pertama" daripada dictionary, dan tambah pengisihan. Jika kunci "hilang" semasa gelung yang menambah kunci, pindahkan penambahan ke luar gelung. Pembantu ini melelar dalam susunan kunci yang diisih:',
        'If output changes between runs or after adding data, suspect iteration order: find loops that print, save or pick "the first" from a dictionary, and add sorting. If keys "go missing" during a loop that adds keys, move the additions outside the loop. This helper iterates in sorted key order:'),
      CODE('sorted-pairs', 'luau', 'luau', ['Iterator mengikut kunci diisih', 'An iterator over sorted keys'], `
local function sortedPairs(d: {[string]: any})
  local keys = {}
  for k in d do table.insert(keys, k) end
  table.sort(keys)
  local i = 0
  return function()
    i += 1
    local k = keys[i]
    if k ~= nil then return k, d[k] end
    return nil
  end
end

local settings = {volume = 80, fov = 70, sensitivity = 3}
for name, value in sortedPairs(settings) do
  print(name, value)
end
`, 'fov\t70\nsensitivity\t3\nvolume\t80'),
      EXPLAIN('sorted-pairs',
        ['1–4', 'Kumpul dan isih kunci sekali.', 'Collect and sort the keys once.'],
        ['5–11', 'Pulangkan closure: setiap panggilan memberi pasangan seterusnya, atau `nil` untuk berhenti.', 'Return a closure: each call gives the next pair, or `nil` to stop.'],
        ['13–16', 'Digunakan seperti `pairs`, tetapi dalam susunan abjad.', 'Used like `pairs`, but in alphabetical order.'])),
    S('performance',
      P('Melelar dictionary ialah O(n) dengan kos tetap yang kecil; iterasi umum Luau dioptimumkan dan tidak memanggil fungsi bagi setiap langkah untuk table biasa. Mengisih kunci menambah O(n log n) — buat sekali dan simpan susunan jika data jarang berubah. Elakkan lelaran penuh untuk mencari satu kunci; itulah tujuan carian langsung `t[k]`.', 'Iterating a dictionary is O(n) with a small constant cost; Luau’s generalized iteration is optimised and does not call a function per step for plain tables. Sorting the keys adds O(n log n) — do it once and keep the order if the data rarely changes. Avoid a full iteration to find one key; that is what a direct `t[k]` lookup is for.')),
    S('software_engineering',
      P('Bergantung pada susunan lelaran berbanding susunan eksplisit:', 'Relying on iteration order versus an explicit order:'),
      CODE('poor-iteration-order', 'luau', 'luau', ['Pelaksanaan lemah: "yang pertama" dalam lelaran', 'Poor implementation: "the first" in iteration'], `
local spawnWeights = {forest = 5, cave = 5, beach = 5}
local function defaultZone(): string?
  for zone in spawnWeights do
    return zone
  end
  return nil
end
print(typeof(defaultZone()))
`, 'string'),
      EXPLAIN('poor-iteration-order',
        ['1–7', '"Zon lalai" ialah mana-mana kunci yang dilawati dahulu — tidak ditentukan dan boleh berubah.', 'The "default zone" is whichever key is visited first — unspecified and liable to change.'],
        ['8', 'Kita hanya boleh menjamin ia string, bukan string yang mana.', 'We can only guarantee it is a string, not which one.']),
      CODE('improved-explicit-order', 'luau', 'luau', ['Pelaksanaan lebih baik: susunan eksplisit', 'Improved implementation: an explicit order'], `
local spawnWeights = {forest = 5, cave = 5, beach = 5}
local zoneOrder = {"forest", "beach", "cave"}
local function defaultZone(): string?
  for _, zone in zoneOrder do
    if spawnWeights[zone] and spawnWeights[zone] > 0 then
      return zone
    end
  end
  return nil
end
print(defaultZone())
`, 'forest'),
      EXPLAIN('improved-explicit-order',
        ['1–2', 'Data dalam dictionary; susunan keutamaan dalam array berasingan.', 'Data in a dictionary; the priority order in a separate array.'],
        ['3–11', 'Zon lalai ditentukan oleh susunan yang ditulis, bukan oleh hash.', 'The default zone is decided by the written order, not by hashing.'])),
    S('industry_use_cases',
      UL(
        ['Menyimpan data pemain: kunci diisih supaya perbandingan versi data stabil.', 'Saving player data: keys are sorted so data-version comparisons are stable.'],
        ['Kemas kini buff dan cooldown setiap tick: nilai dikurangkan, entri tamat dipadam semasa lelaran.', 'Updating buffs and cooldowns each tick: values are reduced, expired entries deleted during iteration.'],
        ['UI tetapan memaparkan pilihan dalam susunan eksplisit, bukan susunan dictionary.', 'Settings UIs display options in an explicit order, not dictionary order.'],
      )),
    S('practical_demonstration',
      OL(
        ['Gunakan `sortedPairs` untuk mencetak `inventory` dalam `inventory-total`.', 'Use `sortedPairs` to print `inventory` in `inventory-total`.'],
        ['Tukar pengisihan dalam `sorted-report` kepada abjad sahaja.', 'Change the sort in `sorted-report` to alphabetical only.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Ringkasan undian.** Kira undi untuk peta seterusnya, kemudian umumkan pemenang dengan peraturan seri yang jelas (abjad), dan cetak keputusan penuh dalam susunan undi.', '**A vote summary.** Count votes for the next map, then announce the winner with a clear tie rule (alphabetical), and print the full results in vote order.'),
      CODE('map-vote', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local ballots = {"Lava", "Ice", "Lava", "Jungle", "Ice", "Jungle"}
local votes: {[string]: number} = {}
for _, map in ballots do
  votes[map] = (votes[map] or 0) + 1
end

local maps = {}
for map in votes do table.insert(maps, map) end
table.sort(maps, function(a, b)
  if votes[a] ~= votes[b] then return votes[a] > votes[b] end
  return a < b
end)

print("winner:", maps[1])
for _, map in maps do
  print(map, votes[map])
end
`, 'winner:\tIce\nIce\t2\nJungle\t2\nLava\t2'),
      EXPLAIN('map-vote',
        ['1–5', 'Kira undi dengan nilai lalai `or 0`.', 'Count votes with an `or 0` default.'],
        ['7–12', 'Isih peta: undi menurun, abjad untuk seri.', 'Sort the maps: votes descending, alphabetical for ties.'],
        ['14–17', 'Seri tiga hala diselesaikan secara tetap: "Ice" menang setiap kali.', 'A three-way tie is resolved deterministically: "Ice" wins every time.'])),
    S('summary',
      UL(
        ['`for k, v in t` melelar array dan dictionary; `ipairs` berhenti pada lubang.', '`for k, v in t` iterates arrays and dictionaries; `ipairs` stops at holes.'],
        ['Susunan lelaran dictionary tidak ditentukan — isih kunci apabila susunan penting.', 'Dictionary iteration order is unspecified — sort keys when order matters.'],
        ['Tukar/padam kunci sedia ada semasa lelaran; tambah kunci baharu selepasnya.', 'Change/delete existing keys during iteration; add new keys afterwards.'],
        ['`t.field or {}` mengelakkan `attempt to iterate over a nil value`.', '`t.field or {}` avoids `attempt to iterate over a nil value`.'],
      )),
    S('knowledge_check',
      OL(
        ['Pengiraan mana yang selamat dilakukan dalam susunan lelaran dictionary?', 'Which computations are safe in dictionary iteration order?'],
        ['Mengapakah menambah kunci semasa lelaran berbahaya?', 'Why is adding keys during iteration dangerous?'],
        ['Apakah yang dilawati oleh `ipairs({1, 2, nil, 4})`?', 'What does `ipairs({1, 2, nil, 4})` visit?'],
        ['Bagaimanakah anda menjadikan pemenang undian seri sentiasa sama?', 'How would you make a tied vote’s winner always the same?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax: generalized iteration', url: `${LUAU}/syntax#generalized-iteration` },
        { title: 'Roblox Creator Hub — Dictionaries: iterating', url: `${DOCS}/luau/dictionaries` },
        { title: 'Lua 5.1 Reference Manual — next', url: 'https://www.lua.org/manual/5.1/manual.html#pdf-next' },
        { title: 'Roblox Creator Hub — Control structures: loops', url: `${DOCS}/luau/control-structures` },
      )),
  ],
};

// ─── 2.3 Nested tables for game data ───────────────────────────────────────

export const LUAU104_2_3: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 2,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Memodelkan data permainan sebagai table bersarang (dictionary dalam array, array dalam dictionary).', 'Model game data as nested tables (dictionaries in arrays, arrays in dictionaries).'],
        ['Membaca laluan dalam dengan selamat tanpa `attempt to index nil`.', 'Read deep paths safely without `attempt to index nil`.'],
        ['Mencipta table perantaraan apabila menulis ke laluan baharu.', 'Create intermediate tables when writing to new paths.'],
        ['Menganotasi jenis table bersarang dalam Luau.', 'Annotate nested table types in Luau.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1–2.2: dictionary dan lelaran.', 'Lectures 2.1–2.2: dictionaries and iteration.'],
      )),
    S('introduction',
      P('Data permainan sebenar jarang rata. Satu dunia mempunyai zon; setiap zon mempunyai musuh dan ganjaran; setiap pemain mempunyai inventori, statistik dan tetapan. Luau memodelkan semua ini dengan **table bersarang** — table yang nilainya ialah table lain. Bentuk ini berkuasa tetapi membawa ralat yang paling biasa dalam kod Roblox: `attempt to index nil with \'x\'`, apabila satu tahap di tengah laluan tidak wujud. Kuliah ini mengajar cara mereka bentuk struktur yang jelas, membaca laluan dalam dengan selamat, dan menulis ke laluan yang belum wujud.',
        'Real game data is rarely flat. A world has zones; each zone has enemies and rewards; each player has an inventory, statistics and settings. Luau models all of this with **nested tables** — tables whose values are other tables. This shape is powerful but brings the most common error in Roblox code: `attempt to index nil with \'x\'`, when one level in the middle of a path does not exist. This lecture teaches how to design clear structures, read deep paths safely, and write to paths that do not exist yet.'),
      KEY('Setiap `.` dalam laluan boleh gagal. Semak atau cipta setiap tahap; jangan anggap ia wujud.', 'Every `.` in a path can fail. Check or create each level; do not assume it exists.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Array rekod: `{{name = "wolf", hp = 30}, …}` — senarai entiti yang serupa.', 'An array of records: `{{name = "wolf", hp = 30}, …}` — a list of similar entities.'],
        ['Dictionary array: `{forest = {"wolf", "bear"}}` — kumpulan mengikut nama.', 'A dictionary of arrays: `{forest = {"wolf", "bear"}}` — groups by name.'],
        ['`a.b.c` gagal jika `a.b` ialah `nil`: ralat menyebut kunci **seterusnya** (`c`).', '`a.b.c` fails if `a.b` is `nil`: the error names the **next** key (`c`).'],
        ['Bacaan selamat: `local b = a.b; if b then … end` atau `(a.b or {}).c`.', 'Safe reads: `local b = a.b; if b then … end` or `(a.b or {}).c`.'],
        ['Jenis bersarang: `type Zone = {name: string, enemies: {string}}`.', 'Nested types: `type Zone = {name: string, enemies: {string}}`.'],
      )),
    S('detailed_theory',
      P('Table bersarang ialah table yang menyimpan **rujukan** kepada table lain. `world.zones.forest.enemies[1]` ialah empat carian berturut-turut: setiap `.` atau `[ ]` mengambil nilai dari table semasa, dan langkah seterusnya mengindeks nilai itu. Jika mana-mana langkah memberi `nil`, langkah seterusnya gagal dengan `attempt to index nil with \'kunci\'` — dan kunci yang disebut ialah kunci yang cuba dibaca **dari** `nil`, bukan yang hilang. Jadi `world.zones.desert.enemies` gagal dengan `with \'enemies\'`, walaupun masalah sebenar ialah `desert` tiada. Membaca mesej dengan betul menjimatkan banyak masa.',
        'A nested table is a table that stores **references** to other tables. `world.zones.forest.enemies[1]` is four lookups in a row: each `.` or `[ ]` fetches a value from the current table, and the next step indexes that value. If any step gives `nil`, the next step fails with `attempt to index nil with \'key\'` — and the key named is the one being read **from** `nil`, not the missing one. So `world.zones.desert.enemies` fails with `with \'enemies\'`, even though the real problem is that `desert` is missing. Reading the message correctly saves a lot of time.'),
      P('Untuk **membaca** dengan selamat, semak setiap tahap (klausa pengawal) atau gunakan fungsi pembantu yang berjalan melalui senarai kunci dan berhenti pada `nil` pertama. Untuk **menulis** ke laluan baharu, setiap tahap perantaraan mesti dicipta dahulu: `data.stats.hp = 5` gagal jika `data.stats` tiada, jadi tulis `data.stats = data.stats or {}` sebelum itu. Reka bentuk yang baik mengurangkan semakan ini: cipta semua tahap dengan nilai lalai semasa membina rekod (contohnya setiap pemain baharu bermula dengan `inventory = {}` dan `stats = {}`), supaya kod lain boleh menganggap struktur itu lengkap. Anotasi `type` Luau mendokumenkan bentuk itu dan membolehkan penganalisis menangkap akses yang salah.',
        'To **read** safely, check each level (guard clauses) or use a helper that walks a list of keys and stops at the first `nil`. To **write** to a new path, each intermediate level must be created first: `data.stats.hp = 5` fails if `data.stats` is missing, so write `data.stats = data.stats or {}` before it. Good design reduces these checks: create every level with defaults when building a record (for example every new player starts with `inventory = {}` and `stats = {}`), so other code can assume the structure is complete. Luau `type` annotations document that shape and let the analyser catch wrong accesses.')),
    S('technical_terminology', TERMS('dictionary', 'array', 'table', 'type-annotation')),
    S('syntax_rules',
      UL(
        ['`type Enemy = {name: string, hp: number}`; `type Zone = {enemies: {Enemy}, reward: number}`.', '`type Enemy = {name: string, hp: number}`; `type Zone = {enemies: {Enemy}, reward: number}`.'],
        ['Laluan: `world.zones.forest.enemies[1].hp` atau `world.zones[zoneName]`.', 'Paths: `world.zones.forest.enemies[1].hp` or `world.zones[zoneName]`.'],
        ['Cipta tahap: `data.stats = data.stats or {}`.', 'Create a level: `data.stats = data.stats or {}`.'],
      )),
    S('code_demonstration',
      CODE('world-data', 'luau', 'luau', ['Data dunia bersarang', 'Nested world data'], `
type Enemy = {name: string, hp: number}
type Zone = {enemies: {Enemy}, reward: number}

local zones: {[string]: Zone} = {
  forest = {enemies = {{name = "wolf", hp = 30}, {name = "bear", hp = 80}}, reward = 50},
  cave = {enemies = {{name = "bat", hp = 10}}, reward = 20},
}

print(zones.forest.enemies[2].name, zones.cave.reward)

local totalHp = 0
for _, enemy in zones.forest.enemies do
  totalHp += enemy.hp
end
print("forest hp:", totalHp, "enemy count:", #zones.forest.enemies)
`, 'bear\t20\nforest hp:\t110\tenemy count:\t2'),
      EXPLAIN('world-data',
        ['1–2', 'Jenis mendokumenkan bentuk: zon mempunyai array musuh dan ganjaran.', 'Types document the shape: a zone has an array of enemies and a reward.'],
        ['4–7', 'Dictionary zon → table zon → array musuh → table musuh.', 'A dictionary of zones → zone table → array of enemies → enemy table.'],
        ['9', 'Laluan dalam: empat carian berturut-turut.', 'A deep path: four lookups in a row.'],
        ['11–15', 'Lelar array bersarang; jumlah hp dan kiraan.', 'Iterate the nested array; total hp and count.'])),
    S('complete_examples',
      CODE('safe-path', 'luau', 'luau', ['Membaca laluan dalam dengan selamat', 'Reading deep paths safely'], `
local function getPath(root: any, ...: string): any
  local current = root
  for i = 1, select("#", ...) do
    if type(current) ~= "table" then
      return nil
    end
    current = current[select(i, ...)]
  end
  return current
end

local save = {profile = {name = "Aina", stats = {wins = 4}}}
print(getPath(save, "profile", "stats", "wins"))
print(getPath(save, "profile", "pets", "first"))
print(getPath(save, "profile", "name", "length"))
`, '4\nnil\nnil', {
        debug: BUG(`
local world = {zones = {forest = {enemies = {"wolf"}}}}
local zoneName = "desert"
print(world.zones[zoneName].enemies[1])
`, 'example:3: attempt to index nil with \'enemies\'',
          'Zon "desert" tiada, jadi `world.zones[zoneName]` ialah `nil`. Ralat menyebut `\'enemies\'` — kunci yang cuba dibaca **dari** `nil` — bukan "desert" yang sebenarnya hilang. Baca mesej sebagai: "bahagian sebelum `.enemies` ialah nil". Semak zon dahulu atau gunakan `getPath`.',
          'The "desert" zone is missing, so `world.zones[zoneName]` is `nil`. The error names `\'enemies\'` — the key being read **from** `nil` — not "desert", which is what is actually missing. Read the message as: "the part before `.enemies` is nil". Check the zone first or use `getPath`.'),
      }),
      EXPLAIN('safe-path',
        ['1–10', 'Berjalan melalui kunci (vararg); berhenti dengan `nil` jika tahap semasa bukan table.', 'Walk through the keys (varargs); stop with `nil` if the current level is not a table.'],
        ['12–15', 'Laluan wujud → 4; tahap hilang ("pets") → `nil`; laluan melalui string → `nil` tanpa ralat.', 'An existing path → 4; a missing level ("pets") → `nil`; a path through a string → `nil` without an error.']),
      CODE('ensure-path', 'luau', 'luau', ['Mencipta tahap perantaraan semasa menulis', 'Creating intermediate levels when writing'], `
local function ensure(parent: {[string]: any}, key: string): {[string]: any}
  local child = parent[key]
  if child == nil then
    child = {}
    parent[key] = child
  end
  return child
end

local data = {}
ensure(ensure(data, "stats"), "combat").kills = 3
ensure(ensure(data, "stats"), "combat").kills += 2
ensure(data, "stats").deaths = 1
print(data.stats.combat.kills, data.stats.deaths)
`, '5\t1', {
        debug: BUG(`
local data = {}
data.stats.wins = 1
print(data.stats.wins)
`, 'example:2: attempt to index nil with \'wins\'',
          'Menulis `data.stats.wins` memerlukan `data.stats` wujud dahulu — Luau tidak mencipta table perantaraan secara automatik. Ralat menyebut `\'wins\'` kerana ia cuba menulis kunci itu ke dalam `nil`. Cipta tahap dahulu: `data.stats = data.stats or {}`.',
          'Writing `data.stats.wins` requires `data.stats` to exist first — Luau does not create intermediate tables automatically. The error names `\'wins\'` because it tried to write that key into `nil`. Create the level first: `data.stats = data.stats or {}`.'),
      }),
      EXPLAIN('ensure-path',
        ['1–8', '`ensure` memulangkan table anak, menciptanya jika perlu.', '`ensure` returns the child table, creating it if needed.'],
        ['10–14', 'Panggilan bersarang mencipta `stats` dan `combat` sekali; panggilan kemudian menggunakan semula table yang sama.', 'Nested calls create `stats` and `combat` once; later calls reuse the same tables.'])),
    S('line_by_line',
      EXPLAIN('safe-path',
        ['7', '`select(i, ...)` memberi kunci ke-i; `current[kunci]` turun satu tahap.', '`select(i, ...)` gives the i-th key; `current[key]` goes down one level.']),
      EXPLAIN('world-data',
        ['12', '`zones.forest.enemies` dinilai sekali sebelum gelung bermula.', '`zones.forest.enemies` is evaluated once before the loop starts.'])),
    S('why_this_way',
      P('Mengapa table bersarang? Kerana ia mencerminkan struktur dunia sebenar — dan Luau tidak mempunyai struct atau kelas terbina; table ialah alat untuk semua. Mengapa Luau tidak mencipta tahap secara automatik? Kerana penulisan ke `nil` hampir selalu bermakna pepijat (salah ejaan atau data yang belum dimuatkan), dan ralat lebih baik daripada mencipta struktur yang salah secara senyap.',
        'Why nested tables? Because they mirror the real structure of the world — and Luau has no built-in structs or classes; tables are the tool for everything. Why does Luau not create levels automatically? Because writing into `nil` almost always means a bug (a typo or data not yet loaded), and an error is better than silently creating the wrong structure.'),
      P('Cipta struktur penuh **apabila** rekod dibina; gunakan `getPath` **apabila** data datang dari luar (simpanan lama, konfigurasi) dan mungkin tidak lengkap; gunakan jenis **apabila** bentuk perlu dikongsi antara skrip.', 'Create the full structure **when** a record is built; use `getPath` **when** data comes from outside (old saves, configuration) and may be incomplete; use types **when** the shape must be shared between scripts.')),
    S('execution_flow',
      OL(
        ['`zones.forest` → table zon hutan.', '`zones.forest` → the forest zone table.'],
        ['`.enemies` → array dua musuh; `[2]` → table "bear".', '`.enemies` → an array of two enemies; `[2]` → the "bear" table.'],
        ['`.name` → "bear". Setiap langkah bergantung pada langkah sebelumnya bukan `nil`.', '`.name` → "bear". Each step depends on the previous one not being `nil`.'],
      )),
    S('memory_behaviour',
      P('Setiap tahap bersarang ialah objek table berasingan dengan overhed sendiri (pengepala table dan bahagian array/hash). Struktur yang sangat dalam dengan banyak table kecil menggunakan lebih banyak memori daripada struktur yang lebih rata. Table bersarang disimpan sebagai rujukan, jadi dua rekod boleh berkongsi table yang sama — modul 3 menerangkan akibatnya.', 'Every nested level is a separate table object with its own overhead (a table header and array/hash parts). A very deep structure with many small tables uses more memory than a flatter one. Nested tables are stored as references, so two records can share the same table — module 3 explains the consequences.')),
    S('alternative_implementations',
      P('Struktur yang lebih rata dengan kunci komposit — kurang tahap, kurang semakan `nil`:', 'A flatter structure with composite keys — fewer levels, fewer `nil` checks:'),
      CODE('flat-keys', 'luau', 'luau', ['Kunci komposit', 'Composite keys'], `
local cooldowns: {[string]: number} = {}
local function key(player: string, ability: string): string
  return \`{player}/{ability}\`
end

cooldowns[key("Aina", "dash")] = 3
cooldowns[key("Aina", "heal")] = 10
cooldowns[key("Ben", "dash")] = 1
print(cooldowns[key("Aina", "heal")], cooldowns[key("Ben", "heal")])
`, '10\tnil'),
      EXPLAIN('flat-keys',
        ['1–4', 'Satu dictionary dengan kunci "pemain/kebolehan" dan bukannya `cooldowns[pemain][kebolehan]`.', 'One dictionary with "player/ability" keys instead of `cooldowns[player][ability]`.'],
        ['6–9', 'Tiada tahap perantaraan untuk dicipta; kunci yang tiada memberi `nil` tanpa ralat.', 'No intermediate levels to create; a missing key gives `nil` without an error.'])),
    S('common_mistakes',
      UL(
        ['Menganggap kunci dalam ralat `attempt to index nil with` ialah yang hilang.', 'Assuming the key in an `attempt to index nil with` error is the missing one.'],
        ['Menulis ke laluan dalam tanpa mencipta tahap perantaraan.', 'Writing to a deep path without creating intermediate levels.'],
        ['Struktur yang tidak konsisten: sesetengah rekod mempunyai `stats`, yang lain tidak.', 'Inconsistent structure: some records have `stats`, others do not.'],
        ['Bersarang terlalu dalam apabila kunci komposit lebih ringkas.', 'Nesting too deeply when composite keys would be simpler.'],
      )),
    S('debugging',
      P('Untuk `attempt to index nil with \'k\'` pada laluan panjang, pecahkan laluan kepada local dan cetak setiap satu: tahap pertama yang `nil` ialah puncanya. Untuk data yang dimuatkan dari luar, sahkan bentuknya sekali di sempadan (semasa memuatkan) dan bukannya di setiap bacaan. Pengesah bentuk ringkas:',
        'For `attempt to index nil with \'k\'` on a long path, break the path into locals and print each one: the first level that is `nil` is the cause. For data loaded from outside, validate its shape once at the boundary (when loading) rather than on every read. A simple shape validator:'),
      CODE('shape-check', 'luau', 'luau', ['Mengesahkan bentuk rekod', 'Validating a record’s shape'], `
local function checkPlayer(p: any): (boolean, string?)
  if type(p) ~= "table" then return false, "player is not a table" end
  if type(p.name) ~= "string" then return false, "name missing" end
  if type(p.stats) ~= "table" then return false, \`{p.name}: stats missing\` end
  if type(p.stats.level) ~= "number" then return false, \`{p.name}: stats.level missing\` end
  return true, nil
end

print(checkPlayer({name = "Aina", stats = {level = 4}}))
print(checkPlayer({name = "Ben"}))
print(checkPlayer({name = "Chen", stats = {}}))
`, 'true\tnil\nfalse\tBen: stats missing\nfalse\tChen: stats.level missing'),
      EXPLAIN('shape-check',
        ['1–7', 'Semak setiap tahap mengikut susunan, dari luar ke dalam; laporkan tahap pertama yang salah.', 'Check each level in order, from outside in; report the first wrong level.'],
        ['9–11', 'Rekod lengkap lulus; rekod tidak lengkap memberi mesej yang menyebut laluan sebenar.', 'A complete record passes; incomplete records give a message naming the real path.'])),
    S('performance',
      P('Setiap tahap dalam laluan ialah satu carian table. Dalam gelung panas, simpan tahap dalam local (`local enemies = zones.forest.enemies`) dan bukannya menilai semula laluan penuh setiap pusingan. `getPath` dengan varargs lebih lambat daripada akses langsung — gunakannya di sempadan data, bukan dalam kod setiap bingkai.', 'Every level in a path is one table lookup. In hot loops, store the level in a local (`local enemies = zones.forest.enemies`) instead of re-evaluating the full path each pass. `getPath` with varargs is slower than direct access — use it at data boundaries, not in per-frame code.')),
    S('software_engineering',
      P('Rekod yang dibina secara tidak konsisten berbanding pembina dengan nilai lalai:', 'Inconsistently built records versus a constructor with defaults:'),
      CODE('poor-inconsistent-records', 'luau', 'luau', ['Pelaksanaan lemah: bentuk tidak konsisten', 'Poor implementation: inconsistent shapes'], `
local players = {
  {name = "Aina", stats = {wins = 2}},
  {name = "Ben"},
}
local totalWins = 0
for _, p in players do
  totalWins += if p.stats and p.stats.wins then p.stats.wins else 0
end
print(totalWins)
`, '2'),
      EXPLAIN('poor-inconsistent-records',
        ['1–4', 'Satu rekod mempunyai `stats`, satu lagi tidak.', 'One record has `stats`, the other does not.'],
        ['5–9', 'Setiap pembaca mesti menyemak setiap tahap — mudah terlupa di satu tempat.', 'Every reader must check every level — easy to forget in one place.']),
      CODE('improved-record-constructor', 'luau', 'luau', ['Pelaksanaan lebih baik: pembina rekod', 'Improved implementation: a record constructor'], `
type Player = {name: string, stats: {wins: number, losses: number}, inventory: {string}}

local function newPlayer(name: string): Player
  return {name = name, stats = {wins = 0, losses = 0}, inventory = {}}
end

local players = {newPlayer("Aina"), newPlayer("Ben")}
players[1].stats.wins += 2
local totalWins = 0
for _, p in players do totalWins += p.stats.wins end
print(totalWins, #players[2].inventory)
`, '2\t0'),
      EXPLAIN('improved-record-constructor',
        ['1–5', 'Satu jenis dan satu pembina: setiap pemain bermula dengan struktur penuh.', 'One type and one constructor: every player starts with the full structure.'],
        ['7–11', 'Pembaca boleh menganggap `stats` dan `inventory` sentiasa wujud.', 'Readers can assume `stats` and `inventory` always exist.'])),
    S('industry_use_cases',
      UL(
        ['Data simpanan pemain (profil, inventori, statistik) disimpan sebagai satu table bersarang.', 'Saved player data (profile, inventory, statistics) is stored as one nested table.'],
        ['Konfigurasi tahap: zon → gelombang → musuh → atribut.', 'Level configuration: zones → waves → enemies → attributes.'],
        ['Data dari JSON (`HttpService:JSONDecode`) tiba sebagai table bersarang yang mesti disahkan.', 'Data from JSON (`HttpService:JSONDecode`) arrives as nested tables that must be validated.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah zon "swamp" pada `world-data` dan kira jumlah ganjaran semua zon.', 'Add a "swamp" zone to `world-data` and total the rewards of all zones.'],
        ['Gunakan `getPath` untuk membaca `save.profile.stats.losses`.', 'Use `getPath` to read `save.profile.stats.losses`.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Ringkasan gelombang.** Diberi konfigurasi gelombang bersarang, kira bilangan musuh dan jumlah hp bagi setiap gelombang, dan kumpulan jenis musuh merentas semua gelombang (diisih).', '**A wave summary.** Given a nested wave configuration, count the enemies and total hp per wave, and the set of enemy types across all waves (sorted).'),
      CODE('wave-summary', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local waves = {
  {groups = {{kind = "slime", count = 5, hp = 10}, {kind = "bat", count = 3, hp = 6}}},
  {groups = {{kind = "goblin", count = 4, hp = 25}}},
  {groups = {{kind = "slime", count = 2, hp = 10}, {kind = "ogre", count = 1, hp = 200}}},
}

local kinds: {[string]: boolean} = {}
for number, wave in waves do
  local enemies, hp = 0, 0
  for _, g in wave.groups do
    enemies += g.count
    hp += g.count * g.hp
    kinds[g.kind] = true
  end
  print(\`wave {number}: {enemies} enemies, {hp} hp\`)
end

local list = {}
for kind in kinds do table.insert(list, kind) end
table.sort(list)
print("types:", table.concat(list, ", "))
`, 'wave 1: 8 enemies, 68 hp\nwave 2: 4 enemies, 100 hp\nwave 3: 3 enemies, 220 hp\ntypes:\tbat, goblin, ogre, slime'),
      EXPLAIN('wave-summary',
        ['1–5', 'Array gelombang → array kumpulan → rekod kumpulan.', 'An array of waves → an array of groups → group records.'],
        ['7–16', 'Gelung bersarang: kira setiap gelombang; set `kinds` mengumpul jenis tanpa pendua.', 'Nested loops: total each wave; the `kinds` set collects types without duplicates.'],
        ['18–21', 'Set ditukar kepada array diisih untuk output yang stabil.', 'The set is turned into a sorted array for stable output.'])),
    S('summary',
      UL(
        ['Table bersarang memodelkan data permainan: array rekod, dictionary array.', 'Nested tables model game data: arrays of records, dictionaries of arrays.'],
        ['`attempt to index nil with \'k\'` — tahap **sebelum** `k` ialah `nil`.', '`attempt to index nil with \'k\'` — the level **before** `k` is `nil`.'],
        ['Cipta tahap perantaraan sebelum menulis; bina rekod lengkap dengan pembina.', 'Create intermediate levels before writing; build complete records with a constructor.'],
        ['Sahkan data luar sekali di sempadan.', 'Validate outside data once at the boundary.'],
      )),
    S('knowledge_check',
      OL(
        ['Dalam `a.b.c.d`, jika ralat menyebut `\'d\'`, tahap mana yang `nil`?', 'In `a.b.c.d`, if the error names `\'d\'`, which level is `nil`?'],
        ['Mengapakah `data.stats.wins = 1` gagal pada table kosong?', 'Why does `data.stats.wins = 1` fail on an empty table?'],
        ['Bilakah kunci komposit lebih baik daripada bersarang?', 'When are composite keys better than nesting?'],
        ['Apakah kelebihan pembina `newPlayer`?', 'What is the advantage of the `newPlayer` constructor?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Tables', url: `${DOCS}/luau/tables` },
        { title: 'Luau — Type checking: type aliases', url: `${LUAU}/typecheck#type-aliases` },
        { title: 'Programming in Lua (1st ed.) — 11.2 Matrices and Multi-Dimensional Arrays', url: 'https://www.lua.org/pil/11.2.html' },
        { title: 'Roblox Creator Hub — Saving data', url: `${DOCS}/cloud-services/data-stores` },
      )),
  ],
};

export const LUAU104_M2 = [LUAU104_2_1, LUAU104_2_2, LUAU104_2_3];
