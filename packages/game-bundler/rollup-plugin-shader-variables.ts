import { Plugin } from "rollup";

export const shaderVariables = () => {
  const renderChunk: Plugin["renderChunk"] = async (code) => {
    const variableNames = Array.from(
      new Set(
        Array.from(
          code.matchAll(/(in|out|uniform)\s+(vec4|vec3|mat4|mat3)\s+(\w+)/g)
        ).map(([_0, _1, _2, v]) => v)
      )
    );

    const map = new Map(
      variableNames.map((name, i) => [name, "v" + (i + 10).toString(36)])
    );

    const re = new RegExp(`\\W(` + variableNames.join("|") + `)\\W`, "g");

    return {
      code: code.replace(re, (a, v) => a.replace(v, map.get(v)!)),
      map: { mappings: "" },
    };
  };

  return { name: "shader-variables", renderChunk } as Plugin;
};
