pub trait ColorUtils {
    fn from(r: u8, g: u8, b: u8) -> Self;
}

pub type Color = u8;
impl ColorUtils for Color {
    fn from(r: u8, g: u8, b: u8) -> Self {
        let b = ((b as f32 / 256.0) * 4.0) as u8;
        let g = ((g as f32 / 256.0) * 8.0) as u8;
        let r = ((r as f32 / 256.0) * 8.0) as u8;
        let mut rgb: u8 = 0;
        rgb = rgb | b;
        rgb = rgb | (g << 2);
        rgb = rgb | (r << 4);
        return rgb;
    }
}

#[repr(u8)]
pub enum Colors {
    /// Pure red
    Red = 0b11100000,
    /// Pure green
    Green = 0b00011100,
    /// Pure blue
    Blue = 0b00000011,
    White = 0b11111111,
    Black = 0b00000000,
}