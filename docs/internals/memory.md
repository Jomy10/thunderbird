# Memory

The queue has a separate memory module from the one available to games.
Games have access to a memory module of 196608 bytes (0.2 mb). The queue has
access to 65536 bytes. Keep this in mind when developing games. For example, the queue
cannot hold enough draw instrutions to set every single pixel on the screen in one frame.

The first byte of game memory is always reserved for the pressed buttons from the controller.
