// Natura & Co Waste Optimization Data - Scenario Simulation

export interface ExcessInventory {
  sku: string;
  productName: string;
  warehouse: string;
  warehouseName: string;
  quantity: number;
  coverageDays: number;
  valueLocked: number;
  timeExcessMonths: number;
  markdownRisk: number;
  potentialLoss: number;
}

export interface StockoutRisk {
  sku: string;
  productName: string;
  warehouse: string;
  warehouseName: string;
  quantity: number;
  coverageDays: number;
  demandForecast: number;
  salesAtRisk: number;
  consultantsImpacted: number;
  daysUntilStockout: number;
}

export interface WasteDetection {
  excessInventory: ExcessInventory;
  stockoutRisk: StockoutRisk;
}

export interface ScenarioAction {
  transferQuantity?: number;
  productionQuantity?: number;
  origin?: string;
  originName?: string;
  destination?: string;
  destinationName?: string;
  modal?: 'Rodoviário' | 'Aéreo' | 'Ferroviário';
  distance?: number;
  plant?: string;
}

export interface ScenarioCosts {
  transport?: number;
  handling?: number;
  insurance?: number;
  rawMaterials?: number;
  labor?: number;
  setup?: number;
  total: number;
}

export interface ScenarioBenefits {
  avoidMarkdown?: number;
  captureSales?: number;
  consultantSatisfaction?: number;
  total: number;
}

export interface ScenarioConsequences {
  markdownLoss?: number;
  lostSales?: number;
  totalLoss: number;
  opportunityCost?: number;
}

export interface ScenarioResults {
  netValue: number;
  roi: number;
  timeline: number;
  confidence?: number;
}

export interface Scenario {
  id: string;
  name: string;
  type: 'transfer' | 'production' | 'noAction';
  description: string;
  action?: ScenarioAction;
  costs?: ScenarioCosts;
  benefits?: ScenarioBenefits;
  consequences?: ScenarioConsequences;
  results: ScenarioResults;
}

export interface Recommendation {
  scenarioId: string;
  reason: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
}

export interface OptimizationData {
  wasteDetection: WasteDetection;
  scenarios: Scenario[];
  recommendation: Recommendation;
}

export const optimizationData: OptimizationData = {
  wasteDetection: {
    excessInventory: {
      sku: 'NAT-CHRO-SER-030',
      productName: 'Chronos Anti-idade Sérum 30ml',
      warehouse: 'WH-SP-CAJ',
      warehouseName: 'Cajamar DC (SP)',
      quantity: 42300,
      coverageDays: 214,
      valueLocked: 3802770,
      timeExcessMonths: 7,
      markdownRisk: 0.50,
      potentialLoss: 1901385
    },
    stockoutRisk: {
      sku: 'NAT-CHRO-SER-030',
      productName: 'Chronos Anti-idade Sérum 30ml',
      warehouse: 'WH-PE-REC',
      warehouseName: 'Recife DC (PE)',
      quantity: 1200,
      coverageDays: 5,
      demandForecast: 8700,
      salesAtRisk: 782130,
      consultantsImpacted: 247,
      daysUntilStockout: 5
    }
  },
  scenarios: [
    {
      id: 'SCN-001',
      name: 'Transfer SP → Nordeste',
      type: 'transfer',
      description: 'Transferir estoque excedente de Cajamar para Recife via modal rodoviário',
      action: {
        transferQuantity: 40000,
        origin: 'WH-SP-CAJ',
        originName: 'Cajamar DC (SP)',
        destination: 'WH-PE-REC',
        destinationName: 'Recife DC (PE)',
        modal: 'Rodoviário',
        distance: 2134
      },
      costs: {
        transport: 142000,
        handling: 8000,
        insurance: 4200,
        total: 154200
      },
      benefits: {
        avoidMarkdown: 1521108,
        captureSales: 782130,
        consultantSatisfaction: 247,
        total: 2303238
      },
      results: {
        netValue: 2149038,
        roi: 13.9,
        timeline: 8,
        confidence: 0.92
      }
    },
    {
      id: 'SCN-002',
      name: 'Produção Adicional',
      type: 'production',
      description: 'Iniciar nova rodada de produção em Cajamar e enviar direto ao Nordeste',
      action: {
        productionQuantity: 8700,
        plant: 'Cajamar (SP)',
        destination: 'WH-PE-REC',
        destinationName: 'Recife DC (PE)'
      },
      costs: {
        rawMaterials: 281880,
        labor: 34800,
        setup: 12000,
        transport: 30915,
        total: 359595
      },
      benefits: {
        captureSales: 782130,
        consultantSatisfaction: 247,
        total: 782130
      },
      results: {
        netValue: 422535,
        roi: 1.2,
        timeline: 18,
        confidence: 0.85
      }
    },
    {
      id: 'SCN-003',
      name: 'Status Quo (Não Agir)',
      type: 'noAction',
      description: 'Manter operação atual sem intervenção - avaliar consequências',
      consequences: {
        markdownLoss: 2281662,
        lostSales: 782130,
        totalLoss: 3063792,
        opportunityCost: 2149038
      },
      results: {
        netValue: -3063792,
        roi: -1.0,
        timeline: 0
      }
    }
  ],
  recommendation: {
    scenarioId: 'SCN-001',
    reason: 'Highest ROI (13.9x), fastest execution (8 days), solves dual problem (excess + stockout), uses existing inventory (sustentabilidade)',
    confidence: 0.92,
    priority: 'high'
  }
};

// Additional scenarios for other SKU combinations
export const additionalScenarios: Scenario[] = [
  {
    id: 'SCN-004',
    name: 'Transfer POA → Fortaleza',
    type: 'transfer',
    description: 'Transferir Kaiak excedente de Porto Alegre para suprir demanda Nordeste',
    action: {
      transferQuantity: 35000,
      origin: 'WH-RS-POA',
      originName: 'Porto Alegre DC',
      destination: 'WH-CE-FOR',
      destinationName: 'Fortaleza DC',
      modal: 'Rodoviário',
      distance: 3890
    },
    costs: {
      transport: 231000,
      handling: 7000,
      insurance: 6930,
      total: 244930
    },
    benefits: {
      avoidMarkdown: 1398000,
      captureSales: 623000,
      consultantSatisfaction: 189,
      total: 2021000
    },
    results: {
      netValue: 1776070,
      roi: 7.3,
      timeline: 12,
      confidence: 0.88
    }
  },
  {
    id: 'SCN-005',
    name: 'Transfer BHZ → Manaus',
    type: 'transfer',
    description: 'Redistribuir Ekos de Belo Horizonte para Norte via multimodal',
    action: {
      transferQuantity: 8000,
      origin: 'WH-MG-BHZ',
      originName: 'Belo Horizonte DC',
      destination: 'WH-AM-MAN',
      destinationName: 'Manaus DC',
      modal: 'Rodoviário',
      distance: 3950
    },
    costs: {
      transport: 156000,
      handling: 4000,
      insurance: 4680,
      total: 164680
    },
    benefits: {
      avoidMarkdown: 456000,
      captureSales: 389000,
      consultantSatisfaction: 156,
      total: 845000
    },
    results: {
      netValue: 680320,
      roi: 4.1,
      timeline: 14,
      confidence: 0.82
    }
  }
];

// Executive summary data for the final report
export interface ExecutionResult {
  transferOrderId: string;
  transportProvider: string;
  trackingNumber: string;
  etaArrival: string;
  notificationsSent: number;
}

export interface ImpactMetrics {
  spWarehouse: {
    inventoryBefore: number;
    inventoryAfter: number;
    coverageBefore: number;
    coverageAfter: number;
    excessRiskEliminated: boolean;
  };
  recifeWarehouse: {
    inventoryBefore: number;
    inventoryAfter: number;
    coverageBefore: number;
    coverageAfter: number;
    stockoutRiskEliminated: boolean;
  };
  financial: {
    valueCaptured: number;
    investment: number;
    netValue: number;
    finalRoi: number;
  };
  consultant: {
    repsSecured: number;
    npsImpact: number;
  };
}

export const mockExecutionResult: ExecutionResult = {
  transferOrderId: 'SAP-TO-2024-11-0847',
  transportProvider: 'Braspress',
  trackingNumber: 'BR8472934',
  etaArrival: '2024-12-04',
  notificationsSent: 2
};

export const mockImpactMetrics: ImpactMetrics = {
  spWarehouse: {
    inventoryBefore: 42300,
    inventoryAfter: 2300,
    coverageBefore: 214,
    coverageAfter: 28,
    excessRiskEliminated: true
  },
  recifeWarehouse: {
    inventoryBefore: 1200,
    inventoryAfter: 41200,
    coverageBefore: 5,
    coverageAfter: 173,
    stockoutRiskEliminated: true
  },
  financial: {
    valueCaptured: 2149038,
    investment: 154200,
    netValue: 1994838,
    finalRoi: 12.9
  },
  consultant: {
    repsSecured: 247,
    npsImpact: 8
  }
};

// Pilot projection data
export interface PilotProjection {
  days: number;
  skusOptimized: number;
  valueCaptured: number;
  investment: number;
  roi: number;
  paybackDays: number;
}

export interface Year1Projection {
  skusTotal: number;
  wasteCapturePercent: number;
  savingsTotal: number;
  foundryInvestment: number;
  netValue: number;
  roiPercent: number;
}

export const pilotProjection: PilotProjection = {
  days: 30,
  skusOptimized: 100,
  valueCaptured: 214000000,
  investment: 1638000,
  roi: 130,
  paybackDays: 2.3
};

export const year1Projection: Year1Projection = {
  skusTotal: 100000,
  wasteCapturePercent: 5,
  savingsTotal: 13000000,
  foundryInvestment: 7600000,
  netValue: 5400000,
  roiPercent: 71
};
