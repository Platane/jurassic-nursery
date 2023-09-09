import { vec3 } from "gl-matrix";
import { N_TILES } from "../renderer/materials/billboard/textureAtlas";
import { Draggable } from "./triceratops";

export type Particles = { p: vec3; s: number; i: number } & Draggable;

const s = 0.6;
export const fruits: Particles[] = [];

for (let i = 10; i--; )
  fruits.push({
    p: [
      //
      ((i % 13) - 6) * 2,
      s / 2,
      ((0 | (i / 13)) - 6) * 2,
    ],

    s,
    i: (i ** 2 + 9 * (i % 7) ** 3 + (i % 13) ** 7) % N_TILES,

    ...(true && {
      p: [(Math.random() - 0.5) * 20, s * 0.32, (Math.random() - 0.5) * 20],
    }),
  });
