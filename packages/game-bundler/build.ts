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
  // bundle with rollup
  const b = await rollup(createRollupInputOptions(minify));
  const { output } = await b.generate(rollupOutputOptions);

  return bundle(output, minify);
};

export const bundle = async (
  output: (OutputChunk | OutputAsset)[],
  minify = false
) => {
  let jsCode = (output.find((o) => o.fileName === "index.js") as OutputChunk)
    .code;

  let cssCode = (output.find((o) => o.fileName === "style.css") as OutputAsset)
    .source;

  // minify with terser
  if (minify) {
    const out = await minifyJs(jsCode, terserOptions);
    jsCode = out.code!;
  }

  if (minify)
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

  return {
    "index.html": htmlContent,
    ...Object.fromEntries(
      output
        .filter((o) => o.fileName !== "index.js" && o.fileName !== "style.css")
        .map((o) => [o.fileName, o.type === "chunk" ? o.code : o.source])
    ),
  } as Record<string, string | Buffer>;
};

const replace = (text: string, pattern: string, replace: string) => {
  const [before, after] = text.split(pattern);
  return before + replace + after;
};
