import { vec2 } from "gl-matrix";

export type Tree = {
  id: number;
  position: vec2;
  tree_variant: number;
};

export const trees = new Map<number, Tree>();

trees.set(1, { id: 1, position: [1, 2], tree_variant: 0 });
