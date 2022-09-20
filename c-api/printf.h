#ifndef THUNDERBIRD_PRINTF_H
#define THUNDERBIRD_PRINTF_H

#include <stdarg.h>
#include "sprintf.h"

#define __TB_NARG(...) __TB_NARG_(__VA_ARGS__, __TB_PRESQ_N())
#define __TB_NARG_(...) __TB_ARG_N(__VA_ARGS__)
#define __TB_ARG_N(_1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, N, ...) N
#define __TB_PRESQ_N() 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0

// Private count function
static inline int __thunderbird_sum(int argCount, ...) {
  va_list args;
  va_start(args, argCount);
  int sum = 0;
  for (int i = 0; i < argCount; i++) {
    sum += _strnlen_s(va_arg(args, char*), 1000);
  }
  va_end(args);

  return sum;
}

// Print formatted
#define printf(format, ...) { \
int bufferSize = _strnlen_s(format, 1000) + __thunderbird_sum(__TB_NARG(__VA_ARGS__) , __VA_ARGS__); \
char* str = (char*) alloc(bufferSize); \
sprintf(str, format, __VA_ARGS__); \
int str_size = _strnlen_s(str, 1000); \
print(str, str_size); \
dealloc(str, bufferSize); \
}

// Print string
#define prints(_str) { \
int strSize = _strnlen_s(_str, 1000); \
char* str = (char*) alloc(strSize); \
print(str, strSize); \
dealloc(str, strSize); \
}

#endif
