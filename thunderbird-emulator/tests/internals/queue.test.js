const fs = require("fs");

const memSize = 100;
const memStart = 0;

async function fetchWasm(file, imports) {
  return (await WebAssembly.instantiate(fs.readFileSync(file), imports)).instance.exports;
}

let queue;
let mem;
beforeEach(async () => {
  mem = new WebAssembly.Memory({initial: 4, maximum: 4});
  queue = await fetchWasm("wasm/queue.wasm", {
    env: {
      memory: mem,
      memSize: memSize,
      memStart: memStart,
      logN: function(n) { console.log(n); },
    }
  });
  queue.init();
})

test('queue order', () => {
  expect(queue.dequeue()).toStrictEqual([ 0, 1]);
  expect(queue.enqueue(5)).toBe(0);
  expect(queue.enqueue(6)).toBe(0);
  expect(queue.enqueue(8)).toBe(0);
  expect(queue.enqueue(1)).toBe(0);
  expect(queue.enqueue(2)).toBe(0);
  expect(queue.dequeue()).toStrictEqual([ 5, 0]);
  expect(queue.enqueue(4)).toBe(0);
  expect(queue.enqueue(22)).toBe(0);
  expect(queue.dequeue()).toStrictEqual([ 6, 0]);
  expect(queue.enqueue(69)).toBe(0);
  expect(queue.dequeue()).toStrictEqual([ 8, 0]);
  expect(queue.dequeue()).toStrictEqual([ 1, 0]);
  expect(queue.dequeue()).toStrictEqual([ 2, 0]);
  expect(queue.dequeue()).toStrictEqual([ 4, 0]);
  expect(queue.dequeue()).toStrictEqual([ 22, 0]);
  expect(queue.dequeue()).toStrictEqual([ 69, 0]);
});


// Using while instead of for, because of performance (this is a long test)
test("Full queue", () => {
  var i = 0, l = memSize;
  while (i < l) {
    expect(queue.enqueue(2)).toBe(0);
    ++i;
  }
  // No more elements can be added
  expect(queue.enqueue(0)).toBe(1);

  // All elements in the queue are 1
  const memArr = new Uint8Array(mem.buffer);
  var i = 0;
  while (i < l) {
    expect(memArr[memStart + i]).toBe(2);
    ++i;
  }

  // All returned elements shoud be 1
  var i = 0;
  while (i < l) {
    const [ result, code ] = queue.dequeue();
    expect(code).toBe(0);
    expect(result).toBe(2);
    ++i;
  }
  expect(queue.dequeue()).toStrictEqual([0, 1]);
});

test("available size", () => {
  expect(queue.availableSize()).toBe(memSize);
  queue.enqueue(6);
  expect(queue.availableSize()).toBe(memSize - 1);
  queue.dequeue();
  expect(queue.availableSize()).toBe(memSize);
});
