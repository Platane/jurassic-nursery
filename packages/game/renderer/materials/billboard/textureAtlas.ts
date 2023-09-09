const emojis = [
  //
  "🍉",
  "🫐",
  "🥭",
  "🍍",
  "🥝",
  "💜",
  "⭐️",
  "🌟",
  "🌺",
  "😀",
  "🥰",
  "❗️",
  "❓",
  "❌",
];
export const N_TILES = emojis.length;

export const billboardCanvas = document.createElement("canvas");

const L = 128;

billboardCanvas.width = emojis.length * L;
billboardCanvas.height = L;

const ctx = billboardCanvas.getContext("2d")!;

// document.body.appendChild(billboardCanvas);
// billboardCanvas.style.position = "absolute";
// billboardCanvas.style.top = "0";
// billboardCanvas.style.width = "auto";
// billboardCanvas.style.height = "auto";

ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = `${L * 0.5}px mono`;

const N = 5;
let contourFilter = "";

for (let k = N; k--; ) {
  const a = (k / N) * Math.PI * 2;
  contourFilter += `drop-shadow( ${Math.cos(a) * 8}px ${
    Math.sin(a) * 8
  }px 3px #fff)`;
}
for (let i = emojis.length; i--; ) {
  ctx.filter = contourFilter;
  ctx.fillText(emojis[i], (i + 0.5) * L, L * 0.5);
}
