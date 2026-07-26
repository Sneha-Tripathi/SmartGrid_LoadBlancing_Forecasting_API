import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

import api from "../../services/api";

describe("useHealthCheck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true when backend is online", async () => {
    api.get.mockResolvedValue({ status: 200 });

    const useHealthCheck = (await import("../../hooks/useHealthCheck")).default;
    const { result } = renderHook(() => useHealthCheck());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(api.get).toHaveBeenCalledWith("/");
  });

  it("should return false when backend is offline", async () => {
    api.get.mockRejectedValue(new Error("Network error"));

    const useHealthCheck = (await import("../../hooks/useHealthCheck")).default;
    const { result } = renderHook(() => useHealthCheck());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("should call api.get on mount", async () => {
    api.get.mockResolvedValue({ status: 200 });

    const useHealthCheck = (await import("../../hooks/useHealthCheck")).default;
    renderHook(() => useHealthCheck());

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/");
    });
  });

  it("should set up health check interval", async () => {
    const setIntervalSpy = vi.spyOn(window, "setInterval");
    api.get.mockResolvedValue({ status: 200 });

    const useHealthCheck = (await import("../../hooks/useHealthCheck")).default;
    renderHook(() => useHealthCheck());

    await waitFor(() => {
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
    });

    setIntervalSpy.mockRestore();
  });
});
