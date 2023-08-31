import type { Touches } from "./controls-type";
import { canvas } from "../renderer/canvas";
import {
  onTouchStart as onTouchStart_camera,
  onTouchMove as onTouchMove_camera,
  onTouchEnd as onTouchEnd_camera,
} from "./camera-controls";

const onStart = (touches: Touches, event: Event) => {
  onTouchStart_camera(touches);
};
const onMove = (touches: Touches, event: Event) => {
  onTouchMove_camera(touches);
};
const onEnd = (touches: Touches, event: Event) => {
  onTouchEnd_camera(touches);
};

canvas.addEventListener("mousedown", (event) => onStart([event], event));
canvas.addEventListener("mousemove", (event) => onMove([event], event));
canvas.addEventListener("mouseup", (event) => onEnd([], event));

canvas.addEventListener(
  "touchstart",
  (event) => onStart(Array.from(event.touches), event),
  { passive: true }
);
canvas.addEventListener(
  "touchmove",
  (event) => onMove(Array.from(event.touches), event),
  { passive: true }
);
canvas.addEventListener(
  "touchend",
  (event) => onEnd(Array.from(event.touches), event),
  { passive: true }
);
