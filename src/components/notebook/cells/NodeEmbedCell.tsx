'use client';

import React from 'react';
import { X, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NotebookCell, CellType } from '../Notebook';
import { GRAPH_DATA } from '@/data/graph-data';

interface NodeEmbedCellProps {
  cell: NotebookCell;
  onUpdate: (updates: Partial<NotebookCell>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddCell: (type: CellType) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function NodeEmbedCell({
  cell,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddCell,
  isSelected,
  onSelect,
}: NodeEmbedCellProps) {
  const nodes = cell.nodeIds
    ?.map(id => GRAPH_DATA.nodes.find(n => n.id === id))
    .filter((n): n is NonNullable<typeof n> => n !== undefined) || [];

  return (
    <Card className={`p-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-start gap-2 mb-2">
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronUp}
              onClick={onMoveUp}
            />
          )}
          {onMoveDown && (
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronDown}
              onClick={onMoveDown}
            />
          )}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            icon={Plus}
            onClick={() => onAddCell('node-embed')}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onDelete}
          />
        </div>
      </div>

      <div onClick={onSelect} className="cursor-pointer">
        {nodes.length > 0 ? (
          <div className="space-y-2">
            {nodes.map((node) => (
              <div key={node.id} className="p-3 bg-secondary rounded">
                <div className="flex items-center gap-2">
                  {node.icon && (
                    <node.icon size={20} className="text-muted" />
                  )}
                  <div>
                    <div className="font-medium">{node.label}</div>
                    <div className="text-xs text-muted">{node.group}</div>
                    {node.desc && (
                      <div className="text-xs text-muted mt-1">{node.desc}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted italic text-center p-4">
            No nodes embedded. Add nodes from the Knowledge Graph.
          </div>
        )}
      </div>

      {cell.content && (
        <div className="mt-2 p-2 bg-secondary rounded text-sm">
          {cell.content}
        </div>
      )}
    </Card>
  );
}

