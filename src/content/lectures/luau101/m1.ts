import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU101 · Module 1 — What Is Luau?
 * `luau` examples are executed with the official Luau VM (npm run verify:code); `roblox` examples are compiled only.
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 1.1 From Lua 5.1 to Luau ──────────────────────────────────────────────

export const LUAU101_1_1: LectureContentDef = {
  courseCode: 'LUAU101',
  module: 1,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan asal-usul Luau sebagai bahasa yang diterbitkan daripada Lua 5.1 oleh Roblox.', 'Explain Luau’s origin as a language derived from Lua 5.1 by Roblox.'],
        ['Mengenal pasti kod Lua 5.1 yang berjalan tanpa perubahan dalam Luau.', 'Identify Lua 5.1 code that runs unchanged in Luau.'],
        ['Menyenaraikan ciri Lua 5.2–5.4 yang **tiada** dalam Luau (goto, `<const>`, operator bit).', 'List Lua 5.2–5.4 features that Luau does **not** have (goto, `<const>`, bitwise operators).'],
        ['Menerangkan bahawa semua nombor Luau ialah float 64-bit.', 'Explain that every Luau number is a 64-bit float.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Tiada pengalaman pengaturcaraan diperlukan; kursus ini bermula dari asas.', 'No programming experience is required; this course starts from the basics.'],
        ['Jika anda telah mengikuti LUA101–LUA104, kuliah ini menerangkan apa yang sama dan apa yang berbeza.', 'If you have taken LUA101–LUA104, this lecture explains what is the same and what differs.'],
      )),
    S('introduction',
      P('Luau ialah bahasa pengaturcaraan yang digunakan oleh Roblox untuk semua skrip dalam pengalaman (experience) Roblox. Ia bermula pada tahun 2019 sebagai versi Lua 5.1 yang diubah suai, kerana Roblox telah menggunakan Lua 5.1 sejak 2006 dan perlu kekal serasi dengan berjuta-juta skrip sedia ada. Roblox kemudian menambah sistem jenis beransur (gradual typing), pengkompil dan VM yang jauh lebih pantas, serta sintaks baharu — dan menerbitkan Luau sebagai sumber terbuka pada tahun 2021. Hari ini Luau ialah bahasa tersendiri yang dibangunkan secara aktif, dengan versi baharu hampir setiap minggu.',
        'Luau is the programming language Roblox uses for every script in a Roblox experience. It began in 2019 as a modified Lua 5.1, because Roblox had used Lua 5.1 since 2006 and had to stay compatible with millions of existing scripts. Roblox then added gradual typing, a much faster compiler and VM, and new syntax — and released Luau as open source in 2021. Today Luau is a language of its own under active development, with new versions almost every week.'),
      KEY('Luau = Lua 5.1 + ciri baharu − beberapa ciri lama yang tidak selamat. Kebanyakan kod Lua 5.1 berjalan tanpa perubahan.', 'Luau = Lua 5.1 + new features − a few old, unsafe features. Most Lua 5.1 code runs unchanged.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Asas Lua 5.1:** sintaks, `local`, table, fungsi, closure dan pustaka `string`/`table`/`math` adalah sama.', '**Lua 5.1 base:** syntax, `local`, tables, functions, closures and the `string`/`table`/`math` libraries are the same.'],
        ['**Satu jenis nombor:** semua nombor ialah float 64-bit; tiada subjenis integer seperti Lua 5.3+.', '**One number type:** every number is a 64-bit float; there is no integer subtype as in Lua 5.3+.'],
        ['**Dipinjam daripada Lua moden:** `//` (pembahagian lantai) dan pustaka `utf8`.', '**Borrowed from modern Lua:** `//` (floor division) and the `utf8` library.'],
        ['**Tiada:** `goto`, atribut `<const>`/`<close>`, operator bit `& | ~ << >>` (gunakan `bit32`).', '**Absent:** `goto`, the `<const>`/`<close>` attributes, the bitwise operators `& | ~ << >>` (use `bit32`).'],
        ['**Pelaksanaan sendiri:** pengkompil, VM dan pengurus memori Luau ditulis semula untuk kelajuan dan keselamatan.', '**Its own implementation:** Luau’s compiler, VM and memory manager were rewritten for speed and safety.'],
      )),
    S('detailed_theory',
      P('Mengapa Roblox tidak sahaja menaik taraf ke Lua 5.4? Kerana Lua 5.2 dan seterusnya memecahkan keserasian: `setfenv`/`getfenv` dibuang, `unpack` dipindahkan, dan Lua 5.3 menukar semantik nombor dengan memperkenalkan integer. Bagi platform dengan berjuta-juta skrip yang ditulis oleh kanak-kanak dan profesional, perubahan sedemikian akan merosakkan pengalaman yang sedia ada. Jadi Roblox mengambil Lua 5.1 sebagai asas yang stabil, dan memilih ciri moden satu demi satu — hanya yang boleh ditambah tanpa memecahkan kod lama. `//` dan `utf8` dipinjam; `goto` dan integer tidak.',
        'Why did Roblox not simply upgrade to Lua 5.4? Because Lua 5.2 and later broke compatibility: `setfenv`/`getfenv` were removed, `unpack` was moved, and Lua 5.3 changed number semantics by introducing integers. For a platform with millions of scripts written by children and professionals alike, such changes would break existing experiences. So Roblox took Lua 5.1 as a stable base and picked modern features one by one — only those that could be added without breaking old code. `//` and `utf8` were borrowed; `goto` and integers were not.'),
      P('Akibatnya, nombor Luau sentiasa float 64-bit (IEEE 754), seperti Lua 5.1. Integer sehingga 2⁵³ diwakili dengan tepat, jadi kiraan biasa — skor, nyawa, wang dalam permainan — tidak pernah kehilangan ketepatan; tetapi `2^53 + 1` tidak boleh dibezakan daripada `2^53`. Pustaka standard Luau juga **disandbox**: fungsi yang boleh menyentuh sistem pengendalian (`io`, `os.execute`, `os.remove`, `dofile`) dibuang, kerana skrip Roblox berjalan pada pelayan Roblox dan peranti pemain. Kuliah ini menggunakan Luau 0.663 melalui VM rasmi untuk menjalankan setiap contoh `luau`.',
        'As a result, Luau numbers are always 64-bit floats (IEEE 754), as in Lua 5.1. Integers up to 2⁵³ are represented exactly, so ordinary counts — scores, lives, in-game money — never lose precision; but `2^53 + 1` cannot be distinguished from `2^53`. Luau’s standard library is also **sandboxed**: functions that could touch the operating system (`io`, `os.execute`, `os.remove`, `dofile`) are removed, because Roblox scripts run on Roblox servers and players’ devices. This lecture runs every `luau` example with Luau 0.663 through the official VM.')),
    S('technical_terminology', TERMS('luau-cli', 'interpreter', 'bytecode', 'number-subtype')),
    S('syntax_rules',
      UL(
        ['Fail Luau menggunakan sambungan `.luau` (Roblox Studio menyimpan skrip dalam fail tempat `.rbxl`).', 'Luau files use the `.luau` extension (Roblox Studio stores scripts inside `.rbxl` place files).'],
        ['Sintaks Lua 5.1 — `local`, `function … end`, `if … then … end`, `for … do … end` — sah sepenuhnya.', 'Lua 5.1 syntax — `local`, `function … end`, `if … then … end`, `for … do … end` — is fully valid.'],
        ['`goto`, `::label::`, `<const>` dan `&` ialah **ralat sintaks** dalam Luau.', '`goto`, `::label::`, `<const>` and `&` are **syntax errors** in Luau.'],
      )),
    S('code_demonstration',
      CODE('lua51-compatible', 'luau', 'luau', ['Kod gaya Lua 5.1 berjalan dalam Luau', 'Lua 5.1-style code runs in Luau'], `
local function average(list)
  local sum = 0
  for i = 1, #list do
    sum = sum + list[i]
  end
  return sum / #list
end

local scores = {72, 85, 90}
print(average(scores))
print(string.upper("luau"), #scores)
`, '82.33333333333333\nLUAU\t3'),
      EXPLAIN('lua51-compatible',
        ['1–7', 'Fungsi `local`, gelung `for` berangka dan operator `#` — semuanya Lua 5.1 biasa.', 'A `local` function, a numeric `for` loop and the `#` operator — all plain Lua 5.1.'],
        ['9–10', '247 / 3. Luau mencetak nombor dengan digit secukupnya untuk mewakilinya dengan tepat: `82.33333333333333`.', '247 / 3. Luau prints numbers with just enough digits to represent them exactly: `82.33333333333333`.'],
        ['11', 'Pustaka `string` dan operator panjang berfungsi seperti dalam Lua.', 'The `string` library and the length operator work as in Lua.'])),
    S('complete_examples',
      CODE('numbers-are-doubles', 'luau', 'luau', ['Satu jenis nombor: float 64-bit', 'One number type: 64-bit floats'], `
local MAX_LIVES = 3
print(7 / 2, 7 // 2, math.floor(7.9))
print(2^53 == 2^53 + 1)
print(MAX_LIVES * 100, typeof(MAX_LIVES))
`, '3.5\t3\t7\ntrue\n300\tnumber', {
        debug: BUG(`
local MAX_LIVES <const> = 3
print(MAX_LIVES * 100)
`, "example:1: Expected identifier when parsing expression, got '<'",
          'Atribut `<const>` ialah ciri Lua 5.4. Luau tidak mengenalinya, jadi penghurai menemui `<` di tempat yang sepatutnya ungkapan dan berhenti — tiada baris dijalankan. Dalam Luau, gunakan konvensyen nama HURUF_BESAR untuk pemalar; jika anda perlukan perlindungan sebenar untuk table, `table.freeze` (LUAU104) tersedia.',
          'The `<const>` attribute is a Lua 5.4 feature. Luau does not recognise it, so the parser meets `<` where an expression should be and stops — no line runs. In Luau, use the UPPER_CASE naming convention for constants; if you need real protection for a table, `table.freeze` (LUAU104) is available.'),
      }),
      EXPLAIN('numbers-are-doubles',
        ['1', 'Pemalar mengikut konvensyen: nama huruf besar, tiada sintaks khas.', 'A constant by convention: an upper-case name, no special syntax.'],
        ['2', '`/` memberi 3.5; `//` (dipinjam daripada Lua 5.3) membundarkan ke bawah; `math.floor` sama untuk nombor positif.', '`/` gives 3.5; `//` (borrowed from Lua 5.3) rounds down; `math.floor` does the same for positive numbers.'],
        ['3', 'Di atas 2⁵³, float tidak boleh mewakili setiap integer — `2^53 + 1` dibundarkan kembali kepada `2^53`.', 'Above 2⁵³, a float cannot represent every integer — `2^53 + 1` rounds back to `2^53`.'],
        ['4', '`typeof` (fungsi Luau) memberi "number" — tiada "integer" atau "float" berasingan.', '`typeof` (a Luau function) gives "number" — there is no separate "integer" or "float".']),
      CODE('continue-not-goto', 'luau', 'luau', ['continue menggantikan corak goto', 'continue replaces the goto pattern'], `
local items = {"sword", "", "shield", "", "potion"}
local count = 0
for _, name in ipairs(items) do
  if name == "" then
    continue
  end
  count = count + 1
  print(count, name)
end
`, '1\tsword\n2\tshield\n3\tpotion', {
        debug: BUG(`
local items = {"sword", "", "shield"}
for _, name in ipairs(items) do
  if name == "" then goto skip end
  print(name)
  ::skip::
end
`, 'example:3: Incomplete statement: expected assignment or a function call',
          'Kod ini ialah corak "continue" Lua 5.2+ dengan `goto` (LUA103 3.2). Luau tidak mempunyai `goto`, jadi penghurai membaca `goto` sebagai nama pemboleh ubah biasa, kemudian mendapati `goto skip` bukan assignment atau panggilan fungsi. Dalam Luau, gunakan kata kunci `continue`.',
          'This code is the Lua 5.2+ "continue" pattern with `goto` (LUA103 3.2). Luau has no `goto`, so the parser reads `goto` as an ordinary variable name, then finds that `goto skip` is neither an assignment nor a function call. In Luau, use the `continue` keyword.'),
      }),
      EXPLAIN('continue-not-goto',
        ['1–2', 'Senarai inventori dengan slot kosong, dan kiraan.', 'An inventory list with empty slots, and a counter.'],
        ['3–6', '`continue` melangkau baki pusingan untuk slot kosong. Ia kata kunci Luau, bukan Lua standard.', '`continue` skips the rest of the pass for empty slots. It is a Luau keyword, not standard Lua.'],
        ['7–8', 'Hanya item sebenar dikira dan dicetak.', 'Only real items are counted and printed.'])),
    S('line_by_line',
      EXPLAIN('numbers-are-doubles',
        ['2', 'Dalam Lua 5.4, `7 // 2` memberi integer `3`; dalam Luau ia memberi float yang nilainya 3, dicetak sebagai `3`. Hasil yang kelihatan sama, jenis dalaman berbeza.', 'In Lua 5.4, `7 // 2` gives the integer `3`; in Luau it gives a float whose value is 3, printed as `3`. The visible result is the same; the internal type differs.']),
      EXPLAIN('continue-not-goto',
        ['5', '`continue` mesti menjadi pernyataan terakhir dalam bloknya, sama seperti `break` dan `return`.', '`continue` must be the last statement in its block, just like `break` and `return`.'])),
    S('why_this_way',
      P('Mengapa bermula dari Lua 5.1 dan bukan versi terkini? Keserasian ke belakang ialah keutamaan tertinggi Roblox: skrip yang ditulis sepuluh tahun lalu masih mesti berjalan. Setiap ciri baharu Luau melalui proses RFC terbuka yang menyemak sama ada ia boleh memecahkan kod sedia ada — itulah sebabnya `continue` ialah kata kunci **kontekstual** (ia masih boleh menjadi nama pemboleh ubah dalam kod lama).',
        'Why start from Lua 5.1 rather than the latest version? Backward compatibility is Roblox’s top priority: scripts written ten years ago must still run. Every new Luau feature goes through an open RFC process that checks whether it could break existing code — which is why `continue` is a **contextual** keyword (it can still be a variable name in old code).'),
      P('Ketahui perbezaan ini **apabila** anda menyalin contoh daripada tutorial Lua 5.4 atau buku "Programming in Lua" edisi baharu — `goto`, integer dan operator bit tidak akan berfungsi dalam Roblox.', 'Know these differences **when** you copy examples from Lua 5.4 tutorials or newer editions of "Programming in Lua" — `goto`, integers and bitwise operators will not work in Roblox.')),
    S('execution_flow',
      OL(
        ['Luau menghurai seluruh fail dan mengkompilnya kepada bytecode Luau. Ralat sintaks (seperti `goto`) dikesan di sini — tiada apa-apa dijalankan.', 'Luau parses the whole file and compiles it to Luau bytecode. Syntax errors (such as `goto`) are detected here — nothing runs.'],
        ['VM Luau menjalankan bytecode dari atas ke bawah.', 'The Luau VM runs the bytecode from top to bottom.'],
        ['Dalam `continue-not-goto`, `continue` melompat terus ke pusingan seterusnya gelung `for`.', 'In `continue-not-goto`, `continue` jumps straight to the next pass of the `for` loop.'],
      )),
    S('memory_behaviour',
      P('Nombor Luau disimpan terus dalam slot nilai (8 bait), tanpa peruntukan heap — sama seperti Lua 5.1. String, table dan fungsi diperuntukkan pada heap dan diurus oleh pengutip sampah Luau, yang bersifat **inkremental**: ia bekerja dalam langkah kecil supaya permainan tidak tersekat-sekat. Dalam Roblox, setiap skrip berkongsi heap VM yang sama bagi pelayan atau klien itu.',
        'Luau numbers are stored directly in a value slot (8 bytes), with no heap allocation — as in Lua 5.1. Strings, tables and functions are allocated on the heap and managed by Luau’s garbage collector, which is **incremental**: it works in small steps so games do not stutter. In Roblox, all scripts on a server or client share the same VM heap.')),
    S('alternative_implementations',
      P('Lua 5.1 mempunyai `unpack` global; Lua 5.2+ memindahkannya ke `table.unpack`. Luau menyokong **kedua-duanya** demi keserasian:', 'Lua 5.1 has a global `unpack`; Lua 5.2+ moved it to `table.unpack`. Luau supports **both** for compatibility:'),
      CODE('both-unpacks', 'luau', 'luau', ['unpack dan table.unpack', 'unpack and table.unpack'], `
local rgb = {255, 128, 0}
print(unpack(rgb))
print(table.unpack(rgb))
print(math.max(unpack(rgb)))
`, '255\t128\t0\n255\t128\t0\n255'),
      EXPLAIN('both-unpacks',
        ['1', 'Satu warna sebagai senarai tiga nombor.', 'A colour as a list of three numbers.'],
        ['2–3', 'Kedua-dua bentuk memberi hasil yang sama. Gunakan `table.unpack` dalam kod baharu — ia juga berfungsi dalam Lua 5.2+.', 'Both forms give the same result. Use `table.unpack` in new code — it also works in Lua 5.2+.'],
        ['4', 'Nilai yang dibuka menjadi argumen berasingan kepada `math.max`.', 'The unpacked values become separate arguments to `math.max`.'])),
    S('common_mistakes',
      UL(
        ['Menyalin kod Lua 5.4 yang menggunakan `goto`, `<const>` atau `&`.', 'Copying Lua 5.4 code that uses `goto`, `<const>` or `&`.'],
        ['Menjangka `math.type` atau pembahagian integer — Luau tiada integer.', 'Expecting `math.type` or integer division semantics — Luau has no integers.'],
        ['Menganggap Luau dan Roblox adalah benda yang sama (kuliah 1.3).', 'Assuming Luau and Roblox are the same thing (lecture 1.3).'],
        ['Menggunakan `io.write` atau `io.read` — pustaka `io` tiada.', 'Using `io.write` or `io.read` — the `io` library does not exist.'],
      )),
    S('debugging',
      P('Apabila kod daripada tutorial Lua gagal dalam Luau dengan ralat sintaks yang pelik, semak sama ada ia menggunakan ciri Lua 5.2+. Mesej penghurai Luau menyebut apa yang dijangka dan apa yang ditemui: `got \'<\'` menunjuk `<const>`, `got \'&\'` menunjuk operator bit, dan `Incomplete statement` pada baris `goto` menunjuk `goto`. Contoh berikut menunjukkan pengganti operator bit:',
        'When code from a Lua tutorial fails in Luau with a strange syntax error, check whether it uses Lua 5.2+ features. Luau’s parser messages say what was expected and what was found: `got \'<\'` points to `<const>`, `got \'&\'` to a bitwise operator, and `Incomplete statement` on a `goto` line to `goto`. The following example shows the replacement for bitwise operators:'),
      CODE('bit32-flags', 'luau', 'luau', ['Operasi bit dengan bit32', 'Bit operations with bit32'], `
local CAN_JUMP, CAN_SWIM, CAN_FLY = 1, 2, 4
local abilities = bit32.bor(CAN_JUMP, CAN_FLY)
print(abilities)
print(bit32.band(abilities, CAN_FLY) ~= 0)
print(bit32.band(abilities, CAN_SWIM) ~= 0)
`, '5\ntrue\nfalse'),
      EXPLAIN('bit32-flags',
        ['1', 'Setiap kebolehan ialah satu bit: 1, 2, 4.', 'Each ability is one bit: 1, 2, 4.'],
        ['2–3', '`bit32.bor` menggabungkan bit (seperti `|` dalam Lua 5.4): 1 + 4 = 5.', '`bit32.bor` combines bits (like `|` in Lua 5.4): 1 + 4 = 5.'],
        ['4–5', '`bit32.band` (seperti `&`) menguji satu bit: terbang ya, berenang tidak.', '`bit32.band` (like `&`) tests one bit: flying yes, swimming no.'])),
    S('performance',
      P('VM Luau ialah salah satu pelaksanaan Lua yang terpantas tanpa JIT: pengkompilnya melakukan pengoptimuman seperti lipatan pemalar dan cache panggilan medan, dan Roblox juga menyediakan penjanaan kod asli pilihan (`--!native`) untuk fungsi panas. Bagi pemula, kesimpulannya mudah: tulis kod yang jelas; Luau sudah pantas.',
        'The Luau VM is one of the fastest Lua implementations without a JIT: its compiler performs optimisations such as constant folding and field-access caching, and Roblox also offers optional native code generation (`--!native`) for hot functions. For beginners, the conclusion is simple: write clear code; Luau is already fast.')),
    S('software_engineering',
      P('Kebiasaan Lua 5.1 lama yang masih berjalan tetapi patut dielakkan dalam Luau moden:', 'An old Lua 5.1 habit that still runs but should be avoided in modern Luau:'),
      CODE('poor-global-habit', 'luau', 'luau', ['Pelaksanaan lemah: global gaya lama', 'Poor implementation: old-style globals'], `
function addCoins(amount)
  coins = (coins or 0) + amount
end

addCoins(10)
addCoins(5)
print(coins)
`, '15'),
      EXPLAIN('poor-global-habit',
        ['1–3', 'Fungsi dan kiraan syiling kedua-duanya global — boleh ditimpa oleh mana-mana skrip lain, dan Script Analysis memberi amaran tentangnya.', 'The function and the coin count are both globals — any other script could overwrite them, and Script Analysis warns about them.'],
        ['5–7', 'Ia berfungsi, tetapi keadaan tersembunyi dalam global.', 'It works, but the state is hidden in globals.']),
      CODE('improved-local-habit', 'luau', 'luau', ['Pelaksanaan lebih baik: local dan sintaks Luau', 'Improved implementation: locals and Luau syntax'], `
local coins = 0

local function addCoins(amount: number)
  coins += amount
end

addCoins(10)
addCoins(5)
print(\`coins: {coins}\`)
`, 'coins: 15'),
      EXPLAIN('improved-local-habit',
        ['1', 'Keadaan dalam local yang jelas, dengan nilai awal.', 'State in an explicit local, with an initial value.'],
        ['3–5', 'Fungsi `local`, anotasi jenis pilihan (`: number`) dan assignment majmuk `+=` — semuanya Luau. Anotasi tidak disemak oleh pengesahan kursus ini (tiada luau-analyze).', 'A `local` function, an optional type annotation (`: number`) and compound assignment `+=` — all Luau. The annotation is not checked by this course’s verification (no luau-analyze).'],
        ['7–9', 'Interpolasi string dengan backtick (LUAU102).', 'Backtick string interpolation (LUAU102).'])),
    S('industry_use_cases',
      UL(
        ['Semua pengalaman Roblox — daripada permainan kecil hingga yang mempunyai berjuta-juta pemain — ditulis dalam Luau.', 'Every Roblox experience — from tiny games to ones with millions of players — is written in Luau.'],
        ['Luau juga digunakan di luar Roblox: contohnya dalam enjin Alan Wake 2 (Remedy) dan alat seperti Lune untuk skrip sistem.', 'Luau is also used outside Roblox: for example in Remedy’s engine for Alan Wake 2, and in tools such as Lune for system scripting.'],
        ['Pustaka sumber terbuka Roblox (contohnya dari ekosistem Wally) ditulis dalam Luau dengan jenis.', 'Open-source Roblox libraries (for example from the Wally ecosystem) are written in typed Luau.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `lua51-compatible` dan tambah skor keempat. Ramalkan purata baharu.', 'Run `lua51-compatible` and add a fourth score. Predict the new average.'],
        ['Tukar `continue-not-goto` supaya ia juga melangkau "shield".', 'Change `continue-not-goto` so it also skips "shield".'],
        ['Jalankan kedua-dua versi berpepijat dan perhatikan bahawa tiada output dicetak sebelum ralat sintaks.', 'Run both buggy versions and note that no output is printed before a syntax error.'],
      )),
    S('mini_project',
      P('**Penyemak keserasian.** Tulis program yang menyimpan senarai ciri Lua dan sama ada Luau menyokongnya, kemudian cetak laporan dan kiraan.', '**A compatibility checker.** Write a program that stores a list of Lua features and whether Luau supports them, then prints a report and a count.'),
      CODE('compat-report', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local features = {
  {name = "local functions", supported = true},
  {name = "goto", supported = false},
  {name = "floor division //", supported = true},
  {name = "integer subtype", supported = false},
  {name = "string methods s:upper()", supported = true},
}

local supported = 0
for _, f in ipairs(features) do
  local mark = if f.supported then "yes" else "no"
  if f.supported then supported += 1 end
  print(\`{f.name}: {mark}\`)
end
print(\`{supported} of {#features} supported\`)
`, 'local functions: yes\ngoto: no\nfloor division //: yes\ninteger subtype: no\nstring methods s:upper(): yes\n3 of 5 supported'),
      EXPLAIN('compat-report',
        ['1–7', 'Data sebagai senarai table, setiap satu dengan nama dan status.', 'Data as a list of tables, each with a name and a status.'],
        ['9', 'Kiraan ciri yang disokong.', 'A count of supported features.'],
        ['10–14', 'Untuk setiap ciri: `if … then … else` sebagai **ungkapan** (Luau) memilih label; `+=` mengemas kini kiraan.', 'For each feature: `if … then … else` as an **expression** (Luau) chooses the label; `+=` updates the count.'],
        ['15', 'Ringkasan dengan interpolasi string.', 'A summary with string interpolation.'])),
    S('summary',
      UL(
        ['Luau diterbitkan daripada Lua 5.1 oleh Roblox dan sumber terbuka sejak 2021.', 'Luau was derived from Lua 5.1 by Roblox and has been open source since 2021.'],
        ['Kebanyakan kod Lua 5.1 berjalan tanpa perubahan.', 'Most Lua 5.1 code runs unchanged.'],
        ['Tiada `goto`, `<const>`, operator bit atau integer; ada `//`, `continue`, `bit32`.', 'No `goto`, `<const>`, bitwise operators or integers; there are `//`, `continue`, `bit32`.'],
        ['Pustaka standard disandbox: tiada `io`, tiada akses fail.', 'The standard library is sandboxed: no `io`, no file access.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah Roblox memilih Lua 5.1 sebagai asas?', 'Why did Roblox choose Lua 5.1 as the base?'],
        ['Apakah yang digunakan dalam Luau untuk menggantikan `goto continue`?', 'What does Luau use instead of `goto continue`?'],
        ['Apakah `typeof(7 // 2)` dalam Luau?', 'What is `typeof(7 // 2)` in Luau?'],
        ['Mengapakah pustaka `io` dibuang?', 'Why was the `io` library removed?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Why Luau?', url: `${LUAU}/why` },
        { title: 'Luau — Compatibility with Lua', url: `${LUAU}/compatibility` },
        { title: 'Luau on GitHub (luau-lang/luau)', url: 'https://github.com/luau-lang/luau' },
        { title: 'Roblox Creator Hub — Luau', url: `${DOCS}/luau` },
      )),
  ],
};

// ─── 1.2 What Luau adds and what it removes ────────────────────────────────

export const LUAU101_1_2: LectureContentDef = {
  courseCode: 'LUAU101',
  module: 1,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menyenaraikan tambahan sintaks Luau: assignment majmuk, interpolasi string, `continue`, if-expression dan iterasi umum.', 'List Luau’s syntax additions: compound assignment, string interpolation, `continue`, if-expressions and generalized iteration.'],
        ['Menyenaraikan tambahan pustaka: `table.find`, `table.clone`, `table.freeze`, `string.split`, `math.clamp`, `vector`, `buffer`.', 'List the library additions: `table.find`, `table.clone`, `table.freeze`, `string.split`, `math.clamp`, `vector`, `buffer`.'],
        ['Menerangkan apa yang dibuang dan mengapa (sandbox).', 'Explain what was removed and why (the sandbox).'],
        ['Menerangkan sistem jenis beransur secara umum.', 'Describe gradual typing at a high level.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1: Luau berasaskan Lua 5.1.', 'Lecture 1.1: Luau is based on Lua 5.1.'],
        ['Kursus LUAU102–LUAU104 mengajar setiap ciri dengan mendalam; kuliah ini ialah peta keseluruhan.', 'Courses LUAU102–LUAU104 teach each feature in depth; this lecture is the overall map.'],
      )),
    S('introduction',
      P('Luau bukan sekadar "Lua 5.1 dengan beberapa tampalan". Roblox telah menambah sintaks yang menjadikan kod biasa lebih ringkas dan selamat, fungsi pustaka yang diperlukan oleh pembangun permainan setiap hari, dan sistem jenis yang membantu mengesan pepijat sebelum permainan dijalankan. Pada masa yang sama, beberapa ciri dibuang supaya skrip daripada berjuta-juta pencipta tidak boleh merosakkan pelayan. Kuliah ini memberi peta keseluruhan; kursus seterusnya mengajar setiap bahagian dengan mendalam.',
        'Luau is not just "Lua 5.1 with a few patches". Roblox has added syntax that makes everyday code shorter and safer, library functions that game developers need every day, and a type system that helps catch bugs before a game runs. At the same time, some features were removed so that scripts from millions of creators cannot harm the servers. This lecture gives the overall map; later courses teach each part in depth.'),
      KEY('Tambahan = kemudahan + keselamatan + jenis. Pembuangan = sandbox.', 'Additions = convenience + safety + types. Removals = the sandbox.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Sintaks:** `x += 1`, `` `Hi {name}` ``, `continue`, `if a then b else c` sebagai ungkapan, `for k, v in t`.', '**Syntax:** `x += 1`, `` `Hi {name}` ``, `continue`, `if a then b else c` as an expression, `for k, v in t`.'],
        ['**Pustaka:** `table.find/clone/freeze/clear/create`, `string.split`, `math.clamp/round/sign`, `vector`, `buffer`.', '**Library:** `table.find/clone/freeze/clear/create`, `string.split`, `math.clamp/round/sign`, `vector`, `buffer`.'],
        ['**Jenis:** anotasi pilihan (`local n: number`) yang disemak oleh penganalisis, bukan oleh VM.', '**Types:** optional annotations (`local n: number`) checked by the analyser, not by the VM.'],
        ['**Dibuang:** `io`, `os.execute/exit/remove/getenv`, `dofile`, `load`, `goto`; `loadstring` dimatikan secara lalai dalam Roblox.', '**Removed:** `io`, `os.execute/exit/remove/getenv`, `dofile`, `load`, `goto`; `loadstring` is disabled by default in Roblox.'],
      )),
    S('detailed_theory',
      P('Tambahan sintaks Luau mengikut satu prinsip: kod lama mesti kekal sah. `+=` dan rakan-rakannya tidak boleh muncul dalam Lua 5.1 yang sah, jadi menambahnya tidak memecahkan apa-apa. Interpolasi string menggunakan backtick kerana backtick tidak mempunyai makna dalam Lua 5.1. `continue` dan `type` ialah kata kunci **kontekstual**: ia hanya bermakna istimewa di kedudukan tertentu, jadi pemboleh ubah bernama `continue` dalam kod lama masih berfungsi. If-expression menyelesaikan perangkap `a and b or c` (yang gagal apabila `b` palsu) dengan sintaks yang sentiasa betul.',
        'Luau’s syntax additions follow one principle: old code must stay valid. `+=` and its relatives could not appear in valid Lua 5.1, so adding them breaks nothing. String interpolation uses backticks because backticks have no meaning in Lua 5.1. `continue` and `type` are **contextual** keywords: they only have special meaning in certain positions, so a variable named `continue` in old code still works. If-expressions fix the `a and b or c` trap (which fails when `b` is falsy) with syntax that is always correct.'),
      P('Pembuangan pula datang daripada model keselamatan Roblox. Skrip berjalan pada pelayan yang dikongsi dan pada peranti pemain; pustaka `io` atau `os.execute` akan membenarkan sesiapa sahaja membaca fail atau menjalankan program. Oleh itu Luau menyediakan pustaka standard yang **disandbox**: hanya fungsi yang tidak menyentuh dunia luar. `os.time`, `os.clock` dan `os.date` kekal kerana ia hanya membaca masa. Sistem jenis pula **beransur**: anda boleh menulis kod tanpa jenis langsung, menambah anotasi secara berperingkat, dan memilih tahap semakan dengan `--!nocheck`, `--!nonstrict` atau `--!strict` di baris pertama fail. Penting: VM mengabaikan jenis sepenuhnya semasa runtime; semakan dilakukan oleh penganalisis dalam Studio atau `luau-analyze`.',
        'The removals come from Roblox’s security model. Scripts run on shared servers and on players’ devices; an `io` library or `os.execute` would let anyone read files or run programs. So Luau provides a **sandboxed** standard library: only functions that do not touch the outside world. `os.time`, `os.clock` and `os.date` remain because they only read the time. The type system is **gradual**: you can write code with no types at all, add annotations step by step, and choose the checking level with `--!nocheck`, `--!nonstrict` or `--!strict` on the file’s first line. Important: the VM ignores types completely at run time; checking is done by the analyser in Studio or by `luau-analyze`.')),
    S('technical_terminology', TERMS('type-annotation', 'luau-cli', 'script-analysis', 'table')),
    S('syntax_rules',
      UL(
        ['`x += n`, `x -= n`, `x *= n`, `x /= n`, `x //= n`, `x %= n`, `x ^= n`, `s ..= t`.', '`x += n`, `x -= n`, `x *= n`, `x /= n`, `x //= n`, `x %= n`, `x ^= n`, `s ..= t`.'],
        ['`` `teks {ungkapan} teks` `` — interpolasi; `\\{` untuk kurungan kerinting literal.', '`` `text {expression} text` `` — interpolation; `\\{` for a literal brace.'],
        ['`local v = if syarat then a elseif syarat2 then b else c` — `else` wajib.', '`local v = if condition then a elseif condition2 then b else c` — `else` is required.'],
      )),
    S('code_demonstration',
      CODE('luau-additions', 'luau', 'luau', ['Empat tambahan sintaks dalam satu program', 'Four syntax additions in one program'], `
local health = 100
health -= 35
health *= 2

local status = if health > 100 then "overhealed" elseif health > 50 then "healthy" else "hurt"
print(\`health {health}: {status}\`)

for wave = 1, 4 do
  if wave == 3 then continue end
  print(\`wave {wave}\`)
end
`, 'health 130: overhealed\nwave 1\nwave 2\nwave 4'),
      EXPLAIN('luau-additions',
        ['1–3', 'Assignment majmuk: 100 − 35 = 65, kemudian × 2 = 130.', 'Compound assignment: 100 − 35 = 65, then × 2 = 130.'],
        ['5', 'If-expression memilih satu nilai — tiada perangkap `and/or`.', 'An if-expression chooses one value — no `and/or` trap.'],
        ['6', 'Interpolasi: ungkapan dalam `{}` dinilai dan ditukar kepada teks.', 'Interpolation: expressions inside `{}` are evaluated and converted to text.'],
        ['8–11', '`continue` melangkau gelombang 3.', '`continue` skips wave 3.'])),
    S('complete_examples',
      CODE('library-additions', 'luau', 'luau', ['Tambahan pustaka', 'Library additions'], `
local inventory = {"sword", "shield", "potion"}
print(table.find(inventory, "shield"), table.find(inventory, "bow"))

local copy = table.clone(inventory)
copy[1] = "axe"
print(inventory[1], copy[1])

local parts = string.split("red,green,blue", ",")
print(#parts, parts[2])
print(math.clamp(150, 0, 100), math.round(2.5), math.sign(-7))
`, '2\tnil\nsword\taxe\n3\tgreen\n100\t3\t-1', {
        debug: BUG(`
local inventory = {"sword", "shield"}
io.write("items: ", #inventory, "\\n")
`, "example:2: attempt to index nil with 'write'",
          'Pustaka `io` tiada dalam Luau (sandbox), jadi `io` ialah global `nil`, dan `io.write` cuba mengindeks `nil`. Ini ralat **runtime** — baris 1 sudah dijalankan. Gunakan `print`, yang tersedia dalam luau CLI dan Roblox.',
          'The `io` library does not exist in Luau (the sandbox), so `io` is a `nil` global, and `io.write` tries to index `nil`. This is a **runtime** error — line 1 already ran. Use `print`, which is available in both the luau CLI and Roblox.'),
      }),
      EXPLAIN('library-additions',
        ['1–2', '`table.find` memulangkan kedudukan nilai, atau `nil` jika tiada.', '`table.find` returns the value’s position, or `nil` if absent.'],
        ['4–6', '`table.clone` mencipta salinan cetek; menukar salinan tidak menjejaskan asal.', '`table.clone` creates a shallow copy; changing the copy does not affect the original.'],
        ['8–9', '`string.split` memecahkan teks kepada senarai.', '`string.split` splits text into a list.'],
        ['10', '`math.clamp` mengehadkan julat; `math.round` membundarkan .5 menjauhi sifar; `math.sign` memberi −1, 0 atau 1.', '`math.clamp` limits a range; `math.round` rounds .5 away from zero; `math.sign` gives −1, 0 or 1.']),
      CODE('sandbox-check', 'luau', 'luau', ['Apa yang ada dalam sandbox', 'What the sandbox contains'], `
print(io == nil, dofile == nil)
print(os.execute == nil, os.remove == nil)
print(typeof(os.time()), typeof(os.clock()))
print(typeof(vector.create(1, 2, 3)), typeof(buffer.create(8)))
`, 'true\ttrue\ntrue\ttrue\nnumber\tnumber\nvector\tbuffer', {
        debug: BUG(`
local flags = 6 & 3
print(flags)
`, "example:1: Expected identifier when parsing expression, got '&'",
          'Operator `&` ialah Lua 5.3+; Luau tidak menyokongnya, dan penghurai berhenti pada `&`. Tiada apa-apa dijalankan, termasuk `print`. Gunakan `bit32.band(6, 3)` (kuliah 1.1).',
          'The `&` operator is Lua 5.3+; Luau does not support it, and the parser stops at `&`. Nothing runs, including the `print`. Use `bit32.band(6, 3)` (lecture 1.1).'),
      }),
      EXPLAIN('sandbox-check',
        ['1–2', 'Akses fail dan program luar telah dibuang.', 'File access and external programs have been removed.'],
        ['3', 'Fungsi masa yang selamat kekal.', 'Safe time functions remain.'],
        ['4', 'Dua jenis nilai baharu Luau: `vector` (tiga nombor, untuk geometri) dan `buffer` (bait mentah). LUAU102 2.3 memperkenalkannya.', 'Two new Luau value types: `vector` (three numbers, for geometry) and `buffer` (raw bytes). LUAU102 2.3 introduces them.'])),
    S('line_by_line',
      EXPLAIN('luau-additions',
        ['5', 'If-expression mesti mempunyai `else`, kerana ungkapan sentiasa mesti menghasilkan nilai. Ini berbeza daripada pernyataan `if`, di mana `else` adalah pilihan.', 'An if-expression must have an `else`, because an expression must always produce a value. This differs from the `if` statement, where `else` is optional.']),
      EXPLAIN('library-additions',
        ['4', '`table.clone` hanya menyalin tahap pertama. Table bersarang masih dikongsi — LUAU104 3.2 menerangkan salinan dalam.', '`table.clone` copies only the first level. Nested tables are still shared — LUAU104 3.2 explains deep copies.'])),
    S('why_this_way',
      P('Mengapa tambahan ini? Kerana ia menyelesaikan masalah yang ditemui oleh berjuta-juta pembangun Roblox setiap hari: kod `x = x + 1` yang panjang, penggabungan string yang sukar dibaca, perangkap `and/or`, dan carian dalam senarai yang perlu ditulis semula setiap kali. Mengapa sandbox? Kerana dalam platform terbuka, keselamatan pelayan dan pemain mesti dijamin oleh bahasa, bukan oleh kepercayaan.',
        'Why these additions? Because they solve problems millions of Roblox developers meet every day: long `x = x + 1` code, hard-to-read string concatenation, the `and/or` trap, and list searches rewritten every time. Why the sandbox? Because on an open platform, server and player safety must be guaranteed by the language, not by trust.'),
      P('Gunakan ciri Luau **apabila** kod hanya akan berjalan dalam Luau (Roblox, Lune). Jika kod mesti juga berjalan dalam Lua standard, kekal dengan subset Lua 5.1.', 'Use Luau features **when** the code will only run in Luau (Roblox, Lune). If the code must also run in standard Lua, stick to the Lua 5.1 subset.')),
    S('execution_flow',
      OL(
        ['`luau-additions` baris 2–3: `health` menjadi 65, kemudian 130.', '`luau-additions` lines 2–3: `health` becomes 65, then 130.'],
        ['Baris 5: syarat pertama (130 > 100) benar → "overhealed"; cabang lain tidak dinilai.', 'Line 5: the first condition (130 > 100) is true → "overhealed"; the other branches are not evaluated.'],
        ['Baris 8–11: gelombang 1, 2, 4 dicetak; 3 dilangkau oleh `continue`.', 'Lines 8–11: waves 1, 2, 4 print; 3 is skipped by `continue`.'],
      )),
    S('memory_behaviour',
      P('`table.clone` memperuntukkan table baharu dengan saiz yang sama seperti asal. `vector` ialah jenis **nilai** (seperti nombor): ia disimpan terus dalam slot dan tidak memerlukan peruntukan heap — itulah sebabnya ia pantas untuk matematik geometri. `buffer` pula ialah blok bait yang diperuntukkan sekali pada saiz tetap, berguna untuk data binari padat.',
        '`table.clone` allocates a new table of the same size as the original. A `vector` is a **value** type (like a number): it is stored directly in a slot and needs no heap allocation — which is why it is fast for geometry maths. A `buffer` is a block of bytes allocated once at a fixed size, useful for compact binary data.')),
    S('alternative_implementations',
      P('Interpolasi berbanding `string.format` — kedua-duanya sah dalam Luau:', 'Interpolation versus `string.format` — both are valid in Luau:'),
      CODE('interp-vs-format', 'luau', 'luau', ['Dua cara memformat teks', 'Two ways to format text'], `
local name, coins = "Aina", 1250
print(\`{name} has {coins} coins\`)
print(string.format("%s has %d coins", name, coins))
print(string.format("%.1f%% complete", 87.26))
`, 'Aina has 1250 coins\nAina has 1250 coins\n87.3% complete'),
      EXPLAIN('interp-vs-format',
        ['1–2', 'Interpolasi: ringkas, nilai berada di tempatnya dalam teks.', 'Interpolation: short, the values sit in place inside the text.'],
        ['3', '`string.format`: masih berguna…', '`string.format`: still useful…'],
        ['4', '…apabila anda perlukan kawalan format seperti tempat perpuluhan (`%.1f`).', '…when you need format control such as decimal places (`%.1f`).'])),
    S('common_mistakes',
      UL(
        ['Menulis `x++` — Luau tiada operator kenaikan; gunakan `x += 1`.', 'Writing `x++` — Luau has no increment operator; use `x += 1`.'],
        ['Menggunakan petikan biasa untuk interpolasi: `"{name}"` tidak diinterpolasi.', 'Using ordinary quotes for interpolation: `"{name}"` is not interpolated.'],
        ['Menulis if-expression tanpa `else`.', 'Writing an if-expression without `else`.'],
        ['Menjangka anotasi jenis menghalang nilai yang salah semasa runtime.', 'Expecting type annotations to block wrong values at run time.'],
      )),
    S('debugging',
      P('Dua jenis ralat muncul apabila menggunakan ciri yang tiada: **ralat sintaks** untuk sintaks yang tiada (`&`, `goto`, `<const>`) dan **ralat runtime** `attempt to index nil with \'…\'` untuk pustaka yang tiada (`io.write`, `os.execute(...)`). Yang pertama menghentikan seluruh fail sebelum ia bermula; yang kedua hanya apabila baris itu dicapai. Satu lagi kekeliruan biasa ialah anotasi jenis: kod di bawah dijalankan walaupun jenisnya salah, kerana VM tidak menyemak jenis:',
        'Two kinds of errors appear when using features that are absent: a **syntax error** for missing syntax (`&`, `goto`, `<const>`) and a **runtime error** `attempt to index nil with \'…\'` for missing libraries (`io.write`, `os.execute(...)`). The first stops the whole file before it starts; the second only when that line is reached. Another common confusion is type annotations: the code below runs although its type is wrong, because the VM does not check types:'),
      CODE('types-not-enforced', 'luau', 'luau', ['Anotasi tidak disemak semasa runtime', 'Annotations are not checked at run time'], `
local function double(n: number): number
  return n * 2
end

print(double(21))
print(double("4"))
`, '42\n8'),
      EXPLAIN('types-not-enforced',
        ['1–3', 'Anotasi menyatakan bahawa `n` dan hasilnya ialah nombor.', 'The annotations state that `n` and the result are numbers.'],
        ['5–6', 'VM menjalankan kedua-dua panggilan. `"4" * 2` berjaya kerana penukaran automatik string kepada nombor. Dalam Studio dengan `--!strict`, baris 6 akan digariskan sebagai ralat jenis — semakan itu **tidak** dijalankan oleh pengesahan kursus ini.', 'The VM runs both calls. `"4" * 2` succeeds because of automatic string-to-number conversion. In Studio with `--!strict`, line 6 would be underlined as a type error — that check is **not** run by this course’s verification.'])),
    S('performance',
      P('Banyak tambahan Luau juga lebih pantas: `table.find` dan `table.clone` dilaksanakan dalam C++ dan mengalahkan gelung Lua yang setara; `vector` mengelak peruntukan; dan pengkompil boleh mengoptimumkan `+=` sebaik `x = x + 1`. Interpolasi string dikompil kepada `string.format`, jadi kosnya sama.',
        'Many Luau additions are also faster: `table.find` and `table.clone` are implemented in C++ and beat equivalent Lua loops; `vector` avoids allocations; and the compiler optimises `+=` as well as `x = x + 1`. String interpolation compiles to `string.format`, so it costs the same.')),
    S('software_engineering',
      P('Perangkap `and/or` (LUA103 1.3) berbanding if-expression:', 'The `and/or` trap (LUA103 1.3) versus an if-expression:'),
      CODE('poor-and-or', 'luau', 'luau', ['Pelaksanaan lemah: and/or dengan nilai palsu', 'Poor implementation: and/or with a falsy value'], `
local function settingLabel(enabled, override)
  return override ~= nil and override or (enabled and "on" or "off")
end

print(settingLabel(true, nil))
print(settingLabel(true, false))
`, 'on\non'),
      EXPLAIN('poor-and-or',
        ['1–3', 'Niat: jika `override` diberi, gunakannya. Tetapi apabila `override` ialah `false`, `true and false` memberi `false`, lalu `or` memilih cabang kanan.', 'Intent: if `override` is given, use it. But when `override` is `false`, `true and false` gives `false`, so `or` picks the right-hand branch.'],
        ['5–6', 'Panggilan kedua sepatutnya menghasilkan `false`, tetapi memberi "on".', 'The second call should produce `false`, but gives "on".']),
      CODE('improved-if-expression', 'luau', 'luau', ['Pelaksanaan lebih baik: if-expression', 'Improved implementation: an if-expression'], `
local function settingLabel(enabled, override)
  return if override ~= nil then override elseif enabled then "on" else "off"
end

print(settingLabel(true, nil))
print(settingLabel(true, false))
`, 'on\nfalse'),
      EXPLAIN('improved-if-expression',
        ['1–3', 'Setiap cabang dipilih oleh syaratnya sendiri, tanpa bergantung pada truthiness nilai.', 'Each branch is chosen by its own condition, without depending on the value’s truthiness.'],
        ['5–6', '`false` dihormati.', '`false` is respected.'])),
    S('industry_use_cases',
      UL(
        ['Skrip Roblox moden menggunakan `+=` dan interpolasi secara meluas; panduan gaya Roblox mengesyorkannya.', 'Modern Roblox scripts use `+=` and interpolation widely; Roblox’s style guide recommends them.'],
        ['Pustaka sumber terbuka besar ditulis dengan `--!strict` untuk mengesan pepijat sebelum diterbitkan.', 'Large open-source libraries are written with `--!strict` to catch bugs before release.'],
        ['`buffer` digunakan untuk memampatkan data rangkaian dan simpanan.', '`buffer` is used to compress network and storage data.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis semula `x = x + 1` dan `s = s .. "!"` dengan assignment majmuk.', 'Rewrite `x = x + 1` and `s = s .. "!"` with compound assignment.'],
        ['Tambah status "critical" untuk kesihatan di bawah 20 dalam `luau-additions`.', 'Add a "critical" status for health below 20 in `luau-additions`.'],
        ['Jalankan kedua-dua versi berpepijat: yang mana ralat sintaks, yang mana runtime?', 'Run both buggy versions: which is a syntax error, which is a runtime error?'],
      )),
    S('mini_project',
      P('**Ringkasan pusingan permainan.** Gunakan sekurang-kurangnya lima tambahan Luau untuk meringkaskan keputusan satu pusingan.', '**A game-round summary.** Use at least five Luau additions to summarise the results of one round.'),
      CODE('round-summary', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local results = {Aina = 1200, Ben = 950, Chen = 1500, Dewi = 950}
local names = {}
for name in results do
  table.insert(names, name)
end
table.sort(names, function(a, b)
  if results[a] ~= results[b] then return results[a] > results[b] end
  return a < b
end)

local total = 0
for rank, name in names do
  local score = results[name]
  total += score
  local medal = if rank == 1 then " (winner)" else ""
  print(\`{rank}. {name} {score}{medal}\`)
end
print(\`average {math.round(total / #names)}\`)
`, '1. Chen 1500 (winner)\n2. Aina 1200\n3. Ben 950\n4. Dewi 950\naverage 1150'),
      EXPLAIN('round-summary',
        ['1–5', 'Iterasi umum `for name in results` (tanpa `pairs`) mengumpul nama.', 'Generalized iteration `for name in results` (without `pairs`) collects the names.'],
        ['6–9', 'Isih mengikut skor menurun, kemudian nama untuk skor yang sama — supaya susunan sentiasa sama.', 'Sort by descending score, then by name for equal scores — so the order is always the same.'],
        ['11–17', 'Iterasi umum atas senarai; `+=`, if-expression dan interpolasi.', 'Generalized iteration over the list; `+=`, an if-expression and interpolation.'],
        ['18', '`math.round` (Luau) membundarkan purata 1150.', '`math.round` (Luau) rounds the average 1150.'])),
    S('summary',
      UL(
        ['Sintaks baharu: `+=`, interpolasi, `continue`, if-expression, iterasi umum.', 'New syntax: `+=`, interpolation, `continue`, if-expressions, generalized iteration.'],
        ['Pustaka baharu: `table.find/clone/freeze`, `string.split`, `math.clamp/round`, `vector`, `buffer`.', 'New library functions: `table.find/clone/freeze`, `string.split`, `math.clamp/round`, `vector`, `buffer`.'],
        ['Dibuang demi keselamatan: `io`, akses fail dan program, `goto`.', 'Removed for safety: `io`, file and program access, `goto`.'],
        ['Jenis disemak oleh penganalisis, bukan oleh VM.', 'Types are checked by the analyser, not by the VM.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah interpolasi menggunakan backtick dan bukan petikan biasa?', 'Why does interpolation use backticks rather than ordinary quotes?'],
        ['Apakah yang dipulangkan oleh `table.find({"a"}, "z")`?', 'What does `table.find({"a"}, "z")` return?'],
        ['Mengapakah `os.time` kekal tetapi `os.execute` dibuang?', 'Why does `os.time` remain but `os.execute` was removed?'],
        ['Adakah `double("4")` dalam `types-not-enforced` menghasilkan ralat runtime? Mengapa?', 'Does `double("4")` in `types-not-enforced` produce a runtime error? Why?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax', url: `${LUAU}/syntax` },
        { title: 'Luau — Library', url: `${LUAU}/library` },
        { title: 'Luau — Sandboxing', url: `${LUAU}/sandbox` },
        { title: 'Luau — Type checking', url: `${LUAU}/typecheck` },
      )),
  ],
};

// ─── 1.3 The Luau language versus the Roblox engine API ────────────────────

export const LUAU101_1_3: LectureContentDef = {
  courseCode: 'LUAU101',
  module: 1,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Membezakan bahasa Luau daripada [[engine-api|API enjin Roblox]].', 'Distinguish the Luau language from the [[engine-api|Roblox engine API]].'],
        ['Mengenal pasti nama milik enjin: `game`, `workspace`, `Instance`, `task`, `Vector3`, `Players`.', 'Recognise engine-owned names: `game`, `workspace`, `Instance`, `task`, `Vector3`, `Players`.'],
        ['Menerangkan mengapa kod Roblox ditandakan "dikompil sahaja" dalam kursus ini.', 'Explain why Roblox code is marked "compiled only" in this course.'],
        ['Memisahkan logik tulen daripada kod enjin supaya ia boleh diuji.', 'Separate pure logic from engine code so it can be tested.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1–1.2: apa itu Luau.', 'Lectures 1.1–1.2: what Luau is.'],
      )),
    S('introduction',
      P('Apabila anda menulis `game.Players.PlayerAdded:Connect(…)` dalam Roblox Studio, dua perkara berbeza bekerjasama. **Bahasa** Luau menyediakan pemboleh ubah, fungsi, table, gelung dan sintaks `:` untuk memanggil kaedah. **Enjin** Roblox menyediakan objek `game`, perkhidmatan `Players`, event `PlayerAdded` dan kaedah `Connect`. Pemula sering menganggapnya sebagai satu benda — tetapi memahami sempadannya adalah penting: ia menentukan apa yang boleh diuji di luar Studio, di mana mencari dokumentasi, dan mengapa sesetengah ralat berlaku.',
        'When you write `game.Players.PlayerAdded:Connect(…)` in Roblox Studio, two different things work together. The Luau **language** provides variables, functions, tables, loops and the `:` syntax for calling methods. The Roblox **engine** provides the `game` object, the `Players` service, the `PlayerAdded` event and the `Connect` method. Beginners often treat them as one thing — but understanding the boundary matters: it decides what can be tested outside Studio, where to look for documentation, and why some errors happen.'),
      KEY('Bahasa = sintaks dan pustaka standard (luau.org). Enjin = objek dan perkhidmatan Roblox (create.roblox.com).', 'Language = syntax and the standard library (luau.org). Engine = Roblox objects and services (create.roblox.com).', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Bahasa Luau:** kata kunci, operator, `string`, `table`, `math`, `bit32`, `utf8`, `vector`, `buffer`, `coroutine`.', '**The Luau language:** keywords, operators, `string`, `table`, `math`, `bit32`, `utf8`, `vector`, `buffer`, `coroutine`.'],
        ['**API enjin Roblox:** `game`, `workspace`, `script`, `Instance`, `Enum`, `task`, `Vector3`, `CFrame`, `Color3`, perkhidmatan seperti `Players`.', '**The Roblox engine API:** `game`, `workspace`, `script`, `Instance`, `Enum`, `task`, `Vector3`, `CFrame`, `Color3`, services such as `Players`.'],
        ['**Global tambahan Roblox:** `warn`, `tick`, `typeof` yang mengenali jenis Roblox (contohnya "Vector3").', '**Extra Roblox globals:** `warn`, `tick`, a `typeof` that recognises Roblox types (for example "Vector3").'],
        ['**Status kod dalam kursus ini:** `luau` = **dijalankan** dengan VM Luau; `roblox` = **dikompil sahaja**; tiada contoh diuji dalam Roblox Studio oleh sistem kami.', '**Code status in this course:** `luau` = **executed** with the Luau VM; `roblox` = **compiled only**; no example is tested in Roblox Studio by our system.'],
      )),
    S('detailed_theory',
      P('Enjin Roblox ditulis dalam C++. Ia mendedahkan objeknya kepada skrip sebagai nilai Luau jenis `userdata` dengan sifat, kaedah dan event. Apabila anda menulis `part.Anchored = true`, sintaks assignment adalah Luau, tetapi kesan sebenar — bahagian itu berhenti jatuh — dilakukan oleh enjin fizik C++. Di luar Roblox, objek ini tidak wujud: dalam luau CLI, `game` ialah global `nil` biasa. Itulah sebabnya kursus ini membezakan dua status: contoh `luau` dijalankan dan outputnya disahkan; contoh `roblox` hanya dikompil untuk membuktikan sintaksnya sah, dan tingkah lakunya dalam Studio **diterangkan**, bukan disahkan.',
        'The Roblox engine is written in C++. It exposes its objects to scripts as Luau values of type `userdata`, with properties, methods and events. When you write `part.Anchored = true`, the assignment syntax is Luau, but the real effect — the part stops falling — is carried out by the C++ physics engine. Outside Roblox these objects do not exist: in the luau CLI, `game` is an ordinary `nil` global. That is why this course distinguishes two statuses: `luau` examples are executed and their output is verified; `roblox` examples are only compiled to prove the syntax is valid, and their behaviour in Studio is **described**, not verified.'),
      P('Sempadan ini juga panduan reka bentuk. Logik permainan — mengira kerosakan, memutuskan pemenang, mengesahkan input — tidak memerlukan enjin dan boleh ditulis sebagai fungsi Luau tulen. Kod enjin — mencari pemain, mengubah bahagian, menyambung event — hendaklah lapisan nipis yang memanggil logik itu. Hasilnya: logik boleh diuji di luar Studio dengan luau CLI (atau rangka kerja ujian), dan pepijat lebih mudah diasingkan. Semester 1 (LUAU101–LUAU104) mengajar bahasa; API enjin bermula dalam LUAU201.',
        'This boundary is also a design guide. Game logic — computing damage, deciding a winner, validating input — needs no engine and can be written as pure Luau functions. Engine code — finding players, changing parts, connecting events — should be a thin layer that calls that logic. The result: the logic can be tested outside Studio with the luau CLI (or a test framework), and bugs are easier to isolate. Semester 1 (LUAU101–LUAU104) teaches the language; the engine API starts in LUAU201.')),
    S('technical_terminology', TERMS('engine-api', 'instance', 'userdata', 'roblox-studio')),
    S('syntax_rules',
      UL(
        ['`objek.Sifat` — baca atau tulis sifat; `objek:Kaedah(…)` — panggil kaedah (sintaks Luau, objek enjin).', '`object.Property` — read or write a property; `object:Method(…)` — call a method (Luau syntax, engine object).'],
        ['`game:GetService("Nama")` — cara yang disyorkan untuk mendapatkan perkhidmatan.', '`game:GetService("Name")` — the recommended way to obtain a service.'],
        ['Kod `roblox` dalam kursus ini dikompil dengan `luau-runner --check`; ia tidak pernah dijalankan.', '`roblox` code in this course is compiled with `luau-runner --check`; it is never run.'],
      )),
    S('code_demonstration',
      CODE('pure-damage', 'luau', 'luau', ['Logik permainan dalam Luau tulen', 'Game logic in pure Luau'], `
local function applyDamage(health: number, damage: number, armor: number): number
  local reduced = damage * (1 - armor)
  return math.max(health - reduced, 0)
end

print(applyDamage(100, 40, 0.25))
print(applyDamage(20, 50, 0))
`, '70\n0'),
      EXPLAIN('pure-damage',
        ['1–4', 'Fungsi tulen: hanya nombor masuk dan keluar, tiada objek enjin. Perisai mengurangkan kerosakan secara peratusan; kesihatan tidak boleh di bawah sifar.', 'A pure function: only numbers in and out, no engine objects. Armour reduces damage by a percentage; health cannot go below zero.'],
        ['6–7', '40 × 0.75 = 30 → 70; kerosakan berlebihan dihadkan kepada 0. Dijalankan dan disahkan dengan VM Luau.', '40 × 0.75 = 30 → 70; overkill is clamped to 0. Executed and verified with the Luau VM.'])),
    S('complete_examples',
      CODE('roblox-damage', 'luau', 'roblox', ['Logik yang sama digunakan dalam Roblox (dikompil sahaja)', 'The same logic used in Roblox (compiled only)'], `
local Players = game:GetService("Players")

local function applyDamage(health: number, damage: number, armor: number): number
  return math.max(health - damage * (1 - armor), 0)
end

Players.PlayerAdded:Connect(function(player)
  player.CharacterAdded:Connect(function(character)
    local humanoid = character:WaitForChild("Humanoid")
    humanoid.Health = applyDamage(humanoid.Health, 40, 0.25)
    print(player.Name, humanoid.Health)
  end)
end)
`, undefined, {
        debug: BUG(`
local Players = game:GetService("Players")
Players.PlayerAdded:Connect(function(player)
  print(player.Name)
end
`, "example:4: Expected ')' (to close '(' at line 2), got <eof>",
          'Fungsi tanpa nama dihantar sebagai argumen kepada `Connect(`, jadi selepas `end` mesti ada `)` yang menutup panggilan. Ralat sintaks ini dikesan oleh pengkompil Luau — sama dalam Studio dan dalam semakan kursus ini — jadi ia **disahkan** walaupun kod Roblox tidak dijalankan. Dalam Studio, mesej yang sama muncul dalam Script Analysis dan tetingkap Output.',
          'The anonymous function is passed as an argument to `Connect(`, so after `end` there must be a `)` closing the call. This syntax error is detected by the Luau compiler — the same in Studio and in this course’s check — so it **is** verified even though Roblox code is not run. In Studio the same message appears in Script Analysis and the Output window.'),
      }),
      EXPLAIN('roblox-damage',
        ['1', 'Enjin: dapatkan perkhidmatan `Players`.', 'Engine: get the `Players` service.'],
        ['3–5', 'Bahasa: logik tulen yang sama seperti `pure-damage`.', 'Language: the same pure logic as `pure-damage`.'],
        ['7–8', 'Enjin: event `PlayerAdded` dan `CharacterAdded`; bahasa: fungsi tanpa nama sebagai callback.', 'Engine: the `PlayerAdded` and `CharacterAdded` events; language: anonymous functions as callbacks.'],
        ['9–11', 'Enjin: `WaitForChild` dan sifat `Health`; logik bahasa dipanggil di tengah. Dalam Studio, ini dijangka mencetak nama pemain dan 70 — **diterangkan, tidak disahkan**.', 'Engine: `WaitForChild` and the `Health` property; the language logic is called in the middle. In Studio this is expected to print the player name and 70 — **described, not verified**.']),
      CODE('engine-missing', 'luau', 'luau', ['Di luar Roblox, nama enjin ialah nil', 'Outside Roblox, engine names are nil'], `
print(game == nil, workspace == nil, Instance == nil)
print(typeof(vector.create(0, 10, 0)))
print(typeof(nil), typeof(print))
`, 'true\ttrue\ttrue\nvector\nnil\tfunction', {
        debug: BUG(`
print("server starting")
print(game.Name)
`, "example:2: attempt to index nil with 'Name'",
          'Dalam luau CLI (dan pengesahan kursus ini), `game` tidak wujud — ia global `nil` — jadi `game.Name` gagal. Baris 1 sudah dijalankan sebelum ralat. Kod yang sama dalam Studio akan mencetak nama tempat (place). Inilah sebabnya kod yang menggunakan `game` ditandakan `roblox` dan dikompil sahaja.',
          'In the luau CLI (and this course’s verification), `game` does not exist — it is a `nil` global — so `game.Name` fails. Line 1 already ran before the error. The same code in Studio would print the place’s name. This is why code that uses `game` is marked `roblox` and compiled only.'),
      }),
      EXPLAIN('engine-missing',
        ['1', 'Ketiga-tiga nama enjin tiada di sini. Dalam Studio, baris ini akan mencetak `false false false`.', 'All three engine names are absent here. In Studio, this line would print `false false false`.'],
        ['2', '`vector` ialah jenis **bahasa** Luau. Roblox mempunyai jenis enjin berasingan `Vector3` — jangan keliru.', '`vector` is a Luau **language** type. Roblox has a separate engine type `Vector3` — do not confuse them.'],
        ['3', '`typeof` wujud dalam Luau; dalam Roblox ia juga mengenali jenis enjin.', '`typeof` exists in Luau; in Roblox it also recognises engine types.'])),
    S('line_by_line',
      EXPLAIN('roblox-damage',
        ['10', 'Baris ini menggabungkan kedua-dua dunia: `humanoid.Health` (enjin) dibaca, dihantar ke `applyDamage` (bahasa), dan hasilnya ditulis kembali ke enjin.', 'This line combines both worlds: `humanoid.Health` (engine) is read, passed to `applyDamage` (language), and the result is written back to the engine.']),
      EXPLAIN('pure-damage',
        ['3', '`math.max` ialah pustaka standard Luau — tersedia di mana-mana, termasuk luau CLI.', '`math.max` is the Luau standard library — available everywhere, including the luau CLI.'])),
    S('why_this_way',
      P('Mengapa memisahkan bahasa dan enjin? Kerana dokumentasi berada di tempat berbeza (luau.org berbanding Creator Hub), ralat berbeza datang dari tempat berbeza, dan hanya logik tulen boleh diuji tanpa Studio. Pembangun profesional menulis sebanyak mungkin logik sebagai fungsi tulen dan mengujinya secara automatik.',
        'Why separate language and engine? Because documentation lives in different places (luau.org versus the Creator Hub), different errors come from different places, and only pure logic can be tested without Studio. Professional developers write as much logic as possible as pure functions and test it automatically.'),
      P('Tulis logik sebagai Luau tulen **apabila** ia hanya melibatkan nombor, string dan table; gunakan API enjin **hanya** di pinggir, di mana anda perlu berinteraksi dengan dunia permainan.', 'Write logic as pure Luau **when** it only involves numbers, strings and tables; use the engine API **only** at the edges, where you must interact with the game world.')),
    S('execution_flow',
      OL(
        ['Dalam Studio, Script dalam ServerScriptService dimulakan apabila pelayan bermula.', 'In Studio, a Script in ServerScriptService starts when the server starts.'],
        ['Baris 1 `roblox-damage` meminta perkhidmatan daripada enjin; baris 7 mendaftarkan callback.', '`roblox-damage` line 1 asks the engine for a service; line 7 registers a callback.'],
        ['Skrip "tamat" — tetapi enjin akan memanggil callback setiap kali pemain menyertai dan watak muncul.', 'The script "ends" — but the engine will call the callback every time a player joins and a character spawns.'],
      )),
    S('memory_behaviour',
      P('Objek enjin (`Player`, `Humanoid`) dimiliki oleh enjin C++; skrip hanya memegang rujukan `userdata` kepadanya. Apabila objek dimusnahkan (contohnya pemain keluar), rujukan dalam skrip masih wujud tetapi menunjuk kepada objek yang tidak aktif — satu sumber kebocoran memori dalam Roblox jika sambungan event tidak diputuskan (LUAU203).',
        'Engine objects (`Player`, `Humanoid`) are owned by the C++ engine; scripts only hold `userdata` references to them. When an object is destroyed (for example a player leaves), a reference in a script still exists but points to an inactive object — a source of memory leaks in Roblox when event connections are not disconnected (LUAU203).')),
    S('alternative_implementations',
      P('Untuk menguji logik yang biasanya menerima objek enjin, hantar table biasa yang "kelihatan sama":', 'To test logic that normally receives engine objects, pass a plain table that "looks the same":'),
      CODE('fake-humanoid', 'luau', 'luau', ['Objek tiruan dalam Luau tulen', 'A fake object in pure Luau'], `
local function heal(humanoid, amount: number)
  humanoid.Health = math.min(humanoid.Health + amount, humanoid.MaxHealth)
end

local fake = {Health = 60, MaxHealth = 100}
heal(fake, 25)
print(fake.Health)
heal(fake, 50)
print(fake.Health)
`, '85\n100'),
      EXPLAIN('fake-humanoid',
        ['1–3', '`heal` hanya menggunakan dua sifat; ia tidak peduli sama ada `humanoid` ialah objek enjin atau table.', '`heal` only uses two properties; it does not care whether `humanoid` is an engine object or a table.'],
        ['5–9', 'Table dengan sifat yang sama menggantikan `Humanoid` sebenar untuk ujian.', 'A table with the same properties replaces a real `Humanoid` for testing.'])),
    S('common_mistakes',
      UL(
        ['Mencari `Vector3`, `task.wait` atau `Instance.new` dalam dokumentasi Luau — ia dalam rujukan API enjin Roblox.', 'Looking up `Vector3`, `task.wait` or `Instance.new` in the Luau documentation — they are in the Roblox engine API reference.'],
        ['Cuba menjalankan skrip Roblox dalam luau CLI.', 'Trying to run Roblox scripts in the luau CLI.'],
        ['Menganggap contoh "dikompil sahaja" sudah diuji dalam Studio.', 'Assuming a "compiled only" example has been tested in Studio.'],
        ['Mencampurkan logik dan kod enjin sehingga tiada apa-apa boleh diuji secara berasingan.', 'Mixing logic and engine code so nothing can be tested separately.'],
      )),
    S('debugging',
      P('Ralat `attempt to index nil with \'…\'` mempunyai dua punca biasa yang berbeza. Dalam luau CLI, ia selalunya bermaksud anda menggunakan nama enjin yang tiada di luar Roblox. Dalam Studio, ia selalunya bermaksud objek enjin belum wujud atau tersalah nama — contohnya `workspace.Lava` apabila bahagian itu dinamakan "lava". Langkah pertama: tentukan sama ada nama itu milik bahasa atau enjin. Contoh berikut menunjukkan cara menulis fungsi yang selamat apabila objek tidak ditemui:',
        'The error `attempt to index nil with \'…\'` has two different common causes. In the luau CLI it usually means you used an engine name that does not exist outside Roblox. In Studio it usually means an engine object does not exist yet or is misnamed — for example `workspace.Lava` when the part is called "lava". First step: decide whether the name belongs to the language or the engine. The following example shows a function that stays safe when an object is not found:'),
      CODE('safe-lookup', 'luau', 'luau', ['Carian yang selamat terhadap nil', 'A lookup that is safe against nil'], `
local world = {Spawn = {Position = 0}, Lava = {Position = 40}}

local function distanceTo(container, name: string, from: number)
  local target = container[name]
  if target == nil then
    return nil, \`no object named {name}\`
  end
  return math.abs(target.Position - from)
end

print(distanceTo(world, "Lava", 10))
print(distanceTo(world, "lava", 10))
`, '30\nnil\tno object named lava'),
      EXPLAIN('safe-lookup',
        ['1', 'Table yang mewakili "dunia" untuk latihan.', 'A table standing in for the "world" for practice.'],
        ['3–7', 'Semak `nil` sebelum mengindeks, dan pulangkan mesej yang menyebut nama yang dicari.', 'Check for `nil` before indexing, and return a message naming what was looked for.'],
        ['8', 'Jarak dikira hanya apabila objek wujud.', 'The distance is computed only when the object exists.'],
        ['11–12', 'Huruf besar/kecil penting: "lava" tidak sama dengan "Lava".', 'Case matters: "lava" is not the same as "Lava".'])),
    S('performance',
      P('Memanggil API enjin melintasi sempadan Luau–C++ dan lebih mahal daripada operasi Luau tulen. Membaca `humanoid.Health` seribu kali dalam gelung lebih perlahan daripada membacanya sekali ke dalam local. Logik tulen dalam fungsi Luau pula dioptimumkan sepenuhnya oleh VM.',
        'Calling the engine API crosses the Luau–C++ boundary and is more expensive than pure Luau operations. Reading `humanoid.Health` a thousand times in a loop is slower than reading it once into a local. Pure logic in Luau functions, by contrast, is fully optimised by the VM.')),
    S('software_engineering',
      P('Logik yang terikat pada enjin berbanding logik tulen dengan lapisan enjin yang nipis:', 'Logic tied to the engine versus pure logic with a thin engine layer:'),
      CODE('poor-mixed-logic', 'luau', 'roblox', ['Pelaksanaan lemah: logik di dalam event (dikompil sahaja)', 'Poor implementation: logic inside the event (compiled only)'], `
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
  local stats = Instance.new("Folder")
  stats.Name = "leaderstats"
  stats.Parent = player
  local coins = Instance.new("IntValue")
  coins.Name = "Coins"
  coins.Value = if player.AccountAge > 365 then 500 elseif player.AccountAge > 30 then 200 else 50
  coins.Parent = stats
end)
`),
      EXPLAIN('poor-mixed-logic',
        ['1–8', 'Kod enjin: perkhidmatan, event, dan `Instance.new` untuk papan pendahulu.', 'Engine code: a service, an event, and `Instance.new` for the leaderboard.'],
        ['9', 'Peraturan bonus tersembunyi di tengah kod enjin — ia hanya boleh diuji dengan pemain sebenar dalam Studio.', 'The bonus rule is buried in engine code — it can only be tested with real players in Studio.'],
        ['10–11', 'Lebih banyak kod enjin.', 'More engine code.']),
      CODE('improved-pure-rule', 'luau', 'luau', ['Pelaksanaan lebih baik: peraturan tulen yang diuji', 'Improved implementation: a tested pure rule'], `
local function startingCoins(accountAgeDays: number): number
  return if accountAgeDays > 365 then 500 elseif accountAgeDays > 30 then 200 else 50
end

for _, age in {0, 31, 400} do
  print(age, startingCoins(age))
end
`, '0\t50\n31\t200\n400\t500'),
      EXPLAIN('improved-pure-rule',
        ['1–3', 'Peraturan sebagai fungsi tulen; Script Roblox hanya memanggil `startingCoins(player.AccountAge)`.', 'The rule as a pure function; the Roblox Script only calls `startingCoins(player.AccountAge)`.'],
        ['5–7', 'Peraturan diuji di luar Studio untuk ketiga-tiga cabang — dijalankan dan disahkan.', 'The rule is tested outside Studio for all three branches — executed and verified.'])),
    S('industry_use_cases',
      UL(
        ['Studio Roblox profesional menguji logik dengan rangka kerja seperti TestEZ atau Jest-Lua, di luar dunia permainan.', 'Professional Roblox studios test logic with frameworks such as TestEZ or Jest-Lua, outside the game world.'],
        ['Rojo dan Lune membolehkan kod Luau tulen dibangunkan dan diuji dengan alat luar Studio.', 'Rojo and Lune let pure Luau code be developed and tested with tools outside Studio.'],
        ['Seni bina "service + pure module" ialah corak biasa dalam permainan Roblox yang besar.', 'The "service + pure module" architecture is a common pattern in large Roblox games.'],
      )),
    S('practical_demonstration',
      OL(
        ['Senaraikan setiap nama dalam `roblox-damage` dan tandakan sama ada ia milik bahasa atau enjin.', 'List every name in `roblox-damage` and mark whether it belongs to the language or the engine.'],
        ['Tambah ujian untuk `applyDamage` dengan perisai 1.0 (kebal).', 'Add a test for `applyDamage` with armour 1.0 (invulnerable).'],
        ['Jalankan versi berpepijat `engine-missing` dan terangkan mengapa ia berjaya dalam Studio.', 'Run the buggy `engine-missing` and explain why it would succeed in Studio.'],
      ),
      WARN('Contoh bertanda "dikompil sahaja" tidak pernah dijalankan dalam Roblox Studio oleh sistem pengesahan kursus ini. Output yang ditunjukkan untuknya ialah jangkaan, bukan keputusan yang disahkan.', 'Examples marked "compiled only" have never been run in Roblox Studio by this course’s verification system. Any output shown for them is an expectation, not a verified result.', ['Status pengesahan', 'Verification status'])),
    S('mini_project',
      P('**Kedai: logik dan enjin.** Tulis logik pembelian sebagai fungsi tulen yang diuji, dan tunjukkan bagaimana Script Roblox akan memanggilnya.', '**A shop: logic and engine.** Write the purchase logic as a tested pure function, and show how a Roblox Script would call it.'),
      CODE('shop-logic', 'luau', 'luau', ['Penyelesaian contoh: logik tulen', 'Example solution: pure logic'], `
local PRICES = {sword = 300, shield = 200, potion = 50}

local function tryBuy(coins: number, item: string)
  local price = PRICES[item]
  if price == nil then return false, coins, \`unknown item {item}\` end
  if coins < price then return false, coins, \`need {price - coins} more coins\` end
  return true, coins - price, \`bought {item}\`
end

print(tryBuy(350, "sword"))
print(tryBuy(100, "shield"))
print(tryBuy(100, "bow"))
`, 'true\t50\tbought sword\nfalse\t100\tneed 100 more coins\nfalse\t100\tunknown item bow'),
      EXPLAIN('shop-logic',
        ['1', 'Harga sebagai data.', 'Prices as data.'],
        ['3–8', 'Tiga hasil: berjaya atau tidak, baki syiling baharu, dan mesej. Tiada API enjin.', 'Three results: success or not, the new coin balance, and a message. No engine API.'],
        ['10–12', 'Ketiga-tiga laluan diuji dan disahkan.', 'All three paths tested and verified.']),
      CODE('shop-engine', 'luau', 'roblox', ['Penyelesaian contoh: lapisan Roblox (dikompil sahaja)', 'Example solution: the Roblox layer (compiled only)'], `
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Shop = require(ReplicatedStorage.ShopLogic)

ReplicatedStorage.BuyItem.OnServerEvent:Connect(function(player, item)
  local coins = player.leaderstats.Coins
  local ok, newBalance, message = Shop.tryBuy(coins.Value, item)
  if ok then coins.Value = newBalance end
  print(player.Name, message)
end)
`),
      EXPLAIN('shop-engine',
        ['1–2', 'Logik tulen dimuatkan sebagai ModuleScript (kuliah 2.3).', 'The pure logic is loaded as a ModuleScript (lecture 2.3).'],
        ['4–9', 'Lapisan enjin: terima permintaan, baca dan tulis syiling, panggil logik. Ini dikompil sahaja; `BuyItem` ialah RemoteEvent yang mesti wujud dalam tempat anda.', 'The engine layer: receive the request, read and write the coins, call the logic. This is compiled only; `BuyItem` is a RemoteEvent that must exist in your place.'])),
    S('summary',
      UL(
        ['Luau ialah bahasa; Roblox menyediakan API enjin untuk bahasa itu.', 'Luau is the language; Roblox provides an engine API for it.'],
        ['Di luar Roblox, `game`, `workspace`, `Instance` ialah `nil`.', 'Outside Roblox, `game`, `workspace`, `Instance` are `nil`.'],
        ['`luau` = dijalankan dan disahkan; `roblox` = dikompil sahaja; tiada ujian Studio.', '`luau` = executed and verified; `roblox` = compiled only; no Studio testing.'],
        ['Logik tulen + lapisan enjin nipis = kod yang boleh diuji.', 'Pure logic + a thin engine layer = testable code.'],
      )),
    S('knowledge_check',
      OL(
        ['Adakah `string.split` milik bahasa atau enjin? Bagaimana dengan `task.wait`?', 'Does `string.split` belong to the language or the engine? What about `task.wait`?'],
        ['Mengapakah `print(game.Name)` gagal dalam luau CLI?', 'Why does `print(game.Name)` fail in the luau CLI?'],
        ['Apakah perbezaan antara `vector` dan `Vector3`?', 'What is the difference between `vector` and `Vector3`?'],
        ['Mengapakah ralat sintaks dalam kod Roblox boleh disahkan walaupun kod itu tidak dijalankan?', 'Why can a syntax error in Roblox code be verified even though the code is not run?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library (the language’s standard library)', url: `${LUAU}/library` },
        { title: 'Roblox Engine API reference', url: `${DOCS}/reference/engine` },
        { title: 'Roblox Creator Hub — Scripting', url: `${DOCS}/scripting` },
        { title: 'Roblox Creator Hub — Luau and Roblox globals', url: `${DOCS}/reference/engine/globals/RobloxGlobals` },
      )),
  ],
};

export const LUAU101_M1 = [LUAU101_1_1, LUAU101_1_2, LUAU101_1_3];
