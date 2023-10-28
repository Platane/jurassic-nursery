import { mat4, quat, vec3 } from "gl-matrix";
import { MAX_ENTITY, N_BONES } from "../model/skeleton";
import { Tree, trees } from "../../../entities/trees";
import { gizmos } from "../../materials/gizmos";
import ParkMiller from "park-miller";

export const bonesMatrices = new Float32Array(16 * N_BONES * MAX_ENTITY);

const a = vec3.create();
const q = quat.create();
const m = mat4.create();

const updateBones = ([root, base, ...keys]: mat4[], tree: Tree) => {
  mat4.fromTranslation(root, [tree.position[0], 0, tree.position[1]]);
  mat4.fromTranslation(base, [tree.position[0], 0.4, tree.position[1]]);

  const pm = new ParkMiller(tree.seed);

  for (const m of keys) mat4.fromTranslation(m, [9999, 9999, 9999]);

  let i = 0;
  for (let [y, l] of [
    [0.8, 0.88],
    [1.5, 0.85],
    [1.95, 0.6],
  ]) {
    if (tree.seed) {
      y += pm.floatInRange(-0.1, 0.1);
    }

    for (let k = 4; k--; ) {
      //

      const bone = keys[i++];

      let phy = (k / 4) * Math.PI * 2 + y;
      let theta = 0;

      if (tree.seed) {
        phy += pm.floatInRange(-0.35, 0.35);
        theta = pm.floatInRange(-0.36, 0.36);
        l *= pm.floatInRange(0.85, 1.25);
      }

      a[0] = l;
      a[1] = 0;
      a[2] = 0;

      quat.fromEuler(q, 0, (phy / Math.PI) * 180, (theta / Math.PI) * 180);
      vec3.transformQuat(a, a, q);

      a[1] += y;

      mat4.fromRotationTranslation(bone, q, a);
      // mat4.fromTranslation(bone, a);
      mat4.multiply(bone, base, bone);
    }
  }
};

const ms = Array.from({ length: MAX_ENTITY }, (_, j) =>
  Array.from(
    { length: N_BONES },
    (_, i) =>
      new Float32Array(bonesMatrices.buffer, (j * N_BONES + i) * 16 * 4, 16)
  )
);

const gi = Array.from({ length: N_BONES }, () => mat4.create());
gizmos.push(...gi);

for (let i = MAX_ENTITY; i--; )
  for (let j = N_BONES; j--; ) mat4.identity(ms[i][j]);

export const bindPose = Array.from({ length: N_BONES }, mat4.create);

gizmos.push(...bindPose);

updateBones(bindPose, {
  position: [0, 0],
  seed: 0,
  direction: quat.create(),
} as Tree);

const bindPoseInv = bindPose.map((m) => mat4.invert(mat4.create(), m));

export const update = () => {
  // updateGizmo();

  let i = 0;
  for (const t of trees.values()) {
    updateBones(ms[i], t);

    if (i === 0) updateBones(gi, t);

    for (let j = N_BONES; j--; )
      mat4.multiply(ms[i][j], ms[i][j], bindPoseInv[j]);

    i++;
  }
};
