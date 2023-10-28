import { mat4, vec3 } from "gl-matrix";
import { pickMaxIndices } from "../../../utils/array";
import { setFromArray } from "../../../utils/vec3";

export const computeWeights = (bones: mat4[], positions: ArrayLike<number>) => {
  const boneIndexes: number[] = [];
  const weights: number[] = [];

  const bonePositions = bones.map((m) => mat4.getTranslation(vec3.create(), m));

  const p = [] as any as vec3;

  for (let i = 0; i < positions.length / 3; i++) {
    setFromArray(p, positions, i);

    const w = bonePositions.map((b, i) => {
      const d = vec3.distance(p, b) ** 4;

      return 1 / d;
    });

    const is = pickMaxIndices(w, 4);

    const sum = is.reduce((s, i) => s + w[i], 0);

    weights.push(...is.map((i) => w[i] / sum));
    boneIndexes.push(...is);
  }

  return { weights, boneIndexes };
};
