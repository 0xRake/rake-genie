'use client';

import React, { useState } from 'react';
import { X, ChevronUp, ChevronDown, Plus, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NotebookCell, CellType } from '../Notebook';
import { callAI } from '@/lib/ai';

interface QueryCellProps {
  cell: NotebookCell;
  onUpdate: (updates: Partial<NotebookCell>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddCell: (type: CellType) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function QueryCell({
  cell,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddCell,
  isSelected,
  onSelect,
}: QueryCellProps) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleContentChange = (content: string) => {
    onUpdate({ content });
  };

  const executeQuery = async () => {
    if (!cell.content.trim()) return;

    setIsExecuting(true);
    try {
      const result = await callAI(cell.content);
      onUpdate({ output: result, executed: true });
    } catch (error: unknown) {
      const err = error as Error;
      onUpdate({ output: `Erro: ${err.message}`, executed: true });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className={`p-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-center justify-between mb-2">
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
          <span className="text-xs text-muted ml-2">Consulta</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            icon={Play}
            onClick={executeQuery}
            disabled={isExecuting || !cell.content.trim()}
          >
            Executar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Plus}
            onClick={() => onAddCell('query')}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onDelete}
          />
        </div>
      </div>

      <textarea
        value={cell.content}
        onChange={(e) => handleContentChange(e.target.value)}
        onFocus={onSelect}
        className="w-full min-h-[100px] p-2 border border-border rounded bg-background text-foreground font-mono text-sm resize-y"
        placeholder="Faça uma pergunta sobre Foundry, Ontology ou AIP..."
      />

      {cell.output && (
        <div className="mt-2 p-4 bg-secondary rounded">
          <div className="text-xs text-muted mb-2">Resposta:</div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap text-sm">{cell.output}</pre>
          </div>
        </div>
      )}
    </Card>
  );
}
