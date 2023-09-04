import { mat4, quat, vec3 } from "gl-matrix";
import { gizmos } from "../../materials/gizmos";

export const origin = [0, 0, 0] as vec3;

export const direction = quat.create();

export const tail_direction = quat.create();
export const head_direction = quat.create();

export const feet = [0, 0, 0, 0];

const bones = [
  // main
  mat4.create(),

  // tail
  mat4.create(),
  mat4.create(),
  mat4.create(),

  // head
  mat4.create(),
  mat4.create(),

  // feet
  mat4.create(),
  mat4.create(),
  mat4.create(),
  mat4.create(),
];

const a = vec3.create();
const q = quat.create();
const m = mat4.create();
const updateBones = () => {
  const [main, tail1, tail2, tail3, head1, head2, leg0, foot0, leg1, foot1] =
    bones;

  // main
  vec3.set(a, 0, 0.6, 0);
  mat4.fromRotationTranslation(main, direction, a);

  // // tail
  vec3.set(a, -0.3, -0.02, 0);
  mat4.fromTranslation(tail1, a);
  mat4.fromQuat(m, tail_direction);
  mat4.multiply(tail1, tail1, m);
  mat4.multiply(tail1, tail1, main);

  vec3.set(a, -0.3, -0.1, 0);
  mat4.fromRotationTranslation(tail2, tail_direction, a);
  mat4.multiply(tail2, tail2, tail1);

  vec3.set(a, -0.34, -0.05, 0);
  mat4.fromRotationTranslation(tail3, tail_direction, a);
  mat4.multiply(tail3, tail3, tail2);

  // head
  vec3.set(a, 0.43, -0.04, 0);
  mat4.fromRotationTranslation(head1, head_direction, a);
  mat4.multiply(head1, head1, main);

  vec3.set(a, 0.4, -0.14, 0);
  mat4.fromRotationTranslation(head2, head_direction, a);
  mat4.multiply(head2, head2, head1);

  // feet

  // 1
  vec3.set(a, -0.12, -0.12, 0.2);
  quat.fromEuler(q, 0, feet[0] * 6, 0);
  vec3.transformQuat(a, a, q);
  mat4.fromRotationTranslation(leg0, q, a);
  mat4.multiply(leg0, head1, leg0);

  vec3.set(a, 0.05, -0.42, 0.02);
  quat.fromEuler(q, 0, 0, feet[0] * 30);
  vec3.transformQuat(a, a, q);
  quat.fromEuler(q, 0, 0, feet[0] * 14);
  mat4.fromRotationTranslation(foot0, q, a);
  mat4.multiply(foot0, leg0, foot0);

  // 2
  vec3.set(a, -0.12, -0.12, -0.2);
  quat.fromEuler(q, 0, feet[1] * 6, 0);
  vec3.transformQuat(a, a, q);
  mat4.fromRotationTranslation(leg1, q, a);
  mat4.multiply(leg1, head1, leg1);

  vec3.set(a, 0.05, -0.42, -0.02);
  quat.fromEuler(q, 0, 0, feet[1] * 30);
  vec3.transformQuat(a, a, q);
  quat.fromEuler(q, 0, 0, feet[1] * 14);
  mat4.fromRotationTranslation(foot1, q, a);
  mat4.multiply(foot1, leg1, foot1);
};

updateBones();

//
// display bones
gizmos.push(...bones);

//
//
const bindPoseInv = bones.map((m) => mat4.invert(mat4.create(), m));

export const bonesMatrices = new Float32Array(16 * bones.length);
const _bonesMatrices = bones.map(
  (_, i) => new Float32Array(bonesMatrices.buffer, i * 4 * 16, 16)
);

export const update = () => {
  updateBones();
  for (let i = 0; i < bones.length; i++) {
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

    const is = pickMinIndices(distances, 4).sort();

    const sum = is.reduce((s, i) => s + distances[i]);

    weights.push(...is.map((i) => 1 - distances[i] / sum));
    boneIndexes.push(...is);
  }

  return {
    weights: new Float32Array(weights),
    boneIndexes: new Uint8Array(boneIndexes),
  };
};

/**
 * pick the first n minimal indexes
 */
const pickMinIndices = (arr: number[], n: number) => {
  const min_is = Array.from({ length: Math.min(arr.length, n) }, (_, i) => i);
  min_is.sort((a, b) => arr[b] - arr[a]);

  for (let i = n; i < arr.length; i++) {
    if (arr[min_is[0]] > arr[i]) {
      min_is[0] = i;
      min_is.sort((a, b) => arr[b] - arr[a]);
    }
  }

  return min_is;
};
