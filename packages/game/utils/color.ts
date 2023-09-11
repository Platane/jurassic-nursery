/**
 *
 * @param h in [ 0, 1 ]
 * @param s in [ 0, 1 ]
 * @param l in [ 0, 1 ]
 */
export const hslToRgb = (
  out: [number, number, number],
  h: number,
  s: number,
  l: number
) => {
  // if (s == 0) {
  //   out[0] = out[1] = out[2] = l; // achromatic
  // } else {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  out[0] = hue2rgb(p, q, h + 1 / 3);
  out[1] = hue2rgb(p, q, h);
  out[2] = hue2rgb(p, q, h - 1 / 3);
  // }
};

const hue2rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};
