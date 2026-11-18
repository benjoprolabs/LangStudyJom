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

Lecture **content** (the 20-section lecture template) is not part of this package. A lecture here has a
title, an order and an estimated duration. Content is authored in Phase 3 (Learning Engine).

## Curriculum design rules (enforced by `validatePackage` and tests)

| Rule | How it is enforced |
|---|---|
| Bilingual | Every name, title, description, objective, outcome, module and lecture has Bahasa Melayu **and** English text. Malay and English may only be identical when the title is a preserved English technical term on an explicit list |
| Depth (no shallow courses) | Each course has a description, at least 3 objectives (Python: 4), at least 3 expected outcomes, at least 1 reference and at least 3 modules (Python: 4). Each module has at least 2 lectures (Python: 3) |
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
