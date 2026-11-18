import type { GlossaryTermDef } from '@/db/content/types';

/**
 * Click-to-Learn terms introduced by LUAU102 (Luau Syntax: Variables, Types and Operators).
 * Every example is plain Luau and is executed with the official Luau VM by `npm run verify:code`.
 */
const LUAU = 'https://luau.org';
const luau102 = (module: number, lecture: number) => ({ courseCode: 'LUAU102', module, lecture });

export const LUAU102_GLOSSARY: GlossaryTermDef[] = [
  {
    key: 'compound-assignment',
    term: 'Compound Assignment',
    translation: 'Assignment majmuk',
    scope: 'luau',
    definition: {
      ms: 'Operator Luau yang menggabungkan operasi dan assignment: `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `^=` dan `..=`.',
      en: 'Luau operators that combine an operation with an assignment: `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `^=` and `..=`.',
    },
    explanation: {
      ms: '`x += 1` bermaksud `x = x + 1`, tetapi sasaran (contohnya `t[f()]`) dinilai sekali sahaja. Ia ialah **pernyataan**, bukan ungkapan: `print(x += 1)` tidak sah, dan tiada `x++`.',
      en: '`x += 1` means `x = x + 1`, but the target (for example `t[f()]`) is evaluated only once. It is a **statement**, not an expression: `print(x += 1)` is invalid, and there is no `x++`.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local score = 10\nscore += 5\nscore *= 2\nlocal label = "Score"\nlabel ..= ": "\nprint(label .. score)', expectedOutput: 'Score: 30' },
    related: ['operator', 'variable'],
    lectures: [luau102(3, 3)],
    references: [{ title: 'Luau — Syntax: compound assignments', url: `${LUAU}/syntax#compound-assignments` }],
  },
  {
    key: 'string-interpolation',
    term: 'String Interpolation',
    translation: 'Interpolasi string',
    scope: 'luau',
    definition: {
      ms: 'String yang ditulis dengan backtick, di mana ungkapan dalam `{ }` dinilai dan ditukar kepada teks: `` `Hai {name}` ``.',
      en: 'A string written with backticks in which expressions inside `{ }` are evaluated and converted to text: `` `Hi {name}` ``.',
    },
    explanation: {
      ms: 'Setiap ungkapan ditukar dengan `tostring`, jadi `nil` dan boolean selamat. Kurungan kerinting literal ditulis `\\{`; kurungan berganda `{{` tidak dibenarkan. Untuk kawalan format (tempat perpuluhan), gunakan `string.format`.',
      en: 'Each expression is converted with `tostring`, so `nil` and booleans are safe. A literal brace is written `\\{`; double braces `{{` are not allowed. For format control (decimal places), use `string.format`.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local name, coins = "Aina", 1250\nprint(`{name} has {coins} coins ({coins // 100} bags)`)', expectedOutput: 'Aina has 1250 coins (12 bags)' },
    related: ['escape-sequence', 'compound-assignment'],
    lectures: [luau102(4, 1)],
    references: [{ title: 'Luau — Syntax: string interpolation', url: `${LUAU}/syntax#string-interpolation` }],
  },
  {
    key: 'if-expression',
    term: 'If-Expression',
    translation: 'If-expression (ungkapan if)',
    scope: 'luau',
    definition: {
      ms: 'Ungkapan Luau `if syarat then a elseif syarat2 then b else c` yang menghasilkan satu nilai; cabang `else` wajib.',
      en: 'A Luau expression `if condition then a elseif condition2 then b else c` that produces one value; the `else` branch is required.',
    },
    explanation: {
      ms: 'Berbeza daripada idiom `a and b or c`, if-expression sentiasa betul walaupun `b` ialah `false` atau `nil`. Hanya cabang yang dipilih dinilai.',
      en: 'Unlike the `a and b or c` idiom, an if-expression is always correct even when `b` is `false` or `nil`. Only the chosen branch is evaluated.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local health = 15\nlocal state = if health <= 0 then "dead" elseif health < 25 then "critical" else "ok"\nprint(state)', expectedOutput: 'critical' },
    related: ['short-circuit', 'conditional'],
    lectures: [luau102(4, 2)],
    references: [{ title: 'Luau — Syntax: if-then-else expressions', url: `${LUAU}/syntax#if-then-else-expressions` }],
  },
  {
    key: 'typeof-function',
    term: 'typeof()',
    translation: 'typeof() — jenis terperinci',
    scope: 'luau',
    definition: {
      ms: 'Fungsi Luau yang memulangkan nama jenis nilai. Untuk jenis asas ia sama dengan `type()`; dalam Roblox ia juga mengenali jenis enjin seperti "Vector3" dan "Instance".',
      en: 'A Luau function returning a value’s type name. For basic types it matches `type()`; in Roblox it also recognises engine types such as "Vector3" and "Instance".',
    },
    explanation: {
      ms: 'Dalam Roblox, `type(Vector3.new())` ialah "userdata" tetapi `typeof(Vector3.new())` ialah "Vector3" — itulah sebabnya kod Roblox menggunakan `typeof`. Di luar Roblox, kedua-duanya biasanya memberi hasil yang sama.',
      en: 'In Roblox, `type(Vector3.new())` is "userdata" but `typeof(Vector3.new())` is "Vector3" — which is why Roblox code uses `typeof`. Outside Roblox, both usually give the same result.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'for _, v in {42, "hi", true, {}, print} do\n  print(typeof(v))\nend', expectedOutput: 'number\nstring\nboolean\ntable\nfunction' },
    related: ['nil', 'userdata'],
    lectures: [luau102(2, 2)],
    references: [{ title: 'Luau — Library: typeof', url: `${LUAU}/library#global-functions` }],
  },
  {
    key: 'vector-type',
    term: 'vector (Luau type)',
    translation: 'vector (jenis Luau)',
    scope: 'luau',
    definition: {
      ms: 'Jenis nilai terbina dalam Luau yang memegang tiga nombor (x, y, z), dicipta dengan `vector.create`, dengan aritmetik dan pustaka `vector`.',
      en: 'A built-in Luau value type holding three numbers (x, y, z), created with `vector.create`, with arithmetic and the `vector` library.',
    },
    explanation: {
      ms: '`vector` ialah jenis **nilai** (tiada peruntukan heap), jadi ia pantas untuk matematik geometri. Ia berbeza daripada jenis enjin Roblox `Vector3`, walaupun konsepnya serupa.',
      en: '`vector` is a **value** type (no heap allocation), so it is fast for geometry maths. It is different from the Roblox engine type `Vector3`, although the concept is similar.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local a = vector.create(3, 4, 0)\nprint(vector.magnitude(a), a.x + a.y, a * 2)', expectedOutput: '5\t7\t6, 8, 0' },
    related: ['number-subtype', 'buffer-type'],
    lectures: [luau102(2, 3)],
    references: [{ title: 'Luau — Library: vector', url: `${LUAU}/library#vector-library` }],
  },
  {
    key: 'buffer-type',
    term: 'buffer (Luau type)',
    translation: 'buffer (jenis Luau)',
    scope: 'luau',
    definition: {
      ms: 'Blok bait mentah bersaiz tetap yang dicipta dengan `buffer.create(n)` dan dibaca/ditulis dengan fungsi seperti `buffer.readu8` dan `buffer.writei32`.',
      en: 'A fixed-size block of raw bytes created with `buffer.create(n)` and read/written with functions such as `buffer.readu8` and `buffer.writei32`.',
    },
    explanation: {
      ms: 'Buffer berguna untuk data binari padat (rangkaian, simpanan, pemprosesan imej). Offset bermula pada **0** (tidak seperti table), dan akses di luar saiz menimbulkan ralat `buffer access out of bounds`.',
      en: 'Buffers are useful for compact binary data (networking, storage, image processing). Offsets start at **0** (unlike tables), and access beyond the size raises `buffer access out of bounds`.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local b = buffer.create(4)\nbuffer.writeu16(b, 0, 500)\nbuffer.writeu8(b, 2, 7)\nprint(buffer.readu16(b, 0), buffer.readu8(b, 2), buffer.len(b))', expectedOutput: '500\t7\t4' },
    related: ['vector-type', 'table'],
    lectures: [luau102(2, 3)],
    references: [{ title: 'Luau — Library: buffer', url: `${LUAU}/library#buffer-library` }],
  },
  {
    key: 'naming-convention',
    term: 'Naming Convention',
    translation: 'Konvensyen penamaan',
    scope: 'general',
    definition: {
      ms: 'Peraturan yang dipersetujui untuk menamakan pemboleh ubah, fungsi dan modul supaya kod mudah dibaca, contohnya `camelCase`, `PascalCase` dan `UPPER_CASE`.',
      en: 'Agreed rules for naming variables, functions and modules so code is easy to read, for example `camelCase`, `PascalCase` and `UPPER_CASE`.',
    },
    explanation: {
      ms: 'Panduan gaya Roblox: `camelCase` untuk local dan fungsi, `PascalCase` untuk perkhidmatan, kelas dan modul, `UPPER_CASE` untuk pemalar. Luau tidak menguatkuasakannya — ia persetujuan pasukan.',
      en: 'The Roblox style guide: `camelCase` for locals and functions, `PascalCase` for services, classes and modules, `UPPER_CASE` for constants. Luau does not enforce it — it is a team agreement.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local MAX_HEALTH = 100\nlocal currentHealth = 80\nlocal function healPercent(amount)\n  return math.min(currentHealth + amount, MAX_HEALTH) / MAX_HEALTH * 100\nend\nprint(healPercent(30))', expectedOutput: '100' },
    related: ['variable', 'reserved-word'],
    lectures: [luau102(1, 3)],
    references: [{ title: 'Roblox Lua Style Guide — Naming', url: 'https://roblox.github.io/lua-style-guide/#naming' }],
  },
];
