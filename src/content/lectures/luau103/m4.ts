import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU103 · Module 4 — Closures (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 4.1 Closures and upvalues ─────────────────────────────────────────────

export const LUAU103_4_1: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 4,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan [[closure]] dan [[upvalue]] dalam Luau.', 'Explain [[closure|closures]] and [[upvalue|upvalues]] in Luau.'],
        ['Menulis kilang fungsi yang menyimpan keadaan peribadi.', 'Write function factories that hold private state.'],
        ['Meramal sama ada closure berkongsi atau mempunyai upvalue berasingan.', 'Predict whether closures share or have separate upvalues.'],
        ['Menggunakan closure dalam gelung dengan betul.', 'Use closures in loops correctly.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 3: fungsi, nilai pulangan dan varargs.', 'Module 3: functions, return values and varargs.'],
        ['LUAU102 1.1: skop local.', 'LUAU102 1.1: local scope.'],
      )),
    S('introduction',
      P('Dalam Roblox, hampir setiap pengendali event ialah closure: `button.Activated:Connect(function() … end)` mencipta fungsi yang mengingati pemboleh ubah di sekelilingnya — pemain mana, butang mana, berapa kali diklik. Closure ialah fungsi bersama pemboleh ubah luar yang digunakannya (upvalue). Upvalue kekal hidup selepas fungsi luar tamat, jadi closure boleh menyimpan keadaan **peribadi** tanpa global atau table yang terdedah. Kuliah ini menerangkan cara ia berfungsi dalam Luau tulen, supaya anda boleh menggunakannya dengan yakin dalam skrip Roblox kemudian.',
        'In Roblox, almost every event handler is a closure: `button.Activated:Connect(function() … end)` creates a function that remembers the variables around it — which player, which button, how many clicks. A closure is a function together with the outer variables it uses (upvalues). Upvalues stay alive after the outer function returns, so closures can hold **private** state without globals or exposed tables. This lecture explains how this works in pure Luau, so you can use it confidently in Roblox scripts later.'),
      KEY('Fungsi dalaman + local luar yang digunakannya = closure. Setiap panggilan kilang mencipta set upvalue baharu.', 'Inner function + the outer locals it uses = a closure. Every factory call creates a new set of upvalues.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Upvalue:** local fungsi luar yang dirujuk oleh fungsi dalaman.', '**Upvalue:** a local of an outer function referred to by an inner function.'],
        ['**Closure:** nilai fungsi + upvalue-nya; dicipta setiap kali ungkapan `function` dijalankan.', '**Closure:** a function value + its upvalues; created every time a `function` expression runs.'],
        ['Upvalue ialah **pemboleh ubah**, bukan salinan: perubahan dilihat oleh semua closure yang berkongsi.', 'An upvalue is a **variable**, not a copy: changes are seen by every closure sharing it.'],
        ['Setiap pusingan `for` mencipta pemboleh ubah gelung baharu, jadi closure dalam gelung menangkap nilai berbeza.', 'Every `for` pass creates a new loop variable, so closures in a loop capture different values.'],
        ['Pemboleh ubah mesti diisytiharkan **sebelum** fungsi yang menggunakannya untuk menjadi upvalue.', 'A variable must be declared **before** the function that uses it to become an upvalue.'],
      )),
    S('detailed_theory',
      P('Apabila Luau mengkompil fungsi dalaman yang merujuk local fungsi luar, ia merekodkan rujukan kepada **pemboleh ubah** itu. Semasa fungsi luar masih berjalan, pemboleh ubah berada pada timbunan; apabila ia pulang, Luau memindahkan nilai ke objek upvalue di heap supaya closure masih boleh membaca dan menulisnya. Dua closure yang dicipta dalam panggilan yang sama berkongsi upvalue yang sama — satu boleh menambah, yang lain melihat hasilnya. Panggilan kilang yang berasingan mencipta pemboleh ubah berasingan, jadi setiap kaunter mempunyai kiraan sendiri.',
        'When Luau compiles an inner function that refers to an outer function’s local, it records a reference to that **variable**. While the outer function is still running, the variable lives on the stack; when it returns, Luau moves the value into an upvalue object on the heap so the closure can still read and write it. Two closures created in the same call share the same upvalue — one can increment, the other sees the result. Separate factory calls create separate variables, so every counter has its own count.'),
      P('Gelung `for` Luau mencipta pemboleh ubah gelung **baharu** pada setiap pusingan, jadi `for i = 1, 3 do fns[i] = function() return i end end` memberi tiga closure dengan `i` yang berbeza (1, 2, 3). Sebaliknya, closure yang menangkap pemboleh ubah yang diisytiharkan di luar gelung `while` semuanya berkongsi satu pemboleh ubah dan melihat nilai akhirnya. Skop leksikal juga bermakna susunan dalam teks penting: jika `local total = 0` ditulis **selepas** fungsi yang menggunakan `total`, nama itu dalam fungsi merujuk global `nil` — bukan upvalue — dan ralat muncul semasa runtime.',
        'Luau’s `for` loop creates a **new** loop variable on every pass, so `for i = 1, 3 do fns[i] = function() return i end end` gives three closures with different `i`s (1, 2, 3). By contrast, closures capturing a variable declared outside a `while` loop all share one variable and see its final value. Lexical scope also means order in the text matters: if `local total = 0` is written **after** a function that uses `total`, the name inside the function refers to a `nil` global — not an upvalue — and the error appears at run time.')),
    S('technical_terminology', TERMS('closure', 'upvalue', 'scope', 'first-class-function')),
    S('syntax_rules',
      UL(
        ['Kilang: `local function makeX() local state = … return function() … state … end end`.', 'Factory: `local function makeX() local state = … return function() … state … end end`.'],
        ['Panggil kilang dengan `()`: `local counter = makeCounter()`.', 'Call the factory with `()`: `local counter = makeCounter()`.'],
        ['Beberapa closure berkongsi: pulangkan table `{inc = …, get = …}` daripada satu panggilan.', 'Several sharing closures: return a table `{inc = …, get = …}` from one call.'],
      )),
    S('code_demonstration',
      CODE('click-counter', 'luau', 'luau', ['Kaunter klik dengan keadaan peribadi', 'A click counter with private state'], `
local function makeClickCounter(label: string)
  local clicks = 0
  return function(): string
    clicks += 1
    return \`{label} clicked {clicks} time(s)\`
  end
end

local playClick = makeClickCounter("Play")
local shopClick = makeClickCounter("Shop")
print(playClick())
print(playClick())
print(shopClick())
`, 'Play clicked 1 time(s)\nPlay clicked 2 time(s)\nShop clicked 1 time(s)'),
      EXPLAIN('click-counter',
        ['1–2', '`label` (parameter) dan `clicks` (local) ialah local `makeClickCounter`.', '`label` (a parameter) and `clicks` (a local) are locals of `makeClickCounter`.'],
        ['3–6', 'Fungsi dalaman menggunakan kedua-duanya — ia menjadi upvalue dan kekal hidup.', 'The inner function uses both — they become upvalues and stay alive.'],
        ['9–13', 'Dua panggilan kilang → dua `clicks` berasingan; kaunter "Play" sampai 2, "Shop" bermula semula pada 1.', 'Two factory calls → two separate `clicks`; the "Play" counter reaches 2, "Shop" starts again at 1.'])),
    S('complete_examples',
      CODE('shared-state', 'luau', 'luau', ['Closure yang berkongsi keadaan', 'Closures sharing state'], `
local function makeHealth(maxHp: number)
  local hp = maxHp
  local function damage(n: number) hp = math.max(hp - n, 0) end
  local function heal(n: number) hp = math.min(hp + n, maxHp) end
  local function get(): number return hp end
  return {damage = damage, heal = heal, get = get}
end

local player = makeHealth(100)
player.damage(30)
player.heal(10)
player.damage(200)
print(player.get())
local boss = makeHealth(500)
print(boss.get(), player.get())
`, '0\n500\t0', {
        debug: BUG(`
local function makeCounter()
  local n = 0
  return function() n += 1; return n end
end
local counter = makeCounter
print(counter() + 1)
`, 'example:6: attempt to perform arithmetic (add) on function and number',
          '`makeCounter` diberikan tanpa dipanggil, jadi `counter` ialah kilang itu sendiri. `counter()` memulangkan fungsi kaunter (bukan nombor), dan `fungsi + 1` gagal. Luau menyebut `function and number` — petunjuk bahawa ada fungsi di tempat yang menjangka nilai. Panggil kilang: `local counter = makeCounter()`.',
          '`makeCounter` was assigned without being called, so `counter` is the factory itself. `counter()` returns the counter function (not a number), and `function + 1` fails. Luau says `function and number` — a clue that there is a function where a value was expected. Call the factory: `local counter = makeCounter()`.'),
      }),
      EXPLAIN('shared-state',
        ['1–2', 'Satu upvalue `hp` (dan `maxHp`).', 'One upvalue `hp` (and `maxHp`).'],
        ['3–6', 'Tiga closure yang dicipta dalam panggilan yang **sama** — semuanya berkongsi `hp` yang sama.', 'Three closures created in the **same** call — they all share the same `hp`.'],
        ['9–13', '100 − 30 + 10 − 200 → 0 (dihadkan).', '100 − 30 + 10 − 200 → 0 (clamped).'],
        ['14–15', 'Panggilan kilang kedua → `hp` baharu yang berasingan (500).', 'A second factory call → a new, separate `hp` (500).']),
      CODE('loop-capture', 'luau', 'luau', ['Closure dalam gelung', 'Closures in loops'], `
local buttons = {}
for slot = 1, 3 do
  buttons[slot] = function() return \`slot {slot} pressed\` end
end
print(buttons[1](), buttons[3]())

local callbacks = {}
local wave = 0
while wave < 3 do
  wave += 1
  callbacks[wave] = function() return \`wave {wave}\` end
end
print(callbacks[1](), callbacks[3]())
`, 'slot 1 pressed\tslot 3 pressed\nwave 3\twave 3', {
        debug: BUG(`
local function addPoints(n: number)
  total += n
end
local total = 0
addPoints(5)
`, 'example:2: attempt to perform arithmetic (add) on nil and number',
          '`local total` diisytiharkan **selepas** fungsi. Apabila `addPoints` dikompil, tiada local `total` dalam skop, jadi nama itu merujuk global (`nil`) — bukan upvalue. Isytiharkan pemboleh ubah sebelum fungsi yang menggunakannya.',
          '`local total` is declared **after** the function. When `addPoints` is compiled there is no local `total` in scope, so the name refers to a global (`nil`) — not an upvalue. Declare the variable before the function that uses it.'),
      }),
      EXPLAIN('loop-capture',
        ['1–5', '`for` mencipta `slot` baharu setiap pusingan: setiap closure mengingati slotnya sendiri.', '`for` creates a new `slot` every pass: each closure remembers its own slot.'],
        ['7–13', '`wave` diisytiharkan **sekali** di luar gelung `while`: ketiga-tiga closure berkongsinya dan melihat nilai akhir 3.', '`wave` is declared **once** outside the `while` loop: all three closures share it and see the final value 3.'])),
    S('line_by_line',
      EXPLAIN('click-counter',
        ['4', '`clicks += 1` menulis ke upvalue — nilai baharu kekal untuk panggilan seterusnya kaunter yang **sama**.', '`clicks += 1` writes to the upvalue — the new value persists for the next call of the **same** counter.']),
      EXPLAIN('loop-capture',
        ['11', 'Untuk memberi setiap closure nilainya sendiri dalam `while`, salin dahulu: `local w = wave` di dalam badan, dan gunakan `w`.', 'To give each closure its own value in a `while`, copy first: `local w = wave` inside the body, and use `w`.'])),
    S('why_this_way',
      P('Mengapa closure? Kerana ia memberikan keadaan peribadi tanpa sintaks kelas: hanya fungsi yang anda pulangkan boleh menukar `hp`, jadi tiada kod lain boleh menetapkannya kepada nilai yang tidak sah. Dalam Roblox, closure membolehkan setiap pengendali event mengingati konteksnya sendiri tanpa global.',
        'Why closures? Because they give private state without class syntax: only the functions you return can change `hp`, so no other code can set it to an invalid value. In Roblox, closures let every event handler remember its own context without globals.'),
      P('Gunakan closure **apabila** sekeping keadaan kecil hanya perlu diakses oleh beberapa fungsi; gunakan table terbuka **apabila** keadaan perlu diperiksa atau disimpan dari luar.', 'Use closures **when** a small piece of state should only be accessed by a few functions; use an open table **when** state must be inspected or saved from outside.')),
    S('execution_flow',
      OL(
        ['`makeClickCounter("Play")`: `clicks = 0` dicipta; closure dipulangkan; kilang tamat — `clicks` dipindahkan ke heap.', '`makeClickCounter("Play")`: `clicks = 0` is created; a closure is returned; the factory ends — `clicks` moves to the heap.'],
        ['`playClick()` dua kali: upvalue yang sama menjadi 1, kemudian 2.', '`playClick()` twice: the same upvalue becomes 1, then 2.'],
        ['`makeClickCounter("Shop")` mencipta `clicks` baharu = 0; `shopClick()` → 1.', '`makeClickCounter("Shop")` creates a new `clicks` = 0; `shopClick()` → 1.'],
      )),
    S('memory_behaviour',
      P('Setiap closure ialah objek heap kecil yang merujuk upvalue-nya; upvalue hidup selagi sekurang-kurangnya satu closure merujuknya. Dalam Roblox, closure yang disambungkan kepada event kekal hidup sehingga sambungan diputuskan atau objek dimusnahkan — dan semua yang ditangkapnya (termasuk table besar) juga kekal. Ini punca kebocoran memori yang biasa (LUAU203).', 'Every closure is a small heap object that refers to its upvalues; an upvalue lives as long as at least one closure refers to it. In Roblox, a closure connected to an event stays alive until the connection is disconnected or the object is destroyed — and everything it captured (including large tables) stays too. This is a common memory-leak source (LUAU203).')),
    S('alternative_implementations',
      P('Keadaan yang sama dalam table terbuka — mudah diperiksa, tetapi tiada perlindungan:', 'The same state in an open table — easy to inspect, but unprotected:'),
      CODE('open-state', 'luau', 'luau', ['Keadaan dalam table terbuka', 'State in an open table'], `
local health = {hp = 100, maxHp = 100}

local function damage(h, n: number)
  h.hp = math.max(h.hp - n, 0)
end

damage(health, 30)
health.hp = 9999
print(health.hp)
`, '9999'),
      EXPLAIN('open-state',
        ['1–5', 'Keadaan dalam table yang boleh dibaca dan ditulis oleh sesiapa.', 'State in a table anyone can read and write.'],
        ['7–9', 'Mana-mana kod boleh menetapkan `hp = 9999`, melangkau had. Dengan closure (`shared-state`), ini mustahil.', 'Any code can set `hp = 9999`, bypassing the cap. With closures (`shared-state`), this is impossible.'])),
    S('common_mistakes',
      UL(
        ['Lupa memanggil kilang (`makeCounter` dan bukan `makeCounter()`).', 'Forgetting to call the factory (`makeCounter` instead of `makeCounter()`).'],
        ['Mengisytiharkan local selepas fungsi yang menggunakannya.', 'Declaring a local after the function that uses it.'],
        ['Menjangka closure dalam `while` menangkap nilai berbeza tanpa salinan local.', 'Expecting closures in a `while` to capture different values without a local copy.'],
        ['Menyimpan closure selama-lamanya dan menyimpan table besar yang ditangkapnya hidup.', 'Keeping closures forever and keeping the large tables they capture alive.'],
      )),
    S('debugging',
      P('Apabila closure melihat nilai yang tidak dijangka, tanya: "pemboleh ubah mana yang ditangkap, dan siapa lagi yang menangkapnya?" Jika beberapa closure berkelakuan sebagai satu, ia berkongsi pemboleh ubah. Jika closure melihat `nil` global, pemboleh ubah diisytiharkan selepas fungsi. Mesej `arithmetic (…) on function and …` bermakna anda mempunyai kilang dan bukannya fungsi yang dihasilkannya. Contoh berikut membetulkan masalah `while` dengan salinan local:',
        'When a closure sees an unexpected value, ask: "which variable was captured, and who else captured it?" If several closures behave as one, they share a variable. If a closure sees a `nil` global, the variable was declared after the function. The message `arithmetic (…) on function and …` means you have the factory instead of the function it produces. The following example fixes the `while` problem with a local copy:'),
      CODE('fresh-copy', 'luau', 'luau', ['Salinan local untuk setiap closure', 'A local copy for each closure'], `
local tips = {}
local n = 0
while n < 3 do
  n += 1
  local tipNumber = n
  tips[n] = function() return \`tip #{tipNumber}\` end
end
print(tips[1](), tips[2](), tips[3]())
`, 'tip #1\ttip #2\ttip #3'),
      EXPLAIN('fresh-copy',
        ['1–2', 'Senarai closure dan kaunter yang dikongsi.', 'A list of closures and a shared counter.'],
        ['3–7', '`local tipNumber = n` mencipta pemboleh ubah baharu dalam setiap pusingan; setiap closure menangkap salinannya sendiri.', '`local tipNumber = n` creates a new variable in every pass; each closure captures its own copy.'],
        ['8', 'Tiga nilai berbeza.', 'Three different values.'])),
    S('performance',
      P('Membaca upvalue hampir sepantas membaca local. Mencipta closure memperuntukkan objek kecil — murah, tetapi jangan cipta closure baharu dalam gelung panas jika satu fungsi boleh dikongsi. Luau juga boleh berkongsi closure yang tidak menangkap apa-apa yang berubah, mengurangkan peruntukan secara automatik.', 'Reading an upvalue is almost as fast as reading a local. Creating a closure allocates a small object — cheap, but do not create new closures in hot loops if one function could be shared. Luau can also share closures that capture nothing changing, reducing allocations automatically.')),
    S('software_engineering',
      P('Kaunter global berbanding kaunter peribadi:', 'A global counter versus a private counter:'),
      CODE('poor-global-ids', 'luau', 'luau', ['Pelaksanaan lemah: ID global', 'Poor implementation: global IDs'], `
nextOrderId = 0
local function newOrderId(): string
  nextOrderId += 1
  return \`order-{nextOrderId}\`
end
print(newOrderId(), newOrderId())
nextOrderId = 0
print(newOrderId())
`, 'order-1\torder-2\norder-1'),
      EXPLAIN('poor-global-ids',
        ['1–6', 'Kaunter ialah global.', 'The counter is a global.'],
        ['7–8', 'Kod lain menetapkannya semula, dan ID pendua "order-1" dikeluarkan.', 'Other code resets it, and a duplicate ID "order-1" is issued.']),
      CODE('improved-private-ids', 'luau', 'luau', ['Pelaksanaan lebih baik: penjana peribadi', 'Improved implementation: a private generator'], `
local function makeIdGenerator(prefix: string): () -> string
  local nextId = 0
  return function(): string
    nextId += 1
    return \`{prefix}-{nextId}\`
  end
end

local newOrderId = makeIdGenerator("order")
local newTicketId = makeIdGenerator("ticket")
print(newOrderId(), newOrderId(), newTicketId())
`, 'order-1\torder-2\tticket-1'),
      EXPLAIN('improved-private-ids',
        ['1–7', 'Jenis pulangan `() -> string`: fungsi tanpa argumen yang memulangkan string. `nextId` ialah upvalue peribadi.', 'The return type `() -> string`: a function with no arguments returning a string. `nextId` is a private upvalue.'],
        ['9–11', 'Dua penjana bebas; tiada kod lain boleh menetapkan semula kaunter.', 'Two independent generators; no other code can reset a counter.'])),
    S('industry_use_cases',
      UL(
        ['Pengendali event Roblox menangkap pemain, butang dan konteks lain sebagai upvalue.', 'Roblox event handlers capture the player, the button and other context as upvalues.'],
        ['Fungsi "debounce" (menghalang pencetus berulang) dibina dengan closure dan upvalue masa terakhir.', '"Debounce" functions (preventing repeated triggers) are built with a closure and a last-time upvalue.'],
        ['ModuleScript menyimpan keadaan peribadi sebagai local fail yang ditangkap oleh fungsi awam.', 'ModuleScripts keep private state as file locals captured by public functions.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah fungsi `reset` pada `makeClickCounter` (pulangkan table dengan `click` dan `reset`).', 'Add a `reset` function to `makeClickCounter` (return a table with `click` and `reset`).'],
        ['Dalam `loop-capture`, gunakan salinan local dalam `while` dan ramalkan output baharu.', 'In `loop-capture`, use a local copy in the `while` and predict the new output.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Debounce dalam Luau tulen.** Tulis `makeDebounce(cooldown)` yang memulangkan fungsi `try(now)`: ia memulangkan `true` hanya jika sekurang-kurangnya `cooldown` saat telah berlalu sejak percubaan berjaya terakhir. Gunakan masa yang diberi (bukan jam sebenar) supaya ia boleh diuji.', '**A debounce in pure Luau.** Write `makeDebounce(cooldown)` returning a function `try(now)`: it returns `true` only if at least `cooldown` seconds have passed since the last successful try. Use given times (not a real clock) so it can be tested.'),
      CODE('debounce', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function makeDebounce(cooldown: number): (number) -> boolean
  local lastSuccess = -math.huge
  return function(now: number): boolean
    if now - lastSuccess < cooldown then
      return false
    end
    lastSuccess = now
    return true
  end
end

local tryJump = makeDebounce(1.5)
local results = {}
for _, t in {0, 0.5, 1.6, 2.0, 3.2} do
  table.insert(results, \`{t}:{tryJump(t)}\`)
end
print(table.concat(results, " "))
`, '0:true 0.5:false 1.6:true 2:false 3.2:true'),
      EXPLAIN('debounce',
        ['1–2', 'Upvalue `lastSuccess` bermula pada −∞ supaya percubaan pertama sentiasa berjaya.', 'The upvalue `lastSuccess` starts at −∞ so the first try always succeeds.'],
        ['3–9', 'Tolak jika terlalu awal; jika tidak, rekod masa dan benarkan.', 'Reject if too early; otherwise record the time and allow.'],
        ['12–17', 'Lima percubaan pada masa tetap: 0 ✓, 0.5 ✗, 1.6 ✓, 2.0 ✗ (hanya 0.4 sejak 1.6), 3.2 ✓. Dalam Roblox, `now` akan datang daripada `os.clock()`.', 'Five tries at fixed times: 0 ✓, 0.5 ✗, 1.6 ✓, 2.0 ✗ (only 0.4 since 1.6), 3.2 ✓. In Roblox, `now` would come from `os.clock()`.'])),
    S('summary',
      UL(
        ['Closure = fungsi + upvalue; upvalue kekal hidup selepas fungsi luar tamat.', 'Closure = function + upvalues; upvalues outlive the outer function.'],
        ['Panggilan kilang yang sama → upvalue dikongsi; panggilan berbeza → berasingan.', 'The same factory call → shared upvalues; different calls → separate ones.'],
        ['`for` memberi pemboleh ubah baharu setiap pusingan; dalam `while`, buat salinan local.', '`for` gives a new variable every pass; in a `while`, make a local copy.'],
        ['Isytiharkan pemboleh ubah sebelum fungsi yang menangkapnya.', 'Declare variables before the functions that capture them.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah `shopClick()` mencetak 1 walaupun `playClick()` dipanggil dua kali?', 'Why does `shopClick()` print 1 although `playClick()` was called twice?'],
        ['Mengapakah `callbacks[1]()` dalam `loop-capture` memberi "wave 3"?', 'Why does `callbacks[1]()` in `loop-capture` give "wave 3"?'],
        ['Apakah perbezaan antara `local c = make` dan `local c = make()`?', 'What is the difference between `local c = make` and `local c = make()`?'],
        ['Bagaimanakah closure boleh menyebabkan kebocoran memori dalam Roblox?', 'How can closures cause memory leaks in Roblox?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Scope (closures)', url: `${DOCS}/luau/scope` },
        { title: 'Luau — Performance (closure caching)', url: `${LUAU}/performance` },
        { title: 'Programming in Lua (1st ed.) — 6.1 Closures', url: 'https://www.lua.org/pil/6.1.html' },
        { title: 'Lua 5.1 Reference Manual §2.6 — Visibility Rules', url: 'https://www.lua.org/manual/5.1/manual.html#2.6' },
      )),
  ],
};

// ─── 4.2 Functions as arguments and callbacks ──────────────────────────────

export const LUAU103_4_2: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 4,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menghantar fungsi sebagai argumen ([[callback|callback]]) dan menganotasi jenisnya `(T) -> R`.', 'Pass functions as arguments ([[callback|callbacks]]) and annotate their type `(T) -> R`.'],
        ['Menulis pembanding `table.sort` yang sah (ketat, konsisten).', 'Write valid `table.sort` comparators (strict, consistent).'],
        ['Membina sistem isyarat (signal) ringkas dengan `connect`, `fire` dan `disconnect` dalam Luau tulen.', 'Build a simple signal system with `connect`, `fire` and `disconnect` in pure Luau.'],
        ['Mengasingkan ralat dalam callback dengan `pcall`.', 'Isolate errors in callbacks with `pcall`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1: closure dan upvalue.', 'Lecture 4.1: closures and upvalues.'],
      )),
    S('introduction',
      P('Roblox ialah enjin berasaskan event: "apabila pemain menyertai", "apabila bahagian disentuh", "apabila butang diklik". Setiap satu berfungsi dengan menghantar **callback** — fungsi yang akan dipanggil kemudian — kepada `:Connect()`. Untuk memahami `Connect` dengan mendalam, kita akan membina mekanisme yang sama dalam Luau tulen: isyarat yang menyimpan senarai callback dan memanggilnya apabila "dicetuskan". Kita juga melihat callback dalam pustaka standard — `table.sort` — dan peraturan yang mesti dipatuhi oleh pembanding.',
        'Roblox is an event-based engine: "when a player joins", "when a part is touched", "when a button is clicked". Each works by passing a **callback** — a function to be called later — to `:Connect()`. To understand `Connect` deeply, we will build the same mechanism in pure Luau: a signal that stores a list of callbacks and calls them when "fired". We also look at callbacks in the standard library — `table.sort` — and the rules a comparator must follow.'),
      KEY('Callback = fungsi yang anda berikan supaya kod lain memanggilnya kemudian. Hantar `f`, bukan `f()`.', 'Callback = a function you hand over so other code calls it later. Pass `f`, not `f()`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Fungsi ialah nilai: boleh dihantar, disimpan dalam table, dan dipanggil kemudian.', 'Functions are values: they can be passed, stored in tables, and called later.'],
        ['Jenis fungsi: `(number) -> ()`, `(string, number) -> boolean`.', 'Function types: `(number) -> ()`, `(string, number) -> boolean`.'],
        ['Pembanding `table.sort(t, cmp)`: `cmp(a, b)` benar jika `a` mesti sebelum `b`; mesti ketat (`<`, bukan `<=`).', '`table.sort(t, cmp)` comparator: `cmp(a, b)` is true if `a` must come before `b`; it must be strict (`<`, not `<=`).'],
        ['Isyarat: senarai callback + `fire(...)` yang memanggil setiap satu.', 'Signal: a list of callbacks + a `fire(...)` that calls each one.'],
        ['Satu callback yang gagal tidak sepatutnya menghentikan yang lain — balut dengan `pcall`.', 'One failing callback should not stop the others — wrap with `pcall`.'],
      )),
    S('detailed_theory',
      P('Callback memisahkan **bila** sesuatu berlaku daripada **apa** yang dilakukan. Fungsi yang menerima callback — `table.sort`, `forEach`, isyarat — mengawal masa dan susunan panggilan; kod anda hanya menyediakan tindakan. Dalam Luau, anotasi jenis fungsi seperti `(item: string) -> boolean` mendokumenkan kontrak callback: argumen yang akan diterima dan nilai yang mesti dipulangkan. Kesilapan yang paling biasa ialah menghantar **hasil** panggilan dan bukannya fungsi: `apply(double(3))` menghantar 6, dan apabila `apply` cuba memanggilnya, ralatnya ialah `attempt to call a number value` — dilaporkan di dalam `apply`, jauh dari kesilapan sebenar.',
        'Callbacks separate **when** something happens from **what** is done. A function that receives a callback — `table.sort`, `forEach`, a signal — controls the timing and order of calls; your code only supplies the action. In Luau, function type annotations such as `(item: string) -> boolean` document the callback’s contract: the arguments it will receive and the value it must return. The most common mistake is passing the **result** of a call instead of the function: `apply(double(3))` passes 6, and when `apply` tries to call it the error is `attempt to call a number value` — reported inside `apply`, far from the real mistake.'),
      P('`table.sort` mempunyai kontrak yang ketat: pembanding mesti mentakrifkan susunan yang **konsisten** — jika `cmp(a, b)` benar, `cmp(b, a)` mesti palsu, dan `cmp(a, a)` mesti palsu. Pembanding yang menggunakan `<=` melanggar peraturan ini untuk elemen yang sama, dan dengan data tertentu algoritma isihan Luau mengesannya dan menimbulkan `invalid order function for sorting`. Ralat ini bergantung pada data, jadi ia mungkin tidak muncul dalam ujian kecil — tetapi muncul dalam permainan sebenar. Bagi isyarat, kontraknya lebih longgar tetapi satu prinsip penting: callback ialah kod orang lain; jika satu gagal, isyarat patut terus memanggil yang lain, seperti yang dilakukan oleh enjin Roblox.',
        '`table.sort` has a strict contract: the comparator must define a **consistent** order — if `cmp(a, b)` is true, `cmp(b, a)` must be false, and `cmp(a, a)` must be false. A comparator using `<=` breaks this rule for equal elements, and with certain data Luau’s sort algorithm detects it and raises `invalid order function for sorting`. This error depends on the data, so it may not appear in small tests — but it does in real games. For signals the contract is looser but one principle matters: callbacks are other people’s code; if one fails, the signal should keep calling the rest, as the Roblox engine does.')),
    S('technical_terminology', TERMS('callback', 'higher-order-function', 'function-type', 'event')),
    S('syntax_rules',
      UL(
        ['`local function forEach(list: {T}, fn: (T) -> ())` — callback bertaip (generik dalam LUAU kemudian).', '`local function forEach(list: {T}, fn: (T) -> ())` — a typed callback (generics later in LUAU).'],
        ['`table.sort(t, function(a, b) return a.score > b.score end)`.', '`table.sort(t, function(a, b) return a.score > b.score end)`.'],
        ['Hantar fungsi: `run(handler)`; bukan `run(handler())`.', 'Pass the function: `run(handler)`; not `run(handler())`.'],
      )),
    S('code_demonstration',
      CODE('callback-basics', 'luau', 'luau', ['Callback dalam pustaka dan fungsi sendiri', 'Callbacks in the library and in your own functions'], `
local function countWhere(list: {number}, predicate: (number) -> boolean): number
  local count = 0
  for _, v in list do
    if predicate(v) then count += 1 end
  end
  return count
end

local scores = {45, 88, 72, 30, 95}
print(countWhere(scores, function(s) return s >= 50 end))
print(countWhere(scores, function(s) return s % 2 == 0 end))

table.sort(scores, function(a, b) return a > b end)
print(table.concat(scores, " "))
`, '3\n3\n95 88 72 45 30'),
      EXPLAIN('callback-basics',
        ['1–7', '`countWhere` tidak tahu apa yang dikira — callback `predicate` memutuskan.', '`countWhere` does not know what it counts — the `predicate` callback decides.'],
        ['9–11', 'Dua callback tanpa nama: "lulus" dan "genap".', 'Two anonymous callbacks: "passed" and "even".'],
        ['13–14', 'Pembanding `table.sort`: menurun dengan `>` yang ketat.', 'A `table.sort` comparator: descending with a strict `>`.'])),
    S('complete_examples',
      CODE('signal', 'luau', 'luau', ['Isyarat ringkas dalam Luau tulen', 'A simple signal in pure Luau'], `
local function createSignal()
  local handlers: {(...any) -> ()} = {}
  local signal = {}

  function signal.connect(fn: (...any) -> ())
    table.insert(handlers, fn)
    return function()
      local index = table.find(handlers, fn)
      if index then table.remove(handlers, index) end
    end
  end

  function signal.fire(...)
    for _, fn in table.clone(handlers) do
      fn(...)
    end
  end

  return signal
end

local playerJoined = createSignal()
local disconnectLog = playerJoined.connect(function(name) print("log:", name) end)
playerJoined.connect(function(name) print(\`welcome, {name}!\`) end)
playerJoined.fire("Aina")
disconnectLog()
playerJoined.fire("Ben")
`, 'log:\tAina\nwelcome, Aina!\nwelcome, Ben!', {
        debug: BUG(`
local function apply(fn: (number) -> number, value: number): number
  return fn(value)
end
local function double(n: number): number return n * 2 end
print(apply(double(3), 5))
`, 'example:2: attempt to call a number value',
          '`double(3)` **memanggil** fungsi dan menghantar hasilnya (6) sebagai `fn`. Di dalam `apply`, `fn(value)` cuba memanggil nombor 6. Ralat dilaporkan pada baris 2 (di dalam `apply`), tetapi kesilapan berada pada baris 5. Hantar fungsi itu sendiri: `apply(double, 5)`. Anotasi `(number) -> number` membolehkan Studio menangkap ini lebih awal (diterangkan).',
          '`double(3)` **calls** the function and passes its result (6) as `fn`. Inside `apply`, `fn(value)` tries to call the number 6. The error is reported on line 2 (inside `apply`), but the mistake is on line 5. Pass the function itself: `apply(double, 5)`. The `(number) -> number` annotation lets Studio catch this earlier (described).'),
      }),
      EXPLAIN('signal',
        ['1–3', 'Senarai pengendali peribadi (upvalue) dan table isyarat awam.', 'A private handler list (an upvalue) and a public signal table.'],
        ['5–11', '`connect` menyimpan callback dan memulangkan fungsi **disconnect** — closure yang mengingati `fn`.', '`connect` stores the callback and returns a **disconnect** function — a closure that remembers `fn`.'],
        ['13–19', '`fire` memanggil setiap pengendali dengan argumen yang sama; `table.clone` melindungi gelung jika pengendali memutuskan sambungan semasa dipanggil.', '`fire` calls every handler with the same arguments; `table.clone` protects the loop if a handler disconnects while being called.'],
        ['22–27', 'Dua pengendali menerima "Aina"; selepas `disconnectLog()`, hanya satu menerima "Ben". Ini meniru `RBXScriptSignal:Connect` dan `RBXScriptConnection:Disconnect`.', 'Two handlers receive "Aina"; after `disconnectLog()`, only one receives "Ben". This mimics `RBXScriptSignal:Connect` and `RBXScriptConnection:Disconnect`.']),
      CODE('strict-comparator', 'luau', 'luau', ['Pembanding yang ketat dan konsisten', 'A strict, consistent comparator'], `
local players = {
  {name = "Chen", score = 50}, {name = "Aina", score = 70},
  {name = "Ben", score = 50}, {name = "Dewi", score = 70},
}

table.sort(players, function(a, b)
  if a.score ~= b.score then
    return a.score > b.score
  end
  return a.name < b.name
end)

for i, p in players do
  print(i, p.name, p.score)
end
`, '1\tAina\t70\n2\tDewi\t70\n3\tBen\t50\n4\tChen\t50', {
        debug: BUG(`
local t = {5, 3, 5, 1, 5, 2, 5, 5, 4, 5, 5, 5, 3, 5, 5}
table.sort(t, function(a, b) return a <= b end)
print("sorted")
`, 'example:2: invalid order function for sorting',
          'Pembanding `<=` memulangkan `true` untuk dua elemen yang sama, jadi ia mengatakan "5 sebelum 5" **dan** "5 sebelum 5" — susunan yang tidak konsisten. Dengan data ini (banyak nilai berulang), algoritma isihan Luau mengesannya dan menimbulkan ralat. Dengan data lain, ia mungkin tidak dikesan — pepijat yang bergantung pada data. Gunakan `<` yang ketat, dan pemutus seri (seperti nama) untuk nilai yang sama.',
          'The `<=` comparator returns `true` for two equal elements, so it says "5 before 5" **and** "5 before 5" — an inconsistent order. With this data (many repeated values), Luau’s sort algorithm detects it and raises an error. With other data it might go undetected — a data-dependent bug. Use a strict `<`, and a tie-breaker (such as the name) for equal values.'),
      }),
      EXPLAIN('strict-comparator',
        ['1–4', 'Pemain dengan skor yang sama.', 'Players with equal scores.'],
        ['6–11', 'Skor menurun; jika sama, nama menaik — susunan sentiasa konsisten dan output stabil.', 'Score descending; if equal, name ascending — the order is always consistent and the output stable.'],
        ['13–15', 'Papan pendahulu yang stabil.', 'A stable leaderboard.'])),
    S('line_by_line',
      EXPLAIN('signal',
        ['7–10', 'Fungsi disconnect ialah closure: ia mengingati `fn` dan `handlers` walaupun `connect` sudah pulang. Inilah sebabnya closure (kuliah 4.1) penting untuk sistem event.', 'The disconnect function is a closure: it remembers `fn` and `handlers` even though `connect` has returned. This is why closures (lecture 4.1) matter for event systems.']),
      EXPLAIN('callback-basics',
        ['1', 'Anotasi `(number) -> boolean` mendokumenkan bahawa callback menerima nombor dan memulangkan boolean.', 'The annotation `(number) -> boolean` documents that the callback receives a number and returns a boolean.'])),
    S('why_this_way',
      P('Mengapa callback? Kerana ia membolehkan kod umum (isih, kira, isyarat) digunakan semula untuk sebarang peraturan atau tindakan, dan ia ialah cara enjin Roblox memberitahu skrip anda tentang peristiwa. Mengapa membina isyarat sendiri? Kerana memahami bahawa `Connect` hanyalah "simpan fungsi dalam senarai, panggil kemudian" menjadikan tingkah laku event Roblox mudah diramal.',
        'Why callbacks? Because they let general code (sort, count, signal) be reused for any rule or action, and they are how the Roblox engine tells your scripts about events. Why build your own signal? Because understanding that `Connect` is just "store a function in a list, call it later" makes Roblox event behaviour easy to predict.'),
      P('Hantar callback **apabila** sebahagian tingkah laku berubah-ubah; gunakan isyarat **apabila** banyak bahagian kod perlu bertindak balas kepada satu peristiwa; balut callback dengan `pcall` **apabila** satu kegagalan tidak boleh menghentikan yang lain.', 'Pass a callback **when** part of a behaviour varies; use a signal **when** many parts of the code must react to one event; wrap callbacks with `pcall` **when** one failure must not stop the others.')),
    S('execution_flow',
      OL(
        ['`playerJoined.connect(logFn)` → `handlers = {logFn}`; fungsi disconnect dipulangkan.', '`playerJoined.connect(logFn)` → `handlers = {logFn}`; a disconnect function is returned.'],
        ['Callback kedua disambungkan → `handlers = {logFn, welcomeFn}`.', 'A second callback is connected → `handlers = {logFn, welcomeFn}`.'],
        ['`fire("Aina")` → kedua-duanya dipanggil dengan "Aina".', '`fire("Aina")` → both are called with "Aina".'],
        ['`disconnectLog()` → `logFn` dibuang; `fire("Ben")` → hanya `welcomeFn`.', '`disconnectLog()` → `logFn` is removed; `fire("Ben")` → only `welcomeFn`.'],
      )),
    S('memory_behaviour',
      P('Senarai pengendali isyarat memegang rujukan kepada setiap callback — dan oleh itu kepada semua yang ditangkapnya. Selagi callback disambungkan, ia tidak boleh dikutip. Fungsi disconnect membuang rujukan itu. Dalam Roblox, inilah sebabnya anda memutuskan sambungan yang tidak lagi diperlukan atau bergantung pada pemusnahan objek untuk memutuskannya.', 'A signal’s handler list holds a reference to every callback — and therefore to everything they captured. While a callback is connected, it cannot be collected. The disconnect function removes that reference. In Roblox, this is why you disconnect connections you no longer need, or rely on object destruction to disconnect them.')),
    S('alternative_implementations',
      P('Isyarat yang mengasingkan ralat — satu pengendali yang gagal tidak menghalang yang lain:', 'A signal that isolates errors — one failing handler does not block the others:'),
      CODE('safe-fire', 'luau', 'luau', ['Mencetuskan dengan pengasingan ralat', 'Firing with error isolation'], `
local handlers = {
  function(n) print("first got", n) end,
  function(n) error(\`bad handler for {n}\`, 0) end,
  function(n) print("third got", n) end,
}

local function safeFire(...)
  local failures = 0
  for _, fn in handlers do
    local ok, err = pcall(fn, ...)
    if not ok then
      failures += 1
      print("handler error:", err)
    end
  end
  return failures
end

print("failures:", safeFire(7))
`, 'first got\t7\nhandler error:\tbad handler for 7\nthird got\t7\nfailures:\t1'),
      EXPLAIN('safe-fire',
        ['1–5', 'Tiga pengendali; yang kedua gagal.', 'Three handlers; the second one fails.'],
        ['7–17', '`pcall` bagi setiap pengendali: kegagalan dilaporkan dan dikira, dan gelung diteruskan.', '`pcall` per handler: failures are reported and counted, and the loop continues.'],
        ['19', 'Pengendali ketiga masih berjalan; satu kegagalan.', 'The third handler still runs; one failure.'])),
    S('common_mistakes',
      UL(
        ['Menghantar `f()` (hasil) dan bukannya `f` (fungsi).', 'Passing `f()` (the result) instead of `f` (the function).'],
        ['Pembanding `<=` atau `>=` dalam `table.sort`.', 'A `<=` or `>=` comparator in `table.sort`.'],
        ['Pembanding yang ditulis untuk table tetapi digunakan pada nombor (`a.score` pada nombor).', 'A comparator written for tables but used on numbers (`a.score` on a number).'],
        ['Lupa memutuskan sambungan callback yang tidak lagi diperlukan.', 'Forgetting to disconnect callbacks that are no longer needed.'],
      )),
    S('debugging',
      P('Ralat dalam callback dilaporkan di dalam callback (atau di dalam fungsi yang memanggilnya), tetapi kesilapannya sering berada di tempat callback **dihantar**. `attempt to call a X value` → anda menghantar sesuatu yang bukan fungsi; semak tempat panggilan. `invalid order function for sorting` → pembanding tidak ketat atau tidak konsisten; uji dengan data yang mempunyai banyak nilai sama. Contoh berikut menguji pembanding untuk sifat "ketat":',
        'Errors in callbacks are reported inside the callback (or inside the function calling it), but the mistake is often where the callback was **passed**. `attempt to call a X value` → you passed something that is not a function; check the call site. `invalid order function for sorting` → the comparator is not strict or not consistent; test with data containing many equal values. The following example tests a comparator for strictness:'),
      CODE('comparator-check', 'luau', 'luau', ['Menguji pembanding', 'Testing a comparator'], `
local function isStrict(cmp: (any, any) -> boolean, samples: {any}): boolean
  for _, a in samples do
    if cmp(a, a) then return false end
    for _, b in samples do
      if cmp(a, b) and cmp(b, a) then return false end
    end
  end
  return true
end

local values = {3, 1, 3, 2}
print(isStrict(function(a, b) return a < b end, values))
print(isStrict(function(a, b) return a <= b end, values))
`, 'true\nfalse'),
      EXPLAIN('comparator-check',
        ['1–9', 'Pembanding ketat: `cmp(a, a)` palsu, dan tidak pernah `cmp(a, b)` dan `cmp(b, a)` kedua-duanya benar.', 'A strict comparator: `cmp(a, a)` is false, and never both `cmp(a, b)` and `cmp(b, a)`.'],
        ['11–13', '`<` lulus; `<=` gagal kerana `3 <= 3` benar.', '`<` passes; `<=` fails because `3 <= 3` is true.'])),
    S('performance',
      P('Memanggil callback mempunyai kos panggilan fungsi — kecil, tetapi `table.sort` dengan pembanding Luau melakukan O(n log n) panggilan sedemikian. Untuk senarai nombor ringkas dalam susunan menaik, `table.sort(t)` tanpa pembanding lebih pantas. Dalam isyarat, `table.clone` sebelum melelar menambah satu peruntukan setiap `fire`; ia berbaloi untuk keselamatan apabila pengendali boleh memutuskan sambungan.', 'Calling a callback costs a function call — small, but `table.sort` with a Luau comparator makes O(n log n) such calls. For a plain list of numbers in ascending order, `table.sort(t)` without a comparator is faster. In a signal, `table.clone` before iterating adds one allocation per `fire`; it is worth it for safety when handlers can disconnect.')),
    S('software_engineering',
      P('Fungsi isih berasingan bagi setiap peraturan berbanding satu fungsi dengan callback:', 'A separate sort function per rule versus one function with a callback:'),
      CODE('poor-duplicate-filters', 'luau', 'luau', ['Pelaksanaan lemah: penapis disalin', 'Poor implementation: copied filters'], `
local function alivePlayers(players)
  local out = {}
  for _, p in players do if p.hp > 0 then table.insert(out, p.name) end end
  return out
end
local function vipPlayers(players)
  local out = {}
  for _, p in players do if p.vip then table.insert(out, p.name) end end
  return out
end
local roster = {{name = "Aina", hp = 10, vip = true}, {name = "Ben", hp = 0, vip = true}}
print(#alivePlayers(roster), #vipPlayers(roster))
`, '1\t2'),
      EXPLAIN('poor-duplicate-filters',
        ['1–10', 'Dua fungsi hampir sama; setiap penapis baharu menyalin gelung lagi.', 'Two nearly identical functions; every new filter copies the loop again.'],
        ['11–12', 'Berfungsi, tetapi tidak berskala.', 'It works, but it does not scale.']),
      CODE('improved-filter-callback', 'luau', 'luau', ['Pelaksanaan lebih baik: satu penapis dengan callback', 'Improved implementation: one filter with a callback'], `
local function namesWhere(players, keep: (any) -> boolean): {string}
  local out = {}
  for _, p in players do
    if keep(p) then table.insert(out, p.name) end
  end
  return out
end

local roster = {{name = "Aina", hp = 10, vip = true}, {name = "Ben", hp = 0, vip = true}}
local alive = namesWhere(roster, function(p) return p.hp > 0 end)
local vips = namesWhere(roster, function(p) return p.vip end)
print(#alive, #vips, table.concat(vips, ","))
`, '1\t2\tAina,Ben'),
      EXPLAIN('improved-filter-callback',
        ['1–7', 'Satu gelung; peraturan dihantar sebagai callback.', 'One loop; the rule is passed as a callback.'],
        ['9–12', 'Penapis baharu = satu fungsi tanpa nama, bukan fungsi salinan.', 'A new filter = one anonymous function, not a copied function.'])),
    S('industry_use_cases',
      UL(
        ['Setiap event Roblox (`Touched`, `PlayerAdded`, `Activated`) menerima callback melalui `:Connect`.', 'Every Roblox event (`Touched`, `PlayerAdded`, `Activated`) receives a callback through `:Connect`.'],
        ['Pustaka isyarat Luau seperti GoodSignal melaksanakan corak yang sama dengan `connect`, `fire` dan `disconnect`.', 'Luau signal libraries such as GoodSignal implement the same pattern with `connect`, `fire` and `disconnect`.'],
        ['Papan pendahulu menggunakan pembanding dengan pemutus seri untuk kedudukan yang stabil.', 'Leaderboards use comparators with tie-breakers for stable rankings.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah `signal.once(fn)` yang memutuskan sambungan selepas panggilan pertama.', 'Add `signal.once(fn)` that disconnects after the first call.'],
        ['Isih `players` dalam `strict-comparator` mengikut nama sahaja.', 'Sort `players` in `strict-comparator` by name only.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Sistem pencapaian.** Gunakan isyarat untuk menyiarkan peristiwa skor; beberapa pendengar membuka pencapaian apabila ambang dicapai, dan setiap pencapaian dibuka sekali sahaja.', '**An achievement system.** Use a signal to broadcast score events; several listeners unlock achievements when thresholds are reached, and each achievement unlocks only once.'),
      CODE('achievements', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local listeners: {(number) -> ()} = {}
local function onScore(fn: (number) -> ()) table.insert(listeners, fn) end
local function fireScore(score: number)
  for _, fn in listeners do fn(score) end
end

local unlocked = {}
local function achievement(name: string, threshold: number)
  onScore(function(score)
    if score >= threshold and not unlocked[name] then
      unlocked[name] = true
      print(\`unlocked: {name} at {score}\`)
    end
  end)
end

achievement("Rookie", 100)
achievement("Pro", 500)
for _, s in {50, 120, 300, 650, 700} do
  fireScore(s)
end
`, 'unlocked: Rookie at 120\nunlocked: Pro at 650'),
      EXPLAIN('achievements',
        ['1–5', 'Isyarat minimum: senarai pendengar dan fungsi cetus.', 'A minimal signal: a listener list and a fire function.'],
        ['7–15', 'Setiap pencapaian ialah closure yang menangkap `name` dan `threshold`; table `unlocked` menghalang pembukaan berulang.', 'Each achievement is a closure capturing `name` and `threshold`; the `unlocked` table prevents repeated unlocks.'],
        ['17–21', 'Lima peristiwa skor; setiap pencapaian dibuka sekali pada skor pertama yang mencukupi.', 'Five score events; each achievement unlocks once at the first sufficient score.'])),
    S('summary',
      UL(
        ['Callback = fungsi yang dihantar untuk dipanggil kemudian; hantar `f`, bukan `f()`.', 'Callback = a function passed to be called later; pass `f`, not `f()`.'],
        ['Jenis fungsi `(T) -> R` mendokumenkan kontrak callback.', 'The function type `(T) -> R` documents a callback’s contract.'],
        ['Pembanding `table.sort` mesti ketat dan konsisten; gunakan pemutus seri.', '`table.sort` comparators must be strict and consistent; use tie-breakers.'],
        ['Isyarat = senarai callback + `fire`; `pcall` mengasingkan kegagalan.', 'A signal = a callback list + `fire`; `pcall` isolates failures.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah perbezaan antara `connect(handler)` dan `connect(handler())`?', 'What is the difference between `connect(handler)` and `connect(handler())`?'],
        ['Mengapakah `a <= b` tidak sah sebagai pembanding?', 'Why is `a <= b` invalid as a comparator?'],
        ['Bagaimanakah fungsi disconnect "tahu" callback mana yang hendak dibuang?', 'How does the disconnect function "know" which callback to remove?'],
        ['Mengapakah `pcall` digunakan dalam `safeFire`?', 'Why is `pcall` used in `safeFire`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Events', url: `${DOCS}/scripting/events` },
        { title: 'Luau — Type checking: function types', url: `${LUAU}/typecheck#function-types` },
        { title: 'Luau — Library (table.sort)', url: `${LUAU}/library#table-library` },
        { title: 'Roblox Engine API — RBXScriptSignal', url: `${DOCS}/reference/engine/datatypes/RBXScriptSignal` },
      )),
  ],
};

// ─── 4.3 Mini project: a score counter with closures ───────────────────────

export const LUAU103_4_3: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 4,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Mereka bentuk dan membina pengira skor lengkap dengan [[closure]], [[callback|callback]] dan keadaan peribadi.', 'Design and build a complete score counter with [[closure|closures]], [[callback|callbacks]] and private state.'],
        ['Menggabungkan syarat, gelung, fungsi, nilai berbilang dan varargs dari LUAU103.', 'Combine conditions, loops, functions, multiple values and varargs from LUAU103.'],
        ['Menulis ujian automatik dengan `assert` untuk setiap keperluan.', 'Write automated tests with `assert` for every requirement.'],
        ['Menambah ciri secara berperingkat sambil mengekalkan ujian lulus.', 'Add features step by step while keeping the tests passing.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Semua kuliah LUAU103 — terutamanya 4.1 (closure) dan 4.2 (callback).', 'All LUAU103 lectures — especially 4.1 (closures) and 4.2 (callbacks).'],
      )),
    S('introduction',
      P('Projek mini ini (90 minit) menggabungkan semua yang dipelajari dalam LUAU103 menjadi satu komponen yang biasa dalam permainan Roblox: **pengira skor**. Keperluannya: menambah mata dengan pengganda kombo, menetapkan semula kombo apabila pemain terlepas, mencetuskan callback apabila pencapaian dicapai, menyimpan sejarah, dan melindungi skor daripada diubah secara langsung. Kita akan membinanya sebagai kilang yang memulangkan table fungsi — closure yang berkongsi keadaan peribadi — dan mengujinya dengan `assert`. Semua kod ialah Luau tulen; lapisan Roblox (papan pendahulu, UI) akan memanggil komponen ini kemudian.',
        'This mini project (90 minutes) combines everything learned in LUAU103 into one component that is common in Roblox games: a **score counter**. Its requirements: add points with a combo multiplier, reset the combo when the player misses, fire callbacks when milestones are reached, keep a history, and protect the score from direct modification. We will build it as a factory returning a table of functions — closures sharing private state — and test it with `assert`. All code is pure Luau; a Roblox layer (leaderboards, UI) would call this component later.'),
      KEY('Keperluan → reka bentuk API → bina berperingkat → uji setiap keperluan → tambah baik.', 'Requirements → API design → build step by step → test every requirement → improve.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**R1:** `hit(points)` menambah `points × kombo`; kombo meningkat sehingga had.', '**R1:** `hit(points)` adds `points × combo`; the combo increases up to a cap.'],
        ['**R2:** `miss()` menetapkan semula kombo kepada 1.', '**R2:** `miss()` resets the combo to 1.'],
        ['**R3:** `onMilestone(threshold, fn)` memanggil `fn` sekali apabila skor melepasi ambang.', '**R3:** `onMilestone(threshold, fn)` calls `fn` once when the score passes the threshold.'],
        ['**R4:** `getScore()` dan `getHistory()` membaca keadaan; tiada cara untuk menulis skor terus.', '**R4:** `getScore()` and `getHistory()` read the state; there is no way to write the score directly.'],
        ['**R5:** input tidak sah (bukan nombor, negatif) ditolak dengan `nil, mesej`.', '**R5:** invalid input (not a number, negative) is rejected with `nil, message`.'],
      )),
    S('detailed_theory',
      P('Reka bentuk bermula dengan API — fungsi yang akan dipanggil oleh lapisan permainan — sebelum pelaksanaan. Kita memilih kilang `createScoreCounter(options)` yang memulangkan table fungsi. Keadaan (`score`, `combo`, `history`, senarai pencapaian) ialah local kilang, jadi ia menjadi upvalue yang dikongsi oleh semua fungsi yang dipulangkan dan tidak boleh diubah dari luar — keperluan R4 dipenuhi oleh struktur kod itu sendiri. Pilihan (`maxCombo`) dibaca sekali dengan lalai. Setiap keperluan menjadi satu fungsi kecil, dan pengesahan input (R5) menggunakan klausa pengawal dan corak `nil, mesej` dari Modul 1 dan 3.',
        'Design starts with the API — the functions the game layer will call — before the implementation. We choose a factory `createScoreCounter(options)` that returns a table of functions. The state (`score`, `combo`, `history`, the milestone list) consists of the factory’s locals, so it becomes upvalues shared by all the returned functions and cannot be changed from outside — requirement R4 is satisfied by the structure of the code itself. Options (`maxCombo`) are read once with defaults. Each requirement becomes one small function, and input validation (R5) uses guard clauses and the `nil, message` pattern from Modules 1 and 3.'),
      P('Pencapaian (R3) ialah callback yang disimpan bersama ambangnya dan bendera `fired`. Selepas setiap kemas kini skor, kita melelar senarai dan mencetuskan setiap pencapaian yang baru dilepasi — sekali sahaja. Sejarah menyimpan setiap peristiwa sebagai table kecil. Ujian ditulis sebagai jadual senario dengan `assert`, satu atau lebih bagi setiap keperluan; selepas setiap ciri baharu, semua ujian dijalankan semula. Dalam permainan sebenar, lapisan Roblox (`leaderstats`, UI) hanya memanggil `hit`, `miss` dan `onMilestone` — logik permainan kekal dalam Luau tulen yang boleh diuji di luar Studio.',
        'Milestones (R3) are callbacks stored with their threshold and a `fired` flag. After every score update, we iterate the list and fire each milestone that has just been passed — only once. The history stores every event as a small table. Tests are written as a table of scenarios with `assert`, one or more per requirement; after every new feature, all tests run again. In a real game, the Roblox layer (`leaderstats`, UI) only calls `hit`, `miss` and `onMilestone` — the game logic stays in pure Luau that can be tested outside Studio.')),
    S('technical_terminology', TERMS('closure', 'callback', 'upvalue', 'guard-clause')),
    S('syntax_rules',
      UL(
        ['Kilang: `local function createScoreCounter(options: {maxCombo: number?}?)`.', 'Factory: `local function createScoreCounter(options: {maxCombo: number?}?)`.'],
        ['API dipulangkan: `return {hit = hit, miss = miss, onMilestone = onMilestone, getScore = getScore}`.', 'The returned API: `return {hit = hit, miss = miss, onMilestone = onMilestone, getScore = getScore}`.'],
        ['Ujian: `assert(syarat, \`R1: expected …, got …\`)`.', 'Tests: `assert(condition, \`R1: expected …, got …\`)`.'],
      )),
    S('code_demonstration',
      CODE('score-core', 'luau', 'luau', ['Langkah 1: teras pengira (R1, R2, R4)', 'Step 1: the counter core (R1, R2, R4)'], `
local function createScoreCounter(options: {maxCombo: number?}?)
  local opts = options or {}
  local maxCombo = opts.maxCombo or 4
  local score, combo = 0, 1

  local function hit(points: number): number
    score += points * combo
    combo = math.min(combo + 1, maxCombo)
    return score
  end

  local function miss()
    combo = 1
  end

  return {
    hit = hit,
    miss = miss,
    getScore = function(): number return score end,
    getCombo = function(): number return combo end,
  }
end

local counter = createScoreCounter({maxCombo = 3})
print(counter.hit(10), counter.hit(10), counter.hit(10), counter.hit(10))
counter.miss()
print(counter.hit(10), counter.getCombo(), counter.score)
`, '10\t30\t60\t90\n100\t2\tnil'),
      EXPLAIN('score-core',
        ['1–4', 'Pilihan dengan lalai; keadaan peribadi `score` dan `combo`.', 'Options with a default; private state `score` and `combo`.'],
        ['6–10', '`hit`: tambah mata × kombo, kemudian naikkan kombo (dihadkan).', '`hit`: add points × combo, then raise the combo (capped).'],
        ['12–14', '`miss`: kombo kembali kepada 1.', '`miss`: the combo returns to 1.'],
        ['16–21', 'API awam: fungsi sahaja — tiada medan `score` yang boleh ditulis.', 'The public API: functions only — no writable `score` field.'],
        ['24–27', '10×1, +10×2, +10×3, +10×3 (had 3) = 90; selepas `miss`, +10×1 = 100. `counter.score` ialah `nil` — keadaan tersembunyi (R4).', '10×1, +10×2, +10×3, +10×3 (cap 3) = 90; after `miss`, +10×1 = 100. `counter.score` is `nil` — the state is hidden (R4).'])),
    S('complete_examples',
      CODE('score-milestones', 'luau', 'luau', ['Langkah 2: pencapaian dengan callback (R3)', 'Step 2: milestones with callbacks (R3)'], `
local function createScoreCounter()
  local score = 0
  local milestones: {{threshold: number, fn: (number) -> (), fired: boolean}} = {}

  local function checkMilestones()
    for _, m in milestones do
      if not m.fired and score >= m.threshold then
        m.fired = true
        m.fn(score)
      end
    end
  end

  return {
    add = function(points: number)
      score += points
      checkMilestones()
    end,
    onMilestone = function(threshold: number, fn: (number) -> ())
      table.insert(milestones, {threshold = threshold, fn = fn, fired = false})
    end,
  }
end

local c = createScoreCounter()
c.onMilestone(100, function(s) print("bronze at", s) end)
c.onMilestone(250, function(s) print("silver at", s) end)
for _, p in {60, 50, 40, 200, 10} do
  c.add(p)
end
`, 'bronze at\t110\nsilver at\t350', {
        debug: BUG(`
local function createScoreCounter()
  local score = 0
  local milestones = {}
  return {
    add = function(points) score += points; for _, m in milestones do if score >= m.threshold then m.fn(score) end end end,
    onMilestone = function(threshold, fn) table.insert(milestones, {threshold = threshold, fn = fn}) end,
  }
end
local c = createScoreCounter()
c.onMilestone(100, print("milestone"))
c.add(100)
`, 'example:5: attempt to call a nil value',
          '`c.onMilestone(100, print("milestone"))` **memanggil** `print` serta-merta (mencetak "milestone") dan menghantar hasilnya — tiada nilai, iaitu `nil` — sebagai callback, jadi `fn = nil` disimpan. Apabila `add` mencapai ambang, `m.fn(score)` cuba memanggil `nil`. Ralat dilaporkan pada baris 5, jauh dari kesilapan pada baris 10. Hantar fungsi: `c.onMilestone(100, function(s) print("milestone", s) end)`.',
          '`c.onMilestone(100, print("milestone"))` **calls** `print` immediately (printing "milestone") and passes its result — no value, i.e. `nil` — as the callback, so `fn = nil` is stored. When `add` reaches the threshold, `m.fn(score)` tries to call `nil`. The error is reported on line 5, far from the mistake on line 10. Pass a function: `c.onMilestone(100, function(s) print("milestone", s) end)`.'),
      }),
      EXPLAIN('score-milestones',
        ['1–3', 'Keadaan: skor dan senarai pencapaian (setiap satu dengan ambang, callback dan bendera).', 'State: the score and a milestone list (each with a threshold, a callback and a flag).'],
        ['5–12', 'Cetuskan setiap pencapaian yang baru dilepasi, sekali sahaja (`fired`).', 'Fire every milestone that has just been passed, only once (`fired`).'],
        ['14–22', 'API: `add` mengemas kini dan menyemak; `onMilestone` mendaftarkan callback.', 'The API: `add` updates and checks; `onMilestone` registers a callback.'],
        ['24–29', '60, 110 (gangsa), 150, 350 (perak), 360 — setiap callback sekali.', '60, 110 (bronze), 150, 350 (silver), 360 — each callback once.']),
      CODE('score-validated', 'luau', 'luau', ['Langkah 3: pengesahan input (R5)', 'Step 3: input validation (R5)'], `
local function validatePoints(points): (number?, string?)
  if typeof(points) ~= "number" then
    return nil, \`points must be a number, got {typeof(points)}\`
  end
  if points < 0 or points ~= math.floor(points) then
    return nil, \`points must be a whole number >= 0, got {points}\`
  end
  return points, nil
end

for _, input in {25, -5, 2.5, "10"} do
  local value, problem = validatePoints(input)
  print(if value then \`accepted {value}\` else problem)
end
`, 'accepted 25\npoints must be a whole number >= 0, got -5\npoints must be a whole number >= 0, got 2.5\npoints must be a number, got string', {
        debug: BUG(`
local function validatePoints(points)
  if points < 0 then return nil, "negative" end
  if typeof(points) ~= "number" then return nil, "not a number" end
  return points
end
print(validatePoints("10"))
`, 'example:2: attempt to compare string < number',
          'Pengawal dalam susunan yang salah: baris 2 membandingkan `points < 0` **sebelum** baris 3 menyemak jenisnya. Untuk string "10", perbandingan gagal dengan ralat — tepat kes yang sepatutnya ditolak dengan mesej. Semak jenis dahulu, kemudian julat (kuliah 1.3).',
          'The guards are in the wrong order: line 2 compares `points < 0` **before** line 3 checks its type. For the string "10", the comparison fails with an error — exactly the case that should be rejected with a message. Check the type first, then the range (lecture 1.3).'),
      }),
      EXPLAIN('score-validated',
        ['1–9', 'Pengawal mengikut susunan: jenis, kemudian julat dan nombor bulat; `nil, mesej` pada kegagalan.', 'Guards in order: type, then range and whole number; `nil, message` on failure.'],
        ['11–14', 'Empat input menguji setiap laluan.', 'Four inputs test every path.'])),
    S('line_by_line',
      EXPLAIN('score-core',
        ['18–19', 'Fungsi tanpa nama dalam constructor table juga closure — ia menangkap `score` dan `combo` yang sama seperti `hit` dan `miss`.', 'Anonymous functions in the table constructor are closures too — they capture the same `score` and `combo` as `hit` and `miss`.']),
      EXPLAIN('score-milestones',
        ['7', '`not m.fired and score >= m.threshold` — semakan bendera dahulu (murah), kemudian ambang; litar pintas mengelakkan kerja yang tidak perlu.', '`not m.fired and score >= m.threshold` — the flag check first (cheap), then the threshold; short-circuiting avoids unnecessary work.'])),
    S('why_this_way',
      P('Mengapa kilang dengan closure dan bukan table terbuka? Kerana keperluan R4 — skor tidak boleh diubah secara langsung — dijamin oleh struktur kod: tiada medan untuk ditulis. Mengapa callback untuk pencapaian? Kerana pengira tidak sepatutnya tahu apa yang berlaku apabila pencapaian dicapai (lencana, bunyi, UI) — ia hanya memberitahu. Ini memisahkan logik daripada kesan.',
        'Why a factory with closures rather than an open table? Because requirement R4 — the score cannot be changed directly — is guaranteed by the code’s structure: there is no field to write. Why callbacks for milestones? Because the counter should not know what happens when a milestone is reached (badges, sounds, UI) — it only announces it. This separates logic from effects.'),
      P('Bina komponen sebegini **apabila** logik permainan digunakan oleh beberapa bahagian (UI, papan pendahulu, pencapaian); uji ia di luar Studio **sebelum** menyambungkannya kepada API Roblox.', 'Build components like this **when** game logic is used by several parts (UI, leaderboards, achievements); test it outside Studio **before** connecting it to Roblox APIs.')),
    S('execution_flow',
      OL(
        ['`createScoreCounter({maxCombo = 3})`: pilihan dibaca, keadaan dicipta, table fungsi dipulangkan.', '`createScoreCounter({maxCombo = 3})`: options are read, the state is created, a table of functions is returned.'],
        ['`counter.hit(10)` × 4: kombo 1, 2, 3, 3 → skor 10, 30, 60, 90.', '`counter.hit(10)` × 4: combo 1, 2, 3, 3 → score 10, 30, 60, 90.'],
        ['`counter.miss()`: kombo 1; `hit(10)` → 100, kombo menjadi 2.', '`counter.miss()`: combo 1; `hit(10)` → 100, the combo becomes 2.'],
      )),
    S('memory_behaviour',
      P('Setiap pengira ialah satu set closure dan upvalue; sejarah membesar dengan setiap peristiwa. Dalam permainan yang berjalan lama, hadkan saiz sejarah (simpan N peristiwa terakhir) supaya memori tidak bertambah tanpa had. Callback pencapaian yang didaftarkan kekal sehingga pengira itu sendiri tidak lagi dirujuk.', 'Each counter is one set of closures and upvalues; the history grows with every event. In long-running games, cap the history size (keep the last N events) so memory does not grow without limit. Registered milestone callbacks live until the counter itself is no longer referenced.')),
    S('alternative_implementations',
      P('Versi akhir yang menggabungkan semua keperluan, dengan sejarah yang dihadkan:', 'The final version combining every requirement, with a capped history:'),
      CODE('score-final', 'luau', 'luau', ['Komponen akhir', 'The final component'], `
local function createScoreCounter(options: {maxCombo: number?, historySize: number?}?)
  local opts = options or {}
  local maxCombo, historySize = opts.maxCombo or 4, opts.historySize or 5
  local score, combo, history, milestones = 0, 1, {}, {}

  local function record(kind: string, ...)
    table.insert(history, {kind = kind, args = table.pack(...)})
    if #history > historySize then table.remove(history, 1) end
  end

  local api = {}
  function api.hit(points: number): (number?, string?)
    if typeof(points) ~= "number" or points < 0 then return nil, "invalid points" end
    score += points * combo
    record("hit", points, combo)
    combo = math.min(combo + 1, maxCombo)
    for _, m in milestones do
      if not m.fired and score >= m.threshold then m.fired = true; m.fn(score) end
    end
    return score, nil
  end
  function api.miss() combo = 1; record("miss") end
  function api.onMilestone(threshold: number, fn: (number) -> ())
    table.insert(milestones, {threshold = threshold, fn = fn, fired = false})
  end
  function api.getScore(): number return score end
  function api.getHistory(): {string}
    local lines = {}
    for _, e in history do table.insert(lines, \`{e.kind}{if e.args.n > 0 then "(" .. e.args[1] .. "x" .. e.args[2] .. ")" else ""}\`) end
    return lines
  end
  return api
end

local c = createScoreCounter({historySize = 3})
c.onMilestone(50, function(s) print("milestone at", s) end)
c.hit(10); c.hit(10); c.miss(); c.hit(20)
print(c.getScore(), table.concat(c.getHistory(), " "))
`, 'milestone at\t50\n50\thit(10x2) miss hit(20x1)'),
      EXPLAIN('score-final',
        ['1–4', 'Pilihan dengan lalai; semua keadaan peribadi.', 'Options with defaults; all state private.'],
        ['6–9', '`record` (variadic) menyimpan peristiwa dengan `table.pack`; sejarah dihadkan.', '`record` (variadic) stores events with `table.pack`; the history is capped.'],
        ['11–21', '`hit` mengesahkan (R5), menambah dengan kombo (R1), merekod, dan mencetuskan pencapaian (R3).', '`hit` validates (R5), adds with the combo (R1), records, and fires milestones (R3).'],
        ['22–25', '`miss` (R2) dan pendaftaran pencapaian.', '`miss` (R2) and milestone registration.'],
        ['26–32', 'Pembaca (R4): skor dan sejarah yang diformat; `api` dipulangkan.', 'Readers (R4): the score and a formatted history; `api` is returned.'],
        ['35–38', '10 + 20 (kombo 2) = 30; `miss`; 20 × 1 = 50 → pencapaian. Sejarah 3 terakhir sahaja.', '10 + 20 (combo 2) = 30; `miss`; 20 × 1 = 50 → milestone. Only the last 3 history entries.'])),
    S('common_mistakes',
      UL(
        ['Mendedahkan `score` sebagai medan table, membenarkan penipuan.', 'Exposing `score` as a table field, allowing cheating.'],
        ['Mencetuskan pencapaian berulang kali kerana tiada bendera `fired`.', 'Firing milestones repeatedly because there is no `fired` flag.'],
        ['Mengesahkan julat sebelum jenis.', 'Validating the range before the type.'],
        ['Sejarah yang membesar tanpa had.', 'A history that grows without limit.'],
      )),
    S('debugging',
      P('Untuk komponen seperti ini, ujian ialah alat penyahpepijatan utama: apabila satu ujian gagal, mesej `assert` sepatutnya menyebut keperluan, nilai yang dijangka dan nilai sebenar. Jika pencapaian tidak dicetuskan, cetak skor dan setiap ambang selepas `add`. Jika callback menyebabkan `attempt to call a nil value`, semak tempat ia didaftarkan — mungkin hasil panggilan dihantar dan bukannya fungsi. Ujian lengkap untuk keperluan:',
        'For a component like this, tests are the main debugging tool: when a test fails, the `assert` message should name the requirement, the expected value and the actual value. If a milestone does not fire, print the score and every threshold after `add`. If a callback causes `attempt to call a nil value`, check where it was registered — a call result may have been passed instead of a function. A complete test of the requirements:'),
      CODE('score-tests', 'luau', 'luau', ['Ujian keperluan', 'Requirement tests'], `
local function createCounter(maxCombo: number)
  local score, combo, fired = 0, 1, {}
  return {
    hit = function(p: number) score += p * combo; combo = math.min(combo + 1, maxCombo) end,
    miss = function() combo = 1 end,
    score = function(): number return score end,
    milestone = function(t: number, fn: () -> ()) if score >= t and not fired[t] then fired[t] = true; fn() end end,
  }
end

local c = createCounter(2)
c.hit(10); c.hit(10); c.hit(10)
assert(c.score() == 50, \`R1: expected 50, got {c.score()}\`)
c.miss(); c.hit(5)
assert(c.score() == 55, \`R2: expected 55, got {c.score()}\`)
local calls = 0
c.milestone(50, function() calls += 1 end)
c.milestone(50, function() calls += 1 end)
assert(calls == 1, \`R3: expected 1 call, got {calls}\`)
assert(c.scoreValue == nil, "R4: score must not be a writable field")
print("all requirement tests passed")
`, 'all requirement tests passed'),
      EXPLAIN('score-tests',
        ['1–9', 'Versi ringkas pengira untuk ujian.', 'A compact counter for testing.'],
        ['11–13', 'R1: 10×1 + 10×2 + 10×2 (had 2) = 50.', 'R1: 10×1 + 10×2 + 10×2 (cap 2) = 50.'],
        ['14–15', 'R2: selepas `miss`, 5×1 → 55.', 'R2: after `miss`, 5×1 → 55.'],
        ['16–19', 'R3: ambang yang sama didaftarkan dua kali dicetuskan sekali sahaja.', 'R3: the same threshold registered twice fires only once.'],
        ['20–21', 'R4: tiada medan skor yang boleh ditulis; semua ujian lulus.', 'R4: no writable score field; all tests pass.'])),
    S('performance',
      P('Setiap `hit` melakukan kerja O(m) untuk m pencapaian. Untuk beberapa pencapaian ini tidak penting; untuk ratusan, susun pencapaian mengikut ambang dan simpan indeks pencapaian seterusnya supaya setiap `hit` hanya menyemak satu. Sejarah yang dihadkan menggunakan `table.remove(history, 1)`, yang O(n) — untuk saiz kecil ia baik; untuk saiz besar, gunakan penimbal bulat.', 'Each `hit` does O(m) work for m milestones. For a few milestones this does not matter; for hundreds, sort the milestones by threshold and keep the index of the next one so each `hit` checks only one. The capped history uses `table.remove(history, 1)`, which is O(n) — fine for small sizes; for large ones, use a ring buffer.')),
    S('software_engineering',
      P('Keadaan skor terbuka berbanding komponen yang dikapsulkan:', 'Open score state versus an encapsulated component:'),
      CODE('poor-open-score', 'luau', 'luau', ['Pelaksanaan lemah: skor terbuka', 'Poor implementation: an open score'], `
local scoreBoard = {score = 0, combo = 1}
local function hit(points)
  scoreBoard.score += points * scoreBoard.combo
  scoreBoard.combo += 1
end
hit(10); hit(10)
scoreBoard.score = 1000000
scoreBoard.combo = -5
print(scoreBoard.score, scoreBoard.combo)
`, '1000000\t-5'),
      EXPLAIN('poor-open-score',
        ['1–5', 'Keadaan terbuka; kombo tiada had.', 'Open state; the combo has no cap.'],
        ['6–9', 'Mana-mana kod boleh menetapkan skor sejuta dan kombo negatif — tiada perlindungan.', 'Any code can set a million points and a negative combo — no protection.']),
      CODE('improved-encapsulated-score', 'luau', 'luau', ['Pelaksanaan lebih baik: dikapsulkan', 'Improved implementation: encapsulated'], `
local function createScore(maxCombo: number)
  local score, combo = 0, 1
  return {
    hit = function(points: number)
      score += points * combo
      combo = math.min(combo + 1, maxCombo)
    end,
    get = function(): (number, number) return score, combo end,
  }
end

local board = createScore(3)
board.hit(10); board.hit(10)
board.score = 1000000
print(board.get())
`, '30\t3'),
      EXPLAIN('improved-encapsulated-score',
        ['1–10', 'Keadaan dalam upvalue; satu-satunya cara mengubahnya ialah `hit`, yang menghormati had.', 'State in upvalues; the only way to change it is `hit`, which respects the cap.'],
        ['12–15', '`board.score = 1000000` hanya mencipta medan tidak berguna dalam table API — skor sebenar kekal 30.', '`board.score = 1000000` only creates a useless field in the API table — the real score stays 30.'])),
    S('industry_use_cases',
      UL(
        ['Sistem skor, kombo dan pencapaian dalam permainan aksi Roblox mengikut struktur ini.', 'Score, combo and achievement systems in Roblox action games follow this structure.'],
        ['Komponen logik tulen diuji dengan TestEZ/Jest-Lua sebelum disambungkan kepada UI.', 'Pure-logic components are tested with TestEZ/Jest-Lua before being connected to UI.'],
        ['Keadaan peribadi dalam closure menghalang skrip lain (dan eksploit klien) daripada menukar nilai secara langsung.', 'Private state in closures stops other scripts (and client exploits) from changing values directly.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah keperluan R6: `reset()` yang menetapkan semula skor dan kombo tetapi mengekalkan pencapaian yang sudah dicetuskan. Tulis ujiannya dahulu.', 'Add requirement R6: `reset()` that resets the score and combo but keeps milestones already fired. Write its test first.'],
        ['Tukar `historySize` dalam `score-final` kepada 2 dan ramalkan sejarah.', 'Change `historySize` in `score-final` to 2 and predict the history.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Pengembangan: papan pendahulu berbilang pemain.** Cipta satu pengira bagi setiap pemain, mainkan senarai peristiwa yang ditulis dahulu, kemudian cetak papan pendahulu yang diisih dengan pemutus seri.', '**Extension: a multiplayer leaderboard.** Create one counter per player, replay a pre-written list of events, then print a leaderboard sorted with a tie-breaker.'),
      CODE('multiplayer-board', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function createCounter()
  local score, combo = 0, 1
  return {
    hit = function(points: number) score += points * combo; combo = math.min(combo + 1, 3) end,
    miss = function() combo = 1 end,
    get = function(): number return score end,
  }
end

local counters = {}
local events = {
  {"Aina", "hit", 10}, {"Ben", "hit", 10}, {"Aina", "hit", 10},
  {"Ben", "miss"}, {"Ben", "hit", 20}, {"Chen", "hit", 30},
}
for _, e in events do
  local name, action, points = e[1], e[2], e[3]
  counters[name] = counters[name] or createCounter()
  if action == "hit" then counters[name].hit(points) else counters[name].miss() end
end

local names = {}
for name in counters do table.insert(names, name) end
table.sort(names, function(a, b)
  local sa, sb = counters[a].get(), counters[b].get()
  if sa ~= sb then return sa > sb end
  return a < b
end)
for rank, name in names do
  print(rank, name, counters[name].get())
end
`, '1\tAina\t30\n2\tBen\t30\n3\tChen\t30'),
      EXPLAIN('multiplayer-board',
        ['1–8', 'Kilang pengira ringkas (had kombo 3).', 'A compact counter factory (combo cap 3).'],
        ['10–19', 'Pengira dicipta apabila pemain pertama kali muncul; setiap peristiwa dimainkan semula.', 'A counter is created when a player first appears; every event is replayed.'],
        ['21–27', 'Isih skor menurun dengan nama sebagai pemutus seri — ketiga-tiga pemain seri pada 30.', 'Sort by score descending with the name as a tie-breaker — all three players tie at 30.'],
        ['28–30', 'Papan pendahulu yang stabil. Aina: 10 + 20; Ben: 10, miss, 20; Chen: 30.', 'A stable leaderboard. Aina: 10 + 20; Ben: 10, miss, 20; Chen: 30.'])),
    S('summary',
      UL(
        ['Reka bentuk API dahulu; setiap keperluan menjadi fungsi kecil.', 'Design the API first; each requirement becomes a small function.'],
        ['Closure memberikan keadaan peribadi — perlindungan oleh struktur kod.', 'Closures give private state — protection by code structure.'],
        ['Callback memisahkan logik (pengira) daripada kesan (lencana, UI).', 'Callbacks separate logic (the counter) from effects (badges, UI).'],
        ['Ujian `assert` bagi setiap keperluan, dijalankan semula selepas setiap perubahan.', '`assert` tests per requirement, re-run after every change.'],
      )),
    S('knowledge_check',
      OL(
        ['Bagaimanakah reka bentuk kilang memenuhi keperluan R4?', 'How does the factory design satisfy requirement R4?'],
        ['Mengapakah pencapaian memerlukan bendera `fired`?', 'Why do milestones need a `fired` flag?'],
        ['Apakah yang berlaku jika anda menulis `board.score = 0` pada versi yang dikapsulkan?', 'What happens if you write `board.score = 0` on the encapsulated version?'],
        ['Bagaimanakah anda menyambungkan komponen ini kepada `leaderstats` Roblox?', 'How would you connect this component to Roblox `leaderstats`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — In-experience leaderboards (leaderstats)', url: `${DOCS}/players/leaderboards` },
        { title: 'Luau — Type checking (table and function types)', url: `${LUAU}/typecheck` },
        { title: 'Roblox Creator Hub — Functions', url: `${DOCS}/luau/functions` },
        { title: 'Jest-Lua — testing framework for Luau', url: 'https://github.com/jsdotlua/jest-lua' },
      )),
  ],
};

export const LUAU103_M4 = [LUAU103_4_1, LUAU103_4_2, LUAU103_4_3];
