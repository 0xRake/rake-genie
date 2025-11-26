// Outcome Simulator - Generates simulated actual outcomes for closed-loop demo

export interface OutcomeTimeline {
  day: number;
  label: string;
  predicted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: 'on-track' | 'ahead' | 'behind';
  cumulative: number;
}

export interface SimulatedOutcome {
  predictedValue: number;
  actualValue: number;
  variance: number;
  variancePercent: number;
  accuracy: number;
  timeline: OutcomeTimeline[];
  status: 'success' | 'partial' | 'below-target';
}

// Generate variance with realistic distribution
function generateVariance(baseValue: number, volatility: number = 0.15): number {
  // Normal-ish distribution using Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  // Scale variance by volatility and base value
  return baseValue * volatility * z;
}

// Simulate outcome for a scenario execution
export function simulateScenarioOutcome(
  predictedValue: number,
  daysToComplete: number = 8
): SimulatedOutcome {
  // Generate realistic variance (typically -15% to +10%)
  const varianceFactor = 0.85 + Math.random() * 0.25; // 85% to 110% of predicted
  const actualValue = Math.round(predictedValue * varianceFactor);
  const variance = actualValue - predictedValue;
  const variancePercent = (variance / predictedValue) * 100;
  const accuracy = Math.min(100, Math.max(0, 100 - Math.abs(variancePercent)));

  // Generate timeline with daily progress
  const timeline: OutcomeTimeline[] = [];
  const milestones = [1, 3, 5, daysToComplete];
  let cumulative = 0;

  milestones.forEach((day, index) => {
    const progress = (index + 1) / milestones.length;
    const dailyPredicted = Math.round(predictedValue * progress);

    // Add some daily variance
    const dailyVariance = generateVariance(dailyPredicted * 0.1, 0.2);
    const dailyActual = Math.round(dailyPredicted + dailyVariance);
    cumulative = dailyActual;

    const dayVariance = dailyActual - dailyPredicted;
    const dayVariancePercent = (dayVariance / dailyPredicted) * 100;

    timeline.push({
      day,
      label: day === daysToComplete ? 'Completion' : `Day ${day}`,
      predicted: dailyPredicted,
      actual: dailyActual,
      variance: dayVariance,
      variancePercent: dayVariancePercent,
      status: dayVariancePercent > 2 ? 'ahead' : dayVariancePercent < -5 ? 'behind' : 'on-track',
      cumulative,
    });
  });

  // Determine overall status
  let status: 'success' | 'partial' | 'below-target';
  if (variancePercent >= -5) {
    status = 'success';
  } else if (variancePercent >= -15) {
    status = 'partial';
  } else {
    status = 'below-target';
  }

  return {
    predictedValue,
    actualValue,
    variance,
    variancePercent,
    accuracy,
    timeline,
    status,
  };
}

// Simulate outcome for conflict resolution
export function simulateConflictOutcome(
  predictedImpact: number,
  confidence: number
): SimulatedOutcome {
  // Higher confidence = less variance
  const volatility = 0.2 * (1 - confidence);
  const varianceFactor = 0.9 + Math.random() * 0.2 + (confidence * 0.05);
  const actualValue = Math.round(predictedImpact * varianceFactor);
  const variance = actualValue - predictedImpact;
  const variancePercent = (variance / predictedImpact) * 100;
  const accuracy = Math.min(100, Math.max(0, 100 - Math.abs(variancePercent)));

  // Conflict resolution is immediate, so minimal timeline
  const timeline: OutcomeTimeline[] = [
    {
      day: 1,
      label: 'Resolution',
      predicted: predictedImpact,
      actual: actualValue,
      variance,
      variancePercent,
      status: variancePercent > 0 ? 'ahead' : variancePercent < -5 ? 'behind' : 'on-track',
      cumulative: actualValue,
    },
  ];

  return {
    predictedValue: predictedImpact,
    actualValue,
    variance,
    variancePercent,
    accuracy,
    timeline,
    status: accuracy >= 90 ? 'success' : accuracy >= 75 ? 'partial' : 'below-target',
  };
}

// Calculate aggregate accuracy from multiple decisions
export function calculateAggregateAccuracy(outcomes: SimulatedOutcome[]): {
  averageAccuracy: number;
  totalPredicted: number;
  totalActual: number;
  overallVariance: number;
} {
  if (outcomes.length === 0) {
    return {
      averageAccuracy: 100,
      totalPredicted: 0,
      totalActual: 0,
      overallVariance: 0,
    };
  }

  const totalPredicted = outcomes.reduce((sum, o) => sum + o.predictedValue, 0);
  const totalActual = outcomes.reduce((sum, o) => sum + o.actualValue, 0);
  const averageAccuracy = outcomes.reduce((sum, o) => sum + o.accuracy, 0) / outcomes.length;

  return {
    averageAccuracy: Math.round(averageAccuracy * 10) / 10,
    totalPredicted,
    totalActual,
    overallVariance: ((totalActual - totalPredicted) / totalPredicted) * 100,
  };
}
