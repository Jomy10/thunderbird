(module
  ;; Custom allocator accessible by games

  (import "env" "memory" (memory 3 3))
  (import "env" "store" (func $listStore (param i32 i32) (result i32)))
  (import "env" "combine" (func $listCombine))
  (import "env" "findFreePair" (func $listFindFreePair (param i32) (result i32 i32 i32)))
  (import "env" "setPair" (func $setPair (param i32 i32 i32)))

  ;; start of the memory after the queue
  ;; (import "env" "memStart" (global $memStart i32))
  ;; ;; end of memory for allocation
  ;; (import "env" "memEnd" (global $memEnd i32))
  (global $memStart i32 (i32.const 1)) ;; first byte is for keys
  (global $memEnd i32 (i32.const 196608))

  ;; (import "env" "heapPtr" (global $heapPtr (mut i32))) ;; = memStart
  (global $heapPtr (mut i32) (i32.const 1))

  ;; allocates byteSize amount of memory and returns a pointer to that memory
  ;; returns 0 if no more memory can be allocated
  (func $alloc (param $byteSize i32) (result i32)
   (local $i i32) (local $byteSizeAvailable i32) (local $startIdx i32) (local $endIdx i32) (local $pairIdx i32)

    ;; check if it can be appended to the end of the heap
    global.get $memEnd
    global.get $heapPtr
    i32.sub
    ;; = amount left at the tail of the heap

    local.get $byteSize
    i32.ge_s ;; memLeftIntTail >= byteSize
    if
      ;; assign block of memory and move heapPtr to end
      global.get $heapPtr

      ;; heapPtr += byteSize
      local.get $byteSize
      global.get $heapPtr
      i32.add
      global.set $heapPtr

      ;; return ptr
      return
    else
      ;; look for empty blocks of memory

      local.get $byteSize
      call $listFindFreePair
      local.set $endIdx
      local.set $startIdx
      local.set $pairIdx
      local.get $startIdx
      i32.eqz
      if

        ;; retry
        call $listCombine
        local.get $byteSize
        call $listFindFreePair
        local.set $endIdx
        local.set $startIdx
        local.set $pairIdx
        local.get $endIdx
        i32.eqz
        if
          i32.const 0
          return
        end
      end

      ;; local.set $startIdx ;; still on the stack
      ;; now the idx of the pair is also on the stack

      local.get $endIdx
      local.get $startIdx
      i32.sub
      local.get $byteSize
      i32.eq
      if
        ;; byteSize == (endIdx - startIdx)

        local.get $pairIdx
        i32.const 0
        i32.const 0
        call $setPair

        local.get $startIdx
        return
      else
        ;; byteSize < block
        ;; begin + size

        local.get $pairIdx
        local.get $startIdx
        local.get $byteSize
        i32.add
        local.get $endIdx
        call $setPair

        local.get $startIdx
        return
      end
    end

    ;; fail
    i32.const 0
    return
  )

  ;; returns whether deallocation was succesful (0)
  (func $dealloc (param $ptr i32) (param $byteSize i32) (result i32)
    local.get $ptr
    local.get $ptr
    local.get $byteSize
    i32.add
    call $listStore
  )

  ;; Set all bytes to zero in memory region
  (func $setTo0 (param $ptr i32) (param $byteSize i32)
   (local $i i32)
    (loop $lp_0
      local.get $ptr
      local.get $i
      i32.add
      i32.const 0
      i32.store8

      ;; i++
      local.get $i
      i32.const 1
      i32.add
      local.tee $i

      local.get $byteSize
      i32.lt_s
      if
        br $lp_0
      end
    )
  )

  ;; set the byte at the location of the ptr
  (func $memSet (param $ptr i32) (param $byte i32)
    local.get $ptr
    local.get $byte
    i32.store
  )

  (export "alloc" (func $alloc))
  (export "dealloc" (func $dealloc))
  (export "setTo0" (func $setTo0))
  (export "memSet" (func $memSet))
)
