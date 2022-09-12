(module
    ;; queue
    ;; (memory (export "memory") 1 1)
    (import "env" "memory" (memory $mem 4 4))
    ;; 2^16 (65536) = size of one page of memory
    ;; size of the queue
    (import "env" "memSize" (global $memSize i32)) ;; the total size of the queue in memory
    (import "env" "memStart" (global $memStart i32)) ;; place in memory where the first element of the queue is located
    ;; (import "env" "memEnd" (global $memEnd i32))
    ;; (global $memSize i32 (i32.const 65535))
    ;; (global $memStart i32 (i32.const 1))
    (global $memEnd (mut i32) (i32.const 0)) ;; memStart + memSize

    (global $tail (mut i32) (i32.const 0)) ;; memStart
    (global $head (mut i32) (i32.const 0)) ;; memStart
    ;; amount of elements on the queue
    (global $queueCount (mut i32) (i32.const 0))
    
    (func $init
        global.get $memStart
        global.get $memSize
        i32.add
        global.set $memEnd
        
        global.get $memStart
        global.get $memStart
        global.set $tail
        global.set $head
    )

    ;; puts $val onto the queue
    (func $enqueue (param $val i32) (result i32)
        ;; if tail == head && queueCount != 0, return 1 (queue is full)
        global.get $tail
        global.get $head
        i32.eq
        (if
            (then
                ;; tail == head

                ;; if queueCount == 0 => continue, otherwise queue is full
                global.get $queueCount
                i32.eqz
                (if
                    (then)
                    (else
                        ;; queueCount != 0
                        i32.const 1
                        return
                    )
                )
            )
        )

        ;; add element to tail
        global.get $tail
        local.get $val
        i32.store8 ;; store 8-bit integer

        ;; queueCount++
        i32.const 1
        global.get $queueCount
        i32.add
        global.set $queueCount

        ;; set tail to point to next element in array

        ;; tail++
        global.get $tail
        i32.const 1
        i32.add
        global.set $tail

        ;; check tail == memEnd
        global.get $memEnd
        global.get $tail
        i32.eq
        (if
            (then
                ;; tail == memEnd => set tail = memStart
                global.get $memStart
                global.set $tail
            )
        )

        i32.const 0
    )

    ;; returns (1) whether a value could be retrieved from the stack (1 if not, 0 otherwise)
    ;; returns (2) the first element in the queue
    (func $dequeue (result i32 i32) (local $tmp i32)
        ;; if queueCount == 0 => no value on the stack
        global.get $queueCount
        i32.eqz
        (if
            (then
                i32.const 1
                i32.const 0
                return
            )
        )

        ;; tmp = head
        global.get $head
        local.set $tmp

        ;; head++
        global.get $head
        i32.const 1
        i32.add
        global.set $head

        ;; if head == memEnd, set head to memStart
        global.get $head
        global.get $memEnd
        i32.eq
        (if
            (then
                global.get $memStart
                global.set $head
            )
        )

        ;; queueCount--
        global.get $queueCount
        i32.const 1
        i32.sub
        global.set $queueCount

        ;; status code
        i32.const 0

        ;; mem[tmp]
        local.get $tmp
        i32.load8_u
    )

    ;; get value from queue without checking bounds and without returning status code
    (func $unsafeDequeueNoStatus (result i32) (local $tmp i32)
        ;; tmp = head
        global.get $head
        local.set $tmp

        ;; head++
        global.get $head
        i32.const 1
        i32.add
        global.set $head

        ;; if head == memEnd, set head to memStart
        global.get $head
        global.get $memEnd
        i32.eq
        (if
            (then
                global.get $memStart
                global.set $head
            )
        )

        ;; queueCount--
        global.get $queueCount
        i32.const 1
        i32.sub
        global.set $queueCount

        ;; mem[tmp]
        local.get $tmp
        i32.load8_u
    )

    (export "init" (func $init))
    (export "enqueue" (func $enqueue))
    (export "dequeue" (func $dequeue))
    (export "unsafeDequeue" (func $unsafeDequeueNoStatus))
    (export "tail" (global $tail))
    (export "head" (global $head))
    (export "queueCount" (global $queueCount))
)
