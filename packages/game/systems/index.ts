import { vec3 } from "gl-matrix";
import { Triceratops, triceratops } from "../entities/triceratops";
import { createSkeleton } from "../renderer/geometries/model/skeleton";
import { fruits } from "../entities/fruits";
import { stepSpring, stepSpring3 } from "../utils/spring";

let t = 0;

const v = vec3.create();

export const update = () => {
  t++;

  //
  // target
  //
  for (const tri of triceratops) {
    v[0] = tri.target[0] - tri.origin[0];
    v[1] = 0;
    v[2] = tri.target[1] - tri.origin[2];

    const l = vec3.length(v);

    if (l > 0.01) {
      const h = Math.min(l, 0.04);

      tri.origin[0] += (v[0] / l) * h;
      tri.origin[2] += (v[2] / l) * h;
    }
  }

  for (const fruit of fruits) {
    if (fruit.dragged_anchor) {
      stepSpring3(fruit.p, fruit.dragged_v!, fruit.dragged_anchor, {
        tension: 190,
        friction: 12,
      });
    } else if (fruit.dragged_v) {
      vec3.scale(fruit.dragged_v, fruit.dragged_v, 0.975);

      fruit.dragged_v[1] -= 0.2;

      vec3.scaleAndAdd(fruit.p, fruit.p, fruit.dragged_v, 1 / 60);

      if (fruit.p[1] < fruit.s / 2) {
        fruit.dragged_v[1] *= -1;
        vec3.scale(fruit.dragged_v, fruit.dragged_v, 0.5);
        fruit.p[1] = fruit.s / 2;
      }

      if (
        Math.abs(fruit.p[1] - fruit.s / 2) < 0.2 &&
        vec3.length(fruit.dragged_v) < 0.4
      ) {
        fruit.dragged_v = undefined;
      }
    }
  }
};

//
// init
{
  const t: Triceratops = {
    id: 0,
    ...createSkeleton(),
    target: [0, 0] as [number, number],
    genotype: [{ w: 1, v: 0 }],
  };

  t.origin[0] = -10;
  t.origin[2] = -2;

  triceratops.push(t);
}
