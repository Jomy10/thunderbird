
cargo build --target=wasm32-unknown-unknown

cp target/wasm32-unknown-unknown/debug/rust_api_example.wasm \
  ../../../thunderbird-emulator/game/game.wasm
