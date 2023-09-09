import { vec3 } from "gl-matrix";
import {
  getRayFromScreen,
  getScreenX,
  getScreenY,
} from "./utils/getRayFromScreen";
import { Handler } from "./controls-type";
import { raycastToScene } from "../systems/raycastScene";
import { fruits } from "../entities/fruits";

const o = vec3.create();
const v = vec3.create();

let hover_i = null as null | number;

export const onTouchMove: Handler = (touches) => {
  const [{ pageX, pageY }] = touches;

  getRayFromScreen(o, v, getScreenX(pageX), getScreenY(pageY));

  const picked = raycastToScene(o, v);

  const hi = picked?.type === "fruit" ? picked.i : null;

  if (hover_i !== hi) {
    if (hover_i !== null) {
      fruits[hover_i].s = 0.6;
    }

    hover_i = hi;

    if (hover_i !== null) {
      fruits[hover_i].s = 0.68;
    }
  }
};
