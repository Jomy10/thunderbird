#include "testDealloc.h"
#include <stdint.h>

const intptr_t memStart = 100; // allocator assumes doesn't start at 0
const intptr_t memEnd = 200;
const intptr_t listStart = 200;
const intptr_t listEnd = 300;
const intptr_t listSize = listEnd - listStart;

void expect(int res, int exp) {
  if (res != exp) {
    resultN(1);
  }
}

void expectNot(int res, int nExp) {
  if (res == nExp) {
    resultN(1);
  }
}

int main() {
  int* ptr = alloc(sizeof(int));
  *ptr = 5;
  
  // int ptrs[10];
  // for (int i = 0; i < 10; i++) {
  //   int ptr = alloc(10);
  //   ptrs[i] = ptr;
  //   expectNot(ptr, 0);
  // }
  
  // int ptr = alloc(1);
  // expect(ptr, 0);
  
  // for (int i = 10 - 1; i >= 0; i--) {
  //   dealloc(ptrs[i], 10);
  // }
  
  // int* listStartPtr = (int*) listStart;
  // int listStartVal = *listStartPtr;
  // resultN(listStartVal);
  
  // TODO
  
  return 0;
}
