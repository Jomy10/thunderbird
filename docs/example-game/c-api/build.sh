#!/usr/bin/env sh

# This is an example build file for C projects
# Requirements:
# - clang
# - llvm

# Variables

SOURCE_FILE="main.c"
OUT_FILE="../../../thunderbird-emulator/game/game.wasm"

ENV=''

# Build command
# I use this environment variable on my computer
PATH="/usr/local/opt/llvm/bin:$PATH" \
clang $SOURCE_FILE \
  --target=wasm32 \
  -nostdlib \
  -O2 \
  -Wl,--no-entry \
  -Wl,--allow-undefined \
  -Wl,--lto-O2 \
  -Wl,--import-memory \
  -Wl,--export=__main \
  -Wl,--export=__init \
  -Wl,--export=__deinit \
  -o $OUT_FILE
