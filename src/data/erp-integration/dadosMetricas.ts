// Metrics Data for Natura & Co Foundry Integration ROI

export interface MetricaComparacao {
  metrica: string;
  atual: string;
  foundry: string;
  valorAnual: string;
  icone: string;
  destaque?: boolean;
}

export interface MetricaTecnica {
  capacidade: string;
  tradicional: string;
  foundry: string;
  reducao: string;
}

export interface EventoTimeline {
  tempo: string;
  acao: string;
  status: 'erro' | 'alerta' | 'sucesso' | 'neutro';
}

export interface SimulacaoChoque {
  evento: string;
  descricao: string;
  semFoundry: {
    timeline: EventoTimeline[];
    resultado: {
      rupturas: number;
      perdaVendas: string;
      tempoResposta: string;
    };
  };
  comFoundry: {
    timeline: EventoTimeline[];
    resultado: {
      rupturas: number;
      custoExtra: string;
      economiaLiquida: string;
      tempoResposta: string;
    };
  };
}

// Main ROI comparison metrics
export const metricasComparacao: MetricaComparacao[] = [
  {
    metrica: 'Reconciliação de dados',
    atual: 'Semanas',
    foundry: 'Horas',
    valorAnual: 'R$ 5M/ano em FTEs',
    icone: '⏱️',
    destaque: false
  },
  {
    metrica: 'Acurácia do forecast',
    atual: '~70%',
    foundry: '~85%+',
    valorAnual: 'R$ 50M/ano otimização estoque',
    icone: '📊',
    destaque: true
  },
  {
    metrica: 'Visibilidade inventário (1.8M reps)',
    atual: '0%',
    foundry: '100%',
    valorAnual: 'R$ 100M+ ruptura evitada',
    icone: '👁️',
    destaque: true
  },
  {
    metrica: 'Ciclo integração M&A',
    atual: '18-24 meses',
    foundry: '3-6 meses',
    valorAnual: 'Velocidade de sinergias',
    icone: '🔗'
  },
  {
    metrica: 'Tempo detecção anomalia',
    atual: 'Dias/Semanas',
    foundry: 'Minutos',
    valorAnual: 'R$ 20M/ano prevenção fraude',
    icone: '🚨'
  },
  {
    metrica: 'Custo de manutenção ETL',
    atual: 'R$ 8M/ano',
    foundry: 'R$ 2M/ano',
    valorAnual: 'R$ 6M/ano economia',
    icone: '🔧'
  }
];

// Technical capabilities comparison
export const metricasTecnicas: MetricaTecnica[] = [
  {
    capacidade: 'Integrar 7 fontes ERP',
    tradicional: '6-12 meses',
    foundry: '5 dias',
    reducao: '98%'
  },
  {
    capacidade: 'Criar ontologia unificada',
    tradicional: '8-18 meses',
    foundry: '1-2 semanas',
    reducao: '97%'
  },
  {
    capacidade: 'Workflow Bill of Materials',
    tradicional: '3-6 meses dev',
    foundry: '1 semana (out-of-box)',
    reducao: '95%'
  },
  {
    capacidade: 'Latência sincronização',
    tradicional: 'Batch semanal',
    foundry: '<1 hora real-time',
    reducao: '99%'
  },
  {
    capacidade: 'Dashboards executivos',
    tradicional: '2-4 semanas',
    foundry: '2-4 horas',
    reducao: '96%'
  },
  {
    capacidade: 'Modelo ML de demanda',
    tradicional: '6-12 meses',
    foundry: '2-4 semanas',
    reducao: '90%'
  }
];

// Supply chain shock simulation scenarios
export const simulacaoChoque: SimulacaoChoque = {
  evento: 'Atraso fornecedor 7 dias',
  descricao: 'Fornecedor de embalagens anuncia atraso inesperado de 7 dias na entrega',

  semFoundry: {
    timeline: [
      {
        tempo: 'Dia 1-3',
        acao: 'Nenhum sistema detecta impacto',
        status: 'erro'
      },
      {
        tempo: 'Dia 4',
        acao: 'Planta Benevides nota falta de insumo',
        status: 'alerta'
      },
      {
        tempo: 'Dia 5',
        acao: 'E-mails manuais entre equipes de supply',
        status: 'neutro'
      },
      {
        tempo: 'Dia 6',
        acao: 'Criação de planilha Excel para reconciliação',
        status: 'neutro'
      },
      {
        tempo: 'Dia 7',
        acao: 'Reunião de crise convocada',
        status: 'alerta'
      },
      {
        tempo: 'Dia 8-9',
        acao: 'Levantamento manual em 7 ERPs',
        status: 'erro'
      },
      {
        tempo: 'Dia 10',
        acao: 'Decisão tomada (tarde demais)',
        status: 'erro'
      }
    ],
    resultado: {
      rupturas: 45,
      perdaVendas: 'R$ 2.1M',
      tempoResposta: '10 dias'
    }
  },

  comFoundry: {
    timeline: [
      {
        tempo: 'Hora 1',
        acao: 'Detecção automática via pipeline de supply',
        status: 'sucesso'
      },
      {
        tempo: 'Hora 2',
        acao: 'Alerta propagado para ontologia de SKU afetados',
        status: 'sucesso'
      },
      {
        tempo: 'Hora 3',
        acao: 'Cálculo automático de impacto em cascata',
        status: 'sucesso'
      },
      {
        tempo: 'Hora 4',
        acao: 'ML sugere 3 cenários de mitigação',
        status: 'sucesso'
      },
      {
        tempo: 'Hora 5',
        acao: 'Decisão executiva via dashboard',
        status: 'sucesso'
      },
      {
        tempo: 'Hora 6',
        acao: 'Ação propagada automaticamente para todos ERPs',
        status: 'sucesso'
      }
    ],
    resultado: {
      rupturas: 0,
      custoExtra: 'R$ 150K (logística emergencial)',
      economiaLiquida: 'R$ 1.95M',
      tempoResposta: '6 horas'
    }
  }
};

// KPI summary for executive view
export const kpiResumo = {
  valorTotalAnual: 'R$ 181M',
  breakdown: [
    { categoria: 'Otimização de estoque', valor: 'R$ 50M' },
    { categoria: 'Ruptura evitada', valor: 'R$ 100M' },
    { categoria: 'Eficiência FTEs', valor: 'R$ 11M' },
    { categoria: 'Prevenção fraude', valor: 'R$ 20M' }
  ],
  paybackPeriodo: '4-6 meses',
  roiTresAnos: '12x'
};

// Forecast accuracy improvement data
export const dadosForecast = {
  antes: {
    acuracia: 70,
    desvio: 15,
    confianca: 60
  },
  depois: {
    acuracia: 87,
    desvio: 6,
    confianca: 92
  },
  melhoriaPercentual: 24,
  metodologia: 'ML Ensemble com dados unificados de 7 ERPs'
};

// Integration timeline comparison
export const timelineIntegracao = {
  tradicional: [
    { fase: 'Levantamento requisitos', semanas: 8 },
    { fase: 'Mapeamento de dados', semanas: 12 },
    { fase: 'Desenvolvimento ETL', semanas: 24 },
    { fase: 'Testes e validação', semanas: 16 },
    { fase: 'Deploy e estabilização', semanas: 12 }
  ],
  foundry: [
    { fase: 'Conectores nativos', semanas: 1 },
    { fase: 'Ontologia inicial', semanas: 2 },
    { fase: 'Pipelines automatizados', semanas: 1 },
    { fase: 'Validação com usuários', semanas: 2 },
    { fase: 'Produção', semanas: 1 }
  ],
  totalTradicional: 72,
  totalFoundry: 7
};

export default {
  metricasComparacao,
  metricasTecnicas,
  simulacaoChoque,
  kpiResumo,
  dadosForecast,
  timelineIntegracao
};
