import * as path from "node:path";
import { bundle } from "./build";
import { watch } from "rollup";
import { createRollupInputOptions, rollupOutputOptions } from "./rollup-config";

let assets: Awaited<ReturnType<typeof bundle>> = {};
let onChange: () => void;
const reset = () => {
  onChangePromise = new Promise((r) => {
    onChange = () => {
      reset();
      r();
    };
  });
};
let onChangePromise: Promise<void>;
reset();

const b = watch({
  ...createRollupInputOptions(false),
  watch: { skipWrite: true },
});

b.on("event", async (e) => {
  if (e.code === "ERROR") {
    console.error(e.error);

    assets = {
      "index.html": injectWatcher(
        `<html><head></head><pre>${e.error.message}</pre></html>`
      ),
    };

    onChange();
  }

  if (e.code === "BUNDLE_END") {
    const a = Date.now();

    const { output } = await e.result.generate(rollupOutputOptions);

    assets = await bundle(output);

    console.log("re-built", e.duration + (Date.now() - a), "ms");

    onChange();
  }
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
    let { pathname } = new URL(req.url);

    if (pathname === "/__watcher") {
      await onChangePromise;

      return new Response("refresh");
    }

    if (pathname === "/") pathname = "index.html";
    else pathname = pathname.slice(1);

    const content = assets[pathname];

    if (!content)
      return new Response(injectWatcher("<html><head></head>404</html>"), {
        status: 404,
        headers: { "content-type": "text/html" },
      });

    if (path.extname(pathname) === ".html")
      return new Response(injectWatcher(content.toString()), {
        headers: { "content-type": "text/html" },
      });

    return new Response(content);
  },
});
