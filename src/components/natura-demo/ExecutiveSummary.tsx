'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  pilotProjection,
  year1Projection
} from '@/data/natura/optimization';
import {
  formatBRL,
  formatBRLCompact,
  formatNumber,
  formatDays,
  formatROI,
  formatPercent,
  formatDuration
} from '@/lib/natura/formatting';
import {
  FileText,
  Download,
  Mail,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Users
} from 'lucide-react';

interface ExecutiveSummaryProps {
  sessionDuration: number; // in seconds
  onRestart: () => void;
}

export function ExecutiveSummary({ sessionDuration, onRestart }: ExecutiveSummaryProps) {
  const handleDownloadPDF = () => {
    // In production, would generate actual PDF
    alert('PDF download would be triggered here');
  };

  const handleEmailStakeholders = () => {
    // In production, would open email dialog
    alert('Email stakeholders dialog would open here');
  };

  const handleScheduleCall = () => {
    // In production, would open calendar integration
    window.open('https://calendly.com', '_blank');
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Value Card */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-2 border-green-500/30 text-center">
          <Badge variant="green" className="text-sm px-4 py-1.5 mb-4">
            <CheckCircle2 size={14} className="mr-2" />
            Demo Complete
          </Badge>
          <div className="text-sm text-muted mb-2 uppercase tracking-wider">Value Captured This Session</div>
          <div className="text-5xl font-bold text-green-500 mb-2">
            {formatBRLCompact(3760000)}
          </div>
          <div className="text-sm text-muted">
            ROI: <span className="font-bold text-green-500">13.9x</span> | Time: {formatDuration(sessionDuration)} | Scope: 1 SKU × 2 Warehouses
          </div>
        </Card>

        {/* Header */}
        <Card className="p-6 mb-6 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-3">
                <FileText size={24} />
                NATURA & CO - FOUNDRY PILOT RESULTS
              </h1>
              <p className="text-muted text-sm mt-1">
                Session: {new Date().toLocaleDateString('pt-BR')} | Duration: {formatDuration(sessionDuration)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-xs text-muted">
                <div>Scale Projection</div>
                <div className="font-bold text-lg text-foreground">{formatBRLCompact(year1Projection.savingsTotal)}/year</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Conflicts Resolved', value: '892', sub: '72h automated', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { label: 'Excess Identified', value: formatBRLCompact(8200000), sub: '214 days coverage', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Stockout Prevented', value: formatBRLCompact(2100000), sub: 'Recife shortage', color: 'text-red-500', bg: 'bg-red-500/10' },
            { label: 'Units Transferred', value: '40k', sub: '8-day execution', color: 'text-green-500', bg: 'bg-green-500/10' }
          ].map((stat, idx) => (
            <Card key={idx} className={`p-4 ${stat.bg} border-0`}>
              <div className="text-xs text-muted mb-1 uppercase tracking-wider">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted">{stat.sub}</div>
            </Card>
          ))}
        </div>

        {/* Actions Executed */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target size={20} />
            AÇÕES EXECUTADAS
          </h2>

          <div className="space-y-4">
            {/* Action 1: Unified Catalog */}
            <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="font-semibold">1. Unified Catalog</span>
              </div>
              <ul className="text-sm space-y-1 ml-6 text-muted">
                <li>• 892 conflitos resolvidos (auto-merge ML)</li>
                <li>• 1 Golden Record criado: Chronos Anti-idade Sérum</li>
                <li>• o9 forecast confidence: <span className="text-green-500 font-medium">67% → 94% (+27pp)</span></li>
              </ul>
            </div>

            {/* Action 2: Waste Detection */}
            <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-amber-500">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={18} className="text-amber-500" />
                <span className="font-semibold">2. Waste Detection</span>
              </div>
              <ul className="text-sm space-y-1 ml-6 text-muted">
                <li>• <span className="font-medium text-foreground">{formatBRLCompact(53500000)}</span> desperdício identificado (total)</li>
                <li>• Excess inventory: {formatBRLCompact(34600000)}</li>
                <li>• Stockout risk: {formatBRLCompact(18900000)}</li>
              </ul>
            </div>

            {/* Action 3: Optimization Executed */}
            <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={18} className="text-primary" />
                <span className="font-semibold">3. Optimization Executed</span>
              </div>
              <ul className="text-sm space-y-1 ml-6 text-muted">
                <li>• Transfer 40k units Cajamar → Recife</li>
                <li>• Investment: {formatBRLCompact(154200)}</li>
                <li>• Value captured: <span className="text-green-500 font-medium">{formatBRLCompact(2149038)}</span></li>
                <li>• ROI: <span className="text-green-500 font-bold">13,9x</span></li>
                <li>• Timeline: 8 dias</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Financial Impact */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            IMPACTO FINANCEIRO
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Pilot 30 Days */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock size={16} />
                Pilot 30 Dias (Este Demo × 100 SKUs)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Value captured:</span>
                  <span className="font-bold text-green-500">{formatBRLCompact(pilotProjection.valueCaptured)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Investment pilot:</span>
                  <span>{formatBRLCompact(pilotProjection.investment)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted">ROI pilot:</span>
                  <span className="font-bold text-primary">{pilotProjection.roi}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Payback:</span>
                  <span className="font-medium">{pilotProjection.paybackDays} dias</span>
                </div>
              </div>
            </div>

            {/* Year 1 Projection */}
            <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-green-500" />
                Year 1 Projeção (100k SKUs)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">{year1Projection.wasteCapturePercent}% waste capture:</span>
                  <span className="font-bold text-green-500">{formatBRLCompact(year1Projection.savingsTotal)} savings</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Foundry investment:</span>
                  <span>{formatBRLCompact(year1Projection.foundryInvestment)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted">Net value:</span>
                  <span className="font-bold text-green-500">{formatBRLCompact(year1Projection.netValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">ROI:</span>
                  <span className="font-bold">{year1Projection.roiPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ArrowRight size={20} />
            PRÓXIMOS PASSOS
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">1</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1 flex items-center gap-2">
                  <Users size={16} />
                  Technical validation call (2h)
                </div>
                <ul className="text-sm text-muted space-y-1">
                  <li>• Connect real SAP/Oracle instances</li>
                  <li>• Validate data volumes/schemas</li>
                  <li>• Security & compliance review</li>
                </ul>
              </div>
              <Button variant="secondary" size="sm" onClick={handleScheduleCall}>
                <Calendar size={14} className="mr-1" />
                Schedule
              </Button>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">2</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">Pilot SOW approval</div>
                <ul className="text-sm text-muted space-y-1">
                  <li>• 30 dias scope finalization</li>
                  <li>• Resource allocation (Palantir + Natura teams)</li>
                  <li>• Success criteria definition</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">3</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">Kickoff (Jan 13, 2026)</div>
                <ul className="text-sm text-muted space-y-1">
                  <li>• Week 1-2: ERP integration</li>
                  <li>• Week 3: Conflict resolution deployment</li>
                  <li>• Week 4: First workflow live</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Differentiator */}
        <Card className="p-6 mb-6 border-primary bg-primary/5">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            Diferenciador Foundry vs. Databricks/Snowflake
          </h2>
          <p className="text-sm text-muted mb-4">
            Eles param no passo 2 (dashboard bonito). <span className="text-foreground font-medium">Foundry vai até passo 5 (ação + medição).</span>
          </p>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[
              { step: 1, label: 'Problema\nIdentificado', done: true },
              { step: 2, label: 'Causa Raiz\nResolvida', done: true },
              { step: 3, label: 'Decisão\nSimulada', done: true },
              { step: 4, label: 'Ação\nExecutada', done: true },
              { step: 5, label: 'Resultado\nMedido', done: true }
            ].map((item) => (
              <div
                key={item.step}
                className={`p-2 rounded text-center ${
                  item.done ? 'bg-green-500/20 border border-green-500/50' : 'bg-muted/30'
                }`}
              >
                <div className="font-bold mb-1">
                  {item.done && <CheckCircle2 size={14} className="inline text-green-500 mr-1" />}
                  {item.step}
                </div>
                <div className="whitespace-pre-line">{item.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-lg mb-2">
              &quot;Isso foi <span className="font-bold text-primary">1 SKU, 2 warehouses</span>.
            </p>
            <p className="text-lg">
              Natura tem <span className="font-bold">100k SKUs, 12 warehouses</span>.
            </p>
            <p className="text-muted mt-2">
              Pilot 30 dias replica isso em escala.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={handleDownloadPDF}>
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
            <Button variant="secondary" onClick={handleEmailStakeholders}>
              <Mail size={16} className="mr-2" />
              Email to Stakeholders
            </Button>
            <Button variant="primary" onClick={handleScheduleCall}>
              <Calendar size={16} className="mr-2" />
              Schedule Tech Call
            </Button>
          </div>
        </Card>

        {/* Restart Demo */}
        <div className="text-center">
          <Button variant="ghost" onClick={onRestart} className="text-muted hover:text-foreground">
            <ArrowRight size={16} className="mr-2 rotate-180" />
            Reiniciar Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
