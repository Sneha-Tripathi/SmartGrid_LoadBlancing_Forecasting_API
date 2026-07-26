import { describe, it, expect, vi } from "vitest";

// Mock the api module
vi.mock("../../services/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from "../../services/api";

describe("authService", () => {
  let authService;

  beforeAll(async () => {
    authService = (await import("../../services/authService")).default;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should call POST /auth/register with correct data", async () => {
      const mockResponse = { data: { id: "USR-1", email: "test@test.com" } };
      api.post.mockResolvedValue(mockResponse);

      const result = await authService.register("Test", "test@test.com", "pass123", "+1-555-0000");

      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        name: "Test",
        email: "test@test.com",
        password: "pass123",
        phone: "+1-555-0000",
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should call register without phone", async () => {
      api.post.mockResolvedValue({ data: {} });
      await authService.register("Test", "test@test.com", "pass123");
      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        name: "Test",
        email: "test@test.com",
        password: "pass123",
        phone: "",
      });
    });
  });

  describe("login", () => {
    it("should call POST /auth/login with credentials", async () => {
      api.post.mockResolvedValue({ data: { access_token: "token" } });
      const result = await authService.login("user@test.com", "password");
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        email: "user@test.com",
        password: "password",
      });
      expect(result.access_token).toBe("token");
    });
  });

  describe("refresh", () => {
    it("should call POST /auth/refresh with token", async () => {
      api.post.mockResolvedValue({ data: { access_token: "new-token" } });
      const result = await authService.refresh("refresh-token");
      expect(api.post).toHaveBeenCalledWith("/auth/refresh", {
        refresh_token: "refresh-token",
      });
      expect(result.access_token).toBe("new-token");
    });
  });

  describe("logout", () => {
    it("should call POST /auth/logout with refresh token", async () => {
      api.post.mockResolvedValue({ data: { message: "Logged out" } });
      const result = await authService.logout("refresh-token");
      expect(api.post).toHaveBeenCalledWith("/auth/logout", {
        refresh_token: "refresh-token",
      });
    });
  });

  describe("getMe", () => {
    it("should call GET /auth/me", async () => {
      api.get.mockResolvedValue({ data: { id: "USR-1", name: "Test" } });
      const result = await authService.getMe();
      expect(api.get).toHaveBeenCalledWith("/auth/me");
      expect(result.name).toBe("Test");
    });
  });

  describe("updateProfile", () => {
    it("should call PUT /auth/profile with data", async () => {
      api.put.mockResolvedValue({ data: { name: "Updated" } });
      const result = await authService.updateProfile({ name: "Updated" });
      expect(api.put).toHaveBeenCalledWith("/auth/profile", { name: "Updated" });
    });
  });

  describe("changePassword", () => {
    it("should call PUT /auth/change-password", async () => {
      api.put.mockResolvedValue({ data: { message: "Password changed" } });
      const result = await authService.changePassword("old", "new");
      expect(api.put).toHaveBeenCalledWith("/auth/change-password", {
        current_password: "old",
        new_password: "new",
      });
    });
  });
});
