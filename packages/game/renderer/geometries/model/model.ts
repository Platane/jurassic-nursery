import { mat4, quat, vec3 } from "gl-matrix";
import geometry_url from "../../../assets/geometry.bin";
import { getFlatShadingNormals } from "../utils/flatShading";
import { tesselate } from "../utils/tesselate";
import { computeWeights } from "./computeWeights";
import { bindPose } from "./skeleton";
import { UP, setFromArray, setIntoArray } from "../../../utils/vec3";
import { createPyramidKernel, tesselateSphere } from "./sphere";
import { isInsideTriangle } from "../../../utils/triangle2d";

export const SELECTED_BONE = 2;

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

  const a = [] as any as vec3;
  const b = [] as any as vec3;
  const c = [] as any as vec3;
  const p = [] as any as vec3;
  const n = [] as any as vec3;
  const m = mat4.create();
  const q = quat.create();

  const colorPattern: number[] = Array.from(
    { length: positions.length / 3 },
    () => 0
  );

  //
  // this is really no smart
  const ux_default = (Math.random() - 0.5) * 1;

  const N_STRIPE = 6;
  const N_WIDTH = 25;
  const N_THICKNESS = 3;

  for (let j = N_STRIPE; j--; ) {
    const ox = (j / N_STRIPE - 0.5) * 2;
    const oz = 0;

    let ux = ux_default + (Math.random() - 0.5) * 0.1;
    let uz = 1;

    const l = Math.hypot(ux, uz);
    ux /= l;
    uz /= l;

    for (let w = N_WIDTH; w--; )
      for (let th = N_THICKNESS; th--; ) {
        const tw = (w / N_WIDTH - 0.5) * 1.4;
        const tt = (th / N_THICKNESS - 0.5) * 0.09;

        const x = ox + ux * tw + uz * tt;
        const z = oz + uz * tw - ux * tt;

        for (let i = 0; i < positions.length / 3; i += 3) {
          setFromArray(a, positions, i + 0);
          setFromArray(b, positions, i + 1);
          setFromArray(c, positions, i + 2);

          setFromArray(n, normals, i);

          if (
            a[1] > 0.5 &&
            b[1] > 0.5 &&
            c[1] > 0.5 &&
            isInsideTriangle(a[0], a[2], b[0], b[2], c[0], c[2], x, z) &&
            vec3.dot(n, UP) > 0.2
          ) {
            colorPattern[i + 0] = 2;
            colorPattern[i + 1] = 2;
            colorPattern[i + 2] = 2;
          }
        }
      }
  }

  for (let k = 80; k--; ) {
    const x = (Math.random() - 0.5) * 2;
    const z = (Math.random() - 0.5) * 0.75;

    for (let i = 0; i < positions.length / 3; i += 3) {
      setFromArray(a, positions, i + 0);
      setFromArray(b, positions, i + 1);
      setFromArray(c, positions, i + 2);

      setFromArray(n, normals, i);

      if (
        isInsideTriangle(a[0], a[2], b[0], b[2], c[0], c[2], x, z) &&
        vec3.dot(n, UP) > 0.2
      ) {
        const h = colorPattern[i + 0] === 2 ? 3 : 1;

        colorPattern[i + 0] = h;
        colorPattern[i + 1] = h;
        colorPattern[i + 2] = h;
      }
    }
  }

  for (let i = 0; i < positions.length / 3; i += 3) {
    setFromArray(n, normals, i);
    setFromArray(a, positions, i + 0);

    if (vec3.dot(n, UP) < -0.6 && a[1] < 0.48) {
      colorPattern[i + 0] = 4;
      colorPattern[i + 1] = 4;
      colorPattern[i + 2] = 4;
    }
  }

  ///
  /// eyes
  ///

  let eyesPositions = createPyramidKernel();
  eyesPositions = tesselateSphere(eyesPositions);

  for (let i = eyesPositions.length / 3; i--; ) {
    setFromArray(p, eyesPositions, i);
    vec3.scale(p, p, 0.075);
    p[0] += 0.705;
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
      i === 6 || i === 7 || i === 8 || i == 96 || i == 97 || i == 98 ? 6 : 5
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
