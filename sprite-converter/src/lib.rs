#![allow(non_upper_case_globals)] // Get rid of warnings in wasm-bindgen

use std::{mem, panic};
use wasm_bindgen::prelude::*;
use image::GenericImageView;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init_panic() {
    panic::set_hook(Box::new(|p| {
        let s = p.to_string();
        log(&s);
    }));
}

#[repr(C)]
#[derive(Debug)]
pub struct Pixel {
    x: u8,
    y: u8,
    color: u8,
    transparent: u8,
}

#[wasm_bindgen]
pub struct ConvertReturnType {
    pub pixels: *const Pixel,
    pub arr_size: usize,
    pub w: u8,
    pub h: u8,
}

#[wasm_bindgen]
impl ConvertReturnType {
    #[wasm_bindgen(constructor)]
    pub fn new(pixels: *const Pixel, arr_size: usize, w: u8, h: u8) -> ConvertReturnType {
        return ConvertReturnType { pixels, arr_size, w, h };
    }
}

#[inline]
fn covert_rgb_to_number(r: u8, g: u8, b: u8) -> u8 {
    let r = ((r as f32 / 256.0) * 8.0) as u8;
    let g = ((g as f32 / 256.0) * 8.0) as u8;
    let b = ((b as f32 / 256.0) * 4.0) as u8;
    return b | (g << 2) | (r << 4);
}

#[wasm_bindgen]
/// Convert an image to a sprite format
/// Returns a pointer to an array of pixels and the size of the array
pub fn convert(png: *mut u8, size: usize) -> ConvertReturnType {
    let png_bytes: Vec<u8> = unsafe { Vec::from_raw_parts(png, size, size) };
    let img = image::load_from_memory(&png_bytes).unwrap();
    
    let mut pixels: Vec<Pixel> = Vec::new();
    
    for pixel in img.pixels() {
        let col: u8 = covert_rgb_to_number(pixel.2.0[0], pixel.2.0[1], pixel.2.0[2]);
        let transparent: u8 = if pixel.2.0[3] == 0 { 1 } else { 0 };
        pixels.push(Pixel { x: pixel.0 as u8, y: pixel.1 as u8, color: col, transparent });
    }

    pixels.shrink_to_fit();
    assert!(pixels.len() == pixels.capacity());
    let ptr = pixels.as_mut_ptr();
    let len = pixels.len();
    mem::forget(pixels);
    
    let (w, h) = img.dimensions();
    
    return ConvertReturnType { pixels: ptr, arr_size: len, w: w as u8, h: h as u8 };
}

#[wasm_bindgen]
pub fn alloc_arr(size: usize) -> *mut u8 {
    let mut vec = Vec::<u8>::with_capacity(size);
    unsafe { vec.set_len(size) };
    let vec_ptr = vec.as_mut_ptr();
    mem::forget(vec);
    return vec_ptr;
}

#[wasm_bindgen]
pub fn dealloc_arr(ptr: *mut u8, size: usize) {
    drop(unsafe { Vec::from_raw_parts(ptr, size, size) });
}
