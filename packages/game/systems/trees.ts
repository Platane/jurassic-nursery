import { quat, vec2 } from "gl-matrix";
import { MAX_TREE, trees } from "../entities/trees";
import { state } from "../ui/state";
import { PLAYGROUND_SIZE } from "./const";

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

export const initTrees = () => {
  //
  // init a circle of trees
  for (let k = 2500; k-- && trees.size < MAX_TREE; ) {
    const position = [
      (Math.random() - 0.5) * 2 * PLAYGROUND_SIZE * 2,
      (Math.random() - 0.5) * 2 * PLAYGROUND_SIZE * 2,
    ] as [number, number];

    const l = vec2.length(position);

    if (
      l > PLAYGROUND_SIZE * 0.93 &&
      l < PLAYGROUND_SIZE * 2 &&
      ![...trees.values()].some(
        (t) => vec2.distance(position, t.position) < 2
      ) &&
      trees.size < MAX_TREE
    ) {
      const tree = {
        id: k,
        position,
        seed: Math.floor(k * 199999 + 13123),
        radius: Math.random() * 0.12 + 0.95,
        height: Math.random() * 0.3 + 0.8,
        trunkHeight: Math.random() * 0.3 + 0.25,
        direction: quat.create(),
      };

      trees.set(tree.id, tree);
    }
  }
};
