import { vec3 } from "gl-matrix";

export const UP: vec3 = [0, 1, 0];
export const ZERO: vec3 = [0, 0, 0];

/**
 * set from an array of vec3
 */
export const setFromArray = (out: vec3, arr: ArrayLike<number>, i: number) =>
  vec3.set(out, arr[i * 3 + 0], arr[i * 3 + 1], arr[i * 3 + 2]);

export const setIntoArray = (
  arr: number[] | Float32Array | Uint8Array,
  i: number,
  out: vec3
) => {
  arr[i * 3 + 0] = out[0];
  arr[i * 3 + 1] = out[1];
  arr[i * 3 + 2] = out[2];
};
