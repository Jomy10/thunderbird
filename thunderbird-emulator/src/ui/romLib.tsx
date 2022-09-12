import type { Component } from 'solid-js';

import { VStack, Center } from '@hope-ui/solid';

// import emLoader from '../emulator/loader';

import { DefaultRom } from './rom';

const RomLib: Component = () => {
  // function handleClick() {
  //   let req = new XMLHttpRequest();
  //   req.open("GET", "/wasm/platformer.wasm");
  //   req.responseType = "arraybuffer";
  //   req.onload = (_event) => {
  //     const arrayBuffer = req.response;
  //     const byteBuffer = new Uint8Array(arrayBuffer);
  //     emLoader?.emulator?.loadRom(byteBuffer)
  //   };
  //   req.send(null);
  // }

  return (
    <div class="nes-container with-title is-centered is-dark is-rounded" style="max-width: 500em;">
        <p class="title">Rom library</p>
      <VStack>
        <DefaultRom file="space_invader.wasm" name="Space Invaders" />
      </VStack>
    </div>
  );
}

export default RomLib;
