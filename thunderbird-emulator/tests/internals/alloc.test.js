const fs = require("fs");

const memStart = 100; // allocator assumes doesn't start at 0
const memEnd = 200;
const memSize = memEnd - memStart;

async function fetchWasm(file, imports) {
  return (await WebAssembly.instantiate(fs.readFileSync(file), imports)).instance.exports;
}

let mem;
let mod;
beforeEach(async () => {
  mem = new WebAssembly.Memory({initial: 3, maximum: 3});
  const availableList = (await fetchWasm("wasm/alloc_available_list.wasm"));
  mod = await fetchWasm("wasm/alloc.wasm", {
    env: {
      memory: mem,
      memStart: memStart,
      memEnd: memStart + memSize,
      heapPtr: new WebAssembly.Global({value: 'i32', mutable: true }, memStart),
      // list
      store: availableList.store,
      combine: availableList.combine,
      findFreePair: availableList.findFreePair,
      setPair: availableList.setPair
    }
  });
  avList = availableList;
});

test("alloc", () => {
  for (let i = 0; i < 10; i++) {
    let val = mod.alloc(10);
    expect(val).not.toBe(0);
  }
  expect(mod.alloc(1)).toBe(0);
});

test("alloc full + dealloc all + alloc full", async () => {
  let ptrs = [];
  for (let i = 0; i < 10; i++) {
    let ptr = mod.alloc(10);
    expect(ptr).not.toBe(0);
    ptrs.push(ptr);
  }
  expect(mod.alloc(1)).toBe(0);

  for (let i = 0; i < ptrs.length; i++) {
    expect(mod.dealloc(ptrs[i], 10)).toBe(0);
  }
  
  expect(avList.getPair(0)).toStrictEqual([100+0, 100+10]);
  
  for (let i = 0; i < 10; i += 1) {
    expect(avList.getPair(i)).toStrictEqual([100+i*10, 100+i*10+10]);
  }
  
  for (let i = 0; i < 10; i++) {
    expect(mod.alloc(10)).not.toBe(0);
  }
  expect(mod.alloc(1)).toBe(0);
});
