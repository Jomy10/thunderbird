// Builds the internals from wat to wasm
const exec = require('child_process').exec;
const fs = require('fs').promises;
const path = require('path');

const watDir = 'src/internals';
const wasmOutDir = "public/wasm";

/** Compiles all `.wat` files in the `watDir` to wasm in the `wasmOutDir` */
async function compileWasm() {
  let files = await fs.readdir(watDir);
  for (let file of files) {
    if (/.*\.wat/.test(file)) {
      console.log(`Compiling ${file}...`);
      wat2wasm(
        path.join(watDir, file),
        path.join(wasmOutDir, file.replace(".wat", ".wasm"))
      );
    }
  }
}

function wat2wasm(file, outFile) {
  exec(`wat2wasm ${file} -o ${outFile}`, function(err, stdout, stderr) {
    if (stderr != "") {
      console.log("Error while converting wat:", stderr);
    } else if (err !== null) {
      console.log("Error while converting wat:", err);
    }
  });
}

compileWasm();
