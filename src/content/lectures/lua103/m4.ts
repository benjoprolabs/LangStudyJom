import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA103 · Module 4 — Project 2: Number Guessing Game (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 4.1 Requirements, design and pseudocode ───────────────────────────────

export const LUA103_4_1: LectureContentDef = {
  courseCode: 'LUA103',
  module: 4,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis keperluan permainan teka nombor sebagai senarai yang boleh diuji.', 'Write the number guessing game’s requirements as a testable list.'],
        ['Menterjemah keperluan kepada [[pseudocode]] dan kemudian kepada Lua.', 'Translate requirements into [[pseudocode]] and then into Lua.'],
        ['Memisahkan logik permainan (fungsi tulen) daripada input dan output.', 'Separate game logic (pure functions) from input and output.'],
        ['Menganggar bilangan percubaan yang mencukupi dengan carian binari.', 'Estimate a sufficient number of attempts with binary search.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1–3: syarat, gelung, `break` dan pemikiran algoritma.', 'Modules 1–3: conditions, loops, `break` and algorithmic thinking.'],
        ['LUA102: fungsi, nilai pulangan berbilang, `io.read`.', 'LUA102: functions, multiple return values, `io.read`.'],
      )),
    S('introduction',
      P('Projek 2 menggabungkan semua yang dipelajari dalam LUA103 ke dalam satu program: komputer memilih nombor rahsia, pemain meneka, dan program menjawab "lebih tinggi", "lebih rendah" atau "betul" sehingga pemain menang atau kehabisan percubaan. Sebelum menulis sebarang kod, jurutera perisian menulis **keperluan** (apa yang mesti dilakukan program) dan **reka bentuk** (bagaimana bahagiannya disusun). Kuliah ini melakukan langkah itu dengan teliti, kerana kesilapan reka bentuk lebih murah dibetulkan di atas kertas.',
        'Project 2 combines everything learned in LUA103 into one program: the computer picks a secret number, the player guesses, and the program answers "higher", "lower" or "correct" until the player wins or runs out of attempts. Before writing any code, software engineers write **requirements** (what the program must do) and a **design** (how its parts are organised). This lecture does that step carefully, because design mistakes are cheaper to fix on paper.'),
      KEY('Keperluan → pseudocode → fungsi kecil yang boleh diuji → program penuh.', 'Requirements → pseudocode → small testable functions → full program.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Keperluan fungsian:** apa yang dilakukan program (contohnya "beri petunjuk lebih tinggi/rendah").', '**Functional requirements:** what the program does (for example "give a higher/lower hint").'],
        ['**Kekangan:** had dan peraturan (julat 1–100, maksimum 7 percubaan).', '**Constraints:** limits and rules (range 1–100, at most 7 attempts).'],
        ['**[[pseudocode|Pseudocode]]:** langkah dalam bahasa separa formal, bebas daripada sintaks.', '**[[pseudocode|Pseudocode]]:** steps in semi-formal language, free of syntax.'],
        ['**Fungsi tulen:** keputusan bergantung hanya pada argumen; tiada input/output — mudah diuji.', '**Pure function:** the result depends only on its arguments; no input/output — easy to test.'],
        ['**Carian binari:** strategi terbaik pemain; menentukan had percubaan yang adil.', '**Binary search:** the player’s best strategy; it determines a fair attempt limit.'],
      )),
    S('detailed_theory',
      P('Keperluan yang baik boleh **diuji**: "permainan memberi petunjuk" terlalu kabur, tetapi "jika tekaan lebih kecil daripada rahsia, paparkan higher" boleh disemak dengan satu kes ujian. Untuk permainan ini, keperluannya ialah: (1) rahsia ialah integer rawak dalam julat; (2) setiap tekaan dijawab higher, lower atau correct; (3) input bukan nombor atau di luar julat ditolak dengan mesej; (4) permainan tamat apabila betul atau percubaan habis, dan rahsia didedahkan jika kalah. Setiap keperluan menjadi satu fungsi atau satu cabang dalam kod.',
        'Good requirements are **testable**: "the game gives hints" is too vague, but "if the guess is smaller than the secret, display higher" can be checked with one test case. For this game the requirements are: (1) the secret is a random integer in the range; (2) every guess is answered higher, lower or correct; (3) non-numeric or out-of-range input is rejected with a message; (4) the game ends when correct or out of attempts, and the secret is revealed on a loss. Each requirement becomes one function or one branch in the code.'),
      P('Had percubaan yang adil datang daripada [[algorithm|algoritma]] carian binari: dengan meneka titik tengah julat yang tinggal, setiap tekaan membuang separuh kemungkinan. Untuk n nombor, paling banyak ⌈log₂ n⌉ tekaan diperlukan — 7 untuk 1–100, 10 untuk 1–1000. Reka bentuk yang baik juga memisahkan **logik** (membandingkan tekaan dengan rahsia) daripada **I/O** (membaca papan kekunci, mencetak). Logik tulen boleh diuji dengan `assert` tanpa pemain sebenar; I/O kekal nipis di pinggir program.',
        'A fair attempt limit comes from the binary search [[algorithm]]: by guessing the middle of the remaining range, each guess discards half of the possibilities. For n numbers, at most ⌈log₂ n⌉ guesses are needed — 7 for 1–100, 10 for 1–1000. Good design also separates **logic** (comparing the guess to the secret) from **I/O** (reading the keyboard, printing). Pure logic can be tested with `assert` without a real player; I/O stays thin at the program’s edge.')),
    S('technical_terminology', TERMS('pseudocode', 'algorithm', 'function', 'conditional')),
    S('syntax_rules',
      UL(
        ['Simpan peraturan dalam satu table pemalar: `local RULES = {min = 1, max = 100, maxAttempts = 7}`.', 'Keep the rules in one constant table: `local RULES = {min = 1, max = 100, maxAttempts = 7}`.'],
        ['Fungsi logik memulangkan nilai; ia tidak memanggil `print` atau `io.read`.', 'Logic functions return values; they do not call `print` or `io.read`.'],
        ['Takrifkan fungsi `local` **sebelum** baris yang memanggilnya.', 'Define `local` functions **before** the lines that call them.'],
      )),
    S('code_demonstration',
      P('Pseudocode untuk satu tekaan: *jika tekaan < rahsia maka "higher"; jika tekaan > rahsia maka "lower"; jika tidak "correct"*. Terjemahannya:', 'Pseudocode for one guess: *if guess < secret then "higher"; if guess > secret then "lower"; otherwise "correct"*. Its translation:'),
      CODE('check-guess', 'lua', 'lua54', ['Fungsi logik teras', 'The core logic function'], `
local function checkGuess(guess, secret)
  if guess < secret then
    return "higher"
  elseif guess > secret then
    return "lower"
  end
  return "correct"
end

print(checkGuess(30, 42))
print(checkGuess(50, 42))
print(checkGuess(42, 42))
`, 'higher\nlower\ncorrect', {
        debug: BUG(`
print(checkGuess(30, 42))

local function checkGuess(guess, secret)
  if guess < secret then return "higher" end
  return "not higher"
end
`, "example:1: attempt to call a nil value (global 'checkGuess')",
          'Fungsi dipanggil pada baris 1, tetapi `local function checkGuess` hanya wujud dari baris 3 ke bawah. Pada baris 1, Lua mencari pemboleh ubah global `checkGuess`, yang `nil`. Dalam Lua, definisi fungsi ialah pernyataan yang dijalankan mengikut susunan — takrifkan dahulu, panggil kemudian.',
          'The function is called on line 1, but `local function checkGuess` only exists from line 3 onwards. On line 1, Lua looks up a global variable `checkGuess`, which is `nil`. In Lua, a function definition is a statement executed in order — define first, call afterwards.'),
      }),
      EXPLAIN('check-guess',
        ['1', 'Fungsi tulen dengan dua parameter: tekaan dan rahsia.', 'A pure function with two parameters: the guess and the secret.'],
        ['2–6', 'Dua cabang untuk dua petunjuk; setiap cabang memulangkan string.', 'Two branches for two hints; each branch returns a string.'],
        ['7', 'Jika bukan lebih kecil dan bukan lebih besar, ia sama.', 'If neither smaller nor larger, it is equal.'],
        ['10–12', 'Tiga ujian manual yang meliputi ketiga-tiga hasil.', 'Three manual tests covering all three outcomes.'])),
    S('complete_examples',
      CODE('scripted-round', 'lua', 'lua54', ['Satu pusingan dengan tekaan yang ditulis dahulu', 'One round with pre-written guesses'], `
local secret = 42
local guesses = {50, 25, 37, 43, 40, 42}
local attempts = 0

for _, guess in ipairs(guesses) do
  attempts = attempts + 1
  if guess == secret then
    print("correct after " .. attempts .. " attempts")
    break
  elseif guess < secret then
    print(guess .. ": higher")
  else
    print(guess .. ": lower")
  end
end
`, '50: lower\n25: higher\n37: higher\n43: lower\n40: higher\ncorrect after 6 attempts', {
        debug: BUG(`
local secret = 7
local guess = "5" -- io.read always returns a string
if guess < secret then print("higher") end
`, 'example:3: attempt to compare string with number',
          '`io.read("l")` sentiasa memulangkan **string**, walaupun pengguna menaip digit. Lua tidak menukar string kepada nombor untuk `<` (hanya untuk aritmetik), jadi perbandingan gagal. Tukar dengan `tonumber` dahulu — dan sahkan hasilnya, seperti dalam kuliah 4.2.',
          '`io.read("l")` always returns a **string**, even when the user types digits. Lua does not convert strings to numbers for `<` (only for arithmetic), so the comparison fails. Convert with `tonumber` first — and validate the result, as in lecture 4.2.'),
      }),
      EXPLAIN('scripted-round',
        ['1–3', 'Rahsia tetap dan tekaan "pemain" yang ditulis dahulu — supaya pusingan boleh diulang tepat sama semasa mereka bentuk.', 'A fixed secret and pre-written "player" guesses — so the round can be repeated exactly while designing.'],
        ['5–6', 'Setiap tekaan menambah kiraan percubaan.', 'Each guess adds to the attempt count.'],
        ['7–9', 'Betul: laporkan dan keluar dengan `break` (kuliah 3.1).', 'Correct: report and leave with `break` (lecture 3.1).'],
        ['10–14', 'Petunjuk arah untuk tekaan yang salah.', 'A direction hint for a wrong guess.']),
      CODE('rules-table', 'lua', 'lua54', ['Peraturan sebagai data', 'Rules as data'], `
local RULES = {min = 1, max = 100, maxAttempts = 7}

print("Guess a number between " .. RULES.min .. " and " .. RULES.max)
print("You have " .. RULES.maxAttempts .. " attempts")

local needed = math.ceil(math.log(RULES.max - RULES.min + 1, 2))
print("binary search needs at most " .. needed)
`, 'Guess a number between 1 and 100\nYou have 7 attempts\nbinary search needs at most 7'),
      EXPLAIN('rules-table',
        ['1', 'Semua kekangan di satu tempat; menukar kesukaran = menukar satu baris.', 'All constraints in one place; changing difficulty = changing one line.'],
        ['3–4', 'Mesej dibina daripada peraturan, bukan nombor yang ditulis terus.', 'Messages are built from the rules, not hard-coded numbers.'],
        ['6–7', '`math.log(100, 2)` ≈ 6.64; `math.ceil` membundarkan ke atas kepada integer 7. Had 7 percubaan adalah adil.', '`math.log(100, 2)` ≈ 6.64; `math.ceil` rounds up to the integer 7. A 7-attempt limit is fair.'])),
    S('line_by_line',
      EXPLAIN('check-guess',
        ['5', '`elseif` dan bukan `if` berasingan: hanya satu cabang boleh berjalan (kuliah 1.2).', '`elseif`, not a separate `if`: only one branch can run (lecture 1.2).']),
      EXPLAIN('scripted-round',
        ['2', 'Jujukan ini ialah strategi carian binari yang hampir sempurna — ia menguji setiap cabang: lower, higher dan correct.', 'This sequence is a near-perfect binary search strategy — it exercises every branch: lower, higher and correct.'])),
    S('why_this_way',
      P('Mengapa menulis pseudocode dan fungsi kecil dahulu? Kerana permainan yang membaca papan kekunci sukar diuji: setiap ujian memerlukan anda menaip. Dengan `checkGuess` sebagai fungsi tulen dan tekaan yang ditulis dahulu, keseluruhan logik boleh disemak dalam sesaat dan diulang selepas setiap perubahan.',
        'Why write pseudocode and small functions first? Because a game that reads the keyboard is hard to test: every test requires you to type. With `checkGuess` as a pure function and pre-written guesses, the whole logic can be checked in a second and repeated after every change.'),
      P('Gunakan pendekatan ini **apabila** program mempunyai interaksi pengguna; tulis I/O terakhir, sebagai lapisan nipis di sekeliling logik yang sudah diuji.', 'Use this approach **when** a program has user interaction; write the I/O last, as a thin layer around already-tested logic.')),
    S('execution_flow',
      OL(
        ['`scripted-round`: tekaan 50 → 50 > 42 → "50: lower".', '`scripted-round`: guess 50 → 50 > 42 → "50: lower".'],
        ['25 dan 37 lebih kecil → "higher"; 43 lebih besar → "lower"; 40 lebih kecil → "higher".', '25 and 37 are smaller → "higher"; 43 is larger → "lower"; 40 is smaller → "higher".'],
        ['42 sama dengan rahsia → mesej kejayaan dengan 6 percubaan, kemudian `break`.', '42 equals the secret → a success message with 6 attempts, then `break`.'],
      )),
    S('memory_behaviour',
      P('Peraturan dan senarai tekaan ialah table kecil yang diperuntukkan sekali. Setiap petunjuk seperti `guess .. ": higher"` mencipta string baharu yang dibebaskan oleh pengutip sampah selepas dicetak. Permainan ini tidak pernah memerlukan lebih daripada beberapa kilobait.',
        'The rules and the guess list are small tables allocated once. Every hint such as `guess .. ": higher"` creates a new string that the garbage collector frees after it is printed. This game never needs more than a few kilobytes.')),
    S('alternative_implementations',
      P('Untuk mengesahkan bahawa 7 percubaan memang mencukupi, biarkan komputer bermain dengan carian binari:', 'To confirm that 7 attempts really suffice, let the computer play with binary search:'),
      CODE('auto-play', 'lua', 'lua54', ['Pemain automatik dengan carian binari', 'An automatic player using binary search'], `
local function autoPlay(secret, low, high)
  local attempts = 0
  while low <= high do
    local mid = (low + high) // 2
    attempts = attempts + 1
    if mid == secret then return mid, attempts end
    if mid < secret then low = mid + 1 else high = mid - 1 end
  end
end

print(autoPlay(42, 1, 100))
print(autoPlay(100, 1, 100))
`, '42\t7\n100\t7'),
      EXPLAIN('auto-play',
        ['1–2', 'Julat semasa dan kiraan percubaan.', 'The current range and an attempt count.'],
        ['3–5', 'Teka titik tengah dengan pembahagian integer `//`.', 'Guess the middle with integer division `//`.'],
        ['6', 'Dijumpai: pulangkan nombor dan bilangan percubaan.', 'Found: return the number and the attempt count.'],
        ['7', 'Buang separuh julat yang tidak mungkin mengandungi rahsia.', 'Discard the half of the range that cannot contain the secret.'],
        ['11–12', 'Kedua-dua kes memerlukan 7 tekaan — sama dengan anggaran ⌈log₂ 100⌉.', 'Both cases need 7 guesses — matching the ⌈log₂ 100⌉ estimate.'])),
    S('common_mistakes',
      UL(
        ['Terus menulis kod tanpa keperluan yang jelas, lalu menulis semula berulang kali.', 'Jumping straight into code without clear requirements, then rewriting repeatedly.'],
        ['Mencampurkan `print` dan `io.read` di dalam logik, menjadikannya sukar diuji.', 'Mixing `print` and `io.read` into the logic, making it hard to test.'],
        ['Memanggil fungsi `local` sebelum ia ditakrifkan.', 'Calling a `local` function before it is defined.'],
        ['Membandingkan string daripada `io.read` dengan nombor.', 'Comparing a string from `io.read` with a number.'],
      )),
    S('debugging',
      P('Dua ralat yang paling biasa dalam peringkat reka bentuk ini telah ditunjukkan: memanggil fungsi sebelum definisinya (`attempt to call a nil value (global …)`), dan membandingkan string dengan nombor. Untuk ralat logik — program berjalan tetapi petunjuk salah — gunakan senarai tekaan tetap dan bandingkan output dengan jangkaan yang anda tulis di atas kertas. Fungsi petunjuk "hangat/sejuk" di bawah sering ditulis dengan susunan syarat yang salah; uji setiap jalur:',
        'The two most common errors at this design stage have been shown: calling a function before its definition (`attempt to call a nil value (global …)`), and comparing a string with a number. For logic errors — the program runs but the hints are wrong — use a fixed guess list and compare the output with expectations you wrote on paper. The "warm/cold" hint function below is often written with its conditions in the wrong order; test every band:'),
      CODE('warm-cold', 'lua', 'lua54', ['Petunjuk jarak', 'A distance hint'], `
local function hint(guess, secret)
  local distance = math.abs(guess - secret)
  if distance == 0 then return "correct"
  elseif distance <= 5 then return "very warm"
  elseif distance <= 15 then return "warm"
  end
  return "cold"
end

for _, g in ipairs({42, 45, 30, 90}) do print(g, hint(g, 42)) end
`, '42\tcorrect\n45\tvery warm\n30\twarm\n90\tcold'),
      EXPLAIN('warm-cold',
        ['1–2', 'Jarak mutlak: arah tidak penting untuk petunjuk ini.', 'The absolute distance: direction does not matter for this hint.'],
        ['3–7', 'Jalur paling sempit diperiksa **dahulu**. Jika `<= 15` diperiksa sebelum `<= 5`, "very warm" tidak akan pernah dicapai.', 'The narrowest band is checked **first**. If `<= 15` were checked before `<= 5`, "very warm" could never be reached.'],
        ['10', 'Satu ujian bagi setiap jalur: 0, 3, 12 dan 48.', 'One test per band: 0, 3, 12 and 48.'])),
    S('performance',
      P('Prestasi tidak menjadi isu untuk permainan ini: setiap tekaan ialah beberapa perbandingan. Yang penting ialah kecekapan **pemain** — ⌈log₂ n⌉ — yang kita gunakan untuk menetapkan had percubaan. Ini contoh bagaimana analisis algoritma mempengaruhi reka bentuk produk, bukan hanya kelajuan kod.',
        'Performance is not an issue for this game: each guess is a few comparisons. What matters is the **player’s** efficiency — ⌈log₂ n⌉ — which we used to set the attempt limit. This is an example of algorithm analysis shaping product design, not just code speed.')),
    S('software_engineering',
      P('Bandingkan logik yang terikat dengan nombor ajaib dengan fungsi yang dipacu peraturan:', 'Compare logic tied to magic numbers with a rule-driven function:'),
      CODE('poor-magic-numbers', 'lua', 'lua54', ['Pelaksanaan lemah: nombor ajaib dan petunjuk bercampur', 'Poor implementation: magic numbers and mixed-in hints'], `
local secret = 42
for _, g in ipairs({60, 0, 42}) do
  if g > 100 or g < 1 then
    print(g, "out of range")
  elseif g == 42 then
    print(g, "correct")
  else
    print(g, g < 42 and "higher" or "lower")
  end
end
`, '60\tlower\n0\tout of range\n42\tcorrect'),
      EXPLAIN('poor-magic-numbers',
        ['1–2', '`secret` diisytiharkan tetapi tidak digunakan — 42 ditulis semula di dalam syarat.', '`secret` is declared but unused — 42 is written again inside the conditions.'],
        ['3–9', '1, 100 dan 42 tersebar dalam kod; menukar rahsia atau julat memerlukan suntingan di beberapa tempat, dan logik tidak boleh diuji secara berasingan.', '1, 100 and 42 are scattered through the code; changing the secret or range needs edits in several places, and the logic cannot be tested separately.']),
      CODE('improved-feedback', 'lua', 'lua54', ['Pelaksanaan lebih baik: peraturan dan fungsi tulen', 'Improved implementation: rules and a pure function'], `
local RULES = {min = 1, max = 100}

local function feedback(guess, secret)
  if guess < RULES.min or guess > RULES.max then return "out of range" end
  if guess == secret then return "correct" end
  return guess < secret and "higher" or "lower"
end

for _, g in ipairs({60, 0, 42}) do print(g, feedback(g, 42)) end
`, '60\tlower\n0\tout of range\n42\tcorrect'),
      EXPLAIN('improved-feedback',
        ['1', 'Julat ditakrifkan sekali.', 'The range is defined once.'],
        ['3–7', 'Klausa pengawal untuk julat, kemudian betul, kemudian arah. Idiom `and/or` selamat di sini kerana "higher" tidak pernah `false`/`nil` (kuliah 1.3).', 'A guard clause for the range, then correct, then direction. The `and/or` idiom is safe here because "higher" is never `false`/`nil` (lecture 1.3).'],
        ['9', 'Rahsia ialah argumen — fungsi boleh diuji dengan sebarang rahsia.', 'The secret is an argument — the function can be tested with any secret.'])),
    S('industry_use_cases',
      UL(
        ['Pasukan perisian menulis keperluan sebagai "user stories" dengan kriteria penerimaan yang boleh diuji.', 'Software teams write requirements as user stories with testable acceptance criteria.'],
        ['Pereka permainan menala kesukaran dengan table peraturan dan bukannya menyunting logik.', 'Game designers tune difficulty with rule tables instead of editing logic.'],
        ['Carian binari digunakan dalam `git bisect` untuk mencari commit yang memperkenalkan pepijat.', 'Binary search is used in `git bisect` to find the commit that introduced a bug.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis keperluan ke-5 anda sendiri (contohnya "beri amaran pada percubaan terakhir") dan pseudocodenya.', 'Write your own 5th requirement (for example "warn on the last attempt") and its pseudocode.'],
        ['Tukar `RULES.max` dalam `rules-table` kepada 1000 dan ramalkan output sebelum menjalankan.', 'Change `RULES.max` in `rules-table` to 1000 and predict the output before running.'],
        ['Jalankan kedua-dua versi berpepijat dan baiki setiap satu.', 'Run both buggy versions and fix each one.'],
      )),
    S('mini_project',
      P('**Dokumen reka bentuk sebagai kod.** Tulis keperluan sebagai table dan semak bahawa setiap satu mempunyai sekurang-kurangnya satu kes ujian.', '**A design document as code.** Write the requirements as a table and check that each one has at least one test case.'),
      CODE('requirements-check', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local requirements = {
  {id = "R1", text = "secret is a random integer in range", tests = 1},
  {id = "R2", text = "each guess gets higher/lower/correct", tests = 3},
  {id = "R3", text = "invalid input is rejected", tests = 0},
  {id = "R4", text = "game ends on win or no attempts left", tests = 2},
}

local missing = 0
for _, r in ipairs(requirements) do
  local status = r.tests > 0 and "ok" or "NO TESTS"
  if r.tests == 0 then missing = missing + 1 end
  print(r.id, status, r.text)
end
print(missing .. " requirement(s) without tests")
`, 'R1\tok\tsecret is a random integer in range\nR2\tok\teach guess gets higher/lower/correct\nR3\tNO TESTS\tinvalid input is rejected\nR4\tok\tgame ends on win or no attempts left\n1 requirement(s) without tests'),
      EXPLAIN('requirements-check',
        ['1–6', 'Setiap keperluan ialah table dengan ID, penerangan dan bilangan ujian yang dirancang.', 'Each requirement is a table with an ID, a description and the number of planned tests.'],
        ['8', 'Pengira keperluan tanpa ujian.', 'A counter of requirements without tests.'],
        ['9–13', 'Semak dan laporkan setiap keperluan; R3 belum mempunyai ujian — kuliah 4.2 akan menutup jurang ini.', 'Check and report every requirement; R3 has no test yet — lecture 4.2 will close this gap.'],
        ['14', 'Ringkasan jurang ujian.', 'A summary of the test gaps.'])),
    S('summary',
      UL(
        ['Keperluan yang baik boleh diuji; setiap satu menjadi fungsi atau cabang.', 'Good requirements are testable; each becomes a function or a branch.'],
        ['Pseudocode menjembatani idea dan sintaks.', 'Pseudocode bridges ideas and syntax.'],
        ['Pisahkan logik tulen daripada I/O; uji logik dengan data tetap.', 'Separate pure logic from I/O; test the logic with fixed data.'],
        ['Carian binari memerlukan ⌈log₂ n⌉ tekaan — asas had percubaan yang adil.', 'Binary search needs ⌈log₂ n⌉ guesses — the basis of a fair attempt limit.'],
      )),
    S('knowledge_check',
      OL(
        ['Tulis semula "permainan mesti mesra pengguna" sebagai keperluan yang boleh diuji.', 'Rewrite "the game must be user-friendly" as a testable requirement.'],
        ['Mengapakah `checkGuess` tidak memanggil `print`?', 'Why does `checkGuess` not call `print`?'],
        ['Berapa tekaan diperlukan oleh carian binari untuk julat 1–500?', 'How many guesses does binary search need for the range 1–500?'],
        ['Apakah yang berlaku jika anda membandingkan `io.read("l")` terus dengan nombor?', 'What happens if you compare `io.read("l")` directly with a number?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.4.4 — Relational Operators', url: `${MANUAL}#3.4.4` },
        { title: 'Lua 5.4 Reference Manual — math.log and math.ceil', url: `${MANUAL}#pdf-math.log` },
        { title: 'Programming in Lua (1st ed.) — 5 Functions', url: `${PIL}/5.html` },
        { title: 'Khan Academy — Binary search', url: 'https://www.khanacademy.org/computing/computer-science/algorithms/binary-search/a/binary-search' },
      )),
  ],
};

// ─── 4.2 math.random, math.randomseed and input validation ─────────────────

export const LUA103_4_2: LectureContentDef = {
  courseCode: 'LUA103',
  module: 4,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan tiga bentuk `math.random`: `()`, `(m)` dan `(m, n)`.', 'Use the three forms of `math.random`: `()`, `(m)` and `(m, n)`.'],
        ['Menerangkan nombor [[pseudo-random]] dan peranan `math.randomseed`.', 'Explain [[pseudo-random]] numbers and the role of `math.randomseed`.'],
        ['Mengesahkan input pengguna: nombor, integer, dan dalam julat.', 'Validate user input: numeric, integer, and in range.'],
        ['Menyuntik sumber rawak (dependency injection) supaya kod boleh diuji.', 'Inject the random source (dependency injection) so code is testable.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1: keperluan dan fungsi `checkGuess`.', 'Lecture 4.1: the requirements and the `checkGuess` function.'],
        ['LUA102: `tonumber`, `math.type`, nilai pulangan `nil, mesej`.', 'LUA102: `tonumber`, `math.type`, `nil, message` return values.'],
      )),
    S('introduction',
      P('Permainan memerlukan nombor rahsia yang tidak dapat diramal oleh pemain, dan ia mesti tahan terhadap input yang pelik: "abc", "7.5", "150", atau baris kosong. Kuliah ini mengisi dua keperluan yang tinggal daripada 4.1: R1 (rahsia rawak dalam julat) dan R3 (input tidak sah ditolak). Kita juga belajar mengapa nombor "rawak" komputer sebenarnya boleh diulang — dan bagaimana sifat itu menjadikan ujian mungkin.',
        'The game needs a secret number the player cannot predict, and it must survive odd input: "abc", "7.5", "150", or an empty line. This lecture fills the two remaining requirements from 4.1: R1 (a random secret in range) and R3 (invalid input is rejected). We also learn why a computer’s "random" numbers are actually repeatable — and how that property makes testing possible.'),
      KEY('Benih yang sama → jujukan yang sama. Gunakan benih tetap untuk ujian, dan benih berubah (contohnya masa) untuk permainan sebenar.', 'The same seed → the same sequence. Use a fixed seed for tests, and a changing seed (for example the time) for real play.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`math.random()` → float dalam [0, 1).', '`math.random()` → a float in [0, 1).'],
        ['`math.random(m)` → integer dalam [1, m]; `math.random(m, n)` → integer dalam [m, n].', '`math.random(m)` → an integer in [1, m]; `math.random(m, n)` → an integer in [m, n].'],
        ['`math.randomseed(x)` menetapkan keadaan penjana; `x` mesti integer (atau float dengan nilai integer).', '`math.randomseed(x)` sets the generator’s state; `x` must be an integer (or a float with an integer value).'],
        ['Lua 5.4 menyemai penjana secara rawak semasa permulaan, jadi tanpa `randomseed` setiap larian berbeza.', 'Lua 5.4 seeds the generator randomly at start-up, so without `randomseed` every run differs.'],
        ['Pengesahan input: `tonumber` → `nil` jika bukan nombor; `math.type` → "integer" atau "float"; kemudian semak julat.', 'Input validation: `tonumber` → `nil` if not a number; `math.type` → "integer" or "float"; then check the range.'],
      )),
    S('detailed_theory',
      P('Komputer adalah deterministik, jadi `math.random` tidak menghasilkan kerawakan sebenar. Lua 5.4 menggunakan algoritma **xoshiro256\\*\\***: keadaan dalaman 256-bit diubah dengan operasi bit pada setiap panggilan, menghasilkan jujukan yang kelihatan rawak secara statistik. Jujukan itu ditentukan sepenuhnya oleh **benih** (seed). `math.randomseed(7)` sentiasa memulakan jujukan yang sama — dalam pelayar dan dalam penterjemah rujukan. Ini [[pseudo-random|pseudo-rawak]]: cukup baik untuk permainan dan simulasi, tetapi **tidak** selamat untuk kata laluan atau kriptografi.',
        'Computers are deterministic, so `math.random` does not produce true randomness. Lua 5.4 uses the **xoshiro256\\*\\*** algorithm: a 256-bit internal state is transformed with bit operations on every call, producing a sequence that looks statistically random. The sequence is fully determined by the **seed**. `math.randomseed(7)` always starts the same sequence — in the browser and in the reference interpreter. This is [[pseudo-random]]: good enough for games and simulations, but **not** safe for passwords or cryptography.'),
      P('Pengesahan input mengikut prinsip "jangan percaya input": semak jenis, kemudian bentuk, kemudian julat, dan pulangkan mesej yang jelas pada kegagalan pertama. Corak `return nil, mesej` (LUA102) membolehkan pemanggil memutuskan sama ada untuk meminta semula atau berhenti. Akhir sekali, **dependency injection** bermaksud fungsi menerima sumber rawaknya sebagai argumen: dalam permainan sebenar kita hantar `math.random`; dalam ujian kita hantar fungsi yang memulangkan nilai tetap. Logik yang sama boleh diuji tanpa bergantung pada nasib.',
        'Input validation follows the "never trust input" principle: check the type, then the shape, then the range, and return a clear message on the first failure. The `return nil, message` pattern (LUA102) lets the caller decide whether to ask again or stop. Finally, **dependency injection** means a function receives its random source as an argument: in the real game we pass `math.random`; in tests we pass a function returning a fixed value. The same logic can be tested without relying on luck.')),
    S('technical_terminology', TERMS('pseudo-random', 'function', 'standard-input', 'number-subtype')),
    S('syntax_rules',
      UL(
        ['`math.random(m, n)` memerlukan `m <= n`; jika tidak: `interval is empty`.', '`math.random(m, n)` requires `m <= n`; otherwise: `interval is empty`.'],
        ['`math.randomseed(n)` dengan float bukan integer (seperti 3.5) ialah ralat.', '`math.randomseed(n)` with a non-integral float (such as 3.5) is an error.'],
        ['`tonumber(s)` menerima ruang di sekeliling, heksadesimal (`"0x1F"`) dan eksponen (`"1e2"` → float 100.0).', '`tonumber(s)` accepts surrounding spaces, hexadecimal (`"0x1F"`) and exponents (`"1e2"` → float 100.0).'],
      )),
    S('code_demonstration',
      CODE('seeded-dice', 'lua', 'lua54', ['Jujukan yang boleh diulang', 'A repeatable sequence'], `
math.randomseed(7)
local rolls = {}
for i = 1, 6 do
  rolls[i] = math.random(1, 6)
end
print(table.concat(rolls, " "))
`, '3 2 2 6 6 6'),
      EXPLAIN('seeded-dice',
        ['1', 'Benih tetap: setiap larian (dalam mana-mana pelaksanaan Lua 5.4) menghasilkan jujukan yang sama.', 'A fixed seed: every run (on any Lua 5.4 implementation) produces the same sequence.'],
        ['2–5', 'Enam lontaran dadu, setiap satu integer dalam [1, 6].', 'Six dice rolls, each an integer in [1, 6].'],
        ['6', 'Tiga enam berturut-turut kelihatan "tidak rawak", tetapi jujukan rawak sebenar juga mempunyai rentetan seperti ini.', 'Three sixes in a row look "non-random", but truly random sequences have streaks like this too.'])),
    S('complete_examples',
      CODE('random-forms', 'lua', 'lua54', ['Tiga bentuk math.random', 'The three forms of math.random'], `
math.randomseed(7)
local a = math.random(1, 100)
local b = math.random(10)
local x = math.random()
print(a, b)
print(x >= 0 and x < 1, math.type(x))
`, '64\t8\ntrue\tfloat', {
        debug: BUG(`
local low, high = 100, 1
math.randomseed(7)
print(math.random(low, high))
`, "example:3: bad argument #1 to 'random' (interval is empty)",
          'Had tertukar: julat [100, 1] kosong. Ralat menyebut argumen #1 kerana Lua menyemak `low <= high` dan melaporkan argumen pertama. Pepijat ini biasa apabila had dibaca daripada konfigurasi atau input. Sahkan `low <= high` sebelum memanggil, atau tukar dengan `low, high = math.min(low, high), math.max(low, high)`.',
          'The limits are swapped: the range [100, 1] is empty. The error names argument #1 because Lua checks `low <= high` and reports the first argument. This bug is common when the limits are read from configuration or input. Validate `low <= high` before calling, or swap with `low, high = math.min(low, high), math.max(low, high)`.'),
      }),
      EXPLAIN('random-forms',
        ['1', 'Benih yang sama seperti `seeded-dice`, tetapi panggilan yang berbeza menghasilkan nilai yang berbeza.', 'The same seed as `seeded-dice`, but different calls produce different values.'],
        ['2', 'Integer dalam [1, 100].', 'An integer in [1, 100].'],
        ['3', 'Integer dalam [1, 10].', 'An integer in [1, 10].'],
        ['4', 'Float dalam [0, 1). Nilai tepatnya tidak dicetak kerana format float boleh berbeza antara platform.', 'A float in [0, 1). Its exact value is not printed because float formatting can differ between platforms.'],
        ['5–6', 'Semak sifatnya, bukan nilainya.', 'Check its properties, not its value.']),
      CODE('parse-guess', 'lua', 'lua54', ['Mengesahkan input tekaan', 'Validating guess input'], `
local function parseGuess(text, min, max)
  local n = tonumber(text)
  if n == nil then return nil, "not a number" end
  if math.type(n) ~= "integer" then return nil, "whole numbers only" end
  if n < min or n > max then return nil, "out of range" end
  return n
end

while true do
  local line = io.read("l")
  if line == nil then break end
  print(line, parseGuess(line, 1, 100))
end
`, '42\t42\nabc\tnil\tnot a number\n7.5\tnil\twhole numbers only\n150\tnil\tout of range\n08\t8', { input: '42\nabc\n7.5\n150\n08\n' }),
      EXPLAIN('parse-guess',
        ['1–2', 'Tukar teks kepada nombor; `tonumber` memulangkan `nil` jika gagal.', 'Convert the text to a number; `tonumber` returns `nil` on failure.'],
        ['3', 'Semakan 1 — jenis: bukan nombor.', 'Check 1 — type: not a number.'],
        ['4', 'Semakan 2 — bentuk: "7.5" ialah nombor tetapi bukan integer.', 'Check 2 — shape: "7.5" is a number but not an integer.'],
        ['5', 'Semakan 3 — julat.', 'Check 3 — range.'],
        ['6', 'Semua semakan lulus: pulangkan integer.', 'All checks pass: return the integer.'],
        ['9–13', 'Baca setiap baris input sehingga tamat dan paparkan keputusan. "08" diterima sebagai 8.', 'Read every input line until the end and display the result. "08" is accepted as 8.'])),
    S('line_by_line',
      EXPLAIN('parse-guess',
        ['3', 'Susunan penting: `math.type(nil)` memulangkan `nil` dan bukan ralat, tetapi `nil < min` **ialah** ralat — jadi semakan `nil` mesti datang sebelum semakan julat.', 'Order matters: `math.type(nil)` returns `nil` rather than an error, but `nil < min` **is** an error — so the `nil` check must come before the range check.']),
      EXPLAIN('random-forms',
        ['3', '`math.random(10)` ialah singkatan untuk `math.random(1, 10)`.', '`math.random(10)` is shorthand for `math.random(1, 10)`.'])),
    S('why_this_way',
      P('Mengapa benih tetap dalam bahan ini? Kerana contoh yang mencetak nilai rawak berbeza pada setiap larian tidak boleh disahkan. Dengan `math.randomseed(7)`, output dijamin sama dalam pelayar dan dalam penterjemah rujukan — dan setiap contoh di sini telah disahkan begitu. Dalam permainan sebenar, buang benih tetap (Lua 5.4 sudah menyemai secara rawak) atau gunakan `os.time()`.',
        'Why fixed seeds in these materials? Because an example that prints different random values on every run cannot be verified. With `math.randomseed(7)`, the output is guaranteed to be the same in the browser and in the reference interpreter — and every example here has been verified that way. In a real game, remove the fixed seed (Lua 5.4 already seeds randomly) or use `os.time()`.'),
      WARN('Jangan gunakan `math.random` untuk kata laluan, token atau apa-apa yang berkaitan keselamatan. Gunakan sumber rawak kriptografi sistem pengendalian.', 'Never use `math.random` for passwords, tokens or anything security-related. Use the operating system’s cryptographic random source.', ['Keselamatan', 'Security'])),
    S('execution_flow',
      OL(
        ['`parse-guess` membaca "abc": `tonumber("abc")` → `nil` → pulang `nil, "not a number"` pada baris 3.', '`parse-guess` reads "abc": `tonumber("abc")` → `nil` → return `nil, "not a number"` on line 3.'],
        ['"7.5": `tonumber` → 7.5 (float) → `math.type` ialah "float" → pulang pada baris 4.', '"7.5": `tonumber` → 7.5 (a float) → `math.type` is "float" → return on line 4.'],
        ['"150": integer, tetapi 150 > 100 → pulang pada baris 5.', '"150": an integer, but 150 > 100 → return on line 5.'],
        ['Selepas "08", `io.read` memulangkan `nil` → `break`.', 'After "08", `io.read` returns `nil` → `break`.'],
      )),
    S('memory_behaviour',
      P('Penjana nombor rawak menyimpan keadaannya (empat integer 64-bit) dalam keadaan Lua — satu sahaja untuk seluruh program. Itulah sebabnya `math.randomseed` di satu tempat mempengaruhi setiap panggilan `math.random` di tempat lain. Fungsi yang disuntik (seperti dalam bahagian Alternatif) tidak berkongsi keadaan ini.',
        'The random generator keeps its state (four 64-bit integers) in the Lua state — just one for the whole program. That is why `math.randomseed` in one place affects every `math.random` call elsewhere. An injected function (as in the Alternatives section) does not share this state.')),
    S('alternative_implementations',
      P('Suntik sumber rawak supaya pemilihan rahsia boleh diuji:', 'Inject the random source so secret selection is testable:'),
      CODE('inject-rng', 'lua', 'lua54', ['Dependency injection untuk rawak', 'Dependency injection for randomness'], `
local function makeSecret(rng, min, max)
  return rng(min, max)
end

local function alwaysFortyTwo() return 42 end
print(makeSecret(alwaysFortyTwo, 1, 100))

math.randomseed(2024)
print(makeSecret(math.random, 1, 100))
`, '42\n74'),
      EXPLAIN('inject-rng',
        ['1–3', '`makeSecret` tidak tahu dari mana nombor datang; ia memanggil fungsi `rng` yang diberi.', '`makeSecret` does not know where numbers come from; it calls the `rng` function it is given.'],
        ['5–6', 'Dalam ujian: sumber palsu yang sentiasa memulangkan 42.', 'In tests: a fake source that always returns 42.'],
        ['8–9', 'Dalam permainan: `math.random` sebenar (benih tetap di sini hanya supaya contoh ini boleh disahkan).', 'In the game: the real `math.random` (the fixed seed here is only so this example can be verified).'])),
    S('common_mistakes',
      UL(
        ['Memanggil `math.randomseed` di dalam gelung — setiap panggilan memulakan semula jujukan yang sama.', 'Calling `math.randomseed` inside a loop — each call restarts the same sequence.'],
        ['Menganggap `math.random(10)` termasuk 0.', 'Assuming `math.random(10)` includes 0.'],
        ['Menggunakan hasil `tonumber` tanpa menyemak `nil`.', 'Using the result of `tonumber` without checking for `nil`.'],
        ['Menerima "7.5" sebagai tekaan kerana lupa menyemak `math.type`.', 'Accepting "7.5" as a guess because `math.type` was not checked.'],
      )),
    S('debugging',
      P('Pepijat input yang paling biasa ialah menggunakan hasil `tonumber` tanpa menyemaknya: input bukan nombor menjadi `nil`, dan perbandingan seterusnya gagal dengan `attempt to compare nil with number`. Pepijat rawak yang biasa ialah benih yang tidak sah — `math.randomseed` dalam Lua 5.4 menolak float yang bukan integer. Jika keputusan "rawak" anda sentiasa sama, cari `randomseed` dengan nilai tetap atau di dalam gelung. Contoh di bawah memilih perkataan rawak, dengan dua versi berpepijat:',
        'The most common input bug is using the result of `tonumber` without checking it: non-numeric input becomes `nil`, and the next comparison fails with `attempt to compare nil with number`. A common randomness bug is an invalid seed — `math.randomseed` in Lua 5.4 rejects non-integral floats. If your "random" results are always the same, look for `randomseed` with a fixed value or inside a loop. The example below picks a random word, followed by two buggy versions:'),
      CODE('random-word', 'lua', 'lua54', ['Memilih elemen rawak', 'Picking a random element'], `
math.randomseed(12)
local words = {"lua", "table", "loop", "string"}
local index = math.random(#words)
print(index, words[index])
`, '4\tstring', {
        debug: BUG(`
local seed = 7 / 2
math.randomseed(seed)
print(math.random(1, 6))
`, "example:2: bad argument #1 to 'randomseed' (number has no integer representation)",
          '`7 / 2` ialah 3.5 — pembahagian `/` sentiasa menghasilkan float. `math.randomseed` dalam Lua 5.4 memerlukan nilai yang boleh menjadi integer, jadi 3.5 ditolak. Gunakan `7 // 2` (integer 3), atau `math.floor`.',
          '`7 / 2` is 3.5 — `/` division always produces a float. `math.randomseed` in Lua 5.4 needs a value with an integer representation, so 3.5 is rejected. Use `7 // 2` (the integer 3), or `math.floor`.'),
      }),
      EXPLAIN('random-word',
        ['1–2', 'Benih tetap dan senarai perkataan.', 'A fixed seed and a word list.'],
        ['3', '`math.random(#words)` → indeks dalam [1, 4] — sentiasa sah untuk senarai ini.', '`math.random(#words)` → an index in [1, 4] — always valid for this list.'],
        ['4', 'Indeks dan perkataan yang dipilih.', 'The chosen index and word.']),
      CODE('unchecked-tonumber', 'lua', 'lua54', ['Menyemak hasil tonumber', 'Checking the result of tonumber'], `
local text = "ten"
local n = tonumber(text)
if n == nil then
  print("please type digits, e.g. 10")
elseif n < 1 then
  print("too small")
end
`, 'please type digits, e.g. 10', {
        debug: BUG(`
local text = "ten"
local n = tonumber(text)
if n < 1 then print("too small") end
`, 'example:3: attempt to compare nil with number',
          '`tonumber("ten")` memulangkan `nil` — Lua tidak memahami nombor dalam perkataan. Perbandingan `nil < 1` kemudian gagal. Sentiasa semak `nil` sebelum menggunakan hasil `tonumber`, seperti versi asal.',
          '`tonumber("ten")` returns `nil` — Lua does not understand numbers written as words. The comparison `nil < 1` then fails. Always check for `nil` before using the result of `tonumber`, as in the original version.'),
      }),
      EXPLAIN('unchecked-tonumber',
        ['1–2', 'Input yang bukan digit menjadi `nil`.', 'Input that is not digits becomes `nil`.'],
        ['3–6', 'Semakan `nil` didahulukan; hanya selepas itu `n` dibandingkan.', 'The `nil` check comes first; only then is `n` compared.'])),
    S('performance',
      P('`math.random` sangat pantas (beberapa nanosaat), jadi jutaan panggilan dalam simulasi tidak menjadi masalah. `math.randomseed` lebih mahal dan tidak perlu dipanggil lebih daripada sekali. Untuk mengesahkan bahawa penjana adil, kira kekerapan dalam bilangan sampel yang besar — seperti dalam projek mini.',
        '`math.random` is very fast (a few nanoseconds), so millions of calls in a simulation are no problem. `math.randomseed` is more expensive and never needs calling more than once. To check that the generator is fair, count frequencies over a large number of samples — as in the mini project.')),
    S('software_engineering',
      P('Memanggil `randomseed` di tempat yang salah merosakkan kerawakan sepenuhnya:', 'Calling `randomseed` in the wrong place ruins randomness completely:'),
      CODE('poor-reseed-loop', 'lua', 'lua54', ['Pelaksanaan lemah: semai semula dalam gelung', 'Poor implementation: reseeding inside a loop'], `
local values = {}
for i = 1, 5 do
  math.randomseed(99)
  values[i] = math.random(1, 10)
end
print(table.concat(values, " "))
`, '6 6 6 6 6'),
      EXPLAIN('poor-reseed-loop',
        ['1–5', 'Setiap pusingan memulakan semula jujukan pada titik yang sama, jadi nilai pertama yang sama diambil lima kali. (Dengan `os.time()` sebagai benih, pepijat yang sama berlaku kerana masa tidak berubah dalam sesaat.)', 'Every pass restarts the sequence at the same point, so the same first value is taken five times. (With `os.time()` as the seed, the same bug happens because the time does not change within a second.)'],
        ['6', 'Lima nilai yang sama.', 'Five identical values.']),
      CODE('improved-seed-once', 'lua', 'lua54', ['Pelaksanaan lebih baik: semai sekali', 'Improved implementation: seed once'], `
math.randomseed(99)
local values = {}
for i = 1, 5 do values[i] = math.random(1, 10) end
print(table.concat(values, " "))
`, '6 5 4 10 4'),
      EXPLAIN('improved-seed-once',
        ['1', 'Semai **sekali**, pada permulaan program.', 'Seed **once**, at the start of the program.'],
        ['2–4', 'Jujukan berterusan — nilai pertama sama (6), dan yang lain berbeza.', 'The sequence continues — the first value is the same (6), and the rest vary.'])),
    S('industry_use_cases',
      UL(
        ['Permainan menyimpan benih supaya "replay" atau dunia yang dijana boleh dihasilkan semula tepat.', 'Games store seeds so replays or generated worlds can be reproduced exactly.'],
        ['Simulasi saintifik merekod benih supaya keputusan boleh diulang oleh penyelidik lain.', 'Scientific simulations record seeds so results can be reproduced by other researchers.'],
        ['Borang web mengesahkan setiap medan (jenis, bentuk, julat) sebelum menyimpan.', 'Web forms validate every field (type, shape, range) before saving.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tukar benih dalam `seeded-dice` dan jalankan dua kali — adakah output sama setiap kali?', 'Change the seed in `seeded-dice` and run it twice — is the output the same each time?'],
        ['Tambah input "1e2" dan "  9  " kepada `parse-guess` dan ramalkan keputusannya.', 'Add the inputs "1e2" and "  9  " to `parse-guess` and predict the results.'],
        ['Jalankan ketiga-tiga versi berpepijat.', 'Run all three buggy versions.'],
      )),
    S('mini_project',
      P('**Ujian keadilan dadu.** Lontar dadu 600 kali dan kira kekerapan setiap muka. Dadu yang adil memberi kira-kira 100 setiap muka — tetapi tidak tepat 100.', '**A dice fairness test.** Roll a die 600 times and count how often each face appears. A fair die gives about 100 per face — but not exactly 100.'),
      CODE('dice-stats', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
math.randomseed(1)
local counts = {0, 0, 0, 0, 0, 0}
for _ = 1, 600 do
  local face = math.random(6)
  counts[face] = counts[face] + 1
end
for face = 1, 6 do print(face, counts[face]) end
`, '1\t87\n2\t101\n3\t109\n4\t75\n5\t101\n6\t127'),
      EXPLAIN('dice-stats',
        ['1–2', 'Benih tetap dan satu pengira bagi setiap muka.', 'A fixed seed and one counter per face.'],
        ['3–6', 'Muka yang dilontar digunakan terus sebagai indeks pengira.', 'The rolled face is used directly as the counter index.'],
        ['7', 'Kekerapan antara 75 dan 127 — variasi biasa untuk 600 sampel. Dengan 600 000 lontaran, setiap kiraan akan jauh lebih hampir kepada 1/6.', 'Frequencies between 75 and 127 — normal variation for 600 samples. With 600,000 rolls, every count would be much closer to 1/6.'])),
    S('summary',
      UL(
        ['`math.random()`, `(m)`, `(m, n)` — float [0,1), integer [1,m], integer [m,n].', '`math.random()`, `(m)`, `(m, n)` — float [0,1), integer [1,m], integer [m,n].'],
        ['Benih yang sama memberi jujukan yang sama; semai sekali sahaja.', 'The same seed gives the same sequence; seed only once.'],
        ['Sahkan input mengikut susunan: nombor → integer → julat.', 'Validate input in order: number → integer → range.'],
        ['Suntik sumber rawak supaya logik boleh diuji dengan nilai tetap.', 'Inject the random source so the logic can be tested with fixed values.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah julat nilai `math.random(6)`?', 'What is the range of `math.random(6)`?'],
        ['Mengapakah semai semula dalam gelung menghasilkan nilai berulang?', 'Why does reseeding inside a loop produce repeated values?'],
        ['Apakah yang dipulangkan oleh `parseGuess("7.5", 1, 100)`?', 'What does `parseGuess("7.5", 1, 100)` return?'],
        ['Mengapakah `math.random` tidak sesuai untuk kata laluan?', 'Why is `math.random` unsuitable for passwords?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual — math.random', url: `${MANUAL}#pdf-math.random` },
        { title: 'Lua 5.4 Reference Manual — math.randomseed', url: `${MANUAL}#pdf-math.randomseed` },
        { title: 'Lua 5.4 Reference Manual — tonumber', url: `${MANUAL}#pdf-tonumber` },
        { title: 'Blackman & Vigna — xoshiro / xoroshiro generators', url: 'https://prng.di.unimi.it/' },
      )),
  ],
};

// ─── 4.3 Building, testing and improving the game ──────────────────────────

export const LUA103_4_3: LectureContentDef = {
  courseCode: 'LUA103',
  module: 4,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Memasang permainan teka nombor yang lengkap daripada fungsi yang telah diuji.', 'Assemble the complete number guessing game from tested functions.'],
        ['Menulis ujian automatik dengan `assert` dan jadual kes ujian.', 'Write automated tests with `assert` and a table of test cases.'],
        ['Menguji interaksi dengan pembaca input berskrip.', 'Test interaction with a scripted input reader.'],
        ['Menambah baik permainan secara berperingkat tanpa merosakkan tingkah laku sedia ada.', 'Improve the game step by step without breaking existing behaviour.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1 dan 4.2: keperluan, `checkGuess`, `parseGuess`, dependency injection.', 'Lectures 4.1 and 4.2: requirements, `checkGuess`, `parseGuess`, dependency injection.'],
        ['LUA102: `assert`, fungsi sebagai nilai.', 'LUA102: `assert`, functions as values.'],
      )),
    S('introduction',
      P('Kini semua bahagian sudah ada. Kuliah ini memasangnya menjadi permainan yang lengkap, kemudian melakukan apa yang membezakan program amatur daripada perisian profesional: **ujian automatik**. Kita menulis jadual kes ujian, menjalankan permainan dengan input berskrip, dan kemudian menambah ciri — tahap kesukaran dan skor terbaik — sambil memastikan ujian lama masih lulus.',
        'All the pieces now exist. This lecture assembles them into a complete game, then does what separates amateur programs from professional software: **automated testing**. We write a table of test cases, run the game with scripted input, and then add features — difficulty levels and a best score — while making sure the old tests still pass.'),
      KEY('Uji → ubah → uji semula. Ujian ialah jaring keselamatan untuk setiap penambahbaikan.', 'Test → change → test again. Tests are the safety net for every improvement.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Kes ujian:** input + output yang dijangka.', '**Test case:** an input + the expected output.'],
        ['**Ujian dipacu jadual:** banyak kes dalam satu table, satu gelung untuk menjalankannya.', '**Table-driven tests:** many cases in one table, one loop to run them.'],
        ['**Pembaca berskrip:** fungsi yang memulangkan baris yang ditulis dahulu, menggantikan `io.read` dalam ujian.', '**Scripted reader:** a function that returns pre-written lines, replacing `io.read` in tests.'],
        ['**Ujian regresi:** ujian lama yang dijalankan semula selepas perubahan untuk mengesan kerosakan.', '**Regression test:** old tests re-run after a change to catch breakage.'],
      )),
    S('detailed_theory',
      P('`assert(syarat, mesej)` menghentikan program dengan mesej jika syarat palsu. Dalam Lua 5.4, mesej string menerima awalan kedudukan (`example:8:`), jadi kegagalan menunjuk terus ke baris ujian. Dengan meletakkan kes dalam table — `{tekaan, rahsia, jangkaan}` — menambah ujian bermakna menambah satu baris data, bukan menulis kod baharu. Mesej kegagalan yang baik menyebut nombor kes, nilai yang dijangka dan nilai sebenar.',
        '`assert(condition, message)` stops the program with the message if the condition is false. In Lua 5.4, a string message gets a position prefix (`example:8:`), so a failure points straight at the test line. By putting cases in a table — `{guess, secret, expected}` — adding a test means adding one line of data, not writing new code. A good failure message names the case number, the expected value and the actual value.'),
      P('Untuk menguji gelung permainan itu sendiri, kita perlukan input yang boleh diramal. Kerana permainan menerima fungsi `readLine` (dependency injection, kuliah 4.2), ujian boleh menghantar fungsi yang memulangkan baris daripada senarai, dan `nil` apabila senarai habis — tepat seperti `io.read` pada akhir input. Ini mendedahkan kes tepi yang mudah dilupakan: pemain yang menutup input di tengah permainan. Setiap penambahbaikan seterusnya diikuti dengan menjalankan semua ujian semula; jika ujian lama gagal, perubahan itu memperkenalkan regresi.',
        'To test the game loop itself, we need predictable input. Because the game accepts a `readLine` function (dependency injection, lecture 4.2), a test can pass a function returning lines from a list, and `nil` when the list runs out — exactly like `io.read` at the end of input. This exposes an easily forgotten edge case: a player who closes the input mid-game. Every subsequent improvement is followed by re-running all the tests; if an old test fails, the change introduced a regression.')),
    S('technical_terminology', TERMS('function', 'loop', 'standard-input', 'stack-traceback')),
    S('syntax_rules',
      UL(
        ['`assert(v, mesej)` memulangkan `v` jika benar; jika palsu, ralat dengan `mesej`.', '`assert(v, message)` returns `v` if truthy; if falsy, raises an error with `message`.'],
        ['Kes ujian: `local cases = {{input…, expected}, …}` dan `for i, c in ipairs(cases) do … end`.', 'Test cases: `local cases = {{input…, expected}, …}` and `for i, c in ipairs(cases) do … end`.'],
        ['Fungsi boleh dihantar sebagai argumen: `play(42, reader, 5)`.', 'Functions can be passed as arguments: `play(42, reader, 5)`.'],
      )),
    S('code_demonstration',
      CODE('full-game', 'lua', 'lua54', ['Permainan lengkap dengan input sebenar', 'The complete game with real input'], `
local function playGame(rng, readLine, maxAttempts)
  local secret = rng(1, 100)
  for attempt = 1, maxAttempts do
    local text = readLine()
    if text == nil then return "quit" end
    local guess = tonumber(text)
    if guess == nil then
      print("please type a number")
    elseif guess == secret then
      print("correct in " .. attempt)
      return "won"
    else
      print(guess < secret and "higher" or "lower")
    end
  end
  print("the number was " .. secret)
  return "lost"
end

math.randomseed(2024)
print(playGame(math.random, function() return io.read("l") end, 7))
`, 'higher\nplease type a number\nlower\ncorrect in 4\nwon', { input: '50\nabc\n80\n74\n' }),
      EXPLAIN('full-game',
        ['1–2', 'Permainan menerima sumber rawak, pembaca input dan had percubaan — semuanya boleh diganti dalam ujian.', 'The game receives a random source, an input reader and an attempt limit — all replaceable in tests.'],
        ['3–5', 'Setiap percubaan membaca satu baris; tamat input bermakna pemain berhenti.', 'Each attempt reads one line; end of input means the player quit.'],
        ['6–8', 'Input bukan nombor ditolak (tetapi masih menggunakan satu percubaan dalam versi ini).', 'Non-numeric input is rejected (but still uses an attempt in this version).'],
        ['9–11', 'Betul: laporkan dan pulangkan "won".', 'Correct: report and return "won".'],
        ['12–13', 'Petunjuk arah.', 'A direction hint.'],
        ['16–17', 'Percubaan habis: dedahkan rahsia (keperluan R4).', 'Out of attempts: reveal the secret (requirement R4).'],
        ['20–21', 'Benih 2024 memberi rahsia 74; fungsi tanpa nama membalut `io.read`.', 'Seed 2024 gives the secret 74; an anonymous function wraps `io.read`.'])),
    S('complete_examples',
      CODE('feedback-tests', 'lua', 'lua54', ['Ujian dipacu jadual', 'Table-driven tests'], `
local function feedback(guess, secret)
  if guess == secret then return "correct" end
  return guess < secret and "higher" or "lower"
end

local cases = {
  {10, 42, "higher"},
  {90, 42, "lower"},
  {42, 42, "correct"},
  {1, 1, "correct"},
}
local passed = 0
for i, c in ipairs(cases) do
  local got = feedback(c[1], c[2])
  assert(got == c[3], "case " .. i .. ": expected " .. c[3] .. ", got " .. got)
  passed = passed + 1
end
print(passed .. "/" .. #cases .. " tests passed")
`, '4/4 tests passed', {
        debug: BUG(`
local function feedback(guess, secret)
  return guess <= secret and "higher" or "lower"
end

local cases = {{10, 42, "higher"}, {42, 42, "correct"}}
for i, c in ipairs(cases) do
  local got = feedback(c[1], c[2])
  assert(got == c[3], "case " .. i .. ": expected " .. c[3] .. ", got " .. got)
end
print("all passed")
`, 'example:8: case 2: expected correct, got higher',
          'Seseorang "meringkaskan" fungsi dan membuang semakan sama, lalu menggunakan `<=`. Kes 1 masih lulus, tetapi kes 2 (tekaan sama dengan rahsia) gagal. Inilah tujuan ujian: pepijat ditangkap serta-merta, dengan nombor kes dan kedua-dua nilai, sebelum pemain menemuinya. Pulihkan cabang `guess == secret`.',
          'Someone "simplified" the function by removing the equality check and using `<=`. Case 1 still passes, but case 2 (the guess equals the secret) fails. This is the purpose of tests: the bug is caught immediately, with the case number and both values, before a player finds it. Restore the `guess == secret` branch.'),
      }),
      EXPLAIN('feedback-tests',
        ['1–4', 'Fungsi yang diuji.', 'The function under test.'],
        ['6–11', 'Empat kes: lebih rendah, lebih tinggi, sama, dan kes tepi pada had bawah.', 'Four cases: lower, higher, equal, and an edge case at the lower limit.'],
        ['12–17', 'Jalankan setiap kes; `assert` menghentikan program pada kegagalan pertama dengan mesej yang jelas.', 'Run every case; `assert` stops the program at the first failure with a clear message.'],
        ['18', 'Ringkasan apabila semua lulus.', 'A summary when everything passes.']),
      CODE('scripted-play', 'lua', 'lua54', ['Menguji gelung permainan dengan input berskrip', 'Testing the game loop with scripted input'], `
local function play(secret, readLine, maxAttempts)
  for attempt = 1, maxAttempts do
    local text = readLine()
    if text == nil then return "quit", attempt end
    if text:match("^%d+$") and tonumber(text) == secret then
      return "won", attempt
    end
  end
  return "lost", maxAttempts
end

local function script(lines)
  local i = 0
  return function() i = i + 1 return lines[i] end
end

print(play(42, script({"10", "42"}), 5))
print(play(42, script({"1", "2", "3"}), 3))
print(play(7, script({}), 2))
`, 'won\t2\nlost\t3\nquit\t1', {
        debug: BUG(`
local function play(secret, readLine, maxAttempts)
  for attempt = 1, maxAttempts do
    local text = readLine()
    if text:match("^%d+$") and tonumber(text) == secret then
      return "won", attempt
    end
  end
  return "lost", maxAttempts
end

local function script(lines)
  local i = 0
  return function() i = i + 1 return lines[i] end
end

print(play(7, script({}), 2))
`, "example:4: attempt to index a nil value (local 'text')",
          'Tanpa semakan `text == nil`, pemain yang menutup input (Ctrl+D, atau skrip yang habis) menyebabkan `text:match` dipanggil pada `nil`. Ujian berskrip dengan senarai kosong mendedahkan kes tepi ini dengan serta-merta — sesuatu yang jarang ditemui semasa bermain secara manual.',
          'Without the `text == nil` check, a player who closes the input (Ctrl+D, or a script that runs out) makes `text:match` run on `nil`. A scripted test with an empty list exposes this edge case immediately — something rarely found by playing manually.'),
      }),
      EXPLAIN('scripted-play',
        ['1–4', 'Gelung permainan yang dipermudah; tamat input → "quit" dengan nombor percubaan.', 'A simplified game loop; end of input → "quit" with the attempt number.'],
        ['5–7', 'Hanya digit yang diterima (corak `^%d+$`), kemudian dibandingkan dengan rahsia.', 'Only digits are accepted (the pattern `^%d+$`), then compared with the secret.'],
        ['9', 'Percubaan habis.', 'Out of attempts.'],
        ['12–15', '`script` memulangkan fungsi yang memberi satu baris setiap panggilan, kemudian `nil` — seperti `io.read` pada akhir input. Fungsi yang "mengingati" `i` dipanggil closure; LUA105 menerangkannya dengan mendalam.', '`script` returns a function that yields one line per call, then `nil` — like `io.read` at the end of input. A function that "remembers" `i` is called a closure; LUA105 explains it in depth.'],
        ['17–19', 'Tiga senario: menang, kalah, dan berhenti — semuanya tanpa menaip.', 'Three scenarios: win, lose and quit — all without typing.'])),
    S('line_by_line',
      EXPLAIN('feedback-tests',
        ['15', 'Mesej dibina hanya untuk dipaparkan; ia menyebut kes, jangkaan dan nilai sebenar supaya anda tidak perlu menyahpepijat untuk mengetahui apa yang salah.', 'The message is built only to be displayed; it names the case, the expectation and the actual value so you need not debug to find out what went wrong.']),
      EXPLAIN('full-game',
        ['13', 'Idiom `and/or` selamat kerana "higher" tidak pernah palsu.', 'The `and/or` idiom is safe because "higher" is never falsy.'])),
    S('why_this_way',
      P('Mengapa menulis ujian untuk permainan kecil? Kerana setiap penambahbaikan — tahap, skor, petunjuk hangat/sejuk — menyentuh logik yang sama. Tanpa ujian, setiap perubahan memerlukan anda bermain beberapa pusingan secara manual dan berharap anda mencuba kes yang betul. Dengan ujian, semakan penuh mengambil sesaat dan sentiasa lengkap.',
        'Why write tests for a small game? Because every improvement — levels, scores, warm/cold hints — touches the same logic. Without tests, every change means playing several rounds manually and hoping you tried the right cases. With tests, a full check takes a second and is always complete.'),
      P('Tulis ujian **apabila** anda menulis fungsi logik; jalankannya **setiap kali** anda mengubah kod.', 'Write tests **when** you write a logic function; run them **every time** you change the code.')),
    S('execution_flow',
      OL(
        ['`full-game` dengan input "50", "abc", "80", "74" dan rahsia 74:', '`full-game` with the input "50", "abc", "80", "74" and the secret 74:'],
        ['Percubaan 1: 50 < 74 → "higher".', 'Attempt 1: 50 < 74 → "higher".'],
        ['Percubaan 2: "abc" → `tonumber` `nil` → "please type a number".', 'Attempt 2: "abc" → `tonumber` gives `nil` → "please type a number".'],
        ['Percubaan 3: 80 > 74 → "lower". Percubaan 4: 74 → "correct in 4" dan `return "won"`.', 'Attempt 3: 80 > 74 → "lower". Attempt 4: 74 → "correct in 4" and `return "won"`.'],
      )),
    S('memory_behaviour',
      P('Setiap panggilan `script(...)` mencipta fungsi baharu dengan salinan `i` dan `lines` sendiri, jadi tiga senario dalam `scripted-play` tidak berkongsi keadaan. Fungsi-fungsi itu dibebaskan oleh pengutip sampah sebaik sahaja `play` selesai. Jadual kes ujian kecil dan wujud sepanjang ujian sahaja.',
        'Every call to `script(...)` creates a new function with its own `i` and `lines`, so the three scenarios in `scripted-play` share no state. Those functions are freed by the garbage collector as soon as `play` finishes. The test-case tables are small and live only for the duration of the tests.')),
    S('alternative_implementations',
      P('Penambahbaikan: jejaki statistik merentas beberapa pusingan dan skor terbaik:', 'An improvement: track statistics across several rounds and the best score:'),
      CODE('best-score', 'lua', 'lua54', ['Statistik merentas pusingan', 'Statistics across rounds'], `
local results = {won = 0, lost = 0}
local best

for _, attempts in ipairs({5, false, 3, 6}) do
  if attempts then
    results.won = results.won + 1
    if best == nil or attempts < best then best = attempts end
  else
    results.lost = results.lost + 1
  end
end
print("won " .. results.won .. ", lost " .. results.lost .. ", best " .. best)
`, 'won 3, lost 1, best 3'),
      EXPLAIN('best-score',
        ['1–2', 'Kiraan menang/kalah dan skor terbaik (belum ada).', 'Win/loss counts and the best score (none yet).'],
        ['4–5', 'Setiap pusingan direkodkan sebagai bilangan percubaan, atau `false` jika kalah.', 'Each round is recorded as an attempt count, or `false` for a loss.'],
        ['6–7', 'Kemenangan: kira, dan kemas kini skor terbaik jika ini lebih sedikit percubaan. Semakan `best == nil` didahulukan untuk pusingan pertama.', 'A win: count it, and update the best score if this took fewer attempts. The `best == nil` check comes first for the first round.'],
        ['9', 'Kekalahan dikira.', 'A loss is counted.'],
        ['12', 'Ringkasan sesi.', 'The session summary.'])),
    S('common_mistakes',
      UL(
        ['Hanya menguji "jalan gembira" (tekaan betul) dan melupakan input tidak sah atau input yang tamat.', 'Testing only the happy path (a correct guess) and forgetting invalid or ended input.'],
        ['Mesej `assert` yang tidak bermaklumat seperti "failed".', 'Uninformative `assert` messages such as "failed".'],
        ['Menambah ciri tanpa menjalankan ujian lama semula.', 'Adding features without re-running the old tests.'],
        ['Ujian yang bergantung pada `math.random` tanpa benih tetap atau sumber palsu.', 'Tests that depend on `math.random` without a fixed seed or a fake source.'],
      )),
    S('debugging',
      P('Apabila ujian gagal, mesej `assert` sepatutnya sudah memberitahu kes mana dan mengapa. Jika tidak, tambah `print` untuk input dan output fungsi sebelum `assert`. Untuk pepijat gelung permainan, pembaca berskrip membolehkan anda menghasilkan semula senario yang tepat berulang kali — lebih baik daripada cuba menaip urutan yang sama secara manual. Contoh berikut mempunyai kekangan tambahan: tahap kesukaran yang tidak dikenali mesti ditolak dengan mesej, dan bukannya ralat:',
        'When a test fails, the `assert` message should already say which case and why. If not, add a `print` of the function’s input and output before the `assert`. For game-loop bugs, a scripted reader lets you reproduce the exact scenario again and again — better than trying to type the same sequence by hand. The following example adds a constraint: an unknown difficulty level must be rejected with a message, not an error:'),
      CODE('difficulty-levels', 'lua', 'lua54', ['Tahap kesukaran', 'Difficulty levels'], `
local LEVELS = {easy = {max = 20, tries = 6}, hard = {max = 1000, tries = 10}}

local function setup(levelName, rng)
  local level = LEVELS[levelName]
  if level == nil then return nil, "unknown level: " .. levelName end
  return {secret = rng(1, level.max), tries = level.tries, max = level.max}
end

math.randomseed(5)
local round = setup("easy", math.random)
print(round.max, round.tries, round.secret >= 1 and round.secret <= round.max)
print(setup("expert", math.random))
`, '20\t6\ttrue\nnil\tunknown level: expert'),
      EXPLAIN('difficulty-levels',
        ['1', 'Setiap tahap ialah table peraturan. Had percubaan: ⌈log₂ 20⌉ = 5 tambah satu; ⌈log₂ 1000⌉ = 10.', 'Each level is a rule table. Attempt limits: ⌈log₂ 20⌉ = 5 plus one; ⌈log₂ 1000⌉ = 10.'],
        ['3–7', 'Tahap tidak dikenali → `nil, mesej`; jika tidak, cipta keadaan permainan baharu dengan rahsia rawak.', 'An unknown level → `nil, message`; otherwise create a new game state with a random secret.'],
        ['9–11', 'Sifat yang disemak: julat dan percubaan betul, rahsia dalam julat.', 'Checked properties: correct range and tries, a secret within range.'],
        ['12', 'Tahap yang tidak wujud ditolak dengan sopan.', 'A level that does not exist is rejected politely.'])),
    S('performance',
      P('Ujian ini berjalan dalam milisaat. Walaupun dengan ratusan kes, ujian logik tulen kekal pantas kerana ia tidak menunggu input atau menyentuh fail. Itulah sebab utama untuk memisahkan logik daripada I/O: ujian pantas dijalankan lebih kerap.',
        'These tests run in milliseconds. Even with hundreds of cases, pure-logic tests stay fast because they never wait for input or touch files. That is the main reason to separate logic from I/O: fast tests get run more often.')),
    S('software_engineering',
      P('Kod yang menggabungkan input, logik dan output tidak boleh diuji tanpa pemain:', 'Code that fuses input, logic and output cannot be tested without a player:'),
      CODE('poor-untestable', 'lua', 'lua54', ['Pelaksanaan lemah: I/O dan logik bercantum', 'Poor implementation: I/O and logic fused'], `
local secret = 42
local guess = tonumber(io.read("l"))
if guess == secret then
  print("correct")
elseif guess < secret then
  print("higher")
else
  print("lower")
end
`, 'higher', { input: '30\n' }),
      EXPLAIN('poor-untestable',
        ['1–2', 'Rahsia tetap dan input dibaca terus.', 'A fixed secret and input read directly.'],
        ['3–9', 'Logik tidak boleh dipanggil dengan nilai lain; input "abc" akan menyebabkan ralat `nil` pada baris 5.', 'The logic cannot be called with other values; the input "abc" would cause a `nil` error on line 5.']),
      CODE('improved-respond', 'lua', 'lua54', ['Pelaksanaan lebih baik: fungsi respons yang boleh diuji', 'Improved implementation: a testable response function'], `
local function respond(guess, secret)
  if guess == nil then return "please type a number" end
  if guess == secret then return "correct" end
  return guess < secret and "higher" or "lower"
end

print(respond(tonumber(io.read("l")), 42))
print(respond(tonumber("x"), 42))
`, 'higher\nplease type a number', { input: '30\n' }),
      EXPLAIN('improved-respond',
        ['1–5', 'Logik dalam fungsi tulen yang mengendalikan `nil` dengan selamat.', 'The logic in a pure function that handles `nil` safely.'],
        ['7', 'Lapisan I/O nipis: baca, tukar, panggil, cetak.', 'A thin I/O layer: read, convert, call, print.'],
        ['8', 'Kes input tidak sah diuji tanpa menaip apa-apa.', 'The invalid-input case is tested without typing anything.'])),
    S('industry_use_cases',
      UL(
        ['Projek Lua menggunakan rangka kerja ujian seperti busted, yang dibina atas idea `assert` dan kes ujian yang sama.', 'Lua projects use test frameworks such as busted, built on the same `assert` and test-case ideas.'],
        ['Sistem CI menjalankan ujian regresi pada setiap commit.', 'CI systems run regression tests on every commit.'],
        ['Studio permainan menguji logik dengan benih dan input berskrip untuk menghasilkan semula laporan pepijat.', 'Game studios test logic with seeds and scripted input to reproduce bug reports.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah dua kes ujian baharu pada `feedback-tests`, termasuk satu pada had atas (100, 100).', 'Add two new test cases to `feedback-tests`, including one at the upper limit (100, 100).'],
        ['Tukar input `full-game` supaya pemain kalah, dan sahkan rahsia didedahkan.', 'Change the `full-game` input so the player loses, and confirm the secret is revealed.'],
        ['Jalankan kedua-dua versi berpepijat dan baca mesej ralatnya.', 'Run both buggy versions and read their error messages.'],
      )),
    S('mini_project',
      P('**Permainan versi 2.** Gabungkan `parseGuess` (4.2) ke dalam gelung permainan supaya input tidak sah **tidak** menggunakan percubaan, dan paparkan baki percubaan selepas setiap tekaan yang salah.', '**Game version 2.** Combine `parseGuess` (4.2) into the game loop so invalid input does **not** use an attempt, and show the remaining attempts after every wrong guess.'),
      CODE('game-v2', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function parseGuess(text, min, max)
  local n = tonumber(text)
  if n == nil or math.type(n) ~= "integer" then return nil, "type a whole number" end
  if n < min or n > max then return nil, "between " .. min .. " and " .. max .. " please" end
  return n
end

local function playV2(secret, readLine, maxAttempts)
  local used = 0
  while used < maxAttempts do
    local text = readLine()
    if text == nil then return "quit" end
    local guess, problem = parseGuess(text, 1, 100)
    if guess == nil then
      print(problem)
    else
      used = used + 1
      if guess == secret then return "won in " .. used end
      print((guess < secret and "higher" or "lower") .. ", " .. maxAttempts - used .. " left")
    end
  end
  return "lost, it was " .. secret
end

print(playV2(64, function() return io.read("l") end, 3))
`, 'higher, 2 left\ntype a whole number\nbetween 1 and 100 please\nlower, 1 left\nwon in 3', { input: '50\n6.5\n500\n70\n64\n' }),
      EXPLAIN('game-v2',
        ['1–6', '`parseGuess` dengan mesej yang mesra pemain.', '`parseGuess` with player-friendly messages.'],
        ['8–10', '`used` mengira hanya tekaan yang sah; `while` dan bukan `for`, kerana bilangan pusingan tidak lagi tetap.', '`used` counts only valid guesses; `while` rather than `for`, because the number of passes is no longer fixed.'],
        ['11–12', 'Tamat input → berhenti.', 'End of input → quit.'],
        ['13–15', 'Input tidak sah: paparkan masalah tanpa menambah `used`.', 'Invalid input: show the problem without increasing `used`.'],
        ['17–19', 'Tekaan sah: kira, semak kemenangan, atau beri petunjuk dengan baki percubaan.', 'A valid guess: count it, check for a win, or give a hint with the remaining attempts.'],
        ['22', 'Percubaan habis: dedahkan rahsia.', 'Out of attempts: reveal the secret.'],
        ['25', 'Lima baris input, tetapi hanya tiga tekaan sah — dan pemain menang pada yang ketiga.', 'Five input lines, but only three valid guesses — and the player wins on the third.'])),
    S('summary',
      UL(
        ['Pasang program daripada fungsi kecil yang sudah diuji.', 'Assemble programs from small, already-tested functions.'],
        ['Ujian dipacu jadual: satu baris data bagi setiap kes; mesej `assert` yang bermaklumat.', 'Table-driven tests: one line of data per case; informative `assert` messages.'],
        ['Pembaca berskrip dan sumber rawak yang disuntik menjadikan gelung permainan boleh diuji.', 'Scripted readers and injected random sources make the game loop testable.'],
        ['Selepas setiap penambahbaikan, jalankan semua ujian semula (ujian regresi).', 'After every improvement, re-run all tests (regression testing).'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah tiga bahagian setiap kes ujian dalam `feedback-tests`?', 'What are the three parts of each test case in `feedback-tests`?'],
        ['Mengapakah `script({})` berguna sebagai ujian?', 'Why is `script({})` useful as a test?'],
        ['Dalam `game-v2`, mengapakah `while` digunakan dan bukannya `for`?', 'In `game-v2`, why is `while` used instead of `for`?'],
        ['Apakah ujian regresi?', 'What is a regression test?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual — assert', url: `${MANUAL}#pdf-assert` },
        { title: 'Lua 5.4 Reference Manual — io.read', url: `${MANUAL}#pdf-io.read` },
        { title: 'Programming in Lua (1st ed.) — 8.3 Errors', url: `${PIL}/8.3.html` },
        { title: 'busted — Elegant Lua unit testing', url: 'https://lunarmodules.github.io/busted/' },
      )),
  ],
};

export const LUA103_M4 = [LUA103_4_1, LUA103_4_2, LUA103_4_3];
