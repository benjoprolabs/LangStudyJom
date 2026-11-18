import { CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL, WARN } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU203 · Module 1 · Lecture 1 — RBXScriptSignal and Connect.
 * Level: intermediate. Roblox examples (runtime 'roblox') run only in Roblox Studio and are never
 * claimed as executed. The pure-Luau Signal example (runtime 'luau') is executed by
 * `npm run verify:code` with the Luau VM.
 */
const DOCS = 'https://create.roblox.com/docs';

export const LUAU203_1_1: LectureContentDef = {
  courseCode: 'LUAU203',
  module: 1,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menerangkan apa itu [[event]] (RBXScriptSignal) dalam Roblox.', 'Explain what an [[event]] (RBXScriptSignal) is in Roblox.'],
        ['Menyambung fungsi pengendali dengan `:Connect` dan menerima argumen event.', 'Connect a handler function with `:Connect` and receive event arguments.'],
        ['Menyimpan dan memutuskan [[connection]] dengan `:Disconnect()`.', 'Store and break a [[connection]] with `:Disconnect()`.'],
        ['Membezakan API enjin Roblox daripada bahasa Luau itu sendiri.', 'Distinguish Roblox engine APIs from the Luau language itself.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Fungsi dan [[closure]] dalam Luau (LUAU103).', 'Functions and [[closure|closures]] in Luau (LUAU103).'],
        ['[[instance|Instance]] dan data model Roblox (LUAU201).', 'The [[instance|Instance]] and the Roblox data model (LUAU201).'],
        ['Menjalankan Script dalam Roblox Studio.', 'Running a Script in Roblox Studio.'],
      )),
    S('introduction',
      WARN('Kuliah ini menggunakan **API enjin Roblox** (`game`, `workspace`, `Players`, `Touched`). Contoh-contoh ini hanya berjalan dalam Roblox Studio — ia bukan Lua standard dan tidak berjalan dalam luau CLI.',
        'This lecture uses **Roblox engine APIs** (`game`, `workspace`, `Players`, `Touched`). These examples run only in Roblox Studio — they are not standard Lua and do not run in the luau CLI.',
        ['Khusus Roblox', 'Roblox-specific']),
      P('Permainan sentiasa **bertindak balas**: pemain menyentuh syiling, pemain baharu masuk, butang ditekan. Daripada menyemak keadaan berulang kali, Roblox menyediakan [[event|event]] — isyarat yang dicetuskan oleh enjin apabila sesuatu berlaku. Kod kita hanya perlu mengatakan: "apabila ini berlaku, jalankan fungsi ini".',
        'Games are always **reacting**: a player touches a coin, a new player joins, a button is pressed. Instead of checking state over and over, Roblox provides [[event|events]] — signals fired by the engine when something happens. Our code only has to say: "when this happens, run this function".')),
    S('fundamental_concepts',
      UL(
        ['Setiap event ialah objek **RBXScriptSignal**, contohnya `part.Touched` atau `Players.PlayerAdded`.', 'Every event is an **RBXScriptSignal** object, for example `part.Touched` or `Players.PlayerAdded`.'],
        ['`signal:Connect(fn)` mendaftar fungsi pengendali dan memulangkan [[connection]].', '`signal:Connect(fn)` registers a handler function and returns a [[connection]].'],
        ['Enjin memanggil pengendali **setiap kali** event berlaku, bersama argumen event.', 'The engine calls the handler **every time** the event happens, passing the event arguments.'],
        ['`connection:Disconnect()` menghentikan pengendali itu.', '`connection:Disconnect()` stops that handler.'],
      )),
    S('detailed_theory',
      P('Event ialah corak **observer**: objek (Part) memegang senarai pendengar; apabila keadaan berubah, ia memberitahu setiap pendengar. Ini memisahkan "apa yang berlaku" daripada "apa yang perlu dibuat", jadi beberapa sistem boleh bertindak balas kepada event yang sama tanpa mengetahui antara satu sama lain.',
        'An event is the **observer** pattern: an object (a Part) holds a list of listeners; when its state changes, it notifies each listener. This separates "what happened" from "what to do", so several systems can react to the same event without knowing about each other.'),
      P('Pengendali berjalan dalam thread Luau baharu yang diurus oleh penjadual Roblox. Tetapan `Workspace.SignalBehavior` menentukan sama ada pengendali dijalankan serta-merta atau ditangguhkan (deferred) hingga titik penyegerakan seterusnya — jangan bergantung pada susunan masa yang tepat antara pengendali.',
        "Handlers run in a new Luau thread managed by Roblox's scheduler. The `Workspace.SignalBehavior` setting decides whether handlers run immediately or are deferred until the next synchronisation point — do not rely on the exact timing order between handlers."),
      INFO('Bahasa Luau tidak mempunyai "event". Event, `Connect` dan `Disconnect` disediakan oleh **enjin Roblox**. Dalam contoh lengkap kedua, kita membina isyarat sendiri dalam Luau tulen untuk melihat cara mekanisme ini berfungsi.',
        'The Luau language itself has no "events". Events, `Connect` and `Disconnect` are provided by the **Roblox engine**. In the second complete example we build our own signal in pure Luau to see how the mechanism works.',
        ['Luau berbanding Roblox', 'Luau versus Roblox'])),
    S('technical_terminology', TERMS('event', 'connection', 'instance', 'function', 'closure')),
    S('syntax_rules',
      UL(
        ['`local connection = signal:Connect(handler)` — gunakan titik bertindih (`:`), bukan titik.', '`local connection = signal:Connect(handler)` — use a colon (`:`), not a dot.'],
        ['Hantar **fungsi itu sendiri** (`onTouched`), bukan hasil panggilannya (`onTouched()`).', 'Pass the **function itself** (`onTouched`), not the result of calling it (`onTouched()`).'],
        ['`signal:Once(handler)` — pengendali dijalankan sekali sahaja, kemudian terputus sendiri.', '`signal:Once(handler)` — the handler runs once only, then disconnects itself.'],
        ['`signal:Wait()` — menjeda thread semasa sehingga event berlaku dan memulangkan argumennya.', '`signal:Wait()` — pauses the current thread until the event fires and returns its arguments.'],
        ['`connection:Disconnect()` — boleh dipanggil berkali-kali dengan selamat.', '`connection:Disconnect()` — safe to call more than once.'],
      )),
    S('code_demonstration',
      CODE('touched-basic', 'luau', 'roblox', ['Bertindak balas kepada sentuhan (Script dalam Part)', 'Reacting to a touch (Script inside a Part)'], `
local part = script.Parent

local function onTouched(otherPart: BasePart)
	print("Touched by", otherPart.Name)
end

part.Touched:Connect(onTouched)
`, 'Touched by LeftFoot   (in Roblox Studio, when a character steps on the part)')),
    S('complete_examples',
      CODE('player-greeter', 'luau', 'roblox', ['Mengalu-alukan pemain dan berhenti selepas tiga', 'Greeting players and stopping after three'], `
local Players = game:GetService("Players")

local greeted = 0
local connection: RBXScriptConnection

connection = Players.PlayerAdded:Connect(function(player: Player)
	greeted += 1
	print(\`Welcome, {player.Name}! ({greeted})\`)
	if greeted >= 3 then
		connection:Disconnect()
		print("Stopped greeting new players.")
	end
end)
`, 'Welcome, Aisyah! (1)   … after the third player: Stopped greeting new players.'),
      CODE('pure-signal', 'luau', 'luau', ['Cara event berfungsi: isyarat dalam Luau tulen', 'How events work: a signal in pure Luau'], `
type Callback = (...any) -> ()

local Signal = {}
Signal.__index = Signal

function Signal.new()
	return setmetatable({ handlers = {} :: { Callback } }, Signal)
end

function Signal:Connect(callback: Callback)
	table.insert(self.handlers, callback)
	local signal = self
	return {
		Disconnect = function()
			local index = table.find(signal.handlers, callback)
			if index then
				table.remove(signal.handlers, index)
			end
		end,
	}
end

function Signal:Fire(...: any)
	for _, handler in table.clone(self.handlers) do
		handler(...)
	end
end

local touched = Signal.new()
local connection = touched:Connect(function(name: string)
	print(\`Touched by {name}\`)
end)

touched:Fire("LeftFoot")
connection.Disconnect()
touched:Fire("RightFoot")
print(\`handlers left: {#touched.handlers}\`)
`, 'Touched by LeftFoot\nhandlers left: 0'),
      INFO('Contoh `pure-signal` dijalankan dengan VM Luau di luar Roblox untuk mengesahkan output. Anotasi jenisnya tidak disemak oleh penyemak jenis semasa pengesahan ini.',
        'The `pure-signal` example is executed with the Luau VM outside Roblox to verify its output. Its type annotations are not checked by the type checker during this verification.')),
    S('line_by_line',
      EXPLAIN('touched-basic',
        ['1', '`script` ialah Script ini; `script.Parent` ialah Part yang mengandunginya.', '`script` is this Script; `script.Parent` is the Part that contains it.'],
        ['3–5', 'Fungsi pengendali bernama. `otherPart: BasePart` ialah [[type-annotation|anotasi jenis]] Luau — bahagian yang menyentuh.', 'A named handler function. `otherPart: BasePart` is a Luau [[type-annotation]] — the part that touched.'],
        ['7', '`Touched:Connect(onTouched)` mendaftar pengendali. Perhatikan: tiada `()` selepas `onTouched`.', '`Touched:Connect(onTouched)` registers the handler. Note: no `()` after `onTouched`.']),
      EXPLAIN('pure-signal',
        ['1', 'Jenis untuk fungsi pengendali: menerima apa-apa argumen, tidak memulangkan apa-apa.', 'A type for handler functions: takes any arguments, returns nothing.'],
        ['3–8', 'Kelas `Signal` dengan [[metatable]]; setiap isyarat menyimpan senarai `handlers` sendiri.', 'A `Signal` class using a [[metatable]]; each signal keeps its own `handlers` list.'],
        ['10–21', '`Connect` menambah pengendali dan memulangkan objek sambungan. Fungsi `Disconnect` ialah [[closure]] yang mengingati `signal` dan `callback`.', '`Connect` adds the handler and returns a connection object. Its `Disconnect` function is a [[closure]] that remembers `signal` and `callback`.'],
        ['23–27', '`Fire` memanggil setiap pengendali. `table.clone` melindungi gelung jika pengendali memutuskan dirinya semasa dipanggil.', '`Fire` calls every handler. `table.clone` protects the loop if a handler disconnects itself while being called.'],
        ['29–37', 'Penggunaan: sambung, cetuskan sekali, putuskan, cetuskan lagi — panggilan kedua tidak mencetak apa-apa.', 'Usage: connect, fire once, disconnect, fire again — the second fire prints nothing.'])),
    S('why_this_way',
      P('Pengendali **bernama** (`onTouched`) lebih mudah dibaca, diuji dan diputuskan berbanding fungsi tanpa nama yang panjang. Kita menyimpan [[connection]] hanya apabila kita perlu menghentikannya kemudian — contohnya selepas tiga pemain, atau apabila pusingan permainan tamat.',
        'A **named** handler (`onTouched`) is easier to read, test and disconnect than a long anonymous function. We keep the [[connection]] only when we need to stop it later — for example after three players, or when a game round ends.')),
    S('execution_flow',
      OL(
        ['Pelayan memuatkan Script dan menjalankan baris 1–7 sekali: pengendali didaftarkan, kemudian Script terus menunggu.', 'The server loads the Script and runs lines 1–7 once: the handler is registered, then the Script simply waits.'],
        ['Enjin fizik mengesan sentuhan antara Part dan kaki watak.', 'The physics engine detects contact between the Part and a character’s foot.'],
        ['Enjin mencetuskan `Touched` dengan bahagian yang menyentuh sebagai argumen.', 'The engine fires `Touched` with the touching part as its argument.'],
        ['Penjadual menjalankan `onTouched(LeftFoot)` dalam thread baharu dan `print` menulis ke tetingkap Output.', 'The scheduler runs `onTouched(LeftFoot)` in a new thread and `print` writes to the Output window.'],
      )),
    S('memory_behaviour',
      P('Connection memegang rujukan kepada fungsi pengendali, dan pengendali (sebagai [[closure]]) memegang semua upvalue yang ditangkapnya. Selagi connection aktif, semua itu tidak boleh dikutip oleh garbage collector.',
        'A connection holds a reference to its handler function, and the handler (as a [[closure]]) holds every upvalue it captured. While the connection is active, none of that can be garbage-collected.'),
      WARN('Apabila Instance dimusnahkan dengan `:Destroy()`, connection pada event Instance itu diputuskan. Tetapi connection kepada event yang hidup lama — `Players.PlayerAdded`, `RunService.Heartbeat` — kekal sehingga anda memutuskannya. Lupa memutuskannya ialah punca biasa **kebocoran memori**.',
        'When an Instance is destroyed with `:Destroy()`, connections to that Instance’s events are disconnected. But connections to long-lived events — `Players.PlayerAdded`, `RunService.Heartbeat` — stay until you disconnect them. Forgetting to do so is a common cause of **memory leaks**.',
        ['Kebocoran memori', 'Memory leaks'])),
    S('alternative_implementations',
      UL(
        ['`signal:Once(fn)` untuk tindak balas sekali sahaja — tidak perlu menyimpan connection.', '`signal:Once(fn)` for a one-time reaction — no need to store the connection.'],
        ['`signal:Wait()` dalam kod berjujukan, contohnya menunggu watak dimuatkan.', '`signal:Wait()` in sequential code, for example waiting for a character to load.'],
        ['Satu Script dengan tag CollectionService untuk banyak Part, bukannya satu Script dalam setiap Part (LUAU201).', 'One Script with CollectionService tags for many Parts, instead of one Script inside every Part (LUAU201).'],
        ['Isyarat tersuai (seperti `pure-signal`) atau BindableEvent untuk komunikasi antara sistem anda sendiri.', 'Custom signals (like `pure-signal`) or a BindableEvent for communication between your own systems.'],
      )),
    S('common_mistakes',
      UL(
        ['`part.Touched:Connect(onTouched())` — memanggil fungsi serta-merta dan menyambung hasilnya (`nil`).', '`part.Touched:Connect(onTouched())` — calls the function immediately and connects its result (`nil`).'],
        ['Menggunakan titik (`part.Touched.Connect`) dan bukannya titik bertindih.', 'Using a dot (`part.Touched.Connect`) instead of a colon.'],
        ['`Touched` dicetuskan berkali-kali untuk satu sentuhan (setiap bahagian badan) — gunakan debounce.', '`Touched` fires many times for one contact (each body part) — use a debounce.'],
        ['Meletakkan LocalScript dalam Workspace — LocalScript tidak berjalan di situ.', 'Putting a LocalScript in Workspace — LocalScripts do not run there.'],
        ['Tidak memutuskan connection kepada event yang hidup lama.', 'Not disconnecting connections to long-lived events.'],
      )),
    S('debugging',
      OL(
        ['Buka tetingkap **Output** dalam Roblox Studio dan semak ralat merah.', 'Open the **Output** window in Roblox Studio and look for red errors.'],
        ['Tambah `print` pada baris pertama pengendali untuk mengesahkan ia dipanggil.', 'Add a `print` on the first line of the handler to confirm it is called.'],
        ['Jika tiada apa-apa dicetak, semak jenis dan lokasi skrip: Script pelayan dalam Workspace atau ServerScriptService; LocalScript dalam StarterPlayerScripts atau StarterGui.', 'If nothing prints, check the script type and location: a server Script in Workspace or ServerScriptService; a LocalScript in StarterPlayerScripts or StarterGui.'],
        ['Untuk `Touched`, semak bahawa Part mempunyai `CanTouch` dihidupkan.', 'For `Touched`, check that the Part has `CanTouch` enabled.'],
      )),
    S('performance',
      P('Setiap connection mempunyai kos kecil, dan setiap Script tambahan mempunyai kos permulaan. Seratus syiling dengan seratus Script lebih berat daripada satu Script yang menyambung seratus Part melalui tag. Kerja berat dalam pengendali `Heartbeat` dijalankan setiap bingkai — pastikan ia ringan.',
        'Every connection has a small cost, and every extra Script has a start-up cost. A hundred coins with a hundred Scripts are heavier than one Script connecting a hundred Parts through tags. Heavy work inside a `Heartbeat` handler runs every frame — keep it light.')),
    S('software_engineering',
      P('**Pelaksanaan lemah:** satu Script disalin ke dalam setiap syiling. Membetulkan pepijat bermaksud menyunting setiap salinan. **Pelaksanaan lebih baik:** satu modul `CoinService` yang menyambung semua Part bertag "Coin" dan memusatkan logik. Pertukarannya: sedikit lebih banyak reka bentuk di awal, tetapi satu tempat untuk menguji, membetulkan dan mengoptimumkan.',
        '**Poor implementation:** one Script copied into every coin. Fixing a bug means editing every copy. **Improved implementation:** one `CoinService` module that connects every Part tagged "Coin" and centralises the logic. The trade-off: a little more design up front, but one place to test, fix and optimise.'),
      CODE('coin-service', 'luau', 'roblox', ['CoinService: satu Script, banyak syiling', 'CoinService: one Script, many coins'], `
local CollectionService = game:GetService("CollectionService")

local function onCoinTouched(coin: BasePart, otherPart: BasePart)
	local character = otherPart.Parent
	if character and character:FindFirstChildOfClass("Humanoid") then
		coin:Destroy() -- also disconnects this coin's Touched connection
	end
end

for _, coin in CollectionService:GetTagged("Coin") do
	coin.Touched:Connect(function(otherPart)
		onCoinTouched(coin, otherPart)
	end)
end
`, '(no output — touched coins disappear)')),
    S('industry_use_cases',
      UL(
        ['Antara muka pengguna: `TextButton.Activated` untuk butang menu dan kedai.', 'User interfaces: `TextButton.Activated` for menu and shop buttons.'],
        ['Kitaran pemain: `Players.PlayerAdded` untuk memuatkan data dan mencipta leaderstats.', 'Player lifecycle: `Players.PlayerAdded` to load data and create leaderstats.'],
        ['Mekanik permainan: syiling, bahagian maut dan checkpoint menggunakan `Touched`.', 'Game mechanics: coins, kill parts and checkpoints use `Touched`.'],
        ['Corak observer yang sama digunakan dalam rangka kerja UI dan enjin permainan lain.', 'The same observer pattern is used in UI frameworks and other game engines.'],
      )),
    S('practical_demonstration',
      OL(
        ['Dalam Roblox Studio, masukkan Part ke dalam Workspace dan tetapkan `Anchored` kepada true.', 'In Roblox Studio, insert a Part into Workspace and set `Anchored` to true.'],
        ['Tambah Script ke dalam Part dan tampal contoh `touched-basic`.', 'Add a Script inside the Part and paste the `touched-basic` example.'],
        ['Tekan **Play**, berjalan ke atas Part, dan perhatikan tetingkap Output.', 'Press **Play**, walk onto the Part, and watch the Output window.'],
        ['Perhatikan berapa kali mesej dicetak, kemudian bincangkan mengapa debounce diperlukan.', 'Notice how many times the message prints, then discuss why a debounce is needed.'],
      )),
    S('mini_project',
      P('**Pad lompat dengan debounce.** Apabila pemain menyentuh pad, tukar warnanya dan berikan lompatan, tetapi hanya sekali setiap dua saat.',
        '**A jump pad with a debounce.** When a player touches the pad, change its colour and launch them, but only once every two seconds.'),
      CODE('jump-pad', 'luau', 'roblox', ['Penyelesaian contoh', 'Example solution'], `
local pad = script.Parent
local cooling = false

pad.Touched:Connect(function(otherPart: BasePart)
	local humanoid = otherPart.Parent and otherPart.Parent:FindFirstChildOfClass("Humanoid")
	if not humanoid or cooling then
		return
	end
	cooling = true
	pad.BrickColor = BrickColor.new("Bright green")
	humanoid.JumpPower = 80
	humanoid.Jump = true
	task.wait(2)
	humanoid.JumpPower = 50
	pad.BrickColor = BrickColor.new("Medium stone grey")
	cooling = false
end)
`, '(no output — the pad turns green and the character jumps higher)'),
      KEY('Pembolehubah `cooling` ialah **debounce**: ia menghalang pengendali berjalan semula semasa pad sedang "bertenang".', 'The `cooling` variable is a **debounce**: it stops the handler from running again while the pad is "cooling down".')),
    S('summary',
      UL(
        ['Event ialah RBXScriptSignal yang disediakan oleh enjin Roblox, bukan bahasa Luau.', 'An event is an RBXScriptSignal provided by the Roblox engine, not the Luau language.'],
        ['`:Connect(fn)` mendaftar pengendali dan memulangkan connection.', '`:Connect(fn)` registers a handler and returns a connection.'],
        ['Putuskan connection kepada event yang hidup lama untuk mengelak kebocoran memori.', 'Disconnect connections to long-lived events to avoid memory leaks.'],
        ['`Once`, `Wait` dan tag CollectionService ialah alternatif yang sering lebih sesuai.', '`Once`, `Wait` and CollectionService tags are alternatives that are often a better fit.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah perbezaan antara `part.Touched:Connect(onTouched)` dan `part.Touched:Connect(onTouched())`?', 'What is the difference between `part.Touched:Connect(onTouched)` and `part.Touched:Connect(onTouched())`?'],
        ['Bilakah anda perlu menyimpan connection dalam pemboleh ubah?', 'When do you need to store a connection in a variable?'],
        ['Mengapakah contoh `pure-signal` boleh dijalankan di luar Roblox tetapi `touched-basic` tidak?', 'Why can the `pure-signal` example run outside Roblox while `touched-basic` cannot?'],
        ['Apakah yang berlaku kepada connection apabila Part dimusnahkan?', 'What happens to a connection when its Part is destroyed?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Events — Roblox Creator Documentation', url: `${DOCS}/scripting/events` },
        { title: 'RBXScriptSignal (Engine API reference)', url: `${DOCS}/reference/engine/datatypes/RBXScriptSignal` },
        { title: 'RBXScriptConnection (Engine API reference)', url: `${DOCS}/reference/engine/datatypes/RBXScriptConnection` },
        { title: 'BasePart.Touched (Engine API reference)', url: `${DOCS}/reference/engine/classes/BasePart#Touched` },
        { title: 'Luau documentation', url: 'https://luau.org/' },
      )),
  ],
};
