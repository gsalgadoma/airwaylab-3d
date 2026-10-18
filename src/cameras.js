// Share target, orientation and roll, including when the user pans.
export function synchronizeProjection(camera, projection, target) {
  projection.position.copy(camera.position).sub(target).normalize().multiplyScalar(16).add(target);
  projection.quaternion.copy(camera.quaternion);
  projection.updateMatrixWorld();
}
