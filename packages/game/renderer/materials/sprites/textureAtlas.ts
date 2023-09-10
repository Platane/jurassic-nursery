const emojis = [
  //
  "❌", // 0
  "🍉", // 1
  "🫐", // 2
  "🥭", // 3
  "🍍", // 4
  "🥝", // 5

  "💜", // 6
  "⭐️", // 7
  "❗️", // 8
  "🔻",

  // "🌟",
  // "🌺",
  // "😀",
  // "😖",
  // "🥰",
  // "❗️",
  // "❓",
];
export const N_SPRITES = emojis.length;

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
ctx.font = `${L * 0.58}px mono`;

const N = 5;
let contourFilter = "";

for (let k = N; k--; ) {
  const a = (k / N) * Math.PI * 2;
  const h = 2;
  const b = 1;
  contourFilter += `drop-shadow( ${Math.cos(a) * h}px ${
    Math.sin(a) * h
  }px ${b}px #fff)`;
}
for (let i = emojis.length; i--; ) {
  ctx.filter = contourFilter;
  ctx.fillText(emojis[i], (i + 0.5) * L, L * 0.5);
}
