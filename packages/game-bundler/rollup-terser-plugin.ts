import { Plugin } from "rollup";
import { minify, MinifyOptions } from "terser";

export const terser = (options: MinifyOptions) => {
  const renderChunk: Plugin["renderChunk"] = async (code) => {
    // minify with terser
    const out = await minify(code, options);
    return out.code!;
  };

  return { name: "glsl", renderChunk } as Plugin;
};
