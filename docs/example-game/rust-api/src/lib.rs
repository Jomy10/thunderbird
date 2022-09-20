use thunderbird::*;

//========================
// State
//========================

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

//========================
// Initialization
//========================

#[no_mangle]
extern "C" fn __init() {
    panic::init();
    unsafe { STATE = Some(State::new()); }
}

//========================
// Main loop
//========================

#[no_mangle]
extern "C" fn __main() {
    let state: &mut State = unsafe { STATE.as_mut().unwrap_unchecked() };
    
    update(state).unwrap();
    drawing(state).unwrap();
}

//========================
// Update logic
//========================

fn update(state: &mut State) -> Result<(), &'static str> {
    // Movement
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
    
    // Color changes
    if Keys::A.is_pressed() {
        state.bg_color = state.bg_color.checked_add(1).unwrap_or(0);
        print_n(state.bg_color as i32);
        
        play(
            Instrument::Square,
            Note::new(NoteEnum::C as u8, 6),
            NoteLength::new(
                NoteLengthFloat::new(5, 1).to_u8(),
                NoteLengthType::Seconds as u8,
            ),
        );
    }
    if Keys::LButton.is_pressed() {
        state.player.color = state.player.color.checked_add(1).unwrap_or(0);
    }
    
    return Ok(());
}

//========================
// Drawing
//========================

fn drawing(state: &State) -> Result<(), &'static str> {
    fill(state.bg_color)?;
    draw(state.player.x, state.player.y, state.player.color)?;
    
    return Ok(());
}

//========================
// Deinit
//========================

#[no_mangle]
extern "C" fn __deinit() {}
