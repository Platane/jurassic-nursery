import { vec3 } from "gl-matrix";
import {
  getRayFromScreen,
  getScreenX,
  getScreenY,
} from "./utils/getRayFromScreen";
import { Handler } from "./controls-type";
import { raycastToScene } from "../systems/raycastScene";
import { state } from "../ui/state";
import { triceratops } from "../entities/triceratops";
import { projectOnGround } from "../utils/collision/projectOnGround";

const o = vec3.create();
const v = vec3.create();

const a = vec3.create();

export const onTap: Handler = (touches) => {
  const [{ pageX, pageY }] = touches;

  getRayFromScreen(o, v, getScreenX(pageX), getScreenY(pageY));

  const picked = raycastToScene(o, v, false);

  if (picked?.type === "tri") state.selectedTriceratopsId = picked.id;
  else if (state.selectedTriceratopsId !== null) {
    projectOnGround(a, o, v, 0);

    const target = triceratops.get(state.selectedTriceratopsId)!.target;

    target[0] = a[0];
    target[1] = a[2];
  }
};
