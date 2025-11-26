// Path Finding Utilities (BFS algorithm)

import { GraphLink } from '@/data/graph-data';

export interface PathNode {
  id: string;
  previous?: string;
}

/**
 * Find shortest path between two nodes using BFS
 */
export function findPath(
  sourceId: string,
  targetId: string,
  links: GraphLink[]
): string[] {
  if (sourceId === targetId) return [sourceId];

  // Build adjacency list
  const adjacencyList: Record<string, string[]> = {};
  links.forEach(link => {
    const source = link.source;
    const target = link.target;
    
    if (!adjacencyList[source]) adjacencyList[source] = [];
    if (!adjacencyList[target]) adjacencyList[target] = [];
    
    if (!adjacencyList[source].includes(target)) {
      adjacencyList[source].push(target);
    }
    if (!adjacencyList[target].includes(source)) {
      adjacencyList[target].push(source);
    }
  });

  // BFS
  const queue: PathNode[] = [{ id: sourceId }];
  const visited = new Set<string>([sourceId]);
  const parentMap: Record<string, string> = {};

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current.id === targetId) {
      // Reconstruct path
      const path: string[] = [];
      let nodeId: string | undefined = targetId;
      while (nodeId) {
        path.unshift(nodeId);
        nodeId = parentMap[nodeId];
      }
      return path;
    }

    const neighbors = adjacencyList[current.id] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parentMap[neighbor] = current.id;
        queue.push({ id: neighbor });
      }
    }
  }

  return [];
}

