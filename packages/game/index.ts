import "./ui/globalStyle";
import "./controls";
import { render } from "./renderer";
import { bones } from "./renderer/geometries/model/skeleton";
import { mat4, vec3 } from "gl-matrix";

let t = 0;

const loop = () => {
  t += 1 / 60;

  const p1 = [3, -3, Math.sin(t)] as vec3;

  render();
  requestAnimationFrame(loop);
};
loop();
