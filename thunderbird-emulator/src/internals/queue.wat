(module
    ;; A queue written in WebAssembly that stores and retrieves values as 8 bit integers

    (import "env" "memory" (memory $mem 1 1))

    (import "env" "logN" (func $logN (param i32)))

    (global $memSize i32 (i32.const 65536))
    (global $memStart i32 (i32.const 0))
    (global $memEnd i32 (i32.const 65536))

    ;; (global $memEnd i32 (i32.const 0)) ;; memStart + memSize

    (global $tail (mut i32) (i32.const 0)) ;; initial: memStart
    (global $head (mut i32) (i32.const 0)) ;; initial: memStart

    ;; Amount of elements in the queue
    (global $queueCount (mut i32) (i32.const 0))

    ;; Initializes global values
    (func $init
        ;; deprecated
        nop
    )

    ;; append an item to the queue
    (func $enqueue (param $val i32) (result i32)
        ;; if tail == head && queueCount != 0 => queue is full; return 1
        ;; global.get $tail
        ;; global.get $head
        ;; i32.eq
        ;; (if
        ;;     (then
        ;;         global.get $queueCount
        ;;         i32.eqz
        ;;         (if
        ;;             (then
        ;;                 ;; continue enqueue
        ;;             )
        ;;             (else
        ;;                 i32.const 1
        ;;                 return
        ;;             )
        ;;         )
        ;;     )
        ;; )

        global.get $memSize
        global.get $queueCount
        i32.sub
        i32.eqz
        (if
            (then
                i32.const 1
                return
            )
        )

        ;; insert val at tail
        global.get $tail
        local.get $val
        i32.store8

        ;; queueCount++
        i32.const 1
        global.get $queueCount
        i32.add
        global.set $queueCount

        ;; tail++
        i32.const 1
        global.get $tail
        i32.add
        global.set $tail

        ;; if tail == memEnd => tail = memStart
        global.get $tail
        global.get $memEnd
        i32.eq
        (if
            (then
                global.get $memStart
                global.set $tail
            )
        )

        ;; return success
        i32.const 0
    )

    ;; remove an item from the queue
    ;; returns:
    ;;    [1]: result
    ;;    [0]: return code
    (func $dequeue (result i32 i32)
        ;; check if queueCount != 0 => otherwise return 1
        global.get $queueCount
        i32.const 0
        i32.le_s
        (if
            (then
                i32.const 0
                i32.const 1
                return
            )
        )

        ;; get val from queue at position head
        global.get $head
        i32.load8_u

        ;; head++
        global.get $head
        i32.const 1
        i32.add
        global.set $head

        ;; queueCount--
        global.get $queueCount
        i32.const 1
        i32.sub
        global.set $queueCount

        ;; if head == memSize => head = memStart
        global.get $head
        global.get $memSize
        i32.eq
        (if
            (then
                global.get $memStart
                global.set $head
            )
        )

        ;; return code
        i32.const 0
    )

    (func $unsafeDequeue (result i32)
        ;; get val from queue at position head
        global.get $head
        i32.load8_u

        ;; head++
        global.get $head
        i32.const 1
        i32.add
        global.set $head

        ;; queueCount--
        global.get $queueCount
        i32.const 1
        i32.sub
        global.set $queueCount

        ;; if head == memSize => head = memStart
        global.get $head
        global.get $memSize
        i32.eq
        (if
            (then
                global.get $memStart
                global.set $head
            )
        )
    )

    ;; returns the amount of bytes left on the queue to write to
    (func $availableSize (result i32)
        global.get $memSize
        global.get $queueCount
        i32.sub
    )

    (func $getQueueCount (result i32)
        global.get $queueCount
    )

    ;; exports
    (export "init" (func $init))
    (export "enqueue" (func $enqueue))
    (export "dequeue" (func $dequeue))
    (export "unsafeDequeue" (func $unsafeDequeue))
    (export "availableSize" (func $availableSize))
    (export "queueCount" (global $queueCount))
    (export "getQueueCount" (func $getQueueCount))
    (export "tail" (global $tail))
    (export "head" (global $head))
    (export "memEnd" (global $memEnd))
)
