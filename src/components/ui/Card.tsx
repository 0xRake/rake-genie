import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ children, className, hoverable, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-background border border-border rounded-lg p-6",
        hoverable && "hover:border-foreground/20 transition-intelium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

