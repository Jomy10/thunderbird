//! Contains the color palette
#[allow(unused)]
// Color palette
mod clrs {
    use thunderbird_macros::color;

    pub const RED: u8 = color!(233 7 114);
    pub const ORANGE: u8 = color!(254 84 111);
    pub const LIGHT_ORANGE: u8 = color!(255 158 125);
    pub const YELLOW: u8 = color!(255 208 128);
    pub const WHITE: u8 = color!(255 253 255);
    pub const LIGHT_BLUE: u8 = color!(11 255 230);
    pub const BLUE: u8 = color!(1 203 207);
    pub const DARK_BLUE: u8 = color!(1 136 165);
    pub const PURPLE: u8 = color!(62 50 100);
    pub const DARK_PURPLE: u8 = color!(53 42 85);
}
pub use clrs::*;
