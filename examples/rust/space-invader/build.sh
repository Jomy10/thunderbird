#!/usr/bin/env zsh

set -e
cd "$(dirname "$0")"

cargo build --target wasm32-unknown-unknown
cp target/wasm32-unknown-unknown/debug/space_invader.wasm ../../../thunderbird-emulator/public/wasm/space_invader.wasm
