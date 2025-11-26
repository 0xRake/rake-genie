'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BrazilMap } from './BrazilMap';
import { AnimatedMetric } from './AnimatedMetric';
import { ActionableInsights } from './ActionableInsights';
import { ObjectExplorer } from './ObjectExplorer';
import { QuickFilters } from './QuickFilters';
import { useNaturaStore, useFilteredWarehouses } from '@/store/natura-store';
import { Warehouse, InventoryItem } from '@/data/natura/inventory';
import {
  formatBRLCompact,
  formatNumber,
  formatDays,
  getStatusColorClass,
  getStatusBgClass,
  getStatusBorderClass
} from '@/lib/natura/formatting';
import {
  MapPin,
  Package,
  AlertTriangle,
  TrendingDown,
  Target,
  Sparkles,
  ArrowRight,
  Zap,
  ChevronRight,
  Layers,
  Bell
} from 'lucide-react';

interface InteractiveDashboardProps {
  onNavigateToConflict: () => void;
  onNavigateToOptimize: () => void;
}

export function InteractiveDashboard({
  onNavigateToConflict,
  onNavigateToOptimize
}: InteractiveDashboardProps) {
  const {
    selectedWarehouse,
    selectedSku,
    setSelectedWarehouse,
    setSelectedSku,
    setPhase,
    insights,
    phase
  } = useNaturaStore();

  const filteredWarehouses = useFilteredWarehouses();
  const [mounted, setMounted] = useState(false);
  const [hoveredSku, setHoveredSku] = useState<string | null>(null);
  const [, setShowInsights] = useState(true);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- Mounting state is intentional
  }, []);

  const handleWarehouseSelect = useCallback((warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
  }, [setSelectedWarehouse]);

  const handleWarehouseHover = useCallback((_warehouse: Warehouse | null) => {
    // Could add hover state if needed
  }, []);

  const handleSKUClick = useCallback((item: InventoryItem, warehouse: Warehouse) => {
    setSelectedSku(item, warehouse);
    setPhase('investigate');
  }, [setSelectedSku, setPhase]);

  // Sort inventory items by status priority
  const sortedInventory = selectedWarehouse
    ? [...selectedWarehouse.inventory].sort((a, b) => {
        const statusOrder = { stockout: 0, excess: 1, healthy: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      })
    : [];

  // Calculate filtered metrics
  const filteredMetrics = {
    totalValue: filteredWarehouses.reduce((sum, wh) => sum + wh.metrics.totalValue, 0),
    excessValue: filteredWarehouses.reduce((sum, wh) => sum + wh.metrics.excessValue, 0),
    stockoutRisk: filteredWarehouses.reduce((sum, wh) => sum + wh.metrics.stockoutRisk, 0),
    opportunity: filteredWarehouses.reduce((sum, wh) =>
      sum + wh.metrics.excessValue * 0.3 + wh.metrics.stockoutRisk * 0.5, 0
    )
  };

  return (
    <div className="h-full flex gap-4 p-4">
      {/* Left Column: Map + Filters + Insights */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Filters Bar */}
        <Card className="p-3">
          <QuickFilters compact />
        </Card>

        {/* Map Card */}
        <Card className={cn(
          'flex-1 overflow-hidden relative',
          'bg-gradient-to-br from-background via-background to-primary/5',
          'border-border/50'
        )}>
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-gradient-to-b from-background via-background/95 to-transparent">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                  <MapPin size={16} className="text-primary-foreground" />
                </div>
                <div>
                  <span className="block">Distribution Network</span>
                  <span className="text-xs text-muted font-normal">
                    {filteredWarehouses.length} active centers
                  </span>
                </div>
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs">
                  <Layers size={10} className="mr-1" />
                  {filteredWarehouses.length} DCs
                </Badge>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="pt-16 h-full">
            <BrazilMap
              warehouses={filteredWarehouses}
              selectedWarehouse={selectedWarehouse}
              onWarehouseSelect={handleWarehouseSelect}
              onWarehouseHover={handleWarehouseHover}
            />
          </div>
        </Card>

        {/* Metrics Row */}
        <div className={cn(
          'grid grid-cols-4 gap-3',
          'transform transition-all duration-700',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          <AnimatedMetric
            value={filteredMetrics.totalValue}
            formatter={formatBRLCompact}
            label="Total Inventory"
            icon={<Package size={14} />}
            color="default"
            delay={0}
          />
          <AnimatedMetric
            value={filteredMetrics.excessValue}
            formatter={formatBRLCompact}
            label="Excess Value"
            icon={<TrendingDown size={14} />}
            color="amber"
            delay={100}
          />
          <AnimatedMetric
            value={filteredMetrics.stockoutRisk}
            formatter={formatBRLCompact}
            label="At Risk"
            icon={<AlertTriangle size={14} />}
            color="red"
            delay={200}
          />
          <AnimatedMetric
            value={filteredMetrics.opportunity}
            formatter={formatBRLCompact}
            label="Opportunity"
            icon={<Target size={14} />}
            color="primary"
            delay={300}
          />
        </div>
      </div>

      {/* Middle Column: Selected Warehouse Details / SKU List */}
      <div className="w-[340px] flex flex-col gap-4">
        <Card className={cn(
          'flex-1 overflow-hidden flex flex-col',
          'bg-gradient-to-br from-background to-muted/20',
          'border-border/50',
          'transition-all duration-300',
          selectedWarehouse ? 'ring-2 ring-primary/20' : ''
        )}>
          {/* Header */}
          <div className="p-4 border-b border-border/50 bg-background/50 backdrop-blur">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Package size={16} className="text-primary" />
                {selectedWarehouse ? 'Inventory Details' : 'Select a Warehouse'}
              </h3>
              {selectedWarehouse && (
                <Badge
                  variant={
                    selectedWarehouse.metrics.stockoutSKUs > 0 ? 'red' :
                    selectedWarehouse.metrics.excessSKUs > 0 ? 'amber' : 'green'
                  }
                  className="text-xs"
                >
                  {selectedWarehouse.brand}
                </Badge>
              )}
            </div>
            {selectedWarehouse && (
              <p className="text-xs text-muted mt-1">{selectedWarehouse.name}</p>
            )}
          </div>

          {selectedWarehouse ? (
            <>
              {/* Quick Stats */}
              <div className="p-3 grid grid-cols-3 gap-2 border-b border-border/30">
                {[
                  { label: 'Total', value: selectedWarehouse.metrics.totalValue, color: 'default' as const },
                  { label: 'Excess', value: selectedWarehouse.metrics.excessValue, color: 'amber' as const },
                  { label: 'Risk', value: selectedWarehouse.metrics.stockoutRisk, color: 'red' as const }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      'text-center p-2 rounded-lg transition-all duration-300',
                      'hover:scale-105 cursor-default',
                      stat.color === 'amber' ? 'bg-amber-500/10 hover:bg-amber-500/20' :
                      stat.color === 'red' ? 'bg-red-500/10 hover:bg-red-500/20' :
                      'bg-muted/30 hover:bg-muted/50'
                    )}
                  >
                    <div className="text-[10px] text-muted mb-0.5">{stat.label}</div>
                    <div className={cn(
                      'text-xs font-bold',
                      stat.color === 'amber' ? 'text-amber-500' :
                      stat.color === 'red' ? 'text-red-500' : ''
                    )}>
                      {formatBRLCompact(stat.value)}
                    </div>
                  </div>
                ))}
              </div>

              {/* SKU List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                <div className="text-xs text-muted mb-2 flex items-center justify-between">
                  <span>{sortedInventory.length} SKUs</span>
                  <span className="text-primary flex items-center gap-1">
                    Click to investigate <ChevronRight size={12} />
                  </span>
                </div>
                <div className="space-y-2">
                  {sortedInventory.map((item) => {
                    const isSelected = selectedSku?.sku === item.sku;

                    return (
                      <div
                        key={item.sku}
                        onClick={() => handleSKUClick(item, selectedWarehouse)}
                        onMouseEnter={() => setHoveredSku(item.sku)}
                        onMouseLeave={() => setHoveredSku(null)}
                        className={cn(
                          'p-3 rounded-xl border-2 cursor-pointer',
                          'transform transition-all duration-200',
                          'hover:shadow-md hover:-translate-y-0.5',
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : getStatusBgClass(item.status),
                          !isSelected && (hoveredSku === item.sku
                            ? getStatusBorderClass(item.status)
                            : 'border-transparent')
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs truncate">{item.productName}</div>
                            <div className="text-[10px] text-muted font-mono">{item.sku}</div>
                          </div>
                          <Badge
                            variant={
                              item.status === 'stockout' ? 'red' :
                              item.status === 'excess' ? 'amber' : 'green'
                            }
                            className="text-[10px] shrink-0 ml-2"
                          >
                            {item.status === 'stockout' && <Zap size={8} className="mr-0.5" />}
                            {item.status === 'stockout' ? 'CRITICAL' :
                             item.status === 'excess' ? 'EXCESS' : 'OK'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                          <div className="bg-background/50 rounded p-1.5">
                            <span className="text-muted block">Qty</span>
                            <span className="font-semibold">{formatNumber(item.quantity)}</span>
                          </div>
                          <div className="bg-background/50 rounded p-1.5">
                            <span className="text-muted block">Coverage</span>
                            <span className={cn('font-semibold', getStatusColorClass(item.status))}>
                              {formatDays(item.coverageDays)}
                            </span>
                          </div>
                          <div className="bg-background/50 rounded p-1.5">
                            <span className="text-muted block">Value</span>
                            <span className="font-semibold">{formatBRLCompact(item.quantity * item.unitValue)}</span>
                          </div>
                        </div>

                        {item.status !== 'healthy' && (
                          <div className={cn(
                            'mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[10px]',
                            'transition-all duration-200',
                            hoveredSku === item.sku || isSelected ? 'opacity-100' : 'opacity-60'
                          )}>
                            <span className="text-muted">
                              {item.status === 'excess'
                                ? `Last sale: ${item.lastSaleDate}`
                                : `Forecast: ${formatNumber(item.demandForecast || 0)} units`
                              }
                            </span>
                            <div className={cn(
                              'flex items-center gap-1 font-medium',
                              item.status === 'stockout' ? 'text-red-500' : 'text-amber-500'
                            )}>
                              Investigate
                              <ArrowRight size={10} className={cn(
                                'transition-transform',
                                hoveredSku === item.sku || isSelected ? 'translate-x-0.5' : ''
                              )} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              {sortedInventory.some(i => i.status !== 'healthy') && (
                <div className="p-3 border-t border-border/30 bg-gradient-to-t from-background to-transparent">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full group"
                    onClick={() => {
                      const conflictSku = sortedInventory.find(i => i.status !== 'healthy');
                      if (conflictSku) {
                        handleSKUClick(conflictSku, selectedWarehouse);
                      }
                    }}
                  >
                    <Sparkles size={14} className="mr-2" />
                    Investigate Issues
                    <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <MapPin size={24} className="text-primary/50" />
                </div>
                <p className="font-medium text-sm mb-1">Select a Distribution Center</p>
                <p className="text-xs text-muted">Click any marker on the map</p>
                <p className="text-xs text-muted mt-1">to view inventory details</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Right Column: Insights + Object Explorer */}
      <div className="w-[320px] flex flex-col gap-4">
        {/* Insights Panel */}
        <Card className={cn(
          'p-4 transition-all duration-300',
          insights.length > 0 ? 'border-amber-500/30' : ''
        )}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Bell size={14} className="text-amber-500" />
              Insights
            </h3>
            {insights.length > 0 && (
              <Badge variant="amber" className="text-xs">
                {insights.length} active
              </Badge>
            )}
          </div>
          <ActionableInsights compact maxItems={3} />
        </Card>

        {/* Object Explorer */}
        {(selectedWarehouse || phase === 'investigate') && (
          <ObjectExplorer
            className="flex-1"
            onNavigateToConflict={onNavigateToConflict}
            onNavigateToOptimize={onNavigateToOptimize}
          />
        )}

        {/* Quick Actions when no warehouse selected */}
        {!selectedWarehouse && phase === 'explore' && (
          <Card className="flex-1 p-4 flex flex-col">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Zap size={14} className="text-primary" />
              Quick Actions
            </h3>

            <div className="space-y-3 flex-1">
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => {
                  const stockoutWh = filteredWarehouses.find(wh =>
                    wh.inventory.some(i => i.status === 'stockout')
                  );
                  if (stockoutWh) {
                    setSelectedWarehouse(stockoutWh);
                  }
                }}
              >
                <AlertTriangle size={14} className="mr-2 text-red-500" />
                View Stockout Risks
                <ChevronRight size={14} className="ml-auto" />
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => {
                  const excessWh = filteredWarehouses.find(wh =>
                    wh.metrics.excessValue > 2000000
                  );
                  if (excessWh) {
                    setSelectedWarehouse(excessWh);
                  }
                }}
              >
                <TrendingDown size={14} className="mr-2 text-amber-500" />
                View Excess Inventory
                <ChevronRight size={14} className="ml-auto" />
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={onNavigateToConflict}
              >
                <Package size={14} className="mr-2 text-purple-500" />
                Resolve Conflicts
                <ChevronRight size={14} className="ml-auto" />
              </Button>

              <Button
                variant="primary"
                className="w-full justify-start"
                onClick={onNavigateToOptimize}
              >
                <Target size={14} className="mr-2" />
                Run Optimization
                <ChevronRight size={14} className="ml-auto" />
              </Button>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-muted/20 text-xs text-muted">
              <p className="font-medium text-foreground mb-1">Tip:</p>
              <p>Click on map markers to explore warehouse inventory, or use the insights panel to jump to issues.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
