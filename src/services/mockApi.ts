import { DocumentState } from "../types";
import type {
  SolutionReview,
  SolutionOverview,
  BusinessCapability,
  SystemComponent,
} from "../types";

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
  {
    id: "1",
    documentState: DocumentState.CURRENT,
    solutionOverview: mockSolutionOverviews[0],
    businessCapabilities: [mockBusinessCapabilities[0]],
    systemComponents: [mockSystemComponents[0]],
    integrationFlows: [],
    dataAssets: [],
    technologyComponents: [],
    enterpriseTools: [],
    processCompliances: [],
    version: 2,
    createdAt: "2024-01-15T10:00:00Z",
    lastModifiedAt: "2024-02-01T14:30:00Z",
    createdBy: "john.doe@company.com",
    lastModifiedBy: "jane.smith@company.com",
  },
  {
    id: "2",
    documentState: DocumentState.SUBMITTED,
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
    id: "3",
    documentState: DocumentState.DRAFT,
    solutionOverview: {
      id: "3",
      title: "Microservices Migration",
      description: "Migration from monolithic architecture to microservices",
      category: "Architecture",
      priority: "Medium",
      businessValue: "Improved scalability and maintainability",
      estimatedCost: 750000,
      estimatedDuration: "18 months",
      stakeholders: ["CTO", "Engineering Manager", "DevOps Lead"],
      risksAndChallenges: [
        "Service decomposition complexity",
        "Data consistency challenges",
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
    createdAt: "2024-02-20T11:00:00Z",
    lastModifiedAt: "2024-02-22T13:20:00Z",
    createdBy: "bob.johnson@company.com",
    lastModifiedBy: "bob.johnson@company.com",
  },
  {
    id: "4",
    documentState: DocumentState.OUTDATED,
    solutionOverview: {
      id: "4",
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

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApiService = {
  // Get all solution reviews
  async getSolutionReviews(): Promise<SolutionReview[]> {
    await delay(500);
    return [...mockData];
  },

  // Get solution review by ID
  async getSolutionReview(id: string): Promise<SolutionReview | null> {
    await delay(300);
    return mockData.find((review) => review.id === id) || null;
  },

  // Create new solution review
  async createSolutionReview(
    solutionOverview: SolutionOverview
  ): Promise<SolutionReview> {
    await delay(800);
    const newReview: SolutionReview = {
      id: (mockData.length + 1).toString(),
      documentState: DocumentState.DRAFT,
      solutionOverview,
      businessCapabilities: [],
      systemComponents: [],
      integrationFlows: [],
      dataAssets: [],
      technologyComponents: [],
      enterpriseTools: [],
      processCompliances: [],
      version: 1,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      createdBy: "current.user@company.com",
      lastModifiedBy: "current.user@company.com",
    };
    mockData.push(newReview);
    return newReview;
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
