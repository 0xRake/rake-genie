/**
 * Citation Registry
 * Maps citation IDs to source information for LLM responses
 */

export interface Citation {
  id: string;
  source: 'official-docs' | 'graph-node' | 'notebook';
  url?: string;
  nodeId?: string;
  title?: string;
  description?: string;
}

const citations = new Map<string, Citation>();

let citationCounter = 1;

export function registerCitation(citation: Omit<Citation, 'id'>): string {
  const id = `cite-${citationCounter++}`;
  citations.set(id, { ...citation, id });
  return id;
}

export function getCitation(id: string): Citation | undefined {
  return citations.get(id);
}

export function getAllCitations(): Citation[] {
  return Array.from(citations.values());
}

