import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: React.ReactNode;
}

export function Input({ className, prefix, ...props }: InputProps) {
  return (
    <div className="flex items-center bg-background border border-border rounded-md px-3 transition-colors focus-within:border-foreground/50">
      {prefix && <span className="text-muted mr-2">{prefix}</span>}
      <input
        className={cn(
          "bg-transparent border-none text-sm text-foreground w-full py-2 focus:outline-none placeholder:text-muted",
          className
        )}
        {...props}
      />
    </div>
  );
}
