import { Draggable } from "./triceratops";
import { Sprite } from "./particles";

export type Fruit = {
  id: number;
} & Sprite &
  Draggable & { eaten_by?: number };

export const FRUIT_S = 0.7;
export const fruits = new Map<number, Fruit>();

export const FRUIT_Y = FRUIT_S * 0.32;

export const MAX_FRUIT = 256;
