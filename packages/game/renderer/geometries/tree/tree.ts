import { createPyramidKernel, tesselateSphere } from "../model/sphere";
import { getFlatShadingNormals } from "../utils/flatShading";

export const createGeometry = () => {
  let positions = createPyramidKernel();
  positions = tesselateSphere(positions);
  positions = tesselateSphere(positions);

  for (let k = 0; k < positions.length; k += 3) {
    positions[k + 1] += 2;
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

  return {
    positions: new Float32Array(positions),
    normals,
    colorPattern,
    weights,
    boneIndexes,
  };
};
