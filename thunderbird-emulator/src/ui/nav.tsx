import type { Component } from 'solid-js';

import { Box, HStack } from '@hope-ui/solid';

const Nav: Component<{onSettings: () => void, onDev: () => void, isDev: Boolean }> = (props) => {
  return (
    <Box 
      h={"fit-content"} bg="#2b3036" 
      style="padding-left: 3vw; padding-right: 3vw; padding-top: 10px; padding-bottom: 10px; display: flex; justify-content: flex-end;">
        <HStack>
          <button type="button" class="nes-btn" onclick={props.onDev}>{props.isDev ? "Emulator" : "Developer"}</button>
          <button type="button" class="nes-btn" onclick={props.onSettings}>Settings</button>
        </HStack>
    </Box>
  );
};

export default Nav;
