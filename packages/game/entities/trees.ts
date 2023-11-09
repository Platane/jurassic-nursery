import { quat, vec2 } from "gl-matrix";

export const MAX_TREE = 80;

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
