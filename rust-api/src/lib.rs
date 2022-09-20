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
pub mod queue;
pub use queue::*;

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
        
        // queue
        pub fn enqueue(val: u8) -> u8;
        
        // console
        pub fn print(ptr: i32, size: i32);
        pub fn printErr(ptr: i32, size: i32);
        pub fn printN(n: i32);
        
        // allocations
        /// Use at own risk, in Rust these do not work like you expect them to
        pub fn memset(ptr: i32, val: u8, length: i32) -> i32;
        /// Use at own risk, in Rust these do not work like you expect them to
        pub fn memSetByte(ptr: i32, byte: u8);
        /// Use at own risk, in Rust these do not work like you expect them to
        pub fn alloc(size: i32) -> i32;
        /// Use at own risk, in Rust these do not work like you expect them to
        pub fn dealloc(ptr: i32, byteSize: i32) -> i32;
    }
}

/// Get a seed for a random number generator frrom the system
pub fn get_timestamp() -> i32 {
    unsafe { return console::getTimestamp(); }
}
