#!/usr/bin/env ruby
require 'beaver'

NPM="pnpm"

command :all do
  $beaver.call :test_internals
  $beaver.call :build_emulator
end

## thunderbird-emulator ##
command :build_examples do
  sys "sh ./examples/rust/space-invader/build.sh"
  sys "sh ./examples/wasm/drawing-app/build.sh"
end

command :build_internals do
  sys "node ./thunderbird-emulator/build-wasm.js"
end

# include build_internals and build_examples
command :build_emulator do
  sys "cd thunderbird-emulator && #{NPM} run build"
end

## Run tests ##
command :test_internals do
  sys "cd thunderbird-emulator && #{NPM} run test"
end

## Docs ##
command :serve_docs do
  sys "docsify serve ./docs"
end

$beaver.end
