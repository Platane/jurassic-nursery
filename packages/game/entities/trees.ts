import { quat, vec2 } from "gl-matrix";
import { MAX_ENTITY } from "../renderer/geometries/model/skeleton";
import { PLAYGROUND_SIZE } from "../systems/const";

export type Tree = {
  id: number;
  position: vec2;
  seed: number;
  direction: quat;
  radius: number;
  height: number;
  trunkHeight: number;
};

export const trees = new Map<number, Tree>();

//
// init a circle of trees
for (let k = 2500; k-- && trees.size < MAX_ENTITY; ) {
  const position = [
    (Math.random() - 0.5) * 2 * PLAYGROUND_SIZE * 2,
    (Math.random() - 0.5) * 2 * PLAYGROUND_SIZE * 2,
  ] as [number, number];

  const l = vec2.length(position);

  if (
    l > PLAYGROUND_SIZE * 0.93 &&
    l < PLAYGROUND_SIZE * 2 &&
    ![...trees.values()].some((t) => vec2.distance(position, t.position) < 2) &&
    trees.size < MAX_ENTITY
  ) {
    const tree = {
      id: k,
      position,
      seed: Math.floor(k * 199999 + 13123),
      radius: Math.random() * 0.12 + 0.95,
      height: Math.random() * 0.3 + 0.8,
      trunkHeight: Math.random() * 0.3 + 0.25,
      direction: quat.create(),
    } satisfies Tree;

    trees.set(tree.id, tree);
  }
}
