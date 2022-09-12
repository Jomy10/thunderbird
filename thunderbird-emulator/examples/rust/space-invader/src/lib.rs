// extern crate console_error_panic_hook;
// use std::panic;

mod state;
use state::State;
mod colors;
mod sprite;

use rust_api::{panic, get_timestamp};
use quad_rand as rand;


#[no_mangle]
unsafe extern "C" fn __init() {
    panic::init();
    STATE = Some(State::new());
    rand::srand(get_timestamp().try_into().unwrap()); // Should never panic
}

static mut STATE: Option<State> = None;

#[no_mangle]
unsafe extern "C" fn __main() {
    let state: &mut State = STATE.as_mut().unwrap_unchecked();
    state.update();
    state.draw();
}

#[no_mangle]
unsafe extern "C" fn __deinit() {
    
}
