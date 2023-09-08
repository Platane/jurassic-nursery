export const isInsideTriangle = (
  ax: number,
  ay: number,

  bx: number,
  by: number,

  cx: number,
  cy: number,

  ox: number,
  oy: number
) =>
  side(ax, ay, bx, by, ox, oy) &&
  side(bx, by, cx, cy, ox, oy) &&
  side(cx, cy, ax, ay, ox, oy);

const side = (
  ax: number,
  ay: number,

  bx: number,
  by: number,

  ox: number,
  oy: number
) => {
  const nx = by - ay;
  const ny = -(bx - ax);

  const vx = ox - ax;
  const vy = oy - ay;

  return nx * vx + ny * vy >= 0;
};

/**
 * TODO
 * make it work
 */
export const intersectTriangle = (
  ax: number,
  ay: number,

  bx: number,
  by: number,

  ox: number,
  oy: number,

  vx: number,
  vy: number
) => {
  const hx = ox - ax;
  const hy = oy - ay;

  const dota = hx * vx + hy * vy;

  const ux = ox - bx;
  const uy = oy - by;

  const dotb = ux * vx + uy * vy;

  return dota <= 0 && dotb <= 0;
};
