# Examples

This folder contains example games written in different languages

## Rust

**Space invaders** example built with the Thunderbird Arcade System developer api.

**Building**

To build the project, run `sh build.sh`.

To build a rust project, always use the `cargo build --target wasm32-unknwown-unknwown`.
Wasm-bindgen is not supported by the emulator.


## Wasm (wat; WebAssembly Text Format)

**Drawing app** example built without any apis, just enqueue and dequeue instructions.

A wasm app can import any of the functions provided to any game. For a complete list
of functions, see [main.ts](https://github.com/Jomy10/thunderbird/blob/426a25ef5f3047859bc97eaad504397a83ebdded/thunderbird-emulator/src/emulator/main.ts#L159-L176)

## C

**Sound example** Cycle through notes, lengths and instruments using B, Left, Right,
Up, Down, LB, RB. Use the A button to play the sound. What is played is logged to the
console.

**Building**

To build the project, run `sh build.sh`.

To build a C project, use `clang` to compile to `wasm32` (see documentation).
Emscripten is not supported by the emulator.
