import type { Component } from 'solid-js';
import { For, Switch, Match, createSignal } from 'solid-js';

import { VStack, Divider } from '@hope-ui/solid';

import * as localForage from 'localforage';

import { DefaultRom, UserRom } from './rom';
import emLoader from '../emulator/loader';

const RomLib: Component<{includeContainer?: boolean}> = (props) => {
  const includeContainer = props.includeContainer ?? true;
  async function handleFileInput() {
    let uploader = document.getElementById("rom-upload")! as HTMLInputElement;
    
    let file = uploader.files![0];
    let name = file.name.replace(".wasm", "");
    let buf = await file.arrayBuffer();
    let arr = new Uint8Array(buf);
    emLoader?.emulator?.loadRom(arr);
    
    await localForage.setItem(name, arr);
    
    setUserRoms(a => [...a, name]);
  }
  
  let [userRoms, setUserRoms] = createSignal([] as string[]);
  (async () => {
    setUserRoms(await localForage.keys());
  })();
  
  const content = <>
    <VStack style={`overflow-y:auto;overflow-x:hidden; ${includeContainer ? "height: calc(min(60vw - 70px, 80vh - 10vh - 70px));" : ""}`} spacing="10px">
      <label class="nes-btn">
        <span>Load file</span>
        <input id="rom-upload" type="file" accept=".wasm" onChange={handleFileInput}></input>
      </label>
      <Divider/>
      <DefaultRom file="space_invader.wasm" name="Space Invaders"/>
      <Divider/>
      <DefaultRom file="drawing_app.wasm" name="Drawing Pro 3000"/>
      <Divider/>
      <DefaultRom file="sound_game.wasm" name="Sound Experimenter 50000"/>
      <For each={userRoms()}>{(rom, _i) => <>
        <Divider/>
        <UserRom key={rom}/>
      </>}</For>
    </VStack>
  </>;

  return (
    <Switch fallback={content}>
      <Match when={includeContainer}>
        <div class="nes-container with-title is-centered is-dark is-rounded" style="max-width: 500em; height: calc(min(60vw, 80vh - 10vh));">
          <p class="title">Rom library</p>
          {content}
        </div>
      </Match>
    </Switch>
  );
}

export default RomLib;
