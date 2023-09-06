import { vec2 } from "gl-matrix";
import { Skeleton } from "../renderer/geometries/model/skeleton";

type Triceratops = Skeleton & { target: vec2 };

export const triceratops: Triceratops[] = [];
