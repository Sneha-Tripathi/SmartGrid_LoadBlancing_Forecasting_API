import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

describe("useApi", () => {
  let useApi;

  beforeAll(async () => {
    useApi = (await import("../../hooks/useApi")).default;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading true and data null", async () => {
    const apiFunction = vi.fn().mockResolvedValue("data");
    const { result } = renderHook(() => useApi(apiFunction));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should fetch data successfully", async () => {
    const apiFunction = vi.fn().mockResolvedValue("test-data");
    const { result } = renderHook(() => useApi(apiFunction));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe("test-data");
    expect(result.current.error).toBeNull();
    expect(apiFunction).toHaveBeenCalledTimes(1);
  });

  it("should handle errors", async () => {
    const error = new Error("API failed");
    const apiFunction = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useApi(apiFunction));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(error);
  });

  it("should not fetch when disabled", async () => {
    const apiFunction = vi.fn().mockResolvedValue("data");
    const { result } = renderHook(() => useApi(apiFunction, { enabled: false }));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(apiFunction).not.toHaveBeenCalled();
  });

  it("should support initialData option", async () => {
    const apiFunction = vi.fn().mockResolvedValue("fetched");
    const { result } = renderHook(() =>
      useApi(apiFunction, { initialData: "initial" })
    );

    expect(result.current.data).toBe("initial");
  });

  it("should support refresh", async () => {
    const apiFunction = vi.fn()
      .mockResolvedValueOnce("first")
      .mockResolvedValueOnce("second");
    const { result } = renderHook(() => useApi(apiFunction));

    await waitFor(() => {
      expect(result.current.data).toBe("first");
    });

    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.data).toBe("second");
    });
  });

  it("should support setData", async () => {
    const apiFunction = vi.fn().mockResolvedValue("original");
    const { result } = renderHook(() => useApi(apiFunction));

    await waitFor(() => {
      expect(result.current.data).toBe("original");
    });

    await act(() => {
      result.current.setData("updated");
    });

    expect(result.current.data).toBe("updated");
  });

  it("should call onSuccess callback", async () => {
    const onSuccess = vi.fn();
    const apiFunction = vi.fn().mockResolvedValue("data");
    renderHook(() => useApi(apiFunction, { onSuccess }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith("data");
    });
  });

  it("should call onError callback on failure", async () => {
    const onError = vi.fn();
    const error = new Error("fail");
    const apiFunction = vi.fn().mockRejectedValue(error);
    renderHook(() => useApi(apiFunction, { onError }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  it("should handle execute with override function", async () => {
    const apiFunction = vi.fn().mockResolvedValue("original");
    const overrideFn = vi.fn().mockResolvedValue("override");
    const { result } = renderHook(() => useApi(apiFunction));

    await waitFor(() => {
      expect(result.current.data).toBe("original");
    });

    await act(async () => {
      await result.current.execute(overrideFn);
    });

    await waitFor(() => {
      expect(result.current.data).toBe("override");
    });
  });
});
