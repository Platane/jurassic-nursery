import { mat4, vec3 } from "gl-matrix";
import { pickMaxIndices } from "../../../utils/array";

export const computeWeights = (bones: mat4[], position: Float32Array) => {
  const boneIndexes: number[] = [];
  const weights: number[] = [];

  const bonePositions = bones.map((m) => mat4.getTranslation(vec3.create(), m));

  for (let i = 0; i < position.length / 3; i++) {
    const p = new Float32Array(position.buffer, i * 4 * 3, 3) as vec3;

    const w = bonePositions.map((b, i) => {
      const d = vec3.distance(p, b) ** 4;

      return 1 / d + (i === 0 ? 0.1 : 0);
    });

    const is = pickMaxIndices(w, 4);

    const sum = is.reduce((s, i) => s + w[i], 0);

    weights.push(...is.map((i) => w[i] / sum));
    boneIndexes.push(...is);
  }

  return {
    weights: new Float32Array(weights),
    boneIndexes: new Uint8Array(boneIndexes),
  };
};
