import { vec2, vec3 } from "gl-matrix";
import {
  Skeleton,
  createSkeleton,
} from "../renderer/geometries/model/skeleton";
import { variants, type Genotype } from "../systems/gene";
import { V_MAX, Walker } from "../systems/walker";
import { WithEmote } from "../systems/emote";
import { WithDecision } from "../systems/ia";
import { setEntityColorSchema } from "../renderer/geometries/model/colorSchema";

export type Entity = {
  id: number;
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

let _id = 1;
export const addTriceratops = (variant_index: number) => {
  const tri: Triceratops = {
    id: _id++,
    ...createSkeleton(),

    ...variants[variant_index],

    food_level: 0,
    love_level: 0,
    happiness_level: 0,
    will_not_eat_again: new Set(),
    wandering_center: [0, 0],
    velocity: vec2.create(),
    delta_angle_mean: 0,
    tail_t: Math.random() * 3,
    feet_t: Math.random() * 3,
    v_max: V_MAX,
    seed: Math.floor(Math.random() * 100),

    activity: { type: "idle" },
  };

  triceratops.set(tri.id, tri);
  return tri;
};

/**
 * call that after add / delete triceratops
 */
export const updateTriceratops = () => {
  let i = 0;
  for (const tri of triceratops.values()) {
    setEntityColorSchema(i, tri.colors);
    i++;
  }
};
