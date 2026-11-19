"""Run a Python example with the reference interpreter, CPython 3.13.

    python3 run-python.py CODE_FILE < input.txt     # input() reads the example's input from stdin

The code is compiled under the name "example.py" and executed as __main__ in a fresh namespace, from the
example's own temporary directory (so file examples write there). Errors are reported on ONE line, in a
deterministic form the lectures can quote:

    example.py:<line>: <ExceptionType>: <message>      runtime error (line of the innermost frame in example.py)
    example.py:<line>: SyntaxError: <message>          compile error (also IndentationError / TabError)

Exit status 1 on any error, 3 when the interpreter is not Python 3.13 (verification must not silently use
another version). stdout is flushed before the error is written.
"""
import sys
import traceback

NAME = "example.py"
REQUIRED = (3, 13)

if sys.version_info[:2] != REQUIRED:
    print(f"runner error: Python {REQUIRED[0]}.{REQUIRED[1]} is required, found {sys.version.split()[0]}", file=sys.stderr)
    sys.exit(3)


def report(line, exc):
    message = str(exc)
    sys.stdout.flush()
    print(f"{NAME}:{line}: {type(exc).__name__}: {message}" if message else f"{NAME}:{line}: {type(exc).__name__}", file=sys.stderr)
    sys.exit(1)


with open(sys.argv[1], encoding="utf-8") as f:
    source = f.read()

try:
    code = compile(source, NAME, "exec")
except SyntaxError as e:  # includes IndentationError and TabError
    sys.stdout.flush()
    print(f"{NAME}:{e.lineno}: {type(e).__name__}: {e.msg}", file=sys.stderr)
    sys.exit(1)

namespace = {"__name__": "__main__", "__builtins__": __builtins__}
try:
    exec(code, namespace)
except SystemExit as e:  # sys.exit() inside an example: success only for 0 / None
    if e.code not in (None, 0):
        line = next((fr.lineno for fr in reversed(traceback.extract_tb(e.__traceback__)) if fr.filename == NAME), "?")
        report(line, e)
except BaseException as e:  # noqa: BLE001 — every failure must be reported in the same form
    line = next((fr.lineno for fr in reversed(traceback.extract_tb(e.__traceback__)) if fr.filename == NAME), "?")
    report(line, e)
sys.stdout.flush()
