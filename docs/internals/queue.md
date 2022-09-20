# The instruction queue

The Thunderbird console operates on an instruction queue. An instruction is a
sequence of bytes that consists of at least one byte.

For example, the instruction `draw x y color` sets the pixel at position (x, y)
to the specified color. To execute this instruction, 4 bytes has to be pushed to
the queue:

* `00000001`: draw
* `00000001`: x = 1
* `00000011`: y = 3
* `11100000`: color = pure red

For more info on the different instructions and the byte layout of the color,
see the [using the queue](queue) section.
