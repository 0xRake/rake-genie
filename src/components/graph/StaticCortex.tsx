/**
 * StaticCortex - Background brain-lobe visualization
 * FIXED: Now uses 3D world coordinates + camera projection
 */

'use client';

import React, { useMemo } from 'react';
import { project3D, Camera } from './utils/projectionUtils';
import { GROUP_ANCHORS } from '@/data/anchors';

interface StaticCortexProps {
  width: number;
  height: number;
  isDarkMode?: boolean;
  camera: Camera;
}

export function StaticCortex({ width, height, isDarkMode = false, camera }: StaticCortexProps) {
  const lobes3D = useMemo(() => [
    { ...GROUP_ANCHORS.aip, r: 180, group: 'aip', opacity: 0.08 },
    { ...GROUP_ANCHORS.ontology, r: 150, group: 'ontology', opacity: 0.08 },
    { ...GROUP_ANCHORS.data, r: 150, group: 'data', opacity: 0.08 },
    { ...GROUP_ANCHORS.app, r: 160, group: 'app', opacity: 0.08 },
    { ...GROUP_ANCHORS.os, r: 120, group: 'os', opacity: 0.12 },
    { ...GROUP_ANCHORS.target, r: 140, group: 'target', opacity: 0.06 },
    { ...GROUP_ANCHORS.source, r: 140, group: 'source', opacity: 0.06 },
    { ...GROUP_ANCHORS.strategy, r: 140, group: 'strategy', opacity: 0.06 },
  ], []);

  const lobes2D = useMemo(() => {
    return lobes3D.map(lobe => {
      const projection = project3D(lobe.x, lobe.y, lobe.z, camera, width, height);
      return {
        ...lobe,
        screenX: projection.x,
        screenY: projection.y,
        screenR: lobe.r * projection.scale,
        scale: projection.scale
      };
    }).filter(lobe => lobe.scale > 0);
  }, [lobes3D, camera, width, height]);

  const groupColors: Record<string, string> = {
    os: isDarkMode ? '#3B82F6' : '#1E40AF',
    aip: isDarkMode ? '#A855F7' : '#7C3AED',
    ontology: isDarkMode ? '#10B981' : '#059669',
    data: isDarkMode ? '#EF4444' : '#DC2626',
    app: isDarkMode ? '#F97316' : '#EA580C',
    target: isDarkMode ? '#10B981' : '#059669',
    source: isDarkMode ? '#737373' : '#525252',
    strategy: isDarkMode ? '#FBBF24' : '#D97706',
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      style={{ opacity: 0.4 }}
    >
      <defs>
        {lobes2D.map((lobe, i) => (
          <radialGradient key={`grad-${i}`} id={`lobeGradient-${i}`}>
            <stop offset="0%" stopColor={groupColors[lobe.group] || '#737373'} stopOpacity={lobe.opacity * 2} />
            <stop offset="50%" stopColor={groupColors[lobe.group] || '#737373'} stopOpacity={lobe.opacity} />
            <stop offset="100%" stopColor={groupColors[lobe.group] || '#737373'} stopOpacity="0" />
          </radialGradient>
        ))}
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke={isDarkMode ? '#374151' : '#E5E7EB'}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>
      
      <rect width={width} height={height} fill="url(#grid)" />
      
      <g opacity="0.3">
        <line
          x1={width / 2 - 50}
          y1={height / 2}
          x2={width / 2 + 50}
          y2={height / 2}
          stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <line
          x1={width / 2}
          y1={height / 2 - 50}
          x2={width / 2}
          y2={height / 2 + 50}
          stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
          strokeWidth="1"
          strokeDasharray="4 2"
        />
      </g>
      
      {lobes2D.map((lobe, i) => (
        <g key={i} opacity={0.8}>
          <circle
            cx={lobe.screenX}
            cy={lobe.screenY}
            r={lobe.screenR}
            fill={`url(#lobeGradient-${i})`}
          />
          <text
            x={lobe.screenX}
            y={lobe.screenY - lobe.screenR - 10}
            textAnchor="middle"
            fill={groupColors[lobe.group] || '#737373'}
            fontSize="10"
            opacity="0.5"
            className="font-mono uppercase"
          >
            {lobe.group}
          </text>
        </g>
      ))}
    </svg>
  );
}
