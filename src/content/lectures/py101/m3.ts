import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * PY101 · Module 3 — First Programs: Output and Input.
 * Every example is Python 3.13 and is executed by CPython 3.13 (npm run verify:code). Examples that call input()
 * are run with fixed keyboard input; the typed text is not echoed in the verified output.
 */

const PYDOCS = 'https://docs.python.org/3.13';
const ATBS = 'https://automatetheboringstuff.com/3e';

// ─── 3.1 print(), string literals and comments ────────────────────────────

export const PY101_3_1: LectureContentDef = {
  courseCode: 'PY101',
  module: 3,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan [[print-function|`print()`]] dengan beberapa argumen dan argumen kata kunci `sep` dan `end`.', 'Use [[print-function|`print()`]] with several arguments and the keyword arguments `sep` and `end`.'],
        ['Menulis [[string-literal|literal string]] dengan petik tunggal, berganda dan tiga petik, serta [[escape-sequence|escape sequence]] dan raw string.', 'Write [[string-literal|string literals]] with single, double and triple quotes, plus [[escape-sequence|escape sequences]] and raw strings.'],
        ['Memformat output dengan f-string, termasuk bilangan tempat perpuluhan dan penjajaran.', 'Format output with f-strings, including the number of decimal places and alignment.'],
        ['Menulis [[hash-comment|komen dan docstring]] yang menerangkan *mengapa*, bukan *apa*.', 'Write [[hash-comment|comments and docstrings]] that explain *why*, not *what*.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 2: anda boleh menyunting, menyimpan dan menjalankan fail `.py`.', 'Module 2: you can edit, save and run a `.py` file.'],
        ['Kuliah 1.1: pemboleh ubah sebagai nama bagi nilai.', 'Lecture 1.1: variables as names for values.'],
      )),
    S('introduction',
      P('Output ialah cara program bercakap dengan manusia. Resit, laporan, mesej ralat, papan skor — semuanya teks yang dihasilkan oleh program. Dalam Python, alat asas untuk output ialah fungsi `print()`, dan bahan asasnya ialah **string**: teks yang ditulis di antara tanda petik. Kuliah ini mengajar cara menulis teks dengan tepat (termasuk aksara khas seperti tab dan baris baharu), cara menggabungkan teks dengan nombor dalam output yang kemas, dan cara menulis komen yang membantu pembaca kod anda.',
        'Output is how a program talks to people. Receipts, reports, error messages, scoreboards — all are text produced by programs. In Python, the basic tool for output is the `print()` function, and its basic material is the **string**: text written between quotes. This lecture teaches how to write text precisely (including special characters such as tabs and newlines), how to combine text with numbers into tidy output, and how to write comments that help the readers of your code.'),
      KEY('`print()` menukar setiap argumen kepada teks, memisahkannya dengan `sep` dan menamatkannya dengan `end`.', '`print()` converts each argument to text, separates them with `sep` and finishes with `end`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**[[print-function|`print(*objects, sep=" ", end="\\n")`]]:** sebarang bilangan argumen; lalai satu ruang antara argumen dan baris baharu di hujung.', '**[[print-function|`print(*objects, sep=" ", end="\\n")`]]:** any number of arguments; by default one space between arguments and a newline at the end.'],
        ['**[[string-literal|Literal string]]:** `\'teks\'`, `"teks"`, `"""teks berbilang baris"""` — semuanya jenis `str`.', '**[[string-literal|String literal]]:** `\'text\'`, `"text"`, `"""multi-line text"""` — all of type `str`.'],
        ['**[[escape-sequence|Escape sequence]]:** `\\n` baris baharu, `\\t` tab, `\\"` petik, `\\\\` garis miring terbalik.', '**[[escape-sequence|Escape sequence]]:** `\\n` newline, `\\t` tab, `\\"` quote, `\\\\` backslash.'],
        ['**Raw string `r"..."`:** garis miring terbalik dianggap aksara biasa — berguna untuk laluan Windows.', '**Raw string `r"..."`:** backslashes are ordinary characters — useful for Windows paths.'],
        ['**F-string `f"..."`:** `{ungkapan}` digantikan dengan nilainya; `{harga:.2f}` memformat dengan dua tempat perpuluhan.', '**F-string `f"..."`:** `{expression}` is replaced by its value; `{price:.2f}` formats with two decimal places.'],
        ['**[[hash-comment|Komen `#`]] dan docstring:** nota untuk manusia; komen diabaikan sepenuhnya oleh Python.', '**[[hash-comment|`#` comments]] and docstrings:** notes for people; comments are ignored entirely by Python.'],
      )),
    S('detailed_theory',
      P('`print()` ialah fungsi terbina dalam yang melakukan tiga langkah. Pertama, setiap argumen ditukar kepada teks dengan `str()`: nombor `7` menjadi `"7"`, `3.5` menjadi `"3.5"`, `True` menjadi `"True"`. Kedua, teks-teks itu dicantum dengan nilai `sep` di antaranya (lalai: satu ruang). Ketiga, nilai `end` ditambah di hujung (lalai: `"\\n"`, aksara baris baharu) dan hasilnya ditulis ke **output standard** — biasanya terminal. Kerana `end` boleh ditukar, beberapa panggilan `print` boleh menulis pada baris yang sama; kerana `sep` boleh ditukar, `print("2025", "11", "19", sep="-")` menghasilkan tarikh. `print()` tanpa argumen hanya menulis `end`, iaitu baris kosong. Fungsi ini memulangkan `None`: tujuannya ialah **kesan sampingan** — mengubah apa yang dilihat di skrin — bukan menghasilkan nilai.',
        '`print()` is a built-in function that performs three steps. First, each argument is converted to text with `str()`: the number `7` becomes `"7"`, `3.5` becomes `"3.5"`, `True` becomes `"True"`. Second, those texts are joined with the value of `sep` between them (default: one space). Third, the value of `end` is added at the end (default: `"\\n"`, the newline character) and the result is written to **standard output** — usually the terminal. Because `end` can be changed, several `print` calls can write on the same line; because `sep` can be changed, `print("2025", "11", "19", sep="-")` produces a date. `print()` with no arguments writes only `end`, which is an empty line. The function returns `None`: its purpose is a **side effect** — changing what is seen on screen — not producing a value.'),
      P('Literal string boleh menggunakan petik tunggal atau berganda; kedua-duanya sama sepenuhnya. Pilih yang membolehkan petik lain muncul di dalam teks tanpa escape: `"It\'s easy"` dan `\'He said "go"\'`. Tiga petik (`"""` atau `\'\'\'`) membolehkan teks merentasi beberapa baris. Di dalam literal biasa, garis miring terbalik `\\` memulakan **escape sequence**: `\\n` ialah satu aksara baris baharu, `\\t` satu tab. Sebab itulah laluan Windows `"C:\\Users"` bermasalah — `\\U` dibaca sebagai permulaan kod Unicode. Prefiks `r` mencipta **raw string** di mana garis miring terbalik tidak istimewa. Prefiks `f` mencipta **f-string** (sejak Python 3.6): ungkapan dalam `{}` dinilai semasa runtime dan dimasukkan ke dalam teks, dengan **spesifikasi format** pilihan selepas `:` — `.2f` untuk dua tempat perpuluhan, `>8` untuk menjajar ke kanan dalam lebar 8, `,` untuk pemisah ribuan.',
        'String literals can use single or double quotes; the two are completely equivalent. Choose the one that lets the other kind of quote appear inside the text without escaping: `"It\'s easy"` and `\'He said "go"\'`. Triple quotes (`"""` or `\'\'\'`) let text span several lines. Inside an ordinary literal, the backslash `\\` starts an **escape sequence**: `\\n` is one newline character, `\\t` one tab. That is why the Windows path `"C:\\Users"` is a problem — `\\U` is read as the start of a Unicode code. The `r` prefix creates a **raw string** in which backslashes are not special. The `f` prefix creates an **f-string** (since Python 3.6): expressions inside `{}` are evaluated at run time and inserted into the text, with an optional **format specification** after `:` — `.2f` for two decimal places, `>8` to right-align within a width of 8, `,` for a thousands separator.'),
      P('Komen bermula dengan `#` dan berterusan hingga hujung baris. Tokeniser Python membuangnya sebelum penghuraian, jadi komen tidak memberi kesan kepada program atau prestasinya. **Docstring** pula ialah literal string sebagai pernyataan pertama dalam modul atau fungsi; ia **disimpan** sebagai atribut `__doc__` dan dipaparkan oleh `help()`. Konvensyen yang baik: komen menerangkan sebab dan andaian yang tidak jelas daripada kod; nama yang baik menerangkan apa yang dilakukan.',
        'A comment starts with `#` and runs to the end of the line. Python’s tokeniser drops it before parsing, so comments have no effect on the program or its performance. A **docstring**, by contrast, is a string literal as the first statement of a module or function; it is **kept** as the `__doc__` attribute and shown by `help()`. A good convention: comments explain reasons and assumptions that are not obvious from the code; good names explain what is done.')),
    S('technical_terminology', TERMS('print-function', 'string-literal', 'escape-sequence', 'hash-comment', 'function')),
    S('syntax_rules',
      UL(
        ['`print(a, b, c)` — argumen dipisahkan oleh koma; `print(a, b, sep="", end="")` — argumen kata kunci di hujung.', '`print(a, b, c)` — arguments are separated by commas; `print(a, b, sep="", end="")` — keyword arguments come last.'],
        ['Petik pembuka dan penutup mesti sama jenis: `"…"` atau `\'…\'`.', 'The opening and closing quotes must be the same kind: `"…"` or `\'…\'`.'],
        ['F-string: `f"Jumlah: {jumlah:.2f}"`; untuk menulis `{` sebenar, gunakan `{{`.', 'F-string: `f"Total: {total:.2f}"`; to write a literal `{`, use `{{`.'],
        ['Komen: `#` diikuti satu ruang; komen sebaris dipisahkan daripada kod dengan sekurang-kurangnya dua ruang ([[pep-8|PEP 8]]).', 'Comments: `#` followed by one space; an inline comment is separated from code by at least two spaces ([[pep-8|PEP 8]]).'],
        ['Hanya petik lurus `"` dan `\'` sah; petik melengkung `“ ”` daripada pemproses kata ialah ralat.', 'Only straight quotes `"` and `\'` are valid; curly quotes `“ ”` from word processors are errors.'],
      )),
    S('code_demonstration',
      CODE('print-basics', 'python', 'python', ['Cara print() bekerja', 'How print() works'], `
print("Selamat datang ke PY101")
print("Course", "PY101", "Semester", 1)
print("2025", "11", "19", sep="-")
print("Loading", end="...")
print("done")
print()
print("Total items:", 3 + 4)
`, 'Selamat datang ke PY101\nCourse PY101 Semester 1\n2025-11-19\nLoading...done\n\nTotal items: 7'),
      EXPLAIN('print-basics',
        ['1', 'Satu argumen string: teks dicetak tanpa tanda petik, diikuti baris baharu.', 'One string argument: the text is printed without quotes, followed by a newline.'],
        ['2', 'Empat argumen, termasuk nombor `1`. Setiap satu ditukar kepada teks dan dipisahkan oleh satu ruang.', 'Four arguments, including the number `1`. Each is converted to text and separated by one space.'],
        ['3', '`sep="-"` menggantikan ruang dengan sengkang.', '`sep="-"` replaces the space with a hyphen.'],
        ['4–5', '`end="..."` menggantikan baris baharu, jadi `done` dicetak pada baris yang sama.', '`end="..."` replaces the newline, so `done` is printed on the same line.'],
        ['6', '`print()` kosong menghasilkan baris kosong.', 'An empty `print()` produces an empty line.'],
        ['7', 'Ungkapan `3 + 4` dinilai dahulu; `print` menerima nilai 7.', 'The expression `3 + 4` is evaluated first; `print` receives the value 7.'])),
    S('complete_examples',
      CODE('string-forms', 'python', 'python', ['Bentuk literal string', 'Forms of string literals'], `
single = 'Python'
double = "It's easy"
quote_inside = 'He said "go"'
multi = """Line 1
Line 2"""
print(single, double, quote_inside)
print(multi)
print(len(multi), type(multi).__name__)
`, 'Python It\'s easy He said "go"\nLine 1\nLine 2\n13 str', {
        debug: BUG(`
single = 'Python'
double = 'It's easy'
print(single, double)
`, 'example.py:2: SyntaxError: unterminated string literal (detected at line 2)',
          'Petik tunggal dalam `It\'s` menamatkan string terlalu awal: Python membaca `\'It\'`, kemudian `s easy`, kemudian petik pembuka baharu yang tidak pernah ditutup. Gunakan petik berganda di luar — `"It\'s easy"` — atau escape petik di dalam: `\'It\\\'s easy\'`.',
          'The single quote in `It\'s` ends the string too early: Python reads `\'It\'`, then `s easy`, then a new opening quote that is never closed. Use double quotes outside — `"It\'s easy"` — or escape the inner quote: `\'It\\\'s easy\'`.'),
      }),
      EXPLAIN('string-forms',
        ['1–3', 'Petik tunggal dan berganda adalah setara. Pilih yang membolehkan petik jenis lain berada di dalam teks.', 'Single and double quotes are equivalent. Choose the one that lets the other kind of quote sit inside the text.'],
        ['4–5', 'Tiga petik: string merentasi dua baris. Baris baharu di antaranya ialah sebahagian daripada teks.', 'Triple quotes: the string spans two lines. The newline between them is part of the text.'],
        ['6–7', 'Tiga string pada satu baris output, kemudian string berbilang baris.', 'Three strings on one output line, then the multi-line string.'],
        ['8', '`len` mengira aksara: 6 + 1 (baris baharu) + 6 = 13. Semua literal ini jenis `str`.', '`len` counts characters: 6 + 1 (newline) + 6 = 13. All these literals are of type `str`.']),
      CODE('escape-sequences', 'python', 'python', ['Escape sequence dan raw string', 'Escape sequences and raw strings'], `
print("Name:\\tAina")
print("Line one\\nLine two")
print("She said \\"hi\\"")
print("Backslash: \\\\")
print(r"C:\\Users\\Aina\\notes.txt")
`, 'Name:\tAina\nLine one\nLine two\nShe said "hi"\nBackslash: \\\nC:\\Users\\Aina\\notes.txt', {
        debug: BUG(`
print("C:\\Users\\Aina")
`, "example.py:1: SyntaxError: (unicode error) 'unicodeescape' codec can't decode bytes in position 2-3: truncated \\UXXXXXXXX escape",
          'Dalam string biasa, `\\U` memulakan escape Unicode 8 digit (`\\U0001F600`). `\\Users` tidak mempunyai 8 digit heksadesimal, jadi Python tidak dapat mengkompil literal itu. Ini ralat yang sangat biasa dengan laluan Windows. Penyelesaian: raw string `r"C:\\Users\\Aina"`, garis miring terbalik berganda `"C:\\\\Users\\\\Aina"`, atau garis miring biasa `"C:/Users/Aina"` (Windows menerimanya).',
          'In an ordinary string, `\\U` starts an 8-digit Unicode escape (`\\U0001F600`). `\\Users` does not have 8 hexadecimal digits, so Python cannot compile the literal. This is a very common error with Windows paths. Fixes: a raw string `r"C:\\Users\\Aina"`, doubled backslashes `"C:\\\\Users\\\\Aina"`, or forward slashes `"C:/Users/Aina"` (Windows accepts them).'),
      }),
      EXPLAIN('escape-sequences',
        ['1', '`\\t` ialah satu aksara tab; terminal menjajarkannya ke hentian tab seterusnya.', '`\\t` is one tab character; the terminal aligns it to the next tab stop.'],
        ['2', '`\\n` memecahkan output kepada dua baris walaupun hanya satu `print`.', '`\\n` splits the output into two lines even though there is only one `print`.'],
        ['3', '`\\"` meletakkan petik berganda di dalam string berpetik berganda.', '`\\"` puts a double quote inside a double-quoted string.'],
        ['4', '`\\\\` ialah **satu** garis miring terbalik dalam teks.', '`\\\\` is **one** backslash in the text.'],
        ['5', 'Raw string: setiap `\\` dicetak seperti yang ditulis — `\\n` dalam `\\notes` **bukan** baris baharu di sini.', 'A raw string: every `\\` is printed as written — the `\\n` in `\\notes` is **not** a newline here.'])),
    S('line_by_line',
      EXPLAIN('print-basics',
        ['2', 'Dalaman: `str("Course")`, `str("PY101")`, `str("Semester")`, `str(1)` → empat teks → dicantum dengan `" "` → ditambah `"\\n"` → ditulis ke output standard.', 'Internally: `str("Course")`, `str("PY101")`, `str("Semester")`, `str(1)` → four texts → joined with `" "` → `"\\n"` appended → written to standard output.']),
      EXPLAIN('escape-sequences',
        ['5', 'Dalam kod sumber, `r"C:\\Users"` mengandungi garis miring terbalik tunggal. Tanpa `r`, `\\U` akan menjadi ralat (lihat versi berpepijat) dan `\\n` dalam `\\notes` akan menjadi baris baharu.', 'In the source code, `r"C:\\Users"` contains single backslashes. Without `r`, `\\U` would be an error (see the buggy version) and the `\\n` in `\\notes` would become a newline.'])),
    S('why_this_way',
      P('Mengapa `print` menjadi fungsi dalam Python 3 dan bukan pernyataan khas seperti dalam Python 2? Kerana fungsi boleh menerima argumen kata kunci (`sep`, `end`, `file`), boleh diganti untuk ujian, dan mengikut peraturan yang sama seperti semua fungsi lain — kurang perkara istimewa untuk diingat. Mengapa f-string? Sebelum Python 3.6, pengatur cara menggabungkan teks dengan `+` dan `str()` atau dengan `.format()`. F-string meletakkan ungkapan tepat di tempat ia muncul dalam output, jadi kod dibaca seperti hasilnya.',
        'Why did `print` become a function in Python 3 rather than a special statement as in Python 2? Because a function can take keyword arguments (`sep`, `end`, `file`), can be replaced for testing, and follows the same rules as every other function — fewer special cases to remember. Why f-strings? Before Python 3.6, programmers joined text with `+` and `str()` or with `.format()`. An f-string places each expression exactly where it appears in the output, so the code reads like its result.')),
    S('execution_flow',
      OL(
        ['Semasa kompil, setiap literal string ditukar kepada objek `str`; escape sequence seperti `\\n` ditukar kepada aksara sebenar pada langkah ini. Literal yang tidak sah (`"C:\\Users"`) menghentikan kompil.', 'During compilation, each string literal becomes a `str` object; escape sequences such as `\\n` are turned into real characters at this step. An invalid literal (`"C:\\Users"`) stops compilation.'],
        ['Semasa runtime, setiap argumen `print` dinilai dari kiri ke kanan.', 'At run time, each `print` argument is evaluated from left to right.'],
        ['Bagi f-string, setiap `{ungkapan}` dinilai, diformat mengikut spesifikasinya dan dimasukkan ke dalam teks.', 'For an f-string, each `{expression}` is evaluated, formatted by its specification and inserted into the text.'],
        ['`print` menukar argumen kepada teks, mencantumnya dengan `sep`, menambah `end` dan menulis ke output standard.', '`print` converts the arguments to text, joins them with `sep`, adds `end` and writes to standard output.'],
      )),
    S('memory_behaviour',
      P('String Python ialah objek **tidak boleh ubah** (immutable): setelah dicipta, kandungannya tidak berubah. Operasi seperti `+` atau f-string mencipta string **baharu**. Python 3 menyimpan string sebagai Unicode, jadi `"Café"` dan `"日本"` ialah teks biasa; secara dalaman CPython menggunakan 1, 2 atau 4 bait setiap aksara bergantung pada aksara terbesar dalam string. Literal yang sama dalam kod sering dikongsi sebagai satu objek. Komen tidak menggunakan sebarang ingatan semasa runtime kerana ia dibuang sebelum kompil; docstring pula disimpan dalam ingatan sebagai `__doc__`.',
        'Python strings are **immutable** objects: once created, their content never changes. Operations such as `+` or f-strings create **new** strings. Python 3 stores strings as Unicode, so `"Café"` and `"日本"` are ordinary text; internally CPython uses 1, 2 or 4 bytes per character depending on the largest character in the string. Identical literals in code are often shared as one object. Comments use no memory at run time because they are removed before compilation; docstrings, however, are kept in memory as `__doc__`.')),
    S('alternative_implementations',
      P('Tiga cara menghasilkan output yang sama. Ketiga-tiganya sah; f-string ialah pilihan moden yang disyorkan:', 'Three ways to produce the same output. All three are valid; the f-string is the recommended modern choice:'),
      CODE('three-formats', 'python', 'python', ['Penyambungan, format() dan f-string', 'Concatenation, format() and f-strings'], `
item = "Teh tarik"
price = 2.5
quantity = 3
print(item + " x " + str(quantity) + " = RM" + str(price * quantity))
print("{} x {} = RM{:.2f}".format(item, quantity, price * quantity))
print(f"{item} x {quantity} = RM{price * quantity:.2f}")
`, 'Teh tarik x 3 = RM7.5\nTeh tarik x 3 = RM7.50\nTeh tarik x 3 = RM7.50'),
      EXPLAIN('three-formats',
        ['1–3', 'Data untuk satu baris pesanan.', 'Data for one order line.'],
        ['4', 'Penyambungan dengan `+`: setiap nombor mesti ditukar dengan `str()`, dan RM7.5 tidak diformat dengan dua tempat perpuluhan.', 'Concatenation with `+`: every number must be converted with `str()`, and RM7.5 is not formatted with two decimal places.'],
        ['5', '`.format()`: tempat letak `{}` diisi mengikut susunan; `{:.2f}` memformat wang.', '`.format()`: the `{}` placeholders are filled in order; `{:.2f}` formats money.'],
        ['6', 'F-string: setiap ungkapan berada di tempatnya sendiri — paling mudah dibaca.', 'F-string: each expression sits in its own place — the easiest to read.'])),
    S('common_mistakes',
      UL(
        ['Menulis `print "hello"` (Python 2) — kurungan wajib dalam Python 3.', 'Writing `print "hello"` (Python 2) — parentheses are required in Python 3.'],
        ['Menggabungkan teks dan nombor dengan `+` tanpa `str()` — `TypeError: can only concatenate str (not "int") to str`.', 'Joining text and a number with `+` without `str()` — `TypeError: can only concatenate str (not "int") to str`.'],
        ['Terlupa `f` sebelum f-string: `"Total: {total}"` mencetak `{total}` secara literal.', 'Forgetting the `f` before an f-string: `"Total: {total}"` prints `{total}` literally.'],
        ['Laluan Windows dalam string biasa (`"C:\\new\\table"`) — `\\n` dan `\\t` menjadi baris baharu dan tab.', 'Windows paths in ordinary strings (`"C:\\new\\table"`) — `\\n` and `\\t` become a newline and a tab.'],
        ['Komen yang mengulang kod (`x = 5  # set x to 5`) dan bukan menerangkan sebab.', 'Comments that repeat the code (`x = 5  # set x to 5`) instead of explaining the reason.'],
      )),
    S('debugging',
      P('Masalah output yang paling sukar ialah aksara yang **tidak kelihatan**: ruang di hujung, tab, atau baris baharu yang tersembunyi dalam data. `print()` memaparkan teks seperti yang akan dilihat pengguna, jadi aksara itu hilang daripada pandangan. `repr()` — atau penukar `!r` dalam f-string — memaparkan string seperti literal Python, dengan tanda petik dan escape sequence, supaya setiap aksara kelihatan. Gunakannya apabila perbandingan teks gagal secara misteri, atau apabila output mempunyai baris kosong yang tidak dijangka.',
        'The hardest output problems involve **invisible** characters: trailing spaces, tabs or newlines hidden in data. `print()` shows text as the user will see it, so those characters disappear from view. `repr()` — or the `!r` converter in an f-string — shows a string as a Python literal, with quotes and escape sequences, so every character becomes visible. Use it when a text comparison fails mysteriously, or when the output has unexpected blank lines.'),
      CODE('repr-debug', 'python', 'python', ['Melihat aksara tersembunyi dengan repr()', 'Seeing hidden characters with repr()'], `
name = "  Aina\\n"
print("Name is", name, "end")
print("Name is", repr(name), "end")
print(f"{name!r} has {len(name)} characters")
cleaned = name.strip()
print(f"{cleaned!r} has {len(cleaned)} characters")
`, "Name is   Aina\n end\nName is '  Aina\\n' end\n'  Aina\\n' has 7 characters\n'Aina' has 4 characters"),
      EXPLAIN('repr-debug',
        ['1', 'Teks dengan dua ruang di hadapan dan baris baharu di hujung — seperti data yang dibaca daripada fail.', 'Text with two leading spaces and a trailing newline — like data read from a file.'],
        ['2', 'Output biasa: ruang tambahan sukar dilihat dan baris baharu memecahkan output secara tidak dijangka.', 'Normal output: the extra spaces are hard to see and the newline breaks the output unexpectedly.'],
        ['3–4', '`repr` dan `!r` menunjukkan setiap aksara: `\'  Aina\\n\'`, 7 aksara.', '`repr` and `!r` show every character: `\'  Aina\\n\'`, 7 characters.'],
        ['5–6', '`.strip()` membuang ruang dan baris baharu di kedua-dua hujung; 4 aksara tinggal.', '`.strip()` removes spaces and newlines at both ends; 4 characters remain.'])),
    S('performance',
      P('Membina string panjang dengan `+` berulang kali mencipta banyak objek perantaraan; untuk banyak bahagian, `"".join(senarai)` lebih cekap (PY113). Bagi output, setiap panggilan `print` yang menulis ke terminal agak perlahan berbanding pengiraan; program yang mencetak jutaan baris lebih pantas jika ia membina teks dahulu dan mencetaknya sekali, atau menulis ke fail. Untuk program PY101, kejelasan lebih penting.',
        'Building a long string with repeated `+` creates many intermediate objects; for many pieces, `"".join(list)` is more efficient (PY113). For output, each `print` call that writes to the terminal is slow compared with calculation; a program that prints millions of lines is faster if it builds the text first and prints it once, or writes to a file. For PY101 programs, clarity matters more.')),
    S('software_engineering',
      P('Komen yang baik menerangkan **mengapa**. Bandingkan komen yang hanya mengulang kod dengan komen dan docstring yang menambah maklumat sebenar:', 'Good comments explain **why**. Compare comments that merely repeat the code with comments and a docstring that add real information:'),
      CODE('comments-poor', 'python', 'python', ['Pelaksanaan lemah: komen yang mengulang kod', 'Poor implementation: comments that repeat the code'], `
# set x to 50
x = 50
# multiply x by 0.06
y = x * 0.06
# print y
print(y)
`, '3.0'),
      EXPLAIN('comments-poor',
        ['2–6', 'Setiap komen menyatakan semula baris di bawahnya. Pembaca masih tidak tahu apa itu `x`, `y` atau 0.06, dan jika kod berubah, komen mungkin tidak dikemas kini dan menjadi salah.', 'Each comment restates the line below it. The reader still does not know what `x`, `y` or 0.06 are, and if the code changes, the comments may not be updated and become wrong.']),
      CODE('comments-improved', 'python', 'python', ['Pelaksanaan lebih baik: nama jelas, komen menerangkan sebab', 'Improved implementation: clear names, comments explain why'], `
"""Daily report: service tax for the cafe."""

SERVICE_TAX_RATE = 0.06  # 6% SST on services, set by the government

meal_total = 50.00
service_tax = meal_total * SERVICE_TAX_RATE
print(f"Service tax: RM{service_tax:.2f}")
print(__doc__)
`, 'Service tax: RM3.00\nDaily report: service tax for the cafe.'),
      EXPLAIN('comments-improved',
        ['1', 'Docstring modul: menerangkan tujuan fail; boleh dibaca oleh `help()` dan atribut `__doc__`.', 'A module docstring: states the file’s purpose; readable through `help()` and the `__doc__` attribute.'],
        ['3', 'Komen sebaris menerangkan **asal** nombor 0.06 — maklumat yang tidak boleh diteka daripada kod.', 'The inline comment explains **where** the number 0.06 comes from — information that cannot be guessed from the code.'],
        ['5–7', 'Nama yang jelas menjadikan komen tambahan tidak perlu. F-string memaparkan wang dengan dua tempat perpuluhan.', 'Clear names make extra comments unnecessary. The f-string shows money with two decimal places.'],
        ['8', 'Bukti bahawa docstring disimpan dalam program, tidak seperti komen.', 'Proof that the docstring is kept in the program, unlike a comment.'])),
    S('industry_use_cases',
      UL(
        ['**Peruncitan:** sistem jualan (POS) mencetak resit dengan lajur yang dijajarkan — tepat apa yang dilakukan oleh spesifikasi format f-string.', '**Retail:** point-of-sale systems print receipts with aligned columns — exactly what f-string format specifications do.'],
        ['**Operasi IT:** skrip mencetak log dengan cap masa dan tahap (`INFO`, `ERROR`) dalam format tetap supaya boleh dicari.', '**IT operations:** scripts print logs with timestamps and levels (`INFO`, `ERROR`) in a fixed format so they can be searched.'],
        ['**Kewangan:** laporan memformat jumlah dengan pemisah ribuan dan dua tempat perpuluhan (`{amount:,.2f}`).', '**Finance:** reports format amounts with thousands separators and two decimal places (`{amount:,.2f}`).'],
        ['**Projek sumber terbuka:** docstring dijana menjadi dokumentasi laman web secara automatik (Sphinx, MkDocs).', '**Open-source projects:** docstrings are turned into documentation websites automatically (Sphinx, MkDocs).'],
      )),
    S('practical_demonstration',
      OL(
        ['Ubah `print-basics` supaya tarikh dicetak sebagai `19/11/2025` dengan menukar susunan argumen dan `sep`.', 'Change `print-basics` so the date prints as `19/11/2025` by reordering the arguments and changing `sep`.'],
        ['Dalam `three-formats`, tambah pemisah ribuan: harga 1250.5 dengan `{harga:,.2f}`.', 'In `three-formats`, add a thousands separator: a price of 1250.5 with `{price:,.2f}`.'],
        ['Cetak ASCII art dua baris menggunakan satu `print` dan `\\n`.', 'Print two-line ASCII art using one `print` and `\\n`.'],
        ['Taip `help(print)` dalam shell dan cari argumen `file` dan `flush`.', 'Type `help(print)` in the shell and find the `file` and `flush` arguments.'],
      )),
    S('mini_project',
      P('**Pencetak resit kedai runcit.** Tulis program yang mencetak resit dengan tajuk berbingkai, tiga barang dengan nama dijajar ke kiri dan harga dijajar ke kanan, garis pemisah dan jumlah. Gunakan f-string dengan spesifikasi lebar dan dua tempat perpuluhan.', '**A grocery receipt printer.** Write a program that prints a receipt with a framed title, three items with names aligned left and prices aligned right, a separator line and the total. Use f-strings with width specifications and two decimal places.'),
      CODE('receipt-printer', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
SHOP = "Kedai Runcit Pak Ali"
WIDTH = 30

sugar = 2.85
cooking_oil = 6.70
bread = 3.20
total = sugar + cooking_oil + bread

print(SHOP.center(WIDTH, "*"))
print(f"{'Gula 1kg':<20}RM{sugar:>8.2f}")
print(f"{'Minyak masak':<20}RM{cooking_oil:>8.2f}")
print(f"{'Roti':<20}RM{bread:>8.2f}")
print("-" * WIDTH)
print(f"{'JUMLAH':<20}RM{total:>8.2f}")
print(" Terima kasih! ".center(WIDTH, "-"))
`, '*****Kedai Runcit Pak Ali*****\nGula 1kg            RM    2.85\nMinyak masak        RM    6.70\nRoti                RM    3.20\n------------------------------\nJUMLAH              RM   12.75\n------- Terima kasih! --------'),
      EXPLAIN('receipt-printer',
        ['1–2', 'Nama kedai dan lebar resit sebagai pemalar.', 'The shop name and the receipt width as constants.'],
        ['4–7', 'Tiga harga dan jumlahnya.', 'Three prices and their total.'],
        ['9', '`center(30, "*")` meletakkan tajuk di tengah dan mengisi ruang kosong dengan `*`.', '`center(30, "*")` centres the title and fills the empty space with `*`.'],
        ['10–12', '`:<20` menjajar nama ke kiri dalam 20 aksara; `:>8.2f` menjajar harga ke kanan dalam 8 aksara dengan 2 tempat perpuluhan. Nama dalam petik tunggal kerana f-string menggunakan petik berganda.', '`:<20` left-aligns the name in 20 characters; `:>8.2f` right-aligns the price in 8 characters with 2 decimal places. The names are in single quotes because the f-string uses double quotes.'],
        ['13–14', 'Garis pemisah (`"-" * 30` mengulang aksara) dan baris jumlah dengan format yang sama.', 'A separator line (`"-" * 30` repeats the character) and the total line with the same format.'],
        ['15', 'Mesej penutup di tengah, diisi dengan sengkang. Apabila ruang yang tinggal ganjil, `center` meletakkan aksara isi tambahan di sebelah kanan.', 'A closing message centred and filled with hyphens. When the remaining space is odd, `center` puts the extra fill character on the right.'])),
    S('summary',
      UL(
        ['`print()` menukar argumen kepada teks, memisahkannya dengan `sep` dan menamatkan dengan `end`.', '`print()` converts its arguments to text, separates them with `sep` and ends with `end`.'],
        ['Literal string: `\'…\'`, `"…"`, `"""…"""`; escape sequence bermula dengan `\\`; raw string `r"…"` mematikannya.', 'String literals: `\'…\'`, `"…"`, `"""…"""`; escape sequences start with `\\`; raw strings `r"…"` turn them off.'],
        ['F-string `f"{nilai:format}"` ialah cara moden untuk menggabungkan teks dan nilai.', 'The f-string `f"{value:format}"` is the modern way to combine text and values.'],
        ['`repr()` atau `!r` menunjukkan aksara tersembunyi semasa debugging.', '`repr()` or `!r` shows hidden characters while debugging.'],
        ['Komen menerangkan sebab; docstring mendokumentasikan modul dan fungsi.', 'Comments explain reasons; docstrings document modules and functions.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah output `print("a", "b", "c", sep="")`?', 'What is the output of `print("a", "b", "c", sep="")`?'],
        ['Mengapakah `"C:\\Users\\Aina"` menyebabkan ralat sintaks, dan berikan dua pembetulan.', 'Why does `"C:\\Users\\Aina"` cause a syntax error? Give two fixes.'],
        ['Tulis f-string yang memaparkan `harga = 7.5` sebagai `RM7.50`.', 'Write an f-string that displays `price = 7.5` as `RM7.50`.'],
        ['Apakah perbezaan antara komen `#` dan docstring?', 'What is the difference between a `#` comment and a docstring?'],
        ['Bilakah anda menggunakan `repr()` dan bukan `print()` biasa?', 'When would you use `repr()` instead of a plain `print()`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Python built-in functions — print()', url: `${PYDOCS}/library/functions.html#print` },
        { title: 'Python Language Reference — String and bytes literals', url: `${PYDOCS}/reference/lexical_analysis.html#string-and-bytes-literals` },
        { title: 'Python Language Reference — f-strings', url: `${PYDOCS}/reference/lexical_analysis.html#f-strings` },
        { title: 'Format Specification Mini-Language', url: `${PYDOCS}/library/string.html#format-specification-mini-language` },
        { title: 'Python tutorial — Input and Output', url: `${PYDOCS}/tutorial/inputoutput.html` },
        { title: 'PEP 8 — Comments', url: 'https://peps.python.org/pep-0008/#comments' },
      )),
  ],
};

// ─── 3.2 input() and user interaction ─────────────────────────────────────

export const PY101_3_2: LectureContentDef = {
  courseCode: 'PY101',
  module: 3,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Membaca input pengguna dengan [[input-function|`input()`]] dan menerangkan mengapa hasilnya sentiasa `str`.', 'Read user input with [[input-function|`input()`]] and explain why its result is always a `str`.'],
        ['Menukar input kepada nombor dengan `int()` dan `float()`, dan mengenal pasti `ValueError` apabila penukaran gagal.', 'Convert input to numbers with `int()` and `float()`, and recognise `ValueError` when conversion fails.'],
        ['Membersihkan input teks dengan `strip()`, `title()`, `upper()` dan memecahkan satu baris kepada beberapa nilai dengan `split()`.', 'Clean text input with `strip()`, `title()`, `upper()` and split one line into several values with `split()`.'],
        ['Mereka bentuk interaksi yang jelas: prompt dengan unit, output yang mengesahkan input.', 'Design clear interaction: prompts with units, output that confirms the input.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1: `print()`, string dan f-string.', 'Lecture 3.1: `print()`, strings and f-strings.'],
        ['Kuliah 1.1: model IPO — kuliah ini menambah input sebenar daripada pengguna.', 'Lecture 1.1: the IPO model — this lecture adds real input from the user.'],
      )),
    S('introduction',
      P('Sehingga kini, data program ditulis terus dalam kod. Program sebenar perlu bertanya: berapakah berat anda, berapa orang yang berkongsi bil, apakah kod kursus anda? Fungsi `input()` menjadikan program **interaktif**: ia memaparkan soalan, berhenti, menunggu pengguna menaip dan menekan Enter, kemudian memberikan jawapan itu kepada program. Satu peraturan penting perlu diingati sejak awal: apa sahaja yang ditaip — walaupun `17` — tiba sebagai **teks**.',
        'Until now, a program’s data has been written directly in the code. Real programs need to ask: what is your weight, how many people are sharing the bill, what is your course code? The `input()` function makes a program **interactive**: it shows a question, stops, waits for the user to type and press Enter, then gives that answer to the program. One important rule must be remembered from the start: whatever is typed — even `17` — arrives as **text**.'),
      KEY('`input()` sentiasa memulangkan `str`. Tukar dengan `int()` atau `float()` sebelum mengira.', '`input()` always returns a `str`. Convert with `int()` or `float()` before calculating.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**[[input-function|`input(prompt)`]]:** menulis prompt ke output, membaca satu baris daripada [[standard-input|input standard]], membuang baris baharu di hujung dan memulangkan `str`.', '**[[input-function|`input(prompt)`]]:** writes the prompt to output, reads one line from [[standard-input|standard input]], removes the trailing newline and returns a `str`.'],
        ['**Penukaran jenis:** `int("17")` → 17, `float("1.60")` → 1.6, `str(42)` → `"42"`.', '**Type conversion:** `int("17")` → 17, `float("1.60")` → 1.6, `str(42)` → `"42"`.'],
        ['**`ValueError`:** penukaran gagal apabila teks bukan nombor yang sah, contohnya `int("tujuh belas")`.', '**`ValueError`:** conversion fails when the text is not a valid number, for example `int("seventeen")`.'],
        ['**Pembersihan:** `strip()` membuang ruang di hujung; `title()`, `upper()`, `lower()` menukar huruf besar/kecil.', '**Cleaning:** `strip()` removes surrounding spaces; `title()`, `upper()`, `lower()` change letter case.'],
        ['**`split()`:** memecahkan satu baris kepada senarai perkataan, contohnya `"4 2.5".split()` → `["4", "2.5"]`.', '**`split()`:** breaks one line into a list of words, for example `"4 2.5".split()` → `["4", "2.5"]`.'],
      )),
    S('detailed_theory',
      P('Apabila `input("Umur: ")` dijalankan, Python menulis `Umur: ` ke output standard **tanpa** baris baharu, supaya kursor berada di sebelah prompt. Kemudian program **disekat** (blocked): tiada baris seterusnya dijalankan sehingga satu baris lengkap tiba daripada input standard — iaitu sehingga pengguna menekan Enter. Python membuang aksara baris baharu dan memulangkan selebihnya sebagai string. Jika input standard sudah tamat (pengguna menekan Ctrl+D/Ctrl+Z, atau input disalurkan daripada fail yang kehabisan baris), `input()` menimbulkan `EOFError`. Dalam terminal, teks yang ditaip oleh pengguna kelihatan kerana **terminal** memaparkannya semula, bukan kerana program mencetaknya; inilah sebabnya output yang disahkan dalam bahan ini (yang menggunakan input tetap, bukan papan kekunci) menunjukkan prompt bersebelahan tanpa jawapan.',
        'When `input("Age: ")` runs, Python writes `Age: ` to standard output **without** a newline, so the cursor sits next to the prompt. Then the program is **blocked**: no further line runs until one complete line arrives from standard input — that is, until the user presses Enter. Python removes the newline character and returns the rest as a string. If standard input has already ended (the user pressed Ctrl+D/Ctrl+Z, or input is piped from a file that ran out of lines), `input()` raises `EOFError`. In a terminal, the text the user types is visible because the **terminal** echoes it, not because the program prints it; that is why the verified output in these materials (which uses fixed input, not a keyboard) shows the prompts side by side without the answers.'),
      P('Kerana `input()` tidak tahu apa yang anda harapkan, ia tidak boleh meneka bahawa `17` ialah nombor. Penukaran adalah tanggungjawab program. `int(teks)` menerima digit dengan tanda pilihan dan ruang di hujung (`" 17 "` → 17) tetapi menolak perpuluhan (`int("1.5")` ialah `ValueError`); `float(teks)` menerima perpuluhan dan notasi saintifik. Jika anda terlupa menukar, ralat muncul kemudian, di tempat teks digunakan seperti nombor: `"55" / 2.56` memberi `TypeError`, dan lebih berbahaya lagi, `"3" * 2` **tidak** gagal — ia memberi `"33"`. Input pengguna juga tidak boleh dipercayai: pengguna menaip ruang tambahan, huruf besar yang tidak konsisten, atau perkataan dan bukan nombor. Program yang baik membersihkan input, memberi prompt yang menyatakan format dan unit, dan (dalam PY103 dan PY114) menyemak serta mengendalikan input yang tidak sah.',
        'Because `input()` does not know what you expect, it cannot guess that `17` is a number. Conversion is the program’s responsibility. `int(text)` accepts digits with an optional sign and surrounding spaces (`" 17 "` → 17) but rejects decimals (`int("1.5")` is a `ValueError`); `float(text)` accepts decimals and scientific notation. If you forget to convert, the error appears later, where the text is used like a number: `"55" / 2.56` gives a `TypeError`, and more dangerously, `"3" * 2` does **not** fail — it gives `"33"`. User input also cannot be trusted: users type extra spaces, inconsistent capitals, or words instead of numbers. A good program cleans its input, gives prompts that state the format and unit, and (in PY103 and PY114) checks and handles invalid input.')),
    S('technical_terminology', TERMS('input-function', 'standard-input', 'string-literal', 'exception')),
    S('syntax_rules',
      UL(
        ['`teks = input("Soalan: ")` — prompt pilihan; akhiri dengan ruang supaya jawapan tidak melekat pada prompt.', '`text = input("Question: ")` — the prompt is optional; end it with a space so the answer does not stick to the prompt.'],
        ['`nombor = int(input("Kuantiti: "))` — panggilan bersarang: `input` dahulu, kemudian `int`.', '`number = int(input("Quantity: "))` — nested calls: `input` first, then `int`.'],
        ['`nama = input("Nama: ").strip().title()` — kaedah string dirantai dari kiri ke kanan.', '`name = input("Name: ").strip().title()` — string methods are chained from left to right.'],
        ['`a, b = input().split()` — dua nilai daripada satu baris; bilangan nama mesti sama dengan bilangan perkataan.', '`a, b = input().split()` — two values from one line; the number of names must match the number of words.'],
      )),
    S('code_demonstration',
      CODE('input-is-text', 'python', 'python', ['input() memulangkan teks', 'input() returns text'], `
age_text = input("Age: ")
print("You typed:", age_text)
print("Type:", type(age_text).__name__)
print("Text times 2:", age_text * 2)
age = int(age_text)
print("Next year you will be", age + 1)
`, 'Age: You typed: 17\nType: str\nText times 2: 1717\nNext year you will be 18', { input: '17' }),
      EXPLAIN('input-is-text',
        ['1', 'Prompt `Age: ` dipaparkan; pengguna menaip `17` dan menekan Enter; `age_text` menjadi string `"17"`.', 'The prompt `Age: ` is shown; the user types `17` and presses Enter; `age_text` becomes the string `"17"`.'],
        ['2–3', 'Bukti: jenisnya `str`, bukan nombor.', 'Proof: its type is `str`, not a number.'],
        ['4', 'Bahaya senyap: `"17" * 2` mengulang teks — `1717` — tanpa sebarang ralat.', 'A silent danger: `"17" * 2` repeats the text — `1717` — without any error.'],
        ['5–6', 'Selepas `int()`, `age` ialah integer 17 dan aritmetik berfungsi.', 'After `int()`, `age` is the integer 17 and arithmetic works.'])),
    S('complete_examples',
      CODE('bmi-calculator', 'python', 'python', ['Kalkulator BMI dengan input berangka', 'A BMI calculator with numeric input'], `
weight = float(input("Weight (kg): "))
height = float(input("Height (m): "))
bmi = weight / height ** 2
print(f"BMI: {bmi:.1f}")
`, 'Weight (kg): Height (m): BMI: 21.5', {
        input: '55\n1.60',
        debug: BUG(`
weight = input("Weight (kg): ")
height = float(input("Height (m): "))
bmi = weight / height ** 2
print(f"BMI: {bmi:.1f}")
`, "example.py:3: TypeError: unsupported operand type(s) for /: 'str' and 'float'",
          '`float()` tertinggal pada baris 1, jadi `weight` ialah string `"55"`. Kedua-dua input berjaya dibaca — ralat hanya muncul pada baris 3, apabila Python cuba membahagi teks dengan nombor. Mesej menamakan kedua-dua jenis: `\'str\'` dan `\'float\'`. Tukar setiap input berangka **sebaik sahaja** ia dibaca.',
          '`float()` is missing on line 1, so `weight` is the string `"55"`. Both inputs are read successfully — the error only appears on line 3, when Python tries to divide text by a number. The message names both types: `\'str\'` and `\'float\'`. Convert every numeric input **as soon as** it is read.'),
      }),
      EXPLAIN('bmi-calculator',
        ['1–2', 'Setiap input ditukar kepada `float` serta-merta. Prompt menyatakan unit (kg, m) supaya pengguna tidak menaip 160 untuk ketinggian.', 'Each input is converted to `float` immediately. The prompts state the units (kg, m) so the user does not type 160 for the height.'],
        ['3', 'BMI = berat ÷ tinggi²: `**` (kuasa) dikira sebelum `/`, jadi tiada kurungan diperlukan. 55 ÷ 2.56 = 21.484375.', 'BMI = weight ÷ height²: `**` (power) is evaluated before `/`, so no parentheses are needed. 55 ÷ 2.56 = 21.484375.'],
        ['4', '`:.1f` membundarkan kepada satu tempat perpuluhan untuk paparan: 21.5.', '`:.1f` rounds to one decimal place for display: 21.5.']),
      CODE('clean-input', 'python', 'python', ['Membersihkan input teks', 'Cleaning text input'], `
raw_name = input("Full name: ")
raw_course = input("Course code: ")
name = raw_name.strip().title()
course = raw_course.strip().upper()
print(f"Registered: {name} ({course})")
print(f"Raw input was {raw_name!r}")
`, "Full name: Course code: Registered: Nur Aisyah Binti Ahmad (PY101)\nRaw input was '   nur aisyah binti ahmad  '", {
        input: '   nur aisyah binti ahmad  \n py101 ',
        debug: BUG(`
raw_name = input("Full name: ")
name = raw_name.strip.title()
print(name)
`, "example.py:2: AttributeError: 'builtin_function_or_method' object has no attribute 'title'",
          'Kurungan `()` selepas `strip` tertinggal. Tanpa kurungan, `raw_name.strip` ialah **fungsi itu sendiri**, bukan hasil panggilannya, dan fungsi tidak mempunyai kaedah `title`. Mesej ralat menyebut jenis objek yang salah (`builtin_function_or_method`) — petunjuk jelas bahawa sesuatu fungsi tidak dipanggil.',
          'The parentheses `()` after `strip` are missing. Without them, `raw_name.strip` is **the function itself**, not the result of calling it, and a function has no `title` method. The error message names the wrong object type (`builtin_function_or_method`) — a clear sign that a function was not called.'),
      }),
      EXPLAIN('clean-input',
        ['1–2', 'Input mentah: pengguna menaip ruang tambahan dan huruf kecil.', 'Raw input: the user typed extra spaces and lower case.'],
        ['3', '`strip()` membuang ruang di kedua-dua hujung, kemudian `title()` menjadikan huruf pertama setiap perkataan besar.', '`strip()` removes spaces at both ends, then `title()` capitalises the first letter of each word.'],
        ['4', 'Kod kursus dinormalkan kepada huruf besar.', 'The course code is normalised to upper case.'],
        ['5–6', 'Output yang kemas, dan input mentah dengan `!r` untuk menunjukkan ruang tersembunyi.', 'Tidy output, and the raw input with `!r` to show the hidden spaces.'])),
    S('line_by_line',
      EXPLAIN('bmi-calculator',
        ['1', 'Susunan penilaian: (1) `input` memaparkan prompt dan memulangkan `"55"`; (2) `float("55")` memulangkan 55.0; (3) nama `weight` diikat kepada 55.0. Panggilan paling dalam berlaku dahulu.', 'Evaluation order: (1) `input` shows the prompt and returns `"55"`; (2) `float("55")` returns 55.0; (3) the name `weight` is bound to 55.0. The innermost call happens first.']),
      EXPLAIN('clean-input',
        ['3', '`raw_name.strip()` memulangkan string **baharu** `"nur aisyah binti ahmad"`; `.title()` dipanggil pada string baharu itu. `raw_name` sendiri tidak berubah kerana string tidak boleh diubah.', '`raw_name.strip()` returns a **new** string `"nur aisyah binti ahmad"`; `.title()` is called on that new string. `raw_name` itself is unchanged because strings are immutable.'])),
    S('why_this_way',
      P('Mengapa `input()` tidak menukar nombor secara automatik? Kerana ia tidak boleh tahu niat anda: `"007"` mungkin kod ejen (teks) atau nombor 7; `"1e3"` mungkin kod produk atau 1000.0; nombor telefon `"0123456789"` akan kehilangan sifar di hadapan jika ditukar kepada integer. Dengan memulangkan teks yang tepat, Python membiarkan program memutuskan — dan menjadikan penukaran **eksplisit** dalam kod, di mana pembaca boleh melihatnya. Ini mengikut prinsip Zen "Explicit is better than implicit".',
        'Why does `input()` not convert numbers automatically? Because it cannot know your intention: `"007"` might be an agent code (text) or the number 7; `"1e3"` might be a product code or 1000.0; the phone number `"0123456789"` would lose its leading zero if converted to an integer. By returning the exact text, Python lets the program decide — and makes the conversion **explicit** in the code, where readers can see it. This follows the Zen principle "Explicit is better than implicit".')),
    S('execution_flow',
      OL(
        ['Baris 1 `bmi-calculator`: prompt `Weight (kg): ` ditulis; program berhenti dan menunggu.', 'Line 1 of `bmi-calculator`: the prompt `Weight (kg): ` is written; the program stops and waits.'],
        ['Pengguna menaip `55` dan menekan Enter; `input` memulangkan `"55"`, `float` menukarnya, nama `weight` diikat.', 'The user types `55` and presses Enter; `input` returns `"55"`, `float` converts it, the name `weight` is bound.'],
        ['Baris 2 mengulang proses untuk ketinggian.', 'Line 2 repeats the process for the height.'],
        ['Baris 3–4 mengira dan mencetak tanpa berhenti lagi.', 'Lines 3–4 calculate and print without stopping again.'],
        ['Jika teks tidak boleh ditukar (contohnya `lima puluh`), `float` menimbulkan `ValueError` pada baris 1 dan program tamat dengan traceback.', 'If the text cannot be converted (for example `fifty`), `float` raises `ValueError` on line 1 and the program ends with a traceback.'],
      )),
    S('memory_behaviour',
      P('Setiap panggilan `input()` mencipta objek string baharu daripada baris yang dibaca. `int(teks)` dan `float(teks)` mencipta objek nombor baharu; string asal kekal tidak berubah dan dibebaskan secara automatik apabila tiada nama yang merujuk kepadanya lagi. Dalam `bmi-calculator`, string `"55"` tidak pernah disimpan dalam pemboleh ubah — ia wujud seketika antara `input` dan `float`. Input standard sendiri ialah aliran (stream) yang dibaca baris demi baris; setiap `input()` menggunakan satu baris, dan baris itu tidak boleh dibaca semula.',
        'Each `input()` call creates a new string object from the line read. `int(text)` and `float(text)` create new number objects; the original string stays unchanged and is freed automatically when no name refers to it any more. In `bmi-calculator`, the string `"55"` is never stored in a variable — it exists only for a moment between `input` and `float`. Standard input itself is a stream read line by line; each `input()` consumes one line, and that line cannot be read again.')),
    S('alternative_implementations',
      P('Daripada bertanya dua soalan, program boleh menerima beberapa nilai pada satu baris dan memecahkannya dengan `split()`:', 'Instead of asking two questions, a program can accept several values on one line and split them with `split()`:'),
      CODE('one-line-input', 'python', 'python', ['Dua nilai daripada satu baris', 'Two values from one line'], `
line = input("Length and width (e.g. 4 2.5): ")
length_text, width_text = line.split()
length = float(length_text)
width = float(width_text)
print("Area:", length * width)
`, 'Length and width (e.g. 4 2.5): Area: 10.0', { input: '4 2.5' }),
      EXPLAIN('one-line-input',
        ['1', 'Prompt memberi contoh format — pengguna tahu nilai dipisahkan oleh ruang.', 'The prompt gives an example of the format — the user knows the values are separated by a space.'],
        ['2', '`split()` memecahkan pada ruang: `["4", "2.5"]`. Dua nama menerima dua perkataan. Jika pengguna menaip tiga nilai, `ValueError: too many values to unpack` berlaku.', '`split()` breaks on whitespace: `["4", "2.5"]`. Two names receive the two words. If the user types three values, `ValueError: too many values to unpack` occurs.'],
        ['3–5', 'Setiap bahagian ditukar, kemudian keluasan dikira.', 'Each part is converted, then the area is calculated.'])),
    S('common_mistakes',
      UL(
        ['Mengira dengan input tanpa menukar — `TypeError`, atau lebih teruk, `"3" * 2 == "33"`.', 'Calculating with input without converting — `TypeError`, or worse, `"3" * 2 == "33"`.'],
        ['Menggunakan `int()` untuk nilai perpuluhan seperti harga atau ketinggian — `ValueError` untuk `"1.60"`.', 'Using `int()` for decimal values such as prices or heights — `ValueError` for `"1.60"`.'],
        ['Prompt tanpa ruang di hujung (`"Nama:"`), jadi jawapan melekat: `Nama:Aina`.', 'A prompt without a trailing space (`"Name:"`), so the answer sticks to it: `Name:Aina`.'],
        ['Prompt yang tidak menyatakan unit atau format — pengguna menaip 160 cm apabila program menjangka 1.60 m.', 'Prompts that do not state the unit or format — the user types 160 cm when the program expects 1.60 m.'],
        ['Terlupa kurungan pada kaedah (`.strip` dan bukan `.strip()`).', 'Forgetting the parentheses on a method (`.strip` instead of `.strip()`).'],
      )),
    S('debugging',
      P('Apabila program interaktif gagal, kenal pasti **input yang diberikan** dan **baris tempat ia gagal**. `ValueError: invalid literal for int()` bermaksud teks bukan nombor bulat — cetak teks itu dengan `!r` untuk melihat apa yang sebenarnya diterima. `EOFError: EOF when reading a line` bermaksud program meminta lebih banyak baris daripada yang tersedia — biasa apabila input datang daripada fail atau ujian automatik, dan apabila program bertanya lebih banyak soalan daripada yang dijangka. Contoh di bawah membaca dua nombor; versi berpepijatnya bertanya soalan ketiga yang tidak dijawab.',
        'When an interactive program fails, identify **the input that was given** and **the line where it failed**. `ValueError: invalid literal for int()` means the text was not a whole number — print that text with `!r` to see what was really received. `EOFError: EOF when reading a line` means the program asked for more lines than were available — common when input comes from a file or an automatic test, and when a program asks more questions than expected. The example below reads two numbers; its buggy version asks a third question that is never answered.'),
      CODE('two-questions', 'python', 'python', ['Bilangan soalan mesti sepadan dengan input', 'The number of questions must match the input'], `
first = input("First number: ")
second = input("Second number: ")
print("Sum:", int(first) + int(second))
`, 'First number: Second number: Sum: 42', {
        input: '12\n30',
        debug: BUG(`
first = input("First number: ")
second = input("Second number: ")
third = input("Third number: ")
print("Sum:", int(first) + int(second) + int(third))
`, 'example.py:3: EOFError: EOF when reading a line',
          'Input ujian hanya mengandungi dua baris (`12` dan `30`). Baris 3 meminta baris ketiga, tetapi input standard sudah tamat, jadi `input()` menimbulkan `EOFError`. Dalam terminal, program hanya akan menunggu; dalam ujian automatik atau apabila input disalurkan daripada fail, ia gagal. Pastikan bilangan `input()` sepadan dengan data yang dijangka.',
          'The test input contains only two lines (`12` and `30`). Line 3 asks for a third line, but standard input has already ended, so `input()` raises `EOFError`. In a terminal the program would simply wait; in an automatic test or when input is piped from a file, it fails. Make sure the number of `input()` calls matches the expected data.'),
      }),
      EXPLAIN('two-questions',
        ['1–2', 'Dua input dibaca sebagai teks.', 'Two inputs are read as text.'],
        ['3', 'Kedua-dua teks ditukar dan dijumlahkan: 12 + 30 = 42. Tanpa `int()`, `+` akan mencantumkan teks: `"1230"`.', 'Both texts are converted and added: 12 + 30 = 42. Without `int()`, `+` would join the text: `"1230"`.'])),
    S('performance',
      P('Program interaktif menghabiskan hampir semua masanya **menunggu manusia** — beberapa saat bagi setiap soalan, berbanding mikrosaat untuk pengiraan. Oleh itu, prestasi program interaktif diukur dengan bilangan soalan dan kejelasannya, bukan kelajuan CPU. Bagi input yang besar (contohnya 100,000 baris daripada fail), `input()` berulang adalah perlahan; `sys.stdin.read()` atau membaca fail secara terus (PY114) jauh lebih cekap.',
        'An interactive program spends almost all its time **waiting for a person** — seconds per question, compared with microseconds for calculation. So the performance of an interactive program is measured by the number and clarity of its questions, not CPU speed. For large input (for example 100,000 lines from a file), repeated `input()` is slow; `sys.stdin.read()` or reading the file directly (PY114) is much more efficient.')),
    S('software_engineering',
      P('Interaksi yang baik bermula dengan prompt yang baik. Kedua-dua program ini mengira perkara yang sama:', 'Good interaction starts with good prompts. Both programs calculate the same thing:'),
      CODE('prompts-poor', 'python', 'python', ['Pelaksanaan lemah: tiada prompt, output tanpa konteks', 'Poor implementation: no prompts, output without context'], `
a = input()
b = input()
print(float(a) * float(b))
`, '7.5', { input: '3\n2.50' }),
      EXPLAIN('prompts-poor',
        ['1–3', 'Pengguna melihat kursor berkelip tanpa soalan, dan output `7.5` tanpa label atau unit. Nama `a` dan `b` tidak menerangkan apa-apa.', 'The user sees a blinking cursor with no question, and the output `7.5` has no label or unit. The names `a` and `b` explain nothing.']),
      CODE('prompts-improved', 'python', 'python', ['Pelaksanaan lebih baik: prompt jelas dan output yang mengesahkan', 'Improved implementation: clear prompts and confirming output'], `
quantity = int(input("How many cups of teh tarik? "))
unit_price = float(input("Price per cup (RM): "))
total = quantity * unit_price
print(f"{quantity} cups x RM{unit_price:.2f} = RM{total:.2f}")
`, 'How many cups of teh tarik? Price per cup (RM): 3 cups x RM2.50 = RM7.50', { input: '3\n2.50' }),
      EXPLAIN('prompts-improved',
        ['1–2', 'Setiap prompt bertanya satu soalan yang jelas dan menyatakan unit. `int` untuk kiraan, `float` untuk wang.', 'Each prompt asks one clear question and states the unit. `int` for a count, `float` for money.'],
        ['3–4', 'Output mengulang input yang diterima — pengguna boleh mengesahkan bahawa program memahami mereka.', 'The output repeats the input received — the user can confirm the program understood them.'])),
    S('industry_use_cases',
      UL(
        ['**Alat baris arahan:** pemasang perisian bertanya "Continue? [y/N]" dan membersihkan jawapan dengan `strip().lower()`.', '**Command-line tools:** software installers ask "Continue? [y/N]" and clean the answer with `strip().lower()`.'],
        ['**Kiosk dan terminal layan diri:** mesin tiket meletak kenderaan membaca input, menukar dan mengesahkannya sebelum mengira bayaran.', '**Kiosks and self-service terminals:** parking ticket machines read input, convert and confirm it before calculating payment.'],
        ['**Pertandingan pengaturcaraan dan penilaian automatik:** program membaca input standard dalam format tepat — sama seperti contoh yang disahkan dalam bahan ini.', '**Programming contests and auto-graders:** programs read standard input in an exact format — just like the verified examples in these materials.'],
        ['**Borang web:** konsep yang sama — semua medan borang tiba sebagai teks dan mesti ditukar serta disahkan di pelayan.', '**Web forms:** the same concept — every form field arrives as text and must be converted and validated on the server.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `input-is-text` dan masukkan `017`. Apakah yang dicetak oleh baris 4 dan baris 6?', 'Run `input-is-text` and enter `017`. What do lines 4 and 6 print?'],
        ['Jalankan `bmi-calculator` dan masukkan `160` untuk ketinggian. Terangkan hasilnya dan tambah petunjuk format pada prompt.', 'Run `bmi-calculator` and enter `160` for the height. Explain the result and add a format hint to the prompt.'],
        ['Jalankan `one-line-input` dan masukkan tiga nombor. Baca mesej ralat.', 'Run `one-line-input` and enter three numbers. Read the error message.'],
        ['Masukkan `tujuh` dalam `prompts-improved` dan kenal pasti jenis exception dan barisnya.', 'Enter `seven` in `prompts-improved` and identify the exception type and its line.'],
      )),
    S('mini_project',
      P('**Pembahagi bil restoran.** Tulis program yang bertanya jumlah bil dan bilangan orang, menambah caj perkhidmatan 10%, dan memaparkan caj perkhidmatan, jumlah besar dan bahagian setiap orang, semuanya dengan dua tempat perpuluhan dan label yang dijajarkan.', '**A restaurant bill splitter.** Write a program that asks for the bill total and the number of people, adds a 10% service charge, and displays the service charge, the grand total and each person’s share, all with two decimal places and aligned labels.'),
      CODE('bill-splitter', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
SERVICE_CHARGE_RATE = 0.10

bill = float(input("Bill total (RM): "))
people = int(input("Number of people: "))

service_charge = bill * SERVICE_CHARGE_RATE
grand_total = bill + service_charge
share = grand_total / people

print(f"Service charge: RM{service_charge:.2f}")
print(f"Grand total:    RM{grand_total:.2f}")
print(f"Each person:    RM{share:.2f}")
`, 'Bill total (RM): Number of people: Service charge: RM8.64\nGrand total:    RM95.04\nEach person:    RM23.76', { input: '86.40\n4' }),
      EXPLAIN('bill-splitter',
        ['1', 'Kadar caj perkhidmatan sebagai pemalar.', 'The service-charge rate as a constant.'],
        ['3–4', 'Input: wang sebagai `float`, bilangan orang sebagai `int`.', 'Input: money as a `float`, the number of people as an `int`.'],
        ['6–8', 'Proses: 86.40 × 0.10 = 8.64; 86.40 + 8.64 = 95.04; 95.04 ÷ 4 = 23.76.', 'Process: 86.40 × 0.10 = 8.64; 86.40 + 8.64 = 95.04; 95.04 ÷ 4 = 23.76.'],
        ['10–12', 'Output: label dijajarkan dengan ruang supaya nilai bermula pada lajur yang sama; `:.2f` untuk wang.', 'Output: labels are padded with spaces so the values start in the same column; `:.2f` for money.'])),
    S('summary',
      UL(
        ['`input(prompt)` memaparkan prompt, menunggu Enter dan memulangkan satu baris sebagai `str`.', '`input(prompt)` shows the prompt, waits for Enter and returns one line as a `str`.'],
        ['Tukar dengan `int()`/`float()` serta-merta; teks yang tidak sah menimbulkan `ValueError`.', 'Convert with `int()`/`float()` immediately; invalid text raises `ValueError`.'],
        ['Bersihkan input dengan `strip()` dan normalkan huruf dengan `title()`, `upper()`, `lower()`.', 'Clean input with `strip()` and normalise case with `title()`, `upper()`, `lower()`.'],
        ['`EOFError` bermaksud tiada lagi baris input.', '`EOFError` means there are no more input lines.'],
        ['Prompt yang baik menyatakan soalan, unit dan format; output yang baik mengesahkan input.', 'Good prompts state the question, unit and format; good output confirms the input.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah jenis `input()` apabila pengguna menaip `3.5`?', 'What type does `input()` return when the user types `3.5`?'],
        ['Apakah output `x = input()` diikuti `print(x * 3)` jika pengguna menaip `4`?', 'What is the output of `x = input()` followed by `print(x * 3)` if the user types `4`?'],
        ['Mengapakah `int("1.60")` gagal tetapi `float("1.60")` berjaya?', 'Why does `int("1.60")` fail but `float("1.60")` succeed?'],
        ['Bilakah `EOFError` berlaku?', 'When does `EOFError` occur?'],
        ['Tulis semula prompt `"h"` supaya ia jelas untuk ketinggian dalam meter.', 'Rewrite the prompt `"h"` so it is clear for a height in metres.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Python built-in functions — input()', url: `${PYDOCS}/library/functions.html#input` },
        { title: 'Python built-in functions — int() and float()', url: `${PYDOCS}/library/functions.html#int` },
        { title: 'String methods (strip, title, upper, split)', url: `${PYDOCS}/library/stdtypes.html#string-methods` },
        { title: 'Built-in Exceptions — ValueError, EOFError', url: `${PYDOCS}/library/exceptions.html#ValueError` },
        { title: 'Automate the Boring Stuff with Python — Python Basics', url: `${ATBS}/chapter1.html` },
      )),
  ],
};

// ─── 3.3 Program structure: sequences of statements ───────────────────────

export const PY101_3_3: LectureContentDef = {
  courseCode: 'PY101',
  module: 3,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan program sebagai urutan [[statement|pernyataan]] yang dilaksanakan dari atas ke bawah, dan membezakan pernyataan daripada ungkapan.', 'Explain a program as a sequence of [[statement|statements]] executed from top to bottom, and distinguish statements from expressions.'],
        ['Meramalkan kesan susunan pernyataan terhadap keadaan dan output program.', 'Predict how the order of statements affects a program’s state and output.'],
        ['Menggunakan peraturan baris Python: satu pernyataan setiap baris, sambungan baris tersirat dalam kurungan, dan [[indentation|inden]] yang betul.', 'Apply Python’s line rules: one statement per line, implicit line continuation inside brackets, and correct [[indentation|indentation]].'],
        ['Menyusun skrip dalam bahagian yang jelas: docstring, import, pemalar, input, proses, output.', 'Organise a script into clear sections: docstring, imports, constants, input, process, output.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1 dan 3.2: `print()`, f-string dan `input()`.', 'Lectures 3.1 and 3.2: `print()`, f-strings and `input()`.'],
        ['Kuliah 1.1: keadaan program dan menjejak nilai.', 'Lecture 1.1: program state and tracing values.'],
      )),
    S('introduction',
      P('Program yang paling ringkas ialah **urutan**: lakukan langkah 1, kemudian langkah 2, kemudian langkah 3. Bunyinya jelas, tetapi banyak pepijat pemula datang daripada susunan yang salah — menggunakan nilai sebelum ia dikira, atau mengemas kini nilai selepas ia sudah dicetak. Kuliah ini mengkaji struktur program Python dengan teliti: apa itu pernyataan, bagaimana Python membaca baris, bagaimana pernyataan panjang dipecahkan, dan bagaimana menyusun skrip supaya mudah dibaca. Urutan ialah asas bagi dua struktur kawalan lain yang akan anda pelajari dalam PY103: pemilihan (`if`) dan ulangan (gelung).',
        'The simplest program is a **sequence**: do step 1, then step 2, then step 3. That sounds obvious, but many beginner bugs come from the wrong order — using a value before it is calculated, or updating a value after it has already been printed. This lecture examines the structure of Python programs carefully: what a statement is, how Python reads lines, how long statements are broken up, and how to organise a script so it is easy to read. Sequence is the foundation of the two other control structures you will learn in PY103: selection (`if`) and repetition (loops).'),
      KEY('Susunan ialah makna: pernyataan yang sama dalam susunan berbeza ialah program berbeza.', 'Order is meaning: the same statements in a different order are a different program.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**[[statement|Pernyataan]]:** satu arahan lengkap — assignment, panggilan fungsi, `import`, `if`, `def`.', '**[[statement|Statement]]:** one complete instruction — an assignment, a function call, `import`, `if`, `def`.'],
        ['**Ungkapan (expression):** sesuatu yang menghasilkan nilai — `3 + 4`, `price * qty`, `input("?")`.', '**Expression:** something that produces a value — `3 + 4`, `price * qty`, `input("?")`.'],
        ['**[[control-flow|Aliran kawalan]] berurutan:** pernyataan dijalankan dari atas ke bawah, satu demi satu, kecuali struktur kawalan mengubahnya.', '**Sequential [[control-flow|control flow]]:** statements run from top to bottom, one after another, unless a control structure changes that.'],
        ['**Baris logik:** biasanya satu baris fizikal; boleh merentasi beberapa baris di dalam `()`, `[]` atau `{}`.', '**Logical line:** usually one physical line; it can span several lines inside `()`, `[]` or `{}`.'],
        ['**[[indentation|Inden]]:** pernyataan peringkat atas bermula di lajur pertama; hanya badan [[block|blok]] (selepas `:`) diinden.', '**[[indentation|Indentation]]:** top-level statements start in the first column; only the body of a [[block|block]] (after `:`) is indented.'],
      )),
    S('detailed_theory',
      P('Python membezakan dua jenis binaan. **Ungkapan** dinilai untuk menghasilkan nilai: `2 + 3`, `"Hai, " + nama`, `len(senarai)`. **Pernyataan** ialah unit pelaksanaan: ia melakukan sesuatu, seperti mengikat nama (`total = 2 + 3`), memanggil fungsi untuk kesan sampingannya (`print(total)`), atau mengimport modul. Setiap ungkapan boleh berdiri sendiri sebagai pernyataan (kuliah 2.2 menunjukkan bahawa skrip membuang nilainya), tetapi pernyataan bukan ungkapan: `x = 5` tidak mempunyai nilai, jadi `print(x = 5)` bukan cara mencetak assignment. Satu program Python ialah urutan pernyataan dalam fail, dan pelaksanaannya **deterministik**: dengan input yang sama, pernyataan yang sama dijalankan dalam susunan yang sama dan menghasilkan output yang sama setiap kali.',
        'Python distinguishes two kinds of construct. An **expression** is evaluated to produce a value: `2 + 3`, `"Hi, " + name`, `len(items)`. A **statement** is a unit of execution: it does something, such as binding a name (`total = 2 + 3`), calling a function for its side effect (`print(total)`), or importing a module. Every expression can stand alone as a statement (lecture 2.2 showed that a script discards its value), but a statement is not an expression: `x = 5` has no value, so `print(x = 5)` is not a way to print an assignment. A Python program is a sequence of statements in a file, and its execution is **deterministic**: with the same input, the same statements run in the same order and produce the same output every time.'),
      P('Python membaca kod sebagai **baris logik**. Biasanya satu baris fizikal ialah satu baris logik dan satu pernyataan. Pernyataan yang panjang boleh dipecahkan ke beberapa baris fizikal jika ia berada di dalam kurungan — `()`, `[]` atau `{}` — kerana Python tahu baris itu belum tamat selagi kurungan belum ditutup (**sambungan tersirat**). Garis miring terbalik di hujung baris juga menyambung baris (**sambungan eksplisit**), tetapi [[pep-8|PEP 8]] mengesyorkan kurungan kerana garis miring terbalik mudah rosak dengan ruang yang tidak kelihatan. Koma bertitik `;` membenarkan beberapa pernyataan pada satu baris, tetapi ini tidak digalakkan. [[indentation|Inden]] membawa makna: pernyataan peringkat atas mesti bermula di lajur pertama, dan hanya baris di dalam blok (selepas baris yang berakhir dengan `:`) diinden. Ruang tambahan di hadapan pernyataan biasa menimbulkan `IndentationError: unexpected indent`.',
        'Python reads code as **logical lines**. Usually one physical line is one logical line and one statement. A long statement can be broken over several physical lines if it is inside brackets — `()`, `[]` or `{}` — because Python knows the line is not finished while a bracket is still open (**implicit continuation**). A backslash at the end of a line also continues it (**explicit continuation**), but [[pep-8|PEP 8]] recommends brackets because backslashes break easily with invisible trailing spaces. A semicolon `;` allows several statements on one line, but this is discouraged. [[indentation|Indentation]] carries meaning: top-level statements must start in the first column, and only lines inside a block (after a line ending with `:`) are indented. Extra spaces in front of an ordinary statement raise `IndentationError: unexpected indent`.'),
      P('Susunan juga menentukan **bila** nama wujud. Nama hanya wujud selepas pernyataan yang mengikatnya dijalankan; menggunakannya lebih awal menimbulkan `NameError`, walaupun assignment itu muncul kemudian dalam fail yang sama. Kerana setiap assignment boleh menggantikan nilai lama, pemboleh ubah yang sama boleh mempunyai nilai berbeza di bahagian berbeza program — jadi soalan "apakah nilai `x`?" sentiasa bermaksud "apakah nilai `x` **pada baris ini**?"',
        'Order also determines **when** names exist. A name exists only after the statement that binds it has run; using it earlier raises `NameError`, even if the assignment appears later in the same file. Because every assignment can replace an old value, the same variable can hold different values in different parts of the program — so the question "what is the value of `x`?" always means "what is the value of `x` **at this line**?"')),
    S('technical_terminology', TERMS('statement', 'control-flow', 'indentation', 'block', 'pep-8')),
    S('syntax_rules',
      UL(
        ['Satu pernyataan setiap baris; pernyataan peringkat atas bermula di lajur pertama.', 'One statement per line; top-level statements start in the first column.'],
        ['Pecahkan baris panjang di dalam kurungan: `total = (a\\n         + b)`; mulakan baris sambungan dengan operator.', 'Break long lines inside brackets: `total = (a\\n         + b)`; start continuation lines with the operator.'],
        ['Elakkan `;` dan sambungan `\\`; [[pep-8|PEP 8]] mengesyorkan baris tidak melebihi 79 aksara (banyak projek menggunakan 88–100).', 'Avoid `;` and `\\` continuation; [[pep-8|PEP 8]] recommends lines of at most 79 characters (many projects use 88–100).'],
        ['Susunan skrip yang disyorkan: docstring → import → pemalar → fungsi → kod utama.', 'Recommended script order: docstring → imports → constants → functions → main code.'],
        ['`a, b = b, a` menukar dua nilai dalam satu pernyataan.', '`a, b = b, a` swaps two values in one statement.'],
      )),
    S('code_demonstration',
      CODE('sequence-order', 'python', 'python', ['Susunan mengubah hasil', 'Order changes the result'], `
balance = 100
balance = balance - 30
balance = balance * 2
print("Withdraw then double:", balance)

balance = 100
balance = balance * 2
balance = balance - 30
print("Double then withdraw:", balance)
`, 'Withdraw then double: 140\nDouble then withdraw: 170'),
      EXPLAIN('sequence-order',
        ['1–4', '100 − 30 = 70, kemudian 70 × 2 = 140.', '100 − 30 = 70, then 70 × 2 = 140.'],
        ['6–9', 'Pernyataan yang sama, susunan berbeza: 100 × 2 = 200, kemudian 200 − 30 = 170. Pernyataan yang sama dalam susunan berbeza ialah program yang berbeza.', 'The same statements in a different order: 100 × 2 = 200, then 200 − 30 = 170. The same statements in a different order are a different program.'])),
    S('complete_examples',
      CODE('swap-values', 'python', 'python', ['Menukar dua nilai', 'Swapping two values'], `
left = "Aina"
right = "Ben"
print("Before:", left, right)
left, right = right, left
print("After:", left, right)
`, 'Before: Aina Ben\nAfter: Ben Aina', {
        debug: BUG(`
print("Before:", left, right)
left = "Aina"
right = "Ben"
`, "example.py:1: NameError: name 'left' is not defined",
          'Baris 1 menggunakan `left` sebelum baris 2 mengikatnya. Python menjalankan pernyataan mengikut susunan; ia tidak "melihat ke hadapan" untuk mencari assignment. Pindahkan `print` selepas kedua-dua assignment. (Perhatikan bahawa hanya `left` disebut — Python berhenti pada nama pertama yang gagal.)',
          'Line 1 uses `left` before line 2 binds it. Python runs statements in order; it does not "look ahead" for the assignment. Move the `print` after both assignments. (Notice that only `left` is mentioned — Python stops at the first name that fails.)'),
      }),
      EXPLAIN('swap-values',
        ['1–3', 'Dua nama diikat, kemudian dicetak.', 'Two names are bound, then printed.'],
        ['4', 'Sebelah kanan dinilai **dahulu** sebagai pasangan `("Ben", "Aina")`, kemudian dibuka ke dalam `left` dan `right`. Tiada pemboleh ubah sementara diperlukan.', 'The right-hand side is evaluated **first** as the pair `("Ben", "Aina")`, then unpacked into `left` and `right`. No temporary variable is needed.'],
        ['5', 'Nilai telah ditukar.', 'The values have been swapped.']),
      CODE('long-statement', 'python', 'python', ['Pernyataan panjang dalam kurungan', 'A long statement inside parentheses'], `
monthly_fees = (
    120.00  # tuition
    + 35.50  # transport
    + 18.00  # materials
)
months = 10
print("Yearly fees: RM", monthly_fees * months)
`, 'Yearly fees: RM 1735.0', {
        debug: BUG(`
months = 10
    yearly = 173.50 * months
print(yearly)
`, 'example.py:2: IndentationError: unexpected indent',
          'Baris 2 bermula dengan empat ruang, tetapi ia bukan di dalam blok (tiada baris sebelumnya berakhir dengan `:`). Dalam Python, inden mempunyai makna, jadi ruang tambahan ialah ralat sintaks — tiada baris dijalankan. Buang ruang di hadapan baris 2.',
          'Line 2 starts with four spaces, but it is not inside a block (no previous line ends with `:`). In Python, indentation has meaning, so extra spaces are a syntax error — no line runs. Remove the spaces in front of line 2.'),
      }),
      EXPLAIN('long-statement',
        ['1–5', 'Satu pernyataan assignment merentasi lima baris fizikal. Kurungan terbuka memberitahu Python bahawa pernyataan berterusan; setiap baris boleh mempunyai komen sendiri. Inden di dalam kurungan hanyalah untuk kebolehbacaan.', 'One assignment statement across five physical lines. The open parenthesis tells Python the statement continues; each line can have its own comment. Indentation inside brackets is only for readability.'],
        ['6–7', '173.5 × 10 = 1735.0.', '173.5 × 10 = 1735.0.'])),
    S('line_by_line',
      EXPLAIN('swap-values',
        ['4', 'Langkah dalaman: (1) baca `right` → "Ben"; (2) baca `left` → "Aina"; (3) bina tuple ("Ben", "Aina"); (4) ikat `left` kepada "Ben"; (5) ikat `right` kepada "Aina". Kerana kedua-dua nilai dibaca sebelum sebarang assignment, tiada nilai hilang.', 'Internal steps: (1) read `right` → "Ben"; (2) read `left` → "Aina"; (3) build the tuple ("Ben", "Aina"); (4) bind `left` to "Ben"; (5) bind `right` to "Aina". Because both values are read before any assignment, no value is lost.']),
      EXPLAIN('long-statement',
        ['3', 'Baris sambungan bermula dengan operator `+` — [[pep-8|PEP 8]] mengesyorkan gaya ini kerana operator mudah dilihat di sebelah kiri.', 'The continuation line starts with the `+` operator — [[pep-8|PEP 8]] recommends this style because operators are easy to see on the left.'])),
    S('why_this_way',
      P('Mengapa Python menggunakan baris dan inden, dan bukan koma bertitik dan kurungan kerinting seperti C atau Java? Kerana dalam bahasa tersebut, pengatur cara **juga** menginden kod supaya mudah dibaca — tetapi pengkompil mengabaikan inden itu, jadi inden yang mengelirukan boleh menyembunyikan pepijat sebenar. Python menjadikan inden yang dilihat oleh manusia sama dengan struktur yang dilihat oleh interpreter. Urutan yang jelas, satu pernyataan setiap baris, juga menjadikan traceback tepat: nombor baris menunjuk satu pernyataan, bukan lima.',
        'Why does Python use lines and indentation rather than semicolons and curly braces like C or Java? Because in those languages programmers **also** indent code to make it readable — but the compiler ignores that indentation, so misleading indentation can hide real bugs. Python makes the indentation people see identical to the structure the interpreter sees. A clear sequence, one statement per line, also makes tracebacks precise: a line number points to one statement, not five.')),
    S('execution_flow',
      OL(
        ['Python menyemak struktur baris (inden, kurungan) semasa kompil — `IndentationError` dikesan sebelum apa-apa berjalan.', 'Python checks the line structure (indentation, brackets) while compiling — `IndentationError` is detected before anything runs.'],
        ['Pelaksanaan bermula pada pernyataan pertama fail dan bergerak ke bawah.', 'Execution starts at the file’s first statement and moves downwards.'],
        ['Bagi setiap assignment, sebelah kanan dinilai sepenuhnya dahulu, kemudian nama diikat.', 'For each assignment, the right-hand side is evaluated completely first, then the name is bound.'],
        ['Pernyataan yang merentasi beberapa baris (dalam kurungan) dijalankan sebagai **satu** pernyataan.', 'A statement spanning several lines (inside brackets) runs as **one** statement.'],
        ['Selepas pernyataan terakhir, program tamat secara normal.', 'After the last statement, the program ends normally.'],
      )),
    S('memory_behaviour',
      P('Dalam `sequence-order`, nama `balance` diikat semula empat kali kepada objek integer yang berbeza: 100, 70, 140, kemudian 100 lagi, dan seterusnya. Setiap objek lama yang tiada lagi nama merujuk kepadanya dibebaskan secara automatik oleh pengiraan rujukan CPython. Dalam `swap-values`, tuple sementara `("Ben", "Aina")` dicipta, dibuka, kemudian dibuang serta-merta; tiada salinan string dibuat — `left` dan `right` hanya bertukar objek yang dirujuk. (Pengkompil CPython malah mengoptimumkan pertukaran dua nama tanpa membina tuple sebenar.)',
        'In `sequence-order`, the name `balance` is rebound four times to different integer objects: 100, 70, 140, then 100 again, and so on. Each old object that no name refers to any more is freed automatically by CPython’s reference counting. In `swap-values`, a temporary tuple `("Ben", "Aina")` is created, unpacked, then discarded immediately; no string is copied — `left` and `right` simply exchange the objects they refer to. (CPython’s compiler even optimises a two-name swap without building a real tuple.)')),
    S('alternative_implementations',
      P('Koma bertitik membenarkan beberapa pernyataan pada satu baris. Kedua-dua bahagian program berikut adalah setara, tetapi bahagian kedua lebih mudah dibaca dan menghasilkan traceback yang lebih tepat:', 'Semicolons allow several statements on one line. Both halves of the following program are equivalent, but the second is easier to read and gives more precise tracebacks:'),
      CODE('semicolon-statements', 'python', 'python', ['Koma bertitik berbanding satu pernyataan setiap baris', 'Semicolons versus one statement per line'], `
a = 3; b = 4; print("Packed:", a * b)

c = 3
d = 4
print("One per line:", c * d)
`, 'Packed: 12\nOne per line: 12'),
      EXPLAIN('semicolon-statements',
        ['1', 'Tiga pernyataan pada satu baris. Jika salah satu gagal, traceback menunjuk baris 1 tanpa menyatakan pernyataan mana.', 'Three statements on one line. If one fails, the traceback points to line 1 without saying which statement.'],
        ['3–5', 'Gaya [[pep-8|PEP 8]]: satu pernyataan setiap baris.', '[[pep-8|PEP 8]] style: one statement per line.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan pemboleh ubah sebelum ia diberi nilai — `NameError`.', 'Using a variable before it has been given a value — `NameError`.'],
        ['Mencetak hasil sebelum pengiraan terakhir, jadi output menunjukkan nilai lama.', 'Printing a result before the final calculation, so the output shows an old value.'],
        ['Ruang tambahan di hadapan pernyataan biasa — `IndentationError: unexpected indent`.', 'Extra spaces in front of an ordinary statement — `IndentationError: unexpected indent`.'],
        ['Menukar nilai dengan `a = b` kemudian `b = a` — kedua-duanya berakhir dengan nilai yang sama.', 'Swapping values with `a = b` then `b = a` — both end up with the same value.'],
        ['Menulis `print(x = 5)` dengan harapan mencetak assignment — assignment ialah pernyataan, bukan ungkapan.', 'Writing `print(x = 5)` hoping to print an assignment — an assignment is a statement, not an expression.'],
      )),
    S('debugging',
      P('Untuk pepijat susunan, buat **jadual jejak** (trace table): satu lajur untuk setiap pemboleh ubah, satu baris untuk setiap pernyataan, dan isikan nilai dengan tangan sebelum menjalankan program. Kemudian tambah `print` selepas setiap langkah dan bandingkan. Contoh berikut mengira simpanan dengan faedah kompaun 4% setahun selama tiga tahun sebagai urutan pernyataan; setiap langkah dicetak supaya jadual jejak boleh disahkan baris demi baris.',
        'For ordering bugs, build a **trace table**: one column per variable, one row per statement, and fill in the values by hand before running the program. Then add a `print` after each step and compare. The following example calculates savings with 4% compound interest per year for three years as a sequence of statements; each step is printed so the trace table can be checked line by line.'),
      CODE('trace-interest', 'python', 'python', ['Jadual jejak untuk urutan pengiraan', 'A trace table for a sequence of calculations'], `
principal = 1000.00
rate = 0.04
year1 = principal * (1 + rate)
print("year 1:", round(year1, 2))
year2 = year1 * (1 + rate)
print("year 2:", round(year2, 2))
year3 = year2 * (1 + rate)
print("year 3:", round(year3, 2))
`, 'year 1: 1040.0\nyear 2: 1081.6\nyear 3: 1124.86'),
      EXPLAIN('trace-interest',
        ['1–2', 'Nilai awal: RM1000 pada kadar 4%.', 'Starting values: RM1000 at a 4% rate.'],
        ['3–4', 'Tahun 1: 1000 × 1.04 = 1040.', 'Year 1: 1000 × 1.04 = 1040.'],
        ['5–6', 'Tahun 2 bergantung pada `year1` — mesti datang **selepas** baris 3. 1040 × 1.04 = 1081.6.', 'Year 2 depends on `year1` — it must come **after** line 3. 1040 × 1.04 = 1081.6.'],
        ['7–8', '1081.6 × 1.04 = 1124.864, dibundarkan kepada 1124.86 untuk paparan. (Corak berulang ini akan menjadi gelung dalam PY103.)', '1081.6 × 1.04 = 1124.864, rounded to 1124.86 for display. (This repeating pattern will become a loop in PY103.)'])),
    S('performance',
      P('Dalam urutan, setiap pernyataan dijalankan tepat sekali, jadi masa larian program berurutan adalah lebih kurang jumlah masa setiap pernyataan. Mengira nilai sekali dan menyimpannya dalam pemboleh ubah (seperti `year1`) adalah lebih cekap — dan lebih jelas — daripada mengira semula ungkapan yang sama di beberapa tempat. Pengoptimuman seperti ini menjadi penting apabila pernyataan berada di dalam gelung yang berjalan berjuta kali.',
        'In a sequence, each statement runs exactly once, so a sequential program’s running time is roughly the sum of its statements’ times. Calculating a value once and storing it in a variable (like `year1`) is more efficient — and clearer — than recalculating the same expression in several places. Optimisations like this matter when statements sit inside loops that run millions of times.')),
    S('software_engineering',
      P('Pernyataan yang sama boleh disusun secara bercampur-aduk atau dalam bahagian yang jelas. Kedua-dua program mencetak resit letak kereta yang sama:', 'The same statements can be arranged in a jumble or in clear sections. Both programs print the same parking receipt:'),
      CODE('structure-poor', 'python', 'python', ['Pelaksanaan lemah: susunan bercampur', 'Poor implementation: a jumbled order'], `
print("Parking receipt")
hours = 3
FIRST_HOUR = 3.00
print("Hours:", hours)
NEXT_HOUR = 2.00
fee = FIRST_HOUR + (hours - 1) * NEXT_HOUR
print("Fee: RM", fee)
`, 'Parking receipt\nHours: 3\nFee: RM 7.0'),
      EXPLAIN('structure-poor',
        ['1–7', 'Pemalar, input, pengiraan dan output bercampur. Pembaca mesti membaca setiap baris untuk mencari kadar bayaran, dan menambah langkah baharu mudah merosakkan susunan.', 'Constants, input, calculation and output are mixed together. A reader must read every line to find the rates, and adding a new step easily breaks the order.']),
      CODE('structure-improved', 'python', 'python', ['Pelaksanaan lebih baik: bahagian yang jelas', 'Improved implementation: clear sections'], `
"""Parking fee calculator for the campus car park."""

FIRST_HOUR_FEE = 3.00
EXTRA_HOUR_FEE = 2.00


def parking_fee(hours):
    return FIRST_HOUR_FEE + (hours - 1) * EXTRA_HOUR_FEE


def main():
    hours = 3
    print("Parking receipt")
    print("Hours:", hours)
    print(f"Fee: RM{parking_fee(hours):.2f}")


if __name__ == "__main__":
    main()
`, 'Parking receipt\nHours: 3\nFee: RM7.00'),
      EXPLAIN('structure-improved',
        ['1', 'Docstring: tujuan fail.', 'Docstring: the file’s purpose.'],
        ['3–4', 'Semua pemalar di satu tempat, di bahagian atas.', 'All constants in one place, at the top.'],
        ['7–8', 'Proses dalam fungsi bernama (PY104) — pengiraan boleh diuji secara berasingan.', 'The process in a named function (PY104) — the calculation can be tested on its own.'],
        ['11–15', 'Input dan output dalam `main()`, mengikut urutan IPO.', 'Input and output in `main()`, following the IPO order.'],
        ['18–19', 'Titik masuk skrip (kuliah 2.2).', 'The script’s entry point (lecture 2.2).'])),
    S('industry_use_cases',
      UL(
        ['**Skrip automasi** — contohnya sandaran malam — ialah urutan langkah: sambung, salin, mampat, sahkan, laporkan. Susunan yang salah boleh memadam data sebelum ia disalin.', '**Automation scripts** — for example nightly backups — are sequences of steps: connect, copy, compress, verify, report. The wrong order can delete data before it is copied.'],
        ['**Saluran data (ETL):** Extract → Transform → Load mesti berlaku dalam susunan itu.', '**Data pipelines (ETL):** Extract → Transform → Load must happen in that order.'],
        ['**Pemasangan perisian:** pemasang menjalankan langkah berurutan dan log setiap langkah supaya kegagalan boleh dikesan.', '**Software installation:** installers run sequential steps and log each one so failures can be traced.'],
        ['**Semakan kod:** pasukan menggunakan alat seperti `ruff` dan `black` untuk menguatkuasakan struktur dan susun atur [[pep-8|PEP 8]] secara automatik.', '**Code review:** teams use tools such as `ruff` and `black` to enforce [[pep-8|PEP 8]] structure and layout automatically.'],
      )),
    S('practical_demonstration',
      OL(
        ['Buat jadual jejak untuk `sequence-order` dengan tangan, kemudian jalankan dan bandingkan.', 'Build a trace table for `sequence-order` by hand, then run it and compare.'],
        ['Tukar `swap-values` untuk menggunakan pemboleh ubah sementara `temp` dan bukan `a, b = b, a`.', 'Change `swap-values` to use a temporary variable `temp` instead of `a, b = b, a`.'],
        ['Tambah baris keempat (`+ 12.00  # activities`) kepada `long-statement` dan ramalkan output.', 'Add a fourth line (`+ 12.00  # activities`) to `long-statement` and predict the output.'],
        ['Ubah `trace-interest` untuk kadar 5% dan semak jadual jejak anda.', 'Change `trace-interest` to a 5% rate and check your trace table.'],
      )),
    S('mini_project',
      P('**Mesin bayaran letak kereta.** Tulis program yang bertanya jam masuk dan jam keluar (format 24 jam), mengira tempoh dan bayaran (RM3.00 untuk jam pertama, RM2.00 untuk setiap jam berikutnya), dan mencetak resit berbingkai. Susun kod dalam bahagian pemalar, input, proses dan output.', '**A parking payment machine.** Write a program that asks for the entry hour and the exit hour (24-hour format), calculates the duration and the fee (RM3.00 for the first hour, RM2.00 for each further hour), and prints a framed receipt. Organise the code into constants, input, process and output sections.'),
      CODE('parking-machine', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
FIRST_HOUR_FEE = 3.00
EXTRA_HOUR_FEE = 2.00
LINE = "=" * 26

entry_hour = int(input("Entry hour (0-23): "))
exit_hour = int(input("Exit hour (0-23): "))

hours_parked = exit_hour - entry_hour
fee = FIRST_HOUR_FEE + (hours_parked - 1) * EXTRA_HOUR_FEE

print(LINE)
print(f"Hours parked: {hours_parked}")
print(f"Amount due:   RM{fee:.2f}")
print(LINE)
`, 'Entry hour (0-23): Exit hour (0-23): ==========================\nHours parked: 5\nAmount due:   RM11.00\n==========================', { input: '9\n14' }),
      EXPLAIN('parking-machine',
        ['1–3', 'Pemalar: kadar bayaran dan garis bingkai.', 'Constants: the fee rates and the frame line.'],
        ['5–6', 'Input: dua jam sebagai integer.', 'Input: two hours as integers.'],
        ['8–9', 'Proses: 14 − 9 = 5 jam; 3.00 + 4 × 2.00 = 11.00. (Masuk dan keluar dalam jam yang sama, atau melepasi tengah malam, memerlukan `if` — PY103.)', 'Process: 14 − 9 = 5 hours; 3.00 + 4 × 2.00 = 11.00. (Entering and leaving within the same hour, or past midnight, needs `if` — PY103.)'],
        ['11–14', 'Output: resit berbingkai dengan label dijajarkan.', 'Output: a framed receipt with aligned labels.'])),
    S('summary',
      UL(
        ['Program ialah urutan pernyataan yang dijalankan dari atas ke bawah; susunan menentukan hasil.', 'A program is a sequence of statements run from top to bottom; the order decides the result.'],
        ['Pernyataan melakukan sesuatu; ungkapan menghasilkan nilai.', 'Statements do something; expressions produce values.'],
        ['Nama hanya wujud selepas ia diikat; sebelah kanan assignment dinilai dahulu.', 'A name exists only after it is bound; the right-hand side of an assignment is evaluated first.'],
        ['Pecahkan baris panjang di dalam kurungan; jangan inden pernyataan peringkat atas.', 'Break long lines inside brackets; do not indent top-level statements.'],
        ['Susun skrip: docstring, import, pemalar, fungsi, kod utama.', 'Organise scripts: docstring, imports, constants, functions, main code.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah perbezaan antara pernyataan dan ungkapan? Berikan satu contoh setiap satu.', 'What is the difference between a statement and an expression? Give one example of each.'],
        ['Apakah output `x = 2`, `x = x + 3`, `x = x * x`, `print(x)`?', 'What is the output of `x = 2`, `x = x + 3`, `x = x * x`, `print(x)`?'],
        ['Mengapakah `a = b` diikuti `b = a` tidak menukar dua nilai?', 'Why does `a = b` followed by `b = a` not swap two values?'],
        ['Bilakah satu pernyataan boleh merentasi beberapa baris tanpa `\\`?', 'When can one statement span several lines without `\\`?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Python Language Reference — Line structure', url: `${PYDOCS}/reference/lexical_analysis.html#line-structure` },
        { title: 'Python Language Reference — Simple statements', url: `${PYDOCS}/reference/simple_stmts.html` },
        { title: 'PEP 8 — Code Lay-out', url: 'https://peps.python.org/pep-0008/#code-lay-out' },
        { title: 'Think Python, 3rd edition — Chapter 2: Variables and Statements', url: 'https://allendowney.github.io/ThinkPython/chap02.html' },
        { title: 'Python tutorial — First Steps Towards Programming', url: `${PYDOCS}/tutorial/introduction.html#first-steps-towards-programming` },
      )),
  ],
};

export const PY101_M3: LectureContentDef[] = [PY101_3_1, PY101_3_2, PY101_3_3];
