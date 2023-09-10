import { vec3 } from "gl-matrix";
import { Skeleton } from "../renderer/geometries/model/skeleton";

export type WithEmote = {
  emote: null | "no" | "happy";
  inLove: boolean;
  lookAt: vec3 | null;
  seed: number;
};

export const updateEmote = (w: Skeleton & WithEmote) => {};
