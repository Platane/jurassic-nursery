import "./ui/globalStyle";
import "./controls";
import { render } from "./renderer";
import { bones } from "./renderer/geometries/model/skeleton";
import { mat4, vec3 } from "gl-matrix";
import { UP } from "./utils/vec3";

let t = 0;

const loop = () => {
  t += 1 / 60;

  const p1 = [3, -3, Math.sin(t)] as vec3;
  const p0 = mat4.getTranslation(vec3.create(), bones[0]);

  const p2 = vec3.create();
  vec3.sub(p2, p1, p0);
  vec3.add(p2, p2, p1);

  mat4.fromTranslation(bones[1], p1);
  mat4.targetTo(bones[1], p1, [0, 0, -10], UP);

  render();
  requestAnimationFrame(loop);
};
loop();
