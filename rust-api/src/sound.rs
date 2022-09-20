mod imports {
    extern "C" {
        // pub fn play0(note: u8, length: u8);
        // pub fn play1(note: u8, length: u8);
        // pub fn play2(note: u8, length: u8);
        pub fn play(instrument: u8, note: u8, length: u8);
    }
}

/// The instrument to be used
#[repr(u8)]
pub enum Instrument {
    Pulse,
    Square,
    Triangle,
}

#[repr(u8)]
pub enum NoteEnum {
    A, B, C, D, E, F, G
}

/// The note to be played
pub struct Note {
    pub note: u8,
    pub n: u8,
}

impl Note {
    pub fn new(note: u8, n: u8) -> Self {
        Self { note, n }
    }
    pub fn build(&self) -> u8 {
        (self.note << 5) & self.n
    }
}

#[repr(u8)]
pub enum NoteLengthType {
    Seconds = 0,
    Note = 1,
    Triplet = 2,
    Measure = 3
}

pub struct NoteLengthFloat {
    base: u8,
    shift: u8,
}

impl NoteLengthFloat {
    pub fn new(base: u8, shift: u8) -> Self {
        Self { base, shift }
    }
    pub fn to_u8(&self) -> u8 {
        (self.base << 4) | (self.shift << 2)
    }
}

pub struct NoteLength {
    pub amount: u8,
    pub ty: u8,
}

impl NoteLength {
    pub fn new(amount: u8, ty: u8) -> Self {
        Self { amount, ty }
    }
    // Convert to u8 argument
    fn build(&self) -> u8 {
        (self.amount << 2) & self.ty
    }
}

#[inline]
pub fn play(instr: Instrument, note: Note, length: NoteLength) {
    unsafe { imports::play(instr as u8, note.build(), length.build()); }
}
