import { MAX_ENTITY } from "./skeleton";

export const N_COLORS = 7;

export const colorSchema = new Float32Array(3 * N_COLORS * MAX_ENTITY);

export const setEntityColorSchema = (
  i: number,

  /**
   * 0  base
   * 1  baseDot
   *
   * 2  stripe
   * 3  stripeDot
   *
   * 4  belly
   *
   * 5  eye
   * 6  pupil
   */
  colors: number[]
) => {
  for (let k = colors.length; k--; )
    colorSchema[3 * N_COLORS * i + k] = colors[k];
};
