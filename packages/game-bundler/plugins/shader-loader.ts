/// <reference types="bun-types" />

type BunPlugin = NonNullable<
  Parameters<typeof Bun.build>[0]["plugins"]
>[number];

export const shaderLoaderPlugin: BunPlugin = {
  name: "shader-loader",
  async setup(build) {
    const { readFileSync } = await import("fs");

    // when a .yaml file is imported...
    build.onLoad({ filter: /\.(frag|vert)$/ }, ({ path }) => {
      // read and parse the file
      let contents = readFileSync(path, "utf8");

      if (build.config.minify) contents = minifyGlsl(contents);

      return { contents, loader: "text" };
    });
  },
};

// yolo
const minifyGlsl = (code: string) =>
  code
    // remove comment
    .replace(/\/\/[^\n]*/g, "\n")

    // pack multiple line break
    .replace(/\s*\n\s*/g, "\n")

    // pack white spaces
    .replace(/[\t ]+/g, " ")

    // remove white spaces when not between two words
    .replace(/[^\w]([ \n])+/g, (a) => a.trim())
    .replace(/([ \n])+[^\w]/g, (a) => a.trim())
    .trim();
