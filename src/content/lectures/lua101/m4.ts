import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUA101 · Module 4 — First Programs and Errors (standard Lua 5.4; verified by `npm run verify:code`).
 * Code that contains backslash escapes is written with String.raw so Lua sees the escapes literally.
 */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 4.1 print(), string literals and escape sequences ─────────────────────

export const LUA101_4_1: LectureContentDef = {
  courseCode: 'LUA101',
  module: 4,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan `print` dan `io.write` untuk menghasilkan output dan menerangkan perbezaannya.', 'Use `print` and `io.write` to produce output and explain how they differ.'],
        ['Menulis string literal dengan petikan tunggal, berganda dan kurungan panjang `[[ ]]`.', 'Write string literals with single quotes, double quotes and long brackets `[[ ]]`.'],
        ['Menggunakan [[escape-sequence|jujukan escape]] untuk aksara khas, termasuk Unicode.', 'Use [[escape-sequence|escape sequences]] for special characters, including Unicode.'],
        ['Memformat output dengan `string.format`.', 'Format output with `string.format`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 3: pernyataan, blok dan komen.', 'Module 3: statements, blocks and comments.'],
        ['Contoh terdahulu menggunakan `print` dan penggabungan `..`.', 'Earlier examples using `print` and `..` concatenation.'],
      )),
    S('introduction',
      P('Hampir setiap program pertama mencetak sesuatu. Dalam Lua, output bermula dengan dua fungsi — `print` untuk paparan pantas dan `io.write` untuk kawalan penuh — dan dengan **string literal**, iaitu teks yang ditulis terus dalam kod. Kerana teks boleh mengandungi aksara yang sukar ditaip (baris baharu, tab, tanda petik, emoji), Lua menyediakan jujukan escape dan string panjang.',
        'Almost every first program prints something. In Lua, output starts with two functions — `print` for quick display and `io.write` for full control — and with **string literals**, text written directly in code. Because text can contain characters that are hard to type (newlines, tabs, quotes, emoji), Lua provides escape sequences and long strings.'),
      KEY('`print` = mudah (tab dan baris baharu automatik). `io.write` = tepat (tiada apa-apa ditambah).', '`print` = convenient (tabs and newline added automatically). `io.write` = exact (nothing is added).', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`print(a, b, c)` menukar setiap argumen dengan `tostring`, memisahkannya dengan **tab** dan menambah **baris baharu**.', '`print(a, b, c)` converts each argument with `tostring`, separates them with **tabs** and adds a **newline**.'],
        ['`io.write(a, b)` menulis string dan nombor tepat seperti diberi — tiada pemisah, tiada baris baharu.', '`io.write(a, b)` writes strings and numbers exactly as given — no separators, no newline.'],
        ['String literal: `"teks"` atau `\'teks\'` (sama sahaja); pilih jenis petikan yang tidak muncul dalam teks.', 'String literals: `"text"` or `\'text\'` (identical); pick the quote that does not appear in the text.'],
        ['[[escape-sequence|Jujukan escape]]: `\\n`, `\\t`, `\\\\`, `\\"`, `\\\'`, `\\ddd` (desimal), `\\xHH` (heksa), `\\u{XXXX}` (Unicode), `\\z` (langkau ruang).', '[[escape-sequence|Escape sequences]]: `\\n`, `\\t`, `\\\\`, `\\"`, `\\\'`, `\\ddd` (decimal), `\\xHH` (hex), `\\u{XXXX}` (Unicode), `\\z` (skip whitespace).'],
        ['String panjang `[[ … ]]` merentas baris dan **tidak** memproses escape.', 'Long strings `[[ … ]]` span lines and do **not** process escapes.'],
      )),
    S('detailed_theory',
      P('String Lua ialah jujukan **bait** yang tidak boleh diubah (immutable), bukan jujukan "aksara". Teks UTF-8 seperti "☺" menggunakan tiga bait, jadi `#"☺"` ialah 3 — pustaka `utf8` (5.3+) mengira aksara sebenar. Penghurai menukar setiap jujukan escape kepada bait yang diwakilinya **semasa kompil**, jadi `"\\65"` dan `"A"` menghasilkan string yang sama dalam bytecode. `\\u{263A}` menjana bait UTF-8 bagi titik kod Unicode itu.',
        'A Lua string is an immutable sequence of **bytes**, not of "characters". UTF-8 text such as "☺" uses three bytes, so `#"☺"` is 3 — the `utf8` library (5.3+) counts real characters. The parser converts every escape sequence into the byte(s) it stands for **at compile time**, so `"\\65"` and `"A"` produce the same string in the bytecode. `\\u{263A}` generates the UTF-8 bytes of that Unicode code point.'),
      P('`print` direka untuk penyahpepijatan dan output ringkas: ia memanggil `tostring` pada setiap nilai, jadi ia boleh mencetak `nil`, boolean dan table (sebagai alamat). `io.write` direka untuk output data: ia hanya menerima string dan nombor, dan menulis float dengan format `%.14g` (jadi `io.write(3.0)` menulis `3`, manakala `print(3.0)` menulis `3.0`). Untuk output yang diformat dengan tepat — lajur, tempat perpuluhan, sifar di hadapan — gunakan `string.format`, yang mengikuti spesifikasi `printf` bahasa C.',
        '`print` is designed for debugging and quick output: it calls `tostring` on every value, so it can print `nil`, booleans and tables (as an address). `io.write` is designed for data output: it only accepts strings and numbers, and writes floats with the `%.14g` format (so `io.write(3.0)` writes `3`, while `print(3.0)` writes `3.0`). For precisely formatted output — columns, decimal places, leading zeros — use `string.format`, which follows C’s `printf` specification.')),
    S('technical_terminology', TERMS('escape-sequence', 'function', 'variable', 'comment')),
    S('syntax_rules',
      UL(
        ['`"a" .. "b"` menggabungkan; nombor ditukar secara automatik (`1 .. ""` → `"1"`).', '`"a" .. "b"` concatenates; numbers are converted automatically (`1 .. ""` → `"1"`).'],
        ['`[[ … ]]` dan `[==[ … ]==]` — string panjang; baris baharu pertama selepas `[[` diabaikan.', '`[[ … ]]` and `[==[ … ]==]` — long strings; a newline right after `[[` is ignored.'],
        ['`string.format("%s %d %.2f %5s %-5s %03d", …)` — string, integer, 2 tempat perpuluhan, lebar 5 (kanan/kiri), sifar di hadapan.', '`string.format("%s %d %.2f %5s %-5s %03d", …)` — string, integer, 2 decimal places, width 5 (right/left), leading zeros.'],
        ['Method string: `("hi"):upper()` sama dengan `string.upper("hi")`.', 'String methods: `("hi"):upper()` is the same as `string.upper("hi")`.'],
      )),
    S('code_demonstration',
      CODE('print-basics', 'lua', 'lua54', ['Tingkah laku print', 'How print behaves'], `
print("Lua", 5.4, true, nil)
print()
print("end")
`, 'Lua\t5.4\ttrue\tnil\n\nend'),
      EXPLAIN('print-basics',
        ['1', 'Empat nilai berlainan jenis; `print` menukar setiap satu dengan `tostring` dan meletakkan **tab** di antaranya.', 'Four values of different types; `print` converts each with `tostring` and puts a **tab** between them.'],
        ['2', '`print()` tanpa argumen hanya mencetak baris kosong.', '`print()` with no arguments just prints an empty line.'],
        ['3', 'Setiap panggilan `print` berakhir dengan baris baharu.', 'Every `print` call ends with a newline.'])),
    S('complete_examples',
      CODE('escapes', 'lua', 'lua54', ['Jujukan escape', 'Escape sequences'], String.raw`
print("Line 1\nLine 2")
print("Name:\tAisyah")
print("She said \"hello\"")
print('It\'s fine', "C:\\temp")
print("\65\066\x43", "\u{263A}")
`, 'Line 1\nLine 2\nName:\tAisyah\nShe said "hello"\nIt\'s fine\tC:\\temp\nABC\t☺', {
        debug: BUG(String.raw`
print("Line 1\nLine 2")
print("Name:\tAisyah")
print("She said \"hello\"")
print('It\'s fine', "C:\temp\data")
`, "example:4: invalid escape sequence near '\"C:\temp\\d'",
          'Laluan Windows ditulis dengan garis condong terbalik tunggal. `\\t` ialah escape yang sah (tab!) jadi ia diam-diam menukar teks — lihat mesej: teks yang dipetik sudah mengandungi **tab sebenar** selepas `C:`. Kemudian `\\d` bukan escape yang diketahui, lalu fail gagal dikompil; mesej memetik teks yang dibaca setakat itu. Dua pembetulan: gandakan garis condong (`"C:\\\\temp\\\\data"`) atau gunakan string panjang `[[C:\\temp\\data]]`, yang tidak memproses escape.',
          'The Windows path is written with single backslashes. `\\t` is a valid escape (a tab!) so it silently changes the text — look at the message: the quoted text already contains a **real tab** after `C:`. Then `\\d` is not a known escape, so the file fails to compile; the message quotes the text read so far. Two fixes: double the backslashes (`"C:\\\\temp\\\\data"`) or use a long string `[[C:\\temp\\data]]`, which does not process escapes.'),
      }),
      EXPLAIN('escapes',
        ['1', '`\\n` memecahkan output kepada dua baris.', '`\\n` breaks the output into two lines.'],
        ['2', '`\\t` memasukkan tab — berguna untuk lajur ringkas.', '`\\t` inserts a tab — handy for simple columns.'],
        ['3', '`\\"` meletakkan tanda petik berganda di dalam string berpetik berganda.', '`\\"` puts a double quote inside a double-quoted string.'],
        ['4', '`\\\'` untuk petikan tunggal; `\\\\` menghasilkan satu garis condong terbalik.', '`\\\'` for a single quote; `\\\\` produces one backslash.'],
        ['5', '`\\65` (desimal), `\\066` (desimal, tiga digit) dan `\\x43` (heksa) ialah kod bait untuk A, B dan C. `\\u{263A}` ialah titik kod Unicode ☺.', '`\\65` (decimal), `\\066` (decimal, three digits) and `\\x43` (hex) are byte codes for A, B and C. `\\u{263A}` is the Unicode code point ☺.']),
      CODE('long-strings', 'lua', 'lua54', ['String panjang dan \\z', 'Long strings and \\z'], String.raw`
local poem = [[
Roses are red,
Lua is blue.]]
print(poem)
print([==[contains ]] safely, and \n stays as typed]==])
print(#"one \z
       two")
`, 'Roses are red,\nLua is blue.\ncontains ]] safely, and \\n stays as typed\n7'),
      EXPLAIN('long-strings',
        ['1–3', 'String panjang merentas beberapa baris. Baris baharu **sejurus** selepas `[[` diabaikan, jadi puisi bermula dengan "Roses".', 'A long string spanning several lines. The newline **right** after `[[` is ignored, so the poem starts with "Roses".'],
        ['4', 'Mencetak dua baris puisi.', 'Prints the poem’s two lines.'],
        ['5', 'Aras `==` membolehkan `]]` di dalam teks; escape seperti `\\n` **tidak** diproses dalam string panjang.', 'The `==` level allows `]]` inside the text; escapes like `\\n` are **not** processed in long strings.'],
        ['6–7', '`\\z` melangkau baris baharu dan ruang yang mengikutinya, jadi string ialah `"one two"` — 7 bait. Berguna untuk memecah string yang panjang dalam kod.', '`\\z` skips the newline and the spaces after it, so the string is `"one two"` — 7 bytes. Useful for splitting a long string in the source code.'])),
    S('line_by_line',
      EXPLAIN('print-basics',
        ['1', '`nil` dicetak sebagai teks `nil`. Ini menjadikan `print` alat debug yang selamat: ia tidak pernah gagal disebabkan jenis nilai.', '`nil` is printed as the text `nil`. This makes `print` a safe debugging tool: it never fails because of a value’s type.']),
      EXPLAIN('escapes',
        ['4', 'Dua gaya petikan dalam satu baris: petikan tunggal untuk teks yang mengandungi `\'`, petikan berganda untuk laluan.', 'Two quoting styles on one line: single quotes for text containing `\'`, double quotes for the path.'])),
    S('why_this_way',
      P('Mengapa dua fungsi output? Kerana keperluannya berbeza. Semasa debugging, anda mahu melihat **apa sahaja** nilai dengan cepat — `print` tidak pernah menolak sesuatu nilai. Semasa menghasilkan fail CSV, laporan atau protokol, anda mahu kawalan bait demi bait — `io.write` tidak menambah apa-apa yang tidak diminta. Mengapa escape? Kerana kod sumber ialah teks satu baris demi satu baris, dan sesetengah aksara tidak boleh atau sukar ditulis terus.',
        'Why two output functions? Because the needs differ. While debugging, you want to see **any** value quickly — `print` never refuses a value. When producing a CSV file, a report or a protocol, you want byte-by-byte control — `io.write` adds nothing you did not ask for. Why escapes? Because source code is text, line by line, and some characters cannot be typed directly or are awkward to.'),
      P('Pengaturcara menggunakan string panjang **apabila** teks mempunyai banyak baris atau garis condong (templat, SQL, laluan Windows, regex), dan `string.format` **apabila** output mesti sejajar atau mempunyai bilangan tempat perpuluhan tetap.', 'Developers use long strings **when** text has many lines or backslashes (templates, SQL, Windows paths, regexes), and `string.format` **when** output must line up or have a fixed number of decimal places.')),
    S('execution_flow',
      OL(
        ['Semasa kompil, penghurai menukar `"\\65\\066\\x43"` kepada string `"ABC"` dan menyimpannya sebagai pemalar.', 'At compile time, the parser turns `"\\65\\066\\x43"` into the string `"ABC"` and stores it as a constant.'],
        ['Semasa runtime, `print` menerima nilai-nilainya dan memanggil `tostring` pada setiap satu.', 'At run time, `print` receives its values and calls `tostring` on each.'],
        ['Ia menulis nilai pertama, kemudian untuk setiap nilai seterusnya: tab, kemudian nilai.', 'It writes the first value, then for each further value: a tab, then the value.'],
        ['Ia menulis baris baharu dan memulangkan tiada nilai.', 'It writes a newline and returns no values.'],
      )),
    S('memory_behaviour',
      P('String Lua tidak boleh diubah: `s:upper()` mencipta string **baharu**. String pendek (hingga 40 bait) di-intern — setiap kandungan wujud sekali sahaja dalam memori — jadi perbandingan `==` sangat pantas. Menggabungkan string dalam gelung dengan `..` mencipta string sementara pada setiap langkah; untuk banyak kepingan, kumpul dalam table dan gunakan `table.concat` sekali (lihat Kejuruteraan Perisian).',
        'Lua strings are immutable: `s:upper()` creates a **new** string. Short strings (up to 40 bytes) are interned — each content exists only once in memory — so `==` comparison is very fast. Concatenating strings in a loop with `..` creates a temporary string at every step; for many pieces, collect them in a table and use `table.concat` once (see Software Engineering).')),
    S('alternative_implementations',
      P('`io.write` dan `string.format` memberi kawalan yang tidak ada pada `print`:', '`io.write` and `string.format` give control that `print` does not have:'),
      CODE('write-format', 'lua', 'lua54', ['io.write dan string.format', 'io.write and string.format'], String.raw`
io.write("a", "b", 1, "\n")
io.write(3.0, " vs ", tostring(3.0), "\n")
io.write(string.format("[%5.1f] [%-6s] [%03d]\n", 3.14159, "ok", 7))
`, 'ab1\n3 vs 3.0\n[  3.1] [ok    ] [007]'),
      EXPLAIN('write-format',
        ['1', 'Tiada tab, tiada baris baharu automatik — `\\n` mesti ditulis sendiri.', 'No tabs, no automatic newline — `\\n` must be written explicitly.'],
        ['2', '`io.write(3.0)` menulis `3` (format `%.14g`), manakala `tostring(3.0)` memberi `"3.0"`.', '`io.write(3.0)` writes `3` (the `%.14g` format), while `tostring(3.0)` gives `"3.0"`.'],
        ['3', '`%5.1f`: lebar 5, satu tempat perpuluhan, rata kanan. `%-6s`: lebar 6, rata kiri. `%03d`: lebar 3 dengan sifar di hadapan.', '`%5.1f`: width 5, one decimal place, right-aligned. `%-6s`: width 6, left-aligned. `%03d`: width 3 with leading zeros.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan `+` untuk menggabungkan string (`"a" + "b"` ialah ralat aritmetik).', 'Using `+` to join strings (`"a" + "b"` is an arithmetic error).'],
        ['Menulis laluan Windows dengan garis condong tunggal (`"C:\\new"` mengandungi baris baharu!).', 'Writing Windows paths with single backslashes (`"C:\\new"` contains a newline!).'],
        ['Menjangka `io.write` menambah baris baharu atau ruang.', 'Expecting `io.write` to add a newline or spaces.'],
        ['Menggunakan `#s` untuk mengira aksara dalam teks UTF-8 — ia mengira bait; gunakan `utf8.len`.', 'Using `#s` to count characters in UTF-8 text — it counts bytes; use `utf8.len`.'],
        ['Terlupa menutup petikan, menghasilkan `unfinished string`.', 'Forgetting to close a quote, producing `unfinished string`.'],
      )),
    S('debugging',
      P('Ralat string hampir semuanya ditemui **semasa kompil**, jadi tiada output separa. Dua mesej yang paling biasa: `unfinished string` (petikan tidak ditutup sebelum hujung baris) dan `invalid escape sequence` (garis condong diikuti aksara yang tidak dikenali). Mesej menunjukkan teks berhampiran ralat, yang membantu mencari baris. Contoh berikut terlupa petikan penutup:',
        'String errors are almost all found **at compile time**, so there is no partial output. The two most common messages: `unfinished string` (a quote not closed before the end of the line) and `invalid escape sequence` (a backslash followed by an unknown character). The message shows the text near the error, which helps locate the line. The following example forgets the closing quote:'),
      CODE('closed-quote', 'lua', 'lua54', ['Petikan yang ditutup dengan betul', 'A correctly closed quote'], `
local greeting = "Selamat pagi"
print(greeting .. ", Aisyah")
`, 'Selamat pagi, Aisyah', {
        debug: BUG(`
local greeting = "Selamat pagi
print(greeting .. ", Aisyah")
`, `example:1: unfinished string near '"Selamat pagi'`,
          'String berpetik biasa tidak boleh merentas baris. Penghurai mencapai hujung baris 1 sebelum menemui petikan penutup, lalu melaporkan `unfinished string` dengan teks yang telah dibacanya. Tambah `"` di hujung teks; jika anda memang mahu teks berbilang baris, gunakan `\\n` atau string panjang `[[ ]]`.',
          'An ordinary quoted string cannot span lines. The parser reaches the end of line 1 before finding the closing quote, so it reports `unfinished string` with the text it had read. Add the `"` at the end of the text; if you really want multi-line text, use `\\n` or a long string `[[ ]]`.'),
      }),
      EXPLAIN('closed-quote',
        ['1', 'String literal ditutup pada baris yang sama.', 'A string literal closed on the same line.'],
        ['2', 'Penggabungan dengan string kedua.', 'Concatenation with a second string.'])),
    S('performance',
      P('`print` dan `io.write` menulis ke penimbal (buffer) sistem; output tidak semestinya muncul serta-merta jika program terhenti secara tiba-tiba — `io.stdout:flush()` memaksa tulisan. Untuk output yang besar, membina satu string dengan `table.concat` dan menulisnya sekali jauh lebih pantas daripada beribu panggilan `..` dalam gelung, yang menyalin teks berulang kali (kos kuadratik).',
        '`print` and `io.write` write into a system buffer; output does not necessarily appear immediately if the program stops abruptly — `io.stdout:flush()` forces the write. For large output, building one string with `table.concat` and writing it once is much faster than thousands of `..` operations in a loop, which copy the text again and again (quadratic cost).')),
    S('software_engineering',
      P('Bandingkan dua cara membina laporan baris demi baris:', 'Compare two ways of building a report line by line:'),
      CODE('poor-concat-loop', 'lua', 'lua54', ['Pelaksanaan lemah: .. dalam gelung', 'Poor implementation: .. in a loop'], `
local items = {"apple", "banana", "kiwi"}
local report = ""
for i = 1, #items do
  report = report .. i .. ". " .. items[i] .. "\\n"
end
io.write(report)
`, '1. apple\n2. banana\n3. kiwi'),
      EXPLAIN('poor-concat-loop',
        ['1–2', 'Senarai dan string laporan kosong.', 'A list and an empty report string.'],
        ['3–5', 'Setiap pusingan mencipta string baharu yang menyalin keseluruhan laporan setakat ini. Untuk 3 baris tiada masalah; untuk 100 000 baris, kosnya kuadratik.', 'Every pass creates a new string that copies the whole report so far. For 3 lines it does not matter; for 100,000 lines the cost is quadratic.'],
        ['6', 'Menulis keputusan.', 'Writes the result.']),
      CODE('improved-table-concat', 'lua', 'lua54', ['Pelaksanaan lebih baik: kumpul, kemudian table.concat', 'Improved implementation: collect, then table.concat'], `
local items = {"apple", "banana", "kiwi"}
local lines = {}
for i, item in ipairs(items) do
  lines[#lines + 1] = string.format("%d. %s", i, item)
end
print(table.concat(lines, "\\n"))
`, '1. apple\n2. banana\n3. kiwi'),
      EXPLAIN('improved-table-concat',
        ['1', 'Senarai yang sama seperti versi lemah.', 'The same list as the poor version.'],
        ['2', 'Table untuk mengumpul baris.', 'A table to collect the lines.'],
        ['3–5', 'Setiap baris diformat sekali dan ditambah ke hujung table — tiada salinan berulang.', 'Each line is formatted once and appended to the table — no repeated copying.'],
        ['6', '`table.concat` mencantumkan semua kepingan dengan pemisah dalam satu operasi linear.', '`table.concat` joins all pieces with a separator in one linear operation.']),
      P('Output sama; versi kedua berskala linear dan memisahkan **format** (`string.format`) daripada **pemasangan** (`table.concat`), menjadikan kedua-duanya mudah diubah.', 'The same output; the second version scales linearly and separates **formatting** (`string.format`) from **assembly** (`table.concat`), making both easy to change.')),
    S('industry_use_cases',
      UL(
        ['Penjana laman statik dan enjin templat Lua menggunakan string panjang untuk templat HTML.', 'Static-site generators and Lua template engines use long strings for HTML templates.'],
        ['Alat baris arahan menggunakan `io.write` dan `string.format` untuk output jadual yang sejajar.', 'Command-line tools use `io.write` and `string.format` for aligned table output.'],
        ['Aplikasi berbilang bahasa menyimpan teks antara muka dengan escape `\\u{…}` untuk aksara khas.', 'Multilingual applications store interface text with `\\u{…}` escapes for special characters.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `escapes` dan padankan setiap baris output dengan baris kod.', 'Run `escapes` and match every output line with its line of code.'],
        ['Jalankan versi berpepijat `escapes` — perhatikan `\\t` dalam `C:\\temp` tidak menyebabkan ralat tetapi `\\d` ya.', 'Run the buggy version of `escapes` — notice the `\\t` in `C:\\temp` causes no error but `\\d` does.'],
        ['Ubah `write-format` supaya nombor dipaparkan dengan tiga tempat perpuluhan.', 'Change `write-format` so the number is shown with three decimal places.'],
      )),
    S('mini_project',
      P('**Kad nama dalam kotak.** Cetak nama dan jawatan dalam kotak yang lebarnya menyesuaikan diri dengan teks terpanjang.', '**A name card in a box.** Print a name and job title inside a box whose width adapts to the longest text.'),
      CODE('name-card', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local lines = {"Nur Aisyah", "Lua Developer", "QHAZE TECH"}

local width = 0
for _, text in ipairs(lines) do
  width = math.max(width, #text)
end

local border = "+" .. string.rep("-", width + 2) .. "+"
print(border)
for _, text in ipairs(lines) do
  print(string.format("| %-" .. width .. "s |", text))
end
print(border)
`, '+---------------+\n| Nur Aisyah    |\n| Lua Developer |\n| QHAZE TECH    |\n+---------------+'),
      EXPLAIN('name-card',
        ['1', 'Teks kad.', 'The card text.'],
        ['3–6', 'Cari panjang teks terpanjang dengan `math.max`.', 'Find the length of the longest text with `math.max`.'],
        ['8', '`string.rep("-", n)` mengulang sengkang; tambah 2 untuk ruang di kiri dan kanan.', '`string.rep("-", n)` repeats the dash; add 2 for the spaces on the left and right.'],
        ['9–13', 'Format `%-13s` (dibina secara dinamik) merata kiri setiap baris dalam lebar yang sama, jadi bingkai kanan sejajar.', 'The `%-13s` format (built dynamically) left-aligns every line to the same width, so the right border lines up.'])),
    S('summary',
      UL(
        ['`print` menambah tab dan baris baharu; `io.write` menulis tepat seperti diberi.', '`print` adds tabs and a newline; `io.write` writes exactly what it is given.'],
        ['Escape seperti `\\n`, `\\t`, `\\"`, `\\\\` dan `\\u{…}` mewakili aksara khas; `[[ ]]` tidak memproses escape.', 'Escapes such as `\\n`, `\\t`, `\\"`, `\\\\` and `\\u{…}` stand for special characters; `[[ ]]` processes no escapes.'],
        ['String ialah bait yang tidak boleh diubah; `#` mengira bait.', 'Strings are immutable bytes; `#` counts bytes.'],
        ['Gunakan `string.format` untuk output yang tepat dan `table.concat` untuk banyak kepingan.', 'Use `string.format` for precise output and `table.concat` for many pieces.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah output `print("a", "b")` berbanding `io.write("a", "b")`?', 'What is the output of `print("a", "b")` compared with `io.write("a", "b")`?'],
        ['Mengapakah `"C:\\new"` tidak mengandungi teks `\\new`?', 'Why does `"C:\\new"` not contain the text `\\new`?'],
        ['Apakah nilai `#"☺"` dan mengapa?', 'What is the value of `#"☺"` and why?'],
        ['Bilakah anda akan memilih `[==[ … ]==]` berbanding `[[ … ]]`?', 'When would you choose `[==[ … ]==]` over `[[ … ]]`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.1 — Lexical Conventions (string literals and escapes)', url: `${MANUAL}#3.1` },
        { title: 'Lua 5.4 Reference Manual — print', url: `${MANUAL}#pdf-print` },
        { title: 'Lua 5.4 Reference Manual — string.format', url: `${MANUAL}#pdf-string.format` },
        { title: 'Programming in Lua (1st ed.) — 2.4 Strings', url: `${PIL}/2.4.html` },
      )),
  ],
};

// ─── 4.2 io.read() for user input ──────────────────────────────────────────

export const LUA101_4_2: LectureContentDef = {
  courseCode: 'LUA101',
  module: 4,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Membaca input pengguna daripada [[standard-input|input standard]] dengan `io.read`.', 'Read user input from [[standard-input]] with `io.read`.'],
        ['Memilih format bacaan yang betul: `"l"`, `"n"`, `"a"`.', 'Choose the right read format: `"l"`, `"n"`, `"a"`.'],
        ['Mengesahkan input dan mengendalikan input yang tidak sah atau habis (`nil`).', 'Validate input and handle invalid or exhausted input (`nil`).'],
        ['Membaca semua baris sehingga hujung input.', 'Read every line until the end of input.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1: `print`, `io.write` dan string.', 'Lecture 4.1: `print`, `io.write` and strings.'],
        ['Blok `if` dan gelung ringkas (contoh terdahulu).', '`if` blocks and simple loops (earlier examples).'],
      )),
    S('introduction',
      P('Program menjadi interaktif apabila ia boleh **bertanya**. `io.read` membaca apa yang pengguna taip di terminal, atau teks yang dihantar melalui paip (`lua prog.lua < data.txt`). Tetapi input pengguna tidak boleh dipercayai: ia mungkin kosong, salah jenis, atau tamat lebih awal. Kuliah ini mengajar cara membaca input **dan** cara melindungi program daripadanya.',
        'A program becomes interactive when it can **ask**. `io.read` reads what the user types in the terminal, or text piped in (`lua prog.lua < data.txt`). But user input cannot be trusted: it may be empty, the wrong type, or end early. This lecture teaches how to read input **and** how to protect a program from it.'),
      INFO('Contoh dalam kuliah ini mempunyai panel **Input (stdin)**: teks itu disuapkan kepada program semasa pengesahan dan apabila anda menekan **Jalankan**. Teks yang ditaip tidak dipaparkan semula dalam output.', 'The examples in this lecture have an **Input (stdin)** panel: that text is fed to the program during verification and when you press **Run**. Typed text is not echoed in the output.', ['Cara contoh berfungsi', 'How the examples work'])),
    S('fundamental_concepts',
      UL(
        ['`io.read("l")` (lalai): satu baris **tanpa** baris baharu; `"L"` mengekalkannya.', '`io.read("l")` (the default): one line **without** the newline; `"L"` keeps it.'],
        ['`io.read("n")`: satu nombor (melangkau ruang kosong di hadapan); memulangkan `nil` jika teks bukan nombor.', '`io.read("n")`: one number (skipping leading whitespace); returns `nil` if the text is not a number.'],
        ['`io.read("a")`: semua input yang tinggal (string kosong jika tiada lagi).', '`io.read("a")`: all remaining input (an empty string if nothing is left).'],
        ['Apabila input habis, `"l"` dan `"n"` memulangkan **`nil`** — program mesti menyemaknya.', 'When input runs out, `"l"` and `"n"` return **`nil`** — the program must check for it.'],
        ['Input baris sentiasa **string**; tukar dengan `tonumber` dan semak hasilnya.', 'Line input is always a **string**; convert it with `tonumber` and check the result.'],
      )),
    S('detailed_theory',
      P('`io.read` membaca daripada fail `io.stdin`, yang disambungkan oleh sistem pengendalian kepada papan kekunci atau kepada fail/paip. Ia **menyekat** (block): program berhenti sehingga input tersedia. Setiap bacaan memindahkan "kedudukan baca" ke hadapan — selepas `io.read("n")` membaca `12`, baki baris (termasuk ruang dan baris baharu) masih menunggu. Inilah punca pepijat klasik: membaca nombor dengan `"n"`, kemudian membaca nama dengan `"l"`, dan mendapat **string kosong** kerana `"l"` membaca baki baris nombor itu.',
        '`io.read` reads from the file `io.stdin`, which the operating system connects to the keyboard or to a file or pipe. It **blocks**: the program waits until input is available. Each read moves the "read position" forward — after `io.read("n")` reads `12`, the rest of the line (including spaces and the newline) is still waiting. This causes a classic bug: reading a number with `"n"`, then reading a name with `"l"`, and getting an **empty string** because `"l"` reads the rest of the number’s line.'),
      P('Pengesahan input mengikut prinsip **"jangan percaya, sahkan"**: semak bahawa nilai wujud (bukan `nil`), jenisnya betul (`tonumber` berjaya), dan nilainya dalam julat yang munasabah (umur antara 0 dan 150). Apabila input tidak sah, program yang baik memberitahu pengguna apa yang salah dan bertanya semula — atau, untuk input daripada fail, melaporkan baris yang rosak dan meneruskan.',
        'Input validation follows the principle **"don’t trust, verify"**: check that a value exists (is not `nil`), has the right type (`tonumber` succeeds), and lies in a sensible range (an age between 0 and 150). When input is invalid, a good program tells the user what is wrong and asks again — or, for input from a file, reports the bad line and carries on.')),
    S('technical_terminology', TERMS('standard-input', 'variable', 'function', 'escape-sequence')),
    S('syntax_rules',
      UL(
        ['`local line = io.read()` sama dengan `io.read("l")`.', '`local line = io.read()` is the same as `io.read("l")`.'],
        ['`local a, b = io.read("n", "n")` — beberapa format sekaligus, satu nilai bagi setiap format.', '`local a, b = io.read("n", "n")` — several formats at once, one value per format.'],
        ['`tonumber(s)` memulangkan nombor atau `nil`; `tonumber(s, 16)` untuk asas lain.', '`tonumber(s)` returns a number or `nil`; `tonumber(s, 16)` for other bases.'],
        ['Corak membaca semua baris: `while true do local line = io.read() if not line then break end … end`.', 'Pattern for reading every line: `while true do local line = io.read() if not line then break end … end`.'],
      )),
    S('code_demonstration',
      CODE('read-name', 'lua', 'lua54', ['Membaca satu baris', 'Reading one line'], `
io.write("What is your name? ")
local name = io.read("l")
print("Hello, " .. name .. "!")
`, 'What is your name? Hello, Aisyah!', {
        input: 'Aisyah\n',
        debug: BUG(`
io.write("What is your name? ")
local name = io.read("l")
io.write("Which city? ")
local city = io.read("l")
print(name .. " from " .. city)
`, "example:5: attempt to concatenate a nil value (local 'city')",
          'Input hanya mempunyai **satu** baris. Bacaan kedua tidak menemui apa-apa, jadi `io.read` memulangkan `nil` — tanpa ralat — dan ralat hanya muncul pada baris 5 apabila `nil` digabungkan. Setiap bacaan boleh gagal; semak hasilnya (`if not city then … end`) atau beri nilai lalai (`city or "unknown"`).',
          'The input has only **one** line. The second read finds nothing, so `io.read` returns `nil` — without an error — and the error only appears on line 5 when `nil` is concatenated. Every read can fail; check the result (`if not city then … end`) or give a default (`city or "unknown"`).'),
      }),
      EXPLAIN('read-name',
        ['1', '`io.write` memaparkan soalan **tanpa** baris baharu, jadi kursor kekal pada baris yang sama — gaya biasa untuk gesaan (prompt).', '`io.write` shows the question **without** a newline, so the cursor stays on the same line — the usual style for a prompt.'],
        ['2', 'Program berhenti di sini sehingga pengguna menekan Enter; `"l"` memulangkan baris tanpa `\\n`.', 'The program waits here until the user presses Enter; `"l"` returns the line without the `\\n`.'],
        ['3', 'Gunakan input dalam salam.', 'Use the input in a greeting.'])),
    S('complete_examples',
      CODE('read-numbers', 'lua', 'lua54', ['Membaca nombor dengan "n"', 'Reading numbers with "n"'], `
local a = io.read("n")
local b = io.read("n")
print(a + b, math.type(a), math.type(b))
`, '15.5\tinteger\tfloat', {
        input: '12 3.5\n',
        debug: BUG(`
local a = io.read("l")
local b = io.read("l")
print(a + b, math.type(a), math.type(b))
`, "example:3: attempt to add a 'string' with a 'nil'",
          'Dengan `"l"`, bacaan pertama mengambil **seluruh baris** `"12 3.5"` sebagai string, dan bacaan kedua tidak menemui baris lagi (`nil`). Mesej Lua 5.4 menamakan jenis kedua-dua operan: string dan nil. Gunakan `"n"` untuk membaca nombor yang dipisahkan ruang, atau pecahkan baris sendiri.',
          'With `"l"`, the first read takes the **whole line** `"12 3.5"` as a string, and the second read finds no more lines (`nil`). The Lua 5.4 message names the types of both operands: string and nil. Use `"n"` to read space-separated numbers, or split the line yourself.'),
      }),
      EXPLAIN('read-numbers',
        ['1–2', '`"n"` melangkau ruang kosong, membaca satu nombor dan berhenti. Dua bacaan mengambil `12` dan `3.5` daripada baris yang sama.', '`"n"` skips whitespace, reads one number and stops. Two reads take `12` and `3.5` from the same line.'],
        ['3', 'Nilai sudah nombor (bukan string) dan mengekalkan subjenisnya: 12 integer, 3.5 float.', 'The values are already numbers (not strings) and keep their subtype: 12 is an integer, 3.5 a float.']),
      CODE('read-validate', 'lua', 'lua54', ['Bertanya semula sehingga input sah', 'Asking again until the input is valid'], `
local age
while not age do
  local line = io.read("l")
  if line == nil then break end            -- input ended
  local n = tonumber(line)
  if n and n >= 0 and n <= 150 then
    age = n
  else
    print("Please enter an age between 0 and 150, not: " .. line)
  end
end
print("age:", age)
`, 'Please enter an age between 0 and 150, not: seventeen\nPlease enter an age between 0 and 150, not: 999\nage:\t17', { input: 'seventeen\n999\n17\n' }),
      EXPLAIN('read-validate',
        ['1–2', '`age` bermula `nil`; gelung berjalan selagi tiada umur yang sah.', '`age` starts as `nil`; the loop runs while there is no valid age.'],
        ['3–4', 'Baca satu baris; jika input tamat, keluar dan biarkan `age` sebagai `nil`.', 'Read one line; if input has ended, leave the loop with `age` still `nil`.'],
        ['5–7', 'Tukar dan sahkan **jenis** (nombor) dan **julat** (0–150). Hanya input yang lulus kedua-duanya diterima.', 'Convert and validate both **type** (a number) and **range** (0–150). Only input that passes both is accepted.'],
        ['8–10', 'Mesej yang membantu: apa yang dijangka dan apa yang diterima.', 'A helpful message: what was expected and what was received.'],
        ['12', 'Keputusan selepas dua input ditolak.', 'The result after two rejected inputs.'])),
    S('line_by_line',
      EXPLAIN('read-validate',
        ['6', 'Susunan penting: `n and …` memastikan perbandingan `n >= 0` hanya dijalankan apabila `n` bukan `nil` — membandingkan `nil` dengan nombor akan menjadi ralat.', 'Order matters: `n and …` makes sure the comparison `n >= 0` only runs when `n` is not `nil` — comparing `nil` with a number would be an error.']),
      EXPLAIN('read-numbers',
        ['3', 'Jika input ialah `12 abc`, bacaan kedua memulangkan `nil` (bukan ralat), dan baris 3 akan gagal pada `a + b`. Sentiasa semak setiap nilai yang dibaca.', 'If the input were `12 abc`, the second read would return `nil` (not an error), and line 3 would fail at `a + b`. Always check every value read.'])),
    S('why_this_way',
      P('Mengapa `io.read` memulangkan `nil` dan bukannya membaling ralat? Kerana input yang habis atau tidak sepadan adalah **keadaan biasa**, bukan pengecualian — fail tamat, pengguna menekan Ctrl+D. Memulangkan `nil` membolehkan program memilih: berhenti, bertanya semula, atau menggunakan nilai lalai. Kosnya ialah tanggungjawab: jika anda tidak menyemak, `nil` akan meletup di tempat lain dengan mesej yang mengelirukan.',
        'Why does `io.read` return `nil` instead of raising an error? Because exhausted or mismatched input is a **normal situation**, not an exception — files end, users press Ctrl+D. Returning `nil` lets the program choose: stop, ask again, or use a default. The cost is responsibility: if you do not check, the `nil` explodes somewhere else with a misleading message.'),
      P('Gunakan `"n"` **apabila** input ialah nombor yang dipisahkan ruang dan anda mengawal formatnya; gunakan `"l"` dengan `tonumber` **apabila** input datang daripada manusia, kerana anda boleh melaporkan baris penuh yang salah.', 'Use `"n"` **when** input is space-separated numbers and you control the format; use `"l"` with `tonumber` **when** input comes from humans, because you can report the full bad line.')),
    S('execution_flow',
      OL(
        ['`read-validate` membaca `seventeen`; `tonumber` memulangkan `nil`; mesej dicetak dan gelung berulang.', '`read-validate` reads `seventeen`; `tonumber` returns `nil`; a message is printed and the loop repeats.'],
        ['Ia membaca `999`; nombor sah tetapi di luar julat; mesej kedua.', 'It reads `999`; a valid number but out of range; a second message.'],
        ['Ia membaca `17`; semua semakan lulus; `age` menjadi 17.', 'It reads `17`; every check passes; `age` becomes 17.'],
        ['Syarat gelung `not age` kini palsu, jadi gelung tamat dan keputusan dicetak.', 'The loop condition `not age` is now false, so the loop ends and the result is printed.'],
      )),
    S('memory_behaviour',
      P('Setiap baris yang dibaca ialah string baharu dalam heap. Dalam gelung yang membaca jutaan baris, string lama menjadi sampah sebaik sahaja pemboleh ubah local beralih ke baris seterusnya, jadi memori kekal kecil. `io.read("a")` pula memuatkan **keseluruhan** input ke dalam satu string — mudah untuk fail kecil, tetapi berisiko untuk fail berbilang gigabait.',
        'Every line read is a new string on the heap. In a loop that reads millions of lines, old strings become garbage as soon as the local moves on to the next line, so memory stays small. `io.read("a")`, by contrast, loads the **entire** input into one string — convenient for small files, risky for multi-gigabyte ones.')),
    S('alternative_implementations',
      P('Untuk input berbentuk data (contohnya senarai markah), membaca semuanya sekali gus dan memprosesnya dengan corak boleh menjadi lebih ringkas:', 'For data-shaped input (for example a list of scores), reading everything at once and processing it with a pattern can be simpler:'),
      CODE('read-all', 'lua', 'lua54', ['Membaca semua input dan memecahkannya', 'Reading all input and splitting it'], `
local text = io.read("a")
local count, longest = 0, ""
for line in text:gmatch("[^\\n]+") do
  count = count + 1
  if #line > #longest then longest = line end
end
print(count, longest)
`, '3\tbanana', { input: 'apple\nbanana\nkiwi\n' }),
      EXPLAIN('read-all',
        ['1', '`"a"` membaca semua baki input sebagai satu string.', '`"a"` reads all remaining input as one string.'],
        ['2', 'Kiraan baris dan baris terpanjang setakat ini.', 'The line count and the longest line so far.'],
        ['3–6', '`gmatch("[^\\n]+")` mengulangi setiap jujukan aksara bukan-baris-baharu, iaitu setiap baris.', '`gmatch("[^\\n]+")` iterates over every run of non-newline characters, i.e. every line.'],
        ['7', 'Tiga baris; "banana" paling panjang.', 'Three lines; "banana" is the longest.'])),
    S('common_mistakes',
      UL(
        ['Tidak menyemak `nil` selepas `io.read`.', 'Not checking for `nil` after `io.read`.'],
        ['Membandingkan input baris dengan nombor tanpa `tonumber` (`"5" == 5` ialah `false`).', 'Comparing line input with a number without `tonumber` (`"5" == 5` is `false`).'],
        ['Mencampur `"n"` dan `"l"` lalu mendapat string kosong daripada baki baris.', 'Mixing `"n"` and `"l"` and getting an empty string from the rest of a line.'],
        ['Mengesahkan jenis tetapi bukan julat (umur −5 atau 999 diterima).', 'Validating the type but not the range (an age of −5 or 999 accepted).'],
      )),
    S('debugging',
      P('Pepijat input jarang berlaku di baris `io.read` itu sendiri — `io.read` hampir tidak pernah membaling ralat. Sebaliknya ia memulangkan `nil` atau string yang tidak dijangka, dan masalah meletup kemudian. Strategi: cetak nilai mentah dengan `print(("%q"):format(line))` — `%q` memaparkan string dengan petikan dan escape, jadi anda boleh melihat ruang tersembunyi, `\\r` daripada fail Windows, atau string kosong. Kedua-dua contoh berpepijat di atas menunjukkan ralat yang muncul **selepas** bacaan yang gagal.',
        'Input bugs rarely happen on the `io.read` line itself — `io.read` almost never raises an error. Instead it returns `nil` or an unexpected string, and the problem explodes later. Strategy: print the raw value with `print(("%q"):format(line))` — `%q` shows the string with quotes and escapes, so you can see hidden spaces, a `\\r` from Windows files, or an empty string. Both buggy examples above show errors that appear **after** a failed read.'),
      WARN('Fail teks daripada Windows berakhir dengan `\\r\\n`. `io.read("l")` membuang `\\n` sahaja, jadi `"17\\r"` tidak sama dengan `"17"` dan `tonumber("17\\r")` tetap berfungsi tetapi perbandingan string gagal.', 'Text files from Windows end lines with `\\r\\n`. `io.read("l")` only removes the `\\n`, so `"17\\r"` is not equal to `"17"`; `tonumber("17\\r")` still works but string comparison fails.', ['Perangkap Windows', 'Windows trap'])),
    S('performance',
      P('Membaca baris demi baris sesuai untuk input sebarang saiz kerana memori kekal tetap. `io.read("a")` lebih pantas untuk fail kecil kerana satu panggilan sistem, tetapi menggunakan memori sebanyak saiz fail. Untuk input interaktif, prestasi tidak penting — manusia jauh lebih perlahan daripada program.',
        'Reading line by line suits input of any size because memory stays constant. `io.read("a")` is faster for small files because it is one system call, but it uses memory equal to the file size. For interactive input, performance does not matter — humans are far slower than programs.')),
    S('software_engineering',
      P('Kod yang membaca input secara terus di merata tempat sukar diuji dan diulang guna. Bandingkan:', 'Code that reads input directly all over the place is hard to test and reuse. Compare:'),
      CODE('poor-inline-read', 'lua', 'lua54', ['Pelaksanaan lemah: bacaan dan logik bercampur', 'Poor implementation: reading and logic mixed'], `
local price = tonumber(io.read("l"))
local qty = tonumber(io.read("l"))
print("total", price * qty)
`, 'total\t37.5', { input: '7.5\n5\n' }),
      EXPLAIN('poor-inline-read',
        ['1–2', 'Tiada semakan: input yang tidak sah menghasilkan `nil` dan ralat aritmetik yang tidak membantu pengguna.', 'No checks: invalid input produces `nil` and an arithmetic error that does not help the user.'],
        ['3', 'Logik pengiraan terikat kepada input papan kekunci — tidak boleh diuji dengan nilai tetap.', 'The calculation is tied to keyboard input — it cannot be tested with fixed values.']),
      CODE('improved-read-function', 'lua', 'lua54', ['Pelaksanaan lebih baik: fungsi bacaan yang mengesahkan', 'Improved implementation: a validating read function'], `
local function readNumber(label)
  local line = io.read("l")
  local n = line and tonumber(line)
  if not n then
    return nil, label .. ": expected a number, got " .. tostring(line)
  end
  return n
end

local function total(price, qty) return price * qty end

local price = assert(readNumber("price"))
local qty = assert(readNumber("quantity"))
print("total", total(price, qty))
`, 'total\t37.5', {
        input: '7.5\n5\n',
        debug: BUG(`
local function readNumber(label)
  local line = io.read("l")
  local n = line and tonumber(line)
  if not n then
    return nil, label .. ": expected a number, got " .. tostring(line)
  end
  return n
end

local price = assert(readNumber("price"))
local qty = assert(readNumber("quantity"))
local discount = assert(readNumber("discount"))
print("total", price * qty - discount)
`, "example:12: discount: expected a number, got nil",
          'Program kini meminta input ketiga yang tidak wujud. `readNumber` memulangkan `nil` dan mesej yang **menamakan medan** dan nilai yang diterima, dan `assert` membalingnya dengan baris panggilan. Bandingkan dengan mesej "arithmetic on a nil value" yang samar: corak `(nil, mesej)` + `assert` memberi pengguna dan pengaturcara maklumat yang tepat.',
          'The program now asks for a third input that does not exist. `readNumber` returns `nil` and a message that **names the field** and the value received, and `assert` raises it with the calling line. Compare with the vague "arithmetic on a nil value" message: the `(nil, message)` + `assert` pattern gives users and programmers precise information.'),
      }),
      EXPLAIN('improved-read-function',
        ['1–8', '`readNumber` membaca, menukar dan mengesahkan, kemudian memulangkan sama ada nombor atau `nil` dan mesej yang menamakan medan — corak `(nil, mesej)` Lua.', '`readNumber` reads, converts and validates, then returns either the number or `nil` and a message naming the field — Lua’s `(nil, message)` pattern.'],
        ['10', '`total` ialah logik tulen tanpa input — mudah diuji dengan `total(2, 3)`.', '`total` is pure logic with no input — easy to test with `total(2, 3)`.'],
        ['12–14', '`assert` menghentikan program dengan mesej yang jelas jika input tidak sah; jika tidak, logik dijalankan.', '`assert` stops the program with a clear message if input is invalid; otherwise the logic runs.'])),
    S('industry_use_cases',
      UL(
        ['Alat baris arahan membaca konfigurasi atau data melalui paip (`cat data.txt | lua process.lua`).', 'Command-line tools read configuration or data through pipes (`cat data.txt | lua process.lua`).'],
        ['Pertandingan pengaturcaraan (competitive programming) menggunakan `io.read("n")` untuk membaca input berformat dengan pantas.', 'Competitive programming uses `io.read("n")` to read formatted input quickly.'],
        ['Skrip pentadbiran sistem bertanya pengesahan (`y/n`) sebelum operasi berbahaya.', 'System administration scripts ask for confirmation (`y/n`) before dangerous operations.'],
      )),
    S('practical_demonstration',
      OL(
        ['Simpan `read-validate` sebagai `age.lua` dan jalankannya; cuba input kosong, negatif dan teks.', 'Save `read-validate` as `age.lua` and run it; try empty, negative and text input.'],
        ['Jalankan `lua age.lua < answers.txt` dengan fail yang mengandungi tiga baris.', 'Run `lua age.lua < answers.txt` with a file containing three lines.'],
        ['Tekan Ctrl+D (atau Ctrl+Z, Enter pada Windows) tanpa menaip dan perhatikan keputusan `nil`.', 'Press Ctrl+D (or Ctrl+Z, Enter on Windows) without typing and observe the `nil` result.'],
      )),
    S('mini_project',
      P('**Purata markah.** Baca markah satu baris setiap satu sehingga input tamat. Langkau baris yang tidak sah dengan amaran, kemudian paparkan bilangan, purata dan markah tertinggi.', '**A score average.** Read scores one per line until input ends. Skip invalid lines with a warning, then display the count, the average and the highest score.'),
      CODE('score-average', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local count, sum, best = 0, 0, nil
local lineNo = 0
while true do
  local line = io.read("l")
  if not line then break end
  lineNo = lineNo + 1
  local score = tonumber(line)
  if score then
    count, sum = count + 1, sum + score
    if not best or score > best then best = score end
  else
    print("line " .. lineNo .. " skipped: " .. line)
  end
end
print(string.format("%d scores, average %.1f, best %d", count, sum / count, best))
`, 'line 3 skipped: absent\n4 scores, average 76.0, best 92', { input: '78\n92\nabsent\n65\n69\n' }),
      EXPLAIN('score-average',
        ['1–2', 'Pengumpul: bilangan, jumlah, markah tertinggi (`nil` hingga markah pertama) dan nombor baris.', 'Accumulators: count, sum, highest score (`nil` until the first score) and the line number.'],
        ['3–6', 'Baca sehingga input tamat; kira nombor baris untuk mesej amaran.', 'Read until input ends; count line numbers for warning messages.'],
        ['7–11', 'Markah sah dikumpul. `not best or score > best` mengendalikan markah pertama dengan selamat.', 'Valid scores are accumulated. `not best or score > best` handles the first score safely.'],
        ['12–14', 'Baris tidak sah dilaporkan dengan nombor barisnya, kemudian dilangkau.', 'Invalid lines are reported with their line number, then skipped.'],
        ['15', '(78 + 92 + 65 + 69) / 4 = 76.0; markah tertinggi 92.', '(78 + 92 + 65 + 69) / 4 = 76.0; the highest score is 92.'])),
    S('summary',
      UL(
        ['`io.read("l")` membaca baris, `"n"` nombor, `"a"` semuanya.', '`io.read("l")` reads a line, `"n"` a number, `"a"` everything.'],
        ['Input yang habis atau tidak sepadan memulangkan `nil` — sentiasa semak.', 'Exhausted or mismatched input returns `nil` — always check.'],
        ['Sahkan jenis **dan** julat; laporkan input yang salah dengan jelas.', 'Validate type **and** range; report bad input clearly.'],
        ['Asingkan bacaan input daripada logik supaya logik boleh diuji.', 'Separate input reading from logic so the logic can be tested.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dipulangkan oleh `io.read("n")` jika pengguna menaip `hello`?', 'What does `io.read("n")` return if the user types `hello`?'],
        ['Mengapakah `"5" == 5` palsu dalam Lua?', 'Why is `"5" == 5` false in Lua?'],
        ['Apakah perbezaan antara `"l"` dan `"L"`?', 'What is the difference between `"l"` and `"L"`?'],
        ['Bagaimanakah anda membaca setiap baris sehingga input tamat?', 'How do you read every line until input ends?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual — io.read', url: `${MANUAL}#pdf-io.read` },
        { title: 'Lua 5.4 Reference Manual §6.8 — Input and Output Facilities', url: `${MANUAL}#6.8` },
        { title: 'Lua 5.4 Reference Manual — tonumber', url: `${MANUAL}#pdf-tonumber` },
        { title: 'Programming in Lua (1st ed.) — 21.1 The Simple I/O Model', url: `${PIL}/21.1.html` },
      )),
  ],
};

// ─── 4.3 Reading error messages and stack tracebacks ───────────────────────

export const LUA101_4_3: LectureContentDef = {
  courseCode: 'LUA101',
  module: 4,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Membaca setiap bahagian mesej ralat Lua: chunk, baris, penerangan.', 'Read every part of a Lua error message: chunk, line, description.'],
        ['Mentafsir [[stack-traceback]] dari atas ke bawah untuk mencari punca ralat.', 'Interpret a [[stack-traceback]] from top to bottom to find the cause of an error.'],
        ['Membaling ralat dengan `error` dan `assert`, termasuk argumen tahap (level).', 'Raise errors with `error` and `assert`, including the level argument.'],
        ['Menangkap ralat dengan `pcall` dan `xpcall`.', 'Catch errors with `pcall` and `xpcall`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.2: [[call-stack|stack panggilan]] dan bingkai.', 'Lecture 3.2: the [[call-stack]] and frames.'],
        ['Kuliah 4.2: corak `(nil, mesej)` dan `assert`.', 'Lecture 4.2: the `(nil, message)` pattern and `assert`.'],
      )),
    S('introduction',
      P('Setiap pengaturcara melihat beribu mesej ralat. Pemula membacanya sebagai "program rosak"; profesional membacanya sebagai **petunjuk yang tepat**: di mana, apa dan bagaimana. Mesej ralat Lua pendek tetapi padat dengan maklumat, dan traceback menunjukkan laluan penuh program sampai ke tempat ralat. Kuliah ini mengajar cara membaca kedua-duanya, dan cara menulis kod yang menghasilkan ralat yang **membantu**.',
        'Every programmer sees thousands of error messages. Beginners read them as "the program is broken"; professionals read them as **precise clues**: where, what and how. Lua’s error messages are short but dense with information, and the traceback shows the full path the program took to the error. This lecture teaches how to read both, and how to write code that produces **helpful** errors.'),
      KEY('Baris pertama = **apa** dan **di mana**. Traceback = **bagaimana** program sampai ke situ.', 'The first line = **what** and **where**. The traceback = **how** the program got there.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Bentuk mesej:** `nama_chunk:baris: penerangan`, contohnya `example:3: attempt to index a nil value (local \'cfg\')`.', '**Message shape:** `chunk_name:line: description`, for example `example:3: attempt to index a nil value (local \'cfg\')`.'],
        ['**Penerangan** menyebut operasi (index, call, arithmetic, concatenate, compare) dan, jika boleh, nama dan jenis pemboleh ubah (`local`, `global`, `field`, `upvalue`).', 'The **description** names the operation (index, call, arithmetic, concatenate, compare) and, when possible, the variable’s name and kind (`local`, `global`, `field`, `upvalue`).'],
        ['**[[stack-traceback|Traceback]]:** satu baris bagi setiap bingkai, daripada tempat ralat (atas) hingga chunk utama (bawah).', '**[[stack-traceback|Traceback]]:** one line per frame, from the error location (top) down to the main chunk (bottom).'],
        ['**`error(mesej, tahap)`:** membaling ralat; tahap 1 (lalai) menyalahkan fungsi semasa, tahap 2 menyalahkan pemanggil, tahap 0 tiada kedudukan.', '**`error(message, level)`:** raises an error; level 1 (the default) blames the current function, level 2 blames the caller, level 0 adds no position.'],
        ['**`pcall(f, ...)` / `xpcall(f, pengendali, ...)`:** menjalankan fungsi dalam mod dilindungi dan memulangkan `false` serta ralat dan bukannya menghentikan program.', '**`pcall(f, ...)` / `xpcall(f, handler, ...)`:** run a function in protected mode and return `false` plus the error instead of stopping the program.'],
      )),
    S('detailed_theory',
      P('Apabila ralat berlaku, Lua **membuka gulungan** (unwind) stack: ia meninggalkan bingkai satu demi satu sehingga menemui panggilan dilindungi (`pcall`/`xpcall`) atau sampai ke hos. Interpreter `lua` ialah hos yang menangkap ralat di peringkat atas, mencetak mesej dan traceback, kemudian keluar dengan status 1. Traceback mesti dihasilkan **sebelum** gulungan dibuka, kerana selepas itu bingkai telah hilang — itulah sebabnya `xpcall` menerima pengendali (contohnya `debug.traceback`) yang dipanggil pada saat ralat, dengan stack masih utuh.',
        'When an error happens, Lua **unwinds** the stack: it leaves frames one by one until it finds a protected call (`pcall`/`xpcall`) or reaches the host. The `lua` interpreter is a host that catches errors at the top level, prints the message and the traceback, then exits with status 1. The traceback must be produced **before** unwinding, because afterwards the frames are gone — that is why `xpcall` takes a handler (for example `debug.traceback`) that is called at the moment of the error, with the stack still intact.'),
      P('Nilai ralat tidak semestinya string. `error({code = 404})` membaling table — berguna untuk ralat berstruktur yang boleh diperiksa oleh kod — tetapi Lua tidak menambah kedudukan pada nilai bukan string. Argumen **tahap** pula menentukan kedudukan mana yang ditambah: fungsi pengesahan menggunakan tahap 2 supaya mesej menunjuk ke **pemanggil** yang memberi argumen salah, bukan ke baris `error` di dalam pengesah. Mesej yang menyalahkan baris yang betul menjimatkan masa penyahpepijatan.',
        'An error value does not have to be a string. `error({code = 404})` raises a table — useful for structured errors that code can inspect — but Lua adds no position to non-string values. The **level** argument decides which position is added: validation functions use level 2 so the message points at the **caller** that passed the bad argument, not at the `error` line inside the validator. A message that blames the right line saves debugging time.')),
    S('technical_terminology', TERMS('stack-traceback', 'call-stack', 'function', 'chunk')),
    S('syntax_rules',
      UL(
        ['`error("mesej")` — tahap 1; `error("mesej", 2)` — salahkan pemanggil; `error("mesej", 0)` — tanpa kedudukan.', '`error("message")` — level 1; `error("message", 2)` — blame the caller; `error("message", 0)` — no position.'],
        ['`assert(nilai, mesej)` — memulangkan `nilai` jika benar; jika tidak, membaling `mesej` (atau "assertion failed!").', '`assert(value, message)` — returns `value` if truthy; otherwise raises `message` (or "assertion failed!").'],
        ['`local ok, err = pcall(f, a, b)` — `ok` ialah `true` dan nilai pulangan, atau `false` dan ralat.', '`local ok, err = pcall(f, a, b)` — `ok` is `true` plus the return values, or `false` plus the error.'],
        ['`xpcall(f, debug.traceback)` — seperti `pcall`, tetapi ralat dihantar kepada pengendali yang boleh menambah traceback.', '`xpcall(f, debug.traceback)` — like `pcall`, but the error goes through a handler that can add a traceback.'],
      )),
    S('code_demonstration',
      CODE('error-anatomy', 'lua', 'lua54', ['Anatomi mesej ralat', 'Anatomy of an error message'], `
local function divide(a, b)
  if b == 0 then
    error("division by zero")
  end
  return a / b
end

print(pcall(divide, 10, 4))
print(pcall(divide, 10, 0))
`, 'true\t2.5\nfalse\texample:3: division by zero'),
      EXPLAIN('error-anatomy',
        ['1–6', 'Fungsi yang membaling ralat apabila pembahagi sifar. `error` dengan tahap lalai (1) menambah kedudukan baris `error` itu sendiri.', 'A function that raises an error when the divisor is zero. `error` with the default level (1) adds the position of that `error` line.'],
        ['8', 'Panggilan dilindungi yang berjaya: `true` diikuti nilai pulangan 2.5.', 'A successful protected call: `true` followed by the return value 2.5.'],
        ['9', 'Panggilan yang gagal: `false` dan mesej `example:3: division by zero` — nama chunk, baris 3, penerangan.', 'A failing call: `false` and the message `example:3: division by zero` — chunk name, line 3, description.'])),
    S('complete_examples',
      CODE('error-levels', 'lua', 'lua54', ['Tahap 2: salahkan pemanggil', 'Level 2: blame the caller'], `
local function setVolume(level)
  if type(level) ~= "number" then
    error("volume must be a number, got " .. type(level), 2)
  end
  return level
end

local ok, err = pcall(function()
  setVolume("loud")
end)
print(err)
`, 'example:9: volume must be a number, got string'),
      EXPLAIN('error-levels',
        ['1–6', 'Fungsi pengesahan. Tahap **2** bermaksud "laporkan kedudukan pemanggil saya".', 'A validating function. Level **2** means "report my caller’s position".'],
        ['8–10', 'Fungsi tanpa nama yang memanggil `setVolume` dengan argumen salah pada baris 9.', 'An anonymous function calls `setVolume` with a wrong argument on line 9.'],
        ['11', 'Mesej menunjuk ke **baris 9** — tempat kesilapan sebenar dibuat — bukan baris 3 di dalam pengesah.', 'The message points at **line 9** — where the real mistake was made — not line 3 inside the validator.']),
      CODE('traceback', 'lua', 'lua54', ['Membaca stack traceback', 'Reading a stack traceback'], `
local function level3() error("something broke") end
local function level2() level3() end
local function level1() level2() end

local ok, trace = xpcall(level1, debug.traceback)
for line in trace:gmatch("[^\\n]+") do
  if line:find("example:") then print(line) end
end
`, "example:1: something broke\n\texample:1: in upvalue 'level3'\n\texample:2: in upvalue 'level2'\n\texample:3: in function <example:3>\n\texample:5: in main chunk", {
        debug: BUG(`
local function level3() error("something broke") end
local function level2() level3() end
local function level1() leve2() end

level1()
`, "example:3: attempt to call a nil value (global 'leve2')",
          'Tanpa `pcall`, ralat menghentikan program dan interpreter mencetak mesej (dan traceback penuh di terminal). Di sini ralat **bukan** "something broke": salah ejaan `leve2` pada baris 3 dibaca sebagai global `nil`, jadi program gagal lebih awal daripada yang dijangka. Sentiasa baca baris pertama dengan teliti — ralat yang anda lihat mungkin bukan ralat yang anda sangka.',
          'Without `pcall`, the error stops the program and the interpreter prints the message (and the full traceback in a terminal). Here the error is **not** "something broke": the misspelling `leve2` on line 3 is read as a `nil` global, so the program fails earlier than expected. Always read the first line carefully — the error you see may not be the error you expect.'),
      }),
      EXPLAIN('traceback',
        ['1–3', 'Tiga fungsi yang memanggil satu sama lain; ralat dibaling di dalam yang paling dalam.', 'Three functions calling each other; the error is raised inside the innermost one.'],
        ['5', '`xpcall` memanggil `debug.traceback` pada saat ralat, semasa stack masih utuh, dan memulangkan mesej bersama traceback.', '`xpcall` calls `debug.traceback` at the moment of the error, while the stack is still intact, and returns the message plus the traceback.'],
        ['6–8', 'Kita hanya mencetak baris yang menyebut chunk kita (`example:`), membuang bingkai dalaman interpreter seperti `[C]: in function \'error\'`.', 'We only print lines that mention our chunk (`example:`), dropping interpreter-internal frames such as `[C]: in function \'error\'`.'])),
    S('line_by_line',
      EXPLAIN('traceback',
        ['1', 'Baca output dari atas: (1) mesej — baris 1; (2) bingkai teratas `level3` di baris 1; (3) pemanggilnya `level2` di baris 2; (4) `level1` di baris 3 (dipaparkan sebagai `function <example:3>` kerana `xpcall` memanggilnya terus); (5) chunk utama di baris 5. "upvalue" bermaksud fungsi itu dicapai melalui local luar (lihat [[closure]]).', 'Read the output from the top: (1) the message — line 1; (2) the top frame `level3` at line 1; (3) its caller `level2` at line 2; (4) `level1` at line 3 (shown as `function <example:3>` because `xpcall` called it directly); (5) the main chunk at line 5. "upvalue" means the function was reached through an outer local (see [[closure]]).']),
      EXPLAIN('error-levels',
        ['3', 'Mesej juga termasuk **jenis yang diterima** (`got string`) — maklumat yang membolehkan pemanggil membetulkan kesilapan tanpa membuka kod pengesah.', 'The message also includes the **received type** (`got string`) — information that lets the caller fix the mistake without opening the validator’s code.'])),
    S('why_this_way',
      P('Mengapa Lua menggunakan `error`/`pcall` dan bukannya blok `try/catch`? Kerana ia mencapai perkara yang sama dengan **fungsi biasa** — falsafah "mekanisme, bukan polisi" daripada kuliah 1.1. `pcall` boleh dipanggil di mana-mana, dihantar sebagai nilai, dan bergabung dengan fungsi lain. Mengapa tahap? Kerana ralat yang menyalahkan baris yang salah membazirkan masa: pengesah yang baik menunjuk kepada pemanggil.',
        'Why does Lua use `error`/`pcall` instead of `try/catch` blocks? Because it achieves the same thing with **ordinary functions** — the "mechanisms, not policies" philosophy from lecture 1.1. `pcall` can be called anywhere, passed as a value, and combined with other functions. Why levels? Because an error that blames the wrong line wastes time: a good validator points at the caller.'),
      P('Gunakan `error` **apabila** sesuatu yang tidak sepatutnya berlaku berlaku (pepijat, argumen salah); gunakan pulangan `(nil, mesej)` **apabila** kegagalan ialah keadaan biasa yang pemanggil patut kendalikan (fail tiada, input salah). Gunakan `pcall` di **sempadan** program — gelung utama, pengendali permintaan — supaya satu kegagalan tidak menjatuhkan keseluruhan sistem.', 'Use `error` **when** something that should not happen happens (a bug, a wrong argument); use `(nil, message)` returns **when** failure is a normal situation the caller should handle (a missing file, bad input). Use `pcall` at program **boundaries** — the main loop, a request handler — so one failure does not bring the whole system down.')),
    S('execution_flow',
      OL(
        ['`xpcall` memanggil `level1` dalam mod dilindungi; `level1` memanggil `level2`, yang memanggil `level3`.', '`xpcall` calls `level1` in protected mode; `level1` calls `level2`, which calls `level3`.'],
        ['`level3` memanggil `error`; Lua mencipta mesej `example:1: something broke`.', '`level3` calls `error`; Lua builds the message `example:1: something broke`.'],
        ['**Sebelum** membuka gulungan, Lua memanggil pengendali `debug.traceback`, yang membaca setiap bingkai yang masih wujud.', '**Before** unwinding, Lua calls the handler `debug.traceback`, which reads every frame that still exists.'],
        ['Stack dibuka gulungan sehingga `xpcall`; ia memulangkan `false` dan teks traceback.', 'The stack unwinds to `xpcall`; it returns `false` and the traceback text.'],
        ['Program diteruskan seperti biasa dan menapis baris traceback.', 'The program continues normally and filters the traceback lines.'],
      )),
    S('memory_behaviour',
      P('Membuka gulungan stack membebaskan semua bingkai antara ralat dan `pcall`; local di dalamnya tidak lagi dirujuk dan boleh dikutip. Pemboleh ubah `<close>` (Lua 5.4) dalam bingkai tersebut **ditutup** semasa gulungan dibuka — cara yang boleh dipercayai untuk menutup fail atau melepaskan sumber walaupun ralat berlaku. String traceback boleh menjadi besar untuk rekursi yang dalam; jangan simpannya untuk setiap ralat dalam gelung yang panjang.',
        'Unwinding the stack frees every frame between the error and the `pcall`; the locals in them are no longer referenced and can be collected. `<close>` variables (Lua 5.4) in those frames are **closed** during unwinding — a reliable way to close files or release resources even when an error occurs. Traceback strings can be large for deep recursion; do not keep one for every error in a long loop.')),
    S('alternative_implementations',
      P('Ralat tidak semestinya string. Table ralat membolehkan kod memeriksa **jenis** kegagalan tanpa menghuraikan teks:', 'Errors do not have to be strings. An error table lets code inspect the **kind** of failure without parsing text:'),
      CODE('error-objects', 'lua', 'lua54', ['Ralat berstruktur dengan table', 'Structured errors with tables'], `
local function fetch(id)
  if id > 100 then
    error({code = 404, message = "item " .. id .. " not found"})
  end
  return "item " .. id
end

local ok, err = pcall(fetch, 250)
if not ok and type(err) == "table" and err.code == 404 then
  print("not found:", err.message)
end
`, 'not found:\titem 250 not found'),
      EXPLAIN('error-objects',
        ['1–6', '`error` menerima table dengan kod dan mesej. Lua tidak menambah kedudukan pada nilai bukan string.', '`error` receives a table with a code and a message. Lua adds no position to non-string values.'],
        ['8', '`pcall` memulangkan table itu sebagai nilai ralat.', '`pcall` returns that table as the error value.'],
        ['9–11', 'Kod memeriksa `err.code` secara terus — lebih dipercayai daripada mencari teks dalam mesej.', 'The code checks `err.code` directly — more reliable than searching the message text.'])),
    S('common_mistakes',
      UL(
        ['Membaca hanya perkataan "error" dan melangkau nombor baris dan nama pemboleh ubah.', 'Reading only the word "error" and skipping the line number and variable name.'],
        ['Membalut setiap panggilan dengan `pcall` dan mengabaikan ralat — pepijat menjadi senyap.', 'Wrapping every call in `pcall` and ignoring the error — bugs become silent.'],
        ['Menggunakan tahap 1 dalam fungsi pengesahan, jadi ralat menyalahkan pengesah dan bukannya pemanggil.', 'Using level 1 in validation functions, so the error blames the validator instead of the caller.'],
        ['Mencetak `err` apabila ia table — memaparkan `table: 0x…` dan bukannya mesej.', 'Printing `err` when it is a table — showing `table: 0x…` instead of the message.'],
      )),
    S('debugging',
      P('Senarai semak membaca ralat: (1) **chunk dan baris** — buka fail itu di baris itu; (2) **operasi** — index, call, arithmetic, concatenate, compare; (3) **nama dan jenis** — `local \'x\'`, `global \'y\'`, `field \'z\'`; (4) **traceback** — naik ke pemanggil sehingga anda menemui tempat nilai salah dicipta. Ingat bahawa baris ralat ialah tempat nilai salah **digunakan**, bukan semestinya tempat ia **dicipta**. Contoh berikut mengindeks medan bersarang yang tiada:',
        'An error-reading checklist: (1) **chunk and line** — open that file at that line; (2) **operation** — index, call, arithmetic, concatenate, compare; (3) **name and kind** — `local \'x\'`, `global \'y\'`, `field \'z\'`; (4) **traceback** — climb to the callers until you find where the bad value was created. Remember the error line is where a bad value was **used**, not necessarily where it was **created**. The following example indexes a nested field that is missing:'),
      CODE('nested-field', 'lua', 'lua54', ['Membaca medan bersarang dengan selamat', 'Reading a nested field safely'], `
local config = {window = {width = 1280}}
print(config.window.width)
print(config.audio and config.audio.volume or "default volume")
`, '1280\ndefault volume', {
        debug: BUG(`
local config = {window = {width = 1280}}
print(config.window.width)
print(config.audio.volume)
`, "example:3: attempt to index a nil value (field 'audio')",
          '`config.audio` tidak wujud, jadi ia `nil`, dan mengindeks `nil` dengan `.volume` gagal. Mesej menamakan **medan** yang `nil` (`field \'audio\'`), bukan medan yang anda cuba baca (`volume`) — perbezaan yang sering mengelirukan pemula. Semak setiap tahap (`config.audio and …`) atau pastikan konfigurasi mempunyai nilai lalai.',
          '`config.audio` does not exist, so it is `nil`, and indexing `nil` with `.volume` fails. The message names the **field** that is `nil` (`field \'audio\'`), not the field you tried to read (`volume`) — a distinction that often confuses beginners. Check each level (`config.audio and …`) or make sure the configuration has defaults.'),
      }),
      EXPLAIN('nested-field',
        ['1', 'Konfigurasi bersarang dengan tetingkap tetapi tanpa audio.', 'A nested configuration with a window but no audio.'],
        ['2', 'Medan bersarang yang wujud: 1280.', 'A nested field that exists: 1280.'],
        ['3', '`config.audio and …` berhenti jika `audio` ialah `nil`, lalu `or` memberi nilai lalai.', '`config.audio and …` stops if `audio` is `nil`, then `or` supplies a default.'])),
    S('performance',
      P('`pcall` sangat murah apabila tiada ralat — anda boleh menggunakannya di sempadan program tanpa kebimbangan. Membaling dan menangkap ralat lebih mahal, dan `debug.traceback` lebih mahal lagi kerana ia membina teks untuk setiap bingkai. Jangan gunakan ralat untuk aliran kawalan biasa (contohnya untuk keluar dari gelung) — gunakan `break` atau `return`.',
        '`pcall` is very cheap when no error occurs — you can use it at program boundaries without worry. Raising and catching an error is more expensive, and `debug.traceback` more so because it builds text for every frame. Do not use errors for ordinary control flow (for example to leave a loop) — use `break` or `return`.')),
    S('software_engineering',
      P('Ralat yang baik ialah sebahagian daripada antara muka fungsi. Bandingkan:', 'Good errors are part of a function’s interface. Compare:'),
      CODE('poor-silent', 'lua', 'lua54', ['Pelaksanaan lemah: kegagalan senyap', 'Poor implementation: silent failure'], `
local function parsePercent(text)
  local n = tonumber(text)
  if not n then return 0 end
  return n / 100
end

print(parsePercent("25"), parsePercent("twenty"))
`, '0.25\t0'),
      EXPLAIN('poor-silent',
        ['1–5', 'Input tidak sah diam-diam menjadi 0. Pemanggil tidak tahu bahawa sesuatu salah, dan diskaun 0% mungkin diberikan kepada pelanggan secara senyap.', 'Invalid input silently becomes 0. The caller cannot tell that anything went wrong, and a 0% discount may be silently applied to a customer.'],
        ['7', '`"twenty"` menghasilkan 0 — pepijat yang tersembunyi.', '`"twenty"` produces 0 — a hidden bug.']),
      CODE('improved-explicit', 'lua', 'lua54', ['Pelaksanaan lebih baik: kegagalan yang jelas', 'Improved implementation: explicit failure'], `
local function parsePercent(text)
  local n = tonumber(text)
  if not n then
    return nil, "not a number: " .. tostring(text)
  end
  if n < 0 or n > 100 then
    return nil, "out of range 0-100: " .. n
  end
  return n / 100
end

print(parsePercent("25"))
print(parsePercent("twenty"))
print(parsePercent("150"))
`, '0.25\nnil\tnot a number: twenty\nnil\tout of range 0-100: 150'),
      EXPLAIN('improved-explicit',
        ['1–10', 'Setiap kegagalan memulangkan `nil` dan mesej yang menerangkan **sebab**. Pemanggil memilih sama ada untuk bertanya semula, menggunakan nilai lalai atau `assert`.', 'Every failure returns `nil` and a message explaining **why**. The caller chooses whether to ask again, use a default or `assert`.'],
        ['12–14', 'Tiga keputusan berbeza yang boleh dibezakan dengan jelas.', 'Three distinct results that can be told apart clearly.']),
      P('Kegagalan senyap ialah antara pepijat paling mahal kerana ia ditemui lewat, jauh dari puncanya. Ralat yang jelas dan awal — prinsip **"fail fast"** — memendekkan masa penyahpepijatan secara drastik.', 'Silent failures are among the most expensive bugs because they are discovered late, far from their cause. Clear, early errors — the **"fail fast"** principle — shorten debugging time dramatically.')),
    S('industry_use_cases',
      UL(
        ['Pelayan web OpenResty membalut setiap permintaan dengan `pcall` supaya satu permintaan yang gagal tidak menjatuhkan pelayan.', 'OpenResty web servers wrap each request in `pcall` so one failing request does not bring the server down.'],
        ['Enjin permainan merekod traceback ke fail log apabila skrip mod gagal, dan meneruskan permainan.', 'Game engines write tracebacks to a log file when a mod script fails, and keep the game running.'],
        ['Pustaka Lua yang baik menggunakan `error(…, 2)` untuk argumen salah supaya mesej menunjuk ke kod pengguna.', 'Well-written Lua libraries use `error(…, 2)` for bad arguments so messages point at user code.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `error-levels`, kemudian tukar tahap kepada 1 dan perhatikan nombor baris berubah kepada 3.', 'Run `error-levels`, then change the level to 1 and notice the line number changes to 3.'],
        ['Jalankan versi berpepijat `traceback` dan terangkan mengapa mesejnya bukan "something broke".', 'Run the buggy version of `traceback` and explain why its message is not "something broke".'],
        ['Simpan `traceback` sebagai fail dan jalankan di terminal **tanpa** `xpcall` untuk melihat traceback penuh yang dicetak oleh interpreter.', 'Save `traceback` as a file and run it in a terminal **without** `xpcall` to see the full traceback printed by the interpreter.'],
      )),
    S('mini_project',
      P('**Pelari tugasan yang selamat.** Jalankan senarai tugasan; setiap tugasan mungkin gagal. Laporkan "ok" atau ralat bagi setiap tugasan tanpa menghentikan yang lain, dan ringkaskan di hujung.', '**A safe task runner.** Run a list of tasks; any task may fail. Report "ok" or the error for each task without stopping the others, and summarise at the end.'),
      CODE('task-runner', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local tasks = {
  {"load config", function() return true end},
  {"open database", function() error("connection refused", 0) end},
  {"render page", function() return #("<h1>Hi</h1>") > 0 end},
}

local failed = 0
for _, task in ipairs(tasks) do
  local ok, err = pcall(task[2])
  if ok then
    print("[ ok ] " .. task[1])
  else
    failed = failed + 1
    print("[FAIL] " .. task[1] .. ": " .. tostring(err))
  end
end
print(#tasks - failed .. " passed, " .. failed .. " failed")
`, '[ ok ] load config\n[FAIL] open database: connection refused\n[ ok ] render page\n2 passed, 1 failed'),
      EXPLAIN('task-runner',
        ['1–5', 'Setiap tugasan ialah pasangan `{nama, fungsi}`. Tugasan kedua gagal; tahap 0 memberi mesej tanpa kedudukan, sesuai untuk mesej yang dipaparkan kepada pengguna.', 'Each task is a `{name, function}` pair. The second task fails; level 0 gives a message without a position, suitable for messages shown to users.'],
        ['7', 'Kiraan kegagalan.', 'A failure count.'],
        ['8–9', 'Setiap tugasan dijalankan dalam `pcall`, jadi kegagalan satu tidak menghentikan yang lain.', 'Each task runs inside `pcall`, so one failure does not stop the others.'],
        ['10–15', 'Laporkan keputusan setiap tugasan; `tostring(err)` selamat walaupun ralat bukan string.', 'Report each task’s result; `tostring(err)` is safe even if the error is not a string.'],
        ['17', 'Ringkasan: 2 lulus, 1 gagal. `..` dengan nombor menukarnya kepada teks.', 'A summary: 2 passed, 1 failed. `..` with numbers converts them to text.'])),
    S('summary',
      UL(
        ['Mesej ralat = `chunk:baris: penerangan`; baca operasi, nama dan jenis.', 'An error message = `chunk:line: description`; read the operation, name and kind.'],
        ['Traceback dibaca dari atas (tempat ralat) ke bawah (chunk utama).', 'A traceback is read from the top (the error location) down to the main chunk.'],
        ['`error(m, 2)` menyalahkan pemanggil; `assert` dan corak `(nil, mesej)` menjadikan kegagalan jelas.', '`error(m, 2)` blames the caller; `assert` and the `(nil, message)` pattern make failures explicit.'],
        ['`pcall`/`xpcall` menangkap ralat di sempadan program; jangan senyapkan ralat.', '`pcall`/`xpcall` catch errors at program boundaries; never silence errors.'],
      )),
    S('knowledge_check',
      OL(
        ['Dalam `example:7: attempt to call a nil value (field \'save\')`, apakah tiga maklumat yang diberikan?', 'In `example:7: attempt to call a nil value (field \'save\')`, what three pieces of information are given?'],
        ['Mengapakah fungsi pengesahan menggunakan `error(mesej, 2)`?', 'Why do validation functions use `error(message, 2)`?'],
        ['Mengapakah `xpcall` memerlukan pengendali untuk mendapatkan traceback?', 'Why does `xpcall` need a handler to get a traceback?'],
        ['Bilakah anda memulangkan `(nil, mesej)` dan bilakah anda memanggil `error`?', 'When do you return `(nil, message)` and when do you call `error`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §2.3 — Error Handling', url: `${MANUAL}#2.3` },
        { title: 'Lua 5.4 Reference Manual — error, pcall, xpcall and assert', url: `${MANUAL}#pdf-error` },
        { title: 'Lua 5.4 Reference Manual — debug.traceback', url: `${MANUAL}#pdf-debug.traceback` },
        { title: 'Programming in Lua (1st ed.) — 8.5 Error Messages and Tracebacks', url: `${PIL}/8.5.html` },
      )),
  ],
};

export const LUA101_M4 = [LUA101_4_1, LUA101_4_2, LUA101_4_3];
