import { DocumentState } from './index';

// Define the step data interfaces for the multi-step solution review creation
export interface SolutionOverview {
  title: string;
  description: string;
  category: string;
  businessPriority: 'High' | 'Medium' | 'Low';
  projectTimeline: string;
  stakeholders: string[];
  businessValue: string;
  estimatedCost: number;
  estimatedDuration: string;
  risksAndChallenges: string[];
}

export interface BusinessCapabilities {
  capabilities: string[];
  businessProcesses: string[];
  keyRequirements: string[];
  successCriteria: string[];
  domain: string;
  maturityLevel: string;
  strategicImportance: string;
}

export interface DataAsset {
  dataSources: string[];
  dataTypes: string[];
  dataVolume: string;
  dataFrequency: string;
  dataQualityRequirements: string[];
  classification: string;
  sensitivityLevel: string;
  format: string;
}

export interface EnterpriseTools {
  existingTools: string[];
  requiredTools: string[];
  integrationPoints: string[];
  licenses: string[];
  category: string;
  vendor: string;
  purpose: string;
  userBase: string;
  licenseType: string;
}

export interface IntegrationFlow {
  sourceSystem: string;
  targetSystem: string;
  dataFlow: string;
  frequency: string;
  protocol: string;
  securityRequirements: string[];
  dataFormat: string;
  description: string;
}

export interface SystemComponent {
  componentName: string;
  componentType: string;
  description: string;
  dependencies: string[];
  scalabilityRequirements: string;
  vendor: string;
  version: string;
  platform: string;
  status: string;
}

export interface TechnologyComponent {
  technology: string;
  version: string;
  purpose: string;
  configuration: string;
  supportRequirements: string[];
  category: string;
  vendor: string;
  license: string;
  supportLevel: string;
}

// Main form data interface
export interface CreateSolutionReviewData {
  solutionOverview: SolutionOverview;
  businessCapabilities: BusinessCapabilities;
  dataAsset: DataAsset;
  enterpriseTools: EnterpriseTools;
  integrationFlow: IntegrationFlow[];
  systemComponent: SystemComponent[];
  technologyComponent: TechnologyComponent[];
  documentState: DocumentState;
}

// Step navigation
export type StepKey = 
  | 'solutionOverview'
  | 'businessCapabilities' 
  | 'dataAsset'
  | 'enterpriseTools'
  | 'integrationFlow'
  | 'systemComponent'
  | 'technologyComponent';

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