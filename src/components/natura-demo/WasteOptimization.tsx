'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  optimizationData,
  Scenario,
  mockExecutionResult,
  mockImpactMetrics
} from '@/data/natura/optimization';
import {
  formatBRLCompact,
  formatNumber,
  formatDays,
  formatUnits,
  formatROI,
  formatDistance,
  formatConsultants,
  formatDateBR
} from '@/lib/natura/formatting';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Lightbulb,
  Play,
  CheckCircle2,
  X,
  Truck,
  Factory,
  Ban,
  Trophy,
  RefreshCw,
  FileText
} from 'lucide-react';

interface WasteOptimizationProps {
  onScenarioExecuted: () => void;
}

export function WasteOptimization({ onScenarioExecuted }: WasteOptimizationProps) {
  const [simulationRun, setSimulationRun] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);
  const [executed, setExecuted] = useState(false);
  const [showImpactDashboard, setShowImpactDashboard] = useState(false);

  const { wasteDetection, scenarios, recommendation } = optimizationData;

  const handleSimulate = useCallback(async () => {
    setSimulating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSimulating(false);
    setSimulationRun(true);
    setSelectedScenario(scenarios.find(s => s.id === recommendation.scenarioId) || null);
  }, [scenarios, recommendation]);

  const handleExecuteScenario = useCallback(async () => {
    setShowConfirmModal(false);
    setExecuting(true);

    // Simulate execution steps
    const steps = [
      'Transfer Order criado: SAP-TO-2024-11-0847',
      'Transportadora alocada: Braspress (tracking #BR8472934)',
      'Notificações enviadas: 2 warehouse managers',
      'Updating o9 forecasts...',
      'ETA arrival Recife: 04/12/2024'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setExecutionStep(i + 1);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setExecuting(false);
    setExecuted(true);
    setShowImpactDashboard(true);
    onScenarioExecuted();
  }, [onScenarioExecuted]);

  const getScenarioIcon = (type: Scenario['type']) => {
    switch (type) {
      case 'transfer': return <Truck size={20} />;
      case 'production': return <Factory size={20} />;
      case 'noAction': return <Ban size={20} />;
    }
  };

  const getScenarioColor = (scenario: Scenario) => {
    if (scenario.id === recommendation.scenarioId) {
      return 'border-green-500 border-2 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent shadow-lg shadow-green-500/10';
    }
    if (scenario.type === 'noAction') {
      return 'border-red-500/50 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent';
    }
    return 'border-border bg-gradient-to-br from-muted/10 to-transparent';
  };

  return (
    <div className="h-full flex gap-4 p-4">
      {/* Column 1: Waste Detection Cards */}
      <div className="w-80 flex flex-col gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Waste Detection
          </h3>
        </Card>

        {/* Excess Inventory Card */}
        <Card className="p-4 border-amber-500/50 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-amber-500" />
            <span className="font-semibold text-sm">EXCESS INVENTORY</span>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted">SKU:</span>{' '}
              <span className="font-medium">{wasteDetection.excessInventory.productName}</span>
            </div>
            <div>
              <span className="text-muted">Local:</span>{' '}
              <span>{wasteDetection.excessInventory.warehouseName}</span>
            </div>
            <div className="pt-2 border-t space-y-1">
              <div className="flex justify-between">
                <span className="text-muted">Quantidade:</span>
                <span className="font-medium">{formatUnits(wasteDetection.excessInventory.quantity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Cobertura:</span>
                <span className="font-medium text-amber-500">{formatDays(wasteDetection.excessInventory.coverageDays)} (target: 30-60)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Valor Parado:</span>
                <span className="font-bold">{formatBRLCompact(wasteDetection.excessInventory.valueLocked)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tempo Excesso:</span>
                <span>{wasteDetection.excessInventory.timeExcessMonths} meses</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="text-xs text-red-500">
                Risco: Markdown {wasteDetection.excessInventory.markdownRisk * 100}% próximos 90 dias
              </div>
              <div className="text-xs font-medium">
                Perda Potencial: {formatBRLCompact(wasteDetection.excessInventory.potentialLoss)}
              </div>
            </div>
          </div>
        </Card>

        {/* Stockout Risk Card */}
        <Card className="p-4 border-red-500/50 bg-red-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red-500" />
            <span className="font-semibold text-sm">STOCKOUT RISK</span>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted">SKU:</span>{' '}
              <span className="font-medium">{wasteDetection.stockoutRisk.productName}</span>
            </div>
            <div>
              <span className="text-muted">Local:</span>{' '}
              <span>{wasteDetection.stockoutRisk.warehouseName}</span>
            </div>
            <div className="pt-2 border-t space-y-1">
              <div className="flex justify-between">
                <span className="text-muted">Quantidade:</span>
                <span className="font-medium">{formatUnits(wasteDetection.stockoutRisk.quantity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Cobertura:</span>
                <span className="font-medium text-red-500">{formatDays(wasteDetection.stockoutRisk.coverageDays)} (crítico &lt;14)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Demanda Prevista:</span>
                <span>{formatNumber(wasteDetection.stockoutRisk.demandForecast)} units/30 dias</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-muted">Vendas em Risco:</span>
                <span className="font-bold text-red-500">{formatBRLCompact(wasteDetection.stockoutRisk.salesAtRisk)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Consultores Impactados:</span>
                <span>{wasteDetection.stockoutRisk.consultantsImpacted} reps</span>
              </div>
              <div className="text-xs text-red-500 mt-1">
                ⚠️ Ruptura em {wasteDetection.stockoutRisk.daysUntilStockout} dias
              </div>
            </div>
          </div>
        </Card>

        {/* Opportunity Card */}
        <Card className="p-4 border-primary/50 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-primary" />
            <span className="font-semibold text-sm">OPTIMIZATION OPPORTUNITY</span>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-muted">
              Detectado: Excesso SP + Déficit Nordeste
            </p>
            <ul className="text-xs space-y-1">
              <li>• SP tem 42,3k unidades paradas</li>
              <li>• Nordeste precisa 7,5k (gap)</li>
            </ul>
            <div className="pt-2 border-t">
              <div className="text-xs text-muted">Ação: Transfer SP → Recife</div>
              <div className="font-bold text-primary">
                Valor Potencial: {formatBRLCompact(2303238)}
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full mt-2"
              onClick={handleSimulate}
              disabled={simulating || simulationRun}
            >
              {simulating ? (
                <>
                  <RefreshCw size={14} className="mr-2 animate-spin" />
                  Simulando...
                </>
              ) : simulationRun ? (
                <>
                  <CheckCircle2 size={14} className="mr-2" />
                  Simulado
                </>
              ) : (
                <>
                  <Play size={14} className="mr-2" />
                  Simulate Transfer Scenarios
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Column 2: Simulation Engine */}
      <div className="flex-1 flex flex-col gap-4">
        {!simulationRun ? (
          <Card className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Play size={40} className="text-primary/60" />
              </div>
              <p className="text-lg font-medium mb-2">Simulation Engine Ready</p>
              <p className="text-sm text-muted max-w-sm">
                Click &quot;Simulate Transfer Scenarios&quot; in the Opportunity card to generate optimization scenarios with ROI analysis.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted">
                <div className="flex items-center gap-1">
                  <Truck size={14} />
                  <span>Transfer</span>
                </div>
                <div className="flex items-center gap-1">
                  <Factory size={14} />
                  <span>Production</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ban size={14} />
                  <span>No Action</span>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-2">Cenários Simulados</h3>
              <p className="text-xs text-muted">3 cenários gerados para comparação ROI</p>
            </Card>

            <div className="flex-1 grid grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${getScenarioColor(scenario)} ${
                    selectedScenario?.id === scenario.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedScenario(scenario)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getScenarioIcon(scenario.type)}
                      <span className="font-semibold text-sm">{scenario.name}</span>
                    </div>
                    {scenario.id === recommendation.scenarioId && (
                      <Badge variant="green" className="text-xs">
                        <Trophy size={10} className="mr-1" />
                        RECOMMENDED
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted mb-4">{scenario.description}</p>

                  {scenario.type !== 'noAction' && scenario.action && (
                    <div className="text-xs space-y-1 mb-3 p-2 bg-muted/30 rounded">
                      <div className="font-semibold">Ação:</div>
                      {scenario.action.transferQuantity && (
                        <div>• Transferir {formatNumber(scenario.action.transferQuantity)} unidades</div>
                      )}
                      {scenario.action.productionQuantity && (
                        <div>• Produzir {formatNumber(scenario.action.productionQuantity)} unidades</div>
                      )}
                      {scenario.action.originName && (
                        <div>• Origem: {scenario.action.originName}</div>
                      )}
                      {scenario.action.destinationName && (
                        <div>• Destino: {scenario.action.destinationName}</div>
                      )}
                      {scenario.action.modal && (
                        <div>• Modal: {scenario.action.modal} ({formatDistance(scenario.action.distance || 0)})</div>
                      )}
                    </div>
                  )}

                  {scenario.costs && (
                    <div className="text-xs space-y-1 mb-3">
                      <div className="font-semibold">Custos:</div>
                      {scenario.costs.transport && (
                        <div className="flex justify-between">
                          <span className="text-muted">Transport:</span>
                          <span>{formatBRLCompact(scenario.costs.transport)}</span>
                        </div>
                      )}
                      {scenario.costs.handling && (
                        <div className="flex justify-between">
                          <span className="text-muted">Handling:</span>
                          <span>{formatBRLCompact(scenario.costs.handling)}</span>
                        </div>
                      )}
                      {scenario.costs.rawMaterials && (
                        <div className="flex justify-between">
                          <span className="text-muted">Raw Materials:</span>
                          <span>{formatBRLCompact(scenario.costs.rawMaterials)}</span>
                        </div>
                      )}
                      {scenario.costs.labor && (
                        <div className="flex justify-between">
                          <span className="text-muted">Labor:</span>
                          <span>{formatBRLCompact(scenario.costs.labor)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total:</span>
                        <span>{formatBRLCompact(scenario.costs.total)}</span>
                      </div>
                    </div>
                  )}

                  {scenario.benefits && (
                    <div className="text-xs space-y-1 mb-3">
                      <div className="font-semibold text-green-500">Benefícios:</div>
                      {scenario.benefits.avoidMarkdown && (
                        <div className="flex justify-between">
                          <span className="text-muted">Evitar Markdown:</span>
                          <span className="text-green-500">{formatBRLCompact(scenario.benefits.avoidMarkdown)}</span>
                        </div>
                      )}
                      {scenario.benefits.captureSales && (
                        <div className="flex justify-between">
                          <span className="text-muted">Capturar Vendas:</span>
                          <span className="text-green-500">{formatBRLCompact(scenario.benefits.captureSales)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total:</span>
                        <span className="text-green-500">{formatBRLCompact(scenario.benefits.total)}</span>
                      </div>
                    </div>
                  )}

                  {scenario.consequences && (
                    <div className="text-xs space-y-1 mb-3">
                      <div className="font-semibold text-red-500">Consequências:</div>
                      {scenario.consequences.markdownLoss && (
                        <div className="flex justify-between">
                          <span className="text-muted">Markdown Loss:</span>
                          <span className="text-red-500">-{formatBRLCompact(scenario.consequences.markdownLoss)}</span>
                        </div>
                      )}
                      {scenario.consequences.lostSales && (
                        <div className="flex justify-between">
                          <span className="text-muted">Lost Sales:</span>
                          <span className="text-red-500">-{formatBRLCompact(scenario.consequences.lostSales)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total Loss:</span>
                        <span className="text-red-500">-{formatBRLCompact(scenario.consequences.totalLoss)}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted">Net Value:</span>
                      <span className={`font-bold ${scenario.results.netValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {scenario.results.netValue >= 0 ? '' : '-'}{formatBRLCompact(Math.abs(scenario.results.netValue))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted">ROI:</span>
                      <span className={`font-bold text-lg ${scenario.results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatROI(scenario.results.roi)}
                        {scenario.id === recommendation.scenarioId && ' 🏆'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted">Timeline:</span>
                      <span className="text-xs">{scenario.results.timeline > 0 ? formatDays(scenario.results.timeline) : 'N/A'}</span>
                    </div>
                  </div>

                  {scenario.id === recommendation.scenarioId && !executed && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowConfirmModal(true);
                      }}
                    >
                      <Play size={14} className="mr-2" />
                      Execute Scenario 1
                    </Button>
                  )}

                  {scenario.id === recommendation.scenarioId && executed && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowImpactDashboard(true);
                      }}
                    >
                      <TrendingUp size={14} className="mr-2" />
                      View Real-Time Impact
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Column 3: ROI Comparison (only shown after simulation) */}
      {simulationRun && (
        <div className="w-72 flex flex-col gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Comparative Analysis</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Metric</th>
                  <th className="text-right py-2">C1</th>
                  <th className="text-right py-2">C2</th>
                  <th className="text-right py-2">C3</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-muted">Cost</td>
                  <td className="text-right">{formatBRLCompact(scenarios[0].costs?.total || 0)}</td>
                  <td className="text-right">{formatBRLCompact(scenarios[1].costs?.total || 0)}</td>
                  <td className="text-right">R$ 0</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted">Benefit</td>
                  <td className="text-right text-green-500">{formatBRLCompact(scenarios[0].benefits?.total || 0)}</td>
                  <td className="text-right text-green-500">{formatBRLCompact(scenarios[1].benefits?.total || 0)}</td>
                  <td className="text-right">R$ 0</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted">Net</td>
                  <td className="text-right font-medium text-green-500">{formatBRLCompact(scenarios[0].results.netValue)}</td>
                  <td className="text-right font-medium text-green-500">{formatBRLCompact(scenarios[1].results.netValue)}</td>
                  <td className="text-right font-medium text-red-500">-{formatBRLCompact(Math.abs(scenarios[2].results.netValue))}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted">ROI</td>
                  <td className="text-right font-bold text-green-500">{formatROI(scenarios[0].results.roi)} 🏆</td>
                  <td className="text-right">{formatROI(scenarios[1].results.roi)}</td>
                  <td className="text-right text-red-500">-100%</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted">Timeline</td>
                  <td className="text-right">{formatDays(scenarios[0].results.timeline)}</td>
                  <td className="text-right">{formatDays(scenarios[1].results.timeline)}</td>
                  <td className="text-right">N/A</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card className="p-4 border-green-500/50 bg-green-500/5">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Trophy size={16} className="text-green-500" />
              Recommendation
            </h3>
            <p className="text-xs text-muted mb-2">Execute Cenário 1</p>
            <ul className="text-xs space-y-1">
              <li>• Highest ROI (13,9x vs 1,2x)</li>
              <li>• Fastest execution (8 days vs 18 days)</li>
              <li>• Solves 2 problems simultaneously</li>
              <li>• Uses existing inventory (sustentabilidade)</li>
            </ul>
          </Card>

          {executed && (
            <Card className="p-4 border-primary">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                Execution Complete
              </h3>
              <div className="text-xs space-y-1 text-muted">
                <div>Transfer Order: {mockExecutionResult.transferOrderId}</div>
                <div>Tracking: {mockExecutionResult.trackingNumber}</div>
                <div>ETA: {formatDateBR(mockExecutionResult.etaArrival)}</div>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-3"
                onClick={() => onScenarioExecuted()}
              >
                <FileText size={14} className="mr-2" />
                Generate Executive Report
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[500px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Confirmar Execução Cenário 1</h3>
              <button onClick={() => setShowConfirmModal(false)}>
                <X size={20} className="text-muted hover:text-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold mb-2">Ação:</div>
                <p className="text-sm">
                  Transferir {formatNumber(selectedScenario.action?.transferQuantity || 0)} unidades Chronos
                </p>
                <p className="text-sm text-muted">
                  {selectedScenario.action?.originName} → {selectedScenario.action?.destinationName}
                </p>
              </div>

              <div className="text-sm">
                <div className="font-semibold mb-2">Sistema irá:</div>
                <ol className="list-decimal list-inside space-y-1 text-muted">
                  <li>Gerar Transfer Order SAP</li>
                  <li>Alocar transportadora (parceiro Braspress)</li>
                  <li>Notificar warehouse managers SP + PE</li>
                  <li>Atualizar inventory projections o9</li>
                  <li>Track shipment real-time</li>
                </ol>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-2 bg-muted/30 rounded text-center">
                  <div className="text-muted">Custo</div>
                  <div className="font-bold">{formatBRLCompact(selectedScenario.costs?.total || 0)}</div>
                </div>
                <div className="p-2 bg-green-500/10 rounded text-center">
                  <div className="text-muted">Value Capture</div>
                  <div className="font-bold text-green-500">{formatBRLCompact(selectedScenario.results.netValue)}</div>
                </div>
                <div className="p-2 bg-primary/10 rounded text-center">
                  <div className="text-muted">Timeline</div>
                  <div className="font-bold">{formatDays(selectedScenario.results.timeline)}</div>
                </div>
              </div>

              <div className="text-xs text-muted">
                Aprovador: Leonardo Romano - VP Supply Chain
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="secondary" onClick={() => setShowConfirmModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleExecuteScenario} className="flex-1">
                  <CheckCircle2 size={16} className="mr-2" />
                  Confirm & Execute
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Execution Progress Modal */}
      {executing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[450px] p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <RefreshCw size={20} className="animate-spin text-primary" />
              Executando Cenário 1
            </h3>
            <div className="space-y-3">
              {[
                'Transfer Order criado: SAP-TO-2024-11-0847',
                'Transportadora alocada: Braspress (tracking #BR8472934)',
                'Notificações enviadas: 2 warehouse managers',
                'Updating o9 forecasts...',
                'ETA arrival Recife: 04/12/2024'
              ].map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm ${
                    index < executionStep ? 'text-green-500' : 'text-muted'
                  }`}
                >
                  {index < executionStep ? (
                    <CheckCircle2 size={16} />
                  ) : index === executionStep - 1 ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Impact Dashboard Modal */}
      {showImpactDashboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[600px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp size={20} className="text-green-500" />
                Impacto Decisão (Real-Time)
              </h3>
              <button onClick={() => setShowImpactDashboard(false)}>
                <X size={20} className="text-muted hover:text-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold mb-2">São Paulo Warehouse:</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted">Inventory Chronos:</span>
                    <span>{formatNumber(mockImpactMetrics.spWarehouse.inventoryBefore)} → {formatNumber(mockImpactMetrics.spWarehouse.inventoryAfter)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Coverage:</span>
                    <span>{mockImpactMetrics.spWarehouse.coverageBefore} dias → {mockImpactMetrics.spWarehouse.coverageAfter} dias ✓</span>
                  </div>
                  <div className="text-green-500 text-xs">Excess risk: Eliminated</div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold mb-2">Recife Warehouse:</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted">Inventory Chronos:</span>
                    <span>{formatNumber(mockImpactMetrics.recifeWarehouse.inventoryBefore)} → {formatNumber(mockImpactMetrics.recifeWarehouse.inventoryAfter)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Coverage:</span>
                    <span>{mockImpactMetrics.recifeWarehouse.coverageBefore} dias → {mockImpactMetrics.recifeWarehouse.coverageAfter} dias ✓</span>
                  </div>
                  <div className="text-green-500 text-xs">Stockout risk: Eliminated</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 mb-4">
              <div className="font-semibold mb-2 text-green-500">Financial Impact:</div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-muted text-xs">Value Captured</div>
                  <div className="font-bold">{formatBRLCompact(mockImpactMetrics.financial.valueCaptured)}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted text-xs">Investment</div>
                  <div className="font-bold">{formatBRLCompact(mockImpactMetrics.financial.investment)}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted text-xs">Net Value</div>
                  <div className="font-bold text-green-500">{formatBRLCompact(mockImpactMetrics.financial.netValue)}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted text-xs">Final ROI</div>
                  <div className="font-bold text-green-500">{formatROI(mockImpactMetrics.financial.finalRoi)}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg mb-4">
              <div className="font-semibold mb-2">Consultant Impact:</div>
              <div className="text-sm space-y-1">
                <div>{formatConsultants(mockImpactMetrics.consultant.repsSecured)} Nordeste: Inventory secured</div>
                <div>NPS projected: +{mockImpactMetrics.consultant.npsImpact} points (vs stockout scenario)</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowImpactDashboard(false)} className="flex-1">
                Close
              </Button>
              <Button variant="primary" onClick={() => { setShowImpactDashboard(false); onScenarioExecuted(); }} className="flex-1">
                <FileText size={16} className="mr-2" />
                Generate Executive Report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
