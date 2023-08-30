import { mat3, mat4 } from "gl-matrix";

export const mat4FromMat3 = (out: mat4, m3: mat3) => {
  out[0] = m3[0];
  out[1] = m3[1];
  out[2] = m3[2];
  out[3] = 0;
  out[4] = m3[3];
  out[5] = m3[4];
  out[6] = m3[5];
  out[7] = 0;
  out[8] = m3[6];
  out[9] = m3[7];
  out[10] = m3[8];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
};
