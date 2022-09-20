WAT_DIR="src/internals"
WASM_OUT_DIR="public/wasm"

for var in $(ls $WAT_DIR)
do
  echo "Compiling $var..."
  wat2wasm var -o "$WASM_OUT_DIR/$var" --enable-all
done
