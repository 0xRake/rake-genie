'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Lock,
  Unlock,
  Target,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Package,
  Lightbulb,
  FileText,
  MessageSquare
} from 'lucide-react';

const CORRECT_PASSWORD = 'Sucesso@2025';
const STORAGE_KEY = 'internal-tab-authenticated';

export function InternalTab() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true); // eslint-disable-line react-hooks/set-state-in-effect -- Loading auth on mount
    }
    setIsLoading(false); // eslint-disable-line react-hooks/set-state-in-effect -- Loading state on mount
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY);
    setPassword('');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordGate password={password} setPassword={setPassword} error={error} onSubmit={handleSubmit} />;
  }

  return <InternalContent onLogout={handleLogout} />;
}

interface PasswordGateProps {
  password: string;
  setPassword: (value: string) => void;
  error: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

function PasswordGate({ password, setPassword, error, onSubmit }: PasswordGateProps) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock size={32} className="text-primary" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
            <p className="text-muted text-sm">
              Este conteúdo é exclusivo para uso interno. Digite a senha para acessar.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Digite a senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? 'border-destructive' : ''}
                autoFocus
              />
              {error && (
                <p className="text-destructive text-xs mt-2 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Senha incorreta. Tente novamente.
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              <Unlock size={16} />
              Acessar Conteúdo
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

interface InternalContentProps {
  onLogout: () => void;
}

function InternalContent({ onLogout }: InternalContentProps) {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Framework Executivo Demo</h1>
              <p className="text-muted text-sm">Estrutura Demo C-Level Natura</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <Lock size={14} />
            Bloquear
          </Button>
        </div>

        {/* Part 1: C-Level Mindset */}
        <Section
          icon={Users}
          title="Parte 1: Mentalidade C-Level"
          subtitle="Como Eles Avaliam"
        >
          <Card className="p-6 space-y-6">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-lg font-medium">
                C-Level não compra tecnologia. C-Level compra <span className="text-primary font-bold">redução de risco</span> e <span className="text-primary font-bold">captura de valor</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EvaluationCard
                role="CFO"
                icon={DollarSign}
                criteria={[
                  "Payback period (tempo recuperar investimento)",
                  "EBITDA impact (quanto adiciona lucro operacional)",
                  "Working capital liberation (inventário parado vira cash)"
                ]}
              />
              <EvaluationCard
                role="CSCO"
                icon={Package}
                criteria={[
                  "Velocity (tempo até ver resultado)",
                  "Scalability (funciona Brasil ou LATAM inteiro?)",
                  "Team adoption (supply chain managers vão usar?)"
                ]}
              />
              <EvaluationCard
                role="CEO"
                icon={Target}
                criteria={[
                  "Strategic positioning (diferencia vs. competidores?)",
                  "Integration risk (vai quebrar o9?)",
                  "Vendor credibility (Palantir vai estar aqui em 5 anos?)"
                ]}
              />
            </div>
          </Card>
        </Section>

        {/* Part 2: Meeting Structure */}
        <Section
          icon={Clock}
          title="Parte 2: Estrutura Reunião 30 Minutos"
          subtitle="ROI-Driven"
        >
          {/* Minutes 1-3 */}
          <TimeBlock minutes="1-3" title="Abertura com Impacto Financeiro">
            <div className="space-y-4">
              <ScriptBox>
                <p>"Bom dia. Antes de mostrar qualquer tecnologia, quero estabelecer contexto financeiro. Natura reportou R$ 8.9 bilhões em perdas 2024. Não estou dizendo que Palantir resolve tudo isso. Mas nossa análise baseada em dados públicos de vocês sugere que entre <strong>3-5% dessas perdas são puramente desperdício operacional evitável</strong> na supply chain - algo entre <strong>R$ 260 a R$ 450 milhões anuais</strong>.</p>
                <p className="mt-2">Hoje vou mostrar como Foundry captura esse desperdício em 3 áreas específicas: inventário parado que deveria estar fluindo, rupturas que custam vendas, e oportunidades COGS perdidas porque decisões levam semanas ao invés de minutos."</p>
              </ScriptBox>

              <Card className="p-4 bg-secondary/50">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  Breakdown Desperdício Visual
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-destructive">R$ 120M</div>
                    <div className="text-xs text-muted">Excess inventory<br/>(6+ meses sem vender)</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-destructive">R$ 80M</div>
                    <div className="text-xs text-muted">Stockout losses<br/>(vendas perdidas)</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-destructive">R$ 60M</div>
                    <div className="text-xs text-muted">COGS inefficiency<br/>(spot-buy perdidas)</div>
                  </div>
                </div>
              </Card>

              <WhyItWorks
                points={[
                  "CFO ouve 'R$ 260-450M evitável' e presta atenção total",
                  "CSCO ouve '3 empresas comparáveis' e pensa 'não somos cobaia'",
                  "CEO ouve 'funciona com o9' e relaxa sobre integration risk"
                ]}
              />
            </div>
          </TimeBlock>

          {/* Minutes 4-10 */}
          <TimeBlock minutes="4-10" title="Demo Fluxo Único (Waste Detection End-to-End)">
            <div className="space-y-6">
              <Card className="p-4 border-primary/30 bg-primary/5">
                <p className="text-sm">
                  <strong>Decisão estrutural crítica:</strong> Para C-Level, mostrar <strong>um fluxo completo</strong> que vai de problema até ação executada é mais poderoso que três fluxos superficiais. Executivos precisam ver "closed loop" - problema identificado, decisão tomada, ação executada, resultado medido.
                </p>
              </Card>

              {/* Component 1 */}
              <DemoComponent
                number={1}
                title="Dashboard Executivo"
                duration="30 segundos"
              >
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <h5 className="font-medium mb-2 text-sm">O que eles veem na tela:</h5>
                    <p className="text-xs text-muted">
                      Dashboard com mapa Brasil mostrando 12 warehouses Natura + Avon. Cada warehouse tem três indicadores coloridos:
                    </p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>Verde: Inventory saudável</span>
                      <span className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>Amarelo: Excess (6+ meses)</span>
                      <span className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>Vermelho: Stockout risk</span>
                    </div>
                  </div>

                  <ScriptBox>
                    <p>"Essa é visão consolidada que supply chain managers nunca tiveram antes. Dados vindo de 5 ERPs diferentes - SAP Natura, SAP Avon, Oracle Aesop, dois sistemas legados - atualizados em tempo real.</p>
                    <p className="mt-2">Prestem atenção nessa contradição: São Paulo tem <strong>R$ 8.2 milhões em linha Chronos parada há 7 meses</strong>. Mesmo tempo, Nordeste está com stockout iminente Chronos - vão perder <strong>R$ 2.1 milhões em vendas próximos 30 dias</strong> porque não têm produto.</p>
                    <p className="mt-2">Problema não é falta de inventário no sistema Natura. Problema é <strong>inventário lugar errado</strong>."</p>
                  </ScriptBox>

                  <CredibilityBox>
                    Fortune 100 consumer goods tinha exatamente mesmo problema - 7 sistemas ERP, inventory mal alocado. Palantir integrou os 7 sistemas em <strong>5 dias</strong>. Primeira semana já identificaram <strong>$15 milhões</strong> em inventory mal posicionado.
                    <br/><span className="text-xs opacity-70">Source: Palantir case study "Optimizing Production with ERP Data Across the Supply Chain"</span>
                  </CredibilityBox>
                </div>
              </DemoComponent>

              {/* Component 2 */}
              <DemoComponent
                number={2}
                title="Conflict Resolution"
                duration="45 segundos"
              >
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <h5 className="font-medium mb-2 text-sm">O que eles veem na tela:</h5>
                    <div className="space-y-2 text-xs font-mono bg-background p-3 rounded">
                      <div className="flex justify-between"><span className="text-muted">SAP Natura:</span><span>"Chronos Anti-idade Sérum 30ml"</span></div>
                      <div className="flex justify-between"><span className="text-muted">SAP Avon:</span><span>"Chronos 30mL Serum"</span></div>
                      <div className="flex justify-between"><span className="text-muted">Oracle Aesop:</span><span>"CHRO-SER-030"</span></div>
                    </div>
                    <p className="text-xs text-muted mt-2">
                      Foundry mostra "94% similarity - likely same product" e botão "Merge to Golden Record."
                    </p>
                  </div>

                  <ScriptBox>
                    <p>"Antes de otimizar alocação, Foundry precisou resolver isso. Mesmo produto, três descrições. Por isso o9 mostra forecasts conflitantes - cada ERP está reportando produto diferente quando na verdade é o mesmo.</p>
                    <p className="mt-2">Isso não é problema do o9. o9 é excelente em planejamento. Mas o9 só funciona se dados entrando estão limpos. <strong>Foundry é a camada que limpa esses dados</strong> antes de alimentar o9.</p>
                    <p className="mt-2">Esse processo - conflict resolution - Foundry fez automaticamente para <strong>100 mil SKUs catálogo Natura + Avon em 72 horas</strong>."</p>
                  </ScriptBox>
                </div>
              </DemoComponent>

              {/* Component 3 */}
              <DemoComponent
                number={3}
                title="Simulation & Optimization"
                duration="90 segundos"
              >
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <h5 className="font-medium mb-3 text-sm">Três cenários simulados:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <ScenarioCard
                        number={1}
                        title="Transfer SP → Nordeste"
                        metrics={[
                          { label: "Custo transporte", value: "R$ 142 mil" },
                          { label: "Evita markdown", value: "R$ 1.8M" },
                          { label: "Captura vendas", value: "R$ 2.1M" },
                        ]}
                        netBenefit="R$ 3.76M"
                        timeline="8 dias"
                        recommended
                      />
                      <ScenarioCard
                        number={2}
                        title="Produção adicional"
                        metrics={[
                          { label: "Custo produção", value: "R$ 680 mil" },
                          { label: "Revenue", value: "R$ 2.1M" },
                        ]}
                        netBenefit="R$ 1.42M"
                        timeline="18 dias"
                      />
                      <ScenarioCard
                        number={3}
                        title="Não fazer nada"
                        metrics={[
                          { label: "Markdown SP", value: "-R$ 1.8M" },
                          { label: "Stockout NE", value: "-R$ 2.1M" },
                        ]}
                        netBenefit="-R$ 3.9M"
                        timeline="—"
                        negative
                      />
                    </div>
                  </div>

                  <ScriptBox>
                    <p>"Foundry calculou automaticamente três cenários considerando custos transporte, COGS produção, demanda forecast, lead times logísticos. Vocês veem imediatamente que Cenário 1 - transfer - tem <strong>ROI 26x</strong>.</p>
                    <p className="mt-2">Aqui está diferença entre analytics e operações. Databricks ou Snowflake fariam dashboard bonito mostrando problema. <strong>Foundry faz dashboard E executa solução</strong>.</p>
                    <p className="mt-2">Olha: clico 'Execute Cenário 1.' Foundry agora gera transfer order automaticamente e escreve direto no SAP."</p>
                  </ScriptBox>
                </div>
              </DemoComponent>

              {/* Component 4 */}
              <DemoComponent
                number={4}
                title="Closed Loop - Mostrar Resultado"
                duration="30 segundos"
              >
                <ScriptBox>
                  <p>"Isso fecha o loop. Problema identificado, decisão simulada, ação executada, resultado medido. E isso não é workflow de 3 meses - <strong>esse ciclo completo acontece em 8 dias</strong>.</p>
                  <p className="mt-2">Agora multipliquem isso: esse exemplo foi um produto, dois warehouses. Natura + Avon tem 100 mil SKUs, 12 warehouses, 4 países. Se capturarem só 3% do desperdício operacional usando esse processo, são <strong>R$ 8-14 milhões anuais</strong>."</p>
                </ScriptBox>
              </DemoComponent>
            </div>
          </TimeBlock>

          {/* Minutes 11-13 */}
          <TimeBlock minutes="11-13" title="Velocidade Implementação (Risk Mitigation)">
            <div className="space-y-4">
              <Card className="p-4">
                <h5 className="font-medium mb-3 text-sm">Comparativo Timelines:</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                    <h6 className="font-semibold text-primary text-sm mb-2">Palantir Foundry</h6>
                    <ul className="text-xs space-y-1 text-muted">
                      <li>• Integração 3-5 ERPs: <strong>5-7 dias</strong></li>
                      <li>• Catálogo 100k SKUs: <strong>2-3 semanas</strong></li>
                      <li>• Primeiro workflow: <strong>1 semana</strong></li>
                      <li>• Deployment completo: <strong>90 dias</strong></li>
                    </ul>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <h6 className="font-semibold text-sm mb-2">o9 Solutions</h6>
                    <ul className="text-xs space-y-1 text-muted">
                      <li>• Implementação piloto: 6-8 meses</li>
                      <li>• Full deployment: 12-18 meses</li>
                      <li className="opacity-70 italic">Source: Press releases TBInternational, Li Auto</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <h6 className="font-semibold text-sm mb-2">Custom In-House</h6>
                    <ul className="text-xs space-y-1 text-muted">
                      <li>• Design + development: 12-18 meses</li>
                      <li>• Testing + deployment: 6-12 meses</li>
                      <li>• Total: <strong>18-30 meses</strong></li>
                    </ul>
                  </div>
                </div>
              </Card>

              <ScriptBox>
                <p>"Pergunta que sei que vocês têm: quanto tempo até vermos esse resultado? Resposta baseada em caso real: Fortune 100 consumer goods integrou 7 sistemas ERP em <strong>5 dias</strong>.</p>
                <p className="mt-2">E isso não substitui o9. Vocês investiram no o9 para planejamento comercial - ótimo investimento. <strong>Foundry garante que o9 recebe dados limpos</strong> via API e finalmente entrega ROI prometido."</p>
              </ScriptBox>
            </div>
          </TimeBlock>

          {/* Minutes 14-21 */}
          <TimeBlock minutes="14-21" title="Pilot Proposal (Transição para Venda)">
            <div className="space-y-4">
              <Card className="p-4 border-primary/30 bg-primary/5">
                <p className="text-sm font-medium">
                  <strong>Momento crítico:</strong> Não perguntar "vocês querem seguir em frente?" Isso dá abertura para "vamos pensar." <strong>Assumir que seguem em frente</strong> e apresentar proposta concreta.
                </p>
              </Card>

              <ScriptBox>
                <p>"Baseado no que mostramos, proposta é estruturar <strong>pilot 30 dias low-risk</strong> para validar esses números com dados reais de vocês.</p>
                <p className="mt-2"><strong>Escopo pilot:</strong> Conectar 3-5 ERPs - SAP Natura, SAP Avon, Oracle Aesop. Unificar catálogo SKUs. Criar API limpa para o9. E colocar no ar exatamente o workflow que demonstramos.</p>
                <p className="mt-2"><strong>Investimento pilot:</strong> R$ 1.638.000</p>
                <p className="mt-2"><strong>Success criteria:</strong> data quality {'>'} 99%, API latency {'<'} 100ms, identificar pelo menos R$ 5M em waste capturável.</p>
                <p className="mt-2">Se não atingirmos esses três critérios, <strong>segunda metade do pagamento não acontece</strong>."</p>
              </ScriptBox>

              <Card className="p-4">
                <h5 className="font-medium mb-3 text-sm">ROI Pilot - Três Cenários:</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ROICard
                    scenario="Conservador (2%)"
                    savings="R$ 5.2M"
                    payback="3.8 meses"
                    roi="217%"
                  />
                  <ROICard
                    scenario="Base (5%)"
                    savings="R$ 13M"
                    payback="1.5 meses"
                    roi="694%"
                    highlighted
                  />
                  <ROICard
                    scenario="Otimista (10%)"
                    savings="R$ 26M"
                    payback="3 semanas"
                    roi="1.487%"
                  />
                </div>
              </Card>
            </div>
          </TimeBlock>

          {/* Minutes 22-25 */}
          <TimeBlock minutes="22-25" title="Casos Comparáveis (Credibility Reinforcement)">
            <div className="space-y-4">
              <CaseStudyCard
                title="Fortune 100 Consumer Goods"
                details={[
                  "7 sistemas ERP legados integrados",
                  "Integração completada em 5 dias",
                  "Bill of Materials workflow em 1 semana",
                  "Decisões: semanas → minutos",
                  "Savings estimados: $100M anuais"
                ]}
                source="Palantir.com - 'Optimizing Production with ERP Data Across the Supply Chain'"
              />
              <CaseStudyCard
                title="Brazilian Fashion Retailer"
                details={[
                  "28 mil SKUs, 350 lojas",
                  "R$ 200M vendas anuais gerenciadas",
                  "R$ 16M value increase (R$ 8M vendas + R$ 8M redução inventário)",
                  "+13% availability SKUs",
                  "4x redução tempo purchase orders"
                ]}
                source="Palantir whitepaper 'Winning the Retail Battle'"
              />
            </div>
          </TimeBlock>

          {/* Minutes 26-30 */}
          <TimeBlock minutes="26-30" title="Q&A + Forcing Next Step">
            <div className="space-y-4">
              <QACard
                question="Quanto custa depois do pilot?"
                answer="Full deployment Year 1: R$ 6-8 milhões. Year 2+: R$ 2-3M platform license. Fortune 100 case: investment similar, return foi $100M year 1. ROI 12-15x. Comparação: custom build seria R$ 15-25M ao longo 24 meses."
              />
              <QACard
                question="Isso vai atrapalhar o9 pilot que já está rodando?"
                answer="Exatamente oposto. Vai salvar o o9 pilot. Se já estivesse funcionando perfeitamente, essa conversa não estaria acontecendo. Foundry resolve exatamente o challenge de ERP integration. API Foundry alimenta o9 com dados limpos. o9 finalmente entrega ROI prometido."
              />
              <QACard
                question="Por que não podemos fazer isso in-house?"
                answer="Podem. Vai levar 18-30 meses e R$ 15-25M. Foundry é produto usado por 300+ empresas globalmente. Cada melhoria beneficia todos clientes. E timing importa: nesses 24 meses, R$ 260-450M desperdício continua acontecendo."
              />

              <Card className="p-4 border-primary bg-primary/10">
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <ArrowRight size={16} className="text-primary" />
                  CLOSE (Forçar Next Step)
                </h5>
                <ScriptBox>
                  <p>"Última coisa antes de terminar: próximo passo não é 'vamos pensar.' Próximo passo é <strong>technical validation call 90 minutos</strong> onde Palantir Solutions Architect se conecta com time Supply Chain e Procurement vocês.</p>
                  <p className="mt-2">Esse call não é commitment. É due diligence. Temos slot aberto <strong>quarta-feira próxima 2pm ou sexta-feira 10am</strong>. Qual funciona melhor?"</p>
                </ScriptBox>
              </Card>
            </div>
          </TimeBlock>
        </Section>

        {/* Part 3: Why This Structure Works */}
        <Section
          icon={Lightbulb}
          title="Parte 3: Por Que Essa Estrutura Funciona"
          subtitle="S&OP + Supply Chain Perspective"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Conexão com S&OP Process</h4>
              <div className="space-y-3 text-sm">
                <p className="text-muted">S&OP tradicional na Natura provavelmente roda mensal/quinzenal:</p>
                <div className="space-y-1 text-xs">
                  <div className="flex gap-2"><span className="text-muted">Semana 1:</span> Demand planning coleta forecasts</div>
                  <div className="flex gap-2"><span className="text-muted">Semana 2:</span> Supply planning valida capacity</div>
                  <div className="flex gap-2"><span className="text-muted">Semana 3:</span> Finance reconcilia P&L impact</div>
                  <div className="flex gap-2"><span className="text-muted">Semana 4:</span> Executive S&OP meeting</div>
                </div>
                <p className="text-destructive text-xs mt-2">
                  <strong>Problema:</strong> Dados usados nas semanas 1-3 já estão desatualizados quando chegam week 4.
                </p>
                <p className="text-primary text-xs">
                  <strong>Foundry:</strong> Transforma S&OP de processo mensal para continuous. Executive meeting vira decisão estratégica, não reconciliação tática.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-4">Conexão com Supply Chain Execution</h4>
              <div className="space-y-3 text-sm">
                <p className="text-muted">Gap crítico: Execution systems não falam com planning systems em tempo real.</p>
                <div className="p-3 bg-secondary rounded text-xs space-y-2">
                  <p><strong>Cenário atual:</strong> Quando warehouse Recife percebe stockout, não há workflow automático notificar demand planning.</p>
                  <p><strong>Com Foundry:</strong> o9 diz "preciso 50 mil unidades Nordeste." Foundry vê SP tem 40 mil paradas. Simula transfer, calcula ROI, gera ordem, escreve em SAP. <strong>Loop fechado.</strong></p>
                </div>
                <CredibilityBox>
                  Brazilian retailer: "4x decrease in time spent making purchase orders." Purchasing antes: 4 horas/order. Depois: 15 minutos.
                </CredibilityBox>
              </div>
            </Card>
          </div>
        </Section>

        {/* Part 4: Verifiable Facts */}
        <Section
          icon={CheckCircle}
          title="Parte 4: Credibilidade via Fatos Verificáveis"
          subtitle="Checklist - Toda Claim Tem Source"
        >
          <Card className="p-6">
            <div className="space-y-3">
              <VerifiableClaim
                claim="Fortune 100 integrou 7 ERPs em 5 dias"
                source="Palantir.com/docs/foundry/use-case-examples/optimizing-production-with-erp-data-across-the-supply-chain"
                quote="Seven ERP sources integrated into a digital twin and supply chain workflow within 5 days."
              />
              <VerifiableClaim
                claim="$100M savings estimados"
                source="Mesmo documento"
                quote="Estimated up to $100M in annual savings based on 1-2% improvement in production."
              />
              <VerifiableClaim
                claim="Brazilian retailer R$ 16M value increase"
                source="Palantir whitepaper 'Winning the Retail Battle'"
                quote="+$16M value increase: $8M increase in annual sales & $8M decrease in inventory"
              />
              <VerifiableClaim
                claim="o9 timelines 6-12 meses"
                source="o9 Solutions press releases públicos"
                quote="TBInternational: 6 meses (April 2024), Li Auto: 12 meses (January 2025)"
              />
              <VerifiableClaim
                claim="Foundry integra com o9, Blue Yonder"
                source="AWS + Palantir ebook 'A Smarter Supply Chain for the Modern Enterprise'"
                quote="Supply chain platforms, such as o9, Blue Yonder, and Manhattan Associates"
              />
            </div>
          </Card>
        </Section>

        {/* Part 5: Anti-Patterns */}
        <Section
          icon={XCircle}
          title="Parte 5: Anti-Patterns"
          subtitle="O Que NÃO Fazer"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AntiPatternCard
              title="Feature Dump"
              dontSay="Foundry tem 200+ connectors, Ontology layer, Code Repositories, Pipeline Builder, Contour, Workshop, Quiver, AIP agents..."
              why="C-Level não compra features. C-Level compra outcome."
              sayInstead="Foundry captura R$ 260M desperdício em 90 dias usando workflow allocation que demonstramos."
            />
            <AntiPatternCard
              title="Comparação Direta com o9"
              dontSay="Palantir é melhor que o9 porque..."
              why="Natura já investiu no o9. Atacar o9 = atacar decisão deles = criar defesa."
              sayInstead="o9 é excelente planejamento. Foundry fornece dados limpos que o9 precisa. Protegemos investimento que vocês já fizeram."
            />
            <AntiPatternCard
              title="Detalhes Técnicos IT"
              dontSay="Usamos Spark para processar petabytes, Delta Lake architecture, RESTful APIs com OAuth 2.0..."
              why="C-Level não avalia arquitetura técnica. Eles avaliam risk e ROI."
              sayInstead="Conexão com SAP e Oracle é plug-and-play. Fortune 100 conectou 7 ERPs em 5 dias."
            />
            <AntiPatternCard
              title="Prometer Tudo"
              dontSay="Foundry resolve S&OP, supply chain, finance, marketing, RH..."
              why="Jack of all trades, master of none. C-Level não acredita."
              sayInstead="Foundry resolve especificamente desperdício operacional supply chain. Foca 3 áreas. Nesses 3, é best-in-class."
            />
          </div>
        </Section>

        {/* Conclusion */}
        <Section
          icon={Target}
          title="Conclusão: Framework Mental C-Level"
          subtitle="As Três Lentes de Avaliação"
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-secondary rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <DollarSign size={24} className="text-primary" />
                </div>
                <h4 className="font-semibold mb-2">1. Magnitude</h4>
                <p className="text-sm text-muted">Quanto $ impacto?</p>
                <p className="text-xs text-primary mt-2">R$ 260-450M desperdício, captura 5% = R$ 13-22M year 1</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Clock size={24} className="text-primary" />
                </div>
                <h4 className="font-semibold mb-2">2. Velocity</h4>
                <p className="text-sm text-muted">Quanto tempo até resultado?</p>
                <p className="text-xs text-primary mt-2">90 dias deployment, primeiro value captured month 1</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Shield size={24} className="text-primary" />
                </div>
                <h4 className="font-semibold mb-2">3. Risk</h4>
                <p className="text-sm text-muted">O que pode dar errado?</p>
                <p className="text-xs text-primary mt-2">Pilot 30 dias R$ 1.6M with success criteria</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm font-medium">
                Se esses três estão cobertos com <strong>fatos verificáveis</strong>, C-Level aprova.
              </p>
            </div>
          </Card>
        </Section>

      </div>
    </div>
  );
}

// Helper Components

function Section({ icon: Icon, title, subtitle, children }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Icon size={24} className="text-primary" />
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function EvaluationCard({ role, icon: Icon, criteria }: {
  role: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  criteria: string[];
}) {
  return (
    <div className="p-4 border border-border rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-primary" />
        <h4 className="font-semibold">{role} avalia:</h4>
      </div>
      <ul className="space-y-2 text-xs text-muted">
        {criteria.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function TimeBlock({ minutes, title, children }: {
  minutes: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">
          Min {minutes}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function DemoComponent({ number, title, duration, children }: {
  number: number;
  title: string;
  duration: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l-2 border-primary/30 pl-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
          {number}
        </div>
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs text-muted">({duration})</span>
      </div>
      {children}
    </div>
  );
}

function ScriptBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-background border border-border rounded-lg">
      <div className="flex items-start gap-2">
        <MessageSquare size={14} className="text-primary mt-0.5 shrink-0" />
        <div className="text-sm text-foreground/90 italic">
          {children}
        </div>
      </div>
    </div>
  );
}

function CredibilityBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-xs">
      <div className="flex items-start gap-2">
        <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
        <div className="text-muted">{children}</div>
      </div>
    </div>
  );
}

function WhyItWorks({ points }: { points: string[] }) {
  return (
    <div className="p-3 bg-primary/5 rounded-lg">
      <h5 className="text-xs font-semibold mb-2 flex items-center gap-1">
        <Lightbulb size={12} className="text-primary" />
        Por que funciona:
      </h5>
      <ul className="space-y-1">
        {points.map((point, i) => (
          <li key={i} className="text-xs text-muted">• {point}</li>
        ))}
      </ul>
    </div>
  );
}

function ScenarioCard({ number, title, metrics, netBenefit, timeline, recommended, negative }: {
  number: number;
  title: string;
  metrics: { label: string; value: string }[];
  netBenefit: string;
  timeline: string;
  recommended?: boolean;
  negative?: boolean;
}) {
  return (
    <div className={`p-3 rounded-lg border ${
      recommended ? 'bg-primary/10 border-primary/30' :
      negative ? 'bg-destructive/10 border-destructive/30' :
      'bg-background border-border'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold">Cenário {number}</span>
        {recommended && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">REC</span>}
      </div>
      <h6 className="font-medium text-sm mb-2">{title}</h6>
      <div className="space-y-1 text-xs">
        {metrics.map((m, i) => (
          <div key={i} className="flex justify-between text-muted">
            <span>{m.label}:</span>
            <span className={negative && m.value.startsWith('-') ? 'text-destructive' : ''}>{m.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-border/50">
        <div className="flex justify-between text-xs">
          <span className="font-medium">Net:</span>
          <span className={`font-bold ${negative ? 'text-destructive' : 'text-primary'}`}>{netBenefit}</span>
        </div>
        <div className="text-[10px] text-muted">{timeline}</div>
      </div>
    </div>
  );
}

function ROICard({ scenario, savings, payback, roi, highlighted }: {
  scenario: string;
  savings: string;
  payback: string;
  roi: string;
  highlighted?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg text-center ${highlighted ? 'bg-primary/10 border border-primary/30' : 'bg-secondary'}`}>
      <div className="text-xs text-muted mb-1">{scenario}</div>
      <div className="text-xl font-bold text-primary">{savings}</div>
      <div className="text-xs text-muted mt-2">Payback: {payback}</div>
      <div className="text-xs font-semibold text-foreground">ROI: {roi}</div>
    </div>
  );
}

function CaseStudyCard({ title, details, source }: {
  title: string;
  details: string[];
  source: string;
}) {
  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-3">{title}</h4>
      <ul className="space-y-1 text-xs text-muted mb-3">
        {details.map((d, i) => (
          <li key={i}>• {d}</li>
        ))}
      </ul>
      <div className="text-[10px] text-muted/70 italic border-t border-border pt-2">
        Source: {source}
      </div>
    </Card>
  );
}

function QACard({ question, answer }: { question: string; answer: string }) {
  return (
    <Card className="p-4">
      <h5 className="font-medium mb-2 text-sm flex items-center gap-2">
        <MessageSquare size={14} className="text-muted" />
        "{question}"
      </h5>
      <p className="text-xs text-muted pl-6">{answer}</p>
    </Card>
  );
}

function VerifiableClaim({ claim, source, quote }: {
  claim: string;
  source: string;
  quote: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
      <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
      <div className="text-xs">
        <p className="font-medium mb-1">"{claim}"</p>
        <p className="text-muted">Source: {source}</p>
        <p className="text-muted/70 italic mt-1">"{quote}"</p>
      </div>
    </div>
  );
}

function AntiPatternCard({ title, dontSay, why, sayInstead }: {
  title: string;
  dontSay: string;
  why: string;
  sayInstead: string;
}) {
  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <XCircle size={16} className="text-destructive" />
        {title}
      </h4>
      <div className="space-y-2 text-xs">
        <div className="p-2 bg-destructive/10 rounded">
          <span className="text-destructive font-medium">Não diga:</span>
          <p className="text-muted mt-1">"{dontSay}"</p>
        </div>
        <p className="text-muted"><strong>Por quê:</strong> {why}</p>
        <div className="p-2 bg-primary/10 rounded">
          <span className="text-primary font-medium">Diga em vez:</span>
          <p className="text-muted mt-1">"{sayInstead}"</p>
        </div>
      </div>
    </Card>
  );
}
