import * as THREE from 'https://esm.sh/three@0.170.0';

// Fit the actual oriented box, rather than a sphere that wastes space on tall models.
export function frameExtents(bounds, quaternion) {
  const center = bounds.getCenter(new THREE.Vector3());
  const inverse = quaternion.clone().invert();
  const points = [];
  for (const x of [bounds.min.x,bounds.max.x])
    for (const y of [bounds.min.y,bounds.max.y])
      for (const z of [bounds.min.z,bounds.max.z])
        points.push(new THREE.Vector3(x,y,z).sub(center).applyQuaternion(inverse));
  return {points, x:Math.max(...points.map(p=>Math.abs(p.x))),
    y:Math.max(...points.map(p=>Math.abs(p.y)))};
}

export function fitDistance(bounds, camera) {
  const vertical = Math.tan(THREE.MathUtils.degToRad(camera.fov)/2);
  const horizontal = vertical*camera.aspect;
  return Math.max(...frameExtents(bounds,camera.quaternion).points.flatMap(point =>
    [point.z+Math.abs(point.x)/horizontal, point.z+Math.abs(point.y)/vertical]))*1.12;
}
