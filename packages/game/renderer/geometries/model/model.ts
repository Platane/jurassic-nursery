import geometry_url from "../../../assets/geometry.bin";
import { hslToRgb } from "../../../utils/color";
import { getFlatShadingNormals } from "../utils/flatShading";
import "./skeleton";
import { computeWeights } from "./skeleton";

export const createGeometry = async () => {
  const buffer = await fetch(geometry_url).then((res) => res.arrayBuffer());

  let positions = new Float32Array(buffer);
  // positions = tesselate(positions);
  // positions = tesselate(positions);

  const normals = getFlatShadingNormals(positions);

  const c = Array.from({ length: positions.length / 3 }, () => {
    const out = [0, 0, 0] as [number, number, number];
    hslToRgb(out, Math.random(), 0.69, 0.48);

    return [out, out, out];
  }).flat(2);

  const colors = new Float32Array(c);

  const weights = computeWeights(positions);

  return { positions, weights, normals, colors };
};
