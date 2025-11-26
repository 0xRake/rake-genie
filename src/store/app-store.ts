import { create } from 'zustand';

export type Tab = 'home' | 'model' | 'demo' | 'natura-demo' | 'erp-integration' | 'notebook' | 'assistant' | 'internal';

interface AppState {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  selectedNodes: string[];
  setSelectedNodes: (nodes: string[]) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedNodes: [],
  setSelectedNodes: (nodes) => set({ selectedNodes: nodes }),
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

