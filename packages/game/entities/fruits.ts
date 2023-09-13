import { vec3 } from "gl-matrix";
import { Draggable } from "./triceratops";

export type Sprite = { p: vec3; size: number; i: number };

export type Fruit = {
  id: number;
} & Sprite &
  Draggable & { eaten_by?: number };

export const FRUIT_S = 0.7;
export const fruits = new Map<number, Fruit>();

export const FRUIT_Y = FRUIT_S * 0.32;

let _id = 1;
export const addFruit = () => {
  const fruit = {
    size: FRUIT_S,
    i: 0,
    p: [0, FRUIT_Y, 0],
    id: _id++,
  } as Fruit;
  fruits.set(fruit.id, fruit);
  return fruit;
};

export type Particle = Sprite & { t: number; position0: vec3 };

export type TriceratopsParticle = Sprite & {
  t: number;
  localPosition0: vec3;
  triceratopsId: number;
};

export const triceratopsParticles = new Set<TriceratopsParticle>();
