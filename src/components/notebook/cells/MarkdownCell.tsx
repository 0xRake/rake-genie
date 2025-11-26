'use client';

import React, { useState } from 'react';
import { X, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NotebookCell, CellType } from '../Notebook';
import ReactMarkdown from 'react-markdown';

interface MarkdownCellProps {
  cell: NotebookCell;
  onUpdate: (updates: Partial<NotebookCell>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddCell: (type: CellType) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function MarkdownCell({
  cell,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddCell,
  isSelected,
  onSelect,
}: MarkdownCellProps) {
  const [isEditing, setIsEditing] = useState(!cell.content);

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
            icon={Plus}
            onClick={() => onAddCell('markdown')}
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
          onBlur={() => setIsEditing(false)}
          onFocus={onSelect}
          className="w-full min-h-[100px] p-2 border border-border rounded bg-background text-foreground font-mono text-sm resize-y"
          placeholder="Write markdown here..."
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          onFocus={onSelect}
          className="prose prose-sm max-w-none dark:prose-invert cursor-text"
        >
          {cell.content ? (
            <ReactMarkdown>{cell.content}</ReactMarkdown>
          ) : (
            <div className="text-muted italic">Click to edit markdown...</div>
          )}
        </div>
      )}
    </Card>
  );
}

