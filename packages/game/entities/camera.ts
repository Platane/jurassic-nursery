import { mat4, vec3, mat3 } from "gl-matrix";
import { mat4FromMat3 } from "../utils/mat4";
import { canvas } from "../renderer/canvas";
import { UP } from "../utils/vec3";

export const lookAtPoint: vec3 = [0, 0, 0];
export const eye: vec3 = [0, 0, 1];

export const perspectiveMatrix = new Float32Array(4 * 4);

// lookAtMatrix, build from the camera
export const lookAtMatrix = mat4.create();
export const lookAtMatrix3 = mat3.create();

// combination or perspective and lookAt matrices
export const worldMatrix = mat4.create();

// to apply to normal
export const normalTransformMatrix3 = mat3.create();
export const normalTransformMatrix4 = mat4.create();

export const updateLookAtMatrix = () => {
  mat4.lookAt(lookAtMatrix, eye, lookAtPoint, UP);

  mat4.multiply(worldMatrix, perspectiveMatrix, lookAtMatrix);

  mat3.fromMat4(lookAtMatrix3, lookAtMatrix);

  mat3.normalFromMat4(normalTransformMatrix3, lookAtMatrix);

  mat4FromMat3(normalTransformMatrix4, normalTransformMatrix3);
};

export const onResize = () => {
  // initialize static perspective matrix
  const fovX = Math.PI / 3;
  const near = 0.005;
  const far = 2000;
  let aspect = canvas.width / canvas.height;
  mat4.perspective(perspectiveMatrix, fovX, aspect, near, far);

  updateLookAtMatrix();
};
