import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Camera } from '../utils/projectionUtils';

const DEFAULT_CAMERA: Camera = { 
  x: 0,      // Centered on anchors
  y: 0,      // Centered on anchors
  z: -700,   // Pull back to see graph
  fov: 2000  // Wide-angle to fit all anchors (±350 units)
};

// Node interface for auto-framing
interface Node {
  x?: number;
  y?: number;
  z?: number;
}

// Auto-framing function to center on all visible nodes
export function autoFrameCamera(nodes: Node[]): Camera {
  if (nodes.length === 0) return DEFAULT_CAMERA;
  
  // Calculate bounding box
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  
  nodes.forEach(n => {
    if (n.x !== undefined) {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
    }
    if (n.y !== undefined) {
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    }
    if (n.z !== undefined) {
      minZ = Math.min(minZ, n.z);
      maxZ = Math.max(maxZ, n.z);
    }
  });
  
  // Center camera on bounding box
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;
  
  // Calculate required distance to fit all nodes
  const width = maxX - minX;
  const height = maxY - minY;
  const depth = maxZ - minZ;
  const maxDimension = Math.max(width, height, depth);
  
  const distance = maxDimension * 1.5; // 1.5x padding
  
  return {
    x: -centerX,
    y: -centerY,
    z: -centerZ - distance,
    fov: 1200
  };
}

export function useCamera(onCameraChange?: (camera: Camera) => void) {
  // Load camera from localStorage if available
  const savedCamera = useMemo(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kg-camera');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return DEFAULT_CAMERA;
        }
      }
    }
    return DEFAULT_CAMERA;
  }, []);
  
  const [camera, setCamera] = useState<Camera>(savedCamera);
  const cameraUpdateTimeoutRef = useRef<number | undefined>(undefined);
  const pendingCameraUpdateRef = useRef<{ x: number; y: number } | null>(null);
  const cameraRef = useRef<Camera>(savedCamera);
  
  // Keep cameraRef in sync with camera state
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  // Save camera position when it changes
  useEffect(() => {
    if (onCameraChange) {
      onCameraChange(camera);
    }
    if (typeof window !== 'undefined') {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('kg-camera', JSON.stringify(camera));
      }, 500); // Debounce saves
      return () => clearTimeout(timeoutId);
    }
  }, [camera, onCameraChange]);

  const handleMouseMove = useCallback((dx: number, dy: number) => {
    // Cancel any pending animation frame
    if (cameraUpdateTimeoutRef.current) {
      cancelAnimationFrame(cameraUpdateTimeoutRef.current);
    }
    
    // Calculate new position using current camera state from ref (always up-to-date)
    const currentCamera = cameraRef.current;
    const newX = currentCamera.x + dx;
    const newY = currentCamera.y + dy;
    
    // Store pending update directly
    pendingCameraUpdateRef.current = { x: newX, y: newY };
    
    // Debounce camera updates to 60fps (16ms)
    cameraUpdateTimeoutRef.current = requestAnimationFrame(() => {
      const pending = pendingCameraUpdateRef.current;
      if (pending) {
        setCamera(prev => ({
          ...prev,
          x: pending.x,
          y: pending.y
        }));
        pendingCameraUpdateRef.current = null;
      }
    });
  }, []);

  const handleWheel = useCallback((deltaY: number) => {
    if (cameraUpdateTimeoutRef.current) {
      cancelAnimationFrame(cameraUpdateTimeoutRef.current);
    }
    cameraUpdateTimeoutRef.current = requestAnimationFrame(() => {
      setCamera(p => ({...p, z: Math.max(-1500, Math.min(1500, p.z + deltaY))}));
    });
  }, []);

  const resetCamera = useCallback(() => {
    setCamera(DEFAULT_CAMERA);
  }, []);

  useEffect(() => {
    return () => {
      if (cameraUpdateTimeoutRef.current) {
        cancelAnimationFrame(cameraUpdateTimeoutRef.current);
      }
    };
  }, []);

  return {
    camera,
    setCamera,
    handleMouseMove,
    handleWheel,
    resetCamera,
  };
}

