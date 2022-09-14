import type { Component } from 'solid-js';
import { createResource, createSignal, onMount, Show } from 'solid-js';

import { VStack, HStack, Center, Spacer, Box } from '@hope-ui/solid';
import { Opened } from './developer';

import { notificationService } from '@hope-ui/solid';

import init from '../sprite_converter/pkg/sprite_converter';
import { ConvertReturnType } from '../sprite_converter/pkg/sprite_converter';
import Display from '../emulator/display';
import ScrollView from './scrollView';

type Pixel = {
  x: number; 
  y: number;
  color: number;
};

type SpriteConverter = {
  convert: (png: number, size: number) => ConvertReturnType;
  memory: WebAssembly.Memory;
  /** @param size: the size of the array in bytes
   *  @returns pointer to the array */
  alloc_arr: (size: number) => number;
  dealloc_arr: (ptr: number, size: number) => void;
};
async function fetchSpriteConverter(): Promise<SpriteConverter> {
  let mod = await init();
  mod.init_panic();
  console.log("module loaded", mod);
  // @ts-ignore // typescript is wrong
  return mod as SpriteConverter;
}

const SpriteConverter: Component<{ setOpen: (o: Opened) => void }> = (props) => {
  const [ spriteConverter ] = createResource(fetchSpriteConverter);
  let pixelArr: Pixel[] = [];
  let [pixArrL, setPixArrL] = createSignal(0);
  let ghost: HTMLTextAreaElement;
  onMount(() => {
    ghost = document.getElementById("ghost-txt")! as HTMLTextAreaElement;
  });
  
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

    let pixels_ptr = spriteConverter()!.convert(ptr, arr.length);
    // @ts-ignore // Typescript is wrong here
    let pixels: ConvertReturnType = ConvertReturnType.__wrap(pixels_ptr);
    
    // Canvas example
    const canvas: HTMLCanvasElement = document.getElementById('canvas1')! as HTMLCanvasElement;
    canvas.width = pixels.w;
    canvas.height = pixels.h;
    const ctx = canvas.getContext("2d")!;
    
    // I re-instantiate the memory array here because for some reason javascript
    // (or wasm-bindgen?, seems unlikely) deallocates the previous one.
    mem = new Uint8Array(spriteConverter()!.memory.buffer);
    
    ghost.value = "";
    
    const pixelByteSize = 4;
    for (let i = pixels.pixels; i < pixels.pixels + pixelByteSize*pixels.arr_size; i += pixelByteSize) {
      
      let x = mem[i];
      let y = mem[i+1];
      let c = mem[i+2];
      let transparent: boolean = !!mem[i+3];
      if (transparent) {
        continue;
      }
      
      const color = Display.__convertColorToRgb(c);

      ctx.beginPath();
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.rect(x, y, 1, 1);
      ctx.fill();

      pixelArr.push({x: x, y: y, color: c});

      ghost.value += `${x} ${y} ${c}\n`;
    }
    
    setPixArrL(pixelArr.length);
    
    // Dealloc
    spriteConverter()!.dealloc_arr(pixels.pixels, 4 * pixels.arr_size);
    pixels.free();
  }

  return (
    <ScrollView>
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
          <HStack style="margin-top: 10px;">
            <canvas id="canvas1" width="32" height="32"/>
            <Show when={pixArrL() != 0}>
              <button class="nes-btn" style="margin-left:10px;" onClick={() => { navigator.clipboard.writeText(ghost.value).then(() => {
                notificationService.show({
                  duration: 2_000,
                  render: (_) => {
                    return <div class="nes-container is-rounded is-dark">
                      <HStack>
                        <i class="nes-icon coin"/>
                        <p style="padding-top:17px;padding-left: 10px;">Copied to clipboard</p>
                      </HStack>
                    </div>;
                  },
                });
              }); }}>Copy</button>
            </Show>
            <textarea id="ghost-txt" hidden={true}></textarea>
          </HStack>
        </div>
      </VStack>
    </ScrollView>
  );
};

export default SpriteConverter;
