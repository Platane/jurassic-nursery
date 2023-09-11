import { vec2, vec3 } from "gl-matrix";
import type { Skeleton } from "../renderer/geometries/model/skeleton";
import type { Genotype } from "../systems/gene";
import { Walker } from "../systems/walker";
import { WithEmote } from "../systems/emote";
import { WithDecision } from "../systems/ia";

export type Entity = {
  id: number;
  genotype: Genotype;
  parents?: [Entity, Entity];
};

export type Draggable = {
  dragged_anchor?: vec3;
  dragged_v?: vec3;
};

export type Triceratops = Skeleton & { target: vec2 } & Entity &
  Draggable &
  Walker &
  WithEmote &
  WithDecision;

export const triceratops = new Map<number, Triceratops>();

export const isTriceratops = (x: any): x is Triceratops =>
  x && !!x.tail_direction;
