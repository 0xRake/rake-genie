'use client';

import React, { useState, useEffect } from 'react';
import { X, BookOpen, Sparkles, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GraphNode } from '@/data/graph-data';
import { getNodeConnections, findPathInDigitalTwin } from '@/lib/digital-twin';

interface InsightPanelProps {
  selectedNodes: GraphNode[];
  onClose: () => void;
  onSaveNote: (content: string) => void;
  onGenerateInsight?: (prompt: string, contextNodes?: string[]) => Promise<string>;
}

export function InsightPanel({ 
  selectedNodes, 
  onClose, 
  onSaveNote,
  onGenerateInsight 
}: InsightPanelProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setInsight(null);
  }, [selectedNodes]);

  if (selectedNodes.length === 0) return null;

  const handleGenerateInsight = async () => {
    if (!onGenerateInsight || selectedNodes.length === 0) return;
    setIsGenerating(true);
    try {
      const names = selectedNodes.map(n => n.label).join(" + ");
      const descriptions = selectedNodes.map(n => n.desc || n.label).join("\n");
      const nodeIds = selectedNodes.map(n => n.id);
      const prompt = `Analyze the neuropathway connection between: ${names}. 

Context:
${descriptions}

Explain how these concepts interact operationally in Palantir Foundry. 

Provide a tactical "How-to" for leveraging this combination.`;
      const generated = await onGenerateInsight(prompt, nodeIds);
      setInsight(generated || 'Unable to generate insight. Please try again.');
    } catch (error) {
      console.error('Failed to generate insight:', error);
      setInsight('Failed to generate insight. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToNotebook = () => {
    const content = buildNotebookContent(selectedNodes, insight);
    onSaveNote(content);
  };

  // Get connections for all selected nodes
  const allConnections = new Set<string>();
  const allLinks: Array<{ source: string; target: string; type?: string }> = [];
  
  selectedNodes.forEach(node => {
    const connections = getNodeConnections(node.id);
    connections.nodes.forEach(n => allConnections.add(n.id));
    connections.links.forEach(l => {
      if (!allLinks.some(existing => 
        existing.source === l.source && existing.target === l.target
      )) {
        allLinks.push(l);
      }
    });
  });

  // Find paths between nodes if multiple selected
  const paths: string[][] = [];
  if (selectedNodes.length >= 2) {
    for (let i = 0; i < selectedNodes.length; i++) {
      for (let j = i + 1; j < selectedNodes.length; j++) {
        const path = findPathInDigitalTwin(selectedNodes[i].id, selectedNodes[j].id);
        if (path.length > 0) {
          paths.push(path);
        }
      }
    }
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-xl z-50 overflow-y-auto custom-scrollbar">
      <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Insights</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-secondary rounded transition-intelium"
          aria-label="Close panel"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Selected Nodes */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted">
            {selectedNodes.length === 1 ? 'Selected Node' : `Selected Nodes (${selectedNodes.length})`}
          </h3>
          <div className="space-y-2">
            {selectedNodes.map(node => (
              <Card key={node.id} className="p-3">
                <div className="flex items-start gap-2">
                  {node.icon && (
                    <node.icon size={20} className="text-muted mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{node.label}</h4>
                    <p className="text-xs text-muted mt-1">{node.group}</p>
                    {node.desc && (
                      <p className="text-xs text-muted mt-2">{node.desc}</p>
                    )}
                    {node.utility && (
                      <p className="text-xs text-muted mt-1 italic">Utility: {node.utility}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Connections */}
        {allConnections.size > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted flex items-center gap-2">
              <Link2 size={14} />
              Connections ({allConnections.size})
            </h3>
            <Card className="p-3">
              <p className="text-xs text-muted">
                {selectedNodes.length === 1 
                  ? `This node connects to ${allConnections.size} other node${allConnections.size !== 1 ? 's' : ''}.`
                  : `Selected nodes share ${allConnections.size} connected node${allConnections.size !== 1 ? 's' : ''}.`
                }
              </p>
            </Card>
          </div>
        )}

        {/* Paths */}
        {paths.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted">
              Paths Between Nodes ({paths.length})
            </h3>
            <div className="space-y-2">
              {paths.slice(0, 3).map((path, i) => (
                <Card key={i} className="p-3">
                  <p className="text-xs font-mono text-muted">
                    {path.join(' → ')}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Insight */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted flex items-center gap-2">
            <Sparkles size={14} />
            AI Insight
          </h3>
          {!insight && !isGenerating && (
            <Button
              onClick={handleGenerateInsight}
              variant="secondary"
              size="sm"
              className="w-full"
              icon={Sparkles}
            >
              Generate Insight
            </Button>
          )}
          {isGenerating && (
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-muted">Generating insight...</p>
              </div>
            </Card>
          )}
          {insight && (
            <Card className="p-3">
              <p className="text-sm whitespace-pre-wrap">{insight}</p>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border">
          <Button
            onClick={handleAddToNotebook}
            variant="primary"
            size="sm"
            className="w-full"
            icon={BookOpen}
          >
            Add to Notebook
          </Button>
        </div>
      </div>
    </div>
  );
}

function buildNotebookContent(nodes: GraphNode[], insight: string | null): string {
  const timestamp = new Date().toISOString();
  let content = `# Node Selection - ${timestamp}\n\n`;
  
  content += `## Selected Nodes (${nodes.length})\n\n`;
  nodes.forEach((node, i) => {
    content += `### ${i + 1}. ${node.label}\n\n`;
    content += `- **Group:** ${node.group}\n`;
    if (node.desc) content += `- **Description:** ${node.desc}\n`;
    if (node.utility) content += `- **Utility:** ${node.utility}\n`;
    content += `\n`;
  });

  if (insight) {
    content += `## AI Insight\n\n${insight}\n\n`;
  }

  content += `---\n*Generated from Knowledge Graph selection*\n`;
  
  return content;
}
