import fetchWasm from "../util/fetchWasm";

export type Allocator = {
  alloc: (bytes: number) => (number);
  dealloc: (ptr: number, bytes: number) => number;
  setTo0: (ptr: number, bytes: number) => void;
  memSetByte: (ptr: number, byte: number) => void;
  memSet: (ptr: number, val: number, length: number) => void;
};

/** load the wasm memory allocator */
export default async function loadAlloc(
  mem: WebAssembly.Memory,
  memStart: number = Math.pow(2,16), memSize: number = 3*(Math.pow(2,16)),
): Promise<Allocator> {
  const availableList = await fetchWasm("wasm/alloc_available_list.wasm");
  const alloc: Allocator = await fetchWasm("wasm/alloc.wasm", {
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
  }) as Allocator;
  return alloc;
}
