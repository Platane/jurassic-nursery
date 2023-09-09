import { vec3 } from "gl-matrix";

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
