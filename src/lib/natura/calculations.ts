// Natura & Co Business Logic Calculations

export type TransportModal = 'Rodoviário' | 'Aéreo' | 'Ferroviário';

/**
 * Calculate transport cost based on quantity, distance, and modal
 * Includes handling and insurance costs
 */
export function calculateTransportCost(
  quantity: number,
  distance: number,
  modal: TransportModal
): { transport: number; handling: number; insurance: number; total: number } {
  const baseCostPerKm: Record<TransportModal, number> = {
    Rodoviário: 0.0017,   // R$ 1.70 per unit per 1000km
    Aéreo: 0.0085,        // R$ 8.50 per unit per 1000km
    Ferroviário: 0.0012   // R$ 1.20 per unit per 1000km
  };

  const costPerUnit = baseCostPerKm[modal] * distance;
  const transport = quantity * costPerUnit;

  // Fixed costs
  const handling = quantity * 0.20;  // R$ 0.20 per unit
  const insurance = transport * 0.03; // 3% of transport cost

  return {
    transport: Math.round(transport),
    handling: Math.round(handling),
    insurance: Math.round(insurance),
    total: Math.round(transport + handling + insurance)
  };
}

/**
 * Calculate ROI for a scenario
 */
export function calculateROI(investment: number, benefit: number): number {
  if (investment <= 0) return 0;
  const netValue = benefit - investment;
  return Math.round((netValue / investment) * 10) / 10;
}

/**
 * Calculate net value
 */
export function calculateNetValue(investment: number, benefit: number): number {
  return benefit - investment;
}

/**
 * Calculate coverage days based on current quantity and daily demand
 */
export function calculateCoverageDays(
  currentQuantity: number,
  dailyDemand: number
): number {
  if (dailyDemand <= 0) return 999;
  return Math.floor(currentQuantity / dailyDemand);
}

/**
 * Determine inventory status based on coverage days
 */
export function getInventoryStatus(coverageDays: number): 'healthy' | 'excess' | 'stockout' {
  if (coverageDays < 14) return 'stockout';
  if (coverageDays > 180) return 'excess';
  return 'healthy';
}

/**
 * Calculate markdown/loss risk for excess inventory
 */
export function calculateMarkdownRisk(
  quantity: number,
  unitValue: number,
  monthsExcess: number
): { markdownPercent: number; potentialLoss: number } {
  // Markdown increases with time excess
  let markdownPercent = 0;
  if (monthsExcess <= 3) {
    markdownPercent = 0.20;
  } else if (monthsExcess <= 6) {
    markdownPercent = 0.40;
  } else if (monthsExcess <= 9) {
    markdownPercent = 0.60;
  } else {
    markdownPercent = 0.80;
  }

  const totalValue = quantity * unitValue;
  const potentialLoss = totalValue * markdownPercent;

  return {
    markdownPercent,
    potentialLoss: Math.round(potentialLoss)
  };
}

/**
 * Calculate stockout risk value
 */
export function calculateStockoutRisk(
  demandForecast: number,
  unitPrice: number,
  daysUntilStockout: number,
  forecastDays: number = 30
): number {
  if (daysUntilStockout >= forecastDays) return 0;

  const daysOfLostSales = forecastDays - daysUntilStockout;
  const dailyDemand = demandForecast / forecastDays;
  const lostUnits = dailyDemand * daysOfLostSales;

  return Math.round(lostUnits * unitPrice);
}

/**
 * Calculate production costs for a new production run
 */
export function calculateProductionCost(
  quantity: number,
  cogs: number,
  laborCostPerUnit: number = 4.0,
  setupCost: number = 12000
): { rawMaterials: number; labor: number; setup: number; total: number } {
  const rawMaterials = quantity * cogs;
  const labor = quantity * laborCostPerUnit;

  return {
    rawMaterials: Math.round(rawMaterials),
    labor: Math.round(labor),
    setup: setupCost,
    total: Math.round(rawMaterials + labor + setupCost)
  };
}

/**
 * Calculate similarity score between two text descriptions
 * Simple implementation - in production would use ML
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  const normalize = (t: string) => t.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const words1 = new Set(normalize(text1));
  const words2 = new Set(normalize(text2));

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Calculate payback period in days
 */
export function calculatePaybackDays(investment: number, dailyBenefit: number): number {
  if (dailyBenefit <= 0) return 999;
  return Math.round((investment / dailyBenefit) * 10) / 10;
}

/**
 * Calculate pilot projection metrics
 */
export function calculatePilotProjection(
  baseValueCaptured: number,
  skusOptimized: number,
  investmentPerSku: number
): { valueCaptured: number; investment: number; roi: number; paybackDays: number } {
  const valueCaptured = baseValueCaptured * skusOptimized;
  const investment = investmentPerSku * skusOptimized;
  const roi = calculateROI(investment, valueCaptured);
  const dailyBenefit = valueCaptured / 30;
  const paybackDays = calculatePaybackDays(investment, dailyBenefit);

  return {
    valueCaptured,
    investment,
    roi,
    paybackDays
  };
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
