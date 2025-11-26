'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { streamGemini } from '@/lib/gemini';
import { Message } from './Message';
import { SessionManager } from './SessionManager';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSaveToNotebook?: (content: string) => void;
}

export function ChatInterface({ onSaveToNotebook }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    // Create assistant message placeholder
    const assistantMessageId = `msg-${Date.now() + 1}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      citations: [],
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Abort previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      let fullContent = '';
      const citations: string[] = [];

      // Stream response
      for await (const chunk of streamGemini(userMessage.content)) {
        if (abortControllerRef.current.signal.aborted) {
          break;
        }

        fullContent += chunk.text;
        if (chunk.citations) {
          citations.push(...chunk.citations);
        }

        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: fullContent, citations: [...new Set(citations)] }
            : msg
        ));
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Chat error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: `**Error:** ${error.message || 'Failed to get response'}` }
          : msg
      ));
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [input, isStreaming]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveToNotebook = useCallback((content: string) => {
    if (onSaveToNotebook) {
      onSaveToNotebook(content);
    }
  }, [onSaveToNotebook]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Session Manager */}
      <div className="border-b border-border p-4">
        <SessionManager
          currentSessionId={currentSessionId}
          onSessionChange={setCurrentSessionId}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <Card className="p-8 max-w-md text-center">
              <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
              <p className="text-sm text-muted mb-4">
                Ask questions about Palantir Foundry, the Ontology, AIP, or any concept in the knowledge graph.
              </p>
              <div className="text-xs text-muted space-y-1">
                <p>Example queries:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>"What is Palantir's Ontology?"</li>
                  <li>"How do I create a data pipeline?"</li>
                  <li>"Explain AIP Logic and tool use"</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onSaveToNotebook={handleSaveToNotebook}
          />
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 text-muted text-sm">
            <Loader2 className="animate-spin" size={16} />
            <span>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Foundry, Ontology, AIP, or any concept..."
            disabled={isStreaming}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            icon={isStreaming ? Loader2 : Send}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

