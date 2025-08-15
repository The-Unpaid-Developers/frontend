import { DocumentState } from "../types";
import type {
  SolutionReview,
  SolutionOverview,
  BusinessCapability,
  SystemComponent,
  SystemGroup,
} from "../types";
import { APIError, ErrorType } from "../types/errors";

// Mock data
const mockSolutionOverviews: SolutionOverview[] = [
  {
    id: "1",
    title: "Customer Data Platform Implementation",
    description:
      "Implementation of a unified customer data platform to consolidate customer information across all touchpoints",
    category: "Data Management",
    priority: "High",
    businessValue:
      "Improved customer insights and personalization capabilities",
    estimatedCost: 500000,
    estimatedDuration: "12 months",
    stakeholders: ["CTO", "VP Marketing", "Data Team Lead"],
    risksAndChallenges: [
      "Data quality issues",
      "Legacy system integration complexity",
      "Change management",
    ],
  },
  {
    id: "2",
    title: "API Gateway Modernization",
    description:
      "Modernize existing API infrastructure with new gateway solution",
    category: "Infrastructure",
    priority: "Medium",
    businessValue: "Improved API performance and security",
    estimatedCost: 250000,
    estimatedDuration: "6 months",
    stakeholders: ["CTO", "API Team Lead", "Security Team"],
    risksAndChallenges: [
      "Service downtime during migration",
      "Third-party integration updates",
    ],
  },
];

const mockBusinessCapabilities: BusinessCapability[] = [
  {
    id: "1",
    name: "Customer Relationship Management",
    description: "Manage customer interactions and relationships",
    domain: "Customer",
    maturityLevel: "Optimizing",
    strategicImportance: "High",
  },
  {
    id: "2",
    name: "Order Management",
    description: "Process and fulfill customer orders",
    domain: "Operations",
    maturityLevel: "Defined",
    strategicImportance: "High",
  },
];

const mockSystemComponents: SystemComponent[] = [
  {
    id: "1",
    name: "Salesforce CRM",
    type: "SaaS Application",
    description: "Customer relationship management system",
    vendor: "Salesforce",
    version: "Spring 24",
    platform: "Cloud",
    status: "Active",
  },
  {
    id: "2",
    name: "Oracle Database",
    type: "Database",
    description: "Primary transactional database",
    vendor: "Oracle",
    version: "19c",
    platform: "On-Premise",
    status: "Active",
  },
];

const generateMockSolutionReviews = (): SolutionReview[] => [
  // Customer Data Platform System - Multiple versions
  {
    id: "1",
    systemId: "sys-cdp-001",
    systemName: "Customer Data Platform",
    documentState: DocumentState.OUTDATED,
    solutionOverview: {
      ...mockSolutionOverviews[0],
      title: "Customer Data Platform Implementation v1",
    },
    businessCapabilities: [mockBusinessCapabilities[0]],
    systemComponents: [mockSystemComponents[0]],
    integrationFlows: [],
    dataAssets: [],
    technologyComponents: [],
    enterpriseTools: [],
    processCompliances: [],
    version: 1,
    createdAt: "2024-01-15T10:00:00Z",
    lastModifiedAt: "2024-01-30T14:30:00Z",
    createdBy: "john.doe@company.com",
    lastModifiedBy: "jane.smith@company.com",
  },
  {
    id: "2",
    systemId: "sys-cdp-001",
    systemName: "Customer Data Platform",
    documentState: DocumentState.CURRENT,
    solutionOverview: {
      ...mockSolutionOverviews[0],
      title: "Customer Data Platform Implementation v2",
      description:
        "Enhanced implementation with real-time analytics and improved data quality controls",
      estimatedCost: 650000,
    },
    businessCapabilities: [mockBusinessCapabilities[0]],
    systemComponents: [mockSystemComponents[0]],
    integrationFlows: [],
    dataAssets: [],
    technologyComponents: [],
    enterpriseTools: [],
    processCompliances: [],
    version: 2,
    createdAt: "2024-02-01T10:00:00Z",
    lastModifiedAt: "2024-02-15T14:30:00Z",
    createdBy: "john.doe@company.com",
    lastModifiedBy: "jane.smith@company.com",
  },
  {
    id: "3",
    systemId: "sys-cdp-001",
    systemName: "Customer Data Platform",
    documentState: DocumentState.DRAFT,
    solutionOverview: {
      ...mockSolutionOverviews[0],
      title: "Customer Data Platform Implementation v3",
      description:
        "Next generation platform with AI/ML capabilities and advanced segmentation",
      estimatedCost: 800000,
      estimatedDuration: "15 months",
    },
    businessCapabilities: [mockBusinessCapabilities[0]],
    systemComponents: [mockSystemComponents[0]],
    integrationFlows: [],
    dataAssets: [],
    technologyComponents: [],
    enterpriseTools: [],
    processCompliances: [],
    version: 3,
    createdAt: "2024-02-20T11:00:00Z",
    lastModifiedAt: "2024-02-22T13:20:00Z",
    createdBy: "john.doe@company.com",
    lastModifiedBy: "john.doe@company.com",
  },

  // API Gateway System - Multiple versions
  {
    id: "4",
    systemId: "sys-api-gw-002",
    systemName: "API Gateway Infrastructure",
    documentState: DocumentState.CURRENT,
    solutionOverview: mockSolutionOverviews[1],
    businessCapabilities: [mockBusinessCapabilities[1]],
    systemComponents: [mockSystemComponents[1]],
    integrationFlows: [],
    dataAssets: [],
    technologyComponents: [],
    enterpriseTools: [],
    processCompliances: [],
    version: 1,
    createdAt: "2024-02-10T09:15:00Z",
    lastModifiedAt: "2024-02-12T16:45:00Z",
    createdBy: "alice.wilson@company.com",
    lastModifiedBy: "alice.wilson@company.com",
  },
  {
    id: "5",
    systemId: "sys-api-gw-002",
    systemName: "API Gateway Infrastructure",
    documentState: DocumentState.SUBMITTED,
    solutionOverview: {
      ...mockSolutionOverviews[1],
      title: "API Gateway Modernization v2",
      description:
        "Enhanced API gateway with advanced security, rate limiting, and microservices mesh integration",
      estimatedCost: 350000,
      estimatedDuration: "8 months",
    },
    businessCapabilities: [mockBusinessCapabilities[1]],
    systemComponents: [mockSystemComponents[1]],
    integrationFlows: [],
    dataAssets: [],
    technologyComponents: [],
    enterpriseTools: [],
    processCompliances: [],
    version: 2,
    createdAt: "2024-02-25T09:15:00Z",
    lastModifiedAt: "2024-02-28T16:45:00Z",
    createdBy: "alice.wilson@company.com",
    lastModifiedBy: "alice.wilson@company.com",
  },

  // E-commerce Platform System
  {
    id: "6",
    systemId: "sys-ecom-003",
    systemName: "E-commerce Platform",
    documentState: DocumentState.DRAFT,
    solutionOverview: {
      id: "6",
      title: "Next-Gen E-commerce Platform",
      description:
        "Modern e-commerce platform with headless architecture and omnichannel capabilities",
      category: "Customer Experience",
      priority: "High",
      businessValue:
        "Enhanced customer experience and increased conversion rates",
      estimatedCost: 1200000,
      estimatedDuration: "24 months",
      stakeholders: ["CPO", "CTO", "Marketing Director", "UX Lead"],
      risksAndChallenges: [
        "Legacy system integration complexity",
        "Data migration challenges",
        "Multi-channel consistency",
      ],
    },
    businessCapabilities: [],
    systemComponents: [],
    integrationFlows: [],
    dataAssets: [],
    technologyComponents: [],
    enterpriseTools: [],
    processCompliances: [],
    version: 1,
    createdAt: "2024-03-01T11:00:00Z",
    lastModifiedAt: "2024-03-05T13:20:00Z",
    createdBy: "mike.chen@company.com",
    lastModifiedBy: "mike.chen@company.com",
  },

  // Legacy Mainframe Retirement
  {
    id: "7",
    systemId: "sys-legacy-004",
    systemName: "Legacy Mainframe Systems",
    documentState: DocumentState.OUTDATED,
    solutionOverview: {
      id: "7",
      title: "Legacy System Retirement",
      description: "Retirement of legacy mainframe systems",
      category: "Modernization",
      priority: "Low",
      businessValue: "Reduced maintenance costs",
      estimatedCost: 300000,
      estimatedDuration: "9 months",
      stakeholders: ["CTO", "Operations Manager"],
      risksAndChallenges: [
        "Data migration complexity",
        "Business continuity risks",
      ],
    },
    businessCapabilities: [],
    systemComponents: [],
    integrationFlows: [],
    dataAssets: [],
    technologyComponents: [],
    enterpriseTools: [],
    processCompliances: [],
    version: 1,
    createdAt: "2023-12-01T08:00:00Z",
    lastModifiedAt: "2024-01-15T10:00:00Z",
    createdBy: "carol.brown@company.com",
    lastModifiedBy: "carol.brown@company.com",
  },
];

// eslint-disable-next-line prefer-const
let mockData = generateMockSolutionReviews();

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

/**
 * Validates that a solution review ID exists in the mock data
 * @param id - The solution review ID to validate
 * @throws {APIError} When the review is not found
 */
const validateReviewExists = (id: string): void => {
  const exists = mockData.some((review) => review.id === id);
  if (!exists) {
    throw new APIError(
      ErrorType.NOT_FOUND_ERROR,
      `Solution review with ID '${id}' not found`,
      `Available IDs: ${mockData.map((r) => r.id).join(", ")}`,
      404,
      false
    );
  }
};

/**
 * Validates that a system ID exists in the mock data
 * @param systemId - The system ID to validate
 * @throws {APIError} When the system is not found
 */
const validateSystemExists = (systemId: string): void => {
  const exists = mockData.some((review) => review.systemId === systemId);
  if (!exists) {
    const availableSystems = [...new Set(mockData.map((r) => r.systemId))];
    throw new APIError(
      ErrorType.NOT_FOUND_ERROR,
      `System with ID '${systemId}' not found`,
      `Available system IDs: ${availableSystems.join(", ")}`,
      404,
      false
    );
  }
};

/**
 * Groups solution reviews by their system ID and creates SystemGroup objects
 * @param reviews - Array of solution reviews to group
 * @returns Array of SystemGroup objects sorted by system name
 */
const groupReviewsBySystem = (reviews: SolutionReview[]): SystemGroup[] => {
  const systemMap = new Map<string, SystemGroup>();

  reviews.forEach((review) => {
    if (!systemMap.has(review.systemId)) {
      systemMap.set(review.systemId, {
        systemId: review.systemId,
        systemName: review.systemName,
        description: review.solutionOverview?.description || "",
        category: review.solutionOverview?.category || "",
        reviews: [],
        latestVersion: 0,
        totalReviews: 0,
      });
    }

    const systemGroup = systemMap.get(review.systemId)!;
    systemGroup.reviews.push(review);
    systemGroup.latestVersion = Math.max(
      systemGroup.latestVersion,
      review.version
    );
    systemGroup.totalReviews = systemGroup.reviews.length;

    // Set current review (highest version with CURRENT state, or latest version)
    if (review.documentState === DocumentState.CURRENT) {
      systemGroup.currentReview = review;
    } else if (
      !systemGroup.currentReview &&
      review.version === systemGroup.latestVersion
    ) {
      systemGroup.currentReview = review;
    }
  });

  // Sort reviews within each system by version (descending)
  systemMap.forEach((systemGroup) => {
    systemGroup.reviews.sort((a, b) => b.version - a.version);
  });

  return Array.from(systemMap.values()).sort((a, b) =>
    a.systemName.localeCompare(b.systemName)
  );
};

export const mockApiService = {
  /**
   * Retrieves all solution reviews from the mock data store
   * @returns Promise that resolves to an array of all solution reviews
   * @throws {APIError} When the API call fails
   */
  async getSolutionReviews(): Promise<SolutionReview[]> {
    try {
      await delay(500);
      return [...mockData];
    } catch (error) {
      throw error instanceof APIError
        ? error
        : new APIError(
            ErrorType.SERVER_ERROR,
            "Failed to fetch solution reviews",
            error instanceof Error ? error.message : String(error),
            500,
            true
          );
    }
  },

  /**
   * Retrieves a specific solution review by its ID
   * @param id - The unique identifier of the solution review
   * @returns Promise that resolves to the solution review or null if not found
   * @throws {APIError} When the ID is invalid or API call fails
   */
  async getSolutionReview(id: string): Promise<SolutionReview | null> {
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

      await delay(300);
      validateReviewExists(id);
      return mockData.find((review) => review.id === id) || null;
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

  /**
   * Retrieves all systems with their associated reviews grouped together
   * @returns Promise that resolves to an array of SystemGroup objects
   * @throws {APIError} When the API call fails
   */
  async getSystems(): Promise<SystemGroup[]> {
    try {
      await delay(400);
      return groupReviewsBySystem([...mockData]);
    } catch (error) {
      throw error instanceof APIError
        ? error
        : new APIError(
            ErrorType.SERVER_ERROR,
            "Failed to fetch systems",
            error instanceof Error ? error.message : String(error),
            500,
            true
          );
    }
  },

  /**
   * Retrieves a specific system with all its review versions
   * @param systemId - The unique identifier of the system
   * @returns Promise that resolves to the SystemGroup or null if not found
   * @throws {APIError} When the system ID is invalid or API call fails
   */
  async getSystem(systemId: string): Promise<SystemGroup | null> {
    try {
      if (!systemId || typeof systemId !== "string") {
        throw new APIError(
          ErrorType.VALIDATION_ERROR,
          "Invalid system ID provided",
          `Expected non-empty string, received: ${typeof systemId}`,
          400,
          false
        );
      }

      await delay(300);
      validateSystemExists(systemId);

      const systemReviews = mockData.filter(
        (review) => review.systemId === systemId
      );

      const systems = groupReviewsBySystem(systemReviews);
      return systems[0] || null;
    } catch (error) {
      throw error instanceof APIError
        ? error
        : new APIError(
            ErrorType.SERVER_ERROR,
            "Failed to fetch system",
            error instanceof Error ? error.message : String(error),
            500,
            true
          );
    }
  },

  /**
   * Retrieves all reviews for a specific system, sorted by version (newest first)
   * @param systemId - The unique identifier of the system
   * @returns Promise that resolves to an array of solution reviews for the system
   * @throws {APIError} When the system ID is invalid or API call fails
   */
  async getSystemReviews(systemId: string): Promise<SolutionReview[]> {
    try {
      if (!systemId || typeof systemId !== "string") {
        throw new APIError(
          ErrorType.VALIDATION_ERROR,
          "Invalid system ID provided",
          `Expected non-empty string, received: ${typeof systemId}`,
          400,
          false
        );
      }

      await delay(300);
      validateSystemExists(systemId);

      return mockData
        .filter((review) => review.systemId === systemId)
        .sort((a, b) => b.version - a.version);
    } catch (error) {
      throw error instanceof APIError
        ? error
        : new APIError(
            ErrorType.SERVER_ERROR,
            "Failed to fetch system reviews",
            error instanceof Error ? error.message : String(error),
            500,
            true
          );
    }
  },

  /**
   * Creates a new solution review with optional system association
   * @param solutionOverview - The solution overview data for the new review
   * @param systemId - Optional existing system ID to associate with
   * @param systemName - Optional system name (used if systemId not provided)
   * @returns Promise that resolves to the created solution review
   * @throws {APIError} When validation fails or creation encounters an error
   */
  async createSolutionReview(
    solutionOverview: SolutionOverview,
    systemId?: string,
    systemName?: string
  ): Promise<SolutionReview> {
    try {
      // Validate input
      if (!solutionOverview || typeof solutionOverview !== "object") {
        throw new APIError(
          ErrorType.VALIDATION_ERROR,
          "Invalid solution overview provided",
          "Expected a valid SolutionOverview object",
          400,
          false
        );
      }

      if (!solutionOverview.title || !solutionOverview.title.trim()) {
        throw new APIError(
          ErrorType.VALIDATION_ERROR,
          "Solution title is required",
          "title field cannot be empty",
          400,
          false
        );
      }

      await delay(800);

      // Generate system info if not provided
      const finalSystemId =
        systemId ||
        `sys-${solutionOverview.title
          .toLowerCase()
          .replace(/\s+/g, "-")}-${Date.now()}`;
      const finalSystemName = systemName || solutionOverview.title;

      // Check if this is a new version of an existing system
      const existingSystemReviews = mockData.filter(
        (review) => review.systemId === finalSystemId
      );
      const nextVersion =
        existingSystemReviews.length > 0
          ? Math.max(...existingSystemReviews.map((r) => r.version)) + 1
          : 1;

      const newReview: SolutionReview = {
        id: (mockData.length + 1).toString(),
        systemId: finalSystemId,
        systemName: finalSystemName,
        documentState: DocumentState.DRAFT,
        solutionOverview,
        businessCapabilities: [],
        systemComponents: [],
        integrationFlows: [],
        dataAssets: [],
        technologyComponents: [],
        enterpriseTools: [],
        processCompliances: [],
        version: nextVersion,
        createdAt: new Date().toISOString(),
        lastModifiedAt: new Date().toISOString(),
        createdBy: "current.user@company.com",
        lastModifiedBy: "current.user@company.com",
      };

      mockData.push(newReview);
      return newReview;
    } catch (error) {
      throw error instanceof APIError
        ? error
        : new APIError(
            ErrorType.SERVER_ERROR,
            "Failed to create solution review",
            error instanceof Error ? error.message : String(error),
            500,
            true
          );
    }
  },

  // Update solution review
  async updateSolutionReview(
    id: string,
    updates: Partial<SolutionReview>
  ): Promise<SolutionReview | null> {
    await delay(600);
    const index = mockData.findIndex((review) => review.id === id);
    if (index === -1) return null;

    mockData[index] = {
      ...mockData[index],
      ...updates,
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: "current.user@company.com",
    };
    return mockData[index];
  },

  // Delete solution review
  async deleteSolutionReview(id: string): Promise<boolean> {
    await delay(400);
    const index = mockData.findIndex((review) => review.id === id);
    if (index === -1) return false;

    mockData.splice(index, 1);
    return true;
  },

  // Transition document state
  async transitionDocumentState(
    id: string,
    newState: DocumentState
  ): Promise<SolutionReview | null> {
    await delay(500);
    const review = mockData.find((r) => r.id === id);
    if (!review) return null;

    // Simple state transition logic (in real app, this would validate transitions)
    review.documentState = newState;
    review.lastModifiedAt = new Date().toISOString();
    review.lastModifiedBy = "current.user@company.com";

    return review;
  },
};
