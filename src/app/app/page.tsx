'use client';

import { useAppStore } from '@/store/app-store';
import { Tabs } from '@/components/ui/Tabs';
import { Network, Layout, Target, BookOpen, Sparkles, Leaf, Lock, GitMerge } from 'lucide-react';
import { HomeTab } from '@/components/tabs/HomeTab';
import { ModelTab } from '@/components/tabs/ModelTab';
import { DemoTab } from '@/components/tabs/DemoTab';
import { NaturaDemoTab } from '@/components/tabs/NaturaDemoTab';
import { ERPIntegrationTab } from '@/components/tabs/ERPIntegrationTab';
import { NotebookTab } from '@/components/tabs/NotebookTab';
import { AssistantTab } from '@/components/tabs/AssistantTab';
import { InternalTab } from '@/components/tabs/InternalTab';
import type { Tab } from '@/store/app-store';

const tabs = [
  { id: 'home', label: 'INÍCIO', icon: Network },
  { id: 'model', label: 'MODELO', icon: Layout },
  { id: 'demo', label: 'DEMONSTRAÇÃO', icon: Target },
  { id: 'natura-demo', label: 'NATURA', icon: Leaf },
  { id: 'erp-integration', label: 'ERP', icon: GitMerge },
  { id: 'notebook', label: 'CADERNO', icon: BookOpen },
  { id: 'assistant', label: 'ASSISTENTE', icon: Sparkles },
  { id: 'internal', label: 'INTERNO', icon: Lock },
];

export default function AppPage() {
  const { activeTab, setActiveTab } = useAppStore();
  
  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center text-background">
            <span className="font-bold text-xs">I</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Intelium</span>
        </div>
        
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(tabId) => setActiveTab(tabId as Tab)} />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'model' && <ModelTab />}
        {activeTab === 'demo' && <DemoTab />}
        {activeTab === 'natura-demo' && <NaturaDemoTab />}
        {activeTab === 'erp-integration' && <ERPIntegrationTab />}
        {activeTab === 'notebook' && <NotebookTab />}
        {activeTab === 'assistant' && <AssistantTab />}
        {activeTab === 'internal' && <InternalTab />}
      </main>
    </div>
  );
}

