'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { RedeERPs } from './RedeERPs';
import { CamadaFoundry } from './CamadaFoundry';
import { ComparacaoInterativa } from './ComparacaoInterativa';
import { PainelMetricas } from './PainelMetricas';
import { ControlesSimulacao } from './ControlesSimulacao';
import {
  Network,
  Layers,
  GitCompare,
  BarChart3,
  ChevronRight,
  Play,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export type DemoScene = 'fragmentado' | 'integrado' | 'comparacao' | 'metricas';

interface SceneConfig {
  id: DemoScene;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const sceneConfigs: SceneConfig[] = [
  {
    id: 'fragmentado',
    label: 'Estado Fragmentado',
    shortLabel: 'Fragmentado',
    icon: <Network size={16} />,
    description: '7 ERPs desconectados',
    color: '#EF4444'
  },
  {
    id: 'integrado',
    label: 'Foundry Integrado',
    shortLabel: 'Integrado',
    icon: <Layers size={16} />,
    description: 'Camada de unificação',
    color: '#0066CC'
  },
  {
    id: 'comparacao',
    label: 'Comparação Interativa',
    shortLabel: 'Comparar',
    icon: <GitCompare size={16} />,
    description: 'Lado a lado',
    color: '#8B5CF6'
  },
  {
    id: 'metricas',
    label: 'Métricas de ROI',
    shortLabel: 'ROI',
    icon: <BarChart3 size={16} />,
    description: 'Impacto financeiro',
    color: '#22C55E'
  }
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function ERPIntegrationDemo() {
  const [currentScene, setCurrentScene] = useState<DemoScene>('fragmentado');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [sessionStartTime] = useState(() => Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSimulation, setShowSimulation] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update elapsed time
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

  const transitionTo = useCallback((scene: DemoScene) => {
    if (scene === currentScene) return;
    setIsTransitioning(true);
    setInteractionCount(prev => prev + 1);
    setTimeout(() => {
      setCurrentScene(scene);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, [currentScene]);

  const handleSimulateChoque = useCallback(() => {
    setShowSimulation(true);
    setInteractionCount(prev => prev + 1);
  }, []);

  const getCurrentSceneIndex = useCallback(() => sceneConfigs.findIndex(s => s.id === currentScene), [currentScene]);
  const currentSceneConfig = sceneConfigs.find(s => s.id === currentScene);

  const goToNextScene = useCallback(() => {
    const currentIndex = getCurrentSceneIndex();
    if (currentIndex < sceneConfigs.length - 1) {
      transitionTo(sceneConfigs[currentIndex + 1].id);
    }
  }, [getCurrentSceneIndex, transitionTo]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Natura & Palantir Logos */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A859] to-[#00A859]/70 flex items-center justify-center shadow-lg shadow-[#00A859]/20">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0066CC] border-2 border-background flex items-center justify-center">
                  <span className="text-white text-[6px] font-bold">◆</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-lg">Natura & Co × Foundry</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                    <Sparkles size={10} />
                    INTEGRAÇÃO ERP
                  </span>
                </div>
              </div>
            </div>

            {/* Scene Navigation */}
            <div className="flex items-center gap-1 ml-6 pl-6 border-l border-border/50">
              {sceneConfigs.map((scene, index) => {
                const isActive = scene.id === currentScene;
                const isPast = index < getCurrentSceneIndex();

                return (
                  <React.Fragment key={scene.id}>
                    {index > 0 && (
                      <div className={cn(
                        'w-8 h-0.5 mx-1 rounded-full transition-all duration-500',
                        isPast ? 'bg-green-500' : 'bg-border'
                      )} />
                    )}
                    <button
                      onClick={() => transitionTo(scene.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-300',
                        'transform hover:scale-105',
                        isActive
                          ? 'text-white shadow-lg'
                          : isPast
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                          : 'text-muted hover:text-foreground hover:bg-muted/50'
                      )}
                      style={isActive ? {
                        backgroundColor: scene.color
                      } : undefined}
                    >
                      {isPast ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        scene.icon
                      )}
                      <span className="hidden xl:inline font-medium">{scene.shortLabel}</span>
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
              <div className="text-xs text-muted">Progresso</div>
              <div className="flex gap-1">
                {sceneConfigs.map((scene, i) => (
                  <div
                    key={scene.id}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-500',
                      i <= getCurrentSceneIndex() ? 'bg-green-500' : 'bg-border'
                    )}
                  />
                ))}
              </div>
              <div className="text-xs font-medium">{getCurrentSceneIndex() + 1}/4</div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30">
                <Clock size={14} className="text-muted" />
                <span className="font-mono">{formatDuration(elapsedTime)}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
                <Play size={14} className="text-primary" />
                <span className="font-medium text-primary">{interactionCount}</span>
                <span className="text-muted hidden sm:inline">ações</span>
              </div>
            </div>
          </div>
        </div>

        {/* Context Bar */}
        <div className="px-6 py-2 border-t border-border/30 bg-gradient-to-r from-transparent via-muted/20 to-transparent">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentSceneConfig?.color }}
              />
              <span className="text-muted">
                {currentSceneConfig?.description}
              </span>
            </div>

            {getCurrentSceneIndex() < sceneConfigs.length - 1 && (
              <button
                onClick={goToNextScene}
                className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
                <span>Próximo: {sceneConfigs[getCurrentSceneIndex() + 1]?.shortLabel}</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        'flex-1 overflow-hidden relative',
        'transition-all duration-300',
        isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
      )}>
        {currentScene === 'fragmentado' && (
          <RedeERPs animated className="h-full" />
        )}
        {currentScene === 'integrado' && (
          <CamadaFoundry animated className="h-full" />
        )}
        {currentScene === 'comparacao' && (
          <ComparacaoInterativa
            onSimulateChoque={handleSimulateChoque}
            className="h-full"
          />
        )}
        {currentScene === 'metricas' && (
          <PainelMetricas className="h-full" />
        )}
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Simulation Modal */}
      <ControlesSimulacao
        isOpen={showSimulation}
        onClose={() => setShowSimulation(false)}
      />
    </div>
  );
}

export default ERPIntegrationDemo;
