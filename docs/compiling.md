# Compiling a game

Make sure you followed the setup guide in one of the previous chapters.

<!-- tabs:start -->

#### **Rust**

The emulator does not support wasm-bindgen.

First, install the right target

```sh
rustup target add wasm32-unknown-unknown
```

And build the game

```sh
cargo build --target=wasm32-unknown-unknown --release
```

The game is located in `target/wasm32-unknown-unknown/release/my_game.wasm`.

#### **C**

Make sure you have **LLVM** installed and your path to it has been set up correctly.

Then compile your game like this (with `main.c` as source file and `game.wasm` as output):

```sh
clang main.c \
  --target=wasm32 \
  -nostdlib \
  -O2 \
  -Wl,--no-entry \
  -Wl,--lto-O2 \
  -Wl,--allow-undefined \
  -Wl,--import-memory \
  -Wl,--export=__main \
  -Wl,--export=__init \
  -Wl,--export=__deinit \
  -o game.wasm
```

#### **WebAssembly**

Use [wasm2wat](https://github.com/WebAssembly/wabt) to compile the game.

```sh
wasm2wat my_game.wat -o my_game.wasm
```

<!-- tabs:end -->
