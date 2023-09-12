import {
  addTriceratops,
  triceratops,
  updateTriceratops,
} from "../entities/triceratops";
import { state } from "../ui/state";
import { MAX_FOOD_LEVEL, PLAYGROUND_SIZE } from "./const";

const first_variants = [1, 2];

let tuto_done = false;

export const updateTriceratopsSpawn = () => {
  const N = 200;

  if (!tuto_done) {
    triceratops.forEach((tri) => {
      if (tri.food_level >= MAX_FOOD_LEVEL) tuto_done = true;
    });
  }

  if (tuto_done && triceratops.size < 2 && state.t % N === 0) {
    const tri = addTriceratops(
      first_variants.shift() ?? 0 | (Math.random() * 3)
    );

    const a = Math.random() * 6;
    tri.o[0] = Math.cos(a) * PLAYGROUND_SIZE * 1.5;
    tri.o[2] = Math.sin(a) * PLAYGROUND_SIZE * 1.5;

    tri.wandering_center[0] = (Math.random() - 0.5) * PLAYGROUND_SIZE * 0.9;
    tri.wandering_center[1] = (Math.random() - 0.5) * PLAYGROUND_SIZE * 0.9;

    updateTriceratops();
  }
};

const tri = addTriceratops(0);
tri.o[0] = -PLAYGROUND_SIZE * 0.6;
tri.o[2] = 3;
updateTriceratops();