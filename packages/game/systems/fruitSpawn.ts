import { addFruit, fruits } from "../entities/fruits";
import { MAX_PARTICLES } from "../renderer/materials/sprites";
import { state } from "../ui/state";
import { PLAYGROUND_SIZE } from "./const";

export const updateFruitSpawn = () => {
  const N = 200;

  if (state.t % N === 122 && fruits.size < MAX_PARTICLES * 0.8) {
    const f = addFruit();
    f.i = 0 | (Math.random() * 5);

    f.p[0] = (Math.random() - 0.5) * PLAYGROUND_SIZE * 1.2;
    f.p[1] = 5;
    f.p[2] = PLAYGROUND_SIZE / 2 + -0.4 + Math.random() * 0.6;

    f.dragged_v = [(Math.random() - 0.5) * 3, 0, 2 + Math.random() * 3];
  }
};
