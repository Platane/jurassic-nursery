import { vec3 } from "gl-matrix";
import { getRayFromScreen, getScreenX, getScreenY } from "../systems/raycast";
import { Handler } from "./controls-type";
import { triceratops } from "../entities/triceratops";
import { particles } from "../entities/fruits";
import { raycastScene } from "../systems/raycastScene";

const cursor = vec3.create();

const o = vec3.create();
const v = vec3.create();

export const onTap: Handler = (touches) => {
  const [{ pageX, pageY }] = touches;

  getRayFromScreen(o, v, getScreenX(pageX), getScreenY(pageY));

  console.log(raycastScene(o, v));
};
