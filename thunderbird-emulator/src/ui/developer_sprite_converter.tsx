import type { Component } from 'solid-js';
import { createResource } from 'solid-js';

import { VStack, HStack, Spacer, Box } from '@hope-ui/solid';
import { Opened } from './developer';

import init from '../../wasm/sprite_converter/pkg/sprite_converter';
import type { InitOutput } from '../../wasm/sprite_converter/pkg/sprite_converter';

type SpriteConverter = {
  convert: (png: number, size: number) => [pixels: number, size: number];
  memory: WebAssembly.Memory;
  /** @param size: the size of the array in bytes
   *  @returns pointer to the array */
  alloc_arr: (size: number) => number;
  dealloc_arr: (ptr: number, size: number) => void;
};
async function fetchSpriteConverter(): Promise<SpriteConverter> {
  let mod = init();
}

const SpriteConverter: Component<{ setOpen: (o: Opened) => void }> = (props) => {
  const [ spriteConverter ] = createResource(fetchSpriteConverter);
  
  async function handleFileInput() {
    let spriteUpload = document.getElementById("sprite-upload")! as HTMLInputElement;
    let buf = await spriteUpload.files![0].arrayBuffer();
    let arr = new Uint8Array(buf);
    let ptr = spriteConverter()?.alloc_arr(arr.length);
    if (ptr == null || ptr === 0) {
      console.error("Failed to allocate memory, returned a null pointer.");
      return;
    }
    let mem = new Uint8Array(spriteConverter()!.memory.buffer);
    for (let i = 0; i < arr.length; i++) {
      mem[ptr + i] = arr[i];
    }
    let [pixels_ptr, pixels_size] = spriteConverter()!.convert(ptr, arr.length);
    console.log("Pixels:", pixels_ptr, pixels_size);
    // let ptr = spriteConverter()?.alloc_arr(arr.length);
    // if (ptr == null) {
    //   console.error("Failed to allocate memory, returned null pointer.");
    //   return;
    // }
    // let mem = new Uint8Array(spriteConverter()!.memory.buffer);
    // for (let i = 0; i < arr.length; i++) {
    //   mem[ptr + i] = arr[i];
    // }
    // spriteConverter()!.test(ptr, arr.length);
    // spriteConverter()!.dealloc_arr(ptr, arr.length);
  }

  return (
    <Box>
      <VStack>
        <HStack w="90vw">
          <button type="button" class="nes-btn" onclick={() => { props.setOpen(Opened.Tools) }}>Back</button>
          <Spacer/>
        </HStack>
        <div class="nes-container is-dark with-title" style="width: 90vw; margin-top: 10px;">
          <p class="title">Sprite converter</p>
          <p>This tool wil convert png images to pixel coordinates and colors.</p>
          <p>To start, upload an image:</p>
          <label class="nes-btn">
              <span>Select a file</span>
              <input id="sprite-upload" type="file" accept=".png" onChange={handleFileInput}></input>
          </label>
        </div>
      </VStack>
    </Box>
  );
};

export default SpriteConverter;
