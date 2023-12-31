import { mat4, quat, vec2, vec3 } from "gl-matrix";
import { triceratops } from "../entities/triceratops";
import { clamp, invLerp, lerp } from "../utils/math";

export type Walker = {
  seed: number;

  go_to_target?: vec2;

  velocity: vec2;

  delta_angle_mean: number;

  v_max: number;

  tail_t: number;
  feet_t: number;
};

// world unit per frame
export const V_MAX = 0.05;

// half turn in 100 frames
const ALLOWED_ANGLE_MAX = Math.PI / 100;

// half turn in 1000 frames
const ALLOWED_ANGLE_MIN = Math.PI / 10000;

export const step = () => {
  for (const w of triceratops.values()) {
    if (w.dragged_anchor || !w.go_to_target) continue;

    //
    // intermediate target
    // to introduce collision avoidance
    const target = w.go_to_target;

    const desired_v = [target[0] - w.o[0], target[1] - w.o[2]] as vec2;
    const d = vec2.length(desired_v);

    if (d < 0.2) {
      // bravo

      w.go_to_target = undefined;

      w.velocity[0] = 0;
      w.velocity[1] = 0;
    } else {
      desired_v[0] /= d;
      desired_v[1] /= d;

      const direction3 = [1, 0, 0] as vec3;
      vec3.transformQuat(direction3, direction3, w.direction);
      direction3[1] = 0;
      vec3.normalize(direction3, direction3);

      const desired_angle = Math.atan2(desired_v[1], desired_v[0]);
      const current_angle = Math.atan2(direction3[2], direction3[0]);

      let delta_angle =
        (desired_angle - current_angle + Math.PI * 4) % (Math.PI * 2);
      if (delta_angle > Math.PI) delta_angle -= Math.PI * 2;

      const current_v_l = vec2.length(w.velocity);

      //
      // depending on the current velocity, the entity is allowed a certain turning radius
      const allowed_angle_delta = lerp(
        invLerp(current_v_l, 0, w.v_max),

        // half turn in 100 frames
        ALLOWED_ANGLE_MAX,

        // half turn in 1000 frames
        ALLOWED_ANGLE_MIN,
      );

      const da =
        delta_angle > 0
          ? Math.min(delta_angle, allowed_angle_delta)
          : -Math.min(-delta_angle, allowed_angle_delta);

      w.delta_angle_mean = lerp(
        0.08,
        w.delta_angle_mean,
        da / ALLOWED_ANGLE_MAX,
      );

      const new_angle = current_angle + da;

      let u = 0;
      const m_delta_angle = Math.abs(delta_angle);
      if (m_delta_angle > Math.PI) u = 0;
      else {
        const a = m_delta_angle / clamp(d / 5, 0, 1);

        u = 1 - clamp(a / (Math.PI * 0.6), 0, 1);
      }

      let desired_v_l = lerp(u, w.v_max * 0.2, w.v_max);

      const new_v_l =
        current_v_l > desired_v_l
          ? lerp(0.08, current_v_l, desired_v_l)
          : lerp(0.02, current_v_l, desired_v_l);

      w.velocity[0] = Math.cos(new_angle) * new_v_l;
      w.velocity[1] = Math.sin(new_angle) * new_v_l;

      w.o[0] += w.velocity[0] * w.size;
      w.o[2] += w.velocity[1] * w.size;

      quat.fromEuler(w.direction, 0, -(new_angle / Math.PI) * 180, 0);
    }
  }

  for (const w1 of triceratops.values()) {
    if (w1.dragged_anchor) continue;

    for (const w2 of triceratops.values()) {
      if (w2.dragged_anchor) continue;
      if (w1 === w2) break;

      const v = [w1.o[0] - w2.o[0], w1.o[2] - w2.o[2]];
      const l = Math.hypot(v[0], v[1]);

      if (l < 2) {
        vec3.set(a, 1, 0, 0);
        vec3.transformQuat(a, a, w1.direction);
        const dot1 = a[0] * v[0] + a[2] * v[1];
        const s1 = lerp(Math.abs(dot1), 0.3, 0.66);

        vec3.set(a, 1, 0, 0);
        vec3.transformQuat(a, a, w2.direction);
        const dot2 = a[0] * v[0] + a[2] * v[1];
        const s2 = lerp(Math.abs(dot2), 0.3, 0.66);

        const penetration = Math.max(0, -(l - s1 - s2));

        const f = 0.04 * (1 - (1 - penetration) ** 3);

        w1.o[0] += (v[0] / l) * f;
        w1.o[2] += (v[1] / l) * f;

        w2.o[0] -= (v[0] / l) * f;
        w2.o[2] -= (v[1] / l) * f;
      }
    }
  }
};

const a = vec3.create();
