'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Box } from 'lucide-react';
import { GROUP_ANCHORS } from '@/data/anchors';
import { GRAPH_DATA } from '@/data/graph-data';
import { StaticCortex } from './StaticCortex';
import { project3D, Camera } from './utils/projectionUtils';
import { usePhysics, Node, Link } from './hooks/usePhysics';
import { useCamera } from './hooks/useCamera';
import { performanceMonitor } from './utils/performanceMonitor';
import { GROUP_COLORS, GROUP_COLORS_DARK, GROUP_COLORS_LIGHT, MASTER_NODE_COLORS } from './constants/colors';

// Real-time metrics overlay showing business value
const DemoMetrics = () => (
  <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white max-w-sm z-20">
    <h3 className="text-sm font-bold mb-3">Palantir + o9: Integration Value</h3>
    <div className="space-y-2 text-xs">
      <div className="flex justify-between">
        <span>ERP Systems Integrated:</span>
        <span className="font-mono text-green-400">7 in 5 days</span>
      </div>
      <div className="flex justify-between">
        <span>Data Unification:</span>
        <span className="font-mono text-blue-400">Real-time</span>
      </div>
      <div className="flex justify-between">
        <span>o9 Forecast Accuracy:</span>
        <span className="font-mono text-green-400">70% → 85%+</span>
      </div>
      <div className="flex justify-between">
        <span>Annual Savings:</span>
        <span className="font-mono text-green-400">$50-100M</span>
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-3 italic">
      &quot;We don&apos;t replace o9. We complete o9.&quot;
    </p>
  </div>
);

// Group-specific story descriptions for demo narrative
const getGroupStory = (group: string): string => {
  const stories: Record<string, string> = {
    'os': 'Palantir Foundry Core - The Operating System',
    'aip': 'AI-Powered Intelligence - Completes o9 Planning',
    'ontology': 'Unified Data Model - What o9 Needs',
    'data': 'ERP Integration - 7 Systems in 5 Days',
    'app': 'Operational Applications - Real-Time Decisions',
    'target': 'o9 Solutions - Planning Layer',
    'source': 'SAP/Oracle - Source Systems',
    'strategy': 'Supply Chain Strategy - End-to-End'
  };
  return stories[group] || group;
};

export interface NeuralGraphNode extends Node {
  label: string;
  r: number;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  desc?: string;
  utility?: string;
}

interface NeuralGraphProps {
  onNodeClick: (node: NeuralGraphNode, isShift: boolean) => void;
  selectedNodes: string[];
  isDarkMode?: boolean;
  onCameraChange?: (camera: Camera) => void;
  physicsPaused?: boolean;
  onLinkTraversal?: (sourceId: string, targetId: string) => void;
  getTraversalStrength?: (sourceId: string, targetId: string) => number;
  highlightedPath?: string[];
  visibleGroups?: Set<string>;
  onNodeHover?: (nodeId: string | null) => void;
}

export function NeuralGraph({
  onNodeClick,
  selectedNodes,
  isDarkMode = true,
  onCameraChange,
  physicsPaused: externalPaused = false,
  onLinkTraversal,
  getTraversalStrength,
  highlightedPath = [],
  visibleGroups,
  onNodeHover,
}: NeuralGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NeuralGraphNode[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [focusedNodeIndex, setFocusedNodeIndex] = useState<number>(-1);
  const [isInitializing, setIsInitializing] = useState(true);
  const [physicsStabilized, setPhysicsStabilized] = useState(false);

  const { camera, setCamera, handleMouseMove, handleWheel, resetCamera } = useCamera(onCameraChange);
  
  // Camera control functions for GraphControls
  const zoomIn = useCallback(() => {
    handleWheel(-50);
  }, [handleWheel]);
  
  const zoomOut = useCallback(() => {
    handleWheel(50);
  }, [handleWheel]);
  
  // Physics hook
  const { physicsPaused: internalPaused, updatePhysics, reqRef } = usePhysics(nodes, links, externalPaused);
  const physicsPaused = internalPaused || externalPaused;

  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({ 
          width: containerRef.current.clientWidth || window.innerWidth, 
          height: containerRef.current.clientHeight || window.innerHeight 
        });
      }
    };
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Initialize nodes and links
  useEffect(() => {
    const mounted = { current: true };
    
    const initTimer = setTimeout(() => {
      if (!mounted.current) return;
      
      setIsInitializing(true);
      setPhysicsStabilized(false);
      const filteredNodes = visibleGroups && visibleGroups.size > 0
        ? GRAPH_DATA.nodes.filter(n => visibleGroups.has(n.group))
        : GRAPH_DATA.nodes;
      
// BASELINE: Known working values
const initialNodes = filteredNodes.map(n => {
  const anchor = GROUP_ANCHORS[n.group as keyof typeof GROUP_ANCHORS] || { x: 0, y: 0, z: 0 };
  
  const spread = 200;
  const randomX = (Math.random() - 0.5) * spread;
  const randomY = (Math.random() - 0.5) * spread;
  const randomZ = (Math.random() - 0.5) * spread;
  
  return {
    ...n,
    x: anchor.x + randomX,
    y: anchor.y + randomY,
    z: anchor.z + randomZ,
    vx: 0,
    vy: 0,
    vz: 0,
    degree: 0
  } as NeuralGraphNode;
});

      const initialLinks = GRAPH_DATA.links
        .filter(l => {
          const sourceExists = initialNodes.some(n => n.id === l.source);
          const targetExists = initialNodes.some(n => n.id === l.target);
          return sourceExists && targetExists;
        })
        .map(l => {
          const sourceNode = initialNodes.find(n => n.id === l.source);
          const targetNode = initialNodes.find(n => n.id === l.target);
          if (!sourceNode || !targetNode) return null;
          return {
            ...l,
            source: sourceNode,
            target: targetNode
          };
        })
        .filter((l): l is NonNullable<typeof l> => l !== null);

      // Calculate node degrees
      initialLinks.forEach(l => {
        const s = typeof l.source === 'object' ? l.source : null;
        const t = typeof l.target === 'object' ? l.target : null;
        if (s) s.degree = (s.degree || 0) + 1;
        if (t) t.degree = (t.degree || 0) + 1;
      });

      setNodes(initialNodes);
      setLinks(initialLinks as Link[]);
      setIsInitializing(false);
      setTimeout(() => setPhysicsStabilized(true), 2000);
    }, 100);
    
    return () => {
      mounted.current = false;
      clearTimeout(initTimer);
    };
  }, [visibleGroups]);

  // Recreate links from GRAPH_DATA whenever nodes change to ensure they reference current node objects
  // This is critical because physics updates create new node objects, breaking old references
  useEffect(() => {
    if (nodes.length === 0) return;
    
    // Create a map for O(1) node lookup
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    // Recreate all links from GRAPH_DATA, referencing current node objects
    const updatedLinks = GRAPH_DATA.links
      .filter(l => {
        // Only include links where both nodes exist in current nodes array
        return nodeMap.has(l.source) && nodeMap.has(l.target);
      })
      .map(l => {
        const sourceNode = nodeMap.get(l.source);
        const targetNode = nodeMap.get(l.target);
        
        if (!sourceNode || !targetNode) return null;
        
        // Verify nodes have valid positions
        if (sourceNode.x === undefined || sourceNode.y === undefined || sourceNode.z === undefined ||
            targetNode.x === undefined || targetNode.y === undefined || targetNode.z === undefined) {
          return null;
        }
        
        return {
          ...l,
          source: sourceNode,
          target: targetNode
        };
      })
      .filter((l): l is NonNullable<typeof l> => l !== null) as Link[];
    
    // Update links state if we have valid links
    if (updatedLinks.length > 0) {
      setLinks(updatedLinks);
    }
  }, [nodes]);

  // Start physics simulation
  useEffect(() => {
    if (!physicsPaused && !externalPaused && nodes.length > 0) {
      updatePhysics(setNodes as React.Dispatch<React.SetStateAction<Node[]>>);
    }
    
    const perfInterval = setInterval(() => {
      performanceMonitor.updateFPS();
      performanceMonitor.checkPerformance(nodes.length, links.length);
    }, 1000);
    
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      clearInterval(perfInterval);
    };
  }, [updatePhysics, physicsPaused, externalPaused, nodes.length, links.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMoveEvent = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    handleMouseMove(dx, dy);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleWheelEvent = (e: React.WheelEvent) => {
    handleWheel(e.deltaY);
  };

  const isHighway = (link: Link) => {
    if (selectedNodes.length < 2) return false;
    const sId = typeof link.source === 'object' ? link.source.id : link.source;
    const tId = typeof link.target === 'object' ? link.target.id : link.target;
    return selectedNodes.includes(sId) && selectedNodes.includes(tId);
  };

  const isPathLink = (link: Link) => {
    if (highlightedPath.length < 2) return false;
    const sId = typeof link.source === 'object' ? link.source.id : link.source;
    const tId = typeof link.target === 'object' ? link.target.id : link.target;
    for (let i = 0; i < highlightedPath.length - 1; i++) {
      if ((highlightedPath[i] === sId && highlightedPath[i + 1] === tId) ||
          (highlightedPath[i] === tId && highlightedPath[i + 1] === sId)) {
        return true;
      }
    }
    return false;
  };

  const viewportBounds = useMemo(() => {
    // Larger margin to ensure links are visible even when nodes are slightly off-screen
    const margin = 0.5;
    return {
      left: -dimensions.width * margin,
      right: dimensions.width * (1 + margin),
      top: -dimensions.height * margin,
      bottom: dimensions.height * (1 + margin)
    };
  }, [dimensions.width, dimensions.height]);

  const projectedNodes = useMemo(() => {
    return nodes
      .filter(n => n.x !== undefined && n.y !== undefined && n.z !== undefined)
      .map(n => {
        const projection = project3D(n.x!, n.y!, n.z!, camera, dimensions.width, dimensions.height);
        const inViewport = projection.scale > 0 &&
          projection.x >= viewportBounds.left &&
          projection.x <= viewportBounds.right &&
          projection.y >= viewportBounds.top &&
          projection.y <= viewportBounds.bottom;
        return { node: n, projection, inViewport };
      })
      .filter(np => np.inViewport);
  }, [nodes, camera, dimensions.width, dimensions.height, viewportBounds]);

  const projectedLinks = useMemo(() => {
    // Always resolve links from current nodes to ensure we have latest positions
    // Build a node lookup map for performance
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    return links.map(l => {
      // Get source and target IDs
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      
      // Find current node objects from nodes state using map for O(1) lookup
      const s = nodeMap.get(sourceId);
      const t = nodeMap.get(targetId);
      
      if (!s || !t) return null;
      
      // Verify nodes have valid 3D coordinates
      if (s.x === undefined || s.y === undefined || s.z === undefined || 
          t.x === undefined || t.y === undefined || t.z === undefined) {
        return null;
      }
      
      // Project 3D coordinates to 2D screen space
      const sp = project3D(s.x, s.y, s.z, camera, dimensions.width, dimensions.height);
      const tp = project3D(t.x, t.y, t.z, camera, dimensions.width, dimensions.height);
      
      // Skip links that are behind the camera or too small
      if (sp.scale <= 0 || tp.scale <= 0) return null;
      
      // Check if link intersects viewport (more lenient check)
      const sourceInViewport = sp.x >= viewportBounds.left && sp.x <= viewportBounds.right &&
                               sp.y >= viewportBounds.top && sp.y <= viewportBounds.bottom;
      const targetInViewport = tp.x >= viewportBounds.left && tp.x <= viewportBounds.right &&
                               tp.y >= viewportBounds.top && tp.y <= viewportBounds.bottom;
      
      // Show link if either endpoint is visible OR if link might cross viewport
      // This ensures links connecting nodes are visible even if one node is slightly off-screen
      const linkCrossesViewport = 
        (sp.x >= viewportBounds.left && sp.x <= viewportBounds.right) ||
        (tp.x >= viewportBounds.left && tp.x <= viewportBounds.right) ||
        (sp.y >= viewportBounds.top && sp.y <= viewportBounds.bottom) ||
        (tp.y >= viewportBounds.top && tp.y <= viewportBounds.bottom);
      
      if (!sourceInViewport && !targetInViewport && !linkCrossesViewport) return null;
      
      return { link: l, source: s, target: t, sp, tp };
    }).filter((l): l is NonNullable<typeof l> => l !== null);
  }, [links, nodes, camera, dimensions.width, dimensions.height, viewportBounds]);

  // Keyboard navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const visibleNodes = projectedNodes.sort((a, b) => (b.node.z || 0) - (a.node.z || 0));
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedNodeIndex(prev => {
          const next = prev < visibleNodes.length - 1 ? prev + 1 : 0;
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedNodeIndex(prev => {
          const next = prev > 0 ? prev - 1 : visibleNodes.length - 1;
          return next;
        });
      } else if (e.key === 'Enter' && focusedNodeIndex >= 0) {
        e.preventDefault();
        const node = visibleNodes[focusedNodeIndex];
        if (node) {
          onNodeClick(node.node, e.shiftKey);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projectedNodes, onNodeClick, focusedNodeIndex]);

  const colors = isDarkMode ? GROUP_COLORS_DARK : GROUP_COLORS;

  return (
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full relative cursor-move overflow-hidden bg-background"
        onWheel={handleWheelEvent}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveEvent}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        id="neural-graph-container"
      >
      {isInitializing && (
        <div className="absolute inset-0 z-50 bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-muted">Initializing neural graph...</p>
          </div>
        </div>
      )}

      {!isInitializing && !physicsStabilized && (
        <div className="absolute top-4 right-4 z-40 bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-muted">Stabilizing...</span>
        </div>
      )}

      <StaticCortex 
        width={dimensions.width} 
        height={dimensions.height} 
        isDarkMode={isDarkMode} 
        camera={camera}
      />
      <svg
        className="w-full h-full overflow-visible relative z-10"
        aria-label="Knowledge graph visualization"
      >
        <defs>
          {/* Glow filter for nodes */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Stronger glow for master nodes */}
          <filter id="masterGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Hover glow */}
          <filter id="hoverGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Create gradients for each group */}
          {Object.keys(GROUP_COLORS_DARK).map(group => (
            <radialGradient key={`grad-${group}`} id={`grad-${group}`}>
              <stop offset="0%" stopColor={GROUP_COLORS_DARK[group]} stopOpacity="1" />
              <stop offset="70%" stopColor={GROUP_COLORS_DARK[group]} stopOpacity="0.9" />
              <stop offset="100%" stopColor={MASTER_NODE_COLORS[group] || GROUP_COLORS_DARK[group]} stopOpacity="0.7" />
            </radialGradient>
          ))}
          
          {/* Data flow gradients for demo visualization */}
          <linearGradient id="dataFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GROUP_COLORS_DARK['source'] || '#737373'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={GROUP_COLORS_DARK['os'] || '#3B82F6'} stopOpacity="1" />
          </linearGradient>
          <linearGradient id="completeFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GROUP_COLORS_DARK['os'] || '#3B82F6'} stopOpacity="1" />
            <stop offset="100%" stopColor={GROUP_COLORS_DARK['target'] || '#10B981'} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Animated data flow: ERPs → Foundry → o9 */}
        <g className="data-flow-animation" opacity={selectedNodes.length === 0 ? 0.6 : 0.2}>
          {/* Source (ERPs) → Foundry (Core) */}
          <path
            d={`M${dimensions.width * 0.2},${dimensions.height * 0.3} 
                Q${dimensions.width * 0.3},${dimensions.height * 0.5} 
                ${dimensions.width * 0.5},${dimensions.height * 0.5}`}
            stroke="url(#dataFlowGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10 5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="30"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Foundry (Core) → o9 (Target) */}
          <path
            d={`M${dimensions.width * 0.5},${dimensions.height * 0.5} 
                Q${dimensions.width * 0.7},${dimensions.height * 0.5} 
                ${dimensions.width * 0.8},${dimensions.height * 0.3}`}
            stroke="url(#completeFlowGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10 5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="30"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        <g>
          {projectedLinks.map(({ link: l, sp, tp, source: s, target: t }, i) => {
            // Verify we have valid coordinates
            if (!sp || !tp || isNaN(sp.x) || isNaN(sp.y) || isNaN(tp.x) || isNaN(tp.y)) {
              return null;
            }
            
            const highway = isHighway(l);
            const isPath = isPathLink(l);
            const isBackbone = l.type === 'backbone';
            const traversalStrength = getTraversalStrength && s && t ? getTraversalStrength(s.id, t.id) : 0;
            
            // Determine link color based on source/target groups
            const sourceGroup = s.group;
            const targetGroup = t.group;
            const sourceColor = GROUP_COLORS_LIGHT[sourceGroup] || GROUP_COLORS_DARK[sourceGroup] || '#737373';
            const targetColor = GROUP_COLORS_LIGHT[targetGroup] || GROUP_COLORS_DARK[targetGroup] || '#737373';
            
            // Use source color for links, or blend if different groups
            const linkColor = sourceGroup === targetGroup 
              ? sourceColor 
              : (isDarkMode ? '#737373' : '#A3A3A3');
            
            const baseOpacity = highway || isPath 
              ? 1 
              : (selectedNodes.length > 0 || hoveredNode 
                ? 0.15 
                : (isBackbone ? 0.7 : 0.4));
            const opacity = Math.min(1, baseOpacity + traversalStrength * 0.3);
            const strokeWidth = (highway || isPath 
              ? 4 
              : (isBackbone ? 2.5 : 1.5)) * Math.min(sp.scale, tp.scale) * (1 + traversalStrength * 0.5);
            
            return (
              <g
                key={`link-${s.id}-${t.id}-${i}`}
                style={{ opacity, transition: 'opacity 0.3s ease-out' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onLinkTraversal && s && t) {
                    onLinkTraversal(s.id, t.id);
                  }
                }}
                className="cursor-pointer"
              >
                {/* Link line */}
                <line
                  x1={sp.x}
                  y1={sp.y}
                  x2={tp.x}
                  y2={tp.y}
                  stroke={highway || isPath ? (isDarkMode ? '#FAFAFA' : '#161618') : linkColor}
                  strokeWidth={Math.max(0.5, strokeWidth)}
                  strokeOpacity={opacity}
                  strokeLinecap="round"
                />
                
                {/* Animated particles on backbone and selected links */}
                {(highway || isPath || (isBackbone && !selectedNodes.length)) && (
                  <circle 
                    r={Math.max(1, (highway || isPath ? 4 : 2.5) * Math.min(sp.scale, tp.scale))} 
                    fill={isPath 
                      ? GROUP_COLORS_DARK[sourceGroup] || '#A3A3A3'
                      : (isDarkMode ? '#FAFAFA' : '#161618')}
                    opacity={opacity}
                  >
                    <animateMotion 
                      dur={`${3 + (i % 4)}s`} 
                      repeatCount="indefinite" 
                      path={`M${sp.x},${sp.y} L${tp.x},${tp.y}`} 
                    />
                  </circle>
                )}
              </g>
            );
          })}
          {projectedNodes
            .sort((a, b) => (b.node.z || 0) - (a.node.z || 0))
            .map(({ node: n, projection: p }, i) => {
              const isSelected = selectedNodes.includes(n.id);
              const isHovered = hoveredNode === n.id;
              const isMasterNode = n.r >= 40; // Master nodes are larger
              const dimmed = (selectedNodes.length > 0 && !isSelected) || (hoveredNode && !isHovered);
              
              // Size calculation with better scaling
              const baseSize = n.r * p.scale * 0.4;
              const degreeBoost = Math.min((n.degree || 0) * 2, 15); // Cap degree boost
              const hoverBoost = (isSelected || isHovered) ? 1.3 : 1;
              const size = (baseSize + degreeBoost) * hoverBoost;
              
              const Icon = n.icon || Box;
              const nodeIndex = projectedNodes.findIndex(np => np.node.id === n.id);
              const isFocused = nodeIndex === focusedNodeIndex;
              
              // Color selection based on node type
              const nodeColor = isMasterNode 
                ? (MASTER_NODE_COLORS[n.group] || colors[n.group] || (isDarkMode ? '#737373' : '#A3A3A3'))
                : (colors[n.group] || (isDarkMode ? '#737373' : '#A3A3A3'));
              
              const gradientId = `grad-${n.group}`;
              const useGradient = isMasterNode;
              const filterId = isHovered ? 'hoverGlow' : (isMasterNode ? 'masterGlow' : 'glow');
              
              return (
                <g
                  key={n.id}
                  data-node-id={n.id}
                  transform={`translate(${p.x},${p.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodeClick(n, e.shiftKey);
                  }}
                  onMouseEnter={() => {
                    setHoveredNode(n.id);
                    setFocusedNodeIndex(nodeIndex);
                    if (onNodeHover) onNodeHover(n.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredNode(null);
                    if (onNodeHover) onNodeHover(null);
                  }}
                  className="cursor-pointer transition-all duration-300 ease-out"
                  style={{ 
                    opacity: dimmed ? 0.25 : 1,
                    transform: `scale(${isHovered ? 1.05 : 1})`,
                    transition: 'opacity 0.3s ease-out, transform 0.2s ease-out'
                  }}
                  role="button"
                  aria-label={`Node: ${n.label}. ${n.desc || ''}`}
                  tabIndex={isFocused ? 0 : -1}
                  aria-selected={isFocused}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNodeClick(n, e.shiftKey);
                    }
                  }}
                >
                  {/* Selection ring */}
                  {(isSelected || isFocused) && (
                    <circle
                      r={size * 1.3}
                      fill="transparent"
                      stroke={GROUP_COLORS_DARK[n.group] || (isDarkMode ? '#FAFAFA' : '#161618')}
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      className={isSelected ? 'animate-pulse' : ''}
                      opacity={isSelected ? 0.9 : 0.6}
                    />
                  )}
                  
                  {/* Outer glow ring for master nodes */}
                  {isMasterNode && (
                    <circle
                      r={size * 1.15}
                      fill="transparent"
                      stroke={nodeColor}
                      strokeWidth={2}
                      opacity={0.4}
                    />
                  )}
                  
                  {/* Pulsing effect for key "story" nodes (Foundry core) */}
                  {isMasterNode && n.group === 'os' && (
                    <circle
                      r={size * 1.4}
                      fill="transparent"
                      stroke={GROUP_COLORS_DARK['os'] || nodeColor}
                      strokeWidth={2}
                      opacity={0.6}
                    >
                      <animate
                        attributeName="r"
                        values={`${size * 1.3};${size * 1.5};${size * 1.3}`}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.6;0.3;0.6"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  
                  {/* Integration indicators for o9 target nodes */}
                  {n.group === 'target' && (
                    <>
                      {/* Connection indicator */}
                      <circle
                        r={size * 0.3}
                        fill={GROUP_COLORS_DARK['os'] || '#3B82F6'}
                        cx={size * 0.7}
                        cy={-size * 0.7}
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0.3;1"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      
                      {/* "Completed by Foundry" badge */}
                      <text
                        x={size + 10}
                        y={-size}
                        fontSize={10}
                        fontWeight="bold"
                        fill={GROUP_COLORS_DARK['os'] || '#3B82F6'}
                        className="font-mono pointer-events-none"
                      >
                        + Foundry
                      </text>
                    </>
                  )}
                  
                  {/* Main node circle */}
                  <circle
                    r={size}
                    fill={useGradient ? `url(#${gradientId})` : nodeColor}
                    stroke={isSelected 
                      ? (GROUP_COLORS_DARK[n.group] || (isDarkMode ? '#FAFAFA' : '#161618'))
                      : (isHovered 
                        ? (GROUP_COLORS_LIGHT[n.group] || nodeColor)
                        : (isMasterNode 
                          ? (GROUP_COLORS_DARK[n.group] || nodeColor)
                          : nodeColor))}
                    strokeWidth={isSelected ? 4 : (isMasterNode ? 2.5 : 2)}
                    filter={`url(#${filterId})`}
                    fillOpacity={isMasterNode ? 1 : 0.95}
                    style={{
                      transition: 'all 0.3s ease-out',
                    }}
                  />
                  
                  {/* Icon */}
                  <foreignObject 
                    x={-size / 2} 
                    y={-size / 2} 
                    width={size} 
                    height={size} 
                    className="pointer-events-none"
                  >
                    <div className="flex items-center justify-center h-full">
                      <Icon 
                        size={size * 0.65} 
                        className={isDarkMode ? 'text-white' : 'text-white'}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                      />
                    </div>
                  </foreignObject>
                  
                  {/* Label - always show for master nodes, conditional for others */}
                  {(isMasterNode || isSelected || isHovered || p.scale > 0.7) && (
                    <g>
                      {/* Label background for readability */}
                      <rect
                        x={-size * 1.5}
                        y={size + 8 * p.scale}
                        width={size * 3}
                        height={18 * p.scale}
                        fill={isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)'}
                        rx={4 * p.scale}
                        opacity={0.9}
                      />
                      <text
                        y={size + 20 * p.scale}
                        textAnchor="middle"
                        fill={isSelected 
                          ? (GROUP_COLORS_DARK[n.group] || (isDarkMode ? '#FAFAFA' : '#161618'))
                          : (isMasterNode
                            ? (GROUP_COLORS_DARK[n.group] || nodeColor)
                            : (isDarkMode ? '#FAFAFA' : '#161618'))}
                        fontSize={Math.max(11, 13 * p.scale)}
                        fontWeight={isMasterNode ? '700' : '600'}
                        className="font-sans pointer-events-none"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        {n.label}
                      </text>
                    </g>
                  )}
                  
                  {/* Enhanced hover tooltip with business value */}
                  {isHovered && (
                    <foreignObject 
                      x={-150} 
                      y={size + 35} 
                      width={300} 
                      height={120}
                      className="pointer-events-none"
                    >
                      <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white shadow-xl">
                        <p className="text-xs font-bold text-white mb-1">{getGroupStory(n.group)}</p>
                        <p className="text-xs text-gray-300">{n.desc}</p>
                        {n.group === 'target' && (
                          <p className="text-xs text-green-400 mt-2 font-semibold">
                            ✓ Complementary to o9 Solutions
                          </p>
                        )}
                        {n.group === 'os' && (
                          <p className="text-xs text-blue-400 mt-2 font-semibold">
                            → Enables o9 to deliver ROI
                          </p>
                        )}
                        {n.group === 'source' && (
                          <p className="text-xs text-orange-400 mt-2 font-semibold">
                            📥 Data source for Foundry integration
                          </p>
                        )}
                        {n.group === 'aip' && (
                          <p className="text-xs text-purple-400 mt-2 font-semibold">
                            🤖 AI capabilities enhancing o9
                          </p>
                        )}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
        </g>
      </svg>
      
      {/* Real-time metrics overlay showing business value */}
      <DemoMetrics />
    </div>
  );
}
