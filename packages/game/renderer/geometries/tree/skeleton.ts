import { mat4, quat, vec3 } from "gl-matrix";
import { MAX_ENTITY, N_BONES } from "../model/skeleton";
import { Tree, trees } from "../../../entities/trees";

export const bonesMatrices = new Float32Array(16 * N_BONES * MAX_ENTITY);

const updateBones = (bones: mat4[], tree: Tree) => {
  mat4.fromTranslation(bones[0], [tree.position[0], 0, tree.position[1]]);
  mat4.copy(bones[1], bones[0]);
  mat4.copy(bones[2], bones[0]);
  mat4.copy(bones[3], bones[0]);
  mat4.copy(bones[4], bones[0]);

  for (const m of bones) mat4.identity(m);
};

const ms = Array.from({ length: MAX_ENTITY }, (_, j) =>
  Array.from(
    { length: N_BONES },
    (_, i) =>
      new Float32Array(bonesMatrices.buffer, (j * N_BONES + i) * 16 * 4, 16)
  )
);

for (let i = MAX_ENTITY; i--; )
  for (let j = N_BONES; j--; ) mat4.identity(ms[i][j]);

export const bindPose = Array.from({ length: N_BONES }, mat4.create);

updateBones(bindPose, { position: [0, 0] } as Tree);

const bindPoseInv = bindPose.map((m) => mat4.invert(mat4.create(), m));

export const update = () => {
  // updateGizmo();

  let i = 0;
  for (const t of trees.values()) {
    updateBones(ms[i], t);

    for (let j = N_BONES; j--; )
      mat4.multiply(ms[i][j], ms[i][j], bindPoseInv[j]);

    i++;
  }
};
