# Making a game using the developer API

The developer API provides an easy to use wrapper around the queue calls.

## Game state

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

## Accessing memory

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

## Getting pressed keys

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
use thunderbird::{get_keys, keys::DOWN};

#[no_mangle]
extern "C" fn __main() {
  if get_keys() & DOWN == DOWN {
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

## Printing to the console

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

## Drawing to the screen

<!-- tabs:start -->

#### **Rust**

```rust
use thunderbird::{draw, draw_rect, fill};
// This enum provides some basic colors, but does not cover everything.
use thunderbird::color::Colors;

static mut X: u8 = 0;

#[no_mangle]
extern "C" fn __main() {
  unsafe { let x: &mut x = X.as_mut().unwrap(); }
  
  fill(Colors::White.into());
  draw_rect(10, 10, 245, 245, Colors::Red.into());
  draw(x, 128, 0b000111);
  
  x.cheched_add(1).unwrap_or(0);
}
```

#### **C**

```c
TODO
```

#### **WebAssembly**

```wasm
(module
  (import "env" "draw" (func $draw (param i32 i32)))
  (import "env" "drawRect" (func $drawRect (param i32 i32)))
  (import "env" "fill" (func $fill (param i32 i32)))
  
  (global $X (mut i32) (i32.const 0))
  
  (func (export "__main")
    i32.const 255 ;; color
    call $fill
    
    i32.const 10  ;; x
    i32.const 10  ;; y
    i32.const 245 ;; w
    i32.const 245 ;; h
    i32.const 224 ;; pure red color
    call $drawRect
    
    global.get $X ;; x
    i32.const 128 ;; y
    i32.cost 7    ;; a nice shade of blue
    call $draw
  )
)
```

<!-- tabs:end -->

## Color

The color byte used in draw instructions has the following layout:

```
00000000
---===--
 r  g  b
```

<!-- tabs:start -->

#### **Rust**

The `Colors` enum provides a few common colors.

```rust
use thunderbird::fill;
use thunderbird::color::Colors;

#[no_mangle]
extern "C" fn __main() {
  fill(Colors::White.into());
}
```

#### **C**

```c
TODO
```

#### **WebAssembly**

The WebAssembly does not provide any exported constants for colors. Use integers.

<!-- tabs:end -->


## Playing sound

// TODO

## Error messages

In Rust, you can set a panic handler to get panic messages in the console.

```rust
#[no_mangle]
extern "C" fn __init() {
  thunderbird::panic::init();
}
```

## Timestamp

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
