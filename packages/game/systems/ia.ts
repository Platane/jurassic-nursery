import { vec2, vec3 } from "gl-matrix";
import { Skeleton } from "../renderer/geometries/model/skeleton";
import { state } from "../ui/state";
import { addFruit, fruits, triceratopsParticles } from "../entities/fruits";
import { WithEmote } from "./emote";
import { triceratops, updateTriceratops } from "../entities/triceratops";
import { PLAYGROUND_SIZE, WANDERING_RADIUS } from "./const";

export type WithNeed = {
  food_level: number;
  love_level: number;
  happiness_level: number;

  edible: Set<number>;

  will_not_eat_again: Set<number>;
};

export type WithDecision = {
  seed: number;
  v_max: number;
  target: vec2;

  activity:
    | {
        type: "go-to-food";
        food_target_id: number;
      }
    | {
        type: "eating";
        food_target_id: number;
        food_target_i: number;
        t: number;
      }
    | {
        type: "idle";
      }
    | {
        type: "say-no";
        t: number;
      }
    | {
        type: "carried";
      }
    | {
        type: "leaving-hesitation";
        t: number;
      }
    | {
        type: "leaving";
      };

  wandering_center: vec2;
} & WithNeed;

export const isInsidePlayground = (x: number, y: number) =>
  -PLAYGROUND_SIZE / 2 <= x &&
  x <= PLAYGROUND_SIZE / 2 &&
  -PLAYGROUND_SIZE / 2 <= y &&
  y <= PLAYGROUND_SIZE / 2;

export const EATING_DURATION = 80;

const a = vec2.create();

export const updateDecision = (
  w: Skeleton & WithDecision & WithEmote & { id: number }
) => {
  //
  // once ever X frame, look for something to eat
  //
  const N = 140;
  const s = Math.floor(w.seed * N);
  if (state.t % N === s && w.activity.type === "idle") {
    console.log("--- ", w.id, "thinking..");
    const food_target_id = findANiceFruit(w);
    if (food_target_id) w.activity = { type: "go-to-food", food_target_id };
  }

  //
  // go to where we want to eat something
  //
  if (w.activity.type === "go-to-food") {
    const fruit_target = fruits.get(w.activity.food_target_id);

    if (!fruit_target || fruit_target.eaten_by) {
      (w.activity as any).type = "idle";
    } else {
      // stop just before the fruit
      // so the head line up

      a[0] = fruit_target.position[0] - w.origin[0];
      a[1] = fruit_target.position[2] - w.origin[2];

      const l = vec2.length(a);

      w.target[0] = fruit_target.position[0] + (a[0] / l) * -0.9;
      w.target[1] = fruit_target.position[2] + (a[1] / l) * -0.9;

      if (l > 10) (w.activity as any).type = "idle";

      if (l < 1.1 && !fruit_target.dragged_v) {
        fruit_target.eaten_by = w.id;
        (w.activity as any).type = "eating";
        (w.activity as any).t = 0;
        (w.activity as any).food_target_i = fruit_target.i;
      }
    }
  } else if (w.activity.type === "eating") {
    w.activity.t++;

    if (w.activity.t == (0 | (EATING_DURATION * 0.8))) {
      fruits.delete(w.activity.food_target_id);
    }

    if (w.activity.t > EATING_DURATION) {
      if (w.edible.has(w.activity.food_target_i)) {
        w.food_level++;
        (w.activity as any).type = "idle";
        w.mood = { type: "happy", t: 0 };
      } else {
        const f = addFruit();
        f.position[0] = 1;
        f.i = w.activity.food_target_i;

        vec3.transformQuat(f.position, f.position, w.direction);

        f.dragged_v = [f.position[0] * 3, 3, f.position[2] * 3];

        f.position[0] += w.origin[0];
        f.position[2] += w.origin[2];

        (w.activity as any).type = "say-no";
        (w.activity as any).t = 0;

        w.will_not_eat_again.add(f.id);
      }
    }
  } else if (w.activity.type === "say-no") {
    w.activity.t++;

    if (w.activity.t > 80) {
      (w.activity as any).type = "idle";
    }
  } else if (w.activity.type === "leaving-hesitation") {
    w.activity.t++;

    if (w.activity.t > 80) {
      (w.activity as any).type = "leaving";

      const ox = w.origin[0] * 1.4;
      const oy = w.origin[2];

      const l = Math.hypot(ox, oy);

      w.target[0] = (ox / l) * PLAYGROUND_SIZE * 2.2;
      w.target[1] = (oy / l) * PLAYGROUND_SIZE * 2.2;
    }
  } else if (w.activity.type === "leaving") {
    const l = Math.hypot(w.target[0] - w.origin[0], w.target[1] - w.origin[2]);

    if (l < 1) {
      triceratops.delete(w.id);
      updateTriceratops();
    }
  } else if (w.activity.type === "idle") {
  }
};

const findANiceFruit = (w: Skeleton & WithDecision): number | undefined => {
  const grabbable: number[] = [];

  for (const fruit of fruits.values()) {
    if (
      (!w.will_not_eat_again.has(fruit.id) || fruit.dragged_anchor) &&
      isInsidePlayground(fruit.position[0], fruit.position[2])
    ) {
      // const v = [position[0] - w.origin[0], position[2] - w.origin[2]] as vec2;
      // const l = vec2.length(v);

      const l = vec3.distance(fruit.position, w.origin);

      if (l < WANDERING_RADIUS * 0.6) grabbable.push(fruit.id);
    }
  }

  const toGrab = grabbable[Math.floor(Math.random() * grabbable.length)];

  return toGrab;
};
