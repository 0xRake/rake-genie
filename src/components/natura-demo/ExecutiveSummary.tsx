'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNaturaStore } from '@/store/natura-store';
import { getRuleDisplay } from '@/data/natura/rules';
import {
  pilotProjection,
  year1Projection
} from '@/data/natura/optimization';
import {
  formatBRLCompact,
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
  Users,
  ChevronDown,
  ChevronUp,
  GitMerge,
  Truck,
  FileJson,
  User
} from 'lucide-react';

interface ExecutiveSummaryProps {
  sessionDuration: number;
  onRestart: () => void;
}

export function ExecutiveSummary({ sessionDuration, onRestart }: ExecutiveSummaryProps) {
  const { decisions, metrics, currentPersona, simulatedDay } = useNaturaStore();
  const [showAuditLog, setShowAuditLog] = useState(false);

  const handleDownloadPDF = () => {
    alert('PDF download would be triggered here');
  };

  const handleEmailStakeholders = () => {
    alert('Email stakeholders dialog would open here');
  };

  const handleScheduleCall = () => {
    window.open('https://calendly.com', '_blank');
  };

  const handleExportAudit = () => {
    const auditData = {
      exportedAt: new Date().toISOString(),
      session: {
        duration: sessionDuration,
        simulatedDays: simulatedDay,
        persona: currentPersona,
      },
      metrics,
      decisions,
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `natura-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate actual value from decisions
  const totalValueCaptured = metrics.valueOptimized || 3760000;
  const conflictsResolved = metrics.conflictsResolved || 892;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Hero Value Card - Compact */}
        <Card className="p-6 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="green" className="text-xs mb-2">
                <CheckCircle2 size={12} className="mr-1" />
                Demo Complete
              </Badge>
              <div className="text-3xl font-bold text-green-500">
                {formatBRLCompact(totalValueCaptured)}
              </div>
              <div className="text-xs text-muted mt-1">
                Value captured • {simulatedDay} days simulated • {formatDuration(sessionDuration)} real time
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted">ROI</div>
              <div className="text-2xl font-bold text-green-500">13.9x</div>
            </div>
          </div>
        </Card>

        {/* Quick Stats - Inline */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Conflicts', value: conflictsResolved.toString(), icon: GitMerge, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Decisions', value: decisions.length.toString(), icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Days Simulated', value: simulatedDay.toString(), icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Transfers', value: metrics.stockoutsAverted.toString(), icon: Truck, color: 'text-green-500', bg: 'bg-green-500/10' }
          ].map((stat, idx) => (
            <Card key={idx} className={`p-3 ${stat.bg} border-0`}>
              <div className="flex items-center gap-2">
                <stat.icon size={14} className={stat.color} />
                <span className="text-xs text-muted">{stat.label}</span>
              </div>
              <div className={`text-xl font-bold ${stat.color} mt-1`}>{stat.value}</div>
            </Card>
          ))}
        </div>

        {/* Audit Log - Collapsible */}
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowAuditLog(!showAuditLog)}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <span className="font-medium text-sm">Decision Audit Log</span>
              <Badge variant="default" className="text-xs ml-2">
                {decisions.length} decisions
              </Badge>
            </div>
            {showAuditLog ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showAuditLog && (
            <div className="border-t border-border/50">
              {/* Audit Header */}
              <div className="p-3 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <User size={12} />
                  <span>Acting as: <strong className="text-foreground">{currentPersona.name}</strong> ({currentPersona.role})</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleExportAudit} className="h-7 text-xs">
                  <FileJson size={12} className="mr-1" />
                  Export JSON
                </Button>
              </div>

              {/* Decision Timeline */}
              <div className="max-h-64 overflow-y-auto">
                {decisions.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted">
                    No decisions recorded yet
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {decisions.map((decision, idx) => {
                      const ruleInfo = decision.ruleId ? getRuleDisplay(decision.ruleId) : null;

                      return (
                        <div key={decision.id} className="p-3 hover:bg-muted/10 transition-colors">
                          <div className="flex items-start gap-3">
                            {/* Day indicator */}
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                D{decision.simulatedDay}
                              </div>
                              {idx < decisions.length - 1 && (
                                <div className="w-px h-full bg-border/50 my-1" />
                              )}
                            </div>

                            {/* Decision content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm truncate">{decision.objectName}</span>
                                <Badge
                                  variant={decision.type === 'conflict_resolution' ? 'blue' : 'green'}
                                  className="text-[10px] shrink-0"
                                >
                                  {decision.type === 'conflict_resolution' ? 'MERGE' : 'EXECUTE'}
                                </Badge>
                              </div>

                              <div className="text-xs text-muted mb-1">
                                {decision.action}
                              </div>

                              <div className="flex items-center gap-3 text-[10px]">
                                <span className="text-muted">
                                  By: <span className="text-foreground">{decision.userName}</span>
                                </span>
                                <span className="text-muted">
                                  Confidence: <span className="text-green-500 font-medium">{Math.round(decision.prediction.confidence * 100)}%</span>
                                </span>
                                {ruleInfo && (
                                  <span className="text-muted">
                                    Rule: <span className="text-primary">{ruleInfo.name}</span> ({ruleInfo.accuracy})
                                  </span>
                                )}
                              </div>

                              {/* Predicted value */}
                              <div className="mt-2 p-2 bg-muted/20 rounded text-xs flex items-center justify-between">
                                <span className="text-muted">Predicted impact:</span>
                                <span className="font-medium text-green-500">
                                  {formatBRLCompact(decision.prediction.value)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Financial Impact - Compact */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Financial Projection
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-primary/5 rounded-lg">
              <div className="text-xs text-muted mb-2">Pilot 30 Days</div>
              <div className="text-lg font-bold text-primary">{formatBRLCompact(pilotProjection.valueCaptured)}</div>
              <div className="text-xs text-muted">ROI: {pilotProjection.roi}x</div>
            </div>
            <div className="p-3 bg-green-500/5 rounded-lg">
              <div className="text-xs text-muted mb-2">Year 1 (100k SKUs)</div>
              <div className="text-lg font-bold text-green-500">{formatBRLCompact(year1Projection.savingsTotal)}</div>
              <div className="text-xs text-muted">Net: {formatBRLCompact(year1Projection.netValue)}</div>
            </div>
          </div>
        </Card>

        {/* Next Steps - Compact */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <ArrowRight size={16} />
            Next Steps
          </h2>

          <div className="space-y-2">
            {[
              { step: 1, title: 'Technical validation call', desc: 'Connect real SAP/Oracle', icon: Users },
              { step: 2, title: 'Pilot SOW approval', desc: '30 days scope', icon: FileText },
              { step: 3, title: 'Kickoff', desc: 'Week 1: ERP integration', icon: Calendar },
            ].map(item => (
              <div key={item.step} className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-muted">{item.desc}</div>
                </div>
                <item.icon size={14} className="text-muted" />
              </div>
            ))}
          </div>
        </Card>

        {/* Differentiator - Compact */}
        <Card className="p-4 border-primary bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-semibold">Foundry vs. Databricks/Snowflake</span>
          </div>
          <p className="text-xs text-muted mb-3">
            They stop at step 2 (nice dashboard). <span className="text-foreground font-medium">Foundry goes to step 5 (action + measurement).</span>
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className="flex-1 p-1.5 rounded bg-green-500/20 border border-green-500/50 text-center">
                <CheckCircle2 size={12} className="inline text-green-500" />
              </div>
            ))}
          </div>
        </Card>

        {/* CTA */}
        <div className="flex gap-2 justify-center pt-2">
          <Button variant="secondary" size="sm" onClick={handleDownloadPDF}>
            <Download size={14} className="mr-1" />
            PDF
          </Button>
          <Button variant="secondary" size="sm" onClick={handleEmailStakeholders}>
            <Mail size={14} className="mr-1" />
            Email
          </Button>
          <Button variant="primary" size="sm" onClick={handleScheduleCall}>
            <Calendar size={14} className="mr-1" />
            Schedule Call
          </Button>
        </div>

        {/* Restart */}
        <div className="text-center pb-4">
          <Button variant="ghost" size="sm" onClick={onRestart} className="text-muted">
            <ArrowRight size={14} className="mr-1 rotate-180" />
            Restart Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
