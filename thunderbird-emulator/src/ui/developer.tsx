import type { Component } from 'solid-js';
import { Switch, Match, createSignal } from 'solid-js';

import { VStack, HStack, Flex, Spacer, Box } from '@hope-ui/solid';

import SpriteConverter from './developer_sprite_converter';

export enum Opened {
  Tools,
  SpriteConverter,
};

const DeveloperTools: Component = () => {
  const [ open, setOpen ] = createSignal(Opened.Tools);

  return (
    <Box style="padding-top: 10px;">
      <Switch>
        <Match when={open() === Opened.Tools}>
          <div class="nes-container is-rounded with-title is-dark">
            <p class="title">Sprite Converter</p>
            <p>Convert images to a format that can be used in games to render sprites.</p>
            <button class="nes-btn is-primary" onclick={() => { setOpen(Opened.SpriteConverter) }}>Open</button>
          </div>
        </Match>
        <Match when={open() === Opened.SpriteConverter}>
          <SpriteConverter setOpen={setOpen} />
        </Match>
      </Switch>
    </Box>
  );
}

export default DeveloperTools;
