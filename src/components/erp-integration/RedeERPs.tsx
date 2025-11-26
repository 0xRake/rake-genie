'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { sistemasERP, problemasQualidadeDados, type ERPSystem } from '@/data/erp-integration/sistemasERP';
import { AlertTriangle, Database, TrendingDown, Clock } from 'lucide-react';

interface RedeERPsProps {
  onERPHover?: (erp: ERPSystem | null) => void;
  onERPClick?: (erp: ERPSystem) => void;
  className?: string;
  animated?: boolean;
}

interface DataLine {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  delay: number;
  hasError: boolean;
}

export function RedeERPs({
  onERPHover,
  onERPClick,
  className,
  animated = true
}: RedeERPsProps) {
  const [hoveredERP, setHoveredERP] = useState<ERPSystem | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- Mounting state is intentional
  }, []);

  const handleERPHover = (erp: ERPSystem | null) => {
    setHoveredERP(erp);
    onERPHover?.(erp);
  };

  // Generate data lines from ERPs to planning layer (stable values based on index)
  const dataLines: DataLine[] = useMemo(() => sistemasERP.map((erp, index) => ({
    id: erp.id,
    startX: 80 + index * 100,
    startY: 280,
    endX: 400,
    endY: 80,
    color: index % 2 === 0 ? '#FF6B6B' : '#FFA94D',
    delay: (index * 300) % 2000,
    hasError: index % 2 === 0
  })), []);

  return (
    <div ref={containerRef} className={cn('relative w-full h-full min-h-[500px]', className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-orange-500/5 rounded-xl" />

      <svg
        viewBox="0 0 800 500"
        className="w-full h-full"
        style={{ maxHeight: '600px' }}
      >
        <defs>
          {/* Error gradient */}
          <linearGradient id="errorGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFA94D" stopOpacity="0.4" />
          </linearGradient>

          {/* Pulse animation filter */}
          <filter id="errorGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dashed pattern for problematic lines */}
          <pattern id="dashedPattern" patternUnits="userSpaceOnUse" width="10" height="1">
            <line x1="0" y1="0" x2="5" y2="0" stroke="currentColor" strokeWidth="2" />
          </pattern>
        </defs>

        {/* PLANNING LAYER (Top) */}
        <g transform="translate(200, 20)">
          {/* Planning box background */}
          <rect
            x="0"
            y="0"
            width="400"
            height="100"
            rx="12"
            fill="rgba(107, 114, 128, 0.1)"
            stroke="#6B7280"
            strokeWidth="2"
            strokeDasharray="8 4"
          />

          {/* Warning icon */}
          <g transform="translate(20, 35)">
            <circle cx="15" cy="15" r="20" fill="rgba(239, 68, 68, 0.2)" />
            <foreignObject x="3" y="3" width="24" height="24">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </foreignObject>
          </g>

          {/* Planning title */}
          <text x="70" y="40" className="text-sm font-bold fill-foreground">
            CAMADA DE PLANEJAMENTO
          </text>

          {/* Poor metrics */}
          <g transform="translate(70, 50)">
            <text className="text-xs fill-muted">
              <tspan x="0" y="12">Acurácia Forecast:</tspan>
              <tspan x="110" y="12" className="fill-red-500 font-bold">~70%</tspan>
            </text>
            <text className="text-xs fill-muted">
              <tspan x="170" y="12">Latência:</tspan>
              <tspan x="230" y="12" className="fill-orange-500 font-bold">4-24h</tspan>
            </text>
          </g>

          {/* Status indicators */}
          <g transform="translate(70, 70)">
            <rect x="0" y="0" width="80" height="20" rx="4" fill="rgba(239, 68, 68, 0.2)" />
            <text x="8" y="14" className="text-xs fill-red-500 font-medium">45 Rupturas</text>

            <rect x="90" y="0" width="100" height="20" rx="4" fill="rgba(245, 158, 11, 0.2)" />
            <text x="98" y="14" className="text-xs fill-amber-500 font-medium">R$34M Excesso</text>
          </g>
        </g>

        {/* DATA FLOW LINES (Fragmented - choppy animation) */}
        {animated && dataLines.map((line) => (
          <g key={line.id}>
            {/* Main flow line */}
            <path
              d={`M ${line.startX} ${line.startY}
                  Q ${line.startX} ${(line.startY + line.endY) / 2}
                    ${(line.startX + line.endX) / 2} ${(line.startY + line.endY) / 2}
                  T ${line.endX} ${line.endY}`}
              fill="none"
              stroke={line.color}
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.6"
              className="animate-pulse"
              style={{
                animationDelay: `${line.delay}ms`,
                animationDuration: `${2000 + (dataLines.indexOf(line) * 150)}ms`
              }}
            />

            {/* Error indicator dots */}
            {line.hasError && (
              <circle
                cx={(line.startX + line.endX) / 2}
                cy={(line.startY + line.endY) / 2}
                r="6"
                fill="#EF4444"
                filter="url(#errorGlow)"
              >
                {mounted && (
                  <animate
                    attributeName="opacity"
                    values="1;0.3;1"
                    dur="1.5s"
                    repeatCount="indefinite"
                    begin={`${line.delay}ms`}
                  />
                )}
              </circle>
            )}
          </g>
        ))}

        {/* ERP BOXES (Bottom) */}
        {sistemasERP.map((erp, index) => {
          const x = 50 + index * 100;
          const y = 300;
          const isHovered = hoveredERP?.id === erp.id;

          return (
            <g
              key={erp.id}
              transform={`translate(${x}, ${y})`}
              onMouseEnter={() => handleERPHover(erp)}
              onMouseLeave={() => handleERPHover(null)}
              onClick={() => onERPClick?.(erp)}
              className="cursor-pointer"
              style={{
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.2s ease`
              }}
            >
              {/* ERP box shadow */}
              <rect
                x="2"
                y="2"
                width="80"
                height="100"
                rx="8"
                fill="rgba(0,0,0,0.2)"
              />

              {/* ERP box */}
              <rect
                x="0"
                y="0"
                width="80"
                height="100"
                rx="8"
                fill="rgba(30, 30, 30, 0.9)"
                stroke={erp.cor}
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-200"
              />

              {/* Brand color indicator */}
              <rect
                x="0"
                y="0"
                width="80"
                height="8"
                rx="8"
                fill={erp.cor}
              />
              <rect
                x="0"
                y="4"
                width="80"
                height="4"
                fill={erp.cor}
              />

              {/* Database icon */}
              <g transform="translate(28, 20)">
                <ellipse cx="12" cy="4" rx="12" ry="4" fill={erp.cor} opacity="0.3" />
                <rect x="0" y="4" width="24" height="16" fill={erp.cor} opacity="0.2" />
                <ellipse cx="12" cy="20" rx="12" ry="4" fill={erp.cor} opacity="0.3" />
                <ellipse cx="12" cy="4" rx="12" ry="4" fill="none" stroke={erp.cor} strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="12" ry="4" fill="none" stroke={erp.cor} strokeWidth="1.5" />
                <ellipse cx="12" cy="20" rx="12" ry="4" fill="none" stroke={erp.cor} strokeWidth="1.5" />
                <line x1="0" y1="4" x2="0" y2="20" stroke={erp.cor} strokeWidth="1.5" />
                <line x1="24" y1="4" x2="24" y2="20" stroke={erp.cor} strokeWidth="1.5" />
              </g>

              {/* ERP Name */}
              <text
                x="40"
                y="55"
                textAnchor="middle"
                className="text-xs font-bold fill-foreground"
              >
                {erp.nome.split(' ')[0]}
              </text>
              <text
                x="40"
                y="68"
                textAnchor="middle"
                className="text-[10px] fill-muted"
              >
                {erp.tipo.split(' ')[0]}
              </text>

              {/* Problem indicator */}
              <g transform="translate(55, 75)">
                <circle cx="10" cy="10" r="10" fill="rgba(239, 68, 68, 0.2)" />
                <text x="10" y="14" textAnchor="middle" className="text-xs fill-red-500">
                  !
                </text>
              </g>

              {/* Latency badge */}
              <g transform="translate(5, 78)">
                <rect x="0" y="0" width="45" height="16" rx="4" fill="rgba(245, 158, 11, 0.2)" />
                <text x="22" y="12" textAnchor="middle" className="text-[8px] fill-amber-500">
                  {erp.latencia}
                </text>
              </g>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(620, 300)">
          <rect
            x="0"
            y="0"
            width="160"
            height="120"
            rx="8"
            fill="rgba(30, 30, 30, 0.8)"
            stroke="rgba(100, 100, 100, 0.3)"
          />
          <text x="15" y="24" className="text-xs font-bold fill-foreground">
            Problemas Identificados
          </text>

          {/* Legend items */}
          <g transform="translate(15, 35)">
            <circle cx="6" cy="6" r="6" fill="#FF6B6B" />
            <text x="20" y="10" className="text-[10px] fill-muted">Dados fragmentados</text>
          </g>
          <g transform="translate(15, 55)">
            <circle cx="6" cy="6" r="6" fill="#FFA94D" />
            <text x="20" y="10" className="text-[10px] fill-muted">Alta latência</text>
          </g>
          <g transform="translate(15, 75)">
            <line x1="0" y1="6" x2="12" y2="6" stroke="#6B7280" strokeWidth="2" strokeDasharray="3 2" />
            <text x="20" y="10" className="text-[10px] fill-muted">Sync manual</text>
          </g>
          <g transform="translate(15, 95)">
            <circle cx="6" cy="6" r="4" fill="none" stroke="#EF4444" strokeWidth="2" />
            <text x="6" y="10" textAnchor="middle" className="text-[8px] fill-red-500">!</text>
            <text x="20" y="10" className="text-[10px] fill-muted">Erro/Conflito</text>
          </g>
        </g>
      </svg>

      {/* Tooltip for hovered ERP */}
      {hoveredERP && (
        <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-xl border border-border rounded-xl p-4 shadow-2xl max-w-xs z-50 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: hoveredERP.cor }}
            />
            <div>
              <div className="font-bold text-sm">{hoveredERP.nome}</div>
              <div className="text-xs text-muted">{hoveredERP.tipo}</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted">
              <Clock className="w-3 h-3" />
              <span>Latência: <span className="text-amber-500 font-medium">{hoveredERP.latencia}</span></span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Database className="w-3 h-3" />
              <span>Volume: {hoveredERP.volumeDiario}</span>
            </div>

            <div className="pt-2 border-t border-border/50">
              <div className="text-muted mb-1">Esquema SKU:</div>
              <code className="text-[10px] bg-muted/30 px-2 py-1 rounded">
                {hoveredERP.esquema.sku}
              </code>
            </div>

            <div className="pt-2">
              <div className="text-red-500 font-medium mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Problemas:
              </div>
              <ul className="space-y-1">
                {hoveredERP.problemas.map((p, i) => (
                  <li key={i} className="text-muted text-[10px] flex items-start gap-1">
                    <span className="text-red-500">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Data quality issues panel */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-xl border border-red-500/30 rounded-xl p-4 max-w-sm">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="font-bold text-sm">Impacto da Fragmentação</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {problemasQualidadeDados.slice(0, 4).map((problema, i) => (
            <div key={i} className="bg-red-500/10 rounded-lg p-2">
              <div className="font-medium text-red-400">{problema.tipo}</div>
              <div className="text-muted text-[10px]">{problema.quantidade}</div>
              <div className="text-red-500 font-bold text-[10px]">{problema.impacto}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RedeERPs;
