import type { LuaEngine } from 'wasmoon';

/**
 * Runs one example inside a fresh Lua 5.4 state (wasmoon) with the same observable behaviour as
 * the reference runner used by `npm run verify:code`:
 * - chunk name "=example" (errors read "example:3: …");
 * - print / io.write / io.stdout:write captured (io.write formats floats with "%.14g", like C Lua);
 *   io.stdout stays the real file userdata — only its write/flush methods are wrapped;
 * - io.read reads the example's `input` ("l", "L", "n", "a" and byte counts);
 * - os.exit is disabled; output is capped so a runaway loop cannot exhaust memory.
 * Tests run every lua54 example and debug variant through this harness and compare with the
 * reference interpreter's verified output and errors.
 */
const HARNESS = String.raw`
local src, input = __QSRC, __QINPUT or ''
__QSRC, __QINPUT = nil, nil
local tostring, select, concat, type, mtype = tostring, select, table.concat, type, math.type
local out, size = {}, 0
local function emit(s)
  size = size + #s
  if size > 200000 then error('output limit exceeded (200 kB)', 0) end
  out[#out + 1] = s
end
print = function(...)
  local n = select('#', ...)
  local parts = {}
  for i = 1, n do parts[i] = tostring((select(i, ...))) end
  emit(concat(parts, '\t') .. '\n')
end
local function writeAll(...)
  for i = 1, select('#', ...) do
    local v = select(i, ...)
    if mtype(v) == 'float' then emit(string.format('%.14g', v))
    elseif type(v) == 'number' or type(v) == 'string' then emit(tostring(v))
    else error("bad argument #" .. i .. " to 'write' (string expected, got " .. type(v) .. ")", 2) end
  end
end
-- Capture io.stdout:write without replacing io.stdout, so it stays a real file userdata
-- (type(io.stdout) == "userdata", io.type(io.stdout) == "file"), exactly as in the reference runner.
local stdout = io.stdout
local fileMethods = getmetatable(stdout).__index
local realWrite, realFlush = fileMethods.write, fileMethods.flush
fileMethods.write = function(f, ...)
  if f == stdout then writeAll(...) return f end
  return realWrite(f, ...)
end
fileMethods.flush = function(f)
  if f == stdout then return f end
  return realFlush(f)
end
io.write = function(...) writeAll(...) return stdout end
local pos = 1
local function readOne(fmt)
  if type(fmt) == 'number' then
    if pos > #input then return nil end
    local s = input:sub(pos, pos + fmt - 1)
    pos = pos + #s
    return s
  end
  local f = tostring(fmt):gsub('^%*', ''):sub(1, 1)
  if f == 'l' or f == 'L' then
    if pos > #input then return nil end
    local nl = input:find('\n', pos, true)
    local line
    if nl then line = input:sub(pos, f == 'L' and nl or nl - 1); pos = nl + 1
    else line = input:sub(pos); pos = #input + 1 end
    return line
  elseif f == 'a' then
    local s = input:sub(pos)
    pos = #input + 1
    return s
  elseif f == 'n' then
    local s, e = input:find('^%s*[%+%-]?[%w%.]+', pos)
    if not s then return nil end
    local v = tonumber((input:sub(s, e):gsub('^%s+', '')))
    if v == nil then return nil end
    pos = e + 1
    return v
  end
  error("bad argument #1 to 'read' (invalid format)", 3)
end
io.read = function(...)
  local n = select('#', ...)
  if n == 0 then return readOne('l') end
  local res = {}
  for i = 1, n do
    local v = readOne((select(i, ...)))
    res[i] = v
    if v == nil then return table.unpack(res, 1, i) end
  end
  return table.unpack(res, 1, n)
end
io.lines = nil
os.exit = function() error('os.exit is not available in the browser runner', 2) end
local chunk, cerr = load(src, '=example')
if not chunk then return { ok = false, err = tostring(cerr), out = concat(out) } end
local ok, err = pcall(chunk)
return { ok = ok, err = ok and '' or tostring(err), out = concat(out) }
`;

export interface LuaRunResult {
  ok: boolean;
  /** Program output (print / io.write), without the final newline — comparable to expectedOutput. */
  output: string;
  /** Error message (first line, as Lua reports it), empty when ok. */
  error: string;
}

export async function runInEngine(engine: LuaEngine, code: string, input = ''): Promise<LuaRunResult> {
  engine.global.set('__QSRC', code);
  engine.global.set('__QINPUT', input);
  const r = (await engine.doString(HARNESS)) as { ok: boolean; err: string; out: string };
  return { ok: Boolean(r.ok), output: String(r.out ?? '').replace(/\n$/, ''), error: String(r.err ?? '').split('\n')[0] ?? '' };
}
