use std::alloc::{GlobalAlloc, System, Layout};

struct ConsoleAllocator;

unsafe impl GlobalAlloc for ConsoleAllocator {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        
    }
    
    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        
    }
}

impl {
    const memStart: u32;
    const memEnd: u32;
}

