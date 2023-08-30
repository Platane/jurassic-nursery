import * as path from "path";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { InputOptions, OutputOptions } from "rollup";
import { MinifyOptions } from "terser";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import esbuild from "rollup-plugin-esbuild";
import { glsl } from "./rollup-plugin-glsl";

export const terserOptions: MinifyOptions = {
  compress: {
    keep_infinity: true,
    pure_getters: true,
    unsafe_arrows: true,
    unsafe_math: true,
    unsafe_methods: true,
    inline: true,
    booleans_as_integers: true,
    passes: 10,
  },
  format: {
    wrap_func_args: false,
    comments: false,
  },
  mangle: { properties: true, toplevel: true },
  ecma: 2020,
  toplevel: true,
};

export const minifyHtmlOptions = {
  collapseWhitespace: true,
  useShortDoctype: true,
  minifyCSS: true,
};

export const createRollupInputOptions = (production: boolean) =>
  ({
    input: path.resolve(__dirname, "..", "game", "index.ts"),

    plugins: [
      commonjs(),

      resolve({
        extensions: [".ts", ".js"],
      }),

      esbuild({
        include: ["**/*.ts"],
        exclude: /node_modules/,
        sourceMap: false,
        target: "es2022",
        define: {
          "process.env.NODE_ENV": production ? '"production"' : '"dev"',
        },
      }),

      glsl({
        include: ["**/*.frag", "**/*.vert"],
        compress: production,
      }),

      // ...(production
      //   ? [
      //       compiler({
      //         language_in: "ECMASCRIPT_2020",
      //         language_out: "ECMASCRIPT_2020",
      //         compilation_level: "ADVANCED",
      //         // assume_function_wrapper: true,
      //       }),
      //     ]
      //   : []),
    ],
  }) as InputOptions;

export const rollupOutputOptions = {
  format: "es",
  sourcemap: false,
} satisfies OutputOptions;
