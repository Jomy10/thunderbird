# Making a game using the queue

The thunderbird console operates on an instruction queue. This queue has a total
capacity of **65.536 bytes**. 

Every game exports 3 functions: `__init`, which is run once when the game's cartridge
is inserted. `__main`, which is called 60 times per second, ad `__deinit`, which is called
once after the game exits.

We will look at the different instruction first. After that, in the [Building a game](#building-a-game)
section, we will put these into practice.

## Instruction layout

An instruction is a set of bytes.

- The first byte defines the type of instruction
- The bytes following this byte define the instruction parameters

## Instructions

### Exit

Exits the game.

**Instruction**: `00000000` (`0`)

### Draw

Sets a pixel on the screen to a specific color.

**Instruction**: `00000001` (`1`)

**Byte layout**:
- [1] x position
- [2] y position
- [3] color

### DrawRect

Fills a rectangle with a color.

**Instruction**: `00000010` (`2`)

**Byte layout**:
- [1] x position
- [2] y position
- [3] width
- [4] height
- [5] color

### Fill

Fill the screen with a color.

**Instruction**: `00000011` (`3`)

**Byte layout**:
- [1] color

// TODO: play

## Color

The color byte used in draw instructions has the following layout:

```
00000000
---===--
 r  g  b
```

## Building a game

Let's build a game now.

### Setup

We need to export 3 functions for the emulator to call.

- `__init() -> void` is called once when the game is loaded
- `__main() -> void` is called 60 times per second
- `__deinit() -> void` is called once when the game exits

<!-- tabs:start -->

#### **Rust**

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

#### **C**

```c
TODO
```

#### **WebAssembly**

```wasm
(module
  (import "env" "enqueue" (func $enqueue (param i32) (result i32)))
  
  (func (export "__init"))
  (func (export "__main"))
  (func (export "__deinit"))
)
```

<!-- tabs:end -->

### Sending an instruction to the queue

In the following example we draw a rectangle to position 10, 20 with a width of
30 and height of 60 add a pure red color.

<!-- tabs:start -->

#### **Rust**

```rust
tb::enqueue(1).unwrap();  // draw instruction
tb::enqueue(10).unwrap(); // x
tb::enqueue(20).unwrap(); // y
tb::enqueue(30).unwrap(); // w
tb::enqueue(60).unwrap(); // h
tb::enqueue(0b11100000).unwrap(); // Red color
```

#### **C**

```c
TODO
```

#### **WebAssembly**

```wasm
;; draw instruction
i32.const 1 
call $enqueue 
drop ;; neglect the result
;; x
i32.const 10
call $enqueue
drop
;; y
i32.const 20
call $enqueue
drop
;; w
i32.const 30
call $enqueue
drop
;; h
i32.const 60
call $enqueue
drop
;; color
i32.const 224 ;; 0b11100000
call $enqueue
drop
```

<!-- tabs:end -->

### Game state

Game state can be handled in multiple ways. The easiest is having a mutable
global variable. This is ok because the console is not multithreaded.

In the example below, we add 1 to the player's x position every frame.

<!-- tabs:start -->

#### **Rust**

```rust
struct State {
  player_x: u8
}

static mut STATE: Option<State> = None;

#[no_mangle]
extern "C" fn __init() {
  STATE = Some(State { player_x: 128 });
}

#[no_mangle]
extern "C" fn __main() {
  unsafe { let state: &mut State = STATE.as_mut().unwrap(); } // can use unwrap_unchecked as well
  state.player_x += 1;
  // This code will eventually panic in debug mode, here's a nice trick to 
  // have wrapping of player x:
  // state.player_x.checked_add(1).unwrap_or(0);
```

#### **C**

```c
TODO
```

#### **WebAssembly**

```wasm
(module
  (global $player_x (mut i32) (i32.const 128))

  (func (export "__main")
    global.get $player_x
    i32.const 1
    i32.add
    global.set $player_x
  )
)
```

<!-- tabs:end -->

### Accessing memory

The console has **196.608 bytes** of memory that can be used by games (except
for the first byte).

<!-- tabs:start -->

#### **Rust**

Use Rust as usual.

#### **C**

use `malloc`, `calloc` and `free` as usual.

#### **WebAssembly**

Access memory with `i32.store8` and `i32.load8_u`.

<!-- tabs:end -->

### Getting pressed keys

Pressed keys are stored in the first byte of memory. Every bit represents a key.
When a bit is 1, it means the key is pressed. The bits represent the following keys:

- [0] up
- [1] down
- [2] left
- [3] right
- [4] A
- [5] B
- [6] Left Button
- [7] Right Button

To check if `down` is pressed, we do the following:

<!-- tabs:start -->

#### **Rust**

```rust
use thunderbird::get_keys;

#[no_mangle]
extern "C" fn __main() {
  if get_keys() & 0b01000000 == 0b01000000 {
    // down is pressed
  }
}
```

#### **C**

TODO

#### **WebAssembly**

```wasm
(module
  (import "env" "memory" (memory 3 3))
  
  (global $KeyDown i32 (i32.const 64))
  
  (func (export "__main") (local $pressedKeys)
    i32.const 0
    i32.load8_u
    local.set $pressedKeys
    
    local.get $pressedKeys
    global.get $KeyDown
    i32.and
    global.get $KeyDown
    i32.eq
    (if
      (then
        ;; Down pressed
      )
    )
  )
)
```

<!-- tabs:end -->

### Printing to the console

To open the console in the first place, open the developer console in your browser
of choice. This can usually be down with a `right click > inspect`.

<!-- tabs:start -->

#### **Rust**

```rust
use thunderbird::{print, printN, printErr};

#[no_mangle]
extern "C" fn __init() {
  // print a string
  print("Hello world");
  
  // print a number
  printN(60);

  // print an error
  printErr("Error: something went wrong");
}
```

#### **C**

```c
TODO
```

#### **WebAssembly**

```wasm
(module
  (import "env" "print" (func $print (param i32 i32)))
  (import "env" "printN" (func $printN (param i32)))
  
  ;; Used in the same way as print
  (import "env" "printErr" (func $printErr (param i32 i32)))
  
  (func (export "__init")
    ;; print a location in memory
    i32.const 5 ;; ptr to memory address 5
    i32.const 10 ;; length of 10 byte
    call $print
    
    ;; Print a number
    i32.const 60
    call $printN
  )
)
```

<!-- tabs:end -->

### Error messages

In Rust, you can set a panic handler to get panic messages in the console.

```rust
#[no_mangle]
extern "C" fn __init() {
  thunderbird::panic::init();
}
```

### Timestamp

You can use the `getTimestamp` function to get a timestamp which can be used in
a random number generator.

<!-- tabs:start -->

#### **Rust**

```rust
use thunderbird::{get_timestamp};
use quad_rand as qrand;

#[no_mangle]
extern "C" fn __init() {
  // Set the seed
  qrand::srand(get_timestamp().try_into().unwrap());
}
```

#### **C**

```c
TODO
```

#### **WebAssembly**

```wasm
(module
  (import "env" "getTimestamp" (func $getTimestamp (param i32 i32)))
  
  (func (export "printN")
    call $getTimestamp
    drop
  )
)
```

<!-- tabs:end -->