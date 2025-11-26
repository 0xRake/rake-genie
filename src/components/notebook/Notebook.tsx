'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MarkdownCell } from './cells/MarkdownCell';
import { CodeCell } from './cells/CodeCell';
import { MermaidCell } from './cells/MermaidCell';
import { QueryCell } from './cells/QueryCell';
import { NodeEmbedCell } from './cells/NodeEmbedCell';

export type CellType = 'markdown' | 'code' | 'mermaid' | 'query' | 'node-embed';

export interface NotebookCell {
  id: string;
  type: CellType;
  content: string;
  language?: string; // For code cells
  nodeIds?: string[]; // For node-embed cells
  executed?: boolean;
  output?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'notebook-cells';

interface NotebookProps {
  initialCells?: NotebookCell[];
  onExport?: (cells: NotebookCell[]) => void;
}

export function Notebook({ initialCells, onExport }: NotebookProps) {
  const [cells, setCells] = useState<NotebookCell[]>(initialCells || []);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && cells.length === 0) {
      try {
        const parsed = JSON.parse(stored);
        setCells(parsed); // eslint-disable-line react-hooks/set-state-in-effect -- Loading from localStorage on mount is intentional
      } catch (e) {
        console.error('Falha ao carregar caderno:', e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run on mount
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || cells.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cells));
  }, [cells]);

  const addCell = useCallback((type: CellType, afterId?: string) => {
    const newCell: NotebookCell = {
      id: `cell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: type === 'markdown' ? '' : type === 'code' ? '// Escreva seu código aqui\n' : '',
      language: type === 'code' ? 'javascript' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (afterId) {
      const index = cells.findIndex(c => c.id === afterId);
      setCells(prev => [...prev.slice(0, index + 1), newCell, ...prev.slice(index + 1)]);
    } else {
      setCells(prev => [...prev, newCell]);
    }
    setSelectedCellId(newCell.id);
  }, [cells]);

  const updateCell = useCallback((id: string, updates: Partial<NotebookCell>) => {
    setCells(prev => prev.map(cell =>
      cell.id === id
        ? { ...cell, ...updates, updatedAt: new Date().toISOString() }
        : cell
    ));
  }, []);

  const deleteCell = useCallback((id: string) => {
    setCells(prev => prev.filter(c => c.id !== id));
  }, []);

  const moveCell = useCallback((id: string, direction: 'up' | 'down') => {
    setCells(prev => {
      const index = prev.findIndex(c => c.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const newCells = [...prev];
      [newCells[index], newCells[newIndex]] = [newCells[newIndex], newCells[index]];
      return newCells;
    });
  }, []);

  const handleExport = useCallback(() => {
    const markdown = cells.map(cell => {
      switch (cell.type) {
        case 'markdown':
          return cell.content;
        case 'code':
          return `\`\`\`${cell.language || 'javascript'}\n${cell.content}\n\`\`\``;
        case 'mermaid':
          return `\`\`\`mermaid\n${cell.content}\n\`\`\``;
        case 'query':
          return `**Consulta:** ${cell.content}\n\n${cell.output ? `**Resultado:**\n\`\`\`\n${cell.output}\n\`\`\`` : ''}`;
        case 'node-embed':
          return `**Nós:** ${cell.nodeIds?.join(', ')}\n\n${cell.content}`;
        default:
          return '';
      }
    }).join('\n\n---\n\n');

    if (onExport) {
      onExport(cells);
    } else {
      // Download as markdown file
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `caderno-${new Date().toISOString().split('T')[0]}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [cells, onExport]);

  const clearNotebook = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar todas as células? Esta ação não pode ser desfeita.')) {
      setCells([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const renderCell = (cell: NotebookCell, index: number) => {
    const props = {
      cell,
      onUpdate: (updates: Partial<NotebookCell>) => updateCell(cell.id, updates),
      onDelete: () => deleteCell(cell.id),
      onMoveUp: index > 0 ? () => moveCell(cell.id, 'up') : undefined,
      onMoveDown: index < cells.length - 1 ? () => moveCell(cell.id, 'down') : undefined,
      onAddCell: (type: CellType) => addCell(type, cell.id),
      isSelected: selectedCellId === cell.id,
      onSelect: () => setSelectedCellId(cell.id),
    };

    switch (cell.type) {
      case 'markdown':
        return <MarkdownCell key={cell.id} {...props} />;
      case 'code':
        return <CodeCell key={cell.id} {...props} />;
      case 'mermaid':
        return <MermaidCell key={cell.id} {...props} />;
      case 'query':
        return <QueryCell key={cell.id} {...props} />;
      case 'node-embed':
        return <NodeEmbedCell key={cell.id} {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => addCell('markdown')}
          >
            Adicionar Célula
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addCell('markdown')}
          >
            Markdown
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addCell('code')}
          >
            Código
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addCell('mermaid')}
          >
            Mermaid
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addCell('query')}
          >
            Consulta
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Download}
            onClick={handleExport}
          >
            Exportar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={clearNotebook}
          >
            Limpar
          </Button>
        </div>
      </div>

      {/* Cells */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
        {cells.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Caderno Vazio</h3>
              <p className="text-sm text-muted mb-4">
                Adicione células para começar a fazer anotações, escrever código ou criar diagramas.
              </p>
              <Button onClick={() => addCell('markdown')}>
                Adicionar Primeira Célula
              </Button>
            </div>
          </div>
        )}
        {cells.map((cell, index) => renderCell(cell, index))}
      </div>
    </div>
  );
}
