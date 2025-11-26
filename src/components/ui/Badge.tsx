import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'blue' | 'amber' | 'red' | 'green';
}

export function Badge({ children, className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-secondary text-foreground border-border",
    blue: "bg-blue-950/30 text-blue-400 border-blue-900/50",
    amber: "bg-amber-950/30 text-amber-400 border-amber-900/50",
    red: "bg-red-950/30 text-red-400 border-red-900/50",
    green: "bg-emerald-950/30 text-emerald-400 border-emerald-900/50",
  };
  
  return (
    <span
      className={cn(
        "text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

