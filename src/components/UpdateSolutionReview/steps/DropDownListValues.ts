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
export interface Option { value: string; label: string; }

/* Helpers */
const toLabel = (raw: string) =>
  raw
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

const makeMap = (values: readonly string[]): EnumMap =>
  values.reduce<EnumMap>((acc,v)=>{ acc[v]=toLabel(v); return acc; }, {});

const mapToOptions = (m: EnumMap): Option[] =>
  Object.entries(m).map(([value,label])=>({ value,label }));

/* ===================== Data Asset ===================== */
const CLASSIFICATION_VALUES = [
  'PUBLIC','INTERNAL','CONFIDENTIAL','RESTRICTED'
] as const; // from Classification.java
export const CLASSIFICATION = makeMap(CLASSIFICATION_VALUES);
export const CLASSIFICATION_OPTIONS = mapToOptions(CLASSIFICATION);

/* ===================== Enterprise Tools ===================== */
const TOOL_TYPE_VALUES = [
  'MONITORING','CI_CD','TESTING','COLLABORATION','SECURITY','OTHER'
] as const; // ToolType.java (adjust to actual constants)
export const TOOL_TYPE = makeMap(TOOL_TYPE_VALUES);
export const TOOL_TYPE_OPTIONS = mapToOptions(TOOL_TYPE);

const ONBOARDING_STATUS_VALUES = [
  'NOT_STARTED','IN_PROGRESS','ONBOARDED','DECOMMISSIONED'
] as const; // OnboardingStatus.java
export const ONBOARDING_STATUS = makeMap(ONBOARDING_STATUS_VALUES);
export const ONBOARDING_STATUS_OPTIONS = mapToOptions(ONBOARDING_STATUS);

// If Tool.java is an enum of allowed tool names, add below:
// const TOOL_NAME_VALUES = ['JENKINS','GRAFANA','SONARQUBE','JIRA','CONFLUENCE'] as const;
// export const TOOL_NAME = makeMap(TOOL_NAME_VALUES);
// export const TOOL_NAME_OPTIONS = mapToOptions(TOOL_NAME);

/* ===================== Integration Flow ===================== */
const EXTERNAL_SYSTEM_ROLE_VALUES = [
  'PRODUCER','CONSUMER','BOTH'
] as const; // ExternalSystemRole.java
export const EXTERNAL_SYSTEM_ROLE = makeMap(EXTERNAL_SYSTEM_ROLE_VALUES);
export const EXTERNAL_SYSTEM_ROLE_OPTIONS = mapToOptions(EXTERNAL_SYSTEM_ROLE);

const INTEGRATION_METHOD_VALUES = [
  'REST','SOAP','FILE','MQ','KAFKA','SFTP'
] as const; // IntegrationMethod.java
export const INTEGRATION_METHOD = makeMap(INTEGRATION_METHOD_VALUES);
export const INTEGRATION_METHOD_OPTIONS = mapToOptions(INTEGRATION_METHOD);

/* ===================== Process Compliance ===================== */
const COMPLIANT_VALUES = [
  'YES','NO','PARTIAL'
] as const; // Compliant.java (guess; adjust to file)
export const COMPLIANT = makeMap(COMPLIANT_VALUES);
export const COMPLIANT_OPTIONS = mapToOptions(COMPLIANT);

// StandardGuideline may not be an enum; if it is, list constants here
// const STANDARD_GUIDELINE_VALUES = ['ISO_27001','OWASP','GDPR'] as const;
// export const STANDARD_GUIDELINE = makeMap(STANDARD_GUIDELINE_VALUES);
// export const STANDARD_GUIDELINE_OPTIONS = mapToOptions(STANDARD_GUIDELINE);

/* ===================== Shared ===================== */
const FREQUENCY_VALUES = [
  'AD_HOC','DAILY','WEEKLY','MONTHLY','QUARTERLY','ANNUALLY'
] as const; // Frequency.java (adjust)
export const FREQUENCY = makeMap(FREQUENCY_VALUES);
export const FREQUENCY_OPTIONS = mapToOptions(FREQUENCY);

/* ===================== System Component ===================== */
const COMPONENT_STATUS_VALUES = [
  'ACTIVE','INACTIVE','DEPRECATED','PLANNED'
] as const; // ComponentStatus.java
export const COMPONENT_STATUS = makeMap(COMPONENT_STATUS_VALUES);
export const COMPONENT_STATUS_OPTIONS = mapToOptions(COMPONENT_STATUS);

const COMPONENT_ROLE_VALUES = [
  'FRONTEND','BACKEND','DATABASE','INTEGRATION','BATCH','SERVICE'
] as const; // ComponentRole.java
export const COMPONENT_ROLE = makeMap(COMPONENT_ROLE_VALUES);
export const COMPONENT_ROLE_OPTIONS = mapToOptions(COMPONENT_ROLE);

const AVAILABILITY_REQUIREMENT_VALUES = [
  'LOW','MEDIUM','HIGH','MISSION_CRITICAL'
] as const; // AvailabilityRequirement.java
export const AVAILABILITY_REQUIREMENT = makeMap(AVAILABILITY_REQUIREMENT_VALUES);
export const AVAILABILITY_REQUIREMENT_OPTIONS = mapToOptions(AVAILABILITY_REQUIREMENT);

const HOSTING_REGION_VALUES = [
  'US_EAST','US_WEST','EU_CENTRAL','AP_SOUTHEAST'
] as const; // HostingRegion.java
export const HOSTING_REGION = makeMap(HOSTING_REGION_VALUES);
export const HOSTING_REGION_OPTIONS = mapToOptions(HOSTING_REGION);

const SOLUTION_TYPE_VALUES = [
  'SAAS','ON_PREMISE','HYBRID','CUSTOM'
] as const; // SolutionType.java
export const SOLUTION_TYPE = makeMap(SOLUTION_TYPE_VALUES);
export const SOLUTION_TYPE_OPTIONS = mapToOptions(SOLUTION_TYPE);

const CUSTOMIZATION_LEVEL_VALUES = [
  'NONE','LOW','MEDIUM','HIGH'
] as const; // CustomizationLevel.java
export const CUSTOMIZATION_LEVEL = makeMap(CUSTOMIZATION_LEVEL_VALUES);
export const CUSTOMIZATION_LEVEL_OPTIONS = mapToOptions(CUSTOMIZATION_LEVEL);

const UPGRADE_STRATEGY_VALUES = [
  'ROLLING','BLUE_GREEN','IN_PLACE','CANARY'
] as const; // UpgradeStrategy.java
export const UPGRADE_STRATEGY = makeMap(UPGRADE_STRATEGY_VALUES);
export const UPGRADE_STRATEGY_OPTIONS = mapToOptions(UPGRADE_STRATEGY);

const SCALABILITY_METHOD_VALUES = [
  'VERTICAL','HORIZONTAL','AUTO_SCALING'
] as const; // ScalabilityMethod.java
export const SCALABILITY_METHOD = makeMap(SCALABILITY_METHOD_VALUES);
export const SCALABILITY_METHOD_OPTIONS = mapToOptions(SCALABILITY_METHOD);

const BACKUP_SITE_VALUES = [
  'NONE','WARM','HOT','ACTIVE_ACTIVE'
] as const; // BackupSite.java
export const BACKUP_SITE = makeMap(BACKUP_SITE_VALUES);
export const BACKUP_SITE_OPTIONS = mapToOptions(BACKUP_SITE);

const DATA_ENCRYPTION_AT_REST_VALUES = [
  'NONE','AES256','KMS','CUSTOM'
] as const; // DataEncryptionAtRest.java
export const DATA_ENCRYPTION_AT_REST = makeMap(DATA_ENCRYPTION_AT_REST_VALUES);
export const DATA_ENCRYPTION_AT_REST_OPTIONS = mapToOptions(DATA_ENCRYPTION_AT_REST);

const SSL_TYPE_VALUES = [
  'INTERNAL','PUBLIC','MUTUAL'
] as const; // SSLType.java
export const SSL_TYPE = makeMap(SSL_TYPE_VALUES);
export const SSL_TYPE_OPTIONS = mapToOptions(SSL_TYPE);

/* Language / Framework (adjust to real enums) */
const LANGUAGE_VALUES = [
  'JAVA','PYTHON','JAVASCRIPT','TYPESCRIPT','GO','C_SHARP'
] as const; // Language.java
export const LANGUAGE = makeMap(LANGUAGE_VALUES);
export const LANGUAGE_OPTIONS = mapToOptions(LANGUAGE);

const FRAMEWORK_VALUES = [
  'SPRING_BOOT','REACT','ANGULAR','DOTNET','EXPRESS'
] as const; // Framework.java (if exists separately)
export const FRAMEWORK = makeMap(FRAMEWORK_VALUES);
export const FRAMEWORK_OPTIONS = mapToOptions(FRAMEWORK);

// If LanguageFramework.java combines them, create mapping similarly.

/* ===================== Technology Component ===================== */
const USAGE_VALUES = [
  'RUNTIME','BUILD','TEST','MONITORING','SECURITY'
] as const; // Usage.java (guess)
export const USAGE = makeMap(USAGE_VALUES);
export const USAGE_OPTIONS = mapToOptions(USAGE);

/* ===================== Solution Overview / Review ===================== */
const APPROVAL_STATUS_VALUES = [
  'PENDING','APPROVED','REJECTED'
] as const; // ApprovalStatus.java
export const APPROVAL_STATUS = makeMap(APPROVAL_STATUS_VALUES);
export const APPROVAL_STATUS_OPTIONS = mapToOptions(APPROVAL_STATUS);

const BUSINESS_UNIT_VALUES = [
  'FINANCE','HR','IT','SALES','MARKETING'
] as const; // BusinessUnit.java
export const BUSINESS_UNIT = makeMap(BUSINESS_UNIT_VALUES);
export const BUSINESS_UNIT_OPTIONS = mapToOptions(BUSINESS_UNIT);

const CONCERN_STATUS_VALUES = [
  'OPEN','IN_PROGRESS','RESOLVED','CLOSED'
] as const; // ConcernStatus.java
export const CONCERN_STATUS = makeMap(CONCERN_STATUS_VALUES);
export const CONCERN_STATUS_OPTIONS = mapToOptions(CONCERN_STATUS);

const CONCERN_TYPE_VALUES = [
  'RISK','ISSUE','ACTION','DECISION'
] as const; // ConcernType.java
export const CONCERN_TYPE = makeMap(CONCERN_TYPE_VALUES);
export const CONCERN_TYPE_OPTIONS = mapToOptions(CONCERN_TYPE);

const REVIEW_STATUS_VALUES = [
  'DRAFT','IN_REVIEW','APPROVED','REJECTED'
] as const; // ReviewStatus.java
export const REVIEW_STATUS = makeMap(REVIEW_STATUS_VALUES);
export const REVIEW_STATUS_OPTIONS = mapToOptions(REVIEW_STATUS);

const REVIEW_TYPE_VALUES = [
  'INITIAL','PERIODIC','FINAL'
] as const; // ReviewType.java
export const REVIEW_TYPE = makeMap(REVIEW_TYPE_VALUES);
export const REVIEW_TYPE_OPTIONS = mapToOptions(REVIEW_TYPE);

const SOLUTION_STATUS_VALUES = [
  'ACTIVE','RETIRED','PLANNED'
] as const; // SolutionStatus.java
export const SOLUTION_STATUS = makeMap(SOLUTION_STATUS_VALUES);
export const SOLUTION_STATUS_OPTIONS = mapToOptions(SOLUTION_STATUS);

const DOCUMENT_STATE_VALUES = [
  'DRAFT','SUBMITTED','PUBLISHED','ARCHIVED'
] as const; // DocumentState.java
export const DOCUMENT_STATE = makeMap(DOCUMENT_STATE_VALUES);
export const DOCUMENT_STATE_OPTIONS = mapToOptions(DOCUMENT_STATE);

/* ===================== Utility Exports ===================== */
export {
  makeMap as _makeEnumMap,
  mapToOptions as _enumMapToOptions,
  toLabel as _enumToLabel
};