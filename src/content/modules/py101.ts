import type { ModuleContentDef } from '@/db/content/types';
import type { ModuleSectionKind } from '@/db/types';

/**
 * PY101 module-level learning materials (the 11-section module standard).
 * A module explains the overall topic and how its three lectures connect; it does not repeat lecture
 * explanations or examples (checked by validatePackageModules). Each code fence is followed by its expected
 * output and is executed by CPython 3.13 (npm run verify:code); the code is identical in both languages.
 */

type Texts = Record<ModuleSectionKind, [ms: string, en: string]>;
const PYDOCS = 'https://docs.python.org/3.13';

/** A verified example: a Python fence followed by its exact output. */
const example = (code: string, output: string) => `\`\`\`python\n${code}\n\`\`\`\n\n\`\`\`output\n${output}\n\`\`\``;

const ORDER: ModuleSectionKind[] = [
  'module_overview', 'learning_objectives', 'prerequisites', 'core_theory', 'learning_notes', 'key_concepts',
  'terminology', 'examples', 'applications', 'module_summary', 'references',
];
const build = (courseCode: string, module: number, t: Texts): ModuleContentDef => ({
  courseCode,
  module,
  sections: ORDER.map((kind) => ({ kind, body: { ms: t[kind][0], en: t[kind][1] } })),
});

// ─── Module 1 — Computers, Programs and Programming Languages ─────────────

const M1_EX1 = example(`import dis

source = "price = 4.5\\nquantity = 3\\nprint(price * quantity)\\n"
program = compile(source, "order.py", "exec")
steps = [instruction.opname for instruction in dis.get_instructions(program)]
print("Lines of source code:", len(source.splitlines()))
print("Bytecode instructions:", len(steps))
print("Result when executed:")
exec(program)`, `Lines of source code: 3
Bytecode instructions: 13
Result when executed:
13.5`);

const M1_EX2 = example(`# Input: a duration recorded by a sports watch, in seconds
recorded_seconds = 5025

# Process: split the total into hours, minutes and seconds
hours, remainder = divmod(recorded_seconds, 3600)
minutes, seconds = divmod(remainder, 60)

# Output: a readable summary
print(f"{recorded_seconds} s = {hours} h {minutes} min {seconds} s")`, '5025 s = 1 h 23 min 45 s');

const M1: Texts = {
  module_overview: [
    'Modul ini membina gambaran besar tentang apa yang berlaku apabila seseorang "menulis program". Ia bermula dengan idea program sebagai penyelesaian masalah yang dinyatakan dengan tepat, kemudian mengikuti perjalanan program itu daripada teks yang ditulis oleh manusia hingga kepada operasi yang dilaksanakan oleh pemproses, dan akhirnya menerangkan mengapa Python dipilih sebagai bahasa pertama dalam program ini. Tiga kuliahnya saling bergantung: kuliah 1.1 menetapkan **apa** itu program, kuliah 1.2 menerangkan **bagaimana** program dijalankan, dan kuliah 1.3 menilai **mengapa** Python sesuai untuk tujuan itu. Selepas modul ini, pelajar mempunyai model mental yang akan digunakan setiap kali mereka membaca mesej ralat, memilih alat atau membandingkan bahasa.',
    'This module builds the big picture of what happens when someone "writes a program". It starts with the idea of a program as a precisely stated solution to a problem, then follows that program’s journey from text written by a person to operations carried out by the processor, and finally explains why Python was chosen as the first language of this programme. Its three lectures depend on each other: lecture 1.1 establishes **what** a program is, lecture 1.2 explains **how** a program is run, and lecture 1.3 evaluates **why** Python suits that purpose. After this module, learners have a mental model they will use every time they read an error message, choose a tool or compare languages.',
  ],
  learning_objectives: [
    '- Menghuraikan hubungan antara masalah, algoritma, kod sumber dan pelaksanaan oleh mesin.\n- Menggunakan model Input–Proses–Output untuk merancang program sebelum menulis kod.\n- Membandingkan strategi terjemahan (pengkompil, interpreter, bytecode) dan kesannya terhadap kelajuan, mudah alih dan pelaporan ralat.\n- Menjejak laluan program Python daripada fail sumber hingga output, dan meramalkan bila ralat dikesan.\n- Menilai kesesuaian Python untuk sesuatu tugas berdasarkan sejarah, falsafah reka bentuk dan ekosistemnya.',
    '- Describe the relationship between a problem, an algorithm, source code and execution by the machine.\n- Use the Input–Process–Output model to plan a program before writing code.\n- Compare translation strategies (compiler, interpreter, bytecode) and their effect on speed, portability and error reporting.\n- Trace the path of a Python program from source file to output, and predict when errors are detected.\n- Evaluate whether Python suits a task based on its history, design philosophy and ecosystem.',
  ],
  prerequisites: [
    'Tiada pengalaman pengaturcaraan diperlukan. Pelajar perlu selesa dengan aritmetik asas, menggunakan komputer untuk tugas harian, dan membaca teks teknikal ringkas dalam bahasa Inggeris.',
    'No programming experience is needed. Learners should be comfortable with basic arithmetic, using a computer for everyday tasks, and reading short technical texts in English.',
  ],
  core_theory: [
    'Pengaturcaraan boleh difahami sebagai satu **tangga abstraksi**. Di anak tangga teratas terdapat masalah dalam bahasa manusia: "berapakah bayaran setiap orang?". Di bawahnya terdapat algoritma, iaitu langkah penyelesaian yang tepat tetapi belum terikat pada mana-mana bahasa. Seterusnya kod sumber, iaitu algoritma itu dinyatakan dalam tatabahasa ketat sesebuah bahasa pengaturcaraan. Lebih rendah lagi terdapat perwakilan yang dihasilkan oleh alat terjemahan — dalam CPython, objek kod yang mengandungi bytecode — dan di dasar tangga terdapat arahan mesin yang dilaksanakan oleh pemproses. Setiap anak tangga menyembunyikan butiran anak tangga di bawahnya, dan setiap anak tangga mempunyai jenis kesilapannya sendiri: algoritma yang salah menghasilkan jawapan yang salah walaupun kod sempurna; tatabahasa yang salah dihentikan oleh penghurai sebelum apa-apa berjalan; operasi yang mustahil pada data tertentu hanya muncul semasa pelaksanaan.\n\nKeputusan reka bentuk sesebuah bahasa menentukan anak tangga mana yang paling kelihatan kepada pengatur cara. Bahasa yang dikompil terus kepada kod mesin mengalihkan banyak semakan ke peringkat sebelum program dijalankan dan menghasilkan program yang pantas tetapi terikat pada satu platform. Python memilih model hibrid: kompil yang cepat kepada bytecode mudah alih, kemudian mesin maya yang fleksibel. Pilihan ini, bersama falsafah "kebolehbacaan diutamakan" dan pustaka standard yang luas, menerangkan mengapa Python dominan dalam pendidikan, automasi dan sains data, tetapi kurang dipilih untuk enjin permainan atau perisian terbenam yang sangat terhad. Memahami pertukaran ini membolehkan pelajar memilih alat secara rasional, bukan berdasarkan populariti semata-mata.',
    'Programming can be understood as a **ladder of abstraction**. On the top rung is a problem in human language: "how much does each person pay?". Below it is an algorithm, the precise solution steps not yet tied to any language. Next comes source code, that algorithm expressed in the strict grammar of a programming language. Lower still is the representation produced by the translation tools — in CPython, a code object containing bytecode — and at the bottom of the ladder are the machine instructions the processor executes. Each rung hides the details of the rung below it, and each rung has its own kind of mistake: a wrong algorithm produces wrong answers even when the code is perfect; wrong grammar is stopped by the parser before anything runs; an operation that is impossible for particular data only appears during execution.\n\nA language’s design decisions determine which rungs are most visible to the programmer. Languages compiled straight to machine code move many checks to before the program runs and produce fast programs tied to one platform. Python chooses a hybrid model: quick compilation to portable bytecode, then a flexible virtual machine. That choice, together with the "readability first" philosophy and a broad standard library, explains why Python dominates education, automation and data science, yet is chosen less often for game engines or highly constrained embedded software. Understanding these trade-offs lets learners choose tools rationally rather than by popularity alone.',
  ],
  learning_notes: [
    'Belajar modul ini dengan melukis. Untuk setiap program kecil yang anda temui, lakar tiga kotak IPO, kemudian lakar tangga abstraksi dan tandakan di anak tangga mana setiap kesilapan yang anda lakukan berlaku. Salah faham yang paling kerap ialah menganggap "Python tidak dikompil": ingat bahawa CPython sentiasa mengkompil kepada bytecode sebelum menjalankan apa-apa, dan itulah sebabnya satu kurungan yang tertinggal menghalang seluruh fail. Salah faham kedua ialah menyamakan bahasa dengan pelaksanaannya; Python ialah spesifikasi, CPython hanyalah satu pelaksanaan. Semasa membaca sejarah Python, beri perhatian kepada peralihan Python 2 ke 3 sebagai kajian kes tentang kos memecahkan keserasian — pelajaran yang akan berulang dalam kursus kejuruteraan perisian kemudian. Uji kefahaman anda dengan menerangkan kepada rakan, tanpa nota, apa yang berlaku antara menekan Enter dan melihat output.',
    'Study this module by drawing. For each small program you meet, sketch the three IPO boxes, then sketch the abstraction ladder and mark on which rung each mistake you make occurs. The most frequent misconception is believing "Python is not compiled": remember that CPython always compiles to bytecode before running anything, which is why one missing bracket blocks the whole file. A second misconception is equating a language with its implementation; Python is a specification, CPython is just one implementation. When reading Python’s history, pay attention to the Python 2 to 3 transition as a case study in the cost of breaking compatibility — a lesson that returns in later software-engineering courses. Test your understanding by explaining to a friend, without notes, what happens between pressing Enter and seeing the output.',
  ],
  key_concepts: [
    '- **Tangga abstraksi:** masalah → algoritma → kod sumber → bytecode → kod mesin.\n- **Model IPO:** alat perancangan yang terpakai pada program, fungsi dan sistem.\n- **Masa pengesanan ralat:** tatabahasa semasa kompil; data dan operasi semasa pelaksanaan.\n- **Bahasa berbanding pelaksanaan:** Python (spesifikasi) dan CPython, PyPy, MicroPython (pelaksanaan).\n- **Pertukaran reka bentuk:** kelajuan, mudah alih, kebolehbacaan dan ekosistem.',
    '- **The abstraction ladder:** problem → algorithm → source code → bytecode → machine code.\n- **The IPO model:** a planning tool that applies to programs, functions and systems.\n- **When errors are detected:** grammar at compile time; data and operations during execution.\n- **Language versus implementation:** Python (the specification) and CPython, PyPy, MicroPython (implementations).\n- **Design trade-offs:** speed, portability, readability and ecosystem.',
  ],
  terminology: [
    '- [[algorithm|Algoritma]]: langkah penyelesaian yang tepat, bebas daripada bahasa.\n- [[source-code|Kod sumber]]: teks program yang ditulis oleh manusia.\n- [[compiler|Pengkompil]]: menterjemah program sepenuhnya sebelum ia dijalankan.\n- [[interpreter|Interpreter]]: melaksanakan program semasa ia berjalan.\n- [[bytecode|Bytecode]]: arahan perantaraan untuk mesin maya.\n- [[cpython|CPython]]: pelaksanaan rujukan Python.\n- [[ipo-model|Model IPO]]: input, proses, output.',
    '- [[algorithm|Algorithm]]: precise solution steps, independent of any language.\n- [[source-code|Source code]]: program text written by people.\n- [[compiler|Compiler]]: translates a whole program before it runs.\n- [[interpreter|Interpreter]]: executes a program while it runs.\n- [[bytecode|Bytecode]]: intermediate instructions for a virtual machine.\n- [[cpython|CPython]]: the reference implementation of Python.\n- [[ipo-model|IPO model]]: input, process, output.',
  ],
  examples: [
    `Contoh pertama menuruni tangga abstraksi dalam satu program: tiga baris kod sumber dikompil kepada objek kod, bytecodenya dikira, kemudian objek itu dilaksanakan. Bilangan arahan bytecode khusus untuk CPython 3.13 — versi lain mungkin berbeza, yang menunjukkan bahawa bytecode ialah butiran pelaksanaan dan bukan sebahagian daripada bahasa.\n\n${M1_EX1}\n\nContoh kedua menunjukkan model IPO dengan data yang biasa: tempoh yang direkodkan oleh jam sukan ditukar kepada jam, minit dan saat. Fungsi terbina dalam \`divmod\` memulangkan hasil bahagi dan bakinya sekali gus.\n\n${M1_EX2}`,
    `The first example walks down the abstraction ladder in one program: three lines of source code are compiled to a code object, its bytecode is counted, then the object is executed. The number of bytecode instructions is specific to CPython 3.13 — other versions may differ, which shows that bytecode is an implementation detail rather than part of the language.\n\n${M1_EX1}\n\nThe second example shows the IPO model with familiar data: a duration recorded by a sports watch is converted into hours, minutes and seconds. The built-in function \`divmod\` returns the quotient and the remainder at once.\n\n${M1_EX2}`,
  ],
  applications: [
    'Model mental modul ini digunakan setiap hari dalam industri. Jurutera yang memilih teknologi untuk projek baharu menimbang kelajuan, mudah alih dan kemahiran pasukan — pertukaran yang sama yang dikaji di sini. Penganalisis sistem menggunakan model IPO dalam dokumen keperluan. Pasukan sokongan membezakan ralat sintaks dan ralat runtime untuk menentukan sama ada masalah berpunca daripada kod atau data pelanggan. Pengurus produk memahami mengapa prototaip Python boleh dibina dengan cepat tetapi bahagian kritikal prestasi mungkin ditulis semula dalam bahasa yang dikompil.',
    'This module’s mental model is used every day in industry. Engineers choosing technology for a new project weigh speed, portability and team skills — the same trade-offs studied here. Systems analysts use the IPO model in requirements documents. Support teams distinguish syntax errors from runtime errors to decide whether a problem comes from the code or from a customer’s data. Product managers understand why a Python prototype can be built quickly while performance-critical parts may later be rewritten in a compiled language.',
  ],
  module_summary: [
    'Program ialah algoritma yang dinyatakan dengan tepat dalam bahasa pengaturcaraan. CPython mengkompil kod sumber kepada bytecode dan menjalankannya dengan mesin maya, jadi ralat tatabahasa dikesan sebelum pelaksanaan dan ralat data semasa pelaksanaan. Python mengutamakan kebolehbacaan dan menyediakan ekosistem yang luas, menjadikannya pilihan kukuh untuk pembelajaran dan banyak bidang profesional, walaupun bukan untuk setiap tugas.',
    'A program is an algorithm stated precisely in a programming language. CPython compiles source code to bytecode and runs it on a virtual machine, so grammar errors are detected before execution and data errors during it. Python puts readability first and offers a broad ecosystem, making it a strong choice for learning and many professional fields, though not for every task.',
  ],
  references: [
    `- [Python Glossary](${PYDOCS}/glossary.html)\n- [General Python FAQ](${PYDOCS}/faq/general.html)\n- [dis — Disassembler for Python bytecode](${PYDOCS}/library/dis.html)\n- [Think Python, 3rd edition — Chapter 1](https://allendowney.github.io/ThinkPython/chap01.html)`,
    `- [Python Glossary](${PYDOCS}/glossary.html)\n- [General Python FAQ](${PYDOCS}/faq/general.html)\n- [dis — Disassembler for Python bytecode](${PYDOCS}/library/dis.html)\n- [Think Python, 3rd edition — Chapter 1](https://allendowney.github.io/ThinkPython/chap01.html)`,
  ],
};

// ─── Module 2 — The Python Development Environment ────────────────────────

const M2_EX1 = example(`import platform
import sys

report = {
    "language version": f"{sys.version_info.major}.{sys.version_info.minor}",
    "implementation": platform.python_implementation(),
    "64-bit build": sys.maxsize > 2**32,
    "default text encoding": sys.getdefaultencoding(),
}
for item, value in report.items():
    print(f"{item:<22}: {value}")`, `language version      : 3.13
implementation        : CPython
64-bit build          : True
default text encoding : utf-8`);

const M2_EX2 = example(`import subprocess
import sys
from pathlib import Path

script = Path("tip.py")
script.write_text("bill = 80\\nprint('Tip:', bill * 0.10)\\n", encoding="utf-8")
first = subprocess.run([sys.executable, "tip.py"], capture_output=True, text=True)

script.write_text("bill = 80\\nprint('Tip:', round(bill * 0.15, 2))\\n", encoding="utf-8")
second = subprocess.run([sys.executable, "tip.py"], capture_output=True, text=True)

print("Run 1:", first.stdout.strip())
print("Run 2 after saving the edit:", second.stdout.strip())`, `Run 1: Tip: 8.0
Run 2 after saving the edit: Tip: 12.0`);

const M2: Texts = {
  module_overview: [
    'Modul ini menyediakan tempat kerja seorang pengatur cara Python dan mengajar cara menggunakannya dengan yakin. Kuliah 2.1 memasang interpreter dan mengesahkan versinya; kuliah 2.2 membandingkan dua cara bercakap dengan interpreter — shell interaktif dan skrip; kuliah 2.3 menggabungkan editor kod dan terminal menjadi aliran kerja harian. Bersama-sama, ketiga-tiganya membentuk **persekitaran pembangunan**: set alat, tetapan dan kebiasaan yang menentukan sama ada kod yang ditulis hari ini akan berjalan dengan cara yang sama esok, pada komputer lain, atau pada pelayan. Fokus modul ini ialah kebolehulangan dan pengesahan, bukan sekadar "membuat Python berjalan".',
    'This module sets up a Python programmer’s workplace and teaches how to use it with confidence. Lecture 2.1 installs the interpreter and verifies its version; lecture 2.2 compares two ways of talking to the interpreter — the interactive shell and scripts; lecture 2.3 combines a code editor and the terminal into an everyday workflow. Together, the three form a **development environment**: the set of tools, settings and habits that decides whether code written today will run the same way tomorrow, on another computer, or on a server. The module’s focus is reproducibility and verification, not merely "getting Python to run".',
  ],
  learning_objectives: [
    '- Menyediakan persekitaran Python 3.13 yang lengkap dan mengesahkannya dengan bukti, bukan andaian.\n- Menerangkan bagaimana PATH, direktori kerja dan interpreter yang dipilih menentukan program mana yang berjalan dan fail mana yang dibaca.\n- Memilih mod kerja yang sesuai — shell untuk penerokaan, skrip untuk hasil yang boleh diulang.\n- Mengamalkan aliran kerja sunting–simpan–jalankan–baca–betulkan dengan editor kod dan terminal.\n- Menyusun folder projek yang kemas dan mudah alih.',
    '- Set up a complete Python 3.13 environment and verify it with evidence, not assumptions.\n- Explain how PATH, the working directory and the selected interpreter decide which program runs and which files are read.\n- Choose the right working mode — the shell for exploration, scripts for repeatable results.\n- Practise the edit–save–run–read–fix workflow with a code editor and the terminal.\n- Organise a tidy, portable project folder.',
  ],
  prerequisites: [
    'Modul 1 (program, kod sumber dan CPython). Akses kepada komputer Windows, macOS atau Linux dengan hak untuk memasang perisian.',
    'Module 1 (programs, source code and CPython). Access to a Windows, macOS or Linux computer with permission to install software.',
  ],
  core_theory: [
    'Setiap kali program Python berjalan, tiga keputusan telah dibuat — selalunya tanpa disedari. **Interpreter mana?** Ditentukan oleh PATH dalam terminal, atau oleh tetapan interpreter dalam editor; dua pilihan ini tidak semestinya sama. **Kod mana?** Kandungan fail di cakera pada saat program bermula — bukan teks yang belum disimpan dalam editor, dan bukan pemboleh ubah yang tertinggal dalam sesi shell lama. **Dari folder mana?** Direktori kerja proses, yang menentukan ke mana laluan relatif menunjuk. Kebanyakan masalah "ia berfungsi pada komputer saya" berpunca daripada salah satu keputusan ini berbeza antara dua persekitaran.\n\nOleh itu, persekitaran pembangunan yang baik direka untuk menjadikan ketiga-tiga keputusan **eksplisit dan boleh disahkan**. Versi interpreter disemak dari dalam program dengan `sys.version_info`, bukan diandaikan daripada apa yang dipasang. Kod yang penting disimpan dalam fail dan dijalankan semula dari awal, kerana shell mengumpul keadaan tersembunyi. Laluan dibina daripada folder projek, dan fail teks dibaca dan ditulis dengan pengekodan UTF-8 yang dinyatakan. Shell dan skrip bukan pesaing tetapi rakan: shell memberi maklum balas serta-merta untuk soalan kecil, manakala skrip memberi hasil yang boleh diulang, disemak dan dikongsi. Prinsip yang sama — tetapkan, nyatakan, sahkan — menjadi asas persekitaran maya, bekas (container) dan saluran CI yang dipelajari kemudian dalam program ini.',
    'Every time a Python program runs, three decisions have already been made — often without anyone noticing. **Which interpreter?** Decided by PATH in the terminal, or by the interpreter setting in the editor; these two choices are not necessarily the same. **Which code?** The contents of the file on disk at the moment the program starts — not unsaved text in the editor, and not variables left over in an old shell session. **From which folder?** The process’s working directory, which decides where relative paths point. Most "it works on my computer" problems come from one of these decisions differing between two environments.\n\nA good development environment is therefore designed to make all three decisions **explicit and verifiable**. The interpreter version is checked from inside the program with `sys.version_info`, not assumed from what was installed. Important code is kept in files and rerun from the start, because the shell accumulates hidden state. Paths are built from the project folder, and text files are read and written with a stated UTF-8 encoding. The shell and scripts are not rivals but partners: the shell gives immediate feedback for small questions, while scripts give results that can be repeated, reviewed and shared. The same principle — fix it, state it, verify it — underlies the virtual environments, containers and CI pipelines studied later in this programme.',
  ],
  learning_notes: [
    'Simpan "log persekitaran" semasa mengikuti modul ini: catat versi Python yang dipasang, lokasi folder projek anda, editor dan interpreter yang dipilih, dan setiap ralat pemasangan yang anda temui beserta pembetulannya. Log ini menjadi rujukan apabila sesuatu berubah selepas kemas kini sistem. Amalkan peralihan antara shell dan skrip dengan sengaja: cuba idea dalam shell, kemudian salin hanya pernyataan yang berjaya ke dalam fail dan jalankan fail itu dari terminal baharu. Jika hasilnya berbeza, cari keadaan tersembunyi yang menyebabkannya. Akhir sekali, biasakan diri membaca arahan tepat yang dipaparkan oleh editor apabila anda menekan butang jalan — ia ialah arahan terminal yang sama, dan memahaminya menjadikan anda bebas daripada mana-mana editor tertentu.',
    'Keep an "environment log" while following this module: record the Python version installed, the location of your project folder, the editor and interpreter selected, and every installation error you met together with its fix. This log becomes a reference when something changes after a system update. Practise moving between the shell and scripts deliberately: try an idea in the shell, then copy only the statements that worked into a file and run that file from a fresh terminal. If the result differs, look for the hidden state that caused it. Finally, get used to reading the exact command the editor shows when you press its run button — it is the same terminal command, and understanding it frees you from any particular editor.',
  ],
  key_concepts: [
    '- **Tiga keputusan setiap larian:** interpreter mana, kod mana, folder mana.\n- **Pengesahan dari dalam program:** `sys.version_info` dan maklumat pelaksanaan.\n- **Keadaan tersembunyi shell** berbanding permulaan bersih skrip.\n- **Kod di cakera** — simpan sebelum menjalankan.\n- **Projek mudah alih:** laluan relatif kepada folder projek dan UTF-8.',
    '- **Three decisions per run:** which interpreter, which code, which folder.\n- **Verification from inside the program:** `sys.version_info` and implementation details.\n- **The shell’s hidden state** versus a script’s clean start.\n- **Code on disk** — save before running.\n- **Portable projects:** paths relative to the project folder, and UTF-8.',
  ],
  terminology: [
    '- [[cpython|CPython]]: interpreter yang dipasang dari python.org.\n- [[python-shell|Shell interaktif]]: mod `>>>` untuk penerokaan.\n- [[python-script|Skrip Python]]: fail `.py` yang dijalankan dari awal hingga akhir.\n- [[terminal|Terminal]]: antara muka arahan dengan direktori kerja.\n- [[code-editor|Editor kod]]: alat untuk menulis dan menjalankan kod sumber.\n- [[language-server|Pelayan bahasa]]: analisis kod berterusan dalam editor.',
    '- [[cpython|CPython]]: the interpreter installed from python.org.\n- [[python-shell|Interactive shell]]: the `>>>` mode for exploration.\n- [[python-script|Python script]]: a `.py` file run from start to finish.\n- [[terminal|Terminal]]: the command interface with a working directory.\n- [[code-editor|Code editor]]: a tool for writing and running source code.\n- [[language-server|Language server]]: continuous code analysis inside the editor.',
  ],
  examples: [
    `Contoh pertama ialah laporan persekitaran ringkas yang boleh disertakan dalam setiap laporan pepijat: versi bahasa, pelaksanaan, sama ada binaan 64-bit, dan pengekodan teks lalai. Nilai yang bergantung pada mesin (laluan, versi micro) sengaja tidak dicetak.\n\n${M2_EX1}\n\nContoh kedua mensimulasikan aliran kerja sunting–simpan–jalankan: skrip ditulis ke cakera dan dijalankan dalam proses baharu, kemudian disunting, **disimpan semula**, dan dijalankan sekali lagi. Setiap larian membaca fail di cakera pada saat ia bermula.\n\n${M2_EX2}`,
    `The first example is a short environment report that can be attached to every bug report: the language version, the implementation, whether it is a 64-bit build, and the default text encoding. Machine-dependent values (paths, the micro version) are deliberately not printed.\n\n${M2_EX1}\n\nThe second example simulates the edit–save–run workflow: a script is written to disk and run in a new process, then edited, **saved again**, and run once more. Each run reads the file on disk at the moment it starts.\n\n${M2_EX2}`,
  ],
  applications: [
    'Organisasi perisian bergantung pada persekitaran yang boleh dihasilkan semula. Pasukan menetapkan versi Python dalam fail konfigurasi projek, menggunakan tetapan editor bersama, dan menjalankan arahan terminal yang sama di komputer pembangun dan di pelayan CI. Juruanalisis data mendokumentasikan versi dan pustaka bersama keputusan mereka supaya analisis boleh diulang. Dalam sokongan teknikal, laporan persekitaran seperti dalam contoh modul ini sering menjimatkan berjam-jam soal jawab.',
    'Software organisations depend on reproducible environments. Teams pin the Python version in project configuration files, use shared editor settings, and run the same terminal commands on developer computers and on CI servers. Data analysts document versions and libraries alongside their results so analyses can be repeated. In technical support, an environment report like the one in this module’s example often saves hours of back-and-forth questions.',
  ],
  module_summary: [
    'Persekitaran pembangunan terdiri daripada interpreter, cara menjalankan kod, editor dan terminal. Setiap larian program bergantung pada interpreter yang dipilih, kandungan fail di cakera dan direktori kerja; menjadikan ketiga-tiganya eksplisit dan disahkan ialah asas kod yang boleh dipercayai. Gunakan shell untuk meneroka, skrip untuk hasil yang boleh diulang, dan folder projek yang kemas dengan UTF-8 untuk kerja yang mudah alih.',
    'A development environment consists of the interpreter, the way code is run, the editor and the terminal. Every program run depends on the selected interpreter, the file contents on disk and the working directory; making all three explicit and verified is the basis of trustworthy code. Use the shell to explore, scripts for repeatable results, and a tidy UTF-8 project folder for portable work.',
  ],
  references: [
    `- [Python Setup and Usage](${PYDOCS}/using/index.html)\n- [Using the Python Interpreter](${PYDOCS}/tutorial/interpreter.html)\n- [Getting Started with Python in VS Code](https://code.visualstudio.com/docs/python/python-tutorial)\n- [subprocess — Subprocess management](${PYDOCS}/library/subprocess.html)`,
    `- [Python Setup and Usage](${PYDOCS}/using/index.html)\n- [Using the Python Interpreter](${PYDOCS}/tutorial/interpreter.html)\n- [Getting Started with Python in VS Code](https://code.visualstudio.com/docs/python/python-tutorial)\n- [subprocess — Subprocess management](${PYDOCS}/library/subprocess.html)`,
  ],
};

// ─── Module 3 — First Programs: Output and Input ──────────────────────────

const M3_EX1 = example(`import io
import sys

# Simulated keyboard so the example can be verified automatically
sys.stdin = io.StringIO("  siti nurhaliza \\nPY101\\n3\\n")

name = input("Student name: ").strip().title()
course = input("Course code: ").strip().upper()
credits = int(input("Credit hours: "))

print("(answers received)")
print(f"{' REGISTRATION SLIP ':=^32}")
print(f"{'Name':<12}{name}")
print(f"{'Course':<12}{course}")
print(f"{'Credits':<12}{credits}")
print(f"{'Fee (RM)':<12}{credits * 150:,.2f}")`, `Student name: Course code: Credit hours: (answers received)
====== REGISTRATION SLIP =======
Name        Siti Nurhaliza
Course      PY101
Credits     3
Fee (RM)    450.00`);

const M3_EX2 = example(`"""Weekly class timetable printed as an aligned table."""

DAY_WIDTH = 10
TIME_WIDTH = 13

print(f"{'Day':<{DAY_WIDTH}}{'Time':<{TIME_WIDTH}}Course")
print("-" * (DAY_WIDTH + TIME_WIDTH + 6))
print(f"{'Monday':<{DAY_WIDTH}}{'08:00-10:00':<{TIME_WIDTH}}PY101")
print(f"{'Wednesday':<{DAY_WIDTH}}{'14:00-16:00':<{TIME_WIDTH}}PY101 lab")
print(f"{'Friday':<{DAY_WIDTH}}{'10:00-11:00':<{TIME_WIDTH}}Tutorial")`, `Day       Time         Course
-----------------------------
Monday    08:00-10:00  PY101
Wednesday 14:00-16:00  PY101 lab
Friday    10:00-11:00  Tutorial`);

const M3: Texts = {
  module_overview: [
    'Modul ini mengubah program daripada pengiraan tertutup kepada **perbualan** dengan pengguna. Kuliah 3.1 mengajar cara program bercakap — output, literal string, format dan komen; kuliah 3.2 mengajar cara program mendengar — membaca, menukar dan membersihkan input; kuliah 3.3 mengajar cara menyusun kedua-duanya menjadi urutan pernyataan yang betul dan mudah dibaca. Hasilnya ialah program interaktif lengkap pertama pelajar: ia bertanya soalan yang jelas, mengesahkan jawapan, mengira, dan membentangkan hasil dalam format yang kemas. Modul ini juga memperkenalkan disiplin reka bentuk interaksi: setiap prompt dan setiap baris output adalah sebahagian daripada antara muka pengguna.',
    'This module turns programs from closed calculations into a **conversation** with the user. Lecture 3.1 teaches how a program speaks — output, string literals, formatting and comments; lecture 3.2 teaches how a program listens — reading, converting and cleaning input; lecture 3.3 teaches how to arrange both into a correct, readable sequence of statements. The result is the learner’s first complete interactive program: it asks clear questions, confirms the answers, calculates, and presents the result in a tidy format. The module also introduces the discipline of interaction design: every prompt and every output line is part of the user interface.',
  ],
  learning_objectives: [
    '- Mereka bentuk interaksi teks lengkap: prompt yang jelas, input yang dibersihkan dan ditukar, dan output yang mengesahkan.\n- Menghasilkan output berformat — lajur dijajarkan, wang dengan dua tempat perpuluhan, tajuk berpusat — dengan f-string.\n- Menerangkan aliran data daripada papan kekunci, melalui penukaran jenis, ke pengiraan dan paparan.\n- Menyusun program dalam bahagian yang boleh dibaca dengan susunan pernyataan yang betul.\n- Mendokumentasikan program dengan docstring dan komen yang menerangkan sebab.',
    '- Design a complete text interaction: clear prompts, cleaned and converted input, and confirming output.\n- Produce formatted output — aligned columns, money with two decimal places, centred titles — with f-strings.\n- Explain the flow of data from the keyboard, through type conversion, to calculation and display.\n- Organise a program into readable sections with a correct statement order.\n- Document a program with docstrings and comments that explain reasons.',
  ],
  prerequisites: [
    'Modul 1 dan 2: anda boleh menulis, menyimpan dan menjalankan skrip `.py` dari editor kod dan terminal, dan memahami pemboleh ubah sebagai nama bagi nilai.',
    'Modules 1 and 2: you can write, save and run a `.py` script from a code editor and the terminal, and understand variables as names for values.',
  ],
  core_theory: [
    'Program interaktif ialah saluran yang mengalirkan data melalui beberapa **sempadan jenis**. Di pintu masuk, segala-galanya ialah teks: papan kekunci menghantar aksara, dan `input()` memulangkannya sebagai `str` tanpa mengira maksudnya. Di tengah, pengiraan memerlukan jenis yang bermakna — `int` untuk kiraan, `float` untuk ukuran dan wang. Di pintu keluar, segala-galanya kembali menjadi teks, kerana skrin hanya memaparkan aksara. Oleh itu, setiap program interaktif mempunyai dua titik penukaran yang wajib difikirkan dengan teliti: **teks → nilai** selepas input (di mana data yang tidak sah dikesan) dan **nilai → teks** sebelum output (di mana format dan ketepatan paparan ditentukan). Kebanyakan pepijat pemula dalam modul ini berlaku tepat di sempadan ini: nombor yang tidak ditukar, ruang tersembunyi yang tidak dibersihkan, atau nilai yang dipaparkan dengan terlalu banyak tempat perpuluhan.\n\nSusunan pernyataan mengikat ketiga-tiga peringkat. Data mesti dibaca sebelum ditukar, ditukar sebelum dikira, dan dikira sebelum dipaparkan; pemalar dan konfigurasi diletakkan di atas supaya mudah dicari dan diubah. Struktur ini sama dengan model IPO dari modul 1, tetapi kini dengan input sebenar dan output yang direka. Akhir sekali, program ialah dokumen untuk manusia juga: docstring menyatakan tujuan, nama menerangkan maksud, dan komen merekodkan keputusan yang tidak jelas daripada kod — seperti asal sesuatu kadar atau sebab sesuatu format dipilih.',
    'An interactive program is a pipeline that carries data across several **type boundaries**. At the entrance, everything is text: the keyboard sends characters, and `input()` returns them as a `str` regardless of their meaning. In the middle, calculation needs meaningful types — `int` for counts, `float` for measurements and money. At the exit, everything becomes text again, because the screen only displays characters. Every interactive program therefore has two conversion points that must be thought through carefully: **text → value** after input (where invalid data is detected) and **value → text** before output (where the format and display precision are decided). Most beginner bugs in this module happen exactly at these boundaries: numbers that were not converted, hidden spaces that were not cleaned, or values displayed with too many decimal places.\n\nThe order of statements ties the three stages together. Data must be read before it is converted, converted before it is calculated, and calculated before it is displayed; constants and configuration go at the top so they are easy to find and change. This structure is the IPO model from module 1, but now with real input and designed output. Finally, a program is a document for people too: the docstring states the purpose, names explain meaning, and comments record decisions that are not obvious from the code — such as where a rate comes from or why a format was chosen.',
  ],
  learning_notes: [
    'Apabila membina program interaktif, mulakan dari **output**: lakar dahulu rupa skrin yang dikehendaki, termasuk jajaran dan tempat perpuluhan, kemudian tentukan input yang diperlukan untuk menghasilkannya. Uji setiap program dengan tiga jenis input: input biasa, input dengan ruang dan huruf besar/kecil yang tidak kemas, dan input yang tidak sah seperti perkataan di tempat nombor. Perhatikan di mana setiap jenis gagal; modul 4 dan kursus PY103 akan memberi alat untuk mengendalikan kegagalan itu. Gunakan `repr()` setiap kali output kelihatan pelik. Semasa menyemak kod sendiri, baca prompt dengan suara: jika soalan itu mengelirukan apabila disebut, ia akan mengelirukan pengguna. Minta rakan mencuba program anda tanpa penjelasan, dan perhatikan di mana mereka teragak-agak.',
    'When building an interactive program, start from the **output**: first sketch the screen you want, including alignment and decimal places, then decide what input is needed to produce it. Test every program with three kinds of input: normal input, input with untidy spaces and letter case, and invalid input such as a word where a number belongs. Note where each kind fails; module 4 and course PY103 provide the tools to handle those failures. Use `repr()` whenever output looks strange. When reviewing your own code, read the prompts aloud: if a question is confusing when spoken, it will confuse the user. Ask a friend to try your program without any explanation, and notice where they hesitate.',
  ],
  key_concepts: [
    '- **Sempadan jenis:** teks masuk, nilai di tengah, teks keluar.\n- **Dua titik penukaran:** teks → nilai selepas input; nilai → teks sebelum output.\n- **Pembersihan input** sebelum penukaran dan perbandingan.\n- **Output yang direka:** jajaran, ketepatan dan label sebagai antara muka pengguna.\n- **Susunan dan struktur:** pemalar, input, proses, output; dokumentasi untuk manusia.',
    '- **Type boundaries:** text in, values in the middle, text out.\n- **Two conversion points:** text → value after input; value → text before output.\n- **Cleaning input** before conversion and comparison.\n- **Designed output:** alignment, precision and labels as the user interface.\n- **Order and structure:** constants, input, process, output; documentation for people.',
  ],
  terminology: [
    '- [[print-function|print()]]: menulis teks ke output standard.\n- [[input-function|input()]]: membaca satu baris sebagai `str`.\n- [[string-literal|Literal string]]: teks dalam kod sumber.\n- [[escape-sequence|Escape sequence]]: aksara khas seperti baris baharu dan tab.\n- [[hash-comment|Komen dan docstring]]: dokumentasi dalam kod.\n- [[statement|Pernyataan]]: satu arahan lengkap dalam urutan program.\n- [[standard-input|Input standard]]: aliran tempat input dibaca.',
    '- [[print-function|print()]]: writes text to standard output.\n- [[input-function|input()]]: reads one line as a `str`.\n- [[string-literal|String literal]]: text inside source code.\n- [[escape-sequence|Escape sequence]]: special characters such as newline and tab.\n- [[hash-comment|Comments and docstrings]]: documentation inside code.\n- [[statement|Statement]]: one complete instruction in a program’s sequence.\n- [[standard-input|Standard input]]: the stream input is read from.',
  ],
  examples: [
    `Contoh pertama menggabungkan ketiga-tiga kuliah dalam satu program: input dibaca, dibersihkan dan ditukar, kemudian slip pendaftaran berformat dicetak dengan tajuk berpusat, label dijajarkan dan yuran dengan pemisah ribuan. Papan kekunci digantikan dengan teks tetap supaya contoh ini boleh disahkan secara automatik; kerana jawapan yang ditaip tidak dipaparkan semula, ketiga-tiga prompt muncul pada satu baris, diikuti oleh \`(answers received)\`.\n\n${M3_EX1}\n\nContoh kedua memberi tumpuan kepada output sahaja: jadual waktu dengan lebar lajur yang ditetapkan sebagai pemalar. Lebar boleh dimasukkan ke dalam spesifikasi format sebagai \`{DAY_WIDTH}\`, jadi mengubah satu pemalar menyusun semula seluruh jadual.\n\n${M3_EX2}`,
    `The first example combines all three lectures in one program: input is read, cleaned and converted, then a formatted registration slip is printed with a title centred in a \`=\` frame, aligned labels and a fee with a thousands separator. The keyboard is replaced by fixed text so the example can be verified automatically; because typed answers are not echoed, the three prompts appear on one line, followed by \`(answers received)\`.\n\n${M3_EX1}\n\nThe second example focuses on output only: a timetable whose column widths are set as constants. A width can be placed inside a format specification as \`{DAY_WIDTH}\`, so changing one constant realigns the whole table.\n\n${M3_EX2}`,
  ],
  applications: [
    'Corak input–tukar–kira–format yang dipelajari dalam modul ini terdapat di mana-mana. Mesin layan diri di stesen minyak dan tempat letak kereta bertanya soalan ringkas dan mengesahkan jawapan sebelum mengenakan bayaran. Alat baris arahan untuk pentadbir sistem membaca pilihan dan mencetak laporan berlajur. Sistem jualan mencetak resit dengan jajaran tepat. Borang web menerima semua medan sebagai teks dan mesti menukar serta membersihkannya di pelayan — sempadan jenis yang sama dalam persekitaran yang lebih besar.',
    'The input–convert–calculate–format pattern learned in this module is everywhere. Self-service machines at petrol stations and car parks ask short questions and confirm the answers before charging. Command-line tools for system administrators read options and print columned reports. Point-of-sale systems print receipts with exact alignment. Web forms receive every field as text and must convert and clean it on the server — the same type boundaries in a larger setting.',
  ],
  module_summary: [
    'Program interaktif membaca teks, menukarnya kepada nilai yang bermakna, mengira, dan menukar hasilnya kembali kepada teks berformat. Kualiti program bergantung pada dua titik penukaran itu dan pada susunan pernyataan yang betul. Prompt yang jelas, input yang dibersihkan, output yang dijajarkan dan dokumentasi yang menerangkan sebab menjadikan program mudah digunakan dan mudah diselenggara.',
    'An interactive program reads text, converts it into meaningful values, calculates, and converts the results back into formatted text. Its quality depends on those two conversion points and on a correct statement order. Clear prompts, cleaned input, aligned output and documentation that explains reasons make a program easy to use and easy to maintain.',
  ],
  references: [
    `- [Python tutorial — Input and Output](${PYDOCS}/tutorial/inputoutput.html)\n- [Format Specification Mini-Language](${PYDOCS}/library/string.html#format-specification-mini-language)\n- [Built-in functions — print() and input()](${PYDOCS}/library/functions.html)\n- [PEP 257 — Docstring Conventions](https://peps.python.org/pep-0257/)`,
    `- [Python tutorial — Input and Output](${PYDOCS}/tutorial/inputoutput.html)\n- [Format Specification Mini-Language](${PYDOCS}/library/string.html#format-specification-mini-language)\n- [Built-in functions — print() and input()](${PYDOCS}/library/functions.html)\n- [PEP 257 — Docstring Conventions](https://peps.python.org/pep-0257/)`,
  ],
};

// ─── Module 4 — Errors and Basic Debugging ────────────────────────────────

const M4_EX1 = example(`programs = {
    "average": "marks = [70, 80]\\nprint(sum(marks) / len(marks))",
    "unclosed": "print((1 + 2)",
    "empty list": "marks = []\\nprint(sum(marks) / len(marks))",
    "typo": "total = 5\\nprint(totl)",
}
for label, source in programs.items():
    try:
        code = compile(source, label, "exec")
    except SyntaxError as error:
        print(f"{label:<11} stage=compile  {type(error).__name__}")
        continue
    try:
        exec(code, {})
    except Exception as error:
        print(f"{label:<11} stage=run      {type(error).__name__}")`, `75.0
unclosed    stage=compile  SyntaxError
empty list  stage=run      ZeroDivisionError
typo        stage=run      NameError`);

const M4_EX2 = example(`def shipping_fee_buggy(weight_kg):
    return 5.00 + (weight_kg - 1) * 2.00


def shipping_fee_fixed(weight_kg):
    return 5.00 + max(weight_kg - 1, 0) * 2.00


checks = [(1, 5.00), (3, 9.00), (0.5, 5.00)]
for fee_function in (shipping_fee_buggy, shipping_fee_fixed):
    failures = [w for w, expected in checks if fee_function(w) != expected]
    print(f"{fee_function.__name__}: {len(checks) - len(failures)}/{len(checks)} passed, failing weights {failures}")`, `shipping_fee_buggy: 2/3 passed, failing weights [0.5]
shipping_fee_fixed: 3/3 passed, failing weights []`);

const M4: Texts = {
  module_overview: [
    'Modul ini mengubah sikap pelajar terhadap kesilapan: daripada sesuatu yang perlu ditakuti kepada **maklumat** yang perlu dibaca. Kuliah 4.1 mengajar ralat yang menghalang program bermula dan cara membaca traceback; kuliah 4.2 menyusun ralat yang berlaku semasa program berjalan mengikut jenis dan punca; kuliah 4.3 menyatukan semuanya dalam proses debugging yang sistematik dan alat yang menyokongnya. Bersama-sama, ketiga-tiganya memberi pelajar keupayaan paling penting untuk belajar secara berdikari: apabila sesuatu tidak berfungsi, mereka tahu apa yang perlu dilakukan seterusnya. Modul ini menutup kursus PY101 dan menjadi asas bagi ujian perisian dalam PY211.',
    'This module changes the learner’s attitude to mistakes: from something to fear into **information** to read. Lecture 4.1 teaches the errors that stop a program from starting and how to read a traceback; lecture 4.2 organises the errors that happen while a program runs by type and cause; lecture 4.3 brings everything together in a systematic debugging process and the tools that support it. Together, the three give learners the most important ability for independent learning: when something does not work, they know what to do next. The module closes course PY101 and lays the foundation for software testing in PY211.',
  ],
  learning_objectives: [
    '- Mengklasifikasikan sebarang kegagalan program mengikut peringkat ia berlaku: kompil, pelaksanaan, atau logik (tiada ralat tetapi hasil salah).\n- Mengekstrak jenis, mesej dan lokasi daripada laporan ralat dan menghubungkannya dengan punca yang mungkin.\n- Menggunakan proses debugging berperingkat — hasilkan semula, asingkan, hipotesis, uji, betulkan, sahkan.\n- Memilih alat yang sesuai: cetakan, jadual jejak, `assert`, `logging` atau debugger.\n- Menukar pepijat yang telah dibetulkan kepada semakan automatik supaya ia tidak berulang.',
    '- Classify any program failure by the stage at which it happens: compilation, execution, or logic (no error but a wrong result).\n- Extract the type, message and location from an error report and connect them to likely causes.\n- Apply a staged debugging process — reproduce, isolate, hypothesise, test, fix, verify.\n- Choose the right tool: prints, trace tables, `assert`, `logging` or a debugger.\n- Turn fixed bugs into automatic checks so they do not recur.',
  ],
  prerequisites: [
    'Modul 1–3: model kompil dan pelaksanaan CPython, menjalankan skrip dari terminal, serta program dengan input, output dan urutan pernyataan.',
    'Modules 1–3: CPython’s compile-and-execute model, running scripts from the terminal, and programs with input, output and a sequence of statements.',
  ],
  core_theory: [
    'Setiap kegagalan program boleh diletakkan pada salah satu daripada tiga peringkat, dan peringkat itu menentukan strategi. **Kegagalan kompil** (ralat sintaks dan inden) adalah yang paling mudah: ia berlaku sebelum sebarang kesan sampingan, lokasinya tepat, dan mesejnya semakin membantu dalam versi Python baharu. **Kegagalan pelaksanaan** (exception) bergantung pada data dan laluan: kod yang sama mungkin berjaya untuk satu input dan gagal untuk input lain, jadi soalan utama ialah "nilai apakah yang tiba di baris ini, dan dari mana ia datang?". **Kegagalan logik** adalah yang paling sukar kerana Python tidak melaporkan apa-apa: program berjalan hingga tamat dengan jawapan yang salah. Untuk peringkat ini, pengatur cara mesti menyediakan bukti sendiri — jangkaan yang ditulis lebih awal, cetakan keadaan, atau semakan `assert`.\n\nDebugging yang berkesan ialah pengurangan ketidakpastian secara berperingkat. Menghasilkan semula pepijat menukar laporan yang samar kepada eksperimen yang boleh diulang. Mengasingkan — dengan mengecilkan input atau membahagi kod kepada separuh — mengurangkan ruang carian secara eksponen. Hipotesis yang boleh dibuktikan salah menjadikan setiap ujian bermakna. Pembetulan yang kecil dan tunggal memastikan sebab dan akibat jelas. Akhirnya, menukar kes yang gagal menjadi semakan automatik mengubah pengetahuan sementara kepada perlindungan kekal; inilah idea asas ujian unit dan integrasi berterusan dalam kejuruteraan perisian moden.',
    'Every program failure can be placed at one of three stages, and the stage decides the strategy. **Compile-time failures** (syntax and indentation errors) are the easiest: they happen before any side effect, their location is precise, and their messages become more helpful with each new Python version. **Execution failures** (exceptions) depend on data and paths: the same code may succeed for one input and fail for another, so the key question is "what value arrived at this line, and where did it come from?". **Logic failures** are the hardest because Python reports nothing: the program runs to the end with a wrong answer. At this stage, the programmer must supply their own evidence — expectations written in advance, state prints, or `assert` checks.\n\nEffective debugging is the step-by-step reduction of uncertainty. Reproducing a bug turns a vague report into a repeatable experiment. Isolating — by shrinking the input or splitting the code in half — reduces the search space exponentially. A hypothesis that could be proven wrong makes every test meaningful. A small, single fix keeps cause and effect clear. Finally, turning the failing case into an automatic check converts temporary knowledge into permanent protection; this is the core idea behind unit testing and continuous integration in modern software engineering.',
  ],
  learning_notes: [
    'Simpan **jurnal pepijat** sepanjang kursus: untuk setiap pepijat yang menghabiskan lebih daripada lima minit, catat simptom, peringkat (kompil, pelaksanaan atau logik), hipotesis yang diuji, punca sebenar dan pembetulan. Selepas beberapa minggu, corak akan muncul — kebanyakan pelajar mendapati beberapa kesilapan yang sama berulang, dan mengenalinya mempercepatkan debugging dengan ketara. Latih membaca traceback dengan sengaja menghasilkan ralat dalam program kecil dan meramalkan mesejnya sebelum menjalankan. Elakkan godaan untuk menyalin mesej ralat terus ke enjin carian tanpa membacanya dahulu; selalunya jawapannya sudah ada dalam baris terakhir. Jika anda meminta bantuan, sertakan kod minimum, input, output sebenar, output yang dijangka dan traceback penuh. Laporan yang lengkap sering membolehkan anda menemui jawapan sendiri semasa menulisnya.',
    'Keep a **bug journal** throughout the course: for every bug that takes more than five minutes, record the symptom, the stage (compile, execution or logic), the hypotheses tested, the real cause and the fix. After a few weeks patterns emerge — most learners find that a handful of mistakes recur, and recognising them speeds up debugging considerably. Practise reading tracebacks by deliberately producing errors in small programs and predicting the message before running. Resist the temptation to paste an error message straight into a search engine without reading it first; the answer is often already on the last line. When you ask for help, include the minimal code, the input, the actual output, the expected output and the full traceback. A complete report often lets you find the answer yourself while writing it.',
  ],
  key_concepts: [
    '- **Tiga peringkat kegagalan:** kompil, pelaksanaan, logik.\n- **Anatomi laporan ralat:** jenis, mesej, lokasi, dan rantaian panggilan.\n- **Punca berbanding simptom:** nilai yang salah sering datang lebih awal daripada baris yang gagal.\n- **Proses debugging berperingkat:** hasilkan semula → asingkan → hipotesis → uji → betulkan → sahkan.\n- **Semakan automatik** sebagai ingatan kekal bagi pepijat yang dibetulkan.',
    '- **Three failure stages:** compilation, execution, logic.\n- **Anatomy of an error report:** type, message, location, and the chain of calls.\n- **Cause versus symptom:** a wrong value often comes from earlier than the failing line.\n- **A staged debugging process:** reproduce → isolate → hypothesise → test → fix → verify.\n- **Automatic checks** as the permanent memory of fixed bugs.',
  ],
  terminology: [
    '- [[syntax-error|Ralat sintaks]]: pelanggaran tatabahasa yang dikesan semasa kompil.\n- [[runtime-error|Ralat runtime]]: kegagalan semasa pelaksanaan.\n- [[exception|Exception]]: objek yang mewakili ralat runtime dalam Python.\n- [[traceback|Traceback]]: laporan lokasi dan jenis ralat.\n- [[debugging|Debugging]]: proses sistematik mencari dan membetulkan pepijat.\n- [[call-stack|Tindanan panggilan]]: rantaian fungsi aktif yang ditunjukkan oleh traceback.',
    '- [[syntax-error|Syntax error]]: a grammar violation detected while compiling.\n- [[runtime-error|Runtime error]]: a failure during execution.\n- [[exception|Exception]]: the object representing a runtime error in Python.\n- [[traceback|Traceback]]: the report of an error’s location and type.\n- [[debugging|Debugging]]: the systematic process of finding and fixing bugs.\n- [[call-stack|Call stack]]: the chain of active functions that a traceback shows.',
  ],
  examples: [
    `Contoh pertama ialah alat triage yang meletakkan setiap program kecil pada peringkat kegagalannya: ia mengkompil dahulu, dan hanya menjalankan kod yang berjaya dikompil. Program yang betul mencetak hasilnya sendiri (75.0); yang lain dilaporkan dengan peringkat dan jenis exception.\n\n${M4_EX1}\n\nContoh kedua menunjukkan peringkat logik dan cara semakan automatik menangkapnya. Fungsi yuran penghantaran asal tidak pernah menimbulkan exception, tetapi memberi yuran yang terlalu rendah untuk bungkusan di bawah 1 kg. Semakan dengan jawapan yang dijangka — termasuk kes sempadan — mendedahkan pepijat itu dan mengesahkan pembetulannya.\n\n${M4_EX2}`,
    `The first example is a triage tool that places each small program at its failure stage: it compiles first, and only runs code that compiled successfully. The correct program prints its own result (75.0); the others are reported with their stage and exception type.\n\n${M4_EX1}\n\nThe second example shows the logic stage and how automatic checks catch it. The original shipping-fee function never raises an exception, but charges too little for parcels under 1 kg. Checks with expected answers — including a boundary case — expose the bug and confirm the fix.\n\n${M4_EX2}`,
  ],
  applications: [
    'Kemahiran modul ini digunakan dalam setiap peranan teknikal. Jurutera perisian menyiasat laporan pepijat dan menulis ujian regresi. Jurutera kebolehpercayaan tapak (SRE) membaca traceback dan log pengeluaran untuk memulihkan perkhidmatan dengan cepat. Saintis data mengesan nilai yang salah dalam saluran data hingga ke sumbernya. Pasukan keselamatan menganalisis exception luar biasa sebagai tanda serangan. Dalam semua kes, proses yang sama — perhati, hipotesis, uji, sahkan — mengatasi tekaan.',
    'This module’s skills are used in every technical role. Software engineers investigate bug reports and write regression tests. Site reliability engineers (SREs) read production tracebacks and logs to restore services quickly. Data scientists trace wrong values in a data pipeline back to their source. Security teams analyse unusual exceptions as signs of attack. In every case, the same process — observe, hypothesise, test, verify — beats guessing.',
  ],
  module_summary: [
    'Kegagalan program berlaku pada peringkat kompil, pelaksanaan atau logik, dan setiap peringkat memerlukan strategi yang berbeza. Laporan ralat Python memberi jenis, mesej dan lokasi; punca sebenar sering lebih awal daripada simptom. Debugging yang sistematik mengurangkan ketidakpastian langkah demi langkah, dan semakan automatik memastikan pepijat yang dibetulkan tidak kembali.',
    'Program failures happen at the compilation, execution or logic stage, and each stage needs a different strategy. Python’s error reports give the type, message and location; the real cause is often earlier than the symptom. Systematic debugging reduces uncertainty step by step, and automatic checks make sure fixed bugs never return.',
  ],
  references: [
    `- [Python tutorial — Errors and Exceptions](${PYDOCS}/tutorial/errors.html)\n- [Built-in Exceptions](${PYDOCS}/library/exceptions.html)\n- [pdb — The Python Debugger](${PYDOCS}/library/pdb.html)\n- [Logging HOWTO](${PYDOCS}/howto/logging.html)`,
    `- [Python tutorial — Errors and Exceptions](${PYDOCS}/tutorial/errors.html)\n- [Built-in Exceptions](${PYDOCS}/library/exceptions.html)\n- [pdb — The Python Debugger](${PYDOCS}/library/pdb.html)\n- [Logging HOWTO](${PYDOCS}/howto/logging.html)`,
  ],
};

export const PY101_MODULES: ModuleContentDef[] = [build('PY101', 1, M1), build('PY101', 2, M2), build('PY101', 3, M3), build('PY101', 4, M4)];
