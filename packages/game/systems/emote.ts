import { quat, vec3 } from "gl-matrix";
import { triceratopsParticles } from "../entities/particles";
import { Skeleton } from "../renderer/geometries/model/skeleton";
import { state } from "../ui/state";
import { MAX_FOOD_LEVEL } from "./const";
import { EATING_DURATION, WithDecision } from "./ia";

export type WithEmote = {
  emote?: null | "happy";

  mood?: { type: "happy"; t: 0 } | { type: "love"; t: 0 };

  inLove?: boolean;
  lookAt?: vec3 | null;
  seed: number;
};

export const updateEmote = (
  w: Skeleton & WithEmote & WithDecision & { id: number },
) => {
  if (w.activity.type === "eating") {
    const k = w.activity.t / EATING_DURATION;

    quat.rotateZ(
      w.head_direction,
      w.head_direction,
      ((1 - Math.sin(k * Math.PI * 7.5 + Math.PI / 2)) / 2) * -0.24,
    );
  } else if (w.activity.type === "say-no") {
    if (w.activity.t === 0)
      triceratopsParticles.add({
        triceratopsId: w.id,
        localPosition0: [0.7, 0, 0],
        p: [] as any as vec3,
        size: 0,
        i: 5,
        t: 0,
      });

    quat.rotateY(
      w.head_direction,
      w.head_direction,
      Math.sin(w.activity.t * 0.2) * 0.27,
    );
  } else if (w.mood?.type === "happy") {
    if (w.mood.t % 26 === 0) {
      triceratopsParticles.add({
        triceratopsId: w.id,
        localPosition0: [
          0.6 + (Math.random() - 0.5) * 0.5,
          0.3,
          (Math.random() - 0.5) * 0.5,
        ],
        p: [] as any as vec3,
        size: 0,
        i: 8,
        t: 0,
      });
    }

    w.mood.t++;

    if (w.mood.t > 120) w.mood = undefined;
  }

  if (
    (w.food_level >= MAX_FOOD_LEVEL && (w.seed + state.t) % 53 === 0) ||
    (w.activity.type === "in-love" && (w.seed + state.t) % 21 === 0)
  ) {
    triceratopsParticles.add({
      triceratopsId: w.id,
      localPosition0: [
        0.6 + (Math.random() - 0.5) * 0.5,
        0.3,
        (Math.random() - 0.5) * 0.5,
      ],
      p: [] as any as vec3,
      size: 0,
      i: 7,
      t: 0,
    });
  }

  //
  // eye rolling
  //
  quat.fromEuler(
    w.eye0_direction,
    3 + Math.sin(state.t * 0.063 + w.seed) * 20,
    Math.sin(state.t * 0.074 + w.seed) * 30,
    0,
  );
  quat.fromEuler(
    w.eye1_direction,
    3 + Math.sin(state.t * 0.035 + w.seed) * 50,
    Math.sin(state.t * 0.057 + w.seed) * 35,
    0,
  );
};
