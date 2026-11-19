import type { GlossaryTermDef } from '@/db/content/types';

/**
 * Click-to-Learn glossary (Professional Programming Education Standard, Part F).
 * `scope` keeps the pathways apart: general/lua concepts use standard-Lua examples (verified with
 * Lua 5.4), `luau` uses the Luau VM, `roblox` examples run only in Roblox Studio (never executed).
 */
const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const DOCS = 'https://create.roblox.com/docs';

export const GLOSSARY: GlossaryTermDef[] = [
  {
    key: 'variable',
    term: 'Variable',
    translation: 'Pemboleh ubah',
    scope: 'general',
    definition: {
      ms: 'Nama yang merujuk kepada sesuatu nilai supaya nilai itu boleh disimpan, dibaca dan diubah dalam program.',
      en: 'A name that refers to a value so the value can be stored, read and changed in a program.',
    },
    explanation: {
      ms: 'Dalam Lua, pemboleh ubah tidak mempunyai jenis — **nilai** yang mempunyai jenis. Pemboleh ubah tanpa kata kunci `local` ialah global dan disimpan dalam table persekitaran (`_ENV`, Lua 5.2+). Pemboleh ubah `local` hanya wujud dalam bloknya dan lebih pantas diakses. Pemboleh ubah yang belum diberi nilai bernilai `nil`.',
      en: 'In Lua, variables have no type — **values** do. A variable declared without `local` is global and lives in the environment table (`_ENV`, Lua 5.2+). A `local` variable exists only inside its block and is faster to access. A variable that has not been assigned holds `nil`.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local playerName = "Aisyah"\nlocal level = 3\nprint(playerName, level)', expectedOutput: 'Aisyah\t3' },
    related: ['scope', 'table'],
    lectures: [{ courseCode: 'LUA102', module: 1, lecture: 1 }, { courseCode: 'LUAU102', module: 1, lecture: 1 }],
    references: [{ title: 'Lua 5.4 Reference Manual §3.2 — Variables', url: `${MANUAL}#3.2` }],
  },
  {
    key: 'function',
    term: 'Function',
    translation: 'Fungsi',
    scope: 'general',
    definition: {
      ms: 'Blok kod bernama yang menerima input (parameter), melakukan kerja dan boleh memulangkan nilai.',
      en: 'A named block of code that takes inputs (parameters), does work and can return values.',
    },
    explanation: {
      ms: 'Dalam Lua, fungsi ialah **nilai kelas pertama**: ia boleh disimpan dalam pemboleh ubah atau table, dihantar sebagai argumen dan dipulangkan daripada fungsi lain. Fungsi Lua boleh memulangkan beberapa nilai sekali gus.',
      en: 'In Lua, functions are **first-class values**: they can be stored in variables or tables, passed as arguments and returned from other functions. A Lua function can return several values at once.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local function add(a, b)\n  return a + b\nend\n\nprint(add(2, 3))', expectedOutput: '5' },
    related: ['closure', 'scope'],
    lectures: [{ courseCode: 'LUA104', module: 1, lecture: 1 }, { courseCode: 'LUAU103', module: 3, lecture: 1 }],
    references: [{ title: 'Lua 5.4 Reference Manual §3.4.11 — Function Definitions', url: `${MANUAL}#3.4.11` }],
  },
  {
    key: 'scope',
    term: 'Scope',
    translation: 'Skop',
    scope: 'general',
    definition: {
      ms: 'Bahagian program di mana sesuatu nama pemboleh ubah boleh dilihat dan digunakan.',
      en: 'The part of a program where a variable name is visible and can be used.',
    },
    explanation: {
      ms: 'Lua menggunakan skop leksikal: pemboleh ubah `local` boleh dilihat dari titik pengisytiharannya hingga akhir blok yang mengandunginya (`do … end`, badan fungsi, gelung atau chunk). `local` dalam blok dalaman boleh **membayangi** (shadow) pemboleh ubah luar yang sama nama.',
      en: 'Lua uses lexical scoping: a `local` variable is visible from its declaration to the end of the enclosing block (`do … end`, a function body, a loop or the chunk). A `local` in an inner block can **shadow** an outer variable with the same name.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local x = "outer"\ndo\n  local x = "inner"\n  print(x)\nend\nprint(x)', expectedOutput: 'inner\nouter' },
    related: ['variable', 'closure'],
    lectures: [{ courseCode: 'LUA102', module: 1, lecture: 1 }, { courseCode: 'LUA104', module: 4, lecture: 1 }],
    references: [{ title: 'Lua 5.4 Reference Manual §3.5 — Visibility Rules', url: `${MANUAL}#3.5` }],
  },
  {
    key: 'closure',
    term: 'Closure',
    translation: 'Penutupan (closure)',
    scope: 'general',
    definition: {
      ms: 'Fungsi bersama pemboleh ubah luar yang "ditangkapnya" (upvalue), yang terus hidup walaupun fungsi luar sudah tamat.',
      en: 'A function together with the outer variables it "captures" (upvalues), which stay alive even after the outer function has finished.',
    },
    explanation: {
      ms: 'Apabila fungsi dalaman merujuk pemboleh ubah local fungsi luar, Lua mengekalkan pemboleh ubah itu sebagai **upvalue**. Setiap panggilan fungsi luar mencipta upvalue baharu, jadi setiap closure mempunyai keadaan peribadinya sendiri. Upvalue dikongsi, bukan disalin.',
      en: 'When an inner function refers to a local of an outer function, Lua keeps that variable alive as an **upvalue**. Each call of the outer function creates new upvalues, so each closure has its own private state. Upvalues are shared, not copied.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local function makeCounter()\n  local count = 0\n  return function()\n    count = count + 1\n    return count\n  end\nend\n\nlocal nextId = makeCounter()\nprint(nextId(), nextId(), nextId())',
      expectedOutput: '1\t2\t3',
    },
    related: ['function', 'scope'],
    lectures: [{ courseCode: 'LUA104', module: 4, lecture: 3 }, { courseCode: 'LUAU103', module: 4, lecture: 1 }],
    references: [{ title: 'Programming in Lua (1st ed., Lua 5.0) — Closures', url: 'https://www.lua.org/pil/6.1.html' }],
  },
  {
    key: 'table',
    term: 'Table',
    translation: 'Jadual (table)',
    scope: 'general',
    definition: {
      ms: 'Satu-satunya struktur data Lua: koleksi pasangan kunci–nilai yang berfungsi sebagai array, dictionary, objek dan modul.',
      en: "Lua's only data structure: a collection of key–value pairs that serves as an array, dictionary, object and module.",
    },
    explanation: {
      ms: 'Table dicipta dengan constructor `{}`. Kunci boleh apa-apa nilai kecuali `nil` (dan NaN). Array Lua bermula pada indeks **1**. Table ialah **rujukan**: menyalin pemboleh ubah tidak menyalin table.',
      en: 'Tables are created with the `{}` constructor. A key can be any value except `nil` (and NaN). Lua arrays start at index **1**. Tables are **references**: copying a variable does not copy the table.',
    },
    example: { language: 'lua', runtime: 'lua54', code: 'local player = { name = "Aisyah", scores = { 10, 20 } }\nprint(player.name, #player.scores, player.scores[1])', expectedOutput: 'Aisyah\t2\t10' },
    related: ['metatable', 'iterator'],
    lectures: [{ courseCode: 'LUA102', module: 2, lecture: 3 }, { courseCode: 'LUAU104', module: 1, lecture: 1 }],
    references: [{ title: 'Lua 5.4 Reference Manual §2.1 — Values and Types', url: `${MANUAL}#2.1` }],
  },
  {
    key: 'metatable',
    term: 'Metatable',
    translation: 'Metatable',
    scope: 'general',
    definition: {
      ms: 'Table yang mentakrifkan tingkah laku khas table lain, seperti operator tersuai dan pencarian medan yang tiada.',
      en: 'A table that defines special behaviour for another table, such as custom operators and lookups of missing fields.',
    },
    explanation: {
      ms: 'Metatable dipasang dengan `setmetatable`. Medannya yang bermula dengan dua garis bawah (**metamethod**) seperti `__index`, `__add` dan `__tostring` dipanggil oleh Lua apabila operasi berkenaan berlaku. Ini asas OOP dalam Lua. Luau menyokong kebanyakan metamethod tetapi tidak `__gc`.',
      en: 'A metatable is attached with `setmetatable`. Its double-underscore fields (**metamethods**) such as `__index`, `__add` and `__tostring` are called by Lua when the corresponding operation happens. This is the basis of OOP in Lua. Luau supports most metamethods but not `__gc`.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local Vector = {}\nVector.__index = Vector\nVector.__add = function(a, b)\n  return setmetatable({ x = a.x + b.x, y = a.y + b.y }, Vector)\nend\nVector.__tostring = function(v)\n  return "(" .. v.x .. ", " .. v.y .. ")"\nend\n\nlocal a = setmetatable({ x = 1, y = 2 }, Vector)\nlocal b = setmetatable({ x = 3, y = 4 }, Vector)\nprint(tostring(a + b))',
      expectedOutput: '(4, 6)',
    },
    related: ['table'],
    lectures: [{ courseCode: 'LUAU103', module: 2, lecture: 2 }],
    references: [{ title: 'Lua 5.4 Reference Manual §2.4 — Metatables and Metamethods', url: `${MANUAL}#2.4` }],
  },
  {
    key: 'iterator',
    term: 'Iterator',
    translation: 'Pengulang (iterator)',
    scope: 'general',
    definition: {
      ms: 'Fungsi yang memulangkan elemen seterusnya setiap kali dipanggil; digunakan oleh gelung `for` generik.',
      en: 'A function that returns the next element each time it is called; used by the generic `for` loop.',
    },
    explanation: {
      ms: 'Gelung `for x in f` memanggil `f` berulang kali sehingga ia memulangkan `nil`. `pairs` dan `ipairs` ialah iterator terbina. Iterator sendiri biasanya ditulis sebagai closure yang menyimpan kedudukan semasa.',
      en: 'The loop `for x in f` calls `f` repeatedly until it returns `nil`. `pairs` and `ipairs` are built-in iterators. Custom iterators are usually written as closures that keep the current position.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local function countdown(n)\n  return function()\n    if n > 0 then\n      n = n - 1\n      return n + 1\n    end\n  end\nend\n\nfor value in countdown(3) do\n  print(value)\nend',
      expectedOutput: '3\n2\n1',
    },
    related: ['closure', 'table'],
    lectures: [{ courseCode: 'LUAU103', module: 2, lecture: 2 }, { courseCode: 'LUAU104', module: 2, lecture: 2 }],
    references: [{ title: 'Lua 5.4 Reference Manual §3.3.5 — For Statement', url: `${MANUAL}#3.3.5` }],
  },
  {
    key: 'coroutine',
    term: 'Coroutine',
    translation: 'Korutin',
    scope: 'general',
    definition: {
      ms: 'Fungsi yang boleh menjeda dirinya (`yield`) dan disambung semula (`resume`) dari titik yang sama.',
      en: 'A function that can pause itself (`yield`) and be resumed (`resume`) from the same point.',
    },
    explanation: {
      ms: 'Coroutine memberi konkurensi **koperatif**: hanya satu coroutine berjalan pada satu masa, dan ia sendiri yang memutuskan bila hendak menjeda. Nilai boleh dihantar melalui `resume` dan `yield`. Ia bukan thread sistem pengendalian dan tidak berjalan secara selari.',
      en: 'Coroutines provide **cooperative** concurrency: only one runs at a time, and it decides itself when to pause. Values can be passed through `resume` and `yield`. They are not operating-system threads and do not run in parallel.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'local producer = coroutine.create(function()\n  for i = 1, 3 do\n    coroutine.yield("item " .. i)\n  end\n  return "done"\nend)\n\nfor _ = 1, 4 do\n  print(coroutine.resume(producer))\nend',
      expectedOutput: 'true\titem 1\ntrue\titem 2\ntrue\titem 3\ntrue\tdone',
    },
    related: ['function'],
    lectures: [{ courseCode: 'LUA102', module: 2, lecture: 3 }],
    references: [{ title: 'Lua 5.4 Reference Manual §2.6 — Coroutines', url: `${MANUAL}#2.6` }],
  },
  {
    key: 'module',
    term: 'Module',
    translation: 'Modul',
    scope: 'general',
    definition: {
      ms: 'Unit kod yang boleh digunakan semula, biasanya table fungsi yang dipulangkan dan dimuatkan dengan `require`.',
      en: 'A reusable unit of code, usually a table of functions that is returned and loaded with `require`.',
    },
    explanation: {
      ms: 'Dalam Lua standard, `require` mencari modul melalui `package.path`, menjalankannya sekali dan menyimpan hasilnya dalam `package.loaded` — panggilan seterusnya memulangkan table yang sama. Dalam Roblox, modul ialah objek **ModuleScript** dan `require` menerima objek itu, bukan nama fail.',
      en: 'In standard Lua, `require` finds a module through `package.path`, runs it once and caches the result in `package.loaded` — later calls return the same table. In Roblox, a module is a **ModuleScript** object and `require` takes that object, not a file name.',
    },
    example: {
      language: 'lua',
      runtime: 'lua54',
      code: 'package.preload["greeter"] = function()\n  local M = {}\n  function M.hello(name)\n    return "Hello, " .. name\n  end\n  return M\nend\n\nlocal greeter = require("greeter")\nprint(greeter.hello("Aisyah"))\nprint(require("greeter") == greeter)',
      expectedOutput: 'Hello, Aisyah\ntrue',
    },
    related: ['table', 'function'],
    lectures: [{ courseCode: 'LUAU101', module: 2, lecture: 3 }, { courseCode: 'LUAU104', module: 4, lecture: 2 }],
    references: [{ title: 'Lua 5.4 Reference Manual §6.3 — Modules', url: `${MANUAL}#6.3` }],
  },
  {
    key: 'type-annotation',
    term: 'Type Annotation',
    translation: 'Anotasi jenis',
    scope: 'luau',
    definition: {
      ms: 'Catatan jenis pada pemboleh ubah, parameter atau nilai pulangan (contoh `level: number`) yang disemak oleh penyemak jenis Luau.',
      en: 'A type note on a variable, parameter or return value (for example `level: number`) that the Luau type checker verifies.',
    },
    explanation: {
      ms: 'Anotasi jenis ialah ciri **Luau**, bukan Lua standard. Ia hanya digunakan oleh penyemak jenis statik dan **tidak mengubah** tingkah laku semasa runtime. Mod `--!strict` meminta semakan paling ketat.',
      en: 'Type annotations are a **Luau** feature, not standard Lua. They are used only by the static type checker and **do not change** runtime behaviour. The `--!strict` mode asks for the strictest checking.',
    },
    example: {
      language: 'luau',
      runtime: 'luau',
      code: 'type Player = { name: string, level: number }\n\nlocal function describe(p: Player): string\n\treturn `{p.name} (level {p.level})`\nend\n\nprint(describe({ name = "Aisyah", level = 3 }))',
      expectedOutput: 'Aisyah (level 3)',
    },
    related: ['variable', 'function'],
    lectures: [{ courseCode: 'LUAU101', module: 1, lecture: 2 }, { courseCode: 'LUAU103', module: 3, lecture: 1 }],
    references: [{ title: 'Luau — Type checking', url: 'https://luau.org/typecheck' }],
  },
  {
    key: 'instance',
    term: 'Instance',
    translation: 'Instance (objek Roblox)',
    scope: 'roblox',
    definition: {
      ms: 'Objek dalam data model Roblox — contohnya Part, Model, Script atau Player — yang mempunyai properties, kaedah dan event.',
      en: 'An object in the Roblox data model — for example a Part, Model, Script or Player — with properties, methods and events.',
    },
    explanation: {
      ms: 'Semua objek Roblox mewarisi kelas `Instance` dan tersusun sebagai pokok (Parent dan anak). Instance dicipta dengan `Instance.new` dan hanya wujud dalam enjin Roblox — **bukan** sebahagian daripada Lua atau bahasa Luau.',
      en: 'Every Roblox object inherits from the `Instance` class and is arranged as a tree (Parent and children). Instances are created with `Instance.new` and exist only inside the Roblox engine — they are **not** part of Lua or the Luau language.',
    },
    example: {
      language: 'luau',
      runtime: 'roblox',
      code: 'local part = Instance.new("Part")\npart.Name = "Platform"\npart.Anchored = true\npart.Size = Vector3.new(8, 1, 8)\npart.Parent = workspace\nprint(part:GetFullName())',
      expectedOutput: 'Workspace.Platform',
    },
    related: ['event', 'replication'],
    lectures: [{ courseCode: 'LUAU101', module: 1, lecture: 3 }, { courseCode: 'LUAU101', module: 2, lecture: 2 }],
    references: [{ title: 'Instance (Engine API reference)', url: `${DOCS}/reference/engine/classes/Instance` }],
  },
  {
    key: 'event',
    term: 'Event',
    translation: 'Peristiwa',
    scope: 'roblox',
    definition: {
      ms: 'Isyarat (RBXScriptSignal) yang dicetuskan oleh enjin Roblox apabila sesuatu berlaku, contohnya bahagian disentuh atau pemain masuk.',
      en: 'A signal (RBXScriptSignal) that the Roblox engine fires when something happens, for example a part is touched or a player joins.',
    },
    explanation: {
      ms: 'Kod tidak menyemak keadaan berulang kali; sebaliknya ia **menyambung** fungsi kepada event dengan `:Connect`. Enjin memanggil fungsi itu setiap kali event berlaku, bersama argumen event.',
      en: 'Instead of checking state repeatedly, code **connects** a function to an event with `:Connect`. The engine calls that function every time the event happens, passing the event arguments.',
    },
    example: {
      language: 'luau',
      runtime: 'roblox',
      code: 'local part = workspace:WaitForChild("Platform")\n\npart.Touched:Connect(function(otherPart)\n\tprint("Touched by", otherPart.Name)\nend)',
      expectedOutput: 'Touched by LeftFoot   (in Roblox Studio, when a character touches the part)',
    },
    related: ['connection', 'instance', 'function'],
    lectures: [{ courseCode: 'LUAU203', module: 1, lecture: 1 }],
    references: [{ title: 'Events', url: `${DOCS}/scripting/events` }],
  },
  {
    key: 'connection',
    term: 'Connection',
    translation: 'Sambungan',
    scope: 'roblox',
    definition: {
      ms: 'Objek RBXScriptConnection yang dipulangkan oleh `:Connect`; ia mewakili ikatan antara event dan fungsi pengendali.',
      en: 'The RBXScriptConnection object returned by `:Connect`; it represents the link between an event and its handler function.',
    },
    explanation: {
      ms: 'Simpan connection jika anda perlu menghentikan pengendali kemudian dengan `:Disconnect()`. Connection kepada event yang hidup lama (contohnya `RunService.Heartbeat`) yang tidak diputuskan menyebabkan **kebocoran memori** kerana closure pengendali terus dirujuk.',
      en: 'Keep the connection if you need to stop the handler later with `:Disconnect()`. Connections to long-lived events (for example `RunService.Heartbeat`) that are never disconnected cause **memory leaks**, because the handler closure stays referenced.',
    },
    example: {
      language: 'luau',
      runtime: 'roblox',
      code: 'local RunService = game:GetService("RunService")\n\nlocal elapsed = 0\nlocal connection\nconnection = RunService.Heartbeat:Connect(function(deltaTime)\n\telapsed += deltaTime\n\tif elapsed >= 2 then\n\t\tconnection:Disconnect()\n\t\tprint("Stopped after", math.floor(elapsed), "seconds")\n\tend\nend)',
      expectedOutput: 'Stopped after 2 seconds',
    },
    related: ['event', 'closure'],
    lectures: [{ courseCode: 'LUAU203', module: 1, lecture: 1 }],
    references: [{ title: 'RBXScriptConnection (Engine API reference)', url: `${DOCS}/reference/engine/datatypes/RBXScriptConnection` }],
  },
  {
    key: 'remote-event',
    term: 'RemoteEvent',
    translation: 'Peristiwa jauh (RemoteEvent)',
    scope: 'roblox',
    definition: {
      ms: 'Objek Roblox untuk menghantar mesej sehala antara klien dan pelayan.',
      en: 'A Roblox object for sending one-way messages between the client and the server.',
    },
    explanation: {
      ms: 'Klien memanggil `FireServer` dan pelayan menerima melalui `OnServerEvent`; pelayan boleh memanggil `FireClient` atau `FireAllClients`. Pelayan sentiasa menerima objek `Player` pengirim sebagai argumen pertama. **Jangan percaya klien**: sahkan setiap argumen di pelayan.',
      en: 'The client calls `FireServer` and the server receives it through `OnServerEvent`; the server can call `FireClient` or `FireAllClients`. The server always receives the sending `Player` as the first argument. **Never trust the client**: validate every argument on the server.',
    },
    example: {
      language: 'luau',
      runtime: 'roblox',
      code: '-- Server Script\nlocal ReplicatedStorage = game:GetService("ReplicatedStorage")\nlocal requestJump = ReplicatedStorage:WaitForChild("RequestJump")\n\nrequestJump.OnServerEvent:Connect(function(player, height)\n\tif typeof(height) ~= "number" or height < 0 or height > 50 then\n\t\treturn -- reject invalid input from the client\n\tend\n\tprint(player.Name, "requested a jump of", height)\nend)',
      expectedOutput: 'Aisyah requested a jump of 20   (when the client fires with 20)',
    },
    related: ['replication', 'event'],
    lectures: [{ courseCode: 'LUAU301', module: 1, lecture: 1 }],
    references: [{ title: 'Remote events and callbacks', url: `${DOCS}/scripting/events/remote` }],
  },
  {
    key: 'datastore',
    term: 'DataStore',
    translation: 'Stor data (DataStore)',
    scope: 'roblox',
    definition: {
      ms: 'Perkhidmatan Roblox untuk menyimpan data secara kekal antara sesi permainan, seperti syiling dan inventori pemain.',
      en: 'The Roblox service for persisting data between game sessions, such as player coins and inventories.',
    },
    explanation: {
      ms: 'Data store diakses melalui `DataStoreService` dan hanya boleh digunakan di **pelayan**. Setiap panggilan ialah permintaan rangkaian yang boleh gagal dan tertakluk kepada had, jadi bungkus dengan `pcall` dan cuba semula dengan berhati-hati. `UpdateAsync` lebih selamat daripada `SetAsync` apabila beberapa pelayan menulis.',
      en: 'Data stores are accessed through `DataStoreService` and can only be used on the **server**. Every call is a network request that can fail and is subject to limits, so wrap it in `pcall` and retry carefully. `UpdateAsync` is safer than `SetAsync` when several servers write.',
    },
    example: {
      language: 'luau',
      runtime: 'roblox',
      code: 'local DataStoreService = game:GetService("DataStoreService")\nlocal coinStore = DataStoreService:GetDataStore("Coins")\n\nlocal ok, result = pcall(function()\n\treturn coinStore:GetAsync("player_123")\nend)\n\nif ok then\n\tprint("Coins:", result or 0)\nelse\n\twarn("DataStore failed:", result)\nend',
      expectedOutput: 'Coins: 0   (for a key that has never been saved)',
    },
    related: ['remote-event'],
    lectures: [{ courseCode: 'LUAU302', module: 1, lecture: 1 }],
    references: [{ title: 'Data stores', url: `${DOCS}/cloud-services/data-stores` }],
  },
  {
    key: 'replication',
    term: 'Replication',
    translation: 'Replikasi',
    scope: 'roblox',
    definition: {
      ms: 'Proses enjin Roblox menyalin perubahan daripada pelayan kepada setiap klien supaya semua pemain melihat dunia yang sama.',
      en: 'The process by which the Roblox engine copies changes from the server to every client so all players see the same world.',
    },
    explanation: {
      ms: 'Perubahan yang dibuat oleh **Script pelayan** direplikasi kepada klien. Perubahan oleh **LocalScript** hanya dilihat oleh pemain itu sendiri dan tidak dihantar ke pelayan. Inilah sebabnya logik penting mesti berjalan di pelayan.',
      en: 'Changes made by a **server Script** replicate to clients. Changes made by a **LocalScript** are seen only by that player and are not sent to the server. This is why important logic must run on the server.',
    },
    example: {
      language: 'luau',
      runtime: 'roblox',
      code: '-- In a server Script: every player sees the platform turn green.\nworkspace.Platform.BrickColor = BrickColor.new("Bright green")\n\n-- In a LocalScript: only THIS player would see the change.\n-- workspace.Platform.Transparency = 0.5',
      expectedOutput: '(no output — the colour change appears for every player)',
    },
    related: ['instance', 'remote-event'],
    lectures: [{ courseCode: 'LUAU214', module: 2, lecture: 1 }],
    references: [{ title: 'Client-server runtime', url: `${DOCS}/projects/client-server` }],
  },
];
