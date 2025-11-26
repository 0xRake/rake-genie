'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { ConflictResolution } from './ConflictResolution';
import { WasteOptimization } from './WasteOptimization';
import { ExecutiveSummary } from './ExecutiveSummary';
import { Warehouse } from '@/data/natura/inventory';
import { formatDuration } from '@/lib/natura/formatting';
import {
  MapPin,
  GitMerge,
  TrendingUp,
  FileText,
  ChevronRight,
  Play,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export type DemoFlow = 'dashboard' | 'conflicts' | 'optimization' | 'complete';

interface FlowStep {
  id: DemoFlow;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const flowSteps: FlowStep[] = [
  {
    id: 'dashboard',
    label: 'Executive Dashboard',
    shortLabel: 'Dashboard',
    icon: <MapPin size={16} />,
    description: 'Visualize inventory across Brazil',
    color: '#00A859'
  },
  {
    id: 'conflicts',
    label: 'Conflict Resolution',
    shortLabel: 'Conflicts',
    icon: <GitMerge size={16} />,
    description: 'Unify catalog with ML',
    color: '#6366f1'
  },
  {
    id: 'optimization',
    label: 'Waste Optimization',
    shortLabel: 'Optimize',
    icon: <TrendingUp size={16} />,
    description: 'Simulate transfer scenarios',
    color: '#f59e0b'
  },
  {
    id: 'complete',
    label: 'Executive Summary',
    shortLabel: 'Summary',
    icon: <FileText size={16} />,
    description: 'Generate report',
    color: '#22c55e'
  }
];

export function NaturaDemo() {
  const [currentFlow, setCurrentFlow] = useState<DemoFlow>('dashboard');
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update elapsed time every second
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionStartTime]);

  const transitionTo = useCallback((flow: DemoFlow) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentFlow(flow);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, []);

  const handleSKUSelect = useCallback((sku: string, warehouse: Warehouse) => {
    setSelectedSku(sku);
    setSelectedWarehouse(warehouse);
    setInteractionCount(prev => prev + 1);
    transitionTo('conflicts');
  }, [transitionTo]);

  const handleBatchMergeComplete = useCallback(() => {
    setInteractionCount(prev => prev + 1);
    transitionTo('optimization');
  }, [transitionTo]);

  const handleScenarioExecuted = useCallback(() => {
    setInteractionCount(prev => prev + 1);
    transitionTo('complete');
  }, [transitionTo]);

  const handleRestart = useCallback(() => {
    transitionTo('dashboard');
    setSelectedSku(null);
    setSelectedWarehouse(null);
    setInteractionCount(0);
  }, [transitionTo]);

  const navigateToFlow = useCallback((flow: DemoFlow) => {
    const currentIndex = flowSteps.findIndex(s => s.id === currentFlow);
    const targetIndex = flowSteps.findIndex(s => s.id === flow);

    if (targetIndex <= currentIndex || flow === 'dashboard') {
      transitionTo(flow);
    }
  }, [currentFlow, transitionTo]);

  const getCurrentFlowIndex = () => flowSteps.findIndex(s => s.id === currentFlow);
  const currentStep = flowSteps.find(s => s.id === currentFlow);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Enhanced Header */}
      <div className="flex-shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Natura Logo */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A859] to-[#00A859]/70 flex items-center justify-center shadow-lg shadow-[#00A859]/20">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#ED1164] border-2 border-background flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">A</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-lg">Natura & Co</span>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs bg-primary/10 text-primary border-primary/20">
                    <Sparkles size={10} className="mr-1" />
                    FOUNDRY DEMO
                  </Badge>
                </div>
              </div>
            </div>

            {/* Flow Steps Navigation */}
            <div className="flex items-center gap-1 ml-6 pl-6 border-l border-border/50">
              {flowSteps.map((step, index) => {
                const isActive = step.id === currentFlow;
                const isCompleted = index < getCurrentFlowIndex();
                const isClickable = isCompleted || step.id === 'dashboard';

                return (
                  <React.Fragment key={step.id}>
                    {index > 0 && (
                      <div className={cn(
                        'w-8 h-0.5 mx-1 rounded-full transition-all duration-500',
                        isCompleted ? 'bg-green-500' : 'bg-border'
                      )} />
                    )}
                    <button
                      onClick={() => isClickable && navigateToFlow(step.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-300',
                        'transform hover:scale-105',
                        isActive
                          ? 'bg-gradient-to-r text-white shadow-lg'
                          : isCompleted
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                          : 'text-muted hover:text-foreground hover:bg-muted/50',
                        isClickable ? 'cursor-pointer' : 'cursor-default opacity-50'
                      )}
                      style={isActive ? {
                        backgroundImage: `linear-gradient(135deg, ${step.color}, ${step.color}99)`
                      } : undefined}
                      disabled={!isClickable}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        step.icon
                      )}
                      <span className="hidden xl:inline font-medium">{step.shortLabel}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Right: Session Metrics */}
          <div className="flex items-center gap-6">
            {/* Progress indicator */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30">
              <div className="text-xs text-muted">Progress</div>
              <div className="flex gap-1">
                {flowSteps.map((step, i) => (
                  <div
                    key={step.id}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-500',
                      i <= getCurrentFlowIndex() ? 'bg-green-500' : 'bg-border'
                    )}
                  />
                ))}
              </div>
              <div className="text-xs font-medium">{getCurrentFlowIndex() + 1}/4</div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30">
                <Clock size={14} className="text-muted" />
                <span className="font-mono">{formatDuration(elapsedTime)}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
                <Play size={14} className="text-primary" />
                <span className="font-medium text-primary">{interactionCount}</span>
                <span className="text-muted hidden sm:inline">actions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contextual Message Bar */}
        {currentFlow !== 'dashboard' && currentFlow !== 'complete' && (
          <div className={cn(
            'px-6 py-2 border-t border-border/30',
            'bg-gradient-to-r from-transparent via-muted/20 to-transparent'
          )}>
            <div className="flex items-center gap-3 text-sm">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentStep?.color }}
              />
              {currentFlow === 'conflicts' && (
                <span className="text-muted">
                  Investigating why <span className="text-foreground font-medium">&apos;{selectedSku}&apos;</span> appears differently across ERPs.
                  <span className="text-primary ml-2">Resolve conflicts to unify the catalog.</span>
                </span>
              )}
              {currentFlow === 'optimization' && (
                <span className="text-muted">
                  Catalog unified. Now let&apos;s <span className="text-amber-500 font-medium">quantify waste</span> and
                  <span className="text-green-500 font-medium"> simulate optimization scenarios</span>.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area with Transitions */}
      <div className={cn(
        'flex-1 overflow-hidden relative',
        'transition-all duration-300',
        isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
      )}>
        {currentFlow === 'dashboard' && (
          <ExecutiveDashboard onSKUSelect={handleSKUSelect} />
        )}
        {currentFlow === 'conflicts' && (
          <ConflictResolution
            initialSku={selectedSku || undefined}
            onBatchMergeComplete={handleBatchMergeComplete}
          />
        )}
        {currentFlow === 'optimization' && (
          <WasteOptimization onScenarioExecuted={handleScenarioExecuted} />
        )}
        {currentFlow === 'complete' && (
          <ExecutiveSummary
            sessionDuration={elapsedTime}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
