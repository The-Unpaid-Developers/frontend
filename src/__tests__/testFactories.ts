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

/**
 * Business Capability Diagram Factory
 */
export interface BusinessCapabilityDiagram {
  id: string;
  name: string;
  level: string;
  systemCode: string;
  parentId: string | null;
}

export const createBusinessCapabilityDiagram = (overrides?: Partial<BusinessCapabilityDiagram>): BusinessCapabilityDiagram => ({
  id: '1',
  name: 'Customer Management',
  level: 'L1',
  systemCode: 'SYS-001',
  parentId: null,
  ...overrides,
});

export const createBusinessCapabilityDiagramList = (count: number = 3): BusinessCapabilityDiagram[] => [
  createBusinessCapabilityDiagram({ id: '1', name: 'Customer Management', level: 'L1', parentId: null }),
  createBusinessCapabilityDiagram({ id: '2', name: 'Customer Onboarding', level: 'L2', parentId: '1' }),
  createBusinessCapabilityDiagram({ id: '3', name: 'Digital Registration', level: 'L3', parentId: '2' }),
].slice(0, count);

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
 * Step Component Factories for UpdateSolutionReview
 */

// Step Props Factory
export interface StepProps {
  onSave: (data: any) => Promise<void>;
  isSaving?: boolean;
  initialData: any;
  showSuccess?: (message: string) => void;
  showError?: (message: string) => void;
}

export const createMockStepProps = (overrides?: Partial<StepProps>): StepProps => ({
  onSave: async () => {},
  isSaving: false,
  initialData: {},
  showSuccess: () => {},
  showError: () => {},
  ...overrides,
});

// Business Capability Factory for UpdateSolutionReview
export interface BusinessCapabilityStep {
  id: string;
  l1Capability: string;
  l2Capability: string;
  l3Capability: string;
  remarks: string;
}

export const createMockBusinessCapability = (overrides?: Partial<BusinessCapabilityStep>): BusinessCapabilityStep => ({
  id: `bc-${Date.now()}`,
  l1Capability: 'Customer Management',
  l2Capability: 'Customer Onboarding',
  l3Capability: 'Digital Registration',
  remarks: 'Test remarks',
  ...overrides,
});

// Data Asset Factory
export interface DataAsset {
  id?: string;
  componentName: string;
  dataDomain: string;
  dataClassification: string;
  dataOwnedBy: string;
  dataEntities: string[];
  masteredIn: string;
}

export const createMockDataAsset = (overrides?: Partial<DataAsset>): DataAsset => ({
  id: `da-${Date.now()}`,
  componentName: 'Test Component',
  dataDomain: 'Customer Data',
  dataClassification: 'Confidential',
  dataOwnedBy: 'Data Team',
  dataEntities: ['Customer', 'Address'],
  masteredIn: 'CRM System',
  ...overrides,
});

// System Component Factory
export interface SystemComponent {
  name?: string | null;
  status?: string | null;
  role?: string | null;
  hostedOn?: string | null;
  hostingRegion?: string | null;
  solutionType?: string | null;
  languageFramework?: {
    language?: { name?: string | null; version?: string | null };
    framework?: { name?: string | null; version?: string | null };
  };
  isOwnedByUs?: boolean;
  isCICDUsed?: boolean;
  customizationLevel?: string | null;
  upgradeStrategy?: string | null;
  upgradeFrequency?: string | null;
  isSubscription?: boolean;
  isInternetFacing?: boolean;
  availabilityRequirement?: string | null;
  latencyRequirement?: number;
  throughputRequirement?: number;
  scalabilityMethod?: string | null;
  backupSite?: string | null;
  securityDetails?: {
    authenticationMethod?: string | null;
    authorizationModel?: string | null;
    isAuditLoggingEnabled?: boolean;
    sensitiveDataElements?: string | null;
    dataEncryptionAtRest?: string | null;
    encryptionAlgorithmForDataAtRest?: string | null;
    hasIpWhitelisting?: boolean;
    ssl?: string | null;
    payloadEncryptionAlgorithm?: string | null;
    digitalCertificate?: string | null;
    keyStore?: string | null;
    vulnerabilityAssessmentFrequency?: string | null;
    penetrationTestingFrequency?: string | null;
  };
}

export const createMockSystemComponent = (overrides: Partial<SystemComponent> = {}): SystemComponent => ({
  name: 'Test System Component',
  status: 'Active',
  role: 'Primary',
  hostedOn: 'On-Premise',
  hostingRegion: 'North America',
  solutionType: 'Custom Application',
  languageFramework: {
    language: { name: 'Java', version: '11' },
    framework: { name: 'Spring Boot', version: '2.7.0' }
  },
  isOwnedByUs: true,
  isCICDUsed: true,
  customizationLevel: 'Medium',
  upgradeStrategy: 'Rolling',
  upgradeFrequency: 'Quarterly',
  isSubscription: false,
  isInternetFacing: true,
  availabilityRequirement: '99.9%',
  latencyRequirement: 100,
  throughputRequirement: 1000,
  scalabilityMethod: 'Horizontal',
  backupSite: 'Secondary Data Center',
  securityDetails: {
    authenticationMethod: 'OAuth 2.0',
    authorizationModel: 'RBAC',
    isAuditLoggingEnabled: true,
    sensitiveDataElements: 'PII, Financial Data',
    dataEncryptionAtRest: 'AES-256',
    encryptionAlgorithmForDataAtRest: 'AES-256-GCM',
    hasIpWhitelisting: true,
    ssl: 'TLS 1.3',
    payloadEncryptionAlgorithm: 'RSA-2048',
    digitalCertificate: 'X.509',
    keyStore: 'Java KeyStore',
    vulnerabilityAssessmentFrequency: 'Monthly',
    penetrationTestingFrequency: 'Quarterly'
  },
  ...overrides,
});

export interface EnterpriseTool {
  id?: string;
  tool?: {
    name?: string | null;
    type?: string | null;
  };
  onboarded?: string | null;
  integrationDetails?: string | null;
  issues?: string | null;
}

export const createMockEnterpriseTool = (overrides: Partial<EnterpriseTool> = {}): EnterpriseTool => ({
  id: 'enterprise-tool-1',
  tool: {
    name: 'Test Enterprise Tool',
    type: 'MONITORING'
  },
  onboarded: 'FULLY_ONBOARDED',
  integrationDetails: 'Integrated via REST API with OAuth authentication',
  issues: 'No known issues',
  ...overrides,
});

/**
 * Integration Flow Factory
 */
export interface IntegrationFlow {
  componentName?: string | null;
  counterpartSystemCode?: string | null;
  counterpartSystemRole?: string | null;
  integrationMethod?: string | null;
  middleware?: string | null;
  frequency?: string | null;
  purpose?: string | null;
}

export const createMockIntegrationFlow = (overrides: Partial<IntegrationFlow> = {}): IntegrationFlow => ({
  componentName: 'Test Component',
  counterpartSystemCode: 'SYS-001',
  counterpartSystemRole: 'CONSUMER',
  integrationMethod: 'REST_API',
  middleware: 'API_GATEWAY',
  frequency: 'REAL_TIME',
  purpose: 'Data synchronization for real-time processing',
  ...overrides,
});

/**
 * Technology Component Factory
 */
export interface TechnologyComponent {
  componentName?: string | null;
  productName?: string | null;
  productVersion?: string | null;
  usage?: string | null;
}

export const createMockTechnologyComponent = (overrides: Partial<TechnologyComponent> = {}): TechnologyComponent => ({
  componentName: 'Test Technology Component',
  productName: 'Java',
  productVersion: '17',
  usage: 'BACKEND',
  ...overrides,
});

// Business Capabilities Hook Mock Factory
export const createMockBusinessCapabilitiesHook = () => ({
  data: {
    l1Options: [
      { label: 'Customer Management', value: 'Customer Management' },
      { label: 'Product Management', value: 'Product Management' },
      { label: 'Risk Management', value: 'Risk Management' }
    ],
    getL2OptionsForL1: (l1: string) => {
      if (l1 === 'Customer Management') {
        return [
          { label: 'Customer Onboarding', value: 'Customer Onboarding' },
          { label: 'Customer Service', value: 'Customer Service' }
        ];
      }
      return [{ label: 'Default L2', value: 'Default L2' }];
    },
    getL3OptionsForL1AndL2: (l1: string, l2: string) => {
      if (l1 === 'Customer Management' && l2 === 'Customer Onboarding') {
        return [
          { label: 'Digital Registration', value: 'Digital Registration' },
          { label: 'Document Verification', value: 'Document Verification' }
        ];
      }
      return [{ label: 'Default L3', value: 'Default L3' }];
    }
  },
  loading: false,
  error: null as string | null
});

// Mock Classification Options
export const MOCK_CLASSIFICATION_OPTIONS = [
  { label: 'Public', value: 'Public' },
  { label: 'Internal', value: 'Internal' },
  { label: 'Confidential', value: 'Confidential' },
  { label: 'Restricted', value: 'Restricted' }
];

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
