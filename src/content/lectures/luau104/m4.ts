import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/**
 * LUAU104 · Module 4 — Modelling Data (Luau language only; every example executed with the Luau VM).
 */

const LUAU = 'https://luau.org';
const DOCS = 'https://create.roblox.com/docs';

// ─── 4.1 Recording player statistics ───────────────────────────────────────

export const LUAU104_4_1: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 4,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Mereka bentuk rekod statistik pemain dengan jenis Luau.', 'Design a player statistics record with Luau types.'],
        ['Mengemas kini statistik melalui fungsi dan bukannya penulisan langsung yang bertaburan.', 'Update statistics through functions rather than scattered direct writes.'],
        ['Mengira statistik terbitan (nisbah, purata) dengan selamat, termasuk pembahagian dengan sifar.', 'Compute derived statistics (ratios, averages) safely, including division by zero.'],
        ['Mengagregat statistik banyak pemain menjadi ringkasan.', 'Aggregate many players’ statistics into a summary.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1–3: array, dictionary, table bersarang, rujukan dan salinan.', 'Modules 1–3: arrays, dictionaries, nested tables, references and copies.'],
      )),
    S('introduction',
      P('Hampir setiap permainan Roblox merekod statistik: bunuh, kematian, kemenangan, masa bermain, skor setiap pusingan. Data ini dipaparkan pada papan pendahulu, disimpan, dan digunakan untuk pencapaian. Modul ini menggabungkan semua yang dipelajari tentang table untuk **memodelkan data** dengan baik: memilih bentuk yang betul, menyembunyikan penulisan di sebalik fungsi, dan mengira nilai terbitan tanpa ralat. Semua contoh ialah Luau tulen; lapisan Roblox (`leaderstats`, DataStore) akan menggunakan modul seperti ini kemudian dalam program.',
        'Almost every Roblox game records statistics: kills, deaths, wins, play time, score per round. This data is shown on leaderboards, saved, and used for achievements. This module combines everything learned about tables to **model data** well: choosing the right shape, hiding writes behind functions, and computing derived values without errors. Every example is pure Luau; a Roblox layer (`leaderstats`, DataStore) will use modules like this later in the programme.'),
      KEY('Rekod tetap (pembina) + fungsi kemas kini + nilai terbitan dikira, bukan disimpan.', 'A fixed record (constructor) + update functions + derived values computed, not stored.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Statistik asas** disimpan (bunuh, kematian, skor pusingan); **statistik terbitan** dikira (KDA, purata).', '**Base statistics** are stored (kills, deaths, round scores); **derived statistics** are computed (KDA, average).'],
        ['Rekod dicipta oleh pembina dengan setiap medan bernilai lalai.', 'Records are created by a constructor with every field defaulted.'],
        ['Pembahagian dengan sifar dalam Luau tidak menimbulkan ralat: `1/0 = inf`, `0/0 = nan`.', 'Division by zero in Luau raises no error: `1/0 = inf`, `0/0 = nan`.'],
        ['Dictionary `nama → rekod` untuk carian; array untuk sejarah tersusun.', 'A `name → record` dictionary for lookup; arrays for ordered history.'],
      )),
    S('detailed_theory',
      P('Rekod statistik yang baik bermula dengan **jenis**: `type Stats = {kills: number, deaths: number, roundScores: {number}}`. Pembina `newStats()` memulangkan rekod dengan semua medan diisi (0 dan `{}`), jadi kod lain tidak pernah perlu menyemak `nil` (kuliah 2.3) dan setiap pemain mempunyai table sendiri (kuliah 3.1). Penulisan dilakukan melalui fungsi kecil — `recordKill`, `recordRound` — supaya peraturan (contohnya skor tidak boleh negatif) dikuatkuasakan di satu tempat. Ralat biasa ialah mengemas kini pemain yang belum didaftarkan: `statsByPlayer[name].kills += 1` gagal dengan `attempt to index nil with \'kills\'`.',
        'A good statistics record starts with a **type**: `type Stats = {kills: number, deaths: number, roundScores: {number}}`. A constructor `newStats()` returns a record with every field filled (0 and `{}`), so other code never needs to check for `nil` (lecture 2.3) and every player has their own table (lecture 3.1). Writes go through small functions — `recordKill`, `recordRound` — so rules (for example, a score cannot be negative) are enforced in one place. A common error is updating a player who was never registered: `statsByPlayer[name].kills += 1` fails with `attempt to index nil with \'kills\'`.'),
      P('Statistik terbitan seperti nisbah bunuh/kematian dan skor purata patut **dikira** daripada data asas, bukan disimpan — nilai yang disimpan boleh menjadi tidak segerak apabila data asas berubah. Pengiraan mesti mengendalikan kes sempadan: Luau tidak menimbulkan ralat untuk pembahagian dengan sifar, jadi pemain tanpa kematian akan mendapat KDA `inf`, dan pemain tanpa pusingan mendapat purata `nan` (0/0) — nilai yang kemudian merosakkan pengisihan dan paparan tanpa ralat. Gunakan klausa pengawal: jika penyebut ialah 0, pulangkan nilai yang jelas (contohnya bunuh sahaja, atau 0). Agregat (jumlah pelayan, pemain terbaik) dibina dengan melelar dictionary rekod, dengan pengisihan untuk output yang stabil.',
        'Derived statistics such as the kill/death ratio and the average score should be **computed** from base data, not stored — a stored value can fall out of sync when the base data changes. The computation must handle edge cases: Luau raises no error for division by zero, so a player with no deaths would get a KDA of `inf`, and a player with no rounds gets an average of `nan` (0/0) — values that later break sorting and display without an error. Use guard clauses: if the denominator is 0, return a clear value (for example the kills alone, or 0). Aggregates (server totals, the top player) are built by iterating the dictionary of records, with sorting for stable output.')),
    S('technical_terminology', TERMS('dictionary', 'array', 'guard-clause', 'type-annotation')),
    S('syntax_rules',
      UL(
        ['`type Stats = {kills: number, deaths: number, roundScores: {number}}`.', '`type Stats = {kills: number, deaths: number, roundScores: {number}}`.'],
        ['`local statsByPlayer: {[string]: Stats} = {}`.', '`local statsByPlayer: {[string]: Stats} = {}`.'],
        ['Pengawal pembahagian: `if s.deaths == 0 then return s.kills end`.', 'A division guard: `if s.deaths == 0 then return s.kills end`.'],
      )),
    S('code_demonstration',
      CODE('stats-record', 'luau', 'luau', ['Rekod statistik dengan pembina dan fungsi', 'A statistics record with a constructor and functions'], `
type Stats = {kills: number, deaths: number, roundScores: {number}}

local function newStats(): Stats
  return {kills = 0, deaths = 0, roundScores = {}}
end

local function recordRound(s: Stats, kills: number, deaths: number, score: number)
  s.kills += kills
  s.deaths += deaths
  table.insert(s.roundScores, math.max(score, 0))
end

local aina = newStats()
recordRound(aina, 5, 2, 340)
recordRound(aina, 3, 0, 280)
recordRound(aina, 1, 4, -20)
print(aina.kills, aina.deaths, table.concat(aina.roundScores, ","))
`, '9\t6\t340,280,0'),
      EXPLAIN('stats-record',
        ['1–5', 'Jenis dan pembina: setiap medan bermula dengan nilai yang sah.', 'A type and a constructor: every field starts with a valid value.'],
        ['7–11', 'Satu fungsi mengemas kini semua statistik pusingan dan menguatkuasakan "skor ≥ 0".', 'One function updates all round statistics and enforces "score ≥ 0".'],
        ['13–17', 'Tiga pusingan; skor negatif disimpan sebagai 0.', 'Three rounds; the negative score is stored as 0.'])),
    S('complete_examples',
      CODE('derived-stats', 'luau', 'luau', ['Statistik terbitan dengan pengawal', 'Derived statistics with guards'], `
type Stats = {kills: number, deaths: number, roundScores: {number}}

local function kda(s: Stats): number
  if s.deaths == 0 then
    return s.kills
  end
  return math.floor(s.kills / s.deaths * 100 + 0.5) / 100
end

local function averageScore(s: Stats): number
  local n = #s.roundScores
  if n == 0 then return 0 end
  local total = 0
  for _, score in s.roundScores do total += score end
  return total / n
end

local veteran: Stats = {kills = 9, deaths = 6, roundScores = {340, 280, 0}}
local rookie: Stats = {kills = 2, deaths = 0, roundScores = {}}
print(kda(veteran), averageScore(veteran))
print(kda(rookie), averageScore(rookie))
print("unguarded:", rookie.kills / rookie.deaths, 0 / #rookie.roundScores ~= 0 / #rookie.roundScores)
`, '1.5\t206.66666666666666\n2\t0\nunguarded:\tinf\ttrue', {
        debug: BUG(`
local statsByPlayer = {Aina = {kills = 0, deaths = 0}}
local function onKill(killer: string)
  statsByPlayer[killer].kills += 1
end
onKill("Aina")
onKill("Ben")
`, 'example:3: attempt to index nil with \'kills\'',
          '"Ben" tidak pernah didaftarkan, jadi `statsByPlayer["Ben"]` ialah `nil` dan `.kills` gagal. Ralat menyebut `\'kills\'` tetapi masalahnya ialah rekod pemain yang tiada. Daftar setiap pemain apabila mereka menyertai, atau gunakan `statsByPlayer[killer] = statsByPlayer[killer] or newStats()`.',
          '"Ben" was never registered, so `statsByPlayer["Ben"]` is `nil` and `.kills` fails. The error names `\'kills\'` but the problem is the missing player record. Register every player when they join, or use `statsByPlayer[killer] = statsByPlayer[killer] or newStats()`.'),
      }),
      EXPLAIN('derived-stats',
        ['1–8', 'Jenis rekod; KDA dibundarkan ke 2 tempat perpuluhan; pengawal untuk kematian sifar.', 'The record type; KDA rounded to 2 decimal places; a guard for zero deaths.'],
        ['10–16', 'Purata dengan pengawal untuk senarai kosong.', 'An average with a guard for an empty list.'],
        ['18–21', 'Veteran: 9/6 = 1.5, purata 620/3. Rookie: kematian 0 → KDA 2; tiada pusingan → 0.', 'Veteran: 9/6 = 1.5, average 620/3. Rookie: 0 deaths → KDA 2; no rounds → 0.'],
        ['22', 'Tanpa pengawal: `2/0` ialah `inf`, dan `0/0` ialah NaN — satu-satunya nilai yang tidak sama dengan dirinya.', 'Without guards: `2/0` is `inf`, and `0/0` is NaN — the only value not equal to itself.']),
      CODE('server-summary', 'luau', 'luau', ['Ringkasan pelayan', 'A server summary'], `
local statsByPlayer = {
  Aina = {kills = 9, deaths = 6},
  Ben = {kills = 4, deaths = 1},
  Chen = {kills = 9, deaths = 3},
}

local totalKills, names = 0, {}
for name, s in statsByPlayer do
  totalKills += s.kills
  table.insert(names, name)
end
table.sort(names, function(a, b)
  local ka, kb = statsByPlayer[a].kills, statsByPlayer[b].kills
  if ka ~= kb then return ka > kb end
  return statsByPlayer[a].deaths < statsByPlayer[b].deaths
end)

print("total kills:", totalKills, "players:", #names)
print("top:", names[1], "then", names[2], names[3])
`, 'total kills:\t22\tplayers:\t3\ntop:\tChen\tthen\tAina\tBen', {
        debug: BUG(`
local stats = {kills = 3, deaths = 1, assists = 2}
local function score(s)
  return s.kills * 100 + s.assist * 50
end
print(score(stats))
`, 'example:3: attempt to perform arithmetic (mul) on nil and number',
          'Medan ialah `assists`, tetapi fungsi membaca `s.assist` (tanpa "s"). Bacaan memberi `nil`, dan `nil * 50` gagal. Mesej menyebut operasi (`mul`), bukan nama medan — semak setiap medan dalam ungkapan pada baris itu. Anotasi `type Stats` membolehkan Studio menangkap ini (diterangkan).',
          'The field is `assists`, but the function reads `s.assist` (no "s"). The read gives `nil`, and `nil * 50` fails. The message names the operation (`mul`), not the field — check every field in the expression on that line. A `type Stats` annotation lets Studio catch this (described).'),
      }),
      EXPLAIN('server-summary',
        ['1–5', 'Dictionary rekod mengikut nama pemain.', 'A dictionary of records by player name.'],
        ['7–11', 'Satu lelaran: jumlah bunuh dan senarai nama.', 'One iteration: total kills and the list of names.'],
        ['12–16', 'Isih: bunuh menurun, kurang kematian memutuskan seri (Chen sebelum Aina).', 'Sort: kills descending, fewer deaths breaks ties (Chen before Aina).'],
        ['18–19', 'Ringkasan yang stabil.', 'A stable summary.'])),
    S('line_by_line',
      EXPLAIN('derived-stats',
        ['7', '`math.floor(x * 100 + 0.5) / 100` — bundarkan ke dua tempat perpuluhan untuk paparan.', '`math.floor(x * 100 + 0.5) / 100` — round to two decimal places for display.']),
      EXPLAIN('stats-record',
        ['10', '`math.max(score, 0)` menguatkuasakan peraturan di satu tempat; pemanggil tidak perlu ingat.', '`math.max(score, 0)` enforces the rule in one place; callers do not need to remember it.'])),
    S('why_this_way',
      P('Mengapa fungsi kemas kini dan bukan `stats.kills += 1` di mana-mana? Kerana peraturan (had, pengesahan, pencetus pencapaian) kemudian ditambah di satu tempat sahaja. Mengapa mengira KDA dan tidak menyimpannya? Kerana nilai yang disimpan mesti dikemas kini setiap kali bunuh atau kematian berubah — satu tempat terlupa, dan papan pendahulu salah.',
        'Why update functions instead of `stats.kills += 1` everywhere? Because rules (caps, validation, achievement triggers) are later added in one place only. Why compute KDA rather than store it? Because a stored value must be updated whenever kills or deaths change — forget one place, and the leaderboard is wrong.'),
      P('Simpan **apabila** nilai ialah fakta asas atau mahal untuk dikira; kira **apabila** nilai bergantung sepenuhnya pada data lain; cache **apabila** pengiraan mahal dan data jarang berubah.', 'Store **when** a value is a base fact or expensive to compute; compute **when** a value depends entirely on other data; cache **when** the computation is expensive and the data rarely changes.')),
    S('execution_flow',
      OL(
        ['`newStats()` mencipta table baharu dengan 0 dan array kosong.', '`newStats()` creates a new table with zeros and an empty array.'],
        ['Setiap `recordRound` mengubah rekod yang sama (rujukan) dan menambah skor.', 'Each `recordRound` mutates the same record (reference) and appends a score.'],
        ['`kda` dan `averageScore` membaca rekod dan menyemak penyebut sebelum membahagi.', '`kda` and `averageScore` read the record and check the denominator before dividing.'],
      )),
    S('memory_behaviour',
      P('Array `roundScores` membesar dengan setiap pusingan. Untuk pemain yang bermain lama, hadkan sejarah (contohnya 20 pusingan terakhir, dengan penimbal bulat dari kuliah 1.1) dan simpan jumlah larian untuk purata keseluruhan. Rekod pemain yang telah keluar patut dibuang dari dictionary supaya ia boleh dikutip.', 'The `roundScores` array grows with every round. For players who play a long time, cap the history (for example the last 20 rounds, with the ring buffer from lecture 1.1) and keep running totals for the overall average. Records of players who have left should be removed from the dictionary so they can be collected.')),
    S('alternative_implementations',
      P('Jumlah larian dan bukannya senarai penuh — purata O(1) dengan memori tetap:', 'Running totals instead of a full list — an O(1) average with fixed memory:'),
      CODE('running-totals', 'luau', 'luau', ['Jumlah larian', 'Running totals'], `
local function newScoreTracker()
  return {count = 0, total = 0, best = -math.huge}
end

local function addScore(t, score: number)
  t.count += 1
  t.total += score
  t.best = math.max(t.best, score)
end

local tracker = newScoreTracker()
for _, s in {340, 280, 410} do addScore(tracker, s) end
print(tracker.count, tracker.total / tracker.count, tracker.best)
`, '3\t343.3333333333333\t410'),
      EXPLAIN('running-totals',
        ['1–9', 'Simpan kiraan, jumlah dan terbaik — bukan setiap skor.', 'Store the count, total and best — not every score.'],
        ['11–13', 'Purata dan terbaik tanpa melelar sejarah. Kosnya: tiada sejarah terperinci.', 'Average and best without iterating a history. The cost: no detailed history.'])),
    S('common_mistakes',
      UL(
        ['Mengemas kini pemain yang belum didaftarkan.', 'Updating a player who was never registered.'],
        ['Membahagi dengan kiraan yang boleh menjadi 0 dan mendapat `inf` atau `nan`.', 'Dividing by a count that can be 0 and getting `inf` or `nan`.'],
        ['Menyimpan nilai terbitan yang menjadi tidak segerak.', 'Storing derived values that fall out of sync.'],
        ['Salah ejaan nama medan statistik.', 'Misspelling statistic field names.'],
      )),
    S('debugging',
      P('Nilai `inf`, `-inf` atau `nan` pada papan pendahulu hampir selalu bermakna pembahagian dengan sifar. NaN sukar dikesan kerana `nan == nan` palsu dan ia mengelirukan pengisihan; semak dengan `x ~= x`. Fungsi pemeriksa ini mencari nilai tidak terhingga atau NaN dalam rekod:',
        'Values like `inf`, `-inf` or `nan` on a leaderboard almost always mean division by zero. NaN is hard to spot because `nan == nan` is false and it confuses sorting; test with `x ~= x`. This checker finds infinite or NaN values in a record:'),
      CODE('bad-numbers', 'luau', 'luau', ['Mengesan nombor tidak sah', 'Detecting invalid numbers'], `
local function badNumbers(record: {[string]: any}): {string}
  local found = {}
  for key, value in record do
    if type(value) == "number" and (value ~= value or value == math.huge or value == -math.huge) then
      table.insert(found, key)
    end
  end
  table.sort(found)
  return found
end

local row = {kills = 4, kda = 4 / 0, average = 0 / 0, score = 120}
print(table.concat(badNumbers(row), ", "))
`, 'average, kda'),
      EXPLAIN('bad-numbers',
        ['1–10', '`value ~= value` benar hanya untuk NaN; bandingkan juga dengan ±`math.huge`.', '`value ~= value` is true only for NaN; also compare with ±`math.huge`.'],
        ['12–13', 'Dua medan rosak dikesan; nombor biasa diabaikan.', 'Two broken fields are detected; ordinary numbers are ignored.'])),
    S('performance',
      P('Kemas kini rekod ialah O(1). Ringkasan pelayan ialah O(n) untuk lelaran dan O(n log n) untuk pengisihan — jalankan apabila papan pendahulu dipaparkan, bukan setiap bingkai. Purata daripada senarai ialah O(k); jumlah larian menjadikannya O(1).', 'Updating a record is O(1). The server summary is O(n) to iterate and O(n log n) to sort — run it when the leaderboard is shown, not every frame. An average from a list is O(k); running totals make it O(1).')),
    S('software_engineering',
      P('Penulisan bertaburan berbanding modul statistik:', 'Scattered writes versus a statistics module:'),
      CODE('poor-scattered-writes', 'luau', 'luau', ['Pelaksanaan lemah: penulisan bertaburan', 'Poor implementation: scattered writes'], `
local stats = {kills = 0, streak = 0, bestStreak = 0}
stats.kills += 1
stats.streak += 1
stats.kills += 1
stats.streak += 1
stats.bestStreak = 1
print(stats.kills, stats.streak, stats.bestStreak)
`, '2\t2\t1'),
      EXPLAIN('poor-scattered-writes',
        ['1–5', 'Setiap tempat mengemas kini medan secara manual.', 'Every place updates fields by hand.'],
        ['6–7', 'Satu tempat menetapkan `bestStreak` secara salah — kini 1 walaupun rentetan ialah 2.', 'One place sets `bestStreak` wrongly — now 1 although the streak is 2.']),
      CODE('improved-stats-module', 'luau', 'luau', ['Pelaksanaan lebih baik: fungsi kemas kini', 'Improved implementation: update functions'], `
local function newStreakStats()
  return {kills = 0, streak = 0, bestStreak = 0}
end
local function onKill(s)
  s.kills += 1
  s.streak += 1
  s.bestStreak = math.max(s.bestStreak, s.streak)
end
local function onDeath(s) s.streak = 0 end

local s = newStreakStats()
onKill(s); onKill(s); onDeath(s); onKill(s)
print(s.kills, s.streak, s.bestStreak)
`, '3\t1\t2'),
      EXPLAIN('improved-stats-module',
        ['1–9', 'Peraturan "rentetan terbaik" berada di satu tempat sahaja.', 'The "best streak" rule lives in one place only.'],
        ['11–13', 'Dua bunuh, mati, satu bunuh: rentetan 1, terbaik 2.', 'Two kills, a death, one kill: streak 1, best 2.'])),
    S('industry_use_cases',
      UL(
        ['`leaderstats` Roblox memaparkan statistik asas; nilai terbitan dikira untuk UI.', 'Roblox `leaderstats` shows base statistics; derived values are computed for the UI.'],
        ['Data analitik direkodkan sebagai jumlah larian untuk menjimatkan memori dan storan.', 'Analytics data is recorded as running totals to save memory and storage.'],
        ['Sistem pencapaian mendengar fungsi kemas kini statistik (callback, LUAU103).', 'Achievement systems listen to statistics update functions (callbacks, LUAU103).'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah `assists` pada `Stats` dan kemas kini `recordRound` serta `kda`.', 'Add `assists` to `Stats` and update `recordRound` and `kda`.'],
        ['Isih `server-summary` mengikut KDA dan bukannya bunuh.', 'Sort `server-summary` by KDA instead of kills.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Laporan sesi.** Daftar pemain secara automatik pada peristiwa pertama mereka, mainkan senarai peristiwa, kemudian cetak laporan dengan KDA dan rentetan terbaik.', '**A session report.** Register players automatically on their first event, replay an event list, then print a report with KDA and best streak.'),
      CODE('session-report', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local players = {}
local function get(name: string)
  local s = players[name]
  if s == nil then
    s = {kills = 0, deaths = 0, streak = 0, best = 0}
    players[name] = s
  end
  return s
end

local events = {{"Aina", "Ben"}, {"Aina", "Chen"}, {"Ben", "Aina"}, {"Chen", "Ben"}, {"Aina", "Ben"}}
for _, e in events do
  local killer, victim = get(e[1]), get(e[2])
  killer.kills += 1
  killer.streak += 1
  killer.best = math.max(killer.best, killer.streak)
  victim.deaths += 1
  victim.streak = 0
end

local names = {}
for name in players do table.insert(names, name) end
table.sort(names)
for _, name in names do
  local s = players[name]
  local ratio = if s.deaths == 0 then s.kills else s.kills / s.deaths
  print(\`{name}: {s.kills}/{s.deaths} kda={ratio} best={s.best}\`)
end
`, 'Aina: 3/1 kda=3 best=2\nBen: 1/3 kda=0.3333333333333333 best=1\nChen: 1/1 kda=1 best=1'),
      EXPLAIN('session-report',
        ['1–9', '`get` mendaftar pemain semasa peristiwa pertama — tiada `attempt to index nil`.', '`get` registers a player on their first event — no `attempt to index nil`.'],
        ['11–19', 'Setiap peristiwa (pembunuh, mangsa) mengemas kini kedua-dua rekod; kematian menetapkan semula rentetan.', 'Each event (killer, victim) updates both records; a death resets the streak.'],
        ['21–27', 'Nama diisih; KDA dengan pengawal kematian sifar.', 'Sorted names; KDA with a zero-death guard.'])),
    S('summary',
      UL(
        ['Rekod dengan jenis dan pembina; setiap pemain table sendiri.', 'Records with a type and a constructor; each player their own table.'],
        ['Kemas kini melalui fungsi; peraturan di satu tempat.', 'Update through functions; rules in one place.'],
        ['Kira nilai terbitan dengan pengawal pembahagian sifar (`inf`, `nan`).', 'Compute derived values with zero-division guards (`inf`, `nan`).'],
        ['Agregat dengan lelaran dan pengisihan untuk output yang stabil.', 'Aggregate with iteration and sorting for stable output.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah hasil `5 / 0` dan `0 / 0` dalam Luau?', 'What are `5 / 0` and `0 / 0` in Luau?'],
        ['Mengapakah KDA dikira dan bukan disimpan?', 'Why is KDA computed rather than stored?'],
        ['Bagaimanakah anda mengesan NaN?', 'How do you detect NaN?'],
        ['Apakah kelebihan dan kekurangan jumlah larian?', 'What are the advantages and drawbacks of running totals?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — In-experience leaderboards', url: `${DOCS}/players/leaderboards` },
        { title: 'Luau — Type checking: tables', url: `${LUAU}/typecheck#table-types` },
        { title: 'Roblox Creator Hub — Numbers (inf and nan)', url: `${DOCS}/luau/numbers` },
        { title: 'Wikipedia — NaN', url: 'https://en.wikipedia.org/wiki/NaN' },
      )),
  ],
};

// ─── 4.2 Game configuration data ───────────────────────────────────────────

export const LUAU104_4_2: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 4,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Memusatkan nilai permainan dalam table konfigurasi yang [[frozen-table|beku]].', 'Centralise game values in a [[frozen-table|frozen]] configuration table.'],
        ['Mengesahkan konfigurasi semasa dimuatkan (jenis, julat, kunci yang diperlukan).', 'Validate configuration at load time (types, ranges, required keys).'],
        ['Menggabungkan tetapan mod (kesukaran) dengan nilai asas.', 'Merge mode settings (difficulty) with base values.'],
        ['Mengelak "nombor ajaib" yang bertaburan dalam kod.', 'Avoid "magic numbers" scattered through code.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.2–3.3: `table.clone`, gabungan dan `table.freeze`.', 'Lectures 3.2–3.3: `table.clone`, merging and `table.freeze`.'],
        ['Kuliah 4.1: rekod dengan jenis.', 'Lecture 4.1: typed records.'],
      )),
    S('introduction',
      P('Berapa lama satu pusingan? Berapa banyak syiling untuk bunuh? Berapa laju musuh pada mod sukar? Jika nombor ini bertaburan dalam berpuluh-puluh skrip, menukar keseimbangan permainan menjadi pemburuan yang berisiko. Amalan standard dalam permainan Roblox ialah **table konfigurasi**: satu tempat untuk semua nilai yang boleh dilaraskan, biasanya dalam ModuleScript. Kuliah ini membina konfigurasi yang beku (supaya tiada skrip mengubahnya secara tidak sengaja), disahkan semasa dimuatkan (supaya salah taip ditangkap awal), dan menyokong variasi seperti tahap kesukaran.',
        'How long is a round? How many coins for a kill? How fast are enemies on hard mode? If these numbers are scattered through dozens of scripts, changing the game balance becomes a risky hunt. The standard practice in Roblox games is a **configuration table**: one place for every tunable value, usually in a ModuleScript. This lecture builds a configuration that is frozen (so no script changes it by accident), validated when loaded (so typos are caught early), and supports variations such as difficulty levels.'),
      KEY('Satu sumber kebenaran: konfigurasi beku, disahkan sekali, dibaca di mana-mana.', 'One source of truth: a frozen configuration, validated once, read everywhere.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Nombor ajaib:** literal tanpa nama dalam kod (`if hp < 25`) — sukar dicari dan ditukar.', '**Magic number:** an unnamed literal in code (`if hp < 25`) — hard to find and change.'],
        ['**Konfigurasi:** table bernama `CONFIG` dengan semua nilai boleh laras.', '**Configuration:** a named `CONFIG` table with every tunable value.'],
        ['**Pengesahan:** semak jenis dan julat sekali, dengan mesej yang menyebut kunci.', '**Validation:** check types and ranges once, with messages naming the key.'],
        ['**Lapisan:** asas + tindih mod (kesukaran) → konfigurasi berkesan.', '**Layers:** base + mode overrides (difficulty) → the effective configuration.'],
      )),
    S('detailed_theory',
      P('Konfigurasi ialah data, bukan logik: table dictionary (sering bersarang) yang dibaca oleh sistem permainan. Membacanya mengikut nama (`CONFIG.round.seconds`) menjadikan kod mendokumenkan dirinya sendiri. Masalahnya ialah konfigurasi yang salah gagal **secara senyap**: kunci yang tersalah eja memberi `nil`, dan ralat muncul jauh kemudian — `attempt to perform arithmetic on nil` dalam sistem yang tiada kaitan dengan fail konfigurasi. Oleh itu, sahkan konfigurasi sekali semasa dimuatkan: setiap kunci yang diperlukan wujud, setiap nilai jenis yang betul, setiap nombor dalam julat yang munasabah. Jika ada masalah, gagal awal dengan mesej yang menyebut laluan.',
        'Configuration is data, not logic: a dictionary table (often nested) read by the game systems. Reading it by name (`CONFIG.round.seconds`) makes the code document itself. The problem is that a wrong configuration fails **silently**: a misspelt key gives `nil`, and the error appears much later — `attempt to perform arithmetic on nil` in a system that has nothing to do with the configuration file. So validate the configuration once when it is loaded: every required key exists, every value has the right type, every number is in a sensible range. If there is a problem, fail early with a message naming the path.'),
      P('Selepas pengesahan, bekukan konfigurasi secara dalam (kuliah 3.3) supaya tiada sistem boleh mengubahnya — perubahan semasa permainan (contohnya kelajuan buff) milik keadaan pemain, bukan konfigurasi. Variasi seperti tahap kesukaran dimodelkan sebagai **lapisan**: konfigurasi asas ditambah table tindih bagi setiap mod; gabungan (kuliah 3.2) menghasilkan konfigurasi berkesan yang juga dibekukan. Ini mengelakkan salinan berganda bagi setiap mod dan menjamin bahawa nilai yang tidak ditindih datang dari asas. Mod yang tidak wujud patut dikesan dengan mesej yang jelas, bukan `attempt to index nil`.',
        'After validation, deep-freeze the configuration (lecture 3.3) so no system can change it — changes during play (for example a speed buff) belong to player state, not configuration. Variations such as difficulty levels are modelled as **layers**: the base configuration plus an override table per mode; merging (lecture 3.2) produces an effective configuration that is frozen too. This avoids duplicate copies per mode and guarantees that values not overridden come from the base. A mode that does not exist should be detected with a clear message, not `attempt to index nil`.')),
    S('technical_terminology', TERMS('frozen-table', 'dictionary', 'guard-clause', 'module')),
    S('syntax_rules',
      UL(
        ['`local CONFIG = table.freeze({round = table.freeze({seconds = 120})})`.', '`local CONFIG = table.freeze({round = table.freeze({seconds = 120})})`.'],
        ['Peraturan pengesahan sebagai data: `{path = "round.seconds", kind = "number", min = 10, max = 600}`.', 'Validation rules as data: `{path = "round.seconds", kind = "number", min = 10, max = 600}`.'],
        ['Lapisan: `local effective = deepFreeze(merge(BASE, OVERRIDES[mode]))`.', 'Layers: `local effective = deepFreeze(merge(BASE, OVERRIDES[mode]))`.'],
      )),
    S('code_demonstration',
      CODE('config-basic', 'luau', 'luau', ['Konfigurasi beku dan penggunaannya', 'A frozen configuration and its use'], `
local CONFIG = table.freeze({
  round = table.freeze({seconds = 120, minPlayers = 2}),
  rewards = table.freeze({kill = 10, win = 50, participation = 5}),
})

local function roundReward(kills: number, won: boolean): number
  local r = CONFIG.rewards
  return r.participation + kills * r.kill + (if won then r.win else 0)
end

print(roundReward(3, true), roundReward(0, false))
print(CONFIG.round.seconds // 60, "minutes")
print(pcall(function() CONFIG.rewards.kill = 1000 end))
`, '85\t5\n2\tminutes\nfalse\texample:13: attempt to modify a readonly table'),
      EXPLAIN('config-basic',
        ['1–4', 'Semua nilai boleh laras di satu tempat, beku pada setiap tahap.', 'Every tunable value in one place, frozen at every level.'],
        ['6–9', 'Logik membaca konfigurasi mengikut nama — tiada nombor ajaib.', 'Logic reads the configuration by name — no magic numbers.'],
        ['11–13', '5 + 30 + 50 = 85; 120 // 60 = 2; penulisan ke konfigurasi ditolak.', '5 + 30 + 50 = 85; 120 // 60 = 2; a write to the configuration is rejected.'])),
    S('complete_examples',
      CODE('config-validate', 'luau', 'luau', ['Mengesahkan konfigurasi', 'Validating a configuration'], `
type Rule = {path: string, kind: string, min: number?, max: number?}

local RULES: {Rule} = {
  {path = "round.seconds", kind = "number", min = 10, max = 600},
  {path = "round.minPlayers", kind = "number", min = 1, max = 50},
  {path = "rewards.kill", kind = "number", min = 0},
  {path = "mapName", kind = "string"},
}

local function lookup(root: any, path: string): any
  local current = root
  for part in path:gmatch("[^%.]+") do
    if type(current) ~= "table" then return nil end
    current = current[part]
  end
  return current
end

local function validate(config): {string}
  local problems = {}
  for _, rule in RULES do
    local value = lookup(config, rule.path)
    if typeof(value) ~= rule.kind then
      table.insert(problems, \`{rule.path}: expected {rule.kind}, got {typeof(value)}\`)
    elseif rule.min and value < rule.min then
      table.insert(problems, \`{rule.path}: {value} is below {rule.min}\`)
    elseif rule.max and value > rule.max then
      table.insert(problems, \`{rule.path}: {value} is above {rule.max}\`)
    end
  end
  return problems
end

local draft = {round = {seconds = 5, minplayers = 2}, rewards = {kill = 10}, mapName = "Docks"}
for _, p in validate(draft) do print(p) end
`, 'round.seconds: 5 is below 10\nround.minPlayers: expected number, got nil', {
        debug: BUG(`
local CONFIG = {round = {seconds = 120}, rewards = {kil = 10}}
local function rewardFor(kills: number): number
  return kills * CONFIG.rewards.kill
end
print(rewardFor(3))
`, 'example:3: attempt to perform arithmetic (mul) on number and nil',
          'Konfigurasi mempunyai salah taip (`kil`), jadi `CONFIG.rewards.kill` ialah `nil` dan ralat muncul dalam `rewardFor`, bukan di fail konfigurasi. Dalam permainan sebenar, ini mungkin hanya berlaku apabila pemain pertama membunuh. Pengesahan semasa dimuatkan (`config-validate`) menangkapnya serta-merta dengan laluan yang tepat.',
          'The configuration has a typo (`kil`), so `CONFIG.rewards.kill` is `nil` and the error appears in `rewardFor`, not in the configuration file. In a real game this might only happen when the first player gets a kill. Validation at load time (`config-validate`) catches it immediately with the exact path.'),
      }),
      EXPLAIN('config-validate',
        ['1–8', 'Peraturan sebagai data: laluan, jenis yang dijangka dan julat pilihan.', 'Rules as data: a path, the expected type and an optional range.'],
        ['10–17', '`lookup` memecahkan "a.b" dengan `gmatch` dan berjalan tahap demi tahap dengan selamat.', '`lookup` splits "a.b" with `gmatch` and walks level by level safely.'],
        ['19–32', 'Semak jenis dahulu, kemudian julat (kuliah LUAU103 1.3); kumpul semua masalah.', 'Check the type first, then the range (lecture LUAU103 1.3); collect every problem.'],
        ['34–35', 'Draf mempunyai dua masalah: masa terlalu pendek dan `minplayers` tersalah huruf.', 'The draft has two problems: the time is too short and `minplayers` has the wrong case.']),
      CODE('difficulty-layers', 'luau', 'luau', ['Lapisan kesukaran', 'Difficulty layers'], `
local BASE = {enemy = {hp = 100, speed = 12, damage = 8}, lives = 3}
local OVERRIDES = {
  easy = {enemy = {damage = 4}, lives = 5},
  hard = {enemy = {hp = 150, speed = 16}, lives = 1},
}

local function merge(base, over)
  local out = table.clone(base)
  for k, v in over do
    out[k] = if type(v) == "table" and type(out[k]) == "table" then merge(out[k], v) else v
  end
  return out
end

local function configFor(mode: string)
  local over = OVERRIDES[mode]
  if over == nil then
    error(\`unknown difficulty '{mode}'\`, 2)
  end
  return merge(BASE, over)
end

local hard = configFor("hard")
print(hard.enemy.hp, hard.enemy.speed, hard.enemy.damage, hard.lives)
print(BASE.enemy.hp, configFor("easy").enemy.damage)
print(pcall(configFor, "nightmare"))
`, '150\t16\t8\t1\n100\t4\nfalse\tunknown difficulty \'nightmare\'', {
        debug: BUG(`
local OVERRIDES = {easy = {lives = 5}, hard = {lives = 1}}
local mode = "Hard"
local lives = OVERRIDES[mode].lives
print(lives)
`, 'example:3: attempt to index nil with \'lives\'',
          'Kunci mod ialah "hard" (huruf kecil), tetapi pemboleh ubah ialah "Hard". `OVERRIDES["Hard"]` ialah `nil`, dan ralat menyebut `\'lives\'`, bukan mod. Sahkan nama mod dengan mesej yang jelas (seperti `configFor`), atau normalkan input dengan `mode:lower()`.',
          'The mode key is "hard" (lowercase), but the variable is "Hard". `OVERRIDES["Hard"]` is `nil`, and the error names `\'lives\'`, not the mode. Validate the mode name with a clear message (as `configFor` does), or normalise the input with `mode:lower()`.'),
      }),
      EXPLAIN('difficulty-layers',
        ['1–5', 'Asas dan tindih kecil bagi setiap mod — hanya nilai yang berbeza.', 'A base and small overrides per mode — only the values that differ.'],
        ['7–13', 'Gabungan rekursif (kuliah 3.2) tanpa mengubah asas.', 'A recursive merge (lecture 3.2) without changing the base.'],
        ['15–21', 'Mod yang tidak diketahui → ralat yang jelas, dilaporkan pada pemanggil (`error(…, 2)`).', 'An unknown mode → a clear error, reported at the caller (`error(…, 2)`).'],
        ['23–26', 'Hard: hp dan speed ditindih, damage dari asas. Asas tidak berubah. "nightmare" ditolak.', 'Hard: hp and speed overridden, damage from the base. The base is unchanged. "nightmare" is rejected.'])),
    S('line_by_line',
      EXPLAIN('config-validate',
        ['12', '`path:gmatch("[^%.]+")` memberi setiap bahagian antara titik: "round", kemudian "seconds".', '`path:gmatch("[^%.]+")` yields each part between dots: "round", then "seconds".']),
      EXPLAIN('difficulty-layers',
        ['18', '`error(mesej, 2)` menyalahkan pemanggil `configFor` — di situlah nama mod yang salah datang.', '`error(message, 2)` blames the caller of `configFor` — that is where the wrong mode name came from.'])),
    S('why_this_way',
      P('Mengapa satu table konfigurasi? Kerana pereka permainan boleh melaraskan keseimbangan tanpa membaca logik, dan setiap nilai mempunyai satu tempat. Mengapa mengesahkan dan bukan sekadar membekukan? Kerana pembekuan menghalang perubahan, tetapi tidak membuktikan nilai itu betul. Mengapa lapisan? Kerana menyalin keseluruhan konfigurasi bagi setiap mod bermakna setiap perubahan asas mesti diulang.',
        'Why one configuration table? Because game designers can tune the balance without reading logic, and every value has one home. Why validate and not just freeze? Because freezing prevents change, but does not prove the values are right. Why layers? Because copying the whole configuration per mode means every base change must be repeated.'),
      P('Letakkan nilai dalam konfigurasi **apabila** ia mungkin dilaraskan; sahkan **apabila** konfigurasi dimuatkan atau ditukar; gunakan lapisan **apabila** beberapa variasi berkongsi kebanyakan nilai.', 'Put a value in the configuration **when** it might be tuned; validate **when** the configuration is loaded or changed; use layers **when** several variations share most values.')),
    S('execution_flow',
      OL(
        ['Konfigurasi dibina dan dibekukan semasa skrip dimuatkan.', 'The configuration is built and frozen when the script loads.'],
        ['Pengesahan berjalan sekali; masalah dilaporkan sebelum permainan bermula.', 'Validation runs once; problems are reported before play starts.'],
        ['Untuk setiap pusingan, `configFor(mode)` menggabungkan asas dan tindih.', 'For each round, `configFor(mode)` merges the base and the overrides.'],
        ['Sistem permainan membaca konfigurasi berkesan mengikut nama.', 'Game systems read the effective configuration by name.'],
      )),
    S('memory_behaviour',
      P('Konfigurasi beku dikongsi oleh setiap sistem melalui rujukan — satu salinan dalam memori. Gabungan mencipta table baharu bagi setiap tahap yang ditindih; untuk mengelak gabungan berulang, cache konfigurasi berkesan bagi setiap mod (dan bekukannya) kerana mod jarang bertukar.', 'A frozen configuration is shared by every system through references — one copy in memory. Merging creates new tables for each overridden level; to avoid repeated merges, cache the effective configuration per mode (and freeze it) since modes rarely change.')),
    S('alternative_implementations',
      P('Cache konfigurasi berkesan supaya setiap mod digabungkan sekali sahaja:', 'Cache effective configurations so each mode is merged only once:'),
      CODE('config-cache', 'luau', 'luau', ['Cache konfigurasi mengikut mod', 'Caching configuration by mode'], `
local BASE = {spawnRate = 1.0, bossHp = 500}
local MODES = {party = {spawnRate = 2.0}, raid = {bossHp = 2000}}
local cache = {}
local builds = 0

local function effective(mode: string)
  if cache[mode] == nil then
    builds += 1
    local cfg = table.clone(BASE)
    for k, v in MODES[mode] or {} do cfg[k] = v end
    cache[mode] = table.freeze(cfg)
  end
  return cache[mode]
end

print(effective("raid").bossHp, effective("raid").spawnRate, effective("party").spawnRate)
print("builds:", builds, effective("raid") == effective("raid"))
`, '2000\t1\t2\nbuilds:\t2\ttrue'),
      EXPLAIN('config-cache',
        ['1–4', 'Konfigurasi rata (satu tahap) dan cache kosong.', 'A flat (one-level) configuration and an empty cache.'],
        ['6–14', 'Bina hanya pada permintaan pertama bagi setiap mod; bekukan sebelum disimpan.', 'Build only on the first request per mode; freeze before caching.'],
        ['16–17', 'Tiga bacaan, dua binaan; panggilan berulang memulangkan table yang sama.', 'Three reads, two builds; repeated calls return the same table.'])),
    S('common_mistakes',
      UL(
        ['Nombor ajaib yang disalin dalam beberapa skrip.', 'Magic numbers copied in several scripts.'],
        ['Konfigurasi tidak disahkan — salah taip ditemui semasa permainan.', 'An unvalidated configuration — typos found during play.'],
        ['Mengubah konfigurasi untuk keadaan sementara (buff) dan bukannya keadaan pemain.', 'Changing the configuration for temporary state (buffs) instead of player state.'],
        ['Menyalin seluruh konfigurasi bagi setiap mod.', 'Copying the whole configuration for every mode.'],
      )),
    S('debugging',
      P('Apabila nilai konfigurasi kelihatan diabaikan, cetak konfigurasi berkesan (kunci diisih) dan bandingkan dengan yang dijangka. Apabila `attempt to … nil` muncul dalam logik yang membaca `CONFIG`, jalankan pengesahan — kemungkinan besar kunci tersalah eja. Fungsi ini mencetak konfigurasi bersarang secara rata untuk perbandingan mudah:',
        'When a configuration value seems ignored, print the effective configuration (sorted keys) and compare it with what you expected. When `attempt to … nil` appears in logic that reads `CONFIG`, run the validation — most likely a key is misspelt. This function prints a nested configuration flat for easy comparison:'),
      CODE('config-dump', 'luau', 'luau', ['Mencetak konfigurasi secara rata', 'Printing a configuration flat'], `
local function flatten(t: {[string]: any}, prefix: string, out: {string}): {string}
  for k, v in t do
    local path = if prefix == "" then k else \`{prefix}.{k}\`
    if type(v) == "table" then
      flatten(v, path, out)
    else
      table.insert(out, \`{path}={v}\`)
    end
  end
  return out
end

local cfg = {lives = 1, enemy = {hp = 150, speed = 16}}
local lines = flatten(cfg, "", {})
table.sort(lines)
print(table.concat(lines, "\\n"))
`, 'enemy.hp=150\nenemy.speed=16\nlives=1'),
      EXPLAIN('config-dump',
        ['1–11', 'Lawati setiap tahap; tulis setiap daun sebagai "laluan=nilai".', 'Visit every level; write each leaf as "path=value".'],
        ['13–16', 'Isih untuk perbandingan yang stabil antara dua konfigurasi.', 'Sort for a stable comparison between two configurations.'])),
    S('performance',
      P('Membaca konfigurasi ialah satu atau dua carian table — boleh diabaikan. Dalam gelung panas, simpan sub-table dalam local (`local rewards = CONFIG.rewards`). Pengesahan dan gabungan berlaku sekali semasa dimuatkan atau apabila mod bertukar, jadi kosnya tidak penting.', 'Reading the configuration is one or two table lookups — negligible. In hot loops, store a sub-table in a local (`local rewards = CONFIG.rewards`). Validation and merging happen once at load time or when the mode changes, so their cost does not matter.')),
    S('software_engineering',
      P('Nombor ajaib berbanding konfigurasi bernama:', 'Magic numbers versus a named configuration:'),
      CODE('poor-magic-numbers', 'luau', 'luau', ['Pelaksanaan lemah: nombor ajaib', 'Poor implementation: magic numbers'], `
local function canStart(players: number): boolean return players >= 2 end
local function lowHealth(hp: number): boolean return hp < 25 end
local function startWarning(players: number): string
  return \`need {2 - players} more player(s)\`
end
print(canStart(1), lowHealth(30), startWarning(1))
`, 'false\tfalse\tneed 1 more player(s)'),
      EXPLAIN('poor-magic-numbers',
        ['1–5', '"2" muncul dua kali; menukar pemain minimum memerlukan mencari setiap satu.', '"2" appears twice; changing the minimum players means finding every copy.'],
        ['6', 'Berfungsi — sehingga seseorang menukar satu "2" sahaja.', 'It works — until someone changes only one "2".']),
      CODE('improved-named-config', 'luau', 'luau', ['Pelaksanaan lebih baik: konfigurasi bernama', 'Improved implementation: a named configuration'], `
local RULES = table.freeze({minPlayers = 3, lowHealth = 25})
local function canStart(players: number): boolean return players >= RULES.minPlayers end
local function lowHealth(hp: number): boolean return hp < RULES.lowHealth end
local function startWarning(players: number): string
  return \`need {RULES.minPlayers - players} more player(s)\`
end
print(canStart(1), lowHealth(30), startWarning(1))
`, 'false\tfalse\tneed 2 more player(s)'),
      EXPLAIN('improved-named-config',
        ['1–5', 'Satu nilai bernama; menukar minimum kepada 3 mengemas kini kedua-dua fungsi.', 'One named value; changing the minimum to 3 updates both functions.'],
        ['6–7', 'Mesej kekal betul secara automatik.', 'The message stays correct automatically.'])),
    S('industry_use_cases',
      UL(
        ['ModuleScript `Config` dalam ReplicatedStorage dikongsi oleh pelayan dan klien.', 'A `Config` ModuleScript in ReplicatedStorage is shared by server and client.'],
        ['Acara bermusim menggunakan lapisan tindih dan bukannya menyalin konfigurasi.', 'Seasonal events use override layers instead of copying the configuration.'],
        ['Pengesahan konfigurasi dijalankan dalam ujian automatik sebelum diterbitkan.', 'Configuration validation runs in automated tests before publishing.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah peraturan untuk `rewards.win` dalam `config-validate`.', 'Add a rule for `rewards.win` in `config-validate`.'],
        ['Tambah mod "endless" dalam `difficulty-layers` dengan `lives = math.huge`.', 'Add an "endless" mode in `difficulty-layers` with `lives = math.huge`.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Pemuat konfigurasi lengkap.** Gabungkan asas dan mod, sahkan hasilnya, bekukan secara dalam jika sah, atau pulangkan senarai masalah.', '**A complete configuration loader.** Merge the base and a mode, validate the result, deep-freeze it if valid, or return a list of problems.'),
      CODE('config-loader', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local BASE = {round = {seconds = 120}, lives = 3}
local MODES = {blitz = {round = {seconds = 45}}, broken = {lives = -2}}

local function deepFreeze(t)
  for _, v in t do
    if type(v) == "table" and not table.isfrozen(v) then deepFreeze(v) end
  end
  return table.freeze(t)
end

local function load(mode: string): (any, {string})
  local cfg = table.clone(BASE)
  cfg.round = table.clone(BASE.round)
  local over = MODES[mode] or {}
  if over.round then cfg.round.seconds = over.round.seconds end
  if over.lives then cfg.lives = over.lives end

  local problems = {}
  if cfg.round.seconds < 30 then table.insert(problems, "round.seconds < 30") end
  if cfg.lives < 1 then table.insert(problems, \`lives must be >= 1, got {cfg.lives}\`) end
  if #problems > 0 then return nil, problems end
  return deepFreeze(cfg), problems
end

local blitz = load("blitz")
print(blitz.round.seconds, blitz.lives, table.isfrozen(blitz.round))
local bad, problems = load("broken")
print(bad, problems[1])
`, '45\t3\ttrue\nnil\tlives must be >= 1, got -2'),
      EXPLAIN('config-loader',
        ['1–2', 'Asas dan dua mod; satu mod mempunyai nilai tidak sah.', 'A base and two modes; one mode has an invalid value.'],
        ['4–9', 'Pembekuan dalam dengan semakan `isfrozen`.', 'A deep freeze with an `isfrozen` check.'],
        ['11–23', 'Klon tahap yang akan berubah, guna tindih, sahkan, kemudian bekukan atau pulangkan masalah.', 'Clone the levels that will change, apply overrides, validate, then freeze or return problems.'],
        ['25–28', 'Blitz dimuatkan dan beku; "broken" ditolak dengan sebab yang jelas.', 'Blitz loads and is frozen; "broken" is rejected with a clear reason.'])),
    S('summary',
      UL(
        ['Satu table konfigurasi menggantikan nombor ajaib yang bertaburan.', 'One configuration table replaces scattered magic numbers.'],
        ['Sahkan sekali semasa dimuatkan: kunci, jenis, julat.', 'Validate once at load time: keys, types, ranges.'],
        ['Bekukan secara dalam supaya tiada sistem mengubahnya.', 'Deep-freeze it so no system changes it.'],
        ['Variasi sebagai lapisan tindih yang digabungkan dengan asas.', 'Variations as override layers merged with the base.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah "nombor ajaib" dan mengapa ia bermasalah?', 'What is a "magic number" and why is it a problem?'],
        ['Mengapakah salah taip dalam konfigurasi sukar dikesan tanpa pengesahan?', 'Why is a typo in a configuration hard to detect without validation?'],
        ['Mengapakah buff sementara tidak patut mengubah konfigurasi?', 'Why should a temporary buff not change the configuration?'],
        ['Apakah kelebihan lapisan tindih berbanding salinan penuh bagi setiap mod?', 'What is the advantage of override layers over full copies per mode?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — ModuleScripts', url: `${DOCS}/reference/engine/classes/ModuleScript` },
        { title: 'Luau — Library: table.freeze', url: `${LUAU}/library#table-library` },
        { title: 'Luau — Library: string.gmatch', url: `${LUAU}/library#string-library` },
        { title: 'Wikipedia — Magic number (programming)', url: 'https://en.wikipedia.org/wiki/Magic_number_(programming)' },
      )),
  ],
};

// ─── 4.3 Mini project: an inventory in pure Luau ───────────────────────────

export const LUAU104_4_3: LectureContentDef = {
  courseCode: 'LUAU104',
  module: 4,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Mereka bentuk dan membina sistem inventori lengkap dengan [[array]], [[dictionary]] dan [[frozen-table|katalog beku]].', 'Design and build a complete inventory system with [[array|arrays]], [[dictionary|dictionaries]] and a [[frozen-table|frozen catalogue]].'],
        ['Melaksanakan susunan (stacking), had slot dan pembuangan dengan pengesahan.', 'Implement stacking, slot limits and removal with validation.'],
        ['Mengelak pepijat rujukan dengan salinan pertahanan.', 'Avoid reference bugs with defensive copies.'],
        ['Menguji setiap keperluan dengan `assert`.', 'Test every requirement with `assert`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Semua kuliah LUAU104, dan closure serta ujian `assert` dari LUAU103 4.3.', 'All LUAU104 lectures, plus closures and `assert` tests from LUAU103 4.3.'],
      )),
    S('introduction',
      P('Projek mini ini (90 minit) membina sistem yang wujud dalam hampir setiap permainan Roblox: **inventori**. Ia menggunakan setiap bentuk table dari kursus ini — katalog item sebagai dictionary beku, slot sebagai array, kiraan sebagai dictionary — dan setiap pelajaran tentang rujukan: inventori tidak boleh mendedahkan table dalamannya, kerana pemanggil boleh mengubahnya tanpa melalui peraturan. Kita mulakan dengan keperluan, reka API, bina secara berperingkat, dan uji setiap keperluan.',
        'This mini project (90 minutes) builds a system found in almost every Roblox game: an **inventory**. It uses every table shape from this course — the item catalogue as a frozen dictionary, slots as an array, counts as a dictionary — and every lesson about references: the inventory must not expose its internal tables, because callers could change them without going through the rules. We start with requirements, design the API, build step by step, and test every requirement.'),
      KEY('Katalog beku + slot peribadi + API dengan pengesahan + salinan apabila mendedahkan data.', 'A frozen catalogue + private slots + an API with validation + copies when exposing data.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**R1:** `add(id, n)` menyusun item ke slot sedia ada sehingga `maxStack`, kemudian slot baharu.', '**R1:** `add(id, n)` stacks items into existing slots up to `maxStack`, then new slots.'],
        ['**R2:** bilangan slot terhad; item berlebihan dipulangkan sebagai "tidak muat".', '**R2:** the number of slots is limited; overflow items are returned as "did not fit".'],
        ['**R3:** `remove(id, n)` gagal dengan `nil, mesej` jika tidak cukup — tiada perubahan separa.', '**R3:** `remove(id, n)` fails with `nil, message` if there are not enough — no partial change.'],
        ['**R4:** `count(id)` dan `list()`; `list()` memulangkan salinan.', '**R4:** `count(id)` and `list()`; `list()` returns a copy.'],
        ['**R5:** item yang tidak ada dalam katalog ditolak.', '**R5:** items not in the catalogue are rejected.'],
      )),
    S('detailed_theory',
      P('Reka bentuk bermula dengan data. **Katalog** ialah dictionary beku `id → {name, maxStack}` — pemalar yang dikongsi (kuliah 3.3, 4.2). **Slot** ialah array table kecil `{id = "arrow", count = 40}`; array kerana susunan slot penting untuk UI. Inventori dicipta oleh kilang (closure, LUAU103) supaya slot ialah upvalue peribadi. Penambahan dilakukan dalam dua laluan: mula-mula isi slot sedia ada dengan ID yang sama sehingga `maxStack`, kemudian buka slot baharu selagi had slot belum dicapai; apa-apa yang masih tinggal dipulangkan supaya pemanggil boleh menjatuhkannya ke tanah atau memaparkan mesej.',
        'The design starts with the data. The **catalogue** is a frozen `id → {name, maxStack}` dictionary — a shared constant (lectures 3.3, 4.2). The **slots** are an array of small tables `{id = "arrow", count = 40}`; an array because slot order matters for the UI. The inventory is created by a factory (closures, LUAU103) so the slots are a private upvalue. Adding happens in two passes: first fill existing slots with the same ID up to `maxStack`, then open new slots while the slot limit has not been reached; whatever is still left over is returned so the caller can drop it on the ground or show a message.'),
      P('Pembuangan mesti **atomik**: semak dahulu bahawa jumlah cukup, dan hanya kemudian ubah slot — jika tidak, kegagalan separuh jalan meninggalkan inventori dalam keadaan rosak. Slot dikosongkan dibuang dengan gelung ke belakang (kuliah 1.2). Untuk mendedahkan isi kepada UI, `list()` memulangkan **salinan** setiap slot (kuliah 3.2); jika ia memulangkan table dalaman, kod UI boleh menulis `slot.count = 999` dan memintas setiap peraturan. Akhir sekali, setiap keperluan mempunyai ujian `assert`, dan ujian dijalankan semula selepas setiap perubahan.',
        'Removal must be **atomic**: first check that the total is enough, and only then change the slots — otherwise a failure halfway leaves the inventory in a broken state. Emptied slots are removed with a backwards loop (lecture 1.2). To expose the contents to the UI, `list()` returns a **copy** of each slot (lecture 3.2); if it returned the internal tables, UI code could write `slot.count = 999` and bypass every rule. Finally, every requirement has an `assert` test, and the tests are re-run after every change.')),
    S('technical_terminology', TERMS('array', 'dictionary', 'frozen-table', 'shallow-copy')),
    S('syntax_rules',
      UL(
        ['Katalog: `local CATALOG = table.freeze({arrow = table.freeze({name = "Arrow", maxStack = 50})})`.', 'Catalogue: `local CATALOG = table.freeze({arrow = table.freeze({name = "Arrow", maxStack = 50})})`.'],
        ['Slot: `type Slot = {id: string, count: number}`; `local slots: {Slot} = {}`.', 'Slots: `type Slot = {id: string, count: number}`; `local slots: {Slot} = {}`.'],
        ['API: `add(id, n) -> number` (baki), `remove(id, n) -> (boolean?, string?)`.', 'API: `add(id, n) -> number` (leftover), `remove(id, n) -> (boolean?, string?)`.'],
      )),
    S('code_demonstration',
      CODE('inv-add', 'luau', 'luau', ['Langkah 1: menambah dengan susunan dan had slot (R1, R2, R5)', 'Step 1: adding with stacking and a slot limit (R1, R2, R5)'], `
local CATALOG = table.freeze({
  arrow = table.freeze({name = "Arrow", maxStack = 50}),
  potion = table.freeze({name = "Potion", maxStack = 5}),
})

local function createInventory(maxSlots: number)
  local slots: {{id: string, count: number}} = {}

  local function add(id: string, amount: number): number
    local item = CATALOG[id]
    if item == nil then error(\`unknown item '{id}'\`, 2) end
    local left = amount
    for _, slot in slots do
      if slot.id == id and slot.count < item.maxStack then
        local moved = math.min(item.maxStack - slot.count, left)
        slot.count += moved
        left -= moved
      end
    end
    while left > 0 and #slots < maxSlots do
      local moved = math.min(item.maxStack, left)
      table.insert(slots, {id = id, count = moved})
      left -= moved
    end
    return left
  end

  local function describe(): string
    local parts = {}
    for _, s in slots do table.insert(parts, \`{s.id}x{s.count}\`) end
    return table.concat(parts, " ")
  end

  return {add = add, describe = describe}
end

local inv = createInventory(3)
print(inv.add("arrow", 70), inv.describe())
print(inv.add("potion", 8), inv.describe())
`, '0\tarrowx50 arrowx20\n3\tarrowx50 arrowx20 potionx5'),
      EXPLAIN('inv-add',
        ['1–4', 'Katalog beku pada setiap tahap.', 'A catalogue frozen at every level.'],
        ['6–7', 'Kilang; `slots` ialah upvalue peribadi.', 'A factory; `slots` is a private upvalue.'],
        ['9–11', 'R5: item yang tidak dikenali ditolak, dilaporkan pada pemanggil.', 'R5: unknown items are rejected, reported at the caller.'],
        ['12–19', 'Laluan 1: isi slot sedia ada sehingga `maxStack`.', 'Pass 1: fill existing slots up to `maxStack`.'],
        ['20–25', 'Laluan 2: slot baharu selagi had belum dicapai (R2); pulangkan baki.', 'Pass 2: new slots while the limit is not reached (R2); return the leftover.'],
        ['27–34', 'Penerangan ringkas untuk ujian; API mendedahkan fungsi sahaja.', 'A short description for testing; the API exposes functions only.'],
        ['36–39', '70 anak panah → 50 + 20. 8 ramuan: hanya satu slot tinggal, jadi 5 masuk dan 3 dipulangkan sebagai baki (R2).', '70 arrows → 50 + 20. 8 potions: only one slot is left, so 5 go in and 3 are returned as leftover (R2).'])),
    S('complete_examples',
      CODE('inv-remove', 'luau', 'luau', ['Langkah 2: pembuangan atomik (R3)', 'Step 2: atomic removal (R3)'], `
local slots = {{id = "arrow", count = 50}, {id = "potion", count = 3}, {id = "arrow", count = 20}}

local function count(id: string): number
  local total = 0
  for _, s in slots do
    if s.id == id then total += s.count end
  end
  return total
end

local function remove(id: string, amount: number): (boolean?, string?)
  local have = count(id)
  if amount > have then
    return nil, \`need {amount} {id}, have {have}\`
  end
  local left = amount
  for i = #slots, 1, -1 do
    local s = slots[i]
    if s.id == id and left > 0 then
      local taken = math.min(s.count, left)
      s.count -= taken
      left -= taken
      if s.count == 0 then table.remove(slots, i) end
    end
  end
  return true, nil
end

print(remove("arrow", 30), count("arrow"), #slots)
print(remove("potion", 9))
print(count("potion"), #slots)
`, 'true\t40\t2\nnil\tneed 9 potion, have 3\n3\t2', {
        debug: BUG(`
local CATALOG = table.freeze({arrow = {maxStack = 50}})
local function stackLimit(id: string): number
  return CATALOG[id].maxStack
end
print(stackLimit("arrow"), stackLimit("Arrow"))
`, 'example:3: attempt to index nil with \'maxStack\'',
          'ID katalog ialah "arrow"; "Arrow" (huruf besar) tiada, jadi `CATALOG["Arrow"]` ialah `nil` dan `.maxStack` gagal. Perhatikan `print` tidak mencetak apa-apa — ralat berlaku semasa menilai argumen kedua. Semak item terhadap katalog dengan mesej yang jelas (R5), seperti `add` dalam langkah 1.',
          'The catalogue ID is "arrow"; "Arrow" (capital A) is missing, so `CATALOG["Arrow"]` is `nil` and `.maxStack` fails. Notice that `print` prints nothing — the error happens while evaluating the second argument. Check items against the catalogue with a clear message (R5), as `add` does in step 1.'),
      }),
      EXPLAIN('inv-remove',
        ['1–9', 'Slot contoh dan `count` yang menjumlahkan semua slot dengan ID yang sama.', 'Sample slots and a `count` that totals every slot with the same ID.'],
        ['11–15', 'Semak dahulu: jika tidak cukup, pulangkan `nil, mesej` tanpa mengubah apa-apa (atomik).', 'Check first: if there are not enough, return `nil, message` without changing anything (atomic).'],
        ['16–26', 'Ambil dari slot terakhir dahulu; gelung ke belakang supaya `table.remove` selamat.', 'Take from the last slot first; a backwards loop so `table.remove` is safe.'],
        ['28–31', '30 anak panah: 20 dari slot terakhir (dibuang), 10 dari yang pertama → 40, 2 slot. Pada baris 29, `remove` bukan argumen terakhir, jadi hanya nilai pertamanya (`true`) dicetak (pelarasan nilai). 9 ramuan ditolak; ramuan kekal 3.', '30 arrows: 20 from the last slot (removed), 10 from the first → 40, 2 slots. On line 29 `remove` is not the last argument, so only its first value (`true`) is printed (value adjustment). 9 potions are rejected; potions stay at 3.']),
      CODE('inv-list-copy', 'luau', 'luau', ['Langkah 3: mendedahkan salinan (R4)', 'Step 3: exposing copies (R4)'], `
local function createBag()
  local slots = {{id = "gem", count = 2}}
  local bag = {}
  function bag.list(): {{id: string, count: number}}
    local out = table.create(#slots)
    for i, s in slots do
      out[i] = table.clone(s)
    end
    return out
  end
  function bag.count(id: string): number
    local n = 0
    for _, s in slots do if s.id == id then n += s.count end end
    return n
  end
  return bag
end

local bag = createBag()
local view = bag.list()
view[1].count = 999
table.insert(view, {id = "gem", count = 50})
print(bag.count("gem"), #bag.list())
`, '2\t1', {
        debug: BUG(`
local slots = {{id = "gem", count = 2}}
local function list() return slots end
local view = list()
view[1].count = 999
assert(slots[1].count == 2, \`internal slot changed to {slots[1].count}\`)
`, 'example:5: internal slot changed to 999',
          '`list()` memulangkan table dalaman itu sendiri — rujukan, bukan salinan. Kod UI yang menulis `view[1].count = 999` mengubah inventori sebenar, memintas setiap peraturan. Pulangkan salinan: array baharu dengan `table.clone` bagi setiap slot.',
          '`list()` returns the internal table itself — a reference, not a copy. UI code writing `view[1].count = 999` changes the real inventory, bypassing every rule. Return a copy: a new array with a `table.clone` of each slot.'),
      }),
      EXPLAIN('inv-list-copy',
        ['1–10', '`list` membina array baharu dengan salinan setiap slot.', '`list` builds a new array with a copy of each slot.'],
        ['11–16', '`count` membaca slot dalaman.', '`count` reads the internal slots.'],
        ['19–23', 'Mengubah dan menambah pada salinan tidak menjejaskan inventori: masih 2 permata dalam 1 slot.', 'Changing and adding to the copy does not affect the inventory: still 2 gems in 1 slot.'])),
    S('line_by_line',
      EXPLAIN('inv-add',
        ['20', '`while left > 0 and #slots < maxSlots` — dua syarat: masih ada item, dan masih ada slot. Untuk 8 ramuan, slot ketiga menerima `math.min(5, 8)` = 5, kemudian `#slots` = 3 menghentikan gelung dengan baki 3.', '`while left > 0 and #slots < maxSlots` — two conditions: items remain, and a slot remains. For 8 potions, the third slot receives `math.min(5, 8)` = 5, then `#slots` = 3 stops the loop with 3 left over.']),
      EXPLAIN('inv-remove',
        ['13', '`if amount > have then` — semakan berlaku **sebelum** sebarang slot diubah; inilah yang menjadikan pembuangan atomik.', '`if amount > have then` — the check happens **before** any slot is changed; this is what makes the removal atomic.'])),
    S('why_this_way',
      P('Mengapa kilang dengan slot peribadi? Kerana setiap peraturan (susunan, had, atomik) hanya bermakna jika satu-satunya cara mengubah slot ialah melalui API. Mengapa katalog beku? Kerana `maxStack` yang berubah semasa permainan akan menjadikan slot sedia ada tidak sah. Mengapa salinan dalam `list()`? Kerana rujukan yang terdedah ialah pintu belakang.',
        'Why a factory with private slots? Because every rule (stacking, limits, atomicity) only means something if the only way to change slots is through the API. Why a frozen catalogue? Because a `maxStack` that changes during play would make existing slots invalid. Why copies in `list()`? Because an exposed reference is a back door.'),
      P('Pulangkan baki **apabila** inventori penuh supaya pemanggil memutuskan (jatuhkan, mesej); uji setiap keperluan **sebelum** menyambungkan inventori kepada UI.', 'Return the leftover **when** the inventory is full so the caller decides (drop, message); test every requirement **before** connecting the inventory to a UI.')),
    S('execution_flow',
      OL(
        ['`add("arrow", 70)`: tiada slot; laluan 2 membuka slot 50, kemudian slot 20 → baki 0.', '`add("arrow", 70)`: no slots; pass 2 opens a 50 slot, then a 20 slot → leftover 0.'],
        ['`add("potion", 8)`: laluan 1 tiada ramuan; laluan 2 membuka slot ketiga.', '`add("potion", 8)`: pass 1 finds no potions; pass 2 opens the third slot.'],
        ['`remove`: semak jumlah dahulu; kemudian ambil dari belakang dan buang slot kosong.', '`remove`: check the total first; then take from the back and remove empty slots.'],
      )),
    S('memory_behaviour',
      P('Setiap slot ialah table kecil; inventori dengan 30 slot ialah 31 table. `list()` menyalin setiap slot setiap panggilan — murah untuk inventori kecil, tetapi jangan panggil setiap bingkai; panggil apabila UI perlu dikemas kini. Katalog beku dikongsi oleh setiap inventori, jadi ia hanya wujud sekali dalam memori.', 'Each slot is a small table; an inventory with 30 slots is 31 tables. `list()` copies every slot on each call — cheap for small inventories, but do not call it every frame; call it when the UI needs updating. The frozen catalogue is shared by every inventory, so it exists only once in memory.')),
    S('alternative_implementations',
      P('Model alternatif tanpa slot: dictionary `id → jumlah` — lebih ringkas, tetapi tiada susunan atau had slot:', 'An alternative model without slots: an `id → total` dictionary — simpler, but no order or slot limit:'),
      CODE('inv-counts-only', 'luau', 'luau', ['Inventori kiraan sahaja', 'A counts-only inventory'], `
local counts: {[string]: number} = {}
local function give(id: string, n: number) counts[id] = (counts[id] or 0) + n end
local function take(id: string, n: number): boolean
  local have = counts[id] or 0
  if have < n then return false end
  counts[id] = if have == n then nil else have - n
  return true
end

give("arrow", 70); give("potion", 2)
print(take("arrow", 30), take("potion", 5), counts.arrow, counts.potion)
print(take("potion", 2), counts.potion)
`, 'true\tfalse\t40\t2\ntrue\tnil'),
      EXPLAIN('inv-counts-only',
        ['1–8', 'Satu dictionary; kunci dipadam apabila jumlah menjadi 0.', 'One dictionary; the key is deleted when the total reaches 0.'],
        ['10–12', 'Sesuai untuk mata wang atau bahan; tidak sesuai untuk beg dengan slot visual.', 'Good for currencies or materials; not for a bag with visual slots.'])),
    S('common_mistakes',
      UL(
        ['Mengubah slot sebelum menyemak bahawa pembuangan boleh berjaya.', 'Changing slots before checking that a removal can succeed.'],
        ['Mendedahkan table slot dalaman.', 'Exposing the internal slot tables.'],
        ['Membuang slot kosong dengan gelung ke hadapan.', 'Removing empty slots with a forward loop.'],
        ['Membuang baki secara senyap apabila inventori penuh.', 'Silently discarding the leftover when the inventory is full.'],
      )),
    S('debugging',
      P('Untuk inventori, ujian ialah alat penyahpepijatan utama: setiap keperluan mempunyai `assert` dengan mesej yang menyebut keperluan, nilai dijangka dan nilai sebenar. Jika item hilang, semak sama ada baki dipulangkan dan digunakan; jika jumlah salah, cetak setiap slot dengan `describe()`. Ralat `unknown item` daripada `assert(CATALOG[id], …)` menunjukkan ID yang salah ejaan. Ujian penuh untuk langkah 1:',
        'For an inventory, tests are the main debugging tool: every requirement has an `assert` whose message names the requirement, the expected value and the actual value. If items go missing, check whether the leftover is returned and used; if a total is wrong, print every slot with `describe()`. An `unknown item` error from `assert(CATALOG[id], …)` points to a misspelt ID. Full tests for step 1:'),
      CODE('inv-tests', 'luau', 'luau', ['Ujian keperluan', 'Requirement tests'], `
local CATALOG = table.freeze({
  arrow = table.freeze({maxStack = 50}),
  potion = table.freeze({maxStack = 5}),
})

local function createInventory(maxSlots: number)
  local slots = {}
  local api = {}
  function api.add(id: string, amount: number): number
    local item = assert(CATALOG[id], \`unknown item '{id}'\`)
    local left = amount
    for _, s in slots do
      if s.id == id and s.count < item.maxStack then
        local moved = math.min(item.maxStack - s.count, left)
        s.count += moved
        left -= moved
      end
    end
    while left > 0 and #slots < maxSlots do
      local moved = math.min(item.maxStack, left)
      table.insert(slots, {id = id, count = moved})
      left -= moved
    end
    return left
  end
  function api.count(id: string): number
    local n = 0
    for _, s in slots do if s.id == id then n += s.count end end
    return n
  end
  function api.slotCount(): number return #slots end
  return api
end

local inv = createInventory(3)
assert(inv.add("arrow", 70) == 0, "R1: 70 arrows fit in two slots")
assert(inv.slotCount() == 2, \`R1: expected 2 slots, got {inv.slotCount()}\`)
local left = inv.add("potion", 8)
assert(inv.count("potion") == 5, \`R2: expected 5 potions, got {inv.count("potion")}\`)
assert(left == 3, \`R2: expected 3 left over, got {left}\`)
assert(not pcall(inv.add, "sword", 1), "R5: unknown items are rejected")
print("all inventory tests passed")
`, 'all inventory tests passed'),
      EXPLAIN('inv-tests',
        ['1–4', 'Katalog yang sama.', 'The same catalogue.'],
        ['6–33', 'Logik penambahan yang sama seperti langkah 1, ditambah `count` dan `slotCount` untuk ujian.', 'The same adding logic as step 1, plus `count` and `slotCount` for testing.'],
        ['35–42', 'R1, R2 dan R5 diuji dengan nilai yang tepat; semua lulus.', 'R1, R2 and R5 are tested with exact values; all pass.'])),
    S('performance',
      P('`add`, `remove` dan `count` ialah O(s) untuk s slot — kecil (biasanya ≤ 50). Jika `count` dipanggil sangat kerap, simpan dictionary jumlah bersama slot dan kemas kini kedua-duanya dalam API. `list()` ialah O(s) dengan s peruntukan; panggil apabila diperlukan sahaja.', '`add`, `remove` and `count` are O(s) for s slots — small (usually ≤ 50). If `count` is called very often, keep a totals dictionary alongside the slots and update both in the API. `list()` is O(s) with s allocations; call it only when needed.')),
    S('software_engineering',
      P('Inventori terbuka berbanding inventori yang dikapsulkan:', 'An open inventory versus an encapsulated one:'),
      CODE('poor-open-inventory', 'luau', 'luau', ['Pelaksanaan lemah: slot terbuka', 'Poor implementation: open slots'], `
local inventory = {slots = {}, maxSlots = 2}
table.insert(inventory.slots, {id = "potion", count = 5})
table.insert(inventory.slots, {id = "potion", count = 5})
table.insert(inventory.slots, {id = "potion", count = 99})
print(#inventory.slots, inventory.slots[3].count)
`, '3\t99'),
      EXPLAIN('poor-open-inventory',
        ['1–3', 'Sesiapa boleh menambah slot terus.', 'Anyone can add slots directly.'],
        ['4–5', 'Had slot dan `maxStack` dilangkau: 3 slot, 99 ramuan dalam satu slot.', 'The slot limit and `maxStack` are bypassed: 3 slots, 99 potions in one slot.']),
      CODE('improved-encapsulated-inventory', 'luau', 'luau', ['Pelaksanaan lebih baik: dikapsulkan', 'Improved implementation: encapsulated'], `
local function createPouch(maxSlots: number, maxStack: number)
  local slots: {number} = {}
  return {
    add = function(n: number): number
      while n > 0 and #slots < maxSlots do
        local put = math.min(maxStack, n)
        table.insert(slots, put)
        n -= put
      end
      return n
    end,
    size = function(): number return #slots end,
  }
end

local pouch = createPouch(2, 5)
print(pouch.add(13), pouch.size(), pouch.slots)
`, '3\t2\tnil'),
      EXPLAIN('improved-encapsulated-inventory',
        ['1–14', 'Slot peribadi; satu-satunya cara menambah ialah `add`, yang menghormati kedua-dua had.', 'Private slots; the only way to add is `add`, which respects both limits.'],
        ['16–17', '13 item: 5 + 5, baki 3; `pouch.slots` tidak wujud dari luar.', '13 items: 5 + 5, 3 left over; `pouch.slots` does not exist from outside.'])),
    S('industry_use_cases',
      UL(
        ['Inventori permainan RPG dan survival Roblox menggunakan slot, susunan dan katalog item.', 'Roblox RPG and survival game inventories use slots, stacking and an item catalogue.'],
        ['Pelayan menyimpan inventori yang berwibawa; klien menerima salinan untuk UI sahaja.', 'The server keeps the authoritative inventory; the client receives copies for the UI only.'],
        ['Katalog item disimpan dalam ModuleScript beku yang dikongsi oleh kedai, inventori dan ganjaran.', 'Item catalogues live in frozen ModuleScripts shared by shops, inventories and rewards.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah `remove` (dari `inv-remove`) pada `createInventory` dalam `inv-tests` dan tulis ujian R3.', 'Add `remove` (from `inv-remove`) to `createInventory` in `inv-tests` and write an R3 test.'],
        ['Tambah `list()` yang memulangkan salinan dan uji R4 seperti `inv-list-copy`.', 'Add a `list()` that returns copies and test R4 as in `inv-list-copy`.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Pengembangan: pertukaran antara dua inventori.** Pindahkan item dari satu inventori ke inventori lain secara atomik: jika penerima tidak boleh menerima semua, tiada apa-apa berubah.', '**Extension: a trade between two inventories.** Move items from one inventory to another atomically: if the receiver cannot take all of them, nothing changes.'),
      CODE('inv-trade', 'luau', 'luau', ['Penyelesaian contoh', 'Example solution'], `
local function createStore(capacity: number)
  local counts: {[string]: number} = {}
  local used = 0
  local s = {}
  function s.count(id: string): number return counts[id] or 0 end
  function s.space(): number return capacity - used end
  function s.change(id: string, delta: number)
    counts[id] = (counts[id] or 0) + delta
    if counts[id] == 0 then counts[id] = nil end
    used += delta
  end
  return s
end

local function trade(from, to, id: string, n: number): (boolean, string?)
  if from.count(id) < n then return false, "sender does not have enough" end
  if to.space() < n then return false, "receiver is full" end
  from.change(id, -n)
  to.change(id, n)
  return true, nil
end

local aina, ben = createStore(10), createStore(4)
aina.change("gem", 6)
print(trade(aina, ben, "gem", 5))
print(trade(aina, ben, "gem", 7))
print(trade(aina, ben, "gem", 3), aina.count("gem"), ben.count("gem"))
`, 'false\treceiver is full\nfalse\tsender does not have enough\ntrue\t3\t3'),
      EXPLAIN('inv-trade',
        ['1–13', 'Stor ringkas dengan kapasiti; keadaan peribadi dan fungsi API.', 'A simple store with a capacity; private state and API functions.'],
        ['15–21', 'Semua semakan **sebelum** sebarang perubahan — pertukaran sama ada berlaku sepenuhnya atau tidak langsung.', 'All checks **before** any change — the trade happens fully or not at all.'],
        ['23–27', '5 permata: Ben hanya muat 4 → ditolak. 7 permata: Aina hanya ada 6 → ditolak. 3 permata: berjaya → 3 dan 3 (`trade` bukan argumen terakhir, jadi hanya `true` dicetak). Setiap penolakan tidak mengubah kedua-dua stor.', '5 gems: Ben only fits 4 → rejected. 7 gems: Aina only has 6 → rejected. 3 gems: succeeds → 3 and 3 (`trade` is not the last argument, so only `true` is printed). Each rejection leaves both stores unchanged.'])),
    S('summary',
      UL(
        ['Katalog beku + slot peribadi + API yang mengesahkan.', 'A frozen catalogue + private slots + a validating API.'],
        ['Susun ke slot sedia ada dahulu, kemudian slot baharu dalam had.', 'Stack into existing slots first, then new slots within the limit.'],
        ['Operasi atomik: semak semua, kemudian ubah.', 'Atomic operations: check everything, then change.'],
        ['Dedahkan salinan, bukan table dalaman; uji setiap keperluan.', 'Expose copies, not internal tables; test every requirement.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah `remove` menyemak jumlah sebelum mengubah slot?', 'Why does `remove` check the total before changing slots?'],
        ['Apakah risiko jika `list()` memulangkan `slots` terus?', 'What is the risk if `list()` returns `slots` directly?'],
        ['Mengapakah slot kosong dibuang dengan gelung ke belakang?', 'Why are empty slots removed with a backwards loop?'],
        ['Bilakah inventori kiraan sahaja lebih baik daripada slot?', 'When is a counts-only inventory better than slots?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Roblox Creator Hub — Tables', url: `${DOCS}/luau/tables` },
        { title: 'Luau — Library: table', url: `${LUAU}/library#table-library` },
        { title: 'Roblox Creator Hub — ModuleScripts', url: `${DOCS}/reference/engine/classes/ModuleScript` },
        { title: 'Luau — Type checking', url: `${LUAU}/typecheck` },
      )),
  ],
};

export const LUAU104_M4 = [LUAU104_4_1, LUAU104_4_2, LUAU104_4_3];
