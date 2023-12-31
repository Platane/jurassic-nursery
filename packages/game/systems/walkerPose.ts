import { quat, vec2, vec3 } from "gl-matrix";
import { Triceratops } from "../entities/triceratops";
import { Skeleton } from "../renderer/geometries/model/skeleton";
import { state } from "../ui/state";
import { lerp } from "../utils/math";
import { V_MAX, Walker } from "./walker";

export const updateWalkerPose = (w: Triceratops) => {
  if (w.dragged_anchor) {
    quat.fromEuler(w.head_direction, 0, 0, -55 - Math.sin(state.t * 0.1) * 10);
    quat.fromEuler(w.tail_direction, 0, 0, 30 + Math.sin(state.t * 0.1) * 5);
    w.feet[0] = 0.3;
    w.feet[1] = 0.3;
    w.feet[2] = -0.3;
    w.feet[3] = -0.3;

    return;
  }

  const v_l = vec2.length(w.velocity) / V_MAX;

  //
  // tail
  //

  w.tail_t += lerp(v_l, 0.015, 0.12);
  w.feet_t += lerp(1 - (1 - v_l) ** 3, 0, 0.12);

  const blobbing_A = lerp(v_l, 5, 10);

  quat.fromEuler(
    w.tail_direction,
    0,
    lerp(
      Math.abs(w.delta_angle_mean),
      Math.sin(w.tail_t) * blobbing_A * 0.5,
      w.delta_angle_mean * 30,
    ),
    lerp(v_l, 4, 0) + Math.sin(w.feet_t * 2) * blobbing_A,
  );

  quat.fromEuler(
    w.head_direction,
    0,
    lerp(
      Math.abs(w.delta_angle_mean),
      Math.sin(w.tail_t) * blobbing_A * 0.5,
      -w.delta_angle_mean * 50,
    ),
    Math.sin(w.feet_t * 2) * blobbing_A * 0.8,
  );

  //
  // feet
  //

  const feet_A = Math.sqrt(lerp(v_l, 0, 1));

  for (let k = 4; k--; ) {
    w.feet[k] = (f_saw(w.feet_t / Math.PI + k / 4) - 0.5) * 2 * feet_A;
  }
};

//
// go from 0 to 1  and from 1 to 0 with a period of 1
const f_saw = (x: number) => {
  const u = x % 1;
  if (u < 0.5) return u * 2;
  else return 1 - (u - 0.5) * 2;
};
