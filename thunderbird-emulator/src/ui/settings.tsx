import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';

import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, DrawerHeader, createDisclosure } from '@hope-ui/solid';

import KeySettings from './settings_keys';

const Settings: Component<{isOpen: Boolean, onClose: () => void}> = (props) => {
  const{ isOpen, onOpen, onClose } = createDisclosure();

  createEffect(() => {
    if (props.isOpen) { console.log("Opened drawer"); onOpen(); }
  });

  return (<>
    <Drawer
      opened={isOpen()}
      placement="right"
      onClose={() => {onClose(); props.onClose();}}
    >
      <DrawerOverlay />
      <DrawerContent bg={"#2b3036"}>
        <DrawerCloseButton icon={<i class="nes-icon close"></i>} />
        <DrawerHeader>Settings</DrawerHeader>
        <DrawerBody>
          <h2>Remap keys</h2>
          <KeySettings/>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </>);
};

export default Settings;
