(module
  ;; console imports
  (import "queue" "enqueue" (func $enqueue (param i32) (result i32)))
  (import "queue" "dequeue" (func $dequeue (result i32 i32)))

  (import "env" "memory" (memory 4 4))
  (import "console" "logN" (func $logN (param i32)))

  ;; game constants
  (global $KeyUp i32 (i32.const 128)) ;; 0b10000000
  (global $KeyDown i32 (i32.const 64))
  (global $KeyLeft i32 (i32.const 32))
  (global $KeyRight i32 (i32.const 16))
  (global $KeyA i32 (i32.const 8))
  (global $KeyB i32 (i32.const 4))
  (global $KeyL i32 (i32.const 2))
  (global $KeyR i32 (i32.const 1))

  (global $CMemStart i32 (i32.const 65536))
  (global $CRed i32 (i32.const 224))
  (global $CGreen i32 (i32.const 28))
  (global $CBlue i32 (i32.const 3))
  (global $CBlack i32 (i32.const 0))
  (global $CWhite i32 (i32.const 255))
  (global $ColorCount i32 (i32.const 5))

  (global $MapMemStart i32 (i32.const 65541))
  (global $MapMemEnd i32 (i32.const 131078))

  ;; game variables
  (global $cursorX (mut i32) (i32.const 128))
  (global $cursorY (mut i32) (i32.const 128))
  (global $prevCursorX (mut i32) (i32.const 128))
  (global $prevCursorY (mut i32) (i32.const 128))
  (global $currentColorIdx (mut i32) (i32.const 0))

  ;; gets the first byte of memory, being the byte where key presses are stored
  (func $getFirstByte (result i32)
    i32.const 0
    i32.load8_u
  )
  (func $isMovingUp (result i32)
    call $getFirstByte
    global.get $KeyUp
    i32.and
    global.get $KeyUp
    i32.eq
  )
  (func $isMovingDown (result i32)
    call $getFirstByte
    global.get $KeyDown
    i32.and
    global.get $KeyDown
    i32.eq
  )
  (func $isMovingLeft (result i32)
    call $getFirstByte
    global.get $KeyLeft
    i32.and
    global.get $KeyLeft
    i32.eq
  )
  (func $isMovingRight (result i32)
    call $getFirstByte
    global.get $KeyRight
    i32.and
    global.get $KeyRight
    i32.eq
  )
  (func $handleMovement
    call $isMovingUp
    (if
      (then
        global.get $cursorY
        i32.const 1
        i32.sub
        global.set $cursorY))

    call $isMovingDown
    (if
      (then
        global.get $cursorY
        i32.const 1
        i32.add
        global.set $cursorY))

    call $isMovingLeft
    (if
      (then
        global.get $cursorX
        i32.const 1
        i32.sub
        global.set $cursorX))

    call $isMovingRight
    (if
      (then
        global.get $cursorX
        i32.const 1
        i32.add
        global.set $cursorX))
  )

  (global $colorCanChange (mut i32) (i32.const 1))
  (func $handleColorChange
    ;; if key b pressed and !colorHasJustChanged
    call $getFirstByte
    global.get $KeyB
    i32.and
    global.get $KeyB
    i32.eq
    (if
      (then
        i32.const 1
        global.get $colorCanChange
        i32.eq
        (if
          (then
            i32.const 0
            global.set $colorCanChange

            global.get $currentColorIdx
            i32.const 1
            i32.add
            global.set $currentColorIdx

            global.get $currentColorIdx
            global.get $ColorCount
            i32.eq
            (if
              (then
                i32.const 0
                global.set $currentColorIdx))

            global.get $currentColorIdx
            call $logN
          )
        )
      )
      (else
        i32.const 1
        global.set $colorCanChange
      )
    )
  )

  (global $isAJustPressed (mut i32) (i32.const 0))
  ;; draw to the canvas when A is pressed
  (func $handleDraw
    call $getFirstByte
    global.get $KeyA
    i32.and
    global.get $KeyA
    i32.eq
    (if
      (then
        ;; get register to store color at
        global.get $cursorX
        global.get $cursorY
        call $getRegisterFromPos
        ;; get current color
        global.get $currentColorIdx
        global.get $CMemStart
        i32.add
        i32.load8_u
        ;; store color
        i32.store8

        global.get $isAJustPressed
        i32.eqz
        (if
          (then
            i32.const 6
            call $enqueue
            drop
            i32.const 68 ;; note C4 (0b1000100)
            call $enqueue
            drop
            i32.const 20 ;; 0.1 seconds
            call $enqueue
            drop

            i32.const 1
            global.set $isAJustPressed
          )
        )
      )
      (else
        i32.const 0
        global.set $isAJustPressed
      )
    )
  )

  ;; Returns a pointer to memory that contains the address of the given coordinates
  (func $getRegisterFromPos (param $x i32) (param $y i32) (result i32)
    i32.const 256
    local.get $y
    i32.mul
    local.get $x
    i32.add
    global.get $MapMemStart
    i32.add
  )

  ;; Exported functions
  (func (export "__init") (local $i i32)
    ;; store colors in memory
    global.get $CMemStart
    global.get $CBlack
    i32.store

    global.get $CMemStart
    i32.const 1
    i32.add
    global.get $CGreen
    i32.store

    global.get $CMemStart
    i32.const 2
    i32.add
    global.get $CRed
    i32.store

    global.get $CMemStart
    i32.const 3
    i32.add
    global.get $CBlue
    i32.store

    global.get $CMemStart
    i32.const 4
    i32.add
    global.get $CWhite
    i32.store

    ;; set all memory addresses to have a value of white

    global.get $MapMemStart
    local.set $i
    (loop $l_0
      ;; store white in memory
      local.get $i
      global.get $CWhite
      i32.store8

      ;; if i != MapMemEnd, keep looping
      local.get $i
      global.get $MapMemEnd
      i32.eq
      (if
        (then)
        (else
          ;; i++
          i32.const 1
          local.get $i
          i32.add
          local.set $i

          br $l_0
        )
      )
    )
  )

  (func (export "__main")
    ;; read arrow keys
    call $handleMovement
    call $handleColorChange
    call $handleDraw

    ;; Clear the previous cursor position's color
    i32.const 1
    call $enqueue
    drop
    global.get $prevCursorX
    call $enqueue
    drop
    global.get $prevCursorY
    call $enqueue
    drop
    global.get $prevCursorX
    global.get $prevCursorY
    call $getRegisterFromPos
    i32.load8_u
    call $enqueue
    drop

    ;; set previous cursor pos to current
    global.get $cursorX
    global.set $prevCursorX
    global.get $cursorY
    global.set $prevCursorY

    ;; Draw the cursor
    i32.const 1
    call $enqueue
    drop ;; ignoring if the enqueue function succeeded
    global.get $cursorX
    call $enqueue
    drop
    global.get $cursorY
    call $enqueue
    drop
    global.get $currentColorIdx
    global.get $CMemStart
    i32.add
    i32.load8_u
    call $enqueue
    drop
  )

  (func (export "__deinit")
  )
)
