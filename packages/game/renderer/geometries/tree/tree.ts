import { vec3 } from "gl-matrix";
import { createPyramidKernel, tesselateSphere } from "../model/sphere";
import { getFlatShadingNormals } from "../utils/flatShading";
import { tesselate } from "../utils/tesselate";
import { N_COLORS } from "./colorSchema";
import { computeWeights } from "./computeWeights";
import { TRUNK_BASE_HEIGHT, bindPose } from "./skeleton";

export const createGeometry = () => {
  let positions = createPyramidKernel(4);
  positions = tesselateSphere(positions);
  positions = tesselateSphere(positions);
  positions = tesselateSphere(positions);
  // positions = tesselateSphere(positions);
  // positions = tesselateSphere(positions);
  // positions = tesselateSphere(positions);
  // positions = tesselateSphere(positions);
  positions = tesselate(positions);
  // positions = tesselate(positions);

  const colorPattern = Array.from({ length: positions.length / 3 }, () => 0);

  //
  // create pattern of color
  // - pick a random point on the sphere
  // - select all faces for which the centroid is close to the point
  // - color this face

  // color schema
  // 0 1 2   base
  // 3 4 5   variants
  // 6       trunk
  {
    const o = vec3.create();
    const a = vec3.create();

    for (const r of [0.73, 0.42, 0.3])
      for (let k = 14; k--; ) {
        getRandomPointOnUnitSphere(o);

        const c = Math.floor(Math.random() * 6);

        for (let i = 0; i < positions.length / 3; i += 3) {
          vec3.set(
            a,
            (positions[(i + 0) * 3 + 0] +
              positions[(i + 1) * 3 + 0] +
              positions[(i + 2) * 3 + 0]) /
              3,
            (positions[(i + 0) * 3 + 1] +
              positions[(i + 1) * 3 + 1] +
              positions[(i + 2) * 3 + 1]) /
              3,
            (positions[(i + 0) * 3 + 2] +
              positions[(i + 1) * 3 + 2] +
              positions[(i + 2) * 3 + 2]) /
              3
          );

          if (vec3.sqrDist(a, o) < r * r) {
            let cc = c;

            if (c > 2) {
              if (colorPattern[i + 0] < 3) cc = colorPattern[i + 0] + 3;
              else cc = colorPattern[i + 0] - 3;
            }

            colorPattern[i + 0] = cc;
            colorPattern[i + 1] = cc;
            colorPattern[i + 2] = cc;
          }
        }
      }
  }

  for (let k = 0; k < positions.length; k += 3) {
    let y = positions[k + 1];

    const y0 = -0.3;
    if (y > y0) y = (y - y0) * 1.3 + y0;

    y += TRUNK_BASE_HEIGHT + 1;

    positions[k + 1] = y;
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

const getRandomPointOnUnitSphere = (out: vec3, random = Math.random) => {
  out[0] = random() * 2 - 1;
  out[1] = random() * 2 - 1;
  out[2] = random() * 2 - 1;
  const l = vec3.length(out);
  if (l > 1 || l < 0.0001) {
    getRandomPointOnUnitSphere(out, random);
  }
  vec3.scale(out, out, 1 / l);
};
