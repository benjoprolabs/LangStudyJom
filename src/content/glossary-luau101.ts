import type { GlossaryTermDef } from '@/db/content/types';

/**
 * Click-to-Learn terms introduced by LUAU101 (Introduction to Luau and the Development Environment).
 * `luau` examples are executed with the official Luau VM; `roblox` examples are compiled only.
 */
const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';
const luau101 = (module: number, lecture: number) => ({ courseCode: 'LUAU101', module, lecture });

export const LUAU101_GLOSSARY: GlossaryTermDef[] = [
  {
    key: 'luau-cli',
    term: 'Luau CLI (luau, luau-analyze)',
    translation: 'Alat baris arahan Luau',
    scope: 'luau',
    definition: {
      ms: 'Program baris arahan rasmi Luau: `luau` menjalankan fail `.luau` di luar Roblox, dan `luau-analyze` menyemak jenis dan amaran lint.',
      en: 'Luau’s official command-line programs: `luau` runs `.luau` files outside Roblox, and `luau-analyze` checks types and lint warnings.',
    },
    explanation: {
      ms: 'CLI hanya mengandungi bahasa Luau dan pustaka standardnya — tiada `game`, `workspace` atau API enjin Roblox lain. Ia sesuai untuk mempelajari bahasa dan menguji logik tulen dengan cepat.',
      en: 'The CLI contains only the Luau language and its standard library — no `game`, `workspace` or any other Roblox engine API. It is ideal for learning the language and quickly testing pure logic.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local total = 0\nfor i = 1, 4 do\n  total += i\nend\nprint(`total = {total}`)', expectedOutput: 'total = 10' },
    related: ['interpreter', 'roblox-studio'],
    lectures: [luau101(2, 1)],
    references: [{ title: 'Luau — Getting started', url: `${LUAU}/getting-started` }],
  },
  {
    key: 'roblox-studio',
    term: 'Roblox Studio',
    translation: 'Roblox Studio',
    scope: 'roblox',
    definition: {
      ms: 'Persekitaran pembangunan percuma Roblox untuk membina pengalaman: editor 3D, editor skrip, Explorer, Properties, Output dan alat ujian (Play, Run).',
      en: 'Roblox’s free development environment for building experiences: a 3D editor, a script editor, the Explorer, Properties, Output and testing tools (Play, Run).',
    },
    explanation: {
      ms: 'Kod Luau yang menggunakan API enjin (contohnya `workspace` atau `game:GetService`) hanya boleh dijalankan di dalam Studio atau dalam pengalaman Roblox yang diterbitkan. Bahan kursus ini hanya **mengkompil** kod sebegini; ia tidak dijalankan dalam Studio oleh sistem pengesahan kami.',
      en: 'Luau code that uses engine APIs (for example `workspace` or `game:GetService`) can only run inside Studio or in a published Roblox experience. These course materials only **compile** such code; it is not run in Studio by our verification system.',
    },
    example: { language: 'luau', runtime: 'roblox', code: 'local part = Instance.new("Part")\npart.Anchored = true\npart.Parent = workspace\nprint(part.Name)', expectedOutput: 'Part' },
    related: ['luau-cli', 'output-window', 'instance'],
    lectures: [luau101(2, 2)],
    references: [{ title: 'Roblox Studio overview', url: `${DOCS}/studio` }],
  },
  {
    key: 'output-window',
    term: 'Output Window',
    translation: 'Tetingkap Output',
    scope: 'roblox',
    definition: {
      ms: 'Panel Roblox Studio yang memaparkan hasil `print`, amaran `warn` (kuning) dan ralat (merah) bersama nama skrip dan nombor baris.',
      en: 'The Roblox Studio panel that shows `print` results, `warn` warnings (yellow) and errors (red) together with the script name and line number.',
    },
    explanation: {
      ms: 'Dalam Roblox, `print` memisahkan argumen dengan ruang (bukan tab seperti Lua standard dan luau CLI), dan setiap mesej boleh diklik untuk melompat ke baris skrip. `warn` ialah fungsi global Roblox; ia tiada dalam luau CLI.',
      en: 'In Roblox, `print` separates arguments with spaces (not tabs as in standard Lua and the luau CLI), and every message can be clicked to jump to the script line. `warn` is a Roblox global function; it does not exist in the luau CLI.',
    },
    example: { language: 'luau', runtime: 'roblox', code: 'print("Server started")\nwarn("Low on coins")\nprint("Players:", #game:GetService("Players"):GetPlayers())', expectedOutput: 'Server started\nLow on coins\nPlayers: 0' },
    related: ['roblox-studio', 'stack-traceback'],
    lectures: [luau101(3, 1)],
    references: [{ title: 'Output window', url: `${DOCS}/studio/output` }],
  },
  {
    key: 'script-types',
    term: 'Script, LocalScript and ModuleScript',
    translation: 'Script, LocalScript dan ModuleScript',
    scope: 'roblox',
    definition: {
      ms: 'Tiga jenis bekas kod dalam Roblox: **Script** berjalan di pelayan, **LocalScript** di peranti pemain (klien), dan **ModuleScript** memulangkan nilai yang dikongsi melalui `require`.',
      en: 'Roblox’s three kinds of code containers: a **Script** runs on the server, a **LocalScript** on the player’s device (the client), and a **ModuleScript** returns a value shared through `require`.',
    },
    explanation: {
      ms: 'Bahasa dalam ketiga-tiganya sama — Luau. Yang berbeza ialah **di mana** dan **bila** enjin Roblox menjalankannya. ModuleScript dijalankan sekali bagi setiap persekitaran (pelayan atau klien) pada `require` pertama, dan hasilnya disimpan untuk panggilan seterusnya.',
      en: 'The language in all three is the same — Luau. What differs is **where** and **when** the Roblox engine runs them. A ModuleScript runs once per environment (server or client) on the first `require`, and its result is cached for later calls.',
    },
    example: { language: 'luau', runtime: 'roblox', code: 'local ReplicatedStorage = game:GetService("ReplicatedStorage")\nlocal Settings = require(ReplicatedStorage.Settings)\nprint(Settings.MaxPlayers)', expectedOutput: '8' },
    related: ['roblox-studio', 'module'],
    lectures: [luau101(2, 3)],
    references: [{ title: 'Scripts (Roblox Creator Hub)', url: `${DOCS}/scripting/scripts` }],
  },
  {
    key: 'script-analysis',
    term: 'Script Analysis',
    translation: 'Analisis Skrip',
    scope: 'roblox',
    definition: {
      ms: 'Panel Roblox Studio (dan alat `luau-analyze`) yang menyemak skrip tanpa menjalankannya: ralat sintaks, ralat jenis dan amaran lint seperti pemboleh ubah yang tidak digunakan.',
      en: 'The Roblox Studio panel (and the `luau-analyze` tool) that checks scripts without running them: syntax errors, type errors and lint warnings such as unused variables.',
    },
    explanation: {
      ms: 'Amaran Script Analysis muncul sebagai garis beralun di bawah kod. Ia tidak menghentikan program, tetapi selalunya menunjuk kepada pepijat sebenar — contohnya global yang tersalah eja. Pengesahan kod kursus ini **tidak** menjalankan penganalisis; amaran yang diterangkan dalam kuliah ialah penerangan, bukan output yang disahkan.',
      en: 'Script Analysis warnings appear as squiggly underlines in the code. They do not stop the program, but they often point at real bugs — for example a misspelled global. This course’s code verification does **not** run the analyser; warnings described in lectures are descriptions, not verified output.',
    },
    example: { language: 'luau', runtime: 'roblox', code: 'local score = 10\nprint(scroe) -- Script Analysis underlines this: unknown global \'scroe\'' },
    related: ['luau-cli', 'type-annotation'],
    lectures: [luau101(3, 3)],
    references: [{ title: 'Luau — Linting', url: `${LUAU}/lint` }],
  },
  {
    key: 'syntax-error',
    term: 'Syntax Error',
    translation: 'Ralat sintaks',
    scope: 'general',
    definition: {
      ms: 'Ralat yang dikesan semasa kod dihurai, sebelum sebarang baris dijalankan — contohnya `end` yang hilang atau kurungan yang tidak ditutup.',
      en: 'An error detected while the code is parsed, before any line runs — for example a missing `end` or an unclosed parenthesis.',
    },
    explanation: {
      ms: 'Kerana tiada apa-apa dijalankan, program dengan ralat sintaks tidak menghasilkan output langsung. Mesej Luau berbentuk `Expected \'end\' (to close \'function\' at line 1), got <eof>`: apa yang dijangka, blok yang terbuka, dan apa yang sebenarnya ditemui.',
      en: 'Because nothing runs, a program with a syntax error produces no output at all. Luau messages look like `Expected \'end\' (to close \'function\' at line 1), got <eof>`: what was expected, which block is open, and what was actually found.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local function double(n)\n  return n * 2\nend\nprint(double(21))', expectedOutput: '42' },
    related: ['runtime-error', 'chunk'],
    lectures: [luau101(4, 1)],
    references: [{ title: 'Luau — Syntax', url: `${LUAU}/syntax` }],
  },
  {
    key: 'runtime-error',
    term: 'Runtime Error',
    translation: 'Ralat runtime',
    scope: 'general',
    definition: {
      ms: 'Ralat yang berlaku semasa program sedang berjalan, apabila sesuatu operasi tidak boleh dilakukan — contohnya mengindeks `nil` atau memanggil nilai yang bukan fungsi.',
      en: 'An error that happens while the program is running, when an operation cannot be performed — for example indexing `nil` or calling a value that is not a function.',
    },
    explanation: {
      ms: 'Baris sebelum ralat sudah dijalankan, jadi output sebahagian mungkin kelihatan. Mesej runtime Luau menyebut operasi dan jenis, contohnya `attempt to index nil with \'Name\'`, dan disertai stack traceback.',
      en: 'Lines before the error have already run, so partial output may appear. Luau runtime messages name the operation and the types, for example `attempt to index nil with \'Name\'`, and come with a stack traceback.',
    },
    example: { language: 'luau', runtime: 'luau', code: 'local ok, message = pcall(function()\n  local player = nil\n  return player.Name\nend)\nprint(ok, message)', expectedOutput: "false\texample:3: attempt to index nil with 'Name'" },
    related: ['syntax-error', 'stack-traceback'],
    lectures: [luau101(4, 1), luau101(4, 2)],
    references: [{ title: 'Luau — Library: error and pcall', url: `${LUAU}/library` }],
  },
  {
    key: 'engine-api',
    term: 'Engine API (Roblox)',
    translation: 'API enjin (Roblox)',
    scope: 'roblox',
    definition: {
      ms: 'Objek, kelas, perkhidmatan dan fungsi yang disediakan oleh enjin Roblox kepada skrip — `game`, `workspace`, `Instance`, `task`, `Vector3` dan sebagainya — berbeza daripada bahasa Luau itu sendiri.',
      en: 'The objects, classes, services and functions the Roblox engine provides to scripts — `game`, `workspace`, `Instance`, `task`, `Vector3` and so on — as distinct from the Luau language itself.',
    },
    explanation: {
      ms: 'Luau ialah bahasa; API enjin ialah perpustakaan yang Roblox sediakan **untuk** bahasa itu. Di luar Roblox (luau CLI), nama seperti `game` ialah global `nil`. Kursus LUAU101–LUAU104 mengajar bahasa; API enjin bermula dalam LUAU201.',
      en: 'Luau is the language; the engine API is the library Roblox provides **for** that language. Outside Roblox (the luau CLI), names such as `game` are `nil` globals. Courses LUAU101–LUAU104 teach the language; the engine API starts in LUAU201.',
    },
    example: { language: 'luau', runtime: 'roblox', code: 'local Players = game:GetService("Players")\nPlayers.PlayerAdded:Connect(function(player)\n  print(`Welcome, {player.Name}`)\nend)' },
    related: ['instance', 'roblox-studio'],
    lectures: [luau101(1, 3)],
    references: [{ title: 'Roblox Engine API reference', url: `${DOCS}/reference/engine` }],
  },
];
