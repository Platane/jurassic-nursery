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

export const variants = (
  [
    // 0 red
    [1, [0], undefined],

    // 1 beige
    [0, [0.1], undefined],

    // 2 light green
    [3, [0.41], undefined],

    // 3 beige - red
    [4, [0.1, 0.02], [0, 1]],

    // 4 beige- light green
    [2, [0.41, 0.11], [1, 2]],

    // 5 indigo
    [2, [0.75], [0, 4]],

    // 6 opal
    [3, [0.34], [2, 3]],

    // 7 red - indigo
    [4, [0, 0.75], [0, 5]],

    // 8 opal - indigo
    [1, [0.75, 0.35], [5, 6]],

    // 9 blue
    [0, [0.49], [4, 8]],

    // 10 blue - beige
    [2, [0.5, 0.1], [1, 9]],

    // 11 gold
    [3, [0.15], [7, 10]],
  ] satisfies [
    number,
    [number] | [number, number],
    [number, number] | undefined,
  ][]
).map(([ediblePack, [h1, h2], variant_parent], i) => {
  const edible = new Set<number>([ediblePack]);

  const colors: number[] = [];

  const out = [] as any as [number, number, number];

  hslToRgb(out, h1, 0.7, 0.61);
  colors.push(...out);

  hslToRgb(out, (h1 + 0.02) % 1, 0.73, 0.45);
  colors.push(...out);

  if (h2) {
    hslToRgb(out, h2, 0.7, 0.61);
    colors.push(...out);
    hslToRgb(out, (h2 + 0.02) % 1, 0.73, 0.45);
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

  return { edible, colors, variant_index: i, variant_parent };
});

export const getChildVariant = (va: number, vb: number) => {
  let v0 = Math.min(va, vb);
  let v1 = Math.max(va, vb);

  for (let k = variants.length; k--; ) {
    const variant = variants[k];

    if (
      variant.variant_parent &&
      variant.variant_parent[0] === v0 &&
      variant.variant_parent[1] === v1
    )
      return k;
  }

  if (Math.random() > 0.5) return va;
  else return vb;
};
