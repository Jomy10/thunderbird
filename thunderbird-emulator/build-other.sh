# Builds non-js/ts files

set -e
cd "$(dirname "$0")"

PREV_ARG="nil"
C_ARGS=""

for var in "$@"
do

  if [[ "$PREV_ARG" == "nil" ]]; then
  
    if [[ "$var" == "--pass-c-example" ]]; then
      PREV_ARG="c"
    elif [[ "$var" == "--sh" ]]
      PREV_ARG="sh"
    fi
    
  elif [[ "$PREV_ARG" == "c" ]]; then
    C_ARGS+=$var
    C_ARGS+=" "
    PREV_ARG="nil"
  elif [[ "$PREV_ARG" == "sh" ]]; then
    sh=$var
    PREV_ARG="nil"
  fi

done

SH=sh

# Build examples
$SH ../examples/rust/space-invader/build.sh
$SH ../examples/wasm/drawing-app/build.sh
$SH ../examples/c/music/build.sh $C_ARGS

# Build wasm
node build-wasm.js
