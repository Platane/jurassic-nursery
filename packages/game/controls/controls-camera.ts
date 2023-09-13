import { canvas } from "../renderer/canvas";
import {
  eye,
  lookAtMatrix,
  lookAtPoint,
  updateLookAtMatrix,
} from "../entities/camera";
import { Handler } from "./controls-type";
import { clamp, invLerp, lerp } from "../utils/math";
import { mat4, vec3 } from "gl-matrix";
import { PLAYGROUND_SIZE } from "../systems/const";

const maxZoom = 10;
const minZoom = 6;

const rotationSpeed = 3.5;

// lookAtPoint[2] = PLAYGROUND_SIZE * 0.02;

let phi = 0.67;
let theta = 1.5;
let zoom = 8;

const update = () => {
  const radius = zoom * zoom * 0.18;

  const sinPhiRadius = Math.sin(phi) * radius;
  eye[0] = lookAtPoint[0] + sinPhiRadius * Math.sin(theta);
  eye[1] = lookAtPoint[1] + Math.cos(phi) * radius;
  eye[2] = lookAtPoint[2] + sinPhiRadius * Math.cos(theta);

  updateLookAtMatrix();
};

update();

//
// rotate
//

let rotate_px: number | null = null;
let rotate_py: number | null = null;

const rotateStart: Handler = ([{ pageX: x, pageY: y }]) => {
  rotate_px = x;
  rotate_py = y;
};
const rotateMove: Handler = ([{ pageX: x, pageY: y }]) => {
  if (rotate_px !== null) {
    const dx = x - rotate_px!;
    const dy = y - rotate_py!;

    theta -= (dx / window.innerHeight) * rotationSpeed;
    phi -= (dy / window.innerHeight) * rotationSpeed;

    phi = clamp(phi, Math.PI * 0.0002, Math.PI * 0.42);

    rotate_px = x;
    rotate_py = y;

    update();
  }
};
const rotateEnd = () => {
  rotate_px = null;
};

//
// rotate
//

let dolly_px: number | null = null;
let dolly_py: number | null = null;

const dollyStart: Handler = ([{ pageX: x, pageY: y }]) => {
  dolly_px = x;
  dolly_py = y;
};
const dollyMove: Handler = ([{ pageX: x, pageY: y }]) => {
  if (dolly_px !== null) {
    const dx = x - dolly_px!;
    const dy = y - dolly_py!;

    const h = zoom / maxZoom / 80;

    dolly(-dx * h, dy * h);

    dolly_px = x;
    dolly_py = y;

    update();
  }
};
const dollyEnd = () => {
  dolly_px = null;
};

//
// two finger action
//

let zoom0 = 0;
let theta0 = 0;
let lookAtPoint0x = 0;
let lookAtPoint0y = 0;
let l0: number | null = null;
let angle0 = 0;
let cx0 = 0;
let cy0 = 0;

const scaleTranslateRotateStart: Handler = ([
  { pageX: ax, pageY: ay },
  { pageX: bx, pageY: by },
]) => {
  theta0 = theta;
  zoom0 = zoom;
  lookAtPoint0x = lookAtPoint[0];
  lookAtPoint0y = lookAtPoint[2];

  angle0 = Math.atan2(by - ay, bx - ax);
  l0 = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
  cx0 = (ax + bx) / 2;
  cy0 = (ay + by) / 2;
};
const scaleTranslateRotateMove: Handler = (a) => {
  if (l0 !== null) {
    const [{ pageX: ax, pageY: ay }, { pageX: bx, pageY: by }] = a;

    //
    // zoom
    //

    const l = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);

    zoom = clamp((zoom0 / l) * l0, minZoom, maxZoom);

    //
    // dolly
    //

    const cx = (ax + bx) / 2;
    const cy = (ay + by) / 2;

    const h = zoom / maxZoom / 10;

    lookAtPoint[0] = lookAtPoint0x;
    lookAtPoint[2] = lookAtPoint0y;

    dolly((cx - cx0) * h, -(cy - cy0) * h);

    //
    // rotate
    //

    const angle = Math.atan2(by - ay, bx - ax);

    // theta = theta0 + (angle - angle0) * 1.6;

    update();
  }
};
const scaleTranslateRotateEnd = () => {
  l0 = null;
};

const o = vec3.create();
const m = mat4.create();

let dx = 0;
let dy = 0;

const borderDollyMove: Handler = ([{ pageX, pageY }]) => {
  const M = Math.min(40, window.innerWidth * 0.2);

  if (rotate_px === null) {
    dx = pageX < M ? -1 : window.innerWidth - pageX < M ? 1 : 0;
    dy = -(pageY < M ? -1 : window.innerHeight - pageY < M ? 1 : 0);
  } else {
    dx = 0;
    dy = 0;
  }
};
const borderDollyEnd = () => {
  dx = dy = 0;
};

const dolly = (dx: number, dy: number) => {
  mat4.invert(m, lookAtMatrix);
  m[12] = m[13] = m[14] = 0;

  vec3.set(o, 1, 0, 0);
  vec3.transformMat4(o, o, m);
  o[1] = 0;
  vec3.normalize(o, o);
  vec3.scaleAndAdd(lookAtPoint, lookAtPoint, o, dx);

  vec3.set(o, 0, 1, 0);
  vec3.transformMat4(o, o, m);
  o[1] = 0;
  vec3.normalize(o, o);
  vec3.scaleAndAdd(lookAtPoint, lookAtPoint, o, dy);

  constraintLookAt();
};

const constraintLookAt = () => {
  const l = lerp(invLerp(zoom, minZoom, maxZoom), 0.45, 0.1) * PLAYGROUND_SIZE;

  lookAtPoint[0] = clamp(lookAtPoint[0], -l, l);
  lookAtPoint[2] = clamp(lookAtPoint[2], -l, l);
};

export const onFrame = () => {
  if (dx || dy) {
    const h = zoom / maxZoom / 4;

    dolly(dx * h, dy * h);

    update();
  }

  const phi0 = 0.67;
  if (phi !== phi0 && rotate_px === null) {
    phi = lerp(0.06, phi, phi0);

    if (Math.abs(phi - phi0) < 0.01) phi = phi0;

    update();
  }
};

window.onblur = canvas.onmouseleave = () => {
  dx = dy = 0;
};

canvas.oncontextmenu = (e) => e.preventDefault();

canvas.onwheel = (event) => {
  zoom = clamp(zoom + (event.deltaY < 0 ? -1 : 1), minZoom, maxZoom);

  constraintLookAt();

  update();
};

//
// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
//
// canvas.onclick = () => canvas.requestPointerLock();

//
//
//

export const onTouchStart: Handler = (touches) => {
  borderDollyEnd();

  if (touches.length === 1) {
    scaleTranslateRotateEnd();
    if (touches[0].button === 1) rotateStart(touches);
    if (touches[0].button === 2) dollyStart(touches);
  } else if (touches.length > 1) {
    rotateEnd();

    scaleTranslateRotateStart(touches);
  }
};
export const onTouchMove: Handler = (touches) => {
  if (touches.length === 1) borderDollyMove(touches);

  scaleTranslateRotateMove(touches);
  rotateMove(touches);
  dollyMove(touches);
};
export const onTouchEnd: Handler = (touches) => {
  scaleTranslateRotateEnd();
  rotateEnd();
  dollyEnd();
  borderDollyEnd();

  onTouchStart(touches);
};
