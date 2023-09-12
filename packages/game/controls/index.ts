import type { Touche } from "./controls-type";
import { canvas } from "../renderer/canvas";
import {
  onTouchStart as onTouchStart_camera,
  onTouchMove as onTouchMove_camera,
  onTouchEnd as onTouchEnd_camera,
  onFrame as onFrame_camera,
} from "./controls-camera";
import {
  onTouchStart as onTouchStart_drag,
  onTouchMove as onTouchMove_drag,
  onTouchEnd as onTouchEnd_drag,
  onFrame as onFrame_drag,
} from "./controls-drag";
import "./controls-camera";
import { state } from "../ui/state";
import { onTouchMove as onTouchMove_hover } from "./controls-hover";

const onTap = (touches: Touche[], event: Event) => {};
const onStart = (touches: Touche[], event: Event) => {
  onTouchStart_drag(touches);
  if (!state.dragged) onTouchStart_camera(touches);
};
const onMove = (touches: Touche[], event: Event) => {
  onTouchMove_drag(touches);
  onTouchMove_camera(touches);
  if (!state.dragged) onTouchMove_hover(touches);
};
const onEnd = (touches: Touche[], event: Event) => {
  onTouchEnd_drag(touches);
  onTouchEnd_camera(touches);
};

let tap: {
  pageX: number;
  pageY: number;
  timeStamp: number;
  touches: Touche[];
} | null = null;
const onStart_ = (touches: Touche[], event: Event) => {
  if (touches.length === 1)
    tap = {
      pageX: touches[0].pageX,
      pageY: touches[0].pageY,
      timeStamp: event.timeStamp,
      touches: touches.slice(),
    };
  else {
    tap = null;
    onStart(touches, event);
  }
};
const onMove_ = (touches: Touche[], event: Event) => {
  if (tap) {
    if (
      touches.length > 0 ||
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
const onEnd_ = (touches: Touche[], event: Event) => {
  if (tap && event.timeStamp - tap.timeStamp < 200) {
    onTap(tap.touches, event);
  } else onEnd(touches, event);
  tap = null;
};

canvas.onmousedown = (event) => onStart_([event], event);
canvas.onmousemove = (event) => onMove_([event], event);
canvas.onmouseup = (event) => onEnd_([], event);

canvas.ontouchstart = (event) => onStart_(Array.from(event.touches), event);
canvas.ontouchmove = (event) => onMove_(Array.from(event.touches), event);
canvas.ontouchend = (event) => onEnd_(Array.from(event.touches), event);

export const onFrame = () => {
  onFrame_camera();
  onFrame_drag();
};
