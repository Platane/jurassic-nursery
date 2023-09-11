import { PLAYGROUND_SIZE } from ".";
import {
  addTriceratops,
  triceratops,
  updateTriceratops,
} from "../entities/triceratops";
import { state } from "../ui/state";

const first_variants = [0, 1, 0];

export const updateSpawn = () => {
  const N = 100;

  if (triceratops.size < 2 && state.t % N === 0) {
    const tri = addTriceratops(
      first_variants.shift() ?? 0 | (Math.random() * 3)
    );

    const a = Math.random() * 6;
    tri.origin[0] = Math.cos(a) * PLAYGROUND_SIZE * 1.5;
    tri.origin[2] = Math.sin(a) * PLAYGROUND_SIZE * 1.5;

    tri.wandering_center[0] = (Math.random() - 0.5) * PLAYGROUND_SIZE * 0.9;
    tri.wandering_center[1] = (Math.random() - 0.5) * PLAYGROUND_SIZE * 0.9;

    updateTriceratops();
  }
};
