;; The start screen of the emulator
;; this is a default "game" that gets loaded into the emulator at startp

(module
  (import "queue" "enqueue" (func $enqueue (param i32) (result i32)))
  (import "queue" "dequeue" (func $dequeue (result i32 i32)))

  (func (export "__init")
    ;; TODO:
    ;; Draw logo to the screen
    ;; i32.const 1
    ;; call $enqueue
    ;; drop
    ;; i32.const 128
    ;; call $enqueue
    ;; drop
    ;; i32.const 128
    ;; call $enqueue
    ;; drop
    ;; i32.const 100
    ;; call $enqueue
    ;; drop
  )
  (func (export "__main")
    ;; stop the game
    i32.const 0
    call $enqueue
    drop
  )
  (func (export "__deinit"))
)
