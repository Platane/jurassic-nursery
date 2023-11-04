import { shuffleArray } from "../../../utils/array";
import { hslToRgb } from "../../../utils/color";
import { setIntoArray, setIntoArrayValues } from "../../../utils/vec3";
import { MAX_ENTITY } from "../model/skeleton";

export const N_COLORS = 7;

export const colorSchema = new Float32Array(3 * N_COLORS * MAX_ENTITY);

const out = [0, 0, 0] as [number, number, number];
const color1 = [0, 0, 0] as [number, number, number];
const color2 = [0, 0, 0] as [number, number, number];
const color3 = [0, 0, 0] as [number, number, number];
const colors = [
  color1,
  color1,
  color1,
  color2,
  color2,
  color2,
  color2,
  color3,
  color3,
  color3,
];

for (let i = MAX_ENTITY; i--; ) {
  // leafs
  const hue = (Math.floor(Math.random() * 3) / 3) * 0.12 + 0.12;

  // for (let k = N_COLORS; k--; ) {
  //   hslToRgb(out, hue, 0.67, (1 - k / N_COLORS) * 0.4 + 0.2);
  //   // hslToRgb(out, Math.random(), 0.67, (1 - k / N_COLORS) * 0.4 + 0.2);
  //   setIntoArray(colorSchema, i * N_COLORS + k, out);
  // }

  hslToRgb(color1, hue, 0.67, 0.47);
  hslToRgb(color2, hue, 0.67, 0.5);
  hslToRgb(color3, hue, 0.67, 0.6);

  shuffleArray(colors);

  for (let k = N_COLORS - 1; k--; )
    setIntoArray(colorSchema, i * N_COLORS + k, colors[k]);

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
