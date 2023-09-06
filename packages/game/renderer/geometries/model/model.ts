import { mat4, quat, vec3 } from "gl-matrix";
import geometry_url from "../../../assets/geometry.bin";
import { getFlatShadingNormals } from "../utils/flatShading";
import { tesselate } from "../utils/tesselate";
import { computeWeights } from "./computeWeights";
import { bindPose } from "./skeleton";
import { UP, setFromArray, setIntoArray } from "../../../utils/vec3";
import { createPyramidKernel, tesselateSphere } from "./sphere";

export const SELECTED_BONE = 2;

const p = [] as any as vec3;
const n = [] as any as vec3;
const m = mat4.create();
const q = quat.create();

const createGeometry = async () => {
  const buffer = await fetch(geometry_url).then((res) => res.arrayBuffer());

  let positions = [...new Uint8Array(buffer)].map((x, i) => {
    x /= 256;

    if (i % 3 == 0) return (x - 0.5) * 2;
    if (i % 3 == 1) return x * 1;
    if (i % 3 == 2) return (x - 0.5) * 0.75;
    return 0;
  });

  positions = tesselate(positions);
  // positions = tesselate(positions);
  // positions = tesselate(positions);

  const { weights, boneIndexes } = computeWeights(bindPose, positions);

  const normals = getFlatShadingNormals(positions);

  const colorPattern = Array.from({ length: positions.length / 3 }, (_, i) => {
    setFromArray(p, positions, i);
    setFromArray(n, normals, i);

    if (vec3.dot(n, UP) < -0.6 && p[1] < 0.48) return 1;
    return 0;
  });

  ///
  /// eyes
  ///

  let eyesPositions = createPyramidKernel();
  eyesPositions = tesselateSphere(eyesPositions);

  for (let i = eyesPositions.length / 3; i--; ) {
    setFromArray(p, eyesPositions, i);
    vec3.scale(p, p, 0.07);
    p[0] += 0.72;
    p[1] += 0.7;
    p[2] += 0.13;
    setIntoArray(eyesPositions, i, p);
  }

  const eyesBoneIndexes = [
    ...Array.from({ length: eyesPositions.length / 3 }, () => [
      bindPose.length - 2,
      0,
      0,
      0,
    ]).flat(),
    ...Array.from({ length: eyesPositions.length / 3 }, () => [
      bindPose.length - 1,
      0,
      0,
      0,
    ]).flat(),
  ];

  const eyeColorPattern = Array.from(
    { length: eyesPositions.length / 3 },
    (_, i) =>
      i === 6 || i === 7 || i === 8 || i == 96 || i == 97 || i == 98 ? 3 : 2
  );
  eyeColorPattern.push(...eyeColorPattern);

  eyesPositions.push(
    ...eyesPositions.map((x, i) => (i % 3 === 2 ? x - 0.26 : x))
  );

  const eyesNormals = getFlatShadingNormals(eyesPositions);

  return {
    positions: new Float32Array([...positions, ...eyesPositions]),
    normals: new Float32Array([...normals, ...eyesNormals]),
    colorPattern: new Uint8Array([...colorPattern, ...eyeColorPattern]),
    weights: new Float32Array([
      ...weights,
      ...eyesPositions.map(() => [1, 0, 0, 0]).flat(),
    ]),
    boneIndexes: new Uint8Array([...boneIndexes, ...eyesBoneIndexes]),
  };
};

export const geometryPromise = createGeometry();
