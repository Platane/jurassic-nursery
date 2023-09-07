import { gl } from "./canvas";
import { draw as drawGizmo } from "./materials/gizmo";
import { draw as drawBasic } from "./materials/basic";
import { onResize as onResizeCamera } from "../entities/camera";
import { onResize as onResizeCanvas } from "./canvas";
import { draw as drawGizmos } from "./materials/gizmos";

gl.clearColor(0, 0, 0, 0);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LESS);

export const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawBasic();
  // drawGizmo();
  drawGizmos();
};

const onResize = (window.onresize = () => {
  onResizeCanvas();
  onResizeCamera();
  render();
});
onResize();
