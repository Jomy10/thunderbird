# Setup

To start making a new game, we need to do a little bit of setup first.

We need to export 3 functions for the emulator to call.

- `__init() -> void` is called once when the game is loaded
- `__main() -> void` is called 60 times per second
- `__deinit() -> void` is called once when the game exits


<!-- tabs:start -->

#### **Rust**

Create a new rust project:

```sh
cargo init --lib
```

In **lib.rs**:

```rust
use thunderbird as tb;

#[no_mangle]
extern "C" fn __init() {}

#[no_mangle]
extern "C" fn __main() {}

#[no_mangle]
extern "C" fn __deinit() {}
```

In **Cargo.toml**:

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
thunderbird = "0.1"
```

If you use the queue approach, you can leave out the `thunderbird` dependency
and add an `extern` block to your source code to import the functions from the
console, if you wish. Importing the `thunderbird` crate is easier though.

```rust
extern "C" {
  /// Enqueue a byte to the queue. Returns 0 if no errors occured.
  fn enqueue(b: u8) -> u8;
}  
```

You can also import some other functions like `fn getKeys() -> u8`, `fn print(ptr: *const CString, len: i32)`,
`fn printN(val: i32)`, `fn printErr(ptr: *const CString, len: i32)` and `fn getTimestamp() -> i32`
in the `extern` block.

#### **C**

```c
TODO
```

#### **WebAssembly**

Create a new `.wat` file (for example `my_game.wat`) and paste the following to
the file.

```wasm
(module
  ;; Import this if you want to make a game using the queue instead of the developer API.
  (import "env" "enqueue" (func $enqueue (param i32) (result i32)))
  
  (func (export "__init"))
  (func (export "__main"))
  (func (export "__deinit"))
)
```

<!-- tabs:end -->

In the next 2 chapters we will discuss how you can access the console and queue instructions.
To make a game, you can either use the queue and queue the instructions manually, or you can use
the developer API.