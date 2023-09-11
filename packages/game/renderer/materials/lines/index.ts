import { gl } from "../../canvas";
import { worldMatrix } from "../../../entities/camera";
import { createProgram } from "../../utils/program";
import codeFrag from "./shader.frag";
import codeVert from "./shader.vert";
import { PLAYGROUND_SIZE } from "../../../systems";
import { createPolygonLine } from "../../geometries/line/polygon";
import { setFromArray } from "../../../utils/vec3";
import { quat, vec3 } from "gl-matrix";

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

const positions = createPolygonLine(4, PLAYGROUND_SIZE, 0.1, 0.2, 0.04);

const p = vec3.create();
const q = quat.create();
for (let k = 60; k--; ) {
  const a = Math.random() * Math.PI * 2;
  const x = (Math.random() - 0.5) * PLAYGROUND_SIZE * 3;
  const y = (Math.random() - 0.5) * PLAYGROUND_SIZE * 3;

  positions.push(
    ...createPolygonLine(5, Math.random() + 1, 0.02, 0, 0, a).map((v, i) => {
      if (i % 3 === 0) return v + x;
      if (i % 3 === 2) return v + y;
      return v;
    })
  );

  // const u = createPolygonLine(5, Math.random() + 1, 0.1, 0.2);

  // quat.fromEuler(q, 0, Math.random() * Math.PI, 0);

  // for (let i = 0; i < u.length; i += 3) {
  //   setFromArray(p, u, i);
  //   // vec3.transformQuat(p, p, q);
  //   // p[0] += x;
  //   // p[2] += y;
  //   // positions.push(...p);
  //   positions.push(...p);
  // }
}

console.log(positions.length / 3);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
const a_position = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

gl.bindVertexArray(null);

//
//

export const draw = () => {
  gl.useProgram(program);

  gl.bindVertexArray(vao);

  gl.uniformMatrix4fv(u_matrix, false, worldMatrix);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

  gl.bindVertexArray(null);
};
