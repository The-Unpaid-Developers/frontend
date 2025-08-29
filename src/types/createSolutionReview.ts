import { DocumentState } from './index';

// Define the step data interfaces for the multi-step solution review creation
export interface SolutionOverview {
  solutionName: string;
  projectName: string;
  solutionReviewCode: string;
  solutionArchitectName: string;
  deliveryProjectManagerName: string;
  itBusinessPartner: string;
  reviewType: string; // dropdown list
  businessUnit: string; // dropdown list
  businessDriver: string; // dropdown list
  valueOutcomes: string; 
  applicationUsers: string[]; // multi select 
}

export interface BusinessCapability {
  l1Capability: string; // dropdown list
  l2Capability: string; // dropdown list
  l3Capability: string; // dropdown list
  remarks: string;
}

export interface DataAsset {
  componentName: string; // dropdown list based on system components
  solutionOverviewId: string;
  dataDomain: string; // dropdown list
  dataClassification: string; // dropdown of PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED
  dataOwnership: string; // dropdown list??
  dataEntities: string[]; // dropdown list multi select
  masteredIn: string; // dropdown list of the systems 
}

export interface EnterpriseTool {
  toolName: string;
  toolType: string; // dropdown list
  onboardingStatus: string; // dropdown list
  integrationDetails: string; // dropdown list
  issues: string; 
}

export interface IntegrationFlow {
  componentName: string; // dropdown list based on system components
  counterpartSystemCode: string; // dropdown list
  counterpartSystemRole: string; // dropdown list
  integrationMethod: string; // dropdown list
  frequency: string; // dropdown list
  purpose: string;
}

export interface SystemComponent {
  name: string;
  status: string; // dropdown list
  role: string; // dropdown list
  hostedOn: string; // dropdown list
  hostingRegion: string; // dropdown list
  solutionType: string; // dropdown list
  languageFramework: string; // dropdown list
  isOwnedByUs: boolean; // checkbox
  isCICDUsed: boolean; // checkbox
  customizationLevel: string; // dropdown list
  upgradeStrategy: string; // dropdown list
  upgradeFrequency: string; // dropdown list
  isSubscription: boolean; // checkbox
  isInternetFacing: boolean; // checkbox
  availabilityRequirement: string; // dropdown list
  latencyRequirement: number;
  throughputRequirement: number;
  scalabilityMethod: string; // dropdown list
  backupSite: string; // dropdown list
  authenticationMethod: string; // dropdown list
  authorizationModel: string; // dropdown list
  isAuditLoggingEnabled: boolean; // checkbox
  sensitiveDataElements: string;
  dataEncryptionAtRest: string; // dropdown list
  encryptionAlgorithmForDataAtRest: string; // dropdown list?
  hasIpWhitelisting: boolean; // checkbox
  ssl: string; // dropdown list
  payloadEncryptionAlgorithm: string; // dropdown list
  digitalCertificate: string;
  keyStore: string;
  vulnerabilityAssessmentFrequency: string; // dropdown list
  penetrationTestingFrequency: string; // dropdown list
}

export interface TechnologyComponent {
  componentName: string; // dropdown list based on system components
  productName: string; 
  productVersion: string; 
  usage: string;
}

export interface ProcessCompliance {
  standardGuideline: string; // dropdown list
  compliant: string; // dropdown list
  description: string;
}

// Main form data interface
export interface CreateSolutionReviewData {
  solutionOverview: SolutionOverview | null;
  businessCapabilities: BusinessCapability[] | null;
  dataAsset: DataAsset[] | null;
  enterpriseTools: EnterpriseTool[] | null;
  integrationFlow: IntegrationFlow[] | null;
  systemComponent: SystemComponent[] | null;
  technologyComponent: TechnologyComponent[] | null;
  processCompliance: ProcessCompliance[] | null;
  // documentState: DocumentState;
}

// Step navigation
export type StepKey = 
  | 'solutionOverview'
  | 'businessCapabilities' 
  | 'dataAsset'
  | 'enterpriseTools'
  | 'integrationFlow'
  | 'systemComponent'
  | 'technologyComponent'
  | 'processCompliance';

export interface StepConfig {
  key: StepKey;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

// API response types
export interface CreateSolutionReviewResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface StepSaveResponse {
  success: boolean;
  stepKey: StepKey;
  data?: any;
  error?: string;
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}

export interface StepValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}