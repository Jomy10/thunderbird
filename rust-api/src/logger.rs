mod imports {
    extern "C" {
        pub fn print(ptr: i32, size: i32);
        pub fn printErr(ptr: i32, size: i32);
        pub fn printN(n: i32);
        pub fn alloc(size: i32) -> i32;
        pub fn dealloc(ptr: i32, byteSize: i32) -> i32;
        pub fn memSetByte(ptr: i32, byte: u8);
    }
}

#[inline(always)]
fn str_to_wasm_ptr(str: &str) -> (i32, i32) {
    unsafe {
        let len = str.len() as i32;
        let ptr = imports::alloc(len);
        let bytes: &[u8] = str.as_bytes();
        for i in 0..(len as usize) {
            imports::memSetByte(ptr + (i as i32), bytes[i]);
        }
        return (ptr, len);
    }
}

/// Print to the standard out
pub fn print(str: &str) {
    unsafe {
        let (ptr, len) = str_to_wasm_ptr(str);
        imports::print(ptr, len);
        imports::dealloc(ptr, len);
    };
}

/// Print a message that is formatted as an error
pub fn print_err(str: &str) {
    unsafe {
        let (ptr, len) = str_to_wasm_ptr(str);
        imports::printErr(ptr, len);
        imports::dealloc(ptr, len);
    }
}

#[inline(always)]
/// Logs a number to the console
pub fn print_n(n: i32) {
    unsafe { imports::printN(n) };
}
