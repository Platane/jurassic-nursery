import { quat, vec2, vec3 } from "gl-matrix";
import { Triceratops } from "../entities/triceratops";
import { Fruit } from "../entities/fruits";
import { stepSpring3 } from "../utils/spring";
import { isInsidePlayground } from "./ia";

export const updateTriceratopsDragged = (tri: Triceratops) => {
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

      if (tri.activity.type === "carried") {
        if (isInsidePlayground(tri.origin[0], tri.origin[2])) {
          (tri.activity as any).type = "idle";
        } else {
          (tri.activity as any).type = "leaving-hesitation";
          (tri.activity as any).t = 0;
        }
      }
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
  }
};

export const updateDraggedFruit = (fruit: Fruit) => {
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
};

const springParams_tri = {
  tension: 120,
  friction: 16,
};
const springParams_fruit = {
  tension: 190,
  friction: 12,
};
