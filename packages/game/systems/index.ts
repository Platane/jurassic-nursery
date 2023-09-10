import { quat, vec2, vec3 } from "gl-matrix";
import { Triceratops, triceratops } from "../entities/triceratops";
import { createSkeleton } from "../renderer/geometries/model/skeleton";
import { fruits } from "../entities/fruits";
import { stepSpring3 } from "../utils/spring";
import { state } from "../ui/state";
import { V_MAX, step } from "./walker";
import { updateWalkerPose } from "./walkerPose";
import { updateEmote } from "./emote";
import { updateDecision } from "./ia";

const v = vec3.create();

export const update = () => {
  state.t++;

  //
  // target
  //
  for (const tri of triceratops.values()) {
    if (tri.dragged_anchor && tri.dragged_v) {
      stepSpring3(
        tri.origin,
        tri.dragged_v,
        tri.dragged_anchor,
        springParams_tri
      );

      // v[0] = tri.dragged_v[0];
      // v[1] = tri.dragged_v[1] - 1;
      // v[2] = tri.dragged_v[2];
      // vec3.normalize(v, v);

      quat.fromEuler(tri.head_direction, 0, 0, -55);
      quat.fromEuler(tri.tail_direction, 0, 0, 30);
      tri.feet[0] = 0.3;
      tri.feet[1] = 0.3;
      tri.feet[2] = -0.3;
      tri.feet[3] = -0.3;
    } else if (tri.dragged_v) {
      quat.fromEuler(tri.head_direction, 0, 0, 0);
      quat.fromEuler(tri.tail_direction, 0, 0, 0);
      tri.feet[0] = 0;
      tri.feet[1] = 0;
      tri.feet[2] = 0;
      tri.feet[3] = 0;

      vec3.scale(tri.dragged_v, tri.dragged_v, 0.96);

      tri.dragged_v[1] -= 0.4;

      vec3.scaleAndAdd(tri.origin, tri.origin, tri.dragged_v, 1 / 60);

      const y0 = 0.6;

      if (tri.origin[1] < y0) {
        tri.dragged_v[1] *= -1;
        vec3.scale(tri.dragged_v, tri.dragged_v, 0.5);
        tri.origin[1] = y0;
      }

      if (
        Math.abs(tri.origin[1] - y0) < 0.2 &&
        vec3.length(tri.dragged_v) < 0.4
      ) {
        tri.dragged_v = undefined;
        tri.origin[1] = y0;
        tri.target[0] = tri.origin[0];
        tri.target[1] = tri.origin[2];
      }
    } else {
      continue;

      // updateWalkerPose(tri);

      // v[0] = tri.target[0] - tri.origin[0];
      // v[1] = 0;
      // v[2] = tri.target[1] - tri.origin[2];

      // const l = vec3.length(v);

      // if (l > 0.01) {
      //   const h = Math.min(l, 0.04);

      //   tri.origin[0] += (v[0] / l) * h;
      //   tri.origin[2] += (v[2] / l) * h;
      // }
    }
  }

  step();

  triceratops.forEach(updateEmote);
  triceratops.forEach(updateWalkerPose);
  triceratops.forEach(updateDecision);

  for (const fruit of fruits.values()) {
    if (fruit.dragged_anchor) {
      stepSpring3(
        fruit.position,
        fruit.dragged_v!,
        fruit.dragged_anchor,
        springParams_fruit
      );
    } else if (fruit.dragged_v) {
      vec3.scale(fruit.dragged_v, fruit.dragged_v, 0.975);

      fruit.dragged_v[1] -= 0.4;

      vec3.scaleAndAdd(fruit.position, fruit.position, fruit.dragged_v, 1 / 60);

      const y0 = fruit.size * 0.32;

      if (fruit.position[1] < y0) {
        fruit.dragged_v[1] *= -1;
        vec3.scale(fruit.dragged_v, fruit.dragged_v, 0.5);
        fruit.position[1] = y0;
      }

      if (
        Math.abs(fruit.position[1] - y0) < 0.2 &&
        vec3.length(fruit.dragged_v) < 0.4
      ) {
        fruit.dragged_v = undefined;
        fruit.position[1] = y0;
      }
    }
  }
};

const springParams_tri = {
  tension: 120,
  friction: 16,
};
const springParams_fruit = {
  tension: 190,
  friction: 12,
};

//
// init
for (let k = 1; k--; ) {
  const t: Triceratops = {
    id: triceratops.size + 1,
    ...createSkeleton(),
    target: [0, 10] as [number, number],
    genotype: [{ w: 1, v: 0 }],

    velocity: vec2.create(),
    delta_angle_mean: 0,
    tail_t: Math.random() * 3,
    feet_t: Math.random() * 3,
    v_max: V_MAX,
    seed: Math.random(),
    edible: 1 + 2 + 4 + 8 + 16,
  };

  // t.origin[0] = Math.random() * 6;
  // t.origin[2] = -2;

  // quat.fromEuler(t.direction, 0, Math.random() * 360, 0);
  // t.target[0] = (Math.random() - 0.5) * 12;
  // t.target[1] = (Math.random() - 0.5) * 12;

  triceratops.set(triceratops.size + 1, t);
}
