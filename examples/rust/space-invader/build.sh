#!/usr/bin/env zsh

set -e
cd "$(dirname "$0")"

mkdir -p ../../../thunderbird-emulator/public/wasm/

cargo build --target wasm32-unknown-unknown --release
cp target/wasm32-unknown-unknown/release/space_invader.wasm ../../../thunderbird-emulator/public/wasm/space_invader.wasm
