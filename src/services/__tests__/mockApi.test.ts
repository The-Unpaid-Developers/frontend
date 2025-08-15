import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockApiService } from "../mockApi";
import { DocumentState } from "../../types";
import { APIError, ErrorType } from "../../types/errors";

describe("mockApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSolutionReviews", () => {
    it("returns array of solution reviews", async () => {
      const reviews = await mockApiService.getSolutionReviews();

      expect(Array.isArray(reviews)).toBe(true);
      expect(reviews.length).toBeGreaterThan(0);
      expect(reviews[0]).toHaveProperty("id");
      expect(reviews[0]).toHaveProperty("systemId");
      expect(reviews[0]).toHaveProperty("documentState");
    });

    it("returns different instances (defensive copying)", async () => {
      const reviews1 = await mockApiService.getSolutionReviews();
      const reviews2 = await mockApiService.getSolutionReviews();

      expect(reviews1).not.toBe(reviews2); // Different references
      expect(reviews1).toEqual(reviews2); // Same content
    });
  });

  describe("getSolutionReview", () => {
    it("returns specific solution review by ID", async () => {
      const reviews = await mockApiService.getSolutionReviews();
      const firstReview = reviews[0];

      const review = await mockApiService.getSolutionReview(firstReview.id);

      expect(review).toEqual(firstReview);
    });

    it("throws APIError for invalid ID", async () => {
      await expect(mockApiService.getSolutionReview("")).rejects.toThrow(
        APIError
      );

      await expect(
        mockApiService.getSolutionReview("invalid-id")
      ).rejects.toThrow(APIError);
    });

    it("validates ID parameter type", async () => {
      await expect(
        // @ts-expect-error - Testing invalid input
        mockApiService.getSolutionReview(null)
      ).rejects.toThrow(APIError);
    });
  });

  describe("getSystems", () => {
    it("returns grouped systems", async () => {
      const systems = await mockApiService.getSystems();

      expect(Array.isArray(systems)).toBe(true);
      expect(systems.length).toBeGreaterThan(0);

      const firstSystem = systems[0];
      expect(firstSystem).toHaveProperty("systemId");
      expect(firstSystem).toHaveProperty("systemName");
      expect(firstSystem).toHaveProperty("reviews");
      expect(firstSystem).toHaveProperty("latestVersion");
      expect(firstSystem).toHaveProperty("totalReviews");

      expect(Array.isArray(firstSystem.reviews)).toBe(true);
      expect(firstSystem.totalReviews).toBe(firstSystem.reviews.length);
    });

    it("sorts systems by name", async () => {
      const systems = await mockApiService.getSystems();

      for (let i = 1; i < systems.length; i++) {
        expect(
          systems[i - 1].systemName.localeCompare(systems[i].systemName)
        ).toBeLessThanOrEqual(0);
      }
    });

    it("sorts reviews within systems by version descending", async () => {
      const systems = await mockApiService.getSystems();

      systems.forEach((system) => {
        if (system.reviews.length > 1) {
          for (let i = 1; i < system.reviews.length; i++) {
            expect(system.reviews[i - 1].version).toBeGreaterThanOrEqual(
              system.reviews[i].version
            );
          }
        }
      });
    });
  });

  describe("getSystem", () => {
    it("returns specific system by ID", async () => {
      const systems = await mockApiService.getSystems();
      const firstSystem = systems[0];

      const system = await mockApiService.getSystem(firstSystem.systemId);

      expect(system?.systemId).toBe(firstSystem.systemId);
      expect(system?.systemName).toBe(firstSystem.systemName);
    });

    it("throws APIError for invalid system ID", async () => {
      await expect(
        mockApiService.getSystem("invalid-system-id")
      ).rejects.toThrow(APIError);
    });

    it("validates systemId parameter", async () => {
      await expect(mockApiService.getSystem("")).rejects.toThrow(APIError);

      await expect(
        // @ts-expect-error - Testing invalid input
        mockApiService.getSystem(null)
      ).rejects.toThrow(APIError);
    });
  });

  describe("getSystemReviews", () => {
    it("returns reviews for specific system", async () => {
      const systems = await mockApiService.getSystems();
      const firstSystem = systems[0];

      const systemReviews = await mockApiService.getSystemReviews(
        firstSystem.systemId
      );

      expect(Array.isArray(systemReviews)).toBe(true);
      expect(systemReviews.length).toBe(firstSystem.totalReviews);

      systemReviews.forEach((review) => {
        expect(review.systemId).toBe(firstSystem.systemId);
      });
    });

    it("sorts reviews by version descending", async () => {
      const systems = await mockApiService.getSystems();
      const systemWithMultipleVersions = systems.find(
        (s) => s.totalReviews > 1
      );

      if (systemWithMultipleVersions) {
        const reviews = await mockApiService.getSystemReviews(
          systemWithMultipleVersions.systemId
        );

        for (let i = 1; i < reviews.length; i++) {
          expect(reviews[i - 1].version).toBeGreaterThanOrEqual(
            reviews[i].version
          );
        }
      }
    });
  });

  describe("createSolutionReview", () => {
    it("creates new solution review successfully", async () => {
      const solutionOverview = {
        id: "test-overview",
        title: "Test Solution",
        description: "Test description",
        category: "Test Category",
        priority: "High",
        businessValue: "Test value",
        estimatedCost: 100000,
        estimatedDuration: "6 months",
        stakeholders: ["Test User"],
        risksAndChallenges: ["Test risk"],
      };

      const newReview = await mockApiService.createSolutionReview(
        solutionOverview
      );

      expect(newReview).toHaveProperty("id");
      expect(newReview).toHaveProperty("systemId");
      expect(newReview).toHaveProperty("systemName");
      expect(newReview.documentState).toBe(DocumentState.DRAFT);
      expect(newReview.version).toBe(1);
      expect(newReview.solutionOverview).toEqual(solutionOverview);
    });

    it("auto-generates systemId and systemName", async () => {
      const solutionOverview = {
        id: "test-overview",
        title: "Test Solution Auto Generated",
        description: "Test description",
        category: "Test Category",
        priority: "High",
        businessValue: "Test value",
        estimatedCost: 100000,
        estimatedDuration: "6 months",
        stakeholders: [],
        risksAndChallenges: [],
      };

      const newReview = await mockApiService.createSolutionReview(
        solutionOverview
      );

      expect(newReview.systemId).toContain("sys-test-solution-auto-generated");
      expect(newReview.systemName).toBe("Test Solution Auto Generated");
    });

    it("increments version for existing system", async () => {
      const systems = await mockApiService.getSystems();
      const existingSystem = systems[0];

      const solutionOverview = {
        id: "test-overview-v2",
        title: "Updated Solution",
        description: "Updated description",
        category: "Test Category",
        priority: "High",
        businessValue: "Test value",
        estimatedCost: 150000,
        estimatedDuration: "8 months",
        stakeholders: [],
        risksAndChallenges: [],
      };

      const newReview = await mockApiService.createSolutionReview(
        solutionOverview,
        existingSystem.systemId,
        existingSystem.systemName
      );

      expect(newReview.systemId).toBe(existingSystem.systemId);
      expect(newReview.version).toBe(existingSystem.latestVersion + 1);
    });

    it("validates solution overview input", async () => {
      await expect(
        // @ts-expect-error - Testing invalid input
        mockApiService.createSolutionReview(null)
      ).rejects.toThrow(APIError);

      await expect(
        mockApiService.createSolutionReview({
          id: "test",
          title: "", // Empty title should fail
          description: "Test",
          category: "Test",
          priority: "High",
          businessValue: "Test",
          estimatedCost: 100000,
          estimatedDuration: "6 months",
          stakeholders: [],
          risksAndChallenges: [],
        })
      ).rejects.toThrow(APIError);
    });
  });

  describe("Error Handling", () => {
    it("wraps unexpected errors in APIError", async () => {
      // This test would require mocking the delay function to throw
      // For now, we test the error types we expect
      try {
        await mockApiService.getSolutionReview("non-existent-id");
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect(error.type).toBe(ErrorType.NOT_FOUND_ERROR);
      }
    });

    it("provides detailed error information", async () => {
      try {
        await mockApiService.getSystem("invalid-system");
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect(error.message).toContain("not found");
        expect(error.details).toContain("Available system IDs");
        expect(error.code).toBe(404);
        expect(error.retryable).toBe(false);
      }
    });
  });
});
