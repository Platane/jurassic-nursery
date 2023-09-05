import { mat4, quat, vec3 } from "gl-matrix";
import { gizmos } from "../../materials/gizmos";
import { pickMaxIndices } from "../../../utils/array";

export const origin = [0, 0, 0] as vec3;

export const direction = quat.create();

export const tail_direction = quat.create();
export const head_direction = quat.create();

export const feet = [0, 0, 0, 0];

export const SELECTED_BONE = 10;

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
  mat4.create(),
  mat4.create(),
  mat4.create(),
  mat4.create(),
];

let pose0 = 0;

const a = vec3.create();
const q = quat.create();
const m = mat4.create();
const updateBones = () => {
  const [
    main,
    tail1,
    tail2,
    tail3,
    head1,
    head2,
    leg0,
    foot0,
    leg1,
    foot1,
    leg2,
    foot2,
    leg3,
    foot3,
  ] = bones;

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

  // 0
  vec3.set(a, -0.12, -0.18, 0.2);
  quat.fromEuler(q, 0, feet[0] * 13, feet[0] * 20);
  vec3.transformQuat(a, a, q);
  mat4.fromRotationTranslation(leg0, q, a);
  mat4.multiply(leg0, head1, leg0);

  vec3.set(a, 0.05, -0.34, 0.02);
  quat.fromEuler(q, 0, 0, feet[0] * 45);
  vec3.transformQuat(a, a, q);
  quat.fromEuler(q, 0, 0, feet[0] * 40);
  mat4.fromRotationTranslation(foot0, q, a);
  mat4.multiply(foot0, leg0, foot0);

  // 1
  vec3.set(a, -0.12, -0.18, -0.2);
  quat.fromEuler(q, 0, feet[1] * 13, feet[1] * 20);
  vec3.transformQuat(a, a, q);
  mat4.fromRotationTranslation(leg1, q, a);
  mat4.multiply(leg1, head1, leg1);

  vec3.set(a, 0.05, -0.34, -0.02);
  quat.fromEuler(q, 0, 0, feet[1] * 45);
  vec3.transformQuat(a, a, q);
  quat.fromEuler(q, 0, 0, feet[1] * 40);
  mat4.fromRotationTranslation(foot1, q, a);
  mat4.multiply(foot1, leg1, foot1);

  // 2
  vec3.set(a, 0, 0, 0.2);
  quat.fromEuler(q, 0, feet[2] * 13, feet[2] * 23);
  vec3.transformQuat(a, a, q);
  a[0] += 0.06;
  a[1] -= 0.2;
  mat4.fromRotationTranslation(leg2, q, a);
  mat4.multiply(leg2, tail1, leg2);

  vec3.set(a, -0.02, -0.38, 0.06);
  quat.fromEuler(q, 0, 0, feet[2] * 40);
  vec3.transformQuat(a, a, q);
  quat.fromEuler(q, 0, 0, feet[2] * 35);
  mat4.fromRotationTranslation(foot2, q, a);
  mat4.multiply(foot2, leg2, foot2);

  // // 3
  vec3.set(a, 0, 0, -0.2);
  quat.fromEuler(q, 0, feet[3] * 13, feet[3] * 23);
  vec3.transformQuat(a, a, q);
  a[0] += 0.06;
  a[1] -= 0.2;
  mat4.fromRotationTranslation(leg3, q, a);
  mat4.multiply(leg3, tail1, leg3);

  vec3.set(a, -0.02, -0.38, -0.07);
  quat.fromEuler(q, 0, 0, feet[3] * 40);
  vec3.transformQuat(a, a, q);
  quat.fromEuler(q, 0, 0, feet[3] * 35);
  mat4.fromRotationTranslation(foot3, q, a);
  mat4.multiply(foot3, leg3, foot3);

  //
  //
  //

  if (pose0++ > 10 && false) {
    const v = (1 + Math.sin(pose0 * 0.03)) * 0.5;
    vec3.set(a, 0, 0, v);
    mat4.fromTranslation(m, a);
    mat4.multiply(bones[SELECTED_BONE], bones[SELECTED_BONE], m);
    bones[SELECTED_BONE];
  }
};

updateBones();

//
// display bones
gizmos.push(
  ...bones
  // bones[SELECTED_BONE]
);

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
