import { vec2 } from "gl-matrix";
import { Triceratops, triceratops } from "../entities/triceratops";
import { createSkeleton } from "../renderer/geometries/model/skeleton";
import { state } from "../ui/state";
import { V_MAX, step } from "./walker";
import { updateWalkerPose } from "./walkerPose";
import { updateEmote } from "./emote";
import { updateDecision } from "./ia";
import { updateDraggedFruit, updateTriceratopsDragged } from "./dragged";
import { fruits } from "../entities/fruits";
import { updateTriceratopsParticles } from "./triceratopsParticles";
import { updateSpawn } from "./spawn";

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
  updateSpawn();
};
