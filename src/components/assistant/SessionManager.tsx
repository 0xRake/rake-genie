'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Session {
  id: string;
  name: string;
  createdAt: Date;
}

interface StoredSession {
  id: string;
  name: string;
  createdAt: string;
}

interface SessionManagerProps {
  currentSessionId: string | null;
  onSessionChange: (sessionId: string | null) => void;
}

const STORAGE_KEY = 'assistant-sessions';

export function SessionManager({ currentSessionId, onSessionChange }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load sessions from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const storedSessions: StoredSession[] = JSON.parse(stored);
        const parsed = storedSessions.map((s) => ({
          ...s,
          createdAt: new Date(s.createdAt),
        }));
        setSessions(parsed); // eslint-disable-line react-hooks/set-state-in-effect -- Loading from localStorage on mount is intentional
      } catch (e) {
        console.error('Failed to load sessions:', e);
      }
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || sessions.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const createNewSession = () => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      name: `Session ${sessions.length + 1}`,
      createdAt: new Date(),
    };
    setSessions(prev => [...prev, newSession]);
    onSessionChange(newSession.id);
    setIsOpen(false);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      onSessionChange(sessions.length > 1 ? sessions[0].id : null);
    }
  };

  const selectSession = (id: string) => {
    onSessionChange(id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={MessageSquare}
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentSessionId 
            ? sessions.find(s => s.id === currentSessionId)?.name || 'Select Session'
            : 'New Session'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={Plus}
          onClick={createNewSession}
        >
          New
        </Button>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-2 space-y-1">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-2 rounded hover:bg-secondary cursor-pointer ${
                    currentSessionId === session.id ? 'bg-secondary' : ''
                  }`}
                  onClick={() => selectSession(session.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{session.name}</div>
                    <div className="text-xs text-muted">
                      {session.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="p-1 hover:bg-destructive rounded"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="p-4 text-center text-sm text-muted">
                  No sessions yet. Create one to get started.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

