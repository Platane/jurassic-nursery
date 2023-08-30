import chokidar from "chokidar";
import * as path from "node:path";
import * as fs from "node:fs";
import { build } from "./build";

const outDir = path.join(import.meta.dir, "../game");

let onChange: () => void;
let onChangePromise = new Promise<void>((r) => {
  onChange = r;
});

chokidar.watch(outDir).on("all", () => {
  onChange();
  onChangePromise = new Promise<void>((r) => {
    onChange = r;
  });
});

const injectWatcher = (html: string) => {
  function code() {
    let delay = 0;

    const loop = () => {
      fetch("/__watcher")
        .then(async (res) => {
          delay = 0;
          if ((await res.text()) === "refresh")
            setTimeout(() => window.location.reload(), 100);

          loop();
        })
        .catch(() => {
          setTimeout(loop, delay);
          delay = Math.min(5000, delay * 2 + 100);
        });
    };

    loop();
  }

  return html.replace(
    "</head>",
    `<script>;(${code.toString()})()</script></head>`
  );
};

Bun.serve({
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (pathname === "/__watcher") {
      await onChangePromise;

      return new Response("refresh");
    }

    try {
      const a = performance.now();
      await build();
      console.log("build in ", performance.now() - a, "ms");
    } catch (err) {}

    const assetName = path.join(
      __dirname,
      "..",
      "..",
      "dist",
      pathname === "/" ? "index.html" : pathname.slice(1)
    );

    if (!fs.existsSync(assetName)) return new Response("", { status: 404 });

    const content = fs.readFileSync(assetName);

    if (path.extname(assetName) === ".html")
      return new Response(injectWatcher(content.toString()), {
        headers: { "content-type": "text/html" },
      });

    return new Response(content);
  },
});
