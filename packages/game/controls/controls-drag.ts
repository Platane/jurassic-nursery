import { vec3 } from "gl-matrix";
import { fruits } from "../entities/fruits";
import { triceratops } from "../entities/triceratops";
import { raycastToScene } from "../systems/raycastScene";
import { state } from "../ui/state";
import { projectOnGround } from "../utils/collision/projectOnGround";
import { Handler, Touche } from "./controls-type";
import {
  getRayFromScreen,
  getScreenX,
  getScreenY,
} from "./utils/getRayFromScreen";

const o = vec3.create();
const v = vec3.create();

export const onTouchStart: Handler = (touches) => {
  if (touches.length !== 1 || touches[0]?.button) {
    if (state.dragged) {
      state.dragged.dragged_anchor = undefined;
      state.dragged = null;
    }
    return;
  }

  const [{ pageX, pageY }] = touches;

  getRayFromScreen(o, v, getScreenX(pageX), getScreenY(pageY));

  const picked = raycastToScene(o, v);

  if (picked?.type === "fruit") {
    const f = fruits.get(picked.id)!;
    if (!f.eaten_by) state.dragged = f;
  } else if (picked?.type === "tri") {
    const tri = triceratops.get(picked.id)!;
    if (tri.activity.type !== "eating") {
      tri.activity.type = "carried";
      state.dragged = tri;
    }
  }

  if (!state.dragged) return;

  state.dragged.dragged_anchor = [] as any as vec3;

  projectOnGround(state.dragged.dragged_anchor, o, v, 2);

  state.dragged.dragged_v = [0, 0, 0];
};

export const onTouchMove: Handler = (touches) => {
  _touches = touches;

  if (!state.dragged) return;

  const [{ pageX, pageY }] = touches;

  getRayFromScreen(o, v, getScreenX(pageX), getScreenY(pageY));

  projectOnGround(state.dragged.dragged_anchor!, o, v, 1.8);
};

export const onTouchEnd: Handler = (touches) => {
  if (state.dragged) {
    state.dragged.dragged_anchor = undefined;
    state.dragged = null;
  }
};

let _touches: Touche[];
export const onFrame = () => onTouchMove(_touches);
