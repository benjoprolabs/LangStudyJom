import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU103 · Module 3 — Functions (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 3.1 Defining and calling functions ────────────────────────────────────

export const LUAU103_3_1: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 3,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Mentakrif fungsi `local` dengan [[function-type|anotasi jenis]] pilihan untuk parameter dan pulangan.', 'Define `local` functions with optional [[function-type|type annotations]] for parameters and returns.'],
        ['Memberi nilai lalai kepada parameter pilihan (`name: string?`).', 'Give default values to optional parameters (`name: string?`).'],
        ['Menggunakan sintaks kaedah `:` dan `self`, dan membezakannya daripada `.`.', 'Use the method syntax `:` and `self`, and distinguish it from `.`.'],
        ['Menulis fungsi kecil yang mempunyai satu tujuan.', 'Write small functions with a single purpose.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1–2: syarat dan gelung.', 'Modules 1–2: conditions and loops.'],
        ['LUAU102: pemboleh ubah local dan anotasi jenis asas.', 'LUAU102: local variables and basic type annotations.'],
      )),
    S('introduction',
      P('Fungsi ialah blok binaan utama setiap skrip Roblox: setiap pengendali event, setiap ModuleScript, setiap peraturan permainan ialah fungsi. Luau mewarisi fungsi Lua — nilai kelas pertama dengan parameter, nilai pulangan dan closure — dan menambah **anotasi jenis** yang membolehkan penganalisis menyemak panggilan sebelum permainan dijalankan. Kuliah ini juga memperkenalkan sintaks **kaedah** `obj:method()`, yang anda akan gunakan dengan setiap objek Roblox (`part:Destroy()`, `Players:GetPlayers()`), dan perangkap paling biasa yang berkaitan dengannya: mencampurkan `.` dan `:`.',
        'Functions are the main building block of every Roblox script: every event handler, every ModuleScript, every game rule is a function. Luau inherits Lua’s functions — first-class values with parameters, return values and closures — and adds **type annotations** that let the analyser check calls before the game runs. This lecture also introduces the **method** syntax `obj:method()`, which you will use with every Roblox object (`part:Destroy()`, `Players:GetPlayers()`), and the most common trap related to it: mixing up `.` and `:`.'),
      KEY('`obj:method(x)` = `obj.method(obj, x)`. Titik bertindih menghantar objek sebagai `self` secara automatik.', '`obj:method(x)` = `obj.method(obj, x)`. The colon passes the object as `self` automatically.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`local function nama(p: Jenis): JenisPulangan … end` — anotasi pilihan, diabaikan oleh VM.', '`local function name(p: Type): ReturnType … end` — annotations are optional and ignored by the VM.'],
        ['Parameter pilihan: `p: string?` dengan lalai `p = p or "…"` (atau semakan `nil` untuk boolean).', 'Optional parameters: `p: string?` with a default `p = p or "…"` (or a `nil` check for booleans).'],
        ['`function T:m(x)` = `function T.m(self, x)`; panggil dengan `T:m(x)`.', '`function T:m(x)` = `function T.m(self, x)`; call it with `T:m(x)`.'],
        ['Fungsi tanpa `return` memulangkan tiada nilai; dalam ungkapan ia menjadi `nil`.', 'A function without `return` returns no values; in an expression it becomes `nil`.'],
        ['Fungsi mesti ditakrif (barisnya dijalankan) sebelum dipanggil.', 'A function must be defined (its line executed) before it is called.'],
      )),
    S('detailed_theory',
      P('Dalam Luau, fungsi ialah nilai: `local function f() end` mencipta objek fungsi dan menyimpannya dalam local `f`. Anotasi jenis — `(hp: number, amount: number): number` — ialah maklumat untuk **penganalisis**; VM membuangnya semasa kompil, jadi fungsi bertaip berjalan sama pantas dan menerima argumen apa sahaja semasa runtime. Dengan `--!strict` dalam Studio, panggilan seperti `heal("ten", 5)` digariskan sebelum anda menekan Play. Dalam kursus ini anotasi digunakan untuk dokumentasi dan latihan; semakan jenis itu sendiri tidak dijalankan oleh pengesahan kami.',
        'In Luau, functions are values: `local function f() end` creates a function object and stores it in the local `f`. Type annotations — `(hp: number, amount: number): number` — are information for the **analyser**; the VM strips them at compile time, so typed functions run just as fast and accept any arguments at run time. With `--!strict` in Studio, a call such as `heal("ten", 5)` is underlined before you press Play. In this course annotations are used for documentation and practice; the type check itself is not run by our verification.'),
      P('Sintaks kaedah ialah gula sintaks yang penting. `function Account:deposit(n)` mentakrif fungsi dengan parameter tersembunyi pertama bernama `self`; `Account:deposit(50)` memanggilnya dengan `Account` sebagai `self` dan 50 sebagai `n`. Jika anda memanggil dengan titik — `Account.deposit(50)` — tiada `self` dihantar secara automatik, jadi `self` menjadi 50 dan `self.balance` gagal dengan `attempt to index number with \'balance\'`. Ralat yang sama berlaku dengan objek Roblox: `part.Destroy()` dan bukannya `part:Destroy()`. Peraturan praktikal: jika fungsi ditakrif dengan `:`, panggil dengan `:`.',
        'The method syntax is an important piece of syntactic sugar. `function Account:deposit(n)` defines a function with a hidden first parameter named `self`; `Account:deposit(50)` calls it with `Account` as `self` and 50 as `n`. If you call it with a dot — `Account.deposit(50)` — no `self` is passed automatically, so `self` becomes 50 and `self.balance` fails with `attempt to index number with \'balance\'`. The same error happens with Roblox objects: `part.Destroy()` instead of `part:Destroy()`. A practical rule: if a function is defined with `:`, call it with `:`.')),
    S('technical_terminology', TERMS('function', 'function-type', 'parameter', 'type-annotation')),
    S('syntax_rules',
      UL(
        ['`local function heal(hp: number, amount: number): number … end`.', '`local function heal(hp: number, amount: number): number … end`.'],
        ['Kaedah: `function Inventory:add(item: string) … end` dipanggil `Inventory:add("sword")`.', 'Method: `function Inventory:add(item: string) … end` called as `Inventory:add("sword")`.'],
        ['Lalai: `greeting = greeting or "Hello"` pada baris pertama badan.', 'Default: `greeting = greeting or "Hello"` on the first line of the body.'],
      )),
    S('code_demonstration',
      CODE('typed-function', 'luau', 'luau', ['Fungsi bertaip dengan parameter pilihan', 'A typed function with an optional parameter'], `
local function heal(hp: number, amount: number, maxHp: number?): number
  local cap = maxHp or 100
  return math.min(hp + amount, cap)
end

print(heal(40, 30))
print(heal(90, 30))
print(heal(90, 30, 150))
`, '70\n100\n120'),
      EXPLAIN('typed-function',
        ['1', 'Dua parameter wajib dan satu pilihan (`number?`); pulangan `number`.', 'Two required parameters and one optional (`number?`); a `number` return.'],
        ['2–3', 'Lalai 100 apabila `maxHp` tidak diberi; hadkan kesihatan.', 'A default of 100 when `maxHp` is not given; cap the health.'],
        ['6–8', 'Tanpa dan dengan argumen pilihan.', 'Without and with the optional argument.'])),
    S('complete_examples',
      CODE('method-syntax', 'luau', 'luau', ['Sintaks kaedah dan self', 'Method syntax and self'], `
local Wallet = {owner = "Aina", coins = 100}

function Wallet:deposit(amount: number): number
  self.coins += amount
  return self.coins
end

function Wallet:describe(): string
  return \`{self.owner} has {self.coins} coins\`
end

print(Wallet:deposit(50))
print(Wallet.deposit(Wallet, 5))
print(Wallet:describe())
`, '150\n155\nAina has 155 coins', {
        debug: BUG(`
local Wallet = {owner = "Aina", coins = 100}
function Wallet:deposit(amount: number): number
  self.coins += amount
  return self.coins
end
print(Wallet.deposit(50))
`, "example:3: attempt to index number with 'coins'",
          'Fungsi ditakrif dengan `:`, jadi ia menjangka `self` sebagai argumen pertama. Panggilan dengan titik `Wallet.deposit(50)` menghantar 50 sebagai `self` dan tiada `amount`. Pada baris 3, `self.coins` cuba mengindeks nombor 50. Ralat ini sangat biasa dengan objek Roblox (`part.Destroy()`). Panggil dengan `Wallet:deposit(50)`.',
          'The function is defined with `:`, so it expects `self` as its first argument. The dot call `Wallet.deposit(50)` passes 50 as `self` and no `amount`. On line 3, `self.coins` tries to index the number 50. This error is very common with Roblox objects (`part.Destroy()`). Call it as `Wallet:deposit(50)`.'),
      }),
      EXPLAIN('method-syntax',
        ['1', 'Objek ringkas sebagai table.', 'A simple object as a table.'],
        ['3–6', '`function Wallet:deposit` menambah parameter tersembunyi `self`.', '`function Wallet:deposit` adds a hidden `self` parameter.'],
        ['8–10', 'Kaedah kedua membaca `self.owner` dan `self.coins`.', 'A second method reads `self.owner` and `self.coins`.'],
        ['12–14', '`Wallet:deposit(50)` dan `Wallet.deposit(Wallet, 5)` adalah setara.', '`Wallet:deposit(50)` and `Wallet.deposit(Wallet, 5)` are equivalent.']),
      CODE('define-before-call', 'luau', 'luau', ['Takrif sebelum panggil', 'Define before calling'], `
local function formatTime(seconds: number): string
  return string.format("%d:%02d", seconds // 60, seconds % 60)
end

local function announce(seconds: number)
  print(\`Round ends in {formatTime(seconds)}\`)
end

announce(95)
announce(600)
`, 'Round ends in 1:35\nRound ends in 10:00', {
        debug: BUG(`
local factorial = function(n: number): number
  if n <= 1 then return 1 end
  return n * factorial(n - 1)
end
print(factorial(5))
`, 'example:3: attempt to call a nil value',
          'Dengan `local factorial = function …`, nama `factorial` belum wujud di dalam badan fungsi semasa ia dikompil — jadi `factorial(n - 1)` merujuk global `nil`. Panggilan pertama dari baris 5 berjaya masuk, tetapi panggilan rekursif gagal. Gunakan `local function factorial(n)`, yang mengisytiharkan nama **sebelum** badan.',
          'With `local factorial = function …`, the name `factorial` does not exist yet inside the function body when it is compiled — so `factorial(n - 1)` refers to a `nil` global. The first call from line 5 gets in, but the recursive call fails. Use `local function factorial(n)`, which declares the name **before** the body.'),
      }),
      EXPLAIN('define-before-call',
        ['1–3', 'Fungsi pembantu kecil: saat → m:ss.', 'A small helper: seconds → m:ss.'],
        ['5–7', 'Fungsi kedua memanggil yang pertama — ia sudah ditakrif di atas.', 'A second function calls the first — it is already defined above.'],
        ['9–10', 'Dua panggilan.', 'Two calls.'])),
    S('line_by_line',
      EXPLAIN('method-syntax',
        ['4', '`self.coins += amount` — `self` ialah `Wallet` apabila dipanggil dengan `:`; kod yang sama berfungsi untuk mana-mana dompet jika anda mempunyai beberapa.', '`self.coins += amount` — `self` is `Wallet` when called with `:`; the same code works for any wallet if you have several.']),
      EXPLAIN('typed-function',
        ['2', '`maxHp or 100` selamat kerana `maxHp` ialah nombor atau `nil`, tidak pernah `false`.', '`maxHp or 100` is safe because `maxHp` is a number or `nil`, never `false`.'])),
    S('why_this_way',
      P('Mengapa fungsi kecil? Kerana setiap satu boleh dinamakan, diuji dan digunakan semula secara berasingan, dan pepijat dalam satu tidak tersebar. Mengapa anotasi jenis? Kerana ia mendokumenkan kontrak fungsi dan membolehkan Studio menangkap panggilan yang salah lebih awal. Mengapa `:`? Kerana objek Roblox dan corak OOP dalam Luau bergantung padanya.',
        'Why small functions? Because each can be named, tested and reused separately, and a bug in one does not spread. Why type annotations? Because they document the function’s contract and let Studio catch wrong calls early. Why `:`? Because Roblox objects and OOP patterns in Luau depend on it.'),
      P('Tulis fungsi baharu **apabila** blok kod mempunyai satu tujuan yang boleh dinamakan; gunakan `:` **apabila** fungsi bekerja pada objek tertentu (`self`).', 'Write a new function **when** a block of code has one nameable purpose; use `:` **when** a function works on a particular object (`self`).')),
    S('execution_flow',
      OL(
        ['`Wallet:deposit(50)` → Luau mencari `Wallet.deposit` dan memanggilnya dengan `(Wallet, 50)`.', '`Wallet:deposit(50)` → Luau looks up `Wallet.deposit` and calls it with `(Wallet, 50)`.'],
        ['Di dalam: `self = Wallet`, `amount = 50`; `self.coins` menjadi 150.', 'Inside: `self = Wallet`, `amount = 50`; `self.coins` becomes 150.'],
        ['`return self.coins` → 150 dicetak.', '`return self.coins` → 150 is printed.'],
      )),
    S('memory_behaviour',
      P('Mentakrif fungsi mencipta satu objek fungsi; memanggilnya mencipta bingkai pada timbunan yang dibebaskan apabila ia pulang. Kaedah yang ditakrif dengan `function T:m()` disimpan **sekali** dalam table `T` dan dikongsi; `self` hanyalah argumen, jadi tiada salinan fungsi bagi setiap objek apabila anda menggunakan metatable (LUAU kemudian).',
        'Defining a function creates one function object; calling it creates a stack frame released when it returns. A method defined with `function T:m()` is stored **once** in table `T` and shared; `self` is just an argument, so there is no per-object copy of the function when you use metatables (later in LUAU).')),
    S('alternative_implementations',
      P('Untuk banyak parameter pilihan, table pilihan lebih jelas daripada parameter kedudukan:', 'For many optional parameters, an options table is clearer than positional parameters:'),
      CODE('options-param', 'luau', 'luau', ['Table pilihan', 'An options table'], `
local function spawnEnemy(kind: string, options: {health: number?, level: number?}?)
  local opts = options or {}
  local level = opts.level or 1
  local health = opts.health or level * 50
  return \`{kind} L{level} with {health} hp\`
end

print(spawnEnemy("slime"))
print(spawnEnemy("orc", {level = 3}))
print(spawnEnemy("boss", {level = 10, health = 5000}))
`, 'slime L1 with 50 hp\norc L3 with 150 hp\nboss L10 with 5000 hp'),
      EXPLAIN('options-param',
        ['1', 'Anotasi untuk table pilihan dengan medan pilihan.', 'An annotation for an optional table with optional fields.'],
        ['2–5', 'Lalai untuk setiap pilihan; kesihatan lalai bergantung pada tahap.', 'Defaults for every option; the default health depends on the level.'],
        ['8–10', 'Pemanggil hanya menamakan pilihan yang diperlukan.', 'Callers only name the options they need.'])),
    S('common_mistakes',
      UL(
        ['Memanggil kaedah dengan `.` dan bukannya `:`.', 'Calling a method with `.` instead of `:`.'],
        ['`local f = function` untuk fungsi rekursif.', '`local f = function` for a recursive function.'],
        ['Memanggil fungsi sebelum barisnya ditakrif.', 'Calling a function before its line is defined.'],
        ['Menganggap anotasi jenis menolak argumen yang salah semasa runtime.', 'Assuming type annotations reject wrong arguments at run time.'],
      )),
    S('debugging',
      P('Ralat `attempt to index number with \'X\'` (atau `string`, `boolean`) di dalam kaedah hampir selalu bermaksud kaedah dipanggil dengan `.` dan argumen pertama menjadi `self`. Semak tempat panggilan, bukan badan kaedah. Ralat `attempt to call a nil value` bermaksud fungsi tidak wujud pada titik panggilan — salah eja, belum ditakrif, atau rekursi dengan `local f = function`. Contoh berikut membina objek dengan beberapa kaedah dan memanggilnya dengan betul:',
        'The error `attempt to index number with \'X\'` (or `string`, `boolean`) inside a method almost always means the method was called with `.` and the first argument became `self`. Check the call site, not the method body. The error `attempt to call a nil value` means the function does not exist at the call site — a typo, not yet defined, or recursion with `local f = function`. The following example builds an object with several methods and calls them correctly:'),
      CODE('timer-object', 'luau', 'luau', ['Objek pemasa dengan kaedah', 'A timer object with methods'], `
local Timer = {remaining = 10, paused = false}

function Timer:tick(dt: number)
  if self.paused then return end
  self.remaining = math.max(self.remaining - dt, 0)
end

function Timer:isDone(): boolean
  return self.remaining == 0
end

Timer:tick(4)
Timer.paused = true
Timer:tick(4)
Timer.paused = false
Timer:tick(7)
print(Timer.remaining, Timer:isDone())
`, '0\ttrue'),
      EXPLAIN('timer-object',
        ['1', 'Keadaan pemasa.', 'The timer state.'],
        ['3–6', '`tick` mengurangkan masa kecuali dijeda, tidak di bawah 0.', '`tick` reduces the time unless paused, never below 0.'],
        ['8–10', '`isDone` menyemak keadaan.', '`isDone` checks the state.'],
        ['12–17', '10 − 4 = 6; dijeda; − 7 → 0. Setiap panggilan kaedah menggunakan `:`; sifat dibaca dengan `.`.', '10 − 4 = 6; paused; − 7 → 0. Every method call uses `:`; properties are read with `.`.'])),
    S('performance',
      P('Panggilan fungsi dalam Luau murah, dan VM mengoptimumkan panggilan kaedah `obj:m()` dengan arahan khas (`NAMECALL`). Jangan elak fungsi kecil kerana prestasi; elakkan hanya mencipta fungsi **baharu** (closure) dalam gelung panas apabila satu fungsi boleh dikongsi.', 'Function calls in Luau are cheap, and the VM optimises method calls `obj:m()` with a special instruction (`NAMECALL`). Do not avoid small functions for performance; only avoid creating **new** functions (closures) in hot loops when one function could be shared.')),
    S('software_engineering',
      P('Fungsi panjang yang melakukan segala-galanya berbanding fungsi kecil yang bernama:', 'One long function that does everything versus small named functions:'),
      CODE('poor-god-function', 'luau', 'luau', ['Pelaksanaan lemah: satu fungsi besar', 'Poor implementation: one big function'], `
local function processRound(scores)
  local best, bestName, total = -1, "", 0
  for name, s in scores do
    total += s
    if s > best or (s == best and name < bestName) then best, bestName = s, name end
  end
  local average = total / 3
  print(\`winner {bestName} ({best}), average {string.format("%.1f", average)}\`)
end
processRound({Aina = 70, Ben = 95, Chen = 80})
`, 'winner Ben (95), average 81.7'),
      EXPLAIN('poor-god-function',
        ['1–9', 'Satu fungsi mencari pemenang, mengira purata (dengan `3` yang ditulis terus!) dan mencetak — tiada bahagian boleh diuji atau digunakan semula secara berasingan.', 'One function finds the winner, computes the average (with a hard-coded `3`!) and prints — no part can be tested or reused separately.'],
        ['10', 'Berfungsi untuk tiga pemain sahaja.', 'It works for exactly three players only.']),
      CODE('improved-small-functions', 'luau', 'luau', ['Pelaksanaan lebih baik: fungsi kecil', 'Improved implementation: small functions'], `
local function winnerOf(scores): (string, number)
  local bestName, best = "", -math.huge
  for name, s in scores do
    if s > best or (s == best and name < bestName) then bestName, best = name, s end
  end
  return bestName, best
end

local function averageOf(scores): number
  local total, count = 0, 0
  for _, s in scores do total += s; count += 1 end
  return if count > 0 then total / count else 0
end

local scores = {Aina = 70, Ben = 95, Chen = 80, Dewi = 60}
local name, best = winnerOf(scores)
print(\`winner {name} ({best}), average {string.format("%.1f", averageOf(scores))}\`)
`, 'winner Ben (95), average 76.2'),
      EXPLAIN('improved-small-functions',
        ['1–7', '`winnerOf` hanya mencari pemenang (dengan nama sebagai pemutus seri untuk keputusan yang stabil).', '`winnerOf` only finds the winner (with the name as a tie-breaker for a stable result).'],
        ['9–13', '`averageOf` mengira bilangan sebenar dan mengendalikan table kosong.', '`averageOf` counts the real number and handles an empty table.'],
        ['15–17', 'Kini berfungsi untuk sebarang bilangan pemain; setiap fungsi boleh diuji sendiri.', 'Now it works for any number of players; each function can be tested on its own.'])),
    S('industry_use_cases',
      UL(
        ['Setiap objek Roblox digunakan melalui kaedah `:`: `part:Destroy()`, `humanoid:TakeDamage(10)`.', 'Every Roblox object is used through `:` methods: `part:Destroy()`, `humanoid:TakeDamage(10)`.'],
        ['ModuleScript mengeksport fungsi bertaip supaya pembangun lain mendapat autolengkap dan semakan.', 'ModuleScripts export typed functions so other developers get autocomplete and checks.'],
        ['Pasukan memecahkan logik pusingan kepada fungsi kecil yang diuji secara automatik.', 'Teams break round logic into small functions tested automatically.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah kaedah `Wallet:withdraw(amount)` yang menolak pengeluaran berlebihan.', 'Add a method `Wallet:withdraw(amount)` that rejects overdrafts.'],
        ['Tambah pilihan `name` pada `spawnEnemy`.', 'Add a `name` option to `spawnEnemy`.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Objek Kedai.** Bina table `Shop` dengan kaedah `:addItem(name, price)`, `:price(name)` dan `:buy(name, coins)` yang memulangkan `(boolean, number, string)`. Uji setiap kaedah.', '**A Shop object.** Build a `Shop` table with methods `:addItem(name, price)`, `:price(name)` and `:buy(name, coins)` returning `(boolean, number, string)`. Test every method.'),
      CODE('shop-object', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local Shop = {items = {}}

function Shop:addItem(name: string, price: number)
  self.items[name] = price
end

function Shop:price(name: string): number?
  return self.items[name]
end

function Shop:buy(name: string, coins: number): (boolean, number, string)
  local cost = self:price(name)
  if cost == nil then return false, coins, \`no {name} for sale\` end
  if coins < cost then return false, coins, \`{name} costs {cost}\` end
  return true, coins - cost, \`bought {name}\`
end

Shop:addItem("sword", 300)
Shop:addItem("potion", 40)
print(Shop:buy("potion", 100))
print(Shop:buy("sword", 100))
print(Shop:buy("bow", 100))
`, 'true\t60\tbought potion\nfalse\t100\tsword costs 300\nfalse\t100\tno bow for sale'),
      EXPLAIN('shop-object',
        ['1–5', 'Keadaan kedai dan kaedah untuk menambah item.', 'The shop state and a method to add items.'],
        ['7–9', 'Kaedah pembantu yang memulangkan harga atau `nil`.', 'A helper method returning a price or `nil`.'],
        ['11–16', '`self:price(name)` — kaedah memanggil kaedah lain dengan `self:`; klausa pengawal; tiga nilai pulangan.', '`self:price(name)` — a method calling another method with `self:`; guard clauses; three return values.'],
        ['18–22', 'Isi kedai dan uji ketiga-tiga laluan.', 'Fill the shop and test all three paths.'])),
    S('summary',
      UL(
        ['`local function f(p: T): R` — anotasi pilihan untuk penganalisis.', '`local function f(p: T): R` — optional annotations for the analyser.'],
        ['Parameter pilihan dengan `?` dan lalai `or`.', 'Optional parameters with `?` and an `or` default.'],
        ['`obj:m(x)` = `obj.m(obj, x)`; takrif dengan `:` → panggil dengan `:`.', '`obj:m(x)` = `obj.m(obj, x)`; defined with `:` → called with `:`.'],
        ['Fungsi kecil dengan satu tujuan lebih mudah diuji dan digunakan semula.', 'Small single-purpose functions are easier to test and reuse.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dihantar sebagai `self` dalam `Wallet.deposit(50)`?', 'What is passed as `self` in `Wallet.deposit(50)`?'],
        ['Mengapakah `local f = function` gagal untuk rekursi?', 'Why does `local f = function` fail for recursion?'],
        ['Adakah anotasi `amount: number` menolak `"50"` semasa runtime?', 'Does the annotation `amount: number` reject `"50"` at run time?'],
        ['Bilakah table pilihan lebih baik daripada parameter kedudukan?', 'When is an options table better than positional parameters?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Functions', url: `${DOCS}/luau/functions` },
        { title: 'Luau — Type checking: function types', url: `${LUAU}/typecheck#function-types` },
        { title: 'Lua 5.1 Reference Manual §2.5.8–2.5.9 — Function Calls and Definitions (method syntax)', url: 'https://www.lua.org/manual/5.1/manual.html#2.5.8' },
        { title: 'Luau — Performance (NAMECALL and fast calls)', url: `${LUAU}/performance` },
      )),
  ],
};

// ─── 3.2 Multiple return values ────────────────────────────────────────────

export const LUAU103_3_2: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 3,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Memulangkan beberapa nilai dan menerangkannya dengan anotasi `(T1, T2)`.', 'Return several values and describe them with `(T1, T2)` annotations.'],
        ['Menerapkan peraturan [[value-adjustment|pelarasan nilai]] dalam panggilan, table dan `return`.', 'Apply the [[value-adjustment]] rules in calls, tables and `return`.'],
        ['Menggunakan corak `berjaya, hasil` daripada `pcall` dan fungsi anda sendiri.', 'Use the `success, result` pattern from `pcall` and your own functions.'],
        ['Mengenal pasti pepijat apabila panggilan berbilang pulangan menjadi argumen terakhir fungsi pustaka.', 'Recognise bugs when a multi-return call becomes the last argument of a library function.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1: fungsi dan anotasi.', 'Lecture 3.1: functions and annotations.'],
        ['LUAU102 1.2: assignment berbilang.', 'LUAU102 1.2: multiple assignment.'],
      )),
    S('introduction',
      P('Fungsi Luau boleh memulangkan lebih daripada satu nilai: kedudukan baris **dan** lajur, kejayaan **dan** mesej, nilai terkecil **dan** terbesar. Ini mengelakkan table sementara dan menjadikan API ringkas. API Roblox sendiri menggunakannya — `pcall` memulangkan `berjaya, hasil…`, dan banyak fungsi enjin memulangkan beberapa nilai. Kuliah ini menerangkan cara menulis dan menerima nilai berbilang dengan betul, dan peraturan pelarasan yang menentukan berapa banyak nilai yang benar-benar sampai.',
        'Luau functions can return more than one value: a row **and** a column, success **and** a message, the smallest **and** the largest value. This avoids temporary tables and keeps APIs short. Roblox’s own APIs use it — `pcall` returns `success, results…`, and many engine functions return several values. This lecture explains how to write and receive multiple values correctly, and the adjustment rules that decide how many values actually arrive.'),
      KEY('Panggilan yang **terakhir** dalam senarai memberi semua nilainya; di tempat lain — atau dalam kurungan — hanya yang pertama.', 'A call that is **last** in a list gives all its values; anywhere else — or in parentheses — only the first.', ['Peraturan', 'The rule'])),
    S('fundamental_concepts',
      UL(
        ['`return a, b` → dua nilai; anotasi `): (number, string)`.', '`return a, b` → two values; annotation `): (number, string)`.'],
        ['Penerimaan: `local x, y = f()`; nama tambahan `nil`, nilai tambahan dibuang.', 'Receiving: `local x, y = f()`; extra names `nil`, extra values discarded.'],
        ['Terakhir dalam senarai argumen atau constructor `{}` → semua nilai; bukan terakhir → satu.', 'Last in an argument list or `{}` constructor → all values; not last → one.'],
        ['`(f())` → tepat satu nilai.', '`(f())` → exactly one value.'],
        ['`pcall(f, …)` → `true, hasil…` atau `false, mesejRalat`.', '`pcall(f, …)` → `true, results…` or `false, errorMessage`.'],
      )),
    S('detailed_theory',
      P('Luau menentukan bilangan nilai yang digunakan daripada setiap panggilan mengikut **kedudukannya**. Dalam `print(minmax(3, 1), minmax(9, 7))`, panggilan pertama bukan terakhir, jadi ia menyumbang satu nilai; yang kedua terakhir, jadi ia menyumbang kedua-dua nilainya — `print` menerima tiga argumen. Peraturan yang sama terpakai dalam constructor table (`{f(), g()}`) dan `return` (`return f()` memajukan semua). Kurungan memaksa satu nilai: `(f())`. Peraturan ini membolehkan pemajuan yang ringkas (`return pcall(f)`), tetapi juga mencipta pepijat halus apabila anda tidak menyedari fungsi memulangkan lebih daripada satu nilai.',
        'Luau decides how many values each call contributes by its **position**. In `print(minmax(3, 1), minmax(9, 7))`, the first call is not last, so it contributes one value; the second is last, so it contributes both — `print` receives three arguments. The same rule applies in table constructors (`{f(), g()}`) and `return` (`return f()` forwards everything). Parentheses force one value: `(f())`. This rule enables short forwarding (`return pcall(f)`), but it also creates subtle bugs when you do not realise a function returns more than one value.'),
      P('Pepijat klasik dalam Luau melibatkan fungsi pustaka dengan parameter pilihan. `string.gsub` memulangkan teks **dan** bilangan penggantian; `string.match` dengan dua tangkapan memulangkan dua string. Jika panggilan sedemikian ialah argumen terakhir kepada `tonumber`, nilai kedua menjadi **asas** — `tonumber("10", "99")` gagal dengan `invalid argument #2 to \'tonumber\' (base out of range)`, walaupun anda hanya menulis satu argumen. Penyelesaiannya ialah kurungan atau menerima ke dalam local dahulu. Bagi fungsi anda sendiri, anotasi pulangan seperti `(boolean, string)` mendokumenkan dengan tepat apa yang dipulangkan, dan penganalisis Studio boleh memberi amaran apabila pemanggil menerima bilangan yang salah.',
        'A classic Luau bug involves library functions with optional parameters. `string.gsub` returns the text **and** the number of replacements; `string.match` with two captures returns two strings. If such a call is the last argument to `tonumber`, the second value becomes the **base** — `tonumber("10", "99")` fails with `invalid argument #2 to \'tonumber\' (base out of range)`, although you only wrote one argument. The fix is parentheses or receiving into locals first. For your own functions, a return annotation such as `(boolean, string)` documents exactly what is returned, and Studio’s analyser can warn when a caller receives the wrong number.')),
    S('technical_terminology', TERMS('value-adjustment', 'multiple-assignment', 'function-type', 'runtime-error')),
    S('syntax_rules',
      UL(
        ['`local function f(): (number, number) return 1, 2 end`.', '`local function f(): (number, number) return 1, 2 end`.'],
        ['`local ok, result = pcall(fn, arg)`.', '`local ok, result = pcall(fn, arg)`.'],
        ['`tonumber((s:match(…)))` — kurungan untuk satu nilai.', '`tonumber((s:match(…)))` — parentheses for one value.'],
      )),
    S('code_demonstration',
      CODE('multi-return', 'luau', 'luau', ['Nilai pulangan berbilang', 'Multiple return values'], `
local function minmax(a: number, b: number): (number, number)
  return math.min(a, b), math.max(a, b)
end

local low, high = minmax(9, 4)
print(low, high)
print(minmax(3, 1), minmax(9, 7))
local packed = {minmax(5, 2), minmax(8, 6)}
print(#packed, (minmax(10, 20)))
`, '4\t9\n1\t7\t9\n3\t10'),
      EXPLAIN('multi-return',
        ['1–3', 'Dua nilai dengan anotasi `(number, number)`.', 'Two values with a `(number, number)` annotation.'],
        ['5–6', 'Diterima ke dalam dua local.', 'Received into two locals.'],
        ['7', 'Panggilan pertama bukan terakhir → satu nilai (1); yang kedua terakhir → dua (7, 9).', 'The first call is not last → one value (1); the second is last → two (7, 9).'],
        ['8–9', 'Dalam constructor: 2 + (6, 8) = 3 elemen. Kurungan memberi satu nilai: 10.', 'In a constructor: 2 + (6, 8) = 3 elements. Parentheses give one value: 10.'])),
    S('complete_examples',
      CODE('pcall-pattern', 'luau', 'luau', ['Corak berjaya, hasil dengan pcall', 'The success, result pattern with pcall'], `
local function loadLevel(id: number): string
  if id > 3 then
    error(\`level {id} does not exist\`, 0)
  end
  return \`Level {id}\`
end

for _, id in {2, 5} do
  local ok, result = pcall(loadLevel, id)
  if ok then
    print("loaded:", result)
  else
    print("failed:", result)
  end
end
`, 'loaded:\tLevel 2\nfailed:\tlevel 5 does not exist', {
        debug: BUG(`
local line = "10 99"
local value = tonumber(line:match("(%d+) (%d+)"))
print(value)
`, "example:2: invalid argument #2 to 'tonumber' (base out of range)",
          '`line:match(…)` memulangkan **dua** tangkapan, "10" dan "99". Kerana panggilan itu ialah argumen terakhir `tonumber`, kedua-duanya dihantar: `tonumber("10", "99")`, dan 99 bukan asas yang sah (2–36). Anda menulis satu argumen, tetapi `tonumber` menerima dua. Gunakan kurungan — `tonumber((line:match(…)))` — atau terima tangkapan ke dalam local dahulu.',
          '`line:match(…)` returns **two** captures, "10" and "99". Because the call is `tonumber`’s last argument, both are passed: `tonumber("10", "99")`, and 99 is not a valid base (2–36). You wrote one argument, but `tonumber` received two. Use parentheses — `tonumber((line:match(…)))` — or receive the captures into locals first.'),
      }),
      EXPLAIN('pcall-pattern',
        ['1–6', 'Fungsi yang menimbulkan ralat untuk ID yang tidak wujud; `error(…, 0)` tanpa kedudukan.', 'A function that raises an error for an unknown ID; `error(…, 0)` without a position.'],
        ['8–15', '`pcall` memulangkan dua nilai: `ok` dan sama ada hasil atau mesej ralat. Pemanggil memilih cabang berdasarkan `ok`.', '`pcall` returns two values: `ok` and either the result or the error message. The caller chooses a branch based on `ok`.']),
      CODE('return-forwarding', 'luau', 'luau', ['Memajukan nilai pulangan', 'Forwarding return values'], `
local function divmod(a: number, b: number): (number, number)
  return a // b, a % b
end

local function safeDivmod(a: number, b: number): (boolean, number?, number?)
  if b == 0 then return false end
  return true, divmod(a, b)
end

print(safeDivmod(17, 5))
print(safeDivmod(17, 0))
print(select("#", safeDivmod(17, 0)))
`, 'true\t3\t2\nfalse\n1', {
        debug: BUG(`
local function bounds(): (number, number)
  return 1, 100
end
local low, high, step = bounds()
local count = (high - low) // step
`, 'example:5: attempt to perform arithmetic (idiv) on number and nil',
          'Tiga nama menerima dua nilai, jadi `step` ialah `nil`, dan `//` gagal. Anotasi `(number, number)` mendokumenkan bahawa hanya dua nilai dipulangkan — penganalisis Studio boleh memberi amaran tentang nama tambahan (diterangkan, tidak disahkan di sini). Padankan bilangan nama atau beri lalai: `step = step or 1`.',
          'Three names receive two values, so `step` is `nil`, and `//` fails. The `(number, number)` annotation documents that only two values are returned — Studio’s analyser can warn about the extra name (described, not verified here). Match the number of names or give a default: `step = step or 1`.'),
      }),
      EXPLAIN('return-forwarding',
        ['1–3', 'Hasil bahagi dan baki.', 'Quotient and remainder.'],
        ['5–8', 'Pembalut: pada kegagalan, satu nilai `false`; pada kejayaan, `true` diikuti **semua** nilai `divmod` (panggilan terakhir dalam `return`).', 'A wrapper: on failure, a single `false`; on success, `true` followed by **all** of `divmod`’s values (the last call in `return`).'],
        ['10–12', 'Tiga nilai pada kejayaan; satu pada kegagalan — `select("#", …)` membuktikannya.', 'Three values on success; one on failure — `select("#", …)` proves it.'])),
    S('line_by_line',
      EXPLAIN('multi-return',
        ['7', '`print` menerima tiga argumen: 1 (min daripada panggilan pertama sahaja), 7 dan 9.', '`print` receives three arguments: 1 (only the min from the first call), 7 and 9.']),
      EXPLAIN('return-forwarding',
        ['7', '`return true, divmod(a, b)` — `divmod` ialah item terakhir dalam senarai `return`, jadi kedua-dua nilainya diteruskan.', '`return true, divmod(a, b)` — `divmod` is the last item in the `return` list, so both its values are passed on.'])),
    S('why_this_way',
      P('Mengapa nilai berbilang dan bukan table? Kerana ia tidak memperuntukkan memori, dan pemanggil boleh mengambil hanya apa yang diperlukan. Corak `berjaya, hasil` — daripada `pcall` hingga fungsi anda sendiri — membolehkan kegagalan dikendalikan dengan `if` biasa tanpa pengecualian.',
        'Why multiple values rather than a table? Because they allocate no memory, and the caller can take only what it needs. The `success, result` pattern — from `pcall` to your own functions — lets failure be handled with an ordinary `if`, without exceptions.'),
      P('Pulangkan nilai berbilang **apabila** hasilnya sedikit dan susunannya jelas; balut panggilan dengan kurungan **apabila** ia argumen terakhir fungsi dengan parameter pilihan.', 'Return multiple values **when** there are few results and their order is obvious; wrap a call in parentheses **when** it is the last argument to a function with optional parameters.')),
    S('execution_flow',
      OL(
        ['`pcall(loadLevel, 5)` memanggil `loadLevel(5)` di dalam perlindungan.', '`pcall(loadLevel, 5)` calls `loadLevel(5)` under protection.'],
        ['`error(…)` dinaikkan; `pcall` menangkapnya dan memulangkan `false, "level 5 does not exist"`.', '`error(…)` is raised; `pcall` catches it and returns `false, "level 5 does not exist"`.'],
        ['`local ok, result` menerima kedua-dua nilai; cabang `else` mencetak mesej.', '`local ok, result` receives both values; the `else` branch prints the message.'],
      )),
    S('memory_behaviour',
      P('Nilai pulangan berbilang diletakkan pada timbunan VM dan disalin terus ke daftar penerima — tiada table dicipta. Nilai yang dibuang oleh pelarasan tidak pernah disalin. Membina `{f()}` pula mencipta table untuk menyimpan semua hasil.', 'Multiple return values are placed on the VM stack and copied directly into the receiving registers — no table is created. Values discarded by adjustment are never copied. Building `{f()}`, by contrast, creates a table to hold all results.')),
    S('alternative_implementations',
      P('Pulangkan table bernama apabila hasilnya banyak atau pilihan:', 'Return a named table when there are many or optional results:'),
      CODE('named-results', 'luau', 'luau', ['Hasil bernama', 'Named results'], `
type MatchResult = {winner: string, score: number, overtime: boolean}

local function finishMatch(red: number, blue: number): MatchResult
  return {
    winner = if red >= blue then "red" else "blue",
    score = math.max(red, blue),
    overtime = red == blue,
  }
end

local r = finishMatch(3, 3)
print(r.winner, r.score, r.overtime)
`, 'red\t3\ttrue'),
      EXPLAIN('named-results',
        ['1', 'Alias jenis Luau `type` mendokumenkan bentuk hasil (disemak oleh penganalisis sahaja).', 'A Luau `type` alias documents the result’s shape (checked by the analyser only).'],
        ['3–9', 'Satu table dengan medan bernama dan bukannya tiga nilai kedudukan.', 'One table with named fields instead of three positional values.'],
        ['11–12', 'Akses mengikut nama.', 'Access by name.'])),
    S('common_mistakes',
      UL(
        ['Panggilan berbilang pulangan sebagai argumen terakhir `tonumber` atau `table.insert`.', 'A multi-return call as the last argument of `tonumber` or `table.insert`.'],
        ['Lebih banyak nama daripada nilai pulangan.', 'More names than return values.'],
        ['Menjangka `{f(), g()}` mengandungi semua hasil `f`.', 'Expecting `{f(), g()}` to contain all of `f`’s results.'],
        ['Mengabaikan nilai pertama `pcall` dan menggunakan nilai kedua seolah-olah hasil.', 'Ignoring `pcall`’s first value and using the second as if it were a result.'],
      )),
    S('debugging',
      P('Apabila fungsi pustaka menerima argumen yang "pelik" (asas, kedudukan, bilangan), cetak bilangan nilai yang dihasilkan oleh panggilan dalaman: `print(select("#", s:match(…)))`. Jika lebih daripada satu, balut dengan kurungan. Apabila nama penerima `nil` secara tidak dijangka, bandingkan bilangan nama dengan anotasi pulangan fungsi. Contoh berikut menunjukkan `gsub`, punca biasa:',
        'When a library function receives "strange" arguments (a base, a position, a count), print how many values the inner call produces: `print(select("#", s:match(…)))`. If more than one, wrap it in parentheses. When a receiving name is unexpectedly `nil`, compare the number of names with the function’s return annotation. The following example shows `gsub`, a common culprit:'),
      CODE('gsub-two', 'luau', 'luau', ['gsub memulangkan dua nilai', 'gsub returns two values'], `
local raw = "1,250,000"
print(raw:gsub(",", ""))
print(select("#", raw:gsub(",", "")))
local coins = tonumber((raw:gsub(",", "")))
print(coins + 1)
`, '1250000\t2\n2\n1250001'),
      EXPLAIN('gsub-two',
        ['1–3', '`gsub` memulangkan teks baharu dan bilangan penggantian (2) — dua nilai.', '`gsub` returns the new text and the number of replacements (2) — two values.'],
        ['4–5', 'Kurungan luar mengambil hanya teks; tanpanya, 2 akan menjadi asas `tonumber`.', 'The outer parentheses take only the text; without them, 2 would become `tonumber`’s base.'])),
    S('performance',
      P('Memulangkan dua nilai hampir sama pantas dengan satu. `pcall` mempunyai kos kecil; dalam gelung yang sangat panas, elakkan `pcall` bagi setiap elemen jika ralat tidak dijangka — sahkan input dan biarkan pepijat sebenar muncul.', 'Returning two values is almost as fast as one. `pcall` has a small cost; in very hot loops, avoid a `pcall` per element if errors are not expected — validate input and let real bugs surface.')),
    S('software_engineering',
      P('Pulangan yang tidak konsisten berbanding pulangan yang konsisten dan bertaip:', 'Inconsistent returns versus consistent, typed returns:'),
      CODE('poor-inconsistent-returns', 'luau', 'luau', ['Pelaksanaan lemah: bilangan pulangan berubah', 'Poor implementation: a varying number of returns'], `
local function findPlayer(list, name)
  for i, p in list do
    if p == name then return i, p end
  end
  return "not found"
end

local index, found = findPlayer({"Aina", "Ben"}, "Chen")
print(index, found)
`, 'not found\tnil'),
      EXPLAIN('poor-inconsistent-returns',
        ['1–6', 'Kejayaan memulangkan nombor dan nama; kegagalan memulangkan **string** dalam kedudukan indeks.', 'Success returns a number and a name; failure returns a **string** in the index position.'],
        ['8–9', '`index` kini string "not found" — kod yang menggunakannya sebagai nombor akan gagal jauh dari sini.', '`index` is now the string "not found" — code using it as a number will fail far from here.']),
      CODE('improved-consistent-returns', 'luau', 'luau', ['Pelaksanaan lebih baik: pulangan konsisten', 'Improved implementation: consistent returns'], `
local function findPlayer(list: {string}, name: string): (number?, string?)
  for i, p in list do
    if p == name then return i, nil end
  end
  return nil, \`{name} is not in the list\`
end

print(findPlayer({"Aina", "Ben"}, "Ben"))
print(findPlayer({"Aina", "Ben"}, "Chen"))
`, '2\tnil\nnil\tChen is not in the list'),
      EXPLAIN('improved-consistent-returns',
        ['1–6', 'Sentiasa dua nilai: indeks atau `nil`, dan mesej atau `nil`. Anotasi `(number?, string?)` mendokumenkannya.', 'Always two values: an index or `nil`, and a message or `nil`. The `(number?, string?)` annotation documents it.'],
        ['8–9', 'Pemanggil boleh menyemak `if index then` dengan selamat.', 'Callers can check `if index then` safely.'])),
    S('industry_use_cases',
      UL(
        ['Setiap panggilan DataStore dalam Roblox dibalut dengan `pcall` dan diterima sebagai `ok, data`.', 'Every DataStore call in Roblox is wrapped in `pcall` and received as `ok, data`.'],
        ['Fungsi geometri memulangkan `x, y` atau `hit, position` tanpa table sementara.', 'Geometry functions return `x, y` or `hit, position` without temporary tables.'],
        ['Pembalut log memajukan semua hasil dengan `return f(...)`.', 'Logging wrappers forward every result with `return f(...)`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Ramalkan output `print(minmax(1, 2), minmax(3, 4), minmax(5, 6))`.', 'Predict the output of `print(minmax(1, 2), minmax(3, 4), minmax(5, 6))`.'],
        ['Tukar `"10 99"` dalam versi berpepijat `pcall-pattern` kepada `"10 20"`: mengapa tiada ralat?', 'Change `"10 99"` in the buggy `pcall-pattern` to `"10 20"`: why is there no error?'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Penghurai koordinat.** Tulis `parseCoords(text)` yang memulangkan `(boolean, number?, number?, string?)` — berjaya, x, y, atau mesej — untuk input seperti `"12, -4"`. Uji kes sah dan tidak sah.', '**A coordinate parser.** Write `parseCoords(text)` returning `(boolean, number?, number?, string?)` — success, x, y, or a message — for input such as `"12, -4"`. Test valid and invalid cases.'),
      CODE('parse-coords', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function parseCoords(text: string): (boolean, number?, number?, string?)
  local xs, ys = text:match("^%s*(-?%d+)%s*,%s*(-?%d+)%s*$")
  if xs == nil then
    return false, nil, nil, \`cannot parse "{text}"\`
  end
  return true, tonumber(xs), tonumber(ys), nil
end

for _, input in {"12, -4", " 0,7 ", "north"} do
  local ok, x, y, problem = parseCoords(input)
  print(if ok then \`x={x} y={y}\` else problem)
end
`, 'x=12 y=-4\nx=0 y=7\ncannot parse "north"'),
      EXPLAIN('parse-coords',
        ['1–2', 'Corak dengan dua tangkapan diterima ke dalam dua local — tiada risiko pelarasan.', 'A pattern with two captures received into two locals — no adjustment risk.'],
        ['3–6', 'Sentiasa empat nilai: kegagalan dengan mesej, atau kejayaan dengan x dan y.', 'Always four values: failure with a message, or success with x and y.'],
        ['9–12', 'Empat nama menerima empat nilai; if-expression memilih paparan.', 'Four names receive four values; an if-expression chooses the display.'])),
    S('summary',
      UL(
        ['`return a, b` dengan anotasi `(T1, T2)`.', '`return a, b` with a `(T1, T2)` annotation.'],
        ['Terakhir dalam senarai → semua nilai; selainnya atau `( )` → satu.', 'Last in a list → all values; otherwise or `( )` → one.'],
        ['`pcall` → `ok, hasil/mesej`; semak `ok` dahulu.', '`pcall` → `ok, result/message`; check `ok` first.'],
        ['Kurungan untuk panggilan berbilang pulangan sebagai argumen terakhir.', 'Parentheses for multi-return calls as last arguments.'],
      )),
    S('knowledge_check',
      OL(
        ['Berapa elemen dalam `{minmax(1, 2), minmax(3, 4)}`?', 'How many elements are in `{minmax(1, 2), minmax(3, 4)}`?'],
        ['Apakah yang dipulangkan oleh `pcall` apabila fungsi berjaya dengan dua nilai?', 'What does `pcall` return when the function succeeds with two values?'],
        ['Mengapakah `tonumber(s:gsub(",", ""))` berisiko?', 'Why is `tonumber(s:gsub(",", ""))` risky?'],
        ['Mengapakah pulangan yang konsisten penting?', 'Why are consistent returns important?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Functions (multiple return values)', url: `${DOCS}/luau/functions` },
        { title: 'Luau — Type checking (tuple return types)', url: `${LUAU}/typecheck` },
        { title: 'Lua 5.1 Reference Manual §2.5 — Expressions (adjustment)', url: 'https://www.lua.org/manual/5.1/manual.html#2.5' },
        { title: 'Roblox globals — pcall', url: `${DOCS}/reference/engine/globals/LuaGlobals#pcall` },
      )),
  ],
};

// ─── 3.3 Varargs and table.pack ────────────────────────────────────────────

export const LUAU103_3_3: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 3,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis fungsi [[vararg|variadic]] dengan `...` dan anotasi `...: number`.', 'Write [[vararg|variadic]] functions with `...` and the annotation `...: number`.'],
        ['Mengira dan mengakses argumen dengan `select("#", ...)` dan `select(n, ...)`.', 'Count and access arguments with `select("#", ...)` and `select(n, ...)`.'],
        ['Menyimpan argumen dengan `table.pack` dan memulihkannya dengan `table.unpack(t, 1, t.n)`.', 'Store arguments with `table.pack` and restore them with `table.unpack(t, 1, t.n)`.'],
        ['Memajukan `...` kepada fungsi lain dengan betul.', 'Forward `...` to another function correctly.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1–3.2: fungsi dan nilai pulangan berbilang.', 'Lectures 3.1–3.2: functions and multiple return values.'],
      )),
    S('introduction',
      P('Sesetengah fungsi menerima sebarang bilangan argumen: `print`, `math.max`, `string.format`. Anda boleh menulis fungsi seperti ini sendiri dengan `...` di hujung senarai parameter. Dalam Luau, `...` juga boleh dianotasi — `...: number` — supaya penganalisis tahu jenis setiap argumen tambahan. Di dalam fungsi, `...` berkelakuan seperti panggilan fungsi yang memulangkan semua argumen tambahan, jadi peraturan pelarasan kuliah 3.2 terpakai. `table.pack` menyimpan argumen bersama bilangannya, yang penting apabila sesetengahnya `nil`.',
        'Some functions take any number of arguments: `print`, `math.max`, `string.format`. You can write such functions yourself with `...` at the end of the parameter list. In Luau, `...` can also be annotated — `...: number` — so the analyser knows the type of every extra argument. Inside the function, `...` behaves like a function call returning all the extra arguments, so the adjustment rules of lecture 3.2 apply. `table.pack` stores the arguments together with their count, which matters when some of them are `nil`.'),
      KEY('`...` = semua argumen tambahan. `select("#", ...)` = bilangan sebenar. `table.pack(...)` = table + medan `n`.', '`...` = all extra arguments. `select("#", ...)` = the true count. `table.pack(...)` = a table + an `n` field.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`local function f(a: string, ...: number)` — `a` wajib; selebihnya nombor.', '`local function f(a: string, ...: number)` — `a` required; the rest numbers.'],
        ['`{...}` mengumpul argumen; lubang `nil` menjadikan `#` tidak boleh dipercayai.', '`{...}` collects the arguments; `nil` holes make `#` unreliable.'],
        ['`select("#", ...)` mengira termasuk `nil`; `select(n, ...)` memulangkan argumen ke-n dan selepasnya.', '`select("#", ...)` counts including `nil`s; `select(n, ...)` returns the n-th argument and after.'],
        ['`table.pack(...)` → `{…, n = bilangan}`; `table.unpack(t, 1, t.n)` memulihkan dengan tepat.', '`table.pack(...)` → `{…, n = count}`; `table.unpack(t, 1, t.n)` restores exactly.'],
        ['`...` hanya sah dalam fungsi yang mengisytiharkannya.', '`...` is only valid inside a function that declares it.'],
      )),
    S('detailed_theory',
      P('Apabila fungsi variadic dipanggil, argumen tambahan disimpan oleh VM dan ungkapan `...` menyalinnya ke tempat ia digunakan. Sebagai item terakhir dalam senarai, `...` mengembang kepada semua argumen — `print(...)` mencetak semuanya, `string.format(fmt, ...)` memajukan semuanya. Di tempat lain, ia hanya argumen pertama. Mengira argumen memerlukan berhati-hati: `#{...}` boleh memberi jawapan yang salah apabila terdapat `nil`, tetapi `select("#", ...)` membaca bilangan sebenar. Iterasi umum atas `{...}` melangkau `nil`, jadi gunakan gelung `for i = 1, select("#", ...)` apabila setiap kedudukan penting.',
        'When a variadic function is called, the VM stores the extra arguments and the `...` expression copies them to wherever it is used. As the last item of a list, `...` expands to all the arguments — `print(...)` prints them all, `string.format(fmt, ...)` forwards them all. Elsewhere it is only the first argument. Counting arguments needs care: `#{...}` can give a wrong answer when there are `nil`s, but `select("#", ...)` reads the true count. Generalized iteration over `{...}` skips `nil`s, so use a `for i = 1, select("#", ...)` loop when every position matters.'),
      P('`table.pack` (dan `table.unpack` dengan julat eksplisit) menyelesaikan masalah menyimpan argumen untuk kemudian — contohnya dalam baris gilir tugas, sistem "undo", atau pembalut yang merekod panggilan. `table.pack(...)` mencipta table dengan argumen pada indeks 1…n dan medan `n` yang merekod bilangan sebenar, walaupun terdapat `nil` di hujung. `table.unpack(t, 1, t.n)` kemudian memulihkan senarai argumen yang tepat. Dalam Luau, anotasi `...: T` memberitahu penganalisis jenis setiap argumen tambahan; ia tidak mengehadkan bilangan atau menyemak jenis semasa runtime. Menggunakan `...` dalam fungsi yang tidak mengisytiharkannya ialah ralat kompil yang jelas: `Cannot use \'...\' outside of a vararg function`.',
        '`table.pack` (and `table.unpack` with an explicit range) solves the problem of storing arguments for later — for example in a job queue, an "undo" system, or a wrapper that records calls. `table.pack(...)` creates a table with the arguments at indices 1…n and an `n` field recording the true count, even with trailing `nil`s. `table.unpack(t, 1, t.n)` then restores the exact argument list. In Luau, the `...: T` annotation tells the analyser the type of every extra argument; it does not limit the count or check types at run time. Using `...` in a function that does not declare it is a clear compile error: `Cannot use \'...\' outside of a vararg function`.')),
    S('technical_terminology', TERMS('vararg', 'value-adjustment', 'function-type', 'table')),
    S('syntax_rules',
      UL(
        ['`local function sum(...: number): number` · `local function log(level: string, ...: any)`.', '`local function sum(...: number): number` · `local function log(level: string, ...: any)`.'],
        ['`select("#", ...)` · `select(2, ...)` · `select(-1, ...)` (yang terakhir).', '`select("#", ...)` · `select(2, ...)` · `select(-1, ...)` (the last one).'],
        ['`local args = table.pack(...)` · `table.unpack(args, 1, args.n)`.', '`local args = table.pack(...)` · `table.unpack(args, 1, args.n)`.'],
      )),
    S('code_demonstration',
      CODE('vararg-sum', 'luau', 'luau', ['Jumlah variadic bertaip', 'A typed variadic sum'], `
local function sum(...: number): number
  local total = 0
  for _, v in {...} do
    total += v
  end
  return total
end

print(sum(1, 2, 3), sum(10), sum())
print(select("#", 1, nil, 3), select(2, "a", "b", "c"))
`, '6\t10\t0\n3\tb\tc'),
      EXPLAIN('vararg-sum',
        ['1', '`...: number` — setiap argumen tambahan ialah nombor (untuk penganalisis).', '`...: number` — every extra argument is a number (for the analyser).'],
        ['2–6', '`{...}` mengumpul argumen; iterasi umum menjumlahkannya.', '`{...}` collects the arguments; generalized iteration sums them.'],
        ['9', 'Tiga, satu dan sifar argumen.', 'Three, one and zero arguments.'],
        ['10', '`select("#", …)` mengira `nil` juga (3); `select(2, …)` memulangkan "b" **dan** "c".', '`select("#", …)` counts the `nil` too (3); `select(2, …)` returns "b" **and** "c".'])),
    S('complete_examples',
      CODE('forward-format', 'luau', 'luau', ['Memajukan ... ke string.format', 'Forwarding ... to string.format'], `
local function logf(level: string, fmt: string, ...: any)
  print(\`[{level}] \` .. string.format(fmt, ...))
end

logf("INFO", "%s joined (level %d)", "Aina", 7)
logf("WARN", "%d%% memory used", 91)
logf("INFO", "server ready")
`, '[INFO] Aina joined (level 7)\n[WARN] 91% memory used\n[INFO] server ready', {
        debug: BUG(`
local function total()
  local t = 0
  for _, v in {...} do t += v end
  return t
end
`, "example:3: Cannot use '...' outside of a vararg function",
          'Fungsi menggunakan `...` tetapi tidak mengisytiharkannya dalam parameternya — `total()` dan bukannya `total(...)`. Fungsi bukan variadic tidak menyimpan argumen tambahan, jadi pengkompil menolaknya. Tambah `...` (dengan anotasi jika mahu): `local function total(...: number)`.',
          'The function uses `...` but does not declare it in its parameters — `total()` instead of `total(...)`. A non-variadic function keeps no extra arguments, so the compiler rejects it. Add `...` (with an annotation if you like): `local function total(...: number)`.'),
      }),
      EXPLAIN('forward-format',
        ['1–3', '`...` ialah argumen terakhir `string.format`, jadi semua nilai dimajukan.', '`...` is `string.format`’s last argument, so every value is forwarded.'],
        ['5–7', 'Dua, satu dan sifar nilai tambahan; `%%` memberi tanda peratus.', 'Two, one and zero extra values; `%%` gives a percent sign.']),
      CODE('pack-unpack', 'luau', 'luau', ['table.pack dan table.unpack dengan nil', 'table.pack and table.unpack with nils'], `
local queue = {}

local function later(fn, ...)
  table.insert(queue, {fn = fn, args = table.pack(...)})
end

later(print, "first", 1)
later(print, "trailing nil:", nil)
later(print, nil, "leading nil")

for _, job in queue do
  job.fn(table.unpack(job.args, 1, job.args.n))
end
print("jobs run:", #queue)
`, 'first\t1\ntrailing nil:\tnil\nnil\tleading nil\njobs run:\t3', {
        debug: BUG(`
local function nth(n: number, ...)
  return (select(n, ...))
end
print(nth(0, "a", "b"))
`, "example:2: invalid argument #1 to 'select' (index out of range)",
          '`select(0, ...)` tidak sah: indeks mesti positif (dari permulaan) atau negatif (dari hujung). Argumen **#1** ialah indeks itu. Sahkan julat sebelum memanggil: `if n < 1 or n > select("#", ...) then return nil end`.',
          '`select(0, ...)` is invalid: the index must be positive (from the start) or negative (from the end). Argument **#1** is that index. Validate the range before calling: `if n < 1 or n > select("#", ...) then return nil end`.'),
      }),
      EXPLAIN('pack-unpack',
        ['1–5', 'Simpan fungsi dan argumennya dengan `table.pack`, termasuk bilangan `n`.', 'Store a function and its arguments with `table.pack`, including the count `n`.'],
        ['7–9', 'Tiga tugas, dua dengan `nil` di hujung atau di hadapan.', 'Three jobs, two with a `nil` at the end or the start.'],
        ['11–14', '`table.unpack(args, 1, args.n)` memulihkan setiap argumen dengan tepat, termasuk `nil`.', '`table.unpack(args, 1, args.n)` restores every argument exactly, including `nil`s.'])),
    S('line_by_line',
      EXPLAIN('vararg-sum',
        ['3', 'Iterasi umum atas `{...}` melangkau `nil`; untuk jumlah ini tidak penting, tetapi untuk menghitung kedudukan gunakan `select("#", ...)`.', 'Generalized iteration over `{...}` skips `nil`s; for a sum that does not matter, but for counting positions use `select("#", ...)`.']),
      EXPLAIN('pack-unpack',
        ['4', '`table.pack(...)` menyimpan `n` = bilangan sebenar — tanpanya, `nil` di hujung akan hilang.', '`table.pack(...)` stores `n` = the true count — without it, trailing `nil`s would be lost.'])),
    S('why_this_way',
      P('Mengapa variadic? Untuk fungsi yang secara semula jadi menerima "beberapa" nilai — jumlah, log, pemformatan — tanpa memaksa pemanggil membina table. Mengapa `table.pack`? Kerana `nil` ialah nilai yang sah, dan fungsi yang menyimpan argumen tidak boleh mengandaikan tiada `nil`.',
        'Why varargs? For functions that naturally take "some" values — sums, logs, formatting — without forcing callers to build a table. Why `table.pack`? Because `nil` is a valid value, and a function that stores arguments cannot assume there are none.'),
      P('Gunakan `...` **apabila** semua argumen tambahan mempunyai peranan yang sama; gunakan parameter bernama **apabila** setiap argumen mempunyai makna berbeza; gunakan `table.pack` **apabila** argumen disimpan untuk kemudian.', 'Use `...` **when** all extra arguments play the same role; use named parameters **when** each argument means something different; use `table.pack` **when** arguments are stored for later.')),
    S('execution_flow',
      OL(
        ['`later(print, "trailing nil:", nil)` → `table.pack("trailing nil:", nil)` → `{"trailing nil:", n = 2}`.', '`later(print, "trailing nil:", nil)` → `table.pack("trailing nil:", nil)` → `{"trailing nil:", n = 2}`.'],
        ['Gelung: `table.unpack(args, 1, 2)` → "trailing nil:", `nil`.', 'The loop: `table.unpack(args, 1, 2)` → "trailing nil:", `nil`.'],
        ['`print("trailing nil:", nil)` → dua lajur.', '`print("trailing nil:", nil)` → two columns.'],
      )),
    S('memory_behaviour',
      P('`...` sendiri tidak memperuntukkan table; `{...}` dan `table.pack(...)` memperuntukkan satu. Dalam baris gilir tugas, setiap tugas memegang table argumennya sehingga baris gilir dikosongkan — kosongkan selepas menjalankan untuk membenarkan pengutipan.', '`...` itself allocates no table; `{...}` and `table.pack(...)` allocate one. In a job queue, each job holds its argument table until the queue is cleared — clear it after running to allow collection.')),
    S('alternative_implementations',
      P('Gelung `select` untuk melawati setiap argumen, termasuk `nil`, tanpa mencipta table:', 'A `select` loop to visit every argument, including `nil`s, without creating a table:'),
      CODE('select-loop', 'luau', 'luau', ['Melawati setiap argumen', 'Visiting every argument'], `
local function describeArgs(...)
  for i = 1, select("#", ...) do
    local v = (select(i, ...))
    print(i, typeof(v))
  end
end

describeArgs(42, nil, "x")
`, '1\tnumber\n2\tnil\n3\tstring'),
      EXPLAIN('select-loop',
        ['1–6', 'Kiraan sebenar dengan `select("#")`; kurungan mengambil hanya argumen ke-i.', 'The true count with `select("#")`; the parentheses take only the i-th argument.'],
        ['8', 'Tiga argumen, termasuk `nil` di tengah.', 'Three arguments, including a `nil` in the middle.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan `...` dalam fungsi yang tidak mengisytiharkannya.', 'Using `...` in a function that does not declare it.'],
        ['Mengira argumen dengan `#{...}` apabila `nil` mungkin.', 'Counting arguments with `#{...}` when `nil`s are possible.'],
        ['`table.unpack(t)` tanpa julat selepas `table.pack`.', '`table.unpack(t)` without a range after `table.pack`.'],
        ['`select(0, ...)` atau indeks melebihi bilangan.', '`select(0, ...)` or an index beyond the count.'],
      )),
    S('debugging',
      P('Untuk melihat apa yang diterima oleh fungsi variadic, cetak `select("#", ...)` dan `...` pada baris pertamanya. Jika argumen nampak "hilang", semak sama ada anda menggunakan `{...}` dengan `#` atau `ipairs`, yang tidak menghitung `nil`. Jika panggilan yang dimainkan semula berbeza daripada asal, semak bahawa anda menggunakan `table.unpack(t, 1, t.n)`. Contoh berikut menunjukkan pengesah argumen variadic:',
        'To see what a variadic function receives, print `select("#", ...)` and `...` on its first line. If arguments seem "missing", check whether you used `{...}` with `#` or `ipairs`, which do not count `nil`s. If a replayed call differs from the original, check that you used `table.unpack(t, 1, t.n)`. The following example shows a validator for variadic arguments:'),
      CODE('vararg-validate', 'luau', 'luau', ['Mengesahkan argumen variadic', 'Validating variadic arguments'], `
local function average(...: number): (number?, string?)
  local count = select("#", ...)
  if count == 0 then return nil, "no values" end
  local total = 0
  for i = 1, count do
    local v = (select(i, ...))
    if typeof(v) ~= "number" then
      return nil, \`argument {i} is {typeof(v)}\`
    end
    total += v
  end
  return total / count, nil
end

print(average(4, 8, 12))
print(average())
print(average(1, "2", 3))
`, '8\tnil\nnil\tno values\nnil\targument 2 is string'),
      EXPLAIN('vararg-validate',
        ['1–3', 'Tolak senarai kosong.', 'Reject an empty list.'],
        ['4–11', 'Semak jenis setiap argumen secara runtime — anotasi `...: number` tidak melakukannya.', 'Check each argument’s type at run time — the `...: number` annotation does not.'],
        ['12', 'Purata.', 'The average.'],
        ['15–17', 'Tiga kes.', 'Three cases.'])),
    S('performance',
      P('Memanggil fungsi variadic hampir sama pantas dengan fungsi biasa. `{...}` dan `table.pack` memperuntukkan table; `select(i, ...)` dalam gelung menyalin argumen yang tinggal setiap kali (O(n²) untuk banyak argumen). Untuk beberapa argumen, mana-mana pendekatan pantas; untuk puluhan, satu `table.pack` lebih baik.', 'Calling a variadic function is almost as fast as an ordinary one. `{...}` and `table.pack` allocate a table; `select(i, ...)` in a loop copies the remaining arguments each time (O(n²) for many arguments). For a few arguments any approach is fast; for dozens, one `table.pack` is better.')),
    S('software_engineering',
      P('Table yang dibina oleh pemanggil berbanding fungsi variadic:', 'A caller-built table versus a variadic function:'),
      CODE('poor-table-arg', 'luau', 'luau', ['Pelaksanaan lemah: pemanggil membina table', 'Poor implementation: callers build tables'], `
local function largest(values: {number}): number
  local best = values[1]
  for _, v in values do
    if v > best then best = v end
  end
  return best
end

print(largest({4, 17, 9}))
print(largest({3}))
`, '17\n3'),
      EXPLAIN('poor-table-arg',
        ['1–7', 'Fungsi memerlukan table, jadi setiap panggilan mencipta satu dan pembaca melihat kurungan kerinting di mana-mana.', 'The function needs a table, so every call creates one and readers see braces everywhere.'],
        ['9–10', 'Berfungsi, tetapi tidak semula jadi untuk beberapa nilai.', 'It works, but it is not natural for a few values.']),
      CODE('improved-vararg-api', 'luau', 'luau', ['Pelaksanaan lebih baik: API variadic', 'Improved implementation: a variadic API'], `
local function largest(first: number, ...: number): number
  local best = first
  for _, v in {...} do
    if v > best then best = v end
  end
  return best
end

print(largest(4, 17, 9))
print(largest(3))
`, '17\n3'),
      EXPLAIN('improved-vararg-api',
        ['1–7', 'Parameter pertama wajib menjamin sekurang-kurangnya satu nilai; selebihnya variadic.', 'A required first parameter guarantees at least one value; the rest are variadic.'],
        ['9–10', 'Panggilan seperti `math.max`.', 'Calls like `math.max`.'])),
    S('industry_use_cases',
      UL(
        ['Modul log Roblox meniru `print` dengan `...` dan menambah tahap serta cap masa.', 'Roblox logging modules imitate `print` with `...` and add levels and timestamps.'],
        ['Pustaka isyarat (signal) menyimpan argumen event dengan `table.pack` untuk penghantaran kemudian.', 'Signal libraries store event arguments with `table.pack` for deferred delivery.'],
        ['Pembalut prestasi memajukan `...` kepada fungsi asal dan mengukur masanya.', 'Profiling wrappers forward `...` to the original function and measure its time.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis `count(...)` yang memulangkan bilangan argumen, termasuk `nil`.', 'Write `count(...)` returning the number of arguments, including `nil`s.'],
        ['Tambah tugas `later(print)` tanpa argumen pada `pack-unpack`; apakah outputnya?', 'Add a job `later(print)` with no arguments to `pack-unpack`; what is its output?'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Perakam panggilan.** Tulis `record(fn)` yang memulangkan fungsi baharu: ia merekod setiap panggilan (argumen penuh dengan `table.pack`) dan memajukan panggilan kepada `fn`. Paparkan sejarah selepas beberapa panggilan.', '**A call recorder.** Write `record(fn)` returning a new function: it records every call (full arguments with `table.pack`) and forwards the call to `fn`. Display the history after a few calls.'),
      CODE('call-recorder', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function record(fn)
  local history = {}
  local function wrapper(...)
    table.insert(history, table.pack(...))
    return fn(...)
  end
  return wrapper, history
end

local add, history = record(function(a, b) return a + b end)
print(add(2, 3), add(10, 20))
for i, call in history do
  local parts = {}
  for j = 1, call.n do parts[j] = tostring(call[j]) end
  print(\`call {i}: ({table.concat(parts, ", ")})\`)
end
`, '5\t30\ncall 1: (2, 3)\ncall 2: (10, 20)'),
      EXPLAIN('call-recorder',
        ['1–8', '`record` mencipta senarai sejarah dan pembalut variadic yang merekod dan memajukan; ia memulangkan kedua-duanya.', '`record` creates a history list and a variadic wrapper that records and forwards; it returns both.'],
        ['10–11', 'Dua panggilan melalui pembalut.', 'Two calls through the wrapper.'],
        ['12–16', 'Paparkan setiap panggilan dengan argumennya, menggunakan `call.n`.', 'Display every call with its arguments, using `call.n`.'])),
    S('summary',
      UL(
        ['`...` dalam parameter (dengan anotasi `...: T` pilihan) menjadikan fungsi variadic.', '`...` in the parameters (with an optional `...: T` annotation) makes a function variadic.'],
        ['`select("#", ...)` mengira dengan betul; `{...}` boleh tersilap dengan `nil`.', '`select("#", ...)` counts correctly; `{...}` can be wrong with `nil`s.'],
        ['`table.pack` + `table.unpack(t, 1, t.n)` menyimpan dan memulihkan tanpa kehilangan.', '`table.pack` + `table.unpack(t, 1, t.n)` store and restore without loss.'],
        ['Majukan `...` sebagai argumen terakhir.', 'Forward `...` as the last argument.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah `select("#", nil, nil)`?', 'What is `select("#", nil, nil)`?'],
        ['Mengapakah `table.pack` mempunyai medan `n`?', 'Why does `table.pack` have an `n` field?'],
        ['Adakah anotasi `...: number` menolak string semasa runtime?', 'Does the annotation `...: number` reject strings at run time?'],
        ['Apakah mesej Luau apabila `...` digunakan dalam fungsi bukan variadic?', 'What is Luau’s message when `...` is used in a non-variadic function?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Functions (variadic functions)', url: `${DOCS}/luau/functions#variadic-functions` },
        { title: 'Luau — Type checking: variadic types', url: `${LUAU}/typecheck#variadic-types` },
        { title: 'Luau — Library (select, table.pack, table.unpack)', url: `${LUAU}/library` },
        { title: 'Lua 5.1 Reference Manual §2.5.9 — Function Definitions (vararg)', url: 'https://www.lua.org/manual/5.1/manual.html#2.5.9' },
      )),
  ],
};

export const LUAU103_M3 = [LUAU103_3_1, LUAU103_3_2, LUAU103_3_3];
