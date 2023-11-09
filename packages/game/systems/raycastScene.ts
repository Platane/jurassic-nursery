import { mat4, vec3 } from "gl-matrix";
import { fruits } from "../entities/fruits";
import { triceratops } from "../entities/triceratops";
import { sphereRayCollision } from "../utils/collision/sphereRayCollision";
import { triceratopsRayCollision } from "../utils/collision/triceratopsRayCollision";

export const raycastToScene = (
  ray_origin: vec3,
  ray_direction: vec3,
  fruit = true,
) => {
  let d_min = Infinity;
  let id_tri_min = -1;

  for (const t of triceratops.values()) {
    const d = triceratopsRayCollision(t, ray_origin, ray_direction);

    if (d < d_min) {
      id_tri_min = t.id;
      d_min = d;
    }
  }

  let id_fruit_min = -1;
  if (fruit)
    for (const fruit of fruits.values()) {
      const d = sphereRayCollision(
        fruit.p,
        fruit.size * 0.6,
        ray_origin,
        ray_direction,
      );

      if (d < d_min) {
        id_fruit_min = fruit.id;
        d_min = d;
      }
    }

  if (id_fruit_min >= 0) return { type: "fruit" as const, id: id_fruit_min };
  if (id_tri_min >= 0) return { type: "tri" as const, id: id_tri_min };
};
