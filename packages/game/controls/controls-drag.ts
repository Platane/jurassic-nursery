import { vec3 } from "gl-matrix";
import {
  getRayFromScreen,
  getScreenX,
  getScreenY,
} from "./utils/getRayFromScreen";
import { Handler } from "./controls-type";
import { Draggable, triceratops } from "../entities/triceratops";
import { fruits } from "../entities/fruits";
import { raycastToScene } from "../systems/raycastScene";
import { projectOnGround } from "../utils/collision/projectOnGround";
import { state } from "../ui/state";

const o = vec3.create();
const v = vec3.create();

export const onTouchStart: Handler = (touches) => {
  if (touches.length !== 1) {
    if (state.dragged) {
      state.dragged.dragged_anchor = undefined;
      state.dragged = null;
    }
    return;
  }

  const [{ pageX, pageY }] = touches;

  getRayFromScreen(o, v, getScreenX(pageX), getScreenY(pageY));

  const picked = raycastToScene(o, v);

  if (picked?.type === "fruit") state.dragged = fruits[picked.i];
  else if (picked?.type === "tri") state.dragged = triceratops[picked.i];

  if (!state.dragged) return;

  state.dragged.dragged_anchor = [] as any as vec3;

  projectOnGround(state.dragged.dragged_anchor, o, v, 2);

  state.dragged.dragged_v = [0, 0, 0];
};

export const onTouchMove: Handler = (touches) => {
  if (!state.dragged) return;

  const [{ pageX, pageY }] = touches;

  getRayFromScreen(o, v, getScreenX(pageX), getScreenY(pageY));

  projectOnGround(state.dragged.dragged_anchor!, o, v, 2);
};

export const onTouchEnd: Handler = (touches) => {
  if (state.dragged) {
    state.dragged.dragged_anchor = undefined;
    state.dragged = null;
  }
};
