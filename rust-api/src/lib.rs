pub mod colors;
pub use colors::*;
pub mod sound;
pub use sound::*;
pub mod draw;
pub use draw::*;
pub mod logger;
pub use logger::*;
pub mod keyboard;
pub use keyboard::*;
pub mod panic;

/// Wasm imports
pub mod console {
    extern "C" {
        // Drawing
        /// Returns 0 if the enqueuing of this instrution was successful, 1 otherwise
        pub fn draw(x: u8, y: u8, c: u8) -> u8;
        /// Returns 0 if the enqueuing of this instrution was successful, 1 otherwise
        pub fn fill(c: u8) -> u8;
        /// Returns 0 if the enqueuing of this instrution was successful, 1 otherwise
        pub fn drawRect(x: u8, y: u8, w: u8, h: u8, c: u8) -> u8;
        
        // Sound
        pub fn play0(note: u8, length: u8);
        pub fn play1(note: u8, length: u8);
        pub fn play2(note: u8, length: u8);
        
        pub fn getKeys() -> u8;
        
        pub fn getTimestamp() -> i32;
        
        // console
        pub fn log(ptr: i32, size: i32);
        pub fn logN(n: i32);
    }
}

/// Get a seed for a random number generator frrom the system
pub fn get_timestamp() -> i32 {
    unsafe { return console::getTimestamp(); }
}
