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

  for (const [
    i,
    { eye0_direction, eye1_direction, head_direction, tail_direction },
  ] of triceratops.entries()) {
    quat.fromEuler(
      eye0_direction,
      0,
      Math.sin(t * 2) * 30,
      Math.sin(t * 2.6 + 1) * 20
    );
    quat.fromEuler(
      eye1_direction,
      0,
      Math.sin(-t * 3) * 36,
      Math.sin(t * 2.3 + 1) * 28
    );

    quat.fromEuler(head_direction, 0, Math.sin(t + i) * 30, 0);
    quat.fromEuler(tail_direction, 0, Math.sin(t * 1.3 + i) * 30, 0);
  }

  e.feet[0] = Math.sin(t * 4);
  e.feet[1] = Math.sin(t * 4 + Math.PI);
  e.feet[2] = Math.sin(t * 4 + Math.PI);
  e.feet[3] = Math.sin(t * 4);

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

for (let k = 50; k--; ) {
  const t = { ...createSkeleton(), target: [0, 0] as [number, number] };

  let d = 0;
  while (d < 3 || d > 10) {
    t.origin[0] = (Math.random() - 0.5) * 20;
    t.origin[2] = (Math.random() - 0.5) * 20;

    d = Math.hypot(t.origin[0], t.origin[2]);
  }

  quat.fromEuler(t.direction, 0, Math.random() * 360, 0);

  triceratops.push(t);
}
