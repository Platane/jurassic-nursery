import "./ui/globalStyle";
import "./controls";
import { render } from "./renderer";
import { mat4, quat, vec3 } from "gl-matrix";
import {
  direction,
  origin,
  tail_direction,
} from "./renderer/geometries/model/skeleton";

let t = 0;

const loop = () => {
  t += 1 / 60;

  // const p1 = [3, -3, Math.sin(t)] as vec3;

  // mat4.fromTranslation(bones[1], p1);

  // origin[0] = Math.sin(t) * 1;
  // origin[2] = Math.cos(t) * 1;

  quat.fromEuler(tail_direction, 0, Math.sin(t) * 30, 0);

  // tail_direction[0] = Math.sin(t) * 1;
  // tail_direction[2] = Math.cos(t) * 1;

  // vec3.normalize(direction, direction);

  render();
  requestAnimationFrame(loop);
};
loop();
