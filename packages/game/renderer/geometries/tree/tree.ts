import { createPyramidKernel, tesselateSphere } from "../model/sphere";
import { getFlatShadingNormals } from "../utils/flatShading";
import { tesselate } from "../utils/tesselate";
import { computeWeights } from "./computeWeights";
import { TRUNK_BASE_HEIGHT, bindPose } from "./skeleton";

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

    const y0 = -0.3;
    if (y > y0) y = (y - y0) * 1.3 + y0;

    y += TRUNK_BASE_HEIGHT + 1;

    positions[k + 1] = y;
  }

  const normals = getFlatShadingNormals(positions);

  const colorPattern = new Uint8Array(
    Array.from({ length: positions.length / 3 }, () => 0)
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
