import { mat4, quat, vec2, vec3 } from "gl-matrix";
import { MAX_ENTITY, Skeleton } from "../renderer/geometries/model/skeleton";
import { triceratops } from "../entities/triceratops";
import { clamp, invLerp, lerp } from "../utils/math";
import { gizmos } from "../renderer/materials/gizmos";
import { state } from "../ui/state";

export type Walker = {
  target: vec2;

  velocity: vec2;
};

const X = [1, 0, 0] as vec3;

export const updateWalkerPose = (w: Skeleton & Walker) => {
  const v = [1, 0, 0] as vec3;
  vec3.transformQuat(v, v, w.direction);
  v[1] = 0;
  vec3.normalize(v, v);

  console.log(v);

  // debugger;
};

const accelerations = Array.from({ length: MAX_ENTITY }, vec2.create);

// world unit per frame
const V_MAX = 0.05;

const targetGizmo = mat4.create();
gizmos.push(targetGizmo);

const directionGizmo = mat4.create();
gizmos.push(directionGizmo);

const trails = Array.from({ length: 50 }, mat4.create);
gizmos.push(...trails);

export const step = () => {
  mat4.fromTranslation(targetGizmo, [
    triceratops[0].target[0],
    0,
    triceratops[0].target[1],
  ]);

  for (let i = triceratops.length; i--; ) {
    if (triceratops[i].dragged_anchor) continue;

    const w = triceratops[i];

    const direction3 = [1, 0, 0] as vec3;
    vec3.transformQuat(direction3, direction3, w.direction);
    direction3[1] = 0;
    vec3.normalize(direction3, direction3);

    //
    // intermediate target
    // to introduce collision avoidance
    const target = w.target;

    const desired_v = [
      w.target[0] - w.origin[0],
      w.target[1] - w.origin[2],
    ] as vec2;
    const d = vec2.length(desired_v);

    if (d < 0.2) {
      // bravo
    } else {
      desired_v[0] /= d;
      desired_v[1] /= d;

      const desired_angle = Math.atan2(desired_v[1], desired_v[0]);
      const current_angle = Math.atan2(direction3[2], direction3[0]);

      let delta_angle =
        (desired_angle - current_angle + Math.PI * 4) % (Math.PI * 2);
      if (delta_angle > Math.PI) delta_angle -= Math.PI * 2;

      const current_v_l = vec2.length(w.velocity);

      //
      // depending on the current velocity, the entity is allowed a certain turning radius
      const allowed_angle_delta = lerp(
        invLerp(current_v_l, 0, V_MAX),

        // half turn in 100 frames
        Math.PI / 100,

        // half turn in 1000 frames
        Math.PI / 1000
      );

      const da =
        delta_angle > 0
          ? Math.min(delta_angle, allowed_angle_delta)
          : -Math.min(-delta_angle, allowed_angle_delta);

      const new_angle = current_angle + da;

      let u = 0;
      const m_delta_angle = Math.abs(delta_angle);
      if (m_delta_angle > Math.PI) u = 0;
      else {
        const a = m_delta_angle / clamp(d / 5, 0, 1);

        u = 1 - clamp(a / (Math.PI * 0.6), 0, 1);
      }

      let desired_v_l = lerp(u, V_MAX * 0.2, V_MAX);

      const new_v_l =
        current_v_l > desired_v_l
          ? lerp(0.08, current_v_l, desired_v_l)
          : lerp(0.02, current_v_l, desired_v_l);

      w.velocity[0] = Math.cos(new_angle) * new_v_l;
      w.velocity[1] = Math.sin(new_angle) * new_v_l;

      w.origin[0] += w.velocity[0];
      w.origin[2] += w.velocity[1];

      quat.fromEuler(w.direction, 0, -(new_angle / Math.PI) * 180, 0);

      mat4.fromTranslation(directionGizmo, [
        w.origin[0] + Math.cos(new_angle) * 2,
        0,
        w.origin[2] + Math.sin(new_angle) * 2,
      ]);

      if (state.t % 8 === 0) {
        mat4.fromTranslation(trails[0], [w.origin[0], 0, w.origin[2]]);
        trails.push(trails.shift()!);
      }
    }
  }
};
