import { createPyramidKernel, tesselateSphere } from "../model/sphere";
import { getFlatShadingNormals } from "../utils/flatShading";
import { tesselate } from "../utils/tesselate";
import { computeWeights } from "./computeWeights";
import { bindPose } from "./skeleton";

export const createGeometry = () => {
  let positions = createPyramidKernel();
  positions = tesselateSphere(positions);
  positions = tesselateSphere(positions);
  positions = tesselateSphere(positions);
  // positions = tesselateSphere(positions);
  // positions = tesselateSphere(positions);
  // positions = tesselate(positions);
  // positions = tesselate(positions);

  for (let k = 0; k < positions.length; k += 3) {
    let y = positions[k + 1];

    if (y > 0) y = y * 1.5;

    y += 1.4;

    positions[k + 1] = y;
  }

  const normals = getFlatShadingNormals(positions);

  const colorPattern = new Uint8Array(
    Array.from({ length: positions.length / 3 }, () => 0)
  );
  const weights = new Float32Array(
    Array.from({ length: positions.length / 3 }, () => [1, 0, 0, 0]).flat()
  );
  const boneIndexes = new Uint8Array(
    Array.from({ length: positions.length / 3 }, () => [0, 0, 0, 0]).flat()
  );

  const w = computeWeights(bindPose, positions);

  return {
    positions: new Float32Array(positions),
    normals,
    colorPattern,
    boneIndexes: new Uint8Array(w.boneIndexes),
    weights: new Float32Array(w.weights),
  };
};
