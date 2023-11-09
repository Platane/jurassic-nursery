import { mat4, vec3 } from "gl-matrix";
import { eye, worldMatrix } from "../../entities/camera";

const worldMatrixInv = mat4.create();

export const getScreenX = (pageX: number) =>
  (pageX / window.innerWidth) * 2 - 1;

export const getScreenY = (pageY: number) =>
  -((pageY / window.innerHeight) * 2 - 1);

export const getRayFromScreen = (
  outOrigin: vec3,
  outDirection: vec3,
  x: number,
  y: number,
) => {
  // get the ray
  mat4.invert(worldMatrixInv, worldMatrix);
  vec3.transformMat4(outDirection, [x, y, 0.5], worldMatrixInv);

  vec3.sub(outDirection, outDirection, eye);
  vec3.normalize(outDirection, outDirection);

  vec3.copy(outOrigin, eye);
};
