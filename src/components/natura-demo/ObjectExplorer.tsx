'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNaturaStore, getLinkedObjects, LinkedObject } from '@/store/natura-store';
import { formatBRLCompact, formatNumber, formatDays, getStatusColorClass } from '@/lib/natura/formatting';
import { inventoryData } from '@/data/natura/inventory';
import { conflictsData } from '@/data/natura/conflicts';
import {
  Warehouse,
  Package,
  Users,
  MapPin,
  TrendingUp,
  GitMerge,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  Truck,
  FileText,
  Clock
} from 'lucide-react';

interface ObjectExplorerProps {
  className?: string;
  onNavigateToConflict?: () => void;
  onNavigateToOptimize?: () => void;
}

const objectTypeConfig: Record<LinkedObject['type'], {
  icon: React.ReactNode;
  label: string;
  color: string;
}> = {
  warehouse: {
    icon: <Warehouse size={14} />,
    label: 'Distribution Center',
    color: 'text-primary'
  },
  sku: {
    icon: <Package size={14} />,
    label: 'Product',
    color: 'text-blue-500'
  },
  supplier: {
    icon: <Users size={14} />,
    label: 'Supplier',
    color: 'text-purple-500'
  },
  region: {
    icon: <MapPin size={14} />,
    label: 'Region',
    color: 'text-green-500'
  },
  forecast: {
    icon: <TrendingUp size={14} />,
    label: 'Forecast',
    color: 'text-amber-500'
  },
  conflict: {
    icon: <GitMerge size={14} />,
    label: 'Conflict',
    color: 'text-red-500'
  }
};

export function ObjectExplorer({
  className,
  onNavigateToConflict,
  onNavigateToOptimize
}: ObjectExplorerProps) {
  const {
    selectedWarehouse,
    selectedSku,
    setSelectedSku,
    setSelectedConflict,
    setPhase
  } = useNaturaStore();

  // Get linked objects
  const linkedObjects = useMemo(() => {
    if (!selectedWarehouse) return [];
    return getLinkedObjects(selectedWarehouse);
  }, [selectedWarehouse]);

  // Group by type
  const groupedObjects = useMemo(() => {
    const groups: Record<string, LinkedObject[]> = {};
    linkedObjects.forEach(obj => {
      if (!groups[obj.type]) groups[obj.type] = [];
      groups[obj.type].push(obj);
    });
    return groups;
  }, [linkedObjects]);

  // Find related conflicts for selected SKU
  const relatedConflicts = useMemo(() => {
    if (!selectedSku) return [];
    return conflictsData.conflicts.filter(c =>
      c.sources.some(s =>
        selectedSku.sku.toLowerCase().includes(s.sku.toLowerCase().split('-').slice(1).join('-'))
      )
    );
  }, [selectedSku]);

  // Find transfer opportunities
  const transferOpportunities = useMemo(() => {
    if (!selectedWarehouse || !selectedSku) return [];

    // Find warehouses with opposite status for this product category
    if (selectedSku.status === 'excess') {
      return inventoryData.warehouses
        .filter(wh => wh.id !== selectedWarehouse.id)
        .filter(wh => wh.inventory.some(i => i.status === 'stockout'))
        .slice(0, 3);
    } else if (selectedSku.status === 'stockout') {
      return inventoryData.warehouses
        .filter(wh => wh.id !== selectedWarehouse.id)
        .filter(wh => wh.inventory.some(i => i.status === 'excess'))
        .slice(0, 3);
    }
    return [];
  }, [selectedWarehouse, selectedSku]);

  if (!selectedWarehouse) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="text-center text-muted">
          <Warehouse size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a warehouse on the map</p>
          <p className="text-xs mt-1">to explore linked objects</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('flex flex-col overflow-hidden', className)}>
      {/* Header - Selected Warehouse */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Warehouse size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{selectedWarehouse.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>{selectedWarehouse.brand}</span>
              <span>•</span>
              <span>{selectedWarehouse.region}</span>
            </div>
          </div>
          <Badge
            variant={
              selectedWarehouse.metrics.stockoutSKUs > 0 ? 'red' :
              selectedWarehouse.metrics.excessSKUs > 0 ? 'amber' : 'green'
            }
          >
            {selectedWarehouse.inventory.length} SKUs
          </Badge>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="p-2 rounded-lg bg-background/50 text-center">
            <div className="text-xs text-muted">Total</div>
            <div className="font-bold text-sm">{formatBRLCompact(selectedWarehouse.metrics.totalValue)}</div>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 text-center">
            <div className="text-xs text-muted">Excess</div>
            <div className="font-bold text-sm text-amber-500">{formatBRLCompact(selectedWarehouse.metrics.excessValue)}</div>
          </div>
          <div className="p-2 rounded-lg bg-red-500/10 text-center">
            <div className="text-xs text-muted">At Risk</div>
            <div className="font-bold text-sm text-red-500">{formatBRLCompact(selectedWarehouse.metrics.stockoutRisk)}</div>
          </div>
        </div>
      </div>

      {/* Selected SKU Details */}
      {selectedSku && (
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-blue-500/10 to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-blue-500" />
            <span className="font-semibold text-sm">Selected Product</span>
            <Badge
              variant={selectedSku.status === 'stockout' ? 'red' : selectedSku.status === 'excess' ? 'amber' : 'green'}
              className="text-xs ml-auto"
            >
              {selectedSku.status.toUpperCase()}
            </Badge>
          </div>

          <div className="text-sm font-medium mb-1">{selectedSku.productName}</div>
          <div className="text-xs text-muted font-mono mb-3">{selectedSku.sku}</div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-background/50">
              <span className="text-muted">Quantity:</span>{' '}
              <span className="font-semibold">{formatNumber(selectedSku.quantity)}</span>
            </div>
            <div className="p-2 rounded bg-background/50">
              <span className="text-muted">Coverage:</span>{' '}
              <span className={cn('font-semibold', getStatusColorClass(selectedSku.status))}>
                {formatDays(selectedSku.coverageDays)}
              </span>
            </div>
          </div>

          {/* Related Conflicts */}
          {relatedConflicts.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <GitMerge size={14} className="text-purple-500" />
                <span className="text-xs font-semibold text-purple-500">
                  {relatedConflicts.length} Catalog Conflict{relatedConflicts.length > 1 ? 's' : ''}
                </span>
              </div>
              {relatedConflicts.map(conflict => (
                <button
                  key={conflict.id}
                  onClick={() => {
                    setSelectedConflict(conflict);
                    setPhase('resolve');
                    onNavigateToConflict?.();
                  }}
                  className="w-full text-left p-2 rounded bg-background/50 text-xs hover:bg-background/80 transition-colors flex items-center gap-2 mt-1"
                >
                  <span className="flex-1 truncate">{conflict.goldenRecord.description}</span>
                  <Badge variant={conflict.resolved ? 'green' : 'amber'} className="text-[10px]">
                    {conflict.resolved ? 'RESOLVED' : conflict.priority.toUpperCase()}
                  </Badge>
                  <ChevronRight size={12} className="text-muted" />
                </button>
              ))}
            </div>
          )}

          {/* Transfer Opportunities */}
          {transferOpportunities.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">
                  Transfer Opportunities
                </span>
              </div>
              <div className="text-xs text-muted mb-2">
                {selectedSku.status === 'excess'
                  ? 'These DCs have stockout risk - transfer could help:'
                  : 'These DCs have excess inventory available:'}
              </div>
              {transferOpportunities.map(wh => (
                <button
                  key={wh.id}
                  onClick={() => {
                    setPhase('optimize');
                    onNavigateToOptimize?.();
                  }}
                  className="w-full text-left p-2 rounded bg-background/50 text-xs hover:bg-background/80 transition-colors flex items-center gap-2 mt-1"
                >
                  <MapPin size={12} className="text-muted" />
                  <span className="flex-1">{wh.name}</span>
                  <ArrowUpRight size={12} className="text-primary" />
                </button>
              ))}
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  setPhase('optimize');
                  onNavigateToOptimize?.();
                }}
              >
                <Zap size={12} className="mr-1" />
                Simulate Transfer Scenarios
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Linked Objects */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="text-xs font-semibold text-muted mb-3 flex items-center gap-2">
          <FileText size={12} />
          LINKED OBJECTS
        </div>

        {/* SKUs List */}
        <div className="mb-4">
          <div className="text-xs text-muted mb-2 flex items-center gap-2">
            <Package size={12} className="text-blue-500" />
            Products ({groupedObjects.sku?.length || 0})
          </div>
          <div className="space-y-1">
            {(groupedObjects.sku || []).slice(0, 5).map(obj => {
              const isSelected = selectedSku?.sku === obj.id;
              const item = selectedWarehouse.inventory.find(i => i.sku === obj.id);

              return (
                <button
                  key={obj.id}
                  onClick={() => {
                    if (item) setSelectedSku(item, selectedWarehouse);
                  }}
                  className={cn(
                    'w-full text-left p-2 rounded-lg text-xs transition-all',
                    'flex items-center gap-2',
                    isSelected
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'bg-muted/20 hover:bg-muted/40 border border-transparent'
                  )}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    obj.status === 'stockout' ? 'bg-red-500' :
                    obj.status === 'excess' ? 'bg-amber-500' : 'bg-green-500'
                  )} />
                  <span className="flex-1 truncate">{obj.name}</span>
                  {obj.value && (
                    <span className="text-muted shrink-0">{formatBRLCompact(obj.value)}</span>
                  )}
                  <ChevronRight size={12} className="text-muted shrink-0" />
                </button>
              );
            })}
            {(groupedObjects.sku?.length || 0) > 5 && (
              <div className="text-xs text-muted text-center py-1">
                +{(groupedObjects.sku?.length || 0) - 5} more
              </div>
            )}
          </div>
        </div>

        {/* Suppliers */}
        {groupedObjects.supplier && groupedObjects.supplier.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-muted mb-2 flex items-center gap-2">
              <Users size={12} className="text-purple-500" />
              Suppliers ({groupedObjects.supplier.length})
            </div>
            <div className="space-y-1">
              {groupedObjects.supplier.map(obj => (
                <div
                  key={obj.id}
                  className="p-2 rounded-lg bg-muted/20 text-xs flex items-center gap-2"
                >
                  <Users size={12} className="text-purple-500 shrink-0" />
                  <span className="flex-1 truncate">{obj.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conflicts */}
        {groupedObjects.conflict && groupedObjects.conflict.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-muted mb-2 flex items-center gap-2">
              <GitMerge size={12} className="text-red-500" />
              Conflicts ({groupedObjects.conflict.length})
            </div>
            <div className="space-y-1">
              {groupedObjects.conflict.map(obj => (
                <button
                  key={obj.id}
                  onClick={() => {
                    const conflict = conflictsData.conflicts.find(c => c.id === obj.id);
                    if (conflict) {
                      setSelectedConflict(conflict);
                      setPhase('resolve');
                      onNavigateToConflict?.();
                    }
                  }}
                  className="w-full text-left p-2 rounded-lg bg-muted/20 hover:bg-muted/40 text-xs flex items-center gap-2 transition-colors"
                >
                  {obj.status === 'resolved' ? (
                    <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                  ) : (
                    <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                  )}
                  <span className="flex-1 truncate">{obj.name}</span>
                  <Badge
                    variant={obj.status === 'resolved' ? 'green' : 'amber'}
                    className="text-[10px]"
                  >
                    {obj.status?.toUpperCase()}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="p-4 border-t border-border/50 bg-gradient-to-t from-background to-transparent">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPhase('resolve');
              onNavigateToConflict?.();
            }}
          >
            <GitMerge size={14} className="mr-1" />
            Conflicts
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setPhase('optimize');
              onNavigateToOptimize?.();
            }}
          >
            <Zap size={14} className="mr-1" />
            Optimize
          </Button>
        </div>
      </div>
    </Card>
  );
}
