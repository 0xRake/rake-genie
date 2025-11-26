'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Target, TrendingUp, Users, Package } from 'lucide-react';

export function DemoTab() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Client Profile */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Target className="text-primary" size={32} />
            <h1 className="text-4xl font-bold">Natura & Co</h1>
          </div>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Gigante global de cosméticos com 1,8M de representantes de vendas. Transformando
            visibilidade da cadeia de suprimentos e habilitação de vendas através de operações de dados unificadas.
          </p>
        </div>

        {/* Current State */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Análise do Estado Atual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 border-destructive/20">
              <h3 className="font-semibold mb-3 text-destructive">Desafios</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Dados fragmentados em múltiplos ERPs e sistemas</li>
                <li>• Visibilidade limitada nas operações da cadeia de suprimentos</li>
                <li>• Distribuição de inventário ineficiente entre regiões</li>
                <li>• Representantes sem disponibilidade de produtos em tempo real</li>
                <li>• Processos manuais de relatórios atrasam tomada de decisão</li>
                <li>• Nenhuma visão unificada das interações com clientes</li>
              </ul>
            </Card>

            <Card className="p-6 border-primary/20">
              <h3 className="font-semibold mb-3 text-primary">Oportunidades</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Unificar dados de SAP, Oracle e sistemas regionais</li>
                <li>• Visibilidade de inventário em tempo real em todos os canais</li>
                <li>• Previsão de demanda e otimização com IA</li>
                <li>• Plataforma mobile-first para representantes de vendas</li>
                <li>• Relatórios e análises automatizados</li>
                <li>• Visão 360 do cliente em todos os pontos de contato</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Proposed Architecture */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Arquitetura Proposta</h2>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Package size={18} />
                    Integração de Dados
                  </h4>
                  <p className="text-xs text-muted">
                    Conectar SAP, Oracle EBS, ERPs regionais e plataformas de e-commerce.
                    Schema unificado via Foundry Ontology.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users size={18} />
                    Plataforma de Representantes
                  </h4>
                  <p className="text-xs text-muted">
                    Aplicação Workshop para 1,8M de representantes. Inventário em tempo real,
                    recomendações de produtos, gestão de pedidos.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Otimização da Cadeia de Suprimentos
                  </h4>
                  <p className="text-xs text-muted">
                    Previsão de demanda com AIP. Rebalanceamento automático de inventário.
                    Analytics preditivo para distribuição.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold mb-2">Digital Twin</h4>
                <p className="text-sm text-muted">
                  Criar uma representação digital unificada das operações da Natura: produtos,
                  inventário, representantes, clientes, pedidos e cadeia de suprimentos. Habilitar
                  tomada de decisão em tempo real em uma base compartilhada de verdade.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Integration Roadmap */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Roteiro de Integração</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Fase 1: Fundação (Semanas 1-4)</h4>
                  <p className="text-sm text-muted">
                    Conectar sistemas ERP primários. Construir objetos core da Ontology (Produto, Inventário,
                    Representante, Cliente). Estabelecer pipelines de dados para datasets críticos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Fase 2: Plataforma de Representantes (Semanas 5-8)</h4>
                  <p className="text-sm text-muted">
                    Construir aplicação Workshop para representantes. Consultas de inventário em tempo real.
                    Motor de recomendação de produtos. Fluxo de colocação de pedidos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Fase 3: Aprimoramento com IA (Semanas 9-12)</h4>
                  <p className="text-sm text-muted">
                    Deploy de AIP Logic para previsão de demanda. Rebalanceamento automático de inventário.
                    Analytics preditivo para otimização da cadeia de suprimentos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Fase 4: Escalar e Otimizar (Semanas 13-16)</h4>
                  <p className="text-sm text-muted">
                    Expandir para todos os sistemas regionais. Dashboards de analytics avançados.
                    Integração com plataforma de planejamento o9. Otimização contínua.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ROI Projections */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Resultados Esperados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">30%</div>
              <div className="text-sm text-muted">Redução nos custos de manutenção de inventário</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">50%</div>
              <div className="text-sm text-muted">Mais rápido para insights dos representantes</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">25%</div>
              <div className="text-sm text-muted">Melhoria na taxa de atendimento de pedidos</div>
            </Card>
          </div>
        </div>

        {/* Strategic Value */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Valor Estratégico</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Palantir como Integrador Unificador</h4>
                <p className="text-sm text-muted">
                  Enquanto o9 fornece capacidades avançadas de planejamento, Palantir Foundry serve como
                  o integrador unificador que conecta toda a organização. Foundry cria o digital twin,
                  integra todas as fontes de dados e permite que o9 opere em um dataset limpo e unificado.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">O Ponto de Convergência</h4>
                <p className="text-sm text-muted">
                  Estratégia e táticas convergem no Foundry. Planejamento estratégico (o9) encontra
                  execução operacional (Foundry) em uma base compartilhada de verdade. Isso permite
                  que a Natura gerencie a empresa como um todo, não como silos desconectados.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
