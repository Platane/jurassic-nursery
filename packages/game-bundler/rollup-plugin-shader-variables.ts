import { Plugin } from "rollup";

export const shaderVariables = () => {
  const renderChunk: Plugin["renderChunk"] = async (code) => {
    const variableNames = Array.from(
      new Set(
        Array.from(
          code.matchAll(
            /(in|out|uniform)\s+(uint|uvec4|uvec3|uvec2|float|sampler2D|int|vec4|vec3|vec2|mat4|mat3)\s+([auv]_\w+)/g
          )
        ).map(([_0, _1, _2, v]) => v)
      )
    );

    const map = new Map(
      variableNames.map((name, i) => [name, "v" + (i + 10).toString(36)])
    );

    const re = new RegExp(`\\W(` + variableNames.join("|") + `)\\W`, "g");

    return {
      code: code
        .replaceAll(re, (a, v) => a.replace(v, map.get(v)!))
        .replaceAll(re, (a, v) => a.replace(v, map.get(v)!))
        .replaceAll(re, (a, v) => a.replace(v, map.get(v)!)),
      map: { mappings: "" },
    };
  };

  return { name: "shader-variables", renderChunk } as Plugin;
};
