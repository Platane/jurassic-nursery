import { vec3 } from "gl-matrix";
import { setFromArray } from "../../../utils/vec3";

/**
 * tesselate each face into 4 faces, in a triforce fashion
 */
export const tesselate = (positions: ArrayLike<number>) => {
  const p: number[] = [];

  const a = [] as any as vec3;
  const b = [] as any as vec3;
  const c = [] as any as vec3;
  const m_ab = [] as any as vec3;
  const m_bc = [] as any as vec3;
  const m_ca = [] as any as vec3;

  for (let i = 0; i < positions.length; i += 3 * 3) {
    setFromArray(a, positions, i / 3 + 0);
    setFromArray(b, positions, i / 3 + 1);
    setFromArray(c, positions, i / 3 + 2);

    vec3.lerp(m_ab, a, b, 0.5);
    vec3.lerp(m_bc, b, c, 0.5);
    vec3.lerp(m_ca, c, a, 0.5);

    // biome-ignore format:
    p.push(
      ...a, ...m_ab, ...m_ca,
      ...m_ab, ...b, ...m_bc,
      ...m_bc, ...c, ...m_ca,
      ...m_ca, ...m_ab, ...m_bc
    )
  }

  return p;
};
