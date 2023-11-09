import { mat4, quat, vec3 } from "gl-matrix";
import { MAX_TREE, Tree, trees } from "../../../entities/trees";
import { gizmos } from "../../materials/gizmos";
import ParkMiller from "park-miller";

export const TRUNK_BASE_HEIGHT = 1;

const CIRCLES = [
  [0.45, 0.85, 3],
  [0.7, 0.96, 3],
  [0.75, 0.74, 3],
  [0.48, 0, 1],
];

export const N_BONES = CIRCLES.reduce((sum, [, , n]) => sum + n, 0) + 2;

export const bonesMatrices = new Float32Array(16 * N_BONES * MAX_TREE);

const a = vec3.create();
const q = quat.create();
const m = mat4.create();
const parent = mat4.create();

const updateTreeBones = ([root, base, ...keys]: mat4[], tree: Tree) => {
  const pm = new ParkMiller(tree.seed);

  a[0] = tree.position[0];
  a[1] = 0;
  a[2] = tree.position[1];
  mat4.fromTranslation(root, a);

  a[0] = 0;
  a[1] = tree.trunkHeight;
  a[2] = 0;
  mat4.fromTranslation(parent, a);
  mat4.fromQuat(m, tree.direction);
  mat4.multiply(parent, m, parent);
  mat4.multiply(parent, root, parent);

  mat4.copy(base, parent);

  let i = 0;
  for (let [dy, l, n] of CIRCLES) {
    a[0] = 0;
    a[1] = dy * tree.height;
    a[2] = 0;
    mat4.fromTranslation(m, a);
    mat4.multiply(parent, parent, m);
    mat4.fromQuat(m, tree.direction);
    mat4.multiply(parent, parent, m);

    for (let k = n; k--; ) {
      const bone = keys[i++];

      let phy = (k / n) * Math.PI * 2 + dy;
      let theta = 0;
      l *= tree.radius;

      if (tree.seed) {
        phy += pm.floatInRange(-0.35, 0.35);
        theta = pm.floatInRange(-0.36, 0.36);
        l *= pm.floatInRange(0.85, 1.15);
      }

      a[0] = l;
      a[1] = 0;
      a[2] = 0;

      quat.fromEuler(q, 0, (phy / Math.PI) * 180, (theta / Math.PI) * 180);
      vec3.transformQuat(a, a, q);

      mat4.fromRotationTranslation(bone, q, a);
      mat4.fromTranslation(bone, a);

      mat4.multiply(bone, parent, bone);
    }
  }
};

const ms = Array.from({ length: MAX_TREE }, (_, j) =>
  Array.from(
    { length: N_BONES },
    (_, i) =>
      new Float32Array(bonesMatrices.buffer, (j * N_BONES + i) * 16 * 4, 16)
  )
);

const gi = Array.from({ length: N_BONES }, () => mat4.create());
// gizmos.push(...gi);

for (let i = MAX_TREE; i--; )
  for (let j = N_BONES; j--; ) mat4.identity(ms[i][j]);

export const bindPose = Array.from({ length: N_BONES }, mat4.create);
// gizmos.push(...bindPose);

updateTreeBones(bindPose, {
  position: [0, 0],
  seed: 0,
  direction: quat.create(),
  id: 0,
  radius: 1,
  height: 1,
  trunkHeight: TRUNK_BASE_HEIGHT,
});

const bindPoseInv = bindPose.map((m) => mat4.invert(mat4.create(), m));

export const update = () => {
  let i = 0;
  for (const t of trees.values()) {
    updateTreeBones(ms[i], t);

    // update gizmos
    if (i === 0) updateTreeBones(gi, t);

    for (let j = N_BONES; j--; )
      mat4.multiply(ms[i][j], ms[i][j], bindPoseInv[j]);

    i++;
  }
};
