'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: React.ComponentType<{ size?: number }> }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex bg-secondary rounded-md p-1 gap-1", className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-intelium",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            )}
          >
            {Icon && <Icon size={12} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

