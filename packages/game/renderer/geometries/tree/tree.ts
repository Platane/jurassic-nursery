import { createPyramidKernel, tesselateSphere } from "../model/sphere";
import { getFlatShadingNormals } from "../utils/flatShading";
import { tesselate } from "../utils/tesselate";
import { N_COLORS } from "./colorSchema";
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

  const colorPattern = Array.from({ length: positions.length / 3 }, () => 0);
  {
    for (let i = 0; i < colorPattern.length; i += 3) {
      const c = Math.floor(Math.random() * (N_COLORS - 1));
      colorPattern[i + 0] = c;
      colorPattern[i + 1] = c;
      colorPattern[i + 2] = c;
    }
  }

  // trunk
  {
    const trunkColor = N_COLORS - 1;
    const N = 6;
    const h = TRUNK_BASE_HEIGHT + 0.03;
    const r = 0.2;
    for (let k = N; k--; ) {
      const a1 = (k / N) * Math.PI * 2;
      const a2 = ((k + 1) / N) * Math.PI * 2;

      const x1 = Math.cos(a1) * r;
      const y1 = Math.sin(a1) * r;
      const x2 = Math.cos(a2) * r;
      const y2 = Math.sin(a2) * r;

      // prettier-ignore
      positions.push(
        
        x1,0,y1,
        x2,h,y2,
        x2,0,y2,

        x1,h,y1,
        x2,h,y2,
        x1,0,y1,
        
      );
      colorPattern.push(
        trunkColor,
        trunkColor,
        trunkColor,

        trunkColor,
        trunkColor,
        trunkColor
      );
    }
  }

  const w = computeWeights(bindPose, positions);

  return {
    positions: new Float32Array(positions),
    normals: getFlatShadingNormals(positions),
    colorPattern: new Uint8Array(colorPattern),
    boneIndexes: new Uint8Array(w.boneIndexes),
    weights: new Float32Array(w.weights),
  };
};
