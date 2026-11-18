import { CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUA102 · Module 1 · Lecture 1 — Global and local variables (standard Lua 5.4).
 * Level: absolute beginner. Every `lua54` example is executed by `npm run verify:code`.
 */
export const LUA102_1_1: LectureContentDef = {
  courseCode: 'LUA102',
  module: 1,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Mengisytiharkan pemboleh ubah global dan `local` dalam Lua.', 'Declare global and `local` variables in Lua.'],
        ['Menerangkan [[scope|skop]] sesuatu pemboleh ubah `local`.', 'Explain the [[scope]] of a `local` variable.'],
        ['Meramal nilai pemboleh ubah yang belum diberi nilai (`nil`).', 'Predict the value of a variable that has not been assigned (`nil`).'],
        ['Mengesan pepijat akibat pemboleh ubah global yang tidak disengajakan.', 'Detect bugs caused by accidental global variables.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Menjalankan skrip Lua dari terminal (LUA101).', 'Running a Lua script from the terminal (LUA101).'],
        ['Menggunakan `print()` untuk memaparkan output.', 'Using `print()` to display output.'],
        ['Tahu bahawa Lua mempunyai nombor dan string.', 'Knowing that Lua has numbers and strings.'],
      )),
    S('introduction',
      P('Program perlu **mengingati** maklumat: nama pemain, markah, tahap. [[variable|Pemboleh ubah]] ialah nama yang kita berikan kepada nilai supaya kita boleh menggunakannya semula. Lua mempunyai dua jenis pemboleh ubah — **global** dan **local** — dan memilih jenis yang betul ialah salah satu tabiat terpenting seorang pengaturcara Lua.',
        'Programs need to **remember** information: a player name, a score, a level. A [[variable]] is a name we give to a value so we can use it again. Lua has two kinds of variables — **global** and **local** — and choosing the right one is one of the most important habits of a Lua programmer.'),
      KEY('Peraturan ringkas: **sentiasa gunakan `local`**, melainkan anda benar-benar memerlukan global.', 'Short rule: **always use `local`**, unless you genuinely need a global.', ['Ambil perhatian', 'Key takeaway'])),
    S('fundamental_concepts',
      UL(
        ['**Pemboleh ubah global** dicipta apabila anda memberi nilai kepada nama tanpa kata kunci `local`. Ia boleh dilihat di mana-mana dalam program.', 'A **global variable** is created when you assign to a name without the `local` keyword. It is visible everywhere in the program.'],
        ['**Pemboleh ubah local** diisytiharkan dengan `local`. Ia hanya wujud dalam [[scope|skop]] bloknya.', 'A **local variable** is declared with `local`. It exists only inside the [[scope]] of its block.'],
        ['Pemboleh ubah tidak mempunyai jenis; **nilai** yang mempunyai jenis. Pemboleh ubah yang sama boleh memegang nombor dan kemudian string.', 'Variables have no type; **values** do. The same variable can hold a number and later a string.'],
        ['Membaca pemboleh ubah yang tidak pernah diberi nilai memberikan `nil` — bukan ralat.', 'Reading a variable that was never assigned gives `nil` — not an error.'],
      )),
    S('detailed_theory',
      P('Pemboleh ubah global sebenarnya ialah **medan dalam sebuah table** — table persekitaran `_ENV` (Lua 5.2+). Menulis `score = 10` bermaksud `_ENV.score = 10`. Kerana itu setiap akses global ialah carian dalam [[table]].',
        'A global variable is really a **field in a table** — the environment table `_ENV` (Lua 5.2+). Writing `score = 10` means `_ENV.score = 10`. That is why every global access is a [[table]] lookup.'),
      P('Pemboleh ubah local pula disimpan terus dalam **slot daftar (register)** mesin maya Lua untuk fungsi yang sedang berjalan. Akses kepadanya tidak memerlukan carian table, dan slot itu dibebaskan apabila blok tamat.',
        'A local variable, by contrast, is stored directly in a **register slot** of the Lua virtual machine for the running function. Accessing it needs no table lookup, and the slot is released when the block ends.'),
      INFO('Dalam Lua 5.1 (dan LuaJIT), global disimpan dalam **persekitaran fungsi** yang diubah dengan `setfenv`; `_ENV` tidak wujud. Konsep global berbanding local adalah sama dalam semua versi.',
        'In Lua 5.1 (and LuaJIT), globals live in the **function environment**, changed with `setfenv`; `_ENV` does not exist. The global-versus-local concept is the same in every version.',
        ['Perbezaan versi', 'Version difference'])),
    S('technical_terminology', TERMS('variable', 'scope', 'table', 'closure')),
    S('syntax_rules',
      UL(
        ['Pengisytiharan local: `local nama = expression`.', 'Local declaration: `local name = expression`.'],
        ['Nama terdiri daripada huruf, digit dan garis bawah, dan tidak boleh bermula dengan digit.', 'Names consist of letters, digits and underscores, and cannot start with a digit.'],
        ['Nama peka huruf besar/kecil: `score` dan `Score` ialah dua pemboleh ubah berbeza.', 'Names are case-sensitive: `score` and `Score` are two different variables.'],
        ['Kata terpelihara seperti `local`, `end`, `function`, `nil` dan `and` tidak boleh dijadikan nama.', 'Reserved words such as `local`, `end`, `function`, `nil` and `and` cannot be used as names.'],
        ['Berbilang pemboleh ubah sekali gus: `local a, b = 1, 2`. Nilai yang tidak mencukupi menjadi `nil`.', 'Several variables at once: `local a, b = 1, 2`. Missing values become `nil`.'],
      )),
    S('code_demonstration',
      CODE('demo-basic', 'lua', 'lua54', ['Global berbanding local', 'Global versus local'], `
-- Global: no 'local' keyword
score = 10

-- Local: visible only in this chunk
local playerName = "Aisyah"

print(playerName, score)
score = score + 5
print("New score:", score)
`, 'Aisyah\t10\nNew score:\t15'),
      P('`print` memisahkan setiap argumen dengan aksara tab, sebab itu output kelihatan berjarak.',
        '`print` separates each argument with a tab character, which is why the output looks spaced out.')),
    S('complete_examples',
      CODE('scope-blocks', 'lua', 'lua54', ['Skop blok dan pembayangan (shadowing)', 'Block scope and shadowing'], `
local level = 1            -- local to the whole chunk

local function describe()
  local message = "Level " .. level   -- reads the outer local
  return message
end

do
  local level = 99         -- a NEW local that shadows the outer one
  print("inside do-block:", level)
end

print("after block:", level)
print(describe())
print("message outside function:", message)
`, 'inside do-block:\t99\nafter block:\t1\nLevel 1\nmessage outside function:\tnil'),
      CODE('global-typo', 'lua', 'lua54', ['Pepijat: salah ejaan mencipta global', 'Bug: a typo creates a global'], `
local total = 0
for i = 1, 3 do
  totl = total + i   -- typo: creates a GLOBAL 'totl'; 'total' never changes
end
print("total:", total)
print("totl:", totl)
`, 'total:\t0\ntotl:\t3'),
      CODE('multi-assign', 'lua', 'lua54', ['Assignment berbilang', 'Multiple assignment'], `
local a, b, c = 1, 2
print(a, b, c)

a, b = b, a        -- swap without a temporary variable
print(a, b)
`, '1\t2\tnil\n2\t1')),
    S('line_by_line',
      EXPLAIN('demo-basic',
        ['1–2', 'Baris `--` ialah komen; Lua mengabaikannya. `score = 10` tiada `local`, jadi ia mencipta pemboleh ubah **global** `score`.', 'Lines starting with `--` are comments; Lua ignores them. `score = 10` has no `local`, so it creates a **global** variable `score`.'],
        ['4–5', '`local playerName = "Aisyah"` mengisytiharkan pemboleh ubah local dan memberinya nilai string.', '`local playerName = "Aisyah"` declares a local variable and gives it a string value.'],
        ['7', '`print` menerima dua argumen dan memaparkannya dengan tab di antaranya.', '`print` receives two arguments and displays them with a tab between them.'],
        ['8', 'Sebelah kanan dinilai dahulu (`10 + 5`), kemudian hasilnya disimpan semula dalam `score`.', 'The right-hand side is evaluated first (`10 + 5`), then the result is stored back in `score`.'],
        ['9', 'Memaparkan teks tetap dan nilai baharu `score`, iaitu 15.', 'Displays fixed text and the new value of `score`, which is 15.']),
      EXPLAIN('scope-blocks',
        ['1', '`level` ialah local untuk seluruh chunk (fail).', '`level` is local to the whole chunk (file).'],
        ['3–6', 'Fungsi `describe` membaca `level` dari skop luar. Fungsi yang menangkap local luar dipanggil [[closure]].', 'The function `describe` reads `level` from the outer scope. A function that captures an outer local is called a [[closure]].'],
        ['8–11', '`do … end` membuka blok baharu. `local level = 99` mencipta pemboleh ubah **baharu** yang membayangi `level` luar hanya di dalam blok ini.', '`do … end` opens a new block. `local level = 99` creates a **new** variable that shadows the outer `level` only inside this block.'],
        ['13', 'Selepas blok tamat, `level` merujuk semula kepada pemboleh ubah luar: 1.', 'After the block ends, `level` refers to the outer variable again: 1.'],
        ['15', '`message` ialah local dalam `describe`, jadi di sini nama itu dicari sebagai global — yang tidak wujud — maka hasilnya `nil`.', '`message` was local to `describe`, so here the name is looked up as a global — which does not exist — giving `nil`.'])),
    S('why_this_way',
      P('Kita menggunakan `local` kerana ia **mengehadkan kesan** sesuatu nama kepada tempat ia diperlukan. Apabila program membesar, global boleh diubah dari mana-mana fail, menjadikan pepijat sukar dijejak. Local juga lebih pantas dan membebaskan memori apabila blok tamat.',
        'We use `local` because it **limits the effect** of a name to where it is needed. As a program grows, a global can be changed from any file, making bugs hard to trace. Locals are also faster and release memory when their block ends.'),
      P('Global masih ada tempatnya — contohnya fungsi pustaka standard seperti `print` — tetapi kod aplikasi yang baik hampir tidak pernah mencipta global baharu.',
        'Globals still have a place — for example standard library functions such as `print` — but good application code almost never creates new globals.')),
    S('execution_flow',
      OL(
        ['Lua mengkompil keseluruhan chunk `scope-blocks` kepada bytecode sebelum menjalankannya.', 'Lua compiles the whole `scope-blocks` chunk to bytecode before running it.'],
        ['Baris 1 memperuntukkan slot local untuk `level` dan menyimpan 1.', 'Line 1 allocates a local slot for `level` and stores 1.'],
        ['Baris 3–6 mencipta fungsi `describe` (belum dijalankan) dan menyimpannya dalam local.', 'Lines 3–6 create the function `describe` (not yet run) and store it in a local.'],
        ['Blok `do` memperuntukkan slot kedua bernama `level` (99), mencetaknya, lalu membebaskan slot itu pada `end`.', 'The `do` block allocates a second slot named `level` (99), prints it, then releases that slot at `end`.'],
        ['`print(describe())` memanggil fungsi; ia membaca `level` luar (1) dan memulangkan "Level 1".', '`print(describe())` calls the function; it reads the outer `level` (1) and returns "Level 1".'],
        ['Baris terakhir mencari `message` dalam `_ENV`, tidak menjumpainya, dan mencetak `nil`.', 'The last line looks up `message` in `_ENV`, does not find it, and prints `nil`.'],
      )),
    S('memory_behaviour',
      P('Local hidup dalam slot daftar fungsi semasa; apabila blok tamat, slot boleh digunakan semula. Jika local memegang [[table]], table itu boleh dikutip oleh garbage collector sebaik sahaja tiada rujukan lain kepadanya.',
        'Locals live in register slots of the current function; when the block ends, the slot can be reused. If a local holds a [[table]], that table can be collected by the garbage collector as soon as nothing else refers to it.'),
      WARN('Global kekal dirujuk oleh `_ENV` sehingga anda memberinya `nil`. Global yang memegang data besar akan menahan memori itu sepanjang hayat program.',
        'A global stays referenced by `_ENV` until you assign `nil` to it. A global holding large data keeps that memory alive for the whole life of the program.',
        ['Awas', 'Warning'])),
    S('alternative_implementations',
      P('Apabila beberapa nilai perlu dikongsi, kumpulkan dalam **satu table local** dan bukannya banyak global:',
        'When several values must be shared, group them in **one local table** instead of many globals:'),
      CODE('config-table', 'lua', 'lua54', ['Table konfigurasi local', 'A local configuration table'], `
local Config = { maxPlayers = 4, startingScore = 0 }

print(Config.maxPlayers, Config.startingScore)
`, '4\t0'),
      P('Pilihan lain: hantar nilai sebagai parameter fungsi, atau simpan keadaan dalam modul (LUA212). Kursus LUA211 juga menunjukkan cara memasang metatable pada `_G` untuk **menghalang** global baharu sama sekali.',
        'Other options: pass values as function parameters, or keep state inside a module (LUA212). Course LUA211 also shows how to attach a metatable to `_G` to **block** new globals entirely.')),
    S('common_mistakes',
      UL(
        ['Salah ejaan nama pemboleh ubah mencipta global baharu secara senyap (lihat `global-typo`).', 'Misspelling a variable name silently creates a new global (see `global-typo`).'],
        ['Terlupa `local` di dalam fungsi, lalu menimpa global yang sama nama.', 'Forgetting `local` inside a function, overwriting a global with the same name.'],
        ['Menjangkakan local boleh dilihat di luar bloknya.', 'Expecting a local to be visible outside its block.'],
        ['Mengelirukan dua pemboleh ubah yang dibayangi (shadowed) kerana namanya sama.', 'Confusing two shadowed variables because they share a name.'],
        ['Menganggap `nil` bermaksud "sifar" — ia bermaksud "tiada nilai".', 'Assuming `nil` means "zero" — it means "no value".'],
      )),
    S('debugging',
      P('Pepijat global paling kerap muncul sebagai ralat aritmetik pada `nil`. Mesej ralat Lua memberitahu **nama** dan sama ada ia global:',
        'Global bugs most often appear as an arithmetic error on `nil`. Lua’s error message tells you the **name** and whether it is global:'),
      CODE('nil-arith', 'lua', 'lua54', ['Membaca mesej ralat', 'Reading the error message'], `
local score = 10
local ok, err = pcall(function()
  return scroe + 1   -- typo: 'scroe' is an undefined global (nil)
end)
print(ok)
print(err)
`, "false\nexample:3: attempt to perform arithmetic on a nil value (global 'scroe')"),
      OL(
        ['Baca nombor baris dan perkataan **global** dalam mesej.', 'Read the line number and the word **global** in the message.'],
        ['Bandingkan ejaan nama dengan pengisytiharan `local` yang sepatutnya.', 'Compare the spelling with the intended `local` declaration.'],
        ['Jalankan [luacheck](https://github.com/lunarmodules/luacheck) — ia memberi amaran tentang setiap global yang ditulis atau dibaca tanpa diisytiharkan.', 'Run [luacheck](https://github.com/lunarmodules/luacheck) — it warns about every global that is set or read without being declared.'],
      )),
    S('performance',
      P('Membaca local lebih pantas daripada membaca global kerana tiada carian table. Dalam gelung yang sangat kerap, pengaturcara kadang-kadang menyalin fungsi global ke local (`local floor = math.floor`). Ukur dahulu sebelum mengoptimumkan — bagi kebanyakan program, kebolehbacaan lebih penting.',
        'Reading a local is faster than reading a global because there is no table lookup. In very hot loops, programmers sometimes copy a global function into a local (`local floor = math.floor`). Measure before optimising — for most programs, readability matters more.')),
    S('software_engineering',
      P('Bandingkan dua pelaksanaan inventori. Versi pertama mencipta fungsi **dan** data global:',
        'Compare two inventory implementations. The first creates a global function **and** global data:'),
      CODE('poor-globals', 'lua', 'lua54', ['Pelaksanaan lemah: global di mana-mana', 'Poor implementation: globals everywhere'], `
function addItem(name)   -- global function
  items = items or {}    -- global table, created on first use
  items[#items + 1] = name
end

addItem("sword")
addItem("shield")
print(#items)
`, '2'),
      CODE('improved-locals', 'lua', 'lua54', ['Pelaksanaan lebih baik: keadaan local dan antara muka jelas', 'Improved implementation: local state and a clear interface'], `
local Inventory = {}
local items = {}         -- private: only Inventory's functions can reach it

function Inventory.add(name)
  items[#items + 1] = name
end

function Inventory.count()
  return #items
end

Inventory.add("sword")
Inventory.add("shield")
print(Inventory.count())
`, '2'),
      P('Kedua-duanya memberi output yang sama, tetapi versi kedua **mengkapsulkan** data: kod lain tidak boleh merosakkan `items` secara tidak sengaja, dan semua akses melalui antara muka yang jelas. Kosnya hanya beberapa baris tambahan — pertukaran (trade-off) yang sangat berbaloi.',
        'Both print the same output, but the second **encapsulates** the data: other code cannot corrupt `items` by accident, and all access goes through a clear interface. The cost is only a few extra lines — a very worthwhile trade-off.')),
    S('industry_use_cases',
      UL(
        ['Fail konfigurasi Neovim yang ditulis dalam Lua menggunakan `local` untuk mengelak konflik antara plugin.', 'Neovim configuration written in Lua uses `local` to avoid conflicts between plugins.'],
        ['Aplikasi yang membenamkan Lua sering menjalankan skrip dalam persekitaran terhad supaya skrip tidak boleh mencipta global sesuka hati.', 'Applications that embed Lua often run scripts in a restricted environment so scripts cannot create globals at will.'],
        ['Saluran CI pasukan Lua biasanya menjalankan luacheck untuk menolak global yang tidak disengajakan sebelum kod digabungkan.', "Lua teams' CI pipelines commonly run luacheck to reject accidental globals before code is merged."],
      )),
    S('practical_demonstration',
      OL(
        ['Cipta fail `variables.lua` dan taip contoh `demo-basic`.', 'Create a file `variables.lua` and type the `demo-basic` example.'],
        ['Jalankan `lua variables.lua` dan bandingkan output dengan output yang dijangka.', 'Run `lua variables.lua` and compare the output with the expected output.'],
        ['Tukar `score = score + 5` kepada `score = scroe + 5` dan jalankan semula. Baca mesej ralat.', 'Change `score = score + 5` to `score = scroe + 5` and run again. Read the error message.'],
        ['Betulkan salah ejaan, kemudian tambah `local` di hadapan `score` dan sahkan program masih berfungsi.', 'Fix the typo, then add `local` in front of `score` and confirm the program still works.'],
      )),
    S('mini_project',
      P('**Kad markah ringkas.** Simpan nama pemain dan tiga markah pusingan dalam pemboleh ubah `local`, kira jumlah dan purata, dan paparkan satu baris ringkasan.',
        '**A simple scorecard.** Store a player name and three round scores in `local` variables, compute the total and average, and display a one-line summary.'),
      CODE('mini-scorecard', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local playerName = "Aisyah"
local round1, round2, round3 = 12, 15, 9

local total = round1 + round2 + round3
local average = total / 3

print(playerName .. ": total " .. total .. ", average " .. average)
`, 'Aisyah: total 36, average 12.0'),
      INFO('Perhatikan `12.0`: operator `/` dalam Lua 5.3+ **sentiasa** menghasilkan float. Gunakan `//` untuk pembahagian integer (LUA102, modul 3).',
        'Notice `12.0`: the `/` operator in Lua 5.3+ **always** produces a float. Use `//` for floor division (LUA102, module 3).')),
    S('summary',
      UL(
        ['Tanpa `local`, pemberian nilai mencipta pemboleh ubah global (medan dalam `_ENV`).', 'Without `local`, assignment creates a global variable (a field in `_ENV`).'],
        ['Local hanya wujud dalam bloknya, lebih pantas, dan lebih selamat.', 'Locals exist only within their block, are faster, and are safer.'],
        ['Nama yang tidak pernah diberi nilai bernilai `nil`.', 'A name that was never assigned holds `nil`.'],
        ['Salah ejaan ialah punca utama global tidak disengajakan — luacheck membantu mengesannya.', 'Typos are the main cause of accidental globals — luacheck helps detect them.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dicipta oleh `count = 5` jika tiada pengisytiharan `local` sebelumnya?', 'What does `count = 5` create if there is no earlier `local` declaration?'],
        ['Mengapakah `print(message)` di luar fungsi `describe` mencetak `nil`?', 'Why does `print(message)` outside the function `describe` print `nil`?'],
        ['Apakah output `local a, b = 1` diikuti `print(a, b)`?', 'What is the output of `local a, b = 1` followed by `print(a, b)`?'],
        ['Berikan dua sebab untuk mengutamakan `local`.', 'Give two reasons to prefer `local`.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §2.2 — Environments and the Global Environment', url: 'https://www.lua.org/manual/5.4/manual.html#2.2' },
        { title: 'Lua 5.4 Reference Manual §3.3.7 — Local Declarations', url: 'https://www.lua.org/manual/5.4/manual.html#3.3.7' },
        { title: 'Programming in Lua (1st ed., Lua 5.0) — Local Variables and Blocks', url: 'https://www.lua.org/pil/4.2.html' },
        { title: 'luacheck — static analyser and linter for Lua', url: 'https://github.com/lunarmodules/luacheck' },
      )),
  ],
};
