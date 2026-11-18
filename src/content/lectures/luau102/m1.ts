import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU102 · Module 1 — Variables (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 1.1 local and global in Luau ──────────────────────────────────────────

export const LUAU102_1_1: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 1,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Mengisytiharkan pemboleh ubah dengan `local` dan menerangkan [[scope|skopnya]].', 'Declare variables with `local` and explain their [[scope]].'],
        ['Menerangkan apa yang berlaku apabila nama digunakan tanpa `local` (global).', 'Explain what happens when a name is used without `local` (a global).'],
        ['Menerangkan perbezaan global dalam luau CLI dan Roblox (persekitaran setiap skrip, `_G`).', 'Explain how globals differ between the luau CLI and Roblox (per-script environments, `_G`).'],
        ['Memilih `local` secara lalai dan menerangkan mengapa.', 'Choose `local` by default and explain why.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['LUAU101: menjalankan kod, `print`, komen dan blok.', 'LUAU101: running code, `print`, comments and blocks.'],
      )),
    S('introduction',
      P('Pemboleh ubah ialah nama untuk nilai. Dalam Luau, setiap pemboleh ubah sama ada **local** — wujud hanya di dalam blok di mana ia diisytiharkan — atau **global** — boleh dicapai dari mana-mana dalam skrip. Perbezaan ini kelihatan kecil, tetapi ia antara sumber pepijat yang paling biasa dalam skrip Roblox. Panduan gaya Roblox dan penganalisis Luau kedua-duanya mengesyorkan `local` untuk hampir semua perkara; kuliah ini menerangkan mengapa.',
        'A variable is a name for a value. In Luau, every variable is either **local** — existing only inside the block where it is declared — or **global** — reachable from anywhere in the script. The difference looks small, but it is one of the most common sources of bugs in Roblox scripts. The Roblox style guide and the Luau analyser both recommend `local` for nearly everything; this lecture explains why.'),
      KEY('Tulis `local` setiap kali anda mencipta pemboleh ubah baharu. Nama tanpa `local` ialah global.', 'Write `local` every time you create a new variable. A name without `local` is a global.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`local nama = nilai` mencipta pemboleh ubah yang kelihatan dari baris seterusnya hingga akhir blok.', '`local name = value` creates a variable visible from the next statement to the end of the block.'],
        ['`nama = nilai` tanpa `local` menulis global, kecuali jika local dengan nama itu sudah kelihatan.', '`name = value` without `local` writes a global, unless a local with that name is already visible.'],
        ['Membaca nama yang tidak pernah diberi nilai memberi `nil` — bukan ralat.', 'Reading a name that was never assigned gives `nil` — not an error.'],
        ['Dalam Roblox, setiap skrip mempunyai persekitaran global sendiri; `_G` ialah table berasingan yang dikongsi.', 'In Roblox, every script has its own global environment; `_G` is a separate shared table.'],
      )),
    S('detailed_theory',
      P('Pemboleh ubah local disimpan dalam **daftar** fungsi: pengkompil tahu tepat di mana setiap local berada, jadi membacanya ialah satu arahan VM. Global pula disimpan dalam table persekitaran; setiap bacaan ialah carian table mengikut nama string. Luau mengoptimumkan carian global dengan cache, tetapi local tetap lebih pantas — dan lebih penting, lebih **selamat**. Local tidak boleh diubah oleh kod di luar bloknya, jadi apabila anda membaca fungsi, anda boleh melihat setiap tempat pemboleh ubah itu berubah. Global boleh diubah oleh mana-mana baris dalam skrip, dan nama yang tersalah eja secara senyap mencipta global baharu yang bernilai `nil`.',
        'Local variables live in the function’s **registers**: the compiler knows exactly where each local is, so reading it is one VM instruction. Globals live in an environment table; every read is a table lookup by string name. Luau optimises global lookups with caching, but locals are still faster — and, more importantly, **safer**. A local cannot be changed by code outside its block, so when you read a function you can see every place the variable changes. A global can be changed by any line in the script, and a misspelled name silently creates a new global whose value is `nil`.'),
      P('Roblox menambah satu lapisan: setiap Script, LocalScript dan ModuleScript mempunyai **persekitaran global sendiri**. Global yang ditulis dalam satu skrip tidak kelihatan dalam skrip lain. Untuk perkongsian sebenar, Roblox menyediakan table `_G` dan `shared` — tetapi amalan yang disyorkan ialah ModuleScript (LUAU101 2.3), kerana `_G` tidak mempunyai struktur atau jenis. Dalam luau CLI (dan pengesahan kursus ini), hanya ada satu skrip, dan `_G` menunjuk ke persekitaran global itu sendiri — jadi `_G.x` dan `x` adalah sama. Inilah satu lagi contoh di mana tingkah laku enjin Roblox berbeza daripada bahasa tulen.',
        'Roblox adds one layer: every Script, LocalScript and ModuleScript has its **own global environment**. A global written in one script is not visible in another. For real sharing, Roblox provides the `_G` and `shared` tables — but the recommended practice is a ModuleScript (LUAU101 2.3), because `_G` has no structure or types. In the luau CLI (and this course’s verification) there is only one script, and `_G` points to the global environment itself — so `_G.x` and `x` are the same. This is another case where the Roblox engine’s behaviour differs from the pure language.')),
    S('technical_terminology', TERMS('variable', 'scope', 'block', 'nil')),
    S('syntax_rules',
      UL(
        ['`local nama = nilai` · `local nama` (bermula `nil`) · `local a, b = 1, 2`.', '`local name = value` · `local name` (starts as `nil`) · `local a, b = 1, 2`.'],
        ['Assignment kepada local sedia ada: `nama = nilai` (tanpa `local` kali kedua).', 'Assigning to an existing local: `name = value` (without `local` the second time).'],
        ['Fungsi local: `local function nama() … end`.', 'Local functions: `local function name() … end`.'],
      )),
    S('code_demonstration',
      CODE('local-vs-global', 'luau', 'luau', ['Local dan global', 'Locals and globals'], `
local coins = 50
bonus = 10

local function award()
  coins += bonus
  return coins
end

print(award())
print(coins, bonus)
print(rawget(_G, "bonus"), rawget(_G, "coins"))
`, '60\n60\t10\n10\tnil'),
      EXPLAIN('local-vs-global',
        ['1', '`coins` ialah local skrip.', '`coins` is a script local.'],
        ['2', '`bonus` tanpa `local` → global.', '`bonus` without `local` → a global.'],
        ['4–7', 'Fungsi boleh membaca dan menulis kedua-duanya; `coins += bonus` menukar local luar.', 'The function can read and write both; `coins += bonus` changes the outer local.'],
        ['9–10', '50 + 10 = 60.', '50 + 10 = 60.'],
        ['11', '`rawget(_G, …)` menunjukkan hanya `bonus` berada dalam table global. Local tidak pernah masuk ke `_G`.', '`rawget(_G, …)` shows that only `bonus` is in the global table. Locals never go into `_G`.'])),
    S('complete_examples',
      CODE('block-scope', 'luau', 'luau', ['Skop blok', 'Block scope'], `
local level = 3
local reward = 0

if level >= 3 then
  local multiplier = 2
  reward = 100 * multiplier
end

print(reward)
print(multiplier)
`, '200\nnil', {
        debug: BUG(`
do
  local bonus = 10
end
print(bonus + 1)
`, 'example:4: attempt to perform arithmetic (add) on nil and number',
          '`bonus` ialah local blok `do` dan hilang pada `end`. Pada baris 4, nama `bonus` merujuk global yang tidak wujud (`nil`). Luau tidak memberi amaran semasa runtime — penganalisis Studio akan menandakan `bonus` sebagai global tidak diketahui (diterangkan). Isytiharkan `local bonus` di luar blok jika anda memerlukannya selepas itu.',
          '`bonus` is a local of the `do` block and disappears at `end`. On line 4, the name `bonus` refers to a global that does not exist (`nil`). Luau gives no warning at run time — Studio’s analyser would flag `bonus` as an unknown global (described). Declare `local bonus` outside the block if you need it afterwards.'),
      }),
      EXPLAIN('block-scope',
        ['1–2', 'Dua local peringkat skrip.', 'Two script-level locals.'],
        ['4–7', '`multiplier` wujud hanya di dalam blok `if`; `reward` (luar) diberi nilai tanpa `local`.', '`multiplier` exists only inside the `if` block; `reward` (outer) is assigned without `local`.'],
        ['9–10', '`reward` kekal 200; `multiplier` di luar blok ialah global `nil`.', '`reward` stays 200; `multiplier` outside the block is a `nil` global.']),
      CODE('typo-global', 'luau', 'luau', ['Salah eja mencipta global', 'A typo creates a global'], `
local playerHealth = 100

local function takeDamage(amount: number)
  playerHealth -= amount
end

takeDamage(30)
takeDamage(25)
print(playerHealth)
`, '45', {
        debug: BUG(`
local playerHealth = 100
local function takeDamage(amount: number)
  playerHelth = playerHealth - amount
end
takeDamage(30)
takeDamage(25)
print(playerHealth)
error(\`expected 45, got {playerHealth}\`)
`, 'example:8: expected 45, got 100',
          '`playerHelth` (tanpa "a") tersalah eja di sebelah kiri assignment, jadi setiap panggilan menulis ke **global baharu** dan `playerHealth` tidak pernah berubah. Tiada ralat runtime langsung — program mencetak 100. Baris 8 menukar keputusan yang salah kepada ralat supaya kegagalan disahkan. Dengan `-=`, nama ditulis sekali sahaja, jadi salah eja ini lebih sukar berlaku; penganalisis Studio juga memberi amaran global.',
          '`playerHelth` (missing "a") is misspelled on the left of the assignment, so every call writes to a **new global** and `playerHealth` never changes. There is no runtime error at all — the program prints 100. Line 8 turns the wrong result into an error so the failure is verified. With `-=`, the name is written only once, making this typo harder; Studio’s analyser also warns about the global.'),
      }),
      EXPLAIN('typo-global',
        ['1', 'Keadaan dalam local.', 'State in a local.'],
        ['3–5', '`-=` membaca dan menulis local yang sama — nama ditaip sekali.', '`-=` reads and writes the same local — the name is typed once.'],
        ['7–9', '100 − 30 − 25 = 45.', '100 − 30 − 25 = 45.'])),
    S('line_by_line',
      EXPLAIN('local-vs-global',
        ['5', 'Di dalam fungsi, `coins` ialah **upvalue** (local fungsi luar) dan `bonus` ialah global. Pengkompil memutuskan yang mana dengan melihat sama ada `local coins` kelihatan di atas.', 'Inside the function, `coins` is an **upvalue** (an outer local) and `bonus` is a global. The compiler decides which by checking whether `local coins` is visible above.']),
      EXPLAIN('block-scope',
        ['6', 'Tiada `local` di sini: kita mahu menukar `reward` luar, bukan mencipta yang baharu.', 'No `local` here: we want to change the outer `reward`, not create a new one.'])),
    S('why_this_way',
      P('Mengapa `local` secara lalai? Kerana skop kecil menjadikan kod mudah difahami (anda tahu di mana nilai boleh berubah), mengelakkan perlanggaran nama, membolehkan pengutip sampah membebaskan memori lebih awal, dan lebih pantas. Global hanya berguna untuk kes khas, dan dalam Roblox ModuleScript ialah alternatif yang lebih baik.',
        'Why `local` by default? Because small scopes make code easy to understand (you know where a value can change), avoid name collisions, let the garbage collector free memory earlier, and are faster. Globals are only useful for special cases, and in Roblox a ModuleScript is a better alternative.'),
      P('Gunakan global **hampir tidak pernah**. Jika anda mahu nilai dikongsi antara fungsi, isytiharkan local di bahagian atas skrip; antara skrip, gunakan ModuleScript.', 'Use globals **almost never**. If you want a value shared between functions, declare a local at the top of the script; between scripts, use a ModuleScript.')),
    S('execution_flow',
      OL(
        ['`local coins = 50` → daftar baharu; `bonus = 10` → `_G.bonus = 10`.', '`local coins = 50` → a new register; `bonus = 10` → `_G.bonus = 10`.'],
        ['`award()` → `coins` dibaca daripada upvalue, `bonus` daripada table global → 60.', '`award()` → `coins` is read from the upvalue, `bonus` from the global table → 60.'],
        ['`rawget(_G, "coins")` → `nil`, kerana local tidak pernah disimpan dalam `_G`.', '`rawget(_G, "coins")` → `nil`, because locals are never stored in `_G`.'],
      )),
    S('memory_behaviour',
      P('Local dibebaskan apabila bloknya tamat (kecuali jika closure masih merujuknya). Global kekal selagi skrip hidup — dalam Roblox, selagi pelayan berjalan. Table besar yang disimpan dalam global tidak pernah dikutip; simpan dalam local supaya ia boleh dibebaskan apabila tidak lagi diperlukan.',
        'Locals are released when their block ends (unless a closure still refers to them). Globals live as long as the script — in Roblox, as long as the server runs. A large table stored in a global is never collected; keep it in a local so it can be freed when no longer needed.')),
    S('alternative_implementations',
      P('Untuk berkongsi keadaan antara beberapa fungsi tanpa global, letakkan keadaan dalam satu table local:', 'To share state between several functions without globals, keep the state in one local table:'),
      CODE('state-table', 'luau', 'luau', ['Keadaan dalam table local', 'State in a local table'], `
local state = {coins = 0, gems = 0}

local function addCoins(n: number) state.coins += n end
local function addGems(n: number) state.gems += n end

addCoins(120)
addGems(3)
addCoins(30)
print(state.coins, state.gems)
`, '150\t3'),
      EXPLAIN('state-table',
        ['1', 'Satu local memegang semua keadaan berkaitan.', 'One local holds all related state.'],
        ['3–4', 'Fungsi local mengubah medan table — tiada global.', 'Local functions change table fields — no globals.'],
        ['6–9', 'Keadaan dikemas kini dan dicetak.', 'The state is updated and printed.'])),
    S('common_mistakes',
      UL(
        ['Terlupa `local` pada pemboleh ubah baharu.', 'Forgetting `local` on a new variable.'],
        ['Menulis `local` sekali lagi apabila mengemas kini pemboleh ubah luar (mencipta bayangan).', 'Writing `local` again when updating an outer variable (creating a shadow).'],
        ['Menjangka global satu skrip Roblox kelihatan dalam skrip lain.', 'Expecting one Roblox script’s globals to be visible in another.'],
        ['Menggunakan `_G` untuk perkongsian dan bukannya ModuleScript.', 'Using `_G` for sharing instead of a ModuleScript.'],
      )),
    S('debugging',
      P('Pepijat skop biasanya tidak menghasilkan ralat di tempat ia dibuat: nama yang tersalah eja hanya menjadi `nil`, dan ralat muncul kemudian dalam aritmetik atau indeks. Apabila mesej menyebut `nil` untuk pemboleh ubah yang anda pasti mempunyai nilai, semak tiga perkara: ejaan, sama ada local diisytiharkan dalam blok yang sudah tamat, dan sama ada `local` tambahan mencipta bayangan. Fungsi kecil berikut membantu mencari global yang tidak disengajakan:',
        'Scope bugs usually produce no error where they are made: a misspelled name just becomes `nil`, and the error appears later in arithmetic or indexing. When a message mentions `nil` for a variable you are sure has a value, check three things: the spelling, whether the local was declared in a block that has already ended, and whether an extra `local` created a shadow. The small function below helps find accidental globals:'),
      CODE('find-globals', 'luau', 'luau', ['Mencari global yang tidak disengajakan', 'Finding accidental globals'], `
local known = {}
for name in _G do known[name] = true end

local total = 0
counter = 1
totl = total + 5

local found = {}
for name in _G do
  if not known[name] then table.insert(found, name) end
end
table.sort(found)
print("new globals:", table.concat(found, ", "))
`, 'new globals:\tcounter, totl'),
      EXPLAIN('find-globals',
        ['1–2', 'Rekod nama global yang sedia ada (fungsi pustaka standard).', 'Record the existing global names (standard library functions).'],
        ['4–6', 'Satu local, satu global sengaja, dan satu global akibat salah eja (`totl`).', 'One local, one deliberate global, and one global caused by a typo (`totl`).'],
        ['8–13', 'Senaraikan global baharu. Dalam luau CLI, `_G` ialah persekitaran global; dalam Roblox, teknik ini tidak berfungsi kerana `_G` ialah table berasingan — gunakan Script Analysis di sana.', 'List the new globals. In the luau CLI, `_G` is the global environment; in Roblox this technique does not work because `_G` is a separate table — use Script Analysis there.'])),
    S('performance',
      P('Membaca local ialah satu arahan daftar; membaca global memerlukan carian table (walaupun Luau mempercepatnya dengan cache). Dalam gelung panas, perbezaan boleh diukur. Itulah sebabnya kod Roblox berprestasi tinggi menyalin fungsi yang kerap digunakan ke local: `local floor = math.floor`.',
        'Reading a local is one register instruction; reading a global needs a table lookup (although Luau speeds it up with caching). In hot loops, the difference is measurable. That is why high-performance Roblox code copies frequently used functions into locals: `local floor = math.floor`.')),
    S('software_engineering',
      P('Keadaan global berbanding local yang dikapsulkan:', 'Global state versus encapsulated locals:'),
      CODE('poor-globals-score', 'luau', 'luau', ['Pelaksanaan lemah: semuanya global', 'Poor implementation: everything global'], `
score = 0
multiplier = 2

function addPoints(n)
  score = score + n * multiplier
end

addPoints(10)
multiplier = 100
addPoints(1)
print(score)
`, '120'),
      EXPLAIN('poor-globals-score',
        ['1–6', 'Keadaan dan fungsi semuanya global.', 'State and the function are all global.'],
        ['8–11', 'Mana-mana kod boleh menukar `multiplier` — di sini satu baris jauh menukarnya kepada 100, dan skor melonjak. Mencari siapa yang menukarnya dalam skrip besar adalah sukar.', 'Any code can change `multiplier` — here a distant line changes it to 100, and the score jumps. Finding who changed it in a large script is hard.']),
      CODE('improved-local-score', 'luau', 'luau', ['Pelaksanaan lebih baik: local dan pemalar', 'Improved implementation: locals and a constant'], `
local MULTIPLIER = 2
local score = 0

local function addPoints(n: number)
  score += n * MULTIPLIER
end

addPoints(10)
addPoints(1)
print(score)
`, '22'),
      EXPLAIN('improved-local-score',
        ['1–2', 'Pemalar dan keadaan local.', 'A local constant and state.'],
        ['4–6', 'Fungsi local; satu-satunya tempat skor berubah.', 'A local function; the only place the score changes.'],
        ['8–10', 'Hasil yang boleh diramal: 20 + 2.', 'A predictable result: 20 + 2.'])),
    S('industry_use_cases',
      UL(
        ['Panduan gaya Roblox mewajibkan `local` untuk semua pemboleh ubah dan fungsi.', 'The Roblox style guide requires `local` for all variables and functions.'],
        ['Linter (Selene, luau-analyze) dalam CI menolak global yang tidak disengajakan.', 'Linters (Selene, luau-analyze) in CI reject accidental globals.'],
        ['Kod enjin permainan berprestasi tinggi menyalin fungsi pustaka ke local di bahagian atas fail.', 'High-performance game code copies library functions into locals at the top of the file.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah `local` pada baris 2 `local-vs-global` dan ramalkan output baris 11.', 'Add `local` to line 2 of `local-vs-global` and predict the output of line 11.'],
        ['Dalam `block-scope`, tukar `reward = …` kepada `local reward = …` dan jelaskan hasilnya.', 'In `block-scope`, change `reward = …` to `local reward = …` and explain the result.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Dompet pemain tanpa global.** Tulis skrip yang mengurus syiling dan permata dengan fungsi local, menolak perbelanjaan melebihi baki, dan membuktikan tiada global dicipta.', '**A player wallet without globals.** Write a script that manages coins and gems with local functions, rejects spending beyond the balance, and proves no globals were created.'),
      CODE('wallet-no-globals', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local before = 0
for _ in _G do before += 1 end

local wallet = {coins = 100, gems = 5}

local function spend(currency: string, amount: number): boolean
  local balance = wallet[currency]
  if balance == nil or balance < amount then
    return false
  end
  wallet[currency] = balance - amount
  return true
end

print(spend("coins", 40), spend("gems", 10), spend("stars", 1))
print(wallet.coins, wallet.gems)

local after = 0
for _ in _G do after += 1 end
print("globals added:", after - before)
`, 'true\tfalse\tfalse\n60\t5\nglobals added:\t0'),
      EXPLAIN('wallet-no-globals',
        ['1–2', 'Kira global sebelum kod kita.', 'Count the globals before our code.'],
        ['4', 'Keadaan dompet dalam satu local.', 'The wallet state in one local.'],
        ['6–13', 'Fungsi local mengesahkan mata wang dan baki sebelum menolak.', 'A local function validates the currency and balance before deducting.'],
        ['15–16', 'Satu perbelanjaan berjaya; dua ditolak.', 'One purchase succeeds; two are rejected.'],
        ['18–20', 'Kira semula: tiada global baharu dicipta.', 'Count again: no new globals were created.'])),
    S('summary',
      UL(
        ['`local` mencipta pemboleh ubah dengan skop blok; tanpa `local` ialah global.', '`local` creates a block-scoped variable; without `local` it is a global.'],
        ['Global yang tidak wujud bernilai `nil` — salah eja tidak menimbulkan ralat serta-merta.', 'Non-existent globals are `nil` — typos raise no immediate error.'],
        ['Dalam Roblox, global adalah setiap skrip; `_G` ialah table dikongsi yang berasingan.', 'In Roblox, globals are per script; `_G` is a separate shared table.'],
        ['Gunakan `local` secara lalai; kongsi melalui table local atau ModuleScript.', 'Use `local` by default; share through local tables or ModuleScripts.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah nilai pemboleh ubah global yang tidak pernah diberi nilai?', 'What is the value of a global that was never assigned?'],
        ['Mengapakah `rawget(_G, "coins")` memberi `nil` untuk local `coins`?', 'Why does `rawget(_G, "coins")` give `nil` for the local `coins`?'],
        ['Bolehkah global dalam satu Script Roblox dibaca oleh Script lain?', 'Can a global in one Roblox Script be read by another Script?'],
        ['Bagaimanakah `-=` mengurangkan risiko salah eja?', 'How does `-=` reduce the risk of typos?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax', url: `${LUAU}/syntax` },
        { title: 'Roblox Creator Hub — Variables and scope', url: `${DOCS}/luau/scope` },
        { title: 'Roblox Lua Style Guide', url: 'https://roblox.github.io/lua-style-guide/' },
        { title: 'Roblox globals — _G and shared', url: `${DOCS}/reference/engine/globals/RobloxGlobals#_G` },
      )),
  ],
};

// ─── 1.2 Assignment and multiple assignment ────────────────────────────────

export const LUAU102_1_2: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 1,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan assignment tunggal dan [[multiple-assignment|berbilang]].', 'Use single and [[multiple-assignment|multiple assignment]].'],
        ['Meramal hasil apabila bilangan nama dan nilai tidak sepadan.', 'Predict the result when the number of names and values do not match.'],
        ['Menukar dua nilai tanpa pemboleh ubah sementara.', 'Swap two values without a temporary variable.'],
        ['Menerima beberapa nilai pulangan daripada fungsi.', 'Receive several return values from a function.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1: `local` dan global.', 'Lecture 1.1: `local` and globals.'],
      )),
    S('introduction',
      P('Assignment memberi nilai kepada pemboleh ubah. Luau, seperti Lua, membenarkan **beberapa** pemboleh ubah diberi nilai dalam satu pernyataan: `local x, y = 10, 20`. Ciri ini lebih daripada kependekan: ia membolehkan pertukaran dua nilai dalam satu baris, dan ia ialah cara anda menerima beberapa nilai yang dipulangkan oleh fungsi — sesuatu yang kerap berlaku dalam kod permainan, contohnya kedudukan `x, y` atau keputusan `berjaya, mesej`.',
        'Assignment gives a value to a variable. Luau, like Lua, lets **several** variables be assigned in one statement: `local x, y = 10, 20`. This is more than a shortcut: it allows swapping two values in one line, and it is how you receive several values returned by a function — something that happens often in game code, for example an `x, y` position or a `success, message` result.'),
      KEY('Senarai kanan dinilai sepenuhnya dahulu, kemudian diberikan dari kiri ke kanan. Nama tambahan → `nil`; nilai tambahan → dibuang.', 'The right-hand list is fully evaluated first, then assigned left to right. Extra names → `nil`; extra values → discarded.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`a, b = 1, 2` — nilai pertama ke nama pertama.', '`a, b = 1, 2` — the first value to the first name.'],
        ['Lebih banyak nama → yang tiada nilai menjadi `nil`.', 'More names → those without a value become `nil`.'],
        ['Lebih banyak nilai → yang tambahan dibuang (tetapi masih dinilai).', 'More values → the extras are discarded (but still evaluated).'],
        ['`a, b = b, a` menukar nilai kerana sebelah kanan dinilai sepenuhnya dahulu.', '`a, b = b, a` swaps values because the right side is fully evaluated first.'],
        ['Panggilan fungsi terakhir dalam senarai mengembang kepada semua nilai pulangannya.', 'A function call that is last in the list expands to all of its return values.'],
      )),
    S('detailed_theory',
      P('Assignment berbilang berlaku dalam dua fasa. Dalam fasa pertama, setiap ungkapan di sebelah kanan dinilai dan hasilnya disimpan sementara. Dalam fasa kedua, nilai-nilai itu diberikan kepada sasaran di sebelah kiri. Kerana nilai lama dibaca **sebelum** sebarang assignment berlaku, `a, b = b, a` menukar nilai dengan betul — tiada pemboleh ubah sementara diperlukan. Bilangan nilai dilaraskan kepada bilangan nama: jika kurang, `nil` ditambah; jika lebih, yang tambahan dibuang. Peraturan ini sama seperti Lua 5.1 dan seterusnya.',
        'Multiple assignment happens in two phases. In the first, every expression on the right is evaluated and its result stored temporarily. In the second, those values are assigned to the targets on the left. Because the old values are read **before** any assignment happens, `a, b = b, a` swaps correctly — no temporary variable is needed. The number of values is adjusted to the number of names: if there are fewer, `nil` is added; if more, the extras are discarded. This rule is the same as in Lua 5.1 onwards.'),
      P('Interaksi dengan fungsi adalah penting. Jika panggilan fungsi ialah item **terakhir** dalam senarai kanan, semua nilai pulangannya digunakan: `local ok, message = check()` menerima dua. Jika panggilan berada di tempat lain, ia hanya menyumbang **satu** nilai. Satu kehalusan: susunan assignment kepada sasaran yang bergantung antara satu sama lain (seperti `i, t[i] = i + 1, "x"`) tidak dijamin oleh spesifikasi bahasa — jangan tulis kod yang bergantung padanya. Akhir sekali, dalam pengisytiharan `local a, b = …`, nama-nama baharu belum kelihatan di sebelah kanan, jadi `local a, b = 1, a` membaca `a` yang **lama** (biasanya global `nil`).',
        'The interaction with functions matters. If a function call is the **last** item in the right-hand list, all of its return values are used: `local ok, message = check()` receives two. If the call is anywhere else, it contributes only **one** value. One subtlety: the order of assignment to targets that depend on each other (such as `i, t[i] = i + 1, "x"`) is not guaranteed by the language specification — do not write code that relies on it. Finally, in a `local a, b = …` declaration the new names are not yet visible on the right, so `local a, b = 1, a` reads the **old** `a` (usually a `nil` global).')),
    S('technical_terminology', TERMS('multiple-assignment', 'variable', 'value-adjustment', 'function')),
    S('syntax_rules',
      UL(
        ['`local a, b, c = 1, 2, 3` · `a, b = b, a` · `local ok, msg = f()`.', '`local a, b, c = 1, 2, 3` · `a, b = b, a` · `local ok, msg = f()`.'],
        ['Sasaran boleh menjadi medan: `t.x, t.y = 0, 0`.', 'Targets can be fields: `t.x, t.y = 0, 0`.'],
        ['`_` untuk nilai yang tidak diperlukan: `local _, second = f()`.', '`_` for unwanted values: `local _, second = f()`.'],
      )),
    S('code_demonstration',
      CODE('multi-assign-basics', 'luau', 'luau', ['Asas assignment berbilang', 'Multiple assignment basics'], `
local x, y, z = 10, 20
print(x, y, z)

local a, b = 1, 2, 3
print(a, b)

local left, right = "L", "R"
left, right = right, left
print(left, right)
`, '10\t20\tnil\n1\t2\nR\tL'),
      EXPLAIN('multi-assign-basics',
        ['1–2', 'Tiga nama, dua nilai: `z` menjadi `nil`.', 'Three names, two values: `z` becomes `nil`.'],
        ['4–5', 'Dua nama, tiga nilai: 3 dibuang.', 'Two names, three values: 3 is discarded.'],
        ['7–9', 'Pertukaran: sebelah kanan ("R", "L") dinilai dahulu, kemudian diberikan.', 'A swap: the right side ("R", "L") is evaluated first, then assigned.'])),
    S('complete_examples',
      CODE('function-returns', 'luau', 'luau', ['Menerima nilai pulangan berbilang', 'Receiving multiple return values'], `
local function gridPosition(index: number, width: number)
  local row = (index - 1) // width + 1
  local col = (index - 1) % width + 1
  return row, col
end

local r, c = gridPosition(7, 3)
print(r, c)
local onlyRow = gridPosition(5, 3)
print(onlyRow)
local _, onlyCol = gridPosition(5, 3)
print(onlyCol)
`, '3\t1\n2\n2', {
        debug: BUG(`
local function bounds()
  return 1, 100
end
local low, high, step = bounds()
print(\`{low} to {high} step {step}\`)
local count = (high - low) // step
`, 'example:6: attempt to perform arithmetic (idiv) on number and nil',
          'Fungsi memulangkan **dua** nilai tetapi tiga nama diberikan, jadi `step` ialah `nil`. Baris 5 masih berjalan (interpolasi mencetak "nil"), tetapi aritmetik pada baris 6 gagal. Luau menyebut operasi (`idiv` untuk `//`) dan jenis kedua-dua operand. Pastikan bilangan nama sepadan dengan bilangan pulangan, atau beri lalai: `step = step or 1`.',
          'The function returns **two** values but three names are given, so `step` is `nil`. Line 5 still runs (interpolation prints "nil"), but the arithmetic on line 6 fails. Luau names the operation (`idiv` for `//`) and both operand types. Make the number of names match the number of returns, or give a default: `step = step or 1`.'),
      }),
      EXPLAIN('function-returns',
        ['1–5', 'Tukar indeks 1-berasaskan kepada baris dan lajur dalam grid dengan `//` dan `%`; dua nilai dipulangkan.', 'Convert a 1-based index into a row and column in a grid with `//` and `%`; two values are returned.'],
        ['7–8', 'Indeks 7 dalam grid 3 lebar: baris 3, lajur 1.', 'Index 7 in a 3-wide grid: row 3, column 1.'],
        ['9–10', 'Satu nama: hanya baris diterima.', 'One name: only the row is received.'],
        ['11–12', '`_` membuang baris; hanya lajur disimpan.', '`_` discards the row; only the column is kept.']),
      CODE('field-assign', 'luau', 'luau', ['Assignment berbilang kepada medan table', 'Multiple assignment to table fields'], `
local player = {x = 0, y = 0, lives = 3}

player.x, player.y = 12, -4
player.lives, player.x = player.lives - 1, player.x + 1

print(player.x, player.y, player.lives)
`, '13\t-4\t2', {
        debug: BUG(`
local player = {x = 0, y = 0}
local dx, dy = 5
player.x, player.y = player.x + dx, player.y + dy
`, 'example:3: attempt to perform arithmetic (add) on number and nil',
          '`local dx, dy = 5` memberi `dx = 5` dan `dy = nil`. Baris 3 menilai seluruh sebelah kanan dahulu; `player.y + dy` gagal, jadi **tiada** medan berubah — kedua-dua assignment dibatalkan bersama. Berikan kedua-dua nilai: `local dx, dy = 5, 0`.',
          '`local dx, dy = 5` gives `dx = 5` and `dy = nil`. Line 3 evaluates the whole right side first; `player.y + dy` fails, so **no** field changes — both assignments are abandoned together. Provide both values: `local dx, dy = 5, 0`.'),
      }),
      EXPLAIN('field-assign',
        ['1', 'Table dengan tiga medan.', 'A table with three fields.'],
        ['3', 'Dua medan diberi nilai serentak.', 'Two fields assigned at once.'],
        ['4', 'Sebelah kanan menggunakan nilai **lama**: `lives` 3 − 1 dan `x` 12 + 1.', 'The right side uses the **old** values: `lives` 3 − 1 and `x` 12 + 1.'],
        ['6', 'Keputusan akhir.', 'The final result.'])),
    S('line_by_line',
      EXPLAIN('multi-assign-basics',
        ['8', 'Tanpa assignment berbilang, pertukaran memerlukan tiga baris: `local tmp = left; left = right; right = tmp`.', 'Without multiple assignment, a swap needs three lines: `local tmp = left; left = right; right = tmp`.']),
      EXPLAIN('function-returns',
        ['2', '`(index - 1) // width` — tolak 1 dahulu kerana indeks Luau bermula pada 1, kemudian tambah 1 kepada hasil.', '`(index - 1) // width` — subtract 1 first because Luau indices start at 1, then add 1 to the result.'])),
    S('why_this_way',
      P('Mengapa Luau menyokong assignment berbilang? Kerana nilai pulangan berbilang ialah cara semula jadi untuk fungsi mengembalikan hasil yang berkaitan (`row, col`, `ok, err`) tanpa membina table, dan assignment berbilang ialah cara semula jadi untuk menerimanya. Pertukaran satu baris ialah bonus yang berguna dalam algoritma isihan dan permainan.',
        'Why does Luau support multiple assignment? Because multiple return values are the natural way for a function to give back related results (`row, col`, `ok, err`) without building a table, and multiple assignment is the natural way to receive them. The one-line swap is a useful bonus in sorting algorithms and games.'),
      P('Gunakan assignment berbilang **apabila** nilai berkaitan (koordinat, pasangan hasil); gunakan baris berasingan **apabila** nilai tidak berkaitan, supaya setiap baris jelas.', 'Use multiple assignment **when** the values are related (coordinates, result pairs); use separate lines **when** they are unrelated, so each line stays clear.')),
    S('execution_flow',
      OL(
        ['`player.lives, player.x = player.lives - 1, player.x + 1`.', '`player.lives, player.x = player.lives - 1, player.x + 1`.'],
        ['Fasa 1: nilai `player.lives - 1` (2) dan `player.x + 1` (13) dikira menggunakan nilai lama.', 'Phase 1: `player.lives - 1` (2) and `player.x + 1` (13) are computed from the old values.'],
        ['Fasa 2: 2 → `player.lives`, 13 → `player.x`.', 'Phase 2: 2 → `player.lives`, 13 → `player.x`.'],
      )),
    S('memory_behaviour',
      P('Nilai sementara fasa pertama disimpan dalam daftar VM, bukan dalam table, jadi assignment berbilang tidak memperuntukkan memori heap. Pertukaran `a, b = b, a` sama murahnya dengan dua assignment biasa.',
        'The temporary values of the first phase are kept in VM registers, not in a table, so multiple assignment allocates no heap memory. The swap `a, b = b, a` is as cheap as two ordinary assignments.')),
    S('alternative_implementations',
      P('Pulangkan table apabila hasilnya banyak atau bernama — pemanggil membaca mengikut nama dan bukannya kedudukan:', 'Return a table when there are many or named results — the caller reads by name instead of by position:'),
      CODE('named-result', 'luau', 'luau', ['Hasil bernama dalam table', 'Named results in a table'], `
local function analyse(scores: {number})
  local best, worst, sum = -math.huge, math.huge, 0
  for _, s in scores do
    best, worst, sum = math.max(best, s), math.min(worst, s), sum + s
  end
  return {best = best, worst = worst, average = sum / #scores}
end

local r = analyse({70, 85, 55})
print(r.best, r.worst, r.average)
`, '85\t55\t70'),
      EXPLAIN('named-result',
        ['1–2', 'Tiga pengumpul dimulakan dengan assignment berbilang.', 'Three accumulators initialised with multiple assignment.'],
        ['3–5', 'Ketiga-tiganya dikemas kini dalam satu pernyataan.', 'All three updated in one statement.'],
        ['6', 'Table bernama dipulangkan.', 'A named table is returned.'],
        ['9–10', 'Akses mengikut nama: tiada keperluan mengingati susunan.', 'Access by name: no need to remember the order.'])),
    S('common_mistakes',
      UL(
        ['Memberi lebih banyak nama daripada nilai dan terlupa bahawa yang tambahan `nil`.', 'Giving more names than values and forgetting the extras are `nil`.'],
        ['Menulis `local a = 1, 2` dan menjangka table.', 'Writing `local a = 1, 2` and expecting a table.'],
        ['Menukar dengan tiga baris dan tersalah susunan.', 'Swapping with three lines and getting the order wrong.'],
        ['Bergantung pada susunan assignment kepada sasaran yang saling bergantung.', 'Relying on the assignment order of mutually dependent targets.'],
      )),
    S('debugging',
      P('Apabila salah satu nilai dalam assignment berbilang ialah `nil` secara tidak dijangka, cetak senarai kanan terus — `print(f())` menunjukkan setiap nilai yang dipulangkan. Jika fungsi memulangkan nilai yang berbeza pada laluan berbeza (contohnya satu nilai pada kegagalan dan dua pada kejayaan), pastikan setiap laluan memulangkan bilangan yang sama. Contoh berikut menunjukkan fungsi yang konsisten:',
        'When one of the values in a multiple assignment is unexpectedly `nil`, print the right-hand list directly — `print(f())` shows every returned value. If a function returns different numbers of values on different paths (for example one on failure and two on success), make every path return the same count. The following example shows a consistent function:'),
      CODE('consistent-returns', 'luau', 'luau', ['Bilangan pulangan yang konsisten', 'A consistent number of returns'], `
local function parseSize(text: string)
  local w, h = string.match(text, "^(%d+)x(%d+)$")
  if w == nil then
    return 0, 0, \`bad size "{text}"\`
  end
  return tonumber(w), tonumber(h), nil
end

print(parseSize("16x9"))
print(parseSize("big"))
`, '16\t9\tnil\n0\t0\tbad size "big"'),
      EXPLAIN('consistent-returns',
        ['1–2', 'Corak dengan dua tangkapan.', 'A pattern with two captures.'],
        ['3–5', 'Kegagalan: tiga nilai — lebar dan tinggi lalai, dan mesej.', 'Failure: three values — default width and height, and a message.'],
        ['6', 'Kejayaan: tiga nilai juga, dengan mesej `nil`.', 'Success: three values too, with a `nil` message.'],
        ['9–10', 'Pemanggil sentiasa menerima tiga nilai.', 'The caller always receives three values.'])),
    S('performance',
      P('Assignment berbilang tidak lebih perlahan daripada assignment berasingan, dan memulangkan beberapa nilai lebih murah daripada memulangkan table (tiada peruntukan). Gunakan table hanya apabila kejelasan nama lebih penting daripada kos kecil peruntukan.',
        'Multiple assignment is no slower than separate assignments, and returning several values is cheaper than returning a table (no allocation). Use a table only when the clarity of names matters more than the small allocation cost.')),
    S('software_engineering',
      P('Pertukaran dengan pemboleh ubah sementara berbanding assignment berbilang:', 'A swap with a temporary variable versus multiple assignment:'),
      CODE('poor-temp-swap', 'luau', 'luau', ['Pelaksanaan lemah: pertukaran tiga baris', 'Poor implementation: a three-line swap'], `
local first, second = "sword", "shield"
local temp = first
first = second
second = temp
print(first, second, temp)
`, 'shield\tsword\tsword'),
      EXPLAIN('poor-temp-swap',
        ['1–4', 'Tiga baris dan satu pemboleh ubah tambahan; mudah tersalah susunan.', 'Three lines and an extra variable; easy to get the order wrong.'],
        ['5', '`temp` kekal hidup tanpa tujuan.', '`temp` stays alive without purpose.']),
      CODE('improved-multi-swap', 'luau', 'luau', ['Pelaksanaan lebih baik: pertukaran satu baris', 'Improved implementation: a one-line swap'], `
local slots = {"sword", "shield", "potion"}
slots[1], slots[3] = slots[3], slots[1]
print(table.concat(slots, ", "))
`, 'potion, shield, sword'),
      EXPLAIN('improved-multi-swap',
        ['1–3', 'Pertukaran dua slot inventori dalam satu baris yang jelas niatnya.', 'Swapping two inventory slots in one line whose intent is clear.'])),
    S('industry_use_cases',
      UL(
        ['Fungsi seperti `pcall` dan `string.find` memulangkan beberapa nilai yang diterima dengan assignment berbilang.', 'Functions such as `pcall` and `string.find` return several values received with multiple assignment.'],
        ['Algoritma isihan dan shuffle menukar elemen dengan `t[i], t[j] = t[j], t[i]`.', 'Sorting and shuffle algorithms swap elements with `t[i], t[j] = t[j], t[i]`.'],
        ['Kod grid dan peta jubin menukar indeks kepada baris/lajur dengan dua nilai pulangan.', 'Grid and tile-map code converts indices into row/column with two return values.'],
      )),
    S('practical_demonstration',
      OL(
        ['Panggil `gridPosition(9, 3)` dan ramalkan hasilnya.', 'Call `gridPosition(9, 3)` and predict the result.'],
        ['Tukar ketiga-tiga slot dalam `improved-multi-swap` supaya susunannya terbalik.', 'Rotate all three slots in `improved-multi-swap` so the order is reversed.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Shuffle Fisher–Yates dengan benih tetap.** Gunakan pertukaran assignment berbilang untuk mengocok dek kecil. Gunakan `Random.new`? Tidak — itu API Roblox. Gunakan penjana mudah sendiri supaya output boleh disahkan.', '**A Fisher–Yates shuffle with a fixed seed.** Use multiple-assignment swaps to shuffle a small deck. Use `Random.new`? No — that is a Roblox API. Use a simple generator of your own so the output can be verified.'),
      CODE('shuffle-deck', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local seed = 2026
local function nextRandom(max: number): number
  seed = (seed * 75 + 74) % 65537
  return seed % max + 1
end

local deck = {"A", "B", "C", "D", "E"}
for i = #deck, 2, -1 do
  local j = nextRandom(i)
  deck[i], deck[j] = deck[j], deck[i]
end
print(table.concat(deck, " "))
`, 'C D E B A'),
      EXPLAIN('shuffle-deck',
        ['1–5', 'Penjana kongruen linear kecil (pemalar ZX81: × 75 + 74 mod 65537, sentiasa di bawah 2⁵³ jadi tepat dalam float): benih tetap → jujukan yang boleh diulang. Untuk permainan sebenar dalam Roblox, gunakan `Random.new()` atau `math.random`.', 'A small linear congruential generator (the ZX81 constants: × 75 + 74 mod 65537, always below 2⁵³ so exact in floats): a fixed seed → a repeatable sequence. For real games in Roblox, use `Random.new()` or `math.random`.'],
        ['7–11', 'Fisher–Yates: dari belakang, tukar setiap kedudukan dengan kedudukan rawak di depannya — pertukaran satu baris.', 'Fisher–Yates: from the back, swap each position with a random position in front of it — a one-line swap.'],
        ['12', 'Susunan yang dikocok, sama pada setiap larian.', 'The shuffled order, identical on every run.'])),
    S('summary',
      UL(
        ['`a, b = x, y` — kanan dinilai dahulu, kemudian diberikan.', '`a, b = x, y` — the right side is evaluated first, then assigned.'],
        ['Nama tambahan `nil`; nilai tambahan dibuang.', 'Extra names `nil`; extra values discarded.'],
        ['`a, b = b, a` menukar tanpa pemboleh ubah sementara.', '`a, b = b, a` swaps without a temporary variable.'],
        ['Panggilan terakhir dalam senarai memberi semua nilai pulangannya.', 'A call last in the list gives all of its return values.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah `c` dalam `local a, b, c = 1, 2`?', 'What is `c` in `local a, b, c = 1, 2`?'],
        ['Mengapakah `a, b = b, a` menukar dengan betul?', 'Why does `a, b = b, a` swap correctly?'],
        ['Dalam versi berpepijat `field-assign`, adakah `player.x` berubah? Mengapa?', 'In the buggy `field-assign`, does `player.x` change? Why?'],
        ['Bagaimanakah anda menerima hanya nilai kedua daripada fungsi?', 'How do you receive only the second value from a function?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax', url: `${LUAU}/syntax` },
        { title: 'Lua 5.1 Reference Manual §2.4.3 — Assignment (inherited by Luau)', url: 'https://www.lua.org/manual/5.1/manual.html#2.4.3' },
        { title: 'Roblox Creator Hub — Multiple assignment', url: `${DOCS}/luau/variables#multiple-assignment` },
        { title: 'Fisher–Yates shuffle (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle' },
      )),
  ],
};

// ─── 1.3 Roblox-style naming conventions ───────────────────────────────────

export const LUAU102_1_3: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 1,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan [[naming-convention|konvensyen penamaan]] Roblox: `camelCase`, `PascalCase`, `UPPER_CASE`.', 'Use Roblox [[naming-convention|naming conventions]]: `camelCase`, `PascalCase`, `UPPER_CASE`.'],
        ['Memilih nama yang menerangkan maksud dan unit.', 'Choose names that describe meaning and units.'],
        ['Mengelak membayangi nama pustaka standard (`table`, `string`, `type`).', 'Avoid shadowing standard-library names (`table`, `string`, `type`).'],
        ['Menamakan boolean dan fungsi dengan jelas.', 'Name booleans and functions clearly.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1–1.2: pemboleh ubah dan assignment.', 'Lectures 1.1–1.2: variables and assignment.'],
        ['LUAU101 3.2: peraturan sintaks nama.', 'LUAU101 3.2: syntax rules for names.'],
      )),
    S('introduction',
      P('Luau menerima hampir sebarang nama yang sah — `x`, `PlayerHP`, `the_value_2` — tetapi kod dibaca jauh lebih kerap daripada ditulis. Nama yang baik menerangkan **apa** sesuatu itu tanpa perlu komen; konvensyen yang konsisten memberitahu **jenis** sesuatu itu pada pandangan pertama. Ekosistem Roblox mempunyai konvensyen yang diterima secara meluas, digunakan dalam dokumentasi rasmi, contoh Creator Hub dan pustaka sumber terbuka. Mengikutinya menjadikan kod anda mudah dibaca oleh pembangun lain — dan oleh anda sendiri enam bulan kemudian.',
        'Luau accepts almost any valid name — `x`, `PlayerHP`, `the_value_2` — but code is read far more often than it is written. A good name explains **what** something is without needing a comment; a consistent convention tells you **what kind** of thing it is at first glance. The Roblox ecosystem has widely accepted conventions, used in the official documentation, Creator Hub examples and open-source libraries. Following them makes your code easy to read for other developers — and for yourself six months later.'),
      KEY('`camelCase` untuk local dan fungsi · `PascalCase` untuk perkhidmatan, modul dan kelas · `UPPER_CASE` untuk pemalar.', '`camelCase` for locals and functions · `PascalCase` for services, modules and classes · `UPPER_CASE` for constants.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**camelCase:** `playerScore`, `respawnPlayer()` — pemboleh ubah dan fungsi biasa.', '**camelCase:** `playerScore`, `respawnPlayer()` — ordinary variables and functions.'],
        ['**PascalCase:** `Players`, `ReplicatedStorage`, `ShopModule` — perkhidmatan, modul dan sifat objek enjin.', '**PascalCase:** `Players`, `ReplicatedStorage`, `ShopModule` — services, modules and engine object properties.'],
        ['**UPPER_CASE:** `MAX_PLAYERS`, `ROUND_SECONDS` — nilai yang tidak berubah.', '**UPPER_CASE:** `MAX_PLAYERS`, `ROUND_SECONDS` — values that never change.'],
        ['**Boolean:** awalan `is`, `has`, `can`: `isAlive`, `hasKey`, `canJump`.', '**Booleans:** prefixes `is`, `has`, `can`: `isAlive`, `hasKey`, `canJump`.'],
        ['**Unit dalam nama:** `cooldownSeconds`, `distanceStuds` — mengelak kekeliruan unit.', '**Units in names:** `cooldownSeconds`, `distanceStuds` — avoiding unit confusion.'],
      )),
    S('detailed_theory',
      P('Konvensyen penamaan ialah persetujuan, bukan peraturan bahasa — Luau tidak menguatkuasakannya. Nilainya datang daripada konsistensi: apabila setiap pembangun dalam pasukan menulis pemalar dalam `UPPER_CASE`, pembaca tahu serta-merta bahawa `MAX_PLAYERS` tidak akan berubah dan `maxPlayers` mungkin berubah. Roblox sendiri menggunakan `PascalCase` untuk perkhidmatan (`game:GetService("Players")`) dan sifat objek enjin (`part.Anchored`, `humanoid.WalkSpeed`); kod Luau anda menggunakan `camelCase` untuk local, supaya mudah membezakan "milik enjin" daripada "milik saya".',
        'Naming conventions are an agreement, not a language rule — Luau does not enforce them. Their value comes from consistency: when every developer on a team writes constants in `UPPER_CASE`, readers know immediately that `MAX_PLAYERS` will not change and that `maxPlayers` might. Roblox itself uses `PascalCase` for services (`game:GetService("Players")`) and engine object properties (`part.Anchored`, `humanoid.WalkSpeed`); your Luau code uses `camelCase` for locals, making it easy to tell "engine-owned" from "mine".'),
      P('Satu bahaya khusus ialah **membayangi** nama pustaka standard. `table`, `string`, `math`, `type`, `print` dan `error` ialah global biasa; jika anda menulis `local table = {}`, maka `table.insert` dalam skop itu merujuk table kosong anda dan bukan pustaka — panggilan gagal dengan `attempt to call a nil value`. Begitu juga `local type = "fire"` menjadikan `type(x)` memanggil string. Ralat ini mengelirukan kerana ia berlaku jauh dari pengisytiharan. Gunakan nama yang lebih spesifik: `items`, `damageType`, `message`.',
        'One specific danger is **shadowing** standard-library names. `table`, `string`, `math`, `type`, `print` and `error` are ordinary globals; if you write `local table = {}`, then `table.insert` in that scope refers to your empty table rather than the library — the call fails with `attempt to call a nil value`. Likewise `local type = "fire"` makes `type(x)` call a string. These errors are confusing because they happen far from the declaration. Use more specific names: `items`, `damageType`, `message`.')),
    S('technical_terminology', TERMS('naming-convention', 'variable', 'reserved-word', 'scope')),
    S('syntax_rules',
      UL(
        ['Nama: huruf, digit, `_`; tidak bermula dengan digit; peka huruf.', 'Names: letters, digits, `_`; not starting with a digit; case-sensitive.'],
        ['Awalan `_` menandakan "peribadi" atau "sengaja tidak digunakan" mengikut konvensyen.', 'A leading `_` marks "private" or "intentionally unused" by convention.'],
        ['Elakkan nama satu huruf kecuali pemboleh ubah gelung pendek (`i`, `j`) dan koordinat (`x`, `y`).', 'Avoid one-letter names except short loop variables (`i`, `j`) and coordinates (`x`, `y`).'],
      )),
    S('code_demonstration',
      CODE('naming-styles', 'luau', 'luau', ['Konvensyen dalam satu program', 'The conventions in one program'], `
local MAX_STAMINA = 100
local SPRINT_COST_PER_SECOND = 20

local currentStamina = MAX_STAMINA
local isSprinting = true

local function drainStamina(seconds: number)
  if isSprinting then
    currentStamina = math.max(currentStamina - SPRINT_COST_PER_SECOND * seconds, 0)
  end
end

drainStamina(2.5)
print(currentStamina, isSprinting)
`, '50\ttrue'),
      EXPLAIN('naming-styles',
        ['1–2', 'Pemalar dalam `UPPER_CASE`; unit "per second" dalam nama.', 'Constants in `UPPER_CASE`; the unit "per second" is in the name.'],
        ['4–5', 'Keadaan dalam `camelCase`; boolean bermula dengan `is`.', 'State in `camelCase`; the boolean starts with `is`.'],
        ['7–11', 'Fungsi `camelCase` dengan kata kerja (`drain`) dan parameter yang menyatakan unitnya (`seconds`).', 'A `camelCase` function with a verb (`drain`) and a parameter stating its unit (`seconds`).'],
        ['13–14', '100 − 20 × 2.5 = 50.', '100 − 20 × 2.5 = 50.'])),
    S('complete_examples',
      CODE('shadow-library', 'luau', 'luau', ['Jangan bayangi pustaka standard', 'Do not shadow the standard library'], `
local items = {}
table.insert(items, "sword")
table.insert(items, "shield")

local damageType = "fire"
print(type(damageType), #items, table.concat(items, "+"))
`, 'string\t2\tsword+shield', {
        debug: BUG(`
local table = {}
table.insert(table, "sword")
`, 'example:2: attempt to call a nil value',
          'Baris 1 mencipta local bernama `table` yang membayangi pustaka standard. Pada baris 2, `table.insert` mencari medan `insert` dalam table kosong anda — ia `nil`, dan memanggil `nil` gagal. Mesej tidak menyebut `table` sama sekali, yang menjadikan pepijat ini sukar dikesan. Gunakan nama seperti `items`.',
          'Line 1 creates a local named `table` that shadows the standard library. On line 2, `table.insert` looks up the field `insert` in your empty table — it is `nil`, and calling `nil` fails. The message does not mention `table` at all, which makes this bug hard to spot. Use a name such as `items`.'),
      }),
      EXPLAIN('shadow-library',
        ['1–3', '`items` — nama yang spesifik; `table` kekal sebagai pustaka.', '`items` — a specific name; `table` stays the library.'],
        ['5–6', '`damageType` dan bukan `type`, jadi fungsi `type` masih berfungsi.', '`damageType`, not `type`, so the `type` function still works.']),
      CODE('boolean-names', 'luau', 'luau', ['Nama boolean yang jelas', 'Clear boolean names'], `
local player = {isAlive = true, hasKey = false, canDoubleJump = true}

local function describe(p): string
  local parts = {}
  if p.isAlive then table.insert(parts, "alive") end
  if p.hasKey then table.insert(parts, "has key") end
  if p.canDoubleJump then table.insert(parts, "can double jump") end
  return table.concat(parts, ", ")
end

print(describe(player))
`, 'alive, can double jump', {
        debug: BUG(`
local type = "fire"
local spell = {element = type, power = 10}
print(type(spell))
`, 'example:3: attempt to call a string value',
          '`local type = "fire"` membayangi fungsi `type`. Pada baris 3, `type(spell)` cuba memanggil string "fire". Luau menyebut jenis nilai yang dipanggil (`string value`). Namakan semula kepada `element` atau `damageType`.',
          '`local type = "fire"` shadows the `type` function. On line 3, `type(spell)` tries to call the string "fire". Luau names the type of the called value (`string value`). Rename it to `element` or `damageType`.'),
      }),
      EXPLAIN('boolean-names',
        ['1', 'Boolean dengan awalan `is/has/can` dibaca seperti soalan ya/tidak.', 'Booleans with `is/has/can` prefixes read like yes/no questions.'],
        ['3–9', '`if p.isAlive then` dibaca seperti ayat Inggeris.', '`if p.isAlive then` reads like an English sentence.'],
        ['11', 'Dua sifat benar disenaraikan.', 'The two true properties are listed.'])),
    S('line_by_line',
      EXPLAIN('naming-styles',
        ['9', '`SPRINT_COST_PER_SECOND * seconds` — dengan unit dalam nama, kesilapan seperti mendarab saat dengan milisaat lebih mudah dikesan.', '`SPRINT_COST_PER_SECOND * seconds` — with units in names, mistakes such as multiplying seconds by milliseconds are easier to spot.']),
      EXPLAIN('shadow-library',
        ['2', 'Nama global `table` tidak dibayangi di mana-mana, jadi ia masih pustaka standard.', 'The global name `table` is not shadowed anywhere, so it is still the standard library.'])),
    S('why_this_way',
      P('Mengapa konvensyen? Kerana masa yang dihabiskan untuk membaca kod jauh melebihi masa menulisnya. Nama yang konsisten mengurangkan beban mental: anda tidak perlu memeriksa definisi untuk mengetahui bahawa `MAX_SPEED` ialah pemalar atau `Players` ialah perkhidmatan. Konvensyen Roblox juga sepadan dengan API enjin, jadi kod anda kelihatan "semula jadi" di sebelah dokumentasi.',
        'Why conventions? Because time spent reading code far exceeds time spent writing it. Consistent names reduce mental load: you do not need to check a definition to know that `MAX_SPEED` is a constant or `Players` is a service. Roblox conventions also match the engine API, so your code looks "natural" next to the documentation.'),
      P('Ikuti konvensyen pasukan **apabila** menyertai projek sedia ada, walaupun ia berbeza; gunakan konvensyen Roblox **apabila** memulakan projek baharu.', 'Follow the team’s convention **when** joining an existing project, even if it differs; use the Roblox conventions **when** starting a new project.')),
    S('execution_flow',
      OL(
        ['`shadow-library` (versi berpepijat): `local table = {}` → nama `table` kini merujuk table kosong dalam skop ini.', '`shadow-library` (buggy version): `local table = {}` → the name `table` now refers to an empty table in this scope.'],
        ['`table.insert` → carian medan `insert` dalam table kosong → `nil`.', '`table.insert` → field lookup `insert` in the empty table → `nil`.'],
        ['Memanggil `nil` → ralat runtime `attempt to call a nil value`.', 'Calling `nil` → runtime error `attempt to call a nil value`.'],
      )),
    S('memory_behaviour',
      P('Panjang nama tidak mempengaruhi memori atau kelajuan runtime: nama local hilang dalam bytecode, dan nama medan disimpan sekali sebagai string yang dikongsi (string Luau di-intern). Jadi `cooldownSeconds` tidak lebih "mahal" daripada `c` — pilih nama untuk pembaca.',
        'Name length does not affect memory or run-time speed: local names vanish in the bytecode, and field names are stored once as shared strings (Luau strings are interned). So `cooldownSeconds` is no more "expensive" than `c` — choose names for the reader.')),
    S('alternative_implementations',
      P('Kumpulkan pemalar berkaitan dalam satu table `PascalCase` atau `UPPER_CASE` untuk memberikan ruang nama:', 'Group related constants into one `PascalCase` or `UPPER_CASE` table to give them a namespace:'),
      CODE('constant-table', 'luau', 'luau', ['Pemalar dalam table bernama', 'Constants in a named table'], `
local Config = {
  MAX_PLAYERS = 12,
  ROUND_SECONDS = 180,
  INTERMISSION_SECONDS = 15,
}

local cycleSeconds = Config.ROUND_SECONDS + Config.INTERMISSION_SECONDS
print(\`{Config.MAX_PLAYERS} players, {cycleSeconds}s per cycle\`)
`, '12 players, 195s per cycle'),
      EXPLAIN('constant-table',
        ['1–5', 'Table `Config` mengumpul pemalar; dalam Roblox ini biasanya ModuleScript.', 'The `Config` table groups constants; in Roblox this is usually a ModuleScript.'],
        ['7–8', 'Setiap rujukan menunjukkan sumbernya: `Config.ROUND_SECONDS`.', 'Every reference shows its source: `Config.ROUND_SECONDS`.'])),
    S('common_mistakes',
      UL(
        ['Nama samar seperti `data`, `temp`, `val`, `x2`.', 'Vague names such as `data`, `temp`, `val`, `x2`.'],
        ['Membayangi `table`, `string`, `type`, `math` atau `print`.', 'Shadowing `table`, `string`, `type`, `math` or `print`.'],
        ['Mencampur gaya dalam satu fail (`player_score` di sebelah `playerScore`).', 'Mixing styles in one file (`player_score` next to `playerScore`).'],
        ['Nama boolean negatif (`isNotDead`) yang menghasilkan `not isNotDead`.', 'Negative boolean names (`isNotDead`) that lead to `not isNotDead`.'],
      )),
    S('debugging',
      P('Ralat yang menyebut `attempt to call a nil value` atau `attempt to call a string value` pada baris yang menggunakan fungsi pustaka biasa hampir selalu bermaksud nama pustaka dibayangi. Cari ke atas dalam fail untuk `local table`, `local string`, `local type` atau parameter fungsi dengan nama yang sama. Penganalisis Studio memberi amaran **LocalShadow** dan **BuiltinGlobalWrite** untuk kes ini (diterangkan, tidak disahkan di sini). Fungsi berikut menyemak senarai nama yang dicadangkan:',
        'An error saying `attempt to call a nil value` or `attempt to call a string value` on a line that uses an ordinary library function almost always means a library name is shadowed. Search upwards in the file for `local table`, `local string`, `local type` or a function parameter with the same name. Studio’s analyser warns **LocalShadow** and **BuiltinGlobalWrite** for these cases (described, not verified here). The following function checks a list of proposed names:'),
      CODE('name-checker', 'luau', 'luau', ['Penyemak nama ringkas', 'A simple name checker'], `
local RESERVED_LIBS = {table = true, string = true, math = true, type = true, print = true}

local function checkName(name: string): string
  if RESERVED_LIBS[name] then return "shadows a library" end
  if string.match(name, "^[A-Z][A-Z0-9_]*$") then return "constant style" end
  if string.match(name, "^[a-z][A-Za-z0-9]*$") then return "camelCase" end
  if string.match(name, "^[A-Z][A-Za-z0-9]*$") then return "PascalCase" end
  return "unconventional"
end

for _, n in {"playerScore", "MAX_HEALTH", "ShopModule", "table", "player_score"} do
  print(n, checkName(n))
end
`, 'playerScore\tcamelCase\nMAX_HEALTH\tconstant style\nShopModule\tPascalCase\ntable\tshadows a library\nplayer_score\tunconventional'),
      EXPLAIN('name-checker',
        ['1', 'Set nama pustaka yang tidak patut dibayangi.', 'A set of library names that should not be shadowed.'],
        ['3–9', 'Corak string mengenal pasti gaya: semua huruf besar, mula huruf kecil, atau mula huruf besar.', 'String patterns identify the style: all capitals, lower-case start, or upper-case start.'],
        ['11–13', 'Lima nama diuji.', 'Five names are tested.'])),
    S('performance',
      P('Konvensyen penamaan tidak mempunyai kesan prestasi. Satu-satunya pertimbangan prestasi yang berkaitan ialah menyalin fungsi pustaka ke local dengan nama yang sama (`local floor = math.floor`) — ia lebih pantas dalam gelung panas dan tidak membayangi apa-apa kerana namanya berbeza daripada pustaka.',
        'Naming conventions have no performance effect. The only related performance consideration is copying a library function into a local (`local floor = math.floor`) — it is faster in hot loops and shadows nothing because its name differs from the library’s.')),
    S('software_engineering',
      P('Nama samar berbanding nama yang menerangkan:', 'Vague names versus descriptive names:'),
      CODE('poor-vague-names', 'luau', 'luau', ['Pelaksanaan lemah: nama samar', 'Poor implementation: vague names'], `
local d = 3
local t = 1.5
local v = d / t
local f = v > 1.8
print(v, f)
`, '2\ttrue'),
      EXPLAIN('poor-vague-names',
        ['1–5', 'Apakah `d`, `t`, `v` dan `f`? Jarak, masa, halaju dan "terlalu laju"? Pembaca mesti meneka, dan unit tidak diketahui.', 'What are `d`, `t`, `v` and `f`? Distance, time, velocity and "too fast"? The reader must guess, and the units are unknown.']),
      CODE('improved-clear-names', 'luau', 'luau', ['Pelaksanaan lebih baik: nama dengan maksud dan unit', 'Improved implementation: names with meaning and units'], `
local MAX_SPEED_STUDS_PER_SECOND = 1.8
local distanceStuds = 3
local elapsedSeconds = 1.5
local speed = distanceStuds / elapsedSeconds
local isSpeeding = speed > MAX_SPEED_STUDS_PER_SECOND
print(speed, isSpeeding)
`, '2\ttrue'),
      EXPLAIN('improved-clear-names',
        ['1–6', 'Kod yang sama; setiap nama menyatakan maksud dan unit, dan had ialah pemalar bernama. Kod ini boleh difahami tanpa komen.', 'The same code; every name states its meaning and unit, and the limit is a named constant. This code is understandable without comments.'])),
    S('industry_use_cases',
      UL(
        ['Roblox Lua Style Guide ialah rujukan penamaan standard dalam syarikat permainan Roblox.', 'The Roblox Lua Style Guide is the standard naming reference in Roblox game studios.'],
        ['Selene dan luau-analyze boleh dikonfigurasi untuk menolak pembayangan pustaka.', 'Selene and luau-analyze can be configured to reject library shadowing.'],
        ['Semakan kod (code review) dalam pasukan profesional selalu termasuk komen tentang nama.', 'Code reviews in professional teams always include comments about names.'],
      )),
    S('practical_demonstration',
      OL(
        ['Namakan semula `poor-vague-names` sendiri sebelum melihat versi yang dipertingkatkan.', 'Rename `poor-vague-names` yourself before looking at the improved version.'],
        ['Tambah tiga nama pada `name-checker` dan ramalkan keputusannya.', 'Add three names to `name-checker` and predict their results.'],
        ['Jalankan kedua-dua versi berpepijat; apakah persamaannya?', 'Run both buggy versions; what do they have in common?'],
      )),
    S('mini_project',
      P('**Refaktor nama.** Tulis semula skrip pengira peluru dengan nama yang baik, pemalar bernama dan boolean yang jelas, tanpa mengubah tingkah lakunya.', '**A naming refactor.** Rewrite an ammo-counter script with good names, named constants and clear booleans, without changing its behaviour.'),
      CODE('ammo-refactor', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local MAGAZINE_SIZE = 12
local RELOAD_SECONDS = 2

local ammoInMagazine = 3
local reserveAmmo = 20

local function reload(): number
  local needed = MAGAZINE_SIZE - ammoInMagazine
  local taken = math.min(needed, reserveAmmo)
  ammoInMagazine += taken
  reserveAmmo -= taken
  return RELOAD_SECONDS
end

local secondsSpent = reload()
local isFull = ammoInMagazine == MAGAZINE_SIZE
print(ammoInMagazine, reserveAmmo, secondsSpent, isFull)
`, '12\t11\t2\ttrue'),
      EXPLAIN('ammo-refactor',
        ['1–5', 'Pemalar `UPPER_CASE` dan keadaan `camelCase` dengan maksud yang jelas.', '`UPPER_CASE` constants and `camelCase` state with clear meanings.'],
        ['7–13', 'Fungsi kata kerja `reload`: ambil hanya peluru yang diperlukan dan tersedia.', 'The verb function `reload`: take only the ammo that is needed and available.'],
        ['15–17', 'Boolean `isFull` dibaca seperti soalan; 9 peluru diambil daripada simpanan.', 'The boolean `isFull` reads like a question; 9 rounds were taken from the reserve.'])),
    S('summary',
      UL(
        ['`camelCase` local/fungsi · `PascalCase` perkhidmatan/modul · `UPPER_CASE` pemalar.', '`camelCase` locals/functions · `PascalCase` services/modules · `UPPER_CASE` constants.'],
        ['Boolean dengan `is/has/can`; unit dalam nama.', 'Booleans with `is/has/can`; units in names.'],
        ['Jangan bayangi `table`, `string`, `type`, `math`, `print`.', 'Do not shadow `table`, `string`, `type`, `math`, `print`.'],
        ['Konvensyen ialah persetujuan pasukan; Luau tidak menguatkuasakannya.', 'Conventions are a team agreement; Luau does not enforce them.'],
      )),
    S('knowledge_check',
      OL(
        ['Gaya apakah yang sesuai untuk had masa pusingan?', 'Which style suits a round time limit?'],
        ['Mengapakah `local table = {}` memecahkan `table.insert`?', 'Why does `local table = {}` break `table.insert`?'],
        ['Namakan boolean untuk "pemain boleh membuka pintu".', 'Name a boolean for "the player can open the door".'],
        ['Mengapakah memasukkan unit dalam nama berguna?', 'Why is putting units in names useful?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Lua Style Guide — Naming', url: 'https://roblox.github.io/lua-style-guide/#naming' },
        { title: 'Luau — Linting (LocalShadow, BuiltinGlobalWrite)', url: `${LUAU}/lint` },
        { title: 'Roblox Creator Hub — Style guide for code samples', url: `${DOCS}/luau` },
        { title: 'Selene — a Lua/Luau linter', url: 'https://github.com/Kampfkarren/selene' },
      )),
  ],
};

export const LUAU102_M1 = [LUAU102_1_1, LUAU102_1_2, LUAU102_1_3];
