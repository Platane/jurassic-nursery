import "./ui/globalStyle";
import "./controls";
import { render } from "./renderer";
import { bones } from "./renderer/geometries/model/skeleton";
import { mat4 } from "gl-matrix";

const loop = () => {
  mat4.fromTranslation(bones[1], [3, -3, 1.5 * Math.sin(Date.now() * 0.001)]);

  render();
  requestAnimationFrame(loop);
};
loop();
