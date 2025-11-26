'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { RedeERPs } from './RedeERPs';
import { CamadaFoundry } from './CamadaFoundry';
import { exemploRastreamentoSKU } from '@/data/erp-integration/sistemasERP';
import {
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle2,
  Package,
  GitMerge,
  Eye
} from 'lucide-react';

type ViewMode = 'split' | 'sem' | 'com';

interface ComparacaoInterativaProps {
  onSimulateChoque?: () => void;
  className?: string;
}

export function ComparacaoInterativa({
  onSimulateChoque,
  className
}: ComparacaoInterativaProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showSKUTrace, setShowSKUTrace] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleModeChange = useCallback((mode: ViewMode) => {
    if (mode === viewMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 150);
  }, [viewMode]);

  const toggleSKUTrace = useCallback(() => {
    setShowSKUTrace(prev => !prev);
  }, []);

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Control Bar */}
      <div className="flex-shrink-0 border-b border-border/50 bg-background/95 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
            <span className="font-bold">Comparação Interativa</span>
            <span className="text-xs text-muted">ERP Fragmentado vs. Foundry Integrado</span>
          </div>

          {/* Center: View Toggle */}
          <div className="flex items-center gap-1 bg-muted/30 rounded-xl p-1">
            <button
              onClick={() => handleModeChange('sem')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                viewMode === 'sem'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-muted hover:text-foreground hover:bg-muted/50'
              )}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Sem Foundry
              </span>
            </button>
            <button
              onClick={() => handleModeChange('split')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                viewMode === 'split'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted hover:text-foreground hover:bg-muted/50'
              )}
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Lado a Lado
              </span>
            </button>
            <button
              onClick={() => handleModeChange('com')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                viewMode === 'com'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-muted hover:text-foreground hover:bg-muted/50'
              )}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Com Foundry
              </span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSKUTrace}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                showSKUTrace
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-muted/30 text-muted hover:text-foreground'
              )}
            >
              <Package className="w-4 h-4" />
              Rastrear SKU
            </button>
            <button
              onClick={onSimulateChoque}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
            >
              <GitMerge className="w-4 h-4" />
              Simular Choque
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className={cn(
            'w-full h-full transition-all duration-300',
            isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
          )}
        >
          {viewMode === 'split' && (
            <div className="flex h-full">
              {/* Left: Fragmented */}
              <div className="flex-1 border-r border-border/50 relative">
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  SEM FOUNDRY
                </div>
                <RedeERPs animated className="h-full" />
              </div>

              {/* Right: Integrated */}
              <div className="flex-1 relative">
                <div className="absolute top-4 left-4 z-10 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  COM FOUNDRY
                </div>
                <CamadaFoundry animated className="h-full" />
              </div>
            </div>
          )}

          {viewMode === 'sem' && (
            <RedeERPs animated className="h-full" />
          )}

          {viewMode === 'com' && (
            <CamadaFoundry animated className="h-full" />
          )}
        </div>

        {/* SKU Trace Overlay */}
        {showSKUTrace && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex items-center justify-center p-8">
            <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-4xl w-full p-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-bold text-lg">Rastreamento de SKU</h3>
                    <p className="text-sm text-muted">{exemploRastreamentoSKU.produto}</p>
                  </div>
                </div>
                <button
                  onClick={toggleSKUTrace}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Without Foundry */}
                <div className="border border-red-500/30 rounded-xl p-4 bg-red-500/5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-red-500">Sem Foundry</span>
                  </div>

                  <div className="space-y-3">
                    {exemploRastreamentoSKU.semFoundry.map((trace, i) => (
                      <div
                        key={i}
                        className="bg-background/50 rounded-lg p-3 border border-red-500/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-muted">{trace.erp}</span>
                          <code className="text-xs bg-red-500/20 px-2 py-0.5 rounded text-red-400">
                            {trace.codigo}
                          </code>
                        </div>
                        <div className="text-sm font-medium">{trace.descricao}</div>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted">
                          <span>Unidade: <span className="text-amber-500">{trace.unidade}</span></span>
                          <span>Qtd: {trace.quantidade?.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                    <div className="text-xs text-red-400 font-medium mb-1">Problema:</div>
                    <div className="text-sm text-muted">
                      4 códigos diferentes para o mesmo produto.
                      Impossível calcular inventário real.
                    </div>
                  </div>
                </div>

                {/* With Foundry */}
                <div className="border border-green-500/30 rounded-xl p-4 bg-green-500/5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-green-500">Com Foundry</span>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4 border border-green-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-muted">SKU Unificado</span>
                      <code className="text-sm bg-green-500/20 px-3 py-1 rounded text-green-400 font-bold">
                        {exemploRastreamentoSKU.comFoundry.id}
                      </code>
                    </div>

                    <div className="text-lg font-bold mb-4">
                      {exemploRastreamentoSKU.comFoundry.nome}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-500/10 rounded-lg p-3">
                        <div className="text-xs text-muted mb-1">Unidade Padrão</div>
                        <div className="font-bold text-green-400">
                          {exemploRastreamentoSKU.comFoundry.unidade}
                        </div>
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-3">
                        <div className="text-xs text-muted mb-1">Fontes Mapeadas</div>
                        <div className="font-bold text-green-400">
                          {exemploRastreamentoSKU.comFoundry.fontesMapeadas} ERPs
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <div className="text-xs text-blue-400 font-medium mb-2">
                        Inventário Total Consolidado
                      </div>
                      <div className="text-3xl font-bold text-blue-400">
                        {exemploRastreamentoSKU.comFoundry.inventarioTotal.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        unidades disponíveis
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                    <div className="text-xs text-green-400 font-medium mb-1">Resultado:</div>
                    <div className="text-sm text-muted">
                      Single source of truth. Visibilidade 100%.
                      Decisões baseadas em dados reais.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stats Bar */}
      <div className="flex-shrink-0 border-t border-border/50 bg-muted/20 px-6 py-3">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-muted">Sem Foundry:</span>
              <span className="font-bold text-red-500">70% acurácia</span>
            </div>
            <span className="text-muted">→</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted">Com Foundry:</span>
              <span className="font-bold text-green-500">87% acurácia</span>
            </div>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted">Melhoria:</span>
            <span className="font-bold text-primary">+24%</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted">Economia anual:</span>
            <span className="font-bold text-green-500">R$ 181M</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparacaoInterativa;
