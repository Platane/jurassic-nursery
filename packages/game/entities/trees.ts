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

const N = 20;
const sqN = Math.floor(Math.sqrt(N));
for (let k = 10; k--; ) {
  const tree = {
    id: k,
    position: [
      ((k % sqN) - sqN / 2) * 2.3,
      (Math.floor(k / sqN) - sqN / 2) * 2.2,
    ],
    seed: Math.floor(k * 199999 + 13123),
    radius: 1,
    height: 1,
    trunkHeight: 0.3,
    direction: quat.create(),
  } satisfies Tree;

  trees.set(tree.id, tree);
}

{
  const tree = {
    id: 123123,
    position: [2, 2],
    seed: 123,
    radius: 1,
    height: 1,
    trunkHeight: 0.5,
    direction: quat.create(),
  } satisfies Tree;

  // trees.set(tree.id, tree);
}
