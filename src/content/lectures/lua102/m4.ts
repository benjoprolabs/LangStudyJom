import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUA102 · Module 4 — Type Conversion and Project 1: Calculator (standard Lua 5.4; verified by
 * `npm run verify:code`). Lectures 4.2 (design) and 4.3 (build and test) form one project: 4.3 reuses the
 * design from 4.2 on purpose and adds the input loop, error handling and a test suite.
 */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 4.1 tonumber(), tostring() and automatic coercion ─────────────────────

export const LUA102_4_1: LectureContentDef = {
  courseCode: 'LUA102',
  module: 4,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menukar string kepada nombor dengan `tonumber`, termasuk asas 2–36.', 'Convert strings to numbers with `tonumber`, including bases 2–36.'],
        ['Menukar nilai kepada string dengan `tostring` dan meramal formatnya.', 'Convert values to strings with `tostring` and predict its format.'],
        ['Menerangkan bila Lua melakukan [[coercion]] secara automatik dan bila tidak.', 'Explain when Lua performs [[coercion]] automatically and when it does not.'],
        ['Memilih penukaran eksplisit untuk input luar.', 'Choose explicit conversion for outside input.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 2: jenis data dan subjenis nombor.', 'Module 2: data types and number subtypes.'],
        ['Modul 3: operator aritmetik, perbandingan dan `..`.', 'Module 3: arithmetic, comparison and `..` operators.'],
        ['LUA101 4.2: input sentiasa string.', 'LUA101 4.2: input is always a string.'],
      )),
    S('introduction',
      P('Data jarang tiba dalam jenis yang anda perlukan. Input pengguna, fail, argumen baris arahan dan respons rangkaian semuanya ialah **teks**, sedangkan pengiraan memerlukan nombor dan laporan memerlukan teks semula. Lua menyediakan penukaran eksplisit (`tonumber`, `tostring`) dan sedikit penukaran automatik ([[coercion]]). Kuliah ini menerangkan kedua-duanya — dan mengapa penukaran eksplisit hampir selalu pilihan yang lebih selamat.',
        'Data rarely arrives in the type you need. User input, files, command-line arguments and network responses are all **text**, while calculations need numbers and reports need text again. Lua provides explicit conversion (`tonumber`, `tostring`) and a little automatic conversion ([[coercion]]). This lecture explains both — and why explicit conversion is almost always the safer choice.'),
      KEY('Coercion berlaku untuk **aritmetik** (string → nombor) dan **`..`** (nombor → string) sahaja — tidak untuk perbandingan.', 'Coercion happens only for **arithmetic** (string → number) and **`..`** (number → string) — never for comparisons.', ['Peraturan utama', 'The key rule'])),
    S('fundamental_concepts',
      UL(
        ['`tonumber(s)` memulangkan nombor atau `nil`. Ia menerima ruang di sekeliling, heksadesimal (`"0x1F"`) dan notasi saintifik (`"1e2"`).', '`tonumber(s)` returns a number or `nil`. It accepts surrounding spaces, hexadecimal (`"0x1F"`) and scientific notation (`"1e2"`).'],
        ['`tonumber(s, asas)` menghuraikan integer dalam asas 2–36: `tonumber("ff", 16)` = 255.', '`tonumber(s, base)` parses an integer in base 2–36: `tonumber("ff", 16)` = 255.'],
        ['`tostring(x)` menukar mana-mana nilai kepada string; float dipaparkan dengan `%.14g` dan sentiasa dengan titik (`"10.0"`).', '`tostring(x)` converts any value to a string; floats are shown with `%.14g` and always with a dot (`"10.0"`).'],
        ['Coercion aritmetik: `"10" + 5` = 15 (subjenis mengikut teks: `"3.0" + 1` = 4.0).', 'Arithmetic coercion: `"10" + 5` = 15 (the subtype follows the text: `"3.0" + 1` = 4.0).'],
        ['Tiada coercion untuk `==` dan `<`: `"10" == 10` palsu, `"10" < 20` ralat.', 'No coercion for `==` and `<`: `"10" == 10` is false, `"10" < 20` is an error.'],
      )),
    S('detailed_theory',
      P('Dalam Lua 5.4, coercion string-ke-nombor untuk aritmetik dilaksanakan oleh **metamethod pustaka string**: apabila operan string bertemu operator aritmetik, metamethod itu cuba menukarnya dengan peraturan yang sama seperti `tonumber`. Jika gagal, ia membaling ralat yang menamakan operasi dan jenis (`attempt to add a \'string\' with a \'number\'`). Penukaran nombor-ke-string untuk `..` menggunakan format yang sama seperti `tostring`. Perbandingan sengaja dikecualikan, kerana `"10" < "9"` (perbandingan teks) dan `10 < 9` (perbandingan nombor) memberi jawapan berbeza — Lua tidak mahu meneka maksud anda.',
        'In Lua 5.4, string-to-number coercion for arithmetic is implemented by the **string library’s metamethods**: when a string operand meets an arithmetic operator, the metamethod tries to convert it with the same rules as `tonumber`. If that fails, it raises an error naming the operation and the types (`attempt to add a \'string\' with a \'number\'`). Number-to-string conversion for `..` uses the same format as `tostring`. Comparisons are deliberately excluded, because `"10" < "9"` (text comparison) and `10 < 9` (number comparison) give different answers — Lua refuses to guess what you mean.'),
      P('Kerana coercion senyap, ia boleh menyembunyikan pepijat: `"10" + "5"` memberi 15 walaupun kedua-duanya teks, tetapi `"10" .. 5` memberi `"105"`. Dalam kod yang membaca input luar, penukaran eksplisit lebih baik kerana ia membolehkan anda **mengesahkan**: `tonumber` memulangkan `nil` untuk input tidak sah, dan anda boleh melaporkan ralat yang jelas. Panduan gaya Lua yang baik menggunakan coercion hanya untuk kemudahan dalam skrip kecil, dan penukaran eksplisit di mana-mana sahaja data datang dari luar.',
        'Because coercion is silent, it can hide bugs: `"10" + "5"` gives 15 even though both are text, while `"10" .. 5` gives `"105"`. In code that reads outside input, explicit conversion is better because it lets you **validate**: `tonumber` returns `nil` for invalid input, and you can report a clear error. Good Lua style uses coercion only as a convenience in small scripts, and explicit conversion wherever data comes from outside.')),
    S('technical_terminology', TERMS('coercion', 'number-subtype', 'standard-input', 'nil')),
    S('syntax_rules',
      UL(
        ['`tonumber(nilai [, asas])` — memulangkan nombor atau `nil`.', '`tonumber(value [, base])` — returns a number or `nil`.'],
        ['`tostring(nilai)` — memulangkan string; untuk table dan fungsi, teks mengandungi alamat.', '`tostring(value)` — returns a string; for tables and functions, the text contains an address.'],
        ['`math.tointeger(x)` — float tanpa pecahan → integer.', '`math.tointeger(x)` — a float without a fraction → an integer.'],
        ['`string.format("%d", n)` / `("%.2f")` — penukaran ke teks yang terkawal.', '`string.format("%d", n)` / `("%.2f")` — controlled conversion to text.'],
      )),
    S('code_demonstration',
      CODE('tonumber-cases', 'lua', 'lua54', ['Pelbagai input untuk tonumber', 'Various inputs to tonumber'], `
print(tonumber("42"), tonumber("3.5"), tonumber("  10  "))
print(tonumber("0x1F"), tonumber("1e2"), tonumber("12abc"), tonumber(""))
print(tonumber("ff", 16), tonumber("101", 2), tonumber("z", 36))
`, '42\t3.5\t10\n31\t100.0\tnil\tnil\n255\t5\t35'),
      EXPLAIN('tonumber-cases',
        ['1', 'Integer, float, dan ruang di sekeliling yang dibuang.', 'An integer, a float, and surrounding spaces that are ignored.'],
        ['2', 'Heksadesimal → 31; `1e2` → float 100.0; teks bercampur dan string kosong → `nil` (tidak sah).', 'Hexadecimal → 31; `1e2` → the float 100.0; mixed text and the empty string → `nil` (invalid).'],
        ['3', 'Dengan asas: "ff" dalam heksa = 255, "101" dalam binari = 5, "z" dalam asas 36 = 35.', 'With a base: "ff" in hex = 255, "101" in binary = 5, "z" in base 36 = 35.'])),
    S('complete_examples',
      CODE('coercion-rules', 'lua', 'lua54', ['Bila coercion berlaku', 'When coercion happens'], `
print("10" + 5, "3.0" + 1, "10" * "2")
print(10 .. 5, 1.5 .. "", tostring(10.0))
print("10" == 10, tonumber("10") == 10)
`, '15\t4.0\t20\n105\t1.5\t10.0\nfalse\ttrue'),
      EXPLAIN('coercion-rules',
        ['1', 'Aritmetik menukar string: `"10" + 5` = 15 (integer), `"3.0" + 1` = 4.0 (float kerana teks "3.0"), malah dua string boleh didarab.', 'Arithmetic converts strings: `"10" + 5` = 15 (integer), `"3.0" + 1` = 4.0 (a float because of the text "3.0"), even two strings can be multiplied.'],
        ['2', '`..` menukar nombor kepada teks: `10 .. 5` = "105". Float sentiasa membawa titik: "10.0".', '`..` converts numbers to text: `10 .. 5` = "105". Floats always carry a dot: "10.0".'],
        ['3', '`==` tidak menukar: string "10" ≠ nombor 10. Selepas `tonumber`, kedua-duanya sama.', '`==` does not convert: the string "10" ≠ the number 10. After `tonumber`, they are equal.']),
      CODE('tostring-formats', 'lua', 'lua54', ['Format tostring', 'tostring formats'], `
print(tostring(1 / 3), tostring(2 ^ 63), tostring(-0.0))
print(tostring(true), tostring(nil), type(tostring(print)))
print(string.format("%.2f|%d|%5.1f", 1 / 3, 7, 2.25))
`, '0.33333333333333\t9.2233720368548e+18\t-0.0\ntrue\tnil\tstring\n0.33|7|  2.2', {
        debug: BUG(`
local total = 0
for _, price in ipairs({"12.50", "8.90", "abc"}) do
  total = total + price
end
print(total)
`, "example:3: attempt to add a 'number' with a 'string'",
          'Coercion menukar `"12.50"` dan `"8.90"` secara senyap, tetapi `"abc"` tidak boleh menjadi nombor, jadi metamethod pustaka string membaling ralat pada baris 3. Mesej menyebut jenis kedua-dua operan, bukan **nilai** yang rosak — anda perlu mencari sendiri. Dengan `tonumber` eksplisit, anda boleh melaporkan nilai yang tepat: `"price is not a number: abc"`.',
          'Coercion silently converts `"12.50"` and `"8.90"`, but `"abc"` cannot become a number, so the string library’s metamethod raises an error on line 3. The message names both operand types, not the bad **value** — you have to find it yourself. With an explicit `tonumber`, you can report the exact value: `"price is not a number: abc"`.'),
      }),
      EXPLAIN('tostring-formats',
        ['1', '`%.14g` memberi 14 digit bererti: 1/3 dipotong, 2^63 dalam notasi saintifik, dan sifar negatif float dikekalkan sebagai `-0.0`.', '`%.14g` gives 14 significant digits: 1/3 is cut, 2^63 is in scientific notation, and float negative zero is kept as `-0.0`.'],
        ['2', 'Boolean dan `nil` menjadi teksnya; fungsi menjadi string (yang mengandungi alamat, jadi kita hanya mencetak jenisnya).', 'Booleans and `nil` become their text; a function becomes a string (containing an address, so we only print its type).'],
        ['3', '`string.format` memberi kawalan penuh: dua tempat perpuluhan, integer, dan lebar 5 dengan satu tempat perpuluhan. 2.25 dipaparkan `2.2` kerana float 2.25 tepat dan printf membundarkan "separuh ke genap".', '`string.format` gives full control: two decimal places, an integer, and width 5 with one decimal place. 2.25 shows as `2.2` because the float 2.25 is exact and printf rounds "half to even".'])),
    S('line_by_line',
      EXPLAIN('coercion-rules',
        ['1', 'Subjenis hasil mengikut cara string ditulis: `"10"` menjadi integer, `"3.0"` menjadi float — sama seperti `tonumber` pada string itu.', 'The result’s subtype follows how the string is written: `"10"` becomes an integer, `"3.0"` a float — exactly as `tonumber` would.']),
      EXPLAIN('tonumber-cases',
        ['2', '`tonumber` tidak menerima sebahagian nombor: `"12abc"` bukan 12, ia `nil`. Ini memudahkan pengesahan — tiada separa kejayaan.', '`tonumber` does not accept partial numbers: `"12abc"` is not 12, it is `nil`. That makes validation simple — no partial success.'])),
    S('why_this_way',
      P('Mengapa Lua menyokong coercion sama sekali? Kerana Lua lahir sebagai bahasa konfigurasi untuk bukan pengaturcara, dan menulis `"10" + 5` tanpa ralat adalah mesra. Mengapa tidak untuk perbandingan? Kerana di situ maksudnya kabur. Mengapa `tonumber` memulangkan `nil` dan bukannya ralat? Supaya input yang tidak sah ialah keadaan biasa yang mudah disemak dengan `if not n then`.',
        'Why does Lua support coercion at all? Because Lua was born as a configuration language for non-programmers, and writing `"10" + 5` without an error is friendly. Why not for comparisons? Because there the meaning is ambiguous. Why does `tonumber` return `nil` instead of raising an error? So invalid input is a normal situation that is easy to check with `if not n then`.'),
      P('Gunakan penukaran eksplisit **apabila** data datang dari luar (input, fail, rangkaian); coercion boleh diterima **apabila** anda mengawal kedua-dua nilai dan kodnya pendek.', 'Use explicit conversion **when** data comes from outside (input, files, network); coercion is acceptable **when** you control both values and the code is short.')),
    S('execution_flow',
      OL(
        ['`"10" + 5`: mesin maya melihat operan string untuk `ADD` dan memanggil metamethod `__add` string.', '`"10" + 5`: the virtual machine sees a string operand for `ADD` and calls the string `__add` metamethod.'],
        ['Metamethod menukar `"10"` dengan peraturan `tonumber` → integer 10.', 'The metamethod converts `"10"` with the `tonumber` rules → the integer 10.'],
        ['Ia melakukan 10 + 5 dan memulangkan 15.', 'It performs 10 + 5 and returns 15.'],
        ['Untuk `"abc"`, penukaran gagal dan metamethod membaling ralat dengan jenis operan.', 'For `"abc"`, conversion fails and the metamethod raises an error naming the operand types.'],
      )),
    S('memory_behaviour',
      P('`tonumber` tidak memperuntukkan memori — nombor disimpan terus dalam nilai. `tostring` dan `..` dengan nombor mencipta string baharu dalam heap setiap kali. Dalam gelung yang menukar berjuta nombor kepada teks, kumpulkan hasil dalam table dan gunakan `table.concat` sekali, atau tulis terus dengan `io.write`.',
        '`tonumber` allocates no memory — the number is stored directly in the value. `tostring` and `..` with numbers create a new string on the heap every time. In a loop that converts millions of numbers to text, collect the results in a table and use `table.concat` once, or write directly with `io.write`.')),
    S('alternative_implementations',
      P('Untuk nombor dalam format tempatan (contohnya koma ribuan "1,250"), `tonumber` gagal. Bersihkan teks dahulu:', 'For numbers in a local format (for example thousands separators "1,250"), `tonumber` fails. Clean the text first:'),
      CODE('clean-number', 'lua', 'lua54', ['Membersihkan teks sebelum tonumber', 'Cleaning text before tonumber'], `
local raw = "RM 1,250.75"
local cleaned = raw:gsub("[^%d%.]", "")
print(tonumber(raw), cleaned, tonumber(cleaned))
`, 'nil\t1250.75\t1250.75'),
      EXPLAIN('clean-number',
        ['1', 'Teks harga seperti yang dipaparkan kepada pengguna.', 'A price as displayed to users.'],
        ['2', '`gsub("[^%d%.]", "")` membuang setiap aksara yang **bukan** digit atau titik. `gsub` memulangkan dua nilai; local hanya menerima yang pertama (string).', '`gsub("[^%d%.]", "")` removes every character that is **not** a digit or a dot. `gsub` returns two values; the local receives only the first (the string).'],
        ['3', 'Teks asal tidak sah (`nil`); teks yang dibersihkan menjadi 1250.75.', 'The original text is invalid (`nil`); the cleaned text becomes 1250.75.'])),
    S('common_mistakes',
      UL(
        ['Membandingkan input string dengan nombor tanpa `tonumber`.', 'Comparing string input with numbers without `tonumber`.'],
        ['Tidak menyemak `nil` selepas `tonumber`.', 'Not checking for `nil` after `tonumber`.'],
        ['Menjangka `tonumber("12abc")` memberi 12.', 'Expecting `tonumber("12abc")` to give 12.'],
        ['Menggunakan `tostring(x)` untuk wang dan mendapat `"12.5"` dan bukannya `"12.50"` — gunakan `string.format("%.2f")`.', 'Using `tostring(x)` for money and getting `"12.5"` instead of `"12.50"` — use `string.format("%.2f")`.'],
        ['Bergantung pada coercion dan mendapat `"105"` daripada `10 .. 5` apabila 15 dimaksudkan.', 'Relying on coercion and getting `"105"` from `10 .. 5` when 15 was meant.'],
      )),
    S('debugging',
      P('Pepijat penukaran muncul dalam dua bentuk. **Ralat coercion** (`attempt to add a \'string\' with a \'number\'`) menyebut jenis tetapi bukan nilai — cetak nilai mentah untuk mencarinya. **Ralat argumen** daripada `tonumber` sendiri berlaku apabila argumen salah jenis, contohnya memanggil `tonumber` tanpa argumen atau dengan asas yang tidak sah. Contoh berikut menunjukkan argumen yang hilang:',
        'Conversion bugs come in two shapes. **Coercion errors** (`attempt to add a \'string\' with a \'number\'`) name the types but not the value — print the raw value to find it. **Argument errors** from `tonumber` itself happen when an argument has the wrong type, for example calling `tonumber` with no argument or with a non-string in base mode. The following example shows a missing argument:'),
      CODE('parse-age', 'lua', 'lua54', ['Menghuraikan umur dengan semakan', 'Parsing an age with a check'], `
local function parseAge(text)
  local n = tonumber(text)
  if not n then return nil, "not a number: " .. tostring(text) end
  return n
end

print(parseAge("17"))
print(parseAge("seventeen"))
`, '17\nnil\tnot a number: seventeen', {
        debug: BUG(`
local function parseAge(text)
  local n = tonumber()
  if not n then return nil, "not a number: " .. tostring(text) end
  return n
end

print(parseAge("17"))
`, "example:2: bad argument #1 to 'tonumber' (value expected)",
          'Argumen terlupa dihantar kepada `tonumber`. Mesej "bad argument #1 … (value expected)" bermaksud fungsi pustaka tidak menerima argumen yang wajib. Perhatikan perbezaan: `tonumber(nil)` (argumen ada, nilainya `nil`) memulangkan `nil` dengan senyap, tetapi `tonumber()` (tiada argumen) ialah ralat.',
          'The argument was never passed to `tonumber`. The message "bad argument #1 … (value expected)" means a library function did not receive a required argument. Note the difference: `tonumber(nil)` (an argument that is `nil`) quietly returns `nil`, but `tonumber()` (no argument at all) is an error.'),
      }),
      EXPLAIN('parse-age',
        ['1–5', 'Fungsi yang menukar dan mengesahkan, memulangkan nombor atau `(nil, mesej)`.', 'A function that converts and validates, returning a number or `(nil, message)`.'],
        ['7–8', 'Input sah dan tidak sah, kedua-duanya dikendalikan tanpa ralat.', 'Valid and invalid input, both handled without an error.'])),
    S('performance',
      P('`tonumber` pantas, tetapi menghurai teks masih lebih perlahan daripada aritmetik. Tukar data **sekali** semasa ia memasuki program (contohnya semasa membaca fail), dan simpan nombor dalam struktur data anda — jangan simpan string dan bergantung pada coercion setiap kali ia digunakan.',
        '`tonumber` is fast, but parsing text is still slower than arithmetic. Convert data **once** as it enters the program (for example while reading a file), and store numbers in your data structures — do not store strings and rely on coercion every time they are used.')),
    S('software_engineering',
      P('Bandingkan dua cara menjumlahkan harga yang dibaca daripada teks:', 'Compare two ways of totalling prices read from text:'),
      CODE('poor-implicit', 'lua', 'lua54', ['Pelaksanaan lemah: bergantung pada coercion', 'Poor implementation: relying on coercion'], `
local prices = {"12.50", "8.90", "3"}
local total = 0
for _, p in ipairs(prices) do total = total + p end
print(total)
`, '24.4'),
      EXPLAIN('poor-implicit',
        ['1–3', 'Berfungsi untuk data yang baik, tetapi satu nilai rosak akan menghentikan program dengan mesej yang tidak menyebut nilai itu.', 'It works for good data, but one bad value would stop the program with a message that does not mention that value.'],
        ['4', 'Jumlah 24.4.', 'The total is 24.4.']),
      CODE('improved-explicit-conversion', 'lua', 'lua54', ['Pelaksanaan lebih baik: penukaran eksplisit dan laporan', 'Improved implementation: explicit conversion and reporting'], `
local prices = {"12.50", "8.90", "abc", "3"}
local total, rejected = 0, {}
for i, text in ipairs(prices) do
  local value = tonumber(text)
  if value then
    total = total + value
  else
    rejected[#rejected + 1] = "#" .. i .. " (" .. text .. ")"
  end
end
print(string.format("total %.2f, rejected: %s", total, table.concat(rejected, ", ")))
`, 'total 24.40, rejected: #3 (abc)'),
      EXPLAIN('improved-explicit-conversion',
        ['1–2', 'Data dengan satu nilai rosak; jumlah dan senarai nilai yang ditolak.', 'Data with one bad value; a total and a list of rejected values.'],
        ['3–10', 'Setiap teks ditukar secara eksplisit. Nilai sah ditambah; nilai tidak sah direkodkan dengan kedudukan dan kandungannya.', 'Each text is converted explicitly. Valid values are added; invalid values are recorded with their position and content.'],
        ['11', 'Laporan yang memberitahu jumlah **dan** apa yang ditolak — program tidak berhenti dan tiada yang hilang secara senyap.', 'A report that gives the total **and** what was rejected — the program does not stop and nothing is lost silently.'])),
    S('industry_use_cases',
      UL(
        ['Penghurai CSV dan fail konfigurasi menukar setiap medan dengan `tonumber` dan melaporkan baris yang rosak.', 'CSV and configuration parsers convert each field with `tonumber` and report bad lines.'],
        ['Sistem HTTP menerima parameter URL sebagai string dan menukarnya secara eksplisit sebelum menggunakannya.', 'HTTP systems receive URL parameters as strings and convert them explicitly before use.'],
        ['Alat warna menukar kod heksa `"#FF8800"` dengan `tonumber(s, 16)`.', 'Colour tools convert hex codes `"#FF8800"` with `tonumber(s, 16)`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `tonumber-cases` dan cuba `tonumber("0b101")` — adakah Lua menerima awalan binari?', 'Run `tonumber-cases` and try `tonumber("0b101")` — does Lua accept a binary prefix?'],
        ['Jalankan versi berpepijat `tostring-formats` dan bandingkan mesejnya dengan laporan dalam `improved-explicit-conversion`.', 'Run the buggy `tostring-formats` and compare its message with the report in `improved-explicit-conversion`.'],
        ['Tukar warna `"FF8800"` kepada komponen merah, hijau dan biru dengan `tonumber(…, 16)` dan `string.sub`.', 'Convert the colour `"FF8800"` into red, green and blue components with `tonumber(…, 16)` and `string.sub`.'],
      )),
    S('mini_project',
      P('**Penghurai rekod pelajar.** Tukar baris CSV `"Aisyah,17,3.75"` kepada table dengan nama (string), umur (integer) dan PNGK (float), dan tolak baris yang medannya tidak sah.', '**A student record parser.** Convert the CSV line `"Aisyah,17,3.75"` into a table with a name (string), an age (integer) and a GPA (float), and reject lines with invalid fields.'),
      CODE('csv-record', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function parseStudent(line)
  local name, ageText, gpaText = line:match("^([^,]+),([^,]+),([^,]+)$")
  if not name then return nil, "wrong number of fields" end
  local age, gpa = math.tointeger(tonumber(ageText)), tonumber(gpaText)
  if not age then return nil, "age must be a whole number: " .. ageText end
  if not gpa then return nil, "gpa must be a number: " .. gpaText end
  return {name = name, age = age, gpa = gpa}
end

for _, line in ipairs({"Aisyah,17,3.75", "Raj,17.5,3.2", "Mei,18"}) do
  local s, err = parseStudent(line)
  print(s and string.format("%s (%d) GPA %.2f", s.name, s.age, s.gpa) or ("rejected: " .. err))
end
`, 'Aisyah (17) GPA 3.75\nrejected: age must be a whole number: 17.5\nrejected: wrong number of fields'),
      EXPLAIN('csv-record',
        ['1–3', 'Corak menangkap tepat tiga medan yang dipisahkan koma; jika bilangannya salah, `match` memulangkan `nil`.', 'The pattern captures exactly three comma-separated fields; if the count is wrong, `match` returns `nil`.'],
        ['4', 'Umur mesti integer: `tonumber` kemudian `math.tointeger` (yang memberi `nil` untuk 17.5). `math.tointeger(nil)` juga memberi `nil`, jadi teks bukan nombor ditangkap di sini juga.', 'Age must be an integer: `tonumber` then `math.tointeger` (which gives `nil` for 17.5). `math.tointeger(nil)` also gives `nil`, so non-numeric text is caught here too.'],
        ['5–7', 'Setiap kegagalan memulangkan mesej yang menyebut medan dan nilainya; jika semuanya sah, table rekod dipulangkan.', 'Each failure returns a message naming the field and its value; if everything is valid, a record table is returned.'],
        ['10–13', 'Uji baris yang sah, umur pecahan dan medan yang hilang.', 'Test a valid line, a fractional age and a missing field.'])),
    S('summary',
      UL(
        ['`tonumber` memulangkan nombor atau `nil`; ia menyokong heksa, notasi saintifik dan asas 2–36.', '`tonumber` returns a number or `nil`; it supports hex, scientific notation and bases 2–36.'],
        ['`tostring` menggunakan `%.14g`; gunakan `string.format` untuk paparan yang terkawal.', '`tostring` uses `%.14g`; use `string.format` for controlled display.'],
        ['Coercion hanya untuk aritmetik dan `..`, tidak pernah untuk perbandingan.', 'Coercion only for arithmetic and `..`, never for comparisons.'],
        ['Tukar input luar secara eksplisit, sekali, dengan pengesahan.', 'Convert outside input explicitly, once, with validation.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah hasil `"5" + "5"` dan `"5" .. "5"`?', 'What are `"5" + "5"` and `"5" .. "5"`?'],
        ['Apakah yang dipulangkan oleh `tonumber("1e3")` dan apakah subjenisnya?', 'What does `tonumber("1e3")` return and what is its subtype?'],
        ['Mengapakah `tonumber(nil)` memulangkan `nil` tetapi `tonumber()` ialah ralat?', 'Why does `tonumber(nil)` return `nil` but `tonumber()` is an error?'],
        ['Bagaimanakah anda menukar `"7f"` (heksa) kepada nombor?', 'How do you convert `"7f"` (hex) to a number?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.4.3 — Coercions and Conversions', url: `${MANUAL}#3.4.3` },
        { title: 'Lua 5.4 Reference Manual — tonumber', url: `${MANUAL}#pdf-tonumber` },
        { title: 'Lua 5.4 Reference Manual — tostring', url: `${MANUAL}#pdf-tostring` },
        { title: 'Programming in Lua (1st ed.) — 2.4 Strings (conversions)', url: `${PIL}/2.4.html` },
      )),
  ],
};

// ─── 4.2 Calculator design: requirements and program flow ──────────────────

export const LUA102_4_2: LectureContentDef = {
  courseCode: 'LUA102',
  module: 4,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis keperluan (requirements) untuk program kecil sebelum mengekod.', 'Write requirements for a small program before coding.'],
        ['Memecahkan masalah kepada fungsi: huraikan, sahkan, kira, format.', 'Break a problem into functions: parse, validate, compute, format.'],
        ['Menggunakan **table penghantaran** (dispatch table) untuk memilih operasi.', 'Use a **dispatch table** to choose an operation.'],
        ['Mereka bentuk kes ujian daripada keperluan.', 'Design test cases from the requirements.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1: `tonumber`, `tostring` dan pengesahan.', 'Lecture 4.1: `tonumber`, `tostring` and validation.'],
        ['Modul 3: semua operator aritmetik.', 'Module 3: all arithmetic operators.'],
        ['LUA101 4.2–4.3: `io.read`, corak `(nil, mesej)` dan `pcall`.', 'LUA101 4.2–4.3: `io.read`, the `(nil, message)` pattern and `pcall`.'],
      )),
    S('introduction',
      P('**Projek 1: Kalkulator** menggabungkan semua yang dipelajari dalam LUA102. Kuliah ini ialah fasa **reka bentuk**: kita menulis keperluan, memecahkan program kepada fungsi kecil yang setiap satunya mempunyai satu tugas, dan memutuskan bagaimana ralat dilaporkan. Kuliah 4.3 kemudian membina dan menguji program lengkap. Memisahkan reka bentuk daripada pembinaan ialah amalan kejuruteraan perisian: perubahan dalam reka bentuk murah; perubahan dalam kod yang sudah siap mahal.',
        '**Project 1: Calculator** brings together everything learned in LUA102. This lecture is the **design** phase: we write requirements, split the program into small functions that each have one job, and decide how errors are reported. Lecture 4.3 then builds and tests the complete program. Separating design from construction is a software engineering practice: changes in a design are cheap; changes in finished code are expensive.'),
      KEY('Reka bentuk yang baik: setiap fungsi melakukan **satu** perkara dan boleh diuji secara berasingan.', 'A good design: every function does **one** thing and can be tested on its own.', ['Prinsip reka bentuk', 'Design principle'])),
    S('fundamental_concepts',
      UL(
        ['**Keperluan fungsian:** menerima `nombor operator nombor` (contohnya `12 + 3`), menyokong `+ - * / // % ^`, memaparkan hasil.', '**Functional requirements:** accept `number operator number` (for example `12 + 3`), support `+ - * / // % ^`, display the result.'],
        ['**Keperluan ralat:** nombor tidak sah, operator tidak dikenali dan pembahagian dengan sifar dilaporkan — program tidak pernah berhenti secara tiba-tiba.', '**Error requirements:** invalid numbers, unknown operators and division by zero are reported — the program never stops abruptly.'],
        ['**Aliran:** baca baris → huraikan → kira → format → paparkan → ulang sehingga `quit` atau input tamat.', '**Flow:** read a line → parse → compute → format → display → repeat until `quit` or end of input.'],
        ['**Table penghantaran:** table yang memetakan simbol operator kepada fungsi; menambah operator = menambah satu baris.', '**Dispatch table:** a table mapping operator symbols to functions; adding an operator = adding one line.'],
        ['**Kontrak fungsi:** setiap fungsi memulangkan hasil, atau `nil` dan mesej ralat.', '**Function contract:** every function returns a result, or `nil` and an error message.'],
      )),
    S('detailed_theory',
      P('**Penguraian fungsian** (functional decomposition) bermaksud memecahkan masalah besar kepada fungsi yang lebih kecil sehingga setiap satu cukup mudah untuk ditulis dan diuji. Untuk kalkulator: `parse(line)` menukar teks kepada dua nombor dan operator; `compute(a, op, b)` melakukan pengiraan; `formatResult(x)` menukar nombor kepada teks yang kemas. Gelung utama hanya menyambungkan fungsi-fungsi ini. Kerana `parse`, `compute` dan `formatResult` tidak membaca input atau mencetak, ia **tulen** (pure) — keputusan bergantung hanya pada argumen — dan boleh diuji dengan memanggilnya terus.',
        '**Functional decomposition** means breaking a large problem into smaller functions until each is simple enough to write and test. For the calculator: `parse(line)` turns text into two numbers and an operator; `compute(a, op, b)` does the calculation; `formatResult(x)` turns a number into tidy text. The main loop only connects these functions. Because `parse`, `compute` and `formatResult` neither read input nor print, they are **pure** — their results depend only on their arguments — and can be tested by calling them directly.'),
      P('Untuk memilih operasi, rantai `if op == "+" then … elseif op == "-" then …` berfungsi tetapi membesar dengan setiap operator. **Table penghantaran** menyimpan operasi sebagai data: `ops["+"]` ialah fungsi yang menambah. Mencari operator ialah satu carian table, dan operator yang tidak dikenali dikesan dengan semakan `ops[op] == nil`. Ini ialah contoh "mekanisme, bukan polisi" Lua (LUA101 1.1): fungsi kelas pertama dan table menggantikan struktur kawalan yang panjang.',
        'To choose an operation, an `if op == "+" then … elseif op == "-" then …` chain works but grows with every operator. A **dispatch table** stores operations as data: `ops["+"]` is a function that adds. Finding an operator is one table lookup, and an unknown operator is detected with the check `ops[op] == nil`. This is an example of Lua’s "mechanisms, not policies" (LUA101 1.1): first-class functions and tables replace long control structures.')),
    S('technical_terminology', TERMS('function', 'table', 'coercion', 'operator')),
    S('syntax_rules',
      UL(
        ['`line:match("^%s*(%S+)%s+(%S+)%s+(%S+)%s*$")` — tiga token dipisahkan ruang; `%S+` ialah aksara bukan ruang.', '`line:match("^%s*(%S+)%s+(%S+)%s+(%S+)%s*$")` — three space-separated tokens; `%S+` means non-space characters.'],
        ['Table penghantaran: `local ops = {["+"] = function(a, b) return a + b end, …}`.', 'A dispatch table: `local ops = {["+"] = function(a, b) return a + b end, …}`.'],
        ['Kontrak: `return hasil` atau `return nil, "mesej"`.', 'Contract: `return result` or `return nil, "message"`.'],
      )),
    S('code_demonstration',
      CODE('parse-expression', 'lua', 'lua54', ['Fungsi parse: teks kepada nombor dan operator', 'The parse function: text to numbers and an operator'], `
local function parse(line)
  local left, op, right = line:match("^%s*(%S+)%s+(%S+)%s+(%S+)%s*$")
  if not left then
    return nil, "expected: number operator number"
  end
  local a, b = tonumber(left), tonumber(right)
  if not a then return nil, "not a number: " .. left end
  if not b then return nil, "not a number: " .. right end
  return a, op, b
end

print(parse("12 + 3"))
print(parse("  2.5  *  4 "))
print(parse("abc - 1"))
print(parse("7+2"))
`, '12\t+\t3\n2.5\t*\t4\nnil\tnot a number: abc\nnil\texpected: number operator number'),
      EXPLAIN('parse-expression',
        ['1–2', 'Corak menangkap tiga token bukan ruang, dengan ruang pilihan di hujung. Jika teks tidak sepadan, ketiga-tiga tangkapan ialah `nil`.', 'The pattern captures three non-space tokens, with optional spaces at the ends. If the text does not match, all three captures are `nil`.'],
        ['3–5', 'Bentuk salah dilaporkan dengan mesej yang memberitahu format yang dijangka.', 'A wrong shape is reported with a message stating the expected format.'],
        ['6–8', 'Kedua-dua operan ditukar secara eksplisit; setiap kegagalan menyebut token yang salah.', 'Both operands are converted explicitly; each failure names the bad token.'],
        ['9', 'Kejayaan: tiga nilai — nombor, operator (masih teks), nombor.', 'Success: three values — a number, the operator (still text), a number.'],
        ['12–15', 'Empat kes reka bentuk: biasa, ruang tambahan, nombor tidak sah, dan tanpa ruang (keperluan kita mewajibkan ruang).', 'Four design cases: normal, extra spaces, an invalid number, and no spaces (our requirements make spaces mandatory).'])),
    S('complete_examples',
      CODE('dispatch-table', 'lua', 'lua54', ['Table penghantaran operator', 'An operator dispatch table'], `
local ops = {
  ["+"] = function(a, b) return a + b end,
  ["-"] = function(a, b) return a - b end,
  ["*"] = function(a, b) return a * b end,
  ["/"] = function(a, b) return a / b end,
}

local function compute(a, op, b)
  local f = ops[op]
  if not f then return nil, "unknown operator: " .. op end
  return f(a, b)
end

print(compute(12, "+", 3), compute(7, "/", 2))
print(compute(2, "?", 3))
`, '15\t3.5\nnil\tunknown operator: ?', {
        debug: BUG(`
local ops = {
  ["+"] = function(a, b) return a + b end,
  ["-"] = function(a, b) return a - b end,
}

local function compute(a, op, b)
  return ops[op](a, b)
end

print(compute(12, "+", 3))
print(compute(2, "*", 3))
`, "example:7: attempt to call a nil value (field '?')",
          'Versi ini memanggil `ops[op]` tanpa menyemak sama ada operator wujud. `ops["*"]` ialah `nil`, jadi panggilan gagal. Mesej menyebut `field \'?\'` kerana kunci dikira semasa runtime — Lua tidak tahu namanya, jadi mesej tidak menyebut `*` sama sekali. Semakan eksplisit dalam versi asal memberi mesej yang menamakan operator.',
          'This version calls `ops[op]` without checking that the operator exists. `ops["*"]` is `nil`, so the call fails. The message says `field \'?\'` because the key is computed at run time — Lua does not know its name, so the message never mentions `*`. The explicit check in the original version gives a message that names the operator.'),
      }),
      EXPLAIN('dispatch-table',
        ['1–6', 'Setiap kunci ialah simbol operator (ditulis dalam kurungan kerana `+` bukan nama yang sah); setiap nilai ialah fungsi dua argumen.', 'Each key is an operator symbol (written in brackets because `+` is not a valid name); each value is a two-argument function.'],
        ['8–12', '`compute` mencari fungsi, melaporkan operator yang tidak dikenali, dan memanggil fungsi yang ditemui.', '`compute` looks up the function, reports an unknown operator, and calls the function it found.'],
        ['14–15', 'Dua pengiraan dan satu operator tidak dikenali.', 'Two calculations and one unknown operator.']),
      CODE('format-result', 'lua', 'lua54', ['Memformat hasil supaya kemas', 'Formatting results tidily'], `
local function formatResult(x)
  if x ~= x then return "not a number" end
  local whole = math.tointeger(x)
  if whole then return tostring(whole) end
  return string.format("%.10g", x)
end

print(formatResult(15), formatResult(6 / 3), formatResult(10 / 3), formatResult(2 ^ 10))
print(formatResult(0 / 0 * 0))
`, '15\t2\t3.333333333\t1024\nnot a number'),
      EXPLAIN('format-result',
        ['1–2', '`x ~= x` benar hanya untuk NaN — satu-satunya nilai yang tidak sama dengan dirinya sendiri.', '`x ~= x` is true only for NaN — the only value not equal to itself.'],
        ['3–4', 'Float tanpa pecahan (seperti 2.0 atau 1024.0) dipaparkan sebagai integer — lebih mesra pengguna kalkulator.', 'Floats without a fraction (such as 2.0 or 1024.0) are shown as integers — friendlier for calculator users.'],
        ['5', 'Lain-lain dengan sehingga 10 digit bererti, mengelak ekor panjang seperti 3.3333333333333335.', 'Everything else with up to 10 significant digits, avoiding long tails like 3.3333333333333335.'],
        ['8–9', 'Uji integer, pembahagian tepat, pembahagian berpecahan, kuasa, dan NaN.', 'Test an integer, an exact division, a fractional division, a power, and NaN.'])),
    S('line_by_line',
      EXPLAIN('parse-expression',
        ['2', 'Mengapa `%S+` dan bukan corak nombor? Kerana kita mahu `parse` menangkap **apa sahaja** token, kemudian melaporkan dengan tepat mana yang bukan nombor. Corak nombor yang ketat hanya akan berkata "tidak sepadan".', 'Why `%S+` and not a number pattern? Because we want `parse` to capture **any** token, then report exactly which one is not a number. A strict number pattern would only say "no match".']),
      EXPLAIN('dispatch-table',
        ['9–10', 'Menyemak `nil` sebelum memanggil ialah bahagian kontrak `compute`: ia sentiasa memulangkan hasil atau `(nil, mesej)`, tidak pernah membaling ralat untuk input pengguna.', 'Checking for `nil` before calling is part of `compute`’s contract: it always returns a result or `(nil, message)`, never raising an error for user input.'])),
    S('why_this_way',
      P('Mengapa memisahkan `parse`, `compute` dan `formatResult`? Kerana setiap satu boleh berubah tanpa menjejaskan yang lain: menukar format input hanya menyentuh `parse`; menambah operator hanya menyentuh `ops`; menukar paparan hanya menyentuh `formatResult`. Mengapa kontrak `(nil, mesej)` dan bukannya `error`? Kerana input pengguna yang salah ialah keadaan **biasa** dalam kalkulator, bukan pepijat — gelung utama mesti boleh melaporkannya dan meneruskan.',
        'Why separate `parse`, `compute` and `formatResult`? Because each can change without affecting the others: changing the input format only touches `parse`; adding an operator only touches `ops`; changing the display only touches `formatResult`. Why a `(nil, message)` contract instead of `error`? Because wrong user input is a **normal** situation in a calculator, not a bug — the main loop must be able to report it and carry on.'),
      P('Reka bentuk seperti ini digunakan **apabila** program akan berkembang atau diuji. Untuk skrip sekali guna lima baris, ia berlebihan — tetapi projek ini ialah asas untuk projek LUA103 dan seterusnya.', 'A design like this is used **when** a program will grow or be tested. For a five-line one-off script it is overkill — but this project is the foundation for LUA103’s project and beyond.')),
    S('execution_flow',
      OL(
        ['Gelung utama membaca baris `"12 + 3"`.', 'The main loop reads the line `"12 + 3"`.'],
        ['`parse` memulangkan `12, "+", 3`.', '`parse` returns `12, "+", 3`.'],
        ['`compute` mencari `ops["+"]`, memanggilnya dan memulangkan 15.', '`compute` looks up `ops["+"]`, calls it and returns 15.'],
        ['`formatResult(15)` memulangkan `"15"`; gelung memaparkan `12 + 3 = 15`.', '`formatResult(15)` returns `"15"`; the loop displays `12 + 3 = 15`.'],
        ['Jika mana-mana langkah memulangkan `nil, mesej`, gelung memaparkan mesej itu dan terus ke baris seterusnya.', 'If any step returns `nil, message`, the loop displays that message and moves to the next line.'],
      )),
    S('memory_behaviour',
      P('Table `ops` dan fungsinya dicipta **sekali** semasa program bermula dan digunakan semula untuk setiap pengiraan. Setiap baris input mencipta beberapa string sementara (tangkapan `match`, teks hasil) yang menjadi sampah selepas baris itu diproses — pengutip sampah membersihkannya secara automatik. Program boleh memproses berjuta baris dengan memori yang tetap.',
        'The `ops` table and its functions are created **once** when the program starts and reused for every calculation. Each input line creates a few temporary strings (the `match` captures, the result text) that become garbage after the line is processed — the garbage collector cleans them up automatically. The program can process millions of lines with constant memory.')),
    S('alternative_implementations',
      P('Daripada format `nombor operator nombor` yang tetap, kalkulator boleh menilai ungkapan penuh dengan `load` — seperti `formula-table` dalam LUA101 3.1. Lebih berkuasa, tetapi kawalan ke atas mesej ralat dan operator yang dibenarkan lebih sukar:', 'Instead of a fixed `number operator number` format, a calculator could evaluate full expressions with `load` — like `formula-table` in LUA101 3.1. More powerful, but control over error messages and allowed operators is harder:'),
      CODE('load-alternative', 'lua', 'lua54', ['Alternatif: menilai dengan load', 'Alternative: evaluating with load'], `
local function evaluate(expr)
  local f = load("return " .. expr, "=calc", "t", {})
  if not f then return nil, "invalid expression" end
  local ok, result = pcall(f)
  if not ok then return nil, "cannot evaluate" end
  return result
end

print(evaluate("(2 + 3) * 4"), evaluate("2 +"))
`, '20\tnil\tinvalid expression'),
      EXPLAIN('load-alternative',
        ['1–7', 'Ungkapan dikompil dalam persekitaran kosong (tiada akses kepada fungsi) dan dijalankan dalam `pcall`.', 'The expression is compiled in an empty environment (no access to functions) and run inside `pcall`.'],
        ['9', 'Menyokong kurungan dan keutamaan secara percuma. Panggilan **pertama** (bukan terakhir dalam senarai argumen) dipotong kepada satu nilai (20); panggilan **terakhir** menyumbang kedua-dua nilai pulangannya (`nil` dan mesej) — peraturan nilai berbilang daripada kuliah 1.2.', 'Supports parentheses and precedence for free. The **first** call (not last in the argument list) is cut to one value (20); the **last** call contributes both its return values (`nil` and the message) — the multiple-value rule from lecture 1.2.']),
      P('Untuk projek ini kita memilih reka bentuk yang lebih ringkas dan terkawal; LUA103 akan meluaskannya.', 'For this project we choose the simpler, more controlled design; LUA103 will extend it.')),
    S('common_mistakes',
      UL(
        ['Mula mengekod sebelum menulis keperluan — dan menemui kes yang dilupakan (pembahagian sifar) selepas siap.', 'Starting to code before writing requirements — and discovering forgotten cases (division by zero) after finishing.'],
        ['Mencampurkan `print` dan `io.read` ke dalam fungsi pengiraan, menjadikannya mustahil untuk diuji.', 'Mixing `print` and `io.read` into calculation functions, making them impossible to test.'],
        ['Memanggil `ops[op](a, b)` tanpa menyemak `nil`.', 'Calling `ops[op](a, b)` without checking for `nil`.'],
        ['Menulis rantai `if/elseif` yang panjang untuk setiap operator.', 'Writing a long `if/elseif` chain for every operator.'],
      )),
    S('debugging',
      P('Dalam fasa reka bentuk, "debugging" bermaksud **menguji idea dengan kes kecil** sebelum keseluruhan program wujud. Panggil setiap fungsi terus dengan input yang baik dan buruk, seperti yang dilakukan oleh contoh-contoh di atas. Apabila fungsi gagal, mesejnya mesti memberitahu **input mana** yang menyebabkannya. Contoh berikut menunjukkan apa yang berlaku apabila hasil `parse` yang gagal digunakan tanpa semakan:',
        'In the design phase, "debugging" means **testing ideas with small cases** before the whole program exists. Call each function directly with good and bad input, as the examples above do. When a function fails, its message must say **which input** caused it. The following example shows what happens when a failed `parse` result is used without a check:'),
      CODE('pipeline', 'lua', 'lua54', ['Menyambungkan parse dan compute dengan semakan', 'Connecting parse and compute with checks'], `
local function parse(line)
  local l, op, r = line:match("^(%S+) (%S+) (%S+)$")
  return tonumber(l), op, tonumber(r)
end

local a, op, b = parse("6 * x")
if a and b then
  print(a * b)
else
  print("invalid input")
end
`, 'invalid input', {
        debug: BUG(`
local function parse(line)
  local l, op, r = line:match("^(%S+) (%S+) (%S+)$")
  return tonumber(l), op, tonumber(r)
end

local a, op, b = parse("6 * x")
print(a * b)
`, "example:7: attempt to perform arithmetic on a nil value (local 'b')",
          '`tonumber("x")` memulangkan `nil`, jadi `b` ialah `nil` dan pendaraban gagal jauh daripada tempat input sebenarnya diproses. Inilah sebabnya reka bentuk kita mewajibkan setiap fungsi memulangkan `(nil, mesej)` dan gelung utama menyemaknya: ralat dikesan pada sempadan, dengan mesej yang jelas.',
          '`tonumber("x")` returns `nil`, so `b` is `nil` and the multiplication fails far from where the input was actually processed. This is why our design requires every function to return `(nil, message)` and the main loop to check it: errors are caught at the boundary, with a clear message.'),
      }),
      EXPLAIN('pipeline',
        ['1–4', 'Versi `parse` yang ringkas tanpa mesej ralat — ia memulangkan `nil` untuk nombor tidak sah.', 'A simple `parse` without error messages — it returns `nil` for invalid numbers.'],
        ['6–11', 'Pemanggil menyemak kedua-dua operan sebelum mengira.', 'The caller checks both operands before computing.'])),
    S('performance',
      P('Carian dalam table penghantaran ialah satu carian hash — lebih pantas daripada rantai `if/elseif` yang panjang apabila terdapat banyak operator, dan tetap pantas tanpa mengira bilangan operator. Untuk kalkulator interaktif, prestasi tidak penting; kejelasan reka bentuk jauh lebih penting.',
        'A dispatch-table lookup is a single hash lookup — faster than a long `if/elseif` chain when there are many operators, and equally fast however many operators there are. For an interactive calculator, performance does not matter; clarity of design matters far more.')),
    S('software_engineering',
      P('Bandingkan reka bentuk monolitik dengan reka bentuk berasaskan fungsi:', 'Compare a monolithic design with a function-based design:'),
      CODE('poor-monolith', 'lua', 'lua54', ['Pelaksanaan lemah: satu blok besar', 'Poor implementation: one big block'], `
local line = "9 - 4"
local a, op, b = line:match("(%S+) (%S+) (%S+)")
a, b = tonumber(a), tonumber(b)
if op == "+" then print(a + b)
elseif op == "-" then print(a - b)
elseif op == "*" then print(a * b)
elseif op == "/" then print(a / b)
else print("unknown") end
`, '5'),
      EXPLAIN('poor-monolith',
        ['1–3', 'Huraian, penukaran dan pengiraan bercampur dalam satu tempat; tiada semakan nombor tidak sah.', 'Parsing, conversion and calculation are mixed in one place; there is no check for invalid numbers.'],
        ['4–8', 'Setiap operator memerlukan cabang baharu, dan setiap cabang mengulangi `print` — logik dan output terikat.', 'Every operator needs a new branch, and every branch repeats `print` — logic and output are tied together.']),
      CODE('improved-modular', 'lua', 'lua54', ['Pelaksanaan lebih baik: fungsi kecil dan table penghantaran', 'Improved implementation: small functions and a dispatch table'], `
local ops = {
  ["+"] = function(a, b) return a + b end,
  ["-"] = function(a, b) return a - b end,
}

local function calculate(line)
  local l, op, r = line:match("^(%S+) (%S+) (%S+)$")
  local a, b = tonumber(l), tonumber(r)
  if not (a and b) then return nil, "invalid number" end
  if not ops[op] then return nil, "unknown operator " .. op end
  return ops[op](a, b)
end

print(calculate("9 - 4"))
print(calculate("9 ^ 4"))
`, '5\nnil\tunknown operator ^'),
      EXPLAIN('improved-modular',
        ['1–4', 'Operasi sebagai data; menambah operator ialah satu baris.', 'Operations as data; adding an operator is one line.'],
        ['6–12', '`calculate` memulangkan hasil atau `(nil, mesej)` dan tidak mencetak apa-apa — ia boleh diuji.', '`calculate` returns a result or `(nil, message)` and prints nothing — it is testable.'],
        ['14–15', 'Pemanggil memutuskan cara memaparkan hasil.', 'The caller decides how to display the result.'])),
    S('industry_use_cases',
      UL(
        ['Penterjemah arahan (command interpreter) dalam permainan dan alat menggunakan table penghantaran: `commands[name](args)`.', 'Command interpreters in games and tools use dispatch tables: `commands[name](args)`.'],
        ['Pasukan perisian menulis dokumen keperluan dan kes ujian sebelum melaksanakan ciri.', 'Software teams write requirement documents and test cases before implementing features.'],
        ['Fungsi tulen (pure functions) memudahkan ujian automatik dalam CI.', 'Pure functions make automated testing in CI easy.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis tiga keperluan tambahan untuk kalkulator (contohnya nombor negatif, `quit`).', 'Write three extra requirements for the calculator (for example negative numbers, `quit`).'],
        ['Tambah operator `//` dan `%` pada `dispatch-table`.', 'Add the `//` and `%` operators to `dispatch-table`.'],
        ['Reka lima kes ujian untuk `parse` termasuk sekurang-kurangnya dua kes tidak sah.', 'Design five test cases for `parse` including at least two invalid ones.'],
      )),
    S('mini_project',
      P('**Spesifikasi sebagai data.** Tulis kes ujian reka bentuk sebagai table `{input, jangkaan}` dan semak bahawa `parse` dari contoh demonstrasi mengendalikan setiap satu dengan betul.', '**A specification as data.** Write the design test cases as a table of `{input, expectation}` and check that the demonstration `parse` handles each one correctly.'),
      CODE('design-cases', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function parse(line)
  local left, op, right = line:match("^%s*(%S+)%s+(%S+)%s+(%S+)%s*$")
  if not left then return nil, "shape" end
  local a, b = tonumber(left), tonumber(right)
  if not (a and b) then return nil, "number" end
  return a, op, b
end

local cases = {
  {"12 + 3", "ok"}, {" 1.5 * 2 ", "ok"}, {"one + 2", "number"}, {"5+5", "shape"}, {"", "shape"},
}

local passed = 0
for _, case in ipairs(cases) do
  local a, problem = parse(case[1])
  local got = a and "ok" or problem
  if got == case[2] then passed = passed + 1 else print("FAIL", case[1], got) end
end
print(passed .. "/" .. #cases .. " design cases pass")
`, '5/5 design cases pass'),
      EXPLAIN('design-cases',
        ['1–7', '`parse` yang dipermudahkan memulangkan nombor atau `nil` dan jenis masalah ("shape" atau "number").', 'A simplified `parse` returns numbers or `nil` and the kind of problem ("shape" or "number").'],
        ['9–11', 'Setiap kes: input dan keputusan yang dijangka. Spesifikasi ialah data yang boleh dibaca dan diuji.', 'Each case: an input and its expected outcome. The specification is data that can be read and tested.'],
        ['13–18', 'Bandingkan keputusan sebenar dengan jangkaan; cetak hanya kes yang gagal.', 'Compare the actual outcome with the expectation; print only failing cases.'],
        ['19', 'Ringkasan: semua lima kes lulus.', 'A summary: all five cases pass.'])),
    S('summary',
      UL(
        ['Tulis keperluan (fungsian dan ralat) sebelum mengekod.', 'Write requirements (functional and error) before coding.'],
        ['Pecahkan program kepada `parse`, `compute`, `formatResult` dan gelung utama.', 'Split the program into `parse`, `compute`, `formatResult` and a main loop.'],
        ['Table penghantaran menggantikan rantai `if/elseif` yang panjang.', 'A dispatch table replaces a long `if/elseif` chain.'],
        ['Fungsi tulen dengan kontrak `(nil, mesej)` mudah diuji.', 'Pure functions with a `(nil, message)` contract are easy to test.'],
      )),
    S('knowledge_check',
      OL(
        ['Senaraikan tiga keperluan ralat untuk kalkulator.', 'List three error requirements for the calculator.'],
        ['Mengapakah `compute` tidak sepatutnya memanggil `print`?', 'Why should `compute` not call `print`?'],
        ['Apakah kelebihan table penghantaran berbanding `if/elseif`?', 'What is the advantage of a dispatch table over `if/elseif`?'],
        ['Mengapakah mesej `field \'?\'` tidak membantu, dan bagaimana reka bentuk kita mengelakkannya?', 'Why is the message `field \'?\'` unhelpful, and how does our design avoid it?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual — string.match and patterns (§6.4.1)', url: `${MANUAL}#6.4.1` },
        { title: 'Programming in Lua (1st ed.) — 5 Functions', url: `${PIL}/5.html` },
        { title: 'Programming in Lua (1st ed.) — 20.2 Patterns', url: `${PIL}/20.2.html` },
        { title: 'Lua 5.4 Reference Manual §3.4.9 — Table Constructors', url: `${MANUAL}#3.4.9` },
      )),
  ],
};

// ─── 4.3 Building and testing the calculator ───────────────────────────────

export const LUA102_4_3: LectureContentDef = {
  courseCode: 'LUA102',
  module: 4,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Membina kalkulator lengkap berdasarkan reka bentuk kuliah 4.2.', 'Build the complete calculator from the lecture 4.2 design.'],
        ['Mengendalikan semua ralat yang dikenal pasti dalam keperluan tanpa menghentikan program.', 'Handle every error identified in the requirements without stopping the program.'],
        ['Menulis ujian automatik ringkas dengan pelari ujian buatan sendiri.', 'Write simple automated tests with a home-made test runner.'],
        ['Menggunakan ujian untuk mengesan pepijat regresi.', 'Use tests to catch regression bugs.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.2: reka bentuk kalkulator (`parse`, `compute`, `formatResult`, table penghantaran).', 'Lecture 4.2: the calculator design (`parse`, `compute`, `formatResult`, the dispatch table).'],
        ['LUA101 4.2: membaca baris dengan `io.read` sehingga input tamat.', 'LUA101 4.2: reading lines with `io.read` until input ends.'],
      )),
    S('introduction',
      P('Reka bentuk sudah siap; kini kita **membina** dan **menguji**. Kuliah ini menyusun fungsi-fungsi daripada kuliah 4.2 menjadi program lengkap dengan gelung input, arahan `quit`, statistik dan pengendalian ralat yang menyeluruh. Kemudian kita menulis **ujian automatik**: kod yang memanggil fungsi kalkulator dengan input yang diketahui dan menyemak hasilnya. Ujian membolehkan anda mengubah kod dengan yakin — jika anda memecahkan sesuatu, ujian memberitahu serta-merta.',
        'The design is finished; now we **build** and **test**. This lecture assembles the functions from lecture 4.2 into a complete program with an input loop, a `quit` command, statistics and thorough error handling. Then we write **automated tests**: code that calls the calculator functions with known input and checks the results. Tests let you change code with confidence — if you break something, the tests tell you immediately.'),
      KEY('Kod tanpa ujian ialah kod yang anda **harap** berfungsi. Kod dengan ujian ialah kod yang anda **tahu** berfungsi untuk kes yang diuji.', 'Untested code is code you **hope** works. Tested code is code you **know** works for the tested cases.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Pemasangan (integration):** menyambungkan fungsi-fungsi kecil yang sudah diuji menjadi program.', '**Integration:** connecting small, already-tested functions into a program.'],
        ['**Gelung utama:** baca baris → jika `quit`, berhenti → kira → paparkan hasil atau ralat → kemas kini statistik.', '**Main loop:** read a line → if `quit`, stop → compute → display the result or the error → update statistics.'],
        ['**Ujian unit:** menyemak satu fungsi dengan input dan output yang diketahui.', '**Unit test:** checks one function with known input and output.'],
        ['**Pepijat regresi:** sesuatu yang dahulu berfungsi tetapi rosak selepas perubahan — ujian menangkapnya.', '**Regression bug:** something that used to work but broke after a change — tests catch it.'],
        ['**Pelari ujian:** gelung yang menjalankan setiap kes, mengira lulus/gagal dan melaporkan kegagalan.', '**Test runner:** a loop that runs every case, counts passes and failures, and reports the failures.'],
      )),
    S('detailed_theory',
      P('Program interaktif sukar diuji secara manual: anda perlu menaip setiap kes setiap kali kod berubah. Kerana reka bentuk kita memisahkan **logik** (`calculate`) daripada **input/output** (gelung utama), logik boleh diuji secara automatik dengan memanggilnya terus. Setiap kes ujian ialah tiga perkara: input, hasil yang dijangka, dan perbandingan. Pelari ujian menjalankan semua kes dan melaporkan mana yang gagal, dengan mesej yang menyebut input, jangkaan dan hasil sebenar — maklumat yang cukup untuk membetulkan pepijat tanpa penyahpepijat.',
        'Interactive programs are hard to test by hand: you must type every case every time the code changes. Because our design separates **logic** (`calculate`) from **input/output** (the main loop), the logic can be tested automatically by calling it directly. Each test case is three things: an input, the expected result, and a comparison. The test runner runs every case and reports which failed, with a message naming the input, the expectation and the actual result — enough information to fix the bug without a debugger.'),
      P('Ujian yang baik merangkumi tiga kategori: **kes biasa** (12 + 3), **kes sempadan** (pembahagian dengan sifar, nombor negatif, float) dan **kes ralat** (input tidak sah, operator tidak dikenali). Pengaturcara profesional menulis ujian untuk setiap pepijat yang ditemui sebelum membetulkannya: ujian itu gagal dahulu, kemudian lulus selepas pembetulan, dan kekal untuk menghalang pepijat yang sama kembali. Dalam LUA211 anda akan menggunakan kerangka ujian sebenar (busted); prinsipnya sama.',
        'Good tests cover three categories: **normal cases** (12 + 3), **edge cases** (division by zero, negative numbers, floats) and **error cases** (invalid input, unknown operators). Professional programmers write a test for every bug they find before fixing it: the test fails first, then passes after the fix, and stays to stop the same bug coming back. In LUA211 you will use a real test framework (busted); the principles are the same.')),
    S('technical_terminology', TERMS('function', 'standard-input', 'stack-traceback', 'operator')),
    S('syntax_rules',
      UL(
        ['Kes ujian sebagai table: `{input = "12 + 3", expected = "15"}`.', 'Test cases as tables: `{input = "12 + 3", expected = "15"}`.'],
        ['`error(string.format("…", …), 0)` — laporan kegagalan ujian tanpa kedudukan.', '`error(string.format("…", …), 0)` — a test-failure report without a position.'],
        ['`line == "quit"` — arahan khas dikendalikan sebelum huraian.', '`line == "quit"` — special commands are handled before parsing.'],
      )),
    S('code_demonstration',
      CODE('calculator', 'lua', 'lua54', ['Kalkulator lengkap dengan gelung input', 'The complete calculator with an input loop'], `
local ops = {
  ["+"] = function(a, b) return a + b end,
  ["-"] = function(a, b) return a - b end,
  ["*"] = function(a, b) return a * b end,
  ["/"] = function(a, b) return a / b end,
  ["//"] = function(a, b) return a // b end,
  ["%"] = function(a, b) return a % b end,
  ["^"] = function(a, b) return a ^ b end,
}
local DIVIDES = {["/"] = true, ["//"] = true, ["%"] = true}

local function calculate(line)
  local l, op, r = line:match("^%s*(%S+)%s+(%S+)%s+(%S+)%s*$")
  if not l then return nil, "expected: number operator number" end
  local a, b = tonumber(l), tonumber(r)
  if not a then return nil, "not a number: " .. l end
  if not b then return nil, "not a number: " .. r end
  if not ops[op] then return nil, "unknown operator: " .. op end
  if DIVIDES[op] and b == 0 then return nil, "division by zero" end
  local x = ops[op](a, b)
  return math.tointeger(x) or x
end

local done, errors = 0, 0
while true do
  local line = io.read("l")
  if not line or line == "quit" then break end
  local result, err = calculate(line)
  if result then
    done = done + 1
    print(line .. " = " .. result)
  else
    errors = errors + 1
    print(line .. " -> error: " .. err)
  end
end
print(string.format("bye (%d calculations, %d errors)", done, errors))
`, '12 + 3 = 15\n10 / 4 = 2.5\n7 // 0 -> error: division by zero\n2 ^ 10 = 1024\nabc * 2 -> error: not a number: abc\n5 % 3 = 2\nbye (4 calculations, 2 errors)', {
        input: '12 + 3\n10 / 4\n7 // 0\n2 ^ 10\nabc * 2\n5 % 3\nquit\n2 + 2\n',
      }),
      EXPLAIN('calculator',
        ['1–9', 'Table penghantaran dengan **ketujuh-tujuh** operator aritmetik daripada modul 3.', 'The dispatch table with **all seven** arithmetic operators from module 3.'],
        ['10', 'Set operator yang membahagi — untuk semakan sifar.', 'The set of dividing operators — for the zero check.'],
        ['12–17', 'Huraian dan penukaran, seperti dalam reka bentuk 4.2, dengan mesej yang menyebut token yang salah.', 'Parsing and conversion, as in the 4.2 design, with messages naming the bad token.'],
        ['18–19', 'Operator tidak dikenali dan pembahagian dengan sifar dikesan **sebelum** pengiraan — keperluan ralat dipenuhi.', 'An unknown operator and division by zero are detected **before** computing — the error requirements are met.'],
        ['20–21', 'Kira, kemudian tukar float tanpa pecahan kepada integer (`1024.0` → `1024`); `or x` mengekalkan float lain.', 'Compute, then turn floats without a fraction into integers (`1024.0` → `1024`); `or x` keeps other floats.'],
        ['24–36', 'Gelung utama: berhenti pada `quit` atau akhir input; kira kejayaan dan ralat; papar setiap hasil. Baris selepas `quit` tidak diproses.', 'The main loop: stop at `quit` or end of input; count successes and errors; display each result. Lines after `quit` are not processed.'],
        ['37', 'Ringkasan sesi.', 'A session summary.'])),
    S('complete_examples',
      CODE('unit-tests', 'lua', 'lua54', ['Ujian automatik untuk calculate', 'Automated tests for calculate'], `
local ops = {
  ["+"] = function(a, b) return a + b end,
  ["-"] = function(a, b) return a - b end,
  ["/"] = function(a, b) return a / b end,
}
local function calculate(line)
  local l, op, r = line:match("^%s*(%S+)%s+(%S+)%s+(%S+)%s*$")
  local a, b = tonumber(l), tonumber(r)
  if not (a and b) then return nil, "invalid" end
  if not ops[op] then return nil, "unknown operator" end
  if op == "/" and b == 0 then return nil, "division by zero" end
  local x = ops[op](a, b)
  return math.tointeger(x) or x
end

local cases = {
  {"12 + 3", 15}, {"9 - 4", 5}, {"-2 - 3", -5}, {"7 / 2", 3.5},
  {"1 / 0", "division by zero"}, {"x + 1", "invalid"}, {"2 ? 3", "unknown operator"},
}

local passed = 0
for _, case in ipairs(cases) do
  local result, err = calculate(case[1])
  local got = result or err
  if got ~= case[2] then
    error(string.format("test failed: %s expected %s, got %s", case[1], tostring(case[2]), tostring(got)), 0)
  end
  passed = passed + 1
end
print(passed .. " tests passed")
`, '7 tests passed', {
        debug: BUG(`
local ops = {
  ["+"] = function(a, b) return a + b end,
  ["-"] = function(a, b) return b - a end,
  ["/"] = function(a, b) return a / b end,
}
local function calculate(line)
  local l, op, r = line:match("^%s*(%S+)%s+(%S+)%s+(%S+)%s*$")
  local a, b = tonumber(l), tonumber(r)
  if not (a and b) then return nil, "invalid" end
  if not ops[op] then return nil, "unknown operator" end
  if op == "/" and b == 0 then return nil, "division by zero" end
  local x = ops[op](a, b)
  return math.tointeger(x) or x
end

local cases = {
  {"12 + 3", 15}, {"9 - 4", 5}, {"-2 - 3", -5}, {"7 / 2", 3.5},
  {"1 / 0", "division by zero"}, {"x + 1", "invalid"}, {"2 ? 3", "unknown operator"},
}

local passed = 0
for _, case in ipairs(cases) do
  local result, err = calculate(case[1])
  local got = result or err
  if got ~= case[2] then
    error(string.format("test failed: %s expected %s, got %s", case[1], tostring(case[2]), tostring(got)), 0)
  end
  passed = passed + 1
end
print(passed .. " tests passed")
`, "test failed: 9 - 4 expected 5, got -5",
          'Seseorang "membetulkan" operator tolak dan menukar susunan operan (`b - a`). Program masih berjalan dan `12 + 3` masih betul, jadi pepijat ini mudah terlepas dalam ujian manual. Pelari ujian menangkapnya serta-merta dan mesej memberitahu **input** (`9 - 4`), **jangkaan** (5) dan **hasil sebenar** (−5). Inilah ujian regresi: ia menghalang pepijat lama kembali tanpa disedari. Ralat dibaling dengan tahap 0, jadi tiada awalan `example:` — mesej laporan ujian berdiri sendiri.',
          'Someone "fixed" the subtraction operator and swapped the operands (`b - a`). The program still runs and `12 + 3` is still right, so this bug is easy to miss in manual testing. The test runner catches it immediately, and the message gives the **input** (`9 - 4`), the **expectation** (5) and the **actual result** (−5). This is a regression test: it stops old bugs from returning unnoticed. The error is raised with level 0, so there is no `example:` prefix — a test-report message stands on its own.'),
      }),
      EXPLAIN('unit-tests',
        ['1–14', 'Versi `calculate` yang dipermudahkan (tiga operator) — fungsi yang diuji.', 'A simplified `calculate` (three operators) — the function under test.'],
        ['16–19', 'Tujuh kes: biasa, nombor negatif, hasil float, dan tiga kes ralat. Jangkaan boleh berupa nombor atau mesej ralat.', 'Seven cases: normal, negative numbers, a float result, and three error cases. An expectation can be a number or an error message.'],
        ['21–29', 'Untuk setiap kes, ambil hasil atau mesej ralat dan bandingkan dengan jangkaan. Kegagalan pertama menghentikan ujian dengan laporan yang terperinci.', 'For each case, take the result or the error message and compare it with the expectation. The first failure stops the tests with a detailed report.'],
        ['30', 'Semua lulus.', 'All pass.'])),
    S('line_by_line',
      EXPLAIN('calculator',
        ['21', '`math.tointeger(x) or x`: jika `x` ialah 1024.0, `math.tointeger` memberi 1024 (benar), jadi itu dipulangkan. Jika `x` ialah 2.5, ia memberi `nil`, jadi `or` memulangkan `x`. Satu baris melaksanakan peraturan paparan "tiada `.0` yang tidak perlu".', '`math.tointeger(x) or x`: if `x` is 1024.0, `math.tointeger` gives 1024 (truthy), so that is returned. If `x` is 2.5 it gives `nil`, so `or` returns `x`. One line implements the "no unnecessary `.0`" display rule.']),
      EXPLAIN('unit-tests',
        ['25', '`got ~= case[2]` berfungsi untuk nombor dan string kerana `~=` membandingkan sebarang dua nilai tanpa ralat. Perhatikan 3.5 (float) dan 15 (integer) dibandingkan mengikut nilai.', '`got ~= case[2]` works for numbers and strings because `~=` compares any two values without error. Note that 3.5 (float) and 15 (integer) compare by value.'])),
    S('why_this_way',
      P('Mengapa menyemak pembahagian dengan sifar **sebelum** mengira, sedangkan `/` sendiri memberi `inf` tanpa ralat? Kerana keperluan kita menyatakan pengguna mesti mendapat mesej yang jelas, bukan `inf` yang mengelirukan — dan `//` serta `%` dengan integer akan membaling ralat yang menghentikan program. Mengapa ujian automatik? Kerana kalkulator akan berubah (LUA103 menambah ciri), dan setiap perubahan berisiko memecahkan sesuatu yang dahulu berfungsi.',
        'Why check for division by zero **before** computing, when `/` itself gives `inf` without an error? Because our requirements say the user must get a clear message, not a confusing `inf` — and `//` and `%` with integers would raise an error that stops the program. Why automated tests? Because the calculator will change (LUA103 adds features), and every change risks breaking something that used to work.'),
      P('Tulis ujian **apabila** kod akan diubah atau digunakan semula, dan **sebelum** membetulkan pepijat yang dilaporkan. Jalankan semua ujian selepas setiap perubahan.', 'Write tests **when** code will be changed or reused, and **before** fixing a reported bug. Run all the tests after every change.')),
    S('execution_flow',
      OL(
        ['Program memuatkan `ops`, `DIVIDES` dan `calculate`, kemudian memasuki gelung utama.', 'The program loads `ops`, `DIVIDES` and `calculate`, then enters the main loop.'],
        ['Baris `7 // 0`: huraian dan penukaran berjaya; semakan `DIVIDES` mengesan sifar dan `calculate` memulangkan `nil, "division by zero"`.', 'The line `7 // 0`: parsing and conversion succeed; the `DIVIDES` check detects the zero and `calculate` returns `nil, "division by zero"`.'],
        ['Gelung memaparkan mesej ralat, menambah `errors` dan membaca baris seterusnya — program tidak berhenti.', 'The loop displays the error message, increments `errors` and reads the next line — the program does not stop.'],
        ['Pada `quit`, gelung tamat; baris `2 + 2` selepasnya tidak pernah dibaca.', 'At `quit` the loop ends; the `2 + 2` line after it is never read.'],
        ['Ringkasan sesi dicetak.', 'The session summary is printed.'],
      )),
    S('memory_behaviour',
      P('Kalkulator menggunakan memori tetap: `ops` dan fungsi dicipta sekali; setiap baris mencipta beberapa string sementara yang dikutip kemudian. Kiraan `done` dan `errors` ialah integer dalam daftar. Ujian mencipta table `cases` sekali; selepas ujian tamat, semuanya boleh dikutip. Tiada kebocoran memori walaupun kalkulator berjalan untuk sesi yang sangat panjang.',
        'The calculator uses constant memory: `ops` and its functions are created once; each line creates a few temporary strings that are collected later. The `done` and `errors` counters are integers in registers. The tests create the `cases` table once; after the tests finish, everything can be collected. There is no memory leak even if the calculator runs for a very long session.')),
    S('alternative_implementations',
      P('Daripada berhenti pada kegagalan pertama, pelari ujian boleh menjalankan **semua** kes dan melaporkan setiap kegagalan — berguna apabila beberapa ujian gagal serentak:', 'Instead of stopping at the first failure, a test runner can run **every** case and report each failure — useful when several tests fail at once:'),
      CODE('collect-failures', 'lua', 'lua54', ['Pelari ujian yang mengumpul kegagalan', 'A test runner that collects failures'], `
local function double(n) return n * 2 end

local cases = {{2, 4}, {0, 0}, {-3, -6}, {1.5, 3.0}}
local failures = {}
for _, c in ipairs(cases) do
  local got = double(c[1])
  if got ~= c[2] then failures[#failures + 1] = c[1] .. " -> " .. got end
end
print(#cases - #failures .. " passed, " .. #failures .. " failed")
`, '4 passed, 0 failed'),
      EXPLAIN('collect-failures',
        ['1', 'Fungsi kecil yang diuji.', 'A small function under test.'],
        ['3–8', 'Setiap kes dijalankan; kegagalan dikumpul dalam table dan bukannya menghentikan pelari.', 'Every case runs; failures are collected in a table instead of stopping the runner.'],
        ['9', 'Laporan akhir dengan kiraan lulus dan gagal.', 'A final report with pass and fail counts.'])),
    S('common_mistakes',
      UL(
        ['Hanya menguji "kes gembira" (12 + 3) dan melupakan kes sempadan dan ralat.', 'Testing only the "happy path" (12 + 3) and forgetting edge and error cases.'],
        ['Menulis ujian yang memanggil `print` dan memerlukan manusia membaca output.', 'Writing tests that call `print` and need a human to read the output.'],
        ['Menguji gelung utama secara manual sahaja — logik tidak dipisahkan, jadi tidak boleh diuji secara automatik.', 'Testing the main loop only by hand — the logic is not separated, so it cannot be tested automatically.'],
        ['Membetulkan pepijat tanpa menambah ujian — pepijat yang sama boleh kembali.', 'Fixing a bug without adding a test — the same bug can come back.'],
      )),
    S('debugging',
      P('Apabila ujian gagal, mesejnya ialah titik permulaan: input, jangkaan dan hasil sebenar. Ulang kes yang gagal secara berasingan, cetak nilai perantaraan, dan bandingkan dengan pengiraan tangan. Jika program sendiri ranap (bukannya melaporkan ralat), keperluan ralat belum dipenuhi — contoh berikut menunjukkan `calculate` tanpa semakan sifar, yang ranap dengan `//`:',
        'When a test fails, its message is the starting point: the input, the expectation and the actual result. Re-run the failing case on its own, print intermediate values, and compare with a hand calculation. If the program itself crashes (instead of reporting an error), an error requirement has not been met — the following example shows `calculate` without the zero check, crashing on `//`:'),
      CODE('zero-guard', 'lua', 'lua54', ['Pengawal pembahagian sifar', 'A division-by-zero guard'], `
local function divideWhole(a, b)
  if b == 0 then return nil, "division by zero" end
  return a // b
end

print(divideWhole(17, 5))
print(divideWhole(17, 0))
`, '3\nnil\tdivision by zero', {
        debug: BUG(`
local function divideWhole(a, b) return a // b end

print(divideWhole(17, 5))
print(divideWhole(17, 0))
`, "example:1: attempt to divide by zero",
          'Tanpa pengawal, `17 // 0` dengan dua integer membaling ralat (di dalam fungsi, baris 1) yang menghentikan seluruh kalkulator — melanggar keperluan "program tidak pernah berhenti secara tiba-tiba". Perhatikan panggilan pertama (`17 // 5`) berjaya dan mencetak 3 sebelum ralat; pepijat hanya muncul dengan input tertentu, itulah sebabnya kes sempadan mesti diuji.',
          'Without the guard, `17 // 0` with two integers raises an error (inside the function, line 1) that stops the whole calculator — violating the requirement "the program never stops abruptly". Notice the first call (`17 // 5`) succeeds and prints 3 before the error; the bug only appears with particular input, which is why edge cases must be tested.'),
      }),
      EXPLAIN('zero-guard',
        ['1–4', 'Pengawal memulangkan `(nil, mesej)` untuk pembahagi sifar sebelum `//` dilaksanakan.', 'The guard returns `(nil, message)` for a zero divisor before `//` runs.'],
        ['6–7', 'Kes biasa dan kes sempadan.', 'A normal case and an edge case.'])),
    S('performance',
      P('Ujian berjalan dalam milisaat, jadi menjalankannya selepas setiap perubahan tiada kos yang ketara. Kalkulator itu sendiri memproses beribu baris sesaat; kos utama ialah I/O, bukan aritmetik. Jangan optimumkan kalkulator — optimumkan kejelasan dan liputan ujiannya.',
        'Tests run in milliseconds, so running them after every change costs nothing noticeable. The calculator itself processes thousands of lines per second; the main cost is I/O, not arithmetic. Do not optimise the calculator — optimise its clarity and test coverage.')),
    S('software_engineering',
      P('Bandingkan kalkulator yang hanya diuji secara manual dengan kalkulator yang logiknya boleh diuji:', 'Compare a calculator tested only by hand with one whose logic is testable:'),
      CODE('poor-untestable', 'lua', 'lua54', ['Pelaksanaan lemah: logik di dalam gelung I/O', 'Poor implementation: logic inside the I/O loop'], `
while true do
  local line = io.read("l")
  if not line then break end
  local a, op, b = line:match("(%S+) (%S+) (%S+)")
  if op == "+" then print(a + b) end
end
`, '5', { input: '2 + 3\n' }),
      EXPLAIN('poor-untestable',
        ['1–6', 'Huraian, pengiraan dan output bercampur dalam gelung. Satu-satunya cara untuk mengujinya ialah menaip input dan membaca output. Ia juga bergantung pada coercion (`a + b` dengan string) dan tidak mengendalikan ralat.', 'Parsing, computing and output are mixed in the loop. The only way to test it is to type input and read output. It also relies on coercion (`a + b` with strings) and handles no errors.']),
      CODE('improved-testable', 'lua', 'lua54', ['Pelaksanaan lebih baik: logik tulen + gelung nipis', 'Improved implementation: pure logic + a thin loop'], `
local function add(line)
  local a, b = line:match("^(%S+) %+ (%S+)$")
  a, b = tonumber(a), tonumber(b)
  if not (a and b) then return nil, "invalid" end
  return a + b
end

assert(add("2 + 3") == 5 and add("x + 1") == nil, "add() is broken")

while true do
  local line = io.read("l")
  if not line then break end
  print(add(line) or "invalid")
end
`, '5\ninvalid', { input: '2 + 3\nx + 1\n' }),
      EXPLAIN('improved-testable',
        ['1–6', 'Logik dalam fungsi tulen: tiada I/O, penukaran eksplisit, kontrak `(nil, mesej)`. Dalam corak, `%+` ialah tanda tambah literal.', 'Logic in a pure function: no I/O, explicit conversion, a `(nil, message)` contract. In the pattern, `%+` is a literal plus sign.'],
        ['8', 'Ujian ringkas berjalan setiap kali program bermula — jika logik rosak, program enggan berjalan.', 'A tiny test runs every time the program starts — if the logic is broken, the program refuses to run.'],
        ['10–14', 'Gelung nipis hanya membaca dan memaparkan.', 'A thin loop that only reads and displays.'])),
    S('industry_use_cases',
      UL(
        ['Setiap projek perisian serius mempunyai ujian automatik yang dijalankan dalam CI pada setiap perubahan.', 'Every serious software project has automated tests that run in CI on every change.'],
        ['Kerangka ujian Lua seperti **busted** dan **luaunit** menyediakan pelari ujian, penegasan dan laporan.', 'Lua test frameworks such as **busted** and **luaunit** provide test runners, assertions and reports.'],
        ['Pembangunan Dipacu Ujian (TDD): tulis ujian yang gagal, laksanakan kod sehingga lulus, kemudian kemaskan.', 'Test-Driven Development (TDD): write a failing test, implement code until it passes, then refactor.'],
      )),
    S('practical_demonstration',
      OL(
        ['Simpan `calculator` sebagai `calc.lua` dan jalankan secara interaktif; cuba setiap operator dan setiap jenis ralat.', 'Save `calculator` as `calc.lua` and run it interactively; try every operator and every kind of error.'],
        ['Jalankan `lua calc.lua < sesi.txt` dengan fail input yang sama seperti panel Input.', 'Run `lua calc.lua < session.txt` with a file containing the same input as the Input panel.'],
        ['Jalankan versi berpepijat `unit-tests` dan baca laporan kegagalan.', 'Run the buggy `unit-tests` and read the failure report.'],
        ['Tambah tiga kes ujian baharu untuk `//` dan `%` dengan nombor negatif.', 'Add three new test cases for `//` and `%` with negative numbers.'],
      )),
    S('mini_project',
      P('**Sambungan: operator unari.** Tambah sokongan untuk `sqrt 16` dan `neg 5` (satu operator diikuti satu nombor), dengan ujian untuk kes yang sah dan tidak sah.', '**Extension: unary operators.** Add support for `sqrt 16` and `neg 5` (an operator followed by one number), with tests for valid and invalid cases.'),
      CODE('unary-extension', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local unary = {
  sqrt = function(x)
    if x < 0 then return nil, "sqrt of a negative number" end
    return math.sqrt(x)
  end,
  neg = function(x) return -x end,
}

local function calculateUnary(line)
  local name, arg = line:match("^(%a+)%s+(%S+)$")
  local x = tonumber(arg)
  if not (name and x) then return nil, "expected: name number" end
  if not unary[name] then return nil, "unknown function: " .. name end
  return unary[name](x)
end

for _, line in ipairs({"sqrt 16", "neg 5", "sqrt -4", "cos 1", "sqrt"}) do
  print(line, calculateUnary(line))
end
`, 'sqrt 16\t4.0\nneg 5\t-5\nsqrt -4\tnil\tsqrt of a negative number\ncos 1\tnil\tunknown function: cos\nsqrt\tnil\texpected: name number'),
      EXPLAIN('unary-extension',
        ['1–7', 'Table penghantaran kedua untuk fungsi satu argumen. `sqrt` menolak nombor negatif dengan mesej.', 'A second dispatch table for one-argument functions. `sqrt` rejects negative numbers with a message.'],
        ['9–15', 'Huraian `nama nombor`; `%a+` ialah satu atau lebih huruf. Kontrak `(nil, mesej)` yang sama seperti `calculate`.', 'Parse `name number`; `%a+` means one or more letters. The same `(nil, message)` contract as `calculate`.'],
        ['17–19', 'Uji kes sah, input negatif, fungsi tidak dikenali dan argumen yang hilang. `math.sqrt` sentiasa memberi float (4.0).', 'Test valid cases, a negative input, an unknown function and a missing argument. `math.sqrt` always gives a float (4.0).'])),
    S('summary',
      UL(
        ['Kalkulator lengkap menyambungkan `calculate` (logik tulen) dengan gelung I/O yang nipis.', 'The complete calculator connects `calculate` (pure logic) with a thin I/O loop.'],
        ['Semua keperluan ralat dikendalikan dengan `(nil, mesej)`; program tidak pernah ranap.', 'Every error requirement is handled with `(nil, message)`; the program never crashes.'],
        ['Ujian automatik merangkumi kes biasa, sempadan dan ralat.', 'Automated tests cover normal, edge and error cases.'],
        ['Ujian regresi menangkap pepijat yang dimasukkan semula oleh perubahan kemudian.', 'Regression tests catch bugs reintroduced by later changes.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah `calculate` menyemak pembahagi sifar walaupun `/` memberi `inf`?', 'Why does `calculate` check for a zero divisor even though `/` gives `inf`?'],
        ['Apakah tiga maklumat yang perlu ada dalam mesej kegagalan ujian?', 'Which three pieces of information must a test-failure message contain?'],
        ['Mengapakah memisahkan logik daripada I/O memudahkan ujian?', 'Why does separating logic from I/O make testing easier?'],
        ['Tulis satu kes ujian sempadan untuk operator `%`.', 'Write one edge-case test for the `%` operator.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §6.8 — Input and Output Facilities', url: `${MANUAL}#6.8` },
        { title: 'Lua 5.4 Reference Manual — assert and error', url: `${MANUAL}#pdf-assert` },
        { title: 'busted — Elegant Lua unit testing', url: 'https://lunarmodules.github.io/busted/' },
        { title: 'LuaUnit — documentation', url: 'https://luaunit.readthedocs.io/' },
      )),
  ],
};

export const LUA102_M4 = [LUA102_4_1, LUA102_4_2, LUA102_4_3];
