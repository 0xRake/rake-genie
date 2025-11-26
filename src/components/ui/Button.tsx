import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ size?: number }>;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  ...props
}: ButtonProps) {
  const base = "font-medium rounded-lg transition-intelium flex items-center justify-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-primary-foreground border-primary hover:opacity-90",
    secondary: "bg-transparent text-foreground border-border hover:bg-secondary",
    ghost: "bg-transparent text-muted border-transparent hover:text-foreground hover:bg-secondary",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : 16} />}
      {children}
    </button>
  );
}

