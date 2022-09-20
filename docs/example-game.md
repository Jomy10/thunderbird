# Making a simple game

In this chapter we will make a VERY simple game.

- We will have a player that can move around using the arrow keys. The player will
  just be a simple dot on the screen. He can wrap around the screen.
- The player can change color using the `Left Trigger` button.
- The player can play a sound using the `B` button.
- The player can change the background color using the `A` buttton.

## Setup

Follow the [setup instructions](setup).

## Hello world

Let's test if everything is working.

<!-- tabs:start -->

#### **Rust (API)**

Add this to `src/lib.rs`:

```rust
use thunderbird::*;

#[no_mangle]
extern "C" fn __init() {
    panic::init(); // Panic messages will be printed to the console
    fill(0b11100000).unwrap();
}

#[no_mangle]
extern "C" fn __main() {}

#[no_mangle]
extern "C" fn __deinit() {}
```

Let's also add a little build script which builds our game and copies it
to our [local development console](development-console) (you can also
import the game file oline in the ROM library if you prefer):

```bash
# We're building in debug mode for now
cargo build --target=wasm32-unknown-unknown

cp target/wasm32-unknown-unknown/debug/my_game.wasm \
  /path/to/thunderbird/thunderbird-emulator/game/game.wasm
```

\* If you haven't already, check out [compiling a game](compiling).

Make sure to also make the `game` directory in the `thunderbird-emulator`.

Now, run the above build script and [start the development console](developer-emulator#running-the-emulator).
You should now see the screen has turned red.

#### **C (API)**

Add this to `main.c`:

```c
#include "thunderbird.h"

void __init() {
  fill(0b11100000);
}
void __main() {}
void __deinit() {}
```

Let's also add a little build script which builds our game and copies it to our
[local development console](development-console) (you can also import the game
online in the ROM library if you prefer):

```bash
SOURCE_FILE="main.c"
OUT_FILE="/path/to/thunderbird/thunderbird-emulator/game/game.wasm"

clang $SOURCE_FILE \
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
  -o $OUT_FILE
```

\* If you haven't already, check out [compiling a game](compiling).

Make sure to also make the `game` directory in the `thunderbird-emulator`.

Now, run the above build script and [start the development console](developer-emulator#running-the-emulator).
You should now see the screen has turned red.

<!-- tabs:end -->

It's best to open the [developer console](https://balsamiq.com/support/faqs/browserconsole/) in your browser.
This will make it easier to debug.

## Player state

Let's add a state variable so it can be persistent between frames. You can also remove
the `fill` call from earlier.

<!-- tabs:start -->

#### **Rust (API)**

```rust
struct State {
    player: Player,
    bg_color: u8,
}

impl State {
    fn new() -> Self {
        Self { 
          player: Player::new(),
          bg_color: 0b11111111,
        }
    }
}

struct Player {
    x: u8,
    y: u8,
    color: u8,
}

impl Player {
    fn new() -> Self {
        Self { x: 128, y: 128, color: 0b00000111 }
    }
}

static mut STATE: Option<State> = None;

#[no_mangle]
extern "C" fn __init() {
    unsafe { STATE = Some(State::new()); }
}
```

#### **C (API)**

```c
typedef struct {
  uint8_t x;
  uint8_t y;
  uint8_t color;
} player_t;

typedef struct {
  player_t player;
  uint8_t bgColor;
} state_t;

static state_t* STATE;

void __init() {
  STATE = (state_t*) malloc(sizeof(state_t));
  STATE->bgColor = 0b11111111;
  STATE->player.x = 128;
  STATE->player.y = 128;
  STATE->player.color = 0b00000111;
}
```

<!-- tabs:end -->

## Drawing the player

We want to fill the screen and draw the player every frame.

<!-- tabs:start -->

#### **Rust (API)**

```rust
#[no_mangle]
extern "C" fn __main() {
    let state: &mut State = unsafe { STATE.as_mut().unwrap_unchecked() };
    
    drawing(state).unwrap();
}

fn drawing(state: &State) -> Result<(), &'static str> {
    fill(state.bg_color)?;
    draw(state.player.x, state.player.y, state.player.color)?;
    
    return Ok(());
}
```

#### **C (API)**

```c
void drawing(state_t* state) {
  if (fill(state->bgColor) == 1) { exit(1); };
  if (draw(state->player.x, state->player.y, state->player.color) == 1) { exit(1); }
}

void __main() {
  drawing(STATE);
}
```

> [!NOTE]
> In this example we also handle errors. Instructions will return 1 if the
> queue is full. Here we simply exit the game when an error occurs.

<!-- tabs:end -->

You can use your build script again and reload the console page. If you do so, you
should see a dot in the middle of the screen. In an actual game you probably want to
make the player a little bigger than a single pixel.

## Handling input and moving the player

### Player movement

<!-- tabs:start -->

#### **Rust (API)**

Our new main loop looks like this:

```rust
#[no_mangle]
extern "C" fn __main() {
    let state: &mut State = unsafe { STATE.as_mut().unwrap_unchecked() };
    
    update(state).unwrap();
    drawing(state).unwrap();
}
```

Our update logic looks like this:

```rust
fn update(state: &mut State) -> Result<(), &'static str> {
    if Keys::Up.is_pressed() {
        state.player.y = state.player.y.checked_sub(1).unwrap_or(255);
    }
    if Keys::Down.is_pressed() {
        state.player.y = state.player.y.checked_add(1).unwrap_or(0);
    }
    if Keys::Left.is_pressed() {
        state.player.x = state.player.x.checked_sub(1).unwrap_or(255);
    }
    if Keys::Right.is_pressed() {
        state.player.x = state.player.x.checked_add(1).unwrap_or(0);
    }

    return Ok(());
}
```

We use `checked_add` and `checked_sub` to wrap the player to the other side of the screen
when he reaches the end.

#### **C (API)**

Our new main loop looks like this:

```c
void __main() {
  update(STATE);
  drawing(STATE);
}
```

Our update logic looks like this:

```c
void update(state_t* state) {
  if (isPressed(UP)) {
    state->player.y -= 1;
  }
  if (isPressed(DOWN)) {
    state->player.y += 1;
  }
  if (isPressed(LEFT)) {
    state->player.x -= 1;
  }
  if (isPressed(RIGHT)) {
    state->player.x += 1;
  }
}
```

<!-- tabs:end -->

Try running our build script and reloading the webpage again. You should now be able to move
the dot around. And even go sideways when pressing for example up and right together.

### Changing colors

Try writing the code for changing colors now. It should be simple with your current knowledge.

<!-- tabs:start -->

#### **Rust (API)**

Add this to the update function:

```rust
if Keys::A.is_pressed() {
    state.bg_color = state.bg_color.checked_add(1).unwrap_or(0);
}
if Keys::LButton.is_pressed() {
    state.player.color = state.player.color.checked_add(1).unwrap_or(0);
}
```

> [!NOTE]
> Use the `thunberbird-macros` crate to use the `color!` macro.
>
> **Example**
> ```rust
> color!(255 0 10)
> ```

#### **C (API)**

Add this to the update function:

```c
if (isPressed(A)) {
  state->bgColor += 1;
}
if (isPressed(LBUTTON)) {
  state->player.color += 1;
}
```

<!-- tabs:end -->

Now cycle through all the colors!

> [!NOTE]
> It's best to have another check if the buttons were pressed in the last frame
> so that the colors don't flash so much. This is left as an exercice for the developer.

### Playing sounds

TODO

## Printing to the console

Let's also print out the background color code to the console.

<!-- tabs:start -->

#### **Rust (API)**

Add this to the inside of the `if Key::A.is_pressed()` statement:

```rust
print_n(state.bg_color as i32);
```

The `print` and `print_err` functions are also available.

#### **C (API)**

Add this to the inside of the `if (isPressed(A))` statement:

```c
printN(state->bgColor);
```

// TODO: print and printErr exist as well and talk about printf.h

<!-- tabs:end -->

## Source code

You can look at the full source code of this example on github

<!-- tabs:start -->

##### **Rust (API)**

[View on GitHub](https://github.com/jomy10/thunderbird/docs/examples/rust-api)

#### **C (API)**

[View on GitHub](https://github.com/jomy10/thunderbird/docs/examples/c-api/main.c)

<!-- tabs:end -->

## Continue reading

If you haven't already, go to [using the queue](queue) or [using the developer API](developer-api)
to read more.

You can also take a look at the [Rust API documentation](https://docs.rs/thunderbird/0.1.0/thunderbird/).

You can look at the [C header](https://github.com/jomy10/thunderbird/c-api/thunderbird.h).
