import { render } from "../..";
import { gl } from "../../canvas";
import { normalTransformMatrix4, worldMatrix } from "../../entities/camera";
import { createProgram } from "../../utils/program";
import { createGeometry } from "./geometry";
import codeFrag from "./shader.frag";
import codeVert from "./shader.vert";

const program = createProgram(gl, codeVert, codeFrag);

//
// uniforms
//
const u_matrix = gl.getUniformLocation(program, "u_matrix");
const u_normalMatrix = gl.getUniformLocation(program, "u_normalMatrix");

//
// attributes
//

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

//
// position
//
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(), gl.STATIC_DRAW);
const a_position = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

//
// normal
//
var normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(), gl.STATIC_DRAW);
const a_normal = gl.getAttribLocation(program, "a_normal");
gl.enableVertexAttribArray(a_normal);
gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);

//
gl.bindVertexArray(null);

//
//

let nVertices = 0;

export const draw = () => {
  gl.useProgram(program);

  gl.uniformMatrix4fv(u_matrix, false, worldMatrix);
  gl.uniformMatrix4fv(u_normalMatrix, false, normalTransformMatrix4);

  gl.bindVertexArray(vao);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  gl.drawArrays(gl.TRIANGLES, 0, nVertices);

  gl.bindVertexArray(null);
};

createGeometry().then(({ positions, normals }) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.DYNAMIC_DRAW);

  nVertices = positions.length / 3;

  render();
});
