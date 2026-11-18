import type { GlossaryTermDef } from '@/db/content/types';

/**
 * Click-to-Learn terms introduced by LUA102 (Variables, Data Types and Operators in Lua).
 * Every example is standard Lua 5.4 and is executed by `npm run verify:code`.
 */
const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const lua102 = (module: number, lecture: number) => ({ courseCode: 'LUA102', module, lecture });

export const LUA102_GLOSSARY: GlossaryTermDef[] = [
  {
    key: 'multiple-assignment',
    term: 'Multiple Assignment',
    translation: 'Assignment berbilang',
    scope: 'general',
    definition: {
      ms: 'Pernyataan yang memberi nilai kepada beberapa pemboleh ubah sekaligus: `a, b = 1, 2`.',
      en: 'A statement that assigns values to several variables at once: `a, b = 1, 2`.',
    },
    explanation: {
      ms: 'Lua menilai semua ungkapan di sebelah kanan dahulu, kemudian barulah membuat assignment — sebab itu `a, b = b, a` menukar dua nilai. Nilai yang kurang menjadi `nil`; nilai yang lebih dibuang.',
      en: 'Lua evaluates every expression on the right-hand side first, and only then performs the assignments — which is why `a, b = b, a` swaps two values. Missing values become `nil`; extra values are discarded.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local a, b = 1, 2\na, b = b, a\nprint(a, b)', expectedOutput: '2\t1' },
    related: ['variable'],
    lectures: [lua102(1, 2), lua102(1, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.3 — Assignment', url: `${MANUAL}#3.3.3` }],
  },
  {
    key: 'reserved-word',
    term: 'Reserved Word (Keyword)',
    translation: 'Nama terpelihara (kata kunci)',
    scope: 'general',
    definition: {
      ms: 'Perkataan yang mempunyai makna khas dalam bahasa dan tidak boleh digunakan sebagai nama pemboleh ubah, contohnya `local`, `end`, `nil`.',
      en: 'A word with a special meaning in the language that cannot be used as a variable name, for example `local`, `end`, `nil`.',
    },
    explanation: {
      ms: 'Lua 5.4 mempunyai 22 kata kunci. Ia boleh menjadi **kunci string** dalam table (`t["end"]`) tetapi tidak boleh digunakan selepas titik (`t.end`). Nama fungsi pustaka seperti `print` dan `type` **bukan** kata kunci — ia global biasa yang boleh ditimpa secara tidak sengaja.',
      en: 'Lua 5.4 has 22 keywords. They can be **string keys** in a table (`t["end"]`) but cannot be used after a dot (`t.end`). Library function names such as `print` and `type` are **not** keywords — they are ordinary globals that can be overwritten by accident.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'print(load("local end = 1") == nil, load("local print = 1") == nil)', expectedOutput: 'true\tfalse' },
    related: ['variable'],
    lectures: [lua102(1, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.1 — Lexical Conventions', url: `${MANUAL}#3.1` }],
  },
  {
    key: 'nil',
    term: 'nil',
    translation: 'nil (tiada nilai)',
    scope: 'general',
    definition: {
      ms: 'Satu-satunya nilai jenis `nil`, bermaksud "tiada nilai yang berguna". Pemboleh ubah dan medan yang tidak diberi nilai bernilai `nil`.',
      en: 'The only value of type `nil`, meaning "no useful value". Variables and fields that have not been assigned hold `nil`.',
    },
    explanation: {
      ms: 'Memberi `nil` kepada medan table akan **membuang** medan itu. `nil` adalah palsu dalam syarat. Kebanyakan ralat pemula ("attempt to index a nil value") berlaku apabila `nil` digunakan seolah-olah ia nombor, string atau table.',
      en: 'Assigning `nil` to a table field **removes** that field. `nil` is false in conditions. Most beginner errors ("attempt to index a nil value") happen when `nil` is used as if it were a number, string or table.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local player = {name = "Mei", guild = "Red"}\nplayer.guild = nil\nprint(player.name, player.guild, player.level)', expectedOutput: 'Mei\tnil\tnil' },
    related: ['truthiness', 'variable'],
    lectures: [lua102(2, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual §2.1 — Values and Types', url: `${MANUAL}#2.1` }],
  },
  {
    key: 'truthiness',
    term: 'Truthiness',
    translation: 'Kebenaran nilai (truthiness)',
    scope: 'general',
    definition: {
      ms: 'Peraturan yang menentukan sama ada sesuatu nilai dianggap benar dalam syarat. Dalam Lua, hanya `nil` dan `false` dianggap palsu.',
      en: 'The rule that decides whether a value counts as true in a condition. In Lua, only `nil` and `false` count as false.',
    },
    explanation: {
      ms: 'Tidak seperti C, JavaScript atau Python, nombor `0` dan string kosong `""` adalah **benar** dalam Lua. Ini ringkas dan konsisten, tetapi mengejutkan pengaturcara yang datang dari bahasa lain.',
      en: 'Unlike C, JavaScript or Python, the number `0` and the empty string `""` are **true** in Lua. This is simple and consistent, but surprises programmers coming from other languages.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'for _, v in ipairs({0, "", false}) do\n  print(v, v and "truthy" or "falsy")\nend', expectedOutput: '0\ttruthy\n\ttruthy\nfalse\tfalsy' },
    related: ['nil', 'short-circuit'],
    lectures: [lua102(2, 1), lua102(3, 2)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures', url: `${MANUAL}#3.3.4` }],
  },
  {
    key: 'number-subtype',
    term: 'Integer and Float Subtypes',
    translation: 'Subjenis integer dan float',
    scope: 'lua',
    definition: {
      ms: 'Sejak Lua 5.3, jenis `number` mempunyai dua subjenis: integer 64-bit dan float 64-bit (dwi ketepatan).',
      en: 'Since Lua 5.3, the `number` type has two subtypes: 64-bit integers and 64-bit (double precision) floats.',
    },
    explanation: {
      ms: '`math.type(x)` memberitahu subjenisnya. `/` dan `^` sentiasa memberi float; `//` dan `%` memberi integer jika kedua-dua operan integer. Float tidak dapat mewakili semua pecahan perpuluhan dengan tepat, jadi `0.1 + 0.2 == 0.3` adalah palsu.',
      en: '`math.type(x)` tells the subtype. `/` and `^` always give floats; `//` and `%` give integers when both operands are integers. Floats cannot represent every decimal fraction exactly, so `0.1 + 0.2 == 0.3` is false.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'print(math.type(7 // 2), math.type(7 / 2), 0.1 + 0.2 == 0.3)', expectedOutput: 'integer\tfloat\tfalse' },
    related: ['operator', 'coercion'],
    lectures: [lua102(2, 2), lua102(3, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual §2.1 — Values and Types (number subtypes)', url: `${MANUAL}#2.1` }],
  },
  {
    key: 'userdata',
    term: 'Userdata',
    translation: 'Userdata',
    scope: 'lua',
    definition: {
      ms: 'Jenis Lua untuk data milik program C (hos), contohnya pemegang fail. Kod Lua tidak boleh melihat isinya secara terus.',
      en: 'The Lua type for data owned by C (the host), for example file handles. Lua code cannot look inside it directly.',
    },
    explanation: {
      ms: 'Userdata membolehkan hos membawa objek C ke dalam Lua dengan selamat. Operasi padanya ditakrifkan oleh metatable yang diberikan hos — contohnya fail daripada pustaka `io` mempunyai method `:read` dan `:close`.',
      en: 'Userdata lets a host bring C objects into Lua safely. Operations on it are defined by the metatable the host provides — for example files from the `io` library have `:read` and `:close` methods.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'print(type(io.stdout), io.type(io.stdout))', expectedOutput: 'userdata\tfile' },
    related: ['embedding', 'metatable'],
    lectures: [lua102(2, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual §2.1 — Values and Types (userdata)', url: `${MANUAL}#2.1` }],
  },
  {
    key: 'operator',
    term: 'Operator',
    translation: 'Operator',
    scope: 'general',
    definition: {
      ms: 'Simbol atau kata kunci yang menggabungkan nilai untuk menghasilkan nilai baharu, contohnya `+`, `..`, `==`, `and`.',
      en: 'A symbol or keyword that combines values to produce a new value, for example `+`, `..`, `==`, `and`.',
    },
    explanation: {
      ms: 'Lua mempunyai operator aritmetik (`+ - * / // % ^`), bit (`& | ~ << >>`), hubungan (`== ~= < > <= >=`), logik (`and or not`), penggabungan (`..`) dan panjang (`#`). Setiap operator mempunyai [[operator-precedence|keutamaan]] yang menentukan susunan penilaian.',
      en: 'Lua has arithmetic (`+ - * / // % ^`), bitwise (`& | ~ << >>`), relational (`== ~= < > <= >=`), logical (`and or not`), concatenation (`..`) and length (`#`) operators. Each operator has a [[operator-precedence|precedence]] that decides the order of evaluation.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'print(7 // 2, 7 % 2, 2 ^ 3, "a" .. "b", #"lua", 3 ~= 4)', expectedOutput: '3\t1\t8.0\tab\t3\ttrue' },
    related: ['operator-precedence', 'number-subtype'],
    lectures: [lua102(3, 1), lua102(3, 2), lua102(3, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.4 — Expressions', url: `${MANUAL}#3.4` }],
  },
  {
    key: 'operator-precedence',
    term: 'Operator Precedence',
    translation: 'Keutamaan operator',
    scope: 'general',
    definition: {
      ms: 'Peraturan yang menentukan operator mana dinilai dahulu apabila beberapa operator muncul dalam satu ungkapan tanpa kurungan.',
      en: 'The rule that decides which operator is evaluated first when several operators appear in one expression without parentheses.',
    },
    explanation: {
      ms: 'Dalam Lua, dari rendah ke tinggi: `or`; `and`; perbandingan; `|`; `~`; `&`; anjakan; `..` (bersekutu kanan); `+ -`; `* / // %`; operator unari (`not # - ~`); `^` (bersekutu kanan). Apabila ragu, gunakan kurungan — ia tiada kos dan menjadikan niat jelas.',
      en: 'In Lua, from lowest to highest: `or`; `and`; comparisons; `|`; `~`; `&`; shifts; `..` (right-associative); `+ -`; `* / // %`; unary operators (`not # - ~`); `^` (right-associative). When in doubt, use parentheses — they cost nothing and make intent clear.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'print(2 + 3 * 4, (2 + 3) * 4, -2 ^ 2, 2 ^ 3 ^ 2)', expectedOutput: '14\t20\t-4.0\t512.0' },
    related: ['operator'],
    lectures: [lua102(3, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.4.8 — Precedence', url: `${MANUAL}#3.4.8` }],
  },
  {
    key: 'short-circuit',
    term: 'Short-circuit Evaluation',
    translation: 'Penilaian litar pintas',
    scope: 'general',
    definition: {
      ms: 'Operator `and` dan `or` hanya menilai operan kedua jika perlu, dan memulangkan salah satu operan — bukan semestinya `true` atau `false`.',
      en: 'The `and` and `or` operators only evaluate their second operand when needed, and return one of the operands — not necessarily `true` or `false`.',
    },
    explanation: {
      ms: '`a and b` memulangkan `a` jika `a` palsu, jika tidak `b`. `a or b` memulangkan `a` jika `a` benar, jika tidak `b`. Ini membolehkan nilai lalai (`name or "guest"`) dan semakan selamat (`t and t.x`).',
      en: '`a and b` returns `a` if `a` is falsy, otherwise `b`. `a or b` returns `a` if `a` is truthy, otherwise `b`. This enables defaults (`name or "guest"`) and safe checks (`t and t.x`).',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local cfg = nil\nprint(cfg and cfg.size, nil or "guest", 0 and "zero is true")', expectedOutput: 'nil\tguest\tzero is true' },
    related: ['truthiness', 'operator'],
    lectures: [lua102(3, 2)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.4.5 — Logical Operators', url: `${MANUAL}#3.4.5` }],
  },
  {
    key: 'coercion',
    term: 'Coercion',
    translation: 'Penukaran automatik (coercion)',
    scope: 'general',
    definition: {
      ms: 'Penukaran jenis yang dilakukan oleh bahasa secara automatik, contohnya string `"10"` ditukar kepada nombor dalam `"10" + 5`.',
      en: 'A type conversion the language performs automatically, for example the string `"10"` converted to a number in `"10" + 5`.',
    },
    explanation: {
      ms: 'Lua menukar string kepada nombor untuk **aritmetik**, dan nombor kepada string untuk **penggabungan** `..`. Perbandingan (`==`, `<`) **tidak** melakukan coercion: `"10" == 10` palsu. Penukaran eksplisit dengan `tonumber` dan `tostring` lebih jelas dan selamat.',
      en: 'Lua converts strings to numbers for **arithmetic**, and numbers to strings for **concatenation** `..`. Comparisons (`==`, `<`) do **not** coerce: `"10" == 10` is false. Explicit conversion with `tonumber` and `tostring` is clearer and safer.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'print("10" + 5, 10 .. 5, "10" == 10, tonumber("10") == 10)', expectedOutput: '15\t105\tfalse\ttrue' },
    related: ['number-subtype', 'operator'],
    lectures: [lua102(4, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.4.3 — Coercions and Conversions', url: `${MANUAL}#3.4.3` }],
  },
];
