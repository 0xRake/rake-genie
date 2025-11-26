// Natura & Co Inventory Data - 12 Warehouses across Brazil

export interface InventoryItem {
  sku: string;
  productName: string;
  quantity: number;
  coverageDays: number;
  status: 'healthy' | 'excess' | 'stockout';
  unitValue: number;
  lastSaleDate?: string;
  demandForecast?: number;
  supplier?: string;
}

export interface WarehouseMetrics {
  totalValue: number;
  excessValue: number;
  stockoutRisk: number;
  excessSKUs: number;
  stockoutSKUs: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  region: 'Sudeste' | 'Sul' | 'Nordeste' | 'Norte' | 'Centro-Oeste';
  brand: 'Natura' | 'Avon' | 'Aesop' | 'The Body Shop';
  inventory: InventoryItem[];
  metrics: WarehouseMetrics;
}

export interface ConsolidatedMetrics {
  totalInventoryValue: number;
  totalExcess: number;
  totalStockoutRisk: number;
  wasteOpportunity: number;
}

export interface InventoryData {
  warehouses: Warehouse[];
  consolidated: ConsolidatedMetrics;
}

export const inventoryData: InventoryData = {
  warehouses: [
    {
      id: 'WH-SP-CAJ',
      name: 'Cajamar Distribution Center',
      location: { lat: -23.3558, lng: -46.8769 },
      region: 'Sudeste',
      brand: 'Natura',
      inventory: [
        {
          sku: 'NAT-CHRO-SER-030',
          productName: 'Chronos Anti-idade Sérum 30ml',
          quantity: 42300,
          coverageDays: 214,
          status: 'excess',
          unitValue: 89.90,
          lastSaleDate: '2024-04-15',
          supplier: 'Planta Benevides (PA)'
        },
        {
          sku: 'NAT-TODO-HID-400',
          productName: 'Tododia Hidratante Corporal 400ml',
          quantity: 8400,
          coverageDays: 9,
          status: 'stockout',
          unitValue: 45.90,
          demandForecast: 12100
        },
        {
          sku: 'NAT-EKOS-SAB-250',
          productName: 'Ekos Sabonete Maracujá 250g',
          quantity: 15600,
          coverageDays: 45,
          status: 'healthy',
          unitValue: 32.50,
          supplier: 'Planta Benevides (PA)'
        },
        {
          sku: 'NAT-LUNA-PERF-100',
          productName: 'Luna Perfume Feminino 100ml',
          quantity: 28900,
          coverageDays: 198,
          status: 'excess',
          unitValue: 189.90,
          lastSaleDate: '2024-03-28'
        }
      ],
      metrics: {
        totalValue: 12847000,
        excessValue: 8234000,
        stockoutRisk: 2187000,
        excessSKUs: 6,
        stockoutSKUs: 2
      }
    },
    {
      id: 'WH-PE-REC',
      name: 'Recife Distribution Center',
      location: { lat: -8.0476, lng: -34.8770 },
      region: 'Nordeste',
      brand: 'Avon',
      inventory: [
        {
          sku: 'AVO-CHRO-SER-030',
          productName: 'Chronos 30mL Serum',
          quantity: 1200,
          coverageDays: 5,
          status: 'stockout',
          unitValue: 89.90,
          demandForecast: 8700
        },
        {
          sku: 'AVO-COLOR-BAT-045',
          productName: 'Color Trend Batom Matte 4.5g',
          quantity: 34500,
          coverageDays: 156,
          status: 'healthy',
          unitValue: 24.99
        },
        {
          sku: 'AVO-RENEW-CRE-050',
          productName: 'Renew Creme Anti-idade 50ml',
          quantity: 890,
          coverageDays: 4,
          status: 'stockout',
          unitValue: 129.90,
          demandForecast: 6200
        }
      ],
      metrics: {
        totalValue: 4523000,
        excessValue: 340000,
        stockoutRisk: 6890000,
        excessSKUs: 1,
        stockoutSKUs: 8
      }
    },
    {
      id: 'WH-RS-POA',
      name: 'Porto Alegre Distribution Center',
      location: { lat: -30.0346, lng: -51.2177 },
      region: 'Sul',
      brand: 'Natura',
      inventory: [
        {
          sku: 'NAT-MAMAE-OLE-200',
          productName: 'Mamãe e Bebê Óleo 200ml',
          quantity: 18700,
          coverageDays: 67,
          status: 'healthy',
          unitValue: 54.90
        },
        {
          sku: 'NAT-KAIAK-DEO-100',
          productName: 'Kaiak Aventura Desodorante 100ml',
          quantity: 52100,
          coverageDays: 245,
          status: 'excess',
          unitValue: 79.90,
          lastSaleDate: '2024-02-10'
        }
      ],
      metrics: {
        totalValue: 6234000,
        excessValue: 4162000,
        stockoutRisk: 890000,
        excessSKUs: 3,
        stockoutSKUs: 1
      }
    },
    {
      id: 'WH-AM-MAN',
      name: 'Manaus Distribution Center',
      location: { lat: -3.1190, lng: -60.0217 },
      region: 'Norte',
      brand: 'Natura',
      inventory: [
        {
          sku: 'NAT-EKOS-PAT-250',
          productName: 'Ekos Patauá Hidratante 250ml',
          quantity: 4200,
          coverageDays: 12,
          status: 'stockout',
          unitValue: 67.90,
          demandForecast: 11200
        },
        {
          sku: 'NAT-EKOS-CAS-120',
          productName: 'Ekos Castanha Óleo 120ml',
          quantity: 8900,
          coverageDays: 34,
          status: 'healthy',
          unitValue: 82.90
        }
      ],
      metrics: {
        totalValue: 3456000,
        excessValue: 234000,
        stockoutRisk: 2890000,
        excessSKUs: 0,
        stockoutSKUs: 4
      }
    },
    {
      id: 'WH-GO-GYN',
      name: 'Goiânia Distribution Center',
      location: { lat: -16.6869, lng: -49.2648 },
      region: 'Centro-Oeste',
      brand: 'Avon',
      inventory: [
        {
          sku: 'AVO-PERF-FAR-100',
          productName: 'Far Away Perfume 100ml',
          quantity: 31200,
          coverageDays: 189,
          status: 'excess',
          unitValue: 159.90,
          lastSaleDate: '2024-04-02'
        },
        {
          sku: 'AVO-SKIN-TON-200',
          productName: 'Skin So Soft Tônico 200ml',
          quantity: 12400,
          coverageDays: 56,
          status: 'healthy',
          unitValue: 39.90
        }
      ],
      metrics: {
        totalValue: 5678000,
        excessValue: 4989000,
        stockoutRisk: 345000,
        excessSKUs: 2,
        stockoutSKUs: 0
      }
    },
    {
      id: 'WH-MG-BHZ',
      name: 'Belo Horizonte Distribution Center',
      location: { lat: -19.9167, lng: -43.9345 },
      region: 'Sudeste',
      brand: 'Natura',
      inventory: [
        {
          sku: 'NAT-UNA-PERF-075',
          productName: 'Una Perfume Feminino 75ml',
          quantity: 19800,
          coverageDays: 134,
          status: 'healthy',
          unitValue: 234.90
        },
        {
          sku: 'NAT-HORIZ-DEO-100',
          productName: 'Homem Horizonte Deo 100ml',
          quantity: 7600,
          coverageDays: 8,
          status: 'stockout',
          unitValue: 119.90,
          demandForecast: 9800
        }
      ],
      metrics: {
        totalValue: 7123000,
        excessValue: 1234000,
        stockoutRisk: 3456000,
        excessSKUs: 1,
        stockoutSKUs: 3
      }
    },
    {
      id: 'WH-BA-SSA',
      name: 'Salvador Distribution Center',
      location: { lat: -12.9714, lng: -38.5014 },
      region: 'Nordeste',
      brand: 'Avon',
      inventory: [
        {
          sku: 'AVO-MEGA-RIM-012',
          productName: 'Mega Effects Rímel 12ml',
          quantity: 67800,
          coverageDays: 287,
          status: 'excess',
          unitValue: 34.90,
          lastSaleDate: '2024-01-15'
        },
        {
          sku: 'AVO-CARE-LOC-400',
          productName: 'Care Loção Corporal 400ml',
          quantity: 23400,
          coverageDays: 89,
          status: 'healthy',
          unitValue: 29.90
        }
      ],
      metrics: {
        totalValue: 3987000,
        excessValue: 2365000,
        stockoutRisk: 567000,
        excessSKUs: 2,
        stockoutSKUs: 1
      }
    },
    {
      id: 'WH-PR-CWB',
      name: 'Curitiba Distribution Center',
      location: { lat: -25.4290, lng: -49.2671 },
      region: 'Sul',
      brand: 'The Body Shop',
      inventory: [
        {
          sku: 'TBS-BRIT-ROSE-060',
          productName: 'British Rose Body Butter 60ml',
          quantity: 8900,
          coverageDays: 156,
          status: 'healthy',
          unitValue: 89.00
        },
        {
          sku: 'TBS-TEA-TREE-030',
          productName: 'Tea Tree Oil 30ml',
          quantity: 2100,
          coverageDays: 6,
          status: 'stockout',
          unitValue: 59.00,
          demandForecast: 8900
        }
      ],
      metrics: {
        totalValue: 2345000,
        excessValue: 189000,
        stockoutRisk: 1678000,
        excessSKUs: 0,
        stockoutSKUs: 2
      }
    },
    {
      id: 'WH-RJ-RIO',
      name: 'Rio de Janeiro Distribution Center',
      location: { lat: -22.9068, lng: -43.1729 },
      region: 'Sudeste',
      brand: 'Aesop',
      inventory: [
        {
          sku: 'AES-RESUR-SER-025',
          productName: 'Resurrection Aromatique Hand Balm 25ml',
          quantity: 4500,
          coverageDays: 234,
          status: 'excess',
          unitValue: 145.00,
          lastSaleDate: '2024-03-01'
        },
        {
          sku: 'AES-PARS-PERF-050',
          productName: 'Parsley Seed Serum 50ml',
          quantity: 3200,
          coverageDays: 78,
          status: 'healthy',
          unitValue: 289.00
        }
      ],
      metrics: {
        totalValue: 4567000,
        excessValue: 652000,
        stockoutRisk: 234000,
        excessSKUs: 1,
        stockoutSKUs: 0
      }
    },
    {
      id: 'WH-CE-FOR',
      name: 'Fortaleza Distribution Center',
      location: { lat: -3.7172, lng: -38.5433 },
      region: 'Nordeste',
      brand: 'Natura',
      inventory: [
        {
          sku: 'NAT-EKOS-ACU-200',
          productName: 'Ekos Açaí Hidratante 200ml',
          quantity: 890,
          coverageDays: 3,
          status: 'stockout',
          unitValue: 56.90,
          demandForecast: 7800
        },
        {
          sku: 'NAT-FACES-BASE-030',
          productName: 'Faces Base Líquida 30ml',
          quantity: 45600,
          coverageDays: 203,
          status: 'excess',
          unitValue: 49.90,
          lastSaleDate: '2024-02-20'
        }
      ],
      metrics: {
        totalValue: 2890000,
        excessValue: 2275000,
        stockoutRisk: 1456000,
        excessSKUs: 2,
        stockoutSKUs: 3
      }
    },
    {
      id: 'WH-SC-FLN',
      name: 'Florianópolis Distribution Center',
      location: { lat: -27.5954, lng: -48.5480 },
      region: 'Sul',
      brand: 'Natura',
      inventory: [
        {
          sku: 'NAT-ESSENC-PERF-100',
          productName: 'Essencial Perfume 100ml',
          quantity: 16700,
          coverageDays: 112,
          status: 'healthy',
          unitValue: 179.90
        },
        {
          sku: 'NAT-LUMINA-SHAM-300',
          productName: 'Lumina Shampoo 300ml',
          quantity: 39200,
          coverageDays: 198,
          status: 'excess',
          unitValue: 38.90,
          lastSaleDate: '2024-03-15'
        }
      ],
      metrics: {
        totalValue: 4523000,
        excessValue: 1524000,
        stockoutRisk: 678000,
        excessSKUs: 1,
        stockoutSKUs: 1
      }
    },
    {
      id: 'WH-PA-BEL',
      name: 'Belém Distribution Center',
      location: { lat: -1.4558, lng: -48.4902 },
      region: 'Norte',
      brand: 'Natura',
      inventory: [
        {
          sku: 'NAT-EKOS-BUR-150',
          productName: 'Ekos Buriti Óleo 150ml',
          quantity: 12300,
          coverageDays: 67,
          status: 'healthy',
          unitValue: 72.90
        },
        {
          sku: 'NAT-EKOS-MUR-200',
          productName: 'Ekos Murumuru Manteiga 200ml',
          quantity: 5600,
          coverageDays: 11,
          status: 'stockout',
          unitValue: 64.90,
          demandForecast: 13400
        }
      ],
      metrics: {
        totalValue: 2061000,
        excessValue: 345000,
        stockoutRisk: 1789000,
        excessSKUs: 0,
        stockoutSKUs: 2
      }
    }
  ],
  consolidated: {
    totalInventoryValue: 87234000,
    totalExcess: 34567000,
    totalStockoutRisk: 18932000,
    wasteOpportunity: 53499000
  }
};

// Helper function to get warehouse by ID
export function getWarehouseById(id: string): Warehouse | undefined {
  return inventoryData.warehouses.find(w => w.id === id);
}

// Helper function to get all warehouses by region
export function getWarehousesByRegion(region: Warehouse['region']): Warehouse[] {
  return inventoryData.warehouses.filter(w => w.region === region);
}

// Helper function to get all warehouses by brand
export function getWarehousesByBrand(brand: Warehouse['brand']): Warehouse[] {
  return inventoryData.warehouses.filter(w => w.brand === brand);
}

// Helper function to calculate aggregate status for a warehouse
export function getWarehouseStatus(warehouse: Warehouse): 'healthy' | 'excess' | 'stockout' {
  const stockoutCount = warehouse.inventory.filter(i => i.status === 'stockout').length;
  const excessCount = warehouse.inventory.filter(i => i.status === 'excess').length;

  if (stockoutCount > excessCount) return 'stockout';
  if (excessCount > stockoutCount) return 'excess';
  return 'healthy';
}
