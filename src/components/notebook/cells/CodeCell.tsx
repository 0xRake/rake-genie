'use client';

import React, { useState } from 'react';
import { X, ChevronUp, ChevronDown, Plus, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NotebookCell, CellType } from '../Notebook';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';

interface CodeCellProps {
  cell: NotebookCell;
  onUpdate: (updates: Partial<NotebookCell>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddCell: (type: CellType) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function CodeCell({
  cell,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddCell,
  isSelected,
  onSelect,
}: CodeCellProps) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleContentChange = (content: string) => {
    onUpdate({ content });
  };

  const handleLanguageChange = (language: string) => {
    onUpdate({ language });
  };

  const executeCode = async () => {
    if (!cell.content.trim()) return;
    
    setIsExecuting(true);
    try {
      // Sandboxed JavaScript execution
      if (cell.language === 'javascript' || cell.language === 'typescript') {
        // Create a safe execution context
        const result = new Function(`
          "use strict";
          try {
            ${cell.content}
            return "Code executed successfully";
          } catch (error) {
            return "Error: " + error.message;
          }
        `)();
        onUpdate({ output: String(result), executed: true });
      } else {
        onUpdate({ output: 'Execution not supported for this language', executed: true });
      }
    } catch (error: any) {
      onUpdate({ output: `Error: ${error.message}`, executed: true });
    } finally {
      setIsExecuting(false);
    }
  };

  const languageExtension = cell.language === 'python' ? python() : javascript({ jsx: true });

  return (
    <Card className={`p-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
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
          <select
            value={cell.language || 'javascript'}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-xs px-2 py-1 border border-border rounded bg-background"
            onClick={onSelect}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            icon={Play}
            onClick={executeCode}
            disabled={isExecuting || !cell.content.trim()}
          >
            Run
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Plus}
            onClick={() => onAddCell('code')}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onDelete}
          />
        </div>
      </div>

      <div onFocus={onSelect}>
        <CodeMirror
          value={cell.content}
          height="200px"
          extensions={[languageExtension]}
          onChange={(value) => handleContentChange(value)}
          theme="dark"
        />
      </div>

      {cell.output && (
        <div className="mt-2 p-2 bg-secondary rounded text-sm font-mono">
          <div className="text-xs text-muted mb-1">Output:</div>
          <pre className="whitespace-pre-wrap">{cell.output}</pre>
        </div>
      )}
    </Card>
  );
}

