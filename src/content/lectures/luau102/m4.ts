import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU102 · Module 4 — Strings and Expressions (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 4.1 Backtick string interpolation ─────────────────────────────────────

export const LUAU102_4_1: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 4,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis [[string-interpolation|string interpolasi]] dengan backtick dan `{ungkapan}`.', 'Write [[string-interpolation|interpolated strings]] with backticks and `{expression}`.'],
        ['Menerangkan bagaimana nilai ditukar (`tostring`) dan mengapa `nil` selamat.', 'Explain how values are converted (`tostring`) and why `nil` is safe.'],
        ['Menggunakan escape `\\{`, `` \\` `` dan mengenal pasti had sintaks (tiada `{{`, tiada `{}` kosong, satu baris).', 'Use the escapes `\\{`, `` \\` `` and recognise the syntax limits (no `{{`, no empty `{}`, single line).'],
        ['Memilih antara interpolasi, `..` dan `string.format`.', 'Choose between interpolation, `..` and `string.format`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 2–3: string, nombor dan operator.', 'Modules 2–3: strings, numbers and operators.'],
      )),
    S('introduction',
      P('Membina mesej dengan `..` cepat menjadi sukar dibaca: `"Player " .. name .. " scored " .. score .. " (" .. rank .. ")"`. Ruang mudah terlupa, dan `nil` menyebabkan ralat. Luau menambah **interpolasi string**: tulis teks dalam backtick, dan letakkan sebarang ungkapan dalam `{ }` — `` `Player {name} scored {score} ({rank})` ``. Mesej dibaca seperti hasilnya. Interpolasi telah menjadi cara standard untuk membina teks dalam kod Roblox moden.',
        'Building messages with `..` quickly becomes hard to read: `"Player " .. name .. " scored " .. score .. " (" .. rank .. ")"`. Spaces are easy to forget, and `nil` causes errors. Luau adds **string interpolation**: write the text in backticks and put any expression in `{ }` — `` `Player {name} scored {score} ({rank})` ``. The message reads like its output. Interpolation has become the standard way to build text in modern Roblox code.'),
      KEY('`` `Teks {ungkapan} teks` `` — setiap `{…}` dinilai dan ditukar dengan `tostring`.', '`` `Text {expression} text` `` — each `{…}` is evaluated and converted with `tostring`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['String interpolasi ditulis dengan backtick `` ` ``, bukan petikan.', 'Interpolated strings are written with backticks `` ` ``, not quotes.'],
        ['`{ungkapan}` boleh mengandungi sebarang ungkapan: aritmetik, panggilan, if-expression.', '`{expression}` may contain any expression: arithmetic, calls, if-expressions.'],
        ['Nilai ditukar dengan `tostring`: `nil` → "nil", `true` → "true".', 'Values are converted with `tostring`: `nil` → "nil", `true` → "true".'],
        ['Escape: `\\{` untuk kurungan kerinting literal, `` \\` `` untuk backtick, `\\n` untuk baris baharu.', 'Escapes: `\\{` for a literal brace, `` \\` `` for a backtick, `\\n` for a newline.'],
        ['Tidak dibenarkan: `{{`, `{}` kosong, baris baharu sebenar dalam string, dan memanggil fungsi tanpa kurungan (`` print`x` ``).', 'Not allowed: `{{`, empty `{}`, a real newline inside the string, and calling a function without parentheses (`` print`x` ``).'],
      )),
    S('detailed_theory',
      P('Pengkompil Luau menukar string interpolasi kepada panggilan `string.format` dengan spesifikasi `%*`, yang memformat sebarang nilai menggunakan `tostring`. Jadi `` `{a} + {b}` `` menjadi lebih kurang `string.format("%* + %*", a, b)`. Ini menerangkan dua sifat: kosnya sama seperti `string.format`, dan setiap nilai — termasuk `nil`, boolean dan table — boleh dipaparkan tanpa ralat (table muncul sebagai alamat). Sebaliknya, `..` menolak `nil`, boolean dan table dengan ralat `attempt to concatenate`. Interpolasi tidak mempunyai spesifikasi format sendiri: untuk tempat perpuluhan atau lebar lajur, panggil `string.format` di dalam `{}` atau gunakannya terus.',
        'The Luau compiler turns an interpolated string into a `string.format` call with `%*` specifiers, which format any value using `tostring`. So `` `{a} + {b}` `` becomes roughly `string.format("%* + %*", a, b)`. This explains two properties: it costs the same as `string.format`, and every value — including `nil`, booleans and tables — can be displayed without an error (tables appear as an address). By contrast, `..` rejects `nil`, booleans and tables with an `attempt to concatenate` error. Interpolation has no format specifiers of its own: for decimal places or column widths, call `string.format` inside `{}` or use it directly.'),
      P('Sintaks mempunyai beberapa had yang disengajakan. Kurungan kerinting berganda `{{` ditolak dengan mesej yang mencadangkan `\\{` — ini menghalang kekeliruan dengan constructor table. Kurungan kosong `{}` ialah ralat kerana tiada ungkapan untuk dinilai. String interpolasi mesti berada dalam satu baris; gunakan `\\n` untuk baris baharu. Akhir sekali, berbeza dengan string biasa, anda tidak boleh memanggil fungsi dengan string interpolasi tanpa kurungan: `` print`hi` `` tidak sah, tetapi `` print(`hi`) `` sah. Ungkapan di dalam `{}` boleh mengandungi string interpolasi lain, walaupun bersarang terlalu dalam menyukarkan pembacaan.',
        'The syntax has some deliberate limits. Double braces `{{` are rejected with a message suggesting `\\{` — this prevents confusion with table constructors. Empty braces `{}` are an error because there is no expression to evaluate. An interpolated string must be on one line; use `\\n` for newlines. Finally, unlike ordinary strings, you cannot call a function with an interpolated string without parentheses: `` print`hi` `` is invalid, but `` print(`hi`) `` is valid. An expression inside `{}` may contain another interpolated string, although deep nesting hurts readability.')),
    S('technical_terminology', TERMS('string-interpolation', 'escape-sequence', 'compound-assignment', 'if-expression')),
    S('syntax_rules',
      UL(
        ['`` `Hello {name}!` `` · `` `{a} + {b} = {a + b}` `` · `` `{player.name:upper()}` ``.', '`` `Hello {name}!` `` · `` `{a} + {b} = {a + b}` `` · `` `{player.name:upper()}` ``.'],
        ['Literal: `` `set = \\{1, 2\\}` `` memaparkan `set = {1, 2}`.', 'Literals: `` `set = \\{1, 2\\}` `` displays `set = {1, 2}`.'],
        ['Format: `` `{string.format("%.2f", price)}` ``.', 'Format: `` `{string.format("%.2f", price)}` ``.'],
      )),
    S('code_demonstration',
      CODE('interp-basics', 'luau', 'luau', ['Interpolasi dalam tindakan', 'Interpolation in action'], `
local name = "Aina"
local kills, deaths = 12, 3
local clan = nil

print(\`{name} has {kills} kills and {deaths} deaths\`)
print(\`K/D ratio: {kills / deaths}\`)
print(\`Clan: {clan}, VIP: {kills > 10}\`)
print(\`Upper: {name:upper()}, length {#name}\`)
`, 'Aina has 12 kills and 3 deaths\nK/D ratio: 4\nClan: nil, VIP: true\nUpper: AINA, length 4'),
      EXPLAIN('interp-basics',
        ['1–3', 'Data pemain; `clan` ialah `nil`.', 'Player data; `clan` is `nil`.'],
        ['5', 'Pemboleh ubah diletakkan terus dalam teks.', 'Variables placed directly in the text.'],
        ['6', 'Ungkapan aritmetik dinilai: 12 / 3 = 4.', 'An arithmetic expression is evaluated: 12 / 3 = 4.'],
        ['7', '`nil` dan boolean ditukar dengan selamat — `..` akan gagal di sini.', '`nil` and booleans are converted safely — `..` would fail here.'],
        ['8', 'Panggilan kaedah dan operator panjang di dalam `{}`.', 'A method call and the length operator inside `{}`.'])),
    S('complete_examples',
      CODE('interp-escapes', 'luau', 'luau', ['Escape dan bersarang', 'Escapes and nesting'], `
local count = 3
print(\`Inventory \\{slots: {count}\\}\`)
print(\`He said \\\`GG\\\` after {count} wins\`)
print(\`Line A\\nLine B ({count})\`)
print(\`Outer {\`inner {count * 2}\`} done\`)
`, 'Inventory {slots: 3}\nHe said `GG` after 3 wins\nLine A\nLine B (3)\nOuter inner 6 done', {
        debug: BUG(`
local count = 3
print(\`Inventory {{count}}\`)
`, "example:2: Double braces are not permitted within interpolated strings; did you mean '\\{'?",
          'Kurungan berganda `{{` tidak dibenarkan — Luau menolaknya untuk mengelakkan kekeliruan dengan constructor table, dan mesejnya sendiri mencadangkan `\\{`. Untuk memaparkan `{3}`, tulis `` `Inventory \\{{count}\\}` ``: escape pertama memaparkan `{`, kemudian `{count}` diinterpolasi.',
          'Double braces `{{` are not allowed — Luau rejects them to avoid confusion with table constructors, and its own message suggests `\\{`. To display `{3}`, write `` `Inventory \\{{count}\\}` ``: the first escape displays `{`, then `{count}` is interpolated.'),
      }),
      EXPLAIN('interp-escapes',
        ['1–2', '`\\{` dan `\\}` memaparkan kurungan literal di sekeliling ungkapan yang diinterpolasi.', '`\\{` and `\\}` display literal braces around an interpolated expression.'],
        ['3', '`` \\` `` memaparkan backtick di dalam string interpolasi.', '`` \\` `` displays a backtick inside an interpolated string.'],
        ['4', '`\\n` memecahkan baris — baris baharu sebenar tidak dibenarkan.', '`\\n` breaks the line — a real newline is not allowed.'],
        ['5', 'String interpolasi bersarang di dalam `{}` — sah tetapi gunakan dengan berhati-hati.', 'An interpolated string nested inside `{}` — valid but use with care.']),
      CODE('interp-format', 'luau', 'luau', ['Interpolasi dengan format nombor', 'Interpolation with number formatting'], `
local price = 19.5
local discount = 0.15
local final = price * (1 - discount)

print(\`Price: {price}, final: {final}\`)
print(\`Final: {string.format("%.2f", final)}\`)
print(\`Saved {math.round(discount * 100)}%\`)
`, 'Price: 19.5, final: 16.575\nFinal: 16.57\nSaved 15%', {
        debug: BUG(`
local playerName = "Ben"
print(\`Welcome {}\`, playerName)
`, "example:2: Malformed interpolated string, expected expression inside '{}'",
          'Kurungan kosong `{}` bukan "pemegang tempat" seperti dalam sesetengah bahasa — ia mesti mengandungi ungkapan. Letakkan nilai terus di dalam: `` print(`Welcome {playerName}`) ``.',
          'Empty braces `{}` are not a "placeholder" as in some languages — they must contain an expression. Put the value directly inside: `` print(`Welcome {playerName}`) ``.'),
      }),
      EXPLAIN('interp-format',
        ['1–3', 'Harga, diskaun 15% dan harga akhir.', 'A price, a 15% discount and the final price.'],
        ['5', 'Tanpa format, Luau mencetak nilai penuh.', 'Without formatting, Luau prints the full value.'],
        ['6', '`string.format("%.2f", …)` di dalam `{}` untuk dua tempat perpuluhan. 16.575 dibundarkan kepada 16.57 kerana nilai binarinya sedikit di bawah 16.575.', '`string.format("%.2f", …)` inside `{}` for two decimal places. 16.575 rounds to 16.57 because its binary value is slightly below 16.575.'],
        ['7', '`%` selepas `}` ialah teks biasa.', 'The `%` after `}` is ordinary text.'])),
    S('line_by_line',
      EXPLAIN('interp-basics',
        ['7', '`{kills > 10}` — perbandingan memberi `true`, yang dipaparkan sebagai teks "true".', '`{kills > 10}` — the comparison gives `true`, displayed as the text "true".']),
      EXPLAIN('interp-escapes',
        ['2', 'Dalam fail Luau, baris ini ditulis `` `Inventory \\{slots: {count}\\}` ``. Garis miring terbalik hanya diperlukan sebelum `{` atau `}` yang literal.', 'In a Luau file this line is written `` `Inventory \\{slots: {count}\\}` ``. The backslash is only needed before a literal `{` or `}`.'])),
    S('why_this_way',
      P('Mengapa backtick dan bukan `"…{x}…"`? Kerana mengubah makna string berpetik akan memecahkan kod lama yang mengandungi `{` — keserasian ke belakang ialah keutamaan Luau. Backtick tidak mempunyai makna dalam Lua 5.1, jadi sintaks baharu ini selamat.',
        'Why backticks and not `"…{x}…"`? Because changing the meaning of quoted strings would break old code containing `{` — backward compatibility is a Luau priority. Backticks have no meaning in Lua 5.1, so this new syntax is safe.'),
      P('Gunakan interpolasi **untuk kebanyakan mesej**; `string.format` **apabila** anda perlukan lebar, tempat perpuluhan atau penjajaran; `..` **apabila** menggabungkan dua string yang sudah pasti string.', 'Use interpolation **for most messages**; `string.format` **when** you need widths, decimal places or alignment; `..` **when** joining two values that are certainly strings.')),
    S('execution_flow',
      OL(
        ['`` `Clan: {clan}, VIP: {kills > 10}` `` → pengkompil menukarnya kepada `string.format("Clan: %*, VIP: %*", clan, kills > 10)`.', '`` `Clan: {clan}, VIP: {kills > 10}` `` → the compiler turns it into `string.format("Clan: %*, VIP: %*", clan, kills > 10)`.'],
        ['Ungkapan dinilai dari kiri ke kanan: `nil`, `true`.', 'The expressions are evaluated left to right: `nil`, `true`.'],
        ['`%*` memanggil `tostring` pada setiap satu → "Clan: nil, VIP: true".', '`%*` calls `tostring` on each → "Clan: nil, VIP: true".'],
      )),
    S('memory_behaviour',
      P('Setiap string interpolasi mencipta satu string hasil — sama seperti `string.format`, dan lebih baik daripada rantaian `..` yang mencipta string perantaraan bagi setiap operator. Untuk mesej dalam gelung yang sangat panas (setiap bingkai), elakkan membina string langsung jika ia tidak dipaparkan.',
        'Each interpolated string creates one result string — the same as `string.format`, and better than a `..` chain, which creates an intermediate string for each operator. For messages in very hot loops (every frame), avoid building strings at all if they are not displayed.')),
    S('alternative_implementations',
      P('Tiga cara membina mesej yang sama:', 'Three ways to build the same message:'),
      CODE('three-ways', 'luau', 'luau', ['Interpolasi, .. dan string.format', 'Interpolation, .. and string.format'], `
local item, qty, price = "potion", 3, 2.5

print(\`{qty}x {item} = {qty * price} coins\`)
print(qty .. "x " .. item .. " = " .. qty * price .. " coins")
print(string.format("%dx %s = %.1f coins", qty, item, qty * price))
`, '3x potion = 7.5 coins\n3x potion = 7.5 coins\n3x potion = 7.5 coins'),
      EXPLAIN('three-ways',
        ['1', 'Data yang sama untuk ketiga-tiga kaedah.', 'The same data for all three methods.'],
        ['3', 'Interpolasi: paling mudah dibaca.', 'Interpolation: the easiest to read.'],
        ['4', '`..`: sah kerana semua nilai string atau nombor, tetapi ruang mudah terlupa.', '`..`: valid because every value is a string or number, but spaces are easy to forget.'],
        ['5', '`string.format`: kawalan format penuh (`%.1f`).', '`string.format`: full format control (`%.1f`).'])),
    S('common_mistakes',
      UL(
        ['Menggunakan petikan biasa: `"Hi {name}"` memaparkan `{name}` secara literal.', 'Using ordinary quotes: `"Hi {name}"` displays `{name}` literally.'],
        ['Menulis `{{` untuk kurungan literal.', 'Writing `{{` for a literal brace.'],
        ['Meletakkan baris baharu sebenar di dalam string interpolasi.', 'Putting a real newline inside an interpolated string.'],
        ['Menjangka interpolasi membundarkan nombor — gunakan `string.format`.', 'Expecting interpolation to round numbers — use `string.format`.'],
      )),
    S('debugging',
      P('Hampir semua ralat interpolasi ialah ralat **sintaks**, jadi ia dikesan sebelum program berjalan dan mesejnya spesifik: `Double braces are not permitted…`, `Malformed interpolated string, expected expression inside \'{}\'`, atau `Malformed string; did you forget to finish it?` untuk baris baharu atau backtick penutup yang hilang. Jika teks dipaparkan dengan `{name}` secara literal, anda menggunakan petikan dan bukannya backtick. Contoh berikut membina mesej berbilang baris dengan betul:',
        'Almost all interpolation errors are **syntax** errors, so they are caught before the program runs and their messages are specific: `Double braces are not permitted…`, `Malformed interpolated string, expected expression inside \'{}\'`, or `Malformed string; did you forget to finish it?` for a newline or a missing closing backtick. If text appears with a literal `{name}`, you used quotes instead of backticks. The following example builds a multi-line message correctly:'),
      CODE('multi-line-message', 'luau', 'luau', ['Mesej berbilang baris', 'A multi-line message'], `
local winner, score, runnerUp = "Chen", 1500, "Aina"
local lines = {
  \`Winner: {winner}\`,
  \`Score: {score}\`,
  \`Runner-up: {runnerUp}\`,
}
print(table.concat(lines, "\\n"))
`, 'Winner: Chen\nScore: 1500\nRunner-up: Aina'),
      EXPLAIN('multi-line-message',
        ['1', 'Data keputusan.', 'The result data.'],
        ['2–6', 'Satu string interpolasi bagi setiap baris — setiap satu dalam satu baris kod.', 'One interpolated string per line — each on a single code line.'],
        ['7', 'Cantum dengan `\\n` untuk paparan berbilang baris.', 'Join with `\\n` for a multi-line display.'])),
    S('performance',
      P('Interpolasi dan `string.format` mempunyai kos yang sama kerana yang pertama dikompil kepada yang kedua. Kedua-duanya lebih cekap daripada rantaian `..` panjang. Untuk ratusan bahagian, `table.concat` kekal pilihan terbaik.',
        'Interpolation and `string.format` cost the same because the first compiles to the second. Both are more efficient than long `..` chains. For hundreds of parts, `table.concat` remains the best choice.')),
    S('software_engineering',
      P('Rantaian `..` yang rapuh berbanding interpolasi:', 'A fragile `..` chain versus interpolation:'),
      CODE('poor-concat-chain', 'luau', 'luau', ['Pelaksanaan lemah: rantaian .. panjang', 'Poor implementation: a long .. chain'], `
local playerName, level, guild = "Dewi", 14, "Night Owls"
local message = "Player " .. playerName .. " reached level " .. level .. " in guild" .. guild .. "!"
print(message)
`, 'Player Dewi reached level 14 in guildNight Owls!'),
      EXPLAIN('poor-concat-chain',
        ['1–3', 'Ruang selepas "guild" terlupa — pepijat kecil yang sukar dilihat dalam rantaian panjang. Jika `guild` ialah `nil`, ia akan menjadi ralat.', 'The space after "guild" is missing — a small bug that is hard to see in a long chain. If `guild` were `nil`, it would be an error.']),
      CODE('improved-interpolation', 'luau', 'luau', ['Pelaksanaan lebih baik: interpolasi', 'Improved implementation: interpolation'], `
local playerName, level, guild = "Dewi", 14, "Night Owls"
local message = \`Player {playerName} reached level {level} in guild {guild}!\`
print(message)
`, 'Player Dewi reached level 14 in guild Night Owls!'),
      EXPLAIN('improved-interpolation',
        ['1–3', 'Teks dibaca seperti output; ruang kelihatan; `nil` akan dipaparkan sebagai "nil" dan bukannya menimbulkan ralat.', 'The text reads like the output; spaces are visible; a `nil` would display as "nil" instead of raising an error.'])),
    S('industry_use_cases',
      UL(
        ['Mesej sistem chat, notifikasi dan teks UI dalam Roblox dibina dengan interpolasi.', 'Chat system messages, notifications and UI text in Roblox are built with interpolation.'],
        ['Log pelayan menggunakan interpolasi untuk memasukkan ID pemain dan nilai.', 'Server logs use interpolation to include player IDs and values.'],
        ['Kod yang memerlukan penjajaran lajur (papan skor) masih menggunakan `string.format`.', 'Code that needs column alignment (scoreboards) still uses `string.format`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis semula `"HP: " .. hp .. "/" .. maxHp` dengan interpolasi.', 'Rewrite `"HP: " .. hp .. "/" .. maxHp` with interpolation.'],
        ['Paparkan `{x, y}` dengan nilai sebenar menggunakan escape.', 'Display `{x, y}` with real values using escapes.'],
        ['Jalankan kedua-dua versi berpepijat dan baca mesej yang dicadangkan oleh Luau.', 'Run both buggy versions and read the suggestions in Luau’s messages.'],
      )),
    S('mini_project',
      P('**Kad statistik pemain.** Bina kad teks berbilang baris untuk seorang pemain dengan interpolasi, termasuk peratus menang yang diformat dan label bersyarat.', '**A player stats card.** Build a multi-line text card for one player with interpolation, including a formatted win percentage and a conditional label.'),
      CODE('stats-card', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local p = {name = "Aina", wins = 27, games = 40, streak = 5, clan = nil}
local winRate = p.wins / p.games * 100

local card = {
  \`== {p.name:upper()} ==\`,
  \`Wins: {p.wins}/{p.games} ({string.format("%.1f", winRate)}%)\`,
  \`Streak: {p.streak}{if p.streak >= 5 then " (on fire!)" else ""}\`,
  \`Clan: {p.clan or "none"}\`,
}
print(table.concat(card, "\\n"))
`, '== AINA ==\nWins: 27/40 (67.5%)\nStreak: 5 (on fire!)\nClan: none'),
      EXPLAIN('stats-card',
        ['1–2', 'Data dan peratus menang (67.5).', 'The data and the win percentage (67.5).'],
        ['4–9', 'Setiap baris kad: kaedah string, format nombor, if-expression dan lalai `or` di dalam `{}`.', 'Each card line: a string method, number formatting, an if-expression and an `or` default inside `{}`.'],
        ['10', 'Paparan berbilang baris.', 'A multi-line display.'])),
    S('summary',
      UL(
        ['`` `teks {ungkapan}` `` — dikompil kepada `string.format` dengan `%*`.', '`` `text {expression}` `` — compiled to `string.format` with `%*`.'],
        ['Sebarang nilai selamat, termasuk `nil`.', 'Any value is safe, including `nil`.'],
        ['`\\{` dan `` \\` `` untuk literal; tiada `{{`, `{}` kosong atau baris baharu sebenar.', '`\\{` and `` \\` `` for literals; no `{{`, empty `{}` or real newlines.'],
        ['Untuk tempat perpuluhan dan lebar, gunakan `string.format`.', 'For decimal places and widths, use `string.format`.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dipaparkan oleh `` `{nil}` ``?', 'What does `` `{nil}` `` display?'],
        ['Bagaimanakah anda memaparkan `{score}` secara literal?', 'How do you display `{score}` literally?'],
        ['Mengapakah `"Hi {name}"` tidak diinterpolasi?', 'Why is `"Hi {name}"` not interpolated?'],
        ['Bagaimanakah anda memaparkan harga dengan dua tempat perpuluhan dalam interpolasi?', 'How do you display a price with two decimal places inside interpolation?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax: string interpolation', url: `${LUAU}/syntax#string-interpolation` },
        { title: 'Luau RFC — String interpolation', url: 'https://github.com/luau-lang/rfcs/blob/master/docs/syntax-string-interpolation.md' },
        { title: 'Roblox Creator Hub — Strings (interpolation)', url: `${DOCS}/luau/strings#string-interpolation` },
        { title: 'Luau — Library (string.format)', url: `${LUAU}/library#string-library` },
      )),
  ],
};

// ─── 4.2 if-expressions ────────────────────────────────────────────────────

export const LUAU102_4_2: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 4,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis [[if-expression|if-expression]] dengan `then`, `elseif` dan `else` yang wajib.', 'Write [[if-expression|if-expressions]] with `then`, `elseif` and the required `else`.'],
        ['Membezakan if-expression (nilai) daripada pernyataan `if` (tindakan).', 'Distinguish the if-expression (a value) from the `if` statement (an action).'],
        ['Menerangkan mengapa if-expression selamat apabila cabang bernilai `false` atau `nil`.', 'Explain why if-expressions are safe when a branch is `false` or `nil`.'],
        ['Memahami keutamaan: cabang `else` mengambil seluruh ungkapan di sebelah kanannya.', 'Understand precedence: the `else` branch takes the whole expression to its right.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.2: operator logik dan idiom `a and b or c`.', 'Lecture 3.2: logical operators and the `a and b or c` idiom.'],
        ['Kuliah 4.1: interpolasi.', 'Lecture 4.1: interpolation.'],
      )),
    S('introduction',
      P('Pernyataan `if` **melakukan** sesuatu; tetapi sering kita hanya mahu **memilih nilai**: label "Menang" atau "Kalah", warna merah atau hijau, kelajuan berlari atau berjalan. Dalam Lua, pembangun menggunakan idiom `syarat and a or b`, yang gagal secara senyap apabila `a` ialah `false` atau `nil`. Luau menambah **if-expression**: `if syarat then a else b` sebagai ungkapan yang menghasilkan nilai. Ia sentiasa betul, boleh dibaca seperti ayat, dan boleh diletakkan di mana-mana ungkapan dibenarkan — dalam assignment, argumen fungsi, `return` atau interpolasi.',
        'An `if` statement **does** something; but often we only want to **choose a value**: the label "Won" or "Lost", the colour red or green, a running or walking speed. In Lua, developers use the idiom `condition and a or b`, which fails silently when `a` is `false` or `nil`. Luau adds the **if-expression**: `if condition then a else b` as an expression that produces a value. It is always correct, reads like a sentence, and can go anywhere an expression is allowed — in an assignment, a function argument, a `return` or interpolation.'),
      KEY('`if c then a elseif d then b else e` — satu nilai; `else` wajib; hanya cabang yang dipilih dinilai.', '`if c then a elseif d then b else e` — one value; `else` is required; only the chosen branch is evaluated.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['If-expression menghasilkan nilai; pernyataan `if` menjalankan blok.', 'An if-expression produces a value; an `if` statement runs a block.'],
        ['`else` wajib kerana ungkapan sentiasa mesti menghasilkan nilai.', '`else` is required because an expression must always produce a value.'],
        ['Setiap cabang ialah satu **ungkapan**, bukan blok — tiada `end`.', 'Each branch is one **expression**, not a block — there is no `end`.'],
        ['Hanya cabang terpilih dinilai (seperti litar pintas).', 'Only the chosen branch is evaluated (like short-circuiting).'],
        ['Cabang `else` meluas sejauh mungkin ke kanan: bungkus dengan kurungan apabila menggabungkan.', 'The `else` branch extends as far right as possible: wrap in parentheses when combining.'],
      )),
    S('detailed_theory',
      P('Idiom Lua `c and a or b` bergantung pada truthiness: jika `c` benar, `c and a` memberi `a`, dan jika `a` benar, `a or b` memberi `a`. Tetapi jika `a` sendiri ialah `false` atau `nil`, `a or b` memberi `b` — cabang yang salah. If-expression Luau tidak bergantung pada truthiness nilai cabang: ia menilai syarat, memilih cabang, dan memulangkan nilai cabang itu seperti sedia ada, walaupun ia `false` atau `nil`. Ia juga menyokong `elseif` untuk lebih daripada dua pilihan, menggantikan rantaian `and/or` bersarang yang hampir mustahil dibaca.',
        'The Lua idiom `c and a or b` relies on truthiness: if `c` is truthy, `c and a` gives `a`, and if `a` is truthy, `a or b` gives `a`. But if `a` itself is `false` or `nil`, `a or b` gives `b` — the wrong branch. Luau’s if-expression does not depend on the truthiness of branch values: it evaluates the condition, chooses a branch, and returns that branch’s value as it is, even if it is `false` or `nil`. It also supports `elseif` for more than two choices, replacing nested `and/or` chains that are almost impossible to read.'),
      P('Satu butiran tatabahasa penting: cabang terakhir (`else`) ialah ungkapan penuh yang mengambil segala-galanya di sebelah kanannya. Jadi `if x > 3 then 10 else 0 + 1` bermaksud `if x > 3 then 10 else (0 + 1)` — jika `x > 3`, hasilnya 10, bukan 11. Untuk menggunakan hasil if-expression dalam ungkapan yang lebih besar, balutnya dengan kurungan: `(if x > 3 then 10 else 0) + 1`. Peraturan yang sama terpakai untuk panggilan kaedah: `(if ok then "a" else "b"):upper()`. Gunakan if-expression untuk pilihan nilai yang ringkas; untuk logik dengan beberapa langkah atau kesan sampingan, pernyataan `if` lebih jelas.',
        'One important grammatical detail: the last branch (`else`) is a full expression that takes everything to its right. So `if x > 3 then 10 else 0 + 1` means `if x > 3 then 10 else (0 + 1)` — if `x > 3`, the result is 10, not 11. To use an if-expression’s result in a larger expression, wrap it in parentheses: `(if x > 3 then 10 else 0) + 1`. The same rule applies to method calls: `(if ok then "a" else "b"):upper()`. Use if-expressions for short value choices; for logic with several steps or side effects, an `if` statement is clearer.')),
    S('technical_terminology', TERMS('if-expression', 'short-circuit', 'truthiness', 'conditional')),
    S('syntax_rules',
      UL(
        ['`local v = if syarat then a else b`.', '`local v = if condition then a else b`.'],
        ['`local v = if c1 then a elseif c2 then b else c` — sebarang bilangan `elseif`.', '`local v = if c1 then a elseif c2 then b else c` — any number of `elseif`s.'],
        ['Kurungan untuk menggabungkan: `(if c then a else b) * 2`.', 'Parentheses for combining: `(if c then a else b) * 2`.'],
      )),
    S('code_demonstration',
      CODE('if-expr-basics', 'luau', 'luau', ['Asas if-expression', 'If-expression basics'], `
local health = 35
local maxHealth = 100

local status = if health <= 0 then "dead" elseif health < maxHealth * 0.4 then "critical" else "ok"
local colour = if status == "ok" then "green" else "red"
print(status, colour)

local isSprinting = false
print(\`speed {if isSprinting then 24 else 16}\`)
`, 'critical\tred\nspeed 16'),
      EXPLAIN('if-expr-basics',
        ['1–2', 'Data kesihatan.', 'Health data.'],
        ['4', 'Tiga pilihan dengan `elseif`: 35 < 40 → "critical".', 'Three choices with `elseif`: 35 < 40 → "critical".'],
        ['5–6', 'If-expression kedua menggunakan hasil yang pertama.', 'A second if-expression uses the first one’s result.'],
        ['8–9', 'If-expression di dalam interpolasi.', 'An if-expression inside interpolation.'])),
    S('complete_examples',
      CODE('falsy-branch', 'luau', 'luau', ['Cabang bernilai false atau nil', 'Branches that are false or nil'], `
local function teamFor(player)
  return if player.isSpectator then nil else player.team
end

local function canChat(player)
  return if player.isMuted then false else true
end

local muted = {isMuted = true, isSpectator = true, team = "Red"}
print(teamFor(muted), canChat(muted))
print(true and nil or "fallback")
`, 'nil\tfalse\nfallback', {
        debug: BUG(`
local health = 50
local label = if health > 0 then "alive"
print(label)
`, "example:3: Expected 'else' when parsing if then else expression, got 'print'",
          'If-expression tanpa `else` tidak sah: ungkapan mesti menghasilkan nilai untuk setiap kes, termasuk apabila syarat palsu. Penghurai mencari `else` dan menemui `print` pada baris 3. Tambah `else "dead"` — atau gunakan pernyataan `if` jika anda tidak memerlukan nilai.',
          'An if-expression without `else` is invalid: an expression must produce a value in every case, including when the condition is false. The parser looks for `else` and finds `print` on line 3. Add `else "dead"` — or use an `if` statement if you do not need a value.'),
      }),
      EXPLAIN('falsy-branch',
        ['1–3', 'Cabang `then` ialah `nil` — if-expression memulangkannya dengan betul.', 'The `then` branch is `nil` — the if-expression returns it correctly.'],
        ['5–7', 'Cabang `then` ialah `false` — juga dipulangkan dengan betul.', 'The `then` branch is `false` — also returned correctly.'],
        ['9–10', 'Kedua-dua hasil palsu dihormati.', 'Both falsy results are respected.'],
        ['11', 'Bandingkan: idiom `and/or` dengan `nil` sebagai cabang tengah memberi "fallback" — salah.', 'Compare: the `and/or` idiom with `nil` as the middle branch gives "fallback" — wrong.']),
      CODE('if-expr-precedence', 'luau', 'luau', ['Keutamaan dan kurungan', 'Precedence and parentheses'], `
local level = 5
local wrong = if level > 3 then 10 else 0 + 1
local right = (if level > 3 then 10 else 0) + 1
print(wrong, right)

local rank = 2
print((if rank == 1 then "gold" else "silver"):upper())
`, '10\t11\nSILVER', {
        debug: BUG(`
local coins = 40
local price = 50
local message = if coins >= price then "buy" else "need " .. price - coins .. " more"
print(message:upper() + 1)
`, 'example:4: attempt to perform arithmetic (add) on string and number',
          'Baris 3 sah: cabang `else` mengambil keseluruhan `"need " .. price - coins .. " more"` dan memberi "need 10 more". Pepijat berada pada baris 4: menambah 1 kepada string bukan nombor. Contoh ini menunjukkan bahawa if-expression itu sendiri betul — ralat dalam data **hasil** perlu disemak secara berasingan.',
          'Line 3 is valid: the `else` branch takes all of `"need " .. price - coins .. " more"` and gives "need 10 more". The bug is on line 4: adding 1 to a non-numeric string. This example shows that the if-expression itself is fine — errors in the **resulting** data must be checked separately.'),
      }),
      EXPLAIN('if-expr-precedence',
        ['1–2', '`else 0 + 1` bermaksud `else (0 + 1)`; kerana `level > 3`, hasilnya 10.', '`else 0 + 1` means `else (0 + 1)`; since `level > 3`, the result is 10.'],
        ['3–4', 'Dengan kurungan, hasil if-expression (10) ditambah 1 → 11.', 'With parentheses, the if-expression’s result (10) plus 1 → 11.'],
        ['6–7', 'Kurungan juga diperlukan sebelum memanggil kaedah pada hasilnya.', 'Parentheses are also needed before calling a method on the result.'])),
    S('line_by_line',
      EXPLAIN('if-expr-basics',
        ['4', 'Syarat dinilai mengikut susunan; `maxHealth * 0.4` hanya dikira jika syarat pertama palsu.', 'The conditions are evaluated in order; `maxHealth * 0.4` is only computed if the first condition is false.']),
      EXPLAIN('falsy-branch',
        ['11', '`true and nil` → `nil`; `nil or "fallback"` → "fallback". Idiom ini memilih cabang yang salah apabila nilai tengahnya palsu — perangkap yang diselesaikan oleh if-expression.', '`true and nil` → `nil`; `nil or "fallback"` → "fallback". The idiom picks the wrong branch when its middle value is falsy — the trap if-expressions solve.'])),
    S('why_this_way',
      P('Mengapa Luau menambah if-expression? Kerana idiom `and/or` ialah salah satu sumber pepijat Lua yang paling biasa, dan kerana memilih nilai secara bersyarat sangat kerap dalam kod UI dan permainan. Mengapa `else` wajib? Supaya tiada kes "terlupa" yang secara senyap memberi `nil`.',
        'Why did Luau add if-expressions? Because the `and/or` idiom is one of the most common sources of Lua bugs, and because choosing a value conditionally is very frequent in UI and game code. Why is `else` required? So there is no "forgotten" case that silently gives `nil`.'),
      P('Gunakan if-expression **apabila** memilih satu nilai; gunakan pernyataan `if` **apabila** melakukan tindakan atau apabila cabang memerlukan beberapa langkah.', 'Use an if-expression **when** choosing one value; use an `if` statement **when** performing actions or when a branch needs several steps.')),
    S('execution_flow',
      OL(
        ['`if health <= 0 then … elseif health < maxHealth * 0.4 then … else …`', '`if health <= 0 then … elseif health < maxHealth * 0.4 then … else …`'],
        ['Syarat 1: 35 <= 0 → palsu; cabang "dead" tidak dinilai.', 'Condition 1: 35 <= 0 → false; the "dead" branch is not evaluated.'],
        ['Syarat 2: 35 < 40 → benar → hasil "critical"; cabang `else` tidak dinilai.', 'Condition 2: 35 < 40 → true → the result is "critical"; the `else` branch is not evaluated.'],
      )),
    S('memory_behaviour',
      P('If-expression dikompil kepada lompatan bersyarat, sama seperti pernyataan `if` — tiada peruntukan dan tiada kos tambahan. Kerana hanya cabang terpilih dinilai, string atau table dalam cabang lain tidak dicipta.',
        'An if-expression compiles to conditional jumps, just like an `if` statement — no allocation and no extra cost. Because only the chosen branch is evaluated, strings or tables in the other branches are not created.')),
    S('alternative_implementations',
      P('Untuk banyak pilihan berdasarkan nilai yang tetap, table carian lebih ringkas daripada rantaian `elseif`:', 'For many choices based on a fixed value, a lookup table is shorter than an `elseif` chain:'),
      CODE('lookup-instead', 'luau', 'luau', ['Table carian sebagai alternatif', 'A lookup table as an alternative'], `
local RARITY_COLOUR = {common = "grey", rare = "blue", epic = "purple", legendary = "gold"}

local function colourFor(rarity: string): string
  return RARITY_COLOUR[rarity] or "white"
end

print(colourFor("epic"), colourFor("legendary"), colourFor("mythic"))
`, 'purple\tgold\twhite'),
      EXPLAIN('lookup-instead',
        ['1', 'Pemetaan data dan bukannya empat cabang `elseif`.', 'A data mapping instead of four `elseif` branches.'],
        ['3–5', '`or` memberi lalai untuk kunci yang tidak dikenali — selamat kerana tiada warna yang `false`.', '`or` gives a default for unknown keys — safe because no colour is `false`.'],
        ['7', 'Dua padanan dan satu lalai.', 'Two matches and one default.'])),
    S('common_mistakes',
      UL(
        ['Terlupa `else`.', 'Forgetting the `else`.'],
        ['Menulis `end` di hujung if-expression.', 'Writing `end` at the end of an if-expression.'],
        ['Menggabungkan tanpa kurungan dan mendapat keutamaan yang salah.', 'Combining without parentheses and getting the wrong precedence.'],
        ['Meletakkan kesan sampingan (seperti `print`) dalam cabang — gunakan pernyataan `if`.', 'Putting side effects (such as `print`) in branches — use an `if` statement.'],
      )),
    S('debugging',
      P('Ralat if-expression yang paling biasa ialah ralat sintaks — `Expected \'else\'…` — yang dilaporkan pada baris selepas ungkapan. Ralat logik biasanya datang daripada keutamaan: jika hasil kelihatan "kurang satu operasi", periksa sama ada cabang `else` menelan sebahagian ungkapan yang anda maksudkan untuk keseluruhan. Cetak hasil if-expression secara berasingan sebelum menggunakannya. Contoh berikut menunjukkan if-expression bersarang yang ditulis semula supaya mudah disemak:',
        'The most common if-expression error is a syntax error — `Expected \'else\'…` — reported on the line after the expression. Logic errors usually come from precedence: if a result looks "one operation short", check whether the `else` branch swallowed part of an expression you meant for the whole. Print the if-expression’s result separately before using it. The following example rewrites a nested if-expression so it is easy to check:'),
      CODE('flat-if-expr', 'luau', 'luau', ['If-expression rata dengan elseif', 'A flat if-expression with elseif'], `
local function grade(score: number): string
  return if score >= 90 then "A"
    elseif score >= 75 then "B"
    elseif score >= 50 then "C"
    else "F"
end

for _, s in {95, 80, 50, 12} do
  print(s, grade(s))
end
`, '95\tA\n80\tB\n50\tC\n12\tF'),
      EXPLAIN('flat-if-expr',
        ['1–6', 'If-expression boleh merentas beberapa baris; setiap `elseif` pada barisnya sendiri dibaca seperti jadual.', 'An if-expression can span several lines; each `elseif` on its own line reads like a table.'],
        ['8–10', 'Satu ujian bagi setiap gred, termasuk sempadan 50.', 'One test per grade, including the boundary 50.'])),
    S('performance',
      P('If-expression sama pantasnya dengan pernyataan `if` yang setara. Ia lebih pantas daripada idiom `and/or` dalam sesetengah kes kerana tiada penilaian truthiness tambahan pada nilai cabang.', 'An if-expression is as fast as the equivalent `if` statement. It can be faster than the `and/or` idiom because there is no extra truthiness test on the branch values.')),
    S('software_engineering',
      P('Pernyataan `if` yang panjang untuk satu nilai berbanding if-expression:', 'A long `if` statement for one value versus an if-expression:'),
      CODE('poor-if-statement-value', 'luau', 'luau', ['Pelaksanaan lemah: pernyataan untuk memilih nilai', 'Poor implementation: a statement to choose a value'], `
local wins = 7
local title
if wins >= 10 then
  title = "Champion"
elseif wins >= 5 then
  title = "Veteran"
else
  title = "Rookie"
end
print(title)
`, 'Veteran'),
      EXPLAIN('poor-if-statement-value',
        ['1–9', 'Sembilan baris untuk satu nilai; `title` diisytiharkan tanpa nilai dan diberikan di tiga tempat — mudah terlupa satu cabang.', 'Nine lines for one value; `title` is declared without a value and assigned in three places — easy to forget a branch.'],
        ['10', 'Keputusan: 7 kemenangan → "Veteran".', 'The result: 7 wins → "Veteran".']),
      CODE('improved-if-expression-value', 'luau', 'luau', ['Pelaksanaan lebih baik: satu if-expression', 'Improved implementation: one if-expression'], `
local wins = 7
local title = if wins >= 10 then "Champion" elseif wins >= 5 then "Veteran" else "Rookie"
print(title)
`, 'Veteran'),
      EXPLAIN('improved-if-expression-value',
        ['1–3', '`title` diisytiharkan dan diberi nilai sekali; `else` wajib memastikan setiap kes dikendalikan.', '`title` is declared and assigned once; the required `else` ensures every case is handled.'])),
    S('industry_use_cases',
      UL(
        ['Kod UI Roblox memilih teks, warna dan ikon dengan if-expression.', 'Roblox UI code chooses text, colours and icons with if-expressions.'],
        ['Sistem pergerakan memilih kelajuan berdasarkan keadaan (berlari, berenang, membongkok).', 'Movement systems choose speeds based on state (running, swimming, crouching).'],
        ['Panduan gaya Roblox mengesyorkan if-expression berbanding `and/or`.', 'The Roblox style guide recommends if-expressions over `and/or`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis semula `x = cond and 0 or 1` dengan if-expression; uji dengan `cond = true`.', 'Rewrite `x = cond and 0 or 1` with an if-expression; test with `cond = true`.'],
        ['Tambah gred "B+" untuk skor ≥ 85 dalam `flat-if-expr`.', 'Add a "B+" grade for scores ≥ 85 in `flat-if-expr`.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Label HUD.** Bina tiga label HUD untuk pemain — kesihatan, peluru dan status sambungan — setiap satu dengan if-expression, termasuk satu cabang yang bernilai `nil` (tiada ikon).', '**HUD labels.** Build three HUD labels for a player — health, ammo and connection status — each with an if-expression, including one branch whose value is `nil` (no icon).'),
      CODE('hud-labels', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function hud(p)
  local healthLabel = if p.health <= 0 then "DOWN" elseif p.health < 30 then \`LOW {p.health}\` else tostring(p.health)
  local ammoLabel = if p.ammo == 0 then "RELOAD" else \`{p.ammo}/{p.maxAmmo}\`
  local pingIcon = if p.ping > 200 then "slow" elseif p.ping > 100 then "ok" else nil
  return healthLabel, ammoLabel, pingIcon
end

print(hud({health = 25, ammo = 0, maxAmmo = 30, ping = 250}))
print(hud({health = 90, ammo = 12, maxAmmo = 30, ping = 40}))
`, 'LOW 25\tRELOAD\tslow\n90\t12/30\tnil'),
      EXPLAIN('hud-labels',
        ['1–2', 'Kesihatan: tiga keadaan dengan interpolasi dalam cabang.', 'Health: three states with interpolation inside a branch.'],
        ['3', 'Peluru: "RELOAD" atau kiraan.', 'Ammo: "RELOAD" or the count.'],
        ['4', 'Ikon ping: `nil` apabila sambungan baik — if-expression memulangkannya dengan betul.', 'Ping icon: `nil` when the connection is good — the if-expression returns it correctly.'],
        ['5–9', 'Tiga nilai dipulangkan dan dicetak untuk dua pemain.', 'Three values returned and printed for two players.'])),
    S('summary',
      UL(
        ['`if c then a elseif d then b else e` — ungkapan yang menghasilkan satu nilai.', '`if c then a elseif d then b else e` — an expression that produces one value.'],
        ['`else` wajib; tiada `end`; hanya cabang terpilih dinilai.', '`else` is required; no `end`; only the chosen branch is evaluated.'],
        ['Selamat dengan cabang `false`/`nil` — tidak seperti `and/or`.', 'Safe with `false`/`nil` branches — unlike `and/or`.'],
        ['Balut dengan kurungan untuk menggabungkan dengan operator lain.', 'Wrap in parentheses to combine with other operators.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah `if false then 1 else 2 * 3`?', 'What is `if false then 1 else 2 * 3`?'],
        ['Mengapakah `true and false or "x"` memberi "x"?', 'Why does `true and false or "x"` give "x"?'],
        ['Mengapakah `else` wajib dalam if-expression?', 'Why is `else` required in an if-expression?'],
        ['Bilakah pernyataan `if` lebih baik daripada if-expression?', 'When is an `if` statement better than an if-expression?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Syntax: if-then-else expressions', url: `${LUAU}/syntax#if-then-else-expressions` },
        { title: 'Luau RFC — if-then-else expressions', url: 'https://github.com/luau-lang/rfcs/blob/master/docs/syntax-if-expression.md' },
        { title: 'Roblox Creator Hub — Control structures', url: `${DOCS}/luau/control-structures` },
        { title: 'Roblox Lua Style Guide', url: 'https://roblox.github.io/lua-style-guide/' },
      )),
  ],
};

// ─── 4.3 string.format and type conversion ─────────────────────────────────

export const LUAU102_4_3: LectureContentDef = {
  courseCode: 'LUAU102',
  module: 4,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan `string.format` dengan `%d`, `%s`, `%*`, `%f`, `%x`, `%q` dan lebar/ketepatan.', 'Use `string.format` with `%d`, `%s`, `%*`, `%f`, `%x`, `%q` and width/precision.'],
        ['Menerangkan perbezaan Luau: `%s` hanya menerima string dan nombor; `%*` menerima apa sahaja; `%d` memotong pecahan.', 'Explain Luau specifics: `%s` accepts only strings and numbers; `%*` accepts anything; `%d` truncates fractions.'],
        ['Menukar jenis dengan `tostring` dan `tonumber` (termasuk asas).', 'Convert types with `tostring` and `tonumber` (including bases).'],
        ['Mengesahkan input teks sebelum menukarnya.', 'Validate text input before converting it.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1–4.2: interpolasi dan if-expression.', 'Lectures 4.1–4.2: interpolation and if-expressions.'],
        ['Modul 2: jenis nilai dan [[coercion|penukaran automatik]].', 'Module 2: value types and [[coercion|automatic conversion]].'],
      )),
    S('introduction',
      P('Interpolasi menyelesaikan kebanyakan keperluan teks, tetapi permainan juga memerlukan pemformatan yang tepat: harga dengan dua tempat perpuluhan, papan skor dengan lajur sejajar, kod warna dalam heksadesimal, pemasa dengan sifar di hadapan. `string.format` menyediakan kawalan ini. Pada masa yang sama, data sering tiba dalam jenis yang salah — nombor sebagai teks daripada input atau simpanan — dan mesti ditukar dengan selamat. Kuliah ini menggabungkan kedua-duanya, dengan perhatian khusus kepada tingkah laku `string.format` Luau yang berbeza daripada Lua 5.4.',
        'Interpolation covers most text needs, but games also need exact formatting: prices with two decimal places, scoreboards with aligned columns, colour codes in hexadecimal, timers with leading zeros. `string.format` provides that control. At the same time, data often arrives in the wrong type — numbers as text from input or storage — and must be converted safely. This lecture combines both, with special attention to how Luau’s `string.format` differs from Lua 5.4.'),
      KEY('`string.format(templat, …)` — setiap `%` dalam templat digantikan oleh satu argumen, mengikut susunan.', '`string.format(template, …)` — every `%` in the template is replaced by one argument, in order.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`%d` — integer (Luau memotong pecahan: 3.7 → 3); `%5d` lebar 5; `%05d` sifar di hadapan.', '`%d` — integer (Luau truncates fractions: 3.7 → 3); `%5d` width 5; `%05d` leading zeros.'],
        ['`%f` — float; `%.2f` dua tempat perpuluhan; `%e` notasi saintifik.', '`%f` — float; `%.2f` two decimal places; `%e` scientific notation.'],
        ['`%s` — string atau nombor sahaja; `%-10s` rata kiri; `%.3s` potong kepada 3 aksara.', '`%s` — strings or numbers only; `%-10s` left-aligned; `%.3s` truncated to 3 characters.'],
        ['`%*` (Luau) — sebarang nilai melalui `tostring`; `%x`/`%X` heksadesimal; `%q` string berpetik; `%%` tanda peratus.', '`%*` (Luau) — any value through `tostring`; `%x`/`%X` hexadecimal; `%q` a quoted string; `%%` a percent sign.'],
        ['`tostring(v)` sentiasa berjaya; `tonumber(s [, asas])` memulangkan `nil` jika gagal.', '`tostring(v)` always succeeds; `tonumber(s [, base])` returns `nil` on failure.'],
      )),
    S('detailed_theory',
      P('`string.format` membaca templat dari kiri ke kanan; setiap spesifikasi `%` mengambil argumen seterusnya dan memformatnya. Luau melaksanakan fungsi ini sendiri, dengan beberapa perbezaan daripada Lua 5.4 yang perlu diketahui. `%s` dalam Luau hanya menerima string dan nombor — `nil`, boolean atau table menimbulkan ralat `invalid argument #N to \'format\' (string expected, got …)`. Luau menambah `%*`, yang menerima **sebarang** nilai dan menukarnya dengan `tostring` — inilah yang digunakan oleh interpolasi. `%d` menerima nombor bukan bulat dan memotong pecahannya (Lua 5.4 menimbulkan ralat). Nombor dibundarkan dalam `%.Nf` mengikut nilai binari sebenar, jadi 0.5, 1.5, 2.5 dengan `%.0f` memberi 0, 2, 2 (bundar ke genap).',
        '`string.format` reads the template left to right; each `%` specifier takes the next argument and formats it. Luau implements this function itself, with a few differences from Lua 5.4 worth knowing. `%s` in Luau only accepts strings and numbers — `nil`, booleans or tables raise `invalid argument #N to \'format\' (string expected, got …)`. Luau adds `%*`, which accepts **any** value and converts it with `tostring` — this is what interpolation uses. `%d` accepts non-whole numbers and truncates the fraction (Lua 5.4 raises an error). Numbers are rounded in `%.Nf` according to their real binary value, so 0.5, 1.5, 2.5 with `%.0f` give 0, 2, 2 (round half to even).'),
      P('Penukaran jenis berlaku dalam dua arah. `tostring` menukar sebarang nilai kepada teks: nombor bulat tanpa `.0` (`tostring(12.0)` ialah "12"), table dan fungsi sebagai alamat. `tonumber` menghurai teks: ia menerima ruang di sekeliling, notasi saintifik (`"1e2"` → 100), heksadesimal (`"0xFF"`) dan asas pilihan 2–36 (`tonumber("ff", 16)` → 255), dan memulangkan `nil` untuk sebarang teks yang tidak sah — termasuk `"12abc"`. Kerana `nil` ialah keputusan yang sah, setiap penggunaan `tonumber` pada data luar mesti diikuti semakan `nil`. Penukaran automatik string kepada nombor dalam aritmetik (`"5" + 1`) wujud, tetapi bergantung padanya menyembunyikan dari mana nilai datang; tukar secara eksplisit di sempadan.',
        'Type conversion happens in two directions. `tostring` turns any value into text: whole numbers without `.0` (`tostring(12.0)` is "12"), tables and functions as addresses. `tonumber` parses text: it accepts surrounding spaces, scientific notation (`"1e2"` → 100), hexadecimal (`"0xFF"`) and an optional base 2–36 (`tonumber("ff", 16)` → 255), and returns `nil` for any invalid text — including `"12abc"`. Because `nil` is a valid result, every use of `tonumber` on external data must be followed by a `nil` check. Automatic string-to-number conversion in arithmetic (`"5" + 1`) exists, but relying on it hides where values come from; convert explicitly at the boundary.')),
    S('technical_terminology', TERMS('coercion', 'string-interpolation', 'typeof-function', 'escape-sequence')),
    S('syntax_rules',
      UL(
        ['`string.format("%-8s|%5d|%6.2f", name, n, x)` — penjajaran dan ketepatan.', '`string.format("%-8s|%5d|%6.2f", name, n, x)` — alignment and precision.'],
        ['`("%d coins"):format(n)` — gaya kaedah yang setara.', '`("%d coins"):format(n)` — the equivalent method style.'],
        ['`tonumber(teks)` · `tonumber(teks, 16)` · `tostring(nilai)`.', '`tonumber(text)` · `tonumber(text, 16)` · `tostring(value)`.'],
      )),
    S('code_demonstration',
      CODE('format-specs', 'luau', 'luau', ['Spesifikasi format', 'Format specifiers'], `
print(string.format("%d coins, %05d id, %+d change", 1250, 42, 7))
print(string.format("%.2f | %8.3f | %e", 3.14159, 2.5, 123456))
print(string.format("[%-6s] [%6s] [%.3s]", "ab", "ab", "abcdef"))
print(string.format("#%02X%02X%02X", 255, 128, 0))
print(string.format("%* %* %*", nil, true, {1} ~= nil))
print(string.format("100%% done, %q", 'say "hi"'))
`, '1250 coins, 00042 id, +7 change\n3.14 |    2.500 | 1.234560e+05\n[ab    ] [    ab] [abc]\n#FF8000\nnil true true\n100% done, "say \\"hi\\""'),
      EXPLAIN('format-specs',
        ['1', '`%d` integer; `%05d` diisi sifar hingga 5 digit; `%+d` sentiasa menunjukkan tanda.', '`%d` integer; `%05d` zero-padded to 5 digits; `%+d` always shows the sign.'],
        ['2', '`%.2f` dua tempat perpuluhan; `%8.3f` lebar 8 dengan 3 tempat; `%e` saintifik.', '`%.2f` two decimal places; `%8.3f` width 8 with 3 places; `%e` scientific.'],
        ['3', 'Rata kiri, rata kanan, dan dipotong kepada 3 aksara.', 'Left-aligned, right-aligned, and truncated to 3 characters.'],
        ['4', 'Kod warna heksadesimal: `%02X` — dua digit huruf besar.', 'A hexadecimal colour code: `%02X` — two upper-case digits.'],
        ['5', '`%*` (Luau) memformat sebarang nilai, termasuk `nil` dan boolean.', '`%*` (Luau) formats any value, including `nil` and booleans.'],
        ['6', '`%%` memberi tanda peratus; `%q` memetik string dengan escape.', '`%%` gives a percent sign; `%q` quotes a string with escapes.'])),
    S('complete_examples',
      CODE('format-luau-rules', 'luau', 'luau', ['Peraturan khas Luau', 'Luau-specific rules'], `
print(string.format("%d|%d", 3.7, -3.7))
print(string.format("%.0f %.0f %.0f", 0.5, 1.5, 2.5))
print(string.format("%s and %s", "text", 42))
print(string.format("%5.2f", "3.14159"))
`, '3|-3\n0 2 2\ntext and 42\n 3.14', {
        debug: BUG(`
local playerName = nil
print(string.format("Welcome, %s!", playerName))
`, "example:2: invalid argument #2 to 'format' (string expected, got nil)",
          'Dalam Luau, `%s` hanya menerima string dan nombor; `nil` ditolak. Argumen **#2** ialah `playerName` (argumen #1 ialah templat). Gunakan `%*` (yang menukar sebarang nilai), berikan lalai (`playerName or "guest"`), atau gunakan interpolasi.',
          'In Luau, `%s` only accepts strings and numbers; `nil` is rejected. Argument **#2** is `playerName` (argument #1 is the template). Use `%*` (which converts any value), provide a default (`playerName or "guest"`), or use interpolation.'),
      }),
      EXPLAIN('format-luau-rules',
        ['1', '`%d` memotong ke arah sifar: 3.7 → 3, −3.7 → −3. (Lua 5.4 menimbulkan ralat untuk nombor bukan bulat.)', '`%d` truncates towards zero: 3.7 → 3, −3.7 → −3. (Lua 5.4 raises an error for non-whole numbers.)'],
        ['2', 'Bundar ke genap untuk nilai .5 yang tepat: 0, 2, 2.', 'Round half to even for exact .5 values: 0, 2, 2.'],
        ['3', '`%s` menerima nombor.', '`%s` accepts numbers.'],
        ['4', 'String yang kelihatan seperti nombor diterima oleh `%f`.', 'A string that looks like a number is accepted by `%f`.']),
      CODE('conversions', 'luau', 'luau', ['tostring dan tonumber', 'tostring and tonumber'], `
print(tostring(12.0), tostring(-0.5), tostring(true), tostring(nil))
print(tonumber("42"), tonumber("  7  "), tonumber("1e3"), tonumber("0x1F"))
print(tonumber("ff", 16), tonumber("101", 2), tonumber("z", 36))
print(tonumber("12abc"), tonumber(""), tonumber("12", 2))
`, '12\t-0.5\ttrue\tnil\n42\t7\t1000\t31\n255\t5\t35\nnil\tnil\tnil', {
        debug: BUG(`
local savedCoins = "1,250"
local coins = tonumber(savedCoins)
print(string.format("%d coins", coins))
`, "example:3: invalid argument #2 to 'format' (number expected, got nil)",
          '`tonumber("1,250")` memulangkan `nil` kerana koma bukan sebahagian daripada format nombor. Ralat muncul hanya pada baris 3, apabila `%d` menerima `nil`. Semak hasil `tonumber` serta-merta, dan bersihkan teks dahulu jika perlu: `savedCoins:gsub(",", "")`.',
          '`tonumber("1,250")` returns `nil` because the comma is not part of the number format. The error only appears on line 3, when `%d` receives `nil`. Check the result of `tonumber` immediately, and clean the text first if needed: `savedCoins:gsub(",", "")`.'),
      }),
      EXPLAIN('conversions',
        ['1', '`tostring`: 12.0 menjadi "12"; `nil` menjadi "nil".', '`tostring`: 12.0 becomes "12"; `nil` becomes "nil".'],
        ['2', '`tonumber` menerima ruang, notasi saintifik dan heksadesimal.', '`tonumber` accepts spaces, scientific notation and hexadecimal.'],
        ['3', 'Dengan asas: heksadesimal, binari dan asas 36 (digit 0–9 dan a–z).', 'With a base: hexadecimal, binary and base 36 (digits 0–9 and a–z).'],
        ['4', 'Teks tidak sah memberi `nil`: aksara tambahan, string kosong, atau digit yang tidak sah untuk asas ("2" dalam binari).', 'Invalid text gives `nil`: extra characters, an empty string, or a digit invalid for the base ("2" in binary).'])),
    S('line_by_line',
      EXPLAIN('format-specs',
        ['4', '`%02X` dengan 128 memberi "80" dan dengan 0 memberi "00" — sifar di hadapan memastikan setiap komponen warna tepat dua digit.', '`%02X` with 128 gives "80" and with 0 gives "00" — leading zeros keep every colour component exactly two digits.']),
      EXPLAIN('conversions',
        ['2', '`tonumber("0x1F")` ialah 31; perhatikan bahawa `tonumber("0b101")` **tidak** disokong (memberi `nil`), walaupun `0b101` sah sebagai literal dalam kod Luau.', '`tonumber("0x1F")` is 31; note that `tonumber("0b101")` is **not** supported (it gives `nil`), even though `0b101` is valid as a literal in Luau code.'])),
    S('why_this_way',
      P('Mengapa `%s` dalam Luau menolak `nil`? Kerana memaparkan "nil" kepada pemain biasanya pepijat; ralat yang awal lebih berguna daripada teks yang salah. Apabila anda memang mahu memaparkan sebarang nilai (contohnya dalam log), `%*` atau interpolasi menyatakan niat itu secara eksplisit. Mengapa `tonumber` memulangkan `nil` dan bukan ralat? Supaya input yang salah boleh dikendalikan dengan `if` biasa.',
        'Why does `%s` in Luau reject `nil`? Because displaying "nil" to a player is usually a bug; an early error is more useful than wrong text. When you do want to display any value (for example in logs), `%*` or interpolation states that intent explicitly. Why does `tonumber` return `nil` instead of raising an error? So that wrong input can be handled with an ordinary `if`.'),
      P('Gunakan `string.format` **apabila** anda perlukan lebar, ketepatan, sifar di hadapan atau heksadesimal; interpolasi untuk yang lain. Tukar dengan `tonumber` **di sempadan** — sebaik sahaja data luar diterima.', 'Use `string.format` **when** you need widths, precision, leading zeros or hexadecimal; interpolation for everything else. Convert with `tonumber` **at the boundary** — as soon as external data arrives.')),
    S('execution_flow',
      OL(
        ['`string.format("%05d id", 42)`: templat dibaca hingga `%05d`.', '`string.format("%05d id", 42)`: the template is read up to `%05d`.'],
        ['Argumen seterusnya (42) diformat sebagai integer lebar 5 dengan sifar → "00042".', 'The next argument (42) is formatted as a width-5 integer with zeros → "00042".'],
        ['Baki templat (" id") disalin → "00042 id".', 'The rest of the template (" id") is copied → "00042 id".'],
      )),
    S('memory_behaviour',
      P('`string.format` mencipta satu string hasil; templat itu sendiri ialah string pemalar yang di-intern dan dikongsi. `tonumber` tidak memperuntukkan memori (nombor ialah nilai); `tostring` pada nombor mencipta string baharu setiap kali — dalam gelung panas, format sekali dan simpan.',
        '`string.format` creates one result string; the template itself is an interned constant string and is shared. `tonumber` allocates no memory (numbers are values); `tostring` on a number creates a new string each time — in hot loops, format once and keep it.')),
    S('alternative_implementations',
      P('Gaya kaedah `("…"):format(…)` setara dan kadang-kadang lebih mudah dibaca dalam rantaian:', 'The method style `("…"):format(…)` is equivalent and sometimes easier to read in chains:'),
      CODE('format-method', 'luau', 'luau', ['format sebagai kaedah', 'format as a method'], `
local template = "%s reached %d%%"
print(template:format("Aina", 75))
print(("%.1f km"):format(12.345):upper())
`, 'Aina reached 75%\n12.3 KM'),
      EXPLAIN('format-method',
        ['1–2', 'Templat yang disimpan, digunakan dengan sintaks `:`.', 'A stored template, used with `:` syntax.'],
        ['3', 'Literal string mesti dalam kurungan sebelum `:format`; hasilnya boleh dirantai dengan `:upper()`.', 'A string literal must be in parentheses before `:format`; the result can be chained with `:upper()`.'])),
    S('common_mistakes',
      UL(
        ['Menghantar `nil` atau boolean kepada `%s` dalam Luau.', 'Passing `nil` or a boolean to `%s` in Luau.'],
        ['Bilangan argumen tidak sepadan dengan bilangan `%`.', 'The number of arguments not matching the number of `%`s.'],
        ['Tidak menyemak `nil` selepas `tonumber`.', 'Not checking for `nil` after `tonumber`.'],
        ['Menjangka `%d` membundarkan (ia memotong) — gunakan `math.round` dahulu.', 'Expecting `%d` to round (it truncates) — use `math.round` first.'],
      )),
    S('debugging',
      P('Ralat `string.format` dalam Luau sentiasa menyebut nombor argumen dan jenis yang dijangka: `invalid argument #3 to \'format\' (number expected, got string)`. Ingat argumen #1 ialah templat, jadi #2 ialah nilai pertama. Kira spesifikasi `%` dalam templat dan bandingkan dengan argumen. Untuk penukaran, cetak `typeof` input dan hasil `tonumber` bersama:',
        '`string.format` errors in Luau always name the argument number and the expected type: `invalid argument #3 to \'format\' (number expected, got string)`. Remember argument #1 is the template, so #2 is the first value. Count the `%` specifiers in the template and compare with the arguments. For conversions, print the input’s `typeof` and the `tonumber` result together:'),
      CODE('parse-amount', 'luau', 'luau', ['Penghurai jumlah yang selamat', 'A safe amount parser'], `
local function parseAmount(text: string): (number?, string?)
  local cleaned = text:gsub("[,%s]", "")
  local n = tonumber(cleaned)
  if n == nil then
    return nil, string.format("cannot read %q as a number", text)
  end
  return n, nil
end

print(parseAmount("1,250"))
print(parseAmount(" 300 "))
print(parseAmount("lots"))
`, '1250\tnil\n300\tnil\nnil\tcannot read "lots" as a number'),
      EXPLAIN('parse-amount',
        ['1–3', 'Buang koma dan ruang dengan `gsub` (kurungan tidak diperlukan kerana hanya nilai pertama diberikan kepada `cleaned`), kemudian tukar.', 'Remove commas and spaces with `gsub` (no parentheses needed because only the first value is assigned to `cleaned`), then convert.'],
        ['4–7', 'Kegagalan: `nil` dan mesej yang memetik input dengan `%q`.', 'Failure: `nil` and a message quoting the input with `%q`.'],
        ['10–12', 'Teks dengan koma, teks dengan ruang, dan teks yang tidak sah.', 'Text with a comma, text with spaces, and invalid text.'])),
    S('performance',
      P('`string.format` agak mahal berbanding aritmetik kerana ia menghurai templat setiap kali. Dalam UI yang dikemas kini setiap bingkai, format hanya apabila nilai berubah. `tonumber` pantas tetapi menghurai teks — tukar sekali dan simpan nombor, jangan bergantung pada penukaran automatik berulang kali.', '`string.format` is fairly expensive compared with arithmetic because it parses the template every time. In UI updated every frame, format only when the value changes. `tonumber` is fast but parses text — convert once and keep the number; do not rely on repeated automatic conversion.')),
    S('software_engineering',
      P('Penukaran tersembunyi berbanding penukaran di sempadan:', 'Hidden conversion versus conversion at the boundary:'),
      CODE('poor-implicit-coercion', 'luau', 'luau', ['Pelaksanaan lemah: penukaran tersembunyi', 'Poor implementation: hidden conversion'], `
local saved = {coins = "120", bonus = "30"}
local total = saved.coins + saved.bonus
print(total, typeof(saved.coins))
print(saved.coins > "99")
`, '150\tstring\nfalse'),
      EXPLAIN('poor-implicit-coercion',
        ['1–3', 'Penambahan berfungsi kerana penukaran automatik, jadi pepijat jenis tersembunyi.', 'The addition works because of automatic conversion, so the type bug stays hidden.'],
        ['4', 'Tetapi perbandingan string memberi `false` ("120" < "99" dalam susunan aksara) — logik permainan yang salah, tanpa ralat.', 'But the string comparison gives `false` ("120" < "99" in character order) — wrong game logic, with no error.']),
      CODE('improved-boundary-conversion', 'luau', 'luau', ['Pelaksanaan lebih baik: tukar di sempadan', 'Improved implementation: convert at the boundary'], `
local saved = {coins = "120", bonus = "30"}
local coins = tonumber(saved.coins) or 0
local bonus = tonumber(saved.bonus) or 0

print(coins + bonus, typeof(coins))
print(coins > 99)
`, '150\tnumber\ntrue'),
      EXPLAIN('improved-boundary-conversion',
        ['1–3', 'Data ditukar sekali, sebaik sahaja dibaca, dengan lalai yang selamat.', 'The data is converted once, as soon as it is read, with safe defaults.'],
        ['5–6', 'Semua kod seterusnya bekerja dengan nombor sebenar; perbandingan betul.', 'All later code works with real numbers; the comparison is correct.'])),
    S('industry_use_cases',
      UL(
        ['Papan pendahulu dan kedai memformat harga dan skor dengan `string.format`.', 'Leaderboards and shops format prices and scores with `string.format`.'],
        ['Data yang disimpan sebagai teks (contohnya konfigurasi) ditukar dengan `tonumber` semasa dimuatkan.', 'Data stored as text (for example configuration) is converted with `tonumber` when loaded.'],
        ['Kod warna dan ID dipaparkan dalam heksadesimal dengan `%X`.', 'Colour codes and IDs are displayed in hexadecimal with `%X`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Format 3725 saat sebagai `01:02:05` dengan `%02d`.', 'Format 3725 seconds as `01:02:05` with `%02d`.'],
        ['Tukar warna (34, 177, 76) kepada heksadesimal.', 'Convert the colour (34, 177, 76) to hexadecimal.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Resit kedai.** Hurai senarai item daripada teks (harga mungkin mengandungi koma), tolak baris yang tidak sah, dan cetak resit dengan lajur sejajar dan jumlah.', '**A shop receipt.** Parse a list of items from text (prices may contain commas), reject invalid lines, and print a receipt with aligned columns and a total.'),
      CODE('shop-receipt', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local rawLines = {"Sword=1,200", "Potion=45", "Cape=free", "Shield=850"}
local total = 0

for _, line in rawLines do
  local name, priceText = line:match("^(%w+)=(.+)$")
  local price = tonumber((priceText:gsub(",", "")))
  if price then
    total += price
    print(string.format("%-8s %6d", name, price))
  else
    print(string.format("%-8s %6s", name, "??"))
  end
end
print(string.rep("-", 15))
print(string.format("%-8s %6d", "TOTAL", total))
`, 'Sword      1200\nPotion       45\nCape         ??\nShield      850\n---------------\nTOTAL      2095'),
      EXPLAIN('shop-receipt',
        ['1–2', 'Baris mentah dan jumlah.', 'The raw lines and the total.'],
        ['4–6', 'Pecahkan `nama=harga` dengan corak; buang koma; kurungan luar mengambil hanya teks daripada `gsub`.', 'Split `name=price` with a pattern; remove commas; the outer parentheses take only the text from `gsub`.'],
        ['7–12', 'Harga sah dijumlahkan dan dicetak dalam lajur; yang tidak sah dipaparkan sebagai "??".', 'Valid prices are added and printed in columns; invalid ones are shown as "??".'],
        ['14–15', 'Garis pemisah dan jumlah dalam lajur yang sama.', 'A divider line and the total in the same columns.'])),
    S('summary',
      UL(
        ['`string.format`: `%d %f %s %* %x %q %%` dengan lebar dan ketepatan.', '`string.format`: `%d %f %s %* %x %q %%` with width and precision.'],
        ['Luau: `%s` hanya string/nombor; `%*` sebarang nilai; `%d` memotong pecahan.', 'Luau: `%s` only strings/numbers; `%*` any value; `%d` truncates fractions.'],
        ['`tonumber` → nombor atau `nil`; sentiasa semak.', '`tonumber` → a number or `nil`; always check.'],
        ['Tukar data luar di sempadan; jangan bergantung pada penukaran automatik.', 'Convert external data at the boundary; do not rely on automatic conversion.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah `string.format("%03d", 7)`?', 'What is `string.format("%03d", 7)`?'],
        ['Apakah yang berlaku dengan `string.format("%s", nil)` dalam Luau? Bagaimana membetulkannya?', 'What happens with `string.format("%s", nil)` in Luau? How do you fix it?'],
        ['Apakah `tonumber("12abc")`?', 'What is `tonumber("12abc")`?'],
        ['Mengapakah `"120" > "99"` palsu?', 'Why is `"120" > "99"` false?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Luau — Library: string.format', url: `${LUAU}/library#string-library` },
        { title: 'Roblox Creator Hub — string library', url: `${DOCS}/reference/engine/libraries/string` },
        { title: 'Luau — Library: tonumber and tostring', url: `${LUAU}/library#global-functions` },
        { title: 'C printf format specification (cppreference)', url: 'https://en.cppreference.com/w/c/io/fprintf' },
      )),
  ],
};

export const LUAU102_M4 = [LUAU102_4_1, LUAU102_4_2, LUAU102_4_3];
