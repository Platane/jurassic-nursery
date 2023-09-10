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

export const addFruit = () => {
  const id = fruits.size + 1;
  const fruit = {
    size: FRUIT_S,
    i: 0,
    position: [0, FRUIT_Y, 0],
    id,
  } as Fruit;
  fruits.set(id, fruit);
  return fruit;
};

const fruit0 = addFruit();
fruit0.position[0] = 2;
fruit0.position[2] = 0;

export type Particle = Sprite;

export const particles: Particle[] = [];
