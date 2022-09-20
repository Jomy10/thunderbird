;; Store the available addresses of memory that have been previously allocated
;; and are now deallocated

(module
  ;; one block of memory to store the addresses
  (memory $mem 1 1)

  ;; amount of addresses mem provides
  (global $memSize i32 (i32.const 65536))
  ;; size in bytes of a pointe (32 bit integer)
  (global $ptrSize i32 (i32.const 4))

  (global $lastI (mut i32) (i32.const 0))

  ;; Stores start and end indexes to the available indexes list
  (func $store (param $start i32) (param $end i32) (result i32)
   (local $i i32)
    global.get $lastI
    global.get $memSize
    i32.ge_s
    if
      call $combine
    end

    global.get $lastI
    local.set $i
    loop $lp_0
      ;; if *i == 0
      local.get $i
      i32.load
      i32.eqz
      if
        ;; *i = start
        local.get $i
        local.get $start
        i32.store

        ;; *i+ptrSize = end
        local.get $i
        global.get $ptrSize
        i32.add
        local.get $end
        i32.store

        local.get $i
        global.set $lastI

        i32.const 0
        return
      end

      ;; i += 2 * ptrSize
      global.get $ptrSize
      global.get $ptrSize
      i32.add
      local.get $i
      i32.add
      local.tee $i

      ;; i < memsize => continue looping
      global.get $memSize
      i32.lt_s
      if
        br $lp_0
      end
    end

    ;; failed to store = memory leak
    i32.const 1
  )
  ;; Combines blocks of memory together
  ;; Is called by store when it can't find any more blocks of memory to allocate to
  (func $combine (local $i i32) (local $j i32) (local $starti i32) (local $endi i32) (local $startj i32) (local $endj i32)
    loop $lp_i
      i32.const 0
      local.set $j
      loop $lp_j
        local.get $i
        local.get $j
        i32.eq
        if
          ;; goto contInner;
          local.get $j
          i32.const 2
          global.get $ptrSize
          i32.mul
          i32.add
          local.tee $j

          global.get $memSize
          i32.lt_s
          if
            br $lp_j
          else
            ;; i += 2*ptrSize
            local.get $i
            i32.const 2
            global.get $ptrSize
            i32.mul
            i32.add
            local.tee $i

            ;; i < memSize => continue
            global.get $memSize
            i32.lt_s
            if
              br $lp_j
            else
              i32.const 0
              global.set $lastI
              return
            end
          end
        end

        local.get $i
        i32.load
        local.tee $starti

        i32.eqz
        if
          ;; goto contOuter;
          local.get $i
          i32.const 2
          global.get $ptrSize
          i32.mul
          i32.add
          local.tee $i

          global.get $memSize
          i32.lt_s
          if
            br $lp_i
          else
            i32.const 0
            global.set $lastI
            return
          end
        end

        local.get $j
        i32.load
        local.tee $startj

        i32.eqz
        if
          ;; goto contInner;
          local.get $i
          i32.const 2
          global.get $ptrSize
          i32.mul
          i32.add
          local.tee $i

          global.get $memSize
          i32.lt_s
          if
            i32.const 0
            global.set $lastI
            br $lp_j
          else
            ;; i += 2*ptrSize
            local.get $i
            i32.const 2
            global.get $ptrSize
            i32.mul
            i32.add
            local.tee $i

            ;; i < memSize => continue
            global.get $memSize
            i32.lt_s
            if
              br $lp_i
            else
              return
            end
          end
        end

        local.get $i
        global.get $ptrSize
        i32.add
        i32.load
        local.set $endi

        local.get $j
        global.get $ptrSize
        i32.add
        i32.load
        local.tee  $endj

        ;; starti == endj
        local.get $startj
        i32.eq
        if
          ;; *endj = *endi
          local.get $j
          global.get $ptrSize
          i32.add
          local.get $endi
          i32.store

          ;; *starti = 0
          local.get $i
          i32.const 0
          i32.store

          ;; *endi = 0
          local.get $i
          global.get $ptrSize
          i32.add
          i32.const 0
          i32.store
        else
          ;; startj == endi
          local.get $startj
          local.get $endi
          i32.eq
          if
            ;; *endi = *endj
            local.get $i
            global.get $ptrSize
            i32.add
            local.get $endj
            i32.store

            ;; *startj = 0
            local.get $j
            i32.const 0
            i32.store

            ;; *endj = 0
            local.get $j
            global.get $ptrSize
            i32.add
            i32.const 0
            i32.store
          end
        end

        ;; j += 2*ptrSize
        local.get $j
        i32.const 2
        global.get $ptrSize
        i32.mul
        i32.add
        local.tee $j

        global.get $memSize
        i32.lt_s
        if
          br $lp_j
        end
      end

      ;; i += 2*ptrSize
      local.get $i
      i32.const 2
      global.get $ptrSize
      i32.mul
      i32.add
      local.tee $i

      ;; i < memSize => continue
      global.get $memSize
      i32.lt_s
      if
        br $lp_i
      end
    end

    i32.const 0
    global.set $lastI
  )

  ;; get the pair at the index, will multiply by the necessary ptrSize
  (func $getPair (param $idx i32) (result i32 i32)
    local.get $idx
    global.get $ptrSize
    global.get $ptrSize
    i32.add
    i32.mul
    i32.load

    local.get $idx
    global.get $ptrSize
    global.get $ptrSize
    i32.add
    i32.mul
    global.get $ptrSize
    i32.add
    i32.load
  )

  (func $findFreePair (param $minSize i32) (result i32 i32 i32)
   (local $i i32) (local $end i32) (local $start i32)
    loop $lp_0
      local.get $i
      call $getPair
      local.set $end
      local.set $start
      local.get $end
      i32.eqz ;; end == 0
      if
        ;; i += 1
        local.get $i
        i32.const 1
        i32.add
        local.tee $i

        ;; i < 8192 => continue
        i32.const 8192 ;; memSize / (2 * ptrSize)
        i32.lt_s
        if
          br $lp_0
        end
      else
        local.get $end
        local.get $start
        i32.sub

        local.get $minSize
        i32.ge_s
        if
          ;; enough bytes => return pair
          local.get $i
          local.get $start
          local.get $end
          return
        else
          ;; not enough bytes => continue

          ;; i += 1
          local.get $i
          i32.const 1
          i32.add
          local.tee $i

          ;; i < 8192 => continue
          i32.const 8192 ;; memSize / (2 * ptrSize)
          i32.lt_s
          if
            br $lp_0
          end
        end
      end
    end

    ;; no pair found
    i32.const 0
    i32.const 0
    i32.const 0
  )

  (func $setPair (param $idx i32) (param $start i32) (param $end i32)
    local.get $idx
    global.get $ptrSize
    global.get $ptrSize
    i32.add
    i32.mul
    local.get $start
    i32.store

    local.get $idx
    global.get $ptrSize
    global.get $ptrSize
    i32.add
    i32.mul
    global.get $ptrSize
    i32.add
    local.get $end
    i32.store
  )

  (export "store" (func $store))
  (export "combine" (func $combine))
  (export "getPair" (func $getPair))
  (export "setPair" (func $setPair))
  (export "findFreePair" (func $findFreePair))
  (export "memory" (memory $mem))
)
