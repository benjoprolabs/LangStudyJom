import type { GlossaryTermDef } from '@/db/content/types';

/**
 * Click-to-Learn terms introduced by LUA104 (Functions and Scope).
 * Every example is standard Lua 5.4 and is executed by `npm run verify:code`.
 */
const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const lua104 = (module: number, lecture: number) => ({ courseCode: 'LUA104', module, lecture });

export const LUA104_GLOSSARY: GlossaryTermDef[] = [
  {
    key: 'parameter',
    term: 'Parameter and Argument',
    translation: 'Parameter dan argumen',
    scope: 'general',
    definition: {
      ms: '**Parameter** ialah nama local dalam definisi fungsi; **argumen** ialah nilai sebenar yang dihantar semasa panggilan.',
      en: 'A **parameter** is a local name in a function definition; an **argument** is the actual value passed in a call.',
    },
    explanation: {
      ms: 'Dalam Lua, bilangan argumen tidak perlu sama dengan bilangan parameter: parameter yang tidak menerima argumen menjadi `nil`, dan argumen tambahan dibuang. Parameter berkelakuan seperti pemboleh ubah `local` di dalam fungsi.',
      en: 'In Lua, the number of arguments need not match the number of parameters: parameters without an argument become `nil`, and extra arguments are discarded. Parameters behave like `local` variables inside the function.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local function greet(name, title)\n  return (title or "Encik") .. " " .. name\nend\nprint(greet("Amin"))\nprint(greet("Siti", "Dr."))', expectedOutput: 'Encik Amin\nDr. Siti' },
    related: ['function', 'scope'],
    lectures: [lua104(1, 1), lua104(1, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.4.11 — Function Definitions', url: `${MANUAL}#3.4.11` }],
  },
  {
    key: 'first-class-function',
    term: 'First-Class Function',
    translation: 'Fungsi kelas pertama',
    scope: 'general',
    definition: {
      ms: 'Fungsi yang dilayan seperti nilai lain: boleh disimpan dalam pemboleh ubah dan table, dihantar sebagai argumen, dan dipulangkan daripada fungsi lain.',
      en: 'A function treated like any other value: it can be stored in variables and tables, passed as an argument, and returned from another function.',
    },
    explanation: {
      ms: 'Dalam Lua, semua fungsi ialah nilai tanpa nama; `function f() end` hanyalah gula sintaks untuk `f = function() end`. Fungsi yang menerima atau memulangkan fungsi lain dipanggil fungsi peringkat tinggi (higher-order function).',
      en: 'In Lua, all functions are anonymous values; `function f() end` is just syntactic sugar for `f = function() end`. A function that takes or returns other functions is called a higher-order function.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local ops = {add = function(a, b) return a + b end}\nlocal chosen = ops.add\nprint(chosen(2, 5), type(chosen))', expectedOutput: '7\tfunction' },
    related: ['function', 'closure'],
    lectures: [lua104(1, 2)],
    references: [{ title: 'Programming in Lua (1st ed.) — 6 More about Functions', url: 'https://www.lua.org/pil/6.html' }],
  },
  {
    key: 'value-adjustment',
    term: 'Value Adjustment',
    translation: 'Pelarasan nilai',
    scope: 'lua',
    definition: {
      ms: 'Peraturan Lua yang melaraskan bilangan nilai daripada panggilan fungsi atau `...` kepada bilangan yang diperlukan oleh konteks.',
      en: 'Lua’s rule that adjusts the number of values produced by a function call or `...` to the number the context needs.',
    },
    explanation: {
      ms: 'Panggilan yang menjadi **item terakhir** dalam senarai (argumen, assignment, constructor table, `return`) mengembang kepada semua nilainya. Di tempat lain, atau apabila dibalut dengan kurungan `(f())`, ia dipotong kepada satu nilai — atau `nil` jika tiada nilai.',
      en: 'A call that is the **last item** in a list (arguments, an assignment, a table constructor, `return`) expands to all of its values. Anywhere else, or when wrapped in parentheses `(f())`, it is truncated to one value — or `nil` if there are none.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local function three() return 1, 2, 3 end\nprint(three(), "|", three())\nprint((three()))', expectedOutput: '1\t|\t1\t2\t3\n1' },
    related: ['function', 'multiple-assignment'],
    lectures: [lua104(2, 1), lua104(2, 2)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.4.12 — Lists of Expressions, Multiple Results, and Adjustment', url: `${MANUAL}#3.4.12` }],
  },
  {
    key: 'vararg',
    term: 'Vararg (Variadic Function)',
    translation: 'Vararg (fungsi variadic)',
    scope: 'lua',
    definition: {
      ms: 'Fungsi yang menerima bilangan argumen yang berubah-ubah melalui ungkapan `...` dalam senarai parameternya.',
      en: 'A function that accepts a variable number of arguments through the `...` expression in its parameter list.',
    },
    explanation: {
      ms: '`select("#", ...)` mengira semua argumen termasuk `nil`; `select(n, ...)` memulangkan argumen ke-n dan seterusnya; `table.pack(...)` menyimpannya dalam table dengan medan `n`. `...` hanya sah di dalam fungsi yang mengisytiharkannya (dan dalam chunk utama).',
      en: '`select("#", ...)` counts every argument including `nil`; `select(n, ...)` returns the n-th argument onwards; `table.pack(...)` stores them in a table with an `n` field. `...` is only valid inside a function that declares it (and in the main chunk).',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local function count(...)\n  return select("#", ...)\nend\nprint(count(), count("a", nil), count(nil, nil, nil))', expectedOutput: '0\t2\t3' },
    related: ['function', 'value-adjustment'],
    lectures: [lua104(3, 1), lua104(3, 2), lua104(3, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.4.11 — Function Definitions (vararg)', url: `${MANUAL}#3.4.11` }],
  },
  {
    key: 'block',
    term: 'Block',
    translation: 'Blok',
    scope: 'general',
    definition: {
      ms: 'Senarai pernyataan yang membentuk satu unit skop, contohnya badan fungsi, badan gelung, cabang `if`, atau `do … end`.',
      en: 'A list of statements that forms one unit of scope, for example a function body, a loop body, an `if` branch, or `do … end`.',
    },
    explanation: {
      ms: 'Pemboleh ubah `local` wujud dari pengisytiharannya hingga akhir blok yang mengandunginya. `do … end` mencipta blok tanpa sebarang tujuan lain — berguna untuk mengehadkan hayat local sementara.',
      en: 'A `local` variable exists from its declaration to the end of the block containing it. `do … end` creates a block with no other purpose — useful for limiting the lifetime of temporary locals.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local result\ndo\n  local tmp = 6 * 7\n  result = tmp\nend\nprint(result, tmp)', expectedOutput: '42\tnil' },
    related: ['scope', 'variable'],
    lectures: [lua104(4, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.1 — Blocks', url: `${MANUAL}#3.3.1` }],
  },
  {
    key: 'recursion',
    term: 'Recursion',
    translation: 'Rekursi',
    scope: 'general',
    definition: {
      ms: 'Teknik di mana fungsi memanggil dirinya sendiri untuk menyelesaikan versi masalah yang lebih kecil, sehingga mencapai **kes asas** yang diselesaikan terus.',
      en: 'A technique in which a function calls itself to solve a smaller version of the problem, until it reaches a **base case** that is solved directly.',
    },
    explanation: {
      ms: 'Setiap panggilan rekursif menggunakan bingkai baharu pada timbunan panggilan; tanpa kes asas, timbunan melimpah (`stack overflow`). Dalam Lua, fungsi rekursif mesti diisytiharkan dengan `local function f` supaya nama `f` kelihatan di dalam badannya. `return f(x)` ialah panggilan ekor yang tidak menambah bingkai.',
      en: 'Each recursive call uses a new frame on the call stack; without a base case the stack overflows (`stack overflow`). In Lua, a recursive function must be declared with `local function f` so the name `f` is visible inside its body. `return f(x)` is a tail call that adds no frame.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local function countdown(n)\n  if n == 0 then return "liftoff" end\n  return countdown(n - 1)\nend\nprint(countdown(3))', expectedOutput: 'liftoff' },
    related: ['function', 'call-stack'],
    lectures: [lua104(4, 2)],
    references: [{ title: 'Programming in Lua (1st ed.) — 6.3 Proper Tail Calls', url: 'https://www.lua.org/pil/6.3.html' }],
  },
  {
    key: 'upvalue',
    term: 'Upvalue',
    translation: 'Upvalue (pemboleh ubah luar)',
    scope: 'lua',
    definition: {
      ms: 'Pemboleh ubah local daripada fungsi yang mengelilingi, yang digunakan oleh fungsi dalaman. Fungsi dalaman bersama upvaluenya membentuk closure.',
      en: 'A local variable of an enclosing function that is used by an inner function. The inner function together with its upvalues forms a closure.',
    },
    explanation: {
      ms: 'Upvalue terus hidup selepas fungsi luar tamat, selagi closure masih wujud. Dua closure yang dicipta dalam panggilan yang sama berkongsi upvalue yang sama; panggilan berasingan mencipta upvalue berasingan.',
      en: 'An upvalue stays alive after the outer function returns, as long as the closure still exists. Two closures created in the same call share the same upvalue; separate calls create separate upvalues.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local function makeTicker()\n  local ticks = 0\n  return function() ticks = ticks + 1; return ticks end\nend\nlocal tick = makeTicker()\ntick(); tick()\nprint(tick())', expectedOutput: '3' },
    related: ['closure', 'scope'],
    lectures: [lua104(4, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.5 — Visibility Rules', url: `${MANUAL}#3.5` }],
  },
  {
    key: 'higher-order-function',
    term: 'Higher-Order Function',
    translation: 'Fungsi peringkat tinggi',
    scope: 'general',
    definition: {
      ms: 'Fungsi yang menerima fungsi lain sebagai argumen, atau memulangkan fungsi sebagai hasil.',
      en: 'A function that takes another function as an argument, or returns a function as its result.',
    },
    explanation: {
      ms: 'Contoh dalam pustaka standard ialah `table.sort(t, cmp)`, yang menerima fungsi perbandingan. Fungsi peringkat tinggi membolehkan tingkah laku diubah tanpa menyunting kod fungsi itu sendiri.',
      en: 'A standard-library example is `table.sort(t, cmp)`, which receives a comparison function. Higher-order functions let behaviour be changed without editing the function’s own code.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local function twice(fn, x)\n  return fn(fn(x))\nend\nprint(twice(function(n) return n + 10 end, 1))', expectedOutput: '21' },
    related: ['first-class-function', 'function'],
    lectures: [lua104(1, 2), lua104(3, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual — table.sort', url: `${MANUAL}#pdf-table.sort` }],
  },
];
