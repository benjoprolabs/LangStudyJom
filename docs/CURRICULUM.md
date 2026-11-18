# Curriculum

The university curriculum is delivered as versioned **curriculum packages** (`src/db/seed/`). A package
is plain data that references records by **code**, never by database ID. It is validated before any
write and installed through the same validated repository functions as manual edits.

> The tables below are **generated from the package data**, so they cannot drift from what is installed.

## Seeding Milestone 1 (package `qhaze-university-core` v1.0.0)

The approved scope:

- The **7 faculties** of the master specification. There are exactly 7; the names are verbatim and a test enforces them.
- The **15 academies of Faculty 01**. No academies or curricula for Faculties 02–07 yet.
- The **Python Programming programme**: 8 semesters, with courses, modules and the lecture structure.

Lecture **content** (the 28-section lecture template) is not part of a structure package. A lecture here
has a title, an order and an estimated duration. Content is delivered separately in **content packages**
(see *Course materials* below).

## Seeding Milestone 2 (package `qhaze-f01-lua-luau` v1.0.0)

Two **separate** pathways in Faculty 01:

- **Lua Programming Programme** (`LUA-PROG`, academy F01-LUA): standard Lua, with Lua 5.4 as the
  reference version. Version-specific features are labelled (for example "(5.3+)"). It contains **no Roblox APIs**,
  which a test enforces on every title, module and lecture.
- **Luau & Roblox Development Programme** (`LUAU-PROG`, academy F01-LUAU). Semester 1 teaches the Luau
  *language* only. Roblox-specific material begins at LUAU113 (ModuleScripts), and the engine API (Instance,
  Players, RemoteEvent, DataStoreService …) follows in Semester 3. **Every course that uses a Roblox API is
  marked** "[Roblox API — requires Roblox Studio.]" in its description, and a test enforces this.

The package carries Faculty 01 and both academy definitions so it is self-contained. When Milestone 1 is
already installed, they are **reused** (dry run: 957 new records, 3 reused), so nothing is duplicated and no
Python record is touched. Course codes keep the pathways apart: `LUA…` versus `LUAU…`.

**Projects (Part E)**, built progressively inside courses rather than as separate courses:

| Lua (8) | Course | Luau / Roblox (10) | Course |
|---|---|---|---|
| 1 Calculator | LUA102 M4 | 1 Obby, 2 Coin collection | LUAU204 |
| 2 Number guessing game | LUA103 M4 | 3 Player data, 7 Save/load | LUAU303 |
| 3 Student record system | LUA114 | 4 Inventory, 5 Shop | LUAU304 |
| 4 Inventory management | LUA204 | 6 Quests, 8 Combat | LUAU313 |
| 5 Console POS | LUA214 | 9 Multiplayer | LUAU402 |
| 6 File-based database, 7 Modular application | LUA313 | 10 Open-world RPG (capstone) | LUAU490 |
| 8 Complete management software (capstone) | LUA390 | | |

## Curriculum design rules (enforced by `validatePackage` and tests)

| Rule | How it is enforced |
|---|---|
| Bilingual | Every name, title, description, objective, outcome, module and lecture has Bahasa Melayu **and** English text. Malay and English may only be identical when the title is a preserved English technical term on an explicit list |
| Depth (no shallow courses) | Each course has a description, at least 3 objectives (Python, Lua and Luau: 4), at least 3 expected outcomes, at least 1 reference and at least 3 modules (Python: 4). Each module has at least 2 lectures (Python: 3) |
| Logical progression | Difficulty never decreases from one semester to the next. The Python programme runs from Absolute Beginner to Professional |
| Prerequisites | A prerequisite must exist in the programme and must come *earlier* in the study order (an earlier semester, or earlier within the same semester; courses in a semester are studied in order). There are no cycles. `recommended` links advise the order without blocking it |
| No duplication | Course codes and titles are unique. Topics with their own academy (DSA, Databases, Machine Learning, AI) are taught as *applied in Python* and point to that academy |
| Specification fidelity | Python semesters 1–3 contain every topic listed in the master specification, Part 4 |

## Installation safety and recovery

1. **Validate** the package: `validatePackage` checks structure and quality without touching the database.
2. **Dry run**: `planInstall` shows what will be created, what already exists and will be reused, and
   any **conflict** (for example, course code `PY101` already used by another programme). Errors or
   conflicts block the install, and nothing is written.
3. **Recovery point**: a "Before curriculum install" (`pre-seed`) snapshot is created.
4. **One transaction**: every record goes through the validated repositories inside a single
   `guardedWrite`. Any failure rolls back **the whole install**, which a test forces with a storage
   error at the 200th lecture.
5. **Idempotent**: existing records, matched by code or order, are reused and never overwritten.
   Installing again creates nothing.

To undo an install, restore the "Before curriculum install" recovery point on **Backup & Restore**. This
returns the whole database to its state just before the install. Student records created *after* the
install would also be rolled back, so export a backup first if you have new work. After a restore the
package can be installed again.

How to install: go to **My Faculties**, choose **Curriculum packages**, then **Install package** and confirm.

## Faculties (7)

| Code | Bahasa Melayu | English | Academies in this package |
|---|---|---|---|
| F01 | Pengaturcaraan & Kejuruteraan Perisian | Programming & Software Engineering | 15 |
| F02 | Kecerdasan Buatan | Artificial Intelligence | 0 |
| F03 | Pembangunan Permainan | Game Development | 0 |
| F04 | Matematik & Sains Komputer | Mathematics & Computer Science | 0 |
| F05 | Sains & Kejuruteraan Data | Data Science & Engineering | 0 |
| F06 | Reka Bentuk 3D & Produksi Digital | 3D Design & Digital Production | 0 |
| F07 | Teknologi & Produksi Muzik | Music Technology & Production | 0 |

## Faculty 01 academies (15)

| # | Code | Bahasa Melayu | English |
|---|---|---|---|
| 1 | F01-CS | Akademi Sains Komputer | Computer Science Academy |
| 2 | F01-PY | Akademi Pengaturcaraan Python | Python Programming Academy |
| 3 | F01-LUA | Akademi Pengaturcaraan Lua | Lua Programming Academy |
| 4 | F01-LUAU | Akademi Pengaturcaraan Luau | Luau Programming Academy |
| 5 | F01-JS | Akademi JavaScript | JavaScript Academy |
| 6 | F01-TS | Akademi TypeScript | TypeScript Academy |
| 7 | F01-C | Akademi Pengaturcaraan C | C Programming Academy |
| 8 | F01-CPP | Akademi Pengaturcaraan C++ | C++ Programming Academy |
| 9 | F01-JAVA | Akademi Pengaturcaraan Java | Java Programming Academy |
| 10 | F01-WEB | Akademi Pembangunan Web | Web Development Academy |
| 11 | F01-FS | Akademi Pembangunan Full-Stack | Full-Stack Development Academy |
| 12 | F01-SE | Akademi Kejuruteraan Perisian | Software Engineering Academy |
| 13 | F01-DSA | Akademi Struktur Data & Algoritma | Data Structures & Algorithms Academy |
| 14 | F01-API | Akademi Pembangunan API | API Development Academy |
| 15 | F01-DB | Akademi Pengaturcaraan Pangkalan Data | Database Programming Academy |

## Python programme: PY-PROG

<!-- generated:PY-PROG -->
**Python Programming Programme: Foundations to Professional** (Program Pengaturcaraan Python: Asas hingga Profesional), Absolute Beginner to Professional: 8 semesters, 31 courses, 124 modules, 372 lectures, 107 credit hours, 44 prerequisite links.

### Semester 1: Python Programming Foundations (Asas Pengaturcaraan Python), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| PY101 | Introduction to Programming and Python<br>*Pengenalan Pengaturcaraan dan Python* | 3 | Absolute Beginner | None | Computers, Programs and Programming Languages; The Python Development Environment; First Programs: Output and Input; Errors and Basic Debugging |
| PY102 | Variables, Data Types and Operators<br>*Pemboleh Ubah, Jenis Data dan Operator* | 3 | Absolute Beginner | PY101 | Variables and Assignment; Core Data Types; Operators and Expressions; Type Conversion and Practical Calculations |
| PY103 | Control Flow: Conditions and Loops<br>*Aliran Kawalan: Syarat dan Gelung* | 4 | Beginner | PY102 | Making Decisions with if; Algorithmic Thinking; while Loops; for Loops and range() |
| PY104 | Functions and Program Structure<br>*Fungsi dan Struktur Program* | 3 | Beginner | PY103 | Function Basics; Scope and the Call Stack; Flexible Arguments; Organising Programs |

### Semester 2: Built-in Data Structures and Files (Struktur Data Terbina dan Fail), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| PY111 | Sequence Collections: Lists and Tuples<br>*Koleksi Berjujukan: List dan Tuple* | 3 | Beginner | PY104 | List Fundamentals; Modifying Lists; Tuples and Unpacking; List Comprehensions and Nested Collections |
| PY112 | Dictionaries and Sets<br>*Dictionary dan Set* | 3 | Beginner | PY111 | Dictionary Fundamentals; Nested Dictionaries and Data Modelling; Sets; The collections Module |
| PY113 | String and Text Processing<br>*Pemprosesan String dan Teks* | 3 | Beginner | PY111 | Strings as Sequences; Text Formatting; Unicode and Encoding; Regular Expressions |
| PY114 | File Handling and Exception Handling<br>*Pengendalian Fail dan Exception* | 4 | Beginner | PY112, PY113 | Text Files; Paths and the File System; Structured Data Formats; Exception Handling |

### Semester 3: Object-Oriented Programming and Advanced Functions (OOP dan Fungsi Lanjutan), 14 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| PY201 | Object-Oriented Programming I: Classes and Objects<br>*Pengaturcaraan Berorientasikan Objek I: Kelas dan Objek* | 4 | Intermediate | PY114 | Classes and Objects; Attributes and Encapsulation; Kinds of Methods; Object-Oriented Design |
| PY202 | Object-Oriented Programming II: Inheritance, Polymorphism and Composition<br>*Pengaturcaraan Berorientasikan Objek II: Pewarisan, Polimorfisme dan Komposisi* | 3 | Intermediate | PY201 | Inheritance; Polymorphism; Special (Dunder) Methods; Composition, dataclasses and enums |
| PY203 | Modules, Packages and Python Environments<br>*Modul, Pakej dan Persekitaran Python* | 3 | Intermediate | PY114 | Modules and the Import System; Packages; Virtual Environments and Dependencies; The Python Standard Library |
| PY204 | Advanced Functions, Iterators, Generators and Decorators<br>*Fungsi Lanjutan, Iterator, Generator dan Decorator* | 4 | Intermediate | PY201 | Functions as First-Class Objects; Closures; Iterators and Generators; Decorators |

### Semester 4: Software Engineering Practice (Amalan Kejuruteraan Perisian), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| PY211 | Software Testing and Debugging<br>*Pengujian dan Debugging Perisian* | 3 | Upper Intermediate | PY202, PY203 | Testing Fundamentals; pytest Techniques; Test-Driven Development; Debugging and Logging |
| PY212 | Applied Algorithms in Python<br>*Algoritma Gunaan dalam Python* | 4 | Upper Intermediate | PY204 | Algorithm Analysis; Searching and Sorting; Recursion and Divide-and-Conquer; Applied Data Structures |
| PY213 | Type Hints and Code Quality<br>*Type Hint dan Kualiti Kod* | 3 | Upper Intermediate | PY202 | Type Hint Fundamentals; Advanced Types; Static Checking and Style; Refactoring |
| PY214 | Command-Line Applications and Automation<br>*Aplikasi Command-Line dan Automasi* | 3 | Upper Intermediate | PY203 | Command-Line Application Basics; File System Automation; Processes and the Environment; Packaging Tools |

### Semester 5: Advanced Python (Python Lanjutan), 14 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| PY301 | Advanced Object-Oriented Design and Design Patterns<br>*Reka Bentuk Berorientasikan Objek Lanjutan dan Design Pattern* | 4 | Advanced | PY202, PY213 | Abstraction and Contracts; The SOLID Principles; Design Patterns the Pythonic Way; Python Object Mechanics |
| PY302 | Concurrent and Asynchronous Programming<br>*Pengaturcaraan Serentak dan Asynchronous* | 4 | Advanced | PY204, PY211 | Concurrency Concepts; Threads and Processes; asyncio; Concurrency in Practice |
| PY303 | Python and Databases<br>*Python dan Pangkalan Data* | 3 | Advanced | PY202 | SQL Basics for Programmers; sqlite3 in Python; Schema Design; ORM with SQLAlchemy |
| PY304 | Python Performance and Profiling<br>*Prestasi dan Profiling Python* | 3 | Advanced | PY212 | Measuring Performance; Memory; Optimisation Techniques; Beyond Pure CPython |

### Semester 6: Web, APIs and Software Architecture (Web, API dan Seni Bina Perisian), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| PY311 | Web Development with Python<br>*Pembangunan Web dengan Python* | 3 | Advanced | PY303 | Web Fundamentals; Flask; Forms, Sessions and Data; Web Security Basics |
| PY312 | Building REST APIs with FastAPI<br>*Membina REST API dengan FastAPI* | 4 | Advanced | PY311, PY302 | API Design; FastAPI Fundamentals; Data and Security; Testing and Operating APIs |
| PY313 | Software Architecture and Clean Code in Python<br>*Seni Bina Perisian dan Kod Bersih dalam Python* | 3 | Advanced | PY301, PY211 | Clean Code Principles; Architectural Patterns; Domain and Persistence; Architecture in a Team |
| PY314 | Packaging, CI/CD and Deployment<br>*Pembungkusan, CI/CD dan Deployment* | 3 | Advanced | PY214, PY211 | Packaging; Continuous Integration; Containers; Deployment |

### Semester 7: Data Science and Machine Learning (Sains Data dan Machine Learning), 14 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| PY401 | Scientific Python: NumPy and pandas<br>*Python Saintifik: NumPy dan pandas* | 4 | Professional | PY212, PY303 | NumPy; pandas Fundamentals; Data Cleaning and Transformation; Analysis and Combination |
| PY402 | Data Visualisation and Exploratory Data Analysis<br>*Visualisasi Data dan Analisis Data Penerokaan* | 3 | Professional | PY401 | Matplotlib; Statistical Visualisation; Descriptive Statistics; The EDA Workflow |
| PY403 | Machine Learning with scikit-learn<br>*Machine Learning dengan scikit-learn* | 4 | Professional | PY402 | Machine Learning Fundamentals; Supervised Learning; Feature Processing and Pipelines; Evaluation and Unsupervised Learning |
| PY404 | Data Acquisition: APIs, Web Scraping and Data Pipelines<br>*Pengumpulan Data: API, Web Scraping dan Saluran Data* | 3 | Professional | PY302, PY401 | Working with APIs; Web Scraping; Data Ethics and Law; Simple Data Pipelines |

### Semester 8: AI Engineering and Capstone (Kejuruteraan AI dan Projek Akhir), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| PY411 | AI Engineering with Python<br>*Kejuruteraan AI dengan Python* | 4 | Professional | PY403, PY312 | LLM Application Fundamentals; Embeddings and Vector Search; RAG and Agents; Evaluation and Production |
| PY412 | Professional Python Practice: Security, Observability and Maintenance<br>*Amalan Python Profesional: Keselamatan, Observability dan Penyelenggaraan* | 3 | Professional | PY313, PY314 | Secure Coding; Supply-Chain Security; Observability; Long-Term Maintenance |
| PY490 | Capstone Project<br>*Projek Akhir (Capstone)* | 6 | Professional | PY313, PY314, PY403, PY411 (recommended) | Proposal and Requirements; Design; Implementation; Delivery |
<!-- /generated:PY-PROG -->

## Lua programme: LUA-PROG

<!-- generated:LUA-PROG -->
**Lua Programming Programme: Foundations to Professional** (Program Pengaturcaraan Lua: Asas hingga Profesional), Absolute Beginner to Professional: 6 semesters, 24 courses, 96 modules, 288 lectures, 82 credit hours, 37 prerequisite links.

### Semester 1: Lua Language Foundations (Asas Bahasa Lua), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUA101 | Introduction to Lua and Its Execution Model<br>*Pengenalan Lua dan Model Pelaksanaannya* | 3 | Absolute Beginner | None | What Is Lua?; The Lua Environment; Lua's Execution Model; First Programs and Errors |
| LUA102 | Variables, Data Types and Operators in Lua<br>*Pemboleh Ubah, Jenis Data dan Operator dalam Lua* | 3 | Absolute Beginner | LUA101 | Variables and Basic Scope; Lua Data Types; Operators; Type Conversion and Project 1: Calculator |
| LUA103 | Control Flow in Lua: Conditions and Loops<br>*Aliran Kawalan dalam Lua: Syarat dan Gelung* | 4 | Beginner | LUA102 | Conditional Statements; Loops; Controlling Flow; Project 2: Number Guessing Game |
| LUA104 | Functions and Scope<br>*Fungsi dan Skop* | 3 | Beginner | LUA103 | Function Basics; Multiple Return Values; Variadic Functions; Scope and Recursion |

### Semester 2: Tables, Iterators and Strings (Table, Iterator dan String), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUA111 | Tables: Lua's Single Data Structure<br>*Table: Struktur Data Tunggal Lua* | 4 | Beginner | LUA104 | Table Fundamentals; Arrays and Sequences; Dictionaries; The table Library |
| LUA112 | Iterators and the Generic for<br>*Iterator dan Gelung for Generik* | 3 | Beginner | LUA111 | pairs and ipairs; The Iterator Protocol; Writing Iterators; Iterators in Practice |
| LUA113 | Strings and Lua Patterns<br>*String dan Corak Lua* | 3 | Beginner | LUA111 | String Fundamentals; Formatting Text; Lua Patterns; Unicode and Text Processing |
| LUA114 | Project Studio: Student Record System<br>*Studio Projek: Sistem Rekod Pelajar* | 3 | Beginner | LUA112, LUA113 | Requirements and Design; CRUD Operations; Validation and Reports; Testing and Evaluation |

### Semester 3: Closures, Errors and Files (Closure, Ralat dan Fail), 12 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUA201 | Closures and First-Class Functions<br>*Closure dan Fungsi Kelas Pertama* | 3 | Intermediate | LUA112 | Closures and Upvalues; Higher-Order Functions; Encapsulated State; Memoization and Performance |
| LUA202 | Error Handling and Debugging<br>*Pengendalian Ralat dan Debugging* | 3 | Intermediate | LUA114 | Raising Errors; Catching Errors; Debugging; Error Strategy in Applications |
| LUA203 | File Operations and I/O<br>*Operasi Fail dan I/O* | 3 | Intermediate | LUA113, LUA202 | File Basics; File Errors and Safety; The os Library; Serialisation |
| LUA204 | Project Studio: Inventory Management System<br>*Studio Projek: Sistem Pengurusan Inventori* | 3 | Intermediate | LUA114, LUA203 | Requirements and Architecture; The Data Layer; Logic and Interface; Quality |

### Semester 4: Metatables, Modules and OOP (Metatable, Modul dan OOP), 14 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUA211 | Metatables and Metamethods<br>*Metatable dan Metamethod* | 4 | Upper Intermediate | LUA201 | Metatable Basics; Access Control; Operator Metamethods; Advanced Patterns |
| LUA212 | Modules and Project Structure<br>*Modul dan Struktur Projek* | 3 | Upper Intermediate | LUA201 | require and Modules; Module Design; Project Structure; The Ecosystem |
| LUA213 | Object-Oriented Programming Patterns in Lua<br>*Corak Pengaturcaraan Berorientasikan Objek dalam Lua* | 4 | Upper Intermediate | LUA211, LUA212 (recommended) | Classes and Objects; Inheritance; Composition and Mixins; Privacy and Design |
| LUA214 | Project Studio: Console POS System<br>*Studio Projek: Sistem POS Konsol* | 3 | Upper Intermediate | LUA204, LUA212, LUA213 | Requirements and Architecture; Entities and Logic; Interface and Storage; Quality |

### Semester 5: Advanced Lua (Lua Lanjutan), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUA301 | Coroutines and Cooperative Concurrency<br>*Coroutine dan Konkurensi Koperatif* | 4 | Advanced | LUA201 | Coroutine Basics; Exchanging Values; Concurrency Patterns; Coroutines in the Real World |
| LUA302 | Memory Management and Garbage Collection<br>*Pengurusan Memori dan Garbage Collection* | 3 | Advanced | LUA211 | Lua's Memory Model; The Garbage Collector; Weak Tables and Finalizers; Leaks and Memory Optimisation |
| LUA303 | Lua Performance and Optimisation<br>*Prestasi dan Pengoptimuman Lua* | 3 | Advanced | LUA211, LUA302 | Measuring Performance; Lua Optimisation Techniques; Algorithms and Cost; Beyond the Standard Interpreter |
| LUA304 | Testing and Code Quality in Lua<br>*Pengujian dan Kualiti Kod Lua* | 3 | Advanced | LUA202, LUA212 | Testing Fundamentals; Testing Techniques; Code Quality; Refactoring |

### Semester 6: Architecture and Professional Projects (Seni Bina dan Projek Profesional), 17 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUA311 | Software Architecture in Lua<br>*Seni Bina Perisian dalam Lua* | 4 | Professional | LUA213, LUA304 | Decomposition and Modelling; Architecture; Design Patterns; Maintainability |
| LUA312 | Embedded Lua, _ENV and the C API<br>*Lua Terbenam, _ENV dan C API* | 3 | Professional | LUA202, LUA211 | Environments; Sandboxing and Security; The C API; Host and Script Patterns |
| LUA313 | Project Studio: File-Based Database and Modular Application<br>*Studio Projek: Pangkalan Data Berasaskan Fail dan Aplikasi Modular* | 4 | Professional | LUA303, LUA304, LUA311 | Project 6: Database Design; Project 6: Implementation; Project 7: Modular Application; Quality and Evaluation |
| LUA390 | Capstone: Complete Management Software<br>*Projek Akhir: Perisian Pengurusan Lengkap* | 6 | Professional | LUA214, LUA313, LUA312 (recommended) | Proposal and Requirements; Design; Implementation; Delivery |
<!-- /generated:LUA-PROG -->

## Luau programme: LUAU-PROG

<!-- generated:LUAU-PROG -->
**Luau Programming and Roblox Development Programme** (Program Pengaturcaraan Luau dan Pembangunan Roblox), Absolute Beginner to Professional: 7 semesters, 27 courses, 108 modules, 324 lectures, 93 credit hours, 38 prerequisite links.

### Semester 1: Luau Language Foundations (Asas Bahasa Luau), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUAU101 | Introduction to Luau and the Development Environment<br>*Pengenalan Luau dan Persekitaran Pembangunan* | 3 | Absolute Beginner | None | What Is Luau?; The Development Environment; First Programs; Errors |
| LUAU102 | Luau Syntax: Variables, Types and Operators<br>*Sintaks Luau: Pemboleh Ubah, Jenis dan Operator* | 3 | Absolute Beginner | LUAU101 | Variables; Value Types; Operators; Strings and Expressions |
| LUAU103 | Control Flow and Functions in Luau<br>*Aliran Kawalan dan Fungsi dalam Luau* | 4 | Beginner | LUAU102 | Conditions; Loops; Functions; Closures |
| LUAU104 | Tables in Luau<br>*Table dalam Luau* | 3 | Beginner | LUAU103 | Arrays; Dictionaries; References and Copies; Modelling Data |

### Semester 2: Type System and Modular Code (Sistem Jenis dan Kod Modular), 12 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUAU111 | Type Annotations and Type Inference<br>*Type Annotation dan Type Inference* | 3 | Intermediate | LUAU104 | Type Annotation Basics; Table Types; Combining Types; Type Aliases |
| LUAU112 | Strict Mode and Type Checking<br>*Strict Mode dan Semakan Jenis* | 3 | Intermediate | LUAU111 | Checking Modes; Type Refinement; Generics; Strict Mode in Projects |
| LUAU113 | ModuleScripts and Modular Code<br>*ModuleScript dan Kod Modular* | 3 | Intermediate | LUAU104, LUAU111 (recommended) | ModuleScript Basics; Where Modules Live; Modular Design; Typed Modules |
| LUAU114 | Metatables, OOP and Design Patterns in Luau<br>*Metatable, OOP dan Design Pattern dalam Luau* | 3 | Intermediate | LUAU112 | Metatables in Luau; Typed Classes; Game Design Patterns; Good Practice |

### Semester 3: Roblox Engine Fundamentals (Asas Enjin Roblox), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUAU201 | Roblox Instances and the Data Model<br>*Instance dan Data Model Roblox* | 4 | Intermediate | LUAU113, LUAU114 | The Data Model; Working with Instances; Data on Instances; Tags and Groups of Objects |
| LUAU202 | Workspace, Services and Basic Physics<br>*Workspace, Service dan Fizik Asas* | 3 | Intermediate | LUAU201 | Services; Position and Orientation; Physics; Real-Time Logic |
| LUAU203 | Events, Connections and the task Library<br>*Event, Connection dan Pustaka task* | 3 | Intermediate | LUAU201 | Events; Connections; The task Library; Event-Driven Design |
| LUAU204 | Project Studio: Interactive Obby and Coin Collection<br>*Studio Projek: Obby Interaktif dan Sistem Kutip Syiling* | 3 | Intermediate | LUAU202, LUAU203 | Project 1: Obby Design; Project 1: Obby Mechanics; Project 2: Coin System; Evaluation |

### Semester 4: Players, Input, UI and Client–Server (Pemain, Input, UI dan Client–Server), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUAU211 | Players and the Player Lifecycle<br>*Players dan Kitaran Hayat Pemain* | 3 | Upper Intermediate | LUAU203 | The Players Service; Characters; Leaderstats; Player Architecture |
| LUAU212 | User Input and Camera<br>*Input Pengguna dan Kamera* | 3 | Upper Intermediate | LUAU211 | UserInputService; ContextActionService; Multiple Devices; The Camera |
| LUAU213 | UI Programming<br>*Pengaturcaraan UI* | 3 | Upper Intermediate | LUAU203, LUAU212 (recommended) | UI Basics; Responsive Layout; Animation; UI Architecture |
| LUAU214 | Client–Server Architecture and Replication<br>*Seni Bina Client–Server dan Replikasi* | 4 | Upper Intermediate | LUAU211 | The Client–Server Model; Replication; Designing the Split; Trust |

### Semester 5: Networking and Data (Rangkaian dan Data), 15 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUAU301 | RemoteEvents and RemoteFunctions<br>*RemoteEvent dan RemoteFunction* | 4 | Advanced | LUAU214 | RemoteEvents; RemoteFunctions; Validation; Protocol Design |
| LUAU302 | DataStores and Player Data Management<br>*DataStore dan Pengurusan Data Pemain* | 4 | Advanced | LUAU214, LUAU301 (recommended) | DataStore Basics; Reliability; The Data Lifecycle; Advanced Data |
| LUAU303 | Project Studio: Player Data and Save/Load System<br>*Studio Projek: Sistem Data Pemain dan Simpan/Muat* | 3 | Advanced | LUAU302 | Design; Project 3: Player Data; Project 7: Save and Load; Testing and Evaluation |
| LUAU304 | Project Studio: Inventory and Shop Systems<br>*Studio Projek: Sistem Inventori dan Kedai* | 4 | Advanced | LUAU301, LUAU303, LUAU213 (recommended) | Project 4: Inventory; Project 5: Shop; Robux Purchases; Quality |

### Semester 6: Security, Performance and Architecture (Keselamatan, Prestasi dan Seni Bina), 13 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUAU311 | Security and Exploit Prevention<br>*Keselamatan dan Pencegahan Eksploit* | 3 | Advanced | LUAU301 | Threat Modelling; Server-Side Validation; Economy and Data; Monitoring |
| LUAU312 | Roblox Performance Optimisation<br>*Pengoptimuman Prestasi Roblox* | 3 | Advanced | LUAU214 | Measuring; Scripts and Memory; Network and World; Mobile Devices |
| LUAU313 | Project Studio: Quest and Combat Systems<br>*Studio Projek: Sistem Quest dan Sistem Pertempuran* | 4 | Advanced | LUAU304, LUAU311 | Project 6: Quest Design; Project 8: Combat Fundamentals; Project 8: Secure Combat; Evaluation |
| LUAU314 | Game Architecture and Professional Workflow<br>*Seni Bina Permainan dan Aliran Kerja Profesional* | 3 | Advanced | LUAU114, LUAU303 | Architecture; State and Dependencies; Testing; Professional Workflow |

### Semester 7: Multiplayer Engineering and Capstone (Kejuruteraan Berbilang Pemain dan Projek Akhir), 14 credits

| Code | Course (EN / BM) | Cr | Level | Prerequisites | Modules |
|---|---|---|---|---|---|
| LUAU401 | Multiplayer Game Architecture<br>*Seni Bina Permainan Berbilang Pemain* | 4 | Professional | LUAU302, LUAU314 | Servers and Places; MemoryStoreService; MessagingService; Designing for Scale |
| LUAU402 | Project Studio: Multiplayer Game<br>*Studio Projek: Permainan Berbilang Pemain* | 4 | Professional | LUAU313, LUAU401 | Design; Core Systems; Integration; Quality and Launch |
| LUAU490 | Capstone: Complete Open-World RPG<br>*Projek Akhir: RPG Dunia Terbuka Lengkap* | 6 | Professional | LUAU312, LUAU402 | Pre-Production; World and Core Systems; Production Readiness; Launch |
<!-- /generated:LUAU-PROG -->

## Course materials (Professional Programming Education Standard)

Lecture content is shipped in **content packages** (`src/content`, format in `src/db/content`), separate
from the curriculum structure. A content package writes `sections` and `contentVersion` onto lectures that
already exist, plus the Click-to-Learn **glossary** (`glossaryTerms` table, schema v3). Structure records are
never changed. Installing goes through the same steps as a curriculum package: validate, dry run (lectures
that do not exist yet block the install), a "Before curriculum install" recovery point, then one guarded
transaction. It is idempotent by `contentVersion`.

### The 28-section lecture template (Part A)

Sections 1–4 (lecture information, course information, academic level, estimated duration) are **generated
from the curriculum metadata**, so they cannot disagree with it. Sections 5–28 are authored, in this order:

learning objectives · prerequisite knowledge · introduction · core concepts · detailed theory · technical
terminology · syntax and programming rules · code demonstration · complete code examples · line-by-line
explanation · execution flow · memory behaviour\* · common mistakes · debugging techniques · best practices ·
performance considerations · security considerations · software engineering perspective (poor vs improved) ·
real-world applications · mini project\* · summary · review questions · further reading · references.

\* *Optional*: it may be marked "not applicable" with a reason. Every other section is mandatory.

### Quality rules (enforced by `validateContentPackage` and tests; Part L)

| Rule | Enforcement |
|---|---|
| Complete and ordered | All 24 authored sections present, in template order; only the optional two may be marked not applicable |
| Bilingual | Every text block has Malay and English. Technical terms and code stay in English |
| Lua/Luau separation (Part C) | A Lua lecture may not link a Luau- or Roblox-scoped glossary term, may not use Luau-only syntax (`+=`, `continue`, type annotations …) and may not use a Roblox identifier (`game`, `workspace`, `Instance`, `Players` …). Luau code that uses a Roblox API must be marked runtime `roblox` |
| Runnable code | Every `lua54` or `luau` example has an expected output |
| Links resolve | Every `[[term]]` link resolves to a glossary term; every reference uses https |
| No answers in materials | Course materials contain no exercises, quiz questions or answers. Those live in the Practice Center (Phase 5), and exports cannot include them because they are not part of lecture content |

### Execution verification (`npm run verify:code`)

Every `lua54` example is **executed** with the reference Lua 5.4 interpreter (via `lupa`), and every pure
`luau` example with the Luau VM (built from source, `tools/luau-runner`). The output must equal the
documented expected output exactly. Results are written to `docs/CODE-VERIFICATION.md`.

- **Roblox examples are never executed** (they need Roblox Studio). The reader labels them "Roblox API · only
  runs in Roblox Studio (not executed here)". They are checked statically only: the runtime marker and API usage.
- **Luau is executed but not type-checked**: the runner does not run `luau-analyze`. Type annotations are
  parsed and run but not verified.

### Content status

Only the **pilot lectures** below have full 28-section content. Every other lecture is installed as
**structure only**, and the reader says so plainly. Writing the remaining lectures is ongoing content work,
released in later content packages.

<!-- generated:content-status -->
| Course | Lecture | Title (EN) | Sections | Code examples (executed / Roblox, not executed) |
|---|---|---|---|---|
| LUA102 | 1.1 | Global and local variables | 4 generated + 24 authored | 9 / 0 |
| LUAU203 | 1.1 | RBXScriptSignal and Connect | 4 generated + 24 authored | 1 / 4 |

| Programme | Lectures | With full content | Structure only |
|---|---|---|---|
| PY-PROG | 372 | 0 | 372 |
| LUA-PROG | 288 | 1 | 287 |
| LUAU-PROG | 324 | 1 | 323 |
<!-- /generated:content-status -->
