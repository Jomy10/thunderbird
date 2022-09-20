// An example program to test out sounds
//
// Controls:
// - A: Play currently selected sound
// - B: Switch instrument
// - LB/RB: Change note
// - left/right: Change duration
// - up/down: change floating point of duration

#include "../../../c-api/thunderbird.h"
#include "../../../c-api/printf.h"
#include "../../../c-api/sprintf.h"
#include <stdbool.h>

#define BYTE_TO_BINARY_PATTERN "%c%c%c%c%c%c%c%c"
#define BYTE_TO_BINARY(byte)  \
  (byte & 0x80 ? '1' : '0'), \
  (byte & 0x40 ? '1' : '0'), \
  (byte & 0x20 ? '1' : '0'), \
  (byte & 0x10 ? '1' : '0'), \
  (byte & 0x08 ? '1' : '0'), \
  (byte & 0x04 ? '1' : '0'), \
  (byte & 0x02 ? '1' : '0'), \
  (byte & 0x01 ? '1' : '0') 

static uint8_t INSTRUMENT = I_PULSE;
static uint8_t NOTE = NOTE_A;
static uint8_t NOTE_N = 4;
static uint8_t LENGTH_N = 1; // << 4
static uint8_t LENGTH_FLOAT = 0; // << 2

static uint8_t INSTRUMENT_MAX = I_TRIANGLE;
static uint8_t NOTE_MAX = NOTE_G;
static uint8_t NOTE_N_MAX = 32; // 2**5
static uint8_t LENGTH_N_MAX = 0b00001111;
static uint8_t LENGTH_FLOAT_MAX = 4;

static bool A_PRESSED_BEFORE = false;
static bool B_PRESSED_BEFORE = false;
static bool LB_PRESSED_BEFORE = false;
static bool RB_PRESSED_BEFORE = false;
static bool LEFT_PRESSED_BEFORE = false;
static bool RIGHT_PRESSED_BEFORE = false;
static bool UP_PRESSED_BEFORE = false;
static bool DOWN_PRESSED_BEFORE = false;

void handleSound() {
  // Play
  if (isPressed(A)) {
    if (!A_PRESSED_BEFORE) {
      uint8_t length = (LENGTH_N << 4) | (LENGTH_FLOAT << 2);
      printf("Playing on instrument %i note %i %i with length "BYTE_TO_BINARY_PATTERN"\n", INSTRUMENT, NOTE, NOTE_N, BYTE_TO_BINARY(length));
      play(INSTRUMENT, NOTE | NOTE_N, length);
      A_PRESSED_BEFORE = true;
    }
  } else {
    A_PRESSED_BEFORE = false;
  }
  
  // Note
  if (isPressed(LBUTTON)) {
    if (!LB_PRESSED_BEFORE) {
      NOTE += 1;
      if (NOTE == NOTE_MAX + 1)  {
        NOTE = NOTE_A;
      }
      LB_PRESSED_BEFORE = true;
    }
  } else {
    LB_PRESSED_BEFORE = false;
  }
  
  if (isPressed(RBUTTON)) {
    if (!RB_PRESSED_BEFORE) {
      NOTE -= 1;
      if (NOTE > NOTE_MAX) {
        NOTE = NOTE_MAX;
      }
      RB_PRESSED_BEFORE = true;
    }
  } else {
    RB_PRESSED_BEFORE = false;
  }
  
  // Instrument
  if (isPressed(B)) {
    if (!B_PRESSED_BEFORE) {
      INSTRUMENT += 1;
      if (INSTRUMENT == INSTRUMENT_MAX + 1) {
        INSTRUMENT = 0;
      }
      B_PRESSED_BEFORE = true;
    }
  } else {
    B_PRESSED_BEFORE = false;
  }
  
  // Length
  if (isPressed(LEFT)) {
    if (!LEFT_PRESSED_BEFORE) {
      LENGTH_N += 1;
      if (LENGTH_N == LENGTH_N_MAX + 1) {
        LENGTH_N = 1;
      }
      LEFT_PRESSED_BEFORE = true;
    }
  } else {
    LEFT_PRESSED_BEFORE = false;
  }
  
  if (isPressed(RIGHT)) {
    if (!RIGHT_PRESSED_BEFORE) {
      LENGTH_N -= 1;
      if (LENGTH_N == 0) {
        LENGTH_N = LENGTH_N_MAX;
      }
      RIGHT_PRESSED_BEFORE = true;
    }
  } else {
    RIGHT_PRESSED_BEFORE = false;
  }
  
  // Floating point
  if (isPressed(UP)) {
    if (!UP_PRESSED_BEFORE) {
      LENGTH_FLOAT += 1;
      if (LENGTH_FLOAT == LENGTH_FLOAT_MAX + 1) {
        LENGTH_FLOAT = 0;
      }
      UP_PRESSED_BEFORE = true;
    }
  } else {
    UP_PRESSED_BEFORE = false;
  }
  
  if (isPressed(DOWN)) {
    if (!DOWN_PRESSED_BEFORE) {
      LENGTH_FLOAT -= 1;
      if (LENGTH_FLOAT > LENGTH_FLOAT_MAX) {
        LENGTH_FLOAT = 0;
      }
      DOWN_PRESSED_BEFORE = true;
    }
  } else {
    DOWN_PRESSED_BEFORE = false;
  }
}
