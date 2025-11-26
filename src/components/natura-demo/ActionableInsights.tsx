'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNaturaStore, Insight } from '@/store/natura-store';
import { formatBRLCompact } from '@/lib/natura/formatting';
import {
  AlertTriangle,
  TrendingDown,
  GitMerge,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  X,
  Zap,
  Bell
} from 'lucide-react';

interface ActionableInsightsProps {
  maxItems?: number;
  compact?: boolean;
  className?: string;
}

const insightConfig: Record<Insight['type'], {
  icon: React.ReactNode;
  bgClass: string;
  borderClass: string;
  textClass: string;
}> = {
  stockout: {
    icon: <AlertTriangle size={16} />,
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/30 hover:border-red-500/60',
    textClass: 'text-red-500'
  },
  excess: {
    icon: <TrendingDown size={16} />,
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30 hover:border-amber-500/60',
    textClass: 'text-amber-500'
  },
  conflict: {
    icon: <GitMerge size={16} />,
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/30 hover:border-purple-500/60',
    textClass: 'text-purple-500'
  },
  opportunity: {
    icon: <Lightbulb size={16} />,
    bgClass: 'bg-primary/10',
    borderClass: 'border-primary/30 hover:border-primary/60',
    textClass: 'text-primary'
  },
  success: {
    icon: <CheckCircle2 size={16} />,
    bgClass: 'bg-green-500/10',
    borderClass: 'border-green-500/30 hover:border-green-500/60',
    textClass: 'text-green-500'
  }
};

const severityBadge: Record<Insight['severity'], { variant: 'red' | 'amber' | 'blue' | 'green'; label: string }> = {
  critical: { variant: 'red', label: 'CRITICAL' },
  warning: { variant: 'amber', label: 'WARNING' },
  info: { variant: 'blue', label: 'INFO' },
  success: { variant: 'green', label: 'SUCCESS' }
};

export function ActionableInsights({ maxItems = 5, compact = false, className }: ActionableInsightsProps) {
  const { insights, actOnInsight, dismissInsight } = useNaturaStore();

  // Sort by severity
  const sortedInsights = [...insights]
    .sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2, success: 3 };
      return order[a.severity] - order[b.severity];
    })
    .slice(0, maxItems);

  if (sortedInsights.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted', className)}>
        <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500" />
        <p className="text-sm">All insights addressed</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn('space-y-2', className)}>
        {sortedInsights.map((insight) => {
          const config = insightConfig[insight.type];
          const badge = severityBadge[insight.severity];

          return (
            <button
              key={insight.id}
              onClick={() => actOnInsight(insight)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                'hover:shadow-md hover:scale-[1.01] active:scale-[0.99]',
                config.bgClass,
                config.borderClass,
                'group'
              )}
            >
              <div className={cn('shrink-0', config.textClass)}>
                {config.icon}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium text-sm truncate">{insight.title}</div>
                {insight.value && (
                  <div className={cn('text-xs font-bold', config.textClass)}>
                    {formatBRLCompact(insight.value)}
                  </div>
                )}
              </div>
              <ArrowRight
                size={14}
                className="shrink-0 text-muted group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Bell size={14} className="text-primary" />
          Actionable Insights
        </h3>
        <Badge variant="default" className="text-xs bg-primary/10 text-primary">
          {insights.length} active
        </Badge>
      </div>

      <div className="space-y-2">
        {sortedInsights.map((insight) => {
          const config = insightConfig[insight.type];
          const badge = severityBadge[insight.severity];

          return (
            <div
              key={insight.id}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-300',
                'hover:shadow-lg',
                config.bgClass,
                config.borderClass,
                'group'
              )}
            >
              {/* Dismiss button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissInsight(insight.id);
                }}
                className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/50"
              >
                <X size={14} className="text-muted" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('shrink-0', config.textClass)}>
                  {config.icon}
                </div>
                <div className="font-semibold text-sm flex-1">{insight.title}</div>
                <Badge variant={badge.variant} className="text-[10px]">
                  {badge.label}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs text-muted mb-3 pl-6">
                {insight.description}
              </p>

              {/* Value if present */}
              {insight.value && (
                <div className={cn(
                  'pl-6 mb-3 text-lg font-bold',
                  config.textClass
                )}>
                  {formatBRLCompact(insight.value)}
                </div>
              )}

              {/* Action Button */}
              <Button
                variant="primary"
                size="sm"
                className={cn(
                  'w-full',
                  insight.severity === 'critical' && 'bg-red-500 hover:bg-red-600',
                  insight.severity === 'warning' && 'bg-amber-500 hover:bg-amber-600',
                  insight.severity === 'success' && 'bg-green-500 hover:bg-green-600'
                )}
                onClick={() => actOnInsight(insight)}
              >
                <Zap size={14} className="mr-2" />
                {insight.actionLabel}
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          );
        })}
      </div>

      {insights.length > maxItems && (
        <div className="text-center text-xs text-muted py-2">
          +{insights.length - maxItems} more insights
        </div>
      )}
    </div>
  );
}
