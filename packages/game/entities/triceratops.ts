import type { vec3 } from "gl-matrix";
import type { Skeleton } from "../renderer/geometries/model/skeleton";
import type { WithEmote } from "../systems/emote";
import type { WithDecision } from "../systems/ia";
import type { Walker } from "../systems/walker";

export type Entity = {
  id: number;
  variant_index: number;
  // genotype: Genotype;
  // parents?: [Entity, Entity];
};

export type Draggable = {
  dragged_anchor?: vec3;
  dragged_v?: vec3;
};

export type Triceratops = Skeleton & {
  colors: number[];
} & Entity &
  Draggable &
  Walker &
  WithEmote &
  WithDecision;

export const triceratops = new Map<number, Triceratops>();

export const isTriceratops = (x: any): x is Triceratops =>
  x && !!x.tail_direction;

export const MAX_TRICERATOPS = 128;
