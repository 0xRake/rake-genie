'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  conflictsData,
  Conflict,
  ConflictSource
} from '@/data/natura/conflicts';
import {
  formatBRL,
  formatSimilarity,
  formatConfidence,
  formatVariance,
  formatDateBR,
  getPriorityBadgeVariant,
  getRecommendationText
} from '@/lib/natura/formatting';
import {
  GitMerge,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Database,
  Sparkles,
  RefreshCw,
  ArrowRight,
  X,
  Zap,
  AlertTriangle,
  Check
} from 'lucide-react';

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border',
      'animate-in slide-in-from-right-5 fade-in duration-300',
      type === 'success'
        ? 'bg-green-500/10 border-green-500/30 text-green-500'
        : 'bg-primary/10 border-primary/30 text-primary'
    )}>
      {type === 'success' ? <CheckCircle2 size={20} /> : <Sparkles size={20} />}
      <span className="font-medium">{message}</span>
    </div>
  );
}

interface ConflictResolutionProps {
  initialSku?: string;
  onBatchMergeComplete: () => void;
}

export function ConflictResolution({
  initialSku,
  onBatchMergeComplete
}: ConflictResolutionProps) {
  const [conflicts, setConflicts] = useState<Conflict[]>(conflictsData.conflicts);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [statistics, setStatistics] = useState(conflictsData.statistics);
  const [merging, setMerging] = useState(false);
  const [batchMerging, setBatchMerging] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Select first conflict or one matching initialSku
  useEffect(() => {
    if (initialSku) {
      const matchingConflict = conflicts.find(c =>
        c.sources.some(s => s.sku.includes(initialSku.split('-').slice(1).join('-')))
      );
      if (matchingConflict) {
        setSelectedConflict(matchingConflict);
        return;
      }
    }
    if (conflicts.length > 0 && !selectedConflict) {
      setSelectedConflict(conflicts.filter(c => !c.resolved)[0]);
    }
  }, [initialSku, conflicts, selectedConflict]);

  const handleMerge = useCallback(async (conflict: Conflict) => {
    setMerging(true);

    // Simulate merge animation
    await new Promise(resolve => setTimeout(resolve, 800));

    // Update conflict as resolved
    const updatedConflicts = conflicts.map(c =>
      c.id === conflict.id
        ? { ...c, resolved: true, resolvedAt: new Date().toISOString() }
        : c
    );

    setConflicts(updatedConflicts);
    setStatistics(prev => ({
      ...prev,
      pending: prev.pending - 1,
      resolved: prev.resolved + 1
    }));

    setMerging(false);
    setToast({ message: `Golden Record created: ${conflict.goldenRecord.description}`, type: 'success' });
    setShowImpactModal(true);
  }, [conflicts]);

  const handleCloseImpactModal = useCallback(() => {
    setShowImpactModal(false);
    // Select next unresolved conflict
    const nextConflict = conflicts.find(c => !c.resolved && c.id !== selectedConflict?.id);
    if (nextConflict) {
      setSelectedConflict(nextConflict);
    }
  }, [conflicts, selectedConflict]);

  const handleBatchMerge = useCallback(async () => {
    setShowBatchConfirm(false);
    setBatchMerging(true);
    setBatchProgress(0);

    const mergeableCount = statistics.autoMergeable;
    const batchSize = 50;
    const batches = Math.ceil(mergeableCount / batchSize);

    for (let i = 0; i < batches; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setBatchProgress(Math.min(((i + 1) / batches) * 100, 100));
    }

    // Update all auto-mergeable conflicts
    const updatedConflicts = conflicts.map(c =>
      c.mlAnalysis.recommendation === 'merge' && !c.resolved
        ? { ...c, resolved: true, resolvedAt: new Date().toISOString() }
        : c
    );

    setConflicts(updatedConflicts);
    setStatistics(prev => ({
      ...prev,
      pending: prev.requiresReview,
      resolved: prev.resolved + prev.autoMergeable,
      autoMergeable: 0
    }));

    setBatchMerging(false);
    setToast({ message: `${statistics.autoMergeable} conflicts auto-merged successfully!`, type: 'success' });
    onBatchMergeComplete();
  }, [conflicts, statistics, onBatchMergeComplete]);

  const pendingConflicts = conflicts.filter(c => !c.resolved);
  const resolvedConflicts = conflicts.filter(c => c.resolved);

  const getSystemIcon = (system: ConflictSource['system']) => {
    switch (system) {
      case 'SAP Natura': return '🟢';
      case 'SAP Avon': return '🩷';
      case 'Oracle Aesop': return '⚫';
      case 'SAP TBS': return '🌿';
    }
  };

  return (
    <div className="h-full flex gap-4 p-4">
      {/* Left Panel: Conflict Queue */}
      <div className="w-80 flex flex-col gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertCircle size={16} />
            Conflitos Pendentes
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="p-2 rounded bg-amber-500/10 text-center">
              <div className="text-lg font-bold text-amber-500">{statistics.pending}</div>
              <div className="text-muted">Pendentes</div>
            </div>
            <div className="p-2 rounded bg-green-500/10 text-center">
              <div className="text-lg font-bold text-green-500">{statistics.resolved}</div>
              <div className="text-muted">Resolvidos</div>
            </div>
          </div>

          {statistics.autoMergeable > 0 && (
            <Button
              variant="primary"
              size="sm"
              className="w-full mb-4"
              onClick={() => setShowBatchConfirm(true)}
            >
              <Zap size={14} className="mr-1" />
              Auto-Merge {statistics.autoMergeable} High Confidence
            </Button>
          )}
        </Card>

        <Card className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="text-xs text-muted mb-2">
            {pendingConflicts.length} conflitos na fila
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
            {pendingConflicts.map((conflict) => (
              <div
                key={conflict.id}
                onClick={() => setSelectedConflict(conflict)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedConflict?.id === conflict.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <Badge variant={getPriorityBadgeVariant(conflict.priority)} className="text-xs">
                    {conflict.priority.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted">
                    {formatSimilarity(conflict.similarityScore)}
                  </span>
                </div>
                <div className="font-medium text-sm mt-2">
                  {conflict.goldenRecord.description}
                </div>
                <div className="text-xs text-muted mt-1">
                  {conflict.sources.length} variações ERP
                </div>
              </div>
            ))}

            {resolvedConflicts.length > 0 && (
              <>
                <div className="text-xs text-muted mt-4 mb-2 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-green-500" />
                  Resolvidos recentemente
                </div>
                {resolvedConflicts.slice(0, 3).map((conflict) => (
                  <div
                    key={conflict.id}
                    className="p-3 rounded-lg border border-green-500/30 bg-green-500/5 opacity-60"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span className="text-sm">{conflict.goldenRecord.description}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Right Panel: Conflict Details */}
      <div className="flex-1 flex flex-col gap-4">
        {selectedConflict ? (
          <>
            {/* Header */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <GitMerge size={20} />
                    {selectedConflict.goldenRecord.description}
                  </h2>
                  <div className="text-sm text-muted mt-1">
                    Categoria: {selectedConflict.category} | {selectedConflict.sources.length} fontes detectadas
                  </div>
                </div>
                <Badge variant={getPriorityBadgeVariant(selectedConflict.priority)}>
                  Prioridade {selectedConflict.priority.toUpperCase()}
                </Badge>
              </div>
            </Card>

            {/* Sources Comparison - Side by Side */}
            <div className="flex-1 grid grid-cols-3 gap-4">
              {selectedConflict.sources.map((source, index) => {
                // Find differences compared to primary source
                const primarySource = selectedConflict.sources.find(s => s.isPrimary) || selectedConflict.sources[0];
                const hasDifferentEan = source.ean !== primarySource.ean;
                const hasDifferentCogs = source.cogs !== primarySource.cogs;
                const cogsVariance = primarySource.cogs > 0
                  ? Math.abs((source.cogs - primarySource.cogs) / primarySource.cogs * 100)
                  : 0;

                return (
                  <Card
                    key={index}
                    className={cn(
                      'p-4 transition-all duration-300',
                      source.isPrimary
                        ? 'border-primary border-2 bg-primary/5 shadow-lg shadow-primary/10'
                        : 'border-border hover:border-muted-foreground/30',
                      merging && 'animate-pulse'
                    )}
                  >
                    {/* System Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getSystemIcon(source.system)}</span>
                        <div>
                          <span className="font-semibold text-sm block">{source.system}</span>
                          <span className="text-[10px] text-muted">ERP Source</span>
                        </div>
                      </div>
                      {source.isPrimary && (
                        <Badge variant="blue" className="text-xs">
                          <Check size={10} className="mr-1" />
                          PRIMARY
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3 text-sm">
                      {/* SKU */}
                      <div className="p-2.5 rounded-lg bg-muted/20">
                        <div className="text-[10px] text-muted mb-1 uppercase tracking-wider">SKU Code</div>
                        <div className="font-mono text-xs font-medium">
                          {source.sku}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <div className="text-[10px] text-muted mb-1 uppercase tracking-wider">Descrição</div>
                        <div className="font-medium text-sm">{source.description}</div>
                      </div>

                      {/* EAN - highlight if different */}
                      <div className={cn(
                        'p-2.5 rounded-lg',
                        !source.ean
                          ? 'bg-red-500/10 border border-red-500/30'
                          : hasDifferentEan && !source.isPrimary
                          ? 'bg-amber-500/10 border border-amber-500/30'
                          : 'bg-muted/20'
                      )}>
                        <div className="text-[10px] text-muted mb-1 uppercase tracking-wider flex items-center gap-1">
                          EAN/Barcode
                          {!source.ean && <AlertTriangle size={10} className="text-red-500" />}
                          {hasDifferentEan && source.ean && !source.isPrimary && (
                            <span className="text-amber-500 text-[8px]">DIFFERS</span>
                          )}
                        </div>
                        <div className={cn(
                          'font-mono text-xs',
                          !source.ean ? 'text-red-500 font-bold' : ''
                        )}>
                          {source.ean || '[MISSING DATA]'}
                        </div>
                      </div>

                      {/* COGS - highlight variance */}
                      <div className={cn(
                        'p-2.5 rounded-lg',
                        hasDifferentCogs && !source.isPrimary && cogsVariance > 1
                          ? 'bg-amber-500/10 border border-amber-500/30'
                          : 'bg-muted/20'
                      )}>
                        <div className="text-[10px] text-muted mb-1 uppercase tracking-wider flex items-center gap-1">
                          COGS (Custo)
                          {hasDifferentCogs && !source.isPrimary && cogsVariance > 1 && (
                            <span className="text-amber-500 text-[8px]">
                              {cogsVariance > 0 ? `±${cogsVariance.toFixed(1)}%` : ''}
                            </span>
                          )}
                        </div>
                        <div className="font-semibold">{formatBRL(source.cogs, 2)}</div>
                      </div>

                      {/* Supplier */}
                      <div className={cn(
                        'p-2.5 rounded-lg',
                        !source.supplier ? 'bg-red-500/10 border border-red-500/30' : 'bg-muted/20'
                      )}>
                        <div className="text-[10px] text-muted mb-1 uppercase tracking-wider flex items-center gap-1">
                          Fornecedor
                          {!source.supplier && <AlertTriangle size={10} className="text-red-500" />}
                        </div>
                        <div className={cn(
                          'text-xs',
                          !source.supplier ? 'text-red-500 font-bold' : ''
                        )}>
                          {source.supplier || '[NO DATA]'}
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div className="text-[10px] text-muted text-right pt-2 border-t border-border/30">
                        Atualizado: {formatDateBR(source.lastUpdated)}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* ML Analysis & Actions */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <span className="font-semibold">ML Analysis</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted">Similaridade:</span>{' '}
                      <span className="font-medium">{formatSimilarity(selectedConflict.mlAnalysis.textSimilarity)}</span>
                    </div>
                    <div>
                      <span className="text-muted">EAN match:</span>{' '}
                      <span className="font-medium">{selectedConflict.mlAnalysis.eanMatch}</span>
                    </div>
                    <div>
                      <span className="text-muted">COGS variance:</span>{' '}
                      <span className="font-medium">{formatVariance(selectedConflict.mlAnalysis.cogsVariance)}</span>
                    </div>
                    <div>
                      <span className="text-muted">Confiança:</span>{' '}
                      <span className="font-medium">{formatConfidence(selectedConflict.mlAnalysis.confidence)}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      selectedConflict.mlAnalysis.recommendation === 'merge' ? 'green' :
                      selectedConflict.mlAnalysis.recommendation === 'review' ? 'amber' : 'red'
                    }
                  >
                    {getRecommendationText(selectedConflict.mlAnalysis.recommendation)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {}}
                  >
                    Flag for Review
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleMerge(selectedConflict)}
                    disabled={merging || selectedConflict.resolved}
                  >
                    {merging ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Merging...
                      </>
                    ) : (
                      <>
                        <GitMerge size={16} className="mr-2" />
                        Merge to Golden Record
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted">
              <Database size={48} className="mx-auto mb-4 opacity-30" />
              <p>Selecione um conflito para visualizar</p>
            </div>
          </Card>
        )}
      </div>

      {/* Impact Modal */}
      {showImpactModal && selectedConflict && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[500px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-500" />
                Impacto API o9 Solutions
              </h3>
              <button onClick={handleCloseImpactModal}>
                <X size={20} className="text-muted hover:text-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold mb-2">Antes (SKUs fragmentados):</div>
                <ul className="text-sm space-y-1 text-muted">
                  <li>• o9 forecast Chronos (Natura): 12.4k unidades</li>
                  <li>• o9 forecast Chronos (Avon): 8.7k unidades</li>
                  <li>• o9 forecast Chronos (Aesop): [não tracking]</li>
                  <li>• Total forecast conflitante: ???</li>
                </ul>
              </div>

              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="font-semibold mb-2 text-green-500">Depois (1 Golden Record):</div>
                <ul className="text-sm space-y-1">
                  <li>• o9 forecast Chronos unified: <span className="font-bold">21.1k unidades</span></li>
                  <li>• Confidence score: <span className="font-bold">94%</span> (vs 67% anterior)</li>
                  <li>• Forecast error reduction: <span className="font-bold text-green-500">28%</span></li>
                </ul>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="secondary" onClick={handleCloseImpactModal} className="flex-1">
                  Close
                </Button>
                <Button variant="primary" onClick={handleCloseImpactModal} className="flex-1">
                  Resolve Next Conflict
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Batch Merge Confirmation Modal */}
      {showBatchConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[450px] p-6">
            <h3 className="text-lg font-semibold mb-4">Executar Auto-Merge?</h3>
            <p className="text-sm text-muted mb-4">
              <span className="font-bold text-foreground">{statistics.autoMergeable}</span> conflitos com confidence &gt;90% serão resolvidos automaticamente.
            </p>
            <p className="text-sm text-muted mb-4">
              <span className="font-bold text-foreground">{statistics.requiresReview}</span> conflitos baixa confidence ficarão para revisão manual.
            </p>
            <p className="text-sm mb-6">
              Tempo estimado: <span className="font-bold">4 minutos</span>
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowBatchConfirm(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleBatchMerge} className="flex-1">
                <Zap size={16} className="mr-2" />
                Execute Auto-Merge
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Batch Merge Progress Modal */}
      {batchMerging && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[400px] p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <RefreshCw size={20} className="animate-spin text-primary" />
              Auto-Merge em Progresso
            </h3>
            <div className="mb-4">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${batchProgress}%` }}
                />
              </div>
              <div className="text-sm text-muted mt-2 text-center">
                {Math.round(batchProgress)}% completo
              </div>
            </div>
            <p className="text-sm text-muted text-center">
              Resolvendo {statistics.autoMergeable} conflitos...
            </p>
          </Card>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
