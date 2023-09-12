import { vec2, vec3 } from "gl-matrix";
import { Skeleton } from "../renderer/geometries/model/skeleton";
import { state } from "../ui/state";
import { addFruit, fruits, triceratopsParticles } from "../entities/fruits";
import { WithEmote } from "./emote";
import {
  Triceratops,
  addTriceratops,
  triceratops,
  updateTriceratops,
} from "../entities/triceratops";
import { MAX_FOOD_LEVEL, PLAYGROUND_SIZE, WANDERING_RADIUS } from "./const";
import { V_MAX } from "./walker";
import { lerp } from "../utils/math";
import { getChildVariant } from "./gene";

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

  go_to_target?: vec2;

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
        type: "in-love";
        lover_id: number;
        follower: boolean;
        t: number;
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

export const updateDecision = (w: Triceratops) => {
  //
  // once ever X frame, look for something to eat
  //

  if ((state.t + w.seed) % 140 === 0 && w.activity.type === "idle") {
    console.log("--- ", w.id, "thinking..");
    const food_target_id = findANiceFruit(w);
    if (food_target_id) w.activity = { type: "go-to-food", food_target_id };

    if (w.food_level >= MAX_FOOD_LEVEL) {
      let wL;

      for (const w2 of triceratops.values()) {
        if (
          w2.food_level >= MAX_FOOD_LEVEL &&
          w2.id !== w.id &&
          Math.hypot(w2.o[0] - w.o[0], w2.o[1] - w.o[1]) <
            WANDERING_RADIUS * 0.4
        ) {
          wL = w2;
        }
      }

      if (wL) {
        wL.activity.type = "in-love";
        (wL.activity as any).lover_id = w.id;
        (wL.activity as any).follower = false;
        (wL.activity as any).t = 0;
        wL.food_level = 0;

        (w.activity as any).type = "in-love";
        (w.activity as any).lover_id = wL.id;
        (w.activity as any).follower = true;
        (w.activity as any).t = 0;
        w.food_level = 0;
      }
    }
  }

  //
  // for each activity
  //
  if (w.activity.type === "go-to-food") {
    const fruit_target = fruits.get(w.activity.food_target_id);

    if (!fruit_target || fruit_target.eaten_by) {
      (w.activity as any).type = "idle";
    } else {
      // stop just before the fruit
      // so the head line up

      a[0] = fruit_target.p[0] - w.o[0];
      a[1] = fruit_target.p[2] - w.o[2];

      const l = vec2.length(a);

      w.go_to_target = w.go_to_target ?? [0, 0];

      w.go_to_target[0] = fruit_target.p[0] + (a[0] / l) * -0.9;
      w.go_to_target[1] = fruit_target.p[2] + (a[1] / l) * -0.9;

      w.v_max = V_MAX;

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
        f.p[0] = 1;
        f.i = w.activity.food_target_i;

        vec3.transformQuat(f.p, f.p, w.direction);

        f.dragged_v = [f.p[0] * 3, 3, f.p[2] * 3];

        f.p[0] += w.o[0];
        f.p[2] += w.o[2];

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

      const ox = w.o[0] * 1.4;
      const oy = w.o[2];

      const l = Math.hypot(ox, oy);

      w.go_to_target = w.go_to_target ?? [0, 0];

      w.go_to_target[0] = (ox / l) * PLAYGROUND_SIZE * 2.2;
      w.go_to_target[1] = (oy / l) * PLAYGROUND_SIZE * 2.2;
    }
  } else if (w.activity.type === "leaving") {
    if (!w.go_to_target) {
      triceratops.delete(w.id);
      updateTriceratops();
    }
  } else if (w.activity.type === "idle") {
    if (!w.go_to_target && (state.t + w.seed) % 78 === 0) {
      w.v_max = V_MAX * lerp(Math.random(), 0.2, 0.5);
      w.go_to_target = getWanderingPoint(w, WANDERING_RADIUS);
    }
  } else if (w.activity.type === "in-love") {
    const w2 = triceratops.get(w.activity.lover_id);

    if (!w2 || w2.activity.type === "leaving") {
      (w.activity as any).type = "leaving";
      w.go_to_target = w.go_to_target ?? [0, 0];

      w.go_to_target[0] = w2?.go_to_target?.[0] ?? PLAYGROUND_SIZE * 2;
      w.go_to_target[1] = w2?.go_to_target?.[1] ?? PLAYGROUND_SIZE;
    } else if (w2.activity.type !== "in-love") {
      (w.activity as any).type = "idle";
    } else {
      if (w.activity.follower) {
        w.go_to_target = w.go_to_target ?? [0, 0];
        w.go_to_target[0] = w2.o[0];
        w.go_to_target[1] = w2.o[2];
      } else {
        if (!w.go_to_target && (state.t + w.seed) % 78 === 0) {
          w2.v_max = w.v_max = V_MAX * lerp(Math.random(), 0.2, 0.5);
          w.go_to_target = getWanderingPoint(w, WANDERING_RADIUS * 2);
        }
      }

      w.activity.t++;

      if (w.activity.t > 600) {
        (w.activity as any).type = "idle";

        const baby = addTriceratops(
          getChildVariant(w.variant_index, w2.variant_index)
        );

        updateTriceratops();

        baby.o[0] = (w.o[0] + w2.o[0]) / 2;
        baby.o[2] = (w.o[2] + w2.o[2]) / 2;
      }
    }
  }
};

const getWanderingPoint = (
  w: Triceratops,
  radius: number
): [number, number] => {
  let x = 9999;
  let y = 9999;
  while (
    !isInsidePlayground(x, y) ||
    Math.hypot(x - w.wandering_center[0], y - w.wandering_center[1]) > radius
  ) {
    x = (Math.random() - 0.5) * radius * 2 + w.wandering_center[0];
    y = (Math.random() - 0.5) * radius * 2 + w.wandering_center[1];
  }

  return [x, y];
};

const findANiceFruit = (w: Skeleton & WithDecision): number | undefined => {
  const grabbable: number[] = [];

  for (const fruit of fruits.values()) {
    if (
      (!w.will_not_eat_again.has(fruit.id) || fruit.dragged_anchor) &&
      isInsidePlayground(fruit.p[0], fruit.p[2]) &&
      (w.food_level < MAX_FOOD_LEVEL || fruit.dragged_anchor)
    ) {
      // const v = [position[0] - w.origin[0], position[2] - w.origin[2]] as vec2;
      // const l = vec2.length(v);

      const l = vec3.distance(fruit.p, w.o);

      if (l < WANDERING_RADIUS * 0.6) grabbable.push(fruit.id);
    }
  }

  const toGrab = grabbable[Math.floor(Math.random() * grabbable.length)];

  return toGrab;
};
