import { vec3 } from "gl-matrix";
import { worldMatrix } from "../../../entities/camera";
import { MAX_FRUIT, fruits } from "../../../entities/fruits";
import { MAX_TREE, trees } from "../../../entities/trees";
import { MAX_TRICERATOPS, triceratops } from "../../../entities/triceratops";
import { setIntoArray } from "../../../utils/vec3";
import { gl } from "../../canvas";
import { getAttribLocation } from "../../utils/location";
import { createProgram } from "../../utils/program";
import codeFrag from "./shader.frag";
import codeVert from "./shader.vert";

export const MAX_SHADOW = MAX_FRUIT + MAX_TRICERATOPS + MAX_TREE;

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
const positions = new Float32Array(MAX_SHADOW * 3 * 3);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const a_position = getAttribLocation(gl, program, "a_position");
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

//
// normal
//
const texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(
    Array.from({ length: MAX_SHADOW }, () => [0, 0, 2, 0, 0, 2]).flat(),
  ),
  gl.STATIC_DRAW,
);
const a_texcoord = getAttribLocation(gl, program, "a_texcoord");
gl.enableVertexAttribArray(a_texcoord);
gl.vertexAttribPointer(a_texcoord, 2, gl.FLOAT, false, 0, 0);

//
gl.bindVertexArray(null);

const b = vec3.create();

let n_triangles = 0;

const updatePositionBuffer = () => {
  let j = 0;
  for (const fruit of fruits.values()) {
    const { p: p, size } = fruit;

    const l = size / 2;

    //
    //  (1)
    //   +
    //   |  \
    //   |     \
    //   +-------+
    //   |       |  \
    //   |       |     \
    //   +-------+-------+
    //  (0)             (2)

    vec3.set(b, p[0] - l, 0, p[2] - l);
    setIntoArray(positions, j * 3 + 0, b);

    vec3.set(b, p[0] - l, 0, p[2] + l * 3);
    setIntoArray(positions, j * 3 + 1, b);

    vec3.set(b, p[0] + l * 3, 0, p[2] - l);
    setIntoArray(positions, j * 3 + 2, b);

    j++;
  }

  for (const { position, radius } of trees.values()) {
    const l = radius * 0.7;

    //
    //  (1)
    //   +
    //   |  \
    //   |     \
    //   +-------+
    //   |       |  \
    //   |       |     \
    //   +-------+-------+
    //  (0)             (2)

    vec3.set(b, position[0] - l, 0, position[1] - l);
    setIntoArray(positions, j * 3 + 0, b);

    vec3.set(b, position[0] - l, 0, position[1] + l * 3);
    setIntoArray(positions, j * 3 + 1, b);

    vec3.set(b, position[0] + l * 3, 0, position[1] - l);
    setIntoArray(positions, j * 3 + 2, b);

    j++;
  }

  for (const tri of triceratops.values()) {
    const { o: origin, direction, size } = tri;

    const lx = 0.85 * size;
    const lz = 0.5 * size;

    //
    //  (1)
    //   +
    //   |  \
    //   |     \
    //   +-------+
    //   |       |  \
    //   |       |     \
    //   +-------+-------+
    //  (0)             (2)

    vec3.set(b, -lx + 0.12, 0, -lz);
    vec3.transformQuat(b, b, direction);
    b[0] += origin[0];
    b[2] += origin[2];
    setIntoArray(positions, j * 3 + 0, b);

    vec3.set(b, -lx + 0.12, 0, lz * 3);
    vec3.transformQuat(b, b, direction);
    b[0] += origin[0];
    b[2] += origin[2];
    setIntoArray(positions, j * 3 + 1, b);

    vec3.set(b, lx * 3 + 0.12, 0, -lz);
    vec3.transformQuat(b, b, direction);
    b[0] += origin[0];
    b[2] += origin[2];
    setIntoArray(positions, j * 3 + 2, b);

    j++;
  }

  n_triangles = j;
};

export const draw = () => {
  updatePositionBuffer();

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  gl.uniformMatrix4fv(u_matrix, false, worldMatrix);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  gl.disable(gl.DEPTH_TEST);

  gl.enable(gl.BLEND);
  gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, n_triangles * 3);

  if (n_triangles < MAX_SHADOW) gl.bindVertexArray(null);

  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
};
