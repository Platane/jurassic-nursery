import { vec3 } from "gl-matrix";

const ab: vec3 = [0, 0, 0];
const ac: vec3 = [0, 0, 0];
const a: vec3 = [0, 0, 0];
const b: vec3 = [0, 0, 0];
const c: vec3 = [0, 0, 0];
const n: vec3 = [0, 0, 0];

export const getFlatShadingNormals = (positions: ArrayLike<number>) => {
  const normals = new Float32Array(positions.length);

  for (let i = 0; i < positions.length / 3; i += 3) {
    const ak = (i + 0) * 3;
    const bk = (i + 1) * 3;
    const ck = (i + 2) * 3;

    vec3.set(a, positions[ak + 0], positions[ak + 1], positions[ak + 2]);
    vec3.set(b, positions[bk + 0], positions[bk + 1], positions[bk + 2]);
    vec3.set(c, positions[ck + 0], positions[ck + 1], positions[ck + 2]);

    vec3.subtract(ab, a, b);
    vec3.subtract(ac, a, c);

    vec3.cross(n, ab, ac);
    vec3.normalize(n, n);

    normals[ak + 0] = normals[bk + 0] = normals[ck + 0] = n[0];
    normals[ak + 1] = normals[bk + 1] = normals[ck + 1] = n[1];
    normals[ak + 2] = normals[bk + 2] = normals[ck + 2] = n[2];
  }

  return normals;
};
