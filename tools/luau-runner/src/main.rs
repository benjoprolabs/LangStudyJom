// Runs a Luau source file with the official Luau VM (compiled from source via the mlua crate,
// feature "luau" → luau0-src). Used ONLY to verify course-material code examples.
//
//   luau-runner FILE            compile and EXECUTE (stdout = program output)
//   luau-runner --check FILE    compile only, never execute (syntax check for Roblox examples)
//
// - Does NOT run the Luau type checker (luau-analyze): type annotations are parsed, not verified.
// - No Roblox APIs exist here (`game`, `Instance`, … are nil), which is why Roblox examples are
//   only ever compiled with --check.
// Exit code 1 on compile/runtime error (message on stderr).
use mlua::Lua;

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let (check_only, path) = match args.as_slice() {
        [flag, path] if flag == "--check" => (true, path.clone()),
        [path] => (false, path.clone()),
        _ => {
            eprintln!("usage: luau-runner [--check] <file.luau>");
            std::process::exit(2);
        }
    };
    let src = std::fs::read_to_string(&path).expect("cannot read file");
    let lua = Lua::new();
    // "=example" gives deterministic error positions such as "example:3: …".
    let chunk = lua.load(&src).set_name("=example");
    let result = if check_only { chunk.into_function().map(|_| ()) } else { chunk.exec() };
    if let Err(e) = result {
        eprintln!("{e}");
        std::process::exit(1);
    }
}
