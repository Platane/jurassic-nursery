import { quat, vec2 } from "gl-matrix";

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

for (let k = 0; k--; ) {
  const tree = {
    id: k,
    position: [((k % 10) - 5) * 2.3, (Math.floor(k / 10) - 5) * 2.2],
    seed: Math.floor(k * 199999 + 13123),
    radius: 1 + Math.random() * 2,
    height: 1 + Math.random() * 2,
    trunkHeight: 1,
    direction: quat.create(),
  } satisfies Tree;

  trees.set(tree.id, tree);
}

{
  const tree = {
    id: 123123,
    position: [2, 2],
    seed: 213123,
    radius: 1,
    height: 1,
    trunkHeight: 0.5,
    direction: quat.create(),
  } satisfies Tree;

  trees.set(tree.id, tree);
}
