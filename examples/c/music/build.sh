set -e
cd "$(dirname "$0")"

CLANG="clang"

SOURCE_FILE="main.c"
OUT_FILE="../../../thunderbird-emulator/public/wasm/sound_game.wasm"

LLVM_PATH=true

PREV_ARG="nil"

echo "PREV_ARG=$PREV_ARG"

for var in "$@"
do

  if [[ "$PREV_ARG" == "nil" ]]; then
  
    if [[ "$var" == "-no-llvm-path" ]]; then
      LLVM_PATH=false
    elif [[ "$var" == --clang ]]; then
      PREV_ARG="clang"
    fi
    
  elif [[ "$PREV_ARG" == "clang" ]]; then
    
    CLANG="clang$var"
    PREV_ARG="nil"
    
  else
    echo "unknown argument: $var"
  fi
done

echo $CLANG

if [[ "$LLVM_PATH" == "true" ]]; then
  
  PATH="/usr/local/opt/llvm/bin:$PATH" \
  $CLANG $SOURCE_FILE \
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

  echo "Running without specified llvm path"

  $CLANG $SOURCE_FILE \
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
