import { hslToRgb } from "../../utils/color";

export type Genotype = {
  /**
   * weight
   */
  w: number;

  /**
   * variance
   */
  v: number;
}[];

// export const variants = [
//   //
//   { name: "crimson", hue: [0], food: 0 },
//   { name: "coral", hue: [0], food: 0 },
//   { name: "orchid", hue: [0], food: 0 },
//   { name: "turquoise", hue: [0], food: 0 },
//   { name: "fuchsia", hue: [0], food: 0 },
//   { name: "lavender", hue: [0], food: 0 },
//   { name: "mint", hue: [0], food: 0 },
//   { name: "teal", hue: [0], food: 0 },
//   { name: "tomato", hue: [0], food: 0 },
//   { name: "gold", hue: [0], food: 0 },
// ] satisfies {
//   name: string;
//   hue: [number] | [number | number];
//   parent?: [number, number];
//   food: 0 | 1 | 2 | 3 | 4;
// }[];

export const variants = [
  [
    // ediblePack
    1,

    // hue 1
    0,
  ],

  [
    // ediblePack
    3,

    // hue 1
    0.23,
    // hue 2
    0.62,
  ],

  [
    // ediblePack
    2,

    // hue 1
    0.53,
    // hue 2
    0.22,
  ],
].map(([ediblePack, h1, h2], i) => {
  const edible = new Set<number>([ediblePack]);

  const colors: number[] = [];

  const out = [] as any as [number, number, number];

  hslToRgb(out, h1, 0.7, 0.61);
  colors.push(...out);

  hslToRgb(out, (h1 + 0.02) % 1, 0.73, 0.45);
  colors.push(...out);

  if (h2) {
    hslToRgb(out, (h2 + 0.4) % 1, 0.7, 0.61);
    colors.push(...out);
    hslToRgb(out, (h2 + 0.404) % 1, 0.73, 0.45);
    colors.push(...out);
  } else {
    colors.push(...colors);
  }

  hslToRgb(out, (h1 + 0.1) % 1, 1, 0.89);
  colors.push(...out);

  colors.push(
    //
    0.9,
    0.9,
    0.8,

    //
    0.4,
    0.4,
    0.5
  );

  return { edible, colors, variant_index: i };
});
