import { quat, vec3 } from "gl-matrix";
import { Skeleton } from "../renderer/geometries/model/skeleton";
import { EATING_DURATION, WithDecision } from "./ia";
import { state } from "../ui/state";

export type WithEmote = {
  emote: null | "no" | "happy";
  inLove: boolean;
  lookAt: vec3 | null;
  seed: number;
};

export const updateEmote = (w: Skeleton & WithEmote & WithDecision) => {
  if (w.activity.type === "eating") {
    const k = w.activity.t / EATING_DURATION;

    quat.rotateZ(
      w.head_direction,
      w.head_direction,
      ((1 - Math.sin(k * Math.PI * 7.5 + Math.PI / 2)) / 2) * -0.24
    );
  } else if (w.activity.type === "say-no") {
    quat.rotateY(
      w.head_direction,
      w.head_direction,
      Math.sin(w.activity.t * 0.2) * 0.27
    );
  }
};
