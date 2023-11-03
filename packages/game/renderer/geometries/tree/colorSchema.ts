import { hslToRgb } from "../../../utils/color";
import { setIntoArray, setIntoArrayValues } from "../../../utils/vec3";
import { MAX_ENTITY } from "../model/skeleton";

export const N_COLORS = 7;

export const colorSchema = new Float32Array(3 * N_COLORS * MAX_ENTITY);

const out = [0, 0, 0] as [number, number, number];

for (let i = MAX_ENTITY; i--; ) {
  // leafs
  const hue = Math.random() * 0.14 + 0.2;
  for (let k = N_COLORS; k--; ) {
    hslToRgb(out, hue, 0.67, (1 - k / N_COLORS) * 0.4 + 0.2);
    setIntoArray(colorSchema, i * N_COLORS + k, out);
  }

  //
  // trunk
  hslToRgb(
    out,
    0.11 + Math.random() * 0.03,
    Math.random() * 0.2 + 0.6,
    Math.random() * 0.12 + 0.16
  );
  setIntoArray(colorSchema, i * N_COLORS + N_COLORS - 1, out);
}
