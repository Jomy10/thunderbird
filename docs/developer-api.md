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
typedef struct {
  uint8_t player_x;
} state_t;

static state_t* STATE;

void __init() {
  STATE = (state_t*) malloc(sizeof(state_t));
  STATE->player_x = 128;
}

void __main() {
  STATE->player_x += 1;
}
```

> [!WARNING]
> Always store pointers in static object, not the actual object.

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

use `malloc`, `calloc` and `free` as usual (imported by `thunderbird.h`).

#### **WebAssembly**

Access memory with `i32.store8` and `i32.load8_u`.

The `(func $alloc (param $size i32) (result i32))` and `(func $dealloc (param $ptr i32) (param $size i32) (result i32))`
can also be imported.

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
use thunderbird::{Keys};

#[no_mangle]
extern "C" fn __main() {
  if Keys::Down.is_pressed() {
    // down is pressed
  }
}
```

#### **C**

```c
if isPressed(DOWN) {
  // down is pressed
}
```

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
use thunderbird::{print, print_n, print_err};

#[no_mangle]
extern "C" fn __init() {
  // print a string
  print("Hello world");
  
  // print a number
  print_n(60);

  // print an error
  print_err("Error: something went wrong");
}
```

#### **C**

```c
#include <string.h>

void __init() {
  // print a string
  char* str = malloc(11);
  strcpy(str, "Hello world");
  print(str);
  
  // print a number
  printN(60);
  
  // print an error
  char* err = malloc(5);
  strcpy(err, "Error");
  printErr(err);
}
```

> [!NOTE]
> You can also include the optional header file `printf`.
> To do this, copy the [`printf.h`](https://raw.githubusercontent.com/Jomy10/thunderbird/master/c-api/printf.h)
> and [`sprintf.h`](https://github.com/Jomy10/thunderbird/blob/master/c-api/sprintf.h) header files to your project:
>
> ```c
> curl "https://raw.githubusercontent.com/Jomy10/thunderbird/master/c-api/printf.h" > printf.h
> curl "https://github.com/Jomy10/thunderbird/blob/master/c-api/sprintf.h" > sprintf.h
> ```
>
> Then include it in your project:
> ```c
> #include "printf.h"
>
> void __init() {
>   printf("Hello %s", "world");
> }
> ```
>
> The `printf` and `sprintf` functions will now be available like from the C standard library.

> [!WARNING]
> When using printf, don't forget the trailing `\n`, as this will otherwise
> freeze execution.

> [!NOTE]
> When you don't need formatting, you can use the `prints("")` function to print a string.

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
  draw(x, 128, 0b0000111);
  
  x.cheched_add(1).unwrap_or(0);
}
```

#### **C**

```c
static uint8_t X = 0;

void __main() {
  fill(0b11111111);
  drawRect(10, 10, 245, 245, 0b11100000);
  draw(X, 128, 0b0000111);
  
  X += 1;
}
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

> [!NOTE]
> You can use the `thunberbird-macros` crate to use the `color!` macro.
>
> **Example**
> ```rust
> color!(255 0 10)
> ```

#### **C**

C does not provide any exported constants for colors.

#### **WebAssembly**

The WebAssembly does not provide any exported constants for colors. Use integers.

<!-- tabs:end -->


## Playing sound

<!-- tabs:start -->

#### **Rust**

```rust
// play pulse instrument with note C4 for one second
play(
  Instrument::Pulse,
  Note::new(NoteEnum::C as u8, 4),
  NoteLength::new(1, NoteLengthType::Seconds as u8),
);
```

```rust
// Play square instrument with note A2 for 0.1 seconds (= 1 with floating point moved by 1 position)
play(
  Instrument::Square,
  Note::new(NoteEnum::A as u8, 2),
  NoteLength::new(NoteLengthFloat::new(1, 1).to_u8(), NoteLengthType::Seconds as u8),
)
```

#### **C**

The `play` function provides an interface to the console's sound engine.

It takes 3 arguments:

1. Instrument: `I_PULSE` | `I_SQUARE` | `I_TRIANGLE`.
2. Note: e.g. C4 = `NOTE_C | 4`.
3. Length: e.g. 1 seconds = `(1 << 4) | L_SECOND`, 0.1 seconds = `(1 << 4) | (1 << 2) | L_SECOND`.

**Examples**:
```c
// play pulse instrument with note C4 for one second
play(I_PULSE, NOTE_C | 4, (1 << 4) | L_SECOND);
// play square instrument with note A2 for 0.1 seconds (= 1 with floating point moved by 1 position)
play(I_SQUARE, NOTE_A | 2, 0b0010100);
```

### **WebAssembly**

See also the [using the queue](queue) section to see how the second and third
argument of the `play` function are layed out as bytes (note and length).

```wasm
(import "env" "play" (func $play (param i32 i32 i32)))

(func (export "__init")
  ;; play pulse instrument ...
  i32.const 0 ;; pulse
  
  ;; ... with note C4 ...
  i32.const 64 ;; C
  i32.const 4
  i32.or
  
  ;; ... for one second
  i32.const 1
  i32.shl
  i32.shl
  i32.shl
  i32.shl ;; (1 << 4)
  
  call $play
)
```

```wasm
(import "env" "play" (func $play (param i32 i32 i32)))

(func (export "__init")
  ;; play square instrument ...
  i32.const 1 ;; square
  
  ;; ... with note A2 ...
  i32.const 0 ;; A
  i32.const 2
  i32.or
  
  ;; ... for 0.1 second
  i32.const 20
  
  call $play
)
```

<!-- tabs:end -->

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
int timestamp = getTimestamp();
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
