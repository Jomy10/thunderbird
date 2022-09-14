# Build main.wat and put it inside of /wasm/drawing_app.wasm

set -e
cd "$(dirname "$0")"

wat2wasm main.wat -o ../../../thunderbird-emulator/public/wasm/drawing_app.wasm
