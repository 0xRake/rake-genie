'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useNaturaStore, DemoPhase, PERSONAS } from '@/store/natura-store';
import { formatDuration, formatBRLCompact } from '@/lib/natura/formatting';

import { InteractiveDashboard } from './InteractiveDashboard';
import { ConflictResolution } from './ConflictResolution';
import { WasteOptimization } from './WasteOptimization';
import { ExecutiveSummary } from './ExecutiveSummary';

import {
  MapPin,
  GitMerge,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  RotateCcw,
  Target,
  ChevronDown,
  Save,
  Calendar
} from 'lucide-react';

interface PhaseConfig {
  id: DemoPhase;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const phaseConfigs: PhaseConfig[] = [
  { id: 'explore', icon: <MapPin size={14} />, label: 'Explorar', color: '#00A859' },
  { id: 'investigate', icon: <Target size={14} />, label: 'Investigar', color: '#3b82f6' },
  { id: 'resolve', icon: <GitMerge size={14} />, label: 'Resolver', color: '#8b5cf6' },
  { id: 'optimize', icon: <TrendingUp size={14} />, label: 'Otimizar', color: '#f59e0b' },
  { id: 'complete', icon: <FileText size={14} />, label: 'Resumo', color: '#22c55e' },
];

export function NaturaDemo() {
  const {
    phase,
    setPhase,
    metrics,
    sessionStartTime,
    reset,
    currentPersona,
    setPersona,
    decisions,
    simulatedDay,
  } = useNaturaStore();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionStartTime]);

  const transitionTo = useCallback((newPhase: DemoPhase) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase(newPhase);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, [setPhase]);

  const handlePhaseClick = useCallback((targetPhase: DemoPhase) => {
    const currentIndex = phaseConfigs.findIndex(p => p.id === phase);
    const targetIndex = phaseConfigs.findIndex(p => p.id === targetPhase);
    if (targetIndex <= currentIndex || targetPhase === 'explore') {
      transitionTo(targetPhase);
    }
  }, [phase, transitionTo]);

  const handleRestart = useCallback(() => {
    reset();
    setElapsedTime(0);
  }, [reset]);

  const getCurrentPhaseIndex = () => phaseConfigs.findIndex(p => p.id === phase);

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Streamlined Header */}
      <header className="flex-shrink-0 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left: Brand + Phase Nav */}
          <div className="flex items-center gap-6">
            {/* Compact Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A859] to-[#00A859]/70 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-sm">Natura & Co</span>
                <span className="text-[10px] text-muted ml-2 px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  FOUNDRY
                </span>
              </div>
            </div>

            {/* Phase Steps - Compact */}
            <nav className="flex items-center">
              {phaseConfigs.map((config, index) => {
                const isActive = config.id === phase;
                const isCompleted = index < getCurrentPhaseIndex();
                const isClickable = isCompleted || config.id === 'explore';

                return (
                  <React.Fragment key={config.id}>
                    {index > 0 && (
                      <div className={cn(
                        'w-4 h-px mx-1',
                        isCompleted ? 'bg-green-500' : 'bg-border'
                      )} />
                    )}
                    <button
                      onClick={() => handlePhaseClick(config.id)}
                      disabled={!isClickable}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all',
                        isActive
                          ? 'bg-foreground text-background font-medium'
                          : isCompleted
                          ? 'text-green-600 hover:bg-green-500/10'
                          : isClickable
                          ? 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          : 'text-muted-foreground/40 cursor-not-allowed'
                      )}
                    >
                      {isCompleted ? <CheckCircle2 size={12} className="text-green-500" /> : config.icon}
                      <span className="hidden md:inline">{config.label}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Right: Metrics + Persona + Actions */}
          <div className="flex items-center gap-3">
            {/* Session Info - Compact */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-muted-foreground">
              {decisions.length > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <Save size={11} />
                  <span>{decisions.length}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar size={11} />
                <span>Dia {simulatedDay}</span>
              </div>
              {metrics.valueOptimized > 0 && (
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <TrendingUp size={11} />
                  <span>{formatBRLCompact(metrics.valueOptimized)}</span>
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 text-xs">
              <Clock size={12} className="text-muted-foreground" />
              <span className="font-mono tabular-nums">{formatDuration(elapsedTime)}</span>
            </div>

            {/* Persona Selector */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-all',
                  'hover:bg-muted/50 border border-transparent',
                  showPersonaMenu && 'bg-muted/50 border-border'
                )}
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium text-primary">
                  {currentPersona.avatar}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">{currentPersona.name.split(' ')[0]}</span>
                <ChevronDown size={12} className={cn(
                  'text-muted-foreground transition-transform',
                  showPersonaMenu && 'rotate-180'
                )} />
              </button>

              {showPersonaMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPersonaMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-lg border border-border bg-background shadow-lg py-1">
                    <div className="px-3 py-2 border-b border-border/50">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Trocar Persona</div>
                    </div>
                    {PERSONAS.map(persona => (
                      <button
                        key={persona.id}
                        onClick={() => {
                          setPersona(persona);
                          setShowPersonaMenu(false);
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 transition-colors',
                          currentPersona.id === persona.id && 'bg-primary/5'
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                          currentPersona.id === persona.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}>
                          {persona.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{persona.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{persona.role}</div>
                        </div>
                        {currentPersona.id === persona.id && (
                          <CheckCircle2 size={14} className="text-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Reset */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestart}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw size={14} />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-0.5 bg-muted/30">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
            style={{ width: `${((getCurrentPhaseIndex() + 1) / phaseConfigs.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        'flex-1 overflow-hidden',
        'transition-opacity duration-150',
        isTransitioning ? 'opacity-0' : 'opacity-100'
      )}>
        {(phase === 'explore' || phase === 'investigate') && (
          <InteractiveDashboard
            onNavigateToConflict={() => transitionTo('resolve')}
            onNavigateToOptimize={() => transitionTo('optimize')}
          />
        )}
        {phase === 'resolve' && (
          <ConflictResolution
            onBatchMergeComplete={() => transitionTo('optimize')}
          />
        )}
        {phase === 'optimize' && (
          <WasteOptimization
            onScenarioExecuted={() => transitionTo('complete')}
          />
        )}
        {phase === 'complete' && (
          <ExecutiveSummary
            sessionDuration={elapsedTime}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
