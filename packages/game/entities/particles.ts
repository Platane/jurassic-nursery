import { vec3 } from "gl-matrix";

export type Sprite = { p: vec3; size: number; i: number };

export type Particle = Sprite & { t: number; position0: vec3 };

export type TriceratopsParticle = Sprite & {
  t: number;
  localPosition0: vec3;
  triceratopsId: number;
};

export const triceratopsParticles = new Set<TriceratopsParticle>();
