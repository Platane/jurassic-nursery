import { vec3 } from "gl-matrix";
import { tesselate } from "../utils/tesselate";
import { setFromArray, setIntoArray } from "../../../utils/vec3";

/**
 * create the primitive of a recursive sphere
 * some kind of double pyramid
 *
 * returns an array of oriented faces
 */
export const createPyramidKernel = (n = 5) => {
  const positions: number[] = [];

  const a = [0, 0, 0] as vec3;
  const b = [0, 0, 0] as vec3;

  for (let i = n; i--; ) {
    a[0] = Math.cos((i / n) * Math.PI * 2);
    a[2] = Math.sin((i / n) * Math.PI * 2);

    b[0] = Math.cos(((i + 1) / n) * Math.PI * 2);
    b[2] = Math.sin(((i + 1) / n) * Math.PI * 2);

    // prettier-ignore
    positions.push(
        ...a, 0, 1, 0, ...b, 
        
        0, -1, 0, ...a, ...b
    );
  }

  return positions;
};

const p = [] as any as vec3;

export const tesselateSphere = (positions: number[]) => {
  positions = tesselate(positions);

  for (let i = positions.length / 3; i--; ) {
    setFromArray(p, positions, i);
    vec3.normalize(p, p);
    setIntoArray(positions as any, i, p);
  }

  return positions;
};
