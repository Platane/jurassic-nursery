import { gl } from "./canvas";
import { draw as drawGizmo } from "./materials/gizmo";
import { draw as drawBasic } from "./materials/basic";
import { draw as drawGizmos } from "./materials/gizmos";
import { draw as drawSprites } from "./materials/sprites";
import { onResize as onResizeCamera } from "../entities/camera";
import { onResize as onResizeCanvas } from "./canvas";
import { draw as drawShadow } from "./materials/shadow";
import { draw as drawLines } from "./materials/lines";

gl.clearColor(0, 0, 0, 0);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LESS);

export const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawLines();
  drawShadow();
  drawBasic();
  drawSprites();
  // drawGizmo();
  drawGizmos();
};

const onResize = (window.onresize = () => {
  onResizeCanvas();
  onResizeCamera();
  render();
});
onResize();
