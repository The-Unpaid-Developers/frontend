import { describe, it, expect, beforeEach } from "vitest";
import { login } from "../authApi";

describe("authApi", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("login", () => {
    it("should return token on successful login", async () => {
      const username = "testuser";
      const role = "admin";

      const result = await login(username, role);

      expect(result).toEqual({ token: role });
      expect(localStorage.getItem("userToken")).toBe(role);
      expect(localStorage.getItem("username")).toBe(username);
    });

    it("should store user session in localStorage", async () => {
      const username = "john.doe";
      const role = "user";

      await login(username, role);

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
        const result = await login(testCase.username, testCase.role);
        expect(result.token).toBe(testCase.role);
        expect(localStorage.getItem("userToken")).toBe(testCase.role);
        expect(localStorage.getItem("username")).toBe(testCase.username);
      }
    });

    it("should overwrite previous login session", async () => {
      // First login
      await login("user1", "user");
      expect(localStorage.getItem("username")).toBe("user1");
      expect(localStorage.getItem("userToken")).toBe("user");

      // Second login should overwrite
      await login("admin1", "admin");
      expect(localStorage.getItem("username")).toBe("admin1");
      expect(localStorage.getItem("userToken")).toBe("admin");
    });
  });
});
