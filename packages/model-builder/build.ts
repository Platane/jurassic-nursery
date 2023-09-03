import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import * as fs from "node:fs";
import { MathUtils } from "three";

// monkey patch for gltf loader
class E {}
(global as any).ProgressEvent = E;

const loader = new GLTFLoader();

// const glb_url =
//   // "https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/Fox/glTF-Binary/Fox.glb";
//   "https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/RiggedSimple/glTF-Binary/RiggedSimple.glb";
// const { animations, scene, parser } = await loader.loadAsync(glb_url);
// const mesh = scene.children[0].children[0].children[1] as THREE.Mesh;

const buffer = fs.readFileSync(__dirname + "/model.glb");
const { animations, scene, parser } = await loader.parseAsync(
  Uint8Array.from(buffer).buffer,
  "model.glb"
);

const traverse = (n: THREE.Object3D, d = 0) => {
  console.log(" ".repeat(d) + "·", n.name);
  n.children.forEach((c) => traverse(c, d + 1));
};

traverse(scene);
const mesh = scene.children[0] as THREE.Mesh;

const getPositionVectors = (geo: THREE.BufferGeometry) => {
  const positions = geo.getAttribute("position")!;
  const indexes = geo.getIndex()!;

  return Array.from(indexes.array).map(
    (i) =>
      new THREE.Vector3(positions.getX(i), positions.getY(i), positions.getZ(i))
  );
};

// console.log(parser.json);

const vertices = getPositionVectors(mesh.geometry);

const bb = new THREE.Box3();
vertices.forEach((p) => bb.expandByPoint(p));

const center = bb.getCenter(new THREE.Vector3());
const size = bb.getSize(new THREE.Vector3());

const pack = new Uint8Array(
  vertices
    .map((v) =>
      [
        ((v.x - center.x + size.x / 2) / size.x) * 0.99,
        ((v.y - center.y + size.y / 2) / size.y) * 0.99,
        ((v.z - center.z + size.z / 2) / size.z) * 0.99,
      ].map((x) => x * 256)
    )
    .flat()
);

const assetDir = __dirname + "/../game/assets";

fs.mkdirSync(assetDir, { recursive: true });

fs.writeFileSync(assetDir + "/geometry.bin", pack);

console.log(size.toArray());
