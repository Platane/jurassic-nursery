import { vec3 } from "gl-matrix";
import { FRUIT_S, fruits } from "../entities/fruits";
import { raycastToScene } from "../systems/raycastScene";
import { Handler } from "./controls-type";
import {
  getRayFromScreen,
  getScreenX,
  getScreenY,
} from "./utils/getRayFromScreen";

const o = vec3.create();
const v = vec3.create();

let hover_id = null as null | number;

export const onTouchMove: Handler = (touches) => {
  const [{ pageX, pageY }] = touches;

  getRayFromScreen(o, v, getScreenX(pageX), getScreenY(pageY));

  const picked = raycastToScene(o, v);

  const hi = picked?.type === "fruit" ? picked.id : null;

  if (hover_id !== hi) {
    const before = fruits.get(hover_id!);
    if (before) before.size = FRUIT_S;

    hover_id = hi;

    const after = fruits.get(hover_id!);
    if (after) after.size = FRUIT_S * 1.15;
  }
};
