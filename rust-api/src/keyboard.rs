mod imports {
    extern "C" {
        pub fn getKeys() -> u8;
    }
}

/// Get the byte storing all currrently pressed keys
pub fn get_keys() -> u8 {
    return unsafe { imports::getKeys() };
}

/// All key codes as constants
pub mod keys {
    pub const UP: u8 = 0b10000000;
    pub const DOWN: u8 = 0b01000000;
    pub const LEFT: u8 = 0b00100000;
    pub const RIGHT: u8 = 0b00010000;
    pub const A: u8 = 0b00001000;
    pub const B: u8 = 0b00000100;
    pub const LBUTTON: u8 = 0b00000010;
    pub const RBUTTON: u8 = 0b00000001;
}

#[repr(u8)]
#[derive(Copy, Clone)]
/// All key codes
pub enum Keys {
    Up      = 0b10000000,
    Down    = 0b01000000,
    Left    = 0b00100000,
    Right   = 0b00010000,
    A       = 0b00001000,
    B       = 0b00000100,
    LButton = 0b00000010,
    RButton = 0b00000001,
}

impl Keys {
    /// Whether a key is curretly pressed
    pub fn is_pressed(&self) -> bool {
        (get_keys() & (*self as u8)) == (*self as u8)
    }
}
