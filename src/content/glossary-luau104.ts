import type { GlossaryTermDef } from '@/db/content/types';

/**
 * Click-to-Learn terms introduced by LUAU104 (Tables in Luau).
 * Every example is plain Luau and is executed with the official Luau VM by `npm run verify:code`.
 */
const LUAU = 'https://luau.org';
const luau104 = (module: number, lecture: number) => ({ courseCode: 'LUAU104', module, lecture });

export const LUAU104_GLOSSARY: GlossaryTermDef[] = [
  {
    key: 'array',
    term: 'Array',
    translation: 'Tatasusunan (array)',
    scope: 'general',
    definition: {
      ms: 'Table yang kuncinya ialah integer berturutan bermula dari 1, digunakan sebagai senarai tersusun.',
      en: 'A table whose keys are consecutive integers starting at 1, used as an ordered list.',
    },
    explanation: {
      ms: 'Dalam Luau, indeks pertama ialah 1 (bukan 0) dan `#t` memberi panjang. Array tanpa lubang (`nil` di tengah) ialah satu-satunya bentuk yang `#`, `table.insert` dan `table.sort` jamin berfungsi dengan betul.',
      en: 'In Luau the first index is 1 (not 0) and `#t` gives the length. An array without holes (`nil` in the middle) is the only shape for which `#`, `table.insert` and `table.sort` are guaranteed to behave correctly.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local fruits = {"apple", "mango", "durian"}\nprint(fruits[1], #fruits)\nprint(fruits[0])', expectedOutput: 'apple\t3\nnil' },
    related: ['table', 'loop'],
    lectures: [luau104(1, 1), luau104(1, 2)],
    references: [{ title: 'Roblox Creator Hub — Arrays', url: 'https://create.roblox.com/docs/luau/arrays' }],
  },
  {
    key: 'dictionary',
    term: 'Dictionary',
    translation: 'Kamus (dictionary)',
    scope: 'general',
    definition: {
      ms: 'Table yang memetakan kunci bernama (biasanya string) kepada nilai, seperti `{coins = 50, level = 3}`.',
      en: 'A table that maps named keys (usually strings) to values, such as `{coins = 50, level = 3}`.',
    },
    explanation: {
      ms: 'Membaca kunci yang tiada memberi `nil`, bukan ralat. `#` tidak mengira kunci dictionary, dan susunan lelaran tidak ditentukan — isih kunci jika susunan penting.',
      en: 'Reading a missing key gives `nil`, not an error. `#` does not count dictionary keys, and iteration order is unspecified — sort the keys if order matters.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local player = {name = "Aina", coins = 50}\nplayer.coins += 25\nprint(player.name, player.coins, player.gems, #player)', expectedOutput: 'Aina\t75\tnil\t0' },
    related: ['table', 'generalized-iteration'],
    lectures: [luau104(2, 1), luau104(2, 2)],
    references: [{ title: 'Roblox Creator Hub — Dictionaries', url: 'https://create.roblox.com/docs/luau/dictionaries' }],
  },
  {
    key: 'reference-semantics',
    term: 'Reference Semantics',
    translation: 'Semantik rujukan',
    scope: 'general',
    definition: {
      ms: 'Peraturan bahawa pemboleh ubah table memegang rujukan kepada satu objek, bukan salinan; menyerahkan table menyerahkan objek yang sama.',
      en: 'The rule that a table variable holds a reference to one object, not a copy; assigning or passing a table hands over the same object.',
    },
    explanation: {
      ms: '`local b = a` tidak menyalin: perubahan melalui `b` dilihat melalui `a`. `==` membandingkan identiti, jadi dua table dengan kandungan yang sama tidak sama.',
      en: '`local b = a` does not copy: changes through `b` are seen through `a`. `==` compares identity, so two tables with the same contents are not equal.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local a = {hp = 100}\nlocal b = a\nb.hp = 0\nprint(a.hp, a == b, {1} == {1})', expectedOutput: '0\ttrue\tfalse' },
    related: ['table', 'variable'],
    lectures: [luau104(3, 1)],
    references: [{ title: 'Programming in Lua (1st ed.) — 2.5 Tables', url: 'https://www.lua.org/pil/2.5.html' }],
  },
  {
    key: 'shallow-copy',
    term: 'Shallow Copy',
    translation: 'Salinan cetek',
    scope: 'general',
    definition: {
      ms: 'Salinan table baharu dengan kunci dan nilai yang sama; table bersarang di dalamnya masih dikongsi dengan yang asal.',
      en: 'A new table with the same keys and values; nested tables inside it are still shared with the original.',
    },
    explanation: {
      ms: 'Dalam Luau, `table.clone(t)` membuat salinan cetek. Ia mencukupi untuk table rata; untuk data bersarang, gunakan salinan dalam.',
      en: 'In Luau, `table.clone(t)` makes a shallow copy. It is enough for flat tables; for nested data, use a deep copy.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local original = {level = 1, bag = {"potion"}}\nlocal copy = table.clone(original)\ncopy.level = 2\ntable.insert(copy.bag, "key")\nprint(original.level, #original.bag)', expectedOutput: '1\t2' },
    related: ['deep-copy', 'reference-semantics'],
    lectures: [luau104(3, 2)],
    references: [{ title: 'Luau — Library: table.clone', url: `${LUAU}/library#table-library` }],
  },
  {
    key: 'deep-copy',
    term: 'Deep Copy',
    translation: 'Salinan dalam',
    scope: 'general',
    definition: {
      ms: 'Salinan yang turut menyalin setiap table bersarang, supaya salinan dan yang asal tidak berkongsi apa-apa table.',
      en: 'A copy that also copies every nested table, so the copy and the original share no tables.',
    },
    explanation: {
      ms: 'Luau tidak mempunyai fungsi salinan dalam terbina; ia biasanya ditulis secara rekursif. Table yang merujuk dirinya sendiri (kitaran) memerlukan table "sudah disalin" untuk mengelakkan `stack overflow`.',
      en: 'Luau has no built-in deep-copy function; it is usually written recursively. A table that refers to itself (a cycle) needs a "seen" table to avoid a `stack overflow`.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local function deepCopy(t)\n  local c = {}\n  for k, v in t do\n    c[k] = if type(v) == "table" then deepCopy(v) else v\n  end\n  return c\nend\nlocal a = {bag = {"potion"}}\nlocal b = deepCopy(a)\ntable.insert(b.bag, "key")\nprint(#a.bag, #b.bag)', expectedOutput: '1\t2' },
    related: ['shallow-copy', 'recursion'],
    lectures: [luau104(3, 2)],
    references: [{ title: 'Roblox Creator Hub — Tables: copying', url: 'https://create.roblox.com/docs/luau/tables#copy-tables' }],
  },
  {
    key: 'frozen-table',
    term: 'Frozen Table',
    translation: 'Table beku',
    scope: 'luau',
    definition: {
      ms: 'Table yang dijadikan baca sahaja dengan `table.freeze`; sebarang penulisan menimbulkan `attempt to modify a readonly table`.',
      en: 'A table made read-only with `table.freeze`; any write raises `attempt to modify a readonly table`.',
    },
    explanation: {
      ms: 'Pembekuan adalah cetek: table bersarang kekal boleh ditulis kecuali dibekukan juga. `table.isfrozen(t)` menyemak keadaan, dan table beku tidak boleh dicairkan semula.',
      en: 'Freezing is shallow: nested tables stay writable unless they are frozen too. `table.isfrozen(t)` checks the state, and a frozen table cannot be unfrozen.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local config = table.freeze({maxPlayers = 8})\nprint(table.isfrozen(config))\nprint(pcall(function() config.maxPlayers = 99 end))', expectedOutput: 'true\nfalse\texample:3: attempt to modify a readonly table' },
    related: ['table', 'reference-semantics'],
    lectures: [luau104(3, 3), luau104(4, 2)],
    references: [{ title: 'Luau — Library: table.freeze', url: `${LUAU}/library#table-library` }],
  },
];
