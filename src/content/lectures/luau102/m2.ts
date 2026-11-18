import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU102 · Module 2 — Value Types (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 2.1 nil, boolean, number and string ───────────────────────────────────

export const LUAU102_2_1: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 2,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan empat jenis asas: `nil`, `boolean`, `number` dan `string`.', 'Explain the four basic types: `nil`, `boolean`, `number` and `string`.'],
        ['Menerapkan peraturan [[truthiness]]: hanya `nil` dan `false` palsu.', 'Apply the [[truthiness]] rule: only `nil` and `false` are falsy.'],
        ['Menerangkan ketepatan nombor float 64-bit dan cara Luau mencetaknya.', 'Explain 64-bit float precision and how Luau prints numbers.'],
        ['Menggunakan string sebagai nilai tidak boleh ubah dengan kaedah `s:upper()`, `#s` dan lain-lain.', 'Use strings as immutable values with methods such as `s:upper()`, `#s` and others.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1: pemboleh ubah dan assignment.', 'Module 1: variables and assignment.'],
      )),
    S('introduction',
      P('Setiap nilai dalam Luau mempunyai jenis. Empat jenis yang paling asas muncul dalam hampir setiap baris kod permainan: `nil` (tiada nilai — pemain belum memilih pasukan), `boolean` (`true`/`false` — adakah pintu terbuka?), `number` (skor, kesihatan, masa) dan `string` (nama, mesej). Kuliah ini menerangkan setiap jenis dengan tepat, termasuk dua perkara yang sering mengejutkan pemula: bahawa `0` dan `""` adalah **benar** dalam syarat, dan bahawa `0.1 + 0.2` tidak sama dengan `0.3`.',
        'Every value in Luau has a type. The four most basic types appear in almost every line of game code: `nil` (no value — the player has not picked a team yet), `boolean` (`true`/`false` — is the door open?), `number` (scores, health, time) and `string` (names, messages). This lecture explains each type precisely, including two things that often surprise beginners: that `0` and `""` are **true** in conditions, and that `0.1 + 0.2` does not equal `0.3`.'),
      KEY('Hanya `nil` dan `false` palsu. `0`, `""` dan table kosong semuanya benar.', 'Only `nil` and `false` are falsy. `0`, `""` and empty tables are all truthy.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**nil:** ketiadaan nilai; medan atau pemboleh ubah yang tidak wujud.', '**nil:** the absence of a value; a field or variable that does not exist.'],
        ['**boolean:** `true` atau `false`; hasil perbandingan.', '**boolean:** `true` or `false`; the result of comparisons.'],
        ['**number:** float 64-bit; integer tepat sehingga 2⁵³; termasuk `inf` dan `nan`.', '**number:** a 64-bit float; integers exact up to 2⁵³; includes `inf` and `nan`.'],
        ['**string:** jujukan bait yang tidak boleh diubah; `#s` memberi bilangan bait, bukan aksara Unicode.', '**string:** an immutable sequence of bytes; `#s` gives the number of bytes, not Unicode characters.'],
      )),
    S('detailed_theory',
      P('Luau mewarisi model nombor Lua 5.1: satu jenis `number` yang sentiasa float 64-bit IEEE 754. Ini mempunyai dua akibat. Pertama, integer sehingga 2⁵³ (kira-kira 9 kuadrilion) diwakili dengan tepat, jadi skor dan wang dalam permainan selamat. Kedua, kebanyakan pecahan perpuluhan tidak boleh diwakili dengan tepat dalam binari, jadi `0.1 + 0.2` ialah `0.30000000000000004`. Luau mencetak nombor dengan **perwakilan terpendek yang tepat** — berbeza daripada Lua 5.4 yang membundarkan kepada 14 digit — jadi ralat kecil ini kelihatan. Bandingkan float dengan toleransi, bukan dengan `==`. Pembahagian dengan sifar tidak menimbulkan ralat: `1/0` ialah `inf`.',
        'Luau inherits Lua 5.1’s number model: a single `number` type that is always a 64-bit IEEE 754 float. This has two consequences. First, integers up to 2⁵³ (about 9 quadrillion) are represented exactly, so scores and in-game money are safe. Second, most decimal fractions cannot be represented exactly in binary, so `0.1 + 0.2` is `0.30000000000000004`. Luau prints numbers with the **shortest exact representation** — unlike Lua 5.4, which rounds to 14 digits — so this small error is visible. Compare floats with a tolerance, not with `==`. Division by zero raises no error: `1/0` is `inf`.'),
      P('String dalam Luau adalah **tidak boleh ubah**: setiap operasi seperti `s:upper()` atau `s .. "!"` mencipta string baharu, dan `s[1] = "H"` ialah ralat. String juga **di-intern**: dua string dengan kandungan yang sama ialah objek yang sama, jadi `==` antara string sangat pantas. Kaedah string dipanggil dengan `:` kerana setiap string berkongsi table `string` sebagai kaedahnya — `s:upper()` sama dengan `string.upper(s)`. Akhir sekali, truthiness: dalam `if x then`, hanya `nil` dan `false` dikira palsu. Pembangun daripada JavaScript atau Python sering menjangka `0` atau `""` palsu — dalam Luau, kedua-duanya benar.',
        'Strings in Luau are **immutable**: every operation such as `s:upper()` or `s .. "!"` creates a new string, and `s[1] = "H"` is an error. Strings are also **interned**: two strings with the same content are the same object, so `==` between strings is very fast. String methods are called with `:` because every string shares the `string` table as its methods — `s:upper()` is the same as `string.upper(s)`. Finally, truthiness: in `if x then`, only `nil` and `false` count as false. Developers coming from JavaScript or Python often expect `0` or `""` to be false — in Luau, both are true.')),
    S('technical_terminology', TERMS('nil', 'truthiness', 'number-subtype', 'escape-sequence')),
    S('syntax_rules',
      UL(
        ['Nombor: `42`, `3.14`, `1e6`, `0xFF`, `0b1010`, `1_000_000` (garis bawah sebagai pemisah, Luau).', 'Numbers: `42`, `3.14`, `1e6`, `0xFF`, `0b1010`, `1_000_000` (underscores as separators, Luau).'],
        ['String: `"…"`, `\'…\'`, `[[…]]`, dan `` `…` `` untuk interpolasi.', 'Strings: `"…"`, `\'…\'`, `[[…]]`, and `` `…` `` for interpolation.'],
        ['Kaedah string: `s:upper()`, `s:lower()`, `s:sub(i, j)`, `s:find(p)`, `s:rep(n)`, `#s`.', 'String methods: `s:upper()`, `s:lower()`, `s:sub(i, j)`, `s:find(p)`, `s:rep(n)`, `#s`.'],
      )),
    S('code_demonstration',
      CODE('basic-types', 'luau', 'luau', ['Empat jenis asas', 'The four basic types'], `
local team = nil
local doorOpen = false
local coins = 1_250
local playerName = "Aina"

print(typeof(team), typeof(doorOpen), typeof(coins), typeof(playerName))
print(coins / 4, 0xFF, 0b1010, 1e3)
print(playerName:upper(), #playerName, playerName:sub(1, 2))
`, 'nil\tboolean\tnumber\tstring\n312.5\t255\t10\t1000\nAINA\t4\tAi'),
      EXPLAIN('basic-types',
        ['1–4', 'Satu nilai bagi setiap jenis; `1_250` menggunakan pemisah garis bawah Luau.', 'One value of each type; `1_250` uses Luau’s underscore separator.'],
        ['6', '`typeof` memberi nama jenis.', '`typeof` gives the type name.'],
        ['7', 'Literal heksadesimal, binari (`0b`, Luau) dan eksponen.', 'Hexadecimal, binary (`0b`, Luau) and exponent literals.'],
        ['8', 'Kaedah string dipanggil dengan `:`; `sub(1, 2)` mengambil aksara 1 hingga 2.', 'String methods are called with `:`; `sub(1, 2)` takes characters 1 to 2.'])),
    S('complete_examples',
      CODE('truthiness-luau', 'luau', 'luau', ['Truthiness dalam syarat', 'Truthiness in conditions'], `
local values = {0, "", false, "no", nil}
local labels = {"0", '""', "false", '"no"', "nil"}

for i = 1, 5 do
  local verdict = if values[i] then "truthy" else "falsy"
  print(labels[i], verdict)
end
`, '0\ttruthy\n""\ttruthy\nfalse\tfalsy\n"no"\ttruthy\nnil\tfalsy', {
        debug: BUG(`
local input = "abc"
local bonus = input + 10
print(bonus)
`, 'example:2: attempt to perform arithmetic (add) on string and number',
          'Luau menukar string kepada nombor secara automatik dalam aritmetik hanya jika string itu kelihatan seperti nombor (`"5" + 3` memberi 8). "abc" tidak boleh ditukar, jadi penambahan gagal dan Luau menyebut kedua-dua jenis. Tukar secara eksplisit dengan `tonumber` dan semak `nil` sebelum aritmetik.',
          'Luau converts strings to numbers automatically in arithmetic only when the string looks like a number (`"5" + 3` gives 8). "abc" cannot be converted, so the addition fails and Luau names both types. Convert explicitly with `tonumber` and check for `nil` before the arithmetic.'),
      }),
      EXPLAIN('truthiness-luau',
        ['1–2', 'Lima nilai dan labelnya; perhatikan table berakhir dengan `nil`, jadi kita menggunakan `for i = 1, 5` dan bukan `#values`.', 'Five values and their labels; note the table ends with `nil`, so we use `for i = 1, 5` instead of `#values`.'],
        ['4–7', 'If-expression menguji truthiness setiap nilai. Hanya `false` dan `nil` palsu.', 'An if-expression tests each value’s truthiness. Only `false` and `nil` are falsy.']),
      CODE('float-precision', 'luau', 'luau', ['Ketepatan float', 'Float precision'], `
local a = 0.1 + 0.2
print(a)
print(a == 0.3)
print(math.abs(a - 0.3) < 1e-9)
print(2^53, 2^53 + 1 == 2^53)
print(1 / 0, -1 / 0)
`, '0.30000000000000004\nfalse\ntrue\n9007199254740992\ttrue\ninf\t-inf', {
        debug: BUG(`
local greeting = "hi"
greeting[1] = "H"
`, 'example:2: attempt to index string with number',
          'String tidak boleh diubah: anda tidak boleh menetapkan aksara individu. Luau melaporkannya sebagai cubaan mengindeks string dengan nombor. Cipta string baharu sebaliknya: `greeting = "H" .. greeting:sub(2)`.',
          'Strings are immutable: you cannot assign individual characters. Luau reports this as an attempt to index a string with a number. Create a new string instead: `greeting = "H" .. greeting:sub(2)`.'),
      }),
      EXPLAIN('float-precision',
        ['1–2', 'Luau mencetak perwakilan terpendek yang tepat, jadi ralat binari kelihatan.', 'Luau prints the shortest exact representation, so the binary error is visible.'],
        ['3–4', '`==` gagal; perbandingan dengan toleransi kecil berjaya.', '`==` fails; a comparison with a small tolerance succeeds.'],
        ['5', 'Di atas 2⁵³, integer berturutan tidak boleh dibezakan.', 'Above 2⁵³, consecutive integers cannot be distinguished.'],
        ['6', 'Pembahagian dengan sifar memberi infiniti — bukan ralat.', 'Division by zero gives infinity — not an error.'])),
    S('line_by_line',
      EXPLAIN('float-precision',
        ['4', '`1e-9` ialah toleransi yang biasa untuk nilai sekitar 1. Untuk wang, simpan sen sebagai integer (contohnya 1250 sen) dan elakkan pecahan sama sekali.', '`1e-9` is a common tolerance for values around 1. For money, store cents as integers (for example 1250 cents) and avoid fractions altogether.']),
      EXPLAIN('basic-types',
        ['8', '`#playerName` mengira **bait**. Untuk nama dengan aksara bukan ASCII (contohnya "Zoë"), gunakan `utf8.len` untuk mengira aksara.', '`#playerName` counts **bytes**. For names with non-ASCII characters (for example "Zoë"), use `utf8.len` to count characters.'])),
    S('why_this_way',
      P('Mengapa satu jenis nombor? Kesederhanaan dan keserasian dengan Lua 5.1: pemula tidak perlu memikirkan integer berbanding float, dan float 64-bit cukup tepat untuk hampir semua kegunaan permainan. Mengapa truthiness yang ketat? Supaya `0` (skor yang sah) tidak pernah dianggap "tiada nilai" secara tidak sengaja.',
        'Why one number type? Simplicity and Lua 5.1 compatibility: beginners need not think about integers versus floats, and 64-bit floats are precise enough for almost every game use. Why strict truthiness? So that `0` (a valid score) is never accidentally treated as "no value".'),
      P('Gunakan `nil` **apabila** sesuatu benar-benar tiada; `false` **apabila** jawapannya ialah "tidak"; jangan gunakan `0` atau `""` untuk bermaksud "tiada".', 'Use `nil` **when** something is genuinely absent; `false` **when** the answer is "no"; do not use `0` or `""` to mean "nothing".')),
    S('execution_flow',
      OL(
        ['`truthiness-luau`, pusingan 1: `values[1]` ialah 0 → benar → "truthy".', '`truthiness-luau`, pass 1: `values[1]` is 0 → truthy → "truthy".'],
        ['Pusingan 3: `false` → "falsy".', 'Pass 3: `false` → "falsy".'],
        ['Pusingan 5: `values[5]` ialah `nil` (tidak disimpan) → "falsy".', 'Pass 5: `values[5]` is `nil` (not stored) → "falsy".'],
      )),
    S('memory_behaviour',
      P('`nil`, boolean dan nombor disimpan terus dalam slot nilai — tiada peruntukan heap. String diperuntukkan pada heap dan di-intern: string pendek yang sama dikongsi, jadi menyimpan "sword" seribu kali dalam table menggunakan satu salinan. Membina string dalam gelung (`s = s .. x`) mencipta banyak string perantaraan; gunakan `table.concat` untuk bilangan besar.',
        '`nil`, booleans and numbers are stored directly in a value slot — no heap allocation. Strings are allocated on the heap and interned: identical short strings are shared, so storing "sword" a thousand times in a table uses one copy. Building a string in a loop (`s = s .. x`) creates many intermediate strings; use `table.concat` for large counts.')),
    S('alternative_implementations',
      P('Untuk wang dalam permainan, simpan unit terkecil sebagai integer dan format hanya semasa memaparkan:', 'For in-game money, store the smallest unit as an integer and format only when displaying:'),
      CODE('cents-not-floats', 'luau', 'luau', ['Wang sebagai integer sen', 'Money as integer cents'], `
local priceCents = 199
local quantity = 3
local totalCents = priceCents * quantity

print(totalCents)
print(string.format("RM %d.%02d", totalCents // 100, totalCents % 100))
`, '597\nRM 5.97'),
      EXPLAIN('cents-not-floats',
        ['1–3', 'Semua pengiraan dalam integer — tiada ralat pembundaran float.', 'All calculations in integers — no float rounding error.'],
        ['5–6', 'Hanya paparan menggunakan pemformatan: ringgit dengan `//`, sen dengan `%` dan `%02d` (dua digit).', 'Only the display uses formatting: ringgit with `//`, cents with `%` and `%02d` (two digits).'])),
    S('common_mistakes',
      UL(
        ['Menjangka `0` atau `""` palsu dalam `if`.', 'Expecting `0` or `""` to be falsy in an `if`.'],
        ['Membandingkan float dengan `==`.', 'Comparing floats with `==`.'],
        ['Cuba mengubah aksara dalam string.', 'Trying to change a character in a string.'],
        ['Menggunakan `#s` untuk mengira aksara dalam teks Unicode.', 'Using `#s` to count characters in Unicode text.'],
      )),
    S('debugging',
      P('Apabila syarat berkelakuan pelik, cetak nilai **dan jenisnya**: `print(x, typeof(x))`. Nilai "5" (string) dan 5 (nombor) kelihatan sama dalam output, tetapi berkelakuan berbeza dalam perbandingan. Apabila jumlah wang atau skor kelihatan sedikit salah (contohnya 4.999999), puncanya ialah float — gunakan integer atau bundarkan semasa paparan. Contoh berikut menunjukkan pengesan jenis yang membantu penyahpepijatan:',
        'When a condition behaves oddly, print the value **and its type**: `print(x, typeof(x))`. The value "5" (a string) and 5 (a number) look the same in output but behave differently in comparisons. When a money or score total looks slightly wrong (for example 4.999999), the cause is floats — use integers or round when displaying. The following example shows a type inspector that helps debugging:'),
      CODE('inspect-values', 'luau', 'luau', ['Memeriksa nilai dan jenis', 'Inspecting values and types'], `
local function inspect(label: string, value)
  print(\`{label} = {value} ({typeof(value)})\`)
end

inspect("savedScore", "120")
inspect("bonus", 30)
inspect("sum", tonumber("120") + 30)
`, 'savedScore = 120 (string)\nbonus = 30 (number)\nsum = 150 (number)'),
      EXPLAIN('inspect-values',
        ['1–3', 'Cetak label, nilai dan jenis bersama.', 'Print the label, value and type together.'],
        ['5–7', '"120" dan 30 kelihatan serupa tanpa jenis; selepas `tonumber`, penambahan selamat.', '"120" and 30 look alike without the type; after `tonumber`, the addition is safe.'])),
    S('performance',
      P('Operasi nombor ialah yang terpantas dalam Luau. Perbandingan string adalah pantas kerana string di-intern (perbandingan rujukan), tetapi mencipta string baharu (penggabungan, `upper`, `sub`) memerlukan peruntukan. Dalam gelung panas, elakkan membina string yang tidak diperlukan.',
        'Number operations are the fastest in Luau. String comparison is fast because strings are interned (a reference comparison), but creating new strings (concatenation, `upper`, `sub`) needs an allocation. In hot loops, avoid building strings you do not need.')),
    S('software_engineering',
      P('Menggunakan nilai "ajaib" untuk ketiadaan berbanding `nil`:', 'Using a "magic" value for absence versus `nil`:'),
      CODE('poor-magic-zero', 'luau', 'luau', ['Pelaksanaan lemah: 0 bermaksud "tiada"', 'Poor implementation: 0 means "none"'], `
local bestTime = 0

local function recordTime(seconds: number)
  if bestTime == 0 or seconds < bestTime then
    bestTime = seconds
  end
end

recordTime(42)
recordTime(0)
recordTime(35)
print(bestTime)
`, '35'),
      EXPLAIN('poor-magic-zero',
        ['1–7', '`0` digunakan untuk bermaksud "belum ada masa". Tetapi masa 0 (larian sempurna) juga sah!', '`0` is used to mean "no time yet". But a time of 0 (a perfect run) is also valid!'],
        ['9–12', 'Selepas larian 0, `bestTime == 0` dianggap "tiada", jadi 35 menggantikannya — rekod terbaik hilang.', 'After the 0 run, `bestTime == 0` is treated as "none", so 35 replaces it — the best record is lost.']),
      CODE('improved-nil-absent', 'luau', 'luau', ['Pelaksanaan lebih baik: nil bermaksud "tiada"', 'Improved implementation: nil means "none"'], `
local bestTime: number? = nil

local function recordTime(seconds: number)
  if bestTime == nil or seconds < bestTime then
    bestTime = seconds
  end
end

recordTime(42)
recordTime(0)
recordTime(35)
print(bestTime)
`, '0'),
      EXPLAIN('improved-nil-absent',
        ['1', '`number?` — anotasi untuk "nombor atau nil".', '`number?` — an annotation for "a number or nil".'],
        ['3–7', '`nil` hanya bermaksud "tiada lagi"; 0 dirawat sebagai masa sebenar.', '`nil` only means "none yet"; 0 is treated as a real time.'],
        ['9–12', 'Rekod 0 disimpan dengan betul.', 'The 0 record is kept correctly.'])),
    S('industry_use_cases',
      UL(
        ['Sistem ekonomi Roblox menyimpan mata wang sebagai integer untuk mengelak ralat float.', 'Roblox economy systems store currency as integers to avoid float errors.'],
        ['Data pemain yang dimuatkan menggunakan `nil` untuk medan yang belum wujud dalam versi lama data.', 'Loaded player data uses `nil` for fields that did not exist in older data versions.'],
        ['Fizik dan pergerakan menggunakan perbandingan dengan toleransi untuk kedudukan float.', 'Physics and movement code compares float positions with a tolerance.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah `{}` pada `truthiness-luau` (dengan labelnya) dan ramalkan keputusan.', 'Add `{}` to `truthiness-luau` (with its label) and predict the verdict.'],
        ['Kira `0.1 * 3` dan bandingkan dengan `0.3` menggunakan toleransi.', 'Compute `0.1 * 3` and compare it with `0.3` using a tolerance.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Profil pemain yang selamat jenis.** Tulis fungsi yang menerima data profil mentah (sesetengah medan mungkin string atau tiada) dan memulangkan profil bersih dengan jenis yang betul dan lalai.', '**A type-safe player profile.** Write a function that takes raw profile data (some fields may be strings or missing) and returns a clean profile with correct types and defaults.'),
      CODE('clean-profile', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function cleanProfile(raw)
  return {
    name = if typeof(raw.name) == "string" and raw.name ~= "" then raw.name else "Guest",
    level = tonumber(raw.level) or 1,
    isVip = raw.isVip == true,
    coins = math.max(tonumber(raw.coins) or 0, 0),
  }
end

local p = cleanProfile({name = "", level = "7", isVip = "yes", coins = -50})
print(p.name, p.level, p.isVip, p.coins)
print(typeof(p.level), typeof(p.isVip))
`, 'Guest\t7\tfalse\t0\nnumber\tboolean'),
      EXPLAIN('clean-profile',
        ['1–8', 'Setiap medan dibersihkan: nama mesti string bukan kosong; tahap ditukar dengan `tonumber`; VIP hanya jika benar-benar `true`; syiling tidak negatif.', 'Each field is cleaned: the name must be a non-empty string; the level is converted with `tonumber`; VIP only if exactly `true`; coins never negative.'],
        ['10–12', 'Data mentah yang buruk menghasilkan profil yang sah dengan jenis yang betul. Perhatikan `"yes"` tidak dikira sebagai `true`.', 'Bad raw data produces a valid profile with correct types. Note that `"yes"` does not count as `true`.'])),
    S('summary',
      UL(
        ['Empat jenis asas: `nil`, `boolean`, `number` (float 64-bit), `string` (tidak boleh ubah).', 'Four basic types: `nil`, `boolean`, `number` (64-bit float), `string` (immutable).'],
        ['Hanya `nil` dan `false` palsu.', 'Only `nil` and `false` are falsy.'],
        ['Luau mencetak nombor dengan tepat — ralat float kelihatan; bandingkan dengan toleransi.', 'Luau prints numbers exactly — float errors are visible; compare with a tolerance.'],
        ['Gunakan `nil` untuk "tiada", bukan `0` atau `""`.', 'Use `nil` for "none", not `0` or `""`.'],
      )),
    S('knowledge_check',
      OL(
        ['Adakah `if 0 then print("yes") end` mencetak sesuatu?', 'Does `if 0 then print("yes") end` print anything?'],
        ['Mengapakah Luau mencetak `0.30000000000000004` tetapi Lua 5.4 mencetak `0.3`?', 'Why does Luau print `0.30000000000000004` while Lua 5.4 prints `0.3`?'],
        ['Apakah `1 / 0` dalam Luau?', 'What is `1 / 0` in Luau?'],
        ['Bagaimanakah anda menukar huruf pertama string kepada huruf besar?', 'How do you change the first letter of a string to upper case?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library (string)', url: `${LUAU}/library#string-library` },
        { title: 'Roblox Creator Hub — Data types (numbers, strings, booleans)', url: `${DOCS}/luau/numbers` },
        { title: 'What Every Programmer Should Know About Floating-Point Arithmetic', url: 'https://floating-point-gui.de/' },
        { title: 'Luau — Syntax (number literals)', url: `${LUAU}/syntax` },
      )),
  ],
};

// ─── 2.2 type() versus typeof() ────────────────────────────────────────────

export const LUAU102_2_2: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 2,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menyenaraikan jenis nilai Luau: nil, boolean, number, string, table, function, thread, userdata, vector, buffer.', 'List Luau’s value types: nil, boolean, number, string, table, function, thread, userdata, vector, buffer.'],
        ['Membezakan `type()` dan [[typeof-function|`typeof()`]] dan bila setiap satu digunakan.', 'Distinguish `type()` and [[typeof-function|`typeof()`]] and when each is used.'],
        ['Menulis semakan jenis untuk mengesahkan input fungsi.', 'Write type checks to validate function inputs.'],
        ['Membezakan semakan jenis runtime (`typeof`) dan anotasi jenis statik.', 'Distinguish run-time type checks (`typeof`) from static type annotations.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1: jenis asas.', 'Lecture 2.1: the basic types.'],
      )),
    S('introduction',
      P('Luau mempunyai dua fungsi untuk bertanya "apakah jenis nilai ini?". `type()` datang daripada Lua dan mengenali jenis asas bahasa. `typeof()` ditambah oleh Roblox: untuk nilai biasa ia memberi jawapan yang sama, tetapi untuk objek enjin Roblox ia memberi nama jenis sebenar — `"Vector3"`, `"CFrame"`, `"Instance"` — dan bukannya `"userdata"` yang umum. Kerana kod Roblox sentiasa berurusan dengan objek enjin, `typeof` ialah pilihan lalai dalam Luau moden. Kuliah ini menerangkan kedua-duanya dan cara menggunakannya untuk menulis fungsi yang menolak input yang salah dengan mesej yang jelas.',
        'Luau has two functions for asking "what type is this value?". `type()` comes from Lua and recognises the language’s basic types. `typeof()` was added by Roblox: for ordinary values it gives the same answer, but for Roblox engine objects it gives the real type name — `"Vector3"`, `"CFrame"`, `"Instance"` — instead of the generic `"userdata"`. Because Roblox code constantly deals with engine objects, `typeof` is the default choice in modern Luau. This lecture explains both and how to use them to write functions that reject wrong input with clear messages.'),
      KEY('Gunakan `typeof` dalam kod Luau/Roblox. `type` hanya membezakan jenis asas.', 'Use `typeof` in Luau/Roblox code. `type` only distinguishes basic types.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['Jenis bahasa Luau: `nil`, `boolean`, `number`, `string`, `table`, `function`, `thread`, `userdata`, `vector`, `buffer`.', 'Luau language types: `nil`, `boolean`, `number`, `string`, `table`, `function`, `thread`, `userdata`, `vector`, `buffer`.'],
        ['`type(x)` dan `typeof(x)` memberi hasil yang sama untuk semua jenis ini di luar Roblox.', '`type(x)` and `typeof(x)` give the same result for all these types outside Roblox.'],
        ['Dalam Roblox: `type(Vector3.new())` → "userdata"; `typeof(Vector3.new())` → "Vector3".', 'In Roblox: `type(Vector3.new())` → "userdata"; `typeof(Vector3.new())` → "Vector3".'],
        ['Hasil ialah **string** — bandingkan dengan petikan: `typeof(x) == "number"`.', 'The result is a **string** — compare with quotes: `typeof(x) == "number"`.'],
        ['Semakan runtime (`typeof`) berbeza daripada anotasi (`x: number`), yang hanya disemak oleh penganalisis.', 'Run-time checks (`typeof`) differ from annotations (`x: number`), which only the analyser checks.'],
      )),
    S('detailed_theory',
      P('Dalam pelaksanaan Lua, objek yang dicipta oleh kod C/C++ hos — fail, soket, objek enjin — semuanya berjenis `userdata`: "data pengguna yang Lua tidak faham". `type()` hanya melihat lapisan ini. Roblox mendedahkan ratusan jenis enjin (Vector3, CFrame, Color3, Instance, RBXScriptSignal…) sebagai userdata, jadi `type()` tidak dapat membezakannya. `typeof()` menyemak metatable dalaman objek dan memulangkan nama jenis enjin yang sebenar. Untuk jenis bahasa asas, termasuk `vector` dan `buffer` yang ditambah oleh Luau, kedua-dua fungsi memberi nama yang sama.',
        'In Lua implementations, objects created by the host’s C/C++ code — files, sockets, engine objects — all have type `userdata`: "user data that Lua does not understand". `type()` only sees this layer. Roblox exposes hundreds of engine types (Vector3, CFrame, Color3, Instance, RBXScriptSignal…) as userdata, so `type()` cannot tell them apart. `typeof()` checks the object’s internal metatable and returns the real engine type name. For the basic language types, including `vector` and `buffer` added by Luau, both functions give the same name.'),
      P('Semakan jenis runtime ialah cara untuk membuat fungsi **mempertahankan diri**: ia menolak input yang salah dengan mesej yang menyebut jenis yang dijangka dan yang diterima, dan bukannya gagal kemudian dengan ralat yang samar. Ini penting terutamanya untuk data yang datang dari luar — input pemain, data yang dimuatkan, mesej rangkaian — kerana anotasi jenis tidak melindunginya semasa runtime. Anotasi `level: number` memberitahu penganalisis apa yang anda **jangka**; `typeof(level) == "number"` menyemak apa yang anda **dapat**. Kod yang kukuh menggunakan kedua-duanya: anotasi untuk ralat pengaturcara, semakan runtime untuk data luar.',
        'Run-time type checks are a way to make functions **defend themselves**: they reject wrong input with a message naming the expected and received types, instead of failing later with a vague error. This matters especially for data coming from outside — player input, loaded data, network messages — because type annotations do not protect it at run time. The annotation `level: number` tells the analyser what you **expect**; `typeof(level) == "number"` checks what you **got**. Robust code uses both: annotations for programmer mistakes, run-time checks for external data.')),
    S('technical_terminology', TERMS('typeof-function', 'userdata', 'type-annotation', 'nil')),
    S('syntax_rules',
      UL(
        ['`typeof(nilai)` → string seperti "number", "table", "vector".', '`typeof(value)` → a string such as "number", "table", "vector".'],
        ['Semakan: `if typeof(x) ~= "number" then error(\`…\`, 2) end`.', 'Check: `if typeof(x) ~= "number" then error(\`…\`, 2) end`.'],
        ['`typeof()` tanpa argumen ialah ralat; `typeof(nil)` ialah "nil".', '`typeof()` with no argument is an error; `typeof(nil)` is "nil".'],
      )),
    S('code_demonstration',
      CODE('all-types', 'luau', 'luau', ['Setiap jenis bahasa Luau', 'Every Luau language type'], `
local samples = {
  42, "text", true, {}, print,
  coroutine.create(function() end),
  vector.create(1, 2, 3), buffer.create(4),
}

for _, value in samples do
  print(type(value), typeof(value))
end
print(type(nil), typeof(nil))
`, 'number\tnumber\nstring\tstring\nboolean\tboolean\ntable\ttable\nfunction\tfunction\nthread\tthread\nvector\tvector\nbuffer\tbuffer\nnil\tnil'),
      EXPLAIN('all-types',
        ['1–5', 'Satu sampel bagi setiap jenis kecuali `nil` dan `userdata` (`nil` tidak boleh disimpan dalam senarai).', 'One sample of each type except `nil` and `userdata` (`nil` cannot be stored in a list).'],
        ['7–9', 'Di luar Roblox, `type` dan `typeof` bersetuju untuk setiap jenis bahasa.', 'Outside Roblox, `type` and `typeof` agree for every language type.'],
        ['10', '`nil` diuji secara berasingan.', '`nil` is tested separately.'])),
    S('complete_examples',
      CODE('validate-input', 'luau', 'luau', ['Fungsi yang mengesahkan jenis', 'A function that validates types'], `
local function setWalkSpeed(speed)
  if typeof(speed) ~= "number" then
    return nil, \`speed must be a number, got {typeof(speed)}\`
  end
  return math.clamp(speed, 0, 50)
end

print(setWalkSpeed(16))
print(setWalkSpeed(100))
print(setWalkSpeed("fast"))
print(setWalkSpeed(nil))
`, '16\n50\nnil\tspeed must be a number, got string\nnil\tspeed must be a number, got nil', {
        debug: BUG(`
local function setWalkSpeed(speed)
  if typeof(speed) ~= number then
    return nil, "speed must be a number"
  end
  return speed
end
local result = setWalkSpeed(16)
print(result + 1)
`, 'example:8: attempt to perform arithmetic (add) on nil and number',
          'Petikan tertinggal: `number` tanpa petikan ialah **global** `nil`, jadi syarat menjadi `typeof(speed) ~= nil` — sentiasa benar — dan setiap input ditolak, termasuk 16. Fungsi memulangkan `nil`, dan ralat muncul kemudian pada baris 8. `typeof` memulangkan string; bandingkan dengan `"number"`.',
          'The quotes are missing: `number` without quotes is a `nil` **global**, so the condition becomes `typeof(speed) ~= nil` — always true — and every input is rejected, including 16. The function returns `nil`, and the error appears later on line 8. `typeof` returns a string; compare with `"number"`.'),
      }),
      EXPLAIN('validate-input',
        ['1–4', 'Tolak bukan nombor dengan mesej yang menyebut jenis sebenar.', 'Reject non-numbers with a message naming the actual type.'],
        ['5', 'Hadkan julat yang sah.', 'Clamp to the valid range.'],
        ['8–11', 'Nombor sah, nombor terlalu besar (dihadkan), string dan `nil`.', 'A valid number, a number too large (clamped), a string and `nil`.']),
      CODE('type-dispatch', 'luau', 'luau', ['Bertindak mengikut jenis', 'Acting by type'], `
local function describe(value): string
  local t = typeof(value)
  if t == "number" then
    return \`number {value}\`
  elseif t == "string" then
    return \`text "{value}" ({#value} bytes)\`
  elseif t == "table" then
    return \`table with {#value} items\`
  elseif t == "vector" then
    return \`vector of length {vector.magnitude(value)}\`
  end
  return t
end

for _, v in {7, "hi", {1, 2, 3}, vector.create(0, 3, 4), true} do
  print(describe(v))
end
`, 'number 7\ntext "hi" (2 bytes)\ntable with 3 items\nvector of length 5\nboolean', {
        debug: BUG(`
print(typeof())
`, 'example:1: missing argument #1',
          '`typeof` memerlukan tepat satu argumen. Memanggilnya tanpa argumen ialah ralat (berbeza daripada `typeof(nil)`, yang sah dan memberi "nil"). Kesilapan ini biasa apabila pemboleh ubah yang dihantar ialah panggilan fungsi yang memulangkan **tiada** nilai.',
          '`typeof` needs exactly one argument. Calling it with no argument is an error (unlike `typeof(nil)`, which is valid and gives "nil"). This mistake is common when the value passed is a function call that returns **no** values.'),
      }),
      EXPLAIN('type-dispatch',
        ['1–2', 'Simpan jenis dalam local supaya `typeof` dipanggil sekali.', 'Store the type in a local so `typeof` is called once.'],
        ['3–12', 'Satu cabang bagi setiap jenis yang dikendalikan; jenis lain memulangkan namanya.', 'One branch per handled type; other types return their name.'],
        ['15–17', 'Lima nilai berbeza jenis.', 'Five values of different types.'])),
    S('line_by_line',
      EXPLAIN('validate-input',
        ['2', '`~=` dengan string `"number"` — hasil `typeof` sentiasa string huruf kecil untuk jenis bahasa.', '`~=` with the string `"number"` — `typeof` results are always lower-case strings for language types.']),
      EXPLAIN('type-dispatch',
        ['10', '`vector.magnitude(value)` — panjang vektor (0, 3, 4) ialah 5 (teorem Pythagoras).', '`vector.magnitude(value)` — the length of the vector (0, 3, 4) is 5 (Pythagoras’ theorem).'])),
    S('why_this_way',
      P('Mengapa dua fungsi? `type` dikekalkan demi keserasian dengan kod Lua; `typeof` ditambah kerana `type` tidak berguna untuk objek enjin. Dalam kod Roblox, `typeof(part) == "Instance"` dan `typeof(pos) == "Vector3"` ialah semakan yang biasa — `type` hanya akan berkata "userdata" untuk kedua-duanya.',
        'Why two functions? `type` is kept for compatibility with Lua code; `typeof` was added because `type` is useless for engine objects. In Roblox code, `typeof(part) == "Instance"` and `typeof(pos) == "Vector3"` are common checks — `type` would just say "userdata" for both.'),
      P('Semak jenis secara runtime **apabila** data datang dari luar (pemain, rangkaian, simpanan); bergantung pada anotasi **apabila** nilai datang dari kod anda sendiri.', 'Check types at run time **when** data comes from outside (players, the network, storage); rely on annotations **when** values come from your own code.')),
    S('execution_flow',
      OL(
        ['`setWalkSpeed("fast")` → `typeof("fast")` ialah "string".', '`setWalkSpeed("fast")` → `typeof("fast")` is "string".'],
        ['"string" ~= "number" → benar → pulangkan `nil` dan mesej.', '"string" ~= "number" → true → return `nil` and a message.'],
        ['`math.clamp` tidak pernah dipanggil dengan string.', '`math.clamp` is never called with a string.'],
      )),
    S('memory_behaviour',
      P('`typeof` memulangkan string yang di-intern, jadi memanggilnya tidak memperuntukkan memori baharu untuk nama jenis. `thread` (coroutine), table, fungsi dan buffer ialah objek heap; `vector` ialah jenis nilai seperti nombor.',
        '`typeof` returns interned strings, so calling it allocates no new memory for type names. `thread` (coroutines), tables, functions and buffers are heap objects; `vector` is a value type like numbers.')),
    S('alternative_implementations',
      P('Table pengesah memetakan nama medan kepada jenis yang dijangka — berguna untuk mengesahkan data yang dimuatkan:', 'A validator table maps field names to expected types — useful for validating loaded data:'),
      CODE('schema-check', 'luau', 'luau', ['Pengesahan mengikut skema', 'Validation by schema'], `
local SCHEMA = {name = "string", level = "number", isVip = "boolean"}

local function validate(data): {string}
  local problems = {}
  for field, expected in SCHEMA do
    local actual = typeof(data[field])
    if actual ~= expected then
      table.insert(problems, \`{field}: expected {expected}, got {actual}\`)
    end
  end
  table.sort(problems)
  return problems
end

local issues = validate({name = "Aina", level = "3"})
print(#issues)
print(table.concat(issues, "\\n"))
`, '2\nisVip: expected boolean, got nil\nlevel: expected number, got string'),
      EXPLAIN('schema-check',
        ['1', 'Skema: jenis yang dijangka bagi setiap medan.', 'The schema: the expected type of each field.'],
        ['3–13', 'Bandingkan jenis sebenar dengan yang dijangka; kumpul dan isih masalah supaya output tetap.', 'Compare actual types with expected ones; collect and sort the problems so the output is stable.'],
        ['15–17', 'Dua masalah dilaporkan sekaligus.', 'Two problems are reported at once.'])),
    S('common_mistakes',
      UL(
        ['Membandingkan dengan `number` tanpa petikan.', 'Comparing with `number` without quotes.'],
        ['Menggunakan `type` untuk objek Roblox dan mendapat "userdata".', 'Using `type` for Roblox objects and getting "userdata".'],
        ['Menganggap anotasi `x: number` menolak string semasa runtime.', 'Assuming the annotation `x: number` rejects strings at run time.'],
        ['Menyemak `typeof(x) == "integer"` — Luau tiada jenis integer.', 'Checking `typeof(x) == "integer"` — Luau has no integer type.'],
      )),
    S('debugging',
      P('Apabila fungsi menerima nilai yang tidak dijangka, tambah `print(typeof(arg))` pada baris pertamanya. Jika jenis betul tetapi nilai pelik, masalahnya data; jika jenis salah, masalahnya pemanggil. Dalam Roblox, `typeof` juga membantu membezakan objek yang kelihatan serupa — `Vector3` berbanding `CFrame`, atau Instance berbanding table biasa. Contoh berikut menunjukkan kesilapan biasa: menyemak jenis yang tidak wujud dalam Luau:',
        'When a function receives an unexpected value, add `print(typeof(arg))` on its first line. If the type is right but the value odd, the problem is the data; if the type is wrong, the problem is the caller. In Roblox, `typeof` also helps tell similar-looking objects apart — `Vector3` versus `CFrame`, or an Instance versus a plain table. The following example shows a common mistake: checking for a type that does not exist in Luau:'),
      CODE('no-integer-type', 'luau', 'luau', ['Menyemak nombor bulat dengan betul', 'Checking for whole numbers correctly'], `
local function isWholeNumber(x): boolean
  return typeof(x) == "number" and x == math.floor(x)
end

print(typeof(7), isWholeNumber(7), isWholeNumber(7.5), isWholeNumber("7"))
`, 'number\ttrue\tfalse\tfalse'),
      EXPLAIN('no-integer-type',
        ['1–3', 'Tiada jenis "integer" dalam Luau; semak bahawa ia nombor dan sama dengan lantainya.', 'There is no "integer" type in Luau; check that it is a number and equals its floor.'],
        ['5', '`typeof(7)` ialah "number"; 7 bulat, 7.5 tidak, "7" bukan nombor.', '`typeof(7)` is "number"; 7 is whole, 7.5 is not, "7" is not a number.'])),
    S('performance',
      P('`typeof` ialah panggilan fungsi yang murah, tetapi dalam gelung yang sangat panas, simpan hasilnya dalam local (seperti `type-dispatch`) dan bukannya memanggilnya dalam setiap cabang. Semakan jenis di sempadan (input) cukup — fungsi dalaman tidak perlu menyemak semula.',
        '`typeof` is a cheap function call, but in very hot loops store its result in a local (as `type-dispatch` does) instead of calling it in every branch. Type checks at the boundary (input) are enough — internal functions need not check again.')),
    S('software_engineering',
      P('Gagal lewat dengan ralat samar berbanding gagal awal dengan mesej jelas:', 'Failing late with a vague error versus failing early with a clear message:'),
      CODE('poor-no-check', 'luau', 'luau', ['Pelaksanaan lemah: tiada semakan jenis', 'Poor implementation: no type check'], `
local function scaleSize(size, factor)
  return size * factor
end

print(scaleSize(4, 1.5))
print(pcall(scaleSize, 4, "big"))
`, '6\nfalse\texample:2: attempt to perform arithmetic (mul) on number and string'),
      EXPLAIN('poor-no-check',
        ['1–3', 'Tiada semakan: input yang salah menyebabkan ralat di dalam fungsi.', 'No check: wrong input causes an error inside the function.'],
        ['5–6', 'Mesej menyebut aritmetik dan baris 2 — bukan "factor mesti nombor". Pengguna mesti meneka puncanya.', 'The message mentions arithmetic and line 2 — not "factor must be a number". The user must guess the cause.']),
      CODE('improved-type-check', 'luau', 'luau', ['Pelaksanaan lebih baik: semakan dengan mesej', 'Improved implementation: a check with a message'], `
local function scaleSize(size: number, factor: number): number
  if typeof(factor) ~= "number" then
    error(\`scaleSize: factor must be a number, got {typeof(factor)}\`, 2)
  end
  return size * factor
end

print(scaleSize(4, 1.5))
print(pcall(scaleSize, 4, "big"))
`, '6\nfalse\tscaleSize: factor must be a number, got string'),
      EXPLAIN('improved-type-check',
        ['1–6', 'Anotasi untuk penganalisis, semakan runtime untuk data sebenar, mesej yang menyebut fungsi dan jenis.', 'Annotations for the analyser, a run-time check for real data, a message naming the function and types.'],
        ['8–9', 'Mesej menerangkan masalah dengan tepat.', 'The message explains the problem exactly.'])),
    S('industry_use_cases',
      UL(
        ['Pelayan Roblox menyemak `typeof` setiap argumen RemoteEvent kerana klien boleh menghantar apa sahaja.', 'Roblox servers check `typeof` on every RemoteEvent argument because clients can send anything.'],
        ['Pustaka seperti `t` (runtime type checker) membina pengesah daripada semakan `typeof`.', 'Libraries such as `t` (a runtime type checker) build validators from `typeof` checks.'],
        ['Kod migrasi data menyemak jenis medan lama sebelum menukarnya.', 'Data-migration code checks the types of old fields before converting them.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah cabang "boolean" pada `type-dispatch`.', 'Add a "boolean" branch to `type-dispatch`.'],
        ['Tambah medan `coins = "number"` pada `SCHEMA` dan ramalkan bilangan masalah.', 'Add a field `coins = "number"` to `SCHEMA` and predict the number of problems.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Pengesah mesej rangkaian.** Klien menghantar mesej `{action, amount}`. Tulis pengesah yang menerima hanya tindakan yang dikenali dan jumlah nombor bulat positif, dengan mesej yang berguna untuk setiap kegagalan.', '**A network message validator.** A client sends messages `{action, amount}`. Write a validator that accepts only known actions and positive whole-number amounts, with a useful message for each failure.'),
      CODE('message-validator', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local ACTIONS = {buy = true, sell = true}

local function validateMessage(msg)
  if typeof(msg) ~= "table" then return false, \`message must be a table, got {typeof(msg)}\` end
  if typeof(msg.action) ~= "string" or not ACTIONS[msg.action] then
    return false, \`unknown action {msg.action}\`
  end
  local amount = msg.amount
  if typeof(amount) ~= "number" or amount < 1 or amount ~= math.floor(amount) then
    return false, \`bad amount {amount}\`
  end
  return true, "ok"
end

for _, m in {{action = "buy", amount = 3}, {action = "steal", amount = 1}, {action = "sell", amount = 2.5}, "hack"} do
  print(validateMessage(m))
end
`, 'true\tok\nfalse\tunknown action steal\nfalse\tbad amount 2.5\nfalse\tmessage must be a table, got string'),
      EXPLAIN('message-validator',
        ['1', 'Set tindakan yang dibenarkan.', 'The set of allowed actions.'],
        ['3–13', 'Semak bentuk (table), tindakan (string yang dikenali) dan jumlah (nombor bulat positif) — mengikut susunan.', 'Check the shape (a table), the action (a known string) and the amount (a positive whole number) — in order.'],
        ['15–17', 'Satu mesej sah dan tiga yang ditolak.', 'One valid message and three rejected ones.'])),
    S('summary',
      UL(
        ['Jenis Luau: nil, boolean, number, string, table, function, thread, userdata, vector, buffer.', 'Luau types: nil, boolean, number, string, table, function, thread, userdata, vector, buffer.'],
        ['`typeof` = `type` untuk jenis bahasa; dalam Roblox ia juga mengenali jenis enjin.', '`typeof` = `type` for language types; in Roblox it also recognises engine types.'],
        ['Hasil ialah string — gunakan petikan.', 'The result is a string — use quotes.'],
        ['Semakan runtime untuk data luar; anotasi untuk kod sendiri.', 'Run-time checks for external data; annotations for your own code.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah `typeof(vector.create(1, 2, 3))`?', 'What is `typeof(vector.create(1, 2, 3))`?'],
        ['Dalam Roblox, apakah `type(Vector3.new())` dan `typeof(Vector3.new())`?', 'In Roblox, what are `type(Vector3.new())` and `typeof(Vector3.new())`?'],
        ['Mengapakah `typeof(x) ~= number` sentiasa benar?', 'Why is `typeof(x) ~= number` always true?'],
        ['Adakah anotasi `x: number` menghalang `f("5")` semasa runtime?', 'Does the annotation `x: number` prevent `f("5")` at run time?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library (type, typeof)', url: `${LUAU}/library#global-functions` },
        { title: 'Roblox globals — typeof', url: `${DOCS}/reference/engine/globals/RobloxGlobals#typeof` },
        { title: 'Luau — Type checking (annotations)', url: `${LUAU}/typecheck` },
        { title: 'osyrisrblx/t — runtime type checker for Roblox', url: 'https://github.com/osyrisrblx/t' },
      )),
  ],
};

// ─── 2.3 vector and buffer: an overview ────────────────────────────────────

export const LUAU102_2_3: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 2,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Mencipta dan menggunakan nilai [[vector-type|vector]]: komponen, aritmetik, `magnitude`, `normalize`, `dot`, `cross`.', 'Create and use [[vector-type|vector]] values: components, arithmetic, `magnitude`, `normalize`, `dot`, `cross`.'],
        ['Menerangkan bahawa vector tidak boleh diubah dan merupakan jenis nilai.', 'Explain that vectors are immutable value types.'],
        ['Mencipta [[buffer-type|buffer]] dan membaca/menulis integer, float dan string pada offset bermula 0.', 'Create [[buffer-type|buffers]] and read/write integers, floats and strings at 0-based offsets.'],
        ['Membezakan `vector` (bahasa) daripada `Vector3` (enjin Roblox).', 'Distinguish `vector` (language) from `Vector3` (Roblox engine).'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1–2.2: jenis asas dan `typeof`.', 'Lectures 2.1–2.2: the basic types and `typeof`.'],
        ['Matematik asas: koordinat (x, y, z) dan teorem Pythagoras.', 'Basic maths: coordinates (x, y, z) and Pythagoras’ theorem.'],
      )),
    S('introduction',
      P('Luau menambah dua jenis nilai yang tiada dalam Lua: `vector` dan `buffer`. `vector` memegang tiga nombor — x, y, z — dan menyokong aritmetik secara langsung, menjadikannya sesuai untuk kedudukan, arah dan halaju. Ia jenis **nilai** seperti nombor, jadi mencipta jutaan vector tidak membebankan pengutip sampah. `buffer` ialah blok bait mentah bersaiz tetap — alat peringkat rendah untuk memampatkan data, membaca format binari, atau menghantar data dengan cekap. Kuliah ini ialah gambaran keseluruhan; kursus kemudian menggunakannya secara mendalam.',
        'Luau adds two value types that Lua does not have: `vector` and `buffer`. A `vector` holds three numbers — x, y, z — and supports arithmetic directly, making it ideal for positions, directions and velocities. It is a **value** type like numbers, so creating millions of vectors does not burden the garbage collector. A `buffer` is a fixed-size block of raw bytes — a low-level tool for compressing data, reading binary formats, or sending data efficiently. This lecture is an overview; later courses use them in depth.'),
      KEY('`vector` = tiga nombor dengan matematik, tidak boleh diubah. `buffer` = bait mentah, offset bermula 0, saiz tetap.', '`vector` = three numbers with maths, immutable. `buffer` = raw bytes, 0-based offsets, fixed size.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`vector.create(x, y, z)` — z lalai 0; komponen dibaca dengan `.x`, `.y`, `.z`.', '`vector.create(x, y, z)` — z defaults to 0; components are read with `.x`, `.y`, `.z`.'],
        ['Aritmetik: `a + b`, `a - b`, `a * 2`, `a * b` (setiap komponen), `-a`; `==` membandingkan komponen.', 'Arithmetic: `a + b`, `a - b`, `a * 2`, `a * b` (per component), `-a`; `==` compares components.'],
        ['Pustaka: `vector.magnitude`, `normalize`, `dot`, `cross`, `floor`, `abs`, `min`, `max`, `vector.zero`, `vector.one`.', 'Library: `vector.magnitude`, `normalize`, `dot`, `cross`, `floor`, `abs`, `min`, `max`, `vector.zero`, `vector.one`.'],
        ['`buffer.create(n)` — n bait sifar; `buffer.writeu8/i8/u16/i16/u32/i32/f32/f64/string` dan pasangan `read…`.', '`buffer.create(n)` — n zero bytes; `buffer.writeu8/i8/u16/i16/u32/i32/f32/f64/string` and the matching `read…`.'],
        ['Offset buffer bermula pada **0**; akses di luar `buffer.len(b)` ialah ralat.', 'Buffer offsets start at **0**; access beyond `buffer.len(b)` is an error.'],
      )),
    S('detailed_theory',
      P('`vector` dilaksanakan sebagai jenis nilai terbina dalam VM Luau: tiga float 32-bit disimpan terus dalam slot nilai, tanpa peruntukan heap. Kerana itu, ia sangat pantas — operasi seperti `a + b` dilakukan dalam satu arahan VM — dan ia **tidak boleh diubah**: `v.x = 5` ialah ralat; anda mencipta vector baharu sebaliknya. Ketepatan float 32-bit cukup untuk geometri permainan. Penting: `vector` ialah sebahagian daripada **bahasa** Luau. Roblox mempunyai jenis enjin berasingan, `Vector3`, dengan API sendiri (`Vector3.new`, `.Magnitude`, `.Unit`). Dalam Roblox, `Vector3` kini juga diwakili secara dalaman oleh jenis vector Luau, tetapi kod Roblox menggunakan API `Vector3`; kod Luau tulen menggunakan pustaka `vector`.',
        '`vector` is implemented as a built-in value type in the Luau VM: three 32-bit floats stored directly in a value slot, with no heap allocation. Because of that it is very fast — operations such as `a + b` take one VM instruction — and it is **immutable**: `v.x = 5` is an error; you create a new vector instead. 32-bit float precision is enough for game geometry. Important: `vector` is part of the Luau **language**. Roblox has a separate engine type, `Vector3`, with its own API (`Vector3.new`, `.Magnitude`, `.Unit`). In Roblox, `Vector3` is now also represented internally by Luau’s vector type, but Roblox code uses the `Vector3` API; pure Luau code uses the `vector` library.'),
      P('`buffer` menyelesaikan masalah yang berbeza: menyimpan data padat. Table Luau yang mengandungi seribu nombor menggunakan sekurang-kurangnya 16 bait bagi setiap nombor; buffer boleh menyimpan seribu nombor 1-bait dalam 1000 bait. Buffer mempunyai saiz tetap yang ditetapkan semasa dicipta, dan setiap fungsi baca/tulis menentukan **format** — `u8` (integer tanpa tanda 0–255), `i32` (integer bertanda 32-bit), `f32` (float 32-bit) dan lain-lain. Menulis nilai yang tidak muat dalam format itu membungkusnya (300 dalam `u8` menjadi 44), dan offset di luar saiz menimbulkan ralat `buffer access out of bounds`. Offset bermula pada 0 kerana buffer meniru memori peringkat rendah, tidak seperti table yang bermula pada 1.',
        '`buffer` solves a different problem: storing compact data. A Luau table holding a thousand numbers uses at least 16 bytes per number; a buffer can store a thousand 1-byte numbers in 1000 bytes. A buffer has a fixed size set at creation, and every read/write function specifies a **format** — `u8` (unsigned integer 0–255), `i32` (signed 32-bit integer), `f32` (32-bit float) and so on. Writing a value that does not fit the format wraps it (300 in `u8` becomes 44), and an offset beyond the size raises `buffer access out of bounds`. Offsets start at 0 because buffers imitate low-level memory, unlike tables, which start at 1.')),
    S('technical_terminology', TERMS('vector-type', 'buffer-type', 'typeof-function', 'number-subtype')),
    S('syntax_rules',
      UL(
        ['`local v = vector.create(1, 2, 3)` · `v.x` · `vector.magnitude(v)` · `v * 2`.', '`local v = vector.create(1, 2, 3)` · `v.x` · `vector.magnitude(v)` · `v * 2`.'],
        ['`local b = buffer.create(8)` · `buffer.writei32(b, 0, -5)` · `buffer.readi32(b, 0)`.', '`local b = buffer.create(8)` · `buffer.writei32(b, 0, -5)` · `buffer.readi32(b, 0)`.'],
        ['Saiz format: u8/i8 = 1 bait, u16/i16 = 2, u32/i32/f32 = 4, f64 = 8.', 'Format sizes: u8/i8 = 1 byte, u16/i16 = 2, u32/i32/f32 = 4, f64 = 8.'],
      )),
    S('code_demonstration',
      CODE('vector-basics', 'luau', 'luau', ['Asas vector', 'Vector basics'], `
local start = vector.create(0, 5, 0)
local velocity = vector.create(2, 0, 1)
local seconds = 3

local finish = start + velocity * seconds
print(finish, finish.x, finish.z)
print(vector.magnitude(vector.create(3, 4, 0)))
print(vector.normalize(vector.create(0, 10, 0)))
print(finish == vector.create(6, 5, 3))
`, '6, 5, 3\t6\t3\n5\n0, 1, 0\ntrue'),
      EXPLAIN('vector-basics',
        ['1–3', 'Kedudukan permulaan, halaju per saat, dan masa.', 'A starting position, a velocity per second, and a time.'],
        ['5–6', 'Kedudukan akhir = mula + halaju × masa — satu ungkapan untuk tiga komponen.', 'Final position = start + velocity × time — one expression for three components.'],
        ['7', 'Panjang (3, 4, 0) ialah 5.', 'The length of (3, 4, 0) is 5.'],
        ['8', '`normalize` memberi arah dengan panjang 1.', '`normalize` gives the direction with length 1.'],
        ['9', '`==` membandingkan komponen.', '`==` compares components.'])),
    S('complete_examples',
      CODE('vector-maths', 'luau', 'luau', ['Hasil darab titik dan silang', 'Dot and cross products'], `
local forward = vector.create(0, 0, -1)
local toEnemy = vector.normalize(vector.create(0, 0, -10))
local toAlly = vector.normalize(vector.create(10, 0, 0))

print(vector.dot(forward, toEnemy))
print(vector.dot(forward, toAlly))
print(vector.cross(vector.create(1, 0, 0), vector.create(0, 1, 0)))
print(vector.floor(vector.create(1.7, -1.2, 0)), vector.abs(vector.create(-1, 2, -3)))
`, '1\n0\n0, 0, 1\n1, -2, 0\t1, 2, 3', {
        debug: BUG(`
local position = vector.create(1, 2, 3)
position.x = 10
print(position)
`, "example:2: attempt to index vector with 'x'",
          'Vector tidak boleh diubah: komponennya tidak boleh ditetapkan. Luau melaporkan cubaan menulis `x` sebagai ralat indeks. Cipta vector baharu: `position = vector.create(10, position.y, position.z)`. Ini juga berbeza daripada table, di mana `t.x = 10` dibenarkan.',
          'Vectors are immutable: their components cannot be assigned. Luau reports the attempt to write `x` as an index error. Create a new vector: `position = vector.create(10, position.y, position.z)`. This also differs from tables, where `t.x = 10` is allowed.'),
      }),
      EXPLAIN('vector-maths',
        ['1–3', 'Arah hadapan dan dua arah yang dinormalkan.', 'A forward direction and two normalised directions.'],
        ['5–6', 'Hasil darab titik: 1 = arah sama (musuh di hadapan), 0 = berserenjang (sekutu di sisi). Digunakan untuk "adakah ia dalam pandangan saya?".', 'The dot product: 1 = same direction (enemy ahead), 0 = perpendicular (ally to the side). Used for "is it in my view?".'],
        ['7', 'Hasil darab silang memberi arah yang berserenjang dengan kedua-duanya.', 'The cross product gives a direction perpendicular to both.'],
        ['8', '`floor` dan `abs` bagi setiap komponen.', '`floor` and `abs` per component.']),
      CODE('buffer-basics', 'luau', 'luau', ['Asas buffer', 'Buffer basics'], `
local b = buffer.create(8)
buffer.writeu8(b, 0, 200)
buffer.writei16(b, 1, -1234)
buffer.writef32(b, 4, 2.5)

print(buffer.len(b))
print(buffer.readu8(b, 0), buffer.readi16(b, 1), buffer.readf32(b, 4))
buffer.writeu8(b, 0, 300)
print(buffer.readu8(b, 0))

local text = buffer.fromstring("Luau!")
print(buffer.len(text), buffer.readstring(text, 0, 4))
`, '8\n200\t-1234\t2.5\n44\n5\tLuau', {
        debug: BUG(`
local b = buffer.create(4)
for i = 1, 4 do
  buffer.writeu8(b, i, i * 10)
end
`, 'example:3: buffer access out of bounds',
          'Gelung menggunakan offset 1–4 seperti indeks table, tetapi buffer 4 bait mempunyai offset **0–3**. Tulis pada offset 4 berada di luar sempadan. Gunakan `for i = 0, buffer.len(b) - 1 do` — ingat bahawa buffer bermula pada 0.',
          'The loop uses offsets 1–4 like table indices, but a 4-byte buffer has offsets **0–3**. Writing at offset 4 is out of bounds. Use `for i = 0, buffer.len(b) - 1 do` — remember that buffers start at 0.'),
      }),
      EXPLAIN('buffer-basics',
        ['1–4', 'Buffer 8 bait: satu `u8` pada offset 0, satu `i16` (2 bait) pada offset 1, satu `f32` (4 bait) pada offset 4.', 'An 8-byte buffer: a `u8` at offset 0, an `i16` (2 bytes) at offset 1, an `f32` (4 bytes) at offset 4.'],
        ['6–7', 'Baca kembali dengan format yang sama.', 'Read back with the same formats.'],
        ['8–9', '300 tidak muat dalam `u8` (0–255) dan dibungkus: 300 − 256 = 44.', '300 does not fit in `u8` (0–255) and wraps: 300 − 256 = 44.'],
        ['11–12', '`buffer.fromstring` mencipta buffer daripada teks; `readstring` membaca 4 bait.', '`buffer.fromstring` creates a buffer from text; `readstring` reads 4 bytes.'])),
    S('line_by_line',
      EXPLAIN('vector-basics',
        ['5', '`velocity * seconds` mendarab setiap komponen dengan 3 → (6, 0, 3); kemudian ditambah kepada `start` → (6, 5, 3).', '`velocity * seconds` multiplies every component by 3 → (6, 0, 3); then it is added to `start` → (6, 5, 3).']),
      EXPLAIN('buffer-basics',
        ['3', '`i16` bertanda boleh menyimpan −32768 hingga 32767, jadi −1234 muat. Ia menggunakan offset 1 dan 2.', 'A signed `i16` holds −32768 to 32767, so −1234 fits. It uses offsets 1 and 2.'])),
    S('why_this_way',
      P('Mengapa jenis vector terbina? Kerana permainan melakukan berjuta-juta operasi geometri sesaat; mewakili vector sebagai table akan memperuntukkan memori untuk setiap satu dan memperlahankan segalanya. Mengapa buffer? Kerana sesetengah data (peta, imej, simpanan) terlalu besar untuk table yang selesa, dan format binari yang padat menjimatkan memori dan lebar jalur.',
        'Why a built-in vector type? Because games do millions of geometry operations per second; representing vectors as tables would allocate memory for each one and slow everything down. Why buffers? Because some data (maps, images, saves) is too large for comfortable tables, and compact binary formats save memory and bandwidth.'),
      P('Gunakan `vector` **apabila** kod Luau tulen memerlukan geometri; dalam skrip Roblox, gunakan `Vector3` untuk API enjin. Gunakan `buffer` **hanya apabila** saiz atau format binari penting — untuk kebanyakan data, table lebih mudah.', 'Use `vector` **when** pure Luau code needs geometry; in Roblox scripts, use `Vector3` for engine APIs. Use `buffer` **only when** size or binary format matters — for most data, tables are simpler.')),
    S('execution_flow',
      OL(
        ['`buffer.create(8)` memperuntukkan 8 bait sifar.', '`buffer.create(8)` allocates 8 zero bytes.'],
        ['`writei16(b, 1, -1234)` menulis dua bait pada offset 1–2 dalam format little-endian.', '`writei16(b, 1, -1234)` writes two bytes at offsets 1–2 in little-endian format.'],
        ['`readi16(b, 1)` membaca dua bait yang sama dan mentafsirnya semula sebagai −1234.', '`readi16(b, 1)` reads the same two bytes and interprets them again as −1234.'],
      )),
    S('memory_behaviour',
      P('Vector menggunakan slot nilai (16 bait) yang sama seperti nombor — tiada objek heap, tiada kerja untuk pengutip sampah. Buffer ialah satu objek heap dengan saiz tepat yang diminta, ditambah sedikit overhed; ia tidak boleh membesar — cipta buffer baharu yang lebih besar dan salin dengan `buffer.copy` jika perlu.',
        'Vectors use the same value slot (16 bytes) as numbers — no heap object, no garbage-collector work. A buffer is one heap object of exactly the requested size, plus a little overhead; it cannot grow — create a new, larger buffer and copy with `buffer.copy` if needed.')),
    S('alternative_implementations',
      P('Sebelum jenis `vector`, kod Luau tulen menggunakan table `{x, y, z}` — masih berguna untuk memahami matematiknya:', 'Before the `vector` type, pure Luau code used `{x, y, z}` tables — still useful for understanding the maths:'),
      CODE('table-vector', 'luau', 'luau', ['Vector sebagai table (cara lama)', 'A vector as a table (the old way)'], `
local function add(a, b) return {x = a.x + b.x, y = a.y + b.y, z = a.z + b.z} end
local function length(a) return math.sqrt(a.x ^ 2 + a.y ^ 2 + a.z ^ 2) end

local p = add({x = 1, y = 2, z = 2}, {x = 0, y = 0, z = 0})
print(length(p), p.x)
`, '3\t1'),
      EXPLAIN('table-vector',
        ['1–2', 'Setiap operasi ialah fungsi yang mencipta **table baharu** — peruntukan bagi setiap hasil.', 'Every operation is a function that creates a **new table** — an allocation per result.'],
        ['4–5', 'Panjang (1, 2, 2) ialah 3. Dengan `vector`, ini ialah `vector.magnitude(a + b)` tanpa peruntukan.', 'The length of (1, 2, 2) is 3. With `vector`, this is `vector.magnitude(a + b)` with no allocation.'])),
    S('common_mistakes',
      UL(
        ['Cuba menetapkan `v.x = …` — vector tidak boleh diubah.', 'Trying to set `v.x = …` — vectors are immutable.'],
        ['Menggunakan offset buffer bermula 1.', 'Using buffer offsets starting at 1.'],
        ['Mengelirukan `vector.create` (Luau) dengan `Vector3.new` (Roblox).', 'Confusing `vector.create` (Luau) with `Vector3.new` (Roblox).'],
        ['Menulis nilai yang terlalu besar untuk format buffer dan tidak menyedari ia dibungkus.', 'Writing values too large for a buffer format and not noticing they wrap.'],
      )),
    S('debugging',
      P('Untuk vector, cetak terus — `print(v)` memaparkan `x, y, z`. Jika panjang atau arah kelihatan salah, semak sama ada vector dinormalkan sebelum hasil darab titik (hasil darab titik vector tidak dinormalkan bukan kosinus sudut). Untuk buffer, ralat `out of bounds` hampir selalu bermaksud offset bermula 1 atau saiz format terlupa dikira. Contoh berikut menunjukkan aritmetik vector dengan nilai jenis yang salah:',
        'For vectors, print them directly — `print(v)` shows `x, y, z`. If a length or direction looks wrong, check whether the vectors were normalised before the dot product (the dot product of non-normalised vectors is not the cosine of the angle). For buffers, an `out of bounds` error almost always means offsets starting at 1 or a forgotten format size. The following example shows vector arithmetic with a value of the wrong type:'),
      CODE('vector-type-check', 'luau', 'luau', ['Mengesahkan operand vector', 'Validating vector operands'], `
local function move(position, offset)
  if typeof(offset) ~= "vector" then
    return nil, \`offset must be a vector, got {typeof(offset)}\`
  end
  return position + offset
end

print(move(vector.create(1, 1, 1), vector.create(0, 2, 0)))
print(move(vector.create(1, 1, 1), {0, 2, 0}))
`, '1, 3, 1\nnil\toffset must be a vector, got table'),
      EXPLAIN('vector-type-check',
        ['1–5', 'Semak jenis sebelum aritmetik; `vector + table` akan gagal dengan `attempt to perform arithmetic (add) on vector and table`.', 'Check the type before the arithmetic; `vector + table` would fail with `attempt to perform arithmetic (add) on vector and table`.'],
        ['8–9', 'Vector sah ditambah; table ditolak dengan mesej.', 'A valid vector is added; a table is rejected with a message.'])),
    S('performance',
      P('Operasi `vector` ialah antara yang terpantas dalam Luau kerana tiada peruntukan. Baca/tulis buffer juga pantas, tetapi setiap panggilan fungsi mempunyai kos; untuk data yang sangat besar, Roblox menggabungkan buffer dengan `--!native` untuk kelajuan hampir asli. Bagi pemula: gunakan vector dengan bebas; gunakan buffer apabila anda mengukur keperluan.',
        '`vector` operations are among the fastest in Luau because there is no allocation. Buffer reads/writes are fast too, but every function call has a cost; for very large data, Roblox combines buffers with `--!native` for near-native speed. For beginners: use vectors freely; use buffers when you have measured a need.')),
    S('software_engineering',
      P('Data grid besar dalam table berbanding buffer padat:', 'Large grid data in a table versus a compact buffer:'),
      CODE('poor-table-grid', 'luau', 'luau', ['Pelaksanaan lemah: table bersarang untuk grid besar', 'Poor implementation: nested tables for a big grid'], `
local SIZE = 64
local grid = {}
for row = 1, SIZE do
  grid[row] = {}
  for col = 1, SIZE do
    grid[row][col] = (row + col) % 4
  end
end
print(grid[10][20], #grid * #grid[1])
`, '2\t4096'),
      EXPLAIN('poor-table-grid',
        ['1–8', '65 table dan 4096 slot nilai (16 bait setiap satu) untuk nilai yang muat dalam 2 bit.', '65 tables and 4096 value slots (16 bytes each) for values that fit in 2 bits.'],
        ['9', 'Berfungsi, tetapi membazir memori pada saiz besar.', 'It works, but wastes memory at large sizes.']),
      CODE('improved-buffer-grid', 'luau', 'luau', ['Pelaksanaan lebih baik: satu buffer', 'Improved implementation: one buffer'], `
local SIZE = 64
local grid = buffer.create(SIZE * SIZE)

local function cellOffset(row: number, col: number): number
  return (row - 1) * SIZE + (col - 1)
end

for row = 1, SIZE do
  for col = 1, SIZE do
    buffer.writeu8(grid, cellOffset(row, col), (row + col) % 4)
  end
end
print(buffer.readu8(grid, cellOffset(10, 20)), buffer.len(grid))
`, '2\t4096'),
      EXPLAIN('improved-buffer-grid',
        ['1–2', 'Satu buffer 4096 bait — satu bait setiap sel.', 'One 4096-byte buffer — one byte per cell.'],
        ['4–6', 'Tukar baris/lajur 1-berasaskan kepada offset 0-berasaskan.', 'Convert a 1-based row/column into a 0-based offset.'],
        ['8–13', 'Hasil yang sama dengan sebahagian kecil memori.', 'The same result with a fraction of the memory.'])),
    S('industry_use_cases',
      UL(
        ['Sistem pergerakan dan AI menggunakan hasil darab titik untuk medan pandangan.', 'Movement and AI systems use dot products for fields of view.'],
        ['Permainan Roblox memampatkan data simpanan dan rangkaian dengan buffer.', 'Roblox games compress save and network data with buffers.'],
        ['Penjana dunia prosedural menyimpan peta voxel dalam buffer.', 'Procedural world generators store voxel maps in buffers.'],
      )),
    S('practical_demonstration',
      OL(
        ['Kira jarak antara (1, 2, 3) dan (4, 6, 3) dengan `vector.magnitude(a - b)`.', 'Compute the distance between (1, 2, 3) and (4, 6, 3) with `vector.magnitude(a - b)`.'],
        ['Tulis −1 dengan `writeu8` dan baca dengan `readu8`; terangkan hasilnya.', 'Write −1 with `writeu8` and read it with `readu8`; explain the result.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Peronda dengan medan pandangan.** Tentukan sama ada setiap sasaran berada dalam kon pandangan 60° pengawal dan dalam jarak 20 stud, menggunakan `vector`.', '**A guard with a field of view.** Decide whether each target is inside a guard’s 60° view cone and within 20 studs, using `vector`.'),
      CODE('guard-fov', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local GUARD_POS = vector.create(0, 0, 0)
local GUARD_FACING = vector.create(0, 0, -1)
local MAX_DISTANCE = 20
local MIN_DOT = math.cos(math.rad(30))

local function canSee(target): boolean
  local offset = target - GUARD_POS
  local distance = vector.magnitude(offset)
  if distance > MAX_DISTANCE then return false end
  return vector.dot(GUARD_FACING, vector.normalize(offset)) >= MIN_DOT
end

local targets = {
  ahead = vector.create(0, 0, -10),
  behind = vector.create(0, 0, 10),
  far = vector.create(0, 0, -50),
  side = vector.create(10, 0, -2),
}
for _, name in {"ahead", "behind", "far", "side"} do
  print(name, canSee(targets[name]))
end
`, 'ahead\ttrue\nbehind\tfalse\nfar\tfalse\nside\tfalse'),
      EXPLAIN('guard-fov',
        ['1–4', 'Kedudukan, arah, jarak maksimum, dan kosinus separuh sudut kon (30° untuk kon 60°).', 'Position, facing, maximum distance, and the cosine of the cone’s half-angle (30° for a 60° cone).'],
        ['6–11', 'Jarak dahulu (murah); kemudian hasil darab titik dengan arah yang dinormalkan dibandingkan dengan kosinus.', 'Distance first (cheap); then the dot product with the normalised direction is compared with the cosine.'],
        ['13–21', 'Empat sasaran diuji dalam susunan tetap: hanya yang di hadapan dan dekat kelihatan.', 'Four targets tested in a fixed order: only the one ahead and near is visible.'])),
    S('summary',
      UL(
        ['`vector`: tiga nombor, aritmetik terbina, pustaka `vector`, tidak boleh diubah, tiada peruntukan.', '`vector`: three numbers, built-in arithmetic, the `vector` library, immutable, no allocation.'],
        ['`buffer`: bait mentah bersaiz tetap, offset bermula 0, format baca/tulis eksplisit.', '`buffer`: fixed-size raw bytes, 0-based offsets, explicit read/write formats.'],
        ['`vector` (bahasa) ≠ `Vector3` (enjin Roblox).', '`vector` (language) ≠ `Vector3` (Roblox engine).'],
        ['Gunakan buffer hanya apabila saiz atau format binari penting.', 'Use buffers only when size or binary format matters.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah `vector.create(1, 2) + vector.create(1, 1, 1)`?', 'What is `vector.create(1, 2) + vector.create(1, 1, 1)`?'],
        ['Mengapakah `v.x = 5` gagal?', 'Why does `v.x = 5` fail?'],
        ['Berapakah offset terakhir yang sah dalam `buffer.create(10)`?', 'What is the last valid offset in `buffer.create(10)`?'],
        ['Apakah yang dibaca oleh `readu8` selepas `writeu8(b, 0, 260)`?', 'What does `readu8` read after `writeu8(b, 0, 260)`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library: vector', url: `${LUAU}/library#vector-library` },
        { title: 'Luau — Library: buffer', url: `${LUAU}/library#buffer-library` },
        { title: 'Roblox Creator Hub — buffer', url: `${DOCS}/reference/engine/libraries/buffer` },
        { title: 'Roblox Engine API — Vector3 (the engine type)', url: `${DOCS}/reference/engine/datatypes/Vector3` },
      )),
  ],
};

export const LUAU102_M2 = [LUAU102_2_1, LUAU102_2_2, LUAU102_2_3];
