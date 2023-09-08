export const getAttribLocation = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string
) => {
  const position = gl.getAttribLocation(program, name);

  if (process.env.NODE_ENV !== "production" && position === -1)
    // throw `Unable to localize ${name}.`;
    console.warn(`Unable to localize ${name}.`);

  return position;
};

export const getUniformLocation = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string
) => {
  const position = gl.getUniformLocation(program, name);

  if (process.env.NODE_ENV !== "production" && position === -1)
    // throw `Unable to localize ${name}.`;
    console.warn(`Unable to localize ${name}.`);

  return position;
};
