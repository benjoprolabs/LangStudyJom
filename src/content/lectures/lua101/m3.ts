import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA101 · Module 3 — Lua's Execution Model (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const IMPL50 = 'https://www.lua.org/doc/jucs05.pdf';

// ─── 3.1 Chunks, compilation and bytecode (luac) ───────────────────────────

export const LUA101_3_1: LectureContentDef = {
  courseCode: 'LUA101',
  module: 3,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan bahawa Lua **mengkompil** setiap [[chunk]] sebelum menjalankannya.', 'Explain that Lua **compiles** every [[chunk]] before running it.'],
        ['Membezakan ralat kompil (sintaks) dan ralat runtime.', 'Distinguish compile (syntax) errors from runtime errors.'],
        ['Menggunakan `load` dan `string.dump` untuk melihat chunk dan [[bytecode]].', 'Use `load` and `string.dump` to observe chunks and [[bytecode]].'],
        ['Menerangkan kegunaan dan risiko `luac` dan bytecode yang diprakompil.', 'Explain the uses and risks of `luac` and precompiled bytecode.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 2: menjalankan skrip dan REPL; setiap baris REPL ialah chunk.', 'Module 2: running scripts and the REPL; every REPL line is a chunk.'],
        ['Kuliah 1.2: `load` dan persekitaran.', 'Lecture 1.2: `load` and environments.'],
      )),
    S('introduction',
      P('Lua sering dipanggil bahasa "terinterpretasi", tetapi itu hanya separuh cerita. Sebelum mana-mana baris dijalankan, Lua **mengkompil** keseluruhan chunk kepada [[bytecode]] — arahan ringkas untuk [[virtual-machine|mesin maya]] Lua. Kompilasi ini sangat pantas sehingga anda jarang perasan, tetapi ia menerangkan banyak perkara: mengapa satu ralat sintaks menghalang keseluruhan fail, dan mengapa Lua boleh menyimpan program sebagai fail binari.',
        'Lua is often called an "interpreted" language, but that is only half the story. Before any line runs, Lua **compiles** the whole chunk to [[bytecode]] — compact instructions for the Lua [[virtual-machine]]. This compilation is so fast you rarely notice it, but it explains a lot: why one syntax error stops a whole file, and why Lua can store programs as binary files.'),
      KEY('Dua fasa: **kompil** (teks → bytecode) kemudian **jalankan** (mesin maya melaksanakan bytecode).', 'Two phases: **compile** (text → bytecode), then **run** (the virtual machine executes the bytecode).', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**[[chunk|Chunk]]:** unit kod yang dikompil sekali gus — fail, string atau baris REPL. Lua menganggapnya sebagai badan fungsi tanpa nama.', '**[[chunk|Chunk]]:** a unit of code compiled as a whole — a file, a string or a REPL line. Lua treats it as the body of an anonymous function.'],
        ['**Pengkompil (parser):** membaca teks, menyemak sintaks dan menghasilkan bytecode dalam **satu laluan**.', '**Compiler (parser):** reads the text, checks the syntax and emits bytecode in **a single pass**.'],
        ['**`load(teks)`:** mengkompil dan memulangkan fungsi — tanpa menjalankannya.', '**`load(text)`:** compiles and returns a function — without running it.'],
        ['**`string.dump(f)`:** memulangkan bytecode fungsi Lua sebagai string binari.', '**`string.dump(f)`:** returns a Lua function’s bytecode as a binary string.'],
        ['**`luac`:** pengkompil baris arahan; `luac -o out.luac in.lua` menyimpan bytecode, `luac -l` menyenaraikan arahan.', '**`luac`:** the command-line compiler; `luac -o out.luac in.lua` saves bytecode, `luac -l` lists the instructions.'],
      )),
    S('detailed_theory',
      P('Pengkompil Lua ialah penghurai **satu laluan** (one-pass): ia membaca token dari kiri ke kanan dan terus menjana arahan bytecode tanpa membina pepohon sintaks penuh. Reka bentuk ini menjadikan kompilasi sangat pantas dan menggunakan sedikit memori — penting untuk peranti kecil. Setiap fungsi dalam chunk menjadi **prototaip** dengan senarai arahan, pemalar (nombor dan string literal) dan maklumat debug (nombor baris, nama local). Chunk itu sendiri menjadi prototaip utama yang menerima argumen melalui `...`.',
        'The Lua compiler is a **one-pass** parser: it reads tokens from left to right and emits bytecode instructions directly, without building a full syntax tree. This design makes compilation very fast and memory-light — important for small devices. Each function in a chunk becomes a **prototype** with a list of instructions, constants (number and string literals) and debug information (line numbers, local names). The chunk itself becomes the main prototype, which receives arguments through `...`.'),
      P('Bytecode boleh disimpan dengan `string.dump` atau `luac`, kemudian dimuatkan semula dengan `load(binari, nama, "b")` tanpa mengkompil semula. Namun bytecode bergantung pada versi (bytecode 5.3 tidak berjalan dalam 5.4) dan **tidak disahkan** oleh pemuat: bytecode yang dibentuk secara jahat boleh merosakkan interpreter. Sebab itu `load` menerima mod `"t"` (teks sahaja) untuk sumber yang tidak dipercayai. Bytecode juga bukan perlindungan kod yang kuat — ia boleh dinyahhimpunkan.',
        'Bytecode can be saved with `string.dump` or `luac`, then loaded again with `load(binary, name, "b")` without recompiling. But bytecode is version-specific (5.3 bytecode does not run on 5.4) and is **not verified** by the loader: maliciously crafted bytecode can crash the interpreter. That is why `load` takes mode `"t"` (text only) for untrusted sources. Bytecode is also not strong code protection — it can be decompiled.')),
    S('technical_terminology', TERMS('chunk', 'bytecode', 'interpreter', 'function')),
    S('syntax_rules',
      UL(
        ['`local f, err = load(teks, nama, mod, env)` — `f` ialah fungsi atau `nil`; `err` ialah mesej ralat sintaks.', '`local f, err = load(text, name, mode, env)` — `f` is a function or `nil`; `err` is the syntax error message.'],
        ['Mod: `"t"` teks sahaja, `"b"` binari sahaja, `"bt"` kedua-duanya (lalai).', 'Modes: `"t"` text only, `"b"` binary only, `"bt"` both (the default).'],
        ['Nama chunk bermula dengan `=` dipaparkan seperti ditulis dalam mesej ralat (`=config` → `config:1:`).', 'A chunk name starting with `=` is shown as written in error messages (`=config` → `config:1:`).'],
        ['Di dalam chunk, `...` ialah argumen dan `return` memulangkan nilai kepada pemanggil.', 'Inside a chunk, `...` holds the arguments and `return` returns values to the caller.'],
      )),
    S('code_demonstration',
      CODE('load-run', 'lua', 'lua54', ['Kompil dahulu, jalankan kemudian', 'Compile first, run later'], `
local f = load("print('running the chunk')")
print(type(f))
print("compiled, not run yet")
f()
f()
`, "function\ncompiled, not run yet\nrunning the chunk\nrunning the chunk"),
      EXPLAIN('load-run',
        ['1', '`load` **hanya mengkompil** teks. Tiada yang dicetak lagi — baris dalam string belum dijalankan.', '`load` **only compiles** the text. Nothing is printed yet — the line inside the string has not run.'],
        ['2–3', 'Hasil kompilasi ialah nilai jenis `function`.', 'The result of compilation is a value of type `function`.'],
        ['4–5', 'Memanggil fungsi menjalankan bytecode. Kompil sekali, jalankan banyak kali.', 'Calling the function runs the bytecode. Compile once, run many times.'])),
    S('complete_examples',
      CODE('chunk-args', 'lua', 'lua54', ['Chunk menerima argumen dan memulangkan nilai', 'A chunk receives arguments and returns values'], `
local area = load([[
  local width, height = ...
  return width * height, 2 * (width + height)
]], "=area")

local a, p = area(4, 3)
print("area", a, "perimeter", p)
`, 'area\t12\tperimeter\t14'),
      EXPLAIN('chunk-args',
        ['1–4', 'Chunk dua baris dikompil dengan nama `area`. Ia berkelakuan seperti fungsi tanpa nama: `...` ialah parameternya.', 'A two-line chunk compiled with the name `area`. It behaves like an anonymous function: `...` is its parameter list.'],
        ['2', 'Dua local menerima dua argumen pertama.', 'Two locals receive the first two arguments.'],
        ['3', 'Chunk memulangkan **dua** nilai.', 'The chunk returns **two** values.'],
        ['6–7', 'Panggilan seperti fungsi biasa; dua local menerima kedua-dua nilai pulangan.', 'A call like any function; two locals receive both return values.']),
      CODE('dump-bytecode', 'lua', 'lua54', ['Melihat dan memuatkan semula bytecode', 'Inspecting and reloading bytecode'], `
local function answer() return 6 * 7 end

local binary = string.dump(answer)
print(binary:byte(1) == 27, binary:sub(2, 4))

local again = load(binary, "=dumped", "b")
print(again())
`, 'true\tLua\n42', {
        debug: BUG(`
local function answer() return 6 * 7 end

local binary = string.dump(answer)
local again = assert(load(binary, "=dumped", "t"))
print(again())
`, "example:4: attempt to load a binary chunk (mode is 't')",
          'Mod `"t"` hanya menerima **teks**, jadi `load` menolak bytecode dan memulangkan `nil` serta mesej. `assert` menukar keputusan itu kepada ralat yang menunjuk ke baris 4. Inilah perlindungan yang anda mahu untuk input daripada pengguna — tetapi untuk bytecode yang anda hasilkan sendiri, gunakan mod `"b"`.',
          'Mode `"t"` accepts **text** only, so `load` rejects the bytecode and returns `nil` and a message. `assert` turns that result into an error pointing at line 4. This is exactly the protection you want for input from users — but for bytecode you produced yourself, use mode `"b"`.'),
      }),
      EXPLAIN('dump-bytecode',
        ['1', 'Fungsi kecil yang akan "dibuang" (dumped).', 'A small function that will be dumped.'],
        ['3', '`string.dump` memulangkan bytecode fungsi sebagai string binari.', '`string.dump` returns the function’s bytecode as a binary string.'],
        ['4', 'Setiap fail bytecode Lua bermula dengan bait 27 (ESC) diikuti `"Lua"` — "tandatangan" yang digunakan oleh pemuat untuk mengenalinya.', 'Every Lua bytecode file starts with byte 27 (ESC) followed by `"Lua"` — the "signature" the loader uses to recognise it.'],
        ['6–7', 'Mod `"b"` memuatkan bytecode tanpa mengkompil semula. Fungsi yang terhasil berkelakuan sama: 42.', 'Mode `"b"` loads bytecode without recompiling. The resulting function behaves the same: 42.'])),
    S('line_by_line',
      EXPLAIN('load-run',
        ['1', 'Perhatikan susunan output: `function` dan "compiled, not run yet" muncul **sebelum** "running the chunk", walaupun teks chunk ditulis pada baris 1. Kompilasi dan pelaksanaan ialah dua langkah berasingan.', 'Notice the output order: `function` and "compiled, not run yet" appear **before** "running the chunk", although the chunk text is written on line 1. Compiling and executing are two separate steps.']),
      EXPLAIN('dump-bytecode',
        ['4', '`binary:byte(1)` ialah sintaks method untuk `string.byte(binary, 1)`; `binary:sub(2, 4)` mengambil bait 2 hingga 4.', '`binary:byte(1)` is method syntax for `string.byte(binary, 1)`; `binary:sub(2, 4)` takes bytes 2 to 4.'])),
    S('why_this_way',
      P('Mengapa mengkompil dahulu? Kerana menjalankan bytecode jauh lebih pantas daripada membaca dan menafsir teks berulang kali — terutamanya dalam gelung. Mengkompil keseluruhan chunk juga bermakna ralat sintaks ditemui **sebelum** sebarang kesan sampingan berlaku: program tidak akan separuh berjalan, menulis separuh fail, kemudian gagal kerana tanda kurung yang hilang di hujung.',
        'Why compile first? Because executing bytecode is much faster than reading and interpreting text repeatedly — especially in loops. Compiling the whole chunk also means syntax errors are found **before** any side effect happens: a program will not half-run, write half a file, and then fail because of a missing bracket at the end.'),
      P('Pengaturcara menggunakan bytecode prakompil **apabila** masa permulaan penting (peranti perlahan) atau untuk menghantar fail tanpa teks sumber yang mudah dibaca. Untuk kebanyakan projek, menghantar sumber `.lua` lebih mudah dan lebih mudah alih.', 'Developers use precompiled bytecode **when** start-up time matters (slow devices) or to ship files without easily readable source text. For most projects, shipping `.lua` source is simpler and more portable.')),
    S('execution_flow',
      OL(
        ['`load` menerima teks dan membahagikannya kepada token (`local`, `width`, `,`, …).', '`load` receives the text and splits it into tokens (`local`, `width`, `,`, …).'],
        ['Penghurai menyemak tatabahasa dan menjana arahan bytecode serta senarai pemalar dalam satu laluan.', 'The parser checks the grammar and emits bytecode instructions plus a constant list in one pass.'],
        ['Jika ada ralat sintaks, `load` berhenti dan memulangkan `nil, mesej` — tiada kod dijalankan.', 'If there is a syntax error, `load` stops and returns `nil, message` — no code runs.'],
        ['Jika berjaya, `load` membungkus prototaip utama sebagai fungsi Lua dan memulangkannya.', 'If it succeeds, `load` wraps the main prototype as a Lua function and returns it.'],
        ['Memanggil fungsi itu menyerahkan bytecode kepada mesin maya untuk dilaksanakan.', 'Calling that function hands the bytecode to the virtual machine for execution.'],
      )),
    S('memory_behaviour',
      P('Setiap `load` mencipta prototaip baharu dalam heap: arahan, pemalar dan maklumat debug. Prototaip kekal selagi fungsi yang menggunakannya masih dirujuk. String yang dihasilkan oleh `string.dump` ialah salinan berasingan yang boleh disimpan atau dibuang. `luac -s` membuang maklumat debug untuk fail lebih kecil — tetapi mesej ralat kemudian kehilangan nombor baris dan nama local.',
        'Each `load` creates a new prototype on the heap: instructions, constants and debug information. The prototype stays alive as long as a function using it is referenced. The string produced by `string.dump` is a separate copy that can be saved or discarded. `luac -s` strips debug information for smaller files — but error messages then lose line numbers and local names.'),
      WARN('Memanggil `load` berulang kali dalam gelung untuk kod yang sama membazirkan masa **dan** memori. Kompil sekali, simpan fungsinya.', 'Calling `load` repeatedly in a loop for the same code wastes time **and** memory. Compile once, keep the function.', ['Awas', 'Warning'])),
    S('alternative_implementations',
      P('`load` juga boleh menerima **fungsi pembaca** dan bukannya string: Lua memanggilnya berulang kali untuk mendapatkan kepingan teks seterusnya. Ini membolehkan sumber yang sangat besar dikompil tanpa memuatkan keseluruhan teks ke dalam satu string:', '`load` can also take a **reader function** instead of a string: Lua calls it repeatedly to get the next piece of text. This lets very large sources be compiled without holding the whole text in one string:'),
      CODE('load-reader', 'lua', 'lua54', ['load dengan fungsi pembaca', 'load with a reader function'], `
local pieces = {"local x = 20 ", "local y = 22 ", "return x + y"}
local i = 0
local f = load(function()
  i = i + 1
  return pieces[i]
end, "=pieces")
print(f())
`, '42'),
      EXPLAIN('load-reader',
        ['1–2', 'Teks sumber dalam tiga kepingan, dan indeks kepingan semasa.', 'The source text in three pieces, and the current piece index.'],
        ['3–6', 'Fungsi pembaca memulangkan kepingan seterusnya; apabila ia memulangkan `nil` (selepas kepingan ketiga), Lua tahu sumber telah tamat.', 'The reader returns the next piece; when it returns `nil` (after the third piece), Lua knows the source has ended.'],
        ['7', 'Chunk yang dikompil daripada kepingan berjalan seperti biasa: 20 + 22 = 42.', 'The chunk compiled from the pieces runs as usual: 20 + 22 = 42.'])),
    S('common_mistakes',
      UL(
        ['Menyangka ralat sintaks pada baris 50 hanya menjejaskan baris 50 — keseluruhan fail gagal dikompil.', 'Thinking a syntax error on line 50 only affects line 50 — the whole file fails to compile.'],
        ['Tidak menyemak nilai pulangan kedua `load`.', 'Not checking `load`’s second return value.'],
        ['Menghantar fail `.luac` kepada pengguna dengan versi Lua yang berbeza.', 'Shipping `.luac` files to users with a different Lua version.'],
        ['Menganggap bytecode menyembunyikan rahsia — ia boleh dinyahhimpunkan.', 'Assuming bytecode hides secrets — it can be decompiled.'],
      )),
    S('debugging',
      P('Ralat kompil dan ralat runtime kelihatan serupa tetapi bermula pada masa yang berbeza. Ralat kompil berlaku **sebelum** baris pertama dijalankan, jadi tiada output separa. Ia juga sering dilaporkan pada baris **selepas** kesilapan sebenar, kerana penghurai hanya menyedari masalah apabila ia melihat token yang tidak dijangka. Contoh berikut tidak menutup kurungan pada baris 2, tetapi ralat menunjuk ke baris 3:',
        'Compile errors and runtime errors look similar but start at different times. A compile error happens **before** the first line runs, so there is no partial output. It is also often reported on the line **after** the real mistake, because the parser only notices a problem when it sees an unexpected token. The following example leaves a parenthesis open on line 2, but the error points at line 3:'),
      WARN('Tidak setiap baris yang "tidak lengkap" ialah ralat sintaks! Kerana baris baharu tidak bermakna dalam Lua, `local price = 10 *` diikuti `print(price)` dibaca sebagai `10 * print(price)` — sah dari segi sintaks — dan gagal hanya semasa runtime. Jangan anggap penghurai akan menangkap setiap kesilapan.', 'Not every "unfinished" line is a syntax error! Because newlines mean nothing in Lua, `local price = 10 *` followed by `print(price)` is read as `10 * print(price)` — syntactically valid — and only fails at run time. Do not assume the parser catches every mistake.', ['Perangkap', 'Trap']),
      CODE('compile-before-run', 'lua', 'lua54', ['Program yang betul', 'The correct program'], `
print("start")
local price = 10 * 3
print(price)
`, 'start\n30', {
        debug: BUG(`
print("start")
local price = (10 * 3
print(price)
`, "example:3: ')' expected (to close '(' at line 2) near 'print'",
          'Perhatikan: "start" **tidak** dicetak, kerana chunk tidak pernah dijalankan — ia gagal semasa kompil. Kesilapan sebenar di baris 2 (kurungan tidak ditutup), tetapi penghurai hanya menyedarinya apabila menemui `print` di baris 3 di mana ia menjangkakan `)`. Mesej membantu: ia menyebut di mana kurungan dibuka (`line 2`). Apabila ralat menunjuk ke awal sesuatu baris, semak juga baris **sebelumnya**.',
          'Notice: "start" is **not** printed, because the chunk never ran — it failed at compile time. The real mistake is on line 2 (an unclosed parenthesis), but the parser only notices when it meets `print` on line 3, where it expected `)`. The message helps: it says where the parenthesis was opened (`line 2`). When an error points at the start of a line, also check the **previous** line.'),
      }),
      EXPLAIN('compile-before-run',
        ['1', 'Kesan sampingan pertama program.', 'The program’s first side effect.'],
        ['2–3', 'Pengiraan dan paparan yang betul: 30.', 'A correct calculation and display: 30.'])),
    S('performance',
      P('Kompilasi Lua sangat pantas — beribu baris sesaat — jadi untuk skrip biasa, masa kompil boleh diabaikan. Bytecode prakompil hanya menjimatkan masa permulaan yang ketara untuk sumber yang sangat besar atau peranti yang perlahan. Keuntungan prestasi sebenar datang daripada **mengkompil sekali dan memanggil berkali-kali**, bukan daripada fail `.luac`.',
        'Lua compiles very fast — thousands of lines per second — so for ordinary scripts compile time is negligible. Precompiled bytecode only saves noticeable start-up time for very large sources or slow devices. The real performance gain comes from **compiling once and calling many times**, not from `.luac` files.')),
    S('software_engineering',
      P('Bandingkan dua cara menilai formula pengguna untuk beberapa nilai:', 'Compare two ways of evaluating a user formula for several values:'),
      CODE('poor-recompile', 'lua', 'lua54', ['Pelaksanaan lemah: kompil semula dalam gelung', 'Poor implementation: recompiling inside the loop'], `
local formula = "x * x + 1"
for x = 1, 3 do
  local f = load("return " .. formula:gsub("x", tostring(x)))
  print(f())
end
`, '2\n5\n10'),
      EXPLAIN('poor-recompile',
        ['1', 'Formula sebagai teks.', 'The formula as text.'],
        ['2–5', 'Untuk **setiap** nilai, teks diubah dengan `gsub` dan dikompil semula. Ia berfungsi, tetapi membazir, dan penggantian teks mudah rosak (cuba formula yang mengandungi `max`).', 'For **every** value, the text is rewritten with `gsub` and recompiled. It works, but it is wasteful, and text substitution is fragile (try a formula containing `max`).']),
      CODE('improved-compile-once', 'lua', 'lua54', ['Pelaksanaan lebih baik: kompil sekali dengan parameter', 'Improved implementation: compile once with a parameter'], `
local formula = "x * x + 1"
local f = assert(load("local x = ... return " .. formula, "=formula", "t", {}))
for x = 1, 3 do
  print(f(x))
end
`, '2\n5\n10'),
      EXPLAIN('improved-compile-once',
        ['1', 'Formula yang sama sebagai teks.', 'The same formula as text.'],
        ['2', 'Formula dikompil **sekali** sebagai chunk yang menerima `x` melalui `...`. Persekitaran kosong menghalang formula daripada memanggil fungsi; `assert` melaporkan ralat sintaks dengan jelas.', 'The formula is compiled **once** as a chunk that receives `x` through `...`. The empty environment stops the formula from calling functions; `assert` reports syntax errors clearly.'],
        ['3–5', 'Gelung hanya memanggil fungsi yang sama dengan nilai berbeza.', 'The loop only calls the same function with different values.']),
      P('Versi kedua lebih pantas, lebih selamat dan lebih betul — ia tidak bergantung pada penggantian teks. Pemisahan "kompil" dan "jalankan" ialah corak reka bentuk yang anda akan temui semula dalam enjin templat, regex dan pertanyaan pangkalan data.', 'The second version is faster, safer and more correct — it does not rely on text substitution. Separating "compile" from "run" is a design pattern you will meet again in template engines, regexes and database queries.')),
    S('industry_use_cases',
      UL(
        ['Enjin permainan memprakompil skrip ke bytecode semasa membina pakej permainan untuk mempercepat masa muat.', 'Game engines precompile scripts to bytecode when building the game package to speed up loading.'],
        ['Redis menyimpan skrip Lua yang dikompil dalam cache dan memanggilnya semula dengan `EVALSHA`.', 'Redis caches compiled Lua scripts and calls them again with `EVALSHA`.'],
        ['Aplikasi helaian kira dan kalkulator membenamkan Lua untuk mengkompil formula pengguna sekali dan menilainya berkali-kali.', 'Spreadsheet and calculator applications embed Lua to compile user formulas once and evaluate them many times.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `load-run` dan terangkan susunan output.', 'Run `load-run` and explain the output order.'],
        ['Pada komputer anda, jalankan `luac -l` pada fail kecil dan lihat senarai arahan seperti `LOADI`, `ADD` dan `RETURN`.', 'On your computer, run `luac -l` on a small file and look at the instruction list, such as `LOADI`, `ADD` and `RETURN`.'],
        ['Jalankan versi berpepijat `compile-before-run` dan sahkan "start" tidak dicetak.', 'Run the buggy version of `compile-before-run` and confirm that "start" is not printed.'],
      )),
    S('mini_project',
      P('**Penilai formula.** Terima formula dalam `x` sebagai teks, kompil sekali dengan semakan ralat, kemudian cetak jadual nilai untuk x = 0 hingga 3.', '**A formula evaluator.** Accept a formula in `x` as text, compile it once with error checking, then print a table of values for x = 0 to 3.'),
      CODE('formula-table', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function compileFormula(text)
  local f, err = load("local x = ... return " .. text, "=formula", "t", {})
  if not f then return nil, "invalid formula: " .. err end
  return f
end

local f = assert(compileFormula("2 * x + 1"))
for x = 0, 3 do
  print(x, f(x))
end
print(compileFormula("2 * + 1"))
`, "0\t1\n1\t3\n2\t5\n3\t7\nnil\tinvalid formula: formula:1: unexpected symbol near '+'"),
      EXPLAIN('formula-table',
        ['1–5', 'Fungsi pembantu yang memulangkan sama ada fungsi formula, atau `nil` dan mesej yang jelas — corak `(nil, mesej)` yang sama seperti `load`.', 'A helper that returns either the formula function, or `nil` and a clear message — the same `(nil, message)` pattern as `load`.'],
        ['7', 'Formula yang sah dikompil sekali.', 'A valid formula is compiled once.'],
        ['8–10', 'Jadual nilai: 2x + 1 untuk x = 0..3.', 'The table of values: 2x + 1 for x = 0..3.'],
        ['11', 'Formula tidak sah tidak menghentikan program; pemanggil menerima `nil` dan mesej yang menamakan chunk `formula`.', 'An invalid formula does not stop the program; the caller receives `nil` and a message naming the `formula` chunk.'])),
    S('summary',
      UL(
        ['Lua mengkompil setiap chunk kepada bytecode sebelum menjalankannya.', 'Lua compiles every chunk to bytecode before running it.'],
        ['Ralat sintaks menghalang keseluruhan chunk; tiada kod dijalankan.', 'A syntax error stops the whole chunk; no code runs.'],
        ['`load` mengkompil, `string.dump`/`luac` menyimpan bytecode, mod `"t"` menolak binari.', '`load` compiles, `string.dump`/`luac` save bytecode, mode `"t"` rejects binaries.'],
        ['Kompil sekali, panggil berkali-kali.', 'Compile once, call many times.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah ralat sintaks pada baris terakhir fail menghalang baris pertama daripada dijalankan?', 'Why does a syntax error on the last line of a file stop the first line from running?'],
        ['Apakah yang dipulangkan oleh `load` jika teks mempunyai ralat?', 'What does `load` return if the text has an error?'],
        ['Mengapakah bytecode tidak boleh dimuatkan daripada sumber yang tidak dipercayai?', 'Why must bytecode not be loaded from untrusted sources?'],
        ['Mengapakah ralat kadang-kadang dilaporkan satu baris selepas kesilapan sebenar?', 'Why is an error sometimes reported one line after the real mistake?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.3.2 — Chunks', url: `${MANUAL}#3.3.2` },
        { title: 'Lua 5.4 Reference Manual — load', url: `${MANUAL}#pdf-load` },
        { title: 'Lua 5.4 Reference Manual — string.dump', url: `${MANUAL}#pdf-string.dump` },
        { title: 'luac — Lua compiler manual page', url: 'https://www.lua.org/manual/5.4/luac.html' },
        { title: 'R. Ierusalimschy et al. — The Implementation of Lua 5.0', url: IMPL50 },
      )),
  ],
};

// ─── 3.2 The Lua virtual machine and the execution stack ───────────────────

export const LUA101_3_2: LectureContentDef = {
  courseCode: 'LUA101',
  module: 3,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan bagaimana [[virtual-machine|mesin maya]] Lua melaksanakan bytecode.', 'Explain how the Lua [[virtual-machine]] executes bytecode.'],
        ['Menerangkan [[call-stack|stack panggilan]] dan bingkai fungsi.', 'Explain the [[call-stack]] and function frames.'],
        ['Menggunakan `debug.getinfo` untuk memeriksa stack semasa program berjalan.', 'Use `debug.getinfo` to inspect the stack while a program runs.'],
        ['Membezakan rekursi biasa dan panggilan ekor (tail call), dan menerangkan ralat `stack overflow`.', 'Distinguish ordinary recursion from tail calls, and explain the `stack overflow` error.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1: chunk dikompil kepada bytecode.', 'Lecture 3.1: chunks are compiled to bytecode.'],
        ['Fungsi memanggil fungsi lain (diperkenalkan dalam contoh terdahulu).', 'Functions calling other functions (seen in earlier examples).'],
      )),
    S('introduction',
      P('Selepas kompilasi, siapa yang benar-benar menjalankan bytecode? **Mesin maya** Lua — gelung dalam C yang membaca satu arahan, melakukannya, kemudian membaca arahan seterusnya. Untuk menjejaki fungsi mana yang sedang berjalan dan ke mana ia perlu kembali, mesin maya menggunakan **stack panggilan**. Memahami stack menerangkan output traceback, rekursi dan ralat `stack overflow`.',
        'After compilation, who actually runs the bytecode? The Lua **virtual machine** — a loop in C that reads one instruction, performs it, then reads the next. To keep track of which function is running and where it must return to, the virtual machine uses a **call stack**. Understanding the stack explains traceback output, recursion and the `stack overflow` error.'),
      KEY('Setiap panggilan fungsi menolak (push) satu **bingkai** ke stack; setiap `return` mengeluarkan (pop) bingkai itu.', 'Every function call pushes one **frame** onto the stack; every `return` pops that frame.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Arahan bytecode:** contohnya `LOADI` (muat integer), `ADD`, `CALL`, `RETURN`. Setiap satu mengendalikan **daftar** (register).', '**Bytecode instructions:** for example `LOADI` (load integer), `ADD`, `CALL`, `RETURN`. Each one operates on **registers**.'],
        ['**Daftar (register):** slot dalam bingkai fungsi tempat pemboleh ubah `local` dan nilai sementara disimpan.', '**Register:** a slot in a function’s frame where `local` variables and temporary values live.'],
        ['**Bingkai (frame):** daftar fungsi dan alamat pulangan. Bingkai baharu dicipta untuk setiap panggilan, termasuk rekursi.', '**Frame:** a function’s registers and its return address. A new frame is created for every call, including recursion.'],
        ['**[[call-stack|Stack panggilan]]:** timbunan bingkai; bingkai atas ialah fungsi yang sedang berjalan.', '**[[call-stack|Call stack]]:** the pile of frames; the top frame is the function currently running.'],
        ['**Panggilan ekor (tail call):** `return f(x)` menggunakan semula bingkai semasa, jadi stack tidak membesar.', '**Tail call:** `return f(x)` reuses the current frame, so the stack does not grow.'],
      )),
    S('detailed_theory',
      P('Kebanyakan mesin maya bahasa skrip (contohnya JVM dan CPython) berasaskan **stack**: arahan menolak dan mengeluarkan nilai daripada stack operan. Sejak versi 5.0, Lua menggunakan reka bentuk berasaskan **daftar**: arahan menamakan slot secara terus, contohnya `ADD R2 R0 R1` bermaksud "R2 = R0 + R1". Ini memerlukan lebih sedikit arahan untuk kerja yang sama, dan merupakan salah satu sebab Lua pantas. Pemboleh ubah `local` dipetakan terus kepada daftar — itulah sebabnya ia lebih pantas daripada global, yang memerlukan carian table.',
        'Most scripting-language virtual machines (for example the JVM and CPython) are **stack-based**: instructions push and pop values on an operand stack. Since version 5.0, Lua uses a **register-based** design: instructions name slots directly, for example `ADD R2 R0 R1` means "R2 = R0 + R1". This needs fewer instructions for the same work and is one reason Lua is fast. `local` variables map directly to registers — that is why they are faster than globals, which need a table lookup.'),
      P('Daftar setiap fungsi berada dalam bingkai pada **stack Lua** (dalam heap, bukan stack C). Apabila fungsi dipanggil, mesin maya memperuntukkan bingkai di atas pemanggil; apabila ia pulang, bingkai dibuang dan pelaksanaan diteruskan pada arahan selepas `CALL`. Stack Lua mempunyai had (kira-kira sejuta slot); rekursi tanpa kes asas memenuhinya dan menghasilkan ralat `stack overflow`. **Panggilan ekor** yang betul — `return f(x)` — ialah pengecualian: mesin maya menggantikan bingkai semasa dan bukannya menambah satu.',
        'Each function’s registers live in a frame on the **Lua stack** (on the heap, not the C stack). When a function is called, the virtual machine allocates a frame above the caller; when it returns, the frame is dropped and execution resumes at the instruction after `CALL`. The Lua stack has a limit (about a million slots); recursion without a base case fills it and produces a `stack overflow` error. A proper **tail call** — `return f(x)` — is the exception: the virtual machine replaces the current frame instead of adding one.')),
    S('technical_terminology', TERMS('virtual-machine', 'call-stack', 'bytecode', 'function')),
    S('syntax_rules',
      UL(
        ['`debug.getinfo(tahap, "Sl")` — maklumat tentang fungsi pada tahap stack tertentu: 1 = fungsi semasa, 2 = pemanggilnya.', '`debug.getinfo(level, "Sl")` — information about the function at a given stack level: 1 = the current function, 2 = its caller.'],
        ['Medan berguna: `short_src` (nama chunk), `currentline` (baris semasa), `name` (dengan pilihan `"n"`).', 'Useful fields: `short_src` (chunk name), `currentline` (current line), `name` (with the `"n"` option).'],
        ['Panggilan ekor mesti tepat `return f(args)` — `return 1 + f(x)` atau `return (f(x))` **bukan** panggilan ekor.', 'A tail call must be exactly `return f(args)` — `return 1 + f(x)` or `return (f(x))` is **not** a tail call.'],
      )),
    S('code_demonstration',
      CODE('where-am-i', 'lua', 'lua54', ['Memeriksa stack panggilan', 'Inspecting the call stack'], `
local function whereAmI()
  local info = debug.getinfo(2, "Sl")
  return info.short_src .. ":" .. info.currentline
end

local function report()
  print("report called from " .. whereAmI())
end

report()
print("top level is at " .. whereAmI())
`, 'report called from example:7\ntop level is at example:11'),
      EXPLAIN('where-am-i',
        ['1–4', '`whereAmI` meminta maklumat tentang tahap **2** — pemanggilnya. `short_src` ialah nama chunk dan `currentline` ialah baris yang sedang dilaksanakan dalam bingkai itu.', '`whereAmI` asks about level **2** — its caller. `short_src` is the chunk name and `currentline` is the line being executed in that frame.'],
        ['6–8', '`report` memanggil `whereAmI` dari baris 7, jadi bingkai pemanggil berada di baris 7.', '`report` calls `whereAmI` from line 7, so the caller’s frame is at line 7.'],
        ['10–11', 'Dipanggil dari peringkat atas (chunk utama), pemanggilnya ialah bingkai chunk pada baris 11.', 'Called from the top level (the main chunk), its caller is the chunk’s frame at line 11.'])),
    S('complete_examples',
      CODE('recursion-frames', 'lua', 'lua54', ['Setiap panggilan rekursif ialah bingkai baharu', 'Every recursive call is a new frame'], `
local function factorial(n, depth)
  print(string.rep("  ", depth) .. "enter factorial(" .. n .. ")")
  if n <= 1 then
    return 1
  end
  local result = n * factorial(n - 1, depth + 1)
  print(string.rep("  ", depth) .. "leave factorial(" .. n .. ") = " .. result)
  return result
end

print(factorial(3, 0))
`, 'enter factorial(3)\n  enter factorial(2)\n    enter factorial(1)\n  leave factorial(2) = 2\nleave factorial(3) = 6\n6'),
      EXPLAIN('recursion-frames',
        ['1–2', 'Setiap panggilan mencetak "enter" dengan inden mengikut kedalaman stack (`depth`).', 'Every call prints "enter" indented by its stack depth (`depth`).'],
        ['3–5', '**Kes asas:** apabila `n` ialah 1, fungsi pulang terus tanpa memanggil dirinya — inilah yang menghentikan pertumbuhan stack.', '**Base case:** when `n` is 1, the function returns straight away without calling itself — this is what stops the stack from growing.'],
        ['6', 'Panggilan rekursif. Bingkai semasa **menunggu** di sini, dengan `n` disimpan dalam daftarnya, sehingga panggilan dalaman pulang.', 'The recursive call. The current frame **waits** here, with `n` kept in its register, until the inner call returns.'],
        ['7–8', 'Selepas panggilan dalaman pulang, bingkai menyambung semula, mencetak "leave" dan memulangkan hasilnya.', 'After the inner call returns, the frame resumes, prints "leave" and returns its result.'],
        ['11', 'Bermula pada kedalaman 0 dengan n = 3: 3 × 2 × 1 = 6.', 'Start at depth 0 with n = 3: 3 × 2 × 1 = 6.']),
      CODE('tail-call', 'lua', 'lua54', ['Panggilan ekor tidak membesarkan stack', 'Tail calls do not grow the stack'], `
local function countdown(n)
  if n == 0 then
    return "done"
  end
  return countdown(n - 1)
end

print(countdown(1000000))
`, 'done', {
        debug: BUG(`
local function countdown(n)
  if n == 0 then
    return "done"
  end
  local result = countdown(n - 1)
  return result
end

print(countdown(1000000))
`, "example:5: stack overflow",
          'Versi ini kelihatan sama tetapi bukan panggilan ekor: bingkai mesti **menunggu** keputusan pada baris 5 sebelum memulangkannya pada baris 6. Sejuta bingkai yang menunggu melebihi had stack Lua, lalu ralat `stack overflow` dilaporkan di baris panggilan. Betulkan dengan `return countdown(n - 1)`, atau gunakan gelung untuk ulangan yang sangat dalam.',
          'This version looks the same but is not a tail call: the frame must **wait** for the result on line 5 before returning it on line 6. A million waiting frames exceed the Lua stack limit, so a `stack overflow` error is reported at the call line. Fix it with `return countdown(n - 1)`, or use a loop for very deep repetition.'),
      }),
      EXPLAIN('tail-call',
        ['1–4', 'Kes asas: pulangkan `"done"` apabila mencapai sifar.', 'The base case: return `"done"` on reaching zero.'],
        ['5', '`return countdown(n - 1)` ialah **panggilan ekor**: tiada kerja lagi selepas panggilan, jadi Lua menggantikan bingkai semasa dan bukannya menambah satu.', '`return countdown(n - 1)` is a **tail call**: there is no work left after the call, so Lua replaces the current frame instead of adding one.'],
        ['8', 'Sejuta "panggilan" menggunakan satu bingkai sahaja.', 'A million "calls" use a single frame.'])),
    S('line_by_line',
      EXPLAIN('where-am-i',
        ['2', 'Pilihan `"Sl"` meminta maklumat **S**umber (`short_src`) dan **l**ine semasa. Tahap 1 akan memberi baris dalam `whereAmI` sendiri; tahap 2 memberi pemanggil.', 'The `"Sl"` options ask for **S**ource information (`short_src`) and the current **l**ine. Level 1 would give a line inside `whereAmI` itself; level 2 gives the caller.']),
      EXPLAIN('recursion-frames',
        ['6', 'Pada kedalaman maksimum, terdapat tiga bingkai `factorial` di atas chunk utama — setiap satu dengan `n` sendiri (3, 2, 1). Itulah sebabnya `n` tidak "ditimpa" oleh panggilan dalaman.', 'At maximum depth, there are three `factorial` frames above the main chunk — each with its own `n` (3, 2, 1). That is why `n` is not "overwritten" by the inner calls.'])),
    S('why_this_way',
      P('Mengapa stack? Kerana fungsi mesti kembali ke tempat yang betul, dalam susunan terbalik panggilan — tepat seperti struktur "masuk terakhir, keluar dahulu" (LIFO). Setiap bingkai juga memberi setiap panggilan salinan pemboleh ubah local sendiri, yang menjadikan rekursi mungkin. Mengapa panggilan ekor yang betul? Supaya gaya pengaturcaraan rekursif (contohnya mesin keadaan) boleh berjalan tanpa had kedalaman.',
        'Why a stack? Because functions must return to the right place, in the reverse order of the calls — exactly a "last in, first out" (LIFO) structure. Each frame also gives every call its own copy of the local variables, which is what makes recursion possible. Why proper tail calls? So recursive programming styles (for example state machines) can run without a depth limit.'),
      P('Pengaturcara memeriksa stack **apabila** mereka menulis alat logging, pengendali ralat atau penyahpepijat; mereka memilih panggilan ekor atau gelung **apabila** ulangan boleh menjadi sangat dalam.', 'Developers inspect the stack **when** they write logging tools, error handlers or debuggers; they choose tail calls or loops **when** repetition can become very deep.')),
    S('execution_flow',
      OL(
        ['Chunk utama berjalan dalam bingkai pertama dan mencapai `factorial(3, 0)` (arahan `CALL`).', 'The main chunk runs in the first frame and reaches `factorial(3, 0)` (a `CALL` instruction).'],
        ['Bingkai untuk `factorial(3)` ditolak; ia mencetak "enter", kemudian memanggil `factorial(2)` — bingkai kedua ditolak.', 'A frame for `factorial(3)` is pushed; it prints "enter", then calls `factorial(2)` — a second frame is pushed.'],
        ['`factorial(1)` (bingkai ketiga) mencapai kes asas dan memulangkan 1; bingkainya dikeluarkan.', '`factorial(1)` (the third frame) hits the base case and returns 1; its frame is popped.'],
        ['`factorial(2)` menyambung pada baris 6, mengira 2, mencetak "leave" dan pulang; kemudian `factorial(3)` mengira 6.', '`factorial(2)` resumes at line 6, computes 2, prints "leave" and returns; then `factorial(3)` computes 6.'],
        ['Hanya bingkai chunk utama yang tinggal; ia mencetak 6.', 'Only the main chunk’s frame is left; it prints 6.'],
      )),
    S('memory_behaviour',
      P('Bingkai menggunakan slot pada stack Lua, yang membesar secara automatik apabila perlu dan mengecil semula. Setiap bingkai menyimpan daftar fungsi (biasanya beberapa slot hingga beberapa puluh). Rekursi sedalam 1000 bermakna 1000 bingkai hidup serentak; panggilan ekor menggunakan semula satu. Apabila fungsi pulang, local dalam bingkainya tidak lagi dirujuk — table yang hanya dirujuk oleh local tersebut boleh dikutip oleh pengutip sampah.',
        'Frames use slots on the Lua stack, which grows automatically when needed and shrinks again. Each frame holds the function’s registers (usually a few up to a few dozen slots). Recursion 1000 deep means 1000 frames alive at once; a tail call reuses one. When a function returns, the locals in its frame are no longer referenced — tables referenced only by those locals can be collected by the garbage collector.')),
    S('alternative_implementations',
      P('Mana-mana rekursi boleh ditulis semula sebagai gelung. Untuk faktorial, gelung menggunakan satu bingkai dan tiada risiko stack overflow:', 'Any recursion can be rewritten as a loop. For factorial, a loop uses one frame and has no stack-overflow risk:'),
      CODE('iterative-factorial', 'lua', 'lua54', ['Faktorial dengan gelung', 'Factorial with a loop'], `
local function factorial(n)
  local result = 1
  for i = 2, n do
    result = result * i
  end
  return result
end

print(factorial(3), factorial(20))
`, '6\t2432902008176640000'),
      EXPLAIN('iterative-factorial',
        ['1–2', 'Satu bingkai sahaja; hasil terkumpul dalam satu local.', 'A single frame; the result accumulates in one local.'],
        ['3–5', 'Gelung mendarab dari 2 hingga `n`.', 'The loop multiplies from 2 to `n`.'],
        ['6', 'Pulangkan hasil terkumpul.', 'Return the accumulated result.'],
        ['9', '20! masih muat dalam integer 64-bit; 21! akan melimpah (berbalik) — had yang perlu diingat.', '20! still fits in a 64-bit integer; 21! would overflow (wrap around) — a limit to remember.']),
      P('Rekursi lebih jelas untuk struktur bersarang (pepohon, folder); gelung lebih selamat untuk ulangan linear yang panjang.', 'Recursion is clearer for nested structures (trees, folders); loops are safer for long linear repetition.')),
    S('common_mistakes',
      UL(
        ['Terlupa kes asas, menyebabkan rekursi tanpa had dan `stack overflow`.', 'Forgetting the base case, causing endless recursion and a `stack overflow`.'],
        ['Menyangka `return 1 + f(x)` ialah panggilan ekor.', 'Believing `return 1 + f(x)` is a tail call.'],
        ['Mengelirukan tahap `debug.getinfo`: 1 ialah fungsi semasa, bukan pemanggil.', 'Confusing `debug.getinfo` levels: 1 is the current function, not the caller.'],
        ['Menggunakan pustaka `debug` dalam logik program biasa — ia untuk alat dan diagnostik.', 'Using the `debug` library in ordinary program logic — it is for tools and diagnostics.'],
      )),
    S('debugging',
      P('Apabila program gagal jauh di dalam panggilan bersarang, [[stack-traceback]] menunjukkan laluan penuh: setiap bingkai daripada tempat ralat sehingga chunk utama. Baca dari atas ke bawah. Contoh berikut memanggil fungsi pembantu yang tidak wujud dari dalam fungsi lain; mesej menyebut nama global yang hilang dan baris di mana panggilan berlaku:',
        'When a program fails deep inside nested calls, the [[stack-traceback]] shows the full path: every frame from the error location down to the main chunk. Read it from top to bottom. The following example calls a helper function that does not exist from inside another function; the message names the missing global and the line where the call happened:'),
      CODE('nested-call', 'lua', 'lua54', ['Panggilan bersarang yang betul', 'A correct nested call'], `
local function formatPrice(value)
  return string.format("RM %.2f", value)
end

local function receipt(total)
  return "Total: " .. formatPrice(total)
end

print(receipt(12.5))
`, 'Total: RM 12.50', {
        debug: BUG(`
local function receipt(total)
  return "Total: " .. formatPrice(total)
end

print(receipt(12.5))
`, "example:2: attempt to call a nil value (global 'formatPrice')",
          'Fungsi `formatPrice` telah dibuang (atau belum ditakrifkan), jadi `formatPrice` dibaca sebagai **global** yang `nil`. Ralat berlaku di baris 2 dalam `receipt`, tetapi traceback penuh juga menunjukkan baris 5 sebagai pemanggil. Dalam fail sebenar, semak sama ada fungsi ditakrifkan **sebelum** ia digunakan dan sama ada ia `local` dalam fail lain.',
          'The `formatPrice` function was removed (or never defined), so `formatPrice` is read as a **global** that is `nil`. The error happens on line 2 inside `receipt`, but the full traceback also lists line 5 as the caller. In a real file, check whether the function is defined **before** it is used and whether it is `local` to another file.'),
      }),
      EXPLAIN('nested-call',
        ['1–3', 'Fungsi pembantu yang memformat harga kepada dua tempat perpuluhan.', 'A helper that formats a price to two decimal places.'],
        ['5–7', '`receipt` memanggil pembantu — stack kini mempunyai bingkai chunk, `receipt` dan `formatPrice`.', '`receipt` calls the helper — the stack now holds frames for the chunk, `receipt` and `formatPrice`.'],
        ['9', 'Bermula dari peringkat atas.', 'Start from the top level.'])),
    S('performance',
      P('Setiap panggilan fungsi mempunyai kos kecil: mencipta bingkai, menyalin argumen dan pulang. Dalam gelung yang sangat kerap, beberapa pengaturcara menyelitkan (inline) fungsi kecil. Namun kod yang jelas lebih penting: ukur dahulu. `debug.getinfo` agak perlahan — jangan panggilnya dalam gelung panas. Panggilan ekor sama pantas dengan panggilan biasa tetapi menjimatkan memori stack.',
        'Every function call has a small cost: creating a frame, copying arguments and returning. In very hot loops, some programmers inline small functions. But clear code matters more: measure first. `debug.getinfo` is fairly slow — do not call it in hot loops. A tail call is as fast as an ordinary call but saves stack memory.')),
    S('software_engineering',
      P('Bandingkan dua cara menjumlahkan senarai yang panjang:', 'Compare two ways of summing a long list:'),
      CODE('poor-deep-recursion', 'lua', 'lua54', ['Pelaksanaan lemah: rekursi untuk ulangan linear', 'Poor implementation: recursion for linear repetition'], `
local function sum(list, i)
  i = i or 1
  if i > #list then return 0 end
  return list[i] + sum(list, i + 1)
end

print(sum({4, 8, 15, 16, 23, 42}))
`, '108'),
      EXPLAIN('poor-deep-recursion',
        ['1–5', 'Setiap elemen menambah satu bingkai yang menunggu, kerana `list[i] + sum(...)` bukan panggilan ekor. Senarai berjuta elemen akan menyebabkan `stack overflow`.', 'Every element adds a waiting frame, because `list[i] + sum(...)` is not a tail call. A list with millions of elements would cause a `stack overflow`.'],
        ['7', 'Berfungsi untuk senarai kecil: 108.', 'Works for small lists: 108.']),
      CODE('improved-loop-sum', 'lua', 'lua54', ['Pelaksanaan lebih baik: gelung dengan pengumpul', 'Improved implementation: a loop with an accumulator'], `
local function sum(list)
  local total = 0
  for _, value in ipairs(list) do
    total = total + value
  end
  return total
end

print(sum({4, 8, 15, 16, 23, 42}))
`, '108'),
      EXPLAIN('improved-loop-sum',
        ['1–2', 'Satu bingkai dan satu pengumpul (`total`).', 'One frame and one accumulator (`total`).'],
        ['3–5', '`ipairs` melawati setiap elemen mengikut tertib.', '`ipairs` visits every element in order.'],
        ['6–9', 'Keputusan sama, kedalaman stack tetap — selamat untuk sebarang saiz senarai.', 'The same result with a constant stack depth — safe for any list size.']),
      P('Pilih rekursi apabila data itu sendiri bersarang; pilih gelung apabila data ialah urutan. Pertimbangan ini — kejelasan berbanding had sumber — ialah keputusan kejuruteraan harian.', 'Choose recursion when the data itself is nested; choose a loop when the data is a sequence. This trade-off — clarity versus resource limits — is an everyday engineering decision.')),
    S('industry_use_cases',
      UL(
        ['Penyahpepijat Lua (contohnya dalam ZeroBrane Studio atau sambungan VS Code) menggunakan pustaka `debug` untuk memaparkan stack panggilan.', 'Lua debuggers (for example in ZeroBrane Studio or VS Code extensions) use the `debug` library to display the call stack.'],
        ['Pemprofil mengambil sampel stack beribu kali sesaat untuk mencari fungsi yang paling lambat.', 'Profilers sample the stack thousands of times per second to find the slowest functions.'],
        ['Mesin keadaan dalam permainan (AI musuh) menggunakan panggilan ekor untuk berpindah antara keadaan tanpa membesarkan stack.', 'State machines in games (enemy AI) use tail calls to move between states without growing the stack.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `recursion-frames` dengan `factorial(5, 0)` dan lukis stack pada kertas.', 'Run `recursion-frames` with `factorial(5, 0)` and draw the stack on paper.'],
        ['Jalankan versi berpepijat `tail-call` dan bandingkan dengan versi asal.', 'Run the buggy version of `tail-call` and compare it with the original.'],
        ['Tukar `whereAmI` supaya menggunakan tahap 1 dan terangkan perubahan output.', 'Change `whereAmI` to use level 1 and explain how the output changes.'],
      )),
    S('mini_project',
      P('**Penjejak panggilan.** Tulis fungsi `traced(name, f)` yang membungkus fungsi lain dan mencetak "→ name" dan "← name" dengan inden mengikut kedalaman, kemudian jejaki fungsi Fibonacci kecil.', '**A call tracer.** Write a function `traced(name, f)` that wraps another function and prints "→ name" and "← name" indented by depth, then trace a small Fibonacci function.'),
      CODE('call-tracer', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local depth = 0
local function traced(name, f)
  return function(n)
    print(string.rep("| ", depth) .. "-> " .. name .. "(" .. n .. ")")
    depth = depth + 1
    local result = f(n)
    depth = depth - 1
    return result
  end
end

local fib
fib = traced("fib", function(n)
  if n < 2 then return n end
  return fib(n - 1) + fib(n - 2)
end)

print("result", fib(3))
`, '-> fib(3)\n| -> fib(2)\n| | -> fib(1)\n| | -> fib(0)\n| -> fib(1)\nresult\t2'),
      EXPLAIN('call-tracer',
        ['1', 'Kedalaman stack yang dikongsi oleh semua panggilan yang dijejaki.', 'The stack depth shared by all traced calls.'],
        ['2–10', '`traced` memulangkan fungsi **pembalut**: ia mencetak baris masuk dengan inden, menaikkan kedalaman, memanggil fungsi asal, dan menurunkan kedalaman selepas ia pulang.', '`traced` returns a **wrapper** function: it prints an indented entry line, increases the depth, calls the original function, and decreases the depth after it returns.'],
        ['12–16', '`fib` diisytiharkan dahulu supaya badan fungsi boleh memanggil versi yang **dijejaki** secara rekursif.', '`fib` is declared first so the function body can recursively call the **traced** version.'],
        ['18', 'Output menunjukkan pepohon panggilan: fib(3) memanggil fib(2) dan fib(1); fib(2) memanggil fib(1) dan fib(0).', 'The output shows the call tree: fib(3) calls fib(2) and fib(1); fib(2) calls fib(1) and fib(0).'])),
    S('summary',
      UL(
        ['Mesin maya Lua berasaskan daftar; local disimpan dalam daftar bingkai fungsi.', 'The Lua virtual machine is register-based; locals live in the registers of a function’s frame.'],
        ['Setiap panggilan menolak bingkai; setiap `return` mengeluarkannya.', 'Every call pushes a frame; every `return` pops it.'],
        ['Rekursi memerlukan kes asas; rekursi terlalu dalam menyebabkan `stack overflow`.', 'Recursion needs a base case; recursion that is too deep causes a `stack overflow`.'],
        ['`return f(x)` ialah panggilan ekor yang tidak membesarkan stack.', '`return f(x)` is a tail call that does not grow the stack.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah perbezaan antara mesin maya berasaskan stack dan berasaskan daftar?', 'What is the difference between a stack-based and a register-based virtual machine?'],
        ['Berapa banyak bingkai `factorial` wujud serentak apabila memanggil `factorial(4, 0)`?', 'How many `factorial` frames exist at once when calling `factorial(4, 0)`?'],
        ['Adakah `return n * f(n - 1)` panggilan ekor? Mengapa?', 'Is `return n * f(n - 1)` a tail call? Why?'],
        ['Apakah yang dipulangkan oleh `debug.getinfo(2, "l").currentline`?', 'What does `debug.getinfo(2, "l").currentline` return?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'R. Ierusalimschy et al. — The Implementation of Lua 5.0 (register-based VM)', url: IMPL50 },
        { title: 'Lua 5.4 Reference Manual §3.4.10 — Function Calls (proper tail calls)', url: `${MANUAL}#3.4.10` },
        { title: 'Lua 5.4 Reference Manual — debug.getinfo', url: `${MANUAL}#pdf-debug.getinfo` },
        { title: 'Programming in Lua (1st ed.) — 6.3 Proper Tail Calls', url: 'https://www.lua.org/pil/6.3.html' },
      )),
  ],
};

// ─── 3.3 Basic syntax: statements, blocks and comments ─────────────────────

export const LUA101_3_3: LectureContentDef = {
  courseCode: 'LUA101',
  module: 3,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Membezakan **pernyataan** (statement) dan **ungkapan** (expression) dalam Lua.', 'Distinguish **statements** from **expressions** in Lua.'],
        ['Menulis blok yang ditutup dengan betul: `do … end`, `if … then … end`, `function … end`.', 'Write correctly closed blocks: `do … end`, `if … then … end`, `function … end`.'],
        ['Menggunakan [[comment|komen]] satu baris dan komen panjang dengan berkesan.', 'Use one-line and long [[comment|comments]] effectively.'],
        ['Mengenal pasti ralat sintaks biasa daripada mesejnya.', 'Recognise common syntax errors from their messages.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1: ralat sintaks ditemui semasa kompil.', 'Lecture 3.1: syntax errors are found at compile time.'],
        ['Contoh terdahulu dengan `local`, `if` dan `for`.', 'Earlier examples with `local`, `if` and `for`.'],
      )),
    S('introduction',
      P('Sintaks Lua sengaja ringkas dan konsisten. Tiada kurungan kerinting untuk blok, tiada koma bertitik wajib, dan inden tidak mempunyai makna — tidak seperti Python. Sebaliknya, setiap blok dibuka dengan kata kunci (`do`, `then`, `function`) dan ditutup dengan `end`. Mengetahui beberapa peraturan asas ini membolehkan anda membaca hampir semua kod Lua.',
        'Lua’s syntax is deliberately small and consistent. There are no curly braces for blocks, no mandatory semicolons, and indentation has no meaning — unlike Python. Instead, every block opens with a keyword (`do`, `then`, `function`) and closes with `end`. Knowing these few rules lets you read almost any Lua code.'),
      KEY('Pernyataan **melakukan** sesuatu; ungkapan **menghasilkan** nilai.', 'A statement **does** something; an expression **produces** a value.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Pernyataan:** assignment (`x = 1`), panggilan fungsi (`print(x)`), struktur kawalan (`if`, `while`, `for`), `local`, `return`, `break`.', '**Statements:** assignment (`x = 1`), function calls (`print(x)`), control structures (`if`, `while`, `for`), `local`, `return`, `break`.'],
        ['**Ungkapan:** apa sahaja yang menghasilkan nilai — `1 + 2`, `"a" .. "b"`, `x > 3`, `{}`, `function() end`.', '**Expressions:** anything that produces a value — `1 + 2`, `"a" .. "b"`, `x > 3`, `{}`, `function() end`.'],
        ['**Blok:** senarai pernyataan dengan [[scope|skop]] sendiri. `local` dalam blok hilang pada `end`.', '**Block:** a list of statements with its own [[scope]]. A `local` inside a block disappears at `end`.'],
        ['**[[comment|Komen]]:** `--` hingga hujung baris; `--[[ … ]]` untuk berbilang baris.', '**[[comment|Comments]]:** `--` to the end of the line; `--[[ … ]]` for several lines.'],
        ['**Ruang kosong:** baris baharu dan inden tidak bermakna kepada Lua; ia untuk pembaca manusia.', '**Whitespace:** newlines and indentation mean nothing to Lua; they are for human readers.'],
      )),
    S('detailed_theory',
      P('Tatabahasa Lua dibina daripada beberapa jenis pernyataan dan ungkapan yang boleh digabung dengan bebas. Koma bertitik `;` adalah pilihan: Lua tahu di mana pernyataan berakhir daripada struktur tatabahasa, jadi `a = 1 b = 2` pada satu baris adalah sah (walaupun tidak digalakkan). Satu kekecualian penting: ungkapan biasa seperti `x + 1` **bukan** pernyataan yang sah dengan sendirinya — Lua hanya menerima panggilan fungsi dan assignment sebagai pernyataan ungkapan. Ini menghalang pepijat seperti `x == 1` yang ditulis apabila `x = 1` dimaksudkan.',
        'Lua’s grammar is built from a few kinds of statements and expressions that combine freely. The semicolon `;` is optional: Lua knows where a statement ends from the grammar, so `a = 1 b = 2` on one line is valid (though discouraged). One important exception: a plain expression such as `x + 1` is **not** a valid statement on its own — Lua only accepts function calls and assignments as expression statements. This prevents bugs like writing `x == 1` when `x = 1` was meant.'),
      P('Komen panjang menggunakan kurungan "aras": `--[[ … ]]` boleh ditulis sebagai `--[==[ … ]==]` dengan sebarang bilangan `=` yang sama di kedua-dua hujung. Ini membolehkan anda mengulas kod yang sendiri mengandungi `]]`. Helah biasa ialah `--[[` … `--]]`: menambah satu `-` di permulaan (`---[[`) mengaktifkan semula kod di dalamnya, kerana baris itu menjadi komen satu baris biasa.',
        'Long comments use "level" brackets: `--[[ … ]]` can be written as `--[==[ … ]==]` with any equal number of `=` at both ends. This lets you comment out code that itself contains `]]`. A common trick is `--[[` … `--]]`: adding one more `-` at the start (`---[[`) re-enables the code inside, because that line becomes an ordinary one-line comment.')),
    S('technical_terminology', TERMS('comment', 'scope', 'chunk', 'variable')),
    S('syntax_rules',
      UL(
        ['Blok: `do … end`, `if cond then … elseif cond then … else … end`, `while cond do … end`, `for … do … end`, `repeat … until cond`, `function … end`.', 'Blocks: `do … end`, `if cond then … elseif cond then … else … end`, `while cond do … end`, `for … do … end`, `repeat … until cond`, `function … end`.'],
        ['`return` dan `break` mesti menjadi pernyataan **terakhir** dalam bloknya.', '`return` and `break` must be the **last** statement in their block.'],
        ['22 kata terpelihara termasuk `and`, `break`, `do`, `else`, `elseif`, `end`, `false`, `for`, `function`, `goto`, `if`, `in`, `local`, `nil`, `not`, `or`, `repeat`, `return`, `then`, `true`, `until`, `while`.', 'The 22 reserved words are `and`, `break`, `do`, `else`, `elseif`, `end`, `false`, `for`, `function`, `goto`, `if`, `in`, `local`, `nil`, `not`, `or`, `repeat`, `return`, `then`, `true`, `until`, `while`.'],
        ['Lua peka huruf besar/kecil: `End` ialah nama biasa, `end` ialah kata kunci.', 'Lua is case-sensitive: `End` is an ordinary name, `end` is a keyword.'],
      )),
    S('code_demonstration',
      CODE('statements-blocks', 'lua', 'lua54', ['Pernyataan, ungkapan dan blok', 'Statements, expressions and blocks'], `
local a = 1; local b = 2      -- two statements on one line
local sum = a + b             -- 'a + b' is an expression

do
  local sum = 100             -- a different 'sum', local to this block
  print("inside:", sum)
end

if sum > 2 then
  print("outside:", sum)
end
`, 'inside:\t100\noutside:\t3'),
      EXPLAIN('statements-blocks',
        ['1', 'Dua pernyataan `local` pada satu baris, dipisahkan oleh `;` pilihan untuk kejelasan.', 'Two `local` statements on one line, separated by an optional `;` for clarity.'],
        ['2', 'Pernyataan assignment yang nilainya ialah **ungkapan** `a + b`.', 'An assignment statement whose value is the **expression** `a + b`.'],
        ['4–7', '`do … end` mencipta blok baharu. `sum` di dalamnya ialah pemboleh ubah berbeza yang membayangi `sum` luar sehingga `end`.', '`do … end` creates a new block. The `sum` inside is a different variable that shadows the outer `sum` until `end`.'],
        ['9–11', 'Blok `if` dengan syarat (ungkapan boolean). Di sini `sum` merujuk semula kepada pemboleh ubah luar: 3.', 'An `if` block with a condition (a boolean expression). Here `sum` refers to the outer variable again: 3.'])),
    S('complete_examples',
      CODE('comment-styles', 'lua', 'lua54', ['Gaya komen', 'Comment styles'], `
-- One-line comment: explains the next line
local rate = 0.06 -- trailing comment: 6% service tax

--[[
  Long comment: several lines,
  useful for explaining a whole section.
]]

--[==[ A level-2 long comment may contain ]] safely ]==]

print(100 * rate)
`, '6.0'),
      EXPLAIN('comment-styles',
        ['1–2', 'Komen satu baris di atas kod dan komen di hujung baris. Lua mengabaikan semua teks selepas `--`.', 'A one-line comment above the code and a trailing comment. Lua ignores all text after `--`.'],
        ['4–7', 'Komen panjang `--[[ … ]]` merentas beberapa baris.', 'A long comment `--[[ … ]]` spanning several lines.'],
        ['9', 'Dengan `==` di kedua-dua hujung, komen boleh mengandungi `]]` tanpa tamat awal.', 'With `==` at both ends, the comment can contain `]]` without ending early.'],
        ['11', 'Satu-satunya pernyataan yang dijalankan: 100 × 0.06 = 6.0.', 'The only statement that runs: 100 × 0.06 = 6.0.']),
      CODE('toggle-block', 'lua', 'lua54', ['Helah komen untuk menghidupkan/mematikan kod', 'The comment trick to toggle code'], `
local mode = "normal"

---[[  remove one dash to disable the block below
mode = "debug"
--]]

print(mode)
`, 'debug', {
        debug: BUG(`
local mode = "normal"

--[[  disabled block
mode = "debug"
--]

print(mode)
`, "example:7: unfinished long comment (starting at line 3) near <eof>",
          'Penutup ditulis `--]` dengan **satu** kurungan, jadi komen panjang yang dibuka pada baris 3 tidak pernah ditutup dan menelan semua kod hingga hujung fail. Lua hanya menyedarinya di hujung fail (baris 7), tetapi mesej memberitahu di mana komen **bermula** (baris 3). Penutup mesti `]]` (atau `--]]`), dengan bilangan `=` yang sama seperti pembukaan.',
          'The closer was written `--]` with **one** bracket, so the long comment opened on line 3 is never closed and swallows all the code to the end of the file. Lua only notices at the end of the file (line 7), but the message tells you where the comment **started** (line 3). The closer must be `]]` (or `--]]`), with the same number of `=` as the opener.'),
      }),
      EXPLAIN('toggle-block',
        ['1', 'Nilai lalai.', 'The default value.'],
        ['3', '`---[[` bermula dengan `--` diikuti `-[[` — jadi ia hanyalah komen **satu baris**; blok di bawahnya aktif.', '`---[[` starts with `--` followed by `-[[` — so it is only a **one-line** comment; the block below is active.'],
        ['4', 'Kod yang boleh dihidupkan atau dimatikan.', 'The code that can be toggled.'],
        ['7', 'Mencetak `debug` kerana blok aktif. Buang satu sengkang pada baris 3 dan blok menjadi komen panjang — output menjadi `normal`.', 'Prints `debug` because the block is active. Remove one dash on line 3 and the block becomes a long comment — the output becomes `normal`.'])),
    S('line_by_line',
      EXPLAIN('statements-blocks',
        ['5', 'Pemboleh ubah dalaman tidak mengubah `sum` luar sama sekali — ia slot daftar yang berbeza. Sebaik sahaja `end` pada baris 7 dicapai, slot itu dibebaskan.', 'The inner variable does not change the outer `sum` at all — it is a different register slot. As soon as the `end` on line 7 is reached, that slot is released.']),
      EXPLAIN('comment-styles',
        ['2', 'Komen hujung baris yang baik menerangkan **maksud** nilai (cukai perkhidmatan 6%), bukan mengulang kod (`-- set rate to 0.06`).', 'A good trailing comment explains the **meaning** of the value (6% service tax), not repeat the code (`-- set rate to 0.06`).'])),
    S('why_this_way',
      P('Mengapa kata kunci `end` dan bukannya kurungan kerinting atau inden? Lua direka untuk pengguna yang bukan pengaturcara; kata seperti `then`, `do` dan `end` dibaca hampir seperti bahasa Inggeris. Tidak bergantung pada inden juga bermakna kod yang disalin dari e-mel atau dijana oleh program lain tetap sah. Kosnya ialah ralat "`end` expected" apabila satu `end` terlupa — itulah sebabnya inden yang kemas tetap penting untuk manusia.',
        'Why the `end` keyword rather than curly braces or indentation? Lua was designed for non-programmers; words like `then`, `do` and `end` read almost like English. Not depending on indentation also means code pasted from an e-mail or generated by another program stays valid. The cost is the "`end` expected" error when one `end` is forgotten — which is why tidy indentation still matters to humans.'),
      P('Tulis komen **apabila** kod tidak dapat menerangkan sebab sesuatu dilakukan (peraturan perniagaan, keputusan reka bentuk, sumber formula). Jangan tulis komen yang hanya mengulang apa yang sudah jelas daripada kod.', 'Write comments **when** the code cannot explain why something is done (a business rule, a design decision, the source of a formula). Do not write comments that only repeat what is already clear from the code.')),
    S('execution_flow',
      OL(
        ['Penghurai membaca `statements-blocks` dan mencatat setiap pembukaan blok (`do`, `if`) untuk dipadankan dengan `end`.', 'The parser reads `statements-blocks` and records every block opening (`do`, `if`) to match it with an `end`.'],
        ['Komen dan ruang kosong dibuang semasa pembahagian token — ia tidak menghasilkan sebarang bytecode.', 'Comments and whitespace are discarded during tokenising — they produce no bytecode.'],
        ['Semasa runtime, blok `do` memperuntukkan slot untuk `sum` dalaman, mencetak 100, kemudian membebaskannya.', 'At run time, the `do` block allocates a slot for the inner `sum`, prints 100, then releases it.'],
        ['Syarat `sum > 2` dinilai dengan `sum` luar (3); badan `if` dijalankan.', 'The condition `sum > 2` is evaluated with the outer `sum` (3); the `if` body runs.'],
      )),
    S('memory_behaviour',
      P('Komen tidak wujud selepas kompilasi — ia tidak menggunakan memori runtime dan tidak memperlahankan program, jadi jangan ragu untuk menulis komen yang berguna. Blok `do … end` ialah alat memori yang berguna: local yang memegang data besar boleh diletakkan dalam blok supaya rujukannya hilang pada `end`, membolehkan pengutip sampah membebaskan data itu lebih awal.',
        'Comments do not exist after compilation — they use no runtime memory and do not slow the program, so do not hesitate to write useful comments. A `do … end` block is a handy memory tool: a local holding large data can be placed in a block so its reference disappears at `end`, letting the garbage collector free the data earlier.')),
    S('alternative_implementations',
      P('Satu syarat boleh ditulis sebagai blok `if` atau sebagai **ungkapan** dengan `and`/`or`. Bentuk ungkapan lebih ringkas apabila anda hanya memerlukan satu nilai:', 'A condition can be written as an `if` block or as an **expression** with `and`/`or`. The expression form is shorter when you only need one value:'),
      CODE('if-vs-expression', 'lua', 'lua54', ['Blok if berbanding ungkapan and/or', 'An if block versus an and/or expression'], `
local score = 72

local grade
if score >= 50 then
  grade = "pass"
else
  grade = "fail"
end

local grade2 = score >= 50 and "pass" or "fail"
print(grade, grade2)
`, 'pass\tpass'),
      EXPLAIN('if-vs-expression',
        ['1', 'Markah pelajar.', 'A student’s score.'],
        ['3–8', 'Versi **pernyataan**: pemboleh ubah diisytiharkan dahulu, kemudian diberi nilai dalam setiap cabang.', 'The **statement** version: the variable is declared first, then assigned in each branch.'],
        ['10', 'Versi **ungkapan**: `cond and a or b` memberi `a` jika syarat benar, jika tidak `b`. (Perangkapnya — apabila `a` ialah `false` atau `nil` — diajar dalam LUA103.)', 'The **expression** version: `cond and a or b` gives `a` if the condition is true, otherwise `b`. (Its pitfall — when `a` is `false` or `nil` — is taught in LUA103.)'],
        ['11', 'Kedua-duanya memberi keputusan yang sama.', 'Both give the same result.'])),
    S('common_mistakes',
      UL(
        ['Terlupa `then` selepas syarat `if` atau `do` selepas `while`/`for`.', 'Forgetting `then` after an `if` condition or `do` after `while`/`for`.'],
        ['Menulis `}` atau `endif` (daripada bahasa lain) dan bukannya `end`.', 'Writing `}` or `endif` (from other languages) instead of `end`.'],
        ['Menulis ungkapan sebagai pernyataan, contohnya `x == 1` pada baris sendiri.', 'Writing an expression as a statement, for example `x == 1` on its own line.'],
        ['Menutup komen panjang dengan `]` tunggal, lalu separuh fail menjadi komen.', 'Closing a long comment with a single `]`, so half the file becomes a comment.'],
        ['Meletakkan pernyataan selepas `return` dalam blok yang sama.', 'Placing statements after `return` in the same block.'],
      )),
    S('debugging',
      P('Ralat sintaks Lua menggunakan corak yang boleh diramal: `\'X\' expected near \'Y\'` bermaksud penghurai memerlukan token X tetapi menemui Y. Ini biasanya menunjukkan kata kunci yang hilang **sebelum** Y. Contoh berikut terlupa `then`; Lua menjangkakannya tetapi menemui `print`:',
        'Lua syntax errors follow a predictable pattern: `\'X\' expected near \'Y\'` means the parser needed token X but found Y. This usually points to a missing keyword **just before** Y. The following example forgets `then`; Lua expected it but found `print`:'),
      CODE('missing-then', 'lua', 'lua54', ['Syarat if yang betul', 'A correct if condition'], `
local temperature = 31
if temperature > 30 then
  print("hot day")
end
`, 'hot day', {
        debug: BUG(`
local temperature = 31
if temperature > 30
  print("hot day")
end
`, "example:3: 'then' expected near 'print'",
          'Baris 2 tidak mempunyai `then`. Penghurai membaca syarat, kemudian menemui `print` pada baris 3 di mana ia menjangkakan `then` — jadi ralat dilaporkan pada baris 3. Baca mesej secara literal: "`then` dijangka berhampiran `print`". Tambah `then` di hujung baris 2.',
          'Line 2 has no `then`. The parser reads the condition, then meets `print` on line 3 where it expected `then` — so the error is reported on line 3. Read the message literally: "`then` expected near `print`". Add `then` at the end of line 2.'),
      }),
      EXPLAIN('missing-then',
        ['1', 'Suhu dalam darjah Celsius.', 'A temperature in degrees Celsius.'],
        ['2–4', 'Blok `if` lengkap: syarat, `then`, badan dan `end`.', 'A complete `if` block: condition, `then`, body and `end`.'])),
    S('performance',
      P('Sintaks tidak mempunyai kesan prestasi: komen, ruang kosong, koma bertitik dan pilihan antara `if` atau `and/or` dikompil kepada bytecode yang sama atau hampir sama. Pilih bentuk yang paling mudah dibaca. Satu-satunya kesan memori ialah blok `do … end` yang membolehkan data dibebaskan lebih awal.',
        'Syntax has no performance impact: comments, whitespace, semicolons and the choice between `if` and `and/or` compile to the same or nearly the same bytecode. Choose the most readable form. The only memory effect is that `do … end` blocks let data be freed earlier.')),
    S('software_engineering',
      P('Kod yang sah tidak semestinya kod yang boleh dibaca. Bandingkan:', 'Valid code is not necessarily readable code. Compare:'),
      CODE('poor-dense', 'lua', 'lua54', ['Pelaksanaan lemah: satu baris padat tanpa struktur', 'Poor implementation: one dense line with no structure'], `
local p = 120 local q = 3 local t = p * q if t > 300 then t = t * 0.9 end print(t)
`, '324.0'),
      EXPLAIN('poor-dense',
        ['1', 'Sah dari segi sintaks dan memberi jawapan betul, tetapi nama samar, tiada inden dan tiada penerangan mengapa diskaun 10% diberikan.', 'Syntactically valid and gives the right answer, but the names are vague, there is no indentation and no explanation of why a 10% discount applies.']),
      CODE('improved-structured', 'lua', 'lua54', ['Pelaksanaan lebih baik: nama, blok dan komen yang bermakna', 'Improved implementation: meaningful names, blocks and comments'], `
local unitPrice = 120
local quantity = 3
local total = unitPrice * quantity

-- Bulk orders above RM300 get 10% off (sales policy 2026-03).
if total > 300 then
  total = total * 0.9
end

print(total)
`, '324.0'),
      EXPLAIN('improved-structured',
        ['1–3', 'Satu pernyataan setiap baris dengan nama yang menerangkan maksud.', 'One statement per line with names that explain their meaning.'],
        ['5', 'Komen menerangkan **mengapa** — peraturan perniagaan dan sumbernya.', 'The comment explains **why** — the business rule and its source.'],
        ['6–8', 'Blok `if` dengan inden yang jelas.', 'An `if` block with clear indentation.'],
        ['10', 'Output sama: 324.0.', 'The same output: 324.0.']),
      P('Pengkompil tidak peduli; manusia peduli. Kod dibaca jauh lebih kerap daripada ditulis, jadi kebolehbacaan ialah ciri kejuruteraan, bukan hiasan.', 'The compiler does not care; humans do. Code is read far more often than it is written, so readability is an engineering property, not decoration.')),
    S('industry_use_cases',
      UL(
        ['Panduan gaya pasukan (contohnya panduan gaya Lua Olivine Labs) menetapkan inden, nama dan gaya komen.', 'Team style guides (for example the Olivine Labs Lua style guide) set indentation, naming and comment style.'],
        ['Fail konfigurasi Lua (contohnya untuk Neovim atau WezTerm) bergantung pada komen untuk menerangkan setiap tetapan.', 'Lua configuration files (for example for Neovim or WezTerm) rely on comments to explain every setting.'],
        ['Helah `---[[` digunakan secara meluas untuk menghidupkan kod debug sementara.', 'The `---[[` trick is widely used to toggle temporary debug code.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `statements-blocks`, kemudian buang `local` di dalam blok `do` dan terangkan perubahan output.', 'Run `statements-blocks`, then remove `local` inside the `do` block and explain how the output changes.'],
        ['Dalam `toggle-block`, buang satu sengkang pada baris 3 dan sahkan output menjadi `normal`.', 'In `toggle-block`, remove one dash on line 3 and confirm the output becomes `normal`.'],
        ['Format semula `poor-dense` secara manual, kemudian bandingkan dengan `improved-structured`.', 'Reformat `poor-dense` by hand, then compare it with `improved-structured`.'],
      )),
    S('mini_project',
      P('**Resit kedai.** Tulis program yang mengira jumlah tiga barangan, menggunakan blok `if` untuk diskaun keahlian, dengan komen yang menerangkan setiap peraturan.', '**A shop receipt.** Write a program that totals three items, uses an `if` block for a membership discount, and has comments explaining each rule.'),
      CODE('receipt', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
-- Item prices in RM
local coffee, cake, juice = 8.50, 12.00, 6.50
local isMember = true

local subtotal = coffee + cake + juice

-- Members get 5% off the subtotal.
local discount = 0
if isMember then
  discount = subtotal * 0.05
end

print(string.format("Subtotal: %.2f", subtotal))
print(string.format("Discount: %.2f", discount))
print(string.format("Total:    %.2f", subtotal - discount))
`, 'Subtotal: 27.00\nDiscount: 1.35\nTotal:    25.65'),
      EXPLAIN('receipt',
        ['2–3', 'Harga barangan dan status keahlian dalam pemboleh ubah bernama.', 'Item prices and the membership status in named variables.'],
        ['5', 'Jumlah kecil: 8.50 + 12.00 + 6.50 = 27.00.', 'The subtotal: 8.50 + 12.00 + 6.50 = 27.00.'],
        ['8–11', 'Diskaun lalai 0; blok `if` hanya mengubahnya untuk ahli: 5% daripada 27.00 = 1.35.', 'The discount defaults to 0; the `if` block only changes it for members: 5% of 27.00 = 1.35.'],
        ['13–15', '`%.2f` memaparkan wang dengan dua tempat perpuluhan.', '`%.2f` displays money with two decimal places.'])),
    S('summary',
      UL(
        ['Pernyataan melakukan sesuatu; ungkapan menghasilkan nilai.', 'Statements do something; expressions produce values.'],
        ['Setiap blok dibuka dengan kata kunci dan ditutup dengan `end` (atau `until`).', 'Every block opens with a keyword and closes with `end` (or `until`).'],
        ['`--` untuk komen satu baris, `--[[ … ]]` untuk komen panjang, `--[==[ … ]==]` apabila teks mengandungi `]]`.', '`--` for one-line comments, `--[[ … ]]` for long comments, `--[==[ … ]==]` when the text contains `]]`.'],
        ['Mesej "X expected near Y" menunjukkan token yang hilang sebelum Y.', 'The message "X expected near Y" points to a missing token just before Y.'],
      )),
    S('knowledge_check',
      OL(
        ['Adakah `x + 1` pernyataan yang sah dengan sendirinya dalam Lua? Mengapa?', 'Is `x + 1` a valid statement on its own in Lua? Why?'],
        ['Bagaimanakah anda mengulas kod yang mengandungi `]]`?', 'How do you comment out code that contains `]]`?'],
        ['Apakah maksud mesej `\'end\' expected (to close \'if\' at line 4) near <eof>`?', 'What does the message `\'end\' expected (to close \'if\' at line 4) near <eof>` mean?'],
        ['Sebutkan tiga kata terpelihara Lua yang membuka blok.', 'Name three Lua reserved words that open a block.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.1 — Lexical Conventions', url: `${MANUAL}#3.1` },
        { title: 'Lua 5.4 Reference Manual §3.3 — Statements', url: `${MANUAL}#3.3` },
        { title: 'Lua 5.4 Reference Manual §9 — The Complete Syntax of Lua', url: `${MANUAL}#9` },
        { title: 'Olivine Labs — Lua Style Guide', url: 'https://github.com/Olivine-Labs/lua-style-guide' },
      )),
  ],
};

export const LUA101_M3 = [LUA101_3_1, LUA101_3_2, LUA101_3_3];
