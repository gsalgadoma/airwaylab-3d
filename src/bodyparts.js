import * as THREE from 'https://esm.sh/three@0.170.0';
import {loadAnatomicalModel} from './model-loader.js';

export async function loadBodyParts() {
  const response = await fetch(new URL('../assets/bodyparts3d/manifest.json', import.meta.url));
  if (!response.ok) throw new Error('No se pudo leer el manifiesto BodyParts3D.');
  const manifest = await response.json();
  const structures = Object.fromEntries(manifest.meshes.map(mesh => [mesh.mesh, mesh.structure]));
  const model = await loadAnatomicalModel(new URL('../assets/bodyparts3d/airway.glb', import.meta.url).href, structures);
  model.group.traverse(object => {
    if (!object.isMesh) return;
    if (!object.geometry.attributes.normal) object.geometry.computeVertexNormals();
    const item = manifest.meshes.find(mesh => mesh.mesh === object.name);
    if (!item) throw new Error('Malla sin procedencia: ' + object.name);
    object.userData.fma = item.fma;
    object.userData.label = item.label;
    object.material = new THREE.MeshStandardMaterial({roughness:.62, side:THREE.DoubleSide, transparent:true, opacity:.86});
  });
  // Source coordinates: Z superior, negative Y anterior. Rotate without mirroring.
  model.group.rotation.x = -Math.PI/2;
  model.group.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model.group);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  model.group.position.sub(center);
  const root = new THREE.Group();
  root.add(model.group);
  // One shared transform preserves the relative position and size of every part.
  root.scale.setScalar(6 / size.y);
  root.position.y = -.3;
  root.updateMatrixWorld(true);
  return {...model, group:root, manifest};
}
