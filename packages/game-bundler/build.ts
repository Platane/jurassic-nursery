import * as fs from "fs";
import * as path from "path";
import { OutputAsset, OutputChunk, rollup } from "rollup";
import { minify as minifyHtml } from "html-minifier-terser";
import { minify as minifyJs } from "terser";
import {
  createRollupInputOptions,
  minifyHtmlOptions,
  rollupOutputOptions,
  terserOptions,
} from "./rollup-config";
import { transform as transformCss } from "lightningcss";

export const build = async (minify = false) => {
  const distDir = path.join(__dirname, "..", "..", "dist");

  fs.rmSync(distDir, { recursive: true });
  fs.mkdirSync(distDir, { recursive: true });

  // bundle with rollup
  const bundle = await rollup(createRollupInputOptions(minify));
  const { output } = await bundle.generate(rollupOutputOptions);

  let jsCode = (output.find((o) => o.fileName === "index.js") as OutputChunk)
    .code;

  let cssCode = (output.find((o) => o.fileName === "style.css") as OutputAsset)
    .source;

  for (const o of output)
    if (
      o.fileName !== "index.js" &&
      o.fileName !== "style.css" &&
      o.type === "asset"
    )
      fs.writeFileSync(path.join(distDir, o.fileName), o.source);

  // minify with terser
  if (minify) {
    const out = await minifyJs(jsCode, terserOptions);
    jsCode = out.code!;
  }

  cssCode = transformCss({
    targets: { chrome: 114, firefox: 115 },
    filename: "style.css",
    code: Buffer.from(cssCode),
    minify: minify,
    sourceMap: false,
  }).code.toString();

  let htmlContent = fs
    .readFileSync(path.join(__dirname, "..", "game", "index.html"))
    .toString();

  htmlContent = replace(
    htmlContent,
    "</body>",
    `</body><script>${jsCode}</script>`
  );

  htmlContent = replace(
    htmlContent,
    "</head>",
    `<style>${cssCode}</style></head>`
  );

  if (minify) htmlContent = await minifyHtml(htmlContent, minifyHtmlOptions);

  fs.writeFileSync(path.join(distDir, "index.html"), htmlContent);
};

const replace = (text: string, pattern: string, replace: string) => {
  const [before, after] = text.split(pattern);
  return before + replace + after;
};
