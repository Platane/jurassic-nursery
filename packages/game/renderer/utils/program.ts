/**
 * create a program from vertex and fragment shader sources
 */
export const createProgram = (
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
): WebGLProgram => {
  const vertShader = initShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragShader = initShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

  const shaderProgram = gl.createProgram() as WebGLProgram;
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);

  gl.linkProgram(shaderProgram);

  if (
    process.env.NODE_ENV !== "production" &&
    !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)
  )
    throw "Unable to initialize the shader program.";

  return shaderProgram;
};

const initShader = (
  gl: WebGLRenderingContext,
  sourceCode: string,
  shaderType: number
): WebGLShader => {
  const shader = gl.createShader(shaderType)!;

  gl.shaderSource(shader, sourceCode);

  gl.compileShader(shader);

  // See if it compiled successfully
  if (
    process.env.NODE_ENV !== "production" &&
    !gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  )
    throw (
      "An error occurred compiling the shaders: \n" +
      (gl.getShaderInfoLog(shader) || "") +
      "\n" +
      sourceCode
    );

  return shader;
};
