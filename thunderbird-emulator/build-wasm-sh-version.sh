WAT_DIR="src/internals"
WASM_OUT_DIR="public/wasm"

mkdir -p public/wasm

for var in $(ls $WAT_DIR)
do
  if [[ $var =~ .*\.wat ]]; then
    echo "Compiling $var..."
    wat2wasm "$WAT_DIR/$var" -o "$WASM_OUT_DIR/${var/\.wat/.wasm}" --enable-all
  fi
done
