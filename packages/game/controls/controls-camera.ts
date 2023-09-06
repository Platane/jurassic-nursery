import { canvas } from "../renderer/canvas";
import { eye, updateLookAtMatrix } from "../entities/camera";
import { Handler } from "./controls-type";
import { clamp } from "../utils/math";

const maxZoom = 8;
const minZoom = 0;

const rotationSpeed = 4;

let phi = 1.2;
let theta = 1;
let zoom = Math.floor((maxZoom + minZoom) / 2);

try {
  const u = JSON.parse(localStorage.getItem("camera")!);
  phi = u.phi;
  theta = u.theta;
  zoom = u.zoom;
} catch (err) {}

const update = () => {
  localStorage.setItem("camera", JSON.stringify({ phi, theta, zoom }));

  const radius = 1 + zoom * zoom * 0.18;

  const sinPhiRadius = Math.sin(phi) * radius;
  eye[0] = sinPhiRadius * Math.sin(theta);
  eye[1] = Math.cos(phi) * radius;
  eye[2] = sinPhiRadius * Math.cos(theta);

  updateLookAtMatrix();
};

update();

let zoom0 = 0;
let l0: number | null = null;

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

    // theta = clamp(theta, Math.PI * 0.01, Math.PI * 0.99);
    phi = clamp(phi, Math.PI * 0.0002, Math.PI * 0.9999998);

    px = x;
    py = y;

    update();
  }
};
const rotateEnd = () => {
  px = null;
};

const scaleStart: H = ([
  { pageX: ax, pageY: ay },
  { pageX: bx, pageY: by },
]) => {
  zoom0 = zoom;
  l0 = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
};
const scaleMove: H = (a) => {
  if (l0 !== null) {
    const [{ pageX: ax, pageY: ay }, { pageX: bx, pageY: by }] = a;

    const l = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);

    zoom = clamp((zoom0 / l) * l0, minZoom, maxZoom);

    update();
  }
};
const scaleEnd = () => {
  l0 = null;
};

export const onTouchStart: Handler = (touches) => {
  if (touches.length === 1) {
    scaleEnd();
    rotateStart(touches);
  } else if (touches.length > 1) {
    rotateEnd();
    scaleStart(touches);
  }
};
export const onTouchMove: Handler = (touches) => {
  scaleMove(touches);
  rotateMove(touches);
};
export const onTouchEnd: Handler = (touches) => {
  scaleEnd();
  rotateEnd();

  onTouchStart(touches);
};

canvas.addEventListener(
  "wheel",
  (event) => {
    zoom = clamp(zoom + (event.deltaY < 0 ? -1 : 1), minZoom, maxZoom);

    update();
  },
  { passive: true }
);
