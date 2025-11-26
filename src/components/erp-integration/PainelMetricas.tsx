'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  metricasComparacao,
  metricasTecnicas,
  kpiResumo,
  dadosForecast,
  timelineIntegracao
} from '@/data/erp-integration/dadosMetricas';
import {
  TrendingUp,
  Clock,
  DollarSign,
  BarChart3,
  ArrowRight,
  Zap,
  Target,
  Calendar
} from 'lucide-react';

interface PainelMetricasProps {
  className?: string;
}

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(startValue + (value - startValue) * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {prefix}{count.toLocaleString('pt-BR')}{suffix}
    </span>
  );
}

export function PainelMetricas({ className }: PainelMetricasProps) {
  const [activeTab, setActiveTab] = useState<'roi' | 'tecnico' | 'timeline'>('roi');

  return (
    <div className={cn('flex flex-col h-full bg-background overflow-hidden', className)}>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/50 bg-background/95 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg">Métricas de ROI</span>
            <span className="text-sm text-muted">Natura & Co - Foundry Integration</span>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-muted/30 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('roi')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'roi'
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-foreground'
              )}
            >
              ROI Business
            </button>
            <button
              onClick={() => setActiveTab('tecnico')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'tecnico'
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-foreground'
              )}
            >
              Técnico
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'timeline'
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-foreground'
              )}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'roi' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted">Valor Total Anual</span>
                </div>
                <div className="text-3xl font-bold text-green-500">
                  {kpiResumo.valorTotalAnual}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-muted">Payback</span>
                </div>
                <div className="text-3xl font-bold text-blue-500">
                  {kpiResumo.paybackPeriodo}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-muted">ROI 3 Anos</span>
                </div>
                <div className="text-3xl font-bold text-purple-500">
                  {kpiResumo.roiTresAnos}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-amber-500" />
                  <span className="text-sm text-muted">Melhoria Forecast</span>
                </div>
                <div className="text-3xl font-bold text-amber-500">
                  +{dadosForecast.melhoriaPercentual}%
                </div>
              </div>
            </div>

            {/* Main Comparison Table */}
            <div className="bg-muted/20 rounded-xl border border-border overflow-hidden">
              <div className="bg-muted/30 px-6 py-3 border-b border-border">
                <h3 className="font-bold">Comparação de Métricas de Negócio</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted">Métrica</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-red-500">Atual (Sem Foundry)</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-muted"></th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-green-500">Com Foundry</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-muted">Valor Anual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricasComparacao.map((metrica, i) => (
                      <tr
                        key={i}
                        className={cn(
                          'border-b border-border/50 transition-colors hover:bg-muted/20',
                          metrica.destaque && 'bg-green-500/5'
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{metrica.icone}</span>
                            <span className="font-medium">{metrica.metrica}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-500 font-medium">
                            {metrica.atual}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <ArrowRight className="w-5 h-5 text-muted mx-auto" />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-500 font-bold">
                            {metrica.foundry}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={cn(
                            'font-bold',
                            metrica.destaque ? 'text-green-500' : 'text-foreground'
                          )}>
                            {metrica.valorAnual}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Value Breakdown */}
            <div className="grid grid-cols-4 gap-4">
              {kpiResumo.breakdown.map((item, i) => (
                <div
                  key={i}
                  className="bg-background border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="text-sm text-muted mb-2">{item.categoria}</div>
                  <div className="text-2xl font-bold text-primary">{item.valor}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tecnico' && (
          <div className="space-y-6">
            {/* Technical Metrics Table */}
            <div className="bg-muted/20 rounded-xl border border-border overflow-hidden">
              <div className="bg-muted/30 px-6 py-3 border-b border-border">
                <h3 className="font-bold">Comparação de Capacidades Técnicas</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted">Capacidade</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-red-500">Abordagem Tradicional</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-muted"></th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-green-500">Palantir Foundry</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-blue-500">Redução</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricasTecnicas.map((metrica, i) => (
                      <tr key={i} className="border-b border-border/50 transition-colors hover:bg-muted/20">
                        <td className="px-6 py-4 font-medium">{metrica.capacidade}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-500 text-sm">
                            {metrica.tradicional}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Zap className="w-5 h-5 text-amber-500 mx-auto" />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-500 font-bold text-sm">
                            {metrica.foundry}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-500 font-bold">
                            -{metrica.reducao}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Forecast Accuracy Comparison */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-red-500/5 border border-red-500/30 rounded-xl p-6">
                <h4 className="font-bold text-red-500 mb-4">Forecast Atual</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">Acurácia</span>
                      <span className="font-bold">{dadosForecast.antes.acuracia}%</span>
                    </div>
                    <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all duration-1000"
                        style={{ width: `${dadosForecast.antes.acuracia}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">Confiança</span>
                      <span className="font-bold">{dadosForecast.antes.confianca}%</span>
                    </div>
                    <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full transition-all duration-1000"
                        style={{ width: `${dadosForecast.antes.confianca}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted">
                    Desvio médio: ±{dadosForecast.antes.desvio}%
                  </div>
                </div>
              </div>

              <div className="bg-green-500/5 border border-green-500/30 rounded-xl p-6">
                <h4 className="font-bold text-green-500 mb-4">Forecast com Foundry</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">Acurácia</span>
                      <span className="font-bold">{dadosForecast.depois.acuracia}%</span>
                    </div>
                    <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${dadosForecast.depois.acuracia}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">Confiança</span>
                      <span className="font-bold">{dadosForecast.depois.confianca}%</span>
                    </div>
                    <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400 rounded-full transition-all duration-1000"
                        style={{ width: `${dadosForecast.depois.confianca}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted">
                    Desvio médio: ±{dadosForecast.depois.desvio}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {/* Timeline Comparison */}
            <div className="grid grid-cols-2 gap-6">
              {/* Traditional */}
              <div className="bg-red-500/5 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-red-500">Abordagem Tradicional</h4>
                  <span className="text-2xl font-bold text-red-500">
                    {timelineIntegracao.totalTradicional} semanas
                  </span>
                </div>
                <div className="space-y-3">
                  {timelineIntegracao.tradicional.map((fase, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-16 text-right text-sm text-muted">
                        {fase.semanas}sem
                      </div>
                      <div className="flex-1 h-8 bg-red-500/20 rounded-lg relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-red-500/50 rounded-lg"
                          style={{ width: `${(fase.semanas / timelineIntegracao.totalTradicional) * 100}%` }}
                        />
                        <span className="absolute inset-0 flex items-center px-3 text-xs font-medium">
                          {fase.fase}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foundry */}
              <div className="bg-green-500/5 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-green-500">Palantir Foundry</h4>
                  <span className="text-2xl font-bold text-green-500">
                    {timelineIntegracao.totalFoundry} semanas
                  </span>
                </div>
                <div className="space-y-3">
                  {timelineIntegracao.foundry.map((fase, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-16 text-right text-sm text-muted">
                        {fase.semanas}sem
                      </div>
                      <div className="flex-1 h-8 bg-green-500/20 rounded-lg relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-green-500/50 rounded-lg"
                          style={{ width: `${(fase.semanas / timelineIntegracao.totalFoundry) * 100}%` }}
                        />
                        <span className="absolute inset-0 flex items-center px-3 text-xs font-medium">
                          {fase.fase}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-primary/30 rounded-xl p-6">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-sm text-muted mb-1">Tempo Tradicional</div>
                  <div className="text-3xl font-bold text-red-500">
                    {timelineIntegracao.totalTradicional} semanas
                  </div>
                  <div className="text-xs text-muted">≈ 18 meses</div>
                </div>

                <ArrowRight className="w-8 h-8 text-primary" />

                <div className="text-center">
                  <div className="text-sm text-muted mb-1">Tempo Foundry</div>
                  <div className="text-3xl font-bold text-green-500">
                    {timelineIntegracao.totalFoundry} semanas
                  </div>
                  <div className="text-xs text-muted">≈ 2 meses</div>
                </div>

                <div className="h-12 w-px bg-border" />

                <div className="text-center">
                  <div className="text-sm text-muted mb-1">Redução</div>
                  <div className="text-3xl font-bold text-primary">
                    90%
                  </div>
                  <div className="text-xs text-muted">tempo to value</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PainelMetricas;
