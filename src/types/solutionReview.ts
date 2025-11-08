// Define the step data interfaces for the multi-step solution review creation
export interface SolutionDetails {
  solutionName?: string | null;
  projectName?: string | null;
  solutionArchitectName?: string | null;
  deliveryProjectManagerName?: string | null;
  itBusinessPartner?: string | null;
  solutionReviewCode?: string | null; // to remove
}

export interface Concern {
  type?: string | null;
  description?: string | null;
  impact?: string | null;
  disposition?: string | null;
  status?: string | null;
  followUpDate: string;
}

export interface SolutionOverview {
  id?: string;
  solutionDetails?: SolutionDetails;
  reviewType?: string | null; // dropdown list
  businessUnit?: string | null; // dropdown list
  businessDriver?: string | null; // dropdown list
  valueOutcome?: string | null;
  applicationUsers?: string[]; // multi select
  concerns?: Concern[];
}

export interface BusinessCapability {
  id?: string;
  l1Capability?: string | null; // dropdown list
  l2Capability?: string | null; // dropdown list
  l3Capability?: string | null; // dropdown list
  remarks?: string | null;
}

export interface DataAsset {
  id?: string;
  componentName?: string | null; // dropdown list based on system components
  solutionOverviewId?: string | null;
  dataDomain?: string | null; // dropdown list
  dataClassification?: string | null; // dropdown of PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED
  dataOwnedBy?: string | null; // dropdown list??
  dataEntities?: string[]; // dropdown list multi select
  masteredIn?: string | null; // dropdown list of the systems
}

export interface Tool {
  name?: string | null;
  type?: string | null; // dropdown list
}

export interface EnterpriseTool {
  id?: string;
  tool?: Tool;
  onboarded?: string | null; // dropdown list
  integrationDetails?: string | null; // dropdown list
  issues?: string | null;
}

export interface IntegrationFlow {
  componentName?: string | null; // dropdown list based on system components
  counterpartSystemCode?: string | null; // dropdown list
  counterpartSystemRole?: string | null; // dropdown list
  integrationMethod?: string | null; // dropdown list
  middleware?: string | null; // dropdown list
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
  id?: string;
  standardGuideline?: string | null; // dropdown list
  compliant?: string | null; // dropdown list
  description?: string | null;
}

// Main form data interface
export interface UpdateSolutionReviewData {
  id?: string;
  documentState: string;
  systemCode: string;
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
  | "solutionOverview"
  | "businessCapabilities"
  | "dataAsset"
  | "enterpriseTools"
  | "integrationFlow"
  | "systemComponent"
  | "technologyComponent"
  | "processCompliance";

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
  isValid?: boolean;
  errors: ValidationError[];
}

const DocumentState = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  ACTIVE: "ACTIVE",
  OUTDATED: "OUTDATED",
} as const;

const DocumentStateFilter = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  ACTIVE: "ACTIVE",
} as const;
export type DocumentStateFilter =
  (typeof DocumentStateFilter)[keyof typeof DocumentStateFilter];

export type DocumentState = (typeof DocumentState)[keyof typeof DocumentState];

const StateOperation = {
  SUBMIT: "SUBMIT",
  REMOVE_SUBMISSION: "REMOVE_SUBMISSION",
  APPROVE: "APPROVE",
  UNAPPROVE: "UNAPPROVE",
  ACTIVATE: "ACTIVATE",
  MARK_OUTDATED: "MARK_OUTDATED",
  RESET_CURRENT: "RESET_CURRENT",
} as const;

export type StateOperation =
  (typeof StateOperation)[keyof typeof StateOperation];

export { DocumentState, StateOperation, DocumentStateFilter };

export interface SolutionReview {
  id?: string;
  systemCode: string;
  documentState: string;
  solutionOverview: SolutionOverview | null;
  businessCapabilities: BusinessCapability[] | null;
  dataAssets: DataAsset[] | null;
  enterpriseTools: EnterpriseTool[] | null;
  integrationFlows: IntegrationFlow[] | null;
  systemComponents: SystemComponent[] | null;
  technologyComponents: TechnologyComponent[] | null;
  processCompliances: ProcessCompliance[] | null;
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface DocumentStateTransition {
  from: string;
  to: string;
  operation: StateOperation;
  operationName: string;
  description: string;
}

export const STATE_TRANSITIONS: Record<string, DocumentStateTransition[]> = {
  ["DRAFT"]: [
    {
      from: "DRAFT",
      to: "SUBMITTED",
      operation: "SUBMIT",
      operationName: "Submit for Review",
      description: "Submit document for review and approval",
    },
  ],
  ["SUBMITTED"]: [
    {
      from: "SUBMITTED",
      to: "CURRENT",
      operation: "APPROVE",
      operationName: "Approve",
      description: "Approve document as current version",
    },
    {
      from: "SUBMITTED",
      to: "DRAFT",
      operation: "REMOVE_SUBMISSION",
      operationName: "Return to Draft",
      description: "Return document to draft state",
    },
  ],
  ["APPROVED"]: [
    {
      from: "APPROVED",
      to: "SUBMITTED",
      operation: "UNAPPROVE",
      operationName: "Unapprove",
      description: "Remove approval and return to review",
    },
    {
      from: "APPROVED",
      to: "ACTIVE",
      operation: "ACTIVATE",
      operationName: "Activate",
      description: "Mark document as active version",
    },
  ],
  ["ACTIVE"]: [
    {
      from: "ACTIVE",
      to: "OUTDATED",
      operation: "MARK_OUTDATED",
      operationName: "Mark as Outdated",
      description: "Mark document as outdated",
    },
  ],
  // ["OUTDATED"]: [
  //   {
  //     from: "OUTDATED",
  //     to: "CURRENT",
  //     operation: "RESET_CURRENT",
  //     operationName: "Reset as Current",
  //     description: "Reset document as current version",
  //   },
  // ],
};

export const getStateColor = (state: string): string => {
  switch (state) {
    case "DRAFT":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "SUBMITTED":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "APPROVED":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-300";
    case "OUTDATED":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getStateDescription = (state: string): string => {
  switch (state) {
    case "DRAFT":
      return "Document is being edited and is not ready for review";
    case "SUBMITTED":
      return "Document has been submitted for review and approval";
    case "CURRENT":
      return "Document is approved and represents the current active version";
    case "OUTDATED":
      return "Document was previously current but has been superseded";
    default:
      return "Unknown state";
  }
};

export interface SystemGroup {
  systemid?: string;
  systemName: string;
  description: string;
  category: string;
  reviews: SolutionReview[];
  latestVersion: number;
  currentReview?: SolutionReview;
  totalReviews: number;
}
