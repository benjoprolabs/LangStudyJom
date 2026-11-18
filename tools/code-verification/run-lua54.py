"""Run a Lua 5.4 chunk from stdin with the reference C interpreter (via lupa).

The chunk is named "=example" so error positions are deterministic (e.g. "example:3: ...").
"""
import sys
from lupa import lua54

lua = lua54.LuaRuntime()
source = sys.stdin.read()
loader = lua.eval('function(src) return assert(load(src, "=example")) end')
try:
    loader(source)()
except Exception as exc:  # LuaError
    sys.stdout.flush()
    print(exc, file=sys.stderr)
    sys.exit(1)
