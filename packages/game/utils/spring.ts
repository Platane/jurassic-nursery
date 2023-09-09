import { vec3 } from "gl-matrix";

/**
 * step the spring, mutate the state to reflect the state at t+dt
 *
 */
export const stepSpring = (
  s: { x: number; v: number; target: number },
  { tension, friction }: { tension: number; friction: number },

  dt = 1 / 60
) => {
  const a = -tension * (s.x - s.target) - friction * s.v;

  s.v += a * dt;
  s.x += s.v * dt;
};

export const stepSpring3 = (
  x: vec3,
  v: vec3,
  target: vec3,
  { tension, friction }: { tension: number; friction: number },

  dt = 1 / 60
) => {
  for (let k = 3; k--; ) {
    const a = -tension * (x[k] - target[k]) - friction * v[k];

    v[k] += a * dt;
    x[k] += v[k] * dt;
  }
};

/**
 * return true if the spring is to be considered in a stable state
 * ( close enough to the target and with a small enough velocity )
 */
export const isStable = (
  s: { x: number; v: number; target: number },
  dt = 1 / 60,
  e = 0.0001
) => Math.abs(s.x - s.target) < e && Math.abs(s.v * dt) < e;
