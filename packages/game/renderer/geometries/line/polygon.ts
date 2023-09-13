export const createPolygonLine = (
  n: number,
  l: number,
  h: number,
  y0: number,
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
        +ax * (l + h), y0 , +ay * (l + h),
        +ax * (l + 0), y0 , +ay * (l + 0),
        +bx * (l + 0), y0 , +by * (l + 0),

        +ax * (l + h), y0 , +ay * (l + h),
        +bx * (l + 0), y0 , +by * (l + 0),
        +bx * (l + h), y0 , +by * (l + h),

      
    );
  }

  return positions;
};
