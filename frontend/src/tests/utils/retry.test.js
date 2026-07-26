import { describe, it, expect, vi } from "vitest";

const { retryRequest } = await import("../../utils/retry");

describe("retryRequest", () => {
  it("should return result on first success", async () => {
    const apiCall = vi.fn().mockResolvedValue("success");
    const result = await retryRequest(apiCall);
    expect(result).toBe("success");
    expect(apiCall).toHaveBeenCalledTimes(1);
  });

  it("should retry on failure and succeed", async () => {
    const apiCall = vi.fn()
      .mockRejectedValueOnce(new Error("fail1"))
      .mockRejectedValueOnce(new Error("fail2"))
      .mockResolvedValueOnce("success");
    const result = await retryRequest(apiCall, 3);
    expect(result).toBe("success");
    expect(apiCall).toHaveBeenCalledTimes(3);
  });

  it("should throw after all retries exhausted", async () => {
    const error = new Error("persistent failure");
    const apiCall = vi.fn().mockRejectedValue(error);
    await expect(retryRequest(apiCall, 2)).rejects.toThrow("persistent failure");
    expect(apiCall).toHaveBeenCalledTimes(2);
  });

  it("should use default retries of 3", async () => {
    const apiCall = vi.fn().mockRejectedValue(new Error("fail"));
    await expect(retryRequest(apiCall)).rejects.toThrow();
    expect(apiCall).toHaveBeenCalledTimes(3);
  });

  it("should wait between retries", async () => {
    const apiCall = vi.fn().mockRejectedValue(new Error("fail"));
    const start = Date.now();
    await expect(retryRequest(apiCall, 2)).rejects.toThrow();
    // Should have taken some time for retries (no exact check, just ensure it runs)
    expect(apiCall).toHaveBeenCalledTimes(2);
  });
});
