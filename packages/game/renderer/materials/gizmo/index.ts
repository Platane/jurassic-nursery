import { gl } from "../../canvas";
import { worldMatrix } from "../../../entities/camera";
import { createProgram } from "../../utils/program";
import codeFrag from "./shader.frag";
import codeVert from "./shader.vert";

const program = createProgram(gl, codeVert, codeFrag);

//
// uniforms
//
const u_matrix = gl.getUniformLocation(program, "u_matrix");

//
// attributes
//

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

//
// position
//
var positionBuffer = gl.createBuffer();

const lll = 1;

const positions = [
  [0.0, lll, 0.0],
  [0.0, 0.0, lll],
  [0.0, 0.0, 0.0],

  [0.0, lll, 0.0],
  [lll, 0.0, 0.0],
  [0.0, 0.0, 0.0],

  [0.0, 0.0, lll],
  [lll, 0.0, 0.0],
  [0.0, 0.0, 0.0],
];

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(positions.flat()),
  gl.STATIC_DRAW
);
const a_position = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

//
// color
//
var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(
    [
      [0.0, 0.3, 0.5],
      [0.3, 0.5, 0],
      [0.3, 0, 0.5],
    ]
      .map((a) => Array.from({ length: 3 }, () => a.slice()))
      .flat(2)
  ),
  gl.STATIC_DRAW
);
const a_color = gl.getAttribLocation(program, "a_color");
gl.enableVertexAttribArray(a_color);
gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);

gl.bindVertexArray(null);

//
//

export const draw = () => {
  gl.useProgram(program);

  gl.bindVertexArray(vao);

  gl.uniformMatrix4fv(u_matrix, false, worldMatrix);

  gl.disable(gl.CULL_FACE);

  gl.drawArrays(gl.TRIANGLES, 0, positions.length);

  gl.bindVertexArray(null);
};
