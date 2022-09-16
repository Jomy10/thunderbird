#include "../../../c-api/thunderbird.h"

typedef struct {
  uint8_t x;
  uint8_t y;
  uint8_t color;
} player_t;

typedef struct {
  player_t player;
  uint8_t bgColor;
} state_t;

static state_t* STATE;

void __init() {
  STATE = (state_t*) malloc(sizeof(state_t));
  STATE->bgColor = 0b11111111;
  STATE->player.x = 128;
  STATE->player.y = 128;
  STATE->player.color = 0b00000111;
}

void update(state_t* state) {
  // player movement
  if (is_pressed(UP)) {
    state->player.y -= 1;
  }
  if (is_pressed(DOWN)) {
    state->player.y += 1;
  }
  if (is_pressed(LEFT)) {
    state->player.x -= 1;
  }
  if (is_pressed(RIGHT)) {
    state->player.x += 1;
  }
  
  // color change
  if (is_pressed(A)) {
    printN(state->bgColor);
    state->bgColor += 1;
  }
  if (is_pressed(LBUTTON)) {
    state->player.color += 1;
  }
}

void drawing(state_t* state) {
  if (fill(state->bgColor) == 1) { exit(1); };
  if (draw(state->player.x, state->player.y, state->player.color) == 1) { exit(1); }
}

void __main() {
  update(STATE);
  drawing(STATE);
}

void __deinit() {}
