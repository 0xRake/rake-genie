'use client';

import React, { useCallback } from 'react';
import { ChatInterface } from '@/components/assistant/ChatInterface';

export function AssistantTab() {
  const handleSaveToNotebook = useCallback((content: string) => {
    // Guard for SSR
    if (typeof window === 'undefined') return;

    // TODO: Integrate with notebook store
    console.log('Saving to notebook:', content);
    // For now, store in localStorage as a temporary solution
    try {
      const existing = localStorage.getItem('notebook-cells');
      const cells = existing ? JSON.parse(existing) : [];
      cells.push({
        id: `cell-${Date.now()}`,
        type: 'markdown',
        content,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('notebook-cells', JSON.stringify(cells));
    } catch (e) {
      console.error('Failed to save to notebook:', e);
    }
  }, []);

  return (
    <div className="h-full">
      <ChatInterface onSaveToNotebook={handleSaveToNotebook} />
    </div>
  );
}

