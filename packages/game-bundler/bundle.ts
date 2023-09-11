import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";
import { build } from "./build";

const listFiles = (filename: string): string[] => {
  const stat = fs.statSync(filename);
  if (stat.isFile()) return [filename];
  if (stat.isDirectory())
    return fs
      .readdirSync(filename)
      .map((f) => listFiles(path.join(filename, f)))
      .flat();
  return [];
};

const distDir = path.join(__dirname, "..", "..", "dist");
fs.rmSync(distDir, { recursive: true });
fs.mkdirSync(distDir, { recursive: true });

const assets = await build(true);

for (const [fileName, content] of Object.entries(assets))
  fs.writeFileSync(path.join(distDir, fileName), content);

execFileSync("advzip", [
  "--add",
  "--shrink-insane",
  path.join(distDir, "bundle.zip"),
  ...listFiles(distDir).filter(
    (fileName) => !fileName.endsWith("bundle-stats.html")
  ),
]);

//
// write size info
{
  const size = fs.statSync(path.join(distDir, "bundle.zip")).size;
  const literalSize = (size / 1024).toFixed(2) + "K";
  const content = {
    label: "size",
    message: literalSize,
    color: size < 13312 ? "success" : "important",
  };
  fs.writeFileSync(
    path.join(distDir, "shieldio_size.json"),
    JSON.stringify(content)
  );

  console.log(literalSize);
}
