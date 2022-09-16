# Making a simple game

In this chapter we will make a VERY simple game.

- We will have a player that can move around using the arrow keys. The player will
  just be a simple dot on the screen. He can wrap around the screen.
- The player can change color using the `A` button.
- The player can play a sound using the `B` button.
- The player can change the background color using the `L Button`.

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

#### **Rust (queue)**

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

<!-- tabs:end -->

You can use your build script again and reload the console page. If you do so, you
should see a dot in the middle of the screen. In an actual game you probably want to
make the player a little bigger than a single pixel.

## Handling input and moving the player


### PLayer movement

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
    let pressed = get_keys();
    if pressed & keys::UP == keys::UP {
        state.player.y = state.player.y.checked_sub(1).unwrap_or(255);
    }
    if pressed & keys::DOWN == keys::DOWN {
        state.player.y = state.player.y.checked_add(1).unwrap_or(0);
    }
    if pressed & keys::LEFT == keys::LEFT {
        state.player.x = state.player.x.checked_sub(1).unwrap_or(255);
    }
    if pressed & keys::RIGHT == keys::RIGHT {
        state.player.x = state.player.x.checked_add(1).unwrap_or(0);
    }
    
    return Ok(());
}
```

We use `checked_add` and `checked_sub` to wrap the player to the other side of the screen
when he reaches the end.

<!-- tabs:end -->

Try running our build script and reloading the webpage again. You should now be able to move
the dot around. And even go sideways when pressing for example up and right together.

### Changing colors

Try writing the code for changing colors now. It should be simple with your current knowledge.

<!-- tabs:start -->

#### **Rust (API)**

Add this to the update function:

```rust
if pressed & keys::A == keys::A {
    state.bg_color = state.bg_color.checked_add(1).unwrap_or(0);
}
if pressed & keys::LBUTTON == keys::LBUTTON {
    state.player.color = state.player.color.checked_add(1).unwrap_or(0);
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

#### **Rust (API)

Add this to the inside of the `if pressed & keys::A == keys::A` statement:

```rust
print_n(state.bg_color as i32);
```

<!-- tabs:end -->

## Source code

You can look at the full source code of this example on github

<!-- tabs:start -->

##### **Rust (API)**

[View on github](https://github.com/jomy10/thunderbird/docs/examples/rust-api)

<!-- tabs:end -->
