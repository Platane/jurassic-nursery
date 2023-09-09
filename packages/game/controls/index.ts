import type { Touches } from "./controls-type";
import { canvas } from "../renderer/canvas";
import {
  onTouchStart as onTouchStart_camera,
  onTouchMove as onTouchMove_camera,
  onTouchEnd as onTouchEnd_camera,
} from "./controls-camera";
import {
  onTouchStart as onTouchStart_drag,
  onTouchMove as onTouchMove_drag,
  onTouchEnd as onTouchEnd_drag,
} from "./controls-drag";
import { onTap as onTap_select } from "./controls-select";
import "./controls-camera";
import { state } from "../ui/state";
import { onTouchMove as onTouchMove_hover } from "./controls-hover";

const onTap = (touches: Touches, event: Event) => {
  onTap_select(touches);
};
const onStart = (touches: Touches, event: Event) => {
  onTouchStart_drag(touches);
  if (!state.dragged) onTouchStart_camera(touches);
};
const onMove = (touches: Touches, event: Event) => {
  onTouchMove_drag(touches);
  onTouchMove_camera(touches);
  if (!state.dragged) onTouchMove_hover(touches);
};
const onEnd = (touches: Touches, event: Event) => {
  onTouchEnd_drag(touches);
  onTouchEnd_camera(touches);
};

let tap: {
  pageX: number;
  pageY: number;
  timeStamp: number;
  touches: Touches;
} | null = null;
const onStart_ = (touches: Touches, event: Event) => {
  if (touches.length === 1)
    tap = {
      pageX: touches[0].pageX,
      pageY: touches[0].pageY,
      timeStamp: event.timeStamp,
      touches: touches.slice(),
    };
  else onStart(touches, event);
};
const onMove_ = (touches: Touches, event: Event) => {
  if (tap) {
    if (
      Math.hypot(touches[0].pageX - tap.pageX, touches[0].pageY - tap.pageY) >
        40 ||
      event.timeStamp - tap.timeStamp > 200
    ) {
      onStart(tap.touches, event);
      tap = null;
    }
  }
  if (!tap) onMove(touches, event);
};
const onEnd_ = (touches: Touches, event: Event) => {
  if (tap && event.timeStamp - tap.timeStamp < 200) {
    onTap(tap.touches, event);
  } else onEnd(touches, event);
  tap = null;
};

canvas.addEventListener("mousedown", (event) => onStart_([event], event));
canvas.addEventListener("mousemove", (event) => onMove_([event], event));
canvas.addEventListener("mouseup", (event) => onEnd_([], event));

canvas.addEventListener(
  "touchstart",
  (event) => onStart_(Array.from(event.touches), event),
  { passive: true }
);
canvas.addEventListener(
  "touchmove",
  (event) => onMove_(Array.from(event.touches), event),
  { passive: true }
);
canvas.addEventListener(
  "touchend",
  (event) => onEnd_(Array.from(event.touches), event),
  { passive: true }
);
