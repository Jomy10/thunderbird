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

TODO

#### **WebAssembly**

Use [wasm2wat](https://github.com/WebAssembly/wabt) to compile the game.

```sh
wasm2wat my_game.wat > my_game.wasm
```

<!-- tabs:end -->

