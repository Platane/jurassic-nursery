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
  v: vec3,
) =>
  setIntoArrayValues(
    arr,
    i,

    v[0],
    v[1],
    v[2],
  );

export const setIntoArrayValues = (
  arr: number[] | Float32Array | Uint8Array,
  i: number,
  x: number,
  y: number,
  z: number,
) => {
  arr[i * 3 + 0] = x;
  arr[i * 3 + 1] = y;
  arr[i * 3 + 2] = z;
};
