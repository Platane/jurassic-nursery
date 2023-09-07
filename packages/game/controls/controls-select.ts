import { vec3 } from "gl-matrix";
import { getScreenX, getScreenY, projectOnGround } from "../systems/raycast";
import { Handler } from "./controls-type";
import { triceratops } from "../entities/triceratops";

const cursor = vec3.create();

export const onTap: Handler = (touches) => {
  const [{ pageX, pageY }] = touches;

  projectOnGround(cursor, getScreenX(pageX), getScreenY(pageY), 0);

  triceratops[0].origin[0] = cursor[0];
  triceratops[0].origin[2] = cursor[2];
};