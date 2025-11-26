// Ontology Rules - Declarative business rules for automation

export interface OntologyRule {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'auto-merge' | 'escalation' | 'threshold' | 'recommendation';
  conditions: string[];
  action: string;
  learnedAccuracy?: number; // Historical accuracy
  lastUpdated?: string;
}

export const ONTOLOGY_RULES: OntologyRule[] = [
  {
    id: 'auto-merge-high-confidence',
    name: 'Auto-Merge High Confidence',
    description: 'Automatically merge conflicts when ML confidence exceeds threshold',
    priority: 'high',
    type: 'auto-merge',
    conditions: [
      'mlAnalysis.confidence >= 0.90',
      'mlAnalysis.textSimilarity >= 0.85',
      'mlAnalysis.eanMatch === "exact" || mlAnalysis.eanMatch === "partial"',
    ],
    action: 'Merge sources to Golden Record',
    learnedAccuracy: 0.94,
    lastUpdated: '2024-11-20',
  },
  {
    id: 'escalate-price-variance',
    name: 'Escalate Price Variance',
    description: 'Flag for manual review when COGS variance exceeds threshold',
    priority: 'medium',
    type: 'escalation',
    conditions: [
      'mlAnalysis.cogsVariance > 0.15',
      'conflict.priority === "high"',
    ],
    action: 'Route to VP Supply Chain for approval',
    learnedAccuracy: 0.88,
    lastUpdated: '2024-11-18',
  },
  {
    id: 'stockout-transfer-threshold',
    name: 'Stockout Transfer Threshold',
    description: 'Recommend transfer when coverage drops below threshold',
    priority: 'high',
    type: 'threshold',
    conditions: [
      'inventory.coverageDays < 14',
      'nearbyWarehouse.hasExcess === true',
      'transferCost < potentialLoss * 0.3',
    ],
    action: 'Generate transfer scenario',
    learnedAccuracy: 0.91,
    lastUpdated: '2024-11-22',
  },
  {
    id: 'excess-markdown-recommendation',
    name: 'Excess Markdown Recommendation',
    description: 'Suggest markdown when inventory age exceeds threshold',
    priority: 'medium',
    type: 'recommendation',
    conditions: [
      'inventory.coverageDays > 180',
      'inventory.status === "excess"',
      'category.seasonality === "low"',
    ],
    action: 'Recommend 20-40% markdown',
    learnedAccuracy: 0.86,
    lastUpdated: '2024-11-15',
  },
];

// Get rule by ID
export function getRuleById(ruleId: string): OntologyRule | undefined {
  return ONTOLOGY_RULES.find(r => r.id === ruleId);
}

// Get display info for a rule
export function getRuleDisplay(ruleId: string): { name: string; accuracy: string; badge: 'green' | 'amber' | 'blue' } | null {
  const rule = getRuleById(ruleId);
  if (!rule) return null;

  const accuracy = rule.learnedAccuracy ? `${Math.round(rule.learnedAccuracy * 100)}%` : 'N/A';
  const badge = rule.learnedAccuracy
    ? rule.learnedAccuracy >= 0.9 ? 'green' : rule.learnedAccuracy >= 0.8 ? 'amber' : 'blue'
    : 'blue';

  return { name: rule.name, accuracy, badge };
}
