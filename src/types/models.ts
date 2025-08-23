// Auto-generated TypeScript interfaces & enums derived from Java domain models.
// Source: src/main/java/com/project/core_service/models/**
// Assumptions:
// - LocalDateTime mapped to ISO 8601 string.
// - Mongo @Id fields mapped to id?: string (may be undefined client-side before persistence).
// - Java List<T> mapped to T[].
// - Optional Java fields (those without @NonNull / @Nonnull) marked optional in TS.
// - Records converted to simple interfaces.
// - Enums replicated as TypeScript enums (string valued for readability & forward compatibility).
// If you prefer union string literals or a per-file split, adjust accordingly.

/* ========================= Shared / Primitive Enums ========================= */
export enum Frequency { REAL_TIME = 'REAL_TIME', DAILY = 'DAILY', WEEKLY = 'WEEKLY', MONTHLY = 'MONTHLY', QUARTERLY = 'QUARTERLY', BI_ANNUALLY = 'BI_ANNUALLY', ANNUALLY = 'ANNUALLY' }

/* ========================= Integration Flow ========================= */
export enum ExternalSystemRole { CONSUMER = 'CONSUMER', PRODUCER = 'PRODUCER' }
export enum IntegrationMethod { API = 'API', BATCH = 'BATCH', EVENT = 'EVENT', FILE = 'FILE' }
export interface IntegrationFlow {
  id?: string;
  bsoCodeOfExternalSystem: string;
  externalSystemRole: ExternalSystemRole;
  integrationMethod: IntegrationMethod;
  frequency: Frequency;
  purpose: string;
}

/* ========================= Solution Review & Document State ========================= */
export enum DocumentState { DRAFT = 'DRAFT', SUBMITTED = 'SUBMITTED', CURRENT = 'CURRENT', OUTDATED = 'OUTDATED' }
export interface SolutionReview {
  id?: string;
  systemCode: string;
  documentState: DocumentState;
  solutionOverview: SolutionOverview;
  businessCapabilities: BusinessCapability[];
  systemComponents: SystemComponent[];
  integrationFlows: IntegrationFlow[];
  dataAssets: DataAsset[];
  technologyComponents: TechnologyComponent[];
  enterpriseTools: EnterpriseTool[];
  processCompliances: ProcessCompliant[];
  createdAt?: string;          // ISO timestamp
  lastModifiedAt?: string;      // ISO timestamp
  createdBy?: string;
  lastModifiedBy?: string;
}

/* ========================= System Component ========================= */
export enum ComponentStatus { NEW = 'NEW', EXISTING = 'EXISTING', TO_BE_RETIRED = 'TO_BE_RETIRED' }
export enum ComponentRole { FRONT_END = 'FRONT_END', BACK_END = 'BACK_END', FULL_STACK = 'FULL_STACK', INTEGRATION = 'INTEGRATION', SUPPORTING_UTILITIES = 'SUPPORTING_UTILITIES' }
export enum Location { ON_PREM = 'ON_PREM', CLOUD = 'CLOUD', THIRD_PARTY = 'THIRD_PARTY' }
export enum HostingRegion { SINGAPORE = 'SINGAPORE', APAC = 'APAC', GLOBAL = 'GLOBAL' }
export enum SolutionType { BESPOKE = 'BESPOKE', COTS = 'COTS', SAAS = 'SAAS' }
export enum CustomizationLevel { NONE = 'NONE', MINOR = 'MINOR', MAJOR = 'MAJOR' }
export enum UpgradeStrategy { VENDOR_LED = 'VENDOR_LED', INTERNAL_LED = 'INTERNAL_LED', HYBRID = 'HYBRID' }
export enum AvailabilityRequirement { VERY_HIGH = 'VERY_HIGH', HIGH = 'HIGH', MEDIUM = 'MEDIUM' }
export enum ScalabilityMethod { HORIZONTAL_AUTO = 'HORIZONTAL_AUTO', VERTICAL_AUTO = 'VERTICAL_AUTO', HYBRID = 'HYBRID', MANUAL = 'MANUAL' }
export enum BackupSite { ALTERNATE_DATA_CENTRE = 'ALTERNATE_DATA_CENTRE', CLOUD_MULTI_AZ = 'CLOUD_MULTI_AZ', NONE = 'NONE' }
export enum DataEncryptionAtRest { STORAGE = 'STORAGE', DATABASE = 'DATABASE', TABLE_FIELD = 'TABLE_FIELD', HYBRID = 'HYBRID' }
export enum SSLType { TLS = 'TLS', M_TLS = 'M_TLS', NONE = 'NONE' }

export interface Framework { name: string; version: string; }
export interface Language { name: string; version: string; }
export interface LanguageFramework { language: Language; framework?: Framework | null; }

export interface SecurityDetails {
  authenticationMethod: string;
  authorizationModel: string;
  isAuditLoggingEnabled: boolean;
  sensitiveDataElements: string;
  dataEncryptionAtRest: DataEncryptionAtRest;
  encryptionAlgorithmForDataAtRest: string;
  hasIpWhitelisting: boolean;
  ssl: SSLType;
  payloadEncryptionAlgorithm?: string;
  digitalCertificate?: string;
  keyStore: string;
  vulnerabilityAssessmentFrequency: Frequency;
  penetrationTestingFrequency: Frequency;
}

export interface SystemComponent {
  id?: string;
  name: string;
  status: ComponentStatus;
  role: ComponentRole;
  hostedOn: Location;
  hostingRegion: HostingRegion;
  solutionType: SolutionType;
  languageFramework: LanguageFramework;
  isOwnedByUs: boolean;
  isCICDUsed: boolean;
  customizationLevel: CustomizationLevel;
  upgradeStrategy: UpgradeStrategy;
  upgradeFrequency: Frequency;
  isSubscription: boolean;
  isInternetFacing: boolean;
  availabilityRequirement: AvailabilityRequirement;
  latencyRequirement: number;      // seconds
  throughputRequirement: number;   // requests per second
  scalabilityMethod: ScalabilityMethod;
  backupSite: BackupSite;
  securityDetails: SecurityDetails;
}

/* ========================= Technology Component ========================= */
export enum Usage { BASIC_INSTALLATION = 'BASIC_INSTALLATION', PREREQUISITE_INSTALLATION = 'PREREQUISITE_INSTALLATION', PROGRAMMING_LANGUAGE = 'PROGRAMMING_LANGUAGE', DEPENDENT_FRAMEWORK_OR_LIBRARY = 'DEPENDENT_FRAMEWORK_OR_LIBRARY', INFRASTRUCTURE = 'INFRASTRUCTURE' }
export interface TechnologyComponent {
  id?: string;
  productName: string;
  productVersion: string;
  usage: Usage;
}

/* ========================= Data Asset ========================= */
export enum Classification { PUBLIC = 'PUBLIC', INTERNAL = 'INTERNAL', CONFIDENTIAL = 'CONFIDENTIAL', RESTRICTED = 'RESTRICTED' }
export interface DataAsset {
  id?: string;
  solutionOverviewId: string;
  dataDomain: string;                // TODO: Potential enum
  dataClassification: Classification;
  ownedByBusinessUnit: string;       // TODO: Potential enum
  dataEntities: string[];
  masteredIn: string;
}

/* ========================= Enterprise Tools ========================= */
export enum ToolType { OBSERVABILITY = 'OBSERVABILITY', BATCH_FILE_TRANSFER = 'BATCH_FILE_TRANSFER', DEVOPS = 'DEVOPS', SECURITY = 'SECURITY', SECURITY_ACCESS = 'SECURITY_ACCESS', SECURITY_IDENTITY = 'SECURITY_IDENTITY' }
export enum OnboardingStatus { FALSE = 'FALSE', TRUE = 'TRUE', NA = 'NA' }
export interface Tool {
  id?: string;
  name: string;
  type: ToolType;
}
export interface EnterpriseTool {
  id?: string;
  tool: Tool;
  onboarded: OnboardingStatus;
  integrationStatus?: string;  // explanation / config notes
  issues: string;               // blockers, non-compliance, risk notes
  solutionOverviewId: string;
}

/* ========================= Process Compliance ========================= */
export enum StandardGuideline { CRYPTOGRAPHY_STANDARDS = 'CRYPTOGRAPHY_STANDARDS', ACCESS_CONTROL_STANDARDS = 'ACCESS_CONTROL_STANDARDS', SOP_FOR_CODE_REVIEW = 'SOP_FOR_CODE_REVIEW', VA_AND_PT_STANDARDS = 'VA_AND_PT_STANDARDS', INFORMATION_CLASSIFICATION_STANDARDS = 'INFORMATION_CLASSIFICATION_STANDARDS', DATA_CONTROL_STANDARDS = 'DATA_CONTROL_STANDARDS', CLOUD_SECURITY_STANDARDS = 'CLOUD_SECURITY_STANDARDS', INTEGRATION_SECURITY_STANDARDS = 'INTEGRATION_SECURITY_STANDARDS' }
export enum Compliant { FALSE = 'FALSE', TRUE = 'TRUE', NA = 'NA' }
export interface ProcessCompliant {
  id?: string;
  standardGuideline: StandardGuideline;
  compliant: Compliant;
  description: string;
}

/* ========================= Solution Overview ========================= */
export enum ReviewType { NEW_BUILD = 'NEW_BUILD', ENHANCEMENT = 'ENHANCEMENT' }
export enum ApprovalStatus { PENDING = 'PENDING', APPROVED = 'APPROVED', APPROVED_WITH_CONDITIONS = 'APPROVED_WITH_CONDITIONS', REJECTED = 'REJECTED' }
export enum ReviewStatus { DRAFT = 'DRAFT', IN_REVIEW = 'IN_REVIEW', COMPLETED = 'COMPLETED' }
export enum BusinessDriver { BUSINESS_OR_CUSTOMER_GROWTH = 'BUSINESS_OR_CUSTOMER_GROWTH', OPERATIONAL_EFFICIENCY = 'OPERATIONAL_EFFICIENCY', REGULATORY = 'REGULATORY', RISK_MANAGEMENT = 'RISK_MANAGEMENT', STRATEGIC_ENABLERS = 'STRATEGIC_ENABLERS', TECHNICAL_IMPROVEMENTS = 'TECHNICAL_IMPROVEMENTS' }
export enum BusinessUnit { UNKNOWN = 'UNKNOWN' }
export enum ApplicationUser { PUBLIC = 'PUBLIC', CUSTOMERS = 'CUSTOMERS', ADVISERS = 'ADVISERS', EMPLOYEE = 'EMPLOYEE', PARTNERS = 'PARTNERS', THIRD_PARTY = 'THIRD_PARTY' }
export enum ConcernType { RISK = 'RISK', DECISION = 'DECISION', DEVIATION = 'DEVIATION' }
export enum ConcernStatus { UNKNOWN = 'UNKNOWN' }

export interface SolutionDetails {
  solutionName: string;
  projectName: string;
  solutionReviewCode: string; // AWG Code
  solutionArchitectName: string;
  deliveryProjectManagerName: string;
  itBusinessPartners: string[];
}

export interface Concern {
  id?: string;
  type: ConcernType;
  description: string;
  impact: string;
  disposition: string;
  status: ConcernStatus;
}

export interface SolutionOverview {
  id?: string;
  solutionDetails: SolutionDetails;
  itBusinessPartners: string[];
  reviewedBy: string; // user id / name
  reviewType: ReviewType;
  approvalStatus: ApprovalStatus;
  reviewStatus: ReviewStatus;
  conditions?: string;
  businessUnit: BusinessUnit;
  businessDriver: BusinessDriver;
  valueOutcome: string;
  applicationUsers: ApplicationUser[];
  concerns?: Concern[];
}

/* ========================= Business Capability ========================= */
export enum L1Capability { UNKNOWN = 'UNKNOWN' }
export enum L2Capability { UNKNOWN = 'UNKNOWN' }
export enum L3Capability { UNKNOWN = 'UNKNOWN' }
export interface BusinessCapability {
  id?: string;
  l1Capability: L1Capability;
  l2Capability: L2Capability;
  l3Capability: L3Capability;
  remarks?: string;
}

/* ========================= Audit ========================= */
export interface AuditLogMeta {
  id?: string;             // matches SolutionReview.id
  head?: string;           // most recent node id
  tail?: string;           // original node id
  createdAt: string;       // ISO timestamp
  lastModified?: string;   // ISO timestamp
  nodeCount?: number;      // total versions
}

export interface AuditLogNode {
  id?: string;
  solutionReviewId: string;
  solutionsReviewVersion: string;
  next?: string;           // next node id
  timestamp: string;       // ISO timestamp
  changeDescription?: string;
}

/* ========================= Aggregated Export (optional) ========================= */
export interface DomainModelRegistry {
  SolutionReview: SolutionReview;
  SystemComponent: SystemComponent;
  TechnologyComponent: TechnologyComponent;
  DataAsset: DataAsset;
  EnterpriseTool: EnterpriseTool;
  ProcessCompliant: ProcessCompliant;
  SolutionOverview: SolutionOverview;
  BusinessCapability: BusinessCapability;
  IntegrationFlow: IntegrationFlow;
  AuditLogMeta: AuditLogMeta;
  AuditLogNode: AuditLogNode;
}
