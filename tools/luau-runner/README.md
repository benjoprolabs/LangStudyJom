# luau-runner

A minimal command-line runner around the **official Luau VM**. It is compiled from source with the
`mlua` crate (feature `luau`, which vendors `luau0-src`). It is used only to verify that course-material
code examples run and print their documented output.

```bash
cargo build --release --manifest-path tools/luau-runner/Cargo.toml
tools/luau-runner/target/release/luau-runner file.luau
```

Limits:

- It **executes** code. It does not run the Luau type checker (`luau-analyze`), so `--!strict`
  type checking is not verified.
- Roblox engine APIs (`game`, `Instance`, `Players` and so on) do not exist here. Examples that use
  them are marked `runtime: 'roblox'` and are never executed.
