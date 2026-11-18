import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU101 · Module 4 — Errors.
 * `luau` examples are executed with the official Luau VM (npm run verify:code); `roblox` examples are compiled only.
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 4.1 Syntax errors and runtime errors ──────────────────────────────────

export const LUAU101_4_1: LectureContentDef = {
  courseCode: 'LUAU101',
  module: 4,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Membezakan [[syntax-error|ralat sintaks]] dan [[runtime-error|ralat runtime]].', 'Distinguish [[syntax-error|syntax errors]] and [[runtime-error|runtime errors]].'],
        ['Membaca struktur mesej ralat Luau: lokasi, operasi, jenis.', 'Read the structure of Luau error messages: location, operation, types.'],
        ['Mengenal pasti mesej runtime yang paling biasa dan punca biasanya.', 'Recognise the most common runtime messages and their usual causes.'],
        ['Menaikkan ralat sendiri dengan `error` dan menangkapnya dengan `pcall`.', 'Raise your own errors with `error` and catch them with `pcall`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 3: program pertama dan Script Analysis.', 'Module 3: first programs and Script Analysis.'],
      )),
    S('introduction',
      P('Setiap pengaturcara melihat ralat setiap hari — ia bukan tanda kegagalan, tetapi maklumat. Luau mempunyai dua keluarga ralat yang berlaku pada masa berbeza. **Ralat sintaks** dikesan semasa kod dihurai, sebelum apa-apa dijalankan: Luau tidak memahami tatabahasa anda. **Ralat runtime** berlaku semasa program berjalan: tatabahasa betul, tetapi satu operasi tidak boleh dilakukan dengan nilai yang ada. Mengenali keluarga ralat dengan serta-merta memberitahu anda di mana untuk mencari punca.',
        'Every programmer sees errors every day — they are not a sign of failure but information. Luau has two families of errors that happen at different times. **Syntax errors** are detected while the code is parsed, before anything runs: Luau does not understand your grammar. **Runtime errors** happen while the program runs: the grammar is fine, but an operation cannot be performed with the values at hand. Recognising the family immediately tells you where to look for the cause.'),
      KEY('Ralat sintaks: tiada output langsung. Ralat runtime: output sebelum ralat muncul, kemudian program berhenti.', 'Syntax error: no output at all. Runtime error: output before the error appears, then the program stops.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Bentuk mesej:** `example:3: …` — nama skrip, baris, dan penerangan. Dalam Studio: `ServerScriptService.Main:3: …`.', '**Message shape:** `example:3: …` — script name, line, and description. In Studio: `ServerScriptService.Main:3: …`.'],
        ['**Sintaks:** `Expected \'X\' …, got \'Y\'` — apa yang dijangka dan apa yang ditemui.', '**Syntax:** `Expected \'X\' …, got \'Y\'` — what was expected and what was found.'],
        ['**Runtime:** `attempt to <operasi> …` dengan jenis yang terlibat, contohnya `attempt to index nil with \'Name\'`.', '**Runtime:** `attempt to <operation> …` with the types involved, for example `attempt to index nil with \'Name\'`.'],
        ['**Ralat sendiri:** `error("mesej")` menghentikan pelaksanaan dengan mesej anda.', '**Your own errors:** `error("message")` stops execution with your message.'],
        ['**Menangkap:** `pcall(f, …)` menjalankan `f` dan memulangkan `false, mesej` dan bukannya menghentikan program.', '**Catching:** `pcall(f, …)` runs `f` and returns `false, message` instead of stopping the program.'],
      )),
    S('detailed_theory',
      P('Mesej runtime Luau direka untuk menjawab dua soalan: operasi apa yang gagal, dan dengan jenis apa. `attempt to index nil with \'Name\'` bermaksud kod cuba membaca medan `Name` daripada sesuatu yang `nil` — punca biasa: objek tidak dijumpai, pemboleh ubah tersalah eja, atau fungsi memulangkan `nil`. `attempt to call a nil value` bermaksud sesuatu yang bukan fungsi dipanggil — biasanya nama fungsi tersalah eja. `attempt to perform arithmetic (add) on number and nil` menyebut operasi dan **kedua-dua** operand, jadi anda tahu yang mana satu salah. `attempt to compare number < string` menunjukkan perbandingan jenis bercampur, yang Luau tidak benarkan.',
        'Luau runtime messages are designed to answer two questions: which operation failed, and with what types. `attempt to index nil with \'Name\'` means the code tried to read the field `Name` from something that is `nil` — common causes: an object not found, a misspelled variable, or a function that returned `nil`. `attempt to call a nil value` means something that is not a function was called — usually a misspelled function name. `attempt to perform arithmetic (add) on number and nil` names the operation and **both** operands, so you know which one is wrong. `attempt to compare number < string` shows a mixed-type comparison, which Luau does not allow.'),
      P('Ralat sintaks pula datang daripada penghurai. Kerana penghurai membaca dari kiri ke kanan, ia melaporkan baris tempat ia **menyedari** masalah — yang sering selepas kesilapan sebenar. Mesej seperti `Expected \'then\' when parsing if statement, got \'print\'` pada baris 3 bermaksud `then` hilang di hujung baris 2. Akhir sekali, `error` dan `pcall` membolehkan anda menggunakan mekanisme yang sama untuk kod anda sendiri: naikkan ralat apabila keadaan tidak sah, dan tangkap ralat di sempadan di mana program boleh pulih — contohnya satu permintaan pemain yang gagal tidak sepatutnya menghentikan seluruh pelayan.',
        'Syntax errors come from the parser. Because the parser reads left to right, it reports the line where it **noticed** the problem — often after the real mistake. A message such as `Expected \'then\' when parsing if statement, got \'print\'` on line 3 means `then` is missing at the end of line 2. Finally, `error` and `pcall` let you use the same mechanism for your own code: raise an error when a state is invalid, and catch errors at a boundary where the program can recover — for example one failed player request should not stop the whole server.')),
    S('technical_terminology', TERMS('syntax-error', 'runtime-error', 'stack-traceback', 'nil')),
    S('syntax_rules',
      UL(
        ['`error(mesej)` — naikkan ralat dengan kedudukan; `error(mesej, 0)` — tanpa kedudukan; `error(mesej, 2)` — kedudukan pemanggil.', '`error(message)` — raise an error with a position; `error(message, 0)` — without a position; `error(message, 2)` — the caller’s position.'],
        ['`local ok, result = pcall(fungsi, arg1, arg2)` — `ok` ialah `true` atau `false`.', '`local ok, result = pcall(function, arg1, arg2)` — `ok` is `true` or `false`.'],
        ['`assert(syarat, mesej)` — naikkan ralat jika syarat palsu.', '`assert(condition, message)` — raise an error if the condition is falsy.'],
      )),
    S('code_demonstration',
      CODE('runtime-catalogue', 'luau', 'luau', ['Katalog ralat runtime (ditangkap dengan pcall)', 'A catalogue of runtime errors (caught with pcall)'], `
local cases = {
  function() local player = nil; return player.Name end,
  function() local spawnPlayer = nil; spawnPlayer() end,
  function() local coins = nil; return coins + 10 end,
  function() return 5 < "6" end,
  function() return #nil end,
}

for i, fn in cases do
  local ok, message = pcall(fn)
  print(i, ok, message)
end
`, "1\tfalse\texample:2: attempt to index nil with 'Name'\n2\tfalse\texample:3: attempt to call a nil value\n3\tfalse\texample:4: attempt to perform arithmetic (add) on nil and number\n4\tfalse\texample:5: attempt to compare number < string\n5\tfalse\texample:6: attempt to get length of a nil value"),
      EXPLAIN('runtime-catalogue',
        ['1–7', 'Lima fungsi kecil, setiap satu dengan ralat runtime yang biasa: indeks, panggilan, aritmetik, perbandingan dan panjang.', 'Five small functions, each with a common runtime error: index, call, arithmetic, comparison and length.'],
        ['9–12', '`pcall` menjalankan setiap satu dan menangkap ralatnya, jadi program tidak berhenti dan kita boleh melihat kelima-lima mesej.', '`pcall` runs each one and catches its error, so the program does not stop and we can see all five messages.'])),
    S('complete_examples',
      CODE('syntax-vs-runtime', 'luau', 'luau', ['Output sebelum ralat runtime', 'Output before a runtime error'], `
print("step 1: loading")
local config = {maxPlayers = 8}
print("step 2: config ready")
local ok, message = pcall(function()
  return config.rounds.length
end)
print("step 3:", ok, message)
print("step 4: still running")
`, "step 1: loading\nstep 2: config ready\nstep 3:\tfalse\texample:5: attempt to index nil with 'length'\nstep 4: still running", {
        debug: BUG(`
print("step 1: loading")
local config = {maxPlayers = 8}
if config.maxPlayers > 4
  print("big server")
end
`, "example:4: Expected 'then' when parsing if statement, got 'print'",
          'Ralat **sintaks**: `then` hilang di hujung baris 3. Perhatikan bahawa walaupun baris 1 ialah `print` yang sah, **tiada apa-apa dicetak** — keseluruhan fail mesti dihurai sebelum baris pertama dijalankan. Luau melaporkan baris 4 kerana di situlah ia menemui `print` di tempat `then`. Tambah `then` pada baris 3.',
          'A **syntax** error: `then` is missing at the end of line 3. Note that although line 1 is a valid `print`, **nothing is printed** — the whole file must parse before the first line runs. Luau reports line 4 because that is where it found `print` instead of `then`. Add `then` to line 3.'),
      }),
      EXPLAIN('syntax-vs-runtime',
        ['1–3', 'Dua langkah pertama berjaya dan mencetak.', 'The first two steps succeed and print.'],
        ['4–6', '`config.rounds` ialah `nil`, jadi `.length` gagal — ralat runtime, ditangkap oleh `pcall`.', '`config.rounds` is `nil`, so `.length` fails — a runtime error, caught by `pcall`.'],
        ['7–8', 'Program diteruskan; tanpa `pcall`, ia akan berhenti selepas "step 2".', 'The program continues; without `pcall` it would stop after "step 2".']),
      CODE('raise-own-error', 'luau', 'luau', ['Menaikkan ralat sendiri', 'Raising your own errors'], `
local function setTeamSize(size: number)
  if size < 1 or size > 10 then
    error(\`team size must be 1-10, got {size}\`)
  end
  return size
end

print(setTeamSize(4))
local ok, message = pcall(setTeamSize, 25)
print(ok, message)
`, '4\nfalse\texample:3: team size must be 1-10, got 25', {
        debug: BUG(`
local function setTeamSize(size: number)
  if size < 1 or size > 10 then
    error(\`team size must be 1-10, got {size}\`)
  end
  return size
end
setTeamSize("4")
`, 'example:2: attempt to compare string < number',
          'String "4" dihantar dan bukannya nombor. Perbandingan `size < 1` gagal **sebelum** semakan julat sempat menaikkan mesej yang mesra — Luau tidak menukar string kepada nombor untuk perbandingan. Penganalisis dengan anotasi `size: number` akan menandakan panggilan ini dalam Studio (diterangkan). Tambah semakan `typeof(size) ~= "number"` dahulu, atau tukar dengan `tonumber`.',
          'The string "4" is passed instead of a number. The comparison `size < 1` fails **before** the range check can raise its friendly message — Luau does not convert strings to numbers for comparisons. The analyser, with the `size: number` annotation, would flag this call in Studio (described). Add a `typeof(size) ~= "number"` check first, or convert with `tonumber`.'),
      }),
      EXPLAIN('raise-own-error',
        ['1–6', 'Fungsi mengesahkan inputnya dan menaikkan ralat yang menerangkan peraturan dan nilai yang diterima.', 'The function validates its input and raises an error explaining the rule and the received value.'],
        ['8', 'Nilai sah dipulangkan.', 'A valid value is returned.'],
        ['9–10', 'Nilai tidak sah: `pcall` memulangkan `false` dan mesej anda, dengan kedudukan baris `error`.', 'An invalid value: `pcall` returns `false` and your message, with the position of the `error` line.'])),
    S('line_by_line',
      EXPLAIN('runtime-catalogue',
        ['10', '`pcall(fn)` memulangkan `true` + hasil jika `fn` berjaya, atau `false` + mesej ralat jika gagal. Ia tidak pernah membiarkan ralat naik lebih tinggi.', '`pcall(fn)` returns `true` + results if `fn` succeeds, or `false` + the error message if it fails. It never lets the error climb higher.']),
      EXPLAIN('raise-own-error',
        ['3', 'Interpolasi menjadikan mesej spesifik: nilai sebenar (25) memudahkan penyahpepijatan.', 'Interpolation makes the message specific: the actual value (25) makes debugging easier.'])),
    S('why_this_way',
      P('Mengapa dua jenis ralat? Kerana ia berlaku pada masa berbeza dan memerlukan tindakan berbeza. Ralat sintaks mesti dibaiki sebelum apa-apa boleh berjalan — Studio menunjukkannya serta-merta. Ralat runtime bergantung pada data: kod yang sama mungkin berjaya untuk satu pemain dan gagal untuk yang lain. Mengapa `pcall`? Kerana dalam pelayan Roblox, satu ralat tidak sepatutnya merosakkan pengalaman semua pemain.',
        'Why two kinds of errors? Because they happen at different times and need different actions. Syntax errors must be fixed before anything can run — Studio shows them immediately. Runtime errors depend on data: the same code may succeed for one player and fail for another. Why `pcall`? Because on a Roblox server, one error should not ruin the experience of every player.'),
      P('Gunakan `error` **apabila** keadaan tidak sah ialah kesilapan pengaturcara; gunakan `pcall` **apabila** anda memanggil sesuatu yang boleh gagal dan program boleh pulih (contohnya permintaan rangkaian atau DataStore dalam LUAU kemudian).', 'Use `error` **when** an invalid state is a programmer mistake; use `pcall` **when** you call something that can fail and the program can recover (for example network or DataStore requests later in LUAU).')),
    S('execution_flow',
      OL(
        ['Penghurai membaca seluruh fail. Ralat sintaks → mesej dan berhenti; tiada output.', 'The parser reads the whole file. Syntax error → message and stop; no output.'],
        ['Jika sintaks betul, VM menjalankan dari baris 1.', 'If the syntax is fine, the VM runs from line 1.'],
        ['Ralat runtime tanpa `pcall` → mesej dan traceback; baris seterusnya tidak dijalankan.', 'A runtime error without `pcall` → message and traceback; the following lines do not run.'],
        ['Ralat runtime di dalam `pcall` → `pcall` memulangkan `false, mesej`; program diteruskan.', 'A runtime error inside `pcall` → `pcall` returns `false, message`; the program continues.'],
      )),
    S('memory_behaviour',
      P('Apabila ralat berlaku, Luau membuka timbunan panggilan sehingga `pcall` terdekat (atau puncak program), membuang bingkai fungsi yang sedang berjalan. Objek yang hanya dirujuk oleh bingkai itu menjadi sampah dan dikutip kemudian. Mesej ralat ialah string biasa yang dicipta pada masa ralat.',
        'When an error happens, Luau unwinds the call stack up to the nearest `pcall` (or the top of the program), discarding the frames of the functions that were running. Objects referenced only by those frames become garbage and are collected later. The error message is an ordinary string created at the time of the error.')),
    S('alternative_implementations',
      P('Untuk kegagalan yang dijangka (input pemain yang salah), corak `nil, mesej` sering lebih baik daripada `error` + `pcall` — ia tidak memerlukan penangkapan:', 'For expected failures (wrong player input), the `nil, message` pattern is often better than `error` + `pcall` — it needs no catching:'),
      CODE('nil-message-alt', 'luau', 'luau', ['Corak nil, mesej', 'The nil, message pattern'], `
local function parseTeamSize(text: string)
  local size = tonumber(text)
  if size == nil then
    return nil, \`"{text}" is not a number\`
  end
  if size < 1 or size > 10 then
    return nil, \`team size must be 1-10, got {size}\`
  end
  return size
end

print(parseTeamSize("4"))
print(parseTeamSize("many"))
print(parseTeamSize("25"))
`, '4\nnil\t"many" is not a number\nnil\tteam size must be 1-10, got 25'),
      EXPLAIN('nil-message-alt',
        ['1–5', 'Tukar dan semak jenis dahulu — mengelak ralat perbandingan string/nombor.', 'Convert and check the type first — avoiding the string/number comparison error.'],
        ['6–9', 'Kemudian semak julat; setiap kegagalan memulangkan `nil` dan sebab.', 'Then check the range; each failure returns `nil` and a reason.'],
        ['12–14', 'Pemanggil memeriksa nilai pertama; tiada `pcall` diperlukan.', 'The caller checks the first value; no `pcall` is needed.'])),
    S('common_mistakes',
      UL(
        ['Membaca hanya perkataan "error" dan bukannya keseluruhan mesej.', 'Reading only the word "error" instead of the whole message.'],
        ['Mencari kesilapan sintaks hanya pada baris yang dilaporkan — ia sering pada baris sebelumnya.', 'Looking for a syntax mistake only on the reported line — it is often on the line before.'],
        ['Membalut segala-galanya dalam `pcall` dan mengabaikan `false` yang dipulangkan.', 'Wrapping everything in `pcall` and ignoring the returned `false`.'],
        ['Mesej `error` yang samar seperti "bad" tanpa nilai atau konteks.', 'Vague `error` messages such as "bad" without values or context.'],
      )),
    S('debugging',
      P('Prosedur untuk setiap ralat: (1) tentukan keluarga — adakah apa-apa dicetak sebelum ralat? (2) baca lokasi — fail dan baris; (3) baca operasi dan jenis; (4) tanya "nilai mana yang tidak seperti yang saya jangka?" dan cetak ia sebelum baris itu. Untuk ralat sintaks, lihat juga baris sebelum yang dilaporkan. Contoh berikut mencari nilai `nil` dalam rantaian medan secara sistematik:',
        'A procedure for every error: (1) decide the family — was anything printed before the error? (2) read the location — file and line; (3) read the operation and types; (4) ask "which value is not what I expected?" and print it before that line. For syntax errors, also look at the line before the reported one. The following example finds the `nil` in a chain of fields systematically:'),
      CODE('find-nil-link', 'luau', 'luau', ['Mencari pautan nil dalam rantaian', 'Finding the nil link in a chain'], `
local game_ = {Teams = {Red = {Captain = nil, Score = 3}}}

local function walk(root, path: {string})
  local node = root
  for i, key in path do
    node = node[key]
    print(i, key, typeof(node))
    if node == nil then return end
  end
end

walk(game_, {"Teams", "Red", "Captain", "Name"})
`, '1\tTeams\ttable\n2\tRed\ttable\n3\tCaptain\tnil'),
      EXPLAIN('find-nil-link',
        ['1', 'Data bersarang di mana `Captain` belum ditetapkan.', 'Nested data in which `Captain` has not been set.'],
        ['3–10', 'Turun satu kunci pada satu masa dan cetak jenis setiap langkah; berhenti pada `nil` pertama.', 'Go down one key at a time and print the type at each step; stop at the first `nil`.'],
        ['12', 'Output menunjukkan dengan tepat bahawa `Captain` ialah pautan yang hilang — `captain.Name` akan gagal dengan `attempt to index nil with \'Name\'`.', 'The output shows exactly that `Captain` is the missing link — `captain.Name` would fail with `attempt to index nil with \'Name\'`.'])),
    S('performance',
      P('`pcall` mempunyai kos kecil setiap kali dipanggil, dan ralat yang dinaikkan lebih mahal (ia membina mesej dan membuka timbunan). Jangan gunakan ralat untuk aliran kawalan biasa dalam gelung panas; gunakan semakan `if` atau corak `nil, mesej`, dan simpan `error` untuk keadaan yang benar-benar luar biasa.',
        '`pcall` has a small cost per call, and a raised error is more expensive (it builds a message and unwinds the stack). Do not use errors for ordinary control flow in hot loops; use `if` checks or the `nil, message` pattern, and keep `error` for truly exceptional states.')),
    S('software_engineering',
      P('Ralat senyap berbanding ralat yang jelas:', 'Silent failure versus a clear error:'),
      CODE('poor-silent-failure', 'luau', 'luau', ['Pelaksanaan lemah: kegagalan senyap', 'Poor implementation: silent failure'], `
local function grantCoins(balance, amount)
  if type(amount) ~= "number" then
    return balance
  end
  return balance + amount
end

print(grantCoins(100, "50"))
`, '100'),
      EXPLAIN('poor-silent-failure',
        ['1–6', 'Input yang salah diabaikan secara senyap — pemain tidak menerima syiling, dan tiada siapa tahu mengapa.', 'Wrong input is silently ignored — the player receives no coins, and nobody knows why.'],
        ['8', 'Output kelihatan normal; pepijat tersembunyi.', 'The output looks normal; the bug is hidden.']),
      CODE('improved-loud-failure', 'luau', 'luau', ['Pelaksanaan lebih baik: ralat yang jelas', 'Improved implementation: a clear error'], `
local function grantCoins(balance: number, amount: number): number
  if typeof(amount) ~= "number" then
    error(\`grantCoins: amount must be a number, got {typeof(amount)} ({amount})\`, 2)
  end
  return balance + amount
end

print(grantCoins(100, 50))
print(pcall(grantCoins, 100, "50"))
`, '150\nfalse\tgrantCoins: amount must be a number, got string (50)'),
      EXPLAIN('improved-loud-failure',
        ['1–6', 'Input yang salah menaikkan ralat yang menyebut fungsi, jangkaan, jenis dan nilai.', 'Wrong input raises an error naming the function, the expectation, the type and the value.'],
        ['8–9', 'Panggilan yang betul berjaya; yang salah ditangkap di sini, tetapi dalam permainan sebenar ia akan muncul merah dalam Output — dan dibaiki.', 'The correct call succeeds; the wrong one is caught here, but in a real game it would appear red in the Output — and get fixed.'])),
    S('industry_use_cases',
      UL(
        ['Pelayan Roblox membalut pengendali permintaan dalam `pcall` supaya satu ralat tidak menjejaskan pemain lain.', 'Roblox servers wrap request handlers in `pcall` so one error does not affect other players.'],
        ['Panggilan DataStore dan HTTP sentiasa dibalut dengan `pcall` kerana ia boleh gagal atas sebab rangkaian.', 'DataStore and HTTP calls are always wrapped in `pcall` because they can fail for network reasons.'],
        ['Mesej ralat yang spesifik dikumpul oleh alat analitik ralat dalam permainan yang diterbitkan.', 'Specific error messages are collected by error-analytics tools in published games.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah kes keenam pada `runtime-catalogue`: memanggil table (`({})()`). Ramalkan mesejnya.', 'Add a sixth case to `runtime-catalogue`: calling a table (`({})()`). Predict its message.'],
        ['Buang `pcall` dalam `syntax-vs-runtime` dan perhatikan baris mana yang tidak lagi dicetak.', 'Remove the `pcall` in `syntax-vs-runtime` and see which lines no longer print.'],
        ['Jalankan kedua-dua versi berpepijat dan kelaskan setiap satu: sintaks atau runtime?', 'Run both buggy versions and classify each: syntax or runtime?'],
      )),
    S('mini_project',
      P('**Pemproses arahan yang tahan ralat.** Proses senarai arahan pemain; setiap arahan yang gagal dilaporkan, tetapi tidak menghentikan arahan lain.', '**An error-tolerant command processor.** Process a list of player commands; each failing command is reported, but does not stop the others.'),
      CODE('command-processor', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local balance = 100
local handlers = {
  add = function(n) balance += n end,
  spend = function(n)
    if n > balance then error(\`cannot spend {n}, balance is {balance}\`, 0) end
    balance -= n
  end,
}

local commands = {{"add", 50}, {"spend", 500}, {"fly", 1}, {"spend", 30}}
for _, cmd in commands do
  local name, value = cmd[1], cmd[2]
  local handler = handlers[name]
  if handler == nil then
    print(\`skip: unknown command {name}\`)
    continue
  end
  local ok, message = pcall(handler, value)
  print(\`{name} {value}: {if ok then "ok" else message}\`)
end
print("final balance", balance)
`, 'add 50: ok\nspend 500: cannot spend 500, balance is 150\nskip: unknown command fly\nspend 30: ok\nfinal balance\t120'),
      EXPLAIN('command-processor',
        ['1–8', 'Keadaan dan pengendali arahan; `error(…, 0)` memberi mesej tanpa kedudukan, sesuai untuk dipaparkan kepada pemain.', 'State and command handlers; `error(…, 0)` gives a message without a position, suitable for showing to a player.'],
        ['10–17', 'Untuk setiap arahan: cari pengendali; arahan yang tidak diketahui dilangkau dengan `continue`.', 'For each command: find the handler; unknown commands are skipped with `continue`.'],
        ['18–19', '`pcall` mengasingkan kegagalan; if-expression memilih "ok" atau mesej.', '`pcall` isolates failures; an if-expression chooses "ok" or the message.'],
        ['21', '100 + 50 − 30 = 120: perbelanjaan 500 yang gagal tidak mengubah baki.', '100 + 50 − 30 = 120: the failed 500 spend did not change the balance.'])),
    S('summary',
      UL(
        ['Ralat sintaks: semasa menghurai, tiada output. Ralat runtime: semasa berjalan, selepas output separa.', 'Syntax errors: while parsing, no output. Runtime errors: while running, after partial output.'],
        ['Mesej Luau menyebut lokasi, operasi dan jenis — baca semuanya.', 'Luau messages name the location, the operation and the types — read all of it.'],
        ['`error` menaikkan; `pcall` menangkap; `assert` menyemak.', '`error` raises; `pcall` catches; `assert` checks.'],
        ['Untuk kegagalan yang dijangka, `nil, mesej` selalunya lebih baik.', 'For expected failures, `nil, message` is often better.'],
      )),
    S('knowledge_check',
      OL(
        ['Program dengan ralat sintaks pada baris 50 — adakah baris 1 dijalankan?', 'A program with a syntax error on line 50 — does line 1 run?'],
        ['Apakah maksud `attempt to call a nil value`?', 'What does `attempt to call a nil value` mean?'],
        ['Apakah yang dipulangkan oleh `pcall` apabila fungsi berjaya?', 'What does `pcall` return when the function succeeds?'],
        ['Mengapakah `setTeamSize("4")` gagal sebelum mesej mesra dinaikkan?', 'Why does `setTeamSize("4")` fail before the friendly message is raised?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library (error, pcall, assert)', url: `${LUAU}/library` },
        { title: 'Roblox Creator Hub — Debugging', url: `${DOCS}/studio/debugging` },
        { title: 'Roblox globals — error and pcall', url: `${DOCS}/reference/engine/globals/LuaGlobals#pcall` },
        { title: 'Luau — Syntax', url: `${LUAU}/syntax` },
      )),
  ],
};

// ─── 4.2 Reading stack traces ──────────────────────────────────────────────

export const LUAU101_4_2: LectureContentDef = {
  courseCode: 'LUAU101',
  module: 4,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Membaca [[stack-traceback|stack traceback]] Luau dari atas ke bawah.', 'Read a Luau [[stack-traceback|stack traceback]] from top to bottom.'],
        ['Membezakan baris tempat ralat **berlaku** dan baris tempat punca **bermula**.', 'Distinguish the line where an error **happens** from the line where the cause **started**.'],
        ['Menghasilkan traceback dengan `debug.traceback` dan `xpcall`.', 'Produce a traceback with `debug.traceback` and `xpcall`.'],
        ['Menggunakan `error(mesej, 2)` supaya ralat menunjuk ke pemanggil.', 'Use `error(message, 2)` so an error points at the caller.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1: ralat runtime dan `pcall`.', 'Lecture 4.1: runtime errors and `pcall`.'],
        ['Fungsi yang memanggil fungsi lain (LUAU103 mengajar fungsi dengan mendalam).', 'Functions that call other functions (LUAU103 teaches functions in depth).'],
      )),
    S('introduction',
      P('Mesej ralat memberitahu **di mana** program gagal; stack traceback memberitahu **bagaimana** ia sampai ke sana. Apabila fungsi `outer` memanggil `middle` yang memanggil `inner`, dan `inner` gagal, traceback menyenaraikan ketiga-tiga panggilan bersama baris masing-masing. Ini penting kerana punca pepijat sering berada dalam fungsi yang memanggil — contohnya `outer` menghantar `nil` — sedangkan ralat hanya meletup dalam `inner`. Kuliah ini mengajar cara membaca traceback dalam luau CLI dan dalam Output Studio.',
        'An error message tells you **where** the program failed; a stack traceback tells you **how** it got there. When `outer` calls `middle`, which calls `inner`, and `inner` fails, the traceback lists all three calls with their lines. This matters because the cause of a bug is often in a calling function — for example `outer` passes `nil` — while the error only explodes in `inner`. This lecture teaches how to read tracebacks in the luau CLI and in Studio’s Output.'),
      KEY('Baris atas traceback = tempat ralat berlaku. Baris di bawahnya = siapa yang memanggil, sehingga ke puncak program.', 'Top line of a traceback = where the error happened. Lines below = who called, up to the top of the program.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**[[call-stack|Timbunan panggilan]]:** senarai fungsi yang sedang berjalan, setiap satu menunggu yang di atasnya.', '**[[call-stack|Call stack]]:** the list of functions currently running, each waiting for the one above it.'],
        ['**Traceback Luau:** `example:2 function inner`, `example:5 function middle`, … — baris dan nama fungsi.', '**Luau traceback:** `example:2 function inner`, `example:5 function middle`, … — line and function name.'],
        ['**Format Studio:** `Script \'ServerScriptService.Main\', Line 2 - function inner` — maklumat yang sama, susunan yang sama.', '**Studio format:** `Script \'ServerScriptService.Main\', Line 2 - function inner` — the same information, the same order.'],
        ['**`debug.traceback(mesej, tahap)`:** membina traceback sebagai string pada bila-bila masa.', '**`debug.traceback(message, level)`:** builds a traceback as a string at any moment.'],
        ['**`xpcall(f, pengendali)`:** seperti `pcall`, tetapi memanggil pengendali **sebelum** timbunan dibuka — tempat yang betul untuk merekod traceback.', '**`xpcall(f, handler)`:** like `pcall`, but calls the handler **before** the stack unwinds — the right place to record a traceback.'],
      )),
    S('detailed_theory',
      P('Setiap panggilan fungsi menolak bingkai baharu ke atas timbunan panggilan; setiap `return` mengeluarkannya. Apabila ralat berlaku, timbunan masih mengandungi setiap fungsi yang sedang menunggu. Traceback ialah gambar timbunan itu pada saat ralat, dicetak dari yang terbaharu (atas) ke yang tertua (bawah). Baris atas memberitahu operasi yang gagal; baris di bawahnya menunjukkan rantaian keputusan yang membawa ke sana. Untuk mencari punca, baca dari atas ke bawah dan tanya pada setiap tahap: "adakah fungsi ini menghantar nilai yang betul kepada yang di atasnya?"',
        'Every function call pushes a new frame onto the call stack; every `return` pops it. When an error happens, the stack still contains every function that is waiting. A traceback is a picture of that stack at the moment of the error, printed from the newest (top) to the oldest (bottom). The top line tells you the operation that failed; the lines below show the chain of decisions that led there. To find the cause, read from top to bottom and ask at each level: "did this function pass the right value to the one above it?"'),
      P('`pcall` menangkap ralat **selepas** timbunan dibuka, jadi pada masa anda melihat mesej, traceback sudah hilang. `xpcall(f, pengendali)` menyelesaikan masalah ini: pengendali dipanggil di tempat ralat, dengan timbunan masih utuh, dan boleh memanggil `debug.traceback` untuk merekodnya. Dalam Roblox, Output Studio mencetak traceback secara automatik untuk ralat yang tidak ditangkap, dan setiap baris boleh diklik. Untuk ralat pengesahan dalam fungsi anda sendiri, `error(mesej, 2)` mengalihkan kedudukan dalam mesej ke pemanggil, supaya baris atas menunjuk ke kod yang sebenarnya salah.',
        '`pcall` catches an error **after** the stack has unwound, so by the time you see the message the traceback is gone. `xpcall(f, handler)` solves this: the handler is called at the point of the error, with the stack still intact, and can call `debug.traceback` to record it. In Roblox, Studio’s Output prints a traceback automatically for uncaught errors, and every line is clickable. For validation errors in your own functions, `error(message, 2)` moves the position in the message to the caller, so the top line points at the code that is actually wrong.')),
    S('technical_terminology', TERMS('stack-traceback', 'call-stack', 'runtime-error', 'function')),
    S('syntax_rules',
      UL(
        ['`debug.traceback()` / `debug.traceback("mesej")` / `debug.traceback("mesej", 2)` — tahap 2 melangkau fungsi semasa.', '`debug.traceback()` / `debug.traceback("message")` / `debug.traceback("message", 2)` — level 2 skips the current function.'],
        ['`local ok, hasil = xpcall(f, pengendali, arg1, …)`.', '`local ok, result = xpcall(f, handler, arg1, …)`.'],
        ['`error(mesej, 2)` — kedudukan pemanggil; `error(mesej, 0)` — tiada kedudukan.', '`error(message, 2)` — the caller’s position; `error(message, 0)` — no position.'],
      )),
    S('code_demonstration',
      CODE('traceback-chain', 'luau', 'luau', ['Traceback rantaian tiga fungsi', 'A traceback of a three-function chain'], `
local function inner(player)
  return player.Name
end
local function middle(player)
  return "Hello " .. inner(player)
end
local function outer()
  return middle(nil)
end
local function handler(message)
  return (debug.traceback(message, 2):gsub("\\n$", ""))
end
local ok, report = xpcall(outer, handler)
print(ok)
print(report)
`, "false\nexample:2: attempt to index nil with 'Name'\nexample:2 function inner\nexample:5 function middle\nexample:8 function outer\nexample:13"),
      EXPLAIN('traceback-chain',
        ['1–9', 'Tiga fungsi: `outer` memanggil `middle` dengan `nil`; `middle` memanggil `inner`; `inner` gagal.', 'Three functions: `outer` calls `middle` with `nil`; `middle` calls `inner`; `inner` fails.'],
        ['10–12', 'Pengendali membina traceback bermula pada tahap 2 (melangkau pengendali itu sendiri) dan membuang baris baharu terakhir.', 'The handler builds a traceback starting at level 2 (skipping the handler itself) and removes the final newline.'],
        ['13–15', 'Laporan: mesej, kemudian `inner` (baris 2), `middle` (baris 5), `outer` (baris 8) dan chunk utama (baris 13). Punca sebenar ialah baris 8, bukan baris 2.', 'The report: the message, then `inner` (line 2), `middle` (line 5), `outer` (line 8) and the main chunk (line 13). The real cause is line 8, not line 2.'])),
    S('complete_examples',
      CODE('caller-level', 'luau', 'luau', ['error tahap 2 menunjuk ke pemanggil', 'A level-2 error points at the caller'], `
local function requirePositive(n: number, name: string)
  if n <= 0 then
    error(\`{name} must be positive, got {n}\`, 2)
  end
end

local function buyItems(count: number)
  requirePositive(count, "count")
  return count * 25
end

print(buyItems(4))
print(pcall(function()
  return buyItems(-1)
end))
`, '100\nfalse\texample:8: count must be positive, got -1', {
        debug: BUG(`
local function requirePositive(n: number, name: string)
  if n <= 0 then
    error(\`{name} must be positive, got {n}\`)
  end
end
local function buyItems(count: number)
  requirePositive(count, "count")
  return count * 25
end
buyItems(-1)
`, 'example:3: count must be positive, got -1',
          'Versi ini menggunakan tahap lalai (1), jadi mesej menunjuk ke baris 3 — di dalam fungsi pengesahan, yang tidak salah. Pengguna mesti membaca traceback untuk mencari pemanggil. Dengan `error(…, 2)` dalam versi asal, mesej menunjuk terus ke baris 8, tempat nilai buruk dihantar. Ralat ini sengaja dibiarkan supaya anda dapat membandingkan kedudukannya.',
          'This version uses the default level (1), so the message points to line 3 — inside the validation function, which is not wrong. The user must read the traceback to find the caller. With `error(…, 2)` in the original, the message points straight to line 8, where the bad value was passed. This error is left on purpose so you can compare the positions.'),
      }),
      EXPLAIN('caller-level',
        ['1–5', 'Fungsi pengesahan umum; tahap 2 bermaksud "salahkan siapa yang memanggil saya".', 'A general validation function; level 2 means "blame whoever called me".'],
        ['7–10', '`buyItems` memanggil pengesahan pada baris 8.', '`buyItems` calls the validation on line 8.'],
        ['12–15', 'Panggilan sah memberi 100; panggilan tidak sah dilaporkan pada **baris 8**.', 'A valid call gives 100; an invalid call is reported at **line 8**.']),
      CODE('traceback-snapshot', 'luau', 'luau', ['Mengambil gambar timbunan tanpa ralat', 'Taking a stack snapshot without an error'], `
local function whereAmI(): string
  return (debug.traceback("snapshot", 2):gsub("\\n$", ""))
end

local function loadLevel(n: number)
  print(\`loading level {n}\`)
  print(whereAmI())
end

loadLevel(3)
`, 'loading level 3\nsnapshot\nexample:7 function loadLevel\nexample:10', {
        debug: BUG(`
local function loadLevel(levels, n: number)
  local level = levels[n]
  print(\`loading {level.name}\`)
end
local function startGame(levels)
  loadLevel(levels, 4)
end
startGame({{name = "Forest"}, {name = "Cave"}})
`, "example:3: attempt to index nil with 'name'",
          'Hanya dua tahap wujud, tetapi `startGame` meminta tahap 4. Ralat berlaku pada baris 3 (`level.name`), tetapi traceback penuh (dalam CLI atau Studio) menunjukkan `startGame` pada baris 6 — punca sebenar. Baca traceback ke bawah sehingga anda menemui baris yang memilih nilai yang salah.',
          'Only two levels exist, but `startGame` asks for level 4. The error happens on line 3 (`level.name`), but the full traceback (in the CLI or Studio) shows `startGame` on line 6 — the real cause. Read the traceback downwards until you find the line that chose the wrong value.'),
      }),
      EXPLAIN('traceback-snapshot',
        ['1–3', '`debug.traceback` tidak memerlukan ralat — ia boleh merekod "bagaimana saya sampai ke sini" pada bila-bila masa.', '`debug.traceback` does not need an error — it can record "how did I get here" at any time.'],
        ['5–8', 'Fungsi yang mencetak tempatnya dalam timbunan.', 'A function that prints its place in the stack.'],
        ['10', 'Output: `loadLevel` dipanggil dari baris 10 chunk utama.', 'The output: `loadLevel` was called from line 10 of the main chunk.'])),
    S('line_by_line',
      EXPLAIN('traceback-chain',
        ['11', '`:gsub("\\n$", "")` membuang baris baharu yang ditambah oleh `debug.traceback` di hujung; kurungan luar memotong nilai kedua `gsub`.', '`:gsub("\\n$", "")` removes the newline that `debug.traceback` adds at the end; the outer parentheses drop `gsub`’s second value.']),
      EXPLAIN('caller-level',
        ['3', '`error` dengan tahap 2: bingkai 1 ialah `requirePositive`, bingkai 2 ialah pemanggilnya `buyItems` — kedudukan baris 8 diambil daripada bingkai 2.', '`error` with level 2: frame 1 is `requirePositive`, frame 2 is its caller `buyItems` — the position on line 8 is taken from frame 2.'])),
    S('why_this_way',
      P('Mengapa traceback dan bukan sekadar baris ralat? Kerana dalam program sebenar, fungsi kecil dipanggil dari banyak tempat. `inner` mungkin dipanggil dari dua puluh tempat; hanya traceback memberitahu tempat mana yang menghantar `nil`. Mengapa `xpcall`? Kerana pelayan yang menangkap ralat dengan `pcall` kehilangan maklumat yang paling berharga untuk membaikinya.',
        'Why a traceback and not just the error line? Because in real programs, small functions are called from many places. `inner` might be called from twenty places; only the traceback tells you which one passed `nil`. Why `xpcall`? Because a server that catches errors with `pcall` loses the most valuable information for fixing them.'),
      P('Gunakan `xpcall` dengan `debug.traceback` **apabila** anda menangkap ralat yang mungkin perlu dinyahpepijat kemudian (log pelayan); gunakan `error(…, 2)` **apabila** menulis fungsi pengesahan untuk orang lain.', 'Use `xpcall` with `debug.traceback` **when** you catch errors that may need debugging later (server logs); use `error(…, 2)` **when** writing validation functions for others.')),
    S('execution_flow',
      OL(
        ['`xpcall(outer, handler)` memanggil `outer` → `middle(nil)` → `inner(nil)`.', '`xpcall(outer, handler)` calls `outer` → `middle(nil)` → `inner(nil)`.'],
        ['`player.Name` pada `nil` → ralat. Timbunan: inner, middle, outer, chunk utama.', '`player.Name` on `nil` → error. Stack: inner, middle, outer, main chunk.'],
        ['`handler` dipanggil **sekarang**, timbunan masih utuh → traceback direkodkan.', '`handler` is called **now**, with the stack intact → the traceback is recorded.'],
        ['Timbunan dibuka; `xpcall` memulangkan `false` dan nilai pulangan pengendali.', 'The stack unwinds; `xpcall` returns `false` and the handler’s return value.'],
      )),
    S('memory_behaviour',
      P('Traceback ialah string yang boleh menjadi panjang dalam rekursi yang dalam; Luau memendekkannya secara automatik untuk timbunan yang sangat dalam. Jangan simpan traceback bagi setiap ralat dalam table yang terus membesar pada pelayan yang berjalan lama — hadkan bilangan log atau hantar ke perkhidmatan luar.',
        'A traceback is a string that can grow long in deep recursion; Luau shortens it automatically for very deep stacks. Do not keep a traceback for every error in an ever-growing table on a long-running server — limit the number of logs or send them to an external service.')),
    S('alternative_implementations',
      P('Dalam Roblox, `ScriptContext.Error` menerima setiap ralat yang tidak ditangkap bersama tracebacknya — berguna untuk log berpusat:', 'In Roblox, `ScriptContext.Error` receives every uncaught error with its traceback — useful for central logging:'),
      CODE('scriptcontext-log', 'luau', 'roblox', ['Log ralat berpusat (dikompil sahaja)', 'Central error logging (compiled only)'], `
local ScriptContext = game:GetService("ScriptContext")
local recent = {}

ScriptContext.Error:Connect(function(message, trace, script)
  table.insert(recent, {message = message, trace = trace, source = script and script:GetFullName()})
  if #recent > 50 then
    table.remove(recent, 1)
  end
  warn(\`[error log] {message}\`)
end)
`),
      EXPLAIN('scriptcontext-log',
        ['1–2', 'Perkhidmatan ScriptContext dan senarai log yang terhad.', 'The ScriptContext service and a bounded log list.'],
        ['4–9', 'Event `Error` menerima mesej, traceback dan skrip sumber; hanya 50 entri terakhir disimpan; `warn` mencetak ringkasan kuning. **Dikompil sahaja.**', 'The `Error` event receives the message, the traceback and the source script; only the last 50 entries are kept; `warn` prints a yellow summary. **Compiled only.**'])),
    S('common_mistakes',
      UL(
        ['Membaiki baris atas traceback sedangkan punca berada di bawah.', 'Fixing the top line of a traceback while the cause is further down.'],
        ['Menggunakan `pcall` dan kehilangan traceback.', 'Using `pcall` and losing the traceback.'],
        ['Menulis `error(…)` tahap 1 dalam fungsi pengesahan, lalu mesej menunjuk ke fungsi yang betul.', 'Writing level-1 `error(…)` in a validation function, so the message points at the correct function.'],
        ['Mengabaikan baris traceback dalam modul pustaka yang tidak anda tulis.', 'Ignoring traceback lines inside library modules you did not write.'],
      )),
    S('debugging',
      P('Prosedur membaca traceback: (1) baca mesej dan baris atas — apa yang gagal; (2) turun satu baris dan lihat nilai yang dihantar oleh pemanggil; (3) teruskan sehingga anda menemui fungsi pertama yang menghantar nilai yang salah; (4) baiki di **situ**, bukan di atas. Dalam Studio, klik setiap baris traceback dalam Output untuk melompat ke kod. Contoh berikut menunjukkan pengesahan awal yang menjadikan traceback lebih pendek dan mesej lebih jelas:',
        'A procedure for reading tracebacks: (1) read the message and the top line — what failed; (2) go down one line and look at the value the caller passed; (3) continue until you find the first function that passed a wrong value; (4) fix it **there**, not at the top. In Studio, click each traceback line in the Output to jump to the code. The following example shows early validation that makes tracebacks shorter and messages clearer:'),
      CODE('fail-early', 'luau', 'luau', ['Gagal awal di sempadan', 'Fail early at the boundary'], `
local function startRound(players: {string})
  if #players < 2 then
    return nil, \`need at least 2 players, have {#players}\`
  end
  return \`round started with {table.concat(players, ", ")}\`
end

print(startRound({"Aina", "Ben"}))
print(startRound({"Aina"}))
`, 'round started with Aina, Ben\nnil\tneed at least 2 players, have 1'),
      EXPLAIN('fail-early',
        ['1–4', 'Semak syarat di pintu masuk fungsi; masalah dilaporkan di sini dan bukannya dalam fungsi dalaman.', 'Check the condition at the function’s entrance; the problem is reported here instead of deep inside.'],
        ['5', 'Kerja sebenar hanya berjalan dengan input yang sah.', 'The real work only runs with valid input.'],
        ['8–9', 'Satu kejayaan dan satu kegagalan yang dijelaskan.', 'One success and one explained failure.'])),
    S('performance',
      P('`debug.traceback` agak mahal — ia melawati setiap bingkai dan membina string — jadi jangan panggilnya dalam laluan biasa yang kerap. Dalam pengendali `xpcall`, kos itu hanya dibayar apabila ralat berlaku, iaitu jarang.',
        '`debug.traceback` is fairly expensive — it visits every frame and builds a string — so do not call it on a frequent normal path. In an `xpcall` handler, the cost is only paid when an error happens, which is rare.')),
    S('software_engineering',
      P('Menangkap ralat tanpa konteks berbanding menangkap dengan traceback:', 'Catching errors without context versus catching with a traceback:'),
      CODE('poor-pcall-only', 'luau', 'luau', ['Pelaksanaan lemah: pcall tanpa traceback', 'Poor implementation: pcall without a traceback'], `
local function loadProfile(data)
  return data.stats.coins
end
local function onJoin(data)
  return loadProfile(data) + 10
end

local ok, message = pcall(onJoin, {})
print(ok, message)
`, "false\texample:2: attempt to index nil with 'coins'"),
      EXPLAIN('poor-pcall-only',
        ['1–6', 'Dua fungsi; `stats` hilang dalam data.', 'Two functions; `stats` is missing from the data.'],
        ['8–9', 'Log hanya menunjukkan baris 2 — tiada petunjuk bahawa `onJoin` dengan data kosong ialah punca.', 'The log only shows line 2 — no hint that `onJoin` with empty data is the cause.']),
      CODE('improved-xpcall-trace', 'luau', 'luau', ['Pelaksanaan lebih baik: xpcall dengan traceback', 'Improved implementation: xpcall with a traceback'], `
local function loadProfile(data)
  return data.stats.coins
end
local function onJoin(data)
  return loadProfile(data) + 10
end
local function withTrace(message)
  return (debug.traceback(message, 2):gsub("\\n$", ""))
end

local ok, report = xpcall(onJoin, withTrace, {})
print(ok)
print(report)
`, "false\nexample:2: attempt to index nil with 'coins'\nexample:2 function loadProfile\nexample:5 function onJoin\nexample:11"),
      EXPLAIN('improved-xpcall-trace',
        ['1–9', 'Fungsi yang sama, ditambah pengendali yang merekod traceback.', 'The same functions, plus a handler that records the traceback.'],
        ['11–13', '`xpcall` menghantar argumen tambahan (`{}`) kepada `onJoin`; laporan menunjukkan keseluruhan rantaian.', '`xpcall` passes the extra argument (`{}`) to `onJoin`; the report shows the whole chain.'])),
    S('industry_use_cases',
      UL(
        ['Permainan Roblox besar menghantar traceback ralat pelayan ke perkhidmatan analitik untuk diperiksa oleh pembangun.', 'Large Roblox games send server error tracebacks to analytics services for developers to inspect.'],
        ['Rangka kerja ujian mencetak traceback untuk setiap ujian yang gagal.', 'Test frameworks print a traceback for every failing test.'],
        ['Pustaka awam menggunakan `error(…, 2)` supaya ralat menunjuk ke kod pengguna.', 'Public libraries use `error(…, 2)` so errors point at user code.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah fungsi keempat antara `middle` dan `inner` dalam `traceback-chain` dan ramalkan traceback baharu.', 'Add a fourth function between `middle` and `inner` in `traceback-chain` and predict the new traceback.'],
        ['Tukar tahap dalam `caller-level` kepada 3 dan perhatikan baris yang dilaporkan.', 'Change the level in `caller-level` to 3 and see which line is reported.'],
        ['Dalam Studio, cetuskan ralat dalam Script dan klik setiap baris traceback dalam Output.', 'In Studio, trigger an error in a Script and click each traceback line in the Output.'],
      )),
    S('mini_project',
      P('**Pelapor ralat.** Tulis `safeCall(nama, f, …)` yang menjalankan fungsi dengan `xpcall`, mengembalikan hasil apabila berjaya, dan mencetak laporan ringkas (mesej + fungsi dalam traceback) apabila gagal.', '**An error reporter.** Write `safeCall(name, f, …)` that runs a function with `xpcall`, returns its result on success, and prints a short report (message + functions in the traceback) on failure.'),
      CODE('error-reporter', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function safeCall(name: string, fn, ...)
  local ok, result = xpcall(fn, function(message)
    return (debug.traceback(message, 2):gsub("\\n$", ""))
  end, ...)
  if ok then return result end
  local lines = string.split(result, "\\n")
  print(\`[{name}] {lines[1]}\`)
  for i = 2, #lines do
    print(\`    at {lines[i]}\`)
  end
  return nil
end

local function divide(a: number, b: number)
  if b == 0 then error("division by zero", 2) end
  return a / b
end
local function average(total: number, count: number)
  return divide(total, count)
end

print(safeCall("avg", average, 10, 4))
print(safeCall("avg", average, 10, 0))
`, '2.5\n[avg] example:19: division by zero\n    at example:15 function divide\n    at example:19 function average\n    at example:2 function safeCall\n    at example:23\nnil'),
      EXPLAIN('error-reporter',
        ['1–5', '`xpcall` dengan pengendali tanpa nama yang merekod traceback; argumen tambahan dimajukan kepada `fn`.', '`xpcall` with an anonymous handler that records the traceback; extra arguments are forwarded to `fn`.'],
        ['6–12', 'Pada kegagalan: baris pertama ialah mesej; selebihnya dicetak dengan awalan "at".', 'On failure: the first line is the message; the rest are printed with an "at" prefix.'],
        ['14–20', '`divide` menyalahkan pemanggilnya (tahap 2), jadi mesej menunjuk ke baris 19 dalam `average`.', '`divide` blames its caller (level 2), so the message points to line 19 in `average`.'],
        ['22–23', 'Satu kejayaan (2.5) dan satu laporan. Traceback juga mengandungi `safeCall` pada baris 2 (tempat `xpcall` dipanggil) dan chunk utama pada baris 23 — kerana kedua-duanya masih dalam timbunan semasa ralat.', 'One success (2.5) and one report. The traceback also contains `safeCall` at line 2 (where `xpcall` is called) and the main chunk at line 23 — because both are still on the stack at the time of the error.'])),
    S('summary',
      UL(
        ['Traceback = gambar timbunan panggilan pada saat ralat, terbaharu di atas.', 'A traceback = a picture of the call stack at the moment of the error, newest on top.'],
        ['Punca sering di bawah baris atas — baca ke bawah.', 'The cause is often below the top line — read downwards.'],
        ['`xpcall` + `debug.traceback` merekod traceback; `pcall` kehilangannya.', '`xpcall` + `debug.traceback` records the traceback; `pcall` loses it.'],
        ['`error(mesej, 2)` menyalahkan pemanggil.', '`error(message, 2)` blames the caller.'],
      )),
    S('knowledge_check',
      OL(
        ['Dalam traceback, baris mana yang menunjukkan tempat ralat berlaku?', 'In a traceback, which line shows where the error happened?'],
        ['Mengapakah `pcall` tidak boleh memberi traceback penuh?', 'Why can `pcall` not give a full traceback?'],
        ['Apakah kesan tahap 2 dalam `error(mesej, 2)`?', 'What is the effect of level 2 in `error(message, 2)`?'],
        ['Dalam `traceback-chain`, baris mana yang perlu dibaiki?', 'In `traceback-chain`, which line needs fixing?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library (debug.traceback, xpcall)', url: `${LUAU}/library` },
        { title: 'Roblox Creator Hub — Debugging', url: `${DOCS}/studio/debugging` },
        { title: 'ScriptContext.Error (Engine API reference)', url: `${DOCS}/reference/engine/classes/ScriptContext#Error` },
        { title: 'Roblox globals — xpcall', url: `${DOCS}/reference/engine/globals/LuaGlobals#xpcall` },
      )),
  ],
};

// ─── 4.3 Debugging strategies for beginners ────────────────────────────────

export const LUAU101_4_3: LectureContentDef = {
  courseCode: 'LUAU101',
  module: 4,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Mengikuti proses penyahpepijatan yang sistematik: hasilkan semula, asingkan, terangkan, betulkan, sahkan.', 'Follow a systematic debugging process: reproduce, isolate, explain, fix, verify.'],
        ['Menggunakan cetakan berlabel, `assert` dan bahagi-dan-takluk.', 'Use labelled prints, `assert` and divide-and-conquer.'],
        ['Menggunakan penyahpepijat Studio: titik henti (breakpoint) dan Watch.', 'Use Studio’s debugger: breakpoints and Watch.'],
        ['Menulis ujian regresi supaya pepijat tidak kembali.', 'Write a regression test so a bug does not come back.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1–4.2: jenis ralat dan traceback.', 'Lectures 4.1–4.2: kinds of errors and tracebacks.'],
      )),
    S('introduction',
      P('Penyahpepijatan ialah kemahiran yang boleh dipelajari, bukan bakat. Pemula sering menukar kod secara rawak sehingga ralat hilang — dan mencipta dua pepijat baharu dalam proses itu. Pembangun berpengalaman mengikut proses: mereka **menghasilkan semula** masalah dengan pasti, **mengasingkan** bahagian kod yang salah, **menerangkan** punca dalam satu ayat, **membetulkan** satu perkara, dan **mengesahkan** dengan ujian. Kuliah ini mengajar proses itu bersama alat yang tersedia dalam luau CLI dan Roblox Studio.',
        'Debugging is a learnable skill, not a talent. Beginners often change code at random until the error disappears — creating two new bugs in the process. Experienced developers follow a process: they **reproduce** the problem reliably, **isolate** the wrong part of the code, **explain** the cause in one sentence, **fix** one thing, and **verify** with a test. This lecture teaches that process together with the tools available in the luau CLI and Roblox Studio.'),
      KEY('Hasilkan semula → asingkan → terangkan → betulkan → sahkan.', 'Reproduce → isolate → explain → fix → verify.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Hasilkan semula:** cari input atau langkah yang sentiasa mencetuskan pepijat.', '**Reproduce:** find the input or steps that always trigger the bug.'],
        ['**Asingkan:** sempitkan kawasan kod — cetakan berlabel, bahagi-dan-takluk, atau titik henti.', '**Isolate:** narrow down the code region — labelled prints, divide-and-conquer, or breakpoints.'],
        ['**Terangkan:** tulis punca dalam satu ayat ("`coins` ialah string kerana…"). Jika tidak boleh, anda belum menemuinya.', '**Explain:** write the cause in one sentence ("`coins` is a string because…"). If you cannot, you have not found it yet.'],
        ['**Betulkan dan sahkan:** satu perubahan, kemudian ujian yang dahulunya gagal kini lulus — dan kekal sebagai ujian regresi.', '**Fix and verify:** one change, then the test that used to fail now passes — and stays as a regression test.'],
        ['**Alat Studio:** titik henti, Step Into/Over, tetingkap Watch dan Call Stack.', '**Studio tools:** breakpoints, Step Into/Over, the Watch and Call Stack windows.'],
      )),
    S('detailed_theory',
      P('Pepijat ialah perbezaan antara apa yang anda **fikir** kod lakukan dan apa yang ia **sebenarnya** lakukan. Setiap teknik penyahpepijatan ialah cara untuk melihat keadaan sebenar. Cetakan berlabel menunjukkan nilai pada titik tertentu. `assert` menyatakan apa yang anda percaya benar dan berhenti serta-merta apabila ia tidak — mengubah andaian tersembunyi kepada semakan yang jelas. **Bahagi-dan-takluk** (carian binari pada kod) menyemak keadaan di tengah-tengah pengiraan: jika betul di sana, pepijat berada di separuh kedua; jika tidak, di separuh pertama. Dengan beberapa langkah, kawasan yang besar menjadi satu baris.',
        'A bug is the difference between what you **think** the code does and what it **actually** does. Every debugging technique is a way to see the actual state. Labelled prints show values at a specific point. `assert` states what you believe is true and stops immediately when it is not — turning a hidden assumption into an explicit check. **Divide-and-conquer** (a binary search over the code) checks the state in the middle of a computation: if it is right there, the bug is in the second half; if not, in the first. In a few steps, a large region shrinks to one line.'),
      P('Roblox Studio menambah penyahpepijat sebenar: klik di sebelah nombor baris untuk meletakkan titik henti, tekan Play, dan pelaksanaan berhenti pada baris itu. Dari situ, tetingkap **Watch** memaparkan nilai pemboleh ubah, **Call Stack** memaparkan traceback hidup, dan butang Step Into/Over/Out menjalankan satu baris pada satu masa. Akhir sekali, setiap pepijat yang dibaiki patut meninggalkan **ujian regresi** — semakan kecil yang gagal sebelum pembaikan dan lulus selepasnya — supaya pepijat yang sama tidak kembali secara senyap selepas perubahan masa hadapan.',
        'Roblox Studio adds a real debugger: click next to a line number to place a breakpoint, press Play, and execution pauses on that line. From there, the **Watch** window shows variable values, **Call Stack** shows the live traceback, and the Step Into/Over/Out buttons run one line at a time. Finally, every fixed bug should leave a **regression test** — a small check that failed before the fix and passes after it — so the same bug does not silently return after future changes.')),
    S('technical_terminology', TERMS('runtime-error', 'stack-traceback', 'roblox-studio', 'script-analysis')),
    S('syntax_rules',
      UL(
        ['Cetakan berlabel: `` print(`[debug] coins={coins} ({typeof(coins)})`) ``.', 'Labelled print: `` print(`[debug] coins={coins} ({typeof(coins)})`) ``.'],
        ['Andaian: `assert(typeof(x) == "number", "x should be a number")`.', 'Assumption: `assert(typeof(x) == "number", "x should be a number")`.'],
        ['Ujian regresi: `assert(f(inputLama) == hasilBetul, "bug #12 returned")`.', 'Regression test: `assert(f(oldInput) == correctResult, "bug #12 returned")`.'],
      )),
    S('code_demonstration',
      CODE('labelled-debug', 'luau', 'luau', ['Cetakan berlabel dengan jenis', 'Labelled prints with types'], `
local function total(prices)
  local sum = 0
  for i, p in prices do
    print(\`[debug] i={i} p={p} ({typeof(p)})\`)
    sum += tonumber(p) or 0
  end
  return sum
end

print("total:", total({10, "15", 20}))
`, '[debug] i=1 p=10 (number)\n[debug] i=2 p=15 (string)\n[debug] i=3 p=20 (number)\ntotal:\t45'),
      EXPLAIN('labelled-debug',
        ['1–2', 'Fungsi yang menjumlahkan harga.', 'A function summing prices.'],
        ['3–4', 'Cetakan penyahpepijatan menunjukkan indeks, nilai **dan jenisnya** — mendedahkan bahawa harga kedua ialah string.', 'The debug print shows the index, the value **and its type** — revealing that the second price is a string.'],
        ['5–7', 'Pembaikan: tukar dengan `tonumber`, dengan lalai 0 untuk nilai yang tidak sah; kemudian pulangkan jumlah.', 'The fix: convert with `tonumber`, with a default of 0 for invalid values; then return the sum.'],
        ['10', 'Jumlah betul 45.', 'The correct total 45.'])),
    S('complete_examples',
      CODE('divide-and-conquer', 'luau', 'luau', ['Bahagi dan takluk dengan assert', 'Divide and conquer with assert'], `
local function finalScore(kills: number, deaths: number, bonus: number): number
  local base = kills * 100
  assert(base >= 0, "base should never be negative")
  local penalty = deaths * 25
  local afterPenalty = base - penalty
  assert(afterPenalty <= base, "penalty should not add points")
  return math.max(afterPenalty, 0) + bonus
end

print(finalScore(5, 4, 50))
print(finalScore(1, 10, 0))
`, '450\n0', {
        debug: BUG(`
local function finalScore(kills: number, deaths: number, bonus: number): number
  local base = kills * 100
  local penalty = deaths * -25
  local afterPenalty = base - penalty
  assert(afterPenalty <= base, \`penalty should not add points (base {base}, after {afterPenalty})\`)
  return math.max(afterPenalty, 0) + bonus
end
print(finalScore(5, 4, 50))
`, 'example:5: penalty should not add points (base 500, after 600)',
          'Tanda `-25` menjadikan penalti negatif, jadi menolaknya **menambah** mata. Tanpa `assert`, fungsi akan memulangkan 650 secara senyap — nombor yang kelihatan munasabah. `assert` di tengah pengiraan (bahagi-dan-takluk) menangkap keadaan yang salah serta-merta dan mesejnya menunjukkan kedua-dua nilai. Pembetulan: `deaths * 25`.',
          'The `-25` sign makes the penalty negative, so subtracting it **adds** points. Without the `assert`, the function would silently return 650 — a number that looks reasonable. The `assert` in the middle of the computation (divide-and-conquer) catches the wrong state immediately, and its message shows both values. Fix: `deaths * 25`.'),
      }),
      EXPLAIN('divide-and-conquer',
        ['1–3', 'Langkah 1 dan semakan selepasnya.', 'Step 1 and a check after it.'],
        ['4–6', 'Langkah 2 dan semakan: penalti tidak boleh menambah mata.', 'Step 2 and a check: a penalty must not add points.'],
        ['7', 'Langkah terakhir: had bawah 0 dan bonus.', 'The final step: a floor of 0 and the bonus.'],
        ['10–11', '500 − 100 + 50 = 450; 100 − 250 → 0.', '500 − 100 + 50 = 450; 100 − 250 → 0.']),
      CODE('regression-test', 'luau', 'luau', ['Ujian regresi selepas pembaikan', 'A regression test after a fix'], `
local function splitName(full: string): (string, string)
  local first, rest = string.match(full, "^(%S+)%s*(.*)$")
  return first or "", rest or ""
end

-- Bug #7: single names like "Cher" used to crash. Keep this test forever.
local first, rest = splitName("Cher")
assert(first == "Cher" and rest == "", "bug #7 has returned")

print(splitName("Nur Aina"))
print("regression tests passed")
`, 'Nur\tAina\nregression tests passed', {
        debug: BUG(`
local function splitName(full: string)
  local first, rest = string.match(full, "^(%S+)%s+(.+)$")
  return first:upper(), rest
end
print(splitName("Cher"))
`, "example:3: attempt to index nil with 'upper'",
          'Ini pepijat asal #7: corak memerlukan ruang **dan** sekurang-kurangnya satu aksara selepasnya (`%s+(.+)`). Untuk "Cher", tiada padanan, jadi `first` ialah `nil`, dan `first:upper()` gagal. Versi asal mengubah corak (`%s*(.*)`) dan memberi lalai, serta menyimpan ujian supaya pepijat ini tidak kembali.',
          'This is the original bug #7: the pattern requires a space **and** at least one character after it (`%s+(.+)`). For "Cher" there is no match, so `first` is `nil`, and `first:upper()` fails. The original version changes the pattern (`%s*(.*)`), adds defaults, and keeps a test so this bug does not come back.'),
      }),
      EXPLAIN('regression-test',
        ['1–4', 'Fungsi yang dibaiki: corak menerima nama tunggal; lalai mengelakkan `nil`.', 'The fixed function: the pattern accepts single names; defaults avoid `nil`.'],
        ['6–8', 'Ujian regresi dengan komen yang menerangkan sejarahnya.', 'A regression test with a comment explaining its history.'],
        ['10–11', 'Kes biasa masih berfungsi.', 'The ordinary case still works.'])),
    S('line_by_line',
      EXPLAIN('divide-and-conquer',
        ['6', '`assert` ialah dokumentasi yang boleh dijalankan: ia menyatakan peraturan ("penalti tidak menambah mata") dan menyemaknya setiap kali.', '`assert` is executable documentation: it states a rule ("a penalty never adds points") and checks it every time.']),
      EXPLAIN('labelled-debug',
        ['4', 'Mencetak `typeof(p)` sangat berguna dalam Luau, kerana `print` memaparkan "15" dan 15 dengan cara yang sama.', 'Printing `typeof(p)` is very useful in Luau, because `print` shows "15" and 15 the same way.'])),
    S('why_this_way',
      P('Mengapa proses dan bukan cuba-cuba? Kerana perubahan rawak boleh menyembunyikan simptom tanpa membaiki punca, dan anda tidak akan tahu sama ada pepijat benar-benar hilang. Proses yang sistematik lebih pantas secara purata, dan setiap langkah meninggalkan sesuatu yang berguna: input yang menghasilkan semula, ayat yang menerangkan, dan ujian yang melindungi.',
        'Why a process and not trial and error? Because random changes can hide the symptom without fixing the cause, and you will never know whether the bug is really gone. A systematic process is faster on average, and every step leaves something useful: an input that reproduces, a sentence that explains, and a test that protects.'),
      P('Gunakan cetakan **apabila** anda perlu melihat banyak nilai dengan cepat; titik henti Studio **apabila** anda perlu memeriksa keadaan secara terperinci; `assert` **apabila** anda mempunyai andaian yang patut sentiasa benar.', 'Use prints **when** you need to see many values quickly; Studio breakpoints **when** you need to inspect state in detail; `assert` **when** you have an assumption that should always hold.')),
    S('execution_flow',
      OL(
        ['Hasilkan semula: `finalScore(5, 4, 50)` memberi 650 dan bukannya 450.', 'Reproduce: `finalScore(5, 4, 50)` gives 650 instead of 450.'],
        ['Asingkan: `assert` selepas penalti gagal → pepijat berada dalam pengiraan penalti.', 'Isolate: the `assert` after the penalty fails → the bug is in the penalty computation.'],
        ['Terangkan: "penalti negatif kerana `-25`, jadi menolaknya menambah mata".', 'Explain: "the penalty is negative because of `-25`, so subtracting it adds points".'],
        ['Betulkan dan sahkan: tukar kepada `25`; ujian memberi 450.', 'Fix and verify: change to `25`; the test gives 450.'],
      )),
    S('memory_behaviour',
      P('Cetakan dan `assert` hampir tiada kos memori. Titik henti dalam Studio menjeda VM, jadi masa permainan berhenti — dalam ujian berbilang klien, klien lain boleh tamat masa semasa pelayan dijeda. Ingat untuk membuang titik henti atau mematikannya selepas selesai.',
        'Prints and `assert` cost almost no memory. A breakpoint in Studio pauses the VM, so game time stops — in multi-client tests, other clients can time out while the server is paused. Remember to remove or disable breakpoints when you are done.')),
    S('alternative_implementations',
      P('Penyahpepijat Studio menggantikan banyak cetakan. Kod di bawah ditandakan dengan komen di tempat titik henti akan diletakkan; jalankannya dalam Studio dan periksa tetingkap Watch:', 'Studio’s debugger replaces many prints. The code below is marked with comments where breakpoints would go; run it in Studio and inspect the Watch window:'),
      CODE('breakpoint-practice', 'luau', 'roblox', ['Latihan titik henti dalam Studio (dikompil sahaja)', 'Breakpoint practice in Studio (compiled only)'], `
local Players = game:GetService("Players")

local function rewardFor(player: Player): number
  local age = player.AccountAge -- breakpoint here: Watch "age"
  local reward = if age > 365 then 500 else 100
  return reward -- breakpoint here: Watch "reward"
end

Players.PlayerAdded:Connect(function(player)
  print(player.Name, rewardFor(player))
end)
`),
      EXPLAIN('breakpoint-practice',
        ['1', 'Perkhidmatan Players.', 'The Players service.'],
        ['3–7', 'Klik di margin baris 4 dan 6 untuk titik henti; apabila dijeda, tambah `age` dan `reward` ke Watch dan gunakan Step Over.', 'Click the margin of lines 4 and 6 for breakpoints; when paused, add `age` and `reward` to Watch and use Step Over.'],
        ['9–11', 'Apabila anda menekan Play, watak anda menyertai dan fungsi dipanggil. **Dikompil sahaja** — langkah penyahpepijat ialah untuk anda lakukan dalam Studio.', 'When you press Play, your character joins and the function is called. **Compiled only** — the debugger steps are for you to do in Studio.'])),
    S('common_mistakes',
      UL(
        ['Menukar beberapa perkara sekali gus, lalu tidak tahu yang mana membaiki pepijat.', 'Changing several things at once, then not knowing which one fixed the bug.'],
        ['Menganggap anda tahu nilai pemboleh ubah tanpa mencetak atau memeriksanya.', 'Assuming you know a variable’s value without printing or inspecting it.'],
        ['Membuang ujian selepas pepijat dibaiki.', 'Deleting the test after the bug is fixed.'],
        ['Meninggalkan cetakan penyahpepijatan dan titik henti dalam kod yang diterbitkan.', 'Leaving debug prints and breakpoints in published code.'],
      )),
    S('debugging',
      P('Apabila anda buntu, terangkan kod baris demi baris kepada orang lain — atau kepada itik getah di meja anda. Teknik "rubber duck debugging" berfungsi kerana menerangkan memaksa anda membandingkan apa yang anda **fikir** setiap baris lakukan dengan apa yang ia **benar-benar** tulis. Teknik lain ialah meminimumkan: buang kod sehingga anda mempunyai contoh terkecil yang masih gagal. Contoh minimum berikut menghasilkan semula pepijat perbandingan jenis bercampur dalam tiga baris:',
        'When you are stuck, explain the code line by line to someone else — or to a rubber duck on your desk. "Rubber duck debugging" works because explaining forces you to compare what you **think** each line does with what it **actually** says. Another technique is minimising: remove code until you have the smallest example that still fails. The following minimal example reproduces a mixed-type comparison bug in three lines:'),
      CODE('minimal-repro', 'luau', 'luau', ['Contoh minimum yang menghasilkan semula', 'A minimal reproduction'], `
local savedLevel = "12" -- values loaded from text are strings
local required = 10
print(tonumber(savedLevel) >= required, typeof(savedLevel))
`, 'true\tstring'),
      EXPLAIN('minimal-repro',
        ['1', 'Punca biasa dalam permainan sebenar: data yang dimuatkan sebagai teks.', 'A common cause in real games: data loaded as text.'],
        ['2', 'Nombor untuk dibandingkan.', 'The number to compare with.'],
        ['3', 'Dengan `tonumber`, perbandingan berjaya. Tanpanya, `"12" >= 10` memberi `attempt to compare number <= string` (Luau menyemak `>=` sebagai `<=` dengan operand ditukar). Dua baris data dan satu perbandingan cukup untuk menunjukkan pepijat itu kepada orang lain.', 'With `tonumber`, the comparison succeeds. Without it, `"12" >= 10` gives `attempt to compare number <= string` (Luau checks `>=` as `<=` with the operands swapped). Two lines of data and one comparison are enough to show the bug to someone else.'])),
    S('performance',
      P('`assert` dengan mesej interpolasi membina string setiap kali dipanggil — walaupun syarat benar — kerana argumen dinilai sebelum `assert` dijalankan. Dalam gelung yang sangat panas, gunakan `if not syarat then error(…) end` supaya mesej hanya dibina apabila diperlukan.',
        '`assert` with an interpolated message builds the string on every call — even when the condition is true — because arguments are evaluated before `assert` runs. In very hot loops, use `if not condition then error(…) end` so the message is only built when needed.')),
    S('software_engineering',
      P('Perubahan rawak berbanding pembaikan yang disahkan:', 'Random changes versus a verified fix:'),
      CODE('poor-random-fix', 'luau', 'luau', ['Pelaksanaan lemah: menyembunyikan simptom', 'Poor implementation: hiding the symptom'], `
local function levelFromXp(xp)
  local ok, result = pcall(function()
    return math.floor(xp / 100) + 1
  end)
  return if ok then result else 1
end

print(levelFromXp(250), levelFromXp("250"), levelFromXp(nil))
`, '3\t3\t1'),
      EXPLAIN('poor-random-fix',
        ['1–6', '"Pembaikan" membalut segala-galanya dalam `pcall` dan memulangkan tahap 1 pada sebarang ralat.', 'The "fix" wraps everything in `pcall` and returns level 1 on any error.'],
        ['8', 'XP `nil` memberi tahap 1 secara senyap — pemain dengan data rosak kehilangan kemajuan tanpa sebarang mesej. Punca (data `nil`) tidak pernah dijumpai.', 'A `nil` XP silently gives level 1 — a player with corrupted data loses progress without any message. The cause (`nil` data) is never found.']),
      CODE('improved-verified-fix', 'luau', 'luau', ['Pelaksanaan lebih baik: punca diterangkan dan diuji', 'Improved implementation: cause explained and tested'], `
-- Cause: saved XP is sometimes a string ("250"). Convert explicitly; reject anything else loudly.
local function levelFromXp(xp: number | string): number
  local n = tonumber(xp)
  if n == nil then
    error(\`levelFromXp: invalid xp {xp}\`, 2)
  end
  return math.floor(n / 100) + 1
end

assert(levelFromXp(250) == 3 and levelFromXp("250") == 3, "string xp regression")
print(levelFromXp(99), pcall(levelFromXp, nil))
`, '1\tfalse\tlevelFromXp: invalid xp nil'),
      EXPLAIN('improved-verified-fix',
        ['1', 'Punca diterangkan dalam satu ayat.', 'The cause explained in one sentence.'],
        ['2–8', 'Penukaran eksplisit untuk string yang dijangka; `nil` dan nilai lain ditolak dengan jelas.', 'An explicit conversion for the expected strings; `nil` and other values are clearly rejected.'],
        ['10–11', 'Ujian regresi, kemudian kes biasa dan kes tidak sah yang kini kelihatan.', 'A regression test, then an ordinary case and the invalid case, now visible.'])),
    S('industry_use_cases',
      UL(
        ['Pasukan permainan menghendaki "langkah untuk menghasilkan semula" dalam setiap laporan pepijat.', 'Game teams require "steps to reproduce" in every bug report.'],
        ['Setiap pembaikan pepijat dalam projek sumber terbuka besar disertakan dengan ujian regresi.', 'Every bug fix in large open-source projects comes with a regression test.'],
        ['Penyahpepijat Studio digunakan setiap hari untuk menyiasat logik permainan yang rumit.', 'Studio’s debugger is used daily to investigate complex game logic.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah harga `"abc"` pada `labelled-debug` dan ramalkan jumlahnya.', 'Add the price `"abc"` to `labelled-debug` and predict the total.'],
        ['Dalam Studio, letakkan titik henti dalam `breakpoint-practice` dan periksa `age`.', 'In Studio, place breakpoints in `breakpoint-practice` and inspect `age`.'],
        ['Jalankan kedua-dua versi berpepijat dan tulis punca setiap satu dalam satu ayat.', 'Run both buggy versions and write the cause of each in one sentence.'],
      ),
      WARN('Langkah penyahpepijat Studio dalam kuliah ini diterangkan; contoh `roblox` hanya dikompil oleh sistem kursus.', 'The Studio debugger steps in this lecture are described; `roblox` examples are only compiled by the course system.', ['Status pengesahan', 'Verification status'])),
    S('mini_project',
      P('**Siasatan pepijat.** Fungsi kedai di bawah memberi diskaun yang salah. Gunakan proses lima langkah: hasilkan semula dengan ujian, asingkan dengan `assert`, terangkan dalam komen, betulkan, dan simpan ujian regresi.', '**A bug investigation.** The shop function below gives the wrong discount. Use the five-step process: reproduce with a test, isolate with `assert`, explain in a comment, fix, and keep a regression test.'),
      CODE('bug-investigation', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
-- Reproduce: a 20% VIP discount on 200 coins should give 160, but used to give 40.
-- Cause: the discount was applied as "price * rate" instead of "price * (1 - rate)".
local VIP_RATE = 0.2

local function vipPrice(price: number): number
  local discounted = price * (1 - VIP_RATE)
  assert(discounted <= price and discounted >= 0, \`discount out of range: {discounted}\`)
  return math.floor(discounted + 0.5)
end

local cases = {{200, 160}, {99, 79}, {0, 0}}
for _, c in cases do
  local got = vipPrice(c[1])
  assert(got == c[2], \`vipPrice({c[1]}) expected {c[2]}, got {got}\`)
end
print("vipPrice regression tests passed")
`, 'vipPrice regression tests passed'),
      EXPLAIN('bug-investigation',
        ['1–2', 'Langkah 1 dan 3: cara menghasilkan semula dan punca, dalam komen.', 'Steps 1 and 3: how to reproduce and the cause, in comments.'],
        ['3–9', 'Langkah 4: formula yang betul; `assert` (langkah 2) menjaga julat; pembundaran ke integer terdekat.', 'Step 4: the correct formula; an `assert` (step 2) guards the range; rounding to the nearest integer.'],
        ['11–16', 'Langkah 5: jadual ujian regresi termasuk kes sempadan 0; 99 × 0.8 = 79.2 → 79.', 'Step 5: a regression test table including the boundary case 0; 99 × 0.8 = 79.2 → 79.'])),
    S('summary',
      UL(
        ['Proses: hasilkan semula, asingkan, terangkan, betulkan, sahkan.', 'Process: reproduce, isolate, explain, fix, verify.'],
        ['Cetakan berlabel (dengan `typeof`), `assert` dan bahagi-dan-takluk mengasingkan pepijat.', 'Labelled prints (with `typeof`), `assert` and divide-and-conquer isolate bugs.'],
        ['Studio menyediakan titik henti, Watch dan Call Stack.', 'Studio provides breakpoints, Watch and Call Stack.'],
        ['Setiap pembaikan meninggalkan ujian regresi.', 'Every fix leaves a regression test.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah "menghasilkan semula" ialah langkah pertama?', 'Why is "reproduce" the first step?'],
        ['Bagaimanakah bahagi-dan-takluk mengurangkan kawasan carian?', 'How does divide-and-conquer shrink the search area?'],
        ['Apakah masalah dengan membalut segala-galanya dalam `pcall`?', 'What is the problem with wrapping everything in `pcall`?'],
        ['Apakah ujian regresi, dan bilakah ia ditulis?', 'What is a regression test, and when is it written?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Debugging (breakpoints, Watch, Call Stack)', url: `${DOCS}/studio/debugging` },
        { title: 'Luau — Library (assert, pcall)', url: `${LUAU}/library` },
        { title: 'The Pragmatic Programmer — Rubber duck debugging (Wikipedia summary)', url: 'https://en.wikipedia.org/wiki/Rubber_duck_debugging' },
        { title: 'Roblox Creator Hub — Developer Console', url: `${DOCS}/studio/developer-console` },
      )),
  ],
};

export const LUAU101_M4 = [LUAU101_4_1, LUAU101_4_2, LUAU101_4_3];
