import { BUG, CODE, EXPLAIN, INFO, KEY, LINKS, OL, P, S, TERMS, UL } from '@/db/content/authoring';
import type { LectureContentDef } from '@/db/content/types';

/** LUA104 · Module 3 — Variadic Functions (standard Lua 5.4; verified by `npm run verify:code`). */

const MANUAL = 'https://www.lua.org/manual/5.4/manual.html';
const PIL = 'https://www.lua.org/pil';

// ─── 3.1 ... and select("#", ...) ──────────────────────────────────────────

export const LUA104_3_1: LectureContentDef = {
  courseCode: 'LUA104',
  module: 3,
  lecture: 1,
  sections: [
    S('learning_objectives',
      OL(
        ['Menulis [[vararg|fungsi variadic]] dengan `...` dalam senarai parameter.', 'Write [[vararg|variadic functions]] with `...` in the parameter list.'],
        ['Mengira argumen dengan `select("#", ...)`, termasuk `nil`.', 'Count arguments with `select("#", ...)`, including `nil`s.'],
        ['Mengakses argumen tertentu dengan `select(n, ...)`.', 'Access particular arguments with `select(n, ...)`.'],
        ['Memajukan `...` kepada fungsi lain, seperti `string.format`.', 'Forward `...` to another function, such as `string.format`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 2: nilai pulangan berbilang dan pelarasan nilai.', 'Module 2: multiple return values and value adjustment.'],
        ['Anda telah menggunakan fungsi variadic: `print` dan `string.format` menerima sebarang bilangan argumen.', 'You have used variadic functions: `print` and `string.format` take any number of arguments.'],
      )),
    S('introduction',
      P('`print(1)`, `print(1, 2, 3)`, `print()` — semuanya sah, kerana `print` ialah fungsi **variadic**: ia menerima sebarang bilangan argumen. Anda boleh menulis fungsi seperti ini sendiri dengan meletakkan `...` (tiga titik) di hujung senarai parameter. Di dalam fungsi, `...` ialah ungkapan yang menghasilkan semua argumen tambahan sebagai nilai berbilang — dan ia mengikut peraturan pelarasan yang sama seperti panggilan fungsi dalam Modul 2.',
        '`print(1)`, `print(1, 2, 3)`, `print()` — all valid, because `print` is a **variadic** function: it accepts any number of arguments. You can write functions like this yourself by placing `...` (three dots) at the end of the parameter list. Inside the function, `...` is an expression that yields all the extra arguments as multiple values — and it follows the same adjustment rules as the function calls of Module 2.'),
      KEY('`...` berkelakuan seperti panggilan fungsi yang memulangkan semua argumen tambahan.', '`...` behaves like a function call returning all the extra arguments.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`function f(a, ...)` — `a` wajib, selebihnya masuk ke `...`.', '`function f(a, ...)` — `a` is required, the rest go into `...`.'],
        ['`{...}` mengumpul argumen ke dalam table (tetapi `nil` mencipta lubang).', '`{...}` collects the arguments into a table (but `nil`s create holes).'],
        ['`select("#", ...)` → bilangan argumen sebenar, termasuk `nil`.', '`select("#", ...)` → the true argument count, including `nil`s.'],
        ['`select(n, ...)` → argumen ke-n **dan semua selepasnya**; `select(-1, ...)` → yang terakhir.', '`select(n, ...)` → the n-th argument **and all after it**; `select(-1, ...)` → the last one.'],
        ['`...` hanya boleh digunakan dalam fungsi yang mengisytiharkannya.', '`...` can only be used inside a function that declares it.'],
      )),
    S('detailed_theory',
      P('Apabila fungsi variadic dipanggil, Lua menyimpan argumen tambahan di bawah bingkai fungsi itu, dan ungkapan `...` menyalinnya ke tempat ia digunakan. Kerana `...` ialah ungkapan berbilang nilai, peraturan kuliah 2.2 terpakai: sebagai item terakhir dalam senarai ia mengembang kepada semua argumen; di tempat lain atau dalam kurungan `(...)` ia menjadi argumen pertama sahaja. Inilah yang membolehkan `string.format(fmt, ...)` memajukan setiap argumen tanpa mengetahui bilangannya.',
        'When a variadic function is called, Lua keeps the extra arguments below the function’s frame, and the `...` expression copies them to wherever it is used. Because `...` is a multi-value expression, the rules of lecture 2.2 apply: as the last item of a list it expands to all the arguments; elsewhere or in parentheses `(...)` it becomes only the first argument. This is what lets `string.format(fmt, ...)` forward every argument without knowing how many there are.'),
      P('Mengira argumen memerlukan perhatian. `#{...}` dan `ipairs({...})` berhenti atau menjadi tidak tentu apabila salah satu argumen ialah `nil`, kerana table yang terhasil mempunyai lubang. `select("#", ...)` membaca bilangan sebenar daripada timbunan, jadi `f(1, nil, 3)` memberi 3. `select(n, ...)` memulangkan argumen ke-n **dan semua selepasnya** — dalam ungkapan seperti `s + select(i, ...)` hanya yang pertama digunakan, tetapi sebagai argumen terakhir semuanya dihantar. Dalam Lua 5.4, `...` juga wujud dalam chunk utama, mengandungi argumen baris arahan skrip.',
        'Counting arguments needs care. `#{...}` and `ipairs({...})` stop or become undefined when one of the arguments is `nil`, because the resulting table has a hole. `select("#", ...)` reads the true count from the stack, so `f(1, nil, 3)` gives 3. `select(n, ...)` returns the n-th argument **and all after it** — in an expression such as `s + select(i, ...)` only the first is used, but as a last argument all of them are passed. In Lua 5.4, `...` also exists in the main chunk, holding the script’s command-line arguments.')),
    S('technical_terminology', TERMS('vararg', 'value-adjustment', 'parameter', 'function')),
    S('syntax_rules',
      UL(
        ['`local function f(...) … end` atau `local function f(a, b, ...) … end` — `...` mesti terakhir.', '`local function f(...) … end` or `local function f(a, b, ...) … end` — `...` must come last.'],
        ['`local a, b = ...` — terima argumen pertama ke dalam local.', '`local a, b = ...` — receive the first arguments into locals.'],
        ['`select("#", ...)`, `select(n, ...)`, `select(-n, ...)`.', '`select("#", ...)`, `select(n, ...)`, `select(-n, ...)`.'],
      )),
    S('code_demonstration',
      CODE('vararg-sum', 'lua', 'lua54', ['Jumlah sebarang bilangan nombor', 'Summing any number of numbers'], `
local function sum(...)
  local total = 0
  for _, v in ipairs({...}) do
    total = total + v
  end
  return total
end

print(sum(1, 2, 3))
print(sum(10))
print(sum())
`, '6\n10\n0'),
      EXPLAIN('vararg-sum',
        ['1', '`...` sebagai satu-satunya parameter: fungsi menerima sebarang bilangan argumen.', '`...` as the only parameter: the function accepts any number of arguments.'],
        ['2–5', '`{...}` mengumpul argumen ke dalam table, dan `ipairs` melawatinya.', '`{...}` collects the arguments into a table, and `ipairs` visits them.'],
        ['6', 'Jumlah dipulangkan.', 'The total is returned.'],
        ['9–11', 'Tiga, satu dan sifar argumen — semuanya sah.', 'Three, one and zero arguments — all valid.'])),
    S('complete_examples',
      CODE('count-args', 'lua', 'lua54', ['select("#") berbanding ipairs', 'select("#") versus ipairs'], `
local function describe(...)
  local seen = 0
  for _ in ipairs({...}) do seen = seen + 1 end
  return seen, select("#", ...)
end

print(describe("a", "b", "c"))
print(describe(1, nil, 3))
print(describe(nil))
print(select(2, "x", "y", "z"))
print(select(-1, "x", "y", "z"))
`, '3\t3\n1\t3\n0\t1\ny\tz\nz', {
        debug: BUG(`
local function total()
  local sum = 0
  for _, v in ipairs({...}) do sum = sum + v end
  return sum
end
`, "example:3: cannot use '...' outside a vararg function near '...'",
          'Fungsi menggunakan `...` tetapi tidak mengisytiharkannya dalam senarai parameter: `total()` dan bukannya `total(...)`. Pengkompil menolaknya kerana fungsi bukan variadic tidak menyimpan argumen tambahan. Ralat kompil ini menyebut baris yang menggunakan `...`. Tambah `...` pada parameter.',
          'The function uses `...` but does not declare it in its parameter list: `total()` instead of `total(...)`. The compiler rejects it because a non-variadic function keeps no extra arguments. This compile error names the line that uses `...`. Add `...` to the parameters.'),
      }),
      EXPLAIN('count-args',
        ['1–3', '`ipairs` berhenti pada `nil` pertama, jadi `seen` mengira hanya hingga lubang pertama.', '`ipairs` stops at the first `nil`, so `seen` counts only up to the first hole.'],
        ['4', '`select("#", ...)` memberi bilangan sebenar.', '`select("#", ...)` gives the true count.'],
        ['7', 'Tiada `nil`: kedua-dua kiraan sama.', 'No `nil`s: both counts agree.'],
        ['8', '`ipairs` berhenti selepas 1; terdapat sebenarnya 3 argumen.', '`ipairs` stops after 1; there are really 3 arguments.'],
        ['9', 'Satu argumen yang `nil`: 0 berbanding 1.', 'One argument that is `nil`: 0 versus 1.'],
        ['10–11', '`select(2, …)` memulangkan argumen ke-2 **dan selepasnya**; `select(-1, …)` yang terakhir sahaja.', '`select(2, …)` returns the 2nd argument **and after**; `select(-1, …)` only the last.']),
      CODE('printf', 'lua', 'lua54', ['Memajukan ... ke string.format', 'Forwarding ... to string.format'], `
local function printf(fmt, ...)
  io.write(string.format(fmt, ...))
end

printf("%s scored %d points\\n", "Ali", 87)
printf("%d%% done\\n", 75)
printf("no arguments\\n")
`, 'Ali scored 87 points\n75% done\nno arguments', {
        debug: BUG(`
local function printf(fmt, ...)
  io.write(string.format(fmt, ...))
end
printf("%s scored %d\\n", "Ali")
`, "example:2: bad argument #3 to 'format' (no value)",
          'Format menjangka dua nilai (`%s` dan `%d`) tetapi hanya "Ali" dihantar. `string.format` menerima `fmt` sebagai argumen #1 dan "Ali" sebagai #2, jadi argumen **#3** tiada. Ralat dilaporkan pada baris 2 — di dalam `printf` — kerana di situlah `string.format` dipanggil; punca sebenar di baris 4. Fungsi pembalut seperti `printf` boleh menggunakan `error(…, 2)` untuk menunjuk ke pemanggil (kuliah 1.3).',
          'The format expects two values (`%s` and `%d`) but only "Ali" is passed. `string.format` receives `fmt` as argument #1 and "Ali" as #2, so argument **#3** is missing. The error is reported on line 2 — inside `printf` — because that is where `string.format` is called; the real cause is on line 4. Wrapper functions like `printf` can use `error(…, 2)` to point at the caller (lecture 1.3).'),
      }),
      EXPLAIN('printf',
        ['1–3', '`fmt` wajib; selebihnya dimajukan sepenuhnya kepada `string.format`, kerana `...` ialah argumen terakhir.', '`fmt` is required; the rest are forwarded completely to `string.format`, because `...` is the last argument.'],
        ['5', 'Dua argumen tambahan.', 'Two extra arguments.'],
        ['6', '`%%` menghasilkan tanda peratus literal.', '`%%` produces a literal percent sign.'],
        ['7', 'Tiada argumen tambahan: `...` kosong.', 'No extra arguments: `...` is empty.'])),
    S('line_by_line',
      EXPLAIN('count-args',
        ['3', '`for _ in ipairs(...)` — hanya pemboleh ubah kunci diperlukan untuk mengira; `_` diabaikan.', '`for _ in ipairs(...)` — only a key variable is needed for counting; `_` is ignored.']),
      EXPLAIN('printf',
        ['2', '`io.write` tidak menambah baris baharu atau tab, berbeza daripada `print`, jadi format mengawal output sepenuhnya.', '`io.write` adds no newline or tab, unlike `print`, so the format fully controls the output.'])),
    S('why_this_way',
      P('Mengapa fungsi variadic? Kerana banyak operasi semula jadi menerima "sebilangan" nilai: jumlah, maksimum, pemformatan, pengelogan. Tanpa `...`, pemanggil perlu membina table untuk setiap panggilan — `sum({1, 2, 3})` — yang lebih bising dan memperuntukkan memori.',
        'Why variadic functions? Because many operations naturally take "some number of" values: sums, maxima, formatting, logging. Without `...`, callers would have to build a table for every call — `sum({1, 2, 3})` — which is noisier and allocates memory.'),
      P('Gunakan `...` **apabila** bilangan argumen benar-benar berubah dan semuanya sama jenis atau peranan; gunakan `select("#", ...)` **apabila** `nil` ialah argumen yang sah; gunakan parameter bernama **apabila** setiap argumen mempunyai makna berbeza.', 'Use `...` **when** the number of arguments genuinely varies and they all have the same type or role; use `select("#", ...)` **when** `nil` is a valid argument; use named parameters **when** each argument has a different meaning.')),
    S('execution_flow',
      OL(
        ['`printf("%s scored %d points\\n", "Ali", 87)`: `fmt` menerima format; `...` menyimpan "Ali", 87.', '`printf("%s scored %d points\\n", "Ali", 87)`: `fmt` receives the format; `...` holds "Ali", 87.'],
        ['Baris 2: `string.format(fmt, ...)` → `...` mengembang → `string.format(fmt, "Ali", 87)`.', 'Line 2: `string.format(fmt, ...)` → `...` expands → `string.format(fmt, "Ali", 87)`.'],
        ['Teks yang diformat dihantar kepada `io.write`.', 'The formatted text is passed to `io.write`.'],
      )),
    S('memory_behaviour',
      P('`...` sendiri tidak memperuntukkan table: argumen kekal pada timbunan. `{...}` mencipta table baharu pada setiap panggilan; untuk fungsi yang dipanggil sangat kerap, gelung dengan `select` mengelakkan peruntukan itu — walaupun `select(i, ...)` dalam gelung menyalin argumen berulang kali, jadi ia lebih perlahan untuk senarai panjang. Untuk beberapa argumen, kedua-duanya cepat.',
        '`...` itself allocates no table: the arguments stay on the stack. `{...}` creates a new table on every call; for very frequently called functions, a loop with `select` avoids that allocation — although `select(i, ...)` in a loop copies the arguments repeatedly, so it is slower for long lists. For a few arguments, both are fast.')),
    S('alternative_implementations',
      P('Gelung dengan `select` mengendalikan `nil` dan tidak mencipta table:', 'A loop with `select` handles `nil`s and creates no table:'),
      CODE('select-loop', 'lua', 'lua54', ['Lelaran dengan select', 'Iterating with select'], `
local function describeAll(...)
  local n = select("#", ...)
  for i = 1, n do
    local v = (select(i, ...))
    print(i, type(v), v)
  end
end

describeAll("x", nil, 3)
`, '1\tstring\tx\n2\tnil\tnil\n3\tnumber\t3'),
      EXPLAIN('select-loop',
        ['1–2', 'Bilangan sebenar, termasuk `nil` di tengah.', 'The true count, including the `nil` in the middle.'],
        ['3–6', 'Kurungan `(select(i, ...))` mengambil hanya argumen ke-i; tanpanya, `print` menerima semua argumen yang tinggal.', 'The parentheses `(select(i, ...))` take only the i-th argument; without them, `print` would receive all remaining arguments.'],
        ['9', 'Ketiga-tiga argumen dilawati, termasuk `nil`.', 'All three arguments are visited, including the `nil`.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan `...` dalam fungsi tanpa `...` dalam parameternya — termasuk fungsi dalaman yang bersarang dalam fungsi variadic.', 'Using `...` in a function without `...` in its parameters — including an inner function nested inside a variadic one.'],
        ['Menggunakan `#{...}` atau `ipairs` apabila argumen boleh `nil`.', 'Using `#{...}` or `ipairs` when arguments can be `nil`.'],
        ['Lupa bahawa `select(n, ...)` memulangkan semua argumen selepas n juga.', 'Forgetting that `select(n, ...)` also returns all arguments after n.'],
        ['Meletakkan `...` di tengah senarai argumen dan hanya mendapat nilai pertama.', 'Putting `...` in the middle of an argument list and getting only the first value.'],
      )),
    S('debugging',
      P('Untuk melihat apa yang sebenarnya diterima oleh fungsi variadic, cetak `select("#", ...)` dan kemudian `print(...)` pada baris pertamanya. Jika `nil` diterima, operasi aritmetik pada nilai itu gagal dengan mesej tanpa nama pemboleh ubah — kerana nilai itu datang daripada panggilan `select`, bukan daripada local. Contoh berikut mengendalikan `nil` dengan selamat, diikuti versi yang gagal:',
        'To see what a variadic function actually receives, print `select("#", ...)` and then `print(...)` on its first line. If a `nil` is received, arithmetic on it fails with a message that names no variable — because the value came from a `select` call, not from a local. The following example handles `nil`s safely, followed by a version that fails:'),
      CODE('sum-skip-nil', 'lua', 'lua54', ['Jumlah yang melangkau nil', 'A sum that skips nils'], `
local function sumPresent(...)
  local total, missing = 0, 0
  for i = 1, select("#", ...) do
    local v = (select(i, ...))
    if v == nil then missing = missing + 1 else total = total + v end
  end
  return total, missing
end

print(sumPresent(5, nil, 10, nil))
`, '15\t2', {
        debug: BUG(`
local function sum(...)
  local s = 0
  for i = 1, select("#", ...) do
    s = s + select(i, ...)
  end
  return s
end
print(sum(1, nil, 3))
`, 'example:4: attempt to perform arithmetic on a nil value',
          'Argumen kedua ialah `nil`, dan `s + select(2, ...)` cuba menambah `nil`. Mesej tidak menyebut nama kerana nilai itu hasil panggilan fungsi, bukan pemboleh ubah. Semak `nil` sebelum aritmetik, seperti versi asal.',
          'The second argument is `nil`, and `s + select(2, ...)` tries to add `nil`. The message names no variable because the value is a function call result, not a variable. Check for `nil` before the arithmetic, as in the original version.'),
      }),
      EXPLAIN('sum-skip-nil',
        ['1–2', 'Dua pengumpul: jumlah dan bilangan nilai yang hilang.', 'Two accumulators: the sum and the count of missing values.'],
        ['3–6', 'Lawati setiap argumen dengan `select`; asingkan `nil` daripada nombor.', 'Visit every argument with `select`; separate `nil`s from numbers.'],
        ['7', 'Dua hasil.', 'Two results.'],
        ['10', '5 + 10, dengan dua nilai hilang.', '5 + 10, with two missing values.'])),
    S('performance',
      P('Memanggil fungsi variadic hampir sama pantas dengan fungsi biasa. Kos tambahan datang daripada apa yang anda lakukan dengan `...`: `{...}` memperuntukkan table, dan `select(i, ...)` dalam gelung adalah O(n²) untuk n argumen kerana setiap panggilan menyalin argumen yang tinggal. Untuk puluhan argumen, `table.pack` (kuliah 3.2) sekali di permulaan lebih baik.',
        'Calling a variadic function is almost as fast as an ordinary one. Extra cost comes from what you do with `...`: `{...}` allocates a table, and `select(i, ...)` in a loop is O(n²) for n arguments because each call copies the remaining arguments. For dozens of arguments, one `table.pack` (lecture 3.2) at the start is better.')),
    S('software_engineering',
      P('Panggilan bersarang fungsi dua argumen berbanding satu fungsi variadic:', 'Nested calls to a two-argument function versus one variadic function:'),
      CODE('poor-nested-max', 'lua', 'lua54', ['Pelaksanaan lemah: max2 bersarang', 'Poor implementation: nested max2'], `
local function max2(a, b)
  if a > b then return a end
  return b
end

print(max2(max2(max2(4, 17), 9), 12))
`, '17'),
      EXPLAIN('poor-nested-max',
        ['1–4', 'Fungsi yang hanya membandingkan dua nilai.', 'A function that only compares two values.'],
        ['6', 'Empat nilai memerlukan tiga panggilan bersarang — sukar dibaca dan mudah tersalah kurungan.', 'Four values need three nested calls — hard to read and easy to mis-parenthesise.']),
      CODE('improved-vararg-max', 'lua', 'lua54', ['Pelaksanaan lebih baik: maksimum variadic', 'Improved implementation: a variadic maximum'], `
local function largest(first, ...)
  local best = first
  for _, v in ipairs({...}) do
    if v > best then best = v end
  end
  return best
end

print(largest(4, 17, 9, 12))
print(largest(3))
`, '17\n3'),
      EXPLAIN('improved-vararg-max',
        ['1–2', 'Parameter pertama yang wajib menjamin sekurang-kurangnya satu nilai; selebihnya variadic.', 'A required first parameter guarantees at least one value; the rest are variadic.'],
        ['3–6', 'Bandingkan setiap nilai tambahan.', 'Compare every extra value.'],
        ['9–10', 'Satu panggilan untuk sebarang bilangan nilai.', 'One call for any number of values.'])),
    S('industry_use_cases',
      UL(
        ['Fungsi pengelogan (`log.info("user %s logged in", name)`) memajukan `...` ke `string.format`.', 'Logging functions (`log.info("user %s logged in", name)`) forward `...` to `string.format`.'],
        ['`vim.print(...)` dan `vim.notify` dalam Neovim menerima argumen variadic.', '`vim.print(...)` and `vim.notify` in Neovim take variadic arguments.'],
        ['Skrip baris arahan membaca argumen melalui `...` dalam chunk utama.', 'Command-line scripts read their arguments through `...` in the main chunk.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tulis `average(...)` yang memulangkan `nil, "no values"` apabila tiada argumen.', 'Write `average(...)` that returns `nil, "no values"` when there are no arguments.'],
        ['Panggil `describe()` tanpa argumen dan ramalkan output.', 'Call `describe()` with no arguments and predict the output.'],
        ['Jalankan ketiga-tiga versi berpepijat dan perhatikan baris yang dilaporkan.', 'Run all three buggy versions and note the reported lines.'],
      )),
    S('mini_project',
      P('**Fungsi log mudah.** Tulis `log(level, ...)` yang menukar setiap argumen kepada teks (termasuk `nil`), mencantumnya dengan ruang, dan menambah awalan tahap.', '**A simple log function.** Write `log(level, ...)` that converts every argument to text (including `nil`), joins them with spaces, and adds a level prefix.'),
      CODE('vararg-log', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function log(level, ...)
  local parts = {}
  for i = 1, select("#", ...) do
    parts[i] = tostring((select(i, ...)))
  end
  print("[" .. level .. "] " .. table.concat(parts, " "))
end

log("INFO", "user", "amin", "logged in")
log("WARN", "disk", 91, "% full")
log("DEBUG", "value is", nil)
`, '[INFO] user amin logged in\n[WARN] disk 91 % full\n[DEBUG] value is nil'),
      EXPLAIN('vararg-log',
        ['1–2', 'Tahap wajib; mesej variadic.', 'A required level; a variadic message.'],
        ['3–5', '`tostring` pada setiap argumen — termasuk `nil` — supaya `table.concat` menerima string sahaja.', '`tostring` on every argument — including `nil` — so `table.concat` receives only strings.'],
        ['6', 'Cantum dengan ruang dan tambah awalan.', 'Join with spaces and add the prefix.'],
        ['9–11', 'Tiga panggilan dengan bilangan dan jenis argumen berbeza.', 'Three calls with different numbers and types of arguments.'])),
    S('summary',
      UL(
        ['`...` dalam parameter menjadikan fungsi variadic.', '`...` in the parameters makes a function variadic.'],
        ['`...` mengikut peraturan pelarasan: terakhir → semua, selainnya → satu.', '`...` follows the adjustment rules: last → all, otherwise → one.'],
        ['`select("#", ...)` mengira dengan betul walaupun terdapat `nil`.', '`select("#", ...)` counts correctly even with `nil`s.'],
        ['Majukan `...` terus kepada fungsi lain sebagai argumen terakhir.', 'Forward `...` directly to another function as its last argument.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah `select("#", nil, nil)`?', 'What is `select("#", nil, nil)`?'],
        ['Apakah yang dipulangkan oleh `select(2, "a", "b", "c")`?', 'What does `select(2, "a", "b", "c")` return?'],
        ['Mengapakah `ipairs({...})` tidak boleh dipercayai untuk mengira argumen?', 'Why is `ipairs({...})` unreliable for counting arguments?'],
        ['Mengapakah ralat `printf` dilaporkan di dalam `printf` dan bukan di baris pemanggil?', 'Why is the `printf` error reported inside `printf` and not at the calling line?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual §3.4.11 — Function Definitions (vararg functions)', url: `${MANUAL}#3.4.11` },
        { title: 'Lua 5.4 Reference Manual — select', url: `${MANUAL}#pdf-select` },
        { title: 'Programming in Lua (1st ed.) — 5.2 Variable Number of Arguments', url: `${PIL}/5.2.html` },
        { title: 'Lua 5.4 Reference Manual — string.format', url: `${MANUAL}#pdf-string.format` },
      )),
  ],
};

// ─── 3.2 table.pack and the n field ────────────────────────────────────────

export const LUA104_3_2: LectureContentDef = {
  courseCode: 'LUA104',
  module: 3,
  lecture: 2,
  sections: [
    S('learning_objectives',
      OL(
        ['Menggunakan `table.pack(...)` untuk menyimpan argumen bersama bilangannya dalam medan `n`.', 'Use `table.pack(...)` to store arguments together with their count in the `n` field.'],
        ['Memulihkan argumen dengan `table.unpack(t, 1, t.n)`, termasuk `nil` di hujung.', 'Restore arguments with `table.unpack(t, 1, t.n)`, including trailing `nil`s.'],
        ['Menyimpan panggilan untuk dijalankan kemudian.', 'Store a call to be run later.'],
        ['Memilih antara `{...}`, `table.pack` dan `select`.', 'Choose between `{...}`, `table.pack` and `select`.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Kuliah 3.1: `...`, `select("#", ...)` dan `select(n, ...)`.', 'Lecture 3.1: `...`, `select("#", ...)` and `select(n, ...)`.'],
        ['Kuliah 2.3: `table.unpack(t, i, j)`.', 'Lecture 2.3: `table.unpack(t, i, j)`.'],
      )),
    S('introduction',
      P('Kuliah 3.1 menunjukkan bahawa `{...}` kehilangan maklumat apabila argumen termasuk `nil`: table itu tidak tahu berapa banyak argumen sebenarnya. `table.pack` (Lua 5.2+) menyelesaikan masalah ini. Ia mencipta table dengan argumen di indeks 1, 2, 3, … **dan** medan `n` yang menyimpan bilangan tepat. Dengan `n`, anda boleh melawati setiap argumen, menyimpannya untuk kemudian, dan memulihkannya dengan sempurna menggunakan `table.unpack(t, 1, t.n)`.',
        'Lecture 3.1 showed that `{...}` loses information when the arguments include `nil`: the table does not know how many arguments there really were. `table.pack` (Lua 5.2+) solves this. It creates a table with the arguments at indices 1, 2, 3, … **and** an `n` field holding the exact count. With `n` you can visit every argument, store them for later, and restore them perfectly with `table.unpack(t, 1, t.n)`.'),
      KEY('`table.pack` dan `table.unpack(t, 1, t.n)` ialah pasangan yang tidak kehilangan apa-apa.', '`table.pack` and `table.unpack(t, 1, t.n)` are a pair that loses nothing.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['`table.pack(a, b, c)` → `{a, b, c, n = 3}`.', '`table.pack(a, b, c)` → `{a, b, c, n = 3}`.'],
        ['`n` mengira `nil` juga: `table.pack(1, nil).n` ialah 2.', '`n` counts `nil`s too: `table.pack(1, nil).n` is 2.'],
        ['Gelung `for i = 1, t.n` melawati setiap kedudukan, walaupun yang `nil`.', 'A loop `for i = 1, t.n` visits every position, even the `nil` ones.'],
        ['`table.unpack(t, 1, t.n)` memulihkan senarai argumen yang tepat.', '`table.unpack(t, 1, t.n)` restores the exact argument list.'],
      )),
    S('detailed_theory',
      P('`table.pack(...)` setara dengan `{n = select("#", ...), ...}` — ia hanya memudahkan corak biasa. Medan `n` ialah kunci biasa dalam bahagian hash table, jadi ia tidak mengganggu `ipairs` atau elemen senarai. Kerana `n` direkodkan pada masa pembungkusan, ia tetap betul walaupun table mempunyai lubang; tetapi jika anda kemudian menambah atau membuang elemen, anda mesti mengemas kini `n` sendiri — `table.insert` tidak mengetahui tentangnya.',
        '`table.pack(...)` is equivalent to `{n = select("#", ...), ...}` — it just makes a common pattern convenient. The `n` field is an ordinary key in the table’s hash part, so it does not interfere with `ipairs` or the list elements. Because `n` is recorded at packing time, it stays correct even when the table has holes; but if you later add or remove elements, you must update `n` yourself — `table.insert` knows nothing about it.'),
      P('Kegunaan utama ialah **menangguhkan panggilan**: simpan fungsi dan argumennya sekarang, jalankan kemudian. Ini asas sistem acara, baris gilir tugas, fungsi "debounce" dan "undo". Kerana argumen boleh `nil` secara sah (contohnya "kosongkan nilai ini"), menggunakan `{...}` dan `table.unpack(t)` tanpa julat boleh menghantar bilangan argumen yang salah. Dengan `table.pack` dan `t.n`, panggilan yang dimainkan semula adalah sama dengan yang asal.',
        'The main use is **deferring a call**: store a function and its arguments now, run it later. This is the basis of event systems, task queues, "debounce" functions and "undo". Because arguments can legitimately be `nil` (for example "clear this value"), using `{...}` and `table.unpack(t)` without a range can pass the wrong number of arguments. With `table.pack` and `t.n`, the replayed call is identical to the original.')),
    S('technical_terminology', TERMS('vararg', 'table', 'nil', 'first-class-function')),
    S('syntax_rules',
      UL(
        ['`local args = table.pack(...)` — sentiasa gunakan `args.n`, bukan `#args`.', '`local args = table.pack(...)` — always use `args.n`, not `#args`.'],
        ['`table.unpack(args, 1, args.n)` — julat eksplisit.', '`table.unpack(args, 1, args.n)` — an explicit range.'],
        ['`for i = 1, args.n do local v = args[i] … end`.', '`for i = 1, args.n do local v = args[i] … end`.'],
      )),
    S('code_demonstration',
      CODE('pack-basics', 'lua', 'lua54', ['table.pack dengan nil', 'table.pack with nils'], `
local args = table.pack("red", nil, "blue", nil)

print(args.n)
for i = 1, args.n do
  print(i, args[i])
end
print(select("#", table.unpack(args, 1, args.n)))
`, '4\n1\tred\n2\tnil\n3\tblue\n4\tnil\n4'),
      EXPLAIN('pack-basics',
        ['1', 'Empat argumen, dua daripadanya `nil`.', 'Four arguments, two of them `nil`.'],
        ['3', '`n` merekodkan bilangan sebenar: 4.', '`n` records the true count: 4.'],
        ['4–6', 'Gelung hingga `n` melawati setiap kedudukan, termasuk `nil`.', 'A loop up to `n` visits every position, including the `nil`s.'],
        ['7', 'Membuka dengan julat `1, n` memulihkan keempat-empat nilai, termasuk `nil` di hujung.', 'Unpacking with the range `1, n` restores all four values, including the trailing `nil`.'])),
    S('complete_examples',
      CODE('deferred-call', 'lua', 'lua54', ['Menyimpan panggilan untuk kemudian', 'Storing a call for later'], `
local queue = {}

local function later(fn, ...)
  queue[#queue + 1] = {fn = fn, args = table.pack(...)}
end

local function runAll()
  for _, job in ipairs(queue) do
    job.fn(table.unpack(job.args, 1, job.args.n))
  end
end

later(print, "first job", 1)
later(print, "nil at end:", nil)
later(print, nil, "leading nil")
print("queued:", #queue)
runAll()
`, 'queued:\t3\nfirst job\t1\nnil at end:\tnil\nnil\tleading nil'),
      EXPLAIN('deferred-call',
        ['1', 'Baris gilir tugas.', 'A job queue.'],
        ['3–5', 'Simpan fungsi dan **semua** argumennya, termasuk bilangannya.', 'Store the function and **all** its arguments, including their count.'],
        ['7–11', 'Kemudian, mainkan semula setiap panggilan dengan argumen yang tepat.', 'Later, replay every call with its exact arguments.'],
        ['13–15', 'Tiga tugas: dua argumen biasa, `nil` di hujung, dan `nil` di hadapan.', 'Three jobs: two ordinary arguments, a trailing `nil`, and a leading `nil`.'],
        ['16–17', 'Tiada apa-apa dicetak oleh tugas sehingga `runAll`; setiap `nil` dimainkan semula di kedudukan asalnya.', 'Nothing is printed by the jobs until `runAll`; every `nil` is replayed in its original position.']),
      CODE('pack-vs-braces', 'lua', 'lua54', ['{...} berbanding table.pack', '{...} versus table.pack'], `
local function compare(...)
  local braces = {...}
  local packed = table.pack(...)
  local fromBraces = select("#", table.unpack(braces, 1, 2))
  return packed.n, fromBraces, braces.n
end

print(compare("a", nil))
print(compare())
`, '2\t2\tnil\n0\t2\tnil', {
        debug: BUG(`
local saved = table.pack(1, 2)
for i = 1, saved.count do
  print(saved[i])
end
`, "example:2: bad 'for' limit (number expected, got nil)",
          'Medan dinamakan `n`, bukan `count`. `saved.count` ialah `nil`, dan gelung `for` berangka menolak had `nil` dengan mesej yang jelas. Gunakan `saved.n`. (Jika anda membina table sendiri, anda boleh menggunakan mana-mana nama — tetapi `table.pack` sentiasa menggunakan `n`.)',
          'The field is called `n`, not `count`. `saved.count` is `nil`, and the numeric `for` loop rejects a `nil` limit with a clear message. Use `saved.n`. (If you build the table yourself you may use any name — but `table.pack` always uses `n`.)'),
      }),
      EXPLAIN('pack-vs-braces',
        ['1–3', 'Dua cara mengumpul argumen yang sama.', 'Two ways of collecting the same arguments.'],
        ['4', 'Julat eksplisit `1, 2` sentiasa memberi dua nilai — tetapi anda mesti **tahu** bilangan itu dari tempat lain.', 'An explicit range `1, 2` always gives two values — but you must **know** that count from somewhere else.'],
        ['5', '`{...}` tiada medan `n`.', '`{...}` has no `n` field.'],
        ['8–9', 'Dengan `table.pack`, bilangan (2, kemudian 0) disimpan bersama data; dengan `{...}`, ia hilang.', 'With `table.pack`, the count (2, then 0) is stored with the data; with `{...}`, it is lost.'])),
    S('line_by_line',
      EXPLAIN('deferred-call',
        ['9', '`table.unpack(job.args, 1, job.args.n)` ialah argumen terakhir, jadi semua nilai yang dibuka dihantar kepada `job.fn` (kuliah 2.2).', '`table.unpack(job.args, 1, job.args.n)` is the last argument, so every unpacked value is passed to `job.fn` (lecture 2.2).']),
      EXPLAIN('pack-basics',
        ['1', 'Jangan gunakan `#args` di sini: dengan lubang, `#` boleh memberi sebarang sempadan yang sah, dan medan `n` tidak dikira oleh `#`.', 'Do not use `#args` here: with holes, `#` may return any valid border, and the `n` field is not counted by `#`.'])),
    S('why_this_way',
      P('Mengapa `table.pack` dan bukan sahaja `{...}`? Kerana `nil` ialah nilai yang sah dalam Lua, dan fungsi yang menyimpan argumen tidak boleh mengandaikan pemanggil tidak akan menghantar `nil`. `n` menjadikan pembungkusan dan pembukaan **tanpa kehilangan**.',
        'Why `table.pack` and not just `{...}`? Because `nil` is a valid value in Lua, and a function that stores arguments cannot assume the caller will never pass `nil`. `n` makes packing and unpacking **lossless**.'),
      P('Gunakan `table.pack` **apabila** argumen perlu disimpan atau dihantar ke tempat lain; `select` **apabila** anda hanya perlu bilangan atau satu argumen; `{...}` **apabila** anda pasti tiada `nil` (contohnya senarai nombor).', 'Use `table.pack` **when** arguments must be stored or passed elsewhere; `select` **when** you only need the count or one argument; `{...}` **when** you are sure there are no `nil`s (for example a list of numbers).')),
    S('execution_flow',
      OL(
        ['`later(print, "nil at end:", nil)` → `table.pack("nil at end:", nil)` → `{[1] = "nil at end:", n = 2}`.', '`later(print, "nil at end:", nil)` → `table.pack("nil at end:", nil)` → `{[1] = "nil at end:", n = 2}`.'],
        ['`runAll` → `table.unpack(args, 1, 2)` → "nil at end:", `nil`.', '`runAll` → `table.unpack(args, 1, 2)` → "nil at end:", `nil`.'],
        ['`print("nil at end:", nil)` → dua lajur, yang kedua "nil".', '`print("nil at end:", nil)` → two columns, the second "nil".'],
      )),
    S('memory_behaviour',
      P('`table.pack` memperuntukkan satu table bagi setiap panggilan, dengan bahagian senarai untuk argumen dan bahagian hash untuk `n`. Dalam baris gilir tugas, table ini hidup sehingga tugas dijalankan dan baris gilir dikosongkan. Jika baris gilir tidak pernah dikosongkan, argumen — termasuk table besar yang mungkin dirujuk — tidak pernah dikutip; ini punca kebocoran memori yang biasa dalam sistem acara.',
        '`table.pack` allocates one table per call, with a list part for the arguments and a hash part for `n`. In a job queue, these tables live until the jobs run and the queue is cleared. If the queue is never cleared, the arguments — including any large tables they refer to — are never collected; this is a common source of memory leaks in event systems.')),
    S('alternative_implementations',
      P('Versi manual `table.pack` menunjukkan apa yang dilakukannya:', 'A manual version of `table.pack` shows what it does:'),
      CODE('manual-pack', 'lua', 'lua54', ['table.pack ditulis sendiri', 'table.pack written by hand'], `
local function pack(...)
  return {n = select("#", ...), ...}
end

local t = pack(10, nil, 30)
print(t.n, t[1], t[2], t[3])
`, '3\t10\tnil\t30'),
      EXPLAIN('manual-pack',
        ['1–3', 'Constructor dengan medan `n` dan `...` sebagai item **terakhir** — supaya semua argumen dikembangkan.', 'A constructor with an `n` field and `...` as the **last** item — so every argument expands.'],
        ['5–6', 'Hasil yang sama seperti `table.pack`.', 'The same result as `table.pack`.'])),
    S('common_mistakes',
      UL(
        ['Menggunakan `#t` dan bukannya `t.n` selepas `table.pack`.', 'Using `#t` instead of `t.n` after `table.pack`.'],
        ['`table.unpack(t)` tanpa julat, kehilangan `nil` di hujung.', '`table.unpack(t)` without a range, losing trailing `nil`s.'],
        ['Mengubah table yang dibungkus tanpa mengemas kini `n`.', 'Changing a packed table without updating `n`.'],
        ['Tersalah nama medan (`count`, `size`, `len`).', 'Misnaming the field (`count`, `size`, `len`).'],
      )),
    S('debugging',
      P('Jika panggilan yang dimainkan semula berkelakuan berbeza daripada yang asal, bandingkan `select("#", ...)` semasa menyimpan dengan bilangan nilai yang dibuka semasa memainkan semula. Perbezaan menunjukkan `nil` yang hilang. Ralat `select` dengan indeks yang salah juga biasa — indeks mesti antara 1 dan bilangan argumen (atau negatif dari hujung):',
        'If a replayed call behaves differently from the original, compare `select("#", ...)` when storing with the number of values unpacked when replaying. A difference reveals a lost `nil`. Errors from `select` with a wrong index are also common — the index must be between 1 and the argument count (or negative from the end):'),
      CODE('nth-arg', 'lua', 'lua54', ['Mengambil argumen ke-n dengan selamat', 'Taking the n-th argument safely'], `
local function nth(n, ...)
  if n < 1 or n > select("#", ...) then
    return nil, "no argument " .. n
  end
  return (select(n, ...))
end

print(nth(2, "a", "b", "c"))
print(nth(0, "a"))
`, 'b\nnil\tno argument 0', {
        debug: BUG(`
local function nth(n, ...)
  return (select(n, ...))
end
print(nth(0, "a", "b"))
`, "example:2: bad argument #1 to 'select' (index out of range)",
          '`select(0, ...)` tidak sah: indeks mesti positif (dari permulaan) atau negatif (dari hujung), dan tidak pernah 0. Argumen **#1** ialah indeks itu sendiri. Sahkan julat sebelum memanggil, seperti versi asal.',
          '`select(0, ...)` is invalid: the index must be positive (from the start) or negative (from the end), never 0. Argument **#1** is the index itself. Validate the range before calling, as in the original version.'),
      }),
      EXPLAIN('nth-arg',
        ['1–4', 'Semak julat terhadap bilangan sebenar; pulangkan `nil, mesej` jika di luar.', 'Check the range against the true count; return `nil, message` if outside.'],
        ['5', 'Kurungan memastikan hanya satu nilai dipulangkan.', 'The parentheses make sure only one value is returned.'],
        ['8–9', 'Satu kejayaan dan satu kegagalan.', 'One success and one failure.'])),
    S('performance',
      P('`table.pack` memperuntukkan satu table — kos yang sama seperti `{...}` ditambah satu medan. Untuk fungsi yang hanya perlu bilangan, `select("#", ...)` lebih murah kerana ia tidak memperuntukkan apa-apa. Untuk lelaran berulang atas banyak argumen, satu `table.pack` lebih pantas daripada banyak panggilan `select(i, ...)`.',
        '`table.pack` allocates one table — the same cost as `{...}` plus one field. For functions that only need the count, `select("#", ...)` is cheaper because it allocates nothing. For repeated iteration over many arguments, one `table.pack` is faster than many `select(i, ...)` calls.')),
    S('software_engineering',
      P('Pengumpulan yang kehilangan argumen berbanding yang tidak:', 'Collection that loses arguments versus one that does not:'),
      CODE('poor-braces-record', 'lua', 'lua54', ['Pelaksanaan lemah: {...} dan ipairs', 'Poor implementation: {...} and ipairs'], `
local function recordCall(...)
  local args = {...}
  local parts = {}
  for _, v in ipairs(args) do parts[#parts + 1] = tostring(v) end
  return "call(" .. table.concat(parts, ", ") .. ")"
end

print(recordCall("save", nil, "draft"))
`, 'call(save)'),
      EXPLAIN('poor-braces-record',
        ['1–4', '`ipairs` berhenti pada `nil` pertama; "draft" hilang.', '`ipairs` stops at the first `nil`; "draft" is lost.'],
        ['5–8', 'Rekod panggilan salah — ia menunjukkan satu argumen dan bukannya tiga.', 'The call record is wrong — it shows one argument instead of three.']),
      CODE('improved-pack-record', 'lua', 'lua54', ['Pelaksanaan lebih baik: table.pack dan n', 'Improved implementation: table.pack and n'], `
local function recordCall(...)
  local args = table.pack(...)
  local parts = {}
  for i = 1, args.n do parts[i] = tostring(args[i]) end
  return "call(" .. table.concat(parts, ", ") .. ")"
end

print(recordCall("save", nil, "draft"))
`, 'call(save, nil, draft)'),
      EXPLAIN('improved-pack-record',
        ['1–4', 'Gelung hingga `args.n` merekod setiap argumen, termasuk `nil`.', 'A loop up to `args.n` records every argument, including `nil`.'],
        ['5–8', 'Rekod yang tepat.', 'An exact record.'])),
    S('industry_use_cases',
      UL(
        ['`vim.schedule` dan pemasa dalam Neovim menyimpan fungsi untuk dijalankan kemudian.', '`vim.schedule` and timers in Neovim store functions to run later.'],
        ['Sistem acara permainan menyimpan argumen acara dalam baris gilir sehingga bingkai seterusnya.', 'Game event systems store event arguments in a queue until the next frame.'],
        ['Pustaka ujian merekod panggilan pada fungsi tiruan (mock) bersama argumennya.', 'Test libraries record calls on mock functions together with their arguments.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah tugas `later(print, nil, nil)` pada `deferred-call` dan ramalkan output.', 'Add the job `later(print, nil, nil)` to `deferred-call` and predict the output.'],
        ['Tulis `packCount(...)` yang memulangkan `table.pack(...).n` dan bandingkan dengan `select("#", ...)`.', 'Write `packCount(...)` returning `table.pack(...).n` and compare it with `select("#", ...)`.'],
        ['Jalankan kedua-dua versi berpepijat.', 'Run both buggy versions.'],
      )),
    S('mini_project',
      P('**Fungsi tiruan (spy).** Tulis `spy(fn)` yang memulangkan fungsi baharu: ia merekod setiap panggilan (argumen penuh) dan kemudian memanggil `fn` sebenar.', '**A spy function.** Write `spy(fn)` that returns a new function: it records every call (full arguments) and then calls the real `fn`.'),
      CODE('spy-function', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function spy(fn)
  local calls = {}
  local wrapper = function(...)
    calls[#calls + 1] = table.pack(...)
    return fn(...)
  end
  return wrapper, calls
end

local add, calls = spy(function(a, b) return a + b end)
print(add(2, 3), add(10, 20))
print(#calls, calls[1].n, calls[2][2])
`, '5\t30\n2\t2\t20'),
      EXPLAIN('spy-function',
        ['1–2', 'Senarai rekod panggilan, dicipta sekali bagi setiap spy.', 'A list of call records, created once per spy.'],
        ['3–6', 'Pembalut variadic: rekod argumen dengan `table.pack`, kemudian majukan semuanya kepada `fn` dan pulangkan **semua** hasilnya.', 'A variadic wrapper: record the arguments with `table.pack`, then forward them all to `fn` and return **all** its results.'],
        ['7', 'Pulangkan pembalut dan senarai rekod (kuliah 4.3 menerangkan bagaimana pembalut "mengingati" `calls`).', 'Return the wrapper and the record list (lecture 4.3 explains how the wrapper "remembers" `calls`).'],
        ['10–12', 'Dua panggilan direkodkan; argumen kedua panggilan kedua ialah 20.', 'Two calls recorded; the second argument of the second call is 20.'])),
    S('summary',
      UL(
        ['`table.pack(...)` → table + medan `n` dengan bilangan tepat.', '`table.pack(...)` → a table + an `n` field with the exact count.'],
        ['Lelar dengan `for i = 1, t.n`; buka dengan `table.unpack(t, 1, t.n)`.', 'Iterate with `for i = 1, t.n`; unpack with `table.unpack(t, 1, t.n)`.'],
        ['`{...}` kehilangan bilangan apabila terdapat `nil`.', '`{...}` loses the count when there are `nil`s.'],
        ['Simpan panggilan untuk kemudian: fungsi + `table.pack` argumen.', 'Store a call for later: the function + `table.pack` of its arguments.'],
      )),
    S('knowledge_check',
      OL(
        ['Apakah `table.pack(nil, nil).n`?', 'What is `table.pack(nil, nil).n`?'],
        ['Mengapakah `table.unpack(t)` tanpa julat boleh kehilangan argumen?', 'Why can `table.unpack(t)` without a range lose arguments?'],
        ['Tulis `table.pack` menggunakan `select` sahaja.', 'Write `table.pack` using only `select`.'],
        ['Mengapakah baris gilir tugas yang tidak pernah dikosongkan boleh membocorkan memori?', 'Why can a job queue that is never cleared leak memory?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Lua 5.4 Reference Manual — table.pack', url: `${MANUAL}#pdf-table.pack` },
        { title: 'Lua 5.4 Reference Manual — table.unpack', url: `${MANUAL}#pdf-table.unpack` },
        { title: 'Lua 5.4 Reference Manual — select', url: `${MANUAL}#pdf-select` },
        { title: 'Lua 5.2 Reference Manual §8 — Incompatibilities (table.pack introduced)', url: 'https://www.lua.org/manual/5.2/manual.html#8' },
      )),
  ],
};

// ─── 3.3 Designing flexible function APIs ──────────────────────────────────

export const LUA104_3_3: LectureContentDef = {
  courseCode: 'LUA104',
  module: 3,
  lecture: 3,
  sections: [
    S('learning_objectives',
      OL(
        ['Mereka bentuk tandatangan fungsi: parameter wajib, pilihan, variadic dan table pilihan.', 'Design function signatures: required, optional, variadic and options-table parameters.'],
        ['Menerima beberapa bentuk input dengan semakan `type` (beban lampau ringan).', 'Accept several input shapes with `type` checks (light overloading).'],
        ['Memulangkan fungsi yang dikonfigurasi ([[higher-order-function|fungsi peringkat tinggi]]).', 'Return configured functions ([[higher-order-function|higher-order functions]]).'],
        ['Mengelakkan parameter boolean kedudukan yang mengelirukan.', 'Avoid confusing positional boolean parameters.'],
      )),
    S('prerequisite_knowledge',
      UL(
        ['Modul 1: argumen kurang/lebih, lalai dan table pilihan.', 'Module 1: fewer/more arguments, defaults and options tables.'],
        ['Kuliah 3.1–3.2: fungsi variadic dan `table.pack`.', 'Lectures 3.1–3.2: variadic functions and `table.pack`.'],
      )),
    S('introduction',
      P('API (antara muka pengaturcaraan aplikasi) sesuatu fungsi ialah cara ia dipanggil: nama, parameter, nilai pulangan dan tingkah laku ralat. API yang baik mudah digunakan dengan betul dan sukar digunakan dengan salah. Lua memberi banyak kebebasan — argumen pilihan, variadic, table, fungsi sebagai argumen — dan kuliah ini mengajar cara menggabungkannya dengan berdisiplin. Ini ialah kemahiran yang membezakan kod yang hanya berfungsi daripada pustaka yang orang lain mahu gunakan.',
        'A function’s API (application programming interface) is how it is called: its name, parameters, return values and error behaviour. A good API is easy to use correctly and hard to use incorrectly. Lua gives a lot of freedom — optional arguments, varargs, tables, functions as arguments — and this lecture teaches how to combine them with discipline. This skill separates code that merely works from libraries others want to use.'),
      KEY('Wajib dahulu, pilihan kemudian, banyak pilihan → table, sebarang bilangan → `...`.', 'Required first, optional after, many options → a table, any number → `...`.', ['Idea utama', 'Key idea'])),
    S('fundamental_concepts',
      UL(
        ['**Susunan parameter:** yang wajib dan paling penting dahulu.', '**Parameter order:** required and most important first.'],
        ['**Beban lampau ringan:** satu fungsi menerima nombor **atau** table dengan menyemak `type`.', '**Light overloading:** one function accepts a number **or** a table by checking `type`.'],
        ['**Kilang fungsi:** fungsi yang memulangkan fungsi yang telah dikonfigurasi.', '**Function factory:** a function that returns an already-configured function.'],
        ['**Ralat awam:** sahkan input dan laporkan pada tahap 2 dengan nama fungsi dalam mesej.', '**Public errors:** validate input and report at level 2 with the function name in the message.'],
      )),
    S('detailed_theory',
      P('Setiap pilihan reka bentuk mempunyai kos. Parameter kedudukan ringkas tetapi menjadi samar selepas tiga atau empat (`draw(10, 20, true, false)` — apakah maksud `true`?). Table pilihan mendokumenkan diri sendiri (`draw{x = 10, y = 20, filled = true}`) tetapi memperuntukkan table dan tidak boleh disemak oleh pengkompil. Variadic sesuai hanya apabila semua argumen tambahan mempunyai peranan yang sama. Beban lampau dengan `type` menjadikan pemanggil lebih selesa, tetapi setiap bentuk tambahan mesti didokumenkan dan diuji.',
        'Every design choice has a cost. Positional parameters are short but become cryptic after three or four (`draw(10, 20, true, false)` — what does `true` mean?). An options table is self-documenting (`draw{x = 10, y = 20, filled = true}`) but allocates a table and cannot be checked by the compiler. Varargs fit only when all extra arguments play the same role. Overloading with `type` makes callers more comfortable, but every extra shape must be documented and tested.'),
      P('Fungsi yang memulangkan fungsi — kilang — membolehkan konfigurasi dilakukan **sekali** dan penggunaan berulang kali tanpa mengulang tetapan: `local fmt = makeFormatter{currency = "RM"}` kemudian `fmt(12.5)`. Ini memisahkan "bila konfigurasi dipilih" daripada "bila kerja dilakukan". Akhirnya, ralat yang baik ialah sebahagian daripada API: mesej yang menyebut nama fungsi, parameter dan jenis yang diterima, dilaporkan pada baris pemanggil dengan `error(mesej, 2)`, menjimatkan masa penyahpepijatan pengguna.',
        'A function returning a function — a factory — lets configuration happen **once** and use happen many times without repeating the settings: `local fmt = makeFormatter{currency = "RM"}` then `fmt(12.5)`. This separates "when the configuration is chosen" from "when the work is done". Finally, good errors are part of the API: a message naming the function, the parameter and the type received, reported at the caller’s line with `error(message, 2)`, saves the user debugging time.')),
    S('technical_terminology', TERMS('higher-order-function', 'parameter', 'vararg', 'first-class-function')),
    S('syntax_rules',
      UL(
        ['Tandatangan biasa: `f(wajib1, wajib2, pilihan, ...)` atau `f(wajib, opts)`.', 'Typical signatures: `f(required1, required2, optional, ...)` or `f(required, opts)`.'],
        ['Beban lampau: `if type(x) == "table" then … elseif type(x) == "number" then … else error(…, 2) end`.', 'Overloading: `if type(x) == "table" then … elseif type(x) == "number" then … else error(…, 2) end`.'],
        ['Kilang: `local function make(config) return function(input) … end end`.', 'Factory: `local function make(config) return function(input) … end end`.'],
      )),
    S('code_demonstration',
      CODE('flexible-area', 'lua', 'lua54', ['Satu fungsi, beberapa bentuk input', 'One function, several input shapes'], `
local function area(shape)
  if type(shape) == "number" then
    return shape * shape
  elseif type(shape) == "table" then
    return (shape.width or shape[1]) * (shape.height or shape[2])
  end
  error("area: expected number or table, got " .. type(shape), 2)
end

print(area(5))
print(area({3, 4}))
print(area({width = 2, height = 7}))
`, '25\n12\n14', {
        debug: BUG(`
local function area(shape)
  if type(shape) == "number" then return shape * shape end
  if type(shape) == "table" then return shape[1] * shape[2] end
  error("area: expected number or table, got " .. type(shape), 2)
end
print(area("5x5"))
`, 'example:6: area: expected number or table, got string',
          'Rentetan "5x5" bukan salah satu bentuk yang disokong. Fungsi menolaknya dengan mesej yang menyebut nama fungsi, bentuk yang dijangka dan jenis yang diterima, dan tahap 2 meletakkan ralat pada baris 6 — baris pemanggil. Bandingkan dengan ralat `attempt to perform arithmetic on a string value` yang mengelirukan jika tiada semakan.',
          'The string "5x5" is not one of the supported shapes. The function rejects it with a message naming the function, the expected shapes and the received type, and level 2 places the error on line 6 — the caller’s line. Compare this with the confusing `attempt to perform arithmetic on a string value` you would get without the check.'),
      }),
      EXPLAIN('flexible-area',
        ['1–3', 'Nombor: segi empat sama.', 'A number: a square.'],
        ['4–5', 'Table: menerima medan bernama **atau** kedudukan.', 'A table: accepts named fields **or** positions.'],
        ['7', 'Mana-mana bentuk lain ialah kesilapan pemanggil — dilaporkan pada tahap 2.', 'Any other shape is a caller mistake — reported at level 2.'],
        ['10–12', 'Tiga cara memanggil fungsi yang sama.', 'Three ways to call the same function.'])),
    S('complete_examples',
      CODE('formatter-factory', 'lua', 'lua54', ['Kilang fungsi yang dikonfigurasi', 'A configured function factory'], `
local function makeFormatter(opts)
  opts = opts or {}
  local currency = opts.currency or "RM"
  local decimals = opts.decimals or 2
  local pattern = "%s %." .. decimals .. "f"
  return function(amount)
    return string.format(pattern, currency, amount)
  end
end

local ringgit = makeFormatter()
local yen = makeFormatter{currency = "JPY", decimals = 0}
print(ringgit(12.5), yen(1500))
print(ringgit(0.1 + 0.2))
`, 'RM 12.50\tJPY 1500\nRM 0.30'),
      EXPLAIN('formatter-factory',
        ['1–5', 'Konfigurasi dibaca dan disediakan **sekali**, termasuk corak format.', 'The configuration is read and prepared **once**, including the format pattern.'],
        ['6–8', 'Fungsi yang dipulangkan hanya menerima jumlah; ia mengingati `pattern` dan `currency` (kuliah 4.3).', 'The returned function takes only an amount; it remembers `pattern` and `currency` (lecture 4.3).'],
        ['11–12', 'Dua pemformat dengan konfigurasi berbeza.', 'Two formatters with different configurations.'],
        ['13–14', 'Penggunaan ringkas; `%.2f` juga menyembunyikan ralat float `0.30000000000000004`.', 'Short use; `%.2f` also hides the float error `0.30000000000000004`.']),
      CODE('options-first', 'lua', 'lua54', ['Parameter wajib dan table pilihan', 'Required parameters and an options table'], `
local function padText(text, width, opts)
  opts = opts or {}
  local fill = opts.fill or " "
  local gap = width - #text
  if gap <= 0 then return text end
  if opts.align == "right" then
    return string.rep(fill, gap) .. text
  end
  return text .. string.rep(fill, gap)
end

print("[" .. padText("id", 6) .. "]")
print("[" .. padText("42", 6, {align = "right", fill = "0"}) .. "]")
`, '[id    ]\n[000042]', {
        debug: BUG(`
local function padText(opts, text, width)
  local gap = width - #text
  return text .. string.rep(opts.fill, gap)
end
print(padText("id", 6, {fill = "."}))
`, "example:2: attempt to get length of a number value (local 'text')",
          'Tandatangan meletakkan `opts` **dahulu**, tetapi pemanggil menulis susunan semula jadi: teks, lebar, pilihan. Jadi `opts` = "id", `text` = 6, `width` = table — dan `#text` gagal pada nombor. Susunan parameter yang tidak semula jadi menyebabkan kesilapan seperti ini; letakkan parameter wajib dahulu dan table pilihan terakhir.',
          'The signature puts `opts` **first**, but the caller writes the natural order: text, width, options. So `opts` = "id", `text` = 6, `width` = the table — and `#text` fails on a number. An unnatural parameter order invites mistakes like this; put required parameters first and the options table last.'),
      }),
      EXPLAIN('options-first',
        ['1–3', 'Dua parameter wajib; table pilihan terakhir dan pilihan sendiri.', 'Two required parameters; the options table last and itself optional.'],
        ['4–5', 'Teks yang sudah cukup panjang dipulangkan tanpa perubahan.', 'Text that is already long enough is returned unchanged.'],
        ['6–9', 'Penjajaran kanan atau kiri (lalai).', 'Right or left (default) alignment.'],
        ['12–13', 'Panggilan ringkas untuk kes biasa; pilihan bernama untuk kes khas.', 'A short call for the common case; named options for the special case.'])),
    S('line_by_line',
      EXPLAIN('flexible-area',
        ['5', '`shape.width or shape[1]` membenarkan kedua-dua `{width = 2, …}` dan `{2, …}` — satu baris menyokong dua konvensyen pemanggil.', '`shape.width or shape[1]` allows both `{width = 2, …}` and `{2, …}` — one line supports two caller conventions.']),
      EXPLAIN('formatter-factory',
        ['5', 'Corak dibina **di luar** fungsi yang dipulangkan, jadi penggabungan string berlaku sekali, bukan pada setiap panggilan.', 'The pattern is built **outside** the returned function, so the string concatenation happens once, not on every call.'])),
    S('why_this_way',
      P('Mengapa melabur dalam reka bentuk API? Kerana kod dibaca dan dipanggil jauh lebih kerap daripada ditulis. API yang jelas mengurangkan kesilapan di setiap tempat ia digunakan, manakala API yang mengelirukan menghasilkan pepijat berulang kali, dalam kod orang lain.',
        'Why invest in API design? Because code is read and called far more often than it is written. A clear API reduces mistakes everywhere it is used, while a confusing API produces bugs again and again, in other people’s code.'),
      P('Gunakan beban lampau `type` **apabila** beberapa bentuk input benar-benar biasa; gunakan kilang **apabila** konfigurasi yang sama digunakan berkali-kali; gunakan table pilihan **apabila** terdapat lebih daripada dua atau tiga pilihan, atau sebarang boolean.', 'Use `type` overloading **when** several input shapes are genuinely common; use a factory **when** the same configuration is used many times; use an options table **when** there are more than two or three options, or any boolean.')),
    S('execution_flow',
      OL(
        ['`makeFormatter{currency = "JPY", decimals = 0}`: `pattern = "%s %.0f"`; fungsi baharu dipulangkan.', '`makeFormatter{currency = "JPY", decimals = 0}`: `pattern = "%s %.0f"`; a new function is returned.'],
        ['`yen(1500)` menjalankan badan fungsi dalaman dengan `amount = 1500`.', '`yen(1500)` runs the inner function’s body with `amount = 1500`.'],
        ['Fungsi dalaman masih melihat `pattern` dan `currency` daripada panggilan `makeFormatter`.', 'The inner function still sees `pattern` and `currency` from the `makeFormatter` call.'],
      )),
    S('memory_behaviour',
      P('Setiap panggilan kilang mencipta fungsi baharu yang memegang konfigurasinya. Selagi fungsi itu (`yen`) wujud, string `pattern` dan `currency` juga wujud. Ini murah untuk beberapa pemformat; tetapi mencipta kilang baharu di dalam gelung panas mencipta fungsi baharu setiap kali — cipta sekali, gunakan berkali-kali.',
        'Every factory call creates a new function holding its configuration. As long as that function (`yen`) exists, the `pattern` and `currency` strings exist too. This is cheap for a few formatters; but calling a factory inside a hot loop creates a new function every time — create once, use many times.')),
    S('alternative_implementations',
      P('Varian: fungsi variadic dengan pilihan sebagai argumen pertama yang pilihan — dikesan dengan `type`:', 'A variant: a variadic function with options as an optional first argument — detected with `type`:'),
      CODE('optional-first-table', 'lua', 'lua54', ['Pilihan pilihan sebelum varargs', 'Optional options before varargs'], `
local function joinAll(first, ...)
  local sep = ", "
  local items = table.pack(...)
  if type(first) == "table" then
    sep = first.sep or sep
  else
    items = table.pack(first, ...)
  end
  return table.concat(items, sep, 1, items.n)
end

print(joinAll("a", "b", "c"))
print(joinAll({sep = " | "}, "a", "b", "c"))
`, 'a, b, c\na | b | c'),
      EXPLAIN('optional-first-table',
        ['1–3', 'Andaikan argumen pertama ialah pilihan; bungkus selebihnya.', 'Assume the first argument is the options; pack the rest.'],
        ['4–8', 'Jika argumen pertama bukan table, ia sebenarnya item — bungkus semula termasuk ia.', 'If the first argument is not a table, it is really an item — repack including it.'],
        ['9', '`table.concat(t, sep, i, j)` dengan julat eksplisit.', '`table.concat(t, sep, i, j)` with an explicit range.'],
        ['12–13', 'Kedua-dua bentuk berfungsi. Kelemahan: item yang sendiri table tidak boleh dihantar dahulu — dokumenkan had sebegini.', 'Both forms work. The drawback: an item that is itself a table cannot come first — document limits like this.'])),
    S('common_mistakes',
      UL(
        ['Parameter boolean kedudukan (`save(data, true, false)`).', 'Positional boolean parameters (`save(data, true, false)`).'],
        ['Table pilihan sebelum parameter wajib.', 'An options table before required parameters.'],
        ['Beban lampau tanpa cabang `else` yang menolak input lain.', 'Overloading without an `else` branch that rejects other input.'],
        ['Mesej ralat tanpa nama fungsi atau jenis yang diterima.', 'Error messages without the function name or the received type.'],
      )),
    S('debugging',
      P('Apabila fungsi berkelakuan pelik dengan argumen yang kelihatan betul, semak susunan: cetak `type` setiap parameter pada baris pertama fungsi. Ralat seperti `attempt to get length of a number value (local \'text\')` sering bermakna argumen dihantar dalam susunan yang salah. Untuk fungsi yang menerima beberapa bentuk, uji setiap bentuk, dan sekurang-kurangnya satu bentuk yang **tidak** disokong:',
        'When a function behaves oddly with arguments that look right, check the order: print the `type` of every parameter on the function’s first line. Errors such as `attempt to get length of a number value (local \'text\')` often mean the arguments were passed in the wrong order. For functions that accept several shapes, test every shape, and at least one shape that is **not** supported:'),
      CODE('shape-tests', 'lua', 'lua54', ['Menguji setiap bentuk input', 'Testing every input shape'], `
local function toList(value)
  if type(value) == "table" then return value end
  if value == nil then return {} end
  return {value}
end

for _, input in ipairs({{"a", "b"}, "solo", 7}) do
  print(type(input), #toList(input))
end
print(#toList(nil))
`, 'table\t2\nstring\t1\nnumber\t1\n0'),
      EXPLAIN('shape-tests',
        ['1–5', 'Normalisasi: table dipulangkan seperti sedia ada; `nil` menjadi senarai kosong; nilai tunggal dibalut.', 'Normalisation: a table is returned as is; `nil` becomes an empty list; a single value is wrapped.'],
        ['7–9', 'Uji tiga bentuk dalam satu gelung.', 'Test three shapes in one loop.'],
        ['10', '`nil` diuji secara berasingan kerana ia tidak boleh disimpan dalam senarai ujian.', '`nil` is tested separately because it cannot be stored in the test list.'])),
    S('performance',
      P('Semakan `type` dan table pilihan mempunyai kos kecil yang tidak penting untuk kebanyakan fungsi. Untuk fungsi panas, kilang membantu prestasi: kerja persediaan (membina corak, menyemak pilihan) dilakukan sekali, dan fungsi yang dipulangkan hanya melakukan kerja teras.',
        '`type` checks and options tables have small costs that do not matter for most functions. For hot functions, factories help performance: setup work (building patterns, checking options) happens once, and the returned function does only the core work.')),
    S('software_engineering',
      P('Boolean kedudukan berbanding pilihan bernama:', 'Positional booleans versus named options:'),
      CODE('poor-boolean-flags', 'lua', 'lua54', ['Pelaksanaan lemah: boolean kedudukan', 'Poor implementation: positional booleans'], `
local function describeUser(name, showEmail, upper, short)
  local label = short and name:sub(1, 3) or name
  if upper then label = label:upper() end
  if showEmail then label = label .. " <" .. name .. "@example.com>" end
  return label
end

print(describeUser("nadia", true, false, true))
`, 'nad <nadia@example.com>'),
      EXPLAIN('poor-boolean-flags',
        ['1–6', 'Tiga boolean kedudukan; hanya penulis fungsi tahu susunannya.', 'Three positional booleans; only the function’s author knows their order.'],
        ['8', '`true, false, true` tidak bermakna apa-apa kepada pembaca panggilan.', '`true, false, true` means nothing to someone reading the call.']),
      CODE('improved-named-flags', 'lua', 'lua54', ['Pelaksanaan lebih baik: pilihan bernama', 'Improved implementation: named options'], `
local function describeUser(name, opts)
  opts = opts or {}
  local label = opts.short and name:sub(1, 3) or name
  if opts.upper then label = label:upper() end
  if opts.showEmail then label = label .. " <" .. name .. "@example.com>" end
  return label
end

print(describeUser("nadia", {showEmail = true, short = true}))
print(describeUser("nadia"))
`, 'nad <nadia@example.com>\nnadia'),
      EXPLAIN('improved-named-flags',
        ['1–7', 'Logik yang sama; setiap pilihan dibaca dengan nama.', 'The same logic; every option is read by name.'],
        ['9–10', 'Panggilan mendokumenkan diri sendiri, dan pilihan yang tidak diperlukan ditinggalkan.', 'The call documents itself, and unneeded options are left out.'])),
    S('industry_use_cases',
      UL(
        ['`vim.keymap.set(mode, lhs, rhs, opts)` — parameter wajib dahulu, table pilihan terakhir.', '`vim.keymap.set(mode, lhs, rhs, opts)` — required parameters first, the options table last.'],
        ['Pustaka seperti Penlight dan lume menerima beberapa bentuk input dan mengesahkan dengan mesej ralat yang jelas.', 'Libraries such as Penlight and lume accept several input shapes and validate with clear error messages.'],
        ['Kilang fungsi digunakan untuk pengelog yang dikonfigurasi dan pengesah input.', 'Function factories are used for configured loggers and input validators.'],
      )),
    S('practical_demonstration',
      OL(
        ['Tambah sokongan `{side = 5}` pada `area`.', 'Add support for `{side = 5}` to `area`.'],
        ['Tulis `makeValidator(min, max)` yang memulangkan fungsi `check(n)` → `true` atau `nil, mesej`.', 'Write `makeValidator(min, max)` returning a function `check(n)` → `true` or `nil, message`.'],
        ['Jalankan kedua-dua versi berpepijat dan tulis semula tandatangan `padText` yang salah.', 'Run both buggy versions and rewrite the wrong `padText` signature.'],
      )),
    S('mini_project',
      P('**Pembina jadual teks.** Tulis `makeTable(widths)` yang memulangkan fungsi `row(...)`: setiap panggilan memformat argumennya ke dalam lajur dengan lebar tetap.', '**A text table builder.** Write `makeTable(widths)` returning a function `row(...)`: each call formats its arguments into fixed-width columns.'),
      CODE('text-table', 'lua', 'lua54', ['Penyelesaian contoh', 'Example solution'], `
local function makeTable(widths)
  local formats = {}
  for i, w in ipairs(widths) do
    formats[i] = "%-" .. w .. "s"
  end
  return function(...)
    local cells = table.pack(...)
    local out = {}
    for i = 1, #widths do
      out[i] = string.format(formats[i], tostring(cells[i] or ""))
    end
    return (table.concat(out, "|"):gsub("%s+$", ""))
  end
end

local row = makeTable({6, 8, 5})
print(row("Code", "Course", "Hours"))
print(row("LUA104", "Funcs", 3))
print(row("LUA105"))
`, 'Code  |Course  |Hours\nLUA104|Funcs   |3\nLUA105|        |'),
      EXPLAIN('text-table',
        ['1–5', 'Kilang: bina format lajur rata kiri (`%-6s`) sekali.', 'Factory: build left-aligned column formats (`%-6s`) once.'],
        ['6–8', 'Fungsi yang dipulangkan menerima sebarang bilangan sel.', 'The returned function accepts any number of cells.'],
        ['9–11', 'Satu sel bagi setiap lajur; sel yang hilang menjadi kosong, dan `tostring` menukar nombor.', 'One cell per column; missing cells become empty, and `tostring` converts numbers.'],
        ['12', 'Cantum dengan `|`; buang ruang di hujung. Kurungan memotong nilai kedua `gsub` (kuliah 2.2).', 'Join with `|`; trim trailing spaces. The parentheses drop `gsub`’s second value (lecture 2.2).'],
        ['16–19', 'Satu konfigurasi, tiga baris.', 'One configuration, three rows.'])),
    S('summary',
      UL(
        ['Wajib dahulu; pilihan kemudian; banyak pilihan → table terakhir.', 'Required first; optional after; many options → a table last.'],
        ['Beban lampau dengan `type`, dengan cabang `else` yang menolak.', 'Overload with `type`, with an `else` branch that rejects.'],
        ['Kilang: konfigurasi sekali, gunakan berkali-kali.', 'Factories: configure once, use many times.'],
        ['Ralat ialah sebahagian daripada API: nama fungsi, jangkaan, jenis sebenar, tahap 2.', 'Errors are part of the API: the function name, the expectation, the actual type, level 2.'],
      )),
    S('knowledge_check',
      OL(
        ['Mengapakah `save(data, true, false)` ialah API yang lemah?', 'Why is `save(data, true, false)` a weak API?'],
        ['Di manakah table pilihan patut diletakkan dalam senarai parameter?', 'Where should an options table go in a parameter list?'],
        ['Apakah kelebihan kilang fungsi berbanding menghantar pilihan pada setiap panggilan?', 'What is the advantage of a function factory over passing options on every call?'],
        ['Apakah yang patut dilakukan oleh fungsi beban lampau dengan input yang tidak disokong?', 'What should an overloaded function do with unsupported input?'],
      ),
      INFO('Jawapan dan latihan bertanda tersedia dalam Pusat Latihan, bukan dalam bahan kuliah.', 'Answers and graded exercises are in the Practice Center, not in the lecture materials.')),
    S('references',
      LINKS(
        { title: 'Programming in Lua (1st ed.) — 5.3 Named Arguments', url: `${PIL}/5.3.html` },
        { title: 'Lua 5.4 Reference Manual — type', url: `${MANUAL}#pdf-type` },
        { title: 'Lua 5.4 Reference Manual — table.concat', url: `${MANUAL}#pdf-table.concat` },
        { title: 'Neovim documentation — vim.keymap.set (options-table API)', url: 'https://neovim.io/doc/user/lua.html#vim.keymap.set()' },
      )),
  ],
};

export const LUA104_M3 = [LUA104_3_1, LUA104_3_2, LUA104_3_3];
