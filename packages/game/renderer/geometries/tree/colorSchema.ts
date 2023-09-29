import { MAX_ENTITY } from "../model/skeleton";

export const N_COLORS = 7;

export const colorSchema = new Float32Array(3 * N_COLORS * MAX_ENTITY);

for (let i = MAX_ENTITY; i--; ) {
  colorSchema[i * (3 * N_COLORS) + 0] = 0.5;
  colorSchema[i * (3 * N_COLORS) + 1] = 0.8;
  colorSchema[i * (3 * N_COLORS) + 2] = 0.04;
}
