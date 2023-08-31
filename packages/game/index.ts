import "./ui/globalStyle";
import "./controls";
import { render } from "./renderer";

const loop = () => {
  render();
  requestAnimationFrame(loop);
};
loop();
