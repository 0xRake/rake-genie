'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BrazilMap } from './BrazilMap';
import { AnimatedMetric } from './AnimatedMetric';
import {
  inventoryData,
  Warehouse,
  InventoryItem,
  getWarehouseStatus
} from '@/data/natura/inventory';
import {
  formatBRL,
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
  ArrowRight,
  Warehouse as WarehouseIcon,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';

interface ExecutiveDashboardProps {
  onSKUSelect: (sku: string, warehouse: Warehouse) => void;
}

export function ExecutiveDashboard({ onSKUSelect }: ExecutiveDashboardProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [hoveredWarehouse, setHoveredWarehouse] = useState<Warehouse | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredSku, setHoveredSku] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWarehouseSelect = useCallback((warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
  }, []);

  const handleWarehouseHover = useCallback((warehouse: Warehouse | null) => {
    setHoveredWarehouse(warehouse);
  }, []);

  const handleSKUClick = useCallback((item: InventoryItem, warehouse: Warehouse) => {
    onSKUSelect(item.sku, warehouse);
  }, [onSKUSelect]);

  // Sort inventory items by status priority
  const sortedInventory = selectedWarehouse
    ? [...selectedWarehouse.inventory].sort((a, b) => {
        const statusOrder = { stockout: 0, excess: 1, healthy: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      })
    : [];

  return (
    <div className="h-full flex gap-6 p-6">
      {/* Left Panel: Brazil Map */}
      <div className="flex-1 min-w-0">
        <Card className={cn(
          'h-full overflow-hidden relative',
          'bg-gradient-to-br from-background via-background to-primary/5',
          'border-border/50'
        )}>
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4 bg-gradient-to-b from-background via-background/95 to-transparent">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                  <MapPin size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <span className="block">Inventory Map</span>
                  <span className="text-xs text-muted font-normal">Brazil Distribution Network</span>
                </div>
              </h2>
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles size={12} className="mr-1" />
                  12 Distribution Centers
                </Badge>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="pt-20 h-full">
            <BrazilMap
              warehouses={inventoryData.warehouses}
              selectedWarehouse={selectedWarehouse}
              onWarehouseSelect={handleWarehouseSelect}
              onWarehouseHover={handleWarehouseHover}
            />
          </div>
        </Card>
      </div>

      {/* Right Panel: Metrics & Details */}
      <div className="w-[420px] flex flex-col gap-4">
        {/* Consolidated Metrics - Animated */}
        <div className={cn(
          'grid grid-cols-2 gap-3',
          'transform transition-all duration-700',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <AnimatedMetric
            value={inventoryData.consolidated.totalInventoryValue}
            formatter={formatBRLCompact}
            label="Total Inventory"
            icon={<Package size={16} />}
            color="default"
            delay={0}
          />
          <AnimatedMetric
            value={inventoryData.consolidated.totalExcess}
            formatter={formatBRLCompact}
            label="Excess Value"
            icon={<TrendingDown size={16} />}
            color="amber"
            delay={100}
          />
          <AnimatedMetric
            value={inventoryData.consolidated.totalStockoutRisk}
            formatter={formatBRLCompact}
            label="At Risk"
            icon={<AlertTriangle size={16} />}
            color="red"
            delay={200}
          />
          <AnimatedMetric
            value={inventoryData.consolidated.wasteOpportunity}
            formatter={formatBRLCompact}
            label="Opportunity"
            icon={<Target size={16} />}
            color="primary"
            delay={300}
          />
        </div>

        {/* Warehouse Details */}
        <Card className={cn(
          'flex-1 overflow-hidden flex flex-col',
          'bg-gradient-to-br from-background to-muted/20',
          'border-border/50',
          'transform transition-all duration-500',
          selectedWarehouse ? 'ring-2 ring-primary/20' : ''
        )}>
          {/* Header */}
          <div className="p-4 border-b border-border/50 bg-background/50 backdrop-blur">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <WarehouseIcon size={18} className="text-primary" />
                {selectedWarehouse ? selectedWarehouse.name : 'Select a Warehouse'}
              </h3>
              {selectedWarehouse && (
                <Badge
                  variant={
                    getWarehouseStatus(selectedWarehouse) === 'stockout' ? 'red' :
                    getWarehouseStatus(selectedWarehouse) === 'excess' ? 'amber' : 'green'
                  }
                  className="animate-in fade-in duration-300"
                >
                  {selectedWarehouse.brand}
                </Badge>
              )}
            </div>
          </div>

          {selectedWarehouse ? (
            <>
              {/* Warehouse Quick Stats */}
              <div className="p-4 grid grid-cols-3 gap-2 border-b border-border/30">
                {[
                  { label: 'Total', value: selectedWarehouse.metrics.totalValue, color: 'default' as const },
                  { label: 'Excess', value: selectedWarehouse.metrics.excessValue, color: 'amber' as const },
                  { label: 'Risk', value: selectedWarehouse.metrics.stockoutRisk, color: 'red' as const }
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={cn(
                      'text-center p-3 rounded-lg transition-all duration-300',
                      'hover:scale-105 cursor-default',
                      stat.color === 'amber' ? 'bg-amber-500/10 hover:bg-amber-500/20' :
                      stat.color === 'red' ? 'bg-red-500/10 hover:bg-red-500/20' :
                      'bg-muted/30 hover:bg-muted/50',
                      'animate-in fade-in slide-in-from-bottom-2',
                    )}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="text-xs text-muted mb-1">{stat.label}</div>
                    <div className={cn(
                      'text-sm font-bold',
                      stat.color === 'amber' ? 'text-amber-500' :
                      stat.color === 'red' ? 'text-red-500' : ''
                    )}>
                      {formatBRLCompact(stat.value)}
                    </div>
                  </div>
                ))}
              </div>

              {/* SKU List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div className="text-xs text-muted mb-3 flex items-center justify-between">
                  <span>{sortedInventory.length} SKUs in this DC</span>
                  <span className="text-primary">Click to investigate →</span>
                </div>
                <div className="space-y-2">
                  {sortedInventory.map((item, index) => (
                    <div
                      key={item.sku}
                      onClick={() => handleSKUClick(item, selectedWarehouse)}
                      onMouseEnter={() => setHoveredSku(item.sku)}
                      onMouseLeave={() => setHoveredSku(null)}
                      className={cn(
                        'p-4 rounded-xl border-2 cursor-pointer',
                        'transform transition-all duration-300',
                        'hover:shadow-lg hover:-translate-y-0.5',
                        getStatusBgClass(item.status),
                        hoveredSku === item.sku ? getStatusBorderClass(item.status) : 'border-transparent',
                        'animate-in fade-in slide-in-from-right-2'
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{item.productName}</div>
                          <div className="text-xs text-muted font-mono">{item.sku}</div>
                        </div>
                        <Badge
                          variant={
                            item.status === 'stockout' ? 'red' :
                            item.status === 'excess' ? 'amber' : 'green'
                          }
                          className="text-xs shrink-0 ml-2"
                        >
                          {item.status === 'stockout' && <Zap size={10} className="mr-1" />}
                          {item.status === 'stockout' ? 'CRITICAL' :
                           item.status === 'excess' ? 'EXCESS' : 'OK'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="bg-background/50 rounded-lg p-2">
                          <span className="text-muted block">Qty</span>
                          <span className="font-semibold">{formatNumber(item.quantity)}</span>
                        </div>
                        <div className="bg-background/50 rounded-lg p-2">
                          <span className="text-muted block">Coverage</span>
                          <span className={cn('font-semibold', getStatusColorClass(item.status))}>
                            {formatDays(item.coverageDays)}
                          </span>
                        </div>
                        <div className="bg-background/50 rounded-lg p-2">
                          <span className="text-muted block">Value</span>
                          <span className="font-semibold">{formatBRL(item.unitValue, 2)}</span>
                        </div>
                      </div>

                      {item.status !== 'healthy' && (
                        <div className={cn(
                          'mt-3 pt-3 border-t border-current/10 flex items-center justify-between',
                          'transition-all duration-300',
                          hoveredSku === item.sku ? 'opacity-100' : 'opacity-70'
                        )}>
                          <span className="text-xs text-muted">
                            {item.status === 'excess'
                              ? `Last sale: ${item.lastSaleDate}`
                              : `Forecast: ${formatNumber(item.demandForecast || 0)} units`
                            }
                          </span>
                          <div className={cn(
                            'flex items-center gap-1 text-xs font-medium',
                            item.status === 'stockout' ? 'text-red-500' : 'text-amber-500'
                          )}>
                            Investigate
                            <ArrowRight size={14} className={cn(
                              'transition-transform duration-300',
                              hoveredSku === item.sku ? 'translate-x-1' : ''
                            )} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {sortedInventory.some(i => i.status !== 'healthy') && (
                <div className="p-4 border-t border-border/30 bg-gradient-to-t from-background to-transparent">
                  <Button
                    variant="primary"
                    className="w-full group relative overflow-hidden"
                    onClick={() => {
                      const conflictSku = sortedInventory.find(i => i.status !== 'healthy');
                      if (conflictSku) {
                        handleSKUClick(conflictSku, selectedWarehouse);
                      }
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Sparkles size={16} />
                      Investigate Catalog Conflicts
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className={cn(
                'text-center p-8',
                'animate-in fade-in duration-500'
              )}>
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <MapPin size={32} className="text-primary/50" />
                </div>
                <p className="font-medium mb-1">Select a Distribution Center</p>
                <p className="text-sm text-muted">Click on any marker on the map</p>
                <p className="text-xs text-muted mt-2">to view inventory details</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
