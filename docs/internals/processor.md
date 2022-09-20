# The processor

The processor empties the queue 60 times per second. The following gets
executed every tick:

1. The main function of the inserted game is executed.
2. Items are dequeued from the queue and executed based on the instruction id

When the processor finds an unknown instruction, it wil throw the error code -500.
This will be logged to the console.
