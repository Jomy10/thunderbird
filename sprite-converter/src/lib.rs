use std::{mem, panic};
use wasm_bindgen::prelude::*;

extern "C" {
    #[allow(improper_ctypes)]
    fn __log(s: &str);
}

fn log(s: &str) {
    unsafe { __log(s); }
}

pub fn init_panic() {
    panic::set_hook(Box::new(|p| {
        let s = p.to_string();
        log(&s);
    }));
}

#[repr(C)]
pub struct Pixel {
    x: u8,
    y: u8,
    color: u8,
}

#[wasm_bindgen]
pub struct ConvertReturnType {
    pixels: *const Pixel,
    arr_size: usize,
}

#[wasm_bindgen]
/// Convert an image to a sprite format
/// Returns a pointer to an array of pixels and the size of the array
// TODO: instead of returnxig size, allocate memory in js and set that address to the size
// OR: return a struct!
pub fn convert(png: *mut u8, size: usize) -> ConvertReturnType {
    let png_bytes: Vec<u8> = unsafe { Vec::from_raw_parts(png, size, size) };
    let img = image::load_from_memory(&png_bytes).unwrap().into_rgb8();
    
    // TODO: calculate amount of pixels using w and h and allocate a new array
    let (w, h) = img.dimensions();
    img.pixels().for_each(|p| { log(&format!("{:?}", p.0)); });
    log("============");
    let mut pixels: Vec<Pixel> = Vec::new();
    
    for pixel in img.pixels() {
        // TODO: process pixels
        
        log(&format!("{:?}", pixel));
        
        // TODO: check width/height constraints
        // pixels.push(Pixel { x: pixel.x, y: pixel.y, color: 0 });
    }
    
    pixels.shrink_to_fit();
    assert!(pixels.len() == pixels.capacity());
    let ptr = pixels.as_mut_ptr();
    let len = pixels.len();
    mem::forget(pixels);
    
    return ConvertReturnType { pixels: ptr, arr_size: len };
}

// pub fn test(png: *mut u8, size: usize/*, w: usize, h: usize*/) -> i32 {
//     log(&format!("{}", unsafe { *png }));
//     let png_bytes: Vec<u8> = unsafe { Vec::from_raw_parts(png, size, size) };
    
//     let img = image::load_from_memory(&png_bytes).unwrap().to_rgb8();
    
//     log(&format!("{:?}", img));
    
//     for pixel in img.pixels() {
//         log(&format!("{:?}", pixel.0));
//     }
    
//     return 1;
// }

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
