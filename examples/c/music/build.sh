set -e
cd "$(dirname "$0")"

SOURCE_FILE="main.c"
OUT_FILE="../../../thunderbird-emulator/public/wasm/sound_game.wasm"

LLVM_PATH=true

if [[ $LLVM_PATH ]]; then
  
  PATH="/usr/local/opt/llvm/bin:$PATH" \
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
  
else

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

fi
