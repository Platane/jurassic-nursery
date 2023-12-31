import { mat3, mat4, vec3 } from "gl-matrix";
import { canvas } from "../renderer/canvas";
import { mat4FromMat3 } from "../utils/mat4";
import { UP } from "../utils/vec3";

export const lookAtPoint: vec3 = [0, 0, 0];
export const eye: vec3 = [0, 0, 1];

export const perspectiveMatrix = new Float32Array(4 * 4);

// lookAtMatrix, build from the camera
export const lookAtMatrix = mat4.create();

// combination or perspective and lookAt matrices
export const worldMatrix = mat4.create();

export const updateLookAtMatrix = () => {
  mat4.lookAt(lookAtMatrix, eye, lookAtPoint, UP);

  mat4.multiply(worldMatrix, perspectiveMatrix, lookAtMatrix);
};

export const onResize = () => {
  // initialize static perspective matrix
  const fovX = Math.PI / 3;
  const near = 0.005;
  const far = 2000;
  const aspect = canvas.width / canvas.height;
  mat4.perspective(perspectiveMatrix, fovX, aspect, near, far);

  updateLookAtMatrix();
};
