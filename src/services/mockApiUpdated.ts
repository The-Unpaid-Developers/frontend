import { DocumentState } from "../types/solutionReview";
import type {
  SolutionReview,
  UpdateSolutionReviewData
} from "../types/solutionReview";
import { APIError, ErrorType } from "../types/errors";

const mockSolutionReview = [
  {
    id: "1",
    systemCode: "sys-001",
    documentState: "DRAFT",
    solutionOverview: {
      id: "1",
      solutionDetails: {
        solutionName: "NextGen Platform",
        projectName: "AlphaLaunch",
        solutionReviewCode: "AWG-2025-001",
        solutionArchitectName: "Jane Doe",
        deliveryProjectManagerName: "John Smith",
        itBusinessPartner: "Alice Johnson"
      },
      reviewedBy: null,
      reviewType: "NEW_BUILD",
      approvalStatus: "PENDING",
      reviewStatus: "DRAFT",
      conditions: null,
      businessUnit: "UNKNOWN",
      businessDriver: "REGULATORY",
      valueOutcome: "test",
      applicationUsers: [],
      concerns: [
        {
          id: "c-1",
            type: "RISK",
            description: "Concern Risk Description",
            impact: "DB is nuked",
            disposition: "AWS manage DBs",
            status: "UNKNOWN"
        }
      ]
    },
    businessCapabilities: [
      {
        id: "bc-1",
        l1Capability: "UNKNOWN",
        l2Capability: "UNKNOWN",
        l3Capability: "UNKNOWN",
        remarks: null
      }
    ],
    systemComponents: [
      {
        id: "sc-1",
        name: "Customer Management Service",
        status: "EXISTING",
        role: "BACK_END",
        hostedOn: "CLOUD",
        hostingRegion: "SINGAPORE",
        solutionType: "BESPOKE",
        languageFramework: {
          language: { name: "JAVA", version: "1.8" },
          framework: { name: "SPRING_BOOT", version: "3.2.0" }
        },
        isOwnedByUs: true,
        isCICDUsed: true,
        customizationLevel: "MAJOR",
        upgradeStrategy: "INTERNAL_LED",
        upgradeFrequency: "QUARTERLY",
        isSubscription: false,
        isInternetFacing: true,
        availabilityRequirement: "HIGH",
        latencyRequirement: 200,
        throughputRequirement: 1500,
        scalabilityMethod: "HORIZONTAL_AUTO",
        backupSite: "CLOUD_MULTI_AZ",
        securityDetails: {
          authenticationMethod: "OAuth2 with SSO",
          authorizationModel: "RBAC",
          isAuditLoggingEnabled: true,
          sensitiveDataElements: "CustomerPII, TransactionData",
          dataEncryptionAtRest: "DATABASE",
          encryptionAlgorithmForDataAtRest: "AES-256",
          hasIpWhitelisting: true,
          ssl: "TLS",
          payloadEncryptionAlgorithm: "RSA-OAEP",
          digitalCertificate: "Let's Encrypt Cert 2025",
          keyStore: "AWS KMS",
          vulnerabilityAssessmentFrequency: "MONTHLY",
          penetrationTestingFrequency: "ANNUALLY"
        }
      }
    ],
    integrationFlows: [
      {
        id: "if-1",
        componentName: null,
        counterpartSystemCode: "CRM-EXT-01",
        counterpartSystemRole: "PRODUCER",
        integrationMethod: "API",
        frequency: "DAILY",
        purpose: "Sync customer profile data with external CRM"
      }
    ],
    dataAssets: [
      {
        id: "da-1",
        componentName: null,
        dataDomain: "Insurance Dept",
        dataClassification: "CONFIDENTIAL",
        dataOwnedBy: "Insurance",
        dataEntities: ["CustomerProfile", "TransactionHistory", "KYCInformation"],
        masteredIn: "MasterDataHub"
      }
    ],
    technologyComponents: [
      {
        id: "tc-1",
        componentName: null,
        productName: "PostgreSQL",
        productVersion: "15.3",
        usage: "INFRASTRUCTURE"
      }
    ],
    enterpriseTools: [
      {
        id: "et-1",
        tool: { id: "tool-jenkins", name: "Jenkins", type: "DEVOPS" },
        onboarded: "FALSE",
        integrationDetails: "Integrated with GitHub Actions and Kubernetes pipelines",
        issues: "None"
      }
    ],
    processCompliances: [
      {
        id: "pc-1",
        standardGuideline: "CRYPTOGRAPHY_STANDARDS",
        compliant: "TRUE",
        description: "All cryptographic modules adhere to AES-256 encryption standards."
      }
    ],
    createdAt: "2025-08-24T13:21:46.560Z",
    lastModifiedAt: "2025-08-24T13:22:52.737Z",
    createdBy: "null",
    lastModifiedBy: "null"
  },

  // --- Additional mock reviews ---

  {
    id: "2",
    systemCode: "sys-002",
    documentState: "DRAFT",
    solutionOverview: {
      id: "2",
      solutionDetails: {
        solutionName: "Payments Orchestrator",
        projectName: "Orion",
        solutionReviewCode: "AWG-2025-002",
        solutionArchitectName: "Emily Stone",
        deliveryProjectManagerName: "Michael Chan",
        itBusinessPartner: "Robert King"
      },
      reviewedBy: null,
      reviewType: "ENHANCEMENT",
      approvalStatus: "PENDING",
      reviewStatus: "DRAFT",
      conditions: null,
      businessUnit: "FINANCE",
      businessDriver: "CUSTOMER_EXPERIENCE",
      valueOutcome: "Faster settlement",
      applicationUsers: ["OpsUserA", "OpsUserB"],
      concerns: []
    },
    businessCapabilities: [
      {
        id: "bc-2",
        l1Capability: "PAYMENTS",
        l2Capability: "SETTLEMENT",
        l3Capability: "RECONCILIATION",
        remarks: "Initial scope"
      }
    ],
    systemComponents: [
      {
        id: "sc-2",
        name: "Payment Gateway",
        status: "NEW",
        role: "BACK_END",
        hostedOn: "CLOUD",
        hostingRegion: "TOKYO",
        solutionType: "BESPOKE",
        languageFramework: {
          language: { name: "JAVA", version: "17" },
          framework: { name: "SPRING_BOOT", version: "3.1.0" }
        },
        isOwnedByUs: true,
        isCICDUsed: true,
        customizationLevel: "MINOR",
        upgradeStrategy: "VENDOR_LED",
        upgradeFrequency: "MONTHLY",
        isSubscription: false,
        isInternetFacing: false,
        availabilityRequirement: "MEDIUM",
        latencyRequirement: 150,
        throughputRequirement: 500,
        scalabilityMethod: "VERTICAL_MANUAL",
        backupSite: "NONE",
        securityDetails: {
          authenticationMethod: "OIDC",
          authorizationModel: "RBAC",
          isAuditLoggingEnabled: true,
          sensitiveDataElements: "CardPAN",
          dataEncryptionAtRest: "FILESYSTEM",
          encryptionAlgorithmForDataAtRest: "AES-256",
          hasIpWhitelisting: false,
          ssl: "TLS",
          payloadEncryptionAlgorithm: "AES-GCM",
          digitalCertificate: "Internal CA",
          keyStore: "Vault",
          vulnerabilityAssessmentFrequency: "QUARTERLY",
          penetrationTestingFrequency: "ANNUALLY"
        }
      }
    ],
    integrationFlows: [
      {
        id: "if-2",
        componentName: "Payment Gateway",
        counterpartSystemCode: "BANK_CORE",
        counterpartSystemRole: "CONSUMER",
        integrationMethod: "QUEUE",
        frequency: "REAL_TIME",
        purpose: "Real-time authorization"
      }
    ],
    dataAssets: [
      {
        id: "da-2",
        componentName: "Payment Gateway",
        dataDomain: "Finance",
        dataClassification: "HIGHLY_CONFIDENTIAL",
        dataOwnedBy: "Finance",
        dataEntities: ["PaymentTransaction", "SettlementBatch"],
        masteredIn: "CoreBanking"
      }
    ],
    technologyComponents: [
      {
        id: "tc-2",
        componentName: "Payment Gateway",
        productName: "Redis",
        productVersion: "7.0",
        usage: "CACHING"
      }
    ],
    enterpriseTools: [
      {
        id: "et-2",
        tool: { id: "tool-sonarqube", name: "SonarQube", type: "DEVOPS" },
        onboarded: "TRUE",
        integrationDetails: "Quality gates in CI",
        issues: "Coverage fluctuations"
      }
    ],
    processCompliances: [
      {
        id: "pc-2",
        standardGuideline: "SECURE_CODING",
        compliant: "PARTIAL",
        description: "Some legacy libs pending upgrade."
      }
    ],
    createdAt: "2025-08-25T10:00:00.000Z",
    lastModifiedAt: "2025-08-25T11:30:00.000Z",
    createdBy: "userA",
    lastModifiedBy: "userA"
  },

  {
    id: "3",
    systemCode: "sys-003",
    documentState: "REVIEW",
    solutionOverview: {
      id: "3",
      solutionDetails: {
        solutionName: "Claims Portal",
        projectName: "Mercury",
        solutionReviewCode: "AWG-2025-003",
        solutionArchitectName: "Kevin Wright",
        deliveryProjectManagerName: "Sara Lim",
        itBusinessPartner: "Derek Tan"
      },
      reviewedBy: "archLead",
      reviewType: "MIGRATION",
      approvalStatus: "UNDER_REVIEW",
      reviewStatus: "IN_REVIEW",
      conditions: null,
      businessUnit: "OPERATIONS",
      businessDriver: "COST_OPTIMIZATION",
      valueOutcome: "Lower infra spend",
      applicationUsers: ["ClaimsUser1"],
      concerns: []
    },
    businessCapabilities: [],
    systemComponents: [],
    integrationFlows: [],
    dataAssets: [],
    technologyComponents: [],
    enterpriseTools: [],
    processCompliances: [],
    createdAt: "2025-08-26T09:05:00.000Z",
    lastModifiedAt: "2025-08-26T12:10:00.000Z",
    createdBy: "userB",
    lastModifiedBy: "userB"
  },

  {
    id: "4",
    systemCode: "sys-004",
    documentState: "APPROVED",
    solutionOverview: {
      id: "4",
      solutionDetails: {
        solutionName: "Analytics Lake",
        projectName: "Poseidon",
        solutionReviewCode: "AWG-2025-004",
        solutionArchitectName: "Laura Chen",
        deliveryProjectManagerName: "Mark Tan",
        itBusinessPartner: "Olivia Kee"
      },
      reviewedBy: "chiefArch",
      reviewType: "NEW_BUILD",
      approvalStatus: "APPROVED",
      reviewStatus: "APPROVED",
      conditions: "Maintain cost under budget",
      businessUnit: "DATA",
      businessDriver: "INSIGHTS",
      valueOutcome: "Faster BI",
      applicationUsers: ["DataScientistA", "AnalystB"],
      concerns: []
    },
    businessCapabilities: [
      { id: "bc-4", l1Capability: "DATA", l2Capability: "INGESTION", l3Capability: "STREAMING", remarks: "Kafka pipeline" }
    ],
    systemComponents: [
      {
        id: "sc-4",
        name: "Ingestion Service",
        status: "NEW",
        role: "BACK_END",
        hostedOn: "CLOUD",
        hostingRegion: "FRANKFURT",
        solutionType: "BESPOKE",
        languageFramework: {
          language: { name: "PYTHON", version: "3.11" },
          framework: { name: "FASTAPI", version: "0.110" }
        },
        isOwnedByUs: true,
        isCICDUsed: true,
        customizationLevel: "NONE",
        upgradeStrategy: "INTERNAL_LED",
        upgradeFrequency: "MONTHLY",
        isSubscription: false,
        isInternetFacing: false,
        availabilityRequirement: "HIGH",
        latencyRequirement: 120,
        throughputRequirement: 10000,
        scalabilityMethod: "HORIZONTAL_AUTO",
        backupSite: "CLOUD_MULTI_AZ",
        securityDetails: {
          authenticationMethod: "OIDC",
          authorizationModel: "ABAC",
          isAuditLoggingEnabled: true,
          sensitiveDataElements: "TelemetryStreams",
          dataEncryptionAtRest: "FILESYSTEM",
          encryptionAlgorithmForDataAtRest: "AES-256",
          hasIpWhitelisting: false,
          ssl: "TLS",
          payloadEncryptionAlgorithm: "AES-GCM",
          digitalCertificate: "Managed Cert",
          keyStore: "AWS KMS",
          vulnerabilityAssessmentFrequency: "MONTHLY",
          penetrationTestingFrequency: "ANNUALLY"
        }
      }
    ],
    integrationFlows: [],
    dataAssets: [
      {
        id: "da-4",
        componentName: "Ingestion Service",
        dataDomain: "Analytics",
        dataClassification: "INTERNAL",
        dataOwnedBy: "DataOps",
        dataEntities: ["EventStream", "IngestLog"],
        masteredIn: "DataLakeHouse"
      }
    ],
    technologyComponents: [
      {
        id: "tc-4",
        componentName: "Ingestion Service",
        productName: "Kafka",
        productVersion: "3.6",
        usage: "INTEGRATION"
      }
    ],
    enterpriseTools: [],
    processCompliances: [],
    createdAt: "2025-08-27T08:00:00.000Z",
    lastModifiedAt: "2025-08-27T10:15:00.000Z",
    createdBy: "userC",
    lastModifiedBy: "userC"
  },

  {
    id: "5",
    systemCode: "sys-005",
    documentState: "DRAFT",
    solutionOverview: {
      id: "5",
      solutionDetails: {
        solutionName: "Identity Hub",
        projectName: "Aegis",
        solutionReviewCode: "AWG-2025-005",
        solutionArchitectName: "Victor Ng",
        deliveryProjectManagerName: "Hazel Wong",
        itBusinessPartner: "Ian Lee"
      },
      reviewedBy: null,
      reviewType: "REFACTOR",
      approvalStatus: "PENDING",
      reviewStatus: "DRAFT",
      conditions: null,
      businessUnit: "SECURITY",
      businessDriver: "RISK_REDUCTION",
      valueOutcome: "Unified auth",
      applicationUsers: ["SecUser1"],
      concerns: [
        {
          id: "c-5",
          type: "RISK",
          description: "Legacy token format",
          impact: "Integration friction",
          disposition: "Phase-out plan",
          status: "OPEN"
        }
      ]
    },
    businessCapabilities: [],
    systemComponents: [],
    integrationFlows: [],
    dataAssets: [],
    technologyComponents: [],
    enterpriseTools: [],
    processCompliances: [],
    createdAt: "2025-08-28T09:30:00.000Z",
    lastModifiedAt: "2025-08-28T09:30:00.000Z",
    createdBy: "userD",
    lastModifiedBy: "userD"
  }
];

/**
 * Simulates API network delay with optional failure simulation
 * @param ms - Delay in milliseconds
 * @param failureRate - Probability of simulated failure (0-1), default 0
 * @returns Promise that resolves after delay or rejects on simulated failure
 */
const delay = (ms: number, failureRate: number = 0): Promise<void> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random API failures for testing
      if (failureRate > 0 && Math.random() < failureRate) {
        reject(
          new APIError(
            ErrorType.SERVER_ERROR,
            "Simulated server error for testing",
            "Mock API failure simulation",
            500,
            true
          )
        );
        return;
      }
      resolve();
    }, ms);
  });

export const mockApiService = {
  /**
   * Retrieves a specific solution review by its ID
   * @param id - The unique identifier of the solution review
   * @returns Promise that resolves to the solution review or null if not found
   * @throws {APIError} When the ID is invalid or API call fails
   */
  async getSolutionReviewById(id: string): Promise<UpdateSolutionReviewData | null> {
    console.log('in');
    try {
      if (!id || typeof id !== "string") {
        throw new APIError(
          ErrorType.VALIDATION_ERROR,
          "Invalid solution review ID provided",
          `Expected non-empty string, received: ${typeof id}`,
          400,
          false
        );
      }

      // await delay(300);
      return mockSolutionReview.find(review => review.id === id) ?? null;
    } catch (error) {
      throw error instanceof APIError
        ? error
        : new APIError(
            ErrorType.SERVER_ERROR,
            "Failed to fetch solution review",
            error instanceof Error ? error.message : String(error),
            500,
            true
          );
    }
  },
   async getAllSolutionReviews(): Promise<SolutionReview[]> {
    return [...mockSolutionReview];
  },

  async getSystemSolutionReviews(systemCode: string): Promise<SolutionReview[]> {
    return [...mockSolutionReview.filter(review => review.systemCode===systemCode)];
  },

  async login(username: string, role: string): Promise<{ token: string }> {
    localStorage.setItem("userToken", role);
    localStorage.setItem("username", username);
    return { token: role };
  },
}
