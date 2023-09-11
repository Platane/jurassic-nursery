import { quat, vec2, vec3 } from "gl-matrix";
import {
  Triceratops,
  isTriceratops,
  triceratops,
} from "../entities/triceratops";
import { createSkeleton } from "../renderer/geometries/model/skeleton";
import { state } from "../ui/state";
import { V_MAX, step } from "./walker";
import { updateWalkerPose } from "./walkerPose";
import { updateEmote } from "./emote";
import { updateDecision } from "./ia";
import { updateDraggedFruit, updateTriceratopsDragged } from "./dragged";
import { fruits } from "../entities/fruits";
import { updateTriceratopsParticles } from "./triceratopsParticles";

export const PLAYGROUND_SIZE = 12;

export const update = () => {
  state.t++;

  step();

  for (const tri of triceratops.values()) {
    updateTriceratopsDragged(tri);

    updateDecision(tri);
    updateWalkerPose(tri);

    // emote might change the walker pose
    // run it after
    updateEmote(tri);
  }

  fruits.forEach(updateDraggedFruit);

  updateTriceratopsParticles();
};

//
// init
for (let k = 1; k--; ) {
  const t: Triceratops = {
    id: triceratops.size + 1,
    ...createSkeleton(),
    target: [0, 0] as [number, number],
    genotype: [{ w: 1, v: 0 }],

    velocity: vec2.create(),
    delta_angle_mean: 0,
    tail_t: Math.random() * 3,
    feet_t: Math.random() * 3,
    v_max: V_MAX,
    seed: Math.random(),
    edible: new Set([1]),
    activity: { type: "idle" },
  };

  // t.origin[0] = Math.random() * 6;
  // t.origin[2] = -2;

  // quat.fromEuler(t.direction, 0, Math.random() * 360, 0);
  // t.target[0] = (Math.random() - 0.5) * 12;
  // t.target[1] = (Math.random() - 0.5) * 12;

  triceratops.set(t.id, t);
}
