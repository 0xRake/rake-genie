'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedMetricProps {
  value: number;
  formatter: (value: number) => string;
  label: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'green' | 'amber' | 'red' | 'primary';
  delay?: number;
  className?: string;
}

export function AnimatedMetric({
  value,
  formatter,
  label,
  icon,
  trend,
  trendValue,
  color = 'default',
  delay = 0,
  className
}: AnimatedMetricProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(showTimer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isVisible]);

  const colorClasses = {
    default: 'from-muted/50 to-muted/20',
    green: 'from-green-500/20 to-green-500/5',
    amber: 'from-amber-500/20 to-amber-500/5',
    red: 'from-red-500/20 to-red-500/5',
    primary: 'from-primary/20 to-primary/5'
  };

  const textColorClasses = {
    default: 'text-foreground',
    green: 'text-green-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
    primary: 'text-primary'
  };

  return (
    <div
      className={cn(
        'relative p-4 rounded-xl bg-gradient-to-br border border-white/10 overflow-hidden',
        'transform transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        colorClasses[color],
        className
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          {icon && (
            <span className={cn('opacity-70', textColorClasses[color])}>
              {icon}
            </span>
          )}
          <span className="text-xs text-muted uppercase tracking-wider font-medium">
            {label}
          </span>
        </div>

        <div className={cn('text-2xl font-bold tracking-tight', textColorClasses[color])}>
          {formatter(displayValue)}
        </div>

        {trend && trendValue && (
          <div className={cn(
            'mt-2 text-xs flex items-center gap-1',
            trend === 'up' ? 'text-green-500' :
            trend === 'down' ? 'text-red-500' : 'text-muted'
          )}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}

// Shimmer keyframe - add to globals.css or inline
// @keyframes shimmer { 100% { transform: translateX(100%); } }
