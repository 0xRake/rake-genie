import { useCallback, useRef, useState, useEffect } from 'react';
import { GROUP_ANCHORS } from '@/data/anchors';
import { performanceMonitor } from '../utils/performanceMonitor';

export interface Node {
  id: string;
  group: string;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  degree?: number;
}

export interface Link {
  source: string | Node;
  target: string | Node;
  type?: string;
}

type SetNodesDispatch = React.Dispatch<React.SetStateAction<Node[]>>;

export function usePhysics(_nodes: Node[], links: Link[], externalPaused: boolean) {
  const [physicsPaused, setPhysicsPaused] = useState(false);
  const lastPhysicsTimeRef = useRef<number>(0);
  const physicsIntervalRef = useRef<number>(33); // ~30fps
  const reqRef = useRef<number | undefined>(undefined);

  // Ref to store the latest updatePhysics callback for recursive calls
  const updatePhysicsRef = useRef<((setNodes: SetNodesDispatch) => void) | null>(null);

  const updatePhysics = useCallback((setNodes: SetNodesDispatch) => {
    const physicsStart = performance.now();
    const now = performance.now();

    // Throttle to ~30fps (33ms intervals)
    if (now - lastPhysicsTimeRef.current < physicsIntervalRef.current) {
      if (!physicsPaused && !externalPaused) {
        reqRef.current = requestAnimationFrame(() => updatePhysicsRef.current?.(setNodes));
      }
      return;
    }
    lastPhysicsTimeRef.current = now;

    setNodes(prev => {
      const next = [...prev];
      let maxVelocity = 0;

      // Anchor force (pull towards group anchors) - BASELINE values
      next.forEach(n => {
        const anchor = GROUP_ANCHORS[n.group as keyof typeof GROUP_ANCHORS] || { x: 0, y: 0, z: 0 };
        const isMasterNode = (n as any).r >= 40;
        const anchorStrength = isMasterNode ? 0.006 : 0.003;
        n.vx = (n.vx || 0) + (anchor.x - n.x!) * anchorStrength;
        n.vy = (n.vy || 0) + (anchor.y - n.y!) * anchorStrength;
        n.vz = (n.vz || 0) + (anchor.z - n.z!) * anchorStrength;
      });

      // Repulsion between nodes - BASELINE values
      for (let i = 0; i < next.length; i++) {
        for (let j = i + 1; j < next.length; j++) {
          const dx = next[i].x! - next[j].x!;
          const dy = next[i].y! - next[j].y!;
          const dz = next[i].z! - next[j].z!;
          const distSq = dx*dx + dy*dy + dz*dz || 1;
          const nodeI = next[i] as any;
          const nodeJ = next[j] as any;
          const isMasterI = nodeI.r >= 40;
          const isMasterJ = nodeJ.r >= 40;
          const repulsionRadius = (isMasterI || isMasterJ) ? 600 : 500;
          const repulsionStrength = (isMasterI && isMasterJ) ? 1.5 : (isMasterI || isMasterJ) ? 1.2 : 0.5;
          
          if (distSq < repulsionRadius * repulsionRadius) {
            const f = (15000 / distSq) * repulsionStrength;
            const dist = Math.sqrt(distSq);
            next[i].vx = (next[i].vx || 0) + (dx/dist)*f; 
            next[i].vy = (next[i].vy || 0) + (dy/dist)*f;
            next[i].vz = (next[i].vz || 0) + (dz/dist)*f;
            next[j].vx = (next[j].vx || 0) - (dx/dist)*f; 
            next[j].vy = (next[j].vy || 0) - (dy/dist)*f;
            next[j].vz = (next[j].vz || 0) - (dz/dist)*f;
          }
        }
      }

      // Attraction along links - BASELINE values
      links.forEach(l => {
        const s = typeof l.source === 'object' ? l.source : next.find(n => n.id === l.source);
        const t = typeof l.target === 'object' ? l.target : next.find(n => n.id === l.target);
        if (!s || !t) return;
        const dx = t.x! - s.x!;
        const dy = t.y! - s.y!;
        const dz = t.z! - s.z!;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1;
        const isBackbone = l.type === 'backbone';
        const targetDist = isBackbone ? 250 : 100;
        const strength = isBackbone ? 0.005 : 0.002;
        const f = (dist - targetDist) * strength;
        s.vx = (s.vx || 0) + (dx/dist)*f; 
        s.vy = (s.vy || 0) + (dy/dist)*f;
        s.vz = (s.vz || 0) + (dz/dist)*f;
        t.vx = (t.vx || 0) - (dx/dist)*f; 
        t.vy = (t.vy || 0) - (dy/dist)*f;
        t.vz = (t.vz || 0) - (dz/dist)*f;
      });

      // Damping and update positions - BASELINE values
      next.forEach(n => {
        n.vx = (n.vx || 0) * 0.88; 
        n.vy = (n.vy || 0) * 0.88; 
        n.vz = (n.vz || 0) * 0.88;
        n.x = (n.x || 0) + (n.vx || 0); 
        n.y = (n.y || 0) + (n.vy || 0); 
        n.z = (n.z || 0) + (n.vz || 0);
        
        // Track max velocity for pause detection
        const vel = Math.sqrt((n.vx || 0)**2 + (n.vy || 0)**2 + (n.vz || 0)**2);
        maxVelocity = Math.max(maxVelocity, vel);
      });

      // Pause physics when velocities are very low (graph is stable)
      if (maxVelocity < 0.01 && !physicsPaused) {
        setPhysicsPaused(true);
      } else if (maxVelocity >= 0.01 && physicsPaused) {
        setPhysicsPaused(false);
      }

      return next;
    });
    
    // Record physics performance
    const physicsTime = performance.now() - physicsStart;
    performanceMonitor.recordPhysicsTime(physicsTime);
    
    // Only continue animation if not paused (internal or external)
    if (!physicsPaused && !externalPaused) {
      reqRef.current = requestAnimationFrame(() => updatePhysicsRef.current?.(setNodes));
    }
  }, [links, physicsPaused, externalPaused]);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    updatePhysicsRef.current = updatePhysics;
  }, [updatePhysics]);

  return {
    physicsPaused,
    updatePhysics,
    reqRef,
    setPhysicsPaused,
  };
}
