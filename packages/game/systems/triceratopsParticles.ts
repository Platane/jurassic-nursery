import { vec3 } from "gl-matrix";
import { clamp, invLerp } from "../utils/math";
import { UP } from "../utils/vec3";
import { triceratops } from "../entities/triceratops";
import { triceratopsParticles } from "../entities/particles";

/**
 * particles that emanate from a triceratops
 */
export const updateTriceratopsParticles = () => {
  for (const p of triceratopsParticles) {
    p.t++;

    const tri = triceratops.get(p.triceratopsId);

    if (!tri) triceratopsParticles.delete(p);
    else if (p.i === 5 || p.i === 6) {
      if (p.t > 80) triceratopsParticles.delete(p);

      const u = clamp(p.t / 24, 0, 1);
      const k = 1 - (1 - u) ** 2;

      const h = clamp(-(p.t - 73) / 5, 0, 1);

      vec3.copy(p.p, p.localPosition0);
      vec3.transformQuat(p.p, p.p, tri.direction);
      vec3.add(p.p, p.p, tri.o);
      vec3.scaleAndAdd(p.p, p.p, UP, k * 0.6);

      p.size = (h < 1 ? h : k) * 0.6;
    } else if (p.i === 7 || p.i === 8) {
      const L = 57;

      if (p.t > L) triceratopsParticles.delete(p);

      const k = p.t / L;

      const a = k * 10;
      const A = k * k * 0.1;

      p.p[0] = p.localPosition0[0] + Math.sin(a) * A;
      p.p[1] = p.localPosition0[1];
      p.p[2] = p.localPosition0[2] + Math.cos(a) * A;
      vec3.transformQuat(p.p, p.p, tri.direction);
      vec3.add(p.p, p.p, tri.o);
      vec3.scaleAndAdd(p.p, p.p, UP, k * 0.65);

      p.size = (k > 0.5 ? clamp(invLerp(k, 1, 0.8), 0, 1) : k / 0.5) * 0.3;
    }
  }
};
