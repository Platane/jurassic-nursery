import { vec3, mat4 } from "gl-matrix";
import { eye, worldMatrix } from "../entities/camera";

const worldMatrixInv = mat4.create();

export const getScreenX = (pageX: number) =>
  (pageX / window.innerWidth) * 2 - 1;

export const getScreenY = (pageY: number) =>
  -((pageY / window.innerHeight) * 2 - 1);

export const getRayFromScreen = (
  outOrigin: vec3,
  outDirection: vec3,
  x: number,
  y: number
) => {
  // get the ray
  mat4.invert(worldMatrixInv, worldMatrix);
  vec3.transformMat4(outDirection, [x, y, 0.5], worldMatrixInv);

  vec3.sub(outDirection, outDirection, eye);
  vec3.normalize(outDirection, outDirection);

  vec3.copy(outOrigin, eye);
};

const o = vec3.create();
const v = vec3.create();
/**
 * project the pointer on ground
 */
export const projectOnGround = (
  out: vec3,
  x: number,
  y: number,
  y0: number = 0
) => {
  getRayFromScreen(o, v, x, y);

  const t = (y0 - o[1]) / v[1];
  vec3.scaleAndAdd(out, o, v, t);
};
