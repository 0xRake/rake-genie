/**
 * Digital Twin Service - Enhanced with Citation Tracking
 * 
 * This is the background knowledge representation used by LLM assistants
 * to query the knowledge graph, documentation, and repository knowledge.
 */

import { GRAPH_DATA, GraphNode, GraphLink } from '@/data/graph-data';
import { registerCitation, Citation } from '@/data/citations';

export interface DigitalTwinQuery {
  nodeIds?: string[];
  nodeLabels?: string[];
  linkTypes?: string[];
  groups?: string[];
  searchTerm?: string;
}

export interface DigitalTwinResult {
  nodes: GraphNode[];
  links: GraphLink[];
  context: string;
  citations: Citation[];
}

/**
 * Query the digital twin knowledge graph with citation tracking
 */
export function queryDigitalTwin(query: DigitalTwinQuery): DigitalTwinResult {
  let nodes: GraphNode[] = [];
  let links: GraphLink[] = [];
  const citations: Citation[] = [];

  // Filter by node IDs
  if (query.nodeIds && query.nodeIds.length > 0) {
    nodes = GRAPH_DATA.nodes.filter(n => query.nodeIds!.includes(n.id));
  }
  // Filter by node labels
  else if (query.nodeLabels && query.nodeLabels.length > 0) {
    nodes = GRAPH_DATA.nodes.filter(n => 
      query.nodeLabels!.some(label => 
        n.label.toLowerCase().includes(label.toLowerCase())
      )
    );
  }
  // Filter by groups
  else if (query.groups && query.groups.length > 0) {
    nodes = GRAPH_DATA.nodes.filter(n => query.groups!.includes(n.group));
  }
  // Search by term
  else if (query.searchTerm) {
    const term = query.searchTerm.toLowerCase();
    nodes = GRAPH_DATA.nodes.filter(n =>
      n.label.toLowerCase().includes(term) ||
      n.desc?.toLowerCase().includes(term) ||
      n.utility?.toLowerCase().includes(term) ||
      n.group.toLowerCase().includes(term)
    );
  }
  // Return all if no filters
  else {
    nodes = [...GRAPH_DATA.nodes];
  }

  // Register citations for nodes
  nodes.forEach(node => {
    const citationId = registerCitation({
      source: 'graph-node',
      nodeId: node.id,
      title: node.label,
      description: node.desc,
    });
    citations.push({ id: citationId, source: 'graph-node', nodeId: node.id, title: node.label, description: node.desc });
  });

  // Get node IDs for link filtering
  const nodeIds = new Set(nodes.map(n => n.id));

  // Filter links that connect to selected nodes
  links = GRAPH_DATA.links.filter(l => {
    const sourceId = l.source;
    const targetId = l.target;
    return nodeIds.has(sourceId) && nodeIds.has(targetId);
  });

  // Filter by link types if specified
  if (query.linkTypes && query.linkTypes.length > 0) {
    links = links.filter(l => query.linkTypes!.includes(l.type || ''));
  }

  // Build context string for LLM
  const context = buildContext(nodes, links);

  return { nodes, links, context, citations };
}

/**
 * Build natural language context from graph data
 */
function buildContext(nodes: GraphNode[], links: GraphLink[]): string {
  const nodeDescriptions = nodes.map(n => 
    `${n.label} (${n.group}): ${n.desc || 'No description'}`
  ).join('\n');

  const linkDescriptions = links.slice(0, 20).map(l => {
    const sourceId = l.source;
    const targetId = l.target;
    const source = nodes.find(n => n.id === sourceId);
    const target = nodes.find(n => n.id === targetId);
    return `${source?.label || sourceId} → ${target?.label || targetId}${l.type ? ` (${l.type})` : ''}`;
  }).join('\n');

  return `Knowledge Graph Context:

Nodes (${nodes.length}):
${nodeDescriptions}

Key Connections (${Math.min(links.length, 20)}):
${linkDescriptions}
${links.length > 20 ? `\n... and ${links.length - 20} more connections` : ''}
`;
}

/**
 * Find path between nodes
 */
export function findPathInDigitalTwin(sourceId: string, targetId: string): string[] {
  const adjacencyList: Record<string, string[]> = {};
  
  GRAPH_DATA.links.forEach(link => {
    const source = link.source;
    const target = link.target;
    
    if (!adjacencyList[source]) adjacencyList[source] = [];
    if (!adjacencyList[target]) adjacencyList[target] = [];
    
    if (!adjacencyList[source].includes(target)) adjacencyList[source].push(target);
    if (!adjacencyList[target].includes(source)) adjacencyList[target].push(source);
  });

  // BFS
  const queue: Array<{ id: string; path: string[] }> = [{ id: sourceId, path: [sourceId] }];
  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current.id === targetId) {
      return current.path;
    }

    const neighbors = adjacencyList[current.id] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ id: neighbor, path: [...current.path, neighbor] });
      }
    }
  }

  return [];
}

/**
 * Get node by ID
 */
export function getNodeById(nodeId: string): GraphNode | undefined {
  return GRAPH_DATA.nodes.find(n => n.id === nodeId);
}

/**
 * Get all connections for a node (backlinks)
 */
export function getNodeConnections(nodeId: string): { nodes: GraphNode[]; links: GraphLink[] } {
  const connectedNodeIds = new Set<string>();
  const connectedLinks: GraphLink[] = [];

  GRAPH_DATA.links.forEach(link => {
    const sourceId = link.source;
    const targetId = link.target;
    
    if (sourceId === nodeId) {
      connectedNodeIds.add(targetId);
      connectedLinks.push(link);
    } else if (targetId === nodeId) {
      connectedNodeIds.add(sourceId);
      connectedLinks.push(link);
    }
  });

  const nodes = GRAPH_DATA.nodes.filter(n => connectedNodeIds.has(n.id));

  return { nodes, links: connectedLinks };
}

/**
 * Get backlinks (what links TO this node)
 */
export function getBacklinks(nodeId: string): GraphNode[] {
  const backlinkNodeIds = new Set<string>();

  GRAPH_DATA.links.forEach(link => {
    if (link.target === nodeId) {
      backlinkNodeIds.add(link.source);
    }
  });

  return GRAPH_DATA.nodes.filter(n => backlinkNodeIds.has(n.id));
}
