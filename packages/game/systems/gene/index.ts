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

export const variants = [
  //
  { name: "crimson", hue: [0], food: 0 },
  { name: "coral", hue: [0], food: 0 },
  { name: "orchid", hue: [0], food: 0 },
  { name: "turquoise", hue: [0], food: 0 },
  { name: "fuchsia", hue: [0], food: 0 },
  { name: "lavender", hue: [0], food: 0 },
  { name: "mint", hue: [0], food: 0 },
  { name: "teal", hue: [0], food: 0 },
  { name: "tomato", hue: [0], food: 0 },
  { name: "gold", hue: [0], food: 0 },
] satisfies {
  name: string;
  hue: [number] | [number | number];
  parent?: [number, number];
  food: 0 | 1 | 2 | 3 | 4;
}[];
