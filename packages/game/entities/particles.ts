import { vec3 } from "gl-matrix";
import { N_TILES } from "../renderer/materials/billboard/textureAtlas";

export const MAX_PARTICLES = 512;

type Particles = { p: vec3; s: number; i: number };

const s = 0.8;
export const particles: Particles[] = Array.from({ length: 80 }, (_, i) => ({
  p: [
    //
    (Math.random() - 0.5) * 20,
    s / 2,
    (Math.random() - 0.5) * 20,
  ],
  s,
  i: i % N_TILES,
}));
