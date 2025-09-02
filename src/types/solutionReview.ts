import { DocumentState } from './index';

// Define the step data interfaces for the multi-step solution review creation
export interface SolutionDetails {
  solutionName?: string | null;
  projectName?: string | null;
  systemCode?: string | null;
  solutionArchitectName?: string | null;
  deliveryProjectManagerName?: string | null;
  itBusinessPartner?: string | null;
}

export interface Concern {
  type?: string | null;
  description?: string | null;
  impact?: string | null;
  disposition?: string | null;
  status?: string | null;
}

export interface SolutionOverview {
  solutionDetails?: SolutionDetails;
  reviewType?: string | null; // dropdown list
  businessUnit?: string | null; // dropdown list
  businessDriver?: string | null; // dropdown list
  valueOutcomes?: string | null; 
  applicationUsers?: string[]; // multi select 
  concerns?: Concern[];
}

export interface BusinessCapability {
  l1Capability?: string | null; // dropdown list
  l2Capability?: string | null; // dropdown list
  l3Capability?: string | null; // dropdown list
  remarks?: string | null;
}

export interface DataAsset {
  componentName?: string | null; // dropdown list based on system components
  solutionOverviewId?: string | null;
  dataDomain?: string | null; // dropdown list
  dataClassification?: string | null; // dropdown of PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED
  dataOwnership?: string | null; // dropdown list??
  dataEntities?: string[]; // dropdown list multi select
  masteredIn?: string | null; // dropdown list of the systems 
}

export interface Tool {
  name?: string | null;
  type?: string | null; // dropdown list
}

export interface EnterpriseTool {
  tool?: Tool;
  onboardingStatus?: string | null; // dropdown list
  integrationDetails?: string | null; // dropdown list
  issues?: string | null; 
}

export interface IntegrationFlow {
  componentName?: string | null; // dropdown list based on system components
  counterpartSystemCode?: string | null; // dropdown list
  counterpartSystemRole?: string | null; // dropdown list
  integrationMethod?: string | null; // dropdown list
  frequency?: string | null; // dropdown list
  purpose?: string | null;
}

export interface Language {
  name?: string | null;
  version?: string | null;
}

export interface Framework {
  name?: string | null;
  version?: string | null;
}

export interface LanguageFramework {
  language?: Language;
  framework?: Framework;
}

export interface SecurityDetails {
  authenticationMethod?: string | null; // dropdown list
  authorizationModel?: string | null; // dropdown list
  isAuditLoggingEnabled?: boolean; // checkbox
  sensitiveDataElements?: string | null;
  dataEncryptionAtRest?: string | null; // dropdown list
  encryptionAlgorithmForDataAtRest?: string | null; // dropdown list?
  hasIpWhitelisting?: boolean; // checkbox
  ssl?: string | null; // dropdown list
  payloadEncryptionAlgorithm?: string | null; // dropdown list
  digitalCertificate?: string | null;
  keyStore?: string | null;
  vulnerabilityAssessmentFrequency?: string | null; // dropdown list
  penetrationTestingFrequency?: string | null; // dropdown list
}

export interface SystemComponent {
  name?: string | null;
  status?: string | null; // dropdown list
  role?: string | null; // dropdown list
  hostedOn?: string | null; // dropdown list
  hostingRegion?: string | null; // dropdown list
  solutionType?: string | null; // dropdown list
  languageFramework?: LanguageFramework; // dropdown list
  isOwnedByUs?: boolean; // checkbox
  isCICDUsed?: boolean; // checkbox
  customizationLevel?: string | null; // dropdown list
  upgradeStrategy?: string | null; // dropdown list
  upgradeFrequency?: string | null; // dropdown list
  isSubscription?: boolean; // checkbox
  isInternetFacing?: boolean; // checkbox
  availabilityRequirement?: string | null; // dropdown list
  latencyRequirement?: number;
  throughputRequirement?: number;
  scalabilityMethod?: string | null; // dropdown list
  backupSite?: string | null; // dropdown list
  securityDetails?: SecurityDetails;
}

export interface TechnologyComponent {
  componentName?: string | null; // dropdown list based on system components
  productName?: string | null; 
  productVersion?: string | null; 
  usage?: string | null;
}

export interface ProcessCompliance {
  standardGuideline?: string | null; // dropdown list
  compliant?: string | null; // dropdown list
  description?: string | null;
}

// Main form data interface
export interface UpdateSolutionReviewData {
  solutionOverview: SolutionOverview | null;
  businessCapabilities: BusinessCapability[] | null;
  dataAssets: DataAsset[] | null;
  enterpriseTools: EnterpriseTool[] | null;
  integrationFlows: IntegrationFlow[] | null;
  systemComponents: SystemComponent[] | null;
  technologyComponents: TechnologyComponent[] | null;
  processCompliances: ProcessCompliance[] | null;
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