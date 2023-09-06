import "./ui/globalStyle";
import "./controls";
import { render } from "./renderer";
import { mat4, quat, vec3 } from "gl-matrix";
import { entities, nEntity } from "./renderer/geometries/model/skeleton";
import { geometryPromise } from "./renderer/geometries/model/model";
import { clamp } from "./utils/math";
import { updateBuffers } from "./renderer/materials/basic";
import { setEntityColorSchema } from "./renderer/geometries/model/colorSchema";
import { hslToRgb } from "./utils/color";

let t = 0;

const loop = () => {
  t += 1 / 60;

  nEntity.n = Math.round(((Math.sin(t) + 1) / 2) * entities.length);
  nEntity.n = entities.length;

  for (let i = entities.length; i--; ) {
    entities[i].origin[2] = i;
    entities[i].feet[0] = Math.sin(t * 2 + Math.PI * (i / entities.length));

    quat.fromEuler(entities[i].eye0_direction, 0, Math.sin(t * 3) * 30, 0);
    quat.fromEuler(
      entities[i].eye1_direction,
      0,
      Math.sin(t * 3.1 + 2) * 30,
      Math.sin(t * 4.1 + 2) * 20
    );
  }

  entities[0].feet[0] = Math.sin(t * 2);
  entities[0].feet[1] = Math.sin(t * 2 + Math.PI);
  entities[0].feet[2] = Math.sin(t * 2 + Math.PI);
  entities[0].feet[3] = Math.sin(t * 2);

  quat.fromEuler(entities[0].head_direction, 0, Math.sin(t) * 30, 0);

  // const p1 = [3, -3, Math.sin(t)] as vec3;

  // mat4.fromTranslation(bones[1], p1);

  // origin[0] = Math.sin(t) * 1;
  // origin[2] = Math.cos(t) * 1;

  // quat.fromEuler(tail_direction, 0, Math.sin(t * 4) * 20, 0);

  // vec3.normalize(direction, direction);

  render();
  requestAnimationFrame(loop);
};

geometryPromise.then(() => requestAnimationFrame(loop));

for (let i = entities.length; i--; ) {
  const color1: [number, number, number] = [0, 0, 0];
  hslToRgb(color1, i / entities.length, 0.6, 0.55);

  const color2: [number, number, number] = [0, 0, 0];
  hslToRgb(color2, (i / entities.length + 0.8) % 1, 0.8, 0.45);

  setEntityColorSchema(
    i,
    [color1, color2, [0.95, 0.95, 0.85], [0.4, 0.4, 0.5]].flat()
  );
}

updateBuffers();
