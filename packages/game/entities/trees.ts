import { quat, vec2 } from "gl-matrix";

export type Tree = {
  id: number;
  position: vec2;
  seed: number;
  direction: quat;
};

export const trees = new Map<number, Tree>();

for (let k = 100; k--; ) {
  const tree = {
    id: k,
    position: [((k % 10) - 5) * 2.3, (Math.floor(k / 10) - 5) * 2.2],
    seed: Math.floor(k * 199999 + 13123),
    direction: quat.create(),
  } as Tree;

  trees.set(tree.id, tree);
}
