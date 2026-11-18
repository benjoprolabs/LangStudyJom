import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA101 · Module 2 — The Lua Environment (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const DOWNLOAD = 'https://www.lua.org/download.html';

// ─── 2.1 Installing the lua interpreter and checking the version ───────────

export const LUA101_2_1: LectureContentDef = {
  courseCode: 'LUA101',
  module: 2,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Memasang [[interpreter]] Lua 5.4 pada Windows, macOS atau Linux.', 'Install the Lua 5.4 [[interpreter]] on Windows, macOS or Linux.'],
        ['Menyemak versi dari terminal (`lua -v`) dan dari dalam program (`_VERSION`).', 'Check the version from the terminal (`lua -v`) and from inside a program (`_VERSION`).'],
        ['Menyemak pustaka standard yang tersedia dalam sesuatu pemasangan.', 'Check which standard libraries are available in an installation.'],
        ['Menulis semakan versi yang tidak rosak apabila versi baharu dikeluarkan.', 'Write a version check that does not break when a new version is released.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1: apakah Lua dan perbezaan antara versi.', 'Module 1: what Lua is and how versions differ.'],
        ['Membuka terminal dan menaip arahan.', 'Opening a terminal and typing commands.'],
      )),
    S('introduction',
      P('Sebelum menulis program, anda perlukan interpreter `lua` pada komputer anda. Lua sangat kecil — pemasangan biasanya hanya beberapa ratus kilobait. Namun pengurus pakej yang berbeza memasang versi yang berbeza, jadi langkah pertama selepas memasang ialah **menyemak versi**. Kuliah ini menunjukkan cara memasang Lua dan cara program boleh mengesahkan persekitarannya sendiri.',
        'Before writing programs, you need the `lua` interpreter on your computer. Lua is tiny — an installation is usually a few hundred kilobytes. But different package managers install different versions, so the first step after installing is to **check the version**. This lecture shows how to install Lua and how a program can verify its own environment.'),
      KEY('Selepas memasang, jalankan `lua -v`. Output seperti `Lua 5.4.6  Copyright (C) 1994-2023 Lua.org, PUC-Rio` mengesahkan versi dan nombor tampalan.', 'After installing, run `lua -v`. Output such as `Lua 5.4.6  Copyright (C) 1994-2023 Lua.org, PUC-Rio` confirms the version and patch number.', ['Langkah pertama', 'First step'])),
    S('fundamental_concepts',
      UL(
        ['**Linux:** `sudo apt install lua5.4` (Debian/Ubuntu) atau `sudo dnf install lua` (Fedora). Arahan mungkin bernama `lua5.4`.', '**Linux:** `sudo apt install lua5.4` (Debian/Ubuntu) or `sudo dnf install lua` (Fedora). The command may be called `lua5.4`.'],
        ['**macOS:** `brew install lua` dengan Homebrew.', '**macOS:** `brew install lua` with Homebrew.'],
        ['**Windows:** binari daripada projek LuaBinaries, atau `scoop install lua`. Tambah folder ke `PATH` supaya `lua` boleh dipanggil dari mana-mana.', '**Windows:** binaries from the LuaBinaries project, or `scoop install lua`. Add the folder to `PATH` so `lua` can be called from anywhere.'],
        ['**Daripada sumber:** muat turun `lua-5.4.x.tar.gz` dari lua.org dan jalankan `make` — Lua hanya memerlukan pengkompil C.', '**From source:** download `lua-5.4.x.tar.gz` from lua.org and run `make` — Lua only needs a C compiler.'],
        ['**Nombor versi:** `5.4` ialah versi bahasa; `5.4.6` menambah nombor tampalan (pembetulan pepijat, tiada perubahan bahasa).', '**Version numbers:** `5.4` is the language version; `5.4.6` adds the patch number (bug fixes, no language changes).'],
      )),
    S('detailed_theory',
      P('Interpreter berdiri sendiri `lua` ialah program C kecil (`lua.c`) yang membenamkan pustaka Lua. Apabila dimulakan, ia membuka **semua** pustaka standard — `string`, `table`, `math`, `io`, `os`, `utf8`, `coroutine`, `debug` dan `package` — dan menyimpan setiap satu sebagai table global. Ia juga membaca pemboleh ubah persekitaran `LUA_INIT` dan menjalankannya sebelum skrip anda. Hos lain mungkin membuka set pustaka yang lebih kecil, sebab itu program yang mudah alih menyemak kewujudan pustaka sebelum menggunakannya.',
        'The standalone `lua` interpreter is a small C program (`lua.c`) that embeds the Lua library. When it starts, it opens **all** standard libraries — `string`, `table`, `math`, `io`, `os`, `utf8`, `coroutine`, `debug` and `package` — and stores each as a global table. It also reads the `LUA_INIT` environment variable and runs it before your script. Other hosts may open a smaller set of libraries, which is why portable programs check that a library exists before using it.'),
      P('`_VERSION` hanya mengandungi versi bahasa ("Lua 5.4"), bukan nombor tampalan, kerana tampalan tidak mengubah bahasa. Untuk membandingkan versi dengan betul, ekstrak nombor utama dan kecil dan bandingkan sebagai **nombor**. Perbandingan string seperti `_VERSION == "Lua 5.4"` akan gagal pada Lua 5.5 walaupun program itu sebenarnya serasi.',
        '`_VERSION` holds only the language version ("Lua 5.4"), not the patch number, because patches do not change the language. To compare versions correctly, extract the major and minor numbers and compare them as **numbers**. A string comparison such as `_VERSION == "Lua 5.4"` would fail on Lua 5.5 even if the program is compatible.')),
    S('technical_terminology', TERMS('interpreter', 'variable', 'table')),
    S('syntax_rules',
      UL(
        ['`lua -v` memaparkan versi; `lua fail.lua` menjalankan skrip; `lua` sahaja membuka [[repl|REPL]].', '`lua -v` shows the version; `lua file.lua` runs a script; `lua` alone opens the [[repl|REPL]].'],
        ['`lua -e "kod"` menjalankan kod terus dari baris arahan.', '`lua -e "code"` runs code directly from the command line.'],
        ['`_VERSION` ialah string global; `math.maxinteger` ialah integer terbesar (5.3+).', '`_VERSION` is a global string; `math.maxinteger` is the largest integer (5.3+).'],
        ['`string:match(corak)` mengekstrak bahagian string; `%d+` bermaksud satu atau lebih digit.', '`string:match(pattern)` extracts part of a string; `%d+` means one or more digits.'],
      )),
    S('code_demonstration',
      CODE('check-version', 'lua', 'lua54', ['Menyemak persekitaran dari dalam program', 'Checking the environment from inside a program'], `
print(_VERSION)
print(math.maxinteger)
print(math.type(math.maxinteger))
`, 'Lua 5.4\n9223372036854775807\ninteger'),
      EXPLAIN('check-version',
        ['1', 'Versi bahasa yang sedang menjalankan program.', 'The language version currently running the program.'],
        ['2', '`math.maxinteger` ialah 2⁶³ − 1. Nilai ini membuktikan interpreter menggunakan integer 64-bit, standard sejak 5.3.', '`math.maxinteger` is 2⁶³ − 1. This value proves the interpreter uses 64-bit integers, the default since 5.3.'],
        ['3', 'Mengesahkan nilai itu benar-benar subjenis integer, bukan float.', 'Confirms the value really is the integer subtype, not a float.'])),
    S('complete_examples',
      CODE('library-report', 'lua', 'lua54', ['Pustaka standard yang tersedia', 'Which standard libraries are available'], `
local libraries = {"string", "table", "math", "io", "os", "utf8", "coroutine", "debug"}

for _, name in ipairs(libraries) do
  print(name, type(_G[name]))
end
`, 'string\ttable\ntable\ttable\nmath\ttable\nio\ttable\nos\ttable\nutf8\ttable\ncoroutine\ttable\ndebug\ttable'),
      EXPLAIN('library-report',
        ['1', 'Senarai nama pustaka yang ingin disemak.', 'The list of library names to check.'],
        ['3–5', '`_G` ialah table semua global. `_G[name]` mencari pustaka mengikut nama; `type` memulangkan `"table"` jika ia wujud atau `"nil"` jika tidak dibuka oleh hos.', '`_G` is the table of all globals. `_G[name]` looks a library up by name; `type` returns `"table"` if it exists or `"nil"` if the host did not open it.']),
      CODE('version-numbers', 'lua', 'lua54', ['Membandingkan versi sebagai nombor', 'Comparing versions as numbers'], `
local major, minor = _VERSION:match("(%d+)%.(%d+)")
major, minor = tonumber(major), tonumber(minor)

print(major, minor)
print("5.3 or newer:", major > 5 or (major == 5 and minor >= 3))
`, '5\t4\n5.3 or newer:\ttrue', {
        debug: BUG(`
local major, minor = _VERSION:match("(%d+)%.(%d+)")

print(major, minor)
print("5.3 or newer:", major > 5 or (major == 5 and minor >= 3))
`, "example:4: attempt to compare number with string",
          '`match` memulangkan **string** `"5"` dan `"4"`, bukan nombor. Lua tidak menukar string kepada nombor untuk perbandingan `>` (hanya untuk aritmetik), jadi `"5" > 5` ialah ralat. Mesej "compare number with string" menunjukkan dua jenis berbeza bertemu. Betulkan dengan `tonumber` seperti dalam versi asal.',
          '`match` returns the **strings** `"5"` and `"4"`, not numbers. Lua does not convert strings to numbers for the `>` comparison (only for arithmetic), so `"5" > 5` is an error. The message "compare number with string" shows two different types met. Fix it with `tonumber` as in the original version.'),
      }),
      EXPLAIN('version-numbers',
        ['1', 'Corak `(%d+)%.(%d+)` menangkap dua kumpulan digit yang dipisahkan oleh titik (`%.` ialah titik literal). `match` memulangkan kedua-dua tangkapan.', 'The pattern `(%d+)%.(%d+)` captures two groups of digits separated by a dot (`%.` is a literal dot). `match` returns both captures.'],
        ['2', 'Tangkapan ialah string; `tonumber` menukarnya kepada nombor supaya boleh dibandingkan.', 'Captures are strings; `tonumber` converts them to numbers so they can be compared.'],
        ['4–5', 'Perbandingan berangka: benar untuk 5.3, 5.4 dan juga 6.0 pada masa hadapan.', 'A numeric comparison: true for 5.3, 5.4 and also a future 6.0.'])),
    S('line_by_line',
      EXPLAIN('check-version',
        ['2–3', 'Program yang bergantung pada integer besar (contohnya ID pangkalan data) patut menyemak nilai ini, kerana Lua boleh dikompil dengan integer 32-bit pada peranti kecil.', 'Programs that rely on large integers (for example database IDs) should check this value, because Lua can be compiled with 32-bit integers on small devices.']),
      EXPLAIN('version-numbers',
        ['5', '`or` dan `and` menilai secara pintas: jika `major > 5`, bahagian kanan tidak dinilai sama sekali.', '`or` and `and` short-circuit: if `major > 5`, the right-hand side is not evaluated at all.'])),
    S('why_this_way',
      P('Mengapa program perlu menyemak persekitarannya? Kerana kod Lua dijalankan di banyak hos yang berbeza: interpreter penuh, enjin permainan dengan pustaka terhad, atau peranti dengan integer 32-bit. Semakan awal yang jelas menukar kegagalan misteri di tengah program kepada mesej yang tepat pada permulaan. Pengaturcara melakukannya **apabila** mereka mengedarkan skrip kepada orang lain atau menyokong lebih daripada satu versi.',
        'Why should a program check its environment? Because Lua code runs in many different hosts: the full interpreter, game engines with restricted libraries, or devices with 32-bit integers. An early, clear check turns a mysterious failure in the middle of the program into a precise message at the start. Developers do this **when** they distribute scripts to other people or support more than one version.')),
    S('execution_flow',
      OL(
        ['Sistem pengendalian mencari `lua` dalam `PATH` dan memulakannya.', 'The operating system finds `lua` in `PATH` and starts it.'],
        ['`lua.c` mencipta keadaan Lua dan membuka pustaka standard.', '`lua.c` creates a Lua state and opens the standard libraries.'],
        ['Ia menjalankan `LUA_INIT` (jika ada), kemudian memuatkan dan menjalankan fail skrip anda.', 'It runs `LUA_INIT` (if set), then loads and runs your script file.'],
        ['Dalam `version-numbers`, `match` mengimbas `"Lua 5.4"` dan memulangkan `"5"` dan `"4"`; `tonumber` menukarnya; perbandingan dinilai.', 'In `version-numbers`, `match` scans `"Lua 5.4"` and returns `"5"` and `"4"`; `tonumber` converts them; the comparison is evaluated.'],
        ['Apabila skrip tamat, `lua` menutup keadaan dan keluar dengan status 0.', 'When the script ends, `lua` closes the state and exits with status 0.'],
      )),
    S('memory_behaviour',
      P('Interpreter yang baru dimulakan menggunakan hanya beberapa ratus kilobait memori. Setiap pustaka standard ialah satu table dengan fungsi C; string seperti `_VERSION` disimpan sekali sahaja kerana Lua meng-intern string pendek. `math.maxinteger` dan `tonumber("5")` tidak menggunakan heap — integer disimpan terus dalam nilai.',
        'A freshly started interpreter uses only a few hundred kilobytes of memory. Each standard library is one table of C functions; strings such as `_VERSION` are stored once because Lua interns short strings. `math.maxinteger` and `tonumber("5")` use no heap — integers are stored directly in the value.')),
    S('alternative_implementations',
      P('Daripada menghuraikan `_VERSION`, anda boleh menguji **ciri** yang diperlukan secara terus. Ini selalunya lebih tepat kerana hos boleh membuang pustaka walaupun versinya baharu:', 'Instead of parsing `_VERSION`, you can test for the **features** you need directly. This is often more accurate because a host can remove libraries even when its version is new:'),
      CODE('feature-check', 'lua', 'lua54', ['Pengesanan ciri', 'Feature detection'], `
local hasUtf8 = utf8 ~= nil
local hasIntegers = math.type ~= nil
print(hasUtf8, hasIntegers)
print(hasUtf8 and utf8.len("Kuala Lumpur ✓") or "no utf8")
`, 'true\ttrue\n14'),
      EXPLAIN('feature-check',
        ['1–2', 'Ujian ciri: adakah table `utf8` dan fungsi `math.type` wujud?', 'Feature tests: do the `utf8` table and the `math.type` function exist?'],
        ['3', 'Memaparkan keputusan ujian.', 'Displays the test results.'],
        ['4', '`utf8.len` mengira **aksara**, bukan bait: "✓" ialah 3 bait tetapi 1 aksara, jadi hasilnya 14.', '`utf8.len` counts **characters**, not bytes: "✓" is 3 bytes but 1 character, so the result is 14.'])),
    S('common_mistakes',
      UL(
        ['Memasang Lua 5.1 atau LuaJIT secara tidak sengaja (sesetengah pengedaran menamakannya `lua`) dan hairan mengapa `//` gagal.', 'Accidentally installing Lua 5.1 or LuaJIT (some distributions call it `lua`) and wondering why `//` fails.'],
        ['Terlupa menambah folder Lua ke `PATH` pada Windows, lalu terminal berkata arahan tidak dijumpai.', 'Forgetting to add the Lua folder to `PATH` on Windows, so the terminal says the command is not found.'],
        ['Membandingkan versi sebagai string (`_VERSION == "Lua 5.4"`).', 'Comparing versions as strings (`_VERSION == "Lua 5.4"`).'],
        ['Menganggap setiap hos membuka pustaka `io` dan `os`.', 'Assuming every host opens the `io` and `os` libraries.'],
      )),
    S('debugging',
      P('Masalah pemasangan biasanya kelihatan di terminal, bukan dalam Lua: "command not found" bermaksud `PATH` salah; versi yang tidak dijangka bermaksud terdapat beberapa pemasangan. Gunakan `which lua` (Linux/macOS) atau `where lua` (Windows) untuk melihat fail mana yang dijalankan. Di dalam Lua, ralat versi sering berpunca daripada medan yang tidak wujud — seperti contoh berikut yang tersalah ejaan nama medan:',
        'Installation problems usually show up in the terminal, not in Lua: "command not found" means `PATH` is wrong; an unexpected version means there are several installations. Use `which lua` (Linux/macOS) or `where lua` (Windows) to see which file runs. Inside Lua, version problems often come from a field that does not exist — like the following example with a misspelled field name:'),
      CODE('max-integer', 'lua', 'lua54', ['Had integer dan limpahan (overflow)', 'Integer limits and overflow'], `
local big = math.maxinteger
print(big + 1 == math.mininteger)
`, 'true', {
        debug: BUG(`
local big = math.maxInteger
print(big + 1 == math.mininteger)
`, "example:2: attempt to perform arithmetic on a nil value (local 'big')",
          'Nama medan sebenar ialah `maxinteger` (huruf kecil). `math.maxInteger` ialah medan yang tidak wujud, jadi `big` ialah `nil` — dan ralat hanya muncul pada baris 2, apabila nilai itu **digunakan**. Apabila mesej menyebut `nil`, jejaki ke belakang ke tempat nilai itu diberikan.',
          'The real field name is `maxinteger` (lower case). `math.maxInteger` is a field that does not exist, so `big` is `nil` — and the error only appears on line 2, when the value is **used**. When a message mentions `nil`, trace back to where the value was assigned.'),
      }),
      EXPLAIN('max-integer',
        ['1', 'Integer terbesar disimpan dalam local.', 'The largest integer is stored in a local.'],
        ['2', 'Menambah 1 melepasi had dan "berbalik" ke integer terkecil (`math.mininteger`). Integer Lua tidak membaling ralat semasa limpahan — anda mesti menyemak sendiri jika ia penting.', 'Adding 1 goes past the limit and "wraps around" to the smallest integer (`math.mininteger`). Lua integers do not raise an error on overflow — you must check yourself if it matters.'])),
    S('performance',
      P('Kelajuan interpreter berbeza antara pemasangan: binari yang dikompil dengan pengoptimuman (`-O2`) lebih pantas daripada binari nyahpepijat. Untuk kerja harian, pakej daripada pengurus pakej adalah memadai. Semakan versi dan ciri hanya berjalan sekali semasa permulaan, jadi kosnya diabaikan.',
        'Interpreter speed differs between installations: a binary compiled with optimisation (`-O2`) is faster than a debug build. For daily work, the package-manager build is enough. Version and feature checks run once at start-up, so their cost is negligible.')),
    S('software_engineering',
      P('Semakan versi yang lemah membandingkan string; versi yang lebih baik membandingkan nombor dan memberi mesej yang boleh diambil tindakan:', 'A poor version check compares strings; a better one compares numbers and gives an actionable message:'),
      CODE('poor-version-check', 'lua', 'lua54', ['Pelaksanaan lemah: perbandingan string', 'Poor implementation: string comparison'], `
if _VERSION ~= "Lua 5.4" then
  print("unsupported Lua version")
else
  print("ok")
end
`, 'ok'),
      EXPLAIN('poor-version-check',
        ['1–5', 'Berfungsi hari ini, tetapi Lua 5.5 akan ditolak walaupun serasi, dan mesej tidak memberitahu pengguna apa yang perlu dilakukan.', 'Works today, but Lua 5.5 would be rejected even if compatible, and the message does not tell the user what to do.']),
      CODE('improved-version-check', 'lua', 'lua54', ['Pelaksanaan lebih baik: semakan versi minimum', 'Improved implementation: a minimum-version check'], `
local function requireLua(minMajor, minMinor)
  local major, minor = _VERSION:match("(%d+)%.(%d+)")
  major, minor = tonumber(major), tonumber(minor)
  local ok = major > minMajor or (major == minMajor and minor >= minMinor)
  assert(ok, ("this program needs Lua %d.%d+ (found %s)"):format(minMajor, minMinor, _VERSION))
end

requireLua(5, 3)
print("ok")
`, 'ok', {
        debug: BUG(`
local function requireLua(minMajor, minMinor)
  local major, minor = _VERSION:match("(%d+)%.(%d+)")
  major, minor = tonumber(major), tonumber(minor)
  local ok = major > minMajor or (major == minMajor and minor >= minMinor)
  assert(ok, ("this program needs Lua %d.%d+ (found %s)"):format(minMajor, minMinor, _VERSION))
end

requireLua(5, 5)
print("ok")
`, "example:5: this program needs Lua 5.5+ (found Lua 5.4)",
          'Di sini program meminta Lua 5.5, jadi semakan gagal **dengan sengaja**. `assert` menyerahkan mesej anda kepada `error`, yang menambah kedudukan baris `assert` (`example:5:`) di hadapannya. Selebihnya mesej ialah teks anda tepat seperti ditulis — itulah sebabnya mesej `assert` mesti lengkap: apa yang diperlukan dan apa yang ditemui.',
          'Here the program asks for Lua 5.5, so the check fails **on purpose**. `assert` hands your message to `error`, which prefixes the position of the `assert` line (`example:5:`). The rest of the message is your text exactly as written — that is why an `assert` message must be complete: what was required and what was found.'),
      }),
      EXPLAIN('improved-version-check',
        ['1–3', 'Fungsi yang boleh digunakan semula mengekstrak dan menukar nombor versi.', 'A reusable function extracts and converts the version numbers.'],
        ['4', 'Perbandingan berangka yang menerima versi sama atau lebih baharu.', 'A numeric comparison that accepts the same or a newer version.'],
        ['5', '`assert(syarat, mesej)` membaling ralat dengan mesej jika syarat palsu. `("…"):format(…)` membina mesej yang menyatakan apa yang diperlukan dan apa yang ditemui.', '`assert(condition, message)` raises an error with the message if the condition is false. `("…"):format(…)` builds a message stating what is required and what was found.'],
        ['8–9', 'Program meminta 5.3+ dan diteruskan.', 'The program asks for 5.3+ and continues.'])),
    S('industry_use_cases',
      UL(
        ['Pengurus pakej **LuaRocks** merekodkan versi Lua yang disokong oleh setiap pakej (`lua >= 5.1`).', 'The **LuaRocks** package manager records which Lua versions each package supports (`lua >= 5.1`).'],
        ['Saluran CI menguji pustaka pada beberapa versi (5.1, 5.3, 5.4, LuaJIT) dengan tindakan seperti `leafo/gh-actions-lua`.', 'CI pipelines test libraries on several versions (5.1, 5.3, 5.4, LuaJIT) with actions such as `leafo/gh-actions-lua`.'],
        ['Pemasang aplikasi yang membenamkan Lua menghantar interpreter sendiri supaya versi sentiasa diketahui.', 'Installers of applications that embed Lua ship their own interpreter so the version is always known.'],
      )),
    S('practical_demonstration',
      OL(
        ['Pasang Lua 5.4 mengikut sistem pengendalian anda dan jalankan `lua -v`.', 'Install Lua 5.4 for your operating system and run `lua -v`.'],
        ['Jalankan `lua -e "print(_VERSION, math.maxinteger)"` dan bandingkan dengan output `check-version`.', 'Run `lua -e "print(_VERSION, math.maxinteger)"` and compare with the `check-version` output.'],
        ['Simpan `improved-version-check` sebagai `check.lua`, tukar keperluan kepada 5.5 dan jalankan semula.', 'Save `improved-version-check` as `check.lua`, change the requirement to 5.5 and run it again.'],
      )),
    S('mini_project',
      P('**Pemeriksa persekitaran.** Tulis skrip yang mencetak laporan ringkas: versi, saiz integer dan sama ada pustaka `io` dan `utf8` tersedia, dengan keputusan akhir "READY" atau "NOT READY".', '**An environment checker.** Write a script that prints a short report: version, integer size and whether the `io` and `utf8` libraries are available, with a final verdict of "READY" or "NOT READY".'),
      CODE('env-checker', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local checks = {
  {"version", _VERSION},
  {"64-bit integers", math.maxinteger == 9223372036854775807},
  {"io library", io ~= nil},
  {"utf8 library", utf8 ~= nil},
}

local ready = true
for _, check in ipairs(checks) do
  print(string.format("%-16s %s", check[1], tostring(check[2])))
  if check[2] == false then ready = false end
end
print(ready and "READY" or "NOT READY")
`, 'version          Lua 5.4\n64-bit integers  true\nio library       true\nutf8 library     true\nREADY'),
      EXPLAIN('env-checker',
        ['1–6', 'Setiap semakan ialah pasangan `{label, keputusan}`; keputusan boleh berupa string atau boolean.', 'Each check is a `{label, result}` pair; the result may be a string or a boolean.'],
        ['8', 'Andaikan sedia sehingga satu semakan gagal.', 'Assume ready until a check fails.'],
        ['9–12', '`%-16s` mengisi label ke kiri hingga 16 aksara supaya lajur sejajar. Hanya keputusan yang tepat `false` menjadikan laporan "NOT READY".', '`%-16s` left-pads the label to 16 characters so the columns line up. Only a result that is exactly `false` makes the report "NOT READY".'],
        ['13', 'Keputusan akhir dengan idiom `a and b or c`.', 'The final verdict with the `a and b or c` idiom.'])),
    S('summary',
      UL(
        ['Pasang Lua 5.4 dengan pengurus pakej atau daripada sumber, kemudian sahkan dengan `lua -v`.', 'Install Lua 5.4 with a package manager or from source, then confirm with `lua -v`.'],
        ['`_VERSION` memberi versi bahasa; bandingkan versi sebagai nombor, bukan string.', '`_VERSION` gives the language version; compare versions as numbers, not strings.'],
        ['Pengesanan ciri (`utf8 ~= nil`) menyemak apa yang benar-benar tersedia dalam hos.', 'Feature detection (`utf8 ~= nil`) checks what is really available in the host.'],
        ['Integer Lua berbalik (wrap around) semasa limpahan tanpa ralat.', 'Lua integers wrap around on overflow without an error.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah perbezaan antara `5.4` dan `5.4.6`?', 'What is the difference between `5.4` and `5.4.6`?'],
        ['Mengapakah `"5" > 4` menghasilkan ralat dalam Lua?', 'Why does `"5" > 4` produce an error in Lua?'],
        ['Apakah nilai `math.maxinteger + 1`?', 'What is the value of `math.maxinteger + 1`?'],
        ['Bagaimanakah anda menyemak sama ada hos membuka pustaka `os`?', 'How do you check whether a host opened the `os` library?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua download page — lua.org', url: DOWNLOAD },
        { title: 'Lua 5.4 Reference Manual §7 — Lua Standalone', url: `${MANUAL}#7` },
        { title: 'Lua 5.4 Reference Manual — _VERSION and math.maxinteger', url: `${MANUAL}#pdf-_VERSION` },
        { title: 'LuaBinaries — prebuilt Lua for Windows and other platforms', url: 'https://luabinaries.sourceforge.net/' },
      )),
  ],
};

// ─── 2.2 The interactive REPL versus .lua script files ─────────────────────

export const LUA101_2_2: LectureContentDef = {
  courseCode: 'LUA101',
  module: 2,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan [[repl|REPL]] Lua untuk mencuba ungkapan dan pernyataan.', 'Use the Lua [[repl|REPL]] to try out expressions and statements.'],
        ['Menerangkan mengapa pemboleh ubah `local` tidak kekal antara baris REPL.', 'Explain why `local` variables do not persist between REPL lines.'],
        ['Menjalankan fail skrip dan menghantar argumen kepadanya.', 'Run script files and pass arguments to them.'],
        ['Memilih antara REPL dan fail skrip untuk tugasan tertentu.', 'Choose between the REPL and script files for a given task.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1: Lua dipasang dan `lua -v` berfungsi.', 'Lecture 2.1: Lua is installed and `lua -v` works.'],
        ['Kuliah 1.2: `load` mengkompil teks menjadi [[chunk]].', 'Lecture 1.2: `load` compiles text into a [[chunk]].'],
      )),
    S('introduction',
      P('Terdapat dua cara utama untuk menjalankan kod Lua. **REPL** (taip `lua` tanpa nama fail) membolehkan anda menaip satu baris dan melihat hasilnya serta-merta — sesuai untuk eksperimen. **Fail skrip** (`lua game.lua`) menyimpan program lengkap yang boleh dijalankan semula, disunting dan dikongsi. Pengaturcara berpengalaman menggunakan kedua-duanya setiap hari.',
        'There are two main ways to run Lua code. The **REPL** (type `lua` with no file name) lets you type one line and see the result immediately — ideal for experiments. A **script file** (`lua game.lua`) stores a complete program that can be rerun, edited and shared. Experienced developers use both every day.'),
      KEY('REPL untuk **bertanya**; fail skrip untuk **membina**.', 'The REPL is for **asking**; script files are for **building**.', ['Panduan', 'Rule of thumb'])),
    S('fundamental_concepts',
      UL(
        ['**Read:** REPL membaca satu baris daripada [[standard-input|input standard]].', '**Read:** the REPL reads one line from [[standard-input]].'],
        ['**Eval:** ia mengkompil baris itu sebagai [[chunk]] dan menjalankannya. Sejak 5.3, ia mencuba `return <baris>` dahulu supaya ungkapan dipaparkan.', '**Eval:** it compiles the line as a [[chunk]] and runs it. Since 5.3 it first tries `return <line>` so expressions are displayed.'],
        ['**Print:** hasil dipaparkan, atau mesej ralat jika berlaku ralat. Ralat tidak menutup REPL.', '**Print:** the result is displayed, or an error message if something failed. Errors do not close the REPL.'],
        ['**Loop:** ia menunggu baris seterusnya, sehingga anda menekan Ctrl+D (Linux/macOS) atau Ctrl+Z, Enter (Windows).', '**Loop:** it waits for the next line, until you press Ctrl+D (Linux/macOS) or Ctrl+Z, Enter (Windows).'],
        ['**Fail skrip** ialah satu chunk; argumen baris arahan tiba sebagai `...` dan dalam table `arg`.', 'A **script file** is one chunk; command-line arguments arrive as `...` and in the `arg` table.'],
      )),
    S('detailed_theory',
      P('Perkara paling penting tentang REPL: **setiap baris ialah chunk yang berasingan**. Kerana [[scope|skop]] sesuatu `local` berakhir di hujung chunknya, `local x = 1` pada satu baris tidak kelihatan pada baris seterusnya — `x` dibaca sebagai global yang tidak wujud, iaitu `nil`. Global pula kekal, kerana ia disimpan dalam table persekitaran yang dikongsi. Sebab itu, dalam REPL, pengaturcara sering menggunakan global untuk eksperimen, tetapi tidak dalam fail skrip.',
        'The most important fact about the REPL: **every line is a separate chunk**. Because the [[scope]] of a `local` ends at the end of its chunk, `local x = 1` on one line is not visible on the next — `x` is read as a global that does not exist, which is `nil`. Globals, by contrast, persist because they live in the shared environment table. That is why, in the REPL, programmers often use globals for experiments, but not in script files.'),
      P('Fail skrip dikompil **sekaligus** sebagai satu chunk sebelum mana-mana baris dijalankan. Oleh itu ralat sintaks di mana-mana dalam fail menghalang keseluruhan program daripada bermula, manakala dalam REPL hanya baris yang rosak gagal. Interpreter menghantar argumen baris arahan kepada skrip sebagai `...` (vararg chunk) dan juga mengisi table global `arg`, dengan `arg[0]` ialah nama skrip.',
        'A script file is compiled **all at once** as one chunk before any line runs. So a syntax error anywhere in the file stops the whole program from starting, while in the REPL only the broken line fails. The interpreter passes command-line arguments to the script as `...` (the chunk’s varargs) and also fills the global `arg` table, with `arg[0]` being the script name.')),
    S('technical_terminology', TERMS('repl', 'chunk', 'standard-input', 'scope')),
    S('syntax_rules',
      UL(
        ['`lua` — membuka REPL. `lua -i fail.lua` — menjalankan fail, kemudian membuka REPL dengan globalnya.', '`lua` — opens the REPL. `lua -i file.lua` — runs the file, then opens the REPL with its globals.'],
        ['`lua skrip.lua a b` — menjalankan skrip dengan dua argumen; di dalam skrip, `local first, second = ...`.', '`lua script.lua a b` — runs the script with two arguments; inside the script, `local first, second = ...`.'],
        ['Dalam REPL 5.3+, menaip ungkapan (contohnya `2 + 3`) memaparkan nilainya terus.', 'In the 5.3+ REPL, typing an expression (for example `2 + 3`) displays its value directly.'],
        ['`dofile("fail.lua")` menjalankan fail lain dari dalam REPL atau skrip.', '`dofile("file.lua")` runs another file from inside the REPL or a script.'],
      )),
    S('code_demonstration',
      CODE('mini-repl', 'lua', 'lua54', ['REPL kecil yang ditulis dalam Lua', 'A tiny REPL written in Lua'], `
local env = setmetatable({}, {__index = _G})

while true do
  local line = io.read("l")
  if not line then break end
  local chunk = load("return " .. line, "=stdin", "t", env)
    or load(line, "=stdin", "t", env)
  local ok, value = pcall(chunk)
  if value ~= nil then print(value) end
end
`, "5\n20\nstdin:1: attempt to index a nil value (global 'y')", { input: 'x = 10\n2 + 3\nx * 2\ny.z\n' }),
      EXPLAIN('mini-repl',
        ['1', 'Persekitaran untuk "global REPL". `__index = _G` membolehkan baris membaca fungsi standard seperti `print`, manakala global baharu disimpan dalam `env`.', 'An environment for "REPL globals". `__index = _G` lets lines read standard functions such as `print`, while new globals are stored in `env`.'],
        ['3–5', '**Read:** baca satu baris; apabila input habis (`nil`), keluar dari gelung — sama seperti Ctrl+D.', '**Read:** read one line; when input runs out (`nil`), leave the loop — just like Ctrl+D.'],
        ['6–7', '**Eval (kompil):** cuba sebagai ungkapan (`return …`); jika itu gagal dikompil, cuba sebagai pernyataan. Inilah yang dilakukan oleh REPL Lua 5.3+.', '**Eval (compile):** try it as an expression (`return …`); if that fails to compile, try it as a statement. This is exactly what the Lua 5.3+ REPL does.'],
        ['8', '**Eval (jalankan):** `pcall` menjalankan chunk dalam mod dilindungi supaya ralat tidak menghentikan gelung. Jika ralat, `value` ialah mesejnya.', '**Eval (run):** `pcall` runs the chunk in protected mode so an error does not stop the loop. On an error, `value` is its message.'],
        ['9', '**Print:** paparkan hasil atau mesej ralat; pernyataan seperti `x = 10` tidak memulangkan apa-apa, jadi tiada yang dipaparkan.', '**Print:** display the result or the error message; a statement such as `x = 10` returns nothing, so nothing is displayed.'])),
    S('complete_examples',
      CODE('local-per-line', 'lua', 'lua54', ['Setiap baris REPL ialah chunk berasingan', 'Every REPL line is a separate chunk'], `
load("local score = 10")()        -- line 1 of a REPL session
local readBack = load("return score")
print(readBack())                 -- line 2 cannot see line 1's local

load("level = 3")()               -- a global persists
print(load("return level")())
`, 'nil\n3', {
        debug: BUG(`
load("local score = 10")()
local readBack = load("return score")
print(readBack() + 1)
`, "example:3: attempt to perform arithmetic on a nil value",
          'Pengaturcara menjangka `11`, tetapi `score` dalam chunk kedua ialah global yang tidak wujud. Mesej tidak mempunyai nama pemboleh ubah kerana nilai `nil` datang daripada **hasil panggilan fungsi**, bukan daripada pemboleh ubah. Dalam REPL sebenar, taip `score = 10` (tanpa `local`) atau tulis kedua-dua baris pada satu baris.',
          'The programmer expects `11`, but `score` in the second chunk is a global that does not exist. The message has no variable name because the `nil` comes from a **function call result**, not from a variable. In a real REPL, type `score = 10` (without `local`) or write both statements on one line.'),
      }),
      EXPLAIN('local-per-line',
        ['1', 'Mensimulasikan satu baris REPL: chunk yang mengisytiharkan local dan tamat serta-merta — local itu hilang bersamanya.', 'Simulates one REPL line: a chunk that declares a local and ends immediately — the local disappears with it.'],
        ['2–3', 'Chunk kedua cuba membaca `score` dan mendapat global `nil`.', 'A second chunk tries to read `score` and gets the `nil` global.'],
        ['5–6', 'Global ditulis ke persekitaran yang dikongsi, jadi chunk kemudian boleh membacanya: 3.', 'A global is written to the shared environment, so a later chunk can read it: 3.']),
      CODE('script-args', 'lua', 'lua54', ['Skrip menerima argumen melalui ...', 'A script receives arguments through ...'], `
-- Simulates: lua greet.lua Aisyah 2
local script = load([[
  local name, times = ...
  for i = 1, tonumber(times) do
    print(i .. ". Hello, " .. name)
  end
]], "=greet")

script("Aisyah", "2")
`, '1. Hello, Aisyah\n2. Hello, Aisyah', {
        debug: BUG(`
-- Simulates: lua greet.lua Aisyah   (the count is missing)
local script = load([[
  local name, times = ...
  for i = 1, tonumber(times) do
    print(i .. ". Hello, " .. name)
  end
]], "=greet")

script("Aisyah")
`, "greet:2: bad 'for' limit (number expected, got nil)",
          'Hanya satu argumen dihantar, jadi `times` ialah `nil`. `tonumber(nil)` tidak membaling ralat — ia memulangkan `nil` — maka masalah hanya muncul pada gelung `for`, yang memerlukan had berupa nombor. Perhatikan dua perkara: nama chunk `greet:2` menunjuk ke **fail skrip**, bukan ke program pemanggil; dan mesej memberitahu jenis yang dijangka dan yang diterima. Skrip yang baik menyemak argumennya dan mencetak cara penggunaan.',
          'Only one argument was passed, so `times` is `nil`. `tonumber(nil)` does not raise an error — it returns `nil` — so the problem only appears at the `for` loop, which needs a numeric limit. Notice two things: the chunk name `greet:2` points at the **script file**, not the calling program; and the message states the expected and the received type. A good script checks its arguments and prints a usage message.'),
      }),
      EXPLAIN('script-args',
        ['2–7', 'Teks skrip yang dimuatkan dengan nama `"=greet"`, seperti fail `greet.lua`.', 'The script text loaded with the name `"=greet"`, like a `greet.lua` file.'],
        ['3', 'Argumen baris arahan tiba sebagai `...`; dua local menerimanya mengikut tertib.', 'Command-line arguments arrive as `...`; two locals receive them in order.'],
        ['4–6', 'Argumen sentiasa **string**, jadi `tonumber(times)` diperlukan sebagai had gelung.', 'Arguments are always **strings**, so `tonumber(times)` is needed as the loop limit.'],
        ['9', 'Memanggil chunk dengan dua argumen — sama seperti `lua greet.lua Aisyah 2`.', 'Calling the chunk with two arguments — the same as `lua greet.lua Aisyah 2`.'])),
    S('line_by_line',
      EXPLAIN('mini-repl',
        ['6–7', 'Mengapa mencuba `return` dahulu? Kerana `2 + 3` bukan pernyataan yang sah dalam Lua — ia mesti dibalut sebagai `return 2 + 3`. Sebaliknya `x = 10` tidak sah selepas `return`, jadi percubaan kedua mengkompilnya sebagai pernyataan.', 'Why try `return` first? Because `2 + 3` is not a valid statement in Lua — it must be wrapped as `return 2 + 3`. Conversely `x = 10` is invalid after `return`, so the second attempt compiles it as a statement.']),
      EXPLAIN('local-per-line',
        ['1–3', 'Inilah sebabnya REPL "melupakan" `local`: setiap baris ialah fungsi yang berasingan, dan local hidup hanya semasa fungsi itu berjalan.', 'This is why the REPL "forgets" `local`: each line is a separate function, and a local lives only while that function runs.'])),
    S('why_this_way',
      P('Mengapa REPL mengkompil setiap baris secara berasingan? Kerana ia tidak boleh menunggu keseluruhan program — ia mesti menjalankan apa yang anda taip sekarang. Akibatnya, skop local menjadi satu baris. Fail skrip dikompil sekali gus, jadi pengkompil boleh mengesan semua ralat sintaks lebih awal dan local berfungsi seperti dijangka.',
        'Why does the REPL compile each line separately? Because it cannot wait for the whole program — it must run what you type now. As a result, local scope becomes one line. A script file is compiled all at once, so the compiler can catch every syntax error early and locals work as expected.'),
      P('Gunakan REPL **apabila** anda mahu menyemak fungsi pustaka, mencuba corak string atau mengesahkan tingkah laku operator. Gunakan fail skrip **apabila** kod lebih daripada beberapa baris, perlu dijalankan semula, atau akan dikongsi dengan orang lain.', 'Use the REPL **when** you want to check a library function, try a string pattern or confirm how an operator behaves. Use a script file **when** the code is more than a few lines, must be rerun, or will be shared.')),
    S('execution_flow',
      OL(
        ['`mini-repl` membaca `x = 10`. Mencuba `return x = 10` gagal dikompil, jadi ia dikompil sebagai pernyataan dan dijalankan — `env.x` menjadi 10.', '`mini-repl` reads `x = 10`. Trying `return x = 10` fails to compile, so it is compiled as a statement and run — `env.x` becomes 10.'],
        ['Ia membaca `2 + 3`, mengkompil `return 2 + 3` dan memaparkan `5`.', 'It reads `2 + 3`, compiles `return 2 + 3` and displays `5`.'],
        ['Ia membaca `x * 2`; `x` dicari dalam `env` (10), jadi `20` dipaparkan.', 'It reads `x * 2`; `x` is found in `env` (10), so `20` is displayed.'],
        ['Ia membaca `y.z`; `y` ialah `nil`, `pcall` menangkap ralat dan mesejnya dipaparkan. Gelung diteruskan.', 'It reads `y.z`; `y` is `nil`, `pcall` catches the error and its message is displayed. The loop continues.'],
        ['`io.read` memulangkan `nil` (input habis) dan gelung tamat.', '`io.read` returns `nil` (input exhausted) and the loop ends.'],
      )),
    S('memory_behaviour',
      P('Dalam REPL, setiap baris menghasilkan fungsi chunk baharu yang menjadi sampah sebaik sahaja ia selesai. Global yang anda cipta pula kekal sehingga sesi tamat — sesi REPL yang panjang boleh mengumpul banyak data dalam global. Menetapkan `nama = nil` membuang rujukan supaya pengutip sampah boleh membebaskannya. Fail skrip membebaskan semua memorinya apabila interpreter keluar.',
        'In the REPL, every line produces a new chunk function that becomes garbage as soon as it finishes. The globals you create, however, stay until the session ends — a long REPL session can accumulate a lot of data in globals. Setting `name = nil` drops the reference so the garbage collector can free it. A script file frees all its memory when the interpreter exits.')),
    S('alternative_implementations',
      P('`lua -i skrip.lua` menggabungkan kedua-dua dunia: ia menjalankan fail, kemudian membuka REPL di mana global fail itu tersedia — berguna untuk menyiasat keadaan selepas skrip berjalan. Dalam kod, `dofile` menjalankan fail lain dan memulangkan nilainya. Contoh berikut mensimulasikan `dofile` dengan `load` untuk menunjukkan nilai pulangan chunk:',
        '`lua -i script.lua` combines both worlds: it runs the file, then opens a REPL where the file’s globals are available — useful for inspecting state after a script runs. In code, `dofile` runs another file and returns its values. The following example simulates `dofile` with `load` to show a chunk’s return values:'),
      CODE('chunk-return', 'lua', 'lua54', ['Chunk memulangkan beberapa nilai', 'A chunk returns several values'], `
local stats = load("return 3, 7, 12")
local low, mid, high = stats()
print(low + mid + high, select("#", stats()))
`, '22\t3'),
      EXPLAIN('chunk-return',
        ['1', 'Chunk yang hanya memulangkan tiga nilai.', 'A chunk that just returns three values.'],
        ['2', 'Tiga local menerima tiga nilai pulangan.', 'Three locals receive the three return values.'],
        ['3', 'Jumlah ialah 22; `select("#", ...)` mengira bilangan nilai yang dipulangkan: 3.', 'The sum is 22; `select("#", ...)` counts the number of returned values: 3.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan `local` dalam REPL dan hairan mengapa pemboleh ubah hilang pada baris seterusnya.', 'Using `local` in the REPL and wondering why the variable is gone on the next line.'],
        ['Membangunkan program panjang dalam REPL dan kehilangan semuanya apabila sesi ditutup.', 'Building a long program in the REPL and losing everything when the session closes.'],
        ['Lupa bahawa argumen baris arahan sentiasa string — `"2" + 1` berfungsi, tetapi `"2" < 3` ialah ralat.', 'Forgetting that command-line arguments are always strings — `"2" + 1` works, but `"2" < 3` is an error.'],
        ['Menaip `lua` di dalam REPL Lua untuk menjalankan fail (gunakan `dofile("fail.lua")`).', 'Typing `lua` inside the Lua REPL to run a file (use `dofile("file.lua")`).'],
      )),
    S('debugging',
      P('REPL ialah alat debugging yang hebat: apabila skrip gagal, salin baris yang mencurigakan ke dalam REPL dan uji setiap bahagian ungkapan secara berasingan. Contohnya, jika `print(total / count)` memberi `nan`, taip `total` dan `count` satu demi satu. Namun ingat dua perangkap yang ditunjukkan dalam kuliah ini: local tidak kekal antara baris, dan argumen skrip ialah string. Kedua-dua contoh berpepijat di atas memperlihatkan mesej yang anda akan lihat.',
        'The REPL is a great debugging tool: when a script fails, copy the suspicious line into the REPL and test each part of the expression separately. For example, if `print(total / count)` gives `nan`, type `total` and `count` one at a time. But remember the two traps shown in this lecture: locals do not persist between lines, and script arguments are strings. Both buggy examples above show the messages you will see.'),
      WARN('Nama chunk dalam mesej ralat memberitahu tempatnya: `stdin:1` bermaksud baris yang ditaip dalam REPL; `greet:2` bermaksud baris 2 fail `greet`.', 'The chunk name in an error message tells you where: `stdin:1` means a line typed into the REPL; `greet:2` means line 2 of the `greet` file.', ['Baca nama chunk', 'Read the chunk name'])),
    S('performance',
      P('Mengkompil setiap baris REPL adalah pantas untuk manusia, tetapi tidak sesuai untuk menjalankan kod berulang kali. Dalam fail skrip, kompilasi berlaku sekali dan kemudian fungsi boleh dipanggil berjuta kali. Jangan ukur prestasi dalam REPL — gunakan skrip dengan `os.clock()` di sekeliling kod yang diuji.',
        'Compiling every REPL line is fast for humans, but unsuitable for running code repeatedly. In a script file, compilation happens once and functions can then be called millions of times. Do not measure performance in the REPL — use a script with `os.clock()` around the code under test.')),
    S('software_engineering',
      P('Kod yang bermula dalam REPL selalunya berakhir sebagai baris lepas di peringkat atas fail. Struktur yang lebih baik meletakkan logik dalam fungsi dan mempunyai satu titik masuk `main`:', 'Code that starts in the REPL often ends up as loose lines at the top level of a file. A better structure puts logic in functions with a single `main` entry point:'),
      CODE('poor-toplevel', 'lua', 'lua54', ['Pelaksanaan lemah: kod REPL disalin ke fail', 'Poor implementation: REPL code pasted into a file'], `
total = 0
for i = 1, 4 do total = total + i end
print(total)
`, '10'),
      EXPLAIN('poor-toplevel',
        ['1–3', 'Berfungsi, tetapi `total` ialah global (gaya REPL), logik tidak boleh diguna semula, dan tiada nama yang menerangkan tujuan kod.', 'It works, but `total` is a global (REPL style), the logic cannot be reused, and no name explains what the code is for.']),
      CODE('improved-main', 'lua', 'lua54', ['Pelaksanaan lebih baik: fungsi dan titik masuk main', 'Improved implementation: functions and a main entry point'], `
local function sumUpTo(n)
  local total = 0
  for i = 1, n do total = total + i end
  return total
end

local function main()
  print(sumUpTo(4))
end

main()
`, '10'),
      EXPLAIN('improved-main',
        ['1–5', 'Logik dalam fungsi bernama dengan pemboleh ubah local — boleh diuji dan diguna semula.', 'The logic is in a named function with local variables — testable and reusable.'],
        ['7–9', '`main` menghimpunkan apa yang program lakukan apabila dijalankan.', '`main` gathers what the program does when it runs.'],
        ['11', 'Satu titik masuk yang jelas. Dalam REPL, anda boleh `dofile` fail ini dan memanggil `sumUpTo` dengan nilai lain.', 'One clear entry point. In the REPL you can `dofile` this file and call `sumUpTo` with other values.'])),
    S('industry_use_cases',
      UL(
        ['Pembangun enjin permainan membuka konsol Lua dalam permainan (REPL dalam hos) untuk menukar nilai semasa permainan berjalan.', 'Game developers open an in-game Lua console (a REPL inside the host) to change values while the game runs.'],
        ['Pentadbir sistem menjalankan skrip Lua sekali guna dengan `lua -e` dalam saluran shell.', 'System administrators run one-off Lua scripts with `lua -e` in shell pipelines.'],
        ['Pengguna Neovim menguji konfigurasi dengan arahan `:lua print(...)`, iaitu REPL satu baris.', 'Neovim users test configuration with the `:lua print(...)` command, a one-line REPL.'],
      )),
    S('practical_demonstration',
      OL(
        ['Buka REPL dengan `lua`, taip `2 ^ 10`, kemudian `local a = 5` dan `a` — perhatikan `nil`.', 'Open the REPL with `lua`, type `2 ^ 10`, then `local a = 5` and `a` — notice the `nil`.'],
        ['Simpan `improved-main` sebagai `sum.lua` dan jalankan `lua -i sum.lua`, kemudian taip `sumUpTo(100)`.', 'Save `improved-main` as `sum.lua`, run `lua -i sum.lua`, then type `sumUpTo(100)`.'],
        ['Tukar input `mini-repl` dalam fikiran anda: apakah output untuk baris `"ab" .. "cd"`?', 'Change the `mini-repl` input in your head: what is the output for the line `"ab" .. "cd"`?'],
      )),
    S('mini_project',
      P('**Kalkulator baris arahan.** Baca ungkapan aritmetik satu baris setiap kali, kira hasilnya, dan paparkan `= hasil`. Baris yang tidak sah memaparkan `error` dan bukannya menghentikan program.', '**A command-line calculator.** Read one arithmetic expression per line, compute it, and display `= result`. An invalid line displays `error` instead of stopping the program.'),
      CODE('line-calculator', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local count = 0
while true do
  local expr = io.read("l")
  if not expr then break end
  local chunk = load("return " .. expr, "=calc", "t", {})
  local ok, result = pcall(chunk or error)
  print(expr, ok and ("= " .. tostring(result)) or "error")
  count = count + 1
end
print(count .. " lines")
`, '1 + 2\t= 3\n10 / 4\t= 2.5\n7 *\terror\n2 ^ 8\t= 256.0\n4 lines', { input: '1 + 2\n10 / 4\n7 *\n2 ^ 8\n' }),
      EXPLAIN('line-calculator',
        ['1', 'Kiraan baris yang diproses.', 'A count of processed lines.'],
        ['2–4', 'Gelung membaca sehingga input habis.', 'The loop reads until input runs out.'],
        ['5', 'Setiap baris dikompil sebagai ungkapan dengan persekitaran **kosong** — pengguna tidak boleh memanggil fungsi, hanya mengira.', 'Each line is compiled as an expression with an **empty** environment — the user cannot call functions, only compute.'],
        ['6', 'Jika kompilasi gagal, `chunk` ialah `nil`, jadi `pcall(error)` dipanggil dan memulangkan `false` — cara ringkas untuk menyatukan ralat kompil dan ralat runtime.', 'If compilation failed, `chunk` is `nil`, so `pcall(error)` is called and returns `false` — a compact way to treat compile and runtime errors alike.'],
        ['7', 'Paparkan ungkapan dan hasilnya, atau `error`. Perhatikan `2 ^ 8` memberi `256.0`: `^` sentiasa menghasilkan float.', 'Display the expression and its result, or `error`. Note `2 ^ 8` gives `256.0`: `^` always produces a float.'],
        ['8', 'Kira baris.', 'Count the line.'],
        ['10', 'Ringkasan selepas gelung.', 'A summary after the loop.'])),
    S('summary',
      UL(
        ['REPL membaca, menilai, mencetak dan mengulang — setiap baris ialah chunk berasingan.', 'The REPL reads, evaluates, prints and loops — every line is a separate chunk.'],
        ['`local` tidak kekal antara baris REPL; global kekal.', '`local` does not persist between REPL lines; globals do.'],
        ['Fail skrip dikompil sekali gus dan menerima argumen sebagai string melalui `...`.', 'Script files are compiled all at once and receive arguments as strings through `...`.'],
        ['Gunakan REPL untuk eksperimen, fail skrip untuk program sebenar.', 'Use the REPL for experiments, script files for real programs.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah `local a = 1` diikuti `print(a)` pada baris REPL berasingan memaparkan `nil`?', 'Why does `local a = 1` followed by `print(a)` on separate REPL lines display `nil`?'],
        ['Apakah yang dilakukan oleh `lua -i program.lua`?', 'What does `lua -i program.lua` do?'],
        ['Apakah jenis nilai argumen yang diterima oleh skrip daripada baris arahan?', 'What type are the arguments a script receives from the command line?'],
        ['Dalam `mini-repl`, mengapakah `return` dicuba dahulu?', 'In `mini-repl`, why is `return` tried first?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §7 — Lua Standalone', url: `${MANUAL}#7` },
        { title: 'Lua 5.4 Reference Manual §3.3.2 — Chunks', url: `${MANUAL}#3.3.2` },
        { title: 'Lua 5.4 Reference Manual — load and dofile', url: `${MANUAL}#pdf-dofile` },
        { title: 'Programming in Lua (1st ed.) — 1.1 Chunks', url: 'https://www.lua.org/pil/1.1.html' },
      )),
  ],
};

// ─── 2.3 Code editors and Lua language extensions ──────────────────────────

export const LUA101_2_3: LectureContentDef = {
  courseCode: 'LUA101',
  module: 2,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menyediakan editor kod (contohnya VS Code) untuk Lua dengan [[language-server|pelayan bahasa]] LuaLS.', 'Set up a code editor (for example VS Code) for Lua with the LuaLS [[language-server]].'],
        ['Menulis anotasi `---@param` dan `---@return` yang difahami oleh editor.', 'Write `---@param` and `---@return` annotations that the editor understands.'],
        ['Mengenal pasti amaran linter (luacheck) dan penformat (StyLua).', 'Recognise linter (luacheck) and formatter (StyLua) warnings.'],
        ['Menerangkan mengapa alat statik menangkap pepijat sebelum kod dijalankan.', 'Explain why static tools catch bugs before code runs.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.2: menjalankan fail skrip `.lua`.', 'Lecture 2.2: running `.lua` script files.'],
        ['Kuliah LUA102 1.1 (pemboleh ubah global dan local) membantu, tetapi tidak wajib.', 'Lecture LUA102 1.1 (global and local variables) helps, but is not required.'],
      )),
    S('introduction',
      P('Lua ialah bahasa dinamik: kebanyakan kesilapan — nama tersalah eja, medan yang tidak wujud, global yang tidak disengajakan — hanya kelihatan apabila baris itu dijalankan. Editor yang baik mengubah keadaan ini. Dengan **pelayan bahasa**, **linter** dan **penformat**, banyak pepijat digariskan merah semasa anda menaip, sebelum program dijalankan sekali pun.',
        'Lua is a dynamic language: most mistakes — misspelled names, fields that do not exist, accidental globals — only show up when that line runs. A good editor changes this. With a **language server**, a **linter** and a **formatter**, many bugs are underlined in red as you type, before the program has run even once.'),
      KEY('Alat statik membaca kod **tanpa menjalankannya**. Ia melengkapkan, bukan menggantikan, ujian dan pelaksanaan.', 'Static tools read code **without running it**. They complement, not replace, tests and execution.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Editor:** VS Code, Neovim, Zed atau JetBrains IDE — semuanya menyokong Lua melalui sambungan.', '**Editor:** VS Code, Neovim, Zed or JetBrains IDEs — all support Lua through extensions.'],
        ['**[[language-server|Pelayan bahasa]] (LuaLS):** pelengkapan, pergi-ke-definisi, dokumentasi hover, dan diagnostik seperti "undefined global".', '**[[language-server|Language server]] (LuaLS):** completion, go-to-definition, hover docs, and diagnostics such as "undefined global".'],
        ['**Anotasi:** [[comment|komen]] khas `---@param nama jenis` yang memberitahu LuaLS jenis yang dijangka. Lua mengabaikannya.', '**Annotations:** special [[comment|comments]] `---@param name type` that tell LuaLS the expected types. Lua ignores them.'],
        ['**Linter (luacheck):** memberi amaran tentang global, pemboleh ubah yang tidak digunakan dan pembayangan.', '**Linter (luacheck):** warns about globals, unused variables and shadowing.'],
        ['**Penformat (StyLua):** menyusun semula inden dan jarak supaya seluruh pasukan menggunakan gaya yang sama.', '**Formatter (StyLua):** rewrites indentation and spacing so a whole team uses the same style.'],
      )),
    S('detailed_theory',
      P('Pelayan bahasa ialah proses berasingan yang bercakap dengan editor melalui **Language Server Protocol (LSP)**. Editor menghantar kandungan fail; pelayan menghuraikannya menjadi pepohon sintaks, menyimpulkan jenis setiap ungkapan dan menghantar balik diagnostik. Kerana Lua tiada jenis statik, LuaLS menyimpulkan jenis daripada assignment (`local n = 5` ialah number) dan daripada anotasi. Apabila anda memanggil `area("3", 4)` sedangkan anotasi berkata `number`, LuaLS memberi amaran — sebelum program dijalankan.',
        'A language server is a separate process that talks to the editor through the **Language Server Protocol (LSP)**. The editor sends the file contents; the server parses them into a syntax tree, infers the type of every expression and sends back diagnostics. Because Lua has no static types, LuaLS infers types from assignments (`local n = 5` is a number) and from annotations. When you call `area("3", 4)` while the annotation says `number`, LuaLS warns you — before the program runs.'),
      P('Linter seperti luacheck berfungsi secara berbeza: ia tidak menyimpulkan jenis, tetapi mengesan **corak berisiko** — menulis global, membaca global yang tidak ditakrifkan, pemboleh ubah tidak digunakan, kod yang tidak boleh dicapai. Penformat tidak mencari pepijat sama sekali; ia menghapuskan perdebatan tentang gaya supaya semakan kod (code review) fokus pada logik. Ketiga-tiga alat ini biasanya dijalankan dalam editor **dan** dalam CI.',
        'A linter such as luacheck works differently: it does not infer types, but detects **risky patterns** — writing globals, reading undefined globals, unused variables, unreachable code. A formatter does not look for bugs at all; it removes arguments about style so code review can focus on logic. All three tools usually run in the editor **and** in CI.')),
    S('technical_terminology', TERMS('language-server', 'comment', 'variable', 'function')),
    S('syntax_rules',
      UL(
        ['`---@param nama jenis penerangan` — anotasi parameter (tiga sengkang).', '`---@param name type description` — a parameter annotation (three dashes).'],
        ['`---@return jenis` — anotasi nilai pulangan; `---@class Nama` — mengisytiharkan jenis table.', '`---@return type` — a return-value annotation; `---@class Name` — declares a table type.'],
        ['Jenis biasa: `number`, `integer`, `string`, `boolean`, `table`, `function`, `nil`, dan gabungan `string|nil` (atau `string?`).', 'Common types: `number`, `integer`, `string`, `boolean`, `table`, `function`, `nil`, and unions `string|nil` (or `string?`).'],
        ['Fail `.luarc.json` mengkonfigurasi LuaLS untuk projek (contohnya `"runtime.version": "Lua 5.4"`).', 'A `.luarc.json` file configures LuaLS for a project (for example `"runtime.version": "Lua 5.4"`).'],
      )),
    S('code_demonstration',
      CODE('annotated', 'lua', 'lua54', ['Fungsi dengan anotasi LuaLS', 'A function with LuaLS annotations'], `
---Converts a temperature from Celsius to Fahrenheit.
---@param celsius number
---@return number
local function toFahrenheit(celsius)
  return celsius * 9 / 5 + 32
end

print(toFahrenheit(100), toFahrenheit(-40))
`, '212.0\t-40.0'),
      EXPLAIN('annotated',
        ['1–3', 'Tiga baris komen `---`. Lua mengabaikannya, tetapi LuaLS memaparkan penerangan semasa hover dan menyemak jenis argumen.', 'Three `---` comment lines. Lua ignores them, but LuaLS shows the description on hover and checks argument types.'],
        ['4–6', 'Formula penukaran. `/` menghasilkan float, jadi keputusan mempunyai `.0`.', 'The conversion formula. `/` produces a float, so the results have `.0`.'],
        ['8', '100 °C = 212 °F, dan −40 ialah satu-satunya suhu yang sama dalam kedua-dua skala.', '100 °C = 212 °F, and −40 is the one temperature that is equal on both scales.'])),
    S('complete_examples',
      CODE('global-leak', 'lua', 'lua54', ['Pepijat yang ditangkap oleh linter: global bocor', 'A bug a linter catches: a leaked global'], `
local function countVowels(text)
  count = 0          -- luacheck: setting non-standard global variable 'count'
  for _ in text:gmatch("[aeiou]") do
    count = count + 1
  end
  return count
end

print(countVowels("programming"), count)
`, '3\t3'),
      EXPLAIN('global-leak',
        ['1–7', 'Fungsi mengira vokal, tetapi `count` tiada `local`, jadi ia **global**. Program masih memberi jawapan betul — itulah sebabnya pepijat ini sukar dilihat tanpa alat.', 'The function counts vowels, but `count` has no `local`, so it is **global**. The program still gives the right answer — that is why this bug is hard to see without tools.'],
        ['3', '`gmatch("[aeiou]")` mengulangi setiap padanan vokal; `_` bermaksud kita tidak memerlukan nilainya.', '`gmatch("[aeiou]")` iterates over every vowel match; `_` means we do not need its value.'],
        ['9', 'Bukti kebocoran: `count` kelihatan di luar fungsi (3). Fungsi lain yang menggunakan nama `count` akan bertembung secara senyap.', 'Proof of the leak: `count` is visible outside the function (3). Any other function using the name `count` would silently collide.']),
      CODE('typo-field', 'lua', 'lua54', ['Pepijat yang ditangkap oleh LuaLS: medan tersalah eja', 'A bug LuaLS catches: a misspelled field'], `
local word = "lua"
print(string.upper(word), #word)
`, 'LUA\t3', {
        debug: BUG(`
local word = "lua"
print(string.uper(word), #word)
`, "example:2: attempt to call a nil value (field 'uper')",
          '`string.uper` tidak wujud, jadi nilainya `nil` dan memanggilnya gagal **semasa runtime**. LuaLS menggariskan `uper` dengan amaran "undefined field" sebelum anda menjalankan program, dan pelengkapan automatik akan mencadangkan `upper`. Mesej Lua menyebut `field \'uper\'` — tanda bahawa nama selepas titik tersalah eja.',
          '`string.uper` does not exist, so its value is `nil` and calling it fails **at run time**. LuaLS underlines `uper` with an "undefined field" warning before you run the program, and completion would have suggested `upper`. Lua’s message says `field \'uper\'` — a sign that the name after the dot is misspelled.'),
      }),
      EXPLAIN('typo-field',
        ['1', 'Satu string local.', 'One local string.'],
        ['2', '`string.upper` menukar kepada huruf besar; `#word` ialah panjangnya (3).', '`string.upper` converts to upper case; `#word` is its length (3).'])),
    S('line_by_line',
      EXPLAIN('annotated',
        ['2', '`---@param celsius number` — nama mesti sama dengan nama parameter sebenar, jika tidak LuaLS memberi amaran.', '`---@param celsius number` — the name must match the real parameter name, otherwise LuaLS warns.'],
        ['3', '`---@return number` — pemanggil kini tahu fungsi memulangkan nombor; pelengkapan berfungsi pada hasilnya.', '`---@return number` — callers now know the function returns a number; completion works on its result.']),
      EXPLAIN('global-leak',
        ['2', 'Satu perkataan `local` yang hilang. luacheck melaporkan baris ini dengan kod amaran 111 ("setting non-standard global variable").', 'One missing word `local`. luacheck reports this line with warning code 111 ("setting non-standard global variable").'])),
    S('why_this_way',
      P('Mengapa melabur masa dalam alat editor? Kerana kos membetulkan pepijat meningkat apabila ia ditemui lebih lewat: ralat yang digariskan semasa menaip mengambil masa beberapa saat; ralat yang ditemui oleh pengguna dalam produksi mengambil masa berjam-jam. Untuk bahasa dinamik seperti Lua, alat statik ialah pengganti terdekat kepada pemeriksaan jenis pengkompil.',
        'Why invest time in editor tooling? Because the cost of fixing a bug grows the later it is found: an error underlined while typing takes seconds; an error found by users in production takes hours. For a dynamic language like Lua, static tools are the closest substitute for a compiler’s type checking.'),
      P('Pengaturcara menambah anotasi **apabila** kod dikongsi atau besar — fungsi awam modul, API pasukan. Untuk skrip kecil sekali guna, anotasi mungkin berlebihan, tetapi linter masih berbaloi.', 'Developers add annotations **when** code is shared or large — public module functions, team APIs. For small one-off scripts, annotations may be overkill, but a linter is still worth it.')),
    S('execution_flow',
      OL(
        ['Anda menaip dalam editor; editor menghantar teks kepada LuaLS melalui LSP.', 'You type in the editor; the editor sends the text to LuaLS over LSP.'],
        ['LuaLS menghuraikan fail, membaca anotasi dan mengira jenis.', 'LuaLS parses the file, reads annotations and computes types.'],
        ['Diagnostik (contohnya "undefined field `uper`") dihantar balik dan digariskan.', 'Diagnostics (for example "undefined field `uper`") are sent back and underlined.'],
        ['Semasa menyimpan, StyLua memformat fail; dalam CI, luacheck menolak global yang bocor.', 'On save, StyLua formats the file; in CI, luacheck rejects leaked globals.'],
        ['Hanya kemudian program dijalankan oleh `lua` — dengan lebih sedikit pepijat.', 'Only then is the program run by `lua` — with fewer bugs.'],
      )),
    S('memory_behaviour',
      P('Anotasi ialah komen, jadi ia dibuang oleh penghurai Lua dan **tidak** menggunakan memori semasa runtime atau memperlahankan program. Global yang bocor pula kekal dalam `_G` sepanjang hayat program — dalam `global-leak`, nombor 3 kekal dirujuk oleh `count` walaupun fungsi telah lama tamat. Memastikan pemboleh ubah `local` membolehkan memori dibebaskan apabila skop tamat.',
        'Annotations are comments, so the Lua parser discards them and they use **no** memory at run time and do not slow the program. A leaked global, by contrast, stays in `_G` for the life of the program — in `global-leak`, the number 3 stays referenced by `count` long after the function finished. Keeping variables `local` lets memory be released when the scope ends.')),
    S('alternative_implementations',
      P('Tanpa editor yang canggih, anda masih boleh mengesan global yang bocor **semasa runtime** dengan memasang [[metatable]] pada `_G`. Ini sebahagian daripada teknik "strict mode" (dibincangkan sepenuhnya dalam LUA211):', 'Without a capable editor, you can still detect leaked globals **at run time** by attaching a [[metatable]] to `_G`. This is part of the "strict mode" technique (covered fully in LUA211):'),
      CODE('strict-globals', 'lua', 'lua54', ['Mengesan global baharu semasa runtime', 'Detecting new globals at run time'], `
local created = {}
setmetatable(_G, {
  __newindex = function(t, name, value)
    created[#created + 1] = name
    rawset(t, name, value)
  end,
})

speed = 5
local distance = 10
print(#created, created[1], distance)
`, '1\tspeed\t10'),
      EXPLAIN('strict-globals',
        ['1', 'Senarai nama global yang dicipta.', 'A list of the global names that get created.'],
        ['2–7', '`__newindex` dipanggil setiap kali kunci **baharu** ditulis ke `_G`. Ia merekod nama, kemudian `rawset` menyimpan nilai tanpa memanggil metamethod semula.', '`__newindex` is called whenever a **new** key is written to `_G`. It records the name, then `rawset` stores the value without calling the metamethod again.'],
        ['9–11', '`speed` (global) direkodkan; `distance` (local) tidak menyentuh `_G` sama sekali.', '`speed` (a global) is recorded; `distance` (a local) never touches `_G`.']),
      P('Pengesanan runtime hanya melihat baris yang benar-benar dijalankan; linter melihat semua baris. Gunakan kedua-duanya: linter dalam editor dan CI, mod ketat dalam ujian.', 'Runtime detection only sees lines that actually run; a linter sees every line. Use both: a linter in the editor and CI, strict mode in tests.')),
    S('common_mistakes',
      UL(
        ['Memasang sambungan Lua tetapi menetapkan versi runtime yang salah (contohnya LuaJIT), lalu LuaLS memberi amaran palsu tentang `//`.', 'Installing a Lua extension but setting the wrong runtime version (for example LuaJIT), so LuaLS gives false warnings about `//`.'],
        ['Mengabaikan garisan amaran kuning kerana "program masih berjalan".', 'Ignoring yellow warning underlines because "the program still runs".'],
        ['Menulis anotasi yang tidak sepadan dengan nama parameter sebenar.', 'Writing annotations that do not match the real parameter names.'],
        ['Mencampur tab dan ruang tanpa penformat, menjadikan semakan kod sukar.', 'Mixing tabs and spaces without a formatter, making code review hard.'],
      )),
    S('debugging',
      P('Apabila editor tidak memaparkan amaran yang dijangka, semak tiga perkara: sambungan dipasang dan aktif, folder projek dibuka (bukan satu fail), dan `.luarc.json` menetapkan versi yang betul. Ralat sintaks pula ditunjukkan oleh editor **dan** oleh Lua dengan mesej yang serupa. Contoh berikut terlupa `end` — editor menggariskan hujung fail, dan Lua melaporkan blok mana yang tidak ditutup:',
        'When the editor does not show an expected warning, check three things: the extension is installed and enabled, the project folder is open (not a single file), and `.luarc.json` sets the right version. Syntax errors are shown by the editor **and** by Lua with similar messages. The following example forgets an `end` — the editor underlines the end of the file, and Lua reports which block was never closed:'),
      CODE('missing-end', 'lua', 'lua54', ['Blok yang ditutup dengan betul', 'A correctly closed block'], `
local function greet(name)
  if name then
    print("Hello, " .. name)
  end
end

greet("Aisyah")
`, 'Hello, Aisyah', {
        debug: BUG(`
local function greet(name)
  if name then
    print("Hello, " .. name)
end

greet("Aisyah")
`, "example:6: 'end' expected (to close 'function' at line 1) near <eof>",
          'Setiap `function`, `if`, `for`, `while` dan `do` memerlukan `end` sendiri. Di sini `end` pada baris 4 menutup `if`, jadi `function` daripada baris 1 tidak pernah ditutup. Lua hanya menyedarinya pada hujung fail (`<eof>`) dan memberitahu blok mana yang terbuka: `function` pada baris 1. Penformat seperti StyLua menjadikan pepijat ini jelas kerana inden tidak lagi sejajar.',
          'Every `function`, `if`, `for`, `while` and `do` needs its own `end`. Here the `end` on line 4 closes the `if`, so the `function` from line 1 is never closed. Lua only notices at the end of the file (`<eof>`) and tells you which block is open: the `function` at line 1. A formatter such as StyLua makes this bug obvious because the indentation no longer lines up.'),
      }),
      EXPLAIN('missing-end',
        ['1', 'Blok `function` dibuka.', 'A `function` block opens.'],
        ['2–4', 'Blok `if` dibuka dan ditutup oleh `end` pada baris 4.', 'An `if` block opens and is closed by the `end` on line 4.'],
        ['7', 'Fungsi dipanggil dengan nama.', 'The function is called with a name.'])),
    S('performance',
      P('Alat statik tidak menjejaskan prestasi program kerana ia tidak berjalan semasa runtime. LuaLS boleh menjadi perlahan pada projek yang sangat besar; kecualikan folder pihak ketiga dengan tetapan `workspace.ignoreDir`. Mod ketat runtime (`strict-globals`) menambah kos kecil pada setiap global **baharu**, jadi biasanya hanya diaktifkan semasa pembangunan dan ujian.',
        'Static tools do not affect program performance because they do not run at run time. LuaLS can be slow on very large projects; exclude third-party folders with the `workspace.ignoreDir` setting. Runtime strict mode (`strict-globals`) adds a small cost to every **new** global, so it is usually enabled only during development and testing.')),
    S('software_engineering',
      P('Bandingkan fungsi tanpa dokumentasi dengan fungsi yang dianotasi untuk pasukan:', 'Compare an undocumented function with one annotated for a team:'),
      CODE('poor-undocumented', 'lua', 'lua54', ['Pelaksanaan lemah: tiada dokumentasi, nama samar', 'Poor implementation: no documentation, vague names'], `
local function f(a, b)
  return a * (1 - b)
end
print(f(200, 0.25))
`, '150.0'),
      EXPLAIN('poor-undocumented',
        ['1–3', 'Apakah `a` dan `b`? Peratus atau pecahan? Pembaca mesti meneka, dan editor tidak boleh membantu.', 'What are `a` and `b`? A percentage or a fraction? The reader must guess, and the editor cannot help.'],
        ['4', 'Keputusan betul untuk harga 200 dengan diskaun 25%, tetapi hanya jika pemanggil tahu `b` ialah pecahan.', 'The result is correct for a price of 200 with a 25% discount, but only if the caller knows `b` is a fraction.']),
      CODE('improved-annotated', 'lua', 'lua54', ['Pelaksanaan lebih baik: nama jelas dan anotasi', 'Improved implementation: clear names and annotations'], `
---Applies a discount to a price.
---@param price number   original price in RM
---@param rate number    discount as a fraction (0.25 = 25%)
---@return number        price after the discount
local function applyDiscount(price, rate)
  assert(rate >= 0 and rate <= 1, "rate must be between 0 and 1")
  return price * (1 - rate)
end

print(applyDiscount(200, 0.25))
`, '150.0'),
      EXPLAIN('improved-annotated',
        ['1–4', 'Dokumentasi yang dibaca oleh manusia **dan** oleh LuaLS: unit, julat dan maksud setiap parameter.', 'Documentation read by humans **and** by LuaLS: the unit, range and meaning of every parameter.'],
        ['5–8', 'Nama fungsi dan parameter menerangkan diri sendiri; `assert` menolak kadar yang mustahil seperti 25 (bermaksud 2500%).', 'The function and parameter names explain themselves; `assert` rejects impossible rates such as 25 (meaning 2500%).'],
        ['10', 'Panggilan yang sama, kini mudah dibaca dan disemak.', 'The same call, now easy to read and review.']),
      P('Pertukarannya beberapa baris tambahan, tetapi setiap pemanggil mendapat pelengkapan, amaran jenis dan dokumentasi hover — dan semakan kod menjadi lebih pantas.', 'The trade-off is a few extra lines, but every caller gets completion, type warnings and hover documentation — and code review becomes faster.')),
    S('industry_use_cases',
      UL(
        ['Projek sumber terbuka besar (contohnya plugin Neovim) menjalankan luacheck dan StyLua dalam GitHub Actions untuk setiap pull request.', 'Large open-source projects (for example Neovim plugins) run luacheck and StyLua in GitHub Actions on every pull request.'],
        ['Studio permainan mengedarkan fail `.luarc.json` dan definisi API enjin supaya LuaLS mengenali fungsi hos.', 'Game studios distribute `.luarc.json` files and engine API definitions so LuaLS recognises host functions.'],
        ['Pasukan Roblox menggunakan alat yang serupa untuk Luau (luau-lsp, Selene, StyLua) — diajar dalam program Luau.', 'Roblox teams use similar tools for Luau (luau-lsp, Selene, StyLua) — taught in the Luau programme.'],
      )),
    S('practical_demonstration',
      OL(
        ['Pasang VS Code dan sambungan **Lua** oleh sumneko (LuaLS).', 'Install VS Code and the **Lua** extension by sumneko (LuaLS).'],
        ['Buka folder projek, cipta `.luarc.json` dengan `{"runtime.version": "Lua 5.4"}`.', 'Open a project folder and create `.luarc.json` with `{"runtime.version": "Lua 5.4"}`.'],
        ['Tampal contoh `global-leak` dan perhatikan amaran pada `count`.', 'Paste the `global-leak` example and notice the warning on `count`.'],
        ['Taip `string.` dan lihat senarai pelengkapan; pilih `upper`.', 'Type `string.` and look at the completion list; choose `upper`.'],
      )),
    S('mini_project',
      P('**Modul yang didokumenkan.** Tulis modul kecil penukaran unit dengan dua fungsi beranotasi, dan uji kedua-duanya.', '**A documented module.** Write a small unit-conversion module with two annotated functions, and test both.'),
      CODE('units-module', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local Units = {}

---@param km number
---@return number miles
function Units.kmToMiles(km)
  return km * 0.621371
end

---@param kg number
---@return number pounds
function Units.kgToPounds(kg)
  return kg * 2.20462
end

print(string.format("%.1f %.1f", Units.kmToMiles(42.195), Units.kgToPounds(70)))
`, '26.2 154.3'),
      EXPLAIN('units-module',
        ['1', 'Table modul yang menghimpunkan fungsi berkaitan.', 'A module table grouping related functions.'],
        ['3–7', 'Fungsi beranotasi: input `km`, output dinamakan `miles` dalam anotasi.', 'An annotated function: input `km`, the output named `miles` in the annotation.'],
        ['9–13', 'Fungsi kedua mengikut corak yang sama.', 'A second function following the same pattern.'],
        ['15', '`%.1f` membundarkan kepada satu tempat perpuluhan: maraton = 26.2 batu, 70 kg = 154.3 paun.', '`%.1f` rounds to one decimal place: a marathon = 26.2 miles, 70 kg = 154.3 pounds.'])),
    S('summary',
      UL(
        ['Pelayan bahasa (LuaLS) memberi pelengkapan dan diagnostik melalui LSP.', 'A language server (LuaLS) provides completion and diagnostics through LSP.'],
        ['Anotasi `---@param` / `---@return` ialah komen: ia membantu alat tanpa mengubah program.', '`---@param` / `---@return` annotations are comments: they help tools without changing the program.'],
        ['luacheck mengesan global dan pemboleh ubah tidak digunakan; StyLua menyeragamkan gaya.', 'luacheck detects globals and unused variables; StyLua standardises style.'],
        ['Alat statik menemui pepijat lebih awal, tetapi tidak menggantikan ujian.', 'Static tools find bugs earlier, but do not replace testing.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah perbezaan antara linter dan penformat?', 'What is the difference between a linter and a formatter?'],
        ['Adakah anotasi `---@param` mengubah cara Lua menjalankan fungsi? Terangkan.', 'Does a `---@param` annotation change how Lua runs a function? Explain.'],
        ['Mengapakah `global-leak` memberi jawapan betul walaupun ada pepijat?', 'Why does `global-leak` give the right answer even though it has a bug?'],
        ['Apakah yang dimaksudkan dengan `<eof>` dalam mesej ralat?', 'What does `<eof>` mean in an error message?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua Language Server (LuaLS) — documentation', url: 'https://luals.github.io/' },
        { title: 'LuaLS — annotations reference', url: 'https://luals.github.io/wiki/annotations/' },
        { title: 'luacheck — static analyser and linter for Lua', url: 'https://github.com/lunarmodules/luacheck' },
        { title: 'StyLua — opinionated Lua code formatter', url: 'https://github.com/JohnnyMorganz/StyLua' },
        { title: 'Language Server Protocol — specification overview', url: 'https://microsoft.github.io/language-server-protocol/' },
      )),
  ],
};

export const LUA101_M2 = [LUA101_2_1, LUA101_2_2, LUA101_2_3];
