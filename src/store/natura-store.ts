import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { inventoryData, Warehouse, InventoryItem } from '@/data/natura/inventory';
import { conflictsData, Conflict } from '@/data/natura/conflicts';
import { optimizationData, Scenario } from '@/data/natura/optimization';

// User Personas
export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export const PERSONAS: Persona[] = [
  { id: 'analyst', name: 'Maria Santos', role: 'Supply Chain Analyst', avatar: 'MS' },
  { id: 'manager', name: 'Carlos Silva', role: 'Warehouse Manager', avatar: 'CS' },
  { id: 'vp', name: 'Ana Oliveira', role: 'VP Operations', avatar: 'AO' },
];

// Decision Capture
export interface Decision {
  id: string;
  type: 'conflict_resolution' | 'scenario_execution' | 'transfer_approval';
  timestamp: string;
  simulatedDay: number;
  userId: string;
  userName: string;
  userRole: string;
  objectId: string;
  objectName: string;
  action: string;
  prediction: { value: number; confidence: number };
  actualOutcome?: { value: number; variance: number; measuredAt: string };
  ruleId?: string;
  justification?: string;
}

// Actionable Insight Types
export interface Insight {
  id: string;
  type: 'stockout' | 'excess' | 'conflict' | 'opportunity' | 'success';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  value?: number;
  actionLabel: string;
  actionType: 'navigate' | 'resolve' | 'transfer' | 'investigate';
  linkedWarehouseId?: string;
  linkedSkuId?: string;
  linkedConflictId?: string;
}

// Object Explorer Types
export interface LinkedObject {
  type: 'warehouse' | 'sku' | 'supplier' | 'region' | 'forecast' | 'conflict';
  id: string;
  name: string;
  status?: string;
  value?: number;
}

// Flow States
export type DemoPhase = 'explore' | 'investigate' | 'resolve' | 'optimize' | 'complete';

interface NaturaState {
  // Persona
  currentPersona: Persona;
  setPersona: (persona: Persona) => void;

  // Decisions (audit trail)
  decisions: Decision[];
  addDecision: (decision: Omit<Decision, 'id' | 'timestamp' | 'simulatedDay'>) => void;
  simulatedDay: number;

  // Current Phase
  phase: DemoPhase;
  setPhase: (phase: DemoPhase) => void;

  // Selected Objects
  selectedWarehouse: Warehouse | null;
  selectedSku: InventoryItem | null;
  selectedConflict: Conflict | null;
  selectedScenario: Scenario | null;

  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  setSelectedSku: (sku: InventoryItem | null, warehouse?: Warehouse) => void;
  setSelectedConflict: (conflict: Conflict | null) => void;
  setSelectedScenario: (scenario: Scenario | null) => void;

  // Filters
  activeFilters: {
    region: string | null;
    brand: string | null;
    status: string | null;
  };
  setFilter: (key: 'region' | 'brand' | 'status', value: string | null) => void;
  clearFilters: () => void;

  // Actionable Insights
  insights: Insight[];
  dismissInsight: (id: string) => void;
  actOnInsight: (insight: Insight) => void;

  // Conflicts State
  conflicts: Conflict[];
  resolvedConflicts: string[];
  resolveConflict: (conflictId: string, justification?: string) => void;

  // Optimization State
  simulationRun: boolean;
  executedScenario: string | null;
  runSimulation: () => void;
  executeScenario: (scenarioId: string) => void;

  // Metrics (computed from resolved actions)
  metrics: {
    conflictsResolved: number;
    valueOptimized: number;
    stockoutsAverted: number;
    interactionCount: number;
  };
  incrementInteraction: () => void;

  // Session
  sessionStartTime: number;
  isPersisted: boolean;

  // Reset
  reset: () => void;
}

// Generate dynamic insights based on current data
function generateInsights(warehouses: Warehouse[], conflicts: Conflict[]): Insight[] {
  const insights: Insight[] = [];

  // Find stockout risks
  warehouses.forEach(wh => {
    const stockoutItems = wh.inventory.filter(i => i.status === 'stockout');
    if (stockoutItems.length > 0) {
      const totalRisk = wh.metrics.stockoutRisk;
      insights.push({
        id: `stockout-${wh.id}`,
        type: 'stockout',
        severity: 'critical',
        title: `Stockout Risk: ${wh.name}`,
        description: `${stockoutItems.length} SKUs at risk, R$ ${(totalRisk / 1000000).toFixed(1)}M in potential lost sales`,
        value: totalRisk,
        actionLabel: 'Investigate & Resolve',
        actionType: 'investigate',
        linkedWarehouseId: wh.id,
        linkedSkuId: stockoutItems[0]?.sku
      });
    }
  });

  // Find excess inventory opportunities
  warehouses.forEach(wh => {
    const excessItems = wh.inventory.filter(i => i.status === 'excess');
    if (excessItems.length > 0 && wh.metrics.excessValue > 1000000) {
      insights.push({
        id: `excess-${wh.id}`,
        type: 'excess',
        severity: 'warning',
        title: `Excess Inventory: ${wh.name}`,
        description: `R$ ${(wh.metrics.excessValue / 1000000).toFixed(1)}M locked in slow-moving stock`,
        value: wh.metrics.excessValue,
        actionLabel: 'View Transfer Options',
        actionType: 'transfer',
        linkedWarehouseId: wh.id
      });
    }
  });

  // Highlight catalog conflicts
  const unresolvedConflicts = conflicts.filter(c => !c.resolved);
  const highPriorityConflicts = unresolvedConflicts.filter(c => c.priority === 'high');
  if (highPriorityConflicts.length > 0) {
    insights.push({
      id: 'conflicts-high',
      type: 'conflict',
      severity: 'warning',
      title: `${highPriorityConflicts.length} High Priority Conflicts`,
      description: 'Catalog discrepancies affecting forecast accuracy',
      actionLabel: 'Resolve Conflicts',
      actionType: 'resolve',
      linkedConflictId: highPriorityConflicts[0]?.id
    });
  }

  // Major optimization opportunity
  const totalExcess = warehouses.reduce((sum, wh) => sum + wh.metrics.excessValue, 0);
  const totalStockoutRisk = warehouses.reduce((sum, wh) => sum + wh.metrics.stockoutRisk, 0);
  if (totalExcess > 10000000 && totalStockoutRisk > 5000000) {
    insights.push({
      id: 'optimization-opportunity',
      type: 'opportunity',
      severity: 'info',
      title: 'Cross-Region Transfer Opportunity',
      description: `Redistribute inventory to capture R$ ${((totalExcess + totalStockoutRisk) * 0.04 / 1000000).toFixed(1)}M in value`,
      value: (totalExcess + totalStockoutRisk) * 0.04,
      actionLabel: 'Run Simulation',
      actionType: 'navigate'
    });
  }

  return insights;
}

export const useNaturaStore = create<NaturaState>()(
  persist(
    (set, get) => ({
      // Persona
      currentPersona: PERSONAS[0],
      setPersona: (persona) => set({ currentPersona: persona }),

      // Decisions
      decisions: [],
      simulatedDay: 1,
      addDecision: (decision) => {
        const state = get();
        const newDecision: Decision = {
          ...decision,
          id: `dec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
          simulatedDay: state.simulatedDay,
        };
        set(s => ({
          decisions: [...s.decisions, newDecision],
          simulatedDay: s.simulatedDay + 1, // Advance simulated day
        }));
      },

      // Phase
      phase: 'explore',
      setPhase: (phase) => set({ phase }),

      // Selected Objects
      selectedWarehouse: null,
      selectedSku: null,
      selectedConflict: null,
      selectedScenario: null,

      setSelectedWarehouse: (warehouse) => {
        set({ selectedWarehouse: warehouse, selectedSku: null });
        get().incrementInteraction();
      },

      setSelectedSku: (sku, warehouse) => {
        set({
          selectedSku: sku,
          selectedWarehouse: warehouse || get().selectedWarehouse
        });
        get().incrementInteraction();
      },

      setSelectedConflict: (conflict) => {
        set({ selectedConflict: conflict });
        get().incrementInteraction();
      },

      setSelectedScenario: (scenario) => {
        set({ selectedScenario: scenario });
        get().incrementInteraction();
      },

      // Filters
      activeFilters: {
        region: null,
        brand: null,
        status: null
      },

      setFilter: (key, value) => {
        set(state => ({
          activeFilters: { ...state.activeFilters, [key]: value }
        }));
        get().incrementInteraction();
      },

      clearFilters: () => {
        set({ activeFilters: { region: null, brand: null, status: null } });
      },

      // Insights
      insights: generateInsights(inventoryData.warehouses, conflictsData.conflicts),

      dismissInsight: (id) => {
        set(state => ({
          insights: state.insights.filter(i => i.id !== id)
        }));
      },

      actOnInsight: (insight) => {
        const state = get();
        state.incrementInteraction();

        switch (insight.actionType) {
          case 'investigate':
            if (insight.linkedWarehouseId) {
              const warehouse = inventoryData.warehouses.find(w => w.id === insight.linkedWarehouseId);
              if (warehouse) {
                set({ selectedWarehouse: warehouse, phase: 'investigate' });
                if (insight.linkedSkuId) {
                  const sku = warehouse.inventory.find(i => i.sku === insight.linkedSkuId);
                  if (sku) set({ selectedSku: sku });
                }
              }
            }
            break;
          case 'resolve':
            if (insight.linkedConflictId) {
              const conflict = conflictsData.conflicts.find(c => c.id === insight.linkedConflictId);
              if (conflict) {
                set({ selectedConflict: conflict, phase: 'resolve' });
              }
            }
            break;
          case 'transfer':
            if (insight.linkedWarehouseId) {
              const warehouse = inventoryData.warehouses.find(w => w.id === insight.linkedWarehouseId);
              if (warehouse) {
                set({ selectedWarehouse: warehouse, phase: 'optimize' });
              }
            }
            break;
          case 'navigate':
            set({ phase: 'optimize' });
            break;
        }

        state.dismissInsight(insight.id);
      },

      // Conflicts
      conflicts: conflictsData.conflicts,
      resolvedConflicts: [],

      resolveConflict: (conflictId, justification) => {
        const state = get();
        const conflict = state.conflicts.find(c => c.id === conflictId);

        // Add decision to audit trail
        if (conflict) {
          state.addDecision({
            type: 'conflict_resolution',
            userId: state.currentPersona.id,
            userName: state.currentPersona.name,
            userRole: state.currentPersona.role,
            objectId: conflictId,
            objectName: conflict.goldenRecord.description,
            action: 'Merged to Golden Record',
            prediction: {
              value: 150000, // Simulated value impact
              confidence: conflict.mlAnalysis.confidence,
            },
            ruleId: conflict.mlAnalysis.recommendation === 'merge' ? 'auto-merge-high-confidence' : undefined,
            justification: justification || `ML confidence: ${(conflict.mlAnalysis.confidence * 100).toFixed(0)}%`,
          });
        }

        set(s => ({
          resolvedConflicts: [...s.resolvedConflicts, conflictId],
          conflicts: s.conflicts.map(c =>
            c.id === conflictId
              ? { ...c, resolved: true, resolvedAt: new Date().toISOString() }
              : c
          ),
          metrics: {
            ...s.metrics,
            conflictsResolved: s.metrics.conflictsResolved + 1
          },
          insights: [
            ...s.insights.filter(i => i.linkedConflictId !== conflictId),
            {
              id: `resolved-${conflictId}`,
              type: 'success' as const,
              severity: 'success' as const,
              title: 'Conflict Resolved',
              description: 'Golden Record created, o9 forecasts updated',
              actionLabel: 'View Next',
              actionType: 'resolve' as const
            }
          ]
        }));
        get().incrementInteraction();
      },

      // Optimization
      simulationRun: false,
      executedScenario: null,

      runSimulation: () => {
        set({ simulationRun: true });
        get().incrementInteraction();
      },

      executeScenario: (scenarioId) => {
        const state = get();
        const scenario = optimizationData.scenarios.find(s => s.id === scenarioId);

        // Add decision to audit trail
        if (scenario) {
          state.addDecision({
            type: 'scenario_execution',
            userId: state.currentPersona.id,
            userName: state.currentPersona.name,
            userRole: state.currentPersona.role,
            objectId: scenarioId,
            objectName: scenario.name,
            action: `Executed ${scenario.type} scenario`,
            prediction: {
              value: scenario.results.netValue,
              confidence: scenario.results.confidence || 0.85,
            },
            justification: scenario.description,
          });
        }

        set(s => ({
          executedScenario: scenarioId,
          selectedScenario: scenario || null,
          metrics: {
            ...s.metrics,
            valueOptimized: s.metrics.valueOptimized + (scenario?.results.netValue || 0),
            stockoutsAverted: s.metrics.stockoutsAverted + 1
          },
          insights: [
            ...s.insights,
            {
              id: `executed-${scenarioId}`,
              type: 'success' as const,
              severity: 'success' as const,
              title: 'Transfer Executed',
              description: `R$ ${((scenario?.results.netValue || 0) / 1000000).toFixed(1)}M value captured`,
              value: scenario?.results.netValue,
              actionLabel: 'View Summary',
              actionType: 'navigate' as const
            }
          ],
          phase: 'complete'
        }));
        get().incrementInteraction();
      },

      // Metrics
      metrics: {
        conflictsResolved: 0,
        valueOptimized: 0,
        stockoutsAverted: 0,
        interactionCount: 0
      },

      incrementInteraction: () => {
        set(state => ({
          metrics: {
            ...state.metrics,
            interactionCount: state.metrics.interactionCount + 1
          }
        }));
      },

      // Session
      sessionStartTime: Date.now(),
      isPersisted: false,

      // Reset
      reset: () => {
        set({
          phase: 'explore',
          selectedWarehouse: null,
          selectedSku: null,
          selectedConflict: null,
          selectedScenario: null,
          activeFilters: { region: null, brand: null, status: null },
          insights: generateInsights(inventoryData.warehouses, conflictsData.conflicts),
          conflicts: conflictsData.conflicts,
          resolvedConflicts: [],
          simulationRun: false,
          executedScenario: null,
          decisions: [],
          simulatedDay: 1,
          metrics: {
            conflictsResolved: 0,
            valueOptimized: 0,
            stockoutsAverted: 0,
            interactionCount: 0
          },
          sessionStartTime: Date.now(),
          isPersisted: false,
        });
      }
    }),
    {
      name: 'natura-demo-session',
      partialize: (state) => ({
        decisions: state.decisions,
        currentPersona: state.currentPersona,
        simulatedDay: state.simulatedDay,
        metrics: state.metrics,
        resolvedConflicts: state.resolvedConflicts,
        executedScenario: state.executedScenario,
        phase: state.phase,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isPersisted = true;
        }
      },
    }
  )
);

// Selectors for filtered data
export function useFilteredWarehouses() {
  const { activeFilters } = useNaturaStore();

  return inventoryData.warehouses.filter(wh => {
    if (activeFilters.region && wh.region !== activeFilters.region) return false;
    if (activeFilters.brand && wh.brand !== activeFilters.brand) return false;
    if (activeFilters.status) {
      const hasStatus = wh.inventory.some(i => i.status === activeFilters.status);
      if (!hasStatus) return false;
    }
    return true;
  });
}

// Get linked objects for a warehouse
export function getLinkedObjects(warehouse: Warehouse): LinkedObject[] {
  const objects: LinkedObject[] = [];

  // Add inventory items
  warehouse.inventory.forEach(item => {
    objects.push({
      type: 'sku',
      id: item.sku,
      name: item.productName,
      status: item.status,
      value: item.quantity * item.unitValue
    });
  });

  // Add suppliers
  const suppliers = [...new Set(warehouse.inventory.map(i => i.supplier).filter(Boolean))];
  suppliers.forEach(supplier => {
    objects.push({
      type: 'supplier',
      id: supplier as string,
      name: supplier as string
    });
  });

  // Add region
  objects.push({
    type: 'region',
    id: warehouse.region,
    name: warehouse.region
  });

  // Add related conflicts
  const relatedConflicts = conflictsData.conflicts.filter(c =>
    c.sources.some(s => warehouse.inventory.some(i =>
      i.sku.includes(s.sku.split('-').slice(1).join('-'))
    ))
  );
  relatedConflicts.forEach(conflict => {
    objects.push({
      type: 'conflict',
      id: conflict.id,
      name: conflict.goldenRecord.description,
      status: conflict.resolved ? 'resolved' : 'pending'
    });
  });

  return objects;
}
