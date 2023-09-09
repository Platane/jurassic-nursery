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

/**
 * project the pointer on ground
 */
export const projectOnGround = (
  out: vec3,
  ray_origin: vec3,
  ray_direction: vec3,
  y0: number = 0
) => {
  const t = (y0 - ray_origin[1]) / ray_direction[1];
  vec3.scaleAndAdd(out, ray_origin, ray_direction, t);
};
