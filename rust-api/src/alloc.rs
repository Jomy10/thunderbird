// use std::alloc::{GlobalAlloc, Layout};
// use crate::logger::print_n;

// extern "C" {
//     fn alloc(size: i32) -> i32;
//     /// Returns a result code
//     fn dealloc(ptr: i32, byteSize: i32) -> i32;
// }

// pub struct ConsoleAllocator;

// unsafe impl GlobalAlloc for ConsoleAllocator {
//     unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
//         print_n(-100);
//         return alloc(layout.size() as i32) as *mut u8;
//     }
    
//     unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
//         dealloc(ptr as i32, layout.size() as i32);
//         // result is ignored: potential memory leak
//     }
// }
