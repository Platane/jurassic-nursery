import "./ui/globalStyle";
import "./controls";
import { render } from "./renderer";
import { mat4, quat, vec3 } from "gl-matrix";
import { geometryPromise } from "./renderer/geometries/model/model";
import { canvas } from "./renderer/canvas";
import {
  getRayFromScreen,
  getScreenX,
  getScreenY,
} from "./controls/utils/getRayFromScreen";
import { raycastToScene } from "./systems/raycastScene";
import { update as update_system } from "./systems";
import { onFrame as onFrame_controls } from "./controls";
import { initTrees } from "./systems/trees";
import { initTriceratops } from "./systems/triceratopSpawn";

import "./ui/recipe";

const loop = () => {
  onFrame_controls();
  update_system();

  render();
  requestAnimationFrame(loop);
};

initTriceratops();
initTrees();

geometryPromise.then(() => requestAnimationFrame(loop));

//
//
//
//
//
//
if (process.env.NODE_ENV !== "production") {
  const c = document.createElement("canvas");
  c.width = canvas.width;
  c.height = canvas.height;
  c.style.position = "absolute";
  c.style.top = "0";
  c.style.left = "0";
  c.style.width = "100%";
  c.style.height = "100%";
  c.style.zIndex = "10";
  c.style.pointerEvents = "none";
  document.body.appendChild(c);

  const ctx = c.getContext("2d")!;

  const o = [] as any as vec3;
  const v = [] as any as vec3;

  canvas.addEventListener("mousedown", ({ pageX, pageY, ctrlKey }) => {
    if (!ctrlKey) ctx.clearRect(0, 0, 99999, 99999);

    if (ctrlKey) {
      const h = 2;
      const l = 300;

      for (
        let x = Math.max(0, pageX - l);
        x < Math.min(c.width, pageX + l);
        x += h
      )
        for (
          let y = Math.max(0, pageY - l);
          y < Math.min(c.height, pageY + l);
          y += h
        ) {
          getRayFromScreen(o, v, getScreenX(x), getScreenY(y));
          const s = raycastToScene(o, v);

          if (!s) continue;

          ctx.beginPath();
          ctx.fillStyle = `hsla( ${(s.id ?? s.id) * 13 * 30},80%,60%,0.93 )`;
          const l = h;
          ctx.fillRect(x - l / 2, y - l / 2, l, l);
        }
    }
  });
}
