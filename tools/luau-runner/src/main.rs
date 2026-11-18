// Runs a Luau source file with the official Luau VM (compiled from source via the mlua crate,
// feature "luau" → luau0-src). Used ONLY to verify course-material code examples.
// - Executes code; does NOT run the Luau type checker (luau-analyze).
// - No Roblox APIs exist here (`game`, `Instance`, … are nil).
// Exit code 1 on compile/runtime error (message on stderr).
use mlua::Lua;

fn main() {
    let path = std::env::args().nth(1).expect("usage: luau-runner <file.luau>");
    let src = std::fs::read_to_string(&path).expect("cannot read file");
    let lua = Lua::new();
    // "=example" gives deterministic error positions such as "example:3: …".
    if let Err(e) = lua.load(&src).set_name("=example").exec() {
        eprintln!("{e}");
        std::process::exit(1);
    }
}
