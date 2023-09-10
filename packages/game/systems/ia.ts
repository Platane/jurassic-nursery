import { vec2, vec3 } from "gl-matrix";
import { Skeleton } from "../renderer/geometries/model/skeleton";
import { state } from "../ui/state";
import { fruits } from "../entities/fruits";

export type WithNeed = {
  food_level: number;
  love_level: number;
  happiness_level: number;

  edible: number;
};

export type WithDecision = {
  seed: number;
  v_max: number;
  target: vec2;

  food_target_id?: number | null;

  wandering_center: vec2;
} & WithNeed;

export const WANDERING_RADIUS = 6;

const a = vec2.create();

export const updateDecision = (w: Skeleton & WithDecision) => {
  //
  // once ever X frame, look for something to eat
  //
  const N = 140;
  const s = Math.floor(w.seed * N);
  if (state.t % N === s) {
    console.log("--- ", w.id, "thinking..");
    if (!w.food_target_id) w.food_target_id = findANiceFruit(w);
  }

  //
  // go to where we want to eat something
  //

  if (w.food_target_id) {
    const fruit_target = fruits.get(w.food_target_id);

    if (!fruit_target) {
      w.food_target_id = null;
    } else {
      // stop just before the fruit
      // so the head line up

      a[0] = fruit_target.position[0] - w.origin[0];
      a[1] = fruit_target.position[2] - w.origin[2];

      const l = vec2.length(a);

      w.target[0] = fruit_target.position[0] + (a[0] / l) * -0.9;
      w.target[1] = fruit_target.position[2] + (a[1] / l) * -0.9;
    }
  }
};

const findANiceFruit = (w: Skeleton & WithDecision): number | undefined => {
  const grabbable: number[] = [];

  for (const fruit of fruits.values()) {
    const { position, i: j } = fruit;

    if (w.edible | j) {
      // const v = [position[0] - w.origin[0], position[2] - w.origin[2]] as vec2;
      // const l = vec2.length(v);

      const l = vec3.distance(position, w.origin);

      if (l < WANDERING_RADIUS * 0.6) grabbable.push(fruit.id);
    }
  }

  const toGrab = grabbable[Math.floor(Math.random() * grabbable.length * 1.5)];

  return toGrab;
};
