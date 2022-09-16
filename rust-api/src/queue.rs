mod imports {
    extern "C" {
        pub fn enqueue(val: u8) -> u8;
    }
}

/// Enqueue a byte to the queue
pub fn enqueue(val: u8) -> Result<(), &'static str> {
    if unsafe { imports::enqueue(val) } == 0 {
        return Ok(());
    } else {
        return Err("Could not enqueue: queue is full");
    }
}
