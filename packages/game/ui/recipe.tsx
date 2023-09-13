import { css } from "@linaria/core";
import { variants } from "../systems/gene";

const dialog = document.createElement("dialog");

dialog.className = css`
  margin-top: 60px;
  background-color: #fff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: monospace;
  font-size: 22px;
  border-radius: 8px;

  &:not([open]) {
    display: none;
  }

  button {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  h4 {
    align-self: center;
  }

  span {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
  }
`;

const swatchClassName = css`
  width: 80px;
  height: 30px;
  border-radius: 4px;
`;

const rgb = (colors: number[], offset: number) =>
  `rgb(${255 * colors[0 + offset]},${255 * colors[1 + offset]},${
    255 * colors[2 + offset]
  })`;
const swatch = (colors: number[]) => {
  const c1 = rgb(colors, 0);
  const c2 = rgb(colors, 6);

  const image = `repeating-linear-gradient(45deg,${c1},${c1} 10px,${c2} 10px,${c2} 20px)`;

  return `<div class="${swatchClassName}" style="background:${image}" ></div>`;
};

dialog.innerHTML =
  "<h4>🧬 recipes</h4>" +
  "<button>×</button>" +
  variants
    .map(({ colors, variant_parents }) => {
      return (
        "<span>" +
        (variant_parents
          ? swatch(variants[variant_parents[0]].colors) +
            " + " +
            swatch(variants[variant_parents[1]].colors) +
            " = "
          : "") +
        swatch(colors) +
        "</span>"
      );
    })
    .join("");

dialog.querySelector("button")!.onclick = () => dialog.close();
document.body.appendChild(dialog);

export const recipeDialogButton = document.createElement("button");
recipeDialogButton.className = css`
  position: absolute;
  bottom: 4px;
  right: 4px;
  z-index: 2;
  font-size: 22px;
  display: none;
`;
recipeDialogButton.innerText = "🧬";
recipeDialogButton.onclick = () => dialog.showModal();
document.body.appendChild(recipeDialogButton);
