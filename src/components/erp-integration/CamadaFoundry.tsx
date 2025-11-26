'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { sistemasERP, objetosOntologia, type ERPSystem, type OntologyObject } from '@/data/erp-integration/sistemasERP';
import { CheckCircle2, TrendingUp } from 'lucide-react';

interface CamadaFoundryProps {
  onERPHover?: (erp: ERPSystem | null) => void;
  onOntologyHover?: (obj: OntologyObject | null) => void;
  className?: string;
  animated?: boolean;
}

export function CamadaFoundry({
  onERPHover,
  onOntologyHover,
  className,
  animated = true
}: CamadaFoundryProps) {
  const [hoveredERP, setHoveredERP] = useState<ERPSystem | null>(null);
  const [hoveredOntology, setHoveredOntology] = useState<OntologyObject | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- Mounting state is intentional
  }, []);

  const handleERPHover = (erp: ERPSystem | null) => {
    setHoveredERP(erp);
    onERPHover?.(erp);
  };

  const handleOntologyHover = (obj: OntologyObject | null) => {
    setHoveredOntology(obj);
    onOntologyHover?.(obj);
  };

  return (
    <div className={cn('relative w-full h-full min-h-[500px]', className)}>
      {/* Background gradient - blue/green theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-green-500/5 rounded-xl" />

      <svg
        viewBox="0 0 800 550"
        className="w-full h-full"
        style={{ maxHeight: '650px' }}
      >
        <defs>
          {/* Success gradient */}
          <linearGradient id="successGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0066CC" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0.6" />
          </linearGradient>

          {/* Foundry layer gradient */}
          <linearGradient id="foundryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0066CC" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#0066CC" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0066CC" stopOpacity="0.3" />
          </linearGradient>

          {/* Glow effect */}
          <filter id="successGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Flow animation */}
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0066CC" stopOpacity="0">
              {animated && mounted && (
                <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
              )}
            </stop>
            <stop offset="30%" stopColor="#0066CC" stopOpacity="1">
              {animated && mounted && (
                <animate attributeName="offset" values="0.3;1.3" dur="2s" repeatCount="indefinite" />
              )}
            </stop>
            <stop offset="100%" stopColor="#0066CC" stopOpacity="0">
              {animated && mounted && (
                <animate attributeName="offset" values="1;2" dur="2s" repeatCount="indefinite" />
              )}
            </stop>
          </linearGradient>
        </defs>

        {/* PLANNING LAYER (Top) - Improved metrics */}
        <g transform="translate(200, 20)">
          <rect
            x="0"
            y="0"
            width="400"
            height="100"
            rx="12"
            fill="rgba(34, 197, 94, 0.1)"
            stroke="#22C55E"
            strokeWidth="2"
          />

          {/* Success icon */}
          <g transform="translate(20, 35)">
            <circle cx="15" cy="15" r="20" fill="rgba(34, 197, 94, 0.2)" />
            <foreignObject x="3" y="3" width="24" height="24">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </foreignObject>
          </g>

          <text x="70" y="40" className="text-sm font-bold fill-foreground">
            CAMADA DE PLANEJAMENTO
          </text>

          {/* Improved metrics */}
          <g transform="translate(70, 50)">
            <text className="text-xs fill-muted">
              <tspan x="0" y="12">Acurácia Forecast:</tspan>
              <tspan x="110" y="12" className="fill-green-500 font-bold">~87%</tspan>
            </text>
            <text className="text-xs fill-muted">
              <tspan x="170" y="12">Latência:</tspan>
              <tspan x="230" y="12" className="fill-green-500 font-bold">&lt;1h</tspan>
            </text>
          </g>

          {/* Status indicators - improved */}
          <g transform="translate(70, 70)">
            <rect x="0" y="0" width="80" height="20" rx="4" fill="rgba(34, 197, 94, 0.2)" />
            <text x="8" y="14" className="text-xs fill-green-500 font-medium">0 Rupturas</text>

            <rect x="90" y="0" width="110" height="20" rx="4" fill="rgba(34, 197, 94, 0.2)" />
            <text x="98" y="14" className="text-xs fill-green-500 font-medium">-40% Excesso</text>

            <rect x="210" y="0" width="80" height="20" rx="4" fill="rgba(59, 130, 246, 0.2)" />
            <text x="218" y="14" className="text-xs fill-blue-500 font-medium">Real-time</text>
          </g>
        </g>

        {/* UNIFIED DATA FLOW (to planning) */}
        <g>
          <path
            d="M 400 160 L 400 120"
            fill="none"
            stroke="#22C55E"
            strokeWidth="4"
            strokeLinecap="round"
          >
            {animated && mounted && (
              <animate
                attributeName="stroke-dasharray"
                values="0,100;100,0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </path>

          {/* Flow arrow */}
          <polygon
            points="400,115 395,125 405,125"
            fill="#22C55E"
          />

          {/* Check mark indicator */}
          <circle cx="400" cy="140" r="12" fill="#22C55E" filter="url(#successGlow)">
            {animated && mounted && (
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <text x="400" y="145" textAnchor="middle" className="text-xs fill-white font-bold">✓</text>
        </g>

        {/* FOUNDRY INTEGRATION LAYER (Middle) */}
        <g transform="translate(50, 170)">
          {/* Main Foundry container */}
          <rect
            x="0"
            y="0"
            width="700"
            height="140"
            rx="16"
            fill="url(#foundryGradient)"
            stroke="#0066CC"
            strokeWidth="3"
          />

          {/* Foundry header */}
          <rect
            x="0"
            y="0"
            width="700"
            height="40"
            rx="16"
            fill="#0066CC"
          />
          <rect
            x="0"
            y="24"
            width="700"
            height="16"
            fill="#0066CC"
          />

          {/* Palantir Foundry logo/text */}
          <g transform="translate(20, 10)">
            <rect x="0" y="0" width="24" height="24" rx="4" fill="white" opacity="0.2" />
            <text x="14" y="17" textAnchor="middle" className="text-sm font-bold fill-white">◆</text>
          </g>
          <text x="55" y="27" className="text-base font-bold fill-white">
            PALANTIR FOUNDRY
          </text>
          <text x="200" y="27" className="text-xs fill-white/70">
            Camada de Integração Operacional
          </text>

          {/* Real-time indicator */}
          <g transform="translate(580, 8)">
            <rect x="0" y="0" width="100" height="24" rx="12" fill="rgba(255,255,255,0.2)" />
            <circle cx="15" cy="12" r="4" fill="#22C55E">
              {animated && mounted && (
                <animate
                  attributeName="opacity"
                  values="1;0.5;1"
                  dur="1s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <text x="55" y="16" textAnchor="middle" className="text-xs fill-white font-medium">Real-time</text>
          </g>

          {/* Ontology objects */}
          <g transform="translate(30, 55)">
            <text x="0" y="0" className="text-xs fill-white/70 font-medium">ONTOLOGIA:</text>

            {objetosOntologia.slice(0, 6).map((obj, index) => {
              const x = 10 + index * 110;
              const isHovered = hoveredOntology?.id === obj.id;

              return (
                <g
                  key={obj.id}
                  transform={`translate(${x}, 15)`}
                  onMouseEnter={() => handleOntologyHover(obj)}
                  onMouseLeave={() => handleOntologyHover(null)}
                  className="cursor-pointer"
                >
                  {/* Object container */}
                  <rect
                    x="0"
                    y="0"
                    width="100"
                    height="60"
                    rx="8"
                    fill={isHovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'}
                    stroke={obj.cor}
                    strokeWidth={isHovered ? 2 : 1}
                    className="transition-all duration-200"
                  />

                  {/* Icon */}
                  <text x="50" y="25" textAnchor="middle" className="text-lg">
                    {obj.icone}
                  </text>

                  {/* Name */}
                  <text x="50" y="45" textAnchor="middle" className="text-[10px] fill-white font-medium">
                    {obj.nome}
                  </text>

                  {/* Connection count */}
                  <circle cx="85" cy="12" r="10" fill={obj.cor} />
                  <text x="85" y="16" textAnchor="middle" className="text-[9px] fill-white font-bold">
                    {obj.conexoes}
                  </text>
                </g>
              );
            })}
          </g>
        </g>

        {/* DATA FLOW LINES (ERPs to Foundry) - Clean, synchronized */}
        {sistemasERP.map((erp, index) => {
          const startX = 80 + index * 100;
          const startY = 380;
          const endX = 80 + index * 100;
          const endY = 315;

          return (
            <g key={`flow-${erp.id}`}>
              <path
                d={`M ${startX} ${startY} L ${endX} ${endY}`}
                fill="none"
                stroke="#0066CC"
                strokeWidth="3"
                strokeLinecap="round"
              >
                {animated && mounted && (
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,80;80,0"
                    dur="1.5s"
                    repeatCount="indefinite"
                    begin={`${index * 0.1}s`}
                  />
                )}
              </path>

              {/* Native connector indicator */}
              <circle
                cx={endX}
                cy={endY + 5}
                r="8"
                fill="#0066CC"
              >
                {animated && mounted && (
                  <animate
                    attributeName="r"
                    values="6;8;6"
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${index * 0.1}s`}
                  />
                )}
              </circle>
              <text x={endX} y={endY + 9} textAnchor="middle" className="text-[8px] fill-white font-bold">
                ✓
              </text>
            </g>
          );
        })}

        {/* ERP BOXES (Bottom) - Same layout as fragmented but with success indicators */}
        {sistemasERP.map((erp, index) => {
          const x = 50 + index * 100;
          const y = 400;
          const isHovered = hoveredERP?.id === erp.id;

          return (
            <g
              key={erp.id}
              transform={`translate(${x}, ${y})`}
              onMouseEnter={() => handleERPHover(erp)}
              onMouseLeave={() => handleERPHover(null)}
              className="cursor-pointer"
              style={{
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.5s ease ${index * 0.1}s`
              }}
            >
              {/* ERP box */}
              <rect
                x="0"
                y="0"
                width="80"
                height="100"
                rx="8"
                fill="rgba(30, 30, 30, 0.9)"
                stroke={isHovered ? '#0066CC' : erp.cor}
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-200"
              />

              {/* Brand color indicator */}
              <rect x="0" y="0" width="80" height="8" rx="8" fill={erp.cor} />
              <rect x="0" y="4" width="80" height="4" fill={erp.cor} />

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
              <text x="40" y="55" textAnchor="middle" className="text-xs font-bold fill-foreground">
                {erp.nome.split(' ')[0]}
              </text>
              <text x="40" y="68" textAnchor="middle" className="text-[10px] fill-muted">
                {erp.tipo.split(' ')[0]}
              </text>

              {/* Connected indicator (success) */}
              <g transform="translate(55, 75)">
                <circle cx="10" cy="10" r="10" fill="rgba(34, 197, 94, 0.3)" />
                <foreignObject x="2" y="2" width="16" height="16">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </foreignObject>
              </g>

              {/* Real-time badge */}
              <g transform="translate(5, 78)">
                <rect x="0" y="0" width="45" height="16" rx="4" fill="rgba(34, 197, 94, 0.2)" />
                <text x="22" y="12" textAnchor="middle" className="text-[8px] fill-green-500">
                  Conectado
                </text>
              </g>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(620, 400)">
          <rect
            x="0"
            y="0"
            width="160"
            height="100"
            rx="8"
            fill="rgba(30, 30, 30, 0.8)"
            stroke="rgba(0, 102, 204, 0.5)"
          />
          <text x="15" y="24" className="text-xs font-bold fill-foreground">
            Benefícios
          </text>

          <g transform="translate(15, 35)">
            <circle cx="6" cy="6" r="6" fill="#0066CC" />
            <text x="20" y="10" className="text-[10px] fill-muted">Dados unificados</text>
          </g>
          <g transform="translate(15, 55)">
            <circle cx="6" cy="6" r="6" fill="#22C55E" />
            <text x="20" y="10" className="text-[10px] fill-muted">Real-time sync</text>
          </g>
          <g transform="translate(15, 75)">
            <line x1="0" y1="6" x2="12" y2="6" stroke="#0066CC" strokeWidth="3" />
            <text x="20" y="10" className="text-[10px] fill-muted">Native connectors</text>
          </g>
        </g>
      </svg>

      {/* Ontology tooltip */}
      {hoveredOntology && (
        <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4 shadow-2xl max-w-xs z-50 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">{hoveredOntology.icone}</div>
            <div>
              <div className="font-bold text-sm">{hoveredOntology.nome}</div>
              <div className="text-xs text-blue-500">{hoveredOntology.conexoes} fontes conectadas</div>
            </div>
          </div>
          <p className="text-xs text-muted">{hoveredOntology.descricao}</p>
        </div>
      )}

      {/* Benefits panel */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-xl border border-green-500/30 rounded-xl p-4 max-w-sm">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="font-bold text-sm">Impacto da Integração</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-green-500/10 rounded-lg p-2">
            <div className="font-medium text-green-400">Tempo Integração</div>
            <div className="text-muted text-[10px]">72 semanas → 7 semanas</div>
            <div className="text-green-500 font-bold text-[10px]">-90% tempo</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-2">
            <div className="font-medium text-blue-400">Acurácia</div>
            <div className="text-muted text-[10px]">70% → 87%</div>
            <div className="text-blue-500 font-bold text-[10px]">+24% melhoria</div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-2">
            <div className="font-medium text-green-400">Latência</div>
            <div className="text-muted text-[10px]">4-24h → &lt;1h</div>
            <div className="text-green-500 font-bold text-[10px]">Real-time</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-2">
            <div className="font-medium text-blue-400">ROI Anual</div>
            <div className="text-muted text-[10px]">Economia estimada</div>
            <div className="text-blue-500 font-bold text-[10px]">R$ 181M</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CamadaFoundry;
