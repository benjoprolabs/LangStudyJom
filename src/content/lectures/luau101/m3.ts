import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU101 · Module 3 — First Programs.
 * `luau` examples are executed with the official Luau VM (npm run verify:code); `roblox` examples are compiled only.
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 3.1 print() and the Output window ─────────────────────────────────────

export const LUAU101_3_1: LectureContentDef = {
  courseCode: 'LUAU101',
  module: 3,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan `print` dengan satu atau banyak argumen dari pelbagai jenis.', 'Use `print` with one or many arguments of various types.'],
        ['Menerangkan perbezaan output `print` dalam luau CLI (tab) dan Roblox Studio (ruang).', 'Explain the difference in `print` output between the luau CLI (tabs) and Roblox Studio (spaces).'],
        ['Membaca [[output-window|tetingkap Output]]: print, warn dan ralat.', 'Read the [[output-window|Output window]]: prints, warnings and errors.'],
        ['Memformat output dengan penggabungan, interpolasi dan jujukan escape.', 'Format output with concatenation, interpolation and escape sequences.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 2: menjalankan kod dalam luau CLI dan Roblox Studio.', 'Module 2: running code in the luau CLI and Roblox Studio.'],
      )),
    S('introduction',
      P('`print` ialah alat pertama setiap pengaturcara Luau: ia menunjukkan apa yang program sedang lakukan. Dalam luau CLI, output pergi ke terminal; dalam Roblox Studio, ia pergi ke tetingkap Output, bersama amaran kuning daripada `warn` dan ralat merah. Walaupun ringkas, `print` mempunyai butiran yang penting: bagaimana ia menukar nilai kepada teks, bagaimana ia memisahkan argumen, dan apa yang tidak boleh dilakukannya. Kuliah ini mengajar butiran itu supaya output anda sentiasa jelas.',
        '`print` is every Luau programmer’s first tool: it shows what the program is doing. In the luau CLI, output goes to the terminal; in Roblox Studio, it goes to the Output window, together with yellow warnings from `warn` and red errors. Although simple, `print` has details that matter: how it converts values to text, how it separates arguments, and what it cannot do. This lecture teaches those details so your output is always clear.'),
      KEY('`print(a, b)` menukar setiap argumen dengan `tostring` dan memisahkannya — tab dalam CLI, ruang dalam Roblox.', '`print(a, b)` converts each argument with `tostring` and separates them — tabs in the CLI, spaces in Roblox.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`print` menerima sebarang bilangan argumen dari sebarang jenis, dan menamatkan baris.', '`print` takes any number of arguments of any type, and ends the line.'],
        ['Setiap argumen ditukar dengan `tostring`: `nil` → "nil", `true` → "true", table → "table: 0x…".', 'Each argument is converted with `tostring`: `nil` → "nil", `true` → "true", a table → "table: 0x…".'],
        ['Pemisah: **tab** dalam luau CLI dan Lua standard; **ruang** dalam Output Roblox.', 'Separator: a **tab** in the luau CLI and standard Lua; a **space** in Roblox’s Output.'],
        ['Penggabungan `..` hanya menerima string dan nombor; nilai lain menyebabkan ralat.', 'Concatenation `..` only accepts strings and numbers; other values cause an error.'],
        ['Roblox sahaja: `warn(...)` (kuning) dan ralat (merah), setiap satu dengan nama skrip dan baris.', 'Roblox only: `warn(...)` (yellow) and errors (red), each with the script name and line.'],
      )),
    S('detailed_theory',
      P('Apabila `print` dipanggil, setiap argumen ditukar kepada string oleh `tostring`. Nombor dicetak dengan digit secukupnya untuk mewakili nilainya dengan tepat: `0.1 + 0.2` dicetak sebagai `0.30000000000000004` dalam Luau (berbeza daripada Lua 5.4, yang membundarkan kepada 14 digit dan mencetak `0.3`). Table dan fungsi dicetak sebagai jenis dan alamat memori, contohnya `table: 0x000055f9…` — alamat ini berubah setiap larian, jadi ia tidak berguna untuk melihat kandungan. Untuk melihat kandungan table, anda mesti mencetak medannya sendiri atau menggunakan `table.concat`.',
        'When `print` is called, each argument is converted to a string by `tostring`. Numbers are printed with just enough digits to represent their value exactly: `0.1 + 0.2` prints as `0.30000000000000004` in Luau (unlike Lua 5.4, which rounds to 14 digits and prints `0.3`). Tables and functions print as their type and memory address, for example `table: 0x000055f9…` — the address changes every run, so it is useless for seeing contents. To see a table’s contents, you must print its fields yourself or use `table.concat`.'),
      P('Roblox menggantikan `print` dengan versinya sendiri yang menghantar teks ke tetingkap Output dan memisahkan argumen dengan ruang. Output Studio juga lebih kaya: ia menunjukkan cap masa (pilihan), sumber (pelayan atau klien), dan untuk table yang dicetak, Studio boleh memaparkan kandungannya sebagai pokok yang boleh dikembangkan — ciri Studio, bukan bahasa. Roblox juga menambah `warn`, yang mencetak mesej kuning tanpa menghentikan skrip. Dalam kursus ini, output yang **disahkan** sentiasa datang daripada VM Luau (pemisah tab); output Studio diterangkan.',
        'Roblox replaces `print` with its own version that sends text to the Output window and separates arguments with spaces. Studio’s Output is also richer: it shows timestamps (optional), the source (server or client), and for printed tables Studio can display the contents as an expandable tree — a Studio feature, not a language one. Roblox also adds `warn`, which prints a yellow message without stopping the script. In this course, **verified** output always comes from the Luau VM (tab separator); Studio output is described.')),
    S('technical_terminology', TERMS('output-window', 'escape-sequence', 'roblox-studio', 'luau-cli')),
    S('syntax_rules',
      UL(
        ['`print(nilai1, nilai2, …)` — sebarang bilangan argumen.', '`print(value1, value2, …)` — any number of arguments.'],
        ['Jujukan escape dalam string: `\\n` baris baharu, `\\t` tab, `\\"` petikan, `\\\\` garis miring terbalik.', 'Escape sequences in strings: `\\n` newline, `\\t` tab, `\\"` quote, `\\\\` backslash.'],
        ['`` `teks {ungkapan}` `` menukar sebarang nilai dengan `tostring` — selamat untuk `nil` dan boolean.', '`` `text {expression}` `` converts any value with `tostring` — safe for `nil` and booleans.'],
      )),
    S('code_demonstration',
      CODE('print-basics', 'luau', 'luau', ['print dengan pelbagai jenis', 'print with various types'], `
local playerName = "Aina"
local coins = 120
local isVip = true
local guild = nil

print(playerName)
print(playerName, coins, isVip, guild)
print("Coins:", coins * 2)
print(0.1 + 0.2, 10 / 4, 2^10)
`, 'Aina\nAina\t120\ttrue\tnil\nCoins:\t240\n0.30000000000000004\t2.5\t1024'),
      EXPLAIN('print-basics',
        ['1–4', 'Empat pemboleh ubah: string, nombor, boolean dan `nil`.', 'Four variables: a string, a number, a boolean and `nil`.'],
        ['6', 'Satu argumen, satu baris.', 'One argument, one line.'],
        ['7', 'Empat argumen dipisahkan oleh tab dalam VM Luau; `nil` dicetak sebagai "nil". Dalam Studio: `Aina 120 true nil` (ruang).', 'Four arguments separated by tabs in the Luau VM; `nil` prints as "nil". In Studio: `Aina 120 true nil` (spaces).'],
        ['8', 'Ungkapan dinilai dahulu, kemudian dicetak.', 'Expressions are evaluated first, then printed.'],
        ['9', 'Luau mencetak nombor dengan tepat: `0.1 + 0.2` mendedahkan ralat pembundaran float.', 'Luau prints numbers exactly: `0.1 + 0.2` reveals the float rounding error.'])),
    S('complete_examples',
      CODE('concat-vs-args', 'luau', 'luau', ['Penggabungan berbanding argumen berbilang', 'Concatenation versus multiple arguments'], `
local name = "Ben"
local level = 7
local title = nil

print("Player " .. name .. " is level " .. level)
print("Title:", title)
print(\`Title: {title}\`)
print("Title: " .. (title or "none"))
`, 'Player Ben is level 7\nTitle:\tnil\nTitle: nil\nTitle: none', {
        debug: BUG(`
local name = "Ben"
local title = nil
print("Player " .. name .. " has title " .. title)
`, 'example:3: attempt to concatenate string with nil',
          '`..` tidak boleh menggabungkan `nil`. Luau menyebut kedua-dua jenis: string di kiri dan `nil` di kanan. Tiga penyelesaian ditunjukkan dalam versi asal: hantar sebagai argumen berasingan (baris 6), gunakan interpolasi (baris 7), atau beri nilai lalai dengan `or` (baris 8).',
          '`..` cannot concatenate `nil`. Luau names both types: a string on the left and `nil` on the right. Three fixes are shown in the original version: pass it as a separate argument (line 6), use interpolation (line 7), or give a default with `or` (line 8).'),
      }),
      EXPLAIN('concat-vs-args',
        ['1–3', 'Salah satu nilai ialah `nil`.', 'One of the values is `nil`.'],
        ['5', '`..` menggabungkan string dan nombor menjadi satu string — nombor ditukar secara automatik.', '`..` joins strings and numbers into one string — numbers are converted automatically.'],
        ['6', 'Argumen berasingan: `print` menukar `nil` sendiri.', 'Separate arguments: `print` converts the `nil` itself.'],
        ['7', 'Interpolasi juga menukar `nil` dengan selamat.', 'Interpolation also converts `nil` safely.'],
        ['8', 'Lalai `or "none"` menjadikan output lebih mesra pengguna.', 'The `or "none"` default makes the output friendlier.']),
      CODE('escapes', 'luau', 'luau', ['Jujukan escape dan string panjang', 'Escape sequences and long strings'], `
print("Name\\tScore")
print("Aina\\t120")
print("Line one\\nLine two")
print("She said \\"GG\\"")
print([[C:\\Games\\save.txt]])
`, 'Name\tScore\nAina\t120\nLine one\nLine two\nShe said "GG"\nC:\\Games\\save.txt', {
        debug: BUG(`
local tag = "VIP"
print("Rank: " .. true and tag)
`, 'example:2: attempt to concatenate string with boolean',
          '`..` mempunyai keutamaan lebih tinggi daripada `and`, jadi Luau menilai `"Rank: " .. true` dahulu — dan boolean tidak boleh digabungkan. Gunakan kurungan atau, lebih baik, interpolasi: `` print(`Rank: {tag}`) ``.',
          '`..` has higher precedence than `and`, so Luau evaluates `"Rank: " .. true` first — and a boolean cannot be concatenated. Use parentheses or, better, interpolation: `` print(`Rank: {tag}`) ``.'),
      }),
      EXPLAIN('escapes',
        ['1–2', '`\\t` menjajarkan lajur ringkas.', '`\\t` aligns simple columns.'],
        ['3', '`\\n` memecahkan satu `print` kepada dua baris.', '`\\n` breaks one `print` into two lines.'],
        ['4', '`\\"` meletakkan petikan di dalam string berpetik.', '`\\"` puts a quote inside a quoted string.'],
        ['5', 'String panjang `[[ ]]` tidak memproses escape — garis miring terbalik dicetak seperti sedia ada.', 'Long strings `[[ ]]` do not process escapes — backslashes print as they are.'])),
    S('line_by_line',
      EXPLAIN('print-basics',
        ['7', 'Jika anda mahukan output yang sama dalam CLI dan Studio, bina satu string sendiri (dengan `..` atau interpolasi) dan bukannya bergantung pada pemisah argumen.', 'If you want the same output in the CLI and Studio, build one string yourself (with `..` or interpolation) instead of relying on the argument separator.']),
      EXPLAIN('concat-vs-args',
        ['5', 'Penggabungan dinilai dari kiri ke kanan; setiap `..` mencipta string sementara baharu.', 'Concatenation is evaluated left to right; every `..` creates a new temporary string.'])),
    S('why_this_way',
      P('Mengapa `print` menukar segalanya, tetapi `..` tidak? Kerana `print` ialah alat diagnostik — ia mesti menunjukkan apa sahaja, termasuk `nil`. `..` pula ialah operasi bahasa yang menghasilkan nilai; menggabungkan `nil` secara senyap akan menyembunyikan pepijat. Interpolasi Luau mengambil jalan tengah yang selamat: ia menukar setiap nilai dengan `tostring`.',
        'Why does `print` convert everything while `..` does not? Because `print` is a diagnostic tool — it must show anything, including `nil`. `..`, by contrast, is a language operation that produces a value; silently concatenating `nil` would hide bugs. Luau’s interpolation takes a safe middle path: it converts every value with `tostring`.'),
      P('Gunakan argumen berbilang **apabila** menyahpepijat dengan cepat; gunakan interpolasi **apabila** menulis mesej untuk pemain atau log yang kemas.', 'Use multiple arguments **when** debugging quickly; use interpolation **when** writing messages for players or tidy logs.')),
    S('execution_flow',
      OL(
        ['`print("Coins:", coins * 2)` — argumen dinilai dahulu: "Coins:" dan 240.', '`print("Coins:", coins * 2)` — arguments are evaluated first: "Coins:" and 240.'],
        ['`print` memanggil `tostring` pada setiap satu.', '`print` calls `tostring` on each.'],
        ['Teks ditulis dengan pemisah (tab di CLI, ruang di Studio) dan baris baharu di hujung.', 'The text is written with separators (tab in the CLI, space in Studio) and a newline at the end.'],
      )),
    S('memory_behaviour',
      P('Setiap `print` mencipta string sementara untuk setiap argumen yang ditukar, kemudian membuangnya. Dalam Roblox, setiap mesej juga disimpan dalam penimbal Output dan, untuk permainan yang diterbitkan, boleh dihantar ke konsol pembangun — `print` dalam gelung yang kerap (setiap bingkai) membazir memori dan prestasi, dan menenggelamkan mesej penting.',
        'Every `print` creates a temporary string for each converted argument, then discards it. In Roblox, every message is also stored in the Output buffer and, for published games, can be sent to the developer console — `print` in a frequent loop (every frame) wastes memory and performance, and drowns out important messages.')),
    S('alternative_implementations',
      P('Dalam Roblox, gunakan `warn` untuk masalah yang tidak menghentikan program dan `error` untuk yang menghentikan:', 'In Roblox, use `warn` for problems that do not stop the program and `error` for those that do:'),
      CODE('print-warn-error', 'luau', 'roblox', ['print, warn dan error dalam Studio (dikompil sahaja)', 'print, warn and error in Studio (compiled only)'], `
local Players = game:GetService("Players")

print("Server ready")
if #Players:GetPlayers() == 0 then
  warn("No players yet; waiting")
end

local maxPlayers = 8
if maxPlayers <= 0 then
  error("maxPlayers must be positive")
end
print(\`Up to {maxPlayers} players\`)
`),
      EXPLAIN('print-warn-error',
        ['1–3', 'Mesej putih biasa dalam Output.', 'An ordinary white message in the Output.'],
        ['4–6', '`warn` — mesej kuning; skrip terus berjalan.', '`warn` — a yellow message; the script keeps running.'],
        ['8–12', '`error` — mesej merah dengan nama skrip dan baris; skrip berhenti. Di sini syaratnya palsu, jadi baris 12 dijangka dicetak. **Dikompil sahaja.**', '`error` — a red message with the script name and line; the script stops. Here the condition is false, so line 12 is expected to print. **Compiled only.**'])),
    S('common_mistakes',
      UL(
        ['Menggabungkan `nil` atau boolean dengan `..`.', 'Concatenating `nil` or a boolean with `..`.'],
        ['Mencetak table dan menjangka melihat kandungannya.', 'Printing a table and expecting to see its contents.'],
        ['Membiarkan `print` penyahpepijatan dalam kod yang diterbitkan.', 'Leaving debugging `print`s in published code.'],
        ['Menjangka output CLI dan Studio sama tepat (tab berbanding ruang).', 'Expecting CLI and Studio output to match exactly (tabs versus spaces).'],
      )),
    S('debugging',
      P('`print` ialah alat penyahpepijatan termudah: cetak nilai sebelum baris yang gagal untuk melihat apa yang sebenarnya ada. Labelkan setiap cetakan (`print("damage =", damage)`) supaya anda tahu nilai mana yang mana. Untuk melihat kandungan table, tulis fungsi kecil yang mencetak setiap pasangan kunci–nilai dalam susunan yang tetap:',
        '`print` is the simplest debugging tool: print values before the failing line to see what is really there. Label every print (`print("damage =", damage)`) so you know which value is which. To see a table’s contents, write a small function that prints every key–value pair in a fixed order:'),
      CODE('dump-table', 'luau', 'luau', ['Mencetak kandungan table', 'Printing a table’s contents'], `
local function dump(t): string
  local keys = {}
  for k in t do
    table.insert(keys, tostring(k))
  end
  table.sort(keys)
  local parts = {}
  for _, k in keys do
    table.insert(parts, \`{k}={t[k]}\`)
  end
  return "{" .. table.concat(parts, ", ") .. "}"
end

print(dump({coins = 50, name = "Aina", vip = false}))
`, '{coins=50, name=Aina, vip=false}'),
      EXPLAIN('dump-table',
        ['1–6', 'Kumpul kunci sebagai string dan isih — iterasi dictionary tidak tersusun.', 'Collect the keys as strings and sort them — dictionary iteration is unordered.'],
        ['7–11', 'Bina `kunci=nilai` bagi setiap kunci; interpolasi menukar `false` dengan selamat.', 'Build `key=value` for each key; interpolation converts `false` safely.'],
        ['14', 'Satu baris yang boleh dibaca, sama pada setiap larian.', 'One readable line, identical on every run.'])),
    S('performance',
      P('`print` agak perlahan berbanding pengiraan biasa kerana ia menulis ke terminal atau Output. Dalam Roblox, mencetak setiap bingkai (60 kali sesaat) boleh menjejaskan kadar bingkai Studio. Untuk penyahpepijatan yang kerap, cetak hanya apabila nilai berubah, atau kumpul data dan cetak ringkasan.',
        '`print` is fairly slow compared with ordinary computation because it writes to the terminal or the Output. In Roblox, printing every frame (60 times a second) can hurt Studio’s frame rate. For frequent debugging, print only when a value changes, or collect data and print a summary.')),
    S('software_engineering',
      P('Cetakan penyahpepijatan tanpa label berbanding fungsi log berlabel yang boleh dimatikan:', 'Unlabelled debug prints versus a labelled log function that can be turned off:'),
      CODE('poor-bare-prints', 'luau', 'luau', ['Pelaksanaan lemah: cetakan tanpa label', 'Poor implementation: unlabelled prints'], `
local health, damage, armor = 100, 30, 0.5
print(health)
print(damage)
local taken = damage * (1 - armor)
print(taken)
print(health - taken)
`, '100\n30\n15\n85'),
      EXPLAIN('poor-bare-prints',
        ['1–6', 'Empat nombor tanpa konteks: selepas beberapa minit, tiada siapa ingat nombor mana yang mana, dan cetakan ini mesti dipadam satu demi satu sebelum diterbitkan.', 'Four numbers without context: after a few minutes nobody remembers which is which, and these prints must be deleted one by one before publishing.']),
      CODE('improved-debug-log', 'luau', 'luau', ['Pelaksanaan lebih baik: log berlabel dengan suis', 'Improved implementation: a labelled log with a switch'], `
local DEBUG = true

local function debugLog(label: string, value)
  if DEBUG then
    print(\`[debug] {label} = {value}\`)
  end
end

local health, damage, armor = 100, 30, 0.5
local taken = damage * (1 - armor)
debugLog("taken", taken)
debugLog("health after", health - taken)
`, '[debug] taken = 15\n[debug] health after = 85'),
      EXPLAIN('improved-debug-log',
        ['1', 'Satu suis: tukar kepada `false` untuk mematikan semua log sekali gus.', 'One switch: change it to `false` to turn off every log at once.'],
        ['3–7', 'Setiap mesej mempunyai awalan dan label.', 'Every message has a prefix and a label.'],
        ['9–12', 'Hanya nilai yang penting dilog, dengan nama.', 'Only the values that matter are logged, with names.'])),
    S('industry_use_cases',
      UL(
        ['Pembangun Roblox membaca Output dan Developer Console (F9) dalam pelayan langsung untuk menyiasat laporan pepijat.', 'Roblox developers read the Output and the Developer Console (F9) on live servers to investigate bug reports.'],
        ['Modul log dengan tahap (debug, info, warn) ialah corak biasa dalam projek besar.', 'Logging modules with levels (debug, info, warn) are a common pattern in large projects.'],
        ['Alat analitik Roblox menggantikan `print` untuk data pengeluaran yang perlu disimpan.', 'Roblox’s analytics tools replace `print` for production data that must be kept.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `print-basics` dalam CLI dan dalam Command Bar Studio; bandingkan pemisah.', 'Run `print-basics` in the CLI and in Studio’s Command Bar; compare the separators.'],
        ['Tambah medan `level = 3` pada `dump-table` dan ramalkan kedudukannya dalam output.', 'Add a field `level = 3` to `dump-table` and predict its position in the output.'],
        ['Jalankan kedua-dua versi berpepijat dan baca jenis yang disebut dalam setiap mesej.', 'Run both buggy versions and read the types named in each message.'],
      )),
    S('mini_project',
      P('**Papan skor teks.** Cetak papan skor yang kemas untuk beberapa pemain dengan lajur yang dijajarkan, menggunakan `string.format` dan bukannya tab.', '**A text scoreboard.** Print a tidy scoreboard for several players with aligned columns, using `string.format` instead of tabs.'),
      CODE('scoreboard', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local players = {
  {name = "Aina", kills = 12, deaths = 3},
  {name = "Ben", kills = 7, deaths = 7},
  {name = "Chen", kills = 15, deaths = 10},
}

print(string.format("%-6s %5s %6s %5s", "Name", "Kills", "Deaths", "K/D"))
for _, p in players do
  local kd = p.kills / math.max(p.deaths, 1)
  print(string.format("%-6s %5d %6d %5.2f", p.name, p.kills, p.deaths, kd))
end
`, 'Name   Kills Deaths   K/D\nAina      12      3  4.00\nBen        7      7  1.00\nChen      15     10  1.50'),
      EXPLAIN('scoreboard',
        ['1–5', 'Data pemain sebagai senarai table.', 'Player data as a list of tables.'],
        ['7', 'Pengepala: `%-6s` rata kiri dalam 6 aksara; `%5s` rata kanan dalam 5.', 'The header: `%-6s` left-aligned in 6 characters; `%5s` right-aligned in 5.'],
        ['8–11', 'Setiap baris menggunakan lebar yang sama; `math.max(…, 1)` mengelak pembahagian dengan sifar; `%5.2f` memberi dua tempat perpuluhan. Output sama dalam CLI dan Studio kerana `print` menerima satu string.', 'Each row uses the same widths; `math.max(…, 1)` avoids division by zero; `%5.2f` gives two decimal places. The output is identical in the CLI and Studio because `print` receives one string.'])),
    S('summary',
      UL(
        ['`print` menukar setiap argumen dengan `tostring`; tab dalam CLI, ruang dalam Roblox.', '`print` converts every argument with `tostring`; tabs in the CLI, spaces in Roblox.'],
        ['`..` hanya untuk string dan nombor; gunakan interpolasi untuk nilai lain.', '`..` is only for strings and numbers; use interpolation for other values.'],
        ['Table dicetak sebagai alamat — cetak medannya sendiri.', 'Tables print as an address — print their fields yourself.'],
        ['Roblox menambah `warn` dan tetingkap Output dengan nama skrip dan baris.', 'Roblox adds `warn` and an Output window with script names and lines.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dicetak oleh `print(nil, false)`?', 'What does `print(nil, false)` print?'],
        ['Mengapakah `"a" .. nil` gagal tetapi `print("a", nil)` berjaya?', 'Why does `"a" .. nil` fail but `print("a", nil)` succeed?'],
        ['Bagaimanakah output `print("x", 1)` berbeza dalam CLI dan Studio?', 'How does the output of `print("x", 1)` differ between the CLI and Studio?'],
        ['Bilakah anda menggunakan `warn` dan bukannya `print`?', 'When do you use `warn` instead of `print`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Output window (Roblox Studio)', url: `${DOCS}/studio/output` },
        { title: 'Roblox globals — print and warn', url: `${DOCS}/reference/engine/globals/LuaGlobals#print` },
        { title: 'Luau — Library (tostring, string.format)', url: `${LUAU}/library` },
        { title: 'Luau — String interpolation', url: `${LUAU}/syntax#string-interpolation` },
      )),
  ],
};

// ─── 3.2 Comments, blocks and basic syntax ─────────────────────────────────

export const LUAU101_3_2: LectureContentDef = {
  courseCode: 'LUAU101',
  module: 3,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis komen satu baris `--`, komen blok `--[[ ]]` dan komen bertahap `--[=[ ]=]`.', 'Write single-line comments `--`, block comments `--[[ ]]` and levelled comments `--[=[ ]=]`.'],
        ['Mengenali arahan komen Luau seperti `--!strict`.', 'Recognise Luau comment directives such as `--!strict`.'],
        ['Menerangkan blok, kata kunci penutup `end`, dan inden.', 'Explain blocks, the closing keyword `end`, and indentation.'],
        ['Menamakan pemboleh ubah dengan betul: kepekaan huruf, kata simpanan dan kata kunci kontekstual.', 'Name variables correctly: case sensitivity, reserved words and contextual keywords.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1: `print` dan string.', 'Lecture 3.1: `print` and strings.'],
      )),
    S('introduction',
      P('Sebelum menulis program yang lebih besar, anda perlukan tatabahasa asas Luau: bagaimana pernyataan disusun, bagaimana blok dibuka dan ditutup, bagaimana menamakan sesuatu, dan bagaimana meninggalkan nota untuk manusia dalam bentuk komen. Sintaks ini sebahagian besarnya diwarisi daripada Lua 5.1, dengan dua tambahan khas Luau: **arahan komen** seperti `--!strict` yang mengawal penganalisis, dan **kata kunci kontekstual** (`continue`, `type`, `export`) yang boleh menjadi nama dalam kod lama.',
        'Before writing bigger programs you need Luau’s basic grammar: how statements are arranged, how blocks are opened and closed, how to name things, and how to leave notes for humans as comments. This syntax is mostly inherited from Lua 5.1, with two Luau-specific additions: **comment directives** such as `--!strict` that control the analyser, and **contextual keywords** (`continue`, `type`, `export`) that can still be names in old code.'),
      KEY('Setiap `function`, `if`, `for`, `while` dan `do` dibuka mesti ditutup dengan `end`; `repeat` ditutup dengan `until`.', 'Every `function`, `if`, `for`, `while` and `do` that opens must be closed with `end`; `repeat` is closed with `until`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Komen:** `--` hingga hujung baris; `--[[ … ]]` merentas baris; `--[==[ … ]==]` jika kandungan mengandungi `]]`.', '**Comments:** `--` to the end of the line; `--[[ … ]]` across lines; `--[==[ … ]==]` if the content contains `]]`.'],
        ['**Arahan:** `--!strict`, `--!nonstrict`, `--!nocheck`, `--!native`, `--!optimize 2` pada baris pertama fail.', '**Directives:** `--!strict`, `--!nonstrict`, `--!nocheck`, `--!native`, `--!optimize 2` on the file’s first line.'],
        ['**Blok:** kumpulan pernyataan antara kata kunci pembuka dan `end`; inden ialah untuk manusia, bukan untuk Luau.', '**Blocks:** a group of statements between an opening keyword and `end`; indentation is for humans, not for Luau.'],
        ['**Nama:** huruf, digit dan `_`, tidak bermula dengan digit; peka huruf (`Score` ≠ `score`).', '**Names:** letters, digits and `_`, not starting with a digit; case-sensitive (`Score` ≠ `score`).'],
        ['**Kata simpanan** (`end`, `local`, `if`, …) tidak boleh menjadi nama; **kontekstual** (`continue`, `type`) boleh.', '**Reserved words** (`end`, `local`, `if`, …) cannot be names; **contextual** ones (`continue`, `type`) can.'],
      )),
    S('detailed_theory',
      P('Luau tidak mempunyai pemisah pernyataan yang wajib: baris baharu dan ruang tidak bermakna kepada penghurai, dan `;` adalah pilihan. Penghurai membaca token demi token dan tahu di mana satu pernyataan tamat kerana tatabahasanya tidak samar — dengan satu pengecualian terkenal: baris yang bermula dengan `(` boleh dibaca sebagai panggilan pada ungkapan baris sebelumnya. Blok ditentukan sepenuhnya oleh kata kunci; inden yang salah tidak menyebabkan ralat, tetapi menyembunyikan kesilapan seperti `end` yang hilang. Itulah sebabnya editor Studio dan alat seperti StyLua memformat inden secara automatik.',
        'Luau has no mandatory statement separator: newlines and spaces mean nothing to the parser, and `;` is optional. The parser reads token by token and knows where one statement ends because the grammar is unambiguous — with one famous exception: a line starting with `(` can be read as a call on the previous line’s expression. Blocks are defined entirely by keywords; wrong indentation causes no error, but it hides mistakes such as a missing `end`. That is why Studio’s editor and tools such as StyLua format indentation automatically.'),
      P('Komen bermula dengan `--`. Jika terus diikuti oleh `[[` atau `[=[`, ia menjadi komen blok yang berakhir pada `]]` atau `]=]` yang sepadan. Komen `--!` pada baris pertama fail ialah **arahan** yang dibaca oleh penganalisis dan pengkompil Luau: `--!strict` mengaktifkan semakan jenis penuh dalam Studio, dan `--!native` meminta penjanaan kod asli dalam Roblox. Kepada VM, ia hanyalah komen — menjalankan fail dengan `--!strict` tidak mengubah tingkah laku runtime. Kata kunci kontekstual wujud kerana keserasian: `continue` ialah kata kunci hanya apabila ia muncul sebagai pernyataan sendiri dalam gelung; `local continue = 3` masih sah, seperti dalam kod Lua 5.1 lama.',
        'Comments start with `--`. If immediately followed by `[[` or `[=[`, it becomes a block comment ending at the matching `]]` or `]=]`. A `--!` comment on a file’s first line is a **directive** read by Luau’s analyser and compiler: `--!strict` turns on full type checking in Studio, and `--!native` asks Roblox for native code generation. To the VM it is just a comment — running a file with `--!strict` does not change run-time behaviour. Contextual keywords exist for compatibility: `continue` is a keyword only when it appears as a statement of its own inside a loop; `local continue = 3` is still valid, as in old Lua 5.1 code.')),
    S('technical_terminology', TERMS('comment', 'reserved-word', 'block', 'syntax-error')),
    S('syntax_rules',
      UL(
        ['`-- komen`, `--[[ komen\\nberbilang baris ]]`, `--[=[ mengandungi ]] ]=]`.', '`-- comment`, `--[[ multi-line\\ncomment ]]`, `--[=[ contains ]] ]=]`.'],
        ['Kata simpanan Luau: `and break do else elseif end false for function if in local nil not or repeat return then true until while`.', 'Luau reserved words: `and break do else elseif end false for function if in local nil not or repeat return then true until while`.'],
        ['Konvensyen Roblox: `camelCase` untuk local, `PascalCase` untuk perkhidmatan dan modul, `UPPER_CASE` untuk pemalar.', 'Roblox conventions: `camelCase` for locals, `PascalCase` for services and modules, `UPPER_CASE` for constants.'],
      )),
    S('code_demonstration',
      CODE('comment-styles', 'luau', 'luau', ['Gaya komen', 'Comment styles'], `
--!strict
-- Calculates the reward for finishing a level.

--[[
  Rules:
  - base reward is 100 coins
  - each star adds 25
]]
local BASE_REWARD = 100
local PER_STAR = 25 -- per collected star

local stars = 3
print(BASE_REWARD + stars * PER_STAR) --[[ 175 ]]
`, '175'),
      EXPLAIN('comment-styles',
        ['1', 'Arahan `--!strict`: penganalisis Studio akan menyemak jenis. VM menganggapnya komen.', 'The `--!strict` directive: Studio’s analyser will check types. The VM treats it as a comment.'],
        ['2', 'Komen satu baris yang menerangkan tujuan fail.', 'A single-line comment explaining the file’s purpose.'],
        ['4–8', 'Komen blok untuk penerangan berbilang baris.', 'A block comment for a multi-line description.'],
        ['9–10', 'Pemalar `UPPER_CASE`; komen di hujung baris kod.', '`UPPER_CASE` constants; a comment at the end of a code line.'],
        ['12–13', 'Komen blok sebaris selepas kod.', 'An inline block comment after code.'])),
    S('complete_examples',
      CODE('blocks-and-end', 'luau', 'luau', ['Blok bersarang dan end', 'Nested blocks and end'], `
local function describeScore(score: number): string
  if score >= 90 then
    return "excellent"
  elseif score >= 50 then
    for _ = 1, 1 do
      if score == 50 then
        return "just passed"
      end
    end
    return "passed"
  end
  return "failed"
end

print(describeScore(95), describeScore(50), describeScore(70), describeScore(10))
`, 'excellent\tjust passed\tpassed\tfailed', {
        debug: BUG(`
local function describeScore(score: number): string
  local label = "failed"
  if score >= 90 then
    label = "excellent"
  elseif score >= 50 then
    label = "passed"
  return label
end
`, "example:8: Expected 'end' (to close 'function' at line 1), got <eof>; did you forget to close 'then' at line 5?",
          '`end` untuk `if` (baris 3) hilang. Luau menganggap `return label` sebahagian daripada cabang `elseif`, dan `end` baris 8 menutup `if` — jadi fungsi tidak pernah ditutup. Apabila sampai ke hujung fail, Luau melaporkan blok luar yang masih terbuka (`function at line 1`) dan menambah petunjuk yang berguna: `did you forget to close \'then\' at line 5?` — `then` cabang `elseif`. Kira pasangan pembuka/`end` dari atas; editor Studio menunjukkan garis panduan inden untuk membantu.',
          'The `end` for the `if` (line 3) is missing. Luau treats `return label` as part of the `elseif` branch, and the `end` on line 8 closes the `if` — so the function is never closed. At the end of the file, Luau reports the outer block still open (`function at line 1`) and adds a helpful hint: `did you forget to close \'then\' at line 5?` — the `then` of the `elseif` branch. Count opener/`end` pairs from the top; Studio’s editor shows indentation guides to help.'),
      }),
      EXPLAIN('blocks-and-end',
        ['1', 'Blok `function` dibuka.', 'A `function` block opens.'],
        ['2–3', 'Blok `if` di dalamnya.', 'An `if` block inside it.'],
        ['4–10', 'Cabang `elseif` mengandungi gelung `for`, yang mengandungi `if` lagi — tiga tahap bersarang, setiap satu dengan `end` sendiri.', 'The `elseif` branch contains a `for` loop, which contains another `if` — three nested levels, each with its own `end`.'],
        ['12', 'Dicapai hanya jika tiada `return` sebelumnya berlaku.', 'Reached only if no earlier `return` happened.'],
        ['15', 'Empat ujian, satu bagi setiap laluan.', 'Four tests, one per path.']),
      CODE('names-and-case', 'luau', 'luau', ['Nama, kepekaan huruf dan kata kunci kontekstual', 'Names, case sensitivity and contextual keywords'], `
local score = 10
local Score = 99
local _private = "hidden"
local player2 = "Ben"
local continue = "contextual keyword used as a name"

print(score, Score)
print(_private, player2)
print(continue)
`, '10\t99\nhidden\tBen\ncontextual keyword used as a name', {
        debug: BUG(`
local end = 5
print(end)
`, "example:1: Expected identifier when parsing variable name, got 'end'",
          '`end` ialah kata simpanan; ia tidak boleh menjadi nama pemboleh ubah. Penghurai menjangka pengecam selepas `local` dan menemui kata kunci. Pilih nama lain, contohnya `finish` atau `endTime`. Berbeza daripada `continue` (baris 5 dalam versi asal), yang hanya kata kunci kontekstual.',
          '`end` is a reserved word; it cannot be a variable name. The parser expects an identifier after `local` and finds a keyword. Choose another name, for example `finish` or `endTime`. Unlike `continue` (line 5 in the original), which is only a contextual keyword.'),
      }),
      EXPLAIN('names-and-case',
        ['1–2', '`score` dan `Score` ialah dua pemboleh ubah berbeza kerana Luau peka huruf.', '`score` and `Score` are two different variables because Luau is case-sensitive.'],
        ['3–4', 'Garis bawah di permulaan dan digit selepas huruf pertama dibenarkan.', 'A leading underscore and digits after the first character are allowed.'],
        ['5', '`continue` boleh menjadi nama kerana ia kata kunci kontekstual — tetapi elakkannya dalam kod baharu supaya tidak mengelirukan.', '`continue` can be a name because it is a contextual keyword — but avoid it in new code so it does not confuse readers.'],
        ['7–9', 'Setiap nama memegang nilainya sendiri.', 'Each name holds its own value.'])),
    S('line_by_line',
      EXPLAIN('comment-styles',
        ['13', 'Komen blok boleh muncul di tengah atau hujung baris kod; ia tidak menjejaskan ungkapan di sekelilingnya.', 'A block comment can appear in the middle or at the end of a code line; it does not affect the surrounding expression.']),
      EXPLAIN('blocks-and-end',
        ['5', '`for _ = 1, 1` ialah gelung yang berjalan sekali — di sini hanya untuk menunjukkan bersarang. `_` bermaksud pemboleh ubah gelung tidak digunakan.', '`for _ = 1, 1` is a loop that runs once — here only to show nesting. `_` means the loop variable is not used.'])),
    S('why_this_way',
      P('Mengapa kata kunci dan bukan kurungan kerinting atau inden seperti Python? Lua direka untuk dibaca dengan mudah oleh bukan pengaturcara, dan `if … then … end` dibaca hampir seperti bahasa Inggeris. Luau mengekalkannya demi keserasian. Komen yang baik menerangkan **mengapa**, bukan **apa** — kod sudah menunjukkan apa yang dilakukannya.',
        'Why keywords rather than curly braces or indentation as in Python? Lua was designed to be easy for non-programmers to read, and `if … then … end` reads almost like English. Luau keeps it for compatibility. Good comments explain **why**, not **what** — the code already shows what it does.'),
      P('Tulis komen **apabila** sebab atau peraturan tidak jelas daripada kod; gunakan `--!strict` **apabila** fail sudah stabil dan anda mahu penganalisis menangkap ralat jenis.', 'Write comments **when** a reason or rule is not obvious from the code; use `--!strict` **when** a file is stable and you want the analyser to catch type errors.')),
    S('execution_flow',
      OL(
        ['Penghurai membuang komen semasa membaca fail — ia tidak wujud dalam bytecode.', 'The parser drops comments while reading the file — they do not exist in the bytecode.'],
        ['Penghurai memadankan setiap kata kunci pembuka dengan `end`; ketidakpadanan ialah ralat sintaks.', 'The parser matches every opening keyword with an `end`; a mismatch is a syntax error.'],
        ['Hanya selepas keseluruhan fail dihurai dengan jayanya, VM mula menjalankan baris 1.', 'Only after the whole file parses successfully does the VM start running line 1.'],
      )),
    S('memory_behaviour',
      P('Komen dan inden tidak menggunakan memori runtime kerana ia dibuang semasa kompil. Fail besar dengan banyak komen tidak lebih perlahan atau lebih berat semasa berjalan. Nama pemboleh ubah local juga hilang dalam bytecode (diganti dengan nombor daftar), kecuali maklumat nyahpepijat untuk mesej ralat.',
        'Comments and indentation use no run-time memory because they are discarded during compilation. A large file with many comments is not slower or heavier at run time. Local variable names also disappear from the bytecode (replaced by register numbers), except for debug information used in error messages.')),
    S('alternative_implementations',
      P('Komen bertahap membolehkan anda "mematikan" kod yang mengandungi `]]` atau komen blok lain:', 'Levelled comments let you "switch off" code that contains `]]` or other block comments:'),
      CODE('levelled-comment', 'luau', 'luau', ['Mematikan kod dengan komen bertahap', 'Switching off code with a levelled comment'], `
local data = {matrix = {{1, 2}, {3, 4}}}

--[=[
print(data.matrix[1][2]) --[[ old debug print ]]
print(data[[not a real call]])
]=]

print("active code:", data.matrix[2][1])
`, 'active code:\t3'),
      EXPLAIN('levelled-comment',
        ['1', 'Table bersarang; perhatikan `]]` dalam kod.', 'A nested table; note the `]]` in code.'],
        ['3–6', '`--[=[ … ]=]` menutup hanya pada `]=]`, jadi `]]` dan komen blok di dalamnya tidak menamatkannya terlalu awal.', '`--[=[ … ]=]` closes only at `]=]`, so the `]]` and the block comment inside do not end it too early.'],
        ['8', 'Hanya baris ini dijalankan.', 'Only this line runs.'])),
    S('common_mistakes',
      UL(
        ['Terlupa `end` — atau menambah `end` tambahan.', 'Forgetting an `end` — or adding an extra one.'],
        ['Menggunakan kata simpanan sebagai nama (`local end`, `local function then()`).', 'Using reserved words as names (`local end`, `local function then()`).'],
        ['Menulis `Print` atau `Local` — Luau peka huruf.', 'Writing `Print` or `Local` — Luau is case-sensitive.'],
        ['Komen yang mengulang kod (`x += 1 -- add one to x`) dan bukannya menerangkan sebabnya.', 'Comments that repeat the code (`x += 1 -- add one to x`) instead of explaining why.'],
      )),
    S('debugging',
      P('Ralat sintaks melaporkan baris di mana penghurai **menyedari** masalah, yang selalunya selepas kesilapan sebenar. `Expected \'end\' (to close \'function\' at line 1), got <eof>` bermaksud: di hujung fail, fungsi dari baris 1 masih terbuka — `end` yang hilang boleh berada di mana-mana di antaranya. Satu teknik: komen keluar separuh fail dengan `--[[ ]]` dan lihat sama ada ralat hilang, kemudian sempitkan. Kesilapan huruf besar pula menjadi ralat runtime:',
        'A syntax error reports the line where the parser **noticed** the problem, which is often after the real mistake. `Expected \'end\' (to close \'function\' at line 1), got <eof>` means: at the end of the file, the function from line 1 is still open — the missing `end` could be anywhere in between. One technique: comment out half the file with `--[[ ]]` and see whether the error disappears, then narrow down. Case mistakes, by contrast, become runtime errors:'),
      CODE('case-matters', 'luau', 'luau', ['Huruf besar/kecil dalam nama fungsi', 'Case in function names'], `
local function greetPlayer(name: string)
  print(\`Welcome, {name}!\`)
end

greetPlayer("Dewi")
print(typeof(greetPlayer), typeof(GreetPlayer))
`, 'Welcome, Dewi!\nfunction\tnil'),
      EXPLAIN('case-matters',
        ['1–3', 'Fungsi bernama `greetPlayer` (huruf kecil g).', 'A function named `greetPlayer` (lower-case g).'],
        ['5', 'Panggilan yang betul.', 'The correct call.'],
        ['6', '`GreetPlayer` (G besar) ialah nama **lain** yang tidak wujud — global `nil`. Memanggilnya akan memberi `attempt to call a nil value`.', '`GreetPlayer` (capital G) is a **different** name that does not exist — a `nil` global. Calling it would give `attempt to call a nil value`.'])),
    S('performance',
      P('Sintaks tidak mempengaruhi prestasi: inden, komen, `;` dan panjang nama local tiada kos runtime. `--!native` dan `--!optimize 2` ialah satu-satunya arahan komen yang mempengaruhi kelajuan, dan hanya dalam Roblox; untuk kod pemula, ia tidak diperlukan.',
        'Syntax does not affect performance: indentation, comments, `;` and local name length have no run-time cost. `--!native` and `--!optimize 2` are the only comment directives that affect speed, and only in Roblox; beginner code does not need them.')),
    S('software_engineering',
      P('Komen yang mengulang kod berbanding komen yang menerangkan sebab:', 'Comments that repeat the code versus comments that explain the reason:'),
      CODE('poor-noisy-comments', 'luau', 'luau', ['Pelaksanaan lemah: komen yang bising', 'Poor implementation: noisy comments'], `
-- set x to 3
local x = 3
-- multiply x by 40
local y = x * 40
-- print y
print(y)
`, '120'),
      EXPLAIN('poor-noisy-comments',
        ['1–6', 'Setiap komen mengulang baris di bawahnya; nama `x` dan `y` tidak bermakna. Pembaca tidak tahu **mengapa** 3 atau 40.', 'Every comment repeats the line below it; the names `x` and `y` mean nothing. The reader does not know **why** 3 or 40.']),
      CODE('improved-meaningful-names', 'luau', 'luau', ['Pelaksanaan lebih baik: nama yang bermakna dan satu komen "mengapa"', 'Improved implementation: meaningful names and one "why" comment'], `
local LIVES_AT_START = 3
-- Each remaining life is worth 40 points so careful players are rewarded.
local POINTS_PER_LIFE = 40

local livesLeft = LIVES_AT_START
print(livesLeft * POINTS_PER_LIFE)
`, '120'),
      EXPLAIN('improved-meaningful-names',
        ['1–3', 'Nama menerangkan **apa**; komen menerangkan **mengapa** peraturan itu wujud.', 'The names explain **what**; the comment explains **why** the rule exists.'],
        ['5–6', 'Kod dibaca seperti ayat.', 'The code reads like a sentence.'])),
    S('industry_use_cases',
      UL(
        ['StyLua — pemformat Luau yang popular — menyeragamkan inden dan gaya dalam pasukan.', 'StyLua — a popular Luau formatter — standardises indentation and style across a team.'],
        ['Panduan gaya Roblox (Roblox Lua Style Guide) menetapkan konvensyen penamaan yang digunakan secara meluas.', 'The Roblox Lua Style Guide defines naming conventions used widely.'],
        ['Fail dengan `--!strict` di baris pertama ialah norma dalam pustaka sumber terbuka Roblox.', 'Files with `--!strict` on the first line are the norm in Roblox open-source libraries.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah komen "mengapa" pada `blocks-and-end`.', 'Add a "why" comment to `blocks-and-end`.'],
        ['Buang satu `end` daripada `blocks-and-end` (di tempat lain daripada versi berpepijat) dan ramalkan mesej ralat.', 'Remove one `end` from `blocks-and-end` (somewhere other than in the buggy version) and predict the error message.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Fail yang didokumenkan dengan baik.** Tulis program kecil pengira ganjaran harian dengan pengepala komen, pemalar bernama, dan komen "mengapa" di tempat yang perlu.', '**A well-documented file.** Write a small daily-reward calculator with a header comment, named constants, and "why" comments where needed.'),
      CODE('daily-reward', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
--!strict
--[[
  Daily reward calculator.
  Streak bonus is capped so long streaks cannot break the in-game economy.
]]

local BASE_REWARD = 50
local BONUS_PER_DAY = 10
local MAX_BONUS = 100 -- cap agreed with the economy designer

local function dailyReward(streakDays: number): number
  local bonus = math.min(streakDays * BONUS_PER_DAY, MAX_BONUS)
  return BASE_REWARD + bonus
end

for _, days in {1, 5, 30} do
  print(\`day {days}: {dailyReward(days)} coins\`)
end
`, 'day 1: 60 coins\nday 5: 100 coins\nday 30: 150 coins'),
      EXPLAIN('daily-reward',
        ['1–5', 'Arahan dan pengepala yang menerangkan tujuan dan **sebab** had.', 'A directive and a header explaining the purpose and the **reason** for the cap.'],
        ['7–9', 'Pemalar bernama; komen merekod keputusan reka bentuk.', 'Named constants; a comment records a design decision.'],
        ['11–14', 'Fungsi ringkas dengan nama yang menerangkan dirinya.', 'A short function whose name explains itself.'],
        ['16–18', 'Tiga hari ujian: had dicapai pada hari ke-30.', 'Three test days: the cap is reached on day 30.'])),
    S('summary',
      UL(
        ['`--`, `--[[ ]]`, `--[=[ ]=]`; `--!` pada baris pertama ialah arahan.', '`--`, `--[[ ]]`, `--[=[ ]=]`; `--!` on the first line is a directive.'],
        ['Blok ditutup dengan `end` (atau `until`); inden untuk manusia.', 'Blocks close with `end` (or `until`); indentation is for humans.'],
        ['Nama peka huruf; kata simpanan dilarang; kata kunci kontekstual dibenarkan.', 'Names are case-sensitive; reserved words are forbidden; contextual keywords are allowed.'],
        ['Komen menerangkan "mengapa"; nama menerangkan "apa".', 'Comments explain "why"; names explain "what".'],
      )),
    S('knowledge_check',
      OL(
        ['Bilakah anda memerlukan `--[=[ ]=]` dan bukan `--[[ ]]`?', 'When do you need `--[=[ ]=]` instead of `--[[ ]]`?'],
        ['Adakah `--!strict` mengubah output program? Mengapa?', 'Does `--!strict` change a program’s output? Why?'],
        ['Mengapakah `local continue = 1` sah tetapi `local end = 1` tidak?', 'Why is `local continue = 1` valid but `local end = 1` is not?'],
        ['Mengapakah ralat `end` yang hilang sering dilaporkan pada `<eof>`?', 'Why is a missing-`end` error often reported at `<eof>`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax', url: `${LUAU}/syntax` },
        { title: 'Luau — Type checking modes (--!strict)', url: `${LUAU}/typecheck` },
        { title: 'Roblox Lua Style Guide', url: 'https://roblox.github.io/lua-style-guide/' },
        { title: 'StyLua — opinionated Lua/Luau formatter', url: 'https://github.com/JohnnyMorganz/StyLua' },
      )),
  ],
};

// ─── 3.3 Script Analysis and editor warnings ───────────────────────────────

export const LUAU101_3_3: LectureContentDef = {
  courseCode: 'LUAU101',
  module: 3,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan apa yang dilakukan oleh [[script-analysis|Script Analysis]] dan `luau-analyze`.', 'Explain what [[script-analysis|Script Analysis]] and `luau-analyze` do.'],
        ['Mengenal pasti amaran lint biasa: global tidak diketahui, local tidak digunakan, bayangan, kod tidak boleh dicapai.', 'Recognise common lint warnings: unknown global, unused local, shadowing, unreachable code.'],
        ['Membezakan amaran lint, ralat jenis dan ralat sintaks.', 'Distinguish lint warnings, type errors and syntax errors.'],
        ['Menerangkan dengan tepat apa yang disahkan dan tidak disahkan oleh kursus ini.', 'State precisely what this course verifies and does not verify.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.2: arahan `--!strict` dan sintaks asas.', 'Lecture 3.2: the `--!strict` directive and basic syntax.'],
      )),
    S('introduction',
      P('Banyak pepijat boleh ditemui tanpa menjalankan program. Penganalisis Luau membaca kod anda, membina model tentang pemboleh ubah dan jenisnya, dan memberi amaran tentang perkara yang mencurigakan: nama yang tidak pernah ditakrif, pemboleh ubah yang tidak digunakan, kod selepas `return`, atau nombor yang dihantar ke tempat yang menjangka string. Dalam Roblox Studio, keputusan ini muncul sebagai garis beralun di bawah kod dan dalam panel Script Analysis; di luar Studio, alat `luau-analyze` melakukan perkara yang sama.',
        'Many bugs can be found without running the program. The Luau analyser reads your code, builds a model of its variables and their types, and warns about suspicious things: names never defined, unused variables, code after `return`, or a number passed where a string is expected. In Roblox Studio, these results appear as squiggly underlines and in the Script Analysis panel; outside Studio, the `luau-analyze` tool does the same.'),
      KEY('Analisis statik menangkap pepijat **sebelum** program berjalan — jika anda membaca amarannya.', 'Static analysis catches bugs **before** the program runs — if you read its warnings.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Ralat sintaks:** kod tidak boleh dihurai; tiada apa-apa berjalan. Sentiasa merah.', '**Syntax error:** the code cannot be parsed; nothing runs. Always red.'],
        ['**Amaran lint:** kod sah tetapi mencurigakan (contohnya `UnknownGlobal`, `LocalUnused`, `LocalShadow`, `UnreachableCode`). Program masih berjalan.', '**Lint warning:** valid but suspicious code (for example `UnknownGlobal`, `LocalUnused`, `LocalShadow`, `UnreachableCode`). The program still runs.'],
        ['**Ralat jenis:** dengan `--!strict`, penggunaan yang bercanggah dengan jenis. Program **masih berjalan**; VM tidak menyemak jenis.', '**Type error:** with `--!strict`, a use that contradicts the types. The program **still runs**; the VM does not check types.'],
        ['**Status dalam kursus ini:** ralat sintaks dan runtime disahkan; amaran lint dan ralat jenis **diterangkan sahaja** (luau-analyze tidak dijalankan).', '**Status in this course:** syntax and runtime errors are verified; lint warnings and type errors are **described only** (luau-analyze is not run).'],
      )),
    S('detailed_theory',
      P('Penganalisis Luau berfungsi dalam dua lapisan. **Linter** mencari corak yang hampir selalu kesilapan, tanpa mengira jenis: global yang dibaca tetapi tidak pernah ditulis (biasanya salah ejaan), local yang ditulis tetapi tidak pernah dibaca, local yang membayangi local lain dengan nama sama, dan kod yang tidak boleh dicapai. **Penyemak jenis** membina jenis untuk setiap ungkapan — daripada anotasi anda dan daripada inferens — dan melaporkan percanggahan. Mod `--!nonstrict` (lalai dalam Roblox) hanya melaporkan percanggahan yang pasti; `--!strict` melaporkan setiap perkara yang tidak dapat dibuktikan selamat; `--!nocheck` mematikan semakan jenis.',
        'The Luau analyser works in two layers. The **linter** looks for patterns that are almost always mistakes, regardless of types: a global that is read but never written (usually a typo), a local written but never read, a local that shadows another with the same name, and unreachable code. The **type checker** builds a type for every expression — from your annotations and by inference — and reports contradictions. `--!nonstrict` mode (the default in Roblox) only reports definite contradictions; `--!strict` reports everything it cannot prove safe; `--!nocheck` turns type checking off.'),
      P('Perkara penting yang ramai pemula salah faham: amaran dan ralat jenis **tidak** menghalang program daripada berjalan. Luau ialah bahasa dinamik — VM melaksanakan kod tanpa melihat anotasi jenis. Jika anda mengabaikan garis beralun, pepijat yang diramal oleh penganalisis akan berlaku semasa runtime. Dalam kursus ini, kami boleh mengesahkan bahagian runtime itu dengan VM Luau: setiap contoh di bawah dijalankan, dan versi berpepijat menunjukkan ralat runtime yang sepatutnya ditangkap lebih awal oleh penganalisis. Nama amaran (`UnknownGlobal` dan lain-lain) adalah daripada dokumentasi lint Luau, tetapi output penganalisis itu sendiri tidak dijalankan oleh pengesahan kami.',
        'Something many beginners misunderstand: warnings and type errors do **not** stop the program from running. Luau is a dynamic language — the VM executes code without looking at type annotations. If you ignore the squiggles, the bug the analyser predicted will happen at run time. In this course we can verify that run-time part with the Luau VM: every example below is executed, and the buggy versions show the runtime errors the analyser should have caught earlier. The warning names (`UnknownGlobal` and others) come from Luau’s lint documentation, but the analyser’s own output is not run by our verification.')),
    S('technical_terminology', TERMS('script-analysis', 'type-annotation', 'luau-cli', 'runtime-error')),
    S('syntax_rules',
      UL(
        ['Mod semakan: `--!nocheck`, `--!nonstrict`, `--!strict` pada baris pertama.', 'Checking modes: `--!nocheck`, `--!nonstrict`, `--!strict` on the first line.'],
        ['Matikan satu amaran lint: `--!nolint LocalUnused` (gunakan dengan berhati-hati).', 'Turn off one lint warning: `--!nolint LocalUnused` (use sparingly).'],
        ['Di luar Studio: `luau-analyze fail.luau` mencetak setiap amaran dengan baris dan nama lint.', 'Outside Studio: `luau-analyze file.luau` prints every warning with its line and lint name.'],
      )),
    S('code_demonstration',
      CODE('lint-clean', 'luau', 'luau', ['Kod yang tidak mempunyai amaran', 'Code with no warnings'], `
--!strict
local function totalPrice(prices: {number}, discount: number): number
  local total = 0
  for _, price in prices do
    total += price
  end
  return total * (1 - discount)
end

print(totalPrice({10, 20, 30}, 0.25))
`, '45'),
      EXPLAIN('lint-clean',
        ['1', '`--!strict`: dalam Studio, setiap jenis diperiksa.', '`--!strict`: in Studio, every type is checked.'],
        ['2', 'Anotasi: senarai nombor, nombor, dan pulangan nombor.', 'Annotations: a list of numbers, a number, and a number result.'],
        ['3–7', 'Setiap local digunakan, tiada global, tiada kod tidak boleh dicapai — penganalisis tidak dijangka melaporkan apa-apa.', 'Every local is used, no globals, no unreachable code — the analyser is expected to report nothing.'],
        ['10', '60 × 0.75 = 45. Dijalankan dan disahkan.', '60 × 0.75 = 45. Executed and verified.'])),
    S('complete_examples',
      CODE('unknown-global', 'luau', 'luau', ['Global tersalah eja (UnknownGlobal)', 'A misspelled global (UnknownGlobal)'], `
local playerCoins = 100

local function spend(amount: number)
  playerCoins -= amount
  return playerCoins
end

print(spend(30))
print(spend(20))
`, '70\n50', {
        debug: BUG(`
local playerCoins = 100
local function spend(amount: number)
  playerCoins -= amount
  return playerCoin
end
print(spend(30) + 1)
`, 'example:6: attempt to perform arithmetic (add) on nil and number',
          '`playerCoin` (tanpa s) tidak pernah ditakrif, jadi ia global `nil` dan fungsi memulangkan `nil`. Penganalisis Studio akan menggariskan baris 4 dengan amaran **UnknownGlobal** sebelum anda menjalankannya (diterangkan, tidak disahkan di sini). Jika amaran diabaikan, ralat muncul semasa runtime pada baris 6 — jauh dari punca sebenar.',
          '`playerCoin` (without s) was never defined, so it is a `nil` global and the function returns `nil`. Studio’s analyser would underline line 4 with an **UnknownGlobal** warning before you run it (described, not verified here). If the warning is ignored, the error appears at run time on line 6 — far from the real cause.'),
      }),
      EXPLAIN('unknown-global',
        ['1', 'Keadaan local.', 'Local state.'],
        ['3–6', 'Fungsi yang mengubah dan memulangkan local yang sama — semua nama ditakrif.', 'A function that changes and returns the same local — every name is defined.'],
        ['8–9', 'Dua perbelanjaan: 70, kemudian 50.', 'Two purchases: 70, then 50.']),
      CODE('shadow-and-unused', 'luau', 'luau', ['Bayangan dan local tidak digunakan', 'Shadowing and unused locals'], `
local total = 0
local scores = {5, 8, 12}

for _, s in scores do
  total += s
end

print(total)
`, '25', {
        debug: BUG(`
local total = 0
local scores = {5, 8, 12}
for _, s in scores do
  local total = total + s
end
print(total)
error(\`expected 25, got {total}\`)
`, 'example:7: expected 25, got 0',
          'Di dalam gelung, `local total = total + s` mencipta local **baharu** yang membayangi `total` luar, dan hilang pada setiap `end`. `total` luar kekal 0. Penganalisis Studio akan memberi amaran **LocalShadow** (bayangan) dan **LocalUnused** (local dalam tidak pernah dibaca) — diterangkan, tidak disahkan di sini. Baris 7 menukar keputusan yang salah kepada ralat supaya ia disahkan sebagai kegagalan. Buang `local` di dalam gelung.',
          'Inside the loop, `local total = total + s` creates a **new** local that shadows the outer `total`, and vanishes at every `end`. The outer `total` stays 0. Studio’s analyser would warn **LocalShadow** and **LocalUnused** (the inner local is never read) — described, not verified here. Line 7 turns the wrong result into an error so it is verified as a failure. Remove `local` inside the loop.'),
      }),
      EXPLAIN('shadow-and-unused',
        ['1–2', 'Pengumpul dan data.', 'An accumulator and the data.'],
        ['4–6', '`total += s` tanpa `local` mengemas kini pemboleh ubah luar.', '`total += s` without `local` updates the outer variable.'],
        ['8', '5 + 8 + 12 = 25.', '5 + 8 + 12 = 25.'])),
    S('line_by_line',
      EXPLAIN('unknown-global',
        ['4', '`playerCoins -= amount` membaca dan menulis local yang sama. Jika anda tersalah eja di sebelah kiri `-=`, anda akan mencipta global baharu secara senyap — satu lagi kes untuk UnknownGlobal.', '`playerCoins -= amount` reads and writes the same local. Misspelling the left side of `-=` would silently create a new global — another case for UnknownGlobal.']),
      EXPLAIN('lint-clean',
        ['4', 'Iterasi umum atas senarai; pemboleh ubah `_` menandakan indeks tidak digunakan, jadi tiada amaran LocalUnused.', 'Generalized iteration over a list; the `_` variable marks the index as unused, so there is no LocalUnused warning.'])),
    S('why_this_way',
      P('Mengapa bergantung pada analisis statik? Kerana pepijat yang ditemui semasa menaip lebih murah daripada pepijat yang ditemui oleh pemain. Ralat ejaan seperti `playerCoin` mungkin hanya berlaku dalam laluan kod yang jarang — contohnya pembelian pertama pemain — dan tidak dikesan dalam ujian ringkas. Penganalisis menyemak setiap baris, termasuk yang jarang berjalan.',
        'Why rely on static analysis? Because a bug found while typing is cheaper than a bug found by players. A typo such as `playerCoin` may only happen on a rare code path — for example a player’s first purchase — and go unnoticed in quick tests. The analyser checks every line, including rarely run ones.'),
      P('Baca setiap garis beralun **sebelum** menekan Play; gunakan `--!strict` **apabila** kod stabil dan penting; jangan matikan amaran **kecuali** anda pasti ia salah.', 'Read every squiggle **before** pressing Play; use `--!strict` **when** code is stable and important; do not silence warnings **unless** you are sure they are wrong.')),
    S('execution_flow',
      OL(
        ['Anda menaip dalam editor Studio → penganalisis berjalan di latar belakang pada setiap perubahan.', 'You type in Studio’s editor → the analyser runs in the background on every change.'],
        ['Amaran muncul sebagai garis beralun dan dalam panel Script Analysis (View → Script Analysis).', 'Warnings appear as squiggles and in the Script Analysis panel (View → Script Analysis).'],
        ['Menekan Play menjalankan kod **tanpa mengira** amaran; hanya ralat sintaks menghalangnya.', 'Pressing Play runs the code **regardless** of warnings; only syntax errors prevent it.'],
      )),
    S('memory_behaviour',
      P('Penganalisis berjalan dalam Studio (atau `luau-analyze`), bukan dalam permainan yang diterbitkan, jadi ia tidak menggunakan memori atau masa pemain. Anotasi jenis juga dibuang semasa kompil — kod bertaip dan tidak bertaip menghasilkan bytecode yang sama dan berjalan dengan kelajuan yang sama (kecuali dengan `--!native`, di mana jenis boleh membantu penjana kod).',
        'The analyser runs in Studio (or `luau-analyze`), not in the published game, so it uses no player memory or time. Type annotations are also stripped at compile time — typed and untyped code produce the same bytecode and run at the same speed (except with `--!native`, where types can help the code generator).')),
    S('alternative_implementations',
      P('Apabila analisis statik tidak tersedia (contohnya dalam pengesahan kursus ini), semakan runtime dengan `typeof` dan `assert` memberi perlindungan yang serupa — tetapi hanya untuk laluan yang benar-benar berjalan:', 'When static analysis is not available (for example in this course’s verification), run-time checks with `typeof` and `assert` give similar protection — but only on paths that actually run:'),
      CODE('runtime-guard', 'luau', 'luau', ['Pengawal runtime sebagai pengganti', 'A runtime guard as a substitute'], `
local function setVolume(level: number)
  assert(typeof(level) == "number", \`volume must be a number, got {typeof(level)}\`)
  return math.clamp(level, 0, 1)
end

print(setVolume(0.4))
print(pcall(setVolume, "loud"))
`, '0.4\nfalse\texample:2: volume must be a number, got string'),
      EXPLAIN('runtime-guard',
        ['1–4', 'Anotasi untuk penganalisis, ditambah `assert` yang benar-benar menyemak semasa runtime.', 'An annotation for the analyser, plus an `assert` that really checks at run time.'],
        ['6–7', 'Nilai sah diterima; string ditolak dengan mesej yang jelas (ditangkap oleh `pcall` supaya contoh terus berjalan).', 'A valid value is accepted; a string is rejected with a clear message (caught by `pcall` so the example keeps running).'])),
    S('common_mistakes',
      UL(
        ['Mengabaikan garis beralun kuning kerana "program masih berjalan".', 'Ignoring yellow squiggles because "the program still runs".'],
        ['Menganggap `--!strict` menghentikan nilai yang salah semasa runtime.', 'Assuming `--!strict` stops wrong values at run time.'],
        ['Mematikan amaran dengan `--!nolint` dan bukannya membaiki punca.', 'Silencing warnings with `--!nolint` instead of fixing the cause.'],
        ['Membiarkan local yang tidak digunakan, yang menyembunyikan amaran penting dalam bunyi bising.', 'Leaving unused locals around, which hides important warnings in noise.'],
      )),
    S('debugging',
      P('Jadikan Script Analysis langkah pertama penyahpepijatan: sebelum menambah `print`, buka panel dan baca setiap amaran untuk skrip itu. Amaran UnknownGlobal hampir selalu bermaksud salah ejaan atau `local` yang terlupa. Amaran UnreachableCode bermaksud logik `return` atau `break` yang salah. Ralat sintaks, sebaliknya, disahkan sepenuhnya oleh pengkompil — sama dalam Studio dan dalam kursus ini:',
        'Make Script Analysis the first debugging step: before adding `print`s, open the panel and read every warning for that script. An UnknownGlobal warning almost always means a typo or a forgotten `local`. An UnreachableCode warning means wrong `return` or `break` logic. Syntax errors, on the other hand, are fully verified by the compiler — the same in Studio and in this course:'),
      CODE('reachable-code', 'luau', 'luau', ['Kod yang boleh dicapai', 'Reachable code'], `
local function rewardFor(rank: number): number
  if rank == 1 then
    return 500
  end
  local reward = math.max(300 - rank * 50, 0)
  return reward
end

print(rewardFor(1), rewardFor(3), rewardFor(9))
`, '500\t150\t0', {
        debug: BUG(`
local function rewardFor(rank: number): number
  if rank == 1 then
    return 500
    print("winner!")
  end
  return 0
end
`, "example:4: Expected 'end' (to close 'then' at line 2), got 'print'",
          'Kod selepas `return` dalam blok yang sama tidak boleh dicapai. Dalam Luau ini **ralat sintaks** (bukan sekadar amaran), kerana `return` mesti menjadi pernyataan terakhir blok — ralat ini disahkan oleh pengkompil. Pindahkan `print` sebelum `return`. (Amaran lint UnreachableCode pula meliputi kes yang lebih halus, seperti kod selepas `if … return … else … return … end`.)',
          'Code after `return` in the same block can never be reached. In Luau this is a **syntax error** (not just a warning), because `return` must be the last statement of a block — this error is verified by the compiler. Move the `print` before the `return`. (The UnreachableCode lint warning covers subtler cases, such as code after `if … return … else … return … end`.)'),
      }),
      EXPLAIN('reachable-code',
        ['1–4', 'Tempat pertama mendapat ganjaran tetap; `return` ialah pernyataan terakhir bloknya.', 'First place gets a fixed reward; `return` is the last statement of its block.'],
        ['5–6', 'Ganjaran lain berkurang mengikut kedudukan, tidak kurang daripada 0.', 'Other rewards decrease with rank, never below 0.'],
        ['9', 'Tiga kedudukan: 500, 150 dan 0.', 'Three ranks: 500, 150 and 0.'])),
    S('performance',
      P('Analisis statik berjalan semasa penyuntingan, jadi ia tidak memperlahankan permainan. Pada fail yang sangat besar, Studio mungkin mengambil masa seketika untuk mengemas kini amaran; memecahkan kod kepada ModuleScript yang lebih kecil membantu penganalisis dan pembaca.',
        'Static analysis runs while editing, so it does not slow the game. On very large files, Studio may take a moment to update warnings; splitting code into smaller ModuleScripts helps both the analyser and the reader.')),
    S('software_engineering',
      P('Kod yang penuh dengan amaran berbanding kod yang bersih:', 'Code full of warnings versus clean code:'),
      CODE('poor-warning-noise', 'luau', 'luau', ['Pelaksanaan lemah: bunyi amaran', 'Poor implementation: warning noise'], `
local unusedA = 1
local unusedB = "debug"
function helper(x)
  local temp = x * 2
  return x * 2
end
print(helper(21))
`, '42'),
      EXPLAIN('poor-warning-noise',
        ['1–2', 'Dua local tidak digunakan (LocalUnused).', 'Two unused locals (LocalUnused).'],
        ['3–6', '`helper` ialah global (amaran global dalam mod strict), dan `temp` dikira tetapi tidak digunakan. Empat amaran untuk tujuh baris — amaran yang benar-benar penting akan tenggelam.', '`helper` is a global (a global warning in strict mode), and `temp` is computed but unused. Four warnings for seven lines — a truly important warning would drown.'],
        ['7', 'Output betul, tetapi kodnya tidak terjaga.', 'The output is correct, but the code is untidy.']),
      CODE('improved-warning-free', 'luau', 'luau', ['Pelaksanaan lebih baik: tiada amaran', 'Improved implementation: no warnings'], `
--!strict
local function double(x: number): number
  return x * 2
end

print(double(21))
`, '42'),
      EXPLAIN('improved-warning-free',
        ['1–4', 'Fungsi `local` bertaip, tiada pemboleh ubah yang tidak digunakan.', 'A typed `local` function, no unused variables.'],
        ['6', 'Hasil yang sama; sebarang amaran baharu akan kelihatan serta-merta.', 'The same result; any new warning will stand out immediately.'])),
    S('industry_use_cases',
      UL(
        ['Pasukan profesional menjalankan `luau-analyze` (atau Selene) dalam CI dan menolak kod dengan amaran.', 'Professional teams run `luau-analyze` (or Selene) in CI and reject code with warnings.'],
        ['luau-lsp membawa analisis yang sama ke VS Code untuk pembangun yang menggunakan Rojo.', 'luau-lsp brings the same analysis to VS Code for developers who use Rojo.'],
        ['Pustaka sumber terbuka Roblox yang popular ditulis dalam `--!strict` sepenuhnya.', 'Popular Roblox open-source libraries are written entirely in `--!strict`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tampal versi berpepijat `unknown-global` ke dalam Studio dan cari amaran UnknownGlobal dalam panel Script Analysis.', 'Paste the buggy `unknown-global` into Studio and find the UnknownGlobal warning in the Script Analysis panel.'],
        ['Tampal `poor-warning-noise` dan kira berapa amaran yang Studio tunjukkan; bandingkan dengan penerangan.', 'Paste `poor-warning-noise` and count how many warnings Studio shows; compare with the description.'],
        ['Jalankan ketiga-tiga versi berpepijat dalam kursus ini dan perhatikan ralat runtime atau sintaks yang disahkan.', 'Run all three buggy versions in this course and note the verified runtime or syntax errors.'],
      ),
      WARN('Amaran lint dan ralat jenis dalam kuliah ini **diterangkan** berdasarkan dokumentasi Luau; ia tidak dijana oleh pengesahan kursus. Ralat sintaks dan runtime **disahkan** oleh VM Luau.', 'Lint warnings and type errors in this lecture are **described** from the Luau documentation; they are not produced by the course verification. Syntax and runtime errors **are verified** by the Luau VM.', ['Status pengesahan', 'Verification status'])),
    S('mini_project',
      P('**Kemas kini kod lama.** Ambil fungsi kecil dengan beberapa masalah yang akan dilaporkan oleh penganalisis, dan tulis semula supaya bersih, bertaip dan diuji.', '**Tidy up old code.** Take a small function with several problems the analyser would report, and rewrite it so it is clean, typed and tested.'),
      CODE('cleanup-project', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
--!strict
local MAX_STACK = 99

local function addToStack(current: number, added: number): (number, number)
  local total = current + added
  local kept = math.min(total, MAX_STACK)
  local overflow = total - kept
  return kept, overflow
end

local cases = {{10, 5, 15, 0}, {95, 10, 99, 6}, {99, 1, 99, 1}}
for _, c in cases do
  local kept, overflow = addToStack(c[1], c[2])
  assert(kept == c[3] and overflow == c[4], \`case {c[1]}+{c[2]} failed\`)
end
print("stack tests passed")
`, 'stack tests passed'),
      EXPLAIN('cleanup-project',
        ['1–2', 'Mod strict dan pemalar bernama.', 'Strict mode and a named constant.'],
        ['4–9', 'Fungsi local bertaip dengan dua nilai pulangan `(number, number)`; setiap local digunakan.', 'A typed local function with two return values `(number, number)`; every local is used.'],
        ['11–15', 'Ujian sempadan: tiada limpahan, limpahan, dan sudah penuh.', 'Boundary tests: no overflow, overflow, and already full.'],
        ['16', 'Dicetak hanya jika semua ujian lulus.', 'Printed only if every test passes.'])),
    S('summary',
      UL(
        ['Penganalisis Luau: linter + penyemak jenis; dalam Studio (Script Analysis) atau `luau-analyze`.', 'The Luau analyser: linter + type checker; in Studio (Script Analysis) or `luau-analyze`.'],
        ['Amaran dan ralat jenis tidak menghentikan program; ralat sintaks menghentikannya.', 'Warnings and type errors do not stop the program; syntax errors do.'],
        ['UnknownGlobal, LocalUnused, LocalShadow dan UnreachableCode menunjuk pepijat sebenar.', 'UnknownGlobal, LocalUnused, LocalShadow and UnreachableCode point at real bugs.'],
        ['Kursus ini mengesahkan ralat sintaks dan runtime; amaran penganalisis diterangkan sahaja.', 'This course verifies syntax and runtime errors; analyser warnings are described only.'],
      )),
    S('knowledge_check',
      OL(
        ['Adakah program dengan amaran UnknownGlobal masih berjalan?', 'Does a program with an UnknownGlobal warning still run?'],
        ['Apakah perbezaan antara `--!nonstrict` dan `--!strict`?', 'What is the difference between `--!nonstrict` and `--!strict`?'],
        ['Mengapakah versi berpepijat `shadow-and-unused` mencetak 0?', 'Why does the buggy `shadow-and-unused` produce 0?'],
        ['Apakah yang disahkan oleh kursus ini, dan apakah yang diterangkan sahaja?', 'What does this course verify, and what is described only?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Linting (list of lint warnings)', url: `${LUAU}/lint` },
        { title: 'Luau — Type checking', url: `${LUAU}/typecheck` },
        { title: 'Script Analysis window (Roblox Studio)', url: `${DOCS}/studio/script-analysis` },
        { title: 'luau-lsp — language server for Luau', url: 'https://github.com/JohnnyMorganz/luau-lsp' },
      )),
  ],
};

export const LUAU101_M3 = [LUAU101_3_1, LUAU101_3_2, LUAU101_3_3];
