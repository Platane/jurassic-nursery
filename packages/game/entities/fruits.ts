import { vec3 } from "gl-matrix";
import { Draggable } from "./triceratops";

export type Sprite = { position: vec3; size: number; i: number };

export type Fruit = {
  id: number;
} & Sprite &
  Draggable & { eaten_by?: number };

const fruit_s = 0.6;
export const fruits = new Map<number, Fruit>();

for (let i = 1; i--; )
  fruits.set(fruits.size + 1, {
    size: fruit_s,
    i: (i ** 2 + 9 * (i % 7) ** 3 + (i % 13) ** 7) % 5,

    position: [
      (Math.random() - 0.5) * 20,
      fruit_s * 0.32,
      (Math.random() - 0.5) * 20,
    ],

    id: fruits.size + 1,
  });

const fruit0 = [...fruits.values()][0];
fruit0.position[0] = 2;
fruit0.position[2] = 0;

export type Particle = Sprite;

export const particles: Particle[] = [];
