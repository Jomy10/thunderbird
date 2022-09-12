#!/usr/bin/env zsh

set -e
cd "$(dirname "$0")"

cargo build --target wasm32-unknown-unknown
# rm ../../../wasm/space_invader.wasm || echo "could not remove"
cp target/wasm32-unknown-unknown/debug/space_invader.wasm ../../../wasm/space_invader.wasm
