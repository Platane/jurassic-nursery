import { MAX_ENTITY } from "./skeleton";

// colors are packed in a mat4 ( 16 float )
export const colorSchema = new Float32Array(16 * MAX_ENTITY);

export const setEntityColorSchema = (i: number, colors: number[]) => {
  for (let j = 0; j < colors.length; j++) {
    colorSchema[i * 16 + j] = colors[j];
  }
};
