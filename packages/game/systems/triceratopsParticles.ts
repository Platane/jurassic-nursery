import { vec3 } from "gl-matrix";
import { triceratopsParticles } from "../entities/fruits";
import { clamp, invLerp } from "../utils/math";
import { UP } from "../utils/vec3";
import { triceratops } from "../entities/triceratops";

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

      vec3.copy(p.position, p.localPosition0);
      vec3.transformQuat(p.position, p.position, tri.direction);
      vec3.add(p.position, p.position, tri.origin);
      vec3.scaleAndAdd(p.position, p.position, UP, k * 0.6);

      p.size = (h < 1 ? h : k) * 0.6;
    } else if (p.i === 7 || p.i === 8) {
      const L = 57;

      if (p.t > L) triceratopsParticles.delete(p);

      const k = p.t / L;

      const a = k * 10;
      const A = k * k * 0.1;

      p.position[0] = p.localPosition0[0] + Math.sin(a) * A;
      p.position[1] = p.localPosition0[1];
      p.position[2] = p.localPosition0[2] + Math.cos(a) * A;
      vec3.transformQuat(p.position, p.position, tri.direction);
      vec3.add(p.position, p.position, tri.origin);
      vec3.scaleAndAdd(p.position, p.position, UP, k * 0.65);

      p.size = (k > 0.5 ? clamp(invLerp(k, 1, 0.8), 0, 1) : k / 0.5) * 0.3;
    }
  }
};
