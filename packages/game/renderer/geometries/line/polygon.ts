export const createPolygonLine = (
  n: number,
  l: number,
  h: number,
  y0: number,
  dy: number = 0,
  angle_offset = 0
) => {
  const positions: number[] = [];

  for (let i = n; i--; ) {
    const a = (i / n) * Math.PI * 2 + angle_offset;
    const b = ((i + 1) / n) * Math.PI * 2 + angle_offset;

    const ax = Math.cos(a);
    const ay = Math.sin(a);

    const bx = Math.cos(b);
    const by = Math.sin(b);

    // prettier-ignore
    positions.push(
        +ax * (l + h), y0 + dy, +ay * (l + h),
        +ax * (l + 0), y0 - dy, +ay * (l + 0),
        +bx * (l + 0), y0 - dy, +by * (l + 0),

        +ax * (l + h), y0 + dy, +ay * (l + h),
        +bx * (l + 0), y0 - dy, +by * (l + 0),
        +bx * (l + h), y0 + dy, +by * (l + h),

      
    );

    if (dy !== 0)
      // prettier-ignore
      positions.push(
        +ax * (l + h), y0 - dy, +ay * (l + h),
        +ax * (l + 0), y0 + dy, +ay * (l + 0),
        +bx * (l + 0), y0 + dy, +by * (l + 0),

        +ax * (l + h), y0 - dy, +ay * (l + h),
        +bx * (l + 0), y0 + dy, +by * (l + 0),
        +bx * (l + h), y0 - dy, +by * (l + h),
    );
  }

  return positions;
};
