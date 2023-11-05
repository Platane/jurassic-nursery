import { worldMatrix as viewMatrix } from "../../../entities/camera";
import { trees } from "../../../entities/trees";
import { gl } from "../../canvas";
import { N_COLORS } from "../../geometries/model/colorSchema";
import { MAX_ENTITY, N_BONES } from "../../geometries/model/skeleton";
import { colorSchema } from "../../geometries/tree/colorSchema";
import {
  bonesMatrices,
  update as updateBoneMatrices,
} from "../../geometries/tree/skeleton";
import { createGeometry as createTreeGeometry } from "../../geometries/tree/tree";
import { getAttribLocation, getUniformLocation } from "../../utils/location";
import { createProgram } from "../../utils/program";
import codeFrag from "../skinnedMesh/shader.frag";
import codeVert from "../skinnedMesh/shader.vert";

const program = createProgram(gl, codeVert, codeFrag);

//
// uniforms
//
const u_viewMatrix = gl.getUniformLocation(program, "u_viewMatrix");

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
const a_position = getAttribLocation(gl, program, "a_position");
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

//
// normal
//
const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
const a_normal = getAttribLocation(gl, program, "a_normal");
gl.enableVertexAttribArray(a_normal);
gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);

//
// color pattern
//
const colorPatternBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorPatternBuffer);
const a_colorPattern = getAttribLocation(gl, program, "a_colorPattern");
gl.enableVertexAttribArray(a_colorPattern);
gl.vertexAttribIPointer(a_colorPattern, 1, gl.UNSIGNED_BYTE, 0, 0);

//
// weight
//
const weightsBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, weightsBuffer);
const a_weights = getAttribLocation(gl, program, "a_weights");
gl.enableVertexAttribArray(a_weights);
gl.vertexAttribPointer(a_weights, 4, gl.FLOAT, false, 0, 0);

//
// bone indexes
//
const boneIndexesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, boneIndexesBuffer);
const a_boneIndexes = getAttribLocation(gl, program, "a_boneIndexes");
gl.enableVertexAttribArray(a_boneIndexes);
gl.vertexAttribIPointer(a_boneIndexes, 4, gl.UNSIGNED_BYTE, 0, 0);

//
// entity index
//
const entityIndexBuffer = gl.createBuffer();
const entityIndex = new Uint8Array(
  Array.from({ length: MAX_ENTITY }, (_, i) => i),
);
gl.bindBuffer(gl.ARRAY_BUFFER, entityIndexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, entityIndex, gl.STATIC_DRAW);
const a_entityIndex = getAttribLocation(gl, program, "a_entityIndex");
gl.enableVertexAttribArray(a_entityIndex);
gl.vertexAttribIPointer(a_entityIndex, 1, gl.UNSIGNED_BYTE, 0, 0);
gl.vertexAttribDivisor(a_entityIndex, 1);

//
// bone matrices
//
const boneMatrixTexture = gl.createTexture();
const u_boneMatrixTexture = getUniformLocation(
  gl,
  program,
  "u_boneMatrixTexture",
);
// use texture unit 2
gl.activeTexture(gl.TEXTURE0 + 3);
gl.bindTexture(gl.TEXTURE_2D, boneMatrixTexture);
// since we want to use the texture for pure data we turn
// off filtering
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

//
// color schema
//
const colorSchemaTexture = gl.createTexture();
const u_colorSchemaTexture = getUniformLocation(
  gl,
  program,
  "u_colorSchemaTexture",
);
// use texture unit 3
gl.activeTexture(gl.TEXTURE0 + 4);
gl.bindTexture(gl.TEXTURE_2D, colorSchemaTexture);
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

  gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);

  // update the texture with the current matrices
  updateBoneMatrices();

  gl.bindTexture(gl.TEXTURE_2D, boneMatrixTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0, // level
    gl.RGBA32F, // internal format
    4 * N_BONES, // 4 pixels, each pixel has RGBA so 4 pixels is 16 values ( = one matrix ). one row contains all bones
    MAX_ENTITY, // one row per entity
    0, // border
    gl.RGBA, // format
    gl.FLOAT, // type
    bonesMatrices,
  );
  gl.uniform1i(u_boneMatrixTexture, 3);

  gl.uniform1i(u_colorSchemaTexture, 4);

  gl.bindVertexArray(vao);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  // gl.drawArraysInstanced(gl.LINE_LOOP, 0, nVertices, triceratops.length);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, nVertices, trees.size);

  gl.bindVertexArray(null);
};

{
  const { positions, normals, colorPattern, weights, boneIndexes } =
    createTreeGeometry();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorPatternBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colorPattern, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, weightsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, weights, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, boneIndexesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, boneIndexes, gl.STATIC_DRAW);

  gl.bindTexture(gl.TEXTURE_2D, colorSchemaTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0, // level
    gl.RGB32F, // internal format
    N_COLORS,
    MAX_ENTITY, // one row per entity
    0, // border
    gl.RGB, // format
    gl.FLOAT, // type
    colorSchema,
  );

  nVertices = positions.length / 3;
}
