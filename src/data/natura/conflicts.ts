// Natura & Co Catalog Conflict Data - SKU Unification

export interface ConflictSource {
  system: 'SAP Natura' | 'SAP Avon' | 'Oracle Aesop' | 'SAP TBS';
  sku: string;
  description: string;
  ean: string | null;
  cogs: number;
  supplier: string | null;
  lastUpdated: string;
  isPrimary?: boolean;
}

export interface MLAnalysis {
  textSimilarity: number;
  eanMatch: string;
  cogsVariance: number;
  recommendation: 'merge' | 'review' | 'keep_separate';
  confidence: number;
}

export interface GoldenRecord {
  sku: string;
  description: string;
  ean: string;
  cogs: number;
  category: string;
  brand: string;
  line: string;
  volume: string;
  primarySupplier: string;
}

export interface Conflict {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  similarityScore: number;
  sources: ConflictSource[];
  mlAnalysis: MLAnalysis;
  goldenRecord: GoldenRecord;
  resolved?: boolean;
  resolvedAt?: string;
}

export interface ConflictStatistics {
  totalConflicts: number;
  pending: number;
  resolved: number;
  autoMergeable: number;
  requiresReview: number;
}

export interface ConflictsData {
  conflicts: Conflict[];
  statistics: ConflictStatistics;
}

export const conflictsData: ConflictsData = {
  conflicts: [
    {
      id: 'CONF-001',
      priority: 'high',
      category: 'Skincare',
      similarityScore: 0.94,
      sources: [
        {
          system: 'SAP Natura',
          sku: 'NAT-CHRO-SER-030',
          description: 'Chronos Anti-idade Sérum 30ml',
          ean: '7891010244923',
          cogs: 32.40,
          supplier: 'Planta Benevides (PA)',
          lastUpdated: '2024-11-20',
          isPrimary: true
        },
        {
          system: 'SAP Avon',
          sku: 'AVO-CHRO-SER-030',
          description: 'Chronos 30mL Serum',
          ean: null,
          cogs: 31.85,
          supplier: 'External - Croda',
          lastUpdated: '2024-11-18'
        },
        {
          system: 'Oracle Aesop',
          sku: 'CHRO-SER-030',
          description: 'CHRO SERUM 30ML',
          ean: '7891010244923',
          cogs: 32.40,
          supplier: null,
          lastUpdated: '2024-10-30'
        }
      ],
      mlAnalysis: {
        textSimilarity: 0.94,
        eanMatch: '2/3',
        cogsVariance: 0.017,
        recommendation: 'merge',
        confidence: 0.91
      },
      goldenRecord: {
        sku: 'NAT-CHRO-SER-030',
        description: 'Chronos Anti-idade Sérum 30ml',
        ean: '7891010244923',
        cogs: 32.40,
        category: 'Skincare',
        brand: 'Natura',
        line: 'Chronos',
        volume: '30ml',
        primarySupplier: 'Planta Benevides (PA)'
      }
    },
    {
      id: 'CONF-002',
      priority: 'high',
      category: 'Body Care',
      similarityScore: 0.87,
      sources: [
        {
          system: 'SAP Natura',
          sku: 'NAT-TODO-HID-400',
          description: 'Tododia Hidratante Corporal 400ml',
          ean: '7891010567891',
          cogs: 18.50,
          supplier: 'Planta Cajamar (SP)',
          lastUpdated: '2024-11-22',
          isPrimary: true
        },
        {
          system: 'SAP Avon',
          sku: 'AVO-SOFT-LOC-400',
          description: 'Soft Musk Loção Corporal 400ml',
          ean: '7891010567892',
          cogs: 17.90,
          supplier: 'Planta Cajamar (SP)',
          lastUpdated: '2024-11-19'
        }
      ],
      mlAnalysis: {
        textSimilarity: 0.87,
        eanMatch: '0/2',
        cogsVariance: 0.032,
        recommendation: 'review',
        confidence: 0.72
      },
      goldenRecord: {
        sku: 'NAT-TODO-HID-400',
        description: 'Tododia Hidratante Corporal 400ml',
        ean: '7891010567891',
        cogs: 18.50,
        category: 'Body Care',
        brand: 'Natura',
        line: 'Tododia',
        volume: '400ml',
        primarySupplier: 'Planta Cajamar (SP)'
      }
    },
    {
      id: 'CONF-003',
      priority: 'medium',
      category: 'Fragrances',
      similarityScore: 0.96,
      sources: [
        {
          system: 'SAP Natura',
          sku: 'NAT-KAIAK-DEO-100',
          description: 'Kaiak Aventura Desodorante 100ml',
          ean: '7891010789012',
          cogs: 28.90,
          supplier: 'Planta Benevides (PA)',
          lastUpdated: '2024-11-21',
          isPrimary: true
        },
        {
          system: 'SAP Avon',
          sku: 'AVO-KAIAK-DEO-100',
          description: 'Kaiak Aventura Deo Colônia 100ml',
          ean: '7891010789012',
          cogs: 28.90,
          supplier: 'Planta Benevides (PA)',
          lastUpdated: '2024-11-20'
        }
      ],
      mlAnalysis: {
        textSimilarity: 0.96,
        eanMatch: '2/2',
        cogsVariance: 0,
        recommendation: 'merge',
        confidence: 0.98
      },
      goldenRecord: {
        sku: 'NAT-KAIAK-DEO-100',
        description: 'Kaiak Aventura Desodorante Colônia 100ml',
        ean: '7891010789012',
        cogs: 28.90,
        category: 'Fragrances',
        brand: 'Natura',
        line: 'Kaiak',
        volume: '100ml',
        primarySupplier: 'Planta Benevides (PA)'
      }
    },
    {
      id: 'CONF-004',
      priority: 'high',
      category: 'Skincare',
      similarityScore: 0.89,
      sources: [
        {
          system: 'SAP Avon',
          sku: 'AVO-RENEW-CRE-050',
          description: 'Renew Creme Anti-idade 50ml',
          ean: '7891010345678',
          cogs: 45.20,
          supplier: 'External - Symrise',
          lastUpdated: '2024-11-18',
          isPrimary: true
        },
        {
          system: 'SAP Natura',
          sku: 'NAT-CHRO-CRE-050',
          description: 'Chronos Anti-idade Creme 50ml',
          ean: '7891010345679',
          cogs: 48.90,
          supplier: 'Planta Benevides (PA)',
          lastUpdated: '2024-11-22'
        }
      ],
      mlAnalysis: {
        textSimilarity: 0.89,
        eanMatch: '0/2',
        cogsVariance: 0.082,
        recommendation: 'review',
        confidence: 0.68
      },
      goldenRecord: {
        sku: 'NAT-CHRO-CRE-050',
        description: 'Chronos Anti-idade Creme 50ml',
        ean: '7891010345679',
        cogs: 48.90,
        category: 'Skincare',
        brand: 'Natura',
        line: 'Chronos',
        volume: '50ml',
        primarySupplier: 'Planta Benevides (PA)'
      }
    },
    {
      id: 'CONF-005',
      priority: 'medium',
      category: 'Makeup',
      similarityScore: 0.92,
      sources: [
        {
          system: 'SAP Avon',
          sku: 'AVO-COLOR-BAT-045',
          description: 'Color Trend Batom Matte 4.5g',
          ean: '7891010456789',
          cogs: 8.90,
          supplier: 'External - Schwan',
          lastUpdated: '2024-11-20',
          isPrimary: true
        },
        {
          system: 'SAP Natura',
          sku: 'NAT-FACES-BAT-045',
          description: 'Faces Batom Matte 4.5g',
          ean: '7891010456790',
          cogs: 9.20,
          supplier: 'Planta Cajamar (SP)',
          lastUpdated: '2024-11-19'
        }
      ],
      mlAnalysis: {
        textSimilarity: 0.92,
        eanMatch: '0/2',
        cogsVariance: 0.034,
        recommendation: 'review',
        confidence: 0.75
      },
      goldenRecord: {
        sku: 'NAT-FACES-BAT-045',
        description: 'Faces Batom Matte 4.5g',
        ean: '7891010456790',
        cogs: 9.20,
        category: 'Makeup',
        brand: 'Natura',
        line: 'Faces',
        volume: '4.5g',
        primarySupplier: 'Planta Cajamar (SP)'
      }
    },
    {
      id: 'CONF-006',
      priority: 'low',
      category: 'Hair Care',
      similarityScore: 0.97,
      sources: [
        {
          system: 'SAP Natura',
          sku: 'NAT-LUMINA-SHAM-300',
          description: 'Lumina Shampoo 300ml',
          ean: '7891010678901',
          cogs: 14.50,
          supplier: 'Planta Cajamar (SP)',
          lastUpdated: '2024-11-21',
          isPrimary: true
        },
        {
          system: 'SAP Avon',
          sku: 'AVO-ADV-SHAM-300',
          description: 'Advance Techniques Shampoo 300ml',
          ean: '7891010678901',
          cogs: 14.50,
          supplier: 'Planta Cajamar (SP)',
          lastUpdated: '2024-11-20'
        }
      ],
      mlAnalysis: {
        textSimilarity: 0.97,
        eanMatch: '2/2',
        cogsVariance: 0,
        recommendation: 'merge',
        confidence: 0.99
      },
      goldenRecord: {
        sku: 'NAT-LUMINA-SHAM-300',
        description: 'Lumina Shampoo 300ml',
        ean: '7891010678901',
        cogs: 14.50,
        category: 'Hair Care',
        brand: 'Natura',
        line: 'Lumina',
        volume: '300ml',
        primarySupplier: 'Planta Cajamar (SP)'
      }
    },
    {
      id: 'CONF-007',
      priority: 'high',
      category: 'Body Care',
      similarityScore: 0.91,
      sources: [
        {
          system: 'SAP Natura',
          sku: 'NAT-EKOS-PAT-250',
          description: 'Ekos Patauá Hidratante 250ml',
          ean: '7891010890123',
          cogs: 24.80,
          supplier: 'Planta Benevides (PA)',
          lastUpdated: '2024-11-22',
          isPrimary: true
        },
        {
          system: 'Oracle Aesop',
          sku: 'AES-EKOS-PAT-250',
          description: 'EKOS PATAUA HYDRATING 250ML',
          ean: '7891010890123',
          cogs: 24.80,
          supplier: null,
          lastUpdated: '2024-10-28'
        }
      ],
      mlAnalysis: {
        textSimilarity: 0.91,
        eanMatch: '2/2',
        cogsVariance: 0,
        recommendation: 'merge',
        confidence: 0.95
      },
      goldenRecord: {
        sku: 'NAT-EKOS-PAT-250',
        description: 'Ekos Patauá Hidratante 250ml',
        ean: '7891010890123',
        cogs: 24.80,
        category: 'Body Care',
        brand: 'Natura',
        line: 'Ekos',
        volume: '250ml',
        primarySupplier: 'Planta Benevides (PA)'
      }
    },
    {
      id: 'CONF-008',
      priority: 'medium',
      category: 'Fragrances',
      similarityScore: 0.88,
      sources: [
        {
          system: 'SAP Natura',
          sku: 'NAT-LUNA-PERF-100',
          description: 'Luna Perfume Feminino 100ml',
          ean: '7891010901234',
          cogs: 67.50,
          supplier: 'Planta Benevides (PA)',
          lastUpdated: '2024-11-20',
          isPrimary: true
        },
        {
          system: 'SAP Avon',
          sku: 'AVO-FAR-PERF-100',
          description: 'Far Away Perfume 100ml',
          ean: '7891010901235',
          cogs: 58.90,
          supplier: 'External - Givaudan',
          lastUpdated: '2024-11-19'
        }
      ],
      mlAnalysis: {
        textSimilarity: 0.88,
        eanMatch: '0/2',
        cogsVariance: 0.146,
        recommendation: 'keep_separate',
        confidence: 0.85
      },
      goldenRecord: {
        sku: 'NAT-LUNA-PERF-100',
        description: 'Luna Perfume Feminino 100ml',
        ean: '7891010901234',
        cogs: 67.50,
        category: 'Fragrances',
        brand: 'Natura',
        line: 'Luna',
        volume: '100ml',
        primarySupplier: 'Planta Benevides (PA)'
      }
    },
    {
      id: 'CONF-009',
      priority: 'high',
      category: 'Skincare',
      similarityScore: 0.93,
      sources: [
        {
          system: 'Oracle Aesop',
          sku: 'AES-RESUR-BAL-025',
          description: 'Resurrection Aromatique Hand Balm 25ml',
          ean: '9319944001235',
          cogs: 52.00,
          supplier: 'Aesop Melbourne',
          lastUpdated: '2024-11-15',
          isPrimary: true
        },
        {
          system: 'SAP TBS',
          sku: 'TBS-HAND-BAL-025',
          description: 'Hand Balm Resurrection 25ml',
          ean: '9319944001235',
          cogs: 52.00,
          supplier: 'Aesop Melbourne',
          lastUpdated: '2024-11-10'
        }
      ],
      mlAnalysis: {
        textSimilarity: 0.93,
        eanMatch: '2/2',
        cogsVariance: 0,
        recommendation: 'merge',
        confidence: 0.96
      },
      goldenRecord: {
        sku: 'AES-RESUR-BAL-025',
        description: 'Resurrection Aromatique Hand Balm 25ml',
        ean: '9319944001235',
        cogs: 52.00,
        category: 'Skincare',
        brand: 'Aesop',
        line: 'Resurrection',
        volume: '25ml',
        primarySupplier: 'Aesop Melbourne'
      }
    },
    {
      id: 'CONF-010',
      priority: 'low',
      category: 'Body Care',
      similarityScore: 0.95,
      sources: [
        {
          system: 'SAP TBS',
          sku: 'TBS-BRIT-ROSE-060',
          description: 'British Rose Body Butter 60ml',
          ean: '5028197234567',
          cogs: 32.00,
          supplier: 'TBS UK Manufacturing',
          lastUpdated: '2024-11-18',
          isPrimary: true
        },
        {
          system: 'SAP Avon',
          sku: 'AVO-ROSE-BUT-060',
          description: 'Rose Body Butter 60ml',
          ean: '5028197234567',
          cogs: 32.00,
          supplier: 'TBS UK Manufacturing',
          lastUpdated: '2024-11-16'
        }
      ],
      mlAnalysis: {
        textSimilarity: 0.95,
        eanMatch: '2/2',
        cogsVariance: 0,
        recommendation: 'merge',
        confidence: 0.97
      },
      goldenRecord: {
        sku: 'TBS-BRIT-ROSE-060',
        description: 'British Rose Body Butter 60ml',
        ean: '5028197234567',
        cogs: 32.00,
        category: 'Body Care',
        brand: 'The Body Shop',
        line: 'British Rose',
        volume: '60ml',
        primarySupplier: 'TBS UK Manufacturing'
      }
    }
  ],
  statistics: {
    totalConflicts: 1247,
    pending: 1247,
    resolved: 0,
    autoMergeable: 892,
    requiresReview: 355
  }
};

// Helper function to get conflicts by priority
export function getConflictsByPriority(priority: Conflict['priority']): Conflict[] {
  return conflictsData.conflicts.filter(c => c.priority === priority && !c.resolved);
}

// Helper function to get mergeable conflicts
export function getMergeableConflicts(): Conflict[] {
  return conflictsData.conflicts.filter(c => c.mlAnalysis.recommendation === 'merge' && !c.resolved);
}

// Helper function to get conflicts requiring review
export function getReviewConflicts(): Conflict[] {
  return conflictsData.conflicts.filter(c => c.mlAnalysis.recommendation === 'review' && !c.resolved);
}
