import { vec3 } from "gl-matrix";
import { N_TILES } from "../renderer/materials/billboard/textureAtlas";
import { Draggable } from "./triceratops";

export type Particles = { p: vec3; s: number; i: number } & Draggable;

const s = 0.6;
export const fruits: Particles[] = [];

for (let i = 40; i--; )
  fruits.push({
    // p: [
    //   //
    //   Math.ra,
    //   s / 2,
    //   ((0 | (i / 13)) - 6) * 2,
    // ],
    p: [
      //
      (Math.random() - 0.5) * 20,
      s / 2,
      (Math.random() - 0.5) * 20,
    ],
    s,
    i: i % N_TILES,
  });
