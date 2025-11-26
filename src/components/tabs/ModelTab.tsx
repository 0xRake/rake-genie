'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Network, Brain, Database, Layers, Shield, Zap } from 'lucide-react';

export function ModelTab() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Palantir Foundry Platform</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            The Operating System for the Modern Enterprise. Create a central digital twin 
            of your organization, enabling decision-making on a shared substrate of truth.
          </p>
        </div>

        {/* Core Capabilities */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Network className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold">The Ontology</h3>
              </div>
              <p className="text-sm text-muted">
                Maps raw data tables to real-world concepts. Decouples data layer from 
                application layer, allowing apps to be built on "Things" not "Rows".
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
                Binding layer that allows LLMs to interact with the Ontology, call tools, 
                and execute actions safely. Not just a chatbot—operational AI.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Data Engineering</h3>
              </div>
              <p className="text-sm text-muted">
                Low-code/no-code pipeline builder with Git-based version control. 
                Connects to any data source and transforms it into usable assets.
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
                Low-code application builder. Snap together widgets, charts, and action 
                forms to create operational interfaces without writing code.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold">Security & Governance</h3>
              </div>
              <p className="text-sm text-muted">
                Granular access control at row and column level. Checkpoints enforce 
                data quality and security policies at runtime.
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
                Continuous delivery platform. Enables autonomous upgrades across 
                heterogeneous environments without downtime.
              </p>
            </Card>
          </div>
        </div>

        {/* Architecture Overview */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Architecture</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Data Layer</h4>
                  <p className="text-xs text-muted">
                    Pipeline Builder, Data Connection, Datasets, Media Sets
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Semantic Layer</h4>
                  <p className="text-xs text-muted">
                    The Ontology: Objects, Properties, Links, Actions, Functions
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">AI Layer</h4>
                  <p className="text-xs text-muted">
                    AIP Core, Logic, Terminal, RAG, Embeddings, LLMs
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Application Layer</h4>
                  <p className="text-xs text-muted">
                    Workshop, Quiver, Contour, OSDK, Custom Apps
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Integration Points */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Integration Capabilities</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Data Sources</h4>
                  <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                    <li>Databases (PostgreSQL, MySQL, SQL Server, Oracle)</li>
                    <li>Cloud Storage (S3, GCS, Azure Blob)</li>
                    <li>ERPs (SAP, Oracle EBS, Microsoft Dynamics)</li>
                    <li>APIs (REST, GraphQL, SOAP)</li>
                    <li>Streaming (Kafka, MQTT, TCP)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">External Systems</h4>
                  <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                    <li>OSDK for custom React/Python apps</li>
                    <li>REST APIs for integration</li>
                    <li>Webhooks for event-driven workflows</li>
                    <li>Actions for write-back to source systems</li>
                    <li>Workshop embeds for external portals</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Why This Matters */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Why This Matters</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Single Source of Truth</h4>
                <p className="text-sm text-muted">
                  The Ontology creates a unified model of your business. No more data silos 
                  or conflicting reports. Everyone works from the same foundation.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. Operational AI</h4>
                <p className="text-sm text-muted">
                  AIP doesn't just answer questions—it executes actions. LLMs can query the 
                  Ontology, call functions, and write back to source systems safely.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">3. Low-Code, High-Value</h4>
                <p className="text-sm text-muted">
                  Build operational applications without writing code. Workshop and Pipeline 
                  Builder abstract complexity while maintaining flexibility.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">4. Enterprise-Grade Security</h4>
                <p className="text-sm text-muted">
                  Row-level and column-level access control. Data governance enforced at 
                  runtime. Audit trails for all operations.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
