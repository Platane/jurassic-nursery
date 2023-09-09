import { vec2 } from "gl-matrix";
import { Skeleton } from "../renderer/geometries/model/skeleton";

type Entity = {
  id: number;

  genotype: { w: number; v: number }[];
  parents?: [Entity, Entity];
};

type Triceratops = Skeleton & { target: vec2 } & Entity;

export const triceratops: Triceratops[] = [];
