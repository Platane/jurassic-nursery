import { vec3 } from "gl-matrix";

/**
 * tesselate each face into 4 faces, in a triforce fashion
 */
export const tesselate = (positions: Float32Array) => {
  const p: number[] = [];

  for (let i = 0; i < positions.length; i += 3 * 3) {
    const a = positions.slice(i, i + 3);
    const b = positions.slice(i + 3, i + 6);
    const c = positions.slice(i + 6, i + 9);

    const m_ab = vec3.lerp([] as any, a, b, 0.5);
    const m_bc = vec3.lerp([] as any, b, c, 0.5);
    const m_ca = vec3.lerp([] as any, c, a, 0.5);

    p.push(...a, ...m_ab, ...m_ca);
    p.push(...m_ab, ...b, ...m_bc);
    p.push(...m_bc, ...c, ...m_ca);
    p.push(...m_ca, ...m_ab, ...m_bc);
  }

  return new Float32Array(p);
};
