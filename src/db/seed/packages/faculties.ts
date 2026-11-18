import { L, type AcademyDef, type FacultyDef } from '../types';

/**
 * The 7 faculties of the master specification (Part 3) — exactly 7, no more.
 * English names are verbatim from the specification; tests enforce this.
 */
export const FACULTIES: FacultyDef[] = [
  {
    code: 'F01',
    order: 1,
    name: L('Pengaturcaraan & Kejuruteraan Perisian', 'Programming & Software Engineering'),
    description: L(
      'Asas sains komputer, bahasa pengaturcaraan dan kejuruteraan perisian profesional.',
      'Computer science foundations, programming languages and professional software engineering.',
    ),
  },
  {
    code: 'F02',
    order: 2,
    name: L('Kecerdasan Buatan', 'Artificial Intelligence'),
    description: L(
      'Machine learning, deep learning, LLM, agen AI dan kejuruteraan aplikasi AI.',
      'Machine learning, deep learning, LLMs, AI agents and AI application engineering.',
    ),
  },
  {
    code: 'F03',
    order: 3,
    name: L('Pembangunan Permainan', 'Game Development'),
    description: L(
      'Roblox, Unity, Unreal Engine, reka bentuk permainan dan sistem permainan berbilang pemain.',
      'Roblox, Unity, Unreal Engine, game design and multiplayer game systems.',
    ),
  },
  {
    code: 'F04',
    order: 4,
    name: L('Matematik & Sains Komputer', 'Mathematics & Computer Science'),
    description: L(
      'Matematik untuk pengkomputeran: algebra, kalkulus, kebarangkalian, statistik dan kaedah berangka.',
      'Mathematics for computing: algebra, calculus, probability, statistics and numerical methods.',
    ),
  },
  {
    code: 'F05',
    order: 5,
    name: L('Sains & Kejuruteraan Data', 'Data Science & Engineering'),
    description: L(
      'Analitik data, kejuruteraan data, SQL, data besar, visualisasi dan pengkomputeran awan.',
      'Data analytics, data engineering, SQL, big data, visualisation and cloud computing.',
    ),
  },
  {
    code: 'F06',
    order: 6,
    name: L('Reka Bentuk 3D & Produksi Digital', '3D Design & Digital Production'),
    description: L(
      'Blender, pemodelan dan arca 3D, tekstur, pencahayaan, animasi dan aset permainan.',
      'Blender, 3D modelling and sculpting, texturing, lighting, animation and game assets.',
    ),
  },
  {
    code: 'F07',
    order: 7,
    name: L('Teknologi & Produksi Muzik', 'Music Technology & Production'),
    description: L(
      'Teori muzik, piano, komposisi, FL Studio, rekaan bunyi dan kejuruteraan audio.',
      'Music theory, piano, composition, FL Studio, sound design and audio engineering.',
    ),
  },
];

/** Faculty 01's 15 academies (specification Part 3), in specification order. */
export const FACULTY_01_ACADEMIES: AcademyDef[] = [
  ['F01-CS', 'Akademi Sains Komputer', 'Computer Science Academy',
    'Asas teori pengkomputeran: seni bina komputer, sistem pengendalian, rangkaian dan teori pengiraan.',
    'Theoretical foundations of computing: computer architecture, operating systems, networks and the theory of computation.'],
  ['F01-PY', 'Akademi Pengaturcaraan Python', 'Python Programming Academy',
    'Python dari asas hingga kejuruteraan perisian, sains data dan kejuruteraan AI.',
    'Python from the fundamentals to software engineering, data science and AI engineering.'],
  ['F01-LUA', 'Akademi Pengaturcaraan Lua', 'Lua Programming Academy',
    'Bahasa Lua standard: sintaks, table, metatable, modul dan pengaturcaraan lanjutan. Tidak termasuk API Roblox.',
    'The standard Lua language: syntax, tables, metatables, modules and advanced programming. Excludes Roblox APIs.'],
  ['F01-LUAU', 'Akademi Pengaturcaraan Luau', 'Luau Programming Academy',
    'Luau, bahasa skrip Roblox: daripada sintaks dan semakan jenis hingga seni bina client–server, DataStore dan sistem berbilang pemain. Perbezaan dengan Lua standard dinyatakan dengan jelas.',
    'Luau, the Roblox scripting language: from syntax and type checking to client–server architecture, DataStores and multiplayer systems. Differences from standard Lua are stated explicitly.'],
  ['F01-JS', 'Akademi JavaScript', 'JavaScript Academy',
    'JavaScript moden (ES2015+) untuk pelayar dan Node.js.',
    'Modern JavaScript (ES2015+) for the browser and Node.js.'],
  ['F01-TS', 'Akademi TypeScript', 'TypeScript Academy',
    'Sistem jenis statik TypeScript untuk aplikasi JavaScript berskala besar.',
    "TypeScript's static type system for large-scale JavaScript applications."],
  ['F01-C', 'Akademi Pengaturcaraan C', 'C Programming Academy',
    'Pengaturcaraan sistem dengan C: pointer, pengurusan memori dan antara muka perkakasan.',
    'Systems programming in C: pointers, memory management and hardware interfaces.'],
  ['F01-CPP', 'Akademi Pengaturcaraan C++', 'C++ Programming Academy',
    'C++ moden: OOP, template, STL dan pengaturcaraan berprestasi tinggi.',
    'Modern C++: OOP, templates, the STL and high-performance programming.'],
  ['F01-JAVA', 'Akademi Pengaturcaraan Java', 'Java Programming Academy',
    'Java dan JVM: OOP, koleksi, concurrency dan aplikasi perusahaan.',
    'Java and the JVM: OOP, collections, concurrency and enterprise applications.'],
  ['F01-WEB', 'Akademi Pembangunan Web', 'Web Development Academy',
    'HTML, CSS, JavaScript bahagian hadapan, kebolehcapaian dan reka bentuk responsif.',
    'HTML, CSS, front-end JavaScript, accessibility and responsive design.'],
  ['F01-FS', 'Akademi Pembangunan Full-Stack', 'Full-Stack Development Academy',
    'Membina aplikasi web lengkap: frontend, backend, pangkalan data dan deployment.',
    'Building complete web applications: frontend, backend, databases and deployment.'],
  ['F01-SE', 'Akademi Kejuruteraan Perisian', 'Software Engineering Academy',
    'Kitaran hayat perisian, keperluan, seni bina, kawalan versi, pengujian dan amalan pasukan.',
    'The software lifecycle, requirements, architecture, version control, testing and team practices.'],
  ['F01-DSA', 'Akademi Struktur Data & Algoritma', 'Data Structures & Algorithms Academy',
    'Struktur data dan algoritma klasik, analisis kerumitan dan teknik penyelesaian masalah.',
    'Classic data structures and algorithms, complexity analysis and problem-solving techniques.'],
  ['F01-API', 'Akademi Pembangunan API', 'API Development Academy',
    'Reka bentuk, pembinaan, keselamatan dan dokumentasi API REST, GraphQL dan gRPC.',
    'Designing, building, securing and documenting REST, GraphQL and gRPC APIs.'],
  ['F01-DB', 'Akademi Pengaturcaraan Pangkalan Data', 'Database Programming Academy',
    'SQL, reka bentuk skema, prosedur tersimpan, indeks dan akses pangkalan data daripada aplikasi.',
    'SQL, schema design, stored procedures, indexing and database access from applications.'],
].map(([code, ms, en, dms, den], i) => ({ facultyCode: 'F01', code: code!, order: i + 1, name: L(ms!, en!), description: L(dms!, den!) }));
