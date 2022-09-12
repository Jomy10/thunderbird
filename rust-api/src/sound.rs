mod imports {
    extern "C" {
        pub fn play0(note: u8, length: u8);
        pub fn play1(note: u8, length: u8);
        pub fn play2(note: u8, length: u8);
    }
}

/// The instrument to be used
pub enum Instrument {
    Pulse,
    Square,
    Triangle,
}

#[repr(u8)]
pub enum NotEnum {
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
    match instr {
        Instrument::Pulse => unsafe { imports::play0(note.build(), length.build()) },
        Instrument::Square => unsafe { imports::play1(note.build(), length.build()) },
        Instrument::Triangle => unsafe { imports::play2(note.build(), length.build()) },
    }
}
