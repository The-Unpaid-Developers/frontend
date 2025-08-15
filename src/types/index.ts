const DocumentState = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  CURRENT: "CURRENT",
  OUTDATED: "OUTDATED",
} as const;

const StateOperation = {
  SUBMIT: "SUBMIT",
  REMOVE_SUBMISSION: "REMOVE_SUBMISSION",
  APPROVE: "APPROVE",
  UNAPPROVE: "UNAPPROVE",
  MARK_OUTDATED: "MARK_OUTDATED",
  RESET_CURRENT: "RESET_CURRENT",
} as const;

export type DocumentState = (typeof DocumentState)[keyof typeof DocumentState];
export type StateOperation =
  (typeof StateOperation)[keyof typeof StateOperation];
export { DocumentState, StateOperation };

export interface SolutionOverview {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  businessValue: string;
  estimatedCost: number;
  estimatedDuration: string;
  stakeholders: string[];
  risksAndChallenges: string[];
}

export interface BusinessCapability {
  id: string;
  name: string;
  description: string;
  domain: string;
  maturityLevel: string;
  strategicImportance: string;
}

export interface SystemComponent {
  id: string;
  name: string;
  type: string;
  description: string;
  vendor: string;
  version: string;
  platform: string;
  status: string;
}

export interface IntegrationFlow {
  id: string;
  name: string;
  sourceSystem: string;
  targetSystem: string;
  dataFormat: string;
  frequency: string;
  protocol: string;
  description: string;
}

export interface DataAsset {
  id: string;
  name: string;
  type: string;
  description: string;
  dataSource: string;
  format: string;
  classification: string;
  sensitivityLevel: string;
}

export interface TechnologyComponent {
  id: string;
  name: string;
  category: string;
  vendor: string;
  version: string;
  license: string;
  supportLevel: string;
  description: string;
}

export interface EnterpriseTool {
  id: string;
  name: string;
  category: string;
  vendor: string;
  purpose: string;
  userBase: string;
  licenseType: string;
  description: string;
}

export interface ProcessCompliant {
  id: string;
  processName: string;
  complianceFramework: string;
  status: string;
  lastReview: string;
  nextReview: string;
  owner: string;
  description: string;
}

export interface SolutionReview {
  id: string;
  documentState: DocumentState;
  solutionOverview: SolutionOverview | null;
  businessCapabilities: BusinessCapability[];
  systemComponents: SystemComponent[];
  integrationFlows: IntegrationFlow[];
  dataAssets: DataAsset[];
  technologyComponents: TechnologyComponent[];
  enterpriseTools: EnterpriseTool[];
  processCompliances: ProcessCompliant[];
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface DocumentStateTransition {
  from: DocumentState;
  to: DocumentState;
  operation: StateOperation;
  operationName: string;
  description: string;
}

export const STATE_TRANSITIONS: Record<
  DocumentState,
  DocumentStateTransition[]
> = {
  [DocumentState.DRAFT]: [
    {
      from: DocumentState.DRAFT,
      to: DocumentState.SUBMITTED,
      operation: StateOperation.SUBMIT,
      operationName: "Submit for Review",
      description: "Submit document for review and approval",
    },
  ],
  [DocumentState.SUBMITTED]: [
    {
      from: DocumentState.SUBMITTED,
      to: DocumentState.CURRENT,
      operation: StateOperation.APPROVE,
      operationName: "Approve",
      description: "Approve document as current version",
    },
    {
      from: DocumentState.SUBMITTED,
      to: DocumentState.DRAFT,
      operation: StateOperation.REMOVE_SUBMISSION,
      operationName: "Return to Draft",
      description: "Return document to draft state",
    },
  ],
  [DocumentState.CURRENT]: [
    {
      from: DocumentState.CURRENT,
      to: DocumentState.OUTDATED,
      operation: StateOperation.MARK_OUTDATED,
      operationName: "Mark as Outdated",
      description: "Mark document as outdated",
    },
    {
      from: DocumentState.CURRENT,
      to: DocumentState.SUBMITTED,
      operation: StateOperation.UNAPPROVE,
      operationName: "Unapprove",
      description: "Remove approval and return to review",
    },
  ],
  [DocumentState.OUTDATED]: [
    {
      from: DocumentState.OUTDATED,
      to: DocumentState.CURRENT,
      operation: StateOperation.RESET_CURRENT,
      operationName: "Reset as Current",
      description: "Reset document as current version",
    },
  ],
};

export const getStateColor = (state: DocumentState): string => {
  switch (state) {
    case DocumentState.DRAFT:
      return "bg-gray-100 text-gray-800 border-gray-300";
    case DocumentState.SUBMITTED:
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case DocumentState.CURRENT:
      return "bg-green-100 text-green-800 border-green-300";
    case DocumentState.OUTDATED:
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getStateDescription = (state: DocumentState): string => {
  switch (state) {
    case DocumentState.DRAFT:
      return "Document is being edited and is not ready for review";
    case DocumentState.SUBMITTED:
      return "Document has been submitted for review and approval";
    case DocumentState.CURRENT:
      return "Document is approved and represents the current active version";
    case DocumentState.OUTDATED:
      return "Document was previously current but has been superseded";
    default:
      return "Unknown state";
  }
};
