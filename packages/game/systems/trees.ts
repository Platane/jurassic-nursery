import { quat } from "gl-matrix";
import { trees } from "../entities/trees";
import { state } from "../ui/state";

export const updateTrees = () => {
  for (const [, tree] of trees) {
    quat.fromEuler(
      tree.direction,
      Math.sin(state.t * (0.01 + ((tree.seed % 37) / 37) * 0.02) + tree.seed) *
        3,
      0,
      0
    );
  }
};
