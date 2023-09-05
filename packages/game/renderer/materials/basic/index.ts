import { gl } from "../../canvas";
import { normalTransformMatrix4, worldMatrix } from "../../../entities/camera";
import { createProgram } from "../../utils/program";
import codeFrag from "./shader.frag";
import codeVert from "./shader.vert";
import { geometryPromise } from "../../geometries/model/model";
import {
  bonesMatrices,
  update as updateBoneMatrices,
} from "../../geometries/model/skeleton";

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
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(), gl.STATIC_DRAW);
const a_position = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

//
// normal
//
const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(), gl.STATIC_DRAW);
const a_normal = gl.getAttribLocation(program, "a_normal");
gl.enableVertexAttribArray(a_normal);
gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);

//
// color
//
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(), gl.STATIC_DRAW);
const a_color = gl.getAttribLocation(program, "a_color");
gl.enableVertexAttribArray(a_color);
gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);

//
// weight
//
const weightsBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, weightsBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(), gl.STATIC_DRAW);
const a_weights = gl.getAttribLocation(program, "a_weights");
gl.enableVertexAttribArray(a_weights);
gl.vertexAttribPointer(a_weights, 4, gl.FLOAT, false, 0, 0);

//
// weight
//
const boneIndexesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, boneIndexesBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(), gl.STATIC_DRAW);
const a_boneIndexes = gl.getAttribLocation(program, "a_boneIndexes");
gl.enableVertexAttribArray(a_boneIndexes);
gl.vertexAttribIPointer(a_boneIndexes, 4, gl.UNSIGNED_BYTE, 0, 0);

//
// bone matrices
//
const boneMatrixTexture = gl.createTexture();
// use texture unit 0
gl.activeTexture(gl.TEXTURE0 + 0);

gl.bindTexture(gl.TEXTURE_2D, boneMatrixTexture);
// since we want to use the texture for pure data we turn
// off filtering
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

//
gl.bindVertexArray(null);

//
//

let nVertices = 0;

export const draw = () => {
  gl.useProgram(program);

  gl.uniformMatrix4fv(u_matrix, false, worldMatrix);
  gl.uniformMatrix4fv(u_normalMatrix, false, normalTransformMatrix4);

  // update the texture with the current matrices

  updateBoneMatrices();

  gl.bindTexture(gl.TEXTURE_2D, boneMatrixTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0, // level
    gl.RGBA32F, // internal format
    4, // width 4 pixels, each pixel has RGBA so 4 pixels is 16 values
    bonesMatrices.length / 16, // one row per bone
    0, // border
    gl.RGBA, // format
    gl.FLOAT, // type
    bonesMatrices
  );

  gl.bindVertexArray(vao);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  const wireframe = !!false;
  if (wireframe) gl.drawArrays(gl.LINE_LOOP, 0, nVertices);
  else gl.drawArrays(gl.TRIANGLES, 0, nVertices);

  gl.bindVertexArray(null);
};

geometryPromise.then(({ positions, normals, colors, weights, boneIndexes }) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, weightsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, weights, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, boneIndexesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, boneIndexes, gl.STATIC_DRAW);

  nVertices = positions.length / 3;
});
