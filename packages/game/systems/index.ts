import { fruits } from "../entities/fruits";
import { triceratops } from "../entities/triceratops";
import { state } from "../ui/state";
import { updateDraggedFruit, updateTriceratopsDragged } from "./dragged";
import { updateEmote } from "./emote";
import { updateFruitSpawn } from "./fruitSpawn";
import { updateDecision } from "./ia";
import { updateTrees } from "./trees";
import { updateTriceratopsSpawn } from "./triceratopSpawn";
import { updateTriceratopsParticles } from "./triceratopsParticles";
import { step } from "./walker";
import { updateWalkerPose } from "./walkerPose";

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
  updateTriceratopsSpawn();
  updateFruitSpawn();
  updateTrees();
};
