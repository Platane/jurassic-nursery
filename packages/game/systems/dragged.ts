import { quat, vec2, vec3 } from "gl-matrix";
import { Triceratops } from "../entities/triceratops";
import { Fruit, fruits } from "../entities/fruits";
import { stepSpring3 } from "../utils/spring";
import { PLAYGROUND_SIZE, isInsidePlayground } from "./const";

export const updateTriceratopsDragged = (tri: Triceratops) => {
  if (tri.dragged_anchor && tri.dragged_v) {
    tri.go_to_target = undefined;

    stepSpring3(tri.o, tri.dragged_v, tri.dragged_anchor, springParams_tri);
  } else if (tri.dragged_v) {
    vec3.scale(tri.dragged_v, tri.dragged_v, 0.96);

    tri.dragged_v[1] -= 0.4;

    vec3.scaleAndAdd(tri.o, tri.o, tri.dragged_v, 1 / 60);

    const y0 = 0.6;

    if (tri.o[1] < y0) {
      tri.dragged_v[1] *= -1;
      vec3.scale(tri.dragged_v, tri.dragged_v, 0.5);
      tri.o[1] = y0;

      if (tri.activity.type === "carried") {
        if (isInsidePlayground(tri.o[0], tri.o[2])) {
          (tri.activity as any).type = "idle";
          tri.wandering_center[0] = tri.o[0];
          tri.wandering_center[1] = tri.o[2];
        } else {
          (tri.activity as any).type = "leaving-hesitation";
          (tri.activity as any).t = 0;
        }
      }
    }

    if (Math.abs(tri.o[1] - y0) < 0.2 && vec3.length(tri.dragged_v) < 0.4) {
      tri.dragged_v = undefined;
      tri.o[1] = y0;
    }
  }
};

export const updateDraggedFruit = (fruit: Fruit) => {
  if (fruit.dragged_anchor) {
    stepSpring3(
      fruit.p,
      fruit.dragged_v!,
      fruit.dragged_anchor,
      springParams_fruit
    );
  } else if (fruit.dragged_v) {
    vec3.scale(fruit.dragged_v, fruit.dragged_v, 0.975);

    fruit.dragged_v[1] -= 0.4;

    vec3.scaleAndAdd(fruit.p, fruit.p, fruit.dragged_v, 1 / 60);

    const y0 = fruit.size * 0.32;

    if (fruit.p[1] < y0) {
      fruit.dragged_v[1] *= -1;
      vec3.scale(fruit.dragged_v, fruit.dragged_v, 0.5);
      fruit.p[1] = y0;
    }

    if (Math.abs(fruit.p[1] - y0) < 0.2 && vec3.length(fruit.dragged_v) < 0.4) {
      fruit.dragged_v = undefined;
      fruit.p[1] = y0;
    }

    if (vec3.length(fruit.p) > PLAYGROUND_SIZE * 1.3) fruits.delete(fruit.id);
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
