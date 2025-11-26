'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Target, TrendingUp, Users, Package, ArrowRight } from 'lucide-react';

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
            Global cosmetics giant with 1.8M sales representatives. Transforming supply 
            chain visibility and sales rep enablement through unified data operations.
          </p>
        </div>

        {/* Current State */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Current State Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 border-destructive/20">
              <h3 className="font-semibold mb-3 text-destructive">Challenges</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Fragmented data across multiple ERPs and systems</li>
                <li>• Limited visibility into supply chain operations</li>
                <li>• Inefficient inventory distribution across regions</li>
                <li>• Sales reps lack real-time product availability</li>
                <li>• Manual reporting processes delay decision-making</li>
                <li>• No unified view of customer interactions</li>
              </ul>
            </Card>

            <Card className="p-6 border-primary/20">
              <h3 className="font-semibold mb-3 text-primary">Opportunities</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Unify data from SAP, Oracle, and regional systems</li>
                <li>• Real-time inventory visibility across all channels</li>
                <li>• AI-powered demand forecasting and optimization</li>
                <li>• Mobile-first sales rep enablement platform</li>
                <li>• Automated reporting and analytics</li>
                <li>• Customer 360 view across all touchpoints</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Proposed Architecture */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Proposed Architecture</h2>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Package size={18} />
                    Data Integration
                  </h4>
                  <p className="text-xs text-muted">
                    Connect SAP, Oracle EBS, regional ERPs, and e-commerce platforms. 
                    Unified schema via Foundry Ontology.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users size={18} />
                    Sales Rep Platform
                  </h4>
                  <p className="text-xs text-muted">
                    Workshop application for 1.8M reps. Real-time inventory, product 
                    recommendations, order management.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Supply Chain Optimization
                  </h4>
                  <p className="text-xs text-muted">
                    AIP-powered demand forecasting. Automated inventory rebalancing. 
                    Predictive analytics for distribution.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold mb-2">Digital Twin</h4>
                <p className="text-sm text-muted">
                  Create a unified digital representation of Natura's operations: products, 
                  inventory, sales reps, customers, orders, and supply chain. Enable real-time 
                  decision-making on a shared substrate of truth.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Integration Roadmap */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Integration Roadmap</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phase 1: Foundation (Weeks 1-4)</h4>
                  <p className="text-sm text-muted">
                    Connect primary ERP systems. Build core Ontology objects (Product, Inventory, 
                    Sales Rep, Customer). Establish data pipelines for critical datasets.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phase 2: Sales Rep Platform (Weeks 5-8)</h4>
                  <p className="text-sm text-muted">
                    Build Workshop application for sales reps. Real-time inventory queries. 
                    Product recommendation engine. Order placement workflow.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phase 3: AI Enhancement (Weeks 9-12)</h4>
                  <p className="text-sm text-muted">
                    Deploy AIP Logic for demand forecasting. Automated inventory rebalancing. 
                    Predictive analytics for supply chain optimization.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phase 4: Scale & Optimize (Weeks 13-16)</h4>
                  <p className="text-sm text-muted">
                    Expand to all regional systems. Advanced analytics dashboards. 
                    Integration with o9 planning platform. Continuous optimization.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ROI Projections */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Expected Outcomes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">30%</div>
              <div className="text-sm text-muted">Reduction in inventory holding costs</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">50%</div>
              <div className="text-sm text-muted">Faster time-to-insight for sales reps</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">25%</div>
              <div className="text-sm text-muted">Improvement in order fulfillment rate</div>
            </Card>
          </div>
        </div>

        {/* Strategic Value */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Strategic Value</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Palantir as the Unifying Integrator</h4>
                <p className="text-sm text-muted">
                  While o9 provides advanced planning capabilities, Palantir Foundry serves as 
                  the unifying integrator that binds the entire organization. Foundry creates 
                  the digital twin, integrates all data sources, and enables o9 to operate on 
                  a clean, unified dataset.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">The Convergence Point</h4>
                <p className="text-sm text-muted">
                  Strategy and tactics converge in Foundry. Strategic planning (o9) meets 
                  operational execution (Foundry) on a shared substrate of truth. This enables 
                  Natura to run the company as a whole, not as disconnected silos.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
