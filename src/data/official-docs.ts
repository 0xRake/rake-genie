/**
 * Official Palantir Foundry Documentation - Knowledge Graph Data
 * Extracted from official Palantir documentation sources
 */

export interface KnowledgeNode {
  id: string;
  label: string;
  description: string;
  category: 'ontology' | 'aip' | 'data-integration' | 'devops' | 'applications' | 'security' | 'analytics' | 'core';
  officialUrl?: string;
  officialDescription?: string;
  examples?: string[];
  relatedConcepts?: string[];
  size?: number; // For visualization
  color?: string;
  icon?: string;
}

export interface KnowledgeLink {
  id: string;
  source: string;
  target: string;
  type: 'contains' | 'uses' | 'creates' | 'enables' | 'integrates' | 'powers' | 'manages' | 'connects' | 'modifies' | 'processes';
  strength: number; // 0-1, for visualization
  description?: string;
  traversalCount?: number; // Track how many times this path is traversed
}

// Official Palantir Foundry Ontology Concepts
export const ONTOLOGY_NODES: KnowledgeNode[] = [
  {
    id: 'ontology',
    label: 'Ontology',
    description: 'The Palantir Ontology is an operational layer for the organization. It sits on top of digital assets and connects them to real-world counterparts.',
    category: 'core',
    officialUrl: 'https://www.palantir.com/docs/foundry/ontology/overview',
    officialDescription: 'The Ontology serves as a digital twin of the organization, containing both semantic elements (objects, properties, links) and kinetic elements (actions, functions, dynamic security).',
    examples: ['Digital twin of organization', 'Semantic layer for data', 'Operational layer'],
    relatedConcepts: ['Object Types', 'Link Types', 'Action Types', 'Functions'],
    size: 60,
    color: '#ffffff'
  },
  {
    id: 'object-type',
    label: 'Object Type',
    description: 'The schema definition of a real-world entity or event. An object is a single instance of an object type.',
    category: 'ontology',
    officialUrl: 'https://www.palantir.com/docs/foundry/ontology/core-concepts#object-type',
    officialDescription: 'An object type defines an entity or event in an organization. An object set refers to a collection of multiple object instances.',
    examples: ['Customer', 'Product', 'Transaction', 'Order'],
    relatedConcepts: ['Property', 'Link Type', 'Object Set'],
    size: 35,
    color: '#10b981'
  },
  {
    id: 'property',
    label: 'Property',
    description: 'A property of an object type is the schema definition of a characteristic of a real-world entity or event.',
    category: 'ontology',
    officialUrl: 'https://www.palantir.com/docs/foundry/ontology/core-concepts#property',
    officialDescription: 'A property value refers to the value of a property on an object, or a single instance of that real world entity or event.',
    examples: ['Customer Name', 'Product Price', 'Transaction Amount'],
    relatedConcepts: ['Object Type', 'Shared Property'],
    size: 25,
    color: '#10b981'
  },
  {
    id: 'link-type',
    label: 'Link Type',
    description: 'The schema definition of a relationship between two object types. A link refers to a single instance of that relationship.',
    category: 'ontology',
    officialUrl: 'https://www.palantir.com/docs/foundry/ontology/core-concepts#link-type',
    officialDescription: 'Link types define relationships between object types, enabling graph-based queries and navigation.',
    examples: ['Customer owns Product', 'Order contains Items', 'Employee works for Department'],
    relatedConcepts: ['Object Type', 'Property'],
    size: 30,
    color: '#10b981'
  },
  {
    id: 'action-type',
    label: 'Action Type',
    description: 'The schema definition of a set of changes or edits to objects, property values, and links that a user can take at once.',
    category: 'ontology',
    officialUrl: 'https://www.palantir.com/docs/foundry/ontology/core-concepts#action-type',
    officialDescription: 'Action types enable you to capture data from operators or orchestrate decision-making processes that connect to existing systems.',
    examples: ['Create Order', 'Update Customer', 'Approve Transaction'],
    relatedConcepts: ['Object Type', 'Functions', 'Webhooks'],
    size: 32,
    color: '#10b981'
  },
  {
    id: 'functions',
    label: 'Functions',
    description: 'A piece of code-based logic that takes input parameters and returns an output. Functions are natively integrated with the Ontology.',
    category: 'ontology',
    officialUrl: 'https://www.palantir.com/docs/foundry/ontology/core-concepts#functions',
    officialDescription: 'Functions can take objects and object sets as input, read property values, and be used across action types and applications.',
    examples: ['TypeScript Functions', 'Python Functions', 'External Functions'],
    relatedConcepts: ['Action Type', 'Object Type'],
    size: 28,
    color: '#10b981'
  },
  {
    id: 'interfaces',
    label: 'Interfaces',
    description: 'An Ontology type that describes the shape of an object type and its capabilities. Interfaces provide object type polymorphism.',
    category: 'ontology',
    officialUrl: 'https://www.palantir.com/docs/foundry/interfaces/interface-overview',
    officialDescription: 'Interfaces allow for consistent modeling of and interaction with object types that share a common shape.',
    examples: ['Payment Interface', 'Address Interface'],
    relatedConcepts: ['Object Type'],
    size: 26,
    color: '#10b981'
  },
  {
    id: 'object-views',
    label: 'Object Views',
    description: 'A central hub for all information and workflows related to a particular object.',
    category: 'applications',
    officialUrl: 'https://www.palantir.com/docs/foundry/ontology/core-concepts#object-views',
    officialDescription: 'Object Views include key information about an object, linked objects, related metrics, analyses, dashboards, and applications.',
    examples: ['Customer View', 'Product View'],
    relatedConcepts: ['Object Type', 'Workshop'],
    size: 30,
    color: '#ec4899'
  }
];

// AIP (Artificial Intelligence Platform) Concepts
export const AIP_NODES: KnowledgeNode[] = [
  {
    id: 'aip',
    label: 'AI Platform (AIP)',
    description: 'Palantir\'s Artificial Intelligence Platform connects AI with your data and operations.',
    category: 'aip',
    officialUrl: 'https://www.palantir.com/docs/foundry/aip/overview',
    officialDescription: 'AIP is designed to drive automation across operational processes, providing tools for everyone from developers to frontline users.',
    examples: ['LLM-powered workflows', 'AI agents', 'Semantic search'],
    relatedConcepts: ['AIP Logic', 'AIP Agent Studio', 'AIP Evals'],
    size: 55,
    color: '#f59e0b'
  },
  {
    id: 'aip-logic',
    label: 'AIP Logic',
    description: 'Builder tools for developing production-ready AI-powered workflows, agents, and functions.',
    category: 'aip',
    officialUrl: 'https://www.palantir.com/docs/foundry/aip/overview',
    officialDescription: 'AIP Logic enables the development of AI-powered workflows on top of the Ontology and developer toolchain.',
    examples: ['LLM Chains', 'AI Tools', 'Semantic Search'],
    relatedConcepts: ['AIP', 'Functions', 'Ontology'],
    size: 35,
    color: '#f59e0b'
  },
  {
    id: 'aip-agent-studio',
    label: 'AIP Agent Studio',
    description: 'Tool for building autonomous AI agents that reason and act.',
    category: 'aip',
    officialDescription: 'Enables development of autonomous agents that can interact with the Ontology.',
    examples: ['Voice agents', 'Chat agents', 'Workflow agents'],
    relatedConcepts: ['AIP', 'AIP Logic'],
    size: 32,
    color: '#f59e0b'
  }
];

// Data Integration Concepts
export const DATA_INTEGRATION_NODES: KnowledgeNode[] = [
  {
    id: 'data-connection',
    label: 'Data Connection',
    description: 'Provides connectivity between Foundry and your systems.',
    category: 'data-integration',
    officialUrl: 'https://www.palantir.com/docs/foundry/data-integration/source-type-overview',
    officialDescription: 'The Data Connection application provides connectivity between Foundry and your systems through various connectors.',
    examples: ['SAP', 'Oracle', 'Salesforce', 'S3', 'Kafka'],
    relatedConcepts: ['Connectors', 'Datasets', 'Virtual Tables'],
    size: 45,
    color: '#3b82f6'
  },
  {
    id: 'connectors',
    label: 'Connectors',
    description: 'Available connectors for filesystems, databases, data warehouses, ERP/CRM, streaming sources, NoSQL stores, and REST APIs.',
    category: 'data-integration',
    officialUrl: 'https://www.palantir.com/docs/foundry/data-integration/source-type-overview',
    officialDescription: 'Connectors enable integration with filesystems, blob stores, JDBC sources, streaming sources, NoSQL stores, REST APIs, IoT/IIoT, geospatial systems, and productivity tools.',
    examples: ['Amazon S3', 'PostgreSQL', 'Snowflake', 'SAP', 'Kafka', 'MongoDB'],
    relatedConcepts: ['Data Connection', 'Datasets'],
    size: 40,
    color: '#3b82f6'
  },
  {
    id: 'datasets',
    label: 'Datasets',
    description: 'Structured data stored in Foundry.',
    category: 'data-integration',
    officialDescription: 'Datasets are the primary data storage format in Foundry.',
    examples: ['Customer Dataset', 'Product Dataset'],
    relatedConcepts: ['Data Connection', 'Pipelines'],
    size: 35,
    color: '#3b82f6'
  },
  {
    id: 'pipelines',
    label: 'Pipelines',
    description: 'Data transformation workflows that process and transform data.',
    category: 'data-integration',
    officialUrl: 'https://www.palantir.com/docs/foundry/building-pipelines/create-batch-pipeline-pb-media-set',
    officialDescription: 'Pipelines enable batch and streaming data processing with transforms.',
    examples: ['Batch Pipeline', 'Streaming Pipeline'],
    relatedConcepts: ['Pipeline Builder', 'Code Repositories', 'Transforms'],
    size: 38,
    color: '#3b82f6'
  },
  {
    id: 'pipeline-builder',
    label: 'Pipeline Builder',
    description: 'No-code tool for creating pipelines visually.',
    category: 'data-integration',
    officialDescription: 'Pipeline Builder enables visual creation of data pipelines without code.',
    examples: ['Media set pipelines', 'Dataset pipelines'],
    relatedConcepts: ['Pipelines', 'Transforms'],
    size: 30,
    color: '#3b82f6'
  }
];

// DevOps Concepts
export const DEVOPS_NODES: KnowledgeNode[] = [
  {
    id: 'foundry-devops',
    label: 'Foundry DevOps',
    description: 'Enables rapid development and deployment of packages of data-backed workflows.',
    category: 'devops',
    officialUrl: 'https://www.palantir.com/docs/foundry/devops/overview',
    officialDescription: 'Foundry DevOps enables flexible packaging, automated version management, release channels, and fleet management.',
    examples: ['Product distribution', 'Release management', 'Fleet management'],
    relatedConcepts: ['Marketplace', 'Products', 'Installations'],
    size: 42,
    color: '#8b5cf6'
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    description: 'Storefront that facilitates easy discoverability to install published data products.',
    category: 'devops',
    officialUrl: 'https://www.palantir.com/docs/foundry/devops/overview',
    officialDescription: 'Marketplace provides guided product installation, recommendations, automatic upgrades, and maintenance windows.',
    examples: ['Browse products', 'Install products'],
    relatedConcepts: ['Foundry DevOps', 'Products'],
    size: 35,
    color: '#8b5cf6'
  }
];

// Application Development Concepts
export const APPLICATION_NODES: KnowledgeNode[] = [
  {
    id: 'osdk-react',
    label: 'OSDK React Applications',
    description: 'Build completely customizable user interfaces using React and powered by the Ontology Software Development Kit.',
    category: 'applications',
    officialUrl: 'https://www.palantir.com/docs/foundry/ontology-sdk-react-applications/overview',
    officialDescription: 'Developer Console enables application builders to build customizable UIs using React, treating Foundry as the backend.',
    examples: ['To-do applications', 'Custom widgets', 'Workshop modules'],
    relatedConcepts: ['OSDK', 'Workshop', 'Ontology'],
    size: 40,
    color: '#ec4899'
  },
  {
    id: 'workshop',
    label: 'Workshop',
    description: 'Low-code application building platform.',
    category: 'applications',
    officialDescription: 'Workshop enables building applications with visual components.',
    examples: ['Dashboards', 'Forms', 'Workflows'],
    relatedConcepts: ['OSDK React', 'Object Views'],
    size: 35,
    color: '#ec4899'
  },
  {
    id: 'developer-console',
    label: 'Developer Console',
    description: 'Development environment for building custom applications.',
    category: 'applications',
    officialDescription: 'Developer Console provides tools for creating, developing, and deploying React applications.',
    examples: ['VS Code integration', 'Local development'],
    relatedConcepts: ['OSDK React', 'Code Repositories'],
    size: 38,
    color: '#ec4899'
  }
];

// Combine all nodes
export const ALL_KNOWLEDGE_NODES: KnowledgeNode[] = [
  ...ONTOLOGY_NODES,
  ...AIP_NODES,
  ...DATA_INTEGRATION_NODES,
  ...DEVOPS_NODES,
  ...APPLICATION_NODES
];

// Knowledge Links - Relationships between concepts
export const KNOWLEDGE_LINKS: KnowledgeLink[] = [
  // Ontology core relationships
  { id: 'l1', source: 'ontology', target: 'object-type', type: 'contains', strength: 0.9, description: 'Ontology contains Object Types' },
  { id: 'l2', source: 'ontology', target: 'link-type', type: 'contains', strength: 0.9, description: 'Ontology contains Link Types' },
  { id: 'l3', source: 'ontology', target: 'action-type', type: 'contains', strength: 0.9, description: 'Ontology contains Action Types' },
  { id: 'l4', source: 'ontology', target: 'functions', type: 'contains', strength: 0.85, description: 'Ontology contains Functions' },
  { id: 'l5', source: 'object-type', target: 'property', type: 'contains', strength: 0.95, description: 'Object Types have Properties' },
  { id: 'l6', source: 'object-type', target: 'link-type', type: 'uses', strength: 0.8, description: 'Object Types use Link Types' },
  { id: 'l7', source: 'action-type', target: 'object-type', type: 'modifies', strength: 0.85, description: 'Action Types modify Object Types' },
  { id: 'l8', source: 'action-type', target: 'functions', type: 'uses', strength: 0.8, description: 'Action Types use Functions' },
  { id: 'l9', source: 'object-type', target: 'interfaces', type: 'uses', strength: 0.7, description: 'Object Types can implement Interfaces' },
  { id: 'l10', source: 'object-type', target: 'object-views', type: 'powers', strength: 0.75, description: 'Object Types power Object Views' },
  
  // AIP relationships
  { id: 'l11', source: 'aip', target: 'aip-logic', type: 'contains', strength: 0.9, description: 'AIP contains AIP Logic' },
  { id: 'l12', source: 'aip', target: 'aip-agent-studio', type: 'contains', strength: 0.85, description: 'AIP contains Agent Studio' },
  { id: 'l13', source: 'aip-logic', target: 'ontology', type: 'uses', strength: 0.9, description: 'AIP Logic uses Ontology' },
  { id: 'l14', source: 'aip-logic', target: 'functions', type: 'uses', strength: 0.8, description: 'AIP Logic uses Functions' },
  
  // Data Integration relationships
  { id: 'l15', source: 'data-connection', target: 'connectors', type: 'uses', strength: 0.95, description: 'Data Connection uses Connectors' },
  { id: 'l16', source: 'connectors', target: 'datasets', type: 'creates', strength: 0.85, description: 'Connectors create Datasets' },
  { id: 'l17', source: 'pipelines', target: 'datasets', type: 'processes', strength: 0.9, description: 'Pipelines process Datasets' },
  { id: 'l18', source: 'pipeline-builder', target: 'pipelines', type: 'creates', strength: 0.9, description: 'Pipeline Builder creates Pipelines' },
  { id: 'l19', source: 'pipelines', target: 'object-type', type: 'creates', strength: 0.8, description: 'Pipelines can create Object Types' },
  
  // DevOps relationships
  { id: 'l20', source: 'foundry-devops', target: 'marketplace', type: 'powers', strength: 0.85, description: 'Foundry DevOps powers Marketplace' },
  
  // Application relationships
  { id: 'l21', source: 'osdk-react', target: 'ontology', type: 'uses', strength: 0.95, description: 'OSDK React uses Ontology' },
  { id: 'l22', source: 'osdk-react', target: 'developer-console', type: 'enables', strength: 0.9, description: 'OSDK React enables Developer Console' },
  { id: 'l23', source: 'workshop', target: 'object-views', type: 'uses', strength: 0.8, description: 'Workshop uses Object Views' },
  { id: 'l24', source: 'workshop', target: 'ontology', type: 'uses', strength: 0.85, description: 'Workshop uses Ontology' },
  
  // Cross-domain relationships
  { id: 'l25', source: 'aip', target: 'pipelines', type: 'integrates', strength: 0.7, description: 'AIP integrates with Pipelines' },
  { id: 'l26', source: 'osdk-react', target: 'aip-logic', type: 'uses', strength: 0.75, description: 'OSDK React can use AIP Logic' }
];

// Create a map for quick lookup
export const KNOWLEDGE_NODES_MAP = new Map<string, KnowledgeNode>(
  ALL_KNOWLEDGE_NODES.map(node => [node.id, node])
);

export const KNOWLEDGE_LINKS_MAP = new Map<string, KnowledgeLink>(
  KNOWLEDGE_LINKS.map(link => [link.id, link])
);

