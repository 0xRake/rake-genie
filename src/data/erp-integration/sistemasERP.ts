// ERP Systems Configuration for Natura & Co Integration Demo
// 7 fragmented ERP systems across acquired brands

export interface ERPSchema {
  sku: string;
  unidade: string;
  campos: string[];
  exemplo: string;
}

export interface ERPSystem {
  id: string;
  nome: string;
  tipo: string;
  marca: 'Natura' | 'Avon' | 'Aesop' | 'TBS' | 'Legacy';
  cor: string;
  posicao: { x: number; y: number };
  esquema: ERPSchema;
  latencia: string;
  volumeDiario: string;
  problemas: string[];
}

export interface OntologyObject {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  conexoes: number;
  descricao: string;
}

export interface SKUTrace {
  erp: string;
  codigo: string;
  unidade: string;
  descricao: string;
  quantidade?: number;
}

export interface UnifiedSKU {
  id: string;
  nome: string;
  unidade: string;
  inventarioTotal: number;
  fontesMapeadas: number;
  ultimaAtualizacao: string;
}

// 7 ERP Systems representing the fragmented state
export const sistemasERP: ERPSystem[] = [
  {
    id: 'sap-natura',
    nome: 'SAP Natura',
    tipo: 'SAP S/4HANA',
    marca: 'Natura',
    cor: '#00A859',
    posicao: { x: 80, y: 350 },
    esquema: {
      sku: 'NAT-{CAT}-{NUM}',
      unidade: 'peça',
      campos: ['codigo', 'descricao', 'preco', 'estoque', 'lote'],
      exemplo: 'NAT-CHRO-001'
    },
    latencia: '15min',
    volumeDiario: '2.4M registros',
    problemas: ['Formato SKU diferente de Avon', 'Unidades incompatíveis']
  },
  {
    id: 'oracle-natura',
    nome: 'Oracle Financeiro',
    tipo: 'Oracle EBS',
    marca: 'Natura',
    cor: '#F80000',
    posicao: { x: 180, y: 350 },
    esquema: {
      sku: 'ITEM_{SEQUENCIAL}',
      unidade: 'caixa 12un',
      campos: ['item_id', 'description', 'cost', 'inventory'],
      exemplo: 'ITEM_0012847'
    },
    latencia: '1h',
    volumeDiario: '890K registros',
    problemas: ['Nomenclatura legada', 'Batch processing apenas']
  },
  {
    id: 'legacy-natura',
    nome: 'Legacy Manufatura',
    tipo: 'Sistema Próprio',
    marca: 'Legacy',
    cor: '#6B7280',
    posicao: { x: 280, y: 350 },
    esquema: {
      sku: 'PROD_{NUM}',
      unidade: 'desconhecida',
      campos: ['prod_cod', 'nome', 'qtd'],
      exemplo: 'PROD_8847'
    },
    latencia: 'batch diário',
    volumeDiario: '450K registros',
    problemas: ['Documentação perdida', 'Unidade não padronizada']
  },
  {
    id: 'sap-avon',
    nome: 'SAP Avon',
    tipo: 'SAP ECC',
    marca: 'Avon',
    cor: '#ED1164',
    posicao: { x: 380, y: 350 },
    esquema: {
      sku: 'AV-{LINHA}-{NUM}',
      unidade: 'unidade',
      campos: ['material', 'texto', 'valor', 'saldo'],
      exemplo: 'AV-LIPSTICK-500'
    },
    latencia: '30min',
    volumeDiario: '1.8M registros',
    problemas: ['M&A recente', 'Catálogo duplicado']
  },
  {
    id: 'avon-legacy',
    nome: 'Avon Legacy CRM',
    tipo: 'Salesforce + Custom',
    marca: 'Avon',
    cor: '#FF6B9D',
    posicao: { x: 480, y: 350 },
    esquema: {
      sku: 'SKU_{AVON_ID}',
      unidade: 'kit',
      campos: ['sku_id', 'product_name', 'rep_price'],
      exemplo: 'SKU_AVN_88234'
    },
    latencia: '4h',
    volumeDiario: '320K registros',
    problemas: ['1.8M representantes', 'Dados offline']
  },
  {
    id: 'aesop-system',
    nome: 'Aesop Global',
    tipo: 'Custom ERP',
    marca: 'Aesop',
    cor: '#2D2D2D',
    posicao: { x: 580, y: 350 },
    esquema: {
      sku: 'AES-{REGIAO}-{COD}',
      unidade: 'ml',
      campos: ['product_code', 'name_en', 'rrp_aud', 'stock'],
      exemplo: 'AES-APAC-RHB25'
    },
    latencia: '2h',
    volumeDiario: '180K registros',
    problemas: ['Moeda AUD', 'Timezone APAC']
  },
  {
    id: 'tbs-erp',
    nome: 'TBS SAP',
    tipo: 'SAP Business One',
    marca: 'TBS',
    cor: '#006B54',
    posicao: { x: 680, y: 350 },
    esquema: {
      sku: 'TBS-{CAT}-{NUM}',
      unidade: 'piece',
      campos: ['item_code', 'item_name', 'price', 'on_hand'],
      exemplo: 'TBS-BODY-TEA30'
    },
    latencia: '45min',
    volumeDiario: '210K registros',
    problemas: ['Nomenclatura UK', 'Integração parcial']
  }
];

// Ontology objects representing the unified data model
export const objetosOntologia: OntologyObject[] = [
  {
    id: 'ont-sku',
    nome: 'SKU Unificado',
    icone: '📦',
    cor: '#3B82F6',
    conexoes: 7,
    descricao: 'Identificador único de produto normalizado'
  },
  {
    id: 'ont-cliente',
    nome: 'Cliente',
    icone: '👤',
    cor: '#8B5CF6',
    conexoes: 5,
    descricao: 'Entidade cliente unificada (B2B + B2C + Reps)'
  },
  {
    id: 'ont-inventario',
    nome: 'Inventário',
    icone: '📊',
    cor: '#F59E0B',
    conexoes: 7,
    descricao: 'Posição de estoque real-time'
  },
  {
    id: 'ont-planta',
    nome: 'Planta',
    icone: '🏭',
    cor: '#10B981',
    conexoes: 4,
    descricao: 'Unidade de manufatura/CD'
  },
  {
    id: 'ont-fornecedor',
    nome: 'Fornecedor',
    icone: '🚚',
    cor: '#EF4444',
    conexoes: 3,
    descricao: 'Cadeia de suprimentos upstream'
  },
  {
    id: 'ont-pedido',
    nome: 'Pedido',
    icone: '📋',
    cor: '#6366F1',
    conexoes: 6,
    descricao: 'Transação comercial unificada'
  },
  {
    id: 'ont-forecast',
    nome: 'Forecast',
    icone: '📈',
    cor: '#EC4899',
    conexoes: 4,
    descricao: 'Previsão de demanda ML'
  },
  {
    id: 'ont-qualidade',
    nome: 'Qualidade',
    icone: '✅',
    cor: '#14B8A6',
    conexoes: 3,
    descricao: 'Métricas de qualidade de dados'
  }
];

// Example SKU trace showing fragmentation
export const exemploRastreamentoSKU: {
  produto: string;
  semFoundry: SKUTrace[];
  comFoundry: UnifiedSKU;
} = {
  produto: 'Batom Vermelho Classic',
  semFoundry: [
    {
      erp: 'SAP Natura',
      codigo: 'NAT-BAT-001',
      unidade: 'peça',
      descricao: 'BATOM VERMELHO NATURA',
      quantidade: 45000
    },
    {
      erp: 'Oracle Financeiro',
      codigo: 'ITEM_0098234',
      unidade: 'caixa 12un',
      descricao: 'Batom Vermelho Cx',
      quantidade: 3750
    },
    {
      erp: 'SAP Avon',
      codigo: 'AV-LIPSTICK-500',
      unidade: 'unidade',
      descricao: 'COLOR TREND LIPSTICK RED',
      quantidade: 67000
    },
    {
      erp: 'Legacy Manufatura',
      codigo: 'PROD_123',
      unidade: '???',
      descricao: 'BATOM VERM',
      quantidade: 12400
    }
  ],
  comFoundry: {
    id: 'SKU-000456',
    nome: 'Batom Vermelho Natura Classic',
    unidade: 'peça',
    inventarioTotal: 125430,
    fontesMapeadas: 4,
    ultimaAtualizacao: '2024-11-26T10:30:00Z'
  }
};

// Data quality issues in fragmented state
export const problemasQualidadeDados = [
  {
    tipo: 'Duplicação',
    quantidade: '23,456 SKUs',
    impacto: 'R$ 12M estoque fantasma',
    exemplo: 'Mesmo produto com 4 códigos diferentes'
  },
  {
    tipo: 'Inconsistência',
    quantidade: '18,234 registros',
    impacto: 'Forecast 30% impreciso',
    exemplo: 'Unidades: peça vs caixa vs kit'
  },
  {
    tipo: 'Latência',
    quantidade: '4-24h atraso',
    impacto: 'Decisões com dados obsoletos',
    exemplo: 'Venda ontem, visibilidade amanhã'
  },
  {
    tipo: 'Incompletude',
    quantidade: '8,900 SKUs',
    impacto: 'Ruptura por invisibilidade',
    exemplo: 'Campo fornecedor vazio em 15%'
  }
];
