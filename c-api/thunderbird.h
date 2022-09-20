#ifndef THUNDERBIRD_THUNDERBIRD_H
#define THUNDERBIRD_THUNDERBIRD_H

#include <stdint.h>
#include <stddef.h>

//==================
// Private imports
//==================

// private import
size_t alloc(size_t n);
// private import
void setTo0(void* ptr, size_t size);
// private import
int dealloc(void* ptr, size_t size);
// private import
size_t __dequeue_result();

//==================
// Public API
//==================

// imports //

// Set pixel at `x`, `y` to color `color`
int draw(uint8_t x, uint8_t y, uint8_t color);
// Draw a rectangle at `x`, `y` with width `w` and height `h` and color `color`
int drawRect(uint8_t x, uint8_t y, uint8_t w, uint8_t h, uint8_t color);
// Fill the screen with a color
int fill(uint8_t color);

// Play a note
int play(uint8_t instrument, uint8_t note, uint8_t length);

// Instruments
#define I_PULSE 0
#define I_SQUARE 1
#define I_TRIANGLE 2

// Notes
#define NOTE_A 0b00000000
#define NOTE_B 0b00100000
#define NOTE_C 0b01000000
#define NOTE_D 0b01100000
#define NOTE_E 0b10000000
#define NOTE_F 0b10100000
#define NOTE_G 0b11000000

// Length types
#define L_SECOND 0
#define L_NOTE 1
#define L_TRIPLET 2
#define L_MEASURE 3

// Get the first byte in memory
uint8_t getKeys();

// Keys
#define UP 0b10000000
#define DOWN 0b01000000
#define LEFT 0b00100000
#define RIGHT 0b00010000
#define A 0b00001000
#define B 0b00000100
#define LBUTTON 0b00000010
#define RBUTTON 0b00000001

// Get a timestamp that can be used for random number generators
int getTimestamp();

// Print a string
void print(void* ptr, size_t size);
// ttttt a string as an error
void printErr(void* ptr, size_t size);
// Print a number
void printN(int n);

// Enqueue a byte to the instruction queue. Returns 0 if the byte could be enqueued
// returns 1 otherwise.
int enqueue(uint8_t val);

// Returns the available size in the queue
int availableQueueSize();

// funcs //

// Check if a button is pressed
int isPressed(uint8_t key) {
  return (getKeys() & key) == key;
}

// The malloc() function shall allocate unused space for an object whose size in
// bytes is specified by size and whose value is unspecified.
// 
// https://pubs.opengroup.org/onlinepubs/9699919799/functions/malloc.html
void* malloc(size_t size) {
  size_t totalSize = size + sizeof(size_t);
  size_t* ptr = (size_t*) alloc(totalSize);
  *ptr = totalSize;
  
  return (void*) (ptr + sizeof(size_t));
}

// Free an allocated pointer.
// 
// https://pubs.opengroup.org/onlinepubs/9699919799/functions/free.html
void free(void* ptr) {
  size_t* ptr_cast = (size_t*) ptr;
  size_t* size_element = ptr_cast - sizeof(size_t);
  size_t size = *size_element;

  dealloc(ptr, size);
}

// The calloc() function shall allocate unused space for an array of nelem
// elements each of whose size in bytes is elsize. The space shall be
// initialized to all bits 0.
// 
// https://pubs.opengroup.org/onlinepubs/9699919799/functions/calloc.html
void* calloc(size_t nelem, size_t elsize) {
  size_t totalSize = nelem * elsize;
  void* ptr = malloc(totalSize);
  setTo0(ptr, totalSize);
  
  return ptr;
}

// Copies the character c (an unsigned char) to the first n characters of the
// string pointed to by the argument str
void* memset(void* ptr, int c, size_t n);

void exit(int code) {
  // Digit count
  int count = 0;
  int n = code;
  do {
    n /= 10;
    ++count;
  } while (n != 0);

  // Collect digits
  int digits[count];
  int idx = 0;
  while (code) {
    digits[idx] = code % 10;
    code /= 10;
    idx++;
  }

  char* str = (char*) malloc(22 + count);
  char fullStr[] = "Exited with exit code ";

  for (int i = 0; i < 22; i++) {
    *(str + i) = fullStr[i];
  }
  for (int i = 0; i < count; i++) {
    *(str + i + 22) = digits[i];
  }
  
  print(str, 22 + count);
  free(str);
  
  if (!enqueue(0)) {
    while(__dequeue_result()) {} // empty queue
    enqueue(0);
  }
}

// Convert r g b values to 8 bit color
static inline uint8_t color(uint8_t r, uint8_t g, uint8_t b) {
  return (
    ((uint8_t) ((r / 255.0f) * (2.0f * 2.0f * 2.0f))) << 5 |
    ((uint8_t) ((g / 255.0f) * (2.0f * 2.0f * 2.0f))) << 2 |
    ((uint8_t) ((b / 255.0f) * (2.0f * 2.0f)))
  );
}

#endif
