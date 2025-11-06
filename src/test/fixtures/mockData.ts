import { DocumentState } from '../../types/solutionReview';
import { SolutionReview } from '../../types/solutionReview';

// Common mock data that can be shared across tests
export const mockSolutionReviews: SolutionReview[] = [
  {
    id: 'sr-1',
    systemCode: 'SYS-001',
    documentState: DocumentState.DRAFT,
    solutionOverview: {
      id: 'overview-1',
      solutionDetails: {
        solutionName: 'Payment Processing System',
        projectName: 'Digital Payment Initiative'
      },
      reviewType: 'Standard',
      businessUnit: 'Financial Services'
    },
    businessCapabilities: null,
    dataAssets: null,
    enterpriseTools: null,
    integrationFlows: null,
    systemComponents: null,
    technologyComponents: null,
    processCompliances: null,
    createdAt: '2024-01-01T00:00:00Z',
    lastModifiedAt: '2024-01-01T12:00:00Z',
    createdBy: 'john.doe@company.com',
    lastModifiedBy: 'jane.smith@company.com'
  },
  {
    id: 'sr-2',
    systemCode: 'SYS-002',
    documentState: DocumentState.SUBMITTED,
    solutionOverview: {
      id: 'overview-2',
      solutionDetails: {
        solutionName: 'Customer Management System',
        projectName: 'CRM Modernization'
      },
      reviewType: 'Standard',
      businessUnit: 'Customer Operations'
    },
    businessCapabilities: null,
    dataAssets: null,
    enterpriseTools: null,
    integrationFlows: null,
    systemComponents: null,
    technologyComponents: null,
    processCompliances: null,
    createdAt: '2024-01-02T00:00:00Z',
    lastModifiedAt: '2024-01-02T12:00:00Z',
    createdBy: 'alice.wilson@company.com',
    lastModifiedBy: 'bob.jones@company.com'
  }
];

export const mockPageMeta = {
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 2
};

export const mockBusinessCapabilities = {
  capabilities: [
    { id: 1, name: 'Customer Management', level: 'L1' },
    { id: 2, name: 'Payment Processing', level: 'L2' },
    { id: 3, name: 'Order Management', level: 'L1' }
  ]
};

export const mockTechComponents = [
  {
    id: 1,
    productName: 'Spring Boot',
    versionNumber: '3.1.0',
    category: 'Framework'
  },
  {
    id: 2,
    productName: 'React',
    versionNumber: '18.2.0',
    category: 'Frontend'
  },
  {
    id: 3,
    productName: 'PostgreSQL',
    versionNumber: '15.0',
    category: 'Database'
  }
];

export const mockQueryData = [
  {
    id: 1,
    name: 'test-query',
    sql: 'SELECT * FROM table',
    description: 'Test query for validation'
  },
  {
    id: 2,
    name: 'analytics-query',
    sql: 'SELECT COUNT(*) FROM analytics',
    description: 'Analytics aggregation query'
  }
];

export const mockDiagramData = {
  systemFlow: {
    nodes: [
      { id: 1, name: 'Node 1', type: 'system' },
      { id: 2, name: 'Node 2', type: 'database' }
    ],
    edges: [
      { source: 1, target: 2, type: 'data-flow' }
    ]
  },
  overallFlow: {
    systems: [
      { id: 1, name: 'System 1', category: 'core' },
      { id: 2, name: 'System 2', category: 'support' }
    ],
    connections: [
      { from: 1, to: 2, type: 'api' }
    ]
  },
  systemPaths: {
    paths: [
      {
        steps: [
          { system: 'System A', order: 1 },
          { system: 'System B', order: 2 }
        ]
      }
    ]
  }
};

// Helper function to create large datasets for performance testing
export const createLargeDataset = (size: number): SolutionReview[] => {
  return Array.from({ length: size }, (_, i) => ({
    id: `sr-${i + 1}`,
    systemCode: `SYS-${String(i + 1).padStart(3, '0')}`,
    documentState: i % 2 === 0 ? DocumentState.DRAFT : DocumentState.SUBMITTED,
    solutionOverview: {
      id: `overview-${i + 1}`,
      solutionDetails: {
        solutionName: `System ${i + 1}`,
        projectName: `Project ${i + 1}`
      },
      reviewType: 'Standard',
      businessUnit: 'Test Unit'
    },
    businessCapabilities: null,
    dataAssets: null,
    enterpriseTools: null,
    integrationFlows: null,
    systemComponents: null,
    technologyComponents: null,
    processCompliances: null,
    createdAt: `2024-01-${String((i % 28) + 1).padStart(2, '0')}T00:00:00Z`,
    lastModifiedAt: `2024-01-${String((i % 28) + 1).padStart(2, '0')}T12:00:00Z`,
    createdBy: `user${i + 1}@company.com`,
    lastModifiedBy: `admin${i + 1}@company.com`
  }));
};