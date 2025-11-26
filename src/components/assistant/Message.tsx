'use client';

import React, { useState } from 'react';
import { Bookmark, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChatMessage } from './ChatInterface';
import { CitationPopover } from './CitationPopover';
import { getCitation } from '@/data/citations';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  message: ChatMessage;
  onSaveToNotebook?: (content: string) => void;
}

export function Message({ message, onSaveToNotebook }: MessageProps) {
  const [hoveredCitation, setHoveredCitation] = useState<string | null>(null);

  // Parse citations from markdown text (format: [1], [2], etc.)
  const parseCitations = (text: string): Array<{ id: string; index: number; position: number }> => {
    const citationRegex = /\[(\d+)\]/g;
    const citations: Array<{ id: string; index: number; position: number }> = [];
    let match;
    let offset = 0;

    while ((match = citationRegex.exec(text)) !== null) {
      const citationIndex = parseInt(match[1], 10);
      const citationId = message.citations?.[citationIndex - 1];
      if (citationId) {
        citations.push({
          id: citationId,
          index: citationIndex,
          position: match.index + offset,
        });
      }
    }

    return citations;
  };

  const renderWithCitations = (text: string) => {
    const citations = parseCitations(text);
    if (citations.length === 0) {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      );
    }

    const parts: Array<{ text: string; isCitation: boolean; citationId?: string }> = [];
    let lastIndex = 0;

    citations.forEach(({ id, index, position }) => {
      // Add text before citation
      if (position > lastIndex) {
        parts.push({ text: text.slice(lastIndex, position), isCitation: false });
      }
      // Add citation marker
      parts.push({ text: `[${index}]`, isCitation: true, citationId: id });
      lastIndex = position + `[${index}]`.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), isCitation: false });
    }

    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {parts.map((part, i) => {
          if (part.isCitation && part.citationId) {
            const citation = getCitation(part.citationId);
            return (
              <span key={i} className="relative inline-block">
                <sup
                  className="text-primary cursor-pointer hover:underline"
                  onMouseEnter={() => setHoveredCitation(part.citationId || null)}
                  onMouseLeave={() => setHoveredCitation(null)}
                >
                  {part.text}
                </sup>
                {hoveredCitation === part.citationId && citation && (
                  <CitationPopover citation={citation} />
                )}
              </span>
            );
          }
          return <ReactMarkdown key={i}>{part.text}</ReactMarkdown>;
        })}
      </div>
    );
  };

  return (
    <div className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold">AI</span>
        </div>
      )}
      
      <Card className={`max-w-3xl ${message.role === 'user' ? 'bg-secondary' : ''}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {message.role === 'user' ? (
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-muted" />
                <span className="text-sm font-medium">You</span>
              </div>
            ) : null}
            
            <div className="text-sm text-foreground">
              {message.role === 'assistant' ? renderWithCitations(message.content) : message.content}
            </div>

            {message.role === 'assistant' && message.citations && message.citations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs text-muted">
                  Sources: {message.citations.map((id, i) => {
                    const citation = getCitation(id);
                    return citation ? (
                      <span key={id} className="mr-2">
                        [{i + 1}]{' '}
                        <span className="text-primary">{citation.title || citation.nodeId}</span>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {message.role === 'assistant' && onSaveToNotebook && (
            <Button
              variant="ghost"
              size="sm"
              icon={Bookmark}
              onClick={() => onSaveToNotebook(message.content)}
              className="shrink-0"
            >
              Save
            </Button>
          )}
        </div>
      </Card>

      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <User size={16} className="text-primary-foreground" />
        </div>
      )}
    </div>
  );
}

