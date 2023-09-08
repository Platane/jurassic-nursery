import { MAX_ENTITY } from "./skeleton";

export const N_COLORS = 7;

export const colorSchema = new Float32Array(3 * N_COLORS * MAX_ENTITY);

export const setEntityColorSchema = (i: number, colors: number[]) => {
  for (let k = colors.length; k--; )
    colorSchema[3 * N_COLORS * i + k] = colors[k];
};
