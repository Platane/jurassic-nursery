import geometry_url from "../../../assets/geometry.bin";
import { hslToRgb } from "../../../utils/color";
import { getFlatShadingNormals } from "../utils/flatShading";
import { tesselate } from "../utils/tesselate";
import { computeWeights } from "./skeleton";

export const createGeometry = async () => {
  const buffer = await fetch(geometry_url).then((res) => res.arrayBuffer());

  let positions = new Float32Array(
    [...new Uint16Array(buffer)]
      .map((x, i) => {
        x /= 256 * 256;

        if (i % 3 == 0) return (x - 0.67) * 2;
        if (i % 3 == 1) return x * 1;
        if (i % 3 == 2) return (x - 0.5) * 0.75;
        return 0;
      })
      .map((x) => x * 16)
  );

  // positions = tesselate(positions);
  // positions = tesselate(positions);
  // positions = tesselate(positions);

  const normals = getFlatShadingNormals(positions);

  const c = Array.from({ length: positions.length / 3 }, () => {
    const out = [0, 0, 0] as [number, number, number];
    hslToRgb(out, Math.random(), 0.69, 0.48);

    return [out, out, out];
  }).flat(2);

  const colors = new Float32Array(c);

  return { positions, normals, colors, ...computeWeights(positions) };
};
