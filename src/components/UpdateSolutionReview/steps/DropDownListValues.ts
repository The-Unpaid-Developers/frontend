/**
 * Centralised enum -> display mappings for dropdowns.
 * KEY is the raw enum value to send to backend.
 * VALUE is the human readable label to display.
 *
 * If any list here does not match your actual Java enum constants,
 * update it to avoid backend validation errors.
 *
 * Pattern:
 * 1. Put raw enum constants (exactly as in Java) in the array.
 * 2. Helper will build a Record<string,string> mapping and also an options array.
 */

type EnumMap = Record<string, string>;
export interface Option {
  value: string;
  label: string;
}

/* Helpers */
const toLabel = (raw: string) =>
  raw
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const makeMap = (values: readonly string[]): EnumMap =>
  values.reduce<EnumMap>((acc, v) => {
    acc[v] = toLabel(v);
    return acc;
  }, {});

const mapToOptions = (m: EnumMap): Option[] =>
  Object.entries(m).map(([value, label]) => ({ value, label }));

/* ===================== Business Capabilities ===================== */
const L1_CAPABILITY_VALUES = ["UNKNOWN"] as const;
export const L1_CAPABILITY = makeMap(L1_CAPABILITY_VALUES);
export const L1_CAPABILITY_OPTIONS = mapToOptions(L1_CAPABILITY);

const L2_CAPABILITY_VALUES = ["UNKNOWN"] as const;
export const L2_CAPABILITY = makeMap(L2_CAPABILITY_VALUES);
export const L2_CAPABILITY_OPTIONS = mapToOptions(L2_CAPABILITY);

const L3_CAPABILITY_VALUES = ["UNKNOWN"] as const;
export const L3_CAPABILITY = makeMap(L3_CAPABILITY_VALUES);
export const L3_CAPABILITY_OPTIONS = mapToOptions(L3_CAPABILITY);

/* ===================== Data Asset ===================== */
const CLASSIFICATION_VALUES = [
  "PUBLIC",
  "INTERNAL",
  "CONFIDENTIAL",
  "RESTRICTED",
] as const; // from Classification.java
export const CLASSIFICATION = makeMap(CLASSIFICATION_VALUES);
export const CLASSIFICATION_OPTIONS = mapToOptions(CLASSIFICATION);

/* ===================== Enterprise Tools ===================== */
const TOOL_TYPE_VALUES = [
  "OBSERVABILITY",
  "BATCH_FILE_TRANSFER",
  "DEVOPS",
  "SECURITY",
  "SECURITY_ACCESS",
  "SECURITY_IDENTITY",
] as const; // ToolType.java (adjust to actual constants)
export const TOOL_TYPE = makeMap(TOOL_TYPE_VALUES);
export const TOOL_TYPE_OPTIONS = mapToOptions(TOOL_TYPE);

const ONBOARDING_STATUS_VALUES = ["TRUE", "FALSE", "NA"] as const; // OnboardingStatus.java
export const ONBOARDING_STATUS = makeMap(ONBOARDING_STATUS_VALUES);
export const ONBOARDING_STATUS_OPTIONS = mapToOptions(ONBOARDING_STATUS);

// If Tool.java is an enum of allowed tool names, add below:
// const TOOL_NAME_VALUES = ['JENKINS','GRAFANA','SONARQUBE','JIRA','CONFLUENCE'] as const;
// export const TOOL_NAME = makeMap(TOOL_NAME_VALUES);
// export const TOOL_NAME_OPTIONS = mapToOptions(TOOL_NAME);

/* ===================== Integration Flow ===================== */
const COUNTERPART_SYSTEM_ROLE_VALUES = ["PRODUCER", "CONSUMER"] as const; // CounterpartSystemRole.java
export const COUNTERPART_SYSTEM_ROLE = makeMap(COUNTERPART_SYSTEM_ROLE_VALUES);
export const COUNTERPART_SYSTEM_ROLE_OPTIONS = mapToOptions(
  COUNTERPART_SYSTEM_ROLE
);

const INTEGRATION_METHOD_VALUES = ["API", "BATCH", "EVENT", "FILE"] as const; // IntegrationMethod.java
export const INTEGRATION_METHOD = makeMap(INTEGRATION_METHOD_VALUES);
export const INTEGRATION_METHOD_OPTIONS = mapToOptions(INTEGRATION_METHOD);

/* ===================== Process Compliance ===================== */
const COMPLIANT_VALUES = ["TRUE", "FALSE", "NA"] as const; // Compliant.java (guess; adjust to file)
export const COMPLIANT = makeMap(COMPLIANT_VALUES);
export const COMPLIANT_OPTIONS = mapToOptions(COMPLIANT);

const STANDARD_GUIDELINE_VALUES = [
  "CRYPTOGRAPHY_STANDARDS",
  "ACCESS_CONTROL_STANDARDS",
  "SOP_FOR_CODE_REVIEW",
  "VA_AND_PT_STANDARDS",
  "INFORMATION_CLASSIFICATION_STANDARDS",
  "DATA_CONTROL_STANDARDS",
  "CLOUD_SECURITY_STANDARDS",
  "INTEGRATION_SECURITY_STANDARDS",
] as const; // StandardGuideline.java
export const STANDARD_GUIDELINE = makeMap(STANDARD_GUIDELINE_VALUES);
export const STANDARD_GUIDELINE_OPTIONS = mapToOptions(STANDARD_GUIDELINE);

/* ===================== Shared ===================== */
const FREQUENCY_VALUES = [
  "REAL_TIME",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "BI_ANNUALLY",
  "ANNUALLY",
] as const; // Frequency.java (adjust)
export const FREQUENCY = makeMap(FREQUENCY_VALUES);
export const FREQUENCY_OPTIONS = mapToOptions(FREQUENCY);

/* ===================== System Component ===================== */
const COMPONENT_STATUS_VALUES = ["NEW", "EXISTING", "TO_BE_RETIRED"] as const; // ComponentStatus.java
export const COMPONENT_STATUS = makeMap(COMPONENT_STATUS_VALUES);
export const COMPONENT_STATUS_OPTIONS = mapToOptions(COMPONENT_STATUS);

const COMPONENT_ROLE_VALUES = [
  "FRONT_END",
  "BACK_END",
  "FULL_STACK",
  "INTEGRATION",
  "SUPPORTING_UTILITIES",
] as const; // ComponentRole.java
export const COMPONENT_ROLE = makeMap(COMPONENT_ROLE_VALUES);
export const COMPONENT_ROLE_OPTIONS = mapToOptions(COMPONENT_ROLE);

const AVAILABILITY_REQUIREMENT_VALUES = [
  "VERY_HIGH",
  "HIGH",
  "MEDIUM",
] as const; // AvailabilityRequirement.java
export const AVAILABILITY_REQUIREMENT = makeMap(
  AVAILABILITY_REQUIREMENT_VALUES
);
export const AVAILABILITY_REQUIREMENT_OPTIONS = mapToOptions(
  AVAILABILITY_REQUIREMENT
);

const LOCATION_VALUES = ["ON_PREM", "CLOUD", "THIRD_PARTY"] as const; // Location.java
export const LOCATION = makeMap(LOCATION_VALUES);
export const LOCATION_OPTIONS = mapToOptions(LOCATION);

const HOSTING_REGION_VALUES = ["SINGAPORE", "APAC", "GLOBAL"] as const; // HostingRegion.java
export const HOSTING_REGION = makeMap(HOSTING_REGION_VALUES);
export const HOSTING_REGION_OPTIONS = mapToOptions(HOSTING_REGION);

const SOLUTION_TYPE_VALUES = ["BESPOKE", "COTS", "SAAS"] as const; // SolutionType.java
export const SOLUTION_TYPE = makeMap(SOLUTION_TYPE_VALUES);
export const SOLUTION_TYPE_OPTIONS = mapToOptions(SOLUTION_TYPE);

const CUSTOMIZATION_LEVEL_VALUES = ["NONE", "MINOR", "MAJOR"] as const; // CustomizationLevel.java
export const CUSTOMIZATION_LEVEL = makeMap(CUSTOMIZATION_LEVEL_VALUES);
export const CUSTOMIZATION_LEVEL_OPTIONS = mapToOptions(CUSTOMIZATION_LEVEL);

const UPGRADE_STRATEGY_VALUES = [
  "VENDOR_LED",
  "INTERNAL_LED",
  "HYBRID",
] as const; // UpgradeStrategy.java
export const UPGRADE_STRATEGY = makeMap(UPGRADE_STRATEGY_VALUES);
export const UPGRADE_STRATEGY_OPTIONS = mapToOptions(UPGRADE_STRATEGY);

const SCALABILITY_METHOD_VALUES = [
  "HORIZONTAL_AUTO",
  "VERTICAL_AUTO",
  "HYBRID",
  "MANUAL",
] as const; // ScalabilityMethod.java
export const SCALABILITY_METHOD = makeMap(SCALABILITY_METHOD_VALUES);
export const SCALABILITY_METHOD_OPTIONS = mapToOptions(SCALABILITY_METHOD);

const BACKUP_SITE_VALUES = [
  "ALTERNATE_DATA_CENTRE",
  "CLOUD_MULTI_AZ",
  "NONE",
] as const; // BackupSite.java
export const BACKUP_SITE = makeMap(BACKUP_SITE_VALUES);
export const BACKUP_SITE_OPTIONS = mapToOptions(BACKUP_SITE);

const DATA_ENCRYPTION_AT_REST_VALUES = [
  "STORAGE",
  "DATABASE",
  "TABLE_FIELD",
  "HYBRID",
] as const; // DataEncryptionAtRest.java
export const DATA_ENCRYPTION_AT_REST = makeMap(DATA_ENCRYPTION_AT_REST_VALUES);
export const DATA_ENCRYPTION_AT_REST_OPTIONS = mapToOptions(
  DATA_ENCRYPTION_AT_REST
);

const SSL_TYPE_VALUES = ["TLS", "M_TLS", "NONE"] as const; // SSLType.java
export const SSL_TYPE = makeMap(SSL_TYPE_VALUES);
export const SSL_TYPE_OPTIONS = mapToOptions(SSL_TYPE);

/* Language / Framework (adjust to real enums) */
const LANGUAGE_VALUES = [
  "JAVA",
  "PYTHON",
  "JAVASCRIPT",
  "TYPESCRIPT",
  "GO",
  "C_SHARP",
] as const; // Language.java
export const LANGUAGE = makeMap(LANGUAGE_VALUES);
export const LANGUAGE_OPTIONS = mapToOptions(LANGUAGE);

const FRAMEWORK_VALUES = [
  "SPRING_BOOT",
  "REACT",
  "ANGULAR",
  "DOTNET",
  "EXPRESS",
] as const; // Framework.java (if exists separately)
export const FRAMEWORK = makeMap(FRAMEWORK_VALUES);
export const FRAMEWORK_OPTIONS = mapToOptions(FRAMEWORK);

// If LanguageFramework.java combines them, create mapping similarly.

/* ===================== Technology Component ===================== */
const USAGE_VALUES = [
  "BASIC_INSTALLATION",
  "PREREQUISITE_INSTALLATION",
  "PROGRAMMING_LANGUAGE",
  "DEPENDENT_FRAMEWORK_OR_LIBRARY",
  "INFRASTRUCTURE",
] as const; // Usage.java (guess)
export const USAGE = makeMap(USAGE_VALUES);
export const USAGE_OPTIONS = mapToOptions(USAGE);

/* ===================== Solution Overview / Review ===================== */
const APPROVAL_STATUS_VALUES = ["PENDING", "APPROVED", "REJECTED"] as const; // ApprovalStatus.java
export const APPROVAL_STATUS = makeMap(APPROVAL_STATUS_VALUES);
export const APPROVAL_STATUS_OPTIONS = mapToOptions(APPROVAL_STATUS);

const BUSINESS_DRIVER_VALUES = [
  "BUSINESS_OR_CUSTOMER_GROWTH",
  "OPERATIONAL_EFFICIENCY",
  "REGULATORY",
  "RISK_MANAGEMENT",
  "STRATEGIC_ENABLERS",
  "TECHNICAL_IMPROVEMENTS",
] as const;
export const BUSINESS_DRIVER = makeMap(BUSINESS_DRIVER_VALUES);
export const BUSINESS_DRIVER_OPTIONS = mapToOptions(BUSINESS_DRIVER);

const BUSINESS_UNIT_VALUES = ["UNKNOWN"] as const; // BusinessUnit.java
export const BUSINESS_UNIT = makeMap(BUSINESS_UNIT_VALUES);
export const BUSINESS_UNIT_OPTIONS = mapToOptions(BUSINESS_UNIT);

const CONCERN_STATUS_VALUES = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
] as const; // ConcernStatus.java
export const CONCERN_STATUS = makeMap(CONCERN_STATUS_VALUES);
export const CONCERN_STATUS_OPTIONS = mapToOptions(CONCERN_STATUS);

const CONCERN_TYPE_VALUES = ["RISK", "ISSUE", "ACTION", "DECISION"] as const; // ConcernType.java
export const CONCERN_TYPE = makeMap(CONCERN_TYPE_VALUES);
export const CONCERN_TYPE_OPTIONS = mapToOptions(CONCERN_TYPE);

const REVIEW_STATUS_VALUES = [
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
] as const; // ReviewStatus.java
export const REVIEW_STATUS = makeMap(REVIEW_STATUS_VALUES);
export const REVIEW_STATUS_OPTIONS = mapToOptions(REVIEW_STATUS);

const REVIEW_TYPE_VALUES = ["NEW_BUILD", "ENHANCEMENT"] as const;
export const REVIEW_TYPE = makeMap(REVIEW_TYPE_VALUES);
export const REVIEW_TYPE_OPTIONS = mapToOptions(REVIEW_TYPE);

const SOLUTION_STATUS_VALUES = ["ACTIVE", "RETIRED", "PLANNED"] as const; // SolutionStatus.java
export const SOLUTION_STATUS = makeMap(SOLUTION_STATUS_VALUES);
export const SOLUTION_STATUS_OPTIONS = mapToOptions(SOLUTION_STATUS);

const DOCUMENT_STATE_VALUES = [
  "DRAFT",
  "SUBMITTED",
  "PUBLISHED",
  "ARCHIVED",
] as const; // DocumentState.java
export const DOCUMENT_STATE = makeMap(DOCUMENT_STATE_VALUES);
export const DOCUMENT_STATE_OPTIONS = mapToOptions(DOCUMENT_STATE);

const APPLICATION_USER_VALUES = [
  "PUBLIC",
  "CUSTOMERS",
  "ADVISERS",
  "EMPLOYEE",
  "PARTNERS",
  "THIRD_PARTY",
] as const;
export const APPLICATION_USER = makeMap(APPLICATION_USER_VALUES);
export const APPLICATION_USER_OPTIONS = mapToOptions(APPLICATION_USER);

/* ===================== Utility Exports ===================== */
export {
  makeMap as _makeEnumMap,
  mapToOptions as _enumMapToOptions,
  toLabel as _enumToLabel,
};
