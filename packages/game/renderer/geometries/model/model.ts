import { vec3 } from "gl-matrix";
import geometry_url from "../../../assets/geometry.bin";
import { getFlatShadingNormals } from "../utils/flatShading";
import { tesselate } from "../utils/tesselate";
import { computeWeights } from "./computeWeights";
import { bindPose } from "./skeleton";
import { UP } from "../../../utils/vec3";

export const SELECTED_BONE = 2;

const createGeometry = async () => {
  const buffer = await fetch(geometry_url).then((res) => res.arrayBuffer());

  let positions = new Float32Array(
    [...new Uint8Array(buffer)].map((x, i) => {
      x /= 256;

      if (i % 3 == 0) return (x - 0.5) * 2;
      if (i % 3 == 1) return x * 1;
      if (i % 3 == 2) return (x - 0.5) * 0.75;
      return 0;
    })
  );

  positions = tesselate(positions);
  // positions = tesselate(positions);
  // positions = tesselate(positions);

  const normals = getFlatShadingNormals(positions);

  const { weights, boneIndexes } = computeWeights(bindPose, positions);

  const colorPattern = new Uint8Array(
    Array.from({ length: positions.length / 3 }, (_, i) => {
      const p = new Float32Array(positions.buffer, i * 3 * 4, 3);
      const n = new Float32Array(normals.buffer, i * 3 * 4, 3);

      if (vec3.dot(n, UP) < -0.6 && p[1] < 0.48) return 1;
      return 0;
    })
  );

  return { positions, normals, colorPattern, weights, boneIndexes };
};

export const geometryPromise = createGeometry();
