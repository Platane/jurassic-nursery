import geometry_url from "../../../assets/geometry.bin";
import { getFlatShadingNormals } from "./flatShading";

export const createGeometry = async () => {
  const buffer = await fetch(geometry_url).then((res) => res.arrayBuffer());

  const positions = new Float32Array(buffer);

  const normals = getFlatShadingNormals(positions);

  return { positions, normals };
};
