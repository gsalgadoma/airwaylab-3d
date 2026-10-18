import * as THREE from 'https://esm.sh/three@0.170.0';
import {GLTFLoader} from 'https://esm.sh/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';

/** Load authorized models with an explicit mesh-name -> educational structure map.
 * Does not download or replace the schematic model automatically.
 * External .gltf resources resolve relative to url. Prefer self-contained GLB.
 */
export async function loadAnatomicalModel(url, structures) {
  const {scene} = await new GLTFLoader().loadAsync(url);
  const meshes = new Map();
  scene.traverse(object => {
    if (!object.isMesh) return;
    const id = structures[object.name];
    // Clone materials so highlighting one structure cannot recolor others.
    object.material = Array.isArray(object.material)
      ? object.material.map(material => material.clone()) : object.material.clone();
    if (!id) return;
    object.userData.id = id;
    if (!meshes.has(id)) meshes.set(id, []);
    meshes.get(id).push(object);
  });
  if (!meshes.size) throw new Error('El modelo no contiene estructuras identificadas en el mapa.');
  const bounds = new THREE.Box3().setFromObject(scene);
  if (bounds.isEmpty()) throw new Error('El modelo no contiene geometría visible.');
  return {group:scene, meshMap:meshes, bounds};
}
