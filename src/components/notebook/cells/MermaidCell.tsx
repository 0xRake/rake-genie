'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NotebookCell, CellType } from '../Notebook';
import mermaid from 'mermaid';

interface MermaidCellProps {
  cell: NotebookCell;
  onUpdate: (updates: Partial<NotebookCell>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddCell: (type: CellType) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function MermaidCell({
  cell,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddCell,
  isSelected,
  onSelect,
}: MermaidCellProps) {
  const [isEditing, setIsEditing] = useState(!cell.content);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    if (!cell.content || isEditing) return;

    mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    mermaid.render(`mermaid-${cell.id}`, cell.content)
      .then(({ svg }) => setSvg(svg))
      .catch((error) => {
        console.error('Mermaid render error:', error);
        setSvg('');
      });
  }, [cell.content, cell.id, isEditing]);

  const handleContentChange = (content: string) => {
    onUpdate({ content });
  };

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
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Plus}
            onClick={() => onAddCell('mermaid')}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onDelete}
          />
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={cell.content}
          onChange={(e) => handleContentChange(e.target.value)}
          onFocus={onSelect}
          className="w-full min-h-[200px] p-2 border border-border rounded bg-background text-foreground font-mono text-sm resize-y"
          placeholder="graph TD&#10;    A[Start] --> B[End]"
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          onFocus={onSelect}
          className="cursor-text"
        >
          {svg ? (
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          ) : (
            <div className="text-muted italic p-4 text-center">
              {cell.content ? 'Rendering diagram...' : 'Click to edit mermaid diagram...'}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

