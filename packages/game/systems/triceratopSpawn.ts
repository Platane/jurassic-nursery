import {
  addTriceratops,
  triceratops,
  updateTriceratops,
} from "../entities/triceratops";
import { showRecipeButton } from "../ui/recipe";
import { state } from "../ui/state";
import { MAX_FOOD_LEVEL, PLAYGROUND_SIZE } from "./const";
import { variants } from "./gene";
import { V_MAX } from "./walker";

const first_variants = [1, 2];

let tuto_done = false;

export const updateTriceratopsSpawn = () => {
  const N = 300;

  if (!tuto_done) {
    triceratops.forEach((tri) => {
      if (tri.food_level >= MAX_FOOD_LEVEL) tuto_done = true;
    });

    if (tuto_done) showRecipeButton();
  }

  if (tuto_done && triceratops.size < 3 && state.t % N === 0) {
    const tri = addTriceratops(
      first_variants.shift() ?? 0 | (Math.random() * 3),
    );

    const a = Math.random() * 6;
    tri.o[0] = Math.cos(a) * PLAYGROUND_SIZE * 1.5;
    tri.o[2] = Math.sin(a) * PLAYGROUND_SIZE * 1.5;

    tri.wandering_center[0] = (Math.random() - 0.5) * PLAYGROUND_SIZE * 0.9;
    tri.wandering_center[1] = (Math.random() - 0.5) * PLAYGROUND_SIZE * 0.9;

    updateTriceratops();
  }
};

//
// init
//

const save = localStorage.getItem("jurassic-nursery");

if (save) {
  const variant_indexes = save.split(",").map((x) => {
    const i = +x;
    if (Number.isFinite(i) && variants[i]) return i;
    else return 0;
  });
  for (const i of variant_indexes) {
    const tri = addTriceratops(i);
    tri.wandering_center[0] = tri.o[0] =
      (Math.random() - 0.5) * PLAYGROUND_SIZE;
    tri.wandering_center[2] = tri.o[2] =
      (Math.random() - 0.5) * PLAYGROUND_SIZE;
  }
  first_variants.length = 0;
  tuto_done = true;
  showRecipeButton();
} else {
  const tri = addTriceratops(0);
  tri.o[0] = -PLAYGROUND_SIZE * 0.6;
  tri.o[2] = 3;
  tri.go_to_target = [0, 0];
  tri.v_max = V_MAX;

  tuto_done = false;
}

//
//
//

// for (let k = 3; k--; ) {
//   const tri = addTriceratops(k % variants.length);
//   tri.o[2] = k * 0.5;
//   tri.o[0] = -6;
//   tri.size = 0.3;
// }

updateTriceratops();
