'use client';

import React from 'react';
import { RefreshCw, ZoomIn, ZoomOut, Maximize2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GROUP_COLORS_DARK } from './constants/colors';

interface GraphControlsProps {
  onResetCamera: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  visibleGroups: Set<string>;
  onToggleGroup: (group: string) => void;
  isDarkMode?: boolean;
}

const GROUP_LABELS: Record<string, string> = {
  os: 'OS Core',
  aip: 'AI Platform',
  ontology: 'Ontology',
  data: 'Data Engineering',
  app: 'Applications',
  target: 'Targets',
  source: 'Sources',
  strategy: 'Strategy',
};

export function GraphControls({
  onResetCamera,
  onZoomIn,
  onZoomOut,
  onResetView,
  visibleGroups,
  onToggleGroup,
  isDarkMode = true,
}: GraphControlsProps) {
  return (
    <Card className="absolute top-4 left-4 p-4 bg-background/95 backdrop-blur-sm border-border shadow-lg z-30 max-w-xs">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Filter size={14} />
            Controls
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" icon={RefreshCw} onClick={onResetCamera}>
              Reset Camera
            </Button>
            <Button variant="ghost" size="sm" icon={ZoomIn} onClick={onZoomIn}>
              Zoom In
            </Button>
            <Button variant="ghost" size="sm" icon={ZoomOut} onClick={onZoomOut}>
              Zoom Out
            </Button>
            <Button variant="ghost" size="sm" icon={Maximize2} onClick={onResetView}>
              Reset View
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold mb-2">Filter Groups</h3>
          <div className="space-y-1.5">
            {Object.keys(GROUP_LABELS).map(group => {
              const isVisible = visibleGroups.size === 0 || visibleGroups.has(group);
              const color = GROUP_COLORS_DARK[group] || '#737373';
              
              return (
                <label
                  key={group}
                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-secondary p-1.5 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => onToggleGroup(group)}
                    className="w-3 h-3 rounded border-border"
                    style={{ accentColor: color }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-muted">{GROUP_LABELS[group]}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

