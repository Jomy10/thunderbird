use crate::colors;

mod imports {
    extern "C" {
        pub fn draw(x: u8, y: u8, c: u8) -> u8;
        pub fn fill(c: u8) -> u8;
        pub fn drawRect(x: u8, y: u8, w: u8, h: u8, c: u8) -> u8;
    }
}

#[inline(always)]
pub fn draw(x: u8, y: u8, color: colors::Color) -> Result<(), &'static str> {
    if unsafe { imports::draw(x, y, color) } == 1 {
        return Err("Queue is full");
    } else { return Ok(()); }
}

#[inline(always)]
pub fn fill(color: colors::Color) -> Result<(), &'static str> {
    if unsafe { imports::fill(color) } == 1 {
        return Err("Queue is full");
    } else { return Ok(()); }
}

#[inline(always)]
pub fn draw_rect(x: u8, y: u8, width: u8, height: u8, color: colors::Color) -> Result<(), &'static str> {
    if unsafe { imports::drawRect(x, y, width, height, color) } == 1 {
        return Err("Queue is full");
    } else { return Ok(()); }
}
