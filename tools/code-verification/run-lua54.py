"""Run a Lua 5.4 chunk with the reference C interpreter (via lupa).

    python3 run-lua54.py CODE_FILE < input.txt     # io.read() reads the example's input from stdin
    python3 run-lua54.py < code.lua                 # (legacy) code on stdin, no input

The chunk is named "=example" so error positions are deterministic (e.g. "example:3: ...").
Compile errors are reported exactly as Lua reports them; runtime errors include the traceback.
Exit status 1 on any error.
"""
import sys
from lupa import lua54

lua = lua54.LuaRuntime()
if len(sys.argv) > 1:
    with open(sys.argv[1], encoding="utf-8") as f:
        source = f.read()
else:
    source = sys.stdin.read()

runner = lua.eval('''function(src)
  local f, err = load(src, "=example")
  if not f then return false, err end
  local ok, msg = xpcall(f, debug.traceback)
  io.stdout:flush()
  return ok, msg
end''')
ok, msg = runner(source)
if not ok:
    sys.stdout.flush()
    print(msg, file=sys.stderr)
    sys.exit(1)
