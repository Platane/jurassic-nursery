export const canvas: HTMLCanvasElement =
  document.getElementsByTagName("canvas")[0];

export const gl = canvas.getContext("webgl2")!;

export const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

export const onResize = () => {
  const w = window.innerWidth * dpr;
  const h = window.innerHeight * dpr;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gl.viewport(0, 0, w, h);
};
