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
import { Input, Packer } from "roadroller";

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
  let jsCode =
    (output.find((o) => o.fileName === "index.js") as OutputChunk)?.code || "";

  let cssCode =
    (output.find((o) => o.fileName === "style.css") as OutputAsset)?.source ??
    "";

  const assets = Object.fromEntries(
    output
      .filter((o) => o.fileName !== "index.js" && o.fileName !== "style.css")
      .map((o) => [o.fileName, o.type === "chunk" ? o.code : o.source])
  );

  const filenameAlias = new Map(
    Object.keys(assets).map((filename, i) => [filename, i.toString()])
  );

  filenameAlias.forEach((alias, filename) => {
    jsCode = jsCode.replaceAll(filename, alias);
  });

  jsCode = replaceSomeVar(jsCode);

  // minify with terser
  if (minify) {
    jsCode = optimizeGlMatrix(jsCode);

    const out = await minifyJs(jsCode, terserOptions);
    jsCode = out.code!;

    const packer = new Packer(
      [{ data: jsCode, type: "js", action: "eval" } as Input],
      { allowFreeVars: true }
    );
    await packer.optimize(2);

    const { firstLine, secondLine } = packer.makeDecoder();

    jsCode = firstLine + secondLine;
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
      Object.entries(assets).map(([filename, content]) => [
        filenameAlias.get(filename),
        content,
      ])
    ),
  } as Record<string, string | Buffer>;
};

const replaceSomeVar = (code: string) => {
  const words = [
    "go-to-food",
    "eating",
    "idle",
    "happy",
    "in-love",
    "say-no",
    "carried",
    "leaving-hesitation",
    "leaving",
  ];

  words.forEach((w, i) => (code = code.replaceAll(`"${w}"`, i + "")));
  return code;
};

const replace = (text: string, pattern: string, replace: string) => {
  const [before, after] = text.split(pattern);
  return before + replace + after;
};

const forceArrowFunction = (code: string) =>
  code.replaceAll(/^function\s+([^(]+)\(([^)]*)\)/gm, (_, name, args) => {
    return `const ${name} = (${args}) =>`;
  });

const optimizeGlMatrix = (code: string) => {
  code = code
    // remove some needless compat code
    .replace("typeof Float32Array", '"object"')
    .replace(/if\s*\(\s*!\s*Math.hypot\s*\)/, "if(false)");

  return forceArrowFunction(code);
};
