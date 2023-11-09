import { MAX_TREE } from "../../../entities/trees";
import { shuffleArray } from "../../../utils/array";
import { hslToRgb } from "../../../utils/color";
import { setIntoArray } from "../../../utils/vec3";

export const N_COLORS = 7;

export const colorSchema = new Float32Array(3 * N_COLORS * MAX_TREE);

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

for (let i = MAX_TREE; i--; ) {
  // leafs
  const hue = (Math.floor(Math.random() * 3) / 3) * 0.06 + 0.15;

  hslToRgb(color1, hue, 0.7, 0.45);
  hslToRgb(color2, hue, 0.67, 0.49);
  hslToRgb(color3, hue, 0.72, 0.53);

  shuffleArray(colors);

  for (let k = N_COLORS - 1; k--; )
    setIntoArray(colorSchema, i * N_COLORS + k, colors[k]);

  //
  // trunk
  hslToRgb(
    out,
    0.11 + Math.random() * 0.03,
    Math.random() * 0.2 + 0.6,
    Math.random() * 0.12 + 0.16,
  );
  setIntoArray(colorSchema, i * N_COLORS + N_COLORS - 1, out);
}
