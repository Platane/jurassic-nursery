import { vec3 } from "gl-matrix";

const a = vec3.create();

/**
 * return false if no collision
 * or t so ray_origin + ray_direction * t is the collision point
 */
export const sphereRayCollision = (
  sphere_o: vec3,
  sphere_r: number,
  ray_origin: vec3,
  ray_direction: vec3
) => {
  vec3.subtract(a, sphere_o, ray_origin);
  const t = vec3.dot(a, ray_direction);

  const l_a = vec3.length(a);

  const d = Math.sqrt(l_a * l_a - t * t);

  if (d > sphere_r) return Infinity;

  const u = Math.sqrt(sphere_r * sphere_r - d * d);

  return t - u;
};
