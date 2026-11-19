import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * PY101 · Module 1 — Computers, Programs and Programming Languages.
 * Every example is Python 3.13 and is executed by CPython 3.13 (npm run verify:code).
 */

const PYDOCS = 'https://docs.python.org/3.13';
const THINK = 'https://allendowney.github.io/ThinkPython';

// ─── 1.1 What is a program? Input, process and output ─────────────────────

export const PY101_1_1: LectureContentDef = {
  courseCode: 'PY101',
  module: 1,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Mentakrifkan program sebagai urutan arahan tepat yang dilaksanakan oleh komputer.', 'Define a program as a precise sequence of instructions carried out by a computer.'],
        ['Menerangkan [[ipo-model|model Input–Proses–Output]] dan mengenal pasti input, proses dan output dalam program sebenar.', 'Explain the [[ipo-model|Input–Process–Output model]] and identify the input, process and output of a real program.'],
        ['Membezakan [[source-code|kod sumber]], data dan keadaan (state) program.', 'Distinguish a program’s [[source-code|source code]], its data and its state.'],
        ['Membaca dan meramalkan output program Python pendek yang menggunakan pemboleh ubah dan `print()`.', 'Read and predict the output of short Python programs that use variables and `print()`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Tiada pengalaman pengaturcaraan diperlukan. Kuliah ini ialah titik permulaan program Python.', 'No programming experience is required. This lecture is the starting point of the Python programme.'],
        ['Aritmetik sekolah menengah (tambah, darab, bahagi) mencukupi untuk semua contoh.', 'Secondary-school arithmetic (addition, multiplication, division) is enough for every example.'],
        ['Anda belum perlu memasang Python: modul 2 mengajar pemasangan. Baca dahulu, kemudian jalankan contoh selepas kuliah 2.1.', 'You do not need Python installed yet: module 2 teaches installation. Read first, then run the examples after lecture 2.1.'],
      )),
    S('introduction',
      P('Setiap kali anda membuka aplikasi bank, menghantar mesej atau melihat jadual bas, sebuah program sedang bekerja. Program ialah senarai arahan yang ditulis dengan sangat tepat supaya komputer — mesin yang hanya mampu melakukan operasi mudah dengan sangat pantas — boleh menyelesaikan tugas yang berguna. Komputer tidak meneka maksud kita; ia melakukan **tepat** apa yang ditulis, dalam susunan yang ditulis. Itulah sebabnya pengaturcaraan memerlukan pemikiran yang jelas dan teliti.',
        'Every time you open a banking app, send a message or check a bus timetable, a program is at work. A program is a list of instructions written very precisely so that a computer — a machine that can only perform simple operations, but extremely fast — can complete a useful task. A computer does not guess what we mean; it does **exactly** what is written, in the order it is written. That is why programming demands clear, careful thinking.'),
      P('Kuliah ini memperkenalkan cara paling asas untuk memahami sebarang program: ia menerima **input**, melakukan **proses**, dan menghasilkan **output**. Anda akan melihat program Python pertama anda dan belajar membacanya baris demi baris.',
        'This lecture introduces the most basic way to understand any program: it receives **input**, performs a **process**, and produces **output**. You will see your first Python programs and learn to read them line by line.'),
      KEY('Program = arahan yang tepat + data. Komputer menjalankan arahan satu demi satu, tanpa meneka.', 'Program = precise instructions + data. The computer carries out the instructions one by one, without guessing.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Program:** satu set arahan yang disusun untuk mencapai tujuan tertentu, contohnya mengira jumlah bil atau memaparkan cuaca.', '**Program:** a set of instructions arranged to achieve a specific goal, for example calculating a bill total or showing the weather.'],
        ['**[[algorithm|Algoritma]]:** langkah-langkah penyelesaian yang tidak bergantung pada bahasa; program ialah algoritma yang ditulis dalam bahasa pengaturcaraan.', '**[[algorithm|Algorithm]]:** the solution steps, independent of any language; a program is an algorithm written in a programming language.'],
        ['**Input:** data yang diterima program — daripada papan kekunci, fail, sensor, rangkaian, atau nilai yang ditulis terus dalam kod.', '**Input:** data the program receives — from the keyboard, files, sensors, the network, or values written directly in the code.'],
        ['**Proses:** pengiraan dan keputusan yang mengubah input menjadi keputusan.', '**Process:** the calculations and decisions that turn input into results.'],
        ['**Output:** hasil yang dipaparkan, disimpan atau dihantar — teks pada skrin, fail, bunyi, isyarat.', '**Output:** results that are displayed, stored or sent — text on screen, files, sound, signals.'],
        ['**Keadaan (state):** nilai yang disimpan oleh program pada satu-satu masa, contohnya isi semua [[variable|pemboleh ubah]].', '**State:** the values a program holds at a given moment, for example the contents of all its [[variable|variables]].'],
      )),
    S('detailed_theory',
      P('Di dalam setiap komputer terdapat unit pemprosesan pusat (CPU) yang hanya memahami **kod mesin**: nombor binari yang mewakili operasi sangat kecil seperti "salin nombor ini", "tambah dua nombor" atau "lompat ke arahan lain". CPU moden melaksanakan berbilion operasi sedemikian setiap saat, tetapi ia tidak tahu apa itu "bil", "pelajar" atau "markah". Tugas pengatur cara ialah memecahkan masalah sebenar kepada langkah yang cukup kecil dan tepat, kemudian menulis langkah itu dalam bahasa pengaturcaraan seperti Python. Teks yang ditulis oleh pengatur cara dipanggil [[source-code|kod sumber]]; ia diterjemah oleh perisian lain kepada bentuk yang boleh dilaksanakan oleh mesin (kuliah 1.2).',
        'Inside every computer is a central processing unit (CPU) that understands only **machine code**: binary numbers representing very small operations such as "copy this number", "add two numbers" or "jump to another instruction". A modern CPU executes billions of such operations every second, but it has no idea what a "bill", a "student" or a "mark" is. The programmer’s job is to break a real problem into steps that are small and precise enough, then write those steps in a programming language such as Python. The text a programmer writes is called [[source-code|source code]]; other software translates it into a form the machine can execute (lecture 1.2).'),
      P('[[ipo-model|Model Input–Proses–Output]] (IPO) ialah alat berfikir yang digunakan sebelum menulis kod. Bagi kalkulator bil restoran: inputnya ialah harga setiap hidangan dan bilangan orang; prosesnya ialah menjumlahkan harga, menambah caj perkhidmatan dan membahagi; outputnya ialah jumlah setiap orang. Menjawab tiga soalan ini dahulu — *apa yang saya ada, apa yang perlu dikira, apa yang perlu ditunjukkan* — mengelakkan program yang menyelesaikan masalah yang salah. Dalam program yang lebih besar, model IPO berulang di setiap peringkat: setiap fungsi juga menerima input (parameter), memproses, dan memulangkan output.',
        'The [[ipo-model|Input–Process–Output]] (IPO) model is a thinking tool used before writing code. For a restaurant bill calculator: the input is the price of each dish and the number of people; the process is adding the prices, applying the service charge and dividing; the output is the amount per person. Answering these three questions first — *what do I have, what must be calculated, what must be shown* — avoids programs that solve the wrong problem. In larger programs, the IPO model repeats at every level: each function also receives input (parameters), processes it and returns output.'),
      P('Semasa program berjalan, ia menyimpan nilai dalam ingatan; nama yang merujuk kepada nilai itu dipanggil [[variable|pemboleh ubah]]. Kumpulan semua nilai pada satu ketika ialah **keadaan** program. Setiap [[statement|pernyataan]] yang dilaksanakan boleh mengubah keadaan itu. Memahami program bermaksud dapat menjejak bagaimana keadaan berubah dari baris ke baris — kemahiran yang akan anda gunakan dalam setiap kursus selepas ini.',
        'While a program runs, it stores values in memory; a name that refers to such a value is called a [[variable|variable]]. The collection of all values at a given moment is the program’s **state**. Each [[statement|statement]] that executes can change that state. Understanding a program means being able to trace how its state changes from line to line — a skill you will use in every course that follows.')),
    S('technical_terminology', TERMS('ipo-model', 'source-code', 'algorithm', 'variable', 'statement', 'print-function')),
    S('syntax_rules',
      UL(
        ['Program Python ialah fail teks; Python membaca dan menjalankannya dari baris pertama ke baris terakhir.', 'A Python program is a text file; Python reads and runs it from the first line to the last.'],
        ['`nama = nilai` menyimpan nilai dan memberinya nama (assignment). Tanda `=` bermaksud "simpan", bukan "sama dengan".', '`name = value` stores a value and gives it a name (assignment). The `=` sign means "store", not "is equal to".'],
        ['`print(a, b)` memaparkan nilai-nilainya pada satu baris, dipisahkan oleh satu ruang.', '`print(a, b)` displays its values on one line, separated by one space.'],
        ['Teks di antara tanda petik (`"Luas:"`) ialah string; nombor ditulis tanpa petik (`8`, `4.5`).', 'Text between quotes (`"Area:"`) is a string; numbers are written without quotes (`8`, `4.5`).'],
        ['Baris yang bermula dengan `#` ialah komen untuk manusia; Python mengabaikannya.', 'A line starting with `#` is a comment for people; Python ignores it.'],
      )),
    S('code_demonstration',
      CODE('ipo-rectangle', 'python', 'python', ['Program pertama: input, proses, output', 'A first program: input, process, output'], `
# Input: the data the program starts with
length = 8
width = 5

# Process: calculations on that data
area = length * width
perimeter = 2 * (length + width)

# Output: results shown to the user
print("Area:", area)
print("Perimeter:", perimeter)
`, 'Area: 40\nPerimeter: 26'),
      EXPLAIN('ipo-rectangle',
        ['2–3', 'Dua nilai input ditulis terus dalam kod dan diberi nama `length` dan `width`. Selepas dua baris ini, keadaan program ialah {length: 8, width: 5}.', 'Two input values are written directly in the code and named `length` and `width`. After these two lines, the program’s state is {length: 8, width: 5}.'],
        ['6', 'Proses: `*` mendarab. Python mengira `8 * 5` dahulu, kemudian menyimpan 40 dalam `area`.', 'Process: `*` multiplies. Python calculates `8 * 5` first, then stores 40 in `area`.'],
        ['7', 'Kurungan dikira dahulu seperti dalam matematik: `8 + 5 = 13`, kemudian `2 * 13 = 26`.', 'Parentheses are evaluated first, as in mathematics: `8 + 5 = 13`, then `2 * 13 = 26`.'],
        ['10–11', 'Output: setiap `print` memaparkan satu baris. Label teks dan nombor dipisahkan oleh satu ruang secara automatik.', 'Output: each `print` displays one line. The text label and the number are separated by one space automatically.'])),
    S('complete_examples',
      P('Contoh pertama mengambil input daripada **pengguna** melalui papan kekunci. Dalam ujian automatik kursus ini, papan kekunci digantikan dengan teks yang ditetapkan (`Aina` dan `PY101`); teks yang ditaip tidak dipaparkan semula dalam output.', 'The first example takes input from the **user** through the keyboard. In this course’s automatic tests, the keyboard is replaced by fixed text (`Aina` and `PY101`); typed text is not echoed in the output.'),
      CODE('ipo-greeting', 'python', 'python', ['Input daripada pengguna', 'Input from the user'], `
name = input("Name: ")
course = input("Course: ")
print("Welcome,", name)
print("You are enrolled in", course)
`, 'Name: Course: Welcome, Aina\nYou are enrolled in PY101', {
        input: 'Aina\nPY101',
        debug: BUG(`
name = input("Name: ")
course = input("Course: ")
print("Welcome," name)
print("You are enrolled in", course)
`, 'example.py:3: SyntaxError: invalid syntax. Perhaps you forgot a comma?',
          'Koma antara `"Welcome,"` dan `name` tertinggal. Koma **di dalam** tanda petik hanyalah sebahagian daripada teks; argumen `print` mesti dipisahkan oleh koma **di luar** tanda petik. Perhatikan bahawa tiada prompt dipaparkan: Python memeriksa sintaks seluruh fail sebelum menjalankan baris pertama. Python 3.13 juga mencadangkan punca yang paling mungkin: "Perhaps you forgot a comma?".',
          'The comma between `"Welcome,"` and `name` is missing. A comma **inside** the quotes is just part of the text; `print` arguments must be separated by commas **outside** the quotes. Notice that no prompt is shown: Python checks the syntax of the whole file before running the first line. Python 3.13 also suggests the most likely cause: "Perhaps you forgot a comma?".'),
      }),
      EXPLAIN('ipo-greeting',
        ['1', '`input("Name: ")` memaparkan prompt, menunggu pengguna menaip dan menekan Enter, kemudian memulangkan teks yang ditaip. Teks itu disimpan dalam `name`.', '`input("Name: ")` shows the prompt, waits for the user to type and press Enter, then returns the typed text. That text is stored in `name`.'],
        ['2', 'Input kedua dengan cara yang sama. Program **berhenti** di setiap `input()` sehingga pengguna menjawab.', 'A second input in the same way. The program **pauses** at each `input()` until the user answers.'],
        ['3–4', 'Output yang menggunakan input. Dalam output ujian, prompt `Name: ` dan `Course: ` muncul bersebelahan kerana jawapan yang ditaip (dan Enter) tidak dipaparkan semula.', 'Output that uses the input. In the test output, the prompts `Name: ` and `Course: ` appear side by side because the typed answers (and Enter) are not echoed.']),
      CODE('recipe-scaling', 'python', 'python', ['Proses: menskala resipi', 'Process: scaling a recipe'], `
# A nasi lemak recipe for 4 people, scaled for a class party of 30
recipe_servings = 4
rice_cups = 3
coconut_milk_ml = 400
guests = 30

factor = guests / recipe_servings
print("Factor:", factor)
print("Rice (cups):", rice_cups * factor)
print("Coconut milk (ml):", coconut_milk_ml * factor)
`, 'Factor: 7.5\nRice (cups): 22.5\nCoconut milk (ml): 3000.0', {
        debug: BUG(`
recipe_servings = 4
rice_cups = 3
coconut_milk_ml = 400
guests = 30

factor = guests / recipe_servings
print("Factor:", factor)
print("Rice (cups):", rice_cups * factr)
print("Coconut milk (ml):", coconut_milk_ml * factor)
`, "example.py:8: NameError: name 'factr' is not defined",
          'Nama `factr` salah eja. Python tidak meneka bahawa maksud anda ialah `factor`; nama yang tidak pernah diberi nilai menimbulkan `NameError` **semasa baris itu dijalankan**. Perhatikan bahawa `Factor: 7.5` telah dicetak — baris sebelum ralat sudah berjalan. Dalam terminal, traceback Python 3.13 juga mencadangkan nama yang hampir sama ("Did you mean: \'factor\'?"); betulkan ejaan dan jalankan semula.',
          'The name `factr` is misspelled. Python does not guess that you meant `factor`; a name that was never given a value raises `NameError` **when that line runs**. Notice that `Factor: 7.5` has already been printed — the lines before the error did run. In a terminal, Python 3.13’s traceback also suggests a similar name ("Did you mean: \'factor\'?"); fix the spelling and run again.'),
      }),
      EXPLAIN('recipe-scaling',
        ['2–5', 'Input: data resipi asal dan bilangan tetamu. Nama yang panjang tetapi jelas (`coconut_milk_ml`) menyatakan unit sekali gus.', 'Input: the original recipe data and the number of guests. Long but clear names (`coconut_milk_ml`) state the unit at the same time.'],
        ['7', 'Proses: faktor skala = 30 / 4 = 7.5. Operator `/` sentiasa menghasilkan nombor perpuluhan (float).', 'Process: scale factor = 30 / 4 = 7.5. The `/` operator always produces a decimal number (a float).'],
        ['8–10', 'Output: setiap bahan didarab dengan faktor. `400 * 7.5` dicetak sebagai `3000.0` kerana hasil darab dengan float ialah float.', 'Output: each ingredient is multiplied by the factor. `400 * 7.5` prints as `3000.0` because multiplying by a float gives a float.'])),
    S('line_by_line',
      EXPLAIN('ipo-rectangle',
        ['6', 'Langkah dalaman: (1) baca nilai `length` → 8; (2) baca nilai `width` → 5; (3) darab → 40; (4) ikat nama `area` kepada 40. Sebelah kanan `=` sentiasa dikira dahulu.', 'Internal steps: (1) read the value of `length` → 8; (2) read the value of `width` → 5; (3) multiply → 40; (4) bind the name `area` to 40. The right-hand side of `=` is always evaluated first.']),
      EXPLAIN('recipe-scaling',
        ['9', '`rice_cups * factor` dikira **di dalam** panggilan `print`; hasil 22.5 tidak disimpan dalam mana-mana pemboleh ubah — ia hanya dipaparkan.', '`rice_cups * factor` is evaluated **inside** the `print` call; the result 22.5 is not stored in any variable — it is only displayed.'])),
    S('why_this_way',
      P('Mengapa memisahkan input, proses dan output walaupun program sekecil ini? Kerana setiap bahagian berubah atas sebab yang berbeza. Esok, input mungkin datang daripada papan kekunci atau fail, bukan nilai tetap; proses mungkin perlu mengambil kira cukai; output mungkin perlu dipaparkan dalam aplikasi web. Jika ketiga-tiganya bercampur, setiap perubahan kecil menyentuh seluruh program. Struktur IPO yang jelas sejak program pertama ialah tabiat yang menjadikan perisian besar boleh diselenggara.',
        'Why separate input, process and output even in a program this small? Because each part changes for different reasons. Tomorrow, the input might come from the keyboard or a file rather than fixed values; the process might need to account for tax; the output might need to appear in a web app. If all three are mixed together, every small change touches the whole program. A clear IPO structure from the very first program is the habit that makes large software maintainable.'),
      P('Nama pemboleh ubah yang bermakna (`perimeter`, bukan `p`) juga mempunyai sebab yang sama: kod dibaca jauh lebih kerap daripada ia ditulis — oleh rakan sepasukan, oleh penilai, dan oleh diri anda sendiri enam bulan kemudian.', 'Meaningful variable names (`perimeter`, not `p`) exist for the same reason: code is read far more often than it is written — by teammates, by reviewers, and by yourself six months later.')),
    S('execution_flow',
      OL(
        ['Python membaca seluruh fail dan menyemak sintaksnya. Jika ada ralat sintaks, tiada baris dijalankan (lihat versi berpepijat `ipo-greeting`).', 'Python reads the whole file and checks its syntax. If there is a syntax error, no line runs (see the buggy version of `ipo-greeting`).'],
        ['Baris 2 `ipo-rectangle` dijalankan: nama `length` dicipta dan merujuk kepada 8. Kemudian baris 3.', 'Line 2 of `ipo-rectangle` runs: the name `length` is created and refers to 8. Then line 3.'],
        ['Baris kosong dan komen dilangkau tanpa sebarang kesan.', 'Blank lines and comments are skipped with no effect.'],
        ['Baris 6–7 mengira dan menyimpan dua nilai baharu; keadaan kini mempunyai empat nama.', 'Lines 6–7 calculate and store two new values; the state now has four names.'],
        ['Baris 10–11 menulis dua baris teks ke skrin. Selepas baris terakhir, program tamat dan semua pemboleh ubahnya hilang.', 'Lines 10–11 write two lines of text to the screen. After the last line, the program ends and all its variables disappear.'],
      )),
    S('memory_behaviour',
      P('Dalam Python, setiap nilai ialah **objek** dalam ingatan, dan pemboleh ubah ialah **nama** yang merujuk kepada objek itu — bukan kotak yang mengandungi nilai. Apabila `area = length * width` dijalankan, Python mencipta objek integer 40 dan mengikat nama `area` kepadanya. Apabila program tamat, semua objek dibebaskan secara automatik; anda tidak perlu mengurus ingatan sendiri. Kuliah PY102 membincangkan model nama-dan-objek ini dengan lebih mendalam.',
        'In Python, every value is an **object** in memory, and a variable is a **name** that refers to that object — not a box that contains the value. When `area = length * width` runs, Python creates the integer object 40 and binds the name `area` to it. When the program ends, all objects are freed automatically; you never manage memory yourself. Course PY102 discusses this name-and-object model in more depth.'),
      INFO('Data yang tidak disimpan ke fail hilang apabila program tamat. Itulah sebabnya aplikasi sebenar menyimpan output penting dalam fail atau pangkalan data (PY114, PY303).', 'Data that is not saved to a file is lost when the program ends. That is why real applications store important output in files or databases (PY114, PY303).')),
    S('alternative_implementations',
      P('Program yang sama boleh ditulis tanpa pemboleh ubah perantaraan. Ia lebih pendek, tetapi nombor 8 dan 5 kini berulang dan maknanya tidak lagi dinyatakan:', 'The same program can be written without intermediate variables. It is shorter, but the numbers 8 and 5 now repeat and their meaning is no longer stated:'),
      CODE('ipo-inline', 'python', 'python', ['Versi tanpa pemboleh ubah', 'A version without variables'], `
print("Area:", 8 * 5)
print("Perimeter:", 2 * (8 + 5))
`, 'Area: 40\nPerimeter: 26'),
      EXPLAIN('ipo-inline',
        ['1–2', 'Proses dan output digabungkan dalam satu baris. Untuk menukar saiz segi empat, anda mesti mengubah **empat** nombor di dua tempat — mudah tersilap. Versi dengan pemboleh ubah hanya perlu satu perubahan bagi setiap nilai.', 'Process and output are combined on one line. To change the rectangle’s size you must edit **four** numbers in two places — easy to get wrong. The version with variables needs one change per value.'])),
    S('common_mistakes',
      UL(
        ['Menganggap komputer "faham maksud" anda. Ia melaksanakan apa yang ditulis, termasuk kesilapan.', 'Assuming the computer "understands what you mean". It executes what is written, mistakes included.'],
        ['Membaca `=` sebagai "sama dengan". Dalam Python, `x = 5` bermaksud "simpan 5 dan namakan ia x".', 'Reading `=` as "equals". In Python, `x = 5` means "store 5 and name it x".'],
        ['Menggunakan nama sebelum ia diberi nilai, atau mengeja nama secara berbeza (`factr`) — `NameError`.', 'Using a name before it is given a value, or spelling it differently (`factr`) — `NameError`.'],
        ['Meletakkan koma hanya di dalam teks (`"Welcome,"`) dan terlupa koma yang memisahkan argumen.', 'Putting a comma only inside the text (`"Welcome,"`) and forgetting the comma that separates arguments.'],
        ['Terus menulis kod tanpa mengenal pasti input, proses dan output dahulu.', 'Writing code straight away without identifying the input, process and output first.'],
      )),
    S('debugging',
      P('Apabila output tidak seperti yang dijangka tetapi tiada ralat, cara paling berkesan ialah **menjejak keadaan**: cetak nilai pemboleh ubah selepas setiap langkah dan bandingkan dengan pengiraan tangan anda. Langkah pertama yang berbeza daripada jangkaan ialah tempat pepijat berada. Contoh berikut mencetak keadaan selepas setiap kemas kini baki tabung simpanan; jika baki akhir salah, anda boleh melihat dengan tepat langkah mana yang menyimpang.',
        'When the output is not what you expected but there is no error, the most effective technique is to **trace the state**: print the variables after every step and compare them with your hand calculation. The first step that differs from your expectation is where the bug is. The following example prints the state after each update of a savings balance; if the final balance were wrong, you could see exactly which step went astray.'),
      CODE('trace-savings', 'python', 'python', ['Menjejak keadaan langkah demi langkah', 'Tracing the state step by step'], `
balance = 50
print("start:", balance)
balance = balance + 20
print("after deposit:", balance)
balance = balance - 35
print("after purchase:", balance)
balance = balance * 2
print("after matching gift:", balance)
`, 'start: 50\nafter deposit: 70\nafter purchase: 35\nafter matching gift: 70'),
      EXPLAIN('trace-savings',
        ['1–2', 'Keadaan awal dicetak sebelum sebarang perubahan.', 'The initial state is printed before any change.'],
        ['3–4', '`balance = balance + 20` membaca nilai lama (50), menambah 20 dan mengikat semula nama kepada 70. Nama yang sama boleh merujuk kepada nilai yang berbeza dari masa ke masa.', '`balance = balance + 20` reads the old value (50), adds 20 and rebinds the name to 70. The same name can refer to different values over time.'],
        ['5–8', 'Dua lagi kemas kini, masing-masing diikuti oleh cetakan jejak. Bandingkan setiap baris output dengan jangkaan anda: 70 − 35 = 35, 35 × 2 = 70.', 'Two more updates, each followed by a trace print. Compare each output line with your expectation: 70 − 35 = 35, 35 × 2 = 70.'])),
    S('performance',
      P('Program dalam kuliah ini selesai dalam beberapa mikrosaat; prestasi belum menjadi isu. Walau bagaimanapun, model IPO membantu berfikir tentang prestasi kemudian: kebanyakan masa program sebenar dihabiskan sama ada menunggu **input** (pengguna, rangkaian, cakera) atau dalam **proses** yang berulang berjuta kali. Mengetahui di bahagian mana masa dihabiskan ialah langkah pertama sebelum mengoptimumkan apa-apa (PY304).',
        'The programs in this lecture finish in a few microseconds; performance is not yet an issue. Even so, the IPO model helps you think about performance later: most of a real program’s time is spent either waiting for **input** (the user, the network, the disk) or in a **process** repeated millions of times. Knowing where the time goes is the first step before optimising anything (PY304).')),
    S('software_engineering',
      P('Bandingkan dua program yang mengira harga tiket pameran untuk satu keluarga. Kedua-duanya betul, tetapi hanya satu yang mudah difahami dan diubah.', 'Compare two programs that calculate exhibition ticket prices for a family. Both are correct, but only one is easy to understand and change.'),
      CODE('ticket-poor', 'python', 'python', ['Pelaksanaan lemah: nombor ajaib dan nama kabur', 'Poor implementation: magic numbers and vague names'], `
a = 2
b = 3
print(a * 25 + b * 12)
`, '86'),
      EXPLAIN('ticket-poor',
        ['1–3', 'Apakah `a`, `b`, 25 dan 12? Pembaca mesti meneka. Jika harga tiket kanak-kanak berubah, anda perlu mencari nombor 12 di dalam ungkapan — dan berharap tiada 12 lain yang bermaksud perkara berbeza.', 'What are `a`, `b`, 25 and 12? The reader has to guess. If the child ticket price changes, you must hunt for the number 12 inside an expression — and hope no other 12 means something different.']),
      CODE('ticket-improved', 'python', 'python', ['Pelaksanaan lebih baik: nama bermakna dan IPO yang jelas', 'Improved implementation: meaningful names and clear IPO'], `
ADULT_PRICE = 25
CHILD_PRICE = 12

adults = 2
children = 3

total = adults * ADULT_PRICE + children * CHILD_PRICE
print("Total ticket price: RM", total)
`, 'Total ticket price: RM 86'),
      EXPLAIN('ticket-improved',
        ['1–2', 'Harga ialah **pemalar**: nama huruf besar (konvensyen [[pep-8|PEP 8]]) menandakan nilai yang tidak sepatutnya berubah semasa program berjalan.', 'The prices are **constants**: upper-case names (the [[pep-8|PEP 8]] convention) mark values that should not change while the program runs.'],
        ['4–5', 'Input untuk keluarga ini, dipisahkan daripada harga.', 'The input for this family, kept separate from the prices.'],
        ['7–8', 'Proses dan output yang boleh dibaca seperti ayat. Darab dikira sebelum tambah, jadi tiada kurungan diperlukan.', 'A process and output that read like a sentence. Multiplication is done before addition, so no parentheses are needed.'])),
    S('industry_use_cases',
      UL(
        ['**Perbankan:** pemindahan wang ialah IPO — input (akaun, jumlah), proses (semak baki, tolak, tambah), output (resit, rekod pangkalan data).', '**Banking:** a money transfer is IPO — input (accounts, amount), process (check balance, debit, credit), output (receipt, database record).'],
        ['**Kesihatan:** sistem klinik menerima bacaan tekanan darah (input), membandingkannya dengan julat normal (proses) dan memberi amaran kepada doktor (output).', '**Healthcare:** a clinic system receives blood-pressure readings (input), compares them with normal ranges (process) and alerts the doctor (output).'],
        ['**E-dagang:** troli beli-belah menjumlahkan harga, menggunakan baucar dan mengira kos penghantaran sebelum memaparkan jumlah.', '**E-commerce:** a shopping cart adds up prices, applies vouchers and calculates delivery before displaying the total.'],
        ['**Sains data:** saluran data membaca fail mentah, membersihkan dan meringkaskannya, kemudian menghasilkan carta dan laporan (PY401).', '**Data science:** a data pipeline reads raw files, cleans and summarises them, then produces charts and reports (PY401).'],
      )),
    S('practical_demonstration',
      OL(
        ['Dalam `ipo-rectangle`, tukar `length` kepada 12. Ramalkan kedua-dua output **sebelum** menjalankan, kemudian semak.', 'In `ipo-rectangle`, change `length` to 12. Predict both outputs **before** running, then check.'],
        ['Tambah baris yang mengira dan mencetak pepenjuru: `diagonal = (length ** 2 + width ** 2) ** 0.5`.', 'Add a line that calculates and prints the diagonal: `diagonal = (length ** 2 + width ** 2) ** 0.5`.'],
        ['Tulis model IPO (tiga senarai pendek) untuk aplikasi jadual bas sebelum menulis sebarang kod.', 'Write an IPO model (three short lists) for a bus timetable app before writing any code.'],
        ['Jalankan versi berpepijat `recipe-scaling` dan kenal pasti baris mana yang sudah berjalan sebelum ralat.', 'Run the buggy version of `recipe-scaling` and identify which lines had already run before the error.'],
      )),
    S('mini_project',
      P('**Penjejak langkah harian.** Tulis program yang menyimpan bilangan langkah untuk tiga hari, mengira jumlah dan purata, dan memaparkan berapa langkah lagi diperlukan untuk mencapai sasaran 30,000 langkah. Kenal pasti input, proses dan output dengan komen.', '**A daily step tracker.** Write a program that stores the number of steps for three days, calculates the total and the average, and shows how many more steps are needed to reach a target of 30,000 steps. Mark the input, process and output with comments.'),
      CODE('step-tracker', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
# Input
day1_steps = 8200
day2_steps = 10450
day3_steps = 7350
TARGET = 30000

# Process
total = day1_steps + day2_steps + day3_steps
average = total / 3
remaining = TARGET - total

# Output
print("Total steps:", total)
print("Daily average:", average)
print("Steps still needed:", remaining)
`, 'Total steps: 26000\nDaily average: 8666.666666666666\nSteps still needed: 4000'),
      EXPLAIN('step-tracker',
        ['2–5', 'Input: tiga bacaan dan sasaran sebagai pemalar.', 'Input: three readings and the target as a constant.'],
        ['8–10', 'Proses: jumlah, purata (bahagi `/` memberi float) dan baki ke sasaran.', 'Process: the total, the average (division `/` gives a float) and the remainder to the target.'],
        ['13–15', 'Output: purata dicetak dengan semua digitnya. Kuliah 3.1 dan kursus PY102 menunjukkan cara membundarkan dan memformat nombor.', 'Output: the average is printed with all its digits. Lecture 3.1 and course PY102 show how to round and format numbers.'])),
    S('summary',
      UL(
        ['Program ialah arahan tepat yang dilaksanakan satu demi satu oleh komputer.', 'A program is precise instructions executed one by one by a computer.'],
        ['Model IPO — input, proses, output — ialah cara pertama untuk merancang dan memahami program.', 'The IPO model — input, process, output — is the first way to plan and understand a program.'],
        ['Pemboleh ubah ialah nama bagi nilai; keadaan program ialah semua nilai pada satu ketika.', 'A variable is a name for a value; a program’s state is all its values at one moment.'],
        ['Ralat sintaks menghalang seluruh program daripada berjalan; `NameError` berlaku semasa baris itu dijalankan.', 'A syntax error stops the whole program from running; a `NameError` happens when that line runs.'],
        ['Nama bermakna dan struktur IPO yang jelas menjadikan program mudah dibaca dan diubah.', 'Meaningful names and a clear IPO structure make programs easy to read and change.'],
      )),
    S('knowledge_check',
      OL(
        ['Kenal pasti input, proses dan output bagi mesin ATM.', 'Identify the input, process and output of an ATM.'],
        ['Apakah output `x = 3`, `x = x * 4`, `print(x)`?', 'What is the output of `x = 3`, `x = x * 4`, `print(x)`?'],
        ['Mengapakah tiada prompt dipaparkan apabila program mengandungi ralat sintaks?', 'Why is no prompt shown when a program contains a syntax error?'],
        ['Apakah yang dimaksudkan dengan keadaan (state) program?', 'What is meant by a program’s state?'],
        ['Berikan dua sebab mengapa `ticket-improved` lebih baik daripada `ticket-poor`.', 'Give two reasons why `ticket-improved` is better than `ticket-poor`.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'The Python Tutorial — An Informal Introduction to Python', url: `${PYDOCS}/tutorial/introduction.html` },
        { title: 'Think Python, 3rd edition — Chapter 1: Programming as a way of thinking', url: `${THINK}/chap01.html` },
        { title: 'Python built-in functions — print() and input()', url: `${PYDOCS}/library/functions.html` },
        { title: 'Python Glossary', url: `${PYDOCS}/glossary.html` },
        { title: 'Automate the Boring Stuff with Python — Python Basics', url: 'https://automatetheboringstuff.com/3e/chapter1.html' },
      )),
  ],
};

// ─── 1.2 Programming languages: compiled versus interpreted ──────────────

export const PY101_1_2: LectureContentDef = {
  courseCode: 'PY101',
  module: 1,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan perbezaan antara kod mesin, bahasa himpunan dan bahasa peringkat tinggi.', 'Explain the difference between machine code, assembly language and high-level languages.'],
        ['Membandingkan pelaksanaan melalui [[compiler|pengkompil]] dan melalui [[interpreter|interpreter]], termasuk kelebihan dan kekurangan masing-masing.', 'Compare execution through a [[compiler|compiler]] and through an [[interpreter|interpreter]], including the advantages and disadvantages of each.'],
        ['Menerangkan bagaimana [[cpython|CPython]] mengkompil kod sumber kepada [[bytecode|bytecode]] dan menjalankannya dengan [[virtual-machine|mesin maya]].', 'Explain how [[cpython|CPython]] compiles source code to [[bytecode|bytecode]] and runs it on a [[virtual-machine|virtual machine]].'],
        ['Meramalkan sama ada sesuatu ralat dikesan sebelum program berjalan ([[syntax-error|ralat sintaks]]) atau semasa ia berjalan ([[runtime-error|ralat runtime]]).', 'Predict whether an error is detected before the program runs (a [[syntax-error|syntax error]]) or while it runs (a [[runtime-error|runtime error]]).'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1: program, kod sumber dan model IPO.', 'Lecture 1.1: programs, source code and the IPO model.'],
        ['Membaca program pendek dengan pemboleh ubah dan `print()`.', 'Reading short programs with variables and `print()`.'],
      )),
    S('introduction',
      P('CPU hanya memahami kod mesin, tetapi manusia menulis dalam bahasa seperti Python, Java atau C. Seseorang — atau lebih tepat, sesuatu program — mesti menterjemah. Terdapat dua strategi utama: menterjemah keseluruhan program terlebih dahulu (**pengkompil**), atau membaca dan melaksanakannya sedikit demi sedikit (**interpreter**). Pilihan ini mempengaruhi kelajuan, mudah alih, cara ralat dilaporkan dan pengalaman pengaturcara setiap hari.',
        'A CPU understands only machine code, but people write in languages such as Python, Java or C. Someone — or more precisely, some program — must translate. There are two main strategies: translate the whole program in advance (a **compiler**), or read and execute it piece by piece (an **interpreter**). This choice affects speed, portability, how errors are reported and the programmer’s everyday experience.'),
      P('Python sering dipanggil "bahasa interpreted", tetapi kebenarannya lebih menarik: CPython melakukan **kedua-duanya**. Kuliah ini menunjukkan langkah-langkah itu dengan alat Python sendiri.', 'Python is often called an "interpreted language", but the truth is more interesting: CPython does **both**. This lecture shows those steps with Python’s own tools.'),
      KEY('CPython: kod sumber → (kompil) → bytecode → (interpreter / mesin maya) → tindakan. Ralat sintaks dikesan pada langkah pertama; ralat runtime pada langkah kedua.', 'CPython: source code → (compile) → bytecode → (interpreter / virtual machine) → actions. Syntax errors are caught at the first step; runtime errors at the second.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Kod mesin:** arahan binari khusus untuk satu keluarga CPU (x86-64, ARM). Program untuk satu keluarga tidak berjalan pada keluarga lain.', '**Machine code:** binary instructions specific to one CPU family (x86-64, ARM). A program for one family does not run on another.'],
        ['**Bahasa himpunan (assembly):** nama yang boleh dibaca bagi arahan mesin (`MOV`, `ADD`). Masih bergantung pada CPU.', '**Assembly language:** readable names for machine instructions (`MOV`, `ADD`). Still CPU-specific.'],
        ['**Bahasa peringkat tinggi:** Python, Java, C — dekat dengan cara manusia berfikir dan tidak bergantung pada CPU.', '**High-level language:** Python, Java, C — close to how people think and independent of the CPU.'],
        ['**[[compiler|Pengkompil]]:** menterjemah seluruh program sebelum ia dijalankan (C, C++, Rust, Go).', '**[[compiler|Compiler]]:** translates the whole program before it runs (C, C++, Rust, Go).'],
        ['**[[interpreter|Interpreter]]:** membaca dan melaksanakan program semasa ia berjalan.', '**[[interpreter|Interpreter]]:** reads and executes the program while it runs.'],
        ['**Model hibrid:** Java, C# dan Python mengkompil kepada [[bytecode|bytecode]] mudah alih, kemudian [[virtual-machine|mesin maya]] menjalankannya.', '**Hybrid model:** Java, C# and Python compile to portable [[bytecode|bytecode]], then a [[virtual-machine|virtual machine]] runs it.'],
      )),
    S('detailed_theory',
      P('Bahasa yang dikompil terus kepada kod mesin, seperti C, menghasilkan fail boleh laksana (contohnya `app.exe`). Pengkompil mempunyai masa untuk menganalisis seluruh program dan mengoptimumkannya, jadi program itu biasanya sangat pantas, dan pengguna tidak memerlukan pengkompil untuk menjalankannya. Harganya: kitaran "ubah → kompil → jalan" lebih panjang, dan fail boleh laksana itu terikat kepada satu sistem pengendalian dan satu keluarga CPU. Interpreter tulen pula membaca kod sumber dan melaksanakannya serta-merta; anda boleh mencuba idea dengan pantas dan program yang sama berjalan di mana-mana sahaja interpreter wujud, tetapi pelaksanaan lebih perlahan kerana kerja terjemahan berlaku semasa program berjalan.',
        'Languages compiled straight to machine code, such as C, produce an executable file (for example `app.exe`). The compiler has time to analyse the whole program and optimise it, so the program is usually very fast, and users do not need the compiler to run it. The price: the "edit → compile → run" cycle is longer, and the executable is tied to one operating system and one CPU family. A pure interpreter instead reads the source code and executes it immediately; you can try ideas quickly and the same program runs anywhere the interpreter exists, but execution is slower because translation work happens while the program runs.'),
      P('[[cpython|CPython]], pelaksanaan rasmi Python, menggunakan model hibrid. Apabila anda menjalankan `python3 app.py`, CPython (1) membaca seluruh fail dan memecahkannya kepada token, (2) membina pepohon sintaks dan menyemak tatabahasa — di sinilah **ralat sintaks** ditemui, sebelum mana-mana baris dijalankan, (3) mengkompil pepohon itu kepada [[bytecode|bytecode]]: arahan ringkas untuk mesin maya Python, bukan untuk CPU sebenar, dan (4) **mesin maya Python** (PVM) — satu gelung dalam CPython — melaksanakan bytecode itu satu arahan demi satu arahan. Ralat seperti membahagi dengan sifar atau nama yang tidak wujud hanya ditemui pada langkah 4, apabila baris itu benar-benar dilaksanakan; sebab itu output baris sebelumnya sudah kelihatan.',
        '[[cpython|CPython]], the official implementation of Python, uses the hybrid model. When you run `python3 app.py`, CPython (1) reads the whole file and splits it into tokens, (2) builds a syntax tree and checks the grammar — this is where **syntax errors** are found, before any line runs, (3) compiles that tree to [[bytecode|bytecode]]: simple instructions for the Python virtual machine, not for the real CPU, and (4) the **Python virtual machine** (PVM) — a loop inside CPython — executes that bytecode one instruction at a time. Errors such as dividing by zero or a name that does not exist are only found at step 4, when that line actually executes; that is why the output of earlier lines is already visible.'),
      P('Untuk modul yang diimport, CPython menyimpan bytecode dalam fail `.pyc` di folder `__pycache__` supaya langkah 1–3 tidak perlu diulang jika kod sumber tidak berubah. Python 3.13 juga memperkenalkan pengkompil JIT (just-in-time) eksperimen yang boleh menukar bytecode yang kerap digunakan kepada kod mesin semasa runtime — teknik yang sama digunakan oleh PyPy dan enjin JavaScript. Ia dimatikan secara lalai dan tidak mengubah cara anda menulis kod.',
        'For imported modules, CPython caches bytecode in `.pyc` files in a `__pycache__` folder so that steps 1–3 need not be repeated when the source has not changed. Python 3.13 also introduced an experimental just-in-time (JIT) compiler that can turn frequently used bytecode into machine code at run time — the same technique used by PyPy and JavaScript engines. It is off by default and does not change how you write code.')),
    S('technical_terminology', TERMS('compiler', 'interpreter', 'bytecode', 'virtual-machine', 'cpython', 'syntax-error', 'runtime-error')),
    S('syntax_rules',
      UL(
        ['`python3 app.py` (macOS/Linux) atau `py app.py` (Windows) mengkompil dan menjalankan satu skrip.', '`python3 app.py` (macOS/Linux) or `py app.py` (Windows) compiles and runs one script.'],
        ['`compile(teks, nama_fail, "exec")` ialah fungsi terbina dalam yang mengkompil teks sumber kepada objek kod tanpa menjalankannya.', '`compile(text, filename, "exec")` is a built-in function that compiles source text to a code object without running it.'],
        ['`exec(objek_kod)` menjalankan objek kod itu. (Dalam program biasa anda tidak memerlukan `compile`/`exec`; ia digunakan di sini untuk menunjukkan langkah dalaman.)', '`exec(code_object)` runs that code object. (Ordinary programs do not need `compile`/`exec`; they are used here to show the internal steps.)'],
        ['`import dis` memberi akses kepada pembongkar (disassembler) bytecode CPython.', '`import dis` gives access to CPython’s bytecode disassembler.'],
      )),
    S('code_demonstration',
      CODE('two-phases', 'python', 'python', ['Dua fasa: kompil, kemudian jalankan', 'Two phases: compile, then run'], `
source = 'print("Hello from compiled code")\\nprint(2 + 3)'
program = compile(source, "lesson.py", "exec")
print("Compiled into a", type(program).__name__, "object")
print("Running it now:")
exec(program)
`, 'Compiled into a code object\nRunning it now:\nHello from compiled code\n5'),
      EXPLAIN('two-phases',
        ['1', 'Kod sumber sebagai teks: dua baris Python dalam satu string (`\\n` ialah aksara baris baharu).', 'Source code as text: two lines of Python in one string (`\\n` is the newline character).'],
        ['2', 'Fasa 1: `compile` menghurai dan menterjemah teks itu kepada **objek kod** yang mengandungi bytecode. Tiada apa-apa dicetak — kod belum dijalankan.', 'Phase 1: `compile` parses and translates the text into a **code object** containing bytecode. Nothing is printed — the code has not run yet.'],
        ['3–4', 'Bukti bahawa hasil kompil ialah objek jenis `code`, bukan output.', 'Proof that the result of compiling is an object of type `code`, not output.'],
        ['5', 'Fasa 2: `exec` menyerahkan bytecode kepada mesin maya, yang melaksanakannya — barulah dua baris output muncul.', 'Phase 2: `exec` hands the bytecode to the virtual machine, which executes it — only now do the two output lines appear.'])),
    S('complete_examples',
      P('Dua contoh berikut membuktikan bila setiap jenis ralat dikesan. Jalankan versi betul, kemudian versi berpepijat, dan bandingkan output yang sempat dicetak.', 'The next two examples prove when each kind of error is detected. Run the correct version, then the buggy one, and compare the output that gets printed.'),
      CODE('whole-file-checked', 'python', 'python', ['Ralat sintaks: tiada baris dijalankan', 'Syntax error: no line runs'], `
print("Line 1 runs")
print("Line 2 runs")
print("Line 3 runs")
`, 'Line 1 runs\nLine 2 runs\nLine 3 runs', {
        debug: BUG(`
print("Line 1 runs")
print("Line 2 runs")
print("Line 3 runs"
`, "example.py:3: SyntaxError: '(' was never closed",
          'Kurungan pada baris 3 tidak ditutup. Walaupun baris 1 dan 2 betul, **tiada output langsung**: CPython mengkompil seluruh fail sebelum melaksanakan mana-mana bytecode, dan pengkompilan gagal. Inilah tanda ralat sintaks — program tidak bermula. Tambah `)` di hujung baris 3.',
          'The parenthesis on line 3 is never closed. Even though lines 1 and 2 are correct, there is **no output at all**: CPython compiles the whole file before executing any bytecode, and compilation fails. That is the signature of a syntax error — the program never starts. Add `)` at the end of line 3.'),
      }),
      EXPLAIN('whole-file-checked',
        ['1–3', 'Tiga pernyataan bebas. Versi betul mencetak ketiga-tiganya mengikut susunan.', 'Three independent statements. The correct version prints all three in order.']),
      CODE('runs-in-order', 'python', 'python', ['Ralat runtime: baris sebelumnya sudah berjalan', 'Runtime error: earlier lines have already run'], `
total_marks = 240
subjects = 3
print("Total:", total_marks)
print("Average:", total_marks / subjects)
print("Done")
`, 'Total: 240\nAverage: 80.0\nDone', {
        debug: BUG(`
total_marks = 240
subjects = 0
print("Total:", total_marks)
print("Average:", total_marks / subjects)
print("Done")
`, 'example.py:4: ZeroDivisionError: division by zero',
          'Sintaks fail ini sah, jadi ia dikompil dan mula berjalan: `Total: 240` dicetak. Masalah hanya ditemui apabila mesin maya melaksanakan pembahagian pada baris 4, dengan `subjects` bernilai 0. `print("Done")` tidak pernah berjalan. Ralat runtime bergantung pada **data**, bukan tatabahasa — kod yang sama berfungsi apabila `subjects` bukan sifar.',
          'This file’s syntax is valid, so it compiles and starts running: `Total: 240` is printed. The problem is only found when the virtual machine executes the division on line 4 with `subjects` equal to 0. `print("Done")` never runs. A runtime error depends on **data**, not grammar — the same code works when `subjects` is not zero.'),
      }),
      EXPLAIN('runs-in-order',
        ['1–2', 'Data input: jumlah markah dan bilangan subjek.', 'Input data: the total marks and the number of subjects.'],
        ['3', 'Output pertama berlaku sebelum sebarang pembahagian.', 'The first output happens before any division.'],
        ['4', '`240 / 3` memberi `80.0`. Pembahagian ialah operasi yang boleh gagal semasa runtime jika penyebutnya sifar.', '`240 / 3` gives `80.0`. Division is an operation that can fail at run time if the divisor is zero.'],
        ['5', 'Hanya dicapai jika semua baris sebelumnya berjaya.', 'Only reached if every earlier line succeeded.'])),
    S('line_by_line',
      EXPLAIN('two-phases',
        ['2', 'Argumen kedua, `"lesson.py"`, ialah nama fail yang akan muncul dalam traceback jika kod itu gagal; argumen ketiga, `"exec"`, bermaksud "urutan pernyataan" (berbanding `"eval"` untuk satu ungkapan).', 'The second argument, `"lesson.py"`, is the file name that would appear in a traceback if the code failed; the third, `"exec"`, means "a sequence of statements" (as opposed to `"eval"` for a single expression).']),
      EXPLAIN('runs-in-order',
        ['4', 'Di dalam mesin maya, baris ini menjadi beberapa arahan bytecode: muat `total_marks`, muat `subjects`, `BINARY_OP` (bahagi), kemudian panggil `print`. Ralat berlaku tepat pada arahan `BINARY_OP`.', 'Inside the virtual machine, this line becomes several bytecode instructions: load `total_marks`, load `subjects`, `BINARY_OP` (divide), then call `print`. The error happens exactly at the `BINARY_OP` instruction.'])),
    S('why_this_way',
      P('Mengapa Python tidak dikompil terus kepada kod mesin seperti C? Kerana Python ialah bahasa **dinamik**: jenis pemboleh ubah hanya diketahui semasa program berjalan (`x` boleh menjadi nombor, kemudian teks). Pengkompil kod mesin perlu mengetahui jenis lebih awal untuk menjana arahan yang cekap. Bytecode memberi jalan tengah: langkah analisis yang mahal dilakukan sekali, mesin maya mengendalikan sifat dinamik, dan fail `.py` yang sama berjalan pada Windows, macOS, Linux dan Raspberry Pi tanpa perubahan.',
        'Why is Python not compiled straight to machine code like C? Because Python is a **dynamic** language: a variable’s type is only known while the program runs (`x` can be a number, then text). A machine-code compiler needs to know types in advance to generate efficient instructions. Bytecode offers a middle way: the expensive analysis is done once, the virtual machine handles the dynamic behaviour, and the same `.py` file runs on Windows, macOS, Linux and a Raspberry Pi without changes.'),
      P('Bagi pelajar, model ini memberi kelebihan besar: anda boleh menukar satu baris dan menjalankannya semula serta-merta, dan ralat dilaporkan dengan nama fail, nombor baris dan penerangan yang jelas.', 'For learners, this model gives a big advantage: you can change one line and run it again immediately, and errors are reported with the file name, the line number and a clear description.')),
    S('execution_flow',
      OL(
        ['**Tokenisasi:** teks dipecah kepada token — nama, operator, nombor, string.', '**Tokenising:** the text is split into tokens — names, operators, numbers, strings.'],
        ['**Penghuraian (parsing):** token disusun menjadi pepohon sintaks abstrak (AST). Kurungan yang tidak ditutup atau `:` yang tertinggal ditemui di sini.', '**Parsing:** tokens are arranged into an abstract syntax tree (AST). An unclosed parenthesis or a missing `:` is found here.'],
        ['**Kompil:** AST diterjemah kepada objek kod yang mengandungi bytecode.', '**Compiling:** the AST is translated into a code object containing bytecode.'],
        ['**Pelaksanaan:** mesin maya melaksanakan bytecode dari atas ke bawah. Exception seperti `ZeroDivisionError` berlaku di sini.', '**Execution:** the virtual machine executes the bytecode from top to bottom. Exceptions such as `ZeroDivisionError` happen here.'],
        ['**Tamat:** selepas pernyataan terakhir, atau apabila exception tidak dikendalikan, program berhenti dan CPython membebaskan ingatannya.', '**Finish:** after the last statement, or when an exception is not handled, the program stops and CPython frees its memory.'],
      )),
    S('memory_behaviour',
      P('Objek kod yang dihasilkan oleh `compile` ialah objek Python biasa dalam ingatan: ia mengandungi bait bytecode, senarai pemalar (seperti `"Hello from compiled code"` dan `2`) dan senarai nama yang digunakan. Mesin maya CPython ialah **mesin tindanan** (stack machine): setiap arahan menolak nilai ke atas tindanan nilai atau mengambilnya daripada tindanan. Contohnya, `2 + 3` menjadi "tolak 2, tolak 3, tambah dua nilai teratas". Bagi `print(2 + 3)` sahaja, pengkompil CPython malah melipat pemalar dan menyimpan `5` terus — pengoptimuman kecil yang dilakukan sebelum runtime.',
        'The code object produced by `compile` is an ordinary Python object in memory: it holds the bytecode bytes, a list of constants (such as `"Hello from compiled code"` and `2`) and a list of the names used. CPython’s virtual machine is a **stack machine**: each instruction pushes values onto a value stack or pops them off. For example, `2 + 3` becomes "push 2, push 3, add the top two values". For `print(2 + 3)` specifically, CPython’s compiler even folds the constants and stores `5` directly — a small optimisation done before run time.')),
    S('alternative_implementations',
      P('Daripada `compile` dan `exec` secara manual, modul standard `py_compile` melakukan apa yang CPython lakukan untuk modul yang diimport: menulis bytecode ke fail `.pyc`. Empat bait pertama fail itu ialah "nombor ajaib" yang mengenal pasti versi bytecode:', 'Instead of `compile` and `exec` by hand, the standard module `py_compile` does what CPython does for imported modules: it writes the bytecode to a `.pyc` file. The first four bytes of that file are a "magic number" identifying the bytecode version:'),
      CODE('pyc-file', 'python', 'python', ['Menyimpan bytecode ke fail .pyc', 'Saving bytecode to a .pyc file'], `
import importlib.util
import py_compile
from pathlib import Path

Path("greet.py").write_text('print("hi")\\n')
cached = py_compile.compile("greet.py", cfile="greet.pyc")
print(cached)
header = Path(cached).read_bytes()[:4]
print(header == importlib.util.MAGIC_NUMBER)
`, 'greet.pyc\nTrue'),
      EXPLAIN('pyc-file',
        ['1–3', 'Tiga modul pustaka standard: `importlib.util` (nombor ajaib), `py_compile` (pengkompil ke fail) dan `pathlib` (fail dan laluan).', 'Three standard-library modules: `importlib.util` (the magic number), `py_compile` (compiling to a file) and `pathlib` (files and paths).'],
        ['5', 'Mencipta skrip kecil `greet.py` dalam direktori semasa.', 'Creates a small script `greet.py` in the current directory.'],
        ['6–7', 'Mengkompil skrip itu kepada `greet.pyc` tanpa menjalankannya, dan mencetak nama fail yang ditulis.', 'Compiles that script to `greet.pyc` without running it, and prints the name of the file written.'],
        ['8–9', 'Empat bait pertama fail `.pyc` sepadan dengan nombor ajaib Python yang sedang berjalan — fail `.pyc` daripada versi Python lain tidak akan digunakan.', 'The first four bytes of the `.pyc` file match the running Python’s magic number — a `.pyc` from a different Python version would not be used.'])),
    S('common_mistakes',
      UL(
        ['Menyangka Python "tidak dikompil langsung". CPython mengkompil kepada bytecode; ia cuma tidak menghasilkan fail `.exe`.', 'Believing Python is "not compiled at all". CPython compiles to bytecode; it just does not produce an `.exe` file.'],
        ['Menjangka output separa apabila terdapat ralat sintaks. Ralat sintaks menghalang **seluruh** fail daripada berjalan.', 'Expecting partial output when there is a syntax error. A syntax error stops the **whole** file from running.'],
        ['Menganggap program yang berjalan sekali tanpa ralat adalah betul. Ralat runtime bergantung pada data — `subjects = 0` mungkin muncul esok.', 'Assuming a program that ran once without errors is correct. Runtime errors depend on data — `subjects = 0` might appear tomorrow.'],
        ['Memadam atau menyunting fail dalam `__pycache__` secara manual. Fail itu dijana semula secara automatik dan selamat diabaikan.', 'Deleting or editing files in `__pycache__` by hand. They are regenerated automatically and are safe to ignore.'],
      )),
    S('debugging',
      P('Soalan pertama apabila program gagal: **adakah apa-apa output dicetak?** Jika tiada langsung dan mesej menyebut `SyntaxError` atau `IndentationError`, masalahnya ialah tatabahasa — baca baris yang ditunjuk dan baris sebelumnya (kurungan yang tidak ditutup sering dilaporkan pada baris tempat ia bermula). Jika ada output dan kemudian traceback, masalahnya ialah runtime — fikirkan nilai data pada baris itu. Anda juga boleh menyemak sintaks tanpa menjalankan apa-apa dengan `compile()`, seperti yang dilakukan oleh editor kod di sebalik tabir:',
        'The first question when a program fails: **was any output printed?** If there was none at all and the message says `SyntaxError` or `IndentationError`, the problem is grammar — read the indicated line and the line before it (an unclosed parenthesis is often reported on the line where it started). If there was output and then a traceback, the problem is at run time — think about the data values on that line. You can also check syntax without running anything using `compile()`, as code editors do behind the scenes:'),
      CODE('syntax-checker', 'python', 'python', ['Penyemak sintaks tanpa menjalankan kod', 'A syntax checker that does not run the code'], `
snippets = ['print("ok")', 'print("missing"', 'print(1 / 0)']
for text in snippets:
    try:
        compile(text, "check", "exec")
        print("syntax OK:   ", text)
    except SyntaxError as error:
        print("syntax error:", error.msg)
`, 'syntax OK:    print("ok")\nsyntax error: \'(\' was never closed\nsyntax OK:    print(1 / 0)'),
      EXPLAIN('syntax-checker',
        ['1', 'Tiga coretan kod sebagai teks: satu betul, satu dengan kurungan terbuka, satu yang akan gagal semasa runtime.', 'Three code snippets as text: one correct, one with an open parenthesis, one that would fail at run time.'],
        ['2', 'Gelung `for` (diajar dalam PY103) memproses setiap coretan secara bergilir.', 'A `for` loop (taught in PY103) processes each snippet in turn.'],
        ['4–5', '`compile` sahaja — tiada `exec`. Jika kompil berjaya, sintaks sah.', '`compile` only — no `exec`. If compiling succeeds, the syntax is valid.'],
        ['6–7', '`try`/`except` (PY114) menangkap `SyntaxError` dan mencetak mesejnya. Perhatikan bahawa `print(1 / 0)` lulus semakan sintaks: pembahagian dengan sifar hanya dikesan semasa runtime.', '`try`/`except` (PY114) catches the `SyntaxError` and prints its message. Notice that `print(1 / 0)` passes the syntax check: division by zero is only detected at run time.'])),
    S('performance',
      P('Kod mesin yang dikompil daripada C biasanya 10 hingga 100 kali lebih pantas daripada bytecode CPython untuk gelung aritmetik tulen, kerana mesin maya mesti menyahkod setiap arahan dan menyemak jenis nilai semasa runtime. Walau bagaimanapun, kebanyakan program Python menghabiskan masa dalam pustaka yang ditulis dalam C (seperti NumPy) atau menunggu rangkaian dan cakera, jadi perbezaan itu jarang menjadi masalah. Python 3.11 hingga 3.13 menambah interpreter "khusus" (specialising adaptive interpreter) yang menjadikan bytecode biasa jauh lebih pantas, dan JIT eksperimen 3.13 ialah langkah seterusnya.',
        'Machine code compiled from C is usually 10 to 100 times faster than CPython bytecode for pure arithmetic loops, because the virtual machine must decode every instruction and check value types at run time. However, most Python programs spend their time in libraries written in C (such as NumPy) or waiting for the network and disk, so the difference rarely matters. Python 3.11 to 3.13 added a specialising adaptive interpreter that makes common bytecode much faster, and 3.13’s experimental JIT is the next step.'),
      CODE('show-bytecode', 'python', 'python', ['Melihat bytecode sesuatu fungsi (khusus CPython 3.13)', 'Viewing a function’s bytecode (specific to CPython 3.13)'], `
import dis

def area(width, height):
    return width * height

names = [instruction.opname for instruction in dis.get_instructions(area)]
print(names)
print(len(names), "instructions")
`, "['RESUME', 'LOAD_FAST_LOAD_FAST', 'BINARY_OP', 'RETURN_VALUE']\n4 instructions"),
      EXPLAIN('show-bytecode',
        ['1', 'Modul `dis` membongkar bytecode kepada nama arahan yang boleh dibaca.', 'The `dis` module disassembles bytecode into readable instruction names.'],
        ['3–4', 'Fungsi kecil (fungsi diajar dalam PY104). Ia dikompil apabila baris `def` dilaksanakan.', 'A small function (functions are taught in PY104). It is compiled when the `def` line executes.'],
        ['6–8', 'Hanya empat arahan bytecode: mula, muat kedua-dua parameter sekali gus, darab, pulangkan. Nama arahan berbeza antara versi Python — inilah sebabnya bytecode bukan format yang stabil untuk dikongsi.', 'Only four bytecode instructions: start, load both parameters at once, multiply, return. Instruction names differ between Python versions — which is why bytecode is not a stable format for sharing.'])),
    S('software_engineering',
      P('Kerana Python boleh mengkompil dan menjalankan teks semasa runtime, `eval()` kelihatan seperti cara mudah untuk menilai input pengguna. Ia sangat berbahaya: teks itu boleh mengandungi **apa-apa** kod Python, termasuk kod yang memadam fail.', 'Because Python can compile and run text at run time, `eval()` looks like an easy way to evaluate user input. It is very dangerous: that text can contain **any** Python code, including code that deletes files.'),
      CODE('eval-poor', 'python', 'python', ['Pelaksanaan lemah: eval pada teks luar', 'Poor implementation: eval on outside text'], `
user_text = "2 + 3 * 4"
print(eval(user_text))
`, '14'),
      EXPLAIN('eval-poor',
        ['1–2', 'Berfungsi untuk teks yang baik, tetapi jika `user_text` datang daripada pengguna, mereka boleh menaip `__import__("os").remove("data.txt")` dan `eval` akan menjalankannya. Jangan sekali-kali `eval` input yang tidak dipercayai.', 'It works for well-behaved text, but if `user_text` came from a user they could type `__import__("os").remove("data.txt")` and `eval` would run it. Never `eval` untrusted input.']),
      CODE('literal-improved', 'python', 'python', ['Pelaksanaan lebih baik: tukar data, jangan jalankan kod', 'Improved implementation: convert data, do not run code'], `
import ast

quantity_text = "12"
prices_text = "[2.5, 4.0, 1.5]"

quantity = int(quantity_text)
prices = ast.literal_eval(prices_text)
print(quantity * 2, sum(prices))
`, '24 8.0'),
      EXPLAIN('literal-improved',
        ['1', '`ast` ialah modul standard yang memahami sintaks Python tanpa melaksanakannya.', '`ast` is a standard module that understands Python syntax without executing it.'],
        ['3–4', 'Dua input dalam bentuk teks, seperti yang diterima daripada pengguna atau fail.', 'Two inputs in text form, as received from a user or a file.'],
        ['6', '`int()` hanya menukar teks nombor — apa-apa lain menimbulkan `ValueError`, bukan menjalankan kod.', '`int()` only converts numeric text — anything else raises `ValueError` instead of running code.'],
        ['7–8', '`ast.literal_eval` hanya menerima **literal** (nombor, string, senarai…), bukan panggilan fungsi. Ia selamat untuk data.', '`ast.literal_eval` accepts only **literals** (numbers, strings, lists…), not function calls. It is safe for data.'])),
    S('industry_use_cases',
      UL(
        ['**Pembangunan aplikasi:** Instagram (Django) dan banyak perkhidmatan web menjalankan Python yang di-interpret di pelayan; perubahan boleh dikerahkan tanpa langkah kompil yang panjang.', '**Application development:** Instagram (Django) and many web services run interpreted Python on their servers; changes can be deployed without a long compile step.'],
        ['**Sistem terbenam dan permainan:** C, C++ dan Rust dikompil kepada kod mesin apabila setiap mikrosaat dan bait penting.', '**Embedded systems and games:** C, C++ and Rust are compiled to machine code when every microsecond and byte matters.'],
        ['**Gabungan:** pustaka sains data (NumPy, pandas) ditulis dalam C/C++ yang dikompil, tetapi dipanggil daripada Python — kelajuan kod mesin dengan kemudahan Python.', '**Combination:** data-science libraries (NumPy, pandas) are written in compiled C/C++ but called from Python — machine-code speed with Python’s convenience.'],
        ['**Alat pembangun:** editor kod menggunakan penghurai Python untuk menandakan ralat sintaks semasa anda menaip, sebelum program dijalankan.', '**Developer tools:** code editors use Python’s parser to mark syntax errors as you type, before the program runs.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan kedua-dua versi `whole-file-checked` dan `runs-in-order`. Catat output yang dicetak sebelum setiap ralat.', 'Run both versions of `whole-file-checked` and `runs-in-order`. Note the output printed before each error.'],
        ['Tambah coretan keempat kepada `syntax-checker` yang tertinggal tanda petik penutup, dan ramalkan mesejnya.', 'Add a fourth snippet to `syntax-checker` that is missing its closing quote, and predict its message.'],
        ['Dalam `show-bytecode`, tukar `*` kepada `+` dan semak sama ada senarai arahan berubah.', 'In `show-bytecode`, change `*` to `+` and check whether the instruction list changes.'],
      )),
    S('mini_project',
      P('**Pemerhati token.** Langkah pertama penterjemah ialah memecah teks kepada token. Tulis program yang menggunakan modul standard `tokenize` untuk memaparkan jenis dan teks setiap token bagi baris `area = 8 * 5`.', '**A token viewer.** A translator’s first step is splitting text into tokens. Write a program that uses the standard `tokenize` module to show the type and text of each token in the line `area = 8 * 5`.'),
      CODE('token-viewer', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
import io
import tokenize

source = "area = 8 * 5\\n"
reader = io.StringIO(source).readline
for token in tokenize.generate_tokens(reader):
    if token.type in (tokenize.NAME, tokenize.OP, tokenize.NUMBER):
        print(tokenize.tok_name[token.type], repr(token.string))
`, "NAME 'area'\nOP '='\nNUMBER '8'\nOP '*'\nNUMBER '5'"),
      EXPLAIN('token-viewer',
        ['1–2', '`io` membolehkan teks dibaca seperti fail; `tokenize` ialah tokeniser yang sama digunakan oleh alat Python.', '`io` lets text be read like a file; `tokenize` is the same tokeniser used by Python tools.'],
        ['4–5', 'Satu baris kod sumber, dan fungsi yang membacanya baris demi baris.', 'One line of source code, and a function that reads it line by line.'],
        ['6–8', 'Untuk setiap token, hanya nama, operator dan nombor dipaparkan (token baris baharu dan penamat dilangkau). `repr` menunjukkan teks token dalam tanda petik.', 'For each token, only names, operators and numbers are shown (newline and end-marker tokens are skipped). `repr` shows the token text in quotes.'])),
    S('summary',
      UL(
        ['CPU hanya melaksanakan kod mesin; bahasa peringkat tinggi mesti diterjemah.', 'A CPU only executes machine code; high-level languages must be translated.'],
        ['Pengkompil menterjemah dahulu (pantas, kurang mudah alih); interpreter menterjemah semasa berjalan (fleksibel, lebih perlahan).', 'A compiler translates first (fast, less portable); an interpreter translates while running (flexible, slower).'],
        ['CPython mengkompil kod sumber kepada bytecode, kemudian mesin maya Python melaksanakannya.', 'CPython compiles source code to bytecode, then the Python virtual machine executes it.'],
        ['Ralat sintaks: dikesan semasa kompil, tiada output. Ralat runtime: dikesan semasa pelaksanaan, selepas output terdahulu.', 'Syntax errors: found while compiling, no output. Runtime errors: found during execution, after earlier output.'],
        ['Jangan gunakan `eval` pada input yang tidak dipercayai.', 'Never use `eval` on untrusted input.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah program C yang dikompil untuk Windows tidak berjalan di macOS, tetapi fail `.py` yang sama berjalan pada kedua-duanya?', 'Why does a C program compiled for Windows not run on macOS, while the same `.py` file runs on both?'],
        ['Senaraikan empat langkah CPython daripada fail `.py` hingga tindakan.', 'List CPython’s four steps from a `.py` file to actions.'],
        ['Satu program mencetak dua baris kemudian gagal. Adakah ini ralat sintaks atau ralat runtime? Terangkan.', 'A program prints two lines and then fails. Is this a syntax error or a runtime error? Explain.'],
        ['Apakah kandungan folder `__pycache__`?', 'What does the `__pycache__` folder contain?'],
        ['Mengapakah `eval(input())` berbahaya?', 'Why is `eval(input())` dangerous?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Python Glossary — bytecode, interpreted, virtual machine', url: `${PYDOCS}/glossary.html#term-bytecode` },
        { title: 'dis — Disassembler for Python bytecode', url: `${PYDOCS}/library/dis.html` },
        { title: 'py_compile — Compile Python source files', url: `${PYDOCS}/library/py_compile.html` },
        { title: 'Python built-in functions — compile(), eval(), exec()', url: `${PYDOCS}/library/functions.html#compile` },
        { title: 'What’s New in Python 3.13 — experimental JIT compiler', url: `${PYDOCS}/whatsnew/3.13.html` },
        { title: 'Think Python, 3rd edition — Chapter 1', url: `${THINK}/chap01.html` },
      )),
  ],
};

// ─── 1.3 Why Python? History and application areas ───────────────────────

export const PY101_1_3: LectureContentDef = {
  courseCode: 'PY101',
  module: 1,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan asal-usul Python (Guido van Rossum, 1991) dan peristiwa penting dalam sejarahnya, termasuk peralihan Python 2 → 3.', 'Describe Python’s origins (Guido van Rossum, 1991) and key events in its history, including the Python 2 → 3 transition.'],
        ['Menerangkan prinsip reka bentuk Python yang dinyatakan dalam "The Zen of Python".', 'Explain Python’s design principles as stated in "The Zen of Python".'],
        ['Mengenal pasti bidang penggunaan utama Python dan pustaka standard "batteries included".', 'Identify Python’s main application areas and its "batteries included" standard library.'],
        ['Menilai bila Python sesuai dan bila bahasa lain lebih sesuai.', 'Evaluate when Python is a good fit and when another language fits better.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 1.1 (program dan IPO) dan 1.2 (pengkompil, interpreter, CPython).', 'Lectures 1.1 (programs and IPO) and 1.2 (compilers, interpreters, CPython).'],
      )),
    S('introduction',
      P('Terdapat ratusan bahasa pengaturcaraan. Mengapa universiti, syarikat permulaan, makmal sains dan syarikat gergasi teknologi memilih Python? Jawapannya terletak pada sejarah dan falsafah reka bentuknya: Python dicipta supaya kod **mudah dibaca**, dan ia datang dengan pustaka standard yang besar sehingga banyak tugas boleh diselesaikan tanpa memasang apa-apa. Hari ini Python antara bahasa paling popular di dunia, digunakan daripada skrip automasi ringkas hingga sistem kecerdasan buatan.',
        'There are hundreds of programming languages. Why do universities, start-ups, science labs and technology giants choose Python? The answer lies in its history and design philosophy: Python was created so that code is **easy to read**, and it comes with a large standard library, so many tasks can be done without installing anything. Today Python is among the most popular languages in the world, used from small automation scripts to artificial-intelligence systems.'),
      KEY('Python mengutamakan kebolehbacaan: "Readability counts."', 'Python puts readability first: "Readability counts."', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**1989–1991:** Guido van Rossum mula membina Python di CWI, Belanda; versi 0.9.0 diterbitkan pada Februari 1991. Namanya diambil daripada rancangan komedi "Monty Python’s Flying Circus", bukan ular.', '**1989–1991:** Guido van Rossum began building Python at CWI in the Netherlands; version 0.9.0 was released in February 1991. The name comes from the comedy show "Monty Python’s Flying Circus", not the snake.'],
        ['**2000:** Python 2.0 — pengutip sampah dan pembangunan komuniti terbuka.', '**2000:** Python 2.0 — a garbage collector and open community development.'],
        ['**2008:** Python 3.0 — membetulkan reka bentuk lama (contohnya `print` menjadi fungsi, teks Unicode secara lalai), walaupun memecahkan keserasian.', '**2008:** Python 3.0 — fixed old design decisions (for example `print` became a function, text is Unicode by default), even though it broke compatibility.'],
        ['**2020:** Python 2 tamat sokongan. **2024:** Python 3.13 — shell interaktif baharu, mod tanpa GIL dan JIT eksperimen.', '**2020:** Python 2 reached end of life. **2024:** Python 3.13 — a new interactive shell, an experimental free-threaded (no-GIL) mode and an experimental JIT.'],
        ['**Python Software Foundation (PSF):** organisasi bukan untung yang memegang hak Python; bahasa ini berkembang melalui PEP (Python Enhancement Proposals).', '**Python Software Foundation (PSF):** the non-profit that holds Python’s rights; the language evolves through PEPs (Python Enhancement Proposals).'],
        ['**"Batteries included":** pustaka standard yang besar — matematik, tarikh, fail, rangkaian, JSON, statistik — tersedia tanpa pemasangan.', '**"Batteries included":** a large standard library — maths, dates, files, networking, JSON, statistics — available without installation.'],
      )),
    S('detailed_theory',
      P('Python lahir sebagai reaksi terhadap bahasa yang sukar dibaca. Guido van Rossum mahukan bahasa yang sekuat C untuk tugas sebenar tetapi semudah bahasa pengajaran ABC yang pernah dibangunkannya. Hasilnya ialah beberapa keputusan reka bentuk yang masih membezakan Python: [[indentation|inden]] ialah sebahagian daripada sintaks, jadi struktur kod yang kelihatan sentiasa sama dengan struktur sebenar; kata kunci ialah perkataan Inggeris (`if`, `for`, `and`, `not in`) dan bukan simbol; dan biasanya ada **satu cara yang jelas** untuk melakukan sesuatu. Prinsip ini dikumpulkan oleh Tim Peters dalam "The Zen of Python" (PEP 20), yang boleh dipaparkan dengan `import this`.',
        'Python was born as a reaction against hard-to-read languages. Guido van Rossum wanted a language as capable as C for real tasks but as easy as ABC, the teaching language he had worked on. The result was a few design decisions that still set Python apart: [[indentation|indentation]] is part of the syntax, so the visible structure of code always matches its real structure; keywords are English words (`if`, `for`, `and`, `not in`) rather than symbols; and there is usually **one obvious way** to do something. These principles were collected by Tim Peters in "The Zen of Python" (PEP 20), which you can display with `import this`.'),
      P('Peralihan dari Python 2 ke Python 3 (2008–2020) ialah pelajaran penting dalam kejuruteraan perisian. Python 3 membetulkan masalah sebenar — teks dan bait dicampur, pembahagian integer yang mengejutkan (`7 / 2` memberi `3` dalam Python 2), `print` sebagai pernyataan khas — tetapi kerana perubahan itu tidak serasi ke belakang, komuniti memerlukan dua belas tahun untuk berpindah sepenuhnya. Sebab itu anda masih akan menemui tutorial lama dengan `print "Hello"`, yang merupakan ralat sintaks dalam Python 3. Sejak itu, Python mengeluarkan versi baharu setiap tahun pada bulan Oktober, dan setiap versi disokong selama lima tahun.',
        'The transition from Python 2 to Python 3 (2008–2020) is an important lesson in software engineering. Python 3 fixed real problems — text and bytes were mixed, integer division was surprising (`7 / 2` gave `3` in Python 2), `print` was a special statement — but because the changes were not backward compatible, the community took twelve years to move completely. That is why you will still find old tutorials with `print "Hello"`, which is a syntax error in Python 3. Since then, Python has released a new version every October, and each version is supported for five years.'),
      P('Kekuatan Python hari ini datang daripada ekosistemnya. Pustaka standard menyelesaikan tugas harian, dan Python Package Index (PyPI) mengandungi lebih setengah juta pakej tambahan: NumPy dan pandas untuk data, Django dan FastAPI untuk web, PyTorch dan scikit-learn untuk pembelajaran mesin. Kelemahannya juga perlu difahami: CPython lebih perlahan daripada bahasa yang dikompil untuk pengiraan tulen, kurang sesuai untuk aplikasi mudah alih asli atau permainan 3D berprestasi tinggi, dan jenis dinamik bermaksud sesetengah ralat hanya kelihatan semasa runtime.',
        'Python’s strength today comes from its ecosystem. The standard library handles everyday tasks, and the Python Package Index (PyPI) holds more than half a million additional packages: NumPy and pandas for data, Django and FastAPI for the web, PyTorch and scikit-learn for machine learning. Its weaknesses must be understood too: CPython is slower than compiled languages for pure computation, less suited to native mobile apps or high-performance 3D games, and dynamic typing means some errors only show up at run time.')),
    S('technical_terminology', TERMS('cpython', 'pep-8', 'indentation', 'interpreter', 'module')),
    S('syntax_rules',
      UL(
        ['`import nama_modul` memuatkan modul daripada pustaka standard, contohnya `import math`.', '`import module_name` loads a module from the standard library, for example `import math`.'],
        ['`from modul import nama` mengambil satu nama sahaja, contohnya `from datetime import date`.', '`from module import name` takes just one name, for example `from datetime import date`.'],
        ['`modul.fungsi(...)` memanggil fungsi di dalam modul, contohnya `math.sqrt(2)`.', '`module.function(...)` calls a function inside a module, for example `math.sqrt(2)`.'],
        ['Dalam Python 3, `print` sentiasa memerlukan kurungan.', 'In Python 3, `print` always needs parentheses.'],
      )),
    S('code_demonstration',
      CODE('reads-like-english', 'python', 'python', ['Kod Python yang hampir seperti bahasa Inggeris', 'Python code that reads almost like English'], `
students = ["Aina", "Ben", "Chong", "Devi"]
for student in students:
    print("Hello,", student)
print(len(students), "students greeted")
print("Chong" in students, "Zara" in students)
`, 'Hello, Aina\nHello, Ben\nHello, Chong\nHello, Devi\n4 students greeted\nTrue False'),
      EXPLAIN('reads-like-english',
        ['1', 'Senarai empat nama. Kurungan segi empat `[]` mencipta senarai (PY111).', 'A list of four names. Square brackets `[]` create a list (PY111).'],
        ['2–3', '"Untuk setiap pelajar dalam senarai pelajar, cetak salam." Inden empat ruang menunjukkan bahawa `print` berada di dalam gelung.', '"For each student in students, print a greeting." The four-space indent shows that `print` is inside the loop.'],
        ['4', '`len` memberi bilangan item. Baris ini tidak berinden, jadi ia berjalan sekali selepas gelung.', '`len` gives the number of items. This line is not indented, so it runs once, after the loop.'],
        ['5', '`in` bertanya "adakah ... dalam ...?" dan memberi `True` atau `False`.', '`in` asks "is ... in ...?" and gives `True` or `False`.'])),
    S('complete_examples',
      CODE('batteries-included', 'python', 'python', ['"Batteries included": pustaka standard', '"Batteries included": the standard library'], `
import math
import statistics
from datetime import date

marks = [78, 85, 62, 90, 71]
print("Mean:", statistics.mean(marks))
print("Median:", statistics.median(marks))
print("Square root of 2:", round(math.sqrt(2), 4))
print("31 August 1957 was a", date(1957, 8, 31).strftime("%A"))
`, 'Mean: 77.2\nMedian: 78\nSquare root of 2: 1.4142\n31 August 1957 was a Saturday', {
        debug: BUG(`
import math
import statistic
from datetime import date

marks = [78, 85, 62, 90, 71]
print("Mean:", statistics.mean(marks))
`, "example.py:2: ModuleNotFoundError: No module named 'statistic'",
          'Nama modul ialah `statistics` (dengan "s"). `import` mencari modul dengan nama tepat itu dan menimbulkan `ModuleNotFoundError` jika tiada. Ini ralat runtime: baris 1 (`import math`) sudah berjaya. Semak ejaan dalam dokumentasi pustaka standard.',
          'The module is called `statistics` (with an "s"). `import` looks for a module with that exact name and raises `ModuleNotFoundError` if there is none. This is a runtime error: line 1 (`import math`) already succeeded. Check the spelling in the standard-library documentation.'),
      }),
      EXPLAIN('batteries-included',
        ['1–3', 'Tiga modul pustaka standard; tiada pemasangan diperlukan.', 'Three standard-library modules; no installation is needed.'],
        ['5', 'Lima markah dalam satu senarai.', 'Five marks in one list.'],
        ['6–7', 'Purata (386 / 5 = 77.2) dan median (nilai tengah selepas disusun: 62, 71, **78**, 85, 90).', 'The mean (386 / 5 = 77.2) and the median (the middle value after sorting: 62, 71, **78**, 85, 90).'],
        ['8', '`math.sqrt` dan `round(..., 4)` — punca kuasa dua dibundarkan kepada 4 tempat perpuluhan.', '`math.sqrt` and `round(..., 4)` — the square root rounded to 4 decimal places.'],
        ['9', '`date` mewakili tarikh; `strftime("%A")` memberi nama hari dalam bahasa Inggeris. Hari Kemerdekaan Malaysia jatuh pada hari Sabtu.', '`date` represents a date; `strftime("%A")` gives the weekday name in English. Malaysia’s Independence Day fell on a Saturday.']),
      CODE('python3-division', 'python', 'python', ['Python 3: pembahagian dan print yang betul', 'Python 3: correct division and print'], `
print(7 / 2)
print(7 // 2)
print(7 % 2)
`, '3.5\n3\n1', {
        debug: BUG(`
print 7 / 2
print(7 // 2)
`, "example.py:1: SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)?",
          'Ini sintaks Python 2, yang masih muncul dalam tutorial lama. Dalam Python 3, `print` ialah fungsi dan memerlukan kurungan. Python 3.13 mengenal pasti kesilapan ini secara khusus dan mencadangkan pembetulannya. Tukar kepada `print(7 / 2)`.',
          'This is Python 2 syntax, which still appears in old tutorials. In Python 3, `print` is a function and needs parentheses. Python 3.13 recognises this mistake specifically and suggests the fix. Change it to `print(7 / 2)`.'),
      }),
      EXPLAIN('python3-division',
        ['1', '`/` ialah pembahagian sebenar dan sentiasa memberi float: 3.5. (Dalam Python 2, hasilnya ialah 3 — salah satu sebab Python 3 dicipta.)', '`/` is true division and always gives a float: 3.5. (In Python 2 the result was 3 — one of the reasons Python 3 was created.)'],
        ['2–3', '`//` ialah pembahagian lantai (3) dan `%` ialah baki (1). Kedua-duanya diajar dalam PY102.', '`//` is floor division (3) and `%` is the remainder (1). Both are taught in PY102.'])),
    S('line_by_line',
      EXPLAIN('reads-like-english',
        ['2', 'Baris yang berakhir dengan `:` membuka blok. Semua baris berinden di bawahnya ialah badan gelung; bilangan pusingan ditentukan oleh bilangan item dalam senarai — empat.', 'A line ending in `:` opens a block. All the indented lines below it form the loop body; the number of passes is set by the number of items in the list — four.']),
      EXPLAIN('batteries-included',
        ['3', '`from datetime import date` membawa hanya nama `date` ke dalam program, jadi kita boleh menulis `date(...)` dan bukan `datetime.date(...)`.', '`from datetime import date` brings only the name `date` into the program, so we can write `date(...)` instead of `datetime.date(...)`.'])),
    S('why_this_way',
      P('Mengapa Python mengutamakan kebolehbacaan berbanding kependekan atau kelajuan? Kerana kos sebenar perisian ialah **masa manusia**: membaca, memahami, menyemak dan mengubah kod. Kajian industri secara konsisten mendapati pengatur cara menghabiskan lebih banyak masa membaca kod daripada menulisnya. Bahasa yang memaksa struktur yang jelas (inden) dan menggalakkan satu cara yang jelas menjadikan kod daripada orang yang berbeza kelihatan serupa, jadi pasukan boleh bekerja dengan lebih pantas.',
        'Why does Python put readability ahead of brevity or speed? Because the real cost of software is **human time**: reading, understanding, reviewing and changing code. Industry experience consistently finds that programmers spend more time reading code than writing it. A language that enforces visible structure (indentation) and encourages one obvious way makes code from different people look alike, so teams can work faster.'),
      P('Ini juga sebab Python menjadi bahasa pengajaran yang popular: pelajar memberi tumpuan kepada **idea** pengaturcaraan — urutan, keputusan, ulangan, data — tanpa terganggu oleh simbol yang banyak. Konsep yang anda pelajari di sini dipindahkan terus ke Java, C# atau JavaScript kemudian.', 'This is also why Python is a popular teaching language: learners focus on programming **ideas** — sequence, decisions, repetition, data — without being distracted by lots of symbols. The concepts you learn here transfer directly to Java, C# or JavaScript later.')),
    S('execution_flow',
      OL(
        ['Dalam `batteries-included`, baris 1–3 dilaksanakan dahulu: setiap `import` mencari modul, menjalankan kodnya sekali dan mengikat nama dalam program anda.', 'In `batteries-included`, lines 1–3 run first: each `import` finds the module, runs its code once and binds a name in your program.'],
        ['Baris 5 mencipta senarai; baris 6–9 memanggil fungsi daripada modul yang diimport, satu demi satu.', 'Line 5 creates the list; lines 6–9 call functions from the imported modules, one after another.'],
        ['Dalam versi berpepijat, pelaksanaan berhenti pada baris 2: `math` sudah dimuatkan, tetapi baris 5–6 tidak pernah berjalan.', 'In the buggy version, execution stops at line 2: `math` has already been loaded, but lines 5–6 never run.'],
      )),
    S('memory_behaviour',
      P('Setiap modul hanya dimuatkan **sekali** bagi setiap proses Python. Objek modul disimpan dalam kamus `sys.modules`; `import` kedua untuk modul yang sama hanya mengambil objek yang sedia ada. Inilah sebabnya mengimport modul besar seperti `statistics` di beberapa tempat tidak membazir ingatan. Pustaka standard yang besar juga tidak dimuatkan keseluruhannya — hanya modul yang anda import.',
        'Each module is loaded only **once** per Python process. Module objects are stored in the dictionary `sys.modules`; a second `import` of the same module simply fetches the existing object. That is why importing a large module such as `statistics` in several places does not waste memory. The large standard library is not loaded all at once either — only the modules you import.'),
      CODE('modules-loaded-once', 'python', 'python', ['Modul dimuatkan sekali sahaja', 'Modules are loaded only once'], `
import sys
import statistics
import statistics as stats

print("statistics" in sys.modules)
print(stats is statistics)
`, 'True\nTrue'),
      EXPLAIN('modules-loaded-once',
        ['1–3', 'Modul yang sama diimport dua kali, kali kedua dengan nama samaran `stats`.', 'The same module is imported twice, the second time under the alias `stats`.'],
        ['5', 'Modul yang dimuatkan direkodkan dalam `sys.modules`.', 'Loaded modules are recorded in `sys.modules`.'],
        ['6', '`is` menyemak sama ada dua nama merujuk kepada **objek yang sama** — ya, hanya satu objek modul wujud.', '`is` checks whether two names refer to the **same object** — yes, only one module object exists.'])),
    S('alternative_implementations',
      P('Python sering menyediakan fungsi terbina dalam untuk tugas biasa. Mengira purata boleh dilakukan secara manual, dengan fungsi terbina dalam, atau dengan modul `statistics` — semuanya memberi hasil yang sama:', 'Python often provides built-in functions for common tasks. An average can be calculated by hand, with built-in functions, or with the `statistics` module — all give the same result:'),
      CODE('three-averages', 'python', 'python', ['Tiga cara mengira purata', 'Three ways to calculate an average'], `
import statistics

marks = [78, 85, 62, 90, 71]
manual = (78 + 85 + 62 + 90 + 71) / 5
built_in = sum(marks) / len(marks)
library = statistics.mean(marks)
print(manual, built_in, library)
`, '77.2 77.2 77.2'),
      EXPLAIN('three-averages',
        ['1–3', 'Modul `statistics` diimport dan lima markah disimpan dalam senarai.', 'The `statistics` module is imported and five marks are stored in a list.'],
        ['4', 'Manual: mudah difahami, tetapi mesti diubah setiap kali senarai berubah.', 'By hand: easy to follow, but must be edited whenever the list changes.'],
        ['5', '`sum` dan `len` berfungsi untuk senarai apa-apa saiz — biasanya pilihan terbaik.', '`sum` and `len` work for a list of any size — usually the best choice.'],
        ['6–7', '`statistics.mean` menyatakan niat dengan paling jelas dan juga menyediakan median, mod dan sisihan piawai.', '`statistics.mean` states the intent most clearly and also provides the median, mode and standard deviation.'])),
    S('common_mistakes',
      UL(
        ['Mengikut tutorial Python 2 (`print "x"`, `raw_input()`). Pastikan sumber menggunakan Python 3.', 'Following Python 2 tutorials (`print "x"`, `raw_input()`). Make sure the source uses Python 3.'],
        ['Menamakan fail anda sendiri `statistics.py` atau `math.py` — ia akan menggantikan modul standard apabila diimport.', 'Naming your own file `statistics.py` or `math.py` — it will shadow the standard module when imported.'],
        ['Menganggap Python sesuai untuk segala-galanya. Untuk aplikasi iOS asli atau enjin permainan berprestasi tinggi, Swift atau C++ lebih sesuai.', 'Assuming Python suits everything. For native iOS apps or high-performance game engines, Swift or C++ fits better.'],
        ['Memasang pakej luar untuk tugas yang pustaka standard sudah lakukan (tarikh, JSON, statistik asas).', 'Installing third-party packages for tasks the standard library already does (dates, JSON, basic statistics).'],
      )),
    S('debugging',
      P('Apabila contoh daripada internet gagal, semak dahulu **versi** yang dijangka oleh contoh itu. Petanda kod Python 2 termasuk `print` tanpa kurungan, `raw_input`, `xrange` dan `except Exception, e`. Mesej Python 3.13 sering menamakan masalah itu secara langsung. Untuk `ModuleNotFoundError`, semak ejaan dan sama ada modul itu benar-benar sebahagian daripada pustaka standard atau perlu dipasang dengan `pip` (PY203). Program berikut memaparkan versi yang sedang berjalan — langkah pertama dalam sebarang laporan pepijat:',
        'When an example from the internet fails, first check which **version** it expects. Signs of Python 2 code include `print` without parentheses, `raw_input`, `xrange` and `except Exception, e`. Python 3.13’s messages often name the problem directly. For `ModuleNotFoundError`, check the spelling and whether the module really is part of the standard library or must be installed with `pip` (PY203). The following program shows the running version — the first step in any bug report:'),
      CODE('version-check', 'python', 'python', ['Menyemak versi Python yang sedang berjalan', 'Checking the running Python version'], `
import sys

major, minor = sys.version_info[:2]
print("Running Python", f"{major}.{minor}")
print("Python 3 or newer:", major >= 3)
print("At least 3.13:", sys.version_info >= (3, 13))
`, 'Running Python 3.13\nPython 3 or newer: True\nAt least 3.13: True'),
      EXPLAIN('version-check',
        ['1', 'Modul `sys` memberi maklumat tentang interpreter yang sedang berjalan.', 'The `sys` module gives information about the running interpreter.'],
        ['3', '`sys.version_info` mengandungi nombor versi; `[:2]` mengambil dua yang pertama (major, minor) dan menyimpannya dalam dua nama sekali gus.', '`sys.version_info` holds the version numbers; `[:2]` takes the first two (major, minor) and stores them in two names at once.'],
        ['4', 'F-string (`f"..."`) menggantikan `{major}` dan `{minor}` dengan nilainya (kuliah 3.1).', 'An f-string (`f"..."`) replaces `{major}` and `{minor}` with their values (lecture 3.1).'],
        ['5–6', 'Perbandingan memberi `True` atau `False`. Versi boleh dibandingkan sebagai tuple: `(3, 13)`.', 'Comparisons give `True` or `False`. Versions can be compared as tuples: `(3, 13)`.'])),
    S('performance',
      P('Jika kelajuan penting, Python menawarkan beberapa jalan tanpa meninggalkan bahasa: menggunakan fungsi terbina dalam dan pustaka yang ditulis dalam C (`sum`, `sorted`, NumPy), memilih algoritma yang lebih baik (PY212), atau menggunakan PyPy. Peraturan praktikal: tulis kod yang jelas dahulu, ukur, kemudian optimumkan bahagian yang benar-benar perlahan sahaja.',
        'When speed matters, Python offers several paths without leaving the language: using built-in functions and libraries written in C (`sum`, `sorted`, NumPy), choosing a better algorithm (PY212), or using PyPy. The practical rule: write clear code first, measure, then optimise only the parts that are really slow.')),
    S('software_engineering',
      P('Bahagian Zen of Python yang paling penting untuk pemula ialah "There should be one — and preferably only one — obvious way to do it". Bandingkan pelaksanaan yang mencipta semula alat sedia ada dengan pelaksanaan yang menggunakan Python secara idiomatik:', 'The part of the Zen of Python most important for beginners is "There should be one — and preferably only one — obvious way to do it". Compare an implementation that reinvents existing tools with one that uses Python idiomatically:'),
      CODE('highest-poor', 'python', 'python', ['Pelaksanaan lemah: mencipta semula max()', 'Poor implementation: reinventing max()'], `
temperatures = [31.5, 33.2, 29.8, 34.1, 32.0]
highest = temperatures[0]
for t in temperatures:
    if t > highest:
        highest = t
print("Highest:", highest)
`, 'Highest: 34.1'),
      EXPLAIN('highest-poor',
        ['1–2', 'Mula dengan nilai pertama sebagai calon tertinggi.', 'Start with the first value as the highest candidate.'],
        ['3–6', 'Gelung dan perbandingan manual — betul, tetapi enam baris untuk tugas yang Python sudah sediakan, dan setiap baris ialah tempat pepijat boleh bersembunyi.', 'A manual loop and comparison — correct, but six lines for a task Python already provides, and every line is a place for a bug to hide.']),
      CODE('highest-idiomatic', 'python', 'python', ['Pelaksanaan lebih baik: Python yang idiomatik', 'Improved implementation: idiomatic Python'], `
temperatures = [31.5, 33.2, 29.8, 34.1, 32.0]
print("Highest:", max(temperatures))
print("Lowest:", min(temperatures))
`, 'Highest: 34.1\nLowest: 29.8'),
      EXPLAIN('highest-idiomatic',
        ['1–3', '`max` dan `min` terbina dalam: lebih pendek, jelas niatnya, sudah diuji dan lebih pantas kerana ditulis dalam C.', 'The built-in `max` and `min`: shorter, clear in intent, already tested and faster because they are written in C.'])),
    S('industry_use_cases',
      UL(
        ['**Kecerdasan buatan dan pembelajaran mesin:** PyTorch, TensorFlow dan scikit-learn menjadikan Python bahasa utama AI.', '**Artificial intelligence and machine learning:** PyTorch, TensorFlow and scikit-learn make Python the main language of AI.'],
        ['**Sains data dan penyelidikan:** pandas, NumPy dan Jupyter digunakan dalam bank, hospital, makmal dan agensi kerajaan.', '**Data science and research:** pandas, NumPy and Jupyter are used in banks, hospitals, labs and government agencies.'],
        ['**Pembangunan web:** Django, Flask dan FastAPI menggerakkan laman seperti Instagram dan perkhidmatan API.', '**Web development:** Django, Flask and FastAPI power sites such as Instagram and API services.'],
        ['**Automasi dan DevOps:** skrip Python mengautomasikan laporan, fail, pelayan dan aliran kerja awan (Ansible ditulis dalam Python).', '**Automation and DevOps:** Python scripts automate reports, files, servers and cloud workflows (Ansible is written in Python).'],
        ['**Pendidikan dan sistem terbenam:** MicroPython berjalan pada papan mikropengawal seperti Raspberry Pi Pico.', '**Education and embedded systems:** MicroPython runs on microcontroller boards such as the Raspberry Pi Pico.'],
      )),
    S('practical_demonstration',
      OL(
        ['Jalankan `import this` dalam Python dan pilih tiga prinsip yang paling bermakna kepada anda. Terangkan setiap satu dengan ayat sendiri.', 'Run `import this` in Python and choose the three principles that mean most to you. Explain each in your own words.'],
        ['Dalam `batteries-included`, tukar tarikh kepada tarikh lahir anda dan cari hari kelahiran anda.', 'In `batteries-included`, change the date to your birth date and find the weekday you were born.'],
        ['Tambah `statistics.stdev(marks)` kepada `three-averages` dan bandingkan dengan pengiraan tangan.', 'Add `statistics.stdev(marks)` to `three-averages` and compare with a hand calculation.'],
      )),
    S('mini_project',
      P('**Kad fakta bahasa.** Tulis program yang memaparkan kad fakta Python: versi yang sedang berjalan, pelaksanaan, tahun keluaran pertama, umur bahasa pada tahun semasa yang ditetapkan, dan tiga bidang penggunaan dengan satu pustaka contoh setiap satu.', '**A language fact card.** Write a program that displays a Python fact card: the running version, the implementation, the year of first release, the language’s age in a given current year, and three application areas with one example library each.'),
      CODE('fact-card', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
import platform
import sys

FIRST_RELEASE = 1991
CURRENT_YEAR = 2026
areas = {"Data science": "pandas", "Web": "Django", "AI": "PyTorch"}

print("=== Python fact card ===")
print("Version:", f"{sys.version_info.major}.{sys.version_info.minor}")
print("Implementation:", platform.python_implementation())
print("First released:", FIRST_RELEASE)
print("Age in", CURRENT_YEAR, "->", CURRENT_YEAR - FIRST_RELEASE, "years")
for area, library in areas.items():
    print("-", area, "uses", library)
`, '=== Python fact card ===\nVersion: 3.13\nImplementation: CPython\nFirst released: 1991\nAge in 2026 -> 35 years\n- Data science uses pandas\n- Web uses Django\n- AI uses PyTorch'),
      EXPLAIN('fact-card',
        ['1–2', 'Modul untuk maklumat pelaksanaan dan versi.', 'Modules for implementation and version information.'],
        ['4–5', 'Pemalar. Tahun semasa ditetapkan supaya output sentiasa sama (program yang membaca jam akan berubah setiap tahun).', 'Constants. The current year is fixed so the output is always the same (a program that read the clock would change every year).'],
        ['6', 'Kamus memadankan bidang dengan pustaka (PY112).', 'A dictionary pairing areas with libraries (PY112).'],
        ['8–12', 'Kad fakta: versi, pelaksanaan dan pengiraan umur 2026 − 1991 = 35.', 'The fact card: version, implementation and the age calculation 2026 − 1991 = 35.'],
        ['13–14', 'Gelung atas pasangan kamus mencetak satu baris bagi setiap bidang.', 'A loop over the dictionary’s pairs prints one line per area.'])),
    S('summary',
      UL(
        ['Python dicipta oleh Guido van Rossum (keluaran pertama 1991) dengan kebolehbacaan sebagai matlamat utama.', 'Python was created by Guido van Rossum (first released 1991) with readability as its main goal.'],
        ['Python 3 (2008) membetulkan reka bentuk lama; Python 2 tamat pada 2020. Kod `print "x"` ialah Python 2.', 'Python 3 (2008) fixed old design decisions; Python 2 ended in 2020. Code like `print "x"` is Python 2.'],
        ['"The Zen of Python" (PEP 20) menyatakan prinsip reka bentuk; `import this` memaparkannya.', '"The Zen of Python" (PEP 20) states the design principles; `import this` displays it.'],
        ['Pustaka standard "batteries included" dan PyPI menjadikan Python berguna dalam AI, data, web dan automasi.', 'The "batteries included" standard library and PyPI make Python useful in AI, data, the web and automation.'],
        ['Gunakan alat terbina dalam (`max`, `sum`, `statistics`) daripada mencipta semula.', 'Use built-in tools (`max`, `sum`, `statistics`) rather than reinventing them.'],
      )),
    S('knowledge_check',
      OL(
        ['Dari mana nama "Python" berasal?', 'Where does the name "Python" come from?'],
        ['Berikan dua perubahan utama dalam Python 3 berbanding Python 2.', 'Give two major changes in Python 3 compared with Python 2.'],
        ['Apakah maksud "batteries included"? Berikan dua contoh modul.', 'What does "batteries included" mean? Give two example modules.'],
        ['Namakan satu situasi di mana bahasa lain lebih sesuai daripada Python, dan terangkan sebabnya.', 'Name one situation where another language fits better than Python, and explain why.'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Python FAQ — General Python FAQ (history and uses)', url: `${PYDOCS}/faq/general.html` },
        { title: 'PEP 20 — The Zen of Python', url: 'https://peps.python.org/pep-0020/' },
        { title: 'History and License of Python', url: `${PYDOCS}/license.html` },
        { title: 'The Python Standard Library', url: `${PYDOCS}/library/index.html` },
        { title: 'Python Success Stories and Applications', url: 'https://www.python.org/about/apps/' },
        { title: 'Status of Python versions (release cycle)', url: 'https://devguide.python.org/versions/' },
      )),
  ],
};

export const PY101_M1: LectureContentDef[] = [PY101_1_1, PY101_1_2, PY101_1_3];
