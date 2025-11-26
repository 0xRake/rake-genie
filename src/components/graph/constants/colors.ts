/**
 * Node Group Colors for NeuralGraph
 * Rich color palette for visual distinction and hierarchy
 */

export const GROUP_COLORS: Record<string, string> = {
  os: '#1E40AF',           // Blue - Core OS (Foundry)
  aip: '#7C3AED',          // Purple - AI Platform
  ontology: '#059669',     // Green - Ontology
  data: '#DC2626',         // Red - Data Engineering
  app: '#EA580C',          // Orange - Applications
  target: '#BE185D',       // Pink - External targets
  source: '#0891B2',       // Cyan - Sources
  strategy: '#CA8A04',     // Yellow - Strategy
};

export const GROUP_COLORS_DARK: Record<string, string> = {
  os: '#3B82F6',           // Bright Blue - Core OS
  aip: '#A855F7',          // Bright Purple - AI Platform
  ontology: '#10B981',     // Bright Green - Ontology
  data: '#EF4444',         // Bright Red - Data Engineering
  app: '#F97316',          // Bright Orange - Applications
  target: '#EC4899',       // Bright Pink - External targets
  source: '#06B6D4',       // Bright Cyan - Sources
  strategy: '#EAB308',     // Bright Yellow - Strategy
};

// Lighter variants for links and accents
export const GROUP_COLORS_LIGHT: Record<string, string> = {
  os: '#60A5FA',           // Light Blue
  aip: '#C084FC',          // Light Purple
  ontology: '#34D399',     // Light Green
  data: '#F87171',         // Light Red
  app: '#FB923C',          // Light Orange
  target: '#F472B6',       // Light Pink
  source: '#22D3EE',       // Light Cyan
  strategy: '#FCD34D',     // Light Yellow
};

// Master node colors (larger, more prominent nodes)
export const MASTER_NODE_COLORS: Record<string, string> = {
  os: '#1E3A8A',           // Deep Blue
  aip: '#6D28D9',          // Deep Purple
  ontology: '#047857',     // Deep Green
  data: '#B91C1C',         // Deep Red
  app: '#C2410C',          // Deep Orange
  target: '#9F1239',       // Deep Pink
  source: '#0E7490',       // Deep Cyan
  strategy: '#A16207',     // Deep Yellow
};

