import { mat4, vec3 } from "gl-matrix";
import { gizmos } from "../../materials/gizmos";

const n = 2;

export const bones = Array.from({ length: n }, () =>
  mat4.identity(mat4.create())
);

mat4.translate(bones[0], bones[0], [-3.5, -2, 0]);
mat4.translate(bones[1], bones[1], [3, -3, 0]);

//
// display bones
gizmos.push(...bones);

//
//
const bindPoseInv = bones.map((b) => mat4.invert(mat4.create(), b));

export const bonesMatrices = new Float32Array(16 * n);
const _bonesMatrices = Array.from(
  { length: n },
  (_, i) => new Float32Array(bonesMatrices.buffer, i * 4 * 16, 16)
);

export const update = () => {
  for (let i = 0; i < n; i++) {
    mat4.multiply(_bonesMatrices[i], bones[i], bindPoseInv[i]);
  }
};

export const computeWeights = (position: Float32Array) => {
  const boneIndexes: number[] = [];
  const weights: number[] = [];

  const bonePositions = bones.map((m) => mat4.getTranslation(vec3.create(), m));

  for (let i = 0; i < position.length / 3; i++) {
    const p = new Float32Array(position.buffer, i * 4 * 3, 3) as vec3;

    const distances = bonePositions.map((b) => vec3.distance(p, b) ** 2);

    const sum = distances.reduce((s, x) => s + x);

    weights.push(...distances.map((l) => 1 - l / sum), 0, 0);
    boneIndexes.push(0, 1, 0, 0);
  }

  return {
    weights: new Float32Array(weights),
    boneIndexes: new Uint8Array(boneIndexes),
  };
};
