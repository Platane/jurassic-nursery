import * as fs from "fs";
import * as path from "path";
import { rollup } from "rollup";
import { minify as minifyHtml } from "html-minifier-terser";
import { minify as minifyJs } from "terser";
import {
  createRollupInputOptions,
  minifyHtmlOptions,
  rollupOutputOptions,
  terserOptions,
} from "./rollup-config";
import { transform } from "lightningcss";

export const build = async (minify = false) => {
  // bundle with rollup
  const bundle = await rollup(createRollupInputOptions(minify));
  let {
    output: [{ code: jsCode }],
  } = await bundle.generate(rollupOutputOptions);

  let cssCode = fs
    .readFileSync(path.join(__dirname, "..", "game", "index.css"))
    .toString();

  // minify with terser
  if (minify) {
    const out = await minifyJs(jsCode, terserOptions);
    jsCode = out.code!;
  }

  if (minify)
    cssCode = transform({
      filename: "style.css",
      code: Buffer.from(cssCode),
      minify: true,
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

  const distDir = path.join(__dirname, "..", "..", "dist");
  try {
    fs.rmSync(distDir, { recursive: true });
  } catch (err) {}
  fs.mkdirSync(distDir, { recursive: true });

  fs.writeFileSync(path.join(distDir, "index.html"), htmlContent);
};

const replace = (text: string, pattern: string, replace: string) => {
  const [before, after] = text.split(pattern);
  return before + replace + after;
};
