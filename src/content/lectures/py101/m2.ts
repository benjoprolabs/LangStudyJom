import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * PY101 · Module 2 — The Python Development Environment.
 * Every example is Python 3.13 and is executed by CPython 3.13 (npm run verify:code). Installation steps and
 * terminal commands are described, not executed; examples avoid machine-specific output (paths, patch versions).
 */

const PYDOCS = 'https://docs.python.org/3.13';

// ─── 2.1 Installing Python and checking the version ───────────────────────

export const PY101_2_1: LectureContentDef = {
  courseCode: 'PY101',
  module: 2,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Memasang Python 3.13 pada Windows, macOS atau Linux daripada sumber rasmi.', 'Install Python 3.13 on Windows, macOS or Linux from an official source.'],
        ['Menyemak versi Python dari terminal (`python3 --version`, `py --version`) dan dari dalam program (`sys.version_info`).', 'Check the Python version from the terminal (`python3 --version`, `py --version`) and from inside a program (`sys.version_info`).'],
        ['Menerangkan nombor versi major.minor.micro dan kitaran sokongan Python.', 'Explain major.minor.micro version numbers and Python’s support cycle.'],
        ['Menerangkan peranan pemboleh ubah persekitaran PATH dalam mencari arahan `python`.', 'Explain the role of the PATH environment variable in finding the `python` command.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1: program, [[interpreter|interpreter]] dan [[cpython|CPython]].', 'Module 1: programs, [[interpreter|interpreters]] and [[cpython|CPython]].'],
        ['Kebolehan memuat turun dan memasang aplikasi pada komputer anda (hak pentadbir mungkin diperlukan).', 'The ability to download and install applications on your computer (administrator rights may be needed).'],
      )),
    S('introduction',
      P('Sebelum menulis program, anda memerlukan interpreter Python pada komputer anda. Kedengarannya mudah, tetapi kebanyakan masalah pemula pada minggu pertama datang daripada pemasangan: versi yang salah, arahan `python` yang tidak ditemui, atau dua versi Python yang bercampur. Kuliah ini menerangkan cara memasang Python 3.13 dengan betul pada tiga sistem pengendalian utama dan, yang lebih penting, cara **mengesahkan** apa yang benar-benar dipasang.',
        'Before writing programs you need a Python interpreter on your computer. That sounds simple, but most beginner problems in the first week come from installation: the wrong version, a `python` command that cannot be found, or two Python versions mixed up. This lecture explains how to install Python 3.13 correctly on the three main operating systems and, more importantly, how to **verify** what is really installed.'),
      KEY('Sentiasa sahkan: versi yang anda fikir anda jalankan mungkin bukan versi yang sebenarnya berjalan.', 'Always verify: the version you think you are running may not be the one that actually runs.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Nombor versi:** `3.13.1` = major 3, minor 13, micro 1. Versi minor baharu (ciri baharu) keluar setiap Oktober; versi micro membetulkan pepijat dan isu keselamatan.', '**Version number:** `3.13.1` = major 3, minor 13, micro 1. A new minor version (new features) comes out each October; micro versions fix bugs and security issues.'],
        ['**Kitaran sokongan:** setiap versi minor menerima pembetulan pepijat selama 2 tahun, kemudian pembetulan keselamatan sahaja sehingga 5 tahun.', '**Support cycle:** each minor version receives bug fixes for 2 years, then security fixes only, up to 5 years.'],
        ['**Pemasang rasmi:** python.org untuk Windows dan macOS; pengurus pakej (`apt`, `dnf`) atau python.org untuk Linux; Microsoft Store juga menyediakan Python.', '**Official installers:** python.org for Windows and macOS; the package manager (`apt`, `dnf`) or python.org for Linux; the Microsoft Store also offers Python.'],
        ['**PATH:** senarai folder tempat sistem pengendalian mencari arahan. Jika folder Python tiada dalam PATH, arahan `python` "tidak ditemui".', '**PATH:** the list of folders where the operating system looks for commands. If Python’s folder is not on PATH, the `python` command is "not found".'],
        ['**Pelancar `py` (Windows):** memilih versi Python yang dipasang — `py -3.13` menjalankan 3.13 secara khusus.', '**The `py` launcher (Windows):** chooses among installed Python versions — `py -3.13` runs 3.13 specifically.'],
      )),
    S('detailed_theory',
      P('Pada **Windows**, muat turun pemasang 64-bit dari python.org/downloads. Pada skrin pertama, tandakan **"Add python.exe to PATH"** — ini langkah yang paling kerap terlepas — kemudian pilih "Install Now". Pemasang memasang interpreter, pustaka standard, `pip`, IDLE dan pelancar `py`. Buka PowerShell **baharu** (terminal lama tidak melihat PATH yang dikemas kini) dan jalankan `py --version` serta `python --version`. Pada **macOS**, sistem mungkin sudah mempunyai `python3` yang lama atau versi Xcode; pasang pemasang universal dari python.org dan sahkan dengan `python3 --version`. Pada **Linux**, Python 3 hampir selalu sudah ada kerana sistem itu sendiri bergantung padanya; jangan buang atau gantikan Python sistem — pasang 3.13 bersebelahan (contohnya `sudo apt install python3.13` pada Ubuntu dengan repositori yang sesuai) dan jalankannya sebagai `python3.13`.',
        'On **Windows**, download the 64-bit installer from python.org/downloads. On the first screen, tick **"Add python.exe to PATH"** — the step most often missed — then choose "Install Now". The installer installs the interpreter, the standard library, `pip`, IDLE and the `py` launcher. Open a **new** PowerShell window (old terminals do not see the updated PATH) and run `py --version` and `python --version`. On **macOS**, the system may already have an old `python3` or an Xcode one; install the universal installer from python.org and verify with `python3 --version`. On **Linux**, Python 3 is almost always present because the system itself depends on it; do not remove or replace the system Python — install 3.13 alongside it (for example `sudo apt install python3.13` on Ubuntu with a suitable repository) and run it as `python3.13`.'),
      P('Apabila anda menaip `python3` dalam terminal, sistem pengendalian mencari fail boleh laksana dengan nama itu dalam setiap folder di **PATH**, mengikut susunan, dan menjalankan yang pertama ditemui. Inilah punca kekeliruan versi: jika folder Python 3.11 lama berada sebelum 3.13 dalam PATH, `python3` menjalankan 3.11. Oleh itu, pengesahan perlu dilakukan dua kali: dari terminal (`python3 --version`) dan dari dalam program, kerana editor kod mungkin menggunakan interpreter yang berbeza daripada terminal. Di dalam program, modul `sys` memberi `sys.version_info` (tuple yang boleh dibandingkan) dan `sys.executable` (laluan penuh interpreter yang sedang berjalan).',
        'When you type `python3` in a terminal, the operating system searches for an executable with that name in each folder on **PATH**, in order, and runs the first one it finds. This is the source of version confusion: if an old Python 3.11 folder comes before 3.13 on PATH, `python3` runs 3.11. Verification therefore needs to happen twice: from the terminal (`python3 --version`) and from inside a program, because a code editor may use a different interpreter from the terminal. Inside a program, the `sys` module provides `sys.version_info` (a tuple that can be compared) and `sys.executable` (the full path of the running interpreter).'),
      P('Kursus ini menyasarkan Python 3.13. Kod dalam PY101 juga berjalan pada 3.10–3.12 dengan beberapa perbezaan kecil dalam mesej ralat, tetapi output yang dijangka dalam bahan ini telah disahkan dengan CPython 3.13 sahaja.', 'This course targets Python 3.13. PY101 code also runs on 3.10–3.12 with small differences in error messages, but the expected outputs in these materials have been verified with CPython 3.13 only.')),
    S('technical_terminology', TERMS('cpython', 'interpreter', 'terminal', 'module')),
    S('syntax_rules',
      UL(
        ['Terminal: `python3 --version` (macOS/Linux), `py --version` atau `python --version` (Windows) mencetak versi, contohnya `Python 3.13.1`.', 'Terminal: `python3 --version` (macOS/Linux), `py --version` or `python --version` (Windows) prints the version, for example `Python 3.13.1`.'],
        ['Terminal: `py --list` (Windows) menyenaraikan semua versi yang dipasang.', 'Terminal: `py --list` (Windows) lists every installed version.'],
        ['Program: `import sys` kemudian `sys.version_info` → `(major, minor, micro, releaselevel, serial)`.', 'Program: `import sys` then `sys.version_info` → `(major, minor, micro, releaselevel, serial)`.'],
        ['Bandingkan versi sebagai **tuple**: `sys.version_info >= (3, 13)`, bukan sebagai string.', 'Compare versions as **tuples**: `sys.version_info >= (3, 13)`, not as strings.'],
      )),
    S('code_demonstration',
      CODE('version-info', 'python', 'python', ['Membaca versi dari dalam program', 'Reading the version from inside a program'], `
import sys

info = sys.version_info
print("Major:", info.major)
print("Minor:", info.minor)
print("Release level:", info.releaselevel)
print("Implementation:", sys.implementation.name)
`, 'Major: 3\nMinor: 13\nRelease level: final\nImplementation: cpython'),
      EXPLAIN('version-info',
        ['1', '`sys` ialah modul pustaka standard yang menerangkan interpreter yang sedang berjalan.', '`sys` is the standard-library module that describes the running interpreter.'],
        ['3', '`sys.version_info` ialah tuple bernama: setiap bahagian boleh dibaca dengan nama (`info.major`) atau kedudukan (`info[0]`).', '`sys.version_info` is a named tuple: each part can be read by name (`info.major`) or by position (`info[0]`).'],
        ['4–5', 'Bahagian major dan minor — yang menentukan ciri bahasa yang tersedia. Bahagian micro sengaja tidak dicetak kerana ia berbeza antara komputer.', 'The major and minor parts — the ones that decide which language features are available. The micro part is deliberately not printed because it differs between computers.'],
        ['6', '`final` bermaksud keluaran stabil (bukan alpha, beta atau release candidate).', '`final` means a stable release (not an alpha, beta or release candidate).'],
        ['7', '`cpython` — pelaksanaan rujukan dari python.org.', '`cpython` — the reference implementation from python.org.'])),
    S('complete_examples',
      CODE('version-gate', 'python', 'python', ['Menyemak versi minimum', 'Checking a minimum version'], `
import sys

REQUIRED = (3, 13)
current = sys.version_info[:2]
print("Required:", REQUIRED, "Current:", current)
if current >= REQUIRED:
    print("OK: this Python can run the course examples")
else:
    print("Please install Python 3.13 or newer")
`, 'Required: (3, 13) Current: (3, 13)\nOK: this Python can run the course examples', {
        debug: BUG(`
import sys

if sys.version >= 3.13:
    print("OK")
`, "example.py:3: TypeError: '>=' not supported between instances of 'str' and 'float'",
          '`sys.version` ialah **string** panjang (contohnya `"3.13.1 (main, …)"`), dan `3.13` ialah nombor float. Python tidak membandingkan teks dengan nombor, jadi ia menimbulkan `TypeError`. Lebih teruk lagi, float `3.13` tidak boleh mewakili versi dengan betul: 3.9 akan kelihatan lebih besar daripada 3.13. Gunakan `sys.version_info` dan tuple `(3, 13)`.',
          '`sys.version` is a long **string** (for example `"3.13.1 (main, …)"`), and `3.13` is a float. Python does not compare text with numbers, so it raises `TypeError`. Worse, the float `3.13` cannot represent versions correctly: 3.9 would look larger than 3.13. Use `sys.version_info` and the tuple `(3, 13)`.'),
      }),
      EXPLAIN('version-gate',
        ['1', 'Modul `sys` diimport untuk membaca versi.', 'The `sys` module is imported to read the version.'],
        ['3', 'Versi minimum sebagai tuple pemalar.', 'The minimum version as a constant tuple.'],
        ['4', '`[:2]` mengambil dua bahagian pertama, menjadikan tuple biasa `(3, 13)`.', '`[:2]` takes the first two parts, giving a plain tuple `(3, 13)`.'],
        ['5', 'Mencetak kedua-dua tuple untuk diperiksa.', 'Prints both tuples for inspection.'],
        ['6–9', 'Tuple dibandingkan unsur demi unsur: major dahulu, kemudian minor. `if`/`else` (PY103) memilih mesej yang sesuai.', 'Tuples are compared element by element: major first, then minor. `if`/`else` (PY103) chooses the right message.']),
      CODE('path-search', 'python', 'python', ['Bagaimana PATH dicari', 'How PATH is searched'], `
import os

folders = ["/opt/old-python/bin", "/usr/local/bin", "/usr/bin"]
path_value = os.pathsep.join(folders)
print("PATH =", path_value)
print("Search order:")
for position, folder in enumerate(path_value.split(os.pathsep), start=1):
    print(position, folder)
`, 'PATH = /opt/old-python/bin:/usr/local/bin:/usr/bin\nSearch order:\n1 /opt/old-python/bin\n2 /usr/local/bin\n3 /usr/bin', {
        debug: BUG(`
import os

folders = ["/opt/old-python/bin", 3, "/usr/bin"]
path_value = os.pathsep.join(folders)
print("PATH =", path_value)
`, 'example.py:4: TypeError: sequence item 1: expected str instance, int found',
          '`join` hanya menggabungkan **string**. Item kedua ialah nombor `3`, jadi Python berhenti dan menyatakan kedudukan item yang salah (item 1, dikira dari 0). Setiap folder dalam PATH ialah teks; pastikan semua item ialah string.',
          '`join` only joins **strings**. The second item is the number `3`, so Python stops and states the position of the wrong item (item 1, counting from 0). Every folder on PATH is text; make sure every item is a string.'),
      }),
      EXPLAIN('path-search',
        ['1', 'Modul `os` mengetahui pemisah PATH sistem: `:` pada macOS/Linux, `;` pada Windows.', 'The `os` module knows the system’s PATH separator: `:` on macOS/Linux, `;` on Windows.'],
        ['3–5', 'PATH tiruan (bukan PATH sebenar komputer anda) dibina dengan menyambung tiga folder. Output contoh ini disahkan pada Linux, jadi pemisahnya ialah `:`.', 'A simulated PATH (not your computer’s real PATH) is built by joining three folders. This example’s output was verified on Linux, so the separator is `:`.'],
        ['6–8', 'Sistem pengendalian menyemak folder mengikut susunan ini. Jika `/opt/old-python/bin` mengandungi `python3` lama, **itulah** yang berjalan — walaupun 3.13 dipasang dalam `/usr/local/bin`.', 'The operating system checks the folders in this order. If `/opt/old-python/bin` contains an old `python3`, **that** is what runs — even though 3.13 is installed in `/usr/local/bin`.'])),
    S('line_by_line',
      EXPLAIN('version-gate',
        ['6', '`(3, 13) >= (3, 13)` ialah `True` kerana kedua-dua unsur sama. `(3, 12) >= (3, 13)` ialah `False` kerana 12 < 13 pada unsur kedua; `(4, 0) >= (3, 13)` ialah `True` kerana 4 > 3 pada unsur pertama.', '`(3, 13) >= (3, 13)` is `True` because both elements are equal. `(3, 12) >= (3, 13)` is `False` because 12 < 13 in the second element; `(4, 0) >= (3, 13)` is `True` because 4 > 3 in the first element.']),
      EXPLAIN('path-search',
        ['7', '`enumerate(..., start=1)` memberi pasangan (nombor, folder) supaya kedudukan dalam susunan carian boleh dicetak bermula dari 1.', '`enumerate(..., start=1)` gives (number, folder) pairs so the position in the search order can be printed starting from 1.'])),
    S('why_this_way',
      P('Mengapa Python tidak dipasang secara automatik dalam satu lokasi standard? Kerana sistem pengendalian mempunyai peraturan berbeza, dan banyak komputer memerlukan beberapa versi serentak: projek lama yang menggunakan 3.11, kursus yang menggunakan 3.13, dan alat sistem yang bergantung pada Python sistem. PATH dan pelancar `py` ialah mekanisme untuk memilih antara versi itu. Memahaminya sekarang menjimatkan berjam-jam kekeliruan kemudian — terutamanya apabila anda menggunakan persekitaran maya (virtual environment) dalam PY203.',
        'Why is Python not automatically installed in one standard location? Because operating systems have different rules, and many computers need several versions at once: an old project on 3.11, a course on 3.13, and system tools that depend on the system Python. PATH and the `py` launcher are the mechanisms for choosing among those versions. Understanding them now saves hours of confusion later — especially when you use virtual environments in PY203.'),
      WARN('Jangan memadam atau menggantikan Python sistem pada macOS atau Linux. Alat sistem bergantung padanya; pasang versi baharu bersebelahan.', 'Do not delete or replace the system Python on macOS or Linux. System tools depend on it; install the new version alongside it.', ['Amaran', 'Warning'])),
    S('execution_flow',
      OL(
        ['Anda menaip `python3 --version` dan menekan Enter.', 'You type `python3 --version` and press Enter.'],
        ['Shell memisahkan nama arahan (`python3`) daripada argumen (`--version`).', 'The shell separates the command name (`python3`) from the argument (`--version`).'],
        ['Shell menyemak setiap folder dalam PATH mengikut susunan dan menjalankan fail `python3` pertama yang ditemui.', 'The shell checks each folder on PATH in order and runs the first `python3` file it finds.'],
        ['Interpreter melihat `--version`, mencetak `Python 3.13.x` dan keluar tanpa menjalankan sebarang program.', 'The interpreter sees `--version`, prints `Python 3.13.x` and exits without running any program.'],
        ['Jika tiada folder mengandungi `python3`, shell melaporkan "command not found" (macOS/Linux) atau "is not recognized" (Windows).', 'If no folder contains `python3`, the shell reports "command not found" (macOS/Linux) or "is not recognized" (Windows).'],
      )),
    S('memory_behaviour',
      P('Pemasangan Python ialah satu folder yang mengandungi fail boleh laksana interpreter (beberapa megabait), pustaka standard (ribuan fail `.py` dan modul C yang dikompil) dan folder `site-packages` untuk pakej tambahan. Apabila interpreter bermula, ia mengira `sys.prefix` (folder pemasangan) dan `sys.path` (senarai folder untuk mencari modul). Dua pemasangan Python adalah sepenuhnya berasingan: pakej yang dipasang untuk 3.11 tidak kelihatan oleh 3.13.',
        'A Python installation is one folder containing the interpreter executable (a few megabytes), the standard library (thousands of `.py` files and compiled C modules) and a `site-packages` folder for additional packages. When the interpreter starts, it computes `sys.prefix` (the installation folder) and `sys.path` (the list of folders searched for modules). Two Python installations are completely separate: packages installed for 3.11 are not visible to 3.13.')),
    S('alternative_implementations',
      P('Selain `sys.version_info`, modul `sys.implementation` dan `platform` memberi maklumat yang sama dalam bentuk lain. `cache_tag` menunjukkan nama yang digunakan untuk fail `.pyc` dalam `__pycache__`:', 'Besides `sys.version_info`, the `sys.implementation` and `platform` modules give the same information in other forms. `cache_tag` shows the name used for `.pyc` files in `__pycache__`:'),
      CODE('implementation-details', 'python', 'python', ['Maklumat pelaksanaan dalam bentuk lain', 'Implementation details in other forms'], `
import platform
import sys

print(sys.implementation.cache_tag)
print(platform.python_version_tuple()[:2])
print(sys.version_info[:2] == (3, 13))
`, "cpython-313\n('3', '13')\nTrue"),
      EXPLAIN('implementation-details',
        ['1–2', 'Dua modul pustaka standard yang menerangkan platform dan interpreter.', 'Two standard-library modules describing the platform and the interpreter.'],
        ['4', 'Fail bytecode modul yang diimport dinamakan seperti `math_helpers.cpython-313.pyc`.', 'Bytecode files of imported modules are named like `math_helpers.cpython-313.pyc`.'],
        ['5', '`platform` memberi bahagian versi sebagai **string** — berguna untuk paparan, tetapi tidak untuk perbandingan.', '`platform` gives version parts as **strings** — useful for display but not for comparison.'],
        ['6', 'Perbandingan tepat dengan tuple integer.', 'An exact comparison with an integer tuple.'])),
    S('common_mistakes',
      UL(
        ['Terlupa menanda "Add python.exe to PATH" pada Windows, kemudian mendapat ralat "python is not recognized".', 'Forgetting to tick "Add python.exe to PATH" on Windows, then getting "python is not recognized".'],
        ['Menaip `python` di Windows dan dibawa ke Microsoft Store kerana "app execution alias" — pasang Python atau gunakan `py`.', 'Typing `python` on Windows and being sent to the Microsoft Store because of an "app execution alias" — install Python or use `py`.'],
        ['Menguji dalam terminal lama selepas pemasangan; buka terminal baharu supaya PATH dikemas kini.', 'Testing in an old terminal after installing; open a new terminal so PATH is refreshed.'],
        ['Membandingkan versi sebagai string atau float (`"3.9" > "3.13"` ialah `True`!).', 'Comparing versions as strings or floats (`"3.9" > "3.13"` is `True`!).'],
        ['Menganggap editor kod menggunakan Python yang sama seperti terminal — semak interpreter yang dipilih dalam editor.', 'Assuming the code editor uses the same Python as the terminal — check the interpreter selected in the editor.'],
      )),
    S('debugging',
      P('Apabila program berkelakuan berbeza pada komputer lain, atau ciri baharu "tidak wujud", semak versi dan ciri yang tersedia dari dalam program itu sendiri. Ciri bahasa ditambah dalam versi minor tertentu; contohnya, fungsi `copy.replace` hanya wujud sejak Python 3.13, dan fungsi `sys._is_gil_enabled` hanya wujud dalam binaan 3.13. Program diagnostik kecil seperti di bawah memberi fakta, bukan andaian — sertakan outputnya apabila meminta bantuan di forum atau daripada pensyarah.',
        'When a program behaves differently on another computer, or a new feature "does not exist", check the version and the available features from inside the program itself. Language features are added in specific minor versions; for example, the function `copy.replace` only exists since Python 3.13, and `sys._is_gil_enabled` only exists in 3.13 builds. A small diagnostic program like the one below gives facts, not assumptions — include its output when you ask for help on a forum or from a lecturer.'),
      CODE('feature-check', 'python', 'python', ['Menyemak ciri yang tersedia', 'Checking which features are available'], `
import copy
import sys

print("Python", sys.version_info.major, sys.version_info.minor)
print("copy.replace available:", hasattr(copy, "replace"))
print("sys._is_gil_enabled available:", hasattr(sys, "_is_gil_enabled"))
`, 'Python 3 13\ncopy.replace available: True\nsys._is_gil_enabled available: True'),
      EXPLAIN('feature-check',
        ['1–2', 'Modul yang akan diperiksa.', 'The modules to be inspected.'],
        ['4', 'Versi sebagai fakta pertama dalam laporan.', 'The version as the first fact in the report.'],
        ['5–6', '`hasattr(objek, "nama")` memberi `True` jika objek mempunyai atribut itu. Pada Python 3.12, kedua-dua baris akan mencetak `False`.', '`hasattr(object, "name")` gives `True` if the object has that attribute. On Python 3.12, both lines would print `False`.'])),
    S('performance',
      P('Setiap versi Python baharu biasanya lebih pantas: Python 3.11 adalah kira-kira 25% lebih pantas daripada 3.10 secara purata, dan 3.12–3.13 meneruskan peningkatan itu. Memasang versi yang disokong bukan sahaja memberi ciri baharu dan pembetulan keselamatan, tetapi juga prestasi percuma. Bagi pemasangan, versi 64-bit diperlukan pada komputer moden; versi 32-bit dihadkan kepada kira-kira 2–4 GB ingatan.',
        'Each new Python version is usually faster: Python 3.11 is about 25% faster than 3.10 on average, and 3.12–3.13 continued that improvement. Installing a supported version gives you not only new features and security fixes but also free performance. For installation, the 64-bit version is required on modern computers; a 32-bit build is limited to roughly 2–4 GB of memory.')),
    S('software_engineering',
      P('Kod yang menyemak versi mesti melakukannya dengan betul. Bandingkan pendekatan string dengan pendekatan tuple:', 'Code that checks versions must do it correctly. Compare the string approach with the tuple approach:'),
      CODE('version-compare-poor', 'python', 'python', ['Pelaksanaan lemah: membandingkan versi sebagai string', 'Poor implementation: comparing versions as strings'], `
installed = "3.9"
required = "3.13"
print("Looks new enough:", installed >= required)
print("3.13.0 starts with 3.1:", "3.13.0".startswith("3.1"))
`, 'Looks new enough: True\n3.13.0 starts with 3.1: True'),
      EXPLAIN('version-compare-poor',
        ['1–3', 'String dibandingkan aksara demi aksara: `"9"` > `"1"`, jadi `"3.9"` dianggap lebih baharu daripada `"3.13"` — salah.', 'Strings are compared character by character: `"9"` > `"1"`, so `"3.9"` is treated as newer than `"3.13"` — wrong.'],
        ['4', 'Semakan awalan juga mengelirukan: `"3.1"` sepadan dengan 3.1, 3.10, 3.11, 3.12 dan 3.13.', 'Prefix checks are misleading too: `"3.1"` matches 3.1, 3.10, 3.11, 3.12 and 3.13.']),
      CODE('version-compare-improved', 'python', 'python', ['Pelaksanaan lebih baik: tuple integer', 'Improved implementation: integer tuples'], `
installed = (3, 9)
required = (3, 13)
print("New enough:", installed >= required)
print("3.13 is newer than 3.9:", (3, 13) > (3, 9))
`, 'New enough: False\n3.13 is newer than 3.9: True'),
      EXPLAIN('version-compare-improved',
        ['1–4', 'Tuple integer dibandingkan secara berangka, unsur demi unsur: 9 < 13, jadi 3.9 lebih lama. Inilah bentuk yang digunakan oleh `sys.version_info`.', 'Integer tuples are compared numerically, element by element: 9 < 13, so 3.9 is older. This is the form `sys.version_info` uses.'])),
    S('industry_use_cases',
      UL(
        ['**Pasukan pembangunan** menetapkan versi Python projek dalam fail seperti `pyproject.toml` (`requires-python = ">=3.13"`) supaya semua ahli menggunakan versi yang sama.', '**Development teams** pin a project’s Python version in files such as `pyproject.toml` (`requires-python = ">=3.13"`) so every member uses the same version.'],
        ['**Pelayan dan bekas (container):** imej Docker rasmi `python:3.13` memastikan pelayan pengeluaran menjalankan versi yang telah diuji.', '**Servers and containers:** the official `python:3.13` Docker image ensures production servers run the tested version.'],
        ['**Sistem CI** menjalankan ujian pada beberapa versi Python (contohnya 3.11, 3.12, 3.13) untuk memastikan pustaka serasi.', '**CI systems** run tests on several Python versions (for example 3.11, 3.12, 3.13) to make sure a library is compatible.'],
        ['**Pasukan IT** mengemas kini versi micro dengan cepat kerana ia mengandungi pembetulan keselamatan.', '**IT teams** apply micro-version updates quickly because they contain security fixes.'],
      )),
    S('practical_demonstration',
      OL(
        ['Pasang Python 3.13 dari python.org pada komputer anda, mengikut langkah untuk sistem pengendalian anda.', 'Install Python 3.13 from python.org on your computer, following the steps for your operating system.'],
        ['Buka terminal baharu dan jalankan `python3 --version` (atau `py --version`). Catat output tepat.', 'Open a new terminal and run `python3 --version` (or `py --version`). Write down the exact output.'],
        ['Jalankan `version-info` dan `feature-check` pada komputer anda. Adakah output sama dengan bahan ini?', 'Run `version-info` and `feature-check` on your computer. Is the output the same as in these materials?'],
        ['Pada Windows, jalankan `py --list` untuk melihat semua versi yang dipasang.', 'On Windows, run `py --list` to see every installed version.'],
      )),
    S('mini_project',
      P('**Penyemak kesediaan persekitaran.** Tulis program yang menyemak sama ada komputer bersedia untuk kursus: versi sekurang-kurangnya 3.13, pelaksanaan CPython, dan tiga modul standard yang diperlukan kemudian (`json`, `sqlite3`, `venv`) tersedia. Cetak senarai semak dan keputusan akhir.', '**An environment readiness checker.** Write a program that checks whether the computer is ready for the course: version at least 3.13, the CPython implementation, and three standard modules needed later (`json`, `sqlite3`, `venv`) available. Print a checklist and a final verdict.'),
      CODE('readiness-check', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
import importlib.util
import platform
import sys

checks = {
    "Python 3.13 or newer": sys.version_info >= (3, 13),
    "CPython implementation": platform.python_implementation() == "CPython",
}
for module_name in ["json", "sqlite3", "venv"]:
    checks["module " + module_name] = importlib.util.find_spec(module_name) is not None

for label, passed in checks.items():
    print("[x]" if passed else "[ ]", label)
print("Ready for PY101:", all(checks.values()))
`, '[x] Python 3.13 or newer\n[x] CPython implementation\n[x] module json\n[x] module sqlite3\n[x] module venv\nReady for PY101: True'),
      EXPLAIN('readiness-check',
        ['1–3', 'Modul untuk mencari modul lain, maklumat platform dan versi.', 'Modules for finding other modules, platform information and the version.'],
        ['5–8', 'Kamus semakan: label → `True`/`False`.', 'A dictionary of checks: label → `True`/`False`.'],
        ['9–10', '`find_spec` mencari modul **tanpa** mengimportnya; `None` bermaksud tidak dipasang.', '`find_spec` looks for a module **without** importing it; `None` means it is not installed.'],
        ['12–13', 'Satu baris bagi setiap semakan, dengan `[x]` atau `[ ]` dipilih oleh ungkapan bersyarat.', 'One line per check, with `[x]` or `[ ]` chosen by a conditional expression.'],
        ['14', '`all` memberi `True` hanya jika setiap semakan lulus.', '`all` gives `True` only if every check passed.'])),
    S('summary',
      UL(
        ['Pasang Python 3.13 dari python.org (Windows/macOS) atau bersebelahan Python sistem (Linux).', 'Install Python 3.13 from python.org (Windows/macOS) or alongside the system Python (Linux).'],
        ['Pada Windows, tandakan "Add python.exe to PATH"; gunakan `py` untuk memilih versi.', 'On Windows, tick "Add python.exe to PATH"; use `py` to choose versions.'],
        ['Sahkan dari terminal (`--version`) dan dari dalam program (`sys.version_info`).', 'Verify from the terminal (`--version`) and from inside a program (`sys.version_info`).'],
        ['PATH menentukan Python mana yang berjalan; folder pertama yang sepadan menang.', 'PATH decides which Python runs; the first matching folder wins.'],
        ['Bandingkan versi sebagai tuple integer, bukan string atau float.', 'Compare versions as integer tuples, not strings or floats.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah maksud setiap bahagian dalam `3.13.2`?', 'What does each part of `3.13.2` mean?'],
        ['Mengapakah `python` mungkin "tidak ditemui" selepas pemasangan pada Windows?', 'Why might `python` be "not found" after installation on Windows?'],
        ['Apakah output `print("3.10" > "3.9")`, dan mengapa ia mengelirukan?', 'What is the output of `print("3.10" > "3.9")`, and why is it misleading?'],
        ['Mengapakah anda tidak patut memadam Python sistem pada Linux?', 'Why should you not delete the system Python on Linux?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Download Python (python.org)', url: 'https://www.python.org/downloads/' },
        { title: 'Python Setup and Usage — Using Python on Windows', url: `${PYDOCS}/using/windows.html` },
        { title: 'Python Setup and Usage — Using Python on macOS', url: `${PYDOCS}/using/mac.html` },
        { title: 'Python Setup and Usage — Using Python on Unix platforms', url: `${PYDOCS}/using/unix.html` },
        { title: 'sys — System-specific parameters (version_info)', url: `${PYDOCS}/library/sys.html#sys.version_info` },
        { title: 'Status of Python versions', url: 'https://devguide.python.org/versions/' },
      )),
  ],
};

// ─── 2.2 The REPL (interactive shell) versus .py scripts ──────────────────

export const PY101_2_2: LectureContentDef = {
  courseCode: 'PY101',
  module: 2,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Memulakan, menggunakan dan keluar daripada [[python-shell|shell interaktif Python]] (`>>>`, `...`, `exit`).', 'Start, use and leave the [[python-shell|Python interactive shell]] (`>>>`, `...`, `exit`).'],
        ['Menerangkan mengapa shell mencetak nilai ungkapan secara automatik tetapi [[python-script|skrip]] tidak.', 'Explain why the shell prints expression values automatically but a [[python-script|script]] does not.'],
        ['Memilih antara shell dan skrip `.py` mengikut tugas.', 'Choose between the shell and a `.py` script according to the task.'],
        ['Menggunakan `if __name__ == "__main__":` untuk memisahkan kod yang dijalankan sebagai skrip.', 'Use `if __name__ == "__main__":` to separate code that runs as a script.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1: Python 3.13 dipasang dan `python3 --version` berfungsi.', 'Lecture 2.1: Python 3.13 is installed and `python3 --version` works.'],
        ['Kuliah 1.2: CPython mengkompil dan menjalankan kod.', 'Lecture 1.2: CPython compiles and runs code.'],
      )),
    S('introduction',
      P('Python boleh digunakan dalam dua mod. Dalam **mod interaktif**, anda menaip satu pernyataan, Python menjalankannya serta-merta dan menunjukkan hasilnya — seperti berbual dengan interpreter. Dalam **mod skrip**, anda menulis program lengkap dalam fail `.py` dan menjalankannya dari awal hingga akhir. Pengatur cara profesional menggunakan kedua-duanya setiap hari: shell untuk meneroka dan menguji idea kecil, skrip untuk apa-apa yang perlu disimpan, diulang atau dikongsi.',
        'Python can be used in two modes. In **interactive mode**, you type one statement, Python runs it immediately and shows the result — like a conversation with the interpreter. In **script mode**, you write a complete program in a `.py` file and run it from start to finish. Professional programmers use both every day: the shell to explore and test small ideas, scripts for anything that must be saved, repeated or shared.'),
      KEY('Shell: cuba dan lihat. Skrip: simpan dan ulang.', 'Shell: try and see. Script: save and repeat.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**[[repl|REPL]]:** Read–Eval–Print Loop — baca input, nilaikan, cetak hasil, ulang.', '**[[repl|REPL]]:** Read–Eval–Print Loop — read the input, evaluate it, print the result, repeat.'],
        ['**Prompt `>>>`:** shell bersedia untuk pernyataan baharu. **Prompt `...`:** sambungan blok berbilang baris.', '**`>>>` prompt:** the shell is ready for a new statement. **`...` prompt:** continuation of a multi-line block.'],
        ['**Gema automatik:** dalam shell, nilai setiap **ungkapan** dipaparkan (kecuali `None`); nilai terakhir disimpan dalam `_`.', '**Automatic echo:** in the shell, the value of each **expression** is shown (except `None`); the last value is stored in `_`.'],
        ['**[[python-script|Skrip]]:** fail `.py` yang dijalankan dengan `python3 nama.py`; hanya `print()` menghasilkan output.', '**[[python-script|Script]]:** a `.py` file run with `python3 name.py`; only `print()` produces output.'],
        ['**`__name__`:** pemboleh ubah khas yang bernilai `"__main__"` apabila fail dijalankan terus.', '**`__name__`:** a special variable whose value is `"__main__"` when a file is run directly.'],
      )),
    S('detailed_theory',
      P('Taip `python3` (atau `py` pada Windows) tanpa nama fail untuk memulakan shell. Python 3.13 memperkenalkan shell interaktif baharu berdasarkan kod PyPy: ia mempunyai warna, boleh menyunting blok berbilang baris sebagai satu unit, menyokong `exit` dan `quit` tanpa kurungan, `help` dengan F1, sejarah dengan F2 dan "paste mode" dengan F3 untuk menampal kod yang panjang. Setiap kali anda menekan Enter pada pernyataan lengkap, shell mengkompilnya dalam mod khas `"single"`: jika pernyataan itu ialah ungkapan, hasilnya diserahkan kepada `sys.displayhook`, yang mencetak `repr()` nilai itu — dengan tanda petik untuk string — dan menyimpannya dalam `_`. Nilai `None` tidak dipaparkan; sebab itulah `print("hi")` dalam shell memaparkan `hi` sekali sahaja, bukan diikuti oleh `None`.',
        'Type `python3` (or `py` on Windows) with no file name to start the shell. Python 3.13 introduced a new interactive shell based on PyPy’s code: it has colour, can edit multi-line blocks as one unit, supports `exit` and `quit` without parentheses, `help` with F1, history with F2 and "paste mode" with F3 for pasting long code. Each time you press Enter on a complete statement, the shell compiles it in the special `"single"` mode: if the statement is an expression, its result is passed to `sys.displayhook`, which prints the value’s `repr()` — with quotes for strings — and stores it in `_`. `None` is not displayed; that is why `print("hi")` in the shell shows `hi` once, not followed by `None`.'),
      P('Skrip berbeza dalam tiga cara penting. Pertama, seluruh fail dikompil sebelum dijalankan (kuliah 1.2), jadi satu ralat sintaks di mana-mana menghalang semuanya. Kedua, ungkapan yang berdiri sendiri seperti `price * 3` dinilai dan **dibuang** — tiada gema automatik; anda mesti menggunakan `print()`. Ketiga, skrip ialah fail: ia boleh disimpan dalam kawalan versi, disemak oleh rakan sepasukan, dijalankan semula esok dengan hasil yang sama, dan diimport oleh fail lain. Apabila fail diimport sebagai modul, `__name__` ialah nama modul, bukan `"__main__"`; corak `if __name__ == "__main__":` membolehkan satu fail berfungsi sebagai skrip dan modul.',
        'A script differs in three important ways. First, the whole file is compiled before it runs (lecture 1.2), so one syntax error anywhere stops everything. Second, a standalone expression such as `price * 3` is evaluated and **discarded** — there is no automatic echo; you must use `print()`. Third, a script is a file: it can be kept in version control, reviewed by teammates, run again tomorrow with the same result, and imported by other files. When a file is imported as a module, `__name__` is the module’s name, not `"__main__"`; the `if __name__ == "__main__":` pattern lets one file work as both a script and a module.'),
      P('Dua mod boleh digabungkan: `python3 -i skrip.py` menjalankan skrip, kemudian membuka shell dengan semua pemboleh ubah skrip masih ada — sangat berguna untuk memeriksa keadaan selepas program berjalan. `python3 -c "print(6 * 7)"` menjalankan satu baris kod terus dari terminal.',
        'The two modes can be combined: `python3 -i script.py` runs the script and then opens the shell with all the script’s variables still available — very useful for inspecting state after a program runs. `python3 -c "print(6 * 7)"` runs one line of code straight from the terminal.')),
    S('technical_terminology', TERMS('python-shell', 'repl', 'python-script', 'statement')),
    S('syntax_rules',
      UL(
        ['Mula: `python3` (macOS/Linux) atau `py` (Windows). Keluar: `exit`, `quit`, Ctrl+D (macOS/Linux) atau Ctrl+Z kemudian Enter (Windows).', 'Start: `python3` (macOS/Linux) or `py` (Windows). Leave: `exit`, `quit`, Ctrl+D (macOS/Linux) or Ctrl+Z then Enter (Windows).'],
        ['Jangan taip `>>>` atau `...` — itu prompt yang dipaparkan oleh shell, bukan sebahagian daripada kod.', 'Do not type `>>>` or `...` — those are prompts shown by the shell, not part of the code.'],
        ['Blok dalam shell ditamatkan dengan baris kosong.', 'A block in the shell is ended with an empty line.'],
        ['Jalankan skrip: `python3 nama_fail.py`. Jalankan kemudian periksa: `python3 -i nama_fail.py`.', 'Run a script: `python3 file_name.py`. Run and then inspect: `python3 -i file_name.py`.'],
      )),
    S('code_demonstration',
      P('Contoh ini memanggil `sys.displayhook` — fungsi yang sama yang digunakan oleh shell untuk memaparkan nilai — supaya anda dapat melihat peraturan gema shell dalam skrip:', 'This example calls `sys.displayhook` — the same function the shell uses to display values — so you can see the shell’s echo rules inside a script:'),
      CODE('shell-echo', 'python', 'python', ['Peraturan gema shell', 'The shell’s echo rules'], `
import builtins
import sys

for value in [42, "text", None, 3.5]:
    sys.displayhook(value)
print("Last echoed value stored in _:", builtins._)
`, "42\n'text'\n3.5\nLast echoed value stored in _: 3.5"),
      EXPLAIN('shell-echo',
        ['1–2', '`builtins` menyimpan nama terbina dalam (termasuk `_` selepas gema); `sys` menyediakan `displayhook`.', '`builtins` holds the built-in names (including `_` after an echo); `sys` provides `displayhook`.'],
        ['4–5', 'Empat nilai diserahkan kepada pemapar shell. Nombor dipaparkan seperti biasa; string dipaparkan **dengan** tanda petik (`repr`); `None` tidak dipaparkan langsung.', 'Four values are passed to the shell’s display function. Numbers appear as usual; the string appears **with** quotes (`repr`); `None` is not displayed at all.'],
        ['6', 'Nilai terakhir yang dipaparkan (3.5) disimpan dalam `_` — dalam shell, anda boleh menaip `_ * 2` untuk menggunakannya semula.', 'The last displayed value (3.5) is stored in `_` — in the shell, you can type `_ * 2` to reuse it.'])),
    S('complete_examples',
      P('Dalam shell, sesi berikut memaparkan `13.5` selepas baris kedua. Dalam skrip, baris yang sama tidak memaparkan apa-apa:', 'In the shell, the following session shows `13.5` after the second line. In a script, the same line shows nothing:'),
      CODE('script-needs-print', 'python', 'python', ['Skrip memerlukan print()', 'A script needs print()'], `
price = 4.5
price * 3
print("Printed:", price * 3)
`, 'Printed: 13.5', {
        debug: BUG(`
price = 4.5
print("Printed:", Price * 3)
`, "example.py:2: NameError: name 'Price' is not defined",
          'Python membezakan huruf besar dan kecil: `Price` dan `price` ialah dua nama berbeza. Hanya `price` yang diberi nilai. Kesilapan ini sama dalam shell dan skrip; dalam shell anda boleh membetulkannya serta-merta, dalam skrip anda mesti menyunting fail dan menjalankannya semula.',
          'Python is case-sensitive: `Price` and `price` are two different names. Only `price` was given a value. This mistake is the same in the shell and a script; in the shell you can fix it immediately, in a script you must edit the file and run it again.'),
      }),
      EXPLAIN('script-needs-print',
        ['1', 'Assignment — tiada output dalam shell mahupun skrip.', 'An assignment — no output in the shell or a script.'],
        ['2', 'Ungkapan yang berdiri sendiri. Dalam shell: dipaparkan sebagai `13.5`. Dalam skrip: dikira, kemudian dibuang tanpa jejak.', 'A standalone expression. In the shell: displayed as `13.5`. In a script: calculated, then discarded without a trace.'],
        ['3', 'Satu-satunya output skrip datang daripada `print()`.', 'The script’s only output comes from `print()`.']),
      CODE('main-guard', 'python', 'python', ['Corak __name__ == "__main__"', 'The __name__ == "__main__" pattern'], `
def greet(name):
    return "Hello, " + name

if __name__ == "__main__":
    print(greet("Aina"))
    print("Running as:", __name__)
`, 'Hello, Aina\nRunning as: __main__', {
        debug: BUG(`
def greet(name):
    return "Hello, " + name

if __name__ == "__main__"
    print(greet("Aina"))
`, "example.py:4: SyntaxError: expected ':'",
          'Setiap baris yang membuka blok (`if`, `def`, `for`) mesti berakhir dengan titik bertindih. Tanpanya, Python tidak tahu bahawa baris berinden seterusnya ialah badan `if`. Kerana ini ralat sintaks, fungsi `greet` juga tidak pernah ditakrifkan — tiada apa-apa dijalankan.',
          'Every line that opens a block (`if`, `def`, `for`) must end with a colon. Without it, Python does not know that the next indented line is the body of the `if`. Because this is a syntax error, the function `greet` is never defined either — nothing runs.'),
      }),
      EXPLAIN('main-guard',
        ['1–2', 'Fungsi yang boleh digunakan semula (PY104). Mentakrif fungsi tidak mencetak apa-apa.', 'A reusable function (PY104). Defining a function prints nothing.'],
        ['4', 'Apabila fail dijalankan terus, `__name__` ialah `"__main__"`, jadi blok ini berjalan. Jika fail diimport oleh fail lain, blok ini dilangkau.', 'When the file is run directly, `__name__` is `"__main__"`, so this block runs. If the file is imported by another file, this block is skipped.'],
        ['5–6', 'Kod "program utama" — hanya untuk penggunaan sebagai skrip.', 'The "main program" code — only for use as a script.'])),
    S('line_by_line',
      EXPLAIN('shell-echo',
        ['5', 'Untuk string, `displayhook` menggunakan `repr("text")`, iaitu `\'text\'` dengan tanda petik — inilah sebabnya shell menunjukkan petik tetapi `print` tidak.', 'For a string, `displayhook` uses `repr("text")`, which is `\'text\'` with quotes — that is why the shell shows quotes but `print` does not.']),
      EXPLAIN('main-guard',
        ['4', '`==` membandingkan dua string. Ini bukan assignment: `=` menyimpan, `==` bertanya "adakah sama?".', '`==` compares two strings. This is not an assignment: `=` stores, `==` asks "are they equal?".'])),
    S('why_this_way',
      P('Mengapa skrip tidak menggemakan nilai seperti shell? Bayangkan skrip seribu baris yang memaparkan setiap pengiraan perantaraan — output yang berguna akan tenggelam. Dalam skrip, **anda** memutuskan apa yang menjadi output. Shell pula direka untuk penerokaan, di mana melihat setiap nilai serta-merta ialah tujuan utamanya.',
        'Why does a script not echo values like the shell? Imagine a thousand-line script that displayed every intermediate calculation — the useful output would drown. In a script, **you** decide what becomes output. The shell, by contrast, is designed for exploration, where seeing every value immediately is the whole point.'),
      P('Corak `__main__` wujud kerana dalam Python, mengimport fail bermaksud **menjalankannya**. Tanpa pengawal, mengimport fungsi berguna daripada fail lain juga akan menjalankan semua cetakan dan pengiraan dalam fail itu.', 'The `__main__` pattern exists because in Python, importing a file means **running** it. Without the guard, importing a useful function from another file would also run all the prints and calculations in that file.')),
    S('execution_flow',
      OL(
        ['Shell: anda menaip satu pernyataan dan menekan Enter.', 'Shell: you type one statement and press Enter.'],
        ['Shell mengkompil pernyataan itu sahaja; jika tidak lengkap (contohnya `if x:`), ia memaparkan `...` dan menunggu.', 'The shell compiles that statement alone; if it is incomplete (for example `if x:`), it shows `...` and waits.'],
        ['Pernyataan dijalankan; jika ia ungkapan dengan nilai bukan `None`, nilai itu dipaparkan dan disimpan dalam `_`.', 'The statement runs; if it is an expression with a non-`None` value, that value is displayed and stored in `_`.'],
        ['Skrip: seluruh fail dikompil, kemudian dijalankan dari atas; `__name__` ditetapkan kepada `"__main__"` sebelum baris pertama.', 'Script: the whole file is compiled, then run from the top; `__name__` is set to `"__main__"` before the first line.'],
        ['Dalam `main-guard`, `def` mencipta fungsi, kemudian `if` menguji `__name__` dan menjalankan badannya.', 'In `main-guard`, `def` creates the function, then `if` tests `__name__` and runs its body.'],
      )),
    S('memory_behaviour',
      P('Shell mengekalkan semua pemboleh ubah anda sepanjang sesi dalam satu ruang nama (namespace) — `price` yang dicipta sejam lalu masih ada. Ini memudahkan penerokaan tetapi boleh mengelirukan: pemboleh ubah lama boleh menyembunyikan pepijat yang akan muncul apabila kod yang sama dijalankan sebagai skrip baharu. Skrip bermula dengan ruang nama yang bersih setiap kali, dan semuanya dibebaskan apabila ia tamat. Jika keputusan dalam shell dan skrip berbeza, mulakan semula shell untuk membuang keadaan lama.',
        'The shell keeps all your variables for the whole session in one namespace — a `price` created an hour ago is still there. This helps exploration but can mislead: an old variable can hide a bug that appears when the same code runs as a fresh script. A script starts with a clean namespace every time, and everything is freed when it ends. If results in the shell and a script differ, restart the shell to clear the old state.')),
    S('alternative_implementations',
      P('Kod juga boleh dijalankan dengan pilihan `-c` dari terminal. Contoh ini menggunakan `subprocess` untuk melancarkan interpreter yang sama dengan `-c`, seperti menaip `python3 -c "print(6 * 7)"` dalam terminal:', 'Code can also be run with the `-c` option from the terminal. This example uses `subprocess` to launch the same interpreter with `-c`, as if typing `python3 -c "print(6 * 7)"` in a terminal:'),
      CODE('dash-c', 'python', 'python', ['Menjalankan satu baris dengan -c', 'Running one line with -c'], `
import subprocess
import sys

result = subprocess.run(
    [sys.executable, "-c", "print(6 * 7)"],
    capture_output=True,
    text=True,
)
print("Child printed:", result.stdout.strip())
print("Exit status:", result.returncode)
`, 'Child printed: 42\nExit status: 0'),
      EXPLAIN('dash-c',
        ['1–2', '`subprocess` melancarkan program lain; `sys.executable` ialah laluan interpreter yang sedang berjalan.', '`subprocess` launches other programs; `sys.executable` is the path of the running interpreter.'],
        ['4–8', 'Melancarkan proses Python **baharu** dengan argumen `-c` dan menangkap outputnya sebagai teks.', 'Launches a **new** Python process with the `-c` argument and captures its output as text.'],
        ['9', 'Output proses anak (dengan baris baharu dibuang oleh `strip`).', 'The child process’s output (with the newline removed by `strip`).'],
        ['10', 'Status keluar 0 bermaksud berjaya; status bukan sifar bermaksud ralat.', 'Exit status 0 means success; a non-zero status means an error.'])),
    S('common_mistakes',
      UL(
        ['Menyalin `>>>` atau `...` dari tutorial ke dalam fail `.py` — ralat sintaks.', 'Copying `>>>` or `...` from a tutorial into a `.py` file — a syntax error.'],
        ['Menjangka skrip memaparkan nilai ungkapan tanpa `print()`.', 'Expecting a script to display expression values without `print()`.'],
        ['Menaip `python3 hello.py` **di dalam** shell `>>>` — arahan itu untuk terminal, bukan untuk Python.', 'Typing `python3 hello.py` **inside** the `>>>` shell — that command is for the terminal, not for Python.'],
        ['Menulis program panjang dalam shell dan kehilangannya apabila shell ditutup.', 'Writing a long program in the shell and losing it when the shell closes.'],
        ['Bergantung pada pemboleh ubah lama dalam sesi shell yang tidak wujud dalam skrip.', 'Relying on old variables in a shell session that do not exist in the script.'],
      )),
    S('debugging',
      P('Kesilapan biasa ialah menyalin sesi shell daripada tutorial terus ke dalam fail. Prompt `>>>` bukan Python yang sah, jadi seluruh fail gagal dikompil. Mesej `SyntaxError: invalid syntax` pada baris pertama, dengan `^` menunjuk ke `>>>`, ialah petunjuknya. Buang semua prompt dan semua baris output yang disalin bersama-sama. Sebaliknya, apabila anda menaip `python3 skrip.py` di dalam shell, Python melaporkan `SyntaxError` juga — keluar daripada shell dahulu dengan `exit`.',
        'A common mistake is copying a shell session from a tutorial straight into a file. The `>>>` prompt is not valid Python, so the whole file fails to compile. The message `SyntaxError: invalid syntax` on the first line, with `^` pointing at `>>>`, is the clue. Remove all prompts and every output line copied along with them. Conversely, when you type `python3 script.py` inside the shell, Python also reports a `SyntaxError` — leave the shell first with `exit`.'),
      CODE('cleaned-session', 'python', 'python', ['Sesi shell yang dibersihkan menjadi skrip', 'A shell session cleaned into a script'], `
width = 7
height = 3
print(width * height)
`, '21', {
        debug: BUG(`
>>> width = 7
>>> height = 3
>>> print(width * height)
21
`, 'example.py:1: SyntaxError: invalid syntax',
          'Fail ini disalin terus daripada sesi shell, termasuk prompt `>>>` dan baris output `21`. Penghurai berhenti pada `>>>` di baris 1. Buang prompt dan baris output; yang tinggal ialah tiga pernyataan dalam versi betul.',
          'This file was copied straight from a shell session, including the `>>>` prompts and the output line `21`. The parser stops at `>>>` on line 1. Remove the prompts and the output line; what remains is the three statements in the correct version.'),
      }),
      EXPLAIN('cleaned-session',
        ['1–3', 'Hanya pernyataan Python yang tinggal. Kerana ini skrip, ungkapan `width * height` dibalut dengan `print` supaya hasilnya dipaparkan.', 'Only the Python statements remain. Because this is a script, the expression `width * height` is wrapped in `print` so its result is shown.'])),
    S('performance',
      P('Memulakan interpreter Python mengambil kira-kira 10–30 milisaat. Untuk skrip pendek, kebanyakan masa dihabiskan untuk permulaan ini, bukan kod anda. Shell mengelakkan kos ini untuk setiap percubaan kerana interpreter sudah berjalan; sebab itu ia terasa serta-merta. Untuk kerja berulang (contohnya memproses 1,000 fail), jalankan satu skrip yang memproses semuanya daripada melancarkan 1,000 proses Python.',
        'Starting the Python interpreter takes roughly 10–30 milliseconds. For a short script, most of the time is spent on this start-up, not your code. The shell avoids that cost for each experiment because the interpreter is already running; that is why it feels instant. For repeated work (for example processing 1,000 files), run one script that processes them all rather than launching 1,000 Python processes.')),
    S('software_engineering',
      P('Skrip yang melakukan kerja di peringkat atas fail menjalankan kerja itu setiap kali ia diimport. Bandingkan:', 'A script that does its work at the top level of the file runs that work every time it is imported. Compare:'),
      CODE('top-level-poor', 'python', 'python', ['Pelaksanaan lemah: kerja di peringkat atas', 'Poor implementation: work at the top level'], `
print("Loading menu...")
menu = {"teh tarik": 2.5, "roti canai": 1.8}
print("Order total:", menu["teh tarik"] + menu["roti canai"])
`, 'Loading menu...\nOrder total: 4.3'),
      EXPLAIN('top-level-poor',
        ['1–3', 'Semua baris berjalan apabila fail diimport. Fail lain yang hanya mahukan `menu` akan turut mencetak dua baris ini — kesan sampingan yang tidak diingini.', 'Every line runs when the file is imported. Another file that only wants `menu` would also print these two lines — an unwanted side effect.']),
      CODE('main-function-improved', 'python', 'python', ['Pelaksanaan lebih baik: fungsi main() dan pengawal', 'Improved implementation: a main() function and a guard'], `
MENU = {"teh tarik": 2.5, "roti canai": 1.8}


def order_total(items):
    return sum(MENU[item] for item in items)


def main():
    print("Order total:", order_total(["teh tarik", "roti canai"]))


if __name__ == "__main__":
    main()
`, 'Order total: 4.3'),
      EXPLAIN('main-function-improved',
        ['1', 'Data sebagai pemalar peringkat modul — selamat untuk diimport.', 'Data as a module-level constant — safe to import.'],
        ['4–5', 'Logik dalam fungsi yang boleh diuji dan digunakan semula.', 'Logic in a function that can be tested and reused.'],
        ['8–9', '`main()` mengumpulkan kerja "program utama".', '`main()` collects the "main program" work.'],
        ['12–13', 'Hanya berjalan apabila fail dijalankan terus. Dua baris kosong antara takrifan peringkat atas mengikut [[pep-8|PEP 8]].', 'Only runs when the file is run directly. Two blank lines between top-level definitions follow [[pep-8|PEP 8]].'])),
    S('industry_use_cases',
      UL(
        ['**Penganalisis data** meneroka data dalam shell atau Jupyter, kemudian memindahkan langkah yang berjaya ke dalam skrip yang boleh diulang.', '**Data analysts** explore data in the shell or Jupyter, then move the steps that work into a repeatable script.'],
        ['**Jurutera DevOps** menggunakan `python3 -c` dalam skrip shell untuk tugas satu baris, seperti menukar JSON.', '**DevOps engineers** use `python3 -c` in shell scripts for one-line tasks, such as converting JSON.'],
        ['**Pembangun web** membuka shell projek (contohnya `python manage.py shell` dalam Django) untuk memeriksa pangkalan data secara langsung.', '**Web developers** open the project shell (for example `python manage.py shell` in Django) to inspect the database directly.'],
        ['**Pustaka** menggunakan `if __name__ == "__main__":` untuk menyediakan antara muka baris arahan, contohnya `python3 -m http.server`.', '**Libraries** use `if __name__ == "__main__":` to offer a command-line interface, for example `python3 -m http.server`.'],
      )),
    S('practical_demonstration',
      OL(
        ['Mulakan shell dan taip `2 ** 100`, `_ + 1` dan `"py" * 3`. Perhatikan gema dan `_`.', 'Start the shell and type `2 ** 100`, `_ + 1` and `"py" * 3`. Notice the echo and `_`.'],
        ['Taip `if 5 > 3:` dan perhatikan prompt `...`. Tamatkan blok dengan baris kosong.', 'Type `if 5 > 3:` and notice the `...` prompt. End the block with an empty line.'],
        ['Simpan `script-needs-print` sebagai `price.py`, jalankannya, kemudian jalankan `python3 -i price.py` dan taip `price` dalam shell.', 'Save `script-needs-print` as `price.py`, run it, then run `python3 -i price.py` and type `price` in the shell.'],
        ['Taip `help(print)` dalam shell (atau tekan F1 dalam Python 3.13) dan baca dokumentasinya.', 'Type `help(print)` in the shell (or press F1 in Python 3.13) and read the documentation.'],
      )),
    S('mini_project',
      P('**Log kalkulator.** Shell menyimpan sejarah perintah anda. Tulis skrip yang meniru log sesi kalkulator: ia menyimpan senarai pengiraan (label dan nilai), mencetak setiap satu dengan nombor seperti sejarah shell, dan menggunakan nilai terakhir seperti `_` untuk pengiraan seterusnya.', '**A calculator log.** The shell keeps a history of your commands. Write a script that imitates a calculator session log: it stores a list of calculations (label and value), prints each with a number like shell history, and uses the last value like `_` for the next calculation.'),
      CODE('calculator-log', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
history = []

history.append(("12 * 4", 12 * 4))
last = history[-1][1]
history.append(("_ + 2", last + 2))
last = history[-1][1]
history.append(("_ / 10", last / 10))

for number, (label, value) in enumerate(history, start=1):
    print(f"[{number}] {label} = {value}")
`, '[1] 12 * 4 = 48\n[2] _ + 2 = 50\n[3] _ / 10 = 5.0'),
      EXPLAIN('calculator-log',
        ['1', 'Senarai kosong untuk sejarah.', 'An empty list for the history.'],
        ['3–7', 'Setiap pengiraan disimpan sebagai pasangan (label, nilai). `history[-1][1]` ialah nilai pengiraan terakhir — peranan `_` dalam shell.', 'Each calculation is stored as a (label, value) pair. `history[-1][1]` is the value of the last calculation — the role of `_` in the shell.'],
        ['9–10', 'Mencetak sejarah dengan nombor, menggunakan f-string (kuliah 3.1).', 'Prints the history with numbers, using an f-string (lecture 3.1).'])),
    S('summary',
      UL(
        ['Shell (`>>>`) menjalankan satu pernyataan pada satu masa dan menggemakan nilai ungkapan.', 'The shell (`>>>`) runs one statement at a time and echoes expression values.'],
        ['Skrip `.py` dikompil keseluruhannya dan hanya `print()` menghasilkan output.', 'A `.py` script is compiled as a whole and only `print()` produces output.'],
        ['`_` menyimpan nilai terakhir yang digemakan dalam shell.', '`_` holds the last echoed value in the shell.'],
        ['`if __name__ == "__main__":` memisahkan kod program utama daripada kod yang boleh diimport.', '`if __name__ == "__main__":` separates main-program code from importable code.'],
        ['Jangan salin `>>>` dan `...` ke dalam fail.', 'Never copy `>>>` and `...` into a file.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah yang dipaparkan oleh shell selepas `x = 5`? Selepas `x + 1`?', 'What does the shell display after `x = 5`? After `x + 1`?'],
        ['Mengapakah `print("hi")` dalam shell tidak diikuti oleh `None`?', 'Why is `print("hi")` in the shell not followed by `None`?'],
        ['Apakah nilai `__name__` apabila fail diimport?', 'What is the value of `__name__` when a file is imported?'],
        ['Bilakah anda akan memilih shell, dan bilakah skrip?', 'When would you choose the shell, and when a script?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Python tutorial — Using the Python Interpreter', url: `${PYDOCS}/tutorial/interpreter.html` },
        { title: 'What’s New in Python 3.13 — a better interactive interpreter', url: `${PYDOCS}/whatsnew/3.13.html#a-better-interactive-interpreter` },
        { title: '__main__ — Top-level code environment', url: `${PYDOCS}/library/__main__.html` },
        { title: 'Command line and environment (-c, -i)', url: `${PYDOCS}/using/cmdline.html` },
        { title: 'sys.displayhook', url: `${PYDOCS}/library/sys.html#sys.displayhook` },
      )),
  ],
};

// ─── 2.3 Using a code editor and the terminal ─────────────────────────────

export const PY101_2_3: LectureContentDef = {
  courseCode: 'PY101',
  module: 2,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Menyediakan [[code-editor|editor kod]] (Visual Studio Code dengan sambungan Python, atau IDLE) dan memilih interpreter Python 3.13.', 'Set up a [[code-editor|code editor]] (Visual Studio Code with the Python extension, or IDLE) and select the Python 3.13 interpreter.'],
        ['Menggunakan arahan [[terminal|terminal]] asas: direktori kerja, `cd`, menyenaraikan fail dan menjalankan skrip.', 'Use basic [[terminal|terminal]] commands: the working directory, `cd`, listing files and running scripts.'],
        ['Membezakan laluan relatif dan mutlak, dan menerangkan mengapa "file not found" berlaku.', 'Distinguish relative and absolute paths, and explain why "file not found" happens.'],
        ['Menyusun folder projek yang kemas dan menyimpan fail dalam UTF-8.', 'Organise a tidy project folder and save files in UTF-8.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 2.1 (pemasangan) dan 2.2 (shell berbanding skrip).', 'Lectures 2.1 (installation) and 2.2 (shell versus script).'],
      )),
    S('introduction',
      P('Program sebenar ditulis dalam editor kod dan dijalankan dari terminal. Editor kod bukan pemproses kata: ia menyimpan teks biasa, menyerlahkan sintaks, menjaga inden dan menandakan ralat semasa anda menaip. Terminal pula ialah tempat program berjalan, menerima input dan memaparkan output serta ralat. Kuliah ini membina aliran kerja harian pengatur cara Python: **sunting → simpan → jalankan → baca output → betulkan**.',
        'Real programs are written in a code editor and run from a terminal. A code editor is not a word processor: it saves plain text, highlights syntax, keeps indentation and marks errors as you type. The terminal is where programs run, take input and show their output and errors. This lecture builds the everyday workflow of a Python programmer: **edit → save → run → read the output → fix**.'),
      KEY('Simpan dahulu, kemudian jalankan — terminal menjalankan fail di cakera, bukan teks dalam editor.', 'Save first, then run — the terminal runs the file on disk, not the text in the editor.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**[[code-editor|Editor kod]]:** VS Code (dengan sambungan Python daripada Microsoft), PyCharm, atau IDLE yang disertakan dengan Python.', '**[[code-editor|Code editor]]:** VS Code (with Microsoft’s Python extension), PyCharm, or IDLE, which ships with Python.'],
        ['**Pemilihan interpreter:** editor mesti tahu Python mana yang digunakan — dalam VS Code, "Python: Select Interpreter".', '**Interpreter selection:** the editor must know which Python to use — in VS Code, "Python: Select Interpreter".'],
        ['**Direktori kerja:** folder tempat terminal (dan program) sedang berada; nama fail relatif dicari di situ.', '**Working directory:** the folder the terminal (and the program) is currently in; relative file names are looked up there.'],
        ['**Laluan mutlak** bermula dari akar (`/home/aina/projek`, `C:\\Users\\Aina\\projek`); **laluan relatif** bermula dari direktori kerja (`data/markah.txt`).', '**An absolute path** starts at the root (`/home/aina/project`, `C:\\Users\\Aina\\project`); **a relative path** starts at the working directory (`data/marks.txt`).'],
        ['**UTF-8:** pengekodan teks standard untuk fail Python; ia menyokong Bahasa Melayu, Cina, Tamil, emoji dan simbol.', '**UTF-8:** the standard text encoding for Python files; it supports Malay, Chinese, Tamil, emoji and symbols.'],
      )),
    S('detailed_theory',
      P('Pasang **Visual Studio Code**, kemudian sambungan **Python** (Microsoft) dari panel Extensions. Buka **folder** projek (File → Open Folder), bukan fail tunggal, supaya editor dan terminal terbina dalam berkongsi direktori kerja yang sama. Gunakan arahan "Python: Select Interpreter" dan pilih Python 3.13 yang anda pasang dalam kuliah 2.1; bar status di bawah menunjukkan versi yang dipilih. Butang ▶ "Run Python File" menyimpan fail dan menjalankan `python fail.py` dalam terminal terbina dalam — perhatikan arahan tepat yang muncul, kerana ia mengajar anda apa yang berlaku di sebalik tabir. **IDLE** ialah alternatif ringkas yang disertakan dengan pemasang python.org: File → New File, simpan sebagai `.py`, kemudian Run → Run Module (F5).',
        'Install **Visual Studio Code**, then the **Python** extension (Microsoft) from the Extensions panel. Open the project **folder** (File → Open Folder), not a single file, so the editor and the built-in terminal share the same working directory. Use the "Python: Select Interpreter" command and choose the Python 3.13 you installed in lecture 2.1; the status bar shows the selected version. The ▶ "Run Python File" button saves the file and runs `python file.py` in the built-in terminal — notice the exact command that appears, because it teaches you what happens behind the scenes. **IDLE** is a simple alternative that comes with the python.org installer: File → New File, save as `.py`, then Run → Run Module (F5).'),
      P('Terminal sentiasa mempunyai **direktori kerja**. `pwd` (macOS/Linux) atau `Get-Location` (PowerShell) memaparkannya; `cd nama_folder` masuk ke folder, `cd ..` naik satu tahap; `ls` (atau `dir` di Windows) menyenaraikan fail. Apabila anda menjalankan `python3 hello.py`, Python mencari `hello.py` dalam direktori kerja. Jika anda berada di folder yang salah, Python melaporkan `can\'t open file … [Errno 2] No such file or directory`. Peraturan yang sama terpakai di dalam program: `open("data/marks.txt")` mencari laluan relatif itu dari direktori kerja **semasa program dijalankan**, bukan dari folder tempat fail `.py` disimpan. Sebab itulah program yang berfungsi apabila dijalankan dari satu folder boleh gagal dari folder lain.',
        'A terminal always has a **working directory**. `pwd` (macOS/Linux) or `Get-Location` (PowerShell) shows it; `cd folder_name` enters a folder, `cd ..` goes up one level; `ls` (or `dir` on Windows) lists files. When you run `python3 hello.py`, Python looks for `hello.py` in the working directory. If you are in the wrong folder, Python reports `can\'t open file … [Errno 2] No such file or directory`. The same rule applies inside a program: `open("data/marks.txt")` looks for that relative path from the working directory **at the time the program runs**, not from the folder where the `.py` file is saved. That is why a program that works when run from one folder can fail from another.'),
      P('Fail sumber Python disimpan sebagai UTF-8 secara lalai, dan Python 3.13 membaca fail sumber sebagai UTF-8. Editor kod yang baik juga menukar Tab kepada empat ruang, menunjukkan nombor baris (penting untuk membaca traceback) dan membuang ruang di hujung baris. Sambungan Python menggunakan pelayan bahasa (Pylance) untuk menggariskan ralat sintaks dan nama yang tidak ditakrifkan sebelum program dijalankan — seperti `compile()` dalam kuliah 1.2, tetapi secara berterusan.',
        'Python source files are saved as UTF-8 by default, and Python 3.13 reads source files as UTF-8. A good code editor also turns Tab into four spaces, shows line numbers (essential for reading tracebacks) and removes trailing spaces. The Python extension uses a language server (Pylance) to underline syntax errors and undefined names before the program runs — like `compile()` in lecture 1.2, but continuously.')),
    S('technical_terminology', TERMS('code-editor', 'terminal', 'python-script', 'language-server')),
    S('syntax_rules',
      UL(
        ['Terminal: `cd projek` masuk, `cd ..` keluar, `ls`/`dir` menyenaraikan, `python3 main.py` menjalankan.', 'Terminal: `cd project` enters, `cd ..` leaves, `ls`/`dir` lists, `python3 main.py` runs.'],
        ['Nama fail Python: huruf kecil dengan garis bawah (`kira_bil.py`), tanpa ruang, dan **bukan** nama modul standard (`math.py`, `random.py`).', 'Python file names: lower case with underscores (`bill_calculator.py`), no spaces, and **not** a standard module name (`math.py`, `random.py`).'],
        ['Dalam program, gunakan `/` dalam laluan relatif (`"data/marks.txt"`); `pathlib` menukarnya dengan betul pada Windows.', 'In a program, use `/` in relative paths (`"data/marks.txt"`); `pathlib` converts it correctly on Windows.'],
        ['`Path("a") / "b.txt"` menggabungkan laluan dengan selamat.', '`Path("a") / "b.txt"` joins paths safely.'],
      )),
    S('code_demonstration',
      CODE('project-folder', 'python', 'python', ['Mencipta dan menyenaraikan folder projek', 'Creating and listing a project folder'], `
from pathlib import Path

project = Path("my_project")
project.mkdir()
(project / "main.py").write_text('print("main")\\n', encoding="utf-8")
(project / "notes.txt").write_text("todo\\n", encoding="utf-8")
for item in sorted(project.iterdir()):
    print(item.name, item.suffix, item.is_file())
`, 'main.py .py True\nnotes.txt .txt True'),
      EXPLAIN('project-folder',
        ['1', '`pathlib.Path` mewakili laluan fail dan folder sebagai objek.', '`pathlib.Path` represents file and folder paths as objects.'],
        ['3–4', 'Laluan **relatif** `my_project` dicipta dalam direktori kerja semasa. (Pengesahan kursus menjalankan setiap contoh dalam folder sementara yang kosong.)', 'The **relative** path `my_project` is created in the current working directory. (Course verification runs each example in an empty temporary folder.)'],
        ['5–6', 'Operator `/` menggabungkan laluan. `write_text` menulis teks UTF-8 ke fail — seperti menyimpan dalam editor.', 'The `/` operator joins paths. `write_text` writes UTF-8 text to a file — like saving in an editor.'],
        ['7–8', 'Seperti `ls`: menyenaraikan kandungan folder (disusun supaya susunannya tetap), dengan sambungan dan jenis setiap item.', 'Like `ls`: lists the folder’s contents (sorted so the order is fixed), with each item’s extension and type.'])),
    S('complete_examples',
      CODE('relative-paths', 'python', 'python', ['Laluan relatif dan direktori kerja', 'Relative paths and the working directory'], `
from pathlib import Path

marks_file = Path("data") / "marks.txt"
print("Relative?", not marks_file.is_absolute())
print("Parts:", marks_file.parts)
marks_file.parent.mkdir()
marks_file.write_text("Aina 85\\nBen 72\\n", encoding="utf-8")
print(marks_file.read_text(encoding="utf-8").splitlines())
`, "Relative? True\nParts: ('data', 'marks.txt')\n['Aina 85', 'Ben 72']", {
        debug: BUG(`
from pathlib import Path

Path("data").mkdir()
Path("data/marks.txt").write_text("Aina 85\\n", encoding="utf-8")
print(open("data/mark.txt").read())
`, "example.py:5: FileNotFoundError: [Errno 2] No such file or directory: 'data/mark.txt'",
          'Fail yang wujud ialah `marks.txt`, tetapi program membuka `mark.txt`. Python mencari laluan relatif itu dari direktori kerja dan tidak menemuinya. `FileNotFoundError` dengan `[Errno 2]` mempunyai dua punca biasa: nama fail salah eja, atau program dijalankan dari folder yang salah. Semak kedua-duanya: senaraikan fail (`ls`) dan semak direktori kerja (`pwd`).',
          'The file that exists is `marks.txt`, but the program opens `mark.txt`. Python looks for that relative path from the working directory and does not find it. `FileNotFoundError` with `[Errno 2]` has two common causes: a misspelled file name, or the program being run from the wrong folder. Check both: list the files (`ls`) and check the working directory (`pwd`).'),
      }),
      EXPLAIN('relative-paths',
        ['1', 'Kelas `Path` daripada `pathlib` diimport untuk bekerja dengan laluan dan fail.', 'The `Path` class from `pathlib` is imported to work with paths and files.'],
        ['3', 'Laluan relatif dibina daripada dua bahagian; `pathlib` menggunakan pemisah yang betul untuk sistem.', 'A relative path built from two parts; `pathlib` uses the right separator for the system.'],
        ['4–5', 'Laluan ini tidak bermula dari akar, dan terdiri daripada folder `data` dan fail `marks.txt`.', 'This path does not start at the root, and consists of the folder `data` and the file `marks.txt`.'],
        ['6–7', 'Cipta folder induk, kemudian tulis dua baris ke fail.', 'Create the parent folder, then write two lines to the file.'],
        ['8', 'Baca semula dan pecahkan kepada senarai baris.', 'Read it back and split it into a list of lines.']),
      CODE('utf8-save', 'python', 'python', ['Menyimpan teks dalam UTF-8', 'Saving text in UTF-8'], `
from pathlib import Path

menu = Path("menu.txt")
menu.write_text("Nasi lemak — RM5\\nCendol — RM3\\n", encoding="utf-8")
data = menu.read_bytes()
print(len(menu.read_text(encoding="utf-8")), "characters")
print(len(data), "bytes")
`, '30 characters\n34 bytes', {
        debug: BUG(`
from pathlib import Path

Path("menu.txt").write_text("Nasi lemak — RM5", encoding="ascii")
`, "example.py:3: UnicodeEncodeError: 'ascii' codec can't encode character '\\u2014' in position 11: ordinal not in range(128)",
          'ASCII hanya mengandungi 128 aksara (huruf Inggeris, digit, tanda baca asas). Sengkang panjang `—` (U+2014) tiada dalam ASCII, jadi Python tidak dapat menyimpannya. Ini sama seperti editor yang ditetapkan kepada pengekodan lama. Sentiasa gunakan `encoding="utf-8"` — dan tetapkan editor anda kepada UTF-8.',
          'ASCII contains only 128 characters (English letters, digits, basic punctuation). The em dash `—` (U+2014) is not in ASCII, so Python cannot save it. This is the same as an editor set to an old encoding. Always use `encoding="utf-8"` — and set your editor to UTF-8.'),
      }),
      EXPLAIN('utf8-save',
        ['1', 'Kelas `Path` daripada `pathlib` diimport untuk bekerja dengan laluan dan fail.', 'The `Path` class from `pathlib` is imported to work with paths and files.'],
        ['3–4', 'Menulis dua baris yang mengandungi sengkang panjang `—`, aksara di luar ASCII.', 'Writes two lines that contain the em dash `—`, a character outside ASCII.'],
        ['5', '`read_bytes` membaca bait mentah fail, seperti yang disimpan di cakera.', '`read_bytes` reads the file’s raw bytes, as stored on disk.'],
        ['6–7', '30 aksara tetapi 34 bait: setiap `—` mengambil 3 bait dalam UTF-8, manakala huruf biasa mengambil 1 bait.', '30 characters but 34 bytes: each `—` takes 3 bytes in UTF-8, while ordinary letters take 1 byte.'])),
    S('line_by_line',
      EXPLAIN('project-folder',
        ['4', '`mkdir()` gagal dengan `FileExistsError` jika folder sudah wujud — menjalankan contoh dua kali dalam folder yang sama akan menunjukkannya. `mkdir(exist_ok=True)` mengelakkannya.', '`mkdir()` fails with `FileExistsError` if the folder already exists — running the example twice in the same folder would show it. `mkdir(exist_ok=True)` avoids that.']),
      EXPLAIN('utf8-save',
        ['4', '`encoding="utf-8"` ditulis secara eksplisit. Pada sesetengah sistem Windows lama, pengekodan lalai bukan UTF-8, jadi menyatakannya menjadikan program berkelakuan sama di mana-mana.', '`encoding="utf-8"` is written explicitly. On some older Windows systems the default encoding is not UTF-8, so stating it makes the program behave the same everywhere.'])),
    S('why_this_way',
      P('Mengapa tidak menulis kod dalam Microsoft Word atau Notepad sahaja? Pemproses kata menyimpan format tersembunyi dan menukar tanda petik lurus `"` kepada petik melengkung `“ ”`, yang bukan sintaks Python yang sah. Notepad tidak menyerlahkan sintaks atau menjaga inden. Editor kod direka untuk kod: setiap ciri — nombor baris, inden automatik, penyerlahan, penyemakan ralat langsung, terminal terbina dalam — mengurangkan masa antara kesilapan dan pembetulannya.',
        'Why not write code in Microsoft Word or plain Notepad? A word processor stores hidden formatting and turns straight quotes `"` into curly quotes `“ ”`, which are not valid Python syntax. Notepad does not highlight syntax or keep indentation. A code editor is designed for code: every feature — line numbers, automatic indentation, highlighting, live error checking, a built-in terminal — shortens the time between a mistake and its fix.'),
      P('Terminal kekal penting walaupun editor mempunyai butang ▶: pelayan, bekas (container) dan sistem automasi tidak mempunyai butang — hanya arahan. Memahami direktori kerja dan laluan menjadikan program anda berfungsi di mana-mana, bukan sahaja pada komputer anda.', 'The terminal stays essential even though editors have a ▶ button: servers, containers and automation systems have no buttons — only commands. Understanding working directories and paths makes your programs work everywhere, not just on your computer.')),
    S('execution_flow',
      OL(
        ['Anda menyunting `main.py` dalam editor; perubahan berada dalam ingatan editor sahaja.', 'You edit `main.py` in the editor; the changes are only in the editor’s memory.'],
        ['Anda menyimpan (Ctrl+S / Cmd+S); teks ditulis ke cakera sebagai UTF-8.', 'You save (Ctrl+S / Cmd+S); the text is written to disk as UTF-8.'],
        ['Dalam terminal, di folder projek, anda menjalankan `python3 main.py`.', 'In the terminal, in the project folder, you run `python3 main.py`.'],
        ['Python membaca fail dari cakera, mengkompil dan menjalankannya; output dan ralat muncul dalam terminal.', 'Python reads the file from disk, compiles and runs it; output and errors appear in the terminal.'],
        ['Anda membaca nombor baris dalam traceback, kembali ke baris itu dalam editor, membetulkan, dan mengulang dari langkah 2.', 'You read the line number in the traceback, go back to that line in the editor, fix it, and repeat from step 2.'],
      )),
    S('memory_behaviour',
      P('Editor dan terminal ialah dua program berasingan dengan ingatan berasingan. Teks dalam tetingkap editor yang belum disimpan **tidak wujud** bagi Python. Penanda "●" pada tab editor bermaksud perubahan belum disimpan. Apabila program berjalan, ia ialah proses ketiga: ia membaca fail sekali pada permulaan, jadi mengubah fail semasa program berjalan tidak mengubah program itu. Setiap proses juga mempunyai direktori kerjanya sendiri, diwarisi daripada terminal yang melancarkannya.',
        'The editor and the terminal are two separate programs with separate memory. Text in an editor window that has not been saved **does not exist** for Python. The "●" marker on an editor tab means unsaved changes. When the program runs, it is a third process: it reads the file once at start-up, so changing the file while the program runs does not change the running program. Each process also has its own working directory, inherited from the terminal that launched it.')),
    S('alternative_implementations',
      P('Butang ▶ dan `python3 fail.py` melancarkan proses baharu. Pustaka standard juga boleh menjalankan fail skrip **di dalam** proses semasa dengan `runpy`, cara yang digunakan oleh `python3 -m`:', 'The ▶ button and `python3 file.py` launch a new process. The standard library can also run a script file **inside** the current process with `runpy`, the mechanism behind `python3 -m`:'),
      CODE('runpy-script', 'python', 'python', ['Menjalankan fail skrip dengan runpy', 'Running a script file with runpy'], `
import runpy
from pathlib import Path

Path("greet.py").write_text('print("Hello from greet.py")\\nanswer = 6 * 7\\n', encoding="utf-8")
namespace = runpy.run_path("greet.py", run_name="__main__")
print("Variable left by the script:", namespace["answer"])
`, 'Hello from greet.py\nVariable left by the script: 42'),
      EXPLAIN('runpy-script',
        ['1–2', '`runpy` menjalankan kod daripada fail; `pathlib` mencipta fail itu.', '`runpy` runs code from a file; `pathlib` creates that file.'],
        ['4', 'Skrip dua baris disimpan ke cakera, seperti dalam editor.', 'A two-line script saved to disk, as in an editor.'],
        ['5', 'Fail dijalankan dengan `__name__` ditetapkan kepada `"__main__"`, sama seperti `python3 greet.py`; output skrip muncul.', 'The file runs with `__name__` set to `"__main__"`, just like `python3 greet.py`; the script’s output appears.'],
        ['6', '`run_path` memulangkan pemboleh ubah skrip — serupa dengan `python3 -i` dalam kuliah 2.2.', '`run_path` returns the script’s variables — similar to `python3 -i` in lecture 2.2.'])),
    S('common_mistakes',
      UL(
        ['Menjalankan program sebelum menyimpan, kemudian hairan mengapa perubahan "tidak berkesan".', 'Running the program before saving, then wondering why the change "had no effect".'],
        ['Menjalankan `python3 main.py` dari folder yang salah — `[Errno 2] No such file or directory`.', 'Running `python3 main.py` from the wrong folder — `[Errno 2] No such file or directory`.'],
        ['Menamakan fail `random.py` atau `statistics.py`, menyebabkan `import` memuatkan fail anda dan bukan modul standard.', 'Naming a file `random.py` or `statistics.py`, so `import` loads your file instead of the standard module.'],
        ['Menyalin kod daripada dokumen Word atau PDF yang mengandungi petik melengkung `“ ”` — `SyntaxError: invalid character`.', 'Copying code from a Word document or PDF that contains curly quotes `“ ”` — `SyntaxError: invalid character`.'],
        ['Membuka fail tunggal dan bukan folder dalam VS Code, jadi terminal berada di direktori yang tidak dijangka.', 'Opening a single file instead of a folder in VS Code, so the terminal is in an unexpected directory.'],
      )),
    S('debugging',
      P('Traceback memberi **nama fail dan nombor baris**; editor kod membolehkan anda melompat ke baris itu (dalam VS Code, Ctrl+klik pada laluan dalam terminal, atau Ctrl+G untuk ke baris). Program berikut menunjukkan maklumat yang sama yang digunakan oleh editor: ia menjalankan skrip berpepijat, menangkap exception, dan mencetak fail, nombor baris dan teks baris dari bingkai terakhir traceback.',
        'A traceback gives the **file name and line number**; a code editor lets you jump to that line (in VS Code, Ctrl+click the path in the terminal, or Ctrl+G to go to a line). The following program shows the same information an editor uses: it runs a buggy script, catches the exception, and prints the file, the line number and the line’s text from the traceback’s last frame.'),
      CODE('locate-error', 'python', 'python', ['Mencari fail dan baris ralat', 'Locating the file and line of an error'], `
import runpy
import traceback
from pathlib import Path

Path("report.py").write_text("a = 1\\nb = 0\\nprint(a / b)\\n", encoding="utf-8")
try:
    runpy.run_path("report.py")
except ZeroDivisionError as error:
    frame = traceback.extract_tb(error.__traceback__)[-1]
    print("File:", frame.filename)
    print("Line:", frame.lineno)
    print("Code:", frame.line)
`, 'File: report.py\nLine: 3\nCode: print(a / b)'),
      EXPLAIN('locate-error',
        ['1–3', 'Modul untuk menjalankan fail, membaca traceback, dan menulis fail.', 'Modules for running a file, reading the traceback, and writing a file.'],
        ['5', 'Skrip tiga baris dengan pembahagian dengan sifar pada baris 3.', 'A three-line script with a division by zero on line 3.'],
        ['7', 'Jalankan skrip di dalam blok `try` (PY114) supaya exception boleh ditangkap.', 'Run the script inside a `try` block (PY114) so the exception can be caught.'],
        ['8–9', 'Bingkai **terakhir** traceback ialah tempat ralat berlaku — sama seperti baris terakhir `File "…", line N` dalam terminal.', 'The **last** frame of the traceback is where the error happened — just like the last `File "…", line N` line in the terminal.'],
        ['10–12', 'Fail, nombor baris dan teks baris: tepat maklumat yang diperlukan untuk melompat ke pepijat dalam editor.', 'The file, the line number and the line’s text: exactly the information needed to jump to the bug in the editor.'])),
    S('performance',
      P('Editor kod moden menganalisis kod anda secara berterusan. Untuk projek yang sangat besar, pelayan bahasa boleh menggunakan banyak ingatan; menutup folder yang tidak berkaitan dan mengecualikan folder seperti `__pycache__` atau `.venv` daripada carian memastikan editor responsif. Dalam terminal, menjalankan skrip secara terus (`python3 main.py`) adalah sedikit lebih pantas daripada melalui butang editor, kerana tiada langkah tambahan — tetapi perbezaannya tidak ketara untuk program PY101.',
        'Modern code editors analyse your code continuously. For very large projects the language server can use a lot of memory; closing unrelated folders and excluding folders such as `__pycache__` or `.venv` from search keeps the editor responsive. In the terminal, running a script directly (`python3 main.py`) is slightly faster than going through the editor’s button, since there are no extra steps — but the difference is not noticeable for PY101 programs.')),
    S('software_engineering',
      P('Laluan mutlak yang ditulis terus dalam kod hanya berfungsi pada satu komputer. Bandingkan:', 'An absolute path written straight into the code only works on one computer. Compare:'),
      CODE('absolute-path-poor', 'python', 'python', ['Pelaksanaan lemah: laluan mutlak peribadi', 'Poor implementation: a personal absolute path'], `
from pathlib import Path

marks = Path("C:/Users/Ali/Desktop/marks.txt")
print("File name:", marks.name)
print("Exists on this computer:", marks.exists())
`, 'File name: marks.txt\nExists on this computer: False'),
      EXPLAIN('absolute-path-poor',
        ['1–5', 'Laluan ini merujuk kepada desktop seorang pengguna di Windows. Pada komputer lain — atau pelayan Linux — ia tidak wujud, jadi program gagal. Laluan peribadi juga mendedahkan nama pengguna dalam kod yang dikongsi.', 'This path points to one user’s desktop on Windows. On another computer — or a Linux server — it does not exist, so the program fails. Personal paths also expose user names in shared code.']),
      CODE('project-relative-improved', 'python', 'python', ['Pelaksanaan lebih baik: laluan relatif kepada folder projek', 'Improved implementation: paths relative to the project folder'], `
from pathlib import Path

PROJECT_DIR = Path("course_project")
DATA_DIR = PROJECT_DIR / "data"
DATA_DIR.mkdir(parents=True)
marks = DATA_DIR / "marks.txt"
marks.write_text("Aina 85\\n", encoding="utf-8")
print(marks.as_posix(), marks.exists())
`, 'course_project/data/marks.txt True'),
      EXPLAIN('project-relative-improved',
        ['1', 'Kelas `Path` daripada `pathlib` diimport untuk bekerja dengan laluan dan fail.', 'The `Path` class from `pathlib` is imported to work with paths and files.'],
        ['3–4', 'Semua laluan dibina daripada satu titik permulaan projek. Dalam skrip sebenar, `Path(__file__).parent` memberi folder fail skrip itu sendiri — bebas daripada direktori kerja.', 'Every path is built from one project starting point. In a real script, `Path(__file__).parent` gives the folder of the script file itself — independent of the working directory.'],
        ['5–7', '`parents=True` mencipta folder induk yang tiada. Fail ditulis dalam struktur projek.', '`parents=True` creates missing parent folders. The file is written inside the project structure.'],
        ['8', '`as_posix()` memaparkan laluan dengan `/` pada setiap sistem.', '`as_posix()` shows the path with `/` on every system.'])),
    S('industry_use_cases',
      UL(
        ['**Pasukan perisian** berkongsi tetapan editor (`.vscode/settings.json`, `.editorconfig`) supaya semua ahli menggunakan inden dan pengekodan yang sama.', '**Software teams** share editor settings (`.vscode/settings.json`, `.editorconfig`) so every member uses the same indentation and encoding.'],
        ['**Pentadbir sistem** bekerja hampir sepenuhnya dalam terminal, menjalankan skrip Python melalui SSH pada pelayan jauh.', '**System administrators** work almost entirely in the terminal, running Python scripts over SSH on remote servers.'],
        ['**Saintis data** menggunakan VS Code atau JupyterLab dengan interpreter yang dipilih untuk setiap projek.', '**Data scientists** use VS Code or JupyterLab with an interpreter selected per project.'],
        ['**Sistem CI/CD** menjalankan arahan terminal yang sama (`python3 -m pytest`) yang pembangun jalankan secara tempatan.', '**CI/CD systems** run the same terminal commands (`python3 -m pytest`) that developers run locally.'],
      )),
    S('practical_demonstration',
      OL(
        ['Pasang VS Code dan sambungan Python. Buka folder baharu `py101` dan pilih interpreter Python 3.13.', 'Install VS Code and the Python extension. Open a new folder `py101` and select the Python 3.13 interpreter.'],
        ['Cipta `hello.py` yang mencetak nama anda. Jalankannya dengan butang ▶, kemudian dari terminal dengan `python3 hello.py`.', 'Create `hello.py` that prints your name. Run it with the ▶ button, then from the terminal with `python3 hello.py`.'],
        ['Dalam terminal, `cd ..` keluar dari folder dan jalankan `python3 hello.py` semula. Baca ralat, kemudian betulkan dengan `python3 py101/hello.py`.', 'In the terminal, `cd ..` out of the folder and run `python3 hello.py` again. Read the error, then fix it with `python3 py101/hello.py`.'],
        ['Ubah fail tanpa menyimpan dan jalankan dari terminal. Perhatikan bahawa output lama masih muncul.', 'Change the file without saving and run it from the terminal. Notice the old output still appears.'],
      )),
    S('mini_project',
      P('**Pembina rangka projek.** Tulis program yang mencipta struktur projek Python yang kemas — `main.py`, `README.md` dan folder `data/` dengan fail contoh — kemudian mencetak pepohon folder dengan inden.', '**A project scaffolder.** Write a program that creates a tidy Python project structure — `main.py`, `README.md` and a `data/` folder with a sample file — then prints the folder tree with indentation.'),
      CODE('scaffold-project', 'python', 'python', ['Penyelesaian contoh', 'Example solution'], `
from pathlib import Path

root = Path("bill_calculator")
files = {
    "main.py": 'print("Bill calculator")\\n',
    "README.md": "# Bill calculator\\n",
    "data/prices.txt": "teh tarik 2.50\\n",
}
for relative_name, content in files.items():
    target = root / relative_name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")

print(root.name + "/")
for path in sorted(root.rglob("*")):
    depth = len(path.relative_to(root).parts)
    print("    " * depth + path.name + ("/" if path.is_dir() else ""))
`, 'bill_calculator/\n    README.md\n    data/\n        prices.txt\n    main.py'),
      EXPLAIN('scaffold-project',
        ['1', 'Kelas `Path` daripada `pathlib` diimport untuk bekerja dengan laluan dan fail.', 'The `Path` class from `pathlib` is imported to work with paths and files.'],
        ['3–8', 'Folder akar dan kamus fail: laluan relatif → kandungan.', 'The root folder and a dictionary of files: relative path → content.'],
        ['9–12', 'Untuk setiap fail: bina laluan penuh, cipta folder induk jika perlu, tulis kandungan UTF-8.', 'For each file: build the full path, create the parent folders if needed, write the UTF-8 content.'],
        ['14', 'Baris pertama pepohon.', 'The first line of the tree.'],
        ['15–17', '`rglob("*")` mencari semua fail dan folder secara rekursif; kedalaman menentukan bilangan inden empat ruang. Folder ditandakan dengan `/`.', '`rglob("*")` finds every file and folder recursively; the depth sets the number of four-space indents. Folders are marked with `/`.'])),
    S('summary',
      UL(
        ['Tulis kod dalam editor kod (VS Code + sambungan Python, atau IDLE); pilih interpreter 3.13.', 'Write code in a code editor (VS Code + the Python extension, or IDLE); select the 3.13 interpreter.'],
        ['Aliran kerja: sunting → simpan → jalankan → baca output → betulkan.', 'Workflow: edit → save → run → read the output → fix.'],
        ['Laluan relatif dicari dari direktori kerja semasa program berjalan.', 'Relative paths are looked up from the working directory at run time.'],
        ['Sentiasa gunakan UTF-8 dan nyatakan `encoding="utf-8"` untuk fail teks.', 'Always use UTF-8 and state `encoding="utf-8"` for text files.'],
        ['Elakkan laluan mutlak peribadi; bina laluan daripada folder projek.', 'Avoid personal absolute paths; build paths from the project folder.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah kod yang disalin daripada Word boleh menyebabkan ralat sintaks?', 'Why can code copied from Word cause a syntax error?'],
        ['Anda menjalankan `python3 main.py` dan mendapat `[Errno 2]`. Senaraikan dua punca yang mungkin.', 'You run `python3 main.py` and get `[Errno 2]`. List two possible causes.'],
        ['Apakah perbezaan antara `data/marks.txt` dan `/home/aina/data/marks.txt`?', 'What is the difference between `data/marks.txt` and `/home/aina/data/marks.txt`?'],
        ['Mengapakah `—` mengambil lebih banyak bait daripada `a` dalam UTF-8?', 'Why does `—` take more bytes than `a` in UTF-8?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Getting Started with Python in VS Code', url: 'https://code.visualstudio.com/docs/python/python-tutorial' },
        { title: 'IDLE — Python’s Integrated Development and Learning Environment', url: `${PYDOCS}/library/idle.html` },
        { title: 'pathlib — Object-oriented filesystem paths', url: `${PYDOCS}/library/pathlib.html` },
        { title: 'Python Setup and Usage — Editors and IDEs', url: `${PYDOCS}/using/editors.html` },
        { title: 'Unicode HOWTO', url: `${PYDOCS}/howto/unicode.html` },
        { title: 'runpy — Locating and executing Python modules', url: `${PYDOCS}/library/runpy.html` },
      )),
  ],
};

export const PY101_M2: LectureContentDef[] = [PY101_2_1, PY101_2_2, PY101_2_3];
