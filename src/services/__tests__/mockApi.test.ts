import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockApiService } from "../mockApiUpdated";
import { APIError } from "../../types/errors";

describe("mockApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("getAllSolutionReviews", () => {
    it("returns array of solution reviews", async () => {
      const reviews = await mockApiService.getAllSolutionReviews();

      expect(Array.isArray(reviews)).toBe(true);
      expect(reviews.length).toBeGreaterThan(0);
      expect(reviews[0]).toHaveProperty("id");
      expect(reviews[0]).toHaveProperty("systemCode");
      expect(reviews[0]).toHaveProperty("documentState");
      expect(reviews[0]).toHaveProperty("solutionOverview");
    });

    it("returns different instances (defensive copying)", async () => {
      const reviews1 = await mockApiService.getAllSolutionReviews();
      const reviews2 = await mockApiService.getAllSolutionReviews();

      expect(reviews1).not.toBe(reviews2); // Different references
      expect(reviews1).toEqual(reviews2); // Same content
    });
  });

  describe("getSolutionReviewById", () => {
    it("returns specific solution review by ID", async () => {
      const reviews = await mockApiService.getAllSolutionReviews();
      const firstReview = reviews[0];

      expect(firstReview.id).toBeDefined();
      const review = await mockApiService.getSolutionReviewById(firstReview.id!);

      expect(review).toEqual(expect.objectContaining({
        id: firstReview.id,
        systemCode: firstReview.systemCode,
        documentState: firstReview.documentState
      }));
    });

    it("returns null for non-existent ID", async () => {
      const review = await mockApiService.getSolutionReviewById("non-existent-id");
      expect(review).toBeNull();
    });

    it("throws APIError for invalid ID", async () => {
      await expect(mockApiService.getSolutionReviewById("")).rejects.toThrow(
        APIError
      );

      await expect(
        // @ts-expect-error - Testing invalid input
        mockApiService.getSolutionReviewById(null)
      ).rejects.toThrow(APIError);
    });
  });

  describe("getSystemSolutionReviews", () => {
    it("returns solution reviews for specific system", async () => {
      const systemCode = "sys-001";
      const reviews = await mockApiService.getSystemSolutionReviews(systemCode);

      expect(Array.isArray(reviews)).toBe(true);
      reviews.forEach(review => {
        expect(review.systemCode).toBe(systemCode);
      });
    });

    it("returns empty array for non-existent system", async () => {
      const reviews = await mockApiService.getSystemSolutionReviews("non-existent-system");
      expect(Array.isArray(reviews)).toBe(true);
      expect(reviews.length).toBe(0);
    });
  });

  describe("login", () => {
    it("should return token on successful login", async () => {
      const username = "testuser";
      const role = "admin";

      const result = await mockApiService.login(username, role);

      expect(result).toEqual({ token: role });
      expect(localStorage.getItem("userToken")).toBe(role);
      expect(localStorage.getItem("username")).toBe(username);
    });

    it("should store user session in localStorage", async () => {
      const username = "john.doe";
      const role = "user";

      await mockApiService.login(username, role);

      expect(localStorage.getItem("userToken")).toBe(role);
      expect(localStorage.getItem("username")).toBe(username);
    });

    it("should handle different user roles", async () => {
      const testCases = [
        { username: "admin", role: "admin" },
        { username: "user", role: "user" },
        { username: "viewer", role: "viewer" }
      ];

      for (const testCase of testCases) {
        const result = await mockApiService.login(testCase.username, testCase.role);
        expect(result.token).toBe(testCase.role);
        expect(localStorage.getItem("userToken")).toBe(testCase.role);
        expect(localStorage.getItem("username")).toBe(testCase.username);
      }
    });

    it("should overwrite previous login session", async () => {
      // First login
      await mockApiService.login("user1", "user");
      expect(localStorage.getItem("username")).toBe("user1");
      expect(localStorage.getItem("userToken")).toBe("user");

      // Second login should overwrite
      await mockApiService.login("admin1", "admin");
      expect(localStorage.getItem("username")).toBe("admin1");
      expect(localStorage.getItem("userToken")).toBe("admin");
    });
  });
});
