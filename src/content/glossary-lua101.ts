import type { GlossaryTermDef } from '@/db/content/types';

/**
 * Click-to-Learn terms introduced by LUA101 (Introduction to Lua and Its Execution Model).
 * Every example is standard Lua 5.4 and is executed by `npm run verify:code`.
 */
const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const lua101 = (module: number, lecture: number) => ({ courseCode: 'LUA101', module, lecture });

export const LUA101_GLOSSARY: GlossaryTermDef[] = [
  {
    key: 'interpreter',
    term: 'Interpreter',
    translation: 'Penterjemah (interpreter)',
    scope: 'general',
    definition: {
      ms: 'Program yang membaca kod sumber dan menjalankannya terus, tanpa menghasilkan fail program boleh laku yang berasingan.',
      en: 'A program that reads source code and runs it directly, without producing a separate executable program file.',
    },
    explanation: {
      ms: 'Interpreter `lua` mengkompil setiap [[chunk]] kepada [[bytecode]] dalam memori, kemudian [[virtual-machine|mesin maya]] Lua menjalankan bytecode itu. Kerana kompilasi berlaku setiap kali program dimulakan, anda boleh menyunting fail dan menjalankannya semula serta-merta.',
      en: 'The `lua` interpreter compiles each [[chunk]] to [[bytecode]] in memory, then the Lua [[virtual-machine]] runs that bytecode. Because compilation happens every time the program starts, you can edit a file and run it again immediately.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'print("running on", _VERSION)', expectedOutput: 'running on\tLua 5.4' },
    related: ['chunk', 'bytecode', 'virtual-machine'],
    lectures: [lua101(1, 1), lua101(2, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual §7 — Lua Standalone', url: `${MANUAL}#7` }],
  },
  {
    key: 'embedding',
    term: 'Embedding',
    translation: 'Pembenaman',
    scope: 'lua',
    definition: {
      ms: 'Memasukkan interpreter Lua sebagai pustaka ke dalam aplikasi lain (hos) supaya aplikasi itu boleh menjalankan skrip Lua.',
      en: 'Placing the Lua interpreter as a library inside another application (the host) so that the application can run Lua scripts.',
    },
    explanation: {
      ms: 'Hos menyediakan keupayaan (fungsi, data) dan skrip Lua membuat keputusan. Hos boleh menghadkan apa yang dilihat oleh skrip dengan memberinya persekitaran global sendiri — teknik yang dipanggil **sandboxing**.',
      en: 'The host provides capabilities (functions, data) and the Lua script makes decisions. The host can limit what a script sees by giving it its own global environment — a technique called **sandboxing**.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local env = {}\nload("speed = 42", "=config", "t", env)()\nprint(env.speed)',
      expectedOutput: '42',
    },
    related: ['chunk', 'interpreter'],
    lectures: [lua101(1, 2)],
    references: [{ title: 'Lua 5.4 Reference Manual §4 — The Application Program Interface', url: `${MANUAL}#4` }],
  },
  {
    key: 'chunk',
    term: 'Chunk',
    translation: 'Chunk (unit kod)',
    scope: 'lua',
    definition: {
      ms: 'Unit kod yang dikompil dan dijalankan oleh Lua sekali gus: sebuah fail, satu baris dalam REPL, atau string yang dihantar kepada `load`.',
      en: 'A unit of code that Lua compiles and runs as a whole: a file, one line in the REPL, or a string passed to `load`.',
    },
    explanation: {
      ms: 'Lua menganggap setiap chunk sebagai badan sebuah fungsi tanpa nama. Kerana itu chunk boleh mempunyai pemboleh ubah `local`, menerima argumen melalui `...` dan memulangkan nilai dengan `return`.',
      en: 'Lua treats every chunk as the body of an anonymous function. That is why a chunk can have `local` variables, receive arguments through `...` and return values with `return`.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local chunk = load("local a, b = ... return a * b")\nprint(chunk(6, 7))',
      expectedOutput: '42',
    },
    related: ['bytecode', 'function'],
    lectures: [lua101(3, 1), lua101(1, 2)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.2 — Chunks', url: `${MANUAL}#3.3.2` }],
  },
  {
    key: 'bytecode',
    term: 'Bytecode',
    translation: 'Kod bait (bytecode)',
    scope: 'general',
    definition: {
      ms: 'Arahan ringkas dalam bentuk binari yang dihasilkan oleh pengkompil dan dijalankan oleh mesin maya, bukan terus oleh CPU.',
      en: 'Compact binary instructions produced by a compiler and executed by a virtual machine, not directly by the CPU.',
    },
    explanation: {
      ms: 'Lua mengkompil kod sumber kepada bytecode sebelum menjalankannya. `string.dump` memberikan bytecode sesuatu fungsi, dan `luac` menyimpannya ke fail. Bytecode tidak mudah alih antara versi Lua dan tidak boleh dipercayai daripada sumber luar.',
      en: 'Lua compiles source code to bytecode before running it. `string.dump` gives the bytecode of a function, and `luac` saves it to a file. Bytecode is not portable between Lua versions and must not be trusted from outside sources.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local binary = string.dump(function() return 6 * 7 end)\nprint(binary:sub(2, 4), load(binary, "=dumped", "b")())',
      expectedOutput: 'Lua\t42',
    },
    related: ['chunk', 'virtual-machine'],
    lectures: [lua101(3, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual — string.dump', url: `${MANUAL}#pdf-string.dump` }],
  },
  {
    key: 'virtual-machine',
    term: 'Virtual Machine',
    translation: 'Mesin maya',
    scope: 'general',
    definition: {
      ms: 'Program yang meniru komputer ringkas: ia membaca arahan [[bytecode]] satu demi satu dan melaksanakannya.',
      en: 'A program that imitates a simple computer: it reads [[bytecode]] instructions one by one and carries them out.',
    },
    explanation: {
      ms: 'Mesin maya Lua (sejak 5.0) berasaskan **daftar** (register): setiap panggilan fungsi mendapat bingkai daftar pada stack Lua, tempat pemboleh ubah `local` disimpan. Setiap panggilan fungsi menambah bingkai baharu pada [[call-stack|stack panggilan]].',
      en: 'The Lua virtual machine (since 5.0) is **register-based**: every function call gets a frame of registers on the Lua stack, where `local` variables live. Every function call adds a new frame to the [[call-stack]].',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local function depth(n)\n  if n == 0 then return 0 end\n  return 1 + depth(n - 1)\nend\nprint(depth(100))',
      expectedOutput: '100',
    },
    related: ['bytecode', 'call-stack', 'interpreter'],
    lectures: [lua101(3, 2)],
    references: [{ title: 'R. Ierusalimschy et al. — The Implementation of Lua 5.0', url: 'https://www.lua.org/doc/jucs05.pdf' }],
  },
  {
    key: 'call-stack',
    term: 'Call Stack',
    translation: 'Stack panggilan',
    scope: 'general',
    definition: {
      ms: 'Senarai fungsi yang sedang dipanggil, dengan fungsi terbaharu di atas. Setiap entri ialah satu bingkai (frame).',
      en: 'The list of functions currently being called, with the most recent on top. Each entry is one frame.',
    },
    explanation: {
      ms: 'Apabila fungsi A memanggil B, bingkai B diletakkan di atas A. Apabila B pulang, bingkainya dibuang. [[stack-traceback]] ialah cetakan stack ini semasa ralat berlaku. Rekursi tanpa had memenuhkan stack dan menghasilkan ralat `stack overflow`.',
      en: 'When function A calls B, B’s frame is placed on top of A’s. When B returns, its frame is removed. A [[stack-traceback]] is a printout of this stack at the moment an error happens. Unbounded recursion fills the stack and produces a `stack overflow` error.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local function inner() return debug.getinfo(2, "n").name end\nlocal function outer() return inner() .. " called inner" end\nprint(outer())',
      expectedOutput: 'outer called inner',
    },
    related: ['virtual-machine', 'stack-traceback', 'function'],
    lectures: [lua101(3, 2), lua101(4, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual — debug.getinfo', url: `${MANUAL}#pdf-debug.getinfo` }],
  },
  {
    key: 'repl',
    term: 'REPL',
    translation: 'REPL (gelung baca–nilai–cetak)',
    scope: 'general',
    definition: {
      ms: 'Read–Eval–Print Loop: mod interaktif yang membaca satu baris kod, menilainya, mencetak hasilnya dan menunggu baris seterusnya.',
      en: 'Read–Eval–Print Loop: an interactive mode that reads one line of code, evaluates it, prints the result and waits for the next line.',
    },
    explanation: {
      ms: 'Menjalankan `lua` tanpa nama fail membuka REPL. Sejak Lua 5.3, menaip ungkapan seperti `2 + 3` terus memaparkan `5`. REPL sesuai untuk mencuba idea kecil; program sebenar ditulis dalam fail `.lua`.',
      en: 'Running `lua` without a file name opens the REPL. Since Lua 5.3, typing an expression such as `2 + 3` displays `5` directly. The REPL suits trying out small ideas; real programs are written in `.lua` files.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local line = "2 + 3 * 4"\nprint(load("return " .. line)())',
      expectedOutput: '14',
    },
    related: ['chunk', 'interpreter'],
    lectures: [lua101(2, 2)],
    references: [{ title: 'Lua 5.4 Reference Manual §7 — Lua Standalone', url: `${MANUAL}#7` }],
  },
  {
    key: 'language-server',
    term: 'Language Server',
    translation: 'Pelayan bahasa',
    scope: 'general',
    definition: {
      ms: 'Program latar belakang yang memberi editor kod maklumat tentang bahasa: pelengkapan automatik, amaran, pergi-ke-definisi dan dokumentasi.',
      en: 'A background program that gives a code editor knowledge of a language: completion, warnings, go-to-definition and documentation.',
    },
    explanation: {
      ms: 'Untuk Lua, pelayan bahasa yang paling banyak digunakan ialah **LuaLS** (lua-language-server). Ia membaca komen anotasi `---@param` dan `---@return` untuk memahami jenis. Anotasi itu hanyalah komen: Lua sendiri mengabaikannya, jadi kod tetap berjalan seperti biasa.',
      en: 'For Lua, the most widely used language server is **LuaLS** (lua-language-server). It reads `---@param` and `---@return` annotation comments to understand types. Those annotations are only comments: Lua itself ignores them, so the code runs as usual.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: '---@param width number\n---@param height number\n---@return number\nlocal function area(width, height) return width * height end\nprint(area(3, 4))',
      expectedOutput: '12',
    },
    related: ['comment', 'function'],
    lectures: [lua101(2, 3)],
    references: [{ title: 'Lua Language Server (LuaLS) — documentation', url: 'https://luals.github.io/' }],
  },
  {
    key: 'comment',
    term: 'Comment',
    translation: 'Komen',
    scope: 'general',
    definition: {
      ms: 'Teks dalam kod sumber yang diabaikan oleh Lua; ditulis untuk pembaca manusia.',
      en: 'Text in source code that Lua ignores; written for human readers.',
    },
    explanation: {
      ms: 'Dalam Lua, `--` memulakan komen satu baris dan `--[[ … ]]` komen berbilang baris. Komen yang baik menerangkan **mengapa** kod ditulis begitu, bukan mengulang apa yang kod itu sudah katakan.',
      en: 'In Lua, `--` starts a one-line comment and `--[[ … ]]` a multi-line comment. Good comments explain **why** code is written that way, not repeat what the code already says.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: '--[[ Tax rate is fixed by regulation\n     and reviewed every year. ]]\nlocal TAX = 0.06 -- 6%\nprint(100 * TAX)',
      expectedOutput: '6.0',
    },
    related: ['language-server'],
    lectures: [lua101(3, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.1 — Lexical Conventions', url: `${MANUAL}#3.1` }],
  },
  {
    key: 'escape-sequence',
    term: 'Escape Sequence',
    translation: 'Jujukan escape',
    scope: 'general',
    definition: {
      ms: 'Gabungan garis condong terbalik `\\` dan aksara lain dalam string literal yang mewakili aksara khas, contohnya `\\n` untuk baris baharu.',
      en: 'A backslash `\\` combined with another character inside a string literal that stands for a special character, for example `\\n` for a newline.',
    },
    explanation: {
      ms: 'Escape biasa dalam Lua: `\\n` baris baharu, `\\t` tab, `\\\\` garis condong terbalik, `\\"` tanda petik, `\\u{XXX}` aksara Unicode (5.3+) dan `\\z` untuk melangkau ruang kosong. String panjang `[[ … ]]` tidak memproses escape sama sekali.',
      en: 'Common Lua escapes: `\\n` newline, `\\t` tab, `\\\\` backslash, `\\"` quote, `\\u{XXX}` a Unicode character (5.3+) and `\\z` to skip whitespace. Long strings `[[ … ]]` do not process escapes at all.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'print("Name:\\tAisyah\\nScore:\\t\\u{2605}5")', expectedOutput: 'Name:\tAisyah\nScore:\t★5' },
    related: ['comment'],
    lectures: [lua101(4, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.1 — Lexical Conventions (string literals)', url: `${MANUAL}#3.1` }],
  },
  {
    key: 'standard-input',
    term: 'Standard Input (stdin)',
    translation: 'Input standard (stdin)',
    scope: 'general',
    definition: {
      ms: 'Saluran input lalai sebuah program — biasanya papan kekunci, atau fail/teks yang dihantar ke program.',
      en: 'A program’s default input channel — usually the keyboard, or a file or text piped into the program.',
    },
    explanation: {
      ms: 'Dalam Lua, `io.read` membaca daripada stdin. Format `"l"` membaca satu baris, `"n"` membaca nombor dan `"a"` membaca semuanya. Apabila input habis, `io.read` memulangkan `nil` — program mesti bersedia untuk itu.',
      en: 'In Lua, `io.read` reads from stdin. Format `"l"` reads a line, `"n"` reads a number and `"a"` reads everything. When input runs out, `io.read` returns `nil` — programs must be ready for that.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local name = io.read("l")\nprint("Hello, " .. (name or "stranger"))',
      expectedOutput: 'Hello, stranger',
    },
    related: ['stack-traceback'],
    lectures: [lua101(4, 2)],
    references: [{ title: 'Lua 5.4 Reference Manual — io.read', url: `${MANUAL}#pdf-io.read` }],
  },
  {
    key: 'stack-traceback',
    term: 'Stack Traceback',
    translation: 'Jejak stack (stack traceback)',
    scope: 'general',
    definition: {
      ms: 'Senarai panggilan fungsi yang aktif ketika ralat berlaku, dari yang terbaharu ke yang terlama, dengan fail dan nombor baris.',
      en: 'The list of active function calls when an error happened, from most recent to oldest, with file and line numbers.',
    },
    explanation: {
      ms: 'Baris pertama mesej ralat memberitahu **apa** yang salah; traceback memberitahu **bagaimana** program sampai ke situ. Baca dari atas: baris pertama ialah tempat ralat dicetuskan, baris seterusnya ialah pemanggilnya. `debug.traceback` menghasilkan teks ini.',
      en: 'The first line of an error message tells you **what** went wrong; the traceback tells you **how** the program got there. Read from the top: the first entry is where the error was raised, the next entries are its callers. `debug.traceback` produces this text.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local ok, err = pcall(error, "disk full")\nprint(ok, err)',
      expectedOutput: 'false\tdisk full',
    },
    related: ['call-stack', 'function'],
    lectures: [lua101(4, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual — debug.traceback', url: `${MANUAL}#pdf-debug.traceback` }],
  },
];
