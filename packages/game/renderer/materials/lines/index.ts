import { gl } from "../../canvas";
import { worldMatrix } from "../../../entities/camera";
import { createProgram } from "../../utils/program";
import codeFrag from "./shader.frag";
import codeVert from "./shader.vert";
import { createPolygonLine } from "../../geometries/line/polygon";
import { isInsidePlayground } from "../../../systems/ia";
import { state } from "../../../ui/state";
import { isTriceratops } from "../../../entities/triceratops";
import { PLAYGROUND_SIZE, WANDERING_RADIUS } from "../../../systems/const";

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

const positions = createPolygonLine(
  4,
  PLAYGROUND_SIZE * 0.707,
  0.1,
  0.2,
  0.04,
  Math.PI / 4
);

const wanderingZone = createPolygonLine(50, WANDERING_RADIUS, 0.1, 0);

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
}

const positionFloat32 = new Float32Array(positions);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionFloat32, gl.STATIC_DRAW);
const a_position = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

gl.bindVertexArray(null);

//
//

let dragged = false;

export const draw = () => {
  gl.useProgram(program);

  gl.bindVertexArray(vao);

  gl.uniformMatrix4fv(u_matrix, false, worldMatrix);

  let n = positions.length / 3;

  if (
    isTriceratops(state.dragged) &&
    isInsidePlayground(state.dragged.origin[0], state.dragged.origin[2])
  ) {
    dragged = true;

    const x = state.dragged.origin[0];
    const y = state.dragged.origin[2];

    const ps = [
      ...positions,
      ...wanderingZone.map((v, i) => {
        if (i % 3 === 0) return v + x;
        if (i % 3 === 2) return v + y;
        return v;
      }),
    ];

    n = ps.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ps), gl.STATIC_DRAW);
  } else if (dragged) {
    dragged = false;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionFloat32, gl.STATIC_DRAW);
  }

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  gl.drawArrays(gl.TRIANGLES, 0, n);

  gl.bindVertexArray(null);
};
