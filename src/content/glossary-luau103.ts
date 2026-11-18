import type { GlossaryTermDef } from '@/db/content/types';

/**
 * Click-to-Learn terms introduced by LUAU103 (Control Flow and Functions in Luau).
 * Every example is plain Luau and is executed with the official Luau VM by `npm run verify:code`.
 */
const LUAU = 'https://luau.org';
const luau103 = (module: number, lecture: number) => ({ courseCode: 'LUAU103', module, lecture });

export const LUAU103_GLOSSARY: GlossaryTermDef[] = [
  {
    key: 'generalized-iteration',
    term: 'Generalized Iteration',
    translation: 'Iterasi umum',
    scope: 'luau',
    definition: {
      ms: 'Ciri Luau yang membolehkan `for k, v in t do` melelar table terus, tanpa `pairs` atau `ipairs`.',
      en: 'A Luau feature that lets `for k, v in t do` iterate a table directly, without `pairs` or `ipairs`.',
    },
    explanation: {
      ms: 'Bahagian senarai dilawati dahulu mengikut susunan indeks (melangkau `nil`), kemudian kunci lain dalam susunan yang tidak ditentukan. Objek dengan metamethod `__iter` boleh menentukan cara ia dilelar.',
      en: 'The list part is visited first in index order (skipping `nil`s), then the other keys in an unspecified order. Objects with an `__iter` metamethod can define how they are iterated.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local scores = {40, 75, 90}\nlocal total = 0\nfor _, s in scores do\n  total += s\nend\nprint(total)', expectedOutput: '205' },
    related: ['iterator', 'loop'],
    lectures: [luau103(2, 2)],
    references: [{ title: 'Luau — Syntax: generalized iteration', url: `${LUAU}/syntax#generalized-iteration` }],
  },
  {
    key: 'continue-statement',
    term: 'continue',
    translation: 'continue (teruskan ke pusingan seterusnya)',
    scope: 'luau',
    definition: {
      ms: 'Pernyataan Luau yang melangkau baki badan gelung dan terus ke pusingan seterusnya.',
      en: 'A Luau statement that skips the rest of the loop body and moves on to the next pass.',
    },
    explanation: {
      ms: 'Seperti `break`, `continue` mesti menjadi pernyataan terakhir dalam bloknya dan hanya sah di dalam gelung. Ia kata kunci kontekstual, jadi `continue` masih boleh menjadi nama pemboleh ubah dalam kod lama. Lua standard tidak mempunyainya.',
      en: 'Like `break`, `continue` must be the last statement in its block and is only valid inside a loop. It is a contextual keyword, so `continue` can still be a variable name in old code. Standard Lua does not have it.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'for i = 1, 6 do\n  if i % 3 == 0 then continue end\n  print(i)\nend', expectedOutput: '1\n2\n4\n5' },
    related: ['loop', 'control-flow'],
    lectures: [luau103(2, 3)],
    references: [{ title: 'Luau — Syntax: continue statement', url: `${LUAU}/syntax#continue-statement` }],
  },
  {
    key: 'guard-clause',
    term: 'Guard Clause',
    translation: 'Klausa pengawal',
    scope: 'general',
    definition: {
      ms: 'Semakan di permulaan fungsi yang keluar awal (`return`) apabila input tidak sah, supaya baki fungsi hanya mengendalikan kes biasa.',
      en: 'A check at the start of a function that leaves early (`return`) when the input is invalid, so the rest of the function only handles the normal case.',
    },
    explanation: {
      ms: 'Klausa pengawal menggantikan `if` bersarang yang dalam dengan senarai syarat rata. Setiap syarat menolak satu kes; kod utama kekal pada satu tahap inden.',
      en: 'Guard clauses replace deeply nested `if`s with a flat list of conditions. Each condition rejects one case; the main code stays at a single indentation level.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local function heal(hp: number, amount: number): number\n  if hp <= 0 then return hp end\n  if amount <= 0 then return hp end\n  return math.min(hp + amount, 100)\nend\nprint(heal(0, 50), heal(80, 50))', expectedOutput: '0\t100' },
    related: ['conditional', 'function'],
    lectures: [luau103(1, 3)],
    references: [{ title: 'Refactoring — Replace Nested Conditional with Guard Clauses', url: 'https://refactoring.com/catalog/replaceNestedConditionalWithGuardClauses.html' }],
  },
  {
    key: 'callback',
    term: 'Callback',
    translation: 'Panggilan balik (callback)',
    scope: 'general',
    definition: {
      ms: 'Fungsi yang dihantar sebagai argumen kepada fungsi lain, untuk dipanggil kemudian — contohnya pembanding `table.sort` atau pengendali event.',
      en: 'A function passed as an argument to another function, to be called later — for example a `table.sort` comparator or an event handler.',
    },
    explanation: {
      ms: 'Dalam Roblox, hampir setiap event menggunakan callback: `part.Touched:Connect(function(hit) … end)`. Konsepnya ialah bahasa Luau tulen — fungsi ialah nilai yang boleh dihantar.',
      en: 'In Roblox, almost every event uses a callback: `part.Touched:Connect(function(hit) … end)`. The concept is pure Luau — functions are values that can be passed around.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local function repeatTimes(n: number, action: (number) -> ())\n  for i = 1, n do action(i) end\nend\nrepeatTimes(3, function(i) print(`tick {i}`) end)', expectedOutput: 'tick 1\ntick 2\ntick 3' },
    related: ['first-class-function', 'higher-order-function'],
    lectures: [luau103(4, 2)],
    references: [{ title: 'Roblox Creator Hub — Functions (callbacks)', url: 'https://create.roblox.com/docs/luau/functions' }],
  },
  {
    key: 'function-type',
    term: 'Function Type Annotation',
    translation: 'Anotasi jenis fungsi',
    scope: 'luau',
    definition: {
      ms: 'Anotasi Luau yang menerangkan parameter dan pulangan fungsi, contohnya `(number, string) -> boolean` atau `(...number) -> number`.',
      en: 'A Luau annotation describing a function’s parameters and returns, for example `(number, string) -> boolean` or `(...number) -> number`.',
    },
    explanation: {
      ms: 'Anotasi membantu penganalisis menangkap panggilan yang salah sebelum runtime; VM mengabaikannya. Pulangan berbilang ditulis `-> (number, string)`; tiada pulangan ditulis `-> ()`.',
      en: 'Annotations help the analyser catch wrong calls before run time; the VM ignores them. Multiple returns are written `-> (number, string)`; no return is written `-> ()`.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local function split(full: string): (string, string)\n  local first, rest = full:match("^(%S+)%s*(.*)$")\n  return first or "", rest or ""\nend\nprint(split("Nur Aina"))', expectedOutput: 'Nur\tAina' },
    related: ['type-annotation', 'function'],
    lectures: [luau103(3, 1), luau103(3, 2)],
    references: [{ title: 'Luau — Type checking: function types', url: `${LUAU}/typecheck#function-types` }],
  },
];
