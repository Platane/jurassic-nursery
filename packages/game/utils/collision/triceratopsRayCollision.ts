import { vec3 } from "gl-matrix";
import { Skeleton } from "../../renderer/geometries/model/skeleton";
import { sphereRayCollision } from "./sphereRayCollision";

const a = vec3.create();

/**
 * approximate the mesh with 3 spheres
 *
 * good enough
 */
export const triceratopsRayCollision = (
  s: Skeleton,
  ray_origin: vec3,
  ray_direction: vec3
) => {
  vec3.set(a, 0.44, -0.1, 0);
  vec3.transformQuat(a, a, s.direction);
  vec3.add(a, a, s.origin);
  const d1 = sphereRayCollision(a, 0.52, ray_origin, ray_direction);

  vec3.set(a, -0.49, -0.2, 0);
  vec3.transformQuat(a, a, s.direction);
  vec3.add(a, a, s.origin);
  const d2 = sphereRayCollision(a, 0.44, ray_origin, ray_direction);

  vec3.set(a, 0, -0, 0);
  vec3.transformQuat(a, a, s.direction);
  vec3.add(a, a, s.origin);
  const d3 = sphereRayCollision(a, 0.4, ray_origin, ray_direction);

  return Math.min(d1, d2, d3);
};
