(module
    (import "queue" "enqueue" (func $enqueue (param i32) (result i32)))
    (import "queue" "dequeue" (func $dequeue (result i32 i32)))
    (import "queue" "unsafeDequeue" (func $unsafeDequeue (result i32)))

    (import "game" "main_func" (func $main_func))

    (import "console" "logN" (func $logN (param i32)))

    ;; drawing
    (import "emulator" "draw" (func $draw (param i32 i32 i32)))
    (import "emulator" "fill" (func $fill (param i32)))
    (import "emulator" "drawRect" (func $drawRect (param i32 i32 i32 i32 i32)))

    ;; sound
    (type (;0;) (func (param i32 i32)))
    (import "emulator" "play0" (func $play0 (type 0)))
    (import "emulator" "play1" (func $play1 (type 0)))
    (import "emulator" "play2" (func $play2 (type 0)))

    ;; Executes one tick iteration
    ;; returns a status code:
    ;;  [0] do nothing
    ;;  [1] stop execution of the program
    (func $tick (result i32) (local $instruction i32)
        (local $t1 i32)(local $t2 i32)(local $t3 i32)(local $t4 i32)(local $t5 i32)
        ;; 1. Call main game loop
        call $main_func

        (loop $execQueue
            ;; 2. Execute instructions
            call $dequeue

            ;; if statusCode did not return 0 (returned 1)
            (if
                (then
                    i32.const 0
                    return
                )
            )

            ;; instruction = (last) value returned from loop
            local.set $instruction

            ;; execute the instruction

            (block $execInstruction
                ;; stop execution
                i32.const 0 ;; instruction 0
                local.get $instruction
                i32.eq
                (if
                    (then
                        i32.const 1
                        return
                    )
                )

                ;; todo: binary operators to compare => know that an instruction is a variant of a function (different amount of parameters)

                ;; draw x y color
                i32.const 1
                local.get $instruction
                i32.eq
                (if
                    (then
                        call $dequeue
                        drop
                        call $dequeue
                        drop
                        call $dequeue
                        drop
                        call $draw

                        br $execInstruction ;; stop looking for matchin instruction
                    )
                )

                ;; drawRect x y w h color
                i32.const 2
                local.get $instruction
                i32.eq
                (if
                    (then
                        call $dequeue
                        drop
                        call $dequeue
                        drop
                        call $dequeue
                        drop
                        call $dequeue
                        drop
                        call $dequeue
                        drop
                        call $drawRect

                        br $execInstruction ;; stop looking for matchin instruction
                    )
                )

                ;; fill color
                i32.const 3
                local.get $instruction
                i32.eq
                (if
                    (then
                        call $dequeue
                        drop
                        call $fill

                        br $execInstruction ;; stop looking for matchin instruction
                    )
                )

                ;; play0 note lengh
                i32.const 4
                local.get $instruction
                i32.eq
                (if
                    (then
                        call $dequeue
                        drop
                        call $dequeue
                        drop
                        call $play0

                        br $execInstruction ;; stop looking for matchin instruction
                    )
                )

                ;; ;; play1 note lengh
                i32.const 5
                local.get $instruction
                i32.eq
                (if
                    (then
                        call $dequeue
                        drop
                        call $dequeue
                        drop
                        call $play1

                        br $execInstruction ;; stop looking for matchin instruction
                    )
                )

                ;; ;; play2 note lengh
                i32.const 6
                local.get $instruction
                i32.eq
                (if
                    (then
                        call $dequeue
                        drop
                        call $dequeue
                        drop
                        call $play2

                        br $execInstruction ;; stop looking for matchin instruction
                    )
                )
                
                ;; error code 500: wrong instruction
                i32.const -500
                call $logN
                
                local.get $instruction
                call $logN

                ;; br $execInstruction
                ;; local.get $instruction
                ;; call $logN
                ;; unreachable

                ;; TODO: figure out why this place is reached (should be unreachable)
            ) ;; end instruction block

            ;; loop again
            br $execQueue
        ) ;; end loop
        i32.const 0
        return
    )

    (export "tick" (func $tick))
)
