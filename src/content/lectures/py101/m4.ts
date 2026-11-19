import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * PY101 · Module 4 — Errors and Basic Debugging.
 * Every example is Python 3.13 and is executed by CPython 3.13 (npm run verify:code). Broken variants are
 * executed too, and their documented error is the exact first error line CPython 3.13 reports.
 */

const PYDOCS = 'https://docs.python.org/3.13';

// ─── 4.1 Syntax errors and reading tracebacks ─────────────────────────────

export const PY101_4_1: LectureContentDef = {
  courseCode: 'PY101',
  module: 4,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Mengenal pasti [[syntax-error|ralat sintaks]] dan `IndentationError`, dan menerangkan mengapa tiada baris program dijalankan.', 'Recognise [[syntax-error|syntax errors]] and `IndentationError`, and explain why no line of the program runs.'],
        ['Membaca [[traceback|traceback]] dari bawah ke atas: jenis ralat, mesej, fail, nombor baris dan penunjuk `^`.', 'Read a [[traceback|traceback]] from the bottom up: the error type, the message, the file, the line number and the `^` pointer.'],
        ['Membetulkan ralat sintaks yang lazim: kurungan dan petik yang tidak ditutup, `:` yang tertinggal, `=` berbanding `==`, kata kunci sebagai nama.', 'Fix common syntax errors: unclosed brackets and quotes, a missing `:`, `=` versus `==`, keywords used as names.'],
        ['Menggunakan cadangan Python 3.13 ("Perhaps you forgot a comma?", "Did you mean …?") dengan kritis.', 'Use Python 3.13’s suggestions ("Perhaps you forgot a comma?", "Did you mean …?") critically.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.2: CPython mengkompil seluruh fail sebelum menjalankannya.', 'Lecture 1.2: CPython compiles the whole file before running it.'],
        ['Modul 3: `print()`, string, `input()` dan struktur baris.', 'Module 3: `print()`, strings, `input()` and line structure.'],
      )),
    S('introduction',
      P('Setiap pengatur cara — termasuk pakar dengan pengalaman dua puluh tahun — menulis kod yang salah setiap hari. Perbezaan antara pemula dan pakar bukanlah bilangan ralat, tetapi **kelajuan memahaminya**. Python membantu dengan mesej ralat yang terperinci, dan Python 3.13 mempunyai mesej yang paling membantu dalam sejarah bahasa itu. Kuliah ini mengajar anda membaca mesej tersebut dengan sistematik, bermula dengan jenis ralat yang paling awal ditemui: ralat sintaks, yang menghalang program daripada bermula langsung.',
        'Every programmer — including experts with twenty years of experience — writes wrong code every day. The difference between a beginner and an expert is not the number of errors but **how quickly they understand them**. Python helps with detailed error messages, and Python 3.13 has the most helpful messages in the language’s history. This lecture teaches you to read those messages systematically, starting with the earliest kind of error: syntax errors, which stop a program from starting at all.'),
      KEY('Baca traceback dari bawah: baris terakhir = APA; baris `File …, line N` = DI MANA.', 'Read a traceback from the bottom: the last line = WHAT; the `File …, line N` line = WHERE.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**[[syntax-error|Ralat sintaks]]:** kod melanggar tatabahasa Python; dikesan semasa kompil, jadi tiada baris dijalankan.', '**[[syntax-error|Syntax error]]:** code breaks Python’s grammar; detected while compiling, so no line runs.'],
        ['**`IndentationError`:** sejenis ralat sintaks — inden yang tidak dijangka, tertinggal atau tidak konsisten.', '**`IndentationError`:** a kind of syntax error — indentation that is unexpected, missing or inconsistent.'],
        ['**[[traceback|Traceback]]:** laporan ralat; baris terakhir memberi jenis dan mesej, baris di atasnya memberi lokasi.', '**[[traceback|Traceback]]:** the error report; the last line gives the type and message, the lines above it give the location.'],
        ['**Penunjuk `^`:** dalam ralat sintaks, menunjuk tempat penghurai menyedari masalah — selalunya pada atau **selepas** kesilapan sebenar.', '**The `^` pointer:** in a syntax error, marks where the parser noticed the problem — often at or **after** the real mistake.'],
        ['**[[reserved-word|Kata kunci]]:** `if`, `for`, `class`, `def`, `True` … tidak boleh dijadikan nama pemboleh ubah.', '**[[reserved-word|Keywords]]:** `if`, `for`, `class`, `def`, `True` … cannot be used as variable names.'],
      )),
    S('detailed_theory',
      P('Ralat sintaks dikesan oleh **penghurai** (parser) semasa fasa kompil (kuliah 1.2). Penghurai membaca token dari kiri ke kanan dan membina pepohon sintaks mengikut tatabahasa Python. Apabila ia menemui token yang tidak boleh muncul di kedudukan itu, ia berhenti dan melaporkan `SyntaxError` dengan nama fail, nombor baris, baris kod itu sendiri dan penunjuk `^` di bawah lajur tempat masalah dikesan. Perkara penting: penghurai melaporkan tempat ia **menyedari** masalah, yang mungkin bukan tempat kesilapan dibuat. Kurungan yang tidak ditutup pada baris 3 mungkin hanya disedari pada baris 4 — walaupun Python 3.10 ke atas kini sering melaporkan baris pembuka secara langsung dengan mesej seperti `\'(\' was never closed`. Petua: jika baris yang ditunjuk kelihatan betul, semak **baris sebelumnya**.',
        'Syntax errors are detected by the **parser** during the compile phase (lecture 1.2). The parser reads tokens from left to right and builds a syntax tree according to Python’s grammar. When it meets a token that cannot appear in that position, it stops and reports a `SyntaxError` with the file name, the line number, the line of code itself and a `^` pointer under the column where the problem was detected. An important point: the parser reports where it **noticed** the problem, which may not be where the mistake was made. An unclosed parenthesis on line 3 might only be noticed on line 4 — although Python 3.10 and later now often report the opening line directly with a message such as `\'(\' was never closed`. Tip: if the indicated line looks correct, check **the line before it**.'),
      P('[[traceback|Traceback]] untuk ralat runtime mempunyai struktur yang lebih panjang. Ia bermula dengan `Traceback (most recent call last):`, diikuti oleh satu blok bagi setiap panggilan fungsi yang aktif — dari yang paling luar (program utama, `<module>`) hingga yang paling dalam (tempat ralat berlaku) — dan berakhir dengan baris `JenisRalat: mesej`. Setiap blok menunjukkan `File "nama.py", line N, in nama_fungsi` dan baris kod itu. Sejak Python 3.11, penanda `~~~^^^` menyerlahkan bahagian tepat ungkapan yang gagal, dan sejak 3.12–3.13 mesej menawarkan cadangan seperti `Did you mean: \'total\'?` untuk nama yang salah eja atau `Perhaps you forgot a comma?`. Cadangan ini adalah tekaan yang baik, bukan jaminan: sentiasa fahami **mengapa** ia betul sebelum menerimanya.',
        'A [[traceback|traceback]] for a runtime error has a longer structure. It starts with `Traceback (most recent call last):`, followed by one block for each active function call — from the outermost (the main program, `<module>`) to the innermost (where the error happened) — and ends with the line `ErrorType: message`. Each block shows `File "name.py", line N, in function_name` and that line of code. Since Python 3.11, `~~~^^^` markers highlight the exact part of the expression that failed, and since 3.12–3.13 messages offer suggestions such as `Did you mean: \'total\'?` for misspelled names or `Perhaps you forgot a comma?`. These suggestions are good guesses, not guarantees: always understand **why** one is right before accepting it.'),
      P('Ralat sintaks yang paling lazim bagi pemula ialah: kurungan, kurungan segi empat atau petik yang tidak ditutup atau tidak sepadan; `:` yang tertinggal di hujung `if`, `for`, `while`, `def`; `=` (assignment) digunakan di tempat `==` (perbandingan); kata kunci digunakan sebagai nama (`class = "5A"`); inden yang tidak konsisten; dan aksara bukan ASCII seperti petik melengkung yang disalin daripada dokumen.',
        'The most common beginner syntax errors are: unclosed or mismatched parentheses, brackets or quotes; a missing `:` at the end of `if`, `for`, `while`, `def`; `=` (assignment) used where `==` (comparison) is meant; a keyword used as a name (`class = "5A"`); inconsistent indentation; and non-ASCII characters such as curly quotes copied from documents.')),
    S('technical_terminology', TERMS('syntax-error', 'traceback', 'indentation', 'reserved-word', 'stack-traceback')),
    S('syntax_rules',
      UL(
        ['Setiap `(`, `[`, `{`, `"` dan `\'` mesti mempunyai pasangan penutup yang sepadan.', 'Every `(`, `[`, `{`, `"` and `\'` must have a matching closing partner.'],
        ['Baris yang membuka blok berakhir dengan `:` dan diikuti oleh sekurang-kurangnya satu baris berinden.', 'A line that opens a block ends with `:` and is followed by at least one indented line.'],
        ['`=` menyimpan nilai; `==` membandingkan nilai.', '`=` stores a value; `==` compares values.'],
        ['Senarai kata kunci: `import keyword` kemudian `keyword.kwlist`.', 'The list of keywords: `import keyword` then `keyword.kwlist`.'],
      )),
    S('code_demonstration',
      P('Contoh ini mengkompil kod yang salah sebagai teks dan mencetak laporan ralat sintaks yang **sama** seperti yang anda lihat dalam terminal, supaya setiap bahagiannya boleh dikaji:', 'This example compiles faulty code as text and prints the **same** syntax-error report you would see in a terminal, so each part of it can be studied:'),
      CODE('syntax-error-anatomy', 'python', 'python', ['Anatomi laporan ralat sintaks', 'Anatomy of a syntax-error report'], `
import traceback

source = "total = (4 + 5\\nprint(total)\\n"
try:
    compile(source, "demo.py", "exec")
except SyntaxError as error:
    print("".join(traceback.format_exception_only(error)), end="")
    print("file:", error.filename, "| line:", error.lineno, "| column:", error.offset)
`, '  File "demo.py", line 1\n    total = (4 + 5\n            ^\nSyntaxError: \'(\' was never closed\nfile: demo.py | line: 1 | column: 9'),
      EXPLAIN('syntax-error-anatomy',
        ['1', '`traceback` memformat laporan ralat dengan cara yang sama seperti interpreter.', '`traceback` formats error reports the same way the interpreter does.'],
        ['3', 'Kod sumber "demo.py" dengan kurungan yang tidak ditutup pada baris 1.', 'Source code for "demo.py" with an unclosed parenthesis on line 1.'],
        ['5', 'Hanya kompil — kod tidak dijalankan.', 'Compile only — the code is not run.'],
        ['6–7', 'Laporan: baris `File "demo.py", line 1`, baris kod, penunjuk `^` di bawah `(` yang tidak ditutup, kemudian jenis dan mesej.', 'The report: the `File "demo.py", line 1` line, the code line, the `^` pointer under the unclosed `(`, then the type and message.'],
        ['8', 'Objek `SyntaxError` menyimpan lokasi sebagai atribut; lajur 9 ialah kedudukan `(` (dikira dari 1).', 'The `SyntaxError` object stores the location as attributes; column 9 is the position of `(` (counting from 1).'])),
    S('complete_examples',
      CODE('pass-check', 'python', 'python', ['Blok if yang betul', 'A correct if block'], `
score = 72
if score >= 50:
    print("Pass")
print("Score recorded:", score)
`, 'Pass\nScore recorded: 72', {
        debug: BUG(`
score = 72
if score = 50:
    print("Pass")
print("Score recorded:", score)
`, "example.py:2: SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?",
          '`=` ialah assignment dan tidak boleh muncul dalam syarat `if`. Python 3.13 mengenal pasti corak ini dan mencadangkan `==` (perbandingan) atau `:=` (ungkapan assignment, topik lanjutan). Di sini maksudnya perbandingan — tetapi perhatikan bahawa logik yang betul ialah `>=`, bukan `==`: cadangan membetulkan sintaks, bukan logik anda.',
          '`=` is assignment and cannot appear in an `if` condition. Python 3.13 recognises this pattern and suggests `==` (comparison) or `:=` (an assignment expression, an advanced topic). Here a comparison is meant — but notice that the correct logic is `>=`, not `==`: the suggestion fixes the syntax, not your logic.'),
      }),
      EXPLAIN('pass-check',
        ['1', 'Markah pelajar.', 'A student’s score.'],
        ['2–3', 'Syarat dengan operator perbandingan `>=`, diakhiri `:`; badan berinden empat ruang (PY103 mengajar `if` dengan mendalam).', 'A condition with the comparison operator `>=`, ending in `:`; the body is indented four spaces (PY103 teaches `if` in depth).'],
        ['4', 'Tidak berinden: berjalan selepas blok `if`, sama ada syarat benar atau tidak.', 'Not indented: runs after the `if` block, whether or not the condition was true.']),
      CODE('matched-brackets', 'python', 'python', ['Kurungan yang sepadan', 'Matching brackets'], `
scores = [70, 85, 90]
print(len(scores), max(scores))
print(round(sum(scores) / len(scores), 1))
`, '3 90\n81.7', {
        debug: BUG(`
scores = [70, 85, 90]
print(len(scores), max(scores))
print(round(sum(scores) / len(scores], 1))
`, "example.py:3: SyntaxError: closing parenthesis ']' does not match opening parenthesis '('",
          'Kurungan bersarang mesti ditutup dalam susunan terbalik: yang terakhir dibuka, yang pertama ditutup. Selepas `len(scores` kurungan `(` masih terbuka, tetapi `]` yang ditemui. Python menamakan kedua-dua aksara yang tidak sepadan. Editor kod yang menyerlahkan pasangan kurungan menjadikan ralat ini mudah dilihat. Perhatikan juga bahawa baris 1–2 yang betul tidak dijalankan.',
          'Nested brackets must be closed in reverse order: the last one opened is the first one closed. After `len(scores` a `(` is still open, but a `]` is found. Python names both mismatched characters. A code editor that highlights bracket pairs makes this error easy to see. Notice also that the correct lines 1–2 do not run.'),
      }),
      EXPLAIN('matched-brackets',
        ['1', 'Senarai tiga markah.', 'A list of three scores.'],
        ['2', 'Dua panggilan fungsi, masing-masing dengan pasangan kurungan sendiri.', 'Two function calls, each with its own pair of parentheses.'],
        ['3', 'Tiga tahap bersarang: `print(round(sum(...) / len(...), 1))`. 245 ÷ 3 = 81.666…, dibundarkan kepada 81.7.', 'Three levels of nesting: `print(round(sum(...) / len(...), 1))`. 245 ÷ 3 = 81.666…, rounded to 81.7.'])),
    S('line_by_line',
      EXPLAIN('syntax-error-anatomy',
        ['7', '`format_exception_only` memulangkan senarai baris laporan; `"".join(...)` menyambungkannya, dan `end=""` mengelakkan baris kosong tambahan kerana laporan sudah berakhir dengan baris baharu.', '`format_exception_only` returns a list of report lines; `"".join(...)` joins them, and `end=""` avoids an extra blank line because the report already ends with a newline.']),
      EXPLAIN('matched-brackets',
        ['3', 'Baca kurungan dari dalam ke luar: `sum(scores)` → 245; `len(scores)` → 3; `/` → 81.666…; `round(…, 1)` → 81.7; `print(…)` memaparkannya. Setiap kurungan pembuka sepadan dengan satu penutup.', 'Read the brackets from the inside out: `sum(scores)` → 245; `len(scores)` → 3; `/` → 81.666…; `round(…, 1)` → 81.7; `print(…)` displays it. Every opening bracket matches one closing bracket.'])),
    S('why_this_way',
      P('Mengapa Python menolak seluruh program kerana satu ralat sintaks, dan bukan menjalankan bahagian yang betul? Kerana tanpa tatabahasa yang sah, Python tidak boleh tahu dengan pasti di mana satu pernyataan berakhir dan yang seterusnya bermula — kurungan yang tidak ditutup boleh "menelan" baris-baris berikutnya. Menjalankan sebahagian program dengan struktur yang tidak pasti boleh merosakkan data. Menolak awal ialah pilihan yang selamat: anda dimaklumkan sebelum apa-apa kesan sampingan berlaku.',
        'Why does Python reject the whole program for one syntax error instead of running the correct parts? Because without a valid grammar, Python cannot know for certain where one statement ends and the next begins — an unclosed bracket can "swallow" the following lines. Running part of a program with an uncertain structure could damage data. Failing early is the safe choice: you are told before any side effect happens.'),
      P('Traceback disusun "most recent call last" supaya baris yang paling penting — jenis dan mesej ralat — berada di bahagian bawah, betul-betul di atas prompt terminal seterusnya, tempat mata anda berada.', 'Tracebacks are ordered "most recent call last" so the most important line — the error type and message — sits at the bottom, right above the next terminal prompt, where your eyes are.')),
    S('execution_flow',
      OL(
        ['Penghurai membaca token: `score`, `=`, `72`, baris baharu, `if`, `score` …', 'The parser reads tokens: `score`, `=`, `72`, newline, `if`, `score` …'],
        ['Dalam versi berpepijat `pass-check`, selepas `if score` penghurai menjangka ungkapan perbandingan atau `:`, tetapi menemui `=`.', 'In the buggy version of `pass-check`, after `if score` the parser expects a comparison expression or `:`, but finds `=`.'],
        ['Penghurai berhenti dan mencipta `SyntaxError` dengan lokasi dan mesej (dan cadangan).', 'The parser stops and creates a `SyntaxError` with the location and message (and a suggestion).'],
        ['Tiada bytecode dihasilkan, jadi baris 1 (`score = 72`) juga tidak pernah dijalankan.', 'No bytecode is produced, so line 1 (`score = 72`) never runs either.'],
        ['Interpreter mencetak laporan dan keluar dengan status 1.', 'The interpreter prints the report and exits with status 1.'],
      )),
    S('memory_behaviour',
      P('Ralat sintaks berlaku sebelum program mempunyai sebarang keadaan: tiada pemboleh ubah dicipta, tiada fail dibuka, tiada data diubah. Inilah sebabnya ralat sintaks "selamat" — ia tidak meninggalkan kesan separa. Objek `SyntaxError` sendiri menyimpan nama fail, nombor baris, lajur, teks baris dan mesej sebagai atribut; alat seperti editor kod membaca atribut yang sama untuk menggariskan ralat.',
        'A syntax error happens before the program has any state: no variables are created, no files are opened, no data is changed. That is why syntax errors are "safe" — they leave no partial effects. The `SyntaxError` object itself stores the file name, line number, column, line text and message as attributes; tools such as code editors read the same attributes to underline the error.')),
    S('alternative_implementations',
      P('Untuk ralat runtime, modul `traceback` boleh mengekstrak setiap bingkai traceback. Contoh ini menulis skrip dengan dua fungsi, menjalankannya, dan mencetak bingkai dari luar ke dalam — tepat seperti traceback dalam terminal, tetapi sebagai data:', 'For runtime errors, the `traceback` module can extract each traceback frame. This example writes a script with two functions, runs it, and prints the frames from outermost to innermost — exactly like a terminal traceback, but as data:'),
      CODE('traceback-frames', 'python', 'python', ['Bingkai traceback sebagai data', 'Traceback frames as data'], `
import runpy
import traceback
from pathlib import Path

Path("orders.py").write_text(
    "def average(total, count):\\n"
    "    return total / count\\n"
    "\\n"
    "def report():\\n"
    "    return average(120, 0)\\n"
    "\\n"
    "report()\\n",
    encoding="utf-8",
)
try:
    runpy.run_path("orders.py")
except ZeroDivisionError as error:
    for frame in traceback.extract_tb(error.__traceback__):
        if frame.filename == "orders.py":
            print(f"line {frame.lineno} in {frame.name}: {frame.line}")
    print(f"{type(error).__name__}: {error}")
`, 'line 7 in <module>: report()\nline 5 in report: return average(120, 0)\nline 2 in average: return total / count\nZeroDivisionError: division by zero'),
      EXPLAIN('traceback-frames',
        ['1–3', 'Modul untuk menjalankan fail, membaca traceback dan menulis fail.', 'Modules for running a file, reading tracebacks and writing a file.'],
        ['5–14', 'Skrip tujuh baris: program utama memanggil `report`, yang memanggil `average`, yang membahagi dengan sifar. String bersebelahan dalam kurungan dicantum menjadi satu.', 'A seven-line script: the main program calls `report`, which calls `average`, which divides by zero. Adjacent strings inside the parentheses are joined into one.'],
        ['15–16', 'Jalankan skrip dan tangkap exception (PY114).', 'Run the script and catch the exception (PY114).'],
        ['17–20', 'Bingkai disusun dari panggilan paling luar ke paling dalam. Hanya bingkai `orders.py` dicetak (bingkai dalaman `runpy` dilangkau).', 'The frames are ordered from the outermost call to the innermost. Only `orders.py` frames are printed (internal `runpy` frames are skipped).'],
        ['21', 'Baris terakhir traceback: jenis dan mesej.', 'The last line of the traceback: the type and the message.'])),
    S('common_mistakes',
      UL(
        ['Membaca traceback dari atas dan berhenti pada baris pertama — jawapannya berada di bawah.', 'Reading a traceback from the top and stopping at the first line — the answer is at the bottom.'],
        ['Membetulkan baris yang ditunjuk sahaja, sedangkan kesilapan sebenar (kurungan tidak ditutup) berada pada baris sebelumnya.', 'Fixing only the indicated line when the real mistake (an unclosed bracket) is on the line before.'],
        ['Menerima cadangan "Did you mean" tanpa berfikir — ia membetulkan sintaks, bukan logik.', 'Accepting a "Did you mean" suggestion without thinking — it fixes syntax, not logic.'],
        ['Mencampurkan tab dan ruang — `unindent does not match any outer indentation level`.', 'Mixing tabs and spaces — `unindent does not match any outer indentation level`.'],
        ['Menamakan pemboleh ubah dengan kata kunci (`class`, `from`, `pass`) — `invalid syntax`.', 'Naming a variable with a keyword (`class`, `from`, `pass`) — `invalid syntax`.'],
      )),
    S('debugging',
      P('Proses lima langkah untuk sebarang ralat sintaks: (1) baca **baris terakhir** untuk jenis dan mesej; (2) pergi ke **nombor baris** dalam editor; (3) lihat **penunjuk `^`** dan aksara di sekitarnya; (4) jika baris itu kelihatan betul, semak **baris sebelumnya** untuk kurungan atau petik yang terbuka; (5) betulkan **satu** perkara, simpan, dan jalankan semula — ralat seterusnya mungkin muncul, dan itu kemajuan. Contoh berikut menunjukkan kata kunci yang digunakan sebagai nama; mesejnya umum (`invalid syntax`), jadi langkah 3 penting.',
        'A five-step process for any syntax error: (1) read the **last line** for the type and message; (2) go to the **line number** in the editor; (3) look at the **`^` pointer** and the characters around it; (4) if that line looks correct, check **the previous line** for an open bracket or quote; (5) fix **one** thing, save, and run again — the next error may appear, and that is progress. The following example shows a keyword used as a name; the message is generic (`invalid syntax`), so step 3 matters.'),
      CODE('keyword-names', 'python', 'python', ['Kata kunci tidak boleh menjadi nama', 'Keywords cannot be names'], `
import keyword

class_name = "5 Amanah"
print(class_name)
print("class is a keyword:", keyword.iskeyword("class"))
print("Number of keywords:", len(keyword.kwlist))
`, '5 Amanah\nclass is a keyword: True\nNumber of keywords: 35', {
        debug: BUG(`
class = "5 Amanah"
print(class)
`, 'example.py:1: SyntaxError: invalid syntax',
          '`class` ialah kata kunci Python (untuk mentakrif kelas, PY201), jadi ia tidak boleh menjadi nama pemboleh ubah. Mesejnya umum, tetapi penunjuk `^` berada pada `=` selepas `class` — penghurai menjangka nama kelas, bukan `=`. Gunakan nama seperti `class_name` atau `form_class`.',
          '`class` is a Python keyword (for defining classes, PY201), so it cannot be a variable name. The message is generic, but the `^` pointer is on the `=` after `class` — the parser expected a class name, not `=`. Use a name such as `class_name` or `form_class`.'),
      }),
      EXPLAIN('keyword-names',
        ['1', 'Modul `keyword` mengetahui senarai kata kunci Python.', 'The `keyword` module knows Python’s list of keywords.'],
        ['3–4', 'Nama yang sah: `class_name` mengandungi kata kunci tetapi bukan kata kunci itu sendiri.', 'A valid name: `class_name` contains a keyword but is not the keyword itself.'],
        ['5–6', '`iskeyword` menyemak satu perkataan; Python 3.13 mempunyai 35 kata kunci keras (contohnya `if`, `def`, `True`, `None`).', '`iskeyword` checks one word; Python 3.13 has 35 hard keywords (for example `if`, `def`, `True`, `None`).'])),
    S('performance',
      P('Ralat sintaks ialah ralat yang paling murah untuk dibetulkan: ia ditemui dalam milisaat, sebelum program berjalan, dan tepat lokasinya. Ralat runtime hanya ditemui apabila baris itu dijalankan — mungkin selepas sejam pemprosesan, atau hanya untuk input tertentu. Itulah sebabnya alat seperti editor kod, `ruff` dan `python3 -m py_compile fail.py` menyemak sintaks secepat mungkin: semakin awal ralat ditemui, semakin murah ia.',
        'Syntax errors are the cheapest errors to fix: they are found in milliseconds, before the program runs, and their location is precise. Runtime errors are only found when that line executes — perhaps after an hour of processing, or only for certain input. That is why tools such as code editors, `ruff` and `python3 -m py_compile file.py` check syntax as early as possible: the earlier an error is found, the cheaper it is.')),
    S('software_engineering',
      P('Ungkapan yang bersarang dalam terlalu banyak kurungan sukar dibaca dan mudah menyebabkan kurungan yang tidak sepadan. Bandingkan:', 'Expressions nested in too many brackets are hard to read and easily lead to mismatched brackets. Compare:'),
      CODE('nested-poor', 'python', 'python', ['Pelaksanaan lemah: semuanya dalam satu baris bersarang', 'Poor implementation: everything in one nested line'], `
prices = [12.90, 7.50, 22.00]
print(round((sum(prices) - (sum(prices) * (10 / 100))) * (1 + (6 / 100)), 2))
`, '40.45'),
      EXPLAIN('nested-poor',
        ['1–2', 'Tujuh pasang kurungan dalam satu baris. Apakah 10 dan 6? Satu kurungan yang hilang di sini memberi ralat sintaks yang sukar dikesan, dan `sum(prices)` dikira dua kali.', 'Seven pairs of brackets on one line. What are 10 and 6? One missing bracket here gives a hard-to-find syntax error, and `sum(prices)` is calculated twice.']),
      CODE('steps-improved', 'python', 'python', ['Pelaksanaan lebih baik: langkah bernama', 'Improved implementation: named steps'], `
DISCOUNT_RATE = 0.10
SST_RATE = 0.06
prices = [12.90, 7.50, 22.00]

subtotal = sum(prices)
after_discount = subtotal * (1 - DISCOUNT_RATE)
total = after_discount * (1 + SST_RATE)
print(round(total, 2))
`, '40.45'),
      EXPLAIN('steps-improved',
        ['1–3', 'Kadar sebagai pemalar bernama, dan data.', 'Rates as named constants, and the data.'],
        ['5–8', 'Satu idea bagi setiap baris, setiap satu dengan paling banyak satu pasang kurungan. Jika berlaku ralat, traceback menunjuk langkah yang tepat: 42.40 × 0.90 = 38.16, kemudian 38.16 × 1.06 = 40.4496, dibundarkan kepada 40.45.', 'One idea per line, each with at most one pair of brackets. If an error occurs, the traceback points to the exact step: 42.40 × 0.90 = 38.16, then 38.16 × 1.06 = 40.4496, rounded to 40.45.'])),
    S('industry_use_cases',
      UL(
        ['**Integrasi berterusan (CI):** setiap perubahan kod disemak secara automatik untuk ralat sintaks dan gaya sebelum ia digabungkan.', '**Continuous integration (CI):** every code change is checked automatically for syntax and style errors before it is merged.'],
        ['**Pemantauan pengeluaran:** perkhidmatan seperti Sentry mengumpul traceback daripada pelayan dan mengumpulkannya mengikut jenis ralat dan baris.', '**Production monitoring:** services such as Sentry collect tracebacks from servers and group them by error type and line.'],
        ['**Sokongan teknikal:** laporan pepijat yang baik sentiasa menyertakan traceback penuh, versi Python dan langkah untuk menghasilkan semula masalah.', '**Technical support:** a good bug report always includes the full traceback, the Python version and the steps to reproduce the problem.'],
        ['**Pendidikan:** sistem penilaian automatik memaparkan mesej sintaks kepada pelajar dalam beberapa saat.', '**Education:** automatic grading systems show syntax messages to students within seconds.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan versi berpepijat `pass-check`, `matched-brackets` dan `keyword-names` dalam terminal. Untuk setiap satu, tulis jenis, baris dan lokasi `^`.', 'Run the buggy versions of `pass-check`, `matched-brackets` and `keyword-names` in a terminal. For each, write down the type, the line and the `^` location.'],
        ['Buang `)` terakhir daripada baris 2 `matched-brackets`. Adakah Python melaporkan baris 2 atau baris 3?', 'Remove the final `)` from line 2 of `matched-brackets`. Does Python report line 2 or line 3?'],
        ['Ubah `traceback-frames` supaya `report` memanggil `average(120, 4)`. Apakah yang berlaku kepada output?', 'Change `traceback-frames` so `report` calls `average(120, 4)`. What happens to the output?'],
      )),
    S('mini_project',
      P('**Doktor sintaks.** Tulis program yang menerima senarai coretan kod (sebagai teks), mengkompil setiap satu, dan mencetak laporan: `OK` atau nombor baris, lajur dan mesej ralat. Program tidak boleh menjalankan coretan itu.', '**A syntax doctor.** Write a program that takes a list of code snippets (as text), compiles each one, and prints a report: `OK` or the line number, column and error message. The program must not run the snippets.'),
      CODE('syntax-doctor', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
snippets = {
    "greeting": 'name = "Aina"\\nprint("Hi", name)',
    "missing colon": "if True\\n    print(1)",
    "bad indent": "x = 1\\n    y = 2",
    "keyword name": "for = 3",
}
for label, code in snippets.items():
    try:
        compile(code, label, "exec")
        print(f"{label:<14} OK")
    except SyntaxError as error:
        print(f"{label:<14} line {error.lineno}, col {error.offset}: {error.msg}")
`, "greeting       OK\nmissing colon  line 1, col 8: expected ':'\nbad indent     line 2, col 4: unexpected indent\nkeyword name   line 1, col 5: invalid syntax"),
      EXPLAIN('syntax-doctor',
        ['1–6', 'Kamus: label → kod sumber. `\\n` memisahkan baris dalam setiap coretan.', 'A dictionary: label → source code. `\\n` separates the lines in each snippet.'],
        ['7', 'Proses setiap pasangan label dan kod.', 'Process each label and code pair.'],
        ['9–10', 'Kompil sahaja; jika berjaya, cetak `OK` dengan label dijajarkan dalam 14 aksara.', 'Compile only; if it succeeds, print `OK` with the label aligned in 14 characters.'],
        ['11–12', '`IndentationError` ialah subkelas `SyntaxError`, jadi kedua-duanya ditangkap. Atribut `lineno`, `offset` dan `msg` membentuk laporan.', '`IndentationError` is a subclass of `SyntaxError`, so both are caught. The `lineno`, `offset` and `msg` attributes build the report.'])),
    S('summary',
      UL(
        ['Ralat sintaks dikesan semasa kompil; tiada baris program dijalankan.', 'Syntax errors are detected while compiling; no line of the program runs.'],
        ['Baca traceback dari bawah: jenis dan mesej, kemudian fail dan baris.', 'Read a traceback from the bottom: the type and message, then the file and line.'],
        ['Penunjuk `^` menandakan tempat masalah disedari; semak juga baris sebelumnya.', 'The `^` pointer marks where the problem was noticed; check the previous line too.'],
        ['Punca lazim: kurungan/petik tidak ditutup, `:` tertinggal, `=` dan `==`, kata kunci sebagai nama, inden.', 'Common causes: unclosed brackets/quotes, a missing `:`, `=` versus `==`, keywords as names, indentation.'],
        ['Betulkan satu ralat pada satu masa dan jalankan semula.', 'Fix one error at a time and run again.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah `print("A")` pada baris 1 tidak dicetak apabila baris 5 mempunyai ralat sintaks?', 'Why is `print("A")` on line 1 not printed when line 5 has a syntax error?'],
        ['Dalam traceback runtime, bahagian manakah memberitahu jenis ralat, dan bahagian manakah lokasinya?', 'In a runtime traceback, which part tells you the error type, and which the location?'],
        ['Python melaporkan ralat pada baris 8, tetapi baris 8 kelihatan betul. Apakah yang anda semak seterusnya?', 'Python reports an error on line 8, but line 8 looks correct. What do you check next?'],
        ['Mengapakah `class = 3` ralat tetapi `class_ = 3` sah?', 'Why is `class = 3` an error but `class_ = 3` valid?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Python tutorial — Errors and Exceptions: Syntax Errors', url: `${PYDOCS}/tutorial/errors.html#syntax-errors` },
        { title: 'Built-in Exceptions — SyntaxError, IndentationError', url: `${PYDOCS}/library/exceptions.html#SyntaxError` },
        { title: 'traceback — Print or retrieve a stack traceback', url: `${PYDOCS}/library/traceback.html` },
        { title: 'What’s New in Python 3.13 — improved error messages', url: `${PYDOCS}/whatsnew/3.13.html#improved-error-messages` },
        { title: 'keyword — Testing for Python keywords', url: `${PYDOCS}/library/keyword.html` },
      )),
  ],
};

// ─── 4.2 Common runtime errors ────────────────────────────────────────────

export const PY101_4_2: LectureContentDef = {
  courseCode: 'PY101',
  module: 4,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan perbezaan antara [[runtime-error|ralat runtime]] dan ralat sintaks, termasuk output yang sudah dicetak sebelum ralat.', 'Explain the difference between a [[runtime-error|runtime error]] and a syntax error, including the output already printed before the error.'],
        ['Mengenal pasti lapan [[exception|exception]] yang lazim — `NameError`, `TypeError`, `ValueError`, `ZeroDivisionError`, `IndexError`, `KeyError`, `AttributeError`, `FileNotFoundError` — dan punca biasa setiap satu.', 'Recognise eight common [[exception|exceptions]] — `NameError`, `TypeError`, `ValueError`, `ZeroDivisionError`, `IndexError`, `KeyError`, `AttributeError`, `FileNotFoundError` — and the usual cause of each.'],
        ['Menggunakan mesej exception untuk mencari punca, bukan hanya lokasi.', 'Use an exception’s message to find the cause, not just the location.'],
        ['Mengelakkan ralat runtime dengan semakan awal (`in`, `dict.get`) dan memahami peranan `try`/`except` sebagai pratonton.', 'Prevent runtime errors with early checks (`in`, `dict.get`) and understand the role of `try`/`except` as a preview.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1: membaca traceback.', 'Lecture 4.1: reading tracebacks.'],
        ['Kuliah 3.2: `input()` dan penukaran `int()`/`float()`.', 'Lecture 3.2: `input()` and `int()`/`float()` conversion.'],
        ['Pengenalan ringkas kepada senarai `[...]` dan kamus `{kunci: nilai}` (diajar sepenuhnya dalam PY111–PY112).', 'A brief introduction to lists `[...]` and dictionaries `{key: value}` (taught fully in PY111–PY112).'],
      )),
    S('introduction',
      P('Program yang lulus semakan sintaks masih boleh gagal semasa berjalan. Pengguna menaip "dua" dan bukan 2; fail yang dijangka tidak wujud; senarai mempunyai tiga item tetapi kod meminta yang keempat. Dalam setiap kes, Python mencipta objek **exception** yang menerangkan masalah itu, menghentikan pelaksanaan biasa, dan — jika tiada kod yang mengendalikannya — mencetak traceback dan menamatkan program. Kuliah ini ialah katalog praktikal ralat runtime yang akan anda temui setiap minggu, dengan punca dan pembetulan masing-masing.',
        'A program that passes the syntax check can still fail while running. The user types "two" instead of 2; an expected file does not exist; a list has three items but the code asks for the fourth. In each case Python creates an **exception** object describing the problem, stops normal execution, and — if no code handles it — prints a traceback and ends the program. This lecture is a practical catalogue of the runtime errors you will meet every week, with the cause and fix for each.'),
      KEY('Nama exception memberitahu jenis masalah; mesejnya memberitahu butiran; traceback memberitahu lokasi.', 'The exception’s name tells you the kind of problem; its message gives the details; the traceback gives the location.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**`NameError`:** nama belum diikat — salah eja, salah huruf besar/kecil, atau digunakan sebelum assignment.', '**`NameError`:** a name is not bound — misspelled, wrong letter case, or used before assignment.'],
        ['**`TypeError`:** operasi pada jenis yang salah — `"Umur: " + 17`, `"55" / 2`, memanggil sesuatu yang bukan fungsi.', '**`TypeError`:** an operation on the wrong type — `"Age: " + 17`, `"55" / 2`, calling something that is not a function.'],
        ['**`ValueError`:** jenis betul tetapi nilai tidak sah — `int("tujuh")`, `float("12,5")`.', '**`ValueError`:** the right type but an invalid value — `int("seven")`, `float("12,5")`.'],
        ['**`ZeroDivisionError`:** pembahagian atau modulo dengan sifar.', '**`ZeroDivisionError`:** division or modulo by zero.'],
        ['**`IndexError`:** indeks di luar julat senarai atau string — senarai 3 item hanya mempunyai indeks 0, 1, 2.', '**`IndexError`:** an index outside a list or string — a 3-item list only has indexes 0, 1, 2.'],
        ['**`KeyError`:** kunci tiada dalam kamus. **`AttributeError`:** objek tiada atribut atau kaedah itu. **`FileNotFoundError`:** fail tiada.', '**`KeyError`:** a key missing from a dictionary. **`AttributeError`:** the object has no such attribute or method. **`FileNotFoundError`:** the file does not exist.'],
      )),
    S('detailed_theory',
      P('Apabila mesin maya Python menemui operasi yang tidak boleh dilaksanakan, ia **menimbulkan** (raises) exception: ia mencipta objek kelas tertentu — `ZeroDivisionError`, `KeyError` dan sebagainya — dengan mesej yang menerangkan butiran, dan menghentikan pernyataan semasa. Python kemudian mencari **pengendali** (handler): blok `try`/`except` yang meliputi kod itu, pertama dalam fungsi semasa, kemudian dalam fungsi yang memanggilnya, dan seterusnya ke atas tindanan panggilan. Jika tiada pengendali ditemui, exception mencapai peringkat atas, Python mencetak traceback ke **ralat standard** dan program tamat dengan status 1. Semua kesan yang berlaku sebelum itu kekal: output yang telah dicetak, fail yang telah ditulis. Inilah perbezaan utama dengan ralat sintaks — program **telah** berjalan separa.',
        'When the Python virtual machine meets an operation it cannot perform, it **raises** an exception: it creates an object of a specific class — `ZeroDivisionError`, `KeyError` and so on — with a message describing the details, and stops the current statement. Python then looks for a **handler**: a `try`/`except` block covering that code, first in the current function, then in the function that called it, and so on up the call stack. If no handler is found, the exception reaches the top level, Python prints a traceback to **standard error** and the program ends with status 1. Every effect that happened before remains: output already printed, files already written. That is the key difference from a syntax error — the program **has** partly run.'),
      P('Exception tersusun dalam hierarki kelas. Hampir semuanya berasal daripada `Exception`; `ZeroDivisionError` ialah sejenis `ArithmeticError`; `IndexError` dan `KeyError` ialah jenis `LookupError`; `FileNotFoundError` ialah jenis `OSError`. Hierarki ini membolehkan pengendali menangkap satu jenis tertentu atau satu kumpulan. Mesej setiap exception direka untuk membantu: `TypeError` menamakan **kedua-dua** jenis yang terlibat, `KeyError` menunjukkan kunci yang hilang, `ValueError` daripada `int()` mengulang teks yang gagal dalam petik — yang menunjukkan ruang atau aksara tersembunyi. Membaca mesej dengan teliti sering memberi pembetulan secara langsung.',
        'Exceptions are organised in a class hierarchy. Almost all derive from `Exception`; `ZeroDivisionError` is a kind of `ArithmeticError`; `IndexError` and `KeyError` are kinds of `LookupError`; `FileNotFoundError` is a kind of `OSError`. This hierarchy lets a handler catch one specific type or a whole group. Each exception’s message is designed to help: `TypeError` names **both** types involved, `KeyError` shows the missing key, and the `ValueError` from `int()` repeats the failing text in quotes — revealing spaces or hidden characters. Reading the message carefully often gives the fix directly.'),
      P('Terdapat dua gaya untuk menghadapi ralat runtime yang boleh dijangka. **LBYL** ("look before you leap") menyemak dahulu: `if kunci in kamus:`. **EAFP** ("easier to ask forgiveness than permission") mencuba dan mengendalikan kegagalan dengan `try`/`except`. Python cenderung kepada EAFP, tetapi kedua-duanya sah. Kursus ini memperkenalkan `try`/`except` sebagai pratonton; PY114 mengajarnya sepenuhnya. Satu peraturan sudah penting sekarang: **jangan sekali-kali menyembunyikan ralat** dengan `except:` kosong — ralat yang disembunyikan menjadi pepijat yang mustahil dicari.',
        'There are two styles for dealing with predictable runtime errors. **LBYL** ("look before you leap") checks first: `if key in dictionary:`. **EAFP** ("easier to ask forgiveness than permission") tries and handles the failure with `try`/`except`. Python leans towards EAFP, but both are valid. This course introduces `try`/`except` as a preview; PY114 teaches it fully. One rule already matters now: **never hide errors** with a bare `except:` — a hidden error becomes a bug that is impossible to find.')),
    S('technical_terminology', TERMS('exception', 'runtime-error', 'traceback', 'call-stack', 'dictionary')),
    S('syntax_rules',
      UL(
        ['Indeks senarai bermula dari 0: `senarai[0]` ialah item pertama, `senarai[-1]` yang terakhir.', 'List indexes start at 0: `items[0]` is the first item, `items[-1]` the last.'],
        ['`kamus[kunci]` gagal dengan `KeyError` jika tiada; `kamus.get(kunci, lalai)` memulangkan nilai lalai.', '`d[key]` fails with `KeyError` if missing; `d.get(key, default)` returns the default.'],
        ['`kunci in kamus` dan `item in senarai` menyemak keahlian tanpa ralat.', '`key in d` and `item in items` check membership without an error.'],
        ['Pratonton: `try:` … `except ValueError:` … — tangkap jenis **tertentu** sahaja.', 'Preview: `try:` … `except ValueError:` … — catch **specific** types only.'],
      )),
    S('code_demonstration',
      CODE('error-catalogue', 'python', 'python', ['Katalog ralat runtime', 'A catalogue of runtime errors'], `
snippets = [
    'x = 1 / 0',
    'y = undefined_name',
    'int("abc")',
    '[1, 2][5]',
    '{"a": 1}["b"]',
    '"text" + 5',
    'None.upper()',
]
for snippet in snippets:
    try:
        exec(snippet)
    except Exception as error:
        print(f"{snippet:<20} -> {type(error).__name__}: {error}")
`, 'x = 1 / 0            -> ZeroDivisionError: division by zero\ny = undefined_name   -> NameError: name \'undefined_name\' is not defined\nint("abc")           -> ValueError: invalid literal for int() with base 10: \'abc\'\n[1, 2][5]            -> IndexError: list index out of range\n{"a": 1}["b"]        -> KeyError: \'b\'\n"text" + 5           -> TypeError: can only concatenate str (not "int") to str\nNone.upper()         -> AttributeError: \'NoneType\' object has no attribute \'upper\''),
      EXPLAIN('error-catalogue',
        ['1–9', 'Tujuh baris kod pendek sebagai teks, setiap satu mencetuskan exception yang berbeza.', 'Seven short lines of code as text, each triggering a different exception.'],
        ['10–12', 'Setiap coretan dijalankan dengan `exec` di dalam `try` supaya program tidak berhenti pada ralat pertama.', 'Each snippet runs with `exec` inside `try` so the program does not stop at the first error.'],
        ['13–14', '`except Exception` menangkap exception, dan nama kelas serta mesejnya dicetak — tepat dua bahagian yang muncul pada baris terakhir traceback.', '`except Exception` catches the exception, and its class name and message are printed — exactly the two parts that appear on a traceback’s last line.'])),
    S('complete_examples',
      CODE('marks-index', 'python', 'python', ['Indeks senarai', 'List indexes'], `
marks = [78, 85, 62]
print("First:", marks[0])
print("Last:", marks[-1])
print("Count:", len(marks))
print("Valid indexes: 0 to", len(marks) - 1)
`, 'First: 78\nLast: 62\nCount: 3\nValid indexes: 0 to 2', {
        debug: BUG(`
marks = [78, 85, 62]
print("First:", marks[1])
print("Last:", marks[3])
`, 'example.py:3: IndexError: list index out of range',
          'Dua kesilapan "off-by-one": baris 2 mencetak 85 (item **kedua**) tanpa ralat — pepijat logik senyap — dan baris 3 meminta indeks 3 dalam senarai 3 item, yang hanya mempunyai indeks 0, 1, 2. Perhatikan output `First: 85` sudah dicetak sebelum `IndexError`. Gunakan `marks[0]` untuk yang pertama dan `marks[-1]` untuk yang terakhir.',
          'Two "off-by-one" mistakes: line 2 prints 85 (the **second** item) without an error — a silent logic bug — and line 3 asks for index 3 in a 3-item list, which only has indexes 0, 1, 2. Notice the output `First: 85` is printed before the `IndexError`. Use `marks[0]` for the first and `marks[-1]` for the last.'),
      }),
      EXPLAIN('marks-index',
        ['1', 'Senarai tiga markah.', 'A list of three marks.'],
        ['2–3', 'Indeks 0 ialah item pertama; indeks −1 dikira dari hujung, jadi ia sentiasa item terakhir.', 'Index 0 is the first item; index −1 counts from the end, so it is always the last item.'],
        ['4–5', 'Untuk `n` item, indeks yang sah ialah 0 hingga `n − 1`.', 'For `n` items, the valid indexes are 0 to `n − 1`.']),
      CODE('menu-prices', 'python', 'python', ['Mencari harga dalam kamus', 'Looking up prices in a dictionary'], `
menu = {"nasi lemak": 5.00, "roti canai": 1.80, "teh tarik": 2.50}
order = ["nasi lemak", "teh tarik"]
total = menu[order[0]] + menu[order[1]]
print(f"Total: RM{total:.2f}")
`, 'Total: RM7.50', {
        debug: BUG(`
menu = {"nasi lemak": 5.00, "roti canai": 1.80, "teh tarik": 2.50}
order = ["nasi lemak", "Teh Tarik"]
total = menu[order[0]] + menu[order[1]]
print(f"Total: RM{total:.2f}")
`, "example.py:3: KeyError: 'Teh Tarik'",
          'Kunci kamus dibandingkan dengan tepat, termasuk huruf besar/kecil: `"Teh Tarik"` bukan `"teh tarik"`. Mesej `KeyError` menunjukkan kunci yang dicari dalam petik — bandingkan dengan kunci yang wujud. Normalkan input dengan `.lower()` dan `.strip()` sebelum mencari (kuliah 3.2).',
          'Dictionary keys are compared exactly, including letter case: `"Teh Tarik"` is not `"teh tarik"`. The `KeyError` message shows the key that was looked up in quotes — compare it with the keys that exist. Normalise input with `.lower()` and `.strip()` before looking it up (lecture 3.2).'),
      }),
      EXPLAIN('menu-prices',
        ['1', 'Kamus: nama makanan → harga.', 'A dictionary: food name → price.'],
        ['2', 'Pesanan sebagai senarai nama.', 'The order as a list of names.'],
        ['3', '`order[0]` ialah `"nasi lemak"`; `menu["nasi lemak"]` ialah 5.00. Dua carian dijumlahkan.', '`order[0]` is `"nasi lemak"`; `menu["nasi lemak"]` is 5.00. Two lookups are added.'],
        ['4', 'Jumlah diformat sebagai wang.', 'The total formatted as money.'])),
    S('line_by_line',
      EXPLAIN('error-catalogue',
        ['14', '`{snippet:<20}` menjajar teks coretan ke kiri dalam 20 aksara, supaya anak panah `->` berbaris; `type(error).__name__` memberi nama kelas exception sebagai teks.', '`{snippet:<20}` left-aligns the snippet text in 20 characters so the `->` arrows line up; `type(error).__name__` gives the exception’s class name as text.']),
      EXPLAIN('menu-prices',
        ['3', 'Susunan penilaian: `order[0]` → `"nasi lemak"` → `menu[...]` → 5.0; kemudian `order[1]` → `"teh tarik"` → 2.5; kemudian `+`. Jika mana-mana carian gagal, `+` tidak pernah berlaku.', 'Evaluation order: `order[0]` → `"nasi lemak"` → `menu[...]` → 5.0; then `order[1]` → `"teh tarik"` → 2.5; then `+`. If either lookup fails, the `+` never happens.'])),
    S('why_this_way',
      P('Mengapa Python menimbulkan exception dan tidak hanya memulangkan nilai "salah" seperti `0` atau `None`? Kerana nilai salah yang senyap merebak: purata yang dikira dengan 0 sebagai ganti ralat menghasilkan laporan yang kelihatan munasabah tetapi salah, dan tiada siapa tahu. Exception memaksa masalah dilihat di tempat ia berlaku. Prinsip Zen "Errors should never pass silently" — ralat tidak sepatutnya berlalu secara senyap — ialah sebab di sebalik reka bentuk ini.',
        'Why does Python raise an exception rather than just returning a "wrong" value such as `0` or `None`? Because silent wrong values spread: an average calculated with 0 in place of an error produces a report that looks reasonable but is wrong, and nobody knows. An exception forces the problem to be seen where it happens. The Zen principle "Errors should never pass silently" is the reason behind this design.')),
    S('execution_flow',
      OL(
        ['Program berjalan seperti biasa sehingga satu operasi gagal — contohnya `menu["Teh Tarik"]`.', 'The program runs normally until an operation fails — for example `menu["Teh Tarik"]`.'],
        ['Python mencipta objek `KeyError(\'Teh Tarik\')` dan menghentikan pernyataan itu serta-merta.', 'Python creates a `KeyError(\'Teh Tarik\')` object and stops that statement immediately.'],
        ['Python mencari `try`/`except` yang meliputi baris itu, dari fungsi semasa ke atas.', 'Python looks for a `try`/`except` covering that line, from the current function upwards.'],
        ['Jika ditemui pengendali yang sepadan, pelaksanaan diteruskan di dalam blok `except`.', 'If a matching handler is found, execution continues inside the `except` block.'],
        ['Jika tidak, traceback dicetak ke ralat standard dan program tamat; pernyataan selepas itu tidak dijalankan.', 'If not, the traceback is printed to standard error and the program ends; the statements after it never run.'],
      )),
    S('memory_behaviour',
      P('Objek exception membawa rujukan kepada traceback (`error.__traceback__`), dan traceback merujuk kepada **bingkai** setiap fungsi yang aktif — termasuk semua pemboleh ubah tempatannya. Inilah yang membolehkan debugger memeriksa keadaan pada saat ralat. Apabila blok `except … as error` tamat, Python memadam nama `error` secara automatik supaya bingkai itu boleh dibebaskan. Ralat seperti `MemoryError` (ingatan habis) dan `RecursionError` (tindanan panggilan terlalu dalam) ialah exception yang berkaitan dengan ingatan itu sendiri.',
        'An exception object carries a reference to its traceback (`error.__traceback__`), and the traceback refers to the **frame** of each active function — including all its local variables. That is what lets a debugger inspect the state at the moment of the error. When an `except … as error` block ends, Python deletes the name `error` automatically so those frames can be freed. Errors such as `MemoryError` (memory exhausted) and `RecursionError` (call stack too deep) are exceptions about memory itself.')),
    S('alternative_implementations',
      P('Dua cara mengelakkan `KeyError` apabila kunci mungkin tiada: semak dahulu (LBYL), atau gunakan `dict.get` dengan nilai lalai. Kedua-dua cara berikut memberikan hasil yang sama untuk item yang tiada dalam menu:', 'Two ways to avoid a `KeyError` when a key might be missing: check first (LBYL), or use `dict.get` with a default value. Both of the following give the same result for an item missing from the menu:'),
      CODE('safe-lookup', 'python', 'python', ['Carian selamat: in dan get()', 'Safe lookup: in and get()'], `
menu = {"nasi lemak": 5.00, "roti canai": 1.80}
item = "mee goreng"

if item in menu:
    print("Price:", menu[item])
else:
    print("Not on the menu:", item)

price = menu.get(item, 0.0)
print("Price with default:", price)
`, 'Not on the menu: mee goreng\nPrice with default: 0.0'),
      EXPLAIN('safe-lookup',
        ['1–2', 'Menu tanpa `mee goreng`.', 'A menu without `mee goreng`.'],
        ['4–7', 'LBYL: `in` menyemak keahlian dahulu, dan `if`/`else` memilih tindakan (PY103).', 'LBYL: `in` checks membership first, and `if`/`else` chooses the action (PY103).'],
        ['9–10', '`get` memulangkan nilai lalai 0.0 dan bukan menimbulkan `KeyError`. Gunakan nilai lalai hanya jika ia benar-benar bermakna — harga 0.0 boleh menyembunyikan pesanan yang salah.', '`get` returns the default 0.0 instead of raising `KeyError`. Use a default only when it really makes sense — a price of 0.0 could hide a wrong order.'])),
    S('common_mistakes',
      UL(
        ['Indeks bermula dari 1 dan bukan 0 — ralat "off-by-one".', 'Starting indexes at 1 rather than 0 — "off-by-one" errors.'],
        ['Menganggap kunci kamus tidak peka huruf besar/kecil.', 'Assuming dictionary keys ignore letter case.'],
        ['Memanggil kaedah pada `None` — selalunya kerana fungsi tidak memulangkan apa-apa (`AttributeError: \'NoneType\' object …`).', 'Calling a method on `None` — often because a function returned nothing (`AttributeError: \'NoneType\' object …`).'],
        ['Menukar input "12,5" dengan `float` — Python menggunakan titik perpuluhan, bukan koma.', 'Converting the input "12,5" with `float` — Python uses a decimal point, not a comma.'],
        ['Menyembunyikan ralat dengan `try: … except: pass`.', 'Hiding errors with `try: … except: pass`.'],
      )),
    S('debugging',
      P('Untuk ralat runtime, tanya tiga soalan. **Apa?** — baca jenis dan mesej: `TypeError: unsupported operand type(s) for +: \'int\' and \'str\'` memberitahu bahawa satu nilai ialah teks. **Di mana?** — baris dalam traceback. **Mengapa nilai itu begitu?** — ini soalan paling penting, kerana punca sering berada **lebih awal**: nilai teks itu datang daripada `input()` yang tidak ditukar, atau daripada data yang ditulis dengan petik. Cetak nilai dan jenisnya sebelum baris yang gagal. Contoh berikut menjumlahkan kehadiran; versi berpepijat mengandungi satu nilai teks dalam data.',
        'For runtime errors, ask three questions. **What?** — read the type and message: `TypeError: unsupported operand type(s) for +: \'int\' and \'str\'` says one value is text. **Where?** — the line in the traceback. **Why is that value like that?** — the most important question, because the cause is often **earlier**: the text value came from an unconverted `input()`, or from data written with quotes. Print the values and their types before the failing line. The following example adds up attendance; the buggy version contains one text value in its data.'),
      CODE('attendance-total', 'python', 'python', ['Menjumlahkan kehadiran', 'Adding up attendance'], `
attendance = [28, 30, 27, 29]
print("Types:", [type(day).__name__ for day in attendance])
print("Total present:", sum(attendance))
print("Average:", sum(attendance) / len(attendance))
`, "Types: ['int', 'int', 'int', 'int']\nTotal present: 114\nAverage: 28.5", {
        debug: BUG(`
attendance = [28, 30, "27", 29]
print("Total present:", sum(attendance))
`, "example.py:2: TypeError: unsupported operand type(s) for +: 'int' and 'str'",
          '`"27"` ialah teks — mungkin dibaca daripada fail atau `input()` tanpa penukaran. `sum` menambah 28 + 30 = 58, kemudian cuba 58 + "27" dan gagal. Mesej menamakan kedua-dua jenis (`int` dan `str`). Baris 2 dalam versi betul — mencetak jenis setiap nilai — ialah cara pantas untuk mencari nilai yang salah.',
          '`"27"` is text — perhaps read from a file or `input()` without conversion. `sum` adds 28 + 30 = 58, then tries 58 + "27" and fails. The message names both types (`int` and `str`). Line 2 of the correct version — printing each value’s type — is a quick way to find the wrong value.'),
      }),
      EXPLAIN('attendance-total',
        ['1', 'Kehadiran untuk empat hari, semuanya integer.', 'Attendance for four days, all integers.'],
        ['2', 'Pemeriksaan diagnostik: senarai nama jenis bagi setiap nilai (sintaks ini — list comprehension — diajar dalam PY111).', 'A diagnostic check: a list of the type name of each value (this syntax — a list comprehension — is taught in PY111).'],
        ['3–4', '114 hadir; 114 ÷ 4 = 28.5.', '114 present; 114 ÷ 4 = 28.5.'])),
    S('performance',
      P('Menimbulkan dan menangkap exception agak mahal berbanding semakan `if` yang mudah — tetapi hanya apabila exception **benar-benar berlaku**. Sejak Python 3.11, blok `try` yang tidak menimbulkan apa-apa hampir percuma ("zero-cost exceptions"). Oleh itu, gunakan EAFP apabila kegagalan jarang berlaku, dan LBYL apabila kegagalan biasa (contohnya mencari banyak item yang mungkin tiada).',
        'Raising and catching an exception is fairly expensive compared with a simple `if` check — but only when the exception **actually happens**. Since Python 3.11, a `try` block that raises nothing is almost free ("zero-cost exceptions"). So use EAFP when failure is rare, and LBYL when failure is common (for example looking up many items that may be missing).')),
    S('software_engineering',
      P('Cara paling buruk untuk "membetulkan" ralat runtime ialah menyembunyikannya. Bandingkan:', 'The worst way to "fix" a runtime error is to hide it. Compare:'),
      CODE('silent-except-poor', 'python', 'python', ['Pelaksanaan lemah: except kosong menyembunyikan ralat', 'Poor implementation: a bare except hides errors'], `
quantity_text = "dua"
try:
    quantity = int(quantity_text)
except:
    quantity = 0
print("Cups to make:", quantity)
`, 'Cups to make: 0'),
      EXPLAIN('silent-except-poor',
        ['1–6', 'Input yang tidak sah ditukar secara senyap kepada 0. Pesanan pelanggan hilang tanpa sebarang amaran, dan `except:` kosong juga akan menyembunyikan pepijat lain — malah salah eja nama pemboleh ubah.', 'Invalid input silently becomes 0. The customer’s order disappears without any warning, and a bare `except:` would also hide other bugs — even a misspelled variable name.']),
      CODE('specific-except-improved', 'python', 'python', ['Pelaksanaan lebih baik: tangkap jenis tertentu dan laporkan', 'Improved implementation: catch a specific type and report it'], `
quantity_text = "dua"
try:
    quantity = int(quantity_text)
except ValueError:
    print(f"Invalid quantity {quantity_text!r}: please enter digits, e.g. 2")
    quantity = None
print("Quantity accepted:", quantity is not None)
`, "Invalid quantity 'dua': please enter digits, e.g. 2\nQuantity accepted: False"),
      EXPLAIN('specific-except-improved',
        ['1–4', 'Hanya `ValueError` — ralat yang dijangka daripada `int()` — ditangkap. Pepijat lain masih kelihatan.', 'Only `ValueError` — the expected error from `int()` — is caught. Other bugs remain visible.'],
        ['5–6', 'Pengguna diberitahu apa yang salah dan apa yang perlu ditaip; `None` menandakan "tiada nilai sah", bukan 0 yang mengelirukan.', 'The user is told what went wrong and what to type; `None` marks "no valid value", not a misleading 0.'],
        ['7', 'Program boleh membuat keputusan berdasarkan sama ada input diterima.', 'The program can decide based on whether the input was accepted.'])),
    S('industry_use_cases',
      UL(
        ['**Perbankan dalam talian:** `ValueError` daripada jumlah yang tidak sah ditangkap dan ditukar kepada mesej borang yang jelas, bukan halaman ralat.', '**Online banking:** a `ValueError` from an invalid amount is caught and turned into a clear form message, not an error page.'],
        ['**Saluran data:** rekod yang menyebabkan `KeyError` atau `ValueError` dipindahkan ke fail "kuarantin" dengan sebabnya, dan saluran diteruskan.', '**Data pipelines:** records that cause a `KeyError` or `ValueError` are moved to a "quarantine" file with the reason, and the pipeline continues.'],
        ['**Pelayan web:** exception yang tidak dijangka dilog dengan traceback penuh untuk jurutera, manakala pengguna melihat mesej umum.', '**Web servers:** unexpected exceptions are logged with the full traceback for engineers, while users see a generic message.'],
        ['**Sistem terbenam:** `ZeroDivisionError` daripada sensor yang membaca sifar dikendalikan supaya peranti tidak berhenti.', '**Embedded systems:** a `ZeroDivisionError` from a sensor reading zero is handled so the device does not stop.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah tiga coretan baharu kepada `error-catalogue`: `float("12,5")`, `open("tiada.txt")` dan `len(5)`. Ramalkan jenis setiap ralat sebelum menjalankan.', 'Add three new snippets to `error-catalogue`: `float("12,5")`, `open("missing.txt")` and `len(5)`. Predict each error type before running.'],
        ['Jalankan versi berpepijat `marks-index` dan terangkan mengapa satu baris output muncul sebelum traceback.', 'Run the buggy version of `marks-index` and explain why one output line appears before the traceback.'],
        ['Ubah `menu-prices` supaya pesanan dinormalkan dengan `.lower()` sebelum dicari.', 'Change `menu-prices` so the order is normalised with `.lower()` before the lookup.'],
      )),
    S('mini_project',
      P('**Penyemak pesanan kantin.** Program menerima senarai baris pesanan dalam bentuk teks (`"nama,kuantiti"`). Bagi setiap baris, ia mencari harga dan menukar kuantiti; baris yang bermasalah dilaporkan dengan jenis ralat dan dilangkau, manakala baris yang sah dijumlahkan. Program mesti tidak berhenti pada ralat pertama.', '**A canteen order checker.** The program receives a list of order lines as text (`"name,quantity"`). For each line it looks up the price and converts the quantity; problem lines are reported with the error type and skipped, while valid lines are added to the total. The program must not stop at the first error.'),
      CODE('order-checker', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
MENU = {"nasi lemak": 5.00, "roti canai": 1.80, "teh tarik": 2.50}
lines = ["nasi lemak,2", "teh tarik,dua", "mee goreng,1", "roti canai,3"]

total = 0.0
for line in lines:
    name, quantity_text = line.split(",")
    try:
        total += MENU[name] * int(quantity_text)
        print(f"OK      {line}")
    except KeyError:
        print(f"SKIPPED {line}: {name!r} is not on the menu")
    except ValueError:
        print(f"SKIPPED {line}: quantity {quantity_text!r} is not a whole number")
print(f"Total for valid lines: RM{total:.2f}")
`, "OK      nasi lemak,2\nSKIPPED teh tarik,dua: quantity 'dua' is not a whole number\nSKIPPED mee goreng,1: 'mee goreng' is not on the menu\nOK      roti canai,3\nTotal for valid lines: RM15.40"),
      EXPLAIN('order-checker',
        ['1–2', 'Menu dan empat baris pesanan — dua sah, dua bermasalah.', 'The menu and four order lines — two valid, two with problems.'],
        ['4–6', 'Jumlah bermula pada 0.0; setiap baris dipecahkan pada koma kepada nama dan kuantiti (teks).', 'The total starts at 0.0; each line is split at the comma into a name and a quantity (text).'],
        ['7–9', 'Carian harga dan penukaran kuantiti dalam `try`. `+=` menambah kepada jumlah (PY102).', 'The price lookup and quantity conversion inside `try`. `+=` adds to the total (PY102).'],
        ['10–13', 'Setiap jenis ralat mendapat mesej yang tepat. Perhatikan susunan: carian `MENU[name]` berlaku dahulu, jadi "teh tarik,dua" gagal pada `int`.', 'Each error type gets a precise message. Note the order: the `MENU[name]` lookup happens first, so "teh tarik,dua" fails at `int`.'],
        ['14', 'Jumlah untuk baris yang sah: 5.00 × 2 + 1.80 × 3 = 15.40.', 'The total for valid lines: 5.00 × 2 + 1.80 × 3 = 15.40.'])),
    S('summary',
      UL(
        ['Ralat runtime berlaku semasa pelaksanaan; output sebelum ralat kekal.', 'Runtime errors happen during execution; output before the error remains.'],
        ['Kenali jenis lazim: `NameError`, `TypeError`, `ValueError`, `ZeroDivisionError`, `IndexError`, `KeyError`, `AttributeError`, `FileNotFoundError`.', 'Know the common types: `NameError`, `TypeError`, `ValueError`, `ZeroDivisionError`, `IndexError`, `KeyError`, `AttributeError`, `FileNotFoundError`.'],
        ['Mesej memberi butiran; tanya "mengapa nilai itu begitu?" untuk mencari punca sebenar.', 'The message gives the details; ask "why is that value like that?" to find the real cause.'],
        ['Cegah dengan `in` dan `get` (LBYL) atau kendalikan dengan `try`/`except` jenis tertentu (EAFP).', 'Prevent with `in` and `get` (LBYL) or handle with a specific `try`/`except` (EAFP).'],
        ['Jangan sekali-kali menyembunyikan ralat dengan `except:` kosong.', 'Never hide errors with a bare `except:`.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah perbezaan antara `TypeError` dan `ValueError`? Beri contoh setiap satu.', 'What is the difference between `TypeError` and `ValueError`? Give an example of each.'],
        ['Senarai `s` mempunyai 5 item. Apakah indeks yang sah?', 'A list `s` has 5 items. Which indexes are valid?'],
        ['Mengapakah `except:` kosong berbahaya?', 'Why is a bare `except:` dangerous?'],
        ['Bilakah anda memilih `dict.get` dan bilakah `if key in d`?', 'When would you choose `dict.get`, and when `if key in d`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Python tutorial — Errors and Exceptions', url: `${PYDOCS}/tutorial/errors.html` },
        { title: 'Built-in Exceptions (with the exception hierarchy)', url: `${PYDOCS}/library/exceptions.html#exception-hierarchy` },
        { title: 'Python Glossary — EAFP and LBYL', url: `${PYDOCS}/glossary.html#term-EAFP` },
        { title: 'Mapping types — dict.get', url: `${PYDOCS}/library/stdtypes.html#dict.get` },
        { title: 'Think Python, 3rd edition — Chapter 5 (debugging notes)', url: 'https://allendowney.github.io/ThinkPython/chap05.html' },
      )),
  ],
};

// ─── 4.3 Debugging strategies for beginners ───────────────────────────────

export const PY101_4_3: LectureContentDef = {
  courseCode: 'PY101',
  module: 4,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan proses [[debugging|debugging]] yang sistematik: hasilkan semula, asingkan, bentuk hipotesis, uji, betulkan, sahkan.', 'Apply a systematic [[debugging|debugging]] process: reproduce, isolate, hypothesise, test, fix, verify.'],
        ['Menggunakan debugging dengan `print`, jadual jejak, `assert` dan modul `logging`.', 'Use print debugging, trace tables, `assert` and the `logging` module.'],
        ['Mengasingkan pepijat dengan mengecilkan input dan kod kepada contoh minimum.', 'Isolate a bug by shrinking the input and code to a minimal example.'],
        ['Menerangkan peranan debugger (`breakpoint()`, `pdb`, debugger editor) dan bila menggunakannya.', 'Explain the role of a debugger (`breakpoint()`, `pdb`, the editor’s debugger) and when to use it.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 4.1 dan 4.2: ralat sintaks, ralat runtime dan traceback.', 'Lectures 4.1 and 4.2: syntax errors, runtime errors and tracebacks.'],
        ['Kuliah 1.1 dan 3.3: menjejak keadaan dan jadual jejak.', 'Lectures 1.1 and 3.3: tracing state and trace tables.'],
      )),
    S('introduction',
      P('Pepijat yang paling sukar bukanlah yang menimbulkan traceback — Python sudah memberitahu di mana masalahnya. Pepijat yang paling sukar ialah **pepijat logik**: program berjalan tanpa ralat tetapi menghasilkan jawapan yang salah. Untuk pepijat sebegini, anda memerlukan strategi, bukan nasib. Kuliah ini mengajar proses debugging yang digunakan oleh jurutera profesional, dan alat Python yang menyokong setiap langkah. Matlamatnya ialah menggantikan "cuba ubah sesuatu dan lihat" dengan penyiasatan yang teratur.',
        'The hardest bugs are not the ones that produce a traceback — Python already tells you where the problem is. The hardest bugs are **logic bugs**: the program runs without errors but produces the wrong answer. For these, you need strategy, not luck. This lecture teaches the debugging process professional engineers use, and the Python tools that support each step. The goal is to replace "try changing something and see" with an orderly investigation.'),
      KEY('Debugging ialah kaedah saintifik: perhati, hipotesis, uji, simpulkan.', 'Debugging is the scientific method: observe, hypothesise, test, conclude.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Hasilkan semula (reproduce):** cari input dan langkah tepat yang menyebabkan pepijat setiap kali.', '**Reproduce:** find the exact input and steps that cause the bug every time.'],
        ['**Asingkan (isolate):** kecilkan input dan kod sehingga hanya bahagian yang gagal tinggal — "contoh minimum yang boleh dihasilkan semula".', '**Isolate:** shrink the input and code until only the failing part is left — a "minimal reproducible example".'],
        ['**Hipotesis:** satu penjelasan yang boleh diuji, contohnya "diskaun dikira sebagai 10 dan bukan 0.10".', '**Hypothesis:** one testable explanation, for example "the discount is calculated as 10, not 0.10".'],
        ['**Alat:** `print`/f-string `{x=}`, jadual jejak, `assert`, `logging`, debugger (`breakpoint()`).', '**Tools:** `print`/the f-string `{x=}`, trace tables, `assert`, `logging`, a debugger (`breakpoint()`).'],
        ['**Rubber duck debugging:** menerangkan kod baris demi baris kepada orang lain (atau itik getah) sering mendedahkan andaian yang salah.', '**Rubber duck debugging:** explaining code line by line to someone else (or a rubber duck) often exposes a wrong assumption.'],
      )),
    S('detailed_theory',
      P('Proses debugging yang sistematik mempunyai enam langkah. **(1) Hasilkan semula:** pepijat yang tidak boleh dihasilkan semula tidak boleh disahkan telah dibetulkan; catat input tepat. **(2) Asingkan:** bahagikan masalah. Jika program mempunyai 40 langkah, semak keadaan di tengah (langkah 20): jika betul, pepijat berada di separuh kedua; jika salah, di separuh pertama. Ulang — ini ialah **carian binari** dan ia mencari pepijat dalam 1,000 baris dengan kira-kira 10 semakan. Mengecilkan input juga berkesan: jika program gagal untuk senarai 500 nama, cari **satu** nama yang menyebabkannya. **(3) Hipotesis:** nyatakan sebab yang mungkin dalam satu ayat. **(4) Uji:** reka semakan yang akan membuktikan hipotesis salah — cetakan, `assert` atau input khas. **(5) Betulkan:** ubah satu perkara sahaja. **(6) Sahkan:** jalankan semula kes yang gagal **dan** kes yang dahulunya berjaya, untuk memastikan pembetulan tidak merosakkan perkara lain.',
        'A systematic debugging process has six steps. **(1) Reproduce:** a bug that cannot be reproduced cannot be confirmed fixed; record the exact input. **(2) Isolate:** divide the problem. If a program has 40 steps, check the state in the middle (step 20): if it is right, the bug is in the second half; if wrong, in the first half. Repeat — this is a **binary search** and it finds a bug in 1,000 lines in about 10 checks. Shrinking the input also works: if the program fails for a list of 500 names, find the **one** name that causes it. **(3) Hypothesise:** state a likely cause in one sentence. **(4) Test:** design a check that would prove the hypothesis wrong — a print, an `assert` or a special input. **(5) Fix:** change one thing only. **(6) Verify:** rerun the failing case **and** the cases that used to work, to make sure the fix broke nothing else.'),
      P('Alat yang paling mudah ialah `print`. F-string Python 3.8+ mempunyai bentuk khas `f"{total=}"` yang mencetak nama dan nilai sekali gus: `total=42`. Tambah awalan seperti `DEBUG` supaya cetakan debugging mudah dicari dan dibuang. **`assert syarat, mesej`** menyatakan andaian dalam kod: jika syarat palsu, Python menimbulkan `AssertionError` dengan mesej itu — pepijat ditemui di tempat andaian dilanggar, bukan jauh kemudian. Modul **`logging`** ialah versi profesional `print`: setiap mesej mempunyai tahap (`DEBUG`, `INFO`, `WARNING`, `ERROR`), dan satu tetapan memilih tahap mana yang dipaparkan, jadi mesej debugging boleh dimatikan tanpa memadam kod. Akhir sekali, **debugger** menghentikan program pada baris tertentu (`breakpoint()` atau titik henti dalam editor) dan membolehkan anda memeriksa setiap pemboleh ubah dan melangkah baris demi baris; arahan asas `pdb` ialah `p nama` (cetak), `n` (baris seterusnya), `s` (masuk ke fungsi), `c` (teruskan) dan `q` (keluar).',
        'The simplest tool is `print`. Python 3.8+ f-strings have a special form `f"{total=}"` that prints the name and the value at once: `total=42`. Add a prefix such as `DEBUG` so debug prints are easy to find and remove. **`assert condition, message`** states an assumption in the code: if the condition is false, Python raises `AssertionError` with that message — the bug is found where the assumption is broken, not far later. The **`logging`** module is the professional version of `print`: each message has a level (`DEBUG`, `INFO`, `WARNING`, `ERROR`), and one setting chooses which levels are shown, so debug messages can be switched off without deleting code. Finally, a **debugger** stops the program at a given line (`breakpoint()` or a breakpoint in the editor) and lets you inspect every variable and step line by line; the basic `pdb` commands are `p name` (print), `n` (next line), `s` (step into a function), `c` (continue) and `q` (quit).')),
    S('technical_terminology', TERMS('debugging', 'traceback', 'exception', 'runtime-error')),
    S('syntax_rules',
      UL(
        ['`print(f"{nama=}")` mencetak `nama=nilai` — untuk debugging pantas.', '`print(f"{name=}")` prints `name=value` — for quick debugging.'],
        ['`assert syarat, "mesej"` — `AssertionError: mesej` jika syarat palsu. (`python3 -O` mematikan semua `assert`, jadi jangan gunakannya untuk menyemak input pengguna.)', '`assert condition, "message"` — `AssertionError: message` if the condition is false. (`python3 -O` disables all asserts, so do not use them to validate user input.)'],
        ['`import logging` kemudian `logging.basicConfig(level=logging.DEBUG)` dan `logging.debug("…")`.', '`import logging` then `logging.basicConfig(level=logging.DEBUG)` and `logging.debug("…")`.'],
        ['`breakpoint()` menghentikan program dan membuka `pdb` di baris itu (untuk penggunaan interaktif dalam terminal).', '`breakpoint()` pauses the program and opens `pdb` at that line (for interactive use in a terminal).'],
      )),
    S('code_demonstration',
      P('Program ini sepatutnya memberi diskaun 10%, tetapi jumlahnya kelihatan terlalu kecil. Cetakan `{nama=}` mendedahkan nilai setiap langkah:', 'This program should give a 10% discount, but the total looks far too small. `{name=}` prints reveal the value at each step:'),
      CODE('print-debug-discount', 'python', 'python', ['Debugging dengan cetakan {nama=}', 'Debugging with {name=} prints'], `
prices = [12.50, 8.00, 20.00]
discount_rate = 10
subtotal = sum(prices)
discount = subtotal * discount_rate
print(f"DEBUG {subtotal=} {discount_rate=} {discount=}")
discount = subtotal * discount_rate / 100
print(f"DEBUG fixed {discount=}")
print(f"Total: RM{subtotal - discount:.2f}")
`, 'DEBUG subtotal=40.5 discount_rate=10 discount=405.0\nDEBUG fixed discount=4.05\nTotal: RM36.45'),
      EXPLAIN('print-debug-discount',
        ['1–3', 'Data dan subjumlah: 40.50.', 'The data and the subtotal: 40.50.'],
        ['4–5', 'Hipotesis diuji: cetakan menunjukkan diskaun 405.0 — lebih besar daripada subjumlah! Kadar 10 bermaksud "10 peratus", tetapi kod menggunakannya sebagai pengganda 10.', 'The hypothesis is tested: the print shows a discount of 405.0 — larger than the subtotal! A rate of 10 means "10 percent", but the code uses it as a multiplier of 10.'],
        ['6–7', 'Pembetulan: bahagi dengan 100. Cetakan kedua mengesahkan diskaun 4.05.', 'The fix: divide by 100. The second print confirms a discount of 4.05.'],
        ['8', 'Jumlah betul: 40.50 − 4.05 = 36.45. Dalam kod akhir, buang baris `DEBUG` dan pengiraan yang salah.', 'The correct total: 40.50 − 4.05 = 36.45. In the final code, remove the `DEBUG` lines and the wrong calculation.'])),
    S('complete_examples',
      CODE('assert-assumptions', 'python', 'python', ['Menyatakan andaian dengan assert', 'Stating assumptions with assert'], `
marks = [78, 85, 62, 90]
assert len(marks) > 0, "marks list must not be empty"
average = sum(marks) / len(marks)
assert 0 <= average <= 100, f"average out of range: {average}"
print(f"Average: {average:.2f}")
`, 'Average: 78.75', {
        debug: BUG(`
marks = [78, 85, 62, 900]
assert len(marks) > 0, "marks list must not be empty"
average = sum(marks) / len(marks)
assert 0 <= average <= 100, f"average out of range: {average}"
print(f"Average: {average:.2f}")
`, 'example.py:4: AssertionError: average out of range: 281.25',
          'Satu markah ditaip `900` dan bukan `90`. Tanpa `assert`, program akan mencetak purata 281.25 seolah-olah betul. `assert` pada baris 4 menghentikan program di tempat andaian ("purata antara 0 dan 100") dilanggar, dan mesejnya menunjukkan nilai sebenar — petunjuk terus kepada data yang salah.',
          'One mark was typed as `900` instead of `90`. Without the `assert`, the program would print an average of 281.25 as if it were correct. The `assert` on line 4 stops the program where the assumption ("the average is between 0 and 100") is broken, and its message shows the actual value — a direct clue to the bad data.'),
      }),
      EXPLAIN('assert-assumptions',
        ['1', 'Empat markah.', 'Four marks.'],
        ['2', 'Andaian 1: senarai tidak kosong — jika kosong, baris 3 akan membahagi dengan sifar.', 'Assumption 1: the list is not empty — if it were, line 3 would divide by zero.'],
        ['3', '78 + 85 + 62 + 90 = 315, dan 315 ÷ 4 = 78.75.', '78 + 85 + 62 + 90 = 315, and 315 ÷ 4 = 78.75.'],
        ['4', 'Andaian 2: purata markah mesti dalam julat 0–100. Perbandingan berantai `0 <= x <= 100` dibaca seperti matematik.', 'Assumption 2: an average mark must be within 0–100. The chained comparison `0 <= x <= 100` reads like mathematics.'],
        ['5', 'Hanya dicapai jika kedua-dua andaian benar.', 'Only reached if both assumptions hold.']),
      CODE('shrink-input', 'python', 'python', ['Mengasingkan input yang menyebabkan pepijat', 'Isolating the input that causes a bug'], `
def initials(full_name):
    parts = full_name.split()
    return parts[0][0] + parts[-1][0]

for name in ["Aina Rahman", "Tan Wei Ming", "Chong"]:
    print(f"{name!r:16} -> {initials(name)}")
`, "'Aina Rahman'    -> AR\n'Tan Wei Ming'   -> TM\n'Chong'          -> CC", {
        debug: BUG(`
def initials(full_name):
    parts = full_name.split()
    return parts[0][0] + parts[-1][0]

for name in ["Aina Rahman", "", "Chong"]:
    print(f"{name!r:16} -> {initials(name)}")
`, 'example.py:3: IndexError: list index out of range',
          'Senarai asal mungkin mempunyai ratusan nama; mengujinya satu demi satu menunjukkan bahawa **hanya** nama kosong `""` gagal: `"".split()` ialah senarai kosong, jadi `parts[0]` tiada. Output `AR` sudah dicetak, membuktikan nama pertama berjaya. Ini contoh minimum yang boleh dihasilkan semula. Perhatikan juga pepijat logik dalam versi betul: `"Chong"` memberi `CC` — satu nama digunakan dua kali. Kedua-dua kes memerlukan `if` (PY103).',
          'The original list might hold hundreds of names; testing them one by one shows that **only** the empty name `""` fails: `"".split()` is an empty list, so `parts[0]` does not exist. The output `AR` was already printed, proving the first name worked. This is a minimal reproducible example. Notice also the logic bug in the correct version: `"Chong"` gives `CC` — one name used twice. Both cases need `if` (PY103).'),
      }),
      EXPLAIN('shrink-input',
        ['1–3', 'Fungsi (PY104) yang mengambil huruf pertama perkataan pertama dan terakhir.', 'A function (PY104) that takes the first letter of the first and last words.'],
        ['5–6', 'Diuji dengan tiga input yang berbeza bentuk: dua perkataan, tiga perkataan, satu perkataan. `!r:16` mencetak nama dalam petik dalam lebar 16.', 'Tested with three inputs of different shapes: two words, three words, one word. `!r:16` prints the name in quotes within a width of 16.'])),
    S('line_by_line',
      EXPLAIN('print-debug-discount',
        ['5', '`{subtotal=}` dikembangkan kepada `subtotal=40.5`: nama ungkapan, tanda `=`, kemudian nilainya. Ini mengelakkan kekeliruan apabila banyak nombor dicetak bersama.', '`{subtotal=}` expands to `subtotal=40.5`: the expression’s name, an `=` sign, then its value. This avoids confusion when many numbers are printed together.']),
      EXPLAIN('shrink-input',
        ['3', '`parts[0][0]` — indeks pertama memilih perkataan, indeks kedua memilih huruf pertama perkataan itu. `parts[-1]` ialah perkataan terakhir; bagi satu perkataan, pertama dan terakhir adalah sama.', '`parts[0][0]` — the first index picks the word, the second picks that word’s first letter. `parts[-1]` is the last word; for a single word, first and last are the same.'])),
    S('why_this_way',
      P('Mengapa proses yang sistematik dan bukan mengubah kod sehingga ia "berfungsi"? Kerana perubahan rawak mungkin menyembunyikan simptom tanpa membetulkan punca, atau membetulkan satu kes sambil merosakkan yang lain. Proses saintifik memastikan setiap perubahan **difahami**. Ia juga lebih pantas secara purata: carian binari mencari pepijat dalam beberapa langkah, manakala meneka boleh mengambil masa berjam-jam. Jurutera kanan bukan lebih bijak meneka — mereka lebih berdisiplin menyiasat.',
        'Why a systematic process rather than changing code until it "works"? Because random changes may hide the symptom without fixing the cause, or fix one case while breaking another. The scientific process makes sure every change is **understood**. It is also faster on average: a binary search finds a bug in a few steps, while guessing can take hours. Senior engineers are not better guessers — they are more disciplined investigators.')),
    S('execution_flow',
      OL(
        ['Dalam `assert-assumptions`, baris 2 menilai `len(marks) > 0`; benar, jadi pelaksanaan diteruskan tanpa kesan.', 'In `assert-assumptions`, line 2 evaluates `len(marks) > 0`; it is true, so execution continues with no effect.'],
        ['Baris 3 mengira purata.', 'Line 3 calculates the average.'],
        ['Baris 4 menilai `0 <= average <= 100`. Jika palsu, mesej f-string dibina **hanya pada saat itu** dan `AssertionError` ditimbulkan.', 'Line 4 evaluates `0 <= average <= 100`. If false, the f-string message is built **only then** and `AssertionError` is raised.'],
        ['Jika semua andaian benar, baris 5 mencetak hasil.', 'If all assumptions hold, line 5 prints the result.'],
      )),
    S('memory_behaviour',
      P('Cetakan debugging dan `assert` tidak mengubah keadaan program — ia hanya membaca nilai — jadi ia selamat ditambah dan dibuang. Satu pengecualian: ungkapan dalam cetakan yang memanggil fungsi dengan kesan sampingan (contohnya `input()` atau `list.pop()`) **akan** mengubah keadaan; elakkannya dalam kod debugging. Debugger seperti `pdb` memeriksa bingkai yang sama yang dirujuk oleh traceback (kuliah 4.2), termasuk semua pemboleh ubah tempatan, tanpa mengubahnya kecuali anda mengarahkannya.',
        'Debug prints and asserts do not change the program’s state — they only read values — so they are safe to add and remove. One exception: an expression in a print that calls a function with side effects (for example `input()` or `list.pop()`) **will** change the state; avoid those in debugging code. A debugger such as `pdb` inspects the same frames a traceback refers to (lecture 4.2), including all local variables, without changing them unless you tell it to.')),
    S('alternative_implementations',
      P('Modul `logging` menggantikan cetakan `DEBUG` dengan mesej bertahap. Mengubah `level` daripada `DEBUG` kepada `WARNING` menyembunyikan mesej debugging tanpa memadam satu baris kod pun:', 'The `logging` module replaces `DEBUG` prints with levelled messages. Changing `level` from `DEBUG` to `WARNING` hides the debug messages without deleting a single line of code:'),
      CODE('logging-levels', 'python', 'python', ['Mesej bertahap dengan logging', 'Levelled messages with logging'], `
import logging
import sys

logging.basicConfig(level=logging.DEBUG, format="%(levelname)-8s %(message)s", stream=sys.stdout)

stock = 12
ordered = 15
logging.debug("stock=%s ordered=%s", stock, ordered)
if ordered > stock:
    logging.warning("only %s items left; order reduced", stock)
    ordered = stock
logging.info("order confirmed for %s items", ordered)
`, 'DEBUG    stock=12 ordered=15\nWARNING  only 12 items left; order reduced\nINFO     order confirmed for 12 items'),
      EXPLAIN('logging-levels',
        ['1–2', '`logging` untuk mesej; `sys` untuk menghantarnya ke output standard (secara lalai `logging` menulis ke ralat standard).', '`logging` for the messages; `sys` to send them to standard output (by default `logging` writes to standard error).'],
        ['4', 'Satu tetapan: tahap minimum `DEBUG`, format "tahap (8 aksara) + mesej".', 'One setting: minimum level `DEBUG`, format "level (8 characters) + message".'],
        ['6–8', 'Mesej `DEBUG` dengan nilai. `%s` diisi oleh `logging` hanya jika mesej itu benar-benar dipaparkan.', 'A `DEBUG` message with values. `%s` is filled in by `logging` only if the message is actually shown.'],
        ['9–11', 'Keadaan luar biasa dilaporkan sebagai `WARNING`.', 'An unusual situation is reported as a `WARNING`.'],
        ['12', 'Peristiwa biasa dilaporkan sebagai `INFO`.', 'A normal event is reported as `INFO`.'])),
    S('common_mistakes',
      UL(
        ['Mengubah beberapa perkara serentak — anda tidak tahu perubahan mana yang membetulkan (atau merosakkan) program.', 'Changing several things at once — you cannot tell which change fixed (or broke) the program.'],
        ['Tidak menghasilkan semula pepijat sebelum membetulkannya, jadi pembetulan tidak boleh disahkan.', 'Not reproducing the bug before fixing it, so the fix cannot be confirmed.'],
        ['Membiarkan cetakan `DEBUG` dalam kod akhir.', 'Leaving `DEBUG` prints in the final code.'],
        ['Menggunakan `assert` untuk mengesahkan input pengguna — `python3 -O` membuangnya; gunakan `if` dan exception.', 'Using `assert` to validate user input — `python3 -O` removes it; use `if` and exceptions.'],
        ['Menganggap pepijat berada di tempat ia kelihatan — punca sering lebih awal dalam aliran data.', 'Assuming the bug is where it shows up — the cause is often earlier in the data flow.'],
      )),
    S('debugging',
      P('Apabila nombor kelihatan salah, jejak nilai **dari sumbernya**. Satu punca yang lazim di Malaysia dan banyak negara lain ialah format nombor tempatan: pengguna atau fail menulis `12,5` (koma perpuluhan) atau `1,250.00` (pemisah ribuan), tetapi `float()` hanya menerima titik perpuluhan dan tiada pemisah. Ralat itu muncul pada baris penukaran, tetapi punca sebenarnya ialah format data. Contoh berikut menukar senarai bacaan suhu dengan selamat; versi berpepijat mengandungi bacaan dengan koma.',
        'When numbers look wrong, trace the value **from its source**. A common cause in Malaysia and many other countries is local number formats: users or files write `12,5` (a decimal comma) or `1,250.00` (a thousands separator), but `float()` only accepts a decimal point and no separators. The error appears on the conversion line, but the real cause is the data format. The following example converts a list of temperature readings safely; the buggy version contains a reading with a comma.'),
      CODE('normalise-numbers', 'python', 'python', ['Menormalkan format nombor sebelum penukaran', 'Normalising number formats before conversion'], `
readings = ["31.5", "32.0", "30.8"]
values = [float(text.replace(",", ".")) for text in readings]
print(values)
print(f"Mean temperature: {sum(values) / len(values):.2f} C")
`, '[31.5, 32.0, 30.8]\nMean temperature: 31.43 C', {
        debug: BUG(`
readings = ["31.5", "32,0", "30.8"]
values = [float(text) for text in readings]
print(values)
`, "example.py:2: ValueError: could not convert string to float: '32,0'",
          'Bacaan kedua menggunakan koma perpuluhan. `float()` tidak memahami format tempatan, dan mesej `ValueError` menunjukkan teks tepat yang gagal dalam petik. Hipotesis: "data menggunakan koma". Ujian: cetak `repr` bacaan. Pembetulan dalam versi betul: gantikan koma dengan titik **sebelum** penukaran — tetapi hanya jika anda pasti data tiada pemisah ribuan.',
          'The second reading uses a decimal comma. `float()` does not understand local formats, and the `ValueError` message shows the exact failing text in quotes. Hypothesis: "the data uses commas". Test: print the readings’ `repr`. The fix in the correct version: replace the comma with a point **before** converting — but only if you are sure the data has no thousands separators.'),
      }),
      EXPLAIN('normalise-numbers',
        ['1', 'Bacaan sebagai teks, seperti yang dibaca daripada fail atau sensor.', 'Readings as text, as read from a file or a sensor.'],
        ['2', 'Setiap teks dinormalkan (`,` → `.`) kemudian ditukar kepada `float`.', 'Each text is normalised (`,` → `.`) and then converted to `float`.'],
        ['3–4', '(31.5 + 32.0 + 30.8) ÷ 3 = 31.433…, dipaparkan sebagai 31.43.', '(31.5 + 32.0 + 30.8) ÷ 3 = 31.433…, displayed as 31.43.'])),
    S('performance',
      P('Cetakan debugging dalam gelung yang berjalan jutaan kali boleh memperlahankan program dengan ketara dan membanjiri terminal. `logging` mengurangkan kos ini: apabila tahap `DEBUG` dimatikan, mesej tidak diformat langsung (sebab itu `%s` digunakan dan bukan f-string dalam panggilan `logging`). `assert` juga mempunyai kos kecil; `python3 -O` membuangnya sepenuhnya dalam pengeluaran. Debugger interaktif memperlahankan pelaksanaan banyak kali ganda, jadi ia digunakan untuk kes kecil yang telah diasingkan, bukan keseluruhan sistem.',
        'Debug prints inside a loop that runs millions of times can slow a program considerably and flood the terminal. `logging` reduces this cost: when the `DEBUG` level is off, the message is not even formatted (that is why `%s` is used rather than an f-string in `logging` calls). `assert` also has a small cost; `python3 -O` removes it entirely in production. An interactive debugger slows execution many times over, so it is used on small, isolated cases, not the whole system.')),
    S('software_engineering',
      P('Cetakan debugging yang bertaburan menjadi sampah dalam kod. Bandingkan dengan suis debugging yang terkawal:', 'Scattered debug prints become clutter in the code. Compare with a controlled debug switch:'),
      CODE('scattered-prints-poor', 'python', 'python', ['Pelaksanaan lemah: cetakan debugging bertaburan', 'Poor implementation: scattered debug prints'], `
hours = 42
print("here 1")
rate = 12.50
print("rate", rate)
overtime = hours - 40
print("here 2", overtime)
pay = 40 * rate + overtime * rate * 1.5
print("Pay:", pay)
`, 'here 1\nrate 12.5\nhere 2 2\nPay: 537.5'),
      EXPLAIN('scattered-prints-poor',
        ['1–8', 'Cetakan "here 1" dan "here 2" tidak bermakna kepada sesiapa selain penulisnya, bercampur dengan output sebenar, dan mesti dicari serta dipadam dengan tangan — mudah tertinggal.', '"here 1" and "here 2" mean nothing to anyone but their author, are mixed with the real output, and must be found and deleted by hand — easy to miss.']),
      CODE('debug-switch-improved', 'python', 'python', ['Pelaksanaan lebih baik: suis debugging dan mesej bermakna', 'Improved implementation: a debug switch and meaningful messages'], `
DEBUG = False
NORMAL_HOURS = 40
OVERTIME_MULTIPLIER = 1.5


def debug(message):
    if DEBUG:
        print("DEBUG", message)


hours = 42
rate = 12.50
overtime_hours = max(hours - NORMAL_HOURS, 0)
debug(f"{hours=} {rate=} {overtime_hours=}")
pay = NORMAL_HOURS * rate + overtime_hours * rate * OVERTIME_MULTIPLIER
print(f"Pay: RM{pay:.2f}")
`, 'Pay: RM537.50'),
      EXPLAIN('debug-switch-improved',
        ['1–3', 'Satu suis untuk semua mesej debugging, dan pemalar bernama.', 'One switch for all debug messages, and named constants.'],
        ['6–8', 'Fungsi kecil yang mencetak hanya apabila `DEBUG` benar. (Dalam projek sebenar, gunakan `logging`.)', 'A small function that prints only when `DEBUG` is true. (In real projects, use `logging`.)'],
        ['11–14', 'Data dan mesej debugging yang bermakna dengan `{nama=}`. `max(..., 0)` memastikan jam lebih masa tidak negatif.', 'The data and a meaningful debug message with `{name=}`. `max(..., 0)` keeps overtime hours from going negative.'],
        ['15–16', '40 × 12.50 + 2 × 12.50 × 1.5 = 500 + 37.50 = 537.50.', '40 × 12.50 + 2 × 12.50 × 1.5 = 500 + 37.50 = 537.50.'])),
    S('industry_use_cases',
      UL(
        ['**Pasukan perisian** memerlukan "langkah untuk menghasilkan semula" dalam setiap laporan pepijat (contohnya dalam GitHub Issues atau Jira).', '**Software teams** require "steps to reproduce" in every bug report (for example in GitHub Issues or Jira).'],
        ['**Perkhidmatan awan** menggunakan `logging` dengan tahap yang boleh ditukar semasa runtime untuk menyiasat masalah pengeluaran tanpa memasang semula kod.', '**Cloud services** use `logging` with levels that can be changed at run time to investigate production problems without redeploying code.'],
        ['**`git bisect`** menggunakan carian binari atas sejarah kod untuk mencari perubahan tepat yang memperkenalkan pepijat.', '**`git bisect`** uses a binary search over the code’s history to find the exact change that introduced a bug.'],
        ['**Ujian automatik** (PY211) mengubah setiap pepijat yang dibetulkan menjadi ujian supaya ia tidak kembali.', '**Automated tests** (PY211) turn every fixed bug into a test so it never comes back.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah `breakpoint()` sebelum baris 4 dalam `print-debug-discount` dan jalankan dalam terminal. Taip `p subtotal`, `n`, `p discount`, kemudian `c`.', 'Add `breakpoint()` before line 4 of `print-debug-discount` and run it in a terminal. Type `p subtotal`, `n`, `p discount`, then `c`.'],
        ['Dalam `debug-switch-improved`, tukar `DEBUG` kepada `True` dan perhatikan mesej tambahan.', 'In `debug-switch-improved`, change `DEBUG` to `True` and observe the extra message.'],
        ['Dalam `logging-levels`, tukar `level` kepada `logging.WARNING`. Mesej mana yang hilang?', 'In `logging-levels`, change `level` to `logging.WARNING`. Which messages disappear?'],
        ['Terangkan `shrink-input` baris demi baris kepada rakan (rubber duck debugging) dan cari pepijat logik untuk "Chong".', 'Explain `shrink-input` line by line to a friend (rubber duck debugging) and find the logic bug for "Chong".'],
      )),
    S('mini_project',
      P('**Membaiki kalkulator gred.** Program asal memberi gred yang salah. Versi yang dibaiki di bawah mengandungi pembetulan dan **semakan kendiri**: senarai kes ujian dengan jawapan yang dijangka, setiap satu disemak dengan `assert`, supaya pepijat yang sama tidak boleh kembali tanpa disedari.', '**Repairing a grade calculator.** The original program gave wrong grades. The repaired version below contains the fix and a **self-check**: a list of test cases with expected answers, each checked with `assert`, so the same bug cannot return unnoticed.'),
      CODE('grade-self-check', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
def grade(mark):
    if mark >= 80:
        return "A"
    if mark >= 65:
        return "B"
    if mark >= 50:
        return "C"
    return "F"


cases = [(95, "A"), (80, "A"), (79, "B"), (65, "B"), (50, "C"), (49, "F"), (0, "F")]
for mark, expected in cases:
    actual = grade(mark)
    assert actual == expected, f"grade({mark}) gave {actual}, expected {expected}"
print(f"All {len(cases)} checks passed")
print("Mark 72 ->", grade(72))
`, 'All 7 checks passed\nMark 72 -> B'),
      EXPLAIN('grade-self-check',
        ['1–8', 'Fungsi gred (PY103–PY104): syarat disemak dari markah tertinggi ke bawah. Pepijat asal menggunakan `>` dan bukan `>=`, jadi 80 tepat mendapat B.', 'The grade function (PY103–PY104): conditions are checked from the highest mark downwards. The original bug used `>` instead of `>=`, so exactly 80 got a B.'],
        ['11', 'Kes ujian sengaja termasuk **sempadan** — 80, 79, 65, 50, 49 — kerana pepijat paling kerap bersembunyi di situ.', 'The test cases deliberately include the **boundaries** — 80, 79, 65, 50, 49 — because bugs hide there most often.'],
        ['12–14', 'Setiap kes disemak; jika satu gagal, mesej `AssertionError` menunjukkan input, hasil sebenar dan hasil yang dijangka.', 'Each case is checked; if one fails, the `AssertionError` message shows the input, the actual result and the expected result.'],
        ['15–16', 'Hanya dicetak jika semua semakan lulus, diikuti oleh penggunaan biasa.', 'Only printed if every check passed, followed by normal use.'])),
    S('summary',
      UL(
        ['Debugging = hasilkan semula → asingkan → hipotesis → uji → betulkan satu perkara → sahkan.', 'Debugging = reproduce → isolate → hypothesise → test → fix one thing → verify.'],
        ['Carian binari (separuh demi separuh) mencari pepijat dengan cepat dalam kod atau input yang besar.', 'A binary search (half by half) finds bugs quickly in large code or input.'],
        ['Alat: `print(f"{x=}")`, jadual jejak, `assert`, `logging`, `breakpoint()`/`pdb`.', 'Tools: `print(f"{x=}")`, trace tables, `assert`, `logging`, `breakpoint()`/`pdb`.'],
        ['Punca pepijat sering lebih awal daripada simptomnya; jejak nilai ke sumbernya.', 'A bug’s cause is often earlier than its symptom; trace values back to their source.'],
        ['Ubah setiap pepijat yang dibetulkan menjadi semakan supaya ia tidak kembali.', 'Turn every fixed bug into a check so it never returns.'],
      )),
    S('knowledge_check',
      OL(
        ['Senaraikan enam langkah proses debugging dan terangkan langkah "asingkan".', 'List the six steps of the debugging process and explain the "isolate" step.'],
        ['Apakah yang dicetak oleh `x = 7` diikuti `print(f"{x * 2=}")`?', 'What does `x = 7` followed by `print(f"{x * 2=}")` print?'],
        ['Mengapakah `assert` tidak sesuai untuk menyemak input pengguna?', 'Why is `assert` not suitable for validating user input?'],
        ['Program gagal untuk fail 10,000 baris. Bagaimanakah anda mencari baris yang menyebabkannya dengan sedikit langkah?', 'A program fails on a 10,000-line file. How would you find the line that causes it in few steps?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'pdb — The Python Debugger', url: `${PYDOCS}/library/pdb.html` },
        { title: 'Logging HOWTO', url: `${PYDOCS}/howto/logging.html` },
        { title: 'The assert statement', url: `${PYDOCS}/reference/simple_stmts.html#the-assert-statement` },
        { title: 'Python built-in functions — breakpoint()', url: `${PYDOCS}/library/functions.html#breakpoint` },
        { title: 'Debugging Python code in VS Code', url: 'https://code.visualstudio.com/docs/python/debugging' },
        { title: 'Think Python, 3rd edition — Appendix: Debugging', url: 'https://allendowney.github.io/ThinkPython/chap20.html' },
      )),
  ],
};

export const PY101_M4: LectureContentDef[] = [PY101_4_1, PY101_4_2, PY101_4_3];
