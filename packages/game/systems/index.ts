import { triceratops } from "../entities/triceratops";
import { state } from "../ui/state";
import { updateWalkerPose } from "./walkerPose";
import { updateEmote } from "./emote";
import { updateDecision } from "./ia";
import { updateDraggedFruit, updateTriceratopsDragged } from "./dragged";
import { fruits } from "../entities/fruits";
import { updateTriceratopsParticles } from "./triceratopsParticles";
import { updateTriceratopsSpawn } from "./triceratopSpawn";
import { step } from "./walker";
import { updateFruitSpawn } from "./fruitSpawn";

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
};
