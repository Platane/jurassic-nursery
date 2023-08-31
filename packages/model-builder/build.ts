import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import * as fs from "node:fs";
import { MathUtils } from "three";

// monkey patch for gltf loader
class E {}
(global as any).ProgressEvent = E;

const loader = new GLTFLoader();

// const buffer = fs.readFileSync(__dirname + "/model.glb");
// const { animations, scene, parser } = await loader.parseAsync(
//   Uint8Array.from(buffer).buffer,
//   "model.glb"
// );

const glb_url =
  // "https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/Fox/glTF-Binary/Fox.glb";
  "https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/RiggedSimple/glTF-Binary/RiggedSimple.glb";
const { animations, scene, parser } = await loader.loadAsync(glb_url);

// const mesh = scene.children[0] as THREE.Mesh;
const mesh = scene.children[0].children[0].children[1] as THREE.Mesh;

const getPositionVectors = (geo: THREE.BufferGeometry) => {
  const positions = geo.getAttribute("position")!;
  const indexes = geo.getIndex()!;

  return Array.from(indexes.array).map(
    (i) =>
      new THREE.Vector3(positions.getX(i), positions.getY(i), positions.getZ(i))
  );
};

console.log(parser.json);

const vertices = getPositionVectors(mesh.geometry);

const pack = new Float32Array(vertices.flatMap((v) => v.toArray()));

fs.writeFileSync(__dirname + "/../game/assets/geometry.bin", pack);

fs.writeFileSync(__dirname + "/../game/assets/bones.bin", pack);

fs.writeFileSync(__dirname + "/../game/assets/animation.bin", pack);
