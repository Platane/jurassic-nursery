import { vec2 } from "gl-matrix";
import { Triceratops, triceratops } from "../entities/triceratops";
import { setEntityColorSchema } from "../renderer/geometries/model/colorSchema";
import { createSkeleton } from "../renderer/geometries/model/skeleton";
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

let _id = 1;
export const addTriceratops = (variant_index: number) => {
  const tri: Triceratops = {
    id: _id++,
    ...createSkeleton(),

    ...variants[variant_index],

    food_level: 0,
    love_level: 0,
    happiness_level: 0,
    will_not_eat_again: new Set(),
    wandering_center: [0, 0],
    velocity: vec2.create(),
    delta_angle_mean: 0,
    tail_t: Math.random() * 3,
    feet_t: Math.random() * 3,
    v_max: V_MAX,
    seed: Math.floor(Math.random() * 100),

    activity: { type: "idle" },
  };

  triceratops.set(tri.id, tri);
  return tri;
};

/**
 * call that after add / delete triceratops
 */
export const updateTriceratops = () => {
  let i = 0;
  for (const tri of triceratops.values()) {
    setEntityColorSchema(i, tri.colors);
    i++;
  }

  localStorage.setItem(
    "jurassic-nursery",
    [...triceratops.values()].map((t) => t.variant_index).join(","),
  );
};

//
// init
//

export const initTriceratops = () => {
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

  updateTriceratops();
};
