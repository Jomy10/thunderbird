const fs = require('fs');
async function fetchWasm(file, imports) {
  return (await WebAssembly.instantiate(fs.readFileSync(file), imports)).instance.exports;
}

let mem;
let mod;
beforeEach(async () => {
  mod = await fetchWasm("wasm/alloc_available_list.wasm", {});
  mem = mod.memory;
});

test("add", () => {
  expect(mod.store(10, 20)).toBe(0);
  expect(mod.getPair(0)).toStrictEqual([10, 20]);
  expect(mod.store(50, 80)).toBe(0);
  expect(mod.getPair(1)).toStrictEqual([50, 80]);
  expect(mod.store(20, 32)).toBe(0);
  expect(mod.getPair(2)).toStrictEqual([20, 32]);
});

test("combine", () => {
  mod.store(10, 20);
  mod.store(50, 80);
  mod.store(20, 32);
  mod.combine();
  expect(mod.getPair(0)).toStrictEqual([10, 32]);
  expect(mod.getPair(1)).toStrictEqual([50, 80]);
  expect(mod.getPair(2)).toStrictEqual([0, 0]);
});
