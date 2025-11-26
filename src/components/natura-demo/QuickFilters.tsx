'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNaturaStore, useFilteredWarehouses } from '@/store/natura-store';
import { inventoryData } from '@/data/natura/inventory';
import {
  Filter,
  X,
  MapPin,
  Tag,
  AlertTriangle,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'success';
}

function FilterButton({ active, onClick, children, variant = 'default' }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
        'border hover:scale-105 active:scale-95',
        active
          ? variant === 'danger'
            ? 'bg-red-500/20 border-red-500/50 text-red-500'
            : variant === 'warning'
            ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
            : variant === 'success'
            ? 'bg-green-500/20 border-green-500/50 text-green-500'
            : 'bg-primary/20 border-primary/50 text-primary'
          : 'bg-muted/20 border-border hover:bg-muted/40 text-muted-foreground'
      )}
    >
      {children}
    </button>
  );
}

interface QuickFiltersProps {
  className?: string;
  compact?: boolean;
}

export function QuickFilters({ className, compact = false }: QuickFiltersProps) {
  const { activeFilters, setFilter, clearFilters } = useNaturaStore();
  const filteredWarehouses = useFilteredWarehouses();

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== null);

  // Get unique values for each filter
  const regions = [...new Set(inventoryData.warehouses.map(w => w.region))];
  const brands = [...new Set(inventoryData.warehouses.map(w => w.brand))];

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 flex-wrap', className)}>
        <Filter size={14} className="text-muted" />

        {/* Status filters */}
        <FilterButton
          active={activeFilters.status === 'stockout'}
          onClick={() => setFilter('status', activeFilters.status === 'stockout' ? null : 'stockout')}
          variant="danger"
        >
          <AlertTriangle size={12} className="inline mr-1" />
          Stockout
        </FilterButton>

        <FilterButton
          active={activeFilters.status === 'excess'}
          onClick={() => setFilter('status', activeFilters.status === 'excess' ? null : 'excess')}
          variant="warning"
        >
          <TrendingDown size={12} className="inline mr-1" />
          Excess
        </FilterButton>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-2 py-1 rounded-lg text-xs text-muted hover:text-foreground transition-colors"
          >
            <X size={12} className="inline mr-1" />
            Clear
          </button>
        )}

        <span className="text-xs text-muted ml-2">
          {filteredWarehouses.length} DCs
        </span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Filter size={14} className="text-primary" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X size={12} className="mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Region Filter */}
      <div>
        <div className="text-xs text-muted mb-2 flex items-center gap-1">
          <MapPin size={12} />
          Region
        </div>
        <div className="flex flex-wrap gap-1">
          {regions.map(region => (
            <FilterButton
              key={region}
              active={activeFilters.region === region}
              onClick={() => setFilter('region', activeFilters.region === region ? null : region)}
            >
              {region}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <div className="text-xs text-muted mb-2 flex items-center gap-1">
          <Tag size={12} />
          Brand
        </div>
        <div className="flex flex-wrap gap-1">
          {brands.map(brand => (
            <FilterButton
              key={brand}
              active={activeFilters.brand === brand}
              onClick={() => setFilter('brand', activeFilters.brand === brand ? null : brand)}
            >
              {brand}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <div className="text-xs text-muted mb-2 flex items-center gap-1">
          <AlertTriangle size={12} />
          Status
        </div>
        <div className="flex flex-wrap gap-1">
          <FilterButton
            active={activeFilters.status === 'stockout'}
            onClick={() => setFilter('status', activeFilters.status === 'stockout' ? null : 'stockout')}
            variant="danger"
          >
            <AlertTriangle size={10} className="inline mr-1" />
            Stockout Risk
          </FilterButton>
          <FilterButton
            active={activeFilters.status === 'excess'}
            onClick={() => setFilter('status', activeFilters.status === 'excess' ? null : 'excess')}
            variant="warning"
          >
            <TrendingDown size={10} className="inline mr-1" />
            Excess
          </FilterButton>
          <FilterButton
            active={activeFilters.status === 'healthy'}
            onClick={() => setFilter('status', activeFilters.status === 'healthy' ? null : 'healthy')}
            variant="success"
          >
            <CheckCircle2 size={10} className="inline mr-1" />
            Healthy
          </FilterButton>
        </div>
      </div>

      {/* Results Summary */}
      <div className="pt-3 border-t border-border/50">
        <div className="text-xs text-muted">
          Showing <span className="font-bold text-foreground">{filteredWarehouses.length}</span> of{' '}
          {inventoryData.warehouses.length} distribution centers
        </div>
        {hasActiveFilters && (
          <div className="mt-2 flex flex-wrap gap-1">
            {activeFilters.region && (
              <Badge variant="default" className="text-xs">
                {activeFilters.region}
                <button onClick={() => setFilter('region', null)} className="ml-1">
                  <X size={10} />
                </button>
              </Badge>
            )}
            {activeFilters.brand && (
              <Badge variant="default" className="text-xs">
                {activeFilters.brand}
                <button onClick={() => setFilter('brand', null)} className="ml-1">
                  <X size={10} />
                </button>
              </Badge>
            )}
            {activeFilters.status && (
              <Badge
                variant={
                  activeFilters.status === 'stockout' ? 'red' :
                  activeFilters.status === 'excess' ? 'amber' : 'green'
                }
                className="text-xs"
              >
                {activeFilters.status}
                <button onClick={() => setFilter('status', null)} className="ml-1">
                  <X size={10} />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
