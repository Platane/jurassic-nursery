import { mat4, quat, vec2, vec3 } from "gl-matrix";
import { MAX_ENTITY, Skeleton } from "../renderer/geometries/model/skeleton";
import { triceratops } from "../entities/triceratops";
import { clamp, invLerp, lerp } from "../utils/math";
import { gizmos } from "../renderer/materials/gizmos";
import { state } from "../ui/state";
import { V_MAX, Walker } from "./walker";

const X = [1, 0, 0] as vec3;

const QUAT0 = quat.create();
const q = quat.create();

export const updateWalkerPose = (w: Skeleton & Walker) => {
  const v_l = vec2.length(w.velocity) / V_MAX;

  //
  // tail
  //

  w.tail_t += lerp(v_l, 0.015, 0.12);
  w.feet_t += lerp(1 - (v_l - 1) ** 2, 0, 0.13);

  const blobbing_A = lerp(v_l, 5, 10);

  quat.fromEuler(
    w.tail_direction,
    0,
    lerp(
      Math.abs(w.delta_angle_mean),
      Math.sin(w.tail_t) * blobbing_A * 0.5,
      w.delta_angle_mean * 30
    ),
    lerp(v_l, 4, 0) + Math.sin(w.feet_t * 2) * blobbing_A
  );

  quat.fromEuler(
    w.head_direction,
    0,
    lerp(
      Math.abs(w.delta_angle_mean),
      Math.sin(w.tail_t) * blobbing_A * 0.5,
      -w.delta_angle_mean * 50
    ),
    Math.sin(w.feet_t * 2) * blobbing_A * 0.8
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
