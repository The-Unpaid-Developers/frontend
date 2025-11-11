/**
 * Test Data Factories
 *
 * Centralized factory functions for creating test data.
 * This improves test maintainability by:
 * - Providing consistent test data
 * - Making relationships between data explicit
 * - Allowing easy customization via overrides
 * - Reducing duplication across test files
 */

import { ErrorType } from '../types/errors';

/**
 * Business Capabilities Factory
 */
export interface BusinessCapability {
  l1: string;
  l2: string;
  l3: string;
}

export const createBusinessCapability = (
  overrides?: Partial<BusinessCapability>
): BusinessCapability => ({
  l1: 'Policy Management',
  l2: 'Policy Administration',
  l3: 'Policy Issuance',
  ...overrides,
});

export const createBusinessCapabilitiesList = (count: number = 4): BusinessCapability[] => [
  createBusinessCapability({ l1: 'Policy Management', l2: 'Policy Administration', l3: 'Policy Issuance' }),
  createBusinessCapability({ l1: 'Policy Management', l2: 'Policy Administration', l3: 'Policy Renewal' }),
  createBusinessCapability({ l1: 'Claims', l2: 'Claims Processing', l3: 'Claims Review' }),
  createBusinessCapability({ l1: 'Claims', l2: 'Claims Processing', l3: 'Claims Settlement' }),
].slice(0, count);

/**
 * Tech Components Factory
 */
export interface TechComponent {
  productName: string;
  productVersion: string;
}

export const createTechComponent = (
  overrides?: Partial<TechComponent>
): TechComponent => ({
  productName: 'Spring Boot',
  productVersion: '3.2',
  ...overrides,
});

export const createTechComponentsList = (): TechComponent[] => [
  createTechComponent({ productName: 'Spring Boot', productVersion: '3.2' }),
  createTechComponent({ productName: 'Spring Boot', productVersion: '3.1' }),
  createTechComponent({ productName: 'Spring Boot', productVersion: '2.7' }),
  createTechComponent({ productName: 'React', productVersion: '18.x' }),
  createTechComponent({ productName: 'React', productVersion: '17.x' }),
  createTechComponent({ productName: 'Node.js', productVersion: '20.x' }),
];

/**
 * Query Factory
 */
export interface QueryData {
  name: string;
  mongoQuery: string;
  description: string;
}

export const createQuery = (overrides?: Partial<QueryData>): QueryData => ({
  name: 'test-query',
  mongoQuery: '[{"$match": {"status": "active"}}]',
  description: 'Test query description',
  ...overrides,
});

export const createQueryList = (count: number = 2): QueryData[] => [
  createQuery({ name: 'test-query-1', mongoQuery: '[{"$match": {"status": "active"}}]', description: 'Test query 1 description' }),
  createQuery({ name: 'test-query-2', mongoQuery: '[{"$match": {"status": "pending"}}]', description: 'Test query 2 description' }),
].slice(0, count);

/**
 * Diagram Data Factory
 */
export interface DiagramNode {
  id: number;
  name: string;
}

export interface DiagramEdge {
  source: number;
  target: number;
}

export interface DiagramFlowData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export const createDiagramNode = (overrides?: Partial<DiagramNode>): DiagramNode => ({
  id: 1,
  name: 'Node 1',
  ...overrides,
});

export const createDiagramEdge = (overrides?: Partial<DiagramEdge>): DiagramEdge => ({
  source: 1,
  target: 2,
  ...overrides,
});

export const createDiagramFlowData = (overrides?: Partial<DiagramFlowData>): DiagramFlowData => ({
  nodes: [createDiagramNode()],
  edges: [createDiagramEdge()],
  ...overrides,
});

export const createOverallSystemFlowData = () => ({
  systems: [{ id: 1, name: 'System 1' }],
  connections: [{ from: 1, to: 2 }],
});

export const createSystemPathData = () => ({
  paths: [{ steps: ['PRODUCER', 'MIDDLE', 'CONSUMER'] }],
});

export const createBusinessCapabilitiesData = () => ({
  capabilities: [
    { id: 1, name: 'Customer Management', level: 'L1' },
    { id: 2, name: 'Payment Processing', level: 'L2' },
  ],
});

/**
 * Error Factory
 */
export const createMockError = (message: string = 'Test error', type: ErrorType = ErrorType.SERVER_ERROR) => {
  const error = new Error(message);
  error.name = type;
  return error;
};

export const createNetworkError = () => {
  const error = new TypeError('Failed to fetch');
  return error;
};

/**
 * Toast Props Factory
 */
export interface ToastProps {
  isVisible: boolean;
  message: string;
  type: ErrorType;
  onClose: () => void;
  autoCloseDelay?: number;
}

export const createToastProps = (overrides?: Partial<ToastProps>): ToastProps => ({
  isVisible: true,
  message: 'Test message',
  type: ErrorType.INFO,
  onClose: () => {},
  ...overrides,
});

/**
 * Login Credentials Factory
 */
export interface LoginCredentials {
  username: string;
  role: 'SA' | 'EAO';
}

export const createLoginCredentials = (overrides?: Partial<LoginCredentials>): LoginCredentials => ({
  username: 'John Doe',
  role: 'SA',
  ...overrides,
});

/**
 * API Response Factories
 */
export const createSuccessResponse = <T>(data: T) => ({
  success: true,
  data,
});

export const createErrorResponse = (message: string = 'Operation failed', code: number = 500) => ({
  success: false,
  error: {
    message,
    code,
  },
});

/**
 * Solution Review Factory
 */
export const createSolutionReview = (overrides?: any) => ({
  id: '1',
  systemCode: 'SYS-001',
  documentState: 'DRAFT' as const,
  solutionOverview: {
    id: '1',
    solutionDetails: {
      solutionName: 'Test Solution',
      projectName: 'Test Project',
      solutionReviewCode: 'SR-001',
      solutionArchitectName: 'John Doe',
      deliveryProjectManagerName: 'Jane Smith',
      itBusinessPartner: 'Bob Johnson',
    },
    reviewedBy: null,
    reviewType: 'NEW_BUILD' as const,
    approvalStatus: 'PENDING' as const,
    reviewStatus: 'DRAFT' as const,
    conditions: null,
    businessUnit: 'IT',
    businessDriver: 'COST_OPTIMIZATION' as const,
    valueOutcome: 'test value',
    applicationUsers: [],
    concerns: [],
  },
  businessCapabilities: [],
  systemComponents: [],
  integrationFlows: [],
  dataAssets: [],
  technologyComponents: [],
  enterpriseTools: [],
  processCompliances: [],
  createdAt: '2023-01-01T00:00:00Z',
  lastModifiedAt: '2023-01-02T00:00:00Z',
  createdBy: 'admin',
  lastModifiedBy: 'admin',
  ...overrides,
});

/**
 * Pagination Factory
 */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const createPaginatedData = <T>(
  items: T[],
  overrides?: Partial<PaginatedData<T>>
): PaginatedData<T> => ({
  items,
  total: items.length,
  page: 1,
  pageSize: 10,
  ...overrides,
});
