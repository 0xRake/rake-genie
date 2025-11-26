// Natura & Co Formatting Utilities - Brazilian Standards

/**
 * Format number as Brazilian currency (BRL)
 * e.g., 1234567.89 -> "R$ 1.234.567,89"
 */
export function formatBRL(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Format large BRL values with abbreviations
 * e.g., 1234567 -> "R$ 1,2M"
 */
export function formatBRLCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toFixed(1).replace('.', ',')}B`;
  }
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1).replace('.', ',')}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1).replace('.', ',')}k`;
  }
  return formatBRL(value);
}

/**
 * Format number with Brazilian separators
 * e.g., 42300 -> "42.300"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Format number with compact notation
 * e.g., 42300 -> "42,3k"
 */
export function formatNumberCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace('.', ',')}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace('.', ',')}k`;
  }
  return formatNumber(value);
}

/**
 * Format percentage
 * e.g., 0.139 -> "13,9%"
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals).replace('.', ',')}%`;
}

/**
 * Format ROI multiplier
 * e.g., 13.9 -> "13,9x"
 */
export function formatROI(value: number): string {
  if (value >= 0) {
    return `${value.toFixed(1).replace('.', ',')}x`;
  }
  return `${value.toFixed(0).replace('.', ',')}%`;
}

/**
 * Format days
 * e.g., 8 -> "8 dias"
 */
export function formatDays(value: number): string {
  if (value === 1) return '1 dia';
  return `${value} dias`;
}

/**
 * Format date in Brazilian format
 * e.g., "2024-12-04" -> "04/12/2024"
 */
export function formatDateBR(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

/**
 * Format date with month name
 * e.g., "2024-12-04" -> "04 de dezembro de 2024"
 */
export function formatDateLongBR(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Format distance in km
 * e.g., 2134 -> "2.134 km"
 */
export function formatDistance(km: number): string {
  return `${formatNumber(km)} km`;
}

/**
 * Format units count
 * e.g., 42300 -> "42.300 unidades"
 */
export function formatUnits(value: number): string {
  if (value === 1) return '1 unidade';
  return `${formatNumber(value)} unidades`;
}

/**
 * Format warehouse coverage status as text
 */
export function formatCoverageStatus(coverageDays: number): string {
  if (coverageDays < 14) return 'Risco de ruptura';
  if (coverageDays > 180) return 'Excesso de estoque';
  return 'Saudável';
}

/**
 * Format consultant count
 * e.g., 247 -> "247 consultores"
 */
export function formatConsultants(value: number): string {
  if (value === 1) return '1 consultor';
  return `${formatNumber(value)} consultores`;
}

/**
 * Format confidence score
 * e.g., 0.91 -> "91%"
 */
export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/**
 * Format similarity score
 * e.g., 0.94 -> "94%"
 */
export function formatSimilarity(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/**
 * Format variance as percentage
 * e.g., 0.017 -> "1,7%"
 */
export function formatVariance(value: number): string {
  return formatPercent(value, 1);
}

/**
 * Format SKU for display
 * e.g., "NAT-CHRO-SER-030" -> "NAT-CHRO-SER-030"
 */
export function formatSKU(sku: string): string {
  return sku.toUpperCase();
}

/**
 * Format time duration
 * e.g., 694 seconds -> "11min 34s"
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}min`;
  return `${mins}min ${secs}s`;
}

/**
 * Get status color class for inventory status
 */
export function getStatusColorClass(status: 'healthy' | 'excess' | 'stockout'): string {
  switch (status) {
    case 'healthy': return 'text-green-600 dark:text-green-400';
    case 'excess': return 'text-amber-600 dark:text-amber-400';
    case 'stockout': return 'text-red-600 dark:text-red-400';
  }
}

/**
 * Get status background color class
 */
export function getStatusBgClass(status: 'healthy' | 'excess' | 'stockout'): string {
  switch (status) {
    case 'healthy': return 'bg-green-100 dark:bg-green-900/30';
    case 'excess': return 'bg-amber-100 dark:bg-amber-900/30';
    case 'stockout': return 'bg-red-100 dark:bg-red-900/30';
  }
}

/**
 * Get status border color class
 */
export function getStatusBorderClass(status: 'healthy' | 'excess' | 'stockout'): string {
  switch (status) {
    case 'healthy': return 'border-green-500';
    case 'excess': return 'border-amber-500';
    case 'stockout': return 'border-red-500';
  }
}

/**
 * Get priority badge variant
 */
export function getPriorityBadgeVariant(priority: 'high' | 'medium' | 'low'): 'red' | 'amber' | 'green' {
  switch (priority) {
    case 'high': return 'red';
    case 'medium': return 'amber';
    case 'low': return 'green';
  }
}

/**
 * Get recommendation badge text
 */
export function getRecommendationText(recommendation: 'merge' | 'review' | 'keep_separate'): string {
  switch (recommendation) {
    case 'merge': return 'MERGE';
    case 'review': return 'REVIEW';
    case 'keep_separate': return 'KEEP SEPARATE';
  }
}
