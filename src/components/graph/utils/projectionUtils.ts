// 3D Projection Utilities

export interface Camera {
  x: number;
  y: number;
  z: number;
  fov: number;
}

export interface Projection {
  x: number;
  y: number;
  scale: number;
}

export function project3D(
  x: number,
  y: number,
  z: number,
  camera: Camera,
  width: number,
  height: number
): Projection {
  const scale = camera.fov / (camera.fov + z + camera.z);
  return {
    x: (x + camera.x) * scale + width / 2,
    y: (y + camera.y) * scale + height / 2,
    scale,
  };
}

