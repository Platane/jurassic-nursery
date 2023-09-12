import { canvas } from "../renderer/canvas";
import {
  eye,
  lookAtMatrix,
  lookAtPoint,
  updateLookAtMatrix,
} from "../entities/camera";
import { Handler } from "./controls-type";
import { clamp } from "../utils/math";
import { mat4, vec3 } from "gl-matrix";
import { PLAYGROUND_SIZE } from "../systems/const";

const maxZoom = 10;
const minZoom = 6;

const rotationSpeed = 5;

// lookAtPoint[2] = PLAYGROUND_SIZE * 0.02;

let phi = 0.67;
let theta = 3.14;
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

let px: number | null = null;
let py: number | null = null;

type H = (touches: { pageX: number; pageY: number }[]) => void;

const rotateStart: H = ([{ pageX: x, pageY: y }]) => {
  px = x;
  py = y;
};
const rotateMove: H = ([{ pageX: x, pageY: y }]) => {
  if (px !== null) {
    const dx = x - px!;
    const dy = y - py!;

    theta -= (dx / window.innerHeight) * rotationSpeed;
    phi -= (dy / window.innerHeight) * rotationSpeed;

    phi = clamp(phi, Math.PI * 0.0002, Math.PI * 0.38);

    px = x;
    py = y;

    update();
  }
};
const rotateEnd = () => {
  px = null;
};

let zoom0 = 0;
let theta0 = 0;
let lookAtPoint0x = 0;
let lookAtPoint0y = 0;
let l0: number | null = null;
let angle0 = 0;
let cx0 = 0;
let cy0 = 0;

const scaleTranslateRotateStart: H = ([
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
const scaleTranslateRotateMove: H = (a) => {
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

    // const cx = (ax + bx) / 2;
    // const cy = (ay + by) / 2;

    // const h = zoom / maxZoom / 10;

    // lookAtPoint[0] = lookAtPoint0x;
    // lookAtPoint[2] = lookAtPoint0y;

    // dolly((cx - cx0) * h, -(cy - cy0) * h);

    //
    // rotate
    //

    const angle = Math.atan2(by - ay, bx - ax);

    theta = theta0 + (angle - angle0) * 1.6;

    update();
  }
};
const scaleTranslateRotateEnd = () => {
  l0 = null;
};

export const onTouchStart: Handler = (touches) => {
  borderDollyEnd();

  if (touches.length === 1) {
    scaleTranslateRotateEnd();
    if (touches[0].button === 1 || touches[0].button === 2)
      rotateStart(touches);
  } else if (touches.length > 1) {
    rotateEnd();

    scaleTranslateRotateStart(touches);
  }
};
export const onTouchMove: Handler = (touches) => {
  if (touches.length === 1) borderDollyMove(touches);

  scaleTranslateRotateMove(touches);
  rotateMove(touches);
};
export const onTouchEnd: Handler = (touches) => {
  scaleTranslateRotateEnd();
  rotateEnd();
  borderDollyEnd();

  onTouchStart(touches);
};

const o = vec3.create();
const m = mat4.create();

let dx = 0;
let dy = 0;

const borderDollyMove: Handler = ([{ pageX, pageY }]) => {
  const M = Math.min(100, window.innerWidth * 0.2);

  if (px === null) {
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

  lookAtPoint[0] = clamp(
    lookAtPoint[0],
    -PLAYGROUND_SIZE * 0.4,
    PLAYGROUND_SIZE * 0.4
  );
  lookAtPoint[2] = clamp(
    lookAtPoint[2],
    -PLAYGROUND_SIZE * 0.4,
    PLAYGROUND_SIZE * 0.4
  );
};

export const onFrame = () => {
  if (dx || dy) {
    const h = zoom / maxZoom / 4;

    dolly(dx * h, dy * h);

    update();
  }
};

window.onblur = canvas.onmouseleave = () => {
  dx = dy = 0;
};

canvas.oncontextmenu = (e) => e.preventDefault();

canvas.onwheel = (event) => {
  zoom = clamp(zoom + (event.deltaY < 0 ? -1 : 1), minZoom, maxZoom);

  update();
};
