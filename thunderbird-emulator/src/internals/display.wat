(module
  ;; contains functions for drawing that can be exported to a game api.
  ;; These functions queue instructions onto the queue instead of executing
  ;; them directly

  (import "queue" "enqueue" (func $enqueue (param i32) (result i32)))
  (import "queue" "availableSize" (func $availableSize (result i32)))

  ;; draw(x, y, c)
  (func (export "__draw") (param i32 i32 i32) (result i32)
    call $availableSize
    i32.const 4
    i32.lt_u
    (if
      (then
        i32.const 1
        return
      )
    )

    i32.const 1
    call $enqueue
    drop

    local.get 0
    call $enqueue
    drop

    local.get 1
    call $enqueue
    drop

    local.get 2
    call $enqueue
    drop

    i32.const 0
  )

  ;; drawRect(x, y, w, h, c)
  (func (export "__drawRect") (param i32 i32 i32 i32 i32) (result i32)
    call $availableSize
    i32.const 6
    i32.lt_u
    (if
      (then
        i32.const 1
        return
      )
    )

    i32.const 2
    call $enqueue
    drop

    local.get 0
    call $enqueue
    drop

    local.get 1
    call $enqueue
    drop

    local.get 2
    call $enqueue
    drop

    local.get 3
    call $enqueue
    drop

    local.get 4
    call $enqueue
    drop

    i32.const 0
  )

  ;; fill(c)
  (func (export "__fill") (param i32) (result i32)
    ;; check if the available size can hold at least 2 elements
    call $availableSize
    i32.const 2
    i32.lt_u
    (if
      (then
        i32.const 1
        return
      )
    )

    i32.const 3
    call $enqueue
    drop

    local.get 0
    call $enqueue
    drop

    i32.const 0
  )
)
