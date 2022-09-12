#!/usr/bin/env ruby
require 'beaver'

NPM="pnpm"

CC="clang"
C_ENV="PATH=\"/usr/local/opt/llvm/bin:$PATH\""
C_WASM_FLAGS=%{\
--target=wasm32 \
-nostdlib \
-O2 \
-Wl,--no-entry \
-Wl,--export-all \
-Wl,--lto-O2 \
-Wl,--allow-undefined \
-Wl,--import-memory \
}

command :compile_internals do
  system "mkdir -p wasm"
  sys "node build-wasm.js"
  # sys "#{C_ENV} #{CC} #{C_WASM_FLAGS} #{sources} -o #{target}"
end

$beaver.end