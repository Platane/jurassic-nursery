import { vec3 } from "gl-matrix";
import { Draggable } from "./triceratops";

export type Sprite = { position: vec3; size: number; i: number };

export type Fruit = {
  id: number;
} & Sprite &
  Draggable & { eaten_by?: number };

export const FRUIT_S = 0.6;
export const fruits = new Map<number, Fruit>();

export const FRUIT_Y = FRUIT_S * 0.32;

let _id = 1;
export const addFruit = () => {
  const fruit = {
    size: FRUIT_S,
    i: 0,
    position: [0, FRUIT_Y, 0],
    id: _id++,
  } as Fruit;
  fruits.set(fruit.id, fruit);
  return fruit;
};

const fruit0 = addFruit();
fruit0.position[0] = 2;
fruit0.position[2] = 3;
fruit0.i = 1;

const fruit1 = addFruit();
fruit1.position[0] = 4;
fruit1.position[2] = 6;
fruit1.i = 2;

const fruit3 = addFruit();
fruit3.position[0] = -4;
fruit3.position[2] = 3;
fruit3.i = 3;

export type Particle = Sprite & { t: number; position0: vec3 };

export type TriceratopsParticle = Sprite & {
  t: number;
  localPosition0: vec3;
  triceratopsId: number;
};

export const triceratopsParticles = new Set<TriceratopsParticle>();
