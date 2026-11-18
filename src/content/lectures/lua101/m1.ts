import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUA101 · Module 1 — What Is Lua? (standard Lua 5.4; every lua54 example is executed by
 * `npm run verify:code`, and every BUG variant must fail with exactly the documented error).
 */

const ABOUT = 'https://www.lua.org/about.html';
const HOPL = 'https://www.lua.org/doc/hopl.pdf';
const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const VERSIONS = 'https://www.lua.org/versions.html';

// ─── 1.1 The history and design philosophy of Lua ──────────────────────────

export const LUA101_1_1: LectureContentDef = {
  courseCode: 'LUA101',
  module: 1,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan asal-usul Lua (PUC-Rio, 1993) dan masalah yang ingin diselesaikannya.', 'Explain the origin of Lua (PUC-Rio, 1993) and the problem it set out to solve.'],
        ['Menyenaraikan empat matlamat reka bentuk Lua: ringkas, cekap, mudah alih dan boleh dibenamkan.', 'List Lua’s four design goals: simplicity, efficiency, portability and embeddability.'],
        ['Menunjukkan bagaimana [[table]] menjadi satu-satunya struktur data Lua.', 'Show how the [[table]] is Lua’s only data structure.'],
        ['Menerangkan falsafah "mekanisme, bukan polisi" dengan contoh kod.', 'Explain the "mechanisms, not policies" philosophy with code.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Tiada pengalaman pengaturcaraan diperlukan — ini kuliah pertama program Lua.', 'No programming experience is required — this is the first lecture of the Lua programme.'],
        ['Tahu cara membuka terminal atau command prompt.', 'Knowing how to open a terminal or command prompt.'],
        ['Contoh kod boleh dijalankan terus dalam pelayar dengan butang **Jalankan**.', 'Code examples can be run directly in the browser with the **Run** button.'],
      )),
    S('introduction',
      P('Pada tahun 1993, sekumpulan penyelidik di Tecgraf, Pontifical Catholic University of Rio de Janeiro (PUC-Rio), memerlukan bahasa untuk mengkonfigurasi perisian kejuruteraan syarikat minyak Petrobras. Brazil ketika itu mempunyai sekatan perdagangan perisian, jadi mereka mencipta bahasa sendiri: **Lua** ("bulan" dalam bahasa Portugis). Roberto Ierusalimschy, Luiz Henrique de Figueiredo dan Waldemar Celes mereka bentuknya supaya mudah dipelajari oleh jurutera yang bukan pengaturcara.',
        'In 1993, a group of researchers at Tecgraf, the Pontifical Catholic University of Rio de Janeiro (PUC-Rio), needed a language to configure engineering software for the oil company Petrobras. Brazil had trade barriers on software at the time, so they built their own: **Lua** ("moon" in Portuguese). Roberto Ierusalimschy, Luiz Henrique de Figueiredo and Waldemar Celes designed it to be easy for engineers who were not programmers.'),
      KEY('Lua tidak direka untuk menjadi bahasa terbesar, tetapi bahasa **terkecil** yang masih cukup berkuasa — dan yang boleh dimasukkan ke dalam program lain.', 'Lua was not designed to be the biggest language, but the **smallest** language that is still powerful enough — and one that can be placed inside other programs.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Ringkas:** manual rujukan Lua 5.4 kurang daripada 100 halaman; bahasa hanya mempunyai 22 kata terpelihara.', '**Simple:** the Lua 5.4 reference manual is under 100 pages; the language has only 22 reserved words.'],
        ['**Cekap:** Lua ialah antara bahasa skrip [[interpreter|terinterpretasi]] terpantas.', '**Efficient:** Lua is among the fastest [[interpreter|interpreted]] scripting languages.'],
        ['**Mudah alih:** ditulis dalam ISO C, jadi ia berjalan di hampir semua platform — daripada pelayan hingga mikropengawal.', '**Portable:** written in ISO C, so it runs on almost any platform — from servers to microcontrollers.'],
        ['**Boleh dibenamkan:** direka sebagai pustaka yang dimasukkan ke dalam aplikasi C/C++ (kuliah 1.2).', '**Embeddable:** designed as a library that is placed inside C/C++ applications (lecture 1.2).'],
        ['**Satu struktur data:** [[table]] digunakan untuk array, dictionary, rekod, objek dan modul.', '**One data structure:** the [[table]] is used for arrays, dictionaries, records, objects and modules.'],
      )),
    S('detailed_theory',
      P('Falsafah utama Lua ialah **"menyediakan mekanisme, bukan polisi"**. Bahasa lain memberikan ciri siap seperti kelas, warisan atau sistem modul tetap. Lua sebaliknya memberikan beberapa mekanisme umum — [[table]], [[function|fungsi]] kelas pertama, [[closure]] dan [[metatable]] — dan membiarkan pengaturcara membina polisi yang mereka perlukan. Contohnya, Lua tiada kata kunci `class`, tetapi table dan fungsi cukup untuk membina objek (contoh `mechanism-object`).',
        'Lua’s central philosophy is **"provide mechanisms, not policies"**. Other languages ship ready-made features such as classes, inheritance or a fixed module system. Lua instead provides a few general mechanisms — [[table|tables]], first-class [[function|functions]], [[closure|closures]] and [[metatable|metatables]] — and lets programmers build the policies they need. For example, Lua has no `class` keyword, yet tables and functions are enough to build objects (the `mechanism-object` example).'),
      P('Keputusan ini mempunyai akibat praktikal. Pelaksanaan rujukan Lua 5.4 hanya sekitar 30 000 baris C dan binari interpreter kurang daripada 300 KB. Saiz kecil ini menjadikan Lua mudah dibenamkan dalam permainan, peranti dan aplikasi. Kosnya: pustaka standard Lua sengaja kecil — tiada rangkaian, tiada GUI — kerana aplikasi hos dijangka menyediakan keupayaan tersebut.',
        'This decision has practical consequences. The Lua 5.4 reference implementation is only about 30,000 lines of C and the interpreter binary is under 300 KB. That small size makes Lua easy to embed in games, devices and applications. The cost: Lua’s standard library is deliberately small — no networking, no GUI — because the host application is expected to provide those capabilities.'),
      INFO('Lua berevolusi melalui versi 1.0 (1993), 5.0 (2003), 5.1 (2006), 5.2 (2011), 5.3 (2015) dan 5.4 (2020). Kuliah 1.3 membandingkan versi-versi ini.', 'Lua evolved through versions 1.0 (1993), 5.0 (2003), 5.1 (2006), 5.2 (2011), 5.3 (2015) and 5.4 (2020). Lecture 1.3 compares these versions.', ['Garis masa', 'Timeline'])),
    S('technical_terminology', TERMS('interpreter', 'table', 'function', 'variable')),
    S('syntax_rules',
      UL(
        ['Program Lua ialah teks biasa dalam fail berakhiran `.lua`.', 'A Lua program is plain text in a file ending in `.lua`.'],
        ['`print(...)` memaparkan nilai; beberapa nilai dipisahkan dengan tab.', '`print(...)` displays values; several values are separated by tabs.'],
        ['Table dicipta dengan kurungan kerinting: `{}` kosong, `{1, 2, 3}` senarai, `{name = "Lua"}` rekod.', 'Tables are created with curly braces: `{}` empty, `{1, 2, 3}` a list, `{name = "Lua"}` a record.'],
        ['`--` memulakan komen satu baris; Lua mengabaikan semuanya hingga hujung baris.', '`--` starts a one-line comment; Lua ignores everything to the end of the line.'],
        ['`..` menggabungkan (concatenate) string.', '`..` concatenates strings.'],
      )),
    S('code_demonstration',
      CODE('hello-version', 'lua', 'lua54', ['Program pertama dan versi Lua', 'A first program and the Lua version'], `
-- The classic first program
print("Hello, Lua!")

-- _VERSION is a global string set by the interpreter itself
print(_VERSION)
`, 'Hello, Lua!\nLua 5.4'),
      EXPLAIN('hello-version',
        ['2', '`print` ialah fungsi pustaka standard. Ia menerima string `"Hello, Lua!"` dan menulisnya ke output, diikuti baris baharu.', '`print` is a standard library function. It receives the string `"Hello, Lua!"` and writes it to the output, followed by a newline.'],
        ['5', '`_VERSION` ialah pemboleh ubah global yang ditetapkan oleh interpreter. Ia memberitahu versi bahasa (bukan nombor tampalan): `Lua 5.4`.', '`_VERSION` is a global variable set by the interpreter. It tells you the language version (not the patch number): `Lua 5.4`.'])),
    S('complete_examples',
      CODE('one-structure', 'lua', 'lua54', ['Satu table, tiga peranan', 'One table type, three roles'], `
local primes = {2, 3, 5, 7}                                -- array
local capitals = {Malaysia = "Kuala Lumpur", Japan = "Tokyo"}  -- dictionary
local book = {title = "Programming in Lua", edition = 4}   -- record

print(#primes, primes[1])
print(capitals.Japan)
print(book.title .. ", edition " .. book.edition)
`, '4\t2\nTokyo\nProgramming in Lua, edition 4'),
      EXPLAIN('one-structure',
        ['1', 'Table dengan nilai tanpa kunci menjadi **array**: Lua memberi kunci 1, 2, 3, 4 secara automatik (Lua bermula dari 1, bukan 0).', 'A table with values but no keys becomes an **array**: Lua assigns keys 1, 2, 3, 4 automatically (Lua starts at 1, not 0).'],
        ['2', 'Pasangan `kunci = nilai` menjadikan table sebuah **dictionary** — carian nama negara kepada ibu negara.', '`key = value` pairs make the table a **dictionary** — a lookup from country name to capital.'],
        ['3', 'Bentuk yang sama digunakan untuk **rekod**: medan bernama yang menerangkan satu benda.', 'The same form is used for a **record**: named fields describing one thing.'],
        ['5', '`#primes` ialah panjang array (4); `primes[1]` ialah elemen pertama (2).', '`#primes` is the array length (4); `primes[1]` is the first element (2).'],
        ['6–7', '`capitals.Japan` ialah singkatan untuk `capitals["Japan"]`. `..` menggabungkan string dan nombor menjadi satu baris.', '`capitals.Japan` is shorthand for `capitals["Japan"]`. `..` joins strings and numbers into one line.']),
      CODE('mechanism-object', 'lua', 'lua54', ['Mekanisme, bukan polisi: objek daripada table dan fungsi', 'Mechanisms, not policies: an object from a table and a function'], `
local account = {balance = 100}

function account.deposit(amount)
  account.balance = account.balance + amount
end

account.deposit(50)
print(account.balance)
`, '150', {
        debug: BUG(`
local account = {balance = 100}

function account.deposit(amount)
  account.balance = account.balance + amount
end

account.deposit("fifty")
print(account.balance)
`, "example:4: attempt to add a 'number' with a 'string'",
          'Dalam Lua 5.4, aritmetik dengan string dikendalikan oleh **metamethod pustaka string**: ia cuba menukar `"fifty"` kepada nombor, gagal, lalu melaporkan operasi (`add`) dan **jenis** kedua-dua operan (`number` dan `string`). Perhatikan mesej ini tidak menamakan pemboleh ubah — anda perlu melihat baris 4 dan bertanya operan mana yang string. Puncanya ialah argumen salah pada baris 7. Betulkan dengan menghantar nombor: `account.deposit(50)`. (Versi lama seperti Lua 5.3 memberikan mesej berbeza untuk kesilapan yang sama.)',
          'In Lua 5.4, arithmetic with strings is handled by the **string library’s metamethods**: they try to convert `"fifty"` to a number, fail, and report the operation (`add`) and the **types** of both operands (`number` and `string`). Notice the message does not name a variable — you must look at line 4 and ask which operand is a string. The cause is the wrong argument on line 7. Fix it by passing a number: `account.deposit(50)`. (Older versions such as Lua 5.3 give a different message for the same mistake.)'),
      }),
      EXPLAIN('mechanism-object',
        ['1', 'Objek ialah table biasa dengan medan `balance`. Tiada kata kunci `class` diperlukan.', 'The object is a plain table with a `balance` field. No `class` keyword is needed.'],
        ['3–5', '`function account.deposit` menyimpan fungsi sebagai **medan** table. Fungsi ini mengubah keadaan objek — itulah "method".', '`function account.deposit` stores a function as a **field** of the table. The function changes the object’s state — that is a "method".'],
        ['7–8', 'Memanggil method dan membaca keadaan baharu: 100 + 50 = 150.', 'Calling the method and reading the new state: 100 + 50 = 150.'])),
    S('line_by_line',
      P('Penerangan baris demi baris untuk setiap contoh terdapat terus di bawah kodnya (butang **Terangkan kod ini**). Di sini kita meneliti contoh `one-structure` sekali lagi dari sudut reka bentuk bahasa:', 'Line-by-line explanations for every example sit directly under its code (the **Explain this code** button). Here we look at the `one-structure` example again from the language-design point of view:'),
      EXPLAIN('one-structure',
        ['1–3', 'Tiga peranan berbeza, **satu** jenis data. Bahasa lain memerlukan array, map dan struct yang berasingan; Lua hanya memerlukan table. Ini menjadikan interpreter lebih kecil dan pengaturcara hanya perlu mempelajari satu struktur.', 'Three different roles, **one** data type. Other languages need separate arrays, maps and structs; Lua needs only tables. This keeps the interpreter smaller and the programmer learns just one structure.'],
        ['5–7', 'Operasi yang sama (`#`, `[]`, `.`) berfungsi pada semua table. Sintaks `.` hanyalah gula sintaks — mekanisme di bawahnya ialah carian kunci.', 'The same operations (`#`, `[]`, `.`) work on every table. The `.` syntax is just syntactic sugar — the mechanism underneath is a key lookup.']),
      EXPLAIN('hello-version',
        ['2', 'Panggilan fungsi dengan satu argumen string. Kurungan boleh ditinggalkan untuk satu string literal (`print "Hello"`), tetapi kursus ini sentiasa menulis kurungan untuk kejelasan.', 'A function call with one string argument. The parentheses may be omitted for a single string literal (`print "Hello"`), but this course always writes them for clarity.'],
        ['5', 'Membaca global. Program boleh menggunakan `_VERSION` untuk menyemak versi Lua sebelum menggunakan ciri baharu.', 'Reading a global. A program can use `_VERSION` to check the Lua version before relying on newer features.'])),
    S('why_this_way',
      P('Mengapakah Lua tidak menyediakan kelas atau jenis senarai khas? Kerana setiap ciri tambahan membesarkan interpreter, menambah perkara untuk dipelajari dan mengehadkan cara orang menggunakan bahasa. Dengan mekanisme umum, sebuah permainan boleh membina sistem objeknya sendiri, manakala fail konfigurasi hanya menggunakan table ringkas. Kedua-duanya menggunakan bahasa yang sama tanpa membawa ciri yang tidak diperlukan.',
        'Why does Lua not provide classes or a special list type? Because every extra feature enlarges the interpreter, adds things to learn and limits how people use the language. With general mechanisms, a game can build its own object system while a configuration file uses plain tables. Both use the same language without carrying features they do not need.'),
      P('Pengaturcara menggunakan pendekatan ini **apabila** mereka mahu kod kecil, pantas dimuatkan dan mudah disesuaikan — contohnya skrip dalam permainan atau peranti. Mereka memilih bahasa lain apabila memerlukan pustaka besar terbina siap.',
        'Developers use this approach **when** they want small code that loads fast and adapts easily — for example scripts inside games or devices. They choose another language when they need a large built-in library.')),
    S('execution_flow',
      OL(
        ['Interpreter membaca keseluruhan fail `mechanism-object` dan mengkompilnya kepada [[bytecode]] (LUA101 modul 3).', 'The interpreter reads the whole `mechanism-object` file and compiles it to [[bytecode]] (LUA101 module 3).'],
        ['Baris 1 mencipta table baharu dan menyimpan rujukannya dalam local `account`.', 'Line 1 creates a new table and stores a reference to it in the local `account`.'],
        ['Baris 3–5 mencipta nilai fungsi dan menyimpannya dalam medan `deposit` — fungsi **belum** dijalankan.', 'Lines 3–5 create a function value and store it in the `deposit` field — the function is **not** run yet.'],
        ['Baris 7 memanggil fungsi dengan `amount = 50`; badannya membaca dan menulis `account.balance`.', 'Line 7 calls the function with `amount = 50`; its body reads and writes `account.balance`.'],
        ['Baris 8 membaca 150 dan `print` menulisnya ke output.', 'Line 8 reads 150 and `print` writes it to the output.'],
      )),
    S('memory_behaviour',
      P('Setiap table ialah objek dalam memori **heap** yang diurus oleh pengutip sampah (garbage collector) Lua. Pemboleh ubah tidak menyimpan table itu sendiri, tetapi **rujukan** kepadanya. Apabila tiada lagi rujukan, pengutip sampah membebaskan memori secara automatik — pengaturcara Lua tidak memanggil `free` seperti dalam C.',
        'Every table is an object in **heap** memory managed by Lua’s garbage collector. A variable does not hold the table itself but a **reference** to it. When no reference remains, the garbage collector frees the memory automatically — Lua programmers do not call `free` as in C.'),
      INFO('Pengurusan memori automatik ialah satu lagi pilihan reka bentuk "ringkas": ia menghapuskan seluruh kelas pepijat seperti kebocoran memori akibat terlupa membebaskan memori.', 'Automatic memory management is another "simple" design choice: it removes a whole class of bugs such as memory leaks from forgetting to free memory.')),
    S('alternative_implementations',
      P('Baris terakhir `one-structure` menggabungkan string dengan `..`. Cara lain ialah `string.format`, yang memisahkan **templat** daripada **data**:', 'The last line of `one-structure` joins strings with `..`. Another way is `string.format`, which separates the **template** from the **data**:'),
      CODE('format-alternative', 'lua', 'lua54', ['string.format sebagai alternatif kepada ..', 'string.format as an alternative to ..'], `
local book = {title = "Programming in Lua", edition = 4}

print(book.title .. ", edition " .. book.edition)
print(string.format("%s, edition %d", book.title, book.edition))
`, 'Programming in Lua, edition 4\nProgramming in Lua, edition 4'),
      EXPLAIN('format-alternative',
        ['1', 'Rekod yang sama seperti sebelum ini.', 'The same record as before.'],
        ['3', 'Penggabungan: mudah untuk dua atau tiga bahagian.', 'Concatenation: easy for two or three parts.'],
        ['4', '`%s` digantikan dengan string, `%d` dengan integer. Templat ini lebih mudah dibaca apabila terdapat banyak nilai, dan memberi kawalan format (contohnya `%.2f` untuk dua tempat perpuluhan).', '`%s` is replaced by a string, `%d` by an integer. The template is easier to read when there are many values, and it gives formatting control (for example `%.2f` for two decimal places).']),
      P('Gunakan `..` untuk gabungan ringkas dan `string.format` untuk laporan atau output yang perlu diformat dengan tepat.', 'Use `..` for short joins and `string.format` for reports or output that must be formatted precisely.')),
    S('common_mistakes',
      UL(
        ['Menganggap indeks array Lua bermula dari 0 — ia bermula dari **1**.', 'Assuming Lua array indexes start at 0 — they start at **1**.'],
        ['Mencari kata kunci `class` — Lua membina objek daripada table dan fungsi.', 'Looking for a `class` keyword — Lua builds objects from tables and functions.'],
        ['Menulis `+` untuk menggabungkan string; Lua menggunakan `..` (dan `+` cuba melakukan aritmetik).', 'Writing `+` to join strings; Lua uses `..` (and `+` attempts arithmetic).'],
        ['Menganggap pustaka standard mengandungi rangkaian atau GUI — keupayaan itu datang daripada aplikasi hos atau pustaka luar.', 'Assuming the standard library contains networking or a GUI — those come from the host application or external libraries.'],
      )),
    S('debugging',
      P('Ralat pertama yang dilihat oleh kebanyakan pelajar ialah aritmetik pada jenis yang salah. Buka panel **Ralat & debugging** pada contoh `mechanism-object`: versi berpepijat menghantar string `"fifty"` dan bukannya nombor. Lua melaporkan **baris** tempat ralat berlaku, **operasi** yang gagal, dan sama ada **nama** pemboleh ubah atau **jenis** nilai yang terlibat. Biasakan diri membaca bahagian-bahagian ini dahulu sebelum menukar apa-apa kod.',
        'The first error most learners see is arithmetic on the wrong type. Open the **Error & debugging** panel of the `mechanism-object` example: the buggy version passes the string `"fifty"` instead of a number. Lua reports the **line** where the error happened, the **operation** that failed, and either the **name** of the variable or the **types** of the values involved. Make a habit of reading these parts before changing any code.'),
      OL(
        ['Cari nombor baris dalam mesej (`example:4`).', 'Find the line number in the message (`example:4`).'],
        ['Baca operasi dan jenis (`attempt to add a \'number\' with a \'string\'`).', 'Read the operation and the types (`attempt to add a \'number\' with a \'string\'`).'],
        ['Jejaki dari mana nilai itu datang — di sini, argumen pada baris panggilan.', 'Trace where the value came from — here, the argument on the calling line.'],
      )),
    S('performance',
      P('Kecekapan Lua datang daripada reka bentuk yang kecil: mesin maya berasaskan daftar (register-based, sejak Lua 5.0), table dengan bahagian array dan bahagian hash yang berasingan, dan string yang di-intern supaya perbandingan kesamaan pantas. Untuk program pemula, pilih kod yang jelas; prestasi menjadi topik penting dalam LUA301.',
        'Lua’s efficiency comes from its small design: a register-based virtual machine (since Lua 5.0), tables with separate array and hash parts, and interned strings so equality comparison is fast. For beginner programs, choose clear code; performance becomes an important topic in LUA301.')),
    S('software_engineering',
      P('Bandingkan dua cara menyimpan data keluaran Lua. Versi pertama menggunakan pemboleh ubah berasingan untuk setiap nilai:', 'Compare two ways to store data about Lua releases. The first uses separate variables for every value:'),
      CODE('poor-parallel', 'lua', 'lua54', ['Pelaksanaan lemah: pemboleh ubah berasingan', 'Poor implementation: separate variables'], `
local name1, year1 = "Lua 1.0", 1993
local name2, year2 = "Lua 5.0", 2003
local name3, year3 = "Lua 5.4", 2020
print(name1, year1)
print(name2, year2)
print(name3, year3)
`, 'Lua 1.0\t1993\nLua 5.0\t2003\nLua 5.4\t2020'),
      EXPLAIN('poor-parallel',
        ['1–3', 'Setiap keluaran memerlukan dua nama baharu. Data yang berkaitan (nama dan tahun) hanya dihubungkan oleh nombor dalam nama pemboleh ubah.', 'Every release needs two new names. Related data (name and year) is only linked by a number in the variable name.'],
        ['4–6', 'Satu baris `print` bagi setiap keluaran: menambah keluaran keempat bermakna mengubah tiga tempat.', 'One `print` line per release: adding a fourth release means changing three places.']),
      CODE('improved-records', 'lua', 'lua54', ['Pelaksanaan lebih baik: senarai rekod', 'Improved implementation: a list of records'], `
local releases = {
  {name = "Lua 1.0", year = 1993},
  {name = "Lua 5.0", year = 2003},
  {name = "Lua 5.4", year = 2020},
}

for _, release in ipairs(releases) do
  print(release.name, release.year)
end
`, 'Lua 1.0\t1993\nLua 5.0\t2003\nLua 5.4\t2020'),
      EXPLAIN('improved-records',
        ['1–5', 'Satu table senarai yang mengandungi table rekod. Setiap rekod menyimpan nama **bersama** tahunnya.', 'One list table containing record tables. Each record keeps the name **together with** its year.'],
        ['7–9', 'Gelung `for … in ipairs(...)` melawati setiap rekod mengikut tertib. Menambah keluaran baharu hanya memerlukan satu baris data — kod paparan tidak berubah.', 'The `for … in ipairs(...)` loop visits every record in order. Adding a new release needs only one line of data — the display code does not change.']),
      P('Output adalah sama, tetapi versi kedua **berskala**: data dan logik dipisahkan, dan struktur jelas menunjukkan bahawa nama dan tahun berkaitan. Inilah gaya Lua: gunakan table untuk memodelkan data, bukan bilangan pemboleh ubah yang semakin bertambah.', 'The output is identical, but the second version **scales**: data and logic are separated, and the structure clearly shows that name and year belong together. This is the Lua way: use tables to model data, not an ever-growing number of variables.')),
    S('industry_use_cases',
      UL(
        ['**Adobe Lightroom** menulis sebahagian besar logik aplikasinya dalam Lua.', '**Adobe Lightroom** implements a large part of its application logic in Lua.'],
        ['**Neovim** menggunakan Lua sebagai bahasa konfigurasi dan plugin utamanya.', '**Neovim** uses Lua as its main configuration and plugin language.'],
        ['Pelayan web **OpenResty** (Nginx + LuaJIT) menjalankan logik HTTP dalam Lua.', 'The **OpenResty** web platform (Nginx + LuaJIT) runs HTTP logic in Lua.'],
        ['Banyak enjin permainan menggunakan Lua untuk skrip permainan, dan Roblox membina bahasa Luau berdasarkan Lua 5.1.', 'Many game engines use Lua for gameplay scripts, and Roblox built the Luau language from Lua 5.1.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tekan **Jalankan** pada contoh `hello-version` dan sahkan output sepadan.', 'Press **Run** on the `hello-version` example and confirm the output matches.'],
        ['Salin `one-structure` ke dalam fail `structures.lua` dan tambah ibu negara ketiga dalam table `capitals`.', 'Copy `one-structure` into a file `structures.lua` and add a third capital to the `capitals` table.'],
        ['Buka panel **Ralat & debugging** pada `mechanism-object`, jalankan versi berpepijat dan baca mesejnya.', 'Open the **Error & debugging** panel on `mechanism-object`, run the buggy version and read its message.'],
        ['Tambah method `withdraw` pada `account` yang mengurangkan baki.', 'Add a `withdraw` method to `account` that decreases the balance.'],
      )),
    S('mini_project',
      P('**Garis masa Lua.** Simpan beberapa keluaran Lua dalam senarai dan paparkan berapa tahun setiap keluaran datang selepas keluaran sebelumnya.', '**A Lua timeline.** Store several Lua releases in a list and display how many years each release came after the previous one.'),
      CODE('timeline', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local timeline = {
  {"Lua 1.0", 1993},
  {"Lua 5.1", 2006},
  {"Lua 5.4", 2020},
}

for i = 2, #timeline do
  local prev, cur = timeline[i - 1], timeline[i]
  print(cur[1] .. " came " .. (cur[2] - prev[2]) .. " years after " .. prev[1])
end
`, 'Lua 5.1 came 13 years after Lua 1.0\nLua 5.4 came 14 years after Lua 5.1', {
        debug: BUG(`
local timeline = {
  {"Lua 1.0", 1993},
  {"Lua 5.1", 2006},
  {"Lua 5.4", 2020},
}

for i = 1, #timeline do
  local prev, cur = timeline[i - 1], timeline[i]
  print(cur[1] .. " came " .. (cur[2] - prev[2]) .. " years after " .. prev[1])
end
`, "example:9: attempt to index a nil value (local 'prev')",
          'Gelung bermula pada `i = 1`, jadi `timeline[i - 1]` ialah `timeline[0]` — kunci yang tidak wujud, maka `prev` ialah `nil`. Mengindeks `nil` (`prev[2]`) ialah ralat. Setiap pasangan memerlukan elemen sebelumnya, jadi gelung mesti bermula dari 2. Ralat "off-by-one" seperti ini sangat biasa dengan indeks yang bermula dari 1.',
          'The loop starts at `i = 1`, so `timeline[i - 1]` is `timeline[0]` — a key that does not exist, so `prev` is `nil`. Indexing `nil` (`prev[2]`) is an error. Every pair needs a previous element, so the loop must start at 2. Off-by-one errors like this are very common with 1-based indexes.'),
      }),
      EXPLAIN('timeline',
        ['1–5', 'Setiap entri ialah table kecil `{nama, tahun}` — array dua elemen, jadi `entry[1]` ialah nama dan `entry[2]` ialah tahun.', 'Each entry is a small `{name, year}` table — a two-element array, so `entry[1]` is the name and `entry[2]` the year.'],
        ['7', 'Gelung bermula pada 2 kerana setiap perbandingan memerlukan entri sebelumnya.', 'The loop starts at 2 because each comparison needs the previous entry.'],
        ['8', 'Dua local diberi nilai sekali gus: entri sebelumnya dan entri semasa.', 'Two locals are assigned at once: the previous entry and the current entry.'],
        ['9', 'Tolak tahun untuk mendapatkan jurang; kurungan memastikan tolakan berlaku sebelum penggabungan.', 'Subtract the years to get the gap; the parentheses make the subtraction happen before concatenation.'])),
    S('summary',
      UL(
        ['Lua dicipta di PUC-Rio pada 1993 untuk menjadi bahasa yang kecil, pantas, mudah alih dan boleh dibenamkan.', 'Lua was created at PUC-Rio in 1993 to be a small, fast, portable and embeddable language.'],
        ['Lua menyediakan **mekanisme** (table, fungsi, closure, metatable) dan bukannya polisi siap seperti kelas.', 'Lua provides **mechanisms** (tables, functions, closures, metatables) rather than ready-made policies such as classes.'],
        ['Table ialah satu-satunya struktur data: array, dictionary, rekod dan objek.', 'The table is the only data structure: array, dictionary, record and object.'],
        ['Pustaka standard sengaja kecil; aplikasi hos menyediakan keupayaan tambahan.', 'The standard library is deliberately small; the host application provides extra capabilities.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah empat matlamat reka bentuk Lua?', 'What are Lua’s four design goals?'],
        ['Terangkan "mekanisme, bukan polisi" dengan contoh anda sendiri.', 'Explain "mechanisms, not policies" with your own example.'],
        ['Apakah output `print(#{10, 20, 30})`?', 'What is the output of `print(#{10, 20, 30})`?'],
        ['Mengapakah pustaka standard Lua tidak mengandungi fungsi rangkaian?', 'Why does Lua’s standard library not contain networking functions?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'About Lua — lua.org', url: ABOUT },
        { title: 'R. Ierusalimschy, L. H. de Figueiredo, W. Celes — The Evolution of Lua (HOPL III, 2007)', url: HOPL },
        { title: 'Lua version history — lua.org', url: VERSIONS },
        { title: 'Lua 5.4 Reference Manual §2.1 — Values and Types', url: `${MANUAL}#2.1` },
      )),
  ],
};

// ─── 1.2 Lua as an embedded language ──────────────────────────────────────

export const LUA101_1_2: LectureContentDef = {
  courseCode: 'LUA101',
  module: 1,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Membezakan bahasa **terbenam** (embedded) dan bahasa **berdiri sendiri** (standalone).', 'Distinguish an **embedded** language from a **standalone** one.'],
        ['Menerangkan peranan aplikasi hos dan skrip Lua dalam sistem [[embedding|terbenam]].', 'Explain the roles of the host application and the Lua script in an [[embedding|embedded]] system.'],
        ['Memuatkan skrip sebagai data dengan `load` dan persekitaran terhad.', 'Load a script as data with `load` and a restricted environment.'],
        ['Mengenal pasti di mana Lua dibenamkan dalam permainan, aplikasi dan peranti.', 'Identify where Lua is embedded in games, applications and devices.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1: table dan fungsi sebagai mekanisme asas Lua.', 'Lecture 1.1: tables and functions as Lua’s basic mechanisms.'],
        ['Memahami bahawa sebuah program boleh memanggil program lain.', 'Understanding that one program can call another.'],
      )),
    S('introduction',
      P('Kebanyakan bahasa direka untuk menulis keseluruhan aplikasi. Lua direka untuk **hidup di dalam** aplikasi lain. Program utama — biasanya ditulis dalam C atau C++ — dipanggil **hos**. Hos melakukan kerja berat (grafik, fizik, rangkaian) dan menyerahkan keputusan yang kerap berubah — peraturan permainan, konfigurasi, tingkah laku — kepada skrip Lua yang kecil.',
        'Most languages are designed for writing whole applications. Lua was designed to **live inside** other applications. The main program — usually written in C or C++ — is called the **host**. The host does the heavy work (graphics, physics, networking) and hands frequently changing decisions — game rules, configuration, behaviour — to small Lua scripts.'),
      KEY('Hos menyediakan **keupayaan**; skrip Lua menyediakan **keputusan**.', 'The host provides **capabilities**; the Lua script provides **decisions**.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Hos (host):** aplikasi yang memuatkan interpreter Lua sebagai pustaka dan menjalankan skrip.', '**Host:** the application that loads the Lua interpreter as a library and runs scripts.'],
        ['**API C:** antara muka yang membolehkan hos menghantar data ke Lua, memanggil fungsi Lua dan mendaftarkan fungsi C untuk skrip.', '**C API:** the interface that lets the host pass data to Lua, call Lua functions and register C functions for scripts.'],
        ['**Persekitaran (environment):** table yang menentukan global apa yang boleh dilihat oleh skrip. Hos boleh memberi skrip set fungsi yang terhad.', '**Environment:** the table that decides which globals a script can see. The host can give a script a restricted set of functions.'],
        ['**Interpreter berdiri sendiri** (`lua`) sebenarnya hanyalah hos kecil: program C yang membenamkan pustaka Lua.', 'The **standalone interpreter** (`lua`) is really just a tiny host: a C program that embeds the Lua library.'],
      )),
    S('detailed_theory',
      P('Lua dihantar sebagai **pustaka C** (`liblua`), bukan sebagai program. Hos mencipta keadaan Lua (`lua_State`) dengan `luaL_newstate`, memuatkan pustaka standard yang dikehendakinya, kemudian menjalankan skrip dengan `luaL_dofile`. Semua komunikasi berlaku melalui **stack maya** dalam API C: hos menolak nilai ke stack, memanggil fungsi Lua, dan membaca keputusan dari stack. Kerana semuanya melalui antara muka ini, hos mengawal sepenuhnya apa yang boleh dilakukan oleh skrip.',
        'Lua ships as a **C library** (`liblua`), not as a program. A host creates a Lua state (`lua_State`) with `luaL_newstate`, opens whichever standard libraries it wants, then runs scripts with `luaL_dofile`. All communication happens through a **virtual stack** in the C API: the host pushes values onto the stack, calls Lua functions, and reads results from the stack. Because everything goes through this interface, the host fully controls what a script can do.'),
      P('Dalam Lua sendiri, fungsi `load` memberikan idea yang sama tanpa C: ia mengkompil teks menjadi fungsi dan boleh menerima **table persekitaran** sebagai argumen keempat. Skrip yang dimuatkan dengan persekitaran terhad hanya boleh melihat global dalam table itu — teknik sandboxing yang digunakan oleh hos sebenar. Contoh dalam kuliah ini menggunakan `load` untuk mensimulasikan hos dan skrip konfigurasi.',
        'Inside Lua itself, the `load` function gives the same idea without C: it compiles text into a function and can take an **environment table** as its fourth argument. A script loaded with a restricted environment can only see the globals in that table — the sandboxing technique real hosts use. The examples in this lecture use `load` to simulate a host and a configuration script.'),
      INFO('API C diajar sepenuhnya dalam LUA312 (Lua dan C). Kuliah ini memberi gambaran konsep sahaja.', 'The C API is taught fully in LUA312 (Lua and C). This lecture gives the conceptual picture only.')),
    S('technical_terminology', TERMS('embedding', 'interpreter', 'chunk', 'table')),
    S('syntax_rules',
      UL(
        ['`load(teks, nama, mod, env)` mengkompil teks; ia memulangkan fungsi, atau `nil` dan mesej ralat.', '`load(text, name, mode, env)` compiles text; it returns a function, or `nil` and an error message.'],
        ['Argumen `mod` `"t"` menerima teks sahaja (bukan bytecode) — lebih selamat untuk input luar.', 'The mode argument `"t"` accepts text only (not bytecode) — safer for outside input.'],
        ['Argumen `env` menjadi persekitaran global skrip; global lain tidak kelihatan.', 'The `env` argument becomes the script’s global environment; other globals are invisible.'],
        ['Skrip boleh memulangkan nilai dengan `return`, dan hos menerimanya sebagai hasil panggilan fungsi.', 'A script can return values with `return`, and the host receives them as the result of the function call.'],
      )),
    S('code_demonstration',
      CODE('host-config', 'lua', 'lua54', ['Hos memuatkan skrip konfigurasi', 'A host loads a configuration script'], `
-- The "script" is just text, as if read from settings.lua
local script = [[
  width = 1280
  height = 720
  title = "My App"
]]

local settings = {}                 -- the script's private globals
local chunk = load(script, "=settings", "t", settings)
chunk()

print(settings.title, settings.width .. "x" .. settings.height)
`, 'My App\t1280x720'),
      EXPLAIN('host-config',
        ['2–6', 'Kandungan skrip disimpan sebagai string panjang `[[ … ]]`. Dalam hos sebenar, teks ini dibaca daripada fail `settings.lua` yang boleh disunting oleh pengguna.', 'The script’s content is stored as a long string `[[ … ]]`. In a real host, this text is read from a `settings.lua` file that users can edit.'],
        ['8', 'Table kosong yang akan menjadi persekitaran global skrip. Apa sahaja yang "global" dalam skrip akan masuk ke sini.', 'An empty table that becomes the script’s global environment. Anything "global" in the script ends up here.'],
        ['9', '`load` mengkompil teks menjadi fungsi ([[chunk]]). `"=settings"` menamakan chunk untuk mesej ralat, `"t"` hanya membenarkan teks, dan `settings` ialah persekitarannya.', '`load` compiles the text into a function (a [[chunk]]). `"=settings"` names the chunk for error messages, `"t"` allows text only, and `settings` is its environment.'],
        ['10', 'Menjalankan chunk: tiga assignment global mengisi table `settings`.', 'Running the chunk: the three global assignments fill the `settings` table.'],
        ['12', 'Hos membaca keputusan skrip seperti membaca table biasa.', 'The host reads the script’s results like any ordinary table.'])),
    S('complete_examples',
      CODE('host-capabilities', 'lua', 'lua54', ['Hos memberi skrip keupayaan terhad', 'The host gives a script limited capabilities'], `
local log = {}

-- Capabilities the host chooses to expose
local env = {
  say = function(text) log[#log + 1] = "[script] " .. text end,
}

local chunk = load([[ say("hello from Lua") ]], "=plugin", "t", env)
chunk()

print(log[1])
print(env.print)        -- the script cannot see print
`, '[script] hello from Lua\nnil'),
      EXPLAIN('host-capabilities',
        ['1', 'Log milik hos. Skrip tidak boleh menyentuhnya secara terus.', 'The host’s own log. The script cannot touch it directly.'],
        ['4–6', 'Persekitaran mengandungi **satu** fungsi sahaja, `say`. Fungsi ini ialah [[closure]] yang menulis ke `log` bagi pihak skrip — hos memutuskan bagaimana tindakan itu dilaksanakan.', 'The environment contains **one** function only, `say`. It is a [[closure]] that writes to `log` on the script’s behalf — the host decides how the action is carried out.'],
        ['8–9', 'Skrip plugin dikompil dan dijalankan. Ia hanya tahu tentang `say`.', 'The plugin script is compiled and run. It only knows about `say`.'],
        ['11', 'Mesej skrip sampai ke log hos dengan awalan yang ditambah oleh hos.', 'The script’s message reaches the host log with a prefix added by the host.'],
        ['12', '`print` tidak wujud dalam persekitaran skrip — inilah [[embedding|sandboxing]]: skrip hanya boleh melakukan apa yang dibenarkan.', '`print` does not exist in the script’s environment — this is [[embedding|sandboxing]]: the script can only do what it is allowed to do.']),
      CODE('script-returns', 'lua', 'lua54', ['Skrip memulangkan data kepada hos', 'A script returns data to the host'], `
local chunk = load([[
  return {
    name = "Forest",
    enemies = 3,
  }
]], "=level1", "t", {})

local level = chunk()
print(level.name, level.enemies)
`, 'Forest\t3', {
        debug: BUG(`
local chunk = load([[
  return {
    name = "Forest",
    enemies = 3
    boss = "Troll",
  }
]], "=level1", "t", {})

local level = chunk()
print(level.name, level.enemies)
`, "example:9: attempt to call a nil value (local 'chunk')",
          'Skrip mempunyai **ralat sintaks**: koma hilang selepas `enemies = 3`. `load` tidak membaling ralat — ia memulangkan `nil` dan mesej. Kod hos memanggil `chunk()` pada baris 9 tanpa menyemak, jadi ralat yang kelihatan ialah "attempt to call a nil value", dan punca sebenar (koma yang hilang) tersembunyi. Hos yang baik menyemak hasil `load` (lihat bahagian Debugging).',
          'The script has a **syntax error**: a missing comma after `enemies = 3`. `load` does not raise an error — it returns `nil` and a message. The host calls `chunk()` on line 9 without checking, so the visible error is "attempt to call a nil value", and the real cause (the missing comma) is hidden. A good host checks the result of `load` (see the Debugging section).'),
      }),
      EXPLAIN('script-returns',
        ['1–6', '`load(...)` mengkompil skrip tahap permainan; fungsi chunk disimpan dalam `chunk`. Persekitaran kosong `{}` bermakna skrip hanya boleh memulangkan data.', '`load(...)` compiles the game-level script; the chunk function is stored in `chunk`. The empty environment `{}` means the script can only return data.'],
        ['8', 'Memanggil chunk menjalankan skrip; `return` dalam skrip menjadi nilai pulangan panggilan — table data tahap.', 'Calling the chunk runs the script; the `return` inside the script becomes the call’s return value — the level data table.'],
        ['9', 'Hos menggunakan data seperti table biasa. Pereka permainan boleh menyunting fail tahap tanpa mengkompil semula enjin.', 'The host uses the data like any table. Game designers can edit level files without recompiling the engine.'])),
    S('line_by_line',
      EXPLAIN('host-config',
        ['9', 'Empat argumen `load` ialah teras pembenaman dalam Lua: **teks** skrip, **nama** untuk mesej ralat, **mod** keselamatan dan **persekitaran**. Hos sebenar dalam C melakukan perkara yang sama dengan `luaL_loadbufferx`.', 'The four `load` arguments are the core of embedding in Lua: the script **text**, a **name** for error messages, a safety **mode** and the **environment**. A real C host does the same with `luaL_loadbufferx`.'],
        ['10', 'Memanggil chunk menjalankan skrip sekali. Hos boleh memuatkan semula fail dan memanggilnya lagi apabila pengguna menyimpan perubahan — "hot reload".', 'Calling the chunk runs the script once. A host can reload the file and call it again when the user saves changes — "hot reload".']),
      EXPLAIN('host-capabilities',
        ['4–6', 'Senarai keupayaan ialah keputusan keselamatan. Lebih sedikit fungsi bermakna lebih sedikit perkara yang boleh disalahgunakan oleh skrip yang tidak dipercayai.', 'The capability list is a security decision. Fewer functions means fewer things an untrusted script can misuse.'])),
    S('why_this_way',
      P('Mengapa membenamkan bahasa dan bukannya menulis semuanya dalam C++? Kerana bahagian yang kerap berubah — peraturan, data, UI — lebih cepat diubah dalam skrip. Skrip tidak perlu dikompil semula, boleh dimuat semula semasa aplikasi berjalan, dan boleh ditulis oleh pereka atau pengguna yang bukan pengaturcara sistem. Persekitaran terhad pula melindungi hos daripada skrip yang rosak atau berniat jahat.',
        'Why embed a language instead of writing everything in C++? Because the parts that change often — rules, data, UI — are faster to change in scripts. Scripts need no recompilation, can be reloaded while the application runs, and can be written by designers or users who are not systems programmers. A restricted environment protects the host from broken or malicious scripts.'),
      P('Pengaturcara memilih pembenaman **apabila** aplikasi memerlukan kebolehsesuaian oleh pengguna (plugin, mod, konfigurasi) atau kitaran ubah-uji yang pantas. Untuk alat kecil yang tidak memerlukan skrip, satu bahasa sudah memadai.',
        'Developers choose embedding **when** an application needs user customisation (plugins, mods, configuration) or a fast edit-and-test cycle. For a small tool that needs no scripting, one language is enough.')),
    S('execution_flow',
      OL(
        ['Hos (di sini, kod di luar `[[ ]]`) mencipta table persekitaran.', 'The host (here, the code outside `[[ ]]`) creates the environment table.'],
        ['`load` menghuraikan teks skrip dan menghasilkan fungsi chunk; tiada kod skrip dijalankan lagi.', '`load` parses the script text and produces a chunk function; no script code has run yet.'],
        ['Hos memanggil chunk. Setiap global yang dibaca atau ditulis oleh skrip pergi ke table persekitaran.', 'The host calls the chunk. Every global the script reads or writes goes to the environment table.'],
        ['Skrip tamat (atau memulangkan nilai) dan kawalan kembali kepada hos.', 'The script finishes (or returns values) and control returns to the host.'],
        ['Hos membaca keputusan daripada persekitaran atau nilai pulangan.', 'The host reads the results from the environment or the return values.'],
      )),
    S('memory_behaviour',
      P('Hos dan skrip berkongsi **satu** heap Lua dalam satu `lua_State`. Table `settings` dicipta oleh hos, diisi oleh skrip, dan kekal hidup selagi hos memegang rujukan kepadanya. Fungsi chunk boleh dikutip oleh pengutip sampah selepas dijalankan jika tiada rujukan lain. Hos boleh mencipta beberapa `lua_State` berasingan untuk memisahkan skrip sepenuhnya — setiap satu mempunyai heap sendiri.',
        'The host and the script share **one** Lua heap inside one `lua_State`. The `settings` table is created by the host, filled by the script, and stays alive as long as the host holds a reference to it. The chunk function can be collected after it runs if nothing else refers to it. A host can create several separate `lua_State`s to isolate scripts completely — each has its own heap.')),
    S('alternative_implementations',
      P('Daripada skrip yang menetapkan global, skrip konfigurasi boleh **memulangkan** table — gaya yang lebih eksplisit dan tidak memerlukan persekitaran khas:', 'Instead of a script that sets globals, a configuration script can **return** a table — a more explicit style that needs no special environment:'),
      CODE('config-return', 'lua', 'lua54', ['Konfigurasi sebagai nilai pulangan', 'Configuration as a return value'], `
local text = 'return { width = 1280, height = 720 }'
local config = load(text, "=settings", "t", {})()
print(config.width * config.height)
`, '921600'),
      EXPLAIN('config-return',
        ['1', 'Skrip ialah satu ungkapan `return` dengan table.', 'The script is a single `return` expression with a table.'],
        ['2', 'Persekitaran kosong `{}` bermakna skrip tidak boleh memanggil apa-apa fungsi — ia hanya data.', 'The empty environment `{}` means the script cannot call any function — it is pure data.'],
        ['3', 'Hos mengira jumlah piksel daripada nilai yang dipulangkan.', 'The host computes the number of pixels from the returned values.']),
      P('Pilih gaya global untuk fail yang ditulis oleh pengguna biasa (lebih ringkas), dan gaya `return` apabila anda mahu struktur yang jelas dan sukar disalahgunakan. Format seperti JSON juga mungkin, tetapi skrip Lua membenarkan komen dan pengiraan ringkas.', 'Choose the global style for files written by ordinary users (simpler), and the `return` style when you want a clear structure that is hard to misuse. Formats such as JSON are possible too, but Lua scripts allow comments and simple calculations.')),
    S('common_mistakes',
      UL(
        ['Memuatkan skrip pengguna dengan persekitaran global penuh — skrip boleh memanggil `os.remove` atau `os.exit`.', 'Loading user scripts with the full global environment — the script can call `os.remove` or `os.exit`.'],
        ['Tidak menyemak hasil `load`; skrip yang mempunyai ralat sintaks memulangkan `nil` dan mesej.', 'Not checking the result of `load`; a script with a syntax error returns `nil` and a message.'],
        ['Menerima bytecode daripada sumber luar (mod `"b"`) — bytecode yang dibentuk khas boleh merosakkan interpreter.', 'Accepting bytecode from outside sources (mode `"b"`) — crafted bytecode can crash the interpreter.'],
        ['Menganggap skrip boleh mengakses semua fungsi hos tanpa ia didaftarkan.', 'Assuming a script can reach every host function without it being registered.'],
      )),
    S('debugging',
      P('Ralat dalam sistem terbenam berlaku di dua tempat: semasa **memuatkan** (ralat sintaks dalam skrip) dan semasa **menjalankan** (ralat runtime). `load` melaporkan ralat sintaks sebagai nilai pulangan kedua, jadi hos mesti menyemaknya. Contoh `script-returns` menunjukkan apa yang berlaku apabila semakan dilangkau: mesej yang mengelirukan. Corak yang betul:',
        'Errors in an embedded system happen in two places: while **loading** (syntax errors in the script) and while **running** (runtime errors). `load` reports syntax errors as its second return value, so the host must check it. The `script-returns` example shows what happens when the check is skipped: a misleading message. The correct pattern:'),
      CODE('safe-load', 'lua', 'lua54', ['Memuatkan dengan semakan ralat', 'Loading with error checks'], `
local source = 'speed = 10 +'          -- broken script
local chunk, err = load(source, "=physics", "t", {})
if not chunk then
  print("could not load:", err)
end
`, "could not load:\tphysics:1: unexpected symbol near <eof>", {
        debug: BUG(`
local source = 'speed = 10 +'          -- broken script
local chunk = load(source, "=physics", "t", {})
chunk()
`, "example:3: attempt to call a nil value (local 'chunk')",
          'Tanpa semakan, `chunk` ialah `nil` dan memanggilnya gagal pada baris 3. Mesej ini hanya memberitahu **simptom**; mesej sebenar `load` ("unexpected symbol near <eof>") telah dibuang. Sentiasa terima dua nilai daripada `load` dan uji yang pertama.',
          'Without a check, `chunk` is `nil` and calling it fails on line 3. This message only tells you the **symptom**; `load`’s real message ("unexpected symbol near <eof>") was thrown away. Always receive two values from `load` and test the first one.'),
      }),
      EXPLAIN('safe-load',
        ['1', 'Skrip rosak: `+` tanpa operan kanan.', 'A broken script: `+` with no right operand.'],
        ['2', '`load` memulangkan `nil` dan mesej; kedua-duanya diterima dalam dua local.', '`load` returns `nil` and a message; both are received into two locals.'],
        ['3–4', 'Jika tiada chunk, hos memaparkan mesej yang **menamakan skrip** (`physics:1`) dan masalahnya. Hos sebenar juga akan menulisnya ke log dan terus berjalan.', 'If there is no chunk, the host shows a message that **names the script** (`physics:1`) and the problem. A real host would also log it and keep running.'])),
    S('performance',
      P('Mengkompil skrip mengambil masa, jadi hos biasanya memuatkan skrip **sekali** dan memanggil fungsi yang terhasil berkali-kali. Memanggil fungsi Lua dari C lebih murah daripada memuatkan semula fail. Untuk logik sangat kerap (setiap bingkai permainan), hos memastikan skrip ringkas atau menyediakan fungsi C yang pantas sebagai keupayaan.',
        'Compiling a script takes time, so hosts usually load a script **once** and call the resulting function many times. Calling a Lua function from C is cheaper than reloading a file. For very frequent logic (every game frame), the host keeps scripts small or provides fast C functions as capabilities.')),
    S('software_engineering',
      P('Hos yang lemah mendedahkan **semua** global kepada skrip plugin. Hos yang lebih baik menentukan senarai keupayaan yang jelas:', 'A poor host exposes **all** globals to a plugin script. A better host defines a clear capability list:'),
      CODE('poor-open-env', 'lua', 'lua54', ['Pelaksanaan lemah: plugin melihat semua global', 'Poor implementation: the plugin sees every global'], `
local plugin = load([[ secret = "changed by plugin" ]])
secret = "host data"
plugin()
print(secret)
`, 'changed by plugin'),
      EXPLAIN('poor-open-env',
        ['1', 'Tanpa argumen persekitaran, plugin menggunakan global sebenar program.', 'Without an environment argument, the plugin uses the program’s real globals.'],
        ['2–4', 'Data hos dalam global `secret` ditimpa oleh plugin — tiada sempadan antara hos dan skrip.', 'The host’s data in the global `secret` is overwritten by the plugin — there is no boundary between host and script.']),
      CODE('improved-sandbox', 'lua', 'lua54', ['Pelaksanaan lebih baik: kotak pasir dengan keupayaan jelas', 'Improved implementation: a sandbox with explicit capabilities'], `
local secret = "host data"
local sandbox = { tostring = tostring }
local plugin = load([[ secret = "changed by plugin" ]], "=plugin", "t", sandbox)
plugin()
print(secret, sandbox.secret)
`, 'host data\tchanged by plugin'),
      EXPLAIN('improved-sandbox',
        ['1', 'Data hos disimpan dalam local — tidak kelihatan kepada sesiapa di luar fail ini.', 'The host data is kept in a local — invisible to anyone outside this file.'],
        ['2', 'Kotak pasir hanya mengandungi fungsi yang dipilih dengan sengaja.', 'The sandbox contains only deliberately chosen functions.'],
        ['3–5', 'Plugin menulis ke kotak pasirnya sendiri. Data hos selamat, dan hos masih boleh membaca apa yang plugin hasilkan.', 'The plugin writes into its own sandbox. The host data is safe, and the host can still read what the plugin produced.']),
      P('Pertukarannya: kotak pasir memerlukan anda menyenaraikan setiap fungsi yang dibenarkan, tetapi sempadan yang jelas menjadikan sistem lebih selamat, lebih mudah diuji dan lebih mudah dikekalkan apabila bilangan plugin bertambah.', 'The trade-off: a sandbox requires you to list every allowed function, but the clear boundary makes the system safer, easier to test and easier to maintain as the number of plugins grows.')),
    S('industry_use_cases',
      UL(
        ['**Enjin permainan** (contohnya Defold, LÖVE dan banyak enjin dalaman) menjalankan logik permainan dalam Lua.', '**Game engines** (for example Defold, LÖVE and many in-house engines) run gameplay logic in Lua.'],
        ['**Redis** membenamkan Lua supaya pelanggan boleh menjalankan skrip atomik di pelayan.', '**Redis** embeds Lua so clients can run atomic scripts on the server.'],
        ['**Wireshark** dan **Nmap** menggunakan Lua untuk penghurai protokol dan skrip imbasan.', '**Wireshark** and **Nmap** use Lua for protocol dissectors and scanning scripts.'],
        ['Peranti terbenam (contohnya firmware **NodeMCU** untuk ESP8266) menjalankan Lua pada mikropengawal.', 'Embedded devices (for example **NodeMCU** firmware for the ESP8266) run Lua on microcontrollers.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `host-config`, kemudian tukar `title` dalam skrip dan jalankan semula.', 'Run `host-config`, then change `title` in the script and run it again.'],
        ['Dalam `host-capabilities`, tambah keupayaan kedua `add(a, b)` dan panggil dari skrip.', 'In `host-capabilities`, add a second capability `add(a, b)` and call it from the script.'],
        ['Jalankan versi berpepijat `safe-load` dan bandingkan mesejnya dengan versi yang menyemak ralat.', 'Run the buggy version of `safe-load` and compare its message with the version that checks for errors.'],
      )),
    S('mini_project',
      P('**Pemuat tema.** Hos menerima skrip tema yang menetapkan warna. Sahkan bahawa setiap warna wujud; jika tiada, gunakan nilai lalai.', '**A theme loader.** The host receives a theme script that sets colours. Check that every colour exists; if not, use a default.'),
      CODE('theme-loader', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local defaults = {background = "white", text = "black", accent = "blue"}
local theme = {}
load([[ background = "navy"; text = "white" ]], "=theme", "t", theme)()

for _, name in ipairs({"background", "text", "accent"}) do
  print(name, theme[name] or defaults[name])
end
`, 'background\tnavy\ntext\twhite\naccent\tblue'),
      EXPLAIN('theme-loader',
        ['1', 'Nilai lalai hos untuk setiap warna.', 'The host’s default for each colour.'],
        ['2–3', 'Skrip tema dimuatkan ke dalam table `theme`. Koma bertitik memisahkan dua pernyataan pada satu baris.', 'The theme script is loaded into the `theme` table. A semicolon separates two statements on one line.'],
        ['5–7', 'Untuk setiap warna yang diketahui, gunakan nilai tema jika ada, jika tidak nilai lalai. `a or b` memulangkan `b` apabila `a` ialah `nil`.', 'For every known colour, use the theme value if present, otherwise the default. `a or b` returns `b` when `a` is `nil`.'])),
    S('summary',
      UL(
        ['Lua ialah pustaka C yang dibenamkan dalam aplikasi hos.', 'Lua is a C library embedded in a host application.'],
        ['Hos menyediakan keupayaan; skrip membuat keputusan yang kerap berubah.', 'The host provides capabilities; scripts make the decisions that change often.'],
        ['`load` dengan persekitaran terhad mensimulasikan sandboxing yang dilakukan oleh hos sebenar.', '`load` with a restricted environment simulates the sandboxing that real hosts perform.'],
        ['Sentiasa semak hasil `load` dan jangan terima bytecode daripada sumber yang tidak dipercayai.', 'Always check the result of `load` and never accept bytecode from untrusted sources.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah peranan hos dalam sistem terbenam?', 'What is the role of the host in an embedded system?'],
        ['Apakah yang berlaku jika skrip yang dimuatkan dengan `{}` sebagai persekitaran memanggil `print`?', 'What happens if a script loaded with `{}` as its environment calls `print`?'],
        ['Mengapakah mod `"t"` disyorkan untuk skrip daripada pengguna?', 'Why is mode `"t"` recommended for scripts from users?'],
        ['Namakan dua aplikasi sebenar yang membenamkan Lua.', 'Name two real applications that embed Lua.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §4 — The Application Program Interface', url: `${MANUAL}#4` },
        { title: 'Lua 5.4 Reference Manual — load', url: `${MANUAL}#pdf-load` },
        { title: 'Programming in Lua (1st ed.) — Part IV: The C API', url: 'https://www.lua.org/pil/24.html' },
        { title: 'Redis documentation — Scripting with Lua', url: 'https://redis.io/docs/latest/develop/interact/programmability/eval-intro/' },
      )),
  ],
};

// ─── 1.3 Lua 5.1–5.4, LuaJIT and Luau: what differs ───────────────────────

export const LUA101_1_3: LectureContentDef = {
  courseCode: 'LUA101',
  module: 1,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menyenaraikan ciri utama yang ditambah dalam Lua 5.2, 5.3 dan 5.4.', 'List the main features added in Lua 5.2, 5.3 and 5.4.'],
        ['Membezakan Lua rujukan (PUC-Rio), LuaJIT dan Luau.', 'Distinguish reference Lua (PUC-Rio), LuaJIT and Luau.'],
        ['Menulis kod yang menggunakan ciri 5.3/5.4: subjenis integer, `//`, operator bit, `<const>` dan `<close>`.', 'Write code that uses 5.3/5.4 features: the integer subtype, `//`, bitwise operators, `<const>` and `<close>`.'],
        ['Memilih versi yang sesuai untuk sesuatu projek.', 'Choose a suitable version for a project.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1 dan 1.2: sejarah Lua dan pembenaman.', 'Lectures 1.1 and 1.2: Lua’s history and embedding.'],
        ['Aritmetik asas: tambah, tolak, bahagi.', 'Basic arithmetic: addition, subtraction, division.'],
      )),
    S('introduction',
      P('"Lua" bukan satu program tunggal. Terdapat beberapa **versi** bahasa (5.1 hingga 5.4) dan beberapa **pelaksanaan**: interpreter rujukan dari PUC-Rio, LuaJIT yang sangat pantas, dan Luau — bahasa terbitan Roblox. Kod yang berfungsi dalam satu mungkin gagal dalam yang lain. Pengaturcara profesional sentiasa tahu versi mana yang mereka sasarkan.',
        '"Lua" is not a single program. There are several language **versions** (5.1 to 5.4) and several **implementations**: the reference interpreter from PUC-Rio, the very fast LuaJIT, and Luau — Roblox’s derived language. Code that works in one may fail in another. Professional developers always know which version they target.'),
      KEY('Kursus ini menggunakan **Lua 5.4** sebagai rujukan. Ciri yang memerlukan versi tertentu dilabel, contohnya "(5.3+)".', 'This course uses **Lua 5.4** as its reference. Features that need a specific version are labelled, for example "(5.3+)".', ['Versi kursus', 'Course version'])),
    S('fundamental_concepts',
      UL(
        ['**Lua 5.1 (2006):** sistem modul `require`, [[coroutine]], dan versi yang paling lama digunakan — asas LuaJIT dan Luau.', '**Lua 5.1 (2006):** the `require` module system, [[coroutine|coroutines]], and the longest-lived version — the base of LuaJIT and Luau.'],
        ['**Lua 5.2 (2011):** `_ENV` menggantikan `setfenv`, `goto`, dan `table.unpack`.', '**Lua 5.2 (2011):** `_ENV` replaces `setfenv`, plus `goto` and `table.unpack`.'],
        ['**Lua 5.3 (2015):** subjenis **integer** 64-bit, pembahagian lantai `//`, operator bit (`&`, `|`, `~`, `<<`, `>>`) dan pustaka `utf8`.', '**Lua 5.3 (2015):** the 64-bit **integer** subtype, floor division `//`, bitwise operators (`&`, `|`, `~`, `<<`, `>>`) and the `utf8` library.'],
        ['**Lua 5.4 (2020):** pemboleh ubah `<const>` dan `<close>`, pengutip sampah generasi, dan penjana nombor rawak baharu.', '**Lua 5.4 (2020):** `<const>` and `<close>` variables, a generational garbage collector, and a new random number generator.'],
        ['**LuaJIT:** pelaksanaan Lua 5.1 dengan pengkompil just-in-time — sangat pantas, tetapi tidak menyokong kebanyakan ciri 5.3/5.4.', '**LuaJIT:** a Lua 5.1 implementation with a just-in-time compiler — very fast, but without most 5.3/5.4 features.'],
        ['**Luau:** bahasa Roblox berdasarkan Lua 5.1, dengan jenis beransur, `+=`, `continue` dan interpolasi string. Ia ialah **bahasa berasingan**, diajar dalam program Luau.', '**Luau:** Roblox’s language based on Lua 5.1, with gradual types, `+=`, `continue` and string interpolation. It is a **separate language**, taught in the Luau programme.'],
      )),
    S('detailed_theory',
      P('Lua tidak menjamin keserasian penuh antara versi utama. Setiap versi kecil (5.2, 5.3, 5.4) boleh mengubah atau membuang ciri. Contoh penting: dalam Lua 5.3, nombor mempunyai dua **subjenis** — integer dan float. `10 / 2` menghasilkan `5.0` (float) kerana `/` sentiasa membahagi float, manakala `10 // 3` menghasilkan `3` (integer). Dalam Lua 5.1 dan LuaJIT, semua nombor ialah float dan `//` ialah ralat sintaks. Kod yang bergantung pada perbezaan output ini boleh berkelakuan berbeza merentas versi.',
        'Lua does not guarantee full compatibility between major versions. Each minor version (5.2, 5.3, 5.4) may change or remove features. An important example: since Lua 5.3, numbers have two **subtypes** — integer and float. `10 / 2` gives `5.0` (a float) because `/` always performs float division, while `10 // 3` gives `3` (an integer). In Lua 5.1 and LuaJIT, every number is a float and `//` is a syntax error. Code that depends on these output differences can behave differently across versions.'),
      P('LuaJIT dan Luau menunjukkan dua arah evolusi yang berbeza. LuaJIT mengekalkan bahasa 5.1 tetapi mengubah **pelaksanaan** untuk kelajuan maksimum, termasuk FFI untuk memanggil C terus. Luau mengubah **bahasa** itu sendiri: menambah sistem jenis, sintaks baharu dan sandboxing, tetapi membuang ciri yang tidak selamat untuk Roblox seperti `load` bytecode dan pustaka `io`. Kerana itu, kursus ini memisahkan program Lua dan Luau.',
        'LuaJIT and Luau show two different evolutionary directions. LuaJIT keeps the 5.1 language but changes the **implementation** for maximum speed, including an FFI to call C directly. Luau changes the **language** itself: it adds a type system, new syntax and sandboxing, but removes features that are unsafe for Roblox such as bytecode `load` and the `io` library. That is why this course keeps the Lua and Luau programmes separate.')),
    S('technical_terminology', TERMS('interpreter', 'bytecode', 'variable', 'coroutine')),
    S('syntax_rules',
      UL(
        ['`a // b` — pembahagian lantai (5.3+): hasil dibundarkan ke bawah.', '`a // b` — floor division (5.3+): the result is rounded down.'],
        ['`a & b`, `a | b`, `a ~ b`, `~a`, `a << n`, `a >> n` — operator bit pada integer (5.3+).', '`a & b`, `a | b`, `a ~ b`, `~a`, `a << n`, `a >> n` — bitwise operators on integers (5.3+).'],
        ['`math.type(x)` memulangkan `"integer"`, `"float"` atau `nil` (5.3+).', '`math.type(x)` returns `"integer"`, `"float"` or `nil` (5.3+).'],
        ['`local name <const> = value` — pemboleh ubah yang tidak boleh diberi nilai semula (5.4).', '`local name <const> = value` — a variable that cannot be reassigned (5.4).'],
        ['`local name <close> = value` — nilai yang metamethod `__close`nya dipanggil apabila skop tamat (5.4).', '`local name <close> = value` — a value whose `__close` metamethod is called when the scope ends (5.4).'],
      )),
    S('code_demonstration',
      CODE('numbers-53', 'lua', 'lua54', ['Integer dan float (5.3+)', 'Integers and floats (5.3+)'], `
print(10 / 2, 10 // 3, 7 % 3)
print(math.type(4), math.type(4.0), math.type("4"))
print(3 == 3.0)
`, '5.0\t3\t1\ninteger\tfloat\tnil\ntrue'),
      EXPLAIN('numbers-53',
        ['1', '`/` sentiasa memberi float (`5.0`); `//` membundarkan ke bawah dan, dengan dua integer, memberi integer (`3`); `%` memberi baki (`1`).', '`/` always gives a float (`5.0`); `//` rounds down and, with two integers, gives an integer (`3`); `%` gives the remainder (`1`).'],
        ['2', '`math.type` membezakan subjenis nombor. String `"4"` bukan nombor, jadi hasilnya `nil`.', '`math.type` distinguishes the number subtypes. The string `"4"` is not a number, so the result is `nil`.'],
        ['3', 'Integer dan float yang sama nilai adalah **sama**: perbezaan subjenis tidak menjejaskan perbandingan.', 'An integer and a float with the same value are **equal**: the subtype difference does not affect comparison.'])),
    S('complete_examples',
      CODE('bitwise-flags', 'lua', 'lua54', ['Operator bit untuk bendera kebenaran (5.3+)', 'Bitwise operators for permission flags (5.3+)'], `
local READ, WRITE, EXECUTE = 1, 2, 4

local perms = READ | WRITE
print(perms)
print(perms & WRITE ~= 0, perms & EXECUTE ~= 0)
print(1 << 10)
`, '3\ntrue\tfalse\n1024'),
      EXPLAIN('bitwise-flags',
        ['1', 'Setiap kebenaran ialah satu bit: 1 (001), 2 (010), 4 (100).', 'Each permission is one bit: 1 (001), 2 (010), 4 (100).'],
        ['3–4', '`|` (OR bit) menggabungkan bit: 001 | 010 = 011, iaitu 3.', '`|` (bitwise OR) combines bits: 001 | 010 = 011, which is 3.'],
        ['5', '`&` (AND bit) menguji satu bit. Keutamaan `&` lebih tinggi daripada `~=`, jadi `perms & WRITE ~= 0` bermaksud `(perms & WRITE) ~= 0`. WRITE ada, EXECUTE tiada.', '`&` (bitwise AND) tests one bit. `&` binds tighter than `~=`, so `perms & WRITE ~= 0` means `(perms & WRITE) ~= 0`. WRITE is set, EXECUTE is not.'],
        ['6', '`<<` mengalihkan bit ke kiri: 1 dialih 10 kali = 2¹⁰ = 1024.', '`<<` shifts bits left: 1 shifted 10 times = 2¹⁰ = 1024.']),
      CODE('const-54', 'lua', 'lua54', ['Pemboleh ubah <const> (5.4)', '<const> variables (5.4)'], `
local MAX_PLAYERS <const> = 4
local players = 3

if players < MAX_PLAYERS then
  print("room for " .. (MAX_PLAYERS - players) .. " more")
end
`, 'room for 1 more', {
        debug: BUG(`
local MAX_PLAYERS <const> = 4
local players = 3

MAX_PLAYERS = 5
print(MAX_PLAYERS - players)
`, "example:4: attempt to assign to const variable 'MAX_PLAYERS'",
          'Ini ralat **kompil**, bukan ralat runtime: Lua menolak keseluruhan chunk sebelum mana-mana baris dijalankan. Itulah kelebihan `<const>` — kesilapan ditemui serta-merta. Jika nilai memang perlu berubah, buang atribut `<const>`; jika tidak, betulkan kod yang cuba mengubahnya.',
          'This is a **compile** error, not a runtime error: Lua rejects the whole chunk before any line runs. That is the benefit of `<const>` — the mistake is found immediately. If the value really must change, remove the `<const>` attribute; otherwise fix the code that tries to change it.'),
      }),
      EXPLAIN('const-54',
        ['1', '`<const>` mengisytiharkan pemalar. Nama dalam huruf besar ialah konvensyen untuk pemalar.', '`<const>` declares a constant. An upper-case name is the convention for constants.'],
        ['2', 'Pemboleh ubah biasa yang boleh berubah.', 'An ordinary variable that can change.'],
        ['4–6', 'Pemalar digunakan seperti pemboleh ubah biasa untuk dibaca: 4 − 3 = 1.', 'The constant is read like an ordinary variable: 4 − 3 = 1.'])),
    S('line_by_line',
      EXPLAIN('numbers-53',
        ['1', 'Baris ini ialah ujian versi yang berguna: Lua 5.1 akan menolak `//` sebagai ralat sintaks dan memaparkan `5` (bukan `5.0`) untuk `10 / 2`.', 'This line is a useful version test: Lua 5.1 would reject `//` as a syntax error and display `5` (not `5.0`) for `10 / 2`.'],
        ['2–3', 'Subjenis kelihatan dalam output (`5.0` berbanding `5`) tetapi tidak mengubah kesamaan. Bandingkan nilai, bukan teks paparannya.', 'The subtype shows in output (`5.0` versus `5`) but does not change equality. Compare values, not their printed text.']),
      EXPLAIN('const-54',
        ['1', 'Atribut ditulis dalam kurungan sudut selepas nama. Ia diperiksa semasa kompil, jadi tiada kos semasa runtime.', 'The attribute is written in angle brackets after the name. It is checked at compile time, so it costs nothing at run time.'])),
    S('why_this_way',
      P('Mengapa Lua menambah integer dalam 5.3? Kerana float 64-bit hanya boleh mewakili integer dengan tepat sehingga 2⁵³. Aplikasi yang mengira wang, ID atau bit memerlukan integer 64-bit penuh. Mengapa `<const>`? Untuk membolehkan pengkompil mengesan pengubahan yang tidak disengajakan. Setiap ciri baharu menyelesaikan masalah sebenar, tetapi memecahkan keserasian dengan pelaksanaan lama.',
        'Why did Lua add integers in 5.3? Because a 64-bit float can only represent integers exactly up to 2⁵³. Applications that count money, IDs or bits need full 64-bit integers. Why `<const>`? So the compiler can catch accidental modification. Each new feature solves a real problem, but breaks compatibility with older implementations.'),
      P('Pilih **Lua 5.4** untuk projek baharu yang berdiri sendiri; **LuaJIT** apabila kelajuan maksimum diperlukan dan ciri 5.1 sudah memadai (contohnya OpenResty); **Luau** apabila membangunkan untuk Roblox; dan **Lua 5.1** apabila hos yang sedia ada memerlukannya.', 'Choose **Lua 5.4** for new standalone projects; **LuaJIT** when maximum speed is needed and 5.1 features are enough (for example OpenResty); **Luau** when developing for Roblox; and **Lua 5.1** when an existing host requires it.')),
    S('execution_flow',
      OL(
        ['Pengkompil membaca `const-54` dan merekod `MAX_PLAYERS` sebagai pemalar.', 'The compiler reads `const-54` and records `MAX_PLAYERS` as a constant.'],
        ['Ia memeriksa setiap assignment; dalam versi berpepijat, `MAX_PLAYERS = 5` ditolak dan **tiada** baris dijalankan.', 'It checks every assignment; in the buggy version, `MAX_PLAYERS = 5` is rejected and **no** line runs.'],
        ['Dalam versi betul, chunk dijalankan: `players < MAX_PLAYERS` ialah `3 < 4`, iaitu benar.', 'In the correct version, the chunk runs: `players < MAX_PLAYERS` is `3 < 4`, which is true.'],
        ['Badan `if` mengira `4 - 3`, menggabungkan teks dan memanggil `print`.', 'The `if` body computes `4 - 3`, joins the text and calls `print`.'],
      )),
    S('memory_behaviour',
      P('Integer dan float disimpan terus dalam nilai Lua (8 bait) tanpa peruntukan heap, jadi aritmetik tidak menghasilkan sampah. Pemalar `<const>` dengan nilai yang diketahui semasa kompil boleh digantikan terus ke dalam [[bytecode]] dan tidak memerlukan slot daftar. Lua 5.4 juga memperkenalkan pengutip sampah **generasi**, yang mengutip objek muda dengan lebih kerap kerana kebanyakan objek mati muda.',
        'Integers and floats are stored directly inside a Lua value (8 bytes) without heap allocation, so arithmetic produces no garbage. A `<const>` with a value known at compile time can be substituted straight into the [[bytecode]] and needs no register slot. Lua 5.4 also introduced a **generational** garbage collector, which collects young objects more often because most objects die young.')),
    S('alternative_implementations',
      P('Kod yang mesti berjalan pada Lua 5.1 dan 5.4 boleh mengesan ciri dan bukannya bergantung pada operator baharu. Contohnya, pembahagian lantai yang mudah alih:', 'Code that must run on both Lua 5.1 and 5.4 can detect features instead of relying on new operators. For example, portable floor division:'),
      CODE('portable-floor', 'lua', 'lua54', ['Pembahagian lantai yang mudah alih', 'Portable floor division'], `
local function floorDiv(a, b)
  return math.floor(a / b)
end

print(floorDiv(10, 3), floorDiv(-7, 2))
print(math.type and "5.3+ number subtypes" or "5.1/5.2 numbers")
`, '3\t-4\n5.3+ number subtypes'),
      EXPLAIN('portable-floor',
        ['1–3', '`math.floor(a / b)` berfungsi dalam semua versi. Dalam 5.4 ia memulangkan integer apabila hasilnya muat.', '`math.floor(a / b)` works in every version. In 5.4 it returns an integer when the result fits.'],
        ['5', 'Bundaran ke bawah bermakna −7 / 2 = −3.5 menjadi **−4**, bukan −3.', 'Rounding down means −7 / 2 = −3.5 becomes **−4**, not −3.'],
        ['6', 'Pengesanan ciri: `math.type` hanya wujud dalam 5.3+. Ini lebih dipercayai daripada membaca nombor dalam `_VERSION`.', 'Feature detection: `math.type` exists only in 5.3+. This is more reliable than parsing the number in `_VERSION`.'])),
    S('common_mistakes',
      UL(
        ['Menyalin kod LuaJIT/5.1 yang menggunakan `setfenv` atau `unpack` global ke Lua 5.4 — kedua-duanya telah dibuang (gunakan `_ENV` dan `table.unpack`).', 'Copying LuaJIT/5.1 code that uses `setfenv` or the global `unpack` into Lua 5.4 — both were removed (use `_ENV` and `table.unpack`).'],
        ['Menjangka `10 / 2` memaparkan `5` dalam Lua 5.4 — ia memaparkan `5.0`.', 'Expecting `10 / 2` to display `5` in Lua 5.4 — it displays `5.0`.'],
        ['Menulis sintaks Luau (`+=`, `continue`, anotasi jenis) dalam fail Lua — itu ralat sintaks dalam Lua.', 'Writing Luau syntax (`+=`, `continue`, type annotations) in a Lua file — that is a syntax error in Lua.'],
        ['Menganggap API Roblox (`game`, `Instance`) tersedia dalam Lua — ia hanya wujud dalam Roblox.', 'Assuming Roblox APIs (`game`, `Instance`) are available in Lua — they exist only inside Roblox.'],
      )),
    S('debugging',
      P('Apabila kod yang "sepatutnya berfungsi" gagal, semak versi dahulu. Mesej ralat versi mempunyai corak tertentu: operator baharu dalam interpreter lama menghasilkan `unexpected symbol`, fungsi yang dibuang menghasilkan `attempt to call a nil value (global \'setfenv\')`, dan pengubahan pemalar menghasilkan ralat kompil seperti dalam contoh `const-54`. Contoh berikut menunjukkan fungsi Lua 5.1 yang dibuang:',
        'When code that "should work" fails, check the version first. Version errors have recognisable patterns: a new operator in an old interpreter gives `unexpected symbol`, a removed function gives `attempt to call a nil value (global \'setfenv\')`, and modifying a constant gives a compile error as in the `const-54` example. The following example shows a removed Lua 5.1 function:'),
      CODE('removed-unpack', 'lua', 'lua54', ['unpack telah dipindahkan ke table.unpack', 'unpack moved to table.unpack'], `
local point = {3, 4}
local x, y = table.unpack(point)
print(x + y)
`, '7', {
        debug: BUG(`
local point = {3, 4}
local x, y = unpack(point)
print(x + y)
`, "example:2: attempt to call a nil value (global 'unpack')",
          'Kod ini ditulis untuk Lua 5.1, di mana `unpack` ialah fungsi global. Lua 5.2 memindahkannya ke `table.unpack`, jadi dalam 5.4 global `unpack` ialah `nil`. Mesej "call a nil value (global …)" bermakna nama fungsi itu tidak wujud — semak ejaan dan versi. Betulkan dengan `table.unpack`.',
          'This code was written for Lua 5.1, where `unpack` is a global function. Lua 5.2 moved it to `table.unpack`, so in 5.4 the global `unpack` is `nil`. The message "call a nil value (global …)" means the function name does not exist — check the spelling and the version. Fix: `table.unpack`.'),
      }),
      EXPLAIN('removed-unpack',
        ['1', 'Satu titik sebagai array dua nombor.', 'A point as an array of two numbers.'],
        ['2', '`table.unpack` memulangkan elemen table sebagai beberapa nilai: 3 dan 4.', '`table.unpack` returns the table’s elements as several values: 3 and 4.'],
        ['3', 'Menjumlahkan kedua-dua nilai: 7.', 'Adds the two values: 7.'])),
    S('performance',
      P('LuaJIT boleh menjadi beberapa kali lebih pantas daripada Lua 5.4 untuk kod berangka kerana ia mengkompil gelung panas ke kod mesin. Lua 5.4 lebih pantas daripada 5.1 untuk banyak beban kerja berkat penambahbaikan mesin maya dan pengutip sampah generasi. Luau mempunyai interpreter yang dioptimumkan dan pengkompil kod asli pilihan dalam Roblox. Pilihan versi ialah keputusan prestasi **dan** keserasian.',
        'LuaJIT can be several times faster than Lua 5.4 on numeric code because it compiles hot loops to machine code. Lua 5.4 is faster than 5.1 on many workloads thanks to virtual-machine improvements and the generational collector. Luau has an optimised interpreter and an optional native code generator inside Roblox. Choosing a version is a performance **and** compatibility decision.')),
    S('software_engineering',
      P('Kod lemah menganggap versi secara senyap; kod yang lebih baik mengisytiharkan dan menyemak andaiannya pada permulaan:', 'Poor code silently assumes a version; better code declares and checks its assumptions at the start:'),
      CODE('poor-assume', 'lua', 'lua54', ['Pelaksanaan lemah: andaian versi tersembunyi', 'Poor implementation: hidden version assumption'], `
local function half(n)
  return n // 2
end
print(half(9))
`, '4'),
      EXPLAIN('poor-assume',
        ['1–3', '`//` memerlukan Lua 5.3+. Pada Lua 5.1, keseluruhan fail gagal dikompil dengan mesej yang tidak menyebut versi.', '`//` requires Lua 5.3+. On Lua 5.1, the whole file fails to compile with a message that does not mention versions.'],
        ['4', 'Berfungsi dalam 5.4: 9 // 2 = 4.', 'Works in 5.4: 9 // 2 = 4.']),
      CODE('improved-check', 'lua', 'lua54', ['Pelaksanaan lebih baik: semakan versi yang jelas', 'Improved implementation: an explicit version check'], `
assert(math.type, "this program needs Lua 5.3 or newer, got " .. _VERSION)

local function half(n)
  return n // 2
end
print(half(9))
`, '4'),
      EXPLAIN('improved-check',
        ['1', '`assert` menghentikan program dengan mesej yang jelas jika `math.type` tiada. Pengguna pada versi lama segera tahu masalahnya.', '`assert` stops the program with a clear message if `math.type` is missing. A user on an old version immediately knows the problem.'],
        ['3–6', 'Logik yang sama; kini andaiannya didokumenkan dan diperiksa.', 'The same logic; now its assumption is documented and checked.']),
      P('Nota: semakan masa runtime hanya membantu jika fail boleh dikompil. Untuk sokongan 5.1 sebenar, elakkan sintaks baharu sepenuhnya (seperti contoh `portable-floor`). Dalam projek pasukan, nyatakan versi sasaran dalam README dan konfigurasi CI.', 'Note: a runtime check only helps if the file compiles. For real 5.1 support, avoid new syntax entirely (like the `portable-floor` example). In team projects, state the target version in the README and the CI configuration.')),
    S('industry_use_cases',
      UL(
        ['**OpenResty** dan **Kong** menggunakan LuaJIT untuk kelajuan dalam pelayan web.', '**OpenResty** and **Kong** use LuaJIT for speed inside web servers.'],
        ['**Neovim** membenamkan LuaJIT (atau Lua 5.1), jadi plugin mesti mengelak ciri 5.3+.', '**Neovim** embeds LuaJIT (or Lua 5.1), so plugins must avoid 5.3+ features.'],
        ['**Roblox** menggunakan Luau untuk semua skrip permainan.', '**Roblox** uses Luau for all game scripts.'],
        ['Projek baharu yang membenamkan Lua dalam C biasanya memilih Lua 5.4.', 'New projects that embed Lua in C usually choose Lua 5.4.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `numbers-53` dan terangkan setiap nilai dalam output.', 'Run `numbers-53` and explain every value in the output.'],
        ['Dalam `bitwise-flags`, tambah kebenaran `EXECUTE` dengan `|` dan sahkan ujian kedua menjadi `true`.', 'In `bitwise-flags`, add the `EXECUTE` permission with `|` and confirm the second test becomes `true`.'],
        ['Jalankan versi berpepijat `const-54` dan perhatikan bahawa **tiada** output dicetak sebelum ralat.', 'Run the buggy version of `const-54` and notice that **no** output is printed before the error.'],
      )),
    S('mini_project',
      P('**Laporan keupayaan.** Tulis skrip yang melaporkan ciri versi yang tersedia dalam interpreter semasa, menggunakan pengesanan ciri.', '**A capability report.** Write a script that reports which version features are available in the current interpreter, using feature detection.'),
      CODE('capability-report', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local features = {
  {"integer subtype (5.3+)", math.type ~= nil},
  {"utf8 library (5.3+)", utf8 ~= nil},
  {"table.unpack (5.2+)", table.unpack ~= nil},
  {"setfenv (5.1 only)", setfenv ~= nil},
}

print(_VERSION)
for _, f in ipairs(features) do
  print(f[2] and "yes" or "no ", f[1])
end
`, 'Lua 5.4\nyes\tinteger subtype (5.3+)\nyes\tutf8 library (5.3+)\nyes\ttable.unpack (5.2+)\nno \tsetfenv (5.1 only)'),
      EXPLAIN('capability-report',
        ['1–6', 'Setiap baris ialah pasangan `{penerangan, ada?}`. Ungkapan `x ~= nil` dinilai semasa table dicipta.', 'Each row is a `{description, present?}` pair. The expression `x ~= nil` is evaluated when the table is built.'],
        ['8', 'Memaparkan versi bahasa.', 'Displays the language version.'],
        ['9–11', 'Untuk setiap ciri, `f[2] and "yes" or "no "` memilih label. `"no "` mempunyai ruang tambahan supaya lajur sejajar.', 'For each feature, `f[2] and "yes" or "no "` picks the label. `"no "` has an extra space so the columns line up.'])),
    S('summary',
      UL(
        ['Lua 5.2 menambah `_ENV` dan `goto`; 5.3 menambah integer, `//` dan operator bit; 5.4 menambah `<const>` dan `<close>`.', 'Lua 5.2 added `_ENV` and `goto`; 5.3 added integers, `//` and bitwise operators; 5.4 added `<const>` and `<close>`.'],
        ['LuaJIT ialah pelaksanaan 5.1 yang sangat pantas; Luau ialah bahasa Roblox yang berasingan.', 'LuaJIT is a very fast 5.1 implementation; Luau is Roblox’s separate language.'],
        ['Gunakan pengesanan ciri dan nyatakan versi sasaran dengan jelas.', 'Use feature detection and state the target version clearly.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah output `print(9 / 3)` dalam Lua 5.4, dan mengapa?', 'What is the output of `print(9 / 3)` in Lua 5.4, and why?'],
        ['Apakah yang berlaku apabila anda memberi nilai baharu kepada pemboleh ubah `<const>`?', 'What happens when you assign a new value to a `<const>` variable?'],
        ['Mengapakah plugin Neovim perlu mengelak operator `//`?', 'Why should Neovim plugins avoid the `//` operator?'],
        ['Namakan dua ciri Luau yang tidak wujud dalam Lua 5.4.', 'Name two Luau features that do not exist in Lua 5.4.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua version history — lua.org', url: VERSIONS },
        { title: 'Lua 5.4 Reference Manual §8 — Incompatibilities with the Previous Version', url: `${MANUAL}#8` },
        { title: 'Lua 5.4 Reference Manual §3.3.7 — Local Declarations (attributes)', url: `${MANUAL}#3.3.7` },
        { title: 'LuaJIT — project site', url: 'https://luajit.org/' },
        { title: 'Luau — language site', url: 'https://luau.org/' },
      )),
  ],
};

export const LUA101_M1 = [LUA101_1_1, LUA101_1_2, LUA101_1_3];
