'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Network, Brain, Database, Layers, Shield, Zap } from 'lucide-react';

export function ModelTab() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Plataforma Palantir Foundry</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            O Sistema Operacional para a Empresa Moderna. Crie um gêmeo digital central
            da sua organização, permitindo tomada de decisão em uma base compartilhada de verdade.
          </p>
        </div>

        {/* Core Capabilities */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Capacidades Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Network className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Ontology</h3>
              </div>
              <p className="text-sm text-muted">
                Mapeia tabelas de dados brutos para conceitos do mundo real. Desacopla a camada
                de dados da camada de aplicação, permitindo construir apps baseados em "Coisas" e não "Linhas".
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold">AIP (AI Platform)</h3>
              </div>
              <p className="text-sm text-muted">
                Camada de integração que permite LLMs interagir com a Ontology, chamar ferramentas
                e executar ações com segurança. Não é apenas um chatbot—é IA operacional.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Engenharia de Dados</h3>
              </div>
              <p className="text-sm text-muted">
                Construtor de pipelines low-code/no-code com controle de versão baseado em Git.
                Conecta-se a qualquer fonte de dados e transforma em ativos utilizáveis.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Workshop</h3>
              </div>
              <p className="text-sm text-muted">
                Construtor de aplicações low-code. Monte widgets, gráficos e formulários de ação
                para criar interfaces operacionais sem escrever código.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Segurança e Governança</h3>
              </div>
              <p className="text-sm text-muted">
                Controle de acesso granular a nível de linha e coluna. Checkpoints garantem
                qualidade de dados e políticas de segurança em tempo de execução.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Apollo</h3>
              </div>
              <p className="text-sm text-muted">
                Plataforma de entrega contínua. Permite atualizações autônomas em
                ambientes heterogêneos sem tempo de inatividade.
              </p>
            </Card>
          </div>
        </div>

        {/* Architecture Overview */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Arquitetura</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Camada de Dados</h4>
                  <p className="text-xs text-muted">
                    Pipeline Builder, Data Connection, Datasets, Media Sets
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Camada Semântica</h4>
                  <p className="text-xs text-muted">
                    Ontology: Objects, Properties, Links, Actions, Functions
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Camada de IA</h4>
                  <p className="text-xs text-muted">
                    AIP Core, Logic, Terminal, RAG, Embeddings, LLMs
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Camada de Aplicação</h4>
                  <p className="text-xs text-muted">
                    Workshop, Quiver, Contour, OSDK, Apps Customizados
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Integration Points */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Capacidades de Integração</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Fontes de Dados</h4>
                  <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                    <li>Bancos de Dados (PostgreSQL, MySQL, SQL Server, Oracle)</li>
                    <li>Armazenamento em Nuvem (S3, GCS, Azure Blob)</li>
                    <li>ERPs (SAP, Oracle EBS, Microsoft Dynamics)</li>
                    <li>APIs (REST, GraphQL, SOAP)</li>
                    <li>Streaming (Kafka, MQTT, TCP)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Sistemas Externos</h4>
                  <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                    <li>OSDK para apps React/Python customizados</li>
                    <li>APIs REST para integração</li>
                    <li>Webhooks para fluxos orientados a eventos</li>
                    <li>Actions para write-back aos sistemas fonte</li>
                    <li>Embeds do Workshop para portais externos</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Why This Matters */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Por Que Isso Importa</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Fonte Única da Verdade</h4>
                <p className="text-sm text-muted">
                  A Ontology cria um modelo unificado do seu negócio. Sem mais silos de dados
                  ou relatórios conflitantes. Todos trabalham a partir da mesma base.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. IA Operacional</h4>
                <p className="text-sm text-muted">
                  AIP não apenas responde perguntas—executa ações. LLMs podem consultar a
                  Ontology, chamar funções e escrever de volta nos sistemas fonte com segurança.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">3. Low-Code, Alto Valor</h4>
                <p className="text-sm text-muted">
                  Construa aplicações operacionais sem escrever código. Workshop e Pipeline
                  Builder abstraem a complexidade mantendo a flexibilidade.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">4. Segurança de Nível Empresarial</h4>
                <p className="text-sm text-muted">
                  Controle de acesso a nível de linha e coluna. Governança de dados aplicada
                  em tempo de execução. Trilhas de auditoria para todas as operações.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
