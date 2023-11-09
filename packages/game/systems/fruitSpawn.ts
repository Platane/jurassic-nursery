import { FRUIT_S, FRUIT_Y, Fruit, MAX_FRUIT, fruits } from "../entities/fruits";
import { state } from "../ui/state";
import { lerp } from "../utils/math";
import { PLAYGROUND_SIZE, isInsidePlayground } from "./const";

let next_spawn_t = 300;

export const updateFruitSpawn = () => {
  if (state.t > next_spawn_t && fruits.size < MAX_FRUIT) {
    const f = addFruit();

    const fruit_count = Array.from({ length: 5 }, () => Math.random() * 2);

    for (const fruit of fruits.values()) {
      if (!isInsidePlayground(fruit.p[0], fruit.p[2]))
        fruit_count[fruit.i] += 1;
    }

    let min_i = 0;
    for (let i = 5; i--; ) if (fruit_count[i] < fruit_count[min_i]) min_i = i;

    next_spawn_t = state.t + lerp(fruits.size / MAX_FRUIT, 60, 700);

    f.i = min_i;

    f.p[0] = (Math.random() - 0.5) * PLAYGROUND_SIZE * 1.2;
    f.p[1] = 5;
    f.p[2] = PLAYGROUND_SIZE / 2 + -0.4 + Math.random() * 0.6;

    f.dragged_v = [(Math.random() - 0.5) * 3, 0, 2 + Math.random() * 3];

    if (Math.random() < 0.5) {
      f.dragged_v[2] *= -1;
      f.p[2] *= -1;
    }
    if (Math.random() < 0.5) {
      const tmp = f.dragged_v[2];
      f.dragged_v[2] = f.dragged_v[0];
      f.dragged_v[0] = tmp;

      const tmp2 = f.p[2];
      f.p[2] = f.p[0];
      f.p[0] = tmp2;
    }
  }
};

let _id = 1;
export const addFruit = () => {
  const fruit = {
    size: FRUIT_S,
    i: 0,
    p: [0, FRUIT_Y, 0],
    id: _id++,
  } as Fruit;
  fruits.set(fruit.id, fruit);
  return fruit;
};
