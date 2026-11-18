import type { GlossaryTermDef } from '@/db/content/types';

/**
 * Click-to-Learn terms introduced by LUA103 (Control Flow in Lua: Conditions and Loops).
 * Every example is standard Lua 5.4 and is executed by `npm run verify:code`.
 */
const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const lua103 = (module: number, lecture: number) => ({ courseCode: 'LUA103', module, lecture });

export const LUA103_GLOSSARY: GlossaryTermDef[] = [
  {
    key: 'control-flow',
    term: 'Control Flow',
    translation: 'Aliran kawalan',
    scope: 'general',
    definition: {
      ms: 'Susunan pernyataan dijalankan dalam program, dan binaan (syarat, gelung, lompatan) yang mengubah susunan itu.',
      en: 'The order in which a program’s statements run, and the constructs (conditions, loops, jumps) that change that order.',
    },
    explanation: {
      ms: 'Tanpa aliran kawalan, program hanya berjalan dari atas ke bawah sekali. Dalam Lua, aliran kawalan disediakan oleh `if`, `while`, `repeat`, `for`, `break`, `goto` dan `return`.',
      en: 'Without control flow, a program only runs from top to bottom once. In Lua, control flow is provided by `if`, `while`, `repeat`, `for`, `break`, `goto` and `return`.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'for i = 1, 3 do\n  if i ~= 2 then print("step " .. i) end\nend', expectedOutput: 'step 1\nstep 3' },
    related: ['conditional', 'loop'],
    lectures: [lua103(1, 1), lua103(3, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures', url: `${MANUAL}#3.3.4` }],
  },
  {
    key: 'conditional',
    term: 'Conditional Statement',
    translation: 'Pernyataan bersyarat',
    scope: 'general',
    definition: {
      ms: 'Pernyataan yang menjalankan blok kod hanya apabila sesuatu syarat benar, contohnya `if … then … end`.',
      en: 'A statement that runs a block of code only when a condition is true, for example `if … then … end`.',
    },
    explanation: {
      ms: 'Lua menyediakan `if`, `elseif` dan `else`. Syarat dinilai mengikut truthiness: hanya `nil` dan `false` palsu. Lua tiada `switch`; gunakan `elseif` atau table carian.',
      en: 'Lua provides `if`, `elseif` and `else`. Conditions are judged by truthiness: only `nil` and `false` are falsy. Lua has no `switch`; use `elseif` or a lookup table.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local stock = 0\nif stock > 0 then print("in stock") else print("sold out") end', expectedOutput: 'sold out' },
    related: ['control-flow', 'truthiness'],
    lectures: [lua103(1, 1), lua103(1, 2)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures', url: `${MANUAL}#3.3.4` }],
  },
  {
    key: 'loop',
    term: 'Loop',
    translation: 'Gelung',
    scope: 'general',
    definition: {
      ms: 'Binaan yang menjalankan blok kod berulang kali selagi atau sehingga sesuatu syarat dipenuhi, atau untuk julat nilai.',
      en: 'A construct that runs a block of code repeatedly while or until a condition holds, or for a range of values.',
    },
    explanation: {
      ms: 'Lua mempunyai `while` (semak sebelum), `repeat … until` (semak selepas, sekurang-kurangnya sekali), `for` berangka (julat dengan langkah) dan `for … in` generik (iterator). `break` keluar daripada gelung terdalam.',
      en: 'Lua has `while` (check before), `repeat … until` (check after, at least once), the numeric `for` (a range with a step) and the generic `for … in` (iterators). `break` leaves the innermost loop.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local sum = 0\nfor i = 1, 4 do sum = sum + i end\nprint(sum)', expectedOutput: '10' },
    related: ['infinite-loop', 'control-flow'],
    lectures: [lua103(2, 1), lua103(2, 2), lua103(2, 3)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.5 — For Statement', url: `${MANUAL}#3.3.5` }],
  },
  {
    key: 'infinite-loop',
    term: 'Infinite Loop',
    translation: 'Gelung tak terhingga',
    scope: 'general',
    definition: {
      ms: 'Gelung yang syarat tamatnya tidak pernah dipenuhi, jadi ia berjalan selama-lamanya dan program tergantung.',
      en: 'A loop whose exit condition is never met, so it runs forever and the program hangs.',
    },
    explanation: {
      ms: 'Punca biasa: terlupa mengemas kini pemboleh ubah gelung, mengemas kini ke arah yang salah, atau syarat yang sentiasa benar. Kadang-kadang gelung tanpa had sengaja ditulis (`while true do … end`) dengan `break` di dalamnya.',
      en: 'Common causes: forgetting to update the loop variable, updating it in the wrong direction, or a condition that is always true. Sometimes an unbounded loop is intentional (`while true do … end`) with a `break` inside.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local n = 0\nwhile true do\n  n = n + 1\n  if n == 3 then break end\nend\nprint(n)', expectedOutput: '3' },
    related: ['loop'],
    lectures: [lua103(2, 1), lua103(3, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures (break)', url: `${MANUAL}#3.3.4` }],
  },
  {
    key: 'goto-label',
    term: 'goto and Labels',
    translation: 'goto dan label',
    scope: 'lua',
    definition: {
      ms: 'Pernyataan `goto nama` melompat ke label `::nama::` dalam fungsi yang sama (Lua 5.2+).',
      en: 'The `goto name` statement jumps to the label `::name::` in the same function (Lua 5.2+).',
    },
    explanation: {
      ms: 'Kegunaan biasa ialah corak "continue": melangkau baki badan gelung dengan `goto continue` ke label di hujung badan. `goto` tidak boleh melompat ke dalam skop local atau keluar dari fungsi. Luau tidak menyokong `goto`; ia mempunyai `continue`.',
      en: 'Its usual use is the "continue" pattern: skipping the rest of a loop body with `goto continue` to a label at the end of the body. `goto` cannot jump into the scope of a local or out of a function. Luau does not support `goto`; it has `continue`.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'for i = 1, 5 do\n  if i % 2 == 0 then goto continue end\n  io.write(i, " ")\n  ::continue::\nend\nprint()', expectedOutput: '1 3 5 ' },
    related: ['loop', 'control-flow'],
    lectures: [lua103(3, 2)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures (goto)', url: `${MANUAL}#3.3.4` }],
  },
  {
    key: 'algorithm',
    term: 'Algorithm',
    translation: 'Algoritma',
    scope: 'general',
    definition: {
      ms: 'Jujukan langkah yang jelas dan terhingga untuk menyelesaikan masalah atau mengira sesuatu hasil.',
      en: 'A clear, finite sequence of steps that solves a problem or computes a result.',
    },
    explanation: {
      ms: 'Algoritma bebas daripada bahasa: ia boleh ditulis sebagai pseudocode, kemudian dilaksanakan dalam Lua. Algoritma dinilai dari segi ketepatan dan bilangan langkah yang diperlukan apabila input membesar.',
      en: 'An algorithm is independent of language: it can be written as pseudocode, then implemented in Lua. Algorithms are judged by correctness and by how many steps they need as the input grows.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local function gcd(a, b)\n  while b ~= 0 do a, b = b, a % b end\n  return a\nend\nprint(gcd(48, 18))', expectedOutput: '6' },
    related: ['pseudocode', 'loop'],
    lectures: [lua103(3, 3), lua103(4, 1)],
    references: [{ title: 'Programming in Lua (1st ed.) — 4.3 Control Structures', url: 'https://www.lua.org/pil/4.3.html' }],
  },
  {
    key: 'pseudocode',
    term: 'Pseudocode',
    translation: 'Kod pseudo (pseudocode)',
    scope: 'general',
    definition: {
      ms: 'Penerangan algoritma dalam bahasa separa formal yang mudah dibaca, sebelum ia ditulis dalam bahasa pengaturcaraan sebenar.',
      en: 'A description of an algorithm in readable, semi-formal language, before it is written in a real programming language.',
    },
    explanation: {
      ms: 'Pseudocode membolehkan anda memikirkan langkah, syarat dan gelung tanpa bimbang tentang sintaks. Setiap baris pseudocode yang baik dipetakan kepada satu atau beberapa baris Lua.',
      en: 'Pseudocode lets you think through steps, conditions and loops without worrying about syntax. Each line of good pseudocode maps to one or a few lines of Lua.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: '-- REPEAT ask for a guess UNTIL guess equals secret\nlocal secret, guesses = 7, {3, 9, 7}\nlocal i = 0\nrepeat i = i + 1 until guesses[i] == secret\nprint("found after " .. i .. " guesses")',
      expectedOutput: 'found after 3 guesses',
    },
    related: ['algorithm'],
    lectures: [lua103(4, 1)],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.4 — Control Structures (repeat)', url: `${MANUAL}#3.3.4` }],
  },
  {
    key: 'pseudo-random',
    term: 'Pseudo-random Numbers',
    translation: 'Nombor pseudo-rawak',
    scope: 'general',
    definition: {
      ms: 'Nombor yang kelihatan rawak tetapi dihasilkan oleh formula yang ditentukan; benih (seed) yang sama memberi jujukan yang sama.',
      en: 'Numbers that look random but are produced by a deterministic formula; the same seed gives the same sequence.',
    },
    explanation: {
      ms: 'Lua 5.4 menggunakan penjana xoshiro256**. `math.random(m, n)` memberi integer dalam julat; `math.randomseed(x)` menetapkan benih. Benih tetap berguna untuk ujian; benih berubah (contohnya masa) untuk permainan. Jangan gunakan `math.random` untuk keselamatan.',
      en: 'Lua 5.4 uses the xoshiro256** generator. `math.random(m, n)` gives an integer in a range; `math.randomseed(x)` sets the seed. A fixed seed is useful for tests; a changing seed (for example the time) for games. Never use `math.random` for security.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'math.randomseed(7)\nlocal a = math.random(1, 6)\nmath.randomseed(7)\nprint(a == math.random(1, 6))', expectedOutput: 'true' },
    related: ['algorithm'],
    lectures: [lua103(4, 2)],
    references: [{ title: 'Lua 5.4 Reference Manual — math.random and math.randomseed', url: `${MANUAL}#pdf-math.random` }],
  },
];
