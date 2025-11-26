'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Citation } from '@/data/citations';

interface CitationPopoverProps {
  citation: Citation;
}

export function CitationPopover({ citation }: CitationPopoverProps) {
  return (
    <Card className="absolute bottom-full left-0 mb-2 p-3 w-64 z-50 shadow-lg">
      <div className="text-xs">
        <div className="font-semibold mb-1">{citation.title || citation.nodeId}</div>
        {citation.description && (
          <div className="text-muted mb-2">{citation.description}</div>
        )}
        {citation.url && (
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View source →
          </a>
        )}
        <div className="text-muted mt-2 text-[10px]">
          Source: {citation.source}
        </div>
      </div>
    </Card>
  );
}

