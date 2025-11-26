'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { NeuralGraph, NeuralGraphNode } from '@/components/graph/NeuralGraph';
import { InsightPanel } from '@/components/graph/InsightPanel';
import { GraphControls } from '@/components/graph/GraphControls';
import { GraphNode } from '@/data/graph-data';
import { useAppStore } from '@/store/app-store';
import { findPath } from '@/components/graph/utils/pathfinding';
import { GRAPH_DATA } from '@/data/graph-data';
import { Camera } from '@/components/graph/utils/projectionUtils';

export function HomeTab() {
  const { selectedNodes, setSelectedNodes, isDarkMode } = useAppStore();
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [visibleGroups, setVisibleGroups] = useState<Set<string>>(new Set());
  const cameraRef = useRef<Camera | null>(null);

  const selectedNodeObjects = useMemo(() => {
    return selectedNodes
      .map(id => GRAPH_DATA.nodes.find(n => n.id === id))
      .filter((n): n is GraphNode => n !== undefined);
  }, [selectedNodes]);

  const handleNodeClick = useCallback((node: NeuralGraphNode, isShift: boolean) => {
    if (isShift) {
      // Multi-select: toggle node
      if (selectedNodes.includes(node.id)) {
        setSelectedNodes(selectedNodes.filter(id => id !== node.id));
      } else {
        setSelectedNodes([...selectedNodes, node.id]);
      }
    } else {
      // Single select: replace selection
      setSelectedNodes([node.id]);
    }

    // Update highlighted path if multiple nodes selected
    if (selectedNodes.length > 0 && !isShift) {
      const path = findPath(selectedNodes[0], node.id, GRAPH_DATA.links);
      setHighlightedPath(path);
    } else {
      setHighlightedPath([]);
    }
  }, [selectedNodes, setSelectedNodes]);

  const handleGenerateInsight = useCallback(async (prompt: string, contextNodes?: string[]): Promise<string> => {
    // Import AI API dynamically to avoid SSR issues
    const { callAI } = await import('@/lib/ai');
    return callAI(prompt, 2, contextNodes);
  }, []);

  const handleSaveNote = useCallback((content: string) => {
    // Save to notebook localStorage
    if (typeof window === 'undefined') return;

    try {
      const existing = localStorage.getItem('notebook-cells');
      const cells = existing ? JSON.parse(existing) : [];
      cells.push({
        id: `cell-${Date.now()}`,
        type: 'markdown',
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      localStorage.setItem('notebook-cells', JSON.stringify(cells));

      // Show notification (could be enhanced with a toast component)
      console.log('Note saved to notebook');
    } catch (e) {
      console.error('Failed to save note:', e);
    }
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedNodes([]);
    setHighlightedPath([]);
  }, [setSelectedNodes]);

  const handleCameraChange = useCallback((camera: Camera) => {
    cameraRef.current = camera;
  }, []);

  const handleResetCamera = useCallback(() => {
    // Camera reset will be handled by exposing controls from NeuralGraph
    // For now, just clear selections
    setSelectedNodes([]);
    setHighlightedPath([]);
  }, [setSelectedNodes]);

  const handleZoomIn = useCallback(() => {
    if (typeof document === 'undefined') return;
    // Trigger zoom by dispatching wheel event on the graph container
    const container = document.getElementById('neural-graph-container');
    if (container) {
      const event = new WheelEvent('wheel', { deltaY: -50, bubbles: true });
      container.dispatchEvent(event);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (typeof document === 'undefined') return;
    // Trigger zoom by dispatching wheel event on the graph container
    const container = document.getElementById('neural-graph-container');
    if (container) {
      const event = new WheelEvent('wheel', { deltaY: 50, bubbles: true });
      container.dispatchEvent(event);
    }
  }, []);

  const handleResetView = useCallback(() => {
    cameraRef.current = null;
    setSelectedNodes([]);
    setHighlightedPath([]);
    setVisibleGroups(new Set());
  }, [setSelectedNodes]);

  const handleToggleGroup = useCallback((group: string) => {
    setVisibleGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      // If all groups are selected, show all (empty set)
      if (next.size === Object.keys(GRAPH_DATA.nodes.reduce((acc, n) => {
        acc[n.group] = true;
        return acc;
      }, {} as Record<string, boolean>)).length) {
        return new Set();
      }
      return next;
    });
  }, []);

  return (
    <div className="h-full relative overflow-hidden">
      <NeuralGraph
        onNodeClick={handleNodeClick}
        selectedNodes={selectedNodes}
        highlightedPath={highlightedPath}
        visibleGroups={visibleGroups.size > 0 ? visibleGroups : undefined}
        isDarkMode={isDarkMode}
        onCameraChange={handleCameraChange}
      />
      
      <GraphControls
        onResetCamera={handleResetCamera}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        visibleGroups={visibleGroups}
        onToggleGroup={handleToggleGroup}
        isDarkMode={isDarkMode}
      />
      
      {selectedNodeObjects.length > 0 && (
        <InsightPanel
          selectedNodes={selectedNodeObjects}
          onClose={handleClosePanel}
          onSaveNote={handleSaveNote}
          onGenerateInsight={handleGenerateInsight}
        />
      )}
    </div>
  );
}
