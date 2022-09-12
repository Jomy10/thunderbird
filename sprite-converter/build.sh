# Build rust library to wasm
wasm-pack build --target=web

mkdir -p ../thunderbird-emulator/wasm/sprite_converter
cp -R pkg ../thunderbird-emulator/wasm/sprite_converter

# set -e

# cargo build --target=wasm32-unknown-unknown
# mkdir -p ../thunderbird-emulator/wasm
# cp target/wasm32-unknown-unknown/debug/sprite_converter.wasm ../thunderbird-emulator/wasm
