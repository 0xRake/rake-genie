'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Warehouse, getWarehouseStatus } from '@/data/natura/inventory';
import { formatBRLCompact, getStatusBorderClass } from '@/lib/natura/formatting';

interface BrazilMapProps {
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse | null;
  onWarehouseSelect: (warehouse: Warehouse) => void;
  onWarehouseHover: (warehouse: Warehouse | null) => void;
}

// Convert lat/lng to SVG coordinates
function latLngToSvg(lat: number, lng: number): { x: number; y: number } {
  // Brazil bounding box
  const minLat = -33.75;  // South
  const maxLat = 5.27;    // North
  const minLng = -73.99;  // West
  const maxLng = -34.79;  // East

  // Map to SVG viewBox
  const x = ((lng - minLng) / (maxLng - minLng)) * 400 + 50;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 450 + 25;

  return { x, y };
}

// Get color for warehouse status
function getMarkerColor(status: 'healthy' | 'excess' | 'stockout'): string {
  switch (status) {
    case 'healthy': return '#22c55e';
    case 'excess': return '#f59e0b';
    case 'stockout': return '#ef4444';
  }
}

// Get brand color
function getBrandColor(brand: Warehouse['brand']): string {
  switch (brand) {
    case 'Natura': return '#00A859';
    case 'Avon': return '#ED1164';
    case 'Aesop': return '#2D2D2D';
    case 'The Body Shop': return '#006B54';
  }
}

// Brazil outline - simplified but recognizable
const BRAZIL_PATH = `
  M 380 55
  Q 410 50 435 75
  Q 460 100 470 140
  Q 478 180 475 220
  Q 472 260 465 300
  Q 455 340 435 375
  Q 415 410 385 435
  Q 350 458 310 470
  Q 270 480 230 475
  Q 190 470 155 455
  Q 120 440 95 410
  Q 70 380 60 340
  Q 50 300 55 260
  Q 60 220 75 185
  Q 90 150 115 120
  Q 145 90 185 70
  Q 225 55 270 50
  Q 320 48 380 55
  Z
`;

// Region areas for subtle highlighting
const REGIONS = [
  { id: 'norte', path: 'M 90 90 Q 180 70 280 85 Q 340 100 320 160 Q 280 200 180 190 Q 100 170 90 90', color: 'rgba(34, 197, 94, 0.04)' },
  { id: 'nordeste', path: 'M 320 80 Q 420 65 470 140 Q 475 220 440 280 Q 380 320 320 280 Q 310 200 320 80', color: 'rgba(245, 158, 11, 0.04)' },
  { id: 'centro-oeste', path: 'M 180 200 Q 300 180 340 240 Q 360 320 300 380 Q 220 400 160 340 Q 140 270 180 200', color: 'rgba(59, 130, 246, 0.04)' },
  { id: 'sudeste', path: 'M 300 320 Q 400 300 440 360 Q 450 420 400 450 Q 340 470 290 440 Q 270 380 300 320', color: 'rgba(168, 85, 247, 0.04)' },
  { id: 'sul', path: 'M 220 430 Q 300 420 340 460 Q 350 500 300 520 Q 240 530 200 500 Q 190 460 220 430', color: 'rgba(236, 72, 153, 0.04)' },
];

export function BrazilMap({
  warehouses,
  selectedWarehouse,
  onWarehouseSelect,
  onWarehouseHover
}: BrazilMapProps) {
  const [hoveredWarehouse, setHoveredWarehouse] = useState<Warehouse | null>(null);
  const [mounted, setMounted] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWarehouseClick = useCallback((warehouse: Warehouse) => {
    onWarehouseSelect(warehouse);
  }, [onWarehouseSelect]);

  const handleWarehouseMouseEnter = useCallback((warehouse: Warehouse, event: React.MouseEvent) => {
    setHoveredWarehouse(warehouse);
    onWarehouseHover(warehouse);
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
  }, [onWarehouseHover]);

  const handleWarehouseMouseLeave = useCallback(() => {
    setHoveredWarehouse(null);
    onWarehouseHover(null);
  }, [onWarehouseHover]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-500/5 rounded-xl" />

      <svg
        viewBox="0 0 530 560"
        className="w-full h-full"
        style={{ maxHeight: '600px' }}
      >
        <defs>
          {/* Gradient for Brazil outline */}
          <linearGradient id="brazilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
          </linearGradient>

          {/* Glow filter for selected/hovered markers */}
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Drop shadow for markers */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Region fills */}
        {REGIONS.map(region => (
          <path
            key={region.id}
            d={region.path}
            fill={region.color}
            className="transition-opacity duration-500"
          />
        ))}

        {/* Brazil outline with glow */}
        <path
          d={BRAZIL_PATH}
          fill="rgba(100, 100, 100, 0.02)"
          stroke="url(#brazilGradient)"
          strokeWidth="2.5"
          className="text-foreground"
        />

        {/* Grid lines for visual interest */}
        {[100, 200, 300, 400].map(x => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="30"
            x2={x}
            y2="530"
            stroke="currentColor"
            strokeOpacity="0.03"
            strokeDasharray="4 8"
          />
        ))}
        {[100, 200, 300, 400, 500].map(y => (
          <line
            key={`h-${y}`}
            x1="40"
            y1={y}
            x2="490"
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.03"
            strokeDasharray="4 8"
          />
        ))}

        {/* Warehouse markers - using proper SVG positioning */}
        {warehouses.map((warehouse, index) => {
          const pos = latLngToSvg(warehouse.location.lat, warehouse.location.lng);
          const status = getWarehouseStatus(warehouse);
          const markerColor = getMarkerColor(status);
          const brandColor = getBrandColor(warehouse.brand);
          const isSelected = selectedWarehouse?.id === warehouse.id;
          const isHovered = hoveredWarehouse?.id === warehouse.id;
          const isActive = isSelected || isHovered;

          return (
            <g
              key={warehouse.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={() => handleWarehouseClick(warehouse)}
              onMouseEnter={(e) => handleWarehouseMouseEnter(warehouse, e)}
              onMouseLeave={handleWarehouseMouseLeave}
              className="cursor-pointer"
              style={{
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.5s ease ${index * 0.08}s`
              }}
            >
              {/* Pulse ring for stockout - animated */}
              {status === 'stockout' && (
                <>
                  <circle
                    cx={0}
                    cy={0}
                    r={22}
                    fill="none"
                    stroke={markerColor}
                    strokeWidth={2}
                    opacity={0.3}
                  >
                    <animate
                      attributeName="r"
                      from="12"
                      to="28"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}

              {/* Selection/hover ring */}
              {isActive && (
                <>
                  <circle
                    cx={0}
                    cy={0}
                    r={20}
                    fill="none"
                    stroke={markerColor}
                    strokeWidth={2}
                    opacity={0.6}
                  >
                    <animate
                      attributeName="r"
                      values="18;22;18"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={0}
                    cy={0}
                    r={26}
                    fill="none"
                    stroke={markerColor}
                    strokeWidth={1}
                    opacity={0.3}
                  />
                </>
              )}

              {/* Outer glow circle */}
              <circle
                cx={0}
                cy={0}
                r={isActive ? 16 : 13}
                fill={markerColor}
                opacity={0.25}
                filter={isActive ? 'url(#glow)' : undefined}
                style={{ transition: 'r 0.2s ease' }}
              />

              {/* Main marker circle */}
              <circle
                cx={0}
                cy={0}
                r={isActive ? 12 : 10}
                fill={markerColor}
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={2}
                filter="url(#shadow)"
                style={{ transition: 'r 0.2s ease' }}
              />

              {/* Brand indicator dot */}
              <circle
                cx={0}
                cy={0}
                r={4}
                fill={brandColor}
                stroke="white"
                strokeWidth={1}
              />

              {/* Status warning indicator */}
              {status === 'stockout' && (
                <circle
                  cx={0}
                  cy={-16}
                  r={4}
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth={1}
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.4;1"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Warehouse name label on hover/select */}
              {isActive && (
                <text
                  x={0}
                  y={32}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="currentColor"
                  className="pointer-events-none"
                >
                  {warehouse.name.split(' ')[0]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Enhanced Tooltip */}
      {hoveredWarehouse && (
        <div
          className={cn(
            'fixed z-50 bg-background/95 backdrop-blur-xl border-2 rounded-xl shadow-2xl p-4 min-w-[260px]',
            'transform -translate-x-1/2 -translate-y-full pointer-events-none',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            getStatusBorderClass(getWarehouseStatus(hoveredWarehouse))
          )}
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 15
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-5 h-5 rounded-full ring-2 ring-white/20 shadow-lg"
              style={{ backgroundColor: getBrandColor(hoveredWarehouse.brand) }}
            />
            <div>
              <div className="font-semibold text-sm">{hoveredWarehouse.name}</div>
              <div className="text-xs text-muted">{hoveredWarehouse.brand} • {hoveredWarehouse.region}</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/30">
              <span className="text-muted">Total Inventory</span>
              <span className="font-bold text-base">{formatBRLCompact(hoveredWarehouse.metrics.totalValue)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-amber-500/10">
              <span className="text-muted">Excess ({hoveredWarehouse.metrics.excessSKUs} SKUs)</span>
              <span className="font-bold text-amber-500">{formatBRLCompact(hoveredWarehouse.metrics.excessValue)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-red-500/10">
              <span className="text-muted">Risk ({hoveredWarehouse.metrics.stockoutSKUs} SKUs)</span>
              <span className="font-bold text-red-500">{formatBRLCompact(hoveredWarehouse.metrics.stockoutRisk)}</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-border/50 text-center text-xs text-primary font-medium">
            Click to view SKU details →
          </div>

          {/* Tooltip arrow */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-background/95" />
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-xl border border-border/50 rounded-xl p-4 text-xs shadow-xl">
        <div className="font-semibold mb-3 text-sm">Inventory Status</div>
        <div className="space-y-2">
          {[
            { color: '#22c55e', label: 'Healthy', desc: '14-180 days' },
            { color: '#f59e0b', label: 'Excess', desc: '>180 days' },
            { color: '#ef4444', label: 'Stockout', desc: '<14 days' }
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-3.5 h-3.5 rounded-full shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium">{item.label}</span>
              <span className="text-muted text-[10px]">({item.desc})</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 mt-3 pt-3">
          <div className="font-semibold mb-2">Brands</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {[
              { color: '#00A859', label: 'Natura' },
              { color: '#ED1164', label: 'Avon' },
              { color: '#2D2D2D', label: 'Aesop' },
              { color: '#006B54', label: 'TBS' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive hint */}
      {!selectedWarehouse && mounted && (
        <div className="absolute top-4 right-4 bg-primary/10 backdrop-blur-xl border border-primary/30 rounded-lg px-4 py-2 text-xs text-primary font-medium shadow-lg">
          <span className="mr-2">👆</span>
          Click a warehouse to explore inventory
        </div>
      )}
    </div>
  );
}
