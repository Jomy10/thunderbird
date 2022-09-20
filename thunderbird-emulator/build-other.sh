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
    fi
  elif [[ "$PREV_ARG" == "c" ]]; then
    C_ARGS+=$var
    C_ARGS+=" "
  fi

done

# Build examples
sh ../examples/rust/space-invader/build.sh
sh ../examples/wasm/drawing-app/build.sh
sh ../examples/c/music/build.sh $C_ARGS

# Build wasm
node build-wasm.js
