import { DocumentState } from "../types";
import type {
  UpdateSolutionReviewData
} from "../types/solutionReview";
import { APIError, ErrorType } from "../types/errors";

const mockSolutionReview = {
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
                id: "{{solOverviewConcernId}}",
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
            id: "68ab15005ef7c388aef5e368",
            l1Capability: "UNKNOWN",
            l2Capability: "UNKNOWN",
            l3Capability: "UNKNOWN",
            remarks: null
        }
    ],
    systemComponents: [
        {
            id: "68ab14b15ef7c388aef5e366",
            name: "Customer Management Service",
            status: "EXISTING",
            role: "BACK_END",
            hostedOn: "CLOUD",
            hostingRegion: "SINGAPORE",
            solutionType: "BESPOKE",
            languageFramework: {
                language: {
                    name: "JAVA",
                    version: "1.8"
                },
                framework: {
                    name: "SPRING_BOOT",
                    version: "3.2.0"
                }
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
            id: "68ab122c5ef7c388aef5e361",
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
            id: "68ab122c5ef7c388aef5e362",
            componentName: null,
            dataDomain: "Insurance Dept",
            dataClassification: "CONFIDENTIAL",
            dataOwnedBy: "Insurance",
            dataEntities: [
                "CustomerProfile",
                "TransactionHistory",
                "KYCInformation"
            ],
            masteredIn: "MasterDataHub"
        }
    ],technologyComponents: [
        {
            id: "68ab122c5ef7c388aef5e363",
            componentName: null,
            productName: "PostgreSQL",
            productVersion: "15.3",
            usage: "INFRASTRUCTURE"
        }
    ],
    enterpriseTools: [
        {
            id: "68ab122c5ef7c388aef5e364",
            tool: {
                id: "68aae7fcd4b65e5998f9c533",
                name: "Jenkins",
                type: "DEVOPS"
            },
            onboarded: "FALSE",
            integrationDetails: "Integrated with GitHub Actions and Kubernetes pipelines",
            issues: "None"
        }
    ],
    processCompliances: [
        {
            id: "68ab122c5ef7c388aef5e365",
            standardGuideline: "CRYPTOGRAPHY_STANDARDS",
            compliant: "TRUE",
            description: "All cryptographic modules adhere to AES-256 encryption standards."
        }
    ],
    createdAt: "2025-08-24T13:21:46.56",
    lastModifiedAt: "2025-08-24T13:22:52.737031284",
    createdBy: null,
    lastModifiedBy: null
};

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
      return mockSolutionReview;
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
};
