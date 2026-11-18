import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU103 · Module 2 — Loops (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 2.1 Numeric for, while and repeat–until ───────────────────────────────

export const LUAU103_2_1: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 2,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan tiga [[loop|gelung]] asas: `for` berangka, `while` dan `repeat … until`.', 'Use the three basic [[loop|loops]]: numeric `for`, `while` and `repeat … until`.'],
        ['Meramal bilangan pusingan `for` dengan langkah positif, negatif dan pecahan.', 'Predict the number of `for` passes with positive, negative and fractional steps.'],
        ['Menerangkan bahawa `repeat` sentiasa berjalan sekurang-kurangnya sekali dan syarat `until` melihat local badan.', 'Explain that `repeat` always runs at least once and that the `until` condition sees the body’s locals.'],
        ['Mengelak [[infinite-loop|gelung tak terhingga]] dan tingkah laku khas Luau (langkah 0).', 'Avoid [[infinite-loop|infinite loops]] and Luau-specific behaviour (step 0).'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1: syarat dan truthiness.', 'Module 1: conditions and truthiness.'],
        ['LUAU102 3.3: assignment majmuk (`i += 1`).', 'LUAU102 3.3: compound assignment (`i += 1`).'],
      )),
    S('introduction',
      P('Gelung mengulang kod: memproses setiap pemain, mengira detik sebelum pusingan bermula, cuba semula sambungan sehingga berjaya. Luau mempunyai tiga gelung asas yang diwarisi daripada Lua. `for` berangka sesuai apabila bilangan pusingan diketahui; `while` apabila anda mengulang **selagi** sesuatu benar; `repeat … until` apabila anda mengulang **sehingga** sesuatu benar dan badan mesti berjalan sekurang-kurangnya sekali. Kuliah 2.2 menambah iterasi umum untuk table.',
        'Loops repeat code: processing every player, counting down before a round starts, retrying a connection until it succeeds. Luau has three basic loops inherited from Lua. The numeric `for` suits a known number of passes; `while` repeats **while** something is true; `repeat … until` repeats **until** something is true and the body must run at least once. Lecture 2.2 adds generalized iteration for tables.'),
      KEY('`for` = bilangan diketahui. `while` = semak dahulu. `repeat` = jalankan dahulu, semak selepas.', '`for` = a known count. `while` = check first. `repeat` = run first, check after.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`for i = mula, had, langkah do … end` — langkah lalai 1; had termasuk; ungkapan dinilai sekali.', '`for i = start, limit, step do … end` — the step defaults to 1; the limit is inclusive; the expressions are evaluated once.'],
        ['Pemboleh ubah gelung ialah local baharu bagi setiap pusingan; mengubahnya tidak menjejaskan bilangan pusingan.', 'The loop variable is a fresh local each pass; changing it does not affect the number of passes.'],
        ['`while syarat do … end` — boleh berjalan sifar kali.', '`while condition do … end` — may run zero times.'],
        ['`repeat … until syarat` — sekurang-kurangnya sekali; `until` boleh membaca local badan.', '`repeat … until condition` — at least once; `until` can read the body’s locals.'],
        ['Luau: langkah 0 menjalankan **sifar** pusingan tanpa ralat.', 'Luau: a step of 0 runs **zero** passes without an error.'],
      )),
    S('detailed_theory',
      P('Gelung `for` berangka menilai `mula`, `had` dan `langkah` **sekali** sebelum pusingan pertama, kemudian mengira bilangan pusingan secara dalaman. Kerana itu, menukar pemboleh ubah gelung atau pemboleh ubah yang digunakan dalam had di dalam badan tidak mengubah berapa kali gelung berjalan. Langkah negatif mengira ke bawah (`for i = 10, 1, -1`). Dengan langkah pecahan, ralat float boleh menjejaskan pusingan terakhir: `for x = 0, 1, 0.1` memberi 11 pusingan, tetapi `for x = 0, 0.3, 0.1` hanya 3, kerana 0.1 × 3 sedikit melebihi 0.3 dalam binari. Untuk langkah pecahan, gelung atas integer dan bahagikan di dalam badan.',
        'The numeric `for` loop evaluates `start`, `limit` and `step` **once** before the first pass, then counts passes internally. Because of that, changing the loop variable or a variable used in the limit inside the body does not change how many times the loop runs. A negative step counts down (`for i = 10, 1, -1`). With fractional steps, float error can affect the last pass: `for x = 0, 1, 0.1` gives 11 passes, but `for x = 0, 0.3, 0.1` only 3, because 0.1 × 3 is slightly above 0.3 in binary. For fractional steps, loop over integers and divide inside the body.'),
      P('`while` menyemak syaratnya sebelum setiap pusingan, jadi ia mungkin tidak berjalan langsung; ia sesuai untuk menunggu atau memproses sehingga sesuatu habis. `repeat … until` menyemak **selepas** setiap pusingan, dan — tidak seperti kebanyakan bahasa — syarat `until` berada di dalam skop badan, jadi ia boleh menggunakan local yang diisytiharkan di dalam gelung. Bahaya utama kedua-duanya ialah gelung tak terhingga: jika tiada apa-apa dalam badan mengubah syarat, gelung tidak pernah tamat — dalam Roblox, skrip itu menyekat dan Studio melaporkan "Script timeout". Satu kehalusan Luau: langkah `for` sifar tidak menimbulkan ralat (Lua 5.4 melaporkan `\'for\' step is zero`); gelung hanya tidak berjalan, jadi pepijat itu senyap.',
        '`while` checks its condition before each pass, so it may not run at all; it suits waiting or processing until something runs out. `repeat … until` checks **after** each pass, and — unlike most languages — the `until` condition is inside the body’s scope, so it can use locals declared inside the loop. The main danger of both is an infinite loop: if nothing in the body changes the condition, the loop never ends — in Roblox, that script blocks and Studio reports "Script timeout". One Luau subtlety: a `for` step of zero raises no error (Lua 5.4 reports `\'for\' step is zero`); the loop simply does not run, so that bug is silent.')),
    S('technical_terminology', TERMS('loop', 'infinite-loop', 'control-flow', 'compound-assignment')),
    S('syntax_rules',
      UL(
        ['`for i = 1, 10 do … end` · `for i = 10, 1, -1 do … end` · `for i = 0, 100, 5 do … end`.', '`for i = 1, 10 do … end` · `for i = 10, 1, -1 do … end` · `for i = 0, 100, 5 do … end`.'],
        ['`while syarat do … end` · `repeat … until syarat` (tiada `end`).', '`while condition do … end` · `repeat … until condition` (no `end`).'],
        ['`while true do … if selesai then break end … end` — gelung dengan keluar di tengah.', '`while true do … if done then break end … end` — a loop with an exit in the middle.'],
      )),
    S('code_demonstration',
      CODE('three-loops', 'luau', 'luau', ['Tiga gelung', 'Three loops'], `
for count = 3, 1, -1 do
  print(\`round starts in {count}\`)
end

local coins, days = 100, 0
while coins < 200 do
  coins = math.floor(coins * 1.25)
  days += 1
end
print(\`{coins} coins after {days} days\`)

local attempts = 0
repeat
  attempts += 1
  local connected = attempts >= 3
until connected
print(\`connected on attempt {attempts}\`)
`, 'round starts in 3\nround starts in 2\nround starts in 1\n243 coins after 4 days\nconnected on attempt 3'),
      EXPLAIN('three-loops',
        ['1–3', '`for` dengan langkah −1: kiraan detik 3, 2, 1.', '`for` with step −1: a countdown 3, 2, 1.'],
        ['5–10', '`while` berjalan selagi syiling di bawah 200: setiap hari syiling didarab 1.25 dan dibundarkan ke bawah, dan hari dikira.', '`while` runs while coins are below 200: each day the coins are multiplied by 1.25 and rounded down, and the day is counted.'],
        ['12–17', '`repeat` berjalan sekurang-kurangnya sekali; `until` membaca local `connected` yang diisytiharkan di dalam badan.', '`repeat` runs at least once; `until` reads the local `connected` declared inside the body.'])),
    S('complete_examples',
      CODE('for-evaluated-once', 'luau', 'luau', ['Had dan langkah dinilai sekali', 'The limit and step are evaluated once'], `
local limit = 3
for i = 1, limit do
  limit = 10
  print(i)
end

for i = 1, 3 do
  i = i * 100
  print(i)
end
`, '1\n2\n3\n100\n200\n300', {
        debug: BUG(`
local waves = "five"
for wave = 1, waves do
  print(wave)
end
`, "example:2: invalid 'for' limit (number expected, got string)",
          'Had gelung mesti nombor (atau string yang kelihatan seperti nombor — "5" diterima). "five" tidak boleh ditukar, jadi Luau menolaknya sebelum pusingan pertama. Mesej menyebut kedudukan yang salah (`limit`) dan jenis. Tukar data dengan `tonumber` dan semak `nil` sebelum gelung.',
          'The loop limit must be a number (or a string that looks like one — "5" is accepted). "five" cannot be converted, so Luau rejects it before the first pass. The message names the wrong position (`limit`) and the type. Convert the data with `tonumber` and check for `nil` before the loop.'),
      }),
      EXPLAIN('for-evaluated-once',
        ['1–5', 'Menukar `limit` di dalam badan tidak mengubah bilangan pusingan — had 3 sudah dinilai.', 'Changing `limit` inside the body does not change the number of passes — the limit 3 was already evaluated.'],
        ['7–10', 'Menukar `i` hanya mengubah salinan untuk pusingan ini; pusingan seterusnya bermula dengan nilai yang betul (2, 3).', 'Changing `i` only changes this pass’s copy; the next pass starts with the right value (2, 3).']),
      CODE('float-step-safe', 'luau', 'luau', ['Langkah pecahan dengan selamat', 'Fractional steps safely'], `
local floatPasses = 0
for x = 0, 0.3, 0.1 do floatPasses += 1 end
print("float step passes:", floatPasses)

for step = 0, 3 do
  local x = step / 10
  print(x)
end
`, 'float step passes:\t3\n0\n0.1\n0.2\n0.3', {
        debug: BUG(`
local hp
while hp < 100 do
  hp += 10
end
`, 'example:2: attempt to compare nil < number',
          '`hp` diisytiharkan tanpa nilai, jadi ia `nil`, dan syarat `while` cuba membandingkan `nil` dengan 100. Ralat berlaku sebelum pusingan pertama. Mulakan pemboleh ubah sebelum gelung: `local hp = 0`.',
          '`hp` is declared without a value, so it is `nil`, and the `while` condition tries to compare `nil` with 100. The error happens before the first pass. Initialise the variable before the loop: `local hp = 0`.'),
      }),
      EXPLAIN('float-step-safe',
        ['1–3', 'Langkah 0.1 hingga 0.3 hanya memberi 3 pusingan (0, 0.1, 0.2) kerana ralat float.', 'A step of 0.1 up to 0.3 gives only 3 passes (0, 0.1, 0.2) because of float error.'],
        ['5–8', 'Gelung atas integer 0–3 dan bahagikan: empat nilai yang tepat, termasuk 0.3.', 'Loop over integers 0–3 and divide: four exact values, including 0.3.'])),
    S('line_by_line',
      EXPLAIN('three-loops',
        ['7', 'Jujukan tepat: 100 → 125 → 156 (156.25) → 195 → 243 (243.75). Selepas hari ke-4, 243 ≥ 200, jadi syarat `while` palsu dan gelung tamat.', 'The exact sequence: 100 → 125 → 156 (156.25) → 195 → 243 (243.75). After day 4, 243 ≥ 200, so the `while` condition is false and the loop ends.']),
      EXPLAIN('for-evaluated-once',
        ['3', 'Assignment `limit = 10` mengubah pemboleh ubah, tetapi gelung sudah menyimpan had 3 secara dalaman sebelum pusingan pertama.', 'The assignment `limit = 10` changes the variable, but the loop already stored the limit 3 internally before the first pass.'])),
    S('why_this_way',
      P('Mengapa tiga gelung? Kerana setiap satu menyatakan niat yang berbeza dengan jelas: `for` memberitahu pembaca "tepat N kali", `while` "selagi", `repeat` "sekurang-kurangnya sekali, sehingga". Memilih gelung yang betul menjadikan kod mendokumentasikan dirinya sendiri dan mengurangkan pepijat sempadan.',
        'Why three loops? Because each one clearly expresses a different intent: `for` tells the reader "exactly N times", `while` "as long as", `repeat` "at least once, until". Choosing the right loop makes code self-documenting and reduces boundary bugs.'),
      P('Gunakan `for` **apabila** anda tahu bilangannya; `while` **apabila** keadaan boleh benar sejak awal; `repeat` **apabila** tindakan mesti berlaku sekali sebelum semakan (contohnya cuba semula).', 'Use `for` **when** you know the count; `while` **when** the state may already be satisfied at the start; `repeat` **when** the action must happen once before checking (for example a retry).')),
    S('execution_flow',
      OL(
        ['`for count = 3, 1, -1`: Luau menilai 3, 1, −1 sekali dan menyediakan kiraan dalaman.', '`for count = 3, 1, -1`: Luau evaluates 3, 1, −1 once and sets up an internal counter.'],
        ['Pusingan: count = 3, 2, 1; selepas 1, kiraan seterusnya (0) melepasi had → gelung tamat.', 'Passes: count = 3, 2, 1; after 1, the next count (0) passes the limit → the loop ends.'],
        ['`repeat`: badan berjalan, `until connected` disemak; palsu → ulang; pada percubaan 3 → benar → tamat.', '`repeat`: the body runs, `until connected` is checked; false → repeat; on attempt 3 → true → done.'],
      )),
    S('memory_behaviour',
      P('Gelung `for` berangka menggunakan tiga daftar dalaman dan tidak memperuntukkan memori. Local yang diisytiharkan dalam badan dicipta semula setiap pusingan dan dibebaskan di hujung pusingan. Table yang dicipta dalam badan gelung (`{}`) memperuntukkan memori setiap pusingan — dalam gelung panas, gunakan semula table atau ciptanya di luar.',
        'A numeric `for` loop uses three internal registers and allocates no memory. Locals declared in the body are recreated each pass and released at the end of the pass. Tables created inside a loop body (`{}`) allocate memory every pass — in hot loops, reuse tables or create them outside.')),
    S('alternative_implementations',
      P('`while true` dengan `break` di tengah ialah corak biasa apabila syarat keluar paling mudah disemak di tengah badan:', '`while true` with a `break` in the middle is a common pattern when the exit condition is easiest to check mid-body:'),
      CODE('loop-and-half', 'luau', 'luau', ['Gelung dengan keluar di tengah', 'A loop with a mid-body exit'], `
local queue = {"spawn", "move", "stop", "never"}
local index = 0

while true do
  index += 1
  local command = queue[index]
  if command == nil or command == "stop" then
    break
  end
  print("run", command)
end
print("stopped at", index)
`, 'run\tspawn\nrun\tmove\nstopped at\t3'),
      EXPLAIN('loop-and-half',
        ['1–2', 'Baris gilir arahan dan kedudukan.', 'A command queue and a position.'],
        ['4–11', 'Baca arahan seterusnya; keluar pada "stop" atau apabila baris gilir habis; jika tidak, jalankannya.', 'Read the next command; leave on "stop" or when the queue runs out; otherwise run it.'],
        ['12', '"never" tidak pernah dijalankan.', '"never" is never run.'])),
    S('common_mistakes',
      UL(
        ['Lupa mengemas kini pemboleh ubah syarat dalam `while` — gelung tak terhingga.', 'Forgetting to update the condition variable in a `while` — an infinite loop.'],
        ['Langkah pecahan seperti 0.1 dan menjangka pusingan terakhir yang tepat.', 'Fractional steps such as 0.1 and expecting an exact last pass.'],
        ['Langkah 0 (senyap dalam Luau) atau langkah positif untuk kiraan ke bawah.', 'A step of 0 (silent in Luau) or a positive step for a countdown.'],
        ['Menulis `end` selepas `until`.', 'Writing `end` after `until`.'],
      )),
    S('debugging',
      P('Untuk gelung yang tidak berjalan langsung, cetak mula, had dan langkah — langkah 0 atau tanda yang salah (`for i = 10, 1` tanpa `-1`) memberi sifar pusingan tanpa ralat. Untuk gelung yang tidak berhenti, cetak pemboleh ubah syarat pada setiap pusingan dan tambah had keselamatan sementara. Contoh berikut menunjukkan gelung dengan had keselamatan:',
        'For a loop that does not run at all, print the start, limit and step — a step of 0 or the wrong sign (`for i = 10, 1` without `-1`) gives zero passes without an error. For a loop that never stops, print the condition variable every pass and add a temporary safety limit. The following example shows a loop with a safety limit:'),
      CODE('safety-limit', 'luau', 'luau', ['Gelung dengan had keselamatan', 'A loop with a safety limit'], `
local MAX_PASSES = 1000
local passes = 0
local value = 1

while value ~= 64 do
  passes += 1
  if passes > MAX_PASSES then
    print("safety stop: condition never became true")
    break
  end
  value *= 2
end
print(value, passes)
`, '64\t6'),
      EXPLAIN('safety-limit',
        ['1–3', 'Had keselamatan dan keadaan gelung.', 'A safety limit and the loop state.'],
        ['5–12', 'Jika syarat tidak pernah benar (contohnya `value` bermula 3), had menghentikan gelung dengan mesej dan bukannya menyekat program.', 'If the condition never became true (for example if `value` started at 3), the limit stops the loop with a message instead of blocking the program.'],
        ['13', '1 → 64 dalam 6 pendaraban.', '1 → 64 in 6 doublings.'])),
    S('performance',
      P('`for` berangka ialah gelung terpantas dalam Luau: kiraan dalaman diuruskan oleh satu arahan VM. `while` dengan pengiraan syarat yang mahal membayar kos itu setiap pusingan — simpan nilai dalam local. Dalam Roblox, gelung panjang yang tidak menyerahkan kawalan (tanpa `task.wait`) menyekat semua skrip lain pada utas itu.', 'The numeric `for` is the fastest loop in Luau: its internal counter is handled by one VM instruction. A `while` with an expensive condition pays that cost every pass — keep values in locals. In Roblox, a long loop that never yields (no `task.wait`) blocks every other script on that thread.')),
    S('software_engineering',
      P('Gelung `while` manual untuk bilangan yang diketahui berbanding `for`:', 'A manual `while` loop for a known count versus `for`:'),
      CODE('poor-manual-counter', 'luau', 'luau', ['Pelaksanaan lemah: kaunter manual', 'Poor implementation: a manual counter'], `
local i = 1
local total = 0
while i <= 5 do
  total += i * i
  i += 1
end
print(total, i)
`, '55\t6'),
      EXPLAIN('poor-manual-counter',
        ['1–6', 'Tiga bahagian gelung (mula, semak, langkah) tersebar di tiga baris; terlupa `i += 1` memberi gelung tak terhingga; `i` kekal selepas gelung.', 'The loop’s three parts (start, check, step) are spread over three lines; forgetting `i += 1` gives an infinite loop; `i` survives after the loop.'],
        ['7', 'Jumlah kuasa dua 1–5 = 55.', 'The sum of squares 1–5 = 55.']),
      CODE('improved-for-loop', 'luau', 'luau', ['Pelaksanaan lebih baik: for berangka', 'Improved implementation: a numeric for'], `
local total = 0
for i = 1, 5 do
  total += i * i
end
print(total)
`, '55'),
      EXPLAIN('improved-for-loop',
        ['1–5', 'Mula, had dan langkah dalam satu baris; tiada cara untuk terlupa langkah; `i` wujud hanya dalam gelung.', 'Start, limit and step on one line; no way to forget the step; `i` exists only inside the loop.'])),
    S('industry_use_cases',
      UL(
        ['Kiraan detik pusingan dan rehat menggunakan `for` dengan langkah −1.', 'Round and intermission countdowns use `for` with a step of −1.'],
        ['Cuba semula DataStore menggunakan `repeat … until berjaya or percubaan >= MAX`.', 'DataStore retries use `repeat … until success or attempts >= MAX`.'],
        ['Gelung permainan utama dalam Roblox menggunakan `while true do … task.wait() end` (API enjin).', 'Main game loops in Roblox use `while true do … task.wait() end` (engine API).'],
      )),
    S('practical_demonstration',
      OL(
        ['Tukar kiraan detik kepada 10–1 dan langkau nombor genap dengan `continue` (kuliah 2.3).', 'Change the countdown to 10–1 and skip even numbers with `continue` (lecture 2.3).'],
        ['Ubah `safety-limit` supaya `value` bermula pada 3 dan perhatikan had keselamatan.', 'Change `safety-limit` so `value` starts at 3 and watch the safety limit.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Sistem cuba semula.** Simulasikan muat turun data pemain yang gagal secara rawak (gunakan senarai keputusan tetap), cuba semula sehingga 4 kali dengan penundaan yang bertambah, dan laporkan keputusan.', '**A retry system.** Simulate loading player data that fails at random (use a fixed list of outcomes), retry up to 4 times with increasing delay, and report the result.'),
      CODE('retry-system', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local MAX_ATTEMPTS = 4
local outcomes = {false, false, true}

local attempt = 0
local delay = 0.5
local ok
repeat
  attempt += 1
  ok = outcomes[attempt] == true
  if not ok then
    print(\`attempt {attempt} failed, waiting {delay}s\`)
    delay *= 2
  end
until ok or attempt >= MAX_ATTEMPTS

print(if ok then \`loaded after {attempt} attempts\` else "giving up")
`, 'attempt 1 failed, waiting 0.5s\nattempt 2 failed, waiting 1s\nloaded after 3 attempts'),
      EXPLAIN('retry-system',
        ['1–2', 'Had percubaan dan keputusan tetap (supaya output boleh disahkan).', 'The attempt limit and fixed outcomes (so the output can be verified).'],
        ['4–6', 'Keadaan: percubaan, penundaan dan keputusan.', 'State: the attempt, the delay and the result.'],
        ['7–14', '`repeat`: sentiasa cuba sekali; penundaan berganda selepas setiap kegagalan; keluar apabila berjaya atau had dicapai.', '`repeat`: always tries once; the delay doubles after each failure; leave on success or when the limit is reached.'],
        ['16', 'Laporan akhir dengan if-expression. (Dalam Roblox, penundaan sebenar menggunakan `task.wait(delay)`.)', 'The final report with an if-expression. (In Roblox, a real delay uses `task.wait(delay)`.)'])),
    S('summary',
      UL(
        ['`for` berangka: had dan langkah dinilai sekali; langkah 0 → sifar pusingan dalam Luau.', 'Numeric `for`: the limit and step are evaluated once; a step of 0 → zero passes in Luau.'],
        ['`while` mungkin tidak berjalan; `repeat` sentiasa sekali dan `until` melihat local badan.', '`while` may not run; `repeat` always runs once and `until` sees the body’s locals.'],
        ['Elak langkah pecahan; gelung atas integer dan bahagikan.', 'Avoid fractional steps; loop over integers and divide.'],
        ['Setiap gelung `while`/`repeat` mesti mengubah syaratnya.', 'Every `while`/`repeat` loop must change its condition.'],
      )),
    S('knowledge_check',
      OL(
        ['Berapa kali `for i = 1, 10, 3` berjalan, dan apakah nilai `i`?', 'How many times does `for i = 1, 10, 3` run, and what are the values of `i`?'],
        ['Apakah yang berlaku dengan `for i = 1, 5, 0` dalam Luau?', 'What happens with `for i = 1, 5, 0` in Luau?'],
        ['Bilakah `repeat` lebih sesuai daripada `while`?', 'When is `repeat` more suitable than `while`?'],
        ['Mengapakah menukar `i` di dalam badan tidak mengubah bilangan pusingan?', 'Why does changing `i` inside the body not change the number of passes?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Control structures (loops)', url: `${DOCS}/luau/control-structures` },
        { title: 'Luau — Syntax', url: `${LUAU}/syntax` },
        { title: 'Lua 5.1 Reference Manual §2.4.5 — For Statement (inherited by Luau)', url: 'https://www.lua.org/manual/5.1/manual.html#2.4.5' },
        { title: 'Roblox Creator Hub — Script timeout and yielding (task library)', url: `${DOCS}/reference/engine/libraries/task` },
      )),
  ],
};

// ─── 2.2 Generalized iteration: for k, v in t ──────────────────────────────

export const LUAU103_2_2: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 2,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Melelar table dengan [[generalized-iteration|iterasi umum]] `for k, v in t`.', 'Iterate tables with [[generalized-iteration|generalized iteration]] `for k, v in t`.'],
        ['Menerangkan susunan: bahagian senarai mengikut indeks dahulu, kemudian kunci lain tanpa susunan tetap.', 'Explain the order: the list part by index first, then other keys in no fixed order.'],
        ['Membezakan iterasi umum, `ipairs` dan `pairs`, termasuk tingkah laku dengan lubang `nil`.', 'Distinguish generalized iteration, `ipairs` and `pairs`, including their behaviour with `nil` holes.'],
        ['Mengubah table dengan selamat semasa melelar.', 'Change a table safely while iterating.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1: gelung `for`.', 'Lecture 2.1: `for` loops.'],
        ['Table sebagai senarai dan dictionary (diperkenalkan; LUAU104 mendalaminya).', 'Tables as lists and dictionaries (introduced; LUAU104 goes deeper).'],
      )),
    S('introduction',
      P('Dalam Lua, melelar table memerlukan `pairs(t)` atau `ipairs(t)`. Luau membenarkan bentuk yang lebih ringkas: `for k, v in t do`. Ini dipanggil **iterasi umum**, dan ia kini cara yang disyorkan dalam kod Roblox. Ia melawati setiap pasangan kunci–nilai: elemen senarai dalam susunan indeks, kemudian kunci lain. Kuliah ini menerangkan susunan itu dengan tepat, perbezaannya daripada `ipairs`, dan peraturan untuk mengubah table semasa ia dilelar.',
        'In Lua, iterating a table needs `pairs(t)` or `ipairs(t)`. Luau allows a shorter form: `for k, v in t do`. This is called **generalized iteration**, and it is now the recommended way in Roblox code. It visits every key–value pair: list elements in index order, then the other keys. This lecture explains that order precisely, how it differs from `ipairs`, and the rules for changing a table while it is being iterated.'),
      KEY('`for k, v in t` = setiap pasangan. Senarai mengikut susunan; dictionary tanpa susunan tetap.', '`for k, v in t` = every pair. Lists in order; dictionaries in no fixed order.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`for i, v in senarai` — indeks 1, 2, 3 … mengikut susunan.', '`for i, v in list` — indices 1, 2, 3 … in order.'],
        ['`for k, v in dict` — setiap kunci, susunan **tidak dijamin**; isih kunci jika susunan penting.', '`for k, v in dict` — every key, order **not guaranteed**; sort the keys if order matters.'],
        ['Lubang `nil` dilangkau; `ipairs` pula **berhenti** pada `nil` pertama.', '`nil` holes are skipped; `ipairs`, by contrast, **stops** at the first `nil`.'],
        ['Menetapkan medan **sedia ada** (termasuk kepada `nil`) semasa melelar dibenarkan; menambah kunci baharu tidak dijamin.', 'Assigning **existing** fields (including to `nil`) while iterating is allowed; adding new keys is not guaranteed.'],
        ['Objek boleh menentukan iterasinya sendiri dengan metamethod `__iter`.', 'Objects can define their own iteration with the `__iter` metamethod.'],
      )),
    S('detailed_theory',
      P('Table Luau mempunyai dua bahagian dalaman: **bahagian senarai** untuk kunci integer 1, 2, 3, … dan **bahagian hash** untuk kunci lain. Iterasi umum melawati bahagian senarai dahulu dalam susunan indeks, melangkau slot `nil`, kemudian bahagian hash dalam susunan dalaman yang bergantung pada saiz table dan sejarah sisipan — jangan bergantung padanya. Jika anda perlukan susunan tetap untuk dictionary (contohnya papan pendahulu atau output yang boleh diuji), kumpul kunci ke dalam senarai, isih, dan lelar senarai itu. `ipairs` hanya melawati bahagian senarai dan berhenti pada `nil` pertama, jadi ia sesuai apabila anda **mahu** berhenti pada hujung jujukan.',
        'A Luau table has two internal parts: a **list part** for integer keys 1, 2, 3, … and a **hash part** for other keys. Generalized iteration visits the list part first in index order, skipping `nil` slots, then the hash part in an internal order that depends on the table’s size and insertion history — do not rely on it. If you need a fixed order for a dictionary (for example a leaderboard or testable output), collect the keys into a list, sort it, and iterate that list. `ipairs` only visits the list part and stops at the first `nil`, so it suits cases where you **want** to stop at the end of a sequence.'),
      P('Mengubah table semasa melelar mempunyai peraturan yang jelas: menetapkan nilai baharu kepada kunci yang **sudah wujud** — termasuk menetapkannya kepada `nil` untuk membuang — adalah selamat. Menambah kunci **baharu** semasa iterasi boleh menyebabkan sesetengah kunci dilawati dua kali atau dilangkau, kerana table mungkin menyusun semula dirinya; kumpul tambahan dalam table berasingan dan gabungkan selepas gelung. Melelar sesuatu yang bukan table (nombor, string, `nil`) ialah ralat `attempt to iterate over a … value`, kecuali objek itu mempunyai metamethod `__iter` — mekanisme yang membolehkan struktur data tersuai menyokong `for … in` secara langsung.',
        'Changing a table while iterating it has clear rules: assigning a new value to a key that **already exists** — including setting it to `nil` to remove it — is safe. Adding **new** keys during iteration can cause some keys to be visited twice or skipped, because the table may reorganise itself; collect additions in a separate table and merge them after the loop. Iterating something that is not a table (a number, a string, `nil`) is the error `attempt to iterate over a … value`, unless the object has an `__iter` metamethod — the mechanism that lets custom data structures support `for … in` directly.')),
    S('technical_terminology', TERMS('generalized-iteration', 'iterator', 'table', 'metatable')),
    S('syntax_rules',
      UL(
        ['`for i, v in senarai do` · `for k, v in dict do` · `for k in dict do` (kunci sahaja).', '`for i, v in list do` · `for k, v in dict do` · `for k in dict do` (keys only).'],
        ['Masih sah: `for i, v in ipairs(t)` dan `for k, v in pairs(t)`.', 'Still valid: `for i, v in ipairs(t)` and `for k, v in pairs(t)`.'],
        ['Susunan tetap: `local keys = {}; for k in t do table.insert(keys, k) end; table.sort(keys)`.', 'A fixed order: `local keys = {}; for k in t do table.insert(keys, k) end; table.sort(keys)`.'],
      )),
    S('code_demonstration',
      CODE('gen-iter-basics', 'luau', 'luau', ['Iterasi umum', 'Generalized iteration'], `
local inventory = {"sword", "shield", "potion"}
for slot, item in inventory do
  print(slot, item)
end

local prices = {sword = 300, shield = 200, potion = 50}
local total = 0
for _, price in prices do
  total += price
end
print("total value:", total)
`, '1\tsword\n2\tshield\n3\tpotion\ntotal value:\t550'),
      EXPLAIN('gen-iter-basics',
        ['1–4', 'Senarai: indeks dan nilai dalam susunan.', 'A list: indices and values in order.'],
        ['6–11', 'Dictionary: susunan tidak dijamin, tetapi jumlah tidak bergantung pada susunan — jadi output sentiasa sama.', 'A dictionary: the order is not guaranteed, but the sum does not depend on order — so the output is always the same.'])),
    S('complete_examples',
      CODE('holes-and-ipairs', 'luau', 'luau', ['Lubang nil: iterasi umum berbanding ipairs', 'nil holes: generalized iteration versus ipairs'], `
local slots = {"sword", nil, "potion", nil, "map"}

local general, sequential = {}, {}
for i, item in slots do
  table.insert(general, \`{i}:{item}\`)
end
for i, item in ipairs(slots) do
  table.insert(sequential, \`{i}:{item}\`)
end
print("general:", table.concat(general, " "))
print("ipairs:", table.concat(sequential, " "))
`, 'general:\t1:sword 3:potion 5:map\nipairs:\t1:sword', {
        debug: BUG(`
local playerData = nil
for key, value in playerData do
  print(key, value)
end
`, 'example:2: attempt to iterate over a nil value',
          'Data pemain belum dimuatkan (`nil`), dan iterasi umum memerlukan table. Luau melaporkan jenis yang cuba dilelar. Tambah pengawal sebelum gelung: `if playerData == nil then return end`, atau gunakan table kosong sebagai lalai: `for k, v in playerData or {} do`.',
          'The player data has not loaded (`nil`), and generalized iteration needs a table. Luau reports the type it tried to iterate. Add a guard before the loop: `if playerData == nil then return end`, or use an empty table as a default: `for k, v in playerData or {} do`.'),
      }),
      EXPLAIN('holes-and-ipairs',
        ['1', 'Slot inventori dengan dua lubang `nil`.', 'Inventory slots with two `nil` holes.'],
        ['3–6', 'Iterasi umum melawati setiap slot yang tidak `nil`: 1, 3, 5.', 'Generalized iteration visits every non-`nil` slot: 1, 3, 5.'],
        ['7–9', '`ipairs` berhenti pada lubang pertama (indeks 2).', '`ipairs` stops at the first hole (index 2).'],
        ['10–11', 'Perbezaannya jelas dalam output.', 'The difference is clear in the output.']),
      CODE('sorted-dictionary', 'luau', 'luau', ['Susunan tetap untuk dictionary', 'A fixed order for a dictionary'], `
local scores = {Chen = 1500, Aina = 1200, Ben = 950, Dewi = 1200}

local names = {}
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
`, '1\tChen\t1500\n2\tAina\t1200\n3\tDewi\t1200\n4\tBen\t950', {
        debug: BUG(`
local scores = {Aina = 10}
for name in "Aina" do
  print(name, scores[name])
end
`, 'example:2: attempt to iterate over a string value',
          'String tidak boleh dilelar terus dengan `for … in`. Untuk melawati aksara, gunakan `for i = 1, #s do local c = s:sub(i, i) … end` atau `string.gmatch`. Di sini niatnya mungkin melelar table `scores`, bukan nama.',
          'A string cannot be iterated directly with `for … in`. To visit characters, use `for i = 1, #s do local c = s:sub(i, i) … end` or `string.gmatch`. Here the intent was probably to iterate the `scores` table, not a name.'),
      }),
      EXPLAIN('sorted-dictionary',
        ['1', 'Dictionary skor — susunan iterasinya tidak dijamin.', 'A score dictionary — its iteration order is not guaranteed.'],
        ['3–6', 'Kumpul kunci (nama) dengan `for name in scores`.', 'Collect the keys (names) with `for name in scores`.'],
        ['7–10', 'Isih: skor menurun, kemudian nama untuk skor sama — susunan sentiasa tetap.', 'Sort: score descending, then name for equal scores — the order is always fixed.'],
        ['12–14', 'Lelar senarai yang diisih untuk papan pendahulu yang stabil.', 'Iterate the sorted list for a stable leaderboard.'])),
    S('line_by_line',
      EXPLAIN('holes-and-ipairs',
        ['4', '`for i, item in slots` — tiada `pairs`/`ipairs`: iterasi umum Luau.', '`for i, item in slots` — no `pairs`/`ipairs`: Luau generalized iteration.']),
      EXPLAIN('sorted-dictionary',
        ['4', '`for name in scores` — dengan satu pemboleh ubah, hanya kunci diambil.', '`for name in scores` — with one variable, only the keys are taken.'])),
    S('why_this_way',
      P('Mengapa iterasi umum? Kerana ia lebih ringkas, lebih pantas (VM boleh mengoptimumkannya terus), dan tidak memerlukan pemula memilih antara `pairs` dan `ipairs` untuk kes biasa. `ipairs` masih berguna apabila anda sengaja mahu berhenti pada `nil` pertama.',
        'Why generalized iteration? Because it is shorter, faster (the VM can optimise it directly), and does not require beginners to choose between `pairs` and `ipairs` for the common case. `ipairs` is still useful when you deliberately want to stop at the first `nil`.'),
      P('Gunakan `for k, v in t` **secara lalai**; isih kunci **apabila** susunan dictionary penting; gunakan `ipairs` **apabila** anda mahu berhenti pada hujung jujukan berturutan.', 'Use `for k, v in t` **by default**; sort keys **when** dictionary order matters; use `ipairs` **when** you want to stop at the end of a contiguous sequence.')),
    S('execution_flow',
      OL(
        ['`for i, item in slots`: Luau mula pada bahagian senarai, indeks 1 → "sword".', '`for i, item in slots`: Luau starts at the list part, index 1 → "sword".'],
        ['Indeks 2 ialah `nil` → dilangkau; indeks 3 → "potion"; indeks 4 dilangkau; indeks 5 → "map".', 'Index 2 is `nil` → skipped; index 3 → "potion"; index 4 skipped; index 5 → "map".'],
        ['Bahagian hash kosong → gelung tamat.', 'The hash part is empty → the loop ends.'],
      )),
    S('memory_behaviour',
      P('Iterasi umum tidak memperuntukkan memori — tidak seperti `pairs`, yang (dalam Lua) memanggil fungsi iterator setiap pusingan. Mengumpul kunci untuk diisih memerlukan senarai tambahan sebesar bilangan kunci; untuk dictionary kecil (papan pendahulu) ini tidak penting.',
        'Generalized iteration allocates no memory — unlike `pairs`, which (in Lua) calls an iterator function every pass. Collecting keys for sorting needs an extra list as large as the number of keys; for small dictionaries (leaderboards) this does not matter.')),
    S('alternative_implementations',
      P('Metamethod `__iter` membolehkan objek tersuai berkelakuan seperti table dalam `for … in`:', 'The `__iter` metamethod lets a custom object behave like a table in `for … in`:'),
      CODE('custom-iter', 'luau', 'luau', ['Iterasi tersuai dengan __iter', 'Custom iteration with __iter'], `
local Range = {}
Range.__iter = function(self)
  local current = self.first - self.step
  return function()
    current += self.step
    if current <= self.last then
      return current
    end
    return nil
  end
end

local evens = setmetatable({first = 2, last = 10, step = 2}, Range)
local seen = {}
for n in evens do
  table.insert(seen, n)
end
print(table.concat(seen, " "))
`, '2 4 6 8 10'),
      EXPLAIN('custom-iter',
        ['1–11', '`__iter` memulangkan fungsi yang memberi nilai seterusnya setiap kali dipanggil, dan `nil` apabila habis.', '`__iter` returns a function that gives the next value each time it is called, and `nil` when finished.'],
        ['13–18', '`for n in evens` menggunakan `__iter` secara automatik — tiada table nombor dicipta.', '`for n in evens` uses `__iter` automatically — no table of numbers is created.'])),
    S('common_mistakes',
      UL(
        ['Bergantung pada susunan iterasi dictionary.', 'Relying on dictionary iteration order.'],
        ['Menggunakan `ipairs` pada senarai dengan lubang dan kehilangan elemen.', 'Using `ipairs` on a list with holes and losing elements.'],
        ['Menambah kunci baharu kepada table yang sedang dilelar.', 'Adding new keys to the table being iterated.'],
        ['Melelar `nil` (data belum dimuatkan) tanpa pengawal.', 'Iterating `nil` (data not loaded yet) without a guard.'],
      )),
    S('debugging',
      P('Jika gelung melawati lebih sedikit elemen daripada dijangka, semak sama ada anda menggunakan `ipairs` pada senarai dengan lubang. Jika output berubah antara larian, anda bergantung pada susunan dictionary — isih kunci. Jika gelung kelihatan melawati kunci yang anda tambah semasa gelung, kumpul tambahan dan gabungkan selepas. Contoh berikut membuang item dengan selamat semasa melelar:',
        'If a loop visits fewer elements than expected, check whether you used `ipairs` on a list with holes. If the output changes between runs, you are relying on dictionary order — sort the keys. If a loop seems to visit keys you added during the loop, collect the additions and merge them afterwards. The following example removes items safely while iterating:'),
      CODE('safe-removal', 'luau', 'luau', ['Membuang semasa melelar dengan selamat', 'Removing safely while iterating'], `
local buffs = {speed = 3, shield = 0, regen = 1, haste = 0}

for name, turns in buffs do
  if turns == 0 then
    buffs[name] = nil
  end
end

local remaining = {}
for name in buffs do table.insert(remaining, name) end
table.sort(remaining)
print(table.concat(remaining, ", "))
`, 'regen, speed'),
      EXPLAIN('safe-removal',
        ['1', 'Kesan aktif dan baki pusingannya.', 'Active buffs and their remaining turns.'],
        ['3–7', 'Menetapkan kunci **sedia ada** kepada `nil` semasa melelar adalah selamat.', 'Setting an **existing** key to `nil` while iterating is safe.'],
        ['9–12', 'Senarai yang tinggal, diisih untuk output yang stabil.', 'The remaining list, sorted for stable output.'])),
    S('performance',
      P('Iterasi umum ialah cara terpantas untuk melelar table dalam Luau — lebih pantas daripada `pairs` kerana tiada panggilan fungsi iterator. Untuk senarai, ia sama pantas dengan `for i = 1, #t`. Mengisih kunci mempunyai kos O(n log n); lakukannya sekali dan bukannya dalam setiap bingkai.', 'Generalized iteration is the fastest way to iterate a table in Luau — faster than `pairs` because there is no iterator function call. For lists, it is as fast as `for i = 1, #t`. Sorting keys costs O(n log n); do it once rather than every frame.')),
    S('software_engineering',
      P('Gaya Lua lama berbanding iterasi umum:', 'Old Lua style versus generalized iteration:'),
      CODE('poor-pairs-style', 'luau', 'luau', ['Pelaksanaan lemah: pairs dan ipairs di mana-mana', 'Poor implementation: pairs and ipairs everywhere'], `
local team = {"Aina", "Ben", "Chen"}
local kills = {Aina = 3, Ben = 5, Chen = 2}
local total = 0
for i, name in ipairs(team) do
  for player, k in pairs(kills) do
    if player == name then total = total + k end
  end
end
print(total)
`, '10'),
      EXPLAIN('poor-pairs-style',
        ['1–9', 'Gaya lama, dan gelung dalaman yang tidak perlu: untuk setiap nama, seluruh dictionary dilawati untuk mencari satu kunci — O(n²).', 'Old style, and an unnecessary inner loop: for each name, the whole dictionary is visited to find one key — O(n²).']),
      CODE('improved-generalized', 'luau', 'luau', ['Pelaksanaan lebih baik: iterasi umum dan carian terus', 'Improved implementation: generalized iteration and direct lookup'], `
local team = {"Aina", "Ben", "Chen"}
local kills = {Aina = 3, Ben = 5, Chen = 2}
local total = 0
for _, name in team do
  total += kills[name] or 0
end
print(total)
`, '10'),
      EXPLAIN('improved-generalized',
        ['1–7', 'Satu gelung; `kills[name]` mencari terus — O(n). Lalai `or 0` untuk pemain tanpa rekod.', 'One loop; `kills[name]` looks up directly — O(n). The `or 0` default covers players without a record.'])),
    S('industry_use_cases',
      UL(
        ['Kod Roblox moden melelar `Players:GetPlayers()` dengan `for _, player in …`.', 'Modern Roblox code iterates `Players:GetPlayers()` with `for _, player in …`.'],
        ['Papan pendahulu mengisih kunci dictionary statistik untuk paparan yang stabil.', 'Leaderboards sort the keys of statistics dictionaries for a stable display.'],
        ['Struktur data tersuai (baris gilir, julat) menggunakan `__iter`.', 'Custom data structures (queues, ranges) use `__iter`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tukar `holes-and-ipairs` supaya slot 2 diisi dan bandingkan output.', 'Change `holes-and-ipairs` so slot 2 is filled and compare the output.'],
        ['Tambah pemain "Eva" dengan skor 1200 pada `sorted-dictionary`; ramalkan kedudukannya.', 'Add a player "Eva" with a score of 1200 to `sorted-dictionary`; predict her rank.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Ringkasan inventori.** Diberi inventori dengan lubang dan dictionary kuantiti, kira jumlah item, senaraikan item mengikut abjad dengan kuantiti, dan buang item yang kuantitinya 0.', '**An inventory summary.** Given an inventory with holes and a quantity dictionary, count the items, list them alphabetically with quantities, and remove items whose quantity is 0.'),
      CODE('inventory-summary', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local quantities = {potion = 5, arrow = 0, gem = 2, scroll = 1, key = 0}

for item, qty in quantities do
  if qty == 0 then quantities[item] = nil end
end

local names, totalItems = {}, 0
for item, qty in quantities do
  table.insert(names, item)
  totalItems += qty
end
table.sort(names)

for _, item in names do
  print(\`{item} x{quantities[item]}\`)
end
print(\`{#names} kinds, {totalItems} items\`)
`, 'gem x2\npotion x5\nscroll x1\n3 kinds, 8 items'),
      EXPLAIN('inventory-summary',
        ['1', 'Kuantiti, termasuk dua sifar.', 'Quantities, including two zeros.'],
        ['3–5', 'Buang sifar — menetapkan kunci sedia ada kepada `nil` adalah selamat semasa melelar.', 'Remove zeros — setting existing keys to `nil` is safe while iterating.'],
        ['7–12', 'Kumpul nama dan jumlahkan kuantiti; isih nama.', 'Collect names and sum quantities; sort the names.'],
        ['14–17', 'Senarai abjad dan ringkasan.', 'An alphabetical list and a summary.'])),
    S('summary',
      UL(
        ['`for k, v in t` — iterasi umum Luau, tanpa `pairs`/`ipairs`.', '`for k, v in t` — Luau generalized iteration, without `pairs`/`ipairs`.'],
        ['Senarai mengikut susunan (melangkau `nil`); dictionary tanpa susunan tetap.', 'Lists in order (skipping `nil`); dictionaries in no fixed order.'],
        ['`ipairs` berhenti pada `nil` pertama.', '`ipairs` stops at the first `nil`.'],
        ['Tetapkan kunci sedia ada (termasuk `nil`) dengan selamat; jangan tambah kunci baharu semasa melelar.', 'Assign existing keys (including `nil`) safely; do not add new keys while iterating.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dilawati oleh `for i, v in {1, nil, 3}`?', 'What does `for i, v in {1, nil, 3}` visit?'],
        ['Bagaimanakah anda melelar dictionary dalam susunan abjad?', 'How do you iterate a dictionary in alphabetical order?'],
        ['Mengapakah menambah kunci semasa iterasi berisiko?', 'Why is adding keys during iteration risky?'],
        ['Bilakah `ipairs` masih berguna?', 'When is `ipairs` still useful?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax: generalized iteration', url: `${LUAU}/syntax#generalized-iteration` },
        { title: 'Luau RFC — Generalized iteration', url: 'https://github.com/luau-lang/rfcs/blob/master/docs/generalized-iteration.md' },
        { title: 'Roblox Creator Hub — Tables (iteration)', url: `${DOCS}/luau/tables` },
        { title: 'Roblox Creator Hub — Metatables (including __iter)', url: `${DOCS}/luau/metatables` },
      )),
  ],
};

// ─── 2.3 break and continue ────────────────────────────────────────────────

export const LUAU103_2_3: LectureContentDef = {
  courseCode: 'LUAU103',
  module: 2,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan `break` untuk keluar daripada gelung terdalam.', 'Use `break` to leave the innermost loop.'],
        ['Menggunakan [[continue-statement|`continue`]] untuk melangkau ke pusingan seterusnya.', 'Use [[continue-statement|`continue`]] to skip to the next pass.'],
        ['Menerangkan peraturan: kedua-duanya mesti terakhir dalam blok, hanya di dalam gelung, dan had `continue` dalam `repeat … until`.', 'Explain the rules: both must be last in their block, only inside loops, and the `continue` limit in `repeat … until`.'],
        ['Keluar daripada gelung bersarang dengan `return` dalam fungsi.', 'Leave nested loops with `return` inside a function.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1–2.2: gelung dan iterasi umum.', 'Lectures 2.1–2.2: loops and generalized iteration.'],
      )),
    S('introduction',
      P('Kadang-kadang anda tidak perlu menghabiskan gelung: musuh pertama dalam jarak sudah dijumpai, atau item ini tidak relevan dan boleh dilangkau. `break` keluar daripada gelung sepenuhnya; `continue` melangkau baki pusingan semasa dan terus ke pusingan seterusnya. Lua standard hanya mempunyai `break` — `continue` ialah tambahan Luau, menggantikan corak `goto continue` Lua 5.2+. Kuliah ini mengajar kedua-duanya bersama peraturan khas Luau yang memastikannya selamat.',
        'Sometimes you do not need to finish a loop: the first enemy in range has already been found, or this item is irrelevant and can be skipped. `break` leaves the loop completely; `continue` skips the rest of the current pass and moves to the next one. Standard Lua only has `break` — `continue` is a Luau addition, replacing Lua 5.2+’s `goto continue` pattern. This lecture teaches both, together with the Luau-specific rules that keep them safe.'),
      KEY('`break` = berhenti gelung. `continue` = langkau pusingan ini. Kedua-duanya: pernyataan terakhir blok, di dalam gelung.', '`break` = stop the loop. `continue` = skip this pass. Both: the last statement of a block, inside a loop.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`break` keluar daripada gelung **terdalam** sahaja.', '`break` leaves the **innermost** loop only.'],
        ['`continue` melompat ke pusingan seterusnya (`for` menambah pembilang; `while`/`repeat` menyemak syarat).', '`continue` jumps to the next pass (`for` advances the counter; `while`/`repeat` check the condition).'],
        ['Kedua-duanya mesti pernyataan **terakhir** dalam bloknya — biasanya `if … then continue end`.', 'Both must be the **last** statement in their block — usually `if … then continue end`.'],
        ['Di luar gelung: ralat sintaks `break/continue statement must be inside a loop`.', 'Outside a loop: the syntax error `break/continue statement must be inside a loop`.'],
        ['Dalam `repeat … until`, `continue` tidak boleh melompat melepasi local yang digunakan dalam syarat `until`.', 'In `repeat … until`, `continue` cannot jump past a local used in the `until` condition.'],
      )),
    S('detailed_theory',
      P('`break` dan `continue` dikompil kepada lompatan: `break` ke selepas `end` gelung, `continue` ke titik "pusingan seterusnya". Kerana kod selepasnya dalam blok yang sama tidak boleh dicapai, Luau mewajibkan kedua-duanya menjadi pernyataan terakhir dalam bloknya — `continue` diikuti oleh `print(i)` ialah ralat sintaks. Kedua-duanya hanya menjejaskan gelung **terdalam**: dalam gelung bersarang, `break` dalam gelung dalam meneruskan gelung luar. Untuk keluar daripada beberapa gelung sekali gus, letakkan gelung dalam fungsi dan gunakan `return` — Luau tidak mempunyai `goto` atau `break` berlabel.',
        '`break` and `continue` compile to jumps: `break` to just after the loop’s `end`, `continue` to the "next pass" point. Because code after them in the same block could never be reached, Luau requires both to be the last statement in their block — `continue` followed by `print(i)` is a syntax error. Both only affect the **innermost** loop: in nested loops, a `break` in the inner loop continues the outer loop. To leave several loops at once, put the loops in a function and use `return` — Luau has no `goto` or labelled `break`.'),
      P('Satu peraturan khas Luau melindungi `repeat … until`. Syarat `until` boleh membaca local yang diisytiharkan dalam badan (kuliah 2.1). Jika `continue` berlaku **sebelum** local itu diisytiharkan, local itu tidak akan mempunyai nilai apabila syarat disemak. Luau mengesan situasi ini semasa kompil dan menolaknya dengan mesej yang sangat jelas: `Local done used in the repeat..until condition is undefined because continue statement on line 4 jumps over it`. Penyelesaiannya ialah mengisytiharkan local sebelum `continue`, atau menggunakan `while` dengan keadaan di luar gelung. Kerana ia ralat kompil, pepijat ini tidak pernah sampai ke pemain.',
        'One Luau-specific rule protects `repeat … until`. The `until` condition can read locals declared in the body (lecture 2.1). If `continue` happens **before** such a local is declared, that local would have no value when the condition is checked. Luau detects this at compile time and rejects it with a very clear message: `Local done used in the repeat..until condition is undefined because continue statement on line 4 jumps over it`. The fix is to declare the local before the `continue`, or to use `while` with state outside the loop. Because it is a compile error, this bug never reaches players.')),
    S('technical_terminology', TERMS('continue-statement', 'loop', 'control-flow', 'guard-clause')),
    S('syntax_rules',
      UL(
        ['`if syarat then break end` · `if syarat then continue end`.', '`if condition then break end` · `if condition then continue end`.'],
        ['Tiada `break 2`, `goto` atau label dalam Luau — gunakan `return` dalam fungsi untuk keluar bersarang.', 'No `break 2`, `goto` or labels in Luau — use `return` inside a function for nested exits.'],
        ['`continue` ialah kata kunci kontekstual; `local continue = 1` masih sah (elakkan).', '`continue` is a contextual keyword; `local continue = 1` is still valid (avoid it).'],
      )),
    S('code_demonstration',
      CODE('break-continue', 'luau', 'luau', ['break dan continue', 'break and continue'], `
local enemies = {
  {name = "slime", hp = 0, distance = 4},
  {name = "goblin", hp = 30, distance = 25},
  {name = "wolf", hp = 50, distance = 8},
  {name = "bat", hp = 10, distance = 3},
}

local target
for _, e in enemies do
  if e.hp <= 0 then continue end
  if e.distance <= 10 then
    target = e
    break
  end
end
print("target:", target and target.name)
`, 'target:\twolf'),
      EXPLAIN('break-continue',
        ['1–6', 'Senarai musuh dengan kesihatan dan jarak.', 'A list of enemies with health and distance.'],
        ['8–15', 'Langkau musuh yang mati (`continue`); berhenti pada musuh hidup pertama dalam 10 stud (`break`). "bat" lebih dekat tetapi tidak pernah diperiksa kerana gelung sudah berhenti.', 'Skip dead enemies (`continue`); stop at the first living enemy within 10 studs (`break`). "bat" is closer but is never checked because the loop already stopped.'],
        ['16', '`target and target.name` — selamat jika tiada sasaran.', '`target and target.name` — safe if there is no target.'])),
    S('complete_examples',
      CODE('nested-exit', 'luau', 'luau', ['Keluar daripada gelung bersarang dengan return', 'Leaving nested loops with return'], `
local grid = {
  {".", ".", "."},
  {".", "#", "."},
  {".", ".", "$"},
}

local function findTreasure(map)
  for row = 1, #map do
    for col = 1, #map[row] do
      if map[row][col] == "$" then
        return row, col
      end
    end
  end
  return nil
end

print(findTreasure(grid))
`, '3\t3', {
        debug: BUG(`
for i = 1, 3 do
  continue
  print(i)
end
`, "example:3: Expected 'end' (to close 'do' at line 1), got 'print'",
          '`continue` mesti pernyataan terakhir dalam bloknya. Selepas `continue` pada baris 2, Luau menjangka `end` yang menutup badan gelung, tetapi menemui `print` — kod yang tidak akan pernah dijalankan. Letakkan `continue` di dalam `if`: `if syarat then continue end`.',
          '`continue` must be the last statement in its block. After the `continue` on line 2, Luau expects the `end` closing the loop body, but finds `print` — code that could never run. Put `continue` inside an `if`: `if condition then continue end`.'),
      }),
      EXPLAIN('nested-exit',
        ['1–5', 'Grid 3 × 3 dengan harta karun "$".', 'A 3 × 3 grid with treasure "$".'],
        ['7–16', '`return` di dalam gelung dalam keluar daripada **kedua-dua** gelung dan fungsi serta-merta; `break` hanya akan keluar daripada gelung lajur.', '`return` inside the inner loop leaves **both** loops and the function at once; `break` would only leave the column loop.'],
        ['18', 'Baris 3, lajur 3.', 'Row 3, column 3.']),
      CODE('repeat-continue', 'luau', 'luau', ['continue dalam repeat … until dengan betul', 'continue in repeat … until correctly'], `
local rolls = {2, 6, 3, 6, 6}
local i = 0
local sixes = 0
repeat
  i += 1
  local done = i >= #rolls
  if rolls[i] ~= 6 then continue end
  sixes += 1
until done
print(\`{sixes} sixes in {i} rolls\`)
`, '3 sixes in 5 rolls', {
        debug: BUG(`
local i = 0
repeat
  i += 1
  if i == 2 then continue end
  local done = i >= 3
until done
`, 'example:6: Local done used in the repeat..until condition is undefined because continue statement on line 4 jumps over it',
          'Ini peraturan khas Luau: `until done` membaca local `done`, tetapi `continue` pada baris 4 boleh melompat ke syarat sebelum `done` diisytiharkan — jadi `done` tidak akan mempunyai nilai. Luau menolaknya semasa kompil dengan mesej yang menerangkan semuanya. Isytiharkan `done` **sebelum** `continue`, seperti versi asal.',
          'This is a Luau-specific rule: `until done` reads the local `done`, but the `continue` on line 4 can jump to the condition before `done` is declared — so `done` would have no value. Luau rejects this at compile time with a message that explains everything. Declare `done` **before** the `continue`, as in the original version.'),
      }),
      EXPLAIN('repeat-continue',
        ['1–3', 'Lontaran dadu, indeks dan kiraan enam.', 'Dice rolls, an index and a count of sixes.'],
        ['4–9', '`done` diisytiharkan **sebelum** `continue`, jadi syarat `until` sentiasa mempunyai nilai yang sah.', '`done` is declared **before** the `continue`, so the `until` condition always has a valid value.'],
        ['10', 'Tiga enam dalam lima lontaran.', 'Three sixes in five rolls.'])),
    S('line_by_line',
      EXPLAIN('break-continue',
        ['10', '`continue` sebagai pengawal gelung — sama seperti klausa pengawal dalam fungsi (kuliah 1.3), tetapi untuk satu pusingan.', '`continue` as a loop guard — like a guard clause in a function (lecture 1.3), but for one pass.']),
      EXPLAIN('repeat-continue',
        ['7', 'Selepas `continue`, Luau terus ke `until done` — dan `done` sudah diberi nilai pada baris 6.', 'After `continue`, Luau goes straight to `until done` — and `done` was already assigned on line 6.'])),
    S('why_this_way',
      P('Mengapa Luau menambah `continue` dan bukan `goto`? Kerana `continue` merangkumi kegunaan `goto` yang paling biasa dalam gelung, dan ia jauh lebih mudah dibaca dan dianalisis. Mengapa peraturan `repeat … until`? Supaya ciri baharu tidak membuka pintu kepada pembolehubah tanpa nilai — keselamatan ditangkap semasa kompil.',
        'Why did Luau add `continue` rather than `goto`? Because `continue` covers the most common use of `goto` in loops, and it is much easier to read and analyse. Why the `repeat … until` rule? So the new feature does not open the door to variables without values — safety is enforced at compile time.'),
      P('Gunakan `continue` **apabila** beberapa syarat menolak item di awal pusingan; `break` **apabila** carian selesai; `return` **apabila** keluar daripada gelung bersarang.', 'Use `continue` **when** several conditions reject an item at the start of a pass; `break` **when** a search is done; `return` **when** leaving nested loops.')),
    S('execution_flow',
      OL(
        ['`break-continue`, slime: hp 0 → `continue` → pusingan seterusnya.', '`break-continue`, slime: hp 0 → `continue` → next pass.'],
        ['goblin: hidup, jarak 25 > 10 → tiada tindakan → pusingan seterusnya.', 'goblin: alive, distance 25 > 10 → nothing → next pass.'],
        ['wolf: hidup, jarak 8 → `target = wolf`, `break` → keluar; bat tidak diperiksa.', 'wolf: alive, distance 8 → `target = wolf`, `break` → leave; bat is not checked.'],
      )),
    S('memory_behaviour',
      P('`break` dan `continue` tidak memperuntukkan memori. Apabila `break` atau `return` meninggalkan gelung, local badan dibebaskan seperti biasa. `continue` membebaskan local pusingan semasa sebelum pusingan seterusnya bermula.', '`break` and `continue` allocate no memory. When `break` or `return` leaves a loop, the body’s locals are released as usual. `continue` releases the current pass’s locals before the next pass starts.')),
    S('alternative_implementations',
      P('Tanpa `continue`, syarat dibalik dan kerja dibalut dalam `if` — sah tetapi menambah inden:', 'Without `continue`, the condition is inverted and the work wrapped in an `if` — valid but adds indentation:'),
      CODE('without-continue', 'luau', 'luau', ['Langkau tanpa continue', 'Skipping without continue'], `
local orders = {{qty = 2, paid = true}, {qty = 0, paid = true}, {qty = 1, paid = false}, {qty = 4, paid = true}}
local shipped = 0
for _, order in orders do
  if order.qty > 0 and order.paid then
    shipped += order.qty
  end
end
print(shipped)
`, '6'),
      EXPLAIN('without-continue',
        ['1–2', 'Pesanan dan jumlah yang dihantar.', 'Orders and the shipped total.'],
        ['3–7', 'Satu syarat gabungan; untuk satu atau dua syarat, ini sama jelas dengan `continue`.', 'One combined condition; for one or two conditions this is as clear as `continue`.'],
        ['8', '2 + 4 = 6.', '2 + 4 = 6.'])),
    S('common_mistakes',
      UL(
        ['Meletakkan kod selepas `break` atau `continue` dalam blok yang sama.', 'Putting code after `break` or `continue` in the same block.'],
        ['Menjangka `break` keluar daripada semua gelung bersarang.', 'Expecting `break` to leave all nested loops.'],
        ['Mengisytiharkan local yang digunakan oleh `until` selepas `continue`.', 'Declaring a local used by `until` after a `continue`.'],
        ['Menggunakan `continue` dalam `while` tanpa mengemas kini pembilang dahulu — gelung tak terhingga.', 'Using `continue` in a `while` without updating the counter first — an infinite loop.'],
      )),
    S('debugging',
      P('Kesilapan `continue` yang paling berbahaya ialah dalam `while`: jika pembilang dikemas kini **selepas** `continue`, pusingan yang dilangkau tidak pernah memajukan pembilang dan gelung berulang selama-lamanya. Sentiasa kemas kini pembilang di bahagian atas badan. Untuk ralat sintaks, mesej Luau menyebut baris dan sebab dengan tepat. Contoh berikut menunjukkan susunan yang betul dalam `while`:',
        'The most dangerous `continue` mistake is in a `while`: if the counter is updated **after** the `continue`, a skipped pass never advances the counter and the loop repeats forever. Always update the counter at the top of the body. For syntax errors, Luau’s messages name the line and the reason exactly. The following example shows the correct order in a `while`:'),
      CODE('while-continue', 'luau', 'luau', ['continue dalam while dengan selamat', 'continue in a while safely'], `
local messages = {"hi", "", "gg", "  ", "wp"}
local i = 0
local shown = {}
while i < #messages do
  i += 1
  local text = messages[i]:match("^%s*(.-)%s*$")
  if text == "" then continue end
  table.insert(shown, text)
end
print(table.concat(shown, " | "))
`, 'hi | gg | wp'),
      EXPLAIN('while-continue',
        ['1–3', 'Mesej chat, termasuk yang kosong.', 'Chat messages, including empty ones.'],
        ['4–9', '`i += 1` **sebelum** `continue`: setiap pusingan maju, walaupun dilangkau. Mesej dipangkas dan yang kosong dilangkau.', '`i += 1` **before** `continue`: every pass advances, even when skipped. Messages are trimmed and empty ones skipped.'],
        ['10', 'Hanya mesej sebenar.', 'Only real messages.'])),
    S('performance',
      P('`break` menjimatkan kerja: carian yang berhenti pada padanan pertama melawati purata separuh senarai. `continue` sebagai pengawal awal juga menjimatkan kerja apabila kebanyakan item ditolak. Kedua-duanya ialah satu arahan lompatan — tiada kos tambahan.', '`break` saves work: a search that stops at the first match visits half the list on average. `continue` as an early guard also saves work when most items are rejected. Both are a single jump instruction — no extra cost.')),
    S('software_engineering',
      P('Bendera boolean untuk menamatkan gelung berbanding `break`:', 'A boolean flag to end a loop versus `break`:'),
      CODE('poor-found-flag', 'luau', 'luau', ['Pelaksanaan lemah: bendera dan gelung penuh', 'Poor implementation: a flag and a full loop'], `
local players = {"Aina", "Ben", "Chen", "Dewi"}
local found = false
local position = nil
for i, name in players do
  if not found and name == "Ben" then
    found = true
    position = i
  end
end
print(found, position)
`, 'true\t2'),
      EXPLAIN('poor-found-flag',
        ['1–9', 'Dua pemboleh ubah keadaan, dan gelung terus melawati Chen dan Dewi selepas Ben dijumpai.', 'Two state variables, and the loop keeps visiting Chen and Dewi after Ben is found.'],
        ['10', 'Hasil betul, kerja berlebihan.', 'A correct result, extra work.']),
      CODE('improved-table-find', 'luau', 'luau', ['Pelaksanaan lebih baik: break atau table.find', 'Improved implementation: break or table.find'], `
local players = {"Aina", "Ben", "Chen", "Dewi"}
local position
for i, name in players do
  if name == "Ben" then
    position = i
    break
  end
end
print(position, table.find(players, "Ben"))
`, '2\t2'),
      EXPLAIN('improved-table-find',
        ['1–8', '`break` berhenti serta-merta selepas padanan.', '`break` stops immediately after the match.'],
        ['9', '`table.find` (Luau) melakukan carian yang sama dalam satu panggilan.', '`table.find` (Luau) does the same search in one call.'])),
    S('industry_use_cases',
      UL(
        ['Penapis sasaran AI menggunakan `continue` untuk melangkau sasaran mati, sekutu atau di luar pandangan.', 'AI target filters use `continue` to skip dead, allied or out-of-sight targets.'],
        ['Carian laluan dan grid menggunakan `return` dalam fungsi untuk keluar daripada gelung bersarang.', 'Pathfinding and grid searches use `return` inside functions to leave nested loops.'],
        ['Pemproses mesej chat melangkau mesej kosong atau ditapis dengan `continue`.', 'Chat processors skip empty or filtered messages with `continue`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Ubah `break-continue` supaya ia mencari musuh hidup **terdekat** (tanpa `break`).', 'Change `break-continue` to find the **nearest** living enemy (without `break`).'],
        ['Dalam `while-continue`, pindahkan `i += 1` ke bawah `continue` dalam fikiran anda — apakah yang akan berlaku?', 'In `while-continue`, imagine moving `i += 1` below the `continue` — what would happen?'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Pemproses gelombang musuh.** Proses senarai gelombang; dalam setiap gelombang, langkau musuh yang dilumpuhkan, berhenti memproses gelombang jika bos muncul, dan berhenti sepenuhnya jika pemain tewas.', '**An enemy wave processor.** Process a list of waves; within each wave, skip disabled enemies, stop processing the wave if a boss appears, and stop entirely if the player is defeated.'),
      CODE('wave-processor', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local waves = {
  {{kind = "grunt", damage = 10}, {kind = "grunt", damage = 10, disabled = true}, {kind = "archer", damage = 15}},
  {{kind = "grunt", damage = 10}, {kind = "boss", damage = 60}, {kind = "grunt", damage = 10}},
  {{kind = "archer", damage = 15}},
}

local function runWaves(health: number)
  for w, wave in waves do
    for _, enemy in wave do
      if enemy.disabled then continue end
      health -= enemy.damage
      print(\`wave {w}: {enemy.kind} hits, health {health}\`)
      if health <= 0 then return \`defeated in wave {w}\` end
      if enemy.kind == "boss" then break end
    end
  end
  return \`survived with {health} health\`
end

print(runWaves(100))
`, 'wave 1: grunt hits, health 90\nwave 1: archer hits, health 75\nwave 2: grunt hits, health 65\nwave 2: boss hits, health 5\nwave 3: archer hits, health -10\ndefeated in wave 3'),
      EXPLAIN('wave-processor',
        ['1–5', 'Tiga gelombang; satu musuh dilumpuhkan; bos dalam gelombang 2.', 'Three waves; one enemy disabled; a boss in wave 2.'],
        ['7–10', '`continue` melangkau musuh yang dilumpuhkan.', '`continue` skips disabled enemies.'],
        ['11–14', 'Kerosakan; `return` keluar daripada **kedua-dua** gelung apabila pemain tewas; `break` hanya menamatkan gelombang semasa selepas bos.', 'Damage; `return` leaves **both** loops when the player is defeated; `break` only ends the current wave after a boss.'],
        ['17–20', 'Gelombang 3 masih berjalan selepas `break` dalam gelombang 2, dan pemain tewas di situ.', 'Wave 3 still runs after the `break` in wave 2, and the player is defeated there.'])),
    S('summary',
      UL(
        ['`break` keluar daripada gelung terdalam; `continue` melangkau ke pusingan seterusnya (Luau).', '`break` leaves the innermost loop; `continue` skips to the next pass (Luau).'],
        ['Kedua-duanya mesti terakhir dalam blok dan di dalam gelung.', 'Both must be last in their block and inside a loop.'],
        ['Dalam `repeat … until`, isytiharkan local syarat sebelum `continue`.', 'In `repeat … until`, declare the condition’s locals before `continue`.'],
        ['`return` dalam fungsi untuk keluar daripada gelung bersarang.', '`return` inside a function to leave nested loops.'],
      )),
    S('knowledge_check',
      OL(
        ['Dalam gelung bersarang, gelung mana yang ditinggalkan oleh `break`?', 'In nested loops, which loop does `break` leave?'],
        ['Mengapakah `continue` tidak boleh diikuti oleh `print` dalam blok yang sama?', 'Why can `continue` not be followed by `print` in the same block?'],
        ['Apakah mesej Luau apabila `continue` melompat melepasi local yang digunakan oleh `until`?', 'What is Luau’s message when `continue` jumps past a local used by `until`?'],
        ['Mengapakah `i += 1` mesti sebelum `continue` dalam `while`?', 'Why must `i += 1` come before `continue` in a `while`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax: continue statement', url: `${LUAU}/syntax#continue-statement` },
        { title: 'Luau RFC — continue statement', url: 'https://github.com/luau-lang/rfcs/blob/master/docs/syntax-continue-statement.md' },
        { title: 'Roblox Creator Hub — Control structures (break and continue)', url: `${DOCS}/luau/control-structures` },
        { title: 'Luau — Library (table.find)', url: `${LUAU}/library#table-library` },
      )),
  ],
};

export const LUAU103_M2 = [LUAU103_2_1, LUAU103_2_2, LUAU103_2_3];
