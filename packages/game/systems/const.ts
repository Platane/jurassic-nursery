export const PLAYGROUND_SIZE = 12;

export const WANDERING_RADIUS = 3.6;

export const MAX_FOOD_LEVEL = 3;

//
// helpers
//

export const isInsidePlayground = (x: number, y: number) =>
  -PLAYGROUND_SIZE / 2 <= x &&
  x <= PLAYGROUND_SIZE / 2 &&
  -PLAYGROUND_SIZE / 2 <= y &&
  y <= PLAYGROUND_SIZE / 2;
