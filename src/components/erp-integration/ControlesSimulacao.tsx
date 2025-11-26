'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { simulacaoChoque } from '@/data/erp-integration/dadosMetricas';
import {
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Truck,
  Package,
  Zap
} from 'lucide-react';

interface ControlesSimulacaoProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

type SimulationState = 'idle' | 'running' | 'paused' | 'complete';

export function ControlesSimulacao({
  isOpen,
  onClose,
  className
}: ControlesSimulacaoProps) {
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [currentStepSem, setCurrentStepSem] = useState(-1);
  const [currentStepCom, setCurrentStepCom] = useState(-1);
  const [elapsedSem, setElapsedSem] = useState(0);
  const [elapsedCom, setElapsedCom] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setSimulationState('idle');
    setCurrentStepSem(-1);
    setCurrentStepCom(-1);
    setElapsedSem(0);
    setElapsedCom(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start simulation
  const startSimulation = useCallback(() => {
    resetSimulation();
    setSimulationState('running');

    let semStep = -1;
    let comStep = -1;
    let semElapsed = 0;
    let comElapsed = 0;
    let comDone = false;

    intervalRef.current = setInterval(() => {
      // Increment time
      semElapsed += 1;
      comElapsed += 1;
      setElapsedSem(semElapsed);
      setElapsedCom(comElapsed);

      // Progress "Com Foundry" faster (hours vs days)
      if (!comDone && comElapsed % 2 === 0 && comStep < simulacaoChoque.comFoundry.timeline.length - 1) {
        comStep += 1;
        setCurrentStepCom(comStep);
        if (comStep >= simulacaoChoque.comFoundry.timeline.length - 1) {
          comDone = true;
        }
      }

      // Progress "Sem Foundry" slower
      if (semElapsed % 4 === 0 && semStep < simulacaoChoque.semFoundry.timeline.length - 1) {
        semStep += 1;
        setCurrentStepSem(semStep);
      }

      // Check if simulation is complete
      if (
        semStep >= simulacaoChoque.semFoundry.timeline.length - 1 &&
        comStep >= simulacaoChoque.comFoundry.timeline.length - 1
      ) {
        setSimulationState('complete');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 500);
  }, [resetSimulation]);

  // Pause/resume simulation
  const togglePause = useCallback(() => {
    if (simulationState === 'running') {
      setSimulationState('paused');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else if (simulationState === 'paused') {
      setSimulationState('running');
      // Resume logic would go here
    }
  }, [simulationState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      resetSimulation(); // eslint-disable-line react-hooks/set-state-in-effect -- Reset on close is intentional
    }
  }, [isOpen, resetSimulation]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'erro':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'alerta':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'sucesso':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'erro':
        return 'border-red-500/50 bg-red-500/10';
      case 'alerta':
        return 'border-amber-500/50 bg-amber-500/10';
      case 'sucesso':
        return 'border-green-500/50 bg-green-500/10';
      default:
        return 'border-border bg-muted/20';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className={cn(
        'bg-background border border-border rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in zoom-in-95',
        className
      )}>
        {/* Header */}
        <div className="border-b border-border px-6 py-4 bg-gradient-to-r from-amber-500/10 to-red-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="font-bold text-xl">Simulação: {simulacaoChoque.evento}</h2>
                <p className="text-sm text-muted">{simulacaoChoque.descricao}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-foreground transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="border-b border-border px-6 py-3 bg-muted/20">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={startSimulation}
              disabled={simulationState === 'running'}
              className={cn(
                'flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all',
                simulationState === 'running'
                  ? 'bg-muted text-muted cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              )}
            >
              <Play className="w-4 h-4" />
              {simulationState === 'idle' ? 'Iniciar Simulação' : 'Reiniciar'}
            </button>

            {simulationState === 'running' && (
              <button
                onClick={togglePause}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-amber-500 text-white hover:bg-amber-600 transition-all"
              >
                <Pause className="w-4 h-4" />
                Pausar
              </button>
            )}

            <button
              onClick={resetSimulation}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-muted hover:bg-muted/80 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            {simulationState !== 'idle' && (
              <div className="ml-4 flex items-center gap-2 text-sm">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  simulationState === 'running' ? 'bg-green-500 animate-pulse' :
                  simulationState === 'paused' ? 'bg-amber-500' :
                  'bg-blue-500'
                )} />
                <span className="text-muted">
                  {simulationState === 'running' ? 'Simulando...' :
                   simulationState === 'paused' ? 'Pausado' :
                   'Completo'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Comparison */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* SEM FOUNDRY */}
            <div className="border border-red-500/30 rounded-xl overflow-hidden">
              <div className="bg-red-500/10 px-4 py-3 border-b border-red-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-red-500">SEM FOUNDRY</span>
                  </div>
                  <span className="text-sm text-muted">
                    Tempo decorrido: <span className="font-mono font-bold">{Math.floor(elapsedSem / 4)} dias</span>
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {simulacaoChoque.semFoundry.timeline.map((event, i) => {
                  const isCompleted = i <= currentStepSem;
                  const isActive = i === currentStepSem;

                  return (
                    <div
                      key={i}
                      className={cn(
                        'border rounded-lg p-3 transition-all duration-300',
                        isCompleted ? getStatusColor(event.status) : 'border-border/30 bg-transparent opacity-40',
                        isActive && 'ring-2 ring-offset-2 ring-offset-background ring-red-500'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center',
                          isCompleted ? 'bg-background' : 'bg-muted/30'
                        )}>
                          {isCompleted ? getStatusIcon(event.status) : (
                            <span className="text-xs text-muted">{i + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-muted mb-1">{event.tempo}</div>
                          <div className={cn(
                            'text-sm font-medium',
                            isCompleted ? 'text-foreground' : 'text-muted'
                          )}>
                            {event.acao}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Result */}
                <div className={cn(
                  'border-2 border-red-500/50 rounded-lg p-4 mt-4 transition-all duration-500',
                  simulationState === 'complete' ? 'opacity-100' : 'opacity-30'
                )}>
                  <div className="text-sm font-bold text-red-500 mb-3">RESULTADO:</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <Package className="w-5 h-5 text-red-500 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-red-500">
                        {simulacaoChoque.semFoundry.resultado.rupturas}
                      </div>
                      <div className="text-xs text-muted">Rupturas</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <TrendingDown className="w-5 h-5 text-red-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-red-500">
                        {simulacaoChoque.semFoundry.resultado.perdaVendas}
                      </div>
                      <div className="text-xs text-muted">Perda Vendas</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <Clock className="w-5 h-5 text-red-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-red-500">
                        {simulacaoChoque.semFoundry.resultado.tempoResposta}
                      </div>
                      <div className="text-xs text-muted">Resposta</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COM FOUNDRY */}
            <div className="border border-green-500/30 rounded-xl overflow-hidden">
              <div className="bg-green-500/10 px-4 py-3 border-b border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-green-500">COM FOUNDRY</span>
                  </div>
                  <span className="text-sm text-muted">
                    Tempo decorrido: <span className="font-mono font-bold">{Math.floor(elapsedCom / 2)} horas</span>
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {simulacaoChoque.comFoundry.timeline.map((event, i) => {
                  const isCompleted = i <= currentStepCom;
                  const isActive = i === currentStepCom;

                  return (
                    <div
                      key={i}
                      className={cn(
                        'border rounded-lg p-3 transition-all duration-300',
                        isCompleted ? getStatusColor(event.status) : 'border-border/30 bg-transparent opacity-40',
                        isActive && 'ring-2 ring-offset-2 ring-offset-background ring-green-500'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center',
                          isCompleted ? 'bg-background' : 'bg-muted/30'
                        )}>
                          {isCompleted ? getStatusIcon(event.status) : (
                            <span className="text-xs text-muted">{i + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-muted mb-1">{event.tempo}</div>
                          <div className={cn(
                            'text-sm font-medium',
                            isCompleted ? 'text-foreground' : 'text-muted'
                          )}>
                            {event.acao}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Result */}
                <div className={cn(
                  'border-2 border-green-500/50 rounded-lg p-4 mt-4 transition-all duration-500',
                  currentStepCom >= simulacaoChoque.comFoundry.timeline.length - 1 ? 'opacity-100' : 'opacity-30'
                )}>
                  <div className="text-sm font-bold text-green-500 mb-3">RESULTADO:</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-500/10 rounded-lg p-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-green-500">
                        {simulacaoChoque.comFoundry.resultado.rupturas}
                      </div>
                      <div className="text-xs text-muted">Rupturas</div>
                    </div>
                    <div className="bg-amber-500/10 rounded-lg p-2">
                      <Truck className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-amber-500">
                        {simulacaoChoque.comFoundry.resultado.custoExtra}
                      </div>
                      <div className="text-xs text-muted">Custo Extra</div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-2">
                      <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-green-500">
                        {simulacaoChoque.comFoundry.resultado.economiaLiquida}
                      </div>
                      <div className="text-xs text-muted">Economia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary comparison */}
          {simulationState === 'complete' && (
            <div className="mt-6 bg-gradient-to-r from-red-500/10 via-transparent to-green-500/10 border border-border rounded-xl p-6 animate-in slide-in-from-bottom-4">
              <h3 className="font-bold text-center mb-4">Resumo da Simulação</h3>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-sm text-muted mb-1">Sem Foundry</div>
                  <div className="text-2xl font-bold text-red-500">
                    {simulacaoChoque.semFoundry.resultado.perdaVendas}
                  </div>
                  <div className="text-xs text-muted">perda em vendas</div>
                </div>

                <div className="text-4xl text-muted">→</div>

                <div className="text-center">
                  <div className="text-sm text-muted mb-1">Com Foundry</div>
                  <div className="text-2xl font-bold text-green-500">
                    {simulacaoChoque.comFoundry.resultado.economiaLiquida}
                  </div>
                  <div className="text-xs text-muted">economia líquida</div>
                </div>

                <div className="h-12 w-px bg-border" />

                <div className="text-center">
                  <div className="text-sm text-muted mb-1">Diferença</div>
                  <div className="text-3xl font-bold text-primary">93%</div>
                  <div className="text-xs text-muted">impacto evitado</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ControlesSimulacao;
