import "./ui/globalStyle";
import "./controls";
import { render } from "./renderer";
import { mat4, quat, vec3 } from "gl-matrix";
import { geometryPromise } from "./renderer/geometries/model/model";
import { updateBuffers } from "./renderer/materials/basic";
import { setEntityColorSchema } from "./renderer/geometries/model/colorSchema";
import { hslToRgb } from "./utils/color";
import { triceratops } from "./entities/triceratops";
import {
  MAX_ENTITY,
  createSkeleton,
} from "./renderer/geometries/model/skeleton";

let t = 0;

const loop = () => {
  t += 1 / 60;

  const e = triceratops[0];

  e.feet[0] = Math.sin(t * 2);
  e.feet[1] = Math.sin(t * 2 + Math.PI);
  e.feet[2] = Math.sin(t * 2 + Math.PI);
  e.feet[3] = Math.sin(t * 2);

  quat.fromEuler(e.head_direction, 0, Math.sin(t) * 30, 0);

  render();
  requestAnimationFrame(loop);
};

geometryPromise.then(() => requestAnimationFrame(loop));

for (let i = MAX_ENTITY; i--; ) {
  const color1: [number, number, number] = [0, 0, 0];
  hslToRgb(color1, i / MAX_ENTITY, 0.6, 0.55);

  const color2: [number, number, number] = [0, 0, 0];
  hslToRgb(color2, (i / MAX_ENTITY + 0.8) % 1, 0.8, 0.45);

  setEntityColorSchema(
    i,
    [color1, color2, [0.95, 0.95, 0.85], [0.4, 0.4, 0.5]].flat()
  );
}
updateBuffers();

triceratops.push({ ...createSkeleton(), target: [0, 0] });
