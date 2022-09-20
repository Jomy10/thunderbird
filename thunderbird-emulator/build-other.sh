# Builds non-js/ts files

set -e
cd "$(dirname "$0")"

# Build examples
sh ../examples/rust/space-invader/build.sh
sh ../examples/wasm/drawing-app/build.sh
sh ../examples/c/music/build.sh

# Build wasm
node build-wasm.js
