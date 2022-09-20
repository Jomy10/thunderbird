// An example program to test out sounds
//
// Controls:
// - A: Play currently selected sound
// - B: Switch instrument
// - LB/RB: Change note
// - left/right: Change duration
// - up/down: change floating point of duration

#include "../../../c-api/thunderbird.h"
#include "sound_handle.h"

void __init() {
  // Example:
  // play(I_PULSE, NOTE_C | 4, (1 << 4) | L_SECOND); // play for 1 second
  // play(I_SQUARE, NOTE_A | 2, 0b0010100); // play for 0.1 seconds (= 1 with floating point moved by 1 position)
}

void __main() {
  handleSound();
}

void __deinit() {}
