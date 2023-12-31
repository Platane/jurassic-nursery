import { onResize as onResizeCamera } from "../entities/camera";
import { gl } from "./canvas";
import { onResize as onResizeCanvas } from "./canvas";
import { draw as drawGizmo } from "./materials/gizmo";
import { draw as drawGizmos } from "./materials/gizmos";
import { draw as drawLines } from "./materials/lines";
import { draw as drawShadow } from "./materials/shadow";
import { draw as drawSkinnedMesh } from "./materials/skinnedMesh";
import { draw as drawSkinnedMeshTree } from "./materials/skinnedMeshTree";
import { draw as drawSprites } from "./materials/sprites";

gl.clearColor(0, 0, 0, 0);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LESS);

export const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawLines();
  drawShadow();
  drawSkinnedMesh();
  drawSkinnedMeshTree();
  drawSprites();
  // drawGizmo();
  // drawGizmos();
};

const onResize = (window.onresize = () => {
  onResizeCanvas();
  onResizeCamera();
  render();
});
onResize();
