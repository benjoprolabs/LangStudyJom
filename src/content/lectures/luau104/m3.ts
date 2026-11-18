import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU104 · Module 3 — References and Copies (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 3.1 Tables are references ─────────────────────────────────────────────

export const LUAU104_3_1: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 3,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan [[reference-semantics|semantik rujukan]]: pemboleh ubah table memegang rujukan, bukan salinan.', 'Explain [[reference-semantics|reference semantics]]: a table variable holds a reference, not a copy.'],
        ['Meramal kesan menghantar table kepada fungsi.', 'Predict the effect of passing a table to a function.'],
        ['Membezakan mengubah table dan menetapkan semula pemboleh ubah.', 'Distinguish mutating a table from rebinding a variable.'],
        ['Menggunakan `==` dan `rawequal` dengan betul untuk table.', 'Use `==` and `rawequal` correctly for tables.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1–2: array, dictionary dan table bersarang.', 'Modules 1–2: arrays, dictionaries and nested tables.'],
        ['LUAU103 4.1: closure dan upvalue berkongsi.', 'LUAU103 4.1: closures and shared upvalues.'],
      )),
    S('introduction',
      P('Pepijat "kenapa semua pemain mempunyai inventori yang sama?" ialah klasik dalam kod Roblox. Puncanya hampir selalu sama: satu table ditetapkan kepada beberapa pemboleh ubah atau medan, dan pengaturcara menyangka setiap satu ialah salinan. Dalam Luau, nombor, boolean dan string berkelakuan seperti **nilai** — menyalinnya memberi nilai bebas. Table (dan fungsi, buffer, thread) ialah **objek**: pemboleh ubah hanya memegang rujukan kepadanya. Kuliah ini menerangkan model itu dengan teliti supaya anda boleh meramal setiap perkongsian.',
        'The bug "why do all players have the same inventory?" is a classic in Roblox code. Its cause is almost always the same: one table is assigned to several variables or fields, and the programmer thinks each one is a copy. In Luau, numbers, booleans and strings behave like **values** — copying them gives an independent value. Tables (and functions, buffers, threads) are **objects**: a variable only holds a reference to one. This lecture explains that model carefully so you can predict every case of sharing.'),
      KEY('`local b = a` menyalin rujukan, bukan table. Dua nama, satu objek.', '`local b = a` copies the reference, not the table. Two names, one object.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Penugasan, argumen fungsi dan nilai pulangan semuanya menyalin **rujukan** table.', 'Assignment, function arguments and return values all copy the table **reference**.'],
        ['**Mengubah** (`t.x = 1`, `table.insert(t, v)`) dilihat oleh setiap rujukan.', '**Mutating** (`t.x = 1`, `table.insert(t, v)`) is seen through every reference.'],
        ['**Menetapkan semula** (`t = {}`) hanya mengubah satu pemboleh ubah.', '**Rebinding** (`t = {}`) only changes one variable.'],
        ['`a == b` benar hanya jika kedua-duanya objek yang sama (kecuali metamethod `__eq`).', '`a == b` is true only if both are the same object (unless an `__eq` metamethod exists).'],
      )),
    S('detailed_theory',
      P('Apabila Luau menilai constructor `{}`, ia memperuntukkan objek table di heap dan memulangkan rujukan kepadanya. Pemboleh ubah, medan table dan slot argumen semuanya menyimpan rujukan itu. `local b = a` menyalin rujukan — kini ada dua nama untuk satu objek. Begitu juga, apabila anda memanggil `addItem(inventory)`, parameter fungsi menerima rujukan yang sama, jadi `table.insert` di dalam fungsi mengubah inventori pemanggil. Ini berguna (fungsi boleh mengubah data tanpa memulangkannya) tetapi berbahaya jika tidak dijangka: data "lalai" yang dikongsi antara pemain akan berubah untuk semua orang.',
        'When Luau evaluates the constructor `{}`, it allocates a table object on the heap and returns a reference to it. Variables, table fields and argument slots all store that reference. `local b = a` copies the reference — now there are two names for one object. Likewise, when you call `addItem(inventory)`, the function parameter receives the same reference, so `table.insert` inside the function changes the caller’s inventory. This is useful (functions can change data without returning it) but dangerous when unexpected: "default" data shared between players changes for everyone.'),
      P('Perbezaan penting ialah antara **mengubah objek** dan **menetapkan semula nama**. `inv.gold = 0` atau `table.clear(inv)` mengubah objek, jadi setiap rujukan melihatnya. `inv = {}` di dalam fungsi hanya menukar parameter tempatan supaya merujuk table baharu; pemanggil masih memegang table lama yang tidak berubah. Kesamaan juga mengikut identiti: `{1} == {1}` palsu kerana dua constructor mencipta dua objek. Untuk membandingkan kandungan, tulis fungsi perbandingan anda sendiri. `rawequal(a, b)` membandingkan identiti tanpa metamethod — berguna apabila objek mempunyai `__eq` (LUAU114).',
        'The key distinction is between **mutating the object** and **rebinding a name**. `inv.gold = 0` or `table.clear(inv)` changes the object, so every reference sees it. `inv = {}` inside a function only changes the local parameter to refer to a new table; the caller still holds the old, unchanged table. Equality also follows identity: `{1} == {1}` is false because two constructors create two objects. To compare contents, write your own comparison function. `rawequal(a, b)` compares identity without metamethods — useful when objects have `__eq` (LUAU114).')),
    S('technical_terminology', TERMS('reference-semantics', 'table', 'variable', 'parameter')),
    S('syntax_rules',
      UL(
        ['Perkongsian: `local alias = original` — tiada sintaks salinan dalam penugasan.', 'Sharing: `local alias = original` — there is no copy syntax in assignment.'],
        ['Identiti: `a == b`, `rawequal(a, b)`.', 'Identity: `a == b`, `rawequal(a, b)`.'],
        ['Table baharu bagi setiap entiti: panggil pembina, `newInventory()`, untuk setiap pemain.', 'A new table per entity: call a constructor, `newInventory()`, for each player.'],
      )),
    S('code_demonstration',
      CODE('alias-demo', 'luau', 'luau', ['Dua nama, satu table', 'Two names, one table'], `
local hp = 100
local hpCopy = hp
hpCopy -= 30
print(hp, hpCopy)

local stats = {hp = 100}
local statsAlias = stats
statsAlias.hp -= 30
print(stats.hp, statsAlias.hp, stats == statsAlias)

local other = {hp = 70}
print(other == stats, other.hp == stats.hp)
`, '100\t70\n70\t70\ttrue\nfalse\ttrue'),
      EXPLAIN('alias-demo',
        ['1–4', 'Nombor ialah nilai: `hpCopy` bebas daripada `hp`.', 'Numbers are values: `hpCopy` is independent of `hp`.'],
        ['6–9', 'Table ialah objek: `statsAlias` merujuk table yang sama; perubahan dilihat melalui kedua-dua nama.', 'Tables are objects: `statsAlias` refers to the same table; the change is seen through both names.'],
        ['11–12', 'Kandungan sama, objek berbeza: `==` palsu, tetapi medan sama.', 'Equal contents, different objects: `==` is false, but the fields are equal.'])),
    S('complete_examples',
      CODE('mutate-vs-rebind', 'luau', 'luau', ['Mengubah berbanding menetapkan semula', 'Mutating versus rebinding'], `
local function giveStarterKit(inventory: {string})
  table.insert(inventory, "wooden sword")
  table.insert(inventory, "bread")
end

local function tryReset(inventory: {string})
  inventory = {}
  table.insert(inventory, "nothing")
end

local function realReset(inventory: {string})
  table.clear(inventory)
end

local bag = {}
giveStarterKit(bag)
print(#bag, bag[1])
tryReset(bag)
print(#bag, bag[1])
realReset(bag)
print(#bag)
`, '2\twooden sword\n2\twooden sword\n0', {
        debug: BUG(`
local function addCoins(wallet: {coins: number}, amount: number)
  wallet = {coins = wallet.coins + amount}
end
local wallet = {coins = 10}
addCoins(wallet, 5)
assert(wallet.coins == 15, \`expected 15 coins, got {wallet.coins}\`)
`, 'example:6: expected 15 coins, got 10',
          '`addCoins` mencipta table **baharu** dan menetapkannya kepada parameter `wallet` — ini menetapkan semula nama tempatan sahaja. Table pemanggil tidak pernah diubah, jadi `assert` gagal dengan nilai 10. Ubah objek itu sendiri: `wallet.coins += amount`, atau pulangkan table baharu dan tetapkannya di tempat panggilan.',
          '`addCoins` creates a **new** table and assigns it to the parameter `wallet` — this only rebinds the local name. The caller’s table is never changed, so the `assert` fails with the value 10. Mutate the object itself: `wallet.coins += amount`, or return the new table and assign it at the call site.'),
      }),
      EXPLAIN('mutate-vs-rebind',
        ['1–4', 'Mengubah melalui parameter: pemanggil melihat dua item baharu.', 'Mutating through the parameter: the caller sees two new items.'],
        ['6–9', '`inventory = {}` menetapkan semula parameter sahaja; table pemanggil tidak disentuh.', '`inventory = {}` only rebinds the parameter; the caller’s table is untouched.'],
        ['11–13', '`table.clear` mengubah objek — pengosongan sebenar.', '`table.clear` mutates the object — a real reset.'],
        ['15–21', 'Selepas `tryReset`, beg masih mempunyai 2 item; selepas `realReset`, 0.', 'After `tryReset` the bag still has 2 items; after `realReset`, 0.']),
      CODE('shared-default-fixed', 'luau', 'luau', ['Lalai dikongsi berbanding pembina', 'A shared default versus a constructor'], `
local function newLoadout(): {string}
  return {"pistol", "medkit"}
end

local loadouts = {}
for _, name in {"Aina", "Ben"} do
  loadouts[name] = newLoadout()
end
table.insert(loadouts.Aina, "grenade")
print(#loadouts.Aina, #loadouts.Ben, loadouts.Aina == loadouts.Ben)
`, '3\t2\tfalse', {
        debug: BUG(`
local defaultLoadout = {"pistol", "medkit"}
local loadouts = {Aina = defaultLoadout, Ben = defaultLoadout}
table.insert(loadouts.Aina, "grenade")
assert(#loadouts.Ben == 2, \`Ben should have 2 items, has {#loadouts.Ben}\`)
`, 'example:4: Ben should have 2 items, has 3',
          'Kedua-dua pemain merujuk **satu** table `defaultLoadout`. Memberi Aina bom tangan juga memberikannya kepada Ben — dan mengubah "lalai" untuk pemain akan datang. Tiada ralat runtime; hanya `assert` mendedahkannya. Cipta table baharu bagi setiap pemain dengan pembina (atau `table.clone`, kuliah 3.2).',
          'Both players refer to **one** `defaultLoadout` table. Giving Aina a grenade also gives it to Ben — and changes the "default" for future players. There is no runtime error; only the `assert` reveals it. Create a new table per player with a constructor (or `table.clone`, lecture 3.2).'),
      }),
      EXPLAIN('shared-default-fixed',
        ['1–3', 'Pembina: setiap panggilan menilai constructor sekali lagi → table baharu.', 'A constructor: every call evaluates the table constructor again → a new table.'],
        ['5–10', 'Setiap pemain mempunyai objek sendiri; perubahan pada Aina tidak menjejaskan Ben.', 'Each player has their own object; a change to Aina does not affect Ben.'])),
    S('line_by_line',
      EXPLAIN('mutate-vs-rebind',
        ['7', '`inventory = {}` — selepas baris ini, parameter merujuk table baharu, dan baris 8 mengubah table baharu itu sahaja.', '`inventory = {}` — after this line the parameter refers to a new table, and line 8 changes only that new table.']),
      EXPLAIN('alias-demo',
        ['7', 'Tiada table baharu dicipta di sini — hanya rujukan kedua kepada table yang sama.', 'No new table is created here — only a second reference to the same table.'])),
    S('why_this_way',
      P('Mengapa rujukan? Kerana menyalin table setiap kali ia dihantar akan menjadi sangat mahal — table data pemain boleh mempunyai ribuan entri. Rujukan menjadikan penghantaran O(1) dan membolehkan fungsi bekerja pada data bersama. Kosnya ialah tanggungjawab: anda mesti tahu siapa lagi memegang rujukan sebelum mengubah sesuatu.',
        'Why references? Because copying a table every time it is passed would be very expensive — a player data table can have thousands of entries. References make passing O(1) and let functions work on shared data. The cost is responsibility: you must know who else holds a reference before changing something.'),
      P('Kongsi rujukan **apabila** beberapa bahagian kod mesti melihat data yang sama (contohnya keadaan pusingan); cipta table baharu **apabila** setiap entiti memerlukan data sendiri; salin **apabila** anda menerima table dari luar dan perlu mengubahnya tanpa kesan sampingan.', 'Share references **when** several parts of the code must see the same data (for example round state); create new tables **when** each entity needs its own data; copy **when** you receive a table from outside and must change it without side effects.')),
    S('execution_flow',
      OL(
        ['`local bag = {}` — objek table #1 dicipta; `bag` merujuknya.', '`local bag = {}` — table object #1 is created; `bag` refers to it.'],
        ['`giveStarterKit(bag)` — parameter merujuk #1; dua sisipan mengubah #1.', '`giveStarterKit(bag)` — the parameter refers to #1; two inserts change #1.'],
        ['`tryReset(bag)` — parameter ditetapkan semula ke #2; #1 tidak berubah.', '`tryReset(bag)` — the parameter is rebound to #2; #1 is unchanged.'],
        ['`realReset(bag)` — `table.clear` mengosongkan #1.', '`realReset(bag)` — `table.clear` empties #1.'],
      )),
    S('memory_behaviour',
      P('Objek table hidup selagi ada rujukan kepadanya — dari pemboleh ubah, medan table lain, upvalue atau senarai pengendali. Dalam `tryReset`, table #2 menjadi sampah sebaik sahaja fungsi pulang kerana tiada lagi yang merujuknya. Rujukan yang terlupa (contohnya data pemain dalam cache selepas pemain keluar) menghalang pengutipan dan menyebabkan kebocoran memori.', 'A table object lives as long as something refers to it — a variable, another table’s field, an upvalue or a handler list. In `tryReset`, table #2 becomes garbage as soon as the function returns because nothing refers to it any more. Forgotten references (for example player data left in a cache after the player leaves) prevent collection and cause memory leaks.')),
    S('alternative_implementations',
      P('Gaya "pulangkan nilai baharu" — fungsi tidak mengubah input, pemanggil memilih untuk menggantikannya:', 'The "return a new value" style — the function does not change its input, and the caller chooses to replace it:'),
      CODE('return-new', 'luau', 'luau', ['Fungsi tanpa kesan sampingan', 'A function without side effects'], `
local function withBonus(stats: {[string]: number}, bonus: number): {[string]: number}
  local result = {}
  for k, v in stats do
    result[k] = v + bonus
  end
  return result
end

local base = {atk = 10, def = 5}
local buffed = withBonus(base, 3)
print(base.atk, buffed.atk, buffed.def)
`, '10\t13\t8'),
      EXPLAIN('return-new',
        ['1–7', 'Bina dan pulangkan table baharu; input dibaca sahaja.', 'Build and return a new table; the input is only read.'],
        ['9–11', '`base` tidak berubah — mudah difahami dan diuji.', '`base` is unchanged — easy to reason about and test.'])),
    S('common_mistakes',
      UL(
        ['Menetapkan satu table "lalai" kepada beberapa entiti.', 'Assigning one "default" table to several entities.'],
        ['Menjangka `t = {}` dalam fungsi mengosongkan table pemanggil.', 'Expecting `t = {}` inside a function to empty the caller’s table.'],
        ['Membandingkan table dengan `==` untuk menyemak kandungan.', 'Comparing tables with `==` to check contents.'],
        ['Mengubah table yang diterima sebagai argumen tanpa mendokumenkannya.', 'Mutating a table received as an argument without documenting it.'],
      )),
    S('debugging',
      P('Apabila perubahan pada satu entiti "bocor" ke entiti lain, semak sama ada mereka berkongsi objek: cetak `a == b` atau `tostring(a)` dan `tostring(b)` (alamat yang sama bermakna objek yang sama). Kemudian cari tempat table itu dicipta — biasanya satu constructor di luar gelung atau fungsi. Fungsi ini mengesan perkongsian dalam senarai rekod:',
        'When a change to one entity "leaks" into another, check whether they share an object: print `a == b`, or `tostring(a)` and `tostring(b)` (the same address means the same object). Then find where the table was created — usually one constructor outside a loop or function. This function detects sharing in a list of records:'),
      CODE('find-shared', 'luau', 'luau', ['Mengesan table yang dikongsi', 'Detecting shared tables'], `
local function findShared(records: {[string]: {any}}): {string}
  local seen: {[any]: string} = {}
  local problems = {}
  local names = {}
  for name in records do table.insert(names, name) end
  table.sort(names)
  for _, name in names do
    local t = records[name]
    if seen[t] then
      table.insert(problems, \`{name} shares a table with {seen[t]}\`)
    else
      seen[t] = name
    end
  end
  return problems
end

local kit = {"pistol"}
local loadouts = {Aina = kit, Ben = {"pistol"}, Chen = kit}
print(table.concat(findShared(loadouts), "; "))
`, 'Chen shares a table with Aina'),
      EXPLAIN('find-shared',
        ['1–6', 'Lawati nama dalam susunan tetap untuk laporan yang stabil.', 'Visit names in a fixed order for a stable report.'],
        ['7–15', 'Table digunakan sebagai **kunci** (identiti): jika sudah dilihat, ia dikongsi.', 'The table is used as a **key** (identity): if already seen, it is shared.'],
        ['18–20', 'Aina dan Chen berkongsi `kit`; Ben mempunyai table sendiri walaupun kandungannya sama.', 'Aina and Chen share `kit`; Ben has his own table even though the contents are equal.'])),
    S('performance',
      P('Menghantar table ialah O(1) tanpa mengira saiznya — hanya rujukan disalin. Inilah sebabnya fungsi yang mengubah table di tempat (`table.sort`, `table.insert`) pantas. Gaya "pulangkan baharu" memperuntukkan table setiap panggilan; ia lebih selamat tetapi elakkan dalam kod setiap bingkai untuk table besar.', 'Passing a table is O(1) regardless of its size — only the reference is copied. This is why functions that change tables in place (`table.sort`, `table.insert`) are fast. The "return new" style allocates a table per call; it is safer but avoid it in per-frame code for large tables.')),
    S('software_engineering',
      P('Fungsi dengan kesan sampingan tersembunyi berbanding kesan yang jelas:', 'A function with a hidden side effect versus an explicit one:'),
      CODE('poor-hidden-mutation', 'luau', 'luau', ['Pelaksanaan lemah: perubahan tersembunyi', 'Poor implementation: a hidden mutation'], `
local function priceWithTax(item: {price: number}): number
  item.price = math.floor(item.price * 1.1)
  return item.price
end
local sword = {price = 100}
print(priceWithTax(sword), priceWithTax(sword), sword.price)
`, '110\t121\t121'),
      EXPLAIN('poor-hidden-mutation',
        ['1–4', 'Nama fungsi mencadangkan pengiraan, tetapi ia mengubah `item.price`.', 'The function name suggests a calculation, but it changes `item.price`.'],
        ['5–6', 'Setiap panggilan menaikkan harga lagi — 110, kemudian 121.', 'Each call raises the price again — 110, then 121.']),
      CODE('improved-pure-price', 'luau', 'luau', ['Pelaksanaan lebih baik: tiada perubahan', 'Improved implementation: no mutation'], `
local function priceWithTax(item: {price: number}): number
  return math.floor(item.price * 1.1)
end
local sword = {price = 100}
print(priceWithTax(sword), priceWithTax(sword), sword.price)
`, '110\t110\t100'),
      EXPLAIN('improved-pure-price',
        ['1–3', 'Hanya membaca `item.price` dan memulangkan nilai baharu.', 'Only reads `item.price` and returns a new value.'],
        ['4–5', 'Panggilan berulang memberi hasil yang sama; harga asal kekal.', 'Repeated calls give the same result; the original price stays.'])),
    S('industry_use_cases',
      UL(
        ['Data pemain dicipta dengan pembina bagi setiap pemain untuk mengelak perkongsian.', 'Player data is created with a constructor per player to avoid sharing.'],
        ['Keadaan pusingan dikongsi secara sengaja antara modul melalui satu table.', 'Round state is shared deliberately between modules through one table.'],
        ['Fungsi utiliti dalam pustaka biasanya tidak mengubah input dan mendokumenkan pengecualian.', 'Utility functions in libraries usually do not change their inputs and document any exceptions.'],
      )),
    S('practical_demonstration',
      OL(
        ['Ubah `tryReset` supaya ia memulangkan table baharu dan pemanggil menggunakannya.', 'Change `tryReset` so it returns a new table and the caller uses it.'],
        ['Tambah pemain ketiga yang berkongsi `kit` dalam `find-shared` dan ramalkan laporan.', 'Add a third player sharing `kit` in `find-shared` and predict the report.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Perbandingan kandungan.** Tulis `sameItems(a, b)` yang membandingkan dua array mengikut kandungan (bukan identiti), dan gunakan untuk menyemak sama ada dua loadout setara.', '**Content comparison.** Write `sameItems(a, b)` that compares two arrays by contents (not identity), and use it to check whether two loadouts are equivalent.'),
      CODE('same-items', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function sameItems(a: {any}, b: {any}): boolean
  if a == b then return true end
  if #a ~= #b then return false end
  for i = 1, #a do
    if a[i] ~= b[i] then return false end
  end
  return true
end

local x = {"pistol", "medkit"}
local y = {"pistol", "medkit"}
local z = {"medkit", "pistol"}
print(x == y, sameItems(x, y), sameItems(x, z), sameItems(x, x))
`, 'false\ttrue\tfalse\ttrue'),
      EXPLAIN('same-items',
        ['1–8', 'Identiti sama → benar segera; panjang berbeza → palsu; kemudian bandingkan setiap elemen.', 'Same identity → true at once; different lengths → false; then compare each element.'],
        ['10–13', '`==` palsu untuk x dan y, tetapi kandungannya sama; susunan berbeza (z) tidak sama.', '`==` is false for x and y, but their contents are equal; a different order (z) is not equal.'])),
    S('summary',
      UL(
        ['Table ialah objek; pemboleh ubah, medan dan argumen memegang rujukan.', 'Tables are objects; variables, fields and arguments hold references.'],
        ['Mengubah dilihat oleh semua rujukan; menetapkan semula mengubah satu nama sahaja.', 'Mutation is seen by every reference; rebinding changes one name only.'],
        ['`==` membandingkan identiti; tulis fungsi untuk membandingkan kandungan.', '`==` compares identity; write a function to compare contents.'],
        ['Cipta table baharu bagi setiap entiti dengan pembina.', 'Create a new table per entity with a constructor.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah `local b = a; b.x = 1` mengubah `a.x`?', 'Why does `local b = a; b.x = 1` change `a.x`?'],
        ['Mengapakah `inv = {}` dalam fungsi tidak mengosongkan inventori pemanggil?', 'Why does `inv = {}` inside a function not empty the caller’s inventory?'],
        ['Apakah hasil `{} == {}`?', 'What is the result of `{} == {}`?'],
        ['Bagaimanakah anda mengesan dua pemain yang berkongsi table?', 'How would you detect two players sharing a table?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Tables: pass by reference', url: `${DOCS}/luau/tables#pass-by-reference` },
        { title: 'Programming in Lua (1st ed.) — 2.5 Tables', url: 'https://www.lua.org/pil/2.5.html' },
        { title: 'Luau — Library: rawequal', url: `${LUAU}/library#global-functions` },
        { title: 'Lua 5.1 Reference Manual §2.2 — Values and Types', url: 'https://www.lua.org/manual/5.1/manual.html#2.2' },
      )),
  ],
};

// ─── 3.2 table.clone and deep copies ───────────────────────────────────────

export const LUAU104_3_2: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 3,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Membuat [[shallow-copy|salinan cetek]] dengan `table.clone` dan menerangkan hadnya.', 'Make a [[shallow-copy|shallow copy]] with `table.clone` and explain its limits.'],
        ['Menulis fungsi [[deep-copy|salinan dalam]] rekursif.', 'Write a recursive [[deep-copy|deep copy]] function.'],
        ['Mengendalikan kitaran dalam salinan dalam dengan table "sudah dilihat".', 'Handle cycles in a deep copy with a "seen" table.'],
        ['Memilih antara rujukan, salinan cetek dan salinan dalam.', 'Choose between a reference, a shallow copy and a deep copy.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1: semantik rujukan.', 'Lecture 3.1: reference semantics.'],
        ['LUA104/LUAU103: fungsi rekursif.', 'LUA104/LUAU103: recursive functions.'],
      )),
    S('introduction',
      P('Kuliah 3.1 menunjukkan bahawa penugasan tidak menyalin table. Apabila anda benar-benar memerlukan salinan — templat musuh yang disalin bagi setiap musuh baharu, petikan keadaan permainan sebelum perubahan, atau data lalai bagi pemain baharu — Luau menyediakan `table.clone`. Tetapi `table.clone` ialah salinan **cetek**: table bersarang di dalamnya masih dikongsi. Kuliah ini menunjukkan dengan tepat apa yang disalin dan apa yang tidak, menulis salinan dalam rekursif, dan mengendalikan kes table yang merujuk dirinya sendiri.',
        'Lecture 3.1 showed that assignment does not copy tables. When you really need a copy — an enemy template copied for each new enemy, a snapshot of game state before a change, or default data for a new player — Luau provides `table.clone`. But `table.clone` is a **shallow** copy: nested tables inside it are still shared. This lecture shows exactly what is copied and what is not, writes a recursive deep copy, and handles tables that refer to themselves.'),
      KEY('`table.clone` menyalin satu tahap. Table bersarang memerlukan salinan dalam.', '`table.clone` copies one level. Nested tables need a deep copy.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`table.clone(t)` — table baharu dengan kunci dan nilai yang sama (termasuk metatable); nilai table dikongsi.', '`table.clone(t)` — a new table with the same keys and values (including the metatable); table values are shared.'],
        ['Salinan dalam: salin setiap nilai table secara rekursif.', 'Deep copy: copy every table value recursively.'],
        ['Kitaran (`a.self = a`) menyebabkan rekursi tanpa had → `stack overflow`.', 'A cycle (`a.self = a`) causes unbounded recursion → `stack overflow`.'],
        ['Table "sudah dilihat" (`seen[original] = copy`) memecahkan kitaran dan mengekalkan perkongsian dalaman.', 'A "seen" table (`seen[original] = copy`) breaks cycles and preserves internal sharing.'],
      )),
    S('detailed_theory',
      P('`table.clone(t)` memperuntukkan table baharu dengan saiz yang sama dan menyalin setiap pasangan kunci–nilai — dengan cekap dalam C. Nombor, string dan boolean disalin sebagai nilai, jadi menukarnya dalam salinan tidak menjejaskan asal. Tetapi nilai yang merupakan table disalin sebagai **rujukan**: salinan dan asal kini menunjuk ke table bersarang yang sama. Ukuran kami juga menunjukkan bahawa salinan table beku **tidak** beku — `table.clone` mencipta table biasa yang boleh ditulis. Hujah yang bukan table ditolak dengan `invalid argument #1 to \'clone\' (table expected, got number)`.',
        '`table.clone(t)` allocates a new table of the same size and copies every key–value pair — efficiently, in C. Numbers, strings and booleans are copied as values, so changing them in the copy does not affect the original. But values that are tables are copied as **references**: the copy and the original now point at the same nested table. Our measurements also show that a clone of a frozen table is **not** frozen — `table.clone` creates an ordinary, writable table. A non-table argument is rejected with `invalid argument #1 to \'clone\' (table expected, got number)`.'),
      P('Salinan dalam menyelesaikan perkongsian bersarang dengan rekursi: untuk setiap nilai, jika ia table, salin ia secara dalam; jika tidak, gunakan nilainya. Versi naif gagal pada **kitaran** — table yang merujuk dirinya sendiri atau nenek moyangnya — kerana rekursi tidak pernah berakhir; Luau melaporkan `stack overflow`. Penyelesaiannya ialah memo: table `seen` yang memetakan setiap table asal kepada salinannya. Sebelum menyalin, semak `seen`; jika sudah ada, pulangkan salinan sedia ada. Ini juga mengekalkan **perkongsian dalaman**: jika dua medan asal merujuk table yang sama, kedua-dua medan salinan merujuk salinan yang sama. Kunci table biasanya disalin sebagai rujukan, kerana ia mewakili identiti.',
        'A deep copy solves nested sharing with recursion: for each value, if it is a table, deep-copy it; otherwise use the value. The naive version fails on **cycles** — tables that refer to themselves or an ancestor — because the recursion never ends; Luau reports `stack overflow`. The fix is a memo: a `seen` table mapping each original table to its copy. Before copying, check `seen`; if present, return the existing copy. This also preserves **internal sharing**: if two original fields refer to the same table, both copied fields refer to the same copy. Table keys are usually copied as references, because they represent identity.')),
    S('technical_terminology', TERMS('shallow-copy', 'deep-copy', 'recursion', 'reference-semantics')),
    S('syntax_rules',
      UL(
        ['`local copy = table.clone(original)` — salinan cetek.', '`local copy = table.clone(original)` — a shallow copy.'],
        ['Rekursi: `c[k] = if type(v) == "table" then deepCopy(v, seen) else v`.', 'Recursion: `c[k] = if type(v) == "table" then deepCopy(v, seen) else v`.'],
        ['Memo: `if seen[t] then return seen[t] end; seen[t] = copy` sebelum menyalin anak.', 'Memo: `if seen[t] then return seen[t] end; seen[t] = copy` before copying children.'],
      )),
    S('code_demonstration',
      CODE('clone-shallow', 'luau', 'luau', ['Apa yang disalin oleh table.clone', 'What table.clone copies'], `
local template = {name = "goblin", hp = 30, drops = {"coin", "dagger"}}
local enemy = table.clone(template)

enemy.hp -= 10
enemy.name = "goblin #1"
table.insert(enemy.drops, "ear")

print(template.name, template.hp, #template.drops)
print(enemy.name, enemy.hp, #enemy.drops)
print(enemy == template, enemy.drops == template.drops)
`, 'goblin\t30\t3\ngoblin #1\t20\t3\nfalse\ttrue'),
      EXPLAIN('clone-shallow',
        ['1–2', '`table.clone` mencipta table baharu dengan medan yang sama.', '`table.clone` creates a new table with the same fields.'],
        ['4–6', 'Medan nombor dan string bebas; tetapi `drops` ialah table yang dikongsi.', 'Number and string fields are independent; but `drops` is a shared table.'],
        ['8–10', 'Templat tidak berubah kecuali `drops` — kini 3 item untuk kedua-duanya.', 'The template is unchanged except `drops` — now 3 items for both.'])),
    S('complete_examples',
      CODE('deep-copy-seen', 'luau', 'luau', ['Salinan dalam dengan pengendalian kitaran', 'A deep copy with cycle handling'], `
local function deepCopy<T>(original: T, seen: {[any]: any}?): T
  if type(original) ~= "table" then
    return original
  end
  local memo = seen or {}
  if memo[original] then
    return memo[original]
  end
  local copy = {}
  memo[original] = copy
  for k, v in original :: any do
    copy[k] = deepCopy(v, memo)
  end
  return copy :: any
end

local shared = {"coin"}
local boss = {name = "ogre", phase1 = {drops = shared}, phase2 = {drops = shared}}
boss.self = boss

local copy = deepCopy(boss)
table.insert(copy.phase1.drops, "gem")
print(#boss.phase1.drops, #copy.phase1.drops, #copy.phase2.drops)
print(copy.self == copy, copy.phase1.drops == copy.phase2.drops)
`, '1\t2\t2\ntrue\ttrue', {
        debug: BUG(`
local function deepCopy(t)
  local c = {}
  for k, v in t do
    c[k] = if type(v) == "table" then deepCopy(v) else v
  end
  return c
end
local node = {name = "root"}
node.parent = node
deepCopy(node)
`, 'example:4: stack overflow',
          '`node.parent = node` mencipta kitaran. Salinan naif menyalin `node`, kemudian `node.parent` (iaitu `node` lagi), kemudian `node.parent.parent`… tanpa henti, sehingga timbunan panggilan penuh. Gunakan table `seen` untuk mengingati table yang sudah disalin.',
          '`node.parent = node` creates a cycle. The naive copy copies `node`, then `node.parent` (which is `node` again), then `node.parent.parent`… forever, until the call stack is full. Use a `seen` table to remember tables already copied.'),
      }),
      EXPLAIN('deep-copy-seen',
        ['1–4', 'Generik `<T>`: jenis pulangan sama dengan input. Nilai bukan table dipulangkan terus.', 'A generic `<T>`: the return type matches the input. Non-table values are returned as they are.'],
        ['5–10', 'Semak memo dahulu; daftarkan salinan **sebelum** menyalin anak, supaya kitaran menemuinya.', 'Check the memo first; register the copy **before** copying children, so cycles find it.'],
        ['11–14', 'Salin setiap nilai secara rekursif dengan memo yang sama. `:: any` ialah cast jenis.', 'Copy every value recursively with the same memo. `:: any` is a type cast.'],
        ['16–24', 'Salinan bebas daripada asal, tetapi perkongsian dalaman (`drops`) dan kitaran (`self`) dikekalkan.', 'The copy is independent of the original, but internal sharing (`drops`) and the cycle (`self`) are preserved.']),
      CODE('snapshot-undo', 'luau', 'luau', ['Petikan untuk buat asal', 'Snapshots for undo'], `
local board = {turn = 1, cells = {"", "", ""}}
local history = {}

local function play(cell: number, mark: string)
  table.insert(history, {turn = board.turn, cells = table.clone(board.cells)})
  board.cells[cell] = mark
  board.turn += 1
end

local function undo()
  local previous = table.remove(history)
  if previous then
    board.turn, board.cells = previous.turn, previous.cells
  end
end

play(1, "X"); play(3, "O")
print(board.turn, table.concat(board.cells, "|"))
undo()
print(board.turn, table.concat(board.cells, "|"))
`, '3\tX||O\n2\tX||', {
        debug: BUG(`
local board = {cells = {"", ""}}
local saved = table.clone(board)
board.cells[1] = "X"
assert(saved.cells[1] == "", \`snapshot changed: {saved.cells[1]}\`)
`, 'example:4: snapshot changed: X',
          '`table.clone(board)` menyalin hanya tahap atas: `saved.cells` dan `board.cells` ialah table yang **sama**. Menulis `board.cells[1]` juga mengubah petikan. Salin tahap yang berubah (`table.clone(board.cells)`) atau gunakan salinan dalam.',
          '`table.clone(board)` copies only the top level: `saved.cells` and `board.cells` are the **same** table. Writing `board.cells[1]` also changes the snapshot. Copy the level that changes (`table.clone(board.cells)`) or use a deep copy.'),
      }),
      EXPLAIN('snapshot-undo',
        ['1–8', 'Sebelum setiap langkah, simpan petikan — `cells` disalin kerana ia table yang berubah.', 'Before each move, save a snapshot — `cells` is cloned because it is the table that changes.'],
        ['10–15', '`undo` memulihkan petikan terakhir.', '`undo` restores the last snapshot.'],
        ['17–20', 'Dua langkah, kemudian buat asal: kembali ke giliran 2 dengan hanya "X".', 'Two moves, then undo: back to turn 2 with only "X".'])),
    S('line_by_line',
      EXPLAIN('deep-copy-seen',
        ['10', '`memo[original] = copy` mesti berlaku sebelum gelung: apabila rekursi menemui `boss.self`, ia mendapati salinan yang sedang dibina.', '`memo[original] = copy` must happen before the loop: when the recursion reaches `boss.self`, it finds the copy being built.']),
      EXPLAIN('clone-shallow',
        ['6', '`table.insert(enemy.drops, …)` mengubah table bersarang yang dikongsi — bukan salinan.', '`table.insert(enemy.drops, …)` changes the shared nested table — not a copy.'])),
    S('why_this_way',
      P('Mengapa `table.clone` cetek? Kerana salinan cetek pantas dan cukup untuk kebanyakan table rata, dan kerana salinan dalam memerlukan keputusan (kitaran? kunci table? metatable?) yang bergantung pada kes. Luau memberikan blok binaan yang pantas dan membiarkan anda menulis dasar salinan dalam yang sesuai.',
        'Why is `table.clone` shallow? Because shallow copies are fast and enough for most flat tables, and because a deep copy requires decisions (cycles? table keys? metatables?) that depend on the case. Luau gives you a fast building block and lets you write the deep-copy policy that fits.'),
      P('Gunakan rujukan **apabila** perkongsian dikehendaki; `table.clone` **apabila** table rata atau hanya tahap atas berubah; salinan dalam **apabila** keseluruhan struktur mesti bebas (templat, petikan simpanan).', 'Use a reference **when** sharing is wanted; `table.clone` **when** the table is flat or only the top level changes; a deep copy **when** the whole structure must be independent (templates, save snapshots).')),
    S('execution_flow',
      OL(
        ['`deepCopy(boss)`: memo kosong dicipta; salinan boss didaftarkan.', '`deepCopy(boss)`: an empty memo is created; the boss copy is registered.'],
        ['`phase1` disalin; `shared` disalin kali pertama dan didaftarkan.', '`phase1` is copied; `shared` is copied for the first time and registered.'],
        ['`phase2.drops` menemui `shared` dalam memo → salinan yang sama digunakan semula.', '`phase2.drops` finds `shared` in the memo → the same copy is reused.'],
        ['`boss.self` menemui `boss` dalam memo → menunjuk ke salinan boss itu sendiri.', '`boss.self` finds `boss` in the memo → points at the boss copy itself.'],
      )),
    S('memory_behaviour',
      P('`table.clone` memperuntukkan satu table; salinan dalam memperuntukkan satu table bagi setiap table bersarang, ditambah memo. Untuk data pemain yang besar, salinan dalam setiap bingkai sangat mahal — salin hanya semasa menyimpan atau membuat petikan. Table memo dibuang selepas salinan selesai, jadi rujukan di dalamnya tidak menyebabkan kebocoran.', '`table.clone` allocates one table; a deep copy allocates one table per nested table, plus the memo. For large player data, a deep copy every frame is very expensive — copy only when saving or taking snapshots. The memo table is discarded once the copy finishes, so the references in it do not cause leaks.')),
    S('alternative_implementations',
      P('Untuk data yang hanya mengandungi nilai mudah dan table (tiada kitaran, tiada kunci table), versi pendek yang mencukupi:', 'For data containing only plain values and tables (no cycles, no table keys), a short version that is sufficient:'),
      CODE('deep-copy-simple', 'luau', 'luau', ['Salinan dalam tanpa kitaran', 'A deep copy without cycles'], `
local function copyTree(t: {[any]: any}): {[any]: any}
  local c = table.clone(t)
  for k, v in c do
    if type(v) == "table" then
      c[k] = copyTree(v)
    end
  end
  return c
end

local defaults = {audio = {music = 50, sfx = 70}, controls = {invertY = false}}
local mine = copyTree(defaults)
mine.audio.music = 0
print(defaults.audio.music, mine.audio.music, mine.controls.invertY)
`, '50\t0\tfalse'),
      EXPLAIN('deep-copy-simple',
        ['1–9', '`table.clone` menyalin tahap semasa dalam C; kemudian setiap nilai table digantikan dengan salinannya sendiri.', '`table.clone` copies the current level in C; then every table value is replaced by its own copy.'],
        ['11–14', 'Tetapan pemain bebas daripada lalai. Tiada memo — selamat hanya untuk data tanpa kitaran.', 'The player’s settings are independent of the defaults. No memo — safe only for data without cycles.'])),
    S('common_mistakes',
      UL(
        ['Menganggap `table.clone` menyalin table bersarang.', 'Assuming `table.clone` copies nested tables.'],
        ['Salinan dalam naif pada data dengan kitaran.', 'A naive deep copy on data with cycles.'],
        ['Menyalin dalam setiap bingkai apabila salinan cetek atau rujukan mencukupi.', 'Deep-copying every frame when a shallow copy or a reference is enough.'],
        ['Menjangka salinan table beku juga beku.', 'Expecting a clone of a frozen table to be frozen too.'],
      )),
    S('debugging',
      P('Jika petikan atau templat "berubah sendiri", periksa table bersarang: bandingkan `copy.x == original.x` bagi setiap medan table — `true` bermakna dikongsi. `stack overflow` dalam fungsi salinan hampir selalu bermakna kitaran. Pembantu berikut menyenaraikan medan table yang dikongsi antara dua table:',
        'If a snapshot or template "changes by itself", inspect the nested tables: compare `copy.x == original.x` for each table field — `true` means shared. A `stack overflow` in a copy function almost always means a cycle. The following helper lists table fields shared between two tables:'),
      CODE('shared-fields', 'luau', 'luau', ['Mencari medan yang dikongsi', 'Finding shared fields'], `
local function sharedFields(a: {[string]: any}, b: {[string]: any}): string
  local out = {}
  for k, v in a do
    if type(v) == "table" and b[k] == v then
      table.insert(out, k)
    end
  end
  table.sort(out)
  return table.concat(out, ", ")
end

local original = {stats = {}, tags = {}, name = "x"}
local shallow = table.clone(original)
shallow.tags = table.clone(original.tags)
print("shared:", sharedFields(original, shallow))
`, 'shared:\tstats'),
      EXPLAIN('shared-fields',
        ['1–10', 'Medan table yang sama objek dalam kedua-dua table dilaporkan, diisih.', 'Table fields that are the same object in both tables are reported, sorted.'],
        ['12–15', '`tags` disalin secara manual; `stats` masih dikongsi — punca pepijat yang mungkin.', '`tags` was copied manually; `stats` is still shared — a likely bug source.'])),
    S('performance',
      P('`table.clone` dilaksanakan dalam C dan jauh lebih pantas daripada gelung Luau yang menyalin kunci satu demi satu. Salinan dalam ialah O(jumlah saiz) dengan satu peruntukan bagi setiap table. Menggunakan `table.clone` di dalam salinan dalam (seperti `copyTree`) memanfaatkan salinan C untuk setiap tahap.', '`table.clone` is implemented in C and is much faster than a Luau loop copying keys one by one. A deep copy is O(total size) with one allocation per table. Using `table.clone` inside a deep copy (as in `copyTree`) uses the C copy for each level.')),
    S('software_engineering',
      P('Menyalin manual setiap medan berbanding `table.clone`:', 'Copying every field by hand versus `table.clone`:'),
      CODE('poor-manual-copy', 'luau', 'luau', ['Pelaksanaan lemah: salinan medan manual', 'Poor implementation: a manual field copy'], `
local function copyEnemy(e)
  return {name = e.name, hp = e.hp}
end
local template = {name = "imp", hp = 12, speed = 18}
local imp = copyEnemy(template)
print(imp.name, imp.hp, imp.speed)
`, 'imp\t12\tnil'),
      EXPLAIN('poor-manual-copy',
        ['1–3', 'Setiap medan disenaraikan dengan tangan.', 'Every field is listed by hand.'],
        ['4–6', 'Medan `speed` yang ditambah kemudian terlupa — salinan tidak lengkap secara senyap.', 'The `speed` field added later was forgotten — the copy is silently incomplete.']),
      CODE('improved-clone-copy', 'luau', 'luau', ['Pelaksanaan lebih baik: table.clone', 'Improved implementation: table.clone'], `
local function spawnFrom(template: {[string]: any}, id: number)
  local e = table.clone(template)
  e.id = id
  return e
end
local template = {name = "imp", hp = 12, speed = 18}
local imp = spawnFrom(template, 7)
print(imp.name, imp.hp, imp.speed, imp.id, template.id)
`, 'imp\t12\t18\t7\tnil'),
      EXPLAIN('improved-clone-copy',
        ['1–5', '`table.clone` menyalin semua medan, termasuk yang ditambah kemudian.', '`table.clone` copies every field, including ones added later.'],
        ['6–8', 'Medan baharu (`id`) hanya pada salinan.', 'The new field (`id`) is only on the copy.'])),
    S('industry_use_cases',
      UL(
        ['Templat musuh dan item disalin untuk setiap kejadian baharu.', 'Enemy and item templates are copied for every new instance.'],
        ['Data lalai pemain disalin secara dalam apabila profil baharu dicipta.', 'Default player data is deep-copied when a new profile is created.'],
        ['Petikan keadaan untuk buat asal, main semula atau pengesahan pelayan.', 'State snapshots for undo, replays or server validation.'],
      )),
    S('practical_demonstration',
      OL(
        ['Buang `memo[original] = copy` dari `deepCopy` dan perhatikan apa yang berlaku pada `boss.self`.', 'Remove `memo[original] = copy` from `deepCopy` and watch what happens with `boss.self`.'],
        ['Ubah `snapshot-undo` untuk menyokong buat asal dua kali.', 'Change `snapshot-undo` to support undoing twice.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Profil baharu daripada lalai.** Cipta profil pemain daripada table lalai bersarang, gabungkan dengan tetapan simpanan separa, dan pastikan lalai tidak pernah berubah.', '**A new profile from defaults.** Create a player profile from a nested defaults table, merge in a partial saved settings table, and make sure the defaults never change.'),
      CODE('profile-merge', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local DEFAULTS = {coins = 0, settings = {music = 50, sfx = 70, hints = true}}

local function merge(base: {[string]: any}, overrides: {[string]: any}): {[string]: any}
  local result = table.clone(base)
  for k, v in overrides do
    if type(v) == "table" and type(result[k]) == "table" then
      result[k] = merge(result[k], v)
    else
      result[k] = v
    end
  end
  return result
end

local saved = {coins = 120, settings = {music = 0}}
local profile = merge(DEFAULTS, saved)
profile.settings.sfx = 10
print(profile.coins, profile.settings.music, profile.settings.sfx, profile.settings.hints)
print(DEFAULTS.coins, DEFAULTS.settings.music, DEFAULTS.settings.sfx)
`, '120\t0\t10\ttrue\n0\t50\t70'),
      EXPLAIN('profile-merge',
        ['1', 'Lalai bersarang.', 'Nested defaults.'],
        ['3–13', 'Klon tahap semasa; untuk table dalam kedua-dua sisi, gabung secara rekursif (yang juga mengklon).', 'Clone the current level; for tables on both sides, merge recursively (which clones too).'],
        ['15–19', 'Nilai simpanan menggantikan lalai; nilai yang tiada dalam simpanan datang dari lalai; `DEFAULTS` tidak berubah.', 'Saved values replace defaults; values missing from the save come from the defaults; `DEFAULTS` is unchanged.'])),
    S('summary',
      UL(
        ['`table.clone` = salinan cetek; table bersarang dikongsi; salinan table beku tidak beku.', '`table.clone` = a shallow copy; nested tables are shared; a frozen table’s clone is not frozen.'],
        ['Salinan dalam = rekursi; tambah memo `seen` untuk kitaran dan perkongsian dalaman.', 'Deep copy = recursion; add a `seen` memo for cycles and internal sharing.'],
        ['Salin hanya tahap yang berubah apabila boleh.', 'Copy only the levels that change when possible.'],
        ['Gabungkan lalai dan simpanan tanpa mengubah lalai.', 'Merge defaults and saves without changing the defaults.'],
      )),
    S('knowledge_check',
      OL(
        ['Selepas `local c = table.clone(t)`, adakah `c.list == t.list`?', 'After `local c = table.clone(t)`, is `c.list == t.list`?'],
        ['Mengapakah salinan dalam naif menyebabkan `stack overflow` pada kitaran?', 'Why does a naive deep copy cause `stack overflow` on a cycle?'],
        ['Mengapakah memo mesti diisi sebelum menyalin anak?', 'Why must the memo be filled before copying children?'],
        ['Bilakah `table.clone` mencukupi untuk petikan?', 'When is `table.clone` enough for a snapshot?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library: table.clone', url: `${LUAU}/library#table-library` },
        { title: 'Roblox Creator Hub — Tables: copying tables', url: `${DOCS}/luau/tables#copy-tables` },
        { title: 'Luau RFC — table.clone', url: 'https://rfcs.luau.org/function-table-clone.html' },
        { title: 'Luau — Generics', url: `${LUAU}/typecheck#generics` },
      )),
  ],
};

// ─── 3.3 table.freeze and table.isfrozen ───────────────────────────────────

export const LUAU104_3_3: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 3,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menjadikan table baca sahaja dengan `table.freeze` dan menyemak dengan `table.isfrozen`.', 'Make tables read-only with `table.freeze` and check with `table.isfrozen`.'],
        ['Menerangkan bahawa pembekuan adalah cetek dan menulis pembekuan dalam.', 'Explain that freezing is shallow and write a deep freeze.'],
        ['Mengenal pasti operasi pustaka yang gagal pada [[frozen-table|table beku]].', 'Identify library operations that fail on a [[frozen-table|frozen table]].'],
        ['Menggunakan `table.clone` untuk mendapatkan versi boleh ubah.', 'Use `table.clone` to get a mutable version.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1–3.2: rujukan dan salinan.', 'Lectures 3.1–3.2: references and copies.'],
      )),
    S('introduction',
      P('Sesetengah data tidak sepatutnya berubah selepas dicipta: jadual harga, statistik senjata asas, senarai tahap, pemalar permainan. Kuliah 3.1 menunjukkan bahawa sesiapa yang memegang rujukan boleh mengubah table — termasuk kod yang ditulis oleh rakan sepasukan enam bulan kemudian. Luau menyediakan `table.freeze`, yang menjadikan table **baca sahaja**: sebarang percubaan menulis menimbulkan ralat serta-merta, di tempat pepijat berlaku, dan bukannya kerosakan data senyap yang ditemui jauh kemudian.',
        'Some data should never change after it is created: price tables, base weapon stats, the level list, game constants. Lecture 3.1 showed that anyone holding a reference can change a table — including code a teammate writes six months later. Luau provides `table.freeze`, which makes a table **read-only**: any attempt to write raises an error immediately, where the bug happens, instead of silent data corruption discovered much later.'),
      KEY('`table.freeze` mengunci satu tahap. Penulisan → `attempt to modify a readonly table`.', '`table.freeze` locks one level. Writes → `attempt to modify a readonly table`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`table.freeze(t)` membekukan `t` dan memulangkan `t` yang sama.', '`table.freeze(t)` freezes `t` and returns the same `t`.'],
        ['Membaca dibenarkan; menulis, `table.insert/remove/sort/clear` dan `rawset` gagal.', 'Reading is allowed; writing, `table.insert/remove/sort/clear` and `rawset` fail.'],
        ['Cetek: table bersarang kekal boleh ditulis.', 'Shallow: nested tables stay writable.'],
        ['Kekal: tiada `unfreeze`; membekukan dua kali ialah ralat.', 'Permanent: there is no `unfreeze`; freezing twice is an error.'],
        ['`table.clone` table beku memberi salinan yang boleh ditulis.', '`table.clone` of a frozen table gives a writable copy.'],
      )),
    S('detailed_theory',
      P('`table.freeze` menetapkan bendera baca sahaja pada objek table. Selepas itu, setiap penulisan — penugasan medan, `rawset`, dan fungsi pustaka yang mengubah table seperti `table.insert`, `table.remove`, `table.sort` dan `table.clear` — ditolak dengan `attempt to modify a readonly table`. Ukuran kami menunjukkan butiran yang penting untuk penyahpepijatan: penugasan langsung (`config.speed = 20`) melaporkan nombor baris (`example:2:`), tetapi ralat dari fungsi pustaka C (`table.insert` pada table beku) tidak mempunyai nombor baris. Membekukan table yang sudah beku menimbulkan `invalid argument #1 to \'freeze\' (table is already frozen)`.',
        '`table.freeze` sets a read-only flag on the table object. After that, every write — field assignment, `rawset`, and library functions that change tables such as `table.insert`, `table.remove`, `table.sort` and `table.clear` — is rejected with `attempt to modify a readonly table`. Our measurements show a detail that matters for debugging: a direct assignment (`config.speed = 20`) reports a line number (`example:2:`), but the error from a C library function (`table.insert` on a frozen table) has no line number. Freezing an already frozen table raises `invalid argument #1 to \'freeze\' (table is already frozen)`.'),
      P('Pembekuan adalah **cetek**: hanya table yang diberikan dikunci. Jika konfigurasi mengandungi table bersarang (`config.weapons.sword`), table bersarang itu masih boleh ditulis kecuali dibekukan juga. Pembekuan dalam rekursif menyelesaikan ini — dengan semakan `table.isfrozen` untuk mengelakkan ralat pembekuan berganda pada table yang dikongsi. Kerana pembekuan bersifat kekal, cara untuk "mengubah" data beku ialah membuat salinan dengan `table.clone` (yang tidak beku), mengubah salinan, dan membekukannya jika perlu. Dalam Roblox, pemalar dalam ModuleScript sering dibekukan supaya skrip yang memerlukannya tidak boleh mengubahnya secara tidak sengaja.',
        'Freezing is **shallow**: only the table you pass is locked. If a configuration contains nested tables (`config.weapons.sword`), those nested tables are still writable unless they are frozen too. A recursive deep freeze solves this — with a `table.isfrozen` check to avoid the double-freeze error on shared tables. Because freezing is permanent, the way to "change" frozen data is to make a copy with `table.clone` (which is not frozen), change the copy, and freeze it if needed. In Roblox, constants in a ModuleScript are often frozen so that scripts requiring them cannot change them by accident.')),
    S('technical_terminology', TERMS('frozen-table', 'shallow-copy', 'reference-semantics', 'module')),
    S('syntax_rules',
      UL(
        ['`local PRICES = table.freeze({sword = 100, bow = 80})`.', '`local PRICES = table.freeze({sword = 100, bow = 80})`.'],
        ['`table.isfrozen(PRICES)` → `true`; hujah bukan table ialah ralat.', '`table.isfrozen(PRICES)` → `true`; a non-table argument is an error.'],
        ['Versi boleh ubah: `local editable = table.clone(PRICES)`.', 'A mutable version: `local editable = table.clone(PRICES)`.'],
      )),
    S('code_demonstration',
      CODE('freeze-basics', 'luau', 'luau', ['Membekukan konfigurasi', 'Freezing a configuration'], `
local CONFIG = table.freeze({
  roundSeconds = 120,
  maxPlayers = 8,
  modes = {"classic", "teams"},
})

print(CONFIG.roundSeconds, table.isfrozen(CONFIG), table.isfrozen(CONFIG.modes))

local ok, err = pcall(function()
  CONFIG.maxPlayers = 100
end)
print(ok, err)

table.insert(CONFIG.modes, "chaos")
print(#CONFIG.modes)
`, '120\ttrue\tfalse\nfalse\texample:10: attempt to modify a readonly table\n3'),
      EXPLAIN('freeze-basics',
        ['1–5', '`table.freeze` memulangkan table yang sama — boleh dibekukan semasa dicipta.', '`table.freeze` returns the same table — it can be frozen as it is created.'],
        ['7', 'Membaca dibenarkan. Table luar beku; `modes` di dalamnya tidak.', 'Reading is allowed. The outer table is frozen; `modes` inside it is not.'],
        ['9–12', 'Penulisan ditolak; `pcall` menangkap ralat bersama nombor baris.', 'The write is rejected; `pcall` catches the error with its line number.'],
        ['14–15', 'Pembekuan cetek: array bersarang masih boleh diubah.', 'Shallow freezing: the nested array can still be changed.'])),
    S('complete_examples',
      CODE('deep-freeze', 'luau', 'luau', ['Pembekuan dalam', 'A deep freeze'], `
local function deepFreeze<T>(t: T): T
  if type(t) == "table" and not table.isfrozen(t) then
    for _, v in t :: any do
      deepFreeze(v)
    end
    table.freeze(t)
  end
  return t
end

local shared = {damage = 10}
local WEAPONS = deepFreeze({
  sword = {base = shared, speed = 1.2},
  dagger = {base = shared, speed = 2.0},
})

print(table.isfrozen(WEAPONS), table.isfrozen(WEAPONS.sword), table.isfrozen(shared))
print(pcall(function() WEAPONS.dagger.base.damage = 99 end))
`, 'true\ttrue\ttrue\nfalse\texample:18: attempt to modify a readonly table', {
        debug: BUG(`
local LEVELS = table.freeze({"tutorial", "forest", "castle"})
table.insert(LEVELS, "bonus")
print(#LEVELS)
`, 'attempt to modify a readonly table',
          '`table.insert` cuba menulis ke array beku. Mesej tiada nombor baris kerana ralat datang dari dalam fungsi pustaka C — cari panggilan pustaka pada table beku. Jika senarai perlu dilanjutkan, klon dahulu: `local levels = table.clone(LEVELS)`.',
          '`table.insert` tries to write to a frozen array. The message has no line number because the error comes from inside a C library function — look for library calls on frozen tables. If the list must be extended, clone it first: `local levels = table.clone(LEVELS)`.'),
      }),
      EXPLAIN('deep-freeze',
        ['1–9', 'Bekukan anak dahulu, kemudian table itu sendiri. `isfrozen` melangkau table yang sudah beku (seperti `shared` pada lawatan kedua).', 'Freeze the children first, then the table itself. `isfrozen` skips tables already frozen (such as `shared` on the second visit).'],
        ['11–15', '`shared` dirujuk dua kali — dibekukan sekali sahaja tanpa ralat.', '`shared` is referenced twice — frozen only once, without an error.'],
        ['17–18', 'Setiap tahap beku; penulisan di tahap terdalam juga ditolak.', 'Every level is frozen; a write at the deepest level is also rejected.']),
      CODE('edit-frozen', 'luau', 'luau', ['Mengubah melalui salinan', 'Changing through a copy'], `
local BASE_PRICES = table.freeze({sword = 100, bow = 80, potion = 15})

local function withSale(prices: {[string]: number}, percent: number): {[string]: number}
  local sale = table.clone(prices)
  for item, price in sale do
    sale[item] = math.floor(price * (100 - percent) / 100)
  end
  return table.freeze(sale)
end

local SALE = withSale(BASE_PRICES, 25)
print(BASE_PRICES.sword, SALE.sword, SALE.potion, table.isfrozen(SALE))
`, '100\t75\t11\ttrue', {
        debug: BUG(`
local DEFAULTS = table.freeze({volume = 50})
local function applyPreset(t)
  table.freeze(t)
  return t
end
applyPreset(DEFAULTS)
`, 'example:3: invalid argument #1 to \'freeze\' (table is already frozen)',
          '`DEFAULTS` sudah beku, dan `table.freeze` menolak table yang sudah beku. Fungsi yang mungkin menerima table beku patut menyemak dahulu: `if not table.isfrozen(t) then table.freeze(t) end`.',
          '`DEFAULTS` is already frozen, and `table.freeze` rejects a table that is already frozen. A function that may receive frozen tables should check first: `if not table.isfrozen(t) then table.freeze(t) end`.'),
      }),
      EXPLAIN('edit-frozen',
        ['1', 'Harga asas beku.', 'Frozen base prices.'],
        ['3–9', '`table.clone` memberi salinan boleh ubah; ubah, kemudian bekukan dan pulangkan.', '`table.clone` gives a mutable copy; change it, then freeze and return it.'],
        ['11–12', 'Asal tidak berubah; harga jualan juga beku.', 'The original is unchanged; the sale prices are frozen too.'])),
    S('line_by_line',
      EXPLAIN('deep-freeze',
        ['2', '`not table.isfrozen(t)` — tanpa semakan ini, lawatan kedua ke `shared` akan menimbulkan "table is already frozen".', '`not table.isfrozen(t)` — without this check, the second visit to `shared` would raise "table is already frozen".']),
      EXPLAIN('edit-frozen',
        ['4', '`table.clone(prices)` pada table beku memberi table **tidak beku** — diukur dengan Luau 0.663.', '`table.clone(prices)` on a frozen table gives an **unfrozen** table — measured with Luau 0.663.'])),
    S('why_this_way',
      P('Mengapa membekukan dan bukan sekadar "berjanji tidak mengubah"? Kerana janji tidak dikuatkuasakan: satu baris yang salah di mana-mana skrip boleh merosakkan konfigurasi untuk semua pemain dalam pelayan. Pembekuan menukar kerosakan senyap kepada ralat segera di baris yang salah. Mengapa cetek? Kerana pembekuan dalam memerlukan lawatan ke seluruh struktur — Luau membiarkan anda memilih.',
        'Why freeze rather than just "promise not to change"? Because promises are not enforced: one wrong line in any script can corrupt the configuration for every player on the server. Freezing turns silent corruption into an immediate error on the wrong line. Why shallow? Because a deep freeze must visit the whole structure — Luau lets you choose.'),
      P('Bekukan **apabila** data ialah pemalar yang dikongsi; bekukan secara dalam **apabila** pemalar bersarang; jangan bekukan **apabila** data memang perlu berubah semasa permainan (keadaan pemain).', 'Freeze **when** data is a shared constant; deep-freeze **when** the constant is nested; do not freeze **when** the data genuinely changes during play (player state).')),
    S('execution_flow',
      OL(
        ['Constructor mencipta table; `table.freeze` menetapkan bendera dan memulangkan table.', 'The constructor creates the table; `table.freeze` sets the flag and returns the table.'],
        ['Bacaan `CONFIG.roundSeconds` berjalan seperti biasa.', 'The read `CONFIG.roundSeconds` works as usual.'],
        ['`CONFIG.maxPlayers = 100` → VM menyemak bendera → ralat dengan nombor baris.', '`CONFIG.maxPlayers = 100` → the VM checks the flag → an error with a line number.'],
        ['`table.insert(CONFIG.modes, …)` → `modes` tidak beku → berjaya.', '`table.insert(CONFIG.modes, …)` → `modes` is not frozen → succeeds.'],
      )),
    S('memory_behaviour',
      P('Pembekuan tidak menyalin apa-apa; ia hanya menetapkan bendera pada objek sedia ada, jadi kosnya hampir sifar. Table beku boleh dikongsi dengan selamat di antara banyak skrip tanpa salinan pertahanan — penjimatan memori sebenar berbanding menyalin konfigurasi untuk setiap pengguna.', 'Freezing copies nothing; it only sets a flag on the existing object, so its cost is close to zero. Frozen tables can be shared safely among many scripts without defensive copies — a real memory saving compared with copying the configuration for every user.')),
    S('alternative_implementations',
      P('Sebelum `table.freeze`, kod Lua menggunakan proksi metatable `__newindex` — lebih panjang dan lebih perlahan, tetapi membenarkan mesej tersuai:', 'Before `table.freeze`, Lua code used a `__newindex` metatable proxy — longer and slower, but allowing a custom message:'),
      CODE('readonly-proxy', 'luau', 'luau', ['Proksi baca sahaja dengan metatable', 'A read-only proxy with a metatable'], `
local function readOnly(t: {[string]: any})
  return setmetatable({}, {
    __index = t,
    __newindex = function(_, key)
      error(\`cannot change constant '{key}'\`, 2)
    end,
  })
end

local LIMITS = readOnly({maxSpeed = 32})
print(LIMITS.maxSpeed)
print(pcall(function() LIMITS.maxSpeed = 100 end))
`, '32\nfalse\texample:12: cannot change constant \'maxSpeed\''),
      EXPLAIN('readonly-proxy',
        ['1–8', 'Table kosong dengan `__index` (bacaan dari asal) dan `__newindex` (penulisan menimbulkan ralat tersuai). Metatable diajar dalam LUAU114.', 'An empty table with `__index` (reads go to the original) and `__newindex` (writes raise a custom error). Metatables are taught in LUAU114.'],
        ['10–12', 'Bacaan berfungsi; penulisan memberi mesej yang menyebut kunci. Tetapi `#LIMITS` dan lelaran tidak berfungsi pada proksi — satu sebab `table.freeze` lebih disukai.', 'Reads work; writes give a message naming the key. But `#LIMITS` and iteration do not work on the proxy — one reason `table.freeze` is preferred.'])),
    S('common_mistakes',
      UL(
        ['Menganggap `table.freeze` membekukan table bersarang.', 'Assuming `table.freeze` freezes nested tables.'],
        ['Membekukan table yang mungkin sudah beku tanpa `table.isfrozen`.', 'Freezing a table that may already be frozen without `table.isfrozen`.'],
        ['Membekukan keadaan yang perlu berubah semasa permainan.', 'Freezing state that must change during play.'],
        ['Mencari nombor baris dalam ralat dari `table.insert`/`table.sort` pada table beku.', 'Looking for a line number in errors from `table.insert`/`table.sort` on frozen tables.'],
      )),
    S('debugging',
      P('`attempt to modify a readonly table` memberitahu anda bahawa ada kod yang cuba mengubah pemalar — biasanya pepijat sebenar, bukan masalah pembekuan. Jika mesej tiada nombor baris, cari panggilan `table.insert`, `table.remove`, `table.sort` atau `table.clear`. Untuk mengetahui sama ada laluan dalam dilindungi, semak setiap tahap:',
        '`attempt to modify a readonly table` tells you some code tried to change a constant — usually a real bug, not a freezing problem. If the message has no line number, look for `table.insert`, `table.remove`, `table.sort` or `table.clear` calls. To find out whether a deep path is protected, check every level:'),
      CODE('frozen-report', 'luau', 'luau', ['Melaporkan tahap yang tidak beku', 'Reporting levels that are not frozen'], `
local function unfrozenPaths(t: {[string]: any}, path: string, out: {string})
  if not table.isfrozen(t) then
    table.insert(out, path)
  end
  for k, v in t do
    if type(v) == "table" then
      unfrozenPaths(v, \`{path}.{k}\`, out)
    end
  end
  return out
end

local SETTINGS = table.freeze({audio = table.freeze({music = 50}), keys = {jump = "Space"}})
local report = unfrozenPaths(SETTINGS, "SETTINGS", {})
table.sort(report)
print(table.concat(report, ", "))
`, 'SETTINGS.keys'),
      EXPLAIN('frozen-report',
        ['1–11', 'Lawati setiap tahap; rekod laluan yang tidak beku.', 'Visit every level; record paths that are not frozen.'],
        ['13–16', '`audio` dibekukan secara manual, `keys` terlupa — laporan menunjukkannya.', '`audio` was frozen by hand, `keys` was forgotten — the report shows it.'])),
    S('performance',
      P('Membaca table beku sama pantas dengan table biasa. Pembekuan cetek ialah O(1); pembekuan dalam ialah O(saiz) sekali sahaja. Tidak seperti proksi metatable, table beku tidak menambah kos pada setiap bacaan, dan `#`, lelaran dan `table.find` berfungsi seperti biasa.', 'Reading a frozen table is as fast as reading a normal one. A shallow freeze is O(1); a deep freeze is O(size) once. Unlike a metatable proxy, a frozen table adds no cost to each read, and `#`, iteration and `table.find` work as usual.')),
    S('software_engineering',
      P('Pemalar tidak dilindungi berbanding pemalar beku:', 'Unprotected constants versus frozen constants:'),
      CODE('poor-mutable-constants', 'luau', 'luau', ['Pelaksanaan lemah: pemalar boleh diubah', 'Poor implementation: mutable constants'], `
local XP_PER_LEVEL = {100, 250, 500}
local function levelFor(xp: number): number
  local level = 1
  for i, needed in XP_PER_LEVEL do
    if xp >= needed then level = i + 1 end
  end
  return level
end
XP_PER_LEVEL[1] = 0
print(levelFor(0))
`, '2'),
      EXPLAIN('poor-mutable-constants',
        ['1–8', 'Jadual XP ialah table biasa.', 'The XP table is an ordinary table.'],
        ['9–10', 'Satu baris yang salah menjadikan setiap pemain baharu tahap 2 — tiada ralat.', 'One wrong line makes every new player level 2 — no error.']),
      CODE('improved-frozen-constants', 'luau', 'luau', ['Pelaksanaan lebih baik: pemalar beku', 'Improved implementation: frozen constants'], `
local XP_PER_LEVEL = table.freeze({100, 250, 500})
local function levelFor(xp: number): number
  local level = 1
  for i, needed in XP_PER_LEVEL do
    if xp >= needed then level = i + 1 end
  end
  return level
end
local ok = pcall(function() XP_PER_LEVEL[1] = 0 end)
print(ok, levelFor(0), levelFor(300))
`, 'false\t1\t3'),
      EXPLAIN('improved-frozen-constants',
        ['1–8', 'Jadual yang sama, dibekukan semasa dicipta.', 'The same table, frozen when created.'],
        ['9–10', 'Penulisan yang salah gagal dengan segera; jadual kekal betul.', 'The wrong write fails immediately; the table stays correct.'])),
    S('industry_use_cases',
      UL(
        ['ModuleScript konfigurasi memulangkan table yang dibekukan secara dalam.', 'Configuration ModuleScripts return deeply frozen tables.'],
        ['Enum buatan sendiri (`table.freeze({Idle = 1, Running = 2})`) dilindungi daripada perubahan.', 'Hand-made enums (`table.freeze({Idle = 1, Running = 2})`) are protected from change.'],
        ['Data katalog item dikongsi antara sistem kedai, inventori dan UI tanpa salinan.', 'Item catalogue data is shared between shop, inventory and UI systems without copies.'],
      )),
    S('practical_demonstration',
      OL(
        ['Bekukan `CONFIG.modes` dalam `freeze-basics` dan ramalkan ralat baharu.', 'Freeze `CONFIG.modes` in `freeze-basics` and predict the new error.'],
        ['Gunakan `withSale` untuk mencipta jualan 50% dan semak bahawa asal tidak berubah.', 'Use `withSale` to create a 50% sale and check the original is unchanged.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Enum keadaan beku.** Cipta enum keadaan musuh yang beku, jadual peralihan yang beku secara dalam, dan fungsi yang mengesahkan peralihan.', '**A frozen state enum.** Create a frozen enemy-state enum, a deeply frozen transition table, and a function that validates transitions.'),
      CODE('state-enum', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local State = table.freeze({Idle = "Idle", Chase = "Chase", Attack = "Attack"})

local ALLOWED = table.freeze({
  [State.Idle] = table.freeze({State.Chase}),
  [State.Chase] = table.freeze({State.Idle, State.Attack}),
  [State.Attack] = table.freeze({State.Chase}),
})

local function canMove(from: string, to: string): boolean
  local targets = ALLOWED[from]
  return targets ~= nil and table.find(targets, to) ~= nil
end

print(canMove(State.Idle, State.Chase), canMove(State.Idle, State.Attack))
print(pcall(function() table.insert(ALLOWED[State.Idle], State.Attack) end))
`, 'true\tfalse\nfalse\tattempt to modify a readonly table'),
      EXPLAIN('state-enum',
        ['1', 'Enum beku: nama keadaan tidak boleh ditukar atau ditambah.', 'A frozen enum: state names cannot be changed or added.'],
        ['3–7', 'Jadual peralihan dan setiap senarai sasaran dibekukan.', 'The transition table and every target list are frozen.'],
        ['9–12', '`table.find` berfungsi pada table beku.', '`table.find` works on frozen tables.'],
        ['14–15', 'Idle → Attack tidak dibenarkan; cubaan menambahnya ditolak (tanpa nombor baris, kerana dari `table.insert`).', 'Idle → Attack is not allowed; an attempt to add it is rejected (no line number, because it comes from `table.insert`).'])),
    S('summary',
      UL(
        ['`table.freeze` menjadikan satu tahap baca sahaja; `table.isfrozen` menyemak.', '`table.freeze` makes one level read-only; `table.isfrozen` checks.'],
        ['Penulisan dan fungsi pustaka yang mengubah gagal dengan `attempt to modify a readonly table`.', 'Writes and mutating library functions fail with `attempt to modify a readonly table`.'],
        ['Pembekuan dalam memerlukan rekursi dengan semakan `isfrozen`.', 'A deep freeze needs recursion with an `isfrozen` check.'],
        ['Kekal; gunakan `table.clone` untuk versi yang boleh diubah.', 'Permanent; use `table.clone` for a changeable version.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dipulangkan oleh `table.freeze(t)`?', 'What does `table.freeze(t)` return?'],
        ['Mengapakah `table.insert(frozen.list, x)` boleh berjaya?', 'Why can `table.insert(frozen.list, x)` succeed?'],
        ['Apakah yang berlaku apabila anda membekukan table dua kali?', 'What happens when you freeze a table twice?'],
        ['Bagaimanakah anda mencipta versi diubah suai bagi table beku?', 'How do you create a modified version of a frozen table?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library: table.freeze and table.isfrozen', url: `${LUAU}/library#table-library` },
        { title: 'Luau RFC — table.freeze', url: 'https://rfcs.luau.org/function-table-freeze.html' },
        { title: 'Roblox Engine API — table.freeze', url: `${DOCS}/reference/engine/libraries/table#freeze` },
        { title: 'Roblox Creator Hub — ModuleScripts', url: `${DOCS}/reference/engine/classes/ModuleScript` },
      )),
  ],
};

export const LUAU104_M3 = [LUAU104_3_1, LUAU104_3_2, LUAU104_3_3];
