#!/usr/bin/env sh

# This is an example build file for C projects
# Requirements:
# - clang
# - llvm

# Variables

SOURCE_FILE="main.c"
OUT_FILE="game.wasm"

# Build command

clang $SOURCE_FILE \
  --target=wasm32 \
  -nostdlib \
  -O2 \
  -Wl,--no-entry \
  -Wl,--lto-O2 \
  -Wl,--allow-undefined \
  -Wl,--import-memory \
  -Wl,--export=__main \
  -Wl,--export=__init \
  -Wl,--export=__deinit \
  -o $OUT_FILE
