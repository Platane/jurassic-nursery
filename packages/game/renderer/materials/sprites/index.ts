import { vec3 } from "gl-matrix";
import { eye, worldMatrix as viewMatrix } from "../../../entities/camera";
import { MAX_FRUIT, fruits } from "../../../entities/fruits";
import { Sprite, triceratopsParticles } from "../../../entities/particles";
import { setIntoArrayValues } from "../../../utils/vec3";
import { canvas, gl } from "../../canvas";
import { getAttribLocation, getUniformLocation } from "../../utils/location";
import { createProgram } from "../../utils/program";
import codeFrag from "./shader.frag";
import codeVert from "./shader.vert";
import { N_SPRITES, billboardCanvas } from "./textureAtlas";

const program = createProgram(gl, codeVert, codeFrag);

//
// uniforms
//
const u_texture = getUniformLocation(gl, program, "u_texture");

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
const texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
const a_texcoord = getAttribLocation(gl, program, "a_texcoord");
gl.enableVertexAttribArray(a_texcoord);
gl.vertexAttribPointer(a_texcoord, 2, gl.FLOAT, false, 0, 0);

//
// texture
//
const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0 + 2);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  billboardCanvas,
);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.generateMipmap(gl.TEXTURE_2D);

//
gl.bindVertexArray(null);

export const MAX_PARTICLES = MAX_FRUIT + 50;

const positions = new Float32Array(MAX_PARTICLES * 2 * 3 * 3);
const uvs = new Float32Array(MAX_PARTICLES * 2 * 3 * 2);

const a = vec3.create();

export const draw = () => {
  gl.useProgram(program);

  gl.bindVertexArray(vao);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(u_texture, 2);

  const aspect = canvas.width / canvas.height;

  const sprites: Sprite[] = [...fruits.values(), ...triceratopsParticles];

  for (let j = 0; j < sprites.length; j++) {
    const { p: p, i, size: s } = sprites[j];

    vec3.transformMat4(a, p, viewMatrix);

    const ly = s / vec3.distance(eye, p);
    const lx = ly / aspect;

    //  (5)        (4)
    //   +----------+        (2)
    //   |         /          +
    //   |      /           / |
    //   |    /          /    |
    //   | /           /      |
    //   +          /         |
    //  (3)       +-----------+
    //           (0)         (1)

    setIntoArrayValues(positions, j * 2 * 3 + 0, a[0] - lx, a[1] - ly, a[2]);
    setIntoArrayValues(positions, j * 2 * 3 + 1, a[0] + lx, a[1] - ly, a[2]);
    setIntoArrayValues(positions, j * 2 * 3 + 2, a[0] + lx, a[1] + ly, a[2]);

    uvs[(j * 3 * 2 + 0) * 2 + 0] = (i + 0) / N_SPRITES;
    uvs[(j * 3 * 2 + 0) * 2 + 1] = 1;

    uvs[(j * 3 * 2 + 1) * 2 + 0] = (i + 1) / N_SPRITES;
    uvs[(j * 3 * 2 + 1) * 2 + 1] = 1;

    uvs[(j * 3 * 2 + 2) * 2 + 0] = (i + 1) / N_SPRITES;
    uvs[(j * 3 * 2 + 2) * 2 + 1] = 0;

    setIntoArrayValues(positions, j * 2 * 3 + 3, a[0] - lx, a[1] - ly, a[2]);
    setIntoArrayValues(positions, j * 2 * 3 + 4, a[0] + lx, a[1] + ly, a[2]);
    setIntoArrayValues(positions, j * 2 * 3 + 5, a[0] - lx, a[1] + ly, a[2]);

    uvs[(j * 3 * 2 + 3) * 2 + 0] = (i + 0) / N_SPRITES;
    uvs[(j * 3 * 2 + 3) * 2 + 1] = 1;

    uvs[(j * 3 * 2 + 4) * 2 + 0] = (i + 1) / N_SPRITES;
    uvs[(j * 3 * 2 + 4) * 2 + 1] = 0;

    uvs[(j * 3 * 2 + 5) * 2 + 0] = (i + 0) / N_SPRITES;
    uvs[(j * 3 * 2 + 5) * 2 + 1] = 0;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.DYNAMIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, sprites.length * 3 * 2);

  gl.bindVertexArray(null);
};
